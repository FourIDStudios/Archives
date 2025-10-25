// Re-export types from shared package for frontend use
export type {
  ArchivedMessage,
  MessageAttachment,
  MessageEmbed,
  MessageReaction,
  ApiResponse,
  PaginatedResponse,
  GetMessagesQuery
} from '@discord-archive/shared';

// Note: Import utilities directly from '@discord-archive/shared' in components that need them

// Frontend-specific types - define PaginationInfo to match calculatePagination return type
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}