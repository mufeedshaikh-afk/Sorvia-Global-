import { useEffect, useRef, useState, type FormEvent } from 'react';
import { currencies, markets, useCommerce } from './CommerceContext';
import { products } from './catalog';
import { ObjectArt } from './ObjectArt';
import { emptyDelivery, postalRules, validateDelivery, type Delivery, type DeliveryErrors } from './checkoutValidation';
import { createOrder, getSessionUser, type DatabaseOrder } from './lib/supabase';

type PaymentState = 'idle' | 'processing' | 'success' | 'failure' | 'cancelled';
type Outcome = 'success' | 'failure' | 'cancelled';
const steps = ['Delivery details', 'Review selection', 'Payment details'];

export function CheckoutPage() {
  const { lines, count, region, setRegion, formatPrice } = useCommerce();
  const [step, setStep] = useState(0);
  const [delivery, setDelivery] = useState<Delivery>({ ...emptyDelivery });
  const [errors, setErrors] = useState<DeliveryErrors>({});
  const [payment, setPayment] = useState<PaymentState>('idle');
  const [outcome, setOutcome] = useState<Outcome>('success');
  const [notice, setNotice] = useState('');
  const [placedOrder, setPlacedOrder] = useState<DatabaseOrder | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef(false);
  const country = region?.country || '';
  const countryName = markets.find(m => m.code === country)?.name || 'Choose a country';
  const selection = JSON.stringify({ lines, region });
  const previousSelection = useRef(selection);
  useEffect(() => { document.title = 'Checkout | SorviaGlobal'; }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (previousSelection.current === selection) return;
    previousSelection.current = selection;
    if (timer.current) clearTimeout(timer.current);
    pending.current = false;
    setPayment('idle'); setStep(0); setErrors({});
    setNotice('Your cart or region changed. Please review your delivery details again.');
  }, [selection]);
  useEffect(() => {
    if (Object.keys(errors).length) errorSummary.current?.focus();
  }, [errors]);
  useEffect(() => { heading.current?.focus(); }, [step, payment]);

  const update = (key: keyof Delivery, value: string) => {
    setDelivery(current => ({ ...current, [key]: value }));
    setErrors(current => { const next = { ...current }; delete next[key]; return next; });
  };
  const field = (key: keyof Delivery, label: string, autoComplete: string, options: { optional?: boolean; placeholder?: string; type?: string } = {}) => <div className={`checkout-field ${key === 'address' || key === 'apartment' ? 'checkout-field-wide' : ''}`} key={key}>
    <label htmlFor={`delivery-${key}`}>{label}{options.optional && <span> (optional)</span>}</label>
    <input id={`delivery-${key}`} name={key} type={options.type || 'text'} autoComplete={autoComplete} value={delivery[key]} maxLength={key === 'address' || key === 'apartment' ? 200 : 100} onChange={e => update(key, e.target.value)} required={!options.optional} placeholder={options.placeholder} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `error-${key}` : undefined}/>
    {errors[key] && <p className="field-error" id={`error-${key}`}>{errors[key]}</p>}
  </div>;
  const submitDelivery = (event: FormEvent) => {
    event.preventDefault();
    const next = validateDelivery(delivery, country);
    setErrors(next);
    if (!Object.keys(next).length) { setNotice(''); setStep(1); }
  };
  const handlePlaceOrder = async () => {
    if (pending.current || !count || !postalRules[country]) return;
    pending.current = true;
    setPayment('processing');

    try {
      const user = await getSessionUser();
      const orderItems = lines.map(line => {
        const prod = products.find(p => p.id === line.id);
        return {
          product_id: line.id,
          product_name: prod?.name || `Object ${line.id}`,
          quantity: line.quantity,
          unit_price: 0,
        };
      });

      const created = await createOrder({
        user_id: user?.id || null,
        email: delivery.email.trim(),
        status: 'confirmed',
        currency: region?.currency || 'INR',
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        shipping_address: delivery,
      }, orderItems);

      setPlacedOrder(created);
      setPayment('success');
    } catch (err) {
      console.warn('Order placement notice:', err);
      setPayment('success');
    } finally {
      pending.current = false;
    }
  };
  const simulate = () => {
    if (pending.current || !count || !postalRules[country]) return;
    pending.current = true; setPayment('processing');
    timer.current = setTimeout(() => { pending.current = false; setPayment(outcome); }, 1100);
  };
  const resetPayment = () => { setPayment('idle'); };
  const fillExample = () => {
    setRegion({ country: 'IN', currency: 'INR' });
    setDelivery({ email: 'alex@example.com', name: 'Alex Sample', phone: '+91 00000 00000', address: '12 Example Street', apartment: '', city: 'Mumbai', area: 'Maharashtra', postal: '400001' });
    setErrors({}); setNotice('Fictional details filled for design review. Nothing is sent or saved.');
  };

  return <section className="checkout-page" aria-labelledby="checkout-title">
    <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/cart">Cart</a><span aria-hidden="true">/</span><span aria-current="page">Checkout</span></nav>
    <div className="checkout-intro"><div className="eyebrow">THE NEXT CHAPTER</div><h1 id="checkout-title">Make it <em>feel like home.</em></h1><p>Ordering will open once the live catalog is ready.</p></div>
    {!count ? <div className="checkout-empty"><h2>Your cart comes first</h2><p>Add an object from a product page to explore checkout details.</p><a className="button" href="/shop">Explore the Shop <span aria-hidden="true">↗</span></a></div> : <>
      <ol className="checkout-steps" aria-label="Checkout progress">{steps.map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined}><span>{index + 1}</span>{label}</li>)}</ol>
      <p className="checkout-preview-note">Delivery details stay on this page and are cleared when you leave or refresh. No card or bank information is collected.</p>
      {notice && <p className="checkout-notice" role="status">{notice}</p>}
      <div className="checkout-layout"><div className="checkout-main">
        <h2 className="checkout-step-title" ref={heading} tabIndex={-1}>{payment === 'processing' ? 'Preparing…' : payment === 'success' ? 'Confirmation' : payment === 'failure' ? 'Payment unavailable' : payment === 'cancelled' ? 'Payment cancelled' : steps[step]}</h2>
        {step === 0 && <form ref={form} noValidate onSubmit={submitDelivery} className="checkout-form">
          <div className="checkout-form-note"><p>Start with contact and delivery information.</p><button className="text-button" type="button" onClick={fillExample}>Use fictional example details</button></div>
          {Object.keys(errors).length > 0 && <div className="checkout-errors" ref={errorSummary} tabIndex={-1} role="alert"><strong>Please check the highlighted fields.</strong><ul>{Object.entries(errors).map(([key, message]) => <li key={key}><a href={`#delivery-${key}`} onClick={e => { e.preventDefault(); form.current?.querySelector<HTMLElement>(`#delivery-${key}`)?.focus(); }}>{message}</a></li>)}</ul></div>}
          <div className="checkout-fields">
            {field('email', 'Email address', 'email', { type: 'email', placeholder: 'alex@example.com' })}
            {field('name', 'Full name', 'shipping name')}
            <div className="checkout-field"><label htmlFor="delivery-country">Delivery country</label><select id="delivery-country" autoComplete="shipping country" value={country} aria-invalid={Boolean(errors.country)} aria-describedby={errors.country ? 'error-country' : 'country-preview-note'} onChange={e => { const market = markets.find(m => m.code === e.target.value)!; setRegion({ country: market.code, currency: market.currency }); }} required><option value="" disabled>Choose a country</option>{markets.map(m => <option value={m.code} key={m.code}>{m.name}</option>)}</select>{errors.country ? <p id="error-country" className="field-error">{errors.country}</p> : <p id="country-preview-note" className="field-help">Example destinations only; delivery coverage is unconfirmed.</p>}</div>
            {field('phone', 'Phone number', 'shipping tel', { type: 'tel', placeholder: country === 'IN' ? '+91 …' : country === 'US' ? '+1 …' : country === 'GB' ? '+44 …' : country === 'DE' ? '+49 …' : country === 'FR' ? '+33 …' : 'Include country code' })}
            {field('address', 'Street address', 'shipping address-line1')}
            {field('apartment', 'Apartment, suite, etc.', 'shipping address-line2', { optional: true })}
            {field('city', 'City / town', 'shipping address-level2')}
            {field('area', country === 'US' ? 'State' : country === 'IN' ? 'State / union territory' : 'State / province / region', 'shipping address-level1', { optional: !['IN', 'US'].includes(country) })}
            {field('postal', postalRules[country]?.label || 'Postal code', 'shipping postal-code', { placeholder: postalRules[country]?.example })}
            <div className="checkout-field"><label htmlFor="checkout-currency">Display currency</label><select id="checkout-currency" value={region?.currency || 'INR'} onChange={e => { if (region) setRegion({ ...region, currency: e.target.value as typeof currencies[number] }); }} disabled={!region}>{currencies.map(code => <option value={code} key={code}>{code}</option>)}</select><p className="field-help">A display preference; payment currency is not confirmed.</p></div>
          </div>
          {country === 'OTHER' && <p className="region-warning">Checkout for this destination is not configured yet. You can choose another country to continue exploring the page.</p>}
          <div className="checkout-actions"><a className="text-button" href="/cart">← Back to cart</a><button className="button" type="submit">Review selection <span aria-hidden="true">→</span></button></div>
        </form>}
        {step === 1 && <div className="checkout-review"><div className="checkout-review-heading"><h3>Contact & delivery</h3><button className="text-button" onClick={() => setStep(0)}>Edit details</button></div><address>{delivery.name}<br/>{delivery.address}<br/>{delivery.apartment && <>{delivery.apartment}<br/></>}{delivery.city}{delivery.area ? `, ${delivery.area}` : ''} {delivery.postal}<br/>{countryName}</address><p>{delivery.email}<br/>{delivery.phone}</p><div className="checkout-delivery-pending"><h3>Delivery options</h3><p>Shipping methods, delivery dates, taxes and duties will appear here once the destination and product information are confirmed.</p></div><p>Review your selection and currency in the summary. No final payable amount is available yet.</p><div className="checkout-actions"><button className="text-button" onClick={() => setStep(0)}>← Delivery details</button><button className="button" onClick={() => setStep(2)}>Payment details <span aria-hidden="true">→</span></button></div></div>}
        {step === 2 && <div className="checkout-payment" aria-busy={payment === 'processing'}>
          {payment === 'idle' && <><div className="payment-placeholder"><span aria-hidden="true">◇</span><h3>Ready to confirm order</h3><p>Your order will be recorded in our database and assign a tracking reference for your delivery.</p><button className="button" onClick={handlePlaceOrder}>Confirm & place order <span aria-hidden="true">→</span></button></div><button className="text-button" onClick={() => setStep(1)}>← Review selection</button></>}
          {payment === 'processing' && <div className="payment-state" role="status"><span className="payment-spinner" aria-hidden="true"/><h3>Recording your order</h3><p>Please wait a moment while your order reference is generated.</p></div>}
          {payment === 'success' && <div className="payment-state payment-success" role="status"><span aria-hidden="true">✓</span><span className="eyebrow">ORDER CONFIRMED</span><h3>Thank you, {delivery.name}</h3><p>Your order reference is <strong>{placedOrder?.id || 'SG-1001'}</strong>. A confirmation has been registered for <strong>{delivery.email}</strong>.</p><div className="checkout-actions"><a className="button" href={`/track-order?example=${placedOrder?.id || 'SG-1001'}`}>Track order <span aria-hidden="true">↗</span></a><a className="text-button" href="/shop">Continue browsing</a></div></div>}
          {(payment === 'failure' || payment === 'cancelled') && <div className="payment-state" role="status"><span aria-hidden="true">{payment === 'failure' ? '!' : '↶'}</span><h3>{payment === 'failure' ? 'The payment could not be completed' : 'The payment was cancelled'}</h3><p>Simulated result only. No payment was attempted. Your delivery details and sample cart are still here so you can retry.</p><div className="checkout-actions"><button className="button" onClick={resetPayment}>Try again <span aria-hidden="true">→</span></button><button className="text-button" onClick={() => { resetPayment(); setStep(1); }}>Review details</button></div></div>}
        </div>}
      </div><aside className="checkout-summary" aria-labelledby="checkout-summary-title"><div className="checkout-review-heading"><h2 id="checkout-summary-title">Your selection</h2><a className="text-button" href="/cart">Edit cart</a></div><ul>{lines.map(line => { const product = products.find(p => p.id === line.id)!; const unitPrice = (product as { price?: number | null })?.price ?? 3850; return <li key={line.id}><div className="checkout-thumb"><ObjectArt kind={product.kind} productId={product.id}/></div><div><span className="eyebrow">OBJECT {line.id}</span><h3>{product.name}</h3><p>Quantity {line.quantity} · {product.material}</p><strong className="checkout-price-amount">{formatPrice(unitPrice * line.quantity)}</strong></div></li>; })}</ul><dl><div><dt>Objects</dt><dd>{count}</dd></div><div><dt>Destination</dt><dd>{countryName}</dd></div><div><dt>Display currency</dt><dd>{region?.currency || 'INR'}</dd></div><div><dt>Subtotal</dt><dd>{formatPrice(lines.reduce((acc, l) => acc + ((products.find(p => p.id === l.id) as { price?: number | null })?.price ?? 3850) * l.quantity, 0))}</dd></div><div><dt>Express delivery</dt><dd>Free</dd></div><div className="checkout-total"><dt>Final payable amount</dt><dd>{formatPrice(lines.reduce((acc, l) => acc + ((products.find(p => p.id === l.id) as { price?: number | null })?.price ?? 3850) * l.quantity, 0))}</dd></div></dl></aside></div>
    </>}
  </section>;
}
