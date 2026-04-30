export const en: Record<string, string> = {
  // ── Meta ─────────────────────────────────────────────────
  'meta.title': 'Gian Barboza – Senior Backend Engineer · Payments & AI',
  'meta.description': 'Senior Backend Engineer with 10+ years building distributed payments infrastructure (Stripe, PayPal, DLocal, Shift4) and AI-powered automation. Ex-CTO. Available for remote work.',

  // ── Nav ──────────────────────────────────────────────────
  'nav.impact': 'Impact',
  'nav.timeline': 'Journey',
  'nav.stack': 'Stack',
  'nav.projects': 'Projects',
  'nav.contact': 'Contact',
  'nav.toggle.dark': 'Switch to dark mode',
  'nav.toggle.light': 'Switch to light mode',
  'nav.skip': 'Skip to main content',
  'nav.lang.switch': 'Switch language to Spanish',

  // ── Hero ─────────────────────────────────────────────────
  'hero.title': 'Gian Barboza',
  'hero.subtitle': 'Senior Backend Engineer',
  'hero.badge': 'Available for remote work',
  'hero.bio': 'Senior Backend Engineer with <strong>10+ years</strong> building distributed systems, <strong>payments infrastructure</strong> (Stripe, PayPal, DLocal, Shift4), and <strong>AI-powered automation</strong>. Ex-CTO who ships production-first solutions.',
  'hero.tagline': '10+ years building production systems at scale',
  'hero.cta.projects': 'View Projects',
  'hero.cta.contact': 'Contact Me',
  'hero.cta.email': 'Contact Me',
  'cta.cv.download': 'Download Resume',
  'cta.cv.url': '/gian-barboza-cv.pdf',

  // ── Impact ───────────────────────────────────────────────
  'impact.title': 'Key Impact',
  'impact.years.number': '10+',
  'impact.years.label': 'Years of Experience',
  'impact.uptime.number': '99.9%',
  'impact.uptime.label': 'Uptime on Critical Infrastructure',
  'impact.volume.number': '$200K+',
  'impact.volume.label': 'Transactions Processed / Month',
  'impact.payments.number': '5+',
  'impact.payments.label': 'Payment Providers Integrated',

  // ── Timeline ─────────────────────────────────────────────
  'timeline.title': 'Journey',
  'timeline.subtitle': 'From junior developer to CTO and senior backend on payments platforms',

  'timeline.now.period': 'Nov 2023 — Present',
  'timeline.now.role': 'Senior Backend Engineer',
  'timeline.now.company': 'Hablax Inc. · 100% Remote',
  'timeline.now.desc': 'Leading AI-driven initiatives on the gift cards and top-up platform: AI-generated programmatic SEO, fraud detection engine with extensible rules, gateways to modernize legacy services, and a multi-channel notification orchestrator.',

  'timeline.freelance.period': 'Apr 2023 — Nov 2023',
  'timeline.freelance.role': 'Full Stack Engineer · Freelance',
  'timeline.freelance.company': 'Independent clients · Remote',
  'timeline.freelance.desc': 'Built an end-to-end digital-goods e-commerce with a modern stack: Next.js, TypeScript, Clean Architecture, Vitest, and GitHub Actions CI/CD. Full Stripe and PayPal integration, delivery automation, and custom admin system.',

  'timeline.cto.period': 'Dec 2017 — Apr 2023',
  'timeline.cto.role': 'Full Stack Developer → CTO',
  'timeline.cto.company': 'Hablax Inc. · 100% Remote',
  'timeline.cto.desc': 'Grew from developer into CTO leading a team of 4 developers. Designed the migration from monolith to an 8-server distributed infrastructure on DigitalOcean, integrated the core payment processors (PayPal, Payeezy, DLocal), and built the multi-provider product engine with automatic failover.',

  'timeline.fermat.period': 'Jan 2016 — Mar 2017',
  'timeline.fermat.role': 'Java Software Developer',
  'timeline.fermat.company': 'Fermat.org · 100% Remote',
  'timeline.fermat.desc': 'Built P2P Android apps on top of cryptocurrencies (taxi, e-commerce) where payments landed directly in the provider\'s wallet with no intermediaries. First exposure to decentralized systems and 100% remote work.',

  // ── Tech Stack ───────────────────────────────────────────
  'stack.title': 'Technical Expertise',
  'stack.backend.title': 'Backend & Architecture',
  'stack.infra.title': 'Infrastructure',
  'stack.payments.title': 'Payments & Risk',
  'stack.ai.title': 'Automation & AI',

  // ── Projects ─────────────────────────────────────────────
  'projects.title': 'Case Studies',
  'projects.subtitle': 'Real problems, technical decisions, and measurable outcomes',
  'projects.label.context': 'Context',
  'projects.label.problem': 'Problem',
  'projects.label.decision': 'Technical Decision',

  'projects.infra.title': 'Monolith to Distributed Infrastructure Migration',
  'projects.infra.context': 'Gift cards and top-up platform processing ~1,000 transactions/day and $100K–$300K in monthly volume, running on a single server.',
  'projects.infra.problem': 'Recurring ~3-hour outages during traffic spikes (Mother\'s Day, New Year\'s Eve) because the calling system consumed all resources. Direct revenue loss on the most lucrative days of the year.',
  'projects.infra.decision': 'Migrated to DigitalOcean with 8 servers separating concerns (web, database, dev). HTTP load balancing with HAProxy, MySQL master-slave replication for high availability, node-level failover, automated backups, and recovery runbooks. Executed manually over Linux due to legacy-stack constraints, leading a team of 4 developers.',
  'projects.infra.outcome': '99.9% uptime sustained since 2019 · Zero outages during peak dates over the last ~5 years',

  'projects.seo.title': 'Programmatic SEO with AI at Scale',
  'projects.seo.context': 'Thousands of dollars in monthly paid-ad spend, with a catalog of 1,600+ products per provider multiplied across multiple countries and services.',
  'projects.seo.problem': 'Reduce paid-ad dependency without hurting acquisition. Generating content at human scale for thousands of country/service/product combinations was unfeasible.',
  'projects.seo.decision': 'Hierarchical generation pipeline across 3 tiers (country → country/service → country/service/product), populating thousands of combinations via ChatGPT-4o with prompts curated per vertical. Automatic trigger: when a new product lands, affected landings are regenerated with zero manual intervention.',
  'projects.seo.outcome': 'Significant replacement of ad spend with organic traffic · Better new-client ratio than the paid channel · Scales autonomously with the catalog',

  'projects.fraud.title': 'Fraud Detection with Extensible Rule Engine',
  'projects.fraud.context': 'Payments platform exposed to two fraud vectors: transactional (stolen cards, suspicious patterns) and access-level (multi-accounts, account-takeover attempts).',
  'projects.fraud.problem': 'Need to add new rules frequently without touching the central pipeline, and to detect suspicious account/device patterns without degrading the experience for legitimate users.',
  'projects.fraud.decision': 'Rule engine based on Factory + Single Responsibility: each rule self-registers and receives normalized context, allowing extension without modifying the evaluator. Separate access-fraud layer using device fingerprinting. Explored contextual LLM evaluation via n8n to mimic support agents\' decisions; it worked at small scale but was shelved due to prohibitive model costs.',
  'projects.fraud.outcome': 'Significant reduction in manual review load · Technical foundation to ship new rules in hours instead of weeks',

  'projects.payments.title': 'Multi-Gateway Payments Integration with Failover',
  'projects.payments.context': 'Global gift cards and top-up operation where relying on a single gateway leaves gaps in geography, conversion, and availability.',
  'projects.payments.problem': 'Different gateways cover different countries and fees; any one of them can go down or start rejecting more. We needed continuous coverage and commercial flexibility to optimize per country and method.',
  'projects.payments.decision': 'Abstraction where the admin configures the active gateway and priorities per product. On failure or rejection from the active provider, automatic failover to the next in the chain. 5 processors integrated (PayPal, Payeezy, DLocal, Stripe, Shift4) with full features: 3DS, refunds, voids, Apple Pay, Google Pay, and in-house card tokenization.',
  'projects.payments.outcome': 'Continuous payment availability during provider incidents · Routing optimized for cost and conversion · 5 gateways in production',

  // ── Contact ──────────────────────────────────────────────
  'contact.title': "Let's Work Together",
  'contact.subtitle': 'Available for full-time remote opportunities',
  'contact.cta': 'Get in Touch',
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
  'term.hero.tagline.html': 'Senior backend engineer building <strong>distributed payments infrastructure</strong> and <strong>AI-powered automation</strong>. Ex-CTO. Ships production-first.',

  'term.cta.resume': 'Download résumé',
  'term.cta.contact': 'Get in touch',

  'term.section.01.label': '01 — Journey',
  'term.section.01.title': 'Junior dev → CTO → senior backend on payments platforms.',
  'term.section.01.sub': 'A decade of compounding decisions across monoliths, distributed systems, and AI.',

  'term.section.02.label': '02 — Key Impact',
  'term.section.02.title': 'Numbers that shipped to production.',
  'term.section.02.sub': 'A few metrics that summarize a decade of decisions.',

  'term.section.03.label': '03 — Case Studies',
  'term.section.03.title': 'Four problems, four production systems.',
  'term.section.03.sub': 'Click any card to expand context, problem, decision, and result.',

  'term.section.04.label': '04 — Stack',
  'term.section.04.title': 'Technical expertise.',
  'term.section.04.sub': 'Tools and patterns I reach for, grouped by domain.',

  'term.journey.current': 'Current',

  'term.case.label.context': 'Context',
  'term.case.label.problem': 'Problem',
  'term.case.label.decision': 'Decision',
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

  'term.case.payments.metric': '5 gateways',
  'term.case.payments.result.num': '5',
  'term.case.payments.result.text': 'gateways consolidated. Continuous availability during provider incidents. Routing optimized for cost and conversion.',

  'term.cta.eyebrow': '— Let\'s work together',
  'term.cta.title.html': 'Open to senior backend roles<br/>in <span class="accent">payments</span> &amp; <span class="accent">AI</span>.',
  'term.cta.sub': 'Available for full-time remote opportunities. Fastest reply via email or LinkedIn.',

  'term.footer.copy': '© {year} Gian Barboza · gianbarboza.com',
  'term.footer.deploy': 'Built with care · Astro · Vercel',
};
