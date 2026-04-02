import { prisma } from '@photobot/db';

type Direction = 'UP' | 'DOWN';

export interface VoteResult {
  upvotes: number;
  downvotes: number;
  userVote: Direction | null;
}

export async function handleVote(
  promptId: string,
  discordUserId: string,
  discordUsername: string,
  direction: Direction,
): Promise<VoteResult> {
  const existing = await prisma.promptVote.findUnique({
    where: { promptId_discordUserId: { promptId, discordUserId } },
  });

  let userVote: Direction | null = direction;

  if (existing && existing.vote === direction) {
    await prisma.promptVote.delete({ where: { id: existing.id } });
    userVote = null;
  } else if (existing) {
    await prisma.promptVote.update({ where: { id: existing.id }, data: { vote: direction } });
  } else {
    await prisma.promptVote.create({
      data: { promptId, discordUserId, discordUsername, vote: direction },
    });
  }

  const [upvotes, downvotes] = await Promise.all([
    prisma.promptVote.count({ where: { promptId, vote: 'UP' } }),
    prisma.promptVote.count({ where: { promptId, vote: 'DOWN' } }),
  ]);

  return { upvotes, downvotes, userVote };
}
