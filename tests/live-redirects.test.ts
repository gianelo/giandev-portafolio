import { describe, expect, it } from 'vitest';

/**
 * Assertions against a running deployment.
 *
 * The other two suites cover rules and generated HTML. Neither can see
 * `vercel.json`: it produces nothing in `dist/` and is only interpreted by
 * Vercel's router at request time. That blind spot shipped a live 404 on
 * `/en/` — the exact URL the redirect existed to catch.
 *
 * Network-bound, so this is not part of `test:all`. Run it against a preview
 * before promoting, and against production after:
 *   SITE_URL=https://<preview>.vercel.app npm run test:live
 */
const BASE = (process.env.SITE_URL ?? 'https://gianbarboza.com').replace(/\/$/, '');

async function head(path: string) {
  const response = await fetch(`${BASE}${path}`, {
    method: 'HEAD',
    redirect: 'manual',
  });
  return { status: response.status, location: response.headers.get('location') };
}

describe(`deployment at ${BASE}`, () => {
  // Every spelling of the retired route has to land on the canonical home.
  // `/en/` is the one that matters: it is what the old switcher linked to and
  // what crawlers already know, and it is the one a `/en/:path*` rule misses.
  it.each(['/en/', '/en', '/en/anything'])(
    'redirects %s to the site root with a 301',
    async (path) => {
      const { status, location } = await head(path);

      expect(status, `${path} status`).toBe(301);
      expect(new URL(location ?? '', BASE).pathname, `${path} target`).toBe('/');
    },
  );

  it.each(['/', '/es/'])('serves %s', async (path) => {
    expect((await head(path)).status).toBe(200);
  });

  it('answers an unknown route with a real 404', async () => {
    expect((await head('/definitely-not-a-page')).status).toBe(404);
  });

  // Regression guard: a path merely starting with "es" is not the Spanish
  // locale and must not resolve to a page.
  it('does not resolve /estadisticas as a locale', async () => {
    expect((await head('/estadisticas')).status).toBe(404);
  });
});
