import React from 'react';
import { X, ExternalLink, Bookmark, BookmarkCheck, Calendar, MapPin, DollarSign, CheckCircle2, Building, ShieldAlert, Send } from 'lucide-react';
import { getDeadlineInfo, formatDate, TYPE_STYLES } from '../utils/formatters';
import { StatusBadge } from './StatusBadge';

export const OpportunityModal = ({
  opportunity,
  onClose,
  isSaved,
  onToggleSave,
  status,
  onStatusChange,
  onOpenApplyModal,
}) => {
  if (!opportunity) return null;

  const deadlineInfo = getDeadlineInfo(opportunity.deadline);
  const typeStyle = TYPE_STYLES[opportunity.type] || TYPE_STYLES.Internship;

  // Ensure absolute HTTPS URL for mobile & desktop browser navigation
  let rawUrl = opportunity.applyUrl || opportunity.applicationLink || 'https://careers.google.com/students';
  if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
    rawUrl = `https://${rawUrl}`;
  }
  const destinationUrl = rawUrl;

  const handleApplyClick = (e) => {
    // Open in new tab reliably cross-platform
    window.open(destinationUrl, '_blank', 'noopener,noreferrer');

    // Update application tracking status to 'Applied' automatically
    if (onStatusChange) {
      onStatusChange(opportunity.id, 'Applied');
    }

    // Trigger in-app tracking feedback modal if provided
    if (onOpenApplyModal) {
      onOpenApplyModal(opportunity);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{
                background: typeStyle.bg,
                color: typeStyle.color,
                border: `1px solid ${typeStyle.border}`,
                padding: '0.25rem 0.65rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                {opportunity.type}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: 500 }}>
                {opportunity.category}
              </span>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.3 }}>
              {opportunity.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8', fontWeight: 600, fontSize: '1rem', marginTop: '0.3rem' }}>
              <Building size={16} />
              <span>{opportunity.organization}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Deadline Banner */}
        <div style={{
          background: deadlineInfo.isUrgent ? 'rgba(239, 68, 68, 0.12)' : 'rgba(99, 102, 241, 0.12)',
          border: deadlineInfo.isUrgent ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: deadlineInfo.isUrgent ? '#f87171' : '#818cf8', fontWeight: 600 }}>
            {deadlineInfo.isUrgent ? <ShieldAlert size={18} /> : <Calendar size={18} />}
            <span>Deadline: {formatDate(opportunity.deadline)}</span>
          </div>
          <span style={{ fontWeight: 700, color: deadlineInfo.isUrgent ? '#f87171' : '#ffffff' }}>
            {deadlineInfo.text}
          </span>
        </div>

        {/* Metadata Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>STIPEND / PRIZE</div>
            <div style={{ fontSize: '0.95rem', color: '#34d399', fontWeight: 700, marginTop: '0.2rem' }}>
              {opportunity.stipend || 'Unpaid / N/A'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>LOCATION</div>
            <div style={{ fontSize: '0.9rem', color: '#e5e7eb', fontWeight: 600, marginTop: '0.2rem' }}>
              {opportunity.location || 'Remote'}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem' }}>
            About the Opportunity
          </h4>
          <p style={{ fontSize: '0.9rem', color: '#9ca3af', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {opportunity.description}
          </p>
        </div>

        {/* Eligibility Section */}
        {opportunity.eligibility && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f3f4f6', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} color="#10b981" />
              Eligibility Criteria
            </h4>
            <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.88rem', color: '#d1d5db', lineHeight: 1.5 }}>
              {opportunity.eligibility}
            </div>
          </div>
        )}

        {/* Tags */}
        {opportunity.tags && opportunity.tags.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {opportunity.tags.map((tag, idx) => (
                <span key={idx} style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#818cf8',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px'
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Modal Action Footer */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => onToggleSave(opportunity.id)}
              className="btn btn-secondary"
              style={{ color: isSaved ? '#818cf8' : '#ffffff' }}
            >
              {isSaved ? <BookmarkCheck size={18} color="#818cf8" /> : <Bookmark size={18} />}
              {isSaved ? 'Saved' : 'Save'}
            </button>

            <StatusBadge
              currentStatus={status}
              onStatusChange={(newStatus) => onStatusChange(opportunity.id, newStatus)}
            />
          </div>

          <a
            href={destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleApplyClick}
            className="btn btn-primary"
            style={{ textDecoration: 'none' }}
          >
            Apply Directly
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};
