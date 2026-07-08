# Technology Stack

## Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.4 | UI library |
| TypeScript | ~6.0.2 | Typed JavaScript |
| Vite | 8.0.4 | Bundler & dev server |
| Tailwind CSS | 4.2.2 | Utility-first CSS framework |
| shadcn/ui (Card, Skeleton) | — | Component primitives |
| Recharts | 3.8.1 | Charting library |
| Lucide React | 1.8.0 | Icons |
| class-variance-authority | 0.7.1 | Variant components |
| clsx | 2.1.1 | Classname utility |
| tailwind-merge | 3.5.0 | Tailwind class merging |
| Vitest | 4.1.4 | Unit testing |
| ESLint | 9.39.4 | Linting |
| typescript-eslint | 8.58.0 | TypeScript linting |

## Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.13 | Runtime |
| FastAPI | latest | Web framework |
| Pydantic | latest | Data validation |
| Uvicorn | latest | ASGI server |
| debugpy | latest | Remote debugging |
| pytest | latest | Testing framework |
| pytest-cov | latest | Coverage reporting |
| httpx | latest | HTTP client for tests |

## Infrastructure

| Technology | Purpose |
|---|---|
| Docker Compose | Multi-container orchestration |
| Node 24-alpine | Frontend container |
| Python 3.13-slim | Backend container |
| Vite proxy | `/api` reverse proxy to backend |
