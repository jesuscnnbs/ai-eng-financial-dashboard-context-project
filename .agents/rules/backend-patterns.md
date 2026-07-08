# Backend Patterns

## Scope
Python backend code organization, module structure, and handler patterns.

## Module structure
Business logic MUST be extracted from `routes.py` into dedicated modules under `backend/app/`:

```
backend/app/
├── __init__.py
├── main.py          # FastAPI app, CORS, middleware
├── models.py        # Pydantic schemas (FinancialMovement, etc.)
├── data.py          # Mock data generation (generate_mock_movements)
├── filters.py       # Filter, summary, comparison, alert logic
└── routes.py        # Endpoint wiring only (thin handlers)
```

- `routes.py` handlers MUST NOT exceed 10 lines each
- Repeated logic (date parsing, seed management) MUST be a shared utility

## Handler pattern
Every route handler MUST follow this structure:
```python
@router.get("/api/metrics/<resource>")
def get_resource(
    param: Type | None = Query(default=None),
) -> ResponseModel:
    data = generate_mock_movements(seed=42)
    filtered = filter_data(data, param=param)
    return transform(filtered)
```

## Filter pipeline
Filters MUST be composable and applied in this order:
1. `business_type` (broadest)
2. `start_date` / `end_date`
3. `category`
4. `operation_type` (narrowest)

Each filter function MUST accept `list[FinancialMovement]` and return `list[FinancialMovement]`.

## Pydantic models
- All request/response schemas MUST be defined as Pydantic `BaseModel` subclasses in `models.py`
- Use `Literal` types for constrained string fields (OperationType, Category, BusinessType, GroupBy)
- Response models MUST be referenced in the `response_model=` parameter of each route decorator
