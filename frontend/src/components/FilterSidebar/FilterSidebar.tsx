import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Calendar, Hash, Filter, X, ChevronDown } from 'lucide-react';
import { ApiService } from '../../services/api';

export interface FilterOptions {
  search: string;
  guildId: string;
  channelId: string;
  authorId: string;
  startDate: string;
  endDate: string;
}

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  onFiltersChange, 
  className = '' 
}) => {
  // Fetch unique guilds/servers
  const { data: guilds = [] } = useQuery({
    queryKey: ['guilds'],
    queryFn: ApiService.getGuilds,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch unique channels (filtered by selected guild)
  const { data: channels = [] } = useQuery({
    queryKey: ['channels', filters.guildId],
    queryFn: () => ApiService.getChannels(filters.guildId || undefined),
    staleTime: 5 * 60 * 1000,
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    
    // Clear dependent filters when parent filters change
    if (key === 'guildId') {
      newFilters.channelId = '';
    }
    
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      guildId: '',
      channelId: '',
      authorId: '',
      startDate: '',
      endDate: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className={`filter-sidebar ${className}`}>
      <div className="filter-sidebar__header">
        <div className="filter-sidebar__title-row">
          <Filter className="filter-sidebar__icon" />
          <h3 className="filter-sidebar__title">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className="filter-sidebar__clear-btn"
            title="Clear all filters"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="filter-sidebar__content">
        {/* Search */}
        <div className="filter-sidebar__section">
          <label className="filter-sidebar__label">
            <Search className="filter-sidebar__label-icon" />
            Search Messages
          </label>
          <input
            type="text"
            className="filter-sidebar__input"
            placeholder="Search in message content..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Server/Guild */}
        <div className="filter-sidebar__section">
          <label className="filter-sidebar__label">
            <Hash className="filter-sidebar__label-icon" />
            Server
          </label>
          <div className="filter-sidebar__select-wrapper">
            <select
              className="filter-sidebar__select"
              value={filters.guildId}
              onChange={(e) => handleFilterChange('guildId', e.target.value)}
            >
              <option value="">All Servers</option>
              {guilds.map((guildId) => (
                <option key={guildId} value={guildId}>
                  {guildId}
                </option>
              ))}
            </select>
            <ChevronDown className="filter-sidebar__select-icon" />
          </div>
        </div>

        {/* Channel */}
        <div className="filter-sidebar__section">
          <label className="filter-sidebar__label">
            <Hash className="filter-sidebar__label-icon" />
            Channel
          </label>
          <div className="filter-sidebar__select-wrapper">
            <select
              className="filter-sidebar__select"
              value={filters.channelId}
              onChange={(e) => handleFilterChange('channelId', e.target.value)}
              disabled={!filters.guildId}
            >
              <option value="">All Channels</option>
              {channels.map((channelId) => (
                <option key={channelId} value={channelId}>
                  {channelId}
                </option>
              ))}
            </select>
            <ChevronDown className="filter-sidebar__select-icon" />
          </div>
        </div>



        {/* Date Range */}
        <div className="filter-sidebar__section">
          <label className="filter-sidebar__label">
            <Calendar className="filter-sidebar__label-icon" />
            Date Range
          </label>
          <div className="filter-sidebar__date-inputs">
            <input
              type="date"
              className="filter-sidebar__input filter-sidebar__input--date"
              placeholder="Start date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
            <input
              type="date"
              className="filter-sidebar__input filter-sidebar__input--date"
              placeholder="End date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="filter-sidebar__active">
            <h4 className="filter-sidebar__active-title">Active Filters:</h4>
            <div className="filter-sidebar__active-list">
              {filters.search && (
                <div className="filter-sidebar__active-item">
                  Search: "{filters.search}"
                </div>
              )}
              {filters.guildId && (
                <div className="filter-sidebar__active-item">
                  Server: {filters.guildId}
                </div>
              )}
              {filters.channelId && (
                <div className="filter-sidebar__active-item">
                  Channel: {filters.channelId}
                </div>
              )}

              {(filters.startDate || filters.endDate) && (
                <div className="filter-sidebar__active-item">
                  Date: {filters.startDate || '...'} to {filters.endDate || '...'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;