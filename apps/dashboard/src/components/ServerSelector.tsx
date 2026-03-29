import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";
import Link from "next/link";

export async function ServerSelector() {
  const session = await getServerSession(authOptions);
  if (!session || !(session as any).accessToken) {
    return (
      <div className="text-gray-500 p-8 border border-dashed rounded-xl text-center">
        Please log in with Discord to view and manage your servers.
      </div>
    );
  }

  try {
    const response = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 401) {
        return (
          <div className="text-red-500 p-8 border border-red-200 bg-red-50 rounded-xl text-center">
            Your Discord session has expired. Please log out and log in again.
          </div>
        );
      }
      return (
        <div className="text-red-500 p-8 border border-red-200 bg-red-50 rounded-xl text-center">
          Failed to fetch servers from Discord ({response.status}). Please try again later.
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

    // Check for MANAGE_GUILD (0x20) or ADMINISTRATOR (0x8) permission
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
        <div className="text-gray-500 p-8 border border-dashed rounded-xl text-center">
          You don't have administrative permissions on any Discord servers where Photobot is active.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
        {manageableGuilds.map((guild) => (
          <div
            key={guild.id}
            className="flex flex-col p-6 bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl hover:border-blue-200 transition-all group"
          >
            <div className="flex items-center gap-4 mb-6 overflow-hidden">
              {guild.icon ? (
                <img
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                  alt={guild.name}
                  className="w-14 h-14 rounded-2xl flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xl flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  {guild.name.charAt(0)}
                </div>
              )}
              <h3 className="font-bold text-lg text-gray-800 truncate" title={guild.name}>
                {guild.name}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <Link
                href={`/settings?serverId=${guild.id}`}
                className="flex items-center justify-center py-2 px-4 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Settings
              </Link>
              <Link
                href={`/audit?serverId=${guild.id}`}
                className="flex items-center justify-center py-2 px-4 bg-gray-50 text-gray-700 hover:bg-gray-800 hover:text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Audit Logs
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching guilds:", error);
    return (
      <div className="text-red-500 p-8 border border-red-200 bg-red-50 rounded-xl text-center">
        An error occurred while fetching your servers.
      </div>
    );
  }
}
