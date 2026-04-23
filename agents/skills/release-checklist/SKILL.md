# Skill: Release Checklist

## Purpose
Pre-release gate. Ensures no feature ships without passing all quality, documentation, and operational requirements. Run before any merge to main or production deploy.

## When to apply
- Before merging a feature branch to main
- Before tagging a release
- Before deploying to staging or production

---

## Checklist

### Code quality
- [ ] No TypeScript errors (`npm run typecheck` passes)
- [ ] No lint errors (`npm run lint` passes)
- [ ] No `console.log`, `TODO`, `FIXME`, or `debugger` left in production code
- [ ] No hardcoded secrets, URLs, or credentials
- [ ] No commented-out code blocks

### Testing
- [ ] All unit tests pass (`npm test` passes)
- [ ] All e2e/integration tests pass
- [ ] Coverage thresholds met (see `testing-policy.md`)
- [ ] New features have corresponding tests
- [ ] Edge cases and error paths are tested

### Database
- [ ] All Prisma migrations are committed and named descriptively
- [ ] Migrations are reversible or have a rollback plan
- [ ] No breaking schema changes without a migration strategy
- [ ] `prisma migrate deploy` tested against a clean DB

### Security
- [ ] All new endpoints protected with appropriate guards
- [ ] Input validation (class-validator) on all DTOs
- [ ] No sensitive data in API responses
- [ ] No new dependencies with known critical vulnerabilities (`npm audit`)
- [ ] Env vars documented in `.env.example`

### Documentation
- [ ] Swagger up to date for all new/changed endpoints
- [ ] README updated if setup steps changed
- [ ] ADR written for any significant architectural decision
- [ ] `agents/contracts/` updated if standards changed

### Docker / Infra
- [ ] Docker images build successfully
- [ ] `docker-compose up` starts all services healthy
- [ ] Health checks pass for all services
- [ ] New env vars added to `.env.example` and deployment config

### Final sign-off
- [ ] QA Reviewer has approved (see `qa-reviewer.md` checklist)
- [ ] `done-definition.md` checklist satisfied
- [ ] Branch is up to date with main (no conflicts)

---

## How to run
```bash
# From monorepo root (using npm workspaces + turbo)
npm run typecheck     # TypeScript check all workspaces
npm run lint          # ESLint all workspaces
npm test              # Unit tests all workspaces
npm run test:e2e      # E2E tests (backend)
npm audit             # Dependency security audit
docker compose build  # Verify images build
docker compose up -d  # Verify all services start healthy
```

## Blocking vs non-blocking items
- **Blocking** (must fix before release): failing tests, TypeScript errors, hardcoded secrets, missing migrations, Swagger missing on public endpoints
- **Non-blocking** (flag, may release with agreement): missing ADR for minor change, lint warnings in untouched files
