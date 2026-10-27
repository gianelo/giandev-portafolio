import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler from '../api/inquiry.js';

const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const notionUrl = 'https://api.notion.com/v1/pages';
const resendUrl = 'https://api.resend.com/emails';
const pageId = '65c89056-0bb7-4e8d-b730-055214786269';
const dataSourceId = '11111111-2222-4333-8444-555555555555';
const config = {
  RESEND_API_KEY: 'resend-test-secret',
  INQUIRY_FROM_EMAIL: 'inquiry@example.com',
  INQUIRY_TO_EMAIL: 'owner@example.com',
  TURNSTILE_SECRET_KEY: 'turnstile-test-secret',
  NOTION_API_TOKEN: 'notion-test-secret',
  NOTION_DATA_SOURCE_ID: dataSourceId,
};
const valid = () => ({
  name: 'Ada', email: 'ada@example.com', company: 'Example',
  today: 'Payment failures', help: 'Diagnose retries', budget: 'Discuss',
  timeline: 'Next month', startedAt: Date.now() - 3000, turnstileToken: 'valid-token',
});
const request = (body: unknown = valid()) => ({ method: 'POST', headers: { origin: 'https://gianbarboza.com', 'content-type': 'application/json' }, body });
const response = () => ({ code: 0, body: undefined as unknown, setHeader: vi.fn(), status(code: number) { this.code = code; return this; }, json(body: unknown) { this.body = body; return this; } });
const jsonResponse = (body: unknown, ok = true) => ({ ok, json: async () => body }) as Response;
const verified = { success: true, hostname: 'gianbarboza.com', action: 'inquiry' };
const saved = { object: 'page', id: pageId, parent: { type: 'data_source_id', data_source_id: dataSourceId } };
let outbound: ReturnType<typeof vi.fn>;
beforeEach(() => {
  for (const [key, value] of Object.entries(config)) vi.stubEnv(key, value);
  outbound = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('unexpected outbound call'));
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });
async function run(body: unknown = valid()) {
  const res = response();
  await handler(request(body), res);
  expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
  return res;
}

