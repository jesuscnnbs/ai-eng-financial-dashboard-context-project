# Code Quality Rules

## Preserve

### TypeScript strict mode
All TypeScript code MUST use strict checks. The current `tsconfig.app.json` enables `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, and `erasableSyntaxOnly`. These MUST NOT be disabled.

### Accessible markup
All interactive or information-bearing elements SHOULD use semantic HTML and ARIA attributes. The current codebase uses `<section aria-label="...">` and `role` attributes where appropriate. New components MUST follow the same pattern.

### Tailwind CSS via `cn()` utility
All classname composition MUST use the `cn()` helper from `@/lib/utils` (clsx + tailwind-merge). Manual classname concatenation is NOT allowed.

### No unused imports
All TypeScript/JavaScript files MUST have clean imports. The `noUnusedLocals` option in TSConfig enforces this at build time — ensure it stays enabled.

## Mitigate

### Theme system via CSS variables
The `.dark` class MUST NOT be hardcoded in JSX. Instead:
- Use a `<script>` in `index.html` or a React effect to toggle `.dark` based on `prefers-color-scheme` or user preference
- All theme colors are defined as CSS variables in `frontend/src/index.css` using Oklch — this is the single source of truth
- Never hardcode color values in component files; always reference `var(--<variable>)`
- Currently `.dark` is hardcoded on `<main>` in `App.tsx` — this MUST be extracted

### HTML metadata
The `<title>` in `index.html` MUST be descriptive. Currently reads `"frontend"` — MUST be changed to `"Financial Metrics Dashboard"`.

### Clean console
No `console.log` or `console.debug` statements MUST be committed. The backend uses debugpy for debugging; the frontend may use `console.warn` or `console.error` for user-facing issues only.
