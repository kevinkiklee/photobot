import { Suspense } from 'react';
import { AnonymityBanner } from '@/components/AnonymityBanner';
import { Header } from '@/components/Header';
import { Pagination } from '@/components/Pagination';
import { PromptList } from '@/components/PromptList';
import { SearchInput } from '@/components/SearchInput';
import { SortSelect } from '@/components/SortSelect';
import { SubmitButton, SubmitPanel, SubmitPromptProvider } from '@/components/SubmitPromptWrapper';
import { TagFilter } from '@/components/TagFilter';
import { fetchPrompts } from '@/lib/prompts';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string; tags?: string; q?: string }>;
}) {
  const session = await getSession();
  const resolvedParams = await searchParams;

  const params = {
    page: parseInt(resolvedParams.page || '1', 10),
    sort: (resolvedParams.sort || 'default') as 'default' | 'approval' | 'votes' | 'alphabetical',
    tags: resolvedParams.tags?.split(',').filter(Boolean),
    q: resolvedParams.q,
  };

  const data = await fetchPrompts(params, session?.discordUserId || undefined, !!session?.isAdmin);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-5 space-y-4 page-enter">
        <AnonymityBanner />

        <SubmitPromptProvider isAuthenticated={!!session}>
          <Suspense>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <SearchInput />
              </div>
              <SortSelect />
              <SubmitButton />
            </div>
          </Suspense>

          <SubmitPanel />

          <Suspense>
            <TagFilter />
          </Suspense>
        </SubmitPromptProvider>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted">
            {data.totalCount} prompt{data.totalCount !== 1 ? 's' : ''}
          </span>
          <Suspense>
            <Pagination page={data.page} totalPages={data.totalPages} />
          </Suspense>
        </div>

        <PromptList
          key={`${resolvedParams.q ?? ''}-${resolvedParams.sort ?? ''}-${resolvedParams.tags ?? ''}-${resolvedParams.page ?? ''}`}
          prompts={data.prompts}
          userVotes={data.userVotes}
          isAuthenticated={!!session}
          isAdmin={!!session?.isAdmin}
          currentUserId={session?.discordUserId || null}
        />

        <div className="flex justify-end">
          <Suspense>
            <Pagination page={data.page} totalPages={data.totalPages} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
