'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { LucideChevronsLeft, LucideChevronLeft, LucideChevronRight, LucideChevronsRight } from 'lucide-react';

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
    const url = `/?${params.toString()}`;
    router.replace(url);
    router.refresh();
  };

  // Show 10 pages on desktop, 5 on mobile. Render all 10 and hide extras via CSS.
  const half = 5;
  const start = Math.max(1, Math.min(page - half, totalPages - 9));
  const end = Math.min(totalPages, start + 9);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => goTo(1)}
        disabled={page <= 1}
        className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-[var(--surface-elevated)] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        title="First page"
      >
        <LucideChevronsLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-[var(--surface-elevated)] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        title="Previous page"
      >
        <LucideChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((p, i) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`w-7 h-7 rounded-md text-xs font-medium transition-all inline-flex items-center justify-center ${
            p === page
              ? 'bg-[var(--surface-elevated)] text-primary border border-[var(--border-subtle)]'
              : 'text-muted hover:text-primary hover:bg-[var(--surface-elevated)]'
          } ${i >= 5 ? 'hidden sm:inline-flex' : ''}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-[var(--surface-elevated)] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        title="Next page"
      >
        <LucideChevronRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => goTo(totalPages)}
        disabled={page >= totalPages}
        className="p-1.5 rounded-md text-muted hover:text-primary hover:bg-[var(--surface-elevated)] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        title="Last page"
      >
        <LucideChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
}
