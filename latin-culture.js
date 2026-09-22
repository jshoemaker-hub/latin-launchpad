const LATIN_CULTURE_CARDS = [
  {
    id: 'via-appia',
    title: 'The Appian Way',
    latinTitle: 'Via Appia',
    summary: 'Roman roads carried messages, trade, and armies across the empire. The Appian Way connected Rome with Brundisium, a port facing Greece and the eastern Mediterranean.',
    connection: 'The word via still appears in English when we describe the route something takes.',
    linkedWords: ['via', 'miles', 'ager'],
    minGrade: 3,
    sourceImages: ['IMG_2450.jpeg'],
    mark: 'V'
  },
  {
    id: 'janus',
    title: 'Janus and Beginnings',
    latinTitle: 'Ianus',
    summary: 'Romans pictured Janus with two faces, looking toward both beginnings and endings. He was associated with gates and doors, and January takes its name from him.',
    connection: 'A doorway can mark both an entrance and an exit, which made it a fitting symbol for Janus.',
    linkedWords: ['porta', 'annus'],
    minGrade: 3,
    sourceImages: ['IMG_2453.jpeg'],
    mark: 'I'
  },
  {
    id: 'hannibal-carthage',
    title: 'Hannibal at the Gates',
    latinTitle: 'Hannibal ad portas',
    summary: 'Hannibal of Carthage became one of Rome\'s most feared opponents. The warning Hannibal ad portas came to mean that serious danger was very near.',
    connection: 'The phrase pairs a famous historical figure with porta, the Latin word for a gate.',
    linkedWords: ['porta', 'bellum', 'exercitus', 'miles'],
    minGrade: 5,
    sourceImages: ['IMG_2456.jpeg'],
    mark: 'H'
  },
  {
    id: 'ara-pacis',
    title: 'An Altar for Peace',
    latinTitle: 'Ara Pacis',
    summary: 'The Ara Pacis was dedicated during the reign of Augustus. Its carved scenes connected peace, prosperity, family, and Rome\'s public life.',
    connection: 'Pax Romana names the long period of relative peace associated with Rome\'s early empire.',
    linkedWords: ['pax', 'familia', 'terra'],
    minGrade: 5,
    sourceImages: ['IMG_2462.jpeg'],
    mark: 'P'
  },
  {
    id: 'livy-history',
    title: 'Livy Writes Rome\'s History',
    latinTitle: 'Ab Urbe Condita',
    summary: 'The historian Livy wrote a huge account of Rome from its legendary founding through his own time. Only part of that work survives today.',
    connection: 'Ab Urbe Condita means "from the founding of the city," with Rome understood as the city.',
    linkedWords: ['urbs', 'fabula', 'liber'],
    minGrade: 6,
    sourceImages: ['IMG_2455.jpeg'],
    mark: 'L'
  },
  {
    id: 'constantine-arch',
    title: 'The Arch of Constantine',
    latinTitle: 'Arcus Constantini',
    summary: 'This triumphal arch commemorated Constantine\'s victory near the Milvian Bridge. Its decoration reused reliefs from monuments honoring earlier emperors.',
    connection: 'The story is often paired with In hoc signo vinces: "In this sign you will conquer."',
    linkedWords: ['arcus', 'signum', 'victoria', 'imperator'],
    minGrade: 6,
    sourceImages: ['IMG_2460.jpeg'],
    mark: 'C'
  },
  {
    id: 'ager-vaticanus',
    title: 'The Vatican Field',
    latinTitle: 'Ager Vaticanus',
    summary: 'In antiquity the Vatican area stood outside Rome and included burial grounds. Constantine built an early basilica there, centuries before the present St. Peter\'s Basilica took shape.',
    connection: 'Ager means a field or tract of land, while Vaticanus identifies the place.',
    linkedWords: ['ager', 'campus', 'urbs'],
    minGrade: 5,
    sourceImages: ['IMG_2451.jpeg'],
    mark: 'V'
  },
  {
    id: 'pont-du-gard',
    title: 'Water Across a Bridge',
    latinTitle: 'Pont du Gard',
    summary: 'Roman aqueducts carried water toward towns and cities using a carefully controlled slope. The Pont du Gard in southern France is one of the best-known surviving aqueduct bridges.',
    connection: 'Pons means bridge, and aqua gives English words such as aqueduct and aquatic.',
    linkedWords: ['pons', 'aqua', 'urbs'],
    minGrade: 4,
    sourceImages: ['IMG_2452.jpeg'],
    mark: 'A'
  },
  {
    id: 'hadrians-wall',
    title: 'Hadrian\'s Wall',
    latinTitle: 'Vallum Hadriani',
    summary: 'Hadrian\'s Wall crossed northern Britain and marked a defended frontier of the Roman Empire. Forts and milecastles helped soldiers control movement along it.',
    connection: 'Vallum can mean a defensive wall or rampart built for military protection.',
    linkedWords: ['vallum', 'miles', 'imperium'],
    minGrade: 5,
    sourceImages: ['IMG_2457.jpeg'],
    mark: 'H'
  },
  {
    id: 'antonine-wall',
    title: 'A Frontier Farther North',
    latinTitle: 'Vallum Antonini',
    summary: 'The Antonine Wall was built across central Scotland after Roman forces moved north of Hadrian\'s Wall. Rome held it only briefly before returning to the older frontier.',
    connection: 'Comparing the two walls shows how an empire can advance and later consolidate its borders.',
    linkedWords: ['vallum', 'miles', 'imperator'],
    minGrade: 6,
    sourceImages: ['IMG_2458.jpeg'],
    mark: 'A'
  },
  {
    id: 'trajan-column',
    title: 'A Story Carved in Stone',
    latinTitle: 'Columna Traiani',
    summary: 'Trajan\'s Column commemorated Roman campaigns in Dacia. A long spiral band of relief sculpture winds upward, showing soldiers, camps, travel, and battle scenes.',
    connection: 'The monument works like a continuous picture narrative wrapped around a columna.',
    linkedWords: ['columna', 'miles', 'victoria'],
    minGrade: 5,
    sourceImages: ['IMG_2463.jpeg'],
    mark: 'T'
  },
  {
    id: 'cincinnatus-fasces',
    title: 'Cincinnatus Returns to His Field',
    latinTitle: 'Cincinnatus et Fasces',
    summary: 'Roman tradition praised Cincinnatus for accepting emergency authority, completing his task, and then returning power to resume work on his farm.',
    connection: 'Fasces symbolized public authority, while ager recalls the field to which Cincinnatus returned.',
    linkedWords: ['ager', 'dux', 'civis'],
    minGrade: 6,
    sourceImages: ['IMG_2467.jpeg'],
    mark: 'C'
  },
  {
    id: 'fall-of-rome',
    title: 'Rome Is Captured',
    latinTitle: 'Capitur Urbs',
    summary: 'Alaric\'s forces entered Rome in A.D. 410, a shock across the Roman world. Jerome lamented that the city which had captured the world was itself captured.',
    connection: 'Capitur and cepit come from capio, letting one verb connect the two halves of the lament.',
    linkedWords: ['capio', 'urbs', 'mundus'],
    minGrade: 8,
    sourceImages: ['IMG_2471.jpeg'],
    mark: 'R'
  },
  {
    id: 'roman-alphabet',
    title: 'Latin Letters and English Words',
    latinTitle: 'Litterae Latinae',
    summary: 'The English alphabet comes from the Latin alphabet, though later writing added letters and habits such as J and the separate vowel U. Older Roman inscriptions often used V for both vowel and consonant sounds.',
    connection: 'Students can see continuity between ordinary English letters and the older Latin lettering still carved on monuments.',
    linkedWords: ['littera', 'verbum', 'liber'],
    minGrade: 3,
    sourceImages: ['IMG_2493.jpeg', 'IMG_2494.jpeg'],
    mark: 'L'
  },
  {
    id: 'roman-world-map',
    title: 'The Roman World Around the Sea',
    latinTitle: 'Mare Internum',
    summary: 'Roman geography centered on the Mediterranean, with roads and sea routes linking Italy, Gaul, Spain, Africa, Greece, Asia, Syria, and Egypt. Rome called this sea Mare Nostrum, "Our Sea."',
    connection: 'Modern Europe, North Africa, and the Near East still show Roman place names, roads, ruins, and legal memory.',
    linkedWords: ['mare', 'Italia', 'provincia', 'portus'],
    minGrade: 5,
    sourceImages: ['IMG_2498.jpeg'],
    mark: 'M'
  },
  {
    id: 'ennius-cato-carthage',
    title: 'Early Latin Writers and Carthage',
    latinTitle: 'Ennius et Cato',
    summary: 'Ennius was remembered as an early father of Latin literature, while Cato the Elder wrote old Latin prose and pressed for Carthage to be destroyed after Rome\'s long conflict with that rival city.',
    connection: 'A classical Christian reading can admire literary memory while judging cruelty and slavery by a higher moral law than Roman glory.',
    linkedWords: ['litterae', 'bellum', 'ager', 'servus'],
    minGrade: 7,
    sourceImages: ['IMG_2499.jpeg'],
    mark: 'E'
  },
  {
    id: 'romulus-remus-reading',
    title: 'Romulus and Remus',
    latinTitle: 'Romulus et Remus',
    summary: 'The traditional founding story tells of Rhea Silvia, Mars, the twins Romulus and Remus, the river, the she-wolf, and the building of Rome. It is legend, not Scripture, but it helps students understand Roman identity.',
    connection: 'The story lets students compare pagan heroic legends with Christian teaching about providence, humility, and the dignity of every person.',
    linkedWords: ['lupa', 'filius', 'aqua', 'aedifico', 'Roma'],
    minGrade: 4,
    sourceImages: ['IMG_2500.jpeg'],
    mark: 'R'
  },
  {
    id: 'city-of-rome-map',
    title: 'A Walk Through Rome',
    latinTitle: 'Urbs Roma',
    summary: 'A city map places the Forum, Capitoline Hill, Palatine Hill, Circus Maximus, Colosseum, Via Sacra, temples, and the Tiber in relation to one another.',
    connection: 'Modern civic spaces still echo Rome: capitals, courts, public squares, arches, and ceremonial roads all borrow Roman habits of public architecture.',
    linkedWords: ['urbs', 'forum', 'via', 'templum', 'collis'],
    minGrade: 5,
    sourceImages: ['IMG_2539.jpeg'],
    mark: 'U'
  },
  {
    id: 'roman-war-peace',
    title: 'War, Peace, and Roman Power',
    latinTitle: 'Arma et Pax',
    summary: 'Roman authors left sharp phrases about war and peace, from weapons yielding to the toga to Tacitus\' warning that conquerors can make a desert and call it peace.',
    connection: 'A Christian classical approach can distinguish ordered peace from mere domination and ask whether power serves justice, mercy, and the common good.',
    linkedWords: ['arma', 'pax', 'bellum', 'patria', 'toga'],
    minGrade: 7,
    sourceImages: ['IMG_2540.jpeg'],
    mark: 'P'
  },
  {
    id: 'roman-food-triclinium',
    title: 'Dinner in the Triclinium',
    latinTitle: 'Cena Romana',
    summary: 'Romans commonly named three meals: ientaculum, prandium, and cena. Dinner was the chief meal and could be eaten reclining in a triclinium, with handwashing, bread, fruit, vegetables, wine, knives, spoons, and napkins.',
    connection: 'Modern table customs still show that meals are moral habits as well as food: hospitality, gratitude, moderation, and fellowship matter more than display.',
    linkedWords: ['cena', 'cibus', 'mensa', 'panis', 'vinum'],
    minGrade: 3,
    sourceImages: ['IMG_2541.jpeg'],
    mark: 'C'
  },
  {
    id: 'roman-authors-timeline',
    title: 'A Library Across the Centuries',
    latinTitle: 'Auctores Romani',
    summary: 'The reading timeline runs from Plautus and Terence through Cicero, Caesar, Vergil, Livy, Seneca, Augustine, and Boethius. It shows Latin changing from the language of the Republic into a language of Christian theology and medieval learning.',
    connection: 'Modern drama, rhetoric, history, poetry, philosophy, and theology still converse with these authors. Augustine and Boethius show Christians receiving classical learning while correcting it in the light of revealed truth.',
    linkedWords: ['poeta', 'orator', 'litterae', 'liber', 'scientia'],
    minGrade: 7,
    sourceImages: ['IMG_2501.jpeg'],
    mark: 'A'
  },
  {
    id: 'roman-government-republic',
    title: 'Senate, People, and Magistrates',
    latinTitle: 'Senatus Populusque Romanus',
    summary: 'Roman government changed from kingship to republic and later to imperial rule. In the Republic, assemblies elected magistrates, consuls led the state and armies, and the Senate supplied experienced counsel, though citizenship and political power remained unequal.',
    connection: 'Modern republics inherited Roman civic vocabulary, offices, architecture, and legal ideas. A Christian judgment values ordered liberty and the common good while rejecting slavery, corruption, and the idea that power makes an act just.',
    linkedWords: ['senatus', 'consul', 'civis', 'lex', 'imperator', 'curia'],
    minGrade: 6,
    sourceImages: ['IMG_2521.jpeg', 'IMG_2522.jpeg', 'IMG_2539.jpeg'],
    mark: 'S'
  },
  {
    id: 'rome-republic-expansion',
    title: 'From Republic to Mediterranean Power',
    latinTitle: 'Res Publica Crescit',
    summary: 'After the traditional founding date of 753 BC and the beginning of the Republic in 509 BC, Rome gradually controlled Italy. The Punic Wars brought victory over Carthage, but conquest also increased wealth, slavery, military ambition, and political conflict.',
    connection: 'Roman roads, languages, and laws spread widely, but material success did not cure moral disorder. The period invites students to ask whether victory serves justice or merely enlarges power.',
    linkedWords: ['res', 'publicus', 'bellum', 'Carthago', 'victoria', 'servus'],
    minGrade: 7,
    sourceImages: ['IMG_2521.jpeg', 'IMG_2522.jpeg'],
    mark: 'R'
  },
  {
    id: 'augustus-roman-empire',
    title: 'Augustus and the Roman Empire',
    latinTitle: 'Imperium Romanum',
    summary: 'Civil wars and Julius Caesar\'s death ended the old republican order. Octavian became Augustus in 27 BC and established a durable imperial system that kept republican titles while concentrating authority in one ruler.',
    connection: 'The Pax Romana aided travel, trade, and communication across the Mediterranean world, the same world in which Christ was born and the apostles carried the Gospel.',
    linkedWords: ['imperium', 'imperator', 'pax', 'via', 'provincia'],
    minGrade: 6,
    sourceImages: ['IMG_2522.jpeg', 'IMG_2523.jpeg'],
    mark: 'I'
  },
  {
    id: 'christianity-late-rome',
    title: 'Christians in the Later Roman World',
    latinTitle: 'Ecclesia et Imperium',
    summary: 'Christians endured periods of Roman persecution before Constantine and Licinius granted toleration in AD 313. Augustine wrote as the western empire weakened; the western imperial office ended in AD 476, while Roman law and the eastern empire continued.',
    connection: 'The Church did not depend on Rome\'s political permanence. Christians preserved and transformed classical learning, while writers such as Augustine taught that no earthly city can replace the City of God.',
    linkedWords: ['Christianus', 'ecclesia', 'lex', 'urbs', 'aeternus'],
    minGrade: 7,
    sourceImages: ['IMG_2523.jpeg', 'IMG_2524.jpeg'],
    mark: 'C'
  },
  {
    id: 'roman-gods-language',
    title: 'Roman Gods as Myth and Language',
    latinTitle: 'Dei Romanorum',
    summary: 'Roman stories named Jupiter, Mars, Venus, Mercury, Apollo, Vesta, Cupid, and Fortuna. Their tales explained civic rituals, family customs, nature, love, war, poetry, and the household hearth within Roman pagan culture.',
    connection: 'Their names survive in planets, months, weekdays, art, and English words. Students can understand these myths without treating them as true worship: classical Christian study distinguishes created things and poetic stories from the one Creator.',
    linkedWords: ['Iuppiter', 'Mars', 'Venus', 'Mercurius', 'Apollo', 'Vesta', 'Cupido', 'fortuna'],
    minGrade: 5,
    sourceImages: ['IMG_2532.jpeg', 'IMG_2534.jpeg', 'IMG_2535.jpeg', 'IMG_2538.jpeg'],
    mark: 'D'
  },
  {
    id: 'roman-dress-status',
    title: 'Roman Dress and Public Identity',
    latinTitle: 'Vestimenta Romana',
    summary: 'A tunic was ordinary clothing for men, women, and children. Adult male citizens could wear the toga for formal public life, while women commonly wore longer garments; clothing, borders, and jewelry could communicate age, office, wealth, and status.',
    connection: 'Modern uniforms, academic gowns, courtroom robes, and formal dress still use clothing to signal a role. Christian teaching cautions that outward rank never determines a person\'s God-given dignity.',
    linkedWords: ['vestimentum', 'gero', 'civis', 'vir', 'femina'],
    minGrade: 4,
    sourceImages: ['IMG_2527.jpeg', 'IMG_2535.jpeg', 'IMG_2538.jpeg'],
    mark: 'V'
  },
  {
    id: 'latin-abbreviations-today',
    title: 'Latin Hidden in Everyday Writing',
    latinTitle: 'Latine Cotidie',
    summary: 'Common forms such as AD, e.g., etc., P.S., ex libris, verbatim, and vade mecum preserve Latin in calendars, notes, books, and careful writing. Medieval scribes also helped shape the modern at-sign from forms related to apud.',
    connection: 'Latin is not only ancient: it remains embedded in modern publishing, scholarship, law, science, and digital communication.',
    linkedWords: ['annus', 'dominus', 'ex', 'liber', 'verbum', 'apud'],
    minGrade: 5,
    sourceImages: ['IMG_2502.jpeg', 'IMG_2543.jpeg'],
    mark: '@'
  },
  {
    id: 'twelve-tables-law',
    title: 'The Twelve Tables and Written Law',
    latinTitle: 'Leges Duodecim Tabularum',
    summary: 'Tradition dates the Twelve Tables to 451-450 BC. Publishing basic laws made legal expectations more visible, though Roman law still reflected an unequal society and developed greatly over later centuries.',
    connection: 'Written statutes, public legal procedure, and civic duties remain central to modern government. Classical Christian thought adds that human law should answer to natural law and genuine justice.',
    linkedWords: ['lex', 'tabella', 'civis', 'iudex'],
    minGrade: 6,
    sourceImages: ['IMG_2521.jpeg'],
    mark: 'XII'
  },
  {
    id: 'roman-civil-wars',
    title: 'Civil War and the End of the Republic',
    latinTitle: 'Bella Civilia',
    summary: 'Conflict involving Marius, Sulla, Spartacus, Catiline, Caesar, Pompey, Antony, and Octavian weakened republican government. Caesar crossed the Rubicon in 49 BC and was assassinated in 44 BC; Octavian defeated Antony and Cleopatra at Actium in 31 BC.',
    connection: 'The sequence shows how ambition, political violence, and military loyalty can hollow out lawful institutions. Ordered government requires virtue as well as rules.',
    linkedWords: ['bellum', 'consul', 'senatus', 'imperator', 'lex'],
    minGrade: 8,
    sourceImages: ['IMG_2521.jpeg', 'IMG_2522.jpeg'],
    mark: 'B'
  },
  {
    id: 'pompeii-vesuvius',
    title: 'Pompeii and Vesuvius',
    latinTitle: 'Vesuvius Erumpit',
    summary: 'Pompeii suffered an earthquake in AD 63 and was buried during the eruption of Vesuvius in AD 79. The preserved city gives unusually detailed evidence for Roman homes, shops, streets, meals, art, and ordinary writing.',
    connection: 'Archaeology makes daily Roman life tangible while also recalling the fragility of earthly wealth and cities.',
    linkedWords: ['Vesuvius', 'urbs', 'domus', 'taberna', 'cinis'],
    minGrade: 5,
    sourceImages: ['IMG_2523.jpeg'],
    mark: 'P'
  },
  {
    id: 'constantinople-justinian',
    title: 'Constantinople and Justinian',
    latinTitle: 'Roma Orientalis',
    summary: 'Constantine established Constantinople as an imperial capital in AD 330. The eastern Roman Empire continued after the western imperial office ended; Justinian ruled from AD 527 to 565 and sponsored a major organization of Roman law.',
    connection: 'Justinian\'s legal work influenced later civil-law traditions, while Constantinople preserved Roman and Christian learning until its fall in 1453.',
    linkedWords: ['imperium', 'lex', 'urbs', 'Christianus', 'aeternus'],
    minGrade: 7,
    sourceImages: ['IMG_2524.jpeg'],
    mark: 'J'
  },
  {
    id: 'trevi-fountain',
    title: 'The Trevi Fountain',
    latinTitle: 'Fons Trevi',
    summary: 'Third Form introduces the Trevi Fountain as a famous modern Roman landmark at the terminus of the ancient Virgo Aqueduct. The aqueduct served Rome with fresh water for centuries before later rebuilding and the baroque fountain completed in 1762.',
    connection: 'The card links aqua, fons, urbs, and Roman engineering so students can see ancient infrastructure inside modern Rome.',
    linkedWords: ['aqua', 'fons', 'urbs', 'Roma', 'aedifico'],
    minGrade: 5,
    sourceImages: ['IMG_2628.jpeg'],
    mark: 'T'
  },
  {
    id: 'dies-irae-sequence',
    title: 'The Dies Irae',
    latinTitle: 'Dies Irae',
    summary: 'Third Form describes the Dies Irae as a medieval Latin sequence associated with the Requiem Mass and traditionally attributed to Thomas of Celano. Its opening words became one of the most recognizable Latin texts in sacred music.',
    connection: 'The phrase lets older students connect dies, ira, judgment, poetry, and musical settings such as Mozart\'s Requiem.',
    linkedWords: ['dies', 'ira', 'carmen', 'tempus'],
    minGrade: 7,
    sourceImages: ['IMG_2640.jpeg'],
    mark: 'D'
  }
];

function normalizeCultureTerm(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

function getCultureCardForLesson(grade, lessonWords, lessonIndex = 0) {
  const lessonTerms = new Set(lessonWords.map((word) => normalizeCultureTerm(word.latin)));
  const matches = LATIN_CULTURE_CARDS
    .filter((card) => grade >= (card.minGrade || 3) && grade <= (card.maxGrade || 8))
    .map((card) => ({
      card,
      score: card.linkedWords.filter((word) => lessonTerms.has(normalizeCultureTerm(word))).length
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (matches.length === 0) return null;
  return matches[lessonIndex % matches.length].card;
}
