# Gian Barboza – Portfolio

Personal portfolio landing page for Gian Barboza, Senior Backend Engineer with 10+ years of experience building payment platforms, distributed systems, fraud detection, and AI-assisted software.

**Live URL:** [gianbarboza.com](https://gianbarboza.com)

---

## ⚠️ Before editing any role copy

The site runs **two deliberate layers** of positioning:

- **SEO / machine layer** (`meta.title`, `meta.description`, `meta.h1.role`, JSON-LD `jobTitle`, the CVs) → **"Senior Backend Engineer"**, the term recruiters actually search for
- **Marketing / human layer** (hero, terminal, CTA, OG image) → **"Software Engineer"** specialized in payment platforms, distributed systems and AI-assisted development

Seeing "Software Engineer" in the hero and "Senior Backend Engineer" in the `<title>` is **not an inconsistency — it's the strategy.** Don't unify them.

Full breakdown of which string belongs to which layer: [`AGENTS.md` → Posicionamiento de Marca](AGENTS.md#-posicionamiento-de-marca--estrategia-híbrida).

---

## Stack

| Tool | Version | Purpose |
|---|---|---|
| [Astro](https://astro.build) | 6.x | Static site framework |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Installed via `@tailwindcss/vite`; residual use only (see note) |
| Inter Tight + JetBrains Mono | 5.x | Variable fonts, self-hosted via Fontsource |
| [satori](https://github.com/vercel/satori) + resvg | — | Generates `og.png` (1200×630) at build time |
| `@astrojs/sitemap` | 3.x | Sitemap generation |
| Vercel Analytics + Speed Insights | 2.x | Traffic and Core Web Vitals |
| [Web3Forms](https://web3forms.com) | — | Contact form endpoint (no backend) |
| Vanilla JS | — | Theme toggle, live clock, observers, counters, modal |

> **Note on Tailwind:** the terminal redesign moved styling to plain CSS with custom properties in `src/styles/global.css`. Tailwind is still installed and a few utilities remain in `ContactModal.astro`, but there is no `@theme` block. Prefer plain CSS with the design tokens for new styles.

---

## Features

- **Terminal-inspired dark design** — "Linear-meets-terminal": mono type for metadata, generous space, amber accent
- **Dark / light mode** — dark by default, persists to `localStorage`, no flash on load (inline script in `<head>`)
- **i18n** — English at `/` and `/en/`, Spanish at `/es/`. All copy lives in `src/i18n/`, never hardcoded in components
- **Live clock** — Bogotá time (GMT-5) in the nav, updated every 30s
- **Animated counters** — impact metrics count up on scroll, with deterministic SVG sparklines behind them
- **Case study accordion** — four production systems, expandable to context / problem / decision / result
- **Contact modal** — Web3Forms POST with honeypot, timing guard, focus trap, and `inert` background
- **SEO** — JSON-LD `@graph` (Person + WebSite), hreflang, canonical normalization, dynamic OG image, auto `noindex` on preview deploys
- **Accessibility** — skip link, focus trap, `:focus-visible`, ARIA state, full `prefers-reduced-motion` support
- **Fully static** — zero JS frameworks, fast build, deployable anywhere

---

## Project Structure

```
src/
├── components/
│   ├── Nav.astro            # Sticky nav, live GMT-5 clock, theme toggle, lang switcher
│   ├── Hero.astro           # Name, tagline, CTAs + terminal block
│   ├── Terminal.astro       # Decorative ASCII terminal (aria-hidden, i18n)
│   ├── Timeline.astro       # #journey — 4 career milestones
│   ├── Impact.astro         # #impact — 4 metrics with animated counters
│   ├── Sparkline.astro      # Deterministic SVG sparkline
│   ├── Projects.astro       # #cases — 4 case studies, accordion
│   ├── TechStack.astro      # #stack — 4 categories with tag pills
│   ├── Contact.astro        # #contact — CTA + footer
│   ├── ContactModal.astro   # Form → Web3Forms, focus trap, anti-bot
│   └── SectionHeading.astro # Shared label + title + subtitle
├── i18n/
│   ├── en.ts                # All English strings
│   ├── es.ts                # All Spanish strings (same keys)
│   └── utils.ts             # getLangFromUrl(), useTranslations()
├── layouts/
│   └── Layout.astro         # HTML shell, meta/OG, JSON-LD, theme init, scroll observer
├── pages/
│   ├── index.astro          # Renders English directly (not a redirect)
│   ├── en/index.astro       # English landing page
│   ├── es/index.astro       # Spanish landing page
│   ├── 404.astro            # Terminal-themed 404, language resolved client-side
│   └── og.png.ts            # Builds the Open Graph image
└── styles/
    └── global.css           # Design tokens, light variant, layout, all component styles
```

---

## Getting Started

**Prerequisites:** Node.js 18+ (project uses Node 22 via nvm)

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
| `PUBLIC_WEB3FORMS_KEY` | Contact form access key. Public by design — protection comes from the honeypot, timing guard, and Web3Forms rate limiting |

---

## Customization

### Contact info

All contact data lives in the i18n files — no hardcoded values in components:

```ts
// src/i18n/en.ts  (same keys in es.ts)
'contact.email':        'gianelo1992@gmail.com',
'contact.phone':        '+57 304 358 1365',
'contact.phone.url':    'https://wa.me/573043581365',   // WhatsApp deep-link
'contact.linkedin.url': 'https://linkedin.com/in/gian-barboza',
'contact.github.url':   'https://github.com/gianelo',
```

### Adding/editing translations

Edit string values in `src/i18n/en.ts` or `src/i18n/es.ts`. Keys must match between both files. Keys prefixed `term.*` hold copy specific to the terminal design (numbered section labels, case metrics, CTA, footer).

### Colors and theme

Design tokens are CSS custom properties in `src/styles/global.css`:

- `:root` — dark mode (the default)
- `html.light` — light mode overrides only the neutral tokens; accent, green, and red stay the same

Changing the palette means editing those two blocks — components don't need touching. **One exception:** `src/pages/og.png.ts` uses satori, which can't read CSS variables, so its hex colors must be updated by hand to stay in sync.

### Sections order

Each page (`src/pages/index.astro`, `en/index.astro`, `es/index.astro`) imports and renders the components in order. Reorder or remove components in all three.

---

## Deployment

The build output is a static folder (`dist/`). Currently deployed on Vercel with a custom domain, but it works on any static host:

| Host | Notes |
|---|---|
| Vercel | Current setup. Set `PUBLIC_WEB3FORMS_KEY` in project env vars |
| Netlify | Connect repo → auto build on push |
| GitHub Pages | Upload `dist/` via GitHub Actions |
| DigitalOcean App Platform | Build cmd: `npm run build`, output: `dist/` |

Preview deploys are automatically served with `noindex,nofollow` — `Layout.astro` checks `VERCEL_ENV` so only production gets indexed.

---

## Contact

- **Email:** gianelo1992@gmail.com
- **WhatsApp:** +57 304 358 1365
- **LinkedIn:** [linkedin.com/in/gian-barboza](https://linkedin.com/in/gian-barboza)
- **GitHub:** [github.com/gianelo](https://github.com/gianelo)
