const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

function loadValues() {
  const context = {};
  vm.createContext(context);
  [
    'latin-culture.js',
    'roman-world.js',
    'latin-values.js',
    'annual-exam-questions.js',
    'annual-exam-values.js'
  ].forEach((name) => {
    vm.runInContext(fs.readFileSync(path.join(root, name), 'utf8'), context, { filename: name });
  });
  vm.runInContext(
    'globalThis.__OUT = { cards: LATIN_CULTURE_CARDS.filter((card) => card.unit === "values"), questions: ANNUAL_EXAM_QUESTIONS.filter((item) => String(item.id).startsWith("val-")) };',
    context
  );
  return context.__OUT;
}

test('Roman values cards have a Latin example and a place in the Roman world', () => {
  const { cards } = loadValues();
  const ids = [
    'value-pietas',
    'value-gravitas',
    'value-virtus',
    'value-fides',
    'value-dignitas',
    'value-auctoritas',
    'value-mos-maiorum',
    'value-humanitas',
    'value-stoic',
    'value-epicurean'
  ];
  assert.equal(cards.map((card) => card.id).join('|'), ids.join('|'));
  cards.forEach((card) => {
    assert.equal(card.unit, 'values');
    assert.equal(card.original, true);
    assert.ok(card.summary.length > 40, card.id);
    assert.ok(card.example.latin && card.example.english && card.example.source, card.id);
    assert.equal(/[jJ]/.test(card.example.latin), false, card.example.latin);
    assert.equal(/\b(First|Second|Third) Form\b/.test(`${card.summary} ${card.connection}`), false);
    assert.equal(/national latin exam|nle\.org|\bNLE\b/i.test(`${card.summary} ${card.connection} ${card.example.source}`), false);
  });
  assert.match(cards.find((card) => card.id === 'value-gravitas').example.source, /Original classroom sentence/);
  assert.match(cards.find((card) => card.id === 'value-epicurean').summary, /not a license to grab every pleasure/);
  assert.doesNotMatch(cards.find((card) => card.id === 'value-stoic').summary, /suicide|pain is good/i);

  const romanWorld = fs.readFileSync(path.join(root, 'roman-world.js'), 'utf8');
  assert.match(romanWorld, /\['values', 'Values'\]/);
  assert.match(romanWorld, /culture-example/);
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /latin-values\.js/);
  const toml = fs.readFileSync(path.join(root, 'netlify.toml'), 'utf8');
  assert.match(toml, /latin-values\.js/);
  assert.match(toml, /annual-exam-values\.js/);
});

test('values questions serve Advanced Poetry and Advanced Reading', () => {
  const { questions } = loadValues();
  const poetry = questions.filter((question) => question.level === 'advanced-poetry');
  const reading = questions.filter((question) => question.level === 'advanced-reading' && question.section === 'culture');
  const extension = questions.filter((question) => question.section === 'extension');
  assert.equal(poetry.length, 10);
  assert.equal(reading.length, 10);
  assert.equal(extension.length, 2);
  questions.forEach((question) => {
    assert.equal(question.category, 'culture');
    assert.equal(question.choices.length, 4);
    assert.equal(new Set(question.choices).size, 4);
    assert.ok(question.choices.includes(question.answer), question.id);
    assert.ok(question.prompt.length >= 8, question.id);
    assert.ok(question.explanation.length >= 12, question.id);
    assert.equal(/national latin exam|nle\.org|\bNLE\b/i.test(`${question.prompt} ${question.explanation}`), false);
  });
  extension.forEach((question) => {
    assert.equal(question.passageId, 'advanced-reading-cornelia');
  });
  poetry.forEach((question) => {
    assert.equal(question.passageId, null);
    assert.equal(question.section, 'culture');
  });
});
