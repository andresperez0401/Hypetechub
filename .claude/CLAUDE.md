# CLAUDE.md — Claude Code Adapter

## Source of truth
All agent behavior, skills, playbooks, and contracts live in `agents/`. This file is an adapter — it configures how Claude reads and applies that source of truth.

**Do not modify `agents/` content here. Modify it in `agents/` directly.**

---

## Project context
- **Type:** Professional monorepo
- **Backend:** NestJS + TypeScript + Prisma + PostgreSQL
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Auth:** JWT local + Google OAuth + Cloudflare Turnstile
- **Architecture:** Hexagonal (backend), component-based (frontend)
- **Package manager:** npm workspaces + Turborepo

---

## How to orient yourself

1. Read `agents/registry/orchestrator.md` to understand the coordination model
2. Read the active playbook in `agents/playbooks/` for the current phase
3. Read relevant agent file in `agents/registry/` for the task at hand
4. Read relevant skill in `agents/skills/` before implementing
5. Check `agents/contracts/` before declaring anything done

---

## Mandatory behaviors

### Before writing any code
- Identify which playbook is active
- Identify which agent owns the task
- Read the relevant skill's SKILL.md
- Confirm the task satisfies the active playbook phase

### While writing code
- Apply `agents/contracts/code-standards.md` — always
- Apply hexagonal architecture for all backend modules (see `agents/skills/hexagonal-backend/SKILL.md`)
- No business logic in controllers or page components
- No `any` types
- No `console.log` in production code

### Before declaring done
- Run through `agents/contracts/done-definition.md` checklist
- Confirm tests exist (see `agents/contracts/testing-policy.md`)
- Confirm Swagger updated (see `agents/contracts/doc-policy.md`)

---

## Agent activation by task type

| User asks about | Read this first |
|-----------------|-----------------|
| Backend structure, modules | `agents/registry/backend-architect.md` |
| Frontend pages, components | `agents/registry/frontend-architect.md` |
| JWT, Google OAuth, Turnstile | `agents/registry/auth-engineer.md` |
| Docker, env, CI | `agents/registry/devops-engineer.md` |
| Tests, code review | `agents/registry/qa-reviewer.md` |
| Swagger, README, ADRs | `agents/registry/docs-writer.md` |
| Coordination, next step | `agents/registry/orchestrator.md` |

---

## Skill quick-reference

| Task | Skill |
|------|-------|
| New backend module | `agents/skills/hexagonal-backend/SKILL.md` |
| NestJS from scratch | `agents/skills/nest-bootstrap/SKILL.md` |
| Next.js from scratch | `agents/skills/next-bootstrap/SKILL.md` |
| Auth implementation | `agents/skills/nest-auth-jwt-google-turnstile/SKILL.md` |
| UI components | `agents/skills/next-responsive-ui/SKILL.md` |
| Swagger + tests | `agents/skills/swagger-and-testing/SKILL.md` |
| Docker setup | `agents/skills/dockerize-monorepo/SKILL.md` |
| Pre-release check | `agents/skills/release-checklist/SKILL.md` |

---

## What NOT to do
- Do not invent architecture patterns not defined in `agents/`
- Do not skip the hexagonal layer structure
- Do not write tests that mock the database at integration level
- Do not add features beyond what the active playbook phase specifies
- Do not commit `.env` files
- Do not expose secrets in logs or API responses

---

## Recommended workflow per session
```
1. User states intent
2. Claude reads orchestrator.md → identifies playbook + agent
3. Claude reads relevant agent file
4. Claude reads relevant skill(s)
5. Claude implements following contracts
6. Claude validates against done-definition.md
7. Claude reports what was done and what comes next (per playbook)
```
