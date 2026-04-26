import { Skeleton } from '@/components/Skeleton';

export default function AuditLoading() {
  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="rounded-xl border border-subtle bg-card/50 overflow-hidden">
        <div className="border-b border-subtle px-5 py-3 flex gap-8">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-32" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list never reorders
          <div key={i} className="border-b border-subtle last:border-0 px-5 py-3.5 flex gap-8">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
