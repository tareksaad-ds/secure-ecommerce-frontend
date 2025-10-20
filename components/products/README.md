# Product Components

Beautiful, responsive product card component for your e-commerce store.

## 📁 File Structure

```
components/products/
├── ProductCard.tsx      # Main product card component
├── ProductCard.css      # Product card styles
├── index.ts            # Exports
└── README.md           # This file

data/
└── products.ts         # Dummy product data (12 products)
```

## 🎯 Features

### ProductCard Component

- ✅ **Beautiful Card Design** - Modern, clean, and professional
- ✅ **Product Image** - With hover zoom effect
- ✅ **Discount Badge** - Shows discount percentage
- ✅ **Out of Stock Badge** - Indicates availability
- ✅ **Favorite Button** - Heart icon to save products
- ✅ **Quick View Overlay** - Appears on hover
- ✅ **Star Rating** - Visual rating with review count
- ✅ **Price Display** - Current price with optional original price
- ✅ **Add to Cart Button** - With loading animation
- ✅ **Category Tag** - Product category display
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Accessibility** - ARIA labels and keyboard support

## 📦 Usage

### Basic Usage

```tsx
import { ProductCard } from '@/components/products';
import type { Product } from '@/components/products/ProductCard';

const product: Product = {
  id: 1,
  name: 'Wireless Headphones',
  description: 'Premium noise-cancelling headphones',
  price: 199.99,
  originalPrice: 299.99,
  image: 'https://example.com/image.jpg',
  category: 'Electronics',
  rating: 4.8,
  reviews: 234,
  inStock: true,
  discount: 33,
};

<ProductCard
  product={product}
  onAddToCart={(product) => console.log('Added:', product)}
  onToggleFavorite={(product) => console.log('Favorited:', product)}
/>;
```

### Home Page Implementation

The home page (`app/page.tsx`) includes:

- Header with cart icon
- Hero section
- Search bar
- Category filters
- Products grid
- Footer

## 🎨 Product Card States

### Normal State

- Shows product image, name, description
- Displays price and rating
- "Add to Cart" button visible

### Hover State

- Image zooms in
- Quick view overlay appears
- Card elevates with shadow

### Out of Stock

- "Out of Stock" badge
- Disabled "Add to Cart" button
- Greyed out appearance

### With Discount

- Discount badge in corner
- Original price shown (strikethrough)
- Calculated discount percentage

### Favorite Active

- Heart icon filled with red color
- Indicates item is in favorites

### Adding to Cart

- Button shows loading spinner
- Text changes to "Adding..."
- Button temporarily turns green on success

## 📊 Product Data Type

```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Optional, for showing discounts
  image: string;
  category: string;
  rating: number; // 0-5
  reviews: number; // Number of reviews
  inStock: boolean;
  discount?: number; // Optional, percentage
}
```

## 🎯 Dummy Data

The `data/products.ts` file contains 12 dummy products across various categories:

- Electronics
- Wearables
- Fashion
- Photography
- Furniture
- Lifestyle
- Sports
- Home & Kitchen
- Fitness
- Gaming
- Home & Office

## 🔧 Customization

### Change Card Layout

Edit `ProductCard.css` to customize:

- Card dimensions
- Spacing and padding
- Colors and shadows
- Font sizes
- Border radius

### Modify Image Aspect Ratio

In `ProductCard.css`, change:

```css
.product-image-container {
  padding-top: 75%; /* 4:3 ratio */
}
```

To:

```css
.product-image-container {
  padding-top: 100%; /* 1:1 square */
  /* or */
  padding-top: 56.25%; /* 16:9 ratio */
}
```

### Update Grid Layout

In `app/home.css`, modify:

```css
.products-grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
```

## 🚀 Next Steps

To make this production-ready, you'll need to:

1. **Add State Management** (Zustand, Redux, Context)
   - Cart state
   - Favorites state
   - User preferences

2. **Connect to Backend API**
   - Fetch real products
   - Handle pagination
   - Implement search/filters

3. **Add More Features**
   - Product detail page
   - Cart functionality
   - Checkout process
   - User reviews
   - Product variants (size, color)
   - Wishlist

4. **Optimize Performance**
   - Image optimization (Next.js Image)
   - Lazy loading
   - Infinite scroll
   - Caching

5. **Add Analytics**
   - Track product views
   - Monitor add-to-cart rate
   - A/B testing

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+ (4 columns)
- **Tablet**: 768px-1023px (3 columns)
- **Mobile**: < 768px (1-2 columns)

## ♿ Accessibility

- Proper ARIA labels on buttons
- Keyboard navigation support
- Focus indicators
- Alt text on images
- Screen reader friendly
- High contrast mode support
- Reduced motion support

## 🎨 Design System

Uses the same design system as auth components:

- CSS variables for colors
- Consistent spacing
- Matching animations
- Same button styles
- Unified typography
