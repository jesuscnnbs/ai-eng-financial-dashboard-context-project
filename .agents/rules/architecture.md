# Architecture Rules

## Preserve

### Container separation
Backend and frontend MUST remain independent Docker services communicating via HTTP. The Vite proxy pattern (`/api` → backend container) MUST be preserved for local development. This enables independent scaling, testing, and deployment of each layer.

### Deterministic mock data
All synthetic data generation MUST use a fixed seed (currently `42`) to ensure reproducibility across environments and test runs. The `generate_mock_movements()` function is the single source of truth for mock data.

## Mitigate

### No dead code
Any file or export that is not imported or used at runtime MUST be removed or justified with a documented reason. Currently `frontend/src/lib/mock-data.ts` is unused — either delete it or integrate it.

### Consume what you expose
When a backend endpoint is created, the frontend SHOULD consume it within the same iteration unless there is a documented reason to defer. Currently the frontend only uses `/api/metrics` while the backend provides 8 additional endpoints (`/summary`, `/comparison`, `/alerts`, `/categories/top`, `/b2b`, `/b2c`, `/facets`).

### Single-responsibility in routes
Backend route files MUST separate concerns: business logic (filters, calculations, data generation) SHOULD live in dedicated modules under `backend/app/`, not inline in `routes.py`. The router file should only wire endpoints to handler functions.

### Error semantics
API endpoints MUST return appropriate HTTP status codes (4xx for client errors, 5xx for server errors) rather than always returning 200 with empty or fallback data.
