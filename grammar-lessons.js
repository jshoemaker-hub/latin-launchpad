// Reference-backed grammar lesson packs.
// Sources: D'Ooge, Latin for Beginners; Mueller, Latin 101: Learning a Classical Language.
const GRAMMAR_LESSONS = [
  {
    id: 'grade3-grammar-endings',
    grade: 3,
    kind: 'grammar',
    title: 'Grade 3 Grammar: Endings Change Meaning',
    description: "Notice how Latin changes word endings to show one, many, and a word's job.",
    sourceNote: "Reference: D'Ooge Lessons II-III on inflection, number, and word endings.",
    focus: ['inflection', 'singular and plural', 'word order clues'],
    words: [
      {
        latin: 'nauta',
        english: 'one sailor',
        emoji: '⛵',
        prompt: 'In the pair nauta / nautae, what does nauta mean?',
        choices: ['one sailor', 'many sailors', 'to the sailor', "the sailor's"],
        hint: 'D\'Ooge uses nauta and nautae to show how a Latin ending can change number.',
        explanation: 'nauta ends in -a, the first-declension singular pattern introduced in the reference.'
      },
      {
        latin: 'nautae',
        english: 'sailors',
        emoji: '⛵',
        prompt: 'When nauta changes to nautae, what changes in the meaning?',
        choices: ['sailors', 'one sailor', 'a road', 'a sailor carries'],
        hint: 'For a beginner, -ae is the first ending to notice for "more than one."',
        explanation: 'nautae can mean "sailors" when it is the plural subject form.'
      },
      {
        latin: 'puellae',
        english: 'girls',
        emoji: '👧',
        prompt: 'Which answer shows the simple plural meaning of puellae?',
        choices: ['girls', 'girl', 'to the boy', 'the road'],
        hint: 'puella is one girl; puellae can be more than one girl.',
        explanation: 'Changing -a to -ae can turn a first-declension noun from singular to plural.'
      },
      {
        latin: 'Domina filiam amat.',
        english: 'The lady loves her daughter.',
        emoji: '❤️',
        prompt: 'What does Domina filiam amat mean?',
        choices: [
          'The lady loves her daughter.',
          'The daughter loves the lady.',
          'The sailors love the forest.',
          'The lady gives water.'
        ],
        hint: 'The -a ending on domina points to the doer; -am on filiam points to the receiver.',
        explanation: 'Latin can use endings to show who acts and who receives the action.'
      },
      {
        latin: 'filiam',
        english: 'the daughter as the receiver of the action',
        emoji: '🎯',
        prompt: 'In Domina filiam amat, what does the ending -am help show?',
        choices: [
          'the daughter as the receiver of the action',
          'many daughters doing the action',
          'the lady owns a daughter',
          'the action happens tomorrow'
        ],
        hint: 'The reference introduces -am as the object ending for words like domina and filia.',
        explanation: 'The -am ending often marks a first-declension direct object.'
      }
    ]
  },
  {
    id: 'grade4-grammar-one-many',
    grade: 4,
    kind: 'grammar',
    title: 'Grade 4 Grammar: One or Many?',
    description: 'Practice the first noun patterns for singular and plural subjects.',
    sourceNote: "Reference: D'Ooge Lessons II and IX on first- and second-declension number endings.",
    focus: ['noun number', 'first declension', 'second declension'],
    words: [
      {
        latin: 'puella',
        english: 'one girl',
        emoji: '👧',
        prompt: 'What number does puella show?',
        choices: ['one girl', 'many girls', 'of the girls', 'to the girls'],
        hint: 'The -a ending is the first-declension singular subject form.',
        explanation: 'puella is singular; puellae can be plural.'
      },
      {
        latin: 'puellae',
        english: 'girls',
        emoji: '👧',
        prompt: 'What simple plural meaning can puellae have?',
        choices: ['girls', 'girl', 'boy', 'boys'],
        hint: 'For first-declension nouns, -ae can be the plural subject ending.',
        explanation: 'puellae can mean "girls" when the girls are the subject.'
      },
      {
        latin: 'servus',
        english: 'one servant',
        emoji: '🏛️',
        prompt: 'What number does servus show?',
        choices: ['one servant', 'many servants', 'of the servants', 'servants as objects'],
        hint: 'D\'Ooge lists -us as a common second-declension masculine singular ending.',
        explanation: 'servus is singular; servi is plural.'
      },
      {
        latin: 'servi',
        english: 'servants',
        emoji: '🏛️',
        prompt: 'What does servi mean as a plural subject?',
        choices: ['servants', 'one servant', 'to the servant', 'the servant as object'],
        hint: 'The second-declension masculine plural subject ending is -i.',
        explanation: 'servi is the plural subject form for a second-declension masculine noun.'
      },
      {
        latin: 'dona',
        english: 'gifts',
        emoji: '🎁',
        prompt: 'What does dona mean when it comes from donum?',
        choices: ['gifts', 'one gift', 'of a gift', 'to a gift'],
        hint: 'Neuter second-declension plurals often end in -a.',
        explanation: 'donum is one gift; dona is gifts.'
      }
    ]
  },
  {
    id: 'grade4-grammar-amo',
    grade: 4,
    kind: 'grammar',
    title: 'Grade 4 Grammar: Present Action Endings',
    description: 'Learn how the endings of amo tell who is doing the action.',
    sourceNote: "Reference: D'Ooge Lesson XIX and Latin 101 Lecture 2 on present active personal endings.",
    focus: ['present tense', 'verb endings', 'person and number'],
    words: [
      {
        latin: 'amo',
        english: 'I love',
        emoji: '❤️',
        prompt: 'What does amo mean?',
        choices: ['I love', 'you love', 'we love', 'they love'],
        hint: 'The -o ending often marks "I" in the present active.',
        explanation: 'amo is first person singular: I love.'
      },
      {
        latin: 'amas',
        english: 'you love',
        emoji: '❤️',
        prompt: 'What does amas mean?',
        choices: ['you love', 'I love', 'he loves', 'we love'],
        hint: 'The -s ending points to "you" singular.',
        explanation: 'amas is second person singular: you love.'
      },
      {
        latin: 'amat',
        english: 'he/she loves',
        emoji: '❤️',
        prompt: 'What does amat mean?',
        choices: ['he/she loves', 'I love', 'you all love', 'they love'],
        hint: 'The -t ending points to he, she, or it.',
        explanation: 'amat is third person singular: he, she, or it loves.'
      },
      {
        latin: 'amamus',
        english: 'we love',
        emoji: '❤️',
        prompt: 'What does amamus mean?',
        choices: ['we love', 'I love', 'you love', 'they love'],
        hint: 'The -mus ending points to "we."',
        explanation: 'amamus is first person plural: we love.'
      },
      {
        latin: 'amatis',
        english: 'you all love',
        emoji: '❤️',
        prompt: 'What does amatis mean?',
        choices: ['you all love', 'you love', 'we love', 'he loves'],
        hint: 'The -tis ending points to "you" plural.',
        explanation: 'amatis is second person plural: you all love.'
      },
      {
        latin: 'amant',
        english: 'they love',
        emoji: '❤️',
        prompt: 'What does amant mean?',
        choices: ['they love', 'I love', 'you all love', 'he loves'],
        hint: 'The -nt ending points to "they."',
        explanation: 'amant is third person plural: they love.'
      }
    ]
  },
  {
    id: 'grade5-grammar-subject-object',
    grade: 5,
    kind: 'grammar',
    title: 'Grade 5 Grammar: Subject or Object?',
    description: 'Use endings to tell who acts and who receives the action.',
    sourceNote: "Reference: D'Ooge Lesson III on nominative subjects and accusative direct objects.",
    focus: ['nominative', 'accusative', 'Latin word order'],
    words: [
      {
        latin: 'domina',
        english: 'the subject',
        emoji: '👤',
        context: 'Domina filiam amat.',
        prompt: 'What job does domina have in this sentence?',
        choices: ['the subject', 'the direct object', 'the possessor', 'the indirect object'],
        hint: 'The subject is the doer of the verb.',
        explanation: 'domina ends in -a and is the one doing the loving.'
      },
      {
        latin: 'filiam',
        english: 'the direct object',
        emoji: '🎯',
        context: 'Domina filiam amat.',
        prompt: 'What job does filiam have in this sentence?',
        choices: ['the direct object', 'the subject', 'the possessor', 'the verb'],
        hint: 'The direct object receives the action.',
        explanation: 'filiam ends in -am and receives the action of amat.'
      },
      {
        latin: 'Filiam domina amat.',
        english: 'The lady loves her daughter.',
        emoji: '🔁',
        prompt: 'Even with the word order changed, what does Filiam domina amat mean?',
        choices: [
          'The lady loves her daughter.',
          'The daughter loves the lady.',
          'The daughter is a lady.',
          'The lady gives a prize.'
        ],
        hint: 'D\'Ooge emphasizes that endings, not word order, show the essential meaning.',
        explanation: 'domina is still the subject and filiam is still the direct object.'
      },
      {
        latin: 'dominam',
        english: 'the lady as direct object',
        emoji: '🎯',
        context: 'Filia dominam amat.',
        prompt: 'What does dominam show in this sentence?',
        choices: [
          'the lady as direct object',
          'the lady as subject',
          'many ladies',
          'to or for the lady'
        ],
        hint: 'The -am ending is the clue.',
        explanation: 'dominam is the direct object, so the daughter loves the lady.'
      },
      {
        latin: 'amat',
        english: 'he/she loves',
        emoji: '❤️',
        context: 'Filia dominam amat.',
        prompt: 'What does the verb amat tell us?',
        choices: ['he/she loves', 'they love', 'we love', 'to love'],
        hint: 'The -t ending is third person singular.',
        explanation: 'amat means he, she, or it loves; the subject tells which one.'
      }
    ]
  },
  {
    id: 'grade5-grammar-sum',
    grade: 5,
    kind: 'grammar',
    title: 'Grade 5 Grammar: Sum, Es, Est',
    description: 'Practice the present forms of sum, the verb "to be."',
    sourceNote: "Reference: D'Ooge Lesson XVIII and Latin 101 Lecture 4 on the irregular verb sum.",
    focus: ['irregular verb', 'present tense', 'linking sentences'],
    words: [
      {
        latin: 'sum',
        english: 'I am',
        emoji: '🧍',
        prompt: 'What does sum mean?',
        choices: ['I am', 'you are', 'he is', 'they are'],
        hint: 'sum is first person singular.',
        explanation: 'sum means I am.'
      },
      {
        latin: 'es',
        english: 'you are',
        emoji: '🧍',
        prompt: 'What does es mean?',
        choices: ['you are', 'I am', 'we are', 'they are'],
        hint: 'es is second person singular.',
        explanation: 'es means you are.'
      },
      {
        latin: 'est',
        english: 'he/she/it is',
        emoji: '🧍',
        prompt: 'What does est mean?',
        choices: ['he/she/it is', 'I am', 'you all are', 'they are'],
        hint: 'est is third person singular.',
        explanation: 'est means he, she, or it is.'
      },
      {
        latin: 'sumus',
        english: 'we are',
        emoji: '👥',
        prompt: 'What does sumus mean?',
        choices: ['we are', 'I am', 'you are', 'he is'],
        hint: 'sumus is first person plural.',
        explanation: 'sumus means we are.'
      },
      {
        latin: 'estis',
        english: 'you all are',
        emoji: '👥',
        prompt: 'What does estis mean?',
        choices: ['you all are', 'you are', 'we are', 'they are'],
        hint: 'estis is second person plural.',
        explanation: 'estis means you all are.'
      },
      {
        latin: 'sunt',
        english: 'they are',
        emoji: '👥',
        prompt: 'What does sunt mean?',
        choices: ['they are', 'he is', 'you are', 'I am'],
        hint: 'sunt is third person plural.',
        explanation: 'sunt means they are.'
      }
    ]
  },
  {
    id: 'grade6-grammar-case-jobs',
    grade: 6,
    kind: 'grammar',
    title: 'Grade 6 Grammar: The Five Case Jobs',
    description: 'Match each Latin case to the job it usually performs in a sentence.',
    sourceNote: "Reference: D'Ooge Lessons III-VII on nominative, genitive, dative, accusative, and ablative.",
    focus: ['case system', 'sentence jobs', 'translation cues'],
    words: [
      {
        latin: 'nominative',
        english: 'subject',
        emoji: '👤',
        prompt: 'Which job usually belongs to the nominative case?',
        choices: ['subject', 'possession', 'direct object', 'with or by'],
        hint: 'The nominative names the doer or topic of the sentence.',
        explanation: 'The nominative is the case of the subject.'
      },
      {
        latin: 'genitive',
        english: 'possession',
        emoji: '🔗',
        prompt: 'Which job usually belongs to the genitive case?',
        choices: ['possession', 'subject', 'direct object', 'command'],
        hint: 'Think "of the" or English apostrophe-s.',
        explanation: 'The genitive often means "of" and shows possession.'
      },
      {
        latin: 'dative',
        english: 'to or for',
        emoji: '🎁',
        prompt: 'Which cue best fits the dative case?',
        choices: ['to or for', 'by or with', 'who or what as subject', 'direct object'],
        hint: 'The dative often marks the indirect object.',
        explanation: 'The dative expresses "to" or "for," especially with indirect objects.'
      },
      {
        latin: 'accusative',
        english: 'direct object',
        emoji: '🎯',
        prompt: 'Which job usually belongs to the accusative case?',
        choices: ['direct object', 'possession', 'subject', 'place where'],
        hint: 'The direct object receives the action directly.',
        explanation: 'The accusative is the case of the direct object.'
      },
      {
        latin: 'ablative',
        english: 'by, with, from, in, or at',
        emoji: '🧭',
        prompt: 'Which set of English cues often fits the ablative case?',
        choices: ['by, with, from, in, or at', 'who, whose, whom', 'I, you, he', 'more, most'],
        hint: 'D\'Ooge introduces the ablative for separation, means, association, place, and time.',
        explanation: 'The ablative can express ideas translated by by, with, from, in, or at.'
      }
    ]
  },
  {
    id: 'grade6-grammar-declensions',
    grade: 6,
    kind: 'grammar',
    title: 'Grade 6 Grammar: Declension Patterns',
    description: 'Compare first- and second-declension endings from the reference tables.',
    sourceNote: "Reference: D'Ooge Lessons VII and IX on first and second declensions.",
    focus: ['first declension', 'second declension', 'noun endings'],
    words: [
      {
        latin: '-a',
        english: 'first-declension nominative singular',
        emoji: '1',
        prompt: 'In domina, what does the ending -a show?',
        choices: [
          'first-declension nominative singular',
          'second-declension plural',
          'first-declension accusative singular',
          'third-declension dative'
        ],
        hint: 'domina is the model first-declension word in D\'Ooge.',
        explanation: 'domina uses -a for the singular subject form.'
      },
      {
        latin: '-am',
        english: 'first-declension accusative singular',
        emoji: '1',
        prompt: 'In dominam, what does -am show?',
        choices: [
          'first-declension accusative singular',
          'first-declension nominative singular',
          'second-declension genitive plural',
          'dative plural'
        ],
        hint: 'The -am ending marks a direct object in the first-declension singular.',
        explanation: 'dominam is the direct-object form of domina.'
      },
      {
        latin: '-i',
        english: 'second-declension genitive singular or masculine nominative plural',
        emoji: '2',
        prompt: 'What can the ending -i show in second-declension nouns?',
        choices: [
          'second-declension genitive singular or masculine nominative plural',
          'first-declension accusative singular only',
          'ablative singular only',
          'future tense only'
        ],
        hint: 'D\'Ooge notes that the second declension is identified by genitive singular -i.',
        explanation: '-i can appear in domini, either "of the master" or "masters" depending on context.'
      },
      {
        latin: '-orum',
        english: 'of the ___s',
        emoji: '2',
        prompt: 'What does dominorum mean?',
        choices: ['of the masters', 'to the master', 'the master as object', 'one master'],
        hint: 'The second-declension genitive plural ending is -orum.',
        explanation: 'dominorum means of the masters.'
      },
      {
        latin: 'dona',
        english: 'neuter plural subject or object',
        emoji: '🎁',
        prompt: 'What does dona show in the second-declension neuter pattern?',
        choices: [
          'neuter plural subject or object',
          'masculine singular subject',
          'feminine singular object',
          'verb in the present tense'
        ],
        hint: 'Neuter nominative and accusative plural forms match and end in -a.',
        explanation: 'dona can be either subject or direct object; context tells which job it has.'
      }
    ]
  },
  {
    id: 'grade6-grammar-adjectives',
    grade: 6,
    kind: 'grammar',
    title: 'Grade 6 Grammar: Adjectives Agree',
    description: 'Choose adjective forms that match their nouns in gender, number, and case.',
    sourceNote: "Reference: D'Ooge Lesson XI on first- and second-declension adjectives.",
    focus: ['adjective agreement', 'gender', 'case and number'],
    words: [
      {
        latin: 'bona puella',
        english: 'good girl',
        emoji: '✨',
        prompt: 'What does bona puella mean?',
        choices: ['good girl', 'good boy', 'good gift', 'many good girls'],
        hint: 'bona is feminine singular to match puella.',
        explanation: 'The adjective bona agrees with puella in gender, number, and case.'
      },
      {
        latin: 'bonus nauta',
        english: 'good sailor',
        emoji: '⛵',
        prompt: 'Why is bonus used with nauta?',
        choices: [
          'nauta is masculine in meaning',
          'nauta is neuter plural',
          'bonus is always feminine',
          'adjectives never agree'
        ],
        hint: 'D\'Ooge points out that nauta is masculine even though it belongs to the first declension.',
        explanation: 'Agreement follows gender, number, and case, not just matching endings.'
      },
      {
        latin: 'bonum donum',
        english: 'good gift',
        emoji: '🎁',
        prompt: 'What does bonum donum mean?',
        choices: ['good gift', 'good girl', 'good sailor', 'good roads'],
        hint: 'donum is neuter, so the adjective uses bonum.',
        explanation: 'bonum agrees with the neuter noun donum.'
      },
      {
        latin: 'adjective agreement',
        english: 'gender, number, and case',
        emoji: '🧩',
        prompt: 'A Latin adjective agrees with its noun in which three things?',
        choices: ['gender, number, and case', 'person, tense, and voice', 'time, place, and speaker', 'sound, accent, and spelling'],
        hint: 'This is the big rule behind bonus, bona, bonum.',
        explanation: 'Adjectives agree with nouns in gender, number, and case.'
      },
      {
        latin: 'puellae bonae',
        english: 'good girls',
        emoji: '👧',
        prompt: 'What can puellae bonae mean when it is a plural subject?',
        choices: ['good girls', 'good boy', 'good gift', 'to the good master'],
        hint: 'Both words use the feminine plural subject ending.',
        explanation: 'The noun and adjective match as feminine plural nominative forms.'
      }
    ]
  },
  {
    id: 'grade7-grammar-third-declension',
    grade: 7,
    kind: 'grammar',
    title: 'Grade 7 Grammar: Third-Declension Clues',
    description: 'Use the genitive to find the stem, then attach the right case ending.',
    sourceNote: 'Reference: Latin 101 Lecture 5 on third-declension nouns such as miles and lux.',
    focus: ['third declension', 'genitive stem', 'case endings'],
    words: [
      {
        latin: 'miles, militis',
        english: 'soldier',
        emoji: '🛡️',
        prompt: 'What does miles, militis mean?',
        choices: ['soldier', 'light', 'king', 'city'],
        hint: 'Latin 101 uses miles, militis as a model third-declension noun.',
        explanation: 'miles means soldier; militis is the genitive form.'
      },
      {
        latin: 'milit-',
        english: 'the stem from the genitive militis',
        emoji: '🔎',
        prompt: 'Where do we get the stem milit-?',
        choices: [
          'the stem from the genitive militis',
          'the plural of miles',
          'the accusative ending -em',
          'the verb ending -nt'
        ],
        hint: 'Remove the genitive ending -is from militis.',
        explanation: 'The genitive form helps reveal the stem used for other cases.'
      },
      {
        latin: 'militi',
        english: 'to or for the soldier',
        emoji: '🎁',
        prompt: 'What does militi mean?',
        choices: ['to or for the soldier', 'the soldier as subject', 'the soldier as direct object', 'of the soldier'],
        hint: 'Third-declension dative singular uses -i.',
        explanation: 'militi is dative singular: to or for the soldier.'
      },
      {
        latin: 'militem',
        english: 'the soldier as direct object',
        emoji: '🎯',
        prompt: 'What does militem mean?',
        choices: ['the soldier as direct object', 'of the soldier', 'to the soldier', 'soldiers as subject'],
        hint: 'Third-declension accusative singular uses -em.',
        explanation: 'militem is accusative singular, the direct-object form.'
      },
      {
        latin: 'lux, lucis',
        english: 'light',
        emoji: '💡',
        prompt: 'What does lux, lucis mean?',
        choices: ['light', 'soldier', 'truth', 'body'],
        hint: 'Latin 101 uses lux, lucis to show how the stem can change.',
        explanation: 'lux means light; lucis gives the stem luc-.'
      },
      {
        latin: 'lucibus',
        english: 'to/for or by/with/from the lights',
        emoji: '💡',
        prompt: 'What can lucibus mean?',
        choices: [
          'to/for or by/with/from the lights',
          'one light as subject',
          'of one light',
          'one light as direct object'
        ],
        hint: 'The dative and ablative plural endings can look the same.',
        explanation: 'lucibus can be dative plural or ablative plural; context decides.'
      }
    ]
  },
  {
    id: 'grade7-grammar-pronouns',
    grade: 7,
    kind: 'grammar',
    title: 'Grade 7 Grammar: Pronouns in Place',
    description: 'Recognize personal, demonstrative, and relative pronouns in context.',
    sourceNote: "Reference: D'Ooge Lessons XVII, XXXVIII, and XLIX; Latin 101 Lecture 20.",
    focus: ['personal pronouns', 'demonstratives', 'relative pronouns'],
    words: [
      {
        latin: 'ego',
        english: 'I',
        emoji: '🧍',
        prompt: 'What does ego mean?',
        choices: ['I', 'you', 'he', 'they'],
        hint: 'ego is the first-person singular pronoun.',
        explanation: 'ego means I.'
      },
      {
        latin: 'tu',
        english: 'you',
        emoji: '🧍',
        prompt: 'What does tu mean?',
        choices: ['you', 'I', 'we', 'she'],
        hint: 'tu is singular.',
        explanation: 'tu means you, when speaking to one person.'
      },
      {
        latin: 'is, ea, id',
        english: 'he, she, it',
        emoji: '👉',
        prompt: 'What personal-pronoun meaning can is, ea, id have?',
        choices: ['he, she, it', 'I, we', 'you, you all', 'who, which'],
        hint: 'D\'Ooge notes that this demonstrative is often used for he, she, and it.',
        explanation: 'is, ea, id can mean he, she, it, or that.'
      },
      {
        latin: 'hic / ille',
        english: 'this / that',
        emoji: '👉',
        prompt: 'Which answer best matches hic / ille?',
        choices: ['this / that', 'I / you', 'who / whose', 'good / better'],
        hint: 'hic points nearby; ille points farther away.',
        explanation: 'hic means this; ille means that.'
      },
      {
        latin: 'qui, quae, quod',
        english: 'who, which, or that',
        emoji: '🔗',
        prompt: 'What kind of pronoun is qui, quae, quod?',
        choices: ['who, which, or that', 'I, you, he', 'this, that', 'better, best'],
        hint: 'Relative pronouns connect a clause to a noun before it.',
        explanation: 'qui, quae, quod is the relative pronoun: who, which, or that.'
      },
      {
        latin: 'relative agreement',
        english: 'gender and number from its antecedent',
        emoji: '🧩',
        prompt: 'A relative pronoun gets its gender and number from what?',
        choices: [
          'gender and number from its antecedent',
          'tense and voice from the verb',
          'sound and accent from the first word',
          'person and number from the speaker'
        ],
        hint: 'The antecedent is the noun the pronoun points back to.',
        explanation: 'A relative pronoun agrees with its antecedent in gender and number; its case comes from its own clause.'
      }
    ]
  },
  {
    id: 'grade8-grammar-perfect-passive',
    grade: 8,
    kind: 'grammar',
    title: 'Grade 8 Grammar: Perfect and Passive Signals',
    description: 'Spot completed-action endings and passive voice clues.',
    sourceNote: 'Reference: D\'Ooge Lessons XXVII, XXXI, XXXV and Latin 101 Lectures 21 and 25.',
    focus: ['perfect active', 'passive voice', 'principal parts'],
    words: [
      {
        latin: 'duxi',
        english: 'I led',
        emoji: '🛤️',
        prompt: 'What does duxi mean?',
        choices: ['I led', 'you lead', 'they lead', 'to lead'],
        hint: 'The perfect active ending -i is first person singular.',
        explanation: 'duxi uses the perfect stem dux- and means I led.'
      },
      {
        latin: 'duxit',
        english: 'he/she led',
        emoji: '🛤️',
        prompt: 'What does duxit mean?',
        choices: ['he/she led', 'I led', 'we led', 'they lead'],
        hint: 'The perfect active ending -it is third person singular.',
        explanation: 'duxit means he, she, or it led.'
      },
      {
        latin: 'duxerunt',
        english: 'they led',
        emoji: '🛤️',
        prompt: 'What does duxerunt mean?',
        choices: ['they led', 'he led', 'we lead', 'to lead'],
        hint: 'The perfect active ending -erunt marks third person plural.',
        explanation: 'duxerunt means they led.'
      },
      {
        latin: 'passive voice',
        english: 'the subject receives the action',
        emoji: '↩️',
        prompt: 'What does passive voice mean?',
        choices: [
          'the subject receives the action',
          'the subject performs the action',
          'the verb has no subject',
          'the noun shows possession'
        ],
        hint: 'D\'Ooge contrasts active "the subject acts" with passive "the subject is acted upon."',
        explanation: 'In passive voice, the subject receives the action.'
      },
      {
        latin: 'amatus sum',
        english: 'I was loved / I have been loved',
        emoji: '❤️',
        prompt: 'What does amatus sum mean for a masculine speaker?',
        choices: [
          'I was loved / I have been loved',
          'I love',
          'they loved',
          'you will love'
        ],
        hint: 'Perfect passive forms combine a participle with sum.',
        explanation: 'amatus sum combines the perfect passive participle with sum.'
      }
    ]
  },
  {
    id: 'grade8-grammar-participles-comparison',
    grade: 8,
    kind: 'grammar',
    title: 'Grade 8 Grammar: Participles and Comparison',
    description: 'Review verbal adjectives and the Latin forms for more and most.',
    sourceNote: "Reference: D'Ooge Lessons XXXV, LIII, LXVI and Latin 101 Lecture 22.",
    focus: ['participles', 'comparatives', 'superlatives'],
    words: [
      {
        latin: 'participle',
        english: 'part verb and part adjective',
        emoji: '🧩',
        prompt: 'What is a participle?',
        choices: [
          'part verb and part adjective',
          'only a noun case',
          'only a command form',
          'a word that never changes'
        ],
        hint: 'Both D\'Ooge and Latin 101 describe participles as verbal adjectives.',
        explanation: 'A participle keeps some verb qualities but works like an adjective.'
      },
      {
        latin: 'amans',
        english: 'loving',
        emoji: '❤️',
        prompt: 'What does amans mean?',
        choices: ['loving', 'loved', 'about to love', 'must be loved'],
        hint: 'Present active participles often translate with -ing.',
        explanation: 'amans is the present active participle: loving.'
      },
      {
        latin: 'amatus',
        english: 'loved / having been loved',
        emoji: '❤️',
        prompt: 'What does amatus mean?',
        choices: ['loved / having been loved', 'loving', 'about to love', 'more loving'],
        hint: 'The perfect passive participle comes from the fourth principal part.',
        explanation: 'amatus is a perfect passive participle.'
      },
      {
        latin: 'amaturus',
        english: 'about to love',
        emoji: '❤️',
        prompt: 'What does amaturus mean?',
        choices: ['about to love', 'loving', 'loved', 'must be loved'],
        hint: 'The future active participle often means "about to."',
        explanation: 'amaturus is a future active participle: about to love.'
      },
      {
        latin: 'clarior',
        english: 'brighter / more famous',
        emoji: '✨',
        prompt: 'What degree is clarior?',
        choices: ['brighter / more famous', 'brightest / most famous', 'bright', 'not bright'],
        hint: 'The comparative degree often means -er or more.',
        explanation: 'clarior is comparative.'
      },
      {
        latin: 'clarissimus',
        english: 'brightest / most famous',
        emoji: '🌟',
        prompt: 'What degree is clarissimus?',
        choices: ['brightest / most famous', 'brighter / more famous', 'bright', 'less bright'],
        hint: 'The superlative degree often means -est or most.',
        explanation: 'clarissimus is superlative.'
      }
    ]
  }
];
