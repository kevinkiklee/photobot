import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getAdminGuilds } from '@/lib/discord';
import Link from 'next/link';

export default async function AuditPage({
  searchParams,
}: {
  searchParams: { serverId?: string; page?: string };
}) {
  const session = await getServerSession(authOptions);
  const serverId = searchParams.serverId;

  if (!serverId) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Audit Log</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Please select a server to view its audit logs.</p>
        </div>
      </div>
    );
  }

  const adminGuilds = await getAdminGuilds(session?.accessToken as string);
  if (!adminGuilds.some(g => g.id === serverId)) {
    return <div className="p-8 text-red-500">Access Denied.</div>;
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
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Audit Log</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {log.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs ${log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {log.featureKey}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400">Target: {log.targetType} ({log.targetId})</span>
                    <span className="text-xs">
                      {JSON.stringify(log.oldValue)} &rarr; {JSON.stringify(log.newValue)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/audit?serverId=${serverId}&page=${page - 1}`}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Previous
            </Link>
          )}
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/audit?serverId=${serverId}&page=${page + 1}`}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
