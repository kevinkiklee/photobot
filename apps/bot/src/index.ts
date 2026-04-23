import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from monorepo root
config({ path: resolve(__dirname, '../../../.env') });

import { prisma } from '@photobot/db';
import { ChatInputCommandInteraction, Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import * as discussCommand from './commands/discuss';
import * as settingsCommand from './commands/settings';
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

// Only the Guilds intent is needed — the bot uses slash commands (not message
// content) and fetches channel messages on-demand for conversation-pause detection.
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
client.commands.set(settingsCommand.data.name, settingsCommand);
client.commands.set(discussCommand.data.name, discussCommand);

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const plGuildId = process.env.PL_GUILD_ID;
const devGuildId = process.env.DEV_GUILD_ID;

if (!token || !clientId || !plGuildId) {
  console.error('Missing DISCORD_TOKEN, DISCORD_CLIENT_ID, or PL_GUILD_ID in environment variables.');
  process.exit(1);
}

function isAllowedGuild(guildId: string | null): boolean {
  return guildId === plGuildId || (!!devGuildId && guildId === devGuildId);
}

// Register slash commands globally on startup. This uses the REST API
// directly rather than guild-specific registration so commands are
// available in all servers the bot joins without re-deploying.
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(clientId), {
      body: [settingsCommand.data.toJSON(), discussCommand.data.toJSON()],
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

// Event Handlers
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  await startScheduler(readyClient);
  console.log('Discussion scheduler started.');
});

// Auto-leave any server that isn't Photography Lounge
client.on(Events.GuildCreate, async (guild) => {
  if (!isAllowedGuild(guild.id)) {
    console.log(`Leaving non-PL server: ${guild.name} (${guild.id})`);
    await guild.leave();
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (!isAllowedGuild(interaction.guildId)) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

// Graceful shutdown — clean up resources before exiting
const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  stopScheduler();
  client.destroy();
  await prisma.$disconnect();
  console.log('Shutdown complete.');
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

client.login(token);
