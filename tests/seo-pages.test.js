const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const { generate, STATIC_URLS } = require('../scripts/generate-seo-pages.js');
const assign = require('../assignment-links.js');

const root = path.resolve(__dirname, '..');

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

test('the homepage describes the course and FAQ without JavaScript', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const jsonBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  assert.ok(jsonBlocks.length >= 1);
  const graph = JSON.parse(jsonBlocks[0]);
  const types = graph['@graph'].map((node) => node['@type']);
  assert.ok(types.includes('FAQPage'));
  assert.ok(types.includes('Course'));
  assert.ok(types.includes('EducationalOrganization'));
  const faq = graph['@graph'].find((node) => node['@type'] === 'FAQPage');
  const text = visibleText(html);
  faq.mainEntity.forEach((question) => {
    assert.ok(text.includes(question.name), question.name);
    assert.ok(text.includes(question.acceptedAnswer.text.replace(/School Launch\.$/, 'School Launch.')), question.name);
  });
  assert.match(text, /classical schools/i);
  assert.match(text, /homeschool/i);
  assert.match(text, /grades 3–8/);
  assert.match(html, /href="topics\/index\.html"/);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
});

test('generated topic pages are static, linked from the hub, and listed in the sitemap', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'll-topics-'));
  const result = generate(dir);
  const sitemap = fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf8');
  const robots = fs.readFileSync(path.join(dir, 'robots.txt'), 'utf8');
  assert.match(robots, /^User-agent: \*\nAllow: \/\n\nSitemap: https:\/\/latinlaunchpad\.com\/sitemap\.xml\n$/);
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(new Set(locs).size, locs.length);
  STATIC_URLS.forEach((url) => assert.ok(locs.includes(url), url));
  assert.equal(locs.includes('https://latinlaunchpad.com/404.html'), false);

  const htmlFiles = walk(path.join(dir, 'topics')).filter((file) => file.endsWith('.html'));
  assert.equal(htmlFiles.length, result.pages.length);
  assert.ok(htmlFiles.length > 50);
  const hub = fs.readFileSync(path.join(dir, 'topics', 'index.html'), 'utf8');
  const titles = new Set();
  htmlFiles.forEach((file) => {
    const html = fs.readFileSync(file, 'utf8');
    const rel = path.relative(dir, file).split(path.sep).join('/');
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, rel);
    assert.match(html, /<meta name="description" content="[^"]{40,}"/, rel);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://latinlaunchpad\\.com/${rel}">`), rel);
    assert.match(html, /property="og:title"/, rel);
    assert.match(html, /name="twitter:card"/, rel);
    const text = visibleText(html);
    assert.ok(text.length > 180, `${rel} has ${text.length} characters of visible text`);
    const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1];
    assert.ok(title && !titles.has(title), `duplicate title ${title}`);
    titles.add(title);
    if (rel !== 'topics/index.html') assert.ok(hub.includes(`/${rel}`), `${rel} is not linked from the hub`);
    assert.equal((html.match(/\son[a-z]+\s*=/gi) || []).length, 0, rel);
  });

  result.pages.forEach((relPath) => {
    assert.ok(locs.includes(`https://latinlaunchpad.com/${relPath}`), relPath);
  });

  const yearOne = fs.readFileSync(path.join(dir, 'topics', 'vocabulary-year-1.html'), 'utf8');
  assert.match(visibleText(yearOne), /puella/);
  assert.match(yearOne, /href="\/#\/y\/1\/l\/grade3-1"/);
  const grammar = fs.readFileSync(path.join(dir, 'topics', 'grammar', 'grade3-grammar-endings.html'), 'utf8');
  const practice = grammar.match(/href="(\/#\/y\/[^"]+)"/);
  assert.ok(practice, 'grammar page needs an app link');
  assert.equal(assign.parsePath(practice[1].slice(1)).kind, 'lesson');
  const culture = fs.readFileSync(path.join(dir, 'topics', 'roman-culture', 'myth-iuppiter.html'), 'utf8');
  assert.match(visibleText(culture), /Jupiter/);
  assert.match(culture, /href="\/#\/roman-world"/);
  assert.equal(assign.parsePath('#/roman-world').kind, 'roman-world');
  const motto = fs.readFileSync(path.join(dir, 'topics', 'mottoes', 'carpe-diem.html'), 'utf8');
  assert.match(visibleText(motto), /seize the day/i);
  const exam = fs.readFileSync(path.join(dir, 'topics', 'annual-exam-study', 'index.html'), 'utf8');
  assert.match(visibleText(exam), /Introduction/);
  const printables = fs.readFileSync(path.join(dir, 'topics', 'printables.html'), 'utf8');
  assert.match(visibleText(printables), /crossword/i);
  assert.match(visibleText(printables), /word find/i);
});
