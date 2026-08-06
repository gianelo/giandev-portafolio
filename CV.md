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

Senior Backend Engineer with 10+ years turning complex business problems into reliable production systems. Ex-CTO with hands-on expertise in payment platforms (Stripe, PayPal, DLocal, Shift4, Payeezy), distributed architecture and AI-assisted development. Led the migration of a single-server monolith to a 99.9%-uptime distributed platform processing $200K+/month in transactions.

## Experience

### Senior Backend Engineer — Hablax Inc.
*Nov 2023 — Present · Remote (100%)*

- Cut dependency on paid advertising by making organic acquisition scale unattended: a 3-tier pipeline (country → service → product) generating thousands of landings via ChatGPT-4o, auto-regenerating as the catalog grows. Organic now converts new clients better than the paid channel.
- Took fraud response from weeks to hours with a rule engine on Factory and Single Responsibility patterns: rules self-register and receive normalized context, so new patterns ship without touching the evaluator. Significantly cut manual review load.
- Closed the account-fraud vector (multi-account abuse, account takeover) with a device-fingerprinting layer that flags suspicious sessions without adding friction for legitimate users.
- Unblocked modernization of a legacy stack that could not be upgraded in place, designing API gateways so new services integrate without a rewrite.
- Opened a new payment corridor with an end-to-end Shift4 integration: 3DS, tokenization, refunds, and voids.
- Replaced ad-hoc customer messaging with a multi-channel notification orchestrator routing email and push by country, payment method, and product.

### Full Stack Engineer · Freelance — Independent Clients
*Apr 2023 — Nov 2023 · Remote*

- Took a digital-goods business from zero to selling end-to-end — storefront, checkout, automated delivery — on Next.js, TypeScript, Clean Architecture, Vitest, and GitHub Actions CI/CD.
- Made payments and fulfillment hands-off: full Stripe and PayPal integration (authorization, refunds) wired to automatic delivery of digital products.
- Gave the client operational autonomy with a custom admin for catalog, orders, and fulfillment.

### Full Stack Developer → CTO — Hablax Inc.
*Dec 2017 — Apr 2023 · Remote (100%)*

- Promoted from developer to CTO, leading 4 engineers through critical infrastructure migrations and feature delivery.
- Ended recurring ~3-hour outages on the year's most lucrative dates (Mother's Day, New Year's Eve): migrated a single-server monolith to an 8-server distributed architecture on DigitalOcean — HAProxy load balancing, MySQL master-slave replication, node-level failover, automated backups, recovery runbooks — executed manually over Linux due to legacy-stack constraints. 99.9% uptime since.
- Removed single-gateway risk from a global payments operation: multi-provider engine with admin-configurable routing per product and automatic failover across PayPal, Payeezy, and DLocal.
- Let operators swap the active supplier live with no downtime, via a multi-provider catalog engine with priority-based failover.
- Widened checkout conversion with Apple Pay, Google Pay, and in-house card tokenization.
- Kept catalog and pricing accurate across suppliers with automated daily async syncs at zero downtime.
- Expanded revenue lines with travel booking (hotels, car rentals), money-transfer integration, and a referral system.

### Java Software Developer — Fermat.org
*Jan 2016 — Mar 2017 · Remote (100%)*

- Removed intermediaries from consumer payments, building P2P Android apps on cryptocurrency infrastructure (ride-hailing, e-commerce) where funds settled wallet to wallet.
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
