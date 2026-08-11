export const en: Record<string, string> = {
  // ── Meta ─────────────────────────────────────────────────
  // One positioning everywhere: "Senior Backend Engineer & Software Architect".
  // "Senior Backend Engineer" leads because it is the term recruiters search for;
  // "Software Architect" is what the case studies then have to prove.
  'meta.title': 'Gian Barboza | Senior Backend Engineer & Software Architect',
  'meta.description': 'Senior Backend Engineer & Software Architect with 10+ years building backend systems, distributed architectures and payment platforms. Available for remote work.',
  // Rendered sr-only inside the <h1> — invisible to visitors, strongest on-page
  // ranking signal. Carries the recruiter keyword + the new specialization tail.
  'meta.h1.role': 'Senior Backend Engineer & Software Architect',

  // ── Nav ──────────────────────────────────────────────────
  'nav.impact': 'Impact',
  'nav.timeline': 'Journey',
  'nav.stack': 'Stack',
  'nav.projects': 'Projects',
  'nav.toggle.dark': 'Switch to dark mode',
  'nav.toggle.light': 'Switch to light mode',
  'nav.lang.switch': 'Switch language to Spanish',

  // ── CV (compartido Hero + CTA) ───────────────────────────
  'cta.cv.url': '/gian-barboza-cv.pdf',

  // ── Impact ───────────────────────────────────────────────
  'impact.years.label': 'Years of Experience',
  'impact.uptime.label': 'Uptime on Critical Infrastructure',
  'impact.volume.label': 'Transactions Processed / Month',
  'impact.payments.label': 'Payment Providers Integrated',

  // ── Timeline ─────────────────────────────────────────────

  'timeline.now.period': 'Nov 2023 — Present',
  'timeline.now.role': 'Senior Backend Engineer',
  'timeline.now.company': 'Hablax Inc. · 100% Remote',
  'timeline.now.desc': 'Leading AI-driven initiatives on the gift cards and top-up platform: AI-generated programmatic SEO, fraud detection engine with extensible rules, gateways to modernize legacy services, and a multi-channel notification orchestrator.',

  'timeline.freelance.period': 'Apr 2023 — Nov 2023',
  'timeline.freelance.role': 'Full Stack Engineer · Freelance',
  'timeline.freelance.company': 'Independent clients · Remote',
  'timeline.freelance.desc': 'Built an end-to-end digital-goods e-commerce with a modern stack: Next.js, TypeScript, Clean Architecture and Vitest. Full Stripe and PayPal integration, delivery automation, and custom admin system.',

  'timeline.cto.period': 'Dec 2017 — Apr 2023',
  'timeline.cto.role': 'Full Stack Developer → CTO',
  'timeline.cto.company': 'Hablax Inc. · 100% Remote',
  'timeline.cto.desc': 'Grew from developer into CTO leading a team of 4 developers. Designed the migration from monolith to an 8-server distributed infrastructure on DigitalOcean, integrated the core payment processors (PayPal, Payeezy, DLocal), and built the multi-provider product engine with automatic failover.',

  'timeline.fermat.period': 'Jan 2016 — Mar 2017',
  'timeline.fermat.role': 'Java Software Developer',
  'timeline.fermat.company': 'Fermat.org · 100% Remote',
  'timeline.fermat.desc': 'Built P2P Android apps on top of cryptocurrencies (taxi, e-commerce) where payments landed directly in the provider\'s wallet with no intermediaries. First exposure to decentralized systems and 100% remote work.',

  // ── Tech Stack ───────────────────────────────────────────
  'stack.backend.title': 'Backend Engineering',
  'stack.architecture.title': 'Architecture',
  'stack.infra.title': 'Infrastructure',
  'stack.payments.title': 'Payments & Risk',
  'stack.ai.title': 'Automation & AI',

  // ── Projects ─────────────────────────────────────────────

  'projects.infra.title': 'Monolith to Distributed Infrastructure Migration',
  'projects.infra.context': 'Gift cards and top-up platform processing ~1,000 transactions/day and $100K–$300K in monthly volume — all of it on a single server.',
  'projects.infra.problem': 'An availability problem, not a throughput one. The calling system consumed every resource on the box, so traffic spikes on Mother\'s Day and New Year\'s Eve took the whole platform down for ~3 hours — on the most lucrative dates of the year.',
  'projects.infra.decision': '<p>Redesigned it as an 8-server distributed architecture on DigitalOcean, separating web, database and dev tiers so no workload could starve another. HAProxy for HTTP load balancing, MySQL master-slave replication for read capacity and standby, node-level failover, automated backups and recovery runbooks.</p><p>The trade-off: the legacy stack could not be provisioned automatically, so the topology was built by hand over Linux — slower to stand up, but it removed the single point of failure without rewriting the application first. Led a team of 4 through the migration.</p>',
  'projects.infra.outcome': '99.9% uptime sustained since 2019 · Zero outages during peak dates over the last ~5 years',

  'projects.seo.title': 'Programmatic SEO with AI at Scale',
  'projects.seo.context': 'Thousands of dollars in monthly paid-ad spend, with a catalog of 1,600+ products per provider multiplied across multiple countries and services.',
  'projects.seo.problem': 'Cut the dependency on paid acquisition without losing volume. Writing landing content by hand for thousands of country/service/product combinations was never going to happen.',
  'projects.seo.decision': 'Designed it as a hierarchical pipeline rather than a one-off content dump: three tiers (country → country/service → country/service/product), each inheriting context from the one above, populated through ChatGPT-4o with prompts curated per vertical. The pipeline is event-driven — a new product landing in the catalog regenerates the affected tiers on its own, so the content surface grows with the catalog instead of drifting behind it.',
  'projects.seo.outcome': 'Significant replacement of ad spend with organic traffic · Better new-client ratio than the paid channel · Scales autonomously with the catalog',

  'projects.fraud.title': 'Fraud Detection with Extensible Rule Engine',
  'projects.fraud.context': 'Payments platform exposed to two fraud vectors: transactional (stolen cards, suspicious patterns) and access-level (multi-accounts, account-takeover attempts).',
  'projects.fraud.problem': 'New fraud patterns appeared faster than the pipeline could absorb them: every rule meant editing the central evaluator. And detecting suspicious accounts or devices could not come at the cost of friction for legitimate users.',
  'projects.fraud.decision': '<p>Separated the evaluator from the rules. A <strong>Factory</strong> builds each rule, every rule owns a <strong>single responsibility</strong>, self-registers, and receives an already-normalized context — so adding a pattern means adding a class, never editing the engine. Access fraud runs as its own layer on device fingerprinting, keeping session signals (multi-account abuse, account takeover) out of the transactional path.</p><p>Also prototyped contextual evaluation with an LLM through n8n, imitating how support agents decide. It worked at low volume and was shelved on purpose — the per-decision model cost did not survive production scale.</p>',
  'projects.fraud.outcome': 'Significant reduction in manual review load · New rules ship in hours instead of weeks · Both fraud vectors covered without either touching the other\'s code',

  'projects.payments.title': 'Multi-Gateway Payments Integration with Failover',
  'projects.payments.context': 'Global gift cards and top-up operation where relying on a single gateway leaves gaps in geography, conversion, and availability.',
  'projects.payments.problem': 'Each gateway covers different countries at different fees, and any of them can go down or start rejecting more without warning. On top of that, every provider ships its own API shape — integrating them one by one would have scattered provider-specific code across the platform.',
  'projects.payments.decision': '<p>Every provider sits behind a single payment contract. Each integration adapts its own API — different auth, field names and error shapes — into normalized request and response objects, so the rest of the platform charges, refunds or voids without knowing which processor is on the other side.</p><p>Selection and behaviour are decoupled through design patterns: a <strong>Factory</strong> resolves which integration to build, <strong>Strategy</strong> lets each provider carry its own behaviour behind the shared contract, <strong>Adapters</strong> absorb the per-API differences, a <strong>Builder</strong> assembles the more complex provider requests, and a <strong>Repository</strong> keeps transaction persistence out of the payment logic. Routing is configuration, not code — active provider and priority chain per product — with automatic failover when the active one fails or rejects. Five processors integrated end to end (PayPal, Payeezy, DLocal, Stripe, Shift4) with 3DS, refunds, voids, Apple Pay, Google Pay and in-house card tokenization.</p>',
  'projects.payments.outcome': '5 payment providers in production behind one contract · A new provider integrates without touching platform code · Payments stay available through provider incidents · Routing tuned per country for cost and conversion',

  // ── Contact ──────────────────────────────────────────────
  'contact.modal.title': "Let's Talk",
  'contact.modal.intro': "Tell me about the opportunity or project. I'll get back by email within 24h.",
  'contact.modal.close': 'Close',
  'contact.form.name': 'Name',
  'contact.form.name.placeholder': 'Your name',
  'contact.form.email': 'Email',
  'contact.form.email.placeholder': 'you@email.com',
  'contact.form.message': 'Message',
  'contact.form.message.placeholder': 'Tell me how I can help…',
  'contact.form.privacy': "Your email is only used to reply. It's never shared or added to any marketing list.",
  'contact.form.submit': 'Send message',
  'contact.form.sending': 'Sending…',
  'contact.form.success': "Message sent! I'll get back to you soon.",
  'contact.form.error': 'Something went wrong. Please try again in a moment.',
  'contact.form.validation': 'Please check the highlighted fields.',
  'contact.email': 'gianelo1992@gmail.com',
  'contact.phone': '+57 304 358 1365',
  'contact.phone.url': 'https://wa.me/573043581365',
  'contact.linkedin.url': 'https://linkedin.com/in/gian-barboza',
  'contact.github.url': 'https://github.com/gianelo',

  // ── Terminal style (design-specific copy) ────────────────
  'term.nav.cta': 'Get in touch ↗',
  'term.hero.location': 'Rionegro, CO · GMT-5',
  'term.hero.years': '10+ yrs',
  'term.hero.available': 'Available',
  'term.hero.tagline.html': 'Designing and building <strong>backend systems</strong>, <strong>distributed architectures</strong> and <strong>payment platforms</strong> for production.',
  'term.hero.pitch': 'Hands-on: I design the architecture and write the code that runs in production.',

  // ── Terminal (Hero) ──────────────────────────────────────
  // Usable width is ~66 chars at ≥1100px — do not exceed it.
  'term.terminal.role': 'gian.barboza · Senior Backend Engineer & Software Architect',
  'term.terminal.building': 'Designing backend systems, distributed architecture & payments.',
  'term.terminal.p1': 'Production first',
  'term.terminal.p2': 'Measure before optimizing',
  'term.terminal.p3': 'Evolution over rewrites',
  'term.terminal.p4': 'Architecture over frameworks',
  'term.terminal.status': 'Available for full-time remote',

  'term.cta.resume': 'Download résumé',
  'term.cta.contact': 'Get in touch',

  'term.section.01.label': '01 — Journey',
  'term.section.01.title': 'Developer → CTO → Senior Backend Engineer & Software Architect',
  'term.section.01.sub': 'A decade of designing, building and evolving production systems across payments, distributed infrastructure and automation.',

  'term.section.02.label': '02 — Key Impact',
  'term.section.02.title': 'Numbers that shipped to production.',
  'term.section.02.sub': 'A few metrics that summarize a decade of decisions.',

  'term.section.03.label': '03 — Case Studies',
  'term.section.03.title': 'Four production systems, and the decisions behind them.',
  'term.section.03.sub': 'Open any card for the context, the problem, the architecture decision, and what it changed in production.',

  'term.section.04.label': '04 — Stack',
  'term.section.04.title': 'Technical expertise.',
  'term.section.04.sub': 'Tools and patterns I reach for, grouped by domain.',

  'term.journey.current': 'Current',

  'term.case.label.context': 'Context',
  'term.case.label.problem': 'Problem',
  'term.case.label.decision': 'Architecture',
  'term.case.label.result': 'Result',

  'term.case.infra.metric': '99.9% uptime',
  'term.case.infra.result.num': '99.9%',
  'term.case.infra.result.text': 'uptime sustained since 2019. Zero outages on peak dates over the last 5 years.',

  'term.case.seo.metric': 'Org. traffic ↑',
  'term.case.seo.result.num': '↓ paid',
  'term.case.seo.result.text': 'spend significantly replaced with organic traffic. Better client ratio than the paid channel.',

  'term.case.fraud.metric': 'Hours, not weeks',
  'term.case.fraud.result.num': 'Hours',
  'term.case.fraud.result.text': 'to ship new rules instead of weeks. Significant reduction in manual review load.',

  'term.case.payments.metric': '5 payment providers',
  'term.case.payments.result.num': '5',
  'term.case.payments.result.text': 'payment providers behind one contract. Continuous availability during provider incidents. Routing optimized for cost and conversion.',

  'term.cta.eyebrow': '— Let\'s work together',
  'term.cta.title.html': 'Open to Senior Backend Engineer &amp; Software Architect roles<br/>in <span class="accent">backend systems</span>, <span class="accent">distributed architecture</span> &amp; <span class="accent">payments</span>.',
  'term.cta.sub': 'Available full-time and remote, for production systems with real technical constraints. Fastest reply via email or LinkedIn.',

  'term.footer.copy': '© {year} Gian Barboza · gianbarboza.com',
  'term.footer.deploy': 'Built with care · Astro · Vercel',
};
