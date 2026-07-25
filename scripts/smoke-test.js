const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const appPath = path.join(root, 'app.js');
const htmlPath = path.join(root, 'index.html');
const cssPath = path.join(root, 'styles.css');

const app = fs.readFileSync(appPath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkJavaScriptSyntax() {
  new vm.Script(app, { filename: appPath });
}

function checkElementIds() {
  const ids = [...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
  const idSet = new Set(ids);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert(duplicates.length === 0, `Duplicate ids: ${[...new Set(duplicates)].join(', ')}`);

  const dynamicIds = new Set(['optionsGrid', 'onlinePuzzleStage', 'crosswordStatus']);
  const lookups = [...app.matchAll(/document\.getElementById\('([^']+)'\)/g)].map((match) => match[1]);
  const missing = [...new Set(lookups.filter((id) => !idSet.has(id) && !dynamicIds.has(id)))];
  assert(missing.length === 0, `Missing static ids: ${missing.join(', ')}`);
}

function checkCssBraces() {
  let depth = 0;
  let minDepth = 0;
  for (const char of css) {
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    minDepth = Math.min(minDepth, depth);
  }
  assert(depth === 0 && minDepth === 0, `CSS brace mismatch: depth=${depth}, minDepth=${minDepth}`);
}

function checkLessonLoopHooks() {
  [
    'data-speak-latin',
    'data-speak-rate',
    'data-practice-mode',
    'data-lesson-action',
    'reviewWeakWordsButton',
    'weakWordsList',
    'wordStats',
    'getActiveQuestions',
    'startMissedWordReview',
    'startWeakWordReview'
  ].forEach((needle) => {
    assert(app.includes(needle) || html.includes(needle), `Expected hook not found: ${needle}`);
  });
}

checkJavaScriptSyntax();
checkElementIds();
checkCssBraces();
checkLessonLoopHooks();

console.log('Smoke tests passed.');
