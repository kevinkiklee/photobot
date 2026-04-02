'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LucideSearch } from 'lucide-react';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') || '');

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
      router.refresh();
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative">
      <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" strokeWidth={1.5} />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Search prompts..."
        className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-sm text-primary placeholder:text-muted focus:outline-none focus:border-[var(--border-default)] transition-colors"
      />
    </div>
  );
}
