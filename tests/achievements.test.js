const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const appSource = fs.readFileSync(path.resolve(__dirname, '..', 'app.js'), 'utf8');
const badgeDefinitions = appSource.slice(
  appSource.indexOf('const BADGE_DEFINITIONS'),
  appSource.indexOf('const AppState')
);
const achievementFunctions = appSource.slice(
  appSource.indexOf('function grantAchievement'),
  appSource.indexOf('function renderAccountControls')
);

function runAchievementScript(body) {
  return Function(`
    ${badgeDefinitions}
    const AppState = { account: { mode: 'email' }, badges: {}, progress: { points: 0 } };
    const isEmailAccount = () => true;
    ${achievementFunctions}
    ${body}
  `)();
}

test('new learning activities have dedicated badges', () => {
  const ids = runAchievementScript('return BADGE_DEFINITIONS.map((badge) => badge.id);');
  assert.ok(ids.includes('sentence-builder'));
  assert.ok(ids.includes('translation-trailblazer'));
  assert.ok(ids.includes('latin-composer'));
  assert.ok(ids.includes('story-explorer'));
  assert.ok(ids.includes('picture-detective'));
  assert.ok(ids.includes('seek-find-scout'));
  assert.ok(ids.includes('puzzle-solver'));
});

test('practice modes map to their achievement badges', () => {
  const ids = runAchievementScript(`return [
    getPracticeAchievementId('arrange'),
    getPracticeAchievementId('translate'),
    getPracticeAchievementId('compose')
  ];`);
  assert.deepEqual(ids, ['sentence-builder', 'translation-trailblazer', 'latin-composer']);
});

test('picture practice maps to its achievement badge', () => {
  const id = runAchievementScript("return getPracticeAchievementId('picture');");
  assert.equal(id, 'picture-detective');
});

test('an achievement awards bonus points only once', () => {
  const result = runAchievementScript(`
    const first = grantAchievement('story-explorer');
    const second = grantAchievement('story-explorer');
    return { first: first?.id, second, points: AppState.progress.points };
  `);
  assert.deepEqual(result, { first: 'story-explorer', second: null, points: 15 });
});

test('guest learners can earn local achievements', () => {
  const result = Function(`
    ${badgeDefinitions}
    const AppState = { account: { mode: 'guest' }, badges: {}, progress: { points: 0 } };
    const isEmailAccount = () => false;
    ${achievementFunctions}
    const badge = grantAchievement('story-explorer');
    return { badge: badge?.id, points: AppState.progress.points };
  `)();

  assert.deepEqual(result, { badge: 'story-explorer', points: 15 });
});
