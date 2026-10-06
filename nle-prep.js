// Original National Latin Exam practice for Latin Launchpad.
// Questions and passages live in nle-questions.js. They are written for this
// site and are not copied from NLE exams. Latin Launchpad is not affiliated
// with the National Latin Exam, the American Classical League, or the NJCL.

const NLE_TIME_LIMIT_SECONDS = 45 * 60;

const NLE_LINKS = {
  home: 'https://www.nle.org/',
  about: 'https://www.nle.org/what-is-the-national-latin-exam',
  syllabus: 'https://www.nle.org/nle-syllabus',
  exams: 'https://www.nle.org/previous-exams-and-answer-keys'
};

const NLE_DISCLAIMER = 'Unofficial practice. Latin Launchpad is not affiliated with, endorsed by, or sponsored by the National Latin Exam, the American Classical League, or the National Junior Classical League. These questions are original. They are not past NLE questions. For the official syllabus, past exams, and registration, visit nle.org.';

const NLE_CATEGORIES = [
  { id: 'grammar', label: 'Grammar', section: 'language' },
  { id: 'vocabulary', label: 'Vocabulary', section: 'language' },
  { id: 'derivatives', label: 'Derivatives', section: 'language' },
  { id: 'mottoes', label: 'Mottoes and abbreviations', section: 'language' },
  { id: 'oral', label: 'Oral Latin', section: 'language' },
  { id: 'mythology', label: 'Mythology', section: 'culture' },
  { id: 'history', label: 'History', section: 'culture' },
  { id: 'geography', label: 'Geography', section: 'culture' },
  { id: 'culture', label: 'Roman life', section: 'culture' },
  { id: 'reading', label: 'Reading comprehension', section: 'reading' }
];

const NLE_CATEGORY_SECTION = Object.fromEntries(
  NLE_CATEGORIES.map((category) => [category.id, category.section])
);

const NLE_SECTION_LABELS = {
  language: 'Language',
  culture: 'Roman world',
  reading: 'Reading',
  extension: 'Extension'
};

