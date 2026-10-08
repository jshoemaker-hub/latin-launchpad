// Original Roman-world units: mythology, daily life, history, and a classroom map.
// Place dots use real latitudes and longitudes. scripts/build-roman-map.py
// draws the parchment image from Natural Earth vectors and NOAA ETOPO5 relief.

function cultureCard(unit, id, title, latinTitle, summary, connection, linkedWords, minGrade, mark) {
  return {
    id,
    unit,
    title,
    latinTitle,
    summary,
    connection,
    linkedWords,
    minGrade,
    maxGrade: 8,
    sourceImages: [],
    original: true,
    mark
  };
}

const CULTURE_UNIT_CARDS = [
  cultureCard('myth', 'myth-iuppiter', 'Jupiter', 'Iuppiter', 'Jupiter, called Zeus in Greek, rules the sky. His signs are the thunderbolt and the eagle.', 'Students meet him first because Roman stories treat him as the king of the gods.', ['deus', 'caelum', 'rex'], 3, 'I'),
  cultureCard('myth', 'myth-iuno', 'Juno', 'Iuno', 'Juno, called Hera in Greek, is the goddess of marriage and the protector of women. A peacock is her bird.', 'Her Latin name sits beside the English month-name June.', ['dea', 'femina'], 3, 'I'),
  cultureCard('myth', 'myth-neptunus', 'Neptune', 'Neptunus', 'Neptune, called Poseidon in Greek, rules the sea and is drawn with a three-pronged spear, the trident.', 'Sailors and map work both lead back to his name.', ['mare', 'aqua'], 3, 'N'),
  cultureCard('myth', 'myth-pluto', 'Pluto', 'Pluto', 'Pluto, called Hades in Greek, rules the Underworld, the land of the dead. Romans also called him Dis.', 'The story is serious, but the card only needs the ruler, the place, and the Greek name.', ['rex', 'terra'], 5, 'P'),
  cultureCard('myth', 'myth-ceres', 'Ceres', 'Ceres', 'Ceres, called Demeter in Greek, is the goddess of grain and the harvest. Her daughter is Proserpina.', 'English cereal comes from this name.', ['ager', 'cibus'], 3, 'C'),
  cultureCard('myth', 'myth-vesta', 'Vesta', 'Vesta', 'Vesta, called Hestia in Greek, is the goddess of the hearth and the home fire. Her public flame was kept in Rome.', 'A Roman house and a Roman city both began with a fire that was not allowed to go out.', ['domus', 'ignis'], 3, 'V'),
  cultureCard('myth', 'myth-minerva', 'Minerva', 'Minerva', 'Minerva, called Athena in Greek, is the goddess of wisdom, crafts, and planned war. Her signs are the owl and the olive.', 'She is the goddess who contests with Arachne at the loom.', ['ars', 'puella'], 3, 'M'),
  cultureCard('myth', 'myth-apollo', 'Apollo', 'Apollo', 'Apollo has the same name in Greek and Latin. He is connected with music, healing, the sun, and prophecy, and his instrument is the lyre.', 'Poets ask him, and the Muses, for help at the start of a song.', ['sol', 'carmen'], 4, 'A'),
  cultureCard('myth', 'myth-diana', 'Diana', 'Diana', 'Diana, called Artemis in Greek, is the goddess of the hunt and the moon. She is Apollo\'s twin.', 'Woods, the moon, and a bow are the signs to remember.', ['luna', 'silva'], 3, 'D'),
  cultureCard('myth', 'myth-mars', 'Mars', 'Mars', 'Mars, called Ares in Greek, is the god of war. The month March is named for him, and the Romans claimed him as the father of Romulus.', 'He is more honored in Roman stories than Ares is in Greek ones.', ['bellum', 'miles'], 3, 'M'),
  cultureCard('myth', 'myth-venus', 'Venus', 'Venus', 'Venus, called Aphrodite in Greek, is the goddess of love and beauty. Roman legend makes her the mother of Aeneas.', 'Her planet and the English word venereal both come from this name, but the classroom point is love and the Trojan line.', ['amor', 'mater'], 4, 'V'),
  cultureCard('myth', 'myth-vulcanus', 'Vulcan', 'Vulcanus', 'Vulcan, called Hephaestus in Greek, is the smith of the gods. He works at a forge and is associated with fire.', 'A volcano takes its English name from him.', ['ignis', 'labor'], 4, 'V'),
  cultureCard('myth', 'myth-mercurius', 'Mercury', 'Mercurius', 'Mercury, called Hermes in Greek, is the messenger of the gods. He wears winged sandals and carries the caduceus, a staff with two snakes.', 'He also watches over travelers, trade, and clever speech.', ['nuntius', 'via'], 3, 'M'),
  cultureCard('myth', 'myth-bacchus', 'Bacchus', 'Bacchus', 'Bacchus, called Dionysus in Greek, is the god of the vine, festival, and the theater.', 'Roman stories connect him with plays as well as with grapes.', ['vinum', 'ludus'], 5, 'B'),
  cultureCard('myth', 'myth-echo', 'Echo and Narcissus', 'Echo et Narcissus', 'Echo could only repeat the last words she heard. Narcissus fell in love with his own reflection and wasted away beside the water.', 'A later age used his name for someone who cannot stop looking at himself.', ['aqua', 'vox'], 5, 'E'),
  cultureCard('myth', 'myth-arachne', 'Arachne', 'Arachne', 'Arachne boasted that she could weave better than Minerva. After the contest, the goddess changed her into a spider.', 'The story is a warning against boastfulness, and it explains the spider\'s web.', ['ars', 'puella'], 5, 'A'),
  cultureCard('myth', 'myth-midas', 'King Midas', 'Midas', 'Midas asked that everything he touched turn to gold, then learned that the gift was a curse when his food turned to metal too.', 'The story is about a wish that is too large.', ['rex', 'aurum'], 4, 'M'),
  cultureCard('myth', 'myth-daphne', 'Daphne', 'Daphne', 'Daphne fled from Apollo and was changed into a laurel tree. Apollo made the laurel his sacred plant.', 'Poets and victors were later crowned with laurel.', ['arbor', 'puella'], 5, 'D'),
  cultureCard('myth', 'myth-baucis', 'Baucis and Philemon', 'Baucis et Philemon', 'Baucis and Philemon were a poor couple who welcomed two strangers. The strangers were Jupiter and Mercury, and the couple was rewarded for their kindness.', 'The story praises hospitality, the duty to receive a guest.', ['domus', 'cibus'], 5, 'B'),
  cultureCard('myth', 'myth-pygmalion', 'Pygmalion', 'Pygmalion', 'Pygmalion carved a statue so fine that he loved it. Venus gave the statue life.', 'The classroom version stops at that wonder: art becomes a living person.', ['ars', 'femina'], 6, 'P'),
  cultureCard('myth', 'myth-troia', 'The Trojan War', 'Troia', 'Paris, a prince of Troy, took Helen from Sparta. The Greek kings sailed to bring her home, and the war lasted ten years.', 'Troy is the city Latin poets call Troia or Ilium.', ['urbs', 'bellum'], 5, 'T'),
  cultureCard('myth', 'myth-achilles', 'Achilles', 'Achilles', 'Achilles was the greatest Greek fighter at Troy. His mother Thetis tried to protect him, and later stories say his heel was the one weak place.', 'His anger is the subject of Homer\'s Iliad.', ['miles', 'ira'], 6, 'A'),
  cultureCard('myth', 'myth-equus', 'The Trojan Horse', 'Equus Troianus', 'The Greeks pretended to sail away and left a huge wooden horse. Trojan soldiers brought it inside the walls, and Greek fighters hidden inside opened the city.', 'A gift that hides a trick is still called a Trojan horse.', ['equus', 'urbs'], 5, 'E'),
  cultureCard('myth', 'myth-aeneas', 'Aeneas Leaves Troy', 'Aeneas', 'Aeneas carried his father Anchises out of burning Troy and led the survivors toward Italy. Roman legend makes him the ancestor of Rome.', 'Vergil tells this journey in the Aeneid. Aeneas is famous for pietas, duty to gods, family, and city.', ['pater', 'urbs'], 4, 'A'),
  cultureCard('myth', 'myth-dido', 'Dido', 'Dido', 'Dido was the queen who founded Carthage and welcomed Aeneas. In the Aeneid their meeting ends in sorrow when he sails on to Italy.', 'The card is a name and a place: queen, Carthage, and a sad parting.', ['regina', 'urbs'], 6, 'D'),
  cultureCard('myth', 'myth-theseus', 'Theseus and the Labyrinth', 'Theseus', 'Theseus sailed to Crete to face the Minotaur, a monster kept in the labyrinth. Ariadne gave him a thread so he could find the way out.', 'Daedalus was the builder of that maze.', ['rex', 'via'], 5, 'T'),
  cultureCard('myth', 'myth-daedalus', 'Daedalus and Icarus', 'Daedalus et Icarus', 'Daedalus made wings so he and his son Icarus could leave Crete. Icarus flew too near the sun, the wax melted, and he fell.', 'The story is about skill, and about a warning that was not kept.', ['pater', 'filius'], 5, 'D'),
  cultureCard('myth', 'myth-jason', 'Jason and the Fleece', 'Iason', 'Jason sailed with the Argonauts to Colchis to bring home the Golden Fleece. Medea, the king\'s daughter, helped him.', 'The place to remember is Colchis, at the far end of the Black Sea.', ['navis', 'rex'], 6, 'I'),
  cultureCard('myth', 'myth-hercules', 'Hercules', 'Hercules', 'Hercules, called Heracles in Greek, was given twelve labors. School stories often name the Nemean lion, the Augean stables, and the apples of the Hesperides.', 'His club and lion skin are the signs to look for.', ['vir', 'labor'], 5, 'H'),
  cultureCard('myth', 'myth-perseus', 'Perseus', 'Perseus', 'Perseus was sent for the head of Medusa, whose look turned a person to stone. He watched her in a polished shield and carried gifts from the gods, including winged sandals.', 'On the way home he rescued Andromeda.', ['scutum', 'femina'], 6, 'P'),
  cultureCard('myth', 'myth-ulysses', 'Odysseus', 'Ulixes', 'Odysseus, called Ulysses in Latin, spent ten years getting home from Troy to Ithaca. He passed the Cyclops, Circe, and the Sirens.', 'Homer tells the journey in the Odyssey. Latin writers use Ulixes.', ['domus', 'mare'], 6, 'U'),
  cultureCard('myth', 'myth-atalanta', 'Atalanta', 'Atalanta', 'Atalanta was a famous runner who said she would marry only the man who could beat her in a race. Hippomenes won by dropping golden apples, which she stopped to pick up.', 'The story turns on speed and a clever trick.', ['puella', 'aurum'], 6, 'A'),
  cultureCard('myth', 'myth-underworld', 'The Underworld', 'Inferi', 'The dead cross the river Styx with the ferryman Charon. Cerberus, a three-headed dog, guards the gate, and Pluto rules below.', 'Names to keep together: Styx, Charon, Cerberus, Pluto.', ['flumen', 'canis'], 5, 'S'),
  cultureCard('myth', 'myth-orpheus', 'Orpheus and Eurydice', 'Orpheus', 'Orpheus played the lyre so beautifully that he was allowed to lead Eurydice out of the Underworld. He looked back too soon, and she had to remain.', 'The story is about music, love, and one forbidden look.', ['carmen', 'femina'], 6, 'O'),
  cultureCard('myth', 'myth-fates', 'The Fates', 'Parcae', 'The three Fates spin, measure, and cut the thread of a life. Their Greek name is the Moirai, and their Latin name is the Parcae.', 'Clotho spins, Lachesis measures, and Atropos cuts.', ['vita', 'tres'], 7, 'P'),
  cultureCard('myth', 'myth-furies', 'The Furies', 'Furiae', 'The Furies, called the Erinyes in Greek, pursue people who have broken a serious oath or harmed their own family. Later stories also call them the Kindly Ones.', 'They are punishers, not monsters of the labyrinth.', ['ira', 'lex'], 7, 'F'),
  cultureCard('myth', 'myth-muses', 'The Muses', 'Musae', 'The nine Muses are goddesses of poetry, music, history, and the other arts. They live near Mount Helicon and the spring of inspiration.', 'A poet often begins by asking them to tell the story.', ['carmen', 'novem'], 6, 'M'),
  cultureCard('myth', 'myth-nymphs', 'Nymphs', 'Nymphae', 'Nymphs are spirits of particular places: springs, trees, mountains, and the sea. Daphne was a nymph before she became the laurel.', 'A naiad belongs to water, a dryad to a tree.', ['aqua', 'arbor'], 5, 'N'),
  cultureCard('myth', 'myth-satyrs', 'Satyrs', 'Satyri', 'Satyrs are woodland followers of Bacchus, part man and part goat, who love music and dancing. Silenus is the old one among them.', 'They belong with the theater and with the god of the vine.', ['silva', 'ludus'], 6, 'S'),
  cultureCard('myth', 'myth-centaurs', 'Centaurs', 'Centauri', 'Centaurs have a human upper body and a horse\'s body. Most are wild, but Chiron is the wise teacher of heroes such as Achilles.', 'One picture has to do two jobs: the wild herd, and the teacher Chiron.', ['equus', 'magister'], 6, 'C'),

  cultureCard('life', 'life-atrium', 'The Atrium', 'Atrium', 'The atrium was the high front hall of a Roman house, with a pool, the impluvium, under an opening in the roof.', 'Guests entered here before they reached the more private rooms.', ['domus', 'aqua'], 3, 'A'),
  cultureCard('life', 'life-cubiculum', 'The Bedroom', 'Cubiculum', 'A cubiculum was a small bedroom. Roman houses kept the best space for the atrium and the garden, not for large private rooms.', 'The word is useful when a story moves through the house room by room.', ['domus', 'lectus'], 3, 'C'),
  cultureCard('life', 'life-culina', 'The Kitchen', 'Culina', 'The culina was the kitchen, often small and smoky. Much of the cooking for a rich house was done by enslaved workers.', 'Culina is the cousin of the English word culinary.', ['cibus', 'ignis'], 3, 'C'),
  cultureCard('life', 'life-triclinium', 'The Dining Room', 'Triclinium', 'In a triclinium, guests reclined on three couches around a low table. The main meal, cena, was eaten here.', 'The name means a room of three couches.', ['cibus', 'tres'], 4, 'T'),
  cultureCard('life', 'life-tablinum', 'The Study', 'Tablinum', 'The tablinum was the office between the atrium and the garden, where the master kept records and received visitors.', 'It is the room a student should not confuse with the atrium.', ['domus', 'pater'], 4, 'T'),
  cultureCard('life', 'life-peristylium', 'The Garden Court', 'Peristylium', 'The peristylium was an open garden surrounded by a covered walk. Family life gathered there, away from the street.', 'Atrium in front, garden court behind: that is the usual path through a wealthy house.', ['hortus', 'domus'], 4, 'P'),
  cultureCard('life', 'life-insula', 'Apartment Houses', 'Insula', 'Most city people did not live in a courtyard house. They lived in an insula, a crowded apartment block of several floors.', 'Insula literally means island. The building stood like a block among the streets.', ['urbs', 'domus'], 5, 'I'),
  cultureCard('life', 'life-toga', 'The Toga', 'Toga', 'The toga was the formal outer garment of a Roman citizen, a large wool cloth wrapped around the body. It was for public life, not for work or sleep.', 'Boys put on the adult toga in a family ceremony.', ['vir', 'civis'], 3, 'T'),
  cultureCard('life', 'life-tunica', 'The Tunic', 'Tunica', 'The tunica was the everyday shirt worn under the toga or by itself at home and at work. A purple stripe could show a senator or a boy of a senatorial family.', 'It is the ordinary garment, and the toga is the ceremonial one.', ['vestis', 'puer'], 3, 'T'),
  cultureCard('life', 'life-stola', 'The Stola', 'Stola', 'The stola was the long dress of a married Roman woman, worn over a tunic. It marked her status in public.', 'Toga, tunica, and stola are the three clothing words to keep distinct.', ['femina', 'vestis'], 3, 'S'),
  cultureCard('life', 'life-meals', 'Roman Meals', 'Cena', 'A small breakfast was the ientaculum, a midday snack the prandium, and the main meal the cena. Dinner might last a long time and include several courses.', 'When a story says cena, it means the important meal, not breakfast.', ['cibus', 'hora'], 3, 'C'),
  cultureCard('life', 'life-familia', 'The Household', 'Familia', 'A Roman familia included the father, the mother, the children, and the enslaved people of the house. The paterfamilias was the head of that household.', 'The English word family is narrower than the Latin one.', ['pater', 'mater', 'filius'], 3, 'F'),
  cultureCard('life', 'life-forum', 'The Forum', 'Forum Romanum', 'The Forum was the open center of Rome for speeches, courts, shops, and processions. Temples and the senate house stood around it.', 'It is a place, not only the English word for a meeting.', ['urbs', 'lex'], 4, 'F'),
  cultureCard('life', 'life-palatine', 'The Palatine Hill', 'Mons Palatinus', 'The Palatine was the hill where tradition placed Romulus\'s first settlement, and later the emperors\' palaces. English palace comes from this hill.', 'Capitol and Palatine are neighboring hills with different jobs.', ['mons', 'urbs'], 4, 'P'),
  cultureCard('life', 'life-capitol', 'The Capitol', 'Capitolium', 'The Capitol was the citadel hill of Rome, with the great temple of Jupiter. Triumphs ended there.', 'Do not mix it up with the modern United States Capitol, which borrowed the name.', ['templum', 'mons'], 4, 'C'),
  cultureCard('life', 'life-amphitheater', 'The Amphitheater', 'Amphitheatrum', 'An amphitheater is an oval arena with seats all around. The Flavian Amphitheater in Rome is the building later called the Colosseum.', 'Gladiator shows and beast hunts were held here, as public games paid for by leading men.', ['urbs', 'ludus'], 5, 'A'),
  cultureCard('life', 'life-circus', 'The Circus', 'Circus Maximus', 'The Circus Maximus was the long racecourse in the valley below the Palatine. Chariots raced around a central barrier, the spina.', 'A circus in Latin is a ring for racing, not a tent show.', ['equus', 'ludus'], 5, 'C'),
  cultureCard('life', 'life-thermae', 'The Baths', 'Thermae', 'Public baths were hot, warm, and cold rooms, plus exercise yards and gardens. People went to get clean, to meet friends, and to spend the afternoon.', 'Thermae are the great public baths. A smaller bath can be called balneum.', ['aqua', 'urbs'], 4, 'T'),
  cultureCard('life', 'life-school', 'School', 'Ludus', 'A Roman child practiced letters with a stilus on a wax tablet. A magister taught the early lessons, and a paedagogus, often an enslaved attendant, walked the child to school.', 'Ludus can mean school or game. The stylus and the tablet decide which meaning is meant.', ['puer', 'magister'], 4, 'L'),
  cultureCard('life', 'life-calendar', 'Kalends, Nones, and Ides', 'Kalendae', 'Romans counted days backward from three markers. The Kalends were the first of the month, the Ides fell on the 13th or 15th, and the Nones came eight days before the Ides.', 'The Ides of March, the day Caesar was killed, are the Ides, not the first of the month.', ['dies', 'mensis'], 6, 'K'),
  cultureCard('life', 'life-priests', 'Priests', 'Sacerdotes', 'A pontifex was a senior priest, a flamen served one god, and the Vestal Virgins kept Vesta\'s fire. The chief priest was the pontifex maximus.', 'Augurs read the signs of birds before a public act.', ['deus', 'lex'], 6, 'P'),
  cultureCard('life', 'life-wedding', 'A Wedding', 'Nuptiae', 'A bride wore a flame-colored veil and the couple joined hands. A sacrifice and a procession to the new home completed the day.', 'The card is about the ceremony, not about later family law.', ['femina', 'domus'], 6, 'N'),
  cultureCard('life', 'life-triumph', 'A Triumph', 'Triumphus', 'A triumph was a parade granted to a winning general. He rode to the Capitol while soldiers, captives, and spoils followed.', 'It was a public honor, voted by the senate, not a private party.', ['victoria', 'urbs'], 6, 'T'),
  cultureCard('life', 'life-magistrates', 'Magistrates', 'Consules', 'Two consuls were elected each year to lead the Republic. The senate advised them, and the people met in assemblies.', 'After Augustus, emperors stood above these old offices, but the names remained.', ['rex', 'civis'], 6, 'C'),
  cultureCard('life', 'life-legion', 'The Legion', 'Legio', 'A legion was the main unit of the Roman army, divided into cohorts and centuries. A centurio commanded about a hundred soldiers.', 'Castra means the camp. The legion is the body of soldiers.', ['miles', 'bellum'], 6, 'L'),

  cultureCard('history', 'hist-romulus', 'Romulus Founds Rome', 'Romulus', 'Tradition says Romulus founded Rome in 753 BCE and became its first king. He and his twin Remus were said to have been nursed by a she-wolf.', 'BCE counts backward from the start of the common era, so 753 is older than 509.', ['urbs', 'rex'], 4, 'R'),
  cultureCard('history', 'hist-kings', 'The Seven Kings', 'Reges', 'Stories give Rome seven kings, from Romulus to Tarquin the Proud. Some, such as Numa, were remembered as lawgivers, and others as builders.', 'The monarchy is the first of the three great periods: kings, Republic, Empire.', ['rex', 'urbs'], 5, 'R'),
  cultureCard('history', 'hist-lucretia', 'Why the Monarchy Ended', 'Lucretia', 'Romans told the story of Lucretia when they explained why they drove out their last king. The classroom point is the change of government, not the harm done to her.', 'Her name belongs with the end of the monarchy in 509 BCE.', ['rex', 'femina'], 6, 'L'),
  cultureCard('history', 'hist-republic', 'The Republic Begins', 'Res Publica', 'In 509 BCE the Romans replaced the last king with two elected consuls. They called the state the res publica, the public affair.', 'Brutus and Collatinus are the traditional first consuls.', ['civis', 'lex'], 5, 'R'),
  cultureCard('history', 'hist-horatius', 'Horatius at the Bridge', 'Horatius', 'Horatius Cocles held the bridge against Lars Porsenna\'s army while other Romans cut it down behind him. He then swam to safety.', 'He is an early hero of the Republic, not a king.', ['pons', 'miles'], 5, 'H'),
  cultureCard('history', 'hist-cloelia', 'Cloelia', 'Cloelia', 'Cloelia was a hostage who led a group of girls in a swim across the Tiber to Rome. The Romans honored her with an equestrian statue.', 'She belongs with Horatius and Mucius in the war against Porsenna.', ['puella', 'flumen'], 5, 'C'),
  cultureCard('history', 'hist-mucius', 'Mucius', 'Mucius', 'Mucius Scaevola was caught in Porsenna\'s camp and, in the story, burned his own right hand to show that he did not fear pain. Porsenna made peace.', 'Scaevola means left-handed, the nickname from that story.', ['manus', 'rex'], 6, 'M'),
  cultureCard('history', 'hist-pyrrhus', 'Pyrrhus', 'Pyrrhus', 'Pyrrhus, a Greek king, won battles against Rome that cost him so many soldiers that a costly win is still called a Pyrrhic victory.', 'He fought Rome in Italy before the wars with Carthage.', ['rex', 'victoria'], 6, 'P'),
  cultureCard('history', 'hist-punic-1', 'The First Punic War', 'Bellum Punicum', 'Rome and Carthage fought the First Punic War mainly at sea, from 264 to 241 BCE. Rome won Sicily.', 'Punic means Carthaginian, from their Phoenician origin.', ['mare', 'bellum'], 6, 'P'),
  cultureCard('history', 'hist-hannibal', 'Hannibal', 'Hannibal', 'Hannibal led a Carthaginian army, with elephants, from Spain across the Alps into Italy in the Second Punic War. He won at Cannae and never took Rome.', 'The war ended when Scipio defeated him at Zama in Africa.', ['dux', 'bellum'], 5, 'H'),
  cultureCard('history', 'hist-carthage', 'The Fall of Carthage', 'Carthago', 'In the Third Punic War, 149 to 146 BCE, Rome destroyed Carthage. The same year, Rome destroyed Corinth in Greece.', 'After this, Rome had no rival in the western Mediterranean.', ['urbs', 'bellum'], 6, 'C'),
  cultureCard('history', 'hist-marius', 'Marius and Sulla', 'Marius et Sulla', 'Marius and then Sulla led armies into Roman politics at the end of the Republic. Their civil wars showed that a general could threaten the city itself.', 'They come before Cicero, Caesar, and Pompey.', ['dux', 'urbs'], 7, 'M'),
  cultureCard('history', 'hist-cicero', 'Cicero and Catiline', 'Cicero', 'Cicero was consul in 63 BCE and accused Catiline of plotting to overthrow the Republic. His speeches against Catiline are famous reading later on.', 'Cicero is a speaker and a consul, not a general like Caesar.', ['orator', 'consul'], 7, 'C'),
  cultureCard('history', 'hist-caesar', 'Caesar, Pompey, and Crassus', 'Caesar', 'Caesar, Pompey, and Crassus formed an unofficial alliance now called the First Triumvirate. It broke down into civil war between Caesar and Pompey.', 'Caesar had already conquered Gaul.', ['dux', 'bellum'], 6, 'C'),
  cultureCard('history', 'hist-rubicon', 'The Rubicon', 'Rubico', 'In 49 BCE Caesar led his army across the Rubicon, the stream that marked the edge of his province. That march began the civil war.', 'To cross the Rubicon still means to take a step that cannot be undone.', ['flumen', 'dux'], 6, 'R'),
  cultureCard('history', 'hist-actium', 'Antony and Cleopatra', 'Actium', 'Antony and Cleopatra were defeated by Octavian at the sea battle of Actium in 31 BCE. Their defeat left Octavian the master of the Roman world.', 'Actium is a place on the map as well as a date.', ['mare', 'regina'], 7, 'A'),
  cultureCard('history', 'hist-augustus', 'Augustus', 'Augustus', 'Octavian took the name Augustus in 27 BCE. He kept the old offices in name and became the first emperor, beginning the Empire.', 'The Ara Pacis and the phrase Pax Romana belong to his reign.', ['imperator', 'pax'], 5, 'A'),
  cultureCard('history', 'hist-julio', 'The Julio-Claudians', 'Iulii Claudii', 'The first dynasty ran from Augustus through Tiberius, Caligula, Claudius, and Nero. Nero was the last of that family line to rule.', 'Julio-Claudian means the family of Julius Caesar and of Claudius joined together.', ['imperator', 'familia'], 7, 'I'),
  cultureCard('history', 'hist-flavians', 'The Flavians', 'Flavii', 'After a year of four emperors in 69 CE, Vespasian founded the Flavian dynasty. His sons were Titus and Domitian, and the Colosseum is their amphitheater.', 'They come after Nero and before the Five Good Emperors.', ['imperator', 'urbs'], 7, 'F'),
  cultureCard('history', 'hist-good-emperors', 'Five Good Emperors', 'Optimi Principes', 'Nerva, Trajan, Hadrian, Antoninus Pius, and Marcus Aurelius ruled in turn from 96 to 180 CE. Writers later remembered their reigns as a stable high point.', 'Hadrian\'s Wall and Trajan\'s Column are monuments from this period.', ['imperator', 'pax'], 7, 'O')
];

