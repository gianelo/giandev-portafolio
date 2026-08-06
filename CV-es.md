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

Ingeniero Backend Senior con más de 10 años transformando problemas complejos de negocio en soluciones confiables listas para producción. Ex-CTO con experiencia hands-on en plataformas de pago (Stripe, PayPal, DLocal, Shift4, Payeezy), arquitectura distribuida y desarrollo asistido por IA. Lideré la migración de un monolito de un solo servidor a una plataforma distribuida con 99.9% de uptime, procesando $200K+ en transacciones mensuales.

## Experiencia

### Ingeniero Backend Senior — Hablax Inc.
*Nov 2023 — Actualidad · Remoto (100%)*

- Reduje la dependencia de la publicidad pagada haciendo que la adquisición orgánica escale sola: pipeline de 3 niveles (país → servicio → producto) que genera miles de landings con ChatGPT-4o y las regenera al crecer el catálogo. Hoy el orgánico convierte clientes nuevos a mejor ratio que el canal pagado.
- Llevé la respuesta ante fraude de semanas a horas con un motor de reglas sobre los patrones Factory y Single Responsibility: cada regla se autoregistra y recibe contexto normalizado, así los patrones nuevos se despliegan sin tocar el evaluador. Redujo notablemente la revisión manual.
- Cerré el vector de fraude de acceso (multicuentas, account-takeover) con una capa de device fingerprinting que marca sesiones sospechosas sin agregar fricción a los usuarios legítimos.
- Desbloqueé la modernización de un stack legacy que no podía actualizarse in-place, diseñando API gateways para integrar servicios nuevos sin reescribir.
- Abrí un nuevo corredor de pagos con una integración end-to-end de Shift4: 3DS, tokenización, reembolsos y voids.
- Reemplacé la mensajería ad-hoc a clientes por un orquestador de notificaciones multi-canal que enruta email y push por país, método de pago y producto.

### Ingeniero Full Stack · Freelance — Clientes Independientes
*Abr 2023 — Nov 2023 · Remoto*

- Llevé un negocio de productos digitales de cero a vender end-to-end —tienda, checkout y entrega automática— sobre Next.js, TypeScript, Clean Architecture, Vitest y CI/CD con GitHub Actions.
- Dejé cobros y entregas sin intervención humana: integración completa de Stripe y PayPal (autorización, reembolsos) conectada a la entrega automática.
- Le di autonomía operativa al cliente con un admin a medida para catálogo, órdenes y fulfillment.

### Desarrollador Full Stack → CTO — Hablax Inc.
*Dic 2017 — Abr 2023 · Remoto (100%)*

- Promovido de desarrollador a CTO, liderando 4 ingenieros en migraciones de infraestructura críticas y entrega de features.
- Terminé con caídas recurrentes de ~3 horas en las fechas más lucrativas del año (Día de las Madres, Año Nuevo): migré un monolito de un servidor a una arquitectura distribuida de 8 servidores en DigitalOcean —balanceo HAProxy, replicación MySQL master-slave, failover entre nodos, backups y planes de recovery automatizados—, ejecutado manualmente sobre Linux por restricciones del stack legacy. 99.9% de uptime desde entonces.
- Saqué el riesgo de depender de un solo gateway en una operación de pagos global: motor multi-proveedor con enrutamiento configurable por producto y failover automático entre PayPal, Payeezy y DLocal.
- Permití cambiar el proveedor de productos activo en vivo y sin downtime, con un motor de catálogo multi-proveedor con failover por prioridad.
- Amplié la conversión en el checkout con Apple Pay, Google Pay y tokenización de tarjetas in-house.
- Mantuve catálogo y precios exactos entre proveedores con sincronizaciones asíncronas diarias y cero downtime.
- Expandí las líneas de ingreso con reservas de viajes (hoteles, rentas de auto), envío de dinero y un sistema de referidos.

### Desarrollador de Software Java — Fermat.org
*Ene 2016 — Mar 2017 · Remoto (100%)*

- Eliminé los intermediarios en pagos de consumo, construyendo apps Android P2P sobre infraestructura de criptomonedas (taxi, e-commerce) donde los fondos se liquidaban de wallet a wallet.
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
