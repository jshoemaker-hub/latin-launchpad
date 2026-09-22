# Reference Content Backlog

Source set reviewed: `ref/IMG_2450.jpeg` through `ref/IMG_2490.jpeg`, plus the new batch `ref/IMG_2493.jpeg` through `ref/IMG_2543.jpeg`.

This file organizes content from the photographed reference pages for later website integration. Treat OCR as a first pass: every publishable item should be checked against the source image or a public-domain source before going live. Items are grouped by the destination they most naturally fit in the current site.

## Integration Priorities

1. Add high-value Latin sayings to `latin-phrases.js`, especially sayings that connect to existing grade 3-8 word-bank terms.
2. Add culture/story cards to `latin-stories.js` as short fact scenes, separate from the current Discover Latin narrative scenes.
3. Add conversational and classroom phrases as a new "say it in class" resource or mini-practice mode.
4. Expand `word-banks.js` with verified vocabulary clusters rather than importing the full photographed vocabulary index at once.
5. Keep oral drills and grammar charts as teacher-facing source material until the quiz format can represent forms cleanly.

## New Reference Batch: IMG_2493-IMG_2543

The September 17 batch expands the source library beyond the earlier phrase and grammar pages. OCR has been reviewed enough for planning and first-pass app integration; still verify exact macrons and punctuation before publishing formal handouts.

| Images | Main information | First integration |
| --- | --- | --- |
| IMG_2493-IMG_2497 | Latin alphabet, letter names, U/V and J history, vowel length, diphthongs, consonant sounds, and accent rules. | Added `grade3-grammar-latin-sounds`; added `roman-alphabet` culture card. |
| IMG_2498 | Roman world map, including Britannia, Gallia, Hispania, Africa, Italia, Graecia, Asia, Syria, Aegyptus, and major seas. | Added `roman-world-map` culture card. |
| IMG_2499 | Ennius, early Latin literature, Cato the Elder, Carthage, the Punic Wars, and `Carthago delenda est`. | Added `ennius-cato-carthage` culture card with moral framing. |
| IMG_2500 | Short Romulus and Remus reading with Mars, Rhea Silvia, Amulius, the twins, the river, the she-wolf, and the founding of Rome. | Added `romulus-remus-reading` culture card and vocabulary support. |
| IMG_2501 | Chronological list of authors and works: Plautus through Boethius, including Cicero, Caesar, Vergil, Livy, Augustine, and Boethius. | Added `roman-authors-timeline`. |
| IMG_2502, IMG_2503, IMG_2543 | School, library, book, state motto, and abbreviation phrases: `Alma mater`, `Ex libris`, `AD`, `e.g.`, `Ditat Deus`, `Esse quam videri`, `etc.`, `P.S.`, and `@` from `apud`. | Integrated every distinct Latin saying or term, retained existing equivalents only once, and added `latin-abbreviations-today`. |
| IMG_2504-IMG_2515 | Noun, adjective, pronoun, and verb paradigms through perfect, pluperfect, future perfect, imperatives, participles, infinitives, `sum`, and `possum`. | Added declension review, commands and infinitives, and complete verb-system lessons; existing adjective, pronoun, and participle lessons cover the overlapping charts. |
| IMG_2516-IMG_2520 | Syntax appendix: case uses, prepositions, conjunctions, interrogatives, agreement, infinitives, possession, transitive/intransitive verbs, substantive adjectives, relative pronouns, and participles. | Added `grade7-grammar-syntax-agreement` and `grade8-grammar-infinitives-possession`. |
| IMG_2521-IMG_2524 | Historical timeline from legendary Troy and Rome's founding through Republic, Empire, Constantine, Augustine, the fall of Rome, Justinian, and Constantinople in 1453. | Added cards on the Twelve Tables, republican government, expansion, civil wars, Augustus, Pompeii, Christianity in late Rome, and Constantinople and Justinian. |
| IMG_2525-IMG_2538 | English-Latin and Latin-English glossary pages from the Year 4 reference book. | Compared both directions against the existing 392-entry index and added 144 distinct reading-vocabulary records; runtime normalization prevents overlap with existing grade banks. |
| IMG_2539 | City of Rome map with Forum, Curia Julia, Via Sacra, temples, Capitoline, Palatine, Aventine, Circus Maximus, Colosseum, and Via Appia. | Added `city-of-rome-map` culture card. |
| IMG_2540 | War and peace phrases: `Arma cedant togae`, `Casus belli`, `Divide et impera`, Horace on patriotic death, Vegetius on peace and war, Tacitus on conquest, and `Vae victis`. | Integrated the distinct phrases and `roman-war-peace`; duplicate ideas already represented by `Dulce et decorum est` and `Si vis pacem, para bellum` were not repeated. |
| IMG_2541 | Roman food and dining: `ientaculum`, `prandium`, `cena`, light breakfast/lunch, dinner after baths, triclinium, reclining, handwashing, utensils, and napkins. | Added `roman-food-triclinium` culture card and meal vocabulary. |

