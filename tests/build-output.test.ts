import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it } from 'vitest';

import { LANGS, getLocaleHref, useTranslations } from '../src/i18n/utils';

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

describe('portfolio design contract', () => {
  const caseKeys = ['rentoru', 'payments', 'fraud', 'infra', 'seo'];
  const categoryKeys = ['backend', 'architecture', 'infra', 'payments', 'ai'];
  const milestoneKeys = ['now', 'freelance', 'cto', 'fermat'];

  // Compare copy independently of HTML escaping and architecture paragraph tags.
  function text(source: string) {
    return source.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
      .replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  }

  for (const lang of LANGS) {
    const href = getLocaleHref(lang);
    const t = useTranslations(lang);

    it(`keeps the accessible H1 and visible full role on ${href}`, () => {
      const source = html[href];
      const h1 = source.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
      expect(h1).toContain('class="sr-only"');
      expect(text(h1)).toContain(`Gian Barboza — ${t('meta.h1.role')}`);
      expect(h1).not.toMatch(/<br\b/);
      const role = source.match(/<p class="hero-role[^\"]*">([\s\S]*?)<\/p>/)?.[1] ?? '';
      expect(text(role)).toBe(t('meta.h1.role'));
    });

    it(`keeps content, expertise, metrics and localized CV links on ${href}`, () => {
      const source = html[href];
      const copy = text(source);
      for (const key of caseKeys) {
        for (const field of ['title', 'context', 'problem', 'decision']) {
          expect(copy, `${key}.${field}`).toContain(text(t(`projects.${key}.${field}`)));
        }
        for (const field of ['metric', 'result.num', 'result.text']) {
          expect(copy).toContain(text(t(`term.case.${key}.${field}`)));
        }
      }
      expect(source.match(/data-case="/g)).toHaveLength(5);
      expect(source.match(/class="exp-card\b/g)).toHaveLength(5);
      for (const key of categoryKeys) expect(copy).toContain(t(`stack.${key}.title`));
      for (const key of milestoneKeys) {
        for (const field of ['period', 'role', 'company', 'desc']) {
          expect(copy).toContain(text(t(`timeline.${key}.${field}`)));
        }
      }
      expect(source.match(/data-counter="/g)).toHaveLength(4);
      expect(source.match(new RegExp(`href="${t('cta.cv.url')}"`, 'g'))).toHaveLength(2);
      expect(source).toContain('href="https://rentoru.com"');
    });

    it(`links accordion headings to labelled panels with only the first visible on ${href}`, () => {
      const source = html[href];
      for (const [index, key] of caseKeys.entries()) {
        const trigger = source.match(new RegExp(`<button\\b[^>]*id="case-trigger-${key}"[^>]*>`))?.[0] ?? '';
        const panel = source.match(new RegExp(`<div\\b[^>]*id="case-panel-${key}"[^>]*>`))?.[0] ?? '';
        expect(trigger).toContain(`aria-controls="case-panel-${key}"`);
        expect(trigger).toContain(`aria-expanded="${index === 0}"`);
        expect(source).toMatch(new RegExp(`<h3\\b[^>]*>\\s*${trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
        expect(panel).toContain('role="region"');
        expect(panel).toContain(`aria-labelledby="case-trigger-${key}"`);
        expect(/\shidden(?:[\s=>])/.test(panel)).toBe(index !== 0);
      }
    });

    it(`moves Terminal into Journey and keeps the clock and contact runtime on ${href}`, () => {
      const source = html[href];
      const journey = source.match(/<section[^>]*id="journey"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
      expect(journey).toContain('class="terminal"');
      expect(source).toContain('id="nav-clock"');
      expect(source).toContain('class="hero-side');
      expect(source).toContain('https://api.web3forms.com/submit');
      expect(source).toContain('name="botcheck"');
      for (const length of [100, 200, 2000]) expect(source).toContain(`maxlength="${length}"`);
    });
  }
});

describe('crawler contract', () => {
  it('allows indexing only for a production build', () => {
    const robots = process.env.VERCEL_ENV === 'production' ? 'index,follow' : 'noindex,nofollow';
    for (const [href, source] of Object.entries(html)) {
      expect(source, `robots on ${href}`).toContain(`<meta name="robots" content="${robots}">`);
    }
  });

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

/**
 * The share card is generated by `src/pages/og.png.ts`, which hardcodes its own
 * palette, copy and metrics because Satori cannot read CSS variables or the i18n
 * dictionaries. That file carries a "PALETTE SYNC REQUIRED" comment — a reminder,
 * not a mechanism, and it drifted: it kept an outdated role line, a `Gateways 5+`
 * stat and a `PAYMENTS · AI` label the site never had. These tests are that
 * mechanism.
 */
describe('social card', () => {
  const OG_SOURCE = fileURLToPath(new URL('../src/pages/og.png.ts', import.meta.url));
  const GLOBAL_CSS = fileURLToPath(new URL('../src/styles/global.css', import.meta.url));

  /** Width and height straight from the PNG's IHDR chunk. */
  function pngSize(file: string) {
    const bytes = readFileSync(file);
    const signature = bytes.subarray(0, 8).toString('hex');
    return {
      isPng: signature === '89504e470d0a1a0a',
      width: bytes.readUInt32BE(16),
      height: bytes.readUInt32BE(20),
    };
  }

  it('builds a valid PNG at the size the meta tags promise', () => {
    const { isPng, width, height } = pngSize(`${DIST}og.png`);

    expect(isPng, 'og.png is not a PNG').toBe(true);

    for (const [href, source] of Object.entries(html)) {
      expect(source, `og:image on ${href}`).toContain(`content="${SITE}/og.png"`);
      expect(source, `og:image:width on ${href}`).toContain(`content="${width}"`);
      expect(source, `og:image:height on ${href}`).toContain(`content="${height}"`);
    }
  });

  // Regression guard: the card once read "Software engineer · …AI-assisted
  // development" while every page already said something else.
  it('states the same role as the pages it represents', () => {
    const og = readFileSync(OG_SOURCE, 'utf8');
    const role = 'Senior Backend Engineer & Software Architect';

    expect(og, 'og.png.ts tagline').toContain(role);
    for (const [href, source] of Object.entries(html)) {
      expect(source, `role on ${href}`).toContain('Software Architect');
    }
  });

  // Regression guard: the card showed a `Gateways 5+` stat and an `Ex-CTO`
  // figure that appeared nowhere on the site.
  it('shows only figures the Impact section also shows', () => {
    const og = readFileSync(OG_SOURCE, 'utf8');
    const onPage = new Set(
      [...html['/'].matchAll(/data-counter="([0-9.]+)"/g)].map((m) => m[1]),
    );

    // Read the stat() calls rather than any number in the file, so CSS values
    // like height: '100%' cannot be mistaken for a metric.
    const figures = [...og.matchAll(/stat\('[^']+',\s*'([^']+)'/g)].map((m) => m[1]);

    expect(figures.length, 'no stat() calls found in og.png.ts — did the shape change?')
      .toBeGreaterThan(0);

    for (const figure of figures) {
      const digits = figure.replace(/[^0-9.]/g, '');
      expect(onPage, `"${figure}" is on the card but not in Impact`).toContain(digits);
    }
  });

  // og.png.ts hardcodes hex equivalents of the CSS tokens. Pin the tokens it was
  // derived from: change one and this fails, pointing at the file to update.
  it('is derived from the current design tokens', () => {
    const css = readFileSync(GLOBAL_CSS, 'utf8');

    for (const token of [
      '--bg: #0a0a0b',
      '--bg-elev: #111113',
      '--bg-card: #111113',
      '--fg: #f4f4f5',
      '--fg-muted: #b4b4bc',
      '--fg-dim: #b4b4bc',
      '--fg-faint: #85858f',
      '--border: #303034',
      '--border-strong: #45454c',
      '--accent: oklch(0.82 0.16 85)',
      '--green: oklch(0.78 0.16 150)',
    ]) {
      expect(css, `${token} changed — update the hex values in og.png.ts`).toContain(token);
    }
    const og = readFileSync(OG_SOURCE, 'utf8');
    for (const [property, hex] of [
      ['bg', '#0a0a0b'], ['bgElev', '#111113'], ['fg', '#f4f4f5'],
      ['fgMuted', '#b4b4bc'], ['fgDim', '#b4b4bc'], ['fgFaint', '#85858f'],
      ['border', '#303034'], ['borderStrong', '#45454c'],
    ]) {
      expect(og).toContain(`${property}: '${hex}'`);
    }
  });
});
