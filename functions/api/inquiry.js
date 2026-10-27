import { handleInquiry } from '../../api/inquiry.js';
import { allowedOrigin } from '../../src/lib/inquiry.js';

const MAX_BODY_BYTES = 16000;
const failure = (status) => Response.json({ success: false }, {
  status, headers: { 'Cache-Control': 'no-store' },
});

// A browser can omit Content-Length. Bound the raw stream before JSON parsing,
// not only the parsed payload that the shared handler validates.
async function readBoundedBody(request) {
  if (!request.body) return null;
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        return { tooLarge: true };
      }
      chunks.push(value);
    }
  } catch {
    return { invalid: true };
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return { data: JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) };
  } catch {
    return { invalid: true };
  }
}

export async function onRequest({ request, env }) {
  // Pages bindings are per-invocation. Never mutate process.env: concurrent
  // requests must not share credentials or a development-origin allowance.
  const environment = { ...env, NODE_ENV: 'production', VERCEL_URL: undefined };
  const headers = {
    origin: request.headers.get('origin') || undefined,
    'content-type': request.headers.get('content-type') || undefined,
    'content-length': request.headers.get('content-length') || undefined,
  };
  // A Pages alias is reachable outside the custom-domain WAF. Reject spoofed
  // Origin headers aimed at that alias before a challenge or provider call.
  if (request.method === 'POST' && headers.origin !== new URL(request.url).origin)
    return failure(403);
  let body = null;
  if (request.method === 'POST' && allowedOrigin(headers.origin, environment) &&
      headers['content-type']?.startsWith('application/json') &&
      (!headers['content-length'] || (/^\d+$/.test(headers['content-length']) && Number(headers['content-length']) <= MAX_BODY_BYTES))) {
    const parsed = await readBoundedBody(request);
    if (parsed?.tooLarge) return failure(413);
    if (parsed?.invalid) return failure(400);
    body = parsed?.data ?? null;
  }

  let status = 500;
  let payload = { success: false };
  const responseHeaders = new Headers();
  const response = {
    setHeader(name, value) { responseHeaders.set(name, value); return this; },
    status(code) { status = code; return this; },
    json(value) { payload = value; return this; },
  };
  try {
    await handleInquiry({ method: request.method, headers, body }, response, environment);
    return Response.json(payload, { status, headers: responseHeaders });
  } catch {
    // Unexpected adapter/runtime errors must never expose provider responses or secrets.
    return failure(500);
  }
}
