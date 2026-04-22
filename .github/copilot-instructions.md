# GitHub Copilot Instructions

## Source of truth
This file is an adapter. All project standards, architecture decisions, agent roles, and workflows are defined in `agents/`. Read `agents/` before suggesting any code.

---

## Project overview
Professional monorepo:
- **Backend:** NestJS + TypeScript + Prisma + PostgreSQL
- **Frontend:** Next.js App Router + TypeScript + Tailwind CSS
- **Auth:** JWT (httpOnly cookies) + Google OAuth (Passport) + Cloudflare Turnstile
- **Architecture:** Hexagonal (backend), feature-based components (frontend)
- **Package manager:** npm workspaces + Turborepo

---

## Critical rules — always apply

### Backend
- **Hexagonal architecture is mandatory.** Every module has: `domain/`, `application/`, `infrastructure/`, `http/`. See `agents/skills/hexagonal-backend/SKILL.md`.
- Domain layer has ZERO imports from `@nestjs/*` or `@prisma/client`
- Use cases have ONE public method: `execute()`
- Controllers delegate immediately to use cases — no `if` statements, no logic
- All DTOs use `class-validator` decorators
- All public endpoints have Swagger decorators (`@ApiOperation`, `@ApiResponse`, `@ApiProperty` on DTOs)

### Frontend
- **App Router only** — no Pages Router
- No inline styles — Tailwind utilities only
- No data fetching in components — use custom hooks
- API calls use `withCredentials: true` (cookies)
- Forms use React Hook Form + Zod
- Mobile-first responsive design

### Auth
- Tokens in httpOnly cookies — never in localStorage or response body
- Turnstile verified server-side before credential check
- Passwords hashed with bcrypt (rounds: 12)
- See `agents/registry/auth-engineer.md` for full auth design

### General
- No `any` types
- No `console.log` in production code
- Conventional Commits format
- No secrets hardcoded — env vars only

---

## File naming
| Context | Pattern |
|---------|---------|
| NestJS files | `kebab-case.type.ts` (e.g. `login.use-case.ts`) |
| React components | `PascalCase.tsx` (e.g. `LoginForm.tsx`) |
| React hooks | `camelCase.ts` with `use` prefix (e.g. `useAuth.ts`) |
| Tests | same file + `.spec.ts` |

---

## Before suggesting code, check
1. Which layer does this belong to? (domain / application / infrastructure / http / component / hook)
2. Does it import from the correct layers only?
3. Does it have the right test pattern? (see `agents/contracts/testing-policy.md`)
4. Does it need Swagger decorators?
5. Is it covered by `agents/contracts/done-definition.md`?

---

## Key files to read for context
- `agents/registry/orchestrator.md` — overall coordination model
- `agents/contracts/code-standards.md` — naming and structure rules
- `agents/contracts/done-definition.md` — completion criteria
- `agents/skills/hexagonal-backend/SKILL.md` — backend module template
- `agents/skills/nest-auth-jwt-google-turnstile/SKILL.md` — auth implementation
