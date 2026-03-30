'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { LucideChevronDown, LucideSearch } from 'lucide-react';
import { DiscordGuild } from '@/lib/discord';

interface ServerPopoverProps {
  guilds: DiscordGuild[];
  mode?: 'popover' | 'sheet';
  onClose?: () => void;
}

export function ServerPopover({ guilds, mode = 'popover', onClose }: ServerPopoverProps) {
  const [isOpen, setIsOpen] = useState(mode === 'sheet');
  const [search, setSearch] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentServerId = searchParams.get('serverId');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentGuild = guilds.find(g => g.id === currentServerId);

  const filtered = search
    ? guilds.filter(g => g.name.toLowerCase().includes(search.toLowerCase()))
    : guilds;

  const handleSelect = useCallback((guildId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('serverId', guildId);
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
    setSearch('');
    onClose?.();
    triggerRef.current?.focus();
  }, [router, pathname, searchParams, onClose]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearch('');
    onClose?.();
    triggerRef.current?.focus();
  }, [onClose]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen || mode === 'sheet') return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, handleClose, mode]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, handleClose]);

  const guildInitial = (name: string) => name.charAt(0).toUpperCase();

  const listContent = (
    <>
      {guilds.length >= 5 && (
        <div className="p-2 border-b border-subtle">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-brand-primary/5 border border-subtle">
            <LucideSearch className="w-3.5 h-3.5 text-muted flex-shrink-0" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search servers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-primary placeholder:text-muted outline-none w-full"
              autoFocus
            />
          </div>
        </div>
      )}
      <div className="overflow-y-auto max-h-[320px] p-1.5">
        {filtered.length === 0 ? (
          <p className="text-xs text-muted text-center py-4">No servers found</p>
        ) : (
          filtered.map(guild => {
            const isSelected = guild.id === currentServerId;
            const isOwner = BigInt(guild.permissions) & BigInt(0x8);
            return (
              <button
                key={guild.id}
                onClick={() => handleSelect(guild.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'bg-brand-primary/10 border-l-2 border-brand-primary'
                    : 'hover:bg-brand-primary/5 border-l-2 border-transparent'
                }`}
              >
                {guild.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                    alt=""
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary/30 to-brand-accent/30 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                    {guildInitial(guild.name)}
                  </div>
                )}
                <span className="text-sm text-primary truncate flex-1">{guild.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  isOwner ? 'bg-brand-accent/15 text-brand-accent' : 'bg-brand-primary/15 text-brand-primary'
                }`}>
                  {isOwner ? 'Owner' : 'Admin'}
                </span>
              </button>
            );
          })
        )}
      </div>
    </>
  );

  // Sheet mode (mobile)
  if (mode === 'sheet') {
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
        <div className="absolute bottom-0 left-0 right-0 max-h-[60vh] bg-card border-t border-subtle rounded-t-2xl animate-slide-up pb-safe">
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-8 h-1 rounded-full bg-[var(--border-default)]" />
          </div>
          <h3 className="px-4 pb-2 text-sm font-semibold text-primary">Select Server</h3>
          {listContent}
        </div>
      </div>
    );
  }

  // Popover mode (desktop)
  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select server"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-subtle hover:border-brand-primary/30 bg-card/50 backdrop-blur-sm transition-all text-sm"
      >
        {currentGuild ? (
          <>
            {currentGuild.icon ? (
              <img
                src={`https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.png`}
                alt=""
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-primary/30 to-brand-accent/30 flex items-center justify-center text-[10px] font-bold text-primary">
                {guildInitial(currentGuild.name)}
              </div>
            )}
            <span className="text-primary max-w-[120px] truncate">{currentGuild.name}</span>
          </>
        ) : (
          <span className="text-muted">Select server...</span>
        )}
        <LucideChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-subtle glass shadow-xl animate-scale-in z-50"
        >
          {listContent}
        </div>
      )}
    </div>
  );
}
