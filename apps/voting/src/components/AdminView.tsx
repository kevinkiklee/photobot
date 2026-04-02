'use client';

import { useState } from 'react';
import { LucideChevronDown, LucideChevronRight, LucideThumbsUp, LucideThumbsDown } from 'lucide-react';
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

  // Auto-refetch when votes change while panel is open
  if (open && voteVersion !== lastVersion) {
    setLastVersion(voteVersion);
    fetch(`/api/admin/voters?promptId=${promptId}`)
      .then(res => res.ok ? res.json() : { voters: [] })
      .then(data => setVoters(data.voters || []))
      .catch(() => {});
  }

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

  const Icon = open ? LucideChevronDown : LucideChevronRight;

  return (
    <div>
      <button onClick={toggle} aria-expanded={open} className="flex items-center gap-1 text-[10px] text-muted hover:text-secondary transition-colors">
        <Icon className="w-3 h-3" />
        {loading ? 'Loading...' : open ? 'Hide voters' : 'Show voters'}
      </button>
      {open && voters && (
        <div className="mt-1.5 space-y-0.5 pl-3.5 border-l border-[var(--border-subtle)] animate-fade-in">
          {voters.length === 0 && <p className="text-[10px] text-muted">No votes yet</p>}
          {voters.map((v, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px]">
              {v.vote === 'UP' ? (
                <LucideThumbsUp className="w-2.5 h-2.5 text-green-400/70" />
              ) : (
                <LucideThumbsDown className="w-2.5 h-2.5 text-red-400/70" />
              )}
              <span className="text-secondary">{v.discordUsername}</span>
              <span className="text-muted">{new Date(v.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