### Classical Christian Framing Notes

| Topic | Teaching angle |
| --- | --- |
| Roman gods and founding legends | Teach them as Roman myth and cultural memory, not as objects of devotion. Compare pagan civic identity with Christian providence, humility, and the worth of persons. |
| Roman government and war | Admire ordered law, civic duty, and rhetoric while judging conquest, slavery, and domination by justice and charity. |
| Roman meals and customs | Use ordinary customs to discuss gratitude, moderation, hospitality, and fellowship. |
| Literature and history | Present pagan and Christian authors together in historical sequence, with Augustine and Boethius showing how Christian thought inherited and corrected classical learning. |

### Integration Totals

| Content area | Integrated total after this batch |
| --- | ---: |
| Reference index vocabulary | 392 |
| New reading-glossary records added | 144 |
| Sayings and common expressions | 91 |
| Culture and history cards | 32 |
| Grammar lesson packs | 23 |

## Latin Phrases And Sayings

### Already Represented In The Site

These are already present or closely represented in `latin-phrases.js`; they can be enriched with source notes instead of duplicated.

| Latin | Meaning | Source images | Notes |
| --- | --- | --- | --- |
| Ad astra per aspera / Per aspera ad astra | To the stars through difficulties | IMG_2476 | Existing app has `Per aspera ad astra`. |
| Carpe diem. | Seize the day. | IMG_2476 | Existing. |
| Tempus fugit. | Time flies. | IMG_2476 | Existing. |
| Veni, vidi, vici. | I came, I saw, I conquered. | IMG_2476 | Existing. |
| Mea culpa. | My fault. | IMG_2453, IMG_2476 | Good candidate to add if not already live. |

### Strong Add Candidates

These are short, memorable, and useful for kid-friendly phrase cards.

