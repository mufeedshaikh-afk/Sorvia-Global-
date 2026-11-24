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
    price: item.price !== undefined && item.price !== null ? Number(item.price) : (local && (local as any).price ? Number((local as any).price) : 3850),
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

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: 'customer' | 'admin';
  created_at?: string;
  updated_at?: string;
};

export type DatabaseAddress = {
  id: string;
  user_id: string;
  full_name: string;
  street: string;
  apartment?: string | null;
  city: string;
  state?: string | null;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at?: string;
};

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function sendPasswordResetEmail(email: string) {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/account?view=reset` : undefined,
  });
  if (error) throw error;
  return data;
}

export async function getSessionUser() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return data as Profile;
}

export async function updateProfile(userId: string, updates: { full_name?: string; phone?: string }): Promise<Profile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (error || !data) return null;
  return data as Profile;
}

export async function getAddresses(userId: string): Promise<DatabaseAddress[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as DatabaseAddress[];
}

export async function createAddress(userId: string, address: Omit<DatabaseAddress, 'id' | 'user_id' | 'created_at'>): Promise<DatabaseAddress | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('addresses')
    .insert([{ ...address, user_id: userId }])
    .select()
    .single();
  if (error || !data) return null;
  return data as DatabaseAddress;
}

export async function updateAddress(addressId: string, address: Partial<DatabaseAddress>): Promise<DatabaseAddress | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('addresses')
    .update(address)
    .eq('id', addressId)
    .select()
    .single();
  if (error || !data) return null;
  return data as DatabaseAddress;
}

export async function deleteAddress(addressId: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId);
  return !error;
}

export type DatabaseOrder = {
  id: string;
  user_id?: string | null;
  email: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  currency: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shipping_address: Record<string, any>;
  tracking_reference?: string | null;
  created_at?: string;
  updated_at?: string;
  order_items?: DatabaseOrderItem[];
};

export type DatabaseOrderItem = {
  id?: string;
  order_id: string;
  product_id?: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  created_at?: string;
};

export async function createOrder(
  order: Omit<DatabaseOrder, 'id' | 'created_at' | 'updated_at' | 'order_items'>,
  items: Array<{ product_id: string; product_name: string; quantity: number; unit_price: number }>
): Promise<DatabaseOrder | null> {
  if (!supabase) return null;

  const orderId = `SG-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

  try {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        ...order,
        id: orderId,
      }])
      .select()
      .single();

    if (orderError || !orderData) {
      console.warn('Order insert notice (will use fallback):', orderError?.message);
      return { ...order, id: orderId, order_items: items as DatabaseOrderItem[] } as DatabaseOrder;
    }

    if (items.length > 0) {
      const itemRows = items.map(item => ({
        order_id: orderId,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      await supabase.from('order_items').insert(itemRows);
    }

    return { ...orderData, order_items: items as DatabaseOrderItem[] } as DatabaseOrder;
  } catch (err) {
    console.warn('Order creation exception:', err);
    return { ...order, id: orderId, order_items: items as DatabaseOrderItem[] } as DatabaseOrder;
  }
}

export async function getOrderById(orderId: string, email?: string): Promise<DatabaseOrder | null> {
  if (!supabase) return null;

  try {
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId.trim().toUpperCase());

    if (email) {
      query = query.ilike('email', email.trim());
    }

    const { data, error } = await query.maybeSingle();
    if (error || !data) return null;
    return data as DatabaseOrder;
  } catch {
    return null;
  }
}

export async function getUserOrders(userId: string): Promise<DatabaseOrder[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as DatabaseOrder[];
  } catch {
    return [];
  }
}
