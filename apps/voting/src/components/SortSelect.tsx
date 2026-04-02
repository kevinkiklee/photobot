'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('sort') || 'default';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.set('page', '1');
    const url = `/?${params.toString()}`;
    router.replace(url);
    router.refresh();
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      aria-label="Sort by"
      className="px-2 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-primary focus:outline-none focus:border-[var(--border-default)] transition-colors"
    >
      <option value="default">Default</option>
      <option value="approval">Approval %</option>
      <option value="votes">Most Voted</option>
      <option value="alphabetical">A → Z</option>
    </select>
  );
}
