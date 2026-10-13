import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { describe, expect, it, vi } from 'vitest';
import { LANGS, useTranslations } from '../src/i18n/utils';
import { homeEn, homeEs } from '../src/i18n/home';
import { validateInquiry, allowedOrigin } from '../src/lib/inquiry.js';
import handler from '../api/inquiry.js';

const site = 'https://gianbarboza.com';
const routes = ['/', '/es/', '/portfolio/', '/es/portfolio/'];
const page = (route: string) => readFileSync(`dist/${route.slice(1)}index.html`, 'utf8');

describe('bilingual CV portfolio links', () => {
  for (const [source, pdf, route, period] of [
    ['CV.md', 'gian-barboza-cv.pdf', '/portfolio/', 'Nov 2023 — Aug 2026'],
    ['CV-es.md', 'gian-barboza-cv-es.pdf', '/es/portfolio/', 'Nov 2023 — Ago 2026'],
  ]) {
    it(`embeds the locale-specific portfolio URI annotation in ${pdf}`, () => {
      const bytes = readFileSync(`public/${pdf}`);
      // Chromium emits link actions as uncompressed PDF dictionaries. Inspect
      // their actual URI strings, not visible PDF text or Markdown destinations.
      const uris = [...bytes.toString('latin1').matchAll(/\/S\s*\/URI\s*\/URI\s*\(([^)]*)\)/g)].map(match => match[1]);
      expect(uris.length).toBeGreaterThan(0);
      expect(uris.filter(uri => uri.startsWith(site))).toEqual([`${site}${route}`]);
      expect(readFileSync(source, 'utf8')).toContain(`<a href="${site}${route}">gianbarboza.com</a>`);
      expect(readFileSync(`dist/${pdf}`)).toEqual(bytes);
    });
    it(`preserves the completed latest Hablax tenure in ${pdf}`, async () => {
      const task = getDocument({ data: Uint8Array.from(readFileSync(`public/${pdf}`)) });
      try {
        const document = await task.promise;
        const pages = await Promise.all(Array.from({ length: document.numPages }, async (_, index) => {
          const content = await (await document.getPage(index + 1)).getTextContent();
          return content.items.map(item => 'str' in item ? item.str : '').join(' ');
        }));
        const text = pages.join(' ').replace(/\s+/g, ' ');
        expect(text).toContain(period);
        expect(text).toContain('gianbarboza.com');
        expect(text).not.toMatch(/Present|Actualidad/);
      } finally {
        await task.destroy();
      }
    });
  }
});

