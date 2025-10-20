# ESLint and Prettier Configuration Guide

## 📋 Overview

This document explains the ESLint and Prettier setup for your Next.js + TypeScript project.

## 🎯 What Are ESLint and Prettier?

### **ESLint**

- **Purpose**: Code quality and error prevention
- **What it does**: Finds and fixes problems in your JavaScript/TypeScript code
- **Examples**: Detects unused variables, missing dependencies in React hooks, potential bugs

### **Prettier**

- **Purpose**: Code formatting
- **What it does**: Automatically formats your code to be consistent and readable
- **Examples**: Consistent indentation, quote styles, line lengths, semicolons

### **Why Use Both?**

- ESLint focuses on **code quality** (finding bugs)
- Prettier focuses on **code style** (making it look good)
- Together they ensure your code is both correct and consistently formatted

---

## 📦 Installed Packages

### Core Packages

```json
"prettier": "^3.x"              // The main Prettier formatter
"eslint": "^9"                  // The main ESLint linter
"eslint-config-next": "15.5.4"  // Next.js specific ESLint rules
```

### Integration Packages

```json
"eslint-config-prettier": "^9.x"   // Turns off ESLint rules that conflict with Prettier
"eslint-plugin-prettier": "^5.x"   // Runs Prettier as an ESLint rule
```

---

## 🛠️ Configuration Files Explained

### 1. `.prettierrc` - Prettier Configuration

```json
{
  "semi": true, // Add semicolons at the end of statements
  "trailingComma": "es5", // Add trailing commas where valid in ES5 (objects, arrays)
  "singleQuote": true, // Use single quotes instead of double quotes
  "printWidth": 80, // Wrap lines at 80 characters
  "tabWidth": 2, // Use 2 spaces for indentation
  "useTabs": false, // Use spaces, not tabs
  "arrowParens": "always", // Always include parentheses around arrow function parameters
  "endOfLine": "lf", // Use line feed (\n) for line endings
  "bracketSpacing": true, // Add spaces inside object brackets: { foo: bar }
  "jsxSingleQuote": false, // Use double quotes in JSX
  "bracketSameLine": false // Put > of multi-line JSX elements on new line
}
```

**What each option does:**

- `semi`: `const x = 5;` vs `const x = 5`
- `singleQuote`: `'hello'` vs `"hello"`
- `trailingComma`: `{ a: 1, b: 2, }` vs `{ a: 1, b: 2 }`

### 2. `.prettierignore` - Files Prettier Should Ignore

Tells Prettier to skip certain files/folders that shouldn't be formatted:

- `node_modules/` - Third-party dependencies
- `.next/` - Next.js build output
- `*.log` - Log files
- Lock files (package-lock.json)

### 3. `eslint.config.mjs` - ESLint Configuration

```javascript
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.extends("plugin:prettier/recommended"),  // Prettier integration
  {
    ignores: [...],  // Files to ignore
  },
  {
    rules: {
      // Your custom rules
    }
  }
];
```

**Key Rules Explained:**

#### TypeScript Rules

```javascript
"@typescript-eslint/no-unused-vars": ["warn", {
  "argsIgnorePattern": "^_",      // Ignore unused variables starting with _
  "varsIgnorePattern": "^_",
  "caughtErrorsIgnorePattern": "^_"
}]
```

**Example:**

```typescript
// ✅ OK - prefixed with underscore
function example(_unusedParam: string) {}

// ❌ Warning - unused parameter
function example(unusedParam: string) {}
```

#### React Hooks Rules

```javascript
"react-hooks/rules-of-hooks": "error"        // Enforce hooks rules
"react-hooks/exhaustive-deps": "warn"        // Check useEffect dependencies
```

**Example:**

```typescript
// ❌ Warning - missing dependency
useEffect(() => {
  console.log(userId);
}, []); // userId should be in dependency array

// ✅ Correct
useEffect(() => {
  console.log(userId);
}, [userId]);
```

#### Console Warnings

```javascript
"no-console": ["warn", { allow: ["warn", "error"] }]
```

- `console.log()` → ⚠️ Warning
- `console.warn()` → ✅ Allowed
- `console.error()` → ✅ Allowed

### 4. `.vscode/settings.json` - VS Code Integration

