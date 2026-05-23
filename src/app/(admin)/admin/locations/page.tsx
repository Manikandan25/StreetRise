'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { BusinessLocation } from '@/lib/types';
import { 
  MapPin, 
  Plus, 
  Map, 
  Building2, 
  Calendar, 
  User, 
  Compass,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<BusinessLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    city: 'Bengaluru' as 'Bengaluru' | 'Mumbai',
    name: '',
    candidate_name: '',
    address: '',
    type: '',
    year: '2026',
    coords_x: '50',
    coords_y: '50',
  });

  const triggerNotification = (type: 'success' | 'error', text: string) => {
    if (type === 'success') {
      setSuccessMsg(text);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(text);
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  const loadLocations = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('business_locations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLocations((data as BusinessLocation[]) || []);
      } else {
        // Sandbox mock
        const stored = localStorage.getItem('sr_locations');
        if (stored) {
          setLocations(JSON.parse(stored));
        } else {
          setLocations([]);
        }
      }
    } catch (err) {
      console.error('Error loading locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.candidate_name.trim() || !form.address.trim()) return;
    setActionLoading(true);
    setErrorMsg(null);

    const payload = {
      city: form.city,
      name: form.name.trim(),
      candidate_name: form.candidate_name.trim(),
      address: form.address.trim(),
      type: form.type.trim() || 'Food Cart',
      year: form.year,
      coords_x: Number(form.coords_x) || 50,
      coords_y: Number(form.coords_y) || 50,
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('business_locations')
          .insert([payload]);

        if (error) throw error;
      } else {
        const stored = localStorage.getItem('sr_locations');
        const list = stored ? JSON.parse(stored) : [];
        list.push({
          ...payload,
          id: Math.random().toString(36).substring(2, 15),
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('sr_locations', JSON.stringify(list));
      }

      triggerNotification('success', `Storefront '${payload.name}' plotted successfully.`);
      setForm({
        city: 'Bengaluru',
        name: '',
        candidate_name: '',
        address: '',
        type: '',
        year: '2026',
        coords_x: '50',
        coords_y: '50',
      });
      await loadLocations();
    } catch (err: unknown) {
      triggerNotification('error', err instanceof Error ? err.message : 'Error plotting location.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 animate-fade-in text-xs sm:text-sm">
      
      {/* Alert logs */}
      {successMsg && (
        <div className="p-4 bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active locations listing */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border/60 bg-card">
            <CardHeader className="border-b border-border/40 pb-3">
              <CardTitle className="flex items-center gap-2">
                <Map className="h-4.5 w-4.5 text-teal-500" />
                Active Storefront Plots
              </CardTitle>
              <CardDescription>Plotted cart and stall coordinates mapped on the public geographic tracker.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-5 w-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
                </div>
              ) : locations.length === 0 ? (
                <div className="text-center py-16 px-6 space-y-3">
                  <MapPin className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-xs text-muted-foreground">No storefront locations plotted yet.</p>
                  <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                    Once a candidate completes training and establishes an independent selling business, plot their storefront to display on the public geographic map.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/20">
                        <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Stall Plot / City</th>
                        <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Operating Partner</th>
                        <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Type / Year</th>
                        <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Coordinates (X, Y)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {locations.map((loc) => (
                        <tr key={loc.id} className="hover:bg-muted/10">
                          <td className="px-5 py-3.5">
                            <p className="font-bold text-foreground">{loc.name}</p>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 text-teal-500" />
                              {loc.city} · {loc.address}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-foreground flex items-center gap-1 pt-5">
                            <User className="h-3.5 w-3.5 text-teal-500" />
                            {loc.candidate_name}
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {loc.type} ({loc.year})
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground font-mono">
                            <span className="flex items-center gap-1">
                              <Compass className="h-3.5 w-3.5 text-teal-500" />
                              {loc.coords_x}%, {loc.coords_y}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Plot Location Form */}
        <div>
          <Card className="border border-border/60 bg-card sticky top-6">
            <CardHeader className="border-b border-border/40 pb-3">
              <CardTitle>Plot New Storefront</CardTitle>
              <CardDescription>Configure business details and map coordinates for graduated vendors.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <Select
                  label="Select Location City"
                  required
                  value={form.city}
                  onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value as 'Bengaluru' | 'Mumbai' }))}
                  options={[
                    { value: 'Bengaluru', label: 'Bengaluru' },
                    { value: 'Mumbai', label: 'Mumbai' }
                  ]}
                />

                <Input
                  label="Stall Plot / Business Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Majestic Fruit Stall Plot A"
                  hint="Public display name on the map."
                />

                <Input
                  label="Graduate Operating Partner"
                  required
                  value={form.candidate_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, candidate_name: e.target.value }))}
                  placeholder="e.g. Maria G. (Livelihood Story Link)"
                  hint="Candidate partner running this plot."
                />

                <Input
                  label="Stall/Cart Type"
                  value={form.type}
                  onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                  placeholder="e.g. Fruit Cart, Tea Stall"
                />

                <Input
                  label="Establishment Year"
                  value={form.year}
                  onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
                />

                <Input
                  label="Detailed Street Address"
                  required
                  value={form.address}
                  onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g. Opp. Majestic Metro Entrance, Bengaluru"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Map Coord X (%)"
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={form.coords_x}
                    onChange={(e) => setForm((prev) => ({ ...prev, coords_x: e.target.value }))}
                    hint="0=Left, 100=Right"
                  />
                  <Input
                    label="Map Coord Y (%)"
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={form.coords_y}
                    onChange={(e) => setForm((prev) => ({ ...prev, coords_y: e.target.value }))}
                    hint="0=Top, 100=Bottom"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full gap-2" disabled={actionLoading || !form.name || !form.candidate_name || !form.address}>
                  <Plus className="h-4 w-4" />
                  Plot Storefront
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}
