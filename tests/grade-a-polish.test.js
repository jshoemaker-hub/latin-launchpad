const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

function read(name) {
  return fs.readFileSync(path.join(root, name), 'utf8');
}

function loadStories() {
  const context = {};
  vm.createContext(context);
  ['word-banks.js', 'reference-vocabulary.js', 'latin-stories.js'].forEach((file) => {
    vm.runInContext(read(file), context, { filename: file });
  });
  vm.runInContext('this.__C = { GRADE_WORDS, getVocabularyStoryForLesson, storyFold };', context);
  return context.__C;
}

test('every Year label is shown with its grade', () => {
  const index = read('index.html');
  [['3', '1'], ['4', '2'], ['5', '3'], ['6', '4A'], ['7', '4B'], ['8', '4C']].forEach(([grade, year]) => {
    assert.match(index, new RegExp(`<option value="${grade}">Year ${year} · Grade ${grade}</option>`));
    assert.match(index, new RegExp(`data-home-flashcards-grade="${grade}">Year ${year}<small>Grade ${grade}</small>`));
  });
  ['app.js', 'flashcards.js'].forEach((file) => {
    const levels = read(file).match(/book: '[^']+'/g);
    assert.equal(levels.length, 6, file);
    levels.forEach((book, index) => assert.match(book, new RegExp(`^book: 'Grade ${index + 3} · `), file));
  });
  assert.doesNotMatch(index, /<title>[^<]*Years 1–4/);
});

test('timed flashcards show a session goal instead of the whole deck count', () => {
  const app = read('app.js');
  assert.doesNotMatch(app, /Card \$\{StudyState\.index \+ 1\} of \$\{StudyState\.words\.length\}/);
  const goal = new Function('StudyState', `
    ${app.slice(app.indexOf('const FLASHCARD_GOAL_CARDS_PER_MINUTE'), app.indexOf('function renderFlashcard() {'))}
    return getFlashcardSessionGoal();
  `);
  assert.equal(goal({ durationSeconds: 600, words: new Array(382) }), 20);
  assert.equal(goal({ durationSeconds: 300, words: new Array(382) }), 10);
  assert.equal(goal({ durationSeconds: 900, words: new Array(12) }), 12);
});

test('primary nav keeps five items and tucks the rest under More', () => {
  const index = read('index.html');
  const nav = index.slice(index.indexOf('<nav id="headerNav"'), index.indexOf('</nav>', index.indexOf('<nav id="headerNav"')));
  const more = nav.slice(nav.indexOf('id="headerMoreMenu"'));
  const primary = nav.slice(0, nav.indexOf('<div class="header-more">'));
  assert.equal((primary.match(/class="pill-button"/g) || []).length, 5);
  ['dictionaryButton', 'annualExamButton', 'romanWorldButton', 'wordBuildingButton', 'accountButton', 'contactButton']
    .forEach((id) => assert.match(more, new RegExp(`id="${id}"`)));
  assert.match(nav, /id="headerMoreButton"[^>]*aria-expanded="false"[^>]*aria-controls="headerMoreMenu"/);
});

test('every page has a skip link and honors reduced motion', () => {
  ['index.html', 'flashcards.html', 'about.html', 'contact.html', 'privacy.html', 'terms.html',
    'parents-teachers.html', 'school-privacy.html', '404.html'].forEach((file) => {
    const html = read(file);
    assert.match(html, /<a class="skip-link" href="#main">Skip to main content<\/a>/, file);
    assert.match(html, /<main[^>]* id="main" tabindex="-1">/, file);
  });
  assert.match(read('styles.css'), /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(read('flashcards.html'), /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(read('app.js'), /behavior: 'smooth'/);
});

test('cached story matching gives the same story for repeated calls', () => {
  const { GRADE_WORDS, getVocabularyStoryForLesson, storyFold } = loadStories();
  assert.equal(storyFold('Mēnsa!'), 'mensa');
  assert.equal(storyFold('Mēnsa!'), 'mensa');
  const earlier = [...GRADE_WORDS[3], ...GRADE_WORDS[4]];
  const words = GRADE_WORDS[5].slice(10, 20);
  const first = JSON.stringify(getVocabularyStoryForLesson(5, 1, words, earlier));
  const second = JSON.stringify(getVocabularyStoryForLesson(5, 1, words, earlier.slice()));
  assert.equal(first, second);
});

test('core word bank avoids non-classical headwords and known mistranslations', () => {
  const { GRADE_WORDS } = loadStories();
  const words = Object.values(GRADE_WORDS).flat();
  ['zenith', 'zenithus', 'uranus', 'equitas'].forEach((latin) => {
    assert.ok(!words.some((word) => word.latin === latin), latin);
  });
  const gloss = (latin) => words.find((word) => word.latin === latin)?.english;
  assert.equal(gloss('salveo'), 'be well / be in good health');
  assert.equal(gloss('loculus'), 'little box / compartment');
  assert.equal(gloss('saluto'), 'greet');
});
