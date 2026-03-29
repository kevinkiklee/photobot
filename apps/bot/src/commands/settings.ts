import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { prisma } from '@photobot/db';

export const data = new SlashCommandBuilder()
  .setName('settings')
  .setDescription('Manage bot settings and feature toggles')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand(subcommand =>
    subcommand
      .setName('list')
      .setDescription('List all feature toggles for this server')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('toggle')
      .setDescription('Toggle a feature for this server')
      .addStringOption(option =>
        option.setName('feature')
          .setDescription('The feature key to toggle')
          .setRequired(true)
          .addChoices(
            { name: 'AI Image Analysis', value: 'ai_analysis' },
            { name: 'EXIF Metadata', value: 'exif_metadata' },
            { name: 'Auto Tagging', value: 'auto_tagging' }
          )
      )
      .addBooleanOption(option =>
        option.setName('enabled')
          .setDescription('Whether the feature should be enabled')
          .setRequired(true)
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  const guildId = interaction.guildId;

  if (!guildId) {
    return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
  }

  if (subcommand === 'list') {
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

  if (subcommand === 'toggle') {
    const featureKey = interaction.options.getString('feature', true);
    const isEnabled = interaction.options.getBoolean('enabled', true);

    await prisma.featureConfig.upsert({
      where: {
        serverId_targetType_targetId_featureKey: {
          serverId: guildId,
          targetType: 'SERVER',
          targetId: guildId,
          featureKey,
        },
      },
      update: {
        isEnabled,
      },
      create: {
        serverId: guildId,
        targetType: 'SERVER',
        targetId: guildId,
        featureKey,
        isEnabled,
      },
    });

    // Audit Log (optional, but requested in schema)
    await prisma.configAuditLog.create({
      data: {
        serverId: guildId,
        userId: interaction.user.id,
        action: 'TOGGLE_FEATURE',
        targetType: 'SERVER',
        targetId: guildId,
        featureKey,
        newValue: { isEnabled },
      },
    });

    return interaction.reply({
      content: `Feature \`${featureKey}\` has been **${isEnabled ? 'enabled' : 'disabled'}**.`,
      ephemeral: true,
    });
  }
}
