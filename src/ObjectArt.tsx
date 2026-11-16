export function ObjectArt({ kind, hero = false }: { kind: string; hero?: boolean }) {
  return <div className={`object-art ${kind} ${hero ? 'hero-art' : ''}`} role="img" aria-label={hero ? 'Illustrative arrangement of decorative vessels in warm brass and terracotta tones' : `Concept illustration for ${kind} collection; not a product photograph`}>
    <div className="art-light"/><div className="art-plinth"/>
    {kind === 'chess' ? <div className="chess-pieces"><span>♟</span><span>♞</span><span>♜</span></div> : <><div className="vessel vessel-back"/><div className="vessel vessel-front"/><div className="art-branch"><i/><i/><i/></div></>}
    {hero && <div className="art-caption"><span>THE ART OF A CONSIDERED HOME</span><span>01 / OBJECT STUDIES</span></div>}
  </div>;
}

