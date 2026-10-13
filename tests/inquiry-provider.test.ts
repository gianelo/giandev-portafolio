import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler from '../api/inquiry.js';

const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const resendUrl = 'https://api.resend.com/emails';
const config = { RESEND_API_KEY: 'resend-test-secret', INQUIRY_FROM_EMAIL: 'Portfolio <inquiry@example.com>', INQUIRY_TO_EMAIL: 'owner@example.com', TURNSTILE_SECRET_KEY: 'turnstile-test-secret' };
const valid = () => ({ name: 'Ada', email: 'ada@example.com', company: 'Example', today: 'Payments fail', help: 'Investigate failures', budget: 'Discuss', timeline: 'Next month', startedAt: Date.now() - 3000, turnstileToken: 'test-token' });
const request = (body: unknown = valid()) => ({ method: 'POST', headers: { origin: 'https://gianbarboza.com', 'content-type': 'application/json' } as Record<string, string>, body });
const response = () => ({ code: 0, body: undefined as unknown, setHeader: vi.fn(), status(code: number) { this.code = code; return this; }, json(body: unknown) { this.body = body; return this; } });
const jsonResponse = (body: unknown, ok = true) => ({ ok, json: async () => body }) as Response;
const verified = { success: true, hostname: 'gianbarboza.com', action: 'inquiry' };
let outbound: ReturnType<typeof vi.fn>;
beforeEach(() => {
  for (const [key, value] of Object.entries(config)) vi.stubEnv(key, value);
  vi.stubEnv('PUBLIC_WEB3FORMS_KEY', 'obsolete-test-key');
  outbound = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('unexpected outbound call'));
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });
async function run(req = request(), code = 400, body: unknown = { success: false }) {
  const res = response();
  await handler(req, res);
  expect(res.code).toBe(code);
  expect(res.body).toEqual(body);
  expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
  return res;
}
function noResend() {
  expect(outbound.mock.calls.map(call => call[0])).not.toContain(resendUrl);
}

describe('inquiry pre-delivery rejection', () => {
  it.each(Object.keys(config))('fails closed without %s, ignoring legacy public key', async key => {
    vi.stubEnv(key, undefined);
    await run(request(), 503);
    expect(outbound).not.toHaveBeenCalled();
  });
  it.each(Object.keys(config))('fails closed with whitespace-only %s', async key => {
    vi.stubEnv(key, '   ');
    await run(request(), 503);
    expect(outbound).not.toHaveBeenCalled();
  });
  it.each([undefined, null, '', '  ', 42, {}, 'x'.repeat(2049)])('rejects malformed or missing token %j before any outbound call', async token => {
    await run(request({ ...valid(), turnstileToken: token }));
    expect(outbound).not.toHaveBeenCalled();
  });
  it.each([
    ['method', 405, (req: ReturnType<typeof request>) => { req.method = 'GET'; }],
    ['origin', 403, (req: ReturnType<typeof request>) => { req.headers.origin = 'https://evil.example'; }],
    ['content type', 415, (req: ReturnType<typeof request>) => { req.headers['content-type'] = 'text/plain'; }],
    ['declared size', 413, (req: ReturnType<typeof request>) => { req.headers['content-length'] = '16001'; }],
    ['invalid length', 413, (req: ReturnType<typeof request>) => { req.headers['content-length'] = '-1'; }],
    ['parsed size', 413, (req: ReturnType<typeof request>) => { req.body = { ...valid(), extra: 'x'.repeat(16001) }; }],
    ['honeypot', 400, (req: ReturnType<typeof request>) => { req.body = { ...valid(), website: 'spam' }; }],
    ['nonstring honeypot', 400, (req: ReturnType<typeof request>) => { req.body = { ...valid(), website: true }; }],
    ['early submit', 400, (req: ReturnType<typeof request>) => { req.body = { ...valid(), startedAt: Date.now() }; }],
    ['expired submit', 400, (req: ReturnType<typeof request>) => { req.body = { ...valid(), startedAt: Date.now() - 86400001 }; }],
    ['missing timing', 400, (req: ReturnType<typeof request>) => { req.body = { ...valid(), startedAt: undefined }; }],
  ] as const)('retains %s rejection without side effects', async (_, code, change) => {
    const req = request(); change(req);
    await run(req, code);
    expect(outbound).not.toHaveBeenCalled();
  });
  it.each(['{broken', null, [], 1])('rejects malformed body %j without outbound call', async body => {
    await run(request(body));
    expect(outbound).not.toHaveBeenCalled();
  });
  it('rejects unserializable input without outbound call', async () => {
    const body: Record<string, unknown> = valid(); body.self = body;
    await run(request(body));
    expect(outbound).not.toHaveBeenCalled();
  });
  it.each([
    ['email', 'invalid'], ['name', ' '], ['today', 'x'.repeat(5001)], ['help', 42], ['company', {}], ['budget', 'x'.repeat(201)], ['timeline', false],
  ])('retains invalid %s field rejection without outbound call', async (field, value) => {
    await run(request({ ...valid(), [field as string]: value }), 400, { success: false, invalid: [field] });
    expect(outbound).not.toHaveBeenCalled();
  });
});

