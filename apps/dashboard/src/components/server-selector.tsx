'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { DiscordGuild } from '@/lib/discord';

export function ServerSelector({ guilds }: { guilds: DiscordGuild[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentServerId = searchParams.get('serverId');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serverId = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (serverId) {
      params.set('serverId', serverId);
    } else {
      params.delete('serverId');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={currentServerId || ''}
      onChange={handleChange}
      className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-subtle bg-card/50 text-primary rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary/40 focus:border-brand-primary/40 backdrop-blur-sm transition-all cursor-pointer hover:border-brand-primary/30"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238ab4c7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
    >
      <option value="">Select server...</option>
      {guilds.map((guild) => (
        <option key={guild.id} value={guild.id}>
          {guild.name}
        </option>
      ))}
    </select>
  );
}
