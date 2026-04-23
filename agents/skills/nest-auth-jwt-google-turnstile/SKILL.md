# Skill: NestJS Auth — JWT + Google OAuth + Cloudflare Turnstile

## Purpose
Implement complete authentication in NestJS: local JWT auth with refresh tokens, Google OAuth via Passport, and Cloudflare Turnstile bot protection on login and register.

## When to apply
- Implementing auth module for the first time
- Adding Google OAuth to an existing JWT setup
- Adding Turnstile to existing auth endpoints

## Dependencies
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local passport-google-oauth20
npm install bcrypt
npm install -D @types/passport-jwt @types/passport-local @types/passport-google-oauth20 @types/bcrypt
```

## Prisma schema additions
```prisma
model User {
  id             String    @id @default(cuid())
  email          String    @unique
  passwordHash   String?   // null for OAuth-only users
  provider       Provider  @default(LOCAL)
  googleId       String?   @unique
  refreshToken   String?   // hashed
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

enum Provider {
  LOCAL
  GOOGLE
}
```

## Turnstile verification
```typescript
// application/services/turnstile.service.ts
@Injectable()
export class TurnstileService {
  async verify(token: string, ip?: string): Promise<boolean> {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: ip,
        }),
      },
    );
    const data = await response.json();
    return data.success === true;
  }
}
```

## JWT strategy
```typescript
// infrastructure/strategies/jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.access_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

## Google strategy
```typescript
// infrastructure/strategies/google.strategy.ts
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    return {
      googleId: profile.id,
      email: profile.emails?.[0].value,
      displayName: profile.displayName,
    };
  }
}
```

## Controller endpoints
```
POST /api/auth/register     ← local register (Turnstile required)
POST /api/auth/login        ← local login (Turnstile required)
POST /api/auth/refresh      ← refresh access token
POST /api/auth/logout       ← clear cookies
GET  /api/auth/google       ← initiate Google OAuth
GET  /api/auth/google/callback ← Google OAuth callback
GET  /api/auth/me           ← get current user (JWT guard)
```

## Cookie config (production)
```typescript
res.cookie('access_token', accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000, // 15 min
});
```

## Required env vars
```
JWT_SECRET=
JWT_REFRESH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
TURNSTILE_SECRET_KEY=
```

## Validation checklist
- [ ] Turnstile verified server-side before any credential check
- [ ] Passwords hashed with bcrypt (rounds: 12)
- [ ] Refresh tokens hashed before storing in DB
- [ ] Access token in httpOnly cookie, not response body
- [ ] Google users upserted by email
- [ ] All use cases have unit tests with mocked repository
- [ ] `/api/auth/me` requires JWT guard
