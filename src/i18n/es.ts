export const es: Record<string, string> = {
  // ── Meta ─────────────────────────────────────────────────
  // Un solo posicionamiento en todos lados: "Ingeniero Backend Senior y Arquitecto
  // de Software". "Ingeniero Backend Senior" va primero porque es el término que
  // buscan los recruiters; "Arquitecto" es lo que los case studies deben demostrar.
  'meta.title': 'Gian Barboza | Ingeniero Backend Senior y Arquitecto de Software',
  'meta.description': 'Ingeniero Backend Senior y Arquitecto de Software con más de 10 años construyendo sistemas backend, arquitecturas distribuidas y plataformas de pago. Disponible para trabajo remoto.',
  // Se renderiza sr-only dentro del <h1> — invisible para el visitante, es la
  // señal on-page más fuerte. Lleva el rol completo, igual que el copy visible.
  'meta.h1.role': 'Ingeniero Backend Senior y Arquitecto de Software',

  // ── Nav ──────────────────────────────────────────────────
  'nav.impact': 'Impacto',
  'nav.timeline': 'Recorrido',
  'nav.stack': 'Stack',
  'nav.projects': 'Proyectos',
  'nav.toggle.dark': 'Cambiar a modo oscuro',
  'nav.toggle.light': 'Cambiar a modo claro',
  'nav.lang.switch': 'Cambiar idioma a Inglés',

  // ── CV (compartido Hero + CTA) ───────────────────────────
  'cta.cv.url': '/gian-barboza-cv-es.pdf',

  // ── Impact ───────────────────────────────────────────────
  'impact.years.label': 'Años de Experiencia',
  'impact.uptime.label': 'Uptime en Infraestructura Crítica',
  'impact.volume.label': 'Transacciones Procesadas / Mes',
  'impact.payments.label': 'Procesadores de Pago Integrados',

  // ── Timeline ─────────────────────────────────────────────

  'timeline.now.period': 'Nov 2023 — Actualidad',
  'timeline.now.role': 'Senior Backend Engineer',
  'timeline.now.company': 'Hablax Inc. · 100% Remoto',
  'timeline.now.desc': 'Lidero iniciativas con IA sobre la plataforma de giftcards y recargas: SEO programático generado con IA, sistema de detección de fraude con reglas extensibles, gateways para modernizar servicios legacy y orquestador de notificaciones multi-canal.',

  'timeline.freelance.period': 'Abr 2023 — Nov 2023',
  'timeline.freelance.role': 'Full Stack Engineer · Freelance',
  'timeline.freelance.company': 'Clientes independientes · Remoto',
  'timeline.freelance.desc': 'Construí un e-commerce de productos digitales end-to-end con stack moderno: Next.js, TypeScript, Clean Architecture y Vitest. Integración completa de Stripe y PayPal, automatización de envíos y sistema administrativo propio.',

  'timeline.cto.period': 'Dic 2017 — Abr 2023',
  'timeline.cto.role': 'Full Stack Developer → CTO',
  'timeline.cto.company': 'Hablax Inc. · 100% Remoto',
  'timeline.cto.desc': 'Evolucioné de desarrollador a CTO liderando un equipo de 4 developers. Diseñé la migración del monolito a infraestructura distribuida de 8 servidores en DigitalOcean, integré los procesadores de pago core (PayPal, Payeezy, DLocal) y construí el motor multi-proveedor de productos con failover automático.',

  'timeline.fermat.period': 'Ene 2016 — Mar 2017',
  'timeline.fermat.role': 'Java Software Developer',
  'timeline.fermat.company': 'Fermat.org · 100% Remoto',
  'timeline.fermat.desc': 'Desarrollé apps Android P2P sobre criptomonedas (taxi, e-commerce) donde el pago iba directo a la wallet del proveedor sin intermediarios. Primera exposición a sistemas descentralizados y a un entorno 100% remoto.',

  // ── Tech Stack ───────────────────────────────────────────
  'stack.backend.title': 'Ingeniería Backend',
  'stack.architecture.title': 'Arquitectura',
  'stack.infra.title': 'Infraestructura',
  'stack.payments.title': 'Pagos & Riesgo',
  'stack.ai.title': 'Automatización & IA',

  // ── Projects ─────────────────────────────────────────────

  'projects.infra.title': 'Migración de Monolito a Infraestructura Distribuida',
  'projects.infra.context': 'Plataforma de giftcards y recargas con ~1,000 transacciones diarias y entre $100K y $300K mensuales procesados — todo sobre un único servidor.',
  'projects.infra.problem': 'Un problema de disponibilidad, no de throughput. El sistema de llamadas consumía todos los recursos de la máquina, así que los picos del Día de las Madres y Año Nuevo tumbaban la plataforma entera durante ~3 horas, en las fechas más lucrativas del año.',
  'projects.infra.decision': '<p>Rediseño hacia una arquitectura distribuida de 8 servidores en DigitalOcean, separando capas web, base de datos y dev para que ninguna carga pudiera ahogar a otra. HAProxy para balanceo HTTP, replicación MySQL master-slave para capacidad de lectura y standby, failover entre nodos, backups automatizados y runbooks de recovery.</p><p>El trade-off: el stack legacy no permitía aprovisionamiento automático, así que la topología se construyó a mano sobre Linux — más lento de levantar, pero eliminó el punto único de falla sin reescribir la aplicación primero. Liderando un equipo de 4 developers.</p>',
  'projects.infra.outcome': '99.9% uptime sostenido desde 2019 · Cero caídas en fechas críticas durante los últimos ~5 años',

  'projects.seo.title': 'SEO Programático con IA a Escala',
  'projects.seo.context': 'Presupuesto de miles de dólares mensuales en publicidad pagada, catálogo de más de 1,600 productos por proveedor multiplicado por múltiples países y servicios.',
  'projects.seo.problem': 'Cortar la dependencia de la adquisición pagada sin perder volumen. Escribir el contenido de las landings a mano para miles de combinaciones país/servicio/producto nunca iba a ocurrir.',
  'projects.seo.decision': 'Diseñado como pipeline jerárquico y no como una generación puntual de contenido: tres niveles (país → país/servicio → país/servicio/producto), cada uno heredando contexto del anterior, poblados vía ChatGPT-4o con prompts curados por vertical. El pipeline es orientado a eventos — cuando entra un producto nuevo al catálogo, regenera solo los niveles afectados, así la superficie de contenido crece con el catálogo en lugar de quedarse atrás.',
  'projects.seo.outcome': 'Reemplazo significativo del presupuesto de ads con tráfico orgánico · Mejor ratio de clientes nuevos que el canal pagado · Escala mantenida de forma autónoma con el catálogo',

  'projects.fraud.title': 'Sistema de Detección de Fraude con Reglas Extensibles',
  'projects.fraud.context': 'Plataforma de pagos expuesta a dos vectores de fraude: transaccional (tarjetas robadas, patrones sospechosos) y de acceso (multicuentas, intentos de hackeo).',
  'projects.fraud.problem': 'Los patrones de fraude nuevos aparecían más rápido de lo que el pipeline podía absorberlos: cada regla implicaba editar el evaluador central. Y detectar cuentas o dispositivos sospechosos no podía costar fricción para los usuarios legítimos.',
  'projects.fraud.decision': '<p>Separación del evaluador y las reglas. Un <strong>Factory</strong> construye cada regla, cada regla tiene una <strong>única responsabilidad</strong>, se autoregistra y recibe contexto ya normalizado — agregar un patrón significa agregar una clase, nunca editar el motor. El fraude de acceso corre como capa propia sobre device fingerprinting, manteniendo las señales de sesión (multicuentas, account takeover) fuera del camino transaccional.</p><p>También se prototipó evaluación contextual con un LLM vía n8n, imitando cómo decide un agente de soporte. Funcionó a bajo volumen y se archivó a propósito — el costo por decisión del modelo no sobrevivía a escala de producción.</p>',
  'projects.fraud.outcome': 'Reducción significativa de la carga de revisión manual · Reglas nuevas en horas en lugar de semanas · Ambos vectores de fraude cubiertos sin que uno toque el código del otro',

  'projects.payments.title': 'Integración Multi-Gateway de Pagos con Failover',
  'projects.payments.context': 'Operación global de giftcards y recargas donde un único gateway deja brechas geográficas, de conversión y de disponibilidad.',
  'projects.payments.problem': 'Cada gateway cubre distintos países con distintos fees, y cualquiera puede caerse o empezar a rechazar más sin aviso. Además, cada proveedor trae su propia forma de API — integrarlos uno por uno habría desparramado código específico de cada uno por toda la plataforma.',
  'projects.payments.decision': '<p>Todos los proveedores viven detrás de un único contrato de pago. Cada integración adapta su propia API —distinta autenticación, distintos nombres de campos, distintas formas de error— a objetos de request y response normalizados, así el resto de la plataforma cobra, reembolsa o anula sin saber qué procesador hay del otro lado.</p><p>La selección y el comportamiento se desacoplan con patrones de diseño: un <strong>Factory</strong> resuelve qué integración construir, <strong>Strategy</strong> permite que cada proveedor tenga su propio comportamiento detrás del contrato común, los <strong>Adapters</strong> absorben las diferencias de cada API, un <strong>Builder</strong> arma los requests más complejos y un <strong>Repository</strong> mantiene la persistencia de transacciones fuera de la lógica de pago. El routing es configuración, no código —proveedor activo y cadena de prioridad por producto— con failover automático cuando el activo falla o rechaza. Cinco procesadores integrados de punta a punta (PayPal, Payeezy, DLocal, Stripe, Shift4) con 3DS, refunds, voids, Apple Pay, Google Pay y tokenización propia de tarjetas.</p>',
  'projects.payments.outcome': '5 proveedores de pago en producción detrás de un contrato · Un proveedor nuevo se integra sin tocar código de la plataforma · Los pagos siguen disponibles durante incidentes de proveedores · Routing ajustado por país para costo y conversión',

  // ── Contact ──────────────────────────────────────────────
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
  'term.hero.tagline.html': 'Diseño y construyo <strong>sistemas backend</strong>, <strong>arquitecturas distribuidas</strong> y <strong>plataformas de pago</strong> para producción.',
  'term.hero.pitch': 'Hands-on: diseño la arquitectura y escribo el código que corre en producción.',

  // ── Terminal (Hero) ──────────────────────────────────────
  // Capa marketing. Ancho útil ~66 chars a ≥1100px — no pasarse.
  'term.terminal.role': 'gian.barboza · Ingeniero Backend Senior y Arquitecto de Software',
  'term.terminal.building': 'Diseño de sistemas backend, arquitectura distribuida y pagos.',
  'term.terminal.p1': 'Producción primero',
  'term.terminal.p2': 'Medir antes de optimizar',
  'term.terminal.p3': 'Evolucionar antes que reescribir',
  'term.terminal.p4': 'Arquitectura sobre frameworks',
  'term.terminal.status': 'Disponible para full-time remoto',

  'term.cta.resume': 'Descargar CV',
  'term.cta.contact': 'Hablemos',

  'term.section.01.label': '01 — Recorrido',
  'term.section.01.title': 'Desarrollador → CTO → Ingeniero Backend Senior y Arquitecto de Software',
  'term.section.01.sub': 'Una década diseñando, construyendo y evolucionando sistemas en producción entre pagos, infraestructura distribuida y automatización.',

  'term.section.02.label': '02 — Impacto Clave',
  'term.section.02.title': 'Números que llegaron a producción.',
  'term.section.02.sub': 'Algunas métricas que resumen una década de decisiones.',

  'term.section.03.label': '03 — Case Studies',
  'term.section.03.title': 'Cuatro sistemas en producción y las decisiones detrás.',
  'term.section.03.sub': 'Abre cualquier card para ver el contexto, el problema, la decisión de arquitectura y qué cambió en producción.',

  'term.section.04.label': '04 — Stack',
  'term.section.04.title': 'Expertise técnico.',
  'term.section.04.sub': 'Herramientas y patrones a los que recurro, agrupados por dominio.',

  'term.journey.current': 'Actual',

  'term.case.label.context': 'Contexto',
  'term.case.label.problem': 'Problema',
  'term.case.label.decision': 'Arquitectura',
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

  'term.case.payments.metric': '5 proveedores de pago',
  'term.case.payments.result.num': '5',
  'term.case.payments.result.text': 'proveedores de pago detrás de un contrato. Disponibilidad continua durante incidentes de proveedores. Routing optimizado por costo y conversión.',

  'term.cta.eyebrow': '— Trabajemos juntos',
  'term.cta.title.html': 'Disponible para roles de Ingeniero Backend Senior<br/>y Arquitecto de Software en <span class="accent">sistemas backend</span>, <span class="accent">arquitectura distribuida</span> y <span class="accent">pagos</span>.',
  'term.cta.sub': 'Disponible full-time y en remoto, para sistemas en producción con exigencia técnica real. Respuesta más rápida por email o LinkedIn.',

  'term.footer.copy': '© {year} Gian Barboza · gianbarboza.com',
  'term.footer.deploy': 'Construido con dedicación · Astro · Vercel',
};
