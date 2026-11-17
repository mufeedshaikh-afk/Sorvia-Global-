import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
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
  const currentIds = useRef(ids);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === key || event.key === null) {
        const next = readSaved();
        currentIds.current = next;
        setIds(next);
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const toggle = (id: string) => {
    const current = currentIds.current;
    const next = current.includes(id) ? current.filter(saved => saved !== id) : [...current, id];
    // Persist within the click so immediate navigation cannot race a later effect.
    try { localStorage.setItem(key, JSON.stringify(next)); setStorageError(false); }
    catch { setStorageError(true); }
    currentIds.current = next;
    setIds(next);
  };
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
