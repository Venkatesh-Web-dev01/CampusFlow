import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles, Eye, EyeOff, ShieldCheck, GraduationCap } from 'lucide-react';
import { signIn, signUp } from '../services/auth';

export const AuthModal = ({ onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'student' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await signIn({ email: formData.email, password: formData.password });
      } else {
        await signUp({ email: formData.email, password: formData.password, name: formData.name, role: formData.role });
      }
      onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '440px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
              {mode === 'login' ? 'Sign In to CampusFlow' : 'Create Account'}
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
            width: '34px', height: '34px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#9ca3af', cursor: 'pointer'
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px', marginBottom: '1.5rem' }}>
          {['login', 'signup'].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              style={{
                flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontSize: '0.88rem', fontWeight: 700,
                background: mode === m ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                color: mode === m ? '#fff' : '#9ca3af', transition: 'all 0.2s'
              }}>
              {m === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem',
            color: '#f87171', fontSize: '0.85rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.3rem' }}>Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange}
                placeholder="Alex Morgan" className="input-field" />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.3rem' }}>Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange}
              placeholder="you@university.edu" className="input-field" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.3rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} name="password" required
                value={formData.password} onChange={handleChange}
                placeholder="Minimum 6 characters" className="input-field"
                style={{ paddingRight: '2.8rem' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.5rem' }}>Account Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { value: 'student', icon: <GraduationCap size={18} />, label: 'Student', sub: 'Browse & Apply' },
                  { value: 'admin', icon: <ShieldCheck size={18} />, label: 'Admin', sub: 'Publish Opps' },
                ].map(({ value, icon, label, sub }) => {
                  const isActive = formData.role === value;
                  return (
                    <button key={value} type="button" onClick={() => setFormData({ ...formData, role: value })}
                      style={{
                        padding: '0.75rem', borderRadius: '10px', cursor: 'pointer',
                        border: isActive ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                        background: isActive ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                        color: isActive ? '#818cf8' : '#9ca3af', textAlign: 'left', transition: 'all 0.2s'
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem' }}>
                        {icon} {label}
                      </div>
                      <div style={{ fontSize: '0.75rem', marginTop: '0.2rem', opacity: 0.7 }}>{sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ marginTop: '0.5rem', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Please wait...' : (mode === 'login' ? <><LogIn size={16} /> Sign In</> : <><UserPlus size={16} /> Create Account</>)}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#6b7280' }}>
          {mode === 'login'
            ? <span>Don't have an account? <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}>Create one</button></span>
            : <span>Already have an account? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}>Sign in</button></span>
          }
        </div>
      </div>
    </div>
  );
};
