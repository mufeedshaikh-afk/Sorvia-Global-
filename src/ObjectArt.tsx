import { useState } from 'react';

const photos: Record<string, { file: string; alt: string }> = {
  brass: { file: 'brass-vase', alt: 'Engraved brass vase with a rounded body, photographed in a museum' },
  wood: { file: 'wood-vase', alt: 'Carved dark wooden vessel with a decorative lid' },
  copper: { file: 'copper-vessel', alt: 'Copper bottle and its lid on a wooden surface' },
  chess: { file: 'wood-chess', alt: 'Carved wooden chess pieces arranged on a chessboard' },
  ceramic: { file: 'ceramic-vase', alt: 'Decorative ceramic flower vase' },
  glass: { file: 'glass-vase', alt: 'Decorative glass vase photographed against a plain background' },
  stone: { file: 'stone-vase', alt: 'Historic marble vase with a high foot and four lug handles' },
  '01': { file: 'brass-vessels', alt: 'Sculptural, durian-shaped brass vessel in a museum display' },
  '02': { file: 'wood-accents', alt: 'Carved wooden bowl with a patterned lid on a white background' },
  '03': { file: 'copper-vessel', alt: 'Copper bottle and its lid on a wooden surface' },
  '04': { file: 'wood-chess', alt: 'Carved wooden chess pieces arranged on a chessboard' },
  '05': { file: 'brass-vase', alt: 'Engraved brass vase with a rounded body, photographed in a museum' },
  '06': { file: 'wood-vase', alt: 'Carved dark wooden vessel with a decorative lid' },
  '07': { file: 'copper-bowl', alt: 'Historic copper bowl with a dark patina in a museum display' },
  '08': { file: 'metal-chess', alt: 'Historic metal chess pieces, used as a reference for the brass chess concept' },
  '09': { file: 'ceramic-vase', alt: 'Decorative ceramic flower vase' },
  '10': { file: 'glass-vase', alt: 'Decorative glass vase photographed against a plain background' },
  '11': { file: 'stone-vase', alt: 'Historic marble vase with a high foot and four lug handles' },
};

export function ObjectArt({ kind, hero = false, productId }: { kind: string; hero?: boolean; productId?: string }) {
  const photo = photos[productId || kind];
  // A failed image is tracked by filename so a different filtered item can still load.
  const [failedFile, setFailedFile] = useState('');
  if (photo && failedFile !== photo.file) return <div className={`object-art reference-photo ${hero ? 'hero-art' : ''}`}>
    <img className="reference-image" src={`/images/reference/${photo.file}.jpg`} alt={`${photo.alt}. Reference photo, not SorviaGlobal inventory.`} loading={hero ? 'eager' : 'lazy'} decoding="async" onError={() => setFailedFile(photo.file)}/>
    <span className="photo-label">REFERENCE PHOTO</span>
    <a className="photo-credit" href={`/images/reference/credits.html#${photo.file}`} target="_blank" rel="noopener noreferrer" aria-label={`Photo credit for ${photo.alt} (opens in a new tab)`}>Photo credit ↗</a>
  </div>;
  return <ConceptArt kind={kind} hero={hero}/>;
}

function ConceptArt({ kind, hero = false }: { kind: string; hero?: boolean }) {
  return <div className={`object-art ${kind} ${hero ? 'hero-art' : ''}`} role="img" aria-label={hero ? 'Illustrative arrangement of decorative vessels in warm brass and terracotta tones' : `Concept illustration for ${kind} collection; not a product photograph`}>
    <div className="art-light"/><div className="art-plinth"/>
    {kind === 'chess' ? <div className="chess-pieces"><span>♟</span><span>♞</span><span>♜</span></div> : <><div className="vessel vessel-back"/><div className="vessel vessel-front"/><div className="art-branch"><i/><i/><i/></div></>}
    {hero && <div className="art-caption"><span>THE ART OF A CONSIDERED HOME</span><span>01 / OBJECT STUDIES</span></div>}
  </div>;
}

