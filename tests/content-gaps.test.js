const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

function read(name) {
  return fs.readFileSync(path.join(root, name), 'utf8');
}

function load(names) {
  const context = {};
  vm.createContext(context);
  names.forEach((name) => {
    vm.runInContext(read(name), context, { filename: name });
  });
  vm.runInContext(`
    globalThis.__OUT = {
      GRADE_WORDS,
      PACE_VOCABULARY_WORDS,
      CLASSROOM_LATIN_PHRASES,
      LATIN_PHRASES,
      DERIVATIVE_SENTENCES,
      NUMBER_MATCH_PAIRS,
      CULTURE_UNIT_CARDS,
      ROMAN_MAP_PLACES,
      GRAMMAR_LESSONS,
      SYNTAX_GRAMMAR_LESSONS,
      romanWorldCards,
      romanWorldTimeline
    };
  `, context);
  return context.__OUT;
}

const world = load([
  'word-banks.js',
  'reference-vocabulary.js',
  'core-frequency.js',
  'core-forms.js',
  'gap-vocabulary.js',
  'form-vocabulary.js',
  'latin-phrases.js',
  'latin-phrases-more.js',
  'latin-culture.js',
  'roman-world.js',
  'classroom-latin.js',
  'grammar-lessons.js',
  'grammar-lessons-syntax.js',
  'grammar-lessons-extra.js',
  'grammar-lessons-early.js',
  'word-building.js'
]);

function gradeOf(latin) {
  const key = String(latin).toLowerCase().replace(/[^a-z]/g, '');
  const found = Object.entries(world.GRADE_WORDS).find(([, words]) => words.some((word) => String(word.latin).toLowerCase().replace(/[^a-z]/g, '') === key));
  return found ? Number(found[0]) : null;
}

test('new recognition words, mottoes, cries, and sentences load in the intended years', () => {
  assert.equal(gradeOf('eheu'), 3);
  assert.equal(gradeOf('euge'), 3);
  assert.equal(gradeOf('quod'), 5);
  assert.equal(gradeOf('igitur'), 5);
  const lessonContext = {};
  vm.createContext(lessonContext);
  ['word-banks.js', 'reference-vocabulary.js', 'core-frequency.js', 'core-forms.js', 'gap-vocabulary.js', 'form-vocabulary.js'].forEach((name) => {
    vm.runInContext(read(name), lessonContext, { filename: name });
  });
  const appSource = read('app.js');
  vm.runInContext(appSource.slice(0, appSource.indexOf('const grammarStoryIndexByGrade')), lessonContext, { filename: 'app-lessons.js' });
  vm.runInContext('globalThis.__LESSONS = VOCAB_LESSONS.filter((lesson) => lesson.paceSet).map((lesson) => ({ id: lesson.id, title: lesson.title, words: lesson.vocabularyWords.map((word) => word.latin) }));', lessonContext);
  const paceLessons = Object.fromEntries([...lessonContext.__LESSONS].map((lesson) => [lesson.id, {
    title: String(lesson.title),
    words: [...lesson.words].join(',')
  }]));
  assert.equal(paceLessons['grade3-pace-1'].words, 'eheu,euge');
  assert.equal(paceLessons['grade3-pace-1'].title, 'Year 1: Exclamations');
  assert.equal(paceLessons['grade5-pace-1'].words, 'quod,igitur');
  assert.equal(paceLessons['grade5-pace-1'].title, 'Year 3: Little connectors');
  assert.equal(world.PACE_VOCABULARY_WORDS.length, 4);
  world.PACE_VOCABULARY_WORDS.forEach((word) => {
    assert.equal(word.paceSet, undefined);
    assert.doesNotMatch(word.dictionaryEntry, /[áéíóúýÁÉÍÓÚÝjJ]/);
    assert.equal(/[jJ]/.test(word.latin), false);
  });

  const cries = world.CLASSROOM_LATIN_PHRASES.filter((phrase) => phrase.id === 'eheu' || phrase.id === 'euge');
  assert.equal(cries.length, 2);
  cries.forEach((phrase) => assert.equal(phrase.minGrade, 3));

  const mottoGrades = Object.fromEntries(world.LATIN_PHRASES.filter((phrase) => [
    'quid-pro-quo',
    'per-capita',
    'magnum-opus',
    'sine-qua-non',
    'ipso-facto',
    'in-loco-parentis'
  ].includes(phrase.id)).map((phrase) => [phrase.id, phrase.minGrade]));
  assert.equal(mottoGrades['quid-pro-quo'], 5);
  assert.equal(mottoGrades['per-capita'], 5);
  assert.equal(mottoGrades['magnum-opus'], 5);
  assert.equal(mottoGrades['sine-qua-non'], 6);
  assert.equal(mottoGrades['ipso-facto'], 6);
  assert.equal(mottoGrades['in-loco-parentis'], 6);
  assert.equal(world.LATIN_PHRASES.filter((phrase) => phrase.id === 'caveat-emptor').length, 1);
  assert.equal(world.LATIN_PHRASES.filter((phrase) => phrase.id === 'persona-non').length, 1);

  assert.equal(world.DERIVATIVE_SENTENCES.length, 30);
  assert.equal(world.DERIVATIVE_SENTENCES.filter((item) => item.minGrade === 5).length, 12);
  assert.equal(world.DERIVATIVE_SENTENCES.filter((item) => item.minGrade === 6).length, 18);
  world.DERIVATIVE_SENTENCES.forEach((item) => {
    assert.equal(item.choices.length, 4, item.id);
    assert.ok(item.choices.includes(item.answer), item.id);
    assert.equal(new Set(item.choices).size, 4, item.id);
    assert.equal(gradeOf(item.latin) !== null, true, item.latin);
  });
  assert.equal(world.NUMBER_MATCH_PAIRS.length, 10);
  assert.equal([...world.NUMBER_MATCH_PAIRS].map((pair) => pair.numeral).join(','), 'I,II,III,IV,V,VI,VII,VIII,IX,X');
  assert.equal([...world.NUMBER_MATCH_PAIRS].map((pair) => pair.latin).join(','), 'unus,duo,tres,quattuor,quinque,sex,septem,octo,novem,decem');
});

