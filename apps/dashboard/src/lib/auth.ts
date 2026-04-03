import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@photobot/db";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      // "guilds" scope is required so we can call Discord's /users/@me/guilds
      // API to check which servers the user is an admin of.
      authorization: { params: { scope: "identify guilds" } },
    }),
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma as any),
  callbacks: {
    // Attach the Discord access token to the session so server actions can
    // call the Discord API on behalf of the user (see lib/discord.ts).
    async session({ session, user }: any) {
      const account = await prisma.account.findFirst({
        where: { userId: user.id, provider: "discord" },
      });
      session.accessToken = account?.access_token;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
