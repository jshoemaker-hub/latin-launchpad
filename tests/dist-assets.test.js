const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

function buildCommand() {
  const toml = fs.readFileSync(path.join(root, 'netlify.toml'), 'utf8');
  const match = toml.match(/command = "([^"]+)"/);
  assert.ok(match, 'Netlify build command is missing');
  return match[1];
}

function referencedAssets() {
  const files = fs.readdirSync(root).filter((name) => (
    /\.(html|css|js)$/.test(name) && name !== 'supabase.js'
  ));
  const pattern = /(?:https?:\/\/latinlaunchpad\.com)?\/?(?:assets\/[A-Za-z0-9][\w./-]*|favicon\.(?:ico|svg)|og-image\.jpg)/gi;
  const paths = new Set();
  files.forEach((name) => {
    const source = fs.readFileSync(path.join(root, name), 'utf8');
    for (const match of source.matchAll(pattern)) {
      const assetPath = match[0]
        .replace(/^https?:\/\/latinlaunchpad\.com\/?/, '')
        .replace(/^\//, '');
      if (/\.(?:jpe?g|png|gif|webp|svg|ico)$/i.test(assetPath)) paths.add(assetPath);
    }
  });
  const expanded = new Set(paths);
  paths.forEach((assetPath) => {
    if (!/^assets\/seek-find\/.+\.jpe?g$/i.test(assetPath)) return;
    const base = assetPath.replace(/\.jpe?g$/i, '');
    expanded.add(`${base}-768.webp`);
    expanded.add(`${base}-1280.webp`);
  });
  return [...expanded];
}

test('the Netlify build copies every referenced asset into dist', () => {
  const command = buildCommand();
  assert.match(command, /rm -rf dist/);
  assert.match(command, /cp -R assets\/\. dist\/assets\//);

  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(path.join(dist, 'assets', 'seek-find'), { recursive: true });
  fs.writeFileSync(path.join(dist, 'assets', 'seek-find', 'stale-marker.txt'), 'from a cached publish directory');
  fs.mkdirSync(path.join(dist, 'assets', 'assets'), { recursive: true });

  execFileSync('bash', ['-lc', command], { cwd: root, stdio: 'pipe' });

  assert.equal(fs.existsSync(path.join(dist, 'assets', 'seek-find', 'stale-marker.txt')), false);
  assert.equal(fs.existsSync(path.join(dist, 'assets', 'assets')), false);

  const assets = referencedAssets();
  assert.ok(assets.some((assetPath) => assetPath.endsWith('-768.webp')));
  assert.ok(assets.some((assetPath) => assetPath.endsWith('-1280.webp')));
  assets.forEach((assetPath) => {
    const filePath = path.join(dist, assetPath);
    assert.ok(fs.existsSync(filePath), `dist is missing ${assetPath}`);
    assert.ok(fs.statSync(filePath).size > 0, `${assetPath} is empty`);
  });
});
