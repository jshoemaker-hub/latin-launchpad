const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

function loadNle() {
  const context = {};
  vm.createContext(context);
  [
    'nle-questions.js',
    'nle-questions-more.js',
    'nle-questions-upper.js',
    'nle-questions-exams.js',
    'nle-questions-advanced.js',
    'nle-prep.js'
  ].forEach((fileName) => {
    const filePath = path.resolve(__dirname, '..', fileName);
    vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
  });
  return context;
}

const nle = loadNle();

test('the practice bank is original, unofficial, and points to nle.org', () => {
  assert.match(nle.NLE_DISCLAIMER, /not affiliated/i);
  assert.match(nle.NLE_DISCLAIMER, /not past NLE questions/i);
  assert.equal(nle.NLE_LINKS.home, 'https://www.nle.org/');
  assert.equal(nle.NLE_LINKS.exams, 'https://www.nle.org/previous-exams-and-answer-keys');
  assert.equal(nle.NLE_TIME_LIMIT_SECONDS, 45 * 60);
});

test('eight current NLE levels map onto the site years', () => {
  assert.equal(nle.NLE_LEVELS.map((level) => level.id).join(','), [
    'intro',
    'beginning',
    'beginning-reading',
    'intermediate',
    'intermediate-reading',
    'advanced-prose',
    'advanced-poetry',
    'advanced-reading'
  ].join(','));
  assert.equal(nle.getNleLevel('intro').questionCount, 40);
  assert.equal(nle.getNleLevel('beginning-reading').questionCount, 36);
  assert.equal(nle.getNleLevel('advanced-reading').questionCount, 36);
  assert.equal(nle.getNleLevel('intro').sections.map((section) => section.count).join(','), '12,18,10');
  assert.equal(nle.getSuggestedNleLevelId(1), 'intro');
  assert.equal(nle.getSuggestedNleLevelId(2), 'beginning');
  assert.equal(nle.getSuggestedNleLevelId(3), 'intermediate');
  assert.equal(nle.getSuggestedNleLevelId(4), 'advanced-prose');
  assert.match(nle.getNleLevel('beginning').legacyName, /Latin I/);
});

test('question content is complete and internally consistent', () => {
  assert.equal(nle.validateNleContent().length, 0);
  const summary = nle.summarizeNleBank();
  assert.ok(summary.intro.total >= 80);
  assert.ok(summary.beginning.total >= 70);
  assert.ok(summary.intermediate.total >= 40);
  assert.equal(summary.intro.passages, 3);
  assert.equal(summary.beginning.passages, 2);
  assert.equal(summary['beginning-reading'].passages, 2);
  assert.equal(summary.intermediate.passages, 2);
  assert.equal(summary['intermediate-reading'].passages, 2);
  assert.equal(summary['advanced-prose'].passages, 1);
  assert.equal(summary['advanced-poetry'].passages, 1);
  assert.equal(summary['advanced-reading'].passages, 2);
  assert.ok(summary['advanced-prose'].total >= 40);
  assert.ok(summary['advanced-poetry'].total >= 40);
  ['grammar', 'vocabulary', 'derivatives', 'mottoes', 'oral', 'mythology', 'history', 'geography', 'culture', 'reading'].forEach((category) => {
    assert.ok(summary['advanced-prose'].byCategory[category] > 0, `advanced prose ${category}`);
    assert.ok(summary['advanced-poetry'].byCategory[category] > 0, `advanced poetry ${category}`);
  });
  ['grammar', 'vocabulary', 'derivatives', 'mottoes', 'oral', 'mythology', 'history', 'geography', 'culture', 'reading'].forEach((category) => {
    assert.ok(summary.intro.byCategory[category] > 0, `intro ${category}`);
    assert.ok(summary.beginning.byCategory[category] > 0, `beginning ${category}`);
  });
});

test('full practice exams match the published lengths', () => {
  ['intro', 'beginning', 'intermediate'].forEach((levelId) => {
    const exam = nle.buildNleExam(levelId, nle.createNleRng(4));
    assert.equal(exam.complete, true);
    assert.equal(exam.questions.length, 40);
    assert.equal(exam.timeLimitSeconds, 45 * 60);
    const sections = exam.questions.reduce((counts, question) => {
      counts[question.section] = (counts[question.section] || 0) + 1;
      return counts;
    }, {});
    assert.equal(sections.culture, 12);
    assert.equal(sections.language, 18);
    assert.equal(sections.reading, 10);
    exam.questions.forEach((question) => {
      assert.equal(question.choices.length, 4);
      assert.ok(question.choices.includes(question.answer));
    });
  });
  ['beginning-reading', 'intermediate-reading', 'advanced-reading'].forEach((levelId) => {
    const exam = nle.buildNleExam(levelId, nle.createNleRng(5));
    assert.equal(exam.complete, true, levelId);
    assert.equal(exam.questions.length, 36);
    const sections = exam.questions.reduce((counts, question) => {
      counts[question.section] = (counts[question.section] || 0) + 1;
      return counts;
    }, {});
    assert.equal(sections.reading, 33);
    assert.equal(sections.extension, 3);
    const passageIds = exam.questions.filter((question) => question.section === 'reading').map((question) => question.passageId);
    assert.equal(new Set(passageIds).size, 2);
  });
  ['advanced-prose', 'advanced-poetry'].forEach((levelId) => {
    const exam = nle.buildNleExam(levelId, nle.createNleRng(5));
    assert.equal(exam.complete, true, levelId);
    assert.equal(exam.questions.length, 40);
    const sections = exam.questions.reduce((counts, question) => {
      counts[question.section] = (counts[question.section] || 0) + 1;
      return counts;
    }, {});
    assert.equal(sections.culture, 12);
    assert.equal(sections.language, 18);
    assert.equal(sections.reading, 10);
  });
  const advancedReading = nle.NLE_PASSAGES.filter((passage) => passage.level === 'advanced-reading').map((passage) => passage.latin).join('\n');
  assert.match(advancedReading, /ilicis/);
  assert.match(advancedReading, /Nuntius/);
});

