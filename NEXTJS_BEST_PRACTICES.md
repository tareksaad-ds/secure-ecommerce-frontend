# Next.js E-Commerce Best Practices Guide

## 📁 Recommended Folder Structure

```
frontend/
├── app/                          # Next.js App Router (main application)
│   ├── (auth)/                   # Route group for authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (shop)/                   # Route group for shop pages
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── orders/
│   ├── (admin)/                  # Route group for admin pages
│   │   └── dashboard/
│   ├── api/                      # API routes
│   │   ├── products/
│   │   ├── auth/
│   │   ├── orders/
│   │   └── webhooks/
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── globals.css
│   ├── error.tsx                 # Error boundary
│   ├── loading.tsx               # Loading UI
│   └── not-found.tsx             # 404 page
│
├── components/                   # Reusable components
│   ├── ui/                       # Basic UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   └── Modal/
│   ├── layout/                   # Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Sidebar/
│   │   └── Navigation/
│   ├── product/                  # Product-related components
│   │   ├── ProductCard/
│   │   ├── ProductGrid/
│   │   ├── ProductDetails/
│   │   └── ProductFilters/
│   ├── cart/                     # Cart components
│   │   ├── CartItem/
│   │   ├── CartSummary/
│   │   └── CartDrawer/
│   └── shared/                   # Shared components
│       ├── LoadingSpinner/
│       ├── ErrorMessage/
│       └── Pagination/
│
├── lib/                          # Utility functions and configurations
│   ├── utils.ts                  # Helper functions
│   ├── api.ts                    # API client
│   ├── validations.ts            # Validation schemas (Zod)
│   ├── constants.ts              # App constants
│   └── db.ts                     # Database client (if using)
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useDebounce.ts
│
├── store/                        # State management (Redux/Zustand)
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── cartSlice.ts
│   │   └── productSlice.ts
│   └── store.ts
│
├── types/                        # TypeScript type definitions
│   ├── product.ts
│   ├── user.ts
│   ├── order.ts
│   └── api.ts
│
├── services/                     # Business logic and API services
│   ├── productService.ts
│   ├── authService.ts
│   ├── orderService.ts
│   └── paymentService.ts
│
├── config/                       # Configuration files
│   ├── site.ts                   # Site metadata
│   ├── navigation.ts             # Navigation config
│   └── seo.ts                    # SEO config
│
├── styles/                       # Global styles and themes
│   ├── themes/
│   └── variables.css
│
├── public/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── tests/                        # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local                    # Environment variables
├── .env.example                  # Example env file
├── middleware.ts                 # Next.js middleware (auth, etc.)
└── next.config.ts
```

---

## 🎯 Core Best Practices

### 1. **Use TypeScript Everywhere**

✅ **DO:**

```typescript
// types/product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
  category: string;
}

// components/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  // Component logic
}
```

❌ **DON'T:**

```typescript
// Avoid 'any' type
export default function ProductCard({ product }: any) {
  // Bad practice
}
```

---

### 2. **Component Organization**

#### **Folder-per-Component Pattern**

```
components/
└── ProductCard/
    ├── ProductCard.tsx           # Main component
    ├── ProductCard.test.tsx      # Tests
    ├── ProductCard.module.css    # Styles (if using CSS modules)
    ├── types.ts                  # Component-specific types
    └── index.ts                  # Barrel export
```

✅ **DO:**

```typescript
// components/ProductCard/ProductCard.tsx
'use client'; // Only if needed

import styles from './ProductCard.module.css';
import { type ProductCardProps } from './types';

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className={styles.card}>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}

// components/ProductCard/index.ts
export { ProductCard } from './ProductCard';
export type { ProductCardProps } from './types';
```

---

### 3. **Server Components by Default**

✅ **DO: Use Server Components for Data Fetching**

```typescript
// app/products/page.tsx
import { ProductGrid } from '@/components/product/ProductGrid';

// This is a Server Component (default in App Router)
export default async function ProductsPage() {
  // Fetch directly in component
  const products = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // ISR: Revalidate every hour
  }).then((res) => res.json());

  return (
    <div>
      <h1>Our Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}
```

❌ **DON'T: Use Client Component for Everything**

```typescript
// Avoid this pattern
'use client';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products').then(/* ... */);
  }, []);

  // This creates unnecessary client-side work
}
```

---

### 4. **Use Client Components Only When Needed**

Use `'use client'` only for:

- Interactive components (buttons, forms)
- Components using React hooks (useState, useEffect)
- Event handlers
- Browser APIs

✅ **DO:**

```typescript
// components/cart/AddToCartButton.tsx
'use client';

import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    // Add to cart logic
    setIsLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

---

### 5. **API Routes Best Practices**

✅ **DO: Use Route Handlers (App Router)**

```typescript
// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

