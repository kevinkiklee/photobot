'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const COLLAPSED_COUNT = 10;

const ALL_TAGS = [
  'motivation', 'workflow', 'style', 'editing', 'portfolio', 'storytelling',
  'collaboration', 'social-media', 'gear', 'ethics', 'business', 'influences',
  'learning', 'projects', 'self-reflection', 'community', 'technique',
];

const TAG_COLORS: Record<string, string> = {
  motivation: 'bg-green-500/10 text-green-400/80 border-green-500/15',
  workflow: 'bg-blue-500/10 text-blue-400/80 border-blue-500/15',
  style: 'bg-purple-500/10 text-purple-400/80 border-purple-500/15',
  editing: 'bg-orange-500/10 text-orange-400/80 border-orange-500/15',
  portfolio: 'bg-cyan-500/10 text-cyan-400/80 border-cyan-500/15',
  storytelling: 'bg-pink-500/10 text-pink-400/80 border-pink-500/15',
  collaboration: 'bg-yellow-500/10 text-yellow-400/80 border-yellow-500/15',
  'social-media': 'bg-indigo-500/10 text-indigo-400/80 border-indigo-500/15',
  gear: 'bg-slate-500/10 text-slate-400/80 border-slate-500/15',
  ethics: 'bg-rose-500/10 text-rose-400/80 border-rose-500/15',
  business: 'bg-emerald-500/10 text-emerald-400/80 border-emerald-500/15',
  influences: 'bg-amber-500/10 text-amber-400/80 border-amber-500/15',
  learning: 'bg-teal-500/10 text-teal-400/80 border-teal-500/15',
  projects: 'bg-violet-500/10 text-violet-400/80 border-violet-500/15',
  'self-reflection': 'bg-fuchsia-500/10 text-fuchsia-400/80 border-fuchsia-500/15',
  community: 'bg-sky-500/10 text-sky-400/80 border-sky-500/15',
  technique: 'bg-lime-500/10 text-lime-400/80 border-lime-500/15',
};

export { TAG_COLORS };

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
