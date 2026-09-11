import React, { useState } from 'react';
import { X, Send, CheckCircle2, Building, ExternalLink, Sparkles, User, Mail, GraduationCap, FileText } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const DirectApplicationModal = ({
  opportunity,
  onClose,
  onApplicationSubmitted,
}) => {
  const [applicantData, setApplicantData] = useState({
    fullName: 'Alex Morgan',
    email: 'alex.morgan@university.edu',
    university: 'State University - Computer Science',
    portfolioUrl: 'https://github.com/alexmorgan',
    coverNote: 'Excited to apply for this position. I have strong experience building web applications and collaborating in team environments.',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Execute submission callback to set status to 'Applied'
    onApplicationSubmitted(opportunity.id, 'Applied');
    setIsSubmitted(true);
  };

  if (!opportunity) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '580px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={20} color="#818cf8" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
              Direct Application Portal
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Opportunity Card Summary */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            {opportunity.type} • {opportunity.category}
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.3rem' }}>
            {opportunity.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9ca3af', fontSize: '0.88rem' }}>
            <Building size={14} color="#818cf8" />
            <span>{opportunity.organization}</span>
            {opportunity.deadline && (
              <span style={{ marginLeft: 'auto', color: '#f87171', fontWeight: 600, fontSize: '0.8rem' }}>
                Deadline: {formatDate(opportunity.deadline)}
              </span>
            )}
          </div>
        </div>

        {isSubmitted ? (
          /* Submission Confirmation Screen */
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <CheckCircle2 size={36} color="#34d399" />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
              Application Submitted! 🎉
            </h3>

            <p style={{ color: '#9ca3af', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Your application for <strong>{opportunity.title}</strong> at <strong>{opportunity.organization}</strong> has been logged.
              Status updated to <span style={{ color: '#fbbf24', fontWeight: 700 }}>Applied</span> in your Tracker pipeline.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
              {opportunity.applyUrl && opportunity.applyUrl.startsWith('http') && !opportunity.applyUrl.includes('example.com') && (
                <a
                  href={opportunity.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ textDecoration: 'none' }}
                >
                  Visit Official Employer Portal
                  <ExternalLink size={15} />
                </a>
              )}
              <button onClick={onClose} className="btn btn-primary">
                Return to CampusFlow
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.3rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  value={applicantData.fullName}
                  onChange={(e) => setApplicantData({ ...applicantData, fullName: e.target.value })}
                  className="input-field"
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.3rem' }}>
                  Student Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    value={applicantData.email}
                    onChange={(e) => setApplicantData({ ...applicantData, email: e.target.value })}
                    className="input-field"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.3rem' }}>
                  University / Major
                </label>
                <div style={{ position: 'relative' }}>
                  <GraduationCap size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    required
                    value={applicantData.university}
                    onChange={(e) => setApplicantData({ ...applicantData, university: e.target.value })}
                    className="input-field"
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.3rem' }}>
                Portfolio / GitHub / Resume Link
              </label>
              <div style={{ position: 'relative' }}>
                <FileText size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="url"
                  required
                  value={applicantData.portfolioUrl}
                  onChange={(e) => setApplicantData({ ...applicantData, portfolioUrl: e.target.value })}
                  className="input-field"
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.3rem' }}>
                Cover Statement
              </label>
              <textarea
                rows={3}
                value={applicantData.coverNote}
                onChange={(e) => setApplicantData({ ...applicantData, coverNote: e.target.value })}
                className="input-field"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Send size={16} />
                Submit Application Now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
