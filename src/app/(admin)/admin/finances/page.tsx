'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DONATION_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/constants';
import type { Donation, Expense, Candidate } from '@/lib/types';
import { 
  Wallet, 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Calendar, 
  ArrowRight,
  Shield,
  FileText,
  AlertCircle,
  ExternalLink,
  Users
} from 'lucide-react';

export default function AdminFinancesPage() {
  // Lists state
  const [donations, setDonations] = useState<Donation[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  
  // UX states
  const [activeTab, setActiveTab] = useState<'donations' | 'expenses'>('donations');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Forms state
  const [donationForm, setDonationForm] = useState({
    amount: '',
    category: DONATION_CATEGORIES[0] as string,
    donor_name: '',
    is_anonymous: false,
    tx_ref: '',
  });

  const [expenseForm, setExpenseForm] = useState({
    candidate_id: '',
    item_name: '',
    category: EXPENSE_CATEGORIES[0] as string,
    amount: '',
    receipt_ref: '',
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const triggerNotification = (type: 'success' | 'error', text: string) => {
    if (type === 'success') {
      setSuccessMsg(text);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(text);
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  const loadLedgerData = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        // Fetch candidates for linking
        const { data: candData } = await supabase
          .from('candidates')
          .select('id, name, alias')
          .order('name', { ascending: true });
        setCandidates((candData as Candidate[]) || []);

        // Fetch donations
        const { data: donData, error: donErr } = await supabase
          .from('donations')
          .select('*')
          .order('created_at', { ascending: false });
        if (donErr) throw donErr;
        setDonations((donData as Donation[]) || []);

        // Fetch expenses
        const { data: expData, error: expErr } = await supabase
          .from('expenses')
          .select(`
            *,
            candidate:candidate_id (
              alias
            )
          `)
          .order('created_at', { ascending: false });
        if (expErr) throw expErr;
        setExpenses(expData || []);
      } else {
        // Sandbox mock loader
        const storedCandidates = localStorage.getItem('sr_candidates');
        setCandidates(storedCandidates ? JSON.parse(storedCandidates) : []);

        const storedDonations = localStorage.getItem('sr_donations');
        setDonations(storedDonations ? JSON.parse(storedDonations) : []);

        const storedExpenses = localStorage.getItem('sr_expenses');
        const expList = storedExpenses ? JSON.parse(storedExpenses) : [];
        const catalogCandidates = storedCandidates ? JSON.parse(storedCandidates) : [];
        const joined = expList.map((e: any) => {
          const cand = catalogCandidates.find((c: any) => c.id === e.candidate_id);
          return {
            ...e,
            candidate: cand ? { alias: cand.alias } : null
          };
        });
        setExpenses(joined);
      }
    } catch (err) {
      console.error('Error loading ledger data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedgerData();
  }, []);

  const uploadReceipt = async (file: File): Promise<string | null> => {
    if (!isSupabaseConfigured) return '/images/receipt-placeholder.png';
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // Submit Donation
  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg(null);

    const ref = donationForm.tx_ref.trim() || 'TXN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const payload = {
      amount: Number(donationForm.amount) || 0,
      category: donationForm.category,
      donor_name: donationForm.donor_name.trim() || 'Anonymous Sponsor',
      is_anonymous: donationForm.is_anonymous,
      tx_ref: ref,
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('donations').insert([payload]);
        if (error) throw error;
      } else {
        const stored = localStorage.getItem('sr_donations') || '[]';
        const list = JSON.parse(stored);
        list.unshift({
          ...payload,
          id: Math.random().toString(36).substring(2, 15),
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('sr_donations', JSON.stringify(list));
      }

      triggerNotification('success', `Donation of ₹${payload.amount} logged.`);
      setDonationForm({ amount: '', category: DONATION_CATEGORIES[0], donor_name: '', is_anonymous: false, tx_ref: '' });
      await loadLedgerData();
    } catch (err: unknown) {
      triggerNotification('error', err instanceof Error ? err.message : 'Error logging donation.');
    } finally {
      setActionLoading(false);
    }
  };

  // Submit Expense
  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg(null);

    try {
      let receiptUrl: string | null = null;
      if (receiptFile) {
        receiptUrl = await uploadReceipt(receiptFile);
      }

      const ref = expenseForm.receipt_ref.trim() || 'REC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const payload = {
        candidate_id: expenseForm.candidate_id || null,
        item_name: expenseForm.item_name.trim(),
        category: expenseForm.category,
        amount: Number(expenseForm.amount) || 0,
        receipt_ref: ref,
        receipt_url: receiptUrl,
      };

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('expenses').insert([payload]);
        if (error) throw error;
      } else {
        const stored = localStorage.getItem('sr_expenses') || '[]';
        const list = JSON.parse(stored);
        list.unshift({
          ...payload,
          id: Math.random().toString(36).substring(2, 15),
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('sr_expenses', JSON.stringify(list));
      }

      triggerNotification('success', `Expense of ₹${payload.amount} logged.`);
      setExpenseForm({ candidate_id: '', item_name: '', category: EXPENSE_CATEGORIES[0], amount: '', receipt_ref: '' });
      setReceiptFile(null);
      await loadLedgerData();
    } catch (err: unknown) {
      triggerNotification('error', err instanceof Error ? err.message : 'Error logging expense.');
    } finally {
      setActionLoading(false);
    }
  };

  // Calculations
  const totalRaised = donations.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const netBalance = totalRaised - totalExpenses;

  const formattingOptions: Intl.NumberFormatOptions = { style: 'currency', currency: 'INR', maximumFractionDigits: 0 };
  const formatCurrency = (val: number) => val.toLocaleString('en-IN', formattingOptions);

  return (
    <div className="p-6 sm:p-8 space-y-8 animate-fade-in text-xs sm:text-sm">
      
      {/* Alert logs */}
      {successMsg && (
        <div className="p-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold rounded-xl flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Stats summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border border-border/60 bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Total Donations Raised</span>
              <p className="text-2xl font-black text-foreground">{formatCurrency(totalRaised)}</p>
            </div>
            <div className="p-3 bg-green-500/10 text-green-400 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Total Expenses Logged</span>
              <p className="text-2xl font-black text-foreground">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
              <TrendingDown className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Net Balance</span>
              <p className={`text-2xl font-black ${netBalance >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
                {formatCurrency(netBalance)}
              </p>
            </div>
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
              <Wallet className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Lists */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border/60 bg-card">
            <CardHeader className="border-b border-border/40 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-4.5 w-4.5 text-teal-500" />
                  Financial Transactions Log
                </CardTitle>
                <div className="flex border border-border rounded-lg p-0.5 bg-background">
                  <button
                    onClick={() => setActiveTab('donations')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      activeTab === 'donations' 
                        ? 'bg-teal-500/10 text-teal-400 font-bold' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Donations
                  </button>
                  <button
                    onClick={() => setActiveTab('expenses')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      activeTab === 'expenses' 
                        ? 'bg-teal-500/10 text-teal-400 font-bold' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Expenses
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-5 w-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
                </div>
              ) : activeTab === 'donations' ? (
                donations.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-16">No donation records found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/60 bg-muted/20">
                          <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Donor / Date</th>
                          <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Fund Category</th>
                          <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Tx Reference</th>
                          <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {donations.map((d) => (
                          <tr key={d.id} className="hover:bg-muted/10">
                            <td className="px-5 py-3.5">
                              <p className="font-bold text-foreground">{d.is_anonymous ? 'Anonymous Sponsor' : d.donor_name}</p>
                              <p className="text-[10px] text-muted-foreground">{new Date(d.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </td>
                            <td className="px-5 py-3.5 text-muted-foreground font-medium">{d.category}</td>
                            <td className="px-5 py-3.5 text-muted-foreground font-mono">{d.tx_ref}</td>
                            <td className="px-5 py-3.5 text-right font-extrabold text-green-400">{formatCurrency(d.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                expenses.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-16">No expense records found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/60 bg-muted/20">
                          <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Item / Recipient</th>
                          <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Expense Category</th>
                          <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Receipt Ref</th>
                          <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {expenses.map((e) => (
                          <tr key={e.id} className="hover:bg-muted/10">
                            <td className="px-5 py-3.5">
                              <p className="font-bold text-foreground">{e.item_name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {e.candidate ? `Linked: ${e.candidate.alias}` : 'General Initiative'}
                                {' · '}
                                {new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </p>
                            </td>
                            <td className="px-5 py-3.5 text-muted-foreground font-medium">{e.category}</td>
                            <td className="px-5 py-3.5 text-muted-foreground font-mono flex items-center gap-1.5 pt-4">
                              <span>{e.receipt_ref}</span>
                              {e.receipt_url && (
                                <a href={e.receipt_url} target="_blank" rel="noreferrer" className="text-teal-400 hover:text-teal-300">
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-right font-extrabold text-rose-400">{formatCurrency(e.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Logging Forms */}
        <div className="space-y-6">
          
          {/* Donation Form */}
          <Card className="border border-border/60 bg-card">
            <CardHeader className="border-b border-border/40 pb-3">
              <CardTitle>Log Public Donation</CardTitle>
              <CardDescription>Record a new incoming contribution into the program.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <form onSubmit={handleDonationSubmit} className="space-y-4">
                <Input
                  label="Donation Amount (₹)"
                  type="number"
                  required
                  min="1"
                  value={donationForm.amount}
                  onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })}
                  placeholder="e.g. 5000"
                />

                <Select
                  label="Fund Category"
                  required
                  value={donationForm.category}
                  onChange={(e) => setDonationForm({ ...donationForm, category: e.target.value })}
                  options={DONATION_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
                />

                <Input
                  label="Donor Name"
                  value={donationForm.donor_name}
                  onChange={(e) => setDonationForm({ ...donationForm, donor_name: e.target.value })}
                  placeholder="e.g. Manikandan Kolangi"
                  disabled={donationForm.is_anonymous}
                  hint="Leave blank if anonymous."
                />

                <label className="flex items-center gap-2 text-xs text-muted-foreground select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={donationForm.is_anonymous}
                    onChange={(e) => setDonationForm({ ...donationForm, is_anonymous: e.target.checked, donor_name: e.target.checked ? '' : donationForm.donor_name })}
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                  Mark donation as anonymous
                </label>

                <Input
                  label="Transaction Hash / Ref"
                  value={donationForm.tx_ref}
                  onChange={(e) => setDonationForm({ ...donationForm, tx_ref: e.target.value })}
                  placeholder="e.g. UPI-REF-9271..."
                  hint="Optional. Leave blank to generate placeholder."
                />

                <Button type="submit" variant="primary" className="w-full gap-2" disabled={actionLoading || !donationForm.amount}>
                  <Plus className="h-4 w-4" />
                  Log Donation Receipt
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Expense Form */}
          <Card className="border border-border/60 bg-card">
            <CardHeader className="border-b border-border/40 pb-3">
              <CardTitle>Log Program Outflow / Expense</CardTitle>
              <CardDescription>Log expenses for audit accountability.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <form onSubmit={handleExpenseSubmit} className="space-y-4">
                
                <Input
                  label="Expense Cost (₹)"
                  type="number"
                  required
                  min="1"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  placeholder="e.g. 2400"
                />

                <Input
                  label="Expense Item / Description"
                  required
                  value={expenseForm.item_name}
                  onChange={(e) => setExpenseForm({ ...expenseForm, item_name: e.target.value })}
                  placeholder="e.g. Purchased 10 items of Brand Woolen Clothes"
                />

                <Select
                  label="Expense Category"
                  required
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  options={EXPENSE_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
                />

                <Select
                  label="Recipient Candidate (Optional)"
                  value={expenseForm.candidate_id}
                  onChange={(e) => setExpenseForm({ ...expenseForm, candidate_id: e.target.value })}
                  options={[
                    { value: '', label: 'None (General Initiative Expense)' },
                    ...candidates.map((c) => ({ value: c.id, label: c.alias }))
                  ]}
                  hint="Link this expense directly to a candidate lifecycle ledger."
                />

                <Input
                  label="Invoice Reference Number"
                  value={expenseForm.receipt_ref}
                  onChange={(e) => setExpenseForm({ ...expenseForm, receipt_ref: e.target.value })}
                  placeholder="e.g. INV-9871"
                  hint="Leave blank to auto-generate reference."
                />

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-foreground uppercase tracking-wider block">Receipt File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-500/10 file:text-teal-400 file:cursor-pointer hover:file:bg-teal-500/20"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full gap-2" disabled={actionLoading || !expenseForm.amount || !expenseForm.item_name}>
                  <Plus className="h-4 w-4" />
                  Log Expense Outflow
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}
