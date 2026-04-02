import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminGuilds, DiscordTokenExpiredError } from "@/lib/discord";
import { ServerPopover } from "@/components/ServerPopover";
import { MobileNav } from "@/components/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { LucideCamera, LucideSettings, LucideScrollText } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    redirect("/");
  }

  let adminGuilds;
  try {
    adminGuilds = await getAdminGuilds(session.accessToken as string);
  } catch (e) {
    if (e instanceof DiscordTokenExpiredError) {
      redirect("/api/auth/signin");
    }
    throw e;
  }

  return (
    <div className="min-h-screen mesh-dark dark:mesh-dark mesh-light">
      <header className="glass border-b border-subtle sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/20 group-hover:bg-brand-primary/20 transition-colors">
                <LucideCamera className="w-4 h-4 text-brand-primary" strokeWidth={1.5} />
              </div>
              <span className="font-display text-lg text-primary">Photobot</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-secondary hover:text-primary hover:bg-brand-primary/5 transition-all"
              >
                <LucideSettings className="w-3.5 h-3.5" strokeWidth={1.5} />
                Settings
              </Link>
              <Link
                href="/audit"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-secondary hover:text-primary hover:bg-brand-primary/5 transition-all"
              >
                <LucideScrollText className="w-3.5 h-3.5" strokeWidth={1.5} />
                Audit Log
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="w-px h-5 bg-[var(--border-subtle)] hidden md:block" />
            <div className="hidden md:block">
              <ServerPopover guilds={adminGuilds} />
            </div>
          </div>
        </div>
      </header>
      <main className="animate-fade-in pb-20 md:pb-0">{children}</main>
      <MobileNav guilds={adminGuilds} />
    </div>
  );
}
