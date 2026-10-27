import { describe, expect, it } from 'vitest';

import { en } from './en';
import { es } from './es';
import {
  DEFAULT_LANG,
  LANGS,
  getLangFromPath,
  getLocaleHref,
  getLocalePageHref,
  getPortfolioHref,
  getServicesHref,
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

describe('getPortfolioHref', () => {
  // The portfolio is the home page of each locale.
  it.each(LANGS)('serves the %s portfolio from the locale root', (lang) => {
    expect(getPortfolioHref(lang)).toBe(getLocaleHref(lang));
  });
});

describe('getServicesHref', () => {
  it.each([
    ['en', '/services/'],
    ['es', '/es/servicios/'],
  ] as const)('serves the %s services page from a localized subpath', (lang, expected) => {
    expect(getServicesHref(lang)).toBe(expected);
  });
});

describe('getLocalePageHref', () => {
  it.each([
    ['/', 'es', '#case-payments', '/es/#case-payments'],
    ['/es/', 'en', '#journey', '/#journey'],
    ['/es', 'en', '#cases', '/#cases'],
    ['/', 'es', '#contact', '/es/#contact'],
    ['/services/', 'es', '#services', '/es/servicios/#services'],
    ['/es/servicios/', 'en', '#contact', '/services/#contact'],
    ['/services', 'es', '#work', '/es/servicios/#work'],
    ['/es/servicios', 'en', '#process', '/services/#process'],
    ['/en/', 'es', '', '/es/'],
  ] as const)('retains the view and equivalent anchor for %s', (path, lang, hash, expected) => {
    expect(getLocalePageHref(path, lang, hash)).toBe(expected);
  });

  it.each([
    ['/', '#services'],
    ['/', '#unknown'],
    ['/services/', '#journey'],
    ['/services/', '#case-payments'],
    ['/es/servicios/', '#%63ontact'],
  ])('drops non-equivalent anchors on %s', (path, hash) => {
    expect(getLocalePageHref(path, 'es', hash)).not.toContain('#');
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
