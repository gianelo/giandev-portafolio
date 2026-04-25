import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * ⚠️ PALETTE SYNC REQUIRED
 *
 * Satori renders from inline styles — it cannot read CSS variables
 * defined in global.css. Whenever the active palette changes in
 * global.css (PALETTE SYSTEM block), the colors in this file MUST
 * be updated to match.
 *
 * Active palette: Star Wars Crawl
 *   - Background: dark (#000000) with subtle yellow tint at top
 *   - Primary accent: crawl yellow #FFE81F (badge, CTA gradient)
 *   - Secondary accent: sable blue #60a5fa (subtitle)
 *   - Tech pills: yellow-tinted borders on dark
 *   - Footer URL color: white at low opacity
 */

export async function GET() {
  const fontData = readFileSync(
    resolve(process.cwd(), 'src/assets/fonts/inter-400.ttf')
  );

  const pills = ['Node.js', 'TypeScript', 'Payments', 'Distributed Systems', 'AI'].map((tech) => ({
    type: 'span' as const,
    props: {
      style: {
        background: 'rgba(255, 232, 31, 0.06)',
        border: '1px solid rgba(255, 232, 31, 0.25)',
        borderRadius: '100px',
        padding: '10px 22px',
        fontSize: '18px',
        color: '#f5f5f5',
      },
      children: tech,
    },
  }));

  const element = {
    type: 'div' as const,
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, #1a1700 0%, #000000 55%, #000000 100%)',
        padding: '80px',
        fontFamily: 'Inter',
      },
      children: [
        // Main content block
        {
          type: 'div' as const,
          props: {
            style: { display: 'flex', flexDirection: 'column' as const },
            children: [
              // Badge "Available for remote work"
              {
                type: 'div' as const,
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    alignSelf: 'flex-start',
                    gap: '10px',
                    background: 'rgba(255, 232, 31, 0.10)',
                    border: '1px solid rgba(255, 232, 31, 0.45)',
                    borderRadius: '100px',
                    padding: '8px 20px',
                    marginBottom: '36px',
                  },
                  children: [
                    {
                      type: 'div' as const,
                      props: {
                        style: {
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: '#FFE81F',
                          marginRight: '4px',
                          flexShrink: 0,
                        },
                        children: ' ',
                      },
                    },
                    {
                      type: 'span' as const,
                      props: {
                        style: { color: '#FFE81F', fontSize: '18px' },
                        children: 'Available for remote work',
                      },
                    },
                  ],
                },
              },
              // Name
              {
                type: 'div' as const,
                props: {
                  style: {
                    fontSize: '82px',
                    fontWeight: 700,
                    color: 'white',
                    lineHeight: 1.1,
                    marginBottom: '14px',
                    letterSpacing: '-3px',
                  },
                  children: 'Gian Barboza',
                },
              },
              // Subtitle
              {
                type: 'div' as const,
                props: {
                  style: {
                    fontSize: '34px',
                    fontWeight: 400,
                    color: '#60a5fa',
                    marginBottom: '52px',
                  },
                  children: 'Senior Backend Engineer · Payments & AI',
                },
              },
              // Tech pills row
              {
                type: 'div' as const,
                props: {
                  style: { display: 'flex', gap: '12px', flexWrap: 'wrap' as const },
                  children: pills,
                },
              },
            ],
          },
        },
        // Footer: CTA + URL
        {
          type: 'div' as const,
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            },
            children: [
              {
                type: 'div' as const,
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    background: 'linear-gradient(90deg, #FFE81F 0%, #e6cf00 100%)',
                    borderRadius: '100px',
                    padding: '16px 32px',
                    color: '#000000',
                    fontSize: '22px',
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                  },
                  children: 'View Portfolio →',
                },
              },
              {
                type: 'div' as const,
                props: {
                  style: { color: 'rgba(255,255,255,0.4)', fontSize: '18px' },
                  children: 'gianbarboza.com',
                },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(element as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: fontData, weight: 400, style: 'normal' },
      { name: 'Inter', data: fontData, weight: 700, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const pngBuffer = resvg.render().asPng();

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