| Latin | Meaning | Source images | Website angle |
| --- | --- | --- | --- |
| Alma mater | Nourishing mother | IMG_2476 | Explain school/university usage. |
| Anno Domini (A.D.) | In the year of our Lord | IMG_2476 | Calendar/history connection. |
| Ante bellum | Before the war | IMG_2476 | Prefix/English derivative connection. |
| Caput Mundi | Head of the world | IMG_2476 | Rome as world capital. |
| Cave canem. | Beware the dog. | IMG_2476 | Fun concrete phrase with `canis`. |
| Civis Romanus sum. | I am a Roman citizen. | IMG_2476 | Civic identity and `civis`. |
| Docere, delectare, movere | To teach, to delight, to move | IMG_2476 | Rhetoric and classroom purpose. |
| Errare est humanum. | To err is human. | IMG_2476 | Good gentle mistake/retry phrase. |
| Fortes fortuna juvat. | Fortune helps the brave. | IMG_2476 | Connects to `fortuna`, `fortis`. |
| Mater Italiae Roma | Rome, mother of Italy | IMG_2476 | Geography/culture card. |
| Nunc aut numquam. | Now or never. | IMG_2476 | Easy adverb phrase. |
| Ora et labora. | Pray and work. | IMG_2476 | Short motto. |
| Pax Romana | Roman Peace | IMG_2462, IMG_2476 | Pairs with Ara Pacis story card. |
| Quattuor anni tempora | The four seasons of the year | IMG_2476 | Numbers and time. |
| Rex Regum | King of Kings | IMG_2476 | Phrase card, verify audience fit. |
| Roma Aeterna | Eternal Rome | IMG_2476 | Culture/geography. |
| Semper fidelis | Always faithful | IMG_2476 | Common motto, easy adverb/adjective. |
| Senatus Populusque Romanus (S.P.Q.R.) | The Senate and People of Rome | IMG_2476 | Roman government emblem. |
| Stabat Mater | The mother was standing | IMG_2476 | Phrase/history note, older grades. |
| Video et taceo. | I see and am silent. | IMG_2476 | Verb pair. |
| A mari usque ad mare | From sea to sea | IMG_2466, IMG_2476 | Canada motto; preposition contrast. |
| Ab Urbe Condita | From the founding of the city | IMG_2455, IMG_2476 | Livy/history connection. |
| Ager Vaticanus | The Vatican Field | IMG_2451, IMG_2476 | Place-name story card. |
| Amicus in necessitate probatur. | A friend is proven in time of need. | IMG_2476 | Friendship proverb. |
| Ars longa vita brevis. | Art is long, life is short. | IMG_2476 | Older grades, aphorism. |
| Aut viam inveniam aut faciam. | I shall either find a way or make one. | IMG_2461, IMG_2476 | Growth-mindset motto. |
| Capitur urbs quae totum cepit orbem. | The city which captured the world is captured. | IMG_2471, IMG_2476 | St. Jerome/Rome story, grades 7-8. |
| Dictum et factum | Said and done | IMG_2476 | Compact phrase. |
| Ego sum via et veritas et vita. | I am the way, the truth, and the life. | IMG_2476 | Verify audience fit before adding. |
| Et tu, Brute? | You too, Brutus? | IMG_2454, IMG_2476 | Betrayal/Julius Caesar culture note. |
| Ferrum ferro exacuitur. | Iron is sharpened by iron. | IMG_2470, IMG_2476 | Passive voice and ablative of means. |
| Festina lente. | Make haste slowly. | IMG_2476 | Paradox/proverb card. |
| Hannibal ad portas | Hannibal at the gates | IMG_2456, IMG_2476 | History card. |
| In hoc signo vinces. | In this sign you will conquer. | IMG_2460, IMG_2476 | Constantine story, older grades. |
| Magister dixit. | The master has spoken. | IMG_2465, IMG_2476 | School/rhetoric. |
| Mare Nostrum | Our Sea | IMG_2476 | Roman geography, Mediterranean. |
| Noscitur ex sociis. | He is known by his companions. | IMG_2469, IMG_2476 | Proverb/friendship. |
| Quid novi? | What's new? | IMG_2476 | Conversational phrase. |
| Repetitio mater studiorum. | Repetition is the mother of learning. | IMG_2476 | Excellent lesson/review motto. |

## Conversational And Classroom Latin

Source images: IMG_2473, IMG_2474.

These are strong candidates for a classroom phrase deck, speaking warmup, or teacher mode.

| Latin | Meaning | Suggested use |
| --- | --- | --- |
| Salve / Salvete | Hello | Greeting card. |
| Vale / Valete | Goodbye | Closing routine. |
| Quid est nomen tibi? | What is your name? | Speaking practice. |
| Mihi nomen est ... | My name is ... | Speaking practice. |
| Quid agis? | How are you? | Speaking practice. |
| Valeo. | I am well. | Speaking practice. |
| Gratias tibi ago. | Thank you. | Courtesy phrase. |
| Nihil est. | You are welcome. | Courtesy phrase. |
| Ignosce mihi, quaeso. | Excuse me, please. | Courtesy phrase. |
| Sodes. | Please. | Older/interesting form; verify note. |
| Me paenitet. | I am sorry. | Courtesy phrase. |
| Te amo. | I love you. | Family/courtesy phrase. |
| Ita. | Yes. | Fast response. |
| Salvete, discipuli. | Hello, students. | Teacher prompt. |
| Salve, magister / magistra. | Hello, teacher. | Student response. |
| Sede / Sedete. | Sit down. | Classroom command. |
| Surge / Surgite. | Stand up. | Classroom command. |
| Adsum. | Present. | Attendance routine. |
| Aperi / Aperite ... | Open ... | Classroom command with `ianuam`, `fenestram`, `librum`. |
| Claude / Claudite ... | Close ... | Classroom command with `ianuam`, `fenestram`, `librum`. |
| Audi / Audite diligenter. | Listen carefully. | Classroom command. |
| Impossibile est. | That is impossible. | Fun reaction phrase. |
| Esne confusus/confusa? | Are you puzzled? | Support prompt. |
| Explica, quaeso. | Please explain. | Discussion prompt. |
| Non intellego. | I do not understand. | Help-seeking phrase. |
| Adiuva me. | Help me. | Help-seeking phrase. |
| Falsum / Verum | Incorrect / correct | Feedback labels. |
| Silentium, quaeso. | Silence, please. | Classroom command. |
| Responde mihi. | Answer me. | Teacher prompt. |
| Bene actum. | Well done. | Feedback phrase. |
| Optime! | Excellent! | Feedback phrase. |
| Scribe haec verba. | Write these words. | Classroom command. |
| Fiat. | All right; let it be done. | Short response. |
| De hoc satis! | Enough of this! | Fun teacher phrase. |
| Collige folia. | Collect the papers. | Classroom command. |
| Quid dixit? / Quid dixisti? | What did he say? / What did you say? | Listening check. |

