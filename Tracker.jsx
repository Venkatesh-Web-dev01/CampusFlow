import React, { useState } from 'react';
import { STATUS_OPTIONS, getDeadlineInfo } from '../utils/formatters';
import { OpportunityCard } from '../components/OpportunityCard';
import { Layers, Bookmark, Send, Award, XCircle, CheckCircle2, Clock, Calendar } from 'lucide-react';

export const Tracker = ({
  opportunities,
  savedIds,
  onToggleSave,
  statuses,
  onStatusChange,
  onViewDetails,
  onSwitchToDiscover
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');

  // Filter opportunities that are either explicitly saved OR have an assigned application status
  const trackedOpportunities = opportunities.filter(
    (opp) => savedIds.includes(opp.id) || (statuses[opp.id] && statuses[opp.id] !== 'Saved')
  );

  // Group stats
  const stats = {
    total: trackedOpportunities.length,
    saved: trackedOpportunities.filter((o) => (statuses[o.id] || 'Saved') === 'Saved').length,
    applied: trackedOpportunities.filter((o) => statuses[o.id] === 'Applied').length,
    interviewing: trackedOpportunities.filter((o) => statuses[o.id] === 'Interviewing').length,
    offered: trackedOpportunities.filter((o) => statuses[o.id] === 'Offered').length,
    rejected: trackedOpportunities.filter((o) => statuses[o.id] === 'Rejected').length,
  };

  const filteredList = trackedOpportunities.filter((opp) => {
    const currentStatus = statuses[opp.id] || 'Saved';
    if (selectedStatusFilter === 'All') return true;
    return currentStatus === selectedStatusFilter;
  });

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <Layers size={24} color="#818cf8" />
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            Application Pipeline Tracker
          </h1>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
          Keep track of deadlines, saved bookmarks, submitted applications, and interview statuses in one place.
        </p>
      </div>

      {/* Pipeline Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem'
      }}>
        <div className="glass-card" style={{ padding: '1.2rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bookmark size={16} color="#38bdf8" /> SAVED
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '0.4rem' }}>
            {stats.saved}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Send size={16} color="#fbbf24" /> APPLIED
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '0.4rem' }}>
            {stats.applied}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={16} color="#c084fc" /> INTERVIEWING
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '0.4rem' }}>
            {stats.interviewing}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', border: '1px solid rgba(52, 211, 153, 0.4)' }}>
          <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Award size={16} color="#34d399" /> OFFERS RECEIVED
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '0.4rem' }}>
            {stats.offered}
          </div>
        </div>
      </div>

      {/* Filter Tabs by Pipeline Stage */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '0.75rem'
      }}>
        <button
          onClick={() => setSelectedStatusFilter('All')}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: selectedStatusFilter === 'All' ? '#6366f1' : 'rgba(255, 255, 255, 0.04)',
            color: '#ffffff'
          }}
        >
          All Tracked ({stats.total})
        </button>

        {STATUS_OPTIONS.map((opt) => {
          const isSelected = selectedStatusFilter === opt.id;
          const count = trackedOpportunities.filter((o) => (statuses[o.id] || 'Saved') === opt.id).length;
          return (
            <button
              key={opt.id}
              onClick={() => setSelectedStatusFilter(opt.id)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: isSelected ? `1px solid ${opt.color}` : '1px solid rgba(255, 255, 255, 0.06)',
                background: isSelected ? opt.bg : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? opt.color : '#9ca3af'
              }}
            >
              {opt.label} ({count})
            </button>
          );
        })}
      </div>

      {/* List of Tracked Opportunities */}
      {filteredList.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredList.map((opp) => (
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
        <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
          <Layers size={36} color="#818cf8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.5rem' }}>
            No opportunities in this stage
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Save or update application statuses from the Discover tab to build your pipeline.
          </p>
          <button onClick={onSwitchToDiscover} className="btn btn-primary">
            Explore Opportunities
          </button>
        </div>
      )}
    </div>
  );
};
