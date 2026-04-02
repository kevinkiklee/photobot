'use client';

import { useState, useEffect } from 'react';
import { LucideShieldCheck, LucideX } from 'lucide-react';

export function AnonymityBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try { setDismissed(localStorage.getItem('banner-dismissed') === 'true'); } catch { setDismissed(false); }
  }, []);

  if (dismissed) return null;

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-brand-primary/15 bg-brand-primary/[0.03] text-xs animate-fade-in">
      <LucideShieldCheck className="w-3.5 h-3.5 text-brand-primary/70 flex-shrink-0" strokeWidth={1.5} />
      <p className="text-secondary flex-1">
        Your votes are anonymous to other members. Server admins can see individual votes to prevent misuse.
      </p>
      <button
        onClick={() => { setDismissed(true); try { localStorage.setItem('banner-dismissed', 'true'); } catch {} }}
        aria-label="Dismiss"
        className="p-0.5 rounded text-muted hover:text-primary transition-colors"
      >
        <LucideX className="w-3 h-3" />
      </button>
    </div>
  );
}
