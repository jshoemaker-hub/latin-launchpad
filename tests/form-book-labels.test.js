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

test('shipped files do not name the Form textbooks', () => {
  const banned = /First Form|Second Form|Third Form/;
  const hits = [];
  shippedFiles().forEach((name) => {
    const filePath = path.join(root, name);
    assert.ok(fs.existsSync(filePath), `Shipped file is missing: ${name}`);
    if (!/\.(html|js|css|xml|txt|svg)$/i.test(name)) return;
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    lines.forEach((line, index) => {
      if (banned.test(line)) hits.push(`${name}:${index + 1} ${line.trim()}`);
    });
  });
  assert.deepEqual(hits, []);
});
