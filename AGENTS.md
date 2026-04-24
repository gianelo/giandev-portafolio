# CLAUDE.md — Contexto del Proyecto

## ¿Qué es este proyecto?

Landing page personal de **Gian Barboza**, Senior Backend Engineer con 10+ años de experiencia. El objetivo principal de la página es **conseguir trabajo remoto** como Backend / Platform Engineer en empresas de alto impacto. No es un blog ni un portafolio de diseño — es un pitch profesional estático, rápido y enfocado en conversión.

---

## Stack Técnico

| Herramienta     | Versión | Uso                                      |
|-----------------|---------|------------------------------------------|
| Astro           | 5.x     | Framework de sitio estático              |
| Tailwind CSS    | 4.x     | Estilos utility-first                    |
| Vanilla JS      | —       | Theme toggle + animaciones de scroll     |
| Node.js         | 22 (nvm)| Entorno de desarrollo                    |

Build output: carpeta `dist/` (100% estático, sin servidor).

---

## Comandos

```bash
npm run dev       # Dev server → http://localhost:4321
npm run build     # Build de producción → dist/
npm run preview   # Preview del build
```

---

## Arquitectura de la página

### Secciones (en orden de render)

| Componente             | Sección     | Descripción                                                                       |
|------------------------|-------------|-----------------------------------------------------------------------------------|
| `Nav.astro`            | Nav         | Sticky, theme toggle (dark/light), language switcher (EN/ES)                      |
| `Hero.astro`           | Hero        | Full-screen, nombre + subtítulo + 2 CTAs + scroll indicator                       |
| `Impact.astro`         | Impact      | 4 métricas: 10+ años, 99.9% uptime, $200K+/mes, 5+ procesadores                   |
| `Timeline.astro`       | Timeline    | Recorrido laboral (4 hitos, reciente primero) con dot + accent color por período  |
| `TechStack.astro`      | Stack       | 4 categorías con pills: Backend, Infra, Payments, AI                              |
| `Projects.astro`       | Projects    | 4 case studies con bloques Contexto / Problema / Decisión Técnica / Resultado     |
| `Leadership.astro`     | Leadership  | 2 columnas: experiencia de liderazgo + qué busca                                  |
| `Contact.astro`        | Contact     | CTA abre modal + pills WhatsApp, LinkedIn, GitHub                                 |
| `ContactModal.astro`   | —           | Modal con form (nombre/email/mensaje) → Web3Forms. Honeypot + timing anti-bot     |
| `SectionHeading.astro` | —           | Heading compartido (emoji + título + underline + subtítulo opcional)              |

### Flujo de páginas

```
/        → renderiza inglés directamente (sin redirect)
/en/     → Landing en inglés
/es/     → Landing en español
```

- `src/pages/index.astro` renderiza el HTML de inglés directamente — **no es un redirect**, es la página completa
- `getLangFromUrl()` devuelve `'en'` por defecto cuando la URL es `/` (el split da `''`, que no es `'es'`)

---

## Sistema de i18n

**Regla clave: todo el contenido textual vive en los archivos de traducción, nunca hardcodeado en los componentes.**

- `src/i18n/en.ts` — Strings en inglés
- `src/i18n/es.ts` — Strings en español (mismas keys)
- `src/i18n/utils.ts` — `getLangFromUrl()`, `useTranslations()`

Los componentes reciben `t` como prop y llaman `t('key')` para obtener texto.

### Nav — Language Switcher

- Lógica en `Nav.astro`: `otherLang = lang === 'en' ? 'es' : 'en'` → `otherLangUrl = /${otherLang}/`
- En `/` o `/en/` → muestra botón **ES** → lleva a `/es/`
- En `/es/` → muestra botón **EN** → lleva a `/en/`
- El logo `GB` siempre enlaza a `/${lang}/` (desde `/` lleva a `/en/`, inofensivo)

### ⚠️ NO agregar bloque `i18n` en `astro.config.mjs`

El proyecto maneja i18n manualmente. Si se agrega el bloque `i18n` con `prefixDefaultLocale: true`, Vercel intercepta `/` y fuerza un redirect a `/en/` a nivel de CDN, mostrando "Redirecting…". El `astro.config.mjs` debe tener **solo** el plugin de Tailwind:

