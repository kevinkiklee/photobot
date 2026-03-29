export interface DiscordGuild {
  id: string;
  name: string;
  permissions: string;
  icon?: string;
}

const ADMINISTRATOR_PERMISSION = 0x8;

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
