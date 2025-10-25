// Discord message data structure
export interface ArchivedMessage {
  id: string;
  messageId: string;
  channelId: string;
  guildId: string;
  authorId: string;
  authorUsername: string;
  authorDisplayName?: string;
  authorAvatar?: string;
  content: string;
  timestamp: Date;
  editedTimestamp?: Date;
  attachments: MessageAttachment[];
  embeds: MessageEmbed[];
  reactions?: MessageReaction[];
  archived: boolean;
  archivedAt: Date;
  archivedBy: string;
  messageUrl: string;
}

// Message attachment data
export interface MessageAttachment {
  id: string;
  filename: string;
  url: string;
  proxyUrl: string;
  size: number;
  contentType?: string;
  width?: number;
  height?: number;
}

// Message embed data
export interface MessageEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  timestamp?: string;
  footer?: {
    text: string;
    iconUrl?: string;
  };
  image?: {
    url: string;
    width?: number;
    height?: number;
  };
  thumbnail?: {
    url: string;
    width?: number;
    height?: number;
  };
  author?: {
    name: string;
    url?: string;
    iconUrl?: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
}

// Message reaction data
export interface MessageReaction {
  emoji: string;
  count: number;
  users?: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// API Request types
export interface ArchiveMessageRequest {
  messageUrl?: string;
  channelId?: string;
  messageId?: string;
}

export interface GetMessagesQuery {
  page?: number;
  limit?: number;
  guildId?: string;
  channelId?: string;
  authorId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

// Discord API types
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  globalName?: string;
  avatar?: string;
  bot?: boolean;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
  guildId?: string;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon?: string;
}

// Utility types
export type MessageStatus = 'active' | 'archived' | 'deleted';

export interface DatabaseConfig {
  type: 'sqlite' | 'postgres' | 'mysql';
  host?: string;
  port?: number;
  database: string;
  username?: string;
  password?: string;
  synchronize?: boolean;
  logging?: boolean;
}

// Error types
export class ArchiveError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ArchiveError';
  }
}

export const ErrorCodes = {
  MESSAGE_NOT_FOUND: 'MESSAGE_NOT_FOUND',
  INVALID_MESSAGE_URL: 'INVALID_MESSAGE_URL',
  DATABASE_ERROR: 'DATABASE_ERROR',
  DISCORD_API_ERROR: 'DISCORD_API_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
} as const;