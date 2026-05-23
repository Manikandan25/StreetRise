'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, Database } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Users,
  Coins,
  ShieldAlert,
  Edit2,
  Trash2,
  Upload,
  MapPin,
  Calendar,
  Building,
  CheckCircle,
  FileText,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Strict Seller Interface
interface Seller {
  id: string;
  name: string;
  business_name: string;
  category: 'Food' | 'Artisan' | 'Services';
  image_url: string | null;
  location: string;
  description: string;
  goal_amount: number;
  raised_amount: number;
  status: 'active' | 'established';
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'sellers' | 'donations' | 'expenses' | 'updates' | 'locations'>('sellers');
  const [loading, setLoading] = useState(false);

  // Notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // States — all start at zero/empty (no fake data)
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [analytics, setAnalytics] = useState({
    totalRaised: 0,
    totalExpenses: 0,
    activeSellersCount: 0,
    establishedCount: 0,
  });

  // Forms states
  // 1. Seller CRUD Form
  const [editingSellerId, setEditingSellerId] = useState<string | null>(null);
  const [sellerForm, setSellerForm] = useState({
    name: '',
    business_name: '',
    category: 'Food' as 'Food' | 'Artisan' | 'Services',
    location: '',
    description: '',
    goal_amount: '',
    status: 'active' as 'active' | 'established',
  });
  const [sellerFile, setSellerFile] = useState<File | null>(null);

  // 2. Donation Form
  const [donationForm, setDonationForm] = useState({
    amount: '',
    category: 'Food Sellers',
    donor_name: '',
    is_anonymous: false,
  });

