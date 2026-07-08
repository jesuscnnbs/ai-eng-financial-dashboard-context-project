# Architecture Rules

## Preserve

### Container separation
Backend and frontend MUST remain independent Docker services communicating via HTTP. The Vite proxy pattern (`/api` → backend container) MUST be preserved for local development. This enables independent scaling, testing, and deployment of each layer.

### Deterministic mock data
All synthetic data generation MUST use a fixed seed (currently `42`) to ensure reproducibility across environments and test runs. The `generate_mock_movements()` function is the single source of truth for mock data.

## Mitigate

### No dead code
Any file or export that is not imported or used at runtime MUST be removed or justified with a documented reason. Currently `frontend/src/lib/mock-data.ts` is unused — either delete it or integrate it.

### Endpoint consumption
Every backend endpoint MUST have at least one frontend consumer or be documented as backend-only (`# Internal`). Currently the frontend only uses `/api/metrics` while the backend provides 8 additional endpoints (`/summary`, `/comparison`, `/alerts`, `/categories/top`, `/b2b`, `/b2c`, `/facets`).

### Single-responsibility routes
Backend route files MUST NOT contain business logic inline beyond 50 lines per handler. Instead, logic MUST be extracted into dedicated modules under `backend/app/`. Suggested structure:
- `models.py` — Pydantic schemas
- `data.py` — Mock data generation
- `filters.py` — Filter/query logic
- `routes.py` — Endpoint wiring only

### Error status codes
API endpoints MUST use semantic HTTP codes:
- `200` — Success with data (empty list is still 200)
- `400` — Invalid parameter values (business-rule violations)
- `422` — Parameter type errors (handled automatically by FastAPI)
- `404` — Resource not found (if applicable)
- Never return `200` with a body that indicates failure
