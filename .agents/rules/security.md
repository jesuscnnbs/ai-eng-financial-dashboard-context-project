# Security Rules

## Mitigate

### CORS restrictions
`allow_origins` MUST be scoped to the actual frontend origin in non-development environments. Using `["*"]` is acceptable ONLY in local development or Codespaces. In any deployment or shared environment, the allowed origins MUST be explicitly listed.

### Environment variable validation
All environment variables consumed at runtime (`VITE_API_BASE_URL`) MUST have a documented fallback and MUST be validated at startup. The current empty-string fallback (`?? ""`) is acceptable for development but MUST include a warning when used in unexpected ways.

### No secrets in code
API keys, tokens, database credentials, or any secrets MUST NOT be hardcoded. Use environment variables or secret injection through Docker. The `.gitignore` MUST already exclude `.env` files — verify when adding new configurations.

### No command injection
Backend endpoints MUST validate and sanitize all user-supplied query parameters. FastAPI + Pydantic handles type coercion, but string-based parameters MUST avoid shell execution or file system access.

### debugpy in production
The `debugpy` remote debugger MUST NOT be enabled in production or shared environments. The Dockerfile SHOULD use a multi-stage build or conditional CMD to disable debugpy outside of development.
