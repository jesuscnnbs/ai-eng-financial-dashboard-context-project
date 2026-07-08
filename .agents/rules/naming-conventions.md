# Naming and Conventions Rules

## Preserve

### Backend ↔ frontend type alignment
Types shared between layers (operation types, categories, business types) MUST be kept in sync. When adding a new `Literal` type in the backend Pydantic models, the corresponding TypeScript union type in `frontend/src/lib/financial-types.ts` MUST be updated in the same change.

### File naming
React component files MUST use kebab-case (`income-outcome-chart.tsx`). Utility and type files MUST use kebab-case (`financial-utils.ts`). Non-component modules (types, utils) MUST NOT use `.tsx` extension.

### Directory structure convention
Components go under `frontend/src/components/<domain>/`. UI primitives (shadcn/ui) go under `frontend/src/components/ui/`. Business logic goes under `frontend/src/lib/`.

## Mitigate

### No single-letter abbreviations
Variable names MUST be descriptive. Avoid single-letter or cryptic abbreviations (`m` → `movement`, `d` → `dataPoint`). Acronyms like KPI are acceptable.

### Consistent casing in CSS variables
All `--custom-property` names in CSS MUST follow the same pattern: `--<scope>-<property>`. Existing examples: `--chart-income`, `--income-badge-fg`. Avoid mixing dash and camelCase.

### Generic component naming
Components that are NOT domain-specific MUST NOT be named after a domain concept. Keep shadcn/ui primitives generic (`Card`, `Skeleton`) and domain components specific (`KPICard`, not `MetricCard`).
