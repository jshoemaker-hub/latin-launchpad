// Original mottoes and abbreviations beyond the first phrase deck.
// Each item links to a headword already in the lesson lists.

function motto(id, latin, meaning, note, linkedWords, minGrade) {
  return {
    id,
    latin,
    meaning,
    note,
    linkedWords,
    minGrade,
    icon: 'M',
    added: true
  };
}

const MORE_LATIN_PHRASES = [
  motto('nb', 'N.B.', 'note well', 'An abbreviation of nota bene. Writers use it to mark a point the reader should not miss.', ['nomen'], 4),
  motto('id-est', 'i.e.', 'that is', 'An abbreviation of id est. It explains the words just written, rather than giving an example.', ['exemplum'], 5),
  motto('eg-abbr', 'e.g.', 'for example', 'An abbreviation of exempli gratia. It introduces an example, not a definition.', ['exemplum'], 5),
  motto('ante-meridiem', 'a.m.', 'before midday', 'An abbreviation of ante meridiem. It marks the hours from midnight to noon.', ['hora'], 4),
  motto('post-meridiem', 'p.m.', 'after midday', 'An abbreviation of post meridiem. It marks the hours from noon to midnight.', ['hora'], 4),
  motto('ps-abbr', 'P.S.', 'written after', 'An abbreviation of post scriptum. It adds a thought after the letter is already finished.', ['post'], 5),
  motto('et-alii', 'et al.', 'and others', 'An abbreviation of et alii. It stands for the rest of a list of people.', ['et'], 3),
  motto('versus-abbr', 'vs.', 'against', 'An abbreviation of versus. It sets two sides opposite each other.', ['versus'], 7),
  motto('quod-vide', 'q.v.', 'which see', 'An abbreviation of quod vide. It points the reader to another entry.', ['video'], 4),
  motto('ab-urbe', 'A.U.C.', 'from the founding of the city', 'An abbreviation of ab urbe condita. Romans counted years from the traditional founding of Rome.', ['urbs'], 7),
  motto('modus-operandi', 'm.o.', 'way of working', 'An abbreviation of modus operandi. It names the usual method someone uses.', ['via'], 5),
  motto('ad-abbr', 'A.D.', 'in the year of the Lord', 'An abbreviation of anno Domini. It marks years of the common era.', ['annus'], 3),
  motto('requiescat', 'R.I.P.', 'may he rest in peace', 'An abbreviation of requiescat in pace. It is a wish for the dead.', ['pax'], 6),
  motto('senatus-populus', 'S.P.Q.R.', 'the senate and the Roman people', 'The public abbreviation of senatus populusque Romanus. It stood on Roman standards and buildings.', ['senatus'], 7),
  motto('e-pluribus', 'E pluribus unum', 'out of many, one', 'The motto of the United States. Many states make one country.', ['urbs'], 6),
  motto('annuit-coeptis', 'Annuit coeptis', 'he has favored our beginnings', 'A motto on the Great Seal of the United States.', ['annus'], 6),
  motto('novus-ordo', 'Novus ordo seclorum', 'a new order of the ages', 'Another motto on the Great Seal, about a new age.', ['ordo'], 8),
  motto('semper-paratus', 'Semper paratus', 'always prepared', 'A motto of readiness. It is the Coast Guard motto, and a useful pair with semper fidelis.', ['paratus'], 5),
  motto('ad-astra-kansas', 'Ad astra per aspera', 'to the stars through difficulties', 'The motto of Kansas. The road is hard, and the goal is high.', ['stella'], 4),
  motto('justitia-omnibus', 'Justitia omnibus', 'justice for all', 'The motto of the District of Columbia.', ['lex'], 6),
  motto('salus-populi', 'Salus populi suprema lex esto', 'the welfare of the people shall be the highest law', 'The motto of Missouri. The people\'s safety outranks every other rule.', ['populus'], 7),
  motto('sic-semper', 'Sic semper tyrannis', 'thus always to tyrants', 'The motto of Virginia.', ['rex'], 6),
  motto('animis-opibusque', 'Animis opibusque parati', 'prepared in mind and resources', 'The other motto of South Carolina. It pairs courage with what a people can supply.', ['paratus'], 7),
  motto('montani', 'Montani semper liberi', 'mountaineers are always free', 'The motto of West Virginia.', ['liber'], 4),
  motto('ense-petit', 'Ense petit placidam sub libertate quietem', 'by the sword she seeks quiet peace under liberty', 'The motto of Massachusetts. Peace is the goal, and liberty is the condition.', ['pax'], 7),
  motto('mens-sana', 'Mens sana in corpore sano', 'a sound mind in a sound body', 'A line of Juvenal, often used as a school motto. Health of mind and body go together.', ['vita'], 6),
  motto('veritas-harvard', 'Veritas', 'truth', 'A one-word school motto, used by Harvard.', ['veritas'], 6),
  motto('lux-veritas', 'Lux et veritas', 'light and truth', 'A school motto, used by Yale.', ['veritas'], 6),
  motto('veritas-vos', 'Veritas vos liberabit', 'the truth will set you free', 'A school motto. Truth and freedom are paired.', ['veritas'], 6),
  motto('in-lumine', 'In lumine tuo videbimus lumen', 'in your light we shall see light', 'A school motto built on a line of scripture.', ['lumen'], 4),
  motto('habeas-corpus', 'Habeas corpus', 'you shall have the body', 'A legal writ. The court must bring the prisoner before a judge.', ['lex'], 5),
  motto('pro-bono', 'Pro bono', 'for the good', 'Legal work done for the public good, often without a fee. The full phrase is pro bono publico.', ['lex'], 5),
  motto('affidavit', 'Affidavit', 'he has sworn', 'A written statement made under oath.', ['lex'], 5),
  motto('caveat-emptor', 'Caveat emptor', 'let the buyer beware', 'A warning that the buyer must look carefully.', ['lex'], 5),
  motto('prima-facie', 'Prima facie', 'at first sight', 'How a case looks before the full story is heard.', ['video'], 4),
  motto('post-mortem', 'Post mortem', 'after death', 'An examination made after someone has died.', ['post'], 5),
  motto('tabula-rasa', 'Tabula rasa', 'a blank tablet', 'A mind pictured as a wax tablet with nothing written on it yet.', ['tabula'], 6),
  motto('persona-non', 'Persona non grata', 'a person who is not welcome', 'Someone a community or a country refuses to receive.', ['civis'], 8),
  motto('status-quo', 'Status quo', 'the state in which', 'Things as they already are.', ['ordo'], 8),
  motto('ad-hoc', 'Ad hoc', 'for this purpose', 'A group or a plan made for one particular job.', ['ad'], 5),
  motto('per-se', 'Per se', 'by itself', 'Considered on its own, not because of something else.', ['per'], 6),
  motto('vice-versa', 'Vice versa', 'the other way around', 'The order is turned about.', ['versus'], 7),
  motto('etc-abbr', 'etc.', 'and the rest', 'The abbreviation of et cetera. It means the list continues.', ['et'], 3),
  motto('circa-abbr', 'circa', 'about', 'Used with dates when the year is approximate. The abbreviation is c. or ca.', ['annus'], 3),
  motto('videlicet', 'viz.', 'namely', 'An abbreviation of videlicet. It names the item just promised.', ['video'], 4),
  motto('confer', 'cf.', 'compare', 'An abbreviation of confer. It invites the reader to compare another place.', ['video'], 4),
  motto('fl-abbr', 'fl.', 'he flourished', 'An abbreviation of floruit. It dates the years when a person was active.', ['annus'], 4),
  motto('in-memoriam', 'In memoriam', 'in memory', 'A heading for a remembrance of someone who has died.', ['memoria'], 6),
  motto('non-scholae', 'Non scholae, sed vitae', 'not for school, but for life', 'A school motto that turns around Seneca. He complained that people learn for school rather than for life.', ['schola'], 5),
  motto('arma-virumque', 'Arma virumque cano', 'I sing of arms and a man', 'The opening of Vergil\'s Aeneid, public domain. Epic begins with a hero and a war.', ['bellum'], 7)
];

MORE_LATIN_PHRASES.forEach((phrase) => LATIN_PHRASES.push(phrase));
