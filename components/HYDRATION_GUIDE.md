# React Hydration Error Guide

## 🐛 What Was the Issue?

The hydration error was caused by using `Math.random()` to generate input IDs in the `AppInput` component:

```tsx
// ❌ WRONG - Causes hydration mismatch
const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
```

## ✅ The Fix

Replaced with React's `useId()` hook:

```tsx
// ✅ CORRECT - Consistent between server and client
const reactId = useId();
const inputId = id || reactId;
```

## 🔍 Why Did This Happen?

React hydration errors occur when **server-rendered HTML doesn't match client-rendered HTML**. Common causes:

1. **Random values** (`Math.random()`, `Date.now()`, `uuid()`)
2. **Browser-only APIs** (like `window`, `localStorage` during render)
3. **Date/time without proper formatting**
4. **Conditional rendering based on client state**

### Server vs Client:

```
Server renders: <input id="input-abc123" />
Client renders: <input id="input-xyz789" />
                         ^^^^^^^^^^^^ MISMATCH!
```

## 🚫 Common Mistakes to Avoid

### ❌ Don't Do This:

```tsx
// Random values
const id = Math.random().toString();
const timestamp = Date.now();
const uuid = crypto.randomUUID();

// Browser APIs during render
const [theme, setTheme] = useState(localStorage.getItem('theme'));

// Date without consistent formatting
const now = new Date().toLocaleString(); // Different on server/client

// Window dimensions during render
const width = window.innerWidth;
```

### ✅ Do This Instead:

```tsx
// Use React's useId for unique IDs
const id = useId();

// Use useEffect for browser APIs
useEffect(() => {
  setTheme(localStorage.getItem('theme'));
}, []);

// Use consistent date formatting
const now = new Date().toISOString();

// Use useEffect for window dimensions
useEffect(() => {
  setWidth(window.innerWidth);
}, []);
```

## 📋 Hydration-Safe Checklist

✅ **Safe during SSR:**

- `useId()` for unique IDs
- Static content
- Props passed from server
- CSS classes
- ISO date strings

❌ **Unsafe during SSR:**

- `Math.random()`
- `Date.now()`
- `window`, `document`, `localStorage`
- User-specific data without proper handling
- Timestamps without consistent formatting

## 🛠️ How to Debug Hydration Errors

1. **Check Browser Console** - React shows where the mismatch occurred
2. **Look for Random Values** - Search for `Math.random()`, `Date.now()`, etc.
3. **Check Client-Only Code** - Wrap in `useEffect` if needed
4. **Use Suppressors Carefully** - Only as last resort:
   ```tsx
   <div suppressHydrationWarning>{Date.now()}</div>
   ```

## 📚 Best Practices

1. **Always use `useId()` for generated IDs**
2. **Move browser API calls to `useEffect`**
3. **Use ISO strings for dates**
4. **Test with SSR enabled** (`npm run build && npm start`)
5. **Read React error messages** - They're very helpful!

## 🔗 Resources

- [React useId Documentation](https://react.dev/reference/react/useId)
- [Next.js Hydration Errors](https://nextjs.org/docs/messages/react-hydration-error)
- [Understanding Hydration](https://react.dev/reference/react-dom/client/hydrateRoot)
