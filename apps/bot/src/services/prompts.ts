// Selects a curated discussion prompt from discussion-prompts.md, cycling
// through the pool so prompts don't repeat within 30 days.

import { prisma } from '@photobot/db';
import { DISCUSSION_PROMPTS } from '../constants';

interface PromptResult {
  text: string;
  category: string;
}

export async function selectPrompt(
  category: string | null,
): Promise<PromptResult> {
  // Track prompts used in the last 30 days so we cycle through
  // the full pool before repeating.
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentLogs = await prisma.discussionPromptLog.findMany({
    where: { postedAt: { gte: thirtyDaysAgo } },
    select: { promptText: true },
  });

  const recentTexts = new Set(recentLogs.map(l => l.promptText));

  let candidates = DISCUSSION_PROMPTS;
  if (category) {
    candidates = candidates.filter(p => p.category === category);
  }

  let available = candidates.filter(p => !recentTexts.has(p.text));

  // If every prompt was used in the last 30 days, reset the pool and
  // start fresh rather than skipping the post entirely.
  if (available.length === 0) {
    available = candidates;
  }

  const pick = available[Math.floor(Math.random() * available.length)];
  return {
    text: pick.text,
    category: pick.category,
  };
}
