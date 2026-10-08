const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const lessonId = /^grade[3-8]-(?:grammar(?:-[a-z0-9]+)+|\d+)$/;
const banned = [
  { label: 'NLE', pattern: /\bNLE\b/i },
  { label: 'National Latin Exam', pattern: /national latin exam/i },
  { label: 'nle.org', pattern: /nle\.org/i }
];

function loadLessons() {
  const context = {};
  vm.createContext(context);
  ['grammar-lessons.js', 'grammar-lessons-syntax.js'].forEach((name) => {
    const filePath = path.join(root, name);
    vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
  });
  vm.runInContext(
    'globalThis.__OUT = { GRAMMAR_LESSONS, SYNTAX_GRAMMAR_LESSONS };',
    context
  );
  return context.__OUT;
}

test('intermediate and syntax lessons teach, exemplify, and practice', () => {
  const { GRAMMAR_LESSONS, SYNTAX_GRAMMAR_LESSONS } = loadLessons();
  assert.equal(GRAMMAR_LESSONS.length, 23);
  assert.equal(SYNTAX_GRAMMAR_LESSONS.length, 15);

  const ids = new Set(GRAMMAR_LESSONS.map((lesson) => lesson.id));
  const required = [
    'grade8-grammar-impersonals',
    'grade8-grammar-questions-commands',
    'grade8-grammar-time-space',
    'grade8-grammar-compare-reflexive',
    'grade8-grammar-numbers-idioms',
    'grade8-grammar-subjunctive',
    'grade8-grammar-purpose-result',
    'grade8-grammar-indirect',
    'grade8-grammar-cum-fear',
    'grade8-grammar-conditions',
    'grade8-grammar-ablative-absolute',
    'grade8-grammar-gerunds',
    'grade8-grammar-periphrastics',
    'grade8-grammar-deponents',
    'grade8-grammar-place-supine'
  ];
  assert.deepEqual(Array.from(SYNTAX_GRAMMAR_LESSONS, (lesson) => lesson.id), required);

  const intermediate = SYNTAX_GRAMMAR_LESSONS.filter((lesson) => lesson.series === 'intermediate');
  const syntax = SYNTAX_GRAMMAR_LESSONS.filter((lesson) => lesson.series === 'syntax');
  assert.equal(intermediate.length, 5);
  assert.equal(syntax.length, 10);

  SYNTAX_GRAMMAR_LESSONS.forEach((lesson) => {
    assert.equal(lesson.grade, 8);
    assert.equal(lesson.kind, 'grammar');
    assert.match(lesson.id, lessonId);
    assert.equal(ids.has(lesson.id), false);
    ids.add(lesson.id);
    assert.ok(Array.isArray(lesson.explain) && lesson.explain.length >= 2, `${lesson.id} needs an explanation`);
    lesson.explain.forEach((paragraph) => {
      assert.ok(paragraph.length >= 40, `${lesson.id} explanation is too short`);
    });
    assert.ok(Array.isArray(lesson.examples) && lesson.examples.length >= 3, `${lesson.id} needs examples`);
    lesson.examples.forEach((example) => {
      assert.ok(example.latin && example.english, `${lesson.id} example is incomplete`);
      assert.equal(/[jJ]/.test(example.latin.replace(/subjunctive/ig, '')), false, `${lesson.id} example uses j: ${example.latin}`);
    });
    assert.equal(lesson.words.length, 6, `${lesson.id} should have 6 practice items`);
    lesson.words.forEach((word) => {
      assert.equal(/[jJ]/.test(word.latin.replace(/subjunctive/ig, '')), false, `${lesson.id} uses j: ${word.latin}`);
      assert.ok(word.prompt && word.prompt.length >= 8, `${lesson.id} prompt is short`);
      assert.ok(word.hint && word.explanation && word.explanation.length >= 12, `${lesson.id} needs a hint and explanation`);
      assert.equal(word.choices.length, 4, `${lesson.id} needs 4 choices`);
      assert.equal(new Set(word.choices).size, 4, `${lesson.id} has duplicate choices`);
      const graded = word.choices.includes(word.english) ? word.english : word.choices[0];
      assert.equal(word.choices[0], graded, `${lesson.id} should list the graded answer first`);
    });
  });

  const source = fs.readFileSync(path.join(root, 'grammar-lessons-syntax.js'), 'utf8');
  const hits = [];
  source.split('\n').forEach((line, index) => {
    banned.forEach((rule) => {
      if (rule.pattern.test(line)) hits.push(`${index + 1} ${rule.label}`);
    });
  });
  assert.deepEqual(hits, []);

  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(app, /SYNTAX_GRAMMAR_LESSONS/);
  assert.match(app, /function grammarTeachingMarkup/);
  assert.match(app, /function grammarTeachingPrintHtml/);
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /grammar-lessons-syntax\.js/);
});
