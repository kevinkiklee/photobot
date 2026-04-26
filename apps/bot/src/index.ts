import { resolve } from 'node:path';
import { config } from 'dotenv';

// Load .env from monorepo root
config({ path: resolve(__dirname, '../../../.env') });

import { prisma } from '@photobot/db';
import {
  type ChatInputCommandInteraction,
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
} from 'discord.js';
import * as discussCommand from './commands/discuss';
import { onLoungeMessageCreate, onLoungeMessageDelete, onLoungeMessageUpdate } from './services/lounge-mirror';
import { startScheduler, stopScheduler } from './services/scheduler';

// Extend Client type to include commands
interface BotCommand {
  data: { name: string; toJSON: () => unknown };
  execute: (interaction: ChatInputCommandInteraction) => Promise<unknown>;
}

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, BotCommand>;
  }
}

// Intents:
//   Guilds          — slash commands and channel resolution.
//   GuildMessages   — fire messageCreate/Update/Delete events for the lounge mirror.
//   MessageContent  — privileged; required to read msg.content for mirroring.
// Partials let edit/delete events fire for messages the bot didn't cache (e.g.,
// edits to old messages after restart).
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel],
});

client.commands = new Collection();
client.commands.set(discussCommand.data.name, discussCommand);

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const plGuildId = process.env.PL_GUILD_ID;
const devGuildId = process.env.DEV_GUILD_ID;

if (!token || !clientId || !plGuildId) {
  process.exit(1);
}

function isAllowedGuild(guildId: string | null): boolean {
  return guildId === plGuildId || (!!devGuildId && guildId === devGuildId);
}

// Register slash commands per-guild on startup. Guild-specific registration
// propagates instantly (vs. up to 1 hour for global commands), which matters
// because we iterate on the slash-command schema during development. The bot
// only serves PL_GUILD_ID and the optional DEV_GUILD_ID, so global registration
// has no benefit. Also clears any stale global commands (one-time idempotent).
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  const body = [discussCommand.data.toJSON()];
  const targetGuilds = [plGuildId, devGuildId].filter((id): id is string => !!id);

  // Register per-guild independently — a dev bot may not be in PL_GUILD_ID
  // (and vice versa). Failing one guild must not block the others.
  for (const guildId of targetGuilds) {
    try {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body });
    } catch (_error) {}
  }

  try {
    // Clear any stale global commands left over from earlier global-registration
    // builds. A no-op once cleared; safe to run on every boot.
    await rest.put(Routes.applicationCommands(clientId), { body: [] });
  } catch (_error) {}
})();

// Event Handlers
client.once(Events.ClientReady, async (readyClient) => {
  await startScheduler(readyClient);
});

// Auto-leave any server that isn't Photography Lounge
client.on(Events.GuildCreate, async (guild) => {
  if (!isAllowedGuild(guild.id)) {
    await guild.leave();
  }
});

// Mirror handlers — wrapped so an exception in mirror logic can never crash
// the bot. Each handler is filtered against PL_GUILD_ID + the configured
// lounge channel inside the service module.
client.on(Events.MessageCreate, (msg) => {
  onLoungeMessageCreate(msg).catch((_err) => {});
});

client.on(Events.MessageUpdate, (_oldMsg, newMsg) => {
  onLoungeMessageUpdate(newMsg).catch((_err) => {});
});

client.on(Events.MessageDelete, (msg) => {
  onLoungeMessageDelete(msg).catch((_err) => {});
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (!isAllowedGuild(interaction.guildId)) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    return;
  }

  try {
    await command.execute(interaction);
  } catch (_error) {
    // Sending the error reply can itself fail (e.g., interaction expired,
    // already acknowledged). Don't let that crash the bot.
    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    } catch (_replyErr) {}
  }
});

// Graceful shutdown — clean up resources before exiting
const shutdown = async (_signal: string) => {
  stopScheduler();
  client.destroy();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

client.login(token);
