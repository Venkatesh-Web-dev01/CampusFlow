import { supabase, isSupabaseConfigured } from './supabase';
import dbData from '../../db.json';

// Normalize opportunity row (handles both Supabase row shape & db.json shape)
export const normalizeOpportunity = (row) => ({
  id: row.id,
  title: row.title,
  organization: row.organization,
  type: row.type,
  category: row.category || row.type,
  location: row.location || 'Remote',
  deadline: row.deadline,
  stipend: row.stipend || row.stipend_or_prize || 'N/A',
  description: row.description,
  eligibility: row.eligibility,
  applyUrl: row.applyUrl || row.application_link || 'https://careers.google.com/students',
  tags: row.tags || [],
  createdBy: row.created_by || 'admin',
  createdAt: row.created_at || new Date().toISOString(),
});

// Fetch all opportunities (students see all; ordered by deadline)
export const fetchOpportunities = async () => {
  if (!isSupabaseConfigured) {
    const list = dbData?.opportunities || [];
    return list.map(normalizeOpportunity);
  }
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('deadline', { ascending: true });

    if (error) throw error;
    return data.map(normalizeOpportunity);
  } catch (err) {
    console.info('Supabase fetch failed, falling back to local dataset:', err.message);
    const list = dbData?.opportunities || [];
    return list.map(normalizeOpportunity);
  }
};

// Create an opportunity (admin only — RLS enforces this server-side)
export const createOpportunity = async (formData, adminId) => {
  const { data, error } = await supabase
    .from('opportunities')
    .insert([{
      title: formData.title,
      organization: formData.organization,
      type: formData.type,
      category: formData.category || formData.type,
      location: formData.location || 'Remote',
      deadline: formData.deadline,
      stipend_or_prize: formData.stipend,
      description: formData.description,
      eligibility: formData.eligibility,
      application_link: formData.applyUrl || 'https://campusflow.app',
      tags: Array.isArray(formData.tags) ? formData.tags : (formData.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      created_by: adminId,
    }])
    .select()
    .single();

  if (error) throw error;
  return normalizeOpportunity(data);
};
