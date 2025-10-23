# Paddle Setup Guide

## Quick Fix for "Something went wrong" Error

### 1. Environment Variables

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_PADDLE_VENDOR_ID=your_sandbox_vendor_id
NEXT_PUBLIC_PADDLE_PRICE_ID=pri_your_sandbox_price_id
NEXT_PUBLIC_PADDLE_ENV=sandbox
```

### 2. Get Your Paddle Sandbox Credentials

1. **Vendor ID**:
   - Go to Paddle Dashboard → Settings → Account
   - Copy your Sandbox Vendor ID (number)

2. **Price ID**:
   - Go to Paddle Dashboard → Catalog → Products
   - Create a product or use existing one
   - Copy the Price ID (starts with `pri_`)

### 3. Paddle Dashboard Settings

1. **Allowed Domains**:
   - Go to Paddle Dashboard → Settings → Checkout
   - Add `http://localhost:3000` to allowed domains

2. **Environment**:
   - Make sure you're in Sandbox mode
   - Use Sandbox credentials, not Production

### 4. Common Issues

- **CSP Error**: Fixed by adding CSP headers (already done)
- **400 Bad Request**: Usually wrong Vendor ID or Price ID
- **Domain not allowed**: Add localhost to Paddle settings
- **Wrong environment**: Use Sandbox for development

### 5. Test Steps

1. Set environment variables
2. Restart dev server: `npm run dev`
3. Add items to cart
4. Click "Proceed to Checkout"
5. Check browser console for detailed error messages

### 6. Debug Console Messages

Look for these in browser console:

- `Opening Paddle checkout with:` - shows your config
- `Paddle checkout event:` - shows Paddle responses
- Any error messages with specific details
