import { loadPrompts } from './data/parse-prompts';
export type { DiscussionPrompt } from './data/parse-prompts';

export const BRAND_COLOR = 0x74D7EC;

export const DISCUSSION_CATEGORIES: Record<string, { label: string; description: string }> = {
  creative: { label: 'Creative Process', description: 'Inspiration, artistic voice, creative blocks' },
  inspiration: { label: 'Inspiration', description: 'Other art forms, artists, cross-discipline ideas' },
};

export const DISCUSSION_PROMPTS = loadPrompts();
