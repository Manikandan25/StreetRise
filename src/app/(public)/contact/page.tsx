'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle,
  Globe,
  Share2,
  Send,
  Users,
  HelpCircle
} from 'lucide-react';

export default function Contact() {
  return (
    <div className="flex flex-col gap-16 pb-24 animate-fade-in bg-background text-foreground">
      
      {/* Hero */}
      <section className="pt-24 pb-12 sm:pt-32 text-center px-4 border-b border-border/40">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl font-display">
            Get in <span className="text-primary">Touch.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Whether you want to volunteer on the ground, explore a corporate partnership, or just ask a question about our public ledger—we&apos;re here to help.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="bg-card border border-border shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display text-foreground mb-1">Send a Message</h2>
                <p className="text-sm text-muted-foreground">We typically respond within 24 hours.</p>
              </div>
              
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</label>
                    <input type="text" className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</label>
                    <input type="text" className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                  <input type="email" className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inquiry Type</label>
                  <select className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm">
                    <option>General Inquiry</option>
                    <option>Volunteer Application</option>
                    <option>Corporate Partnership</option>
                    <option>Transparency Audit Question</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                  <textarea rows={5} className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none" placeholder="How can we help?" />
                </div>

                <Button className="w-full gap-2 mt-4 h-12" size="lg">
                  <Send className="h-4 w-4" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Direct Contact & Info */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="bg-primary/5 border border-primary/20 p-8 rounded-3xl space-y-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Direct Contact</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-background rounded-lg border border-border/50 text-foreground shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Email Us</p>
                    <a href="mailto:manikandankolangi4@gmail.com" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                      manikandankolangi4@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-background rounded-lg border border-border/50 text-foreground shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Phone Support</p>
                    <p className="text-muted-foreground text-sm italic">
                      Number will be updated soon.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-background rounded-lg border border-border/50 text-foreground shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Headquarters (Pilot)</p>
                    <p className="text-muted-foreground text-sm">
                      Bengaluru, Karnataka<br/>India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-primary/20">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Follow Our Impact</h3>
              <div className="flex gap-3">
                {[MessageCircle, Globe, Share2].map((Icon, idx) => (
                  <button key={idx} className="p-3 bg-background border border-border/50 rounded-xl text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/about" className="group">
              <Card className="border border-border bg-card hover:border-primary/50 transition-colors h-full">
                <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                  <div className="p-2 bg-secondary/10 text-secondary rounded-full">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">Volunteer Info</h4>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/faq" className="group">
              <Card className="border border-border bg-card hover:border-primary/50 transition-colors h-full">
                <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-full">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">Read FAQ</h4>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

        </div>

      </section>
    </div>
  );
}
