// Recognition lessons for Years 2 and 3, plus a few Year 4A lessons that move past the review.
// Original classroom sentences. Old lesson ids stay in grammar-lessons.js.

function earlyGrammarWord(latin, english, prompt, choices, hint, explanation) {
  return {
    latin,
    english,
    emoji: '•',
    prompt,
    choices,
    hint,
    explanation
  };
}

function insertGrammarLessonAfter(afterId, lesson) {
  const index = GRAMMAR_LESSONS.findIndex((item) => item.id === afterId);
  if (index < 0) GRAMMAR_LESSONS.push(lesson);
  else GRAMMAR_LESSONS.splice(index + 1, 0, lesson);
}

const EARLY_GRAMMAR_LESSONS = [
  {
    id: 'grade4-grammar-little-words',
    grade: 4,
    kind: 'grammar',
    title: 'Grade 4 Grammar: Little Words in a Phrase',
    description: 'Learn ad, in, cum, and ex as whole phrases. The case rules come later.',
    sourceNote: 'Original classroom lesson. The phrases were written for this course.',
    focus: ['ad and in as chunks', 'cum and ex as chunks', 'phrase meaning'],
    explain: [
      'Some little Latin words are easier to learn inside a phrase. Ad villam means to the house. In silva means in the woods. Cum patre means with father. Ex aqua means out of the water.',
      'Do not memorize a case chart yet. Learn the phrase as a chunk. Year 4A will sort these words by the ending that follows them.'
    ],
    examples: [
      { latin: 'ad villam', english: 'to the house', note: 'Ad points toward a place.' },
      { latin: 'in silva', english: 'in the woods', note: 'This in means inside a place.' },
      { latin: 'cum patre', english: 'with father', note: 'Cum means with.' },
      { latin: 'ex aqua', english: 'out of the water', note: 'Ex means out of.' }
    ],
    words: [
      earlyGrammarWord('ad villam', 'to the house', 'What does ad villam mean?', ['to the house', 'in the house', 'with the house', 'the house runs'], 'Ad points toward something.', 'Ad villam is the chunk for to the house.'),
      earlyGrammarWord('in silva', 'in the woods', 'What does in silva mean?', ['in the woods', 'to the woods', 'without the woods', 'the woods see'], 'This phrase tells where someone is.', 'In silva means in the woods.'),
      earlyGrammarWord('cum patre', 'with father', 'Cum patre means', ['with father', 'from father', 'to the father', 'father sees'], 'Cum is the little word for with.', 'Cum patre means with father.'),
      earlyGrammarWord('ex aqua', 'out of the water', 'What does ex aqua mean?', ['out of the water', 'into the water', 'with the water', 'the water is good'], 'Ex means out of.', 'Ex aqua means out of the water.'),
      earlyGrammarWord('ad silvam', 'to the woods', 'Ad silvam means', ['to the woods', 'in the woods', 'with the woods', 'the woods are many'], 'Ad is the same little word as in ad villam.', 'Ad silvam means to the woods.'),
      earlyGrammarWord('cum amico', 'with a friend', 'What does cum amico mean?', ['with a friend', 'without a friend', 'to a friend', 'a friend runs'], 'Cum means with, as in cum patre.', 'Cum amico means with a friend.')
    ]
  },
  {
    id: 'grade4-grammar-ego-tu',
    grade: 4,
    kind: 'grammar',
    title: 'Grade 4 Grammar: I, You, and Who',
    description: 'Meet ego, tu, nos, vos, quis, and quid as the words for I, you, and who.',
    sourceNote: 'Original classroom lesson. The sentences were written for this course.',
    focus: ['ego and tu', 'nos and vos', 'quis and quid'],
    explain: [
      'Ego means I. Tu means you, speaking to one person. Nos means we. Vos means you all. The verb ending already tells who acts, so these words add a clear subject.',
      'Quis asks who. Quid asks what. Me and te, meaning me and you as the receiver, can wait. This lesson asks only for the subject words and the two question words.'
    ],
    examples: [
      { latin: 'Ego sum.', english: 'I am.', note: 'Ego is I.' },
      { latin: 'Tu es.', english: 'You are.', note: 'Tu is you, one person.' },
      { latin: 'Nos sumus.', english: 'We are.', note: 'Nos is we.' },
      { latin: 'Quis est?', english: 'Who is it?', note: 'Quis asks who.' }
    ],
    words: [
      earlyGrammarWord('ego', 'I', 'What does ego mean?', ['I', 'you', 'we', 'who'], 'Ego is the word a person uses for himself or herself.', 'Ego means I.'),
      earlyGrammarWord('tu', 'you, one person', 'Tu means', ['you, one person', 'you all', 'they', 'what'], 'Tu speaks to one person.', 'Tu means you, speaking to one person.'),
      earlyGrammarWord('nos', 'we', 'What does nos mean?', ['we', 'I', 'you all', 'who'], 'Nos is more than one person, including the speaker.', 'Nos means we.'),
      earlyGrammarWord('vos', 'you all', 'Vos means', ['you all', 'you, one person', 'I', 'what'], 'Vos speaks to more than one person.', 'Vos means you all.'),
      earlyGrammarWord('quis', 'who', 'Quis asks', ['who', 'what', 'where', 'I'], 'Quis is a question word for a person.', 'Quis means who.'),
      earlyGrammarWord('quid', 'what', 'What does quid ask?', ['what', 'who', 'with', 'you all'], 'Quid is a question word for a thing.', 'Quid means what.')
    ]
  },
  {
    id: 'grade5-grammar-of-and-to',
    grade: 5,
    kind: 'grammar',
    title: 'Grade 5 Grammar: Of and To',
    description: 'Recognize of and to on puella and servus. A full chart of endings waits until Year 4A.',
    sourceNote: 'Original classroom lesson. The sentences were written for this course.',
    focus: ['of the girl', 'to the girl', 'of the servant and to the servant'],
    explain: [
      'Liber puellae means the girl\'s book, the book of the girl. Puellae donum dat means he gives a gift to the girl. The same ending can do both jobs. The other words in the phrase tell you which job it is.',
      'Servus changes more clearly. Cibus servi means the food of the servant. Servo aquam dat means he gives water to the servant. Learn these four phrases. Do not fill in a whole noun chart yet.'
    ],
    examples: [
      { latin: 'liber puellae', english: 'the girl\'s book', note: 'Of the girl.' },
      { latin: 'Puellae donum dat.', english: 'He gives a gift to the girl.', note: 'To the girl.' },
      { latin: 'cibus servi', english: 'the servant\'s food', note: 'Of the servant.' },
      { latin: 'Servo aquam dat.', english: 'He gives water to the servant.', note: 'To the servant.' }
    ],
    words: [
      earlyGrammarWord('liber puellae', 'the girl\'s book', 'What does liber puellae mean?', ['the girl\'s book', 'he gives a book to the girl', 'the girl sees the book', 'the books are many'], 'Liber is the book. Puellae here means of the girl.', 'Liber puellae means the girl\'s book.'),
      earlyGrammarWord('Puellae donum dat.', 'He gives a gift to the girl.', 'Puellae donum dat means', ['He gives a gift to the girl.', 'The girl\'s gift runs.', 'He sees the girl\'s house.', 'The girl gives a gift to the boy.'], 'Dat means he gives. The girl is the receiver.', 'Puellae donum dat means he gives a gift to the girl.'),
      earlyGrammarWord('cibus servi', 'the servant\'s food', 'What does cibus servi mean?', ['the servant\'s food', 'he gives food to the servant', 'the servant eats now', 'the food is in the woods'], 'Servi here means of the servant.', 'Cibus servi means the servant\'s food.'),
      earlyGrammarWord('Servo aquam dat.', 'He gives water to the servant.', 'Servo aquam dat means', ['He gives water to the servant.', 'The servant\'s water is cold.', 'The servant gives water.', 'He sees the servant\'s house.'], 'Servo is to the servant. Dat means he gives.', 'Servo aquam dat means he gives water to the servant.'),
      earlyGrammarWord('villa puellae', 'the girl\'s house', 'Villa puellae means', ['the girl\'s house', 'he gives a house to the girl', 'the girl is in the house', 'to the house'], 'This phrase is like liber puellae.', 'Villa puellae means the girl\'s house.'),
      earlyGrammarWord('Puellae aquam dat.', 'He gives water to the girl.', 'What does Puellae aquam dat mean?', ['He gives water to the girl.', 'The girl\'s water is in the house.', 'The girl carries water.', 'He sees the girl.'], 'The pattern matches Puellae donum dat.', 'Puellae aquam dat means he gives water to the girl.')
    ]
  },
  {
    id: 'grade5-grammar-with-from',
    grade: 5,
    kind: 'grammar',
    title: 'Grade 5 Grammar: With and From',
    description: 'Read with, from, in, and without as phrases. Year 4A names the case.',
    sourceNote: 'Original classroom lesson. The phrases were written for this course.',
    focus: ['with and without', 'out of and away from', 'in a place'],
    explain: [
      'These phrases answer with whom, from where, or where. Cum amico means with a friend. Sine cibo means without food. Ex villa means out of the house. A patre means from father. In silva means in the woods.',
      'The ending after the little word is part of the chunk. You do not need the name of that ending yet.'
    ],
    examples: [
      { latin: 'cum amico', english: 'with a friend', note: 'Cum means with.' },
      { latin: 'ex villa', english: 'out of the house', note: 'Ex means out of.' },
      { latin: 'a patre', english: 'from father', note: 'A here means from.' },
      { latin: 'sine cibo', english: 'without food', note: 'Sine means without.' }
    ],
    words: [
      earlyGrammarWord('cum amico', 'with a friend', 'What does cum amico mean?', ['with a friend', 'from a friend', 'without a friend', 'the friend runs'], 'Cum means with.', 'Cum amico means with a friend.'),
      earlyGrammarWord('ex villa', 'out of the house', 'Ex villa means', ['out of the house', 'into the house', 'with the house', 'the house is big'], 'Ex means out of.', 'Ex villa means out of the house.'),
      earlyGrammarWord('in silva', 'in the woods', 'What does in silva mean?', ['in the woods', 'out of the woods', 'to the woods', 'without the woods'], 'This in tells where someone is.', 'In silva means in the woods.'),
      earlyGrammarWord('ab aqua', 'away from the water', 'Ab aqua means', ['away from the water', 'into the water', 'with the water', 'the water is good'], 'Ab means away from.', 'Ab aqua means away from the water.'),
      earlyGrammarWord('sine cibo', 'without food', 'What does sine cibo mean?', ['without food', 'with food', 'out of the food', 'he gives food'], 'Sine means without.', 'Sine cibo means without food.'),
      earlyGrammarWord('a patre', 'from father', 'A patre means', ['from father', 'with father', 'to father', 'father sees'], 'A before a consonant means from.', 'A patre means from father.')
    ]
  },
  {
    id: 'grade5-grammar-was-doing',
    grade: 5,
    kind: 'grammar',
    title: 'Grade 5 Grammar: Was Doing',
    description: 'Recognize was and used to on amo-type verbs, plus erat and erant. The future waits.',
    sourceNote: 'Original classroom lesson. The sentences were written for this course.',
    focus: ['-bat', 'erat', 'erant'],
    explain: [
      'Amat means he loves, or she loves. Amabat means he was loving, or he used to love. The same -bat ending works on other verbs of this family: portabat, he was carrying.',
      'Est means he is. Erat means he was. Erant means they were. This lesson does not ask for will love or for every verb family.'
    ],
    examples: [
      { latin: 'amabat', english: 'he was loving', note: '-bat means was or used to.' },
      { latin: 'portabat', english: 'she was carrying', note: 'Same ending, another verb.' },
      { latin: 'erat', english: 'he was', note: 'The was form of est.' },
      { latin: 'erant', english: 'they were', note: 'More than one.' }
    ],
    words: [
      earlyGrammarWord('amabat', 'he was loving', 'What does amabat mean?', ['he was loving', 'he loves', 'he will love', 'love!'], 'Look for -bat.', 'Amabat means he was loving, or he used to love.'),
      earlyGrammarWord('portabat', 'she was carrying', 'Portabat means', ['she was carrying', 'she carries', 'she will carry', 'to carry'], 'Portat means she carries. The extra -ba- makes it was.', 'Portabat means she was carrying.'),
      earlyGrammarWord('erat', 'he was', 'What does erat mean?', ['he was', 'he is', 'they were', 'he will be'], 'Erat is the was form of est.', 'Erat means he was, or she was.'),
      earlyGrammarWord('erant', 'they were', 'Erant means', ['they were', 'he was', 'they are', 'they will be'], 'The plural of erat is erant.', 'Erant means they were.'),
      earlyGrammarWord('cantabat', 'she was singing', 'What does cantabat mean?', ['she was singing', 'she sings', 'she will sing', 'to sing'], 'Cantat means she sings.', 'Cantabat means she was singing.'),
      earlyGrammarWord('Puella erat bona.', 'The girl was good.', 'Puella erat bona means', ['The girl was good.', 'The girl is good.', 'The girls were good.', 'The girl will be good.'], 'Erat means was.', 'Puella erat bona means the girl was good.')
    ]
  },
  {
    id: 'grade5-grammar-do-and-to-do',
    grade: 5,
    kind: 'grammar',
    title: 'Grade 5 Grammar: Do! and To Do',
    description: 'Tell a singular command from the to-form. Plural commands wait until Year 4A.',
    sourceNote: 'Original classroom lesson. The sentences were written for this course.',
    focus: ['singular command', 'present infinitive', 'one verb family'],
    explain: [
      'Ama! tells one person to love. Porta! tells one person to carry. The to-form adds -re: amare means to love, and portare means to carry.',
      'Amat, he loves, is different from both. Ama! is a command. Amare is the to-form. This lesson uses commands to one person only.'
    ],
    examples: [
      { latin: 'Ama!', english: 'Love!', note: 'A command to one person.' },
      { latin: 'amare', english: 'to love', note: 'The to-form.' },
      { latin: 'Porta!', english: 'Carry!', note: 'Another command to one person.' },
      { latin: 'portare', english: 'to carry', note: 'The to-form of porta.' }
    ],
    words: [
      earlyGrammarWord('Ama!', 'Love!', 'Ama! means', ['Love!', 'to love', 'he loves', 'he was loving'], 'The exclamation tells one person to act.', 'Ama! is a command to one person: love!'),
      earlyGrammarWord('Porta!', 'Carry!', 'What does Porta! mean?', ['Carry!', 'to carry', 'she carries', 'she was carrying'], 'Same kind of command as Ama!', 'Porta! tells one person to carry.'),
      earlyGrammarWord('amare', 'to love', 'Amare means', ['to love', 'Love!', 'he loves', 'they love'], 'The to-form ends in -re.', 'Amare means to love.'),
      earlyGrammarWord('portare', 'to carry', 'What does portare mean?', ['to carry', 'Carry!', 'she carries', 'she was carrying'], 'Compare Porta! with portare.', 'Portare means to carry.'),
      earlyGrammarWord('Specta!', 'Look!', 'Specta! means', ['Look!', 'to look', 'he looks', 'he was looking'], 'Spectat means he looks. Specta! is the command.', 'Specta! tells one person to look.'),
      earlyGrammarWord('spectare', 'to look', 'Spectare means', ['to look', 'Look!', 'he looks', 'they look'], 'The to-form of specta ends in -re.', 'Spectare means to look.')
    ]
  },
  {
    id: 'grade5-grammar-bonus-puella',
    grade: 5,
    kind: 'grammar',
    title: 'Grade 5 Grammar: A Good Girl',
    description: 'Match bonus to puella, puer, and donum in the subject form and the receiver form.',
    sourceNote: 'Original classroom lesson. The sentences were written for this course.',
    focus: ['nominative agreement', 'accusative agreement', 'three genders'],
    explain: [
      'A describing word matches the word it describes. Puella bona means a good girl, as the one who acts. Puellam bonam is a good girl when she receives the action. Both words change together.',
      'Puer bonus is a good boy. Puerum bonum is a good boy receiving the action. Donum bonum is a good gift, and the gift form looks the same when it acts and when it receives. Other cases of the describing word come in Year 4A.'
    ],
    examples: [
      { latin: 'puella bona', english: 'a good girl', note: 'She is the one who acts.' },
      { latin: 'puellam bonam', english: 'a good girl, receiving the action', note: 'Both words take -am.' },
      { latin: 'puer bonus', english: 'a good boy', note: 'Bonus matches puer.' },
      { latin: 'donum bonum', english: 'a good gift', note: 'The gift uses -um.' }
    ],
    words: [
      earlyGrammarWord('puella bona', 'a good girl', 'What does puella bona mean?', ['a good girl', 'a good boy', 'a good gift', 'to a good girl'], 'Bona matches puella.', 'Puella bona means a good girl, the one who can act.'),
      earlyGrammarWord('puellam bonam', 'a good girl, receiving the action', 'Puellam bonam means', ['a good girl, receiving the action', 'a good girl who acts', 'a good boy', 'the girl\'s good gift'], 'Both words end in -am.', 'Puellam bonam is a good girl as the receiver.'),
      earlyGrammarWord('puer bonus', 'a good boy', 'What does puer bonus mean?', ['a good boy', 'a good girl', 'a good gift', 'to a good boy'], 'Bonus matches puer.', 'Puer bonus means a good boy.'),
      earlyGrammarWord('puerum bonum', 'a good boy, receiving the action', 'Puerum bonum means', ['a good boy, receiving the action', 'a good boy who acts', 'a good girl', 'of a good boy'], 'Both words end in -um here.', 'Puerum bonum is a good boy as the receiver.'),
      earlyGrammarWord('donum bonum', 'a good gift', 'Donum bonum means', ['a good gift', 'a good girl', 'a good boy', 'he gives a gift'], 'Donum and bonum share -um.', 'Donum bonum means a good gift.'),
      earlyGrammarWord('Puella bona cantat.', 'The good girl sings.', 'What does Puella bona cantat mean?', ['The good girl sings.', 'He sees the good girl.', 'The good boy sings.', 'The girl was good.'], 'Puella bona is the one who sings.', 'Puella bona cantat means the good girl sings.')
    ]
  },
  {
    id: 'grade5-grammar-rex-pater',
    grade: 5,
    kind: 'grammar',
    title: 'Grade 5 Grammar: King and Father',
    description: 'Recognize the subject and receiver forms of rex, miles, pater, and nomen. The full chart waits.',
    sourceNote: 'Original classroom lesson. The sentences were written for this course.',
    focus: ['rex and regem', 'miles and militem', 'pater, patrem, and nomen'],
    explain: [
      'Rex means the king when he acts. Regem means the king when he receives the action. Miles and militem work the same way for the soldier. Pater and patrem do it for the father.',
      'Nomen, a name, looks the same when it acts and when it receives. Learn these pairs only. The of-form, such as regis, of the king, is not on this quiz.'
    ],
    examples: [
      { latin: 'Rex videt.', english: 'The king sees.', note: 'Rex is the one who acts.' },
      { latin: 'Regem videt.', english: 'He sees the king.', note: 'Regem is the receiver.' },
      { latin: 'Pater vocat.', english: 'The father calls.', note: 'Pater acts.' },
      { latin: 'nomen', english: 'the name', note: 'Same form as subject or receiver.' }
    ],
    words: [
      earlyGrammarWord('Rex videt.', 'The king sees.', 'What does Rex videt mean?', ['The king sees.', 'He sees the king.', 'The soldier sees.', 'The father sees.'], 'Rex is the one who acts.', 'Rex videt means the king sees.'),
      earlyGrammarWord('Regem videt.', 'He sees the king.', 'Regem videt means', ['He sees the king.', 'The king sees.', 'He sees the father.', 'The king was good.'], 'Regem is the king as receiver.', 'Regem videt means he sees the king.'),
      earlyGrammarWord('Miles currit.', 'The soldier runs.', 'What does Miles currit mean?', ['The soldier runs.', 'He sees the soldier.', 'The king runs.', 'The soldier was running.'], 'Miles is the one who runs.', 'Miles currit means the soldier runs.'),
      earlyGrammarWord('Militem videt.', 'He sees the soldier.', 'Militem videt means', ['He sees the soldier.', 'The soldier sees.', 'He sees the king.', 'The soldier calls.'], 'Militem is the receiver.', 'Militem videt means he sees the soldier.'),
      earlyGrammarWord('Patrem vocat.', 'He calls the father.', 'Patrem vocat means', ['He calls the father.', 'The father calls.', 'He calls the king.', 'The father was calling.'], 'Patrem is the father as receiver.', 'Patrem vocat means he calls the father.'),
      earlyGrammarWord('Nomen audit.', 'the name, as the thing heard', 'In Nomen audit, nomen is', ['the name, as the thing heard', 'the king', 'a command', 'of the father'], 'Nomen can be the receiver without changing its shape.', 'Nomen audit means he hears the name. Nomen does not grow an extra ending here.')
    ]
  },
  {
    id: 'grade5-grammar-one-to-ten',
    grade: 5,
    kind: 'grammar',
    title: 'Grade 5 Grammar: One to Ten',
    description: 'Count unus through decem, and read the numerals I through X. Larger signs stay in Year 4A.',
    sourceNote: 'Original classroom lesson. The number list was written for this course.',
    focus: ['unus through decem', 'I, V, and X', 'IV and IX'],
    explain: [
      'The counting words are unus, duo, tres, quattuor, quinque, sex, septem, octo, novem, decem. That is one through ten.',
      'The signs stop at ten in this lesson. I is 1, V is 5, and X is 10. IV is 4, one before five. IX is 9, one before ten. L, C, D, and M come in the Year 4A number lesson.'
    ],
    examples: [
      { latin: 'tres', english: 'three', note: 'A counting word.' },
      { latin: 'decem', english: 'ten', note: 'The last word in this list.' },
      { latin: 'V', english: '5', note: 'The sign for five.' },
      { latin: 'IX', english: '9', note: 'One before ten.' }
    ],
    words: [
      earlyGrammarWord('unus', 'one', 'What does unus mean?', ['one', 'two', 'ten', 'five'], 'Unus is the start of the list.', 'Unus means one.'),
      earlyGrammarWord('octo', 'eight', 'Octo means', ['eight', 'four', 'nine', 'three'], 'Octo comes after septem.', 'Octo means eight.'),
      earlyGrammarWord('decem', 'ten', 'What does decem mean?', ['ten', 'two', 'one hundred', 'twenty'], 'Decem is the tenth counting word.', 'Decem means ten. Centum, one hundred, is later.'),
      earlyGrammarWord('X', '10', 'What number is X?', ['10', '5', '1', '9'], 'X is the sign for ten.', 'X means 10. V means 5.'),
      earlyGrammarWord('IX', '9', 'IX means', ['9', '11', '4', '10'], 'I before X means one taken from ten.', 'IX is 9, one taken away from ten.'),
      earlyGrammarWord('IV', '4', 'What number is IV?', ['4', '6', '9', '15'], 'I before V means one taken from five.', 'IV is 4. VI, with I after V, would be 6.')
    ]
  }
];

