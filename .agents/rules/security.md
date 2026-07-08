# Security Rules

## Mitigate

### CORS restrictions
`allow_origins` MUST be scoped to the actual frontend origin in non-development environments. Using `["*"]` is acceptable ONLY in local development or Codespaces. In any deployment or shared environment, the allowed origins MUST be explicitly listed.

### Environment variables and secrets
- `VITE_API_BASE_URL` MUST have a documented fallback (currently `?? ""` works via Vite proxy)
- Any `.env` file MUST be in `.gitignore` — verify when adding new env vars
- No secrets (API keys, tokens, credentials) MUST be hardcoded. Use environment variables or Docker secrets.
- New env vars added to `frontend/.env.example` MUST include a comment explaining when and why to override the default.

### debugpy for development only
The `debugpy` remote debugger (port 5678) MUST NOT be enabled in shared or deployed environments. When not actively debugging, prefer running without the `--listen` flag. Use a Docker Compose override or a separate compose profile for debugging.
