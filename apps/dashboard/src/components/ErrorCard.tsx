'use client';

import { LucideCamera, LucideX } from 'lucide-react';

interface ErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorCard({ title = 'Something went wrong', message, onRetry }: ErrorCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-brand-accent/20 bg-card/50 backdrop-blur-sm animate-fade-up max-w-md mx-auto">
      {/* Camera icon with X overlay */}
      <div className="relative mb-5">
        <div className="p-4 rounded-2xl bg-brand-accent/10 border border-brand-accent/20">
          <LucideCamera className="w-8 h-8 text-brand-accent" strokeWidth={1.5} />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-card border border-brand-accent/30">
          <LucideX className="w-3 h-3 text-brand-accent" strokeWidth={2} />
        </div>
      </div>

      <h2 className="font-display text-lg text-primary mb-2">{title}</h2>
      <p className="text-sm text-secondary leading-relaxed mb-6">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2 rounded-lg text-sm font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
