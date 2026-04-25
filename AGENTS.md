# AGENTS.md — Contexto del Proyecto

## ¿Qué es este proyecto?

Landing page personal de **Gian Barboza**, Senior Backend Engineer con 10+ años de experiencia. El objetivo principal es **conseguir trabajo remoto** como Backend / Platform Engineer. No es un blog ni un portafolio de diseño — es un pitch profesional estático, rápido y enfocado en conversión.

**Producción**: [https://gianbarboza.com](https://gianbarboza.com) (custom domain en Vercel, apex como canonical, `www` redirige con 308).

---

## Stack Técnico

| Herramienta                     | Versión   | Uso                                                                 |
|---------------------------------|-----------|---------------------------------------------------------------------|
| Astro                           | 5.x       | Framework de sitio estático                                         |
| Tailwind CSS                    | 4.x       | Estilos utility-first (con `@theme` para overrides)                 |
| `@astrojs/sitemap`              | 3.x       | Genera `sitemap-index.xml` automáticamente al build                 |
| `@fontsource-variable/onest`    | 5.x       | Onest Variable como única fuente del proyecto                       |
| `astro:assets` + `<Image>`      | built-in  | Optimización automática de imágenes (foto Hero → WebP)              |
| `@vercel/analytics`             | 2.x       | Web Analytics (componente `<Analytics />` en `Layout.astro`)        |
| `satori` + `@resvg/resvg-js`    | —         | Genera `og.png` (1200×630) al build vía `src/pages/og.png.ts`       |
| Web3Forms                       | —         | Endpoint externo del form de contacto (POST sin SDK)                |
| md-to-pdf (via npx)             | —         | Genera `public/gian-barboza-cv.pdf` desde `CV.md`                   |
| Vanilla JS                      | —         | Theme toggle, scroll observer, modal — sin frameworks JS            |
| Node.js                         | 22 (nvm)  | Entorno de desarrollo                                               |

Build output: carpeta `dist/` (100% estático, sin servidor).

---

## Comandos

```bash
npm run dev       # Dev server → http://localhost:4321
npm run build     # Build de producción → dist/
npm run preview   # Preview del build
npm run cv        # Regenera public/gian-barboza-cv.pdf desde CV.md
```

---

## Arquitectura de la página

### Secciones (en orden de render)

**Orden de secciones**: `Hero → Timeline (Journey) → Impact (Key Impact) → Projects (Case Studies) → TechStack (Technical Expertise) → Contact`

Decisión: el portfolio enfoca en **dónde trabajó y qué hizo** — Leadership fue removido (Hero → Timeline → Impact → Projects → TechStack → Contact). El recorrido laboral va antes que las métricas para que el lector vea el contexto antes de los números.

| Componente             | Sección     | Descripción                                                                        |
|------------------------|-------------|------------------------------------------------------------------------------------|
| `Nav.astro`            | Nav         | Sticky, theme toggle, language switcher (EN/ES), pill scrolled-state               |
| `Hero.astro`           | Hero        | Foto real (`<Image>`), nombre + subtítulo + 5 pills (Contact, CV, LinkedIn, GitHub, WhatsApp) |
| `Timeline.astro`       | Timeline    | Recorrido laboral (4 hitos, reciente primero) con dot + accent color por período   |
| `Impact.astro`         | Impact      | 4 métricas: 10+ años, 99.9% uptime, $200K+/mes, 5+ procesadores                    |
| `Projects.astro`       | Projects    | 4 case studies con bloques Contexto / Problema / Decisión Técnica / Resultado      |
| `TechStack.astro`      | Stack       | 4 categorías con pills: Backend, Infra, Payments, AI                               |
| `Contact.astro`        | Contact     | CTA abre modal + 4 pills (CV, WhatsApp, LinkedIn, GitHub)                          |
| `ContactModal.astro`   | —           | Modal con form (name/email/message) → Web3Forms. Honeypot + timing anti-bot        |
| `SectionHeading.astro` | —           | Heading compartido: título + bar amarillo + subtítulo opcional. **Sin emoji**      |
| `SocialPill.astro`     | —           | Pill usable como `<a>`. Acepta `download` y atributos `data-*` via rest props      |
| `Badge.astro`          | —           | Pill amarillo del Hero ("Available for remote work") con dot pulsante              |
| `Starfield.astro`      | —           | 35 estrellas DOM con twinkle independiente, fixed-position, solo en dark mode      |

### Flujo de páginas

```
/        → renderiza inglés directamente (sin redirect)
/en/     → Landing en inglés (canonical apunta a /, no a sí misma)
/es/     → Landing en español (canonical = /es/)
```

- `src/pages/index.astro` renderiza el HTML de inglés directamente — **no es un redirect**, es la página completa
- `getLangFromUrl()` devuelve `'en'` por defecto cuando la URL es `/`
- En `Layout.astro` el canonical normaliza `/en/*` → `/` para evitar contenido duplicado en SEO

### ⚠️ NO agregar bloque `i18n` en `astro.config.mjs`

El proyecto maneja i18n manualmente. Si se agrega el bloque `i18n` con `prefixDefaultLocale: true`, Vercel intercepta `/` y fuerza un redirect a `/en/`. El `astro.config.mjs` debe tener **solo** Tailwind + sitemap:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gianbarboza.com',
  integrations: [
    sitemap({ filter: (page) => !page.includes('/en/') }),  // /en/ excluido (duplica /)
  ],
  vite: { plugins: [tailwindcss()] }
});
```

---

## Sistema de Paleta (palette swap architecture)

`src/styles/global.css` tiene un bloque comentado **PALETTE SYSTEM** que es la single source of truth.

### Roles de color

| Rol            | Tailwind tokens mapeados        | Uso                                                |
|----------------|---------------------------------|----------------------------------------------------|
| **Primary**    | `yellow-*` (vía `@theme`)       | Brand color: CTAs, pills, badge, focus ring, bio strong |
| **Secondary**  | `indigo-*` (vía `@theme`)       | Supporting accent: subtítulo Hero, hover states secundarios |
| **Categorical**| `violet-*`, `blue-*`, `emerald-*`, `amber-*`, `red-*` | Timeline eras, Projects case studies, Impact métricas — **se quedan stock** |
| **Semantic**   | `emerald` (success), `red` (error) | Form states — significado universal               |
| **Neutral**    | `zinc-*`                         | Texto, borders, card backgrounds                   |

### Para cambiar de paleta

Editar **solo dos bloques** en `global.css`:
- `:root { --pal-primary-* / --pal-secondary-* / --pal-bg / --pal-fg / --pal-glow / --pal-bio-strong }` (light mode)
- `.dark { ...mismo set... }` (dark mode)

Los componentes no se tocan porque el `@theme` re-mapea Tailwind tokens a las CSS vars.

### Paleta activa: **Star Wars Crawl**

- Primary = Crawl yellow `#FFE81F` (oficial Lucasfilm)
- Secondary = Sable blue (`#1e3a8a` light / `#60a5fa` dark)
- Light bg `#fafaf9` / Dark bg `#000000` (negro puro)

