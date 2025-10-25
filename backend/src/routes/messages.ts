import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { ArchivedMessage } from '../entities/ArchivedMessage';
import { ApiResponse, PaginatedResponse, GetMessagesQuery, calculatePagination } from '@discord-archive/shared';

const router = Router();
const messageRepository = () => AppDataSource.getRepository(ArchivedMessage);

// Archive a message
router.post('/archive', async (req: Request, res: Response) => {
  try {
    const messageData = req.body;
    
    // Check if message already exists
    const existingMessage = await messageRepository().findOne({
      where: { messageId: messageData.messageId, guildId: messageData.guildId }
    });

    if (existingMessage) {
      const response: ApiResponse<ArchivedMessage> = {
        success: false,
        error: 'Message already archived',
        data: existingMessage
      };
      return res.status(409).json(response);
    }

    // Create new archived message
    const archivedMessage = messageRepository().create(messageData);
    const savedMessage = await messageRepository().save(archivedMessage);

    const response: ApiResponse<ArchivedMessage> = {
      success: true,
      data: Array.isArray(savedMessage) ? savedMessage[0] : savedMessage,
      message: 'Message archived successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error archiving message:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to archive message'
    };
    res.status(500).json(response);
  }
});

// Get paginated messages
router.get('/', async (req: Request<{}, any, any, GetMessagesQuery>, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      guildId,
      channelId,
      authorId,
      search,
      startDate,
      endDate
    } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const queryBuilder = messageRepository()
      .createQueryBuilder('message')
      .where('message.archived = :archived', { archived: true });

    if (guildId) {
      queryBuilder.andWhere('message.guildId = :guildId', { guildId });
    }

    if (channelId) {
      queryBuilder.andWhere('message.channelId = :channelId', { channelId });
    }

    if (authorId) {
      queryBuilder.andWhere('message.authorId = :authorId', { authorId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(message.content LIKE :search OR message.authorUsername LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (startDate) {
      queryBuilder.andWhere('message.timestamp >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('message.timestamp <= :endDate', { endDate });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Get paginated results
    const messages = await queryBuilder
      .orderBy('message.timestamp', 'DESC')
      .skip(skip)
      .take(limitNum)
      .getMany();

    const response: ApiResponse<PaginatedResponse<ArchivedMessage>> = {
      success: true,
      data: {
        data: messages,
        pagination: calculatePagination(pageNum, limitNum, total)
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching messages:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to fetch messages'
    };
    res.status(500).json(response);
  }
});

// Get single message by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await messageRepository().findOne({ where: { id } });

    if (!message) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Message not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<ArchivedMessage> = {
      success: true,
      data: message
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching message:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to fetch message'
    };
    res.status(500).json(response);
  }
});

// Delete archived message
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await messageRepository().delete(id);

    if (result.affected === 0) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Message not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<never> = {
      success: true,
      message: 'Message deleted successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting message:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to delete message'
    };
    res.status(500).json(response);
  }
});

// Get unique guilds/servers
router.get('/meta/guilds', async (req: Request, res: Response) => {
  try {
    const result = await messageRepository()
      .createQueryBuilder('message')
      .select(['message.guildId'])
      .where('message.archived = :archived', { archived: true })
      .distinct(true)
      .getRawMany();

    const guilds = result.map(row => row.message_guildId).filter(Boolean);

    const response: ApiResponse<string[]> = {
      success: true,
      data: guilds
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching guilds:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to fetch guilds'
    };
    res.status(500).json(response);
  }
});

// Get unique channels (optionally filtered by guild)
router.get('/meta/channels', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.query;

    const queryBuilder = messageRepository()
      .createQueryBuilder('message')
      .select(['message.channelId'])
      .where('message.archived = :archived', { archived: true })
      .distinct(true);

    if (guildId) {
      queryBuilder.andWhere('message.guildId = :guildId', { guildId });
    }

    const result = await queryBuilder.getRawMany();
    const channels = result.map(row => row.message_channelId).filter(Boolean);

    const response: ApiResponse<string[]> = {
      success: true,
      data: channels
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching channels:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to fetch channels'
    };
    res.status(500).json(response);
  }
});

// Get unique authors (optionally filtered by guild/channel)
router.get('/meta/authors', async (req: Request, res: Response) => {
  try {
    const { guildId, channelId } = req.query;

    const queryBuilder = messageRepository()
      .createQueryBuilder('message')
      .select(['message.authorId', 'message.authorUsername', 'message.authorAvatar'])
      .where('message.archived = :archived', { archived: true });

    if (guildId) {
      queryBuilder.andWhere('message.guildId = :guildId', { guildId });
    }

    if (channelId) {
      queryBuilder.andWhere('message.channelId = :channelId', { channelId });
    }

    const result = await queryBuilder
      .groupBy('message.authorId, message.authorUsername, message.authorAvatar')
      .getRawMany();

    const authors = result.map(row => ({
      id: row.message_authorId,
      username: row.message_authorUsername,
      avatar: row.message_authorAvatar
    })).filter(author => author.id);

    const response: ApiResponse<Array<{ id: string; username: string; avatar?: string }>> = {
      success: true,
      data: authors
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching authors:', error);
    const response: ApiResponse<never> = {
      success: false,
      error: 'Failed to fetch authors'
    };
    res.status(500).json(response);
  }
});

export default router;