import { SlashCommandBuilder, ChatInputCommandInteraction, AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { bouncerService, aiProvider } from '../services/ai';
import { BRAND_COLOR } from '../constants';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import sharp from 'sharp';

export const data = new SlashCommandBuilder()
  .setName('palette')
  .setDescription('Extract a 5-color hex code palette from an image')
  .addAttachmentOption(option =>
    option.setName('image')
      .setDescription('The image to extract a palette from')
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const attachment = interaction.options.getAttachment('image');

  if (!attachment || !attachment.contentType?.startsWith('image/')) {
    return interaction.reply({ content: 'Please attach an image to extract a palette from.', ephemeral: true });
  }

  await interaction.deferReply();

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'photobot-'));
  const tempPath = path.join(tempDir, attachment.name);
  const palettePath = path.join(tempDir, 'palette.png');

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

    // AI Color Extraction
    const prompt = `Extract exactly five dominant colors from this image.
    Return them as a comma-separated list of hex codes (e.g., #FFFFFF, #000000, ...).
    Do not include any other text.`;

    const colorText = await aiProvider.analyzeImage(tempPath, prompt);
    const hexCodes = colorText.match(/#[0-9A-Fa-f]{6}/g);

    if (!hexCodes || hexCodes.length < 5) {
      return interaction.editReply('Could not extract a valid 5-color palette.');
    }

    const finalHexCodes = hexCodes.slice(0, 5);

    // Create a branded 5-color graphic using Sharp
    const width = 500;
    const height = 120;
    const borderSize = 4;
    const colorWidth = (width - borderSize * 2) / 5;
    const colorHeight = height - borderSize * 2;

    const svg = `
      <svg width="${width}" height="${height}">
        <rect x="0" y="0" width="${width}" height="${height}" rx="8" fill="#74D7EC" />
        ${finalHexCodes.map((color, i) => `
          <rect x="${borderSize + i * colorWidth}" y="${borderSize}" width="${colorWidth}" height="${colorHeight}" fill="${color}" ${i === 0 ? 'rx="6"' : ''} ${i === 4 ? 'rx="6"' : ''} />
        `).join('')}
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .png()
      .toFile(palettePath);

    const attachmentBuilder = new AttachmentBuilder(palettePath, { name: 'palette.png' });

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle('Color Palette')
      .setDescription(finalHexCodes.join(' • '))
      .setImage('attachment://palette.png')
      .setFooter({ text: 'Photobot' })
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
      files: [attachmentBuilder]
    });

  } catch (error) {
    console.error('Palette command error:', error);
    await interaction.editReply('There was an error while processing your image.');
  } finally {
    // Cleanup
    try {
      await fs.unlink(tempPath).catch(() => {});
      await fs.unlink(palettePath).catch(() => {});
      await fs.rmdir(tempDir).catch(() => {});
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
  }
}
