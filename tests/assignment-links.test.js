const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const assign = require('../assignment-links.js');

test('assignment routes round-trip for every activity kind', () => {
  const routes = [
    { kind: 'year', year: 1 },
    { kind: 'lesson', year: 1, lessonId: 'grade3-1', mode: 'meaning' },
    { kind: 'lesson', year: 4, lessonId: 'grade7-2', mode: 'compose' },
    { kind: 'lesson', year: 2, lessonId: 'grade4-grammar-amo', mode: 'picture' },
    { kind: 'quiz', year: 1, count: 10, lessonIds: ['grade3-1', 'grade3-grammar-endings'] },
    { kind: 'quiz', year: 3, count: 25, lessonIds: null },
    { kind: 'test', year: 4, count: 50 },
    { kind: 'annual-exam' },
    { kind: 'annual-exam', levelId: 'intro' },
    { kind: 'annual-exam', levelId: 'advanced-poetry', exam: true },
    { kind: 'annual-exam', levelId: 'beginning', category: 'mythology', count: 10 },
    { kind: 'cards', year: 2, seconds: 600, shuffle: 1 },
    { kind: 'deck', year: 1, minutes: 5, sessionType: 'visual' },
    { kind: 'check' }
  ];
  routes.forEach((route) => {
    const path = assign.buildPath(route);
    assert.ok(path.startsWith('/'), path);
    assert.deepEqual(assign.parsePath(`#${path}`), route.kind === 'lesson' && route.mode === 'meaning'
      ? route
      : (route.kind === 'quiz' && route.lessonIds === null ? { ...route, lessonIds: null } : route));
  });
});

test('old exam links parse as Annual Exam Study and new links do not use the old path', () => {
  const legacy = ['n', 'le'].join('');
  const cases = [
    [`#/${legacy}`, { kind: 'annual-exam' }, '/annual-exam'],
    [`#/${legacy}/intro`, { kind: 'annual-exam', levelId: 'intro' }, '/annual-exam/intro'],
    [`#/${legacy}/advanced-poetry/exam`, { kind: 'annual-exam', levelId: 'advanced-poetry', exam: true }, '/annual-exam/advanced-poetry/exam'],
    [`#/${legacy}/beginning/p/mythology/10`, { kind: 'annual-exam', levelId: 'beginning', category: 'mythology', count: 10 }, '/annual-exam/beginning/p/mythology/10']
  ];
  cases.forEach(([hash, route, built]) => {
    assert.deepEqual(assign.parsePath(hash), route);
    assert.equal(assign.buildPath(route), built);
    assert.equal(assign.parsePath(`#${built}`).kind, 'annual-exam');
  });
  const code = assign.encodeCompletion({
    kind: 'annual-exam',
    id: 'intro',
    mode: 'exam',
    score: 30,
    total: 40,
    missed: []
  });
  const decoded = assign.decodeCompletion(code);
  assert.equal(decoded.ok, true);
  assert.match(decoded.payload.label, /^Annual Exam Study/);
});

test('assignment routes reject personal data and unknown targets', () => {
  [
    '#/y/1/l/Alex%20Smith',
    '#/y/9',
    '#/q/1/7/grade3-1',
    '#/annual-exam/not-a-level/exam',
    '#/nle/not-a-level/exam',
    '#/cards/1/300/2',
    '#access_token=secret',
    '#/y/1/l/grade3-1/m/names'
  ].forEach((hash) => assert.equal(assign.parsePath(hash), null));
  assert.equal(assign.buildPath({ kind: 'lesson', year: 1, lessonId: 'Alex Smith', mode: 'meaning' }), '');
});

test('completion codes round-trip score and missed Latin without a name', () => {
  const code = assign.encodeCompletion({
    kind: 'lesson',
    id: 'grade3-1',
    mode: 'meaning',
    score: 8,
    total: 10,
    missed: ['puella', 'Domina filiam amat.', 'sine aqua'],
    name: 'Alex Smith',
    studentName: 'Alex Smith'
  });
  assert.match(code, /^LL1\.[A-Za-z0-9_-]+\.[0-9a-f]{8}$/);
  assert.doesNotMatch(code, /Alex|Smith|student/i);
  const decoded = assign.decodeCompletion(`  ${code.slice(0, 8)} ${code.slice(8)} `);
  assert.equal(decoded.ok, true);
  assert.equal(decoded.payload.score, 8);
  assert.equal(decoded.payload.total, 10);
  assert.deepEqual(decoded.payload.missed, ['puella', 'Domina filiam amat', 'sine aqua']);
  assert.equal(Object.hasOwn(decoded.payload, 'name'), false);
  assert.equal(Object.hasOwn(decoded.payload, 'studentName'), false);
});

test('completion codes drop free-text names and reject a damaged checksum', () => {
  const code = assign.encodeCompletion({
    kind: 'quiz',
    id: 'y1',
    mode: 'quiz',
    score: 1,
    total: 2,
    missed: ['Alex Smith', 'parent@example.com', 'intro-canis-01', 'aqua']
  });
  const decoded = assign.decodeCompletion(code);
  assert.deepEqual(decoded.payload.missed, ['intro-canis-01', 'aqua']);
  const damaged = `${code.slice(0, -1)}${code.endsWith('0') ? '1' : '0'}`;
  const result = assign.decodeCompletion(damaged);
  assert.equal(result.ok, false);
  assert.match(result.error, /damaged|could not be read/);
  assert.equal(assign.encodeCompletion({ kind: 'lesson', id: 'grade3-1', score: 2, total: 1, missed: [] }), '');
});

test('the app applies assignment hashes without clearing saved progress', () => {
  const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
  const start = app.indexOf('function applyAssignmentHash');
  const end = app.indexOf('function renderCompletionCode');
  assert.ok(start > 0 && end > start);
  const body = app.slice(start, end);
  assert.equal(body.includes('removeItem'), false);
  assert.equal(body.includes('localStorage.clear'), false);
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /src="assignment-links\.js"/);
  assert.match(html, /id="codeCheckPage"/);
  assert.match(html, /data-copy-assignment/);
  assert.match(html, /href="#\/check"/);
  const netlify = fs.readFileSync(path.join(__dirname, '..', 'netlify.toml'), 'utf8');
  assert.match(netlify, /assignment-links\.js/);
  const flashcardPage = fs.readFileSync(path.join(__dirname, '..', 'flashcards.html'), 'utf8');
  assert.match(flashcardPage, /src="assignment-links\.js"/);
  const flashcards = fs.readFileSync(path.join(__dirname, '..', 'flashcards.js'), 'utf8');
  const deckApply = flashcards.slice(flashcards.indexOf('function applyDeckHash'), flashcards.indexOf('function announceDeck'));
  assert.equal(deckApply.includes('removeItem'), false);
  assert.equal(deckApply.includes('localStorage.clear'), false);
  assert.doesNotMatch(deckApply, /studentName|data\.name/);
});
