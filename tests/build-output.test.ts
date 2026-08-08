import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it } from 'vitest';

import { LANGS, getLocaleHref } from '../src/i18n/utils';

/**
 * Assertions against the generated site rather than its source.
 *
 * Unit tests cover the rules; this file covers the contract with crawlers —
 * canonical URLs, hreflang, sitemap contents, and the absence of links to
 * routes that no longer exist. Every bug found while reworking i18n routing
 * was visible here and nowhere else.
 *
 * Requires a build first: `npm run test:build` does both.
 */
const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const SITE = 'https://gianbarboza.com';

/** Built HTML file for a locale, keyed by its public URL. */
const PAGES = Object.fromEntries(
  LANGS.map((lang) => {
    const href = getLocaleHref(lang);
    return [href, `${DIST}${href.slice(1)}index.html`];
  }),
) as Record<string, string>;

const html: Record<string, string> = {};

beforeAll(() => {
  const missing = Object.entries(PAGES).filter(([, file]) => !existsSync(file));
  if (missing.length > 0) {
    throw new Error(
      `Missing build output: ${missing.map(([href]) => href).join(', ')}. Run \`npm run build\` first.`,
    );
  }
  for (const [href, file] of Object.entries(PAGES)) {
    html[href] = readFileSync(file, 'utf8');
  }
});

describe('generated routes', () => {
  it('builds one page per locale', () => {
    for (const [href, file] of Object.entries(PAGES)) {
      expect(existsSync(file), `expected a page at ${href}`).toBe(true);
    }
  });

  it('builds no /en/ route', () => {
    expect(existsSync(`${DIST}en/index.html`)).toBe(false);
  });

  it('builds a 404 page', () => {
    expect(existsSync(`${DIST}404.html`)).toBe(true);
  });
});

describe('internal links', () => {
  // Regression guard: the language switcher used to point at /en/, a
  // non-canonical duplicate the visitor could never navigate back from.
  it('never link to /en/', () => {
    for (const [href, source] of Object.entries(html)) {
      expect(source, `page ${href}`).not.toContain('href="/en/"');
    }
    expect(readFileSync(`${DIST}404.html`, 'utf8')).not.toContain('href="/en/"');
  });

  it('point the language switcher at every other locale', () => {
    for (const lang of LANGS) {
      const source = html[getLocaleHref(lang)];
      const others = LANGS.filter((other) => other !== lang);

      for (const other of others) {
        expect(source, `switcher on ${getLocaleHref(lang)}`).toContain(
          `href="${getLocaleHref(other)}" class="nav-tool"`,
        );
      }
    }
  });
});

describe('crawler contract', () => {
  it('give every page a self-referencing canonical', () => {
    for (const [href, source] of Object.entries(html)) {
      expect(source, `canonical on ${href}`).toContain(
        `<link rel="canonical" href="${SITE}${href}">`,
      );
    }
  });

  it('declare the same hreflang set on every page', () => {
    for (const [href, source] of Object.entries(html)) {
      for (const lang of LANGS) {
        expect(source, `hreflang="${lang}" on ${href}`).toContain(
          `<link rel="alternate" hreflang="${lang}" href="${SITE}${getLocaleHref(lang)}">`,
        );
      }
      expect(source, `hreflang="x-default" on ${href}`).toContain(
        `hreflang="x-default" href="${SITE}/"`,
      );
    }
  });

  it('mark each page with its own language', () => {
    for (const lang of LANGS) {
      expect(html[getLocaleHref(lang)]).toContain(`<html lang="${lang}"`);
    }
  });

  it('list exactly the locale home pages in the sitemap', () => {
    const sitemap = readFileSync(`${DIST}sitemap-0.xml`, 'utf8');
    const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    expect(listed.sort()).toEqual(LANGS.map((lang) => `${SITE}${getLocaleHref(lang)}`).sort());
  });

  it('render no untranslated keys', () => {
    for (const [href, source] of Object.entries(html)) {
      // Dictionary keys are dotted lowercase tokens; a missing translation
      // renders one verbatim between tags instead of real copy.
      expect(source, `page ${href}`).not.toMatch(/>\s*(term|nav|meta|cta|projects)\.[a-z0-9.]+\s*</);
    }
  });
});
