'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCandidate } from '../layout';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { InventoryItem, InventoryAllocation } from '@/lib/types';
import { 
  Package, 
  Plus, 
  Coins, 
  ArrowRight, 
  CheckCircle, 
  RefreshCcw, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function CandidateInventoryPage() {
  const { candidate } = useCandidate();
  
  // States
  const [allocations, setAllocations] = useState<any[]>([]);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Allocate Form State
  const [allocateForm, setAllocateForm] = useState({
    inventory_id: '',
    quantity: '1',
  });

  // Settlement Form State (active selected row for settlement)
  const [settleRowId, setSettleRowId] = useState<string | null>(null);
  const [settleAmount, setSettleAmount] = useState('');

  // Return Form State (active selected row for return)
  const [returnRowId, setReturnRowId] = useState<string | null>(null);
  const [returnQty, setReturnQty] = useState('');

  const loadInventoryAndAllocations = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        // 1. Fetch catalog
        const { data: catData } = await supabase
          .from('inventory')
          .select('*')
          .order('item_name', { ascending: true });

        // 2. Fetch allocations joined with inventory
        const { data: allocData, error: allocErr } = await supabase
          .from('inventory_allocations')
          .select(`
            *,
            inventory:inventory_id (
              item_name,
              brand_name,
              candidate_cost_price,
              selling_price
            )
          `)
          .eq('candidate_id', candidate.id)
          .order('advance_date', { ascending: false });

        if (allocErr) throw allocErr;

        setInventoryList((catData as InventoryItem[]) || []);
        setAllocations(allocData || []);
      } else {
        // Sandbox mock loader
        const storedInventory = localStorage.getItem('sr_inventory');
        const storedAlloc = localStorage.getItem('sr_inventory_allocations');

        const catalog: InventoryItem[] = storedInventory ? JSON.parse(storedInventory) : [];
        setInventoryList(catalog);

        if (storedAlloc) {
          const list = JSON.parse(storedAlloc).filter((a: any) => a.candidate_id === candidate.id);
          // join mock data
          const joined = list.map((a: any) => {
            const item = catalog.find((i) => i.id === a.inventory_id);
            return {
              ...a,
              inventory: item ? {
                item_name: item.item_name,
                brand_name: item.brand_name,
                candidate_cost_price: item.candidate_cost_price,
                selling_price: item.selling_price
              } : {
                item_name: 'Unknown Item',
                brand_name: 'Unknown',
                candidate_cost_price: 0,
                selling_price: 0
              }
            };
          });
          setAllocations(joined.sort((a: any, b: any) => new Date(b.advance_date).getTime() - new Date(a.advance_date).getTime()));
        } else {
          setAllocations([]);
        }
      }
    } catch (err) {
      console.error('Error loading inventory logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventoryAndAllocations();
  }, [candidate.id]);

  // Handle Advance Stock Submission
  const handleAllocateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemId = allocateForm.inventory_id;
    const qty = Number(allocateForm.quantity);
    if (!itemId || isNaN(qty) || qty <= 0) return;
    setActionLoading(true);
    setErrorMsg(null);

    try {
      const selectedItem = inventoryList.find((i) => i.id === itemId);
      if (!selectedItem) throw new Error("Inventory item not found.");
      if (selectedItem.quantity_available < qty) {
        throw new Error(`Insufficient stock available. Catalog stock: ${selectedItem.quantity_available}`);
      }

      const settlementDue = selectedItem.candidate_cost_price * qty;
      const advanceDate = new Date().toISOString();

      const payload = {
        candidate_id: candidate.id,
        inventory_id: itemId,
        quantity: qty,
        status: 'Advanced',
        advance_date: advanceDate,
        settlement_amount_due: settlementDue,
        amount_settled: 0,
      };

      if (isSupabaseConfigured) {
        // 1. Insert allocation
        const { error: allocErr } = await supabase
          .from('inventory_allocations')
          .insert([payload]);

        if (allocErr) throw allocErr;

        // 2. Adjust inventory counts
        const { error: invErr } = await supabase
          .from('inventory')
          .update({
            quantity_available: selectedItem.quantity_available - qty,
            quantity_allocated: (selectedItem.quantity_allocated || 0) + qty,
          })
          .eq('id', itemId);

        if (invErr) throw invErr;
      } else {
        // Sandbox mock
        const storedAlloc = localStorage.getItem('sr_inventory_allocations');
        const allocList = storedAlloc ? JSON.parse(storedAlloc) : [];
        const newAllocId = Math.random().toString(36).substring(2, 15);
        allocList.push({
          ...payload,
          id: newAllocId,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('sr_inventory_allocations', JSON.stringify(allocList));

        // Update inventory list
        const storedInventory = localStorage.getItem('sr_inventory');
        if (storedInventory) {
          const invList: any[] = JSON.parse(storedInventory);
          const idx = invList.findIndex((i) => i.id === itemId);
          if (idx !== -1) {
            invList[idx].quantity_available -= qty;
            invList[idx].quantity_allocated = (invList[idx].quantity_allocated || 0) + qty;
            localStorage.setItem('sr_inventory', JSON.stringify(invList));
          }
        }
      }

      setAllocateForm({ inventory_id: '', quantity: '1' });
      await loadInventoryAndAllocations();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to allocate stock.');
    } finally {
      setActionLoading(false);
    }
  };

  // Record Settlement Payment
  const handleSettleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(settleAmount);
    if (!settleRowId || isNaN(amt) || amt <= 0) return;
    setActionLoading(true);
    setErrorMsg(null);

    try {
      const activeAlloc = allocations.find((a) => a.id === settleRowId);
      if (!activeAlloc) throw new Error("Allocation not found.");

      const newSettled = Number(activeAlloc.amount_settled) + amt;
      const totalDue = Number(activeAlloc.settlement_amount_due);

      if (newSettled > totalDue) {
        throw new Error(`Payment exceeds balance due of ₹${totalDue - activeAlloc.amount_settled}`);
      }

      const nextStatus = newSettled === totalDue ? 'Settled' : 'Partially Settled';

      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('inventory_allocations')
          .update({
            amount_settled: newSettled,
            status: nextStatus,
          })
          .eq('id', settleRowId);

        if (error) throw error;
      } else {
        const storedAlloc = localStorage.getItem('sr_inventory_allocations');
        if (storedAlloc) {
          const list: any[] = JSON.parse(storedAlloc);
          const idx = list.findIndex((a) => a.id === settleRowId);
          if (idx !== -1) {
            list[idx].amount_settled = newSettled;
            list[idx].status = nextStatus;
            localStorage.setItem('sr_inventory_allocations', JSON.stringify(list));
          }
        }
      }

      setSettleRowId(null);
      setSettleAmount('');
      await loadInventoryAndAllocations();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to post settlement.');
    } finally {
      setActionLoading(false);
    }
  };

  // Return Stock
  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const returnQuantity = Number(returnQty);
    if (!returnRowId || isNaN(returnQuantity) || returnQuantity <= 0) return;
    setActionLoading(true);
    setErrorMsg(null);

    try {
      const activeAlloc = allocations.find((a) => a.id === returnRowId);
      if (!activeAlloc) throw new Error("Allocation not found.");

      const maxReturn = Number(activeAlloc.quantity);
      if (returnQuantity > maxReturn) {
        throw new Error(`Cannot return more than advanced quantity of ${maxReturn}`);
      }

      // Update allocations status and quantity
      const newQuantity = maxReturn - returnQuantity;
      const originalCostPrice = activeAlloc.inventory.candidate_cost_price;
      const newDue = originalCostPrice * newQuantity;
      const updatedSettled = Math.min(newDue, activeAlloc.amount_settled);

      let nextStatus = activeAlloc.status;
      if (newQuantity === 0) {
        nextStatus = 'Returned';
      } else {
        nextStatus = updatedSettled === newDue ? 'Settled' : (updatedSettled > 0 ? 'Partially Settled' : 'Advanced');
      }

      if (isSupabaseConfigured) {
        // 1. Update allocation record
        const { error: allocErr } = await supabase
          .from('inventory_allocations')
          .update({
            quantity: newQuantity,
            settlement_amount_due: newDue,
            amount_settled: updatedSettled,
            status: nextStatus,
          })
          .eq('id', returnRowId);

        if (allocErr) throw allocErr;

        // 2. Fetch inventory catalog details to adjust available counts
        const { data: itemData } = await supabase
          .from('inventory')
          .select('*')
          .eq('id', activeAlloc.inventory_id)
          .single();

        if (itemData) {
          const { error: invErr } = await supabase
            .from('inventory')
            .update({
              quantity_available: itemData.quantity_available + returnQuantity,
              quantity_allocated: Math.max(0, itemData.quantity_allocated - returnQuantity),
              quantity_returned: (itemData.quantity_returned || 0) + returnQuantity,
            })
            .eq('id', activeAlloc.inventory_id);

          if (invErr) throw invErr;
        }
      } else {
        // Sandbox mock
        const storedAlloc = localStorage.getItem('sr_inventory_allocations');
        if (storedAlloc) {
          const list: any[] = JSON.parse(storedAlloc);
          const idx = list.findIndex((a) => a.id === returnRowId);
          if (idx !== -1) {
            list[idx].quantity = newQuantity;
            list[idx].settlement_amount_due = newDue;
            list[idx].amount_settled = updatedSettled;
            list[idx].status = nextStatus;
            localStorage.setItem('sr_inventory_allocations', JSON.stringify(list));
          }
        }

        const storedInventory = localStorage.getItem('sr_inventory');
        if (storedInventory) {
          const invList: any[] = JSON.parse(storedInventory);
          const idx = invList.findIndex((i) => i.id === activeAlloc.inventory_id);
          if (idx !== -1) {
            invList[idx].quantity_available += returnQuantity;
            invList[idx].quantity_allocated = Math.max(0, invList[idx].quantity_allocated - returnQuantity);
            invList[idx].quantity_returned = (invList[idx].quantity_returned || 0) + returnQuantity;
            localStorage.setItem('sr_inventory', JSON.stringify(invList));
          }
        }
      }

      setReturnRowId(null);
      setReturnQty('');
      await loadInventoryAndAllocations();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to return stock.');
    } finally {
      setActionLoading(false);
    }
  };

  const formattingOptions: Intl.NumberFormatOptions = { style: 'currency', currency: 'INR', maximumFractionDigits: 0 };
  const formatCurrency = (val: number) => val.toLocaleString('en-IN', formattingOptions);

  const totalOutstanding = allocations.reduce((acc, curr) => {
    if (curr.status === 'Returned' || curr.status === 'Settled') return acc;
    return acc + (Number(curr.settlement_amount_due) - Number(curr.amount_settled));
  }, 0);

  // Filter catalog items with stock available
  const availableCatalog = inventoryList.filter((i) => i.quantity_available > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in text-xs sm:text-sm">
      
      {/* Left side: Advanced list table */}
      <div className="lg:col-span-2 space-y-6">
        
        {errorMsg && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span className="text-xs">{errorMsg}</span>
          </div>
        )}

        {/* Allocations ledger card */}
        <Card className="border border-border/60 bg-card">
          <CardHeader className="border-b border-border/40 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4.5 w-4.5 text-teal-500" />
                Advanced Stock allocations
              </CardTitle>
              <CardDescription>Catalog cost value is advanced. Settle cost from sales, keeping retail profit.</CardDescription>
            </div>
            <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-lg text-xs font-bold self-start sm:self-auto">
              Stock Outstanding: {formatCurrency(totalOutstanding)}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-5 w-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
              </div>
            ) : allocations.length === 0 ? (
              <div className="text-center py-16 space-y-3 px-6">
                <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground">No stock allocations currently advanced to this candidate.</p>
                <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                  When a candidate enters training or selling phases, allocate products using the side panel catalog form.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/20">
                      <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Item Details</th>
                      <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Qty Sourced</th>
                      <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Cost Value (Due)</th>
                      <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Amount Settled</th>
                      <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {allocations.map((a) => {
                      const balance = Number(a.settlement_amount_due) - Number(a.amount_settled);
                      const isSettled = a.status === 'Settled';
                      const isReturned = a.status === 'Returned';
                      
                      let badgeVariant: 'default' | 'success' | 'warning' | 'danger' | 'muted' = 'default';
                      if (a.status === 'Settled') badgeVariant = 'success';
                      else if (a.status === 'Partially Settled') badgeVariant = 'warning';
                      else if (a.status === 'Returned') badgeVariant = 'muted';

                      return (
                        <tr key={a.id} className="hover:bg-muted/10 transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-bold text-foreground">{a.inventory.item_name}</p>
                            <p className="text-[10px] text-muted-foreground">{a.inventory.brand_name || 'Generic'}</p>
                          </td>
                          <td className="px-5 py-4 font-medium text-foreground">{a.quantity}</td>
                          <td className="px-5 py-4 font-bold text-foreground">{formatCurrency(a.settlement_amount_due)}</td>
                          <td className="px-5 py-4 text-green-400 font-bold">{formatCurrency(a.amount_settled)}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border border-current ${
                              isSettled ? 'text-green-400 bg-green-500/10' :
                              a.status === 'Partially Settled' ? 'text-amber-400 bg-amber-500/10' :
                              isReturned ? 'text-muted-foreground bg-muted' :
                              'text-blue-400 bg-blue-500/10'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right space-y-1.5 min-w-[150px]">
                            
                            {/* Actions block */}
                            {!isSettled && !isReturned && (
                              <div className="flex flex-col gap-1 justify-end">
                                
                                {/* Settle / Pay Button toggle */}
                                {settleRowId === a.id ? (
                                  <form onSubmit={handleSettleSubmit} className="flex gap-1.5 items-center justify-end">
                                    <Input
                                      type="number"
                                      required
                                      min="1"
                                      max={balance}
                                      value={settleAmount}
                                      onChange={(e) => setSettleAmount(e.target.value)}
                                      placeholder={`Max ${balance}`}
                                      className="py-1 px-2 h-7 text-[11px] max-w-[80px]"
                                    />
                                    <Button type="submit" variant="primary" className="h-7 text-[10px] px-2" disabled={actionLoading}>
                                      Pay
                                    </Button>
                                    <button 
                                      type="button" 
                                      onClick={() => setSettleRowId(null)}
                                      className="text-[10px] text-muted-foreground hover:text-foreground font-semibold"
                                    >
                                      X
                                    </button>
                                  </form>
                                ) : returnRowId === a.id ? (
                                  <form onSubmit={handleReturnSubmit} className="flex gap-1.5 items-center justify-end">
                                    <Input
                                      type="number"
                                      required
                                      min="1"
                                      max={a.quantity}
                                      value={returnQty}
                                      onChange={(e) => setReturnQty(e.target.value)}
                                      placeholder={`Max ${a.quantity}`}
                                      className="py-1 px-2 h-7 text-[11px] max-w-[80px]"
                                    />
                                    <Button type="submit" variant="outline" className="h-7 text-[10px] px-2 text-rose-400 hover:text-rose-300 border-rose-500/20 hover:bg-rose-500/10" disabled={actionLoading}>
                                      Ret
                                    </Button>
                                    <button 
                                      type="button" 
                                      onClick={() => setReturnRowId(null)}
                                      className="text-[10px] text-muted-foreground hover:text-foreground font-semibold"
                                    >
                                      X
                                    </button>
                                  </form>
                                ) : (
                                  <div className="flex gap-1.5 justify-end">
                                    <button
                                      onClick={() => { setSettleRowId(a.id); setReturnRowId(null); setSettleAmount(balance.toString()); }}
                                      className="inline-flex items-center gap-0.5 text-[10px] font-bold text-teal-400 hover:text-teal-300 bg-teal-500/5 border border-teal-500/10 hover:border-teal-500/25 px-2 py-1 rounded cursor-pointer"
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                      Settle Cost
                                    </button>
                                    <button
                                      onClick={() => { setReturnRowId(a.id); setSettleRowId(null); setReturnQty(a.quantity.toString()); }}
                                      className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-400 hover:text-rose-300 bg-rose-500/5 border border-rose-500/10 hover:border-rose-500/25 px-2 py-1 rounded cursor-pointer"
                                    >
                                      <RefreshCcw className="h-3 w-3" />
                                      Return
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {(isSettled || isReturned) && (
                              <span className="text-[10px] text-muted-foreground block text-right font-medium">
                                Sourced on {new Date(a.advance_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </span>
                            )}

                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Right Column: Allocate Stock Form */}
      <div>
        <Card className="border border-border/60 bg-card sticky top-6">
          <CardHeader className="border-b border-border/40 pb-3">
            <CardTitle>Advance Inventory Stock</CardTitle>
            <CardDescription>Allocate wholesale items to candidate from central catalogue.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            {availableCatalog.length === 0 ? (
              <div className="space-y-4 py-3 text-center">
                <AlertCircle className="h-7 w-7 text-amber-500 mx-auto" />
                <p className="text-xs text-muted-foreground">
                  No catalog items with available stock are registered in the system database.
                </p>
                <Link href="/admin/inventory">
                  <Button variant="outline" className="w-full text-xs" size="sm">
                    Go to Inventory Catalog
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleAllocateSubmit} className="space-y-4">
                
                <Select
                  label="Select Catalog Item"
                  required
                  value={allocateForm.inventory_id}
                  onChange={(e) => setAllocateForm((prev) => ({ ...prev, inventory_id: e.target.value }))}
                  options={[
                    { value: '', label: 'Select stock item...' },
                    ...availableCatalog.map((i) => ({
                      value: i.id,
                      label: `${i.item_name} (Avail: ${i.quantity_available} | Cost: ₹${i.candidate_cost_price})`,
                    })),
                  ]}
                />

                <Input
                  label="Quantity to Squeeze / Advance"
                  type="number"
                  required
                  min="1"
                  value={allocateForm.quantity}
                  onChange={(e) => setAllocateForm((prev) => ({ ...prev, quantity: e.target.value }))}
                  hint="Units advanced to the candidate storefront stall."
                />

                <div className="p-3 bg-muted/20 border border-border/40 rounded-xl space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Financial Calculation</p>
                  {allocateForm.inventory_id ? (() => {
                    const item = availableCatalog.find((i) => i.id === allocateForm.inventory_id);
                    if (!item) return null;
                    const qty = Number(allocateForm.quantity) || 0;
                    return (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Candidate settleable cost:</span>
                          <span className="font-bold text-foreground">₹{item.candidate_cost_price} × {qty} = ₹{item.candidate_cost_price * qty}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-muted-foreground">Retail stall price:</span>
                          <span className="font-bold text-teal-400">₹{item.selling_price} × {qty} = ₹{item.selling_price * qty}</span>
                        </div>
                        <div className="flex justify-between text-[10px] pt-1 border-t border-border/40">
                          <span className="text-muted-foreground">Stall Gross Profit (kept by candidate):</span>
                          <span className="font-bold text-green-400">₹{(item.selling_price - item.candidate_cost_price) * qty}</span>
                        </div>
                      </div>
                    );
                  })() : (
                    <span className="text-[10px] text-muted-foreground italic">Select an item to view price details.</span>
                  )}
                </div>

                <Button type="submit" variant="primary" className="w-full gap-2" disabled={actionLoading || !allocateForm.inventory_id}>
                  <Plus className="h-4 w-4" />
                  Advance Stock
                </Button>

              </form>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
