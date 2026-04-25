---
stylesheet: cv.css
pdf_options:
  format: A4
  printBackground: true
---

<div class="cv-header">
  <div class="cv-header-text">
    <h1>Gian Barboza</h1>
    <p class="role">Senior Backend Engineer</p>
    <p class="contact">Rionegro, Antioquia, Colombia · Remote-first</p>
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

## Summary

Senior Backend Engineer with 10+ years building production systems at scale. Ex-CTO with hands-on expertise in distributed systems, payments infrastructure (Stripe, PayPal, DLocal, Shift4, Payeezy) and AI-driven automation. Led the migration of a single-server monolith to a 99.9%-uptime distributed platform processing $200K+/month in transactions.

## Experience

### Senior Backend Engineer — Hablax Inc.
*Nov 2023 — Present · Remote (100%)*

- Led AI-driven programmatic SEO across a hierarchical pipeline (country → service → product), populating thousands of landings via ChatGPT-4o with per-vertical curated prompts; replaced a significant portion of paid-ad spend with organic traffic at a better new-client conversion rate.
- Designed and shipped a fraud detection engine using Factory and Single Responsibility patterns, enabling new rules to self-register into the evaluator and ship in hours instead of weeks.
- Built a device-fingerprinting layer for access-fraud detection (multi-account abuse, account-takeover attempts).
- Designed API gateways to decouple modern tooling from a legacy stack that could not be upgraded in place.
- Integrated Shift4 end-to-end, including 3DS, tokenization, refunds, and voids.
- Built a multi-channel notification orchestrator routing emails and push notifications by country, payment method, and product.

### Full Stack Engineer · Freelance — Independent Clients
*Apr 2023 — Nov 2023 · Remote*

- Built an end-to-end digital-goods e-commerce platform with Next.js, TypeScript, Clean Architecture, Vitest, and GitHub Actions CI/CD.
- Integrated Stripe and PayPal end-to-end, including auth, refunds, and automated delivery of digital products.
- Designed a custom admin system for catalog, orders, and fulfillment automation.

### Full Stack Developer → CTO — Hablax Inc.
*Dec 2017 — Apr 2023 · Remote (100%)*

- Promoted from developer to CTO. Led a team of 4 engineers through critical infrastructure migrations and feature builds.
- Migrated from a single-server monolith to an 8-server distributed architecture on DigitalOcean: HAProxy load balancing, MySQL master-slave replication for HA, node-level failover, automated backups, and recovery runbooks. Executed manually over Linux due to legacy-stack constraints.
- Eliminated recurring ~3-hour outages on peak-traffic dates (Mother's Day, New Year's Eve) that caused direct revenue loss; sustained 99.9% uptime since.
- Architected a multi-provider payments engine with admin-configurable routing by product and automatic failover across PayPal, Payeezy, and DLocal.
- Built a multi-provider product/catalog engine with priority-based failover, allowing operators to swap the active provider live with no service downtime.
- Implemented Apple Pay, Google Pay, and in-house card tokenization.
- Automated asynchronous catalog and pricing updates across providers; daily syncs with zero downtime.
- Delivered travel booking module (hotels and car rentals), money-transfer integration, and a referral system.

### Java Software Developer — Fermat.org
*Jan 2016 — Mar 2017 · Remote (100%)*

- Built P2P Android apps on top of cryptocurrency infrastructure (ride-hailing, e-commerce) where payments settled directly between wallets with no intermediaries.
- First exposure to decentralized systems and 100% remote work.

## Selected Projects

- **Monolith → 8-server distributed infrastructure** — Led zero-downtime migration with HAProxy, MySQL replication, and automated recovery; 99.9% uptime sustained since 2019.
- **Programmatic SEO at scale with AI** — 3-tier generation pipeline (country → service → product) powered by ChatGPT-4o; auto-regenerates landings as the catalog grows. Replaced a significant portion of paid-ad spend with organic traffic.
- **Fraud detection with extensible rule engine** — Factory and SRP patterns so new rules plug in without touching the evaluator. Separate device-fingerprinting layer for access fraud. Explored LLM-based contextual evaluation via n8n; shelved due to model cost at scale.
- **Multi-gateway payments with failover** — 5 processors integrated (Stripe, PayPal, DLocal, Shift4, Payeezy) with admin-configurable routing and automatic failover on provider incidents. Full feature set: 3DS, refunds, voids, Apple Pay, Google Pay, and in-house tokenization.

## Technical Skills

- **Backend & Architecture** — Node.js · TypeScript · Next.js · PHP · Java · REST APIs · Gateway Pattern · Design Patterns (Factory, Strategy, SRP) · Clean Architecture
- **Infrastructure** — Linux · HAProxy · Nginx · MySQL Replication · DigitalOcean · Cronjobs · CI/CD (GitHub Actions)
- **Payments & Risk** — Stripe · PayPal · DLocal · Shift4 · Payeezy · 3DS · Apple Pay · Google Pay · In-house Tokenization · Payment Routing · Fraud Rule Engines · Device Fingerprinting · PCI Compliance
- **Automation & AI** — n8n · LLM Integration · AI-Assisted Fraud · Programmatic SEO · Content Automation · Web Scraping

## Languages

- **Spanish** — Native
- **English** — Upper-intermediate (B2)

## Education

**Universidad Dr. Rafael Belloso Chacín (URBE)** — Maracaibo, Venezuela · 2011 – 2015
*Ingeniero en Informática*

## Availability

Two weeks notice.
