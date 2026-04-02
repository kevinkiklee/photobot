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

// Fetches the user's guilds from the Discord API and returns only those where
// the user has Administrator permission. This is the authorization gate for
// the entire dashboard — if you're not an admin of a server, you can't manage it.
export class DiscordTokenExpiredError extends Error {
  constructor() {
    super('Discord access token expired');
  }
}

export async function getAdminGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const response = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 401) {
    throw new DiscordTokenExpiredError();
  }

  if (!response.ok) return [];

  const guilds: DiscordGuild[] = await response.json();
  return guilds.filter(guild =>
    (BigInt(guild.permissions) & BigInt(ADMINISTRATOR_PERMISSION)) === BigInt(ADMINISTRATOR_PERMISSION)
  );
}

/**
 * Returns only the admin guilds where the bot is also installed.
 * Used by the server selector on the home page.
 */
export async function getBotAdminGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const adminGuilds = await getAdminGuilds(accessToken);
  const botGuildIds = await getBotGuildIds();
  if (botGuildIds.size === 0) return adminGuilds;
  return adminGuilds.filter(guild => botGuildIds.has(guild.id));
}

// Cache bot guild IDs for 5 minutes to avoid hitting Discord rate limits.
let botGuildCache: { ids: Set<string>; expiresAt: number } | null = null;

async function getBotGuildIds(): Promise<Set<string>> {
  const now = Date.now();
  if (botGuildCache && now < botGuildCache.expiresAt) {
    return botGuildCache.ids;
  }

  const botToken = process.env.DISCORD_TOKEN;
  if (!botToken) return new Set();

  try {
    const ids = new Set<string>();
    let after: string | undefined;

    // Paginate through all bot guilds (Discord returns max 200 per request)
    while (true) {
      const url = new URL('https://discord.com/api/users/@me/guilds');
      url.searchParams.set('limit', '200');
      if (after) url.searchParams.set('after', after);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bot ${botToken}` },
      });

      if (!response.ok) break;

      const guilds: Array<{ id: string }> = await response.json();
      if (guilds.length === 0) break;

      for (const g of guilds) ids.add(g.id);
      if (guilds.length < 200) break;
      after = guilds[guilds.length - 1].id;
    }

    botGuildCache = { ids, expiresAt: now + 5 * 60 * 1000 };
    return ids;
  } catch {
    return new Set();
  }
}
