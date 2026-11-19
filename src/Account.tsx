import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { User } from '@supabase/supabase-js';
import { type AuthDraft, type AuthErrors, type AuthMode, isEmail, validateAuth } from './accountValidation';
import { type Delivery, type DeliveryErrors, emptyDelivery, postalRules, validateDelivery } from './checkoutValidation';
import { markets } from './CommerceContext';
import { products } from './catalog';
import { ObjectArt } from './ObjectArt';
import {
  isSupabaseConfigured,
  supabase,
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  sendPasswordResetEmail,
  getProfile,
  updateProfile,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress as deleteDbAddress,
} from './lib/supabase';

type Panel = 'overview' | 'profile' | 'addresses' | 'orders';
type Address = { id: string; country: string; details: Delivery };
const panels: { id: Panel; name: string }[] = [{ id: 'overview', name: 'Overview' }, { id: 'profile', name: 'Profile' }, { id: 'addresses', name: 'Addresses' }, { id: 'orders', name: 'Orders' }];
const exampleProfile = { name: 'Alex Sample', email: 'alex@example.com' };
const exampleAddress: Delivery = { ...emptyDelivery, ...exampleProfile, phone: '+91 00000 00000', address: '12 Example Street', city: 'Mumbai', area: 'Maharashtra', postal: '400001' };
const demoOrders = [
  { id: 'DEMO-1001', status: 'Processing', currency: 'INR', lines: [{ id: '05', quantity: 1 }, { id: '14', quantity: 2 }] },
  { id: 'DEMO-1002', status: 'Delivered', currency: 'USD', lines: [{ id: '10', quantity: 1 }] },
];

