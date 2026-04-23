# Playbook: Add Auth Phase 2

## Purpose
Extend the existing auth system with additional features: email verification, password reset, session management UI, or role-based access control (RBAC).

## When to activate
After MVP auth (JWT + Google + Turnstile) is working. Use this playbook when adding one of the auth extensions below.

## Agents involved
- Auth Engineer (backend implementation)
- Frontend Architect (UI for new auth flows)
- QA Reviewer (validation gate)
- Docs Writer (Swagger + ADR updates)

---

## Available extensions (pick one per activation)

### Extension A — Email verification
**Why:** Prevent fake accounts, confirm user owns the email.

Steps:
1. Add `emailVerified: boolean` and `verificationToken: String?` to Prisma User model
2. Run migration
3. Create `VerifyEmailUseCase` — generate token, send email, verify token
4. Add email service adapter (nodemailer or Resend)
5. Add endpoints: `POST /auth/send-verification`, `GET /auth/verify?token=`
6. Block login for unverified users (configurable via env flag)
7. Frontend: show "check your email" screen after register
8. Swagger: document new endpoints

**Gate:** New user receives email, clicks link, account marked verified, login allowed.

---

### Extension B — Password reset
**Why:** Users forget passwords. Required for production.

Steps:
1. Add `resetToken: String?` and `resetTokenExpiry: DateTime?` to Prisma User model
2. Run migration
3. Create `RequestPasswordResetUseCase` — generate token, send email
4. Create `ResetPasswordUseCase` — validate token + expiry, hash new password, clear token
5. Add endpoints: `POST /auth/forgot-password`, `POST /auth/reset-password`
6. Frontend: forgot password page + reset password page
7. Swagger: document new endpoints

**Gate:** User receives reset email, sets new password, can login with new password, old password rejected.

---

### Extension C — Role-based access control (RBAC)
**Why:** Different users need different permissions.

Steps:
1. Add `Role` enum to Prisma: `USER`, `ADMIN`, `MODERATOR`
2. Add `role: Role @default(USER)` to User model
3. Run migration
4. Create `RolesGuard` that checks `@Roles()` decorator
5. Add `@Roles(Role.ADMIN)` to admin endpoints
6. JWT payload includes role — update JwtStrategy validate()
7. Frontend: hide admin UI for non-admin users
8. Swagger: document which endpoints require which role

**Gate:** Admin user can access admin endpoints. Regular user gets 403. Role visible in JWT payload.

---

### Extension D — Session management
**Why:** Users should be able to see and revoke active sessions.

Steps:
1. Add `Session` model: id, userId, refreshTokenHash, userAgent, ip, createdAt, lastUsedAt
2. Run migration
3. Update refresh token logic to use Session model
4. Add `GET /auth/sessions` — list active sessions
5. Add `DELETE /auth/sessions/:id` — revoke session
6. Frontend: sessions page in user settings
7. Swagger: document new endpoints

**Gate:** User sees all sessions, can revoke any session, revoked session cannot refresh.

---

## For each extension

### QA gate
Run `release-checklist` skill after each extension.
Focus on:
- [ ] Security edge cases (expired tokens, double-use of tokens)
- [ ] Error messages don't leak sensitive info (no "user not found", use "if email exists...")
- [ ] New endpoints documented in Swagger
- [ ] Unit tests for new use cases
- [ ] ADR written if a significant decision was made

### Docs gate
- [ ] Swagger updated
- [ ] README updated if setup steps changed
- [ ] `.env.example` updated if new vars added

## Done condition
Extension is done when:
- Feature works end-to-end in browser
- Security edge cases handled and tested
- Swagger accurate
- QA Reviewer approves
