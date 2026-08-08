import { en } from './en';
import { es } from './es';

const translations = { en, es } as const;

export const LANGS = ['en', 'es'] as const;

export type Lang = (typeof LANGS)[number];

/** The locale served at the site root. */
export const DEFAULT_LANG: Lang = 'en';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  return lang === 'es' ? 'es' : 'en';
}

/**
 * Home URL for a locale — the single source of truth for where each language
 * lives. The default locale is served at the site root, so this never returns
 * `/en/`: that path is a non-canonical duplicate of `/` (excluded from the
 * sitemap, canonical points to `/`), and linking to it strands the visitor on
 * a page they cannot navigate back from.
 */
export function getLocaleHref(lang: Lang): string {
  return lang === DEFAULT_LANG ? '/' : `/${lang}/`;
}

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