CULTURE_UNIT_CARDS.forEach((card) => LATIN_CULTURE_CARDS.push(card));

const ROMAN_TIMELINE = [
  { order: 1, cardId: 'hist-romulus', label: 'Romulus founds Rome', when: '753 BCE, traditional' },
  { order: 2, cardId: 'hist-kings', label: 'Seven kings rule Rome', when: 'before 509 BCE' },
  { order: 3, cardId: 'hist-lucretia', label: 'The monarchy ends', when: '509 BCE' },
  { order: 4, cardId: 'hist-republic', label: 'The Republic begins', when: '509 BCE' },
  { order: 5, cardId: 'hist-horatius', label: 'Horatius at the bridge', when: 'early Republic' },
  { order: 6, cardId: 'hist-cloelia', label: 'Cloelia swims the Tiber', when: 'early Republic' },
  { order: 7, cardId: 'hist-mucius', label: 'Mucius and Porsenna', when: 'early Republic' },
  { order: 8, cardId: 'hist-pyrrhus', label: 'Pyrrhus fights Rome', when: '280–275 BCE' },
  { order: 9, cardId: 'hist-punic-1', label: 'First war with Carthage', when: '264–241 BCE' },
  { order: 10, cardId: 'hist-hannibal', label: 'Hannibal invades Italy', when: '218 BCE' },
  { order: 11, cardId: 'hist-carthage', label: 'Carthage is destroyed', when: '146 BCE' },
  { order: 12, cardId: 'hist-marius', label: 'Marius and Sulla', when: 'late Republic' },
  { order: 13, cardId: 'hist-cicero', label: 'Cicero and Catiline', when: '63 BCE' },
  { order: 14, cardId: 'hist-caesar', label: 'Caesar, Pompey, and Crassus', when: '60 BCE' },
  { order: 15, cardId: 'hist-rubicon', label: 'Caesar crosses the Rubicon', when: '49 BCE' },
  { order: 16, cardId: 'hist-actium', label: 'Actium', when: '31 BCE' },
  { order: 17, cardId: 'hist-augustus', label: 'Augustus', when: '27 BCE' },
  { order: 18, cardId: 'hist-julio', label: 'Julio-Claudians', when: '27 BCE–68 CE' },
  { order: 19, cardId: 'hist-flavians', label: 'Flavians', when: '69–96 CE' },
  { order: 20, cardId: 'hist-good-emperors', label: 'Five Good Emperors', when: '96–180 CE' }
];

