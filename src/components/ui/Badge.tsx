import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'muted'
  | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-primary/10 text-primary border-primary/20',
  primary:
    'bg-primary text-primary-foreground border-primary',
  success:
    'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  warning:
    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  danger:
    'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  muted:
    'bg-muted text-muted-foreground border-border',
  outline:
    'bg-transparent text-foreground border-border',
};

const dotClasses: Record<BadgeVariant, string> = {
  default: 'bg-primary',
  primary: 'bg-white',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  muted: 'bg-muted-foreground',
  outline: 'bg-foreground',
};

export function Badge({
  variant = 'default',
  className,
  children,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn('relative flex h-1.5 w-1.5 rounded-full shrink-0', dotClasses[variant])}
        />
      )}
      {children}
    </span>
  );
}
