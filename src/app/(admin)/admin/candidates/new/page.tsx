'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  ArrowLeft, 
  Upload, 
  X, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PRODUCT_CATEGORIES, CANDIDATE_STAGES } from '@/lib/constants';

export default function AdminOnboardCandidatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    phone: '',
    location: '',
    product_category: PRODUCT_CATEGORIES[0] as string,
    stage: 'identified' as string,
    description: '',
  });

  const [initialNote, setInitialNote] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  // Upload photo to Supabase storage
  const uploadPhoto = async (file: File): Promise<string | null> => {
    if (!isSupabaseConfigured) return '/images/maria.png';
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `candidates/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('candidate-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('candidate-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (e: unknown) {
      console.error('Error uploading photo:', e);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      let uploadedUrl: string | null = null;
      if (photoFile) {
        uploadedUrl = await uploadPhoto(photoFile);
      }

      const candidatePayload = {
        name: formData.name.trim(),
        alias: formData.alias.trim(),
        phone: formData.phone.trim() || null,
        location: formData.location.trim(),
        photo_url: uploadedUrl,
        description: formData.description.trim(),
        stage: formData.stage,
        stage_started_at: new Date().toISOString(),
        product_category: formData.product_category,
      };

      if (isSupabaseConfigured) {
        // Insert candidate
        const { data: candidateData, error: candidateErr } = await supabase
          .from('candidates')
          .insert([candidatePayload])
          .select()
          .single();

        if (candidateErr) throw candidateErr;

        if (candidateData) {
          const candidateId = candidateData.id;

          // Record initial stage transition
          const { error: transitionErr } = await supabase
            .from('stage_transitions')
            .insert([
              {
                candidate_id: candidateId,
                from_stage: null,
                to_stage: formData.stage,
                notes: 'Onboarded into program.',
                transitioned_at: new Date().toISOString(),
              },
            ]);

          if (transitionErr) console.error('Stage transition log error:', transitionErr);

          // Add initial note if provided
          if (initialNote.trim()) {
            const { error: noteErr } = await supabase
              .from('candidate_notes')
              .insert([
                {
                  candidate_id: candidateId,
                  note: initialNote.trim(),
                  created_by: 'Manikandan Kolangi', // Primary owner
                },
              ]);

            if (noteErr) console.error('Initial note log error:', noteErr);
          }
        }
      } else {
        // Sandbox mode local storage save
        const stored = localStorage.getItem('sr_candidates');
        const list: any[] = stored ? JSON.parse(stored) : [];
        const newId = Math.random().toString(36).substring(2, 15);
        const newCandidate = {
          ...candidatePayload,
          id: newId,
          created_at: new Date().toISOString(),
        };
        list.push(newCandidate);
        localStorage.setItem('sr_candidates', JSON.stringify(list));

        // Save stage transitions for mockup
        const transitionStored = localStorage.getItem('sr_stage_transitions');
        const transitions = transitionStored ? JSON.parse(transitionStored) : [];
        transitions.push({
          id: Math.random().toString(36).substring(2, 15),
          candidate_id: newId,
          from_stage: null,
          to_stage: formData.stage,
          notes: 'Onboarded into program.',
          transitioned_at: new Date().toISOString(),
        });
        localStorage.setItem('sr_stage_transitions', JSON.stringify(transitions));

        // Save initial note for mockup
        if (initialNote.trim()) {
          const notesStored = localStorage.getItem('sr_candidate_notes');
          const notes = notesStored ? JSON.parse(notesStored) : [];
          notes.push({
            id: Math.random().toString(36).substring(2, 15),
            candidate_id: newId,
            note: initialNote.trim(),
            created_by: 'Manikandan Kolangi',
            created_at: new Date().toISOString(),
          });
          localStorage.setItem('sr_candidate_notes', JSON.stringify(notes));
        }
      }

      router.push('/admin/candidates');
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred during candidate onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in text-xs sm:text-sm">
      {/* Navigation & Header */}
      <div className="space-y-4">
        <Link href="/admin/candidates" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-semibold">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Candidates
        </Link>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-500">
            <Users className="h-3.5 w-3.5" />
            Onboard Candidate
          </div>
          <h1 className="text-2xl font-extrabold font-display text-foreground tracking-tight">
            Register Rehabilitation Candidate
          </h1>
          <p className="text-xs text-muted-foreground">
            Onboard a new candidate into the program. Initial state starts as "Identified" or "Under Observation".
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-xs">Onboarding Failed</h4>
            <p className="text-xs text-red-500/80">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          
          <h3 className="text-sm font-bold font-display border-b border-border/80 pb-2 text-foreground uppercase tracking-wider">
            1. Core Profile Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Ramesh Kumar"
                hint="For internal official records."
              />

              <Input
                label="Alias / Public Name"
                name="alias"
                required
                value={formData.alias}
                onChange={handleInputChange}
                placeholder="e.g. Ramesh K."
                hint="Display name shown publicly on dashboards."
              />

              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. +91 9876543210"
                hint="Optional. Contact number if they own a phone."
              />
            </div>

            {/* Photo Uploader */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
                Profile Portrait
              </label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 bg-muted/10 min-h-[190px] relative text-center">
                {photoPreview ? (
                  <div className="space-y-3 w-full">
                    <div className="relative h-28 w-28 mx-auto rounded-full overflow-hidden border border-border">
                      <img 
                        src={photoPreview} 
                        alt="Profile preview" 
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <span className="text-[11px] font-semibold text-teal-400 block truncate">
                      {photoFile?.name}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-background rounded-full border border-border w-fit mx-auto text-muted-foreground">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-foreground">Upload profile picture</p>
                      <p className="text-[10px] text-muted-foreground">PNG, JPG, or WEBP up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold font-display border-b border-border/80 pb-2 pt-4 text-foreground uppercase tracking-wider">
            2. Program & Assessment Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Stall/Identification Location"
              name="location"
              required
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. Majestic Market Area, Bengaluru"
              hint="Area where candidate operates or was identified."
            />

            <Select
              label="Target Product Category"
              name="product_category"
              required
              value={formData.product_category}
              onChange={(e) => handleSelectChange('product_category', e.target.value)}
              options={PRODUCT_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
              hint="Type of goods they sell / are planned to sell."
            />

            <Select
              label="Initial Lifecycle Stage"
              name="stage"
              required
              value={formData.stage}
              onChange={(e) => handleSelectChange('stage', e.target.value)}
              options={CANDIDATE_STAGES.map((s) => ({ value: s.value, label: s.label }))}
              hint="Where does this candidate enter the rehabilitation funnel?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
              Case Description & Need Assessment
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide context regarding the candidate's current livelihood challenges, shelter situation, clothing and meal access, and how StreetRise can support them..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors duration-150"
            />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Required. This information is critical for public operational transparency.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-bold text-foreground uppercase tracking-wider block">
              Initial Assessment Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={initialNote}
              onChange={(e) => setInitialNote(e.target.value)}
              placeholder="Log the initial volunteer notes regarding background check, housing review, or training plans..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors duration-150"
            />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Stored as a timeline note. Will display under candidate's notes profile tab.
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-muted/15 border-t border-border flex justify-end gap-3">
          <Link href="/admin/candidates">
            <Button type="button" variant="outline" disabled={loading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" className="gap-2" disabled={loading}>
            <Save className="h-4 w-4" />
            {loading ? 'Registering...' : 'Register Candidate'}
          </Button>
        </div>
      </form>
    </div>
  );
}
