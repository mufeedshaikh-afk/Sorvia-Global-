import { useEffect, useRef, useState, type FormEvent } from 'react';
import { enquiryTopics, faqs, findTrackingExample, policies, trackingExamples, validateEnquiry, validateTracking, type Enquiry } from './supportData';
import { getOrderById, type DatabaseOrder } from './lib/supabase';

function PageIntro({ title, eyebrow, description }: { title: string; eyebrow: string; description: string }) {
  useEffect(() => { document.title = `${title} | SorviaGlobal`; }, [title]);
  return <><nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/support">Help & support</a><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav><div className="support-intro"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div></>;
}

export function SupportPage() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('All topics');
  const results = faqs.filter(faq => (topic === 'All topics' || faq.topic === topic) && query.trim().toLowerCase().split(/\s+/).every(term => `${faq.question} ${faq.answer}`.toLowerCase().includes(term)));
  return <section className="support-page"><PageIntro title="A little help, when you need it." eyebrow="HERE TO GUIDE YOU" description="Find your way through shopping, delivery, account details and the design preview."/>
    <div className="support-cards"><a href="/track-order"><span className="eyebrow">YOUR SELECTION</span><h2>Track an order</h2><p>Explore example order progress.</p><span aria-hidden="true">↗</span></a><a href="/contact"><span className="eyebrow">LET’S TALK</span><h2>Contact us</h2><p>Try the enquiry form preview.</p><span aria-hidden="true">↗</span></a><a href="/policies"><span className="eyebrow">THE DETAILS</span><h2>Policies</h2><p>See what is confirmed and what is still to come.</p><span aria-hidden="true">↗</span></a></div>
    <section className="faq-section" aria-labelledby="faq-title"><div className="support-section-heading"><h2 id="faq-title">Questions, answered.</h2><a className="text-button" href="/contact">Contact preview ↗</a></div><div className="faq-tools"><label htmlFor="faq-search">Search questions<input type="search" id="faq-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try shipping, returns, account…"/></label><label htmlFor="faq-topic">Topic<select id="faq-topic" value={topic} onChange={e => setTopic(e.target.value)}>{['All topics', 'Shopping', 'Delivery', 'Returns', 'Account'].map(value => <option key={value}>{value}</option>)}</select></label></div><p className="support-count" role="status">{results.length} {results.length === 1 ? 'answer' : 'answers'}</p>{results.length ? <div className="faq-list">{results.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p><a className="text-button" href={faq.link}>{faq.label} ↗</a></details>)}</div> : <div className="support-empty"><h3>No matching questions</h3><p>Try a different word or topic.</p><button className="button" onClick={() => { setQuery(''); setTopic('All topics'); }}>Show all questions <span aria-hidden="true">→</span></button></div>}</section>
  </section>;
}

