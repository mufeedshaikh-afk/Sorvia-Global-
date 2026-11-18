import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-ref.supabase.co'
);

export const supabase: SupabaseClient | null = (isSupabaseConfigured && supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type SupabaseProduct = {
  id: string;
  sku: string;
  name: string;
  category: string;
  material: string;
  description: string;
  price: number | null;
  currency: string;
  availability: 'Unconfirmed' | 'In stock' | 'Out of stock';
  dimensions?: string | null;
  weight?: string | null;
  finish?: string | null;
  care?: string | null;
  contents?: string | null;
  variants?: string | null;
  shipping?: string | null;
  collection_paths: string[];
  image_url: string;
  image_alt: string;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
};
