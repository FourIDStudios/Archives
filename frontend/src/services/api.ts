import axios from 'axios';
import type { ArchivedMessage, ApiResponse, PaginatedResponse, GetMessagesQuery } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface FetchMessagesParams extends GetMessagesQuery {
  page?: number;
  limit?: number;
}

export class ApiService {
  // Get paginated messages
  static async getMessages(params: FetchMessagesParams = {}): Promise<PaginatedResponse<ArchivedMessage>> {
    const response = await api.get<ApiResponse<PaginatedResponse<ArchivedMessage>>>('/api/messages', {
      params
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch messages');
    }
    
    return response.data.data!;
  }

  // Get single message by ID
  static async getMessage(id: string): Promise<ArchivedMessage> {
    const response = await api.get<ApiResponse<ArchivedMessage>>(`/api/messages/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch message');
    }
    
    return response.data.data!;
  }

  // Delete message
  static async deleteMessage(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<never>>(`/api/messages/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete message');
    }
  }

  // Health check
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await api.get('/health');
    return response.data;
  }

  // Get unique guilds/servers
  static async getGuilds(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/api/messages/meta/guilds');
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch guilds');
    }
    
    return response.data.data!;
  }

  // Get unique channels (optionally filtered by guild)
  static async getChannels(guildId?: string): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/api/messages/meta/channels', {
      params: guildId ? { guildId } : undefined
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch channels');
    }
    
    return response.data.data!;
  }

  // Get unique authors (optionally filtered by guild/channel)
  static async getAuthors(guildId?: string, channelId?: string): Promise<Array<{ id: string; username: string; avatar?: string }>> {
    const response = await api.get<ApiResponse<Array<{ id: string; username: string; avatar?: string }>>>('/api/messages/meta/authors', {
      params: { guildId, channelId }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch authors');
    }
    
    return response.data.data!;
  }
}

export default ApiService;