const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const { generate, ensureAnalytics, measurementId } = require('../scripts/generate-seo-pages.js');
const { firstHundredGroups } = require('../scripts/seo-landing.js');

const root = path.resolve(__dirname, '..');
const STATIC_PAGES = [
  'index.html',
  'flashcards.html',
  'about.html',
  'parents-teachers.html',
  'school-privacy.html',
  'privacy.html',
  'terms.html',
  'contact.html',
  '404.html'
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function meta(html, attr, key) {
  const pattern = new RegExp(`<meta\\s+${attr}=["']${key}["']\\s+content="([^"]*)"`, 'i');
  const match = html.match(pattern);
  if (match) return match[1];
  const swapped = new RegExp(`<meta\\s+content="([^"]*)"\\s+${attr}=["']${key}["']`, 'i');
  return (html.match(swapped) || [])[1] || '';
}

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function jsonBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
}

function nodesOf(html) {
  const nodes = [];
  jsonBlocks(html).forEach((block) => {
    if (Array.isArray(block['@graph'])) nodes.push(...block['@graph']);
    else nodes.push(block);
  });
  return nodes;
}

test('titles and descriptions are unique and social tags match', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'll-seo-'));
  generate(dir);
  const pages = STATIC_PAGES.map((name) => ({ name, html: fs.readFileSync(path.join(root, name), 'utf8') }));
  walk(dir).filter((file) => file.endsWith('.html')).forEach((file) => {
    pages.push({ name: path.relative(dir, file), html: fs.readFileSync(file, 'utf8') });
  });
  const titles = new Map();
  const descriptions = new Map();
  pages.forEach(({ name, html }) => {
    const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1];
    const description = meta(html, 'name', 'description');
    assert.ok(title, `${name} is missing a title`);
    assert.ok(description.length >= 40, `${name} description is too short`);
    assert.equal(titles.has(title), false, `duplicate title ${title} on ${name} and ${titles.get(title)}`);
    assert.equal(descriptions.has(description), false, `duplicate description on ${name} and ${descriptions.get(description)}`);
    titles.set(title, name);
    descriptions.set(description, name);
    assert.equal(meta(html, 'property', 'og:title'), title, name);
    assert.equal(meta(html, 'property', 'og:description'), description, name);
    assert.equal(meta(html, 'name', 'twitter:title'), title, name);
    assert.equal(meta(html, 'name', 'twitter:description'), description, name);
    const canonical = (html.match(/<link rel="canonical" href="([^"]+)">/) || [])[1];
    assert.ok(canonical, `${name} is missing a canonical`);
    assert.match(canonical, /^https:\/\/latinlaunchpad\.com\//, name);
    assert.equal(canonical.includes('www.'), false, name);
    assert.equal(canonical.includes('netlify.app'), false, name);
    const noindex = /noindex/i.test(meta(html, 'name', 'robots'));
    assert.equal(noindex, name === '404.html', `${name} noindex`);
  });
});

test('every built page carries one GA4 loader and the measurement id lives in one file', () => {
  assert.equal(measurementId(), 'G-HLK81Y1PK3');
  const analytics = fs.readFileSync(path.join(root, 'analytics.js'), 'utf8');
  assert.equal((analytics.match(/G-HLK81Y1PK3/g) || []).length, 1);
  STATIC_PAGES.forEach((name) => {
    const html = fs.readFileSync(path.join(root, name), 'utf8');
    const tags = html.match(/<script\b[^>]*analytics\.js[^>]*>/g) || [];
    assert.equal(tags.length, 1, name);
    assert.equal(html.includes('googletagmanager.com/gtag/js'), false, name);
  });
  const stamped = ensureAnalytics('<html><body><script src="analytics.js"></script><script src="/analytics.js"></script></body></html>');
  assert.equal((stamped.match(/<script\b[^>]*analytics\.js[^>]*>/g) || []).length, 1);
  assert.match(stamped, /data-ga4="G-HLK81Y1PK3"/);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'll-ga-'));
  generate(dir);
  walk(dir).filter((file) => file.endsWith('.html')).forEach((file) => {
    const html = fs.readFileSync(file, 'utf8');
    const tags = html.match(/<script\b[^>]*analytics\.js[^>]*>/g) || [];
    assert.equal(tags.length, 1, path.relative(dir, file));
    assert.equal((html.match(/data-ga4="G-HLK81Y1PK3"/g) || []).length, 1, path.relative(dir, file));
  });
});

