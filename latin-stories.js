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
    pictureCue: 'Marcus and Lucia shop with their father in the Roman Forum.',
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
    pictureCue: 'Rufus runs through a Roman garden.',
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
    pictureCue: 'Quintus visits the Roman baths with his father.',
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
    pictureCue: 'A servant prepares dinner in a Roman home.',
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
    pictureCue: 'A farmer and his dog guard sheep near a Roman villa.',
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
    pictureCue: 'A teacher and students study together in a Roman school.',
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
    pictureCue: 'Lucius watches sailors on the Tiber River.',
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
    pictureCue: 'Romulus and Remus sit with a shepherd near early Rome.',
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
    pictureCue: 'A merchant speaks with a sailor in a Roman harbor.',
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
    pictureCue: 'Aeneas carries Anchises and leads Ascanius away from Troy.',
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

// Original bilingual readings used by the in-app full-story reader. Keeping the
// paired paragraphs together prevents the Latin and English columns from drifting.
const LATIN_FULL_STORIES = {
  'forum-market': [
    { latin: 'Marcus et Lucia cum patre ad forum Romanum ambulant. Via plena est civibus, mercatoribus, et servis. Lucia multas tabernas videt et uvas pulchras desiderat.', english: 'Marcus and Lucia walk with their father to the Roman Forum. The road is full of citizens, merchants, and servants. Lucia sees many shops and wants some beautiful grapes.' },
    { latin: 'Pater ad tabernam venit. Mercator panem, mala, et uvas vendit. Lucia uvas emit, et Marcus magnum panem portat.', english: 'Their father comes to a shop. The merchant sells bread, apples, and grapes. Lucia buys grapes, and Marcus carries a large loaf of bread.' },
    { latin: 'Mercator pretium dicit, et pater nummos numerat. Unus nummus in viam cadit. Marcus nummum invenit et patri reddit.', english: 'The merchant states the price, and their father counts the coins. One coin falls into the road. Marcus finds the coin and returns it to his father.' },
    { latin: 'Familia per forum ambulat et templum magnum spectat. Lucia dicit, “Forum est pulchrum et valde occupatum.” Tum omnes laeti domum redeunt.', english: 'The family walks through the forum and looks at a great temple. Lucia says, “The forum is beautiful and very busy.” Then everyone happily returns home.' }
  ],
  'garden-dog': [
    { latin: 'Rufus, canis celer, in horto villae habitat. Sub arbore dormit, sed parvam felem prope rosas videt. Statim surgit et per herbam currit.', english: 'Rufus, a fast dog, lives in the villa garden. He sleeps under a tree, but sees a small cat near the roses. He immediately gets up and runs across the grass.' },
    { latin: 'Felis ad mensam salit, et Rufus circa mensam currit. Puella e villa exit et clamat, “Rufe, consiste!” Canis vocem audit et ad puellam redit.', english: 'The cat jumps onto a table, and Rufus runs around the table. A girl comes out of the villa and calls, “Rufus, stop!” The dog hears her voice and returns to the girl.' },
    { latin: 'Subito puella sonum apud portam audit. Hospes ignotus intrare conatur. Rufus ad portam festinat et magna voce latrat.', english: 'Suddenly the girl hears a sound near the gate. An unknown visitor tries to enter. Rufus hurries to the gate and barks loudly.' },
    { latin: 'Pater ad portam venit et hospitem salutat. Puella Rufum laudat: “Canis bonus et fortis es.” Rufus caudam movet et iterum sub arbore quiescit.', english: 'Her father comes to the gate and greets the visitor. The girl praises Rufus: “You are a good and brave dog.” Rufus wags his tail and rests under the tree again.' }
  ],
  'roman-baths': [
    { latin: 'Quintus cum patre ad thermas Romanas venit. Per portam magnam intrant et vestimenta deponunt. Quintus columnas altas et multos cives videt.', english: 'Quintus comes with his father to the Roman baths. They enter through a great doorway and put aside their clothes. Quintus sees tall columns and many citizens.' },
    { latin: 'Primum in conclavi tepido sedent. Deinde ad aquam calidam ambulant. Vapor ascendit, et Quintus corpus calefacit.', english: 'First they sit in a warm room. Then they walk to the hot water. Steam rises, and Quintus warms his body.' },
    { latin: 'Postea pater ad piscinam frigidam procedit. Quintus aquam frigidam timet, sed pater ridet et dicit, “Aqua corpus confirmat.”', english: 'Afterward his father goes to the cold pool. Quintus is afraid of the cold water, but his father laughs and says, “The water strengthens the body.”' },
    { latin: 'Quintus pedem in aquam ponit, deinde totus descendit. “Frigida est, sed bona!” clamat. Pater et filius e thermis laeti discedunt.', english: 'Quintus puts a foot in the water, then goes all the way down. “It is cold, but good!” he shouts. Father and son leave the baths happily.' }
  ],
  'roman-dinner': [
    { latin: 'Gaius hospites ad cenam vocat. Marcus servus cibum parat et mensam ornat. In culina panis, olivae, caseus, et mala sunt.', english: 'Gaius invites guests to dinner. Marcus the servant prepares the food and decorates the table. In the kitchen there are bread, olives, cheese, and apples.' },
    { latin: 'Marcus ad forum festinat quod piscis deest. Piscem recens emit et domum portat. Coquus piscem cum herbis parat.', english: 'Marcus hurries to the forum because fish is missing. He buys a fresh fish and carries it home. The cook prepares the fish with herbs.' },
    { latin: 'Hospites in triclinio recumbunt. Marcus pocula implet et cibum in mensa ponit. Gaius omnibus gratias agit.', english: 'The guests recline in the dining room. Marcus fills the cups and places food on the table. Gaius thanks everyone.' },
    { latin: 'Post cenam hospites fabulas narrant. Gaius Marcum laudat quod cena optima est. Familia et amici vesperum laetum agunt.', english: 'After dinner the guests tell stories. Gaius praises Marcus because the dinner is excellent. Family and friends enjoy a happy evening.' }
  ],
  'farmer-wolf': [
    { latin: 'Agricola in villa rustica habitat. Cotidie ad agrum procedit et oves custodit. Canis fidelis semper cum eo ambulat.', english: 'A farmer lives in a country villa. Every day he goes out to the field and guards the sheep. A faithful dog always walks with him.' },
    { latin: 'Vespere luna super agrum oritur. Canis subito consistit et ad silvam spectat. Ibi lupus inter arbores movetur.', english: 'In the evening the moon rises over the field. The dog suddenly stops and looks toward the woods. There a wolf moves among the trees.' },
    { latin: 'Agricola oves in ovile ducit. Canis ante ovile stat et fortiter latrat. Lupus sonum audit et in silvam fugit.', english: 'The farmer leads the sheep into the fold. The dog stands before the fold and barks bravely. The wolf hears the sound and flees into the woods.' },
    { latin: 'Agricola portam claudit et canem laudat. Omnes oves tutae sunt. Sub clara luna agricola et canis ad villam redeunt.', english: 'The farmer closes the gate and praises the dog. All the sheep are safe. Under the bright moon, the farmer and dog return to the villa.' }
  ],
  school: [
    { latin: 'Iulia, puella Romana, cotidie ad scholam it. Amici eius, Marcus et Lucia, quoque ibi discunt. Mane discipuli in atrio conveniunt, et magister eos salutat.', english: 'Julia, a Roman girl, goes to school every day. Her friends Marcus and Lucia study there too. In the morning the students gather in the courtyard, and the teacher greets them.' },
    { latin: 'Discipuli in tablinum intrant et tabulas ac stilos portant. Iulia ad sellam suam it et tabulam in mensa ponit. Marcus rogat, “Quid hodie discimus?”', english: 'The students enter the classroom carrying tablets and styluses. Julia goes to her seat and places her tablet on the desk. Marcus asks, “What are we learning today?”' },
    { latin: 'Magister verba nova in tabula magna scribit: domus, liber, stilus, tabula. Discipuli verba legunt, scribunt, et memoria tenent.', english: 'The teacher writes new words on the large board: house, book, stylus, tablet. The students read, write, and remember the words.' },
    { latin: 'Deinde magister librum aperit et carmen breve legit. Iulia manum tollit et carmen bene interpretatur. Magister eam laudat, et discipuli carmen semel scribunt.', english: 'Then the teacher opens a book and reads a short poem. Julia raises her hand and explains the poem well. The teacher praises her, and the students write the poem once.' },
    { latin: 'Post scholam amici domum redeunt. In via verba nova repetunt et de carmine loquuntur. Cras parati ad scholam redibunt.', english: 'After school the friends return home. On the way they repeat the new words and talk about the poem. Tomorrow they will return to school prepared.' }
  ],
  'river-boat': [
    { latin: 'Lucius prope flumen Tiberim sedet. Aquam spectat et magnam navem videt. Nauta velum parat, dum alii remos tenent.', english: 'Lucius sits near the Tiber River. He watches the water and sees a large ship. A sailor prepares the sail while others hold the oars.' },
    { latin: 'Navis lente e portu movet. Lucius funem in ripa et pisces in aqua videt. Ventus velum implet, et nautae laeti clamant.', english: 'The ship moves slowly out of the harbor. Lucius sees a rope on the bank and fish in the water. The wind fills the sail, and the sailors shout happily.' },
    { latin: 'Senex nauta ad puerum venit. Multas terras et insulas describit. Lucius attente audit et de mari cogitat.', english: 'An old sailor comes to the boy. He describes many lands and islands. Lucius listens carefully and thinks about the sea.' },
    { latin: 'Lucius dicit, “Olim nauta ero et navem gubernabo.” Senex ridet et eum hortatur. Puer domum redit, sed in animo iter iam incipit.', english: 'Lucius says, “One day I will be a sailor and steer a ship.” The old man smiles and encourages him. The boy returns home, but in his mind the journey has already begun.' }
  ],
  'romulus-remus': [
    { latin: 'Romulus et Remus fratres gemini sunt. Pastor eos nutrit, et pueri inter colles crescunt. Fortes fiunt et multos amicos congregant.', english: 'Romulus and Remus are twin brothers. A shepherd raises them, and the boys grow up among the hills. They become strong and gather many friends.' },
    { latin: 'Fratres urbem novam aedificare volunt. Sed de colle non consentiunt. Romulus Palatium eligit, Remus autem alium collem mavult.', english: 'The brothers want to build a new city. But they do not agree about the hill. Romulus chooses the Palatine, while Remus prefers another hill.' },
    { latin: 'Romulus murum circa collem aedificat. Pastores et familiae ad novam urbem veniunt. Viae, domus, et forum paulatim apparent.', english: 'Romulus builds a wall around the hill. Shepherds and families come to the new city. Roads, houses, and a forum gradually appear.' },
    { latin: 'Nova urbs Roma vocatur, et Romulus rex fit. Fabula antiqua originem Romae narrat. Romani hanc fabulam per multas aetates memorant.', english: 'The new city is called Rome, and Romulus becomes king. The ancient tale tells the origin of Rome. Romans remember this story through many generations.' }
  ],
  'harbor-trade': [
    { latin: 'Mercator mane ad portum venit. Magnae naves ex terris longinquis adsunt. Nauta amphoras et saccos e nave portat.', english: 'A merchant comes to the harbor in the morning. Great ships from distant lands are present. A sailor carries amphorae and sacks from a ship.' },
    { latin: 'Mercator piper emere vult. Sacculum aperit et grana nigra spectat. “Quod est pretium?” nautam rogat.', english: 'The merchant wants to buy pepper. He opens a sack and examines the black grains. “What is the price?” he asks the sailor.' },
    { latin: 'Nauta pretium dicit, sed mercator minus offert. Diu amice disputant. Tandem de pretio consentiunt et manus iungunt.', english: 'The sailor names a price, but the merchant offers less. They bargain amicably for a long time. At last they agree on the price and clasp hands.' },
    { latin: 'Servi piper et amphoras ad tabernam portant. Nauta funem solvit et navem parat. Portus clamoribus et labore plenus est.', english: 'Servants carry the pepper and amphorae to the shop. The sailor unties the rope and prepares the ship. The harbor is full of noise and work.' }
  ],
  'aeneas-troy': [
    { latin: 'Troia ardet, et Aeneas familiam servare debet. Patrem Anchisen umeris portat et filium Ascanium manu ducit. Per vias obscuras ad mare festinant.', english: 'Troy is burning, and Aeneas must save his family. He carries his father Anchises on his shoulders and leads his son Ascanius by the hand. They hurry through dark streets toward the sea.' },
    { latin: 'Anchises parva sacra familiae tenet. Ascanius patrem fortiter sequitur. Aeneas saepe retro spectat, sed iter pergere debet.', english: 'Anchises holds the family’s small sacred objects. Ascanius bravely follows his father. Aeneas often looks back, but he must continue the journey.' },
    { latin: 'Ad litus socii cum navibus exspectant. Familia navem ascendit, et nautae vela tollunt. Troia paulatim e conspectu discedit.', english: 'At the shore their companions wait with ships. The family boards a ship, and the sailors raise the sails. Troy slowly disappears from sight.' },
    { latin: 'Aeneas de nova patria cogitat. Iter longum et difficile erit, sed spem non amittit. Pietas erga familiam eum semper ducit.', english: 'Aeneas thinks about a new homeland. The journey will be long and difficult, but he does not lose hope. Devotion to his family always guides him.' }
  ]
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

const FULL_STORY_SEQUENCE = LATIN_STORY_SCENES.map((story) => story.id);

function getUniqueStorySequenceForGrade(grade) {
  const sequence = STORY_SEQUENCE_BY_GRADE[grade] || FULL_STORY_SEQUENCE;
  const seen = new Set();

  return [...sequence, ...FULL_STORY_SEQUENCE].filter((storyId) => {
    if (!LATIN_STORY_BY_ID[storyId] || seen.has(storyId)) return false;
    seen.add(storyId);
    return true;
  });
}

function getStorySceneForLesson(grade, lessonIndex) {
  const sequence = getUniqueStorySequenceForGrade(grade);
  const storyId = sequence[lessonIndex % sequence.length];
  const story = LATIN_STORY_BY_ID[storyId];
  return story
    ? {
        ...story,
        seekFind: LATIN_SEEK_FIND_SCENES[storyId] || null,
        fullStory: LATIN_FULL_STORIES[storyId] || []
      }
    : null;
}
