import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export interface Land {
  id: string;
  title: string;
  location: string;
  size: string;
  description: string;
  owner_name: string;
  image_url?: string;
  created_at: string;
}

export interface FraudReport {
  id: string;
  name: string;
  issue: string;
  description: string;
  created_at: string;
}