export function AccountPage() {
  const initial = new URLSearchParams(location.search).get('view');
  const [panel, setPanel] = useState<Panel>(panels.some(p => p.id === initial) ? initial as Panel : 'overview');
  const [mode, setMode] = useState<AuthMode>(initial === 'register' || initial === 'reset' ? initial : 'signin');
  const [demo, setDemo] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [draft, setDraft] = useState<AuthDraft>({ name: '', email: '', password: '', confirm: '' });
  const [authErrors, setAuthErrors] = useState<AuthErrors>({});
  const [profile, setProfile] = useState({ ...exampleProfile });
  const [profileDraft, setProfileDraft] = useState({ ...exampleProfile });
  const [profileErrors, setProfileErrors] = useState<{ name?: string; email?: string }>({});
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [addressDraft, setAddressDraft] = useState<Delivery>({ ...emptyDelivery });
  const [addressCountry, setAddressCountry] = useState('IN');
  const [addressErrors, setAddressErrors] = useState<DeliveryErrors>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showOrders, setShowOrders] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const sequence = useRef(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const errorBox = useRef<HTMLDivElement>(null);
  const deleteDialog = useRef<HTMLDialogElement>(null);
  const addressHeading = useRef<HTMLHeadingElement>(null);
  const sessionHeading = useRef(false);

  const isAuthenticated = Boolean(user) || demo;

  const loadUserData = async (userId: string, userEmail: string) => {
    try {
      const dbProfile = await getProfile(userId);
      const activeName = dbProfile?.full_name || userEmail.split('@')[0] || 'Customer';
      const userProfile = { name: activeName, email: userEmail };
      setProfile(userProfile);
      setProfileDraft(userProfile);

      const dbAddresses = await getAddresses(userId);
      if (dbAddresses && dbAddresses.length > 0) {
        setAddresses(dbAddresses.map(a => ({
          id: a.id,
          country: a.country,
          details: {
            name: a.full_name,
            address: a.street,
            apartment: a.apartment || '',
            city: a.city,
            area: a.state || '',
            postal: a.postal_code,
            phone: a.phone,
            email: userEmail,
          },
        })));
      }
    } catch (err) {
      console.warn('Could not load user data from Supabase:', err);
    }
  };

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && session?.user) {
        setUser(session.user);
        loadUserData(session.user.id, session.user.email || '');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        loadUserData(session.user.id, session.user.email || '');
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const view = isAuthenticated ? panel : mode;
    history.replaceState(null, '', `/account${view === 'overview' || view === 'signin' ? '' : `?view=${view}`}`);
    document.title = `${isAuthenticated ? panels.find(p => p.id === panel)?.name : mode === 'register' ? 'Create account' : mode === 'reset' ? 'Password recovery' : 'Sign in'} | SorviaGlobal`;
    if (sessionHeading.current) heading.current?.focus();
    sessionHeading.current = true;
  }, [isAuthenticated, panel, mode, orderId]);

  useEffect(() => { if (Object.keys(authErrors).length || Object.keys(profileErrors).length || Object.keys(addressErrors).length) errorBox.current?.focus(); }, [authErrors, profileErrors, addressErrors]);

  const openPanel = (value: Panel) => { setPanel(value); setEditing(null); setOrderId(null); setNotice(''); setProfileDraft({ ...profile }); setProfileErrors({}); setAddressErrors({}); };
  const changeMode = (value: AuthMode) => { setMode(value); setDraft(current => ({ ...current, password: '', confirm: '' })); setAuthErrors({}); setNotice(''); };
  const enterDemo = () => { setDemo(true); setDraft({ name: '', email: '', password: '', confirm: '' }); setAuthErrors({}); setNotice('Demo account opened. No sign-in request was sent and no real account was created.'); };
  
  const signOut = async () => {
    if (user) {
      await signOutUser();
      setUser(null);
    }
    setDemo(false);
    setPanel('overview');
    setMode('signin');
    setProfile({ ...exampleProfile });
    setProfileDraft({ ...exampleProfile });
    setAddresses([]);
    setEditing(null);
    setOrderId(null);
    setShowOrders(true);
    setDraft({ name: '', email: '', password: '', confirm: '' });
    setAuthErrors({});
    setProfileErrors({});
    setAddressErrors({});
    setAddressDraft({ ...emptyDelivery });
    setNotice('Session ended. You have been signed out.');
  };

  const submitAuth = async (event: FormEvent) => {
    event.preventDefault();
    const next = validateAuth(mode, draft);
    setAuthErrors(next);
    if (Object.keys(next).length) return;

    if (!isSupabaseConfigured) {
      if (mode === 'reset') {
        setNotice('Password recovery preview: no email was sent. Real reset links will be handled by the authentication service.');
        setDraft({ name: '', email: '', password: '', confirm: '' });
      } else {
        enterDemo();
      }
      return;
    }

    setLoading(true);
    try {
      if (mode === 'reset') {
        await sendPasswordResetEmail(draft.email);
        setNotice('Password recovery email sent. Please check your inbox for instructions.');
        setDraft({ name: '', email: '', password: '', confirm: '' });
      } else if (mode === 'register') {
        const res = await signUpWithEmail(draft.email, draft.password, draft.name);
        if (res.user && !res.session) {
          setNotice('Account created! Please check your email to confirm your account.');
          setDraft({ name: '', email: '', password: '', confirm: '' });
        } else if (res.session?.user) {
          setUser(res.session.user);
          await loadUserData(res.session.user.id, res.session.user.email || draft.email);
          setNotice('Welcome! Your account has been created.');
        }
      } else if (mode === 'signin') {
        const res = await signInWithEmail(draft.email, draft.password);
        if (res.session?.user) {
          setUser(res.session.user);
          await loadUserData(res.session.user.id, res.session.user.email || draft.email);
          setNotice('Welcome back! You are signed in.');
        }
      }
    } catch (err: any) {
      const msg = err?.message || 'Authentication request failed. Please check your details.';
      if (mode === 'signin') setAuthErrors({ password: msg });
      else if (mode === 'register') setAuthErrors({ email: msg });
      else setAuthErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  const authField = (key: keyof AuthDraft, label: string, type = 'text') => {
    const isPass = key === 'password' || key === 'confirm';
    const isVisible = key === 'password' ? showPassword : key === 'confirm' ? showConfirm : false;
    const inputType = isPass ? (isVisible ? 'text' : 'password') : type;
    const toggle = () => {
      if (key === 'password') setShowPassword(v => !v);
      else if (key === 'confirm') setShowConfirm(v => !v);
    };

    return (
      <div className="account-field" key={key}>
        <label htmlFor={`account-${key}`}>{label}</label>
        <div className={isPass ? 'password-input-wrap' : undefined}>
          <input
            id={`account-${key}`}
            type={inputType}
            autoComplete="off"
            maxLength={isPass ? 128 : 100}
            value={draft[key]}
            onChange={e => {
              setDraft(current => ({ ...current, [key]: e.target.value }));
              setAuthErrors(current => ({ ...current, [key]: undefined }));
            }}
            aria-invalid={Boolean(authErrors[key])}
            aria-describedby={authErrors[key] ? `account-error-${key}` : undefined}
          />
          {isPass && (
            <button
              type="button"
              className="password-toggle-btn"
              onClick={toggle}
              aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            >
              {isVisible ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>Show</span>
                </>
              )}
            </button>
          )}
        </div>
        {authErrors[key] && <p className="field-error" id={`account-error-${key}`}>{authErrors[key]}</p>}
      </div>
    );
  };
  const beginAddress = (address?: Address) => { setEditing(address?.id || 'new'); setAddressDraft(address ? { ...address.details } : { ...emptyDelivery, ...profile }); setAddressCountry(address?.country || 'IN'); setAddressErrors({}); setNotice(''); };

  const saveAddress = async (event: FormEvent) => {
    event.preventDefault();
    const next = validateDelivery(addressDraft, addressCountry);
    setAddressErrors(next);
    if (Object.keys(next).length) return;

    if (user) {
      setLoading(true);
      try {
        if (editing === 'new') {
          const created = await createAddress(user.id, {
            full_name: addressDraft.name,
            street: addressDraft.address,
            apartment: addressDraft.apartment || null,
            city: addressDraft.city,
            state: addressDraft.area || null,
            postal_code: addressDraft.postal,
            country: addressCountry,
            phone: addressDraft.phone,
            is_default: addresses.length === 0,
          });
          if (created) {
            setAddresses(curr => [{ id: created.id, country: created.country, details: { ...addressDraft } }, ...curr]);
            setNotice('Address saved to your account.');
          }
        } else if (editing) {
          const updated = await updateAddress(editing, {
            full_name: addressDraft.name,
            street: addressDraft.address,
            apartment: addressDraft.apartment || null,
            city: addressDraft.city,
            state: addressDraft.area || null,
            postal_code: addressDraft.postal,
            country: addressCountry,
            phone: addressDraft.phone,
          });
          if (updated) {
            setAddresses(curr => curr.map(a => a.id === editing ? { id: updated.id, country: updated.country, details: { ...addressDraft } } : a));
            setNotice('Address updated.');
          }
        }
      } catch (err) {
        console.warn('Address save failed:', err);
      } finally {
        setLoading(false);
        setEditing(null);
        addressHeading.current?.focus();
      }
      return;
    }

    const value: Address = { id: editing === 'new' ? `address-${++sequence.current}` : editing!, country: addressCountry, details: { ...addressDraft } };
    setAddresses(current => editing === 'new' ? [...current, value] : current.map(address => address.id === editing ? value : address));
    setEditing(null);
    setNotice('Address saved for this demo session.');
    addressHeading.current?.focus();
  };

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof profileErrors = {};
    if (!profileDraft.name.trim()) next.name = 'Enter a name.';
    if (!isEmail(profileDraft.email)) next.email = 'Enter a valid email address.';
    setProfileErrors(next);
    if (Object.keys(next).length) return;

    if (user) {
      setLoading(true);
      try {
        await updateProfile(user.id, { full_name: profileDraft.name.trim() });
        setProfile({ name: profileDraft.name.trim(), email: user.email || profileDraft.email.trim() });
        setNotice('Profile updated.');
      } catch (err) {
        console.warn('Profile update failed:', err);
      } finally {
        setLoading(false);
      }
      return;
    }

    setProfile({ name: profileDraft.name.trim(), email: profileDraft.email.trim() });
    setNotice('Profile updated for this demo session.');
  };

  const handleDeleteAddress = async () => {
    if (!deleteId) return;
    if (user) {
      await deleteDbAddress(deleteId);
    }
    setAddresses(current => current.filter(address => address.id !== deleteId));
    deleteDialog.current?.close();
    setDeleteId(null);
    setNotice('Address deleted.');
    addressHeading.current?.focus();
  };

  const addressField = (key: keyof Delivery, label: string, optional = false) => <div className={`account-field ${key === 'address' || key === 'apartment' ? 'account-field-wide' : ''}`} key={key}><label htmlFor={`saved-${key}`}>{label}{optional && ' (optional)'}</label><input id={`saved-${key}`} maxLength={200} type={key === 'phone' ? 'tel' : 'text'} autoComplete="off" value={addressDraft[key]} onChange={e => { setAddressDraft(current => ({ ...current, [key]: e.target.value })); setAddressErrors(current => ({ ...current, [key]: undefined })); }} aria-invalid={Boolean(addressErrors[key])} aria-describedby={addressErrors[key] ? `saved-error-${key}` : undefined}/>{addressErrors[key] && <p id={`saved-error-${key}`} className="field-error">{addressErrors[key]}</p>}</div>;
  const activeOrder = demoOrders.find(order => order.id === orderId);

  return <section className="account-page" aria-labelledby="account-title">
    <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Account</span></nav>
    <div className="account-intro"><div className="eyebrow">YOUR SORVIA SPACE</div><h1 id="account-title">A place for <em>your favourites.</em></h1><p>{user ? 'Manage your profile, delivery addresses and preferences.' : 'Sign in to access your saved details, or explore with a demo account.'}</p></div>
    {!user && !demo && <p className="account-preview-note">Enter your account credentials or click "Explore demo account" below to test the experience.</p>}
    {notice && <p className="account-notice" role="status">{notice}</p>}
    {!isAuthenticated ? <div className="account-auth-layout"><div className="account-auth-card"><h2 ref={heading} tabIndex={-1}>{mode === 'register' ? 'Create your account' : mode === 'reset' ? 'Forgot your password?' : 'Welcome back'}</h2><p>{mode === 'reset' ? 'Enter your email to receive a password recovery link.' : mode === 'register' ? 'Register for a new account with your email.' : 'Sign in to access your saved profile and addresses.'}</p>
      {mode !== 'reset' && <nav className="auth-switch" aria-label="Account access"><button aria-pressed={mode === 'signin'} onClick={() => changeMode('signin')}>Sign in</button><button aria-pressed={mode === 'register'} onClick={() => changeMode('register')}>Create account</button></nav>}
      <form noValidate onSubmit={submitAuth}>{Object.values(authErrors).some(Boolean) && <div className="account-errors" role="alert" ref={errorBox} tabIndex={-1}>Please check the highlighted fields before continuing.</div>}{mode === 'register' && authField('name', 'Full name')}{authField('email', 'Email address', 'email')}{mode !== 'reset' && authField('password', 'Password', 'password')}{mode === 'register' && authField('confirm', 'Confirm password', 'password')}<button className="button account-submit" type="submit" disabled={loading}>{loading ? 'Please wait…' : mode === 'reset' ? 'Send reset link' : mode === 'register' ? 'Create account' : 'Sign in'} <span aria-hidden="true">→</span></button></form>
      <button className="text-button" onClick={() => changeMode(mode === 'reset' ? 'signin' : 'reset')}>{mode === 'reset' ? '← Back to sign in' : 'Forgot password?'}</button>
    </div><aside className="account-auth-aside"><div className="eyebrow">MAKE YOURSELF AT HOME</div><h2>Your next discovery<br/><em>starts here.</em></h2><p>Explore profile details, an address book, example orders and your saved favourites.</p><button className="button" onClick={enterDemo}>Explore demo account <span aria-hidden="true">↗</span></button><p className="account-small">{isSupabaseConfigured ? 'Live authentication is powered by your secure Supabase database.' : 'Demo access is a design preview. Connect Supabase to enable live customer records.'}</p></aside></div> : <div className="account-layout">
      <aside className="account-nav"><div className="eyebrow">{user ? 'ACCOUNT' : 'DEMO ACCOUNT'}</div><p>{profile.name}</p><nav aria-label="Account sections">{panels.map(item => <button key={item.id} aria-current={panel === item.id ? 'page' : undefined} onClick={() => openPanel(item.id)}>{item.name}<span aria-hidden="true">↗</span></button>)}<a href="/wishlist">Wishlist<span aria-hidden="true">♡</span></a></nav><button className="text-button" onClick={signOut}>Sign out</button></aside>
      <div className="account-content"><h2 ref={heading} tabIndex={-1}>{activeOrder && panel === 'orders' ? `Order ${activeOrder.id}` : panels.find(p => p.id === panel)?.name}</h2>
        {panel === 'overview' && <><p>Welcome, {profile.name}. Keep your details and discoveries together.</p><div className="account-overview-grid"><button onClick={() => openPanel('orders')}><span className="eyebrow">YOUR SELECTIONS</span><strong>Orders</strong><span>View your orders →</span></button><button onClick={() => openPanel('addresses')}><span className="eyebrow">YOUR DESTINATIONS</span><strong>Address book</strong><span>{addresses.length} saved {addresses.length === 1 ? 'address' : 'addresses'} →</span></button><button onClick={() => openPanel('profile')}><span className="eyebrow">YOUR DETAILS</span><strong>Profile</strong><span>Edit your profile details →</span></button><a href="/wishlist"><span className="eyebrow">YOUR DISCOVERIES</span><strong>Wishlist</strong><span>See this browser’s favourites →</span></a></div><p className="account-small">{user ? 'Your profile and address book are synchronized with your account.' : 'Demo account session. Edits are kept in memory for this session.'}</p></>}
        {panel === 'profile' && <form className="account-profile-form" noValidate onSubmit={handleProfileSave}><p>{user ? 'Update your personal details below.' : 'Changes apply only to this temporary demo account.'}</p>{Object.values(profileErrors).some(Boolean) && <div className="account-errors" role="alert" tabIndex={-1} ref={errorBox}>Please check your name and email address.</div>}{(['name', 'email'] as const).map(key => <div className="account-field" key={key}><label htmlFor={`profile-${key}`}>{key === 'name' ? 'Full name' : 'Email address'}</label><input id={`profile-${key}`} type={key === 'email' ? 'email' : 'text'} disabled={Boolean(user && key === 'email')} autoComplete="off" maxLength={100} value={profileDraft[key]} onChange={e => setProfileDraft(current => ({ ...current, [key]: e.target.value }))} aria-invalid={Boolean(profileErrors[key])} aria-describedby={profileErrors[key] ? `profile-error-${key}` : undefined}/>{profileErrors[key] && <p className="field-error" id={`profile-error-${key}`}>{profileErrors[key]}</p>}</div>)}<div className="account-actions"><button className="button" type="submit" disabled={loading}>{loading ? 'Saving…' : 'Save profile'} <span aria-hidden="true">→</span></button><button className="text-button" type="button" onClick={() => { setProfileDraft({ ...profile }); setProfileErrors({}); setNotice('Unsaved profile edits discarded.'); }}>Cancel edits</button></div></form>}
        {panel === 'addresses' && <><h3 className="sr-account-heading" ref={addressHeading} tabIndex={-1}>Your address book</h3><p>{user ? 'Manage your saved delivery destinations for seamless checkout.' : 'Saved for this demo session only.'}</p>{editing ? <form className="account-address-form" noValidate onSubmit={saveAddress}><div className="account-form-heading"><h3>{editing === 'new' ? 'Add an address' : 'Edit address'}</h3>{!user && <button type="button" className="text-button" onClick={() => { setAddressDraft({ ...exampleAddress, email: profile.email }); setAddressCountry('IN'); setAddressErrors({}); }}>Use fictional address</button>}</div>{Object.values(addressErrors).some(Boolean) && <div className="account-errors" role="alert" ref={errorBox} tabIndex={-1}>Please check the highlighted address fields.</div>}<div className="account-address-fields">{addressField('name', 'Recipient name')}{addressField('phone', 'Phone number')}<div className="account-field"><label htmlFor="saved-country">Country</label><select id="saved-country" value={addressCountry} onChange={e => { setAddressCountry(e.target.value); setAddressErrors({}); }}>{markets.filter(m => m.code !== 'OTHER').map(m => <option key={m.code} value={m.code}>{m.name}</option>)}</select></div>{addressField('postal', postalRules[addressCountry].label)}{addressField('address', 'Street address')}{addressField('apartment', 'Apartment / suite', true)}{addressField('city', 'City / town')}{addressField('area', 'State / province', !['IN', 'US'].includes(addressCountry))}</div><div className="account-actions"><button className="button" type="submit" disabled={loading}>{loading ? 'Saving…' : 'Save address'} <span aria-hidden="true">→</span></button><button type="button" className="text-button" onClick={() => { setEditing(null); setAddressErrors({}); addressHeading.current?.focus(); }}>Cancel</button></div></form> : <>{addresses.length ? <ul className="address-list">{addresses.map(address => <li key={address.id}><h3>{address.details.name}</h3><address>{address.details.address}<br/>{address.details.apartment && <>{address.details.apartment}<br/></>}{address.details.city}, {address.details.area} {address.details.postal}<br/>{markets.find(m => m.code === address.country)?.name}<br/>{address.details.phone}</address><div className="account-actions"><button className="text-button" onClick={() => beginAddress(address)} aria-label={`Edit address for ${address.details.name}`}>Edit</button><button className="text-button" onClick={() => { setDeleteId(address.id); deleteDialog.current?.showModal(); }} aria-label={`Delete address for ${address.details.name}`}>Delete</button></div></li>)}</ul> : <div className="account-empty"><h3>No addresses yet</h3><p>Add a delivery address to speed up future orders.</p></div>}<button className="button" onClick={() => beginAddress()}>Add address <span aria-hidden="true">+</span></button></>}</>}
        {panel === 'orders' && <>{activeOrder ? <><button className="text-button" onClick={() => setOrderId(null)}>← Back to orders</button><div className="order-detail-header"><span className="order-status">{activeOrder.status} · Demo</span><p>Fictional order for design review. No purchase, shipment or payment record exists.</p></div><ul className="order-items">{activeOrder.lines.map(line => { const product = products.find(p => p.id === line.id)!; return <li key={line.id}><div className="order-thumb"><ObjectArt kind={product.kind} productId={product.id}/></div><div><span className="eyebrow">OBJECT {line.id}</span><h3>{product.name}</h3><p>Quantity {line.quantity} · {product.material}</p></div><span>Price unavailable</span></li>; })}</ul><div className="order-detail-grid"><div><h3>Delivery information</h3><p>12 Example Street<br/>Mumbai, Maharashtra 400001<br/>India · Fictional address</p></div><div><h3>Payment summary</h3><dl><div><dt>Display currency</dt><dd>{activeOrder.currency} · Demo</dd></div><div><dt>Total</dt><dd>Not available</dd></div><div><dt>Payment</dt><dd>No transaction</dd></div></dl></div></div><a className="text-button" href={`/track-order?example=${activeOrder.id}`}>Preview tracking ↗</a><p className="account-small">Real order dates, prices, delivery details and tracking updates will be provided by the backend. This example does not confirm availability or delivery.</p></> : <><div className="account-form-heading"><p>Fictional orders for layout review only.</p><button className="text-button" onClick={() => setShowOrders(current => !current)}>{showOrders ? 'Show empty-state preview' : 'Show example orders'}</button></div>{showOrders ? <ul className="orders-list">{demoOrders.map(order => <li key={order.id}><div><span className="eyebrow">EXAMPLE ORDER</span><h3>{order.id}</h3><p>{order.lines.reduce((sum, line) => sum + line.quantity, 0)} objects · {order.currency} · Total unavailable</p></div><span className="order-status">{order.status} · Demo</span><button className="text-button" onClick={() => setOrderId(order.id)} aria-label={`View order ${order.id}`}>View details ↗</button></li>)}</ul> : <div className="account-empty"><h3>No orders yet</h3><p>When ordering is connected, your purchases will appear here.</p><a className="button" href="/shop">Explore the Shop <span aria-hidden="true">↗</span></a></div>}</>}</>}
      </div>
    </div>}
    <dialog className="commerce-dialog" ref={deleteDialog} aria-labelledby="delete-address-title"><div className="commerce-dialog-heading"><h2 id="delete-address-title">Delete this address?</h2></div><p>This removes the address from your account.</p><div className="account-actions"><button className="button" onClick={handleDeleteAddress}>Delete address</button><button autoFocus className="text-button" onClick={() => { deleteDialog.current?.close(); setDeleteId(null); }}>Keep address</button></div></dialog>
  </section>;
}
