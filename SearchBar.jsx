import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Internship',
  'Hackathon',
  'Scholarship',
  'Workshop',
  'Competition',
];

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  totalResults,
}) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Search Bar & Sort Dropdown Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem'
      }}>
        {/* Search Input Box */}
        <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '600px' }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search internships, hackathons, scholarships, companies, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.6rem', paddingRight: searchQuery ? '2.5rem' : '1rem' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ArrowUpDown size={16} color="#818cf8" />
          <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 500 }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
            style={{ width: 'auto', padding: '0.55rem 1rem', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <option value="deadline-asc">Deadline (Closing Soonest)</option>
            <option value="deadline-desc">Deadline (Farther Out)</option>
            <option value="title-asc">Title (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Category Pills & Results Counter Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: isActive ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(79, 70, 229, 0.25) 100%)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#ffffff' : '#9ca3af',
                  boxShadow: isActive ? '0 0 12px rgba(99, 102, 241, 0.3)' : 'none'
                }}
              >
                {cat === 'All' ? '🔥 All Opportunities' : cat}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>
          Showing <strong style={{ color: '#f3f4f6' }}>{totalResults}</strong> {totalResults === 1 ? 'opportunity' : 'opportunities'}
        </div>
      </div>
    </div>
  );
};
