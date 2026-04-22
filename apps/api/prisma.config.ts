import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Keep generate usable in CI where DATABASE_URL can be absent.
    url: process.env.DATABASE_URL ?? '',
  },
});
