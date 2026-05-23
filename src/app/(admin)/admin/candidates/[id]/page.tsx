'use client';

import React, { useState, useEffect } from 'react';
import { useCandidate } from './layout';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  HeartHandshake, 
  Package, 
  TrendingUp, 
  Coins,
  MapPin,
  Phone,
  ShoppingBag,
  FileText
} from 'lucide-react';

export default function CandidateOverviewPage() {
  const { candidate } = useCandidate();
  
  // Financial Summary State
  const [supportSpent, setSupportSpent] = useState<number>(0);
  const [stockAdvanced, setStockAdvanced] = useState<number>(0);
  const [stockSettled, setStockSettled] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        if (isSupabaseConfigured) {
          // 1. Fetch support spending
          const { data: supportData } = await supabase
            .from('support_records')
            .select('amount_spent')
            .eq('candidate_id', candidate.id);
          
          const supportSum = supportData?.reduce((acc, curr) => acc + (curr.amount_spent || 0), 0) || 0;
          setSupportSpent(supportSum);

          // 2. Fetch inventory allocations
          const { data: allocData } = await supabase
            .from('inventory_allocations')
            .select('settlement_amount_due, amount_settled')
            .eq('candidate_id', candidate.id);

          const stockDueSum = allocData?.reduce((acc, curr) => acc + (curr.settlement_amount_due || 0), 0) || 0;
          const stockPaidSum = allocData?.reduce((acc, curr) => acc + (curr.amount_settled || 0), 0) || 0;

          setStockAdvanced(stockDueSum);
          setStockSettled(stockPaidSum);
        } else {
          // Mock sandbox data loader
          const mockSupport = localStorage.getItem('sr_support_records');
          const mockAlloc = localStorage.getItem('sr_inventory_allocations');

          if (mockSupport) {
            const list = JSON.parse(mockSupport).filter((s: any) => s.candidate_id === candidate.id);
            setSupportSpent(list.reduce((acc: number, curr: any) => acc + (Number(curr.amount_spent) || 0), 0));
          }
          if (mockAlloc) {
            const list = JSON.parse(mockAlloc).filter((a: any) => a.candidate_id === candidate.id);
            setStockAdvanced(list.reduce((acc: number, curr: any) => acc + (Number(curr.settlement_amount_due) || 0), 0));
            setStockSettled(list.reduce((acc: number, curr: any) => acc + (Number(curr.amount_settled) || 0), 0));
          }
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [candidate.id]);

  const formattingOptions: Intl.NumberFormatOptions = { style: 'currency', currency: 'INR', maximumFractionDigits: 0 };
  const formatCurrency = (val: number) => val.toLocaleString('en-IN', formattingOptions);

  const stockBalance = Math.max(0, stockAdvanced - stockSettled);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-xs sm:text-sm">
      
      {/* Left side: Need description and details */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Background & Case Description Card */}
        <Card className="border border-border/60 bg-card">
          <CardHeader className="border-b border-border/40 pb-3 flex flex-row items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-teal-500" />
            <CardTitle>Case Description & Need Assessment</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-4">
            <div className="text-foreground leading-relaxed whitespace-pre-line text-xs sm:text-sm font-normal">
              {candidate.description || 'No case description provided.'}
            </div>
          </CardContent>
        </Card>

        {/* Quick Contact & Livelihood Details Card */}
        <Card className="border border-border/60 bg-card">
          <CardHeader className="border-b border-border/40 pb-3">
            <CardTitle>Onboarding Variables</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-muted/20 border border-border/40 rounded-xl">
              <Phone className="h-4.5 w-4.5 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Phone Contact</p>
                <p className="font-semibold text-foreground text-xs mt-0.5">{candidate.phone || 'No phone recorded'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/20 border border-border/40 rounded-xl">
              <MapPin className="h-4.5 w-4.5 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Stall Area</p>
                <p className="font-semibold text-foreground text-xs mt-0.5">{candidate.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/20 border border-border/40 rounded-xl">
              <ShoppingBag className="h-4.5 w-4.5 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Category</p>
                <p className="font-semibold text-foreground text-xs mt-0.5">{candidate.product_category}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side: Livelihood Ledger & Accountability Summary */}
      <div className="space-y-6">
        
        {/* Livelihood metrics */}
        <Card className="border border-border/60 bg-card">
          <CardHeader className="border-b border-border/40 pb-3 flex flex-row items-center gap-2">
            <Coins className="h-4.5 w-4.5 text-teal-500" />
            <CardTitle>Rehabilitation Ledger</CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-5">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-5 w-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* 1. Support expenses */}
                <div className="flex justify-between items-center pb-3 border-b border-border/40">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <HeartHandshake className="h-4 w-4 text-rose-500" />
                      Basic Needs Support
                    </p>
                    <p className="text-[10px] text-muted-foreground">Meals, shelter & clothing cost</p>
                  </div>
                  <span className="font-extrabold text-foreground">{formatCurrency(supportSpent)}</span>
                </div>

                {/* 2. Sourced Stock Settleable */}
                <div className="flex justify-between items-center pb-3 border-b border-border/40">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Package className="h-4 w-4 text-teal-500" />
                      Sourced Stock Settleable
                    </p>
                    <p className="text-[10px] text-muted-foreground">Advanced inventory cost value</p>
                  </div>
                  <span className="font-extrabold text-foreground">{formatCurrency(stockAdvanced)}</span>
                </div>

                {/* 3. Settled from Earnings */}
                <div className="flex justify-between items-center pb-3 border-b border-border/40">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Settled by Candidate
                    </p>
                    <p className="text-[10px] text-muted-foreground">Amount paid back from sales</p>
                  </div>
                  <span className="font-extrabold text-green-400">{formatCurrency(stockSettled)}</span>
                </div>

                {/* 4. Unsettled balance */}
                <div className="flex justify-between items-center pt-2">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">Outstanding Balance</p>
                    <p className="text-[10px] text-muted-foreground">Remaining inventory cost to settle</p>
                  </div>
                  <span className={`font-black text-sm px-2.5 py-0.5 rounded-lg border ${
                    stockBalance > 0 
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                      : 'bg-green-500/10 border-green-500/20 text-green-400'
                  }`}>
                    {formatCurrency(stockBalance)}
                  </span>
                </div>

              </div>
            )}
          </CardContent>
        </Card>

        {/* Operational Flow Notice */}
        <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl space-y-2">
          <h4 className="text-[11px] font-bold text-teal-400 uppercase tracking-widest">Operational Protocol</h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Candidates are supplied with high-quality, select inventory from approved brands. StreetRise bears price discounts and initial losses. 
            Candidates settle basic needs (food, clothing, shelter) and inventory costs gradually through active stall sales.
          </p>
        </div>

      </div>

    </div>
  );
}
