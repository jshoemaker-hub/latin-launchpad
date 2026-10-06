const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

function sliceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0 && end > start, `Missing slice ${startMarker} -> ${endMarker}`);
  return source.slice(start, end);
}

function loadPracticeTools() {
  const source = [
    sliceBetween(appSource, 'const ENDING_HINTS', 'const STORAGE_KEY'),
    sliceBetween(appSource, 'function hintHeadwordKey', 'function renderEndingHint'),
    sliceBetween(appSource, 'function foldLatinAnswer', 'function createMeaningOptionButton')
  ].join('\n');
  return Function(`${source}
    return {
      buildChant,
      getSurfaceEnding,
      matchesTargetLatin,
      matchesEnding,
      matchesChant,
      recallLetterCue
    };
  `)();
}

test('English-to-Latin matching ignores macrons and accepts i/j and u/v alternates', () => {
  const { matchesTargetLatin } = loadPracticeTools();
  const puella = { latin: 'puella', english: 'girl' };
  assert.equal(matchesTargetLatin('puella', puella), true);
  assert.equal(matchesTargetLatin('puellā', puella), true);
  assert.equal(matchesTargetLatin('PUELLA', puella), true);
  assert.equal(matchesTargetLatin('seruus', { latin: 'servus', english: 'servant' }), true);
  assert.equal(matchesTargetLatin('jam', { latin: 'iam', english: 'now' }), true);
  assert.equal(matchesTargetLatin('capio', {
    latin: 'capio',
    english: 'take',
    principalParts: 'capio, capere, cepi, captus'
  }), true);
  assert.equal(matchesTargetLatin('captus', {
    latin: 'capio',
    english: 'take',
    principalParts: 'capio, capere, cepi, captus'
  }), false);
});

test('a shared English gloss does not make a different Latin word correct', () => {
  const { matchesTargetLatin, recallLetterCue } = loadPracticeTools();
  const puella = { latin: 'puella', english: 'girl' };
  const filia = { latin: 'filia', english: 'girl' };
  assert.equal(matchesTargetLatin('filia', puella), false);
  assert.equal(matchesTargetLatin('puella', filia), false);
  assert.equal(matchesTargetLatin('way', { latin: 'via', english: 'road / way' }), false);
  assert.equal(matchesTargetLatin('via', { latin: 'via', english: 'road / way' }), true);
  const cue = recallLetterCue(puella, [puella, filia]);
  assert.equal(cue, '6 letters');
  assert.equal(recallLetterCue({ latin: 'aqua', english: 'water' }, [
    { latin: 'aqua', english: 'water' },
    { latin: 'terra', english: 'earth' }
  ]), '');
});

test('ending drills blank the dictionary ending and chants stay on regular patterns', () => {
  const { getSurfaceEnding, matchesEnding, buildChant, matchesChant } = loadPracticeTools();
  assert.deepEqual(getSurfaceEnding('puella'), { stem: 'puell', ending: 'a' });
  assert.equal(matchesEnding('a', { latin: 'puella' }), true);
  assert.equal(matchesEnding('puella', { latin: 'puella' }), true);
  assert.equal(matchesEnding('ae', { latin: 'puella' }), false);
  assert.deepEqual(getSurfaceEnding('servus'), { stem: 'serv', ending: 'us' });

  const puella = buildChant({ latin: 'puella', english: 'girl' });
  assert.deepEqual(puella.forms, ['puella', 'puellae', 'puellae', 'puellam', 'puella']);
  assert.equal(matchesChant('puella, puellae, puellae, puellam, puellā', puella.forms), true);
  assert.deepEqual(buildChant({ latin: 'servus' }).forms, ['servus', 'servi', 'servo', 'servum', 'servo']);
  assert.deepEqual(buildChant({ latin: 'bellum' }).forms, ['bellum', 'belli', 'bello', 'bellum', 'bello']);
  assert.deepEqual(buildChant({ latin: 'puer' }).forms, ['puer', 'pueri', 'puero', 'puerum', 'puero']);
  assert.deepEqual(buildChant({ latin: 'ager' }).forms, ['ager', 'agri', 'agro', 'agrum', 'agro']);
  assert.deepEqual(buildChant({ latin: 'amo' }).forms, ['amo', 'amas', 'amat', 'amamus', 'amatis', 'amant']);
  assert.deepEqual(buildChant({ latin: 'video' }).forms, ['video', 'vides', 'videt', 'videmus', 'videtis', 'vident']);
  assert.deepEqual(buildChant({ latin: 'audio' }).forms, ['audio', 'audis', 'audit', 'audimus', 'auditis', 'audiunt']);
  assert.equal(buildChant({ latin: 'curro', english: 'run' }), null);
  assert.equal(buildChant({ latin: 'capio', principalParts: 'capio, capere, cepi, captus' }), null);
  assert.equal(buildChant({ latin: 'circum', english: 'around' }), null);
  assert.equal(buildChant({ latin: 'pater', english: 'father' }), null);
  assert.equal(buildChant({ latin: 'iter', english: 'journey' }), null);
  assert.equal(buildChant({ latin: 'salve magister', isPhrase: true }), null);
});

