'use client';

import { useState } from 'react';
import { LucidePencil, LucideCheck, LucideX, LucideTrash2 } from 'lucide-react';
import { Spinner } from './Spinner';
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
  submittedBy: string | null;
  submittedByUsername: string | null;
  currentUserId: string | null;
  duplicateCount: number;
  userFlaggedDuplicate: boolean;
  onVote: (promptId: string, direction: 'UP' | 'DOWN') => Promise<void>;
  onEdit: (promptId: string, newText: string, newTags: string[]) => Promise<void>;
  onDelete: (promptId: string) => Promise<void>;
  onFlagDuplicate: (promptId: string) => Promise<void>;
}

export function PromptCard({ id, text, tags, upvotes, downvotes, approvalPct, userVote, isAuthenticated, isAdmin, submittedBy, submittedByUsername, currentUserId, duplicateCount, userFlaggedDuplicate, onVote, onEdit, onDelete, onFlagDuplicate }: PromptCardProps) {
  const total = upvotes + downvotes;
  const isUserSubmitted = !!submittedBy;
  const isOwner = !!currentUserId && submittedBy === currentUserId;
  const canDelete = isUserSubmitted && (isOwner || isAdmin);

  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [editTags, setEditTags] = useState(tags);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [flagging, setFlagging] = useState(false);
  const [error, setError] = useState('');

  const toggleEditTag = (tag: string) => {
    setEditTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : prev.length < 3 ? [...prev, tag] : prev
    );
  };

  const handleSave = async () => {
    const trimmed = editText.trim();
    if (trimmed.length < 10) { setError('At least 10 characters needed.'); return; }
    setSaving(true); setError('');
    try { await onEdit(id, trimmed, editTags); setEditing(false); }
    catch { setError('Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleCancel = () => { setEditing(false); setEditText(text); setEditTags(tags); setError(''); };

  return (
    <div className={`group px-3 py-1.5 rounded-lg border transition-all hover:bg-[var(--surface-elevated)] ${
      isUserSubmitted
        ? 'border-brand-accent/30 bg-brand-accent/[0.06] border-l-[3px] border-l-brand-accent/60'
        : 'border-[var(--border-subtle)] bg-[var(--bg-card)]'
    }`}>
      {/* Row 1: Prompt text */}
      <div className="min-w-0">
        {editing ? (
          <div className="space-y-1.5 py-0.5">
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              maxLength={500}
              rows={2}
              aria-label="Edit prompt text"
              className="w-full px-2 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[13px] text-primary focus:outline-none focus:border-brand-accent/30 transition-colors resize-none"
            />
            <div className="flex flex-wrap gap-1">
              {Object.keys(TAG_COLORS).map(tag => (
                <button key={tag} type="button" onClick={() => toggleEditTag(tag)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-medium border transition-all ${
                    editTags.includes(tag)
                      ? TAG_COLORS[tag]
                      : 'bg-transparent text-muted border-[var(--border-subtle)] hover:text-secondary'
                  }`}
                >{tag}</button>
              ))}
              <span className="text-[11px] text-muted self-center ml-1">{editTags.length}/3</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleSave} disabled={saving || editText.trim().length < 10}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/20 hover:bg-green-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                {saving ? <Spinner /> : <LucideCheck className="w-3 h-3" />}{saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={handleCancel}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-muted hover:text-primary transition-colors">
                <LucideX className="w-3 h-3" />Cancel
              </button>
              {error && <span className="text-xs text-red-400">{error}</span>}
              <span className="text-xs text-muted ml-auto">{editText.length}/500</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start gap-1.5">
              <p className="text-sm text-primary leading-snug flex-1 min-w-0">{text}</p>
              {(isOwner || (isAdmin && isUserSubmitted)) && (
                <button onClick={() => setEditing(true)} className="opacity-0 group-hover:opacity-100 p-0.5 text-muted hover:text-primary transition-all shrink-0 mt-0.5" title="Edit prompt">
                  <LucidePencil className="w-3 h-3" />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={async () => { if (!confirm('Delete this prompt? This cannot be undone.')) return; setDeleting(true); try { await onDelete(id); } catch {} finally { setDeleting(false); } }}
                  disabled={deleting} className="opacity-0 group-hover:opacity-100 p-0.5 text-muted hover:text-red-400 transition-all disabled:opacity-40 shrink-0 mt-0.5" title="Delete this prompt">
                  {deleting ? <Spinner /> : <LucideTrash2 className="w-3 h-3" />}
                </button>
              )}
              {/* Tags inline on desktop */}
              <div className="hidden sm:flex flex-wrap items-center gap-1 shrink-0">
                {isUserSubmitted && (
                  <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-white/10 text-primary/80 border border-white/20 dark:bg-white/10 dark:text-white/80 dark:border-white/20">
                    User submission
                  </span>
                )}
                {tags.map(tag => (
                  <span key={tag} className={`px-1.5 py-0.5 rounded text-[11px] font-medium border ${TAG_COLORS[tag] || 'bg-brand-primary/10 text-brand-primary/70 border-brand-primary/15'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {/* Tags on separate row on mobile */}
            <div className="flex flex-wrap items-center gap-1 mt-1.5 sm:hidden">
              {isUserSubmitted && (
                <span className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-white/10 text-primary/80 border border-white/20 dark:bg-white/10 dark:text-white/80 dark:border-white/20">
                  User submission
                </span>
              )}
              {tags.map(tag => (
                <span key={tag} className={`px-1.5 py-0.5 rounded text-[11px] font-medium border ${TAG_COLORS[tag] || 'bg-brand-primary/10 text-brand-primary/70 border-brand-primary/15'}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Row 2: Votes, actions (hidden while editing) */}
      {!editing && <div className="flex flex-wrap items-center gap-2 mt-1">
        <VoteButton promptId={id} direction="UP" count={upvotes} active={userVote === 'UP'} disabled={!isAuthenticated || isOwner} onVote={onVote} />
        <VoteButton promptId={id} direction="DOWN" count={downvotes} active={userVote === 'DOWN'} disabled={!isAuthenticated || isOwner} onVote={onVote} />
        {total > 0 && (
          <span className="text-xs text-muted font-medium tabular-nums">{approvalPct}%</span>
        )}
        {isAuthenticated && !isOwner && (
          <button
            onClick={async () => { setFlagging(true); try { await onFlagDuplicate(id); } finally { setFlagging(false); } }}
            disabled={flagging}
            className={`px-1.5 py-0.5 rounded text-[11px] font-medium border transition-all inline-flex items-center gap-1 ${
              userFlaggedDuplicate
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                : 'text-muted border-[var(--border-subtle)] hover:text-amber-400 hover:border-amber-500/20'
            } ${flagging ? 'opacity-60' : ''}`}
          >
            {flagging && <Spinner />}
            {userFlaggedDuplicate ? 'Marked duplicate' : 'Mark duplicate'}
          </button>
        )}

        <div className="flex-1" />

        {isUserSubmitted && isAdmin && (
          <span className="text-xs text-brand-accent/70">by {submittedByUsername}</span>
        )}
        {isAdmin && <VoterDetail promptId={id} voteVersion={upvotes + downvotes + (userVote === 'UP' ? 1 : userVote === 'DOWN' ? 2 : 0)} />}
      </div>}
    </div>
  );
}
