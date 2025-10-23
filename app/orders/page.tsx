'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import {
  OrderCard,
  OrdersLoading,
  OrdersError,
  OrdersEmpty,
} from '@/components/orders';
import { useOrderStore } from '@/store/orderStore';
import { useUserStore } from '@/store/userStore';
import './Orders.css';

// Main Orders Page Component
export default function OrdersPage() {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get order store state and actions
  const { orders, loading, error, fetchOrders, clearError } = useOrderStore();

  // Get user store state
  const { isAuthenticated, validateAuth } = useUserStore();

  // Initialize page
  useEffect(() => {
    const initializePage = async () => {
      if (!isAuthenticated) {
        router.push('/auth');
        return;
      }

      try {
        // Validate authentication
        const authValid = validateAuth ? await validateAuth() : false;
        if (!authValid) {
          router.push('/auth');
          return;
        }

        // Fetch orders
        await fetchOrders();
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize orders page:', err);
        setIsInitialized(true);
      }
    };

    initializePage();
  }, [isAuthenticated, validateAuth, fetchOrders, router]);

  // Handle retry
  const handleRetry = async () => {
    clearError();
    try {
      await fetchOrders();
    } catch (err) {
      console.error('Failed to retry fetching orders:', err);
    }
  };

  // Handle view order details
  const handleViewDetails = (orderId: number) => {
    // For now, just log the order ID
    // In the future, you can navigate to a detailed order view
    console.warn('Viewing details for order:', orderId);
    // router.push(`/orders/${orderId}`);
  };

  // Don't render anything while redirecting unauthenticated users
  if (!isAuthenticated) {
    return null;
  }

  // Show loading state
  if (!isInitialized || loading) {
    return (
      <div className="orders-page">
        <Header cartItemsCount={0} />
        <main className="orders-main">
          <div className="orders-container">
            <OrdersLoading />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="orders-page">
        <Header cartItemsCount={0} />
        <main className="orders-main">
          <div className="orders-container">
            <OrdersError error={error} onRetry={handleRetry} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show empty state
  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <Header cartItemsCount={0} />
        <main className="orders-main">
          <div className="orders-container">
            <OrdersEmpty />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show orders list
  return (
    <div className="orders-page">
      <Header cartItemsCount={0} />
      <main className="orders-main">
        <div className="orders-container">
          {/* Page Header */}
          <div className="orders-header">
            <h1 className="orders-title">Your Orders</h1>
            <p className="orders-subtitle">
              Track and manage your order history
            </p>
          </div>

          {/* Orders List */}
          <div className="orders-list">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
