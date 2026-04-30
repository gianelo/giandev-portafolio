import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * PALETTE SYNC REQUIRED
 *
 * Satori cannot read CSS variables — colors below are hex equivalents
 * of the tokens in src/styles/global.css. If the palette in global.css
 * changes (--bg, --accent, --green, --fg), update this file too.
 *
 * Active aesthetic: refined dark terminal (Linear-meets-terminal).
 *   --bg            #0a0a0b
 *   --bg-elev       #111113
 *   --bg-card       #131316
 *   --accent        oklch(0.82 0.16 85)  ≈ #e2b94f  (warm amber)
 *   --green         oklch(0.78 0.16 150) ≈ #3fc480  (live indicator)
 *   --fg            rgba(255,255,255,0.94)
 *   --fg-muted      rgba(255,255,255,0.62)
 *   --fg-dim        rgba(255,255,255,0.42)
 *   --border        rgba(255,255,255,0.07)
 *   --border-strong rgba(255,255,255,0.12)
 */

const C = {
  bg: '#0a0a0b',
  bgElev: '#111113',
  accent: '#e2b94f',
  accentSoft: 'rgba(226, 185, 79, 0.10)',
  accentBorder: 'rgba(226, 185, 79, 0.28)',
  green: '#3fc480',
  fg: 'rgba(255, 255, 255, 0.94)',
  fgMuted: 'rgba(255, 255, 255, 0.62)',
  fgDim: 'rgba(255, 255, 255, 0.42)',
  fgFaint: 'rgba(255, 255, 255, 0.24)',
  border: 'rgba(255, 255, 255, 0.07)',
  borderStrong: 'rgba(255, 255, 255, 0.12)',
};

export async function GET() {
  const fontData = readFileSync(
    resolve(process.cwd(), 'src/assets/fonts/inter-400.ttf')
  );

  const stat = (label: string, value: string) => ({
    type: 'div' as const,
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '6px',
        paddingRight: '40px',
        borderRight: `1px solid ${C.border}`,
        marginRight: '40px',
      },
      children: [
        {
          type: 'div' as const,
          props: {
            style: {
              fontSize: '32px',
              fontWeight: 500,
              color: C.fg,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            },
            children: value,
          },
        },
        {
          type: 'div' as const,
          props: {
            style: {
              fontSize: '13px',
              color: C.fgDim,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
            },
            children: label,
          },
        },
      ],
    },
  });

  const element = {
    type: 'div' as const,
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'space-between',
        background: `radial-gradient(ellipse 900px 480px at 50% -10%, rgba(226, 185, 79, 0.10), transparent 60%), ${C.bg}`,
        padding: '72px 80px',
        fontFamily: 'Inter',
        position: 'relative' as const,
      },
      children: [
        // Top row: status pill
        {
          type: 'div' as const,
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase' as const,
              color: C.fgDim,
            },
            children: [
              {
                type: 'div' as const,
                props: {
                  style: {
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: C.green,
                    boxShadow: `0 0 12px ${C.green}`,
                    flexShrink: 0,
                  },
                  children: ' ',
                },
              },
              {
                type: 'span' as const,
                props: {
                  style: { color: C.green, fontWeight: 500 },
                  children: 'Available',
                },
              },
              {
                type: 'span' as const,
                props: { style: { color: C.fgFaint }, children: '·' },
              },
              {
                type: 'span' as const,
                props: { children: 'Rionegro, CO · GMT-5' },
              },
              {
                type: 'span' as const,
                props: { style: { color: C.fgFaint }, children: '·' },
              },
              {
                type: 'span' as const,
                props: { children: '10+ yrs' },
              },
            ],
          },
        },

        // Middle: name + tagline
        {
          type: 'div' as const,
          props: {
            style: { display: 'flex', flexDirection: 'column' as const },
            children: [
              {
                type: 'div' as const,
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'baseline',
                    fontSize: '128px',
                    fontWeight: 500,
                    color: C.fg,
                    letterSpacing: '-0.05em',
                    lineHeight: 0.95,
                    marginBottom: '24px',
                  },
                  children: [
                    {
                      type: 'span' as const,
                      props: { children: 'Gian Barboza' },
                    },
                    {
                      type: 'span' as const,
                      props: {
                        style: { color: C.accent, fontWeight: 400 },
                        children: '.',
                      },
                    },
                  ],
                },
              },
              {
                type: 'div' as const,
                props: {
                  style: {
                    fontSize: '28px',
                    fontWeight: 400,
                    color: C.fgMuted,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.35,
                    maxWidth: '960px',
                  },
                  children:
                    'Senior backend engineer · Distributed payments infrastructure & AI-powered automation.',
                },
              },
            ],
          },
        },

        // Bottom row: stats + URL
        {
          type: 'div' as const,
          props: {
            style: {
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              width: '100%',
              paddingTop: '40px',
              borderTop: `1px solid ${C.border}`,
            },
            children: [
              {
                type: 'div' as const,
                props: {
                  style: { display: 'flex', alignItems: 'center' },
                  children: [
                    stat('Uptime', '99.9%'),
                    stat('Gateways', '5+'),
                    {
                      type: 'div' as const,
                      props: {
                        style: {
                          display: 'flex',
                          flexDirection: 'column' as const,
                          gap: '6px',
                        },
                        children: [
                          {
                            type: 'div' as const,
                            props: {
                              style: {
                                fontSize: '32px',
                                fontWeight: 500,
                                color: C.fg,
                                letterSpacing: '-0.02em',
                                lineHeight: 1,
                              },
                              children: 'Ex-CTO',
                            },
                          },
                          {
                            type: 'div' as const,
                            props: {
                              style: {
                                fontSize: '13px',
                                color: C.fgDim,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase' as const,
                              },
                              children: 'Payments · AI',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                type: 'div' as const,
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '16px',
                    color: C.fgDim,
                    letterSpacing: '0.04em',
                  },
                  children: [
                    {
                      type: 'span' as const,
                      props: { children: 'gianbarboza.com' },
                    },
                    {
                      type: 'span' as const,
                      props: {
                        style: { color: C.accent },
                        children: '↗',
                      },
                    },
                  ],
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
      { name: 'Inter', data: fontData, weight: 500, style: 'normal' },
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
