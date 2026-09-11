import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Discover } from './pages/Discover';
import { Tracker } from './pages/Tracker';
import { AdminDashboard } from './pages/AdminDashboard';
import { OpportunityModal } from './components/OpportunityModal';
import { AddOpportunityModal } from './components/AddOpportunityModal';
import { DirectApplicationModal } from './components/DirectApplicationModal';
import { AuthModal } from './components/AuthModal';
import { useOpportunities } from './hooks/useOpportunities';
import { onAuthStateChange, getProfile, signOut } from './services/auth';

export function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Listen to Supabase auth state
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        try {
          const prof = await getProfile(session.user.id);
          setProfile(prof);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = profile?.role === 'admin';

  // Opportunity data — pass user so hook knows whether to use Supabase vs localStorage
  const {
    opportunities,
    savedIds,
    statuses,
    loading,
    error,
    refetch,
    trackedCount,
    handleToggleSave,
    handleStatusChange,
    handleAddOpportunity,
  } = useOpportunities(user);

  // UI state
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('deadline-asc');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [applyModalOpportunity, setApplyModalOpportunity] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // When user becomes admin, switch to admin tab
  useEffect(() => {
    if (isAdmin) setActiveTab('admin');
    else if (activeTab === 'admin') setActiveTab('discover');
  }, [isAdmin]);

  // Filter + Sort
  const filteredAndSortedOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        if (selectedCategory !== 'All' && opp.type !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            opp.title?.toLowerCase().includes(q) ||
            opp.organization?.toLowerCase().includes(q) ||
            opp.description?.toLowerCase().includes(q) ||
            opp.category?.toLowerCase().includes(q) ||
            opp.tags?.some((t) => t.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline-asc') return new Date(a.deadline) - new Date(b.deadline);
        if (sortBy === 'deadline-desc') return new Date(b.deadline) - new Date(a.deadline);
        if (sortBy === 'title-asc') return a.title?.localeCompare(b.title);
        return 0;
      });
  }, [opportunities, searchQuery, selectedCategory, sortBy]);

  const handleSignOut = async () => {
    try { await signOut(); } catch {}
    setUser(null);
    setProfile(null);
    setActiveTab('discover');
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: '#9ca3af' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p>Loading CampusFlow...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedIds.length}
        trackedCount={trackedCount}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        user={user}
        profile={profile}
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
      />

      <main style={{ flex: 1 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#9ca3af' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
            <p>Loading opportunities...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
              <h3 style={{ color: '#f87171', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Unable to Load Data
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{error}</p>
              <button onClick={refetch} className="btn btn-primary">
                Retry Connection
              </button>
            </div>
          </div>
        ) : activeTab === 'admin' && isAdmin ? (
          <AdminDashboard
            opportunities={opportunities}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        ) : activeTab === 'tracker' ? (
          <Tracker
            opportunities={opportunities}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            statuses={statuses}
            onStatusChange={handleStatusChange}
            onViewDetails={(opp) => setSelectedOpportunity(opp)}
            onSwitchToDiscover={() => setActiveTab('discover')}
          />
        ) : (
          <Discover
            opportunities={filteredAndSortedOpportunities}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            statuses={statuses}
            onStatusChange={handleStatusChange}
            onViewDetails={(opp) => setSelectedOpportunity(opp)}
          />
        )}
      </main>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '2rem 0', textAlign: 'center', color: '#6b7280', fontSize: '0.85rem' }}>
        <div className="container">
          <p>CampusFlow &copy; 2026 | Multi-User Cloud Platform | Built for 12-Hour Frontend Hackathon by <strong>Team Pixel-End</strong></p>
        </div>
      </footer>

      {/* Modals */}
      {selectedOpportunity && (
        <OpportunityModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          isSaved={savedIds.includes(selectedOpportunity.id)}
          onToggleSave={handleToggleSave}
          status={statuses[selectedOpportunity.id] || 'Saved'}
          onStatusChange={handleStatusChange}
          onOpenApplyModal={(opp) => { setSelectedOpportunity(null); setApplyModalOpportunity(opp); }}
        />
      )}

      {applyModalOpportunity && (
        <DirectApplicationModal
          opportunity={applyModalOpportunity}
          onClose={() => setApplyModalOpportunity(null)}
          onApplicationSubmitted={(id, status) => handleStatusChange(id, status)}
        />
      )}

      {isAddModalOpen && (
        <AddOpportunityModal
          onClose={() => setIsAddModalOpen(false)}
          onAddOpportunity={async (data) => {
            await handleAddOpportunity(data);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}

export default App;
