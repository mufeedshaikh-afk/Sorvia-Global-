import { useEffect, useRef } from 'react';
import { products } from './catalog';
import { collections } from './collections';
import { ObjectArt } from './ObjectArt';
import { ProductCard } from './ProductCard';
import { SaveButton } from './WishlistContext';
import { AddToPreviewCart } from './Cart';

const introductions: Record<string, string> = {
  Brass: 'An exploration of warm metallic tones and expressive form, selected as a starting point for the brass collection.',
  Wood: 'An exploration of wood grain, carved details and natural character, selected as a starting point for the wooden collection.',
  Copper: 'An exploration of copper tones and decorative metalwork, selected as a starting point for the copper collection.',
  Ceramic: 'An exploration of ceramic surfaces, colour and sculptural shapes, selected as a starting point for the ceramic collection.',
  Glass: 'An exploration of light, colour and transparency, selected as a starting point for the glass collection.',
  Stone: 'An exploration of stone textures and sculptural silhouettes, selected as a starting point for the stone collection.',
};

function browsingLink(fallback: string) {
  const value = new URLSearchParams(location.search).get('from');
  if (!value) return fallback;
  try {
    const url = new URL(value, location.origin);
    const allowed = ['/shop', '/search', '/wishlist', '/cart'].includes(url.pathname) || collections.some(collection => collection.path === url.pathname);
    if (url.origin === location.origin && allowed) return `${url.pathname}${url.search}${url.pathname === '/cart' ? '' : '#browse'}`;
  } catch { /* Invalid return addresses use the material collection. */ }
  return fallback;
}

export function ProductDetail({ id }: { id: string }) {
  const product = products.find(item => item.id === id);
  const dialog = useRef<HTMLDialogElement>(null);
  const collection = collections.find(item => item.material === product?.material);
  const category = collections.find(item => item.category === product?.category);
  const back = browsingLink(collection?.path || '/shop');
  useEffect(() => { document.title = `${product?.name || 'Object not found'} | SorviaGlobal`; }, [product]);

  if (!product) return <section className="section missing-collection"><div className="eyebrow">A NEW DISCOVERY AWAITS</div><h1>Object not found</h1><p>This object is not part of the current edit. Browse the Shop to discover another starting point.</p><a className="button" href="/shop">Return to Shop ↗</a></section>;
  const related = products.filter(item => item.id !== product.id && item.material === product.material).slice(0, 3);

  return <>
    <div className="detail-breadcrumb"><nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/shop">Shop</a><span aria-hidden="true">/</span><a href={collection?.path || '/shop'}>{collection?.name || product.material}</a><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span></nav></div>
    <section className="product-detail" aria-labelledby="product-title">
      <div className="detail-gallery"><div className="detail-photo"><ObjectArt kind={product.kind} productId={product.id} hero/><span className="artisan-detail-mark" aria-hidden="true">SG<br/>OBJECT<br/>{product.id}</span></div><div className="gallery-caption"><span>01 / 01 · Collection image</span><button className="text-button" onClick={() => dialog.current?.showModal()}>Enlarge photo <span aria-hidden="true">↗</span></button></div><p className="reference-explanation">An image chosen to express the material and mood of this edit. Final product details will be confirmed with the live catalog.</p></div>
      <div className="detail-copy"><a className="detail-back" href={back}>← Back to browsing</a><div className="eyebrow">THE {product.material.toUpperCase()} COLLECTION · OBJECT {product.id}</div><h1 id="product-title">{product.name}</h1><p className="detail-intro">{introductions[product.material]}</p><p className="artisan-detail-note">A material-led study, selected for its form, finish and sense of place.</p>
        <div className="detail-tags"><a href={collection?.path || '/shop'}>{product.material}</a><a href={category?.path || '/shop'}>{product.category}</a></div>
        <div className="purchase-preview"><span className="eyebrow">THE SORVIA EDIT</span><h2>Catalog details coming soon</h2><p>Price and availability will appear here once the product is confirmed.</p><AddToPreviewCart id={product.id} name={product.name}/><span className="purchase-note">Ordering will open with the live catalog.</span></div>
        <div className="detail-save"><SaveButton id={product.id} name={product.name}/><a className="text-button" href="/wishlist">View wishlist ↗</a></div><div className="detail-accordions">
          <details open><summary>About this object</summary><p>{product.alt}. Full specifications will be added with the approved catalog.</p><dl><div><dt>Object code</dt><dd>SG-{product.id}</dd></div><div><dt>Collection</dt><dd>{product.material} · concept</dd></div><div><dt>Category</dt><dd>{product.category}</dd></div></dl></details>
          <details><summary>Dimensions & materials</summary><p>Exact materials, finish, dimensions, weight, variants and included pieces are awaiting the real product information. Material filters currently group design concepts.</p></details>
          <details><summary>Care information</summary><p>Product-specific care instructions will be supplied with the confirmed materials and finish.</p></details>
          <details><summary>Delivery & returns</summary><p>Supported destinations, shipping costs, delivery estimates and return terms will be shown once business policies and country settings are confirmed. <a className="text-button" href="/policies/shipping">Shipping information ↗</a> <a className="text-button" href="/policies/returns">Returns policy ↗</a></p></details>
        </div>
      </div>
    </section>
    <section className="section detail-related" aria-labelledby="related-title"><div className="section-heading"><div><div className="eyebrow">CONTINUE THE STORY</div><h2 id="related-title">More in {product.material.toLowerCase()}</h2></div><a className="text-button" href={collection?.path || '/shop'}>Explore the collection ↗</a></div><div className="product-grid">{related.map(item => <ProductCard key={item.id} product={item} from={back.split('#')[0]}/>)}</div></section>
    <dialog ref={dialog} className="photo-dialog" aria-labelledby="photo-dialog-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><div className="photo-dialog-header"><h2 id="photo-dialog-title">{product.name}</h2><button autoFocus onClick={() => dialog.current?.close()} aria-label="Close enlarged photo">Close ×</button></div><div className="dialog-photo"><ObjectArt kind={product.kind} productId={product.id} hero/></div><p>Collection image · Catalog details coming soon</p></dialog>
  </>;
}
