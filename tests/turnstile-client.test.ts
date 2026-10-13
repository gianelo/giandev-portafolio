import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';
import { homeEn, homeEs } from '../src/i18n/home';

const source = readFileSync('src/components/home/Inquiry.astro', 'utf8');
function setup({ key = 'public-test-key', provider = true } = {}) {
  class Element {
    id = ''; value = ''; type = 'text'; required = false; validity = { valid: true };
    hidden = true; textContent = ''; disabled = false; dataset: Record<string, string> = {};
    attrs: Record<string, string> = {}; children: any[] = []; listeners: Record<string, Function> = {};
    focus = vi.fn();
    setAttribute(k: string, v: string) { this.attrs[k] = v; }
    removeAttribute(k: string) { delete this.attrs[k]; }
    addEventListener(k: string, fn: Function) { this.listeners[k] = fn; }
    append(...children: any[]) { this.children.push(...children); }
    replaceChildren() { this.children = []; }
    querySelector(selector: string): any { return elements[selector] || new Element(); }
    querySelectorAll() { return fields; }
  }
  const elements: Record<string, any> = {};
  ['inquiry', 'inquiry-errors', 'inquiry-status', 'inquiry-progress', 'edit-inquiry', 'inquiry-turnstile', 'turnstile-status', 'retry-turnstile', '[type=submit]', 'span', 'h3', 'p'].forEach(id => elements[id] = new Element());
  elements['inquiry-turnstile'].dataset.sitekey = key;
  const fields = ['name', 'email', 'today', 'help'].map(id => {
    const el = new Element(); el.id = id; el.required = true; el.value = id === 'email' ? 'a@example.com' : 'Entered text';
    if (id === 'email') el.type = 'email';
    elements[id + '-error'] = new Element(); return el;
  });
  const head = new Element();
  let options: any;
  const turnstile = { render: vi.fn((_el, opts) => { options = opts; return 'widget-id'; }), reset: vi.fn() };
  const fetch = vi.fn(async (_url: string, _init: { body: string }) => ({ ok: true, json: async () => ({ success: true }) }));
  let now = 10000;
  let website = '';
  const context = {
    document: { getElementById: (id: string) => elements[id], createElement: () => new Element(), head },
    window: provider ? { turnstile } : {},
    messages: { required: 'required', email: 'email', invalid: 'invalid', loading: 'loading', success: 'accepted', failure: 'failure', sending: 'sending', verificationLoading: 'checking', verificationRequired: 'verify', verificationUnavailable: 'unavailable', verificationExpired: 'expired', verificationReady: 'ready' },
    fetch, FormData: class { *[Symbol.iterator]() { for (const f of fields) yield [f.id, f.value]; yield ['website', website]; } },
    Date: { now: () => now }, setTimeout: vi.fn((_callback: () => void, _delay: number) => 1), clearTimeout: vi.fn(),
  };
  const script = source.slice(source.indexOf('  const form ='), source.lastIndexOf('</script>'));
  runInNewContext(script, context);
  return { elements, fields, fetch, turnstile, head, context, options: () => options,
    honeypot: () => { website = 'spam'; },
    submit: async (elapsed = 3000) => { now += elapsed; await elements.inquiry.listeners.submit({ preventDefault() {} }); },
    load: () => head.children[0].listeners.load(),
  };
}

