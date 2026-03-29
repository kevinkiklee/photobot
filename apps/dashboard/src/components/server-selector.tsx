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
      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
    >
      <option value="">Select a server...</option>
      {guilds.map((guild) => (
        <option key={guild.id} value={guild.id}>
          {guild.name}
        </option>
      ))}
    </select>
  );
}
