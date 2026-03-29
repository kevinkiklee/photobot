import { vi, describe, it, expect, beforeEach } from 'vitest';
import { execute, data } from '../commands/settings';
import { prisma } from '@photobot/db';

vi.mock('@photobot/db', () => ({
  prisma: {
    featureConfig: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    configAuditLog: {
      create: vi.fn(),
    },
  },
}));

describe('Settings Command', () => {
  let interaction: any;

  beforeEach(() => {
    vi.clearAllMocks();
    interaction = {
      guildId: '123456789',
      user: { id: '987654321' },
      options: {
        getSubcommand: vi.fn(),
        getString: vi.fn(),
        getBoolean: vi.fn(),
      },
      reply: vi.fn(),
    };
  });

  it('has the correct command name', () => {
    expect(data.name).toBe('settings');
  });

  describe('list subcommand', () => {
    it('returns an embed with feature toggles', async () => {
      interaction.options.getSubcommand.mockReturnValue('list');
      (prisma.featureConfig.findMany as any).mockResolvedValue([
        { featureKey: 'ai_analysis', isEnabled: true },
      ]);

      await execute(interaction);

      expect(prisma.featureConfig.findMany).toHaveBeenCalled();
      expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
        embeds: expect.any(Array),
        ephemeral: true,
      }));
    });
  });

  describe('toggle subcommand', () => {
    it('updates feature toggle and creates audit log', async () => {
      interaction.options.getSubcommand.mockReturnValue('toggle');
      interaction.options.getString.mockReturnValue('ai_analysis');
      interaction.options.getBoolean.mockReturnValue(false);

      await execute(interaction);

      expect(prisma.featureConfig.upsert).toHaveBeenCalled();
      expect(prisma.configAuditLog.create).toHaveBeenCalled();
      expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
        content: expect.stringContaining('ai_analysis'),
        ephemeral: true,
      }));
    });
  });

  it('rejects command outside of a server', async () => {
    interaction.guildId = null;
    interaction.options.getSubcommand.mockReturnValue('list');

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      content: expect.stringContaining('only be used in a server'),
      ephemeral: true,
    }));
  });

  it('renders empty feature list with default message', async () => {
    interaction.options.getSubcommand.mockReturnValue('list');
    (prisma.featureConfig.findMany as any).mockResolvedValue([]);

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(expect.objectContaining({
      embeds: expect.any(Array),
      ephemeral: true,
    }));
  });
});
