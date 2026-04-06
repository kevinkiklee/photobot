import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@photobot/db', () => ({
  prisma: {
    account: {
      findFirst: vi.fn(),
    },
  },
}));

vi.mock('next-auth/providers/discord', () => ({
  default: vi.fn(() => ({ id: 'discord', name: 'Discord' })),
}));

vi.mock('@next-auth/prisma-adapter', () => ({
  PrismaAdapter: vi.fn(() => ({})),
}));

import { prisma } from '@photobot/db';

describe('auth - admin detection from VOTING_ADMIN_USER_IDS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('marks user as admin when their discord ID is in VOTING_ADMIN_USER_IDS', async () => {
    vi.stubEnv('NEXTAUTH_SECRET', 'test-secret');
    vi.stubEnv('VOTING_ADMIN_USER_IDS', 'admin-1,admin-2');
    vi.stubEnv('VOTING_ADMIN_ROLE_IDS', '');
    vi.stubEnv('PL_GUILD_ID', '');

    const { authOptions } = await import('@/lib/auth');
    const sessionCallback = authOptions.callbacks!.session!;

    (prisma.account.findFirst as any).mockResolvedValue({
      providerAccountId: 'admin-1',
    });

    const session: any = {};
    const user: any = { id: 'u1', name: 'AdminUser' };
    const result: any = await (sessionCallback as any)({ session, user, token: {} });

    expect(result.discordUserId).toBe('admin-1');
    expect(result.isAdmin).toBe(true);

    vi.unstubAllEnvs();
  });

  it('does not mark user as admin when their ID is not in the list', async () => {
    vi.stubEnv('NEXTAUTH_SECRET', 'test-secret');
    vi.stubEnv('VOTING_ADMIN_USER_IDS', 'admin-1,admin-2');
    vi.stubEnv('VOTING_ADMIN_ROLE_IDS', '');
    vi.stubEnv('PL_GUILD_ID', '');

    const { authOptions } = await import('@/lib/auth');
    const sessionCallback = authOptions.callbacks!.session!;

    (prisma.account.findFirst as any).mockResolvedValue({
      providerAccountId: 'regular-user',
    });

    const session: any = {};
    const user: any = { id: 'u2', name: 'RegularUser' };
    const result: any = await (sessionCallback as any)({ session, user, token: {} });

    expect(result.discordUserId).toBe('regular-user');
    expect(result.isAdmin).toBe(false);

    vi.unstubAllEnvs();
  });

  it('handles empty VOTING_ADMIN_USER_IDS gracefully', async () => {
    vi.stubEnv('NEXTAUTH_SECRET', 'test-secret');
    vi.stubEnv('VOTING_ADMIN_USER_IDS', '');
    vi.stubEnv('VOTING_ADMIN_ROLE_IDS', '');
    vi.stubEnv('PL_GUILD_ID', '');

    const { authOptions } = await import('@/lib/auth');
    const sessionCallback = authOptions.callbacks!.session!;

    (prisma.account.findFirst as any).mockResolvedValue({
      providerAccountId: 'any-user',
    });

    const session: any = {};
    const user: any = { id: 'u3', name: 'SomeUser' };
    const result: any = await (sessionCallback as any)({ session, user, token: {} });

    expect(result.isAdmin).toBe(false);

    vi.unstubAllEnvs();
  });

  it('handles whitespace in VOTING_ADMIN_USER_IDS', async () => {
    vi.stubEnv('NEXTAUTH_SECRET', 'test-secret');
    vi.stubEnv('VOTING_ADMIN_USER_IDS', ' admin-1 , admin-2 ');
    vi.stubEnv('VOTING_ADMIN_ROLE_IDS', '');
    vi.stubEnv('PL_GUILD_ID', '');

    const { authOptions } = await import('@/lib/auth');
    const sessionCallback = authOptions.callbacks!.session!;

    (prisma.account.findFirst as any).mockResolvedValue({
      providerAccountId: 'admin-2',
    });

    const session: any = {};
    const user: any = { id: 'u4', name: 'Admin2' };
    const result: any = await (sessionCallback as any)({ session, user, token: {} });

    expect(result.isAdmin).toBe(true);

    vi.unstubAllEnvs();
  });

  it('sets discordUsername from user name', async () => {
    vi.stubEnv('NEXTAUTH_SECRET', 'test-secret');
    vi.stubEnv('VOTING_ADMIN_USER_IDS', '');
    vi.stubEnv('VOTING_ADMIN_ROLE_IDS', '');
    vi.stubEnv('PL_GUILD_ID', '');

    const { authOptions } = await import('@/lib/auth');
    const sessionCallback = authOptions.callbacks!.session!;

    (prisma.account.findFirst as any).mockResolvedValue({
      providerAccountId: 'user-5',
    });

    const session: any = {};
    const user: any = { id: 'u5', name: 'CoolUser' };
    const result: any = await (sessionCallback as any)({ session, user, token: {} });

    expect(result.discordUsername).toBe('CoolUser');

    vi.unstubAllEnvs();
  });

  it('defaults discordUsername to Unknown when user has no name', async () => {
    vi.stubEnv('NEXTAUTH_SECRET', 'test-secret');
    vi.stubEnv('VOTING_ADMIN_USER_IDS', '');
    vi.stubEnv('VOTING_ADMIN_ROLE_IDS', '');
    vi.stubEnv('PL_GUILD_ID', '');

    const { authOptions } = await import('@/lib/auth');
    const sessionCallback = authOptions.callbacks!.session!;

    (prisma.account.findFirst as any).mockResolvedValue({
      providerAccountId: 'user-6',
    });

    const session: any = {};
    const user: any = { id: 'u6', name: null };
    const result: any = await (sessionCallback as any)({ session, user, token: {} });

    expect(result.discordUsername).toBe('Unknown');

    vi.unstubAllEnvs();
  });

  it('does not set session fields when no account is found', async () => {
    vi.stubEnv('NEXTAUTH_SECRET', 'test-secret');
    vi.stubEnv('VOTING_ADMIN_USER_IDS', '');
    vi.stubEnv('VOTING_ADMIN_ROLE_IDS', '');
    vi.stubEnv('PL_GUILD_ID', '');

    const { authOptions } = await import('@/lib/auth');
    const sessionCallback = authOptions.callbacks!.session!;

    (prisma.account.findFirst as any).mockResolvedValue(null);

    const session: any = {};
    const user: any = { id: 'u7', name: 'NoAccount' };
    const result: any = await (sessionCallback as any)({ session, user, token: {} });

    expect(result.discordUserId).toBeUndefined();
    expect(result.isAdmin).toBeUndefined();

    vi.unstubAllEnvs();
  });
});
