import { prisma } from '@photobot/db';
import { LucideMessageSquare, LucideSettings } from 'lucide-react';
import { FeatureToggle } from '@/components/feature-toggle';

const featureMeta: Record<string, { icon: typeof LucideSettings; description: string }> = {
  settings: {
    icon: LucideSettings,
    description: 'Allow server members to configure bot preferences',
  },
  discuss: {
    icon: LucideMessageSquare,
    description: 'Curated discussion prompts for community engagement',
  },
};

export default async function SettingsPage() {
  const features = await prisma.featureConfig.findMany({
    where: { targetType: 'SERVER' },
    orderBy: { featureKey: 'asc' },
  });

  const availableFeatures = ['settings', 'discuss'];

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display text-primary">Settings</h1>
        <p className="text-sm text-muted mt-1">Manage feature availability for Photography Lounge</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {availableFeatures.map((key) => {
          const config = features.find((f) => f.featureKey === key);
          const meta = featureMeta[key];
          const Icon = meta?.icon || LucideSettings;
          const isEnabled = config?.isEnabled !== false;

          return (
            <div
              key={key}
              className="animate-fade-up group p-4 sm:p-5 rounded-xl border border-subtle bg-card/50 backdrop-blur-sm transition-all hover:border-brand-primary/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg transition-colors ${isEnabled ? 'bg-brand-primary/10 text-brand-primary' : 'bg-[var(--border-subtle)] text-muted'}`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold capitalize text-primary">{key}</h3>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-medium ${isEnabled ? 'text-brand-primary' : 'text-muted'}`}
                    >
                      {isEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>
                <FeatureToggle featureKey={key} initialEnabled={config?.isEnabled ?? true} />
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                {meta?.description || `Configure the ${key} feature.`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
