import axios from 'axios';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useCartStore } from './cartStore';
import type { Product } from './productStore';

// Order Types based on the database schema
export type CreateOrderDto = {
  productIds: number[];
  totalAmount: number;
};

export type Order = {
  id: number;
  userId: number;
  createdAt: Date;
  totalAmount: number;
  productIds: number[];
  user: {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: 'admin' | 'customer' | 'guest';
  };
  products: Product[];
};

// Order State Type
type OrderState = {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;

  // Order Actions
  createOrder: (orderData: CreateOrderDto) => Promise<Order>;
  fetchOrders: () => Promise<void>;
  getOrderById: (orderId: number) => Order | undefined;

  // Utility
  clearError: () => void;
  clearCurrentOrder: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Validation function matching the DTO constraints
const validateCreateOrderDto = (
  orderData: CreateOrderDto
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate productIds array
  if (!Array.isArray(orderData.productIds)) {
    errors.push('Product IDs must be an array');
  } else {
    if (orderData.productIds.length < 1) {
      errors.push('At least one product is required');
    }

    // Check if each product ID is a number
    const invalidIds = orderData.productIds.filter(
      (id) => typeof id !== 'number' || isNaN(id)
    );
    if (invalidIds.length > 0) {
      errors.push('Each product ID must be a number');
    }
  }

  // Validate totalAmount
  if (
    typeof orderData.totalAmount !== 'number' ||
    isNaN(orderData.totalAmount)
  ) {
    errors.push('Total amount must be a number');
  } else if (orderData.totalAmount <= 0) {
    errors.push('Total amount must be greater than 0');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      loading: false,
      error: null,
      lastFetched: null,

      // Create a new order
      createOrder: async (orderData: CreateOrderDto): Promise<Order> => {
        // Validate the order data
        const validation = validateCreateOrderDto(orderData);
        if (!validation.isValid) {
          const errorMessage = validation.errors.join(', ');
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }

        set({ loading: true, error: null });

        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Authentication required to create order');
          }

          const response = await axios.post(`${API_URL}/orders`, orderData, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          const newOrder: Order = {
            ...response.data,
            createdAt: new Date(response.data.createdAt),
          };

          // Add the new order to the store
          set((state) => ({
            orders: [newOrder, ...state.orders],
            currentOrder: newOrder,
            loading: false,
            lastFetched: new Date(),
          }));

          // Clear the cart after successful order creation
          useCartStore.getState().clearCart();

          return newOrder;
        } catch (err: unknown) {
          let errorMessage = 'Failed to create order';

          if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
              errorMessage = 'Authentication required to create order';
            } else if (err.response?.status === 400) {
              errorMessage = err.response.data?.message || 'Invalid order data';
            } else if (err.response?.status === 422) {
              errorMessage =
                err.response.data?.message || 'Order validation failed';
            } else {
              errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to create order';
            }
          } else if (err instanceof Error) {
            errorMessage = err.message;
          }

          set({
            error: errorMessage,
            loading: false,
          });

          throw new Error(errorMessage);
        }
      },

      // Fetch all orders for the current user
      fetchOrders: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ error: 'Authentication required to fetch orders' });
          return;
        }

        set({ loading: true, error: null });

        try {
          const response = await axios.get(`${API_URL}/orders/my-orders`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          const orders: Order[] = response.data.map((order: Order) => ({
            ...order,
            createdAt: new Date(order.createdAt),
          }));

          set({
            orders,
            loading: false,
            lastFetched: new Date(),
          });
        } catch (err: unknown) {
          let errorMessage = 'Failed to fetch orders';

          if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
              errorMessage = 'Authentication required to fetch orders';
            } else {
              errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to fetch orders';
            }
          } else if (err instanceof Error) {
            errorMessage = err.message;
          }

          set({
            error: errorMessage,
            loading: false,
          });
        }
      },

      // Get order by ID
      getOrderById: (orderId: number) => {
        return get().orders.find((order) => order.id === orderId);
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Clear current order
      clearCurrentOrder: () => {
        set({ currentOrder: null });
      },
    }),
    {
      name: 'order-storage', // Key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        orders: state.orders,
        lastFetched: state.lastFetched,
      }), // Only persist orders and lastFetched
    }
  )
);