---

## Sistema de Fuentes

**Solo Onest Variable** está cargada (`@fontsource-variable/onest`). No hay display ni mono. Decisión por simplicidad y cohesión visual — fuentes display (Cinzel, Pathway Gothic) y monospace (Geist Mono) se probaron y descartaron.

`src/components/Hero.astro` y `src/components/SectionHeading.astro` usan `font-bold tracking-tight` — sin clases `font-display` ni `font-mono`.

---

## Starfield (dark mode visual)

`src/components/Starfield.astro` — 35 `<span>` con `position: absolute`, dentro de un contenedor `position: fixed` que cubre el viewport.

- Cada estrella tiene `animation-delay` y `animation-duration` distintos (calculados de forma determinística desde su índice). Twinkle 100% independiente entre estrellas.
- `@keyframes starTwinkle` en `global.css` (opacity 0.3 ↔ 1)
- Solo visible en `.dark` (CSS: `.starfield { display: none }` + `.dark .starfield { display: block }`)
- Respeta `prefers-reduced-motion` — sin twinkle si el usuario lo tiene activado, estrellas quedan a opacity 0.7
- Fixed-position → no scrollean con el contenido (efecto parallax / "viajás por el espacio")
- `STAR_COUNT` en el componente para ajustar cantidad

---