  // 3. Expense Form
  const [expenseForm, setExpenseForm] = useState({
    candidate_id: '',
    item_name: '',
    category: 'Equipment & Carts',
    amount: '',
    receipt_ref: '',
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // 4. Progress Update Form
  const [updateForm, setUpdateForm] = useState({
    seller_id: '',
    step: '',
    date_label: '',
    is_complete: false,
  });

  // 5. Locations Form
  const [locationForm, setLocationForm] = useState({
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

  // Upload file helper
  const uploadToStorage = async (file: File, bucket: string): Promise<string | null> => {
    if (!isSupabaseConfigured) return '/images/maria.png'; // dummy URL in mock sandbox
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (e: unknown) {
      console.error(e);
      return null;
    }
  };

  // Load actual data from Supabase
  const loadRealData = async () => {
    if (!isSupabaseConfigured) return;
    try {
      // Fetch sellers
      const { data: sellersData, error: sErr } = await supabase
        .from('sellers')
        .select('*')
        .order('created_at', { ascending: false });
      if (sellersData && !sErr) setSellers(sellersData as Seller[]);

      // Fetch dynamic stats
      const { data: allDonations } = await supabase.from('donations').select('amount');
      const { data: allExpenses } = await supabase.from('expenses').select('amount');
      const { data: countActive } = await supabase.from('sellers').select('id').eq('status', 'active');
      const { data: countEstablished } = await supabase.from('sellers').select('id').eq('status', 'established');

      const raisedSum = (allDonations as Array<{ amount: number }> | null)?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
      const expenseSum = (allExpenses as Array<{ amount: number }> | null)?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

      setAnalytics({
        totalRaised: raisedSum, 
        totalExpenses: expenseSum,
        activeSellersCount: countActive?.length || 0,
        establishedCount: countEstablished?.length || 0,
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Load real data on mount — auth is guaranteed by the (admin) layout
  useEffect(() => {
    void (async () => { await loadRealData(); })();
  }, []);

  // CRUD: Add / Edit Seller
  const handleSellerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImgUrl: string | null = sellerForm.status === 'established' ? '/images/maria.png' : '/images/carlos.png';
      if (sellerFile) {
        const uploaded = await uploadToStorage(sellerFile, 'seller-images');
        if (uploaded) finalImgUrl = uploaded;
      }

      const payload = {
        name: sellerForm.name,
        business_name: sellerForm.business_name,
        category: sellerForm.category,
        image_url: finalImgUrl,
        location: sellerForm.location,
        description: sellerForm.description,
        goal_amount: Number(sellerForm.goal_amount) || 0,
        status: sellerForm.status,
      };

      if (isSupabaseConfigured) {
        if (editingSellerId) {
          const { error } = await supabase
            .from('sellers')
            .update(payload as Database['public']['Tables']['sellers']['Update'])
            .eq('id', editingSellerId);
          if (error) throw error;
          triggerNotification('success', 'Seller profile updated successfully.');
        } else {
          const { error } = await supabase.from('sellers').insert([
            { ...payload, raised_amount: 0 },
          ]);
          if (error) throw error;
          triggerNotification('success', 'New seller profile created.');
        }
      } else {
        // Sandbox mock state CRUD
        if (editingSellerId) {
          setSellers(sellers.map(s => s.id === editingSellerId ? { ...s, ...payload } : s));
          triggerNotification('success', 'Mock: Updated seller profile.');
        } else {
          const newMock: Seller = {
            id: 'mock-' + Date.now(),
            ...payload,
            raised_amount: 0,
          };
          setSellers([newMock, ...sellers]);
          triggerNotification('success', 'Mock: Created seller profile.');
        }
      }

      // Reset
      setSellerForm({ name: '', business_name: '', category: 'Food', location: '', description: '', goal_amount: '', status: 'active' });
      setSellerFile(null);
      setEditingSellerId(null);
      loadRealData();
    } catch (err: unknown) {
      triggerNotification('error', err instanceof Error ? err.message : 'Error processing seller.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSeller = (seller: Seller) => {
    setEditingSellerId(seller.id);
    setSellerForm({
      name: seller.name,
      business_name: seller.business_name,
      category: seller.category,
      location: seller.location,
      description: seller.description,
      goal_amount: seller.goal_amount.toString(),
      status: seller.status,
    });
  };

  const handleDeleteSeller = async (id: string) => {
    if (!confirm('Are you sure you want to delete this seller?')) return;
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('sellers').delete().eq('id', id);
        if (error) throw error;
        triggerNotification('success', 'Seller profile deleted from database.');
      } else {
        setSellers(sellers.filter(s => s.id !== id));
        triggerNotification('success', 'Mock: Deleted seller profile.');
      }
      loadRealData();
    } catch (err: unknown) {
      triggerNotification('error', err instanceof Error ? err.message : 'Error deleting seller.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Donation Form
  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const txHash = 'TX-SR-ADMIN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      const payload = {
        amount: Number(donationForm.amount) || 0,
        category: donationForm.category,
        donor_name: donationForm.donor_name || 'Anonymous Sponsor',
        is_anonymous: donationForm.is_anonymous,
        tx_ref: txHash,
      };

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('donations').insert([payload]);
        if (error) throw error;
      }
      
      triggerNotification('success', `Donation of ₹${payload.amount} logged. Hash: ${txHash}`);
      setDonationForm({ amount: '', category: 'Food Sellers', donor_name: '', is_anonymous: false });
      loadRealData();
    } catch (err: unknown) {
      triggerNotification('error', err instanceof Error ? err.message : 'Error logging donation.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Expense Form
  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let receiptUrl = null;
      if (receiptFile) {
        const uploaded = await uploadToStorage(receiptFile, 'receipts');
        if (uploaded) receiptUrl = uploaded;
      }

      const payload = {
        candidate_id: expenseForm.candidate_id || null,
        item_name: expenseForm.item_name,
        category: expenseForm.category,
        amount: Number(expenseForm.amount) || 0,
        receipt_url: receiptUrl,
        receipt_ref: expenseForm.receipt_ref || 'REC-ADMIN-' + Date.now().toString().slice(-4),
      };

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('expenses').insert([payload]);
        if (error) throw error;
      }

      triggerNotification('success', `Expense of ₹${payload.amount} logged to ledger.`);
      setExpenseForm({ candidate_id: '', item_name: '', category: 'Equipment & Carts', amount: '', receipt_ref: '' });
      setReceiptFile(null);
      loadRealData();
    } catch (err: unknown) {
      triggerNotification('error', err instanceof Error ? err.message : 'Error logging expense.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Progress Update Form
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        seller_id: updateForm.seller_id,
        step: updateForm.step,
        date_label: updateForm.date_label,
        is_complete: updateForm.is_complete,
      };

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('progress_updates').insert([payload]);
        if (error) throw error;
      }

      triggerNotification('success', 'Progress timeline update posted.');
      setUpdateForm({ seller_id: '', step: '', date_label: '', is_complete: false });
    } catch (err: unknown) {
      triggerNotification('error', err instanceof Error ? err.message : 'Error creating update.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Location Form
  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        city: locationForm.city,
        name: locationForm.name,
        candidate_name: locationForm.candidate_name,
        address: locationForm.address,
        type: locationForm.type,
        year: locationForm.year,
        coords_x: Number(locationForm.coords_x) || 50,
        coords_y: Number(locationForm.coords_y) || 50,
      };

      if (isSupabaseConfigured) {
        const { error } = await supabase.from('business_locations').insert([payload]);
        if (error) throw error;
      }

      triggerNotification('success', 'Storefront plot details added.');
      setLocationForm({ city: 'Bengaluru', name: '', candidate_name: '', address: '', type: '', year: '2026', coords_x: '50', coords_y: '50' });
    } catch (err: unknown) {
      triggerNotification('error', err instanceof Error ? err.message : 'Error adding storefront plot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in text-xs sm:text-sm">

      {/* Header Panel */}
      <section className="p-6 bg-card rounded-2xl border border-border shadow-sm">
        <div className="space-y-1">
          <span className="text-teal-500 font-bold uppercase tracking-widest text-[10px] block">Legacy Console</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground font-display">
            Admin Ledger Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">
            {!isSupabaseConfigured ? 'Mock Sandbox · Supabase not configured' : 'Live Supabase connected'}
            {' · '}
            <span className="text-amber-500">Legacy view — full candidate system available via sidebar</span>
          </p>
        </div>
      </section>

      {/* Notifications Alert Center */}
      {successMsg && (
        <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-500/5 text-teal-600 dark:text-teal-400 flex gap-2 animate-slide-up">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400 flex gap-2 animate-slide-up">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Analytics Cards Dashboard Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Logged Donations', val: `₹${analytics.totalRaised.toLocaleString()}`, icon: Coins },
          { label: 'Logged Expenditures', val: `₹${analytics.totalExpenses.toLocaleString()}`, icon: FileText },
          { label: 'Active Support List', val: analytics.activeSellersCount, icon: Users },
          { label: 'Storefront Placements', val: analytics.establishedCount, icon: Building },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="border border-border/50 bg-card">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{card.label}</span>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xl sm:text-2xl font-extrabold font-mono text-foreground">{card.val}</h3>
                  <Icon className="h-5 w-5 text-primary opacity-60" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Main Admin Tab Panels Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar Selector */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar gap-2 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-4">
          {([
            { id: 'sellers', label: 'Manage Sellers (CRUD)', icon: Users },
            { id: 'donations', label: 'Log Donation', icon: Coins },
            { id: 'expenses', label: 'Add Expense (Receipt)', icon: FileText },
            { id: 'updates', label: 'Seller Updates', icon: Calendar },
            { id: 'locations', label: 'Add Maps Location', icon: MapPin },
          ] as const).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-left transition-all cursor-pointer shrink-0 whitespace-nowrap lg:w-full',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Body Context */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: Sellers CRUD */}
          {activeTab === 'sellers' && (
            <div className="space-y-6">
              {/* Form card */}
              <Card className="border border-border/60 bg-card text-card-foreground">
                <CardHeader>
                  <CardTitle>{editingSellerId ? 'Edit Seller Profile' : 'Add New Seller Profile'}</CardTitle>
                  <CardDescription>Configure identity, business parameters, and funding goals.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <form onSubmit={handleSellerSubmit} className="grid sm:grid-cols-2 gap-4">
                    
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-foreground block">Seller Name</label>
                      <input
                        type="text"
                        required
                        value={sellerForm.name}
                        onChange={(e) => setSellerForm({ ...sellerForm, name: e.target.value })}
                        placeholder="e.g. Maria Gomez"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-foreground block">Business Name</label>
                      <input
                        type="text"
                        required
                        value={sellerForm.business_name}
                        onChange={(e) => setSellerForm({ ...sellerForm, business_name: e.target.value })}
                        placeholder="e.g. Maria's Fresh Organics"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-foreground block">Business Category</label>
                      <select
                        value={sellerForm.category}
                        onChange={(e) => setSellerForm({ ...sellerForm, category: e.target.value as 'Food' | 'Artisan' | 'Services' })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      >
                        <option value="Food">Food & Beverage</option>
                        <option value="Artisan">Artisan Craft</option>
                        <option value="Services">Local Service</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-foreground block">Active Base Location</label>
                      <input
                        type="text"
                        required
                        value={sellerForm.location}
                        onChange={(e) => setSellerForm({ ...sellerForm, location: e.target.value })}
                        placeholder="e.g. Pilsen, Chicago"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-foreground block">Funding Goal (₹)</label>
                      <input
                        type="number"
                        required
                        value={sellerForm.goal_amount}
                        onChange={(e) => setSellerForm({ ...sellerForm, goal_amount: e.target.value })}
                        placeholder="e.g. 5000"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-foreground block">Platform Status</label>
                      <select
                        value={sellerForm.status}
                        onChange={(e) => setSellerForm({ ...sellerForm, status: e.target.value as 'active' | 'established' })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      >
                        <option value="active">Active Fundraising</option>
                        <option value="established">Storefront Placed (Established)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-bold text-foreground block">Description & Narrative</label>
                      <textarea
                        required
                        rows={3}
                        value={sellerForm.description}
                        onChange={(e) => setSellerForm({ ...sellerForm, description: e.target.value })}
                        placeholder="Describe the seller's narrative, historical background, and specific expansion plans..."
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-foreground block">Profile Portrait Image</label>
                      <div className="border-2 border-dashed border-border hover:border-primary/40 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative">
                        <Upload className="h-6 w-6 text-muted-foreground/80 mb-2" />
                        <span className="text-xs text-foreground font-semibold">
                          {sellerFile ? sellerFile.name : 'Click to select profile photo'}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">Supports PNG, JPG, or WEBP formats.</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files && setSellerFile(e.target.files[0])}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                      {editingSellerId && (
                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          onClick={() => {
                            setEditingSellerId(null);
                            setSellerForm({ name: '', business_name: '', category: 'Food', location: '', description: '', goal_amount: '', status: 'active' });
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button type="submit" variant="primary" size="md" disabled={loading}>
                        {loading ? 'Processing...' : editingSellerId ? 'Save Profile Changes' : 'Register Seller'}
                      </Button>
                    </div>

                  </form>
                </CardContent>
              </Card>

              {/* Sellers table */}
              <Card className="border border-border/60 bg-card overflow-hidden">
                <CardHeader>
                  <CardTitle>Registered Sellers Profiles</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="p-4">Business Name / Founder</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Location</th>
                        <th className="p-4 text-right">Goal Size</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {sellers.map((s) => (
                        <tr key={s.id} className="hover:bg-muted/10">
                          <td className="p-4 flex items-center gap-3">
                            <div className="relative h-9 w-9 rounded-full bg-muted overflow-hidden shrink-0">
                              <Image src={s.image_url || '/images/maria.png'} alt={s.name} width={36} height={36} className="object-cover h-9 w-9" />
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground">{s.business_name}</h4>
                              <p className="text-[10px] text-muted-foreground">{s.name}</p>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-foreground">{s.category}</td>
                          <td className="p-4 text-muted-foreground">{s.location}</td>
                          <td className="p-4 text-right font-bold font-mono text-primary">₹{s.goal_amount.toLocaleString()}</td>
                          <td className="p-4 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => handleEditSeller(s)}
                              className="p-1.5 rounded bg-muted text-foreground hover:text-primary transition-colors cursor-pointer inline-flex border-none"
                              title="Edit Profile"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSeller(s.id)}
                              className="p-1.5 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer inline-flex border-none"
                              title="Delete Profile"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: Donations Entry */}
          {activeTab === 'donations' && (
            <Card className="border border-border/60 bg-card">
              <CardHeader>
                <CardTitle>Log Capital Contribution</CardTitle>
                <CardDescription>Manually enter details of contributions received offline or via check.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <form onSubmit={handleDonationSubmit} className="space-y-4 max-w-xl">
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Donation Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={donationForm.amount}
                      onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })}
                      placeholder="e.g. 250"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Sponsor Sector Route</label>
                    <select
                      value={donationForm.category}
                      onChange={(e) => setDonationForm({ ...donationForm, category: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    >
                      <option value="Food Sellers">Food Sellers Allocation</option>
                      <option value="Artisan Crafts">Artisan Crafts Allocation</option>
                      <option value="General Support">General Priority Pool</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Donor Identity Name</label>
                    <input
                      type="text"
                      disabled={donationForm.is_anonymous}
                      value={donationForm.donor_name}
                      onChange={(e) => setDonationForm({ ...donationForm, donor_name: e.target.value })}
                      placeholder={donationForm.is_anonymous ? 'Anonymous Sponsor' : 'e.g. Clara Jacobs'}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground disabled:opacity-50"
                      required={!donationForm.is_anonymous}
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-muted-foreground select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={donationForm.is_anonymous}
                      onChange={(e) => setDonationForm({ ...donationForm, is_anonymous: e.target.checked, donor_name: e.target.checked ? '' : donationForm.donor_name })}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    />
                    Mark as anonymous contribution on public dashboards.
                  </label>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Logging...' : 'Register Contribution'}
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: Expenses logging */}
          {activeTab === 'expenses' && (
            <Card className="border border-border/60 bg-card">
              <CardHeader>
                <CardTitle>Log Ledger Expenditure</CardTitle>
                <CardDescription>File an expenditure line-item. Requires receipt image verification.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <form onSubmit={handleExpenseSubmit} className="space-y-4 max-w-xl">
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Link Recipient Seller</label>
                    <select
                      required
                      value={expenseForm.candidate_id}
                      onChange={(e) => setExpenseForm({ ...expenseForm, candidate_id: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    >
                      <option value="">Select recipient...</option>
                      {sellers.map((s) => (
                        <option key={s.id} value={s.id}>{s.business_name} ({s.name})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Itemized Purchase Name</label>
                    <input
                      type="text"
                      required
                      value={expenseForm.item_name}
                      onChange={(e) => setExpenseForm({ ...expenseForm, item_name: e.target.value })}
                      placeholder="e.g. Sanitary cart refrigeration unit"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Spend Category</label>
                    <select
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    >
                      <option value="Permits & Licensing">Permits & Licensing</option>
                      <option value="Overhead & Travel">Overhead & Travel</option>
                      <option value="Equipment & Carts">Equipment & Carts</option>
                      <option value="Business Training">Business Training</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Cost Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      placeholder="e.g. 450"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Receipt Reference Number</label>
                    <input
                      type="text"
                      value={expenseForm.receipt_ref}
                      onChange={(e) => setExpenseForm({ ...expenseForm, receipt_ref: e.target.value })}
                      placeholder="Leave blank for automatic generation"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-foreground block">Invoice or Receipt Image File</label>
                    <div className="border-2 border-dashed border-border hover:border-primary/40 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative">
                      <Upload className="h-6 w-6 text-muted-foreground/80 mb-2" />
                      <span className="text-xs text-foreground font-semibold">
                        {receiptFile ? receiptFile.name : 'Select receipt scan image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && setReceiptFile(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Filing...' : 'Record Expenditure'}
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          )}

          {/* TAB 4: Seller Updates */}
          {activeTab === 'updates' && (
            <Card className="border border-border/60 bg-card">
              <CardHeader>
                <CardTitle>Post Seller Progress Timeline Event</CardTitle>
                <CardDescription>Log timeline updates showing stabilization or permitting accomplishments.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <form onSubmit={handleUpdateSubmit} className="space-y-4 max-w-xl">
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Target Seller Profile</label>
                    <select
                      required
                      value={updateForm.seller_id}
                      onChange={(e) => setUpdateForm({ ...updateForm, seller_id: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    >
                      <option value="">Select seller...</option>
                      {sellers.map((s) => (
                        <option key={s.id} value={s.id}>{s.business_name} ({s.name})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Milestone Title Description</label>
                    <input
                      type="text"
                      required
                      value={updateForm.step}
                      onChange={(e) => setUpdateForm({ ...updateForm, step: e.target.value })}
                      placeholder="e.g. 2. Food Safety & Handling Certification Completed"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Timeline Date Label</label>
                    <input
                      type="text"
                      required
                      value={updateForm.date_label}
                      onChange={(e) => setUpdateForm({ ...updateForm, date_label: e.target.value })}
                      placeholder="e.g. Oct 2025"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-muted-foreground select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={updateForm.is_complete}
                      onChange={(e) => setUpdateForm({ ...updateForm, is_complete: e.target.checked })}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    />
                    Mark this milestone step as completed
                  </label>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="primary" disabled={loading}>
                      Create Progress Log
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          )}

          {/* TAB 5: Maps Location */}
          {activeTab === 'locations' && (
            <Card className="border border-border/60 bg-card">
              <CardHeader>
                <CardTitle>Plot Transitioned Storefront Coordinates</CardTitle>
                <CardDescription>Configure physical location coordinates to plot on map layouts.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <form onSubmit={handleLocationSubmit} className="space-y-4 max-w-xl">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-foreground block">Metropolitan Area</label>
                      <select
                        value={locationForm.city}
                        onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value as 'Bengaluru' | 'Mumbai' })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      >
                        <option value="Bengaluru">Bengaluru Metro (BLR)</option>
                        <option value="Mumbai">Mumbai Metro (MUM)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-foreground block">Year Opened</label>
                      <input
                        type="text"
                        required
                        value={locationForm.year}
                        onChange={(e) => setLocationForm({ ...locationForm, year: e.target.value })}
                        placeholder="e.g. 2026"
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Storefront Name</label>
                    <input
                      type="text"
                      required
                      value={locationForm.name}
                      onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                      placeholder="e.g. Maria's Fresh Organics"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Founder & Story Link Reference</label>
                    <input
                      type="text"
                      required
                      value={locationForm.candidate_name}
                      onChange={(e) => setLocationForm({ ...locationForm, candidate_name: e.target.value })}
                      placeholder="e.g. Maria G. (Formerly 5th Ave Fruit Cart)"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Physical Address</label>
                    <input
                      type="text"
                      required
                      value={locationForm.address}
                      onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                      placeholder="e.g. 247 Flatbush Ave, Brooklyn, NY"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground block">Business Type Industry</label>
                    <input
                      type="text"
                      required
                      value={locationForm.type}
                      onChange={(e) => setLocationForm({ ...locationForm, type: e.target.value })}
                      placeholder="e.g. Juices & Fruit Bowls Shop"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-foreground block">Map X Coordinate (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={locationForm.coords_x}
                        onChange={(e) => setLocationForm({ ...locationForm, coords_x: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-foreground block">Map Y Coordinate (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={locationForm.coords_y}
                        onChange={(e) => setLocationForm({ ...locationForm, coords_y: e.target.value })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="primary">
                      Plot Storefront Location
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          )}

        </div>

      </div>

    </div>
  );
}
