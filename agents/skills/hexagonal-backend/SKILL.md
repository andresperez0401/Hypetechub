# Skill: Hexagonal Backend Architecture

## Purpose
Define and enforce the hexagonal (ports & adapters) architecture pattern in NestJS modules. Keeps domain logic independent of frameworks, databases, and external services.

## When to apply
- Creating any new NestJS feature module
- Refactoring existing modules that mix concerns
- Reviewing backend code for layer violations

## Layer definitions

### domain/
Pure TypeScript. Zero NestJS or Prisma imports.
- `entities/` — business objects with behavior (not just data bags)
- `value-objects/` — immutable objects identified by value (Email, Password, etc.)
- `errors/` — domain-specific error classes
- `ports/` — repository and service interfaces (abstract contracts)

### application/
Orchestrates domain. Depends on ports, not implementations.
- `use-cases/` — one class per use case, one `execute()` method
- `dtos/` — input/output shapes for use cases (class-validator decorated)
- `services/` — application services when logic spans multiple use cases

### infrastructure/
Implements ports. Can import Prisma, axios, AWS SDK, etc.
- `repositories/` — Prisma implementations of repository ports
- `services/` — external service adapters (email, storage, etc.)
- `strategies/` — Passport strategies (auth only)

### http/ (or presentation/)
NestJS controllers only. Delegates to use cases immediately.
- `controllers/` — HTTP binding, no business logic
- `guards/` — route protection
- `interceptors/` — request/response transformation

## Module template
```
src/modules/<feature>/
├── domain/
│   ├── entities/<feature>.entity.ts
│   ├── errors/<feature>.errors.ts
│   └── ports/<feature>-repository.port.ts
├── application/
│   ├── use-cases/
│   │   ├── create-<feature>.use-case.ts
│   │   └── get-<feature>.use-case.ts
│   └── dtos/
│       ├── create-<feature>.dto.ts
│       └── <feature>-response.dto.ts
├── infrastructure/
│   └── repositories/
│       └── prisma-<feature>.repository.ts
├── http/
│   └── <feature>.controller.ts
└── <feature>.module.ts
```

## Dependency rule (strict)
```
http → application → domain ← infrastructure
            ↓
         ports (interfaces)
```
- Inner layers NEVER import from outer layers
- Infrastructure implements domain ports via dependency injection
- NestJS DI wires the concrete implementation to the port interface

## Anti-patterns to reject
- Prisma model used directly in domain entity
- Controller calling repository directly
- Use case importing NestJS decorators
- Domain entity importing from application layer
- Fat controllers with conditional logic

## Validation
Run this check mentally before approving any module:
1. Can domain + application be tested without NestJS bootstrapped? → YES required
2. Does any domain file import from `@nestjs/*` or `@prisma/*`? → FAIL
3. Does any controller contain an `if` that is not routing logic? → FAIL
