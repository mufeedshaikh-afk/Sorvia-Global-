import { useEffect, useId, useRef, useState } from 'react';
import { currencies, markets, maxQuantity, useCommerce, type Region } from './CommerceContext';
import { products } from './catalog';
import { ObjectArt } from './ObjectArt';

export function RegionControl() {
  const { region, setRegion, regionStorageError } = useCommerce();
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [country, selectCountry] = useState(region?.country || 'IN');
  const [currency, selectCurrency] = useState<Region['currency']>(region?.currency || 'INR');
  const selected = markets.find(m => m.code === (region?.country || 'IN'));
  const suggestion = markets.find(m => m.code !== 'OTHER' && navigator.language.toUpperCase().split('-').at(-1) === m.code);
  const open = () => { selectCountry(region?.country || 'IN'); selectCurrency(region?.currency || 'INR'); dialog.current?.showModal(); };
  return <>
    <button className="region-trigger" onClick={open}>{region ? `${selected?.name || 'India'} · ${region.currency}` : 'India · INR'} <span aria-hidden="true">⌄</span></button>
    <dialog ref={dialog} className="commerce-dialog region-dialog" aria-labelledby={`${id}-title`} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
      <div className="commerce-dialog-heading"><h2 id={`${id}-title`}>Choose region & currency</h2><button className="dialog-close" onClick={() => dialog.current?.close()} aria-label="Close region selection">×</button></div>
      <p>Select your destination country and preferred currency. Prices across the catalog and cart will update instantly.</p>
      <form onSubmit={e => { e.preventDefault(); setRegion({ country, currency }); dialog.current?.close(); }}>
        <label htmlFor={`${id}-country`}>Country / region<select id={`${id}-country`} required value={country} onChange={e => { const value = e.target.value; selectCountry(value); selectCurrency(markets.find(m => m.code === value)?.currency || 'INR'); }}><option value="" disabled>Select a country</option>{markets.map(m => <option value={m.code} key={m.code}>{m.name}</option>)}</select></label>
        {!region && suggestion && <p className="region-suggestion">Your browser language suggests {suggestion.name}. <button type="button" className="text-button" onClick={() => { selectCountry(suggestion.code); selectCurrency(suggestion.currency); }}>Use this suggestion</button></p>}
        <label htmlFor={`${id}-currency`}>Display currency<select id={`${id}-currency`} value={currency} onChange={e => selectCurrency(e.target.value as Region['currency'])}>{currencies.map(code => <option key={code} value={code}>{({ INR: '₹', USD: '$', GBP: '£', EUR: '€' })[code]} {code}</option>)}</select></label>
        {country === 'OTHER' && <p className="region-warning" role="status">International delivery is available with insured DHL express dispatch.</p>}
        <button type="submit" className="button">Save & update currency <span aria-hidden="true">→</span></button>
      </form>
    </dialog>
    {regionStorageError && <span className="storage-notice" role="status">Region preference could not be saved in this browser.</span>}
  </>;
}

