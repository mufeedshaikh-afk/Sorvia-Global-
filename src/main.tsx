import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './warm-theme.css';
import './cart.css';
import './checkout.css';
import './account.css';
import './support.css';
import './admin.css';
import { AdminPage } from './Admin';
import { ContactPage, NotFoundPage, PoliciesPage, SupportPage, TrackingPage } from './SupportPages';
import { AccountPage } from './Account';
import { CheckoutPage } from './Checkout';
import { CommerceProvider } from './CommerceContext';
import { CartPage, MiniCart, RegionControl } from './Cart';
import { ObjectArt } from './ObjectArt';
import { Shop } from './Shop';
import { ProductDetail } from './ProductDetail';
import { collections } from './collections';
import { SearchPage, WishlistPage } from './DiscoveryPages';
import { WishlistProvider, useWishlist } from './WishlistContext';

const categories = collections
  .filter(collection => collection.material || collection.kind === 'chess')
  .map(collection => ({ name: collection.name, detail: collection.description, kind: collection.kind, path: collection.path }));

function Arrow() { return <span aria-hidden="true">↗</span>; }

function Header() {
  const [open, setOpen] = useState(false);
  const { ids } = useWishlist();
  return <>
    <div className="announcement">A considered collection. A home that feels like you.</div>
    <header className="header">
      <a className="wordmark" href="/" aria-label="SoraviaGlobal home">
        <img src="/images/soravia-emblem-mark.png" alt="SoraviaGlobal Emblem" className="brand-logo-emblem" />
        <div className="wordmark-text-wrap">
          <span className="wordmark-title">SORAVIA<span className="wordmark-gold">GLOBAL</span></span>
          <span className="wordmark-tagline">EXPORTS · HANDICRAFTS · HOME DÉCOR</span>
        </div>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="/shop" aria-current={location.pathname === "/shop" ? "page" : undefined}>Shop</a>
        <div className="nav-mega-wrap">
          <a className="nav-mega-trigger" href="/#collections" aria-haspopup="true">
            Explore collections <span className="mega-caret" aria-hidden="true">▾</span>
          </a>
          <div className="nav-mega-menu" role="group" aria-label="Explore collections">
            <div className="nav-mega-menu-inner">
              {[
                { label: 'Brassware', href: '/collections/brass', desc: 'Urli, Bowls & Vessels', icon: '✦' },
                { label: 'Copperware', href: '/collections/copper', desc: 'Jugs, Planters & Accents', icon: '◈' },
                { label: 'Woodcraft', href: '/collections/wood', desc: 'Hand-carved Decor', icon: '⌂' },
                { label: 'Ceramics', href: '/collections/ceramic', desc: 'Glazed Vases & Bowls', icon: '◉' },
                { label: 'Stoneware', href: '/collections/stone', desc: 'Sculptural Art Objects', icon: '◇' },
                { label: 'Glassware', href: '/collections/glass', desc: 'Hand-blown Accents', icon: '◌' },
                { label: 'Decorative Chess', href: '/category/decorative-chess', desc: 'Artisan Statement Sets', icon: '♟' },
              ].map(cat => (
                <a href={cat.href} key={cat.href} className="nav-mega-item">
                  <span className="mega-icon" aria-hidden="true">{cat.icon}</span>
                  <div className="mega-item-text">
                    <span className="mega-item-title">{cat.label}</span>
                    <span className="mega-item-desc">{cat.desc}</span>
                  </div>
                  <span className="mega-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <a href="/#approach">Our approach</a>
      </nav>
      <nav className="header-actions" aria-label="Account, search, favourites and cart"><a href="/search" aria-current={location.pathname === "/search" ? "page" : undefined}>Search</a><a href="/wishlist" aria-current={location.pathname === "/wishlist" ? "page" : undefined} aria-label={`Wishlist, ${ids.length} saved ${ids.length === 1 ? "object" : "objects"}`}>♡ <span className="wishlist-word">Wishlist</span><span className="wishlist-count">{ids.length}</span></a><a className="header-account" href="/account" aria-current={location.pathname === "/account" ? "page" : undefined}>Account</a><MiniCart/></nav>
      <button className="menu-button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? 'Close −' : 'Menu +'}</button>
    </header>
    <div className="promo-banner" role="region" aria-label="Promotional announcement">
      <div className="promo-banner-inner">
        <span className="promo-badge">CURATED EDIT</span>
        <span className="promo-copy">Handcrafted Brass, Copper & Wood Décor · Complimentary Express Shipping</span>
        <a href="/shop" className="promo-link">Explore Offers <Arrow/></a>
      </div>
    </div>
    <div className="region-bar"><span>Authentic Indian Artisan Handicrafts · Direct Export</span><RegionControl/></div>
    {open && <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation">{[['Shop', '/shop'], ['Search', '/search'], ['Wishlist', '/wishlist'], ['Cart', '/cart'], ['Account', '/account'], ['Track order', '/track-order'], ['Help & support', '/support'], ['Contact', '/contact'], ['Explore collections', '/#collections'], ['Our approach', '/#approach']].map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<Arrow/></a>)}</nav>}
  </>;
}


function App() {
  const path = location.pathname.replace(/\/$/, '') || '/';
  if (path === '/admin' || path.startsWith('/admin/')) return <div className="theme-warm"><AdminPage/></div>;
  const collection = collections.find(item => item.path === path);
  const collectionRoute = path.startsWith('/collections/') || path.startsWith('/category/');
  const warmTheme = true;
  return <div className={warmTheme ? 'theme-warm' : undefined}>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="home"><Header/></div>
    <main id="main">{path === "/support" ? <SupportPage/> : path === "/contact" ? <ContactPage/> : path === "/track-order" ? <TrackingPage/> : path === "/policies" || path.startsWith("/policies/") ? <PoliciesPage path={path}/> : path === "/account" ? <AccountPage/> : path === "/checkout" ? <CheckoutPage/> : path === "/cart" ? <CartPage/> : path === "/search" ? <SearchPage/> : path === "/wishlist" ? <WishlistPage/> : path.startsWith("/product/") ? <ProductDetail id={path.slice("/product/".length)}/> : collection ? <Shop collection={collection}/> : path === "/shop" ? <Shop/> : collectionRoute ? <section className="section missing-collection"><div className="eyebrow">A NEW DIRECTION</div><h1>Collection not found</h1><p>This collection is not available at the moment. Explore the Shop to find another starting point.</p><a className="button" href="/shop">Browse the collection <Arrow/></a></section> : path !== "/" ? <NotFoundPage/> : <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy"><div className="eyebrow"><span className="small-line"/> OBJECTS WITH CHARACTER</div><h1 id="hero-title">A little character.<br/>A lasting <em>impression.</em></h1><p>Thoughtfully selected handicrafts and décor for the spaces you make your own.</p><a className="button" href="/shop">Explore the collections <Arrow/></a><div className="hero-footnote"><span>BRASS · COPPER · WOOD · MORE</span><span>Selected with intention</span></div></div>
        <ObjectArt kind="brass" hero/>
      </section>
      <section className="home-discovery" aria-label="Discover by material"><div className="eyebrow">DISCOVER BY MATERIAL</div><div className="home-material-pills">{[['Brass', '/collections/brass'], ['Copper', '/collections/copper'], ['Wood', '/collections/wood'], ['Ceramic', '/collections/ceramic'], ['Stone', '/collections/stone'], ['Glass', '/collections/glass']].map(([label, href]) => <a href={href} key={label}>{label}<span aria-hidden="true">↗</span></a>)}</div></section>
      <section className="artisan-highlights" aria-label="Artisan highlights"><span>Handcrafted Indian décor</span><span>Materials with character</span><span>Global delivery enquiries welcome</span></section>
      <div className="values-strip"><span>A considered selection</span><span>Material, texture & form</span><span>Details worth discovering</span></div>
      <section className="section collections" id="collections" aria-labelledby="collections-title">
        <div className="section-heading"><div><div className="eyebrow">FIND YOUR KIND OF CHARACTER</div><h2 id="collections-title">Explore by material & mood</h2></div><p>From warm metallic accents to natural textures,<br className="desktop-break"/> discover a starting point for your space.</p></div>
        <div className="category-grid">{categories.map((category, index) => <article className="category-card" key={category.kind}><div className="category-art"><ObjectArt kind={category.kind}/><span className="category-number">0{index + 1}</span></div><div className="category-title"><h3>{category.name}</h3><span aria-hidden="true">↗</span></div><p>{category.detail}</p><a className="coming-soon" href={category.path}>Browse {category.name} →</a></article>)}</div>
      </section>
      <section className="story" id="approach" aria-labelledby="story-title"><div className="story-visual"><ObjectArt kind="wood"/><span className="visual-label">AN EXPLORATION OF FORM & TEXTURE</span></div><div className="story-copy"><div className="eyebrow">THE SORAVIAGLOBAL APPROACH</div><h2 id="story-title">Good objects.<br/><em>Thoughtfully selected.</em></h2><p>We’re creating a destination for handicrafts and home décor, bringing together objects chosen for their material, finish and distinctive character.</p><p>Our focus is on helping you discover pieces that feel at home in your everyday surroundings.</p><span className="editorial-note">Draft brand introduction · awaiting business approval</span></div></section>
    </>}</main>
    <footer><div className="footer-top"><a className="wordmark" href="/" aria-label="SoraviaGlobal home"><img src="/images/soravia-emblem-mark.png" alt="SoraviaGlobal Emblem" className="brand-logo-emblem" /><div className="wordmark-text-wrap"><span className="wordmark-title">SORAVIA<span className="wordmark-gold">GLOBAL</span></span><span className="wordmark-tagline">EXPORTS · HANDICRAFTS · HOME DÉCOR</span></div></a><p>Considered objects.<br/>Spaces with personality.</p><nav aria-label="Footer navigation"><a href="/shop">Shop</a><a href="/search">Search</a><a href="/wishlist">Wishlist</a><a href="/cart">Cart</a><a href="/account">Account</a><a href="/#collections">Collections</a><a href="/#approach">Our approach</a><a href="/images/reference/credits.html" target="_blank" rel="noopener noreferrer">Image credits</a></nav></div><nav className="footer-support" aria-label="Customer service"><a href="/support">Help & FAQs</a><a href="/contact">Contact</a><a href="/track-order">Track order</a><a href="/policies/shipping">Shipping</a><a href="/policies/returns">Returns & cancellations</a><a href="/policies/privacy">Privacy</a><a href="/policies/terms">Terms</a></nav><div className="footer-region"><RegionControl/></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SoraviaGlobal</span><span>Catalog and ordering coming soon</span><a href="#home">Back to top ↑</a></div></footer>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><WishlistProvider><CommerceProvider><App/></CommerceProvider></WishlistProvider></React.StrictMode>);