// Career portfolio regression guards retained from the original build-output suite.
describe('career portfolio build contract', () => {
  const keys = ['rentoru', 'payments', 'fraud', 'infra', 'seo'];
  const plain = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  for (const lang of LANGS) {
    const route = lang === 'es' ? '/es/portfolio/' : '/portfolio/';
    const t = useTranslations(lang);
    it(`records the completed latest Hablax tenure on ${route}`, () => {
      const source = page(route);
      const latest = source.match(/<article class="journey-item">([\s\S]*?)<\/article>/)?.[1] ?? '';
      expect(plain(latest)).toContain(lang === 'es' ? 'Nov 2023 — Ago 2026' : 'Nov 2023 — Aug 2026');
      expect(plain(latest)).toContain('Senior Backend Engineer');
      expect(plain(latest)).toContain('Hablax Inc.');
      expect(plain(latest)).toContain(lang === 'es' ? 'Lideré iniciativas con IA' : 'Led AI-driven initiatives');
      expect(plain(latest)).not.toMatch(/Present|Actualidad|Leading AI-driven|Lidero iniciativas/);
    });
    it(`removes current-role markers from the journey on ${route}`, () => {
      const journey = page(route).match(/<section[^>]*id="journey"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? '';
      expect(journey).toContain('class="journey-item"');
      expect(journey).not.toContain('current-pill');
      expect(plain(journey)).not.toMatch(/\b(?:Current|Actual)\b/);
    });
    it(`preserves career content and interactions on ${route}`, () => {
      const source = page(route);
      const copy = plain(source);
      const h1 = source.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
      expect(h1).toContain('class="sr-only"');
      expect(plain(h1)).toContain(`Gian Barboza — ${t('meta.h1.role')}`);
      expect(plain(source.match(/<p class="hero-role[^\"]*">([\s\S]*?)<\/p>/)?.[1] ?? '')).toBe(t('meta.h1.role'));
      for (const key of keys) {
        for (const field of ['title', 'context', 'problem', 'decision', 'outcome']) expect(copy).toContain(plain(t(`projects.${key}.${field}`)));
        expect(copy).toContain(plain(t(`term.case.${key}.metric`)));
        const disclosure = source.match(new RegExp(`<details\\b[^>]*id="case-${key}"[^>]*>([\\s\\S]*?)</details>`))?.[0] ?? '';
        expect(disclosure).toContain('<summary');
        expect(disclosure).toContain('data-close-case');
        expect(/\sopen(?:[\s=>])/.test(disclosure.split('>')[0] + '>')).toBe(key === 'rentoru');
        expect(disclosure).not.toContain('aria-expanded');
        expect(disclosure).not.toContain(' hidden');
        for (const field of ['context', 'problem', 'decision', 'outcome']) expect(plain(disclosure)).toContain(plain(t(`projects.${key}.${field}`)));
        for (const label of ['context', 'problem', 'decision', 'result']) expect(plain(disclosure)).toContain(t(`term.case.label.${label}`));
        expect(plain(disclosure)).toContain(t('portfolio.case.close'));
      }
      expect(source.match(/<details class="portfolio-case"/g)).toHaveLength(5);
      expect(source.match(/class="exp-card\b/g)).toHaveLength(5);
      for (const key of ['backend', 'architecture', 'infra', 'payments', 'ai']) expect(copy).toContain(t(`stack.${key}.title`));
      for (const key of ['now', 'freelance', 'cto', 'fermat']) for (const field of ['period', 'role', 'company', 'desc']) expect(copy).toContain(plain(t(`timeline.${key}.${field}`)));
      expect(source.match(/data-counter="/g)).toHaveLength(4);
      expect(source.match(new RegExp(`href="${t('cta.cv.url')}"`, 'g'))).toHaveLength(1);
      expect(source).toContain('href="https://rentoru.com"');
      expect(source).not.toContain('class="terminal"');
      expect(source).toContain('id="nav-clock"');
      expect(source).toContain('class="portfolio-side"');
      for (const key of ['p1', 'p2', 'p3', 'p4']) expect(copy).toContain(t(`term.terminal.${key}`));
      expect(source).toContain(`href="${lang === 'es' ? '/es/' : '/'}#contact"`);
      expect(source).toContain(`href="mailto:${t('contact.email')}"`);
      expect(source).toContain(`href="${t('contact.linkedin.url')}"`);
      expect(source).not.toContain('data-open-contact');
      expect(source).not.toContain('id="contact-modal"');
      const local = source.match(/<nav class="portfolio-local"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
      for (const id of ['journey', 'impact', 'cases', 'stack']) expect(local).toContain(`href="#${id}"`);
      expect(copy).toContain(t('portfolio.hero.eyebrow'));
      expect(copy).toContain(t('portfolio.principles'));
      expect(copy).toContain(t('portfolio.services'));
    });
  }
  it('retains the legacy direct-contact code without rendering it as the portfolio action', () => {
    const modal = readFileSync('src/components/ContactModal.astro', 'utf8');
    expect(modal).toContain('https://api.web3forms.com/submit');
    expect(modal).toContain('name="botcheck"');
    for (const length of [100, 200, 2000]) expect(modal).toContain(`maxlength="${length}"`);
    expect(modal).toContain('res.ok && json.success');
    const css = readFileSync('src/styles/global.css', 'utf8');
    expect(css).toContain(".case-sign::before { content: '+'; }");
    expect(css).toContain(".portfolio-case[open] .case-sign::before { content: '−'; }");
  });
  it('retains 404 and does not link to /en/', () => {
    expect(existsSync('dist/404.html')).toBe(true);
    for (const route of routes) expect(page(route)).not.toContain('href="/en/"');
    expect(readFileSync('dist/404.html', 'utf8')).not.toContain('href="/en/"');
  });
  it('retains robot rules and renders no untranslated keys', () => {
    for (const route of routes) {
      expect(page(route)).toContain(`<meta name="robots" content="${process.env.VERCEL_ENV === 'production' ? 'index,follow' : 'noindex,nofollow'}">`);
      expect(page(route)).not.toMatch(/>\s*(term|nav|meta|cta|projects)\.[a-z0-9.]+\s*</);
    }
  });
  it('retains the original portfolio social card and token synchronization', () => {
    const bytes = readFileSync('dist/og.png');
    expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
    for (const route of routes.filter(r => r.includes('portfolio'))) {
      expect(page(route)).toContain(`content="${site}/og.png"`);
      expect(page(route)).toContain(`content="${width}"`);
      expect(page(route)).toContain(`content="${height}"`);
      expect(page(route)).toContain('Software Architect');
    }
    const og = readFileSync('src/pages/og.png.ts', 'utf8');
    expect(og).toContain('Senior Backend Engineer & Software Architect');
    expect([...og.matchAll(/stat\('[^']+',\s*'([^']+)'/g)].length).toBeGreaterThan(0);
    const onPage = new Set([...page('/portfolio/').matchAll(/data-counter="([0-9.]+)"/g)].map(m => m[1]));
    for (const match of og.matchAll(/stat\('[^']+',\s*'([^']+)'/g)) expect(onPage).toContain(match[1].replace(/[^0-9.]/g, ''));
    const css = readFileSync('src/styles/global.css', 'utf8');
    for (const token of ['--bg: #0a0a0b', '--bg-elev: #111113', '--bg-card: #111113', '--fg: #f4f4f5', '--fg-muted: #b4b4bc', '--fg-dim: #b4b4bc', '--fg-faint: #85858f', '--border: #3d434c', '--border-strong: #3d434c', '--accent: #f2b75b', '--green: #8ac9a4']) expect(css).toContain(token);
    for (const [property, hex] of [['bg', '#0a0a0b'], ['bgElev', '#111113'], ['fg', '#f4f4f5'], ['fgMuted', '#b4b4bc'], ['fgDim', '#b4b4bc'], ['fgFaint', '#85858f'], ['border', '#3d434c'], ['borderStrong', '#3d434c'], ['accent', '#f2b75b'], ['green', '#8ac9a4']]) expect(og).toContain(`${property}: '${hex}'`);
  });
});

describe('impact reduced-motion runtime', () => {
  function counterRuntime(reduced = false) {
    const source = readFileSync('src/components/Impact.astro', 'utf8');
    const script = source.match(/<script is:inline>([\s\S]*?)<\/script>/)![1];
    const counters = [
      { dataset: { counter: '99.9', decimals: '1', locale: 'es' }, textContent: '' },
      { dataset: { counter: '200', prefix: '$', locale: 'en' }, textContent: '' },
    ];
    const frames = new Map<number, (now: number) => void>();
    const listeners: ((event: { matches: boolean }) => void)[] = [];
    const preference = { matches: reduced, addEventListener: (_: string, callback: typeof listeners[number]) => listeners.push(callback) };
    let intersect: (entries: unknown[]) => void;
    let id = 0;
    runInNewContext(script, {
      window: { matchMedia: () => preference },
      document: { readyState: 'complete', querySelectorAll: () => counters },
      performance: { now: () => 0 },
      requestAnimationFrame: (callback: (now: number) => void) => { frames.set(++id, callback); return id; },
      cancelAnimationFrame: (frame: number) => frames.delete(frame),
      IntersectionObserver: class {
        constructor(callback: typeof intersect) { intersect = callback; }
        observe() {}
        unobserve() {}
      },
    });
    return {
      counters, frames,
      start: () => intersect!(counters.map(target => ({ target, isIntersecting: true }))),
      tick: (now: number) => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(now)); },
      change: (matches: boolean) => { preference.matches = matches; listeners.forEach(callback => callback({ matches })); },
    };
  }
  it('finishes active localized counters immediately when reduced motion becomes enabled', () => {
    const runtime = counterRuntime();
    runtime.start();
    runtime.tick(200);
    expect(runtime.counters[0].textContent).not.toBe('99,9');
    runtime.change(true);
    expect(runtime.counters.map(counter => counter.textContent)).toEqual(['99,9', '$200']);
    expect(runtime.frames.size).toBe(0);
    runtime.change(false);
    expect(runtime.frames.size).toBe(0);
  });
  it('reads the current preference when counters enter view and still completes ordinary animation', () => {
    const runtime = counterRuntime();
    runtime.change(true);
    runtime.start();
    expect(runtime.counters.map(counter => counter.textContent)).toEqual(['99,9', '$200']);
    expect(runtime.frames.size).toBe(0);
    const animated = counterRuntime();
    animated.start();
    animated.tick(1400);
    expect(animated.counters.map(counter => counter.textContent)).toEqual(['99,9', '$200']);
    expect(animated.frames.size).toBe(0);
    const initial = counterRuntime(true);
    initial.start();
    expect(initial.frames.size).toBe(0);
    expect(initial.counters[0].textContent).toBe('99,9');
  });
});

describe('portfolio case navigation runtime', () => {
  it('restores hash summary focus after native landing, without reopening a closed or stale target', () => {
    const script = page('/portfolio/').match(/<script data-case-disclosures[^>]*>([\s\S]*?)<\/script>/)?.[1];
    const frames: (() => void)[] = [];
    const listeners: Record<string, () => void> = {};
    let active: unknown = null;
    const cards = ['infra', 'payments'].map(id => {
      const summary = { focus: vi.fn(() => { active = summary; }) };
      const button = { addEventListener: vi.fn(), closest: () => card };
      const card = { id: `case-${id}`, open: false, matches: () => true, querySelector: () => summary, scrollIntoView: vi.fn(), summary, button };
      return card;
    });
    const document = { readyState: 'loading', getElementById: (id: string) => cards.find(card => card.id === id), querySelectorAll: () => cards.map(card => card.button) };
    const location = { hash: '#case-infra' };
    runInNewContext(script!, { document, window: { location, requestAnimationFrame: (callback: () => void) => frames.push(callback), addEventListener: (name: string, callback: () => void) => { listeners[name] = callback; } } });
    const flush = () => { while (frames.length) frames.shift()!(); };
    expect(cards[0].open).toBe(true);
    // Native fragment landing may reset focus after the inline script runs.
    active = null;
    document.readyState = 'complete';
    listeners.load?.();
    flush();
    expect(active).toBe(cards[0].summary);
    location.hash = '#case-payments';
    listeners.hashchange();
    active = null;
    flush();
    expect(active).toBe(cards[1].summary);
    location.hash = '#case-infra';
    listeners.hashchange();
    cards[0].button.addEventListener.mock.calls[0][1]();
    flush();
    expect(cards[0].open).toBe(false);
    expect(cards[0].summary.focus).toHaveBeenLastCalledWith();
    location.hash = '#case-payments';
    listeners.hashchange();
    location.hash = '#contact';
    active = null;
    listeners.hashchange();
    flush();
    expect(active).toBeNull();
  });
  it('opens exact hash destinations initially and on hashchange; closes with summary focus', () => {
    const source = page('/portfolio/');
    const script = source.match(/<script data-case-disclosures[^>]*>([\s\S]*?)<\/script>/)?.[1];
    expect(script).toBeDefined();
    const ids = ['rentoru', 'payments', 'fraud', 'infra', 'seo'];
    const cards = ids.map(id => {
      const summary = { focus: vi.fn() };
      const button = { addEventListener: vi.fn(), closest: () => card };
      const card = { id: `case-${id}`, open: id === 'rentoru', matches: (selector: string) => selector === 'details.portfolio-case', querySelector: () => summary, scrollIntoView: vi.fn(), button, summary };
      return card;
    });
    const listeners: Record<string, () => void> = {};
    const location = { hash: '#case-infra' };
    runInNewContext(script!, {
      document: {
        readyState: 'complete',
        getElementById: (id: string) => cards.find(card => card.id === id),
        querySelectorAll: () => cards.map(card => card.button),
      },
      window: { location, requestAnimationFrame: (callback: () => void) => callback(), addEventListener: (name: string, callback: () => void) => { listeners[name] = callback; } },
    });
    expect(cards[0].open).toBe(true);
    expect(cards[3].open).toBe(true);
    expect(cards[3].summary.focus).toHaveBeenCalledWith({ preventScroll: true });
    for (const id of ['payments', 'fraud', 'seo']) {
      location.hash = `#case-${id}`;
      listeners.hashchange();
      const card = cards.find(card => card.id === `case-${id}`)!;
      expect(card.open).toBe(true);
      expect(card.scrollIntoView).toHaveBeenCalled();
      card.button.addEventListener.mock.calls[0][1]();
      expect(card.open).toBe(false);
      expect(card.summary.focus).toHaveBeenLastCalledWith();
    }
    const before = cards.map(card => card.open);
    for (const hash of ['#contact', '#case-missing', '#%E0%A4%A', '']) {
      location.hash = hash;
      expect(() => listeners.hashchange()).not.toThrow();
      expect(cards.map(card => card.open)).toEqual(before);
    }
  });
});

describe('approved shared shell', () => {
  it('uses the same monogram, global destinations and localized controls on all four routes', () => {
    for (const route of routes) {
      const source = page(route);
      const es = route.startsWith('/es/');
      const root = es ? '/es/' : '/';
      const portfolio = `${root}portfolio/`;
      const other = es ? '/' : '/es/';
      const locale = `${other}${route.includes('portfolio') ? 'portfolio/' : ''}`;
      expect(source.match(/class="site-logo"/g)).toHaveLength(2);
      expect(source.match(/M30 12H24C13 12 6 20/g)).toHaveLength(2);
      expect(source.match(/fill="currentColor"/g)!.length).toBeGreaterThanOrEqual(2);
      expect(source).toContain('class="site-nav"');
      expect(source).toContain('class="site-footer"');
      expect(source).toContain('aria-controls="site-navigation"');
      expect(source).toContain('aria-expanded="false"');
      expect(source).toMatch(new RegExp(`href="${locale}"[^>]*data-locale`));
      const nav = source.match(/<nav class="site-links"[^>]*>(.*?)<\/nav>/s)![1];
      expect(nav).toContain(`href="${root}"`);
      expect(nav).toContain(`href="${portfolio}"`);
      expect(nav).toContain(`href="${root}#contact"`);
      expect(nav.match(/aria-current="page"/g)).toHaveLength(1);
      expect(nav).not.toMatch(/href="#(?:journey|impact|cases|stack)"/);
      expect(source).toContain(`href="/favicon.ico"`);
      expect(source).not.toContain('href="/favicon.svg"');
      expect(source).toContain(`hreflang="x-default" href="${site}${route.includes('portfolio') ? '/portfolio/' : '/'}"`);
      expect(source).toContain("event.key === 'theme' || event.key === null");
      expect(source).toContain("stored ?? 'dark'");
    }
  });

  it('renders identical shared headers and footers within each language', () => {
    for (const root of ['/', '/es/']) {
      const home = page(root);
      const portfolio = page(`${root}portfolio/`);
      const footer = (source: string) => source.match(/<footer class="site-footer">([\s\S]*?)<\/footer>/)?.[0];
      expect(footer(portfolio)).toBe(footer(home));
      const brand = (source: string) => source.match(/<a class="site-mark"[^>]*>([\s\S]*?)<\/a>/)?.[0];
      expect(brand(portfolio)).toBe(brand(home));
    }
  });
  it('ships byte-identical approved assets and local font declarations', () => {
    const assets = {
      'favicon.ico': '63da9a2abe6a145cc90ad6ee65d708c64451953dd8dc44fc0061b652731f1a80',
      'fonts/inter-tight.woff2': '77fefe8ca19b9f69b5284832c519e0493127c1f091f0a8936884be7721c4e618',
      'fonts/inter-tight-ext.woff2': 'fd9beddaaec644945809da574cf1caf342073c7e4b46a2ea5bd136c8cf1a9eca',
      'fonts/jetbrains-mono.woff2': '18be452724bfdc236c074ca94a249a7f41a86752c7d04ab258ce9ed5651f6a7e',
    };
    for (const [asset, digest] of Object.entries(assets)) {
      expect(createHash('sha256').update(readFileSync(`public/${asset}`)).digest('hex')).toBe(digest);
      expect(readFileSync(`dist/${asset}`)).toEqual(readFileSync(`public/${asset}`));
    }
    const css = readFileSync('src/styles/global.css', 'utf8');
    expect(css).not.toContain('@import "@fontsource');
    for (const asset of Object.keys(assets).filter(path => path.endsWith('.woff2'))) expect(css).toContain(`url('/${asset}')`);
    expect(css).toContain('--accent-text:   #805400');
    expect(css).toContain('.site-logo { display: block; flex: none; width: 32px;');
    expect(css).toContain('.site-logo { width: 24px; }');
    expect(css).toContain('.site-links.is-open { display: flex; }');
    expect(css).not.toContain('position: sticky');
    expect(readFileSync('src/components/BrandMark.astro', 'utf8')).not.toContain('prefers-color-scheme');
  });
});

describe('shared control boundaries', () => {
  it('uses one contrast-safe token for both forms in both themes', () => {
    const global = readFileSync('src/styles/global.css', 'utf8');
    const home = readFileSync('src/styles/home.css', 'utf8');
    const token = '--control-border';
    const luminance = (hex: string) => {
      const channels = hex.match(/[a-f\d]{2}/gi)!.map(value => parseInt(value, 16) / 255)
        .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const themes = [global.match(/:root\s*\{([^}]+)\}/)![1], global.match(/html\.light\s*\{([^}]+)\}/)![1]];
    for (const theme of themes) {
      const color = theme.match(new RegExp(`${token}:\\s*(#[a-f\\d]{6})`, 'i'))?.[1];
      const background = theme.match(/--bg:\s*(#[a-f\d]{6})/i)?.[1];
      expect(color).toBeDefined();
      expect(background).toBeDefined();
      const levels = [luminance(color!), luminance(background!)].sort((a, b) => b - a);
      expect((levels[0] + 0.05) / (levels[1] + 0.05)).toBeGreaterThanOrEqual(3);
    }
    expect(global).toMatch(/\.modal-input\s*\{[^}]*border:\s*1px solid var\(--control-border\)/s);
    expect(home).toMatch(/\.home-page \.field input,\s*\.home-page \.field textarea\s*\{[^}]*border:\s*1px solid var\(--control-border\)/s);
  });
});

describe('inquiry boundary', () => {
  const valid = { name: 'Ada', email: 'ada@example.com', today: 'Payments fail', help: 'Investigate failures' };
  it('rejects missing, invalid and oversized input; accepts valid input', () => {
    expect(validateInquiry(valid)).toEqual([]);
    expect(validateInquiry({ ...valid, email: 'not-an-email' })).toContain('email');
    expect(validateInquiry({ ...valid, help: ' '.repeat(10) })).toContain('help');
    expect(validateInquiry({ ...valid, today: 'x'.repeat(5001) })).toContain('today');
    expect(allowedOrigin('https://evil.example')).toBe(false);
    expect(allowedOrigin('https://gianbarboza.com')).toBe(true);
  });
  const response = () => ({ setHeader() { return this; }, status(code: number) { this.code = code; return this; }, json(body: any) { this.body = body; return this; } } as any);
  const request = (body: any) => ({ method: 'POST', headers: { origin: 'https://gianbarboza.com', 'content-type': 'application/json' }, body } as any);
  it('rejects malformed bodies and invalid fields before delivery', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(() => { throw Error('unexpected fetch'); });
    try {
      for (const body of ['{broken', null, [], { ...valid, startedAt: Date.now() - 3000, email: 'invalid' }]) {
        const res = response();
        await handler(request(body), res);
        expect(res.code).toBe(400);
        expect(res.body.success).toBe(false);
        if (body && typeof body === 'object' && !Array.isArray(body)) expect(res.body.invalid).toContain('email');
      }
      expect(fetchMock).not.toHaveBeenCalled();
    } finally { fetchMock.mockRestore(); }
  });
  it('does not confirm an HTTP provider failure', async () => {
    const old = process.env.PUBLIC_WEB3FORMS_KEY; process.env.PUBLIC_WEB3FORMS_KEY = 'test-key';
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 500 } as any);
    try {
      const res = response();
      await handler(request({ ...valid, startedAt: Date.now() - 3000 }), res);
      expect(res.code).toBe(502);
      expect(res.body.success).toBe(false);
    } finally { fetchMock.mockRestore(); if (old === undefined) delete process.env.PUBLIC_WEB3FORMS_KEY; else process.env.PUBLIC_WEB3FORMS_KEY = old; }
  });
  it('returns 503 without the existing public variable even if a separate key is set', async () => {
    vi.stubEnv('PUBLIC_WEB3FORMS_KEY', undefined);
    vi.stubEnv('WEB3FORMS_KEY', 'unused-separate-key');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(() => { throw Error('unexpected fetch'); });
    try {
      const res = response();
      await handler(request({ ...valid, startedAt: Date.now() - 3000 }), res);
      expect(res.code).toBe(503);
      expect(res.body.success).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    } finally { fetchMock.mockRestore(); vi.unstubAllEnvs(); }
  });
  it('rejects the honeypot and early submissions before contacting provider', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(() => { throw Error('unexpected fetch'); });
    try { for (const body of [{ ...valid, startedAt: Date.now() - 3000, website: 'spam' }, { ...valid, startedAt: Date.now() }]) { const res = response(); await handler(request(body), res); expect(res.code).toBe(400); } expect(fetchMock).not.toHaveBeenCalled(); } finally { fetchMock.mockRestore(); }
  });
  it('uses only the existing public variable and confirms only provider acceptance', async () => {
    vi.stubEnv('PUBLIC_WEB3FORMS_KEY', 'existing-key-test-sentinel');
    vi.stubEnv('WEB3FORMS_KEY', undefined);
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    try {
      for (const accepted of [false, true]) {
        fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ success: accepted }) } as any);
        const res = response();
        await handler(request({ ...valid, startedAt: Date.now() - 3000 }), res);
        expect(res.code).toBe(accepted ? 200 : 502);
        expect(res.body.success).toBe(accepted);
        const [url, options] = fetchMock.mock.calls.at(-1)!;
        expect(url).toBe('https://api.web3forms.com/submit');
        expect(JSON.parse(options!.body as string).access_key).toBe('existing-key-test-sentinel');
      }
    } finally { fetchMock.mockRestore(); vi.unstubAllEnvs(); }
  });
  it('keeps provider transport exceptions as failure', async () => {
    vi.stubEnv('PUBLIC_WEB3FORMS_KEY', 'existing-key-test-sentinel');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('provider unavailable'));
    try {
      const res = response();
      await handler(request({ ...valid, startedAt: Date.now() - 3000 }), res);
      expect(res.code).toBe(502);
      expect(res.body.success).toBe(false);
    } finally { fetchMock.mockRestore(); vi.unstubAllEnvs(); }
  });
  it('does not embed provider key fields or environment references in built client output', () => {
    const clientFiles = readdirSync('dist/_astro', { recursive: true }).filter(file => /\.(?:js|mjs)$/.test(String(file)));
    expect(clientFiles.length).toBeGreaterThan(0);
    const output = [...routes.map(page), ...clientFiles.map(file => readFileSync(`dist/_astro/${file}`, 'utf8'))];
    for (const source of output) {
      expect(source).not.toMatch(/PUBLIC_WEB3FORMS_KEY|WEB3FORMS_KEY|access_key|existing-key-test-sentinel/);
      expect(source).not.toContain('https://api.web3forms.com/submit');
    }
  });
});

