const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

function shippedHtmlFiles() {
  const netlify = fs.readFileSync(path.join(root, 'netlify.toml'), 'utf8');
  const command = netlify.match(/command = "([^"]+)"/);
  assert.ok(command, 'netlify.toml needs a build command');
  const names = command[1].split(/\s+/).filter((part) => part.endsWith('.html'));
  assert.ok(names.includes('404.html'), 'The build must publish the custom 404 page');
  assert.ok(names.includes('flashcards.html'), 'The build must publish flashcards.html');
  return names;
}

function inlineScriptBlocks(html) {
  const blocks = [];
  const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const attrs = match[1] || '';
    const type = (attrs.match(/\btype\s*=\s*["']([^"']+)["']/i) || [])[1] || '';
    const hasSrc = /\bsrc\s*=/.test(attrs);
    if (hasSrc) continue;
    if (type === 'application/ld+json' || type === 'application/json') continue;
    blocks.push(match[2].trim().slice(0, 80));
  }
  return blocks;
}

function inlineEventHandlers(html) {
  const withoutScripts = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  return [...withoutScripts.matchAll(/\son[a-z]+\s*=/gi)].map((match) => match[0].trim());
}

test('shipped HTML has no inline scripts or inline event handlers', () => {
  const offenders = [];
  shippedHtmlFiles().forEach((file) => {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const scripts = inlineScriptBlocks(html);
    const handlers = inlineEventHandlers(html);
    if (scripts.length || handlers.length) {
      offenders.push(`${file}: scripts=${scripts.length} handlers=${handlers.join(', ')}`);
    }
  });
  assert.deepEqual(offenders, []);
});

test('content security policy pins script sources and sets base-uri', () => {
  const headers = fs.readFileSync(path.join(root, '_headers'), 'utf8');
  assert.match(headers, /base-uri 'self'/);
  assert.match(headers, /object-src 'none'/);
  assert.doesNotMatch(headers, /cdn\.jsdelivr\.net/);
  assert.doesNotMatch(headers, /script-src[^;]*unsafe-inline/);
  assert.match(headers, /script-src 'self'/);
});
