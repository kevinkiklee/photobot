import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    prompt: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

import { prisma } from '@photobot/db';
import { fetchPrompts } from '@/lib/prompts';

function makePrompt(overrides: Record<string, any> = {}) {
  return {
    id: overrides.id || 'p1',
    text: overrides.text || 'Test prompt text',
    originalCategory: overrides.originalCategory || 'Creative Process',
    submittedBy: overrides.submittedBy ?? null,
    submittedByUsername: overrides.submittedByUsername ?? null,
    tags: overrides.tags || [{ tag: 'motivation' }],
    votes: overrides.votes || [],
    duplicateFlags: overrides.duplicateFlags || [],
    tagSuggestions: overrides.tagSuggestions || [],
    createdAt: overrides.createdAt || new Date(),
  };
}

describe('fetchPrompts - privacy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.prompt.count as any).mockResolvedValue(1);
  });

  it('strips submittedBy for non-admin users (shows "community")', async () => {
    (prisma.prompt.findMany as any).mockResolvedValue([
      makePrompt({ submittedBy: 'user-123', submittedByUsername: 'RealName' }),
    ]);

    const result = await fetchPrompts({}, 'viewer-1', false);
    expect(result.prompts[0].submittedBy).toBe('community');
    expect(result.prompts[0].submittedByUsername).toBeNull();
  });

  it('shows real submittedBy for admin users', async () => {
    (prisma.prompt.findMany as any).mockResolvedValue([
      makePrompt({ submittedBy: 'user-123', submittedByUsername: 'RealName' }),
    ]);

    const result = await fetchPrompts({}, 'admin-1', true);
    expect(result.prompts[0].submittedBy).toBe('user-123');
    expect(result.prompts[0].submittedByUsername).toBe('RealName');
  });

  it('shows null submittedBy for curated prompts (non-admin)', async () => {
    (prisma.prompt.findMany as any).mockResolvedValue([makePrompt({ submittedBy: null })]);

    const result = await fetchPrompts({}, 'viewer-1', false);
    expect(result.prompts[0].submittedBy).toBeNull();
  });
});

describe('fetchPrompts - vote calculations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.prompt.count as any).mockResolvedValue(1);
  });

  it('calculates approval percentage correctly', async () => {
    (prisma.prompt.findMany as any).mockResolvedValue([
      makePrompt({
        votes: [
          { vote: 'UP', discordUserId: 'u1' },
          { vote: 'UP', discordUserId: 'u2' },
          { vote: 'UP', discordUserId: 'u3' },
          { vote: 'DOWN', discordUserId: 'u4' },
        ],
      }),
    ]);

    const result = await fetchPrompts({});
    expect(result.prompts[0].upvotes).toBe(3);
    expect(result.prompts[0].downvotes).toBe(1);
    expect(result.prompts[0].approvalPct).toBe(75);
  });

  it('returns 0% approval when no votes', async () => {
    (prisma.prompt.findMany as any).mockResolvedValue([makePrompt({ votes: [] })]);

    const result = await fetchPrompts({});
    expect(result.prompts[0].approvalPct).toBe(0);
  });

  it('tracks current user vote', async () => {
    (prisma.prompt.findMany as any).mockResolvedValue([
      makePrompt({
        votes: [
          { vote: 'DOWN', discordUserId: 'current-user' },
          { vote: 'UP', discordUserId: 'other-user' },
        ],
      }),
    ]);

    const result = await fetchPrompts({}, 'current-user');
    expect(result.userVotes.p1).toBe('DOWN');
  });

  it('does not include userVotes when no discordUserId provided', async () => {
    (prisma.prompt.findMany as any).mockResolvedValue([
      makePrompt({
        votes: [{ vote: 'UP', discordUserId: 'someone' }],
      }),
    ]);

    const result = await fetchPrompts({});
    expect(result.userVotes).toEqual({});
  });
});

