import { LucideCamera } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-fade-in">
      <div className="p-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 animate-glow-pulse">
        <LucideCamera className="w-8 h-8 text-brand-primary" strokeWidth={1.5} />
      </div>
      <p className="text-sm text-secondary">Loading...</p>
    </div>
  );
}
