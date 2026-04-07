import { prisma } from '@photobot/db';

export interface AdminStats {
  totalVotes: number;
  uniqueVoters: number;
  promptsWithZeroVotes: number;
}

export interface PromptVoterDetail {
  discordUsername: string;
  vote: 'UP' | 'DOWN';
  createdAt: Date;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [totalVotes, uniqueVoters, totalPrompts, promptsWithVotes] = await Promise.all([
    prisma.promptVote.count(),
    prisma.promptVote.groupBy({ by: ['discordUserId'] }).then((r) => r.length),
    prisma.prompt.count(),
    prisma.promptVote.groupBy({ by: ['promptId'] }).then((r) => r.length),
  ]);

  return {
    totalVotes,
    uniqueVoters,
    promptsWithZeroVotes: totalPrompts - promptsWithVotes,
  };
}

export async function getVotersForPrompt(promptId: string): Promise<PromptVoterDetail[]> {
  const votes = await prisma.promptVote.findMany({
    where: { promptId },
    orderBy: { createdAt: 'desc' },
    select: { discordUsername: true, vote: true, createdAt: true },
  });
  return votes as PromptVoterDetail[];
}