## Decisiones de Diseño / Convenciones

### Sin emojis
**Decisión**: el portfolio no usa emojis en headings, cards ni copy. Se removieron todos en una pasada (incluyendo SectionHeading que ya no acepta prop `emoji`). Razones:
- Inconsistencia entre plataformas (Apple/Google/Windows/Android renderean distinto)
- Vibe casual/tutorial vs senior engineer
- Compite con la paleta de marca

**Si en el futuro hace falta iconografía**, usar **SVG icons inline** (ej. Lucide-style line icons) con `currentColor` para que sigan la paleta.

### Animaciones
- `animate-hero`, `animate-hero-delay-1/2/3` — entrada del Hero
- `reveal`, `reveal-delay-1/2/3/4` — secciones via IntersectionObserver en `Layout.astro`. El observer **unobserva** cada elemento tras marcarlo visible.

### Tema
Dark/light mode con clase `dark` en `<html>`, persiste en `localStorage`. **Dark por default en primera visita**.

### IDs de sección
`#impact`, `#timeline`, `#stack`, `#projects`, `#contact` — usados por la nav y CTAs.

### Modal de contacto
Cualquier elemento con `data-open-contact` dispara el modal. El script de `ContactModal.astro` hace `preventDefault()` sobre clicks.

### Sin JS framework
Vanilla JS puro vía `<script is:inline>`.

### Cards bg pattern
Cards usan `bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800`. Light mode card bg = body bg (idéntico) — los cards se distinguen por el border. En dark, zinc-900/60 sobre body negro deja ver el card como ligeramente más claro.

---

## Sistema de i18n

**Regla clave**: todo el contenido textual vive en los archivos de traducción, **nunca hardcodeado en componentes**.

- `src/i18n/en.ts` — Strings en inglés
- `src/i18n/es.ts` — Strings en español (mismas keys)
- `src/i18n/utils.ts` — `getLangFromUrl()`, `useTranslations()`

Los componentes reciben `t` como prop y llaman `t('key')` para obtener texto.

### Keys notables
- `meta.title` — el `<title>` del documento (también og:title y twitter:title). 50-60 chars óptimo para SEO
- `hero.bio` — bio HTML con `<strong>` tags (renderizado vía `set:html`)
- `cta.cv.url` = `/gian-barboza-cv.pdf` — link al CV PDF (Hero pill + Contact pill)

### Nav — Language Switcher
- En `/` o `/en/` → muestra botón **ES** → lleva a `/es/`
- En `/es/` → muestra botón **EN** → lleva a `/en/`
- Hover del botón usa primary color (sigue paleta)

---

## Perfil del Dueño (Gian Barboza)

- **Rol objetivo**: Senior Backend Engineer / Platform Engineer
- **Modalidad**: Remote-first, full-time
- **Ubicación**: Rionegro, Antioquia, Colombia
- **Idiomas**: Español (nativo) · Inglés B2 (Upper-intermediate)
- **Educación**: Ingeniero en Informática — Universidad Dr. Rafael Belloso Chacín (URBE), 2011–2015
- **Experiencia clave**:
  - Ex-CTO, 10+ años en producción
  - Sistemas distribuidos (8-server cluster, HAProxy, MySQL Replication) — 99.9% uptime desde 2019
  - Pagos: Stripe, PayPal, DLocal, Shift4, Payeezy, PCI Compliance
  - Fraude: motor de reglas con Factory + SRP + device fingerprinting
  - SEO programático: miles de landings generadas con ChatGPT-4o
