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

const NUMBER_MATCH_PAIRS = [
  { numeral: 'I', latin: 'unus', english: 'one' },
  { numeral: 'II', latin: 'duo', english: 'two' },
  { numeral: 'III', latin: 'tres', english: 'three' },
  { numeral: 'IV', latin: 'quattuor', english: 'four' },
  { numeral: 'V', latin: 'quinque', english: 'five' },
  { numeral: 'VI', latin: 'sex', english: 'six' },
  { numeral: 'VII', latin: 'septem', english: 'seven' },
  { numeral: 'VIII', latin: 'octo', english: 'eight' },
  { numeral: 'IX', latin: 'novem', english: 'nine' },
  { numeral: 'X', latin: 'decem', english: 'ten' }
];

const DERIVATIVE_SENTENCES = [
  { id: 'sent-familiar', minGrade: 5, latin: 'familia', sentence: 'The cabin was a familiar sight.', ask: 'In that sentence, familiar has to do with', answer: 'a family', choices: ['a family', 'a farm', 'a river', 'a horse'], note: 'Familiar comes from familia, a family.' },
  { id: 'sent-agriculture', minGrade: 5, latin: 'ager', sentence: 'The valley is given over to agriculture.', ask: 'Agriculture has to do with', answer: 'fields', choices: ['fields', 'ships', 'the moon', 'a name'], note: 'Ager means a field. Agriculture is the work of fields.' },
  { id: 'sent-terrestrial', minGrade: 5, latin: 'terra', sentence: 'A terrestrial animal lives on the ground.', ask: 'Terrestrial has to do with', answer: 'the land', choices: ['the land', 'the sea', 'a star', 'a book'], note: 'Terra means land or earth.' },
  { id: 'sent-annual', minGrade: 5, latin: 'annus', sentence: 'The school holds an annual concert.', ask: 'Annual has to do with', answer: 'a year', choices: ['a year', 'a day', 'a friend', 'a gate'], note: 'Annus means a year. An annual event comes each year.' },
  { id: 'sent-canine', minGrade: 5, latin: 'canis', sentence: 'The canine teeth are the pointed ones.', ask: 'Canine has to do with', answer: 'a dog', choices: ['a dog', 'a horse', 'a bird', 'a fish'], note: 'Canis means a dog.' },
  { id: 'sent-maternal', minGrade: 5, latin: 'mater', sentence: 'She took a maternal interest in the child.', ask: 'Maternal has to do with', answer: 'a mother', choices: ['a mother', 'a father', 'a soldier', 'a king'], note: 'Mater means a mother.' },
  { id: 'sent-marine', minGrade: 5, latin: 'mare', sentence: 'Marine birds nest near the water.', ask: 'Marine has to do with', answer: 'the sea', choices: ['the sea', 'a mountain', 'a forest', 'a city'], note: 'Mare means the sea.' },
  { id: 'sent-paternal', minGrade: 5, latin: 'pater', sentence: 'He gave her some paternal advice.', ask: 'Paternal has to do with', answer: 'a father', choices: ['a father', 'a mother', 'a sister', 'a friend'], note: 'Pater means a father.' },
  { id: 'sent-equine', minGrade: 5, latin: 'equus', sentence: 'The vet treats equine patients.', ask: 'Equine has to do with', answer: 'a horse', choices: ['a horse', 'a dog', 'a sheep', 'a bird'], note: 'Equus means a horse.' },
  { id: 'sent-local', minGrade: 5, latin: 'locus', sentence: 'They shop at the local market.', ask: 'Local has to do with', answer: 'a place', choices: ['a place', 'a time', 'a law', 'a gift'], note: 'Locus means a place. Local means of this place.' },
  { id: 'sent-filial', minGrade: 5, latin: 'filius', sentence: 'Filial duty is what a child owes at home.', ask: 'Filial has to do with', answer: 'a son or child', choices: ['a son or child', 'a field', 'a ship', 'a temple'], note: 'Filius means a son. Filia means a daughter.' },
  { id: 'sent-magnitude', minGrade: 5, latin: 'magnus', sentence: 'They did not expect a storm of that magnitude.', ask: 'Magnitude has to do with', answer: 'great size', choices: ['great size', 'a small gift', 'a short day', 'a quiet voice'], note: 'Magnus means great. Magnitude is greatness of size.' },
  { id: 'sent-visible', minGrade: 6, latin: 'video', sentence: 'The lighthouse was visible from the road.', ask: 'Visible has to do with', answer: 'seeing', choices: ['seeing', 'hearing', 'writing', 'running'], note: 'Video means I see. Visible means able to be seen.' },
  { id: 'sent-audience', minGrade: 6, latin: 'audio', sentence: 'The audience grew quiet.', ask: 'Audience has to do with', answer: 'hearing', choices: ['hearing', 'seeing', 'sending', 'making'], note: 'Audio means I hear. An audience gathers to hear.' },
  { id: 'sent-scribe', minGrade: 6, latin: 'scribo', sentence: 'A scribe copied the names into the book.', ask: 'A scribe is a person who works by', answer: 'writing', choices: ['writing', 'fighting', 'sailing', 'cooking'], note: 'Scribo means I write.' },
  { id: 'sent-capture', minGrade: 6, latin: 'capio', sentence: 'The capture of the fort ended the fight.', ask: 'Capture has to do with', answer: 'taking', choices: ['taking', 'giving', 'sleeping', 'singing'], note: 'Capio means I take.' },
  { id: 'sent-conductor', minGrade: 6, latin: 'duco', sentence: 'The conductor led the players in.', ask: 'A conductor is a person who is', answer: 'leading', choices: ['leading', 'hiding', 'falling', 'buying'], note: 'Duco means I lead.' },
  { id: 'sent-invention', minGrade: 6, latin: 'invenio', sentence: 'The invention made the work faster.', ask: 'Invention has to do with', answer: 'finding or devising', choices: ['finding or devising', 'forgetting', 'breaking', 'closing'], note: 'Invenio means I find or come upon.' },
  { id: 'sent-sensation', minGrade: 6, latin: 'sentio', sentence: 'A cold sensation ran along his arm.', ask: 'Sensation has to do with', answer: 'feeling', choices: ['feeling', 'counting', 'ruling', 'painting'], note: 'Sentio means I feel.' },
  { id: 'sent-projectile', minGrade: 6, latin: 'iacio', sentence: 'The projectile landed in the field.', ask: 'A projectile is something that has been', answer: 'thrown', choices: ['thrown', 'planted', 'eaten', 'worn'], note: 'Iacio means I throw.' },
  { id: 'sent-invincible', minGrade: 6, latin: 'vinco', sentence: 'They called the team invincible.', ask: 'Invincible has to do with', answer: 'not being conquered', choices: ['not being conquered', 'not being seen', 'not being heard', 'not being fed'], note: 'Vinco means I conquer. The prefix in- makes it not conquerable.' },
  { id: 'sent-portable', minGrade: 6, latin: 'porto', sentence: 'She packed a portable lamp.', ask: 'Portable has to do with', answer: 'carrying', choices: ['carrying', 'burning', 'reading', 'sleeping'], note: 'Porto means I carry. Portable means able to be carried.' },
  { id: 'sent-amiable', minGrade: 6, latin: 'amo', sentence: 'He was an amiable host.', ask: 'Amiable has to do with', answer: 'loving or being friendly', choices: ['loving or being friendly', 'being angry', 'being lost', 'being silent'], note: 'Amo means I love. Amiable describes a friendly person.' },
  { id: 'sent-spectator', minGrade: 6, latin: 'specto', sentence: 'Every spectator stood for the last race.', ask: 'A spectator is a person who is', answer: 'watching', choices: ['watching', 'running', 'selling', 'building'], note: 'Specto means I watch.' },
  { id: 'sent-vocation', minGrade: 6, latin: 'voco', sentence: 'Teaching became her vocation.', ask: 'Vocation has to do with', answer: 'a calling', choices: ['a calling', 'a vacation', 'a wall', 'a ship'], note: 'Voco means I call. A vocation is a calling.' },
  { id: 'sent-mission', minGrade: 6, latin: 'mitto', sentence: 'The mission of the group was to carry the message.', ask: 'Mission has to do with', answer: 'sending', choices: ['sending', 'sitting', 'sewing', 'singing'], note: 'Mitto means I send. A mission is what someone is sent to do.' },
  { id: 'sent-dictate', minGrade: 6, latin: 'dico', sentence: 'The clerk wrote while the judge began to dictate.', ask: 'Dictate has to do with', answer: 'saying something to be written', choices: ['saying something to be written', 'drawing a map', 'locking a door', 'feeding a horse'], note: 'Dico means I say.' },
  { id: 'sent-cursive', minGrade: 6, latin: 'curro', sentence: 'The note was written in cursive.', ask: 'Cursive writing has to do with', answer: 'letters that run on', choices: ['letters that run on', 'letters cut in stone', 'letters sung aloud', 'letters counted twice'], note: 'Curro means I run. Cursive letters run along the line.' },
  { id: 'sent-factory', minGrade: 6, latin: 'facio', sentence: 'The factory made wagons.', ask: 'A factory is a place for', answer: 'making things', choices: ['making things', 'hiding things', 'burying things', 'forgetting things'], note: 'Facio means I make or I do.' },
  { id: 'sent-permanent', minGrade: 6, latin: 'maneo', sentence: 'The ink left a permanent mark.', ask: 'Permanent has to do with', answer: 'staying', choices: ['staying', 'leaving', 'falling', 'opening'], note: 'Maneo means I stay. Something permanent stays.' }
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

function sentencesForGrade(grade) {
  const max = Number(grade) >= 6 ? 8 : Number(grade);
  return DERIVATIVE_SENTENCES.filter((item) => item.minGrade <= max);
}

function derivativePoolForGrade(grade) {
  const level = typeof getCurriculumLevelByGrade === 'function' ? getCurriculumLevelByGrade(grade) : null;
  const grades = level && typeof CURRICULUM_LEVELS !== 'undefined'
    ? CURRICULUM_LEVELS.filter((item) => item.year === level.year).flatMap((item) => item.lessonGrades)
    : (level ? level.lessonGrades : [Number(grade)]);
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

function startNumberRound() {
  const pairs = shuffleBuilding(NUMBER_MATCH_PAIRS).slice(0, 4);
  WordBuildingState.numberPairs = pairs;
  WordBuildingState.numberNumerals = shuffleBuilding(pairs.map((pair) => pair.numeral));
  WordBuildingState.numberWords = shuffleBuilding(pairs.map((pair) => pair.latin));
  WordBuildingState.numberMatched = [];
  WordBuildingState.numberPick = '';
  WordBuildingState.queue = pairs;
  WordBuildingState.index = 0;
  WordBuildingState.correct = 0;
  WordBuildingState.asked = 0;
  WordBuildingState.note = 'Match the numeral to the Latin word.';
}

function startWordBuildingRound() {
  if (WordBuildingState.mode === 'numbers') {
    startNumberRound();
    return;
  }
  const source = WordBuildingState.mode === 'affix'
    ? AFFIX_ITEMS
    : WordBuildingState.mode === 'sentence'
      ? sentencesForGrade(WordBuildingState.grade)
      : derivativePoolForGrade(WordBuildingState.grade);
  WordBuildingState.queue = shuffleBuilding(source).slice(0, 8);
  WordBuildingState.index = 0;
  WordBuildingState.correct = 0;
  WordBuildingState.asked = 0;
  const emptyNote = WordBuildingState.mode === 'sentence'
    ? 'Sentences start in Year 3. Years 1 and 2 can match I through X.'
    : 'This year does not have derivative pairs yet.';
  WordBuildingState.note = WordBuildingState.queue.length
    ? 'Choose the matching answer.'
    : emptyNote;
}

function buildingChoices(item) {
  if (WordBuildingState.mode === 'sentence') return shuffleBuilding(item.choices);
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
  if (WordBuildingState.mode === 'numbers' && Number(WordBuildingState.grade) > 4) {
    WordBuildingState.mode = 'root';
    WordBuildingState.queue = [];
  }
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
    ['affix', 'Prefixes and suffixes'],
    ['sentence', 'In a sentence']
  ];
  if (Number(WordBuildingState.grade) <= 4) modes.push(['numbers', 'I to X']);
  const numberMode = WordBuildingState.mode === 'numbers';
  const matched = new Set(WordBuildingState.numberMatched || []);
  const prompt = numberMode
    ? '<p>Tap a numeral, then tap the Latin word that matches it.</p>'
    : !item
      ? '<p>Choose another year.</p>'
      : WordBuildingState.mode === 'english'
        ? `<p>Which Latin word gives English <strong>${escapeHtml(item.derivative)}</strong>?</p>`
        : WordBuildingState.mode === 'affix'
          ? `<p>What does <strong>${escapeHtml(item.latin)}</strong> mean in an English word?</p>`
          : WordBuildingState.mode === 'sentence'
            ? `<p>${escapeHtml(item.sentence)}</p><p>${escapeHtml(item.ask)}</p>`
            : `<p>Which English word comes from <strong>${escapeHtml(item.latin)}</strong>, ${escapeHtml(item.english)}?</p>`;
  const choices = !numberMode && item ? buildingChoices(item) : [];
  const numberMarkup = numberMode ? `
    <div class="timeline-columns">
      <div>
        <h4>Numeral</h4>
        <div class="timeline-choices">
          ${(WordBuildingState.numberNumerals || []).filter((numeral) => !matched.has(numeral)).map((numeral) => `<button type="button" data-number-numeral="${escapeHtml(numeral)}" class="${WordBuildingState.numberPick === numeral ? 'is-selected' : ''}">${escapeHtml(numeral)}</button>`).join('') || '<p>All four numerals are matched.</p>'}
        </div>
      </div>
      <div>
        <h4>Latin word</h4>
        <div class="timeline-choices">
          ${(WordBuildingState.numberWords || []).filter((latin) => {
            const pair = (WordBuildingState.numberPairs || []).find((item) => item.latin === latin);
            return pair && !matched.has(pair.numeral);
          }).map((latin) => `<button type="button" data-number-latin="${escapeHtml(latin)}">${escapeHtml(latin)}</button>`).join('') || '<p>All four words are matched.</p>'}
        </div>
      </div>
    </div>
    <button type="button" data-building-numbers="next">Four more</button>
  ` : '';
  stage.innerHTML = `
    <div class="roman-world-tabs">
      ${years.map(([grade, label]) => `<button type="button" data-building-grade="${grade}" class="${Number(WordBuildingState.grade) === grade ? 'active' : ''}">${label}</button>`).join('')}
    </div>
    <div class="roman-world-tabs">
      ${modes.map(([mode, label]) => `<button type="button" data-building-mode="${mode}" class="${WordBuildingState.mode === mode ? 'active' : ''}">${label}</button>`).join('')}
    </div>
    <p>${escapeHtml(WordBuildingState.note)} Score ${WordBuildingState.correct}/${WordBuildingState.asked}. ${derivativePoolForGrade(WordBuildingState.grade).length} roots in this year.</p>
    ${prompt}
    ${numberMarkup}
    <div class="timeline-choices">
      ${choices.map((choice) => `<button type="button" data-building-choice="${escapeHtml(choice)}">${escapeHtml(choice)}</button>`).join('')}
    </div>
  `;
}

function onWordBuildingClick(event) {
  const moreNumbers = event.target.closest('[data-building-numbers]');
  if (moreNumbers) {
    startNumberRound();
    renderWordBuilding();
    return;
  }
  const numeral = event.target.closest('[data-number-numeral]');
  if (numeral && WordBuildingState.mode === 'numbers') {
    WordBuildingState.numberPick = numeral.getAttribute('data-number-numeral');
    renderWordBuilding();
    return;
  }
  const latinPick = event.target.closest('[data-number-latin]');
  if (latinPick && WordBuildingState.mode === 'numbers') {
    const latin = latinPick.getAttribute('data-number-latin');
    const pair = (WordBuildingState.numberPairs || []).find((item) => item.numeral === WordBuildingState.numberPick);
    if (!WordBuildingState.numberPick || !pair) {
      WordBuildingState.note = 'Tap a numeral first.';
      renderWordBuilding();
      return;
    }
    WordBuildingState.asked += 1;
    if (pair.latin === latin) {
      WordBuildingState.correct += 1;
      WordBuildingState.numberMatched.push(pair.numeral);
      WordBuildingState.note = `${pair.numeral} is ${pair.latin}, ${pair.english}.`;
      if (WordBuildingState.numberMatched.length === WordBuildingState.numberPairs.length) {
        WordBuildingState.note = `All four are matched. ${pair.numeral} is ${pair.latin}, ${pair.english}. Choose four more, or another mode.`;
      }
    } else {
      WordBuildingState.note = 'Not a pair yet. Tap the numeral again if you need to.';
    }
    WordBuildingState.numberPick = '';
    renderWordBuilding();
    return;
  }
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
  const answer = WordBuildingState.mode === 'english'
    ? item.latin
    : WordBuildingState.mode === 'affix'
      ? item.english
      : WordBuildingState.mode === 'sentence'
        ? item.answer
        : item.derivative;
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
