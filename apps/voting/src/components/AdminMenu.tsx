'use client';

import { useState, useRef, useEffect } from 'react';
import { LucideShield } from 'lucide-react';

export function AdminMenu({ username }: { username: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative sm:hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-1.5 rounded-md text-brand-accent hover:bg-brand-accent/10 transition-colors"
        title="Admin menu"
      >
        <LucideShield className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)] shadow-lg animate-fade-in z-50 py-1">
          <div className="px-3 py-1.5 text-[10px] text-muted border-b border-[var(--border-subtle)]">
            {username} · Admin
          </div>
          <a
            href="/api/admin/export"
            className="block px-3 py-2 text-xs text-primary hover:bg-[var(--surface-elevated)] transition-colors"
            onClick={() => setOpen(false)}
          >
            Export JSON
          </a>
        </div>
      )}
    </div>
  );
}
