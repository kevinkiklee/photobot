'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LucideSettings, LucideScrollText, LucideLayoutGrid } from 'lucide-react';
import { DiscordGuild } from '@/lib/discord';
import { ServerPopover } from './ServerPopover';

interface MobileNavProps {
  guilds: DiscordGuild[];
}

export function MobileNav({ guilds }: MobileNavProps) {
  const [showServerSheet, setShowServerSheet] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigate = (path: string) => {
    const params = new URLSearchParams(searchParams.toString());
    router.push(`${path}?${params.toString()}`);
  };

  const tabs = [
    { label: 'Settings', icon: LucideSettings, path: '/settings' },
    { label: 'Audit Log', icon: LucideScrollText, path: '/audit' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass border-t border-subtle pb-safe">
        <div className="flex items-center justify-around h-16">
          {tabs.map(({ label, icon: Icon, path }) => {
            const isActive = pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                aria-label={label}
                className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                  isActive ? 'text-brand-primary' : 'text-secondary'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-[10px] font-medium">{label}</span>
                {isActive && (
                  <div className="absolute bottom-2 w-1 h-1 rounded-full bg-brand-primary" />
                )}
              </button>
            );
          })}
          <button
            onClick={() => setShowServerSheet(true)}
            aria-label="Servers"
            className="flex flex-col items-center gap-1 px-4 py-2 text-secondary transition-colors"
          >
            <LucideLayoutGrid className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-[10px] font-medium">Servers</span>
          </button>
        </div>
      </nav>

      {showServerSheet && (
        <ServerPopover
          guilds={guilds}
          mode="sheet"
          onClose={() => setShowServerSheet(false)}
        />
      )}
    </>
  );
}
