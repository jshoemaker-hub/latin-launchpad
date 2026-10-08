const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

function loadWorld() {
  const context = {};
  vm.createContext(context);
  ['latin-culture.js', 'roman-world.js', 'annual-exam-questions.js', 'annual-exam-culture.js'].forEach((name) => {
    vm.runInContext(fs.readFileSync(path.join(root, name), 'utf8'), context, { filename: name });
  });
  vm.runInContext(
    'globalThis.__OUT = { cards: LATIN_CULTURE_CARDS, timeline: ROMAN_TIMELINE, places: ROMAN_MAP_PLACES, questions: ANNUAL_EXAM_QUESTIONS.filter((item) => String(item.id).startsWith("cult-")) };',
    context
  );
  return context.__OUT;
}

test('Roman-world units have cards, a timeline, a map, and bank questions', () => {
  const { cards, timeline, places, questions } = loadWorld();
  const units = cards.filter((card) => card.original);
  const myth = units.filter((card) => card.unit === 'myth');
  const life = units.filter((card) => card.unit === 'life');
  const history = units.filter((card) => card.unit === 'history');
  assert.equal(myth.length, 40);
  assert.equal(life.length, 25);
  assert.equal(history.length, 20);
  assert.equal(units.length, 85);
  assert.equal(cards.length, 119);

  const ids = units.map((card) => card.id);
  assert.equal(new Set(ids).size, ids.length);
  units.forEach((card) => {
    assert.equal(card.sourceImages.length, 0);
    assert.ok(card.summary.length > 40, card.id);
    assert.ok(card.latinTitle && card.title);
    assert.equal(/\b(First|Second|Third) Form\b/.test(`${card.summary} ${card.connection}`), false);
  });

  assert.equal(timeline.length, 20);
  timeline.forEach((event, index) => {
    assert.equal(event.order, index + 1);
    assert.ok(history.some((card) => card.id === event.cardId), event.cardId);
  });

  assert.equal(places.length, 60);
  assert.equal(new Set(places.map((place) => place.id)).size, 60);
  places.forEach((place) => {
    assert.ok(place.latin && place.english && place.group);
    assert.ok(place.x >= 0 && place.x <= 1000 && place.y >= 0 && place.y <= 640, place.id);
    assert.equal(/[jJ]/.test(place.latin), false, place.latin);
  });

  assert.equal(questions.length, 40);
  questions.forEach((question) => {
    assert.equal(question.choices.length, 4);
    assert.ok(question.choices.includes(question.answer), question.id);
    assert.equal(question.passageId, null);
    assert.equal(question.storyId, null);
  });

  const cultureSource = fs.readFileSync(path.join(root, 'latin-culture.js'), 'utf8');
  assert.equal(/Third Form/.test(cultureSource), false);
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(app, /function showRomanWorld/);
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /roman-world\.js/);
  assert.match(html, /id="romanWorldPage"/);
});
