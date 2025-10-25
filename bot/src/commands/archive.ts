import { SlashCommandBuilder } from 'discord.js';

export const archiveCommand = new SlashCommandBuilder()
  .setName('archive')
  .setDescription('Archive a Discord message to the database')
  .addStringOption(option =>
    option
      .setName('message_url')
      .setDescription('The Discord message URL to archive (optional - defaults to last message)')
      .setRequired(false)
  );