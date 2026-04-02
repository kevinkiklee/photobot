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
  submittedByUsername: string | null;
  onVote: (promptId: string, direction: 'UP' | 'DOWN') => Promise<void>;
}

export function PromptCard({ id, text, tags, upvotes, downvotes, approvalPct, userVote, isAuthenticated, isAdmin, submittedByUsername, onVote }: PromptCardProps) {
  const total = upvotes + downvotes;
  const isUserSubmitted = !!submittedByUsername;

  return (
    <div className={`px-3 py-2 rounded-lg border backdrop-blur-sm transition-all hover:border-brand-primary/10 ${
      isUserSubmitted
        ? 'border-brand-accent/20 bg-brand-accent/[0.03]'
        : 'border-subtle bg-card/50'
    }`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <VoteButton promptId={id} direction="UP" count={upvotes} active={userVote === 'UP'} disabled={!isAuthenticated} onVote={onVote} />
          <VoteButton promptId={id} direction="DOWN" count={downvotes} active={userVote === 'DOWN'} disabled={!isAuthenticated} onVote={onVote} />
          {total > 0 && (
            <span className="text-[11px] text-muted font-medium tabular-nums w-8 text-right">{approvalPct}%</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-primary leading-snug">{text}</p>
          {isUserSubmitted && (
            <p className="text-[10px] text-brand-accent mt-0.5">Submitted by {submittedByUsername}</p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          {isUserSubmitted && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border bg-brand-accent/15 text-brand-accent border-brand-accent/20">
              community
            </span>
          )}
          {tags.map(tag => (
            <span
              key={tag}
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${TAG_COLORS[tag] || 'bg-brand-primary/15 text-brand-primary border-brand-primary/20'}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {isAdmin && <div className="mt-2 pt-2 border-t border-subtle"><VoterDetail promptId={id} /></div>}
    </div>
  );
}
