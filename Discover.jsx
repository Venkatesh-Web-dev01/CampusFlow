import React from 'react';
import { SearchBar } from '../components/SearchBar';
import { OpportunityCard } from '../components/OpportunityCard';
import { Sparkles, AlertCircle, Compass } from 'lucide-react';

export const Discover = ({
  opportunities,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  savedIds,
  onToggleSave,
  statuses,
  onStatusChange,
  onViewDetails,
}) => {
  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Hero Welcome Header */}
      <div style={{
        marginBottom: '2.5rem',
        textAlign: 'center',
        padding: '2.5rem 1.5rem',
        borderRadius: '24px',
        background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15) 0%, rgba(11, 15, 25, 0) 70%)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(99, 102, 241, 0.15)',
          color: '#818cf8',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '0.3rem 0.8rem',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          <Sparkles size={15} />
          CampusFlow Opportunity Hub
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-1px',
          lineHeight: 1.2,
          marginBottom: '0.75rem'
        }}>
          Discover Top College Opportunities
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: '#9ca3af',
          maxWidth: '620px',
          margin: '0 auto',
          lineHeight: 1.5
        }}>
          One centralized feed for student internships, global hackathons, research grants, workshops, and coding competitions.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalResults={opportunities.length}
      />

      {/* Opportunities Cards Grid */}
      {opportunities.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}>
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isSaved={savedIds.includes(opp.id)}
              onToggleSave={onToggleSave}
              status={statuses[opp.id] || 'Saved'}
              onStatusChange={onStatusChange}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card" style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '3rem auto 0'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <AlertCircle size={30} color="#818cf8" />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.5rem' }}>
            No opportunities found
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            We couldn't find any opportunities matching "{searchQuery}". Try clearing search keywords or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
