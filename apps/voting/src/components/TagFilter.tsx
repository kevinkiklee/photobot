'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ALL_TAGS, TAG_COLORS } from '@/lib/constants';

const COLLAPSED_COUNT = 10;

export function TagFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const [expanded, setExpanded] = useState(false);

  const toggle = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get('tags')?.split(',').filter(Boolean) || [];

    const next = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];

    if (next.length > 0) {
      params.set('tags', next.join(','));
    } else {
      params.delete('tags');
    }
    params.set('page', '1');
    const url = `/?${params.toString()}`;
    router.replace(url);
    router.refresh();
  };

  const visibleTags = expanded ? ALL_TAGS : ALL_TAGS.slice(0, COLLAPSED_COUNT);
  const hiddenCount = ALL_TAGS.length - COLLAPSED_COUNT;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visibleTags.map(tag => {
        const active = activeTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-all whitespace-nowrap ${
              active
                ? TAG_COLORS[tag] || 'bg-brand-primary/10 text-brand-primary/80 border-brand-primary/15'
                : 'bg-transparent text-muted border-[var(--border-subtle)] hover:text-secondary hover:border-[var(--border-default)]'
            }`}
          >
            {tag}
          </button>
        );
      })}
      {!expanded && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="px-2 py-0.5 rounded text-[10px] font-medium text-muted border border-[var(--border-subtle)] hover:text-secondary transition-all"
        >
          +{hiddenCount} more
        </button>
      )}
      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="px-2 py-0.5 rounded text-[10px] font-medium text-muted border border-[var(--border-subtle)] hover:text-secondary transition-all"
        >
          less
        </button>
      )}
    </div>
  );
}