test('new cards, places, and lessons keep the year pacing', () => {
  const byId = Object.fromEntries(world.CULTURE_UNIT_CARDS.map((card) => [card.id, card.minGrade]));
  assert.equal(byId['life-lararium'], 4);
  assert.equal(byId['life-bulla'], 4);
  assert.equal(byId['life-saturnalia'], 5);
  assert.equal(byId['life-seven-hills'], 5);
  assert.equal(byId['life-roman-name'], 5);
  assert.equal(byId['life-orders'], 6);
  assert.equal(byId['life-funeral'], 7);
  assert.equal(byId['myth-proserpina'], 5);
  assert.equal(byId['myth-phaethon'], 5);
  assert.equal(byId['myth-prometheus'], 5);
  assert.equal(byId['myth-pandora'], 6);
  assert.equal(byId['myth-pyramus'], 7);
  assert.equal(byId['myth-europa'], 7);
  assert.equal(byId['hist-sabines'], 5);
  assert.equal(byId['hist-numa'], 5);
  assert.equal(byId['hist-camillus'], 7);
  assert.equal(byId['hist-coriolanus'], 7);
  assert.equal(byId['hist-scipio'], 7);
  assert.equal(byId['hist-gracchi'], 7);
  assert.equal(byId['hist-spartacus'], 8);
  assert.equal(byId['hist-etruscans'], 6);
  assert.equal(byId['hist-greeks'], 6);

  const yearTwoMyths = world.romanWorldCards('myth', 4).map((card) => card.id);
  assert.equal(yearTwoMyths.includes('myth-proserpina'), false);
  assert.equal(world.romanWorldCards('life', 4).some((card) => card.id === 'life-lararium'), true);
  assert.equal(world.romanWorldCards('life', 4).some((card) => card.id === 'life-saturnalia'), false);
  assert.equal(world.romanWorldTimeline(5).some((event) => event.cardId === 'hist-spartacus'), false);
  assert.equal(world.romanWorldTimeline(5).some((event) => event.cardId === 'hist-sabines'), true);
  assert.ok(world.romanWorldTimeline(4).length >= 20);

  const places = Object.fromEntries(world.ROMAN_MAP_PLACES.map((place) => [place.id, place]));
  assert.equal(places.sardinia.group, 'lands');
  ['padus', 'arnus', 'palatinus', 'capitolinus', 'aventinus', 'caelius', 'esquilinus', 'viminalis', 'quirinalis'].forEach((id) => {
    assert.equal(places[id].group, 'italy', id);
    assert.equal(places[id].minGrade, 5, id);
    assert.equal(/[jJ]/.test(places[id].latin), false, places[id].latin);
  });

  const lessonIds = world.GRAMMAR_LESSONS.map((lesson) => lesson.id);
  assert.ok(lessonIds.includes('grade4-grammar-question-chunks'));
  assert.ok(lessonIds.includes('grade5-grammar-little-connectors'));
  assert.ok(lessonIds.includes('grade5-grammar-adverb-endings'));
  assert.ok(world.SYNTAX_GRAMMAR_LESSONS.some((lesson) => lesson.id === 'grade6-grammar-adverb-practice'));
  [...world.GRAMMAR_LESSONS, ...world.SYNTAX_GRAMMAR_LESSONS].filter((lesson) => (
    lesson.id === 'grade4-grammar-question-chunks'
    || lesson.id === 'grade5-grammar-little-connectors'
    || lesson.id === 'grade5-grammar-adverb-endings'
    || lesson.id === 'grade6-grammar-adverb-practice'
  )).forEach((lesson) => {
    assert.equal(lesson.words.length, 6, lesson.id);
    lesson.words.forEach((word) => {
      assert.equal(/[jJ]/.test(word.latin), false, word.latin);
      assert.ok(word.choices.includes(word.english), word.latin);
    });
  });
});

test('the private gap list is not part of the site files', () => {
  const names = fs.readdirSync(root);
  assert.equal(names.some((name) => /gap-list/i.test(name)), false);
  ['roman-world.js', 'word-building.js', 'grammar-lessons-early.js', 'gap-vocabulary.js', 'latin-phrases-more.js', 'classroom-latin.js'].forEach((name) => {
    assert.equal(/national latin exam|nle\.org|\bNLE\b/i.test(read(name)), false, name);
    assert.equal(/\b(First|Second|Third) Form\b/.test(read(name)), false, name);
  });
});
