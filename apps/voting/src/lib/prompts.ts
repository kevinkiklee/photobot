import { prisma } from '@photobot/db';

const PAGE_SIZE = 20;

export type SortOption = 'approval' | 'votes' | 'alphabetical';

export interface PromptQueryParams {
  page?: number;
  sort?: SortOption;
  tags?: string[];
  q?: string;
}

export interface PromptWithVotes {
  id: string;
  text: string;
  originalCategory: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  approvalPct: number;
}

export interface PromptPage {
  prompts: PromptWithVotes[];
  page: number;
  totalPages: number;
  totalCount: number;
}

export async function fetchPrompts(
  params: PromptQueryParams,
  discordUserId?: string,
): Promise<PromptPage & { userVotes: Record<string, 'UP' | 'DOWN'> }> {
  const page = Math.max(1, params.page || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where: any = {};

  if (params.tags && params.tags.length > 0) {
    where.tags = { some: { tag: { in: params.tags } } };
  }

  if (params.q) {
    where.text = { contains: params.q, mode: 'insensitive' };
  }

  let orderBy: any = { createdAt: 'asc' };
  if (params.sort === 'alphabetical') {
    orderBy = { text: 'asc' };
  }

  const [prompts, totalCount] = await Promise.all([
    prisma.prompt.findMany({
      where,
      include: {
        tags: { select: { tag: true } },
        votes: { select: { vote: true, discordUserId: true } },
      },
      take: PAGE_SIZE,
      skip,
      orderBy,
    }),
    prisma.prompt.count({ where }),
  ]);

  const userVotes: Record<string, 'UP' | 'DOWN'> = {};

  const mapped: PromptWithVotes[] = prompts.map((p: any) => {
    const upvotes = p.votes.filter((v: any) => v.vote === 'UP').length;
    const downvotes = p.votes.filter((v: any) => v.vote === 'DOWN').length;
    const total = upvotes + downvotes;
    const approvalPct = total > 0 ? Math.round((upvotes / total) * 100) : 0;

    if (discordUserId) {
      const userVote = p.votes.find((v: any) => v.discordUserId === discordUserId);
      if (userVote) userVotes[p.id] = userVote.vote;
    }

    return {
      id: p.id,
      text: p.text,
      originalCategory: p.originalCategory,
      tags: p.tags.map((t: any) => t.tag),
      upvotes,
      downvotes,
      approvalPct,
    };
  });

  if (params.sort === 'approval') {
    mapped.sort((a, b) => b.approvalPct - a.approvalPct);
  } else if (params.sort === 'votes') {
    mapped.sort((a, b) => (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes));
  }

  return {
    prompts: mapped,
    page,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    totalCount,
    userVotes,
  };
}
