# Cart Components

Beautiful and functional shopping cart components for your e-commerce store.

## 📁 File Structure

```
components/cart/
├── CartItem.tsx       # Individual cart item
├── CartItem.css      # Cart item styles
├── CartSummary.tsx   # Order summary
├── CartSummary.css   # Summary styles
├── EmptyCart.tsx     # Empty state
├── EmptyCart.css     # Empty state styles
├── index.ts          # Exports
└── README.md         # This file

app/cart/
├── page.tsx          # Cart page
└── cart.css          # Cart page styles
```

## 🎯 Components

### CartItem

Displays a single item in the cart with controls.

**Features:**

- ✅ Product image, name, category, price
- ✅ Quantity controls (increase/decrease)
- ✅ Subtotal calculation
- ✅ Remove button
- ✅ Responsive design
- ✅ Disabled state for min quantity

**Props:**

```typescript
interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

interface CartItemData {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}
```

### CartSummary

Shows order totals and checkout button.

**Features:**

- ✅ Subtotal display
- ✅ Shipping calculation (free over $100)
- ✅ Tax calculation (10%)
- ✅ Total amount
- ✅ Proceed to Checkout button
- ✅ Continue Shopping button
- ✅ Sticky positioning on desktop

**Props:**

```typescript
interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  onCheckout?: () => void;
}
```

### EmptyCart

Beautiful empty state when cart is empty.

**Features:**

- ✅ Large shopping cart icon
- ✅ Friendly message
- ✅ "Start Shopping" CTA button
- ✅ Centered design

## 📦 Usage

### Cart Page

```tsx
'use client';

import { useState } from 'react';
import { Header, Footer } from '@/components/layout';
import { CartItem, CartSummary, EmptyCart } from '@/components/cart';
import type { CartItemData } from '@/components/cart';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.1;

  return (
    <div className="cart-page">
      <Header cartItemsCount={cartItems.length} />

      <main>
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              onCheckout={() => console.log('Checkout')}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
```

## 🎨 Features

### Cart Item Features

1. **Product Display**
   - Product image (120x120px)
   - Category badge
   - Product name
   - Unit price

2. **Quantity Controls**
   - Decrease button (disabled at quantity 1)
   - Current quantity display
   - Increase button
   - Automatic subtotal update

3. **Actions**
   - Subtotal for this item
   - Remove button with trash icon

### Cart Summary Features

1. **Pricing Breakdown**
   - Subtotal (sum of all items)
   - Shipping (FREE over $100, otherwise $15)
   - Tax (10% of subtotal)
   - Total (bold, large text)

2. **Actions**
   - Proceed to Checkout (primary button)
   - Continue Shopping (secondary button)

### Empty Cart Features

1. **Visual Design**
   - Large circular icon background
   - Shopping cart icon
   - Friendly title and message
   - Call-to-action button

## 💡 How to Test

### See Items in Cart

In `app/cart/page.tsx`, use:

```tsx
const [cartItems, setCartItems] = useState<CartItemData[]>(initialCartItems);
```

### See Empty State

In `app/cart/page.tsx`, use:

```tsx
const [cartItems, setCartItems] = useState<CartItemData[]>([]);
```

## 🔧 Calculations

### Subtotal

```typescript
const subtotal = cartItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);
```

### Shipping

```typescript
const shipping = subtotal > 100 ? 0 : 15; // Free over $100
```

### Tax

```typescript
const tax = subtotal * 0.1; // 10% tax
```

### Total

```typescript
const total = subtotal + shipping + tax;
```

## 📱 Responsive Design

### Desktop (1024px+)

- Two-column layout (items | summary)
- Summary sticky on right side
- Full-width cart items

### Tablet/Mobile (<1024px)

- Single column layout
- Summary shows first (important info)
- Items stack below
- Cart items adapt to smaller screens

### Mobile (<768px)

- Cart items show in vertical layout
- Image expands to full width
- Actions stack vertically
- Larger touch targets

## 🎯 Cart Item States

### Normal State

- All controls enabled
- Quantity can be increased/decreased
- Remove button active

### Minimum Quantity (1)

- Decrease button disabled
- Remove button is the only way to delete
- Visual feedback on disabled button

### Being Removed

- Item fades out (animation)
- Removed from list
- Cart count updates

## 🚀 Next Steps

To make this production-ready:

1. **Add State Management** (Zustand/Redux)

   ```typescript
   import { useCartStore } from '@/store/cart';

   const { items, updateQuantity, removeItem } = useCartStore();
   ```

2. **Persist Cart**

   ```typescript
   // Save to localStorage
   localStorage.setItem('cart', JSON.stringify(cartItems));

   // Or save to database if user is logged in
   await api.updateCart(cartItems);
   ```

3. **Add to Cart from Products**

   ```typescript
   const handleAddToCart = (product: Product) => {
     addToCart({
       id: product.id,
       name: product.name,
       price: product.price,
       quantity: 1,
       image: product.image,
       category: product.category,
     });
   };
   ```

4. **Implement Checkout**

   ```typescript
   const handleCheckout = async () => {
     const response = await fetch('/api/checkout', {
       method: 'POST',
       body: JSON.stringify({ items: cartItems }),
     });

     if (response.ok) {
       router.push('/checkout');
     }
   };
   ```

5. **Add Animations**
   - Item removal animation
   - Quantity change feedback
   - Add to cart notification

6. **Add Features**
   - Save for later
   - Product variants (size, color)
   - Promo codes/discounts
   - Gift wrapping options
   - Stock availability checks

## 🔗 Navigation

### To Cart Page

```tsx
// From Header cart button
<button onClick={() => router.push('/cart')}>
  <FiShoppingCart />
</button>;

// From Product "Add to Cart" (after adding)
router.push('/cart');

// From anywhere
<Link href="/cart">View Cart</Link>;
```

### From Cart Page

- Continue Shopping → `/` (home)
- Proceed to Checkout → `/auth` (if not logged in) or `/checkout`
- Empty cart "Start Shopping" → `/` (home)

## ♿ Accessibility

All components include:

- ✅ Proper ARIA labels
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Semantic HTML
- ✅ Reduced motion support

## 🎨 Design Consistency

Cart components match:

- Product cards styling
- Auth forms design
- Header/footer theme
- Same color palette
- Consistent spacing
- Unified button styles
