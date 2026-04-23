# Decisiones y Proceso de Trabajo

Este documento explica de manera sencilla, clara y orientada al negocio cómo pensamos, organizamos y construimos la plataforma **Hype Tech Hub**. Evitamos la jerga técnica (lenguaje ubicuo) para enfocarnos en el valor del producto y facilitar el entendimiento a todas las personas del equipo.

---

## 1. Enfoque general de la solución

Nuestra meta central fue transformar una idea técnica en un producto real, atractivo y fácil de usar. Nos enfocamos en construir una plataforma de videos donde la popularidad (el "Hype") se calcule de forma precisa e incorruptible.

Para lograrlo, dividimos el sistema en dos grandes motores que trabajan en equipo:
* **La cara visual (El Frente):** Lo que vive e interactúa el usuario final. Un entorno diseñado para ser rápido, muy visual y cómodo tanto en computadoras como celulares.
* **El cerebro de datos (El Respaldo):** Un servidor seguro y oculto que actúa como árbitro central. Este servidor es el encargado de leer la lista de videos, hacer toda la matemática para calcular popularidad, validar si alguien inició sesión correctamente y comunicarse con nuestro sistema de Inteligencia Artificial de forma inteligente.

Ambos motores viven juntos y sincronizados en una misma gran carpeta maestra, lo que facilita enormemente el manejo del proyecto sin que los procesos lleguen a chocar.

---

## 2. Decisiones técnicas principales

* **Separación de responsabilidades de negocio:** Decidimos aplicar una regla estricta: las reglas que guían nuestro negocio (como la fórmula que dicta qué tan popular es un video o qué define a un tutorial) no deben mezclarse temporalmente con reglas gráficas. Si mañana toda nuestra página web cambia de diseño o estilo, las matemáticas y el negocio no se verán afectados.
* **Inicio de sesión sin fricción:** Sustituimos el tradicional proceso de crear "Usuario y Contraseña" por el inicio de sesión automático usando una cuenta de Google. Esto brinda muchísima seguridad externa y elimina obstáculos para que el usuario pueda empezar a registrar sus videos en favoritos rápidamente.
* **Inteligencia Artificial guiada ("Conciencia Actual"):** Incluimos un chatbot inteligente. Sin embargo, para evitar que el robot invente respuestas incorrectas sobre nuestro sistema, decidimos armar un túnel de información. Cada vez que hace una pregunta el usuario, el servidor le narra velozmente la lista actual completa de videos a la Inteligencia Artificial. Así, aseguramos que el robot recomiende exclusivamente lo que existe en nuestra plataforma y basándose en las cifras del popularidad del día de hoy.

---

## 3. Organización del proyecto

Organizamos nuestro espacio de trabajo unificado en carpetas claramente separadas por tareas:

* **Espacio Visual (`apps/web`):** Todas las pantallas, interfaz gráfica, botones, animaciones, colores e interacciones directas.
* **Espacio de Servidor (`apps/api`):** Toda la lógica invisible, conexión de bases de datos, inicio de autenticaciones seguras y cálculos lógicos sobre los videos.
* **Espacio Compartido (`packages`):** Pequeñas herramientas y moldes de trabajo que ambos espacios repiten (como reglas de escritura en el código), unificando el lenguaje global del personal del proyecto.

---

## 4. Supuestos o simplificaciones realizadas

* **Inventario Dinámico (Base de Datos Real):** Inicialmente trabajamos listando un archivo de texto base, pero escalamos la arquitectura conectando un adaptador directo hacia PostgreSQL mediante Prisma. Ahora, todos los videos consumidos por el negocio y la Inteligencia Artificial se consultan 100% interactuando contra una base de datos firme, la cual se nutre la primera vez mediante un script de `seed` idempotente de datos controlados. Desde ese momento, el backend consume los videos directamente desde la BD, asegurando persistencia real.
* **Curaduría fotográfica externa simplificada:** Vimos que gran mayoría de las imágenes representativas y de miniatura del inventario original no podían utilizarse o se encontraban caídas. Optamos por tomar el nombre textual de cada video y conectarnos a **Pexels** (un banco libre de fotos) para insertar de forma veloz miniaturas hermosas y afines en nuestro visual sin requerir almacenamiento complejo nuestro.
* **Cálculo de Tiempos Nativos:** Evitamos inyectarle software inmenso o pesado a nuestra plataforma solo para poner un texto que diga _"Hace 2 horas"_. Preferimos calcular todas las fechas basándonos 100% en las matemáticas directas del dispositivo central (tiempo y fecha restado por milisegundos). 

---

## 5. Problemas encontrados y cómo los resolviste

* **Problema: Descontrol de Identidad en los Favoritos**
  * _Desencadenante:_ Al intentar que un visitante guardara videos, no lográbamos mantener de forma sana y a largo plazo ese registro en la base de datos hacia al persona presionó el corazón.
  * _Solución:_ Se diseñaron credenciales herméticas ("Tokens" guardados en cookies encriptadas dentro de la bd). Cuando el usuario realiza el login en Google de forma sana, el usuario podrá guardar videos en favoritos, alojados dentro de la base d edatos para asegurar la persistencia de la misma.

