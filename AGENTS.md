# AGENTS.md — Contexto del Proyecto

## ¿Qué es este proyecto?

Landing page personal de **Gian Barboza**, ingeniero de software con 10+ años de experiencia. El objetivo principal es **conseguir trabajo remoto** en roles Senior Backend / Software Engineering. No es un blog ni un portafolio de diseño — es un pitch profesional estático, rápido y enfocado en conversión.

**Producción**: [https://gianbarboza.com](https://gianbarboza.com) (custom domain en Vercel, apex como canonical, `www` redirige con 308).

📋 Trabajo abierto y deuda conocida: **[Pendientes](#pendientes)** (al final del archivo).

---

## ⚠️ Posicionamiento de Marca — estrategia híbrida

**Leé esto antes de tocar cualquier texto que mencione un rol.**

La web usa **dos capas deliberadamente distintas**. Si ves "Software Engineer" en el hero y "Senior Backend Engineer" en el `<title>`, **no es una inconsistencia — es la estrategia. No las unifiques.**

### El razonamiento

Gian se posiciona como **Software Engineer** con especialización fuerte en backend, plataformas de pago, arquitectura distribuida y desarrollo asistido por IA. No quiere que lo lean como "PHP Backend Developer", y no quiere que la web gire alrededor de **tecnologías** (PHP, Laravel…) sino del **tipo de problemas que resuelve**.

Pero **"Senior Backend Engineer" es el término que los recruiters buscan**. Sacarlo del SEO costaría tráfico calificado. De ahí las dos capas.

| Capa | Quién la lee | Término |
|------|--------------|---------|
| **SEO / máquina** | Googlebot, ATS, recruiters filtrando | **Senior Backend Engineer** / Ingeniero Backend Senior |
| **Marketing / humano** | El visitante que ya está en la página | **Software Engineer** specialized in… |

### Capa SEO — NO quitar "Backend Engineer" de acá

| Ubicación | Por qué |
|-----------|---------|
| `meta.title` (en/es) | Título en SERP |
| `meta.description` (en/es) | Snippet en SERP |
| **`meta.h1.role`** (en/es) | ⚠️ Se renderiza `sr-only` **dentro del `<h1>`** → invisible al visitante, señal on-page más fuerte. Aunque viva en el hero, es **capa SEO**, no marketing |
| `Layout.astro` → JSON-LD `jobTitle` | Knowledge Graph |
| `Layout.astro` → `knowsAbout: 'Backend Engineering'` | Campo de keywords del schema |
| `Layout.astro` → props `title`/`description` por defecto | Fallback; mantener alineado con `meta.*` |
| `timeline.now.role` (en/es) | Es su **cargo real** en Hablax. Coincide con LinkedIn. Keyword honesta en body copy indexado |
| `term.section.01.title` (en/es) | "Junior dev → CTO → senior backend…" — narrativa indexada que refuerza el término |
| `stack.backend.title` | Nombre de categoría |
| **`CV.md` / `CV-es.md`** | Los ATS parsean literal. Es donde el término más rinde con recruiters |

### Capa marketing — acá va "Software Engineer"

| Ubicación | Nota |
|-----------|------|
| `term.hero.tagline.html` (en/es) | Título del hero: rol + tres dominios de especialización |
| `term.hero.pitch` (en/es) | Subtítulo: la propuesta de valor (problemas de negocio → sistemas confiables) |
| `Terminal.astro` → `term.terminal.*` | Los principios comunican el posicionamiento: **cómo trabaja**, no qué frameworks usa |
| `term.cta.title.html` (en/es) | "Open to Senior Backend & Software Engineering Roles" — híbrido explícito |
| `og.png.ts` → tagline | Texto **dentro de un PNG** → cero valor SEO, los buscadores no lo leen. Es puro lo-que-ve-quien-comparte-el-link |
| `Layout.astro` → easter egg de consola | Mantiene "senior backend engineer" **a propósito**: solo lo ven devs y refuerza el término del recruiter |

### Regla práctica

Antes de cambiar un texto de rol, preguntate: **¿lo lee una persona o una máquina?**
Persona → Software Engineer. Máquina (o invisible, como `sr-only`) → Senior Backend Engineer.

---

## Stack Técnico

| Herramienta                          | Versión  | Uso                                                                 |
|--------------------------------------|----------|---------------------------------------------------------------------|
| Astro                                | 6.x      | Framework de sitio estático                                         |
| `@astrojs/sitemap`                   | 3.x      | Genera `sitemap-index.xml` automáticamente al build                 |
| `@fontsource-variable/inter-tight`   | 5.x      | Inter Tight Variable — fuente sans                                  |
| `@fontsource-variable/jetbrains-mono`| 5.x      | JetBrains Mono Variable — fuente mono (nav, labels, botones, tags)   |
| `@vercel/analytics`                  | 2.x      | Web Analytics (`<Analytics />` en `Layout.astro`)                   |
| `@vercel/speed-insights`             | 2.x      | Core Web Vitals (`<SpeedInsights />` en `Layout.astro`)             |
| `satori` + `@resvg/resvg-js`         | —        | Genera `og.png` (1200×630) al build vía `src/pages/og.png.ts`       |
| Web3Forms                            | —        | Endpoint externo del form de contacto (POST sin SDK)                |
| md-to-pdf (via npx)                  | —        | Genera los PDFs del CV desde `CV.md` / `CV-es.md`                   |
| Vanilla JS                           | —        | Theme toggle, reloj, observers, contadores, modal — sin frameworks  |
| Node.js                              | 22 (nvm) | Entorno de desarrollo                                               |

> **Sin framework de CSS**: el proyecto **no usa Tailwind**. Se removió por completo (dependencias, plugin de Vite y utilidades del modal) porque su único consumidor real era `ContactModal.astro`. Todo el estilado es CSS plano con custom properties en `src/styles/global.css`.
>
> Como Tailwind aportaba su *preflight*, `global.css` incluye ahora un bloque **`Base reset`** que replica lo que hacía falta: `border: 0 solid` en `*`, `font/font-feature-settings/letter-spacing: inherit` en los controles de formulario (sin esto los botones pierden line-height y las ligaduras `ss01/cv11`, y cambian de tamaño), márgenes de headings y `p` en cero, y la utilidad **`.sr-only`** — que la usa el `<h1>` del hero para las keywords de rol. **Si tocás ese bloque, verificá el hero: sin `.sr-only` las keywords se vuelven visibles.**

Build output: carpeta `dist/` (100% estático, sin servidor).

---

## Comandos

```bash
npm run dev       # Dev server → http://localhost:4321
npm run build     # Build de producción → dist/
npm run preview   # Preview del build
npm run cv        # Regenera ambos PDFs del CV (EN desde CV.md, ES desde CV-es.md)
```

---

## Arquitectura de la página

### Secciones (en orden de render)

`Nav → Hero → Timeline (Journey) → Impact → Projects (Case Studies) → TechStack → Contact → Footer`

El recorrido laboral va antes que las métricas para que el lector vea el contexto antes de los números.

| Componente             | Sección  | Descripción                                                                       |
|------------------------|----------|-----------------------------------------------------------------------------------|
| `Nav.astro`            | Nav      | Sticky con backdrop blur. Wordmark + dot verde pulsante + **reloj en vivo GMT-5**, links de sección, switcher EN/ES, theme toggle, CTA de contacto |
| `Hero.astro`           | Hero     | Meta line (Available · ubicación · años), nombre grande, **tagline** (rol + especialización) + **pitch** (propuesta de valor), 4 botones (Contact, Résumé, LinkedIn, GitHub) + `<Terminal />` al lado |
| `Terminal.astro`       | —        | Bloque ASCII decorativo (`$ whoami`, `$ engineering_principles`, `$ status`) con cursor parpadeante. `aria-hidden`. Recibe `t` — el copy vive en `term.terminal.*`; solo los `$ comandos` quedan hardcoded. **Ancho útil ~66 chars a ≥1100px** |
| `Timeline.astro`       | `#journey` | 4 hitos laborales (reciente primero), pill "Current" en el actual              |
| `Impact.astro`         | `#impact`  | 4 métricas con **contador animado** (IntersectionObserver + easing cúbico) y sparkline SVG de fondo |
| `Sparkline.astro`      | —        | SVG determinista generado con `sin/cos` desde un `seed` — mismo output en cada build |
| `Projects.astro`       | `#cases`   | 4 case studies en **acordeón** (solo uno abierto a la vez; el primero abre por default). Bloques Context / Problem / Decision / Result + tags |
| `TechStack.astro`      | `#stack`   | 4 categorías con glyph mono (`/srv`, `/infra`, `/pay`, `/ai`) y pills de tags |
| `Contact.astro`        | `#contact` | CTA grande + 2 botones + fila de contactos en mono. Renderiza también `<ContactModal />` y el `<footer>` |
| `ContactModal.astro`   | —        | Modal con form (name/email/message) → Web3Forms. Focus trap, `inert` en el fondo, honeypot + timing guard. El JS solo alterna `.is-hidden` y `.is-open` en la raíz; el diálogo escala desde el estado del padre |
| `SectionHeading.astro` | —        | Heading compartido: `label` (con dot accent) + `title` + `sub` opcional          |

### Flujo de páginas

```
/        → renderiza inglés directamente (sin redirect)
/en/     → Landing en inglés (canonical apunta a /, no a sí misma)
/es/     → Landing en español (canonical = /es/)
404      → src/pages/404.astro (terminal-themed, i18n en cliente)
```

- `src/pages/index.astro` renderiza el HTML de inglés directamente — **no es un redirect**
- Los tres archivos de página son idénticos salvo la profundidad de los imports; `getLangFromUrl()` deriva el idioma de la URL y devuelve `'en'` por defecto
- En `Layout.astro` el canonical normaliza `/en/*` → `/` para evitar contenido duplicado

### ⚠️ NO agregar bloque `i18n` en `astro.config.mjs`

El proyecto maneja i18n manualmente. Si se agrega el bloque `i18n` con `prefixDefaultLocale: true`, Vercel intercepta `/` y fuerza un redirect a `/en/`. El `astro.config.mjs` debe tener **solo** `site` + el integration de sitemap.

---

## Sistema de Diseño — "Linear-meets-terminal"

Estética actual: **dark terminal refinado**, mono para metadata y sans para contenido. Todo vive en `src/styles/global.css` (~1.070 líneas), organizado mobile-first.

### Tokens (custom properties en `:root`)

| Token                          | Valor (dark)                | Uso                                    |
|--------------------------------|-----------------------------|----------------------------------------|
| `--bg` / `--bg-elev`           | `#0a0a0b` / `#111113`       | Fondo de página / inputs               |
| `--bg-card` / `--bg-card-hover`| `#131316` / `#16161a`       | Cards, terminal, modal                 |
| `--border` / `--border-strong` | `rgba(255,255,255,.07/.12)` | Separadores / bordes de botones        |
| `--fg` → `--fg-faint`          | white .94 / .62 / .42 / .24 | Escala de texto (4 niveles)            |
| `--accent`                     | `oklch(0.82 0.16 85)`       | Ámbar cálido — CTAs, dots, números     |
| `--green`                      | `oklch(0.78 0.16 150)`      | Indicadores "live" / success           |
| `--red`                        | `oklch(0.68 0.18 25)`       | Error / 404                            |
| `--font-sans` / `--font-mono`  | Inter Tight / JetBrains Mono| Tipografía                             |
| `--maxw` / `--pad-x`           | `1240px` / responsive       | Layout                                 |

### Light mode

**Dark es el default.** El light se activa con la clase `.light` en `<html>`, que redefine solo los tokens neutros (`--bg`, `--fg`, `--border`…). El accent/green/red **no cambian** entre modos.

Para cambiar la paleta: editar `:root` y `html.light` en `global.css`. Los componentes no se tocan.

### Breakpoints (mobile-first)

| Ancho     | Qué cambia                                                        |
|-----------|-------------------------------------------------------------------|
| base      | Todo apilado, stats 2×2, `--pad-x: 20px`                          |
| ≥ 600px   | Stats 4-up, journey en grid `160px 1fr`, expertise 2 columnas, case-grid en 2 columnas, footer en fila |
| ≥ 980px   | Aparecen los `.nav-links`, tipografía más grande                  |
| ≥ 1100px  | Hero pasa a grid `1.1fr 1fr` (texto + terminal lado a lado)        |
| ≥ 1240px  | Aparece el reloj en el nav, padding y títulos máximos              |

### ⚠️ OG image — sincronización manual

`src/pages/og.png.ts` usa satori, que **no lee CSS vars**. Los colores están hardcoded como hex al inicio del archivo (`const C = {...}`) con un comment block `PALETTE SYNC REQUIRED`. **Cuando cambies la paleta, actualizá ese objeto a mano.**

El OG replica el hero: meta line (dot verde · Available · Rionegro, CO · GMT-5 · 10+ yrs), "Gian Barboza." con el punto en accent, tagline, pills Ex-CTO / Payments · AI, y `gianbarboza.com ↗`. Fuente: `src/assets/fonts/inter-400.ttf`.

---

## Decisiones de Diseño / Convenciones

### Sin emojis
El portfolio no usa emojis en headings, cards ni copy. Si hace falta iconografía, usar **SVG inline** con `currentColor` (como el flecha del 404 y el spinner del modal).

### Animaciones
- `.reveal` + `.reveal-delay-1/2/3/4` — IntersectionObserver en `Layout.astro`, que **desobserva** cada elemento tras marcarlo visible
- Contadores de Impact — observer propio con `threshold: 0.4`, easing `1 - (1-p)³`, 1400ms
- `@keyframes pulse` (dots live) y `@keyframes blink` (cursores del terminal y del 404)
- **`prefers-reduced-motion`**: bloque global que anula animaciones/transiciones, apaga el cursor y muestra los `.reveal` de una. El contador de Impact también lo chequea en JS y salta al valor final.

### Tema
Dark por default. `Layout.astro` tiene un script inline **antes del body** que lee `localStorage.theme` y aplica `.light` — evita el flash. El botón del nav muestra el modo **destino** (si estás en dark, dice "LIGHT").

### Modal de contacto
Cualquier elemento con `data-open-contact` lo dispara; el script hace `preventDefault()`.

### Sin JS framework
Vanilla JS puro vía `<script is:inline>`. Cuando hace falta pasar strings traducidos al cliente, se usa `define:vars` (ver `ContactModal.astro`).

### Console easter egg
`Layout.astro` imprime un mensaje Star Wars con estilos CSS en la consola + email y LinkedIn — CTA para devs que abren DevTools.

---

## Sistema de i18n

**Regla clave**: todo el contenido textual vive en los archivos de traducción, **nunca hardcodeado en componentes**. Las únicas excepciones son los `$ comandos` del `Terminal.astro` (son shell, no copy) y los glyphs de `TechStack.astro` (`/srv`, `/infra`…).

- `src/i18n/en.ts` — Strings en inglés
- `src/i18n/es.ts` — Strings en español (mismas keys)
- `src/i18n/utils.ts` — `getLangFromUrl()`, `useTranslations()`. El fallback es `es → en → key`

Los componentes reciben `t` como prop y llaman `t('key')`.

### Grupos de keys

| Prefijo      | Contenido                                                          |
|--------------|--------------------------------------------------------------------|
| `meta.*`     | `title`, `description`, y `h1.role` (keywords de rol en el H1 `sr-only`). **Los tres son capa SEO** → llevan "Senior Backend Engineer" |
| `nav.*`      | Links, aria-labels del toggle y del switcher                       |
| `timeline.*` | 4 hitos × (period / role / company / desc)                         |
| `impact.*`   | Labels de las métricas (los números viven en `Impact.astro`)       |
| `projects.*` | 4 case studies × (title / context / problem / decision / outcome)  |
| `stack.*`    | Títulos de las 4 categorías (los tags viven en `TechStack.astro`)  |
| `contact.*`  | Copy del CTA, del modal, del form, y URLs de contacto              |
| **`term.*`** | Copy específico del rediseño terminal: hero (`term.hero.*`), bloque ASCII (`term.terminal.*`), labels de sección numerados (`01 — Journey`), métricas de los case cards, eyebrow/título del CTA, footer |

Keys con HTML se renderizan con `set:html`: `hero.bio`, `term.hero.tagline.html`, `term.cta.title.html`.
`term.footer.copy` usa el placeholder `{year}`, que `Contact.astro` reemplaza en build.

### Nav — Language Switcher
En `/` o `/en/` muestra **ES** → lleva a `/es/`. En `/es/` muestra **EN** → lleva a `/en/`.

---

## Perfil del Dueño (Gian Barboza)

- **Rol objetivo**: Senior Backend Engineer / Software Engineer — ver [Posicionamiento de Marca](#-posicionamiento-de-marca--estrategia-híbrida)
- **Posicionamiento**: ingeniero que resuelve problemas complejos de negocio mediante arquitectura, sistemas distribuidos, plataformas de pago y desarrollo asistido por IA. **No** se posiciona alrededor de tecnologías puntuales (PHP, Laravel…)
- **Modalidad**: Remote-first, full-time
- **Ubicación**: Rionegro, Antioquia, Colombia (GMT-5)
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
├── CV.md                          ← Fuente de verdad del CV (EN)
├── CV-es.md                       ← Fuente de verdad del CV (ES)
├── cv.css                         ← Estilos para el render md-to-pdf
├── public/
│   ├── favicon.svg / favicon-32.png / apple-touch-icon.png / icon-192.png
│   ├── robots.txt                 ← User-agent + Sitemap URL
│   ├── gian-barboza-cv.pdf        ← Generado por `npm run cv`
│   └── gian-barboza-cv-es.pdf     ← Generado por `npm run cv`
├── src/
│   ├── assets/
│   │   ├── fonts/inter-400.ttf    ← Usado por og.png.ts (satori)
│   │   └── profile.jpg            ← Foto del CV (la web no muestra foto)
│   ├── components/
│   │   ├── Nav.astro              ← Sticky, reloj GMT-5, theme toggle, lang switcher
│   │   ├── Hero.astro
│   │   ├── Terminal.astro         ← Bloque ASCII decorativo del hero
│   │   ├── Timeline.astro         ← #journey
│   │   ├── Impact.astro           ← #impact, contadores animados
│   │   ├── Sparkline.astro        ← SVG determinista de fondo en las stats
│   │   ├── Projects.astro         ← #cases, acordeón
│   │   ├── TechStack.astro        ← #stack
│   │   ├── Contact.astro          ← #contact + footer
│   │   ├── ContactModal.astro     ← Form + focus trap + anti-bot
│   │   └── SectionHeading.astro
│   ├── i18n/
│   │   ├── en.ts                  ← EDITAR AQUÍ contenido en inglés
│   │   ├── es.ts                  ← EDITAR AQUÍ contenido en español
│   │   └── utils.ts
│   ├── layouts/
│   │   └── Layout.astro           ← HTML shell, meta OG/Twitter, hreflang, JSON-LD,
│   │                                theme script, skip-link, observer, Analytics
│   ├── pages/
│   │   ├── index.astro            ← Renderiza inglés directamente (NO redirect)
│   │   ├── en/index.astro
│   │   ├── es/index.astro
│   │   ├── 404.astro              ← Terminal-themed, i18n resuelto en cliente
│   │   └── og.png.ts              ← Genera OG image al build (satori + resvg)
│   └── styles/
│       └── global.css             ← Tokens, light variant, layout, todos los componentes
├── .env.example                   ← Plantilla; `.env` es gitignored
└── AGENTS.md                      ← Este archivo
```

---

## SEO

### Sitemap + robots.txt
- `@astrojs/sitemap` genera `dist/sitemap-index.xml` y `dist/sitemap-0.xml` al build
- `filter: (page) => !page.includes('/en/')` excluye `/en/*` porque `/` ya sirve ese contenido
- `public/robots.txt` apunta al sitemap

### Meta e indexación
- **`noindex` automático fuera de producción**: `Layout.astro` lee `import.meta.env.VERCEL_ENV`. Solo `'production'` emite `index,follow`; cualquier preview (`*.vercel.app`, subdominios) cae en `noindex,nofollow`
- **Canonical**: normaliza `/en/*` → `/` para que no compitan
- **hreflang**: `en` → `/`, `es` → `/es/`, `x-default` → `/`
- **Open Graph + Twitter Card**: `og:type/url/title/description/image/image:width/height/site_name/locale`, `twitter:card=summary_large_image`

### JSON-LD
Un solo `<script type="application/ld+json">` con `@graph` de dos nodos enlazados por `@id`:
- **Person** (`#person`) — jobTitle, address, email, telephone, `sameAs` (LinkedIn/GitHub), `alumniOf`, `knowsAbout` (stack + dominios), `knowsLanguage`
- **WebSite** (`#website`) — `inLanguage: ['en-US','es-ES']`, con `author`/`publisher` apuntando al Person

### H1 con keywords
El `<h1>` visual es solo "Gian Barboza." (marcado `aria-hidden`). Al lado hay un `<span class="sr-only">` con `Gian Barboza — {meta.h1.role}`, que inyecta las keywords de rol para buscadores y lectores de pantalla sin romper el diseño.

⚠️ **`meta.h1.role` es capa SEO**: lleva "Senior Backend Engineer" aunque el hero visible diga "Software Engineer". No lo "corrijas" para que coincida — ver [Posicionamiento de Marca](#-posicionamiento-de-marca--estrategia-híbrida).

### Pendiente
- Submit del sitemap a [Google Search Console](https://search.google.com/search-console) — ver [Pendientes](#pendientes)

---

## Accesibilidad

- **Skip link** (`.skip-link`) → salta al `<main id="main">`; oculto hasta recibir foco
- **Focus trap del modal**: `Tab`/`Shift+Tab` ciclan dentro del dialog, `Escape` cierra, el foco vuelve al elemento que lo abrió, y el resto del `<body>` recibe `inert`. El modal se portea a `document.body` para no quedar atrapado por su propio `inert`
- **`:focus-visible`** global con outline accent
- **`aria-*`**: `aria-expanded` en los case cards, `aria-pressed` en el theme toggle, `aria-invalid` en los campos del form, `role="status"` + `aria-live="polite"` en el estado del envío
- **`prefers-reduced-motion`** respetado en CSS y en el JS del contador
- El `<title>` y la `<meta name="description">` se localizan por idioma

---

## CV / Resume flow

- `CV.md` y `CV-es.md` en la raíz son la **fuente de verdad** (1-2 páginas, bullets outcome-first). `cv.css` define el estilo del PDF
- ⚠️ El CV es **capa SEO**: la línea de rol dice "Senior Backend Engineer" / "Ingeniero Backend Senior" porque los ATS parsean literal. **No cambiarla a "Software Engineer"**
- `npm run cv` genera **ambos** PDFs y los mueve a `public/`
  - **Nota**: `md-to-pdf` removió el flag `--dest-dir`; el script genera en root y mueve
- Se sirven en `/gian-barboza-cv.pdf` y `/gian-barboza-cv-es.pdf`
- El link vive en la key `cta.cv.url`; los botones "Download résumé" del Hero y del CTA lo usan
- Después de editar los `.md`, correr `npm run cv` **y commitear los PDFs**

---

## Formulario de contacto

- `ContactModal.astro` postea a `https://api.web3forms.com/submit` con `fetch`
- **Protecciones anti-bot**:
  - Honeypot (`botcheck` checkbox oculto — Web3Forms descarta si viene marcado)
  - Timing guard (`BOT_MIN_OPEN_MS = 2000` — descarta submits en <2s)
  - HTML5 `required` + `type="email"` + `maxlength` (100 / 200 / 2000)
  - `subject` y `from_name` hardcoded en hidden inputs
- Constantes nombradas: `BOT_MIN_OPEN_MS`, `CLOSE_ANIM_MS`, `SUCCESS_CLOSE_DELAY_MS`, `FOCUSABLE`
- El form usa `novalidate` + validación manual, para controlar el mensaje y enfocar el primer campo inválido
- Akismet de Web3Forms a veces marca como spam mensajes cortos/genéricos con email fake — comportamiento esperado, configurable en su dashboard

---

## Env Vars

| Variable                 | Uso                                                | Dónde va                                                  |
|--------------------------|----------------------------------------------------|-----------------------------------------------------------|
| `PUBLIC_WEB3FORMS_KEY`   | Access key del formulario de contacto (Web3Forms)  | `.env` local + Vercel (Production + Preview + Development)|
| `VERCEL_ENV`             | Inyectada por Vercel; decide `index` vs `noindex`  | Automática — no configurar                                |

- `.env` está gitignored; `.env.example` se sube al repo como plantilla
- La key es pública por diseño (se postea desde el browser). Protección real = honeypot + timing + rate limit de Web3Forms
- **IMPORTANTE**: cuando cambias una env var en Vercel, el deploy actual NO se actualiza — hay que hacer Redeploy o disparar un commit

### Vercel Web Analytics
- `<Analytics />` y `<SpeedInsights />` renderizados en `Layout.astro`
- Solo registran eventos con **Web Analytics habilitado**: Vercel → proyecto → Analytics → Enable
- Free tier: 2,500 eventos/mes (Hobby)

### Vercel Domain Setup (gianbarboza.com)
- Comprado en Cloudflare Registrar (DNS también en Cloudflare)
- Apex `gianbarboza.com` → Production Domain; `www` → Redirect 308 al apex
- DNS records en Cloudflare con **proxy gris (DNS only)** — el naranja choca con el SSL de Vercel
- SSL emitido automáticamente por Vercel

---

## Filosofía de Cambios

- Cambios de **contenido** → solo editar `src/i18n/en.ts` y `src/i18n/es.ts`
- Cambios de **texto de rol** → respetar las dos capas. Persona lee → "Software Engineer". Máquina lee (o es `sr-only`) → "Senior Backend Engineer". **Nunca unificar las dos** — ver [Posicionamiento de Marca](#-posicionamiento-de-marca--estrategia-híbrida)
- Cambios de **layout/diseño** → editar el componente `.astro` + su bloque en `global.css`
- Cambios de **paleta** → editar `:root` y `html.light` en `global.css`, **y sincronizar `og.png.ts`**
- **CSS plano con las custom properties** — no hay framework de CSS y no se reintroduce Tailwind
- **No crear archivos nuevos** si no es estrictamente necesario
- **No agregar JS frameworks** — mantener Vanilla JS
- **Mantener paridad de keys** entre `en.ts` y `es.ts` siempre
- **No agregar emojis** — usar SVG inline si hace falta iconografía
- Todo cambio de layout se valida en los 4 breakpoints (mobile-first)

---

## Pendientes

Estado al 2026-08-06, después del reposicionamiento de marca y de sacar Tailwind.

> **Validado el 2026-08-06** (Edge headless + CDP, 375/768/1024/1440): cero desborde horizontal en los cuatro anchos; `.hero-pitch` a 2 líneas y `.cta-title` a 3–4 líneas sin romperse; el `.terminal-body` **no scrollea horizontal en mobile** — la única línea larga envuelve en dos, que es lo que hace una terminal real. Los dos ítems de "verificación pendiente" quedaron cerrados.
>
> Un hallazgo del pase: el CSS que generaba el pipeline de Tailwind (Lightning CSS) **descartaba la propiedad estándar `backdrop-filter` y dejaba solo `-webkit-`**, así que el blur del nav computaba `none`. Al sacar Tailwind la propiedad sobrevive y el nav ahora sí compone su capa; el efecto colateral visible es que su texto pasó de antialiasing subpíxel a escala de grises. Es el **único** cambio de render de todo el sitio: de la barra hacia abajo el diff contra el build anterior es de 0 px.

### Requieren acción manual (fuera del código)

- [ ] **Submit del sitemap a Google Search Console** — property `gianbarboza.com`, sitemap en `https://gianbarboza.com/sitemap-index.xml`. Nunca se hizo
- [ ] **Invalidar la caché del OG image** — el texto de `og.png` cambió con el reposicionamiento, pero LinkedIn/X/WhatsApp cachean la preview por semanas. Forzar refresh en el [Post Inspector de LinkedIn](https://www.linkedin.com/post-inspector/) y en el Card Validator de X
- [ ] **Alinear LinkedIn con la web** — el headline debería seguir la misma estrategia de dos capas (ver [Posicionamiento de Marca](#-posicionamiento-de-marca--estrategia-híbrida)): "Senior Backend Engineer" para el buscador interno de recruiters, la especialización en el about

### Deuda técnica conocida

- [ ] **`404.astro` resuelve i18n en cliente**, no en build — el copy en español aparece recién después de que corre el script. Es la única página con ese patrón. ⚠️ Con output estático Vercel sirve `404.html` desde la raíz para cualquier ruta, así que un `/es/404.astro` no se dispararía solo; hay que evaluar si el patrón actual no es directamente la solución correcta
- [ ] **`hero.*` y `term.hero.*` conviven** — quedaron dos familias de keys del hero tras el rediseño terminal. Las muertas ya se borraron, pero el naming sigue partido

### Contenido

- [x] **`CV.md` / `CV-es.md` reencuadrados completos** — ya no es solo el Summary: los bullets de experiencia pasaron de enfoque tecnologías a problemas de negocio (resultado primero, stack como medio). Ambos PDFs regenerados. **Recordatorio permanente**: después de editar los `.md`, correr `npm run cv` y commitear los dos PDFs

---

## Flujo de Git

- El dueño siempre audita el código antes de hacer commit o push
- **No agregar `Co-Authored-By` de ninguna IA en los commits** — autoría exclusiva del desarrollador
- **Nunca `git add -A`** — pasar siempre rutas explícitas (hay archivos de trabajo sin trackear en la raíz)
- `.claude/`, `.agents/` y `screenshots/` están en `.gitignore`
- `/public/` se sirve públicamente — **nunca** guardar ahí referencias de diseño ni capturas locales
- `AGENTS.md` y `README.md` sí se suben al repo
