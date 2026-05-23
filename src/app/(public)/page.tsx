import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CountUp } from '@/components/ui/CountUp';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  Shield,
  Coins,
  Store,
  Users,
  Award,
  ArrowRight,
  MapPin,
  Search,
  Activity,
  HeartHandshake,
  Quote
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-24 animate-fade-in bg-background text-foreground overflow-hidden">

      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-40 flex items-center min-h-[90vh]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary)/15,transparent_50%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,var(--color-secondary)/10,transparent_50%)]" />
        <div className="absolute inset-0 -z-20 bg-slate-950 dark:bg-slate-950 bg-opacity-5 dark:bg-opacity-100" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Platform Initiated • Scouting Candidates
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl font-display leading-[1.05]">
              Empowering Lives Through <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">
                Radical Transparency
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed font-sans">
              We bridge the gap between willing micro-entrepreneurs and community capital. 
              Every rupee is tracked on an open ledger, ensuring 100% of your support goes directly to 
              rehabilitation, licensing, and dignified self-employment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
              <Link href="/donate" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto text-base h-14 px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                  Seed the Initiative
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 gap-2 bg-background/50 backdrop-blur-sm hover:bg-background/80">
                  <Activity className="h-4 w-4" />
                  View Transparency Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Live Impact Statistics */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-card border border-border/60 shadow-2xl rounded-2xl p-4 sm:p-8 backdrop-blur-xl">
          {[
            { label: 'Pilot Candidates', value: 0, prefix: '', suffix: '', icon: Users },
            { label: 'Total Funds Raised', value: 0, prefix: '₹', suffix: '', icon: Coins },
            { label: 'Target Regions', value: 1, prefix: '', suffix: '', icon: MapPin },
            { label: 'Platform Fees', value: 0, prefix: '', suffix: '%', icon: Shield },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-3 p-4">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-display">
                    <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </h3>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-display">
            The Rehabilitation Journey
          </h2>
          <p className="text-muted-foreground text-lg">A structured, six-step approach to ensure sustainable success and community trust.</p>
        </div>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
          <div className="hidden lg:block absolute top-1/4 left-0 w-full h-0.5 bg-border -z-10" />
          {[
            { title: 'Identification', icon: Search, desc: 'Scouting willing roadside individuals.' },
            { title: 'Basic Needs', icon: HeartHandshake, desc: 'Founder funds shelter & food immediately.' },
            { title: 'Training', icon: Users, desc: '2-week training (10% rev or ₹300 allowance).' },
            { title: 'Inventory Supply', icon: Store, desc: 'Providing fixed-price quality stock.' },
            { title: 'Independence', icon: Award, desc: 'Candidates settle cost & keep 15% profit.' },
            { title: 'Return Policy', icon: Activity, desc: '0-50% refund anytime they exit.' },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="relative flex flex-col items-center text-center space-y-4 group">
                <div className="w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-colors z-10">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground font-display text-sm uppercase tracking-wider">{step.title}</h4>
                  <p className="text-xs text-muted-foreground mt-2 px-2 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Rehabilitation Stories (Empty State) */}
      <section className="bg-muted/30 py-24 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">Pilot Phase</span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-display">
              Awaiting Our First Candidate
            </h2>
            <p className="text-muted-foreground text-lg">
              We are currently scouting Bengaluru for vulnerable but dedicated roadside vendors who are ready to transition into legally compliant micro-entrepreneurs. Our first pilot candidate profile will be listed here soon.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <Card className="bg-background border-border/60 shadow-xl p-8 border-dashed">
              <CardContent className="p-0 flex flex-col items-center justify-center space-y-6">
                <div className="p-4 bg-muted/50 rounded-full text-muted-foreground">
                  <Search className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-foreground">Scouting in Progress</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Our founder is actively conducting ground assessments to find the right individual for our very first seed funding round.
                  </p>
                </div>
                <Link href="/about">
                  <Button variant="outline" className="w-full mt-4 text-xs">Read About Our Vetting Process</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. Transparency Highlights & 7. Why Transparency Matters */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden bg-slate-950 text-white relative shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,var(--color-primary)/20,transparent_60%)]" />
          
          <div className="grid lg:grid-cols-2 gap-12 p-8 sm:p-12 md:p-16 relative z-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-teal-400 font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Why Transparency Matters
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight">
                  Every Single Rupee <br/>Tracked Publicly.
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed max-w-md">
                  Traditional NGOs spend up to 40% on overhead. We spend 0%. 
                  Our founder covers all operational costs so 100% of your donation directly funds capital assets, licensing, and raw materials for the candidates.
                </p>
              </div>
              
              <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Funds utilized for Beneficiaries</span>
                    <span className="text-teal-400 font-bold">100%</span>
                  </div>
                  <ProgressBar progress={100} colorClass="bg-teal-400" className="bg-white/10" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Funds utilized for Operations</span>
                    <span className="text-slate-500 font-bold">0%</span>
                  </div>
                  <ProgressBar progress={0} colorClass="bg-slate-500" className="bg-white/10" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col justify-center space-y-6 text-center">
              <h3 className="text-xl font-bold font-display border-b border-white/10 pb-4">Recent Ledger Activity</h3>
              <div className="space-y-4 py-8 flex flex-col items-center justify-center opacity-60">
                <Activity className="h-8 w-8 text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-300">Ledger is currently empty.</p>
                <p className="text-xs text-slate-500">Transactions will appear here once the first seed donations are received.</p>
              </div>
              <Link href="/dashboard" className="text-center text-sm font-semibold text-teal-400 hover:text-teal-300 pt-4 flex items-center justify-center gap-2">
                Open Full Public Ledger <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Rehabilitation Progress Map */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl font-display">
            Target Pilot Zones
          </h2>
          <p className="text-muted-foreground text-lg">
            We are currently vetting candidates and establishing our operational blueprint in India&apos;s major metropolitan hubs before scaling.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto h-[400px] rounded-3xl bg-card border border-border flex items-center justify-center overflow-hidden shadow-inner">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--color-primary),transparent)]" />
          
          <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-center gap-12 p-8">
            <div className="text-center space-y-3 z-10 bg-background/80 backdrop-blur-md p-6 rounded-2xl border border-border shadow-xl">
              <div className="relative inline-flex">
                <span className="flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                </span>
              </div>
              <h3 className="text-xl font-bold font-display">Bengaluru</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Active Scouting</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="bg-primary/5 py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">The Vision</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <Card className="bg-card border-none shadow-lg relative">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10 rotate-180" />
              <CardContent className="p-8 space-y-6">
                <p className="text-muted-foreground italic leading-relaxed relative z-10 text-lg">
                  &quot;By covering the operational overhead entirely out of pocket during this pilot phase, I want to ensure that the community&apos;s trust is never broken. 100% transparency isn&apos;t a feature—it&apos;s the absolute foundation of StreetRise.&quot;
                </p>
                <div>
                  <p className="font-bold text-foreground">Manikandan Kolangi</p>
                  <p className="text-xs text-primary uppercase tracking-widest mt-1">Initiative Founder</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 9. Volunteer / Partner CTA & 10. Final Donation CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8 mb-12">
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Volunteer */}
          <div className="bg-card border border-border p-8 rounded-3xl flex flex-col items-center text-center space-y-4 hover:border-primary/50 transition-colors">
            <div className="p-3 bg-secondary/10 text-secondary rounded-full">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold font-display">Become an Early Volunteer</h3>
            <p className="text-sm text-muted-foreground">We will soon be looking for friends and volunteers to help vet candidates on the ground.</p>
            <Link href="/contact" className="w-full mt-4">
              <Button variant="outline" className="w-full">Register Interest</Button>
            </Link>
          </div>

          {/* Partner */}
          <div className="bg-card border border-border p-8 rounded-3xl flex flex-col items-center text-center space-y-4 hover:border-primary/50 transition-colors">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <Store className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold font-display">Future Partnerships</h3>
            <p className="text-sm text-muted-foreground">Interested in sponsoring our upcoming candidate assets? Let&apos;s connect.</p>
            <Link href="/contact" className="w-full mt-4">
              <Button variant="outline" className="w-full">Contact Founder</Button>
            </Link>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground p-12 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white/20,transparent_70%)]" />
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display relative z-10">
            Support Our Genesis Fund.
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto relative z-10 text-lg">
            Be one of the very first supporters to seed our escrow account. Your donation will be publicly tracked and deployed to our first verified pilot candidate.
          </p>
          <div className="relative z-10 pt-4">
            <Link href="/donate">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 text-lg h-14 px-10 shadow-xl">
                Donate to Seed Fund
              </Button>
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
