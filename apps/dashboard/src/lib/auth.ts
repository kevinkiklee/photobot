import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@photobot/db";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      authorization: { params: { scope: "identify guilds" } },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
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
