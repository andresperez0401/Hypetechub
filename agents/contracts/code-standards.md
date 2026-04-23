# Contract: Code Standards

## Purpose
Enforced conventions for all code in this monorepo. All agents must follow these. QA Reviewer checks compliance before approving.

---

## Naming conventions

### Files
| Context | Convention | Example |
|---------|-----------|---------|
| NestJS module | kebab-case | `auth.module.ts` |
| NestJS use case | kebab-case | `login.use-case.ts` |
| NestJS entity | kebab-case | `user.entity.ts` |
| NestJS DTO | kebab-case | `login.dto.ts` |
| React component | PascalCase | `LoginForm.tsx` |
| React hook | camelCase, `use` prefix | `useAuth.ts` |
| React page | `page.tsx` (Next.js App Router) | `app/login/page.tsx` |
| Test file | same as source + `.spec.ts` | `login.use-case.spec.ts` |

### Classes and types
| Context | Convention | Example |
|---------|-----------|---------|
| Class | PascalCase | `LoginUseCase` |
| Interface | PascalCase, no `I` prefix | `AuthRepositoryPort` |
| Type alias | PascalCase | `JwtPayload` |
| Enum | PascalCase + members PascalCase | `Provider.Google` |
| Constant | SCREAMING_SNAKE_CASE | `JWT_EXPIRY_SECONDS` |

### Variables and functions
| Context | Convention |
|---------|-----------|
| Variables | camelCase |
| Functions | camelCase |
| Boolean variables | `is`, `has`, `can` prefix |
| Private class members | camelCase (no underscore) |

---

## Backend (NestJS) conventions

### Module structure — mandatory
```
src/modules/<feature>/
├── domain/
├── application/
├── infrastructure/
├── http/
└── <feature>.module.ts
```
No exceptions. New features must follow this structure.

### Use case pattern
- One class per use case
- One public method: `execute(dto: InputDto): Promise<OutputDto>`
- Constructor receives only port interfaces (never concrete classes)
- No static methods

### Repository pattern
- Define port interface in `domain/ports/`
- Implement in `infrastructure/repositories/`
- Name: `Prisma<Entity>Repository implements <Entity>RepositoryPort`

### Error handling
- Domain errors extend a base `DomainError` class
- HTTP exceptions thrown in controller, not use case
- Use cases throw domain errors; controllers catch and rethrow as HTTP exceptions
- Never leak stack traces to HTTP responses in production

### Forbidden patterns
- `any` type — use `unknown` then narrow, or define proper types
- Non-null assertion (`!`) without a comment explaining why it's safe
- `require()` — use `import`
- Direct `process.env.VAR` in use cases or domain — inject via config service

---

## Frontend (Next.js) conventions

### Component rules
- One component per file
- Props interface defined in same file, named `<Component>Props`
- No default exports for components (named exports only) — except `page.tsx` and `layout.tsx` which Next.js requires as default
- No logic in JSX — extract to variables or hooks

### Hook rules
- All data fetching in custom hooks (`use<Feature>.ts`)
- Hooks return: `{ data, isLoading, error }` shape
- No direct axios calls in components — always through hooks or API functions

### Styling rules
- Tailwind only — no inline styles, no CSS-in-JS
- No magic pixel values — use Tailwind scale (`p-4` not `p-[16px]`)
- Mobile-first: default = mobile, `md:` = tablet, `lg:` = desktop

### Forbidden patterns
- `as any` — type properly
- `useEffect` with no dependency array — always specify deps
- Fetching in `useEffect` without a custom hook — use SWR or React Query or a typed hook
- `localStorage` for auth tokens — tokens are in httpOnly cookies managed by backend

---

## General conventions

### Comments
- Write comments for non-obvious logic only
- Never comment out code — delete it (git history preserves it)
- ADRs for architectural decisions, not inline comments

### Imports
- Absolute imports via `@/` alias (both apps)
- Group imports: external → internal → relative (enforced by ESLint)
- No barrel files (`index.ts` re-exports) unless genuinely needed

### Git
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- No commits directly to `main`
- PR title = commit message format

---

## ESLint rules (non-negotiable)
```json
{
  "no-console": "error",
  "no-debugger": "error",
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-non-null-assertion": "warn"
}
```
