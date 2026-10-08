const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

function read(name) {
  return fs.readFileSync(path.join(root, name), 'utf8');
}

test('year labels drop textbook names and keep lesson ids', () => {
  const app = read('app.js');
  const flashcards = read('flashcards.js');
  const phrases = read('latin-phrases.js');
  const exam = read('annual-exam.js');
  const curriculum = app.slice(0, app.indexOf('function getCurriculumLevelByGrade'));
  assert.match(curriculum, /label: 'Year 4A'/);
  assert.match(curriculum, /label: 'Year 4B'/);
  assert.match(curriculum, /label: 'Year 4C'/);
  assert.match(curriculum, /examLevelId: 'intro'/);
  assert.match(curriculum, /examLevelId: 'beginning'/);
  assert.match(curriculum, /examLevelId: 'intermediate'/);
  assert.doesNotMatch(curriculum, /First Form|Second Form|Third Form/);
  assert.doesNotMatch(flashcards.slice(0, flashcards.indexOf('function load')), /First Form|Second Form|Third Form/);
  assert.doesNotMatch(phrases, /First Form|Second Form|Third Form|Form Latin/);
  assert.doesNotMatch(exam, /First Form|Second Form|Third Form/);
  assert.match(app, /function gradeForYear\(year, lessonId\)/);
  assert.match(app, /grade6-1|grade\$\{grade\}-\$\{index \+ 1\}/);
});
