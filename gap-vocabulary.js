// Common function words and everyday nouns that were missing from the year lists.
// Glosses are original. Macrons follow Lewis & Short quantities.
// These words are not taken from a textbook word list.

const GAP_VOCABULARY_WORDS = [
  { latin: 'ecce', english: 'look!', emoji: '👀', grade: 3, partOfSpeech: 'interjection', dictionaryEntry: 'ecce' },
  { latin: 'salve', english: 'hello!', emoji: '👋', grade: 3, partOfSpeech: 'interjection', dictionaryEntry: 'salvē' },
  { latin: 'neque', english: 'and not / nor', emoji: '🚫', grade: 3, partOfSpeech: 'conjunction', dictionaryEntry: 'neque' },
  { latin: 'statim', english: 'immediately', emoji: '⚡', grade: 3, partOfSpeech: 'adverb', dictionaryEntry: 'statim' },
  { latin: 'olim', english: 'once / long ago', emoji: '🕰️', grade: 3, partOfSpeech: 'adverb', dictionaryEntry: 'ōlim' },
  { latin: 'atrium', english: 'main hall of a house', emoji: '🏛️', grade: 3, partOfSpeech: 'noun', dictionaryEntry: 'ātrium, -ī, n.', gender: 'n.' },
  { latin: 'tunica', english: 'tunic', emoji: '👕', grade: 3, partOfSpeech: 'noun', dictionaryEntry: 'tunica, -ae, f.', gender: 'f.' },
  { latin: 'stola', english: 'a long dress', emoji: '👗', grade: 3, partOfSpeech: 'noun', dictionaryEntry: 'stola, -ae, f.', gender: 'f.' },
  { latin: 'stilus', english: 'pen / stylus', emoji: '🖊️', grade: 3, partOfSpeech: 'noun', dictionaryEntry: 'stilus, -ī, m.', gender: 'm.' },

  { latin: 'postquam', english: 'after', emoji: '⏭️', grade: 4, partOfSpeech: 'conjunction', dictionaryEntry: 'postquam' },
  { latin: 'necesse', english: 'necessary', emoji: '✅', grade: 4, partOfSpeech: 'adjective', dictionaryEntry: 'necesse' },
  { latin: 'triclinium', english: 'dining room', emoji: '🍽️', grade: 4, partOfSpeech: 'noun', dictionaryEntry: 'trīclīnium, -ī, n.', gender: 'n.' },
  { latin: 'tablinum', english: 'study', emoji: '📚', grade: 4, partOfSpeech: 'noun', dictionaryEntry: 'tablīnum, -ī, n.', gender: 'n.' },
  { latin: 'ancilla', english: 'maid / enslaved woman', emoji: '🧹', grade: 4, partOfSpeech: 'noun', dictionaryEntry: 'ancilla, -ae, f.', gender: 'f.' },
  { latin: 'thermae', english: 'public baths', emoji: '🛁', grade: 4, partOfSpeech: 'noun', dictionaryEntry: 'thermae, -ārum, f. pl.', gender: 'f.' },
  { latin: 'gladiator', english: 'gladiator', emoji: '🛡️', grade: 4, partOfSpeech: 'noun', dictionaryEntry: 'gladiātor, gladiātōris, m.', gender: 'm.' },
  { latin: 'tabernarius', english: 'shopkeeper', emoji: '🏪', grade: 4, partOfSpeech: 'noun', dictionaryEntry: 'tabernārius, -ī, m.', gender: 'm.' },

  { latin: 'ergo', english: 'therefore', emoji: '➡️', grade: 5, partOfSpeech: 'adverb', dictionaryEntry: 'ergō' },
  { latin: 'modo', english: 'only / just now', emoji: '🕐', grade: 5, partOfSpeech: 'adverb', dictionaryEntry: 'modo' },
  { latin: 'quidem', english: 'indeed', emoji: '💬', grade: 5, partOfSpeech: 'adverb', dictionaryEntry: 'quidem' },
  { latin: 'hinc', english: 'from here', emoji: '📍', grade: 5, partOfSpeech: 'adverb', dictionaryEntry: 'hinc' },
  { latin: 'tot', english: 'so many', emoji: '🔢', grade: 5, partOfSpeech: 'adjective', dictionaryEntry: 'tot' },
  { latin: 'haud', english: 'not', emoji: '🙅', grade: 5, partOfSpeech: 'adverb', dictionaryEntry: 'haud' },
  { latin: 'vel', english: 'or', emoji: '🔀', grade: 5, partOfSpeech: 'conjunction', dictionaryEntry: 'vel' },
  { latin: 'sive', english: 'or if / whether', emoji: '❓', grade: 5, partOfSpeech: 'conjunction', dictionaryEntry: 'sīve' },
  { latin: 'ceterus', english: 'the rest', emoji: '📚', grade: 5, partOfSpeech: 'adjective', dictionaryEntry: 'cēterus, -a, -um' },
  { latin: 'alter', english: 'the other of two', emoji: '2️⃣', grade: 5, partOfSpeech: 'adjective', dictionaryEntry: 'alter, altera, alterum' },
  { latin: 'alius', english: 'another', emoji: '🔄', grade: 5, partOfSpeech: 'adjective', dictionaryEntry: 'alius, alia, aliud' },
  { latin: 'statua', english: 'statue', emoji: '🗿', grade: 5, partOfSpeech: 'noun', dictionaryEntry: 'statua, -ae, f.', gender: 'f.' },
  { latin: 'nympha', english: 'nymph', emoji: '🌊', grade: 5, partOfSpeech: 'noun', dictionaryEntry: 'nympha, -ae, f.', gender: 'f.' },
  { latin: 'castra', english: 'camp', emoji: '⛺', grade: 5, partOfSpeech: 'noun', dictionaryEntry: 'castra, -ōrum, n. pl.', gender: 'n.' },
  { latin: 'omen', english: 'omen', emoji: '🔮', grade: 5, partOfSpeech: 'noun', dictionaryEntry: 'ōmen, ōminis, n.', gender: 'n.' },
  { latin: 'rus', english: 'the country', emoji: '🌾', grade: 5, partOfSpeech: 'noun', dictionaryEntry: 'rūs, rūris, n.', gender: 'n.' },
  { latin: 'domi', english: 'at home', emoji: '🏠', grade: 5, partOfSpeech: 'adverb', dictionaryEntry: 'domī' },

  { latin: 'licet', english: 'it is allowed', emoji: '🟢', grade: 6, partOfSpeech: 'verb', dictionaryEntry: 'licet, licēre, licuit', principalParts: 'licet, licēre, licuit' },
  { latin: 'viginti', english: 'twenty', emoji: '2️⃣', grade: 6, partOfSpeech: 'adjective', dictionaryEntry: 'vīgintī' },
  { latin: 'duodeviginti', english: 'eighteen', emoji: '🔢', grade: 6, partOfSpeech: 'adjective', dictionaryEntry: 'duodēvīgintī' },
  { latin: 'nullus', english: 'not any / none', emoji: '0️⃣', grade: 6, partOfSpeech: 'adjective', dictionaryEntry: 'nūllus, -a, -um' },
  { latin: 'posteaquam', english: 'after', emoji: '⏭️', grade: 6, partOfSpeech: 'conjunction', dictionaryEntry: 'posteāquam' },
  { latin: 'adeo', english: 'so / to such a degree', emoji: '📈', grade: 6, partOfSpeech: 'adverb', dictionaryEntry: 'adeō' },
  { latin: 'sicut', english: 'just as', emoji: '🟰', grade: 6, partOfSpeech: 'adverb', dictionaryEntry: 'sīcut' },
  { latin: 'uterque', english: 'each of two', emoji: '✌️', grade: 6, partOfSpeech: 'adjective', dictionaryEntry: 'uterque, utraque, utrumque' },
  { latin: 'plebs', english: 'the common people', emoji: '👥', grade: 6, partOfSpeech: 'noun', dictionaryEntry: 'plēbs, plēbis, f.', gender: 'f.' },
  { latin: 'dictator', english: 'dictator', emoji: '🏛️', grade: 6, partOfSpeech: 'noun', dictionaryEntry: 'dictātor, dictātōris, m.', gender: 'm.' },
  { latin: 'oratio', english: 'speech', emoji: '🎤', grade: 6, partOfSpeech: 'noun', dictionaryEntry: 'ōrātiō, ōrātiōnis, f.', gender: 'f.' },
  { latin: 'exclamo', english: 'shout out', emoji: '📣', grade: 6, partOfSpeech: 'verb', dictionaryEntry: 'exclāmō, exclāmāre, exclāmāvī, exclāmātum', principalParts: 'exclāmō, exclāmāre, exclāmāvī, exclāmātum' },
  { latin: 'advenio', english: 'arrive', emoji: '🚶', grade: 6, partOfSpeech: 'verb', dictionaryEntry: 'adveniō, advenīre, advēnī, adventum', principalParts: 'adveniō, advenīre, advēnī, adventum' },
  { latin: 'discedo', english: 'go away', emoji: '🚪', grade: 6, partOfSpeech: 'verb', dictionaryEntry: 'discēdō, discēdere, discessī, discessum', principalParts: 'discēdō, discēdere, discessī, discessum' },
  { latin: 'emo', english: 'buy', emoji: '🪙', grade: 6, partOfSpeech: 'verb', dictionaryEntry: 'emō, emere, ēmī, ēmptum', principalParts: 'emō, emere, ēmī, ēmptum' },
  { latin: 'cado', english: 'fall', emoji: '🍂', grade: 6, partOfSpeech: 'verb', dictionaryEntry: 'cadō, cadere, cecidī, cāsum', principalParts: 'cadō, cadere, cecidī, cāsum' },
  { latin: 'amitto', english: 'lose', emoji: '😢', grade: 6, partOfSpeech: 'verb', dictionaryEntry: 'āmittō, āmittere, āmīsī, āmissum', principalParts: 'āmittō, āmittere, āmīsī, āmissum' },

  { latin: 'intellego', english: 'understand', emoji: '💡', grade: 7, partOfSpeech: 'verb', dictionaryEntry: 'intellegō, intellegere, intellēxī, intellēctum', principalParts: 'intellegō, intellegere, intellēxī, intellēctum' },
  { latin: 'constituo', english: 'decide', emoji: '🎯', grade: 7, partOfSpeech: 'verb', dictionaryEntry: 'constituō, constituere, constituī, constitūtum', principalParts: 'constituō, constituere, constituī, constitūtum' },
  { latin: 'miror', english: 'wonder at', emoji: '😲', grade: 7, partOfSpeech: 'verb', dictionaryEntry: 'mīror, mīrārī, mīrātus sum', principalParts: 'mīror, mīrārī, mīrātus sum' },
  { latin: 'respicio', english: 'look back', emoji: '👀', grade: 7, partOfSpeech: 'verb', dictionaryEntry: 'respiciō, respicere, respexī, respectum', principalParts: 'respiciō, respicere, respexī, respectum' },
  { latin: 'depono', english: 'put down', emoji: '📥', grade: 7, partOfSpeech: 'verb', dictionaryEntry: 'dēpōnō, dēpōnere, dēposuī, dēpositum', principalParts: 'dēpōnō, dēpōnere, dēposuī, dēpositum' },
  { latin: 'tollo', english: 'lift / remove', emoji: '⬆️', grade: 7, partOfSpeech: 'verb', dictionaryEntry: 'tollō, tollere, sustulī, sublātum', principalParts: 'tollō, tollere, sustulī, sublātum' },
  { latin: 'interficio', english: 'kill', emoji: '⚔️', grade: 7, partOfSpeech: 'verb', dictionaryEntry: 'interficiō, interficere, interfēcī, interfectum', principalParts: 'interficiō, interficere, interfēcī, interfectum' },
  { latin: 'conspicio', english: 'catch sight of', emoji: '👁️', grade: 7, partOfSpeech: 'verb', dictionaryEntry: 'conspiciō, conspicere, conspexī, conspectum', principalParts: 'conspiciō, conspicere, conspexī, conspectum' },
  { latin: 'inquam', english: 'I say', emoji: '💬', grade: 7, partOfSpeech: 'verb', dictionaryEntry: 'inquam, inquis, inquit', principalParts: 'inquam, inquis, inquit' },
  { latin: 'aio', english: 'I say', emoji: '🗨️', grade: 7, partOfSpeech: 'verb', dictionaryEntry: 'aiō, ais, ait', principalParts: 'aiō, ais, ait' },

  { latin: 'ut', english: 'so that / as', emoji: '🎯', grade: 8, partOfSpeech: 'conjunction', dictionaryEntry: 'ut' },
  { latin: 'ne', english: 'so that not / lest', emoji: '🛑', grade: 8, partOfSpeech: 'conjunction', dictionaryEntry: 'nē' },
  { latin: 'quidam', english: 'a certain', emoji: '👤', grade: 8, partOfSpeech: 'adjective', dictionaryEntry: 'quīdam, quaedam, quoddam' },
  { latin: 'iste', english: 'that (of yours)', emoji: '👉', grade: 8, partOfSpeech: 'adjective', dictionaryEntry: 'iste, ista, istud' },
  { latin: 'oportet', english: 'it is right / one ought', emoji: '⚖️', grade: 8, partOfSpeech: 'verb', dictionaryEntry: 'oportet, oportēre, oportuit', principalParts: 'oportet, oportēre, oportuit' },
  { latin: 'utinam', english: 'if only / would that', emoji: '🌟', grade: 8, partOfSpeech: 'adverb', dictionaryEntry: 'utinam' },
  { latin: 'proficiscor', english: 'set out', emoji: '🧳', grade: 8, partOfSpeech: 'verb', dictionaryEntry: 'proficīscor, proficīscī, profectus sum', principalParts: 'proficīscor, proficīscī, profectus sum' },
  { latin: 'amplector', english: 'embrace', emoji: '🤗', grade: 8, partOfSpeech: 'verb', dictionaryEntry: 'amplector, amplectī, amplexus sum', principalParts: 'amplector, amplectī, amplexus sum' },
  { latin: 'numen', english: 'divine power', emoji: '✨', grade: 8, partOfSpeech: 'noun', dictionaryEntry: 'nūmen, nūminis, n.', gender: 'n.' },
  { latin: 'moenia', english: 'city walls', emoji: '🧱', grade: 8, partOfSpeech: 'noun', dictionaryEntry: 'moenia, moenium, n. pl.', gender: 'n.' },
  { latin: 'puppis', english: 'stern of a ship', emoji: '⛵', grade: 8, partOfSpeech: 'noun', dictionaryEntry: 'puppis, puppis, f.', gender: 'f.' },
  { latin: 'superus', english: 'upper / the gods above', emoji: '☁️', grade: 8, partOfSpeech: 'adjective', dictionaryEntry: 'superus, -a, -um' },
  { latin: 'divus', english: 'divine', emoji: '☀️', grade: 8, partOfSpeech: 'adjective', dictionaryEntry: 'dīvus, -a, -um' },
  { latin: 'avus', english: 'grandfather', emoji: '👴', grade: 8, partOfSpeech: 'noun', dictionaryEntry: 'avus, -ī, m.', gender: 'm.' },
  { latin: 'coniunx', english: 'spouse', emoji: '💍', grade: 8, partOfSpeech: 'noun', dictionaryEntry: 'coniūnx, coniugis, c.', gender: 'c.' },
  { latin: 'proles', english: 'offspring', emoji: '🌱', grade: 8, partOfSpeech: 'noun', dictionaryEntry: 'prōlēs, prōlis, f.', gender: 'f.' },
  { latin: 'quisquis', english: 'whoever', emoji: '❓', grade: 8, partOfSpeech: 'pronoun', dictionaryEntry: 'quisquis, quidquid' },
  { latin: 'quicumque', english: 'whoever / whatever', emoji: '❓', grade: 8, partOfSpeech: 'pronoun', dictionaryEntry: 'quīcumque, quaecumque, quodcumque' }
];

