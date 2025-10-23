import React from 'react';

interface OrdersErrorProps {
  error: string;
  onRetry: () => void;
}

const OrdersError: React.FC<OrdersErrorProps> = ({ error, onRetry }) => (
  <div className="orders-error">
    <h2>Unable to Load Orders</h2>
    <p>{error}</p>
    <button className="retry-button" onClick={onRetry}>
      Try Again
    </button>
  </div>
);

export default OrdersError;
