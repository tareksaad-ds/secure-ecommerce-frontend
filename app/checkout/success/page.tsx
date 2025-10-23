'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { useCartStore } from '@/store/cartStore';
import './CheckoutSuccess.css';

export default function CheckoutSuccess() {
  const router = useRouter();
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear cart after successful payment
    clearCart();
  }, [clearCart]);

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleViewOrders = () => {
    // Navigate to orders page when implemented
    router.push('/orders');
  };

  return (
    <div className="checkout-success-page">
      <Header cartItemsCount={0} />

      <main className="checkout-success-main">
        <div className="checkout-success-container">
          <div className="success-content">
            <div className="success-icon">
              <span className="checkmark">✓</span>
            </div>

            <h1 className="success-title">Payment Successful!</h1>

            <p className="success-message">
              Thank you for your purchase. Your order has been processed
              successfully.
            </p>

            <div className="success-details">
              <p>
                You will receive a confirmation email shortly with your order
                details.
              </p>
              <p>Your items will be shipped within 1-2 business days.</p>
            </div>

            <div className="success-actions">
              <button
                className="continue-shopping-btn"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>

              <button className="view-orders-btn" onClick={handleViewOrders}>
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
