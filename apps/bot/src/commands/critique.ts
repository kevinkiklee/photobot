import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { bouncerService, aiProvider } from '../services/ai';
import { BRAND_COLOR } from '../constants';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';

export const data = new SlashCommandBuilder()
  .setName('critique')
  .setDescription('Get technical feedback on an uploaded image')
  .addAttachmentOption(option =>
    option.setName('image')
      .setDescription('The image to critique')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const attachment = interaction.options.getAttachment('image');

  if (!attachment || !attachment.contentType?.startsWith('image/')) {
    return interaction.reply({ content: 'Please attach an image to critique.', ephemeral: true });
  }

  await interaction.deferReply();

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'photobot-'));
  const tempPath = path.join(tempDir, attachment.name);

  try {
    // Download image
    const response = await fetch(attachment.url);
    if (!response.ok) throw new Error('Failed to download image.');
    const arrayBuffer = await response.arrayBuffer();
    await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

    // Rate Limit Check
    const rateLimit = await bouncerService.checkRateLimit(interaction.user.id);
    if (!rateLimit.allowed) {
      return interaction.editReply(`Rate limit exceeded. Please try again later.`);
    }

    // Moderation Check
    const moderation = await bouncerService.moderateImage(tempPath);
    if (!moderation.allowed) {
      return interaction.editReply(moderation.reason || 'Image violated safety guidelines.');
    }

    // Layer 2 Analysis: Critique
    const prompt = `Provide a detailed technical critique of this photograph.
    Focus on composition, lighting, focus, and technical execution.
    Be constructive and professional.`;

    const analysis = await aiProvider.analyzeImage(tempPath, prompt);

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle('Photo Critique')
      .setDescription(analysis)
      .setThumbnail(attachment.url)
      .setFooter({ text: 'Photobot' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

  } catch (error) {
    console.error('Critique command error:', error);
    await interaction.editReply('There was an error while processing your image.');
  } finally {
    // Cleanup
    try {
      await fs.unlink(tempPath);
      await fs.rmdir(tempDir);
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
  }
}
