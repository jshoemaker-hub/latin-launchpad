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
  },
  {
    id: 'alma-mater',
    latin: 'Alma mater',
    meaning: 'nourishing mother',
    note: 'A traditional way to refer to the school where someone studied.',
    linkedWords: ['schola', 'magister', 'liber'],
    minGrade: 4,
    icon: 'A'
  },
  {
    id: 'ante-bellum',
    latin: 'Ante bellum',
    meaning: 'before the war',
    note: 'The source of the English word "antebellum."',
    linkedWords: ['bellum'],
    minGrade: 5,
    icon: 'B'
  },
  {
    id: 'civis-romanus-sum',
    latin: 'Civis Romanus sum',
    meaning: 'I am a Roman citizen',
    note: 'A proud statement of Roman citizenship and its legal protections.',
    linkedWords: ['civis'],
    minGrade: 5,
    icon: 'C'
  },
  {
    id: 'hannibal-ad-portas',
    latin: 'Hannibal ad portas',
    meaning: 'Hannibal is at the gates',
    note: 'A Roman warning that serious danger was very near.',
    linkedWords: ['porta', 'bellum', 'exercitus'],
    minGrade: 5,
    icon: 'H'
  },
  {
    id: 'magister-dixit',
    latin: 'Magister dixit',
    meaning: 'the teacher has spoken',
    note: 'A phrase about accepting a teacher or authority as the final word.',
    linkedWords: ['magister', 'doceo'],
    minGrade: 4,
    icon: 'M'
  },
  {
    id: 'mare-nostrum',
    latin: 'Mare Nostrum',
    meaning: 'Our Sea',
    note: 'A Roman name for the Mediterranean Sea.',
    linkedWords: ['navis', 'nauta', 'portus'],
    minGrade: 5,
    icon: 'M'
  },
  {
    id: 'ora-et-labora',
    latin: 'Ora et labora',
    meaning: 'pray and work',
    note: 'A compact motto joining reflection with steady effort.',
    linkedWords: ['laboro', 'opus'],
    minGrade: 4,
    icon: 'O'
  },
  {
    id: 'pax-romana',
    latin: 'Pax Romana',
    meaning: 'Roman Peace',
    note: 'The name for a long period of relative stability in the Roman Empire.',
    linkedWords: ['pax', 'imperium'],
    minGrade: 6,
    icon: 'P'
  },
  {
    id: 'roma-aeterna',
    latin: 'Roma Aeterna',
    meaning: 'Eternal Rome',
    note: 'A title expressing the idea that Rome would endure forever.',
    linkedWords: ['urbs', 'civitas'],
    minGrade: 6,
    icon: 'R'
  },
  {
    id: 'senatus-populusque-romanus',
    latin: 'Senatus Populusque Romanus',
    meaning: 'the Senate and People of Rome',
    note: 'Often abbreviated S.P.Q.R. on Roman public monuments and inscriptions.',
    linkedWords: ['senatus', 'civis'],
    minGrade: 5,
    icon: 'S'
  },
  {
    id: 'video-et-taceo',
    latin: 'Video et taceo',
    meaning: 'I see and am silent',
    note: 'A short motto built from two first-person verbs.',
    linkedWords: ['video', 'oculus'],
    minGrade: 5,
    icon: 'V'
  },
  {
    id: 'ab-urbe-condita',
    latin: 'Ab Urbe Condita',
    meaning: 'from the founding of the city',
    note: 'The title of Livy\'s history and a Roman way of dating years from Rome\'s founding.',
    linkedWords: ['urbs', 'civitas', 'fabula'],
    minGrade: 6,
    icon: 'U'
  },
  {
    id: 'mea-culpa',
    latin: 'Mea culpa',
    meaning: 'my fault',
    note: 'A direct way to acknowledge responsibility for a mistake.',
    linkedWords: ['culpa'],
    minGrade: 4,
    icon: 'M'
  },
  {
    id: 'anno-domini',
    latin: 'Anno Domini',
    meaning: 'in the year of the Lord',
    note: 'The phrase behind the calendar abbreviation A.D.',
    linkedWords: ['annus', 'tempus'],
    minGrade: 5,
    icon: 'A'
  },
  {
    id: 'caput-mundi',
    latin: 'Caput Mundi',
    meaning: 'head of the world',
    note: 'A title presenting Rome as the center of the ancient world.',
    linkedWords: ['caput', 'mundus', 'urbs'],
    minGrade: 5,
    icon: 'C'
  },
  {
    id: 'cave-canem',
    latin: 'Cave canem',
    meaning: 'beware of the dog',
    note: 'A warning famously found in Roman house mosaics.',
    linkedWords: ['canis', 'caveo', 'casa'],
    minGrade: 3,
    icon: 'C'
  },
  {
    id: 'docere-delectare-movere',
    latin: 'Docere, delectare, movere',
    meaning: 'to teach, to delight, to move',
    note: 'Three traditional aims of effective speaking and writing.',
    linkedWords: ['doceo', 'moveo', 'orator'],
    minGrade: 6,
    icon: 'D'
  },
  {
    id: 'errare-est-humanum',
    latin: 'Errare est humanum',
    meaning: 'to err is human',
    note: 'A reminder that making mistakes is part of being human.',
    linkedWords: ['homo', 'sum'],
    minGrade: 5,
    icon: 'E'
  },
  {
    id: 'fortes-fortuna-iuvat',
    latin: 'Fortes fortuna iuvat',
    meaning: 'fortune helps the brave',
    note: 'A proverb connecting courage with opportunity; juvat is a common alternate spelling.',
    linkedWords: ['fortuna', 'fortis'],
    minGrade: 5,
    icon: 'F'
  },
  {
    id: 'mater-italiae-roma',
    latin: 'Mater Italiae Roma',
    meaning: 'Rome, mother of Italy',
    note: 'A compact phrase connecting Rome with the Italian peninsula.',
    linkedWords: ['mater', 'urbs', 'patria'],
    minGrade: 5,
    icon: 'R'
  },
  {
    id: 'nunc-aut-numquam',
    latin: 'Nunc aut numquam',
    meaning: 'now or never',
    note: 'A concise call to act without delay.',
    linkedWords: ['nunc', 'numquam'],
    minGrade: 6,
    icon: 'N'
  },
  {
    id: 'quattuor-anni-tempora',
    latin: 'Quattuor anni tempora',
    meaning: 'the four seasons of the year',
    note: 'A phrase joining number and time vocabulary.',
    linkedWords: ['quattuor', 'annus', 'tempus'],
    minGrade: 5,
    icon: 'IV'
  },
  {
    id: 'rex-regum',
    latin: 'Rex Regum',
    meaning: 'King of Kings',
    note: 'A superlative royal title formed with rex and the genitive plural regum.',
    linkedWords: ['rex', 'regnum'],
    minGrade: 6,
    icon: 'R'
  },
  {
    id: 'semper-fidelis',
    latin: 'Semper fidelis',
    meaning: 'always faithful',
    note: 'A widely used motto often shortened to Semper Fi.',
    linkedWords: ['semper', 'fides'],
    minGrade: 6,
    icon: 'S'
  },
  {
    id: 'stabat-mater',
    latin: 'Stabat Mater',
    meaning: 'the mother was standing',
    note: 'The opening words and title of a medieval Latin hymn.',
    linkedWords: ['mater', 'sto'],
    minGrade: 7,
    icon: 'M'
  },
  {
    id: 'a-mari-usque-ad-mare',
    latin: 'A mari usque ad mare',
    meaning: 'from sea to sea',
    note: 'The national motto of Canada and a useful contrast of prepositions.',
    linkedWords: ['mare', 'a / ab', 'ad'],
    minGrade: 6,
    icon: 'M'
  },
  {
    id: 'ager-vaticanus',
    latin: 'Ager Vaticanus',
    meaning: 'the Vatican Field',
    note: 'The ancient name for the area on the west side of the Tiber associated with Vatican City.',
    linkedWords: ['ager', 'campus', 'urbs'],
    minGrade: 5,
    icon: 'V'
  },
  {
    id: 'amicus-in-necessitate',
    latin: 'Amicus in necessitate probatur',
    meaning: 'a friend is proven in time of need',
    note: 'A proverb about recognizing dependable friendship.',
    linkedWords: ['amicus', 'socius'],
    minGrade: 6,
    icon: 'A'
  },
  {
    id: 'ars-longa-vita-brevis',
    latin: 'Ars longa, vita brevis',
    meaning: 'art is long, life is short',
    note: 'A reflection on the time required to master a craft.',
    linkedWords: ['ars', 'vita', 'tempus'],
    minGrade: 7,
    icon: 'A'
  },
  {
    id: 'aut-viam-inveniam',
    latin: 'Aut viam inveniam aut faciam',
    meaning: 'I shall either find a way or make one',
    note: 'A determined motto traditionally associated with Hannibal.',
    linkedWords: ['via', 'invenio', 'facio'],
    minGrade: 7,
    icon: 'V'
  },
  {
    id: 'capitur-urbs',
    latin: 'Capitur urbs quae totum cepit orbem',
    meaning: 'the city which captured the world is captured',
    note: 'A lament associated with Jerome after the sack of Rome in A.D. 410.',
    linkedWords: ['capio', 'urbs', 'mundus'],
    minGrade: 8,
    icon: 'U'
  },
  {
    id: 'dictum-et-factum',
    latin: 'Dictum et factum',
    meaning: 'said and done',
    note: 'A compact pairing of speech with completed action.',
    linkedWords: ['dico', 'facio'],
    minGrade: 7,
    icon: 'D'
  },
  {
    id: 'ego-sum-via',
    latin: 'Ego sum via et veritas et vita',
    meaning: 'I am the way, the truth, and the life',
    note: 'A line from the Latin Vulgate of the Gospel of John.',
    linkedWords: ['ego', 'via', 'veritas', 'vita'],
    minGrade: 7,
    icon: 'E'
  },
  {
    id: 'et-tu-brute',
    latin: 'Et tu, Brute?',
    meaning: 'you too, Brutus?',
    note: 'A famous dramatic line associated with Caesar recognizing betrayal.',
    linkedWords: ['amicus', 'Caesar'],
    minGrade: 6,
    icon: 'E'
  },
  {
    id: 'ferrum-ferro-exacuitur',
    latin: 'Ferrum ferro exacuitur',
    meaning: 'iron is sharpened by iron',
    note: 'A proverb that also illustrates the ablative of means.',
    linkedWords: ['ferrum', 'scutum'],
    minGrade: 7,
    icon: 'F'
  },
  {
    id: 'festina-lente',
    latin: 'Festina lente',
    meaning: 'make haste slowly',
    note: 'A paradoxical motto advising purposeful but careful action.',
    linkedWords: ['festino'],
    minGrade: 5,
    icon: 'F'
  },
  {
    id: 'in-hoc-signo-vinces',
    latin: 'In hoc signo vinces',
    meaning: 'in this sign you will conquer',
    note: 'A phrase traditionally connected with Constantine before the Milvian Bridge battle.',
    linkedWords: ['signum', 'vinco', 'victoria'],
    minGrade: 7,
    icon: 'S'
  },
  {
    id: 'noscitur-ex-sociis',
    latin: 'Noscitur ex sociis',
    meaning: 'a person is known by their companions',
    note: 'A proverb about the company a person keeps.',
    linkedWords: ['socius', 'amicus', 'e / ex'],
    minGrade: 7,
    icon: 'N'
  },
  {
    id: 'quid-novi',
    latin: 'Quid novi?',
    meaning: 'what is new?',
    note: 'A short conversational question, much like "What\'s new?"',
    linkedWords: ['quid?', 'novus'],
    minGrade: 6,
    icon: 'Q'
  },
  {
    id: 'repetitio-mater-studiorum',
    latin: 'Repetitio mater studiorum',
    meaning: 'repetition is the mother of learning',
    note: 'A classroom motto about the value of steady review.',
    linkedWords: ['mater', 'studeo', 'schola'],
    minGrade: 4,
    icon: 'R'
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
