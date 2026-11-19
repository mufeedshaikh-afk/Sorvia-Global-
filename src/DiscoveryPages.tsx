import { useEffect, useState, type FormEvent } from 'react';
import { products as localCatalog } from './catalog';
import { ProductCard } from './ProductCard';
import { collections } from './collections';
import { useWishlist } from './WishlistContext';
import { getProducts, toStorefrontProduct, type StorefrontProduct } from './lib/supabase';

export function SearchPage() {
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get('q') || '');
  const [draft, setDraft] = useState(query);
  const [material, setMaterial] = useState(() => {
    const value = new URLSearchParams(location.search).get('material') || '';
    return collections.some(item => item.material === value) ? value : '';
  });
  const [catalog, setCatalog] = useState<StorefrontProduct[]>(() => localCatalog.map(toStorefrontProduct));

  useEffect(() => {
    let mounted = true;
    getProducts().then(items => {
      if (mounted && items && items.length > 0) {
        setCatalog(items);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = catalog.filter(product => (!material || product.material === material) && terms.every(term => `${product.name} ${product.material} ${product.category}`.toLowerCase().includes(term)));
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (material) params.set('material', material);
  const from = `/search${params.size ? `?${params}` : ''}`;
  useEffect(() => { history.replaceState(null, '', from); document.title = 'Search | SorviaGlobal'; }, [from]);
  const submit = (event: FormEvent) => { event.preventDefault(); setQuery(draft.trim()); };
  const clear = () => { setQuery(''); setDraft(''); setMaterial(''); };
  return <>
    <section className="discovery-intro"><nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Search</span></nav><div className="eyebrow">FIND YOUR KIND OF CHARACTER</div><h1>A new <em>discovery.</em></h1><p>Search the collection by name, material or object.</p>
      <form className="search-form" role="search" onSubmit={submit}><label htmlFor="site-search">What are you looking for?</label><div><input id="site-search" type="search" placeholder="Try brass bowl or glass vase…" value={draft} onChange={event => setDraft(event.target.value)}/><button className="button" type="submit">Search <span aria-hidden="true">↗</span></button></div></form>
      <div className="search-suggestions"><span>Explore a material:</span>{collections.filter(item => item.material).map(item => <button key={item.path} type="button" onClick={() => {setMaterial(item.material!);setQuery('');setDraft('');}} aria-pressed={material === item.material}>{item.material}</button>)}</div>
    </section>
    <section className="section discovery-results" id="browse"><div className="discovery-tools"><p role="status" aria-live="polite">{matches.length} {matches.length === 1 ? 'object' : 'objects'}{query ? ` for “${query}”` : ''}{material ? ` in ${material.toLowerCase()}` : ''}</p><label htmlFor="search-material">Material<select id="search-material" value={material} onChange={event => setMaterial(event.target.value)}><option value="">All materials</option>{collections.filter(item => item.material).map(item => <option key={item.path} value={item.material}>{item.material}</option>)}</select></label>{(query || material) && <button className="text-button" onClick={clear}>Clear search & filters</button>}</div>
      <p className="discovery-disclaimer">Catalog details, prices and availability are being prepared.</p>
      {matches.length ? <div className="product-grid">{matches.map(product => <ProductCard key={product.id} product={product} from={from}/>)}</div> : <div className="empty-results"><div className="eyebrow">TRY A DIFFERENT STARTING POINT</div><h2>No objects found</h2><p>Try fewer words, a different material, or clear your search to explore the full collection.</p><button className="button" onClick={clear}>Explore the collection ↗</button></div>}
    </section>
  </>;
}

export function WishlistPage() {
  const { ids, storageError } = useWishlist();
  const [catalog, setCatalog] = useState<StorefrontProduct[]>(() => localCatalog.map(toStorefrontProduct));

  useEffect(() => {
    let mounted = true;
    getProducts().then(items => {
      if (mounted && items && items.length > 0) {
        setCatalog(items);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const saved = ids.flatMap(id => { const product = catalog.find(item => item.id === id); return product ? [product] : []; });
  useEffect(() => { document.title = 'Wishlist | SorviaGlobal'; }, []);
  return <><section className="discovery-intro"><nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Wishlist</span></nav><div className="eyebrow">KEEP WHAT CATCHES YOUR EYE</div><h1>Your <em>favourites.</em></h1><p>A little collection of objects you would like to come back to.</p><p className="wishlist-local-note">Saved in this browser only. Your list does not sync to an account or another device. Saving an item does not reserve stock.</p></section><section className="section discovery-results" id="browse"><div className="results-summary"><p role="status" aria-live="polite">{saved.length} saved {saved.length === 1 ? 'object' : 'objects'}</p><a className="text-button" href="/shop">Continue browsing ↗</a></div>{storageError && <p className="storage-notice" role="status">Your browser cannot save favourites right now. This list will be lost when you leave or refresh the page.</p>}{saved.length ? <div className="product-grid">{saved.map(product => <ProductCard key={product.id} product={product} from="/wishlist"/>)}</div> : <div className="empty-results"><div className="empty-heart" aria-hidden="true">♡</div><h2>A space for your favourites</h2><p>Tap a heart on an object to save it here. Explore the collection and see what catches your eye.</p><a className="button" href="/shop">Explore the Shop ↗</a></div>}</section></>;
}
