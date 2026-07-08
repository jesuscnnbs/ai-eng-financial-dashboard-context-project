# Data Flow and Type Alignment

## Scope
Cross-layer type alignment and data transformation pipeline.

## Schema ownership
The backend Pydantic models in `models.py` are the **source of truth** for the data schema. The frontend TypeScript types in `frontend/src/lib/financial-types.ts` MUST mirror them exactly.

## Type alignment table

| Backend (Pydantic) | Frontend (TypeScript) | Notes |
|---|---|---|
| `OperationType = Literal["income", "outcome"]` | `type OperationType = 'income' \| 'outcome'` | Exact match |
| `Category = Literal["suppliers", "sales", ...]` | `type Category = 'suppliers' \| 'sales' \| ...` | Exact match |
| `BusinessType = Literal["B2B", "B2C"]` | `type BusinessType = 'B2B' \| 'B2C'` | Exact match |
| `FinancialMovement` | `interface FinancialMovement` | Field names MUST match exactly |
| `date` (Python) | `string` (ISO date) | Frontend parses with `new Date()` |

## Transformation pipeline
API data flows through exactly one transformation layer before reaching components:

```
API (JSON) → financial-utils.ts → Component props
                  ↓
          computeKPIs() → KPIMetrics
          computeMonthlyData() → MonthlyDataPoint[]
```

- `financial-utils.ts` is the ONLY module that transforms API shape to view shape
- Components MUST NOT transform data directly; they receive already-computed props
- Adding a new view transformation? Add it to `financial-utils.ts` (or create a new file under `src/lib/`)

## When types change
If a backend Pydantic model changes:
1. Update `frontend/src/lib/financial-types.ts` in the same PR/commit
2. Update `financial-utils.ts` if the transformation logic depends on the changed field
3. Update any test fixtures in `financial-utils.test.ts`
4. Run both `pytest` (backend) and `npm run test` (frontend) to verify alignment