```js
export default defineConfig({
  vite: { plugins: [tailwindcss()] }
});
```

---

## Perfil del Dueño (Gian Barboza)

- **Rol objetivo**: Senior Backend Engineer / Platform Engineer
- **Modalidad**: Remote-first, full-time
- **Experiencia clave**:
  - Ex-CTO, 10+ años en producción
  - Sistemas distribuidos (8-server cluster, HAProxy, MySQL Replication)
  - Pagos: Stripe, PayPal, DLocal, Shift4, PCI Compliance
  - Fraude: motores de reglas, decisión automática con IA (n8n)
  - SEO programático: 18K+ landing pages con pipelines de IA
- **Stack principal**: Node.js, TypeScript, PHP, Java, REST API, Design Patterns, Clean Architecture
- **Contacto**:
  - Email: `gianelo1992@gmail.com`
  - WhatsApp: `+57 304 358 1365` / `https://wa.me/573043581365`
  - LinkedIn: `https://linkedin.com/in/gian-barboza`
  - GitHub: `https://github.com/gianelo`

---

## Convenciones del Proyecto

- **Clases de animación**: `animate-hero`, `animate-hero-delay-1/2/3` (Hero), `reveal`, `reveal-delay-1/2/3/4` (secciones via IntersectionObserver en `Layout.astro`)
- **Tema**: Dark/light mode con clase `dark` en `<html>`, persiste en `localStorage`
- **IDs de sección**: `#impact`, `#timeline`, `#stack`, `#projects`, `#contact` — usados por la nav y CTAs
- **No hay JS framework** — animaciones y interactividad con Vanilla JS puro

---

## Estructura de Archivos

```
src/
├── components/
│   ├── Nav.astro
│   ├── Hero.astro
│   ├── Impact.astro
│   ├── Timeline.astro
│   ├── TechStack.astro
│   ├── Projects.astro
│   ├── Leadership.astro
│   ├── Contact.astro
│   ├── ContactModal.astro
│   └── SectionHeading.astro
├── i18n/
│   ├── en.ts          ← EDITAR AQUÍ para cambiar contenido en inglés
│   ├── es.ts          ← EDITAR AQUÍ para cambiar contenido en español
│   └── utils.ts
├── layouts/
│   └── Layout.astro   ← HTML shell, theme script, scroll observer
├── pages/
│   ├── index.astro    ← Renderiza inglés directamente (NO es redirect)
│   ├── en/index.astro ← Página inglés
│   └── es/index.astro ← Página español
└── styles/
    └── global.css     ← Tailwind import, dark variant, keyframes
```

---

## Filosofía de Cambios

- Cambios de contenido → solo editar `src/i18n/en.ts` y `src/i18n/es.ts`
- Cambios de layout/diseño → editar el componente `.astro` correspondiente
- No crear archivos nuevos si no es estrictamente necesario
- No agregar JS frameworks — mantener Vanilla JS
- Mantener paridad de keys entre `en.ts` y `es.ts` siempre

## Env Vars

| Variable                 | Uso                                                           | Dónde va                         |
|--------------------------|---------------------------------------------------------------|----------------------------------|
| `PUBLIC_WEB3FORMS_KEY`   | Access key del formulario de contacto (Web3Forms)             | `.env` local + Vercel (Production + Preview) |

- `.env` está gitignored, `.env.example` sí se sube al repo como plantilla.
- La key es pública por diseño (se postea desde el browser). Protección real = honeypot + timing check en `ContactModal.astro` + rate limit de Web3Forms.
- En Vercel: Settings → Environment Variables → agregar `PUBLIC_WEB3FORMS_KEY` con el valor real, en Production y Preview.

---

## Flujo de Git

- El dueño siempre audita el código antes de hacer commit o push
- **No agregar `Co-Authored-By` de ninguna IA en los commits** — los commits son autoría del desarrollador
- `.claude/` está en `.gitignore` (configuración local de Claude Code, no se trackea)
- `CLAUDE.md` sí se sube al repo (es documentación del proyecto)
