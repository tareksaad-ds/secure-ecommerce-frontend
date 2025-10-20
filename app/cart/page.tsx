'use client';

import React, { useState } from 'react';
import { Header, Footer } from '@/components/layout';
import { CartItem, CartSummary, EmptyCart } from '@/components/cart';
import type { CartItemData } from '@/components/cart';
import './cart.css';

// Dummy cart data - You'll replace this with real state management later
const initialCartItems: CartItemData[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    price: 199.99,
    quantity: 1,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
    category: 'Electronics',
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    price: 349.99,
    quantity: 2,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop',
    category: 'Wearables',
  },
  {
    id: 5,
    name: 'Ergonomic Office Chair',
    price: 399.99,
    quantity: 1,
    image:
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&h=400&fit=crop',
    category: 'Furniture',
  },
];

export default function CartPage() {
  // Use empty array to see empty state, or initialCartItems to see items
  const [cartItems, setCartItems] = useState<CartItemData[]>(initialCartItems);

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    // eslint-disable-next-line no-console
    console.log('Proceeding to checkout with items:', cartItems);
    // You'll implement checkout logic later
    alert('Checkout functionality will be implemented soon!');
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const tax = subtotal * 0.1; // 10% tax

  const isEmpty = cartItems.length === 0;

  return (
    <div className="cart-page">
      <Header cartItemsCount={cartItems.length} />

      <main className="cart-main">
        <div className="cart-container">
          {/* Page Header */}
          <div className="cart-header">
            <h1 className="cart-title">Shopping Cart</h1>
            {!isEmpty && (
              <p className="cart-count">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>

          {isEmpty ? (
            <EmptyCart />
          ) : (
            <div className="cart-content">
              {/* Cart Items */}
              <div className="cart-items-section">
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <aside className="cart-summary-section">
                <CartSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  onCheckout={handleCheckout}
                />
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
