import { describe, expect, it } from 'vitest';

import { en } from './en';
import { es } from './es';
import {
  DEFAULT_LANG,
  LANGS,
  getLangFromPath,
  getLocaleHref,
  useTranslations,
} from './utils';

describe('getLocaleHref', () => {
  it('serves the default locale from the site root', () => {
    expect(getLocaleHref(DEFAULT_LANG)).toBe('/');
  });

  it('prefixes every non-default locale with its code', () => {
    expect(getLocaleHref('es')).toBe('/es/');
  });

  // Regression guard: /en/ was a duplicate of the site root. Linking to it
  // stranded visitors on a page whose switcher could never return them to /.
  it('never produces /en/ for any supported locale', () => {
    for (const lang of LANGS) {
      expect(getLocaleHref(lang)).not.toBe('/en/');
    }
  });

  it('produces a distinct URL for every locale', () => {
    const hrefs = LANGS.map(getLocaleHref);
    expect(new Set(hrefs).size).toBe(LANGS.length);
  });
});

describe('getLangFromPath', () => {
  it.each([
    ['/', DEFAULT_LANG],
    ['/es', 'es'],
    ['/es/', 'es'],
    ['/es/anything', 'es'],
  ])('reads the locale from the first segment of %s', (path, expected) => {
    expect(getLangFromPath(path)).toBe(expected);
  });

  // Regression guard: the 404 page matched with startsWith('/es'), so these
  // paths were all served a Spanish error page to English-speaking visitors.
  it.each(['/estadisticas', '/essays/foo', '/espanol', '/es-tudio'])(
    'does not mistake %s for the Spanish locale',
    (path) => {
      expect(getLangFromPath(path)).toBe(DEFAULT_LANG);
    },
  );

  it.each(['/en', '/en/', '/en/anything', '/unknown', ''])(
    'falls back to the default locale for %s',
    (path) => {
      expect(getLangFromPath(path)).toBe(DEFAULT_LANG);
    },
  );
});

describe('translation dictionaries', () => {
  // The highest-value assertion in this file. useTranslations resolves
  // `es[key] ?? en[key] ?? key`, so a key missing from Spanish does not throw
  // and does not fail the build — it renders the raw key string to the
  // visitor. Nothing else in the project catches that.
  it('define exactly the same keys in every locale', () => {
    const reference = Object.keys(en).sort();

    for (const [lang, dictionary] of Object.entries({ en, es })) {
      expect(Object.keys(dictionary).sort(), `locale "${lang}"`).toEqual(reference);
    }
  });

  it('leave no translation empty', () => {
    for (const [lang, dictionary] of Object.entries({ en, es })) {
      for (const [key, value] of Object.entries(dictionary)) {
        expect(value.trim(), `${lang} → ${key}`).not.toBe('');
      }
    }
  });
});

describe('useTranslations', () => {
  it('resolves a known key to real copy rather than echoing the key', () => {
    for (const lang of LANGS) {
      const t = useTranslations(lang);
      expect(t('meta.title')).not.toBe('meta.title');
    }
  });

  it('resolves each locale to its own copy', () => {
    expect(useTranslations('en')('cta.cv.url')).not.toBe(
      useTranslations('es')('cta.cv.url'),
    );
  });

  it('echoes back a key that exists in no locale', () => {
    expect(useTranslations('es')('does.not.exist')).toBe('does.not.exist');
  });
});
