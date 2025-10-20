# 🚀 Quick Reference - ESLint & Prettier

## Common Commands
```bash
npm run lint        # Check for errors (no changes)
npm run lint:fix    # Check + fix errors
npm run format      # Format all files
npm run type-check  # Verify TypeScript types
```

## VS Code Shortcuts
- `Ctrl+S` - Save & auto-format
- `Shift+Alt+F` - Format document manually
- `Ctrl+Shift+P` → "Format Document" - Same as above

## Quick Fixes
- **Auto-fix ESLint**: `npm run lint:fix`
- **Format single file**: `npx prettier --write path/to/file.ts`
- **Check single file**: `npx eslint path/to/file.ts`

## Rule Levels
- `"error"` (2) - Red, blocks build
- `"warn"` (1) - Yellow, doesn't block
- `"off"` (0) - Disabled

## Files to Edit
- `.prettierrc` - Formatting rules
- `eslint.config.mjs` - Code quality rules
- `.vscode/settings.json` - Editor settings

