const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

function sliceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0 && end > start, `Missing slice ${startMarker} -> ${endMarker}`);
  return source.slice(start, end);
}

test('printable questions key the authored answer and a separate answer page', () => {
  const helpers = Function(`
    ${sliceBetween(app, 'function questionAnswer', 'function createChoices')}
    ${sliceBetween(app, 'function printableAnswer', 'function selectOption')}
    return { formatPrintableQuestion, printableAnswer };
  `)();
  const grammar = helpers.formatPrintableQuestion({
    latin: 'sine aqua',
    english: 'without water',
    prompt: 'Which case follows sine?',
    choices: ['ablative', 'accusative', 'genitive', 'nominative']
  }, 0);
  assert.equal(grammar.answerLetter, 'A');
  assert.equal(grammar.answerText, 'ablative');
  assert.notEqual(grammar.answerText, 'without water');

  const exam = helpers.formatPrintableQuestion({
    prompt: 'What does habitat tell you?',
    choices: ['Marcus used to live in the villa.', 'Marcus lives in the villa.'],
    answer: 'Marcus lives in the villa.'
  }, 1);
  assert.equal(exam.number, 2);
  assert.equal(exam.answerLetter, 'B');
  assert.match(app, /quiz-answer-key/);
  assert.match(app, /data-assessment-action="print"/);
  assert.match(app, /data-nle-action="print-exam"/);
  assert.match(app, /renderPrintHeader\(lesson, sheetTitle, lessonLabel\)/);
  assert.match(css, /\.quiz-answer-key\s*\{\s*break-before:\s*page/);
  assert.match(css, /\.quiz-choices[\s\S]*background:\s*transparent/);
});
