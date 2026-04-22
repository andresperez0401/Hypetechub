FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY packages/shared-types/package.json ./packages/shared-types/package.json
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
RUN npm run build -w @apps/web

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
# Next.js standalone in monorepo: server.js lives at apps/web/server.js inside standalone/
COPY --from=builder /app/apps/web/.next/standalone ./
# Static assets must be at apps/web/.next/static relative to runner root
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
# Public assets must be at apps/web/public relative to runner root
COPY --from=builder /app/apps/web/public ./apps/web/public
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000 || exit 1
WORKDIR /app/apps/web
CMD ["node", "server.js"]
