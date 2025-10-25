import axios from 'axios';
import { Client, Message } from 'discord.js';
import { ArchivedMessage, ApiResponse, generateMessageUrl } from '@discord-archive/shared';

interface ArchiveRequest {
  guildId: string;
  channelId: string;
  messageId: string;
  archivedBy: string;
  client: Client;
}

export async function archiveMessage(request: ArchiveRequest): Promise<ApiResponse<ArchivedMessage>> {
  try {
    const { client } = request;
    
    if (!client) {
      return {
        success: false,
        error: 'Discord client not available'
      };
    }

    // Fetch the message from Discord
    const channel = await client.channels.fetch(request.channelId);
    if (!channel || !channel.isTextBased()) {
      return {
        success: false,
        error: 'Channel not found or not text-based'
      };
    }

    const message = await channel.messages.fetch(request.messageId);
    if (!message) {
      return {
        success: false,
        error: 'Message not found'
      };
    }

    // Transform Discord message to archive format
    const archiveData = await transformMessageToArchive(message, request.archivedBy);

    // Send to backend API
    const apiUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    const response = await axios.post(`${apiUrl}/api/messages/archive`, archiveData, {
      timeout: 5000 // 5 second timeout
    });

    return response.data;
  } catch (error) {
    console.error('Error archiving message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

async function transformMessageToArchive(message: Message, archivedBy: string): Promise<Partial<ArchivedMessage>> {
  return {
    messageId: message.id,
    channelId: message.channelId,
    guildId: message.guildId || '',
    authorId: message.author.id,
    authorUsername: message.author.username,
    authorDisplayName: message.author.displayName || message.author.globalName || undefined,
    authorAvatar: message.author.displayAvatarURL(),
    content: message.content,
    timestamp: message.createdAt,
    editedTimestamp: message.editedAt || undefined,
    attachments: message.attachments.map(attachment => ({
      id: attachment.id,
      filename: attachment.name,
      url: attachment.url,
      proxyUrl: attachment.proxyURL,
      size: attachment.size,
      contentType: attachment.contentType || undefined,
      width: attachment.width || undefined,
      height: attachment.height || undefined
    })),
    embeds: message.embeds.map(embed => ({
      title: embed.title || undefined,
      description: embed.description || undefined,
      url: embed.url || undefined,
      color: embed.color || undefined,
      timestamp: embed.timestamp || undefined,
      footer: embed.footer ? {
        text: embed.footer.text,
        iconUrl: embed.footer.iconURL || undefined
      } : undefined,
      image: embed.image ? {
        url: embed.image.url,
        width: embed.image.width || undefined,
        height: embed.image.height || undefined
      } : undefined,
      thumbnail: embed.thumbnail ? {
        url: embed.thumbnail.url,
        width: embed.thumbnail.width || undefined,
        height: embed.thumbnail.height || undefined
      } : undefined,
      author: embed.author ? {
        name: embed.author.name,
        url: embed.author.url || undefined,
        iconUrl: embed.author.iconURL || undefined
      } : undefined,
      fields: embed.fields?.map(field => ({
        name: field.name,
        value: field.value,
        inline: field.inline || undefined
      }))
    })),
    reactions: message.reactions.cache.map(reaction => ({
      emoji: reaction.emoji.toString(),
      count: reaction.count
    })),
    archived: true,
    archivedAt: new Date(),
    archivedBy,
    messageUrl: generateMessageUrl(message.guildId || '', message.channelId, message.id)
  };
}