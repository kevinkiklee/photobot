import { vi, describe, it, expect, beforeEach } from 'vitest';
import { selectPrompt } from '../services/prompts';
import { DISCUSSION_PROMPTS } from '../constants';

vi.mock('@photobot/db', () => ({
  prisma: {
    discussionPromptLog: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('@photobot/ai', () => ({
  AIProviderError: class extends Error {},
}));

vi.mock('../services/ai', () => ({
  aiProvider: {
    analyzeText: vi.fn(),
  },
}));

import { prisma } from '@photobot/db';
import { aiProvider } from '../services/ai';

describe('selectPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.discussionPromptLog.findMany as any).mockResolvedValue([]);
  });

  it('returns a curated prompt when useAi is false', async () => {
    const result = await selectPrompt('server-1', false, null);
    expect(result.source).toBe('curated');
    expect(result.text.length).toBeGreaterThan(0);
    expect(result.reactions).toHaveLength(3);
  });

  it('filters by category when provided', async () => {
    const result = await selectPrompt('server-1', false, 'gear');
    expect(result.source).toBe('curated');
    expect(result.category).toBe('gear');
  });

  it('excludes recently used prompts', async () => {
    // Mark all gear prompts except one as recently used
    const gearPrompts = DISCUSSION_PROMPTS.filter(p => p.category === 'gear');
    const recentLogs = gearPrompts.slice(0, -1).map(p => ({ promptText: p.text }));
    (prisma.discussionPromptLog.findMany as any).mockResolvedValue(recentLogs);

    const result = await selectPrompt('server-1', false, 'gear');
    expect(result.text).toBe(gearPrompts[gearPrompts.length - 1].text);
  });

  it('resets and allows repeats when all prompts are exhausted', async () => {
    const gearPrompts = DISCUSSION_PROMPTS.filter(p => p.category === 'gear');
    const recentLogs = gearPrompts.map(p => ({ promptText: p.text }));
    (prisma.discussionPromptLog.findMany as any).mockResolvedValue(recentLogs);

    const result = await selectPrompt('server-1', false, 'gear');
    expect(result.source).toBe('curated');
    expect(result.category).toBe('gear');
  });

  it('uses AI when useAi is true', async () => {
    (aiProvider.analyzeText as any).mockResolvedValue('What makes a great street photo?');

    const result = await selectPrompt('server-1', true, 'technique');
    expect(result.source).toBe('ai');
    expect(result.text).toBe('What makes a great street photo?');
  });

  it('falls back to curated when AI fails', async () => {
    (aiProvider.analyzeText as any).mockRejectedValue(new Error('AI timeout'));

    const result = await selectPrompt('server-1', true, null);
    expect(result.source).toBe('curated');
    expect(result.text.length).toBeGreaterThan(0);
  });
});
