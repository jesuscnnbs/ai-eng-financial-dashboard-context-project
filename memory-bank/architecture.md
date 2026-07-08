# Architecture

## Directory Structure

```
/
├── backend/
│   ├── app/
│   │   ├── __init__.py       # Package marker
│   │   ├── main.py           # FastAPI app, CORS, router
│   │   └── routes.py         # All endpoints, models, business logic
│   ├── tests/
│   │   ├── conftest.py       # sys.path setup
│   │   └── test_routes.py    # 14 integration tests
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Root component, data fetching
│   │   ├── main.tsx          # Entry point
│   │   ├── index.css         # Tailwind, CSS variables (Oklch)
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard-header.tsx
│   │   │   │   ├── kpi-card.tsx
│   │   │   │   ├── kpi-row.tsx
│   │   │   │   ├── income-outcome-chart.tsx
│   │   │   │   └── profit-percent-chart.tsx
│   │   │   └── ui/
│   │   │       ├── card.tsx        # shadcn/ui card components
│   │   │       └── skeleton.tsx    # Loading skeleton
│   │   ├── lib/
│   │   │   ├── financial-types.ts   # TypeScript interfaces
│   │   │   ├── financial-utils.ts   # KPI & monthly data computation
│   │   │   ├── financial-utils.test.ts  # Unit tests
│   │   │   ├── mock-data.ts         # Static mock data (unused)
│   │   │   └── utils.ts            # cn() classname helper
│   │   └── assets/
│   │       └── hero.png
│   ├── public/
│   │   └── favicon.svg
│   ├── Dockerfile
│   ├── vite.config.ts
│   ├── tsconfig*.json
│   ├── package.json
│   ├── eslint.config.js
│   └── components.json      # shadcn/ui config
├── docker-compose.yml
├── AGENTS.md
├── README.md
└── README.es.md
```

## Data Flow

```
User Browser
     │
     ▼
Frontend (Vite dev server :5173)
     │
     │  GET /api/metrics
     │  (proxied by Vite)
     ▼
Vite Proxy → http://backend:8000/api/metrics
     │
     ▼
Backend (FastAPI :8000)
     │
     ├── generate_mock_movements(seed=42)
     │   └── 360 movements (12 months × 30/month)
     │
     ├── filter_movements()  ← query params
     │
     └── JSON response
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/metrics` | All movements (filterable) |
| GET | `/api/metrics/facets` | Available filter options |
| GET | `/api/metrics/summary` | Aggregated by day/week/month |
| GET | `/api/metrics/categories/top` | Top categories by operation type |
| GET | `/api/metrics/comparison` | Net value comparison across periods |
| GET | `/api/metrics/alerts` | Outcome anomaly detection |
| GET | `/api/metrics/b2b` | B2B-only movements |
| GET | `/api/metrics/b2c` | B2C-only movements |

The frontend currently only consumes `/api/metrics`.

## Communication

- **Development**: Vite dev server proxies `/api/*` to `http://backend:8000`
- **Environment override**: `VITE_API_BASE_URL` env var for custom backend origin
- **Ports**: Frontend :5173, Backend :8000 (API) + :5678 (debugpy)
