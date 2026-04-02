import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const prisma = new PrismaClient();

const KEYWORD_TAGS: Record<string, string[]> = {
  motivation: ['rut', 'burnout', 'motivated', 'motivation', 'creative block', 'push through', 'uninspired', 'energy', 'drive', 'stuck'],
  workflow: ['process', 'routine', 'habit', 'workflow', 'warm up', 'ritual', 'daily', 'weekly', 'schedule', 'practice'],
  style: ['style', 'voice', 'aesthetic', 'identity', 'signature', 'evolving', 'personal look', 'visual language'],
  editing: ['edit', 'post-processing', 'post processing', 'lightroom', 'color grade', 'color palette', 'crop', 'black-and-white', 'retouch'],
  portfolio: ['portfolio', 'curate', 'share publicly', 'present', 'gallery', 'showcase', 'body of work'],
  storytelling: ['story', 'narrative', 'emotion', 'feeling', 'evoke', 'meaning', 'message', 'convey', 'document'],
  collaboration: ['collaborat', 'partner', 'model', 'team', 'together', 'co-create'],
  'social-media': ['social media', 'instagram', 'engagement', 'audience', 'followers', 'likes', 'platform', 'online'],
  gear: ['gear', 'lens', 'camera', 'focal length', 'equipment', 'limitations'],
  ethics: ['ethics', 'consent', 'strangers', 'public space', 'respectful', 'vulnerable', 'exploit', 'responsible'],
  business: ['client', 'commercial', 'career', 'paid work', 'side hustle', 'professional', 'commission'],
  influences: ['influence', 'inspired by', 'painting', 'film', 'music', 'book', 'documentary', 'photographer.*impact', 'art form'],
  learning: ['lesson', 'learn', 'advice', 'mistake', 'failure', 'growth', 'improve', 'taught'],
  projects: ['project', 'series', 'long-term', 'multi-month', 'body of work', 'archive'],
  'self-reflection': ['why', 'identity', 'yourself', 'personal', 'emotion', 'meaning', 'memoir', 'introspect', 'changed'],
  community: ['community', 'connect', 'teach', 'mentor', 'share knowledge', 'workshop', 'group'],
  technique: ['composition', 'light', 'lighting', 'exposure', 'focus', 'depth of field', 'shutter', 'aperture', 'color'],
};

function assignTags(text: string): string[] {
  const lower = text.toLowerCase();
  const tags = new Set<string>();

  for (const [tag, keywords] of Object.entries(KEYWORD_TAGS)) {
    for (const keyword of keywords) {
      if (new RegExp(keyword, 'i').test(lower)) {
        tags.add(tag);
        break;
      }
    }
  }

  if (tags.size === 0) {
    tags.add('self-reflection');
  }

  return Array.from(tags).slice(0, 3);
}

interface ParsedPrompt {
  category: string;
  text: string;
}

function parseMarkdown(content: string): ParsedPrompt[] {
  const HEADING_TO_CATEGORY: Record<string, string> = {
    'Creative Process': 'creative',
    'Inspiration': 'inspiration',
  };

  const prompts: ParsedPrompt[] = [];
  let currentCategory = '';

  for (const line of content.split('\n')) {
    const headingMatch = line.match(/^##\s+(.+)/);
    if (headingMatch) {
      const heading = headingMatch[1].trim();
      currentCategory = HEADING_TO_CATEGORY[heading] || heading.toLowerCase();
      continue;
    }

    const promptMatch = line.match(/^-\s+(.+)/);
    if (promptMatch && currentCategory) {
      prompts.push({ category: currentCategory, text: promptMatch[1].trim() });
    }
  }

  return prompts;
}

async function main() {
  const mdPath = resolve(__dirname, '../apps/bot/src/data/discussion-prompts.md');
  const content = readFileSync(mdPath, 'utf-8');
  const prompts = parseMarkdown(content);

  console.log(`Parsed ${prompts.length} prompts. Seeding...`);

  let created = 0;
  let skipped = 0;

  for (const p of prompts) {
    const existing = await prisma.prompt.findFirst({ where: { text: p.text } });
    if (existing) {
      skipped++;
      continue;
    }

    const tags = assignTags(p.text);

    await prisma.prompt.create({
      data: {
        text: p.text,
        originalCategory: p.category,
        tags: {
          create: tags.map(tag => ({ tag })),
        },
      },
    });
    created++;
  }

  console.log(`Done. Created: ${created}, Skipped (duplicates): ${skipped}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
