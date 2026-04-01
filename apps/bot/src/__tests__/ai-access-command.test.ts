import { vi, describe, it, expect, beforeEach } from 'vitest';
import { execute, data } from '../commands/ai-access';

vi.mock('@photobot/db', () => ({
  prisma: {
    aIAccessGrant: {
      upsert: vi.fn(),
      deleteMany: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '@photobot/db';

describe('AI Access Command', () => {
  let interaction: any;

  beforeEach(() => {
    vi.clearAllMocks();

    interaction = {
      guildId: 'guild-123',
      user: { id: 'admin-1' },
      options: {
        getSubcommand: vi.fn(),
        getRole: vi.fn(),
        getUser: vi.fn(),
      },
      reply: vi.fn().mockResolvedValue(undefined),
    };
  });

  it('has the correct command name', () => {
    expect(data.name).toBe('ai');
  });

  it('requires a server context', async () => {
    interaction.guildId = null;
    interaction.options.getSubcommand.mockReturnValue('list');

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining('only be used in a server'),
    }));
  });

  it('grants AI access to a role', async () => {
    interaction.options.getSubcommand.mockReturnValue('grant-role');
    interaction.options.getRole.mockReturnValue({ id: 'role-mod', name: 'Moderator' });
    (prisma.aIAccessGrant.upsert as any).mockResolvedValue({});

    await execute(interaction);

    expect(prisma.aIAccessGrant.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { serverId_grantType_targetId: { serverId: 'guild-123', grantType: 'ROLE', targetId: 'role-mod' } },
      create: expect.objectContaining({ serverId: 'guild-123', grantType: 'ROLE', targetId: 'role-mod', grantedBy: 'admin-1' }),
    }));
    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining('Moderator'),
    }));
  });

  it('revokes AI access from a role', async () => {
    interaction.options.getSubcommand.mockReturnValue('revoke-role');
    interaction.options.getRole.mockReturnValue({ id: 'role-mod', name: 'Moderator' });
    (prisma.aIAccessGrant.deleteMany as any).mockResolvedValue({ count: 1 });

    await execute(interaction);

    expect(prisma.aIAccessGrant.deleteMany).toHaveBeenCalledWith({
      where: { serverId: 'guild-123', grantType: 'ROLE', targetId: 'role-mod' },
    });
    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining('revoked'),
    }));
  });

  it('reports when revoking a role that had no access', async () => {
    interaction.options.getSubcommand.mockReturnValue('revoke-role');
    interaction.options.getRole.mockReturnValue({ id: 'role-x', name: 'Unknown' });
    (prisma.aIAccessGrant.deleteMany as any).mockResolvedValue({ count: 0 });

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining("didn't have AI access"),
    }));
  });

  it('grants AI access to a user', async () => {
    interaction.options.getSubcommand.mockReturnValue('grant-user');
    interaction.options.getUser.mockReturnValue({ id: 'user-42', username: 'photographer42' });
    (prisma.aIAccessGrant.upsert as any).mockResolvedValue({});

    await execute(interaction);

    expect(prisma.aIAccessGrant.upsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({ grantType: 'USER', targetId: 'user-42' }),
    }));
    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining('photographer42'),
    }));
  });

  it('lists grants with roles and users', async () => {
    interaction.options.getSubcommand.mockReturnValue('list');
    (prisma.aIAccessGrant.findMany as any).mockResolvedValue([
      { grantType: 'ROLE', targetId: 'role-mod', createdAt: new Date() },
      { grantType: 'USER', targetId: 'user-42', createdAt: new Date() },
    ]);

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      embeds: expect.arrayContaining([
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'AI Access Grants',
          }),
        }),
      ]),
    }));
  });

  it('shows helpful message when no grants exist', async () => {
    interaction.options.getSubcommand.mockReturnValue('list');
    (prisma.aIAccessGrant.findMany as any).mockResolvedValue([]);

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      embeds: expect.arrayContaining([
        expect.objectContaining({
          data: expect.objectContaining({
            description: expect.stringContaining('No AI access grants'),
          }),
        }),
      ]),
    }));
  });
});