const GAP_FORM_RECORDS = {};
GAP_VOCABULARY_WORDS.forEach((word) => {
  GAP_FORM_RECORDS[word.latin] = {
    headword: word.latin,
    dictionaryEntry: word.dictionaryEntry,
    gender: word.gender || '',
    principalParts: word.principalParts || '',
    partOfSpeech: word.partOfSpeech,
    declension: '',
    formBooks: [],
    macronSource: 'Lewis & Short quantities',
    reliable: true,
    endingHint: '',
    chant: null
  };
});

function gapVocabularyKey(latin) {
  return String(latin || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/j/g, 'i')
    .split(/[^a-z]+/)
    .filter(Boolean);
}

function gapVocabularyBlocks(latin) {
  const keys = gapVocabularyKey(latin);
  const raw = String(latin || '');
  if (keys.length <= 1 || raw.includes('/')) return keys;
  return [];
}

function appendGapVocabulary() {
  if (typeof GRADE_WORDS === 'undefined' || !Array.isArray(GAP_VOCABULARY_WORDS)) return;
  const seen = new Set();
  Object.values(GRADE_WORDS).flat().forEach((word) => {
    gapVocabularyBlocks(word.latin).forEach((key) => seen.add(key));
  });
  GAP_VOCABULARY_WORDS.forEach((word) => {
    const keys = gapVocabularyKey(word.latin);
    if (!keys.length || keys.some((key) => seen.has(key))) return;
    const grade = String(word.grade);
    if (!Array.isArray(GRADE_WORDS[grade])) return;
    GRADE_WORDS[grade].push({
      latin: word.latin,
      english: word.english,
      emoji: word.emoji || '',
      gapSet: true
    });
    keys.forEach((key) => seen.add(key));
  });
}

appendGapVocabulary();