describe('inquiry Turnstile client', () => {
  it('renders managed verification with the inquiry action and never sends without a token', async () => {
    const app = setup();
    expect(app.options()).toMatchObject({ action: 'inquiry', size: 'flexible' });
    await app.submit(); expect(app.fetch).not.toHaveBeenCalled();
    expect(app.elements['turnstile-status'].textContent).toBe('verify');
  });
  it('passes the token and resets it after API acceptance without clearing fields', async () => {
    const app = setup(); app.options().callback('valid-token'); await app.submit();
    expect(JSON.parse(app.fetch.mock.calls[0][1].body).turnstileToken).toBe('valid-token');
    expect(app.turnstile.reset).toHaveBeenCalledWith('widget-id');
    expect(app.elements['inquiry-status'].dataset.state).toBe('success');
    await app.submit(); expect(app.fetch).toHaveBeenCalledTimes(1);
    expect(app.fields[0].value).toBe('Entered text');
  });
  it('resets consumed tokens after provider failure so a new token can retry', async () => {
    const app = setup(); app.fetch.mockRejectedValueOnce(new Error('provider failure'));
    app.options().callback('first'); await app.submit();
    expect(app.turnstile.reset).toHaveBeenCalled();
    expect(app.elements['inquiry-status'].dataset.state).toBe('failure');
    expect(app.fields[0].value).toBe('Entered text');
    await app.submit(); expect(app.fetch).toHaveBeenCalledTimes(1);
    app.options().callback('second'); await app.submit(); expect(app.fetch).toHaveBeenCalledTimes(2);
  });
  it('invalidates and resets expired tokens, and rejects widget errors', async () => {
    const app = setup(); app.options().callback('old'); app.options()['expired-callback']();
    expect(app.turnstile.reset).toHaveBeenCalled(); await app.submit(); expect(app.fetch).not.toHaveBeenCalled();
    app.options().callback('new'); app.options()['error-callback']();
    await app.submit(); expect(app.fetch).not.toHaveBeenCalled();
    expect(app.elements['retry-turnstile'].hidden).toBe(false);
    app.elements['retry-turnstile'].listeners.click(); expect(app.turnstile.reset).toHaveBeenCalledTimes(2);
  });
  it('loads the explicit script before rendering and recovers from script failure', async () => {
    const app = setup({ provider: false });
    expect(app.head.children[0].src).toBe('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit');
    await app.submit(); expect(app.fetch).not.toHaveBeenCalled();
    app.head.children[0].listeners.error(); expect(app.elements['turnstile-status'].textContent).toBe('unavailable');
    app.elements['retry-turnstile'].listeners.click();
    app.context.window.turnstile = app.turnstile; app.head.children[1].listeners.load();
    expect(app.turnstile.render).toHaveBeenCalledTimes(1);
  });
  it('fails closed without a public site key', async () => {
    const app = setup({ key: '' }); await app.submit();
    expect(app.turnstile.render).not.toHaveBeenCalled(); expect(app.fetch).not.toHaveBeenCalled();
    expect(app.elements['turnstile-status'].textContent).toBe('unavailable');
  });
  it('rejects blank tokens and challenge timeouts', async () => {
    const app = setup(); app.options().callback('   '); await app.submit();
    expect(app.fetch).not.toHaveBeenCalled();
    app.options().callback('token'); app.options()['timeout-callback'](); await app.submit();
    expect(app.fetch).not.toHaveBeenCalled(); expect(app.turnstile.reset).toHaveBeenCalled();
  });
  it('times out unavailable scripts with recoverable feedback', () => {
    const app = setup({ provider: false });
    const [timeout, delay] = app.context.setTimeout.mock.calls[0];
    expect(delay).toBe(15000); timeout();
    expect(app.elements['turnstile-status'].textContent).toBe('unavailable');
    expect(app.elements['retry-turnstile'].hidden).toBe(false);
  });
  it.each([false, true])('resets tokens after an API rejection (HTTP ok: %s)', async ok => {
    const app = setup();
    app.fetch.mockResolvedValueOnce({ ok, json: async () => ({ success: false }) });
    app.options().callback('token'); await app.submit();
    expect(app.elements['inquiry-status'].dataset.state).toBe('failure');
    expect(app.turnstile.reset).toHaveBeenCalled();
  });
  it('keeps the honeypot and timing guard fail-closed', async () => {
    const fast = setup(); fast.options().callback('token'); await fast.submit(0);
    expect(fast.fetch).not.toHaveBeenCalled();
    const spam = setup(); spam.options().callback('token'); spam.honeypot(); await spam.submit();
    expect(spam.fetch).not.toHaveBeenCalled();
  });
  it('keeps public configuration, widget action, and localized provider privacy explicit', () => {
    expect(source).toContain('import.meta.env.PUBLIC_TURNSTILE_SITE_KEY');
    expect(source).toContain('data-action="inquiry"');
    expect(source).not.toMatch(/TURNSTILE_SECRET_KEY|RESEND_API_KEY/);
    expect(Object.keys(homeEn).sort()).toEqual(Object.keys(homeEs).sort());
    for (const copy of [homeEn, homeEs]) {
      expect(copy.privacy).toContain('Resend'); expect(copy.privacy).toContain('Cloudflare Turnstile');
      expect(copy.privacy).not.toContain('Web3Forms');
    }
  });
  it('does not claim rejection when provider acceptance could be lost in transit', () => {
    expect(homeEn.failure).toMatch(/could not confirm|may have been sent/i);
    expect(homeEs.failure).toMatch(/no pudimos confirmar|puede haberse enviado/i);
  });
  it('retains required and email validation with focused accessible errors', async () => {
    const app = setup();
    app.fields[0].value = ''; app.fields[1].validity.valid = false;
    await app.submit(); expect(app.fetch).not.toHaveBeenCalled();
    expect(app.elements['name-error'].textContent).toBe('required');
    expect(app.elements['email-error'].textContent).toBe('email');
    expect(app.elements['inquiry-errors'].focus).toHaveBeenCalled();
  });
});
