const LATIN_STORY_SCENES = [
  {
    id: 'forum-market',
    title: 'Marcus et Lucia in Foro Romano',
    englishTitle: 'Marcus and Lucia in the Roman Forum',
    sourceUrl: 'https://discoverlatin.com/marcus-et-lucia-in-foro-romano/',
    summary: 'A family visits the forum, buys fruit and bread, and notices Roman coins.',
    teacherMove: 'Use it for a buyer/seller dialogue after students practice people, food, and place words.',
    latinCue: 'Lucia uvas emit in foro.',
    englishCue: 'Lucia buys grapes in the forum.',
    listenFor: ['forum', 'via', 'taberna', 'panis', 'nummus'],
    pictureCue: 'A busy Roman market with a fruit stall, bread, coins, and two curious children.',
    illustrationPrompt:
      'Children\'s textbook illustration of Marcus and Lucia shopping with their father in the Roman Forum, fruit stall, bread seller, denarius coin, warm daylight, historically plausible Roman clothing, no text.',
    visual: {
      icons: ['🏛️', '🍇', '🪙'],
      bg: '#fff3d1',
      accent: '#c2410c'
    }
  },
  {
    id: 'garden-dog',
    title: 'Canis Celer in Horto Domus',
    englishTitle: 'The Fast Dog in the Garden of the House',
    sourceUrl: 'https://discoverlatin.com/canis-celer-in-horto-domus/',
    summary: 'A dog in a Roman garden chases a cat, then bravely protects the household.',
    teacherMove: 'Use it for action verbs and concrete picture words: dog, garden, tree, table, run.',
    latinCue: 'Rufus in horto currit.',
    englishCue: 'Rufus runs in the garden.',
    listenFor: ['canis', 'hortus', 'arbor', 'mensa', 'currit'],
    pictureCue: 'A white dog under a garden tree, flowers nearby, and motion across the grass.',
    illustrationPrompt:
      'Children\'s textbook illustration of a white Roman house dog running through a villa garden with flowers, a tree, and a marble table, playful but calm, historically plausible setting, no text.',
    visual: {
      icons: ['🌿', '🐕', '🌳'],
      bg: '#dcfce7',
      accent: '#15803d'
    }
  },
  {
    id: 'roman-baths',
    title: 'Quintus in Thermis Romanis',
    englishTitle: 'Quintus in the Roman Baths',
    sourceUrl: 'https://discoverlatin.com/quintus-in-thermis-romanis/',
    summary: 'Quintus visits the baths with his father and moves through warm, hot, and cold rooms.',
    teacherMove: 'Use it for Roman culture and sequence words: first, then, after, warm, cold.',
    latinCue: 'Quintus aquam frigidam timet.',
    englishCue: 'Quintus is afraid of the cold water.',
    listenFor: ['thermae', 'aqua', 'porta', 'corpus', 'sedeo'],
    pictureCue: 'A Roman bath interior with a pool, columns, steam, and a hesitant student at the edge.',
    illustrationPrompt:
      'Children\'s textbook illustration of a Roman bathhouse with columns, a cold pool, gentle steam, and a boy with his father, respectful classroom style, no nudity, no text.',
    visual: {
      icons: ['🏛️', '💧', '♨️'],
      bg: '#dbeafe',
      accent: '#0369a1'
    }
  },
  {
    id: 'roman-dinner',
    title: 'Cena Romana: Gaius et Servus Suus',
    englishTitle: 'A Roman Dinner: Gaius and His Servant',
    sourceUrl: 'https://discoverlatin.com/cena-romana-gaius-et-servus-suus/',
    summary: 'A household prepares dinner, shops for food, and serves guests at a Roman meal.',
    teacherMove: 'Use it for food vocabulary, household roles, and the difference between modern and Roman dining.',
    latinCue: 'Marcus cenam parat.',
    englishCue: 'Marcus prepares dinner.',
    listenFor: ['cena', 'mensa', 'cibus', 'servus', 'paro'],
    pictureCue: 'A Roman dining room with a table, bread, olives, cups, and a servant preparing food.',
    illustrationPrompt:
      'Children\'s textbook illustration of a Roman dinner preparation scene with bread, olives, cups, a low dining table, and a servant arranging food, warm interior light, no text.',
    visual: {
      icons: ['🍞', '🍽️', '🏺'],
      bg: '#fee2e2',
      accent: '#be123c'
    }
  },
  {
    id: 'farmer-wolf',
    title: 'Agricola et Lupus',
    englishTitle: 'The Farmer and the Wolf',
    sourceUrl: 'https://discoverlatin.com/agricola-et-lupus/',
    summary: 'A farmer and his faithful dog protect sheep near a country villa.',
    teacherMove: 'Use it for rural life, animal words, and simple subject-action-object sentences.',
    latinCue: 'Agricola oves custodit.',
    englishCue: 'The farmer guards the sheep.',
    listenFor: ['agricola', 'ager', 'canis', 'ovis', 'custodit'],
    pictureCue: 'A farmer by a sheepfold at twilight with a faithful dog watching the field.',
    illustrationPrompt:
      'Children\'s textbook illustration of a Roman farmer near a sheepfold at twilight with a faithful dog and sheep, gentle suspense, no gore, historically plausible farm tools, no text.',
    visual: {
      icons: ['🌾', '🐑', '🔥'],
      bg: '#fef9c3',
      accent: '#a16207'
    }
  },
  {
    id: 'school',
    title: 'Iulia et Amici in Schola',
    englishTitle: 'Julia and Her Friends in School',
    sourceUrl: 'https://discoverlatin.com/iulia-et-amici-in-schola/',
    summary: 'Iulia and her friends learn new words, write on tablets, and recite a short poem.',
    teacherMove: 'Use it before or after school vocabulary so the classroom feels familiar in Latin.',
    latinCue: 'Iulia verba nova scribit.',
    englishCue: 'Iulia writes new words.',
    listenFor: ['schola', 'magister', 'liber', 'tabula', 'scribit'],
    pictureCue: 'A Roman classroom with tablets, styluses, a teacher, and students reciting together.',
    illustrationPrompt:
      'Children\'s textbook illustration of a Roman classroom, teacher with students using wax tablets and styluses, bright focused mood, historically plausible clothing, no text.',
    visual: {
      icons: ['🏫', '📚', '✒️'],
      bg: '#ede9fe',
      accent: '#6d28d9'
    }
  },
  {
    id: 'river-boat',
    title: 'Puer et Navis in Flumine',
    englishTitle: 'The Boy and the Boat on the River',
    sourceUrl: 'https://discoverlatin.com/puer-et-navis-in-flumine/',
    summary: 'Lucius watches boats on the Tiber and imagines becoming a sailor.',
    teacherMove: 'Use it for water, travel, and aspiration sentences: I see, I go, I want.',
    latinCue: 'Lucius navem in flumine videt.',
    englishCue: 'Lucius sees a ship in the river.',
    listenFor: ['puer', 'navis', 'flumen', 'aqua', 'video'],
    pictureCue: 'A boy at the Tiber watching a boat with white sail and rowers in the water.',
    illustrationPrompt:
      'Children\'s textbook illustration of a Roman boy sitting by the Tiber River watching a boat with sailors and white sail, hopeful mood, clear vocabulary objects, no text.',
    visual: {
      icons: ['🌊', '⛵', '👦'],
      bg: '#cffafe',
      accent: '#0e7490'
    }
  },
  {
    id: 'romulus-remus',
    title: 'Romulus et Remus: Fabula Antiqua',
    englishTitle: 'Romulus and Remus: An Ancient Tale',
    sourceUrl: 'https://discoverlatin.com/romulus-et-remus-fabula-antiqua/',
    summary: 'The legendary twins grow up, choose a hill, and the founding story of Rome begins.',
    teacherMove: 'Use with older students as mythic background; keep discussion age-appropriate.',
    latinCue: 'Romulus urbem novam aedificat.',
    englishCue: 'Romulus builds a new city.',
    listenFor: ['urbs', 'rex', 'murus', 'pastor', 'aedificat'],
    pictureCue: 'Two brothers near the hills of early Rome, with a simple wall and shepherd imagery.',
    illustrationPrompt:
      'Children\'s textbook illustration of young Romulus and Remus near the hills of early Rome with a shepherd, simple stone wall, mythic but age-appropriate, no violence, no text.',
    visual: {
      icons: ['🏛️', '🧱', '👑'],
      bg: '#e0f2fe',
      accent: '#075985'
    }
  },
  {
    id: 'harbor-trade',
    title: 'Mercator et Nauta in Portu',
    englishTitle: 'Merchant and Sailor in Port',
    sourceUrl: 'https://discoverlatin.com/mercator-et-nauta-in-portu/',
    summary: 'A merchant bargains with a sailor for goods from distant places.',
    teacherMove: 'Use it for trade, geography, numbers, and polite bargaining role-play.',
    latinCue: 'Mercator piper in portu emit.',
    englishCue: 'The merchant buys pepper in the harbor.',
    listenFor: ['mercator', 'nauta', 'portus', 'navis', 'pretium'],
    pictureCue: 'A harbor with ships, amphorae, spice goods, and a merchant speaking with a sailor.',
    illustrationPrompt:
      'Children\'s textbook illustration of a Roman harbor trade scene with merchant, sailor, ships, amphorae, spices, and sunlight on the water, historically plausible, no text.',
    visual: {
      icons: ['⚓', '🏺', '🌶️'],
      bg: '#ffedd5',
      accent: '#9a3412'
    }
  },
  {
    id: 'aeneas-troy',
    title: 'Aeneas et Anchises: Iter e Troia',
    englishTitle: 'Aeneas and Anchises: Flight from Troy',
    sourceUrl: 'https://discoverlatin.com/aeneas-et-anchises-iter-e-troia/',
    summary: 'Aeneas carries his father from Troy and begins the journey toward a new future.',
    teacherMove: 'Use with grades 7-8 for duty, family, fate, and narrative sequence.',
    latinCue: 'Aeneas patrem portat.',
    englishCue: 'Aeneas carries his father.',
    listenFor: ['Aeneas', 'pater', 'filius', 'navis', 'portat'],
    pictureCue: 'Aeneas helping his father toward ships, with Troy distant and stylized in the background.',
    illustrationPrompt:
      'Children\'s textbook illustration of Aeneas carrying Anchises while leading Ascanius toward ships, Troy distant in stylized warm light, heroic and age-appropriate, no graphic danger, no text.',
    visual: {
      icons: ['🔥', '⛵', '🛡️'],
      bg: '#fed7aa',
      accent: '#b45309'
    }
  }
];

