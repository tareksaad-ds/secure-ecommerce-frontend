import axios from 'axios';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from './productStore';

// Cart Item Type
export type CartItem = {
  id: number;
  productId: number;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  category: string;
  discount?: number;
  maxStock?: number; // Optional: to prevent adding more than available
};

// Cart Totals
export type CartTotals = {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
};

// Cart State Type
type CartState = {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  lastSynced: Date | null;

  // Cart Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;

  // Cart Calculations
  getItemCount: () => number;
  getTotals: () => CartTotals;
  getItemById: (productId: number) => CartItem | undefined;
  isInCart: (productId: number) => boolean;

  // API Sync (for authenticated users)
  syncCartWithServer: () => Promise<void>;
  fetchCartFromServer: () => Promise<void>;
  mergeLocalCartWithServer: () => Promise<void>;

  // Utility
  clearError: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TAX_RATE = 0.1; // 10% tax
const FREE_SHIPPING_THRESHOLD = 100; // Free shipping over $100
const SHIPPING_COST = 15;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      error: null,
      lastSynced: null,

      // Add item to cart
      addItem: (product: Product, quantity: number = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.productId === product.id
        );

        if (existingItem) {
          // Update quantity if item already exists
          const newQuantity = existingItem.quantity + quantity;
          set({
            items: currentItems.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
        } else {
          // Add new item
          const cartItem: CartItem = {
            id: Date.now(), // Temporary ID for local cart
            productId: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            quantity,
            image: product.imageUrl || '/placeholder.png',
            category: product.category || 'Uncategorized',
            discount: product.discount,
          };

          set({
            items: [...currentItems, cartItem],
          });
        }

        // Auto-sync with server if user is authenticated
        const token = localStorage.getItem('token');
        if (token) {
          get()
            .syncCartWithServer()
            .catch(() => {
              // Silently fail - cart is still saved locally
            });
        }
      },

      // Remove item from cart
      removeItem: (productId: number) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });

        // Auto-sync with server
        const token = localStorage.getItem('token');
        if (token) {
          get()
            .syncCartWithServer()
            .catch(() => {
              // Silently fail
            });
        }
      },

      // Update item quantity
      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        });

        // Auto-sync with server
        const token = localStorage.getItem('token');
        if (token) {
          get()
            .syncCartWithServer()
            .catch(() => {
              // Silently fail
            });
        }
      },

      // Increase quantity by 1
      increaseQuantity: (productId: number) => {
        const item = get().items.find((i) => i.productId === productId);
        if (item) {
          get().updateQuantity(productId, item.quantity + 1);
        }
      },

      // Decrease quantity by 1
      decreaseQuantity: (productId: number) => {
        const item = get().items.find((i) => i.productId === productId);
        if (item && item.quantity > 1) {
          get().updateQuantity(productId, item.quantity - 1);
        } else if (item && item.quantity === 1) {
          get().removeItem(productId);
        }
      },

      // Clear entire cart
      clearCart: () => {
        set({ items: [], error: null });

        // Auto-sync with server
        const token = localStorage.getItem('token');
        if (token) {
          get()
            .syncCartWithServer()
            .catch(() => {
              // Silently fail
            });
        }
      },

      // Get total number of items in cart
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Calculate cart totals
      getTotals: (): CartTotals => {
        const items = get().items;
        const subtotal = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        const shipping =
          subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        const tax = subtotal * TAX_RATE;
        const discount = 0; // Can be extended for coupon codes
        const total = subtotal + shipping + tax - discount;

        return {
          subtotal,
          shipping,
          tax,
          discount,
          total,
        };
      },

      // Get specific item by product ID
      getItemById: (productId: number) => {
        return get().items.find((item) => item.productId === productId);
      },

      // Check if product is in cart
      isInCart: (productId: number) => {
        return get().items.some((item) => item.productId === productId);
      },

      // Sync cart with server
      syncCartWithServer: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const items = get().items;
          await axios.post(
            `${API_URL}/cart/sync`,
            { items },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          set({ lastSynced: new Date() });
        } catch (err: unknown) {
          let errorMessage = 'Failed to sync cart';

          if (axios.isAxiosError(err)) {
            errorMessage =
              err.response?.data?.message ||
              err.response?.data?.error ||
              'Cart sync failed';
          }

          set({ error: errorMessage });
        }
      },

      // Fetch cart from server (for authenticated users)
      fetchCartFromServer: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ error: 'Not authenticated' });
          return;
        }

        set({ loading: true, error: null });
        try {
          const response = await axios.get(`${API_URL}/cart`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          const serverItems: CartItem[] = response.data.items || [];
          set({
            items: serverItems,
            loading: false,
            lastSynced: new Date(),
          });
        } catch (err: unknown) {
          let errorMessage = 'Failed to fetch cart';

          if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) {
              // No cart found on server, use local cart
              set({ loading: false });
              return;
            }

            errorMessage =
              err.response?.data?.message ||
              err.response?.data?.error ||
              'Failed to fetch cart';
          }

          set({ error: errorMessage, loading: false });
        }
      },

      // Merge local cart with server cart (useful after login)
      mergeLocalCartWithServer: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const localItems = get().items;
        if (localItems.length === 0) {
          // No local items to merge, just fetch from server
          await get().fetchCartFromServer();
          return;
        }

        set({ loading: true, error: null });
        try {
          // Send local cart to server for merging
          const response = await axios.post(
            `${API_URL}/cart/merge`,
            { items: localItems },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const mergedItems: CartItem[] = response.data.items || [];
          set({
            items: mergedItems,
            loading: false,
            lastSynced: new Date(),
          });
        } catch (err: unknown) {
          let errorMessage = 'Failed to merge cart';

          if (axios.isAxiosError(err)) {
            errorMessage =
              err.response?.data?.message ||
              err.response?.data?.error ||
              'Failed to merge cart';
          }

          set({ error: errorMessage, loading: false });

          // On error, keep local cart and try to sync
          await get().syncCartWithServer();
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'cart-storage', // Key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        lastSynced: state.lastSynced,
      }), // Only persist items and lastSynced
    }
  )
);
