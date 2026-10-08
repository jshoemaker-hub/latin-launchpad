// Derivative and affix practice drawn from words already in the year lists.

const DERIVATIVE_PAIRS = [
  { latin: 'aqua', english: 'water', derivative: 'aquatic' },
  { latin: 'luna', english: 'moon', derivative: 'lunar' },
  { latin: 'porta', english: 'gate', derivative: 'portal' },
  { latin: 'terra', english: 'earth', derivative: 'terrestrial' },
  { latin: 'via', english: 'road', derivative: 'viaduct' },
  { latin: 'annus', english: 'year', derivative: 'annual' },
  { latin: 'amicus', english: 'friend', derivative: 'amicable' },
  { latin: 'bellum', english: 'war', derivative: 'belligerent' },
  { latin: 'liber', english: 'book', derivative: 'library' },
  { latin: 'nomen', english: 'name', derivative: 'nominal' },
  { latin: 'familia', english: 'family', derivative: 'familiar' },
  { latin: 'stella', english: 'star', derivative: 'stellar' },
  { latin: 'insula', english: 'island', derivative: 'insular' },
  { latin: 'epistula', english: 'letter', derivative: 'epistle' },
  { latin: 'corona', english: 'crown', derivative: 'coronation' },
  { latin: 'unda', english: 'wave', derivative: 'undulate' },
  { latin: 'rota', english: 'wheel', derivative: 'rotary' },
  { latin: 'video', english: 'see', derivative: 'visible' },
  { latin: 'patria', english: 'homeland', derivative: 'patriot' },
  { latin: 'lumen', english: 'light', derivative: 'luminous' },
  { latin: 'victoria', english: 'victory', derivative: 'victorious' },
  { latin: 'cultura', english: 'cultivation', derivative: 'culture' },
  { latin: 'poeta', english: 'poet', derivative: 'poetry' },
  { latin: 'natura', english: 'nature', derivative: 'natural' },
  { latin: 'medicina', english: 'medicine', derivative: 'medical' },
  { latin: 'aurum', english: 'gold', derivative: 'aureole' },
  { latin: 'flumen', english: 'river', derivative: 'flume' },
  { latin: 'virtus', english: 'courage', derivative: 'virtue' },
  { latin: 'musica', english: 'music', derivative: 'musical' },
  { latin: 'fabula', english: 'story', derivative: 'fable' },
  { latin: 'mater', english: 'mother', derivative: 'maternal' },
  { latin: 'amor', english: 'love', derivative: 'amorous' },
  { latin: 'tempus', english: 'time', derivative: 'temporary' },
  { latin: 'mare', english: 'sea', derivative: 'marine' },
  { latin: 'navis', english: 'ship', derivative: 'naval' },
  { latin: 'pater', english: 'father', derivative: 'paternal' },
  { latin: 'dies', english: 'day', derivative: 'diary' },
  { latin: 'lex', english: 'law', derivative: 'legal' },
  { latin: 'audio', english: 'hear', derivative: 'audience' },
  { latin: 'scribo', english: 'write', derivative: 'scribe' },
  { latin: 'miles', english: 'soldier', derivative: 'military' },
  { latin: 'deus', english: 'god', derivative: 'deity' },
  { latin: 'exemplum', english: 'example', derivative: 'exemplary' },
  { latin: 'schola', english: 'school', derivative: 'scholar' },
  { latin: 'magister', english: 'teacher', derivative: 'magistrate' },
  { latin: 'sol', english: 'sun', derivative: 'solar' },
  { latin: 'caelum', english: 'sky', derivative: 'celestial' },
  { latin: 'astrum', english: 'star', derivative: 'astronomy' },
  { latin: 'ars', english: 'art', derivative: 'artist' },
  { latin: 'agricola', english: 'farmer', derivative: 'agriculture' },
  { latin: 'urbs', english: 'city', derivative: 'urban' },
  { latin: 'caput', english: 'head', derivative: 'capital' },
  { latin: 'scriptum', english: 'something written', derivative: 'scripture' },
  { latin: 'senatus', english: 'senate', derivative: 'senator' },
  { latin: 'gloria', english: 'glory', derivative: 'glorious' },
  { latin: 'honor', english: 'honor', derivative: 'honorable' },
  { latin: 'opus', english: 'work', derivative: 'opera' },
  { latin: 'gradus', english: 'step', derivative: 'gradual' },
  { latin: 'ordo', english: 'order', derivative: 'order' },
  { latin: 'ratio', english: 'reason', derivative: 'rational' },
  { latin: 'civis', english: 'citizen', derivative: 'civic' },
  { latin: 'doctrina', english: 'teaching', derivative: 'doctrine' }
];

