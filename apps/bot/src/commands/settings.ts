import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { prisma } from '@photobot/db';

export const data = new SlashCommandBuilder()
  .setName('settings')
  .setDescription('View bot feature settings for this server')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId;

  if (!guildId) {
    return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
  }

  const configs = await prisma.featureConfig.findMany({
    where: {
      serverId: guildId,
      targetType: 'SERVER',
      targetId: guildId,
    },
  });

  const embed = new EmbedBuilder()
    .setTitle('Feature Toggles')
    .setDescription('Current feature configuration for this server:')
    .setColor(0x00AE86);

  if (configs.length === 0) {
    embed.addFields({ name: 'No configurations found', value: 'All features are at their default settings.' });
  } else {
    configs.forEach((config: any) => {
      embed.addFields({
        name: config.featureKey,
        value: config.isEnabled ? '✅ Enabled' : '❌ Disabled',
        inline: true,
      });
    });
  }

  return interaction.reply({ embeds: [embed], ephemeral: true });
}
