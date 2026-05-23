'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  Landmark, 
  Globe,
  ArrowRight,
  Lock,
  HeartHandshake,
  CheckCircle2,
  FileText
} from 'lucide-react';

const impactTiers = [
  { amount: 500, label: 'Raw Material Support', desc: 'Provides basic hygienic packaging or fresh inventory for 3 days.' },
  { amount: 1200, label: 'Compliance Fee', desc: 'Covers the exact cost of a municipal FSSAI food safety registration.' },
  { amount: 5000, label: 'Structural Upgrade', desc: 'Funds weather-proof tarpaulins, display stands, or hygienic surfaces.' },
  { amount: 15000, label: 'Full Rehabilitation', desc: 'Completely funds a stainless-steel cart and all municipal permits.' }
];

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(1200);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank' | 'card' | 'intl'>('upi');

  return (
    <div className="flex flex-col gap-16 pb-24 animate-fade-in bg-background text-foreground">
      
      {/* 1. Hero Section */}
      <section className="pt-24 pb-12 sm:pt-32 text-center px-4">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
            <ShieldCheck className="h-4 w-4" /> 100% Direct Disbursement
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl font-display">
            Fund a <span className="text-primary">Milestone.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We do not take a single rupee for overhead. Every donation is deposited into an escrow account and tracked publicly until it is used directly for a vendor&apos;s asset or permit.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Donation Form */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="bg-card border border-border shadow-xl rounded-3xl overflow-hidden">
            <div className="bg-muted/50 border-b border-border p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold font-display">Secure Donation</h2>
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Lock className="h-4 w-4" /> 256-bit SSL
              </div>
            </div>
            
            <CardContent className="p-6 sm:p-8 space-y-8">
              {/* Amount Selection */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-foreground">Select Impact Tier (INR)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {impactTiers.map((tier) => (
                    <button
                      key={tier.amount}
                      onClick={() => setSelectedAmount(tier.amount)}
                      className={`py-3 px-2 rounded-xl border-2 font-bold transition-all ${
                        selectedAmount === tier.amount 
                          ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                          : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      ₹{tier.amount}
                    </button>
                  ))}
                </div>
                {/* Custom Amount */}
                <div className="relative mt-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">₹</span>
                  <input 
                    type="number" 
                    placeholder="Custom Amount"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono font-bold"
                    value={selectedAmount || ''}
                    onChange={(e) => setSelectedAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Dynamic Impact Message */}
              {selectedAmount && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3 items-start">
                  <HeartHandshake className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    <span className="font-bold text-primary">Your Impact:</span>{' '}
                    {impactTiers.find(t => t.amount === selectedAmount)?.desc || 'This amount will be placed in the public escrow and allocated towards the next major vendor milestone.'}
                  </p>
                </div>
              )}

              {/* Payment Methods */}
              <div className="space-y-4 pt-4 border-t border-border">
                <label className="text-sm font-bold text-foreground">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${paymentMethod === 'upi' ? 'border-foreground bg-foreground/5' : 'border-border hover:bg-muted'}`}
                  >
                    <Wallet className="h-5 w-5" /> <span className="font-bold text-sm">UPI / QR</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${paymentMethod === 'bank' ? 'border-foreground bg-foreground/5' : 'border-border hover:bg-muted'}`}
                  >
                    <Landmark className="h-5 w-5" /> <span className="font-bold text-sm">Bank Transfer</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${paymentMethod === 'card' ? 'border-foreground bg-foreground/5' : 'border-border hover:bg-muted'}`}
                  >
                    <CreditCard className="h-5 w-5" /> <span className="font-bold text-sm">Card / NetBanking</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('intl')}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all opacity-50 cursor-not-allowed`}
                    disabled
                  >
                    <Globe className="h-5 w-5" /> <span className="font-bold text-sm">International (Soon)</span>
                  </button>
                </div>
              </div>

              {/* CTA */}
              <Button size="lg" className="w-full text-lg h-14 shadow-lg group">
                Proceed to Secure Payment <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <p className="text-center text-[10px] text-muted-foreground">
                By donating, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms & Conditions</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Trust & Transparency Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-950 text-white p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <FileText className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-extrabold font-display mb-4">The Transparency Guarantee</h3>
              <ul className="space-y-4">
                {[
                  '100% of your donation funds the vendor.',
                  'Zero administrative or hosting deductions.',
                  'Your donation creates an immutable ledger entry.',
                  'You will see the receipt of what your money bought.'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-800">
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                    Audit Our Public Ledger
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-6 rounded-3xl">
            <h3 className="font-bold font-display text-foreground mb-2">Section 80G Tax Exemption</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              *Please note: As StreetRise is currently in its grassroots pilot phase, we are processing our NGO registration. We cannot offer 80G tax exemption certificates at this exact moment. All donations are currently classified as direct community support gifts.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}
