# AGENTS Bridge

This file is a bridge for coding agents.

## Source of truth
All system behavior, architecture rules, workflows, and completion criteria live in the `agents/` directory.

Read in this order before implementation:
1. `agents/contracts/*.md`
2. `agents/registry/*.md`
3. `agents/skills/*/SKILL.md`
4. `agents/playbooks/*.md`

## Active default workflow
- Start from `agents/registry/orchestrator.md`
- Use `agents/playbooks/build-mvp-videos-challenge.md` unless a specific phase is requested.

## Mandatory architecture rules
- Backend modules must follow hexagonal architecture.
- Domain layer has no NestJS or Prisma imports.
- Controllers must stay thin and delegate directly to use cases.
- Public endpoints must include Swagger decorators.
- No secrets in repository files.
