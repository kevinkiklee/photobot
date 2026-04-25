import { prisma } from '@photobot/db';
import {
  ChannelType,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { BRAND_COLOR } from '../constants';
import { canUseFeature } from '../middleware/permissions';
import { isCycleLockHeld, runDailyCycle } from '../services/discussion-cycle';
import { selectPrompt } from '../services/prompts';
import { createPromptEmbed } from '../utils/embed';

export const data = new SlashCommandBuilder()
  .setName('discuss')
  .setDescription('Photography discussion prompts for community engagement')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((sub) =>
    sub
      .setName('schedule')
      .setDescription('Configure the daily discussion cycle (08:00 UTC daily, re-announces every 6 hours)')
      .addChannelOption((opt) =>
        opt
          .setName('discussions')
          .setDescription('Channel where the daily prompt + thread is posted')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true),
      )
      .addChannelOption((opt) =>
        opt
          .setName('lounge')
          .setDescription('Channel where re-announcements are posted with thread links')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true),
      )
      .addStringOption((opt) =>
        opt
          .setName('category')
          .setDescription('Limit prompts to a category')
          .addChoices(
            { name: 'Creative Process', value: 'creative' },
            { name: 'Inspiration', value: 'inspiration' },
          ),
      ),
  )
  .addSubcommand((sub) =>
    sub.setName('post-daily').setDescription('Manually fire the daily discussion cycle now'),
  )
  .addSubcommand((sub) =>
    sub
      .setName('post-here')
      .setDescription('Post a one-off prompt in the current channel (no thread, no lounge)')
      .addStringOption((opt) =>
        opt
          .setName('category')
          .setDescription('Limit to a category')
          .addChoices(
            { name: 'Creative Process', value: 'creative' },
            { name: 'Inspiration', value: 'inspiration' },
          ),
      ),
  )
  .addSubcommand((sub) =>
    sub.setName('config').setDescription('Show the current discussion cycle configuration'),
  )
  .addSubcommand((sub) =>
    sub.setName('enable').setDescription('Enable the daily discussion cycle'),
  )
  .addSubcommand((sub) =>
    sub.setName('disable').setDescription('Disable the daily discussion cycle'),
  ) as SlashCommandBuilder;

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guildId) {
    return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
  }

  const sub = interaction.options.getSubcommand();
  switch (sub) {
    case 'schedule':
      return handleSchedule(interaction);
    case 'post-daily':
      return handlePostDaily(interaction);
    case 'post-here':
      return handlePostHere(interaction);
    case 'config':
      return handleConfig(interaction);
    case 'enable':
      return handleEnable(interaction);
    case 'disable':
      return handleDisable(interaction);
  }
}

function extractRoleIds(member: ChatInputCommandInteraction['member']): string[] {
  if (!member?.roles) return [];
  if ('cache' in member.roles) return [...member.roles.cache.keys()];
  if (Array.isArray(member.roles)) return member.roles;
  return [];
}

async function handleSchedule(interaction: ChatInputCommandInteraction) {
  const discussions = interaction.options.getChannel('discussions', true);
  const lounge = interaction.options.getChannel('lounge', true);
  const category = interaction.options.getString('category');

  if (discussions.id === lounge.id) {
    return interaction.reply({
      content: 'The discussions and lounge channels must be different.',
      ephemeral: true,
    });
  }

  // Verify both fetch as TextChannels via the live client.
  let discussionsChannel: unknown;
  let loungeChannel: unknown;
  try {
    discussionsChannel = await interaction.client.channels.fetch(discussions.id);
    loungeChannel = await interaction.client.channels.fetch(lounge.id);
  } catch (err) {
    console.error('Failed to fetch channels during /discuss schedule:', err);
    return interaction.reply({
      content: 'Could not access one of the channels. Check that the bot has permission to view them.',
      ephemeral: true,
    });
  }
  if (!(discussionsChannel instanceof TextChannel) || !(loungeChannel instanceof TextChannel)) {
    return interaction.reply({
      content: 'Both channels must be standard text channels.',
      ephemeral: true,
    });
  }

  const previous = await prisma.discussionConfig.findUnique({ where: { id: 'singleton' } });

  await prisma.discussionConfig.upsert({
    where: { id: 'singleton' },
    create: {
      id: 'singleton',
      discussionsChannelId: discussions.id,
      loungeChannelId: lounge.id,
      categoryFilter: category,
      lastUpdatedBy: interaction.user.id,
    },
    update: {
      discussionsChannelId: discussions.id,
      loungeChannelId: lounge.id,
      categoryFilter: category,
      isActive: true,
      lastUpdatedBy: interaction.user.id,
    },
  });

  await prisma.configAuditLog.create({
    data: {
      userId: interaction.user.id,
      action: 'SET_DISCUSSION_CONFIG',
      targetType: 'GLOBAL',
      targetId: 'singleton',
      featureKey: 'discuss',
      oldValue: previous
        ? {
            discussionsChannelId: previous.discussionsChannelId,
            loungeChannelId: previous.loungeChannelId,
            categoryFilter: previous.categoryFilter,
          }
        : null,
      newValue: {
        discussionsChannelId: discussions.id,
        loungeChannelId: lounge.id,
        categoryFilter: category,
      },
    },
  });

  return interaction.reply({
    content:
      `Discussion cycle configured. Daily prompt in <#${discussions.id}> at 08:00 UTC; ` +
      `announcements in <#${lounge.id}> at 08:00, 14:00, 20:00, 02:00 UTC.` +
      (category ? ` Category: ${category}.` : ''),
    ephemeral: true,
  });
}

