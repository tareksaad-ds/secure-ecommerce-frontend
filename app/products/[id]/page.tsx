'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiChevronLeft,
} from 'react-icons/fi';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import './productDetails.css';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id ? parseInt(params.id as string) : null;

  const { selectedProduct, loading, error, fetchProductById } =
    useProductStore();
  const { addItem, isInCart } = useCartStore();
  const { isAuthenticated } = useUserStore();

  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Fetch product on mount
  useEffect(() => {
    if (productId) {
      fetchProductById(productId).catch((err) => {
        console.error('Failed to fetch product:', err);
      });
    }
  }, [productId, fetchProductById]);

  // Set selected image when product loads
  useEffect(() => {
    if (selectedProduct?.imageUrl) {
      setSelectedImage(selectedProduct.imageUrl);
    }
  }, [selectedProduct]);

  // Handle quantity changes
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedProduct) return;

    // Require authentication
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    setIsAddingToCart(true);
    try {
      addItem(selectedProduct, quantity);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Calculate discount percentage
  const discountPercentage = selectedProduct?.originalPrice
    ? Math.round(
        ((selectedProduct.originalPrice - selectedProduct.price) /
          selectedProduct.originalPrice) *
          100
      )
    : 0;

  // Loading state
  if (loading) {
    return (
      <div className="product-details-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !selectedProduct) {
    return (
      <div className="product-details-container">
        <div className="error-state">
          <h2>Product Not Found</h2>
          <p>{error || 'The product you are looking for does not exist.'}</p>
          <button className="back-button" onClick={() => router.push('/')}>
            <FiChevronLeft /> Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <button onClick={() => router.push('/')}>Home</button>
        <span>/</span>
        <button onClick={() => router.push('/')}>Products</button>
        <span>/</span>
        <span className="current">{selectedProduct.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="product-details-grid">
        {/* Image Gallery Section */}
        <div className="product-gallery">
          <div className="main-image-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage || 'https://via.placeholder.com/500'}
              alt={selectedProduct.name}
              className="main-image"
            />
            {discountPercentage > 0 && (
              <span className="discount-badge">-{discountPercentage}%</span>
            )}
          </div>

          {/* Thumbnail Gallery (if you have multiple images) */}
          <div className="thumbnail-gallery">
            <button
              className={`thumbnail ${selectedImage === selectedProduct.imageUrl ? 'active' : ''}`}
              onClick={() => setSelectedImage(selectedProduct.imageUrl || '')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  selectedProduct.imageUrl || 'https://via.placeholder.com/100'
                }
                alt="Product view 1"
              />
            </button>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="product-info-section">
          {/* Category & Status */}
          <div className="product-meta">
            <span className="category-badge">{selectedProduct.category}</span>
            {isInCart(selectedProduct.id) && (
              <span className="in-cart-badge">In Cart</span>
            )}
          </div>

          {/* Product Name */}
          <h1 className="product-title">{selectedProduct.name}</h1>

          {/* Product Description */}
          <p className="product-description">{selectedProduct.description}</p>

          {/* Price Section */}
          <div className="price-section">
            <div className="price-container">
              <span className="current-price">
                ${selectedProduct.price.toFixed(2)}
              </span>
              {selectedProduct.originalPrice && (
                <span className="original-price">
                  ${selectedProduct.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <p className="savings-text">
                You save $
                {(
                  selectedProduct.originalPrice - selectedProduct.price
                ).toFixed(2)}{' '}
                ({discountPercentage}%)
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="quantity-section">
            <label className="quantity-label">Quantity:</label>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                className="quantity-input"
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                min="1"
              />
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className={`add-to-cart-btn ${isAddingToCart ? 'loading' : ''} ${showSuccess ? 'success' : ''}`}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <span className="btn-spinner"></span>
                  Adding...
                </>
              ) : showSuccess ? (
                <>
                  <span>✓</span>
                  Added to Cart!
                </>
              ) : (
                <>
                  <FiShoppingCart size={20} />
                  Add to Cart
                </>
              )}
            </button>

            <button className="wishlist-btn" title="Add to Wishlist">
              <FiHeart size={20} />
            </button>

            <button className="share-btn" title="Share Product">
              <FiShare2 size={20} />
            </button>
          </div>

          {/* Product Details */}
          <div className="product-details-list">
            <h3>Product Details</h3>
            <ul>
              <li>
                <span className="detail-label">Product ID:</span>
                <span className="detail-value">#{selectedProduct.id}</span>
              </li>
              <li>
                <span className="detail-label">Category:</span>
                <span className="detail-value">{selectedProduct.category}</span>
              </li>
              <li>
                <span className="detail-label">Availability:</span>
                <span className="detail-value in-stock">In Stock</span>
              </li>
              <li>
                <span className="detail-label">Added:</span>
                <span className="detail-value">
                  {new Date(selectedProduct.createdAt).toLocaleDateString()}
                </span>
              </li>
            </ul>
          </div>

          {/* Shipping Info */}
          <div className="shipping-info">
            <h3>Shipping Information</h3>
            <ul>
              <li>✓ Free shipping on orders over $100</li>
              <li>✓ Express delivery available</li>
              <li>✓ 30-day return policy</li>
              <li>✓ Secure checkout</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Additional Information Tabs */}
      <div className="product-tabs">
        <div className="tabs-header">
          <button className="tab-button active">Description</button>
          <button className="tab-button">Specifications</button>
          <button className="tab-button">Reviews</button>
        </div>
        <div className="tabs-content">
          <div className="tab-panel active">
            <h3>Product Description</h3>
            <p>
              {selectedProduct.description ||
                'No detailed description available.'}
            </p>
            <p>
              This is a high-quality product that meets all your needs.
              Experience the best in class service and product quality with our
              carefully curated selection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