describe('Turnstile server authorization', () => {
  it.each([
    { ...verified, success: false }, { ...verified, success: 'true' }, { ...verified, hostname: 'evil.example' },
    { ...verified, hostname: undefined }, { ...verified, action: 'contact' }, { ...verified, action: undefined }, null,
  ])('rejects unverified/mismatched Siteverify result %j before Resend', async result => {
    outbound.mockResolvedValueOnce(jsonResponse(result));
    await run();
    expect(outbound).toHaveBeenCalledOnce();
    expect(outbound.mock.calls[0][0]).toBe(verifyUrl);
    noResend();
  });
  it.each(['http', 'transport', 'timeout', 'json'])('keeps Siteverify %s failure at 502 without Resend', async failure => {
    if (failure === 'http') outbound.mockResolvedValueOnce(jsonResponse({}, false));
    else if (failure === 'json') outbound.mockResolvedValueOnce({ ok: true, json: async () => { throw Error('invalid json'); } } as unknown as Response);
    else outbound.mockRejectedValueOnce(new Error(failure));
    await run(request(), 502);
    expect(outbound).toHaveBeenCalledOnce();
    expect(outbound.mock.calls[0][0]).toBe(verifyUrl);
    noResend();
  });
  it.each(['gianbarboza.com', 'www.gianbarboza.com', 'preview.example.vercel.app'])('matches the actual request Origin hostname %s', async hostname => {
    vi.stubEnv('VERCEL_URL', 'preview.example.vercel.app');
    const req = request(); req.headers.origin = `https://${hostname}`;
    outbound.mockResolvedValueOnce(jsonResponse({ ...verified, hostname })).mockResolvedValueOnce(jsonResponse({ id: 'email-id' }));
    await run(req, 200, { success: true });
    expect(outbound.mock.calls.map(call => call[0])).toEqual([verifyUrl, resendUrl]);
  });
  it('does not accept the canonical hostname for a www Origin', async () => {
    const req = request(); req.headers.origin = 'https://www.gianbarboza.com';
    outbound.mockResolvedValueOnce(jsonResponse(verified));
    await run(req);
    expect(outbound).toHaveBeenCalledOnce(); noResend();
  });
});

