// Intermediate grammar holes and the advanced-track syntax series.
// Original classroom lessons. Examples were written for this course.
const SYNTAX_GRAMMAR_LESSONS = [
  {
    id: 'grade8-grammar-impersonals',
    grade: 8,
    kind: 'grammar',
    series: 'intermediate',
    title: 'Grade 8 Grammar: Impersonal Verbs',
    description: 'Learn verbs that stay in the third person singular: oportet, decet, licet, videtur, and necesse est.',
    sourceNote: 'Original classroom lesson. The examples were written for this course.',
    focus: ['impersonal verbs', 'accusative or dative with an infinitive', 'third person singular'],
    explain: [
      'Some Latin verbs do not name a person who acts. They stay in the third-person singular and describe a situation. Oportet means it is right, or someone ought. Decet means it is fitting. Licet means it is allowed. Necesse est means it is necessary. Videtur means it seems.',
      'Oportet and decet take an accusative plus an infinitive: Oportet nos manere, we ought to stay. Licet and necesse est usually take a dative plus an infinitive: Licet tibi ludere, you may play. Do not hunt for a plural form. The impersonal verb itself does not become oportent.'
    ],
    examples: [
      { latin: 'Oportet nos manere.', english: 'We ought to stay.', note: 'Nos is accusative. Manere is the infinitive.' },
      { latin: 'Decet vos tacere.', english: 'It is fitting for you to be quiet.', note: 'Decet also takes the accusative plus an infinitive.' },
      { latin: 'Licet tibi ludere.', english: 'You may play.', note: 'Tibi is dative: it is allowed for you.' },
      { latin: 'Necesse est mihi exire.', english: 'I must leave.', note: 'Mihi is dative with necesse est.' },
      { latin: 'Videtur mihi.', english: 'It seems to me.', note: 'The dative shows whose opinion it is.' }
    ],
    words: [
      { latin: 'Oportet nos manere.', english: 'We ought to stay.', emoji: '!', prompt: 'What does Oportet nos manere mean?', choices: ['We ought to stay.', 'We were staying.', 'Stay, friends!', 'We must not stay.'], hint: 'Oportet means it is right or one ought, and it takes an infinitive.', explanation: 'Nos is accusative and manere is the infinitive: we ought to stay.' },
      { latin: 'Decet militem fortem esse.', english: 'It is fitting for a soldier to be brave.', emoji: '!', prompt: 'Which English matches Decet militem fortem esse?', choices: ['It is fitting for a soldier to be brave.', 'The soldier was brave.', 'A brave man leads the soldier.', 'It is not fitting to fight.'], hint: 'Decet means it is fitting and takes an accusative plus an infinitive.', explanation: 'Militem is the accusative person, and fortem esse is the infinitive phrase.' },
      { latin: 'Licet tibi ludere.', english: 'you may play.', emoji: '!', prompt: 'Licet tibi ludere means', choices: ['you may play.', 'you ought to work.', 'play the game!', 'you seemed to play.'], hint: 'Licet means it is allowed. Tibi is dative.', explanation: 'Licet takes the dative tibi and the infinitive ludere.' },
      { latin: 'Necesse est nobis discedere.', english: 'We must leave.', emoji: '!', prompt: 'What does Necesse est nobis discedere mean?', choices: ['We must leave.', 'We wanted to leave.', 'Leave at once!', 'They left us.'], hint: 'Necesse est means it is necessary.', explanation: 'Nobis is dative and discedere is the infinitive: it is necessary for us to leave.' },
      { latin: 'Videtur mihi.', english: 'it seems to me.', emoji: '!', prompt: 'Videtur mihi means', choices: ['it seems to me.', 'I see him.', 'he was seen yesterday.', 'see me!'], hint: 'Videtur is impersonal here: it seems. Mihi tells whose view it is.', explanation: 'The dative mihi marks the person to whom it seems.' },
      { latin: 'oportet', english: 'it stays third-person singular', emoji: '1', prompt: 'Why do students not look for a plural oportent in this pattern?', choices: ['it stays third-person singular', 'oportet has no infinitive', 'the dative is always plural', 'Latin has no third person'], hint: 'An impersonal verb describes a situation, not a group of doers.', explanation: 'Oportet, decet, licet, and videtur stay in the third-person singular.' }
    ]
  },
  {
    id: 'grade8-grammar-questions-commands',
    grade: 8,
    kind: 'grammar',
    series: 'intermediate',
    title: 'Grade 8 Grammar: Questions and Short Commands',
    description: 'Ask with num, nonne, and -ne, and learn the short commands dic, duc, fac, and fer.',
    sourceNote: 'Original classroom lesson. The examples were written for this course.',
    focus: ['num and nonne', 'the question particle -ne', 'dic, duc, fac, fer'],
    explain: [
      'Latin can show what answer a speaker expects. Nonne expects yes: Nonne solem vides? means you see the sun, do you not? Num expects no: Num times? means you are not afraid, are you? The little ending -ne asks an open question and does not lean toward yes or no: Videsne?',
      'Four common commands drop the final vowel of the singular imperative. Dic, duc, fac, and fer mean say, lead, do, and carry. The plural commands put the ending back in the ordinary way, except that fer uses ferte: dicite, ducite, facite, ferte.'
    ],
    examples: [
      { latin: 'Nonne solem vides?', english: 'You see the sun, do you not?', note: 'Nonne expects the answer yes.' },
      { latin: 'Num times?', english: 'You are not afraid, are you?', note: 'Num expects the answer no.' },
      { latin: 'Videsne?', english: 'Do you see?', note: '-ne asks an open question.' },
      { latin: 'Dic! Duc! Fac! Fer!', english: 'Say! Lead! Do! Carry!', note: 'These four singular commands drop the final e.' },
      { latin: 'Ferte aquam.', english: 'Carry the water, all of you.', note: 'The plural of fer is ferte.' }
    ],
    words: [
      { latin: 'Nonne solem vides?', english: 'yes', emoji: '?', prompt: 'What answer does Nonne solem vides? expect?', choices: ['yes', 'no', 'either yes or no, with no lean', 'a command, not an answer'], hint: 'Nonne leans toward yes.', explanation: 'Nonne marks a question that expects the answer yes.' },
      { latin: 'Num times?', english: 'no', emoji: '?', prompt: 'What answer does Num times? expect?', choices: ['no', 'yes', 'either yes or no, with no lean', 'a plural command'], hint: 'Num leans toward no.', explanation: 'Num marks a question that expects the answer no.' },
      { latin: 'Videsne?', english: 'either yes or no', emoji: '?', prompt: 'What kind of question is Videsne?', choices: ['either yes or no', 'a question that expects yes', 'a question that expects no', 'a short command'], hint: 'The particle -ne does not tell the listener which answer to give.', explanation: '-ne asks an open question: do you see?' },
      { latin: 'dic', english: 'the singular command of dico', emoji: '!', prompt: 'Which form is the irregular singular command of dico?', choices: ['dic', 'dice', 'dicite', 'dicit'], hint: 'Dic, duc, fac, and fer drop the final e.', explanation: 'Dic is say, to one person. Dice is not the classical command.' },
      { latin: 'fer', english: 'carry, to one person', emoji: '!', prompt: 'What does the singular command fer mean?', choices: ['carry, to one person', 'carry, to many people', 'he carries', 'to carry'], hint: 'Fer comes from fero and is addressed to one person.', explanation: 'Fer means carry. The plural command is ferte.' },
      { latin: 'ferte', english: 'carry, to more than one person', emoji: '!', prompt: 'Which form tells several people to carry something?', choices: ['ferte', 'fer', 'ferite', 'fert'], hint: 'The plural of fer is ferte, not ferite.', explanation: 'Ferte is the plural command of fero.' }
    ]
  },
  {
    id: 'grade8-grammar-time-space',
    grade: 8,
    kind: 'grammar',
    series: 'intermediate',
    title: 'Grade 8 Grammar: Time and Space',
    description: 'Choose the ablative for when and within which time, and the accusative for how long.',
    sourceNote: 'Original classroom lesson. The examples were written for this course.',
    focus: ['time when', 'time within which', 'extent of time and space'],
    explain: [
      'Latin uses case, not a pile of prepositions, for many time and distance phrases. Time when is ablative: prima hora, at the first hour. Time within which is also ablative: tribus diebus, within three days. Both answer a when question, so both use the ablative.',
      'How long something goes on, and how far someone travels, use the accusative. Tres horas mansit means he stayed for three hours. Duo milia passuum ambulavit means he walked for two miles. If the English has for with a length of time or distance, start by looking for the accusative.'
    ],
    examples: [
      { latin: 'Prima hora discessit.', english: 'He left at the first hour.', note: 'Ablative of time when.' },
      { latin: 'Tribus diebus redibit.', english: 'He will return within three days.', note: 'Ablative of time within which.' },
      { latin: 'Tres horas mansit.', english: 'He stayed for three hours.', note: 'Accusative of duration.' },
      { latin: 'Duo milia passuum ambulavit.', english: 'He walked for two miles.', note: 'Accusative of extent of space.' },
      { latin: 'Uno anno', english: 'within one year', note: 'Ablative, because it is time within which.' }
    ],
    words: [
      { latin: 'Prima hora discessit.', english: 'time when', emoji: '1', prompt: 'Prima hora in Prima hora discessit is which use?', choices: ['time when', 'duration of time', 'extent of space', 'place to which'], hint: 'At the first hour names the point when he left.', explanation: 'The ablative prima hora is time when.' },
      { latin: 'Tribus diebus redibit.', english: 'time within which', emoji: '3', prompt: 'Tribus diebus expresses', choices: ['time within which', 'how long he had already stayed', 'the distance he walked', 'the person he visited'], hint: 'Within three days is a period that contains the action.', explanation: 'The ablative tribus diebus is time within which.' },
      { latin: 'Tres horas mansit.', english: 'duration of time', emoji: '3', prompt: 'Why is Tres horas accusative?', choices: ['duration of time', 'time when', 'time within which', 'the subject of mansit'], hint: 'For three hours tells how long.', explanation: 'Extent of time uses the accusative: tres horas.' },
      { latin: 'Duo milia passuum ambulavit.', english: 'extent of space', emoji: '2', prompt: 'Duo milia passuum tells', choices: ['extent of space', 'the hour of the day', 'time within which', 'a command to walk'], hint: 'Two miles is a distance.', explanation: 'Extent of space uses the accusative, here duo milia.' },
      { latin: 'quinque dies', english: 'for five days', emoji: '5', prompt: 'Which phrase means for five days?', choices: ['quinque dies', 'quinque diebus', 'quinto die', 'quinque dierum'], hint: 'How long uses the accusative.', explanation: 'Quinque dies is accusative duration. Quinque diebus would be within five days.' },
      { latin: 'uno anno', english: 'within one year', emoji: '1', prompt: 'Uno anno is best translated', choices: ['within one year', 'for one year', 'on the first day', 'toward the year'], hint: 'The ablative of a period often means within that period.', explanation: 'Uno anno is ablative of time within which.' }
    ]
  },
  {
    id: 'grade8-grammar-compare-reflexive',
    grade: 8,
    kind: 'grammar',
    series: 'intermediate',
    title: 'Grade 8 Grammar: Comparison and Reflexives',
    description: 'Compare with quam or the ablative, and keep se and suus pointed at the subject.',
    sourceNote: 'Original classroom lesson. The examples were written for this course.',
    focus: ['quam with a comparative', 'ablative of comparison', 'se and suus'],
    explain: [
      'A comparative such as altior, taller, can be finished in two ways. Quam repeats the case of the first person: Marcus est altior quam Quintus, and Quintus stays nominative because Marcus is nominative. Or the second person goes into the ablative with no quam: Marcus est altior Quinto.',
      'Se and suus point back to the subject. Puella se laudat means the girl praises herself. Puella suum librum legit means she reads her own book. If the owner is someone else, Latin uses eius: Puella eius librum legit means she reads that other person\'s book.'
    ],
    examples: [
      { latin: 'Marcus est altior Quinto.', english: 'Marcus is taller than Quintus.', note: 'Quinto is ablative of comparison.' },
      { latin: 'Marcus est altior quam Quintus.', english: 'Marcus is taller than Quintus.', note: 'Quam keeps Quintus in the same case as Marcus.' },
      { latin: 'Puella se laudat.', english: 'The girl praises herself.', note: 'Se is the reflexive object.' },
      { latin: 'Puella suum librum legit.', english: 'The girl reads her own book.', note: 'Suum refers to the subject.' },
      { latin: 'Puella eius librum legit.', english: 'The girl reads someone else\'s book.', note: 'Eius does not point back to the subject.' }
    ],
    words: [
      { latin: 'Marcus est altior Quinto.', english: 'ablative of comparison', emoji: '>', prompt: 'What use is Quinto in Marcus est altior Quinto?', choices: ['ablative of comparison', 'a person addressed by name', 'the subject', 'duration of time'], hint: 'A comparative can take an ablative instead of quam.', explanation: 'Quinto is ablative of comparison: taller than Quintus.' },
      { latin: 'altior quam Quintus', english: 'Quintus stays nominative', emoji: '>', prompt: 'In Marcus est altior quam Quintus, why is Quintus nominative?', choices: ['Quintus stays nominative', 'quam always takes the ablative', 'Quintus is the direct object', 'the phrase is an ablative absolute'], hint: 'Quam repeats the case of the word being compared.', explanation: 'Marcus is nominative, so quam Quintus is nominative too.' },
      { latin: 'Puella se laudat.', english: 'The girl praises herself.', emoji: 'R', prompt: 'Puella se laudat means', choices: ['The girl praises herself.', 'The girl praises her.', 'The girl is praised.', 'Praise the girl!'], hint: 'Se refers to the subject of the same clause.', explanation: 'Se is reflexive: the girl is both the one who praises and the one praised.' },
      { latin: 'suum librum', english: 'her own book', emoji: 'R', prompt: 'In Puella suum librum legit, suum means', choices: ['her own book', 'someone else\'s book', 'the book as subject', 'to the book'], hint: 'Suus points back to the subject.', explanation: 'Suum agrees with librum and refers to the girl who is reading.' },
      { latin: 'eius librum', english: 'someone other than the girl', emoji: 'R', prompt: 'In Puella eius librum legit, whose book is it?', choices: ['someone other than the girl', 'the girl herself', 'nobody in the sentence', 'the verb legit'], hint: 'Eius is the genitive of is, not the reflexive suus.', explanation: 'Eius points to a person other than the subject.' },
      { latin: 'Milites se defenderunt.', english: 'The soldiers defended themselves.', emoji: 'R', prompt: 'What does Milites se defenderunt mean?', choices: ['The soldiers defended themselves.', 'The soldiers defended him.', 'He defended the soldiers.', 'The soldiers were the subject of a question.'], hint: 'The plural subject uses the same reflexive se.', explanation: 'Se refers to milites: they defended themselves.' }
    ]
  },
  {
    id: 'grade8-grammar-numbers-idioms',
    grade: 8,
    kind: 'grammar',
    series: 'intermediate',
    title: 'Grade 8 Grammar: Numbers and Idioms',
    description: 'Count with cardinals and ordinals, and learn three phrases that do not translate word by word.',
    sourceNote: 'Original classroom lesson. The examples were written for this course.',
    focus: ['cardinal numbers', 'ordinal numbers', 'iter facere, in animo habere, memoria tenere'],
    explain: [
      'Cardinals count how many. Learn unus, duo, tres, quattuor, quinque, sex, septem, octo, novem, decem, then viginti (20), centum (100), and mille (1000). Ordinals put things in order: primus, secundus, tertius, quartus, quintus, sextus, septimus, octavus, nonus, decimus. An ordinal behaves like an adjective, so it matches its noun.',
      'Three everyday phrases are worth memorizing as wholes. Iter facere means to travel, literally to make a journey. In animo habere means to intend, literally to have in mind. Memoria tenere means to remember, literally to hold by memory, and the thing remembered is accusative.'
    ],
    examples: [
      { latin: 'unus, duo, tres, decem', english: 'one, two, three, ten', note: 'These are cardinals.' },
      { latin: 'viginti, centum, mille', english: '20, 100, 1000', note: 'Mille is the cardinal for one thousand.' },
      { latin: 'primus, secundus, tertius', english: 'first, second, third', note: 'These are ordinals.' },
      { latin: 'Iter facimus.', english: 'We travel.', note: 'Iter facere is an idiom.' },
      { latin: 'In animo habeo legere.', english: 'I intend to read.', note: 'In animo habere means to intend.' },
      { latin: 'Viam memoria teneo.', english: 'I remember the road.', note: 'The thing remembered is accusative.' }
    ],
    words: [
      { latin: 'viginti', english: 'twenty', emoji: '20', prompt: 'What number is viginti?', choices: ['twenty', 'twelve', 'two', 'two hundred'], hint: 'Viginti is the cardinal after the teens.', explanation: 'Viginti means twenty.' },
      { latin: 'mille', english: 'a thousand', emoji: '1000', prompt: 'Mille means', choices: ['a thousand', 'a hundred', 'a mile', 'many'], hint: 'Centum is 100. Mille is 1000.', explanation: 'Mille is the cardinal number one thousand.' },
      { latin: 'tertius', english: 'third', emoji: '3', prompt: 'Which ordinal means third?', choices: ['tertius', 'tres', 'ter', 'decimus'], hint: 'Tres is the cardinal three. The ordinal adds the ordered ending.', explanation: 'Tertius means third. Tres means three.' },
      { latin: 'Iter faciunt.', english: 'They travel.', emoji: 'I', prompt: 'Iter faciunt means', choices: ['They travel.', 'They make a road by hand.', 'The journey is easy.', 'Go away!'], hint: 'Learn iter facere as one phrase.', explanation: 'Iter facere means to travel. Faciunt is they make, so they travel.' },
      { latin: 'In animo habet manere.', english: 'He intends to stay.', emoji: 'I', prompt: 'In animo habet manere means', choices: ['He intends to stay.', 'He has a brave mind.', 'He stayed in the house.', 'Stay in the mind!'], hint: 'In animo habere means to intend.', explanation: 'The infinitive manere tells what he intends to do.' },
      { latin: 'Carmen memoria tenet.', english: 'She remembers the song.', emoji: 'I', prompt: 'Carmen memoria tenet means', choices: ['She remembers the song.', 'The song holds her.', 'She sings from memory only as a command.', 'Memory is a song.'], hint: 'Memoria tenere takes an accusative of the thing remembered.', explanation: 'Carmen is accusative. Memoria tenere means to remember.' }
    ]
  },
  {
    id: 'grade8-grammar-subjunctive',
    grade: 8,
    kind: 'grammar',
    series: 'syntax',
    title: 'Grade 8 Grammar: Subjunctive Forms',
    description: 'Build the four subjunctive tenses and notice when Latin is not stating a plain fact.',
    sourceNote: 'Original classroom lesson for the advanced track. The examples were written for this course.',
    focus: ['present subjunctive vowels', 'imperfect subjunctive', 'perfect and pluperfect subjunctive'],
    explain: [
      'The subjunctive is a mood for wishes, possibilities, and many dependent clauses. It often comes into English with may, might, would, or should. The present subjunctive changes the vowel of the present stem. A memory line for the four conjugations is "we fear a liar": e, ea, a, ia. So amo makes amem, moneo makes moneam, rego makes regam, and audio makes audiam.',
      'The imperfect subjunctive is the present infinitive plus the personal endings: amare makes amarem, and esse makes essem. The perfect subjunctive adds -eri- to the perfect stem: amaverim. The pluperfect subjunctive is the perfect infinitive plus endings: amavisse makes amavissem, and amavisset means he would have loved, or he had loved, inside a clause.'
    ],
    examples: [
      { latin: 'amem, moneam, regam, audiam', english: 'present subjunctive, first person', note: 'The vowels are e, ea, a, ia.' },
      { latin: 'amarem', english: 'I might love', note: 'Imperfect subjunctive: amare plus an ending.' },
      { latin: 'amaverim', english: 'I may have loved', note: 'Perfect subjunctive.' },
      { latin: 'amavisset', english: 'he had loved, in a clause', note: 'Pluperfect subjunctive.' },
      { latin: 'Utinam veniat.', english: 'If only he would come.', note: 'A wish uses the subjunctive.' }
    ],
    words: [
      { latin: 'amem', english: 'present subjunctive of amo', emoji: 'S', prompt: 'What form is amem?', choices: ['present subjunctive of amo', 'perfect indicative of amo', 'singular command of amo', 'present infinitive of amo'], hint: 'First conjugation present subjunctive uses the vowel e.', explanation: 'Amem is the first-person present subjunctive: I may love.' },
      { latin: 'e, ea, a, ia', english: 'the present-subjunctive vowels', emoji: 'S', prompt: 'Which vowel pattern builds the present subjunctive across the four conjugations?', choices: ['e, ea, a, ia', 'a, e, e, i only as indicatives', 'ba, bi, era', 'i, isti, it'], hint: 'Remember the line "we fear a liar."', explanation: 'The present-subjunctive vowels are e, ea, a, and ia.' },
      { latin: 'amarem', english: 'imperfect subjunctive', emoji: 'S', prompt: 'How is amarem built?', choices: ['imperfect subjunctive', 'present indicative', 'perfect passive participle', 'future infinitive'], hint: 'Start from the present infinitive amare and add an ending.', explanation: 'The imperfect subjunctive is the present infinitive plus personal endings.' },
      { latin: 'amavisset', english: 'pluperfect subjunctive', emoji: 'S', prompt: 'Amavisset is which tense and mood?', choices: ['pluperfect subjunctive', 'present subjunctive', 'future indicative', 'perfect passive indicative'], hint: 'It begins from the perfect infinitive amavisse.', explanation: 'Amavisset is third-person pluperfect subjunctive.' },
      { latin: 'audiam', english: 'present subjunctive of audio', emoji: 'S', prompt: 'Which form is the present subjunctive of audio, meaning I may hear?', choices: ['audiam', 'audiebam', 'audivi', 'audire'], hint: 'Fourth conjugation uses ia in the present subjunctive.', explanation: 'Audiam is first-person present subjunctive. Audire is the infinitive.' },
      { latin: 'Utinam veniat.', english: 'a wish', emoji: 'S', prompt: 'Utinam veniat is best described as', choices: ['a wish', 'a plain fact in the indicative', 'a plural command', 'an ablative of time'], hint: 'Utinam means if only or would that.', explanation: 'Veniat is subjunctive in a wish: if only he would come.' }
    ]
  },
  {
    id: 'grade8-grammar-purpose-result',
    grade: 8,
    kind: 'grammar',
    series: 'syntax',
    title: 'Grade 8 Grammar: Purpose and Result',
    description: 'Tell a purpose clause from a result clause, and choose the subjunctive that matches the main verb.',
    sourceNote: 'Original classroom lesson for the advanced track. The examples were written for this course.',
    focus: ['ut and ne for purpose', 'tam, ita, and adeo for result', 'sequence of tenses'],
    explain: [
      'Purpose tells why, and it uses ut plus the subjunctive, or ne if the purpose is negative. Venit ut videat means he comes in order to see. Fugit ne capiatur means he flees so that he may not be captured. If the main verb is present or future, the clause uses the present subjunctive. If the main verb is past, the clause uses the imperfect subjunctive: Venerat ut videret, he had come in order to see.',
      'Result tells what actually follows, and it is marked by a signal word such as tam, ita, sic, adeo, or tantus. Tam fessus est ut dormiat means he is so tired that he sleeps. Without a signal word, ut plus the subjunctive is usually purpose. With tam or adeo, read it as result.'
    ],
    examples: [
      { latin: 'Venit ut videat.', english: 'He comes in order to see.', note: 'Purpose, after a present main verb.' },
      { latin: 'Venerat ut videret.', english: 'He had come in order to see.', note: 'Purpose, after a past main verb.' },
      { latin: 'Fugit ne capiatur.', english: 'He flees so that he may not be captured.', note: 'Ne is negative purpose.' },
      { latin: 'Tam fessus est ut dormiat.', english: 'He is so tired that he sleeps.', note: 'Tam marks result.' },
      { latin: 'Adeo celeriter cucurrit ut caderet.', english: 'He ran so fast that he fell.', note: 'Adeo also marks result.' }
    ],
    words: [
      { latin: 'Venit ut videat.', english: 'purpose', emoji: 'U', prompt: 'Venit ut videat is which kind of clause?', choices: ['purpose', 'result', 'a fear clause', 'a direct question'], hint: 'There is no tam or adeo. He comes in order to see.', explanation: 'Ut plus the subjunctive after a verb of motion is purpose.' },
      { latin: 'Venerat ut videret.', english: 'imperfect subjunctive after a past verb', emoji: 'U', prompt: 'Why is videret imperfect subjunctive?', choices: ['imperfect subjunctive after a past verb', 'the clause is a result clause', 'videret is a command', 'the main verb is present'], hint: 'Venerat is pluperfect, so the purpose clause is secondary.', explanation: 'A past main verb is followed by the imperfect subjunctive in a purpose clause.' },
      { latin: 'Fugit ne capiatur.', english: 'negative purpose', emoji: 'U', prompt: 'Ne capiatur expresses', choices: ['negative purpose', 'a result that he was captured', 'a fear that he had not fled', 'the subject of fugit'], hint: 'Ne plus the subjunctive means so that not.', explanation: 'Ne capiatur is negative purpose: so that he may not be captured.' },
      { latin: 'Tam fessus est ut dormiat.', english: 'result', emoji: 'U', prompt: 'Tam fessus est ut dormiat is', choices: ['result', 'purpose', 'an indirect command', 'an ablative absolute'], hint: 'Tam means so, and it signals result.', explanation: 'Tam ... ut with the subjunctive means so tired that he sleeps.' },
      { latin: 'adeo', english: 'a result signal', emoji: 'U', prompt: 'Which word is a signal that ut introduces result?', choices: ['adeo', 'neque', 'sed', 'et'], hint: 'Result signal words include tam, ita, sic, adeo, and tantus.', explanation: 'Adeo means to such a degree and marks a result clause.' },
      { latin: 'venit ut / tam ... ut', english: 'purpose, then result', emoji: 'U', prompt: 'Without a signal word, venit ut is usually purpose. With tam, ut is usually', choices: ['purpose, then result', 'a locative, then a supine', 'two commands', 'two indicatives'], hint: 'Look for tam, ita, sic, or adeo before you call the clause result.', explanation: 'The first pattern is purpose. Tam ... ut is result.' }
    ]
  },
  {
    id: 'grade8-grammar-indirect',
    grade: 8,
    kind: 'grammar',
    series: 'syntax',
    title: 'Grade 8 Grammar: Indirect Command and Question',
    description: 'Report an order with ut or ne, and report a question with the subjunctive.',
    sourceNote: 'Original classroom lesson for the advanced track. The examples were written for this course.',
    focus: ['indirect command', 'indirect question', 'ut, ne, and question words'],
    explain: [
      'An indirect command reports what someone orders, asks, or persuades another person to do. It uses ut or ne plus the subjunctive. Imperat eis ut maneant means he orders them to stay. Eis is dative because impero takes the dative. Oro te ne abeas means I beg you not to go away. Te is accusative because oro takes the person in the accusative.',
      'An indirect question reports a question as part of a statement. The question word stays, and the verb becomes subjunctive. Cur venis? becomes Rogat cur venias, he asks why you are coming. Num and -ne in a direct question often become num in the reported question: Rogavit num venisset, he asked whether she had come.'
    ],
    examples: [
      { latin: 'Imperat eis ut maneant.', english: 'He orders them to stay.', note: 'Impero takes the dative.' },
      { latin: 'Oro te ne abeas.', english: 'I beg you not to go away.', note: 'Ne makes the command negative.' },
      { latin: 'Rogat quid facias.', english: 'He asks what you are doing.', note: 'Facias is subjunctive.' },
      { latin: 'Rogat cur venias.', english: 'He asks why you are coming.', note: 'The direct question was Cur venis?' },
      { latin: 'Rogavit num venisset.', english: 'He asked whether she had come.', note: 'Venisset is pluperfect subjunctive.' }
    ],
    words: [
      { latin: 'Imperat eis ut maneant.', english: 'an indirect command', emoji: 'Q', prompt: 'Imperat eis ut maneant is', choices: ['an indirect command', 'a result clause', 'a direct question', 'an ablative absolute'], hint: 'He orders them that they should stay.', explanation: 'Impero plus ut and the subjunctive reports a command.' },
      { latin: 'Oro te ne abeas.', english: 'I beg you not to go away.', emoji: 'Q', prompt: 'What does Oro te ne abeas mean?', choices: ['I beg you not to go away.', 'I ask why you leave.', 'You begged me to stay.', 'Do not ask!'], hint: 'Ne plus the subjunctive is the negative request.', explanation: 'Oro takes te as its object, and ne abeas is the negative indirect command.' },
      { latin: 'Rogat quid facias.', english: 'an indirect question', emoji: 'Q', prompt: 'Rogat quid facias is', choices: ['an indirect question', 'a purpose clause', 'a direct command', 'a gerund'], hint: 'Quid is a question word, and facias is subjunctive.', explanation: 'A reported question uses the subjunctive.' },
      { latin: 'Rogavit num venisset.', english: 'He asked whether she had come.', emoji: 'Q', prompt: 'Rogavit num venisset means', choices: ['He asked whether she had come.', 'He asked her to come.', 'She came, did she not?', 'He feared that she had come.'], hint: 'Num here means whether. Venisset is pluperfect subjunctive.', explanation: 'The indirect question uses num plus the subjunctive.' },
      { latin: 'Rogat cur venias.', english: 'the reported form of Cur venis?', emoji: 'Q', prompt: 'Which clause reports the question Cur venis?', choices: ['the reported form of Cur venis?', 'a purpose clause meaning in order to come', 'an ablative of cause', 'a singular command'], hint: 'The indicative venis becomes the subjunctive venias.', explanation: 'Rogat cur venias means he asks why you are coming.' },
      { latin: 'quid facias', english: 'the subjunctive', emoji: 'Q', prompt: 'The verb of an indirect question is', choices: ['the subjunctive', 'always the indicative', 'always an infinitive', 'always a participle'], hint: 'Indirect statement uses an infinitive. An indirect question does not.', explanation: 'A reported question needs the subjunctive.' }
    ]
  },
  {
    id: 'grade8-grammar-cum-fear',
    grade: 8,
    kind: 'grammar',
    series: 'syntax',
    title: 'Grade 8 Grammar: Cum Clauses and Fear',
    description: 'Read cum with the subjunctive as when, since, or although, and learn the backward ne of fearing.',
    sourceNote: 'Original classroom lesson for the advanced track. The examples were written for this course.',
    focus: ['cum clauses', 'fear clauses', 'the preposition cum'],
    explain: [
      'Cum has two different jobs. As a preposition it means with and takes the ablative: cum amico, with a friend. As a conjunction with the subjunctive it gives the circumstances: Cum hostes vidisset, fugit means when he had seen the enemy, he fled. Cum fessus esset, mansit means since he was tired, he stayed. Context chooses among when, since, and although.',
      'After a verb of fearing, ne and ut swap their usual feeling. Timeo ne cadat means I fear that he may fall: ne introduces what you are afraid will happen. Timeo ut veniat means I fear that he may not come: ut introduces what you are afraid will not happen. Read the clause from the fear, not from the ordinary purpose rule.'
    ],
    examples: [
      { latin: 'Cum hostes vidisset, fugit.', english: 'When he had seen the enemy, he fled.', note: 'Cum plus the pluperfect subjunctive.' },
      { latin: 'Cum fessus esset, mansit.', english: 'Since he was tired, he stayed.', note: 'Cum can mean since.' },
      { latin: 'cum amico', english: 'with a friend', note: 'This cum is a preposition.' },
      { latin: 'Timeo ne cadat.', english: 'I fear that he may fall.', note: 'Ne introduces the thing feared.' },
      { latin: 'Timeo ut veniat.', english: 'I fear that he may not come.', note: 'After a verb of fearing, ut means that not.' }
    ],
    words: [
      { latin: 'Cum hostes vidisset, fugit.', english: 'when he had seen the enemy', emoji: 'C', prompt: 'Cum hostes vidisset, fugit means', choices: ['when he had seen the enemy', 'with the enemy', 'if the enemy flees', 'do not see the enemy'], hint: 'The conjunction cum plus the subjunctive gives the circumstance.', explanation: 'Vidisset is pluperfect subjunctive: when he had seen the enemy, he fled.' },
      { latin: 'Cum fessus esset, mansit.', english: 'since he was tired, he stayed', emoji: 'C', prompt: 'A natural English version of Cum fessus esset, mansit is', choices: ['since he was tired, he stayed', 'with a tired man', 'he stayed and was not tired', 'stay, tired one!'], hint: 'Cum plus the subjunctive can mean since.', explanation: 'Esset is imperfect subjunctive. The clause gives the reason he stayed.' },
      { latin: 'cum amico', english: 'the preposition with', emoji: 'C', prompt: 'In cum amico, cum is', choices: ['the preposition with', 'a conjunction meaning when', 'a result signal', 'a subjunctive ending'], hint: 'Amico is ablative, and no clause follows.', explanation: 'The preposition cum means with and takes the ablative.' },
      { latin: 'Timeo ne cadat.', english: 'I fear that he may fall.', emoji: 'C', prompt: 'Timeo ne cadat means', choices: ['I fear that he may fall.', 'I fear that he may not fall.', 'I do not fear to fall.', 'Fall, so that I may fear!'], hint: 'After timeo, ne introduces what you fear will happen.', explanation: 'Ne cadat is the thing feared: that he may fall.' },
      { latin: 'Timeo ut veniat.', english: 'I fear that he may not come.', emoji: 'C', prompt: 'After a verb of fearing, Timeo ut veniat means', choices: ['I fear that he may not come.', 'I come in order to fear.', 'I fear that he is already here.', 'I order him to come.'], hint: 'In a fear clause, ut means that not.', explanation: 'Ut veniat after timeo means that he may not come.' },
      { latin: 'Timebat ne urbs caperetur.', english: 'a fear clause', emoji: 'C', prompt: 'Timebat ne urbs caperetur is', choices: ['a fear clause', 'a negative purpose clause only', 'an ablative absolute', 'a future indicative'], hint: 'The main verb is a verb of fearing.', explanation: 'He was afraid that the city would be captured. Ne introduces the feared event.' }
    ]
  },
  {
    id: 'grade8-grammar-conditions',
    grade: 8,
    kind: 'grammar',
    series: 'syntax',
    title: 'Grade 8 Grammar: Conditions',
    description: 'Match indicative facts, future conditions, and contrary-to-fact conditions.',
    sourceNote: 'Original classroom lesson for the advanced track. The examples were written for this course.',
    focus: ['simple and future conditions', 'should-would conditions', 'contrary to fact'],
    explain: [
      'A condition has a si clause and a main conclusion. If both verbs are indicative, Latin is talking about a fact or a straightforward future. Si venit, eum video means if he comes, I see him. Si veniet, eum videbo means if he comes, I will see him. That future pair is sometimes called future more vivid.',
      'The subjunctive makes the condition less sure, or contrary to the facts. Si veniat, videam means if he should come, I would see him. Si adesset, videret means if he were here now, he would see, but he is not here. Si venisset, vidisset means if he had come, he would have seen, but he did not come. Imperfect subjunctive is the present contrary-to-fact pair. Pluperfect subjunctive is the past pair.'
    ],
    examples: [
      { latin: 'Si venit, eum video.', english: 'If he comes, I see him.', note: 'Both verbs are indicative.' },
      { latin: 'Si veniet, eum videbo.', english: 'If he comes, I will see him.', note: 'Future more vivid.' },
      { latin: 'Si veniat, videam.', english: 'If he should come, I would see him.', note: 'Present subjunctive in both clauses.' },
      { latin: 'Si adesset, videret.', english: 'If he were here, he would see.', note: 'Present contrary to fact.' },
      { latin: 'Si venisset, vidisset.', english: 'If he had come, he would have seen.', note: 'Past contrary to fact.' }
    ],
    words: [
      { latin: 'Si venit, eum video.', english: 'a simple fact', emoji: 'IF', prompt: 'Si venit, eum video states', choices: ['a simple fact', 'something contrary to present fact', 'a past wish', 'an indirect command'], hint: 'Both verbs are present indicative.', explanation: 'Indicative in both clauses is a simple condition.' },
      { latin: 'Si veniet, eum videbo.', english: 'future more vivid', emoji: 'IF', prompt: 'Si veniet, eum videbo is', choices: ['future more vivid', 'past contrary to fact', 'a fear clause', 'a gerund'], hint: 'Both verbs are future indicative.', explanation: 'Future indicative in both clauses is a vivid future condition.' },
      { latin: 'Si veniat, videam.', english: 'should-would', emoji: 'IF', prompt: 'Si veniat, videam means', choices: ['should-would', 'if he comes, I see him, as a fact', 'if he had come, I would have seen', 'he came and I saw'], hint: 'Present subjunctive in both clauses softens the future.', explanation: 'This is a future-less-vivid, or should-would, condition.' },
      { latin: 'Si adesset, videret.', english: 'present contrary to fact', emoji: 'IF', prompt: 'Si adesset, videret assumes that', choices: ['present contrary to fact', 'he is here now', 'he came yesterday', 'the verbs are indicative'], hint: 'Imperfect subjunctive in both clauses is contrary to present fact.', explanation: 'If he were here, he would see. He is not here.' },
      { latin: 'Si venisset, vidisset.', english: 'past contrary to fact', emoji: 'IF', prompt: 'Si venisset, vidisset is', choices: ['past contrary to fact', 'a simple present fact', 'a future more vivid condition', 'an ablative absolute'], hint: 'Both verbs are pluperfect subjunctive.', explanation: 'If he had come, he would have seen. He did not come.' },
      { latin: 'pluperfect subjunctive', english: 'the tense of a past contrary-to-fact pair', emoji: 'IF', prompt: 'Which tense fills both clauses of a past contrary-to-fact condition?', choices: ['pluperfect subjunctive', 'present indicative', 'future indicative', 'present participle'], hint: 'Look at venisset and vidisset.', explanation: 'The pluperfect subjunctive marks a condition contrary to past fact.' }
    ]
  },
  {
    id: 'grade8-grammar-ablative-absolute',
    grade: 8,
    kind: 'grammar',
    series: 'syntax',
    title: 'Grade 8 Grammar: The Ablative Absolute',
    description: 'Read a noun and a participle in the ablative as a scene set beside the main sentence.',
    sourceNote: 'Original classroom lesson for the advanced track. The examples were written for this course.',
    focus: ['noun plus participle', 'both words ablative', 'time and circumstance'],
    explain: [
      'An ablative absolute is a little phrase of its own. A noun and a participle, both ablative, set the scene for the main sentence. Re cognita, discessit means the matter having been learned, he left, or when the facts were known, he left. Sole orto means the sun having risen, or at sunrise. His dictis means these things having been said.',
      'The phrase is called absolute because it is loosened from the grammar of the main clause. The noun in the phrase is not the subject or the object of the main verb. If the same person does both actions, Latin usually uses an ordinary participle instead. Hostibus victis, urbs tacuit means the enemy having been defeated, the city was quiet.'
    ],
    examples: [
      { latin: 'Re cognita, discessit.', english: 'When the matter was known, he left.', note: 'Re and cognita are both ablative.' },
      { latin: 'Sole orto', english: 'at sunrise', note: 'The sun having risen.' },
      { latin: 'His dictis', english: 'these things having been said', note: 'His and dictis are ablative.' },
      { latin: 'Hostibus victis, urbs tacuit.', english: 'The enemy having been defeated, the city was quiet.', note: 'The enemy is not the subject of tacuit.' }
    ],
    words: [
      { latin: 'Re cognita', english: 'an ablative absolute', emoji: 'AA', prompt: 'Re cognita is', choices: ['an ablative absolute', 'a purpose clause', 'the subject of the next verb', 'a direct command'], hint: 'A noun and a perfect participle stand together in the ablative.', explanation: 'Re cognita means the matter having been learned.' },
      { latin: 'Sole orto', english: 'at sunrise', emoji: 'AA', prompt: 'Sole orto can be translated', choices: ['at sunrise', 'the sun is the subject', 'in order that the sun rise', 'fear the sun'], hint: 'Orto is the perfect participle of orior, in the ablative.', explanation: 'Sole orto means the sun having risen, or at sunrise.' },
      { latin: 'His dictis', english: 'these things having been said', emoji: 'AA', prompt: 'His dictis means', choices: ['these things having been said', 'he said these things as a purpose', 'say these words!', 'these are nominative'], hint: 'His and dictis are both ablative.', explanation: 'The phrase means with this said, or after these words.' },
      { latin: 'Hostibus victis', english: 'the enemy having been defeated', emoji: 'AA', prompt: 'Hostibus victis means', choices: ['the enemy having been defeated', 'the enemy won', 'defeat the enemy!', 'to the victorious enemy as a dative of purpose only'], hint: 'Both words are ablative plural.', explanation: 'Hostibus victis is an ablative absolute.' },
      { latin: 'both ablative', english: 'the case of the noun and the participle', emoji: 'AA', prompt: 'In an ablative absolute, the noun and the participle are', choices: ['both ablative', 'both nominative', 'one dative and one genitive', 'both subjunctive'], hint: 'The name of the construction names the case.', explanation: 'Each part of the phrase is ablative.' },
      { latin: 'ut videret', english: 'not an ablative absolute', emoji: 'AA', prompt: 'Which phrase is not an ablative absolute?', choices: ['ut videret', 're cognita', 'sole orto', 'his dictis'], hint: 'An ablative absolute is not a clause with ut.', explanation: 'Ut videret is a purpose clause. The other three are noun-plus-participle phrases.' }
    ]
  },
  {
    id: 'grade8-grammar-gerunds',
    grade: 8,
    kind: 'grammar',
    series: 'syntax',
    title: 'Grade 8 Grammar: Gerund and Gerundive',
    description: 'Use the gerund as a verbal noun, and let the gerundive agree with a real noun.',
    sourceNote: 'Original classroom lesson for the advanced track. The examples were written for this course.',
    focus: ['gerund', 'gerundive', 'purpose with ad'],
    explain: [
      'The gerund is a verbal noun. It is neuter singular and active in feeling: the art of writing, the desire of seeing. Ars scribendi uses the genitive gerund. Cupidus videndi means desirous of seeing. Ad pugnandum means for the purpose of fighting. English often uses an -ing word.',
      'The gerundive is a verbal adjective, so it agrees with a noun in case, number, and gender. Ad urbem videndam means in order to see the city: videndam is feminine accusative because urbem is feminine accusative. If a form agrees with a noun, call it a gerundive. If it stands alone as the name of an action, call it a gerund.'
    ],
    examples: [
      { latin: 'ars scribendi', english: 'the art of writing', note: 'Scribendi is a genitive gerund.' },
      { latin: 'cupidus videndi', english: 'desirous of seeing', note: 'Cupidus takes the genitive.' },
      { latin: 'ad pugnandum', english: 'for fighting', note: 'Ad plus the accusative gerund can show purpose.' },
      { latin: 'ad urbem videndam', english: 'in order to see the city', note: 'Videndam agrees with urbem.' }
    ],
    words: [
      { latin: 'ars scribendi', english: 'a gerund', emoji: 'G', prompt: 'Scribendi in ars scribendi is', choices: ['a gerund', 'a finite verb', 'a locative', 'an indirect question'], hint: 'It names the action of writing and stands in the genitive.', explanation: 'Scribendi is the genitive gerund: the art of writing.' },
      { latin: 'cupidus videndi', english: 'desirous of seeing', emoji: 'G', prompt: 'Cupidus videndi means', choices: ['desirous of seeing', 'he sees the desire', 'see the eager man!', 'a city must be seen'], hint: 'Videndi is a genitive gerund after cupidus.', explanation: 'Cupidus takes the genitive of the thing desired.' },
      { latin: 'ad pugnandum', english: 'a gerund of purpose', emoji: 'G', prompt: 'Ad pugnandum expresses', choices: ['a gerund of purpose', 'an ablative absolute', 'a past contrary-to-fact condition', 'a direct question'], hint: 'Ad plus the accusative can mean for the purpose of.', explanation: 'Pugnandum is the accusative gerund: for fighting.' },
      { latin: 'ad urbem videndam', english: 'a gerundive agreeing with urbem', emoji: 'G', prompt: 'Why is videndam feminine in ad urbem videndam?', choices: ['a gerundive agreeing with urbem', 'every gerund is feminine', 'videndam is a plural noun', 'the phrase is ablative'], hint: 'A gerundive agrees with the noun it describes.', explanation: 'Urbem is feminine accusative, so the gerundive is videndam.' },
      { latin: 'gerund', english: 'it does not agree with a noun', emoji: 'G', prompt: 'Which statement fits a gerund?', choices: ['it does not agree with a noun', 'it must match a noun in gender', 'it is always plural', 'it is a fear clause'], hint: 'The gerund is a noun. The gerundive is an adjective.', explanation: 'A gerund stands as the name of an action and does not agree with another noun.' },
      { latin: 'videndam', english: 'it agrees with the city', emoji: 'G', prompt: 'In ad urbem videndam, videndam', choices: ['it agrees with the city', 'it is a nominative subject', 'it is a present indicative', 'it is a locative'], hint: 'Match case, number, and gender with urbem.', explanation: 'Videndam is feminine accusative singular, like urbem.' }
    ]
  },
  {
    id: 'grade8-grammar-periphrastics',
    grade: 8,
    kind: 'grammar',
    series: 'syntax',
    title: 'Grade 8 Grammar: Periphrastics',
    description: 'Combine a future participle with sum to say about to or must.',
    sourceNote: 'Original classroom lesson for the advanced track. The examples were written for this course.',
    focus: ['active periphrastic', 'passive periphrastic', 'dative of agent'],
    explain: [
      'A periphrastic is a roundabout form made of a participle plus sum. The active periphrastic uses the future active participle: Venturus est means he is about to come, or he intends to come. The participle agrees with the subject: puella ventura est, the girl is about to come.',
      'The passive periphrastic uses the gerundive plus sum and shows obligation. Liber legendus est means the book must be read. The person who has to do it goes in the dative, called the dative of agent: Liber mihi legendus est means the book must be read by me, or I must read the book.'
    ],
    examples: [
      { latin: 'Venturus est.', english: 'He is about to come.', note: 'Future active participle plus est.' },
      { latin: 'Puella ventura est.', english: 'The girl is about to come.', note: 'Ventura agrees with puella.' },
      { latin: 'Liber legendus est.', english: 'The book must be read.', note: 'Gerundive plus est.' },
      { latin: 'Liber mihi legendus est.', english: 'I must read the book.', note: 'Mihi is dative of agent.' }
    ],
    words: [
      { latin: 'Venturus est.', english: 'the active periphrastic', emoji: 'P', prompt: 'Venturus est is', choices: ['the active periphrastic', 'a passive periphrastic of obligation', 'an ablative absolute', 'a perfect indicative'], hint: 'The future active participle plus sum means about to.', explanation: 'Venturus est means he is about to come.' },
      { latin: 'Liber legendus est.', english: 'the book must be read', emoji: 'P', prompt: 'Liber legendus est means', choices: ['the book must be read', 'the book has been read', 'read the book!', 'the reader is free'], hint: 'The gerundive with est shows what ought to be done.', explanation: 'This is the passive periphrastic of obligation.' },
      { latin: 'Liber mihi legendus est.', english: 'I must read the book.', emoji: 'P', prompt: 'What does mihi add in Liber mihi legendus est?', choices: ['I must read the book.', 'the book is mine as a possessive only', 'I have already read the book', 'the book is about to read me'], hint: 'With the passive periphrastic, the dative is the person who must act.', explanation: 'Mihi is the dative of agent: the book must be read by me.' },
      { latin: 'amandus', english: 'a future passive participle', emoji: 'P', prompt: 'Amandus is', choices: ['a future passive participle', 'a present indicative', 'a perfect active infinitive', 'a locative'], hint: 'The gerundive is also called the future passive participle.', explanation: 'Amandus means to be loved, or needing to be loved.' },
      { latin: 'amaturus', english: 'a future active participle', emoji: 'P', prompt: 'Amaturus is used in', choices: ['a future active participle', 'a fear clause', 'an indirect question by itself', 'the ablative of comparison'], hint: 'The ending -urus marks the future active participle.', explanation: 'Amaturus means about to love.' },
      { latin: 'legendus est', english: 'obligation', emoji: 'P', prompt: 'Legendus est mainly expresses', choices: ['obligation', 'a completed past fact', 'a direct command by the ending -te', 'place where'], hint: 'Must and ought are the English clues.', explanation: 'The passive periphrastic expresses necessity or obligation.' }
    ]
  },
  {
    id: 'grade8-grammar-deponents',
    grade: 8,
    kind: 'grammar',
    series: 'syntax',
    title: 'Grade 8 Grammar: Deponents and Semi-deponents',
    description: 'Read passive endings as active meanings, and notice verbs that change only in the perfect.',
    sourceNote: 'Original classroom lesson for the advanced track. The examples were written for this course.',
    focus: ['deponent verbs', 'semi-deponents', 'passive form, active meaning'],
    explain: [
      'A deponent verb uses passive endings with an active meaning. Miror, mirari, miratus sum means I admire or I wonder at. Miratus est means he admired, not he was admired. Sequitur means he follows. Profectus est, from proficiscor, means he set out.',
      'A semi-deponent is active in the present system and deponent in the perfect. Audeo, audere, ausus sum means I dare, I dared. Gaudeo, gaudere, gavisus sum means I rejoice, I rejoiced. The present audeo looks like an ordinary active verb. The perfect ausus est looks passive and means he dared.'
    ],
    examples: [
      { latin: 'Miratus est.', english: 'He admired.', note: 'Passive form, active meaning.' },
      { latin: 'Sequitur.', english: 'He follows.', note: 'The present already looks passive.' },
      { latin: 'Profectus est.', english: 'He set out.', note: 'From proficiscor.' },
      { latin: 'Ausus est.', english: 'He dared.', note: 'Audeo is semi-deponent.' },
      { latin: 'Gavisus est.', english: 'He rejoiced.', note: 'From gaudeo, gavisus sum.' }
    ],
    words: [
      { latin: 'Miratus est.', english: 'he admired', emoji: 'D', prompt: 'Miratus est means', choices: ['he admired', 'he was admired by someone', 'admire!', 'to have been seen'], hint: 'Miror is deponent, so the perfect is active in meaning.', explanation: 'Miratus est means he wondered at or he admired.' },
      { latin: 'Profectus est.', english: 'he set out', emoji: 'D', prompt: 'Profectus est means', choices: ['he set out', 'he was sent', 'he is setting out now', 'set out!'], hint: 'Proficiscor is a deponent verb of setting out.', explanation: 'The perfect of proficiscor is profectus est, he set out.' },
      { latin: 'Sequitur.', english: 'he follows', emoji: 'D', prompt: 'Even though sequitur looks passive, it means', choices: ['he follows', 'he is followed', 'follow, all of you', 'he had followed yesterday only'], hint: 'Sequor is deponent in every tense.', explanation: 'Sequitur is present deponent: he follows.' },
      { latin: 'Ausus est.', english: 'he dared', emoji: 'D', prompt: 'Ausus est, from audeo, means', choices: ['he dared', 'he was dared', 'he dares now', 'dare!'], hint: 'Audeo is semi-deponent. The perfect looks passive.', explanation: 'Ausus est means he dared.' },
      { latin: 'audeo', english: 'active in the present', emoji: 'D', prompt: 'The present of the semi-deponent audeo is', choices: ['active in the present', 'passive in every form', 'only a supine', 'a locative'], hint: 'Semi-deponents change at the perfect, not in the present.', explanation: 'Audeo means I dare and uses ordinary active endings in the present.' },
      { latin: 'Gavisus est.', english: 'he rejoiced', emoji: 'D', prompt: 'Gavisus est means', choices: ['he rejoiced', 'he was rejoiced at by the crowd', 'rejoice!', 'he will rejoice'], hint: 'Gaudeo, gavisus sum is semi-deponent.', explanation: 'Gavisus est is the perfect of gaudeo: he rejoiced.' }
    ]
  },
  {
    id: 'grade8-grammar-place-supine',
    grade: 8,
    kind: 'grammar',
    series: 'syntax',
    title: 'Grade 8 Grammar: Place, Supines, and Special Cases',
    description: 'Learn the locative, the two supines, and verbs that take a dative or an ablative object.',
    sourceNote: 'Original classroom lesson for the advanced track. The examples were written for this course.',
    focus: ['locative', 'supines', 'special-verb cases'],
    explain: [
      'Names of cities and a few everyday place words use a small set of forms. Romae means at Rome, Romam means to Rome, and Roma means from Rome. Domi means at home, domum means homeward, and domo means from home. These place-where forms are locatives. They are not the same as the genitive, even when the ending looks alike.',
      'The supine is a verbal noun from the fourth principal part. After a verb of motion, the accusative supine shows purpose: Venit rogatum, he came to ask. With an adjective, the ablative supine shows in what respect: mirabile dictu, wonderful to say. Some verbs also take an unexpected case. Credo tibi means I trust you, with the dative. Utor gladio means I use a sword, with the ablative.'
    ],
    examples: [
      { latin: 'Romae manet.', english: 'He stays at Rome.', note: 'Romae is locative.' },
      { latin: 'Domi sum. Domum eo. Domo exeo.', english: 'I am at home. I go home. I leave home.', note: 'Three forms of domus.' },
      { latin: 'Venit rogatum.', english: 'He came to ask.', note: 'Accusative supine of purpose.' },
      { latin: 'mirabile dictu', english: 'wonderful to say', note: 'Ablative supine.' },
      { latin: 'Credo tibi.', english: 'I trust you.', note: 'Credo takes the dative.' },
      { latin: 'Utor gladio.', english: 'I use a sword.', note: 'Utor takes the ablative.' }
    ],
    words: [
      { latin: 'Romae manet.', english: 'at Rome', emoji: 'L', prompt: 'Romae in Romae manet means', choices: ['at Rome', 'to Rome', 'from Rome', 'the city is the subject'], hint: 'The locative of Roma is Romae.', explanation: 'Romae means at Rome. Romam would mean to Rome.' },
      { latin: 'domi / domum / domo', english: 'at home, homeward, from home', emoji: 'L', prompt: 'Which set gives at home, homeward, and from home?', choices: ['domi / domum / domo', 'domus / domus / domus', 'domo / domi / domum', 'Romae / Romam / Roma only for the house'], hint: 'Domi is the locative.', explanation: 'Domi is at home, domum is homeward, and domo is from home.' },
      { latin: 'Venit rogatum.', english: 'a supine of purpose', emoji: 'L', prompt: 'Rogatum in Venit rogatum is', choices: ['a supine of purpose', 'a perfect indicative', 'a locative', 'an indirect question'], hint: 'After a verb of motion, the accusative supine means in order to.', explanation: 'Venit rogatum means he came to ask.' },
      { latin: 'mirabile dictu', english: 'wonderful to say', emoji: 'L', prompt: 'Dictu in mirabile dictu is', choices: ['wonderful to say', 'he said a wonder', 'say the wonder!', 'a fear clause'], hint: 'The ablative supine limits an adjective.', explanation: 'Dictu is the ablative supine: wonderful in the saying.' },
      { latin: 'Credo tibi.', english: 'I trust you.', emoji: 'L', prompt: 'Why is tibi dative in Credo tibi?', choices: ['I trust you.', 'you are the place where', 'tibi is a supine', 'the phrase is an ablative absolute'], hint: 'Credo takes the dative of the person trusted.', explanation: 'Credo tibi means I trust you, or I believe you.' },
      { latin: 'Utor gladio.', english: 'I use a sword.', emoji: 'L', prompt: 'Utor gladio means', choices: ['I use a sword.', 'I give a sword.', 'the sword uses me', 'use the sword, all of you'], hint: 'Utor takes the ablative, not the accusative.', explanation: 'Gladio is ablative with utor: I use a sword.' }
    ]
  }
];
