import React from 'react';

interface OrderItemProps {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    category?: string;
  };
  quantity: number;
}

const OrderItem: React.FC<OrderItemProps> = ({ product, quantity }) => {
  return (
    <div className="order-item">
      <div className="item-image">
        <img
          src={product.imageUrl || '/placeholder.png'}
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.png';
          }}
        />
      </div>
      <div className="item-details">
        <h4 className="item-name">{product.name}</h4>
        {product.category && (
          <p className="item-category">{product.category}</p>
        )}
        <div className="item-quantity">
          <span>Quantity: {quantity}</span>
          <span className="item-price">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
