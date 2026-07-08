# Naming and Conventions Rules

## Preserve

### Backend ↔ frontend type alignment
Types shared between layers (operation types, categories, business types) MUST be kept in sync. When adding a new `Literal` type in the backend Pydantic models, the corresponding TypeScript union type in `frontend/src/lib/financial-types.ts` MUST be updated in the same change.

### File naming
React component files MUST use kebab-case (`income-outcome-chart.tsx`). Utility and type files MUST use kebab-case (`financial-utils.ts`). Non-component modules (types, utils) MUST NOT use `.tsx` extension.

### Directory structure convention
Components go under `frontend/src/components/<domain>/`. UI primitives (shadcn/ui) go under `frontend/src/components/ui/`. Business logic goes under `frontend/src/lib/`.

### Generic component naming
Components that are NOT domain-specific MUST NOT be named after a domain concept. Keep shadcn/ui primitives generic (`Card`, `Skeleton`) and domain components specific (`KPICard`, not `MetricCard`).

## Mitigate

### Descriptive variable names
Single-letter variable names are acceptable ONLY in:
- Lambda/callback expressions (`[m for m in movements if m.amount > 0]`, `.map(m => m.amount)`)
- Mathematical or coordinate contexts (`x`, `y`, `i`, `n`)

In named functions and module-level code, use descriptive names (`movement` not `m`, `dataPoint` not `dp`).

### Consistent CSS variable casing
All `--custom-property` names MUST follow `--<scope>-<property>`. Existing pattern: `--chart-income`, `--income-badge-fg`, `--color-border`. Avoid camelCase inside property names.
