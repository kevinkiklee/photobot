import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
} from 'discord.js';
import { prisma } from '@photobot/db';
import { BRAND_COLOR } from '../constants';
import { selectPrompt } from '../services/prompts';
import { canUseFeature } from '../middleware/permissions';

export const data = new SlashCommandBuilder()
  .setName('discuss')
  .setDescription('Photography discussion prompts for community engagement')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand(sub =>
    sub.setName('prompt')
      .setDescription('Post a discussion prompt')
      .addStringOption(opt =>
        opt.setName('category')
          .setDescription('Prompt category')
          .addChoices(
            { name: 'Creative Process', value: 'creative' },
            { name: 'Inspiration', value: 'inspiration' },
          )
      )
  )
  .addSubcommand(sub =>
    sub.setName('schedule')
      .setDescription('Set up automatic discussion prompts (posts every 6 hours)')
      .addChannelOption(opt =>
        opt.setName('channel')
          .setDescription('Channel for auto-posts')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt.setName('category')
          .setDescription('Limit to a category')
          .addChoices(
            { name: 'Creative Process', value: 'creative' },
            { name: 'Inspiration', value: 'inspiration' },
          )
      )
      .addBooleanOption(opt =>
        opt.setName('use_ai')
          .setDescription('Use AI to generate prompts (default: false)')
      )
  )
  .addSubcommand(sub =>
    sub.setName('list')
      .setDescription('List discussion schedules for this server')
  ) as SlashCommandBuilder;

export async function execute(interaction: ChatInputCommandInteraction) {
  const guildId = interaction.guildId;
  if (!guildId) {
    return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
  }

  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'prompt') {
    return handlePrompt(interaction, guildId);
  }
  if (subcommand === 'schedule') {
    return handleSchedule(interaction, guildId);
  }
  if (subcommand === 'list') {
    return handleList(interaction, guildId);
  }
}

async function handlePrompt(interaction: ChatInputCommandInteraction, guildId: string) {
  const roleIds = interaction.member?.roles
    ? [...(interaction.member.roles as any).cache.keys()]
    : [];

  const allowed = await canUseFeature(guildId, interaction.channelId, roleIds, 'discuss');
  if (!allowed) {
    return interaction.reply({
      content: 'The discussion prompt feature is not enabled for this server.',
      ephemeral: true,
    });
  }

  const category = interaction.options.getString('category');

  // Inherit the AI setting from the channel's schedule config (if one exists)
  // so manual /discuss prompt calls use the same source as auto-posts.
  const schedule = await prisma.discussionSchedule.findUnique({
    where: { serverId_channelId: { serverId: guildId, channelId: interaction.channelId } },
  });
  const useAi = schedule?.useAi ?? false;

  const prompt = await selectPrompt(guildId, useAi, category);

  const embed = new EmbedBuilder()
    .setColor(BRAND_COLOR)
    .setTitle('Discussion Prompt')
    .setDescription(prompt.text)
    .setFooter({ text: `Photobot • ${prompt.category}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });

  // Log to database
  await prisma.discussionPromptLog.create({
    data: {
      serverId: guildId,
      channelId: interaction.channelId,
      promptText: prompt.text,
      category: prompt.category,
      source: prompt.source,
    },
  });
}

async function handleSchedule(interaction: ChatInputCommandInteraction, guildId: string) {
  const channel = interaction.options.getChannel('channel', true);
  const category = interaction.options.getString('category');
  const useAi = interaction.options.getBoolean('use_ai') ?? false;

  // Upsert — re-running /discuss schedule on the same channel updates the
  // config rather than creating a duplicate. The days/timeUtc fields are
  // legacy schema columns; the scheduler now uses interval-based timing.
  await prisma.discussionSchedule.upsert({
    where: {
      serverId_channelId: { serverId: guildId, channelId: channel.id },
    },
    update: { categoryFilter: category, useAi, createdBy: interaction.user.id },
    create: {
      serverId: guildId,
      channelId: channel.id,
      days: [0, 1, 2, 3, 4, 5, 6],
      timeUtc: '00:00',
      timezone: 'UTC',
      categoryFilter: category,
      useAi,
      createdBy: interaction.user.id,
    },
  });

  await prisma.configAuditLog.create({
    data: {
      serverId: guildId,
      userId: interaction.user.id,
      action: 'SET_SCHEDULE',
      targetType: 'CHANNEL',
      targetId: channel.id,
      featureKey: 'discuss',
      newValue: { categoryFilter: category, useAi },
    },
  });

  return interaction.reply({
    content: `Discussion prompts enabled for <#${channel.id}> — posts every 6 hours, waiting for a natural pause in conversation.${category ? ` Category: ${category}.` : ''}${useAi ? ' AI-generated prompts enabled.' : ''}`,
    ephemeral: true,
  });
}

async function handleList(interaction: ChatInputCommandInteraction, guildId: string) {
  const schedules = await prisma.discussionSchedule.findMany({
    where: { serverId: guildId },
  });

  const embed = new EmbedBuilder()
    .setColor(BRAND_COLOR)
    .setTitle('Discussion Schedules')
    .setFooter({ text: 'Photobot' })
    .setTimestamp();

  if (schedules.length === 0) {
    embed.setDescription('No discussion schedules configured. Use `/discuss schedule` to create one.');
  } else {
    for (const s of schedules) {
      const status = s.isActive ? 'Active' : 'Paused';
      const ai = s.useAi ? ' | AI' : '';
      const cat = s.categoryFilter ? ` | ${s.categoryFilter}` : '';
      embed.addFields({
        name: `<#${s.channelId}>`,
        value: `Every 6 hours — ${status}${ai}${cat}`,
      });
    }
  }

  return interaction.reply({ embeds: [embed], ephemeral: true });
}
