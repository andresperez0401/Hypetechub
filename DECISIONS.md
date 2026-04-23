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
  * _Desencadenante:_ Al intentar que un visitante guardara videos, no lográbamos mantener de forma sana y a largo plazo ese registro en la base de datos hacia al actor real que presionó el corazón.
  * _Solución:_ Se diseñaron credenciales herméticas ("Tokens" guardados en cookies encriptadas). Cuando el usuario realiza el login en Google de forma sana, el servidor sella un pase que el cliente entrega internamente siempre que da "favorito". Esto permitió al árbitro asegurar con fiabilidad el guardado individual de forma limpia.

* **Problema: La Inteligencia Artificial "alucinaba" e inventaba información tecnológica no presente en el inventario real.**
  * _Desencadenante:_ El robot interactivo conversacional solía generar recomendaciones alejadas de los videos verdaderos. 
  * _Solución:_ Le implementamos una arquitectura que le da lectura fugaz a nuestras tablas reales un cuarto de segundo antes de enviar propiamente la pregunta del visitante a DeepSeek. Eso le otorga límites inquebrantables, restringiéndose únicamente a la plataforma actual y devolviendo información extremadamente veraz de Hype Tech.

* **Problema: Sobrecarga visual al leer el "Hype".**
  * _Desencadenante:_ Originalmente, la página se proyectaba como un experimento visual que se enfocaba bruscamente en el esquema técnico o en explicar en pantalla gigante como operaba el algoritmo.
  * _Solución:_ Empujamos contundentemente directrices de Diseño Ubicuo y UI limpia a nivel general del proyecto. Desaparecimos ruido visual, se adaptaron textos más precisos enfocados en el valor (en español), una fuerte paleta luminosa y se insertó un logo identificativo dando finalmente un empaque premium a todas las vistas. 

---

## 6. Prompts más relevantes utilizados (Herramientas de IA)

Para ayudar a agilizar desarrollos críticos y validar partes del monolito usando automatizaciones a través de modelos inteligentes (como agente de desarrollo o Copilot), ordenamos fuertemente los "prompts" de la siguiente forma basándonos en enfoque a producto:

1. _"Actúa como el orquestador principal del proyecto y corrige la plataforma para que transcriba la arquitectura base y funcione verdaderamente como un producto serio alineándose universalmente a los requerimientos clave, la matemática estricta a favor del hype y las identidades universales."_
2. _"Aplica un rediseño que baje el ambiente visual a algo inmensamente más sofisticado pero sencillo, amigable, minimalista y menos técnico. Remueve íconos por todos lados. Mantén el branding central de la fuente de los textos estables y sin explicaciones innecesarias sobre nuestro negocio directo en componentes a la vista de público general."_
3. _"Haz mucho énfasis de que la fórmula Hexagonal que decanta dentro del core de nuestro código base tiene el peso primordial: Todo HypeScore multiplica sí o sí por formato tutorial, si posee 0 visitas equivaldrá irremediablemente en resultado vacío igual a cero y el formateo relacional lo hará nuestra lógica nativa. Nada interactúa sin test general."_
