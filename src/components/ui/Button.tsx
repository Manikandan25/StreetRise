import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] duration-150 cursor-pointer',
          {
            // Primary style (Teal/Emerald)
            'bg-primary text-primary-foreground hover:brightness-110 shadow-sm shadow-primary/10':
              variant === 'primary',
            // Secondary style (Indigo/Blue-Violet)
            'bg-secondary text-secondary-foreground hover:brightness-110 shadow-sm shadow-secondary/10':
              variant === 'secondary',
            // Outline style
            'border border-border bg-transparent hover:bg-muted text-foreground':
              variant === 'outline',
            // Ghost style
            'hover:bg-muted text-foreground': variant === 'ghost',
          },
          {
            'px-3 py-1.5 text-xs': size === 'sm',
            'px-5 py-2.5 text-sm': size === 'md',
            'px-7 py-3 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
