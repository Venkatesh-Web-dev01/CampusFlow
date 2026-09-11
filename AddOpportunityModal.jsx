import React, { useState } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';

export const AddOpportunityModal = ({ onClose, onAddOpportunity }) => {
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    type: 'Internship',
    category: 'Software Engineering',
    location: 'Remote',
    deadline: '',
    stipend: '',
    description: '',
    eligibility: '',
    applyUrl: '',
    tags: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.organization.trim()) newErrors.organization = 'Organization is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [formData.type, formData.category];

    let formattedUrl = formData.applyUrl.trim();
    if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    onAddOpportunity({
      ...formData,
      applyUrl: formattedUrl || 'https://careers.google.com/students',
      tags: tagsArray,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={20} color="#818cf8" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>Add New Opportunity</h2>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.35rem' }}>
              Opportunity Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Frontend Engineering Internship 2026"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
            />
            {errors.title && <span style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.2rem', display: 'block' }}>{errors.title}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.35rem' }}>
                Organization / Company *
              </label>
              <input
                type="text"
                name="organization"
                placeholder="e.g. Stripe, OpenAI, MIT"
                value={formData.organization}
                onChange={handleChange}
                className="input-field"
              />
              {errors.organization && <span style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.2rem', display: 'block' }}>{errors.organization}</span>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.35rem' }}>
                Opportunity Type
              </label>
              <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                <option value="Internship">Internship</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Workshop">Workshop</option>
                <option value="Competition">Competition</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.35rem' }}>
                Application Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="input-field"
              />
              {errors.deadline && <span style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.2rem', display: 'block' }}>{errors.deadline}</span>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.35rem' }}>
                Stipend / Prize Pool
              </label>
              <input
                type="text"
                name="stipend"
                placeholder="e.g. $5,000 / mo or $10,000 Prize"
                value={formData.stipend}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.35rem' }}>
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Brief overview of the role, event, or grant..."
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.35rem' }}>
              Eligibility Requirements
            </label>
            <input
              type="text"
              name="eligibility"
              placeholder="e.g. CS Undergrads graduating 2026/2027"
              value={formData.eligibility}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.35rem' }}>
                Application Link (URL)
              </label>
              <input
                type="url"
                name="applyUrl"
                placeholder="https://..."
                value={formData.applyUrl}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.35rem' }}>
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                name="tags"
                placeholder="React, AI, Remote, Paid"
                value={formData.tags}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <PlusCircle size={16} />
              Publish Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
