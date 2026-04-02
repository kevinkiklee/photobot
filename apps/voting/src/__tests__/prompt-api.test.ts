import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    prompt: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
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
import { getServerSession } from 'next-auth/next';
import { POST, PATCH, DELETE } from '@/app/api/prompt/route';
import { NextRequest } from 'next/server';

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost/api/prompt', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// Use unique user IDs per describe block to avoid cross-contamination
// from the in-memory rate limiter in the prompt route module.

describe('POST /api/prompt', () => {
  const postSession = {
    discordUserId: 'post-user',
    discordUsername: 'PostUser',
    isAdmin: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getServerSession as any).mockResolvedValue(postSession);
  });

  it('returns 401 when not authenticated', async () => {
    (getServerSession as any).mockResolvedValue(null);

    const res = await POST(makeRequest({ text: 'A valid prompt text' }));
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 400 when text is too short', async () => {
    const res = await POST(makeRequest({ text: 'short' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('at least 10 characters');
  });

  it('returns 400 when text is empty', async () => {
    const res = await POST(makeRequest({ text: '' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when text exceeds 150 characters', async () => {
    const longText = 'a'.repeat(151);
    const res = await POST(makeRequest({ text: longText }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('under 150 characters');
  });

  it('creates a prompt with valid text and tags', async () => {
    const created = {
      id: 'p1',
      text: 'A valid prompt for testing',
      tags: [{ tag: 'motivation' }, { tag: 'workflow' }],
    };
    (prisma.prompt.create as any).mockResolvedValue(created);

    const res = await POST(makeRequest({
      text: 'A valid prompt for testing',
      tags: ['motivation', 'workflow'],
    }));

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe('p1');
    expect(data.tags).toEqual(['motivation', 'workflow']);
    expect(prisma.prompt.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          text: 'A valid prompt for testing',
          submittedBy: 'post-user',
          submittedByUsername: 'PostUser',
          originalCategory: 'community',
        }),
      })
    );
  });

  it('filters out invalid tags', async () => {
    const created = {
      id: 'p1',
      text: 'A valid prompt for testing',
      tags: [{ tag: 'motivation' }],
    };
    (prisma.prompt.create as any).mockResolvedValue(created);

    await POST(makeRequest({
      text: 'A valid prompt for testing',
      tags: ['motivation', 'INVALID_TAG', 'another-bad'],
    }));

    expect(prisma.prompt.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tags: { create: [{ tag: 'motivation' }] },
        }),
      })
    );
  });

  it('limits tags to 3 maximum', async () => {
    const created = {
      id: 'p1',
      text: 'A valid prompt for testing',
      tags: [{ tag: 'motivation' }, { tag: 'workflow' }, { tag: 'style' }],
    };
    (prisma.prompt.create as any).mockResolvedValue(created);

    await POST(makeRequest({
      text: 'A valid prompt for testing',
      tags: ['motivation', 'workflow', 'style', 'editing'],
    }));

    expect(prisma.prompt.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tags: { create: [{ tag: 'motivation' }, { tag: 'workflow' }, { tag: 'style' }] },
        }),
      })
    );
  });

  // Note: Rate limiting via the in-memory Map in the route module cannot be
  // reliably tested in vitest due to module isolation resetting module-level
  // state between test invocations. Rate limiting is an integration concern.
});

