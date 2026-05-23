'use client';

import React, { createContext, useContext, useState, useEffect, use } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  ShoppingBag, 
  Calendar,
  Layers,
  FileText,
  HeartHandshake,
  PackageCheck
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Badge } from '@/components/ui/Badge';
import { STAGE_MAP } from '@/lib/constants';
import type { Candidate } from '@/lib/types';

interface CandidateContextProps {
  candidate: Candidate;
  refresh: () => Promise<void>;
  loading: boolean;
}

const CandidateContext = createContext<CandidateContextProps | null>(null);

export function useCandidate() {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidate must be used within a CandidateLayout');
  }
  return context;
}

export default function CandidateLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const pathname = usePathname();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  // Unwrap params using React.use() if needed, but in client components we can just read them.
  // We'll wrap in a safe async getter
  const fetchCandidate = async () => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('candidates')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setCandidate(data as Candidate);
      } else {
        const stored = localStorage.getItem('sr_candidates');
        if (stored) {
          const list: Candidate[] = JSON.parse(stored);
          const found = list.find((c) => c.id === id);
          if (found) {
            setCandidate(found);
          } else {
            router.push('/admin/candidates');
          }
        } else {
          router.push('/admin/candidates');
        }
      }
    } catch (err) {
      console.error('Error fetching candidate:', err);
      router.push('/admin/candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Loading candidate profile…</span>
        </div>
      </div>
    );
  }

  if (!candidate) return null;

  const stageMeta = STAGE_MAP[candidate.stage] || { label: candidate.stage, color: 'text-foreground', bg: 'bg-muted border-border' };

  // Tab definitions
  const tabs = [
    {
      href: `/admin/candidates/${id}`,
      label: 'Overview',
      icon: User,
      exact: true,
    },
    {
      href: `/admin/candidates/${id}/timeline`,
      label: 'Timeline & Notes',
      icon: FileText,
      exact: false,
    },
    {
      href: `/admin/candidates/${id}/support`,
      label: 'Basic Support',
      icon: HeartHandshake,
      exact: false,
    },
    {
      href: `/admin/candidates/${id}/inventory`,
      label: 'Inventory',
      icon: PackageCheck,
      exact: false,
    },
  ];

  return (
    <CandidateContext.Provider value={{ candidate, refresh: fetchCandidate, loading }}>
      <div className="p-6 sm:p-8 space-y-6 max-w-6xl mx-auto animate-fade-in text-xs sm:text-sm">
        
        {/* Back Link */}
        <Link href="/admin/candidates" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-semibold">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Candidates
        </Link>

        {/* Unified Profile Header Card */}
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
            
            {/* Candidate Identity block */}
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              {candidate.photo_url ? (
                <img 
                  src={candidate.photo_url} 
                  alt={candidate.alias} 
                  className="h-20 w-20 rounded-2xl object-cover border border-border shadow-sm shrink-0"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-3xl shadow-sm shrink-0">
                  {candidate.alias.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold font-display tracking-tight text-foreground">
                    {candidate.alias}
                  </h1>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${stageMeta.bg} ${stageMeta.color}`}>
                    <span className="relative flex h-1 w-1 rounded-full bg-current" />
                    {stageMeta.label}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground font-medium">
                  Official Name: <span className="text-foreground">{candidate.name}</span>
                </p>

                {/* Badges details list */}
                <div className="flex flex-wrap gap-y-2 gap-x-4 pt-1">
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-teal-500/80" />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <ShoppingBag className="h-3.5 w-3.5 shrink-0 text-teal-500/80" />
                    <span>{candidate.product_category}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-teal-500/80" />
                    <span>Registered: {new Date(candidate.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage Started At badge */}
            <div className="p-3 bg-muted/30 border border-border/80 rounded-xl space-y-1 self-stretch md:self-auto flex flex-col justify-center min-w-[180px]">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Stage Timeline</span>
              <p className="font-bold text-foreground text-xs flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-teal-500" />
                Since {new Date(candidate.stage_started_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-border/80 overflow-x-auto scrollbar-none gap-2 pt-2">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = tab.exact 
                ? pathname === tab.href 
                : pathname === tab.href || pathname.startsWith(tab.href + '/');

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'border-teal-500 text-teal-400 bg-teal-500/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10'
                  }`}
                >
                  <TabIcon className="h-4 w-4 shrink-0" />
                  {tab.label}
                </Link>
              );
            })}
          </div>

        </div>

        {/* Route view pages content */}
        <div className="space-y-6">
          {children}
        </div>

      </div>
    </CandidateContext.Provider>
  );
}
