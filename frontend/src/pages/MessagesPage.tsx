import React, { useState, useEffect, useMemo } from 'react';
import { useQuery} from '@tanstack/react-query';
import { Header } from '../components/Header';
import { FilterSidebar, type FilterOptions } from '../components/FilterSidebar';
import { MessageStream } from '../components/MessageStream';
import { UserList } from '../components/UserList';
import { ApiService } from '../services/api';
import { RefreshCw, AlertCircle } from 'lucide-react';


export const MessagesPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    guildId: '',
    channelId: '',
    authorId: '',
    startDate: '',
    endDate: ''
  });

  // Health check to ensure backend is available
  const { data: healthData } = useQuery({
    queryKey: ['health'],
    queryFn: () => ApiService.healthCheck(),
    retry: 3,
    retryDelay: 1000
  });

  // Fetch messages query - only run if backend is healthy
  const {
    data: messagesData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['messages', currentPage, filters],
    queryFn: () => ApiService.getMessages({
      page: currentPage,
      limit: 20,
      ...filters
    }),
    enabled: !!healthData, // Only run if health check passes
    placeholderData: (previousData) => previousData
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Extract unique users from messages for the user list
  const users = useMemo(() => {
    if (!messagesData?.data) return [];
    
    const userMap = new Map();
    messagesData.data.forEach(message => {
      const userId = message.authorId;
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          id: userId,
          username: message.authorUsername,
          avatar: message.authorAvatar,
          messageCount: 1
        });
      } else {
        userMap.get(userId).messageCount++;
      }
    });
    
    return Array.from(userMap.values()).sort((a, b) => b.messageCount - a.messageCount);
  }, [messagesData?.data]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleUserSelect = (userId: string | undefined) => {
    setSelectedUserId(userId);
    setFilters(prev => ({ ...prev, authorId: userId || '' }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (messageId: string) => {
    // For now, just show an alert with the message ID
    // In the future, this could navigate to a detail page or open a modal
    alert(`Message ID: ${messageId}\n\nIn the future, this will show detailed message information.`);
  };

  // Show loading if health check hasn't completed yet
  if (!healthData && !error) {
    return (
      <>
        <Header />
        <div className="page-container page-container--with-header page-container--centered">
          <div className="loading-state">
            <RefreshCw className="loading-state__spinner" />
            <p className="loading-state__text">Connecting to The Archives...</p>
          </div>
        </div>
      </>
    );
  }

  // Show connection error if health check fails
  if (!healthData && error) {
    return (
      <>
        <Header />
        <div className="page-container page-container--with-header page-container--centered">
          <div className="error-state">
            <AlertCircle className="error-state__icon" />
            <h3 className="error-state__title">Vault Connection Failed</h3>
            <p className="error-state__message">
              Unable to connect to The Archives vault. Please ensure the backend server is running on port 3001.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn--primary"
            >
              <RefreshCw className="w--4 h--4" />
              Retry Connection
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="archive-layout">
        <MessageStream 
          messages={messagesData?.data || []}
          currentPage={messagesData?.pagination?.page || 1}
          totalPages={messagesData?.pagination?.totalPages || 1}
          totalMessages={messagesData?.pagination?.total || 0}
          isLoading={isLoading}
          error={error}
          onPageChange={handlePageChange}
          onViewDetails={handleViewDetails}
        />
        <div className='SideContent'>
        <UserList 
          users={users}
          selectedUserId={selectedUserId}
          onUserSelect={handleUserSelect}
        />
        <FilterSidebar 
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
        </div>
        
      </div>
    </>
  );
};