// Required behavior first: use only mocked provider boundaries, never write a real inquiry.
describe('Notion and email delivery', () => {
  it('fails closed without the Notion server configuration before contacting providers', async () => {
    vi.stubEnv('NOTION_API_TOKEN', undefined);
    const res = await run();
    expect(res.code).toBe(503);
    expect(res.body).toEqual({ success: false });
    expect(outbound).not.toHaveBeenCalled();
  });

  it('does not save or email a rejected Turnstile challenge', async () => {
    outbound.mockResolvedValueOnce(jsonResponse({ ...verified, action: 'other' }));
    const res = await run();
    expect(res.code).toBe(400);
    expect(outbound.mock.calls.map(call => call[0])).toEqual([verifyUrl]);
  });

  it('stores all validated fields in the approved data source before notifying, excluding anti-bot values and secrets', async () => {
    outbound.mockResolvedValueOnce(jsonResponse(verified))
      .mockResolvedValueOnce(jsonResponse(saved))
      .mockResolvedValueOnce(jsonResponse({ id: 'email-id' }))
      .mockResolvedValueOnce(jsonResponse({ object: 'page', id: pageId }));
    const res = await run();
    expect(res.code).toBe(200);
    expect(res.body).toMatchObject({ success: true, email: 'accepted' });
    expect(outbound.mock.calls.map(call => call[0])).toEqual([verifyUrl, notionUrl, resendUrl, `${notionUrl}/${pageId}`]);
    const create = outbound.mock.calls[1][1]!;
    expect(create.method).toBe('POST');
    expect(create.headers).toMatchObject({ Authorization: `Bearer ${config.NOTION_API_TOKEN}`, 'Notion-Version': expect.any(String) });
    expect(create.signal).toBeInstanceOf(AbortSignal);
    const record = JSON.parse(String(create.body));
    expect(record.parent).toEqual({ type: 'data_source_id', data_source_id: dataSourceId });
    expect(record.properties['Consulta'].title[0].text.content).toBe('Ada — Example');
    expect(record.properties['Correo'].email).toBe('ada@example.com');
    for (const [property, value] of [['Nombre', 'Ada'], ['Empresa', 'Example'], ['Situación actual', 'Payment failures'], ['Ayuda solicitada', 'Diagnose retries'], ['Presupuesto', 'Discuss'], ['Plazo', 'Next month']]) {
      expect(record.properties[property].rich_text.map((part: { text: { content: string } }) => part.text.content).join('')).toBe(value);
    }
    expect(JSON.stringify(record)).not.toMatch(/valid-token|turnstile|startedAt|website|resend-test-secret|notion-test-secret/);
    const update = outbound.mock.calls[3][1]!;
    expect(JSON.parse(String(update.body)).properties['Aviso por email']).toEqual({ select: { name: 'Aceptado por Resend' } });
  });

  it('does not email when Notion rejects a write or its result does not prove a page in the target source', async () => {
    outbound.mockResolvedValueOnce(jsonResponse(verified)).mockResolvedValueOnce(jsonResponse({ message: 'error' }, false));
    const res = await run();
    expect(res.code).toBe(502);
    expect(outbound.mock.calls.map(call => call[0])).toEqual([verifyUrl, notionUrl]);
  });

  it('chunks each 5000-character textarea without splitting surrogate pairs', async () => {
    const input = { ...valid(), today: '𝄞'.repeat(2500), help: 'x'.repeat(5000) };
    outbound.mockResolvedValueOnce(jsonResponse(verified)).mockResolvedValueOnce(jsonResponse(saved))
      .mockResolvedValueOnce(jsonResponse({ id: 'email-id' })).mockResolvedValueOnce(jsonResponse({ object: 'page', id: pageId }));
    const res = await run(input);
    expect(res.code).toBe(200);
    const properties = JSON.parse(String(outbound.mock.calls[1][1]!.body)).properties;
    for (const [key, original] of [['Situación actual', input.today], ['Ayuda solicitada', input.help]] as const) {
      const parts = properties[key].rich_text.map((item: { text: { content: string } }) => item.text.content);
      expect(parts.join('')).toBe(original);
      expect(parts.every((part: string) => [...part].length <= 2000)).toBe(true);
    }
  });

  it('confirms the saved record but marks the email pending when Resend fails, without claiming inbox delivery', async () => {
    outbound.mockResolvedValueOnce(jsonResponse(verified)).mockResolvedValueOnce(jsonResponse(saved))
      .mockResolvedValueOnce(jsonResponse({}, false)).mockResolvedValueOnce(jsonResponse({ object: 'page', id: pageId }));
    const res = await run();
    expect(res.code).toBe(202);
    expect(res.body).toMatchObject({ success: true, email: 'pending', retryToken: expect.any(String) });
    expect(JSON.parse(String(outbound.mock.calls[3][1]!.body)).properties['Aviso por email']).toEqual({ select: { name: 'Falló' } });
  });

  it('retries only email for a confirmed partial submission after a fresh valid challenge', async () => {
    const input = valid();
    outbound.mockResolvedValueOnce(jsonResponse(verified)).mockResolvedValueOnce(jsonResponse(saved))
      .mockResolvedValueOnce(jsonResponse({}, false)).mockResolvedValueOnce(jsonResponse({ object: 'page', id: pageId }));
    const partial = await run(input);
    expect(partial.code).toBe(202);
    const firstKey = (outbound.mock.calls[2][1]!.headers as Record<string, string>)['Idempotency-Key'];
    outbound.mockClear();
    outbound.mockResolvedValueOnce(jsonResponse(verified)).mockResolvedValueOnce(jsonResponse(saved))
      .mockResolvedValueOnce(jsonResponse({ id: 'email-id' })).mockResolvedValueOnce(jsonResponse({ object: 'page', id: pageId }));
    const retry = await run({ ...input, turnstileToken: 'fresh-token', retryToken: (partial.body as { retryToken: string }).retryToken });
    expect(retry.code).toBe(200);
    expect(outbound.mock.calls.map(call => call[0])).toEqual([verifyUrl, `${notionUrl}/${pageId}`, resendUrl, `${notionUrl}/${pageId}`]);
    expect((outbound.mock.calls[2][1]!.headers as Record<string, string>)['Idempotency-Key']).toBe(firstKey);
  });

  it('rejects tampered retry references before any provider call', async () => {
    const res = await run({ ...valid(), retryToken: `${pageId}.invalid` });
    expect(res.code).toBe(400);
    expect(outbound).not.toHaveBeenCalled();
  });
});
