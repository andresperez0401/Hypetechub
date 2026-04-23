# Playbook: Build MVP — Videos Challenge

## Purpose
Build the complete MVP of the project: monorepo scaffold, backend with hexagonal architecture, frontend with App Router, auth system, database, and basic UI.

## When to activate
After Agent OS is complete (`build-agent-os.md` done). This is the main build playbook.

## Agents involved
- Orchestrator (coordinates)
- Backend Architect (backend structure + modules)
- Frontend Architect (frontend structure + pages)
- Auth Engineer (auth module)
- QA Reviewer (gates each phase)
- Docs Writer (updates Swagger + README)
- DevOps Engineer (Docker setup)

---

## Phases

### Phase 1 — Monorepo scaffold
**Agent:** Backend Architect + Frontend Architect
**Skills:** `nest-bootstrap`, `next-bootstrap`

Steps:
1. Initialize npm workspace monorepo (using turbo)
2. Create `apps/backend` with NestJS
3. Create `apps/frontend` with Next.js (App Router)
4. Configure shared `tsconfig` base
5. Add root `package.json` with workspace scripts
6. Set up ESLint + Prettier for both apps
7. Commit: `chore: initialize monorepo with NestJS and Next.js`

**Gate:** Both apps start locally without errors.

---

### Phase 2 — Database and Prisma
**Agent:** Backend Architect
**Skills:** `hexagonal-backend`

Steps:
1. Initialize Prisma in backend
2. Define initial schema: User model (id, email, passwordHash, provider, googleId, refreshToken, createdAt, updatedAt)
3. Run `prisma migrate dev --name init`
4. Create PrismaService
5. Register PrismaModule globally

**Gate:** `prisma studio` opens, User table visible.

---

### Phase 3 — Auth module
**Agent:** Auth Engineer
**Skills:** `nest-auth-jwt-google-turnstile`, `hexagonal-backend`

Steps:
1. Create `src/modules/auth/` with hexagonal structure
2. Implement domain entities and port interfaces
3. Implement use cases: register, login, refresh, logout, google-auth
4. Implement JWT strategy (cookie-based)
5. Implement Google OAuth strategy
6. Implement Turnstile verification service
7. Wire Passport guards
8. Expose endpoints via AuthController
9. Add Swagger decorators to all endpoints

**Gate:** Login, register, refresh, logout, and Google OAuth all work via Swagger UI.

---

### Phase 4 — Frontend auth UI
**Agent:** Frontend Architect
**Skills:** `next-bootstrap`, `next-responsive-ui`

Steps:
1. Create login page at `app/(auth)/login/page.tsx`
2. Create register page at `app/(auth)/register/page.tsx`
3. Build LoginForm and RegisterForm components with React Hook Form + Zod
4. Integrate Cloudflare Turnstile widget in forms
5. Create `useAuth` hook connecting to backend API
6. Handle auth state via context (user, isLoading, logout)
7. Implement protected route middleware

**Gate:** Login flow works end-to-end in browser. Google OAuth redirects and returns user session.

---

### Phase 5 — Core feature module
**Agent:** Backend Architect + Frontend Architect
**Skills:** `hexagonal-backend`, `next-responsive-ui`

*(This phase is feature-specific — fill in when feature is defined)*

Steps:
1. Define domain model for core feature
2. Create backend module with hexagonal structure
3. Implement use cases + Prisma repository
4. Expose REST endpoints with Swagger docs
5. Build frontend feature UI consuming API

**Gate:** Feature CRUD works end-to-end.

---

### Phase 6 — QA and docs
**Agent:** QA Reviewer + Docs Writer
**Skills:** `swagger-and-testing`, `release-checklist`

Steps:
1. Run full `release-checklist` skill
2. Fix all BLOCK items from QA review
3. Verify Swagger is accurate for all endpoints
4. Update README with setup instructions
5. Write ADR for any significant decisions made during build

**Gate:** All items in `release-checklist` pass. QA Reviewer approves.

---

### Phase 7 — Docker
**Agent:** DevOps Engineer
**Skills:** `dockerize-monorepo`

Steps:
1. Write Dockerfile for backend (multi-stage)
2. Write Dockerfile for frontend (multi-stage, standalone)
3. Write `docker-compose.yml` with postgres, backend, frontend, pgadmin
4. Write `.env.example` with all required vars
5. Test: `docker compose up --build`

**Gate:** All services start healthy via Docker Compose.

---

## Done condition
MVP is done when:
- Auth works (local + Google)
- Core feature works end-to-end
- All tests pass
- Docker Compose starts all services
- Swagger is accurate
- README has setup instructions

## Next playbook
→ `add-auth-phase2.md` (if adding more auth features)
→ `dockerize-and-deploy.md` (if deploying)
