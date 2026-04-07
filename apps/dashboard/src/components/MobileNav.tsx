'use client';

import { LucideScrollText, LucideSettings } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { label: 'Settings', icon: LucideSettings, path: '/settings' },
    { label: 'Audit Log', icon: LucideScrollText, path: '/audit' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass border-t border-subtle pb-safe">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ label, icon: Icon, path }) => {
          const isActive = pathname === path;
          return (
            <button
              key={path}
              onClick={() => router.push(path)}
              aria-label={label}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive ? 'text-brand-primary' : 'text-secondary'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[10px] font-medium">{label}</span>
              {isActive && <div className="absolute bottom-2 w-1 h-1 rounded-full bg-brand-primary" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
