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
  availability: 'Unconfirmed' | 'In stock' | 'Out of stock' | string;
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

export type StorefrontProduct = {
  id: string;
  sku: string;
  name: string;
  category: string;
  material: string;
  kind: string;
  image: string;
  alt: string;
  description: string;
  price: number | null;
  currency: string;
  availability: 'Unconfirmed' | 'In stock' | 'Out of stock' | string;
  dimensions?: string | null;
  weight?: string | null;
  finish?: string | null;
  care?: string | null;
  contents?: string | null;
  variants?: string | null;
  shipping?: string | null;
  collection_paths?: string[];
  image_url?: string;
  image_alt?: string;
  is_featured?: boolean;
};

export function toStorefrontProduct(item: any): StorefrontProduct {
  const local = localCatalog.find(p => p.id === item.id);
  const image = item.image || (item.image_url ? item.image_url.replace(/^\/images\/reference\//, '').replace(/\.jpg$/, '') : (local?.image || ''));
  const kind = item.kind || local?.kind || (item.category === 'Decorative chess' ? 'chess' : item.material?.toLowerCase() || 'brass');
  return {
    id: String(item.id).padStart(2, '0'),
    sku: item.sku || `SG-${String(item.id).padStart(2, '0')}`,
    name: item.name,
    category: item.category,
    material: item.material,
    kind,
    image,
    alt: item.image_alt || item.alt || local?.alt || item.name,
    description: item.description || (local ? `${local.alt}. An artisanal study selected for form, material and finish.` : ''),
    price: item.price !== undefined && item.price !== null ? Number(item.price) : null,
    currency: item.currency || 'INR',
    availability: item.availability || 'Unconfirmed',
    dimensions: item.dimensions || null,
    weight: item.weight || null,
    finish: item.finish || null,
    care: item.care || null,
    contents: item.contents || null,
    variants: item.variants || null,
    shipping: item.shipping || null,
    collection_paths: item.collection_paths || (local ? [`/collections/${local.kind}`] : [`/collections/${kind}`]),
    image_url: item.image_url || (local ? `/images/reference/${local.image}.jpg` : `/images/reference/${image}.jpg`),
    image_alt: item.image_alt || item.alt || local?.alt || item.name,
    is_featured: Boolean(item.is_featured),
  };
}

/**
 * Fetch all products from Supabase, falling back to local catalog if unconfigured or on error.
 */
export async function getProducts(): Promise<StorefrontProduct[]> {
  if (!supabase) {
    return localCatalog.map(toStorefrontProduct);
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn('Falling back to local catalog:', error?.message);
      return localCatalog.map(toStorefrontProduct);
    }

    return data.map(toStorefrontProduct);
  } catch (err) {
    console.warn('Supabase fetch exception, using local catalog:', err);
    return localCatalog.map(toStorefrontProduct);
  }
}

/**
 * Fetch a single product by ID from Supabase.
 */
export async function getProductById(id: string): Promise<StorefrontProduct | null> {
  const local = localCatalog.find(p => p.id === id);

  if (!supabase) {
    return local ? toStorefrontProduct(local) : null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return local ? toStorefrontProduct(local) : null;
    }

    return toStorefrontProduct(data);
  } catch {
    return local ? toStorefrontProduct(local) : null;
  }
}
