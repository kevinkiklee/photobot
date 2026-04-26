'use client';

import { LucideLoader2, LucideSearch } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') || '');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
      params.set('page', '1');
      const url = `/?${params.toString()}`;
      router.replace(url);
      startTransition(() => {
        router.refresh();
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [value, searchParams.toString, router.replace, router.refresh]);

  return (
    <div className="relative">
      {isPending ? (
        <LucideLoader2
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted animate-spin"
          strokeWidth={1.5}
        />
      ) : (
        <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" strokeWidth={1.5} />
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search prompts"
        placeholder="Search prompts..."
        className={`w-full pl-9 pr-4 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-primary placeholder:text-muted focus:outline-none focus:border-[var(--border-default)] transition-colors ${isPending ? 'opacity-70' : ''}`}
      />
    </div>
  );
}
