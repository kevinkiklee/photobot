'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('sort') || 'approval';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      className="px-3 py-2 rounded-lg bg-card/50 border border-subtle text-sm text-primary focus:outline-none focus:border-brand-primary/30 transition-colors"
    >
      <option value="approval">Approval %</option>
      <option value="votes">Most Voted</option>
      <option value="alphabetical">A → Z</option>
    </select>
  );
}
