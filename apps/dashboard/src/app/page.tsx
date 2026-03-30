import { Suspense } from 'react';
import { LucideCamera, LucideSparkles, LucidePalette, LucideShield } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import { ServerSelector } from "../components/ServerSelector";
import { LoginButton } from "../components/LoginButton";
import { Skeleton } from "../components/Skeleton";

function ServerCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full stagger">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-fade-up p-5 rounded-2xl border border-subtle bg-card/50">
          <div className="flex items-center gap-4 mb-5">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-8 rounded-lg" />
            <Skeleton className="h-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="relative min-h-screen mesh-dark dark:mesh-dark mesh-light overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-primary/10 blur-[120px] animate-glow-pulse" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-brand-accent/8 blur-[100px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-secondary/5 blur-[160px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 pt-16 sm:pt-20 pb-16">
        {/* Hero */}
        <div className="flex flex-col items-center gap-6 sm:gap-8 text-center max-w-3xl stagger">
          {/* Logo mark */}
          <div className="animate-fade-up relative">
            <div className="absolute inset-0 rounded-2xl bg-brand-primary/20 blur-xl scale-150 animate-glow-pulse" />
            <div className="relative p-4 rounded-2xl border border-brand-primary/30 bg-brand-primary/10 backdrop-blur-sm">
              <LucideCamera className="w-10 h-10 text-brand-primary" strokeWidth={1.5} />
            </div>
          </div>

          {/* Title */}
          <div className="animate-fade-up space-y-4" style={{ animationDelay: '80ms' }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display tracking-tight text-primary leading-[1.1]">
              Photobot
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-secondary font-light leading-relaxed max-w-xl mx-auto">
              AI-driven mentorship, palette extraction, and automated critiques for photography communities.
            </p>
          </div>

          {/* Feature pills */}
          <div className="animate-fade-up flex flex-wrap justify-center gap-2 sm:gap-3" style={{ animationDelay: '160ms' }}>
            {[
              { icon: LucideSparkles, label: "AI Critique" },
              { icon: LucidePalette, label: "Palette Extraction" },
              { icon: LucideShield, label: "Content Moderation" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-medium tracking-wide uppercase border border-subtle text-secondary bg-card/50 backdrop-blur-sm"
              >
                <Icon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-brand-primary" strokeWidth={1.5} />
                {label}
              </span>
            ))}
          </div>

          {/* CTA */}
          {!session && (
            <div className="animate-fade-up mt-4" style={{ animationDelay: '240ms' }}>
              <LoginButton />
            </div>
          )}
        </div>

        {/* Server grid */}
        {session && (
          <div className="w-full max-w-5xl mt-16 sm:mt-20 animate-fade-up" style={{ animationDelay: '160ms' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10 gap-4">
              <div>
                <h2 className="text-2xl font-display text-primary">Your Servers</h2>
                <p className="text-sm text-muted mt-1">Select a server to manage</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted uppercase tracking-wider font-medium">Signed in as</p>
                  <p className="text-sm font-medium text-primary">{session.user?.name || session.user?.email}</p>
                </div>
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt=""
                    className="w-10 h-10 rounded-xl border border-subtle shadow-sm"
                  />
                )}
              </div>
            </div>
            <Suspense fallback={<ServerCardsSkeleton />}>
              <ServerSelector />
            </Suspense>
          </div>
        )}
      </div>
    </main>
  );
}
