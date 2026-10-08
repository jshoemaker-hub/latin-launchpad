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
    'globalThis.__OUT = { cards: LATIN_CULTURE_CARDS, timeline: ROMAN_TIMELINE, places: ROMAN_MAP_PLACES, geometry: ROMAN_MAP_GEOMETRY, detail: ROMAN_MAP_DETAIL, seas: ROMAN_MAP_SEA_TITLES.map((title) => { const point = romanMapProject(title.lon, title.lat); return { latin: title.latin, note: title.note || "", placeId: title.placeId || "", x: point.x, y: point.y, hits: ROMAN_MAP_PLACES.filter((place) => Math.abs(place.tapX - point.x) < title.spreadX && Math.abs(place.tapY - point.y) < title.spreadY).map((place) => place.id) }; }), questions: ANNUAL_EXAM_QUESTIONS.filter((item) => String(item.id).startsWith("cult-")) };',
    context
  );
  return context.__OUT;
}

test('Roman-world units have cards, a timeline, a map, and bank questions', () => {
  const { cards, timeline, places, questions, seas, detail } = loadWorld();
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
    assert.ok(place.tapX >= 0 && place.tapX <= 1000 && place.tapY >= 0 && place.tapY <= 640, place.id);
    assert.ok(Math.hypot(place.tapX - place.x, place.tapY - place.y) <= 80, place.id);
    assert.equal(/[jJ]/.test(place.latin), false, place.latin);
  });
  const byId = Object.fromEntries(places.map((place) => [place.id, place]));
  const geometry = loadWorld().geometry;
  assert.ok(Math.abs(byId.roma.x - geometry.checkX) < 0.2, `${byId.roma.x} vs ${geometry.checkX}`);
  assert.ok(Math.abs(byId.roma.y - geometry.checkY) < 0.2, `${byId.roma.y} vs ${geometry.checkY}`);
  assert.ok(byId.hispania.x < byId.britannia.x && byId.britannia.x < byId.gallia.x);
  assert.ok(byId.britannia.y < byId.hispania.y && byId.britannia.y < byId.gallia.y);
  assert.ok(byId.gallia.x < byId.roma.x);
  assert.ok(byId.aegyptus.x > byId.roma.x && byId.aegyptus.y > byId.roma.y);
  assert.ok(byId.nilus.y > byId.alexandria.y);
  assert.ok(byId.parthia.x > byId.syria.x && byId.parthia.x > byId.aegyptus.x);
  assert.ok(byId.sicilia.y > byId.italia.y);
  for (let left = 0; left < places.length; left += 1) {
    for (let right = left + 1; right < places.length; right += 1) {
      const gap = Math.hypot(places[left].tapX - places[right].tapX, places[left].tapY - places[right].tapY);
      assert.ok(gap >= 14, `${places[left].id} and ${places[right].id} taps are ${gap.toFixed(1)} apart`);
    }
  }

  assert.equal(seas.length, 4);
  const internum = seas.find((sea) => sea.latin === 'Mare Internum');
  assert.ok(internum, 'central sea keeps a single painted name');
  assert.match(internum.note, /Mare Nostrum/);
  assert.match(internum.note, /Mare Mediterraneum/);
  assert.equal(seas.some((sea) => sea.latin === 'Mare Nostrum' || sea.latin === 'Mare Mediterraneum'), false);
  seas.forEach((sea) => {
    assert.equal(sea.hits.length, 0, `${sea.latin} overlaps ${sea.hits.join(', ')}`);
  });
  const aegaeumSea = seas.find((sea) => sea.placeId === 'aegaeum');
  const euxinusSea = seas.find((sea) => sea.placeId === 'euxinus');
  assert.ok(Math.hypot(aegaeumSea.x - byId.delos.tapX, aegaeumSea.y - byId.delos.tapY) > 40);
  assert.ok(Math.hypot(euxinusSea.x - byId.colchis.tapX, euxinusSea.y - byId.colchis.tapY) > 45);
  assert.ok(Math.hypot(euxinusSea.x - byId.euxinus.tapX, euxinusSea.y - byId.euxinus.tapY) > 30);

  assert.equal(questions.length, 40);
  questions.forEach((question) => {
    assert.equal(question.choices.length, 4);
    assert.ok(question.choices.includes(question.answer), question.id);
    assert.equal(question.passageId, null);
    assert.equal(question.storyId, null);
  });

  const worldSource = fs.readFileSync(path.join(root, 'roman-world.js'), 'utf8');
  assert.match(worldSource, /Natural Earth/);
  assert.match(worldSource, /public domain/);
  assert.match(worldSource, /ETOPO1/);
  assert.equal(/\b(First|Second|Third) Form\b|National Latin Exam|nle\.org/.test(worldSource), false);
  const about = fs.readFileSync(path.join(root, 'about.html'), 'utf8');
  assert.match(about, /Natural Earth/);
  assert.match(about, /ETOPO1/);
  assert.match(about, /public domain/);
  const webp = path.join(root, 'assets', 'roman-map.webp');
  assert.equal(fs.existsSync(webp), true);
  const bytes = fs.statSync(webp).size;
  assert.ok(bytes > 20000 && bytes < 400000, `roman-map.webp is ${bytes} bytes`);
  ['italy', 'mediterranean'].forEach((key) => {
    const view = detail[key];
    const file = path.join(root, view.image);
    assert.equal(fs.existsSync(file), true, view.image);
    const detailBytes = fs.statSync(file).size;
    assert.ok(detailBytes > 20000 && detailBytes < 400000, `${view.image} is ${detailBytes} bytes`);
  });
  const italy = detail.italy;
  const italySpanX = italy.maxX - italy.minX;
  assert.ok(italy.labels.includes('roma'));
  ['roma', 'ostia', 'pompeii', 'brundisium', 'sicilia', 'corsica', 'sardinia', 'alpes'].forEach((id) => {
    const place = byId[id];
    assert.ok(place.x > italy.minX && place.x < italy.maxX, id);
    assert.ok(place.y > italy.minY && place.y < italy.maxY, id);
  });
  assert.ok((byId.sardinia.x - italy.minX) / italySpanX < 0.2, 'Sardinia sits near the western edge');
  assert.ok((byId.corsica.x - italy.minX) / italySpanX < 0.22, 'Corsica sits near the western edge');
  assert.ok((byId.alpes.y - italy.minY) / (italy.maxY - italy.minY) < 0.2, 'the Alps sit near the northern edge');
  assert.ok((italy.maxY - byId.sicilia.y) / (italy.maxY - italy.minY) < 0.25, 'Sicily sits near the southern edge');
  assert.ok(byId.graecia.x > italy.maxX, 'Greece stays outside the Italy crop');
  const greece = detail.mediterranean;
  ['graecia', 'athenae', 'macedonia', 'creta', 'delos', 'lesbos', 'ithaca'].forEach((id) => {
    const place = byId[id];
    assert.ok(place.x > greece.minX && place.x < greece.maxX, id);
    assert.ok(place.y > greece.minY && place.y < greece.maxY, id);
  });

  const cultureSource = fs.readFileSync(path.join(root, 'latin-culture.js'), 'utf8');
  assert.equal(/Third Form/.test(cultureSource), false);
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(app, /function showRomanWorld/);
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /roman-world\.js/);
  assert.match(html, /id="romanWorldPage"/);
});
