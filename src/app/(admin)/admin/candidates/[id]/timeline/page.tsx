'use client';

import React, { useState, useEffect } from 'react';
import { useCandidate } from '../layout';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { CANDIDATE_STAGES, STAGE_MAP } from '@/lib/constants';
import type { CandidateStage, CandidateNote, StageTransition } from '@/lib/types';
import { 
  FileText, 
  Plus, 
  Layers, 
  MessageSquare, 
  Calendar, 
  User, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';

export default function CandidateTimelinePage() {
  const { candidate, refresh } = useCandidate();
  
  // Loading & logs state
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [transitions, setTransitions] = useState<StageTransition[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [newNote, setNewNote] = useState('');
  const [stageForm, setStageForm] = useState({
    to_stage: candidate.stage as CandidateStage,
    notes: '',
  });

  const loadTimelineData = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        // Fetch Notes
        const { data: notesData } = await supabase
          .from('candidate_notes')
          .select('*')
          .eq('candidate_id', candidate.id)
          .order('created_at', { ascending: false });

        // Fetch Transitions
        const { data: transData } = await supabase
          .from('stage_transitions')
          .select('*')
          .eq('candidate_id', candidate.id)
          .order('transitioned_at', { ascending: false });

        setNotes((notesData as CandidateNote[]) || []);
        setTransitions((transData as StageTransition[]) || []);
      } else {
        // Sandbox mock loader
        const notesStored = localStorage.getItem('sr_candidate_notes');
        const transStored = localStorage.getItem('sr_stage_transitions');

        if (notesStored) {
          const list = JSON.parse(notesStored).filter((n: any) => n.candidate_id === candidate.id);
          setNotes(list.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        }
        if (transStored) {
          const list = JSON.parse(transStored).filter((t: any) => t.candidate_id === candidate.id);
          setTransitions(list.sort((a: any, b: any) => new Date(b.transitioned_at).getTime() - new Date(a.transitioned_at).getTime()));
        }
      }
    } catch (err) {
      console.error('Error fetching timeline logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimelineData();
  }, [candidate.id]);

  // Handle volunteer note submission
  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setActionLoading(true);
    setErrorMsg(null);

    const notePayload = {
      candidate_id: candidate.id,
      note: newNote.trim(),
      created_by: 'Manikandan Kolangi', // Primary owner/volunteer
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('candidate_notes')
          .insert([notePayload]);

        if (error) throw error;
      } else {
        const stored = localStorage.getItem('sr_candidate_notes');
        const list = stored ? JSON.parse(stored) : [];
        list.push({
          ...notePayload,
          id: Math.random().toString(36).substring(2, 15),
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('sr_candidate_notes', JSON.stringify(list));
      }

      setNewNote('');
      await loadTimelineData();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to post note.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle stage transition submission
  const handleTransitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stageForm.to_stage === candidate.stage) {
      setErrorMsg("Candidate is already in this stage.");
      return;
    }
    setActionLoading(true);
    setErrorMsg(null);

    const now = new Date().toISOString();
    const transitionPayload = {
      candidate_id: candidate.id,
      from_stage: candidate.stage,
      to_stage: stageForm.to_stage,
      notes: stageForm.notes.trim() || null,
      transitioned_at: now,
    };

    try {
      if (isSupabaseConfigured) {
        // 1. Log transition
        const { error: transErr } = await supabase
          .from('stage_transitions')
          .insert([transitionPayload]);

        if (transErr) throw transErr;

        // 2. Update candidate record
        const { error: candErr } = await supabase
          .from('candidates')
          .update({
            stage: stageForm.to_stage,
            stage_started_at: now,
          })
          .eq('id', candidate.id);

        if (candErr) throw candErr;
      } else {
        // Mock update
        const transStored = localStorage.getItem('sr_stage_transitions');
        const transList = transStored ? JSON.parse(transStored) : [];
        transList.push({
          ...transitionPayload,
          id: Math.random().toString(36).substring(2, 15),
        });
        localStorage.setItem('sr_stage_transitions', JSON.stringify(transList));

        // Update candidate list
        const candStored = localStorage.getItem('sr_candidates');
        if (candStored) {
          const list: any[] = JSON.parse(candStored);
          const idx = list.findIndex((c) => c.id === candidate.id);
          if (idx !== -1) {
            list[idx].stage = stageForm.to_stage;
            list[idx].stage_started_at = now;
            localStorage.setItem('sr_candidates', JSON.stringify(list));
          }
        }
      }

      setStageForm((prev) => ({ ...prev, notes: '' }));
      await refresh(); // Refresh layout context
      await loadTimelineData(); // Reload local logs
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to transition stage.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-xs sm:text-sm">
      
      {/* Left Columns: Timeline History Log */}
      <div className="lg:col-span-2 space-y-6">
        
        {errorMsg && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span className="text-xs">{errorMsg}</span>
          </div>
        )}

        {/* Timeline Activities Feed */}
        <Card className="border border-border/60 bg-card">
          <CardHeader className="border-b border-border/40 pb-3 flex flex-row items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-teal-500" />
            <CardTitle>Milestone Timeline & Transitions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-5 w-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
              </div>
            ) : transitions.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No milestones logged yet.</p>
            ) : (
              <div className="relative border-l border-border pl-6 space-y-6 py-2 ml-3">
                {transitions.map((t) => {
                  const fromMeta = t.from_stage ? STAGE_MAP[t.from_stage] : null;
                  const toMeta = STAGE_MAP[t.to_stage] || { label: t.to_stage, color: 'text-foreground', bg: 'bg-muted border-border' };
                  
                  return (
                    <div key={t.id} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 border border-teal-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                      </span>
                      
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-bold text-foreground">Lifecycle Update:</span>
                          {fromMeta ? (
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              {fromMeta.label} → <span className={`font-bold px-1.5 py-0.2 rounded border ${toMeta.bg} ${toMeta.color}`}>{toMeta.label}</span>
                            </span>
                          ) : (
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${toMeta.bg} ${toMeta.color}`}>Onboarded as {toMeta.label}</span>
                          )}
                        </div>
                        {t.notes && (
                          <p className="text-xs text-muted-foreground leading-relaxed italic bg-muted/20 border border-border/40 p-2.5 rounded-lg mt-1">{t.notes}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-teal-500/80" />
                          {new Date(t.transitioned_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Volunteer Notes Feed */}
        <Card className="border border-border/60 bg-card">
          <CardHeader className="border-b border-border/40 pb-3 flex flex-row items-center gap-2">
            <MessageSquare className="h-4.5 w-4.5 text-teal-500" />
            <CardTitle>Case File Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-5 w-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
              </div>
            ) : notes.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No notes logged for this candidate.</p>
            ) : (
              <div className="space-y-4">
                {notes.map((n) => (
                  <div key={n.id} className="p-4 bg-muted/15 border border-border/60 rounded-xl space-y-2">
                    <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-normal">
                      {n.note}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                      <span className="flex items-center gap-1 font-bold">
                        <User className="h-3 w-3 text-teal-500/85" />
                        {n.created_by}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="h-3 w-3" />
                        {new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Right Column: Submission Forms Panel */}
      <div className="space-y-6">
        
        {/* 1. Transition Stage Card */}
        <Card className="border border-border/60 bg-card">
          <CardHeader className="border-b border-border/40 pb-3">
            <CardTitle>Transition Livelihood Stage</CardTitle>
            <CardDescription>Advance candidate along the rehabilitation pathway.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <form onSubmit={handleTransitionSubmit} className="space-y-4">
              <Select
                label="New Pathway Stage"
                required
                value={stageForm.to_stage}
                onChange={(e) => setStageForm((prev) => ({ ...prev, to_stage: e.target.value as CandidateStage }))}
                options={CANDIDATE_STAGES.map((s) => ({ value: s.value, label: s.label, disabled: s.value === candidate.stage }))}
              />
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-foreground uppercase tracking-wider block">Transition Reason / Notes</label>
                <textarea
                  rows={3}
                  value={stageForm.notes}
                  onChange={(e) => setStageForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Explain why this transition is occurring (e.g. Completed food permit check, started independent sales plot)..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors duration-150"
                />
              </div>
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full gap-2" 
                disabled={actionLoading || stageForm.to_stage === candidate.stage}
              >
                <TrendingUp className="h-4 w-4" />
                Transition Stage
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 2. Add Case Note Card */}
        <Card className="border border-border/60 bg-card">
          <CardHeader className="border-b border-border/40 pb-3">
            <CardTitle>Log Case Note</CardTitle>
            <CardDescription>Add new observation details, housing checklists, or daily updates.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <form onSubmit={handleNoteSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-foreground uppercase tracking-wider block">Volunteer Note</label>
                <textarea
                  required
                  rows={4}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write details regarding candidate progress, background checks, or direct needs assistance details..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors duration-150"
                />
              </div>
              <Button type="submit" variant="outline" className="w-full gap-2" disabled={actionLoading || !newNote.trim()}>
                <Plus className="h-4 w-4" />
                Post Case Note
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
