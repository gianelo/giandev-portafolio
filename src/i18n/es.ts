export const es: Record<string, string> = {
  // ── Meta ─────────────────────────────────────────────────
  'meta.title': 'Gian Barboza – Ingeniero Backend Senior · Pagos & IA',
  'meta.description': 'Ingeniero Backend Senior con 10+ años construyendo infraestructura distribuida de pagos (Stripe, PayPal, DLocal, Shift4) y automatización con IA. Ex-CTO. Disponible para trabajo remoto.',
  'meta.h1.role': 'Ingeniero Backend Senior especializado en infraestructura de pagos y automatización con IA',

  // ── Nav ──────────────────────────────────────────────────
  'nav.impact': 'Impacto',
  'nav.timeline': 'Recorrido',
  'nav.stack': 'Stack',
  'nav.projects': 'Proyectos',
  'nav.contact': 'Contacto',
  'nav.toggle.dark': 'Cambiar a modo oscuro',
  'nav.toggle.light': 'Cambiar a modo claro',
  'nav.skip': 'Saltar al contenido principal',
  'nav.lang.switch': 'Cambiar idioma a Inglés',

  // ── Hero ─────────────────────────────────────────────────
  'hero.title': 'Gian Barboza',
  'hero.subtitle': 'Ingeniero Backend Senior',
  'hero.badge': 'Disponible para trabajo remoto',
  'hero.bio': 'Ingeniero Backend Senior con <strong>más de 10 años</strong> construyendo sistemas distribuidos, <strong>infraestructura de pagos</strong> (Stripe, PayPal, DLocal, Shift4) y <strong>automatización con IA</strong>. Ex-CTO con enfoque en soluciones production-first.',
  'hero.tagline': 'Más de 10 años construyendo sistemas de producción a escala',
  'hero.cta.projects': 'Ver Proyectos',
  'hero.cta.contact': 'Contactarme',
  'hero.cta.email': 'Contáctame',
  'cta.cv.download': 'Descargar CV',
  'cta.cv.url': '/gian-barboza-cv-es.pdf',

  // ── Impact ───────────────────────────────────────────────
  'impact.title': 'Impacto Clave',
  'impact.years.number': '10+',
  'impact.years.label': 'Años de Experiencia',
  'impact.uptime.number': '99.9%',
  'impact.uptime.label': 'Uptime en Infraestructura Crítica',
  'impact.volume.number': '$200K+',
  'impact.volume.label': 'Transacciones Procesadas / Mes',
  'impact.payments.number': '5+',
  'impact.payments.label': 'Procesadores de Pago Integrados',

  // ── Timeline ─────────────────────────────────────────────
  'timeline.title': 'Recorrido',
  'timeline.subtitle': 'De desarrollador junior a CTO y backend senior en plataformas de pagos',

  'timeline.now.period': 'Nov 2023 — Actualidad',
  'timeline.now.role': 'Senior Backend Engineer',
  'timeline.now.company': 'Hablax Inc. · 100% Remoto',
  'timeline.now.desc': 'Lidero iniciativas con IA sobre la plataforma de giftcards y recargas: SEO programático generado con IA, sistema de detección de fraude con reglas extensibles, gateways para modernizar servicios legacy y orquestador de notificaciones multi-canal.',

  'timeline.freelance.period': 'Abr 2023 — Nov 2023',
  'timeline.freelance.role': 'Full Stack Engineer · Freelance',
  'timeline.freelance.company': 'Clientes independientes · Remoto',
  'timeline.freelance.desc': 'Construí un e-commerce de productos digitales end-to-end con stack moderno: Next.js, TypeScript, Clean Architecture, Vitest y CI/CD con GitHub Actions. Integración completa de Stripe y PayPal, automatización de envíos y sistema administrativo propio.',

  'timeline.cto.period': 'Dic 2017 — Abr 2023',
  'timeline.cto.role': 'Full Stack Developer → CTO',
  'timeline.cto.company': 'Hablax Inc. · 100% Remoto',
  'timeline.cto.desc': 'Evolucioné de desarrollador a CTO liderando un equipo de 4 developers. Diseñé la migración del monolito a infraestructura distribuida de 8 servidores en DigitalOcean, integré los procesadores de pago core (PayPal, Payeezy, DLocal) y construí el motor multi-proveedor de productos con failover automático.',

  'timeline.fermat.period': 'Ene 2016 — Mar 2017',
  'timeline.fermat.role': 'Java Software Developer',
  'timeline.fermat.company': 'Fermat.org · 100% Remoto',
  'timeline.fermat.desc': 'Desarrollé apps Android P2P sobre criptomonedas (taxi, e-commerce) donde el pago iba directo a la wallet del proveedor sin intermediarios. Primera exposición a sistemas descentralizados y a un entorno 100% remoto.',

  // ── Tech Stack ───────────────────────────────────────────
  'stack.title': 'Expertise Técnico',
  'stack.backend.title': 'Backend & Arquitectura',
  'stack.infra.title': 'Infraestructura',
  'stack.payments.title': 'Pagos & Riesgo',
  'stack.ai.title': 'Automatización & IA',

  // ── Projects ─────────────────────────────────────────────
  'projects.title': 'Case Studies',
  'projects.subtitle': 'Problemas reales, decisiones técnicas y resultados medibles',
  'projects.label.context': 'Contexto',
  'projects.label.problem': 'Problema',
  'projects.label.decision': 'Decisión Técnica',

  'projects.infra.title': 'Migración de Monolito a Infraestructura Distribuida',
  'projects.infra.context': 'Plataforma de giftcards y recargas con ~1,000 transacciones diarias y entre $100K y $300K mensuales procesados, corriendo sobre un único servidor.',
  'projects.infra.problem': 'Caídas recurrentes de ~3 horas en picos de tráfico (Día de las Madres, Año Nuevo) por el sistema de llamadas consumiendo todos los recursos. Pérdida directa de revenue en los días más lucrativos del año.',
  'projects.infra.decision': 'Migración a DigitalOcean con 8 servidores separando capas (web, base de datos, dev). Balanceo HTTP con HAProxy, replicación MySQL master-slave para alta disponibilidad, failover entre nodos, backups y planes de recovery automatizados. Ejecutado manualmente sobre Linux por restricciones del stack legacy, liderando un equipo de 4 developers.',
  'projects.infra.outcome': '99.9% uptime sostenido desde 2019 · Cero caídas en fechas críticas durante los últimos ~5 años',

  'projects.seo.title': 'SEO Programático con IA a Escala',
  'projects.seo.context': 'Presupuesto de miles de dólares mensuales en publicidad pagada, catálogo de más de 1,600 productos por proveedor multiplicado por múltiples países y servicios.',
  'projects.seo.problem': 'Reducir la dependencia de paid ads sin sacrificar la adquisición de clientes. Generar contenido a escala humana para miles de combinaciones país/servicio/producto era inviable.',
  'projects.seo.decision': 'Pipeline de generación jerárquica en 3 niveles (país → país/servicio → país/servicio/producto) poblando miles de combinaciones vía ChatGPT-4o con prompts curados por vertical. Trigger automático: cuando entra un producto nuevo, se regeneran las landings de los niveles afectados sin intervención manual.',
  'projects.seo.outcome': 'Reemplazo significativo del presupuesto de ads con tráfico orgánico · Mejor ratio de clientes nuevos que el canal pagado · Escala mantenida de forma autónoma con el catálogo',

  'projects.fraud.title': 'Sistema de Detección de Fraude con Reglas Extensibles',
  'projects.fraud.context': 'Plataforma de pagos expuesta a dos vectores de fraude: transaccional (tarjetas robadas, patrones sospechosos) y de acceso (multicuentas, intentos de hackeo).',
  'projects.fraud.problem': 'Necesidad de agregar reglas nuevas frecuentemente sin tocar el pipeline central, y de detectar patrones de cuenta y dispositivo sospechosos sin degradar la experiencia de usuarios legítimos.',
  'projects.fraud.decision': 'Motor de reglas basado en Factory + Single Responsibility Principle: cada regla se autoregistra y recibe contexto normalizado, permitiendo extender sin modificar el evaluador. Capa separada para fraude de acceso con device fingerprinting. Se exploró evaluación contextual con LLMs vía n8n imitando decisiones de soporte; funcionó a baja escala pero se archivó por costos prohibitivos del modelo.',
  'projects.fraud.outcome': 'Reducción significativa de la carga de revisión manual · Base técnica para incorporar nuevas reglas en horas en lugar de semanas',

  'projects.payments.title': 'Integración Multi-Gateway de Pagos con Failover',
  'projects.payments.context': 'Operación global de giftcards y recargas donde un único gateway deja brechas geográficas, de conversión y de disponibilidad.',
  'projects.payments.problem': 'Los distintos gateways cubren distintos países y fees; cualquiera puede caerse o empezar a rechazar más transacciones. Se requería cobertura continua y flexibilidad comercial para optimizar por país y método.',
  'projects.payments.decision': 'Abstracción donde el admin configura gateway activo y prioridades por producto. Ante una falla o rechazo del proveedor activo, failover automático al siguiente en la cadena. 5 procesadores integrados (PayPal, Payeezy, DLocal, Stripe, Shift4) con features completos: 3DS, refunds, voids, Apple Pay, Google Pay y tokenización propia de tarjetas.',
  'projects.payments.outcome': 'Disponibilidad de cobro continua durante incidentes de proveedores · Routing optimizado por costo y conversión · 5 gateways en producción',

  // ── Contact ──────────────────────────────────────────────
  'contact.title': 'Trabajemos Juntos',
  'contact.subtitle': 'Disponible para oportunidades full-time remotas',
  'contact.cta': 'Ponte en Contacto',
  'contact.modal.title': 'Hablemos',
  'contact.modal.intro': 'Cuéntame sobre la oportunidad o el proyecto. Te respondo por email en menos de 24h.',
  'contact.modal.close': 'Cerrar',
  'contact.form.name': 'Nombre',
  'contact.form.name.placeholder': 'Tu nombre',
  'contact.form.email': 'Email',
  'contact.form.email.placeholder': 'tu@email.com',
  'contact.form.message': 'Mensaje',
  'contact.form.message.placeholder': 'Cuéntame en qué puedo ayudarte…',
  'contact.form.privacy': 'Tu email solo se usa para responderte. No se comparte ni se agrega a listas de marketing.',
  'contact.form.submit': 'Enviar mensaje',
  'contact.form.sending': 'Enviando…',
  'contact.form.success': '¡Mensaje enviado! Te respondo pronto.',
  'contact.form.error': 'Algo falló al enviar. Intenta de nuevo en un momento.',
  'contact.form.validation': 'Revisa los campos marcados.',
  'contact.email': 'gianelo1992@gmail.com',
  'contact.phone': '+57 304 358 1365',
  'contact.phone.url': 'https://wa.me/573043581365',
  'contact.linkedin.url': 'https://linkedin.com/in/gian-barboza',
  'contact.github.url': 'https://github.com/gianelo',

  // ── Terminal style (design-specific copy) ────────────────
  'term.nav.cta': 'Hablemos ↗',
  'term.hero.location': 'Rionegro, CO · GMT-5',
  'term.hero.years': '10+ años',
  'term.hero.available': 'Disponible',
  'term.hero.tagline.html': 'Ingeniero backend senior construyendo <strong>infraestructura de pagos distribuida</strong> y <strong>automatización con IA</strong>. Ex-CTO. Production-first.',

  'term.cta.resume': 'Descargar CV',
  'term.cta.contact': 'Hablemos',

  'term.section.01.label': '01 — Recorrido',
  'term.section.01.title': 'Desarrollador junior → CTO → backend senior en plataformas de pagos.',
  'term.section.01.sub': 'Una década de decisiones compuestas entre monolitos, sistemas distribuidos e IA.',

  'term.section.02.label': '02 — Impacto Clave',
  'term.section.02.title': 'Números que llegaron a producción.',
  'term.section.02.sub': 'Algunas métricas que resumen una década de decisiones.',

  'term.section.03.label': '03 — Case Studies',
  'term.section.03.title': 'Cuatro problemas, cuatro sistemas en producción.',
  'term.section.03.sub': 'Haz click en cualquier card para expandir contexto, problema, decisión y resultado.',

  'term.section.04.label': '04 — Stack',
  'term.section.04.title': 'Expertise técnico.',
  'term.section.04.sub': 'Herramientas y patrones a los que recurro, agrupados por dominio.',

  'term.journey.current': 'Actual',

  'term.case.label.context': 'Contexto',
  'term.case.label.problem': 'Problema',
  'term.case.label.decision': 'Decisión',
  'term.case.label.result': 'Resultado',

  'term.case.infra.metric': '99.9% uptime',
  'term.case.infra.result.num': '99.9%',
  'term.case.infra.result.text': 'uptime sostenido desde 2019. Cero caídas en fechas críticas durante los últimos 5 años.',

  'term.case.seo.metric': 'Tráfico orgánico ↑',
  'term.case.seo.result.num': '↓ ads',
  'term.case.seo.result.text': 'reemplazo significativo del presupuesto de ads con tráfico orgánico. Mejor ratio de clientes que el canal pagado.',

  'term.case.fraud.metric': 'Horas, no semanas',
  'term.case.fraud.result.num': 'Horas',
  'term.case.fraud.result.text': 'para lanzar reglas nuevas en lugar de semanas. Reducción significativa de la carga de revisión manual.',

  'term.case.payments.metric': '5 gateways',
  'term.case.payments.result.num': '5',
  'term.case.payments.result.text': 'gateways consolidados. Disponibilidad continua durante incidentes de proveedores. Routing optimizado por costo y conversión.',

  'term.cta.eyebrow': '— Trabajemos juntos',
  'term.cta.title.html': 'Disponible para roles senior backend<br/>en <span class="accent">pagos</span> e <span class="accent">IA</span>.',
  'term.cta.sub': 'Disponible para oportunidades full-time remotas. Respuesta más rápida por email o LinkedIn.',

  'term.footer.copy': '© {year} Gian Barboza · gianbarboza.com',
  'term.footer.deploy': 'Construido con dedicación · Astro · Vercel',
};
