import { describe, it, expect, vi } from 'vitest';
import { getAdminGuilds } from '../lib/discord';

global.fetch = vi.fn();

describe('Discord Lib', () => {
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

  it('returns empty array on API failure', async () => {
    (fetch as any).mockResolvedValue({
      ok: false,
      status: 401,
    });

    const guilds = await getAdminGuilds('bad-token');
    expect(guilds).toHaveLength(0);
  });

  it('returns empty array on network error', async () => {
    (fetch as any).mockRejectedValue(new TypeError('Network error'));

    const guilds = await getAdminGuilds('fake-token');
    expect(guilds).toHaveLength(0);
  });

  it('sends correct authorization header', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await getAdminGuilds('my-token-123');

    expect(fetch).toHaveBeenCalledWith(
      'https://discord.com/api/users/@me/guilds',
      { headers: { Authorization: 'Bearer my-token-123' } }
    );
  });
});
