import { products } from './catalog';
import { ObjectArt } from './ObjectArt';

export function ProductCard({ product, from }: { product: typeof products[number]; from?: string }) {
  const href = `/product/${product.id}${from ? `?from=${encodeURIComponent(from)}` : ''}`;
  return <article className="product-card">
    <div className="product-art"><ObjectArt kind={product.kind} productId={product.id} productHref={href}/><span className="sample-tag">SAMPLE {product.id}</span></div>
    <div className="product-meta">{product.material}<span>{product.category}</span></div>
    <h2><a href={href}>{product.name}</a></h2>
    <a className="product-detail-link" href={href}>View sample details <span aria-hidden="true">↗</span></a>
  </article>;
}