const ROMAN_MAP_PLACES = [
  { id: 'roma', latin: 'Roma', english: 'Rome', group: 'mediterranean', lat: 41.903, lon: 12.496 },
  { id: 'italia', latin: 'Italia', english: 'Italy', group: 'mediterranean', lat: 42.8, lon: 12.6 },
  { id: 'sicilia', latin: 'Sicilia', english: 'Sicily', group: 'mediterranean', lat: 37.5, lon: 14.2 },
  { id: 'graecia', latin: 'Graecia', english: 'Greece', group: 'mediterranean', lat: 39.0, lon: 22.0 },
  { id: 'aegyptus', latin: 'Aegyptus', english: 'Egypt', group: 'mediterranean', lat: 27.0, lon: 31.0 },
  { id: 'hispania', latin: 'Hispania', english: 'Spain', group: 'mediterranean', lat: 40.0, lon: -4.0 },
  { id: 'gallia', latin: 'Gallia', english: 'Gaul', group: 'mediterranean', lat: 46.5, lon: 2.5 },
  { id: 'britannia', latin: 'Britannia', english: 'Britain', group: 'mediterranean', lat: 52.5, lon: -1.5 },
  { id: 'africa', latin: 'Africa', english: 'Africa province', group: 'mediterranean', lat: 36.2, lon: 9.5 },
  { id: 'asia', latin: 'Asia', english: 'Asia province', group: 'mediterranean', lat: 38.5, lon: 28.0 },
  { id: 'syria', latin: 'Syria', english: 'Syria', group: 'mediterranean', lat: 35.0, lon: 37.5 },
  { id: 'macedonia', latin: 'Macedonia', english: 'Macedonia', group: 'mediterranean', lat: 41.2, lon: 22.3 },
  { id: 'creta', latin: 'Creta', english: 'Crete', group: 'mediterranean', lat: 35.24, lon: 24.8 },
  { id: 'cyprus', latin: 'Cyprus', english: 'Cyprus', group: 'mediterranean', lat: 35.0, lon: 33.2 },
  { id: 'carthago', latin: 'Carthago', english: 'Carthage', group: 'mediterranean', lat: 36.85, lon: 10.32 },
  { id: 'alexandria', latin: 'Alexandria', english: 'Alexandria', group: 'mediterranean', lat: 31.2, lon: 29.92 },
  { id: 'athenae', latin: 'Athenae', english: 'Athens', group: 'mediterranean', lat: 37.97, lon: 23.73 },
  { id: 'ostia', latin: 'Ostia', english: 'Ostia', group: 'italy', lat: 41.73, lon: 12.29 },
  { id: 'pompeii', latin: 'Pompeii', english: 'Pompeii', group: 'italy', lat: 40.75, lon: 14.49 },
  { id: 'brundisium', latin: 'Brundisium', english: 'Brundisium', group: 'italy', lat: 40.64, lon: 17.94 },
  { id: 'capua', latin: 'Capua', english: 'Capua', group: 'italy', lat: 41.1, lon: 14.21 },
  { id: 'cannae', latin: 'Cannae', english: 'Cannae', group: 'italy', lat: 41.3, lon: 16.15 },
  { id: 'rubico', latin: 'Rubico', english: 'the Rubicon', group: 'italy', lat: 44.1, lon: 12.4 },
  { id: 'tiberis', latin: 'Tiberis', english: 'the Tiber', group: 'italy', lat: 42.2, lon: 12.4 },
  { id: 'latium', latin: 'Latium', english: 'Latium', group: 'italy', lat: 41.5, lon: 13.1 },
  { id: 'campania', latin: 'Campania', english: 'Campania', group: 'italy', lat: 40.95, lon: 15.1 },
  { id: 'etruria', latin: 'Etruria', english: 'Etruria', group: 'italy', lat: 43.0, lon: 11.6 },
  { id: 'mediterraneum', latin: 'Mare Mediterraneum', english: 'the Mediterranean', group: 'waters', lat: 35.0, lon: 18.0 },
  { id: 'adriaticum', latin: 'Mare Adriaticum', english: 'the Adriatic Sea', group: 'waters', lat: 42.5, lon: 16.0 },
  { id: 'tyrrhenum', latin: 'Mare Tyrrhenum', english: 'the Tyrrhenian Sea', group: 'waters', lat: 39.5, lon: 11.5 },
  { id: 'aegaeum', latin: 'Mare Aegaeum', english: 'the Aegean Sea', group: 'waters', lat: 38.0, lon: 25.5 },
  { id: 'euxinus', latin: 'Pontus Euxinus', english: 'the Black Sea', group: 'waters', lat: 43.3, lon: 34.0 },
  { id: 'nilus', latin: 'Nilus', english: 'the Nile', group: 'waters', lat: 28.5, lon: 30.8 },
  { id: 'rhenus', latin: 'Rhenus', english: 'the Rhine', group: 'waters', lat: 49.5, lon: 8.0 },
  { id: 'danuvius', latin: 'Danuvius', english: 'the Danube', group: 'waters', lat: 47.2, lon: 19.0 },
  { id: 'rhodanus', latin: 'Rhodanus', english: 'the Rhone', group: 'waters', lat: 44.5, lon: 4.7 },
  { id: 'sardinia', latin: 'Sardinia', english: 'Sardinia', group: 'waters', lat: 40.1, lon: 9.0 },
  { id: 'corsica', latin: 'Corsica', english: 'Corsica', group: 'lands', lat: 42.1, lon: 9.1 },
  { id: 'alpes', latin: 'Alpes', english: 'the Alps', group: 'lands', lat: 46.5, lon: 10.0 },
  { id: 'apenninus', latin: 'Apenninus', english: 'the Apennines', group: 'lands', lat: 42.8, lon: 13.3 },
  { id: 'olympus', latin: 'Olympus', english: 'Mount Olympus', group: 'lands', lat: 40.09, lon: 22.35 },
  { id: 'vesuvius', latin: 'Vesuvius', english: 'Vesuvius', group: 'lands', lat: 40.82, lon: 14.43 },
  { id: 'aetna', latin: 'Aetna', english: 'Mount Etna', group: 'lands', lat: 37.75, lon: 14.99 },
  { id: 'helvetia', latin: 'Helvetia', english: 'Switzerland', group: 'lands', lat: 46.8, lon: 8.2 },
  { id: 'germania', latin: 'Germania', english: 'Germany', group: 'lands', lat: 51.0, lon: 10.5 },
  { id: 'dacia', latin: 'Dacia', english: 'Dacia', group: 'lands', lat: 46.0, lon: 24.5 },
  { id: 'parthia', latin: 'Parthia', english: 'Parthia', group: 'lands', lat: 34.5, lon: 48.0 },
  { id: 'cisalpina', latin: 'Gallia Cisalpina', english: 'Gaul this side of the Alps', group: 'lands', lat: 45.0, lon: 11.8 },
  { id: 'troia', latin: 'Troia', english: 'Troy', group: 'poetry', lat: 39.96, lon: 26.24 },
  { id: 'cumae', latin: 'Cumae', english: 'Cumae', group: 'poetry', lat: 40.85, lon: 14.06 },
  { id: 'delos', latin: 'Delos', english: 'Delos', group: 'poetry', lat: 37.4, lon: 25.27 },
  { id: 'lesbos', latin: 'Lesbos', english: 'Lesbos', group: 'poetry', lat: 39.2, lon: 26.3 },
  { id: 'helicon', latin: 'Helicon', english: 'Mount Helicon', group: 'poetry', lat: 38.35, lon: 22.82 },
  { id: 'parnassus', latin: 'Parnassus', english: 'Mount Parnassus', group: 'poetry', lat: 38.53, lon: 22.62 },
  { id: 'ithaca', latin: 'Ithaca', english: 'Ithaca', group: 'poetry', lat: 38.44, lon: 20.66 },
  { id: 'colchis', latin: 'Colchis', english: 'Colchis', group: 'poetry', lat: 42.15, lon: 41.65 },
  { id: 'mantua', latin: 'Mantua', english: 'Mantua', group: 'poetry', lat: 45.16, lon: 10.79 },
  { id: 'actium-place', latin: 'Actium', english: 'Actium', group: 'poetry', lat: 38.95, lon: 20.77 },
  { id: 'sparta', latin: 'Sparta', english: 'Sparta', group: 'poetry', lat: 37.08, lon: 22.43 },
  { id: 'byzantium', latin: 'Byzantium', english: 'Byzantium', group: 'poetry', lat: 41.01, lon: 28.98 }
];

