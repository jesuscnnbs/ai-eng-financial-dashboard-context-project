# Current Status

---

## Features implementadas

Cada item incluye la evidencia concreta en el repositorio.

### Backend — API (9 endpoints)

- [x] `GET /health` — health check → `routes.py` L155
- [x] `GET /api/metrics` — movimientos con filtros fecha/categoría/operation_type → `routes.py` L159
- [x] `GET /api/metrics/facets` — metadatos de filtros disponibles → `routes.py` L175
- [x] `GET /api/metrics/summary` — resumen agrupado por day/week/month → `routes.py` L181
- [x] `GET /api/metrics/categories/top` — top N categorías por operation_type → `routes.py` L199
- [x] `GET /api/metrics/comparison` — comparación valor neto entre periodos → `routes.py` L215
- [x] `GET /api/metrics/alerts` — detección de anomalías en gastos → `routes.py` L240
- [x] `GET /api/metrics/b2b` — solo movimientos B2B → `routes.py` L262
- [x] `GET /api/metrics/b2c` — solo movimientos B2C → `routes.py` L280

### Backend — Mock data

- [x] Generación determinista con seed fijo 42 → `routes.py` L108-117: `generate_mock_movements(seed=42)`
- [x] 360 movimientos (30/mes × 12 meses) → `routes.py` L114-115
- [x] 5 categorías: suppliers, sales, operational, administrative, others → `routes.py` L22
- [x] 2 tipos de operación: income, outcome → `routes.py` L19
- [x] 2 tipos de negocio: B2B, B2C → `routes.py` L21

### Backend — Tests

- [x] 14 tests de integración con `TestClient` → `test_routes.py`
- [x] Tests cubren: generación, filtros por fecha/categoría/operation_type, endpoints B2B/B2C, facets, summary, top categories, comparison, alerts → `test_routes.py`

### Frontend — Componentes

- [x] `DashboardHeader` — título + período → `dashboard-header.tsx`
- [x] `KPIRow` → 4 × `KPICard`: Total Income, Total Outcome, Profit, Profit Margin → `kpi-row.tsx`
- [x] `IncomeOutcomeChart` — gráfico líneas ingresos/gastos mensuales → `income-outcome-chart.tsx`
- [x] `ProfitPercentChart` — gráfico línea margen de beneficio mensual → `profit-percent-chart.tsx`
- [x] Estados loading (skeleton) en todos los componentes → `kpi-card.tsx` L33-42, `income-outcome-chart.tsx` L48-55, `profit-percent-chart.tsx` L49-56
- [x] Estado error (banner rojo) en `App.tsx` → `App.tsx` L47-49
- [x] Estado empty ("No data available to display") en ambos charts → `income-outcome-chart.tsx` L60-62, `profit-percent-chart.tsx` L61-63

### Frontend — Utilidades

- [x] `computeKPIs()` — totalIncome, totalOutcome, profit, profitPercent → `financial-utils.ts` L16-27
- [x] `computeMonthlyData()` — agregación mensual → `financial-utils.ts` L29-52
- [x] `formatCurrency()` y `formatPercent()` — formateo → `financial-utils.ts` L54-63
- [x] `cn()` — merge de clases Tailwind → `utils.ts` (clsx + tailwind-merge)

### Frontend — Tests

- [x] Test de `computeKPIs` con 3 movimientos → `financial-utils.test.ts` L18-32
- [x] Test de `computeMonthlyData` multi-año → `financial-utils.test.ts` L38-60
- [x] Test de formatCurrency → `financial-utils.test.ts` L65
- [x] Test de formatPercent → `financial-utils.test.ts` L68

### Frontend — Estilos

- [x] Tema dark vía CSS variables Oklch en `:root` + `.dark` → `index.css`
- [x] Sistema de diseño con variables semánticas (`--chart-*`, `--*-badge`, `--radius-*`) → `index.css`
- [x] Registro en `@theme inline` para uso con Tailwind → `index.css`

### Infraestructura