// GET /api/products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const products = await db.product.findMany({
      where: category ? { category } : undefined,
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate with Zod
    const productSchema = z.object({
      name: z.string().min(1),
      price: z.number().positive(),
      stock: z.number().min(0),
    });

    const validated = productSchema.parse(body);

    const product = await db.product.create({
      data: validated,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
```

---

### 6. **Environment Variables**

✅ **DO: Use Proper Naming Convention**

```bash
# .env.local

# Public variables (accessible in browser) - must start with NEXT_PUBLIC_
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Private variables (server-only)
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@example.com
```

```typescript
// config/env.ts
export const env = {
  // Public
  apiUrl: process.env.NEXT_PUBLIC_API_URL!,
  stripeKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,

  // Private (only use in server components/API routes)
  databaseUrl: process.env.DATABASE_URL!,
  stripeSecret: process.env.STRIPE_SECRET_KEY!,
  jwtSecret: process.env.JWT_SECRET!,
};

// Validate on startup
if (!env.apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');
```

---

### 7. **Error Handling**

✅ **DO: Create Error Boundaries**

```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

```typescript
// app/products/[id]/not-found.tsx
export default function ProductNotFound() {
  return (
    <div>
      <h2>Product Not Found</h2>
      <p>The product you're looking for doesn't exist.</p>
    </div>
  );
}
```

---

### 8. **Loading States**

✅ **DO: Use loading.tsx for Automatic Loading UI**

```typescript
// app/products/loading.tsx
export default function Loading() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image" />
          <div className="skeleton-text" />
        </div>
      ))}
    </div>
  );
}
```

---

### 9. **Data Fetching Patterns**

#### **Server Component Data Fetching**

```typescript
// app/products/page.tsx
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // ISR: Cache for 1 hour
  });

  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}
```

#### **Client Component Data Fetching (when needed)**

```typescript
// Use React Query or SWR for client-side data fetching
'use client';

import useSWR from 'swr';

export function ProductList() {
  const { data, error, isLoading } = useSWR('/api/products', fetcher);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return <ProductGrid products={data} />;
}
```

---

### 10. **Metadata and SEO**

✅ **DO: Use Metadata API**

```typescript
// app/products/[id]/page.tsx
import { type Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);

  return {
    title: `${product.name} | Your Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  return <ProductDetails product={product} />;
}
```

---

### 11. **Authentication with Middleware**

✅ **DO: Protect Routes with Middleware**

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect checkout
  if (pathname.startsWith('/checkout') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/checkout/:path*', '/orders/:path*'],
};
```

---

### 12. **Image Optimization**

✅ **DO: Use Next.js Image Component**

```typescript
import Image from 'next/image';

export function ProductCard({ product }) {
  return (
    <div>
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={400}
        height={300}
        placeholder="blur"
        blurDataURL={product.thumbnailUrl}
        priority={false} // Only set true for above-the-fold images
      />
    </div>
  );
}
```

---

### 13. **Route Groups for Organization**

Use parentheses `()` to organize routes without affecting URL:

```
app/
├── (auth)/
│   ├── login/page.tsx        # URL: /login
│   ├── register/page.tsx     # URL: /register
│   └── layout.tsx            # Shared auth layout
├── (shop)/
│   ├── products/page.tsx     # URL: /products
│   ├── cart/page.tsx         # URL: /cart
│   └── layout.tsx            # Shared shop layout
└── (admin)/
    ├── dashboard/page.tsx    # URL: /admin/dashboard
    └── layout.tsx            # Shared admin layout
```

---

### 14. **Performance Optimization**

✅ **DO:**

```typescript
// 1. Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Disable SSR if not needed
});

// 2. Optimize fonts
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// 3. Use Suspense for streaming
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductList />
    </Suspense>
  );
}
```

---

### 15. **Security Best Practices for E-Commerce**

```typescript
// 1. Input validation with Zod
import { z } from 'zod';

const checkoutSchema = z.object({
  email: z.string().email(),
  cardNumber: z.string().regex(/^\d{16}$/),
  amount: z.number().positive(),
});

// 2. Rate limiting
import { ratelimit } from '@/lib/redis';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // Process request
}

// 3. CSRF protection for forms
// Use next-csrf package or implement token-based protection

// 4. Sanitize user input
import DOMPurify from 'isomorphic-dompurify';

const clean = DOMPurify.sanitize(userInput);
```

---

## 🔒 E-Commerce Specific Best Practices

### 1. **Shopping Cart State Management**

```typescript
// Use Zustand for cart state
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

### 2. **Payment Integration Pattern**

```typescript
// services/paymentService.ts
export async function createPaymentIntent(amount: number) {
  const response = await fetch('/api/payments/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });

  return response.json();
}

// app/api/payments/create-intent/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { amount } = await request.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
```

---

## 📝 Quick Checklist

- ✅ Use TypeScript for type safety
- ✅ Server Components by default, Client only when needed
- ✅ Implement proper error handling and loading states
- ✅ Use environment variables correctly
- ✅ Optimize images with next/image
- ✅ Implement middleware for route protection
- ✅ Use proper data fetching strategies (ISR, SSR, CSR)
- ✅ Add metadata for SEO
- ✅ Validate all user inputs
- ✅ Implement proper security measures
- ✅ Use code splitting and dynamic imports
- ✅ Test your application
- ✅ Monitor performance

---

## 📚 Recommended Packages for E-Commerce

```bash
# State Management
npm install zustand

# Data Fetching
npm install @tanstack/react-query  # or swr

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install clsx tailwind-merge  # For className utilities

# Payment
npm install @stripe/stripe-js @stripe/react-stripe-js stripe

# Database (choose one)
npm install prisma @prisma/client  # Prisma ORM
# or
npm install drizzle-orm  # Drizzle ORM

# Authentication (choose one)
npm install next-auth  # NextAuth.js
# or
npm install @clerk/nextjs  # Clerk

# Testing
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

---

## 🚀 Next Steps

1. **Set up the folder structure** (I'll create this for you)
2. **Install recommended packages**
3. **Configure database** (Prisma/Drizzle)
4. **Set up authentication**
5. **Implement core features** (Products, Cart, Checkout)
6. **Add payment integration**
7. **Implement admin dashboard**
8. **Add tests**
9. **Deploy**

---

This guide covers the essentials. Would you like me to set up any specific part of this structure or create example implementations for any features?
