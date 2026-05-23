'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center justify-center rounded-md w-10 h-10 border border-border bg-card text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200 cursor-pointer overflow-hidden',
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon (displays when theme is dark, hides when theme is light) */}
        <span
          className={cn(
            'absolute inset-0 transform transition-transform duration-300 ease-in-out',
            theme === 'light' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          )}
        >
          <Sun className="w-5 h-5 text-amber-400 fill-amber-400" />
        </span>
        {/* Moon Icon (displays when theme is light, hides when theme is dark) */}
        <span
          className={cn(
            'absolute inset-0 transform transition-transform duration-300 ease-in-out',
            theme === 'dark' ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          )}
        >
          <Moon className="w-5 h-5 text-indigo-600 fill-indigo-100 dark:text-indigo-400" />
        </span>
      </div>
    </button>
  );
}
