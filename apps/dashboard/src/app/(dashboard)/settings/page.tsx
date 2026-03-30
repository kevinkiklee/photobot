import { prisma } from '@photobot/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getAdminGuilds } from '@/lib/discord';
import { FeatureToggle } from '@/components/feature-toggle';
import { LucideSparkles, LucidePalette, LucideSettings, LucideInfo } from 'lucide-react';

const featureMeta: Record<string, { icon: typeof LucideSparkles; description: string }> = {
  critique: {
    icon: LucideSparkles,
    description: 'AI-powered technical feedback on uploaded photographs',
  },
  palette: {
    icon: LucidePalette,
    description: 'Extract dominant color palettes from uploaded images',
  },
  settings: {
    icon: LucideSettings,
    description: 'Allow server members to configure bot preferences',
  },
};

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
      return <div className="p-8 text-red-400">Access Denied: You are not an admin of this server.</div>;
    }
  }

  const features = serverId ? await prisma.featureConfig.findMany({
    where: { serverId, targetType: 'SERVER' },
    orderBy: { featureKey: 'asc' },
  }) : [];

  const availableFeatures = ['critique', 'palette', 'settings'];

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display text-primary">Settings</h1>
        <p className="text-sm text-muted mt-1">Manage feature availability for this server</p>
      </div>

      {!serverId ? (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-brand-highlight/20 bg-brand-highlight/5 backdrop-blur-sm">
          <LucideInfo className="w-4 h-4 text-brand-highlight mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <p className="text-sm text-primary">Select a server from the header to manage its settings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {availableFeatures.map((key) => {
            const config = features.find(f => f.featureKey === key);
            const meta = featureMeta[key];
            const Icon = meta?.icon || LucideSettings;
            const isEnabled = config?.isEnabled !== false;

            return (
              <div
                key={key}
                className="animate-fade-up group p-5 rounded-xl border border-subtle bg-card/50 backdrop-blur-sm transition-all hover:border-brand-primary/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${isEnabled ? 'bg-brand-primary/10 text-brand-primary' : 'bg-[var(--border-subtle)] text-muted'}`}>
                      <Icon className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold capitalize text-primary">{key}</h3>
                      <span className={`text-[10px] uppercase tracking-wider font-medium ${isEnabled ? 'text-brand-primary' : 'text-muted'}`}>
                        {isEnabled ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <FeatureToggle
                    serverId={serverId}
                    featureKey={key}
                    initialEnabled={config?.isEnabled ?? true}
                  />
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  {meta?.description || `Configure the ${key} feature for this server.`}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
