import React from 'react';
import { User } from 'lucide-react';

interface UserInfo {
  id: string;
  username: string;
  discriminator?: string;
  avatar?: string;
  messageCount: number;
}

interface UserListProps {
  users: UserInfo[];
  selectedUserId?: string;
  onUserSelect: (userId: string | undefined) => void;
  className?: string;
}

export const UserList: React.FC<UserListProps> = ({ 
  users, 
  selectedUserId, 
  onUserSelect, 
  className = '' 
}) => {
  const handleUserClick = (userId: string) => {
    // Toggle selection - if already selected, deselect
    onUserSelect(selectedUserId === userId ? undefined : userId);
  };

  const handleClearFilter = () => {
    onUserSelect(undefined);
  };

  return (
    <div className={`user-list ${className}`}>
      <div className="user-list__header">
        <h3 className="user-list__title">Archived Users</h3>
        {selectedUserId && (
          <button 
            onClick={handleClearFilter}
            className="user-list__clear-btn"
            title="Clear user filter"
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="user-list__count">
        {users.length} {users.length === 1 ? 'user' : 'users'} found
      </div>
      
      <div className="user-list__items">
        {users.map((user) => (
          <div
            key={user.id}
            className={`user-list__item ${selectedUserId === user.id ? 'user-list__item--selected' : ''}`}
            onClick={() => handleUserClick(user.id)}
            title={`Filter by ${user.username} (${user.messageCount} messages)`}
          >
            <div className="user-list__avatar">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  className="user-list__avatar-img"
                  onError={(e) => {
                    // If avatar fails to load, hide the image and show placeholder
                    e.currentTarget.style.display = 'none';
                    const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="user-list__avatar-placeholder"
                style={{ display: user.avatar ? 'none' : 'flex' }}
              >
                <User className="user-list__avatar-icon" />
              </div>
            </div>
            
            <div className="user-list__info">
              <div className="user-list__username">
                {user.username}
                {user.discriminator && (
                  <span className="user-list__discriminator">#{user.discriminator}</span>
                )}
              </div>
              <div className="user-list__message-count">
                {user.messageCount} {user.messageCount === 1 ? 'message' : 'messages'}
              </div>
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="user-list__empty">
            <User className="user-list__empty-icon" />
            <p className="user-list__empty-text">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;