// Generated by scripts/build-roman-map.py. Lambert conformal conic, parallels 31N and 47N.
/* roman-map-geometry:start */
const ROMAN_MAP_GEOMETRY = {
  width: 1000,
  height: 640,
  padX: 18.0,
  padY: 16.0,
  contentW: 964.0,
  contentH: 608.0,
  lon0: 20.0,
  lat0: 39.0,
  lat1: 31.0,
  lat2: 47.0,
  projMinX: -0.53262156,
  projMaxX: 0.52329495,
  projMinY: -0.28729057,
  projMaxY: 0.40238531,
  checkLon: 12.496,
  checkLat: 41.903,
  checkX: 416.13,
  checkY: 322.96,
  imageWidth: 2800,
  imageHeight: 1792,
  image: 'assets/roman-map.webp'
};
/* roman-map-geometry:end */

function romanMapProject(lon, lat) {
  const geometry = ROMAN_MAP_GEOMETRY;
  const radian = Math.PI / 180;
  const phi1 = geometry.lat1 * radian;
  const phi2 = geometry.lat2 * radian;
  const phi0 = geometry.lat0 * radian;
  const cone = Math.log(Math.cos(phi1) / Math.cos(phi2)) / Math.log(
    Math.tan(Math.PI / 4 + phi2 / 2) / Math.tan(Math.PI / 4 + phi1 / 2)
  );
  const scale = Math.cos(phi1) * (Math.tan(Math.PI / 4 + phi1 / 2) ** cone) / cone;
  const rho0 = scale / (Math.tan(Math.PI / 4 + phi0 / 2) ** cone);
  const rho = scale / (Math.tan(Math.PI / 4 + lat * radian / 2) ** cone);
  const theta = cone * (lon - geometry.lon0) * radian;
  const east = rho * Math.sin(theta);
  const north = rho0 - rho * Math.cos(theta);
  return {
    x: geometry.padX + (east - geometry.projMinX) / (geometry.projMaxX - geometry.projMinX) * geometry.contentW,
    y: geometry.padY + (geometry.projMaxY - north) / (geometry.projMaxY - geometry.projMinY) * geometry.contentH
  };
}

