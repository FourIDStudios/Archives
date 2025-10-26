import React from 'react';
import { type ArchivedMessage } from '../types';
import { formatTimestamp, formatFileSize } from '@discord-archive/shared';
import { Calendar, User, MessageSquare, Paperclip, ExternalLink} from 'lucide-react';

// Function to detect media URLs in content
function detectMediaUrls(content: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = content.match(urlRegex) || [];
  
  return urls.map(url => {
    // Remove any trailing punctuation
    const cleanUrl = url.replace(/[.,;:!?)]*$/, '');
    
    // Detect media types
    if (cleanUrl.includes('tenor.com') || cleanUrl.includes('giphy.com') || 
        cleanUrl.match(/\.(gif)(\?.*)?$/i)) {
      return { url: cleanUrl, type: 'gif' };
    }
    
    if (cleanUrl.match(/\.(jpg|jpeg|png|webp|svg)(\?.*)?$/i)) {
      return { url: cleanUrl, type: 'image' };
    }
    
    if (cleanUrl.match(/\.(mp4|webm|mov|avi)(\?.*)?$/i)) {
      return { url: cleanUrl, type: 'video' };
    }
    
    return { url: cleanUrl, type: 'link' };
  });
}

// Function to render media content
function renderMediaContent(mediaUrls: Array<{url: string, type: string}>) {
  return mediaUrls.map((media, index) => {
    if (media.type === 'gif' || media.type === 'image') {
      // For Tenor GIFs, convert to direct GIF URL
      let imageUrl = media.url;
      if (media.url.includes('tenor.com/view/')) {
        // Add .gif suffix for Tenor URLs
        imageUrl = media.url.endsWith('.gif') ? media.url : `${media.url}.gif`;
      }
      
      return (
        <div key={index} className="mt-3">
          <img 
            src={imageUrl}
            alt="Embedded media"
            className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
            style={{ maxHeight: '400px' }}
            onError={(e) => {
              // Fallback: show as link if image fails to load
              const target = e.target as HTMLImageElement;
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <a href="${media.url}" target="_blank" rel="noopener noreferrer" 
                     class="text-blue-600 hover:text-blue-800 underline break-all">
                    ${media.url}
                  </a>
                `;
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            <a href={media.url} target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:text-blue-800">
              View original
            </a>
          </p>
        </div>
      );
    }
    
    if (media.type === 'video') {
      return (
        <div key={index} className="mt-3">
          <video 
            controls
            className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
            style={{ maxHeight: '400px' }}
          >
            <source src={media.url} />
            Your browser does not support the video tag.
            <a href={media.url} target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:text-blue-800 underline">
              View video
            </a>
          </video>
        </div>
      );
    }
    
    return null; // Regular links are handled in the text content
  });
}

interface MessageCardProps {
  message: ArchivedMessage;
  onViewDetails?: (messageId: string) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message, onViewDetails }) => {

  return (
    <div className="message-card">
      {/* Header */}
      <div className="message-card__header">
        <div className="message-card__author">
          {message.authorAvatar ? (
            <img 
              src={message.authorAvatar} 
              alt={message.authorUsername}
              className="message-card__author-avatar"
            />
          ) : (
            <div className="message-card__author-placeholder">
              <User className="w--6 h--6" />
            </div>
          )}
          <div className="message-card__author-info">
            <p className="message-card__author-name">
              {message.authorDisplayName || message.authorUsername}
            </p>
            <p className="message-card__author-username">@{message.authorUsername}</p>
          </div>
        </div>
        <div className="message-card__actions">
          <button
            onClick={() => onViewDetails?.(message.id)}
            className="btn btn--ghost btn--sm text--primary"
            title="View Details"
          >
            <ExternalLink className="w--4 h--4" />
          </button>
        </div>
      </div>

      {/* Message Content */}
      <div className="message-card__content">
        <p className="whitespace--pre-wrap break--words">
          {message.content || <em className="text--gray-500">No text content</em>}
        </p>
        
        {/* Embedded Media Content */}
        {message.content && (() => {
          const mediaUrls = detectMediaUrls(message.content);
          const mediaContent = mediaUrls.filter(media => media.type !== 'link');
          return mediaContent.length > 0 ? (
            <div className="message-card__media">
              {renderMediaContent(mediaContent)}
            </div>
          ) : null;
        })()}
      </div>

      {/* Attachments */}
      {message.attachments.length > 0 && (
        <div className="mb--4">
          <div className="flex space-x--2 mb--2">
            <Paperclip className="w--4 h--4 text--gray-500" />
            <span className="text--sm text--semibold text--gray-700">
              {message.attachments.length} attachment(s)
            </span>
          </div>
          <div className="space-y--3">
            {message.attachments.map(attachment => {
              const isImage = attachment.filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
              const isVideo = attachment.filename.match(/\.(mp4|webm|mov|avi)$/i);
              
              return (
                <div key={attachment.id} className="attachment">
                  <div className="attachment__header">
                    <div className="attachment__info">
                      <h4>{attachment.filename}</h4>
                      <p>{formatFileSize(attachment.size)}</p>
                    </div>
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--ghost btn--sm text--primary"
                    >
                      <ExternalLink className="w--4 h--4" />
                    </a>
                  </div>
                  
                  {/* Render image attachments */}
                  {isImage && (
                    <div className="attachment__media">
                      <img 
                        src={attachment.url}
                        alt={attachment.filename}
                      />
                    </div>
                  )}
                  
                  {/* Render video attachments */}
                  {isVideo && (
                    <div className="attachment__media">
                      <video controls>
                        <source src={attachment.url} />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Embeds */}
      {message.embeds.length > 0 && (
        <div className="mb--4">
          <div className="text--sm text--semibold text--gray-700 mb--2">
            {message.embeds.length} embed(s)
          </div>
          <div className="space-y--2">
            {message.embeds.map((embed, index) => (
              <div key={index} className="embed">
                {embed.title && (
                  <h4 className="embed__title">{embed.title}</h4>
                )}
                {embed.description && (
                  <p className="embed__description">{embed.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="message-card__footer">
        <div className="message-card__footer-left">
          <div className="message-card__footer-item">
            <Calendar className="w--4 h--4" />
            <span>{formatTimestamp(message.timestamp)}</span>
          </div>
          <div className="message-card__footer-item">
            <MessageSquare className="w--4 h--4" />
            <a
              href={message.messageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text--primary"
            >
              View Original
            </a>
          </div>
        </div>
        <div className="message-card__footer-right">
          <div className="message-card__archived-by">
            <span className="text--xs text--gray-400">Archived by:</span>
            <div className="message-card__archived-by-user">
              {message.archivedByAvatar ? (
                <img 
                  src={message.archivedByAvatar} 
                  alt={message.archivedByUsername || 'Unknown User'}
                  className="message-card__archived-by-avatar"
                />
              ) : (
                <div className="message-card__archived-by-placeholder">
                  <User className="w--3 h--3" />
                </div>
              )}
              <span className="text--xs text--gray-300">
                {message.archivedByDisplayName || message.archivedByUsername || `User ${message.archivedBy}`}
              </span>
            </div>
          </div>
          <div className="text--xs text--gray-400">
            {formatTimestamp(message.archivedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};