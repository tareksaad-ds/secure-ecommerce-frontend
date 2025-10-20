# Auth Components

Secure and stylish authentication components for your app.

## 📦 Components

### LoginForm

Login form with email/password validation and remember me option.

### RegisterForm

Registration form with full validation and password strength indicator.

### AuthContainer

Wrapper component that handles switching between login and register forms.

## 🚀 Quick Start

### Option 1: Use AuthContainer (Recommended)

```tsx
import AuthContainer from '@/components/auth/AuthContainer';

export default function AuthPage() {
  const handleLogin = async (data) => {
    await api.login(data);
    router.push('/dashboard');
  };

  const handleRegister = async (data) => {
    await api.register(data);
    router.push('/dashboard');
  };

  return (
    <AuthContainer
      defaultView="login"
      onLogin={handleLogin}
      onRegister={handleRegister}
      onForgotPassword={() => router.push('/forgot-password')}
    />
  );
}
```

### Option 2: Use Forms Separately

```tsx
import { LoginForm, RegisterForm } from '@/components/auth';

// Login Page
<LoginForm onSubmit={handleLogin} onRegisterClick={() => router.push('/register')} />

// Register Page
<RegisterForm onSubmit={handleRegister} onLoginClick={() => router.push('/login')} />
```

## 🎯 Features

### LoginForm

- ✅ Email validation
- ✅ Password field with show/hide
- ✅ Remember me checkbox
- ✅ Forgot password link
- ✅ Loading states
- ✅ Error handling

### RegisterForm

- ✅ Full name validation
- ✅ Email validation
- ✅ Strong password requirements
- ✅ Password strength indicator
- ✅ Confirm password
- ✅ Terms & conditions
- ✅ Loading states
- ✅ Error handling

## 🔒 Security

Both forms include:

- Zod validation schemas
- Client-side validation
- TypeScript type safety
- Secure password handling
- CSRF protection ready
- XSS prevention

## 🎨 Styling

Both forms share:

- Consistent design system
- Responsive layouts
- Smooth animations
- Accessibility features
- Dark mode ready (via CSS variables)

## 📝 Form Data Types

```typescript
// Login
type LoginFormData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

// Register
type RegisterFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};
```

## 🎭 Example: Complete Auth Flow

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthContainer from '@/components/auth/AuthContainer';

export default function AuthPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const user = await response.json();
      router.push('/dashboard');
    } catch (err) {
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (data) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      router.push('/dashboard');
    } catch (err) {
      throw new Error('Registration failed. Please try again.');
    }
  };

  return (
    <AuthContainer
      defaultView="login"
      onLogin={handleLogin}
      onRegister={handleRegister}
      onForgotPassword={() => router.push('/forgot-password')}
    />
  );
}
```

## 🔧 Customization

Both forms accept optional props for customization:

- Custom submit handlers
- Custom navigation handlers
- Loading states
- Error messages

## 📱 Responsive

All components are fully responsive:

- Desktop: 440-480px width
- Tablet: Adapts to screen
- Mobile: Full width with padding

## ♿ Accessibility

- Proper ARIA labels
- Keyboard navigation
- Screen reader support
- Focus indicators
- High contrast mode support
- Reduced motion support
