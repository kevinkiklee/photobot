import { prisma } from '@photobot/db';
import { type ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('settings')
  .setDescription('View bot feature settings for this server')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guildId) {
    return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
  }

  const configs = await prisma.featureConfig.findMany({
    where: {
      targetType: 'SERVER',
      targetId: process.env.PL_GUILD_ID!,
    },
  });

  const embed = new EmbedBuilder()
    .setTitle('Feature Toggles')
    .setDescription('Current feature configuration for this server:')
    .setColor(0x00ae86);

  if (configs.length === 0) {
    embed.addFields({ name: 'No configurations found', value: 'All features are at their default settings.' });
  } else {
    configs.forEach((config: any) => {
      embed.addFields({
        name: config.featureKey,
        value: config.isEnabled ? 'Enabled' : 'Disabled',
        inline: true,
      });
    });
  }

  return interaction.reply({ embeds: [embed], ephemeral: true });
}