const AFFIX_ITEMS = [
  { latin: 'pre-', english: 'before', note: 'A prefix. Prehistoric means before written history.' },
  { latin: 're-', english: 'again or back', note: 'A prefix. Rebuild means build again.' },
  { latin: 'in-', english: 'not, or in', note: 'A prefix. Invisible means not visible. Inhale means breathe in.' },
  { latin: 'con-', english: 'together', note: 'A prefix. Convene means come together. Com- is the form before some letters.' },
  { latin: 'de-', english: 'down or away', note: 'A prefix. Descend means climb down.' },
  { latin: 'ex-', english: 'out', note: 'A prefix. Export means carry out.' },
  { latin: 'sub-', english: 'under', note: 'A prefix. Submarine means under the sea.' },
  { latin: 'trans-', english: 'across', note: 'A prefix. Transfer means carry across.' },
  { latin: 'inter-', english: 'between', note: 'A prefix. International means between nations.' },
  { latin: '-or', english: 'a person who', note: 'A suffix. An actor is a person who acts.' },
  { latin: '-tion', english: 'the act of', note: 'A suffix from Latin -tio. Education is the act of leading out, or of teaching.' },
  { latin: '-able', english: 'able to', note: 'A suffix from Latin -bilis. Portable means able to be carried.' }
];

const WordBuildingState = {
  grade: 3,
  mode: 'root',
  queue: [],
  index: 0,
  correct: 0,
  asked: 0,
  note: ''
};

function foldHeadword(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
}

function derivativePoolForGrade(grade) {
  const level = typeof getCurriculumLevelByGrade === 'function' ? getCurriculumLevelByGrade(grade) : null;
  const grades = level ? level.lessonGrades : [Number(grade)];
  const known = new Set(grades.flatMap((item) => (GRADE_WORDS[item] || []).map((word) => foldHeadword(word.latin))));
  return DERIVATIVE_PAIRS.filter((pair) => known.has(foldHeadword(pair.latin)));
}

function shuffleBuilding(items) {
  const copy = items.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const hold = copy[index];
    copy[index] = copy[swap];
    copy[swap] = hold;
  }
  return copy;
}

function startWordBuildingRound() {
  const source = WordBuildingState.mode === 'affix' ? AFFIX_ITEMS : derivativePoolForGrade(WordBuildingState.grade);
  WordBuildingState.queue = shuffleBuilding(source).slice(0, 8);
  WordBuildingState.index = 0;
  WordBuildingState.correct = 0;
  WordBuildingState.asked = 0;
  WordBuildingState.note = WordBuildingState.queue.length
    ? 'Choose the matching answer.'
    : 'This year does not have derivative pairs yet.';
}

function buildingChoices(item) {
  const pool = WordBuildingState.mode === 'affix' ? AFFIX_ITEMS : derivativePoolForGrade(WordBuildingState.grade);
  const answer = WordBuildingState.mode === 'english' ? item.latin : WordBuildingState.mode === 'affix' ? item.english : item.derivative;
  const distractors = shuffleBuilding(pool.filter((candidate) => candidate !== item)).slice(0, 3).map((candidate) => (
    WordBuildingState.mode === 'english' ? candidate.latin : WordBuildingState.mode === 'affix' ? candidate.english : candidate.derivative
  ));
  return shuffleBuilding([answer, ...distractors]);
}

