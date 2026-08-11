---
stylesheet: cv.css
pdf_options:
  format: A4
  printBackground: true
---

<div class="cv-header">
  <div class="cv-header-text">
    <h1>Gian Barboza</h1>
    <p class="role">Ingeniero Backend Senior | Arquitecto de Software</p>
    <p class="contact">Rionegro, Antioquia, Colombia · Trabajo remoto · Disponible con dos semanas de aviso</p>
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

Ingeniero Backend Senior y Arquitecto de Software con más de 10 años de experiencia hands-on diseñando, construyendo y evolucionando sistemas en producción — arquitecturas distribuidas, plataformas de pago multi-proveedor, detección de fraude, integración de APIs e infraestructura de producción. Diseñé y lideré la migración de un monolito de un servidor a una plataforma distribuida de 8 servidores, sosteniendo 99.9% de uptime y procesando $200K+ mensuales en transacciones.

## Experiencia

### Ingeniero Backend Senior — Hablax Inc.
*Nov 2023 — Actualidad · Remoto (100%)*

- Llevé la respuesta ante fraude de semanas a horas con un motor de reglas extensible, y cerré el vector de acceso (multicuentas, account takeover) con una capa separada de device fingerprinting. Redujo notablemente la revisión manual, sin fricción para usuarios legítimos.
- Desbloqueé la modernización de un stack legacy que no podía actualizarse in-place, diseñando API gateways para integrar servicios nuevos sin reescribir.
- Abrí un nuevo corredor de pagos con una integración end-to-end de Shift4: 3DS, tokenización, reembolsos y voids.
- Reduje la dependencia de la publicidad pagada con un pipeline de SEO programático que escala solo con el catálogo. Hoy el orgánico convierte clientes nuevos a mejor ratio que el canal pagado.
- Reemplacé la mensajería ad-hoc por un orquestador de notificaciones multi-canal que enruta email y push por país, método de pago y producto.

### Desarrollador Full Stack → CTO — Hablax Inc.
*Dic 2017 — Abr 2023 · Remoto (100%)*

- Terminé con caídas recurrentes de ~3 horas en las fechas más lucrativas del año (Día de las Madres, Año Nuevo): diseñé y lideré la migración de un monolito de un servidor a una arquitectura distribuida de 8 servidores en DigitalOcean, ejecutada manualmente sobre Linux por restricciones del stack legacy. 99.9% de uptime desde entonces.
- Saqué el riesgo de depender de un solo gateway en una operación de pagos global con una arquitectura multi-proveedor: enrutamiento configurable por producto, failover automático entre PayPal, Payeezy y DLocal, y checkout ampliado con Apple Pay, Google Pay y tokenización propia.
- Promovido de desarrollador a CTO, liderando 4 ingenieros en migraciones de infraestructura críticas y entrega de features.
- Mantuve un catálogo multi-proveedor exacto e intercambiable en vivo: failover por prioridad y sincronizaciones asíncronas diarias, con cero downtime.
- Expandí las líneas de ingreso con reservas de viajes (hoteles, rentas de auto), envío de dinero y un sistema de referidos.

### Ingeniero Full Stack · Freelance — Clientes Independientes
*Abr 2023 — Nov 2023 · Remoto*

- Llevé un negocio de productos digitales de cero a vender end-to-end —tienda, checkout y entrega automática— sobre Next.js, TypeScript, Clean Architecture y Vitest.
- Dejé cobros y entregas sin intervención humana: integración completa de Stripe y PayPal (autorización, reembolsos) conectada a la entrega automática.
- Le di autonomía operativa al cliente con un admin a medida para catálogo, órdenes y fulfillment.

### Desarrollador de Software Java — Fermat.org
*Ene 2016 — Mar 2017 · Remoto (100%)*

- Eliminé los intermediarios en pagos de consumo, construyendo apps Android P2P sobre infraestructura de criptomonedas (taxi, e-commerce) donde los fondos se liquidaban de wallet a wallet. Primera exposición a sistemas descentralizados y trabajo totalmente remoto.

## Arquitectura y Sistemas Destacados

- **Arquitectura de Pagos Multi-Gateway** — 5 proveedores (Stripe, PayPal, DLocal, Shift4, Payeezy) detrás de un contrato de pago único. Los Adapters normalizan cada API a objetos de request/response compartidos; Factory y Strategy desacoplan la selección del proveedor de su comportamiento; Builder arma los requests complejos y Repository aísla la persistencia. Enrutamiento y prioridad configurables por producto con failover automático, 3DS, reembolsos, voids, Apple Pay, Google Pay y tokenización propia.
- **Migración a Infraestructura Distribuida** — Arquitectura de 8 servidores en DigitalOcean separando capas web, base de datos y dev. Balanceo HAProxy, replicación MySQL master-slave, failover entre nodos, backups automatizados y runbooks de recovery. 99.9% de uptime sostenido desde 2019.
- **Motor Extensible de Detección de Fraude** — Arquitectura de reglas sobre Factory y Single Responsibility: las reglas se autoregistran contra un contexto normalizado, así los patrones nuevos se enchufan sin tocar el evaluador. Capa separada de device fingerprinting para fraude de acceso. Evaluación contextual con LLM prototipada vía n8n, archivada por costo a escala.
- **Pipeline de SEO Programático** — Pipeline de generación de 3 niveles (país → servicio → producto) con ChatGPT-4o, que regenera las landings afectadas al crecer el catálogo. Reemplazó una porción significativa del gasto en ads con tráfico orgánico.

## Habilidades Técnicas

- **Backend & Arquitectura** — Node.js · TypeScript · Next.js · PHP · Java · REST APIs · Arquitectura de APIs · Sistemas Distribuidos · Clean Architecture · Gateway Pattern · Patrones de Diseño (Factory, Strategy, Adapter, Repository, Builder, SRP)
- **Infraestructura** — Linux · HAProxy · Nginx · Replicación MySQL · DigitalOcean · Cronjobs
- **Pagos & Riesgo** — Stripe · PayPal · DLocal · Shift4 · Payeezy · 3DS · Apple Pay · Google Pay · Tokenización Propia · Payment Routing · Motores de Reglas Antifraude · Device Fingerprinting · PCI Compliance
- **Automatización & IA** — n8n · Integración con LLMs · Antifraude Asistido por IA · SEO Programático · Automatización de Contenido · Web Scraping

## Idiomas

- **Español** — Nativo
- **Inglés** — Intermedio-avanzado (B2)

## Educación

**Universidad Dr. Rafael Belloso Chacín (URBE)** — Maracaibo, Venezuela · 2011 – 2015
*Ingeniero en Informática*
