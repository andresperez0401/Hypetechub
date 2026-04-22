# Hype Tech Hub

Plataforma integral construida diseñada para rankear, explorar y chatear con IA sobre un catálogo de contenido y tutoriales de desarrollo de software. Este repositorio contiene el Frontend y Backend productizado como un Monorepo manejado por Turborepo.

> Este proyecto fue desarrollado basándose en requerimientos técnicos orientados a medir el "Hype" (engagement en proporción a las vistas) integrando IA y un stack full modern tech en TypeScript.

## Requisitos previos
- **Node.js** v20+
- **NPM** v10+

## 🚀 Cómo ejecutar el proyecto localmente

1. **Instalar dependencias globales del monorepo:**
   ```bash
   npm install
   ```

2. **Configurar Variables de Entorno:**
   Debes establecer los archivos `.env` respectivos para Web y API basándote en los templates existentes o usando las claves entregadas.

   **En `apps/api/.env`:**
   ```env
   # Entorno y Puerto
   NODE_ENV=development
   PORT=3001
   
   # Base de Datos (Prisma)
   DATABASE_URL="file:./dev.db" # O postgresql://usuario:password@localhost:5432/db_name si usas PostgreSQL
   
   # Autenticación y Seguridad (JWT)
   JWT_SECRET=super_secret_jwt_key # Cambiar por una cadena segura
   
   # Autenticación con Google Cloud (OAuth)
   GOOGLE_CLIENT_ID=tu_google_client_id_aqui
   GOOGLE_CLIENT_SECRET=tu_google_client_secret_aqui
   GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
   FRONTEND_URL=http://localhost:3000
   
   # Inteligencia Artificial (DeepSeek)
   DEEPSEEK_API_KEY=tu-clave-deepseek-aqui
   
   # Catálogo de Imágenes (Pexels)
   PEXELS_API_KEY=tu-clave-pexels-aqui
   DEFAULT_VIDEO_PLACEHOLDER_URL=https://placehold.co/600x400?text=Hype+Tech+Hub
   ```

   **En `apps/web/.env.local`:**
   ```env
   # Conexión al Backend
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   

3. **Generar Cliente y Ejecutar Migraciones (Base de Datos):**
   Antes de correr la aplicación, asegúrate de levantar tu esquema en Prisma. Navega al contexto de la API y ejecuta:
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma migrate dev --name init
   cd ../..
   ```

4. **Ejecutar el proyecto completo (Front y Back simultáneamente):**
   ```bash
   npm run dev
   ```
   * Turborepo levantará:
     * Frontend (Next.js) en: [http://localhost:3000](http://localhost:3000)
     * Backend (NestJS) en: [http://localhost:3001/api](http://localhost:3001/api)
     * Swagger UI de Backend: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

## 🐳 Ejecución con Docker (Producción Completa)

El proyecto está completamente **dockerizado**. Puedes levantar toda la orquestación (Frontend + Backend) utilizando los `Dockerfiles.

Para levantarlo, solo debes tener encendido tu motor y ejecutar:

```bash
docker-compose up --build -d
```
Docker leerá silenciosamente `apps/api/.env` para levantar el backend e inyectará los atributos a `apps/web/.env.local` configurándolo para Vercel standalone output routing.

## 🏢 Estructura de Proyecto (Monorepo)
* `apps/web`: Frontend Next.js / Tailwind CSS / React. Consume la API. 
* `apps/api`: Backend NestJS Hexagonal en TypeScript estricto. (Rutas `/api/*`)
* `packages/*`: (Opcional) Configuraciones compartidas como TypeScript rules, ESLint, UI library interna, etc.
