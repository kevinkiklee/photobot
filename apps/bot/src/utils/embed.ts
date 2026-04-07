import { EmbedBuilder } from 'discord.js';
import { BRAND_COLOR } from '../constants';

export function createPromptEmbed(text: string, category: string, title = 'Discussion Prompt'): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(BRAND_COLOR)
    .setTitle(title)
    .setDescription(text)
    .setFooter({ text: `Photobot • ${category}` })
    .setTimestamp();
}
