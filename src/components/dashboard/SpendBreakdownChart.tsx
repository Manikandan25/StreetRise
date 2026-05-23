'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const sectors = [
  {
    name: 'Permits & Licensing',
    value: 1200,
    percentage: 80,
    color: 'stroke-indigo-500 text-indigo-500 bg-indigo-500',
    hoverColor: 'hover:stroke-indigo-400',
    dashArray: '150.8 188.5',
    dashOffset: '188.5',
    description: 'FSSAI registrations, municipal street vending licenses, and paperwork filing fees.',
  },
  {
    name: 'Overhead & Travel',
    value: 300,
    percentage: 20,
    color: 'stroke-teal-500 text-teal-500 bg-teal-500',
    hoverColor: 'hover:stroke-teal-400',
    dashArray: '37.7 188.5',
    dashOffset: '37.7',
    description: 'Local transit and verification travel to vet candidate locations in Indiranagar.',
  },
  {
    name: 'Equipment & Carts',
    value: 0,
    percentage: 0,
    color: 'stroke-slate-500 text-slate-500 bg-slate-500 opacity-40',
    hoverColor: 'hover:stroke-slate-400',
    dashArray: '0 188.5',
    dashOffset: '0',
    description: 'Custom-engineered, hygienic street vending carts (₹0 spent in pilot preparation).',
  },
  {
    name: 'Business Training',
    value: 0,
    percentage: 0,
    color: 'stroke-emerald-500 text-emerald-500 bg-emerald-500 opacity-40',
    hoverColor: 'hover:stroke-emerald-400',
    dashArray: '0 188.5',
    dashOffset: '0',
    description: 'Basic accounting books and vendor training sessions (₹0 spent in pilot preparation).',
  },
];

export function SpendBreakdownChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeSector = activeIndex !== null ? sectors[activeIndex] : null;

  return (
    <Card className="border border-border/50 bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Disbursement Breakdown</CardTitle>
        <CardDescription>
          Detailed categorization of how ₹1,500 has been deployed. Hover/click sections to inspect.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          
          {/* Donut Chart SVG */}
          <div className="flex flex-col items-center justify-center relative">
            <svg
              className="w-64 h-64 transform -rotate-90 select-none"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="30"
                className="stroke-muted"
                strokeWidth="12"
                fill="none"
              />
              {/* Slices */}
              {sectors.map((sec, idx) => (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r="30"
                  className={cn(
                    'fill-none transition-all duration-300 cursor-pointer origin-center',
                    sec.color,
                    sec.hoverColor,
                    activeIndex === idx ? 'stroke-[14px]' : 'stroke-[12px]'
                  )}
                  strokeDasharray={sec.dashArray}
                  strokeDashoffset={sec.dashOffset}
                  strokeLinecap="round"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                />
              ))}
            </svg>

            {/* Content in the center of the Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
                {activeSector ? activeSector.name : 'Total Disbursed'}
              </span>
              <span className="text-2xl font-extrabold font-mono text-foreground mt-0.5">
                ₹{(activeSector ? activeSector.value : 1500).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-primary mt-0.5">
                {activeSector ? `${activeSector.percentage}%` : '100% Direct'}
              </span>
            </div>
          </div>

          {/* Legend and Description */}
          <div className="space-y-4">
            <div className="space-y-2">
              {sectors.map((sec, idx) => (
                <button
                  key={idx}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-lg text-left transition-all border border-transparent cursor-pointer',
                    activeIndex === idx
                      ? 'bg-muted/70 border-border/80 shadow-sm'
                      : 'hover:bg-muted/30'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <span className={cn('w-3 h-3 rounded-full shrink-0', sec.color)} />
                    <span className="text-sm font-semibold text-foreground">{sec.name}</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-foreground">{sec.percentage}%</span>
                </button>
              ))}
            </div>

            {/* Interactive display descriptor box */}
            <div className="p-4 rounded-lg bg-muted/40 border border-border/50 min-h-[90px] transition-all duration-300">
              <h4 className="text-xs font-bold text-foreground">
                {activeSector ? `${activeSector.name} Context` : 'Hover Categories'}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {activeSector
                  ? activeSector.description
                  : 'Hover over or click a chart segment or legend item to view context details and operational metrics.'}
              </p>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
