# Authentication Integration Guide

This guide explains how the authentication check works when adding items to cart.

## 🎯 Current Implementation

### How It Works

1. **User clicks "Add to Cart"** on any product
2. **System checks if user is logged in**
3. **If NOT logged in**: Shows alert modal
4. **If logged in**: Adds item to cart

## 📍 Where to Find It

### AlertModal Component

- **Location**: `components/ui/AlertModal.tsx`
- **Purpose**: Shows login required message
- **Features**: Login button, close button, backdrop

### Home Page Integration

- **Location**: `app/page.tsx`
- **Lines**: Check `handleAddToCart` function

## 🔧 How to Test

### Test Login Alert (Default)

In `app/page.tsx`, line 18:

```typescript
const [isLoggedIn] = useState(false); // Shows alert
```

**Result**: Clicking "Add to Cart" shows login alert

### Test Logged In State

In `app/page.tsx`, line 18:

```typescript
const [isLoggedIn] = useState(true); // Bypasses alert
```

**Result**: Clicking "Add to Cart" adds item (logs to console)

## 💻 Code Example

```tsx
// app/page.tsx

const [isLoggedIn] = useState(false); // Auth state
const [showLoginAlert, setShowLoginAlert] = useState(false);

const handleAddToCart = (product: Product) => {
  // Check authentication
  if (!isLoggedIn) {
    setShowLoginAlert(true); // Show alert
    return;
  }

  // If logged in, add to cart
  console.log('Added to cart:', product);
};

// Render alert modal
<AlertModal
  isOpen={showLoginAlert}
  onClose={() => setShowLoginAlert(false)}
  title="Login Required"
  message="Please login or create an account to add items to your cart and start shopping."
  type="warning"
  showLoginButton
/>;
```

## 🚀 Next Steps: Real Authentication

### Option 1: Context API

```tsx
// context/AuthContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const isLoggedIn = !!user;

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

**Usage:**

```tsx
// app/page.tsx
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isLoggedIn } = useAuth();

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }
    // Add to cart...
  };
}
```

### Option 2: Zustand Store

```typescript
// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: any | null;
  isLoggedIn: boolean;
  login: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

**Usage:**

```tsx
// app/page.tsx
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const { isLoggedIn } = useAuthStore();

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }
    // Add to cart...
  };
}
```

### Option 3: NextAuth.js

```bash
npm install next-auth
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate credentials with your API
        const user = await validateUser(credentials);
        return user || null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
```

**Usage:**

```tsx
// app/page.tsx
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }
    // Add to cart...
  };
}
```

## 📋 Features Checklist

Current implementation includes:

- ✅ Login check before adding to cart
- ✅ Beautiful alert modal
- ✅ "Login / Sign Up" button (goes to /auth)
- ✅ "Continue Shopping" button
- ✅ Click outside to close
- ✅ Smooth animations
- ✅ Responsive design

Still needed:

- ⏳ Real authentication system
- ⏳ Session management
- ⏳ User profile
- ⏳ Protected routes
- ⏳ Remember me functionality
- ⏳ Logout functionality

## 🎨 Alert Modal Types

### Warning (Current)

```tsx
<AlertModal
  type="warning"
  title="Login Required"
  message="Please login to continue."
/>
```

### Error

```tsx
<AlertModal type="error" title="Error" message="Something went wrong." />
```

### Info

```tsx
<AlertModal type="info" title="Information" message="Did you know...?" />
```

## 🔗 Related Components

- `components/ui/AlertModal.tsx` - Alert modal
- `components/auth/LoginForm` - Login form
- `components/auth/RegisterForm` - Register form
- `app/page.tsx` - Home page with cart logic

## 📝 Summary

1. **Alert modal created** ✅
2. **Home page integrated** ✅
3. **Login check implemented** ✅
4. **Navigation to auth page** ✅
5. **Responsive and accessible** ✅

Next: Connect to real authentication system!
