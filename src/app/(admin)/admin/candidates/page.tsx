'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Plus, 
  MapPin, 
  Phone, 
  ShoppingBag, 
  Calendar,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { CANDIDATE_STAGES, STAGE_MAP } from '@/lib/constants';
import type { Candidate, CandidateStage } from '@/lib/types';

export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<CandidateStage | 'all'>('all');

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
        // LocalStorage fallback for sandbox mode
        const stored = localStorage.getItem('sr_candidates');
        if (stored) {
          setCandidates(JSON.parse(stored));
        } else {
          setCandidates([]);
        }
      }
    } catch (err) {
      console.error('Error loading candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.product_category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = selectedStage === 'all' ? true : c.stage === selectedStage;

    return matchesSearch && matchesStage;
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 animate-fade-in text-xs sm:text-sm">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-500">
            <Users className="h-3.5 w-3.5" />
            Candidate Registry
          </div>
          <h1 className="text-2xl font-extrabold font-display text-foreground tracking-tight">
            Rehabilitation Candidates
          </h1>
          <p className="text-xs text-muted-foreground">
            Onboard, review observation findings, manage milestones, and support self-employment setup.
          </p>
        </div>
        <Link href="/admin/candidates/new">
          <Button variant="primary" size="md" className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            Onboard Candidate
          </Button>
        </Link>
      </div>

      {/* Filters and search card */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {/* Search bar */}
          <div className="w-full md:max-w-md">
            <Input
              placeholder="Search by name, alias, location, or product..."
              prefixIcon={<Search className="h-4 w-4 text-muted-foreground" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Stage Quick Filter (Dropdown for smaller screens, buttons for larger) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedStage('all')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                selectedStage === 'all'
                  ? 'bg-teal-500/15 border-teal-500/30 text-teal-400 font-bold'
                  : 'bg-background border-border text-muted-foreground hover:text-foreground hover:bg-card'
              }`}
            >
              All Stages ({candidates.length})
            </button>
            {CANDIDATE_STAGES.map((s) => {
              const count = candidates.filter((c) => c.stage === s.value).length;
              return (
                <button
                  key={s.value}
                  onClick={() => setSelectedStage(s.value)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    selectedStage === s.value
                      ? 'bg-teal-500/15 border-teal-500/30 text-teal-400 font-bold'
                      : 'bg-background border-border text-muted-foreground hover:text-foreground hover:bg-card'
                  }`}
                >
                  {s.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content area */}
      {loading ? (
        <div className="flex justify-center py-20 bg-card border border-border rounded-2xl">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
            <span className="text-sm font-semibold text-muted-foreground">Loading registry...</span>
          </div>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-card border border-border border-dashed rounded-2xl space-y-6">
          <div className="p-4 bg-teal-500/10 text-teal-500 rounded-2xl">
            <UserCheck className="h-10 w-10" />
          </div>
          <div className="text-center space-y-2 max-w-sm px-4">
            <h3 className="text-lg font-bold font-display text-foreground">
              No candidates found
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {searchQuery || selectedStage !== 'all'
                ? "No candidates match your current search queries or stage filters."
                : "No candidates have been registered under the StreetRise program yet."}
            </p>
          </div>
          {(searchQuery || selectedStage !== 'all') ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setSearchQuery(''); setSelectedStage('all'); }}
            >
              Reset Filters
            </Button>
          ) : (
            <Link href="/admin/candidates/new">
              <Button variant="primary" size="sm">
                Onboard First Candidate
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Candidate / Display</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Product Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Rehabilitation Stage</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Onboarded</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCandidates.map((c) => {
                  const stageMeta = STAGE_MAP[c.stage] || { label: c.stage, color: 'text-foreground', bg: 'bg-muted border-border' };
                  return (
                    <tr key={c.id} className="hover:bg-muted/15 transition-colors group">
                      {/* Name / Display */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {c.photo_url ? (
                            <img 
                              src={c.photo_url} 
                              alt={c.alias} 
                              className="h-10 w-10 rounded-full object-cover border border-border"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold flex items-center justify-center">
                              {c.alias.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-foreground hover:text-teal-400 transition-colors">
                              <Link href={`/admin/candidates/${c.id}`}>
                                {c.alias}
                              </Link>
                            </p>
                            <p className="text-[11px] text-muted-foreground">{c.name}</p>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate max-w-[150px]">{c.location}</span>
                        </div>
                      </td>

                      {/* Product Category */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
                          <span>{c.product_category}</span>
                        </div>
                      </td>

                      {/* Stage Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${stageMeta.bg} ${stageMeta.color}`}>
                          <span className="relative flex h-1 w-1 rounded-full bg-current" />
                          {stageMeta.label}
                        </span>
                      </td>

                      {/* Onboarded Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/candidates/${c.id}`}>
                          <button className="inline-flex items-center gap-1 text-xs font-semibold text-teal-500 hover:text-teal-400 bg-teal-500/5 hover:bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/10 hover:border-teal-500/20 cursor-pointer transition-colors duration-150">
                            Manage
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
