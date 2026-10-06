const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const wordBanks = fs.readFileSync(path.join(root, 'word-banks.js'), 'utf8');

function sliceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0 && end > start, `Missing slice ${startMarker} -> ${endMarker}`);
  return source.slice(start, end);
}

const hintSource = [
  sliceBetween(appSource, 'const ENDING_HINTS', 'const STORAGE_KEY'),
  sliceBetween(appSource, 'function hintHeadwordKey', 'function renderEndingHint')
].join('\n');
const choiceSource = sliceBetween(appSource, 'function latinHeadwordKey', 'function selectOption');

function loadHelpers() {
  return Function(`
    ${wordBanks}
    ${hintSource}
    ${choiceSource}
    return { getEndingHint, createChoices, GRADE_WORDS };
  `)();
}

test('ending hints follow the word instead of the first matching suffix', () => {
  const { getEndingHint } = loadHelpers();
  assert.match(getEndingHint('puella'), /first-declension/i);
  assert.match(getEndingHint('equus'), /second-declension/i);
  assert.match(getEndingHint('servus'), /second-declension/i);
  assert.match(getEndingHint('amamus'), /we/i);
  assert.doesNotMatch(getEndingHint('amamus'), /second-declension/i);
  assert.match(getEndingHint('videmus'), /we/i);
  assert.doesNotMatch(getEndingHint('videmus'), /second-declension/i);

  for (const word of ['tempus', 'opus', 'vulnus', 'pectus']) {
    assert.match(getEndingHint(word), /third-declension neuter/i, word);
    assert.doesNotMatch(getEndingHint(word), /In second-declension nouns/i, word);
  }
  for (const word of ['domus', 'senatus', 'exercitus', 'portus', 'adventus', 'versus']) {
    assert.match(getEndingHint(word), /fourth declension/i, word);
    assert.doesNotMatch(getEndingHint(word), /In second-declension nouns/i, word);
  }
  for (const word of ['civis', 'navis', 'ignis', 'hostis', 'panis', 'collis', 'vestis', 'iuvenis']) {
    assert.match(getEndingHint(word), /third-declension subject/i, word);
    assert.doesNotMatch(getEndingHint(word), /In noun forms, -is often/i, word);
  }
  assert.match(getEndingHint('arma'), /neuter plural/i);
  assert.doesNotMatch(getEndingHint('arma'), /In first-declension nouns, -a is the basic subject/);
  assert.match(getEndingHint('contra'), /preposition/i);
  assert.doesNotMatch(getEndingHint('contra'), /In first-declension nouns/);
  assert.match(getEndingHint('virtus'), /third declension/i);
  assert.match(getEndingHint('salus'), /third declension/i);
});

test('multiple-choice distractors exclude every meaning of the same Latin word', () => {
  const { createChoices, GRADE_WORDS } = loadHelpers();
  const words = Object.values(GRADE_WORDS).flat();
  const byLatin = new Map();
  words.forEach((word) => {
    const key = word.latin.toLowerCase().replace(/[^a-z]/g, '');
    if (!byLatin.has(key)) byLatin.set(key, { latin: word.latin, meanings: new Set() });
    byLatin.get(key).meanings.add(word.english);
  });
  const ambiguous = [...byLatin.values()].filter((entry) => entry.meanings.size > 1);
  assert.ok(ambiguous.length >= 5, 'expected several words with more than one gloss');

  ambiguous.forEach((entry) => {
    const meanings = [...entry.meanings];
    const target = meanings[0];
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const choices = createChoices({ latin: entry.latin, english: target }, words);
      assert.ok(choices.includes(target), `${entry.latin} dropped its correct answer`);
      meanings.slice(1).forEach((meaning) => {
        assert.ok(!choices.includes(meaning), `${entry.latin} offered another meaning: ${meaning}`);
      });
    }
  });

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const choices = createChoices({ latin: 'via', english: 'road / way' }, words);
    assert.ok(!choices.includes('road'), 'via offered road as a wrong answer');
    assert.ok(!choices.includes('way'), 'via offered way as a wrong answer');
  }
});

test('seek-find scenes ship resized WebP candidates', () => {
  const stories = fs.readFileSync(path.join(root, 'latin-stories.js'), 'utf8');
  const images = [...stories.matchAll(/assets\/seek-find\/([a-z0-9-]+)\.jpg/g)].map((match) => match[1]);
  assert.ok(images.length >= 10);
  images.forEach((name) => {
    for (const width of [768, 1280]) {
      const file = path.join(root, 'assets', 'seek-find', `${name}-${width}.webp`);
      assert.ok(fs.existsSync(file), `missing ${name}-${width}.webp`);
      assert.ok(fs.statSync(file).size < 250 * 1024, `${name}-${width}.webp is still too large`);
    }
  });
  assert.match(appSource, /type="image\/webp"/);
  assert.match(appSource, /loading="lazy"/);
  assert.match(appSource, /decoding="async"/);
});
