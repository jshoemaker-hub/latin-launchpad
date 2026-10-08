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
    'annual-exam.js'
  ].forEach((fileName) => {
    const filePath = path.resolve(__dirname, '..', fileName);
    vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
  });
  return context;
}

const nle = loadNle();
const longPassages = nle.ANNUAL_EXAM_PASSAGES.filter((passage) => passage.setId);

function wordCount(latin) {
  return latin.split(/\s+/).filter(Boolean).length;
}

function lineCount(latin) {
  return latin.split('\n').filter((line) => line.trim()).length;
}

test('every exam-length passage is glossed and stays inside its form', () => {
  assert.equal(longPassages.length, 11);
  const bySet = {};
  longPassages.forEach((passage) => {
    assert.ok(passage.glossary.length >= 8, passage.id);
    passage.glossary.forEach((pair) => {
      assert.equal(pair.length, 2, passage.id);
      assert.ok(pair[0] && pair[1], passage.id);
    });
    assert.equal(passage.storyId, null, passage.id);
    assert.ok(passage.source, passage.id);
    const reading = nle.ANNUAL_EXAM_QUESTIONS.filter((question) => question.passageId === passage.id && question.category === 'reading');
    assert.ok(reading.length >= 10, `${passage.id} has ${reading.length} reading questions`);
    bySet[passage.setId] = bySet[passage.setId] || [];
    bySet[passage.setId].push(passage);
  });

  ['intro-long', 'beginning-long', 'intermediate-long', 'advanced-prose-long'].forEach((setId) => {
    assert.equal(bySet[setId].length, 1, setId);
    const count = wordCount(bySet[setId][0].latin);
    assert.ok(count >= 100 && count <= 140, `${setId} has ${count} words`);
    assert.equal(nle.ANNUAL_EXAM_QUESTIONS.filter((question) => question.passageId === bySet[setId][0].id && question.category === 'reading').length, 10);
  });

  const poetry = bySet['advanced-poetry-long'][0];
  const poetryLines = lineCount(poetry.latin);
  assert.ok(poetryLines >= 12 && poetryLines <= 14, `poetry has ${poetryLines} lines`);

  ['brc-long', 'irc-long', 'arc-long'].forEach((setId) => {
    assert.equal(bySet[setId].length, 2, setId);
    bySet[setId].forEach((passage) => {
      const count = wordCount(passage.latin);
      assert.ok(count >= 110 && count <= 140, `${passage.id} has ${count} words`);
    });
    const ids = new Set(bySet[setId].map((passage) => passage.id));
    const reading = nle.ANNUAL_EXAM_QUESTIONS.filter((question) => ids.has(question.passageId) && question.category === 'reading');
    const extension = nle.ANNUAL_EXAM_QUESTIONS.filter((question) => ids.has(question.passageId) && question.section === 'extension');
    assert.equal(reading.length, 33, setId);
    assert.equal(extension.length, 3, setId);
  });
});

test('a full exam can select the long form without mixing passages', () => {
  const seen = {};
  for (let seed = 1; seed <= 40; seed += 1) {
    ['intro', 'beginning', 'intermediate', 'advanced-prose', 'advanced-poetry', 'beginning-reading', 'intermediate-reading', 'advanced-reading'].forEach((levelId) => {
      const exam = nle.buildAnnualExam(levelId, nle.createAnnualExamRng(seed));
      assert.equal(exam.complete, true, `${levelId} seed ${seed}`);
      const reading = exam.questions.filter((question) => question.section === 'reading');
      const ids = [...new Set(reading.map((question) => question.passageId))];
      ids.forEach((id) => {
        const passage = nle.ANNUAL_EXAM_PASSAGES.find((item) => item.id === id);
        if (passage.setId) seen[passage.setId] = true;
      });
      const setIds = new Set(ids.map((id) => nle.ANNUAL_EXAM_PASSAGES.find((item) => item.id === id).setId || 'legacy'));
      assert.equal(setIds.size, 1, `${levelId} seed ${seed} mixed forms`);
    });
  }
  ['intro-long', 'beginning-long', 'intermediate-long', 'advanced-prose-long', 'advanced-poetry-long', 'brc-long', 'irc-long', 'arc-long'].forEach((setId) => {
    assert.equal(seen[setId], true, setId);
  });
});

test('the long-passage file does not name the exam', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'annual-exam-passages-long.js'), 'utf8');
  assert.equal(/\bNLE\b/i.test(source), false);
  assert.equal(/national latin exam/i.test(source), false);
  assert.equal(/nle\.org/i.test(source), false);
  assert.match(fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8'), /annualExamPassagePrintHtml/);
});
