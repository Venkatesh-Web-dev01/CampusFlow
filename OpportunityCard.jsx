import React from 'react';
import { Bookmark, BookmarkCheck, Calendar, MapPin, DollarSign, ExternalLink, Clock } from 'lucide-react';
import { getDeadlineInfo, TYPE_STYLES } from '../utils/formatters';
import { StatusBadge } from './StatusBadge';

export const OpportunityCard = ({
  opportunity,
  isSaved,
  onToggleSave,
  status,
  onStatusChange,
  onViewDetails,
}) => {
  const deadlineInfo = getDeadlineInfo(opportunity.deadline);
  const typeStyle = TYPE_STYLES[opportunity.type] || TYPE_STYLES.Internship;

  return (
    <div className="glass-card" style={{
      padding: '1.4rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      <div>
        {/* Card Header: Type Badge & Deadline Urgency Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '0.5rem' }}>
          <span style={{
            background: typeStyle.bg,
            color: typeStyle.color,
            border: `1px solid ${typeStyle.border}`,
            padding: '0.25rem 0.65rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.3px',
            textTransform: 'uppercase'
          }}>
            {opportunity.type}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.25rem 0.6rem',
              borderRadius: '20px',
              background: deadlineInfo.isUrgent ? 'rgba(239, 68, 68, 0.15)' : deadlineInfo.isExpired ? 'rgba(107, 114, 128, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: deadlineInfo.isUrgent ? '#f87171' : deadlineInfo.isExpired ? '#9ca3af' : '#d1d5db',
              border: deadlineInfo.isUrgent ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <Clock size={13} />
              {deadlineInfo.text}
            </span>

            <button
              onClick={() => onToggleSave(opportunity.id)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: isSaved ? '#818cf8' : '#9ca3af'
              }}
              title={isSaved ? 'Remove from Saved' : 'Save Opportunity'}
            >
              {isSaved ? <BookmarkCheck size={18} color="#818cf8" /> : <Bookmark size={18} />}
            </button>
          </div>
        </div>

        {/* Title & Organization */}
        <h3
          onClick={() => onViewDetails(opportunity)}
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#f9fafb',
            marginBottom: '0.35rem',
            lineHeight: 1.35,
            cursor: 'pointer',
            transition: 'color 0.15s'
          }}
          className="hover:text-indigo-400"
        >
          {opportunity.title}
        </h3>

        <div style={{ fontSize: '0.9rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.9rem' }}>
          {opportunity.organization}
        </div>

        {/* Quick Meta: Stipend & Location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.1rem', fontSize: '0.83rem', color: '#9ca3af' }}>
          {opportunity.stipend && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 600 }}>
              <DollarSign size={15} />
              <span>{opportunity.stipend}</span>
            </div>
          )}
          {opportunity.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={15} color="#9ca3af" />
              <span>{opportunity.location}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {opportunity.tags && opportunity.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {opportunity.tags.map((tag, idx) => (
              <span key={idx} style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#9ca3af',
                fontSize: '0.73rem',
                fontWeight: 500,
                padding: '0.2rem 0.5rem',
                borderRadius: '6px'
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.9rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        gap: '0.5rem'
      }}>
        <StatusBadge
          currentStatus={status}
          onStatusChange={(newStatus) => onStatusChange(opportunity.id, newStatus)}
        />

        <button
          onClick={() => onViewDetails(opportunity)}
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
        >
          Details
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
};
