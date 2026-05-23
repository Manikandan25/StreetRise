import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ShieldCheck, 
  FileCheck,
  Users,
  Wallet,
  Building2,
  Activity,
  Eye,
  FileText,
  Lock,
  CheckCircle2,
  BarChart,
  Scale
} from 'lucide-react';

const workflowSteps = [
  { step: '01', title: 'Immediate Funding', desc: 'Once a candidate is identified, I personally fund their basic needs and training immediately, out-of-pocket, without waiting for escrow pools.', icon: Wallet },
  { step: '02', title: 'Training Phase (Weeks 1-2)', desc: 'Candidates are shadowed and trained. They do not handle money. They receive 10% of revenue or ₹300 (whichever is higher) as a daily allowance.', icon: Users },
  { step: '03', title: 'Basic Needs (Months 1-6)', desc: 'I personally facilitate shelter, food (3 meals), and clothing. Candidates fulfill these basic costs gradually through their independent earnings.', icon: Building2 },
  { step: '04', title: 'Fixed-Price Quality Stock', desc: 'All products are selected and supplied by StreetRise. Selling prices are fixed below market rate (the loss is absorbed by us) to drive immediate volume.', icon: FileCheck },
  { step: '05', title: 'Independent Stock Advances', desc: 'After completing training, candidates receive stock advances. They sell the product, settle the candidate cost price, and keep a strict 15% profit margin.', icon: Activity },
  { step: '06', title: 'Fair Return Policy', desc: 'Candidates can return their inventory and exit the program at any time for a 0-50% refund, but cannot rejoin the initiative for 6 months.', icon: Scale },
];

const transparencyPillars = [
  { title: 'Public Dashboards', desc: 'Every rupee raised and spent is updated in real-time.', icon: BarChart },
  { title: 'Expense Logs', desc: 'Line-by-line breakdowns of all operational and candidate costs.', icon: FileText },
  { title: 'Progress Tracking', desc: 'Visual timelines of each candidate&apos;s journey from street to storefront.', icon: Activity },
  { title: 'Documentation Uploads', desc: 'Scans of official receipts, FSSAI certificates, and invoices.', icon: Eye },
];

