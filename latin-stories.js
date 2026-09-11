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

// Original, project-owned picture-search scenes. Coordinates are percentages of
// each 3:2 image so the same hotspots work at every responsive size.
const LATIN_SEEK_FIND_SCENES = {
  'forum-market': {
    image: 'assets/seek-find/forum-market.jpg',
    mission: 'In foro Romano sex res reperi.',
    missionEnglish: 'Find six things in the Roman Forum.',
    targets: [
      { key: 'forum', latin: 'forum', english: 'forum', hint: 'Look high above the market.', x: 40, y: 2, w: 24, h: 22 },
      { key: 'via', latin: 'via', english: 'road', hint: 'Follow the pale stones through the crowd.', x: 43, y: 60, w: 22, h: 35 },
      { key: 'taberna', latin: 'taberna', english: 'shop', hint: 'Look beneath the striped canopy.', x: 76, y: 1, w: 23, h: 24 },
      { key: 'panis', latin: 'panis', english: 'bread', hint: 'Check the nearest table on the left.', x: 1, y: 66, w: 23, h: 21 },
      { key: 'nummus', latin: 'nummus', english: 'coin', hint: 'Someone dropped it on the road.', x: 47, y: 84, w: 9, h: 11 },
      { key: 'uvae', latin: 'uvae', english: 'grapes', hint: 'Search the baskets on the right.', x: 77, y: 68, w: 21, h: 21 }
    ]
  },
  'garden-dog': {
    image: 'assets/seek-find/garden-dog.jpg',
    mission: 'In horto villae sex res reperi.',
    missionEnglish: 'Find six things in the villa garden.',
    targets: [
      { key: 'canis', latin: 'canis', english: 'dog', hint: 'Look for a friend running across the path.', x: 31, y: 52, w: 22, h: 28 },
      { key: 'arbor', latin: 'arbor', english: 'tree', hint: 'Its branches shade the fountain.', x: 22, y: 1, w: 28, h: 35 },
      { key: 'mensa', latin: 'mensa', english: 'table', hint: 'Look near the family on the right.', x: 72, y: 38, w: 26, h: 22 },
      { key: 'felis', latin: 'felis', english: 'cat', hint: 'Only a curious face is peeking out.', x: 86, y: 70, w: 13, h: 25 },
      { key: 'rosa', latin: 'rosa', english: 'rose', hint: 'A bright bloom grows close to the left edge.', x: 2, y: 55, w: 14, h: 20 },
      { key: 'penna', latin: 'penna', english: 'feather', hint: 'Check the sunlit path near the bottom.', x: 55, y: 80, w: 17, h: 15 }
    ]
  },
  'roman-baths': {
    image: 'assets/seek-find/roman-baths.jpg',
    mission: 'In thermis Romanis sex res reperi.',
    missionEnglish: 'Find six things in the Roman baths.',
    targets: [
      { key: 'aqua', latin: 'aqua', english: 'water', hint: 'It fills the large blue pool.', x: 31, y: 49, w: 48, h: 42 },
      { key: 'porta', latin: 'porta', english: 'doorway', hint: 'Look toward the sunlit garden.', x: 1, y: 3, w: 20, h: 40 },
      { key: 'columna', latin: 'columna', english: 'column', hint: 'Find the tallest carved stone support.', x: 70, y: 1, w: 18, h: 47 },
      { key: 'ampulla', latin: 'ampulla', english: 'oil bottle', hint: 'A little green bottle rests at the lower left.', x: 1, y: 65, w: 12, h: 23 },
      { key: 'strigilis', latin: 'strigilis', english: 'strigil', hint: 'A curved bronze tool lies beside the bottle.', x: 10, y: 68, w: 18, h: 18 },
      { key: 'subsellium', latin: 'subsellium', english: 'bench', hint: 'A folded towel is draped over it.', x: 76, y: 66, w: 23, h: 33 }
    ]
  },
  'roman-dinner': {
    image: 'assets/seek-find/roman-dinner.jpg',
    mission: 'In triclinio sex res reperi.',
    missionEnglish: 'Find six things in the Roman dining room.',
    targets: [
      { key: 'panis', latin: 'panis', english: 'bread', hint: 'Look on the nearest table at lower left.', x: 1, y: 64, w: 22, h: 23 },
      { key: 'olivae', latin: 'olivae', english: 'olives', hint: 'A bowl sits on the mosaic floor.', x: 43, y: 80, w: 17, h: 17 },
      { key: 'poculum', latin: 'poculum', english: 'cup', hint: 'Look beside the reclining diner.', x: 77, y: 43, w: 10, h: 18 },
      { key: 'mensa', latin: 'mensa', english: 'table', hint: 'The main dishes are arranged on it.', x: 43, y: 47, w: 30, h: 27 },
      { key: 'lucerna', latin: 'lucerna', english: 'lamp', hint: 'It glows in an alcove high on the wall.', x: 62, y: 4, w: 13, h: 19 },
      { key: 'amphora', latin: 'amphora', english: 'amphora', hint: 'Find the tall painted jar on the right.', x: 84, y: 59, w: 15, h: 38 }
    ]
  },
  'farmer-wolf': {
    image: 'assets/seek-find/farmer-wolf.jpg',
    mission: 'In agro Romano sex res reperi.',
    missionEnglish: 'Find six things on the Roman farm.',
    targets: [
      { key: 'agricola', latin: 'agricola', english: 'farmer', hint: 'He watches the flock from the left.', x: 23, y: 20, w: 25, h: 56 },
      { key: 'canis', latin: 'canis', english: 'dog', hint: 'The farmer’s helper stands near the center.', x: 35, y: 49, w: 25, h: 30 },
      { key: 'ovis', latin: 'ovis', english: 'sheep', hint: 'One sheep is closest to the path.', x: 58, y: 48, w: 23, h: 32 },
      { key: 'villa', latin: 'villa', english: 'country house', hint: 'Look beyond the grain field.', x: 4, y: 4, w: 21, h: 21 },
      { key: 'luna', latin: 'luna', english: 'moon', hint: 'It hangs in the upper-right sky.', x: 83, y: 1, w: 10, h: 15 },
      { key: 'pedum', latin: 'pedum', english: 'shepherd’s crook', hint: 'A hooked staff leans against the right fence.', x: 88, y: 39, w: 11, h: 42 }
    ]
  },
  school: {
    image: 'assets/seek-find/school.jpg',
    mission: 'In schola Romana sex res reperi.',
    missionEnglish: 'Find six things in the Roman school.',
    targets: [
      { key: 'magister', latin: 'magister', english: 'teacher', hint: 'He stands before the map.', x: 41, y: 6, w: 18, h: 40 },
      { key: 'liber', latin: 'liber', english: 'book', hint: 'This Roman book is an open scroll.', x: 9, y: 76, w: 31, h: 22 },
      { key: 'tabula', latin: 'tabula', english: 'wax tablet', hint: 'A student writes on it at the front table.', x: 39, y: 70, w: 20, h: 19 },
      { key: 'stilus', latin: 'stilus', english: 'stylus', hint: 'The pointed tool touches the wax tablet.', x: 43, y: 62, w: 10, h: 19 },
      { key: 'lucerna', latin: 'lucerna', english: 'lamp', hint: 'It glows on the high shelf at right.', x: 87, y: 2, w: 11, h: 17 },
      { key: 'pera', latin: 'pera', english: 'satchel', hint: 'Find the red bag at lower right.', x: 82, y: 68, w: 17, h: 27 }
    ]
  },
  'river-boat': {
    image: 'assets/seek-find/river-boat.jpg',
    mission: 'Apud flumen sex res reperi.',
    missionEnglish: 'Find six things beside the Tiber.',
    targets: [
      { key: 'puer', latin: 'puer', english: 'boy', hint: 'He sits on the shaded riverbank.', x: 8, y: 22, w: 24, h: 43 },
      { key: 'navis', latin: 'navis', english: 'ship', hint: 'The large wooden boat crosses the water.', x: 42, y: 27, w: 48, h: 34 },
      { key: 'velum', latin: 'velum', english: 'sail', hint: 'Look for a large white square above the ship.', x: 38, y: 1, w: 38, h: 37 },
      { key: 'remus', latin: 'remus', english: 'oar', hint: 'One long wooden oar reaches into the water.', x: 63, y: 45, w: 15, h: 25 },
      { key: 'piscis', latin: 'piscis', english: 'fish', hint: 'A silver shape swims in the clear shallows.', x: 49, y: 83, w: 12, h: 13 },
      { key: 'funis', latin: 'funis', english: 'rope', hint: 'Find the coil on the dock.', x: 72, y: 70, w: 22, h: 20 }
    ]
  },
  'romulus-remus': {
    image: 'assets/seek-find/romulus-remus.jpg',
    mission: 'In collibus Romae sex res reperi.',
    missionEnglish: 'Find six things in the hills of early Rome.',
    targets: [
      { key: 'fratres', latin: 'fratres', english: 'brothers', hint: 'The twins are drawing plans together.', x: 36, y: 40, w: 27, h: 39 },
      { key: 'pastor', latin: 'pastor', english: 'shepherd', hint: 'He carries a tall hooked staff.', x: 20, y: 31, w: 22, h: 51 },
      { key: 'murus', latin: 'murus', english: 'wall', hint: 'Look for new stonework on the right.', x: 61, y: 43, w: 37, h: 30 },
      { key: 'corona', latin: 'corona', english: 'crown', hint: 'A bronze crown rests on a rock.', x: 82, y: 74, w: 17, h: 20 },
      { key: 'collis', latin: 'collis', english: 'hill', hint: 'A settlement stands on the green hilltop.', x: 43, y: 8, w: 27, h: 21 },
      { key: 'lupa', latin: 'lupa', english: 'she-wolf', hint: 'She watches quietly from the upper left.', x: 1, y: 1, w: 17, h: 20 }
    ]
  },
  'harbor-trade': {
    image: 'assets/seek-find/harbor-trade.jpg',
    mission: 'In portu Romano sex res reperi.',
    missionEnglish: 'Find six things in the Roman harbor.',
    targets: [
      { key: 'mercator', latin: 'mercator', english: 'merchant', hint: 'He wears a rust-red cloak.', x: 22, y: 27, w: 21, h: 53 },
      { key: 'nauta', latin: 'nauta', english: 'sailor', hint: 'He carries a thick coil of rope.', x: 45, y: 27, w: 22, h: 60 },
      { key: 'navis', latin: 'navis', english: 'ship', hint: 'Find the biggest blue wooden ship.', x: 29, y: 1, w: 45, h: 43 },
      { key: 'amphora', latin: 'amphora', english: 'amphora', hint: 'A tall painted jar stands at lower left.', x: 1, y: 56, w: 20, h: 40 },
      { key: 'piper', latin: 'piper', english: 'pepper', hint: 'Black peppercorns fill an open sack.', x: 38, y: 71, w: 19, h: 25 },
      { key: 'ancora', latin: 'ancora', english: 'anchor', hint: 'The heavy black anchor rests at lower right.', x: 76, y: 63, w: 23, h: 34 }
    ]
  },
  'aeneas-troy': {
    image: 'assets/seek-find/aeneas-troy.jpg',
    mission: 'In itinere Aeneae sex res reperi.',
    missionEnglish: 'Find six things on Aeneas’s journey.',
    targets: [
      { key: 'aeneas', latin: 'Aeneas', english: 'Aeneas', hint: 'He carries his father along the path.', x: 27, y: 18, w: 25, h: 66 },
      { key: 'pater', latin: 'pater', english: 'father', hint: 'The older man rides on Aeneas’s shoulders.', x: 28, y: 3, w: 24, h: 41 },
      { key: 'filius', latin: 'filius', english: 'son', hint: 'The child in blue holds Aeneas’s hand.', x: 45, y: 48, w: 17, h: 37 },
      { key: 'navis', latin: 'navis', english: 'ship', hint: 'A striped sail rises beside the water.', x: 79, y: 1, w: 20, h: 48 },
      { key: 'scutum', latin: 'scutum', english: 'shield', hint: 'A bronze shield leans on a rock at left.', x: 1, y: 54, w: 18, h: 37 },
      { key: 'sarcina', latin: 'sarcina', english: 'bundle', hint: 'A tied travel bundle rests at lower right.', x: 77, y: 76, w: 22, h: 22 }
    ]
  }
};

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
  const story = LATIN_STORY_BY_ID[storyId];
  return story
    ? { ...story, seekFind: LATIN_SEEK_FIND_SCENES[storyId] || null }
    : null;
}
