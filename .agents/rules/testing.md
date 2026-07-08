# Testing Rules

## Preserve

### Backend integration tests
All API endpoints MUST have integration tests using FastAPI's `TestClient`. Tests MUST cover:
- Happy path for each endpoint
- Filter combinations (date, category, operation_type, business_type)
- Edge cases (empty results, boundary dates)

The current 14-test suite is the baseline — new endpoints or logic MUST include corresponding tests.

### Deterministic seed in tests
All mock-data-dependent tests MUST use `seed=42` to guarantee reproducibility. No test should rely on random data without a fixed seed.

### Utility test coverage
All public functions in `frontend/src/lib/*.ts` MUST have unit tests. The existing `financial-utils.test.ts` is the baseline.

## Mitigate

### Frontend component tests
Add tests using **Vitest + @testing-library/react**. Every presentational component (`KPICard`, `IncomeOutcomeChart`, `ProfitPercentChart`, `DashboardHeader`) MUST have:
- A smoke test: render with required props, assert key text/elements via `screen.getByText()` or `screen.getByRole()`
- A loading state test: pass `loading=true`, assert skeleton renders instead of content
- An error/empty state test: pass empty data, assert fallback message

### Loading and error states
Every component that accepts a `loading` prop or can enter an error state MUST have a test for each state. Mock the fetch in `App.tsx` tests to simulate API failure.
