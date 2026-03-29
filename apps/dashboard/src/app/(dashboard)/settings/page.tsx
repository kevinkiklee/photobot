import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getAdminGuilds } from '@/lib/discord';
import { FeatureToggle } from '@/components/feature-toggle';

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { serverId?: string };
}) {
  const session = await getServerSession(authOptions);
  const serverId = searchParams.serverId;

  if (serverId) {
    const adminGuilds = await getAdminGuilds(session?.accessToken as string);
    if (!adminGuilds.some(g => g.id === serverId)) {
      return <div className="p-8 text-red-500">Access Denied: You are not an admin of this server.</div>;
    }
  }

  const features = serverId ? await prisma.featureConfig.findMany({
    where: { serverId, targetType: 'SERVER' },
    orderBy: { featureKey: 'asc' },
  }) : [];

  const availableFeatures = ['critique', 'palette', 'settings'];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {!serverId ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-yellow-700">Please select a server to manage its settings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableFeatures.map((key) => {
            const config = features.find(f => f.featureKey === key);
            return (
              <div key={key} className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold capitalize">{key}</h3>
                  <FeatureToggle
                    serverId={serverId}
                    featureKey={key}
                    initialEnabled={config?.isEnabled ?? true}
                  />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Status: {config?.isEnabled !== false ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
