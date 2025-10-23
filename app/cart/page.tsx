'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { CartItem, CartSummary, EmptyCart } from '@/components/cart';
import { PaymentForm } from '@/components/payment';
import { Modal } from '@/components/ui';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useOrderStore } from '@/store/orderStore';
import './cart.css';

export default function CartPage() {
  const router = useRouter();
  const [showPayment, setShowPayment] = useState(false);

  // Get cart state and actions from store
  const {
    items: cartItems,
    updateQuantity,
    removeItem,
    getTotals,
    getItemCount,
    mergeLocalCartWithServer,
    clearCart,
  } = useCartStore();

  // Get user state
  const { isAuthenticated, validateAuth } = useUserStore();

  // Get order store
  const { createOrder } = useOrderStore();

  // Merge cart with server on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && cartItems.length > 0) {
      mergeLocalCartWithServer().catch(() => {
        // Silently fail - local cart will still work
      });
    }
  }, [cartItems.length, isAuthenticated, mergeLocalCartWithServer]);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

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
  const handleCheckout = async () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentIntent: unknown) => {
    console.warn('Payment successful:', paymentIntent);

    try {
      // Validate authentication before creating order
      const authValid = validateAuth ? await validateAuth() : false;

      if (!authValid) {
        throw new Error('Authentication required to create order');
      }

      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      // Create order data according to DTO structure
      const orderData = {
        productIds: cartItems.map((item) => item.productId),
        totalAmount: getTotals().total,
      };

      console.warn('Creating order with data:', orderData);

      // Create the order
      const newOrder = await createOrder(orderData);
      console.warn('Order created successfully:', newOrder);

      // Clear the cart after successful order creation
      clearCart();

      // Redirect to success page
      router.push('/checkout/success');
    } catch (error) {
      console.error('Failed to create order:', error);

      // Show user-friendly error message
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create order';
      alert(`Payment successful, but ${errorMessage}. Please contact support.`);

      // Still clear cart and redirect since payment was successful
      clearCart();
      router.push('/checkout/success');
    }
  };

  const handlePaymentError = (error: unknown) => {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
  };
  // Get calculated totals from store
  const { subtotal, shipping, tax } = getTotals();
  const itemCount = getItemCount();
  const isEmpty = cartItems.length === 0;

  // Do not render page content while redirecting unauthenticated users
  if (!isAuthenticated) {
    return null;
  }

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

      {/* Payment Modal */}
      <Modal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        title="Complete Payment"
      >
        <PaymentForm
          amount={subtotal + shipping + tax}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </Modal>
    </div>
  );
}
