const CLASSROOM_LATIN_PHRASES = [
  { id: 'salve', latin: 'Salve!', english: 'Hello!', category: 'greetings', minGrade: 3, note: 'Use this when greeting one person.' },
  { id: 'salvete', latin: 'Salvete!', english: 'Hello!', category: 'greetings', minGrade: 3, note: 'Use this when greeting more than one person.' },
  { id: 'vale', latin: 'Vale!', english: 'Goodbye!', category: 'greetings', minGrade: 3, note: 'Use this when saying goodbye to one person.' },
  { id: 'valete', latin: 'Valete!', english: 'Goodbye!', category: 'greetings', minGrade: 3, note: 'Use this when saying goodbye to more than one person.' },
  { id: 'quid-agis', latin: 'Quid agis?', english: 'How are you?', category: 'greetings', minGrade: 3, note: 'A question for one person.' },
  { id: 'valeo', latin: 'Valeo.', english: 'I am well.', category: 'greetings', minGrade: 3, note: 'A simple answer to Quid agis?' },
  { id: 'gratias', latin: 'Gratias tibi ago.', english: 'Thank you.', category: 'courtesy', minGrade: 3, note: 'Literally, "I give thanks to you."' },
  { id: 'nihil-est', latin: 'Nihil est.', english: 'You are welcome.', category: 'courtesy', minGrade: 3, note: 'Literally, "It is nothing."' },
  { id: 'quaeso', latin: 'Quaeso.', english: 'Please.', category: 'courtesy', minGrade: 3, note: 'A polite word used when making a request.' },
  { id: 'me-paenitet', latin: 'Me paenitet.', english: 'I am sorry.', category: 'courtesy', minGrade: 4, note: 'A useful expression for making an apology.' },
  { id: 'adsum', latin: 'Adsum.', english: 'I am here; present.', category: 'routines', minGrade: 3, note: 'A response during attendance.' },
  { id: 'sede', latin: 'Sede. / Sedete.', english: 'Sit down.', category: 'commands', minGrade: 3, note: 'Sede addresses one person; sedete addresses a group.' },
  { id: 'surge', latin: 'Surge. / Surgite.', english: 'Stand up.', category: 'commands', minGrade: 3, note: 'Surge addresses one person; surgite addresses a group.' },
  { id: 'aperi', latin: 'Aperi. / Aperite.', english: 'Open it.', category: 'commands', minGrade: 4, note: 'Aperi addresses one person; aperite addresses a group.' },
  { id: 'claude', latin: 'Claude. / Claudite.', english: 'Close it.', category: 'commands', minGrade: 4, note: 'Claude addresses one person; claudite addresses a group.' },
  { id: 'audite', latin: 'Audite diligenter.', english: 'Listen carefully.', category: 'commands', minGrade: 4, note: 'A command addressed to a group.' },
  { id: 'non-intellego', latin: 'Non intellego.', english: 'I do not understand.', category: 'help', minGrade: 3, note: 'Use this to ask for more explanation.' },
  { id: 'adiuva-me', latin: 'Adiuva me, quaeso.', english: 'Please help me.', category: 'help', minGrade: 3, note: 'A polite request for help.' },
  { id: 'explica', latin: 'Explica, quaeso.', english: 'Please explain.', category: 'help', minGrade: 5, note: 'A request to explain something again.' },
  { id: 'quid-dixisti', latin: 'Quid dixisti?', english: 'What did you say?', category: 'help', minGrade: 5, note: 'A listening check addressed to one person.' },
  { id: 'bene-actum', latin: 'Bene actum!', english: 'Well done!', category: 'feedback', minGrade: 3, note: 'Positive feedback after good work.' },
  { id: 'optime', latin: 'Optime!', english: 'Excellent!', category: 'feedback', minGrade: 3, note: 'An enthusiastic word of praise.' },
  { id: 'verum-falsum', latin: 'Verum aut falsum?', english: 'True or false?', category: 'feedback', minGrade: 4, note: 'A quick classroom check.' },
  { id: 'silentium', latin: 'Silentium, quaeso.', english: 'Silence, please.', category: 'routines', minGrade: 4, note: 'A polite request for quiet.' },
  { id: 'quid-nomen', latin: 'Quid est nomen tibi?', english: 'What is your name?', category: 'introductions', minGrade: 3, note: 'A question for introducing yourself to one person.' },
  { id: 'mihi-nomen', latin: 'Mihi nomen est ...', english: 'My name is ...', category: 'introductions', minGrade: 3, note: 'Complete the sentence with your name.' },
  { id: 'ignosce', latin: 'Ignosce mihi, quaeso.', english: 'Excuse me, please.', category: 'courtesy', minGrade: 5, note: 'A polite request to be excused or forgiven.' },
  { id: 'sodes', latin: 'Sodes.', english: 'Please.', category: 'courtesy', minGrade: 7, note: 'An older conversational form of please, originally shortened from si audes.' },
  { id: 'te-amo', latin: 'Te amo.', english: 'I love you.', category: 'courtesy', minGrade: 3, note: 'A simple expression of affection.' },
  { id: 'ita', latin: 'Ita.', english: 'Yes; so.', category: 'feedback', minGrade: 3, note: 'A short affirmative answer.' },
  { id: 'salvete-discipuli', latin: 'Salvete, discipuli!', english: 'Hello, students!', category: 'routines', minGrade: 3, note: 'A teacher greeting addressed to a group.' },
  { id: 'salve-magister', latin: 'Salve, magister! / Salve, magistra!', english: 'Hello, teacher!', category: 'routines', minGrade: 3, note: 'Use magister for a male teacher and magistra for a female teacher.' },
  { id: 'impossibile', latin: 'Impossibile est.', english: 'It is impossible.', category: 'feedback', minGrade: 5, note: 'A strong reaction to a difficult claim or task.' },
  { id: 'esne-confusus', latin: 'Esne confusus? / Esne confusa?', english: 'Are you puzzled?', category: 'help', minGrade: 5, note: 'Use confusus for a boy or man and confusa for a girl or woman.' },
  { id: 'responde-mihi', latin: 'Responde mihi.', english: 'Answer me.', category: 'commands', minGrade: 4, note: 'A teacher prompt addressed to one person.' },
  { id: 'scribe-verba', latin: 'Scribe haec verba.', english: 'Write these words.', category: 'commands', minGrade: 4, note: 'A classroom writing instruction.' },
  { id: 'fiat', latin: 'Fiat.', english: 'All right; let it be done.', category: 'feedback', minGrade: 6, note: 'A brief expression of agreement or permission.' },
  { id: 'de-hoc-satis', latin: 'De hoc satis!', english: 'Enough of this!', category: 'routines', minGrade: 6, note: 'A firm way to close a topic or activity.' },
  { id: 'collige-folia', latin: 'Collige folia.', english: 'Collect the papers.', category: 'commands', minGrade: 4, note: 'A classroom instruction addressed to one person.' },
  { id: 'quid-dixit', latin: 'Quid dixit?', english: 'What did he or she say?', category: 'help', minGrade: 5, note: 'A listening check about another speaker.' }
];

const CLASSROOM_LATIN_CATEGORIES = {
  all: 'All',
  greetings: 'Greetings',
  courtesy: 'Courtesy',
  introductions: 'Introductions',
  commands: 'Commands',
  help: 'Get help',
  feedback: 'Feedback',
  routines: 'Routines'
};

function getClassroomPhrasesForLesson(grade, lessonIndex = 0, count = 8) {
  const eligible = CLASSROOM_LATIN_PHRASES.filter((phrase) => grade >= (phrase.minGrade || 3));
  if (eligible.length <= count) return eligible;
  const start = (lessonIndex * count) % eligible.length;
  return Array.from({ length: count }, (_, offset) => eligible[(start + offset) % eligible.length]);
}
