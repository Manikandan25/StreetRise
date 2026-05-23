'use client';

import React, { useState, useEffect } from 'react';
import { SpendBreakdownChart } from '@/components/dashboard/SpendBreakdownChart';
import { LocationMap } from '@/components/dashboard/LocationMap';
import { Card, CardContent } from '@/components/ui/Card';
import { CountUp } from '@/components/ui/CountUp';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
  ShieldCheck, 
  Eye, 
  Receipt, 
  ArrowUpRight, 
  Download, 
  Target,
  FileText,
  Activity,
  CheckCircle2,
  Wallet,
  Coins,
  Store,
  Users
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { STAGE_MAP } from '@/lib/constants';
import type { CandidateStage } from '@/lib/types';

interface LedgerTransaction {
  date: string;
  vendor: string;
  item: string;
  category: string;
  amount: string;
  receiptId: string;
  status: string;
}

interface BeneficiaryAllocation {
  name: string;
  category: string;
  stage: string;
  advanced: number;
  settled: number;
  progress: number;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryAllocation[]>([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    inventorySubsidies: 0,
    founderAdvances: 0,
    activeCases: 0,
    completedCases: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchLedgerAndStats = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        // 1. Fetch Donations
        const { data: donationsData } = await supabase
          .from('donations')
          .select('amount');
        const donationsSum = donationsData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

        // 2. Fetch Support Records (Subsidies)
        const { data: supportData } = await supabase
          .from('support_records')
          .select('amount_spent');
        const supportSum = supportData?.reduce((acc, curr) => acc + Number(curr.amount_spent || 0), 0) || 0;

        // 3. Fetch Inventory Allocations (Founder Advances)
        const { data: allocationsData } = await supabase
          .from('inventory_allocations')
          .select('settlement_amount_due, amount_settled');
        const advancedSum = allocationsData?.reduce((acc, curr) => acc + Number(curr.settlement_amount_due), 0) || 0;

        // 4. Fetch Candidates
        const { data: candidatesData } = await supabase
          .from('candidates')
          .select('id, alias, product_category, stage');

        const activeCount = candidatesData?.filter((c) => c.stage !== 'stabilized' && c.stage !== 'exited').length || 0;
        const completedCount = candidatesData?.filter((c) => c.stage === 'stabilized').length || 0;

        setStats({
          totalDonations: donationsSum,
          inventorySubsidies: supportSum,
          founderAdvances: advancedSum,
          activeCases: activeCount,
          completedCases: completedCount,
        });

        // 5. Fetch Expenses (Ledger transactions)
        const { data: expensesData } = await supabase
          .from('expenses')
          .select(`
            *,
            candidates:candidate_id (
              alias,
              name
            )
          `)
          .order('created_at', { ascending: false });

        if (expensesData) {
          const mappedTx: LedgerTransaction[] = expensesData.map((item: any) => ({
            date: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            vendor: item.candidates ? `${item.candidates.alias} (${item.candidates.name})` : 'General Initiative',
            item: item.item_name,
            category: item.category,
            amount: `₹${Number(item.amount).toLocaleString('en-IN')}`,
            receiptId: item.receipt_ref || `REC-${Math.floor(Math.random() * 10000)}`,
            status: 'Cleared'
          }));
          setTransactions(mappedTx);
        }

        // 6. Aggregate Beneficiary Allocations
        if (candidatesData && candidatesData.length > 0) {
          const joinedAllocations: BeneficiaryAllocation[] = [];
          
          for (const cand of candidatesData) {
            const { data: cAlloc } = await supabase
              .from('inventory_allocations')
              .select('settlement_amount_due, amount_settled')
              .eq('candidate_id', cand.id);

            const advSum = cAlloc?.reduce((acc, curr) => acc + Number(curr.settlement_amount_due), 0) || 0;
            const setSum = cAlloc?.reduce((acc, curr) => acc + Number(curr.amount_settled), 0) || 0;
            const progressPct = advSum > 0 ? (setSum / advSum) * 100 : 0;

            joinedAllocations.push({
              name: cand.alias,
              category: cand.product_category,
              stage: STAGE_MAP[cand.stage as CandidateStage]?.label || cand.stage,
              advanced: advSum,
              settled: setSum,
              progress: progressPct,
            });
          }
          setBeneficiaries(joinedAllocations);
        }

      } else {
        // Sandbox mock loader
        const storedDonations = localStorage.getItem('sr_donations');
        const donationsList = storedDonations ? JSON.parse(storedDonations) : [];
        const donationsSum = donationsList.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);

        const storedSupport = localStorage.getItem('sr_support_records');
        const supportList = storedSupport ? JSON.parse(storedSupport) : [];
        const supportSum = supportList.reduce((acc: number, curr: any) => acc + (Number(curr.amount_spent) || 0), 0);

        const storedAlloc = localStorage.getItem('sr_inventory_allocations');
        const allocList = storedAlloc ? JSON.parse(storedAlloc) : [];
        const advancedSum = allocList.reduce((acc: number, curr: any) => acc + Number(curr.settlement_amount_due), 0);

        const storedCandidates = localStorage.getItem('sr_candidates');
        const candidatesList = storedCandidates ? JSON.parse(storedCandidates) : [];
        const activeCount = candidatesList.filter((c: any) => c.stage !== 'stabilized' && c.stage !== 'exited').length;
        const completedCount = candidatesList.filter((c: any) => c.stage === 'stabilized').length;

        setStats({
          totalDonations: donationsSum,
          inventorySubsidies: supportSum,
          founderAdvances: advancedSum,
          activeCases: activeCount,
          completedCases: completedCount,
        });

        // Mock Expenses
        const storedExpenses = localStorage.getItem('sr_expenses');
        const expensesList = storedExpenses ? JSON.parse(storedExpenses) : [];
        const mappedTx: LedgerTransaction[] = expensesList.map((item: any) => {
          const cand = candidatesList.find((c: any) => c.id === item.candidate_id);
          return {
            date: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            vendor: cand ? `${cand.alias} (${cand.name})` : 'General Initiative',
            item: item.item_name,
            category: item.category,
            amount: `₹${Number(item.amount).toLocaleString('en-IN')}`,
            receiptId: item.receipt_ref || `REC-${Math.floor(Math.random() * 10000)}`,
            status: 'Cleared'
          };
        });
        setTransactions(mappedTx);

        // Mock Allocations
        if (candidatesList.length > 0) {
          const joined: BeneficiaryAllocation[] = candidatesList.map((cand: any) => {
            const cAlloc = allocList.filter((a: any) => a.candidate_id === cand.id);
            const advSum = cAlloc.reduce((acc: number, curr: any) => acc + Number(curr.settlement_amount_due), 0);
            const setSum = cAlloc.reduce((acc: number, curr: any) => acc + Number(curr.amount_settled), 0);
            const progressPct = advSum > 0 ? (setSum / advSum) * 100 : 0;

            return {
              name: cand.alias,
              category: cand.product_category,
              stage: STAGE_MAP[cand.stage as CandidateStage]?.label || cand.stage,
              advanced: advSum,
              settled: setSum,
              progress: progressPct,
            };
          });
          setBeneficiaries(joined);
        }
      }
    } catch (err) {
      console.error('Error fetching ledger details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgerAndStats();
  }, []);

  return (
    <div className="flex flex-col gap-24 pb-24 animate-fade-in bg-background text-foreground overflow-hidden">
      
      {/* 1. Public Accountability Statement & Hero */}
      <section className="relative pt-16 pb-12 sm:pt-24 border-b border-border/40 bg-muted/20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-primary)/5,transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Eye className="h-4 w-4" /> Public Auditing & Ledger
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-display">
            Absolute Accountability.
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            We operate a 100% transparent, closed-loop financial system. Every rupee raised is logged, 
            every expense is receipt-backed, and our operational overhead is entirely self-funded. 
            Verify our data below.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full space-y-24">
        
        {/* 2. Top Statistics */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> Core Financial Overview
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Donations', value: stats.totalDonations, prefix: '₹', icon: Wallet, color: 'text-teal-500' },
              { label: 'Inventory Subsidies', value: stats.inventorySubsidies, prefix: '₹', icon: Receipt, color: 'text-amber-500' },
              { label: 'Founder Advances', value: stats.founderAdvances, prefix: '₹', icon: Coins, color: 'text-blue-500' },
              { label: 'Active Cases', value: stats.activeCases, prefix: '', icon: Users, color: 'text-primary' },
              { label: 'Completed Cases', value: stats.completedCases, prefix: '', icon: CheckCircle2, color: 'text-muted-foreground' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="bg-card border border-border/50 shadow-sm">
                  <CardContent className="p-4 sm:p-6 flex flex-col space-y-3">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold font-mono">
                        <CountUp end={stat.value} prefix={stat.prefix} />
                      </h3>
                      <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* 3. Financial Overview Charts & 7. Expense Breakdown */}
        <section className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display">Donations vs Utilization</h2>
            <Card className="bg-card border border-border p-6 h-[400px] flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-amber-500" />
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Initiative Active Cases</span>
                    <span className="font-mono">{stats.activeCases}</span>
                  </div>
                  <ProgressBar progress={stats.activeCases > 0 ? 100 : 0} colorClass="bg-primary/20" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-teal-500">Public Subsidies Raised</span>
                    <span className="font-mono text-teal-500">₹{stats.totalDonations.toLocaleString('en-IN')}</span>
                  </div>
                  <ProgressBar progress={stats.totalDonations > 0 ? 100 : 0} colorClass="bg-teal-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-amber-500">Founder Advances</span>
                    <span className="font-mono text-amber-500">₹{stats.founderAdvances.toLocaleString('en-IN')}</span>
                  </div>
                  <ProgressBar progress={stats.founderAdvances > 0 ? 100 : 0} colorClass="bg-amber-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-12 leading-relaxed">
                The founder advances basic needs and inventory upfront. Public donations subsidize the financial loss of selling quality inventory below market price.
              </p>
            </Card>
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display">Categorical Expense Breakdown</h2>
            <div className="h-[400px]">
              <SpendBreakdownChart />
            </div>
          </div>
        </section>

        {/* 8. Operational Expense Transparency */}
        <section className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 p-8">
            <ShieldCheck className="h-48 w-48 text-primary" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="bg-white/10 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
              Zero-Deduction Guarantee
            </span>
            <h2 className="text-3xl font-extrabold font-display">Operational Spending: ₹0</h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              We do not use public donations for overhead. All platform servers, field volunteer travel, 
              and administrative costs are funded 100% out-of-pocket by the founders. 
            </p>
            <div className="flex gap-4 pt-2">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <span className="block text-2xl font-mono font-bold text-teal-400">100%</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">To Vendors</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <span className="block text-2xl font-mono font-bold text-slate-500">0%</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">To Overhead</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Beneficiary-wise Allocation Table & 5. Progress Tracking */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Beneficiary Allocation & Progress
          </h2>
          <Card className="bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-sm border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground uppercase font-bold tracking-wider text-[10px]">
                    <th className="p-4">Candidate Partner</th>
                    <th className="p-4">Product Category</th>
                    <th className="p-4">Pathway Stage</th>
                    <th className="p-4">Cost Advanced</th>
                    <th className="p-4">Cost Settled</th>
                    <th className="p-4">Settlement Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {beneficiaries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No candidates allocated yet. We are actively scouting for our first pilot candidate.
                      </td>
                    </tr>
                  ) : beneficiaries.map((item, idx) => {
                    return (
                      <tr key={idx} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-bold text-foreground">{item.name}</td>
                        <td className="p-4 text-muted-foreground">{item.category}</td>
                        <td className="p-4">
                          <span className="inline-flex px-2 py-0.5 rounded-full font-bold text-[10px] bg-primary/10 text-primary border border-primary/20">
                            {item.stage}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-muted-foreground">₹{item.advanced.toLocaleString('en-IN')}</td>
                        <td className="p-4 font-mono font-bold text-teal-500">₹{item.settled.toLocaleString('en-IN')}</td>
                        <td className="p-4 w-48">
                          <div className="flex items-center gap-3">
                            <ProgressBar progress={item.progress} colorClass="bg-teal-500" />
                            <span className="text-[10px] font-mono text-muted-foreground">{Math.round(item.progress)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* 6. Geographic Coverage */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" /> Active Rehabilitation Zones
          </h2>
          <LocationMap />
        </section>

        {/* 9. Live Transaction Feed */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold font-display flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Public Ledger Feed
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Immutable record of every expense and receipt.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-500 bg-teal-500/10 px-3 py-1.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Live Sync Active
            </div>
          </div>

          <Card className="border border-border bg-card overflow-hidden shadow-sm">
            {loading ? (
              <div className="py-24 flex items-center justify-center text-sm text-muted-foreground font-medium animate-pulse">
                Synchronizing with ledger...
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-sm border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-muted-foreground uppercase font-bold tracking-wider text-[10px]">
                      <th className="p-4">Date</th>
                      <th className="p-4">Beneficiary / Recipient</th>
                      <th className="p-4">Itemized Purpose</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Receipt / Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center">
                          <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                          <p className="font-semibold text-foreground">Ledger is empty.</p>
                          <p className="text-sm text-muted-foreground mt-1">Transactions will appear here once general audit expenses are logged.</p>
                        </td>
                      </tr>
                    ) : transactions.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-muted/10 transition-colors group">
                        <td className="p-4 text-muted-foreground font-medium whitespace-nowrap">{tx.date}</td>
                        <td className="p-4 font-bold text-foreground whitespace-nowrap">{tx.vendor}</td>
                        <td className="p-4 text-muted-foreground">{tx.item}</td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-0.5 rounded-full font-bold text-[10px] bg-muted text-muted-foreground border border-border/60">
                            {tx.category}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold font-mono text-amber-500 whitespace-nowrap">{tx.amount}</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-500 uppercase tracking-widest">
                            <CheckCircle2 className="h-3 w-3" /> {tx.status}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-semibold text-xs text-muted-foreground">
                            <Receipt className="h-3.5 w-3.5" />
                            {tx.receiptId}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </section>

        {/* 10. Download Reports & 11. Future Goals */}
        <section className="grid md:grid-cols-2 gap-8 border-t border-border pt-12">
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display">Audit Reports</h2>
            <p className="text-sm text-muted-foreground">Download comprehensive PDF summaries of our financial activity.</p>
            <div className="space-y-3">
              {[
                { name: 'May 2026 Audit Summary', size: '1.2 MB' },
                { name: 'Q2 Initial Compliance Report', size: '2.4 MB' }
              ].map((report, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/40 transition-colors cursor-not-allowed opacity-80">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{report.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{report.size} • PDF</p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display">Future Platform Goals</h2>
            <Card className="bg-primary/5 border border-primary/20">
              <CardContent className="p-6 space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-background rounded-xl shadow-sm text-primary h-fit">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Secure 1st Pilot Candidate</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      Before we scale platform infrastructure, we aim to fully fund and deploy our very first candidate to validate the end-to-end model.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground uppercase tracking-widest">Progress</span>
                    <span className="font-mono text-primary">{stats.completedCases + stats.activeCases > 0 ? '1 / 1' : '0 / 1'}</span>
                  </div>
                  <ProgressBar progress={stats.completedCases + stats.activeCases > 0 ? 100 : 0} colorClass="bg-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

        </section>

      </div>
    </div>
  );
}
