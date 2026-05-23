'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { 
  HeartHandshake, 
  ArrowRight,
  ShieldCheck,
  Search,
  MapPin,
  ShoppingBag,
  Layers,
  X,
  FileText,
  UserCheck
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { STAGE_MAP } from '@/lib/constants';
import type { Candidate, CandidateStage } from '@/lib/types';

export default function Stories() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Modal stats state
  const [supportSpent, setSupportSpent] = useState<number>(0);
  const [stockAdvanced, setStockAdvanced] = useState<number>(0);
  const [stockSettled, setStockSettled] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState(false);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('candidates')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCandidates((data as Candidate[]) || []);
      } else {
        const stored = localStorage.getItem('sr_candidates');
        setCandidates(stored ? JSON.parse(stored) : []);
      }
    } catch (err) {
      console.error('Error loading stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadModalStats = async (candidateId: string) => {
    setStatsLoading(true);
    try {
      if (isSupabaseConfigured) {
        // Fetch support spending
        const { data: supportData } = await supabase
          .from('support_records')
          .select('amount_spent')
          .eq('candidate_id', candidateId);
        
        const supportSum = supportData?.reduce((acc, curr) => acc + (curr.amount_spent || 0), 0) || 0;
        setSupportSpent(supportSum);

        // Fetch inventory allocations
        const { data: allocData } = await supabase
          .from('inventory_allocations')
          .select('settlement_amount_due, amount_settled')
          .eq('candidate_id', candidateId);

        const stockDueSum = allocData?.reduce((acc, curr) => acc + (curr.settlement_amount_due || 0), 0) || 0;
        const stockPaidSum = allocData?.reduce((acc, curr) => acc + (curr.amount_settled || 0), 0) || 0;

        setStockAdvanced(stockDueSum);
        setStockSettled(stockPaidSum);
      } else {
        // Sandbox mock
        const mockSupport = localStorage.getItem('sr_support_records');
        const mockAlloc = localStorage.getItem('sr_inventory_allocations');

        if (mockSupport) {
          const list = JSON.parse(mockSupport).filter((s: any) => s.candidate_id === candidateId);
          setSupportSpent(list.reduce((acc: number, curr: any) => acc + (Number(curr.amount_spent) || 0), 0));
        }
        if (mockAlloc) {
          const list = JSON.parse(mockAlloc).filter((a: any) => a.candidate_id === candidateId);
          setStockAdvanced(list.reduce((acc: number, curr: any) => acc + (Number(curr.settlement_amount_due) || 0), 0));
          setStockSettled(list.reduce((acc: number, curr: any) => acc + (Number(curr.amount_settled) || 0), 0));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  };

  const openCandidateModal = (cand: Candidate) => {
    setSelectedCandidate(cand);
    loadModalStats(cand.id);
  };

  const closeCandidateModal = () => {
    setSelectedCandidate(null);
    setSupportSpent(0);
    setStockAdvanced(0);
    setStockSettled(0);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  };

  return (
    <div className="flex flex-col gap-24 pb-24 animate-fade-in bg-background text-foreground overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 flex items-center border-b border-border/40">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-primary)/10,transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-xs font-bold uppercase tracking-widest text-primary border border-primary/20 bg-primary/5 px-4 py-1.5 rounded-full">
            The Human Impact
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl font-display max-w-4xl mx-auto leading-tight">
            Lives We <span className="text-primary">Support.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            These are not just charity cases; they are resilient micro-entrepreneurs. 
            Follow their journeys from street-side survival to self-employment stability.
          </p>
        </div>
      </section>

      {/* 2. Dynamic Content Area */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        {loading ? (
          <div className="flex justify-center py-20 bg-card border border-border rounded-3xl">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
              <span className="text-sm font-semibold text-muted-foreground">Loading journeys...</span>
            </div>
          </div>
        ) : candidates.length === 0 ? (
          /* Scouting Phase Placeholder */
          <div className="max-w-3xl mx-auto text-center space-y-8 py-12">
            <div className="inline-flex items-center justify-center p-6 bg-primary/10 text-primary rounded-full mb-4">
              <Search className="h-12 w-12" />
            </div>
            
            <h2 className="text-3xl font-extrabold font-display text-foreground">Scouting Our First Pilot Candidate</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              StreetRise has just officially launched. Vetting roadside vendors is underway in Bengaluru to select candidates showing genuine intent and critical need for basic shelter support and inventory.
            </p>

            <Card className="bg-card border-border/60 shadow-xl mt-12 border-dashed">
              <CardContent className="p-8 sm:p-12 space-y-6">
                <h3 className="text-xl font-bold font-display">Seed the Initiative</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Help by seeding the initial escrow fund. 100% of your donation will be locked and publicly tracked until it is deployed for our first vendor&apos;s basic support or stock.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/donate">
                    <Button variant="primary" className="w-full sm:w-auto gap-2">
                      Donate to Seed Fund <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Volunteer to Help Vet
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Active Candidate Stories Grid */
          <div className="space-y-12">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <h2 className="text-xl font-bold font-display flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-teal-500" />
                Active Livelihood Projects ({candidates.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((c) => {
                const stageMeta = STAGE_MAP[c.stage] || { label: c.stage, color: 'text-foreground', bg: 'bg-muted border-border' };
                return (
                  <Card key={c.id} className="bg-card border border-border hover:border-teal-500/30 transition-all duration-300 flex flex-col shadow-sm group overflow-hidden">
                    {/* Card Image / Photo header */}
                    <div className="h-48 w-full bg-muted relative overflow-hidden">
                      {c.photo_url ? (
                        <img 
                          src={c.photo_url} 
                          alt={c.alias} 
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full w-full bg-teal-500/10 text-teal-400 font-black text-4xl flex items-center justify-center">
                          {c.alias.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className={`absolute top-4 left-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-md ${stageMeta.bg} ${stageMeta.color}`}>
                        <span className="relative flex h-1.5 w-1.5 rounded-full bg-current" />
                        {stageMeta.label}
                      </span>
                    </div>

                    <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold font-display text-foreground tracking-tight group-hover:text-teal-400 transition-colors">
                          {c.alias}
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-teal-500/80" />
                            {c.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="h-3.5 w-3.5 text-teal-500/80" />
                            {c.product_category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed pt-2">
                          {c.description}
                        </p>
                      </div>

                      <Button 
                        onClick={() => openCandidateModal(c)}
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-center gap-1 text-teal-500 hover:text-teal-400 border-teal-500/10 hover:border-teal-500/30"
                      >
                        Read Livelihood Story
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* 3. Community Messages & Trust Section */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <ShieldCheck className="h-12 w-12 text-teal-400 mx-auto opacity-80" />
          <h2 className="text-3xl font-extrabold tracking-tight font-display">A Model Built on Trust</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Every candidate is backed by dynamic financial logs. Public donations directly subsidize needs and price gaps, helping vendors achieve permanent self-reliance.
          </p>
          <div className="pt-6">
            <Link href="/about">
              <Button className="bg-white text-slate-950 hover:bg-slate-200 gap-2">
                <HeartHandshake className="h-4 w-4" /> Read My Full Mission
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-scale-in text-xs sm:text-sm text-foreground">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-border/60 bg-muted/20 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold font-display text-foreground tracking-tight">
                  {selectedCandidate.alias}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Rehabilitation Case Details</p>
              </div>
              <button 
                onClick={closeCandidateModal}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {selectedCandidate.photo_url ? (
                  <img 
                    src={selectedCandidate.photo_url} 
                    alt={selectedCandidate.alias} 
                    className="h-24 w-24 rounded-xl object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-4xl shrink-0">
                    {selectedCandidate.alias.slice(0, 2).toUpperCase()}
                  </div>
                )}
                
                <div className="space-y-2">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                    STAGE_MAP[selectedCandidate.stage as CandidateStage]?.bg || 'bg-muted border-border'
                  } ${STAGE_MAP[selectedCandidate.stage as CandidateStage]?.color || 'text-foreground'}`}>
                    {STAGE_MAP[selectedCandidate.stage as CandidateStage]?.label || selectedCandidate.stage}
                  </span>
                  
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-teal-500" />
                      Location: <strong className="text-foreground">{selectedCandidate.location}</strong>
                    </p>
                    <p className="flex items-center gap-1">
                      <ShoppingBag className="h-3.5 w-3.5 text-teal-500" />
                      Category: <strong className="text-foreground">{selectedCandidate.product_category}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Story Description */}
              <div className="space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-1">
                  <FileText className="h-4 w-4 text-teal-500" />
                  Background Story & Need Assessment
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-normal p-3 bg-muted/10 border border-border/40 rounded-xl">
                  {selectedCandidate.description}
                </p>
              </div>

              {/* Livelihood Ledger Stats */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground flex items-center gap-1.5">
                  <HeartHandshake className="h-4.5 w-4.5 text-teal-500" />
                  Public Livelihood Ledger
                </h4>
                
                {statsLoading ? (
                  <div className="flex justify-center py-6">
                    <div className="h-5 w-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Basic Needs */}
                    <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Basic Needs Subsidy</span>
                      <p className="font-extrabold text-foreground text-sm">{formatCurrency(supportSpent)}</p>
                      <span className="text-[9px] text-muted-foreground block">Food, housing & clothing</span>
                    </div>

                    {/* Cost Advanced */}
                    <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Cost Stock Advanced</span>
                      <p className="font-extrabold text-foreground text-sm">{formatCurrency(stockAdvanced)}</p>
                      <span className="text-[9px] text-muted-foreground block">Advanced inventory cost</span>
                    </div>

                    {/* Stock Settled */}
                    <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Cost Settled</span>
                      <p className="font-extrabold text-green-400 text-sm">{formatCurrency(stockSettled)}</p>
                      <span className="text-[9px] text-muted-foreground block">Paid back from stall sales</span>
                    </div>

                  </div>
                )}
              </div>

              {/* Settlement Progress */}
              {!statsLoading && stockAdvanced > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground uppercase tracking-widest">Inventory Cost Settlement Progress</span>
                    <span className="font-mono text-teal-400">{Math.round((stockSettled / stockAdvanced) * 100)}%</span>
                  </div>
                  <ProgressBar progress={(stockSettled / stockAdvanced) * 100} colorClass="bg-teal-500" />
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-muted/20 border-t border-border/60 flex justify-end">
              <Button onClick={closeCandidateModal} variant="primary">
                Close Profile
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
