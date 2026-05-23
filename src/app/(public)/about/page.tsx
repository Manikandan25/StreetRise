import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Eye, 
  CheckCircle2, 
  TrendingUp,
  Scale,
  Users,
  Building2,
  Wallet,
  FileCheck
} from 'lucide-react';

const corePrinciples = [
  {
    title: 'Absolute Transparency',
    description: 'Every rupee received and spent is logged on a public ledger. We believe trust is built through data, not just stories.',
    icon: Eye,
  },
  {
    title: 'Radical Accountability',
    description: 'The founder covers all operational overhead. 100% of public donations go directly to funding candidate capital assets.',
    icon: ShieldCheck,
  },
  {
    title: 'Human Dignity',
    description: 'We do not deal in pity or charity. We treat street vendors as capable micro-entrepreneurs deserving of respect and investment.',
    icon: HeartHandshake,
  },
  {
    title: 'Sustainable Rehabilitation',
    description: 'We do not just hand over carts. We provide a 3-6 month pipeline of basic needs support (shelter, food, clothing), intense training, and high-quality, fixed-price unbranded inventory.',
    icon: Scale,
  },
  {
    title: 'Fair Pricing & Profit',
    description: 'Selling prices are fixed below market rate to guarantee volume. StreetRise absorbs the loss, while candidates keep a strict 15% profit margin on stock advances.',
    icon: Users,
  },
];

const team = [
  {
    name: 'Manikandan Kolangi',
    role: 'Initiative Founder',
    responsibility: 'Platform Architecture & Ground Operations',
    bio: 'Currently handling the full end-to-end operational cycle—from technical platform development to vetting our very first pilot candidates on the ground. Committed to building a 100% transparent rehabilitation ecosystem.'
  }
];

const faq = [
  {
    q: 'How does the direct funding model work?',
    a: 'I personally fund the candidates out-of-pocket as soon as they are identified. This covers their 3-6 months of basic needs, training allowance, and initial stock advances. Public donations offset these advances retroactively.',
  },
  {
    q: 'How does the training and stock advance work?',
    a: 'In the first 2 weeks, candidates receive training without handling money, earning 10% of revenue or ₹300 daily (whichever is higher). After training, they receive an initial stock advance. They sell the goods, settle our cost price, and keep a strict 15% profit margin.',
  },
  {
    q: 'What happens if a candidate wants to leave?',
    a: 'They can return all inventory items and exit the business at any time. Upon returning the products, they receive a 0-50% refund based on duration, but they will not be considered for the initiative again for the next 6 months.',
  },
  {
    q: 'Are disbursements publicly auditable?',
    a: 'Yes. Every time funds are disbursed for a candidate, the transaction is logged on our Transparency Dashboard.',
  },
];

