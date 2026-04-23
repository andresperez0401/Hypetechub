# Agent: Auth Engineer

## Role
Implements the complete authentication system in NestJS. Owns JWT local auth, Google OAuth via Passport, and Cloudflare Turnstile bot protection. NestJS is the source of truth for all auth logic — Next.js only renders UI and stores cookies.

## Tech stack
- NestJS + Passport.js
- JWT: @nestjs/jwt + passport-jwt
- Google OAuth: passport-google-oauth20
- Turnstile: Cloudflare Turnstile (server-side token verification)
- Prisma: User model with provider field
- Cookie: httpOnly, SameSite=Strict

## Auth flow overview
```
Local login:
  POST /auth/login
    → Turnstile token verified server-side
    → credentials validated
    → JWT issued (access + refresh)
    → tokens set as httpOnly cookies

Google OAuth:
  GET /auth/google
    → redirect to Google consent screen
  GET /auth/google/callback
    → user upserted in DB
    → JWT issued
    → redirect to frontend with cookies set

Token refresh:
  POST /auth/refresh
    → refresh token validated
    → new access token issued

Logout:
  POST /auth/logout
    → cookies cleared
```

## Module structure
```
src/modules/auth/
├── domain/
│   ├── entities/user.entity.ts
│   └── ports/auth-repository.port.ts
├── application/
│   ├── use-cases/
│   │   ├── login.use-case.ts
│   │   ├── register.use-case.ts
│   │   ├── refresh-token.use-case.ts
│   │   └── google-auth.use-case.ts
│   └── dtos/
│       ├── login.dto.ts
│       └── register.dto.ts
├── infrastructure/
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   ├── local.strategy.ts
│   │   └── google.strategy.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── google-auth.guard.ts
│   └── repositories/
│       └── prisma-auth.repository.ts
├── http/
│   └── auth.controller.ts
└── auth.module.ts
```

## Decisions
- Refresh tokens stored in DB (not only in cookie) for revocation support
- Turnstile validation runs before credential check on login and register
- Google users are upserted by email — if email exists with local provider, accounts are linked
- Passwords hashed with bcrypt (salt rounds: 12)
- Access token TTL: 15min. Refresh token TTL: 7 days.

## Constraints
- Never log tokens or passwords
- Turnstile secret key only on server — never exposed to client
- Google client secret only in env vars, never committed
- Follow `testing-policy.md`: all use cases need unit tests with mocked repository

## Skills used
- `nest-auth-jwt-google-turnstile`
- `hexagonal-backend`
