'use client';

import React, { useState, useEffect } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';
import { Header, Footer } from '@/components/layout';
import { ProductCard } from '@/components/products';
import { AlertModal } from '@/components/ui';
import { useProductStore, type Product } from '@/store/productStore';
import { useUserStore } from '@/store/userStore';
import './home.css';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  // Get product store and user store
  const { products, loading, error, fetchProducts } = useProductStore();
  const { isAuthenticated } = useUserStore();

  // Fetch products on mount
  useEffect(() => {
    fetchProducts().catch(() => {
      // Error already handled in store
    });
  }, [fetchProducts]);

  // Extract unique categories from products
  const categories = [
    'All',
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const matchesCategory =
      selectedCategory === 'All' ||
      (product.category === selectedCategory &&
        selectedCategory !== undefined &&
        product.category !== undefined);
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    // Check if user is logged in
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    // Add to cart logic (you'll implement with state management later)
    // eslint-disable-next-line no-console
    console.log('Added to cart:', product);

    // TODO: Add to cart state
    // addToCart(product);
  };

  return (
    <div className="home-page">
      {/* Login Required Alert */}
      <AlertModal
        isOpen={showLoginAlert}
        onClose={() => setShowLoginAlert(false)}
        title="Login Required"
        message="Please login or create an account to add items to your cart and start shopping."
        type="warning"
        showLoginButton
      />

      <Header cartItemsCount={0} />

      {/* Main Content */}
      <main className="home-main">
        <div className="container">
          {/* Hero Section */}
          <section className="hero-section">
            <h2 className="hero-title">Discover Amazing Products</h2>
            <p className="hero-subtitle">
              Shop the latest trends and best deals on quality products
            </p>
          </section>

          {/* Filters & Search */}
          <section className="filters-section">
            <div className="search-container">
              <FiSearch className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="categories-filter">
              <FiFilter size={20} />
              <div className="category-buttons">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category as string)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="products-section">
            <div className="products-header">
              <h3 className="section-title">
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
              </h3>
              <p className="products-count">
                {filteredProducts.length}{' '}
                {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="loading-state">
                <div className="spinner" />
                <p>Loading products...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="error-state">
                <p className="error-message">{error}</p>
                <button
                  className="retry-button"
                  onClick={() => fetchProducts()}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

            {/* No Products */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
