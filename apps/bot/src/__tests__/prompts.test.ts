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

import { prisma } from '@photobot/db';

describe('selectPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.discussionPromptLog.findMany as any).mockResolvedValue([]);
  });

  it('returns a curated prompt', async () => {
    const result = await selectPrompt('server-1', null);

    expect(result.text.length).toBeGreaterThan(0);
  });

  it('filters by category when provided', async () => {
    const result = await selectPrompt('server-1', 'creative');

    expect(result.category).toBe('creative');
  });

  it('excludes recently used prompts', async () => {
    // Mark all creative prompts except one as recently used
    const creativePrompts = DISCUSSION_PROMPTS.filter(p => p.category === 'creative');
    const recentLogs = creativePrompts.slice(0, -1).map(p => ({ promptText: p.text }));
    (prisma.discussionPromptLog.findMany as any).mockResolvedValue(recentLogs);

    const result = await selectPrompt('server-1', 'creative');
    expect(result.text).toBe(creativePrompts[creativePrompts.length - 1].text);
  });

  it('resets and allows repeats when all prompts are exhausted', async () => {
    const creativePrompts = DISCUSSION_PROMPTS.filter(p => p.category === 'creative');
    const recentLogs = creativePrompts.map(p => ({ promptText: p.text }));
    (prisma.discussionPromptLog.findMany as any).mockResolvedValue(recentLogs);

    const result = await selectPrompt('server-1', 'creative');

    expect(result.category).toBe('creative');
  });

  it('resets to full pool when all candidates exhausted in last 30 days', async () => {
    // Mark every single prompt (all categories) as recently used
    const recentLogs = DISCUSSION_PROMPTS.map(p => ({ promptText: p.text }));
    (prisma.discussionPromptLog.findMany as any).mockResolvedValue(recentLogs);

    const result = await selectPrompt('server-1', null);

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

    const result = await selectPrompt('server-1', smallestCategory);

    expect(result.category).toBe(smallestCategory);
    expect(categoryPrompts.some(p => p.text === result.text)).toBe(true);
  });
});
