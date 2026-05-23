'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ShieldCheck, Heart, Mail, MessageCircle, Globe, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-4 xl:gap-12">
          
          {/* Brand Info */}
          <div className="space-y-6 xl:col-span-1">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground font-display">
                Street<span className="text-primary">Rise</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A premium transparency-first platform connecting micro-entrepreneurs with capital, community resources, and long-term business pathways.
            </p>
            <div className="flex items-start space-x-3 text-xs text-foreground bg-muted/50 p-4 rounded-xl border border-border/40 w-fit backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">100% Transparent.<br/>All ledger transactions public.</span>
            </div>
          </div>

          {/* Nav & Resources */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-bold tracking-widest text-foreground uppercase font-display mb-6">Platform</h3>
                <ul className="space-y-4">
                  <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
                  <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About / Mission</Link></li>
                  <li><Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</Link></li>
                  <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Transparency Dashboard</Link></li>
                  <li><Link href="/stories" className="text-sm text-muted-foreground hover:text-primary transition-colors">Impact Stories</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-xs font-bold tracking-widest text-foreground uppercase font-display mb-6">Support Us</h3>
                <ul className="space-y-4">
                  <li><Link href="/donate" className="text-sm text-muted-foreground hover:text-primary transition-colors">Donate Now</Link></li>
                  <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
                  <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                  <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter signup */}
          <div className="mt-16 xl:mt-0 xl:col-span-1 space-y-6">
            <h3 className="text-xs font-bold tracking-widest text-foreground uppercase font-display mb-6">Stay Updated</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Join our mailing list to receive monthly transparency reports and candidate success stories.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  className="w-full rounded-lg border border-border bg-background px-10 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-foreground text-background px-4 py-3 text-sm font-bold hover:bg-foreground/90 transition-all active:scale-[0.98]"
              >
                Subscribe
              </button>
            </form>
            
            <div className="pt-4 flex gap-4">
              {[MessageCircle, Globe, Share2].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Lower footer */}
        <div className="mt-16 border-t border-border pt-8 flex flex-col md:flex-row md:items-center md:justify-between text-xs font-medium text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} StreetRise Initiative. All rights reserved.</p>
          <p className="flex items-center gap-1.5 mt-4 md:mt-0">
            Dignity-driven design built with <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" /> in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
