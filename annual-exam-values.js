// Original questions for the Roman-values cards.
// Wording is not taken from an exam. Each item can stand on its own.

function valueQ(id, level, prompt, choices, answer, explanation, extra) {
  return annualExamQ(id, level, 'culture', prompt, choices, answer, explanation, extra || {});
}

addQuestions([
  valueQ(
    'val-ay-01',
    'advanced-poetry',
    'Pietas in a Roman story is best described as',
    ['duty to family, the gods, and the city.', 'a joke told at dinner.', 'a kind of ship.', 'the right to break a promise.'],
    'duty to family, the gods, and the city.',
    'Pietas is duty. English "pious" is narrower. Aeneas is called pius because he carries that duty.'
  ),
  valueQ(
    'val-ay-02',
    'advanced-poetry',
    'Gravitas means',
    ['steady seriousness.', 'a loud boast.', 'a holiday game.', 'gloom about every choice.'],
    'steady seriousness.',
    'A person with gravitas stays calm and serious. The idea is steadiness, not gloom, and not a boast.'
  ),
  valueQ(
    'val-ay-03',
    'advanced-poetry',
    'In "Disce, puer, virtutem ex me," virtus is',
    ['courage and excellence a father can teach.', 'a kind of coin.', 'a dinner couch.', 'a month of the year.'],
    'courage and excellence a father can teach.',
    'Vergil has a father tell his son to learn virtus and true work. The word names excellence and courage.'
  ),
  valueQ(
    'val-ay-04',
    'advanced-poetry',
    'Cicero calls fides the foundation of',
    ['justice.', 'a chariot race.', 'the calendar.', 'a kitchen fire.'],
    'justice.',
    'Fundamentum iustitiae fides: good faith is the base of justice. Fides means keeping your word.'
  ),
  valueQ(
    'val-ay-05',
    'advanced-poetry',
    'Dignitas is',
    ['respect a person earns.', 'a right to boss other people.', 'a type of shoe.', 'the name of a river.'],
    'respect a person earns.',
    'Cicero\'s phrase cum dignitate otium joins a quiet life with earned dignity. Dignitas is not bossiness.'
  ),
  valueQ(
    'val-ay-06',
    'advanced-poetry',
    'Auctoritas is',
    ['influence that others grant.', 'an extra legal power you can seize.', 'a soldier\'s shield.', 'a kind of bread.'],
    'influence that others grant.',
    'Augustus said he excelled in auctoritas. The word is influence other people give, not a new office.'
  ),
  valueQ(
    'val-ay-07',
    'advanced-poetry',
    'Mos maiorum means',
    ['the customs of the ancestors.', 'a new law passed yesterday.', 'a Greek meter.', 'the pay of a soldier.'],
    'the customs of the ancestors.',
    'Ennius says the Roman state stands on ancient customs and on its people. Mos maiorum is that inherited way of life.'
  ),
  valueQ(
    'val-ay-08',
    'advanced-poetry',
    'The line "Homo sum: humani nil a me alienum puto" is',
    ['a comedy line later used as a motto about shared humanity.', 'a law of the Twelve Tables.', 'a recipe.', 'a battle order.'],
    'a comedy line later used as a motto about shared humanity.',
    'Terence wrote it in a play. Later readers used it for humanitas. The scene itself is comedy, not a philosophy lesson.'
  ),
  valueQ(
    'val-ay-09',
    'advanced-poetry',
    'A classroom account of Stoic thought stresses',
    ['steadiness and effort when life is hard.', 'grabbing every pleasure.', 'that pain is something to enjoy.', 'giving up on other people.'],
    'steadiness and effort when life is hard.',
    'Seneca says the road from the earth to the stars is not a soft one. The lesson is a calm, brave mind and real effort.'
  ),
  valueQ(
    'val-ay-10',
    'advanced-poetry',
    'Epicurean thought, as this course teaches it, is',
    ['a simple life without fear.', 'a license to take every pleasure.', 'a rule that wealth is the highest good.', 'a kind of army drill.'],
    'a simple life without fear.',
    'Lucretius says a person\'s great wealth is to live simply with a calm mind. That is not a license to grab every pleasure.'
  ),

  valueQ(
    'val-ar-01',
    'advanced-reading',
    'Aeneas says "Sum pius Aeneas." Pius here points to',
    ['duty.', 'speed.', 'hunger.', 'a joke.'],
    'duty.',
    'Pius praises pietas, duty to family, the gods, and the city. It does not mean fast or hungry.'
  ),
  valueQ(
    'val-ar-02',
    'advanced-reading',
    '"Vir gravis pauca dicit" is a classroom picture of',
    ['gravitas.', 'a chariot race.', 'a wedding veil.', 'a sea storm.'],
    'gravitas.',
    'Gravis means serious, and pauca dicit means he says little. Together they picture steady seriousness.'
  ),
  valueQ(
    'val-ar-03',
    'advanced-reading',
    'Virtus in the line a father teaches his child is closest to',
    ['courage and true work.', 'a pile of jewels.', 'a holiday.', 'silence in the theater.'],
    'courage and true work.',
    'Disce, puer, virtutem ex me verumque laborem asks the child to learn courage and real labor.'
  ),
  valueQ(
    'val-ar-04',
    'advanced-reading',
    'Fides fails when a person',
    ['breaks a promise.', 'learns a new word.', 'walks to school.', 'counts to ten.'],
    'breaks a promise.',
    'Fides is keeping your word. Cicero calls that good faith the foundation of justice.'
  ),
  valueQ(
    'val-ar-05',
    'advanced-reading',
    '"Cum dignitate otium" joins a quiet life with',
    ['earned respect.', 'a loud demand to be obeyed.', 'a soldier\'s pay.', 'a dinner of only fish.'],
    'earned respect.',
    'Dignitas is respect earned by character. Otium is quiet leisure. The phrase does not mean bossiness.'
  ),
  valueQ(
    'val-ar-06',
    'advanced-reading',
    'In the Res Gestae, Augustus claims he stood above others in',
    ['auctoritas.', 'the number of his kitchens.', 'the length of his toga.', 'a new name for the Tiber.'],
    'auctoritas.',
    'Auctoritate omnibus praestiti means he excelled in influence. He says the offices themselves were shared.'
  ),
  valueQ(
    'val-ar-07',
    'advanced-reading',
    '"Moribus antiquis res stat Romana" says Rome stands on',
    ['old customs.', 'a single new law.', 'ships from Egypt only.', 'the games.'],
    'old customs.',
    'Moribus antiquis means by ancient customs. That is the mos maiorum, the ways of the ancestors.'
  ),
  valueQ(
    'val-ar-08',
    'advanced-reading',
    'Humanitas, drawn from Terence\'s comedy line, asks a reader to',
    ['treat another person\'s life as close to their own.', 'ignore everyone else.', 'collect jewels.', 'win a race.'],
    'treat another person\'s life as close to their own.',
    'Homo sum says I am human. The line became a motto for kindness and learning. Terence wrote it for the stage.'
  ),
  valueQ(
    'val-ar-09',
    'advanced-reading',
    '"Non est ad astra mollis e terris via" fits Stoic teaching because it says',
    ['the hard road still has to be walked with a steady mind.', 'every pleasure should be seized.', 'pain is something to enjoy.', 'the stars are a city in Italy.'],
    'the hard road still has to be walked with a steady mind.',
    'Seneca\'s line is about effort. Stoic teaching in this course means steadiness, not grabbing pleasure and not enjoying pain.'
  ),
  valueQ(
    'val-ar-10',
    'advanced-reading',
    'Lucretius calls living simply, aequo animo, a kind of',
    ['wealth.', 'punishment.', 'military rank.', 'calendar date.'],
    'wealth.',
    'Divitiae grandes means great riches. For Lucretius those riches are a simple life and a calm mind, not a pile of coins.'
  ),

  valueQ(
    'val-ar-ext-01',
    'advanced-reading',
    'The passage says the story was written so citizens would know an exemplum pietatis. Pietas there is',
    ['devotion to her sons.', 'a love of jewels.', 'a kind of ship.', 'a public office.'],
    'devotion to her sons.',
    'Cornelia puts her children ahead of gold. The passage calls that choice an example of pietas, family duty.',
    { section: 'extension', passageId: 'advanced-reading-cornelia', order: 3 }
  ),
  valueQ(
    'val-ar-ext-02',
    'advanced-reading',
    'The narrators say Cornelia wanted to glory "non divitiis sed virtute filiorum." Virtus here is',
    ['the worth of her sons.', 'the price of the gems.', 'a guest\'s dress.', 'a school holiday.'],
    'the worth of her sons.',
    'Non divitiis sed virtute sets wealth against character. She wants to be proud of her sons\' excellence, not of jewels.',
    { section: 'extension', passageId: 'advanced-reading-cornelia', order: 4 }
  )
]);
