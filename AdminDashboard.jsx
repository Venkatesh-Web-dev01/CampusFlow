import React, { useState } from 'react';
import { ShieldCheck, PlusCircle, BarChart3, Globe, Clock, Trash2, AlertCircle } from 'lucide-react';
import { getDeadlineInfo, formatDate, TYPE_STYLES } from '../utils/formatters';

export const AdminDashboard = ({ opportunities, onOpenAddModal, onDeleteOpportunity }) => {
  const [selectedType, setSelectedType] = useState('All');

  const typeOptions = ['All', 'Internship', 'Hackathon', 'Scholarship', 'Workshop', 'Competition'];

  const filtered = opportunities.filter((opp) =>
    selectedType === 'All' ? true : opp.type === selectedType
  );

  const counts = {
    total: opportunities.length,
    internship: opportunities.filter((o) => o.type === 'Internship').length,
    hackathon: opportunities.filter((o) => o.type === 'Hackathon').length,
    scholarship: opportunities.filter((o) => o.type === 'Scholarship').length,
    workshop: opportunities.filter((o) => o.type === 'Workshop').length,
    competition: opportunities.filter((o) => o.type === 'Competition').length,
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Admin Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={28} color="#818cf8" />
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>Admin Dashboard</h1>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
          Manage and publish opportunities to all CampusFlow students across every device.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Published', value: counts.total, color: '#818cf8', icon: <Globe size={18} /> },
          { label: 'Internships', value: counts.internship, color: '#818cf8', icon: <BarChart3 size={18} /> },
          { label: 'Hackathons', value: counts.hackathon, color: '#f472b6', icon: <BarChart3 size={18} /> },
          { label: 'Scholarships', value: counts.scholarship, color: '#34d399', icon: <BarChart3 size={18} /> },
          { label: 'Workshops', value: counts.workshop, color: '#fbbf24', icon: <BarChart3 size={18} /> },
          { label: 'Competitions', value: counts.competition, color: '#c084fc', icon: <BarChart3 size={18} /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="glass-card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color, fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              {icon} {label.toUpperCase()}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Publish New Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {typeOptions.map((type) => (
            <button key={type} onClick={() => setSelectedType(type)}
              style={{
                padding: '0.4rem 0.9rem', borderRadius: '20px', border: 'none', cursor: 'pointer',
                fontSize: '0.82rem', fontWeight: 600,
                background: selectedType === type ? '#6366f1' : 'rgba(255,255,255,0.05)',
                color: selectedType === type ? '#fff' : '#9ca3af', transition: 'all 0.2s'
              }}>
              {type}
            </button>
          ))}
        </div>
        <button onClick={onOpenAddModal} className="btn btn-primary">
          <PlusCircle size={16} /> Publish New Opportunity
        </button>
      </div>

      {/* Published Opportunities Table */}
      {filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertCircle size={32} color="#818cf8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 700 }}>No opportunities published yet</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginTop: '0.5rem' }}>
            Click "Publish New Opportunity" to add the first one.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((opp) => {
            const deadlineInfo = getDeadlineInfo(opp.deadline);
            const typeStyle = TYPE_STYLES[opp.type] || TYPE_STYLES.Internship;

            return (
              <div key={opp.id} className="glass-card" style={{ padding: '1.1rem 1.4rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{
                  background: typeStyle.bg, color: typeStyle.color, border: `1px solid ${typeStyle.border}`,
                  padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                  textTransform: 'uppercase', flexShrink: 0
                }}>
                  {opp.type}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#f3f4f6', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {opp.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#818cf8', marginTop: '0.1rem' }}>{opp.organization}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600,
                  color: deadlineInfo.isUrgent ? '#f87171' : '#9ca3af', flexShrink: 0 }}>
                  <Clock size={14} />
                  {formatDate(opp.deadline)}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#34d399', flexShrink: 0 }}>
                  ✓ Published
                </div>
                <a href={opp.applyUrl} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.78rem', color: '#818cf8', flexShrink: 0, textDecoration: 'none', borderBottom: '1px solid rgba(129,140,248,0.3)' }}>
                  View Link ↗
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
