// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://gianbarboza.com',
  // /en/ used to be a duplicate of the site root. It is no longer built; the
  // 301 that catches any remaining inbound link lives in vercel.json, so that
  // one redirect has a single owner instead of two competing ones.
  integrations: [sitemap()],
});
