import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Article {
  id: string;
  title_tamil: string;
  title_english: string;
  content_tamil: Array<{ type: string; value: string }>;
  content_english: Array<{ type: string; value: string }>;
  theme: string;
  created_at: string;
  updated_at: string;
}
