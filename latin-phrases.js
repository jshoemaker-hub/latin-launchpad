const LATIN_PHRASE_SOURCES = [
  {
    name: 'Wordopedia popular phrase list',
    url: 'https://wordopedia.org/latin-phrases-still-used'
  },
  {
    name: 'Wikipedia full Latin phrase list',
    url: 'https://en.wikipedia.org/wiki/List_of_Latin_phrases_(full)'
  }
];

const LATIN_PHRASES = [
  {
    id: 'ad-astra',
    latin: 'Ad astra',
    meaning: 'to the stars',
    note: 'A short motto for reaching high goals.',
    linkedWords: ['astrum', 'stella'],
    icon: '*'
  },
  {
    id: 'per-aspera-ad-astra',
    latin: 'Per aspera ad astra',
    meaning: 'through difficulties to the stars',
    note: 'A motto about reaching great goals through hard work.',
    linkedWords: ['astrum', 'stella'],
    icon: '*'
  },
  {
    id: 'tempus-fugit',
    latin: 'Tempus fugit',
    meaning: 'time flies',
    note: 'A reminder not to waste the day.',
    linkedWords: ['tempus', 'hora', 'annus'],
    icon: 'T'
  },
  {
    id: 'carpe-diem',
    latin: 'Carpe diem',
    meaning: 'seize the day',
    note: 'A famous encouragement to use the present moment well.',
    linkedWords: ['dies'],
    icon: 'D'
  },
  {
    id: 'cogito-ergo-sum',
    latin: 'Cogito, ergo sum',
    meaning: 'I think, therefore I am',
    note: 'A philosophy phrase made famous by Rene Descartes.',
    linkedWords: ['cogito', 'ratio', 'sapiens'],
    minGrade: 6,
    icon: '?'
  },
  {
    id: 'in-medias-res',
    latin: 'In medias res',
    meaning: 'into the middle of things',
    note: 'A story starts in the action, then fills in the background.',
    linkedWords: ['res', 'fabula'],
    icon: 'R'
  },
  {
    id: 'veni-vidi-vici',
    latin: 'Veni, vidi, vici',
    meaning: 'I came, I saw, I conquered',
    note: 'A concise victory report traditionally linked with Julius Caesar.',
    linkedWords: ['venio', 'video', 'victoria', 'victor'],
    minGrade: 5,
    icon: 'V'
  },
  {
    id: 'amor-vincit-omnia',
    latin: 'Amor vincit omnia',
    meaning: 'love conquers all',
    note: 'A famous motto about love as a strong force.',
    linkedWords: ['amor', 'amo'],
    icon: 'A'
  },
  {
    id: 'verba-volant',
    latin: 'Verba volant, scripta manent',
    meaning: 'spoken words fly away, written words remain',
    note: 'A proverb about why writing matters.',
    linkedWords: ['verbum', 'scripta', 'scribo', 'maneo'],
    minGrade: 5,
    icon: 'W'
  },
  {
    id: 'acta-non-verba',
    latin: 'Acta non verba',
    meaning: 'deeds, not words',
    note: 'A motto that values action over talk.',
    linkedWords: ['verbum', 'opus', 'opera'],
    minGrade: 5,
    icon: '!'
  },
  {
    id: 'bona-fide',
    latin: 'Bona fide',
    meaning: 'in good faith',
    note: 'Still used for something genuine or sincere.',
    linkedWords: ['fides'],
    minGrade: 5,
    icon: 'F'
  },
  {
    id: 'scientia-potentia-est',
    latin: 'Scientia potentia est',
    meaning: 'knowledge is power',
    note: 'A school-friendly aphorism linking learning and strength.',
    linkedWords: ['scientia', 'potentia'],
    minGrade: 5,
    icon: 'S'
  },
  {
    id: 'virtus-et-scientia',
    latin: 'Virtus et scientia',
    meaning: 'virtue and knowledge',
    note: 'A motto pairing character with learning.',
    linkedWords: ['virtus', 'scientia'],
    minGrade: 5,
    icon: 'V'
  },
  {
    id: 'si-vis-pacem',
    latin: 'Si vis pacem, para bellum',
    meaning: 'if you want peace, prepare for war',
    note: 'A famous proverb for discussing preparation and peace.',
    linkedWords: ['vis', 'pax', 'paro', 'bellum'],
    minGrade: 6,
    icon: 'P'
  },
  {
    id: 'pax-vobiscum',
    latin: 'Pax vobiscum',
    meaning: 'peace be with you',
    note: 'A traditional greeting or blessing centered on peace.',
    linkedWords: ['pax'],
    minGrade: 6,
    icon: 'P'
  },
  {
    id: 'via-media',
    latin: 'Via media',
    meaning: 'the middle way',
    note: 'A phrase for a balanced path between extremes.',
    linkedWords: ['via'],
    icon: '='
  },
  {
    id: 'res-publica',
    latin: 'Res publica',
    meaning: 'the public thing; the commonwealth',
    note: 'The phrase behind "republic," useful for civic Latin.',
    linkedWords: ['respublica', 'res'],
    minGrade: 5,
    icon: 'R'
  },
  {
    id: 'ex-libris',
    latin: 'Ex libris',
    meaning: 'from the books of',
    note: 'A bookplate phrase showing who owns a book.',
    linkedWords: ['liber', 'libellus', 'codex', 'bibliotheca'],
    icon: 'L'
  },
  {
    id: 'terra-firma',
    latin: 'Terra firma',
    meaning: 'solid ground',
    note: 'A phrase used for dry land or reliable footing.',
    linkedWords: ['terra', 'humus'],
    icon: 'T'
  },
  {
    id: 'ad-lucem',
    latin: 'Ad lucem',
    meaning: 'toward the light',
    note: 'A common educational motto.',
    linkedWords: ['lumen', 'lucerna'],
    minGrade: 4,
    icon: 'L'
  },
  {
    id: 'dulce-decorum',
    latin: 'Dulce et decorum est pro patria mori',
    meaning: 'it is sweet and fitting to die for one\'s homeland',
    note: 'A famous line often studied critically in literature and history.',
    linkedWords: ['decor', 'patria'],
    minGrade: 7,
    icon: 'D'
  },
  {
    id: 'fortuna-favet',
    latin: 'Fortuna favet fortibus',
    meaning: 'fortune favors the brave',
    note: 'A compact proverb about courage and luck.',
    linkedWords: ['fortuna'],
    minGrade: 5,
    icon: 'F'
  },
  {
    id: 'dum-spiro-spero',
    latin: 'Dum spiro, spero',
    meaning: 'while I breathe, I hope',
    note: 'A hopeful motto that pairs endurance with hope.',
    linkedWords: ['spero', 'spes'],
    minGrade: 4,
    icon: 'H'
  },
  {
    id: 'ad-oculos',
    latin: 'Ad oculos',
    meaning: 'to the eyes; plainly visible',
    note: 'A phrase for something shown directly.',
    linkedWords: ['oculus'],
    icon: 'O'
  },
  {
    id: 'acta-est-fabula',
    latin: 'Acta est fabula',
    meaning: 'the play is over',
    note: 'A theater phrase tied to Roman performance endings.',
    linkedWords: ['fabula', 'theatrum'],
    icon: 'F'
  }
];