function layoutRomanMapPlaces() {
  const separation = 17;
  const clusterDistance = 17;
  ROMAN_MAP_PLACES.forEach((place) => {
    const projected = romanMapProject(place.lon, place.lat);
    place.x = projected.x;
    place.y = projected.y;
    place.tapX = projected.x;
    place.tapY = projected.y;
  });
  const parent = ROMAN_MAP_PLACES.map((_, index) => index);
  const find = (index) => (parent[index] === index ? index : (parent[index] = find(parent[index])));
  for (let left = 0; left < ROMAN_MAP_PLACES.length; left += 1) {
    for (let right = left + 1; right < ROMAN_MAP_PLACES.length; right += 1) {
      const a = ROMAN_MAP_PLACES[left];
      const b = ROMAN_MAP_PLACES[right];
      if (Math.hypot(a.x - b.x, a.y - b.y) < clusterDistance) parent[find(left)] = find(right);
    }
  }
  const groups = new Map();
  ROMAN_MAP_PLACES.forEach((place, index) => {
    const root = find(index);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(place);
  });
  groups.forEach((group) => {
    if (group.length < 2) return;
    const centerX = group.reduce((sum, place) => sum + place.x, 0) / group.length;
    const centerY = group.reduce((sum, place) => sum + place.y, 0) / group.length;
    group.sort((a, b) => Math.atan2(a.y - centerY, a.x - centerX) - Math.atan2(b.y - centerY, b.x - centerX) || a.id.localeCompare(b.id));
    const radius = separation / (2 * Math.sin(Math.PI / group.length));
    const start = Math.atan2(group[0].y - centerY, group[0].x - centerX);
    group.forEach((place, index) => {
      const angle = start + index * (2 * Math.PI / group.length);
      place.tapX = Math.min(976, Math.max(24, centerX + Math.cos(angle) * radius));
      place.tapY = Math.min(616, Math.max(24, centerY + Math.sin(angle) * radius));
    });
  });
  const home = ROMAN_MAP_PLACES.map((place) => ({ x: place.tapX, y: place.tapY }));
  for (let pass = 0; pass < 24; pass += 1) {
    for (let left = 0; left < ROMAN_MAP_PLACES.length; left += 1) {
      for (let right = left + 1; right < ROMAN_MAP_PLACES.length; right += 1) {
        const a = ROMAN_MAP_PLACES[left];
        const b = ROMAN_MAP_PLACES[right];
        const dx = b.tapX - a.tapX;
        const dy = b.tapY - a.tapY;
        const distance = Math.hypot(dx, dy);
        if (distance >= separation || distance < 0.01) continue;
        const push = (separation - distance) / 2;
        a.tapX -= dx / distance * push;
        a.tapY -= dy / distance * push;
        b.tapX += dx / distance * push;
        b.tapY += dy / distance * push;
      }
    }
    ROMAN_MAP_PLACES.forEach((place, index) => {
      const dx = place.tapX - home[index].x;
      const dy = place.tapY - home[index].y;
      const drift = Math.hypot(dx, dy);
      if (drift > 12) {
        place.tapX = home[index].x + dx / drift * 12;
        place.tapY = home[index].y + dy / drift * 12;
      }
      place.tapX = Math.min(976, Math.max(24, place.tapX));
      place.tapY = Math.min(616, Math.max(24, place.tapY));
    });
  }
}

