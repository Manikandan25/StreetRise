import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
}

export function Input({
  label,
  hint,
  error,
  prefixIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-bold text-foreground uppercase tracking-wider block"
        >
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {prefixIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefixIcon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors duration-150',
            error
              ? 'border-red-500/60 focus:ring-red-500/20 focus:border-red-500'
              : 'border-border',
            prefixIcon && 'pl-9',
            className
          )}
          {...props}
        />
      </div>
      {hint && !error && (
        <p className="text-[11px] text-muted-foreground leading-relaxed">{hint}</p>
      )}
      {error && (
        <p className="text-[11px] text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
