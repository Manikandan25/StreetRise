'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { MapPin, Building, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const citiesData = [
  {
    name: 'Bengaluru',
    code: 'BLR',
    locationsCount: 0,
    storefronts: [] as Array<{
      name: string;
      founder: string;
      address: string;
      type: string;
      year: string;
      coords: { x: number; y: number };
    }>,
  },
  {
    name: 'Mumbai',
    code: 'MUM',
    locationsCount: 0,
    storefronts: [] as Array<{
      name: string;
      founder: string;
      address: string;
      type: string;
      year: string;
      coords: { x: number; y: number };
    }>,
  },
];

export function LocationMap() {
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const [activeLocationIndex, setActiveLocationIndex] = useState<number | null>(null);

  const currentCity = citiesData[activeCityIndex];
  const activeLoc = activeLocationIndex !== null ? currentCity.storefronts[activeLocationIndex] : null;

  return (
    <Card className="border border-border/50 bg-card text-card-foreground">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between pb-6 space-y-4 md:space-y-0">
        <div>
          <CardTitle>Established Storefronts Directory</CardTitle>
          <CardDescription>
            Interactive map & directory of street vendors transitioned to permanent, licensed commercial locations.
          </CardDescription>
        </div>
        
        {/* City Selectors */}
        <div className="flex gap-2">
          {citiesData.map((city, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveCityIndex(idx);
                setActiveLocationIndex(null);
              }}
              className={cn(
                'px-4 py-2 text-xs font-semibold rounded-md transition-all border cursor-pointer',
                activeCityIndex === idx
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background hover:bg-muted text-muted-foreground border-border'
              )}
            >
              {city.name} ({city.locationsCount})
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Schematic SVG Map Box */}
          <div className="lg:col-span-7 bg-muted/40 border border-border/60 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
            <span className="absolute top-4 left-4 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Schematic Location Plot ({currentCity.code})
            </span>
            
            {/* Styled vector plot representing simulated map grid */}
            <svg viewBox="0 0 100 100" className="w-full max-w-[280px] h-auto opacity-70 text-border">
              {/* grid lines */}
              <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="20" y1="0" x2="20" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="80" y1="0" x2="80" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
              
              {/* Schematic geography path outline */}
              <path
                d="M 10,25 Q 30,10 50,20 T 90,30 T 70,80 T 30,90 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-border dark:text-muted/60"
              />

              {/* Location Pins */}
              {currentCity.storefronts.map((loc, idx) => (
                <g
                  key={idx}
                  className="cursor-pointer group"
                  onClick={() => setActiveLocationIndex(idx)}
                >
                  <circle
                    cx={loc.coords.x}
                    cy={loc.coords.y}
                    r={activeLocationIndex === idx ? 6 : 4}
                    className={cn(
                      'transition-all duration-200',
                      activeLocationIndex === idx
                        ? 'fill-teal-400 stroke-teal-600 stroke-2'
                        : 'fill-indigo-500 hover:fill-teal-500'
                    )}
                  />
                  {/* Ping effect for active */}
                  {activeLocationIndex === idx && (
                    <circle
                      cx={loc.coords.x}
                      cy={loc.coords.y}
                      r="12"
                      className="fill-none stroke-teal-400 stroke-1 animate-ping origin-center"
                    />
                  )}
                </g>
              ))}
            </svg>

            {/* Selected Location Details Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur border border-border/80 p-4 rounded-lg shadow-md transition-all duration-300 text-xs">
              {activeLoc ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-extrabold text-foreground">{activeLoc.name}</h4>
                    <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold px-1.5 py-0.5 rounded text-[10px]">
                      Est. {activeLoc.year}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Founded by {activeLoc.founder}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground/80 mt-1">
                    <MapPin className="h-3 w-3 text-primary shrink-0" />
                    <span>{activeLoc.address}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 text-muted-foreground text-[11px] leading-relaxed">
                  Early Pilot Phase: No established storefront locations are active yet. As pilot candidates transition to permanent spaces, their store details will be plotted here.
                </div>
              )}
            </div>
          </div>

          {/* Directory Listings */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2">
              {currentCity.storefronts.length > 0 ? (
                currentCity.storefronts.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveLocationIndex(idx)}
                    className={cn(
                      'w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer',
                      activeLocationIndex === idx
                        ? 'bg-muted/70 border-border/80 shadow-sm'
                        : 'hover:bg-muted/30 border-transparent'
                    )}
                  >
                    <div className={cn(
                      'p-2 rounded-lg mt-0.5 shrink-0 transition-colors',
                      activeLocationIndex === idx
                        ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                        : 'bg-muted text-muted-foreground'
                    )}>
                      <Building className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-foreground">{loc.name}</h4>
                      <p className="text-[11px] text-muted-foreground leading-normal">{loc.founder}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-primary">{loc.type}</span>
                        <span className="text-[9px] text-muted-foreground/60">•</span>
                        <span className="text-[9px] text-muted-foreground/60">{loc.address.split(',')[1]}</span>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border rounded-xl text-center space-y-2">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Building className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">No Storefronts Vested Yet</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[240px]">
                    We are in the pilot preparation phase. We have 0 transitioned street vendors and are currently vetting candidate profiles.
                  </p>
                </div>
              )}
            </div>

            {/* Platform metrics validation indicator */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/5 border border-primary/20 text-xs flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-foreground">Verified Transition Audits</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                  All future transitioned business locations will maintain separate bookkeeping and submit compliance logs to keep their StreetRise verified merchant status active.
                </p>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