## Culture And Story Cards

These can become short fact cards, illustration prompts, or mini-reading unlocks. They should stay brief in the student UI and link to one or two target words.

| Topic | Source images | Organized facts | Suggested linked words |
| --- | --- | --- | --- |
| Via Appia | IMG_2450 | Roman roads supported communication, trade, and troop movement. The Appian Way linked Rome with Brundisium, the gateway toward Greece and the East. | via, Roma, miles, Italia |
| Ager Vaticanus and St. Peter's | IMG_2451 | The Vatican area was once outside ancient Rome, used as a cemetery and later associated with St. Peter. Constantine's basilica was replaced by the later St. Peter's Basilica, with major Renaissance and Baroque work. | ager, urbs, Christianus, basilica |
| Pont du Gard | IMG_2452 | Roman aqueducts carried clean water to cities for homes, baths, and fountains; the Pont du Gard is a major surviving aqueduct bridge in southern France. | aqua, pons, urbs, fons |
| Janus | IMG_2453 | Janus was shown with two faces and associated with gates, doors, beginnings, and endings; January is named from him. | ianua, initium, mensis |
| Livy and Ab Urbe Condita | IMG_2455 | Livy wrote a monumental history of Rome from its founding through Augustus; only part of the original work survives. | urbs, Roma, historia |
| Hannibal and Carthage | IMG_2456 | After Cannae, Hannibal's army reached the gates of Rome. The phrase `Hannibal ad portas` became a warning of danger. | porta, bellum, exercitus |
| Hadrian's Wall | IMG_2457 | Hadrian's Wall marked Rome's northern frontier in Britain and shows the empire shifting from expansion to consolidation. | vallum, miles, imperium |
| Antonine Wall | IMG_2458 | The Antonine Wall in Scotland was begun under Antoninus Pius, but Rome withdrew back to Hadrian's Wall after about twenty years. | vallum, septentrio, imperator |
| Arch of Constantine | IMG_2460 | The arch commemorates Constantine's victory at the Milvian Bridge; pair with `In hoc signo vinces`. | signum, vinco, imperator |
| Ara Pacis | IMG_2462 | The Altar of Peace celebrated the end of civil wars and the beginning of the Pax Romana. | pax, Roma, terra, frumentum |
| Trajan's Column | IMG_2463 | Trajan's Column commemorated the Dacian wars with a spiral relief narrative. | columna, bellum, victoria |
| Cincinnatus and Fasces | IMG_2467 | Cincinnatus returned power and went back to the plow. Fasces symbolized Roman public authority and appear in American civic imagery. | fasces, ager, potestas |
| Fall of Rome and St. Jerome | IMG_2471 | Jerome reacted to Alaric's sack of Rome with the line about the city that captured the world being captured. Augustine's `City of God` gave a different Christian response. | urbs, capio, mundus |

## Grammar And Syntax Notes

These are useful as teacher notes or future higher-grade grammar cards.

