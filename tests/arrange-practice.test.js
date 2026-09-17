const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const sources = ['word-banks.js', 'reference-vocabulary.js', 'latin-phrases.js', 'grammar-lessons.js']
  .map((file) => fs.readFileSync(path.join(root, file), 'utf8'))
  .join('\n');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const lessonBuilder = appSource.split('const ENDING_HINTS')[0];
const helperSource = appSource.slice(
  appSource.indexOf('function supportsArrangePractice'),
  appSource.indexOf('function getLessonPictureQuestions')
);

test('every lesson that advertises Arrange has an arrangeable question', () => {
  const result = Function(`
    ${sources}
    ${lessonBuilder}
    const isReviewAttempt = () => false;
    ${helperSource}
    return LESSONS.map((lesson) => ({
      id: lesson.id,
      supported: supportsArrangePractice(lesson),
      questionCount: getArrangeQuestions(lesson).length
    }));
  `)();

  const emptyArrangeLessons = result.filter((lesson) => lesson.supported && lesson.questionCount === 0);
  assert.deepEqual(emptyArrangeLessons, []);
});

test('punctuated endings are not treated as multiword Latin', () => {
  const tokens = Function(`
    ${helperSource.replace(/function supportsArrangePractice[\s\S]*?(?=function getLatinTokens)/, '')}
    return ['-a', '-am', 'dona'].map(getArrangeWordTokens);
  `)();

  assert.deepEqual(tokens, [['a'], ['am'], ['dona']]);
});

test('zero-question lesson completions are removed from saved progress', () => {
  const start = appSource.indexOf('function normalizeProgress');
  const end = appSource.indexOf('function normalizeWordStats');
  const normalizationSource = appSource.slice(start, end);
  const lessons = Function(`
    const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    const normalizeWordStats = () => ({});
    ${normalizationSource}
    return normalizeProgress({
      lessons: {
        broken: { score: 0, maxScore: 0 },
        valid: { score: 4, maxScore: 5 },
        legacy: { score: 3 }
      }
    }).lessons;
  `)();

  assert.deepEqual(Object.keys(lessons).sort(), ['legacy', 'valid']);
});
