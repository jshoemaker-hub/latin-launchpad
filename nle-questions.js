// Original practice questions for Latin Launchpad's unofficial NLE prep.
// Do not replace these with text from copyrighted NLE exams or passages.

function nleQ(id, level, category, prompt, choices, answer, explanation, extra) {
  const data = extra || {};
  const sections = {
    grammar: 'language',
    vocabulary: 'language',
    derivatives: 'language',
    mottoes: 'language',
    oral: 'language',
    mythology: 'culture',
    history: 'culture',
    geography: 'culture',
    culture: 'culture',
    reading: 'reading'
  };
  return {
    id,
    level,
    category,
    section: data.section || sections[category],
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

const NLE_PASSAGES = [
  {
    id: 'intro-passage-canis',
    level: 'intro',
    storyId: 'intro-canis',
    title: 'In the garden',
    latin: [
      'Marcus et soror in horto ambulant. Canis quoque in horto est.',
      'Subito canis latrat. Soror clamat: "Ecce! Feles in arbore est!"',
      'Marcus ad arborem currit. "Descende, feles!" inquit.',
      'Feles non descendit. Tum Marcus feli cibum dat.',
      'Feles de arbore venit et cibum consumit.',
      '"Euge!" clamat soror. "Feles nunc cibum habet."',
      'Canis autem sub arbore sedet et felem spectat.'
    ].join('\n'),
    glossary: [
      ['hortus, horto', 'garden'],
      ['quoque', 'also'],
      ['latrat', 'barks'],
      ['arbor, arbore', 'tree'],
      ['currit', 'runs'],
      ['descende', 'come down'],
      ['descendit', 'comes down'],
      ['tum', 'then'],
      ['consumit', 'eats up'],
      ['autem', 'however'],
      ['spectat', 'watches']
    ]
  },
  {
    id: 'intro-passage-via',
    level: 'intro',
    storyId: 'intro-via',
    title: 'The letter at home',
    latin: [
      'Iulia et pater in villa sedent. Mater in culina est.',
      'Iulia matri epistulam ostendit. "Ecce, mater!" inquit.',
      'Mater epistulam legit et ridet. "Euge! Epistula bona est."',
      'Tum familia cenam parat. Canis sub mensa sedet.',
      'Iulia cani cibum dat. Mater dicit: "Nunc cenamus."'
    ].join('\n'),
    glossary: [
      ['sedent', 'sit'],
      ['culina', 'kitchen'],
      ['ostendit', 'shows'],
      ['legit', 'reads'],
      ['ridet', 'laughs'],
      ['cena', 'dinner'],
      ['mensa', 'table'],
      ['dicit', 'says'],
      ['cenamus', 'we eat dinner']
    ]
  },
  {
    id: 'beginning-passage-forum',
    level: 'beginning',
    storyId: null,
    title: 'A sore foot in the Forum',
    latin: [
      'Marcus et pater in foro ambulant.',
      'Hodie pes Marci dolet. "Eheu!" inquit Marcus. "Pes meus dolet."',
      'Pater Marcum ad sellam ducit. "Sede," inquit pater.',
      'Marcus sedet. Pater aquam portat et Marco dat.',
      '"Gratias tibi ago," inquit Marcus.',
      'Tum mater venit. "Quid agis, Marce?"',
      '"Nunc bene," respondet Marcus. "Aqua bona est."'
    ].join('\n'),
    glossary: [
      ['forum, foro', 'forum, the city center'],
      ['dolet', 'hurts'],
      ['sella', 'seat'],
      ['ducit', 'leads'],
      ['sede', 'sit'],
      ['tum', 'then'],
      ['venit', 'comes'],
      ['respondet', 'answers']
    ]
  },
  {
    id: 'beginning-passage-cena',
    level: 'beginning',
    storyId: null,
    title: 'Dinner and a story',
    latin: [
      'Familia in triclinio cenat.',
      'In mensa sunt panis et aqua.',
      '"Cibum amatis?" rogat mater.',
      '"Ita vero!" clamant liberi.',
      'Post cenam pater fabulam de Romulo narrat.',
      'Liberi tacent et audiunt.',
      '"Euge!" inquit filia. "Fabula bona est."'
    ].join('\n'),
    glossary: [
      ['triclinium, triclinio', 'dining room'],
      ['cenat', 'eats dinner'],
      ['panis', 'bread'],
      ['rogat', 'asks'],
      ['liberi', 'children'],
      ['post', 'after'],
      ['fabula', 'story'],
      ['narrat', 'tells'],
      ['tacent', 'are quiet'],
      ['audiunt', 'listen']
    ]
  },
  {
    id: 'intermediate-passage-ostia',
    level: 'intermediate',
    storyId: null,
    title: 'The road to Ostia',
    latin: [
      'Marcus, qui in urbe habitat, cum patre ad Ostiam iter facit.',
      'Marcus et pater prima luce surgunt et ad portum ambulant.',
      'In portu multas naves vident.',
      'Pater dicit: "Ostia est portus Romae. Naves cibum ad urbem portant."',
      'Marcus navem magnam spectat. "Quis navem ducit?" rogat.',
      '"Gubernator," respondet pater, "qui viam per aquam scit."',
      'Post unam horam ad villam redeunt.',
      'Marcus fessus est, sed laetus. "Memoria tenebo naves," inquit.'
    ].join('\n'),
    glossary: [
      ['iter facit', 'travels'],
      ['prima luce', 'at dawn'],
      ['surgunt', 'get up'],
      ['portus, portu', 'harbor'],
      ['navis, naves', 'ship, ships'],
      ['portant', 'carry'],
      ['ducit', 'steers'],
      ['gubernator', 'helmsman'],
      ['scit', 'knows'],
      ['redeunt', 'return'],
      ['fessus', 'tired'],
      ['memoria tenebo', 'I will remember']
    ]
  },
  {
    id: 'beginning-reading-vesuvius',
    level: 'beginning-reading',
    storyId: null,
    title: 'A cloud over the mountain',
    latin: [
      'Lucia et frater in villa prope montem habitant.',
      'Mons est Vesuvius. Lucia montem cotidie videt.',
      'Una die magna nubes super montem est.',
      '"Eheu!" clamat frater. "Nubes nigra est!"',
      'Mater dicit: "Nolite timere. In villa manete."',
      'Liberi in cubiculo sedent et audiunt.',
      'Pater postea dicit: "Mons nunc tacet. Bene valetis. Dormite."'
    ].join('\n'),
    glossary: [
      ['prope', 'near'],
      ['mons, montem', 'mountain'],
      ['cotidie', 'every day'],
      ['una die', 'on one day'],
      ['nubes', 'cloud'],
      ['super', 'above'],
      ['nolite timere', 'do not be afraid'],
      ['manete', 'stay'],
      ['postea', 'afterward'],
      ['tacet', 'is quiet'],
      ['dormite', 'sleep']
    ]
  }
];

const NLE_QUESTIONS = [];

function addQuestions(items) {
  items.forEach((item) => NLE_QUESTIONS.push(item));
}

addQuestions([
  nleQ('intro-canis-01', 'intro', 'grammar', 'What does habitat tell you?', ['Marcus lives in the villa.', 'Marcus used to live in the villa.', 'Marcus will live in the villa.', 'Someone tells Marcus to leave.'], 'Marcus lives in the villa.', 'Habitat is present tense: he lives. The imperfect habitabat would mean he was living.', { storyId: 'intro-canis', order: 1, context: 'Marcus in villa habitat.' }),
  nleQ('intro-canis-02', 'intro', 'vocabulary', 'What is a villa?', ['A country house.', 'A ship.', 'A school.', 'A river.'], 'A country house.', 'Villa means a country house. Marcus lives in one.', { storyId: 'intro-canis', order: 2, context: 'Marcus in villa habitat.' }),
  nleQ('intro-canis-03', 'intro', 'grammar', 'What does Marci mean?', ['Of Marcus.', 'To Marcus.', 'Marcus, as the person speaking.', 'By Marcus.'], 'Of Marcus.', 'Marci is the genitive of Marcus. Mater Marci means the mother of Marcus. Parat means prepares.', { storyId: 'intro-canis', order: 3, context: 'Mater Marci in culina cibum parat.' }),
  nleQ('intro-canis-04', 'intro', 'grammar', 'In the sentence, cibum is', ['the direct object.', 'the subject.', 'the indirect object.', 'a preposition.'], 'the direct object.', 'Cibum is accusative. Mother prepares the food, so the food receives the action.', { storyId: 'intro-canis', order: 4, context: 'Mater Marci in culina cibum parat.' }),
  nleQ('intro-canis-05', 'intro', 'grammar', 'Why is the name Marce, not Marcus?', ['Mother is speaking to Marcus.', 'Marcus is the direct object.', 'The name is plural.', 'The name shows possession.'], 'Mother is speaking to Marcus.', 'Marce is the vocative, the form used when you address someone. Inquit means says.', { storyId: 'intro-canis', order: 5, context: '"Marce," inquit mater, "ubi est canis?"' }),
  nleQ('intro-canis-06', 'intro', 'vocabulary', 'What does ubi ask?', ['Where?', 'Who?', 'When?', 'Why?'], 'Where?', 'Ubi asks where. Cur asks why.', { storyId: 'intro-canis', order: 6, context: '"Marce," inquit mater, "ubi est canis?"' }),
  nleQ('intro-canis-07', 'intro', 'grammar', 'Why is the form atrio, not atrium?', ['In means "in," so the noun is ablative.', 'The dog is the direct object.', 'Atrio is a verb.', 'The noun is vocative.'], 'In means "in," so the noun is ablative.', 'In meaning in or on takes the ablative: in atrio, in the atrium. In plus the accusative would mean into.', { storyId: 'intro-canis', order: 7, context: 'Canis in atrio est.' }),
  nleQ('intro-canis-08', 'intro', 'vocabulary', 'What is an atrium?', ['The central hall of a Roman house.', 'The kitchen.', 'The road.', 'The dinner.'], 'The central hall of a Roman house.', 'The atrium was the main central room of a Roman house.', { storyId: 'intro-canis', order: 8, context: 'Canis in atrio est.' }),
  nleQ('intro-canis-09', 'intro', 'grammar', 'What job does canem do in the sentence?', ['It is the direct object.', 'It is the subject.', 'It shows possession.', 'It is a verb.'], 'It is the direct object.', 'Canem is the accusative of canis. Sister and Marcus see the dog.', { storyId: 'intro-canis', order: 9, context: 'Soror et Marcus canem vident.' }),
  nleQ('intro-canis-10', 'intro', 'grammar', 'What does vident mean?', ['They see.', 'He sees.', 'They saw.', 'To see.'], 'They see.', 'Vident is present tense, they see. Videt would mean he or she sees. The infinitive is videre.', { storyId: 'intro-canis', order: 10, context: 'Soror et Marcus canem vident.' }),
  nleQ('intro-canis-11', 'intro', 'vocabulary', 'What does the dog drink?', ['Water.', 'Bread.', 'Milk.', 'Wine.'], 'Water.', 'Aquam means water. Bibit means drinks.', { storyId: 'intro-canis', order: 11, context: 'Canis aquam bibit.' }),
  nleQ('intro-canis-12', 'intro', 'grammar', 'What does in atrium mean here?', ['Into the atrium.', 'In the atrium.', 'Away from the atrium.', 'Without the atrium.'], 'Into the atrium.', 'Atrium is accusative, so in means into. Subito means suddenly, and currit means runs.', { storyId: 'intro-canis', order: 12, context: 'Subito feles in atrium currit.' }),
  nleQ('intro-canis-13', 'intro', 'oral', 'What feeling does eheu express?', ['Dismay, like "oh no."', 'A hello.', 'Thanks.', 'A yes answer.'], 'Dismay, like "oh no."', 'Eheu is an exclamation of dismay. Clamat means shouts.', { storyId: 'intro-canis', order: 13, context: '"Eheu!" clamat soror.' }),
  nleQ('intro-canis-14', 'intro', 'grammar', 'What does feli mean?', ['To the cat.', 'Of the cat.', 'The cat, as the subject.', 'By the cat.'], 'To the cat.', 'Feli is dative, the indirect object. Marcus gives food to the cat. Cibum is what he gives.', { storyId: 'intro-canis', order: 14, context: 'Marcus feli cibum dat.' }),
  nleQ('intro-canis-15', 'intro', 'derivatives', 'The English word feline comes from which Latin word?', ['Feles.', 'Filius.', 'Femina.', 'Forum.'], 'Feles.', 'Feles means cat. Feline describes something related to a cat.', { storyId: 'intro-canis', order: 15, context: 'Marcus feli cibum dat.' }),
  nleQ('intro-canis-16', 'intro', 'mottoes', 'What does tempus fugit mean?', ['Time flies.', 'Time stands still.', 'The dog runs.', 'The weather is bad.'], 'Time flies.', 'Tempus means time, and fugit means flees. The saying reminds us that time passes.', { storyId: 'intro-canis', order: 16, context: 'Tempus fugit, sed pater ridet.' }),
  nleQ('intro-canis-17', 'intro', 'oral', 'What does ecce mean?', ['Look!', 'Goodbye!', 'No!', 'Thank you!'], 'Look!', 'Ecce means look. In arbore means in the tree, because arbore is ablative.', { storyId: 'intro-canis', order: 17, context: '"Ecce!" inquit pater. "Feles in arbore est."' }),
  nleQ('intro-canis-18', 'intro', 'grammar', 'What does laudant mean?', ['They praise.', 'He praises.', 'They were praising.', 'To praise.'], 'They praise.', 'Laudant is present, they praise. They were praising would be laudabant. Marcum is the accusative of Marcus.', { storyId: 'intro-canis', order: 18, context: 'Mater et pater Marcum laudant.' }),

  nleQ('intro-via-01', 'intro', 'grammar', 'What does portat mean?', ['She carries.', 'She carried.', 'They carry.', 'To carry.'], 'She carries.', 'Portat is present tense, she carries. The imperfect portabat would mean she was carrying.', { storyId: 'intro-via', order: 1, context: 'Iulia epistulam in via portat.' }),
  nleQ('intro-via-02', 'intro', 'vocabulary', 'What is an epistula?', ['A letter.', 'A horse.', 'A gate.', 'A dinner.'], 'A letter.', 'Epistula means a letter. Iulia carries one on the road, the via.', { storyId: 'intro-via', order: 2, context: 'Iulia epistulam in via portat.' }),
  nleQ('intro-via-03', 'intro', 'grammar', 'What does Iuliae mean?', ['Of Julia.', 'To the road.', 'Julia, speaking.', 'By Julia.'], 'Of Julia.', 'Iuliae is genitive. Pater Iuliae means the father of Julia. Expectat means waits for.', { storyId: 'intro-via', order: 3, context: 'Pater Iuliae prope portam expectat.' }),
  nleQ('intro-via-04', 'intro', 'grammar', 'Which case follows prope?', ['Accusative.', 'Ablative.', 'Genitive.', 'Vocative.'], 'Accusative.', 'Prope means near and takes the accusative: prope portam, near the gate.', { storyId: 'intro-via', order: 4, context: 'Pater Iuliae prope portam expectat.' }),
  nleQ('intro-via-05', 'intro', 'oral', 'Father says "Salve, Iulia!" What does salve mean?', ['Hello, to one person.', 'Hello, to a group.', 'Goodbye, to one person.', 'Thank you.'], 'Hello, to one person.', 'Salve greets one person. Salvete greets more than one. Vale means goodbye.', { storyId: 'intro-via', order: 5, context: '"Salve, Iulia!" inquit pater.' }),
  nleQ('intro-via-06', 'intro', 'oral', 'What does quid agis ask?', ['How are you doing?', 'What is your name?', 'Where is the dog?', 'Who is it?'], 'How are you doing?', 'Quid agis asks how you are doing. Quid est nomen tibi asks your name.', { storyId: 'intro-via', order: 6, context: '"Salve, pater!" respondet Iulia. "Quid agis?"' }),
  nleQ('intro-via-07', 'intro', 'grammar', 'What does tibi mean in this sentence?', ['To you.', 'Of you.', 'You, as the subject.', 'With you.'], 'To you.', 'Tibi is the dative of tu. Mother gives the letter to the father. Epistulam is the direct object.', { storyId: 'intro-via', order: 7, context: '"Mater tibi epistulam dat," inquit Iulia.' }),
  nleQ('intro-via-08', 'intro', 'grammar', 'What does the ending -ne do?', ['It asks a yes-or-no question.', 'It means and.', 'It makes the verb past.', 'It shows possession.'], 'It asks a yes-or-no question.', 'Portasne asks "Are you carrying?" The statement would be epistulam portas.', { storyId: 'intro-via', order: 8, context: '"Portasne epistulam?" rogat pater.' }),
  nleQ('intro-via-09', 'intro', 'grammar', 'What does -que mean?', ['And.', 'Not.', 'Where.', 'Look.'], 'And.', '-que is attached to the second word and means and. Pater materque means father and mother.', { storyId: 'intro-via', order: 9, context: 'Pater materque Iuliam laudant.' }),
  nleQ('intro-via-10', 'intro', 'grammar', 'What does laudant mean here?', ['They praise.', 'She praises.', 'They were praising.', 'Praise!'], 'They praise.', 'Laudant is present, they praise. Iuliam is accusative because Julia receives the praise.', { storyId: 'intro-via', order: 10, context: 'Pater materque Iuliam laudant.' }),
  nleQ('intro-via-11', 'intro', 'oral', 'What does gratias tibi ago mean?', ['Thank you.', 'Hello.', 'What is your name?', 'I am absent.'], 'Thank you.', 'Gratias tibi ago means I give thanks to you. Euge is a happy exclamation.', { storyId: 'intro-via', order: 11, context: '"Euge! Gratias tibi ago," inquit pater.' }),
  nleQ('intro-via-12', 'intro', 'grammar', 'What does ad villam mean?', ['To the country house.', 'In the country house.', 'Away from the country house.', 'Without the country house.'], 'To the country house.', 'Ad takes the accusative and means to or toward. Ambulant means they walk.', { storyId: 'intro-via', order: 12, context: 'Iulia et pater ad villam ambulant.' }),
  nleQ('intro-via-13', 'intro', 'vocabulary', 'What is a canis?', ['A dog.', 'A cat.', 'A horse.', 'A book.'], 'A dog.', 'Canis means dog. The dog sees Julia and runs.', { storyId: 'intro-via', order: 13, context: 'Canis Iuliam videt et currit.' }),
  nleQ('intro-via-14', 'intro', 'grammar', 'Why is Iuliam accusative?', ['Julia is the direct object.', 'Julia is speaking.', 'Julia owns the dog.', 'Julia is plural.'], 'Julia is the direct object.', 'Videt means sees. The dog sees Julia, so Iuliam is accusative.', { storyId: 'intro-via', order: 14, context: 'Canis Iuliam videt et currit.' }),
  nleQ('intro-via-15', 'intro', 'derivatives', 'The English word portable comes from which Latin word?', ['Porto.', 'Porta.', 'Pater.', 'Paro.'], 'Porto.', 'Porto, portare means to carry. Portable describes something that can be carried. Porta means gate.', { storyId: 'intro-via', order: 15, context: 'Iulia epistulam portat.' }),
  nleQ('intro-via-16', 'intro', 'mottoes', 'What does et cetera mean?', ['And the other things.', 'And the first thing.', 'Before noon.', 'Note well.'], 'And the other things.', 'Et cetera, abbreviated etc., means and the other things. It comes after a list.', { storyId: 'intro-via', order: 16, context: 'Iulia portat epistulam, pennam, librum, etc.' }),
  nleQ('intro-via-17', 'intro', 'grammar', 'What does sumus mean?', ['We are.', 'I am.', 'They are.', 'He was.'], 'We are.', 'Sumus is the present of sum for we. Sum means I am, and sunt means they are.', { storyId: 'intro-via', order: 17, context: '"Nunc in villa sumus," inquit Iulia.' }),
  nleQ('intro-via-18', 'intro', 'grammar', 'Why is villa ablative in "in villa"?', ['In means "in," not "into."', 'Villa is the direct object.', 'Villa is vocative.', 'The phrase means to the house.'], 'In means "in," not "into."', 'In villa means in the country house. Into the house would use the accusative: in villam.', { storyId: 'intro-via', order: 18, context: '"Nunc in villa sumus," inquit Iulia.' })
]);