export function QuantityControl({ value, name, onChange }: { value: number; name: string; onChange: (value: number) => void }) {
  return <div className="quantity-control" role="group" aria-label={`Quantity for ${name}`}>
    <button type="button" aria-label={`Decrease quantity for ${name}`} disabled={value <= 1} onClick={() => onChange(value - 1)}>−</button>
    <select aria-label={`Quantity for ${name}`} value={value} onChange={e => onChange(Number(e.target.value))}>{Array.from({ length: maxQuantity }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}</select>
    <button type="button" aria-label={`Increase quantity for ${name}`} disabled={value >= maxQuantity} onClick={() => onChange(value + 1)}>+</button>
  </div>;
}

function CartItems({ compact = false }: { compact?: boolean }) {
  const { lines, setQuantity, remove, formatPrice } = useCommerce();
  const [message, setMessage] = useState('');
  const feedback = useRef<HTMLParagraphElement>(null);
  return <>
    <p className="cart-feedback" role="status" aria-live="polite" tabIndex={-1} ref={feedback}>{message}</p>
    <ul className={`cart-items ${compact ? 'cart-items-compact' : ''}`}>{lines.map(line => {
      const product = products.find(p => p.id === line.id)!;
      const unitPrice = (product as { price?: number | null })?.price ?? 3850;
      return <li className="cart-line" key={line.id}>
        <div className="cart-image"><ObjectArt kind={product.kind} productId={product.id} productHref={`/product/${product.id}?from=%2Fcart`}/></div>
        <div className="cart-line-copy"><span className="eyebrow">OBJECT {product.id} · {product.material}</span><h2><a href={`/product/${product.id}?from=%2Fcart`}>{product.name}</a></h2><p>{product.category}</p>
          <QuantityControl value={line.quantity} name={product.name} onChange={quantity => { setQuantity(line.id, quantity); setMessage(`${product.name}: quantity ${quantity}.`); }}/>
          <button className="text-button" onClick={() => { remove(line.id); setMessage(`${product.name} removed from your selection.`); feedback.current?.focus(); }} aria-label={`Remove ${product.name} from cart`}>Remove</button>
        </div>
        {!compact && <div className="cart-line-price"><span>Unit price</span><strong>{formatPrice(unitPrice)}</strong><span>Line total</span><strong>{formatPrice(unitPrice * line.quantity)}</strong></div>}
      </li>;
    })}</ul>
  </>;
}

export function MiniCart() {
  const { count, lines, formatPrice, cartStorageError } = useCommerce();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const subtotal = lines.reduce((total, line) => {
    const product = products.find(p => p.id === line.id);
    return total + ((product as { price?: number | null })?.price ?? 3850) * line.quantity;
  }, 0);

  return <>
    <button className="cart-trigger" onClick={() => dialog.current?.showModal()} aria-label={`Open cart, ${count} ${count === 1 ? 'object' : 'objects'}`}>Cart <span className="cart-count">{count}</span></button>
    <dialog className="commerce-dialog mini-cart" ref={dialog} aria-labelledby={titleId} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
      <div className="commerce-dialog-heading"><h2 id={titleId}>Your Cart <span>({count})</span></h2><button className="dialog-close" aria-label="Close cart" onClick={() => dialog.current?.close()}>×</button></div>
      <CartItems compact/>
      {!count ? <p className="cart-empty-msg">Your cart is empty. Explore our handcrafted collections to add pieces.</p> : (
        <div className="mini-cart-subtotal">
          <div className="subtotal-row"><span>Estimated Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
        </div>
      )}
      {cartStorageError && <p className="storage-notice" role="status">This cart could not be saved. It will be lost when you leave or refresh.</p>}
      <div className="mini-cart-actions">
        <a className="button" href="/cart">View Full Cart ↗</a>
        {count > 0 && <a className="button checkout-action-btn" href="/checkout">Checkout ➔</a>}
      </div>
    </dialog>
  </>;
}

export function AddToPreviewCart({ id, name }: { id: string; name: string }) {
  const { add, lines, cartStorageError } = useCommerce();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const existing = lines.find(line => line.id === id)?.quantity || 0;
  const atLimit = existing >= maxQuantity;
  return <div className="add-preview-cart"><QuantityControl value={quantity} name={name} onChange={value => { setQuantity(value); setAdded(false); }}/>
    <button className="button" disabled={atLimit} onClick={() => { add(id, quantity); setAdded(true); }}>Add to Cart <span aria-hidden="true">+</span></button>
    <p className="add-cart-feedback" role="status">{added ? `✓ ${name} added to your cart.` : atLimit ? 'Maximum limit reached.' : ''}</p>
    <a className="text-button" href="/cart">View cart ↗</a>
    {cartStorageError && <p className="storage-notice" role="status">This cart could not be saved. It will be lost when you leave or refresh.</p>}
  </div>;
}

export function CartPage() {
  const { count, region, lines, formatPrice, cartStorageError } = useCommerce();
  useEffect(() => { document.title = 'Cart | SoraviaGlobal'; }, []);

  const subtotal = lines.reduce((total, line) => {
    const product = products.find(p => p.id === line.id);
    return total + ((product as { price?: number | null })?.price ?? 3850) * line.quantity;
  }, 0);

  return <section className="cart-page" aria-labelledby="cart-title">
    <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Cart</span></nav>
    <div className="cart-heading"><div className="eyebrow">YOUR SELECTION</div><h1 id="cart-title">A little closer <em>to home.</em></h1><p>Your selection · {count} {count === 1 ? 'object' : 'objects'}</p></div>
    {cartStorageError && <p className="storage-notice" role="status">This cart could not be saved. It will be lost when you leave or refresh.</p>}
    <div className="cart-layout"><div className="cart-selection"><CartItems/>{!count && <div className="cart-empty"><span aria-hidden="true">◇</span><h2>Your cart is waiting</h2><p>Discover an object you like and add it from its product page.</p><a className="button" href="/shop">Explore the Shop <span aria-hidden="true">↗</span></a></div>}{count > 0 && <a className="text-button" href="/shop">← Continue shopping</a>}</div>
      <aside className="cart-summary" aria-labelledby="cart-summary-title">
        <div className="eyebrow">AT A GLANCE</div>
        <h2 id="cart-summary-title">Your summary</h2>
        <RegionControl/>
        <dl>
          <div><dt>Objects</dt><dd>{count}</dd></div>
          <div><dt>Currency</dt><dd>{region?.currency || 'INR'}</dd></div>
          <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
          <div><dt>Express Shipping</dt><dd>Free</dd></div>
          <div className="cart-total"><dt>Total</dt><dd>{formatPrice(subtotal)}</dd></div>
        </dl>
        {count > 0 ? (
          <a className="button checkout-preview-link" href="/checkout">Proceed to Checkout <span aria-hidden="true">→</span></a>
        ) : (
          <a className="button" href="/shop">Explore Collections <span aria-hidden="true">→</span></a>
        )}
      </aside>
    </div>
  </section>;
}
