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

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DAY_PARSE_MAP: Record<string, number[]> = {
  sun: [0], mon: [1], tue: [2], wed: [3], thu: [4], fri: [5], sat: [6],
  daily: [0, 1, 2, 3, 4, 5, 6],
  weekdays: [1, 2, 3, 4, 5],
  weekends: [0, 6],
};

function parseDays(input: string): number[] {
  const parts = input.toLowerCase().split(',').map(s => s.trim());
  const days = new Set<number>();
  for (const part of parts) {
    const mapped = DAY_PARSE_MAP[part];
    if (mapped) mapped.forEach(d => days.add(d));
  }
  return Array.from(days).sort();
}

function parseTime(input: string): string {
  const match = input.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return '00:00';
  const h = match[1].padStart(2, '0');
  const m = match[2];
  return `${h}:${m}`;
}

export const data = new SlashCommandBuilder()
  .setName('discuss')
  .setDescription('Photography discussion prompts for community engagement')
  .addSubcommand(sub =>
    sub.setName('prompt')
      .setDescription('Post a discussion prompt')
      .addStringOption(opt =>
        opt.setName('category')
          .setDescription('Prompt category')
          .addChoices(
            { name: 'Technique', value: 'technique' },
            { name: 'Gear', value: 'gear' },
            { name: 'Creative Process', value: 'creative' },
            { name: 'Challenge', value: 'challenge' },
            { name: 'Inspiration', value: 'inspiration' },
          )
      )
  )
  .addSubcommand(sub =>
    sub.setName('schedule')
      .setDescription('Set up automatic discussion prompts')
      .addChannelOption(opt =>
        opt.setName('channel')
          .setDescription('Channel for auto-posts')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt.setName('days')
          .setDescription('Days to post (e.g. "mon,wed,fri", "daily", "weekdays")')
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt.setName('time')
          .setDescription('Time in UTC (e.g. "9:00", "14:30")')
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt.setName('timezone')
          .setDescription('Your timezone for display (e.g. "America/New_York")')
      )
      .addStringOption(opt =>
        opt.setName('category')
          .setDescription('Limit to a category')
          .addChoices(
            { name: 'Technique', value: 'technique' },
            { name: 'Gear', value: 'gear' },
            { name: 'Creative Process', value: 'creative' },
            { name: 'Challenge', value: 'challenge' },
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

  // Check if server has a schedule with useAi
  const schedule = await prisma.discussionSchedule.findUnique({
    where: { serverId_channelId: { serverId: guildId, channelId: interaction.channelId } },
  });
  const useAi = schedule?.useAi ?? false;

  const prompt = await selectPrompt(guildId, useAi, category);

  const embed = new EmbedBuilder()
    .setColor(BRAND_COLOR)
    .setTitle('Discussion Prompt')
    .setDescription(`${prompt.text}\n\n*Jump into the thread below to share your thoughts!*`)
    .setFooter({ text: `Photobot • ${prompt.category}` })
    .setTimestamp();

  const replyMsg = await interaction.reply({
    embeds: [embed],
    fetchReply: true,
  });

  // Create thread
  const threadName = `Discuss: ${prompt.text.slice(0, 90)}`;
  let threadId: string | null = null;
  try {
    const thread = await replyMsg.startThread({ name: threadName });
    threadId = thread.id;
  } catch (err) {
    console.error('Failed to create discussion thread:', err);
  }

  // Add reactions
  for (const emoji of prompt.reactions) {
    try {
      await replyMsg.react(emoji);
    } catch (err) {
      console.error('Failed to add reaction:', err);
    }
  }

  // Log to database
  await prisma.discussionPromptLog.create({
    data: {
      serverId: guildId,
      channelId: interaction.channelId,
      promptText: prompt.text,
      category: prompt.category,
      source: prompt.source,
      threadId,
    },
  });
}

async function handleSchedule(interaction: ChatInputCommandInteraction, guildId: string) {
  const channel = interaction.options.getChannel('channel', true);
  const daysInput = interaction.options.getString('days', true);
  const timeInput = interaction.options.getString('time', true);
  const timezone = interaction.options.getString('timezone') ?? 'UTC';
  const category = interaction.options.getString('category');
  const useAi = interaction.options.getBoolean('use_ai') ?? false;

  const days = parseDays(daysInput);
  if (days.length === 0) {
    return interaction.reply({
      content: 'Invalid days format. Use names like "mon,wed,fri", "daily", or "weekdays".',
      ephemeral: true,
    });
  }

  const timeUtc = parseTime(timeInput);

  await prisma.discussionSchedule.upsert({
    where: {
      serverId_channelId: { serverId: guildId, channelId: channel.id },
    },
    update: { days, timeUtc, timezone, categoryFilter: category, useAi, createdBy: interaction.user.id },
    create: {
      serverId: guildId,
      channelId: channel.id,
      days,
      timeUtc,
      timezone,
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
      newValue: { days, timeUtc, timezone, categoryFilter: category, useAi },
    },
  });

  const dayLabels = days.map(d => DAY_NAMES[d]).join(', ');
  return interaction.reply({
    content: `Discussion schedule set for <#${channel.id}>: **${dayLabels}** at **${timeUtc} UTC** (${timezone}).${category ? ` Category: ${category}.` : ''}${useAi ? ' AI-generated prompts enabled.' : ''}`,
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
      const dayLabels = (s.days as number[]).map(d => DAY_NAMES[d]).join(', ');
      const status = s.isActive ? '✅ Active' : '⏸️ Paused';
      const ai = s.useAi ? ' | AI' : '';
      const cat = s.categoryFilter ? ` | ${s.categoryFilter}` : '';
      embed.addFields({
        name: `<#${s.channelId}>`,
        value: `${dayLabels} at ${s.timeUtc} UTC (${s.timezone}) — ${status}${ai}${cat}`,
      });
    }
  }

  return interaction.reply({ embeds: [embed], ephemeral: true });
}
