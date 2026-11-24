import React, { useState } from 'react';
import { ObjectArt } from './ObjectArt';
import { SaveButton } from './WishlistContext';
import { useCommerce } from './CommerceContext';

export type ProductCardItem = {
  id: string;
  name: string;
  category: string;
  material: string;
  kind: string;
  image: string;
  alt: string;
  price?: number | null;
  currency?: string;
  availability?: string;
};

export function ProductCard({ product, from }: { product: ProductCardItem; from?: string }) {
  const { formatPrice, add } = useCommerce();
  const [added, setAdded] = useState(false);
  const href = `/product/${product.id}${from ? `?from=${encodeURIComponent(from)}` : ''}`;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="product-card">
      <div className="product-art">
        <ObjectArt kind={product.kind} productId={product.id} productHref={href} />
        <span className="sample-tag">{product.material}</span>
        <SaveButton id={product.id} name={product.name} compact />
      </div>
      <div className="product-card-content">
        <div className="product-meta">
          <span className="product-material-tag">{product.material} · Handcrafted</span>
          <span className="product-category-tag">{product.category}</span>
        </div>
        <h2 className="product-card-title">
          <a href={href}>{product.name}</a>
        </h2>
        <div className="product-card-bottom">
          <span className="product-card-price">
            {product.price == null ? 'Price on request' : formatPrice(product.price)}
          </span>
          <span className={`product-stock ${product.availability === 'In stock' ? 'is-in-stock' : product.availability === 'Out of stock' ? 'is-out-of-stock' : ''}`}>
            {product.availability === 'In stock' ? '● In stock' : product.availability === 'Out of stock' ? '○ Out of stock' : '● Ready to ship'}
          </span>
        </div>
        <div className="product-card-actions">
          <a className="product-detail-link" href={href}>View details <span aria-hidden="true">↗</span></a>
          <button 
            type="button" 
            className={`product-quick-add ${added ? 'is-added' : ''}`}
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? '✓ Added' : '+ Add to bag'}
          </button>
        </div>
      </div>
    </article>
  );
}
