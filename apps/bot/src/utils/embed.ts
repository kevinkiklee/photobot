import { EmbedBuilder } from 'discord.js';
import { BRAND_COLOR } from '../constants';

export function createPromptEmbed(text: string, title = 'Discussion Prompt', threadUrl?: string): EmbedBuilder {
  const description = threadUrl ? `${text}\n\n💬 [Continue in thread](${threadUrl})` : text;
  return new EmbedBuilder()
    .setColor(BRAND_COLOR)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: 'Photobot' })
    .setTimestamp();
}
