'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const faqs = [
  {
    category: 'Verification & Support',
    questions: [
      { q: 'How are beneficiaries verified?', a: 'Our ground volunteers personally visit the candidates at their operating locations. We verify identity (Aadhaar/PAN), document their current operational setup, and assess their genuine need for capital infusion to reach legal compliance.' },
      { q: 'How is the donation money actually used?', a: 'Funds are never given as direct cash. Instead, we pay directly for the required assets or services. For example, we pay the municipal corporation directly for an FSSAI license, or we pay a fabricator directly for a stainless-steel cart.' }
    ]
  },
  {
    category: 'Transparency & Tracking',
    questions: [
      { q: 'How can I track my impact?', a: 'You can visit our Transparency Dashboard. Once your donation is utilized, a line item will appear with the exact date, purpose, and the ID of the receipt we uploaded to our system.' },
      { q: 'Where are the reports published?', a: 'Summary audits and compliance reports are published directly on the Transparency Dashboard under the "Audit Reports" section.' },
      { q: 'What happens to the platform fees?', a: 'We do not charge platform fees. 100% of public donations go to the candidate escrow. Our website hosting, domain, and volunteer travel costs are paid completely out-of-pocket by the founding team.' }
    ]
  },
  {
    category: 'Logistics & Policies',
    questions: [
      { q: 'How do I join as a volunteer?', a: 'You can apply through our Contact page. We are currently looking for volunteers in Bengaluru and Mumbai to help with field verification and municipal paperwork filing.' },
      { q: 'What is the refund policy?', a: 'Because donations are pooled into escrow and often deployed immediately for vendor assets, we generally cannot offer refunds once a milestone has been funded. If an error occurred during transaction, please contact us within 24 hours.' },
      { q: 'Are my details secure?', a: 'Yes. We use industry-standard 256-bit SSL encryption. We do not store your credit card details on our servers, and we will never sell your contact information to third parties.' }
    ]
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<string | null>('0-0');

  const toggleOpen = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-16 pb-24 animate-fade-in bg-background text-foreground">
      
      {/* Hero */}
      <section className="pt-24 pb-12 sm:pt-32 border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-6">
          <MessageCircleQuestion className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl font-display">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything you need to know about our operational model, transparency guarantees, and verification process.
          </p>
          
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search for an answer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 w-full space-y-12">
        {faqs.map((group, gIdx) => {
          const filteredQuestions = group.questions.filter(
            q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || q.a.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredQuestions.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-6">
              <h2 className="text-xl font-bold font-display text-primary uppercase tracking-widest text-sm border-b border-border pb-2">
                {group.category}
              </h2>
              <div className="space-y-4">
                {filteredQuestions.map((item, qIdx) => {
                  const id = `${gIdx}-${qIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <Card 
                      key={qIdx} 
                      className={`border cursor-pointer transition-colors ${isOpen ? 'border-primary/50 shadow-sm' : 'border-border hover:border-primary/30'}`}
                      onClick={() => toggleOpen(id)}
                    >
                      <CardContent className="p-0">
                        <div className="flex justify-between items-center p-5">
                          <h3 className="font-bold text-foreground text-sm pr-8">{item.q}</h3>
                          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                        </div>
                        {isOpen && (
                          <div className="px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/40 mt-2 pt-4">
                            {item.a}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {faqs.every(group => group.questions.filter(q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || q.a.toLowerCase().includes(searchQuery.toLowerCase())).length === 0) && (
          <div className="text-center py-12 text-muted-foreground">
            No questions found matching &quot;{searchQuery}&quot;.
          </div>
        )}
      </section>

    </div>
  );
}
