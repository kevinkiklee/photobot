import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import { LoginButton } from "../components/LoginButton";
import { LucideCamera } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/settings");
  }

  return (
    <main className="relative min-h-screen mesh-dark dark:mesh-dark mesh-light overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-primary/5 blur-[120px] animate-glow-pulse" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-brand-accent/[0.03] blur-[100px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 pt-16 sm:pt-20 pb-16">
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
              Admin dashboard for Photography Lounge.
            </p>
          </div>

          {/* CTA */}
          <div className="animate-fade-up mt-4" style={{ animationDelay: '160ms' }}>
            <LoginButton />
          </div>
        </div>
      </div>
    </main>
  );
}
