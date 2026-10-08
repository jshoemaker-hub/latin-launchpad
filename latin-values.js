// Original Roman-values cards for the Roman world section.
// Short Latin examples are public-domain lines, except the gravitas sentence, which was written for this course.

function valueCard(id, title, latinTitle, summary, connection, linkedWords, mark, example) {
  const card = cultureCard('values', id, title, latinTitle, summary, connection, linkedWords, 7, mark);
  card.example = example;
  return card;
}

const VALUE_CARDS = [
  valueCard(
    'value-pietas',
    'Pietas',
    'Pietas',
    'Pietas is duty to family, the gods, and the city. English "pious" is only part of the idea. Aeneas is called pius because he carries his father from Troy and keeps faith with the gods.',
    'When a poet calls someone pius, the word praises duty, not only a feeling about religion.',
    ['pater', 'deus', 'filius'],
    'P',
    { latin: 'Sum pius Aeneas.', english: 'I am Aeneas, a man of duty.', source: 'Vergil, Aeneid 1.378' }
  ),
  valueCard(
    'value-gravitas',
    'Gravitas',
    'Gravitas',
    'Gravitas is steady seriousness. A person with gravitas does not rush, boast, or treat a hard choice as a joke. The idea is calm weight, not gloom.',
    'Roman stories praise leaders who stay quiet and steady when a crowd is loud.',
    ['vir', 'pater'],
    'G',
    { latin: 'Vir gravis pauca dicit.', english: 'A serious man says little.', source: 'Original classroom sentence' }
  ),
  valueCard(
    'value-virtus',
    'Virtus',
    'Virtus',
    'Virtus is excellence and courage. The word is related to vir, a man, but the example is a father teaching a child. Later writers also praise virtus in a mother and in her sons.',
    'Learn courage from someone who has done the hard work. That is the classroom sense of the line.',
    ['puer', 'labor', 'vir'],
    'V',
    { latin: 'Disce, puer, virtutem ex me verumque laborem.', english: 'Learn courage from me, child, and true work.', source: 'Vergil, Aeneid 12.435' }
  ),
  valueCard(
    'value-fides',
    'Fides',
    'Fides',
    'Fides is keeping your word. A promise, a treaty, and a friendship all rest on it. Cicero says good faith is the foundation of justice.',
    'Romans also gave the name Fides to a goddess. Breaking fides was a public shame.',
    ['amicus', 'lex'],
    'F',
    { latin: 'Fundamentum autem est iustitiae fides.', english: 'The foundation of justice is good faith.', source: 'Cicero, De Officiis 1.23' }
  ),
  valueCard(
    'value-dignitas',
    'Dignitas',
    'Dignitas',
    'Dignitas is respect a person earns by service and character. It is not bossiness, and it is not something you can demand. Cicero joins a quiet life with that earned respect.',
    'A student earns dignitas by doing the work well, not by telling other people to be quiet.',
    ['vir', 'vita'],
    'D',
    { latin: 'Cum dignitate otium.', english: 'A quiet life with earned respect.', source: 'Cicero, Pro Sestio 98' }
  ),
  valueCard(
    'value-auctoritas',
    'Auctoritas',
    'Auctoritas',
    'Auctoritas is influence that other people grant. It is not an extra legal power you can seize. Augustus wrote that he stood above others in influence, while his colleagues held the same offices.',
    'A teacher has auctoritas when the class trusts the teacher. A louder voice is not the same thing.',
    ['lex', 'vir'],
    'A',
    { latin: 'Auctoritate omnibus praestiti.', english: 'In influence I stood above everyone.', source: 'Augustus, Res Gestae 34' }
  ),
  valueCard(
    'value-mos-maiorum',
    'Mos maiorum',
    'Mos maiorum',
    'Mos maiorum means the customs of the ancestors. Romans treated old ways of family, worship, and public life as a guide. The customs are many. They are not one new law.',
    'Ennius says the Roman state stands on those old customs and on its people.',
    ['pater', 'lex'],
    'M',
    { latin: 'Moribus antiquis res stat Romana virisque.', english: 'The Roman state stands on ancient customs and on its people.', source: 'Ennius, quoted by Cicero' }
  ),
  valueCard(
    'value-humanitas',
    'Humanitas',
    'Humanitas',
    'Humanitas is kindness and learning that treat another person as human. The sample line comes from a comedy. Later Romans used it as a motto. Terence was not teaching a philosophy in that scene.',
    'A reader shows humanitas by taking another person\'s trouble seriously and by wanting to learn.',
    ['amicus', 'vita'],
    'H',
    { latin: 'Homo sum: humani nil a me alienum puto.', english: 'I am human: I think nothing human is foreign to me.', source: 'Terence, Heauton Timorumenos 77' }
  ),
  valueCard(
    'value-stoic',
    'Stoic thought',
    'Stoici',
    'Stoic thinkers, named for the Stoa in Athens, taught that a person can stay steady when life is hard. They valued courage, fairness, self-control, and wisdom. Seneca\'s line is about effort: the road upward is not an easy one.',
    'Marcus Aurelius, a later emperor, wrote in this tradition. This card only asks for the idea of steadiness.',
    ['via', 'labor'],
    'S',
    { latin: 'Non est ad astra mollis e terris via.', english: 'The road from the earth to the stars is not a soft one.', source: 'Seneca, Hercules Furens 437' }
  ),
  valueCard(
    'value-epicurean',
    'Epicurean thought',
    'Epicurei',
    'Epicurean thought, named for Epicurus, says a good life is simple, friendly, and free from fear. It is not a license to grab every pleasure. Lucretius, a Roman poet, explained the idea in a long poem.',
    'Living simply with a calm mind is the classroom version. Pleasure here means the absence of pain and worry.',
    ['vita', 'amicus'],
    'E',
    { latin: 'Divitiae grandes homini sunt vivere parce aequo animo.', english: 'A person\'s great wealth is to live simply, with a calm mind.', source: 'Lucretius, De Rerum Natura 5.1118–1119' }
  )
];

VALUE_CARDS.forEach((card) => {
  CULTURE_UNIT_CARDS.push(card);
  LATIN_CULTURE_CARDS.push(card);
});
