import React from 'react';
import { useRouter } from 'next/navigation';

const OrdersEmpty: React.FC = () => {
  const router = useRouter();

  return (
    <div className="orders-empty">
      <div className="empty-icon">📦</div>
      <h2>No Orders Yet</h2>
      <p>
        You haven&apos;t placed any orders yet. Start shopping to see your
        orders here.
      </p>
      <button className="shop-button" onClick={() => router.push('/')}>
        Start Shopping
      </button>
    </div>
  );
};

export default OrdersEmpty;
