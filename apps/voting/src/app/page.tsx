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
import { AdminStatsBar } from '@/components/AdminView';
import { getAdminStats } from '@/lib/admin';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string; sort?: string; tags?: string; q?: string };
}) {
  const session = await getServerSession(authOptions);

  const params = {
    page: parseInt(searchParams.page || '1', 10),
    sort: (searchParams.sort || 'approval') as 'approval' | 'votes' | 'alphabetical',
    tags: searchParams.tags?.split(',').filter(Boolean),
    q: searchParams.q,
  };

  const data = await fetchPrompts(params, session?.discordUserId || undefined);
  const adminStats = session?.isAdmin ? await getAdminStats() : null;

  return (
    <div className="min-h-screen mesh-dark dark:mesh-dark mesh-light">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
        <AnonymityBanner />
        {adminStats && <AdminStatsBar stats={adminStats} />}

        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <SearchInput />
          </div>
          <SortSelect />
        </div>

        <TagFilter />

        <div className="text-xs text-muted">
          {data.totalCount} prompt{data.totalCount !== 1 ? 's' : ''} found
        </div>

        <PromptList
          prompts={data.prompts}
          userVotes={data.userVotes}
          isAuthenticated={!!session}
          isAdmin={!!session?.isAdmin}
        />

        <Pagination page={data.page} totalPages={data.totalPages} />
      </main>
    </div>
  );
}
