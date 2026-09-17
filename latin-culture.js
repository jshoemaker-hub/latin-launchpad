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
