import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { products } from './catalog';

export const currencies = ['INR', 'USD', 'GBP', 'EUR'] as const;
export const markets = [
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'OTHER', name: 'Other country', currency: 'USD' },
] as const;
export type Region = { country: string; currency: typeof currencies[number] };
export type CartLine = { id: string; quantity: number };
const cartKey = 'sorvia-cart-v1';
const regionKey = 'sorvia-region-v1';
export const maxQuantity = 99; // Preview UI limit, not a stock figure.

export function validateCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.filter((line): line is CartLine => {
    if (!line || typeof line !== 'object') return false;
    const { id, quantity } = line as CartLine;
    if (typeof id !== 'string' || seen.has(id) || !products.some(p => p.id === id) || !Number.isInteger(quantity) || quantity < 1 || quantity > maxQuantity) return false;
    seen.add(id);
    return true;
  }).map(({ id, quantity }) => ({ id, quantity }));
}
export function validateRegion(value: unknown): Region | null {
  if (!value || typeof value !== 'object') return null;
  const { country, currency } = value as Region;
  return markets.some(m => m.code === country) && currencies.includes(currency) ? { country, currency } : null;
}
function read(key: string): unknown {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}
const CommerceContext = createContext<{
  lines: CartLine[]; region: Region | null; count: number; cartStorageError: boolean; regionStorageError: boolean;
  add: (id: string, quantity: number) => void; setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void; setRegion: (region: Region) => void;
} | null>(null);

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [lines, updateLines] = useState(() => validateCart(read(cartKey)));
  const [region, updateRegion] = useState(() => validateRegion(read(regionKey)));
  const current = useRef(lines);
  const [cartStorageError, setCartStorageError] = useState(false);
  const [regionStorageError, setRegionStorageError] = useState(false);
  const persist = (key: string, value: unknown, error: (failed: boolean) => void) => {
    try { localStorage.setItem(key, JSON.stringify(value)); error(false); } catch { error(true); }
  };
  const writeLines = (next: CartLine[]) => {
    // Save in the action so following a cart link immediately cannot race an effect.
    current.current = next;
    persist(cartKey, next, setCartStorageError);
    updateLines(next);
  };
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) return;
      if (event.key === cartKey || event.key === null) {
        const next = validateCart(read(cartKey)); current.current = next; updateLines(next);
      }
      if (event.key === regionKey || event.key === null) updateRegion(validateRegion(read(regionKey)));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const add = (id: string, quantity: number) => {
    if (!products.some(p => p.id === id) || !Number.isInteger(quantity) || quantity < 1 || quantity > maxQuantity) return;
    const existing = current.current.find(line => line.id === id);
    writeLines(existing ? current.current.map(line => line.id === id ? { id, quantity: Math.min(maxQuantity, line.quantity + quantity) } : line) : [...current.current, { id, quantity }]);
  };
  const setQuantity = (id: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > maxQuantity) return;
    writeLines(current.current.map(line => line.id === id ? { id, quantity } : line));
  };
  const remove = (id: string) => writeLines(current.current.filter(line => line.id !== id));
  const setRegion = (value: Region) => {
    const next = validateRegion(value);
    if (next) { persist(regionKey, next, setRegionStorageError); updateRegion(next); }
  };
  return <CommerceContext.Provider value={{ lines, region, count: lines.reduce((total, line) => total + line.quantity, 0), cartStorageError, regionStorageError, add, setQuantity, remove, setRegion }}>{children}</CommerceContext.Provider>;
}
export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) throw new Error('CommerceProvider is required');
  return context;
}
