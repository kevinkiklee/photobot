'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    router.push(`/?${params.toString()}`);
  };

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-brand-primary/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <LucideChevronLeft className="w-4 h-4" />
      </button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
            p === page
              ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/20'
              : 'text-secondary hover:text-primary hover:bg-brand-primary/5'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-brand-primary/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <LucideChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
