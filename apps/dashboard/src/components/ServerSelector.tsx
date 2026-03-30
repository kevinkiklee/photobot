import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import Link from "next/link";
import { LucideSettings, LucideScrollText } from "lucide-react";

export async function ServerSelector() {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).accessToken) {
    return (
      <div className="text-secondary p-12 border border-dashed border-subtle rounded-2xl text-center">
        <p className="font-display text-lg text-primary mb-2">No Access</p>
        <p className="text-sm text-muted">Please log in with Discord to view and manage your servers.</p>
      </div>
    );
  }

  try {
    const response = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return (
          <div className="text-red-400 p-12 border border-red-500/20 bg-red-500/5 rounded-2xl text-center backdrop-blur-sm">
            <p className="font-display text-lg mb-2">Session Expired</p>
            <p className="text-sm opacity-80">Please log out and log in again.</p>
          </div>
        );
      }
      return (
        <div className="text-red-400 p-12 border border-red-500/20 bg-red-500/5 rounded-2xl text-center backdrop-blur-sm">
          <p className="font-display text-lg mb-2">Connection Error</p>
          <p className="text-sm opacity-80">Failed to fetch servers from Discord ({response.status}).</p>
        </div>
      );
    }

    const guilds: Array<{
      id: string;
      name: string;
      icon: string | null;
      permissions: string;
      owner: boolean;
    }> = await response.json();

    const MANAGE_GUILD = BigInt(0x20);
    const ADMINISTRATOR = BigInt(0x8);

    const manageableGuilds = guilds.filter((guild) => {
      const permissions = BigInt(guild.permissions);
      return (
        guild.owner ||
        (permissions & MANAGE_GUILD) === MANAGE_GUILD ||
        (permissions & ADMINISTRATOR) === ADMINISTRATOR
      );
    });

    if (manageableGuilds.length === 0) {
      return (
        <div className="text-secondary p-12 border border-dashed border-subtle rounded-2xl text-center">
          <p className="font-display text-lg text-primary mb-2">No Servers Found</p>
          <p className="text-sm text-muted">You don&apos;t have administrative permissions on any Discord servers where Photobot is active.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full stagger">
        {manageableGuilds.map((guild) => (
          <div
            key={guild.id}
            className="animate-fade-up group relative flex flex-col p-5 rounded-2xl border border-subtle bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-brand-primary/30 hover:bg-card/70"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 rounded-2xl bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative flex items-center gap-4 mb-5">
              {guild.icon ? (
                <img
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                  alt={guild.name}
                  className="w-12 h-12 rounded-xl flex-shrink-0 ring-1 ring-white/10 group-hover:ring-brand-primary/20 transition-all"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 flex items-center justify-center font-display text-xl text-primary flex-shrink-0 ring-1 ring-white/10">
                  {guild.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-medium text-primary truncate" title={guild.name}>
                  {guild.name}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  {guild.owner ? "Owner" : "Administrator"}
                </p>
              </div>
            </div>

            <div className="relative grid grid-cols-2 gap-2 mt-auto">
              <Link
                href={`/settings?serverId=${guild.id}`}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border border-subtle text-secondary hover:text-primary hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all"
              >
                <LucideSettings className="w-3 h-3" strokeWidth={1.5} />
                Settings
              </Link>
              <Link
                href={`/audit?serverId=${guild.id}`}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border border-subtle text-secondary hover:text-primary hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all"
              >
                <LucideScrollText className="w-3 h-3" strokeWidth={1.5} />
                Audit Log
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching guilds:", error);
    return (
      <div className="text-red-400 p-12 border border-red-500/20 bg-red-500/5 rounded-2xl text-center backdrop-blur-sm">
        <p className="font-display text-lg mb-2">Something Went Wrong</p>
        <p className="text-sm opacity-80">An error occurred while fetching your servers.</p>
      </div>
    );
  }
}