export function TrackingPage() {
  const params = new URLSearchParams(location.search);
  const [reference, setReference] = useState(() => trackingExamples.some(example => example.reference === params.get('example')) ? params.get('example')! : '');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ reference?: string; email?: string }>({});
  const [state, setState] = useState<'idle' | 'loading' | 'found' | 'missing' | 'error'>('idle');
  const [example, setExample] = useState<typeof trackingExamples[number] | undefined>();
  const [dbOrder, setDbOrder] = useState<DatabaseOrder | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef(false);
  const result = useRef<HTMLDivElement>(null);
  const errorBox = useRef<HTMLDivElement>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { if (Object.keys(errors).length) errorBox.current?.focus(); }, [errors]);
  useEffect(() => { if (['found', 'missing', 'error'].includes(state)) result.current?.focus(); }, [state]);

  const getOrderStage = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 4;
      case 'shipped': return 3;
      case 'processing': return 2;
      case 'confirmed':
      case 'pending':
      default: return 1;
    }
  };

  const lookup = async (event?: FormEvent) => {
    event?.preventDefault(); if (pending.current) return;
    const next = validateTracking(reference, email); setErrors(next);
    if (Object.keys(next).length) return;
    pending.current = true; setState('loading'); setExample(undefined); setDbOrder(null);

    // 1. First attempt to query live orders from Supabase PostgreSQL database
    try {
      const liveOrder = await getOrderById(reference, email);
      if (liveOrder) {
        pending.current = false;
        setDbOrder(liveOrder);
        setState('found');
        return;
      }
    } catch (err) {
      console.warn('Live order query failed:', err);
    }

    // 2. Fallback to demo test examples if not found in database
    const match = findTrackingExample(reference, email);
    timer.current = setTimeout(() => {
      pending.current = false;
      setExample(match);
      setState(match ? 'found' : 'missing');
    }, 600);
  };

  const clearResult = () => { if (timer.current) clearTimeout(timer.current); pending.current = false; setState('idle'); setExample(undefined); setDbOrder(null); setErrors({}); };

  return <section className="support-page"><PageIntro title="Follow its journey." eyebrow="ORDER TRACKING" description="Track the live progress of your handcrafted order or explore example tracking flows."/><p className="support-preview-note">Enter your order reference (e.g. SG-1001) and order email address to query live order records.</p><div className="support-two-columns"><div><form className="support-form" noValidate onSubmit={lookup}>{Object.keys(errors).length > 0 && <div className="support-errors" tabIndex={-1} role="alert" ref={errorBox}>Please check the highlighted details.</div>}<div className="support-field"><label htmlFor="tracking-reference">Order reference</label><input id="tracking-reference" autoComplete="off" maxLength={40} value={reference} onChange={e => { clearResult(); setReference(e.target.value); }} aria-invalid={Boolean(errors.reference)} aria-describedby={errors.reference ? 'tracking-reference-error' : undefined}/>{errors.reference && <p className="field-error" id="tracking-reference-error">{errors.reference}</p>}</div><div className="support-field"><label htmlFor="tracking-email">Order email</label><input id="tracking-email" type="email" autoComplete="off" maxLength={100} value={email} onChange={e => { clearResult(); setEmail(e.target.value); }} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'tracking-email-error' : undefined}/>{errors.email && <p className="field-error" id="tracking-email-error">{errors.email}</p>}</div><button className="button" type="submit" disabled={state === 'loading'}>{state === 'loading' ? 'Searching orders…' : 'Track Order'} <span aria-hidden="true">→</span></button><div className="tracking-examples"><span>Try fictional details:</span>{trackingExamples.map(item => <button key={item.reference} type="button" className="text-button" onClick={() => { clearResult(); setReference(item.reference); setEmail('alex@example.com'); }}>{item.reference}</button>)}</div></form>
    <div ref={result} tabIndex={-1} className="tracking-result" aria-live="polite" aria-busy={state === 'loading'}>
      {state === 'loading' && <p role="status">Searching live database for order {reference}…</p>}
      {state === 'found' && dbOrder && <>
        <span className="eyebrow">LIVE DATABASE ORDER · CONFIRMED</span>
        <h2>{dbOrder.id}</h2>
        <span className="order-status" style={{ background: '#1e3524', color: '#fff', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', display: 'inline-block', marginBottom: '8px' }}>
          ● {dbOrder.status.toUpperCase()}
        </span>
        <p>Placed on {dbOrder.created_at ? new Date(dbOrder.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'} · Total: {dbOrder.currency} {dbOrder.total?.toLocaleString()}</p>
        <ol className="tracking-timeline">
          {[
            { label: 'Order Confirmed', desc: 'Order verified and securely recorded in cloud database.' },
            { label: 'Artisan Workshop', desc: 'Handcrafting, finishing and packaging artisanal objects.' },
            { label: 'In Transit', desc: 'Dispatched via international priority courier.' },
            { label: 'Delivered', desc: 'Safely delivered to customer address.' }
          ].map((step, index) => {
            const currentStage = getOrderStage(dbOrder.status);
            const isPast = index < currentStage;
            const isCurrent = index === currentStage - 1;
            return (
              <li key={step.label} className={isPast ? 'complete' : ''} aria-current={isCurrent ? 'step' : undefined}>
                <span aria-hidden="true">{isPast ? '✓' : '○'}</span>
                <div>
                  <strong>{step.label}</strong>
                  <p>{isPast ? step.desc : 'Pending progression'}</p>
                </div>
              </li>
            );
          })}
        </ol>
        {dbOrder.order_items && dbOrder.order_items.length > 0 && (
          <div style={{ marginTop: '16px', borderTop: '1px solid #ded6c5', paddingTop: '12px' }}>
            <strong style={{ fontSize: '11px', color: '#1a271d', display: 'block', marginBottom: '6px' }}>Order Items:</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {dbOrder.order_items.map((item, idx) => (
                <li key={idx} style={{ fontSize: '11px', color: '#555d53', display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                  <span>{item.quantity}× {item.product_name}</span>
                  <span>{dbOrder.currency} {(item.unit_price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </>}
      {state === 'found' && example && <><span className="eyebrow">FICTIONAL TRACKING EXAMPLE</span><h2>{example.reference}</h2><span className="order-status">{example.status} · Demo</span><p>{example.description}</p><ol className="tracking-timeline">{['Order received', 'Preparing selection', 'With carrier', 'Delivered'].map((label, index) => <li key={label} className={index < example.stage ? 'complete' : ''} aria-current={index === example.stage - 1 ? 'step' : undefined}><span aria-hidden="true">{index < example.stage ? '✓' : '○'}</span><div><strong>{label}</strong><p>{index < example.stage ? 'Example state only · no real event or date' : 'No event shown in this example'}</p></div></li>)}</ol><p className="support-small">No carrier, tracking number, scan location or delivery date is confirmed.</p></>}
      {state === 'missing' && <div className="support-empty"><h2>No matching order found</h2><p>We could not find an order matching reference "{reference}" and email "{email}". Please verify your details, or test with demo reference DEMO-1001 (alex@example.com).</p><a className="text-button" href="/contact">Contact support ↗</a></div>}
      {state === 'error' && <div className="support-empty"><h2>Tracking service is temporarily unavailable</h2><p>Please check your internet connection or try again in a few moments.</p><button className="button" onClick={() => lookup()}>Try again <span aria-hidden="true">→</span></button></div>}
    </div></div><aside className="support-aside"><h2>Live Order Information.</h2><p>Order references and tracking updates are queried directly from the SoraviaGlobal order service and international shipping provider.</p><a className="text-button" href="/policies/shipping">Shipping information ↗</a><a className="text-button" href="/support">More help ↗</a><details className="tracking-error-demo"><summary>Design review: error state</summary><p>Preview the unavailable-service layout.</p><button className="text-button" onClick={() => { clearResult(); setState('error'); }}>Show error preview</button></details></aside></div></section>;
}

export function ContactPage() {
  const [draft, setDraft] = useState<Enquiry>({ name: '', email: '', topic: '', order: '', message: '' });
  const [errors, setErrors] = useState<ReturnType<typeof validateEnquiry>>({});
  const [complete, setComplete] = useState(false);
  const status = useRef<HTMLDivElement>(null);
  const errorBox = useRef<HTMLDivElement>(null);
  useEffect(() => { if (complete) status.current?.focus(); }, [complete]);
  useEffect(() => { if (Object.keys(errors).length) errorBox.current?.focus(); }, [errors]);
  const update = (key: keyof Enquiry, value: string) => { setDraft(current => ({ ...current, [key]: value })); setErrors(current => { const next = { ...current }; delete next[key]; return next; }); };
  const field = (key: 'name' | 'email' | 'order', label: string) => <div className="support-field" key={key}><label htmlFor={`contact-${key}`}>{label}</label><input id={`contact-${key}`} autoComplete="off" type={key === 'email' ? 'email' : 'text'} maxLength={key === 'order' ? 40 : 100} value={draft[key]} onChange={e => update(key, e.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `contact-error-${key}` : undefined}/>{errors[key] && <p id={`contact-error-${key}`} className="field-error">{errors[key]}</p>}</div>;
  return <section className="support-page"><PageIntro title="Let’s talk." eyebrow="CONTACT & ENQUIRIES" description="A place for product questions, delivery queries and a little help along the way."/><p className="support-preview-note">This form is a local design preview. Use fictional details. No enquiry is sent or stored, and leaving or refreshing clears the form.</p><div className="support-two-columns"><div>{complete ? <div className="contact-complete" ref={status} tabIndex={-1} role="status"><span aria-hidden="true">✓</span><h2>Your enquiry preview is ready.</h2><p>No message has been sent. The live support service and contact details will be added before launch.</p><dl><div><dt>Topic</dt><dd>{draft.topic}</dd></div><div><dt>Name</dt><dd>{draft.name}</dd></div><div><dt>Email</dt><dd>{draft.email}</dd></div>{draft.order && <div><dt>Reference</dt><dd>{draft.order}</dd></div>}</dl><blockquote>{draft.message}</blockquote><div className="support-actions"><button className="button" onClick={() => setComplete(false)}>Edit enquiry <span aria-hidden="true">→</span></button><button className="text-button" onClick={() => { setDraft({ name: '', email: '', topic: '', order: '', message: '' }); setComplete(false); }}>Clear form</button></div></div> : <form className="support-form" noValidate onSubmit={e => { e.preventDefault(); const next = validateEnquiry(draft); setErrors(next); if (!Object.keys(next).length) setComplete(true); }}>{Object.keys(errors).length > 0 && <div className="support-errors" role="alert" ref={errorBox} tabIndex={-1}>Please check the highlighted enquiry fields.</div>}{field('name', 'Full name')}{field('email', 'Email address')}<div className="support-field"><label htmlFor="contact-topic">Enquiry topic</label><select id="contact-topic" value={draft.topic} onChange={e => update('topic', e.target.value)} aria-invalid={Boolean(errors.topic)} aria-describedby={errors.topic ? 'contact-error-topic' : undefined}><option value="">Choose a topic</option>{enquiryTopics.map(topic => <option key={topic}>{topic}</option>)}</select>{errors.topic && <p className="field-error" id="contact-error-topic">{errors.topic}</p>}</div>{field('order', 'Order reference (optional)')}<div className="support-field"><label htmlFor="contact-message">Your message</label><textarea id="contact-message" value={draft.message} maxLength={2000} rows={6} onChange={e => update('message', e.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-error-message' : 'contact-message-help'}/>{errors.message ? <p id="contact-error-message" className="field-error">{errors.message}</p> : <p id="contact-message-help" className="support-small">{draft.message.length} / 2,000 characters · Please do not include payment details.</p>}</div><button className="button" type="submit">Preview enquiry <span aria-hidden="true">→</span></button></form>}</div><aside className="support-aside"><h2>Before you write.</h2><p>You may find an answer in our preview help centre.</p><a className="text-button" href="/support">Browse questions ↗</a><a className="text-button" href="/track-order">Tracking preview ↗</a><h3>Contact details</h3><p>Approved support email, phone number, business address and service hours are still to come. No response time is promised in this preview.</p></aside></div></section>;
}

export function PoliciesPage({ path }: { path: string }) {
  const policy = policies.find(item => item.path === path);
  if (path !== '/policies' && !policy) return <NotFoundPage/>;
  return <section className="support-page"><PageIntro title={policy?.title || 'The details, clearly.'} eyebrow="POLICY PREVIEW" description={policy?.intro || 'Shipping, returns, privacy and business terms in one place.'}/><p className="support-preview-note">Draft content structure · Awaiting approved business policies before launch. These pages do not establish final commercial terms.</p>{policy ? <div className="policy-layout"><nav aria-label="Policy navigation">{policies.map(item => <a href={item.path} key={item.path} aria-current={path === item.path ? 'page' : undefined}>{item.title}</a>)}</nav><article>{policy.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.title}><span className="eyebrow">0{index + 1}</span><h2>{section.title}</h2><p>{section.body}</p></section>)}<a className="text-button" href="/contact">Contact preview ↗</a></article></div> : <div className="policy-cards">{policies.map(item => <a href={item.path} key={item.path}><span className="eyebrow">AWAITING APPROVAL</span><h2>{item.title}</h2><p>{item.intro}</p><span aria-hidden="true">↗</span></a>)}</div>}</section>;
}

export function NotFoundPage() {
  useEffect(() => { document.title = 'Page not found | SorviaGlobal'; }, []);
  return <section className="support-page not-found"><span className="eyebrow">404 · A DIFFERENT DIRECTION</span><h1>This page has<br/><em>wandered off.</em></h1><p>Try the Shop for a new discovery, or visit the help centre to find your way.</p><div className="support-actions"><a className="button" href="/shop">Explore the Shop <span aria-hidden="true">↗</span></a><a className="text-button" href="/support">Visit help & support</a><a className="text-button" href="/">Back home</a></div></section>;
}
