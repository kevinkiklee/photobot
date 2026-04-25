import { loadPrompts } from './data/parse-prompts';

export type { DiscussionPrompt } from './data/parse-prompts';

export const BRAND_COLOR = 0x74d7ec;

export const STAFF_ROLE_IDS: readonly string[] = [
  '728914549138260000', // Owner
  '1152221843168698400', // Admin
  '728914863480504342', // Mod
];

export const DISCUSSION_CATEGORIES: Record<string, { label: string; description: string }> = {
  creative: { label: 'Creative Process', description: 'Inspiration, artistic voice, creative blocks' },
  inspiration: { label: 'Inspiration', description: 'Other art forms, artists, cross-discipline ideas' },
};

export const DISCUSSION_PROMPTS = loadPrompts();
