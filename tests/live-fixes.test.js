const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const wordBanks = fs.readFileSync(path.join(root, 'word-banks.js'), 'utf8');
const grammarSource = fs.readFileSync(path.join(root, 'grammar-lessons.js'), 'utf8');
const objectivesSource = fs.readFileSync(path.join(root, 'learning-objectives.js'), 'utf8');

function sliceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0 && end > start, `Missing slice ${startMarker} -> ${endMarker}`);
  return source.slice(start, end);
}

function loadChoiceHelpers() {
  return Function(`
    ${wordBanks}
    ${sliceBetween(appSource, 'function latinHeadwordKey', 'function selectOption')}
    return { questionAnswer, createChoices, GRADE_WORDS };
  `)();
}

function loadSyllables() {
  return Function(`
    ${sliceBetween(appSource, 'function getSyllableCue', 'function renderSyllableCue')}
    return getSyllableCue;
  `)();
}

const { questionAnswer, createChoices, GRADE_WORDS } = loadChoiceHelpers();
const GRAMMAR_LESSONS = Function(`${grammarSource}\nreturn GRAMMAR_LESSONS;`)();
const LEARNING_OBJECTIVES = Function(`${objectivesSource}\nreturn LEARNING_OBJECTIVES;`)();
const grammarQuestions = GRAMMAR_LESSONS.flatMap((lesson) => lesson.words);

test('hand-written grammar questions grade the authored choice, not the English gloss', () => {
  const mismatched = grammarQuestions.filter((question) => (
    Array.isArray(question.choices)
    && question.choices.length > 0
    && !question.choices.includes(question.english)
  ));
  assert.equal(grammarQuestions.length, 130);
  assert.equal(mismatched.length, 57);

  const sine = mismatched.find((question) => question.latin === 'sine aqua');
  assert.equal(questionAnswer(sine), 'ablative');
  const sineChoices = createChoices(sine, grammarQuestions);
  assert.deepEqual(
    sineChoices.slice().sort(),
    ['ablative', 'accusative', 'genitive', 'nominative'].sort()
  );
  assert.ok(!sineChoices.includes('without water'));

  mismatched.forEach((question) => {
    assert.equal(questionAnswer(question), question.choices[0], question.latin);
    const choices = createChoices(question, grammarQuestions);
    assert.ok(choices.includes(question.choices[0]), question.latin);
    assert.ok(!choices.includes(question.english), `${question.latin} still offers its gloss`);
  });

  const aligned = grammarQuestions.find((question) => question.latin === 'nauta');
  assert.equal(questionAnswer(aligned), 'one sailor');
  assert.ok(createChoices(aligned, grammarQuestions).includes('one sailor'));

  const phrase = {
    isPhrase: true,
    latin: 'Acta non verba',
    english: 'deeds, not words',
    choices: ['in good faith', 'knowledge is power', 'virtue and knowledge']
  };
  assert.equal(questionAnswer(phrase), 'deeds, not words');
  const phraseChoices = createChoices(phrase, [phrase]);
  assert.ok(phraseChoices.includes('deeds, not words'));
  assert.ok(phraseChoices.includes('in good faith'));

  const vocabChoices = createChoices({ latin: 'puella', english: 'girl' }, GRADE_WORDS[3]);
  assert.ok(vocabChoices.includes('girl'));
  assert.equal(vocabChoices.length, 4);
});

test('syllable cues follow Latin syllabification', () => {
  const getSyllableCue = loadSyllables();
  const expected = {
    puella: 'pu-el-la',
    terra: 'ter-ra',
    insula: 'in-su-la',
    mensa: 'men-sa',
    familia: 'fa-mi-li-a',
    patria: 'pa-tri-a',
    agricola: 'a-gri-co-la',
    magistra: 'ma-gis-tra',
    aqua: 'a-qua',
    iubeo: 'iu-be-o',
    caelum: 'cae-lum',
    poena: 'poe-na',
    aurum: 'au-rum',
    equus: 'e-quus',
    examen: 'ex-a-men',
    extra: 'ex-tra',
    lingua: 'lin-gu-a',
    schola: 'scho-la',
    pulcher: 'pul-cher',
    iustitia: 'ius-ti-ti-a',
    quaestor: 'quaes-tor',
    amo: '',
    est: '',
    urbs: '',
    'sine aqua': ''
  };

  Object.entries(expected).forEach(([word, cue]) => {
    assert.equal(getSyllableCue(word), cue, word);
  });

  const rejected = {
    puella: 'pue-lla',
    terra: 'te-rra',
    insula: 'i-nsu-la',
    mensa: 'me-nsa',
    familia: 'fa-mi-lia'
  };
  Object.entries(rejected).forEach(([word, cue]) => {
    assert.notEqual(getSyllableCue(word), cue, word);
  });

  const vocabulary = Object.values(GRADE_WORDS).flat().map((word) => word.latin);
  let cued = 0;
  vocabulary.forEach((latin) => {
    const cue = getSyllableCue(latin);
    if (!cue) return;
    cued += 1;
    assert.match(cue, /^[a-z]+(?:-[a-z]+)+$/, latin);
    const doubled = latin.toLowerCase().match(/([bcdfghjklmnpqrstvwxyz])\1/);
    if (doubled) assert.ok(cue.includes(`${doubled[1]}-${doubled[1]}`), `${latin} -> ${cue}`);
  });
  assert.ok(cued > 200, `expected syllable cues for most vocabulary, got ${cued}`);
});

