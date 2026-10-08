const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

function read(name) {
  return fs.readFileSync(path.join(root, name), 'utf8');
}

function tokenKeys(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/j/g, 'i')
    .split(/[^a-z]+/)
    .filter(Boolean);
}

function blocks(latin) {
  const keys = tokenKeys(latin);
  if (keys.length <= 1 || String(latin).includes('/')) return keys;
  return [];
}

function load(includeGap) {
  const context = {};
  vm.createContext(context);
  const files = ['word-banks.js', 'reference-vocabulary.js', 'core-frequency.js', 'core-forms.js'];
  if (includeGap) files.push('gap-vocabulary.js');
  files.push('form-vocabulary.js');
  files.forEach((file) => vm.runInContext(read(file), context, { filename: file }));
  const lessonSource = appSource.slice(0, appSource.indexOf('const grammarStoryIndexByGrade'));
  vm.runInContext(lessonSource, context, { filename: 'app-lessons.js' });
  vm.runInContext(
    'globalThis.__OUT = { GRADE_WORDS, VOCAB_LESSONS, GAP_VOCABULARY_WORDS: typeof GAP_VOCABULARY_WORDS === "undefined" ? [] : GAP_VOCABULARY_WORDS };',
    context
  );
  return context.__OUT;
}

const before = load(false);
const after = load(true);

test('gap words are new headwords with dictionary lines and no textbook tags', () => {
  const existing = new Set(Object.values(before.GRADE_WORDS).flat().flatMap((word) => blocks(word.latin)));
  const added = Object.values(after.GRADE_WORDS).flat().filter((word) => word.gapSet);
  assert.equal(after.GAP_VOCABULARY_WORDS.length, 79);
  assert.equal(added.length, 79);
  const seen = new Set();
  added.forEach((word) => {
    tokenKeys(word.latin).forEach((key) => {
      assert.ok(!existing.has(key), `${word.latin} repeats an existing headword`);
      assert.ok(!seen.has(key), `${word.latin} repeats another new word`);
      seen.add(key);
    });
    assert.ok(word.dictionaryEntry, word.latin);
    assert.doesNotMatch(word.dictionaryEntry, /[áéíóúýÁÉÍÓÚÝjJ]/, word.latin);
    assert.ok(Array.isArray(word.formBooks) && word.formBooks.length === 0, word.latin);
  });
  assert.doesNotMatch(read('gap-vocabulary.js'), /\bNLE\b|National Latin Exam|nle\.org/i);
});

test('early function words and house words sit in Years 1 and 2', () => {
  const byLatin = Object.fromEntries(after.GAP_VOCABULARY_WORDS.map((word) => [word.latin, word.grade]));
  ['ecce', 'neque', 'statim', 'olim', 'atrium', 'tunica', 'stola', 'stilus'].forEach((latin) => {
    assert.equal(byLatin[latin], 3, latin);
  });
  ['postquam', 'necesse', 'triclinium', 'tablinum'].forEach((latin) => {
    assert.equal(byLatin[latin], 4, latin);
  });
  ['ut', 'ne', 'quidam', 'iste', 'oportet', 'utinam'].forEach((latin) => {
    assert.equal(byLatin[latin], 8, latin);
  });
});

test('extra-word lessons do not move the core or base lessons', () => {
  const yearOneBase = after.VOCAB_LESSONS.filter((lesson) => lesson.grade === 3 && !lesson.coreSet && !lesson.gapSet);
  assert.equal(yearOneBase[0].id, 'grade3-1');
  assert.equal(yearOneBase[0].title, 'Year 1: Lesson 1');
  assert.equal(yearOneBase[0].vocabularyWords[0].latin, before.GRADE_WORDS[3][0].latin);
  const core = after.VOCAB_LESSONS.filter((lesson) => lesson.coreSet);
  const gap = after.VOCAB_LESSONS.filter((lesson) => lesson.gapSet);
  assert.ok(gap.length >= 6);
  const ids = new Set(core.map((lesson) => lesson.id));
  gap.forEach((lesson) => {
    assert.equal(ids.has(lesson.id), false, lesson.id);
    assert.match(lesson.title, /Extra words/);
  });
  assert.equal(after.VOCAB_LESSONS.find((lesson) => lesson.grade === 3 && lesson.gapSet).title, 'Year 1: Extra words 1');
});
