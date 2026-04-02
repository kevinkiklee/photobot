'use client';

import { useState, useEffect } from 'react';
import { LucideShieldCheck, LucideX } from 'lucide-react';

export function AnonymityBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem('banner-dismissed') === 'true');
  }, []);

  if (dismissed) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-brand-primary/20 bg-brand-primary/5 backdrop-blur-sm text-sm">
      <LucideShieldCheck className="w-4 h-4 text-brand-primary flex-shrink-0" strokeWidth={1.5} />
      <p className="text-secondary flex-1">
        Your votes are anonymous to other members. Admins can see votes to monitor misuse.
      </p>
      <button
        onClick={() => { setDismissed(true); localStorage.setItem('banner-dismissed', 'true'); }}
        className="p-1 rounded-md text-muted hover:text-primary transition-colors"
      >
        <LucideX className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
