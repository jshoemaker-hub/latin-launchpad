const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');
const { analyze, parseHexameter } = require('./hexameter');

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

function stripMacrons(line) {
  return line
    .replace(/ā/g, 'a')
    .replace(/ē/g, 'e')
    .replace(/ī/g, 'i')
    .replace(/ō/g, 'o')
    .replace(/ū/g, 'u');
}

const markedPassages = {
  'advanced-reading-silva': [
    'Fīlia per silvās currēbat ad īlicis umbram.',
    'Fīlia per silvās mātrem vocat anxia vōce.',
    'Tum māter nātam per opāca silentia dūcit.'
  ],
  'advanced-poetry-moon': [
    'Candida per silvās lūnae lux vēnit ad umbrās.',
    'Stābat et in silvīs, mīrāns per opāca, puellus.'
  ]
};

test('original hexameter passages scan and match the printed text', () => {
  const nle = loadNle();
  const control = parseHexameter(analyze('Tītyre tū patulae recubāns sub tegmine fāgī'));
  assert.deepEqual(control.feet, ['LSS', 'LSS', 'LSS', 'LL', 'LSS', 'LL']);

  Object.entries(markedPassages).forEach(([passageId, lines]) => {
    const passage = nle.ANNUAL_EXAM_PASSAGES.find((item) => item.id === passageId);
    assert.equal(passage.latin, lines.map(stripMacrons).join('\n'));
    lines.forEach((line) => {
      const scanned = parseHexameter(analyze(line));
      assert.ok(scanned.feet, `${line} did not scan: ${scanned.pattern}`);
      assert.equal(scanned.feet.length, 6, line);
      assert.equal(scanned.feet[4], 'LSS', `${line} should keep a dactyl in the fifth foot`);
    });
  });
});
