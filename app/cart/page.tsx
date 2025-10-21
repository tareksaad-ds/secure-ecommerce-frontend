'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { CartItem, CartSummary, EmptyCart } from '@/components/cart';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import './cart.css';

export default function CartPage() {
  const router = useRouter();

  // Get cart state and actions from store
  const {
    items: cartItems,
    updateQuantity,
    removeItem,
    getTotals,
    getItemCount,
    clearCart,
    mergeLocalCartWithServer,
  } = useCartStore();

  // Get user state
  const { isAuthenticated } = useUserStore();

  // Merge cart with server on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && cartItems.length > 0) {
      mergeLocalCartWithServer().catch(() => {
        // Silently fail - local cart will still work
      });
    }
  }, [isAuthenticated, mergeLocalCartWithServer]);

  // Convert CartItem to CartItemData for component compatibility
  const cartItemsData = cartItems.map((item) => ({
    id: item.productId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    category: item.category,
  }));

  const handleUpdateQuantity = (id: number, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: number) => {
    removeItem(id);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to auth page if not logged in
      router.push('/auth');
      return;
    }

    // Proceed to checkout
    // eslint-disable-next-line no-console
    console.log('Proceeding to checkout with items:', cartItems);
    // TODO: Navigate to checkout page when implemented
    alert('Checkout functionality will be implemented soon!');
  };

  // Get calculated totals from store
  const { subtotal, shipping, tax } = getTotals();
  const itemCount = getItemCount();
  const isEmpty = cartItems.length === 0;

  return (
    <div className="cart-page">
      <Header cartItemsCount={itemCount} />

      <main className="cart-main">
        <div className="cart-container">
          {/* Page Header */}
          <div className="cart-header">
            <h1 className="cart-title">Shopping Cart</h1>
            {!isEmpty && (
              <p className="cart-count">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
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
                  {cartItemsData.map((item) => (
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