export default function About() {
  return (
    <div className="flex flex-col gap-24 pb-24 animate-fade-in bg-background text-foreground overflow-hidden">
      
      {/* 1. Mission Statement */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 flex items-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-primary)/10,transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-xs font-bold uppercase tracking-widest text-primary border border-primary/20 bg-primary/5 px-4 py-1.5 rounded-full">
            Our Mission
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl font-display max-w-4xl mx-auto leading-tight">
            Restoring Dignity Through <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">Transparent Rehabilitation.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            StreetRise is a transparency-first initiative dedicated to transitioning vulnerable street vendors into established, legally compliant micro-entrepreneurs.
          </p>
        </div>
      </section>

      {/* 2. Why We Started */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center bg-card border border-border/50 rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold font-display">The Transparency Deficit</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Millions of informal street vendors in India operate in constant financial precarity. They face daily eviction threats, arbitrary fines, and a complete lack of access to commercial credit.
              </p>
              <p>
                Simultaneously, willing donors are increasingly skeptical. Traditional charities often swallow up to 40% of donations in administrative overhead, leaving supporters wondering if their money actually reached the ground.
              </p>
              <p className="font-semibold text-foreground">
                We realized that to truly rehabilitate local economies, we didn&apos;t just need funding—we needed an accountable, zero-overhead system built on absolute trust.
              </p>
            </div>
          </div>
          <div className="bg-secondary/10 rounded-2xl p-8 flex flex-col justify-center space-y-6 border border-border/50 h-full">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-background rounded-xl border border-border shadow-sm text-amber-500">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Financial Precarity</h4>
                <p className="text-xs text-muted-foreground">Lack of compliance forces survival mode.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-background rounded-xl border border-border shadow-sm text-red-500">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Opaque Systems</h4>
                <p className="text-xs text-muted-foreground">Traditional models lack public auditability.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-background rounded-xl border border-border shadow-sm text-teal-500">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">The Missing Link</h4>
                <p className="text-xs text-muted-foreground">Direct transition from street to structured business.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Principles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight font-display">Core Principles</h2>
          <p className="text-muted-foreground text-lg">The uncompromising values that govern our operations.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {corePrinciples.map((val, idx) => {
            const Icon = val.icon;
            return (
              <Card key={idx} className="bg-card border border-border/50 hover:border-primary/50 transition-colors shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display">{val.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{val.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 5. Operational Model (Fund Flow Infographic) */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-teal-400 font-bold uppercase tracking-widest text-xs">Financial Integrity</span>
            <h2 className="text-3xl font-extrabold tracking-tight font-display text-white">Our Operational Model</h2>
            <p className="text-slate-400 text-lg">A strict, closed-loop financial system ensuring zero leakage.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center">
                <Wallet className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg font-display">1. Founder Advances</h3>
              <p className="text-sm text-slate-400 leading-relaxed">As soon as a candidate is verified, the founder immediately pays for their basic needs (shelter, food) and provides their initial inventory stock out-of-pocket.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center space-y-4 relative">
              <div className="hidden md:block absolute top-1/2 -left-4 w-8 border-t-2 border-dashed border-white/20" />
              <div className="w-16 h-16 mx-auto bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg font-display">2. Public Subsidies</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Public donations are collected online and used to offset the founder&apos;s advances and absorb the financial loss of selling products below market rate.</p>
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-white/20" />
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center">
                <FileCheck className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg font-display">3. Training & Profit</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Candidates undergo rigorous 2-week training. Once independent, they settle the inventory cost and keep a strict 15% profit margin for themselves.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Meet The Team */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight font-display">Meet The Founder</h2>
          <p className="text-muted-foreground text-lg">Maintaining accountability on the ground.</p>
        </div>
        
        <div className="max-w-xl mx-auto">
          {team.map((member, idx) => (
            <Card key={idx} className="bg-card border-border shadow-lg overflow-hidden group">
              <CardContent className="p-0">
                <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                <div className="p-8 space-y-4 text-center">
                  <div>
                    <h3 className="text-2xl font-bold font-display text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg border border-border/50 text-xs text-foreground font-semibold flex items-center justify-center gap-2 max-w-xs mx-auto">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {member.responsibility}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                    {member.bio}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4">
          <h3 className="text-2xl font-bold font-display text-foreground">Future Volunteer Network</h3>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            While StreetRise is currently initiated and operated by a single founder, we are actively looking for friends, investors, and volunteers to join the mission as we prepare to scale.
          </p>
          <Link href="/contact" className="inline-block mt-4">
            <Button variant="outline">Join the Initiative</Button>
          </Link>
        </div>
      </section>

      {/* 7. Ethics & Transparency Commitment */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden border border-slate-700">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck className="h-48 w-48" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-teal-400 font-bold uppercase tracking-widest text-xs border border-teal-400/30 px-3 py-1 rounded-full">
              Our Guarantee
            </span>
            <h2 className="text-3xl font-extrabold font-display leading-tight">
              The 100% Direct Disbursement Commitment.
            </h2>
            <p className="text-slate-300 leading-relaxed">
              We pledge that no public donation will ever be used to cover website hosting, volunteer transport, legal consultation fees, or administrative salaries. 
              The founder covers 100% of the overhead so that every rupee you contribute goes directly to candidate assets and compliance fees.
            </p>
            <div className="pt-4">
              <Link href="/dashboard">
                <Button className="bg-white text-slate-900 hover:bg-slate-200">
                  Audit Our Ledger Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Preview */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-display">Common Questions</h2>
          <p className="text-muted-foreground">Understanding our pilot phase model.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {faq.map((item, idx) => (
            <div key={idx} className="bg-card border border-border p-6 rounded-2xl hover:border-primary/30 transition-colors">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-start gap-2">
                <div className="min-w-1.5 min-h-1.5 rounded-full bg-primary mt-1.5" />
                {item.q}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed pl-3 border-l border-border/50">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center pb-12 border-t border-border pt-16">
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-display mb-6">
          Ready to make a difference?
        </h2>
        <div className="flex items-center justify-center gap-4">
          <Link href="/stories">
            <Button variant="primary" size="lg">Support the Pilot</Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
