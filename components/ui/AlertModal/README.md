# AlertModal Component

A beautiful, reusable modal for displaying alerts, warnings, and important messages.

## 🎯 Features

- ✅ Multiple types (info, warning, error)
- ✅ Optional login/signup button
- ✅ Backdrop blur effect
- ✅ Click outside to close
- ✅ Close button
- ✅ Smooth animations
- ✅ Fully responsive
- ✅ Keyboard accessible

## 📦 Usage

### Basic Alert

```tsx
import { AlertModal } from '@/components/ui';

const [showAlert, setShowAlert] = useState(false);

<AlertModal
  isOpen={showAlert}
  onClose={() => setShowAlert(false)}
  title="Alert Title"
  message="This is the alert message."
  type="info"
/>;
```

### Login Required Alert

```tsx
<AlertModal
  isOpen={showLoginAlert}
  onClose={() => setShowLoginAlert(false)}
  title="Login Required"
  message="Please login or create an account to continue."
  type="warning"
  showLoginButton
/>
```

### Error Alert

```tsx
<AlertModal
  isOpen={showError}
  onClose={() => setShowError(false)}
  title="Error"
  message="Something went wrong. Please try again."
  type="error"
/>
```

## 🎨 Props

```typescript
interface AlertModalProps {
  isOpen: boolean; // Controls modal visibility
  onClose: () => void; // Callback when modal closes
  title: string; // Modal title
  message: string; // Modal message
  type?: 'info' | 'warning' | 'error'; // Visual style (default: 'info')
  showLoginButton?: boolean; // Shows "Login / Sign Up" button
}
```

## 🎭 Types

### Info (Blue)

- Default type
- For general information
- Blue icon and styling

### Warning (Yellow)

- For warnings or confirmations
- Yellow/orange icon and styling
- Use for login required, confirmations, etc.

### Error (Red)

- For errors
- Red icon and styling
- Use for failures, validation errors

## 🔄 Complete Example

```tsx
'use client';

import { useState } from 'react';
import { AlertModal } from '@/components/ui';

export default function MyComponent() {
  const [showAlert, setShowAlert] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      setShowAlert(true);
      return;
    }

    // Add to cart logic
    console.log('Added to cart:', product);
  };

  return (
    <>
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Login Required"
        message="Please login or create an account to add items to your cart."
        type="warning"
        showLoginButton
      />

      <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
    </>
  );
}
```

## 🎯 Use Cases

### 1. Login Required

```tsx
<AlertModal
  isOpen={showLoginAlert}
  onClose={() => setShowLoginAlert(false)}
  title="Login Required"
  message="Please login or create an account to add items to your cart and start shopping."
  type="warning"
  showLoginButton
/>
```

### 2. Success Message

```tsx
<AlertModal
  isOpen={showSuccess}
  onClose={() => setShowSuccess(false)}
  title="Success!"
  message="Your item has been added to the cart."
  type="info"
/>
```

### 3. Error Message

```tsx
<AlertModal
  isOpen={showError}
  onClose={() => setShowError(false)}
  title="Error"
  message="Unable to add item. Please try again later."
  type="error"
/>
```

### 4. Confirmation

```tsx
<AlertModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  title="Are you sure?"
  message="This action cannot be undone."
  type="warning"
/>
```

## 🎨 Button Behavior

### Without Login Button

- Shows only "Close" button
- User can close by clicking backdrop or close button

### With Login Button

- Shows "Login / Sign Up" button (primary)
- Shows "Continue Shopping" button (secondary)
- Login button navigates to `/auth`
- Continue Shopping closes the modal

## 📱 Responsive Design

- **Desktop**: Full-width modal (max 440px)
- **Mobile**: Adapts with smaller padding and text
- **All Screens**: Centered, scrollable if needed

## ♿ Accessibility

- ✅ Click outside to close
- ✅ ESC key support (via close button)
- ✅ Focus indicators
- ✅ ARIA labels
- ✅ Keyboard navigation

## 🎯 Integration with Auth

The modal automatically routes to `/auth` when login button is clicked:

```tsx
const handleLoginClick = () => {
  onClose();
  router.push('/auth'); // Navigate to auth page
};
```

## 🔧 Customization

### Change Colors

Edit `AlertModal.css`:

```css
.alert-modal.warning .modal-icon {
  background: rgba(255, 193, 7, 0.1);
  color: var(--warning);
}
```

### Add More Types

Extend the component:

```tsx
type?: 'info' | 'warning' | 'error' | 'success';
```

Then add CSS:

```css
.alert-modal.success .modal-icon {
  background: rgba(6, 214, 160, 0.1);
  color: var(--success);
}
```

## 🚀 Next Steps

1. **Add More Types**: success, confirm, custom
2. **Add Actions**: Custom buttons with callbacks
3. **Add Animations**: Entry/exit animations
4. **Add Sounds**: Optional sound effects
5. **Add Auto-close**: Timer-based auto-close

## 📝 Notes

- Modal uses fixed positioning (z-index: 1000)
- Backdrop has blur effect for modern look
- Automatically prevents body scroll when open (optional)
- Smooth animations with reduced motion support
