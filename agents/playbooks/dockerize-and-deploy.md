# Playbook: Dockerize and Deploy

## Purpose
Containerize the full monorepo and prepare it for production deployment. Covers Docker builds, Compose config, environment management, and CI pipeline setup.

## When to activate
After MVP is feature-complete and QA-approved. Or when adding Docker to an existing project.

## Agents involved
- DevOps Engineer (Docker, CI/CD)
- QA Reviewer (final validation)
- Docs Writer (README deploy section)

---

## Steps

### Step 1 — Write Dockerfiles
**Skill:** `dockerize-monorepo`

1. Backend Dockerfile: multi-stage (deps → builder → runner), Node 20 Alpine
2. Frontend Dockerfile: multi-stage (deps → builder → runner), `output: 'standalone'` required
3. Both images must be as small as possible — no dev dependencies in runner stage
4. Both must have HEALTHCHECK instructions

**Gate:** `docker build` succeeds for both images with no warnings.

---

### Step 2 — Docker Compose (dev)
1. Services: postgres, pgadmin, backend, frontend
2. All services: `restart: unless-stopped`
3. Postgres: named volume, health check, not exposed on host (internal network only)
4. Backend: `depends_on: postgres (condition: service_healthy)`
5. Frontend: `depends_on: backend (condition: service_healthy)`
6. pgadmin: dev only

**Gate:** `docker compose up --build` starts all 4 services healthy.

---

### Step 3 — Docker Compose (production override)
1. Create `docker-compose.prod.yml`
2. Remove pgadmin service
3. Remove port mapping for postgres (internal only)
4. Set `NODE_ENV=production` for all services
5. Remove dev-only volumes

Usage:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Gate:** Production compose starts without pgadmin, postgres not accessible from host.

---

### Step 4 — Environment management
1. Audit `.env.example` — every var used in code must be documented
2. Write descriptions for each var in `.env.example`
3. Verify no var is hardcoded in any Dockerfile or compose file
4. Document how to get values for each var (Google Console URL, Cloudflare dashboard, etc.)

**Gate:** A new developer can set up the project using only `.env.example` as a guide.

---

### Step 5 — Health check endpoint
Ensure NestJS exposes:
```
GET /api/health → { status: 'ok', timestamp: '...' }
```
No auth guard. Used by Docker and load balancers.

**Gate:** `curl http://localhost:3001/api/health` returns 200.

---

### Step 6 — GitHub Actions CI
Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test

  build-images:
    runs-on: ubuntu-latest
    needs: [test]
    steps:
      - uses: actions/checkout@v4
      - run: docker compose build
```

**Gate:** CI passes on a clean branch.

---

### Step 7 — Final release checklist
Run `release-checklist` skill:
- [ ] Both Docker images build
- [ ] All services healthy in `docker compose up`
- [ ] All tests pass in CI
- [ ] No secrets in any committed file
- [ ] `.env.example` complete with descriptions
- [ ] README has Docker setup section
- [ ] Health endpoint returns 200

---

## README — Docker section template
```markdown
## Running with Docker

### Prerequisites
- Docker and Docker Compose installed
- `.env` file created from `.env.example`

### Start
\`\`\`bash
docker compose up --build
\`\`\`

### Services
| Service | URL |
|---------|-----|
| Backend API | http://localhost:3001/api |
| Swagger UI | http://localhost:3001/api/docs |
| Frontend | http://localhost:3000 |
| pgAdmin | http://localhost:5050 |

### Stop
\`\`\`bash
docker compose down
\`\`\`
```

## Done condition
Deploy is done when:
- Both services build and run in Docker
- CI pipeline passes
- `.env.example` is complete
- README has Docker setup instructions
- Production compose removes dev tools
