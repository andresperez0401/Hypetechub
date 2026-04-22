# Playbook: Build Agent OS

## Purpose
Bootstrap the Agent OS for a new project. Run this playbook once, before touching any application code.

## When to activate
First session of a new project. Goal: establish the complete agent infrastructure so that all future work is guided, consistent, and portable across Claude, Copilot, and Codex.

## Agent
Orchestrator coordinates. No implementation agent needed — this playbook is about structure, not code.

---

## Steps

### Step 1 — Define project context
Document in `agents/contracts/code-standards.md`:
- Project name and purpose
- Tech stack decisions (final)
- Monorepo structure
- Naming conventions

### Step 2 — Create registry
Create all agent definitions in `agents/registry/`:
- orchestrator.md
- backend-architect.md
- frontend-architect.md
- auth-engineer.md
- qa-reviewer.md
- devops-engineer.md
- docs-writer.md

Each file must define: role, responsibilities, tech stack, constraints, and which skills it uses.

### Step 3 — Create skills
Create `agents/skills/<skill-name>/SKILL.md` for each capability:
- hexagonal-backend
- nest-bootstrap
- next-bootstrap
- nest-auth-jwt-google-turnstile
- next-responsive-ui
- swagger-and-testing
- dockerize-monorepo
- release-checklist

Each SKILL.md must include: purpose, when to apply, step-by-step guide, and validation checklist.

### Step 4 — Create contracts
Create standards all agents must follow in `agents/contracts/`:
- done-definition.md
- code-standards.md
- testing-policy.md
- doc-policy.md

### Step 5 — Create playbooks
Create workflow playbooks in `agents/playbooks/`:
- build-agent-os.md (this file)
- build-mvp-videos-challenge.md
- add-auth-phase2.md
- dockerize-and-deploy.md

### Step 6 — Create adapters
Create tool-specific adapters pointing to `agents/` as source of truth:
- `.claude/CLAUDE.md`
- `.github/copilot-instructions.md`
- `.codex/config.toml`

### Step 7 — Validate
- [ ] All registry files exist with real content (not placeholders)
- [ ] All skill SKILL.md files have step-by-step guides
- [ ] All contracts define measurable, enforceable rules
- [ ] All adapters reference `agents/` as source of truth
- [ ] Agent OS is committed to version control

---

## Done condition
Agent OS is done when: any agent (Claude, Copilot, Codex) can be given the `agents/` directory and immediately know the project context, standards, and how to work on any feature without additional instructions.

## Next playbook
→ `build-mvp-videos-challenge.md`