function normalizeLatinPhraseTerm(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

function getPhraseFocusForLesson(grade, lessonWords, maxPhrases = 2) {
  const lessonWordMap = new Map();
  lessonWords.forEach((word) => {
    lessonWordMap.set(normalizeLatinPhraseTerm(word.latin), word);
  });

  return LATIN_PHRASES
    .filter((phrase) => grade >= (phrase.minGrade || 3) && grade <= (phrase.maxGrade || 8))
    .map((phrase, index) => {
      const matchedWords = phrase.linkedWords
        .map((word) => lessonWordMap.get(normalizeLatinPhraseTerm(word)))
        .filter(Boolean);
      return {
        ...phrase,
        matchedWords,
        matchScore: matchedWords.length,
        sortIndex: index
      };
    })
    .filter((phrase) => phrase.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore || a.sortIndex - b.sortIndex)
    .slice(0, maxPhrases)
    .map(({ matchScore, sortIndex, ...phrase }) => phrase);
}

function getPhraseQuestionsForLesson(phrases) {
  return phrases.map((phrase) => {
    const choices = LATIN_PHRASES
      .filter((candidate) => candidate.id !== phrase.id)
      .map((candidate) => candidate.meaning)
      .slice(0, 3);

    return {
      latin: phrase.latin,
      english: phrase.meaning,
      preview: phrase.latin,
      previewAnswer: phrase.meaning,
      emoji: phrase.icon,
      context: `Popular phrase linked to: ${getPhraseMatchedWordText(phrase)}.`,
      explanation: `${phrase.note} Linked word bank terms: ${getPhraseMatchedWordText(phrase)}.`,
      choices,
      masteryKey: `phrase:${phrase.id}`,
      isPhrase: true,
      excludeFromPuzzles: true
    };
  });
}

function getPhraseMatchedWordText(phrase) {
  if (!Array.isArray(phrase.matchedWords) || phrase.matchedWords.length === 0) return 'today\'s word bank';
  return phrase.matchedWords
    .map((word) => `${word.latin} (${word.english})`)
    .join(', ');
}
