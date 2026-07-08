# Active Context

## Project References

- **AGENTS.md**: Agents must check `.agents/rules/`, `.agents/skills/`, and `memory-bank/` before taking action
- **README.md / README.es.md**: Bilingual documentation with setup instructions and educational context

## Recent Activity

- Created `memory-bank/` directory with structured project documentation (8 topic files)
- Created `.agents/` directory structure (`rules/` + `skills/`)
- Project analysis completed: full-stack Financial Dashboard (React + FastAPI)

## Current Work Focus

Initial project setup and knowledge documentation for AI agents.

## Decisions Pending

- Which rules to define in `.agents/rules/`
- Which skills to define in `.agents/skills/`
- Whether to address frontend gaps (consume more endpoints, add filters, add tests)
- Whether to add a real database to the backend
- CI/CD pipeline setup

## Next Steps (Suggested)

1. Define agent rules in `.agents/rules/`
2. Define agent skills in `.agents/skills/`
3. Address dead code (`mock-data.ts`)
4. Expand frontend to consume additional API endpoints
5. Add frontend component tests
6. Add filter controls to the dashboard UI

## Key Files

| File | Purpose |
|---|---|
| `backend/app/routes.py` | All backend endpoints and business logic |
| `backend/app/main.py` | FastAPI app creation |
| `frontend/src/App.tsx` | Root component, data fetching |
| `frontend/src/lib/financial-utils.ts` | KPI and chart data computation |
| `AGENTS.md` | Agent guidance and conventions |
| `docker-compose.yml` | Service orchestration |
