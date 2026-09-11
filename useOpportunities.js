import { useState, useEffect, useMemo } from 'react';
import { fetchOpportunities, createOpportunity } from '../services/opportunities';
import { fetchSavedIds, toggleSaveInDb, fetchApplicationStatuses, upsertApplicationStatus } from '../services/user_data';
import { isSupabaseConfigured } from '../services/supabase';

// localStorage fallback keys (used when no user logged in / Supabase not configured)
const LS_SAVED = 'campusflow_saved_ids';
const LS_STATUSES = 'campusflow_app_statuses';

const lsGetSaved = () => {
  try { return JSON.parse(localStorage.getItem(LS_SAVED)) || []; } catch { return []; }
};
const lsSetSaved = (ids) => localStorage.setItem(LS_SAVED, JSON.stringify(ids));
const lsGetStatuses = () => {
  try { return JSON.parse(localStorage.getItem(LS_STATUSES)) || {}; } catch { return {}; }
};
const lsSetStatuses = (s) => localStorage.setItem(LS_STATUSES, JSON.stringify(s));

export function useOpportunities(user) {
  const [opportunities, setOpportunities] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentId = user?.id || null;
  const useCloud = isSupabaseConfigured && !!studentId;

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const opps = await fetchOpportunities();
      setOpportunities(opps);

      if (useCloud) {
        const [ids, stats] = await Promise.all([
          fetchSavedIds(studentId),
          fetchApplicationStatuses(studentId),
        ]);
        setSavedIds(ids);
        setStatuses(stats);
      } else {
        setSavedIds(lsGetSaved());
        setStatuses(lsGetStatuses());
      }
    } catch (err) {
      console.error('Data load error:', err);
      setError(err.message || 'Failed to load opportunities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    loadData();
  }, [studentId]);

  // Toggle save a bookmark
  const handleToggleSave = async (opportunityId) => {
    if (useCloud) {
      const updated = await toggleSaveInDb(studentId, opportunityId, savedIds);
      setSavedIds(updated);
    } else {
      const isSaved = savedIds.includes(opportunityId);
      const updated = isSaved
        ? savedIds.filter((id) => id !== opportunityId)
        : [...savedIds, opportunityId];
      setSavedIds(updated);
      lsSetSaved(updated);
    }
  };

  // Update application pipeline status
  const handleStatusChange = async (opportunityId, newStatus) => {
    if (useCloud) {
      await upsertApplicationStatus(studentId, opportunityId, newStatus);
      setStatuses((prev) => ({ ...prev, [opportunityId]: newStatus }));
      // Also auto-save if not already saved
      if (!savedIds.includes(opportunityId)) {
        const updated = [...savedIds, opportunityId];
        setSavedIds(updated);
        try { await toggleSaveInDb(studentId, opportunityId, savedIds); } catch {}
      }
    } else {
      const updated = { ...statuses, [opportunityId]: newStatus };
      setStatuses(updated);
      lsSetStatuses(updated);
      // Also auto-save locally
      if (!savedIds.includes(opportunityId)) {
        const updatedSaved = [...savedIds, opportunityId];
        setSavedIds(updatedSaved);
        lsSetSaved(updatedSaved);
      }
    }
  };

  // Add an opportunity (admin only — server enforces via RLS)
  const handleAddOpportunity = async (formData) => {
    if (useCloud && studentId) {
      const created = await createOpportunity(formData, studentId);
      setOpportunities((prev) => [created, ...prev]);
      return created;
    } else {
      // Local fallback for demo mode
      const local = {
        ...formData,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
        applyUrl: formData.applyUrl || 'https://campusflow.app',
      };
      setOpportunities((prev) => [local, ...prev]);
      return local;
    }
  };

  const trackedCount = useMemo(() => {
    return opportunities.filter(
      (opp) => savedIds.includes(opp.id) || (statuses[opp.id] && statuses[opp.id] !== 'Saved')
    ).length;
  }, [opportunities, savedIds, statuses]);

  return {
    opportunities,
    savedIds,
    statuses,
    loading,
    error,
    refetch: loadData,
    trackedCount,
    handleToggleSave,
    handleStatusChange,
    handleAddOpportunity,
  };
}
