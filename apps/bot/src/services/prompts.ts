import { prisma } from '@photobot/db';
import { DISCUSSION_PROMPTS, DISCUSSION_CATEGORIES, type DiscussionPrompt } from '../constants';
import { aiProvider } from './ai';

interface PromptResult {
  text: string;
  category: string;
  source: 'curated' | 'ai';
}

const AI_PROMPT_TEMPLATE = (category: string | null) => `Generate a single engaging discussion question for a photography Discord community.

Category: ${category ? DISCUSSION_CATEGORIES[category]?.label ?? category : 'any photography or creative topic'}

Requirements:
- Be specific and thought-provoking, not generic
- Encourage members to share experiences, opinions, or photos
- Keep it to 1-2 sentences
- Do not include any preamble, numbering, or formatting — just the question`;

export async function selectPrompt(
  serverId: string,
  useAi: boolean,
  category: string | null,
): Promise<PromptResult> {
  if (useAi) {
    try {
      const text = await aiProvider.analyzeText(AI_PROMPT_TEMPLATE(category));
      const trimmed = text.trim().replace(/^["']|["']$/g, '');
      if (trimmed.length > 0) {
        return {
          text: trimmed,
          category: category ?? 'mixed',
          source: 'ai',
        };
      }
    } catch (error) {
      console.error('AI prompt generation failed, falling back to curated:', error);
    }
  }

  return selectCuratedPrompt(serverId, category);
}

async function selectCuratedPrompt(
  serverId: string,
  category: string | null,
): Promise<PromptResult> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentLogs = await prisma.discussionPromptLog.findMany({
    where: { serverId, postedAt: { gte: thirtyDaysAgo } },
    select: { promptText: true },
  });

  const recentTexts = new Set(recentLogs.map(l => l.promptText));

  let candidates = DISCUSSION_PROMPTS;
  if (category) {
    candidates = candidates.filter(p => p.category === category);
  }

  let available = candidates.filter(p => !recentTexts.has(p.text));

  // Reset if all exhausted
  if (available.length === 0) {
    available = candidates;
  }

  const pick = available[Math.floor(Math.random() * available.length)];
  return {
    text: pick.text,
    category: pick.category,
    source: 'curated',
  };
}
