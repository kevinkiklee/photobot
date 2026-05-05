// Whether the given guild ID is one the bot is configured to serve. The PL
// guild is required; the dev guild is optional and added so local dev can
// exercise mirror/scheduler/permissions paths without swapping PL_GUILD_ID.
// Read env on every call so tests can stub via vi.stubEnv at runtime.
export function isAllowedGuild(guildId: string | null | undefined): boolean {
  if (!guildId) return false;
  const plGuildId = process.env.PL_GUILD_ID;
  const devGuildId = process.env.DEV_GUILD_ID;
  return guildId === plGuildId || (!!devGuildId && guildId === devGuildId);
}
