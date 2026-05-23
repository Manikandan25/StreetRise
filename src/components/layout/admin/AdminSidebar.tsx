'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  TrendingUp,
  LayoutDashboard,
  Users,
  Package,
  Wallet,
  MapPin,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/admin',
    icon: LayoutDashboard,
    label: 'Overview',
    exact: true,
  },
  {
    href: '/admin/candidates',
    icon: Users,
    label: 'Candidates',
    exact: false,
    badge: 'New',
  },
  {
    href: '/admin/inventory',
    icon: Package,
    label: 'Inventory',
    exact: false,
  },
  {
    href: '/admin/finances',
    icon: Wallet,
    label: 'Finances',
    exact: false,
  },
  {
    href: '/admin/locations',
    icon: MapPin,
    label: 'Locations',
    exact: false,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('sr_mock_session');
    }
    router.push('/admin/login');
  };

  return (
    <aside className="flex flex-col w-64 shrink-0 bg-slate-950 border-r border-slate-800/80 h-screen overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800/80 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 text-white shadow-lg shadow-teal-500/20">
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-white font-bold text-base font-display tracking-tight">
            Street<span className="text-teal-400 font-normal">Rise</span>
          </span>
        </div>
        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest shrink-0">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 pb-3">
          Management
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded-full border border-teal-500/20">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <ChevronRight className="h-3.5 w-3.5 text-teal-500 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="shrink-0 px-3 pb-4 border-t border-slate-800/80 pt-3">
        <div className="px-3 py-2 mb-1">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            Session
          </p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {isSupabaseConfigured ? 'Live · Supabase' : 'Sandbox · Mock'}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all duration-150 border border-transparent cursor-pointer',
            signingOut
              ? 'text-slate-600 cursor-not-allowed'
              : 'text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {signingOut ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}
