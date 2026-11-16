import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const categories = [
  { name: 'Brass décor', detail: 'Warm tones. Lasting character.', kind: 'brass' },
  { name: 'Wooden décor', detail: 'Natural texture, considered form.', kind: 'wood' },
  { name: 'Copper objects', detail: 'An inviting touch of warmth.', kind: 'copper' },
  { name: 'Decorative chess', detail: 'A different kind of statement.', kind: 'chess' },
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

function Header() {
  const [open, setOpen] = useState(false);
  return <>
    <div className="announcement">A considered collection. A home that feels like you.</div>
    <header className="header">
      <a className="wordmark" href="#home" aria-label="SorviaGlobal home">SORVIA<span>GLOBAL</span></a>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="#collections">Explore collections</a><a href="#approach">Our approach</a><a href="#project">About this preview</a></nav>
      <span className="header-note">HANDICRAFTS & HOME DÉCOR</span>
      <button className="menu-button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? 'Close −' : 'Menu +'}</button>
    </header>
    {open && <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation">{[['Explore collections', '#collections'], ['Our approach', '#approach'], ['About this preview', '#project']].map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<Arrow/></a>)}</nav>}
  </>;
}

function ObjectArt({ kind, hero = false }: { kind: string; hero?: boolean }) {
  return <div className={`object-art ${kind} ${hero ? 'hero-art' : ''}`} role="img" aria-label={hero ? 'Illustrative arrangement of decorative vessels in warm brass and terracotta tones' : `Concept illustration for ${kind} collection; not a product photograph`}>
    <div className="art-light"/><div className="art-plinth"/>
    {kind === 'chess' ? <div className="chess-pieces"><span>♟</span><span>♞</span><span>♜</span></div> : <><div className="vessel vessel-back"/><div className="vessel vessel-front"/><div className="art-branch"><i/><i/><i/></div></>}
    {hero && <div className="art-caption"><span>THE ART OF A CONSIDERED HOME</span><span>01 / OBJECT STUDIES</span></div>}
  </div>;
}

function App() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="home"><Header/></div>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy"><div className="eyebrow"><span className="small-line"/> OBJECTS WITH CHARACTER</div><h1 id="hero-title">A little character.<br/>A lasting <em>impression.</em></h1><p>Thoughtfully selected handicrafts and décor for the spaces you make your own.</p><a className="button" href="#collections">Explore the collections <Arrow/></a><div className="hero-footnote"><span>BRASS · COPPER · WOOD · MORE</span><span>Selected with intention</span></div></div>
        <ObjectArt kind="brass" hero/>
      </section>
      <div className="values-strip"><span>A considered selection</span><span>Material, texture & form</span><span>Details worth discovering</span></div>
      <section className="section collections" id="collections" aria-labelledby="collections-title">
        <div className="section-heading"><div><div className="eyebrow">FIND YOUR KIND OF CHARACTER</div><h2 id="collections-title">Explore by material & mood</h2></div><p>From warm metallic accents to natural textures,<br className="desktop-break"/> discover a starting point for your space.</p></div>
        <div className="category-grid">{categories.map((category, index) => <article className="category-card" key={category.kind}><div className="category-art"><ObjectArt kind={category.kind}/><span className="category-number">0{index + 1}</span></div><div className="category-title"><h3>{category.name}</h3><span aria-hidden="true">↗</span></div><p>{category.detail}</p><span className="coming-soon">Collection page coming in a later step</span></article>)}</div>
      </section>
      <section className="story" id="approach" aria-labelledby="story-title"><div className="story-visual"><ObjectArt kind="wood"/><span className="visual-label">AN EXPLORATION OF FORM & TEXTURE</span></div><div className="story-copy"><div className="eyebrow">THE SORVIAGLOBAL APPROACH</div><h2 id="story-title">Good objects.<br/><em>Thoughtfully selected.</em></h2><p>We’re creating a destination for handicrafts and home décor, bringing together objects chosen for their material, finish and distinctive character.</p><p>Our focus is on helping you discover pieces that feel at home in your everyday surroundings.</p><span className="editorial-note">Draft brand introduction · awaiting business approval</span></div></section>
      <section className="preview-note section" id="project"><div><div className="eyebrow">BUILDING SORVIAGLOBAL, ONE PAGE AT A TIME</div><h2>Your first look.</h2><p>This is the homepage design preview. Illustrations and copy are placeholders for review, not actual products or approved brand assets. Product browsing, prices, accounts and checkout will be added in later steps.</p></div><span className="step-badge">01<span>HOMEPAGE</span></span></section>
    </main>
    <footer><div className="footer-top"><a className="wordmark" href="#home">SORVIA<span>GLOBAL</span></a><p>Considered objects.<br/>Spaces with personality.</p><nav aria-label="Footer navigation"><a href="#collections">Collections</a><a href="#approach">Our approach</a><a href="#project">Project preview</a></nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SorviaGlobal</span><span>Design preview · Not yet accepting orders</span><a href="#home">Back to top ↑</a></div></footer>
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
