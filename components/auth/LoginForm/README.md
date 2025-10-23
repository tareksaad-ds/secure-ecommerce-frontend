# LoginForm Component

A clean, modular, and secure login form built with React Hook Form, Zod validation, and react-icons.

## 📁 File Structure

```
LoginForm/
├── LoginForm.tsx             # Main form component (~170 lines)
├── LoginForm.css            # Styles
├── loginSchema.ts           # Zod validation schema
├── RememberMeCheckbox.tsx   # Remember me checkbox
├── index.ts                 # Exports
└── README.md                # This file
```

## 🎯 Features

- ✅ Email and password validation
- ✅ Remember me checkbox
- ✅ Forgot password link
- ✅ Show/hide password toggle
- ✅ Loading states
- ✅ Success/error alerts
- ✅ Fully accessible (ARIA labels)
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Secure validation with Zod

## 📦 Usage

```tsx
import LoginForm from '@/components/auth/LoginForm';

function Page() {
  const handleLogin = async (data) => {
    // Your login logic
    const response = await api.login(data);
    if (response.ok) {
      router.push('/dashboard');
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      onRegisterClick={handleRegister}
      onForgotPasswordClick={handleForgotPassword}
    />
  );
}
```

## 🎨 Icons Used

Using `react-icons/fi` (Feather Icons):

- `FiMail` - Email field
- `FiLock` - Password field

## 🔒 Validation Rules

- **Email**: Required, valid email format, lowercase
- **Password**: Required
- **Remember Me**: Optional

## 📝 Form Data Structure

```typescript
{
  email: string;
  password: string;
  rememberMe?: boolean;
}
```

## 🔐 Security Features

- Client-side validation with Zod
- Password masking with toggle
- Secure form submission
- CSRF protection ready
- Type-safe with TypeScript
