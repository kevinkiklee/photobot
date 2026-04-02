import { Suspense } from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { fetchPrompts } from '@/lib/prompts';
import { Header } from '@/components/Header';
import { PromptList } from '@/components/PromptList';
import { TagFilter } from '@/components/TagFilter';
import { SearchInput } from '@/components/SearchInput';
import { SortSelect } from '@/components/SortSelect';
import { Pagination } from '@/components/Pagination';
import { AnonymityBanner } from '@/components/AnonymityBanner';
import { SubmitPromptProvider, SubmitButton, SubmitPanel } from '@/components/SubmitPromptWrapper';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string; sort?: string; tags?: string; q?: string };
}) {
  const session = await getServerSession(authOptions);

  const params = {
    page: parseInt(searchParams.page || '1', 10),
    sort: (searchParams.sort || 'default') as 'default' | 'approval' | 'votes' | 'alphabetical',
    tags: searchParams.tags?.split(',').filter(Boolean),
    q: searchParams.q,
  };

  const data = await fetchPrompts(params, session?.discordUserId || undefined, !!session?.isAdmin);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-5 space-y-4 page-enter">
        <AnonymityBanner />

        <SubmitPromptProvider isAuthenticated={!!session}>
          <Suspense>
            <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
              <div className="flex-1">
                <SearchInput />
              </div>
              <div className="flex items-center gap-2">
                <SortSelect />
                <SubmitButton />
              </div>
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
          key={`${searchParams.q ?? ''}-${searchParams.sort ?? ''}-${searchParams.tags ?? ''}-${searchParams.page ?? ''}`}
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
