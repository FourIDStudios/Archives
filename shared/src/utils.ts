// Utility functions for Discord message URLs
export function parseDiscordMessageUrl(url: string): {
  guildId: string;
  channelId: string;
  messageId: string;
} | null {
  const regex = /https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
  const match = url.match(regex);
  
  if (!match) {
    return null;
  }
  
  return {
    guildId: match[1],
    channelId: match[2],
    messageId: match[3]
  };
}

// Format timestamp for display
export function formatTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString();
}

// Generate Discord message URL
export function generateMessageUrl(guildId: string, channelId: string, messageId: string): string {
  return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}

// Validate Discord snowflake ID
export function isValidSnowflake(id: string): boolean {
  return /^\d{17,19}$/.test(id);
}

// Extract user mention from content
export function extractMentions(content: string): string[] {
  const regex = /<@!?(\d+)>/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

// Clean content for display (remove mentions, etc.)
export function cleanMessageContent(content: string): string {
  return content
    .replace(/<@!?(\d+)>/g, '@user')
    .replace(/<#(\d+)>/g, '#channel')
    .replace(/<@&(\d+)>/g, '@role');
}

// Pagination helpers
export function calculatePagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev
  };
}

// File size formatting
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}