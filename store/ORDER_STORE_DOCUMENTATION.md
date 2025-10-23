# Order Store Documentation

## Overview

The Order Store manages order creation and retrieval based on the database schema. It includes validation matching the DTO constraints and integrates with the existing cart store.

## Types

### CreateOrderDto

```typescript
type CreateOrderDto = {
  productIds: number[]; // Array of product IDs (minimum 1 required)
  totalAmount: number; // Total order amount (must be > 0)
};
```

### Order

```typescript
type Order = {
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
```

## Usage

### Creating an Order

```typescript
import { useOrderStore } from './store/orderStore';

const { createOrder, loading, error } = useOrderStore();

// Create order with validation
const orderData = {
  productIds: [1, 2, 3],
  totalAmount: 150.0,
};

try {
  const newOrder = await createOrder(orderData);
  console.log('Order created:', newOrder);
} catch (error) {
  console.error('Order creation failed:', error.message);
}
```

### Fetching Orders

```typescript
import { useOrderStore } from './store/orderStore';

const { fetchOrders, orders, loading, error } = useOrderStore();

// Fetch all orders for the current user
useEffect(() => {
  fetchOrders();
}, []);
```

### Getting Specific Order

```typescript
import { useOrderStore } from './store/orderStore';

const { getOrderById } = useOrderStore();

// Get order by ID
const order = getOrderById(123);
```

## Validation Rules

The store validates orders according to the DTO constraints:

1. **productIds**: Must be an array with at least one number
2. **totalAmount**: Must be a positive number

## Features

- ✅ DTO-based validation matching backend constraints
- ✅ Integration with cart store (clears cart after order creation)
- ✅ Authentication required for all operations
- ✅ Error handling with specific error messages
- ✅ Local storage persistence
- ✅ TypeScript support with proper typing

## Error Handling

The store provides specific error messages for different scenarios:

- Authentication required
- Invalid order data
- Order validation failed
- Network/server errors

## Integration

The order store automatically:

- Clears the cart after successful order creation
- Requires authentication for all operations
- Persists orders in local storage
- Handles date conversion for createdAt fields
