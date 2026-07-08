# Infrastructure

## Docker Compose

Defined in `docker-compose.yml`:

```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
      - "5678:5678"
    volumes:
      - ./backend:/app
```

### How to run

```bash
docker compose up --build
```

## Frontend Container

- **Base image**: `node:24-alpine`
- **Command**: `npm run dev -- --host 0.0.0.0 --port 5173`
- **Port**: 5173
- **Volume**: mounts `./frontend` at `/app` (live-reload in dev)
- **Note**: `node_modules` is a named anonymous volume to avoid overwriting container's installed deps

## Backend Container

- **Base image**: `python:3.13-slim`
- **Command**: `python -m debugpy --listen 0.0.0.0:5678 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`
- **Ports**: 8000 (API) + 5678 (debugpy remote debugger)
- **Volume**: mounts `./backend` at `/app` (hot-reload in dev)

## Vite Proxy

In `frontend/vite.config.ts`:

```ts
proxy: {
  "/api": {
    target: "http://backend:8000",  // Docker service name
    changeOrigin: true,
  },
},
```

All requests to `/api/*` during development are forwarded to the backend container. The Docker service name `backend` is resolved via the internal Docker network.

## Environment Variables

| Variable | Location | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `frontend/.env` (optional) | Override backend origin when not using Vite proxy |

Copy `frontend/.env.example` to `frontend/.env` to configure. In local development and Codespaces, the proxy is sufficient.

## URLs (local)

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
