import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { products } from './catalog';

const key = 'sorvia-wishlist-v1';
function readSaved(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && products.some(product => product.id === id)))] : [];
  } catch { return []; }
}
const WishlistContext = createContext<{ ids: string[]; toggle: (id: string) => void; storageError: boolean } | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState(readSaved);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(ids)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [ids]);
  useEffect(() => {
    const sync = (event: StorageEvent) => { if (event.key === key || event.key === null) setIds(readSaved()); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const toggle = (id: string) => setIds(current => current.includes(id) ? current.filter(saved => saved !== id) : [...current, id]);
  return <WishlistContext.Provider value={{ ids, toggle, storageError }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error('WishlistProvider is required');
  return value;
}

export function SaveButton({ id, name, compact = false }: { id: string; name: string; compact?: boolean }) {
  const { ids, toggle, storageError } = useWishlist();
  const saved = ids.includes(id);
  return <><button type="button" className={`save-button ${compact ? 'save-compact' : ''} ${saved ? 'is-saved' : ''}`} aria-pressed={saved} aria-label={`${saved ? 'Remove' : 'Save'} ${name} ${saved ? 'from' : 'to'} wishlist`} title={saved ? 'Remove from wishlist' : 'Save to wishlist'} onClick={() => toggle(id)}><span aria-hidden="true">{saved ? '♥' : '♡'}</span>{!compact && <span>{saved ? 'Saved to wishlist' : 'Save to wishlist'}</span>}</button>{!compact && storageError && <p className="storage-notice" role="status">Your browser cannot save favourites right now. They will be lost when you leave or refresh this page.</p>}</>;
}
