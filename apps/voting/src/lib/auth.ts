import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@photobot/db";

if (!process.env.VOTING_NEXTAUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  throw new Error('Missing VOTING_NEXTAUTH_SECRET or NEXTAUTH_SECRET environment variable');
}

const ADMIN_USER_IDS = new Set(
  (process.env.VOTING_ADMIN_USER_IDS || '').split(',').map(s => s.trim()).filter(Boolean)
);

const ADMIN_ROLE_IDS = new Set(
  (process.env.VOTING_ADMIN_ROLE_IDS || '').split(',').map(s => s.trim()).filter(Boolean)
);

const GUILD_ID = process.env.PL_GUILD_ID || '';

// In-memory cache for Discord admin role checks (5-minute TTL)
const ADMIN_ROLE_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const adminRoleCache = new Map<string, { result: boolean; cachedAt: number }>();

async function hasAdminRole(discordUserId: string): Promise<boolean> {
  if (ADMIN_ROLE_IDS.size === 0 || !GUILD_ID) return false;
  const botToken = process.env.DISCORD_TOKEN;
  if (!botToken) return false;

  // Check cache first
  const cached = adminRoleCache.get(discordUserId);
  if (cached && Date.now() - cached.cachedAt < ADMIN_ROLE_CACHE_TTL) {
    return cached.result;
  }

  try {
    const res = await fetch(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${discordUserId}`,
      { headers: { Authorization: `Bot ${botToken}` } }
    );
    if (!res.ok) {
      // On API error, return stale cache if available
      if (cached) return cached.result;
      return false;
    }
    const member = await res.json();
    const result = (member.roles || []).some((r: string) => ADMIN_ROLE_IDS.has(r));
    adminRoleCache.set(discordUserId, { result, cachedAt: Date.now() });
    return result;
  } catch {
    // On network error, return stale cache if available
    if (cached) return cached.result;
    return false;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      authorization: { params: { scope: "identify email" } },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      const account = await prisma.account.findFirst({
        where: { userId: user.id, provider: "discord" },
      });

      if (account) {
        session.discordUserId = account.providerAccountId;
        session.discordUsername = user.name || 'Unknown';

        // Admin if explicitly listed by user ID, or has an admin role in Discord
        const isAdminById = ADMIN_USER_IDS.has(account.providerAccountId);
        const isAdminByRole = await hasAdminRole(account.providerAccountId);
        session.isAdmin = isAdminById || isAdminByRole;
      }

      return session;
    },
  },
  session: {
    strategy: 'database',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60,  // refresh daily
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.VOTING_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET,
};
