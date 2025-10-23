import axios from 'axios';
import { create } from 'zustand';

// Product Type based on the data structure
export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice: number;
  imageUrl?: string;
  category?: string;
  discount?: number;
  createdAt: Date;
};

// Product input type for creating/updating products
export type ProductInput = Omit<Product, 'id' | 'createdAt'>;

// Product State Type
type ProductState = {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;

  // CRUD Operations
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: number) => Promise<Product>;
  createProduct: (product: ProductInput) => Promise<Product>;
  updateProduct: (
    id: number,
    product: Partial<ProductInput>
  ) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;

  // Filtering & Search
  filterByCategory: (category: string) => void;
  searchProducts: (query: string) => void;

  // Local State Management
  setSelectedProduct: (product: Product | null) => void;
  clearError: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,

  // Fetch all products
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/products`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Convert createdAt strings to Date objects
      const products = response.data.map((product: Product) => ({
        ...product,
        createdAt: new Date(product.createdAt),
      }));

      set({ products, loading: false });
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch products';

      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to fetch products';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Fetch single product by ID
  fetchProductById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/products/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const product: Product = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
      };

      set({ selectedProduct: product, loading: false });
      return product;
    } catch (err: unknown) {
      let errorMessage = 'Failed to fetch product';

      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Product not found';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Create new product
  createProduct: async (productData: ProductInput) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/products`, productData, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const newProduct: Product = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
      };

      // Add to local state
      set((state) => ({
        products: [...state.products, newProduct],
        loading: false,
      }));

      return newProduct;
    } catch (err: unknown) {
      let errorMessage = 'Failed to create product';

      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to create product';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Update existing product
  updateProduct: async (id: number, productData: Partial<ProductInput>) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/products/${id}`,
        productData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      const updatedProduct: Product = {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
      };

      // Update in local state
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        selectedProduct:
          state.selectedProduct?.id === id
            ? updatedProduct
            : state.selectedProduct,
        loading: false,
      }));

      return updatedProduct;
    } catch (err: unknown) {
      let errorMessage = 'Failed to update product';

      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to update product';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Delete product
  deleteProduct: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      // Remove from local state
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        selectedProduct:
          state.selectedProduct?.id === id ? null : state.selectedProduct,
        loading: false,
      }));
    } catch (err: unknown) {
      let errorMessage = 'Failed to delete product';

      if (axios.isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to delete product';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Filter products by category
  filterByCategory: (category: string) => {
    // This is a client-side filter, you might want to do server-side filtering
    const { products } = get();
    if (!category || category === 'all') {
      // Reset to all products - might need to refetch
      return;
    }
    const filtered = products.filter((p) => p.category === category);
    set({ products: filtered });
  },

  // Search products by query
  searchProducts: (query: string) => {
    // This is a client-side search, you might want to do server-side search
    const { products } = get();
    if (!query) {
      // Reset to all products - might need to refetch
      return;
    }
    const searched = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase())
    );
    set({ products: searched });
  },

  // Set selected product
  setSelectedProduct: (product: Product | null) => {
    set({ selectedProduct: product });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
