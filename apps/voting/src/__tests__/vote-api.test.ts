import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    promptVote: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

import { prisma } from '@photobot/db';
import { handleVote } from '@/lib/vote';

describe('handleVote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.promptVote.count as any).mockResolvedValue(0);
  });

  it('creates a new vote when none exists', async () => {
    (prisma.promptVote.findUnique as any).mockResolvedValue(null);
    (prisma.promptVote.create as any).mockResolvedValue({ id: 'v1', vote: 'UP' });
    (prisma.promptVote.count as any).mockResolvedValueOnce(1).mockResolvedValueOnce(0);

    const result = await handleVote('prompt-1', 'user-1', 'TestUser', 'UP');

    expect(prisma.promptVote.create).toHaveBeenCalledWith({
      data: {
        promptId: 'prompt-1',
        discordUserId: 'user-1',
        discordUsername: 'TestUser',
        vote: 'UP',
      },
    });
    expect(result).toEqual({ upvotes: 1, downvotes: 0, userVote: 'UP' });
  });

  it('deletes the vote when clicking same direction (toggle off)', async () => {
    (prisma.promptVote.findUnique as any).mockResolvedValue({ id: 'v1', vote: 'UP' });
    (prisma.promptVote.delete as any).mockResolvedValue({});
    (prisma.promptVote.count as any).mockResolvedValueOnce(0).mockResolvedValueOnce(0);

    const result = await handleVote('prompt-1', 'user-1', 'TestUser', 'UP');

    expect(prisma.promptVote.delete).toHaveBeenCalledWith({ where: { id: 'v1' } });
    expect(result).toEqual({ upvotes: 0, downvotes: 0, userVote: null });
  });

  it('switches direction when clicking opposite', async () => {
    (prisma.promptVote.findUnique as any).mockResolvedValue({ id: 'v1', vote: 'UP' });
    (prisma.promptVote.update as any).mockResolvedValue({ id: 'v1', vote: 'DOWN' });
    (prisma.promptVote.count as any).mockResolvedValueOnce(0).mockResolvedValueOnce(1);

    const result = await handleVote('prompt-1', 'user-1', 'TestUser', 'DOWN');

    expect(prisma.promptVote.update).toHaveBeenCalledWith({
      where: { id: 'v1' },
      data: { vote: 'DOWN' },
    });
    expect(result).toEqual({ upvotes: 0, downvotes: 1, userVote: 'DOWN' });
  });
});