layoutRomanMapPlaces();

const RomanWorldState = {
  tab: 'myth',
  timelineChoices: [],
  timelinePicks: [],
  timelineChecked: false,
  mapGroup: 'all',
  mapQueue: [],
  mapIndex: 0,
  mapCorrect: 0,
  mapAsked: 0,
  mapLabels: false,
  mapNote: '',
  mapScroll: null
};

function romanWorldShuffle(items) {
  const copy = items.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const hold = copy[index];
    copy[index] = copy[swap];
    copy[swap] = hold;
  }
  return copy;
}

function romanWorldCard(id) {
  return CULTURE_UNIT_CARDS.find((card) => card.id === id) || null;
}

function renderCultureUnitCard(card) {
  return `
    <article class="roman-world-card">
      <span class="culture-mark" aria-hidden="true">${escapeHtml(card.mark || 'R')}</span>
      <div>
        <h3>${escapeHtml(card.title)}</h3>
        <p class="culture-latin">${escapeHtml(card.latinTitle)}</p>
        <p>${escapeHtml(card.summary)}</p>
        ${card.example && card.example.latin ? `<blockquote class="culture-example"><p lang="la">${escapeHtml(card.example.latin)}</p><p>${escapeHtml(card.example.english || '')}</p><p class="culture-example-source">${escapeHtml(card.example.source || '')}</p></blockquote>` : ''}
        <p class="culture-connection">${escapeHtml(card.connection)}</p>
      </div>
    </article>
  `;
}

