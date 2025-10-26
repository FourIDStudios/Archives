import React, { useState, useMemo } from 'react';
import { MessageCard } from '../MessageCard';
import { Pagination } from '../Pagination';
import { type ArchivedMessage } from '../../types';
import { RefreshCw, Archive, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

type SortOrder = 'newest' | 'oldest';

interface MessageStreamProps {
  messages: ArchivedMessage[];
  currentPage: number;
  totalPages: number;
  totalMessages: number;
  isLoading?: boolean;
  error?: Error | null;
  onPageChange: (page: number) => void;
  onViewDetails: (messageId: string) => void;
  className?: string;
}

export const MessageStream: React.FC<MessageStreamProps> = ({
  messages,
  currentPage,
  totalPages,
  totalMessages,
  isLoading = false,
  error = null,
  onPageChange,
  onViewDetails,
  className = ''
}) => {
  // Sort state - default to newest first (by archived date)
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Sort messages by archived date
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const dateA = new Date(a.archivedAt).getTime();
      const dateB = new Date(b.archivedAt).getTime();
      
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [messages, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };
  if (isLoading) {
    return (
      <div className={`message-stream ${className}`}>
        <div className="message-stream__loading">
          <RefreshCw className="message-stream__loading-icon" />
          <p className="message-stream__loading-text">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`message-stream ${className}`}>
        <div className="message-stream__error">
          <AlertCircle className="message-stream__error-icon" />
          <h3 className="message-stream__error-title">Failed to Load Messages</h3>
          <p className="message-stream__error-message">{error.message}</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={`message-stream ${className}`}>
        <div className="message-stream__empty">
          <Archive className="message-stream__empty-icon" />
          <h3 className="message-stream__empty-title">No Messages Found</h3>
          <p className="message-stream__empty-message">
            Try adjusting your filters or use the Discord bot's <code>/archive</code> command to save messages!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`message-stream ${className}`}>
      {/* Header with message count and sort toggle */}
      <div className="message-stream__header">
        <div className="message-stream__stats">
          <span className="message-stream__count">
            {totalMessages} {totalMessages === 1 ? 'message' : 'messages'} found
          </span>
          <span className="message-stream__page-info">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        
        <div className="message-stream__controls">
          <button
            onClick={toggleSortOrder}
            className="message-stream__sort-toggle"
            title={`Currently sorted by ${sortOrder === 'newest' ? 'newest first' : 'oldest first'}. Click to toggle.`}
          >
            {sortOrder === 'newest' ? (
              <ArrowDown className="message-stream__sort-icon" />
            ) : (
              <ArrowUp className="message-stream__sort-icon" />
            )}
            <span className="message-stream__sort-text">
              {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
            </span>
          </button>
        </div>
      </div>

      {/* Message list */}
      <div className="message-stream__content">
        <div className="message-stream__messages">
          {sortedMessages.map((message) => (
            <div key={message.id} className="message-stream__message-wrapper">
              <MessageCard
                message={message}
                onViewDetails={() => onViewDetails(message.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="message-stream__footer">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default MessageStream;