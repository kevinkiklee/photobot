import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'];
    discordUserId?: string;
    discordUsername?: string;
    isAdmin?: boolean;
  }
}
