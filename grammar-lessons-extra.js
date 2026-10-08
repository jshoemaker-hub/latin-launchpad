// Roman numerals, and meter practiced on two public-domain lines.
// Ovid, Metamorphoses 1.89–90. The Latin is public domain. The questions are original.

SYNTAX_GRAMMAR_LESSONS.push(
  {
    id: 'grade6-grammar-roman-numerals',
    grade: 6,
    kind: 'grammar',
    series: 'intermediate',
    title: 'Grade 6 Grammar: Roman Numerals and Number Words',
    description: 'Review I through X from Year 3, then read the larger signs through M and count to twenty.',
    sourceNote: 'Original classroom lesson. The number lists were written for this course.',
    focus: ['Roman numerals', 'cardinals', 'ordinals'],
    explain: [
      'Roman numerals build from seven signs: I is 1, V is 5, X is 10, L is 50, C is 100, D is 500, and M is 1000. A smaller sign before a larger one subtracts: IV is 4, IX is 9, XL is 40, XC is 90, CD is 400, and CM is 900. A smaller sign after adds: VI is 6, XI is 11, and LX is 60.',
      'Cardinals count. Learn unus, duo, tres, quattuor, quinque, sex, septem, octo, novem, decem, undecim, duodecim, tredecim, quattuordecim, quindecim, sedecim, septendecim, duodeviginti, undeviginti, viginti, then centum and mille. Ordinals put things in a line: primus, secundus, tertius, quartus, quintus, sextus, septimus, octavus, nonus, decimus. Duodeviginti means two from twenty, which is 18. Undeviginti is 19.'
    ],
    examples: [
      { latin: 'XIV', english: '14', note: 'X and then IV: ten plus four.' },
      { latin: 'XL', english: '40', note: 'Ten before fifty subtracts.' },
      { latin: 'CM', english: '900', note: 'One hundred before one thousand subtracts.' },
      { latin: 'duodeviginti', english: '18', note: 'Two taken from twenty.' },
      { latin: 'decimus', english: 'tenth', note: 'An ordinal, not the cardinal decem.' }
    ],
    words: [
      { latin: 'XIV', english: '14', emoji: 'X', prompt: 'What number is XIV?', choices: ['14', '16', '41', '9'], hint: 'IV after X adds four to ten.', explanation: 'X is 10 and IV is 4, so XIV is 14.' },
      { latin: 'XL', english: '40', emoji: 'L', prompt: 'What number is XL?', choices: ['40', '60', '15', '110'], hint: 'A smaller sign before a larger one subtracts.', explanation: 'X before L means 50 minus 10.' },
      { latin: 'C', english: '100', emoji: 'C', prompt: 'What number is C?', choices: ['100', '50', '500', '1000'], hint: 'C is the sign for a hundred. D is five hundred.', explanation: 'C means 100. M means 1000.' },
      { latin: 'M', english: '1000', emoji: 'M', prompt: 'Which sign means 1000?', choices: ['M', 'D', 'C', 'L'], hint: 'M is the largest of the seven basic signs.', explanation: 'M is 1000. D is 500.' },
      { latin: 'duodeviginti', english: '18', emoji: '18', prompt: 'Duodeviginti means', choices: ['18', '19', '12', '20'], hint: 'Duo means two, and it is taken away from twenty.', explanation: 'Duodeviginti is two from twenty, so 18. Undeviginti is 19.' },
      { latin: 'decimus', english: 'tenth', emoji: '10', prompt: 'Which word is the ordinal tenth?', choices: ['decimus', 'decem', 'centum', 'mille'], hint: 'Decem is the cardinal ten. The ordinal ends in -us here.', explanation: 'Decimus means tenth. Decem means ten.' }
    ]
  },
  {
    id: 'grade8-grammar-hexameter-lines',
    grade: 8,
    kind: 'grammar',
    series: 'meter',
    title: 'Grade 8 Grammar: Hexameter on Real Lines',
    description: 'Name the feet, the pause, and a repeated pattern in two lines of Ovid.',
    sourceNote: 'Lines from Ovid, Metamorphoses 1.89–90, public domain. The notes and questions were written for this course.',
    focus: ['dactyl', 'spondee', 'caesura'],
    explain: [
      'A dactylic hexameter has six feet. A dactyl is long-short-short. A spondee is long-long. The fifth foot is usually a dactyl, and the sixth foot is a spondee or a trochee. Students can mark the longs and shorts before they try to recite.',
      'Elision happens when a vowel, or a vowel plus m, at the end of a word is slurred into a vowel at the start of the next word. A caesura is a word-pause inside a foot, often in the third foot. The lines below are the opening of Ovid\'s golden age. Nondum, "not yet," is repeated at the start of later lines in the same passage. That repetition is anaphora.'
    ],
    examples: [
      { latin: 'Aurea prima sata est aetas, quae vindice nullo,', english: 'The first age sown was golden, with no avenger,', note: 'Ovid, Metamorphoses 1.89.' },
      { latin: 'sponte sua, sine lege fidem rectumque colebat.', english: 'of its own accord, without law, it kept faith and right.', note: 'Ovid, Metamorphoses 1.90. Sponte sua is an ablative of manner.' },
      { latin: 'long-short-short', english: 'a dactyl', note: 'The name dactyl comes from the finger: one long joint and two short ones.' },
      { latin: 'nondum ... nondum', english: 'anaphora', note: 'The same word begins successive lines later in this passage.' }
    ],
    words: [
      { latin: 'hexameter', english: 'six feet', emoji: '6', prompt: 'How many feet are in a dactylic hexameter?', choices: ['six feet', 'five feet', 'four feet', 'two feet'], hint: 'Hex- means six.', explanation: 'A hexameter line has six feet.' },
      { latin: 'dactyl', english: 'long-short-short', emoji: 'D', prompt: 'A dactyl is', choices: ['long-short-short', 'long-long', 'short-long', 'short-short-long'], hint: 'Think of a finger: one long bone and two short ones.', explanation: 'A dactyl is one long syllable and two short syllables.' },
      { latin: 'spondee', english: 'long-long', emoji: 'S', prompt: 'A spondee is', choices: ['long-long', 'long-short-short', 'short-short', 'short-long'], hint: 'Both syllables are heavy.', explanation: 'A spondee is two long syllables.' },
      { latin: 'elision', english: 'a final vowel is slurred', emoji: 'E', prompt: 'Elision happens when', choices: ['a final vowel is slurred', 'two consonants begin a word', 'a line has five feet', 'a noun is ablative'], hint: 'The vowel at the end gives way to the vowel that follows.', explanation: 'A vowel, or a vowel plus m, at the end of a word can be slurred before a following vowel.' },
      { latin: 'caesura', english: 'a pause inside a foot', emoji: 'C', prompt: 'A caesura is', choices: ['a pause inside a foot', 'the last foot of the line', 'a short syllable', 'a repeated word'], hint: 'It is a cut in the line, often in the third foot.', explanation: 'A caesura is a word-pause that falls inside a foot.' },
      { latin: 'nondum', english: 'anaphora', emoji: 'A', prompt: 'Repeating nondum at the start of successive lines is', choices: ['anaphora', 'elision', 'a spondee', 'a locative'], hint: 'The device is repetition at the beginning.', explanation: 'Anaphora repeats a word at the start of successive phrases or lines. Ovid does this with nondum in the golden-age passage.' }
    ]
  }
);
