'use client';

import { useState } from 'react';
import { LucideChevronDown, LucideChevronRight, LucideThumbsUp, LucideThumbsDown } from 'lucide-react';
import type { AdminStats } from '@/lib/admin';

interface AdminViewProps {
  stats: AdminStats;
}

export function AdminStatsBar({ stats }: AdminViewProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: 'Total Votes', value: stats.totalVotes },
        { label: 'Unique Voters', value: stats.uniqueVoters },
        { label: 'No Votes Yet', value: stats.promptsWithZeroVotes },
      ].map(({ label, value }) => (
        <div key={label} className="p-3 rounded-xl border border-subtle bg-card/50 text-center">
          <p className="text-lg font-display text-primary">{value}</p>
          <p className="text-[10px] text-muted uppercase tracking-wider">{label}</p>
        </div>
      ))}
    </div>
  );
}

interface VoterDetailProps {
  promptId: string;
}

export function VoterDetail({ promptId }: VoterDetailProps) {
  const [voters, setVoters] = useState<Array<{ discordUsername: string; vote: string; createdAt: string }> | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (open) {
      setOpen(false);
      return;
    }

    if (!voters) {
      setLoading(true);
      const res = await fetch(`/api/admin/voters?promptId=${promptId}`);
      const data = await res.json();
      setVoters(data.voters);
      setLoading(false);
    }
    setOpen(true);
  };

  const Icon = open ? LucideChevronDown : LucideChevronRight;

  return (
    <div>
      <button onClick={toggle} className="flex items-center gap-1 text-[11px] text-muted hover:text-secondary transition-colors">
        <Icon className="w-3 h-3" />
        {loading ? 'Loading...' : open ? 'Hide voters' : 'Show voters'}
      </button>
      {open && voters && (
        <div className="mt-2 space-y-1 pl-4 border-l border-subtle">
          {voters.length === 0 && <p className="text-[11px] text-muted">No votes yet</p>}
          {voters.map((v, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px]">
              {v.vote === 'UP' ? (
                <LucideThumbsUp className="w-3 h-3 text-green-400" />
              ) : (
                <LucideThumbsDown className="w-3 h-3 text-red-400" />
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
