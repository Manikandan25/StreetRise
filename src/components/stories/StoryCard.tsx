import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface SellerStory {
  id: string;
  name: string;
  business: string;
  category: 'Food' | 'Artisan' | 'Services';
  image: string;
  location: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  impactNeeds: string[];
  status: 'active' | 'established';
}

export function StoryCard({ seller }: { seller: SellerStory }) {
  const percentRaised = Math.min(100, Math.round((seller.raisedAmount / seller.goalAmount) * 100));

  return (
    <Card className="overflow-hidden border border-border/50 bg-card text-card-foreground flex flex-col h-full hover:shadow-xl transition-all duration-200">
      {/* Image Banner */}
      <div className="relative h-56 w-full bg-muted overflow-hidden">
        <Image
          src={seller.image}
          alt={`${seller.name} - ${seller.business}`}
          fill
          sizes="(max-w-7xl) 33vw, 100vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Category & Status badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-background/90 text-foreground font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider backdrop-blur-sm border border-border/30">
            {seller.category}
          </span>
          <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider backdrop-blur-sm ${
            seller.status === 'established'
              ? 'bg-teal-500 text-teal-950'
              : 'bg-amber-500 text-amber-950'
          }`}>
            {seller.status === 'established' ? 'Storefront Open' : 'Funding Goal'}
          </span>
        </div>
      </div>

      {/* Contents */}
      <CardContent className="p-6 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MapPin className="h-3 w-3 text-primary shrink-0" />
            <span>{seller.location}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground font-display">{seller.name}</h3>
            <p className="text-xs font-semibold text-primary">{seller.business}</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {seller.description}
          </p>
        </div>

        {/* Impact Specifics tags */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <span className="text-[10px] font-bold text-foreground uppercase tracking-widest block">Funding allocation:</span>
          <div className="flex flex-wrap gap-1">
            {seller.impactNeeds.map((need, idx) => (
              <span key={idx} className="bg-muted text-muted-foreground text-[9px] font-medium px-2 py-0.5 rounded border border-border/40">
                {need}
              </span>
            ))}
          </div>
        </div>

        {/* Goal Indicator */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-end text-xs">
            <span className="text-muted-foreground text-[10px]">
              {seller.status === 'established' ? 'Disbursed Total' : 'Ledger Allocation'}
            </span>
            <span className="font-bold text-foreground font-mono">
              ₹{seller.raisedAmount.toLocaleString()} / ₹{seller.goalAmount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                seller.status === 'established' ? 'bg-teal-500' : 'bg-gradient-to-r from-primary to-secondary'
              }`}
              style={{ width: `${percentRaised}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>{percentRaised}% Funded</span>
            <span>{seller.status === 'established' ? 'Complete' : 'Active'}</span>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2">
          <Link href={seller.status === 'established' ? '/dashboard' : '/donate'} className="block w-full">
            <Button
              variant={seller.status === 'established' ? 'outline' : 'primary'}
              size="sm"
              className="w-full justify-center gap-1"
            >
              {seller.status === 'established' ? 'Audit Ledger Transactions' : 'Fund this Entrepreneur'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
