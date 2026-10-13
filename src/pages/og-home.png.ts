import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Independent services card: no career metrics or locale-dependent copy.
export async function GET() {
  const fontData = readFileSync(resolve(process.cwd(), 'src/assets/fonts/inter-400.ttf'));
  const element = {
    type: 'div' as const,
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '72px 80px',
        background: '#0a0a0b',
        color: '#f4f4f5',
        fontFamily: 'Inter',
      },
      children: [
        {
          type: 'div' as const,
          props: {
            style: { display: 'flex', fontSize: '24px', letterSpacing: '-0.02em' },
            children: [
              { type: 'span' as const, props: { children: 'Gian Barboza' } },
              { type: 'span' as const, props: { style: { color: '#f2b75b' }, children: '.' } },
            ],
          },
        },
        {
          type: 'div' as const,
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '28px',
              paddingLeft: '32px',
              borderLeft: '4px solid #f2b75b',
            },
            children: [
              {
                type: 'div' as const,
                props: {
                  style: { fontSize: '68px', lineHeight: 1.08, letterSpacing: '-0.04em', maxWidth: '980px' },
                  children: 'Backend engineering & software architecture',
                },
                },
              {
                type: 'div' as const,
                props: {
                  style: { fontSize: '26px', color: '#b4b4bc' },
                  children: 'Engineering services · Servicios de ingeniería',
                },
              },
            ],
          },
        },
        {
          type: 'div' as const,
          props: {
            style: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #3d434c', paddingTop: '24px', fontSize: '20px', color: '#b4b4bc' },
            children: [
              { type: 'span' as const, props: { children: 'Gian Barboza' } },
              { type: 'span' as const, props: { children: 'gianbarboza.com' } },
            ],
          },
        },
      ],
    },
  };
  const svg = await satori(element as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Inter', data: fontData, weight: 400, style: 'normal' }],
  });
  const png = new Uint8Array(new Resvg(svg).render().asPng());
  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