const NLE_LEVELS = [
  {
    id: 'intro',
    name: 'Introduction to Latin',
    legacyName: 'Early Latin I',
    years: [1],
    primaryYear: 1,
    yearNote: 'Year 1 (First Form Latin). A fit for introductory or slower-paced Latin I.',
    audience: 'Students early in Latin who can read short sentences and a very short story.',
    questionCount: 40,
    readingExam: false,
    timeLimitSeconds: NLE_TIME_LIMIT_SECONDS,
    sections: [
      { id: 'culture', label: 'Culture, history, and mythology', count: 12, categories: ['mythology', 'geography', 'culture', 'history'] },
      { id: 'language', label: 'Language', count: 18, categories: ['grammar', 'vocabulary', 'derivatives', 'mottoes', 'oral'], useStory: true },
      { id: 'reading', label: 'Reading comprehension', count: 10, categories: ['reading'] }
    ],
    formatNote: 'A full Introduction exam has 40 multiple-choice questions in about 45 minutes: roughly 12 on culture, history, and mythology, 18 on the Latin language, and 10 on a short reading.',
    syllabus: [
      { heading: 'Nouns, adjectives, and pronouns', items: [
        'First, second, and third declension nouns: subject, possession, indirect object, direct object, and phrases with by, with, or from.',
        'Common adjectives, including numbers from one to ten and Roman numerals I–X.',
        'ego, tu, nos, vos and the question words quis and quid.'
      ] },
      { heading: 'Verbs', items: [
        'Present and imperfect active verbs, including sum.',
        'Present active commands and the present infinitive (to ___).',
        'A few common irregular verbs may appear in a story, with help for unusual words.'
      ] },
      { heading: 'Little words', items: [
        'Prepositions such as ad, in, cum, ex, and sine.',
        'et, aut, quod, sed, and question words such as ubi and cur.',
        'The endings -ne (asks a yes-or-no question) and -que (and).',
        'Exclamations such as ecce, eheu, and euge.'
      ] },
      { heading: 'Words, derivatives, and sayings', items: [
        'Household words and animals such as mater, soror, filius, equus, canis, and feles.',
        'English words built from Latin roots, such as lunar, portable, and agriculture.',
        'Familiar sayings and abbreviations such as carpe diem, tempus fugit, e pluribus unum, N.B., and a.m.',
        'Greetings and classroom answers: salve, vale, quid agis, ita, and minime.'
      ] },
      { heading: 'Roman world', items: [
        'Home, clothing, and meals: villa, atrium, cubiculum, toga, tunica, stola, cena.',
        'Olympian gods and goddesses, with Greek and Roman names, plus the founding stories of Aeneas, Romulus and Remus, and the she-wolf.',
        'A simple map of the Roman world: Rome, Italy, Egypt, and Mare Nostrum, the Mediterranean.'
      ] }
    ]
  },
  {
    id: 'beginning',
    name: 'Beginning Latin',
    legacyName: 'Latin I',
    years: [1, 2],
    primaryYear: 2,
    yearNote: 'Years 1–2. Closest to Latin I, or a slower start to Latin II (First Form into Second Form).',
    audience: 'Students who can read unconnected Latin sentences and one short passage.',
    questionCount: 40,
    readingExam: false,
    timeLimitSeconds: NLE_TIME_LIMIT_SECONDS,
    sections: [
      { id: 'culture', label: 'Culture, history, and mythology', count: 12, categories: ['mythology', 'geography', 'culture', 'history'] },
      { id: 'language', label: 'Language', count: 18, categories: ['grammar', 'vocabulary', 'derivatives', 'mottoes', 'oral'] },
      { id: 'reading', label: 'Reading comprehension', count: 10, categories: ['reading'] }
    ],
    formatNote: 'A full Beginning Latin exam has 40 multiple-choice questions in about 45 minutes. This practice uses 12 Roman-world questions, 18 language questions, and 10 reading questions, following the shape described for the Introduction exam. The official Beginning exam does not publish that exact split.',
    syllabus: [
      { heading: 'Nouns and pronouns', items: [
        'Everything from Introduction, plus direct address (the vocative) and simple uses of the ablative for means and manner.',
        'is, ea, id as he, she, it, and the nominative of the relative pronoun qui, quae, quod for reading.',
        'Numbers through one hundred and Roman numerals through C.'
      ] },
      { heading: 'Verbs', items: [
        'Present, imperfect, and perfect active, including sum and possum.',
        'Commands, including noli and nolite for negative commands.',
        'Idioms such as gratias agere, prima luce, and brevi tempore.'
      ] },
      { heading: 'Words and sayings', items: [
        'Body words such as caput, oculus, manus, and pes.',
        'Derivatives such as sedentary, sorority, puerile, and quadruped.',
        'Sayings and abbreviations such as veni, vidi, vici, summa cum laude, per annum, i.e., e.g., A.D., and S.P.Q.R.',
        'Classroom Latin such as gratias tibi ago, adsum, and sol lucet.'
      ] },
      { heading: 'Roman world', items: [
        'Italy and the wider map: Ostia, Pompeii, Vesuvius, Brundisium, the Apennines, Gaul, Carthage, Athens, Troy, and Asia Minor.',
        'Monarchy, Republic, and Empire, with Romulus, Tarquinius Superbus, Horatius, and Cincinnatus.',
        'Stories such as Echo and Narcissus, Arachne and Minerva, Midas, and Aeneas at Troy.',
        'The city and daily life: Forum, Palatine, Via Appia, Pantheon, baths, circus, amphitheater, triclinium, and insulae.'
      ] }
    ]
  },
  {
    id: 'beginning-reading',
    name: 'Beginning Latin Reading Comprehension',
    legacyName: 'Latin I reading',
    years: [2],
    primaryYear: null,
    yearNote: 'Year 2. A reading-focused Latin I exam, new in 2025.',
    audience: 'Students whose class is ready to be tested mainly by reading, not by stand-alone grammar.',
    questionCount: 36,
    readingExam: true,
    timeLimitSeconds: NLE_TIME_LIMIT_SECONDS,
    sections: [
      { id: 'reading', label: 'Reading comprehension', count: 33, categories: ['reading'], allPassages: true },
      { id: 'extension', label: 'Passage extension', count: 3, categories: ['mythology', 'history', 'geography', 'culture'] }
    ],
    formatNote: 'The official reading exam has 36 questions, about 33 based on one or two Latin passages and about 3 extension questions. This site has a shorter original passage set for this level.',
    syllabus: [
      { heading: 'How this exam is different', items: [
        'Questions come from the passages. There is no separate grammar drill.',
        'Culture, history, and mythology appear only when they connect to the story.',
        'The reading level adds future tense for first and second conjugation, hic and ille, participles, and simple indirect statement, still in the service of reading.'
      ] },
      { heading: 'Roman world in context', items: [
        'The same Beginning map, legends, and city life can show up if the passage touches them.',
        'Examples include Pompeii and Vesuvius, the early heroes, and Roman houses and meals.'
      ] }
    ]
  },
  {
    id: 'intermediate',
    name: 'Intermediate Latin',
    legacyName: 'Latin II',
    years: [2, 3],
    primaryYear: 3,
    yearNote: 'Years 2–3. Closest to Latin II (Second Form into Third Form).',
    audience: 'Students reading longer sentences, comparatives, passives, and a short prose passage.',
    questionCount: 40,
    readingExam: false,
    timeLimitSeconds: NLE_TIME_LIMIT_SECONDS,
    sections: [
      { id: 'culture', label: 'Culture, history, and mythology', count: 12, categories: ['mythology', 'geography', 'culture', 'history'] },
      { id: 'language', label: 'Language', count: 18, categories: ['grammar', 'vocabulary', 'derivatives', 'mottoes', 'oral'] },
      { id: 'reading', label: 'Reading comprehension', count: 10, categories: ['reading'] }
    ],
    formatNote: 'A full Intermediate exam has 40 multiple-choice questions in about 45 minutes. This unofficial practice uses 12 Roman-world questions, 18 language questions, and a 10-question original passage.',
    syllabus: [
      { heading: 'Grammar for reading', items: [
        'All six indicative tenses, active and passive, including participles and present infinitives.',
        'Comparatives and superlatives, including bonus, magnus, and multus.',
        'Relative clauses, hic, ille, and reflexives.',
        'Commands dic, duc, fac, and fer, plus num and nonne.',
        'Idioms such as iter facere, in animo habere, and memoria tenere.'
      ] },
      { heading: 'Words and sayings', items: [
        'Derivatives such as omniscient, incredulous, benevolent, and introspection.',
        'Sayings such as caveat emptor, per aspera ad astra, status quo, and ars longa, vita brevis.',
        'Classroom phrases such as quid novi, surge, and mihi placet.'
      ] },
      { heading: 'Roman world', items: [
        'Seas and rivers: Adriatic, Aegean, Black Sea, Rhine, Po, Nile, and the Rubicon.',
        'People and events: Augustus, Hannibal, Caesar, Cleopatra, Antony, Spartacus, the Punic Wars, and Vesuvius.',
        'Heroes and monsters, the underworld, school life, baths, chariot racing, and gladiators.'
      ] }
    ]
  },
  {
    id: 'intermediate-reading',
    name: 'Intermediate Latin Reading Comprehension',
    legacyName: 'Latin II reading',
    years: [3],
    primaryYear: null,
    yearNote: 'Year 3. A reading exam bridging Latin II and authentic prose.',
    audience: 'Students who read adapted prose and can answer from the passage.',
    questionCount: 36,
    readingExam: true,
    timeLimitSeconds: NLE_TIME_LIMIT_SECONDS,
    sections: [
      { id: 'reading', label: 'Reading comprehension', count: 33, categories: ['reading'], allPassages: true },
      { id: 'extension', label: 'Passage extension', count: 3, categories: ['mythology', 'history', 'geography', 'culture'] }
    ],
    formatNote: 'The official exam has 36 questions drawn from two prose passages. A full original set for this level is still to come.',
    syllabus: [
      { heading: 'Reading grammar', items: [
        'Subjunctive uses that help reading: purpose, indirect command, indirect question, and cum clauses.',
        'Deponent verbs, gerunds, and indirect statement with past main verbs.',
        'Students still are not asked to label constructions by name, except on the advanced reading exam.'
      ] },
      { heading: 'Background in context', items: [
        'Republic and early Empire figures, Italian geography, and stories such as Daphne, Pygmalion, and Baucis and Philemon may appear when a passage calls for them.',
        'Calendar words such as Kalends, Nones, and Ides, and ceremonies such as weddings and triumphs, can appear the same way.'
      ] }
    ]
  },
  {
    id: 'advanced-prose',
    name: 'Advanced Latin Prose',
    legacyName: 'Latin III–IV prose',
    years: [3, 4],
    primaryYear: 4,
    yearNote: 'Years 3–4. For classes reading real Latin prose (Third Form and beyond).',
    audience: 'Students reading Caesar, Cicero, or similar prose.',
    questionCount: 40,
    readingExam: false,
    timeLimitSeconds: NLE_TIME_LIMIT_SECONDS,
    sections: [
      { id: 'culture', label: 'Culture, history, and literature', count: 12, categories: ['mythology', 'geography', 'culture', 'history'] },
      { id: 'language', label: 'Language', count: 18, categories: ['grammar', 'vocabulary', 'derivatives', 'mottoes', 'oral'] },
      { id: 'reading', label: 'Reading comprehension', count: 10, categories: ['reading'] }
    ],
    formatNote: 'The official exam has 40 questions, including an authentic or lightly adapted prose passage. This site currently offers the syllabus for this level rather than a full original exam.',
    syllabus: [
      { heading: 'Language', items: [
        'Subjunctive clauses common in prose: purpose, result, indirect question, cum, fearing, and conditions.',
        'Ablative absolute, deponents, gerunds, supines, and verbs such as utor and memini.',
        'Rhetorical devices common in prose, such as anaphora, tricolon, and litotes.',
        'Derivatives and sayings such as habeas corpus, de facto, and morituri te salutamus.'
      ] },
      { heading: 'Roman world', items: [
        'Lives and works of Caesar, Cicero, Livy, Pliny the Younger, and Tacitus.',
        'Late Republic and early Empire events, including Pharsalus and Philippi.',
        'Magistrates, social classes, the army, the calendar, and public religion.'
      ] }
    ]
  },
  {
    id: 'advanced-poetry',
    name: 'Advanced Latin Poetry',
    legacyName: 'Latin III–IV poetry',
    years: [4],
    primaryYear: null,
    yearNote: 'Year 4. For classes reading Latin poetry.',
    audience: 'Students reading Vergil, Ovid, Catullus, or Horace.',
    questionCount: 40,
    readingExam: false,
    timeLimitSeconds: NLE_TIME_LIMIT_SECONDS,
    sections: [
      { id: 'culture', label: 'Culture, history, and literature', count: 12, categories: ['mythology', 'geography', 'culture', 'history'] },
      { id: 'language', label: 'Language', count: 18, categories: ['grammar', 'vocabulary', 'derivatives', 'mottoes', 'oral'] },
      { id: 'reading', label: 'Reading comprehension', count: 10, categories: ['reading'] }
    ],
    formatNote: 'The official exam has 40 questions and a poetry passage. Scansion of dactylic hexameter and elegiac couplet belongs to this level. A full original set is a follow-up.',
    syllabus: [
      { heading: 'Poetry language', items: [
        'The prose grammar of the advanced level, plus poetic forms, syncopated verbs, and Greek accusatives such as Aenean.',
        'Dactylic hexameter and the elegiac couplet: dactyl, spondee, and elision.',
        'Devices such as metaphor, simile, chiasmus, and onomatopoeia.'
      ] },
      { heading: 'Authors and stories', items: [
        'Vergil, Horace, Ovid, Catullus, and the comic poets Plautus and Terence.',
        'Trojan War stories and transformations such as Orpheus and Eurydice or Pyramus and Thisbe.',
        'Ideas such as pietas, and places poets name, such as Ithaca and Delphi.'
      ] }
    ]
  },
  {
    id: 'advanced-reading',
    name: 'Advanced Latin Reading Comprehension',
    legacyName: 'Latin III–IV reading',
    years: [4],
    primaryYear: null,
    yearNote: 'Year 4. One prose passage and one poetry passage.',
    audience: 'Advanced readers, including students approaching authentic prose and verse.',
    questionCount: 36,
    readingExam: true,
    timeLimitSeconds: NLE_TIME_LIMIT_SECONDS,
    sections: [
      { id: 'reading', label: 'Reading comprehension', count: 33, categories: ['reading'], allPassages: true },
      { id: 'extension', label: 'Passage extension', count: 3, categories: ['mythology', 'history', 'geography', 'culture'] }
    ],
    formatNote: 'The official exam has 36 questions on two authentic passages, one prose and one poetry. This site does not yet include an original advanced reading exam.',
    syllabus: [
      { heading: 'What is asked', items: [
        'Comprehension of real Latin from authors such as Cicero, Livy, Horace, Ovid, and Pliny, and sometimes later Latin.',
        'This is the level that may ask students to recognize grammatical constructions.',
        'Greek authors such as Homer may appear as background for a Latin passage.'
      ] }
    ]
  }
];

