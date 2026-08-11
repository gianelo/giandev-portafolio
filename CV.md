---
stylesheet: cv.css
pdf_options:
  format: A4
  printBackground: true
---

<div class="cv-header">
  <div class="cv-header-text">
    <h1>Gian Barboza</h1>
    <p class="role">Senior Backend Engineer | Software Architect</p>
    <p class="contact">Rionegro, Antioquia, Colombia · Remote-first · Available on two weeks notice</p>
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

Senior Backend Engineer and Software Architect with 10+ years of hands-on experience designing, building and evolving production systems — distributed architectures, multi-provider payment platforms, fraud detection, API integration and production infrastructure. Designed and led the migration of a single-server monolith to an 8-server distributed platform sustaining 99.9% uptime while processing $200K+ per month in transactions.

## Experience

### Senior Backend Engineer — Hablax Inc.
*Nov 2023 — Present · Remote (100%)*

- Took fraud response from weeks to hours with an extensible rule engine, and closed the account-fraud vector (multi-account abuse, account takeover) with a separate device-fingerprinting layer. Significantly cut manual review load, without adding friction for legitimate users.
- Unblocked modernization of a legacy stack that could not be upgraded in place, designing API gateways so new services integrate without a rewrite.
- Opened a new payment corridor with an end-to-end Shift4 integration: 3DS, tokenization, refunds and voids.
- Cut paid-advertising dependency with a programmatic SEO pipeline that scales unattended with the catalog. Organic now converts new clients better than the paid channel.
- Replaced ad-hoc customer messaging with a multi-channel notification orchestrator routing email and push by country, payment method and product.

### Full Stack Developer → CTO — Hablax Inc.
*Dec 2017 — Apr 2023 · Remote (100%)*

- Ended recurring ~3-hour outages on the year's most lucrative dates (Mother's Day, New Year's Eve): designed and led the migration of a single-server monolith to an 8-server distributed architecture on DigitalOcean, executed manually over Linux due to legacy-stack constraints. 99.9% uptime since.
- Removed single-gateway risk from a global payments operation with a multi-provider architecture: configurable routing per product, automatic failover across PayPal, Payeezy and DLocal, and checkout widened with Apple Pay, Google Pay and in-house tokenization.
- Promoted from developer to CTO, leading 4 engineers through critical infrastructure migrations and feature delivery.
- Kept a multi-provider catalog accurate and swappable live: priority-based failover between suppliers plus automated daily async syncs, at zero downtime.
- Expanded revenue lines with travel booking (hotels, car rentals), money-transfer integration and a referral system.

### Full Stack Engineer · Freelance — Independent Clients
*Apr 2023 — Nov 2023 · Remote*

- Took a digital-goods business from zero to selling end-to-end — storefront, checkout, automated delivery — on Next.js, TypeScript, Clean Architecture and Vitest.
- Made payments and fulfillment hands-off: full Stripe and PayPal integration (authorization, refunds) wired to automatic delivery of digital products.
- Gave the client operational autonomy with a custom admin for catalog, orders and fulfillment.

### Java Software Developer — Fermat.org
*Jan 2016 — Mar 2017 · Remote (100%)*

- Removed intermediaries from consumer payments, building P2P Android apps on cryptocurrency infrastructure (ride-hailing, e-commerce) where funds settled wallet to wallet. First exposure to decentralized systems and fully remote work.

## Selected Architecture & Systems

- **Multi-Gateway Payment Architecture** — 5 providers (Stripe, PayPal, DLocal, Shift4, Payeezy) behind a single payment contract. Adapters normalize each API into shared request/response objects; Factory and Strategy decouple provider selection from behaviour; Builder assembles the complex requests, Repository isolates transaction persistence. Configurable routing and priority per product with automatic failover. 3DS, refunds, voids, Apple Pay, Google Pay, in-house tokenization.
- **Distributed Infrastructure Migration** — 8-server architecture on DigitalOcean separating web, database and dev tiers. HAProxy load balancing, MySQL master-slave replication, node-level failover, automated backups and recovery runbooks. 99.9% uptime sustained since 2019.
- **Extensible Fraud Detection Engine** — Rule architecture on Factory and Single Responsibility: rules self-register against a normalized context, so patterns plug in without touching the evaluator. Separate device-fingerprinting layer for access fraud. LLM contextual evaluation prototyped via n8n, shelved on model cost at scale.
- **Programmatic SEO Pipeline** — 3-tier generation pipeline (country → service → product) on ChatGPT-4o, regenerating affected landings as the catalog grows. Replaced a significant portion of paid-ad spend with organic traffic.

## Technical Skills

- **Backend & Architecture** — Node.js · TypeScript · Next.js · PHP · Java · REST APIs · API Architecture · Distributed Systems · Clean Architecture · Gateway Pattern · Design Patterns (Factory, Strategy, Adapter, Repository, Builder, SRP)
- **Infrastructure** — Linux · HAProxy · Nginx · MySQL Replication · DigitalOcean · Cronjobs
- **Payments & Risk** — Stripe · PayPal · DLocal · Shift4 · Payeezy · 3DS · Apple Pay · Google Pay · In-house Tokenization · Payment Routing · Fraud Rule Engines · Device Fingerprinting · PCI Compliance
- **Automation & AI** — n8n · LLM Integration · AI-Assisted Fraud · Programmatic SEO · Content Automation · Web Scraping

## Languages

- **Spanish** — Native
- **English** — Upper-intermediate (B2)

## Education

**Universidad Dr. Rafael Belloso Chacín (URBE)** — Maracaibo, Venezuela · 2011 – 2015
*Ingeniero en Informática*
