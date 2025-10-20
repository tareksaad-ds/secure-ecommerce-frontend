# Auth Components - Usage Examples

## 🚀 Quick Start

Navigate to `/auth` to see the complete auth flow with login and register forms.

```
http://localhost:3000/auth
```

## 📱 Three Ways to Use

### Method 1: AuthContainer (Easiest - Recommended) ⭐

Use this for automatic form switching between login and register:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import AuthContainer from '@/components/auth/AuthContainer';

export default function AuthPage() {
  const router = useRouter();

  const handleLogin = async (data) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push('/dashboard');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const handleRegister = async (data) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push('/dashboard');
    } else {
      throw new Error('Registration failed');
    }
  };

  return (
    <AuthContainer
      defaultView="login" // or "register"
      onLogin={handleLogin}
      onRegister={handleRegister}
      onForgotPassword={() => router.push('/forgot-password')}
    />
  );
}
```

### Method 2: Separate Forms (More Control)

Use this when you want separate pages for login and register:

**Login Page (`app/login/page.tsx`):**

```tsx
'use client';

import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push('/dashboard');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      onRegisterClick={() => router.push('/register')}
      onForgotPasswordClick={() => router.push('/forgot-password')}
    />
  );
}
```

**Register Page (`app/register/page.tsx`):**

```tsx
'use client';

import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (data) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push('/dashboard');
    } else {
      throw new Error('Registration failed');
    }
  };

  return (
    <RegisterForm
      onSubmit={handleRegister}
      onLoginClick={() => router.push('/login')}
    />
  );
}
```

### Method 3: Import Everything (Maximum Flexibility)

```tsx
import {
  LoginForm,
  RegisterForm,
  AuthContainer,
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from '@/components/auth';
```

## 🎯 Features Comparison

| Feature                     | LoginForm | RegisterForm                                             |
| --------------------------- | --------- | -------------------------------------------------------- |
| Email validation            | ✅        | ✅                                                       |
| Password validation         | Basic     | Strong (8+ chars, uppercase, lowercase, number, special) |
| Password strength indicator | ❌        | ✅                                                       |
| Password toggle             | ✅        | ✅                                                       |
| Remember me                 | ✅        | ❌                                                       |
| Terms & conditions          | ❌        | ✅                                                       |
| Forgot password             | ✅        | ❌                                                       |
| Full name field             | ❌        | ✅                                                       |
| Confirm password            | ❌        | ✅                                                       |

## 📝 Form Data Types

### Login Form Data

```typescript
type LoginFormData = {
  email: string; // Required, valid email
  password: string; // Required
  rememberMe?: boolean; // Optional
};
```

### Register Form Data

```typescript
type RegisterFormData = {
  fullName: string; // Required, 2-50 chars, letters only
  email: string; // Required, valid email
  password: string; // Required, strong password
  confirmPassword: string; // Required, must match password
  acceptTerms: boolean; // Required, must be true
};
```

## 🔒 Security Features

Both forms include:

- ✅ **Zod validation** - Type-safe schema validation
- ✅ **Client-side validation** - Real-time error messages
- ✅ **Password security** - Strong password requirements (register)
- ✅ **XSS protection** - React escapes all user input
- ✅ **CSRF ready** - Add tokens in your API calls
- ✅ **TypeScript** - Full type safety
- ✅ **No hydration errors** - Uses React's `useId()`

## 🎨 Styling

Both forms:

- Share the same design system
- Use CSS variables for theming
- Are fully responsive (mobile, tablet, desktop)
- Include smooth animations
- Support accessibility features
- Work with reduced motion preferences

## 🔧 Customization

### Change Default View

```tsx
<AuthContainer defaultView="register" /> // Start with register form
```

### Custom Error Handling

```tsx
const handleLogin = async (data) => {
  try {
    await api.login(data);
  } catch (error) {
    // Throw error to display in form
    throw new Error('Custom error message');
  }
};
```

### Navigation Examples

```tsx
// Using Next.js router
onLoginClick={() => router.push('/login')}

// Using state (for single-page auth)
onLoginClick={() => setShowLogin(true)}

// Using window location
onLoginClick={() => window.location.href = '/login'}
```

## 📱 Testing

To test the forms:

1. **Start dev server:**

   ```bash
   npm run dev
   ```

2. **Navigate to:**

   ```
   http://localhost:3000/auth
   ```

3. **Try switching:**
   - Click "Create account" on login form
   - Click "Sign in" on register form
   - Should toggle smoothly between forms

4. **Test validation:**
   - Leave fields empty and submit
   - Enter invalid email
   - Enter weak password (register form)
   - Enter non-matching passwords (register form)

## 🐛 Common Issues

### "Cannot find module '@/components/auth'"

Make sure your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Hydration errors

Already fixed! We use `useId()` instead of `Math.random()`.

### Forms not switching

Make sure you're using the `AuthContainer` or managing state correctly:

```tsx
const [view, setView] = useState<'login' | 'register'>('login');
```

## 🎓 Best Practices

1. **Always handle errors** - Show meaningful messages to users
2. **Validate on server** - Client validation is not enough
3. **Use HTTPS** - Never send passwords over HTTP
4. **Hash passwords** - Use bcrypt or similar on backend
5. **Implement rate limiting** - Prevent brute force attacks
6. **Use JWT or sessions** - Secure authentication tokens
7. **Add CSRF tokens** - Protect against cross-site attacks

## 📚 Next Steps

After implementing auth forms:

1. **Create API routes** (`app/api/auth/login/route.ts`, etc.)
2. **Set up database** (PostgreSQL, MongoDB, etc.)
3. **Add session management** (NextAuth.js, JWT, etc.)
4. **Implement password reset** (Forgot password flow)
5. **Add email verification** (Send verification emails)
6. **Set up OAuth** (Google, GitHub, etc.)
7. **Add 2FA** (Two-factor authentication)

## 🔗 Related Files

- `components/auth/LoginForm/` - Login form component
- `components/auth/RegisterForm/` - Register form component
- `components/auth/AuthContainer.tsx` - Container component
- `app/(auth)/auth/page.tsx` - Demo page
- `components/ui/Input/AppInput.tsx` - Input component
- `components/ui/Button/AppButton.tsx` - Button component
