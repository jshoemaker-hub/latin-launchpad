const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'app.js');
const htmlPath = path.join(root, 'index.html');
const cssPath = path.join(root, 'styles.css');
const wordBanksPath = path.join(root, 'word-banks.js');
const referenceIndexPath = path.join(root, 'reference-vocabulary.js');
const phrasesPath = path.join(root, 'latin-phrases.js');
const culturePath = path.join(root, 'latin-culture.js');
const classroomPath = path.join(root, 'classroom-latin.js');
const grammarPath = path.join(root, 'grammar-lessons.js');
const trustPageFiles = [
  'about.html',
  'privacy.html',
  'terms.html',
  'contact.html',
  'parents-teachers.html',
  'school-privacy.html'
];

const app = fs.readFileSync(appPath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkJavaScriptSyntax() {
  [appPath, wordBanksPath, referenceIndexPath, phrasesPath, culturePath, classroomPath, grammarPath].forEach((filePath) => {
    new vm.Script(fs.readFileSync(filePath, 'utf8'), { filename: filePath });
  });
}

function loadContentData() {
  const context = {};
  vm.createContext(context);
  [wordBanksPath, referenceIndexPath, phrasesPath, culturePath, classroomPath, grammarPath].forEach((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    vm.runInContext(source, context, { filename: filePath });
  });
  vm.runInContext(
    'globalThis.__CONTENT = { GRADE_WORDS, REFERENCE_VOCABULARY_BY_GRADE, REFERENCE_INDEX_WORDS, NEW_REFERENCE_GLOSSARY_WORDS, LATIN_PHRASES, LATIN_CULTURE_CARDS, CLASSROOM_LATIN_PHRASES, GRAMMAR_LESSONS };',
    context
  );
  return context.__CONTENT;
}

function assertUniqueIds(items, label) {
  const ids = items.map((item) => item.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert(duplicates.length === 0, `Duplicate ${label} ids: ${[...new Set(duplicates)].join(', ')}`);
  assert(items.every((item) => item.id && typeof item.id === 'string'), `${label} entries need string ids`);
}

function checkContentData() {
  const {
    GRADE_WORDS,
    REFERENCE_VOCABULARY_BY_GRADE,
    REFERENCE_INDEX_WORDS,
    NEW_REFERENCE_GLOSSARY_WORDS,
    LATIN_PHRASES,
    LATIN_CULTURE_CARDS,
    CLASSROOM_LATIN_PHRASES,
    GRAMMAR_LESSONS
  } = loadContentData();
  assertUniqueIds(LATIN_PHRASES, 'phrase');
  assertUniqueIds(LATIN_CULTURE_CARDS, 'culture card');
  assertUniqueIds(CLASSROOM_LATIN_PHRASES, 'classroom phrase');
  assertUniqueIds(GRAMMAR_LESSONS, 'grammar lesson');

  assert(LATIN_PHRASES.length === 91, `Expected 91 phrases, found ${LATIN_PHRASES.length}`);
  assert(LATIN_CULTURE_CARDS.length === 32, `Expected 32 culture cards, found ${LATIN_CULTURE_CARDS.length}`);
  assert(CLASSROOM_LATIN_PHRASES.length === 40, `Expected 40 classroom phrases, found ${CLASSROOM_LATIN_PHRASES.length}`);
  assert(GRAMMAR_LESSONS.length === 23, `Expected 23 grammar lessons, found ${GRAMMAR_LESSONS.length}`);

  const referenceWords = Object.values(REFERENCE_VOCABULARY_BY_GRADE).flat();
  assert(referenceWords.length === 76, `Expected 76 reference vocabulary entries, found ${referenceWords.length}`);
  const normalizeTerm = (value) => value.toLowerCase().replace(/[^a-z]/g, '');
  const referenceHeadwords = referenceWords.map((word) => normalizeTerm(word.latin));
  assert(
    new Set(referenceHeadwords).size === referenceHeadwords.length,
    'Reference vocabulary contains duplicate headwords'
  );
  assert(REFERENCE_INDEX_WORDS.length === 392, `Expected 392 index entries, found ${REFERENCE_INDEX_WORDS.length}`);
  const indexHeadwords = REFERENCE_INDEX_WORDS.map(([latin]) => normalizeTerm(latin));
  assert(new Set(indexHeadwords).size === indexHeadwords.length, 'Reference index contains duplicate headwords');
  assert(NEW_REFERENCE_GLOSSARY_WORDS.length === 144, `Expected 144 new glossary entries, found ${NEW_REFERENCE_GLOSSARY_WORDS.length}`);
  const newGlossaryHeadwords = NEW_REFERENCE_GLOSSARY_WORDS.map(([latin]) => normalizeTerm(latin));
  assert(new Set(newGlossaryHeadwords).size === newGlossaryHeadwords.length, 'New glossary contains duplicate headwords');
  NEW_REFERENCE_GLOSSARY_WORDS.forEach(([latin, english, grade, , sourceImage]) => {
    assert(latin && english, 'New glossary entries need Latin and English text');
    assert(grade >= 3 && grade <= 8, `Invalid new glossary grade: ${latin}`);
    assert(/^IMG_253[1-8]\.jpeg$/.test(sourceImage), `Invalid new glossary source image: ${latin}`);
  });

  const vocabulary = new Set(
    Object.values(GRADE_WORDS).flat().map((word) => normalizeTerm(word.latin))
  );
  referenceHeadwords.forEach((headword) => {
    const occurrences = Object.values(GRADE_WORDS).flat()
      .filter((word) => normalizeTerm(word.latin) === headword).length;
    assert(occurrences === 1, `Reference headword should appear once: ${headword}`);
  });
  indexHeadwords.forEach((headword) => {
    assert(vocabulary.has(headword), `Reference index headword is missing from lessons: ${headword}`);
  });
  newGlossaryHeadwords.forEach((headword) => {
    assert(vocabulary.has(headword), `New glossary headword is missing from lessons: ${headword}`);
  });

  const normalizedPhrases = LATIN_PHRASES.map((phrase) => normalizeTerm(phrase.latin));
  assert(new Set(normalizedPhrases).size === normalizedPhrases.length, 'Duplicate Latin phrase text');
  LATIN_PHRASES.forEach((phrase) => {
    assert(phrase.latin && phrase.meaning && phrase.note, `Incomplete phrase: ${phrase.id}`);
    assert(Array.isArray(phrase.linkedWords) && phrase.linkedWords.length > 0, `Phrase has no links: ${phrase.id}`);
    assert(
      phrase.linkedWords.some((word) => vocabulary.has(word.toLowerCase().replace(/[^a-z]/g, ''))),
      `Phrase cannot match a lesson: ${phrase.id}`
    );
  });

  LATIN_CULTURE_CARDS.forEach((card) => {
    assert(card.minGrade >= 3 && (card.maxGrade || 8) <= 8, `Invalid culture grade range: ${card.id}`);
    assert(card.sourceImages.length > 0, `Culture card needs a source image: ${card.id}`);
    card.sourceImages.forEach((image) => {
      assert(/^IMG_\d+\.jpeg$/.test(image), `Invalid culture source image reference: ${image}`);
    });
  });

  CLASSROOM_LATIN_PHRASES.forEach((phrase) => {
    assert(phrase.minGrade >= 3 && (phrase.maxGrade || 8) <= 8, `Invalid classroom grade range: ${phrase.id}`);
    assert(phrase.latin && phrase.english && phrase.category, `Incomplete classroom phrase: ${phrase.id}`);
  });
}

function checkElementIds() {
  const ids = [...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
  const idSet = new Set(ids);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert(duplicates.length === 0, `Duplicate ids: ${[...new Set(duplicates)].join(', ')}`);

  const dynamicIds = new Set(['optionsGrid', 'onlinePuzzleStage', 'crosswordStatus']);
  const lookups = [...app.matchAll(/document\.getElementById\('([^']+)'\)/g)].map((match) => match[1]);
  const missing = [...new Set(lookups.filter((id) => !idSet.has(id) && !dynamicIds.has(id)))];
  assert(missing.length === 0, `Missing static ids: ${missing.join(', ')}`);
}

function checkCssBraces() {
  let depth = 0;
  let minDepth = 0;
  for (const char of css) {
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    minDepth = Math.min(minDepth, depth);
  }
  assert(depth === 0 && minDepth === 0, `CSS brace mismatch: depth=${depth}, minDepth=${minDepth}`);
}

function checkLessonLoopHooks() {
  [
    'data-speak-latin',
    'data-speak-rate',
    'data-practice-mode',
    'data-lesson-action',
    'reviewWeakWordsButton',
    'weakWordsList',
    'wordStats',
    'getActiveQuestions',
    'startMissedWordReview',
    'startWeakWordReview'
  ].forEach((needle) => {
    assert(app.includes(needle) || html.includes(needle), `Expected hook not found: ${needle}`);
  });
}

function checkGrammarStoryResources() {
  assert(
    app.includes('const GRAMMAR_LESSONS_WITH_STORIES'),
    'Grammar lessons must be enriched with story resources'
  );
  assert(
    app.includes('getStorySceneForLesson(lesson.grade, storyIndex)'),
    'Grammar lessons must receive grade-appropriate illustrated stories'
  );
  assert(
    app.includes('...GRAMMAR_LESSONS_WITH_STORIES'),
    'The lesson catalog must use the story-enriched grammar lessons'
  );
}

function checkVocabularyStudyHooks() {
  [
    'studyPage',
    'headerGradeSelect',
    'vocabularySearch',
    'data-study-mode="flashcards"',
    'data-flashcard-duration="300"',
    'data-flashcard-duration="600"',
    'data-flashcard-duration="900"',
    'flashcardStart',
    'function tickFlashcards()',
    "name || 'Learner'"
  ].forEach((needle) => {
    assert(app.includes(needle) || html.includes(needle), `Expected vocabulary study hook not found: ${needle}`);
  });
}

function checkDictionaryHooks() {
  [
    'dictionaryPage',
    'dictionaryButton',
    'dictionarySearch',
    'dictionaryGradeFilter',
    'function getDictionaryWords()',
    'function renderDictionary()'
  ].forEach((needle) => {
    assert(app.includes(needle) || html.includes(needle), `Expected dictionary hook not found: ${needle}`);
  });
}

function checkTrustPages() {
  trustPageFiles.forEach((fileName) => {
    const filePath = path.join(root, fileName);
    assert(fs.existsSync(filePath), `Missing trust page: ${fileName}`);
    const pageHtml = fs.readFileSync(filePath, 'utf8');
    assert(pageHtml.includes('href="index.html"'), `${fileName} needs a return link`);
    trustPageFiles.forEach((linkedFile) => {
      assert(pageHtml.includes(`href="${linkedFile}"`), `${fileName} does not link to ${linkedFile}`);
    });
  });

  trustPageFiles.forEach((fileName) => {
    assert(html.includes(`href="${fileName}"`), `Main footer does not link to ${fileName}`);
  });
  assert(fs.existsSync(path.join(root, 'og-image.png')), 'Missing Open Graph image');
  [
    'signupEligibility',
    'accountCreatorRole',
    'accountEligibilityConfirmation'
  ].forEach((needle) => {
    assert(app.includes(needle) || html.includes(needle), `Missing child privacy control: ${needle}`);
  });
  assert(
    fs.readFileSync(path.join(root, 'parents-teachers.html'), 'utf8').includes('privacy.html#children'),
    'Parent guidance must link directly to the child privacy notice'
  );
}

checkJavaScriptSyntax();
checkContentData();
checkElementIds();
checkCssBraces();
checkLessonLoopHooks();
checkGrammarStoryResources();
checkVocabularyStudyHooks();
checkDictionaryHooks();
checkTrustPages();

console.log('Smoke tests passed.');