- **Stack principal**: Node.js, TypeScript, Next.js, PHP, Java, REST API, Design Patterns, Clean Architecture
- **Contacto**:
  - Email: `gianelo1992@gmail.com`
  - WhatsApp: `+57 304 358 1365` / `https://wa.me/573043581365`
  - LinkedIn: `https://linkedin.com/in/gian-barboza`
  - GitHub: `https://github.com/gianelo`

---

## Estructura de Archivos

```
.
├── CV.md                          ← Fuente de verdad del CV
├── public/
│   ├── favicon.svg
│   ├── robots.txt                 ← User-agent + Sitemap URL
│   └── gian-barboza-cv.pdf        ← Generado por `npm run cv`
├── src/
│   ├── assets/
│   │   ├── fonts/inter-400.ttf    ← Usado por og.png.ts (satori)
│   │   └── profile.jpg            ← Foto Hero, optimizada por <Image>
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── Impact.astro
│   │   ├── Timeline.astro
│   │   ├── TechStack.astro
│   │   ├── Projects.astro
│   │   ├── Contact.astro
│   │   ├── ContactModal.astro
│   │   ├── SectionHeading.astro   ← Sin prop emoji
│   │   ├── SocialPill.astro
│   │   ├── Badge.astro
│   │   └── Starfield.astro        ← Dark-mode starfield
│   ├── i18n/
│   │   ├── en.ts                  ← EDITAR AQUÍ contenido en inglés
│   │   ├── es.ts                  ← EDITAR AQUÍ contenido en español
│   │   └── utils.ts
│   ├── layouts/
│   │   └── Layout.astro           ← HTML shell, OG/Twitter meta, theme script,
│   │                                scroll observer, <Analytics />, <Starfield />
│   ├── pages/
│   │   ├── index.astro            ← Renderiza inglés directamente (NO redirect)
│   │   ├── en/index.astro
│   │   ├── es/index.astro
│   │   └── og.png.ts              ← Genera OG image al build (satori + resvg)
│   └── styles/
│       └── global.css             ← Tailwind, dark variant, PALETTE SYSTEM,
│                                    starfield CSS, animaciones
├── .env.example                   ← Plantilla; `.env` es gitignored
└── AGENTS.md                      ← Este archivo
```

---

## SEO

### Sitemap + robots.txt
- `@astrojs/sitemap` genera `dist/sitemap-index.xml` y `dist/sitemap-0.xml` al build
- `filter: (page) => !page.includes('/en/')` excluye `/en/*` porque `/` ya sirve el contenido en inglés (evita URLs duplicadas)
- `public/robots.txt` apunta al sitemap: `Sitemap: https://gianbarboza.com/sitemap-index.xml`

### Open Graph + Twitter Card
- Meta tags en `Layout.astro` con `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:image:width/height`, `og:locale`, `twitter:card=summary_large_image`
- OG image **dinámico** generado por `src/pages/og.png.ts` con `satori` (renders SVG from JSX-like) + `@resvg/resvg-js` (rasteriza a PNG)
- Salida: `dist/og.png` (1200×630, ~136 KB)
- Incluye CTA "View Portfolio →" + URL `gianbarboza.com` + tech pills

### Canonical
- Cada página declara `<link rel="canonical" href={canonicalUrl} />` y `<meta property="og:url">`
- `Layout.astro` normaliza `/en/*` → `/` para que `/` y `/en/` no compitan como canonical (mismo contenido)
- En el sitemap solo aparecen `/` y `/es/`