describe('Resend API acceptance boundary', () => {
  it('verifies before sending an authenticated fixed-subject plain-text message with snake_case reply_to and timeouts', async () => {
    const input = { ...valid(), name: 'Ada <b>Test</b>', today: 'Line one\nLine two', extra: 'do not forward', subject: 'do not use' };
    outbound.mockResolvedValueOnce(jsonResponse(verified)).mockResolvedValueOnce(jsonResponse({ id: 'email-id' }));
    await run(request(input), 200, { success: true });
    expect(outbound.mock.calls.map(call => call[0])).toEqual([verifyUrl, resendUrl]);
    const verify = outbound.mock.calls[0][1]!;
    expect(verify.method).toBe('POST');
    const verifyBody = new URLSearchParams(String(verify.body));
    expect(verifyBody.get('secret')).toBe(config.TURNSTILE_SECRET_KEY);
    expect(verifyBody.get('response')).toBe(input.turnstileToken);
    expect(verify.signal).toBeInstanceOf(AbortSignal);
    const send = outbound.mock.calls[1][1]!;
    expect(send.method).toBe('POST');
    expect(send.headers).toEqual({ 'Content-Type': 'application/json', Authorization: `Bearer ${config.RESEND_API_KEY}`, 'Idempotency-Key': expect.stringMatching(/^inquiry\/[a-f0-9]{64}$/) });
    expect(send.signal).toBeInstanceOf(AbortSignal);
    const payload = JSON.parse(String(send.body));
    expect(payload).toEqual({ from: config.INQUIRY_FROM_EMAIL, to: [config.INQUIRY_TO_EMAIL], subject: 'Project inquiry — gianbarboza.com', reply_to: input.email, text: expect.any(String) });
    for (const field of ['name', 'email', 'company', 'today', 'help', 'budget', 'timeline'] as const) expect(payload.text).toContain(input[field]);
    for (const excluded of ['do not forward', 'do not use', input.turnstileToken, config.RESEND_API_KEY, config.TURNSTILE_SECRET_KEY]) expect(payload.text).not.toContain(excluded);
  });
  it('reuses the idempotency key after an uncertain response and changes it for changed inquiry text', async () => {
    const inquiry = valid();
    outbound.mockResolvedValueOnce(jsonResponse(verified)).mockRejectedValueOnce(new Error('response lost'));
    await run(request(inquiry), 502);
    outbound.mockResolvedValueOnce(jsonResponse(verified)).mockResolvedValueOnce(jsonResponse({ id: 'accepted' }));
    await run(request(inquiry), 200, { success: true });
    outbound.mockResolvedValueOnce(jsonResponse(verified)).mockResolvedValueOnce(jsonResponse({ id: 'another-id' }));
    await run(request({ ...inquiry, help: 'A different problem' }), 200, { success: true });
    const keys = outbound.mock.calls.filter(call => call[0] === resendUrl).map(call => (call[1]!.headers as Record<string, string>)['Idempotency-Key']);
    expect(keys[0]).toMatch(/^inquiry\/[a-f0-9]{64}$/);
    expect(keys[1]).toBe(keys[0]);
    expect(keys[2]).not.toBe(keys[0]);
  });
  it.each([{}, { id: '' }, { id: ' ' }, { id: 42 }, { success: true }, null])('does not confirm Resend without a nonempty id: %j', async result => {
    outbound.mockResolvedValueOnce(jsonResponse(verified)).mockResolvedValueOnce(jsonResponse(result));
    await run(request(), 502);
    expect(outbound.mock.calls.map(call => call[0])).toEqual([verifyUrl, resendUrl]);
  });
  it.each(['http', 'transport', 'timeout', 'json'])('returns 502 for Resend %s failure even after verification', async failure => {
    outbound.mockResolvedValueOnce(jsonResponse(verified));
    if (failure === 'http') outbound.mockResolvedValueOnce(jsonResponse({ id: 'not-accepted' }, false));
    else if (failure === 'json') outbound.mockResolvedValueOnce({ ok: true, json: async () => { throw Error('invalid json'); } } as unknown as Response);
    else outbound.mockRejectedValueOnce(new Error(failure));
    await run(request(), 502);
    expect(outbound.mock.calls.map(call => call[0])).toEqual([verifyUrl, resendUrl]);
  });
  it('accepts absent optional fields without forwarding token/timing/honeypot', async () => {
    outbound.mockResolvedValueOnce(jsonResponse(verified)).mockResolvedValueOnce(jsonResponse({ id: 'email-id' }));
    await run(request({ ...valid(), company: undefined, budget: undefined, timeline: undefined, website: '' }), 200, { success: true });
    const payload = JSON.parse(String(outbound.mock.calls[1][1]!.body));
    expect(payload.text).not.toMatch(/undefined|startedAt|turnstileToken|website/);
  });
});