describe('approved services presentation', () => {
  for (const [route, portfolio, placeholders] of [
    ['/', '/portfolio/', ['Your name', 'you@company.com', 'Your company or product', 'For example: payment issues take too long to investigate.', 'For example: consistent provider handling and clearer failure states.', 'Share a range, if known', 'Share your target, if known']],
    ['/es/', '/es/portfolio/', ['Tu nombre', 'tu@empresa.com', 'Tu empresa o producto', 'Por ejemplo: investigar incidencias de pago lleva demasiado tiempo.', 'Por ejemplo: una gestión coherente de proveedores y fallos más claros.', 'Indica un rango, si lo conoces', 'Indica tu objetivo, si lo conoces']],
  ] as const) {
    it(`matches case destinations on ${route}`, () => {
      const source = page(route);
      const previews = source.match(/<a class="text-link"[^>]*href="([^"]+)"/g) ?? [];
      expect(previews.map(link => link.match(/href="([^"]+)"/)![1])).toEqual(
        ['infra', 'payments', 'fraud'].map(id => `${portfolio}#case-${id}`)
      );
    });
    it(`matches approved placeholders on ${route}`, () => {
      const source = page(route);
      for (const [i, key] of ['name', 'email', 'company', 'today', 'help', 'budget', 'timeline'].entries()) {
        const field = source.match(new RegExp(`<(?:input|textarea)[^>]*id="${key}"[^>]*>`))?.[0] ?? '';
        expect(field).toContain(`placeholder="${placeholders[i]}"`);
        expect(field).toContain(`aria-describedby="${key}-error`);
      }
      expect(source).toContain('action="/api/inquiry"');
      expect(source).toContain('result.success !== true');
      expect(source).not.toContain('local demonstration');
      expect(source).not.toContain('demostración local');
      expect(source).not.toContain('form.reset(');
      expect(source).toContain('Web3Forms');
      expect(source).toContain('id="inquiry-progress"');
      expect(source).toContain('class="feedback" role="status" tabindex="-1" hidden');
      expect(source).toContain("status.dataset.state = 'failure'");
      expect(source).toContain("status.dataset.state = 'success'");
      expect(source).toContain('submitLabel.textContent = idleLabel');
      expect(source).toContain('fields[0].focus()');
      expect(source.match(/class="service-top"/g)).toHaveLength(2);
      expect(source).toContain('d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-12-2 24"');
      expect(source).toContain('d="M3 12h26m-20 9h6"');
      expect(source.match(/d="M5 12h14M13 6l6 6-6 6"/g)).toHaveLength(7);
      const copy = route === '/' ? homeEn : homeEs;
      for (const heading of [copy.serviceTitle, copy.workTitle, copy.processTitle, copy.contactTitle, copy.closing, ...copy.cases.map(item => item[1])]) {
        expect(source).toContain(heading.replace('\n', '<br>'));
      }
    });
  }
});