insertGrammarLessonAfter('grade4-grammar-amo', EARLY_GRAMMAR_LESSONS[0]);
insertGrammarLessonAfter('grade4-grammar-little-words', EARLY_GRAMMAR_LESSONS[1]);
insertGrammarLessonAfter('grade5-grammar-declension-review', EARLY_GRAMMAR_LESSONS[2]);
insertGrammarLessonAfter('grade5-grammar-of-and-to', EARLY_GRAMMAR_LESSONS[3]);
insertGrammarLessonAfter('grade5-grammar-with-from', EARLY_GRAMMAR_LESSONS[4]);
insertGrammarLessonAfter('grade5-grammar-was-doing', EARLY_GRAMMAR_LESSONS[5]);
insertGrammarLessonAfter('grade5-grammar-do-and-to-do', EARLY_GRAMMAR_LESSONS[6]);
insertGrammarLessonAfter('grade5-grammar-bonus-puella', EARLY_GRAMMAR_LESSONS[7]);
insertGrammarLessonAfter('grade5-grammar-rex-pater', EARLY_GRAMMAR_LESSONS[8]);

const YEAR4A_MOVE_ON_LESSONS = [
  {
    id: 'grade6-grammar-have-done',
    grade: 6,
    kind: 'grammar',
    title: 'Grade 6 Grammar: I Have Loved',
    description: 'Learn the have-done forms of amo only. Other verbs keep this pattern for later.',
    sourceNote: 'Original classroom lesson. The forms were written for this course.',
    focus: ['perfect of amo', 'one verb', 'have or did'],
    explain: [
      'Amavi means I have loved, or I loved. The family is amavi, amavisti, amavit, amavimus, amavistis, amaverunt. Each form still tells who did it.',
      'This is one verb. Do not build the have-done forms of every conjugation in this lesson.'
    ],
    examples: [
      { latin: 'amavi', english: 'I have loved', note: 'The I form.' },
      { latin: 'amavit', english: 'he has loved', note: 'The he or she form.' },
      { latin: 'amavimus', english: 'we have loved', note: 'The we form.' },
      { latin: 'amaverunt', english: 'they have loved', note: 'The they form.' }
    ],
    words: [
      earlyGrammarWord('amavi', 'I have loved', 'What does amavi mean?', ['I have loved', 'you have loved', 'he has loved', 'to love'], 'Amavi is the I form.', 'Amavi means I have loved, or I loved.'),
      earlyGrammarWord('amavisti', 'you have loved', 'Amavisti means', ['you have loved', 'I have loved', 'we have loved', 'Love!'], 'The you form has -isti.', 'Amavisti means you have loved.'),
      earlyGrammarWord('amavit', 'he has loved', 'What does amavit mean?', ['he has loved', 'I have loved', 'they have loved', 'he was loving'], 'Amavit is he or she.', 'Amavit means he has loved, or she has loved.'),
      earlyGrammarWord('amavimus', 'we have loved', 'Amavimus means', ['we have loved', 'you all have loved', 'I have loved', 'we love'], 'The we form has -imus.', 'Amavimus means we have loved.'),
      earlyGrammarWord('amavistis', 'you all have loved', 'What does amavistis mean?', ['you all have loved', 'you have loved', 'they have loved', 'you all love'], 'Compare amavisti, one person, with amavistis.', 'Amavistis means you all have loved.'),
      earlyGrammarWord('amaverunt', 'they have loved', 'Amaverunt means', ['they have loved', 'he has loved', 'we have loved', 'they were loving'], 'The they form ends in -erunt.', 'Amaverunt means they have loved.')
    ]
  },
  {
    id: 'grade6-grammar-possum-noli',
    grade: 6,
    kind: 'grammar',
    title: 'Grade 6 Grammar: I Can and Do Not',
    description: 'Learn possum, potes, and potest, and the warning noli or nolite plus a to-form.',
    sourceNote: 'Original classroom lesson. The sentences were written for this course.',
    focus: ['possum', 'noli', 'nolite'],
    explain: [
      'Possum means I can. Potes means you can. Potest means he or she can. Non possum means I cannot.',
      'Noli timere tells one person, do not be afraid. Nolite currere tells more than one person, do not run. Noli and nolite borrow the to-form from Year 3. Volo, eo, and fero stay words to meet in a story, not charts in this lesson.'
    ],
    examples: [
      { latin: 'Possum ambulare.', english: 'I can walk.', note: 'Possum plus a to-form.' },
      { latin: 'Non possum.', english: 'I cannot.', note: 'Non makes it negative.' },
      { latin: 'Noli timere!', english: 'Do not be afraid!', note: 'To one person.' },
      { latin: 'Nolite currere!', english: 'Do not run!', note: 'To more than one person.' }
    ],
    words: [
      earlyGrammarWord('possum', 'I can', 'What does possum mean?', ['I can', 'you can', 'he can', 'do not'], 'Possum is the I form.', 'Possum means I can.'),
      earlyGrammarWord('potes', 'you can', 'Potes means', ['you can', 'I can', 'they can', 'to be able'], 'Potes speaks to one person.', 'Potes means you can.'),
      earlyGrammarWord('potest', 'he can', 'What does potest mean?', ['he can', 'I can', 'you all can', 'he was able'], 'Potest is he or she.', 'Potest means he can, or she can.'),
      earlyGrammarWord('Non possum.', 'I cannot.', 'Non possum means', ['I cannot.', 'I can.', 'Do not be afraid!', 'You cannot walk.'], 'Non turns possum negative.', 'Non possum means I cannot.'),
      earlyGrammarWord('Noli timere!', 'Do not be afraid!', 'Noli timere! means', ['Do not be afraid!', 'Do not be afraid, all of you!', 'I can be afraid.', 'He was afraid.'], 'Noli speaks to one person and takes a to-form.', 'Noli timere tells one person not to be afraid.'),
      earlyGrammarWord('Nolite currere!', 'Do not run!', 'Nolite currere! means', ['Do not run!', 'Do not run, one person only, with noli.', 'I can run.', 'They were running.'], 'Nolite is the form for more than one person.', 'Nolite currere tells more than one person not to run.')
    ]
  },
  {
    id: 'grade6-grammar-calling-names',
    grade: 6,
    kind: 'grammar',
    title: 'Grade 6 Grammar: Calling a Name',
    description: 'Use the calling form for Marcus, a girl, a son, a friend, and a servant.',
    sourceNote: 'Original classroom lesson. The sentences were written for this course.',
    focus: ['Marce', 'puella', 'fili'],
    explain: [
      'When you call someone, the name sometimes changes. Marcus becomes Marce. Filius, son, becomes fili. Puella, a girl, stays puella. Amica stays amica. Servus becomes serve.',
      'Learn these five calling forms. A chart for every noun family is not the goal of this lesson.'
    ],
    examples: [
      { latin: 'Marce!', english: 'Marcus!', note: 'The calling form drops -us and uses -e.' },
      { latin: 'fili!', english: 'son!', note: 'Filius becomes fili when you call him.' },
      { latin: 'puella!', english: 'girl!', note: 'This one does not change.' },
      { latin: 'serve!', english: 'servant!', note: 'Like Marce, with -e.' }
    ],
    words: [
      earlyGrammarWord('Marce!', 'Marce!', 'Which word calls Marcus?', ['Marce!', 'Marcus!', 'Marci!', 'Marcum!'], 'The calling form of Marcus is Marce.', 'Marce! is the form you use to call Marcus.'),
      earlyGrammarWord('puella!', 'puella!', 'The calling form of puella is', ['puella!', 'puellam!', 'puellae!', 'puellarum!'], 'A word like puella stays the same when you call her.', 'Puella! calls a girl.'),
      earlyGrammarWord('fili!', 'fili!', 'Which word calls a son?', ['fili!', 'filius!', 'filium!', 'filio!'], 'Filius changes to fili.', 'Fili! means son! when you are calling him.'),
      earlyGrammarWord('amica!', 'friend!', 'Amica! means', ['friend!', 'of the friend', 'to the friend', 'the friends'], 'Amica stays amica, like puella.', 'Amica! calls a friend.'),
      earlyGrammarWord('serve!', 'serve!', 'Which word calls a servant?', ['serve!', 'servus!', 'servi!', 'servo!'], 'Servus takes -e, like Marcus.', 'Serve! calls a servant.'),
      earlyGrammarWord('Salve, Marce!', 'Hello, Marcus!', 'Salve, Marce! means', ['Hello, Marcus!', 'Hello, son!', 'Marcus sees.', 'The servant says hello.'], 'Salve is hello to one person. Marce is the person called.', 'Salve, Marce! means hello, Marcus.')
    ]
  }
];

SYNTAX_GRAMMAR_LESSONS.push(...YEAR4A_MOVE_ON_LESSONS);
