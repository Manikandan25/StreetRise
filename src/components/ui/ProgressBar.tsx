'use client';

import React, { useEffect, useState, useRef } from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
  colorClass?: string;
}

export function ProgressBar({ progress, className = '', colorClass = 'bg-primary' }: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Small delay for effect
      const timer = setTimeout(() => {
        setWidth(progress);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, progress]);

  return (
    <div ref={ref} className={`h-2 w-full bg-secondary/20 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full transition-all duration-1000 ease-out rounded-full ${colorClass}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