function startTimelineRound() {
  const pool = romanWorldShuffle(ROMAN_TIMELINE).slice(0, 5);
  RomanWorldState.timelineChoices = pool;
  RomanWorldState.timelinePicks = [];
  RomanWorldState.timelineChecked = false;
}

function renderTimelineGame() {
  if (RomanWorldState.timelineChoices.length === 0) startTimelineRound();
  const picked = new Set(RomanWorldState.timelinePicks.map((item) => item.order));
  const remaining = RomanWorldState.timelineChoices.filter((item) => !picked.has(item.order));
  const answer = RomanWorldState.timelineChecked
    ? [...RomanWorldState.timelineChoices].sort((left, right) => left.order - right.order)
    : [];
  const correct = RomanWorldState.timelineChecked
    && RomanWorldState.timelinePicks.every((item, index) => item.order === answer[index]?.order);
  return `
    <section class="timeline-game">
      <h3>Put five events in order</h3>
      <p>Click the events from oldest to newest. Years are shown after you check.</p>
      <div class="timeline-columns">
        <div>
          <h4>Choose next</h4>
          <div class="timeline-choices">
            ${remaining.map((item) => `<button type="button" data-timeline-pick="${item.order}">${escapeHtml(item.label)}</button>`).join('') || '<p>All five are in your list.</p>'}
          </div>
        </div>
        <div>
          <h4>Your order</h4>
          <ol class="timeline-picks">
            ${RomanWorldState.timelinePicks.map((item) => `<li>${escapeHtml(item.label)}${RomanWorldState.timelineChecked ? ` <small>(${escapeHtml(item.when)})</small>` : ''}</li>`).join('') || '<li>Oldest event goes here.</li>'}
          </ol>
        </div>
      </div>
      <div class="timeline-actions">
        <button type="button" data-timeline-action="check">Check order</button>
        <button type="button" data-timeline-action="undo">Undo</button>
        <button type="button" data-timeline-action="next">New five</button>
      </div>
      ${RomanWorldState.timelineChecked ? `<p class="timeline-result">${correct ? 'That order matches the timeline.' : 'Not yet. The oldest-to-newest order is listed below.'}</p>` : ''}
      ${RomanWorldState.timelineChecked && !correct ? `<ol class="timeline-key">${answer.map((item) => `<li>${escapeHtml(item.label)} <small>(${escapeHtml(item.when)})</small></li>`).join('')}</ol>` : ''}
    </section>
  `;
}

function mapPlacesForGroup(group) {
  if (!group || group === 'all') return ROMAN_MAP_PLACES;
  return ROMAN_MAP_PLACES.filter((place) => place.group === group);
}

function startMapRound() {
  const places = mapPlacesForGroup(RomanWorldState.mapGroup);
  RomanWorldState.mapQueue = romanWorldShuffle(places).slice(0, 8);
  RomanWorldState.mapIndex = 0;
  RomanWorldState.mapCorrect = 0;
  RomanWorldState.mapAsked = 0;
  RomanWorldState.mapNote = 'Click the dot for the place named below.';
}

const ROMAN_MAP_SEA_TITLES = [
  { latin: 'Oceanus Atlanticus', lon: -8.4, lat: 42.5 },
  { latin: 'Mare Nostrum', lon: 16.2, lat: 33.6 },
  { latin: 'Mare Internum', lon: 27.2, lat: 34.6 }
];

function mapSeaTitleMarkup() {
  if (!RomanWorldState.mapLabels) return '';
  return ROMAN_MAP_SEA_TITLES.map((title) => {
    const point = romanMapProject(title.lon, title.lat);
    return `<span class="roman-map-sea" style="left:${(point.x / 10).toFixed(2)}%;top:${(point.y / 6.4).toFixed(2)}%">${escapeHtml(title.latin)}</span>`;
  }).join('');
}

function mapLeaderMarkup() {
  const marks = ROMAN_MAP_PLACES.map((place) => {
    if (Math.hypot(place.tapX - place.x, place.tapY - place.y) < 8) return '';
    return `<line x1="${place.x.toFixed(1)}" y1="${place.y.toFixed(1)}" x2="${place.tapX.toFixed(1)}" y2="${place.tapY.toFixed(1)}"></line><circle cx="${place.x.toFixed(1)}" cy="${place.y.toFixed(1)}" r="2.4"></circle>`;
  }).join('');
  return `<svg class="roman-map-leaders" viewBox="0 0 1000 640" aria-hidden="true">${marks}</svg>`;
}

