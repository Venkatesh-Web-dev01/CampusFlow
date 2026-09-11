import React from 'react';
import { Compass, BookmarkCheck, PlusCircle, Sparkles, Layers, LogIn, LogOut, ShieldCheck, GraduationCap, User } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, savedCount, trackedCount, onOpenAddModal, user, profile, onSignIn, onSignOut }) => {
  const isAdmin = profile?.role === 'admin';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      marginBottom: '2rem'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '1rem' }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flexShrink: 0 }}
          onClick={() => setActiveTab(isAdmin ? 'admin' : 'discover')}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#ffffff' }}>
              Campus<span style={{ color: '#818cf8' }}>Flow</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600, marginTop: '-3px' }}>
              Team Pixel-End
            </span>
          </div>
        </div>

        {/* Nav Tabs — role-sensitive */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.35rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {isAdmin ? (
            <button onClick={() => setActiveTab('admin')}
              className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', border: 'none' }}>
              <ShieldCheck size={16} /> Admin Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => setActiveTab('discover')}
                className={`btn ${activeTab === 'discover' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', border: 'none' }}>
                <Compass size={16} /> Discover
              </button>
              <button onClick={() => setActiveTab('tracker')}
                className={`btn ${activeTab === 'tracker' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', border: 'none', position: 'relative' }}>
                <Layers size={16} /> Application Tracker
                {trackedCount > 0 && (
                  <span style={{
                    background: '#10b981', color: '#ffffff', fontSize: '0.7rem',
                    fontWeight: 700, borderRadius: '10px', padding: '2px 7px', marginLeft: '4px'
                  }}>{trackedCount}</span>
                )}
              </button>
            </>
          )}
        </nav>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {!isAdmin && user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9ca3af', fontSize: '0.82rem', fontWeight: 500 }}>
              <BookmarkCheck size={17} color="#818cf8" />
              <span>Saved: <strong style={{ color: '#fff' }}>{savedCount}</strong></span>
            </div>
          )}

          {(isAdmin || user) && (
            <button onClick={onOpenAddModal} className="btn btn-primary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem' }}>
              <PlusCircle size={16} /> Add Opportunity
            </button>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.35rem 0.75rem', borderRadius: '20px',
                background: isAdmin ? 'rgba(99,102,241,0.12)' : 'rgba(16,185,129,0.1)',
                border: isAdmin ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(16,185,129,0.25)',
                color: isAdmin ? '#818cf8' : '#34d399', fontSize: '0.8rem', fontWeight: 700
              }}>
                {isAdmin ? <ShieldCheck size={14} /> : <GraduationCap size={14} />}
                <span>{profile?.name || user.email?.split('@')[0]}</span>
              </div>
              <button onClick={onSignOut} className="btn btn-secondary" style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}>
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          ) : (
            <button onClick={onSignIn} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <LogIn size={16} /> Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
