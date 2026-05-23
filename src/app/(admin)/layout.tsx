'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { AdminSidebar } from '@/components/layout/admin/AdminSidebar';
import { AdminHeader } from '@/components/layout/admin/AdminHeader';

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isSupabaseConfigured) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/admin/login');
          return;
        }
        setAuthenticated(true);
      } else {
        const mockSession =
          typeof window !== 'undefined'
            ? localStorage.getItem('sr_mock_session')
            : null;
        if (mockSession !== 'true') {
          router.replace('/admin/login');
          return;
        }
        setAuthenticated(true);
      }
      setSessionChecked(true);
    };
    checkAuth();
  }, [router]);

  if (!sessionChecked || !authenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-slate-400">
            Verifying session…
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
