const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

function loadNle() {
  const context = {};
  vm.createContext(context);
  [
    'annual-exam-questions.js',
    'annual-exam-questions-more.js',
    'annual-exam-questions-upper.js',
    'annual-exam-questions-exams.js',
    'annual-exam-questions-advanced.js',
    'annual-exam-passages-long.js',
    'annual-exam-language.js',
    'annual-exam-culture.js',
    'annual-exam-values.js',
    'annual-exam.js'
  ].forEach((fileName) => {
    const filePath = path.resolve(__dirname, '..', fileName);
    vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
  });
  return context;
}

const nle = loadNle();

test('the practice bank is original and timed like a full exam', () => {
  assert.match(nle.ANNUAL_EXAM_NOTE, /Original practice questions/i);
  assert.equal(nle.ANNUAL_EXAM_LINKS, undefined);
  assert.equal(nle.ANNUAL_EXAM_TIME_LIMIT_SECONDS, 45 * 60);
  assert.equal(nle.ANNUAL_EXAM_LEVELS.map((level) => level.name).join('|'), [
    'Introduction',
    'Beginning',
    'Beginning Reading',
    'Intermediate',
    'Intermediate Reading',
    'Advanced Prose',
    'Advanced Poetry',
    'Advanced Reading'
  ].join('|'));
});

test('previous progress and badges carry over onto the new keys', () => {
  const legacyKey = ['n', 'le'].join('');
  const stored = {
    [legacyKey]: {
      levels: {
        intro: {
          categoryStats: { grammar: { attempts: 2, correct: 1, sessions: 1 } },
          exams: [{
            id: 'kept-exam',
            completedAt: '2026-03-01T00:00:00.000Z',
            mode: 'exam',
            levelId: 'intro',
            correct: 3,
            total: 4,
            percent: 75,
            missed: []
          }]
        }
      }
    }
  };
  const progress = nle.normalizeAnnualExamProgress(nle.migrateAnnualExamProgress(stored));
  assert.equal(progress.levels.intro.exams[0].id, 'kept-exam');
  assert.equal(progress.levels.intro.exams[0].correct, 3);
  assert.equal(progress.levels.intro.categoryStats.grammar.attempts, 2);
  const badges = nle.migrateAnnualExamBadges({ [`${legacyKey}-practice`]: '2020-01-01T00:00:00.000Z' });
  assert.equal(badges['annual-exam-practice'], '2020-01-01T00:00:00.000Z');
  assert.equal(badges[`${legacyKey}-practice`], '2020-01-01T00:00:00.000Z');
  const current = nle.migrateAnnualExamProgress({ annualExam: progress });
  assert.equal(current.levels.intro.exams[0].id, 'kept-exam');
});

test('eight Annual Exam Study levels map onto the site years', () => {
  assert.equal(nle.ANNUAL_EXAM_LEVELS.map((level) => level.id).join(','), [
    'intro',
    'beginning',
    'beginning-reading',
    'intermediate',
    'intermediate-reading',
    'advanced-prose',
    'advanced-poetry',
    'advanced-reading'
  ].join(','));
  assert.equal(nle.getAnnualExamLevel('intro').questionCount, 40);
  assert.equal(nle.getAnnualExamLevel('beginning-reading').questionCount, 36);
  assert.equal(nle.getAnnualExamLevel('advanced-reading').questionCount, 36);
  assert.equal(nle.getAnnualExamLevel('intro').sections.map((section) => section.count).join(','), '12,18,10');
  assert.equal(nle.getSuggestedAnnualExamLevelId(1), null);
  assert.equal(nle.getSuggestedAnnualExamLevelId(4, 6), 'intro');
  assert.equal(nle.getSuggestedAnnualExamLevelId(4, 7), 'beginning');
  assert.equal(nle.getSuggestedAnnualExamLevelId(4, 8), 'intermediate');
  assert.equal(nle.getSuggestedAnnualExamLevelId(4), 'intro');
  assert.equal(nle.getAnnualExamLevel('intro').track, 'year4');
  assert.equal(nle.getAnnualExamLevel('intermediate-reading').track, 'advanced');
  assert.equal(nle.getAnnualExamLevel('advanced-prose').track, 'advanced');
  assert.doesNotMatch(nle.getAnnualExamLevel('intro').yearNote, /Form/);
  assert.doesNotMatch(nle.getAnnualExamLevel('advanced-prose').yearNote, /Form/);
  assert.match(nle.getAnnualExamLevel('beginning').legacyName, /Latin I/);
});

