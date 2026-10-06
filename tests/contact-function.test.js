const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

process.env.RESEND_API_KEY = 're_test_key';
process.env.RESEND_FROM_EMAIL = 'Latin Launchpad <contact@example.com>';
process.env.CONTACT_TOKEN_SECRET = 'contact-token-test-secret';

let handler;
let readyToken;

test.before(async () => {
  ({ default: handler } = await import('../netlify/functions/contact.mjs'));
  const issued = await handler(new Request('https://latin-launchpad.netlify.app/api/contact', {
    method: 'GET',
    headers: {
      origin: 'https://latin-launchpad.netlify.app',
      host: 'latin-launchpad.netlify.app'
    }
  }));
  readyToken = (await issued.json()).token;
  await new Promise((resolve) => setTimeout(resolve, 900));
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
      formToken: readyToken,
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
    formToken: readyToken
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

test('rejects unsupported methods', async () => {
  const response = await handler(new Request('https://latin-launchpad.netlify.app/api/contact', {
    method: 'PUT',
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
  const issued = await handler(new Request('https://latin-launchpad.netlify.app/api/contact', {
    method: 'GET',
    headers: {
      origin: 'https://latin-launchpad.netlify.app',
      host: 'latin-launchpad.netlify.app'
    }
  }));
  const freshToken = (await issued.json()).token;
  const response = await handler(contactEvent({ formToken: freshToken }));

  assert.equal(response.status, 400);
});

test('rejects a client-supplied timestamp without a server token', async () => {
  const response = await handler(contactEvent({
    formToken: '',
    submittedAt: Date.now() - 5000
  }));

  assert.equal(response.status, 400);
});

test('rejects a null JSON body', async () => {
  const response = await handler(new Request('https://latin-launchpad.netlify.app/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://latin-launchpad.netlify.app',
      host: 'latin-launchpad.netlify.app'
    },
    body: 'null'
  }));

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

test('issues a token for a same-origin browser GET that omits Origin', async () => {
  const response = await handler(new Request('https://latinlaunchpad.com/api/contact', {
    method: 'GET',
    headers: {
      host: 'latinlaunchpad.com',
      'sec-fetch-site': 'same-origin',
      accept: 'application/json'
    }
  }));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(typeof body.token, 'string');
  assert.ok(body.token.includes('.'));
});

test('issues a token when the referer host matches and Origin is absent', async () => {
  const response = await handler(new Request('https://latinlaunchpad.com/api/contact', {
    method: 'GET',
    headers: {
      host: 'latinlaunchpad.com',
      referer: 'https://latinlaunchpad.com/contact.html'
    }
  }));

  assert.equal(response.status, 200);
});

test('rejects a token request that has no same-origin proof', async () => {
  const response = await handler(new Request('https://latinlaunchpad.com/api/contact', {
    method: 'GET',
    headers: { host: 'latinlaunchpad.com' }
  }));
  const body = await response.json();

  assert.equal(response.status, 403);
  assert.equal(body.error, 'This request could not be verified.');
});

test('rejects a foreign Origin even if Sec-Fetch-Site claims same-origin', async () => {
  const response = await handler(new Request('https://latinlaunchpad.com/api/contact', {
    method: 'GET',
    headers: {
      host: 'latinlaunchpad.com',
      origin: 'https://example.com',
      'sec-fetch-site': 'same-origin'
    }
  }));

  assert.equal(response.status, 403);
});

test('accepts a submission from a same-origin browser that omits Origin', async (t) => {
  const originalFetch = global.fetch;
  let request;
  t.after(() => { global.fetch = originalFetch; });
  global.fetch = async (url, options) => {
    request = { url, options };
    return { ok: true, json: async () => ({ id: 'email_same_origin' }) };
  };

  const response = await handler(new Request('https://latinlaunchpad.netlify.app/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      host: 'latin-launchpad.netlify.app',
      'sec-fetch-site': 'same-origin'
    },
    body: JSON.stringify({
      name: 'Jerad',
      email: 'jerad@example.com',
      subject: 'Same-origin token',
      message: 'Sent without an Origin header.',
      website: '',
      formToken: readyToken
    })
  }));

  assert.equal(response.status, 200);
  assert.equal(request.url, 'https://api.resend.com/emails');
  assert.equal(JSON.parse(request.options.body).reply_to, 'jerad@example.com');
});

test('the contact page fetches a token only when the form is showing', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'contact-form.js'), 'utf8');
  const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  assert.match(source, /function contactFormIsVisible/);
  assert.match(source, /function prepareVisibleContactForms/);
  assert.match(source, /if \(contactFormIsVisible\(form\)\) loadFormToken\(form\)/);
  const startup = source.slice(source.indexOf("document.addEventListener('DOMContentLoaded'"));
  assert.match(startup, /prepareVisibleContactForms\(\)/);
  assert.doesNotMatch(startup, /loadFormToken\(form\)/);
  assert.match(app, /page === 'contact'\) window\.LatinLaunchpadContact\?\.prepareVisibleContactForms\(\)/);
});