- [x] Docker Compose 2 servicios → `docker-compose.yml`
- [x] Frontend: Node 24-alpine, puerto 5173 → `frontend/Dockerfile`
- [x] Backend: Python 3.13-slim, puertos 8000 + 5678 → `backend/Dockerfile`
- [x] Hot-reload vía volúmenes montados → `docker-compose.yml` L8-9, L21-22
- [x] Proxy Vite `/api` → backend → `vite.config.ts` L12-16
- [x] Variable `VITE_API_BASE_URL` documentada → `frontend/.env.example`

### Documentación

- [x] README en inglés → `README.md`
- [x] README en español → `README.es.md`
- [x] AGENTS.md con guía para agentes → `AGENTS.md`
- [x] Memory bank con 11 archivos de documentación → `memory-bank/`
- [x] 10 reglas para agentes → `.agents/rules/`

---

## Gaps conocidos

| # | Gap | Categoría | Evidencia | Severidad |
|---|---|---|---|---|
| G1 | `mock-data.ts` no se importa en ningún lado | Dead code | `grep -r "mock-data" src/` solo encuentra el archivo mismo | Alta |
| G2 | Frontend consume 1 de 9 endpoints | API infrautilizada | `App.tsx` solo llama a `/api/metrics` | Alta |
| G3 | 0 tests de componentes React | Testing | No existe ningún `*.test.tsx` en `src/components/` | Alta |
| G4 | Sin `@testing-library/react` ni `jsdom` | Testing | No aparecen en `package.json` | Alta |
| G5 | `routes.py` tiene 391 líneas con todo mezclado | Mantenibilidad | `wc -l routes.py` = 391 | Media |
| G6 | `.dark` class hardcodeada en `App.tsx` | Calidad | `App.tsx` L44: `className="dark ..."` | Media |
| G7 | `<title>frontend</title>` en index.html | Calidad | `index.html` L7 | Media |
| G8 | Sin validación de `VITE_API_BASE_URL` | Robustez | `App.tsx` L9: `?? ""` sin chequeo | Baja |
| G9 | debugpy siempre activo en Docker | Seguridad | `backend/Dockerfile` CMD incluye `--listen` | Baja |
| G10 | Sin React Router ni estado global | Arquitectura | `package.json` sin `react-router-dom`, `zustand`, etc. | Baja |
| G11 | Sin CI/CD | Infra | No existe `.github/` ni otro pipeline | Baja |
| G12 | Frontend `mock-data.ts` puede servir como fallback offline | Oportunidad | Archivo existe con datos estáticos pero no se usa | — |

---

## Próximas prioridades

### Inmediatas (P0 — sprints 1-2)

| # | Acción | Gap que resuelve | Criterio de éxito |
|---|---|---|---|
| 1 | Instalar `@testing-library/react` + `jsdom` + testing-library DOM | G3, G4 | `npm test` ejecuta tests de componentes |
| 2 | Crear smoke tests para `KPICard`, `IncomeOutcomeChart`, `ProfitPercentChart`, `DashboardHeader` | G3 | 4+ tests de componente pasando en `npm test` |
| 3 | Decidir y ejecutar: eliminar o integrar `mock-data.ts` | G1 | No hay imports no utilizados |

### Corto plazo (P1 — sprints 3-4)

| # | Acción | Gap que resuelve | Criterio de éxito |
|---|---|---|---|
| 4 | Extraer `models.py`, `data.py`, `filters.py` de `routes.py` | G5 | `routes.py` ≤ 50 líneas, tests siguen pasando |
| 5 | Cambiar `<title>` a "Financial Metrics Dashboard" | G7 | `index.html` muestra título correcto |
| 6 | Extraer `.dark` del JSX, implementar `prefers-color-scheme` | G6 | Sin clase `.dark` hardcodeada en componentes |

### Medio plazo (P2 — sprints 5+)

| # | Acción | Gap que resuelve | Criterio de éxito |
|---|---|---|---|
| 7 | Consumir `/api/metrics/summary` y `/api/metrics/comparison` desde frontend | G2 | Dos nuevos gráficos o KPIs con datos reales |
| 8 | Agregar filtros de fecha/categoría en UI | G2, G10 | Usuario puede filtrar por rango de fechas |
| 9 | Agregar test de `App.tsx` simulando fetch exitoso y fallido | G3 | Cobertura de estados loading/error/data |
