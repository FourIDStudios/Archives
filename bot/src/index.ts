import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { archiveCommand } from './commands/archive';
import { handleInteraction } from './handlers/interactionHandler';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', async () => {
  console.log(`🤖 Bot logged in as ${client.user?.tag}!`);
  
  // Register slash commands
  await registerCommands();
});

client.on('interactionCreate', handleInteraction);

async function registerCommands() {
  const commands = [archiveCommand.toJSON()];
  
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
  
  try {
    console.log('🔄 Refreshing application (/) commands...');
    
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
      { body: commands }
    );
    
    console.log('✅ Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('❌ Error refreshing commands:', error);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('🛑 Shutting down bot...');
  client.destroy();
  process.exit(0);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN).catch(console.error);