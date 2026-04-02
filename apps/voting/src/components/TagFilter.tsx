'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const ALL_TAGS = [
  'motivation', 'workflow', 'style', 'editing', 'portfolio', 'storytelling',
  'collaboration', 'social-media', 'gear', 'ethics', 'business', 'influences',
  'learning', 'projects', 'self-reflection', 'community', 'technique',
];

const TAG_COLORS: Record<string, string> = {
  motivation: 'bg-green-500/15 text-green-400 border-green-500/20',
  workflow: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  style: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  editing: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  portfolio: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  storytelling: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  collaboration: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  'social-media': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  gear: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  ethics: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  business: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  influences: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  learning: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
  projects: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  'self-reflection': 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/20',
  community: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  technique: 'bg-lime-500/15 text-lime-400 border-lime-500/20',
};

export { TAG_COLORS };

export function TagFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

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
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {ALL_TAGS.map(tag => {
        const active = activeTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
              active
                ? TAG_COLORS[tag] || 'bg-brand-primary/15 text-brand-primary border-brand-primary/20'
                : 'bg-transparent text-muted border-subtle hover:text-secondary hover:border-brand-primary/20'
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
