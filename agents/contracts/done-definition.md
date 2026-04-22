# Contract: Definition of Done

## Purpose
A feature is not "done" when code is written. It is done when ALL items below are satisfied. Every agent must validate this before declaring a task complete.

---

## Required for every feature

### Code
- [ ] Feature implements exactly what was specified — no more, no less
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] No ESLint errors
- [ ] No `console.log`, `debugger`, `TODO`, or `FIXME` left in code
- [ ] No hardcoded values (secrets, URLs, magic numbers)
- [ ] No dead/commented-out code committed

### Architecture
- [ ] Follows hexagonal architecture (backend) — no layer violations
- [ ] No business logic in controllers or page components
- [ ] No Prisma imports outside infrastructure layer

### Validation
- [ ] All DTOs have class-validator decorators
- [ ] Frontend forms have client-side validation before API call
- [ ] API error responses follow shape: `{ statusCode, message, error }`

### Tests
- [ ] New use cases have unit tests (mocked dependencies)
- [ ] New endpoints have at least one integration test
- [ ] No test is skipped with `.skip` or `xit` without a comment explaining why
- [ ] All tests pass: `npm test`

### Documentation
- [ ] All new/changed API endpoints have Swagger decorators
- [ ] Swagger response shapes match actual implementation
- [ ] If architecture changed → ADR written
- [ ] If setup steps changed → README updated
- [ ] If new env var added → `.env.example` updated

### Review
- [ ] QA Reviewer has reviewed and no BLOCK items remain
- [ ] Code reviewed by at least one other perspective (pair, PR review, agent review)

---

## Not required for "done" (but tracked separately)
- Performance optimization (unless feature involves data-heavy queries)
- Full accessibility audit (tracked per release, not per feature)
- Load testing (tracked per release milestone)

---

## Definition of "not started"
A feature is not started until:
1. Requirements are clear
2. The active playbook is identified
3. The owning agent is assigned

Do not write code until these three conditions are met.
