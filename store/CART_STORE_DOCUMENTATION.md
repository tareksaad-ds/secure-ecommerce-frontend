# Cart Store Documentation

## Overview

The Cart Store is a comprehensive state management solution for handling shopping cart functionality in the e-commerce application. It uses **Zustand** for state management with **localStorage persistence** and supports both guest and authenticated user carts with server synchronization.

## Features

✅ **Add/Remove Items** - Add products to cart and remove them  
✅ **Quantity Management** - Update, increase, or decrease item quantities  
✅ **Automatic Calculations** - Subtotal, tax, shipping, and total calculations  
✅ **LocalStorage Persistence** - Cart persists across browser sessions  
✅ **Server Sync** - Automatic synchronization for authenticated users  
✅ **Cart Merging** - Merge guest cart with user cart after login  
✅ **Error Handling** - Comprehensive error handling and recovery  

---

## Installation

The cart store is already set up, but ensure you have the required dependencies:

```bash
npm install zustand axios
```

---

## Basic Usage

### 1. Import the Store

```typescript
import { useCartStore } from '@/store/cartStore';
import type { CartItem } from '@/store/cartStore';
```

### 2. Use in Components

```typescript
'use client';

import { useCartStore } from '@/store/cartStore';

function MyComponent() {
  const { items, addItem, removeItem, getTotals } = useCartStore();
  
  return (
    <div>
      <p>Items in cart: {items.length}</p>
    </div>
  );
}
```

---

## API Reference

### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `items` | `CartItem[]` | Array of cart items |
| `loading` | `boolean` | Loading state for async operations |
| `error` | `string \| null` | Error message if any |
| `lastSynced` | `Date \| null` | Last server sync timestamp |

### Actions

#### Cart Operations

##### `addItem(product: Product, quantity?: number)`
Add a product to the cart. If the item already exists, it increases the quantity.

```typescript
const { addItem } = useCartStore();

// Add 1 item
addItem(product);

// Add multiple items
addItem(product, 3);
```

##### `removeItem(productId: number)`
Remove an item from the cart completely.

```typescript
const { removeItem } = useCartStore();

removeItem(productId);
```

##### `updateQuantity(productId: number, quantity: number)`
Update the quantity of an item. If quantity is 0 or less, the item is removed.

```typescript
const { updateQuantity } = useCartStore();

updateQuantity(productId, 5);
```

##### `increaseQuantity(productId: number)`
Increase item quantity by 1.

```typescript
const { increaseQuantity } = useCartStore();

increaseQuantity(productId);
```

##### `decreaseQuantity(productId: number)`
Decrease item quantity by 1. If quantity becomes 0, the item is removed.

```typescript
const { decreaseQuantity } = useCartStore();

decreaseQuantity(productId);
```

##### `clearCart()`
Remove all items from the cart.

```typescript
const { clearCart } = useCartStore();

clearCart();
```

#### Calculations

##### `getItemCount()`
Get the total number of items in the cart (sum of all quantities).

```typescript
const { getItemCount } = useCartStore();

const totalItems = getItemCount(); // e.g., 5
```

##### `getTotals()`
Calculate all cart totals including subtotal, shipping, tax, discount, and total.

```typescript
const { getTotals } = useCartStore();

const { subtotal, shipping, tax, discount, total } = getTotals();
```

Returns:
```typescript
{
  subtotal: number;    // Sum of all item prices
  shipping: number;    // Shipping cost (FREE over $100)
  tax: number;        // Tax amount (10%)
  discount: number;   // Discount amount (for future coupon codes)
  total: number;      // Final total
}
```

#### Utility Functions

##### `getItemById(productId: number)`
Get a specific cart item by product ID.

```typescript
const { getItemById } = useCartStore();

const item = getItemById(123);
if (item) {
  console.log(item.name, item.quantity);
}
```

##### `isInCart(productId: number)`
Check if a product is already in the cart.

```typescript
const { isInCart } = useCartStore();

if (isInCart(productId)) {
  // Product is in cart
}
```

##### `clearError()`
Clear any error messages.

```typescript
const { error, clearError } = useCartStore();

if (error) {
  clearError();
}
```

#### Server Synchronization (for authenticated users)

##### `syncCartWithServer()`
Sync the current cart state with the server.

```typescript
const { syncCartWithServer } = useCartStore();

await syncCartWithServer();
```

##### `fetchCartFromServer()`
Fetch the cart from the server and replace local cart.

```typescript
const { fetchCartFromServer } = useCartStore();

await fetchCartFromServer();
```

##### `mergeLocalCartWithServer()`
Merge the local cart with the server cart (useful after login).

```typescript
const { mergeLocalCartWithServer } = useCartStore();

await mergeLocalCartWithServer();
```

---

## Usage Examples

