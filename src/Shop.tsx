import { useEffect, useState } from 'react';
import { ObjectArt } from './ObjectArt';
import { products as localCatalog } from './catalog';
import { ProductCard } from './ProductCard';
import { collections, type Collection } from './collections';
import { getProducts, toStorefrontProduct, type StorefrontProduct } from './lib/supabase';


const categories = ['Decorative objects', 'Vases & vessels', 'Decorative chess'];
const materials = collections.flatMap(collection => collection.material ? [collection.material] : []);
const sorts = ['featured', 'az', 'za'];

export function Shop({ collection }: { collection?: Collection }) {
  const basePath = collection?.path || '/shop';
  const [initial] = useState(() => new URLSearchParams(location.search));
  const luxury = !collection && initial.get('design') !== 'classic';
  const warm = luxury && initial.get('design') !== 'modern';
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState(initial.get('q') || '');
  const [category, setCategory] = useState(collection?.category || (categories.includes(initial.get('category') || '') ? initial.get('category')! : ''));
  const [material, setMaterial] = useState(collection?.material || (materials.includes(initial.get('material') || '') ? initial.get('material')! : ''));
  const [sort, setSort] = useState(sorts.includes(initial.get('sort') || '') ? initial.get('sort')! : 'featured');
  const [items, setItems] = useState<StorefrontProduct[]>(() => localCatalog.map(toStorefrontProduct));

  useEffect(() => {
    let mounted = true;
    getProducts().then(data => {
      if (mounted && data && data.length > 0) {
        setItems(data);
      }
    }).catch(err => {
      console.warn('Could not load live products in Shop:', err);
    });
    return () => { mounted = false; };
  }, []);

  const active = Boolean(query || (!collection?.category && category) || (!collection?.material && material) || sort !== 'featured');
  const clear = () => { setQuery(''); setCategory(collection?.category || ''); setMaterial(collection?.material || ''); setSort('featured'); };
  const results = items.filter(p => (!category || p.category === category) && (!material || p.material === material) && `${p.name} ${p.category} ${p.material}`.toLowerCase().includes(query.trim().toLowerCase()));
  if (sort !== 'featured') results.sort((a, b) => sort === 'az' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  const params = new URLSearchParams();
  if (!collection && !luxury) params.set('design', 'classic');
  if (!collection && luxury && !warm) params.set('design', 'modern');
  if (query) params.set('q', query);
  if (category && !collection?.category) params.set('category', category);
  if (material && !collection?.material) params.set('material', material);
  if (sort !== 'featured') params.set('sort', sort);
  const browsingPath = `${basePath}${params.size ? `?${params}` : ''}`;
  useEffect(() => {
    history.replaceState(null, '', `${browsingPath}${location.hash}`);
    document.title = `${collection?.name || 'Shop'} | SorviaGlobal`;
  }, [browsingPath, collection]);

  return <div className={luxury ? 'shop-luxury' : 'shop-classic'}>
    <section className="shop-intro">
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span>{collection ? <><a href="/shop">Shop</a><span aria-hidden="true">/</span><span aria-current="page">{collection.name}</span></> : <span aria-current="page">Shop</span>}</nav>
      {collection ? <div className="collection-hero"><div className="collection-copy"><div className="eyebrow">{collection.eyebrow}</div><h1>{collection.name}</h1><h2>{collection.description}</h2><p>{collection.detail}</p><a className="collection-jump" href="#browse">Explore this selection <span aria-hidden="true">↓</span></a></div><div className="collection-visual"><ObjectArt kind={collection.kind}/><span className="visual-label">MATERIAL & MOOD</span></div></div> : luxury ? <div className="luxury-intro"><div className="luxury-intro-copy"><div className="eyebrow"><span className="small-line"/> THE SORVIA EDIT · EST. IN MATERIAL</div><h1>Made for the<br/><em>art of living.</em></h1><p>Hand-finished forms, enduring materials and distinctive details — chosen to bring warmth and character to everyday spaces.</p><a className="luxury-explore" href="#browse">Explore the artisan edit <span aria-hidden="true">↓</span></a><div className="artisan-hero-meta"><span>CURATED OBJECTS</span><span>SMALL-BATCH SPIRIT</span><span>MADE TO BE KEPT</span></div></div><div className="luxury-intro-photo"><ObjectArt kind="brass"/><span className="luxury-photo-heading">BRASS · A STUDY IN PATINA</span><span className="artisan-photo-mark" aria-hidden="true">SG<br/>01</span></div></div> : <div className="shop-heading"><div><div className="eyebrow">A CONSIDERED COLLECTION</div><h1>Objects for <em>everyday living.</em></h1></div><p>Discover warm metals, natural textures<br/>and little details with lasting character.</p></div>}
      <p className="sample-notice"><span>THE CURATED EDIT</span> A considered study of material, form and mood. Product details, prices and availability will be confirmed with the live catalog.</p>
    </section>
    {!collection && <nav className="collection-shortcuts" aria-label="Explore material collections"><span className="eyebrow">EXPLORE BY MATERIAL</span>{collections.filter(c => c.material).map(c => <a href={c.path} key={c.path}>{c.name} <span aria-hidden="true">↗</span></a>)}</nav>}
    <section className="shop-body" id="browse" aria-label="Browse curated collection">
      {luxury && <div className="luxury-browse-heading"><div><div className="eyebrow">SELECTED WITH INTENTION</div><h2>The collection</h2></div><button className="filter-toggle" aria-expanded={filtersOpen} aria-controls="shop-filters" onClick={() => setFiltersOpen(!filtersOpen)}>Refine selection <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span></button></div>}
      <aside id="shop-filters" className="shop-filters" aria-label="Product filters" hidden={luxury && !filtersOpen}>
        <div className="filter-heading"><h2>Refine your selection</h2>{active && <button className="text-button" onClick={clear}>Reset all</button>}</div>
        {collection && <p className="collection-scope">Browsing {collection.name}<a href="/shop">View the full edit ↗</a></p>}
        {!collection?.category && <fieldset><legend>Category</legend>{['', ...categories].map(value => <label className="filter-option" key={value}><input type="radio" name="category" checked={category === value} onChange={() => setCategory(value)}/>{value || 'All categories'}</label>)}</fieldset>}
        {!collection?.material && <fieldset><legend>Material</legend>{['', ...materials].map(value => <label className="filter-option" key={value}><input type="radio" name="material" checked={material === value} onChange={() => setMaterial(value)}/>{value || 'All materials'}</label>)}</fieldset>}
        <p className="filter-note">An introduction to the collection.<br/>Explore material and mood at your own pace.</p>
      </aside>
      <div className="shop-results">
        <div className="shop-tools"><label className="search-label" htmlFor="product-search">Search the curated edit<input id="product-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try brass, vessels, chess…"/></label><label className="sort-label" htmlFor="product-sort">Sort by<select id="product-sort" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured objects</option><option value="az">Name: A–Z</option><option value="za">Name: Z–A</option></select></label></div>
        <div className="results-summary"><p role="status" aria-live="polite" aria-atomic="true">{results.length} {results.length === 1 ? 'object' : 'objects'}{active ? ' matching your selection' : ' to explore'}</p>{active && <button className="text-button" onClick={clear}>Clear selection ×</button>}</div>
        {results.length ? <div className="product-grid">{results.map(product => <ProductCard key={product.id} product={product} from={browsingPath}/>)}</div> : <div className="empty-results"><span className="eyebrow">ROOM FOR A DIFFERENT DISCOVERY</span><h2>No objects found</h2><p>Try a different search or clear your filters to explore {collection ? 'this collection' : 'the full curated edit'}.</p><button className="button" onClick={clear}>{collection ? 'Reset this collection' : 'Show all objects'} <span aria-hidden="true">↗</span></button></div>}
        <div className="shop-endnote"><span className="eyebrow">SELECTED WITH INTENTION</span><p>Explore the material stories behind each object. Product availability will be added with the live catalog.</p></div>
      </div>
    </section>
    <section className="section related-collections" aria-labelledby="more-collections"><div className="section-heading"><div><div className="eyebrow">CONTINUE YOUR DISCOVERY</div><h2 id="more-collections">{collection ? 'A different point of view' : 'Explore by object'}</h2></div><a className="text-button" href={collection ? '/shop' : '/#collections'}>{collection ? 'Back to all items' : 'Explore materials on the homepage'} ↗</a></div><div className="collection-links">{collections.filter(c => collection ? c.path !== collection.path && Boolean(c.material) !== Boolean(collection.material) : c.category).map(c => <a href={c.path} key={c.path}><span>{c.name}</span><span aria-hidden="true">↗</span></a>)}</div></section>
  </div>;
}
