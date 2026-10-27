import { en } from './en';
import { es } from './es';

const translations = { en, es } as const;

export const LANGS = ['en', 'es'] as const;

export type Lang = (typeof LANGS)[number];

/** The locale served at the site root. */
export const DEFAULT_LANG: Lang = 'en';

/**
 * Home URL for a locale — the single source of truth for where each language
 * lives. The default locale is served at the site root, so this never returns
 * `/en/`: that path is retired (vercel.json 301s it to `/`), and linking to it
 * strands the visitor on a redirect instead of a page.
 */
export function getLocaleHref(lang: Lang): string {
  return lang === DEFAULT_LANG ? '/' : `/${lang}/`;
}

/**
 * The portfolio is each locale's home page. It used to live at `/portfolio/`;
 * vercel.json 301s those old URLs to the locale root.
 */
export function getPortfolioHref(lang: Lang): string {
  return getLocaleHref(lang);
}

/** Services page for a locale, under a localized slug. */
export function getServicesHref(lang: Lang): string {
  return lang === DEFAULT_LANG ? '/services/' : `/${lang}/servicios/`;
}

/** Locale-invariant IDs shared by each pair of translated pages. */
const serviceAnchors = ['main', 'services', 'work', 'process', 'contact'];
const portfolioAnchors = ['main', 'journey', 'impact', 'cases', 'stack', 'contact',
  ...['rentoru', 'payments', 'fraud', 'infra', 'seo'].flatMap(key =>
    [`case-${key}`, `case-trigger-${key}`, `case-panel-${key}`])];

/**
 * Switch language without switching views or carrying a non-equivalent hash.
 * `/services/` pairs with `/es/servicios/`; every other path is treated as a
 * locale root, which is the portfolio.
 */
export function getLocalePageHref(path: string, lang: Lang, hash = ''): string {
  const services = /^\/(?:services|es\/servicios)\/?$/.test(path);
  const href = services ? getServicesHref(lang) : getPortfolioHref(lang);
  const anchors = services ? serviceAnchors : portfolioAnchors;
  return href + (hash.startsWith('#') && anchors.includes(hash.slice(1)) ? hash : '');
}

export const shellCopy = {
  en: { services: 'Services', portfolio: 'Portfolio', contact: 'Get in touch ↗',
    menu: 'Menu', navigation: 'Main navigation', home: 'Gian Barboza — Home',
    clock: 'Bogotá time', footer: 'Footer', description: 'Backend engineering & software architecture',
    locale: 'Switch to Spanish' },
  es: { services: 'Servicios', portfolio: 'Portafolio', contact: 'Contactar ↗',
    menu: 'Menú', navigation: 'Navegación principal', home: 'Gian Barboza — Inicio',
    clock: 'Hora de Bogotá', footer: 'Pie de página', description: 'Ingeniería backend y arquitectura de software',
    locale: 'Cambiar a inglés' },
} as const;

/**
 * Locale encoded in a URL path, read from its first segment. The inverse of
 * `getLocaleHref`, for the one case where the language is only knowable at
 * runtime: the 404 page, which a static host serves for every unmatched route.
 *
 * Compares the whole segment deliberately — a `startsWith('/es')` test also
 * matches `/estadisticas`, `/essays`, `/espanol`… and hands them the wrong
 * language.
 */
export function getLangFromPath(path: string): Lang {
  const segment = path.split('/')[1];
  return LANGS.includes(segment as Lang) ? (segment as Lang) : DEFAULT_LANG;
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    return translations[lang][key] ?? translations['en'][key] ?? key;
  };
}
