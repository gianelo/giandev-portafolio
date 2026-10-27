// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Final production origin: Vercel 308s the apex to www, so canonical,
  // hreflang, og:url and the sitemap must use www to avoid a redirect hop.
  site: 'https://www.gianbarboza.com',
  // /en/ used to be a duplicate of the site root. It is no longer built; the
  // 301 that catches any remaining inbound link lives in vercel.json, so that
  // one redirect has a single owner instead of two competing ones.
  integrations: [sitemap()],
});