test('question content is complete and internally consistent', () => {
  assert.equal(nle.validateAnnualExamContent().length, 0);
  const summary = nle.summarizeAnnualExamBank();
  assert.ok(summary.intro.total >= 80);
  assert.ok(summary.beginning.total >= 70);
  assert.ok(summary.intermediate.total >= 40);
  assert.equal(summary.intro.passages, 4);
  assert.equal(summary.beginning.passages, 3);
  assert.equal(summary['beginning-reading'].passages, 4);
  assert.equal(summary.intermediate.passages, 3);
  assert.equal(summary['intermediate-reading'].passages, 4);
  assert.equal(summary['advanced-prose'].passages, 2);
  assert.equal(summary['advanced-poetry'].passages, 2);
  assert.equal(summary['advanced-reading'].passages, 4);
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
    const exam = nle.buildAnnualExam(levelId, nle.createAnnualExamRng(4));
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
    const exam = nle.buildAnnualExam(levelId, nle.createAnnualExamRng(5));
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
    const exam = nle.buildAnnualExam(levelId, nle.createAnnualExamRng(5));
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
  const advancedReading = nle.ANNUAL_EXAM_PASSAGES.filter((passage) => passage.level === 'advanced-reading').map((passage) => passage.latin).join('\n');
  assert.match(advancedReading, /ilicis/);
  assert.match(advancedReading, /Nuntius/);
});

test('an Introduction exam continues one story into one passage', () => {
  const stories = new Set();
  for (let seed = 1; seed <= 48; seed += 1) {
    const exam = nle.buildAnnualExam('intro', nle.createAnnualExamRng(seed));
    stories.add(exam.storyId);
    if (exam.passage.setId) assert.equal(exam.passage.storyId, null);
    else assert.equal(exam.passage.storyId, exam.storyId);
    const reading = exam.questions.filter((question) => question.section === 'reading');
    assert.equal(new Set(reading.map((question) => question.passageId)).size, 1);
    const orders = reading.map((question) => question.order);
    assert.deepEqual(orders, orders.slice().sort((left, right) => left - right));
  }
  assert.equal(stories.size, 4);
  assert.ok(stories.has('intro-stilus'));
});

test('category practice stays on the requested level and topic', () => {
  const questions = nle.buildAnnualExamPracticeSet('beginning', 'mottoes', 5, nle.createAnnualExamRng(9));
  assert.equal(questions.length, 5);
  questions.forEach((question) => {
    assert.equal(question.level, 'beginning');
    assert.equal(question.category, 'mottoes');
  });
  const reading = nle.buildAnnualExamPracticeSet('intro', 'reading', 10, nle.createAnnualExamRng(3));
  assert.equal(reading.length, 10);
  assert.equal(new Set(reading.map((question) => question.passageId)).size, 1);
});

test('scoring reports a category breakdown and the missed items', () => {
  const exam = nle.buildAnnualExam('intro', nle.createAnnualExamRng(6));
  const answers = {};
  exam.questions.forEach((question, index) => {
    answers[question.id] = index % 2 === 0 ? question.answer : question.choices.find((choice) => choice !== question.answer);
  });
  const score = nle.scoreAnnualExam(exam.questions, answers);
  assert.equal(score.total, 40);
  assert.equal(score.correct, 20);
  assert.equal(score.missed.length, 20);
  assert.equal(score.categories.reading.total, 10);
  assert.ok(score.missed.every((item) => item.selected !== item.answer));
});

test('saved exam progress drops unknown levels and keeps recent exams', () => {
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
  const progress = nle.normalizeAnnualExamProgress({
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

test('language banks can fill two full forms, including the new formats', () => {
  const language = ['grammar', 'vocabulary', 'derivatives', 'mottoes', 'oral'];
  const count = (levelId) => nle.ANNUAL_EXAM_QUESTIONS.filter((question) => (
    question.level === levelId && language.includes(question.category) && !question.passageId && !question.storyId
  )).length;
  assert.ok(count('beginning') >= 70, `beginning ${count('beginning')}`);
  assert.ok(count('intermediate') >= 60, `intermediate ${count('intermediate')}`);
  assert.ok(count('advanced-prose') >= 54, `prose ${count('advanced-prose')}`);
  assert.ok(count('advanced-poetry') >= 54, `poetry ${count('advanced-poetry')}`);
  const poetryGrammar = nle.ANNUAL_EXAM_QUESTIONS.filter((question) => question.level === 'advanced-poetry' && question.category === 'grammar');
  assert.ok(poetryGrammar.length >= 40);
  assert.ok(poetryGrammar.some((question) => /purpose|ablative absolute|subjunctive/i.test(`${question.prompt} ${question.explanation}`)));
  const introStory = nle.ANNUAL_EXAM_QUESTIONS.filter((question) => question.storyId === 'intro-stilus');
  assert.equal(introStory.length, 18);
  const prompts = nle.ANNUAL_EXAM_QUESTIONS.filter((question) => question.id.startsWith('lang-')).map((question) => question.prompt).join('\n');
  assert.match(prompts, /Which Latin/);
  assert.match(prompts, /Which form fits/);
  assert.match(prompts, /Same word/);
});

test('spot-checks Latin meanings used by the question bank', () => {
  const byId = Object.fromEntries(nle.ANNUAL_EXAM_QUESTIONS.map((question) => [question.id, question]));
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
