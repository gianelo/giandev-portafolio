# Gian Barboza — Services and portfolio

Bilingual independent engineering services at `/` and `/es/`; the career portfolio remains at `/portfolio/` and `/es/portfolio/`. `/en/` redirects to `/`.

**Live URL:** [gianbarboza.com](https://gianbarboza.com)

---

## Inquiry delivery

The services form posts to `/api/inquiry`, a Vercel serverless function. The server verifies a Cloudflare Turnstile token before asking Resend to send a plain-text project inquiry. `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` stay server-side; `PUBLIC_TURNSTILE_SITE_KEY` is intentionally public. The old browser-side Web3Forms `ContactModal.astro` remains source-only and is not rendered.

The endpoint retains server-side input, origin and size validation, a honeypot and a two-second timing guard. Missing configuration fails closed with 503; invalid Turnstile tokens or failed provider calls never show a success message. The form retains entered details on failure. If a provider response is lost, acceptance is **unknown**, so the form says it may already have been sent; retries of the same inquiry use a stable Resend idempotency key to avoid duplicate messages within the provider's idempotency window. A success response means Resend accepted the request, **not** that it reached the recipient's inbox. Do not log inquiry contents or credentials. Resend requires a verified sending domain and an API key; Turnstile needs a managed widget with the site key and secret key configured for every intended hostname. Set the variables in the intended Vercel environment (Production and any Preview you test), redeploy, then test an actual inquiry and verify inbox receipt and provider retention. Local `astro dev` serves the static frontend but not the Vercel function; build/unit tests with mocked providers are not live delivery confirmation.

Role copy on the career pages follows the single full title documented in [`AGENTS.md`](AGENTS.md).

---

## Stack

| Tool | Version | Purpose |
|---|---|---|
| [Astro](https://astro.build) | 6.x | Static site framework |
| Inter Tight + JetBrains Mono | — | Approved variable font assets, self-hosted in `public/fonts/` |
| [satori](https://github.com/vercel/satori) + resvg | — | Generates portfolio `og.png` and services `og-home.png` at build time |
| `@astrojs/sitemap` | 3.x | Sitemap generation |
| Vercel Analytics + Speed Insights | 2.x | Traffic and Core Web Vitals |
| [Resend](https://resend.com) + [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) | — | Server-side inquiry email and abuse challenge |
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
- **Inquiry form** — server validation, honeypot, timing guard and server-verified Turnstile; no simulated delivery or success before provider acceptance
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
| `INQUIRY_FROM_EMAIL` | Sender on a Resend-verified domain (for example, `inquiries@your-verified-domain.example`). |
| `INQUIRY_TO_EMAIL` | Your actual recipient inbox. |

Add these values to the local environment for testing and to Vercel for each target environment; no values or secrets belong in Git. The old `PUBLIC_WEB3FORMS_KEY` is used only by the unrendered legacy contact modal and is not needed by the new inquiry endpoint.

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

Astro builds static HTML/assets into `dist/`; Vercel separately runs `api/inquiry.js` at `/api/inquiry`. Deploying only `dist/` to a static host does **not** provide inquiry delivery or the redirects in `vercel.json`. Another host requires an equivalent server endpoint and redirect configuration.

On Vercel, configure the five inquiry variables above and verify the sender domain in Resend; configure the Turnstile widget's allowed hostnames in Cloudflare. Environment changes require a new deployment. `vercel.json` runs typecheck, unit tests and build-output tests during deployment. Verify Resend API acceptance **and recipient inbox receipt** after deployment; passing build checks or receiving an API id is not evidence of final delivery.

Preview deploys use `noindex,nofollow` — `Layout.astro` checks `VERCEL_ENV` so only production gets indexed.

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
