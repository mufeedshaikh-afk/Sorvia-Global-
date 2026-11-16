import { useEffect, useState } from 'react';
import { ObjectArt } from './ObjectArt';
import { products } from './catalog';
import { collections, type Collection } from './collections';


const categories = ['Decorative objects', 'Vases & vessels', 'Decorative chess'];
const materials = collections.flatMap(collection => collection.material ? [collection.material] : []);
const sorts = ['featured', 'az', 'za'];

export function Shop({ collection }: { collection?: Collection }) {
  const basePath = collection?.path || '/shop';
  const [initial] = useState(() => new URLSearchParams(location.search));
  const [query, setQuery] = useState(initial.get('q') || '');
  const [category, setCategory] = useState(collection?.category || (categories.includes(initial.get('category') || '') ? initial.get('category')! : ''));
  const [material, setMaterial] = useState(collection?.material || (materials.includes(initial.get('material') || '') ? initial.get('material')! : ''));
  const [sort, setSort] = useState(sorts.includes(initial.get('sort') || '') ? initial.get('sort')! : 'featured');
  const active = Boolean(query || (!collection?.category && category) || (!collection?.material && material) || sort !== 'featured');
  const clear = () => { setQuery(''); setCategory(collection?.category || ''); setMaterial(collection?.material || ''); setSort('featured'); };
  const results = products.filter(p => (!category || p.category === category) && (!material || p.material === material) && `${p.name} ${p.category} ${p.material}`.toLowerCase().includes(query.trim().toLowerCase()));
  if (sort !== 'featured') results.sort((a, b) => sort === 'az' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category && !collection?.category) params.set('category', category);
    if (material && !collection?.material) params.set('material', material);
    if (sort !== 'featured') params.set('sort', sort);
    history.replaceState(null, '', `${basePath}${params.size ? `?${params}` : ''}${location.hash}`);
    document.title = `${collection?.name || 'Shop'} | SorviaGlobal`;
  }, [query, category, material, sort, basePath, collection]);

  return <>
    <section className="shop-intro">
      <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span>{collection ? <><a href="/shop">Shop</a><span aria-hidden="true">/</span><span aria-current="page">{collection.name}</span></> : <span aria-current="page">Shop</span>}</nav>
      {collection ? <div className="collection-hero"><div className="collection-copy"><div className="eyebrow">{collection.eyebrow}</div><h1>{collection.name}</h1><h2>{collection.description}</h2><p>{collection.detail}</p><a className="collection-jump" href="#browse">Explore this selection <span aria-hidden="true">↓</span></a></div><div className="collection-visual"><ObjectArt kind={collection.kind}/><span className="visual-label">MATERIAL & MOOD</span></div></div> : <div className="shop-heading"><div><div className="eyebrow">A CONSIDERED COLLECTION</div><h1>Objects for <em>everyday living.</em></h1></div><p>Discover warm metals, natural textures<br/>and little details with lasting character.</p></div>}
      <p className="sample-notice"><span>DESIGN PREVIEW</span> Sample concepts with reference photographs, not our inventory. Photos may differ in design and material. Real products, prices and availability are still to come.</p>
    </section>
    {!collection && <nav className="collection-shortcuts" aria-label="Explore material collections"><span className="eyebrow">EXPLORE BY MATERIAL</span>{collections.filter(c => c.material).map(c => <a href={c.path} key={c.path}>{c.name} <span aria-hidden="true">↗</span></a>)}</nav>}
    <section className="shop-body" id="browse" aria-label="Browse sample collection">
      <aside className="shop-filters" aria-label="Product filters">
        <div className="filter-heading"><h2>Refine your selection</h2>{active && <button className="text-button" onClick={clear}>Reset all</button>}</div>
        {collection && <p className="collection-scope">Browsing {collection.name}<a href="/shop">View all sample items ↗</a></p>}
        {!collection?.category && <fieldset><legend>Category</legend>{['', ...categories].map(value => <label className="filter-option" key={value}><input type="radio" name="category" checked={category === value} onChange={() => setCategory(value)}/>{value || 'All categories'}</label>)}</fieldset>}
        {!collection?.material && <fieldset><legend>Material</legend>{['', ...materials].map(value => <label className="filter-option" key={value}><input type="radio" name="material" checked={material === value} onChange={() => setMaterial(value)}/>{value || 'All materials'}</label>)}</fieldset>}
        <p className="filter-note">A first look at the collection.<br/>Reference photos explore material and mood.</p>
      </aside>
      <div className="shop-results">
        <div className="shop-tools"><label className="search-label" htmlFor="product-search">Search the sample collection<input id="product-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try brass, vessels, chess…"/></label><label className="sort-label" htmlFor="product-sort">Sort by<select id="product-sort" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured samples</option><option value="az">Name: A–Z</option><option value="za">Name: Z–A</option></select></label></div>
        <div className="results-summary"><p role="status" aria-live="polite" aria-atomic="true">{results.length} sample {results.length === 1 ? 'item' : 'items'}{active ? ' matching your selection' : ' to explore'}</p>{active && <button className="text-button" onClick={clear}>Clear selection ×</button>}</div>
        {results.length ? <div className="product-grid">{results.map(product => <article className="product-card" key={product.id}><div className="product-art"><ObjectArt kind={product.kind} productId={product.id}/><span className="sample-tag">SAMPLE {product.id}</span></div><div className="product-meta">{product.material}<span>{product.category}</span></div><h2>{product.name}</h2><p>Product details & pricing to follow</p></article>)}</div> : <div className="empty-results"><span className="eyebrow">ROOM FOR A DIFFERENT DISCOVERY</span><h2>No samples found</h2><p>Try a different search or clear your filters to explore {collection ? 'this collection' : 'the full sample collection'}.</p><button className="button" onClick={clear}>{collection ? 'Reset this collection' : 'Show all sample items'} <span aria-hidden="true">↗</span></button></div>}
        <div className="shop-endnote"><span className="eyebrow">SELECTED WITH INTENTION</span><p>Product pages are the next part of our journey. This preview is for exploring the shop layout and browsing controls.</p></div>
      </div>
    </section>
    <section className="section related-collections" aria-labelledby="more-collections"><div className="section-heading"><div><div className="eyebrow">CONTINUE YOUR DISCOVERY</div><h2 id="more-collections">{collection ? 'A different point of view' : 'Explore by object'}</h2></div><a className="text-button" href={collection ? '/shop' : '/#collections'}>{collection ? 'Back to all items' : 'Explore materials on the homepage'} ↗</a></div><div className="collection-links">{collections.filter(c => collection ? c.path !== collection.path && Boolean(c.material) !== Boolean(collection.material) : c.category).map(c => <a href={c.path} key={c.path}><span>{c.name}</span><span aria-hidden="true">↗</span></a>)}</div></section>
  </>;
}
