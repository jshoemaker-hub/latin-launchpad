import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

const CONTACT_EMAIL = process.env.CONTACT_TO_EMAIL || 'jshoemakercb@yahoo.com';
const FIELD_LIMITS = {
  name: 100,
  email: 254,
  subject: 160,
  message: 5000
};

function json(status, body) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' }
  });
}

function hostOf(value) {
  const raw = String(value || '').split(',')[0].trim();
  if (!raw || raw.toLowerCase() === 'null') return '';
  try {
    return new URL(raw.includes('://') ? raw : `https://${raw}`).host.toLowerCase();
  } catch {
    return '';
  }
}

function isSameOrigin(request) {
  const headers = request.headers;
  const allowed = new Set(
    [headers.get('x-forwarded-host'), headers.get('host'), request.url]
      .map(hostOf)
      .filter(Boolean)
  );
  if (allowed.size === 0) return false;

  const originHost = hostOf(headers.get('origin'));
  if (originHost) return allowed.has(originHost);

  // Browsers set Sec-Fetch-Site and scripts cannot spoof it. A same-origin
  // GET often omits Origin, which made every token fetch fail closed.
  const site = String(headers.get('sec-fetch-site') || '').toLowerCase();
  if (site === 'same-origin') return true;
  if (site === 'cross-site' || site === 'same-site') return false;

  const refererHost = hostOf(headers.get('referer'));
  return Boolean(refererHost && allowed.has(refererHost));
}

function tokenSecret() {
  return process.env.CONTACT_TOKEN_SECRET || process.env.RESEND_API_KEY || '';
}

function issueContactToken(issuedAt = Date.now()) {
  const secret = tokenSecret();
  if (!secret) return '';
  const mac = createHmac('sha256', secret).update(String(issuedAt)).digest('base64url');
  return `${issuedAt}.${mac}`;
}

function contactTokenStatus(token) {
  const secret = tokenSecret();
  if (!secret) return 'unavailable';
  if (typeof token !== 'string' || !token.includes('.')) return 'invalid';
  const separator = token.indexOf('.');
  const issuedAt = Number(token.slice(0, separator));
  const mac = token.slice(separator + 1);
  if (!Number.isFinite(issuedAt) || !mac) return 'invalid';
  const expected = createHmac('sha256', secret).update(String(issuedAt)).digest('base64url');
  const actualBuffer = Buffer.from(mac);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return 'invalid';
  }
  const age = Date.now() - issuedAt;
  if (age < 800) return 'early';
  if (age > 2 * 60 * 60 * 1000) return 'expired';
  return 'ok';
}

function readFields(body) {
  return Object.fromEntries(
    Object.keys(FIELD_LIMITS).map((field) => [field, String(body[field] || '').trim()])
  );
}

function validate(fields) {
  for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
    if (!fields[field]) return `Please provide your ${field}.`;
    if (fields[field].length > limit) return `${field} is too long.`;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return 'Please provide a valid email address.';
  }

  if (/[\r\n]/.test(fields.subject)) {
    return 'Please provide a valid subject.';
  }

  return '';
}

async function readBody(request) {
  const contentType = request.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return request.json();
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    return Object.fromEntries((await request.formData()).entries());
  }

  throw new TypeError('Unsupported contact form content type.');
}

export default async function handler(request) {
  if (request.method === 'GET') {
    if (!isSameOrigin(request)) {
      return json(403, { error: 'This request could not be verified.' });
    }
    const token = issueContactToken();
    if (!token) return json(503, { error: 'Contact email is temporarily unavailable.' });
    return json(200, { token });
  }

  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed.' });
  }

  if (!isSameOrigin(request)) {
    return json(403, { error: 'This request could not be verified.' });
  }

  let body;
  try {
    body = await readBody(request);
  } catch {
    return json(400, { error: 'Invalid request.' });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json(400, { error: 'Invalid request.' });
  }

  // Silently accept obvious bot submissions so the trap is not disclosed.
  if (String(body.website || '').trim()) {
    return json(200, { ok: true });
  }

  const tokenStatus = contactTokenStatus(body.formToken);
  if (tokenStatus === 'unavailable') {
    return json(503, { error: 'Contact email is temporarily unavailable.' });
  }
  if (tokenStatus === 'early') {
    return json(400, { error: 'Please wait a moment and try again.' });
  }
  if (tokenStatus !== 'ok') {
    return json(400, { error: 'Please refresh the page and try again.' });
  }

  const fields = readFields(body);
  const validationError = validate(fields);
  if (validationError) {
    return json(400, { error: validationError });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error('Contact email is missing RESEND_API_KEY or RESEND_FROM_EMAIL.');
    return json(503, { error: 'Contact email is temporarily unavailable. Please email us directly.' });
  }

  const text = [
    `Name: ${fields.name}`,
    `Reply-to: ${fields.email}`,
    '',
    fields.message
  ].join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `contact-${randomUUID()}`
      },
      body: JSON.stringify({
        from,
        to: [CONTACT_EMAIL],
        reply_to: fields.email,
        subject: `[Latin Launchpad] ${fields.subject}`,
        text
      })
    });

    if (!response.ok) {
      const details = await response.text();
      console.error(`Resend rejected contact email (${response.status}): ${details}`);
      return json(502, { error: 'Could not send message. Please email us directly.' });
    }

    const result = await response.json();
    return json(200, { ok: true, id: result.id });
  } catch (error) {
    console.error('Contact email request failed:', error);
    return json(502, { error: 'Could not send message. Please email us directly.' });
  }
}

export const config = {
  path: '/api/contact',
  rateLimit: {
    windowLimit: 5,
    windowSize: 60,
    aggregateBy: ['ip', 'domain']
  }
};
