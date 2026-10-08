const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

test('derivatives, mottoes, numerals, and authors are in place', () => {
  const context = {};
  vm.createContext(context);
  [
    'word-banks.js',
    'latin-phrases.js',
    'latin-phrases-more.js',
    'latin-culture.js',
    'roman-world.js',
    'latin-authors.js',
    'grammar-lessons.js',
    'grammar-lessons-syntax.js',
    'grammar-lessons-extra.js',
    'word-building.js'
  ].forEach((name) => {
    vm.runInContext(fs.readFileSync(path.join(root, name), 'utf8'), context, { filename: name });
  });
  vm.runInContext(`
    function getCurriculumLevelByGrade(grade) {
      const map = { 3: [3], 4: [4], 5: [5], 6: [6, 7, 8] };
      return { lessonGrades: map[grade] || [Number(grade)] };
    }
    const known = new Set(Object.values(GRADE_WORDS).flat().map((word) => String(word.latin).toLowerCase().replace(/[^a-z]/g, '')));
    const badPairs = DERIVATIVE_PAIRS.filter((pair) => !known.has(String(pair.latin).toLowerCase().replace(/[^a-z]/g, '')));
    const focus = getPhraseFocusForLesson(6, [
      { latin: 'schola' },
      { latin: 'magister' },
      { latin: 'liber' },
      { latin: 'tabula' }
    ]);
    globalThis.__OUT = {
      phrases: LATIN_PHRASES.length,
      focusAdded: focus.filter((phrase) => phrase.added).map((phrase) => phrase.id),
      focusClassic: focus.filter((phrase) => !phrase.added).length,
      authors: LATIN_CULTURE_CARDS.filter((card) => card.unit === 'authors').length,
      lessons: SYNTAX_GRAMMAR_LESSONS.filter((lesson) => lesson.id === 'grade6-grammar-roman-numerals' || lesson.id === 'grade8-grammar-hexameter-lines').map((lesson) => lesson.id),
      affixes: AFFIX_ITEMS.length,
      yearCounts: [3, 4, 5, 6].map((grade) => derivativePoolForGrade(grade).length),
      badPairs: badPairs.map((pair) => pair.latin)
    };
  `, context);
  const result = context.__OUT;
  assert.equal(result.phrases, 144);
  assert.equal(result.focusClassic, 1);
  assert.deepEqual(Array.from(result.focusAdded), ['montani']);
  assert.equal(result.authors, 16);
  assert.deepEqual(Array.from(result.lessons), ['grade6-grammar-roman-numerals', 'grade8-grammar-hexameter-lines']);
  assert.equal(result.affixes, 12);
  assert.deepEqual(Array.from(result.badPairs), []);
  Array.from(result.yearCounts).forEach((count) => assert.ok(count >= 8, `year pool ${count}`));
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(app, /function showWordBuilding/);
});
