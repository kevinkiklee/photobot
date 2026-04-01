import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export interface DiscussionPrompt {
  category: string;
  text: string;
}

const HEADING_TO_CATEGORY: Record<string, string> = {
  'Creative Process': 'creative',
  'Inspiration': 'inspiration',
};

export function parsePromptsMarkdown(markdown: string): DiscussionPrompt[] {
  const prompts: DiscussionPrompt[] = [];
  let currentCategory: string | null = null;

  for (const line of markdown.split('\n')) {
    const headingMatch = line.match(/^## (.+)$/);
    if (headingMatch) {
      const heading = headingMatch[1].trim();
      currentCategory = HEADING_TO_CATEGORY[heading] ?? heading.toLowerCase();
      continue;
    }

    if (!currentCategory) continue;

    const promptMatch = line.match(/^- (.+)$/);
    if (!promptMatch) continue;

    const text = promptMatch[1].trim();

    prompts.push({ category: currentCategory, text });
  }

  return prompts;
}

export function loadPrompts(): DiscussionPrompt[] {
  const md = readFileSync(join(__dirname, 'discussion-prompts.md'), 'utf-8');
  return parsePromptsMarkdown(md);
}
