import { useState } from 'react';
import { products } from './catalog';

const photos: Record<string, { file: string; alt: string }> = {
  brass: { file: 'brass-vase', alt: 'Engraved brass vase with a rounded body, photographed in a museum' },
  wood: { file: 'wood-vase', alt: 'Carved dark wooden vessel with a decorative lid' },
  copper: { file: 'copper-vessel', alt: 'Copper bottle and its lid on a wooden surface' },
  chess: { file: 'wood-chess', alt: 'Carved wooden chess pieces arranged on a chessboard' },
  ceramic: { file: 'ceramic-vase', alt: 'Decorative ceramic flower vase' },
  glass: { file: 'glass-vase', alt: 'Decorative glass vase photographed against a plain background' },
  stone: { file: 'stone-vase', alt: 'Historic marble vase with a high foot and four lug handles' },
};

export function ObjectArt({ kind, hero = false, productId, productHref }: { kind: string; hero?: boolean; productId?: string; productHref?: string }) {
  const product = products.find(item => item.id === productId);
  const photo = product ? { file: product.image, alt: product.alt } : photos[kind];
  // A failed image is tracked by filename so a different filtered item can still load.
  const [failedFile, setFailedFile] = useState('');
  const photoImage = photo && <img className="reference-image" src={`/images/reference/${photo.file}.jpg`} alt={photo.alt} loading={hero ? 'eager' : 'lazy'} decoding="async" onError={() => setFailedFile(photo.file)}/>;
  if (photo && failedFile !== photo.file) return <div className={`object-art reference-photo ${hero ? 'hero-art' : ''}`}>
    {productHref ? <a className="photo-product-link" href={productHref} aria-label={`View ${product?.name || 'object'} details`}>{photoImage}</a> : photoImage}
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

