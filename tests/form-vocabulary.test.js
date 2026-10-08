const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const formSource = fs.readFileSync(path.join(root, 'form-vocabulary.js'), 'utf8');
const wordBanks = fs.readFileSync(path.join(root, 'word-banks.js'), 'utf8');
const reference = fs.readFileSync(path.join(root, 'reference-vocabulary.js'), 'utf8');

function sliceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0 && end > start, `Missing slice ${startMarker} -> ${endMarker}`);
  return source.slice(start, end);
}

function loadForms() {
  return Function(`
    ${wordBanks}
    ${reference}
    ${formSource}
    ${sliceBetween(appSource, 'const ENDING_HINTS', 'const STORAGE_KEY')}
    ${sliceBetween(appSource, 'function hintHeadwordKey', 'function renderEndingHint')}
    return { getFormRecord, FORM_VOCABULARY, GRADE_WORDS, buildChant, getEndingHint };
  `)();
}

test('dictionary forms keep the stored headword and use macrons rather than stress accents', () => {
  const { getFormRecord, GRADE_WORDS } = loadForms();
  const puella = GRADE_WORDS[3].find((word) => word.latin === 'puella');
  assert.equal(puella.latin, 'puella');
  assert.equal(puella.dictionaryEntry, 'puella, -ae, f.');
  assert.equal(puella.gender, 'f.');
  assert.deepEqual(puella.formBooks, []);

  const amo = getFormRecord('amo');
  assert.equal(amo.dictionaryEntry, 'amō, amāre, amāvī, amātum');
  assert.equal(amo.principalParts, amo.dictionaryEntry);
  assert.equal(getFormRecord('mensa').dictionaryEntry, 'mēnsa, -ae, f.');
  assert.equal(getFormRecord('porta').dictionaryEntry, 'porta, -ae, f.');
  assert.deepEqual(getFormRecord('nomen').formBooks, []);
  assert.deepEqual(getFormRecord('amo').formBooks, []);

  Object.values(GRADE_WORDS).flat().forEach((word) => {
    const entry = word.dictionaryEntry || '';
    assert.doesNotMatch(entry, /[áéíóúýÁÉÍÓÚÝ]/, `${word.latin} copied a stress accent`);
    assert.equal(word.latin, word.latin.normalize('NFC'), word.latin);
  });
});

test('chants follow a reliable paradigm and skip true irregulars', () => {
  const { buildChant } = loadForms();
  assert.deepEqual(buildChant({ latin: 'curro' }).forms, ['curro', 'curris', 'currit', 'currimus', 'curritis', 'currunt']);
  assert.deepEqual(buildChant({ latin: 'capio' }).forms, ['capio', 'capis', 'capit', 'capimus', 'capitis', 'capiunt']);
  assert.deepEqual(buildChant({ latin: 'pater' }).forms, ['pater', 'patris', 'patri', 'patrem', 'patre']);
  assert.deepEqual(buildChant({ latin: 'liber' }).forms, ['liber', 'libri', 'libro', 'librum', 'libro']);
  assert.equal(buildChant({ latin: 'sum' }), null);
  assert.equal(buildChant({ latin: 'eo' }), null);
  assert.equal(buildChant({ latin: 'fero' }), null);
  assert.equal(buildChant({ latin: 'do' }), null);
  assert.equal(buildChant({ latin: 'circum' }), null);
  assert.equal(buildChant({ latin: 'domus' }), null);
});

test('ending hints use declension when the suffix would name the wrong class', () => {
  const { getEndingHint, getFormRecord } = loadForms();
  assert.ok(getFormRecord('manus'), 'expected a manus record');
  assert.match(getEndingHint('manus'), /fourth declension/i);
  assert.doesNotMatch(getEndingHint('manus'), /In second-declension nouns/i);
  assert.match(getEndingHint('puella'), /first-declension/i);
  assert.match(getEndingHint('servus'), /second-declension/i);
  assert.match(getEndingHint('amamus'), /we/i);
});
