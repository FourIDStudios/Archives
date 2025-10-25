import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

export interface FilterOptions {
  search: string;
  guildId: string;
  channelId: string;
  authorId: string;
  startDate: string;
  endDate: string;
}

interface SearchBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ filters, onFiltersChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const clearFilters = () => {
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
    <div className="search-bar">
      {/* Main Search */}
      <div className="search-bar__main">
        <div className="search-bar__input-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search messages..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className="input"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`btn ${
            showAdvanced || hasActiveFilters 
              ? 'btn--primary' 
              : 'btn--secondary'
          } gap--2`}
        >
          <Filter className="w--4 h--4" />
          <span>Filters</span>
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn btn--danger btn--sm gap--2"
          >
            <X className="w--4 h--4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="search-bar__filters">
          <div className="search-bar__filter-grid">
            <div className="search-bar__filter-group">
              <label>Guild ID</label>
              <input
                type="text"
                placeholder="Enter guild ID..."
                value={filters.guildId}
                onChange={(e) => handleInputChange('guildId', e.target.value)}
                className="input"
              />
            </div>
            <div className="search-bar__filter-group">
              <label>Channel ID</label>
              <input
                type="text"
                placeholder="Enter channel ID..."
                value={filters.channelId}
                onChange={(e) => handleInputChange('channelId', e.target.value)}
                className="input"
              />
            </div>
            <div className="search-bar__filter-group">
              <label>Author ID</label>
              <input
                type="text"
                placeholder="Enter author ID..."
                value={filters.authorId}
                onChange={(e) => handleInputChange('authorId', e.target.value)}
                className="input"
              />
            </div>
            <div className="search-bar__filter-group">
              <label>Start Date</label>
              <input
                type="datetime-local"
                value={filters.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="input"
              />
            </div>
            <div className="search-bar__filter-group">
              <label>End Date</label>
              <input
                type="datetime-local"
                value={filters.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="input"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};