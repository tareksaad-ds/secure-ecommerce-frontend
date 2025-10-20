'use client';

import React from 'react';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import './ProductCard.css';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice: number;
  imageUrl?: string;
  category?: string;
  discount?: number;
  createdAt: Date;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    if (onAddToCart) {
      await onAddToCart(product);
    }
    setTimeout(() => setIsAdding(false), 500);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : product.discount || 0;

  return (
    <div className="product-card">
      {/* Image Container */}
      <div className="product-image-container">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/150'}
          alt={product.name}
          className="product-image"
        />

        {/* Badges */}
        <div className="product-badges">
          {discountPercentage > 0 && (
            <span className="badge badge-discount">-{discountPercentage}%</span>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className="product-overlay">
          <button
            className="quick-view-button"
            onClick={() => {
              /* TODO: Implement quick view functionality */
            }}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        {/* Category */}
        <span className="product-category">{product.category}</span>

        {/* Name */}
        <h3 className="product-name">{product.name}</h3>

        {/* Description */}
        <p className="product-description">{product.description}</p>

        {/* Price & Actions */}
        <div className="product-footer">
          <div className="product-price">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original-price">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            className={`add-to-cart-button ${isAdding ? 'adding' : ''}`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <span className="button-spinner" />
                Adding...
              </>
            ) : (
              <>
                <FiShoppingCart size={18} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