### Example 1: Product Card Component

```typescript
'use client';

import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/store/productStore';

function ProductCard({ product }: { product: Product }) {
  const { addItem, isInCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addItem(product, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAddToCart} disabled={isAdding}>
        {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

### Example 2: Shopping Cart Page

```typescript
'use client';

import { useCartStore } from '@/store/cartStore';

function CartPage() {
  const { items, updateQuantity, removeItem, getTotals } = useCartStore();
  const { subtotal, shipping, tax, total } = getTotals();

  return (
    <div>
      <h1>Shopping Cart</h1>
      
      {items.map((item) => (
        <div key={item.productId}>
          <p>{item.name}</p>
          <p>${item.price}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
          />
          <button onClick={() => removeItem(item.productId)}>Remove</button>
        </div>
      ))}

      <div>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Shipping: ${shipping.toFixed(2)}</p>
        <p>Tax: ${tax.toFixed(2)}</p>
        <p><strong>Total: ${total.toFixed(2)}</strong></p>
      </div>
    </div>
  );
}
```

### Example 3: Cart Icon with Item Count

```typescript
'use client';

import { useCartStore } from '@/store/cartStore';

function CartIcon() {
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <div className="cart-icon">
      🛒
      {itemCount > 0 && <span className="badge">{itemCount}</span>}
    </div>
  );
}
```

### Example 4: After Login - Merge Carts

```typescript
'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';

function CartManager() {
  const { isAuthenticated } = useUserStore();
  const { mergeLocalCartWithServer } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      // Merge local cart with server cart after login
      mergeLocalCartWithServer().catch((error) => {
        console.error('Failed to merge cart:', error);
      });
    }
  }, [isAuthenticated, mergeLocalCartWithServer]);

  return null;
}
```

---

## Cart Configuration

You can modify these constants in `store/cartStore.ts`:

```typescript
const TAX_RATE = 0.1;                    // 10% tax
const FREE_SHIPPING_THRESHOLD = 100;     // Free shipping over $100
const SHIPPING_COST = 15;                // Flat shipping cost
```

---

## Backend API Requirements

The cart store expects these API endpoints:

### 1. Sync Cart
```
POST /cart/sync
Authorization: Bearer {token}
Body: { items: CartItem[] }
```

### 2. Fetch Cart
```
GET /cart
Authorization: Bearer {token}
Response: { items: CartItem[] }
```

### 3. Merge Cart
```
POST /cart/merge
Authorization: Bearer {token}
Body: { items: CartItem[] }
Response: { items: CartItem[] }
```

---

## Type Definitions

### CartItem

```typescript
type CartItem = {
  id: number;              // Temporary local ID
  productId: number;       // Product ID from product store
  name: string;           // Product name
  price: number;          // Current price
  originalPrice?: number; // Original price (for discounts)
  quantity: number;       // Number of items
  image: string;          // Product image URL
  category: string;       // Product category
  discount?: number;      // Discount percentage
  maxStock?: number;      // Max available stock (optional)
}
```

### CartTotals

```typescript
type CartTotals = {
  subtotal: number;   // Sum of all items
  shipping: number;   // Shipping cost
  tax: number;        // Tax amount
  discount: number;   // Total discount
  total: number;      // Final total
}
```

---

## LocalStorage Persistence

The cart automatically persists to localStorage under the key `cart-storage`. The following data is persisted:

- `items`: All cart items
- `lastSynced`: Last sync timestamp

The `loading` and `error` states are NOT persisted.

---

## Best Practices

1. **Always use the cart store** - Don't maintain separate cart state in components
2. **Handle errors gracefully** - The store includes error handling, but display errors to users
3. **Sync after login** - Always merge carts after user authentication
4. **Show feedback** - Display loading and success states when adding items
5. **Validate stock** - Check product availability before adding to cart (if applicable)
6. **Clear cart after checkout** - Call `clearCart()` after successful order

---

## Troubleshooting

### Cart not persisting
- Check browser localStorage is enabled
- Check for localStorage quota exceeded errors

### Server sync failing
- Verify API endpoints are correct
- Check authentication token is valid
- Ensure backend is accepting the correct data format

### Items duplicating
- Make sure you're using `productId` consistently
- The store handles duplicates automatically, but ensure product IDs are unique

---

## Future Enhancements

Potential features to add:

- [ ] Coupon code support
- [ ] Stock validation before adding to cart
- [ ] Save for later functionality
- [ ] Recently viewed items
- [ ] Cart expiration for authenticated users
- [ ] Multi-currency support
- [ ] Product variants (size, color, etc.)

---

## Support

For questions or issues, please check:
- This documentation
- The implementation in `store/cartStore.ts`
- Example usage in `app/cart/page.tsx` and `components/products/ProductCard.tsx`

