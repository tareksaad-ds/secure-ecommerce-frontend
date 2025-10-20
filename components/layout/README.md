# Layout Components

Reusable header and footer components for consistent site-wide layout.

## 📁 File Structure

```
components/layout/
├── Header.tsx         # Site header with auth links
├── Header.css        # Header styles
├── Footer.tsx        # Site footer
├── Footer.css        # Footer styles
├── index.ts          # Exports
└── README.md         # This file
```

## 🎯 Components

### Header

A sticky header with branding, authentication links, and cart icon.

**Features:**

- ✅ Logo with home link
- ✅ Login button (redirects to `/auth`)
- ✅ Create Account button (redirects to `/auth`)
- ✅ Shopping cart icon with badge
- ✅ Sticky positioning
- ✅ Fully responsive
- ✅ Accessible with ARIA labels

**Props:**

```typescript
interface HeaderProps {
  cartItemsCount?: number; // Number of items in cart (default: 0)
}
```

**Usage:**

```tsx
import { Header } from '@/components/layout';

<Header cartItemsCount={3} />;
```

### Footer

A clean and minimal footer with essential links and branding.

**Features:**

- ✅ Brand name and tagline
- ✅ Social media links (GitHub, Twitter, Instagram, LinkedIn)
- ✅ Quick links (About, Contact, Login, Sign Up, Privacy, Terms)
- ✅ Dynamic copyright year
- ✅ Centered, minimalist design
- ✅ Fully responsive

**Usage:**

```tsx
import { Footer } from '@/components/layout';

<Footer />;
```

## 📦 Complete Usage

### Basic Layout

```tsx
import { Header, Footer } from '@/components/layout';

export default function Page() {
  return (
    <div className="page-container">
      <Header cartItemsCount={0} />

      <main>{/* Your page content */}</main>

      <Footer />
    </div>
  );
}
```

### With Cart Count

```tsx
'use client';

import { useState } from 'react';
import { Header, Footer } from '@/components/layout';

export default function ShopPage() {
  const [cartCount, setCartCount] = useState(5);

  return (
    <div className="shop-page">
      <Header cartItemsCount={cartCount} />

      <main>{/* Products */}</main>

      <Footer />
    </div>
  );
}
```

## 🎨 Header Sections

### 1. Logo & Brand

- Clickable logo that navigates to home (`/`)
- Site title and tagline

### 2. Authentication Buttons

**Login Button:**

- Icon + "Login" text
- Outlined style
- Navigates to `/auth`

**Create Account Button:**

- Primary button style
- Navigates to `/auth`

### 3. Cart Icon

- Shopping cart icon
- Badge showing item count
- Hidden when count is 0

## 🦶 Footer Sections

### 1. Brand & Tagline

- Company name ("Secure Ecommerce")
- Short description/tagline

### 2. Social Links

- GitHub, Twitter, Instagram, LinkedIn icons
- Hover effects with color change

### 3. Quick Links

Single row of links separated by bullets:

- About
- Contact
- Login (→ `/auth`)
- Sign Up (→ `/auth`)
- Privacy
- Terms

### 4. Copyright

- Dynamic year
- Copyright notice

## 🔧 Customization

### Update Cart Count

```tsx
// When user adds item to cart
const handleAddToCart = (product) => {
  setCartCount((prev) => prev + 1);
};
```

### Modify Social Links

In `Footer.tsx`, update the social links:

```tsx
<a href="https://your-github.com" ...>
  <FiGithub size={20} />
</a>
```

### Change Navigation Links

Update the `onClick` handlers in Footer.tsx:

```tsx
<button onClick={() => router.push('/your-page')} ...>
  Your Link
</button>
```

### Customize Newsletter

In `Footer.tsx`, add newsletter submission logic:

```tsx
const handleNewsletterSubmit = async (email) => {
  await fetch('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};
```

## 🎨 Styling

Both components use:

- CSS variables for theming
- Responsive breakpoints
- Smooth transitions
- Accessible focus states

### Key CSS Variables Used

```css
--primary          /* Primary brand color */
--primary-light    /* Lighter primary shade */
--white            /* Background color */
--off-white        /* Secondary background */
--gray-light       /* Borders */
--gray-medium      /* Text secondary */
--text-primary     /* Primary text */
--error            /* Cart badge, sale items */
--accent-sky       /* Focus outlines */
```

## 📱 Responsive Behavior

### Header

**Desktop (768px+):**

- Full logo and tagline
- Both auth buttons visible with text
- Large cart icon

**Tablet (768px):**

- Smaller logo
- Auth buttons slightly smaller

**Mobile (<768px):**

- Login button becomes icon-only (just user icon)
- Create Account button shows text
- Smaller cart icon
- Tagline hidden on very small screens

### Footer

**All Screens:**

- Centered layout
- Stacked vertically (brand → social → links → copyright)
- Responsive text sizes
- Consistent spacing

## ♿ Accessibility

Both components include:

- ✅ Proper ARIA labels
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ Screen reader friendly
- ✅ Reduced motion support

## 🔗 Navigation Structure

### Auth Links

All authentication buttons/links navigate to `/auth`:

- Header "Login" button → `/auth`
- Header "Create Account" button → `/auth`
- Footer "Login" link → `/auth`
- Footer "Create Account" link → `/auth`

The `/auth` page handles both login and registration with form toggling.

### Home Links

These navigate to home `/`:

- Header logo
- Footer shop links (placeholder)
- Footer service links (placeholder)

## 🚀 Next Steps

To enhance these components:

1. **Add Authentication State**

   ```tsx
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   {
     isAuthenticated ? <UserMenu /> : <AuthButtons />;
   }
   ```

2. **Connect Cart to State Management**

   ```tsx
   import { useCartStore } from '@/store/cart';
   const { items } = useCartStore();

   <Header cartItemsCount={items.length} />;
   ```

3. **Add Real Links**
   - Connect footer links to actual pages
   - Add proper routes for all sections

4. **Search Bar**
   - Add search input to header
   - Implement search functionality

## 🎯 Integration with Pages

### Home Page

```tsx
import { Header, Footer } from '@/components/layout';

export default function Home() {
  return (
    <div className="home-page">
      <Header cartItemsCount={0} />
      <main>{/* Products */}</main>
      <Footer />
    </div>
  );
}
```

### Auth Page

The auth page doesn't need Header/Footer since it's a full-screen form, but you can add them if needed:

```tsx
<Header cartItemsCount={0} />
<AuthContainer />
// Footer optional
```

## 📝 Notes

- Both components are client components (`'use client'`)
- They use Next.js `useRouter` for navigation
- Social links are placeholders (update with real URLs)
- Footer has a clean, minimal design with centered content
- Cart functionality needs state management
