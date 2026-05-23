'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  Search, 
  Tag, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { InventoryItem } from '@/lib/types';

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadInventory = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('inventory')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInventory((data as InventoryItem[]) || []);
      } else {
        const stored = localStorage.getItem('sr_inventory');
        if (stored) {
          setInventory(JSON.parse(stored));
        } else {
          setInventory([]);
        }
      }
    } catch (err) {
      console.error('Error loading inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredInventory = inventory.filter((item) =>
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.brand_name && item.brand_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formattingOptions: Intl.NumberFormatOptions = { style: 'currency', currency: 'INR', maximumFractionDigits: 0 };
  const formatCurrency = (val: number) => val.toLocaleString('en-IN', formattingOptions);

  return (
    <div className="p-6 sm:p-8 space-y-8 animate-fade-in text-xs sm:text-sm">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-500">
            <Package className="h-3.5 w-3.5" />
            Inventory Catalogue
          </div>
          <h1 className="text-2xl font-extrabold font-display text-foreground tracking-tight">
            Central Catalog
          </h1>
          <p className="text-xs text-muted-foreground">
            Register products, audit brand cost prices, adjust selling price caps, and monitor program stock levels.
          </p>
        </div>
        <Link href="/admin/inventory/new">
          <Button variant="primary" size="md" className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            Add Inventory Item
          </Button>
        </Link>
      </div>

      {/* Stats summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-5 bg-card border border-border rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Total catalog items</span>
            <p className="text-2xl font-black text-foreground">{inventory.length}</p>
          </div>
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
            <Package className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 bg-card border border-border rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Stock Sourced (In Stock)</span>
            <p className="text-2xl font-black text-foreground">
              {inventory.reduce((acc, curr) => acc + curr.quantity_available, 0)}
            </p>
          </div>
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 bg-card border border-border rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Stock Out (Allocated)</span>
            <p className="text-2xl font-black text-foreground">
              {inventory.reduce((acc, curr) => acc + (curr.quantity_allocated || 0), 0)}
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Filter and search panel */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
        <div className="max-w-md">
          <Input
            placeholder="Search items by product name or brand..."
            prefixIcon={<Search className="h-4 w-4 text-muted-foreground" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Catalog lists */}
      {loading ? (
        <div className="flex justify-center py-20 bg-card border border-border rounded-2xl">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
            <span className="text-sm font-semibold text-muted-foreground">Loading catalog data...</span>
          </div>
        </div>
      ) : filteredInventory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-card border border-border border-dashed rounded-2xl space-y-6">
          <div className="p-4 bg-teal-500/10 text-teal-500 rounded-2xl">
            <Tag className="h-10 w-10" />
          </div>
          <div className="text-center space-y-2 max-w-sm px-4">
            <h3 className="text-lg font-bold font-display text-foreground">No catalog items</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {searchQuery 
                ? "No catalog items match your search filter."
                : "No products have been registered in the central catalogue yet."}
            </p>
          </div>
          {searchQuery ? (
            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
              Reset Search
            </Button>
          ) : (
            <Link href="/admin/inventory/new">
              <Button variant="primary" size="sm">
                Add First Product
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Product Name / Brand</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">True Cost Sourced</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Candidate Settle Cost</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Stall Sale Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Markup / Discount</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Inventory Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredInventory.map((item) => {
                  const loss = item.true_cost_price - item.candidate_cost_price;
                  const isDiscounted = loss > 0;
                  
                  return (
                    <tr key={item.id} className="hover:bg-muted/15 transition-colors">
                      {/* Name / Brand */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-foreground">{item.item_name}</p>
                          <p className="text-[10px] text-muted-foreground">{item.brand_name || 'Generic'}</p>
                        </div>
                      </td>

                      {/* True cost */}
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {formatCurrency(item.true_cost_price)}
                      </td>

                      {/* Candidate Cost */}
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {formatCurrency(item.candidate_cost_price)}
                      </td>

                      {/* Selling price */}
                      <td className="px-6 py-4 font-bold text-teal-400">
                        {formatCurrency(item.selling_price)}
                      </td>

                      {/* Markup or discount */}
                      <td className="px-6 py-4">
                        {isDiscounted ? (
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400">
                            Subsidized (-{formatCurrency(loss)})
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 border border-green-500/20 text-green-400">
                            No Subsidy
                          </span>
                        )}
                      </td>

                      {/* Quantity Stats */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex gap-2">
                            <span className="text-muted-foreground">In Stock:</span>
                            <span className="font-bold text-foreground">{item.quantity_available}</span>
                          </div>
                          <div className="flex gap-2 text-[10px] text-muted-foreground">
                            <span>Allocated: <strong className="text-foreground">{item.quantity_allocated || 0}</strong></span>
                            <span>Returned: <strong className="text-foreground">{item.quantity_returned || 0}</strong></span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/inventory/new?id=${item.id}`}>
                          <button className="text-xs font-semibold text-teal-500 hover:text-teal-400 bg-teal-500/5 hover:bg-teal-500/10 px-2.5 py-1.5 rounded-lg border border-teal-500/10 hover:border-teal-500/20 cursor-pointer">
                            Edit Item
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