* **Problema: La Inteligencia Artificial "alucinaba" e inventaba información tecnológica no presente en el inventario real.**
  * _Desencadenante:_ El robot interactivo conversacional solía generar recomendaciones alejadas de los videos verdaderos. 
  * _Solución:_ Le implementamos una arquitectura que le da lectura fugaz a nuestras tablas reales antes de enviar propiamente la pregunta del visitante a DeepSeek. Eso le otorga límites inquebrantables, restringiéndose únicamente a la plataforma actual y devolviendo información de hype tech.

---

## 6. Prompts más relevantes utilizados (Herramientas de IA)

Para ayudar a agilizar desarrollos y poder mantener una estructura clara y ordenada, seguimos un modelo para el diseño de la aplicación utilizando un agente de IA como orquestador a las acciones que debia realizar. Este orquestador era el agente encargado de consultar sus Skills, cada skill funciona como un subagente que trabajará segun el contexto que se le entregue. Permitiendo que no solo la herramienta de IA seleccionada, sea claude, codex, copilot. Tenga claros sus funciones y lo que debe hacer sin alamcenar un contexto en la nube, la skill le da las bases de como puede trabajar. Todo esto se puede ver reflejado en la carpeta /agents.

 Si la desglosamos un poco en su subcarpeta /registries, podemos ver que se encuentra el orquestador con otros roles de agentes que nos ayudaran a mantener la estructura y lo que se arme con las skills pueda tener un sentido de organización y lo mas importante que la solución estuviera alineada a los requerimientos clave. 

### Cómo funciona el sistema en la práctica

El sistema se divide en tres capas que trabajan juntas:

**1. El Orquestador (`agents/registry/orchestrator.md`)**
Es el punto de entrada de toda instrucción. Cuando llega una tarea, el orquestador la interpreta, decide qué agente debe ejecutarla y en qué orden. No construye nada por sí mismo — coordina. Si la tarea es compleja y tiene múltiples pasos (como construir el MVP completo), activa un **Playbook**. Si es una tarea puntual (como revisar un módulo), activa directamente el agente especializado.

**2. Los Agentes (`agents/registry/`)**
Cada archivo en esta carpeta representa un rol especializado: `backend-architect`, `frontend-architect`, `auth-engineer`, `devops-engineer`, `qa-reviewer`, `docs-writer`. Cuando el orquestador activa uno, ese agente sabe exactamente qué le corresponde hacer, qué herramientas usar (Skills) y qué no le corresponde tocar. Esto evita que la IA mezcle responsabilidades o tome decisiones fuera de su dominio.

**3. Las Skills (`agents/skills/`)**
Son el conocimiento ejecutable. Cada skill es una guía detallada de "cómo hacer X correctamente en este proyecto": cómo estructurar un módulo hexagonal, cómo montar auth con JWT y Google OAuth, cómo dockerizar el monorepo, etc. El agente activado consulta la skill correspondiente antes de escribir código, garantizando que la implementación siga los patrones del proyecto y no los patrones genéricos del modelo de lenguaje.

**Playbooks y Contratos**
Los **Playbooks** (`agents/playbooks/`) definen secuencias de trabajo completas por fases — por ejemplo, el playbook del MVP divide el desarrollo en: scaffold del monorepo → backend hexagonal → frontend → auth → Docker/deploy. Cada fase tiene un agente responsable y una skill asociada.

Los **Contratos** (`agents/contracts/`) son las condiciones de salida: qué significa que algo está "terminado" (`done-definition.md`), cómo se escribe código (`code-standards.md`), cuándo se necesita test (`testing-policy.md`). Ninguna fase se cierra si no cumple su contrato.

**El resultado**: sin importar qué herramienta de IA se use (Claude, Copilot, Codex), el sistema garantiza que opere con el mismo modelo mental del proyecto, aplicando los mismos estándares y tomando decisiones alineadas al producto — no a sus tendencias generales de entrenamiento.

### Ejemplos de prompts utilizados

La forma de comunicarse con el sistema sigue un patrón claro: primero se da contexto de intención, luego se especifica el alcance. El agente consulta su registry y skill correspondiente antes de actuar.

**Arrancar una fase del MVP:**
> _"Estamos en la Fase 2 del playbook `build-mvp-videos-challenge`. Necesito que el backend-architect implemente el módulo de videos siguiendo arquitectura hexagonal. Consulta la skill `hexagonal-backend` y respeta los contratos de código."_

El orquestador identifica el playbook activo, activa `backend-architect`, y ese agente ejecuta siguiendo `hexagonal-backend/SKILL.md` — no inventa estructura.

---

**Agregar una feature puntual:**
> _"Agrega el endpoint `GET /favorites` para el usuario autenticado. Solo backend. No toques el frontend."_

El orquestador activa `backend-architect` (no `frontend-architect`), aplica los contratos de testing y Swagger, y cierra solo cuando `done-definition.md` está satisfecho.

---

**Validar antes de hacer commit:**
> _"Revisa que el módulo de auth cumpla con los contratos del proyecto antes de declararlo terminado."_

El orquestador activa `qa-reviewer`, que cruza el código contra `testing-policy.md`, `code-standards.md` y `done-definition.md`. Si algo no cumple, reporta exactamente qué falta — no aprueba por omisión.

---

**Corregir arquitectura sin perder contexto:**
> _"El servicio de videos está mezclando lógica de negocio en el controlador. Corrígelo sin romper la interfaz HTTP existente."_

`backend-architect` sabe, por su definición en registry, que los controladores solo deben delegar a casos de uso. Reorganiza la capa de aplicación sin que sea necesario explicarle la arquitectura desde cero.


