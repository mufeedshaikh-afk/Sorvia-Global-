import { useEffect, useState } from 'react';
import { ObjectArt } from './ObjectArt';

const products = [
  { id: '01', name: 'Sculptural brass vessels', category: 'Decorative objects', material: 'Brass', kind: 'brass' },
  { id: '02', name: 'Carved wooden accents', category: 'Decorative objects', material: 'Wood', kind: 'wood' },
  { id: '03', name: 'Warm copper vessels', category: 'Vases & vessels', material: 'Copper', kind: 'copper' },
  { id: '04', name: 'Classic wooden chess set', category: 'Decorative chess', material: 'Wood', kind: 'chess' },
  { id: '05', name: 'Brass statement vase', category: 'Vases & vessels', material: 'Brass', kind: 'brass' },
  { id: '06', name: 'Natural wooden vessels', category: 'Vases & vessels', material: 'Wood', kind: 'wood' },
  { id: '07', name: 'Copper tabletop accents', category: 'Decorative objects', material: 'Copper', kind: 'copper' },
  { id: '08', name: 'Brass decorative chess', category: 'Decorative chess', material: 'Brass', kind: 'chess' },
];
const categories = ['Decorative objects', 'Vases & vessels', 'Decorative chess'];
const materials = ['Brass', 'Copper', 'Wood'];
const sorts = ['featured', 'az', 'za'];

export function Shop() {
  const [initial] = useState(() => new URLSearchParams(location.search));
  const [query, setQuery] = useState(initial.get('q') || '');
  const [category, setCategory] = useState(categories.includes(initial.get('category') || '') ? initial.get('category')! : '');
  const [material, setMaterial] = useState(materials.includes(initial.get('material') || '') ? initial.get('material')! : '');
  const [sort, setSort] = useState(sorts.includes(initial.get('sort') || '') ? initial.get('sort')! : 'featured');
  const active = Boolean(query || category || material || sort !== 'featured');
  const clear = () => { setQuery(''); setCategory(''); setMaterial(''); setSort('featured'); };
  const results = products.filter(p => (!category || p.category === category) && (!material || p.material === material) && `${p.name} ${p.category} ${p.material}`.toLowerCase().includes(query.trim().toLowerCase()));
  if (sort !== 'featured') results.sort((a, b) => sort === 'az' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (material) params.set('material', material);
    if (sort !== 'featured') params.set('sort', sort);
    history.replaceState(null, '', `/shop${params.size ? `?${params}` : ''}`);
  }, [query, category, material, sort]);

  return <>
    <section className="shop-intro">
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Shop</span></nav>
      <div className="shop-heading"><div><div className="eyebrow">A CONSIDERED COLLECTION</div><h1>Objects for <em>everyday living.</em></h1></div><p>Discover warm metals, natural textures<br/>and little details with lasting character.</p></div>
      <p className="sample-notice"><span>DESIGN PREVIEW</span> Sample items and concept illustrations only. Real products, prices and availability are still to come.</p>
    </section>
    <section className="shop-body" aria-label="Browse sample collection">
      <aside className="shop-filters" aria-label="Product filters">
        <div className="filter-heading"><h2>Refine your selection</h2>{active && <button className="text-button" onClick={clear}>Reset all</button>}</div>
        <fieldset><legend>Category</legend>{['', ...categories].map(value => <label className="filter-option" key={value}><input type="radio" name="category" checked={category === value} onChange={() => setCategory(value)}/>{value || 'All categories'}</label>)}</fieldset>
        <fieldset><legend>Material</legend>{['', ...materials].map(value => <label className="filter-option" key={value}><input type="radio" name="material" checked={material === value} onChange={() => setMaterial(value)}/>{value || 'All materials'}</label>)}</fieldset>
        <p className="filter-note">A first look at the collection.<br/>Each illustration explores a material and mood.</p>
      </aside>
      <div className="shop-results">
        <div className="shop-tools"><label className="search-label" htmlFor="product-search">Search the sample collection<input id="product-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try brass, vessels, chess…"/></label><label className="sort-label" htmlFor="product-sort">Sort by<select id="product-sort" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured samples</option><option value="az">Name: A–Z</option><option value="za">Name: Z–A</option></select></label></div>
        <div className="results-summary"><p role="status" aria-live="polite" aria-atomic="true">{results.length} sample {results.length === 1 ? 'item' : 'items'}{active ? ' matching your selection' : ' to explore'}</p>{active && <button className="text-button" onClick={clear}>Clear selection ×</button>}</div>
        {results.length ? <div className="product-grid">{results.map(product => <article className="product-card" key={product.id}><div className="product-art"><ObjectArt kind={product.kind}/><span className="sample-tag">SAMPLE {product.id}</span></div><div className="product-meta">{product.material}<span>{product.category}</span></div><h2>{product.name}</h2><p>Product details & pricing to follow</p></article>)}</div> : <div className="empty-results"><span className="eyebrow">ROOM FOR A DIFFERENT DISCOVERY</span><h2>No samples found</h2><p>Try a different search or clear your filters to explore the full sample collection.</p><button className="button" onClick={clear}>Show all sample items <span aria-hidden="true">↗</span></button></div>}
        <div className="shop-endnote"><span className="eyebrow">SELECTED WITH INTENTION</span><p>Product pages are the next part of our journey. This preview is for exploring the shop layout and browsing controls.</p></div>
      </div>
    </section>
  </>;
}
