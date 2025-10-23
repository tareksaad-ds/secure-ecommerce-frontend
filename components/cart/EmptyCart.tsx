'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiShoppingCart } from 'react-icons/fi';
import './EmptyCart.css';

function EmptyCart() {
  const router = useRouter();

  return (
    <div className="empty-cart">
      <div className="empty-cart-icon">
        <FiShoppingCart size={80} />
      </div>
      <h2 className="empty-cart-title">Your Cart is Empty</h2>
      <p className="empty-cart-message">
        Looks like you haven&apos;t added anything to your cart yet. Start
        shopping to fill it up!
      </p>
      <button className="shop-now-button" onClick={() => router.push('/')}>
        Start Shopping
      </button>
    </div>
  );
}

export default EmptyCart;
