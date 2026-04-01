export interface DiscordGuild {
  id: string;
  name: string;
  permissions: string;
  icon?: string;
}

// Discord permission bit for Administrator (0x8). Used to filter the user's
// guild list down to servers they actually control.
const ADMINISTRATOR_PERMISSION = 0x8;

// Fetches the user's guilds from the Discord API and returns only those where
// the user has Administrator permission. This is the authorization gate for
// the entire dashboard — if you're not an admin of a server, you can't manage it.
export async function getAdminGuilds(accessToken: string): Promise<DiscordGuild[]> {
  try {
    const response = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) return [];

    const guilds: DiscordGuild[] = await response.json();
    return guilds.filter(guild =>
      (BigInt(guild.permissions) & BigInt(ADMINISTRATOR_PERMISSION)) === BigInt(ADMINISTRATOR_PERMISSION)
    );
  } catch {
    return [];
  }
}
