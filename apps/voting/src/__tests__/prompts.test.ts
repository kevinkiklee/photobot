import { vi, describe, it, expect, beforeEach } from 'vitest';

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

describe('fetchPrompts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.prompt.count as any).mockResolvedValue(50);
    (prisma.prompt.findMany as any).mockResolvedValue([]);
  });

  it('returns paginated results with defaults', async () => {
    const result = await fetchPrompts({});

    expect(prisma.prompt.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 20,
        skip: 0,
      })
    );
    expect(result.totalPages).toBe(3);
  });

  it('filters by tags', async () => {
    await fetchPrompts({ tags: ['motivation', 'workflow'] });

    expect(prisma.prompt.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          tags: { some: { tag: { in: ['motivation', 'workflow'] } } },
        }),
      })
    );
  });

  it('filters by search query', async () => {
    await fetchPrompts({ q: 'creative rut' });

    expect(prisma.prompt.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          text: { contains: 'creative rut', mode: 'insensitive' },
        }),
      })
    );
  });

  it('applies alphabetical sort order', async () => {
    await fetchPrompts({ sort: 'alphabetical' });

    expect(prisma.prompt.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { text: 'asc' },
      })
    );
  });
});