test('the analytics banner stays hidden after it is dismissed', () => {
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  const flexRule = css.indexOf('.analytics-consent {');
  const hiddenRule = css.indexOf('.analytics-consent[hidden]');
  assert.ok(flexRule >= 0 && hiddenRule > flexRule);
  assert.match(css.slice(hiddenRule, hiddenRule + 120), /display:\s*none\s*!important/);
  const flashcards = fs.readFileSync(path.join(root, 'flashcards.html'), 'utf8');
  assert.match(flashcards, /\.analytics-consent\[hidden\]\s*\{\s*display:\s*none\s*!important/);
});

test('Year 4 lesson numbers continue across grades 6, 7, and 8', () => {
  const helpers = Function(`
    ${wordBanks}
    ${appSource.slice(0, appSource.indexOf('const VOCAB_LESSONS'))}
    return { getVocabLessonNumber, getLessonLevelName, GRADE_WORDS, LESSON_CHUNK_SIZE };
  `)();
  const numbers = [6, 7, 8].flatMap((grade) => {
    const lessonCount = Math.ceil(helpers.GRADE_WORDS[grade].length / helpers.LESSON_CHUNK_SIZE);
    return Array.from({ length: lessonCount }, (_, index) => {
      const number = helpers.getVocabLessonNumber(grade, index);
      return `${helpers.getLessonLevelName(grade)}: Lesson ${number}`;
    });
  });
  assert.equal(numbers[0], 'Year 4A: Lesson 1');
  assert.equal(new Set(numbers).size, numbers.length);
  ['Year 4A', 'Year 4B', 'Year 4C'].forEach((label) => {
    const bandNumbers = numbers
      .filter((title) => title.startsWith(`${label}:`))
      .map((title) => Number(title.slice(title.lastIndexOf(' ') + 1)));
    assert.ok(bandNumbers.length > 0, label);
    assert.deepEqual(bandNumbers, Array.from({ length: bandNumbers.length }, (_, index) => index + 1));
  });
});

test('Year 1 copy, greeting, and picture matching follow the data', () => {
  assert.equal(GRADE_WORDS[3].length, 120);
  assert.equal(
    LEARNING_OBJECTIVES[3].goals[1],
    'Build a 120-word foundation for people, home, nature, numbers, and daily life'
  );
  for (const latin of ['senatus', 'eques', 'pulcher']) {
    assert.ok(!GRADE_WORDS[3].some((word) => word.latin === latin), latin);
  }
  assert.ok(!GRADE_WORDS[4].some((word) => word.latin === 'sophia'));
  assert.ok(GRADE_WORDS[7].some((word) => word.latin === 'senatus' && word.english === 'senate'));
  assert.ok(GRADE_WORDS[8].some((word) => word.latin === 'senatus' && word.english === 'senate'));
  assert.ok(GRADE_WORDS[5].some((word) => word.latin === 'eques' && word.english === 'knight'));

  const greeting = Function(`
    ${sliceBetween(appSource, 'function getHomeGreeting', 'function renderHome')}
    return getHomeGreeting;
  `)();
  const empty = { studentName: '', progress: { points: 0, lessons: {}, wordsMastered: {} } };
  assert.equal(greeting(empty), 'Welcome. Let\'s begin your first Latin lesson.');
  assert.match(greeting({ ...empty, studentName: 'Ada' }), /^Welcome back, Ada/);
  assert.match(greeting({ ...empty, progress: { points: 10, lessons: {}, wordsMastered: {} } }), /^Welcome back/);

  const pictures = Function(`
    ${sliceBetween(appSource, 'function hasRealPicture', 'function supportsArrangePractice')}
    ${sliceBetween(appSource, 'function getLessonPictureQuestions', 'function getActiveQuestions')}
    return { hasRealPicture, getLessonPictureQuestions };
  `)();
  assert.equal(pictures.hasRealPicture('!'), false);
  assert.equal(pictures.hasRealPicture('W'), false);
  assert.equal(pictures.hasRealPicture(''), false);
  assert.equal(pictures.hasRealPicture('👧'), true);
  const lesson = {
    words: [
      { latin: 'puella', english: 'girl', emoji: '👧' },
      { latin: 'Acta non verba', english: 'deeds, not words', emoji: '!', isPhrase: true },
      { latin: 'pulcher', english: 'beautiful', emoji: '' }
    ]
  };
  const pictureQuestions = pictures.getLessonPictureQuestions(lesson);
  assert.deepEqual(pictureQuestions.map((word) => word.latin), ['puella']);
});