const STORY_SEQUENCE_BY_GRADE = {
  3: ['garden-dog', 'school', 'forum-market', 'river-boat', 'roman-dinner', 'farmer-wolf'],
  4: ['school', 'forum-market', 'garden-dog', 'roman-baths', 'river-boat', 'roman-dinner', 'farmer-wolf'],
  5: ['forum-market', 'roman-dinner', 'river-boat', 'harbor-trade', 'roman-baths', 'farmer-wolf', 'romulus-remus'],
  6: ['school', 'roman-baths', 'forum-market', 'roman-dinner', 'farmer-wolf', 'river-boat', 'harbor-trade', 'romulus-remus'],
  7: ['romulus-remus', 'aeneas-troy', 'harbor-trade', 'farmer-wolf', 'roman-baths', 'school', 'river-boat'],
  8: ['aeneas-troy', 'romulus-remus', 'harbor-trade', 'forum-market', 'roman-dinner', 'farmer-wolf', 'river-boat']
};

const LATIN_STORY_BY_ID = LATIN_STORY_SCENES.reduce((storiesById, story) => {
  storiesById[story.id] = story;
  return storiesById;
}, {});

function getStorySceneForLesson(grade, lessonIndex) {
  const sequence = STORY_SEQUENCE_BY_GRADE[grade] || LATIN_STORY_SCENES.map((story) => story.id);
  const storyId = sequence[lessonIndex % sequence.length];
  return LATIN_STORY_BY_ID[storyId] || null;
}
