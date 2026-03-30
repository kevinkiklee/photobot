import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getAdminGuilds } from '@/lib/discord';
import Link from 'next/link';
import { LucideInfo, LucideChevronLeft, LucideChevronRight } from 'lucide-react';

export default async function AuditPage({
  searchParams,
}: {
  searchParams: { serverId?: string; page?: string };
}) {
  const session = await getServerSession(authOptions);
  const serverId = searchParams.serverId;

  if (!serverId) {
    return (
      <div className="p-6 sm:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-display text-primary">Audit Log</h1>
          <p className="text-sm text-muted mt-1">Track all configuration changes</p>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl border border-brand-highlight/20 bg-brand-highlight/5 backdrop-blur-sm">
          <LucideInfo className="w-4 h-4 text-brand-highlight mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <p className="text-sm text-primary">Select a server from the header to view its audit logs.</p>
        </div>
      </div>
    );
  }

  const adminGuilds = await getAdminGuilds(session?.accessToken as string);
  if (!adminGuilds.some(g => g.id === serverId)) {
    return <div className="p-8 text-red-400">Access Denied.</div>;
  }

  const page = parseInt(searchParams.page || '1', 10);
  const pageSize = 20;

  const [logs, totalCount] = await Promise.all([
    prisma.configAuditLog.findMany({
      where: { serverId },
      orderBy: { createdAt: 'desc' },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.configAuditLog.count({ where: { serverId } }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-display text-primary">Audit Log</h1>
          <p className="text-sm text-muted mt-1">
            {totalCount} {totalCount === 1 ? 'entry' : 'entries'} recorded
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-subtle bg-card/50 backdrop-blur-sm overflow-hidden animate-fade-up">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-subtle">
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Timestamp</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">User</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Action</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Feature</th>
              <th className="px-5 py-3 text-left text-[10px] font-semibold text-muted uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={log.id} className="border-b border-subtle last:border-0 hover:bg-brand-primary/[0.02] transition-colors">
                <td className="px-5 py-3.5 whitespace-nowrap text-xs font-mono text-muted">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-sm text-primary font-medium">
                  {log.userId}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    log.action === 'UPDATE'
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : 'bg-brand-secondary/10 text-secondary'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-sm text-secondary capitalize">
                  {log.featureKey}
                </td>
                <td className="px-5 py-3.5 text-xs text-muted">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-muted">{log.targetType} / {log.targetId}</span>
                    <span className="font-mono">
                      {JSON.stringify(log.oldValue)} <span className="text-brand-primary mx-1">&rarr;</span> {JSON.stringify(log.newValue)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-muted">
                  <p className="font-display text-lg text-secondary mb-1">No Entries</p>
                  <p className="text-xs">Configuration changes will appear here.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          {page > 1 && (
            <Link
              href={`/audit?serverId=${serverId}&page=${page - 1}`}
              className="flex items-center gap-1 px-3 py-1.5 text-xs border border-subtle rounded-lg text-secondary hover:text-primary hover:border-brand-primary/30 transition-all"
            >
              <LucideChevronLeft className="w-3 h-3" />
              Previous
            </Link>
          )}
          <span className="px-3 py-1.5 text-xs text-muted font-mono">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/audit?serverId=${serverId}&page=${page + 1}`}
              className="flex items-center gap-1 px-3 py-1.5 text-xs border border-subtle rounded-lg text-secondary hover:text-primary hover:border-brand-primary/30 transition-all"
            >
              Next
              <LucideChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
