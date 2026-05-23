'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  ArrowLeft, 
  Save, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function InventoryFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    item_name: '',
    brand_name: '',
    true_cost_price: '',
    candidate_cost_price: '',
    selling_price: '',
    quantity_available: '',
    refundable_percentage: '50',
  });

  useEffect(() => {
    if (!itemId) return;

    const loadItem = async () => {
      setDataLoading(true);
      try {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase
            .from('inventory')
            .select('*')
            .eq('id', itemId)
            .single();

          if (error) throw error;
          if (data) {
            setFormData({
              item_name: data.item_name,
              brand_name: data.brand_name || '',
              true_cost_price: data.true_cost_price.toString(),
              candidate_cost_price: data.candidate_cost_price.toString(),
              selling_price: data.selling_price.toString(),
              quantity_available: data.quantity_available.toString(),
              refundable_percentage: (data.refundable_percentage || 50).toString(),
            });
          }
        } else {
          // Sandbox mock loader
          const stored = localStorage.getItem('sr_inventory');
          if (stored) {
            const list = JSON.parse(stored);
            const found = list.find((item: any) => item.id === itemId);
            if (found) {
              setFormData({
                item_name: found.item_name,
                brand_name: found.brand_name || '',
                true_cost_price: found.true_cost_price.toString(),
                candidate_cost_price: found.candidate_cost_price.toString(),
                selling_price: found.selling_price.toString(),
                quantity_available: found.quantity_available.toString(),
                refundable_percentage: (found.refundable_percentage || 50).toString(),
              });
            }
          }
        }
      } catch (err) {
        console.error('Error loading inventory item:', err);
        setErrorMsg('Failed to load inventory item.');
      } finally {
        setDataLoading(false);
      }
    };

    loadItem();
  }, [itemId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const trueCost = Number(formData.true_cost_price);
    const candidateCost = Number(formData.candidate_cost_price);
    const sellingPrice = Number(formData.selling_price);
    const qty = Number(formData.quantity_available);

    if (candidateCost > sellingPrice) {
      setErrorMsg("Candidate cost price cannot be higher than the public selling price.");
      setLoading(false);
      return;
    }

    const payload = {
      item_name: formData.item_name.trim(),
      brand_name: formData.brand_name.trim() || null,
      true_cost_price: trueCost,
      candidate_cost_price: candidateCost,
      selling_price: sellingPrice,
      quantity_available: qty,
      refundable_percentage: Number(formData.refundable_percentage) || 50,
    };

    try {
      if (isSupabaseConfigured) {
        if (itemId) {
          // Update
          const { error } = await supabase
            .from('inventory')
            .update(payload)
            .eq('id', itemId);

          if (error) throw error;
        } else {
          // Insert
          const { error } = await supabase
            .from('inventory')
            .insert([payload]);

          if (error) throw error;
        }
      } else {
        // Sandbox mock localstorage
        const stored = localStorage.getItem('sr_inventory');
        const list = stored ? JSON.parse(stored) : [];

        if (itemId) {
          const idx = list.findIndex((i: any) => i.id === itemId);
          if (idx !== -1) {
            list[idx] = {
              ...list[idx],
              ...payload,
            };
          }
        } else {
          list.push({
            ...payload,
            id: Math.random().toString(36).substring(2, 15),
            quantity_allocated: 0,
            quantity_returned: 0,
            created_at: new Date().toISOString(),
          });
        }
        localStorage.setItem('sr_inventory', JSON.stringify(list));
      }

      router.push('/admin/inventory');
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const trueCostVal = Number(formData.true_cost_price) || 0;
  const candidateCostVal = Number(formData.candidate_cost_price) || 0;
  const sellingPriceVal = Number(formData.selling_price) || 0;
  const subsidyVal = trueCostVal - candidateCostVal;
  const profitVal = sellingPriceVal - candidateCostVal;

  if (dataLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-5 w-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Link href="/admin/inventory" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-semibold">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Catalog
      </Link>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-500">
          <Package className="h-3.5 w-3.5" />
          Catalog Editor
        </div>
        <h1 className="text-2xl font-extrabold font-display text-foreground tracking-tight">
          {itemId ? 'Edit Catalog Product' : 'Register Catalog Product'}
        </h1>
        <p className="text-xs text-muted-foreground">
          Configure product parameters, brand supplier price audits, and candidate price caps.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span className="text-xs">{errorMsg}</span>
        </div>
      )}

      {/* Product Form Card */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-3">
        <div className="p-6 sm:p-8 space-y-6 lg:col-span-2 border-r border-border/60">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Product Name"
              name="item_name"
              required
              value={formData.item_name}
              onChange={handleInputChange}
              placeholder="e.g. Handmade Woolen Gloves"
              hint="Descriptive name of the inventory item."
            />

            <Input
              label="Brand / Supplier"
              name="brand_name"
              value={formData.brand_name}
              onChange={handleInputChange}
              placeholder="e.g. Quality Knitters Co."
              hint="Approved supplier with highest quality."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Input
              label="True cost price (₹)"
              name="true_cost_price"
              type="number"
              min="0"
              required
              value={formData.true_cost_price}
              onChange={handleInputChange}
              placeholder="e.g. 180"
              hint="Price we pay to buy it."
            />

            <Input
              label="Candidate cost (₹)"
              name="candidate_cost_price"
              type="number"
              min="0"
              required
              value={formData.candidate_cost_price}
              onChange={handleInputChange}
              placeholder="e.g. 120"
              hint="Settleable cost price."
            />

            <Input
              label="Stall selling price (₹)"
              name="selling_price"
              type="number"
              min="0"
              required
              value={formData.selling_price}
              onChange={handleInputChange}
              placeholder="e.g. 200"
              hint="Fixed public price."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Quantity Sourced"
              name="quantity_available"
              type="number"
              min="0"
              required
              value={formData.quantity_available}
              onChange={handleInputChange}
              placeholder="e.g. 50"
              hint="Units available in central stock."
            />

            <Input
              label="Refundable percentage (%)"
              name="refundable_percentage"
              type="number"
              min="0"
              max="100"
              value={formData.refundable_percentage}
              onChange={handleInputChange}
              hint="For returns (default 50%)."
            />
          </div>

        </div>

        {/* Financial projections side pane */}
        <div className="p-6 sm:p-8 bg-muted/15 space-y-6">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Tag className="h-4 w-4 text-teal-500" />
            Financial Breakdown
          </h3>

          <div className="space-y-4">
            {/* Margins breakdown */}
            <div className="p-4 bg-card border border-border/80 rounded-xl space-y-3 shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Supplier Cost:</span>
                <span className="font-semibold text-foreground">₹{trueCostVal}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Candidate Cost:</span>
                <span className="font-semibold text-foreground">₹{candidateCostVal}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Public Retail Price:</span>
                <span className="font-bold text-teal-400">₹{sellingPriceVal}</span>
              </div>
            </div>

            {/* Calculations summaries */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">StreetRise Subsidy margin:</span>
                <span className={`font-bold ${subsidyVal > 0 ? 'text-rose-400' : 'text-muted-foreground'}`}>
                  {subsidyVal > 0 ? `₹${subsidyVal} (discounted)` : '₹0 (no subsidy)'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Candidate Stall Gross Margin:</span>
                <span className={`font-bold ${profitVal > 0 ? 'text-green-400' : 'text-muted-foreground'}`}>
                  {profitVal > 0 ? `₹${profitVal} (${Math.round((profitVal / sellingPriceVal) * 100)}% margin)` : '₹0'}
                </span>
              </div>
            </div>

            {/* Operational guide note */}
            <div className="pt-4 border-t border-border/60 text-[11px] text-muted-foreground leading-relaxed">
              StreetRise sells products at a discount to candidates so they can sell them below current market price. The candidate retains the gross profit margin. The subsidy loss is borne directly by our general donations fund.
            </div>
          </div>

          <div className="pt-6">
            <Button type="submit" variant="primary" className="w-full gap-2" disabled={loading}>
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Product Details'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function AdminOnboardInventoryPage() {
  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto animate-fade-in text-xs sm:text-sm">
      <Suspense fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <div className="h-5 w-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
        </div>
      }>
        <InventoryFormContent />
      </Suspense>
    </div>
  );
}
