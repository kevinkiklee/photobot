import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@photobot/db";

const ADMIN_ROLE_IDS = (process.env.VOTING_ADMIN_ROLE_IDS || '').split(',').filter(Boolean);
const GUILD_ID = process.env.VOTING_GUILD_ID || '';

async function fetchUserRoles(discordUserId: string): Promise<string[]> {
  const botToken = process.env.DISCORD_TOKEN;
  if (!botToken || !GUILD_ID) return [];

  try {
    const res = await fetch(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${discordUserId}`,
      { headers: { Authorization: `Bot ${botToken}` } }
    );
    if (!res.ok) return [];
    const member = await res.json();
    return member.roles || [];
  } catch {
    return [];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      authorization: { params: { scope: "identify" } },
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

        const roles = await fetchUserRoles(account.providerAccountId);
        session.isAdmin = roles.some(r => ADMIN_ROLE_IDS.includes(r));
      }

      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.VOTING_NEXTAUTH_SECRET,
};
