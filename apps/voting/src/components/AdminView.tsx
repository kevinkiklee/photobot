'use client';

import { useState, useEffect, useRef } from 'react';
import { LucideChevronDown, LucideChevronRight, LucideThumbsUp, LucideThumbsDown, LucideX } from 'lucide-react';
import { Spinner } from './Spinner';
import type { AdminStats } from '@/lib/admin';

interface AdminViewProps {
  stats: AdminStats;
}

export function AdminStatsBar({ stats }: AdminViewProps) {
  return (
    <div className="flex items-center gap-4 px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs">
      {[
        { label: 'Votes', value: stats.totalVotes },
        { label: 'Voters', value: stats.uniqueVoters },
        { label: 'Unvoted', value: stats.promptsWithZeroVotes },
      ].map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-2">
          {i > 0 && <div className="w-px h-3.5 bg-[var(--border-subtle)]" />}
          <span className="font-semibold text-primary tabular-nums">{value}</span>
          <span className="text-muted uppercase tracking-wider text-[9px]">{label}</span>
        </div>
      ))}
    </div>
  );
}

interface VoterDetailProps {
  promptId: string;
  voteVersion?: number;
}

export function VoterDetail({ promptId, voteVersion = 0 }: VoterDetailProps) {
  const [voters, setVoters] = useState<Array<{ discordUsername: string; vote: string; createdAt: string }> | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastVersion, setLastVersion] = useState(voteVersion);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Auto-refetch when votes change while popover is open
  if (open && voteVersion !== lastVersion) {
    setLastVersion(voteVersion);
    fetch(`/api/admin/voters?promptId=${promptId}`)
      .then(res => res.ok ? res.json() : { voters: [] })
      .then(data => setVoters(data.voters || []))
      .catch(() => {});
  }

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  const toggle = async () => {
    if (open) {
      setOpen(false);
      return;
    }

    setLoading(true);
    setLastVersion(voteVersion);
    try {
      const res = await fetch(`/api/admin/voters?promptId=${promptId}`);
      if (!res.ok) {
        setVoters([]);
      } else {
        const data = await res.json();
        setVoters(data.voters || []);
      }
    } catch {
      setVoters([]);
    }
    setLoading(false);
    setOpen(true);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={toggle}
        aria-expanded={open}
        className="flex items-center gap-1 text-[11px] text-muted hover:text-secondary transition-colors"
      >
        {loading ? <Spinner /> : <LucideChevronRight className="w-3 h-3" />}
        {loading ? 'Loading...' : 'Voters'}
      </button>

      {open && voters && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 z-40 w-56 max-w-[calc(100vw-2rem)] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)] shadow-lg shadow-black/20 animate-scale-in">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)]">
            <span className="text-[11px] font-medium text-secondary">
              {voters.length} voter{voters.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="p-0.5 text-muted hover:text-primary transition-colors"
              aria-label="Close voters"
            >
              <LucideX className="w-3 h-3" />
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto py-1">
            {voters.length === 0 && (
              <p className="text-[11px] text-muted px-3 py-2">No votes yet</p>
            )}
            {voters.map((v, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1 text-[11px] hover:bg-[var(--surface-elevated)] transition-colors">
                {v.vote === 'UP' ? (
                  <LucideThumbsUp className="w-3 h-3 text-green-400 shrink-0" />
                ) : (
                  <LucideThumbsDown className="w-3 h-3 text-red-400 shrink-0" />
                )}
                <span className="text-primary truncate">{v.discordUsername}</span>
                <span className="text-muted ml-auto shrink-0">{new Date(v.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
