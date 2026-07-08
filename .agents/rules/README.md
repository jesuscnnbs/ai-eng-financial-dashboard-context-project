# Agent Rules

This directory contains work instructions and operational rules for AI agents working on this project.

Each rule file should be a Markdown document describing a specific guideline, convention, or constraint that agents must follow.

## How to add a rule

Create a new `.md` file in this directory with a descriptive name:

```
.agents/rules/
├── README.md
└── <rule-name>.md
```

## Current rules

| File | Category | Focus |
|---|---|---|
| `architecture.md` | Architecture | Container separation, deterministic mock data, no dead code, endpoint consumption, single-responsibility routes, error status codes |
| `testing.md` | Testing | Backend integration tests, deterministic seeds, frontend component tests (Vitest + Testing Library), loading/error states, utility coverage |
| `naming-conventions.md` | Naming | Type alignment backend↔frontend, file naming, directory structure, descriptive variables (lambdas exempted), CSS variable casing |
| `security.md` | Security | CORS scoping, environment variable validation + secrets, debugpy dev-only |
| `code-quality.md` | Code Quality | TypeScript strict mode, accessible markup, `cn()` utility, theme system via Oklch CSS vars, HTML title, clean console |
| `design-system.md` | CSS / Oklch | Color variable naming, dark theme pattern, radius scale — single source of truth in `index.css` |
| `frontend-patterns.md` | React | Component interface (loading/empty/error states), data fetching with useState/useEffect, chart pattern (Recharts + Card), icon imports, `@/` alias |
| `backend-patterns.md` | Python | Module structure (`models.py` / `data.py` / `filters.py` / `routes.py`), handler pattern, filter pipeline order, Pydantic usage |
| `data-flow.md` | Cross-layer | Type alignment table (Pydantic ↔ TypeScript), transformation pipeline via `financial-utils.ts`, change propagation steps |
| `git-commits.md` | Version control | Conventional Commits (`feat:`, `fix:`, `docs:`, etc.), one change per commit, pre-commit test/lint checklist |
