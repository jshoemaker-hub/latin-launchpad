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

function loadVocabulary(includeCore) {
  const context = {};
  vm.createContext(context);
  const files = ['word-banks.js', 'reference-vocabulary.js'];
  if (includeCore) {
    files.push('core-frequency.js', 'core-forms.js', 'form-vocabulary.js');
  }
  files.forEach((file) => {
    vm.runInContext(read(file), context, { filename: file });
  });
  if (includeCore) {
    const lessonSource = appSource.slice(0, appSource.indexOf('const grammarStoryIndexByGrade'));
    vm.runInContext(lessonSource, context, { filename: 'app-lessons.js' });
  }
  vm.runInContext(
    'globalThis.__OUT = { GRADE_WORDS, VOCAB_LESSONS: typeof VOCAB_LESSONS === "undefined" ? null : VOCAB_LESSONS, CORE_FREQUENCY_WORDS: typeof CORE_FREQUENCY_WORDS === "undefined" ? null : CORE_FREQUENCY_WORDS };',
    context
  );
  return context.__OUT;
}

const before = loadVocabulary(false);
const after = loadVocabulary(true);

test('core words are new headwords with ranks, glosses, and dictionary forms', () => {
  const existing = new Set(Object.values(before.GRADE_WORDS).flat().flatMap((word) => {
    const keys = tokenKeys(word.latin);
    return keys.length <= 1 || String(word.latin).includes('/') ? keys : [];
  }));
  const seen = new Set();
  const added = Object.values(after.GRADE_WORDS).flat().filter((word) => word.coreSet);
  assert.equal(after.CORE_FREQUENCY_WORDS.length, 119);
  assert.equal(added.length, after.CORE_FREQUENCY_WORDS.length);
  assert.ok(!after.CORE_FREQUENCY_WORDS.some((word) => word.latin === 'vivo'));

  after.CORE_FREQUENCY_WORDS.forEach((word) => {
    const keys = tokenKeys(word.latin);
    assert.ok(keys.length > 0, word.latin);
    keys.forEach((key) => {
      assert.ok(!existing.has(key), `${word.latin} repeats a word already on the site`);
      assert.ok(!seen.has(key), `${word.latin} repeats another new core word`);
      seen.add(key);
    });
    assert.equal(typeof word.frequencyRank, 'number');
    assert.ok(word.frequencyRank >= 1 && word.frequencyRank <= 500, word.latin);
    assert.equal(word.frequencySource, 'Dickinson College Commentaries Latin Core Vocabulary');
    assert.ok(word.english && !word.english.includes('NLE'), word.latin);
  });

  added.forEach((word) => {
    assert.ok(word.dictionaryEntry, `${word.latin} needs a dictionary form`);
    assert.doesNotMatch(word.dictionaryEntry, /[áéíóúýÁÉÍÓÚÝjJ]/, word.latin);
    assert.ok(Array.isArray(word.formBooks) && word.formBooks.length === 0, word.latin);
    if (word.partOfSpeech === 'verb') {
      assert.match(word.dictionaryEntry, /,/, word.latin);
    }
  });
});

test('core words keep existing lesson ids and follow frequency order', () => {
  [3, 4, 5, 6, 7, 8].forEach((grade) => {
    const baseBefore = before.GRADE_WORDS[grade].map((word) => word.latin).join('\n');
    const baseAfter = after.GRADE_WORDS[grade].filter((word) => !word.coreSet).map((word) => word.latin).join('\n');
    assert.equal(baseAfter, baseBefore, `grade ${grade} base list changed`);
    const core = after.GRADE_WORDS[grade].filter((word) => word.coreSet);
    const ranks = core.map((word) => Number(word.frequencyRank));
    assert.equal(ranks.join(','), [...ranks].sort((left, right) => left - right).join(','));
  });

  const yearOne = after.VOCAB_LESSONS.filter((lesson) => lesson.grade === 3 && !lesson.coreSet);
  assert.equal(yearOne[0].id, 'grade3-1');
  assert.equal(yearOne[0].title, 'Year 1: Lesson 1');
  assert.equal(yearOne[0].vocabularyWords[0].latin, before.GRADE_WORDS[3][0].latin);
  assert.ok(yearOne.every((lesson) => lesson.vocabularyWords.every((word) => !word.coreSet)));

  const coreLessons = after.VOCAB_LESSONS.filter((lesson) => lesson.coreSet);
  assert.ok(coreLessons.length >= 6);
  assert.equal(coreLessons[0].id, `grade3-${yearOne.length + 1}`);
  assert.equal(coreLessons[0].title, 'Year 1: Core words 1');
  assert.ok(coreLessons.every((lesson) => /^grade[3-8]-\d+$/.test(lesson.id)));
  assert.equal(new Set(coreLessons.map((lesson) => lesson.id)).size, coreLessons.length);

  const yearFourBase = Array.from(after.VOCAB_LESSONS).filter((lesson) => lesson.grade >= 6 && !lesson.coreSet);
  const yearFourCore = Array.from(after.VOCAB_LESSONS).filter((lesson) => lesson.grade >= 6 && lesson.coreSet);
  const coreTitles = yearFourCore.map((lesson) => String(lesson.title));
  assert.equal(new Set(coreTitles).size, coreTitles.length);
  assert.equal(coreTitles[0], 'Year 4: Core words 1');
  assert.equal(coreTitles[coreTitles.length - 1], `Year 4: Core words ${coreTitles.length}`);
  assert.equal(yearFourBase[0].title, 'Year 4: Lesson 1');
  const numbers = yearFourBase.map((lesson) => Number(String(lesson.title).slice(String(lesson.title).lastIndexOf(' ') + 1)));
  assert.equal(numbers.join(','), Array.from({ length: numbers.length }, (_, index) => index + 1).join(','));
});

test('the sources note credits the frequency list without copying its definitions', () => {
  const about = read('about.html');
  assert.match(about, /Dickinson College Commentaries Latin Core Vocabulary/);
  assert.match(about, /CC BY-SA 3\.0/);
  assert.match(about, /English glosses on this site are original/);
  assert.doesNotMatch(about, /\bNLE\b|National Latin Exam|nle\.org/i);
  ['core-frequency.js', 'core-forms.js', 'scripts/build-core-frequency.py'].forEach((file) => {
    assert.doesNotMatch(read(file), /\bNLE\b|National Latin Exam|nle\.org/i, file);
  });
});