### Pendiente
- Submit del sitemap a [Google Search Console](https://search.google.com/search-console) (property `gianbarboza.com`)

---

## CV / Resume flow

- `CV.md` en la raíz es la **fuente de verdad** del CV (1-2 páginas, bullets outcome-first)
- `npm run cv` corre `npx --yes md-to-pdf CV.md && mv CV.pdf public/gian-barboza-cv.pdf`
  - **Nota**: `md-to-pdf` removió el flag `--dest-dir` en versiones recientes; el script genera el PDF en root y lo mueve a public/
- El PDF se sirve en `/gian-barboza-cv.pdf` (público)
- Los pills "Download Resume / Descargar CV" del Hero y del Contact apuntan a la key `cta.cv.url`
- Después de editar `CV.md`, correr `npm run cv` **y commitear el PDF** para que Vercel lo sirva actualizado

---

## Formulario de contacto

- `ContactModal.astro` postea a `https://api.web3forms.com/submit`
- El CTA del Contact y el pill de email del Hero disparan el modal via `[data-open-contact]`
- **Protecciones anti-bot**:
  - Honeypot (`botcheck` checkbox oculto — Web3Forms descarta si viene marcado)
  - Timing guard (`openedAt` — rechaza submits en <2 segundos)
  - HTML5 `required` + `type="email"` + `maxlength`
  - `subject` y `from_name` hardcoded en hidden inputs
- Constantes nombradas: `BOT_MIN_OPEN_MS`, `CLOSE_ANIM_MS`, `SUCCESS_CLOSE_DELAY_MS`
- Akismet de Web3Forms a veces marca como spam mensajes cortos/genéricos con email pattern fake — comportamiento esperado, configurable en el dashboard de Web3Forms

---

## Env Vars

| Variable                 | Uso                                                | Dónde va                                                  |
|--------------------------|----------------------------------------------------|-----------------------------------------------------------|
| `PUBLIC_WEB3FORMS_KEY`   | Access key del formulario de contacto (Web3Forms)  | `.env` local + Vercel (Production + Preview + Development)|

- `.env` está gitignored; `.env.example` se sube al repo como plantilla
- La key es pública por diseño (se postea desde el browser). Protección real = honeypot + timing check + rate limit de Web3Forms
- En Vercel: Settings → Environment Variables → agregar `PUBLIC_WEB3FORMS_KEY` con el valor real, en los 3 scopes
- **IMPORTANTE**: cuando cambias una env var en Vercel, el deploy actual NO se actualiza — hay que hacer Redeploy o disparar un nuevo commit

### Vercel Web Analytics
- Paquete `@vercel/analytics` ya instalado; `<Analytics />` renderizado en `Layout.astro`
- El script solo registra eventos cuando **Web Analytics está habilitado**: Vercel → proyecto → Analytics → **Enable Web Analytics**
- Free tier: 2,500 eventos/mes (Hobby plan)

### Vercel Domain Setup (gianbarboza.com)
- Comprado en Cloudflare Registrar (DNS también en Cloudflare)
- Apex `gianbarboza.com` → Production Domain en Vercel
- `www.gianbarboza.com` → Redirect 308 a apex
- DNS records en Cloudflare con **proxy gris (DNS only)** — no naranja, sino choca con SSL de Vercel
- SSL emitido automáticamente por Vercel

---

## Filosofía de Cambios

- Cambios de **contenido** → solo editar `src/i18n/en.ts` y `src/i18n/es.ts`
- Cambios de **layout/diseño** → editar el componente `.astro` correspondiente
- Cambios de **paleta** → editar solo el bloque PALETTE SYSTEM en `global.css`
- **No crear archivos nuevos** si no es estrictamente necesario
- **No agregar JS frameworks** — mantener Vanilla JS
- **Mantener paridad de keys** entre `en.ts` y `es.ts` siempre
- **No agregar emojis** — usar SVG inline si hace falta iconografía

---

## Flujo de Git

- El dueño siempre audita el código antes de hacer commit o push
- **No agregar `Co-Authored-By` de ninguna IA en los commits** — autoría exclusiva del desarrollador
- `.claude/` está en `.gitignore` (config local de Claude Code, no se trackea)
- `AGENTS.md` y `CLAUDE.md` sí se suben al repo (documentación del proyecto)
