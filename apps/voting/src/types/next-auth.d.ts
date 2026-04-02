import "next-auth";

declare module "next-auth" {
  interface Session {
    discordUserId?: string;
    discordUsername?: string;
    isAdmin?: boolean;
  }
}
