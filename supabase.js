import { createClient } from '@supabase/supabase-js';

// Environment credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://demo-campusflow.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
