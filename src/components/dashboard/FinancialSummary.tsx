'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Coins, Users, Store, ShieldCheck } from 'lucide-react';

const metrics = [
  {
    title: 'Total Funds Raised',
    value: '₹9,300',
    change: 'Pilot Phase Start',
    icon: Coins,
    color: 'text-teal-600 dark:text-teal-400 bg-teal-500/10',
    sparkline: (
      <svg className="w-24 h-8 text-teal-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M0,25 Q15,22 30,22 T60,20 T90,15 T100,10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Disbursed Expenses',
    value: '₹1,500',
    change: 'Licensing & Vetting',
    icon: ShieldCheck,
    color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
    sparkline: (
      <svg className="w-24 h-8 text-indigo-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M0,28 Q15,27 30,26 T60,25 T90,20 T100,15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Vetted Candidates',
    value: '2',
    change: 'In Vetting / Prep',
    icon: Users,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
    sparkline: (
      <svg className="w-24 h-8 text-amber-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M0,25 L20,25 L40,25 L60,22 L80,20 L100,15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Established Locations',
    value: '0',
    change: 'Early Pilot',
    icon: Store,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    sparkline: (
      <svg className="w-24 h-8 text-emerald-500" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M0,28 L100,28" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function FinancialSummary() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <Card key={idx} className="border border-border/50 bg-card text-card-foreground">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {metric.title}
                </span>
                <div className={`p-2.5 rounded-lg ${metric.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="text-3xl font-extrabold tracking-tight font-mono text-foreground">
                    {metric.value}
                  </h3>
                  <span className="text-[11px] font-bold text-teal-500 dark:text-teal-400 mt-1 block">
                    {metric.change}
                  </span>
                </div>
                <div className="opacity-80 hover:opacity-100 transition-opacity">
                  {metric.sparkline}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