async function handlePostDaily(interaction: ChatInputCommandInteraction) {
  if (isCycleLockHeld()) {
    return interaction.reply({
      content: 'A discussion cycle is already in progress, try again in a few minutes.',
      ephemeral: true,
    });
  }

  const config = await prisma.discussionConfig.findUnique({ where: { id: 'singleton' } });
  if (!config) {
    return interaction.reply({
      content: 'No configuration set. Use /discuss schedule first.',
      ephemeral: true,
    });
  }

  await interaction.deferReply({ ephemeral: true });

  const result = await runDailyCycle(interaction.client, config);

  await prisma.configAuditLog.create({
    data: {
      userId: interaction.user.id,
      action: 'POST_DAILY_MANUAL',
      targetType: 'PROMPT_LOG',
      targetId: 'singleton',
      featureKey: 'discuss',
      newValue: { result: result.ok ? 'ok' : (result as { reason: string }).reason },
    },
  });

  if (result.ok) {
    return interaction.editReply({ content: 'Daily cycle fired.' });
  }
  return interaction.editReply({
    content: `Daily cycle failed: ${(result as { reason: string }).reason}.`,
  });
}

async function handlePostHere(interaction: ChatInputCommandInteraction) {
  const roleIds = extractRoleIds(interaction.member);
  const allowed = await canUseFeature(interaction.channelId, roleIds, 'discuss');
  if (!allowed) {
    return interaction.reply({
      content: 'The discussion prompt feature is not enabled for this server.',
      ephemeral: true,
    });
  }

  const category = interaction.options.getString('category');
  const prompt = await selectPrompt(category);
  const embed = createPromptEmbed(prompt.text, prompt.category);

  await interaction.reply({ embeds: [embed] });

  try {
    await prisma.discussionPromptLog.create({
      data: {
        channelId: interaction.channelId,
        promptText: prompt.text,
        category: prompt.category,
      },
    });
  } catch (err) {
    console.error('Failed to log discussion prompt:', err);
  }
}

async function handleConfig(interaction: ChatInputCommandInteraction) {
  const config = await prisma.discussionConfig.findUnique({ where: { id: 'singleton' } });
  const embed = new EmbedBuilder()
    .setColor(BRAND_COLOR)
    .setTitle('Discussion Cycle Configuration')
    .setFooter({ text: 'Photobot' })
    .setTimestamp();

  if (!config) {
    embed.setDescription('No configuration set. Use /discuss schedule to set up the daily cycle.');
  } else {
    embed.addFields(
      { name: 'Discussions channel', value: `<#${config.discussionsChannelId}>`, inline: true },
      { name: 'Lounge channel', value: `<#${config.loungeChannelId}>`, inline: true },
      { name: 'Category', value: config.categoryFilter ?? 'all', inline: true },
      { name: 'Active', value: config.isActive ? 'Yes' : 'No', inline: true },
      { name: 'Last updated by', value: `<@${config.lastUpdatedBy}>`, inline: true },
    );
  }

  return interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleEnable(interaction: ChatInputCommandInteraction) {
  const existing = await prisma.discussionConfig.findUnique({ where: { id: 'singleton' } });
  if (!existing) {
    return interaction.reply({
      content: 'No configuration set. Use /discuss schedule first.',
      ephemeral: true,
    });
  }

  await prisma.discussionConfig.update({
    where: { id: 'singleton' },
    data: { isActive: true, lastUpdatedBy: interaction.user.id },
  });

  await prisma.configAuditLog.create({
    data: {
      userId: interaction.user.id,
      action: 'ENABLE_DISCUSSION',
      targetType: 'GLOBAL',
      targetId: 'singleton',
      featureKey: 'discuss',
      newValue: { isActive: true },
    },
  });

  return interaction.reply({ content: 'Discussion cycle enabled.', ephemeral: true });
}

async function handleDisable(interaction: ChatInputCommandInteraction) {
  const existing = await prisma.discussionConfig.findUnique({ where: { id: 'singleton' } });
  if (!existing) {
    return interaction.reply({
      content: 'No configuration set. Use /discuss schedule first.',
      ephemeral: true,
    });
  }

  await prisma.discussionConfig.update({
    where: { id: 'singleton' },
    data: { isActive: false, lastUpdatedBy: interaction.user.id },
  });

  await prisma.configAuditLog.create({
    data: {
      userId: interaction.user.id,
      action: 'DISABLE_DISCUSSION',
      targetType: 'GLOBAL',
      targetId: 'singleton',
      featureKey: 'discuss',
      newValue: { isActive: false },
    },
  });

  return interaction.reply({ content: 'Discussion cycle disabled.', ephemeral: true });
}
