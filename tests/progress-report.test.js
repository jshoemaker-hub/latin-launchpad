const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const assign = require('../assignment-links.js');

const appSource = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

function sliceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0 && end > start, `Missing slice ${startMarker} -> ${endMarker}`);
  return source.slice(start, end);
}

function loadReportTools() {
  const source = [
    sliceBetween(appSource, 'function normalizeProgress', 'function normalizeBadges'),
    sliceBetween(appSource, 'function getCompletedLessons', 'function getCompletedLessonModels'),
    sliceBetween(appSource, 'function formatPracticeTime', 'function printWeeklyReport')
  ].join('\n');
  return Function(`
    const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    const LESSONS = [];
    function escapeHtml(value) { return String(value); }
    function getLessonDisplayTitle() { return ''; }
    function renderPrintHeader() {
      return '<div class="write-label">Name</div><div class="write-label">Date</div><div class="write-label">Lesson #</div>';
    }
    ${source}
    return { normalizeProgress, buildWeeklyReport, buildWeeklyReportHtml, formatPracticeTime };
  `)();
}

test('older progress loads with ratings and practice time added, not removed', () => {
  const { normalizeProgress } = loadReportTools();
  const stored = normalizeProgress({
    points: 42,
    lessons: { 'grade3-1': { score: 8, maxScore: 10, completedAt: '2026-01-01T00:00:00.000Z' } },
    wordsMastered: { aqua: true },
    wordStats: { aqua: { latin: 'aqua', english: 'water', attempts: 3, correct: 2, misses: 1 } }
  });
  assert.equal(stored.points, 42);
  assert.equal(stored.lessons['grade3-1'].score, 8);
  assert.equal(stored.lessons['grade3-1'].completedAt, '2026-01-01T00:00:00.000Z');
  assert.equal(stored.wordsMastered.aqua, true);
  assert.equal(stored.wordStats.aqua.attempts, 3);
  assert.equal(stored.wordStats.aqua.rating, '');
  assert.equal(stored.practiceMs, 0);
  assert.deepEqual(stored.practiceSessions, []);
});

test('the weekly report shows lessons, scores, words, and recorded time', () => {
  const { buildWeeklyReportHtml } = loadReportTools();
  const now = Date.parse('2026-10-06T12:00:00.000Z');
  const html = buildWeeklyReportHtml({
    studentName: 'KeepMe',
    grade: 3,
    progress: {
      points: 42,
      lessons: {
        'grade3-1': { score: 8, maxScore: 10, completedAt: '2026-10-05T12:00:00.000Z' },
        'grade3-2': { score: 4, maxScore: 10 }
      },
      wordsMastered: { aqua: true },
      wordStats: {
        puella: { latin: 'puella', english: 'girl', rating: 'hesitant', attempts: 1, correct: 0, misses: 1 }
      },
      practiceSessions: [{ at: '2026-10-06T11:00:00.000Z', ms: 120000 }]
    }
  }, now);
  assert.match(html, /KeepMe/);
  assert.match(html, /grade3-1: 8 \/ 10/);
  assert.match(html, /grade3-2: 4 \/ 10/);
  assert.match(html, /aqua/);
  assert.match(html, /puella — girl/);
  assert.match(html, /2 minutes recorded this week/);
  assert.match(html, /Name/);
  assert.match(html, /Date/);
  assert.match(html, /Lesson #/);
  assert.doesNotMatch(html, /National Latin Exam|nle\.org|\bNLE\b/i);
});

test('a bad backup file does not replace or wipe saved progress', () => {
  const source = sliceBetween(appSource, 'function importProgressText', 'function renderPrintHeader');
  const loadSource = sliceBetween(appSource, 'function loadState()', 'async function supabaseLoadProfile');
  assert.doesNotMatch(loadSource, /removeItem/);
  assert.doesNotMatch(source, /removeItem/);

  const tools = Function(`
    const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    let progressLocked = true;
    let saved = 0;
    let applied = null;
    const status = [];
    function applyStoredState(state) { applied = state; }
    function saveState() { saved += 1; }
    function renderHome() {}
    function renderDashboard() {}
    function renderAccountControls() {}
    function setProgressBackupStatus(message) { status.push(message); }
    ${source}
    return {
      importProgressText,
      read() { return { saved, applied, status, progressLocked }; }
    };
  `)();

  assert.equal(tools.importProgressText('{'), false);
  assert.equal(tools.importProgressText('[]'), false);
  assert.equal(tools.read().saved, 0);
  assert.equal(tools.read().applied, null);
  assert.match(tools.read().status.at(-1), /kept/);

  const backup = JSON.stringify({
    studentName: 'KeepMe',
    progress: { points: 42, lessons: {}, wordsMastered: { aqua: true }, wordStats: {} }
  });
  assert.equal(tools.importProgressText(backup), true);
  assert.equal(tools.read().saved, 1);
  assert.equal(tools.read().applied.studentName, 'KeepMe');
  assert.equal(tools.read().applied.progress.points, 42);
});

test('a progress backup may include the nickname and a completion code still does not', () => {
  assert.match(sliceBetween(appSource, 'function exportProgress', 'function importProgressText'), /createStateSnapshot/);
  assert.match(sliceBetween(appSource, 'function createStateSnapshot', 'function applyStoredState'), /studentName/);
  const code = assign.encodeCompletion({
    kind: 'lesson',
    id: 'grade3-1',
    mode: 'recall',
    score: 1,
    total: 1,
    missed: [],
    studentName: 'KeepMe'
  });
  assert.equal(assign.decodeCompletion(code).ok, true);
  assert.doesNotMatch(code, /KeepMe/);
});
