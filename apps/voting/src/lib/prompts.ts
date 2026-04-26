import { type Prisma, prisma } from '@photobot/db';

type PromptWithRelations = Prisma.PromptGetPayload<{
  include: {
    tags: { select: { tag: true } };
    votes: { select: { vote: true; discordUserId: true } };
    duplicateFlags: { select: { discordUserId: true } };
    tagSuggestions: { select: { tag: true; action: true; discordUserId: true } };
  };
}>;

const PAGE_SIZE = 20;

export type SortOption = 'default' | 'approval' | 'votes' | 'alphabetical';

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
  submittedBy: string | null;
  submittedByUsername: string | null;
  duplicateCount: number;
  userFlaggedDuplicate: boolean;
  tagVotes: Record<string, { addCount: number; removeCount: number; userAction: string | null }>;
  suggestedTags: string[]; // tags suggested by users that aren't yet on the prompt
}

export interface PromptPage {
  prompts: PromptWithVotes[];
  page: number;
  totalPages: number;
  totalCount: number;
}

function buildTagVotes(
  suggestions: Array<{ tag: string; action: string; discordUserId: string }>,
  discordUserId?: string,
): Record<string, { addCount: number; removeCount: number; userAction: string | null }> {
  const result: Record<string, { addCount: number; removeCount: number; userAction: string | null }> = {};
  for (const s of suggestions) {
    if (!result[s.tag]) result[s.tag] = { addCount: 0, removeCount: 0, userAction: null };
    if (s.action === 'ADD') result[s.tag].addCount++;
    else result[s.tag].removeCount++;
    if (discordUserId && s.discordUserId === discordUserId) result[s.tag].userAction = s.action;
  }
  return result;
}

function buildSuggestedTags(existingTags: string[], suggestions: Array<{ tag: string; action: string }>): string[] {
  const existing = new Set(existingTags);
  const suggested = new Set<string>();
  for (const s of suggestions) {
    if (s.action === 'ADD' && !existing.has(s.tag)) suggested.add(s.tag);
  }
  return Array.from(suggested);
}

export async function fetchPrompts(
  params: PromptQueryParams,
  discordUserId?: string,
  isAdmin?: boolean,
): Promise<PromptPage & { userVotes: Record<string, 'UP' | 'DOWN'> }> {
  const page = Math.max(1, params.page || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const where: Prisma.PromptWhereInput = {};

  if (params.tags && params.tags.length > 0) {
    where.tags = { some: { tag: { in: params.tags } } };
  }

  if (params.q && params.q.length <= 200) {
    where.text = { contains: params.q, mode: 'insensitive' };
  }

  let orderBy: Prisma.PromptOrderByWithRelationInput[] = [
    { submittedBy: { sort: 'desc', nulls: 'last' } },
    { createdAt: 'asc' },
  ];
  if (params.sort === 'alphabetical') {
    orderBy = [{ submittedBy: { sort: 'desc', nulls: 'last' } }, { text: 'asc' }];
  }

  const [prompts, totalCount] = await Promise.all([
    prisma.prompt.findMany({
      where,
      include: {
        tags: { select: { tag: true } },
        votes: { select: { vote: true, discordUserId: true } },
        duplicateFlags: { select: { discordUserId: true } },
        tagSuggestions: { select: { tag: true, action: true, discordUserId: true } },
      },
      take: PAGE_SIZE,
      skip,
      orderBy,
    }),
    prisma.prompt.count({ where }),
  ]);

  const userVotes: Record<string, 'UP' | 'DOWN'> = {};

  const mapped: PromptWithVotes[] = (prompts as PromptWithRelations[]).map((p) => {
    const upvotes = p.votes.filter((v) => v.vote === 'UP').length;
    const downvotes = p.votes.filter((v) => v.vote === 'DOWN').length;
    const total = upvotes + downvotes;
    const approvalPct = total > 0 ? Math.round((upvotes / total) * 100) : 0;

    if (discordUserId) {
      const userVote = p.votes.find((v) => v.discordUserId === discordUserId);
      if (userVote) userVotes[p.id] = userVote.vote;
    }

    return {
      id: p.id,
      text: p.text,
      originalCategory: p.originalCategory,
      tags: p.tags.map((t) => t.tag),
      upvotes,
      downvotes,
      approvalPct,
      submittedBy: isAdmin ? p.submittedBy || null : p.submittedBy ? 'community' : null,
      submittedByUsername: isAdmin ? p.submittedByUsername || null : null,
      duplicateCount: p.duplicateFlags.length,
      userFlaggedDuplicate: discordUserId ? p.duplicateFlags.some((f) => f.discordUserId === discordUserId) : false,
      tagVotes: buildTagVotes(p.tagSuggestions, discordUserId),
      suggestedTags: buildSuggestedTags(
        p.tags.map((t) => t.tag),
        p.tagSuggestions,
      ),
    };
  });

  if (params.sort === 'approval') {
    mapped.sort((a, b) => b.approvalPct - a.approvalPct);
  } else if (params.sort === 'votes') {
    mapped.sort((a, b) => b.upvotes + b.downvotes - (a.upvotes + a.downvotes));
  }

  return {
    prompts: mapped,
    page,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
    totalCount,
    userVotes,
  };
}
