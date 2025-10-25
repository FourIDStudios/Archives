import { Interaction, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { archiveMessage } from '../services/archiveService';
import { parseDiscordMessageUrl } from '@discord-archive/shared';

export async function handleInteraction(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'archive') {
    console.log('📥 Received archive command from', interaction.user.username);
    await handleArchiveCommand(interaction);
  }
}

async function handleArchiveCommand(interaction: ChatInputCommandInteraction) {
  try {
    // Check if interaction is still valid before deferring
    if (!interaction.isRepliable()) {
      console.error('Interaction is not repliable');
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    console.log('✅ Deferred reply successfully');

    // Check if user has permission to manage messages
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) {
      await interaction.editReply({
        content: '❌ You need the "Manage Messages" permission to use this command.'
      });
      return;
    }

    const messageUrl = interaction.options.getString('message_url');
    let targetChannelId = interaction.channelId;
    let targetMessageId: string;

    if (messageUrl) {
      // Parse message URL to get channel and message IDs
      const parsed = parseDiscordMessageUrl(messageUrl);
      if (!parsed) {
        await interaction.editReply({
          content: '❌ Invalid Discord message URL format.'
        });
        return;
      }
      targetChannelId = parsed.channelId;
      targetMessageId = parsed.messageId;
    } else {
      // Get the last message in the channel (excluding the command itself)
      const channel = await interaction.client.channels.fetch(targetChannelId!);
      if (!channel || !channel.isTextBased()) {
        await interaction.editReply({
          content: '❌ Could not access the channel.'
        });
        return;
      }

      const messages = await channel.messages.fetch({ limit: 2 });
      const lastMessage = messages.filter(msg => msg.id !== interaction.id).first();
      
      if (!lastMessage) {
        await interaction.editReply({
          content: '❌ No message found to archive.'
        });
        return;
      }
      
      targetMessageId = lastMessage.id;
    }

    // Get the channel and check if target message exists
    const channel = await interaction.client.channels.fetch(targetChannelId!);
    if (!channel || !channel.isTextBased() || !('send' in channel)) {
      await interaction.editReply({
        content: '❌ Could not access the channel to post notification.'
      });
      return;
    }

    // Try to fetch the target message to see if it still exists
    let targetMessage = null;
    try {
      targetMessage = await channel.messages.fetch(targetMessageId);
      console.log('✅ Target message found, will reply to it');
    } catch (error) {
      console.log('⚠️ Target message not found or not accessible, will post new message');
    }

    // Post the "caught in 4K" GIF first
    console.log('📷 Posting "caught in 4K" GIF...');
    let gifMessage;
    if (targetMessage) {
      // Reply to the target message with the GIF
      gifMessage = await targetMessage.reply({
        content: 'https://tenor.com/view/4k-caught-caught-in4k-caught-in8k-8k-gif-20014426'
      });
    } else {
      // Post as a new message in the channel
      gifMessage = await channel.send({
        content: 'https://tenor.com/view/4k-caught-caught-in4k-caught-in8k-8k-gif-20014426'
      });
    }

    // Archive the message
    console.log('📤 Archiving message:', targetMessageId, 'from channel:', targetChannelId);
    const result = await archiveMessage({
      guildId: interaction.guildId!,
      channelId: targetChannelId!,
      messageId: targetMessageId,
      archivedBy: interaction.user.id,
      client: interaction.client
    });
    
    console.log('📊 Archive result:', result.success ? 'SUCCESS' : 'FAILED', result.error || '');

    // Delete the GIF after 1 second and post the archive notification
    setTimeout(async () => {
      try {
        await gifMessage.delete();
        console.log('🗑️ Deleted "caught in 4K" GIF');
        
        if (result.success) {
          const archiveUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/messages/${result.data?.id}`;
          
          if (targetMessage) {
            // Reply to the original message with archive notification
            await targetMessage.reply({
              content: `📚 **Message added to The Archives!**\n🔗 [View in Archive](${archiveUrl})`
            });
          } else {
            // Post as new message if original message not found
            if ('send' in channel) {
              await channel.send({
                content: `📚 **Message added to The Archives!**\n🔗 [View in Archive](${archiveUrl})`
              });
            }
          }
        } else {
          if (targetMessage) {
            // Reply to the original message with error
            await targetMessage.reply({
              content: `❌ Failed to archive message: ${result.error}`
            });
          } else {
            // Post as new message if original message not found
            if ('send' in channel) {
              await channel.send({
                content: `❌ Failed to archive message: ${result.error}`
              });
            }
          }
        }
      } catch (error) {
        console.error('Error managing GIF and notification:', error);
      }
    }, 1000);

    // Respond to the interaction
    if (result.success) {
      
      await interaction.editReply({
        content: `✅ Message archived successfully! Check the channel for the notification.`
      });
    } else {
      await interaction.editReply({
        content: `❌ Failed to archive message: ${result.error}`
      });
    }
  } catch (error) {
    console.error('Error in archive command:', error);
    
    // Try to respond to the interaction if we haven't already
    try {
      if (interaction.deferred && !interaction.replied) {
        await interaction.editReply({
          content: '❌ An unexpected error occurred while archiving the message.'
        });
      } else if (!interaction.replied) {
        await interaction.reply({
          content: '❌ An unexpected error occurred while archiving the message.',
          ephemeral: true
        });
      }
    } catch (responseError) {
      console.error('Failed to respond to interaction:', responseError);
    }
  }
}