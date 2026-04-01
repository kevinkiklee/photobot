import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { prisma } from '@photobot/db';
import { BRAND_COLOR } from '../constants';

export const data = new SlashCommandBuilder()
  .setName('ai')
  .setDescription('Manage who can use AI-powered commands')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand(sub =>
    sub.setName('grant-role')
      .setDescription('Grant AI access to a role')
      .addRoleOption(opt => opt.setName('role').setDescription('The role to grant access').setRequired(true))
  )
  .addSubcommand(sub =>
    sub.setName('revoke-role')
      .setDescription('Revoke AI access from a role')
      .addRoleOption(opt => opt.setName('role').setDescription('The role to revoke access').setRequired(true))
  )
  .addSubcommand(sub =>
    sub.setName('grant-user')
      .setDescription('Grant AI access to a user')
      .addUserOption(opt => opt.setName('user').setDescription('The user to grant access').setRequired(true))
  )
  .addSubcommand(sub =>
    sub.setName('revoke-user')
      .setDescription('Revoke AI access from a user')
      .addUserOption(opt => opt.setName('user').setDescription('The user to revoke access').setRequired(true))
  )
  .addSubcommand(sub =>
    sub.setName('list')
      .setDescription('List all AI access grants for this server')
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  const guildId = interaction.guildId;

  if (!guildId) {
    return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
  }

  if (subcommand === 'grant-role') {
    const role = interaction.options.getRole('role', true);
    await prisma.aIAccessGrant.upsert({
      where: { serverId_grantType_targetId: { serverId: guildId, grantType: 'ROLE', targetId: role.id } },
      update: {},
      create: { serverId: guildId, grantType: 'ROLE', targetId: role.id, grantedBy: interaction.user.id },
    });
    return interaction.reply({ content: `AI access granted to role **${role.name}**.`, ephemeral: true });
  }

  if (subcommand === 'revoke-role') {
    const role = interaction.options.getRole('role', true);
    const deleted = await prisma.aIAccessGrant.deleteMany({
      where: { serverId: guildId, grantType: 'ROLE', targetId: role.id },
    });
    if (deleted.count === 0) {
      return interaction.reply({ content: `Role **${role.name}** didn't have AI access.`, ephemeral: true });
    }
    return interaction.reply({ content: `AI access revoked from role **${role.name}**.`, ephemeral: true });
  }

  if (subcommand === 'grant-user') {
    const user = interaction.options.getUser('user', true);
    await prisma.aIAccessGrant.upsert({
      where: { serverId_grantType_targetId: { serverId: guildId, grantType: 'USER', targetId: user.id } },
      update: {},
      create: { serverId: guildId, grantType: 'USER', targetId: user.id, grantedBy: interaction.user.id },
    });
    return interaction.reply({ content: `AI access granted to **${user.username}**.`, ephemeral: true });
  }

  if (subcommand === 'revoke-user') {
    const user = interaction.options.getUser('user', true);
    const deleted = await prisma.aIAccessGrant.deleteMany({
      where: { serverId: guildId, grantType: 'USER', targetId: user.id },
    });
    if (deleted.count === 0) {
      return interaction.reply({ content: `**${user.username}** didn't have AI access.`, ephemeral: true });
    }
    return interaction.reply({ content: `AI access revoked from **${user.username}**.`, ephemeral: true });
  }

  if (subcommand === 'list') {
    const grants = await prisma.aIAccessGrant.findMany({
      where: { serverId: guildId },
      orderBy: [{ grantType: 'asc' }, { createdAt: 'asc' }],
    });

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle('AI Access Grants')
      .setFooter({ text: 'Photobot' })
      .setTimestamp();

    if (grants.length === 0) {
      embed.setDescription('No AI access grants configured. AI commands are currently restricted from all members.\n\nUse `/ai grant-role` or `/ai grant-user` to allow access.');
    } else {
      const roleGrants = grants.filter(g => g.grantType === 'ROLE');
      const userGrants = grants.filter(g => g.grantType === 'USER');

      if (roleGrants.length > 0) {
        embed.addFields({
          name: 'Roles',
          value: roleGrants.map(g => `<@&${g.targetId}>`).join('\n'),
        });
      }
      if (userGrants.length > 0) {
        embed.addFields({
          name: 'Users',
          value: userGrants.map(g => `<@${g.targetId}>`).join('\n'),
        });
      }
    }

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