describe('services social card', () => {
  it('uses a separate claim-free 1200x630 PNG on both homepages', () => {
    const bytes = readFileSync('dist/og-home.png');
    expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(bytes.readUInt32BE(16)).toBe(1200);
    expect(bytes.readUInt32BE(20)).toBe(630);
    const source = readFileSync('src/pages/og-home.png.ts', 'utf8');
    expect(source).not.toMatch(/\$200K|99\.9%|10\+\s*yrs|\b5\s*(?:payment|providers)/i);
    for (const route of ['/', '/es/']) {
      expect(page(route)).toContain(`property="og:image" content="${site}/og-home.png"`);
      expect(page(route)).toContain(`name="twitter:image" content="${site}/og-home.png"`);
      expect(page(route)).toContain('property="og:image:width" content="1200"');
      expect(page(route)).toContain('property="og:image:height" content="630"');
      expect(page(route)).not.toContain(`${site}/og.png`);
    }
  });
});

describe('built bilingual routes', () => {
  it('renders each route with its own canonical and locale-specific alternate pair', () => {
    for (const route of routes) {
      const html = page(route);
      const portfolio = route.includes('portfolio');
      const suffix = portfolio ? 'portfolio/' : '';
      expect(html).toContain(`<link rel="canonical" href="${site}${route}">`);
      expect(html).toContain(`hreflang="en" href="${site}/${suffix}"`);
      expect(html).toContain(`hreflang="es" href="${site}/es/${suffix}"`);
      expect(html).toContain(`<html lang="${route.startsWith('/es/') ? 'es' : 'en'}"`);
    }
    expect(existsSync('dist/en/index.html')).toBe(false);
  });
  it('lists exactly the four canonical routes', () => {
    const xml = readFileSync('dist/sitemap-0.xml', 'utf8');
    expect([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]).sort()).toEqual(routes.map(route => site + route).sort());
  });
  it('keeps career content only on portfolio and inquiry on the homepage', () => {
    for (const [home, portfolio, copy] of [['/', '/portfolio/', homeEn], ['/es/', '/es/portfolio/', homeEs]] as const) {
      expect(page(home)).toContain(copy.title);
      expect(page(home)).toContain('action="/api/inquiry"');
      expect(page(home)).not.toContain('https://api.web3forms.com/submit');
      expect(page(home)).toContain(`href="${portfolio}"`);
      expect(page(portfolio)).toContain('id="journey"');
      expect(page(portfolio)).toContain(`href="${home}#contact"`);
      expect(page(portfolio)).not.toContain('https://api.web3forms.com/submit');
    }
  });
});