| Concept | Source images | Website-ready summary |
| --- | --- | --- |
| Genitive as stem clue | IMG_2451 | Learn the genitive singular because it identifies declension and gives the stem. |
| Personal pronoun emphasis | IMG_2454 | Latin often omits subject pronouns because the verb ending already shows person and number; use pronouns for emphasis or contrast. |
| Ablative prepositions | IMG_2455 | Some prepositions take the ablative: `ab/a`, `ex/e`, `cum`, `sine`, `de`, `pro`, `prae`, `coram`. |
| Accusative prepositions | IMG_2456 | Many motion or direction prepositions take the accusative: `ad`, `ante`, `apud`, `circum`, `contra`, `inter`, `ob`, `per`, `post`, `propter`, `trans`. |
| `in` and `sub` | IMG_2456 | With the accusative they suggest motion; with the ablative they suggest location. |
| Third/fourth conjugation present system | IMG_2460, IMG_2461 | The present endings are regular, but stem vowels vary; imperfect is regular; future differs from first/second conjugation. |
| Perfect stem | IMG_2465, IMG_2466 | Find the perfect stem by dropping `-i` from the third principal part, then add regular perfect-system endings. |
| Active/passive personal endings | IMG_2469 | Active endings: `o/m, s, t, mus, tis, nt`; passive endings: `or/r, ris, tur, mur, mini, ntur`. |
| Ablative of means | IMG_2470 | Use the ablative without a preposition for a non-living means or instrument. |
| Ablative of agent | IMG_2472 | Use `a/ab` plus ablative for a living agent in passive constructions. |
| Sentence labels and patterns | IMG_2477-IMG_2480 | Future grammar UI could teach subject, verb, direct object, predicate adjective, predicate nominative, and indirect object with diagrams. |
| English and Latin tenses | IMG_2480 | Latin does not map one-to-one onto English progressive forms; students need examples for present, imperfect, perfect, future, and future perfect. |
| Pronoun families | IMG_2481 | Good future reference chart: personal, possessive, reflexive, intensive, interrogative, relative, demonstrative, indefinite. |

## Vocabulary Clusters

The photographed vocabulary index is broad and overlaps heavily with the current word banks. These clusters are the safest first additions because they support phrases, culture cards, and classroom use.

### Conversational And Classroom Words

| Latin | Meaning | Source images |
| --- | --- | --- |
| nomen | name | IMG_2485 |
| discipulus | student | IMG_2485 |
| magister | teacher | IMG_2485 |
| magistra | teacher | IMG_2485 |
| tabella | writing tablet | IMG_2486, IMG_2490 |
| sella | seat | IMG_2486 |
| ianua | door | IMG_2485 |
| fenestra | window | IMG_2485, IMG_2489 |
| folium | leaf; paper | IMG_2485 |
| verbum | word | IMG_2486 |

### Culture And Civic Words

| Latin | Meaning | Source images |
| --- | --- | --- |
| civis | citizen | IMG_2483 |
| imperator | general, commander | IMG_2472, IMG_2485 |
| dux | leader | IMG_2485 |
| legatus | lieutenant, envoy | IMG_2472, IMG_2485 |
| miles | soldier | IMG_2485 |
| exercitus | army | IMG_2485 |
| rex | king | IMG_2486 |
| regnum | kingdom | IMG_2486 |
| senatus | senate | IMG_2486 |
| senator | senator | IMG_2472, IMG_2486 |
| lex | law | IMG_2485 |
| provincia | province | IMG_2486 |
| portus | harbor | IMG_2486 |
| pons | bridge | IMG_2486 |
| vallum | wall, rampart | IMG_2472, IMG_2486 |
| scutum | shield | IMG_2472, IMG_2486 |

### Nature And Place Words

| Latin | Meaning | Source images |
| --- | --- | --- |
| caelum | sky, heaven | IMG_2483 |
| campus | field, plain | IMG_2472, IMG_2483 |
| collis | hill | IMG_2483 |
| flumen | river | IMG_2485 |
| mare | sea | IMG_2485 |
| mons | mountain | IMG_2485 |
| pons | bridge | IMG_2486 |
| sol | sun | IMG_2486 |
| umbra | shadow | IMG_2486 |
| ventus | wind | IMG_2472, IMG_2486 |
| unda | wave | IMG_2486 |
| silva | forest | IMG_2486 |
| saxum | rock | IMG_2486 |

### People And Family Words

| Latin | Meaning | Source images |
| --- | --- | --- |
| frater | brother | IMG_2485 |
| soror | sister | IMG_2486 |
| mater | mother | IMG_2485 |
| pater | father | IMG_2486 |
| filius | son | IMG_2485 |
| filia | daughter | IMG_2485 |
| servus | servant, slave | IMG_2486 |
| nauta | sailor | IMG_2485 |
| pastor | shepherd | IMG_2472, IMG_2486 |
| piscator | fisherman | IMG_2472 |
| orator | speaker, orator | IMG_2472, IMG_2486 |
| poeta | poet | IMG_2486 |

### Useful Verbs With Principal-Parts Value

