import { vi, describe, it, expect, beforeEach } from 'vitest';
import { execute, data } from '../commands/settings';
import { prisma } from '@photobot/db';

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
      guildId: '123456789',
      reply: vi.fn(),
    };
  });

  it('has the correct command name', () => {
    expect(data.name).toBe('settings');
  });

  it('returns an embed with feature toggles', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([
      { featureKey: 'discuss', isEnabled: true },
    ]);

    await execute(interaction);

    expect(prisma.featureConfig.findMany).toHaveBeenCalled();
    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      embeds: expect.any(Array),
      ephemeral: true,
    }));
  });

  it('rejects command outside of a server', async () => {
    interaction.guildId = null;

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining('only be used in a server'),
      ephemeral: true,
    }));
  });

  it('renders empty feature list with default message', async () => {
    (prisma.featureConfig.findMany as any).mockResolvedValue([]);

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      embeds: expect.any(Array),
      ephemeral: true,
    }));
  });
});
