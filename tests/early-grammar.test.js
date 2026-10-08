const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

function load(names) {
  const context = {};
  vm.createContext(context);
  names.forEach((name) => {
    const filePath = path.join(root, name);
    vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
  });
  vm.runInContext(
    'globalThis.__OUT = { grammar: GRAMMAR_LESSONS, syntax: typeof SYNTAX_GRAMMAR_LESSONS === "undefined" ? [] : SYNTAX_GRAMMAR_LESSONS };',
    context
  );
  return context.__OUT;
}

const files = [
  'grammar-lessons.js',
  'grammar-lessons-syntax.js',
  'grammar-lessons-extra.js',
  'grammar-lessons-early.js'
];

test('new grammar lessons keep old ids and add the early pace', () => {
  const before = load(['grammar-lessons.js']);
  const beforeIds = before.grammar.map((lesson) => `${lesson.id}:${lesson.grade}`);
  const after = load(files);
  const lessons = after.grammar;
  const syntax = after.syntax;
  const afterIds = lessons.map((lesson) => `${lesson.id}:${lesson.grade}`);
  beforeIds.forEach((id) => {
    assert.ok(afterIds.includes(id), id);
  });

  const ids = (list) => list.map((lesson) => lesson.id).join('|');
  const grade4 = lessons.filter((lesson) => lesson.grade === 4);
  assert.equal(ids(grade4), [
    'grade4-grammar-one-many',
    'grade4-grammar-amo',
    'grade4-grammar-little-words',
    'grade4-grammar-ego-tu'
  ].join('|'));
  const grade5 = lessons.filter((lesson) => lesson.grade === 5);
  assert.equal(ids(grade5).split('|').slice(-7).join('|'), [
    'grade5-grammar-of-and-to',
    'grade5-grammar-with-from',
    'grade5-grammar-was-doing',
    'grade5-grammar-do-and-to-do',
    'grade5-grammar-bonus-puella',
    'grade5-grammar-rex-pater',
    'grade5-grammar-one-to-ten'
  ].join('|'));
  const grade6 = [...lessons, ...syntax].filter((lesson) => lesson.grade === 6);
  assert.equal(ids(grade6).split('|').slice(-4).join('|'), [
    'grade6-grammar-roman-numerals',
    'grade6-grammar-have-done',
    'grade6-grammar-possum-noli',
    'grade6-grammar-calling-names'
  ].join('|'));

  const added = [...lessons, ...syntax].filter((lesson) => (
    lesson.id.startsWith('grade4-grammar-little')
    || lesson.id.startsWith('grade4-grammar-ego')
    || lesson.id.startsWith('grade5-grammar-of')
    || lesson.id.startsWith('grade5-grammar-with')
    || lesson.id.startsWith('grade5-grammar-was')
    || lesson.id.startsWith('grade5-grammar-do')
    || lesson.id.startsWith('grade5-grammar-bonus')
    || lesson.id.startsWith('grade5-grammar-rex')
    || lesson.id.startsWith('grade5-grammar-one')
    || lesson.id.startsWith('grade6-grammar-have')
    || lesson.id.startsWith('grade6-grammar-possum')
    || lesson.id.startsWith('grade6-grammar-calling')
  ));
  assert.equal(added.length, 12);
  added.forEach((lesson) => {
    assert.equal(lesson.words.length, 6, lesson.id);
    assert.ok(lesson.explain.length >= 2, lesson.id);
    lesson.explain.forEach((paragraph) => {
      assert.ok(paragraph.length >= 40, lesson.id);
    });
    lesson.words.forEach((word) => {
      assert.equal(/[jJ]/.test(word.latin), false, `${lesson.id} ${word.latin}`);
      assert.equal(word.choices.length, 4, lesson.id);
      assert.equal(new Set(word.choices).size, 4, `${lesson.id} ${word.latin}`);
      assert.ok(word.choices.includes(word.english), `${lesson.id} ${word.latin}`);
      assert.ok(word.explanation.length >= 12, lesson.id);
    });
    const blob = `${lesson.title} ${lesson.description} ${lesson.explain.join(' ')}`;
    assert.equal(/\b(First|Second|Third) Form\b/.test(blob), false, lesson.id);
    assert.equal(/national latin exam|nle\.org|\bNLE\b/i.test(blob), false, lesson.id);
  });

  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(app, /examLevelId: 'intro'/);
  assert.match(app, /examLevelId: 'beginning'/);
  assert.match(app, /examLevelId: 'intermediate'/);
  const objectives = fs.readFileSync(path.join(root, 'learning-objectives.js'), 'utf8');
  assert.match(objectives, /Build a 120-word foundation for people, home, nature, numbers, and daily life/);
  assert.match(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), /grammar-lessons-early\.js/);
  assert.match(fs.readFileSync(path.join(root, 'netlify.toml'), 'utf8'), /grammar-lessons-early\.js/);
});
