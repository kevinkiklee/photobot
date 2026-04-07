import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/lib/session', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockReturnValue(true),
}));

vi.mock('@photobot/db', () => ({
  prisma: {
    promptTagSuggestion: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/tag-vote/route';
import { getSession } from '@/lib/session';
import { checkRateLimit } from '@/lib/rate-limit';
import { prisma } from '@photobot/db';

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost/api/tag-vote', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/tag-vote', () => {
  const session = {
    discordUserId: 'user-123',
    discordUsername: 'TestUser',
    isAdmin: false,
  };

  const mockSuggestions = [
    { tag: 'workflow', action: 'ADD', discordUserId: 'user-123' },
    { tag: 'workflow', action: 'ADD', discordUserId: 'user-456' },
    { tag: 'style', action: 'REMOVE', discordUserId: 'user-789' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (getSession as any).mockResolvedValue(session);
    (checkRateLimit as any).mockReturnValue(true);
    (prisma.promptTagSuggestion.findUnique as any).mockResolvedValue(null);
    (prisma.promptTagSuggestion.create as any).mockResolvedValue({});
    (prisma.promptTagSuggestion.update as any).mockResolvedValue({});
    (prisma.promptTagSuggestion.delete as any).mockResolvedValue({});
    (prisma.promptTagSuggestion.findMany as any).mockResolvedValue(mockSuggestions);
  });

  it('returns 401 when not authenticated', async () => {
    (getSession as any).mockResolvedValue(null);

    const res = await POST(makeRequest({ promptId: 'p1', tag: 'workflow', action: 'ADD' }));
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 401 when session has no discordUserId', async () => {
    (getSession as any).mockResolvedValue({ discordUsername: 'NoId' });

    const res = await POST(makeRequest({ promptId: 'p1', tag: 'workflow', action: 'ADD' }));
    expect(res.status).toBe(401);
  });

  it('returns 429 when rate limited', async () => {
    (checkRateLimit as any).mockReturnValue(false);

    const res = await POST(makeRequest({ promptId: 'p1', tag: 'workflow', action: 'ADD' }));
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toBe('Rate limit exceeded');
  });

  it('calls checkRateLimit with correct namespace and userId', async () => {
    await POST(makeRequest({ promptId: 'p1', tag: 'workflow', action: 'ADD' }));
    expect(checkRateLimit).toHaveBeenCalledWith('tag-vote', 'user-123');
  });

  it('returns 400 for missing promptId', async () => {
    const res = await POST(makeRequest({ tag: 'workflow', action: 'ADD' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid promptId');
  });

  it('returns 400 for empty promptId', async () => {
    const res = await POST(makeRequest({ promptId: '', tag: 'workflow', action: 'ADD' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid promptId');
  });

  it('returns 400 when promptId is not a string', async () => {
    const res = await POST(makeRequest({ promptId: 42, tag: 'workflow', action: 'ADD' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid promptId');
  });

  it('returns 400 when promptId is too long', async () => {
    const res = await POST(makeRequest({ promptId: 'a'.repeat(51), tag: 'workflow', action: 'ADD' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid promptId');
  });

  it('returns 400 for invalid tag not in allowlist', async () => {
    const res = await POST(makeRequest({ promptId: 'p1', tag: 'not-a-real-tag', action: 'ADD' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid tag');
  });

  it('returns 400 for missing tag', async () => {
    const res = await POST(makeRequest({ promptId: 'p1', action: 'ADD' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid tag');
  });

  it('returns 400 for invalid action (not ADD/REMOVE)', async () => {
    const res = await POST(makeRequest({ promptId: 'p1', tag: 'workflow', action: 'UPVOTE' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid action');
  });

  it('returns 400 for missing action', async () => {
    const res = await POST(makeRequest({ promptId: 'p1', tag: 'workflow' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid action');
  });

  it('accepts all 17 valid tags', async () => {
    const validTags = [
      'motivation', 'workflow', 'style', 'editing', 'portfolio',
      'storytelling', 'collaboration', 'social-media', 'gear', 'ethics',
      'business', 'influences', 'learning', 'projects', 'self-reflection',
      'community', 'technique',
    ];

    for (const tag of validTags) {
      vi.clearAllMocks();
      (getSession as any).mockResolvedValue(session);
      (checkRateLimit as any).mockReturnValue(true);
      (prisma.promptTagSuggestion.findUnique as any).mockResolvedValue(null);
      (prisma.promptTagSuggestion.create as any).mockResolvedValue({});
      (prisma.promptTagSuggestion.findMany as any).mockResolvedValue([]);

      const res = await POST(makeRequest({ promptId: 'p1', tag, action: 'ADD' }));
      expect(res.status).toBe(200);
    }
  });

  it('creates a new tag suggestion when none exists', async () => {
    (prisma.promptTagSuggestion.findUnique as any).mockResolvedValue(null);
    (prisma.promptTagSuggestion.findMany as any).mockResolvedValue([]);

    const res = await POST(makeRequest({ promptId: 'p1', tag: 'workflow', action: 'ADD' }));
    expect(res.status).toBe(200);

    expect(prisma.promptTagSuggestion.findUnique).toHaveBeenCalledWith({
      where: {
        promptId_tag_discordUserId: {
          promptId: 'p1',
          tag: 'workflow',
          discordUserId: 'user-123',
        },
      },
    });

    expect(prisma.promptTagSuggestion.create).toHaveBeenCalledWith({
      data: { promptId: 'p1', tag: 'workflow', action: 'ADD', discordUserId: 'user-123' },
    });

    expect(prisma.promptTagSuggestion.update).not.toHaveBeenCalled();
    expect(prisma.promptTagSuggestion.delete).not.toHaveBeenCalled();
  });

  it('toggles off (deletes) an existing suggestion with the same action', async () => {
    const existing = { id: 'suggestion-1', promptId: 'p1', tag: 'workflow', action: 'ADD', discordUserId: 'user-123' };
    (prisma.promptTagSuggestion.findUnique as any).mockResolvedValue(existing);
    (prisma.promptTagSuggestion.findMany as any).mockResolvedValue([]);

    const res = await POST(makeRequest({ promptId: 'p1', tag: 'workflow', action: 'ADD' }));
    expect(res.status).toBe(200);

    expect(prisma.promptTagSuggestion.delete).toHaveBeenCalledWith({
      where: { id: 'suggestion-1' },
    });

    expect(prisma.promptTagSuggestion.create).not.toHaveBeenCalled();
    expect(prisma.promptTagSuggestion.update).not.toHaveBeenCalled();
  });

  it('switches action on existing suggestion (ADD → REMOVE)', async () => {
    const existing = { id: 'suggestion-2', promptId: 'p1', tag: 'workflow', action: 'ADD', discordUserId: 'user-123' };
    (prisma.promptTagSuggestion.findUnique as any).mockResolvedValue(existing);
    (prisma.promptTagSuggestion.findMany as any).mockResolvedValue([]);

    const res = await POST(makeRequest({ promptId: 'p1', tag: 'workflow', action: 'REMOVE' }));
    expect(res.status).toBe(200);

    expect(prisma.promptTagSuggestion.update).toHaveBeenCalledWith({
      where: { id: 'suggestion-2' },
      data: { action: 'REMOVE' },
    });

    expect(prisma.promptTagSuggestion.create).not.toHaveBeenCalled();
    expect(prisma.promptTagSuggestion.delete).not.toHaveBeenCalled();
  });

  it('switches action on existing suggestion (REMOVE → ADD)', async () => {
    const existing = { id: 'suggestion-3', promptId: 'p1', tag: 'style', action: 'REMOVE', discordUserId: 'user-123' };
    (prisma.promptTagSuggestion.findUnique as any).mockResolvedValue(existing);
    (prisma.promptTagSuggestion.findMany as any).mockResolvedValue([]);

    const res = await POST(makeRequest({ promptId: 'p1', tag: 'style', action: 'ADD' }));
    expect(res.status).toBe(200);

    expect(prisma.promptTagSuggestion.update).toHaveBeenCalledWith({
      where: { id: 'suggestion-3' },
      data: { action: 'ADD' },
    });
  });

  it('returns tagVotes with correct counts in response', async () => {
    (prisma.promptTagSuggestion.findUnique as any).mockResolvedValue(null);
    (prisma.promptTagSuggestion.create as any).mockResolvedValue({});
    (prisma.promptTagSuggestion.findMany as any).mockResolvedValue([
      { tag: 'workflow', action: 'ADD', discordUserId: 'user-123' },
      { tag: 'workflow', action: 'ADD', discordUserId: 'user-456' },
      { tag: 'workflow', action: 'REMOVE', discordUserId: 'user-789' },
      { tag: 'style', action: 'REMOVE', discordUserId: 'user-abc' },
    ]);

    const res = await POST(makeRequest({ promptId: 'p1', tag: 'workflow', action: 'ADD' }));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.tagVotes).toBeDefined();
    expect(data.tagVotes.workflow.addCount).toBe(2);
    expect(data.tagVotes.workflow.removeCount).toBe(1);
    expect(data.tagVotes.workflow.userAction).toBe('ADD');
    expect(data.tagVotes.style.addCount).toBe(0);
    expect(data.tagVotes.style.removeCount).toBe(1);
    expect(data.tagVotes.style.userAction).toBeNull();
  });

  it('returns tagVotes with null userAction when user has no vote for a tag', async () => {
    (prisma.promptTagSuggestion.findUnique as any).mockResolvedValue(null);
    (prisma.promptTagSuggestion.create as any).mockResolvedValue({});
    (prisma.promptTagSuggestion.findMany as any).mockResolvedValue([
      { tag: 'gear', action: 'ADD', discordUserId: 'user-other' },
    ]);

    const res = await POST(makeRequest({ promptId: 'p1', tag: 'workflow', action: 'ADD' }));
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.tagVotes.gear.userAction).toBeNull();
  });

  it('calls findMany with correct promptId after mutation', async () => {
    (prisma.promptTagSuggestion.findUnique as any).mockResolvedValue(null);
    (prisma.promptTagSuggestion.findMany as any).mockResolvedValue([]);

    await POST(makeRequest({ promptId: 'prompt-xyz', tag: 'editing', action: 'ADD' }));

    expect(prisma.promptTagSuggestion.findMany).toHaveBeenCalledWith({
      where: { promptId: 'prompt-xyz' },
      select: { tag: true, action: true, discordUserId: true },
    });
  });
});
