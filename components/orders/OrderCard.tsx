import React from 'react';
import OrderItem from './OrderItem';

interface OrderCardProps {
  order: {
    id: number;
    createdAt: Date;
    totalAmount: number;
    products: Array<{
      id: number;
      name: string;
      price: number;
      imageUrl?: string;
      category?: string;
    }>;
    status?: string;
  };
  onViewDetails: (orderId: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadge = (status?: string) => {
    const statusConfig = {
      pending: { color: '#856404', bg: '#fff3cd', border: '#ffeaa7' },
      processing: { color: '#0c5460', bg: '#d1ecf1', border: '#bee5eb' },
      shipped: { color: '#721c24', bg: '#f8d7da', border: '#f5c6cb' },
      delivered: { color: '#155724', bg: '#d4edda', border: '#c3e6cb' },
      cancelled: { color: '#721c24', bg: '#f8d7da', border: '#f5c6cb' },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className="status-badge"
        style={{
          color: config.color,
          backgroundColor: config.bg,
          borderColor: config.border,
        }}
      >
        {status || 'pending'}
      </span>
    );
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-info">
          <h3 className="order-id">Order #{order.id}</h3>
          <p className="order-date">{formatDate(order.createdAt)}</p>
        </div>
        <div className="order-total">
          <span className="total-label">Total</span>
          <span className="total-amount">${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="order-items">
        <h4 className="items-title">Items ({order.products.length})</h4>
        <div className="items-list">
          {order.products.slice(0, 3).map((product) => (
            <OrderItem
              key={product.id}
              product={product}
              quantity={1} // Assuming quantity is 1 for now, can be enhanced later
            />
          ))}
          {order.products.length > 3 && (
            <div className="more-items">
              +{order.products.length - 3} more items
            </div>
          )}
        </div>
      </div>

      <div className="order-footer">
        <div className="order-status">{getStatusBadge(order.status)}</div>
        <div className="order-actions">
          <button
            className="view-details-button"
            onClick={() => onViewDetails(order.id)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
