# Decisions y Arquitectura

Este documento expone las justificaciones, enfoques y resoluciones adoptadas durante la productización del proyecto **Hype Tech Hub**. 

---

## 1. Enfoque General de la Solución
**Monorepo y Arquitectura Hexagonal:** 
La solución se configuró sobre Turborepo separando el backend (NestJS) y frontend (Next.js). Para el backend y el cumplimiento de las lógicas puras se adoptó fuertemente **Arquitectura Hexagonal**. Todo desarrollo de reglas de negocio relativas al "Hype", extracción de tiempos relativos de validación, entre otros, viven en las capas _Core (Domain/Application)_ de cada módulo, siendo completamente agnósticas de la persistencia HTTP o NestJS. La exposición de IA y Auth dependen de `Ports` y se conectan a `Adapters` concretos.

## 2. Autenticación y Autorización
Hemos establecido `JWT` estándar manejado por `passport-jwt` en backend y almacenado puramente mediante Context UI en frontend para la fase actual. El guard `JwtAuthGuard` previene peticiones no autorizadas de mutaciones como guardar en **Favoritos**.

## 3. Resolución de Diseño y Reglas de Negocio Centrales

### ¿Cómo se calcula y determina el Hype?
La lógica oficial se concentró en el `HypeCalculatorService` cumpliendo a cabalidad las reglas presentadas:
1. **Fórmula Base:** `Engagement (Likes + Comments) ÷ Vistas`.
2. **Flag "Tutorial":** Chequeo agnóstico de mayúsculas a través de una expresión regular `(/tutorial/i)`. Si un título macha con esta validación, independientemente del resto, el Hype se multiplica estáticamente `x2`.
3. **Casos Excepcionales:**
   - Si no existen métricas de comentarios en el objeto JSON (`commentCount` indefinido o -1), se activa flag `commentsDisabled: true` y automáticamente asigna un **HypeScore de 0**.
   - Idénticamente si las vistas (`viewCount`) originarias son `0` asume divisiones críticas devolviendo **0**.
4. **Tiempo Relativo Creado Nativamente:** Creado puro en JS plano en `RelativeTimeService`, inyectándolo al dominio como _"Hace X horas / Hace X días"_ sin contaminar el build con `date-fns` o `moment`.

### Data Originaria y Tratamiento Visual
1. **El Origen Base (La Verdad):** Todos los textos, ids, vistas y descripciones provienen exclusivamente de leer y parsear sintácticamente `mock-youtube-api.json`.
2. **Extorno de Imágenes con PEXELS:** Se encontraron alguna falencias con los links del thumbnail dentro del JSON mock originario, el Adapter sobreescribe de manera decorativa `thumbnailUrl` invocando al `PexelsService`. Se utiliza el `title` puro del video para obtener en vivo una imagen desde catálogo de pexels, permitiendo que visualmente "Hype Tech Hub" pueda visualizar imagenes relacionadas

### ChatBot de IA (DeepSeek)
Se decidió hacer un chatbot para consultar directamente dudas relacionadas con algunos de los videos del hype. Se utilizó la API de DeepSeek para generar respuestas basadas en el contexto de los videos.
