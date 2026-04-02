'use client';

import { TAG_COLORS } from './TagFilter';
import { VoteButton } from './VoteButton';
import { VoterDetail } from './AdminView';

interface PromptCardProps {
  id: string;
  text: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  approvalPct: number;
  userVote: 'UP' | 'DOWN' | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onVote: (promptId: string, direction: 'UP' | 'DOWN') => Promise<void>;
}

export function PromptCard({ id, text, tags, upvotes, downvotes, approvalPct, userVote, isAuthenticated, isAdmin, onVote }: PromptCardProps) {
  const total = upvotes + downvotes;

  return (
    <div className="p-4 sm:p-5 rounded-xl border border-subtle bg-card/50 backdrop-blur-sm transition-all hover:border-brand-primary/10">
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tags.map(tag => (
          <span
            key={tag}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${TAG_COLORS[tag] || 'bg-brand-primary/15 text-brand-primary border-brand-primary/20'}`}
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-sm text-primary leading-relaxed mb-4">{text}</p>
      <div className="flex items-center gap-3">
        <VoteButton promptId={id} direction="UP" count={upvotes} active={userVote === 'UP'} disabled={!isAuthenticated} onVote={onVote} />
        <VoteButton promptId={id} direction="DOWN" count={downvotes} active={userVote === 'DOWN'} disabled={!isAuthenticated} onVote={onVote} />
        {total > 0 && (
          <>
            <div className="flex-1 h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-brand-primary transition-all"
                style={{ width: `${approvalPct}%` }}
              />
            </div>
            <span className="text-[11px] text-muted font-medium tabular-nums">{approvalPct}%</span>
          </>
        )}
      </div>
      {isAdmin && <div className="mt-3 pt-3 border-t border-subtle"><VoterDetail promptId={id} /></div>}
    </div>
  );
}
