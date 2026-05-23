'use client';

import { usePathname } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/supabase';

// Map path prefixes → display title
const PAGE_TITLES: { prefix: string; title: string; subtitle: string }[] = [
  {
    prefix: '/admin/candidates/new',
    title: 'Onboard Candidate',
    subtitle: 'Register a new rehabilitation candidate',
  },
  {
    prefix: '/admin/candidates',
    title: 'Candidates',
    subtitle: 'Manage lifecycle, support, and inventory per candidate',
  },
  {
    prefix: '/admin/inventory/new',
    title: 'Add Inventory Item',
    subtitle: 'Register a new product into the StreetRise supply catalogue',
  },
  {
    prefix: '/admin/inventory',
    title: 'Inventory',
    subtitle: 'Manage products, pricing, and stock levels',
  },
  {
    prefix: '/admin/finances',
    title: 'Finances',
    subtitle: 'Donations received and expenses logged',
  },
  {
    prefix: '/admin/locations',
    title: 'Locations',
    subtitle: 'Map active stall and business plot coordinates',
  },
  {
    prefix: '/admin',
    title: 'Admin Overview',
    subtitle: 'Platform management console',
  },
];

function resolveTitle(pathname: string) {
  // Sort by prefix length descending so most-specific match wins
  const sorted = [...PAGE_TITLES].sort((a, b) => b.prefix.length - a.prefix.length);
  return (
    sorted.find((t) => pathname === t.prefix || pathname.startsWith(t.prefix + '/')) ??
    PAGE_TITLES[PAGE_TITLES.length - 1]
  );
}

export function AdminHeader() {
  const pathname = usePathname();
  const { title, subtitle } = resolveTitle(pathname);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card shrink-0">
      <div className="min-w-0">
        <h2 className="font-bold text-foreground text-base font-display truncate">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-4">
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
            isSupabaseConfigured
              ? 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20'
              : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
          }`}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isSupabaseConfigured ? 'bg-teal-400' : 'bg-amber-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                isSupabaseConfigured ? 'bg-teal-500' : 'bg-amber-500'
              }`}
            />
          </span>
          {isSupabaseConfigured ? 'Live' : 'Sandbox'}
        </span>
      </div>
    </header>
  );
}
