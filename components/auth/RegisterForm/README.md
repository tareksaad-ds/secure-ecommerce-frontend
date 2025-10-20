# RegisterForm Component

A clean, modular, and secure registration form built with React Hook Form, Zod validation, and react-icons.

## 📁 File Structure

```
RegisterForm/
├── RegisterForm.tsx        # Main form component (180 lines)
├── RegisterForm.css        # Styles
├── registerSchema.ts       # Zod validation schema
├── PasswordStrength.tsx    # Password strength indicator
├── Alert.tsx              # Alert component (success/error)
├── TermsCheckbox.tsx      # Terms & conditions checkbox
├── LoadingSpinner.tsx     # Loading spinner
├── index.ts               # Exports
└── README.md              # This file
```

## 🎯 Benefits of This Structure

- **Maintainability**: Each component has a single responsibility
- **Reusability**: Components can be reused in other forms
- **Testability**: Easier to write unit tests for smaller components
- **Readability**: Main component is now ~180 lines instead of 400+
- **Type Safety**: Validation schema is shared and type-safe

## 📦 Usage

```tsx
import RegisterForm from '@/components/auth/RegisterForm';

function Page() {
  const handleRegister = async (data) => {
    // Your registration logic
    await api.register(data);
  };

  return <RegisterForm onSubmit={handleRegister} />;
}
```

## 🔧 Component Details

### RegisterForm.tsx
Main form component that orchestrates all sub-components.

### registerSchema.ts
Contains the Zod validation schema and TypeScript types.

### PasswordStrength.tsx
Displays a visual password strength indicator (5 levels).

### Alert.tsx
Reusable alert component for success/error messages.

### TermsCheckbox.tsx
Custom checkbox for terms and conditions acceptance.

### LoadingSpinner.tsx
SVG-based loading spinner animation.

## 🎨 Icons Used

Using `react-icons/fi` (Feather Icons):
- `FiUser` - Full name field
- `FiMail` - Email field
- `FiLock` - Password fields
- `FiCheckCircle` - Success alert
- `FiAlertCircle` - Error alert

## 🔒 Validation Rules

- **Full Name**: 2-50 characters, letters and spaces only
- **Email**: Valid email format, lowercase
- **Password**: 8-100 characters, must contain uppercase, lowercase, number, and special character
- **Confirm Password**: Must match password
- **Terms**: Must be accepted

## 🚀 Features

- ✅ Real-time password strength indicator
- ✅ Show/hide password toggle
- ✅ Client-side validation with Zod
- ✅ Loading states
- ✅ Success/error alerts
- ✅ Fully accessible (ARIA labels)
- ✅ Responsive design
- ✅ TypeScript support

