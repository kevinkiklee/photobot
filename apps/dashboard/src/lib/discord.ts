export interface DiscordGuild {
  id: string;
  name: string;
  permissions: string;
  icon?: string | null;
  owner?: boolean;
}

// Discord permission bit for Administrator (0x8). Used to filter the user's
// guild list down to servers they actually control.
const ADMINISTRATOR_PERMISSION = 0x8;

export class DiscordTokenExpiredError extends Error {
  constructor() {
    super('Discord access token expired');
  }
}

// Fetches the user's guilds from the Discord API and returns only those where
// the user has Administrator permission.
export async function getAdminGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const response = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 401) {
    throw new DiscordTokenExpiredError();
  }

  if (!response.ok) return [];

  const guilds: DiscordGuild[] = await response.json();
  return guilds.filter(
    (guild) => (BigInt(guild.permissions) & BigInt(ADMINISTRATOR_PERMISSION)) === BigInt(ADMINISTRATOR_PERMISSION),
  );
}

/**
 * Checks if the user is an administrator of Photography Lounge.
 */
export async function isPlAdmin(accessToken: string): Promise<boolean> {
  const guilds = await getAdminGuilds(accessToken);
  return guilds.some((g) => g.id === process.env.PL_GUILD_ID);
}
