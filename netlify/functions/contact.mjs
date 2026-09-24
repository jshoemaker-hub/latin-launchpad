import { randomUUID } from 'node:crypto';

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

function isSameOrigin(headers) {
  const origin = headers.get('origin');
  const host = headers.get('x-forwarded-host') || headers.get('host');
  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
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

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed.' });
  }

  if (!isSameOrigin(request.headers)) {
    return json(403, { error: 'This request could not be verified.' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Invalid request.' });
  }

  // Silently accept obvious bot submissions so the trap is not disclosed.
  if (String(body.website || '').trim()) {
    return json(200, { ok: true });
  }

  const submittedAt = Number(body.submittedAt);
  if (!Number.isFinite(submittedAt) || Date.now() - submittedAt < 800) {
    return json(400, { error: 'Please wait a moment and try again.' });
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
