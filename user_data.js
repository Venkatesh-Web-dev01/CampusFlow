import { supabase } from './supabase';

// --- SAVED OPPORTUNITIES (per-student bookmarks) ---

export const fetchSavedIds = async (studentId) => {
  const { data, error } = await supabase
    .from('saved_opportunities')
    .select('opportunity_id')
    .eq('student_id', studentId);

  if (error) {
    console.error('Error fetching saved IDs:', error.message);
    return [];
  }
  return data.map((row) => row.opportunity_id);
};

export const saveOpportunity = async (studentId, opportunityId) => {
  const { error } = await supabase
    .from('saved_opportunities')
    .upsert([{ student_id: studentId, opportunity_id: opportunityId }], {
      onConflict: 'student_id,opportunity_id',
    });
  if (error) throw error;
};

export const unsaveOpportunity = async (studentId, opportunityId) => {
  const { error } = await supabase
    .from('saved_opportunities')
    .delete()
    .eq('student_id', studentId)
    .eq('opportunity_id', opportunityId);
  if (error) throw error;
};

export const toggleSaveInDb = async (studentId, opportunityId, currentSavedIds) => {
  const isSaved = currentSavedIds.includes(opportunityId);
  if (isSaved) {
    await unsaveOpportunity(studentId, opportunityId);
    return currentSavedIds.filter((id) => id !== opportunityId);
  } else {
    await saveOpportunity(studentId, opportunityId);
    return [...currentSavedIds, opportunityId];
  }
};

// --- APPLICATION STATUS (per-student, per-opportunity) ---

// Returns a map: { [opportunityId]: status }
export const fetchApplicationStatuses = async (studentId) => {
  const { data, error } = await supabase
    .from('applications')
    .select('opportunity_id, status')
    .eq('student_id', studentId);

  if (error) {
    console.error('Error fetching application statuses:', error.message);
    return {};
  }

  const statusMap = {};
  data.forEach((row) => {
    statusMap[row.opportunity_id] = row.status;
  });
  return statusMap;
};

export const upsertApplicationStatus = async (studentId, opportunityId, status) => {
  const { error } = await supabase
    .from('applications')
    .upsert(
      [{
        student_id: studentId,
        opportunity_id: opportunityId,
        status,
        updated_at: new Date().toISOString(),
      }],
      { onConflict: 'student_id,opportunity_id' }
    );
  if (error) throw error;
};
