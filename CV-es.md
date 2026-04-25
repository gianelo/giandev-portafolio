---
stylesheet: cv.css
pdf_options:
  format: A4
  printBackground: true
---

<div class="cv-header">
  <div class="cv-header-text">
    <h1>Gian Barboza</h1>
    <p class="role">Ingeniero Backend Senior</p>
    <p class="contact">Rionegro, Antioquia, Colombia · Trabajo remoto</p>
    <p class="contact">
      <a href="mailto:gianelo1992@gmail.com">gianelo1992@gmail.com</a> ·
      <a href="https://wa.me/573043581365">+57 304 358 1365</a> ·
      <a href="https://linkedin.com/in/gian-barboza">LinkedIn</a> ·
      <a href="https://github.com/gianelo">GitHub</a> ·
      <a href="https://gianbarboza.com">gianbarboza.com</a>
    </p>
  </div>
  <img src="src/assets/profile.jpg" class="cv-photo" alt="Gian Barboza" />
</div>

## Resumen

Ingeniero Backend Senior con más de 10 años construyendo sistemas de producción a escala. Ex-CTO con experiencia hands-on en sistemas distribuidos, infraestructura de pagos (Stripe, PayPal, DLocal, Shift4, Payeezy) y automatización con IA. Lideré la migración de un monolito de un solo servidor a una plataforma distribuida con 99.9% de uptime, procesando $200K+ en transacciones mensuales.

## Experiencia

### Ingeniero Backend Senior — Hablax Inc.
*Nov 2023 — Actualidad · Remoto (100%)*

- Lideré iniciativas de SEO programático con IA mediante un pipeline jerárquico (país → servicio → producto), poblando miles de landings con ChatGPT-4o y prompts curados por vertical; reemplacé una porción significativa del gasto en ads pagados con tráfico orgánico, con mejor ratio de conversión a clientes nuevos.
- Diseñé e implementé un motor de detección de fraude usando los patrones Factory y Single Responsibility, permitiendo que reglas nuevas se autoregistren en el evaluador y se desplieguen en horas en lugar de semanas.
- Construí una capa de device fingerprinting para detectar fraude de acceso (multi-cuenta, intentos de account-takeover).
- Diseñé API gateways para desacoplar herramientas modernas de un stack legacy que no podía actualizarse in-place.
- Integré Shift4 end-to-end, incluyendo 3DS, tokenización, reembolsos y voids.
- Construí un orquestador de notificaciones multi-canal que enruta emails y push por país, método de pago y producto.

### Ingeniero Full Stack · Freelance — Clientes Independientes
*Abr 2023 — Nov 2023 · Remoto*

- Construí una plataforma de e-commerce de productos digitales end-to-end con Next.js, TypeScript, Clean Architecture, Vitest y CI/CD con GitHub Actions.
- Integré Stripe y PayPal end-to-end, incluyendo autorización, reembolsos y entrega automatizada de productos digitales.
- Diseñé un sistema administrativo a medida para catálogo, órdenes y automatización de fulfillment.

### Desarrollador Full Stack → CTO — Hablax Inc.
*Dic 2017 — Abr 2023 · Remoto (100%)*

- Promovido de desarrollador a CTO. Lideré un equipo de 4 ingenieros en migraciones de infraestructura críticas y desarrollo de features.
- Migré de un monolito de un solo servidor a una arquitectura distribuida de 8 servidores en DigitalOcean: balanceo HTTP con HAProxy, replicación MySQL master-slave para alta disponibilidad, failover entre nodos, backups automáticos y planes de recovery. Ejecutado manualmente sobre Linux por restricciones del stack legacy.
- Eliminé caídas recurrentes de ~3 horas en fechas pico (Día de las Madres, Año Nuevo) que generaban pérdida directa de revenue; sostuve 99.9% de uptime desde entonces.
- Arquitecté un motor de pagos multi-proveedor con enrutamiento configurable por producto y failover automático entre PayPal, Payeezy y DLocal.
- Construí un motor multi-proveedor de catálogo con failover por prioridad, permitiendo a operadores cambiar el proveedor activo en vivo sin downtime.
- Implementé Apple Pay, Google Pay y tokenización de tarjetas in-house.
- Automaticé actualizaciones asíncronas de catálogo y precios entre proveedores; sincronizaciones diarias con cero downtime.
- Entregué el módulo de reservas de viajes (hoteles y rentas de auto), integración de envío de dinero y un sistema de referidos.

### Desarrollador de Software Java — Fermat.org
*Ene 2016 — Mar 2017 · Remoto (100%)*

- Construí apps Android P2P sobre infraestructura de criptomonedas (taxi, e-commerce) donde los pagos se liquidaban directamente entre wallets sin intermediarios.
- Primera exposición a sistemas descentralizados y trabajo 100% remoto.

## Proyectos Destacados

- **Migración de monolito a infraestructura distribuida de 8 servidores** — Lideré la migración con cero downtime usando HAProxy, replicación MySQL y recovery automatizado; 99.9% de uptime sostenido desde 2019.
- **SEO programático con IA a escala** — Pipeline de generación de 3 niveles (país → servicio → producto) con ChatGPT-4o; regenera landings automáticamente a medida que crece el catálogo. Reemplazó una porción significativa del gasto en ads con tráfico orgánico.
- **Detección de fraude con motor de reglas extensible** — Patrones Factory y SRP para que nuevas reglas se enchufen sin tocar el evaluador. Capa separada de device fingerprinting para fraude de acceso. Exploré evaluación contextual con LLMs vía n8n; archivado por costo del modelo a escala.
- **Pagos multi-gateway con failover** — 5 procesadores integrados (Stripe, PayPal, DLocal, Shift4, Payeezy) con enrutamiento configurable y failover automático ante incidentes de proveedor. Set completo: 3DS, reembolsos, voids, Apple Pay, Google Pay y tokenización propia.

## Habilidades Técnicas

- **Backend & Arquitectura** — Node.js · TypeScript · Next.js · PHP · Java · REST APIs · Gateway Pattern · Patrones de Diseño (Factory, Strategy, SRP) · Clean Architecture
- **Infraestructura** — Linux · HAProxy · Nginx · Replicación MySQL · DigitalOcean · Cronjobs · CI/CD (GitHub Actions)
- **Pagos & Riesgo** — Stripe · PayPal · DLocal · Shift4 · Payeezy · 3DS · Apple Pay · Google Pay · Tokenización Propia · Payment Routing · Motores de Reglas Antifraude · Device Fingerprinting · PCI Compliance
- **Automatización & IA** — n8n · Integración con LLMs · Antifraude Asistido por IA · SEO Programático · Automatización de Contenido · Web Scraping

## Idiomas

- **Español** — Nativo
- **Inglés** — Intermedio-avanzado (B2)

## Educación

**Universidad Dr. Rafael Belloso Chacín (URBE)** — Maracaibo, Venezuela · 2011 – 2015
*Ingeniero en Informática*

## Disponibilidad

Dos semanas de aviso.
