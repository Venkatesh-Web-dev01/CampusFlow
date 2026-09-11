// LocalStorage service for saving opportunities and tracking application statuses

const KEYS = {
  SAVED_IDS: 'campusflow_saved_ids',
  STATUSES: 'campusflow_app_statuses',
  CUSTOM_OPPS: 'campusflow_custom_opps',
};

// --- Saved Opportunities ---
export const getSavedIds = () => {
  try {
    const data = localStorage.getItem(KEYS.SAVED_IDS);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading saved IDs from localStorage', err);
    return [];
  }
};

export const toggleSaveId = (id) => {
  const current = getSavedIds();
  const exists = current.includes(id);
  const updated = exists ? current.filter((item) => item !== id) : [...current, id];
  try {
    localStorage.setItem(KEYS.SAVED_IDS, JSON.stringify(updated));
  } catch (err) {
    console.error('Error writing saved IDs to localStorage', err);
  }
  return updated;
};

// --- Application Statuses ---
// Status values: 'Saved' | 'Applied' | 'Interviewing' | 'Offered' | 'Rejected'
export const getApplicationStatuses = () => {
  try {
    const data = localStorage.getItem(KEYS.STATUSES);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error('Error reading app statuses from localStorage', err);
    return {};
  }
};

export const updateApplicationStatus = (id, newStatus) => {
  const current = getApplicationStatuses();
  const updated = { ...current, [id]: newStatus };
  try {
    localStorage.setItem(KEYS.STATUSES, JSON.stringify(updated));
  } catch (err) {
    console.error('Error writing app statuses to localStorage', err);
  }
  return updated;
};

// --- User Added Custom Opportunities ---
export const getCustomOpportunities = () => {
  try {
    const data = localStorage.getItem(KEYS.CUSTOM_OPPS);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading custom opps from localStorage', err);
    return [];
  }
};

export const addCustomOpportunity = (opportunity) => {
  const current = getCustomOpportunities();
  const newOpp = {
    ...opportunity,
    id: `custom-${Date.now()}`,
    isCustom: true,
  };
  const updated = [newOpp, ...current];
  try {
    localStorage.setItem(KEYS.CUSTOM_OPPS, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving custom opportunity to localStorage', err);
  }
  return newOpp;
};
