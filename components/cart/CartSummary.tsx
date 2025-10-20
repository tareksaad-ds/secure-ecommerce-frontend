'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import './CartSummary.css';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  onCheckout?: () => void;
}

function CartSummary({
  subtotal,
  shipping,
  tax,
  onCheckout,
}: CartSummaryProps) {
  const router = useRouter();
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      // Default: navigate to auth if not logged in
      router.push('/auth');
    }
  };

  return (
    <div className="cart-summary">
      <h2 className="cart-summary-title">Order Summary</h2>

      <div className="cart-summary-details">
        <div className="summary-row">
          <span className="summary-label">Subtotal</span>
          <span className="summary-value">${subtotal.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Shipping</span>
          <span className="summary-value">
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Tax</span>
          <span className="summary-value">${tax.toFixed(2)}</span>
        </div>

        <div className="summary-divider" />

        <div className="summary-row total-row">
          <span className="summary-label">Total</span>
          <span className="summary-value total-value">${total.toFixed(2)}</span>
        </div>
      </div>

      <button className="checkout-button" onClick={handleCheckout}>
        Proceed to Checkout
      </button>

      <button
        className="continue-shopping-button"
        onClick={() => router.push('/')}
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default CartSummary;
