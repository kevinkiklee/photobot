import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.stubEnv('PL_GUILD_ID', 'pl-guild-id');

import { DiscordTokenExpiredError, getAdminGuilds, isPlAdmin } from '../lib/discord';

global.fetch = vi.fn();

describe('Discord Lib', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('filters guilds for ADMINISTRATOR permission', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [
        { id: '1', name: 'Admin Guild', permissions: '8' }, // 0x8 is ADMIN
        { id: '2', name: 'User Guild', permissions: '0' },
      ],
    });

    const guilds = await getAdminGuilds('fake-token');
    expect(guilds).toHaveLength(1);
    expect(guilds[0].id).toBe('1');
  });

  it('throws DiscordTokenExpiredError on 401', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 401,
    });

    await expect(getAdminGuilds('bad-token')).rejects.toThrow(DiscordTokenExpiredError);
  });

  it('returns empty array on non-401 API failure', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
    });

    const guilds = await getAdminGuilds('fake-token');
    expect(guilds).toHaveLength(0);
  });

  it('sends correct authorization header', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await getAdminGuilds('my-token-123');

    expect(fetch).toHaveBeenCalledWith('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: 'Bearer my-token-123' },
    });
  });
});

describe('isPlAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true when user is admin of PL guild', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [{ id: 'pl-guild-id', name: 'Photography Lounge', permissions: '8' }],
    });

    const result = await isPlAdmin('fake-token');
    expect(result).toBe(true);
  });

  it('returns false when user is not admin of PL guild', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [{ id: 'other-guild', name: 'Other', permissions: '8' }],
    });

    const result = await isPlAdmin('fake-token');
    expect(result).toBe(false);
  });

  it('returns false when user has no admin guilds', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await isPlAdmin('fake-token');
    expect(result).toBe(false);
  });
});
