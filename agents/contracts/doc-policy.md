# Contract: Documentation Policy

## Purpose
Define when documentation must be created or updated, who is responsible, and what is considered sufficient. Prevents docs from going stale.

---

## Trigger conditions — when docs MUST update

| Change | Required update |
|--------|----------------|
| New API endpoint added | Swagger decorators + response types |
| Existing endpoint signature changed | Swagger updated to match |
| New env var required | `.env.example` + description |
| New service added to Docker Compose | README Docker section |
| Architecture decision made | ADR written |
| New developer setup step required | README setup section |
| Contract in `agents/` changed | Relevant agent registry updated |
| Auth flow changed | `auth-engineer.md` updated |

**Rule:** A PR that changes any of the above without the corresponding doc update will be rejected by QA Reviewer.

---

## Swagger policy

### What requires Swagger annotations
- All `@Controller` classes → `@ApiTags('...')`
- All public endpoints → `@ApiOperation({ summary: '...' })`
- All endpoints → `@ApiResponse` for each documented status code
- All endpoints with `@Body()` → `@ApiBody({ type: Dto })`
- All endpoints with JWT guard → `@ApiBearerAuth()`
- All DTO properties → `@ApiProperty({ example: ... })`

### What does NOT need Swagger
- Internal NestJS providers (services, repositories)
- Health check endpoint (optional, low priority)

### Swagger accuracy rule
Swagger must describe the actual behavior, not the intended behavior. If the implementation changed, update Swagger immediately — not after the fact.

---

## ADR (Architecture Decision Record) policy

### When to write an ADR
- Choosing between two or more non-trivial alternatives
- Adding a major dependency
- Changing the layer structure of a module
- Choosing an auth strategy
- Deciding on a data model that affects multiple modules
- Any decision that someone might question later

### When NOT to write an ADR
- Naming decisions (use `code-standards.md`)
- Trivial implementation choices
- Things that are obvious from the code

### ADR location
`docs/adr/ADR-XXX-title-in-kebab-case.md`

### ADR format
```markdown
# ADR-XXX: Short Title

## Status
Accepted

## Context
Why this decision needed to be made. What constraints existed.

## Decision
What was decided and why.

## Consequences
What becomes easier, what becomes harder, what is now prohibited.
```

### ADR numbering
Sequential. Find the last ADR number and increment by 1. Never reuse numbers.

---

## README policy

### Root README must contain
- Project overview (1 paragraph)
- Tech stack list
- Prerequisites (Node version, npm workspaces, Docker)
- Local setup steps (clone → install → env → run)
- Docker setup steps
- Links to: Swagger UI, frontend URL, pgAdmin

### When README updates are required
- New prerequisite software added
- Setup steps change
- New service added to the stack
- Port numbers change

### What does NOT go in README
- Code explanations (those go in ADRs or inline comments)
- Business logic explanations
- Internal implementation details

---

## Agent registry policy

### When to update `agents/registry/`
- An agent's responsibilities change
- A new skill is added that an agent uses
- Tech stack changes (e.g., switching from one library to another)
- A constraint changes

### When to update `agents/contracts/`
- Any contract rule changes
- Thresholds change (coverage, etc.)
- A new trigger condition is added

---

## Owner
- Swagger: Backend Architect (primary), Docs Writer (reviewer)
- ADRs: Orchestrator triggers, relevant architect writes
- README: Docs Writer
- Agent registry: Orchestrator
- Contracts: all agents, Orchestrator final approval
