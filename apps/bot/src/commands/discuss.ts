import { prisma } from '@photobot/db';
import {
  ChannelType,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { BRAND_COLOR } from '../constants';
import { canUseFeature } from '../middleware/permissions';
import { selectPrompt } from '../services/prompts';
import { createPromptEmbed } from '../utils/embed';

export const data = new SlashCommandBuilder()
  .setName('discuss')
  .setDescription('Photography discussion prompts for community engagement')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((sub) =>
    sub
      .setName('prompt')
      .setDescription('Post a discussion prompt')
      .addStringOption((opt) =>
        opt
          .setName('category')
          .setDescription('Prompt category')
          .addChoices({ name: 'Creative Process', value: 'creative' }, { name: 'Inspiration', value: 'inspiration' }),
      ),
  )
  .addSubcommand((sub) =>
    sub
      .setName('schedule')
      .setDescription('Set up automatic discussion prompts (posts every 6 hours)')
      .addChannelOption((opt) =>
        opt
          .setName('channel')
          .setDescription('Channel for auto-posts')
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true),
      )
      .addStringOption((opt) =>
        opt
          .setName('category')
          .setDescription('Limit to a category')
          .addChoices({ name: 'Creative Process', value: 'creative' }, { name: 'Inspiration', value: 'inspiration' }),
      ),
  )
  .addSubcommand((sub) => sub.setName('list').setDescription('List discussion schedules')) as SlashCommandBuilder;

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guildId) {
    return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
  }

  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'prompt') {
    return handlePrompt(interaction);
  }
  if (subcommand === 'schedule') {
    return handleSchedule(interaction);
  }
  if (subcommand === 'list') {
    return handleList(interaction);
  }
}

function extractRoleIds(member: ChatInputCommandInteraction['member']): string[] {
  if (!member?.roles) return [];
  if ('cache' in member.roles) return [...member.roles.cache.keys()];
  if (Array.isArray(member.roles)) return member.roles;
  return [];
}

async function handlePrompt(interaction: ChatInputCommandInteraction) {
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

  // Log to database — failure here shouldn't block the user response
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

async function handleSchedule(interaction: ChatInputCommandInteraction) {
  const channel = interaction.options.getChannel('channel', true);
  const category = interaction.options.getString('category');

  try {
    // Upsert — re-running /discuss schedule on the same channel updates the
    // config rather than creating a duplicate.
    await prisma.discussionSchedule.upsert({
      where: { channelId: channel.id },
      update: { categoryFilter: category, createdBy: interaction.user.id },
      create: {
        channelId: channel.id,
        categoryFilter: category,
        createdBy: interaction.user.id,
      },
    });

    await prisma.configAuditLog.create({
      data: {
        userId: interaction.user.id,
        action: 'SET_SCHEDULE',
        targetType: 'CHANNEL',
        targetId: channel.id,
        featureKey: 'discuss',
        newValue: { categoryFilter: category },
      },
    });

    return interaction.reply({
      content: `Discussion prompts enabled for <#${channel.id}> — posts every 6 hours, waiting for a natural pause in conversation.${category ? ` Category: ${category}.` : ''}`,
      ephemeral: true,
    });
  } catch (err) {
    console.error('Failed to set discussion schedule:', err);
    return interaction.reply({
      content: 'Something went wrong saving the schedule. Please try again.',
      ephemeral: true,
    });
  }
}

async function handleList(interaction: ChatInputCommandInteraction) {
  const schedules = await prisma.discussionSchedule.findMany();

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
      const cat = s.categoryFilter ? ` | ${s.categoryFilter}` : '';
      embed.addFields({
        name: `<#${s.channelId}>`,
        value: `Every 6 hours — ${status}${cat}`,
      });
    }
  }

  return interaction.reply({ embeds: [embed], ephemeral: true });
}