export default function HowItWorks() {
  return (
    <div className="flex flex-col gap-24 pb-24 animate-fade-in bg-background text-foreground overflow-hidden">
      
      {/* 1. Introduction */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 flex items-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-secondary)/10,transparent_50%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary border border-secondary/20 bg-secondary/5 px-4 py-1.5 rounded-full">
            The StreetRise Methodology
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl font-display max-w-4xl mx-auto leading-tight">
            Operational Clarity to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-amber-400">Eliminate Skepticism.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We understand why donors are hesitant. We built this platform to answer the question: 
            <span className="italic font-medium text-foreground"> &quot;Where exactly does my money go?&quot;</span>
          </p>
        </div>
      </section>

      {/* 2. Step-by-step Workflow */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight font-display">The 6-Step Intensive Pipeline</h2>
          <p className="text-muted-foreground text-lg">A highly involved, founder-funded journey focusing on training and inventory supply.</p>
        </div>
        
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />
          
          <div className="space-y-12 relative">
            {workflowSteps.map((item, idx) => {
              const Icon = item.icon;
              const isEven = idx % 2 !== 0;
              return (
                <div key={idx} className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`md:w-1/2 flex ${isEven ? 'md:justify-start' : 'md:justify-end'} w-full`}>
                    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm max-w-md w-full relative group hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Step {item.step}</span>
                          <h4 className="text-xl font-bold font-display">{item.title}</h4>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex relative z-10 w-4 h-4 rounded-full bg-secondary border-4 border-background items-center justify-center shrink-0 shadow-[0_0_0_4px_var(--color-border)]" />
                  
                  <div className="md:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Transparency Process */}
      <section className="bg-primary/5 py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">The Transparency Protocol</h2>
            <p className="text-muted-foreground text-lg">How we guarantee your visibility into the project.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {transparencyPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-background border border-border/60 p-6 rounded-2xl hover:shadow-lg transition-shadow">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl w-fit mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold font-display mb-2">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Safety & Anti-Misuse Measures & 5. Funding Allocation Logic */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          <div className="bg-slate-950 text-white p-8 md:p-12 rounded-3xl relative overflow-hidden border border-slate-800 shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Lock className="h-48 w-48 text-red-500" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="inline-flex p-3 rounded-xl bg-red-500/20 text-red-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-extrabold font-display">Zero-Cash Handoff Policy</h2>
              <p className="text-slate-300 leading-relaxed">
                To prevent misuse, <strong className="text-white">I never hand direct cash to candidates.</strong> 
                If a candidate needs a ₹12,000 cart, I pay the fabricator directly. If they need an FSSAI license, I pay the municipal portal. 
                This guarantees 100% of funds are used exactly as advertised.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border p-8 md:p-12 rounded-3xl space-y-6 shadow-sm">
            <div className="inline-flex p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Scale className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-extrabold font-display">Inventory Subsidy Model</h2>
            <p className="text-muted-foreground leading-relaxed">
              We never use affiliate brands. We purchase high-quality unbranded products at True Cost, and supply them to candidates to sell at a fixed, below-market rate.
            </p>
            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Market Competitiveness</span>
                <span className="text-teal-500 font-bold">Guaranteed Volume</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Financial Margin Loss</span>
                <span className="text-muted-foreground">Absorbed by StreetRise</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Reporting Standards & 7. Impact Measurement Metrics */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight font-display">Measuring Real Success</h2>
          <p className="text-muted-foreground text-lg">We don&apos;t measure success by funds raised, but by lives stabilized.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-display border-b border-border pb-2">Reporting Standards</h3>
            <ul className="space-y-4">
              {[
                'Real-time automated ledger updates for all donations.',
                '48-hour SLA for uploading operational expense receipts.',
                'Monthly detailed reports on candidate progress sent to donors.',
                'Open-source repository of all anonymized compliance templates.'
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-display border-b border-border pb-2">Impact Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Legal Compliance', metric: 'FSSAI Licenses Secured' },
                { label: 'Operational Safety', metric: 'Stainless-Steel Carts Deployed' },
                { label: 'Economic Stability', metric: 'Daily Revenue % Increase' },
                { label: 'Systemic Health', metric: 'Zero Eviction Incidents' }
              ].map((item, i) => (
                <Card key={i} className="bg-muted/30 border-none">
                  <CardContent className="p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{item.label}</span>
                    <p className="text-sm font-semibold text-foreground">{item.metric}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Volunteer Participation Flow */}
      <section className="bg-card border-y border-border py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <Users className="h-12 w-12 text-secondary mx-auto" />
          <h2 className="text-3xl font-extrabold tracking-tight font-display">Future Volunteer Integration</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            While I am currently handling the entire ground operation during this pilot phase, our model relies heavily on local citizens. Once we scale, volunteers won&apos;t just hand out flyers—they will act as case managers. They will sit with vendors, fill out municipal forms on their phones, and take photos of the deployed carts to upload to our transparency dashboard. This will create a decentralized web of accountability.
          </p>
        </div>
      </section>

      {/* 9. CTA Sections */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-primary text-primary-foreground p-8 rounded-3xl text-center space-y-4 hover:-translate-y-1 transition-transform duration-300 shadow-xl">
            <h3 className="text-xl font-bold font-display">Start Funding</h3>
            <p className="text-sm opacity-90 leading-relaxed">Choose a pilot candidate and watch your contribution transform their business securely.</p>
            <div className="pt-4">
              <Link href="/donate">
                <Button className="w-full bg-background text-foreground hover:bg-background/90 shadow-sm">
                  Donate Now
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-secondary text-secondary-foreground p-8 rounded-3xl text-center space-y-4 hover:-translate-y-1 transition-transform duration-300 shadow-xl">
            <h3 className="text-xl font-bold font-display">Audit Our Work</h3>
            <p className="text-sm opacity-90 leading-relaxed">Don&apos;t take our word for it. Review the real-time public ledger and see every receipt.</p>
            <div className="pt-4">
              <Link href="/dashboard">
                <Button className="w-full bg-background text-foreground hover:bg-background/90 shadow-sm">
                  View Ledger
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-card border border-border p-8 rounded-3xl text-center space-y-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
            <h3 className="text-xl font-bold font-display">Join the Ground Team</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Live in Bengaluru or Mumbai? Help me vet future candidates and file municipal paperwork.</p>
            <div className="pt-4">
              <Link href="/about">
                <Button variant="outline" className="w-full">
                  Become a Volunteer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