test('saved word stats gain ratings without dropping earlier practice', () => {
  const normalizeSource = sliceBetween(appSource, 'function normalizeWordStats', 'function normalizeBadges');
  const recordSource = sliceBetween(appSource, 'function recordWordAttempt', 'function getQuestionByWordKey');
  const tools = Function(`
    const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    ${normalizeSource}
    function getWordKey(question) { return question.latin; }
    const AppState = {
      progress: {
        wordStats: {
          puella: { latin: 'puella', english: 'girl', attempts: 2, correct: 1, misses: 1, rating: 'hesitant', nextReviewAt: '2026-10-08T00:00:00.000Z' },
          aqua: { latin: 'aqua', english: 'water', attempts: 4, correct: 4, misses: 0 }
        }
      }
    };
    ${recordSource}
    return { normalizeWordStats, recordWordAttempt, AppState };
  `)();

  const stored = tools.normalizeWordStats(tools.AppState.progress.wordStats);
  assert.equal(stored.aqua.attempts, 4);
  assert.equal(stored.aqua.rating, '');
  assert.equal(stored.aqua.nextReviewAt, '');
  assert.equal(stored.puella.rating, 'hesitant');
  assert.equal(stored.puella.nextReviewAt, '2026-10-08T00:00:00.000Z');
  tools.recordWordAttempt({ latin: 'puella', english: 'girl' }, false);
  assert.equal(tools.AppState.progress.wordStats.puella.rating, 'hesitant');
  assert.equal(tools.AppState.progress.wordStats.puella.nextReviewAt, '2026-10-08T00:00:00.000Z');
  assert.equal(tools.AppState.progress.wordStats.puella.attempts, 3);
  assert.equal(tools.AppState.progress.wordStats.puella.misses, 2);
});

test('practice order is shuffled once per start and then kept', () => {
  const source = sliceBetween(appSource, 'function getBaseQuestions', 'function getWordKey');
  const lesson = { id: 'grade3-1', words: [{ latin: 'puella' }, { latin: 'servus' }, { latin: 'aqua' }] };
  const tools = Function(`
    function isReviewAttempt() { return false; }
    function supportsPicturePractice() { return false; }
    function supportsArrangePractice() { return false; }
    function getLessonPictureQuestions() { return []; }
    function getArrangeQuestions() { return []; }
    function getEndingQuestions(current) { return current.words; }
    function getChantQuestions(current) { return current.words; }
    function shuffleItems(items) { return items.slice().reverse(); }
    const AppState = { practiceMode: 'meaning', practiceOrder: null, practiceOrderKey: '', reviewQueue: [] };
    ${source}
    return { AppState, getActiveQuestions, rememberPracticeOrder };
  `)();

  assert.deepEqual(tools.getActiveQuestions(lesson).map((word) => word.latin), ['puella', 'servus', 'aqua']);
  tools.rememberPracticeOrder(lesson);
  assert.deepEqual(tools.getActiveQuestions(lesson).map((word) => word.latin), ['aqua', 'servus', 'puella']);
  assert.deepEqual(tools.getActiveQuestions(lesson).map((word) => word.latin), ['aqua', 'servus', 'puella']);
});
