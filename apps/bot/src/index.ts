import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from monorepo root
config({ path: resolve(__dirname, '../../../.env') });
import { Client, Events, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import * as settingsCommand from './commands/settings';
import * as critiqueCommand from './commands/critique';
import * as paletteCommand from './commands/palette';
import * as discussCommand from './commands/discuss';
import * as aiAccessCommand from './commands/ai-access';
import { startScheduler } from './services/scheduler';

// Extend Client type to include commands
declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, any>;
  }
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
client.commands.set(settingsCommand.data.name, settingsCommand);
client.commands.set(critiqueCommand.data.name, critiqueCommand);
client.commands.set(paletteCommand.data.name, paletteCommand);
client.commands.set(discussCommand.data.name, discussCommand);
client.commands.set(aiAccessCommand.data.name, aiAccessCommand);

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token || !clientId) {
  console.error('Missing DISCORD_TOKEN or DISCORD_CLIENT_ID in environment variables.');
  process.exit(1);
}

// Command Registration
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: [
        settingsCommand.data.toJSON(),
        critiqueCommand.data.toJSON(),
        paletteCommand.data.toJSON(),
        discussCommand.data.toJSON(),
        aiAccessCommand.data.toJSON(),
      ] },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

// Event Handlers
client.once(Events.ClientReady, async readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  await startScheduler(readyClient);
  console.log('Discussion scheduler started.');
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

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

client.login(token);