test('an Introduction exam continues one story into one passage', () => {
  const stories = new Set();
  for (let seed = 1; seed <= 48; seed += 1) {
    const exam = nle.buildNleExam('intro', nle.createNleRng(seed));
    stories.add(exam.storyId);
    assert.equal(exam.passage.storyId, exam.storyId);
    const reading = exam.questions.filter((question) => question.section === 'reading');
    assert.equal(new Set(reading.map((question) => question.passageId)).size, 1);
    const orders = reading.map((question) => question.order);
    assert.deepEqual(orders, orders.slice().sort((left, right) => left - right));
  }
  assert.equal(stories.size, 3);
});

test('category practice stays on the requested level and topic', () => {
  const questions = nle.buildNlePracticeSet('beginning', 'mottoes', 5, nle.createNleRng(9));
  assert.equal(questions.length, 5);
  questions.forEach((question) => {
    assert.equal(question.level, 'beginning');
    assert.equal(question.category, 'mottoes');
  });
  const reading = nle.buildNlePracticeSet('intro', 'reading', 10, nle.createNleRng(3));
  assert.equal(reading.length, 10);
  assert.equal(new Set(reading.map((question) => question.passageId)).size, 1);
});

test('scoring reports a category breakdown and the missed items', () => {
  const exam = nle.buildNleExam('intro', nle.createNleRng(6));
  const answers = {};
  exam.questions.forEach((question, index) => {
    answers[question.id] = index % 2 === 0 ? question.answer : question.choices.find((choice) => choice !== question.answer);
  });
  const score = nle.scoreNleExam(exam.questions, answers);
  assert.equal(score.total, 40);
  assert.equal(score.correct, 20);
  assert.equal(score.missed.length, 20);
  assert.equal(score.categories.reading.total, 10);
  assert.ok(score.missed.every((item) => item.selected !== item.answer));
});

test('saved NLE progress drops unknown levels and keeps recent exams', () => {
  const exams = Array.from({ length: 8 }, (_, index) => ({
    id: `exam-${index}`,
    completedAt: '2026-03-01T00:00:00.000Z',
    mode: 'exam',
    levelId: 'intro',
    correct: index,
    total: 40,
    percent: index,
    secondsUsed: 60,
    categories: { grammar: { correct: 1, total: 2 } },
    missed: []
  }));
  const progress = nle.normalizeNleProgress({
    levels: {
      intro: { categoryStats: { grammar: { attempts: 4, correct: 3, sessions: 1 } }, exams },
      'not-a-level': { exams: [{ levelId: 'nope', total: 1 }] }
    }
  });
  assert.deepEqual(Object.keys(progress.levels), ['intro']);
  assert.equal(progress.levels.intro.exams.length, 6);
  assert.equal(progress.levels.intro.exams[0].id, 'exam-2');
  assert.equal(progress.levels.intro.categoryStats.grammar.correct, 3);
});

test('spot-checks Latin meanings used by the question bank', () => {
  const byId = Object.fromEntries(nle.NLE_QUESTIONS.map((question) => [question.id, question]));
  assert.equal(byId['intro-extra-mot-01'].answer, 'Seize the day.');
  assert.equal(byId['beg-mot-07'].answer, 'Senatus Populusque Romanus.');
  assert.equal(byId['intro-myth-07'].answer, 'Romulus.');
  assert.equal(byId['beg-gram-01'].answer, 'He or she carried.');
  assert.equal(byId['int-gram-01'].answer, 'He or she is praised.');
  assert.match(byId['int-mot-02'].answer, /through difficulties to the stars/i);
  assert.equal(byId['ay-gram-01'].answer, 'one long syllable and two short syllables.');
  assert.equal(byId['ay-gram-02'].answer, 'two long syllables.');
  assert.equal(byId['ap-gram-10'].answer, 'I fear that the enemy may come.');
  assert.equal(byId['ap-mot-01'].answer, 'you shall have the body.');
  assert.equal(byId['ar-poet-12'].answer, 'a dactyl.');
});
