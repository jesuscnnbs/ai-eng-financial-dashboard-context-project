# Git Commit Rules

## Scope
Version control conventions for project consistency.

## Commit message format
Use **Conventional Commits**:
```
<type>: <short description>

<optional body>
```

Valid types:
- `feat:` — New feature (endpoint, component, filter)
- `fix:` — Bug fix
- `docs:` — Documentation (README, memory-bank, agent rules)
- `test:` — Adding or updating tests
- `refactor:` — Code restructuring without behavior change
- `chore:` — Build config, dependencies, tooling
- `style:` — CSS, theming, visual changes (not logic)

Examples:
```
feat: add date range filter to income-outcome chart
fix: handle empty movements list in computeKPIs
docs: add architecture rule for endpoint consumption
```

## Commit scope
- One logical change per commit. Avoid mixing `feat` + `fix` + `docs` in a single commit.
- If a change touches both frontend and backend for a single feature, it MAY be one commit.

## What NOT to commit
- `.env` files (already in `.gitignore`)
- `node_modules/`, `__pycache__/` (already in `.gitignore`)
- Compiled/build artifacts (`dist/`)
- Debug logs or temporary files

## Before committing
Always run:
```bash
cd backend && pytest
cd frontend && npm run test && npm run lint
```
Do NOT commit if tests or lint fail, unless the failure is pre-existing and documented.
