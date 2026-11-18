import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { products as localCatalog } from '../catalog';

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

/**
 * Fetch all products from Supabase, falling back to local catalog if unconfigured or on error.
 */
export async function getProducts(): Promise<SupabaseProduct[]> {
  if (!supabase) {
    return localCatalog.map(p => ({
      id: p.id,
      sku: `SG-${p.id}`,
      name: p.name,
      category: p.category,
      material: p.material,
      description: `${p.alt}. An artisanal study selected for form, material and finish.`,
      price: null,
      currency: 'INR',
      availability: 'Unconfirmed',
      image_url: `/images/reference/${p.image}.jpg`,
      image_alt: p.alt,
      collection_paths: [`/collections/${p.kind}`]
    }));
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Falling back to local catalog:', error?.message);
      return localCatalog.map(p => ({
        id: p.id,
        sku: `SG-${p.id}`,
        name: p.name,
        category: p.category,
        material: p.material,
        description: `${p.alt}. An artisanal study selected for form, material and finish.`,
        price: null,
        currency: 'INR',
        availability: 'Unconfirmed',
        image_url: `/images/reference/${p.image}.jpg`,
        image_alt: p.alt,
        collection_paths: [`/collections/${p.kind}`]
      }));
    }

    return data as SupabaseProduct[];
  } catch (err) {
    console.warn('Supabase fetch exception, using local catalog:', err);
    return localCatalog.map(p => ({
      id: p.id,
      sku: `SG-${p.id}`,
      name: p.name,
      category: p.category,
      material: p.material,
      description: `${p.alt}. An artisanal study selected for form, material and finish.`,
      price: null,
      currency: 'INR',
      availability: 'Unconfirmed',
      image_url: `/images/reference/${p.image}.jpg`,
      image_alt: p.alt,
      collection_paths: [`/collections/${p.kind}`]
    }));
  }
}

/**
 * Fetch a single product by ID from Supabase.
 */
export async function getProductById(id: string): Promise<SupabaseProduct | null> {
  if (!supabase) {
    const local = localCatalog.find(p => p.id === id);
    if (!local) return null;
    return {
      id: local.id,
      sku: `SG-${local.id}`,
      name: local.name,
      category: local.category,
      material: local.material,
      description: `${local.alt}. An artisanal study selected for form, material and finish.`,
      price: null,
      currency: 'INR',
      availability: 'Unconfirmed',
      image_url: `/images/reference/${local.image}.jpg`,
      image_alt: local.alt,
      collection_paths: [`/collections/${local.kind}`]
    };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      const local = localCatalog.find(p => p.id === id);
      if (!local) return null;
      return {
        id: local.id,
        sku: `SG-${local.id}`,
        name: local.name,
        category: local.category,
        material: local.material,
        description: `${local.alt}. An artisanal study selected for form, material and finish.`,
        price: null,
        currency: 'INR',
        availability: 'Unconfirmed',
        image_url: `/images/reference/${local.image}.jpg`,
        image_alt: local.alt,
        collection_paths: [`/collections/${local.kind}`]
      };
    }

    return data as SupabaseProduct;
  } catch {
    return null;
  }
}
