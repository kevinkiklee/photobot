'use client';

import { LucideCheck, LucideX } from 'lucide-react';
import { useState } from 'react';
import { TAG_COLORS } from '@/lib/constants';
import { Spinner } from './Spinner';

interface PromptCardEditProps {
  initialText: string;
  initialTags: string[];
  onSave: (text: string, tags: string[]) => Promise<void>;
  onCancel: () => void;
}

export function PromptCardEdit({ initialText, initialTags, onSave, onCancel }: PromptCardEditProps) {
  const [editText, setEditText] = useState(initialText);
  const [editTags, setEditTags] = useState(initialTags);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleEditTag = (tag: string) => {
    setEditTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 3 ? [...prev, tag] : prev,
    );
  };

  const handleSave = async () => {
    const trimmed = editText.trim();
    if (trimmed.length < 10) {
      setError('At least 10 characters needed.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave(trimmed, editTags);
    } catch {
      setError('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-1.5 py-0.5">
      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        maxLength={500}
        rows={2}
        aria-label="Edit prompt text"
        className="w-full px-2 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[13px] text-primary focus:outline-none focus:border-brand-accent/30 transition-colors resize-none"
      />
      <div className="flex flex-wrap gap-1">
        {Object.keys(TAG_COLORS).map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleEditTag(tag)}
            className={`px-1.5 py-0.5 rounded text-[11px] font-medium border transition-all ${
              editTags.includes(tag)
                ? TAG_COLORS[tag]
                : 'bg-transparent text-muted border-[var(--border-subtle)] hover:text-secondary'
            }`}
          >
            {tag}
          </button>
        ))}
        <span className="text-[11px] text-muted self-center ml-1">{editTags.length}/3</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={saving || editText.trim().length < 10}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/20 hover:bg-green-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {saving ? <Spinner /> : <LucideCheck className="w-3 h-3" />}
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-muted hover:text-primary transition-colors"
        >
          <LucideX className="w-3 h-3" />
          Cancel
        </button>
        {error && <span className="text-xs text-red-400">{error}</span>}
        <span className="text-xs text-muted ml-auto">{editText.length}/500</span>
      </div>
    </div>
  );
}
