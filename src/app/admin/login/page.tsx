'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrendingUp, Key, Mail, AlertCircle, Info } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Redirect if already logged in (works if Supabase is active)
  useEffect(() => {
    const checkUser = async () => {
      if (!isSupabaseConfigured) return;
      const { data: { session } } = await import('@/lib/supabase').then(mod => mod.supabase.auth.getSession());
      if (session) {
        router.push('/admin');
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // Dynamic import to avoid SSR errors
    const { supabase } = await import('@/lib/supabase');

    if (!isSupabaseConfigured) {
      // Mock Sandbox Auth for preview
      if (email === 'admin@streetrise.org' && password === 'admin123') {
        localStorage.setItem('sr_mock_session', 'true');
        setTimeout(() => {
          setLoading(false);
          router.push('/admin');
        }, 1000);
      } else {
        setLoading(false);
        setErrorMsg('Mock Authentication failed. Use: admin@streetrise.org / admin123');
      }
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setErrorMsg('An unexpected error occurred during authorization.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-background via-muted/20 to-background animate-fade-in">
      <Card className="w-full max-w-md border border-border shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
        
        <CardHeader className="text-center space-y-2 pt-8">
          <div className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold font-display">Admin Portal Access</CardTitle>
          <CardDescription>
            Authenticate to manage street sellers, write ledger entries, and map store locations.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-6">
          
          {/* Notification for sandbox mode */}
          {!isSupabaseConfigured && (
            <div className="flex gap-2.5 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-xs text-amber-600 dark:text-amber-400">
              <Info className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Sandbox Mock Mode active.</span>
                <p className="mt-0.5 leading-normal">
                  Supabase environment keys are not configured. To explore the admin widgets, log in with:
                  <code className="block mt-1 font-mono bg-amber-500/10 px-1 py-0.5 rounded select-all font-bold">
                    admin@streetrise.org / admin123
                  </code>
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="flex gap-2.5 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-600 dark:text-red-400 animate-slide-up">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@streetrise.org"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-muted-foreground" />
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full justify-center gap-2 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}
