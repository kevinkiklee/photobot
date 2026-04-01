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
  });

  it('filters by category when provided', async () => {
    const result = await selectPrompt('server-1', false, 'creative');
    expect(result.source).toBe('curated');
    expect(result.category).toBe('creative');
  });

  it('excludes recently used prompts', async () => {
    // Mark all creative prompts except one as recently used
    const creativePrompts = DISCUSSION_PROMPTS.filter(p => p.category === 'creative');
    const recentLogs = creativePrompts.slice(0, -1).map(p => ({ promptText: p.text }));
    (prisma.discussionPromptLog.findMany as any).mockResolvedValue(recentLogs);

    const result = await selectPrompt('server-1', false, 'creative');
    expect(result.text).toBe(creativePrompts[creativePrompts.length - 1].text);
  });

  it('resets and allows repeats when all prompts are exhausted', async () => {
    const creativePrompts = DISCUSSION_PROMPTS.filter(p => p.category === 'creative');
    const recentLogs = creativePrompts.map(p => ({ promptText: p.text }));
    (prisma.discussionPromptLog.findMany as any).mockResolvedValue(recentLogs);

    const result = await selectPrompt('server-1', false, 'creative');
    expect(result.source).toBe('curated');
    expect(result.category).toBe('creative');
  });

  it('uses AI when useAi is true', async () => {
    (aiProvider.analyzeText as any).mockResolvedValue('What makes a great street photo?');

    const result = await selectPrompt('server-1', true, 'creative');
    expect(result.source).toBe('ai');
    expect(result.text).toBe('What makes a great street photo?');
  });

  it('falls back to curated when AI fails', async () => {
    (aiProvider.analyzeText as any).mockRejectedValue(new Error('AI timeout'));

    const result = await selectPrompt('server-1', true, null);
    expect(result.source).toBe('curated');
    expect(result.text.length).toBeGreaterThan(0);
  });

  it('resets to full pool when all candidates exhausted in last 30 days', async () => {
    // Mark every single prompt (all categories) as recently used
    const recentLogs = DISCUSSION_PROMPTS.map(p => ({ promptText: p.text }));
    (prisma.discussionPromptLog.findMany as any).mockResolvedValue(recentLogs);

    const result = await selectPrompt('server-1', false, null);
    expect(result.source).toBe('curated');
    expect(result.text.length).toBeGreaterThan(0);
    // The returned prompt must be one of the known prompts
    expect(DISCUSSION_PROMPTS.some(p => p.text === result.text)).toBe(true);
  });

  it('works correctly when filtering by a category with few prompts', async () => {
    // Find the category with the fewest prompts
    const categoryCounts = new Map<string, number>();
    for (const p of DISCUSSION_PROMPTS) {
      categoryCounts.set(p.category, (categoryCounts.get(p.category) ?? 0) + 1);
    }
    const [smallestCategory] = [...categoryCounts.entries()].sort((a, b) => a[1] - b[1])[0];
    const categoryPrompts = DISCUSSION_PROMPTS.filter(p => p.category === smallestCategory);

    const result = await selectPrompt('server-1', false, smallestCategory);
    expect(result.source).toBe('curated');
    expect(result.category).toBe(smallestCategory);
    expect(categoryPrompts.some(p => p.text === result.text)).toBe(true);
  });

  it('falls back to curated when AI returns empty string', async () => {
    (aiProvider.analyzeText as any).mockResolvedValue('');

    const result = await selectPrompt('server-1', true, null);
    expect(result.source).toBe('curated');
    expect(result.text.length).toBeGreaterThan(0);
  });

  it('falls back to curated when AI returns whitespace-only string', async () => {
    (aiProvider.analyzeText as any).mockResolvedValue('   \n  ');

    const result = await selectPrompt('server-1', true, null);
    expect(result.source).toBe('curated');
    expect(result.text.length).toBeGreaterThan(0);
  });

  it('strips double quotes from AI response', async () => {
    (aiProvider.analyzeText as any).mockResolvedValue('"What inspires your landscape photography?"');

    const result = await selectPrompt('server-1', true, null);
    expect(result.source).toBe('ai');
    expect(result.text).toBe('What inspires your landscape photography?');
  });

  it('strips single quotes from AI response', async () => {
    (aiProvider.analyzeText as any).mockResolvedValue("'How do you handle harsh midday light?'");

    const result = await selectPrompt('server-1', true, null);
    expect(result.source).toBe('ai');
    expect(result.text).toBe('How do you handle harsh midday light?');
  });
});