function getNleLevel(levelId) {
  return NLE_LEVELS.find((level) => level.id === levelId) || null;
}

function getNleCategory(categoryId) {
  return NLE_CATEGORIES.find((category) => category.id === categoryId) || null;
}

function getSuggestedNleLevelId(year) {
  const numericYear = Number(year);
  const match = NLE_LEVELS.find((level) => level.primaryYear === numericYear);
  return match ? match.id : null;
}

function createNleRng(seed) {
  let state = (Number(seed) || 1) >>> 0;
  // Mix the seed before the first draw. A plain LCG gives nearly the same
  // first value for seeds 1, 2, 3, which would keep picking the same story.
  state = (Math.imul(state ^ 0x9e3779b9, 0x85ebca6b) + 0x6c078965) >>> 0;
  return function nleRandom() {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function shuffleNle(items, random = Math.random) {
  const copy = items.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = copy[index];
    copy[index] = copy[swapIndex];
    copy[swapIndex] = current;
  }
  return copy;
}

function withShuffledChoices(question, random) {
  return {
    ...question,
    choices: shuffleNle(question.choices, random)
  };
}

function nleQuestion(id, level, category, prompt, choices, answer, explanation, extra) {
  const data = extra || {};
  return {
    id,
    level,
    category,
    section: data.section || NLE_CATEGORY_SECTION[category] || 'language',
    prompt,
    choices,
    answer,
    explanation,
    passageId: data.passageId || null,
    storyId: data.storyId || null,
    order: Number.isFinite(data.order) ? data.order : null,
    context: data.context || '',
    glossary: data.glossary || null
  };
}

function getNlePassage(passageId) {
  return NLE_PASSAGES.find((passage) => passage.id === passageId) || null;
}

function questionsForPassage(passageId, category) {
  return NLE_QUESTIONS
    .filter((question) => question.passageId === passageId && (!category || question.category === category))
    .slice()
    .sort((left, right) => (left.order || 0) - (right.order || 0));
}

function drawBalancedQuestions(pool, categories, count, random) {
  const groups = categories.map((category) => shuffleNle(
    pool.filter((question) => question.category === category),
    random
  ));
  const picked = [];
  const seen = new Set();
  let round = 0;
  while (picked.length < count) {
    let added = false;
    groups.forEach((group) => {
      const question = group[round];
      if (!question || seen.has(question.id) || picked.length >= count) return;
      seen.add(question.id);
      picked.push(question);
      added = true;
    });
    if (!added) break;
    round += 1;
  }
  return picked;
}

function storyBlocksForSection(levelId, section) {
  const pool = NLE_QUESTIONS.filter((question) => (
    question.level === levelId
    && question.storyId
    && !question.passageId
    && section.categories.includes(question.category)
  ));
  const grouped = new Map();
  pool.forEach((question) => {
    if (!grouped.has(question.storyId)) grouped.set(question.storyId, []);
    grouped.get(question.storyId).push(question);
  });
  return [...grouped.values()]
    .map((questions) => questions.slice().sort((left, right) => (left.order || 0) - (right.order || 0)))
    .filter((questions) => questions.length >= section.count);
}

function standalonePool(levelId, section) {
  return NLE_QUESTIONS.filter((question) => (
    question.level === levelId
    && section.categories.includes(question.category)
    && !question.passageId
    && !question.storyId
  ));
}

function buildNleExam(levelId, random = Math.random) {
  const level = getNleLevel(levelId);
  if (!level || typeof NLE_QUESTIONS === 'undefined') return null;
  const questions = [];
  const languageSection = level.sections.find((section) => section.useStory);
  const storyChoices = languageSection ? storyBlocksForSection(levelId, languageSection) : [];
  const selectedStory = storyChoices.length ? shuffleNle(storyChoices, random)[0] : null;
  const storyId = selectedStory?.[0]?.storyId || null;
  let passage = null;

  level.sections.forEach((section) => {
    if (section.id === 'reading') {
      let passages = NLE_PASSAGES.filter((item) => item.level === levelId);
      if (storyId) {
        const matched = passages.filter((item) => item.storyId === storyId);
        if (matched.length) passages = matched;
      }
      const orderedPassages = section.allPassages ? shuffleNle(passages, random) : [shuffleNle(passages, random)[0]].filter(Boolean);
      const reading = [];
      orderedPassages.forEach((item) => {
        if (!item || reading.length >= section.count) return;
        const group = questionsForPassage(item.id, 'reading');
        reading.push(...group.slice(0, section.count - reading.length));
        if (!passage) passage = item;
      });
      questions.push(...reading.map((question) => withShuffledChoices(question, random)));
      return;
    }

    if (section.id === 'extension') {
      const passageIds = new Set(questions.map((question) => question.passageId).filter(Boolean));
      const pool = NLE_QUESTIONS.filter((question) => (
        question.level === levelId
        && question.section === 'extension'
        && (!passageIds.size || passageIds.has(question.passageId))
      ));
      const picked = shuffleNle(pool, random).slice(0, section.count);
      questions.push(...picked.map((question) => withShuffledChoices(question, random)));
      return;
    }

    if (section.useStory && selectedStory) {
      questions.push(...selectedStory.slice(0, section.count).map((question) => withShuffledChoices(question, random)));
      return;
    }

    const pool = standalonePool(levelId, section);
    const picked = shuffleNle(drawBalancedQuestions(pool, section.categories, section.count, random), random);
    questions.push(...picked.map((question) => withShuffledChoices(question, random)));
  });

  const ids = questions.map((question) => question.id);
  return {
    levelId,
    targetCount: level.questionCount,
    timeLimitSeconds: level.timeLimitSeconds,
    complete: questions.length === level.questionCount && new Set(ids).size === ids.length,
    passage,
    storyId,
    questions
  };
}

function buildNlePracticeSet(levelId, category, count = 10, random = Math.random) {
  const pool = NLE_QUESTIONS.filter((question) => question.level === levelId && question.category === category);
  if (category === 'reading') {
    const passageIds = shuffleNle([...new Set(pool.map((question) => question.passageId).filter(Boolean))], random);
    const ordered = [];
    passageIds.forEach((passageId) => {
      if (ordered.length >= count) return;
      ordered.push(...questionsForPassage(passageId, 'reading').slice(0, count - ordered.length));
    });
    return ordered.map((question) => withShuffledChoices(question, random));
  }
  return shuffleNle(pool, random).slice(0, count).map((question) => withShuffledChoices(question, random));
}

function scoreNleExam(questions, answersById) {
  const answers = answersById && typeof answersById === 'object' ? answersById : {};
  const categories = {};
  const sections = {};
  const missed = [];
  let correct = 0;
  questions.forEach((question) => {
    const selected = typeof answers[question.id] === 'string' ? answers[question.id] : '';
    const isCorrect = selected === question.answer;
    if (isCorrect) correct += 1;
    [categories, sections].forEach((bucket, index) => {
      const key = index === 0 ? question.category : question.section;
      if (!bucket[key]) bucket[key] = { correct: 0, total: 0 };
      bucket[key].total += 1;
      if (isCorrect) bucket[key].correct += 1;
    });
    if (!isCorrect) {
      missed.push({
        id: question.id,
        prompt: question.prompt,
        context: question.context || '',
        choices: question.choices.slice(),
        selected,
        answer: question.answer,
        explanation: question.explanation,
        category: question.category,
        section: question.section,
        passageId: question.passageId || null
      });
    }
  });
  const total = questions.length;
  return {
    correct,
    total,
    percent: total ? Math.round((correct / total) * 100) : 0,
    categories,
    sections,
    missed
  };
}

function summarizeNleBank() {
  const summary = {};
  NLE_LEVELS.forEach((level) => {
    const questions = NLE_QUESTIONS.filter((question) => question.level === level.id);
    const byCategory = {};
    NLE_CATEGORIES.forEach((category) => {
      byCategory[category.id] = questions.filter((question) => question.category === category.id).length;
    });
    summary[level.id] = {
      total: questions.length,
      byCategory,
      passages: NLE_PASSAGES.filter((passage) => passage.level === level.id).length
    };
  });
  return summary;
}

function nonNegativeCount(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.round(number);
}

function normalizeNleExamRecord(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return null;
  const total = nonNegativeCount(entry.total);
  if (!total || !getNleLevel(entry.levelId)) return null;
  const categories = {};
  if (entry.categories && typeof entry.categories === 'object') {
    Object.entries(entry.categories).forEach(([categoryId, stats]) => {
      if (!getNleCategory(categoryId) || !stats || typeof stats !== 'object') return;
      categories[categoryId] = {
        correct: nonNegativeCount(stats.correct),
        total: nonNegativeCount(stats.total)
      };
    });
  }
  const missed = Array.isArray(entry.missed) ? entry.missed.slice(0, 40).map((item) => {
    if (!item || typeof item !== 'object') return null;
    return {
      id: typeof item.id === 'string' ? item.id : '',
      prompt: typeof item.prompt === 'string' ? item.prompt : '',
      context: typeof item.context === 'string' ? item.context : '',
      choices: Array.isArray(item.choices) ? item.choices.filter((choice) => typeof choice === 'string').slice(0, 4) : [],
      selected: typeof item.selected === 'string' ? item.selected : '',
      answer: typeof item.answer === 'string' ? item.answer : '',
      explanation: typeof item.explanation === 'string' ? item.explanation : '',
      category: typeof item.category === 'string' ? item.category : '',
      section: typeof item.section === 'string' ? item.section : '',
      passageId: typeof item.passageId === 'string' ? item.passageId : null
    };
  }).filter(Boolean) : [];
  return {
    id: typeof entry.id === 'string' ? entry.id : `nle-${entry.levelId}`,
    completedAt: typeof entry.completedAt === 'string' ? entry.completedAt : '',
    mode: entry.mode === 'practice' ? 'practice' : 'exam',
    levelId: entry.levelId,
    category: typeof entry.category === 'string' ? entry.category : '',
    correct: Math.min(total, nonNegativeCount(entry.correct)),
    total,
    percent: nonNegativeCount(entry.percent),
    secondsUsed: nonNegativeCount(entry.secondsUsed),
    categories,
    missed
  };
}

function normalizeNleProgress(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const levelsIn = source.levels && typeof source.levels === 'object' && !Array.isArray(source.levels) ? source.levels : {};
  const levels = {};
  Object.entries(levelsIn).forEach(([levelId, entry]) => {
    if (!getNleLevel(levelId) || !entry || typeof entry !== 'object') return;
    const statsIn = entry.categoryStats && typeof entry.categoryStats === 'object' ? entry.categoryStats : {};
    const categoryStats = {};
    Object.entries(statsIn).forEach(([categoryId, stats]) => {
      if (!getNleCategory(categoryId) || !stats || typeof stats !== 'object') return;
      categoryStats[categoryId] = {
        attempts: nonNegativeCount(stats.attempts),
        correct: nonNegativeCount(stats.correct),
        sessions: nonNegativeCount(stats.sessions)
      };
    });
    const exams = Array.isArray(entry.exams)
      ? entry.exams.slice(-6).map(normalizeNleExamRecord).filter(Boolean)
      : [];
    levels[levelId] = { categoryStats, exams };
  });
  return { levels };
}

function validateNleContent() {
  const errors = [];
  const ids = new Set();
  if (typeof NLE_QUESTIONS === 'undefined' || typeof NLE_PASSAGES === 'undefined') {
    return ['question bank is not loaded'];
  }
  NLE_QUESTIONS.forEach((question) => {
    if (!question?.id || ids.has(question.id)) errors.push(`duplicate or missing id ${question?.id}`);
    ids.add(question.id);
    if (!Array.isArray(question.choices) || question.choices.length !== 4) errors.push(`${question.id} needs 4 choices`);
    else if (new Set(question.choices).size !== 4) errors.push(`${question.id} has repeated choices`);
    if (!question.choices?.includes(question.answer)) errors.push(`${question.id} answer is not one of the choices`);
    if (!question.prompt || question.prompt.length < 8) errors.push(`${question.id} prompt is too short`);
    if (!question.explanation || question.explanation.length < 12) errors.push(`${question.id} explanation is too short`);
    if (!getNleLevel(question.level)) errors.push(`${question.id} has an unknown level`);
    if (!getNleCategory(question.category)) errors.push(`${question.id} has an unknown category`);
    if (question.passageId && !getNlePassage(question.passageId)) errors.push(`${question.id} points at a missing passage`);
    if (question.category === 'reading' && !question.passageId) errors.push(`${question.id} is reading without a passage`);
  });
  NLE_PASSAGES.forEach((passage) => {
    if (!passage.latin || !passage.title || !getNleLevel(passage.level)) errors.push(`passage ${passage.id} is incomplete`);
    const reading = questionsForPassage(passage.id, 'reading');
    if (!reading.length) errors.push(`passage ${passage.id} has no reading questions`);
  });
  ['intro', 'beginning', 'intermediate'].forEach((levelId) => {
    for (let seed = 1; seed <= 6; seed += 1) {
      const exam = buildNleExam(levelId, createNleRng(seed));
      if (!exam?.complete) errors.push(`${levelId} seed ${seed} is incomplete (${exam?.questions.length || 0})`);
      const reading = exam?.questions.filter((question) => question.section === 'reading') || [];
      const passageIds = new Set(reading.map((question) => question.passageId));
      if (passageIds.size !== 1) errors.push(`${levelId} seed ${seed} used ${passageIds.size} passages`);
      const orders = reading.map((question) => question.order);
      const sorted = orders.slice().sort((left, right) => left - right);
      if (orders.join(',') !== sorted.join(',')) errors.push(`${levelId} seed ${seed} reading questions are out of order`);
      if (levelId === 'intro' && exam?.storyId && exam.passage && exam.passage.storyId !== exam.storyId) {
        errors.push(`${levelId} seed ${seed} passage does not continue the language story`);
      }
    }
  });
  return errors;
}

globalThis.NLE_DISCLAIMER = NLE_DISCLAIMER;
globalThis.NLE_LINKS = NLE_LINKS;
globalThis.NLE_LEVELS = NLE_LEVELS;
globalThis.NLE_QUESTIONS = NLE_QUESTIONS;
globalThis.NLE_TIME_LIMIT_SECONDS = NLE_TIME_LIMIT_SECONDS;
