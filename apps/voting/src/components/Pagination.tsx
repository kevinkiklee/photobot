'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LucideChevronsLeft, LucideChevronLeft, LucideChevronRight, LucideChevronsRight } from 'lucide-react';
import { Spinner } from './Spinner';

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<number | null>(null);

  // Reset loading when page changes (navigation completed)
  useEffect(() => {
    setLoading(null);
  }, [page]);

  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    setLoading(p);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    const url = `/?${params.toString()}`;
    router.replace(url);
    router.refresh();
  };

  // Show 10 pages on desktop
  const half = 5;
  const start = Math.max(1, Math.min(page - half, totalPages - 9));
  const end = Math.min(totalPages, start + 9);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const isLoading = loading !== null && loading !== page;

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => goTo(1)}
        disabled={page <= 1 || isLoading}
        className="p-2 rounded-md text-muted hover:text-primary hover:bg-[var(--surface-elevated)] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        title="First page"
      >
        <LucideChevronsLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1 || isLoading}
        className="p-2 rounded-md text-muted hover:text-primary hover:bg-[var(--surface-elevated)] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        title="Previous page"
      >
        <LucideChevronLeft className="w-4 h-4" />
      </button>
      {/* Desktop: full page range */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          disabled={isLoading}
          className={`hidden sm:inline-flex w-7 h-7 rounded-md text-xs font-medium transition-all items-center justify-center ${
            p === page
              ? 'bg-[var(--surface-elevated)] text-primary border border-[var(--border-subtle)]'
              : 'text-muted hover:text-primary hover:bg-[var(--surface-elevated)]'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading === p ? <Spinner className="w-3 h-3" /> : p}
        </button>
      ))}
      {/* Mobile: compact page indicator */}
      <span className="sm:hidden text-xs text-muted tabular-nums px-1 inline-flex items-center gap-1.5">
        {isLoading && <Spinner className="w-3 h-3" />}
        {page} / {totalPages}
      </span>
      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages || isLoading}
        className="p-2 rounded-md text-muted hover:text-primary hover:bg-[var(--surface-elevated)] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        title="Next page"
      >
        <LucideChevronRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => goTo(totalPages)}
        disabled={page >= totalPages || isLoading}
        className="p-2 rounded-md text-muted hover:text-primary hover:bg-[var(--surface-elevated)] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        title="Last page"
      >
        <LucideChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
}
