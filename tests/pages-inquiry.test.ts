import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onRequest } from '../functions/api/inquiry.js';

const url = 'https://gianbarboza.com/api/inquiry';
const notion = 'https://api.notion.com/v1/pages';
const pageId = '65c89056-0bb7-4e8d-b730-055214786269';
const dataSource = '11111111-2222-4333-8444-555555555555';
const env = {
  TURNSTILE_SECRET_KEY: 'turnstile-test-secret', RESEND_API_KEY: 'resend-test-secret',
  NOTION_API_TOKEN: 'notion-test-secret', NOTION_DATA_SOURCE_ID: dataSource,
  INQUIRY_FROM_EMAIL: 'inquiry@example.com', INQUIRY_TO_EMAIL: 'owner@example.com',
};
const inquiry = () => ({ name: 'Ada', email: 'ada@example.com', today: 'Payments fail',
  help: 'Investigate failures', startedAt: Date.now() - 3000, turnstileToken: 'fresh-token' });
const verified = { success: true, hostname: 'gianbarboza.com', action: 'inquiry' };
const saved = { object: 'page', id: pageId, parent: { type: 'data_source_id', data_source_id: dataSource } };
const result = (body: unknown) => ({ ok: true, json: async () => body }) as Response;
const request = (body: BodyInit | null = JSON.stringify(inquiry()), options: { method?: string; origin?: string; target?: string; contentType?: string; headers?: Record<string, string> } = {}) =>
  new Request(options.target || url, { method: options.method || 'POST',
    headers: { Origin: options.origin ?? 'https://gianbarboza.com',
      'Content-Type': options.contentType ?? 'application/json', ...options.headers },
    body: options.method === 'GET' ? undefined : body });
const send = (req: Request, bindings: Record<string, string> = env) =>
  onRequest({ request: req, env: bindings } as any);
let outbound: ReturnType<typeof vi.fn>;
beforeEach(() => {
  for (const key of Object.keys(env)) vi.stubEnv(key, undefined);
  outbound = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('unexpected outbound call'));
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe('Cloudflare Pages inquiry boundary', () => {
  it('rejects non-POST, foreign origins and untrusted content types before reading providers', async () => {
    expect((await send(request(null, { method: 'GET' }))).status).toBe(405);
    expect((await send(request(undefined, { origin: 'https://evil.example' }))).status).toBe(403);
    expect((await send(request(undefined, { contentType: 'text/plain' }))).status).toBe(415);
    expect(outbound).not.toHaveBeenCalled();
  });
  it('accepts only one explicitly configured HTTPS Pages preview origin and checks its Turnstile hostname', async () => {
    const preview = 'https://feature.project.pages.dev';
    const bindings = { ...env, INQUIRY_PREVIEW_ORIGIN: preview };
    outbound.mockResolvedValueOnce(result({ ...verified, hostname: 'feature.project.pages.dev' }))
      .mockResolvedValueOnce(result(saved)).mockResolvedValueOnce(result({ id: 'email-id' }))
      .mockResolvedValueOnce(result({ object: 'page', id: pageId }));
    expect((await send(request(undefined, { origin: preview, target: `${preview}/api/inquiry` }), bindings)).status).toBe(200);
    expect((await send(request(undefined, { origin: 'https://other.project.pages.dev' }), bindings)).status).toBe(403);
    expect((await send(request(undefined, { origin: 'http://feature.project.pages.dev' }), bindings)).status).toBe(403);
    expect(outbound).toHaveBeenCalledTimes(4);
  });
  it('blocks the Pages alias even when Origin spoofs the custom domain', async () => {
    const alias = 'https://project.pages.dev/api/inquiry';
    const response = await send(request(undefined, { target: alias, origin: 'https://gianbarboza.com' }));
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ success: false });
    expect(outbound).not.toHaveBeenCalled();
  });
  it('bounds the raw streamed request even without Content-Length and rejects malformed JSON', async () => {
    const oversized = await send(request(JSON.stringify({ ...inquiry(), today: 'x'.repeat(17000) })));
    expect(oversized.status).toBe(413);
    expect(await oversized.json()).toEqual({ success: false });
    expect((await send(request('{broken'))).status).toBe(400);
    expect(outbound).not.toHaveBeenCalled();
  });
  it('uses only Pages secret bindings, verifies Turnstile before Notion and Resend, and returns accepted JSON', async () => {
    outbound.mockResolvedValueOnce(result(verified)).mockResolvedValueOnce(result(saved))
      .mockResolvedValueOnce(result({ id: 'email-id' })).mockResolvedValueOnce(result({ object: 'page', id: pageId }));
    const response = await send(request());
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({ success: true, email: 'accepted', statusSync: 'updated' });
    expect(outbound.mock.calls.map(call => call[0])).toEqual([
      'https://challenges.cloudflare.com/turnstile/v0/siteverify', notion,
      'https://api.resend.com/emails', `${notion}/${pageId}`]);
    expect(outbound.mock.calls[0][1].body.get('secret')).toBe(env.TURNSTILE_SECRET_KEY);
    expect(outbound.mock.calls[1][1].headers.Authorization).toBe(`Bearer ${env.NOTION_API_TOKEN}`);
    expect(outbound.mock.calls[2][1].headers.Authorization).toBe(`Bearer ${env.RESEND_API_KEY}`);
  });
  it('retries email only on an existing saved page with a new verified Turnstile token', async () => {
    const original = inquiry();
    outbound.mockResolvedValueOnce(result(verified)).mockResolvedValueOnce(result(saved))
      .mockResolvedValueOnce({ ok: false } as Response).mockResolvedValueOnce(result({ object: 'page', id: pageId }));
    const first = await send(request(JSON.stringify(original)));
    expect(first.status).toBe(202);
    const pending = await first.json() as { success: boolean; email: string; retryToken: string };
    expect(pending).toMatchObject({ success: true, email: 'pending', retryToken: expect.any(String) });
    outbound.mockResolvedValueOnce(result(verified)).mockResolvedValueOnce(result(saved))
      .mockResolvedValueOnce(result({ id: 'second-email-id' })).mockResolvedValueOnce(result({ object: 'page', id: pageId }));
    const second = await send(request(JSON.stringify({ ...original, turnstileToken: 'new-token', retryToken: pending.retryToken })));
    expect(second.status).toBe(200);
    expect(outbound.mock.calls.slice(4).map(call => call[0])).toEqual([
      'https://challenges.cloudflare.com/turnstile/v0/siteverify', `${notion}/${pageId}`,
      'https://api.resend.com/emails', `${notion}/${pageId}`]);
  });
  it('fails closed when a Pages binding is missing and never leaks tokens in its response', async () => {
    const response = await send(request(), { ...env, NOTION_API_TOKEN: '' });
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ success: false });
    expect(outbound).not.toHaveBeenCalled();
  });
});
