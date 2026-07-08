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

## Mitigate

### Frontend component tests
All presentational components (`KPICard`, `IncomeOutcomeChart`, `ProfitPercentChart`, `DashboardHeader`) MUST have at least one smoke test verifying rendering with required props. Interactive components MUST have behavior tests.

### Loading and error states
Every component that accepts a `loading` prop or can enter an error state MUST have a test for each state.

### No snapshot-only tests
Component tests MUST assert on meaningful behavior or content, not just match snapshots. Prefer `getByText`, `getByRole`, and similar queries from Testing Library.

### Utility test coverage
All public functions in `frontend/src/lib/*.ts` MUST have unit tests. The existing `financial-utils.test.ts` is the baseline.