describe('fetchPrompts - sorting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.prompt.count as any).mockResolvedValue(3);
  });

  it('sorts by approval percentage descending', async () => {
    (prisma.prompt.findMany as any).mockResolvedValue([
      makePrompt({
        id: 'p1',
        votes: [
          { vote: 'UP', discordUserId: 'u1' },
          { vote: 'DOWN', discordUserId: 'u2' },
        ],
      }), // 50%
      makePrompt({ id: 'p2', votes: [{ vote: 'UP', discordUserId: 'u1' }] }), // 100%
      makePrompt({ id: 'p3', votes: [] }), // 0%
    ]);

    const result = await fetchPrompts({ sort: 'approval' });
    expect(result.prompts[0].id).toBe('p2');
    expect(result.prompts[1].id).toBe('p1');
    expect(result.prompts[2].id).toBe('p3');
  });

  it('sorts by total votes descending', async () => {
    (prisma.prompt.findMany as any).mockResolvedValue([
      makePrompt({ id: 'p1', votes: [{ vote: 'UP', discordUserId: 'u1' }] }), // 1 vote
      makePrompt({
        id: 'p2',
        votes: [
          { vote: 'UP', discordUserId: 'u1' },
          { vote: 'DOWN', discordUserId: 'u2' },
          { vote: 'UP', discordUserId: 'u3' },
        ],
      }), // 3 votes
      makePrompt({ id: 'p3', votes: [] }), // 0 votes
    ]);

    const result = await fetchPrompts({ sort: 'votes' });
    expect(result.prompts[0].id).toBe('p2');
    expect(result.prompts[1].id).toBe('p1');
    expect(result.prompts[2].id).toBe('p3');
  });
});

describe('fetchPrompts - duplicate flags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.prompt.count as any).mockResolvedValue(1);
  });

  it('counts duplicate flags correctly', async () => {
    (prisma.prompt.findMany as any).mockResolvedValue([
      makePrompt({
        duplicateFlags: [{ discordUserId: 'u1' }, { discordUserId: 'u2' }, { discordUserId: 'u3' }],
      }),
    ]);

    const result = await fetchPrompts({});
    expect(result.prompts[0].duplicateCount).toBe(3);
  });

  it('detects current user has flagged duplicate', async () => {
    (prisma.prompt.findMany as any).mockResolvedValue([
      makePrompt({
        duplicateFlags: [{ discordUserId: 'current-user' }, { discordUserId: 'other-user' }],
      }),
    ]);

    const result = await fetchPrompts({}, 'current-user');
    expect(result.prompts[0].userFlaggedDuplicate).toBe(true);
  });

  it('returns false for userFlaggedDuplicate when user has not flagged', async () => {
    (prisma.prompt.findMany as any).mockResolvedValue([
      makePrompt({
        duplicateFlags: [{ discordUserId: 'other-user' }],
      }),
    ]);

    const result = await fetchPrompts({}, 'current-user');
    expect(result.prompts[0].userFlaggedDuplicate).toBe(false);
  });
});

describe('fetchPrompts - pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.prompt.findMany as any).mockResolvedValue([]);
  });

  it('defaults to page 1', async () => {
    (prisma.prompt.count as any).mockResolvedValue(100);
    const result = await fetchPrompts({});
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(5);
  });

  it('clamps negative page to 1', async () => {
    (prisma.prompt.count as any).mockResolvedValue(100);
    const result = await fetchPrompts({ page: -5 });
    expect(result.page).toBe(1);
  });

  it('calculates correct skip for page 3', async () => {
    (prisma.prompt.count as any).mockResolvedValue(100);
    await fetchPrompts({ page: 3 });

    expect(prisma.prompt.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 40 }));
  });

  it('ignores search queries over 200 characters', async () => {
    (prisma.prompt.count as any).mockResolvedValue(10);
    await fetchPrompts({ q: 'a'.repeat(201) });

    expect(prisma.prompt.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {},
      }),
    );
  });
});
