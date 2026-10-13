# Gian Barboza — Services and portfolio

Bilingual independent engineering services at `/` and `/es/`; the career portfolio remains at `/portfolio/` and `/es/portfolio/`. `/en/` redirects to `/`.

**Live URL:** [gianbarboza.com](https://gianbarboza.com)

---

## Inquiry delivery

The services form posts to `/api/inquiry`, a Vercel serverless function. It reuses the already configured **`PUBLIC_WEB3FORMS_KEY`** via `process.env.PUBLIC_WEB3FORMS_KEY` on the server. No new key or separate `WEB3FORMS_KEY` is required. Web3Forms access keys are public by provider design, but the new homepage does not embed this key in its HTML or client bundle. The legacy `ContactModal.astro` source retains its old variable reference but is not rendered.

Without `PUBLIC_WEB3FORMS_KEY` the endpoint returns 503, even if `WEB3FORMS_KEY` is set; the form retains entered data and shows failure. The server validates input, checks origin and body size, rejects the honeypot and submissions under two seconds, then forwards to Web3Forms. Success appears only after Web3Forms confirms acceptance. Do not log inquiry content. Confirm that the existing variable is available to the function in the intended Vercel environment (Production/Preview); redeploy if environment configuration changes. Local `astro dev` serves the static frontend but not the Vercel function: use a Vercel-compatible local runtime to test end-to-end delivery. Production delivery has not been tested; build/unit tests and mocked provider acceptance are not delivery confirmation. Review privacy/retention with the provider before launch.

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
| [Web3Forms](https://web3forms.com) | — | Inquiry provider, called by the Vercel `/api/inquiry` function |
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
- **Inquiry form** — server validation, honeypot and timing guard; no simulated delivery or success before provider acceptance
- **SEO** — Person + WebSite JSON-LD, page-specific canonical/hreflang links, separate services/portfolio OG images, sitemap and preview `noindex`
- **Accessibility** — skip link, visible keyboard focus, native disclosures, form error summary/status and reduced-motion handling; no rendered contact modal

---

## Project Structure

```text
api/inquiry.js                     # Vercel function → Web3Forms
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

# Copy the env template and fill in your Web3Forms key
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
| `PUBLIC_WEB3FORMS_KEY` | Existing Web3Forms access key, reused on the server by `/api/inquiry`; no new key required. Public by provider design, but not embedded in the new homepage/client bundle. Protection includes server validation, honeypot, timing guard, and provider rate limiting. |

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

On Vercel, ensure the existing `PUBLIC_WEB3FORMS_KEY` is available to the function. `vercel.json` runs typecheck, unit tests and build-output tests during deployment. Verify actual provider acceptance after deployment; passing these checks is not evidence of live delivery.

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
