'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiShoppingCart } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/store/productStore';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking add to cart
    setIsAdding(true);

    try {
      // Use custom callback if provided, otherwise use cart store
      if (onAddToCart) {
        await onAddToCart(product);
      } else {
        addItem(product, 1);
      }

      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : product.discount || 0;

  return (
    <div className="product-card" onClick={handleCardClick}>
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
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/products/${product.id}`);
            }}
          >
            View Details
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
            className={`add-to-cart-button ${isAdding ? 'adding' : ''} ${showSuccess ? 'success' : ''}`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <span className="button-spinner" />
                Adding...
              </>
            ) : showSuccess ? (
              <>
                <span>✓</span>
                Added!
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
