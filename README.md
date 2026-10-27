# Gian Barboza — Services and portfolio

Bilingual independent engineering services at `/` and `/es/`; the career portfolio remains at `/portfolio/` and `/es/portfolio/`. `/en/` redirects to `/`.

**Live URL:** [gianbarboza.com](https://gianbarboza.com)

---

## Inquiry delivery

The services form posts to `/api/inquiry`, served by either the Vercel function in `api/inquiry.js` or the Cloudflare Pages adapter in `functions/api/inquiry.js`. The server verifies a Cloudflare Turnstile token **before** saving a record in the private “Consultas del sitio” table and asking Resend to send a plain-text email notification. `NOTION_API_TOKEN`, `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` stay server-side; `PUBLIC_TURNSTILE_SITE_KEY` is intentionally public. The old browser-side Web3Forms `ContactModal.astro` remains source-only and is not rendered. Agent-side Notion MCP OAuth is **not** a production API token.

The endpoint retains server-side input, origin and size validation, a honeypot and a two-second timing guard. Missing configuration fails closed with 503; invalid Turnstile tokens have no delivery side effects. A Notion failure prevents the email; a confirmed Notion record with an unconfirmed email returns a partial state and lets the same form retry **only the email** using a signed reference and a new Turnstile token. The form retains entered details. When Notion's create response is lost, storage is **unknown**: a fresh submission may create a duplicate, so the UI says so rather than promising exactly-once delivery. There is no cross-provider transaction or guaranteed automatic retry. Resend's stable idempotency key limits duplicate emails within its provider window. Successful API acceptance is **not** proof of inbox delivery; the table's “Aceptado por Resend” means API acceptance only. Do not log inquiry contents or credentials.

The three services have free tiers with limits: personal Notion Free (multi-member workspaces can have block limits), Resend Free (3,000 emails/month, 100/day) and Cloudflare Turnstile Free (20 widgets). The site does not depend on a paid API, but free quotas and provider terms can change. Local `astro dev` serves the static frontend but not either server function; build/unit tests with mocked providers are not live delivery confirmation.

Role copy on the career pages follows the single full title documented in [`AGENTS.md`](AGENTS.md).

---

## Stack

| Tool | Version | Purpose |
|---|---|---|
| [Astro](https://astro.build) | 6.x | Static site framework |
| Inter Tight + JetBrains Mono | — | Approved variable font assets, self-hosted in `public/fonts/` |
| [satori](https://github.com/vercel/satori) + resvg | — | Generates portfolio `og.png` and services `og-home.png` at build time |
| `@astrojs/sitemap` | 3.x | Sitemap generation |
| Vercel Analytics + Speed Insights | 2.x | Traffic and Core Web Vitals on Vercel builds only; not available on Cloudflare Pages |
| [Notion API](https://developers.notion.com/) + [Resend](https://resend.com) + [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) | Free tiers | Private inquiry record, email notification and server-verified abuse challenge |
| Vanilla JS | — | Theme, locale links, mobile menu, clock, counters, disclosures and inquiry states |

> **No CSS framework or client JS framework.** Plain CSS in `src/styles/global.css` supplies shared tokens, fonts, reset and portfolio styles; `src/styles/home.css` supplies services styles. Preserve `.sr-only` for accessible role text.

---

## Features

- **Shared bilingual shell** — connected GB mark, nonsticky navigation, mobile menu, footer, amber accents and self-hosted approved fonts
- **Dark / light mode** — dark by default, stored in `localStorage`, initialized in `<head>`
- **Services** — EN `/` and ES `/es/`: services, selected work linked to portfolio cases, process and inquiry form
- **Career portfolio** — EN `/portfolio/` and ES `/es/portfolio/`: career journey, four impact metrics, five case studies, five stack categories and localized CV downloads
- **Native case disclosures** — `<details>` / `<summary>` with context, problem, architecture and result; hash links open the matching case, and close buttons restore summary focus
- **Locale switching** — preserves services/portfolio destination and fragment; `/en/` is a Vercel redirect, not a built page
- **Live clock and counters** — Bogotá time (GMT-5); impact counters respect reduced motion
- **Inquiry form** — server validation, honeypot, timing guard and server-verified Turnstile; Notion record plus email notification with a truthful saved-but-email-pending state
- **SEO** — Person + WebSite JSON-LD, page-specific canonical/hreflang links, separate services/portfolio OG images, sitemap and preview `noindex`
- **Accessibility** — skip link, visible keyboard focus, native disclosures, form error summary/status and reduced-motion handling; no rendered contact modal

---

## Project Structure

```text
api/inquiry.js                     # Vercel function → Turnstile verification → Resend
public/fonts/                      # Approved self-hosted WOFF2 assets
public/favicon.ico                 # Shared GB favicon
src/
├── components/
│   ├── home/Home.astro            # Services composition
│   ├── home/Inquiry.astro         # Inline inquiry form and client states
│   ├── BrandMark.astro            # Shared GB mark
│   ├── Nav.astro                  # Nonsticky nav, clock, locale links, mobile menu
│   ├── ThemeToggle.astro          # Shared theme control
│   ├── SiteFooter.astro           # Shared footer
│   ├── Hero.astro                 # Portfolio hero and engineering principles
│   ├── Timeline.astro             # Four career milestones
│   ├── Impact.astro               # Four metrics
│   ├── Projects.astro             # Five native case disclosures
│   ├── TechStack.astro            # Five stack categories
│   └── Contact.astro              # Portfolio inquiry link and direct contacts
├── i18n/
│   ├── home.ts                    # EN/ES services content
│   ├── en.ts / es.ts              # Portfolio translations (matching keys)
│   └── utils.ts                   # Translation and locale/route helpers
├── lib/inquiry.js                 # Shared validation and origin checks
├── layouts/Layout.astro           # Metadata, theme init, skip link, analytics
├── pages/
│   ├── [...lang]/index.astro      # Builds / and /es/ services pages
│   ├── portfolio/index.astro      # English career portfolio
│   ├── es/portfolio/index.astro   # Spanish career portfolio
│   ├── 404.astro                  # Client-localized terminal-themed 404
│   ├── og-home.png.ts             # Services OG image
│   └── og.png.ts                  # Portfolio OG image
└── styles/
    ├── global.css                 # Shared design system and portfolio styles
    └── home.css                   # Services styles
```

`Terminal.astro` and `ContactModal.astro` remain legacy source files, not rendered page features. Redirects and deployment checks live in `vercel.json`.

---

## Getting Started

**Prerequisites:** Node.js 22 (the project's nvm environment).

```bash
# Install dependencies
npm install

# Copy the env template and add the inquiry variables listed below
cp .env.example .env

# Start dev server → http://localhost:4321
npm run dev

# Production build → dist/
npm run build

# Preview production build locally
npm run preview

# Regenerate both CV PDFs from CV.md / CV-es.md
npm run cv
```

### Environment variables

| Variable | Purpose |
|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | Public Cloudflare managed-widget site key, available at build time; configure the production and preview hostnames you intend to use. |
| `TURNSTILE_SECRET_KEY` | Server-only Siteverify secret. Never put it in client HTML/JS. |
| `RESEND_API_KEY` | Server-only Resend API key. |
| `NOTION_API_TOKEN` | Server-only internal Notion connection token; allow reading, inserting and updating content and grant access only to “Consultas del sitio”. Do not use the agent's MCP OAuth session. |
| `NOTION_DATA_SOURCE_ID` | ID of the table's data source, not its containing database; keep it in server environment configuration rather than browser output. |
| `INQUIRY_FROM_EMAIL` | Sender on a Resend-verified domain (for example, `inquiries@your-verified-domain.example`). |
| `INQUIRY_TO_EMAIL` | Your actual recipient inbox. |
| `INQUIRY_PREVIEW_ORIGIN` | Optional Pages Function binding for exactly one `https://<branch>.<project>.pages.dev` preview origin; do not add a wildcard. Configure a matching Turnstile hostname/secret in that preview environment. |

In Notion, create an internal connection for the same workspace with read, insert and update content capabilities; grant it access **only** to the private “Consultas del sitio” database. Copy its token to `NOTION_API_TOKEN` and that database's **data source** ID to `NOTION_DATA_SOURCE_ID` in the intended server environment settings (Vercel or Cloudflare Pages bindings). This is a separate connection from the MCP login used to create the table. Do not paste tokens into chat or commit them. Add the seven required values to the intended environment; `INQUIRY_PREVIEW_ORIGIN` is optional and is only for an explicitly approved Pages preview. No secret belongs in Git. The old `PUBLIC_WEB3FORMS_KEY` is used only by the unrendered legacy contact modal and is not needed by this endpoint.

---

## Customization

### Contact info

Portfolio contact details live in `src/i18n/en.ts` and `src/i18n/es.ts`; services content lives in `src/i18n/home.ts`, with shared shell copy in `src/i18n/utils.ts`:

```ts
// src/i18n/en.ts  (same keys in es.ts)
'contact.email':        'gianelo1992@gmail.com',
'contact.phone':        '+57 304 358 1365',
'contact.phone.url':    'https://wa.me/573043581365',   // WhatsApp deep-link
'contact.linkedin.url': 'https://linkedin.com/in/gian-barboza',
'contact.github.url':   'https://github.com/gianelo',
```

### Adding/editing translations

Edit portfolio strings in `src/i18n/en.ts` and `src/i18n/es.ts`, keeping keys in parity. Existing `term.*` names still hold portfolio labels, metrics and CTA copy; they do not imply a rendered terminal. Edit both `homeEn` and `homeEs` in `src/i18n/home.ts` for services copy.

### Colors and theme

Design tokens are CSS custom properties in `src/styles/global.css`:

- `:root` — dark mode (the default)
- `html.light` — light backgrounds, foregrounds and semantic text colors; amber action fill stays shared

Keep `src/styles/home.css` aligned with the shared tokens. Both OG generators (`src/pages/og.png.ts` and `src/pages/og-home.png.ts`) use explicit colors rather than CSS variables; synchronize them when changing the palette.

### Sections and CVs

Services section order lives in `src/components/home/Home.astro`. Portfolio section order lives in both `src/pages/portfolio/index.astro` and `src/pages/es/portfolio/index.astro`; keep the locale compositions aligned.

`CV.md` and `CV-es.md` are the CV sources, styled by `cv.css`. After editing them, run `npm run cv` and include both generated `public/gian-barboza-cv*.pdf` files in the reviewed change. Their site links target the respective portfolio routes.

---

## Deployment

Astro builds static HTML/assets into `dist/`; Vercel runs `api/inquiry.js` at `/api/inquiry`, while Cloudflare Pages discovers `functions/api/inquiry.js` and serves the static `dist/` assets. Uploading only `dist/` to a generic static host does **not** provide the function. `vercel.json` applies only on Vercel; the Pages equivalents are in `public/_redirects`, `public/_headers` and `public/_routes.json`.

On Vercel, configure the seven inquiry variables above, grant the Notion connection access to the target database and verify the sender domain in Resend; configure the Turnstile widget's allowed hostnames in Cloudflare. Environment changes require a new deployment. `vercel.json` runs typecheck, unit tests and build-output tests during deployment. After an authorized deployment, submit one genuine inquiry and independently verify **its Notion row, its email status, Resend API acceptance and recipient inbox receipt**; mocked tests or a provider ID alone do not prove delivery. Do not create trial records in the private database without the owner's approval.

Preview builds use `noindex,nofollow`: `Layout.astro` checks Vercel's production flag or Cloudflare Pages' `CF_PAGES_BRANCH=main` at build time. Pages preview URLs also receive `X-Robots-Tag: noindex`; `public/_headers` adds it to the production `*.pages.dev` alias, leaving the custom production domain indexable. Vercel Analytics/Speed Insights are rendered only for Vercel builds, not silently broken on Pages.

### Cloudflare Pages Free: deferred migration

**Vercel (free Hobby plan) remains the production host.** The `feat/cloudflare-pages-inquiry` branch keeps a Cloudflare Pages adapter and the migration plan below for a later decision. Nothing has been deployed to Cloudflare, and no Cloudflare project, DNS record or paid plan has been created or changed. Build and serve locally without real credentials or test rows:

```bash
npm run typecheck
npm run test:build
npx --yes wrangler@4.150.0 pages dev dist --compatibility-date=2026-10-01 --compatibility-flags=nodejs_compat
```

If Wrangler starts, visit `/`, `/es/`, `/portfolio/`, `/es/portfolio/` on `http://localhost:8788`. On this development host, direct runs failed during bundling because they consulted an unrelated ancestor Yarn PnP manifest; a no-save install inside the project also failed in npm's peer resolver. **Yarn was not run or adopted.** An owner-authorized, temporary copy of only `dist/`, `functions/`, `api/inquiry.js`, `src/lib/inquiry.js` and `package.json` under `/tmp/giandev-pages-smoke`, with Wrangler installed there using npm, did start the Pages runtime: all four static routes returned 200, `GET /api/inquiry` returned 405 and a POST with mismatched target/Origin returned 403. The server and copy were removed. This proves local routing and a negative API boundary, **not** Turnstile/Notion/Resend delivery or a deployed Pages environment. `tests/pages-inquiry.test.ts` exercises the provider logic with fake responses. Local browser submissions intentionally cannot deliver: the production origin policy rejects localhost, and no server secrets are supplied. An actual Pages preview later needs explicit authorization, server-only bindings, a valid Turnstile widget for its exact hostname, and `INQUIRY_PREVIEW_ORIGIN`; no wildcard origin is allowed. Configure the Pages project's production and preview compatibility date at least `2026-10-01` with Node.js compatibility so `node:crypto` matches this local smoke command. Do not use the agent's Notion MCP OAuth token or create a trial row without approval.

Before any public release, keep the account on **Workers Free and zone WAF Free** (no paid plan or usage overages). `public/_routes.json` invokes the Function only for `/api/inquiry`; all other routes remain static and do not use the shared 100,000 Functions/Workers requests-per-day quota. In the Pages project, set **Settings → Runtime → Fail open / closed → Fail closed**: exhausted Function quota should return an error instead of bypassing server validation. Configure the one Free WAF rate-limiting rule for the `/api/inquiry` path per IP, review its 10-second threshold and security events, and confirm the custom domain is proxied through Cloudflare. The Free rule does not guarantee protection against distributed traffic. A custom-domain WAF does **not** cover the public `*.pages.dev` aliases: the Function rejects requests whose target origin does not match their `Origin` (including attempts to spoof the custom domain on an alias), and the shared handler only accepts configured origins, but this is not a substitute for testing alias reachability on the real runtime. An explicitly enabled preview origin remains publicly reachable; protect/limit it separately or leave production provider credentials out of preview. Verify both aliases and the custom domain before any public release. None of those account settings is applied by this branch. Domain renewal, Notion and Resend quotas remain separate.

Before switching DNS, verify the four routes, `/en/*` redirects, CV download headers, canonical/hreflang/indexing, form errors, Notion row and notification (using an approved genuine inquiry), and rollback to the current host. Deployment, DNS edits and paid subscriptions require a separate owner decision.

#### Migration plan (not started)

Each step needs its own owner decision; none has been performed.

1. **Review the branch.** Re-run `npm run test:all` and evaluate the open `npm audit` advisory for the installed Astro version before publishing anything.
2. **Create a Pages Free project without the custom domain.** Workers & Pages → Create application → Pages → Import an existing Git repository. Use this branch as the test project's production branch, build command `npm run build`, output directory `dist`. This publishes a public `*.pages.dev` URL; do not add provider secrets yet.
3. **Configure runtime and spending limits.** Settings → Functions → Compatibility: `nodejs_compat`, compatibility date `2026-10-01` or later, for both Production and Preview. Settings → Runtime → Fail open / closed → **Fail closed**. Stay on Workers Free; do not enable Workers Paid.
4. **Protect public routes.** Add the zone's one Free WAF rate-limiting rule for `/api/inquiry` per IP. It does not cover `*.pages.dev`; check alias and preview reachability and disable automatic preview builds (Settings → Builds & deployments → Branch control) unless needed.
5. **Configure providers.** Create a server-side Notion connection limited to “Consultas del sitio”, verify the Resend sending domain, and add the variables listed above under Settings → Variables and Secrets (encrypted) per environment. Allow the exact test hostname in the Turnstile widget.
6. **Validate before moving traffic.** Check routes, redirects, CV headers and indexing on the Pages URL. With approval, submit one genuine inquiry and independently confirm the Notion row, Resend acceptance and inbox receipt.
7. **Cut over last.** Merge to `main` only once Vercel will not serve the new form without its variables. Switch the Pages production branch to `main`, add `gianbarboza.com` under Custom domains, keep the previous Vercel DNS values for rollback, and re-create the `www` → apex redirect that Vercel provides today.

Pages Functions run on Workers and count toward the same Workers Free daily request quota. If the migration later targets a **Workers project with static assets** instead of Pages, `functions/` routing, `_routes.json` and the Pages dashboard settings above do not carry over unchanged; re-evaluate the adapter at that time.

### Verification

```bash
npm run typecheck
npm run test
npm run test:build
npm run build
```

See [`odd/tasks/bilingual-services-homepage.md`](odd/tasks/bilingual-services-homepage.md) for implementation intent and verification history. [`AGENTS.md`](AGENTS.md) retains role, content and Git conventions, but some architecture notes describe the older landing page; use the current routes and source above for this implementation.

---

## Contact

- **Email:** gianelo1992@gmail.com
- **WhatsApp:** +57 304 358 1365
- **LinkedIn:** [linkedin.com/in/gian-barboza](https://linkedin.com/in/gian-barboza)
- **GitHub:** [github.com/gianelo](https://github.com/gianelo)
