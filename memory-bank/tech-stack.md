# Technology Stack

_All versions verified from `package.json` (frontend), `requirements.txt` (backend), and `docker-compose.yml` / `Dockerfile` files (infrastructure)._

---

## Frontend

| Tecnología | Versión | Rol | Evidencia |
|---|---|---|---|
| React | ^19.2.4 | UI library | `package.json` dependencies |
| React DOM | ^19.2.4 | DOM rendering | `package.json` dependencies |
| TypeScript | ~6.0.2 | Static typing | `package.json` devDependencies |
| Vite | ^8.0.4 | Bundler + dev server | `package.json` devDependencies |
| Tailwind CSS | ^4.2.2 | Utility-first CSS | `package.json` devDependencies (+ `@tailwindcss/vite`) |
| shadcn/ui | — | Primitives (Card, Skeleton) | `components.json`, `src/components/ui/` |
| Recharts | ^3.8.1 | Line charts | `package.json` dependencies, `income-outcome-chart.tsx`, `profit-percent-chart.tsx` |
| Lucide React | ^1.8.0 | Icons (TrendingUp, TrendingDown, etc.) | `package.json` dependencies, `kpi-row.tsx` |
| class-variance-authority | ^0.7.1 | Component variant API | `package.json` dependencies |
| clsx | ^2.1.1 | Conditional classnames | `package.json` dependencies |
| tailwind-merge | ^3.5.0 | Merge Tailwind classes | `package.json` dependencies |
| Vitest | ^4.1.4 | Test runner | `package.json` devDependencies |
| ESLint | ^9.39.4 | Linter | `package.json` devDependencies |
| typescript-eslint | ^8.58.0 | TS lint rules | `package.json` devDependencies |

### Frontend gaps

| Gap | Evidencia | Impacto |
|---|---|---|
| **Sin testing-library/react** + **jsdom** | No aparece en `package.json`. Sin ellos no se pueden renderizar componentes en tests | Bloqueante para tests de componentes |
| **Sin React Router** | `package.json` no contiene `react-router-dom` | Impide navegación multi-página |
| **Sin estado global** | No hay `zustand`, `redux`, ni `React.Context` en `package.json` o `src/` | Escala mal si crecen los filters/estados |
| **Sin shadcn/ui inputs** | Solo hay `Card` y `Skeleton`. Sin `Button`, `Select`, `Input`, `DatePicker` | Impide agregar controles de filtro en UI |
| **Sin @tailwindcss/forms** | No en `package.json` | Estilos de formularios no normalizados |

---

## Backend

| Tecnología | Versión | Rol | Evidencia |
|---|---|---|---|
| Python | 3.13 | Runtime | `Dockerfile` L1: `FROM python:3.13-slim` |
| FastAPI | latest | Web framework | `requirements.txt`: `fastapi` |
| Pydantic | latest | Data validation | `requirements.txt` (dep de FastAPI), usado en `routes.py` L30-72 |
| Uvicorn | latest | ASGI server | `requirements.txt`: `uvicorn[standard]` |
| debugpy | latest | Remote debugger | `requirements.txt`: `debugpy`, `Dockerfile` CMD |
| pytest | latest | Test framework | `requirements.txt`: `pytest` |
| pytest-cov | latest | Coverage | `requirements.txt`: `pytest-cov` |
| httpx | latest | HTTP client for tests | `requirements.txt`: `httpx` |

### Backend gaps

| Gap | Evidencia | Impacto |
|---|---|---|
| **Sin linter/type checker** | No `ruff`, `mypy`, `black` en `requirements.txt` | Inconsistencias de estilo, errores de tipos no detectados |
| **Toda la lógica en routes.py** | `routes.py` tiene 391 líneas con modelos, generación, filtros y endpoints mezclados | Dificulta mantenimiento y testing unitario |
| **Sin base de datos** | No hay ORM en `requirements.txt`, no hay volumen de BD en `docker-compose.yml` | Datos no persisten entre requests |
| **debugpy siempre activo** | `Dockerfile` CMD siempre incluye `debugpy --listen` | Riesgo de seguridad menor, overhead innecesario |
| **CORS abierto** | `main.py` L9: `allow_origins=["*"]` | Aceptable en entorno educativo pero no para despliegue |

---

## Infrastructure

| Componente | Detalle | Evidencia |
|---|---|---|
| Orquestación | Docker Compose v2 | `docker-compose.yml` |
| Frontend image | `node:24-alpine` | `frontend/Dockerfile` L1 |
| Backend image | `python:3.13-slim` | `backend/Dockerfile` L1 |
| Frontend port | 5173 | `docker-compose.yml` L7, `frontend/Dockerfile` CMD |
| Backend API port | 8000 | `docker-compose.yml` L18 |
| Backend debug port | 5678 | `docker-compose.yml` L19 |
| Volumen frontend | `./frontend:/app` (hot-reload) | `docker-compose.yml` L8 |
| Volumen backend | `./backend:/app` (hot-reload) | `docker-compose.yml` L21 |
| Vite proxy | `/api` → `http://backend:8000` | `vite.config.ts` L12-16 |
| Variable de entorno | `VITE_API_BASE_URL` (opcional) | `frontend/.env.example` |

### Infrastructure gaps

| Gap | Evidencia | Impacto |
|---|---|---|
| **Sin multi-stage build** | `Dockerfile` simple, sin separación build/run | Imágenes de desarrollo no optimizadas para producción |
| **Sin perfil de producción** | `docker-compose.yml` sin `profiles` ni separación dev/prod | Misma configuración para todos los entornos |
| **Sin CI/CD** | No hay `.github/workflows/` ni config de CI | No hay validación automática en PRs |
| **Sin healthcheck** | `docker-compose.yml` sin `healthcheck` en ningún servicio | No hay verificación de que los servicios estén listos |

---

## Próximas prioridades técnicas (ordenadas)

| Prioridad | Acción | Dependencias |
|---|---|---|
| 1. **Alta** | Instalar `@testing-library/react` + `jsdom` + `@types/react-testing-library` en frontend | Ninguna |
| 2. **Alta** | Eliminar `mock-data.ts` o integrarlo como fallback offline | Decisión sobre si mantenerlo |
| 3. **Alta** | Extraer `models.py`, `data.py`, `filters.py` de `routes.py` | Ninguna |
| 4. **Media** | Cambiar `<title>frontend</title>` por `Financial Metrics Dashboard` | Ninguna |
| 5. **Media** | Extraer `.dark` class de JSX, usar `prefers-color-scheme` | Ninguna |
| 6. **Media** | Consumir `/api/metrics/summary` y `/api/metrics/comparison` desde frontend | (#3) si se refactoriza backend |
| 7. **Baja** | Agregar validación de `VITE_API_BASE_URL` en startup | Ninguna |
