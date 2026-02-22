import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export async function GET() {
  const fontData = readFileSync(
    resolve(process.cwd(), 'src/assets/fonts/inter-400.ttf')
  );

  const pills = ['Node.js', 'TypeScript', 'Payments', 'Distributed Systems', 'AI'].map((tech) => ({
    type: 'span' as const,
    props: {
      style: {
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '100px',
        padding: '10px 22px',
        fontSize: '18px',
        color: '#e2e8f0',
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
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a1060 50%, #0f0c29 100%)',
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
                    background: 'rgba(250, 204, 21, 0.12)',
                    border: '1px solid rgba(250, 204, 21, 0.4)',
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
                          background: '#facc15',
                          marginRight: '4px',
                          flexShrink: 0,
                        },
                        children: ' ',
                      },
                    },
                    {
                      type: 'span' as const,
                      props: {
                        style: { color: '#facc15', fontSize: '18px' },
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
                    color: '#a5b4fc',
                    marginBottom: '52px',
                  },
                  children: 'Senior Backend Engineer',
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
        // Footer URL
        {
          type: 'div' as const,
          props: {
            style: { color: 'rgba(255,255,255,0.3)', fontSize: '16px' },
            children: 'giandev-portafolio.vercel.app',
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
