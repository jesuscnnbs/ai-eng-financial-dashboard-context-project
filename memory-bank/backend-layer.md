# Backend Layer

## Functionality

### Endpoints

All routes defined in `backend/app/routes.py` via an `APIRouter`:

1. **`GET /health`** — Returns `{"status": "ok"}`
2. **`GET /api/metrics`** — Returns all financial movements with optional filters: `start_date`, `end_date`, `category`, `operation_type`
3. **`GET /api/metrics/facets`** — Returns available filter dimensions: `operation_types`, `business_types`, `categories`, `min_date`, `max_date`
4. **`GET /api/metrics/summary`** — Aggregated summary grouped by `day`, `week`, or `month`. Supports filters: `group_by`, `start_date`, `end_date`, `category`, `operation_type`, `business_type`
5. **`GET /api/metrics/categories/top`** — Top N categories for a given `operation_type`, with optional `business_type` filter
6. **`GET /api/metrics/comparison`** — Compares net value between a date range and the previous equivalent period. Requires `start_date` and `end_date`
7. **`GET /api/metrics/alerts`** — Detects outcome anomalies when a period's expense exceeds the running baseline by a configurable `threshold` (default 30%)
8. **`GET /api/metrics/b2b`** — B2B-only movements
9. **`GET /api/metrics/b2c`** — B2C-only movements

### Business Logic

- **Mock data generation** (`generate_mock_movements`): Produces 360 movements (30 per month × 12 months) with randomized amounts, categories, and operation types. Deterministic via `seed=42`.
- **Filtering pipeline**: Date → category → operation_type → business_type, all composable.
- **Summarization** (`summarize_movements`): Groups movements by day/week/month, computes income/outcome/net per period.
- **Comparison** (`calculate_net_value` + period subtraction): Net value delta with absolute and percentage change.
- **Alert detection** (`detect_outcome_alerts`): Rolling baseline comparison — flags periods where outcome exceeds average historical outcome by > threshold.

### Pydantic Models (`routes.py`)

- `FinancialMovement` — Single transaction
- `MetricsFacets` — Filter metadata
- `MetricsSummaryItem` — Aggregated period data
- `TopCategoryItem` — Category ranking
- `MetricsComparison` — Period-over-period delta
- `MetricsAlert` — Anomaly detection result

### Type Aliases (Literal types)

- `OperationType`: `"income"` | `"outcome"`
- `Category`: `"suppliers"` | `"sales"` | `"operational"` | `"administrative"` | `"others"`
- `BusinessType`: `"B2B"` | `"B2C"`
- `GroupBy`: `"day"` | `"week"` | `"month"`

## Technologies

| Component | Technology |
|---|---|
| Framework | FastAPI |
| Data validation | Pydantic v2 |
| Server | Uvicorn (with `--reload`) |
| Debugger | debugpy (port 5678) |
| Testing | pytest + httpx (TestClient) |
| Coverage | pytest-cov |
| Container | Python 3.13-slim |

## Constraints & Observations

- **No database**: All data is synthetic, generated in-memory on every request.
- **Deterministic seed**: `seed=42` ensures reproducibility.
- **CORS wide open**: `allow_origins=["*"]` — acceptable for development/educational context.
- **No authentication**: All endpoints are public.
- **No async**: Routes are synchronous (FastAPI sync handlers).
- **debugpy enabled**: Remote debugger exposed on port 5678.
- **Tests**: 14 integration tests covering mock generation, each endpoint, and filter combinations.
