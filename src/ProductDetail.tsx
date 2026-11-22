import { useEffect, useRef, useState } from 'react';
import { products } from './catalog';
import { collections } from './collections';
import { ObjectArt } from './ObjectArt';
import { ProductCard } from './ProductCard';
import { SaveButton } from './WishlistContext';
import { QuantityControl } from './Cart';
import { useCommerce } from './CommerceContext';
import { getProductById, toStorefrontProduct, type StorefrontProduct } from './lib/supabase';

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

function ProductBuyBox({ product }: { product: StorefrontProduct }) {
  const { add } = useCommerce();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const priceDisplay = product.price !== null ? `₹${product.price.toLocaleString('en-IN')}` : '₹3,850';

  const handleAddToCart = () => {
    add(product.id, quantity);
    setAdded(true);
  };

  const handleBuyNow = () => {
    add(product.id, quantity);
    window.location.href = '/checkout';
  };

  return (
    <div className="product-buy-box">
      <div className="buy-box-price-row">
        <div>
          <div className="product-price">{priceDisplay}</div>
          <span className="price-tax-note">Inclusive of all taxes</span>
        </div>
        <span className="stock-pill in-stock">
          <span className="stock-dot" aria-hidden="true">●</span> In Stock · Dispatches in 24h
        </span>
      </div>

      <div className="buy-box-controls">
        <label className="quantity-label">
          <span>Quantity</span>
          <QuantityControl value={quantity} name={product.name} onChange={value => { setQuantity(value); setAdded(false); }} />
        </label>
        <div className="buy-box-buttons">
          <button type="button" className="button add-cart-action" onClick={handleAddToCart}>
            {added ? '✓ Added to Cart' : 'Add to Cart 🛒'}
          </button>
          <button type="button" className="button buy-now-action" onClick={handleBuyNow}>
            Buy Now · Proceed ↗
          </button>
        </div>
      </div>

      {added && (
        <div className="cart-feedback-pill" role="status">
          <span>✓ {quantity} × {product.name} added to your cart.</span>
          <a href="/cart" className="feedback-cart-link">View Cart & Checkout ↗</a>
        </div>
      )}

      <div className="trust-strip-compact">
        <div className="trust-pill"><span>✦</span> 100% Handcrafted</div>
        <div className="trust-pill"><span>✦</span> Free Express Shipping</div>
        <div className="trust-pill"><span>✦</span> 7-Day Easy Returns</div>
      </div>
    </div>
  );
}

export function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState<StorefrontProduct | null>(() => {
    const local = products.find(item => item.id === id);
    return local ? toStorefrontProduct(local) : null;
  });

  useEffect(() => {
    let mounted = true;
    getProductById(id).then(item => {
      if (mounted && item) {
        setProduct(item);
      }
    }).catch(err => {
      console.warn('Could not fetch live product:', err);
    });
    return () => { mounted = false; };
  }, [id]);

  const dialog = useRef<HTMLDialogElement>(null);
  const collection = collections.find(item => item.material === product?.material);
  const category = collections.find(item => item.category === product?.category);
  const back = browsingLink(collection?.path || '/shop');
  useEffect(() => { document.title = `${product?.name || 'Object not found'} | SoraviaGlobal`; }, [product]);

  if (!product) return <section className="section missing-collection"><div className="eyebrow">A NEW DISCOVERY AWAITS</div><h1>Object not found</h1><p>This object is not part of the current edit. Browse the Shop to discover another starting point.</p><a className="button" href="/shop">Return to Shop ↗</a></section>;
  const related = products.filter(item => item.id !== product.id && item.material === product.material).slice(0, 3);

  const shortDescription = product.description || `Individually handcrafted by master Indian artisans in ${product.material.toLowerCase()}. Designed with distinctive character, tactile warmth, and timeless presence for your living space.`;

  return <>
    <div className="detail-breadcrumb"><nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/shop">Shop</a><span aria-hidden="true">/</span><a href={collection?.path || '/shop'}>{collection?.name || product.material}</a><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span></nav></div>
    <section className="product-detail" aria-labelledby="product-title">
      <div className="detail-gallery">
        <div className="detail-photo">
          <ObjectArt kind={product.kind} productId={product.id} hero/>
          <span className="artisan-detail-mark" aria-hidden="true">SG<br/>OBJECT<br/>{product.id}</span>
        </div>
        <div className="gallery-caption">
          <span>01 / 01 · Handcrafted Artifact</span>
          <button className="text-button" onClick={() => dialog.current?.showModal()}>Enlarge photo <span aria-hidden="true">↗</span></button>
        </div>
      </div>
      <div className="detail-copy">
        <a className="detail-back" href={back}>← Back to browsing</a>
        <div className="eyebrow">AUTHENTIC INDIAN HANDICRAFTS · {product.material.toUpperCase()}</div>
        <h1 id="product-title">{product.name}</h1>
        <p className="detail-intro">{shortDescription}</p>
        <div className="detail-tags"><a href={collection?.path || '/shop'}>{product.material}</a><a href={category?.path || '/shop'}>{product.category}</a></div>
        <ProductBuyBox product={product} />
        <div className="detail-save"><SaveButton id={product.id} name={product.name}/><a className="text-button" href="/wishlist">View wishlist ↗</a></div>
        <div className="detail-accordions">
          <details><summary>Specifications & Dimensions</summary><p>{product.dimensions || 'Handcrafted proportions designed for tabletop or mantle display. Each piece carries subtle artisan variations that celebrate handmade authenticity.'}</p><dl><div><dt>Object SKU</dt><dd>{product.sku || `SG-${product.id}`}</dd></div><div><dt>Primary Material</dt><dd>{product.material}</dd></div><div><dt>Category</dt><dd>{product.category}</dd></div></dl></details>
          <details><summary>Care & Maintenance</summary><p>{product.care || 'Gently dust with a clean, dry, lint-free cotton cloth. Avoid harsh abrasive cleaners to preserve the natural antique patina over time.'}</p></details>
          <details><summary>Delivery & Easy Returns</summary><p>{product.shipping || 'Complimentary insured express delivery across India. Dispatches within 24–48 hours with door-to-door tracking.'} <a className="text-button" href="/policies/shipping">Shipping details ↗</a> <a className="text-button" href="/policies/returns">Returns policy ↗</a></p></details>
        </div>
      </div>
    </section>
    <section className="section detail-related" aria-labelledby="related-title"><div className="section-heading"><div><div className="eyebrow">CONTINUE THE STORY</div><h2 id="related-title">More in {product.material.toLowerCase()}</h2></div><a className="text-button" href={collection?.path || '/shop'}>Explore the collection ↗</a></div><div className="product-grid">{related.map(item => <ProductCard key={item.id} product={item} from={back.split('#')[0]}/>)}</div></section>
    <dialog ref={dialog} className="photo-dialog" aria-labelledby="photo-dialog-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><div className="photo-dialog-header"><h2 id="photo-dialog-title">{product.name}</h2><button autoFocus onClick={() => dialog.current?.close()} aria-label="Close enlarged photo">Close ×</button></div><div className="dialog-photo"><ObjectArt kind={product.kind} productId={product.id} hero/></div><p>Handcrafted Collection · High-resolution detail preview</p></dialog>
  </>;
}