function renderWordBuilding() {
  const stage = document.getElementById('wordBuildingStage');
  if (!stage) return;
  if (WordBuildingState.queue.length === 0) startWordBuildingRound();
  const item = WordBuildingState.queue[WordBuildingState.index];
  const years = [
    [3, 'Year 1'],
    [4, 'Year 2'],
    [5, 'Year 3'],
    [6, 'Year 4']
  ];
  const modes = [
    ['root', 'Latin to English'],
    ['english', 'English to Latin'],
    ['affix', 'Prefixes and suffixes']
  ];
  const prompt = !item
    ? '<p>Choose another year.</p>'
    : WordBuildingState.mode === 'english'
      ? `<p>Which Latin word gives English <strong>${escapeHtml(item.derivative)}</strong>?</p>`
      : WordBuildingState.mode === 'affix'
        ? `<p>What does <strong>${escapeHtml(item.latin)}</strong> mean in an English word?</p>`
        : `<p>Which English word comes from <strong>${escapeHtml(item.latin)}</strong>, ${escapeHtml(item.english)}?</p>`;
  const choices = item ? buildingChoices(item) : [];
  stage.innerHTML = `
    <div class="roman-world-tabs">
      ${years.map(([grade, label]) => `<button type="button" data-building-grade="${grade}" class="${Number(WordBuildingState.grade) === grade ? 'active' : ''}">${label}</button>`).join('')}
    </div>
    <div class="roman-world-tabs">
      ${modes.map(([mode, label]) => `<button type="button" data-building-mode="${mode}" class="${WordBuildingState.mode === mode ? 'active' : ''}">${label}</button>`).join('')}
    </div>
    <p>${escapeHtml(WordBuildingState.note)} Score ${WordBuildingState.correct}/${WordBuildingState.asked}. ${derivativePoolForGrade(WordBuildingState.grade).length} roots in this year.</p>
    ${prompt}
    <div class="timeline-choices">
      ${choices.map((choice) => `<button type="button" data-building-choice="${escapeHtml(choice)}">${escapeHtml(choice)}</button>`).join('')}
    </div>
  `;
}

function onWordBuildingClick(event) {
  const grade = event.target.closest('[data-building-grade]');
  if (grade) {
    WordBuildingState.grade = Number(grade.getAttribute('data-building-grade'));
    startWordBuildingRound();
    renderWordBuilding();
    return;
  }
  const mode = event.target.closest('[data-building-mode]');
  if (mode) {
    WordBuildingState.mode = mode.getAttribute('data-building-mode');
    startWordBuildingRound();
    renderWordBuilding();
    return;
  }
  const choice = event.target.closest('[data-building-choice]');
  if (!choice) return;
  const item = WordBuildingState.queue[WordBuildingState.index];
  if (!item) return;
  const answer = WordBuildingState.mode === 'english' ? item.latin : WordBuildingState.mode === 'affix' ? item.english : item.derivative;
  WordBuildingState.asked += 1;
  if (choice.getAttribute('data-building-choice') === answer) {
    WordBuildingState.correct += 1;
    WordBuildingState.note = item.note || `${item.latin} gives ${item.derivative}.`;
    WordBuildingState.index += 1;
    if (WordBuildingState.index >= WordBuildingState.queue.length) {
      WordBuildingState.note = 'Round complete. Choose a year or a mode to start again.';
      WordBuildingState.queue = [];
    }
  } else {
    WordBuildingState.note = `Not quite. The answer is ${answer}.`;
  }
  renderWordBuilding();
}

function bindWordBuilding() {
  const stage = document.getElementById('wordBuildingStage');
  if (stage && !stage.dataset.bound) {
    stage.dataset.bound = 'true';
    stage.addEventListener('click', onWordBuildingClick);
  }
}
