'use client';

import { LucidePencil, LucideTrash2 } from 'lucide-react';
import { useState } from 'react';
import { VoterDetail } from './AdminView';
import { PromptCardActions } from './PromptCardActions';
import { PromptCardEdit } from './PromptCardEdit';
import { Spinner } from './Spinner';

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
  submittedBy: string | null;
  submittedByUsername: string | null;
  currentUserId: string | null;
  duplicateCount: number;
  userFlaggedDuplicate: boolean;
  tagVotes: Record<string, { addCount: number; removeCount: number; userAction: string | null }>;
  suggestedTags: string[];
  onVote: (promptId: string, direction: 'UP' | 'DOWN') => Promise<void>;
  onEdit: (promptId: string, newText: string, newTags: string[]) => Promise<void>;
  onDelete: (promptId: string) => Promise<void>;
  onFlagDuplicate: (promptId: string) => Promise<void>;
  onTagVote: (promptId: string, tag: string, action: 'ADD' | 'REMOVE') => Promise<void>;
}

export function PromptCard({
  id,
  text,
  tags,
  upvotes,
  downvotes,
  approvalPct,
  userVote,
  isAuthenticated,
  isAdmin,
  submittedBy,
  submittedByUsername,
  currentUserId,
  duplicateCount,
  userFlaggedDuplicate,
  tagVotes,
  suggestedTags,
  onVote,
  onEdit,
  onDelete,
  onFlagDuplicate,
  onTagVote,
}: PromptCardProps) {
  const isUserSubmitted = !!submittedBy;
  const isOwner = !!currentUserId && submittedBy === currentUserId;
  const canDelete = isUserSubmitted && (isOwner || isAdmin);

  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <div
      className={`group px-3 py-1.5 rounded-lg border transition-all hover:bg-[var(--surface-elevated)] ${
        isUserSubmitted
          ? 'border-brand-accent/30 bg-brand-accent/[0.06] border-l-[3px] border-l-brand-accent/60'
          : 'border-[var(--border-subtle)] bg-[var(--bg-card)]'
      }`}
    >
      {/* Row 1: Prompt text */}
      <div className="min-w-0">
        {editing ? (
          <PromptCardEdit
            initialText={text}
            initialTags={tags}
            onSave={async (newText, newTags) => {
              await onEdit(id, newText, newTags);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div>
            {/* Row 1: Prompt text + edit/delete */}
            <div className="flex items-start gap-1.5">
              <p className="text-sm text-primary leading-snug flex-1 min-w-0">{text}</p>
              {(isOwner || (isAdmin && isUserSubmitted)) && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-muted hover:text-primary transition-all shrink-0 mt-0.5"
                  title="Edit prompt"
                  aria-label="Edit prompt"
                >
                  <LucidePencil className="w-3 h-3" />
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm('Delete this prompt? This cannot be undone.')) return;
                    setDeleting(true);
                    try {
                      await onDelete(id);
                    } catch {
                    } finally {
                      setDeleting(false);
                    }
                  }}
                  disabled={deleting}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-muted hover:text-red-400 transition-all disabled:opacity-40 shrink-0 mt-0.5"
                  title="Delete prompt"
                  aria-label="Delete prompt"
                >
                  {deleting ? <Spinner /> : <LucideTrash2 className="w-3 h-3" />}
                </button>
              )}
              {/* Desktop: badge + admin info inline */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                {isUserSubmitted && (
                  <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-white/10 text-primary/80 border border-white/20 dark:bg-white/10 dark:text-white/80 dark:border-white/20">
                    User submission
                  </span>
                )}
                {isUserSubmitted && isAdmin && (
                  <span className="text-xs text-brand-accent/70">by {submittedByUsername}</span>
                )}
                {isAdmin && (
                  <VoterDetail
                    promptId={id}
                    voteVersion={upvotes + downvotes + (userVote === 'UP' ? 1 : userVote === 'DOWN' ? 2 : 0)}
                  />
                )}
              </div>
            </div>
            {/* Mobile: badge + admin info on separate row */}
            {(isUserSubmitted || isAdmin) && (
              <div className="flex items-center gap-2 mt-1 sm:hidden">
                {isUserSubmitted && (
                  <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-white/10 text-primary/80 border border-white/20 dark:bg-white/10 dark:text-white/80 dark:border-white/20">
                    User submission
                  </span>
                )}
                {isUserSubmitted && isAdmin && (
                  <span className="text-xs text-brand-accent/70">by {submittedByUsername}</span>
                )}
                {isAdmin && (
                  <VoterDetail
                    promptId={id}
                    voteVersion={upvotes + downvotes + (userVote === 'UP' ? 1 : userVote === 'DOWN' ? 2 : 0)}
                  />
                )}
              </div>
            )}

            {/* Row 2: Votes + mark duplicate + tags */}
            <PromptCardActions
              promptId={id}
              upvotes={upvotes}
              downvotes={downvotes}
              approvalPct={approvalPct}
              userVote={userVote}
              isAuthenticated={isAuthenticated}
              isOwner={isOwner}
              duplicateCount={duplicateCount}
              userFlaggedDuplicate={userFlaggedDuplicate}
              tags={tags}
              suggestedTags={suggestedTags}
              tagVotes={tagVotes}
              onVote={onVote}
              onFlagDuplicate={onFlagDuplicate}
              onTagVote={onTagVote}
            />
          </div>
        )}
      </div>
    </div>
  );
}
