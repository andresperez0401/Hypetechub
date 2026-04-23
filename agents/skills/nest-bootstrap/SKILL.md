# Skill: NestJS Bootstrap

## Purpose
Set up a production-ready NestJS application from scratch inside the monorepo. Covers project init, global config, Prisma integration, validation pipes, Swagger, and CORS.

## When to apply
- Initializing the backend for the first time
- Auditing an existing setup against these standards

## Step-by-step

### 1. Project creation
```bash
# Inside monorepo root
nest new apps/backend --skip-git --package-manager npm
```

### 2. Required dependencies
```bash
npm install @nestjs/config @nestjs/swagger @prisma/client class-validator class-transformer cookie-parser helmet
npm install -D prisma @types/cookie-parser
```

### 3. main.ts baseline
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.use(cookieParser());

  // CORS — restrict in production
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
```

### 4. Config module setup
```typescript
// app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // feature modules...
  ],
})
export class AppModule {}
```

### 5. Prisma setup
```bash
npx prisma init --datasource-provider postgresql
```

```typescript
// src/infrastructure/database/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

### 6. Required env vars
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Validation checklist
- [ ] `ValidationPipe` with `whitelist: true` applied globally
- [ ] `helmet()` applied
- [ ] CORS restricted to `FRONTEND_URL` env var
- [ ] Swagger accessible at `/api/docs` in dev
- [ ] Prisma service connects on module init
- [ ] `.env.example` updated with new vars
