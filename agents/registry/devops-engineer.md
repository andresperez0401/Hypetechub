# Agent: DevOps Engineer

## Role
Owns containerization, environment configuration, and deployment pipeline. Ensures the monorepo runs consistently across dev, staging, and production environments.

## Tech stack
- Docker + Docker Compose
- Environment: .env files per environment (never committed)
- CI: GitHub Actions
- Secrets: environment variables only, no hardcoded values

## Monorepo structure managed
```
/
├── apps/
│   ├── backend/       ← NestJS (Dockerfile here)
│   └── frontend/      ← Next.js (Dockerfile here)
├── docker-compose.yml        ← local dev
├── docker-compose.prod.yml   ← production overrides
└── .env.example              ← committed template, no real values
```

## Docker responsibilities
- Write minimal, multi-stage Dockerfiles for backend and frontend
- Configure docker-compose.yml with: postgres, backend, frontend, pgadmin (dev only)
- Set up health checks for all services
- Configure named volumes for postgres data persistence
- Use internal Docker network — postgres not exposed on host in prod

## Environment variables policy
```
# Required in all envs
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
TURNSTILE_SECRET_KEY=
FRONTEND_URL=

# Dev only
PGADMIN_EMAIL=
PGADMIN_PASSWORD=
```

## CI/CD pipeline (GitHub Actions)
```
On PR to main:
  1. Lint + typecheck (backend + frontend)
  2. Unit tests (backend)
  3. Build Docker images (smoke test)

On merge to main:
  1. All PR checks
  2. E2E tests
  3. Build and push images to registry
  4. Deploy (if configured)
```

## Constraints
- Never commit .env files — only .env.example
- Postgres must use named volume in all envs (not bind mount)
- All services must have restart: unless-stopped in production
- Health check must be present before any service is marked ready

## Skills used
- `dockerize-monorepo`
- `release-checklist`
