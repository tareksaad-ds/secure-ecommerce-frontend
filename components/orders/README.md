# Orders Components Documentation

## Overview

This directory contains all the reusable components for the orders functionality, organized in separate files for better maintainability and code organization.

## Components Structure

```
components/orders/
├── OrderItem.tsx          # Individual order item display
├── OrderCard.tsx          # Complete order card with all details
├── OrdersLoading.tsx      # Loading state component
├── OrdersError.tsx        # Error state component
├── OrdersEmpty.tsx        # Empty state component
├── index.ts              # Export file for easy imports
└── README.md             # This documentation
```

## Components

### OrderItem

**File**: `OrderItem.tsx`

Displays individual product items within an order.

**Props**:

- `product`: Product object with id, name, price, imageUrl, category
- `quantity`: Number of items

**Features**:

- Product image with fallback
- Product name and category
- Quantity and price calculation
- Responsive design

### OrderCard

**File**: `OrderCard.tsx`

Complete order display card with all order information.

**Props**:

- `order`: Order object with id, createdAt, totalAmount, products, status
- `onViewDetails`: Callback function for view details action

**Features**:

- Order header with ID and date
- Total amount display
- Product items list (shows first 3, then "more items")
- Status badge with color coding
- View details button
- Responsive layout

### OrdersLoading

**File**: `OrdersLoading.tsx`

Loading state component with spinner and message.

**Features**:

- Animated loading spinner
- Loading message
- Centered layout

### OrdersError

**File**: `OrdersError.tsx`

Error state component with retry functionality.

**Props**:

- `error`: Error message string
- `onRetry`: Retry callback function

**Features**:

- Error message display
- Retry button
- User-friendly error handling

### OrdersEmpty

**File**: `OrdersEmpty.tsx`

Empty state component when no orders exist.

**Features**:

- Empty state icon
- Encouraging message
- "Start Shopping" call-to-action button
- Navigation to home page

## Usage

### Import Components

```typescript
import {
  OrderItem,
  OrderCard,
  OrdersLoading,
  OrdersError,
  OrdersEmpty,
} from '@/components/orders';
```

### Example Usage

```typescript
// In your page component
import { OrderCard, OrdersLoading } from '@/components/orders';

// Use in JSX
{loading ? (
  <OrdersLoading />
) : (
  <OrderCard
    order={order}
    onViewDetails={handleViewDetails}
  />
)}
```

## Benefits of Separation

### ✅ **Code Organization**

- Each component has a single responsibility
- Easy to locate and modify specific functionality
- Better file structure and navigation

### ✅ **Reusability**

- Components can be reused across different pages
- Easy to import only what you need
- Consistent behavior across the application

### ✅ **Maintainability**

- Easier to debug and fix issues
- Simpler testing of individual components
- Better code reviews and collaboration

### ✅ **Performance**

- Tree-shaking friendly exports
- Smaller bundle sizes when importing specific components
- Better code splitting opportunities

## Styling

All components use the existing `Orders.css` file with:

- Consistent styling across components
- Responsive design patterns
- Hover effects and transitions
- Mobile-first approach

## Future Enhancements

1. **OrderItem**: Add quantity controls, product links
2. **OrderCard**: Add order actions (cancel, reorder)
3. **OrdersLoading**: Add skeleton loading states
4. **OrdersError**: Add different error types
5. **OrdersEmpty**: Add personalized recommendations

## Testing

Each component can be tested independently:

- Unit tests for individual components
- Integration tests for component interactions
- Visual regression tests for styling
- Accessibility tests for user experience
