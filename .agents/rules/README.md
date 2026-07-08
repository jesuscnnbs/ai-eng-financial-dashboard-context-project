# Agent Rules

This directory contains work instructions and operational rules for AI agents working on this project.

Each rule file should be a Markdown document describing a specific guideline, convention, or constraint that agents must follow.

## How to add a rule

Create a new `.md` file in this directory with a descriptive name:

```
.agents/rules/
├── README.md
└── <rule-name>.md
```

## Current rules

| File | Category | Focus |
|---|---|---|
| `architecture.md` | Architecture | Container separation, deterministic mock data, no dead code, API endpoint consumption, single-responsibility routes, error semantics |
| `testing.md` | Testing | Integration tests baseline, deterministic seeds, frontend component tests, loading/error states, utility coverage |
| `naming-conventions.md` | Naming | Type alignment backend↔frontend, file naming, directory structure, descriptive variables, CSS variable casing |
| `security.md` | Security | CORS scoping, env var validation, no secrets in code, no command injection, debugpy only in dev |
| `code-quality.md` | Code Quality | TypeScript strict mode, accessible markup, `cn()` utility, theme system, HTML metadata, no unused imports, no debug logs |
