const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

function loadStories() {
  const context = {};
  vm.createContext(context);
  ['word-banks.js', 'reference-vocabulary.js', 'latin-stories.js'].forEach((file) => {
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  });
  vm.runInContext('this.__C = { GRADE_WORDS, getVocabularyStoryForLesson };', context);
  return context.__C;
}

function fold(value) {
  return String(value || '').toLowerCase().replace(/[^a-z]/g, '');
}

function lessonWords(gradeWords, index) {
  return gradeWords.slice(index * 10, index * 10 + 10);
}

test('Year 1 Lesson 1 listens for more than mensa, and only for lesson words', () => {
  const { GRADE_WORDS, getVocabularyStoryForLesson } = loadStories();
  const words = lessonWords(GRADE_WORDS[3], 0);
  const story = getVocabularyStoryForLesson(3, 0, words, []);
  const listen = story.listenFor.map(fold);
  const lesson = new Set(words.map((word) => fold(word.latin)));
  assert.ok(listen.includes('mensa'));
  assert.ok(listen.includes('puella'));
  assert.ok(listen.includes('porta'));
  assert.ok(!listen.includes('canis'));
  listen.forEach((word) => assert.ok(lesson.has(word), word));
  (story.seekFind?.targets || []).forEach((target) => {
    assert.ok(lesson.has(fold(target.latin)), target.latin);
  });
  assert.ok((story.seekFind?.targets || []).some((target) => fold(target.latin) === 'mensa'));
  assert.ok((story.seekFind?.targets || []).every((target) => fold(target.latin) !== 'canis'));
});

test('Lesson 2 Seek and Find targets are Lesson 2 words', () => {
  const { GRADE_WORDS, getVocabularyStoryForLesson } = loadStories();
  const words = lessonWords(GRADE_WORDS[3], 1);
  const story = getVocabularyStoryForLesson(3, 1, words, []);
  const lesson = new Set(words.map((word) => fold(word.latin)));
  assert.ok(story.listenFor.length >= 2);
  story.listenFor.forEach((word) => assert.ok(lesson.has(fold(word)), word));
  const targets = story.seekFind?.targets || [];
  targets.forEach((target) => assert.ok(lesson.has(fold(target.latin)), target.latin));
  assert.ok(targets.every((target) => !['magister', 'liber', 'tabula', 'stilus'].includes(fold(target.latin))));
});

test('Year 3 Lesson 2 does not drill Year 1 porta and via as its new words', () => {
  const { GRADE_WORDS, getVocabularyStoryForLesson } = loadStories();
  const words = lessonWords(GRADE_WORDS[5], 1);
  const earlier = [...GRADE_WORDS[3], ...GRADE_WORDS[4]];
  const story = getVocabularyStoryForLesson(5, 1, words, earlier);
  const listen = story.listenFor.map(fold);
  const lesson = new Set(words.map((word) => fold(word.latin)));
  listen.forEach((word) => assert.ok(lesson.has(word), word));
  assert.ok(listen.some((word) => word !== 'porta' && word !== 'via'));
  assert.ok(!listen.every((word) => word === 'porta' || word === 'via'));
  (story.seekFind?.targets || []).forEach((target) => {
    const key = fold(target.latin);
    assert.ok(lesson.has(key), target.latin);
    assert.ok(key !== 'porta' && key !== 'via');
  });
});