| Latin | Meaning | Source images | Note |
| --- | --- | --- | --- |
| capio, capere, cepi, captus | take, capture | IMG_2462, IMG_2471, IMG_2483 | Supports passive and Rome story. |
| dico, dicere, dixi, dictus | say, speak | IMG_2465, IMG_2485 | Supports `Magister dixit`. |
| duco, ducere, duxi, ductus | lead | IMG_2485 | Common core verb. |
| facio, facere, feci, factus | make, do | IMG_2462, IMG_2485 | Supports `Aut viam... faciam`. |
| fugio, fugere, fugi, fugitus | flee | IMG_2462, IMG_2467, IMG_2485 | Story/action verb. |
| invenio, invenire, inveni, inventus | find, discover | IMG_2461, IMG_2466, IMG_2485 | Supports motto. |
| iacio, iacere, ieci, iactus | throw, hurl | IMG_2462, IMG_2467, IMG_2485 | Action verb. |
| iungo, iungere, iunxi, iunctus | join, connect | IMG_2465, IMG_2485 | Word-building value. |
| rego, regere, rexi, rectus | rule | IMG_2465, IMG_2486 | Perfect-stem example. |
| sentio, sentire, sensi, sensus | feel, perceive | IMG_2466, IMG_2486 | Grade 7-8 verb. |
| traho, trahere, traxi, tractus | drag, haul | IMG_2486 | Principal-parts pattern. |
| veho, vehere, vexi, vectus | carry, convey | IMG_2486 | Travel verb. |
| venio, venire, veni, ventus | come | IMG_2466, IMG_2486 | Common irregular-ish principal parts. |
| vinco, vincere, vici, victus | conquer | IMG_2486 | Supports Caesar and Constantine. |

### Prepositions, Questions, And Time Words

| Latin | Meaning | Source images |
| --- | --- | --- |
| a/ab | by, from | IMG_2455, IMG_2483 |
| ad | to, toward, at | IMG_2456, IMG_2483 |
| ante | before | IMG_2456, IMG_2483 |
| circum | around | IMG_2456, IMG_2483 |
| contra | against | IMG_2456, IMG_2483 |
| coram | in the presence of | IMG_2455, IMG_2483 |
| de | about, down from | IMG_2455, IMG_2483 |
| e/ex | out of, out from | IMG_2455, IMG_2485 |
| inter | between, among | IMG_2456, IMG_2485 |
| ob | because of | IMG_2456, IMG_2485 |
| per | through | IMG_2456, IMG_2486 |
| post | after, behind | IMG_2456, IMG_2486 |
| prae | at the head of | IMG_2455, IMG_2486 |
| pro | for, on behalf of, in front of | IMG_2455, IMG_2486 |
| propter | on account of | IMG_2456, IMG_2486 |
| sine | without | IMG_2455, IMG_2486 |
| sub | under; to the foot of | IMG_2456, IMG_2486 |
| trans | across | IMG_2456, IMG_2486 |
| cur? | why? | IMG_2483 |
| quando? | when? | IMG_2486 |
| quid? | what? | IMG_2486 |
| quis? | who? | IMG_2486 |
| quomodo? | how? | IMG_2486 |
| quot? | how many? | IMG_2486 |
| ubi? | where? | IMG_2486 |
| cras | tomorrow | IMG_2483 |
| heri | yesterday | IMG_2485 |
| hodie | today | IMG_2485 |
| nunc | now | IMG_2485 |
| numquam | never | IMG_2485 |
| saepe | often | IMG_2486 |
| semper | always | IMG_2486 |

## Lower-Priority Source Material

| Material | Source images | Keep for |
| --- | --- | --- |
| Oral form drills | IMG_2454, IMG_2461, IMG_2462, IMG_2465, IMG_2466, IMG_2467, IMG_2469, IMG_2470, IMG_2482, IMG_2484 | Future grammar drills after the app can quiz forms by case, number, tense, voice, and person. |
| Full prayers | IMG_2475 | Optional recitation appendix only if it fits the site's audience. Verify from public-domain text instead of OCR. |
| Full Latin-English and English-Latin vocabulary index | IMG_2483-IMG_2490 | Bulk de-dupe pass against `word-banks.js`. Import slowly by grade cluster. |
| Sentence diagramming diagrams | IMG_2477-IMG_2480 | Future grammar explainer with custom diagrams, not a simple text card. |