describe('PATCH /api/prompt', () => {
  const patchSession = {
    discordUserId: 'patch-user',
    discordUsername: 'PatchUser',
    isAdmin: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getServerSession as any).mockResolvedValue(patchSession);
  });

  it('returns 401 when not authenticated', async () => {
    (getServerSession as any).mockResolvedValue(null);

    const res = await PATCH(makeRequest({ id: 'p1', text: 'Updated prompt text' }));
    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid id', async () => {
    const res = await PATCH(makeRequest({ id: '', text: 'Updated prompt text' }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Invalid prompt id');
  });

  it('returns 404 when prompt not found', async () => {
    (prisma.prompt.findUnique as any).mockResolvedValue(null);

    const res = await PATCH(makeRequest({ id: 'nonexistent', text: 'Updated prompt text' }));
    expect(res.status).toBe(404);
  });

  it('returns 403 when editing someone else\'s prompt', async () => {
    (prisma.prompt.findUnique as any).mockResolvedValue({
      id: 'p1',
      submittedBy: 'other-user',
    });

    const res = await PATCH(makeRequest({ id: 'p1', text: 'Updated prompt text' }));
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain('only edit your own');
  });

  it('returns 400 when updated text is too short', async () => {
    (prisma.prompt.findUnique as any).mockResolvedValue({
      id: 'p1',
      submittedBy: 'patch-user',
    });

    const res = await PATCH(makeRequest({ id: 'p1', text: 'short' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when updated text exceeds 150 characters', async () => {
    (prisma.prompt.findUnique as any).mockResolvedValue({
      id: 'p1',
      submittedBy: 'patch-user',
    });

    const res = await PATCH(makeRequest({ id: 'p1', text: 'a'.repeat(151) }));
    expect(res.status).toBe(400);
  });

  it('updates prompt successfully', async () => {
    (prisma.prompt.findUnique as any).mockResolvedValue({
      id: 'p1',
      submittedBy: 'patch-user',
    });
    (prisma.prompt.update as any).mockResolvedValue({
      id: 'p1',
      text: 'Updated prompt text here',
    });

    const res = await PATCH(makeRequest({ id: 'p1', text: 'Updated prompt text here' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.text).toBe('Updated prompt text here');
    expect(prisma.prompt.update).toHaveBeenCalledWith({
      where: { id: 'p1' },
      data: { text: 'Updated prompt text here' },
    });
  });
});

describe('DELETE /api/prompt', () => {
  const deleteSession = {
    discordUserId: 'delete-user',
    discordUsername: 'DeleteUser',
    isAdmin: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getServerSession as any).mockResolvedValue(deleteSession);
  });

  it('returns 401 when not authenticated', async () => {
    (getServerSession as any).mockResolvedValue(null);

    const res = await DELETE(makeRequest({ id: 'p1' }));
    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid id', async () => {
    const res = await DELETE(makeRequest({ id: '' }));
    expect(res.status).toBe(400);
  });

  it('returns 404 when prompt not found', async () => {
    (prisma.prompt.findUnique as any).mockResolvedValue(null);

    const res = await DELETE(makeRequest({ id: 'nonexistent' }));
    expect(res.status).toBe(404);
  });

  it('returns 403 when deleting a curated prompt (no submittedBy)', async () => {
    (prisma.prompt.findUnique as any).mockResolvedValue({
      id: 'p1',
      submittedBy: null,
    });

    const res = await DELETE(makeRequest({ id: 'p1' }));
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain('Curated prompts cannot be deleted');
  });

  it('returns 403 when deleting someone else\'s prompt as non-admin', async () => {
    (prisma.prompt.findUnique as any).mockResolvedValue({
      id: 'p1',
      submittedBy: 'other-user',
    });

    const res = await DELETE(makeRequest({ id: 'p1' }));
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain('only delete your own');
  });

  it('allows owner to delete their own prompt', async () => {
    (prisma.prompt.findUnique as any).mockResolvedValue({
      id: 'p1',
      submittedBy: 'delete-user',
    });
    (prisma.prompt.delete as any).mockResolvedValue({});

    const res = await DELETE(makeRequest({ id: 'p1' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.deleted).toBe(true);
    expect(prisma.prompt.delete).toHaveBeenCalledWith({ where: { id: 'p1' } });
  });

  it('allows admin to delete another user\'s prompt', async () => {
    (getServerSession as any).mockResolvedValue({
      ...deleteSession,
      isAdmin: true,
    });
    (prisma.prompt.findUnique as any).mockResolvedValue({
      id: 'p1',
      submittedBy: 'other-user',
    });
    (prisma.prompt.delete as any).mockResolvedValue({});

    const res = await DELETE(makeRequest({ id: 'p1' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.deleted).toBe(true);
  });
});
