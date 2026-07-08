# Code Quality Rules

## Preserve

### TypeScript strict mode
All TypeScript code MUST use strict checks. The current `tsconfig.app.json` enables `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, and `erasableSyntaxOnly`. These MUST NOT be disabled.

### Accessible markup
All interactive or information-bearing elements SHOULD use semantic HTML and ARIA attributes. The current codebase uses `<section aria-label="...">` and `role` attributes where appropriate. New components MUST follow the same pattern.

### Tailwind CSS via `cn()` utility
All classname composition MUST use the `cn()` helper from `@/lib/utils` (clsx + tailwind-merge). Manual classname concatenation is NOT allowed.

## Mitigate

### Theme system
The `.dark` class MUST NOT be hardcoded in JSX. Instead:
- Respect `prefers-color-scheme` media query as default
- Optionally provide a toggle mechanism
- Keep CSS variable definitions in `index.css` as the single source of truth

### HTML metadata
The `<title>` in `index.html` MUST be descriptive of the application. Currently it reads `"frontend"` — it MUST be changed to reflect the project name (e.g., "Financial Metrics Dashboard").

### No unused imports
All TypeScript/JavaScript files MUST have clean imports. Unused imports MUST be removed. The `noUnusedLocals` TSConfig option enforces this at build time — ensure it is always enabled.

### Console and debug logs
No `console.log`, `console.debug`, or `debugger` statements MUST be committed. Use a proper logging approach if needed (structured logging in backend, console.warn/error for user-facing issues in frontend).
