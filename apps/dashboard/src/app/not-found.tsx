import Link from 'next/link';
import { LucideCamera, LucideHelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen mesh-dark dark:mesh-dark mesh-light flex items-center justify-center p-6">
      <div className="flex flex-col items-center text-center max-w-md animate-fade-up">
        <div className="relative mb-6">
          <div className="p-5 rounded-2xl bg-brand-accent/10 border border-brand-accent/20">
            <LucideCamera className="w-10 h-10 text-brand-accent" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-full bg-card border border-brand-accent/30">
            <LucideHelpCircle className="w-4 h-4 text-brand-accent" strokeWidth={2} />
          </div>
        </div>
        <h1 className="font-display text-3xl text-primary mb-3">404 — Lost in the darkroom</h1>
        <p className="text-secondary text-sm leading-relaxed mb-8">
          This page doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl text-sm font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20 transition-colors"
        >
          Back to safety
        </Link>
      </div>
    </main>
  );
}
