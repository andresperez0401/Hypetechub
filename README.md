# Despliegue

Como parte de mejorar la experiencia de uso de la app, se desplegó con una url publica para que se pueda acceder a probarla:

https://www.hypetechub.online/

api: https://api.hypetechub.online/api


# Hype Tech Hub

Plataforma integral construida diseñada para rankear, explorar y chatear con IA sobre un catálogo de contenido y tutoriales calificando el nivel de HYPE. También se puede iniciar sesión con Google para guardar videos en favoritos.

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

   **Importante**
   - La clave de Pexels se obtiene entrando a su página web y solicitando la api key. Se utilizó esta herramienta ya que las url de la fuente de datos no estaban cargando adecuadamente.

   - La clave de Deepseek Api key, importante teneral para que pueda funcionar el Hype AI. Un agente de IA que permite generar respuestas basadas en el contexto de los videos.

   - Database URL, de igual forma colocarlo ya sea una bd local o remota para poder ejecutar las migraciones con Prisma. En este caso se utilizó Neon, como bd para el proyecto.

   **En `apps/web/.env.local`:**
   ```env
   # Conexión al Backend
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   

3. **Generar Cliente, Ejecutar Migraciones y Cargar Videos (Base de Datos):**
   Antes de correr la aplicación, levanta el esquema y carga el catálogo inicial de videos en la base de datos:
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma migrate dev --name init
   npm run prisma:seed
   cd ../..
   ```
   El seed es **idempotente**: si ya existen los videos en la BD, los omite sin duplicar. Puedes correrlo cuantas veces quieras sin riesgo.

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

---

## 🚂 Deploy en Railway

### Arquitectura de despliegue
Este monorepo es de tipo **shared** (node_modules y `packages/` compartidos). Railway debe usar la **raíz del repo** como source para ambos servicios, y se le indica el Dockerfile de cada servicio mediante la variable `RAILWAY_DOCKERFILE_PATH`.

```
Railway Project
├── Service: api   → raíz repo + RAILWAY_DOCKERFILE_PATH=apps/api/Dockerfile
└── Service: web   → raíz repo + RAILWAY_DOCKERFILE_PATH=apps/web/Dockerfile
```

---

### Prerrequisitos
- Base de datos PostgreSQL ya desplegada (Neon, Railway DB, etc.)
- URL de la DB disponible (`DATABASE_URL`)
- Google OAuth app configurada
- Cloudflare Turnstile configurado

---

### 1. Crear servicio `api` en Railway

1. En Railway → New Project → Deploy from GitHub Repo → selecciona este repositorio
2. Railway crea un servicio por defecto. Renómbralo `api`
3. En **Settings → Build**:
   - **Root Directory**: dejar en blanco (usa la raíz del repo)
   - **Builder**: Dockerfile
   - **Dockerfile Path**: `apps/api/Dockerfile`
   > Alternativa: en **Variables** del servicio añadir `RAILWAY_DOCKERFILE_PATH=apps/api/Dockerfile`
4. En **Variables** del servicio `api`, añadir:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
FRONTEND_URL=https://<web-service>.up.railway.app
JWT_SECRET=<string-aleatoria-larga>
JWT_REFRESH_SECRET=<string-aleatoria-diferente>
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
GOOGLE_CLIENT_ID=<tu-client-id>
GOOGLE_CLIENT_SECRET=<tu-client-secret>
GOOGLE_CALLBACK_URL=https://<api-service>.up.railway.app/api/auth/google/callback
TURNSTILE_SECRET_KEY=<tu-secret-key>
DEEPSEEK_API_KEY=<tu-api-key>
PEXELS_API_KEY=<tu-api-key>
DEFAULT_VIDEO_PLACEHOLDER_URL=https://placehold.co/600x400?text=Hype+Tech+Hub
```

5. Deploy. El contenedor ejecuta `prisma migrate deploy` automáticamente antes de iniciar.
6. Railway asigna una URL pública. Cópiala — la necesitas para el servicio `web`.

---

### 2. Crear servicio `web` en Railway

1. En el mismo proyecto → New Service → GitHub Repo (mismo repo)
2. Renómbralo `web`
3. En **Settings → Build**:
   - **Root Directory**: dejar en blanco
   - **Builder**: Dockerfile
   - **Dockerfile Path**: `apps/web/Dockerfile`
   > Alternativa: `RAILWAY_DOCKERFILE_PATH=apps/web/Dockerfile` en Variables
4. En **Variables** del servicio `web`:

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://<api-service>.up.railway.app/api
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<tu-site-key>
NEXT_PUBLIC_APP_NAME=Hype Tech Hub
```

   > Las variables `NEXT_PUBLIC_*` deben estar presentes **en tiempo de build** (Docker ARGs).
   > Para esto, en Railway Build Variables (no solo Runtime Variables) añade también:
   > `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

5. Deploy.

---

### 3. Conectar frontend con backend

El frontend conecta al backend via `NEXT_PUBLIC_API_URL`. Esta variable se inyecta en build time como Docker ARG. Railway la pasa automáticamente si está definida como Build Variable.

Si cambias la URL del API service después del deploy:
1. Actualizar `NEXT_PUBLIC_API_URL` en las Build Variables del servicio `web`
2. Re-deploy el servicio `web` (re-build completo, no restart)

---

### 4. Actualizar Google OAuth tras el deploy

En Google Console → OAuth → Authorized redirect URIs, añadir:
```
https://<api-service>.up.railway.app/api/auth/google/callback
```

Y en Authorized JavaScript Origins:
```
https://<web-service>.up.railway.app
```

---

### 5. Validar el deploy

```bash
# API health check
curl https://<api-service>.up.railway.app/api/health
# Esperado: { "status": "ok", "timestamp": "..." }

# Swagger
# https://<api-service>.up.railway.app/api/docs

# Videos endpoint
curl https://<api-service>.up.railway.app/api/videos

# Frontend
# https://<web-service>.up.railway.app
```

---

### Variables template rápido

**Servicio `api`** → ver `apps/api/.env.example`
**Servicio `web`** → ver `apps/web/.env.example`

---

## 🏢 Estructura de Proyecto (Monorepo)
* `apps/web`: Frontend Next.js / Tailwind CSS / React. Consume la API. 
* `apps/api`: Backend NestJS Hexagonal en TypeScript estricto. (Rutas `/api/*`)
* `packages/*`: (Opcional) Configuraciones compartidas como TypeScript rules, ESLint, UI library interna, etc.
