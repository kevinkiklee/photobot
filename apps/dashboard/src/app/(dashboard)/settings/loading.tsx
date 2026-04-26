import { Skeleton } from '@/components/Skeleton';

export default function SettingsLoading() {
  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list never reorders
          <div key={i} className="animate-fade-up p-5 rounded-xl border border-subtle bg-card/50">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-20 mb-1.5" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <Skeleton className="w-11 h-6 rounded-full" />
            </div>
            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
