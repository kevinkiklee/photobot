import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@photobot/db";

const ADMIN_USER_IDS = new Set(
  (process.env.VOTING_ADMIN_USER_IDS || '').split(',').map(s => s.trim()).filter(Boolean)
);

const ADMIN_ROLE_IDS = new Set(
  (process.env.VOTING_ADMIN_ROLE_IDS || '').split(',').map(s => s.trim()).filter(Boolean)
);

const GUILD_ID = process.env.VOTING_GUILD_ID || '';

async function hasAdminRole(discordUserId: string): Promise<boolean> {
  if (ADMIN_ROLE_IDS.size === 0 || !GUILD_ID) return false;
  const botToken = process.env.DISCORD_TOKEN;
  if (!botToken) return false;

  try {
    const res = await fetch(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${discordUserId}`,
      { headers: { Authorization: `Bot ${botToken}` } }
    );
    if (!res.ok) return false;
    const member = await res.json();
    return (member.roles || []).some((r: string) => ADMIN_ROLE_IDS.has(r));
  } catch {
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
