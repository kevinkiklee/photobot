import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.stubEnv('PL_GUILD_ID', 'pl-guild-id');

import { prisma } from '@photobot/db';
import { data, execute } from '../commands/settings';

vi.mock('@photobot/db', () => ({
  prisma: {
    featureConfig: {
      findMany: vi.fn(),
    },
  },
}));

describe('Settings Command', () => {
  let interaction: any;

  beforeEach(() => {
    vi.clearAllMocks();
    interaction = {
      guildId: 'pl-guild-id',
      reply: vi.fn(),
    };
  });

  it('has the correct command name', () => {
    expect(data.name).toBe('settings');
  });

  it('returns an embed with feature toggles', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([{ featureKey: 'discuss', isEnabled: true }]);

    await execute(interaction);

    expect(prisma.featureConfig.findMany).toHaveBeenCalledWith({
      where: {
        targetType: 'SERVER',
        targetId: 'pl-guild-id',
      },
    });
    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        embeds: expect.any(Array),
        ephemeral: true,
      }),
    );
  });

  it('rejects command outside of a server', async () => {
    interaction.guildId = null;

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining('only be used in a server'),
        ephemeral: true,
      }),
    );
  });

  it('renders empty feature list with default message', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([]);

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        embeds: expect.any(Array),
        ephemeral: true,
      }),
    );
  });
});
