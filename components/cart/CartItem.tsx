'use client';

import React from 'react';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import './CartItem.css';

export interface CartItemData {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      {/* Product Image */}
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>

      {/* Product Details */}
      <div className="cart-item-details">
        <div className="cart-item-info">
          <span className="cart-item-category">{item.category}</span>
          <h3 className="cart-item-name">{item.name}</h3>
          <p className="cart-item-price">${item.price.toFixed(2)}</p>
        </div>

        {/* Quantity Controls */}
        <div className="cart-item-actions">
          <div className="quantity-controls">
            <button
              className="quantity-button"
              onClick={handleDecrease}
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
            >
              <FiMinus size={16} />
            </button>
            <span className="quantity-display">{item.quantity}</span>
            <button
              className="quantity-button"
              onClick={handleIncrease}
              aria-label="Increase quantity"
            >
              <FiPlus size={16} />
            </button>
          </div>

          {/* Subtotal */}
          <div className="cart-item-subtotal">
            <span className="subtotal-label">Subtotal:</span>
            <span className="subtotal-price">${subtotal.toFixed(2)}</span>
          </div>

          {/* Remove Button */}
          <button
            className="remove-button"
            onClick={() => onRemove(item.id)}
            aria-label="Remove item"
          >
            <FiTrash2 size={18} />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