function renderRomanMap() {
  if (RomanWorldState.mapQueue.length === 0) startMapRound();
  const target = RomanWorldState.mapQueue[RomanWorldState.mapIndex] || null;
  const groups = [
    ['all', 'All places'],
    ['mediterranean', 'Mediterranean'],
    ['italy', 'Italy'],
    ['waters', 'Seas and rivers'],
    ['lands', 'Lands and mountains'],
    ['poetry', 'Poetry places']
  ];
  const dots = ROMAN_MAP_PLACES.map((place) => {
    const hidden = RomanWorldState.mapGroup !== 'all' && place.group !== RomanWorldState.mapGroup;
    const classes = ['roman-map-dot'];
    if (hidden) classes.push('is-dim');
    if (place.tapX > 860) classes.push('is-label-left');
    if (place.tapY < 40) classes.push('is-label-below');
    if (place.group === 'waters') classes.push('is-water');
    if (Math.hypot(place.tapX - place.x, place.tapY - place.y) >= 8) classes.push('has-leader');
    return `
      <button
        type="button"
        class="${classes.join(' ')}"
        style="left:${(place.tapX / 10).toFixed(2)}%;top:${(place.tapY / 6.4).toFixed(2)}%"
        data-map-place="${escapeHtml(place.id)}"
        aria-label="${escapeHtml(place.english)}"
      >${RomanWorldState.mapLabels ? `<span>${escapeHtml(place.latin)}</span>` : ''}</button>
    `;
  }).join('');
  return `
    <section class="roman-map-panel">
      <div class="roman-map-toolbar">
        ${groups.map(([id, label]) => `<button type="button" data-map-group="${id}" class="${RomanWorldState.mapGroup === id ? 'active' : ''}">${escapeHtml(label)}</button>`).join('')}
        <button type="button" data-map-action="labels" aria-pressed="${RomanWorldState.mapLabels ? 'true' : 'false'}">${RomanWorldState.mapLabels ? 'Hide labels' : 'Show labels'}</button>
      </div>
      <p class="roman-map-prompt">${target ? `Where is <strong>${escapeHtml(target.latin)}</strong>, ${escapeHtml(target.english)}?` : 'Round complete.'}</p>
      <p class="roman-map-note">${escapeHtml(RomanWorldState.mapNote)} Score ${RomanWorldState.mapCorrect}/${RomanWorldState.mapAsked}.</p>
      <div class="roman-map-frame" tabindex="0">
        <div class="roman-map-stage">
          <img class="roman-map-image" src="${ROMAN_MAP_GEOMETRY.image}" width="${ROMAN_MAP_GEOMETRY.imageWidth}" height="${ROMAN_MAP_GEOMETRY.imageHeight}" alt="Parchment map of the lands around the Mediterranean, from the Atlantic to Mesopotamia, with coastlines, rivers, lakes, and shaded relief.">
          ${mapLeaderMarkup()}
          ${mapSeaTitleMarkup()}
          ${dots}
        </div>
      </div>
      <p class="roman-map-pan">Slide the map to look around Italy and the rest of the sea.</p>
      <p class="roman-map-credit">Coastlines, rivers, and lakes from Natural Earth, public domain. Relief from NOAA ETOPO5, public domain. Each place is drawn at its latitude and longitude.</p>
    </section>
  `;
}

function captureMapScroll() {
  const frame = document.querySelector('#romanWorldStage .roman-map-frame');
  if (!frame) return;
  RomanWorldState.mapScroll = { left: frame.scrollLeft, top: frame.scrollTop };
}

function restoreMapScroll() {
  const frame = document.querySelector('#romanWorldStage .roman-map-frame');
  if (!frame) return;
  if (RomanWorldState.mapScroll && typeof RomanWorldState.mapScroll.left === 'number') {
    frame.scrollLeft = RomanWorldState.mapScroll.left;
    frame.scrollTop = RomanWorldState.mapScroll.top;
    return;
  }
  const fits = frame.scrollWidth <= frame.clientWidth + 2 && frame.scrollHeight <= frame.clientHeight + 2;
  if (fits) {
    frame.scrollLeft = 0;
    frame.scrollTop = 0;
    return;
  }
  const italy = ROMAN_MAP_PLACES.find((place) => place.id === 'italia');
  if (!italy) return;
  frame.scrollLeft = Math.max(0, frame.scrollWidth * (italy.x / 1000) - frame.clientWidth / 2);
  frame.scrollTop = Math.max(0, frame.scrollHeight * (italy.y / 640) - frame.clientHeight / 2);
}

function renderRomanWorld() {
  const stage = document.getElementById('romanWorldStage');
  if (!stage) return;
  captureMapScroll();
  const tabs = [
    ['myth', 'Mythology'],
    ['life', 'Daily life'],
    ['history', 'History'],
    ['authors', 'Authors'],
    ['values', 'Values'],
    ['map', 'Map']
  ];
  const cards = RomanWorldState.tab === 'map'
    ? ''
    : CULTURE_UNIT_CARDS.filter((card) => card.unit === (RomanWorldState.tab === 'history' ? 'history' : RomanWorldState.tab))
      .map(renderCultureUnitCard)
      .join('');
  const extra = RomanWorldState.tab === 'history'
    ? renderTimelineGame()
    : RomanWorldState.tab === 'map'
      ? renderRomanMap()
      : '';
  stage.innerHTML = `
    <div class="roman-world-tabs" role="tablist">
      ${tabs.map(([id, label]) => `<button type="button" role="tab" data-roman-tab="${id}" class="${RomanWorldState.tab === id ? 'active' : ''}" aria-selected="${RomanWorldState.tab === id}">${label}</button>`).join('')}
    </div>
    ${extra}
    <div class="roman-world-grid">${cards}</div>
  `;
  restoreMapScroll();
}

function onRomanWorldClick(event) {
  const tab = event.target.closest('[data-roman-tab]');
  if (tab) {
    RomanWorldState.tab = tab.getAttribute('data-roman-tab');
    renderRomanWorld();
    return;
  }
  const pick = event.target.closest('[data-timeline-pick]');
  if (pick && !RomanWorldState.timelineChecked) {
    const order = Number(pick.getAttribute('data-timeline-pick'));
    const item = RomanWorldState.timelineChoices.find((entry) => entry.order === order);
    if (item) RomanWorldState.timelinePicks.push(item);
    renderRomanWorld();
    return;
  }
  const action = event.target.closest('[data-timeline-action]');
  if (action) {
    const name = action.getAttribute('data-timeline-action');
    if (name === 'check') RomanWorldState.timelineChecked = RomanWorldState.timelinePicks.length === 5;
    if (name === 'undo') {
      RomanWorldState.timelinePicks.pop();
      RomanWorldState.timelineChecked = false;
    }
    if (name === 'next') startTimelineRound();
    renderRomanWorld();
    return;
  }
  const group = event.target.closest('[data-map-group]');
  if (group) {
    RomanWorldState.mapGroup = group.getAttribute('data-map-group');
    startMapRound();
    renderRomanWorld();
    return;
  }
  const mapAction = event.target.closest('[data-map-action]');
  if (mapAction) {
    RomanWorldState.mapLabels = !RomanWorldState.mapLabels;
    renderRomanWorld();
    return;
  }
  const dot = event.target.closest('[data-map-place]');
  if (dot) {
    const target = RomanWorldState.mapQueue[RomanWorldState.mapIndex];
    if (!target) return;
    RomanWorldState.mapAsked += 1;
    if (dot.getAttribute('data-map-place') === target.id) {
      RomanWorldState.mapCorrect += 1;
      RomanWorldState.mapIndex += 1;
      RomanWorldState.mapNote = RomanWorldState.mapIndex >= RomanWorldState.mapQueue.length
        ? 'Round complete. Choose a group to start another.'
        : 'Right. Here is the next place.';
    } else {
      const chosen = ROMAN_MAP_PLACES.find((place) => place.id === dot.getAttribute('data-map-place'));
      RomanWorldState.mapNote = `That dot is ${chosen ? chosen.latin : 'another place'}. Try the prompt again.`;
    }
    renderRomanWorld();
  }
}

function bindRomanWorld() {
  const stage = document.getElementById('romanWorldStage');
  if (stage && !stage.dataset.bound) {
    stage.dataset.bound = 'true';
    stage.addEventListener('click', onRomanWorldClick);
  }
}
