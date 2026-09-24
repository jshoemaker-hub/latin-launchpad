const test = require('node:test');
const assert = require('node:assert/strict');

process.env.RESEND_API_KEY = 're_test_key';
process.env.RESEND_FROM_EMAIL = 'Latin Launchpad <contact@example.com>';

let handler;

test.before(async () => {
  ({ default: handler } = await import('../netlify/functions/contact.mjs'));
});

function contactEvent(overrides = {}) {
  return new Request('https://latin-launchpad.netlify.app/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://latin-launchpad.netlify.app',
      host: 'latin-launchpad.netlify.app'
    },
    body: JSON.stringify({
      name: 'Jerad',
      email: 'jerad@example.com',
      subject: 'Contact test',
      message: 'Does this reach the inbox?',
      website: '',
      submittedAt: Date.now() - 2000,
      ...overrides
    })
  });
}

test('sends a valid contact message through Resend', async (t) => {
  const originalFetch = global.fetch;
  let request;
  t.after(() => { global.fetch = originalFetch; });
  global.fetch = async (url, options) => {
    request = { url, options };
    return {
      ok: true,
      json: async () => ({ id: 'email_123' })
    };
  };

  const response = await handler(contactEvent());
  const payload = JSON.parse(request.options.body);

  assert.equal(response.status, 200);
  assert.equal(request.url, 'https://api.resend.com/emails');
  assert.equal(request.options.headers.Authorization, 'Bearer re_test_key');
  assert.deepEqual(payload.to, ['jshoemakercb@yahoo.com']);
  assert.equal(payload.reply_to, 'jerad@example.com');
  assert.equal(payload.subject, '[Latin Launchpad] Contact test');
});

test('accepts a native form submission when JavaScript is unavailable', async (t) => {
  const originalFetch = global.fetch;
  let payload;
  t.after(() => { global.fetch = originalFetch; });
  global.fetch = async (url, options) => {
    payload = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({ id: 'email_native_123' })
    };
  };

  const body = new URLSearchParams({
    name: 'Jerad',
    email: 'jerad@example.com',
    subject: 'Native form test',
    message: 'This form submitted without JavaScript.',
    website: '',
    submittedAt: ''
  });
  const response = await handler(new Request('https://latin-launchpad.netlify.app/api/contact', {
    method: 'POST',
    headers: {
      origin: 'https://latin-launchpad.netlify.app',
      host: 'latin-launchpad.netlify.app'
    },
    body
  }));

  assert.equal(response.status, 200);
  assert.equal(payload.subject, '[Latin Launchpad] Native form test');
});

test('rejects requests from a different origin', async () => {
  const request = contactEvent();
  request.headers.set('origin', 'https://example.com');

  const response = await handler(request);

  assert.equal(response.status, 403);
});

test('rejects non-POST requests', async () => {
  const response = await handler(new Request('https://latin-launchpad.netlify.app/api/contact', {
    method: 'GET',
    headers: {
      origin: 'https://latin-launchpad.netlify.app',
      host: 'latin-launchpad.netlify.app'
    }
  }));

  assert.equal(response.status, 405);
});

test('rejects malformed JSON', async () => {
  const response = await handler(new Request('https://latin-launchpad.netlify.app/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://latin-launchpad.netlify.app',
      host: 'latin-launchpad.netlify.app'
    },
    body: '{'
  }));

  assert.equal(response.status, 400);
});

test('rejects submissions completed too quickly', async () => {
  const response = await handler(contactEvent({ submittedAt: Date.now() }));

  assert.equal(response.status, 400);
});

test('rejects invalid contact fields before calling Resend', async (t) => {
  const originalFetch = global.fetch;
  let called = false;
  t.after(() => { global.fetch = originalFetch; });
  global.fetch = async () => { called = true; };

  const response = await handler(contactEvent({ email: 'not-an-email' }));

  assert.equal(response.status, 400);
  assert.equal(called, false);
});

test('silently discards honeypot submissions', async (t) => {
  const originalFetch = global.fetch;
  let called = false;
  t.after(() => { global.fetch = originalFetch; });
  global.fetch = async () => { called = true; };

  const response = await handler(contactEvent({ website: 'https://spam.example' }));

  assert.equal(response.status, 200);
  assert.equal(called, false);
});

test('reports unavailable email configuration without exposing secrets', async (t) => {
  const originalApiKey = process.env.RESEND_API_KEY;
  const originalConsoleError = console.error;
  t.after(() => {
    process.env.RESEND_API_KEY = originalApiKey;
    console.error = originalConsoleError;
  });
  delete process.env.RESEND_API_KEY;
  console.error = () => {};

  const response = await handler(contactEvent());
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.error, 'Contact email is temporarily unavailable. Please email us directly.');
});

test('reports a send failure when Resend rejects the request', async (t) => {
  const originalFetch = global.fetch;
  const originalConsoleError = console.error;
  t.after(() => {
    global.fetch = originalFetch;
    console.error = originalConsoleError;
  });
  console.error = () => {};
  global.fetch = async () => ({
    ok: false,
    status: 403,
    text: async () => 'sender domain is not verified'
  });

  const response = await handler(contactEvent());
  const body = await response.json();

  assert.equal(response.status, 502);
  assert.match(body.error, /Could not send message/);
});
