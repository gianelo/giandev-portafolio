# Gian Barboza – Portfolio

Personal portfolio landing page for Gian Barboza, Senior Backend Engineer with 10+ years of experience in distributed systems, payments, fraud detection, and AI automation.

**Live URL:** _deploy and update this link_

---

## Stack

| Tool | Version | Purpose |
|---|---|---|
| [Astro](https://astro.build) | 5.x | Static site framework |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first styling |
| Vanilla JS | — | Theme toggle + scroll animations |

---

## Features

- **Dark / Light mode** — persists to `localStorage`, no flash on reload
- **i18n** — English (`/en/`) and Spanish (`/es/`), auto-redirect from `/` based on browser language
- **Scroll animations** — Intersection Observer reveals sections as they enter the viewport
- **Hero entrance** — CSS `fadeSlideUp` keyframe animation on page load
- **Fully static** — zero JS frameworks, fast build, deployable anywhere

---

## Project Structure

```
src/
├── components/
│   ├── Nav.astro          # Sticky nav, theme toggle, language switcher
│   ├── Hero.astro         # Full-screen hero with CTAs
│   ├── Impact.astro       # 4 metric cards with scroll reveal
│   ├── TechStack.astro    # Tech categories with pill tags
│   ├── Projects.astro     # 3 project cards with outcomes
│   ├── Leadership.astro   # Two-column leadership section
│   └── Contact.astro      # CTA + email, WhatsApp, LinkedIn, GitHub
├── i18n/
│   ├── en.ts              # All English strings
│   ├── es.ts              # All Spanish strings
│   └── utils.ts           # getLangFromUrl(), useTranslations()
├── layouts/
│   └── Layout.astro       # HTML shell, theme init script, scroll observer
├── pages/
│   ├── index.astro        # Root redirect (JS-based, detects browser language)
│   ├── en/index.astro     # English landing page
│   └── es/index.astro     # Spanish landing page
└── styles/
    └── global.css         # Tailwind import, dark variant, animations
```

---

## Getting Started

**Prerequisites:** Node.js 18+ (project uses Node 22 via nvm)

```bash
# Install dependencies
npm install

# Start dev server → http://localhost:4321
npm run dev

# Production build → dist/
npm run build

# Preview production build locally
npm run preview
```

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

Edit string values in `src/i18n/en.ts` or `src/i18n/es.ts`. Keys must match between both files.

### Sections order

Each locale page (`src/pages/en/index.astro`, `src/pages/es/index.astro`) imports and renders the components in order. Reorder or remove components there.

---

## Deployment

The build output is a static folder (`dist/`). Deploy to any static host:

| Host | Notes |
|---|---|
| Netlify | Connect repo → auto build on push |
| Vercel | `vercel --prod` |
| GitHub Pages | Upload `dist/` via GitHub Actions |
| DigitalOcean App Platform | Build cmd: `npm run build`, output: `dist/` |

---

## Contact

- **Email:** gianelo1992@gmail.com
- **WhatsApp:** +57 304 358 1365
- **LinkedIn:** [linkedin.com/in/gian-barboza](https://linkedin.com/in/gian-barboza)
- **GitHub:** [github.com/gianelo](https://github.com/gianelo)
