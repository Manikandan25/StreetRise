'use client';

import React, { useState, useEffect } from 'react';
import { useCandidate } from '../layout';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SUPPORT_TYPES } from '@/lib/constants';
import type { SupportType, SupportRecord } from '@/lib/types';
import { 
  HeartHandshake, 
  Plus, 
  Calendar, 
  Coins, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function CandidateSupportPage() {
  const { candidate } = useCandidate();
  
  const [records, setRecords] = useState<SupportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    support_type: SUPPORT_TYPES[0].value as SupportType,
    description: '',
    amount_spent: '',
    provided_on: new Date().toISOString().split('T')[0],
  });

  const loadSupportRecords = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('support_records')
          .select('*')
          .eq('candidate_id', candidate.id)
          .order('provided_on', { ascending: false });

        if (error) throw error;
        setRecords((data as SupportRecord[]) || []);
      } else {
        // Sandbox mock loader
        const stored = localStorage.getItem('sr_support_records');
        if (stored) {
          const list = JSON.parse(stored).filter((r: any) => r.candidate_id === candidate.id);
          setRecords(list.sort((a: any, b: any) => new Date(b.provided_on).getTime() - new Date(a.provided_on).getTime()));
        } else {
          setRecords([]);
        }
      }
    } catch (err) {
      console.error('Error fetching support records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupportRecords();
  }, [candidate.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim()) return;
    setActionLoading(true);
    setErrorMsg(null);

    const payload = {
      candidate_id: candidate.id,
      support_type: form.support_type,
      description: form.description.trim(),
      amount_spent: form.amount_spent ? Number(form.amount_spent) : null,
      provided_on: form.provided_on,
    };

    try {
      if (isSupabaseConfigured) {
        // 1. Insert support record
        const { error } = await supabase
          .from('support_records')
          .insert([payload]);

        if (error) throw error;
      } else {
        // Sandbox localstorage fallback
        const stored = localStorage.getItem('sr_support_records');
        const list = stored ? JSON.parse(stored) : [];
        list.push({
          ...payload,
          id: Math.random().toString(36).substring(2, 15),
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('sr_support_records', JSON.stringify(list));
      }

      setForm((prev) => ({
        ...prev,
        description: '',
        amount_spent: '',
        provided_on: new Date().toISOString().split('T')[0],
      }));
      await loadSupportRecords();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to log support.');
    } finally {
      setActionLoading(false);
    }
  };

  const totalSpent = records.reduce((acc, curr) => acc + (curr.amount_spent || 0), 0);
  const formattingOptions: Intl.NumberFormatOptions = { style: 'currency', currency: 'INR', maximumFractionDigits: 0 };
  const formatCurrency = (val: number) => val.toLocaleString('en-IN', formattingOptions);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-xs sm:text-sm">
      
      {/* Left Column: List of Support Logs */}
      <div className="lg:col-span-2 space-y-6">
        
        {errorMsg && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span className="text-xs">{errorMsg}</span>
          </div>
        )}

        {/* Support History */}
        <Card className="border border-border/60 bg-card">
          <CardHeader className="border-b border-border/40 pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-4.5 w-4.5 text-teal-500" />
              <CardTitle>Basic Needs Support Log</CardTitle>
            </div>
            <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-1 rounded-lg text-xs font-bold">
              Total Spent: {formatCurrency(totalSpent)}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-5 w-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-xs text-muted-foreground">No support records registered for this candidate.</p>
                <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                  Initially, every candidate is assisted with fundamental basic needs like shelter, cloths, and meals.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {records.map((r) => {
                  const typeMeta = SUPPORT_TYPES.find((t) => t.value === r.support_type) || { label: r.support_type, icon: '🛡️' };
                  return (
                    <div key={r.id} className="p-4 bg-muted/15 border border-border/60 rounded-xl flex items-start gap-4 hover:border-teal-500/20 transition-all duration-150">
                      <div className="text-2xl p-2.5 bg-background rounded-xl border border-border shadow-sm shrink-0">
                        {typeMeta.icon}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-bold text-foreground text-xs">{typeMeta.label}</span>
                          <span className="font-extrabold text-foreground text-xs">
                            {r.amount_spent !== null ? formatCurrency(r.amount_spent) : 'In-kind'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-normal leading-relaxed">{r.description}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1">
                          <Calendar className="h-3 w-3 text-teal-500/80" />
                          Provided on {new Date(r.provided_on).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Right Column: Add Support Record Form */}
      <div>
        <Card className="border border-border/60 bg-card sticky top-6">
          <CardHeader className="border-b border-border/40 pb-3">
            <CardTitle>Log Support Provision</CardTitle>
            <CardDescription>Record housing, food, or apparel costs provided to the candidate.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <Select
                label="Support Type"
                required
                value={form.support_type}
                onChange={(e) => setForm((prev) => ({ ...prev, support_type: e.target.value as SupportType }))}
                options={SUPPORT_TYPES.map((t) => ({ value: t.value, label: `${t.icon} ${t.label}` }))}
              />

              <Input
                label="Cost / Amount (₹)"
                type="number"
                min="0"
                value={form.amount_spent}
                onChange={(e) => setForm((prev) => ({ ...prev, amount_spent: e.target.value }))}
                placeholder="e.g. 1500"
                hint="Leave blank if resource is sourced in-kind or as a free donation."
              />

              <Input
                label="Provision Date"
                type="date"
                required
                value={form.provided_on}
                onChange={(e) => setForm((prev) => ({ ...prev, provided_on: e.target.value }))}
              />

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-foreground uppercase tracking-wider block">Description of Assistance</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the support provided (e.g. Sourced three sets of clothes; Paid 1 month deposit for local room stay)..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors duration-150"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full gap-2" disabled={actionLoading || !form.description.trim()}>
                <Plus className="h-4 w-4" />
                Log Support Cost
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