test('lesson, topic, and hub pages validate structured data', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'll-schema-'));
  const result = generate(dir);
  assert.ok(result.pages.includes('topics/lessons/grade3-1.html'));
  assert.ok(result.pages.includes('start-here.html'));
  assert.ok(result.pages.includes('latin-prayers.html'));
  assert.ok(result.pages.includes('first-100-latin-words.html'));
  assert.ok(result.pages.includes('latin-in-10-minutes.html'));
  const sitemap = fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf8');
  result.pages.forEach((rel) => {
    assert.ok(sitemap.includes(`<loc>https://latinlaunchpad.com/${rel}</loc>`), rel);
  });
  assert.equal(sitemap.includes('404.html'), false);
  walk(dir).filter((file) => file.endsWith('.html')).forEach((file) => {
    const html = fs.readFileSync(file, 'utf8');
    const rel = path.relative(dir, file).split(path.sep).join('/');
    const nodes = nodesOf(html);
    const crumbs = nodes.find((node) => node['@type'] === 'BreadcrumbList');
    assert.ok(crumbs, `${rel} breadcrumb`);
    assert.ok(crumbs.itemListElement.length >= 2, rel);
    const resource = nodes.find((node) => node['@type'] === 'LearningResource' || node['@type'] === 'Course');
    assert.ok(resource, `${rel} learning resource`);
    assert.ok(resource.educationalLevel, rel);
    assert.equal(resource.isAccessibleForFree, true, rel);
    assert.ok(resource.inLanguage.includes('la') && resource.inLanguage.includes('en'), rel);
    assert.equal(resource.audience['@type'], 'EducationalAudience', rel);
    assert.equal(resource.provider.name, 'Latin Launchpad', rel);
    assert.match(resource.provider.description, /course on School Launch/, rel);
    assert.equal(resource.provider.sameAs, 'https://schoollaunch.org/', rel);
    nodes.filter((node) => node['@type'] === 'FAQPage').forEach((faq) => {
      const text = visibleText(html);
      faq.mainEntity.forEach((question) => {
        assert.ok(text.includes(question.name), `${rel} ${question.name}`);
        assert.ok(text.includes(question.acceptedAnswer.text), `${rel} ${question.name}`);
      });
    });
    nodes.filter((node) => node['@type'] === 'HowTo').forEach((howto) => {
      const text = visibleText(html);
      howto.step.forEach((step) => {
        assert.ok(text.includes(step.name), `${rel} ${step.name}`);
        assert.ok(text.includes(step.text), `${rel} ${step.name}`);
      });
    });
  });
  STATIC_PAGES.filter((name) => name !== 'index.html').forEach((name) => {
    const nodes = nodesOf(fs.readFileSync(path.join(root, name), 'utf8'));
    assert.ok(nodes.some((node) => node['@type'] === 'BreadcrumbList'), name);
  });
});

test('landing hubs, prayers, and the first 100 words are real pages', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'll-hubs-'));
  generate(dir);
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  [
    'start-here.html',
    'latin-by-grade.html',
    'latin-vocabulary.html',
    'latin-grammar.html',
    'latin-prayers.html',
    'first-100-latin-words.html',
    'latin-in-10-minutes.html'
  ].forEach((href) => {
    assert.ok(home.includes(`href="${href}"`), href);
    assert.ok(fs.existsSync(path.join(dir, href)), href);
  });
  const prayers = visibleText(fs.readFileSync(path.join(dir, 'latin-prayers.html'), 'utf8'));
  assert.match(prayers, /Pater noster, qui es in caelis/);
  assert.match(prayers, /Gloria Patri, et Filio/);
  assert.match(prayers, /Ave Maria, gratia plena/);
  assert.match(prayers, /Gloria in excelsis Deo/);
  assert.match(prayers, /Praise God, from whom all blessings flow/);
  const words = fs.readFileSync(path.join(dir, 'first-100-latin-words.html'), 'utf8');
  assert.equal((words.match(/<td lang="la">/g) || []).length, 100);
  assert.match(words, /<td lang="la">puella<\/td>/);
  assert.match(words, /<body class="print-document">/);
  assert.match(fs.readFileSync(path.join(root, 'styles.css'), 'utf8'), /size:\s*letter/);
  assert.match(fs.readFileSync(path.join(root, 'styles.css'), 'utf8'), /body\.print-document > \*:not\(#printArea\)/);
  const plan = visibleText(fs.readFileSync(path.join(dir, 'latin-in-10-minutes.html'), 'utf8'));
  assert.match(plan, /Monday: one new lesson/);
  assert.match(plan, /Friday: missed words/);
  const grade = fs.readFileSync(path.join(dir, 'latin-by-grade.html'), 'utf8');
  ['grade-3', 'grade-4', 'grade-5', 'grade-6', 'grade-7', 'grade-8'].forEach((id) => {
    assert.match(grade, new RegExp(`id="${id}"`));
  });
  const lesson = visibleText(fs.readFileSync(path.join(dir, 'topics', 'lessons', 'grade3-1.html'), 'utf8'));
  assert.match(lesson, /puella/);
  const vergil = fs.readFileSync(path.join(dir, 'topics', 'roman-culture', 'author-vergil.html'), 'utf8');
  assert.match(vergil, /https:\/\/classicslaunch\.org\/authors\/virgil\//);
  assert.match(vergil, /https:\/\/classicslaunch\.org\/works\/the-aeneid\//);
  const groups = firstHundredGroups(loadGradeWords());
  assert.equal(groups.reduce((sum, group) => sum + group.words.length, 0), 100);
});

function loadGradeWords() {
  const vm = require('node:vm');
  const context = {};
  vm.createContext(context);
  ['word-banks.js', 'reference-vocabulary.js', 'core-frequency.js', 'gap-vocabulary.js'].forEach((name) => {
    vm.runInContext(fs.readFileSync(path.join(root, name), 'utf8'), context, { filename: name });
  });
  vm.runInContext('globalThis.__WORDS = GRADE_WORDS;', context);
  return context.__WORDS;
}