```json
{
  "editor.formatOnSave": true, // Auto-format when you save
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit" // Auto-fix ESLint errors on save
  }
}
```

**What this does:**

- When you save a file (Ctrl+S), it automatically:
  1. Runs Prettier to format the code
  2. Fixes any auto-fixable ESLint errors

---

## 🚀 Available Scripts

### `npm run lint`

**Purpose**: Check for code quality issues

```bash
npm run lint
```

- Scans all `.js`, `.jsx`, `.ts`, `.tsx` files
- Reports errors and warnings
- Does NOT modify files

**When to use**: Before committing code or in CI/CD

---

### `npm run lint:fix`

**Purpose**: Check AND automatically fix issues

```bash
npm run lint:fix
```

- Same as `lint` but also fixes auto-fixable problems
- Will modify your files

**When to use**: To quickly fix simple issues like missing semicolons

---

### `npm run format`

**Purpose**: Format all files with Prettier

```bash
npm run format
```

- Formats all matching files (js, jsx, ts, tsx, json, css, md)
- Will modify your files
- Ensures consistent code style

**When to use**:

- Before committing
- After making many changes
- To clean up messy formatting

---

### `npm run format:check`

**Purpose**: Check if files are formatted correctly

```bash
npm run format:check
```

- Does NOT modify files
- Returns error if any file is not properly formatted

**When to use**: In CI/CD pipeline to ensure code is formatted

---

### `npm run type-check`

**Purpose**: Check TypeScript types without building

```bash
npm run type-check
```

- Verifies all TypeScript types are correct
- Does not generate output files
- Catches type errors

**When to use**: Before building or committing

---

## 📝 Recommended Workflow

### Daily Development

1. Write code normally
2. Save file → Auto-formatting happens (if VS Code is configured)
3. ESLint shows warnings in your editor in real-time

### Before Committing

```bash
npm run lint          # Check for errors
npm run format        # Format all files
npm run type-check    # Check TypeScript
```

### If You See Errors

```bash
npm run lint:fix      # Fix auto-fixable issues
# Then manually fix remaining issues
```

---

## 🎨 VS Code Extensions Needed

Install these extensions in VS Code:

1. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
2. **ESLint** (`dbaeumer.vscode-eslint`)

**How to install:**

1. Press `Ctrl+Shift+X` in VS Code
2. Search for "Prettier" and install
3. Search for "ESLint" and install
4. Restart VS Code

---

## 🔧 Customizing Rules

### Change Prettier Settings

Edit `.prettierrc`:

```json
{
  "semi": false, // Remove semicolons
  "singleQuote": false // Use double quotes
}
```

### Add Custom ESLint Rules

Edit `eslint.config.mjs` in the rules section:

```javascript
rules: {
  "no-console": "off",  // Allow all console statements
  "@typescript-eslint/no-explicit-any": "error",  // Make 'any' an error
}
```

**Rule levels:**

- `"off"` or `0` - Turn off the rule
- `"warn"` or `1` - Show as warning (yellow)
- `"error"` or `2` - Show as error (red)

---

## 🐛 Troubleshooting

### Prettier and ESLint are conflicting

**Solution**: Make sure `plugin:prettier/recommended` is the LAST item in your ESLint extends array.

### VS Code not auto-formatting

**Solution**:

1. Check if Prettier extension is installed
2. Set Prettier as default formatter
3. Reload VS Code window

### Getting "Parsing error" in ESLint

**Solution**: Make sure TypeScript is installed and tsconfig.json exists

### Files not being formatted

**Solution**: Check if file is listed in `.prettierignore`

---

## 📚 Additional Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [Next.js ESLint Guide](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
- [TypeScript ESLint](https://typescript-eslint.io/)

---

## ✅ Quick Test Commands

Test your setup:

```bash
# Format all files
npm run format

# Check for linting errors
npm run lint

# Fix auto-fixable errors
npm run lint:fix

# Check types
npm run type-check

# Run all checks (recommended before commit)
npm run type-check && npm run lint && npm run format:check
```

---

## 🎯 Summary

✅ **ESLint** catches bugs and enforces code quality  
✅ **Prettier** formats code consistently  
✅ **VS Code integration** provides real-time feedback and auto-formatting  
✅ **npm scripts** let you run checks manually

Your project is now set up with professional-grade code quality tools! 🚀
