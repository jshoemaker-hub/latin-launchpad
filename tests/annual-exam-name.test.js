const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

function shippedFiles() {
  const toml = fs.readFileSync(path.join(root, 'netlify.toml'), 'utf8');
  const command = toml.match(/command = "([^"]+)"/);
  assert.ok(command, 'Netlify build command is missing');
  const start = command[1].indexOf('cp _headers');
  const end = command[1].indexOf(' dist/', start);
  assert.ok(start >= 0 && end > start, 'Netlify copy list is missing');
  return command[1].slice(start + 3, end).trim().split(/\s+/);
}

function withoutLegacyCompat(source) {
  return source.replace(/\/\* legacy-annual-exam-compat \*\/[\s\S]*?\/\* end-legacy-annual-exam-compat \*\//g, '');
}

test('shipped files do not show the former exam name', () => {
  const banned = [
    { label: 'NLE', pattern: /\bNLE\b/i },
    { label: 'National Latin Exam', pattern: /national latin exam/i },
    { label: 'nle.org', pattern: /nle\.org/i }
  ];
  const hits = [];
  shippedFiles().forEach((name) => {
    const filePath = path.join(root, name);
    assert.ok(fs.existsSync(filePath), `Shipped file is missing: ${name}`);
    if (!/\.(html|js|css|xml|txt|svg)$/i.test(name)) return;
    const source = withoutLegacyCompat(fs.readFileSync(filePath, 'utf8'));
    const lines = source.split('\n');
    lines.forEach((line, index) => {
      banned.forEach((rule) => {
        if (rule.pattern.test(line)) hits.push(`${name}:${index + 1} ${rule.label}: ${line.trim()}`);
      });
    });
  });
  assert.deepEqual(hits, []);
});
