# Skill: Dockerize Monorepo

## Purpose
Containerize the NestJS backend and Next.js frontend in a monorepo. Set up Docker Compose for local development and production, with PostgreSQL, health checks, and secure env var handling.

## When to apply
- First-time containerization of the project
- Adding a new service to Docker Compose
- Auditing existing Docker setup

---

## Backend Dockerfile
```dockerfile
# apps/backend/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1
CMD ["node", "dist/main"]
```

## Frontend Dockerfile
```dockerfile
# apps/frontend/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000 || exit 1
CMD ["node", "server.js"]
```

## docker-compose.yml (development)
```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4:latest
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL}
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD}
    ports:
      - "5050:80"
    depends_on:
      - postgres

  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file: .env
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: ${NEXT_PUBLIC_TURNSTILE_SITE_KEY}
    restart: unless-stopped
    ports:
      - "3000:3000"
    depends_on:
      backend:
        condition: service_healthy

volumes:
  postgres_data:
```

## .env.example
```
# Database
DATABASE_URL=postgresql://user:password@postgres:5432/dbname
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=dbname

# App
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=change_me_in_production
JWT_REFRESH_SECRET=change_me_in_production

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_TURNSTILE_SITE_KEY=

# Dev tools
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin
```

## Health check endpoint (NestJS)
```typescript
// Add to AppController
@Get('health')
@ApiOperation({ summary: 'Health check' })
health() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

## Next.js standalone output (required for Docker)
```javascript
// apps/frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};
module.exports = nextConfig;
```

## Validation checklist
- [ ] Multi-stage builds used in both Dockerfiles (deps → builder → runner)
- [ ] `NEXT_PUBLIC_*` vars passed as build args
- [ ] `postgres_data` is a named volume (not bind mount)
- [ ] All services have `restart: unless-stopped`
- [ ] All services have health checks
- [ ] Backend waits for postgres health check before starting
- [ ] Frontend waits for backend health check before starting
- [ ] `.env` is in `.gitignore`, `.env.example` is committed
- [ ] pgadmin only in dev compose, not prod
