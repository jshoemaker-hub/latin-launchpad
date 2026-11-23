// Parent-facing landing pages. Texts for the prayers are traditional and public domain.
// Vocabulary samples come from this course's own word lists.

let SITE = 'https://latinlaunchpad.com';
let LEVELS = [];

function buildLandingPages(helpers) {
  const {
    esc,
    summarize,
    data,
    wordsForGrade,
    firstLessonHref,
    flashcardHref
  } = helpers;
  SITE = helpers.SITE || SITE;
  LEVELS = helpers.LEVELS;

  const pages = [
    startHerePage(esc, summarize),
    gradePage(esc, summarize, data, firstLessonHref, flashcardHref),
    vocabularyHubPage(esc, summarize, data, wordsForGrade),
    grammarHubPage(esc, summarize, data),
    prayersPage(esc, summarize),
    firstHundredPage(esc, summarize, data),
    tenMinutesPage(esc, summarize)
  ];
  pages.forEach((page) => {
    page.underTopics = false;
    page.group = 'Guides';
    page.educationalLevel = page.educationalLevel || 'Grades 3-8';
  });
  return pages;
}

function startHerePage(esc, summarize) {
  const questions = [
    {
      q: 'Which year should a new student start?',
      a: 'Start at Year 1 if the student has not already studied Latin, even in grade 6, 7, or 8. Year 4A, Year 4B, and Year 4C assume the earlier years. A student who has finished a year of Latin elsewhere can match the grade on the Latin by grade page and then drop back if the first lesson feels too fast.'
    },
    {
      q: 'Is Latin Launchpad a full Latin curriculum?',
      a: 'It is a free practice course: vocabulary, grammar, mottoes, Roman culture, stories, quizzes, and printables for grades 3–8. Many classical schools and homeschools use it beside a teacher. It does not replace a parent or a classroom teacher.'
    },
    {
      q: 'Does a child need an account?',
      a: 'No. Guest mode saves progress in the browser on that device. An email account is optional for a learner age 13 or older, or for an adult. Students under 13 use guest mode.'
    }
  ];
  return {
    relPath: 'start-here.html',
    title: 'Start Latin Here',
    linkText: 'Start Latin here',
    kicker: 'For parents',
    schemaType: 'Course',
    description: summarize('Start Latin here: a parent guide to what Latin is, why classical schools teach it, and which Latin Launchpad year to open for grades 3–8.'),
    faqSchema: faqSchema(questions),
    crumbs: [{ name: 'Start Latin here', item: `${SITE}/start-here.html`, href: '/start-here.html' }],
    body: `
      <p class="trust-lead">Latin Launchpad is free Latin practice for students in grades 3–8. This page is for the adult who is about to open it: what the language is, why a classical school bothers with it, and which year to click first.</p>
      <h2>What Latin is</h2>
      <p>Latin is the language of ancient Rome. It is not a code made of English words with funny endings. For about a thousand years it was the language people used for Scripture, worship, law, and schoolbooks across Europe, and a great deal of English is built out of it. A student who learns <span lang="la">aqua</span> has a head start on aquarium, aquatic, and aqueduct.</p>
      <p>Classical Christian schools teach it for that reason, and for another one. Latin sentences show how a language can mark the job of each word with an ending. Students who can see that pattern read English more carefully, and they are getting ready for Virgil, Caesar, the Vulgate, and the old prayers of the church. Latin Launchpad is one course on <a href="https://schoollaunch.org/">School Launch</a>. The Latin course page there is <a href="https://schoollaunch.org/courses/latin/">School Launch Latin</a>.</p>
      <h2>How to use this site</h2>
      <ol>
        <li>Open the site and choose a year. Guest mode is enough. Students under 13 should stay in guest mode.</li>
        <li>Do one lesson. Each lesson is about ten words, a little grammar or a story, and a few practice rounds. Ten focused minutes is a real session.</li>
        <li>The next day, use <a href="/flashcards.html">flashcards</a> on those words before starting anything new.</li>
        <li>When a lesson has printables, they are a one-page summary, a crossword, and a word find built from that lesson. <a href="/topics/printables.html">How printing works</a>.</li>
      </ol>
      <p>The same lessons are also written out as ordinary pages, so you can see the course before anyone starts. Begin with <a href="/latin-by-grade.html">Latin by grade</a>, the <a href="/latin-vocabulary.html">vocabulary lists</a>, or <a href="/latin-grammar.html">grammar basics</a>.</p>
      <h2>Which year to start</h2>
      <p>Year 1 is grade 3, Year 2 is grade 4, Year 3 is grade 5, Year 4A is grade 6, Year 4B is grade 7, and Year 4C is grade 8. Those grades are a map, not a rule about age. A new student starts at Year 1. The words are this course's own list, taught in this course's order.</p>
      <ul>
        <li><a href="/latin-by-grade.html#grade-3">Year 1 · Grade 3</a> — sounds, first words, and the idea that endings change.</li>
        <li><a href="/latin-by-grade.html#grade-4">Year 2 · Grade 4</a> — singular and plural, and the verb <span lang="la">amo</span>.</li>
        <li><a href="/latin-by-grade.html#grade-5">Year 3 · Grade 5</a> — subjects, objects, and longer sentences.</li>
        <li><a href="/latin-by-grade.html#grade-6">Year 4A · Grade 6</a> — review, then the case jobs used in reading.</li>
        <li><a href="/latin-by-grade.html#grade-7">Year 4B · Grade 7</a> — more verb families and third-declension nouns.</li>
        <li><a href="/latin-by-grade.html#grade-8">Year 4C · Grade 8</a> — the forms a student needs before a real paragraph.</li>
      </ul>
      <p>A weekly pattern that fits a homeschool morning or a school warm-up is on <a href="/latin-in-10-minutes.html">Latin in 10 minutes a day</a>. Families who want something to print and keep can start from the <a href="/first-100-latin-words.html">first 100 Latin words</a> or the <a href="/latin-prayers.html">prayers and hymns</a>.</p>
      <h2>When reading comes next</h2>
      <p>This course stops at the door of the authors. When a student is ready to read, the <a href="https://classicslaunch.org/">Classics Library</a> has the texts: <a href="https://classicslaunch.org/authors/virgil/">Virgil</a> and the <a href="https://classicslaunch.org/works/the-aeneid/">Aeneid</a>, <a href="https://classicslaunch.org/authors/julius%20caesar/">Julius Caesar</a>, <a href="https://classicslaunch.org/authors/ovid/">Ovid</a> and the <a href="https://classicslaunch.org/works/metamorphoses/">Metamorphoses</a>, and <a href="https://classicslaunch.org/authors/marcus%20tullius%20cicero/">Cicero</a>.</p>
      ${faqHtml(esc, questions)}
      <p class="topic-practice"><a href="/#/y/1/l/grade3-1">Open the first Year 1 lesson</a> · <a href="/parents-teachers.html">Notes for parents and teachers</a></p>
    `
  };
}

function gradePage(esc, summarize, data, firstLessonHref, flashcardHref) {
  const sections = LEVELS.map((level) => {
    const objectives = data.LEARNING_OBJECTIVES?.[level.grade];
    const goals = (objectives?.goals || []).map((goal) => `<li>${esc(goal)}</li>`).join('');
    return `
      <h2 id="grade-${level.grade}">${esc(level.gradeName)} · ${esc(level.label)}</h2>
      <p>${esc(objectives?.intro || `${level.label} is ${level.gradeName}.`)}</p>
      ${goals ? `<ul>${goals}</ul>` : ''}
      <p class="topic-practice"><a href="/topics/${level.slug}.html">${esc(level.label)} vocabulary list</a> · <a href="${firstLessonHref(level.grade, data.GRADE_WORDS)}">First ${esc(level.label)} lesson</a> · <a href="${flashcardHref(level)}">Flashcards</a> · <a href="https://schoollaunch.org/courses/latin/grade-${level.grade}/">School Launch Latin, ${esc(level.gradeName)}</a></p>
    `;
  }).join('');
  return {
    relPath: 'latin-by-grade.html',
    title: 'Latin by Grade',
    linkText: 'Latin by grade',
    kicker: 'Grades 3–8',
    schemaType: 'Course',
    description: summarize('Latin by grade for classical schools and homeschools: grades 3–8 mapped to Latin Launchpad Years 1, 2, 3, 4A, 4B, and 4C, with a lesson to open.'),
    crumbs: [{ name: 'Latin by grade', item: `${SITE}/latin-by-grade.html`, href: '/latin-by-grade.html' }],
    body: `
      <p class="trust-lead">The grades below are the map this course uses. Year 1 belongs with grade 3, and the path runs through grade 8. A student who is new to Latin should still start at Year 1, whatever the grade on the report card. Moving ahead is for a student who can already read the earlier lessons without guessing.</p>
      <p>Each year below links to that year's vocabulary list, the first lesson in the practice app, and flashcards. The School Launch links go to the matching Latin course page for that grade. Latin Launchpad is the practice site; <a href="https://schoollaunch.org/courses/latin/">School Launch Latin</a> is the course it belongs to.</p>
      ${sections}
      <h2>A short way to choose</h2>
      <ul>
        <li>No Latin yet: <a href="#grade-3">Year 1</a>, any age in this range.</li>
        <li>Comfortable with Year 1 words and ready for <span lang="la">amo</span>: <a href="#grade-4">Year 2</a>.</li>
        <li>Can find the subject and the object: <a href="#grade-5">Year 3</a>.</li>
        <li>Reviewing cases and ready for longer stories: <a href="#grade-6">Year 4A</a>, then <a href="#grade-7">4B</a> and <a href="#grade-8">4C</a>.</li>
      </ul>
      <p>The <a href="/start-here.html">start-here guide</a> explains the course in more detail. The <a href="/latin-in-10-minutes.html">10-minute plan</a> is a week that works at any of these years.</p>
    `
  };
}

function vocabularyHubPage(esc, summarize, data, wordsForGrade) {
  const samples = LEVELS.map((level) => {
    const words = wordsForGrade(data.GRADE_WORDS, level.grade).filter((word) => !word.coreSet && !word.gapSet && !word.paceSet);
    const sample = words.slice(0, 6).map((word) => `<span lang="la">${esc(word.latin)}</span> (${esc(word.english)})`).join(', ');
    return `<li><a href="/topics/${level.slug}.html">${esc(level.label)} · ${esc(level.gradeName)}</a> — ${words.length} lesson words, starting ${sample}.</li>`;
  }).join('');
  return {
    relPath: 'latin-vocabulary.html',
    title: 'Latin Vocabulary Lists',
    linkText: 'Latin vocabulary lists',
    kicker: 'Vocabulary',
    learningResourceType: 'reading',
    description: summarize('Latin vocabulary lists by grade from Latin Launchpad\'s own course, Years 1 through 4C, with English meanings and links into the lessons.'),
    crumbs: [{ name: 'Latin vocabulary lists', item: `${SITE}/latin-vocabulary.html`, href: '/latin-vocabulary.html' }],
    body: `
      <p class="trust-lead">These are Latin Launchpad's own vocabulary lists for grades 3–8. They are not a copy of another textbook's chapter list. Year 1 is the place a new student starts. Each year page has the full list, the English this course teaches, and a link into the lesson.</p>
      <p>A lesson holds about ten words. The year page also separates core words (high-frequency Latin added after the main lessons) from the lesson words. English glosses on this site were written for this course. The order of the added core words follows the <a href="https://dcc.dickinson.edu/vocab/core-vocabulary">Dickinson College Commentaries Latin Core Vocabulary</a>.</p>
      <h2>Lists by year</h2>
      <ul>${samples}</ul>
      <p>The <a href="/first-100-latin-words.html">first 100 Latin words</a> are the opening of the Year 1 list, grouped and ready to print. After that, the <a href="/topics/vocabulary.html">full vocabulary index</a> includes Year 4 reading words and the everyday words used in the stories.</p>
      <p>Practice does not stay on the list. <a href="/flashcards.html">Flashcards</a> run for 5, 10, or 15 minutes, and each lesson in the app asks the student to recall the English and, later, the Latin.</p>
      <p class="topic-practice"><a href="/topics/vocabulary-year-1.html">Open the Year 1 list</a> · <a href="/#/y/1">Practice Year 1</a></p>
    `
  };
}

function grammarHubPage(esc, summarize, data) {
  const featured = [
    ['grade3-grammar-latin-sounds', 'Year 1: how Latin sounds'],
    ['grade3-grammar-endings', 'Year 1: why endings change'],
    ['grade4-grammar-one-many', 'Year 2: one and many'],
    ['grade4-grammar-amo', 'Year 2: the verb amo'],
    ['grade5-grammar-subject-object', 'Year 3: subject and object'],
    ['grade6-grammar-case-jobs', 'Year 4A: what the cases do'],
    ['grade7-grammar-third-declension', 'Year 4B: third-declension nouns'],
    ['grade8-grammar-participles-comparison', 'Year 4C: participles and comparison']
  ];
  const known = new Set([...(data.GRAMMAR_LESSONS || []), ...(data.SYNTAX_GRAMMAR_LESSONS || [])].map((lesson) => lesson.id));
  const links = featured
    .filter(([id]) => known.has(id))
    .map(([id, label]) => `<li><a href="/topics/grammar/${id}.html">${esc(label)}</a></li>`)
    .join('');
  if (!links) throw new Error('Grammar basics page could not find the featured lessons');
  return {
    relPath: 'latin-grammar.html',
    title: 'Latin Grammar Basics',
    linkText: 'Latin grammar basics',
    kicker: 'Grammar',
    learningResourceType: 'lesson',
    description: summarize('Latin grammar basics for grades 3–8: what endings do, how a verb changes, and the Latin Launchpad lessons that practice each idea.'),
    crumbs: [{ name: 'Latin grammar basics', item: `${SITE}/latin-grammar.html`, href: '/latin-grammar.html' }],
    body: `
      <p class="trust-lead">Latin grammar, at the start, is mostly this: the ending on a word tells you the word's job. English usually does that with word order. Latin can say the same sentence with the words in several orders, because <span lang="la">puella</span> and <span lang="la">puellam</span> are not doing the same work.</p>
      <h2>Three ideas that carry the early years</h2>
      <p><strong>Nouns change to show their job.</strong> In Year 1 a student notices that the ending moves. By Year 4 the course has names for those jobs: the subject, the possessor, the indirect object, the direct object, and the forms used with prepositions. You do not need the names on day one.</p>
      <p><strong>Verbs change to show who is doing the action.</strong> <span lang="la">Amo</span> is "I love." <span lang="la">Amas</span> is "you love." <span lang="la">Amat</span> is "he or she loves." Year 2 practices that pattern. Later years add the other conjugations and the tenses.</p>
      <p><strong>Adjectives agree with their nouns.</strong> A word like <span lang="la">magnus</span> changes so it matches the noun it describes. That is why a vocabulary list gives one form, and a lesson asks students to recognize the others.</p>
      <p>None of this has to be memorized from a chart before the first practice. The lessons introduce one change, then ask for it back. The notes on the topic pages are this course's own explanations.</p>
      <h2>Lessons to open</h2>
      <ul>${links}</ul>
      <p>The <a href="/topics/grammar/index.html">full grammar index</a> lists every grammar lesson from Year 1 through Year 4C. Word building, which is the English that grows from these words, is on the <a href="/topics/derivatives.html">derivatives page</a>.</p>
      <p class="topic-practice"><a href="/topics/grammar/grade3-grammar-endings.html">Practice the Year 1 endings lesson</a> · <a href="/start-here.html">Start Latin here</a></p>
    `
  };
}

function prayersPage(esc, summarize) {
  const questions = [
    {
      q: 'Which pronunciation should we use?',
      a: 'Either classical or church pronunciation is fine if you stay with one of them. Classical is the usual choice in a Latin class: c is always k, v sounds like w, and ae is a diphthong. Church pronunciation is the usual choice when a choir sings these prayers: c before e or i sounds like ch, and v sounds like English v.'
    },
    {
      q: 'Are these the traditional texts?',
      a: 'Yes. The Pater Noster, Gloria Patri, Ave Maria, and Gloria in excelsis are the traditional public-domain Latin texts. The English beside them is a close reading. Thomas Ken\'s doxology is included in English because it was written in English in 1674 and does not have one traditional Latin original.'
    }
  ];
  return {
    relPath: 'latin-prayers.html',
    title: 'Latin Prayers and Hymns',
    linkText: 'Latin prayers and hymns',
    kicker: 'Prayers',
    learningResourceType: 'reading',
    bodyClass: 'print-document',
    description: summarize('Latin prayers and hymns for students: the Pater Noster, Gloria Patri, Ave Maria, and the doxology, with English, pronunciation, and vocabulary help.'),
    faqSchema: faqSchema(questions),
    crumbs: [{ name: 'Latin prayers and hymns', item: `${SITE}/latin-prayers.html`, href: '/latin-prayers.html' }],
    body: `
      <p class="trust-lead">These are the prayers most classical Christian schools meet first. The Latin is the traditional public-domain text. The English is there so a parent can tell a student what they are saying. Read one prayer aloud for a week before adding the next. This is not a word-list chapter, and it is not a substitute for the lessons.</p>
      <h2>Pronunciation</h2>
      <p>Pick one system and keep it. Mixing them in the same prayer is what makes a class unsure.</p>
      <ul>
        <li><strong>Classical Latin</strong>, the classroom habit: every <span lang="la">c</span> is "k" (<span lang="la">caelis</span> starts with a k). <span lang="la">g</span> is always hard. <span lang="la">v</span> sounds like English "w" (<span lang="la">voluntas</span> starts with a w). <span lang="la">ae</span> is the diphthong in "eye." Vowels are pure: <span lang="la">a</span> as in father, <span lang="la">e</span> as in they, <span lang="la">i</span> as in machine, <span lang="la">o</span> as in note, <span lang="la">u</span> as in food.</li>
        <li><strong>Church Latin</strong>, the singing habit: <span lang="la">v</span> sounds like English "v." <span lang="la">ae</span> and <span lang="la">e</span> both sound like "ay." <span lang="la">c</span> before <span lang="la">e</span> or <span lang="la">i</span> sounds like "ch," so <span lang="la">excelsis</span> starts with "ech."</li>
        <li><strong>Stress.</strong> On a two-syllable word, stress the first syllable (<span lang="la">Pater</span>, <span lang="la">nomen</span>). On a longer word, stress the next-to-last syllable if it is long, otherwise the one before that. For a first reading, keep every syllable and do not drop the endings.</li>
      </ul>
      <h2>Pater Noster</h2>
      <p>The Lord's Prayer. The Latin says "debts," <span lang="la">debita</span>. Many English versions say "trespasses." Both are the same prayer.</p>
      <blockquote>
        <p lang="la">Pater noster, qui es in caelis,<br>sanctificetur nomen tuum.<br>Adveniat regnum tuum.<br>Fiat voluntas tua, sicut in caelo et in terra.<br>Panem nostrum quotidianum da nobis hodie,<br>et dimitte nobis debita nostra,<br>sicut et nos dimittimus debitoribus nostris.<br>Et ne nos inducas in tentationem,<br>sed libera nos a malo.<br>Amen.</p>
        <p>Our Father, who art in heaven, hallowed be thy name. Thy kingdom come. Thy will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our debts, as we forgive our debtors. And lead us not into temptation, but deliver us from evil. Amen.</p>
      </blockquote>
      ${gloss(esc, [
        ['pater', 'father'],
        ['noster', 'our'],
        ['caelis', 'in heaven (from caelum, heaven)'],
        ['nomen', 'name'],
        ['regnum', 'kingdom'],
        ['voluntas', 'will'],
        ['terra', 'earth'],
        ['panem', 'bread'],
        ['hodie', 'today'],
        ['debita', 'debts'],
        ['malum', 'evil']
      ])}
      <h2>Gloria Patri</h2>
      <p>The lesser doxology. It is the short hymn of praise to the Trinity, often sung at the end of a psalm.</p>
      <blockquote>
        <p lang="la">Gloria Patri, et Filio, et Spiritui Sancto.<br>Sicut erat in principio, et nunc, et semper,<br>et in saecula saeculorum. Amen.</p>
        <p>Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.</p>
      </blockquote>
      ${gloss(esc, [
        ['gloria', 'glory'],
        ['Patri', 'to the Father'],
        ['Filio', 'to the Son'],
        ['Spiritui Sancto', 'to the Holy Spirit'],
        ['principio', 'the beginning'],
        ['semper', 'always'],
        ['saecula saeculorum', 'unto ages of ages']
      ])}
      <h2>Ave Maria</h2>
      <p>The first sentences are the greetings in Luke 1. The rest is the later prayer asking Mary to pray for us.</p>
      <blockquote>
        <p lang="la">Ave Maria, gratia plena, Dominus tecum.<br>Benedicta tu in mulieribus,<br>et benedictus fructus ventris tui, Iesus.<br>Sancta Maria, Mater Dei,<br>ora pro nobis peccatoribus,<br>nunc et in hora mortis nostrae. Amen.</p>
        <p>Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.</p>
      </blockquote>
      ${gloss(esc, [
        ['ave', 'hail'],
        ['gratia', 'grace'],
        ['plena', 'full'],
        ['Dominus', 'Lord'],
        ['benedicta', 'blessed'],
        ['fructus', 'fruit'],
        ['ora', 'pray'],
        ['peccatoribus', 'for sinners'],
        ['hora', 'hour'],
        ['mortis', 'of death']
      ])}
      <h2>Doxology</h2>
      <p>A doxology is a short hymn of praise. The Gloria Patri above is the lesser doxology. The greater doxology is the Gloria in excelsis, the hymn that begins "Glory to God in the highest."</p>
      <h3>Gloria in excelsis</h3>
      <blockquote>
        <p lang="la">Gloria in excelsis Deo.<br>Et in terra pax hominibus bonae voluntatis.<br>Laudamus te. Benedicimus te.<br>Adoramus te. Glorificamus te.<br>Gratias agimus tibi propter magnam gloriam tuam.<br>Domine Deus, Rex caelestis, Deus Pater omnipotens.<br>Domine Fili unigenite, Iesu Christe.<br>Domine Deus, Agnus Dei, Filius Patris.<br>Qui tollis peccata mundi, miserere nobis.<br>Qui tollis peccata mundi, suscipe deprecationem nostram.<br>Qui sedes ad dexteram Patris, miserere nobis.<br>Quoniam tu solus Sanctus. Tu solus Dominus.<br>Tu solus Altissimus, Iesu Christe.<br>Cum Sancto Spiritu, in gloria Dei Patris. Amen.</p>
        <p>Glory to God in the highest, and on earth peace to people of good will. We praise you. We bless you. We adore you. We glorify you. We give you thanks for your great glory. Lord God, heavenly King, God the Father almighty. Lord Jesus Christ, only begotten Son. Lord God, Lamb of God, Son of the Father. You take away the sins of the world, have mercy on us. You take away the sins of the world, receive our prayer. You are seated at the right hand of the Father, have mercy on us. For you alone are the Holy One. You alone are the Lord. You alone are the Most High, Jesus Christ, with the Holy Spirit, in the glory of God the Father. Amen.</p>
      </blockquote>
      ${gloss(esc, [
        ['excelsis', 'the highest'],
        ['pax', 'peace'],
        ['laudamus', 'we praise'],
        ['Deus', 'God'],
        ['rex', 'king'],
        ['agnus', 'lamb'],
        ['peccata', 'sins'],
        ['mundi', 'of the world'],
        ['miserere', 'have mercy']
      ])}
      <h3>The doxology sung in English</h3>
      <p>Thomas Ken wrote this stanza in 1674 for the students of Winchester College, as the last verse of his morning and evening hymns. It is the doxology many classical Christian schools sing to the tune Old Hundredth. It was written in English, so it is printed here in English only.</p>
      <blockquote>
        <p>Praise God, from whom all blessings flow;<br>Praise Him, all creatures here below;<br>Praise Him above, ye heavenly host;<br>Praise Father, Son, and Holy Ghost. Amen.</p>
      </blockquote>
      ${faqHtml(esc, questions)}
      <p>Students who are still learning first-year words can keep going in <a href="/topics/vocabulary-year-1.html">Year 1 vocabulary</a> and come back to these prayers as a weekly reading. More sayings from the course are on the <a href="/topics/mottoes/index.html">mottoes page</a>.</p>
    `
  };
}

function firstHundredPage(esc, summarize, data) {
  const grouped = firstHundredGroups(data.GRADE_WORDS);
  const flat = grouped.flatMap((group) => group.words);
  if (flat.length !== 100) throw new Error(`Expected 100 words, found ${flat.length}`);
  const seen = new Set();
  flat.forEach((word) => {
    const key = `${word.latin}|${word.english}`;
    if (seen.has(key)) throw new Error(`Repeated word in the first 100: ${key}`);
    seen.add(key);
  });
  const bodyGroups = grouped.map((group) => `
    <section class="word-group">
      <h2>${esc(group.title)}</h2>
      <div class="topic-table-wrap"><table class="topic-table"><caption>${esc(group.title)} from the Year 1 list</caption><thead><tr><th scope="col">Latin</th><th scope="col">English</th></tr></thead><tbody>
        ${group.words.map((word) => `<tr><td lang="la">${esc(word.latin)}</td><td>${esc(word.english)}</td></tr>`).join('')}
      </tbody></table></div>
    </section>
  `).join('');
  return {
    relPath: 'first-100-latin-words.html',
    title: 'First 100 Latin Words',
    linkText: 'First 100 Latin words',
    kicker: 'Word list',
    bodyClass: 'print-document',
    learningResourceType: 'reading',
    description: summarize('The first 100 Latin words in Latin Launchpad Year 1, grouped from this course\'s own list, with English meanings and a page made to print on letter paper.'),
    extraSchema: [{
      '@type': 'ItemList',
      name: 'First 100 Latin words',
      numberOfItems: 100,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: flat.map((word, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${word.latin} — ${word.english}`
      }))
    }],
    crumbs: [{ name: 'First 100 Latin words', item: `${SITE}/first-100-latin-words.html`, href: '/first-100-latin-words.html' }],
    body: `
      <p class="trust-lead">These are the first 100 words of Latin Launchpad's Year 1 list, in the order the lessons teach them. The English is the meaning this course uses. The list is the site's own. It is not taken from another textbook's chapter.</p>
      <p class="print-citation">Latin Launchpad · First 100 Latin words · <a href="https://latinlaunchpad.com/first-100-latin-words.html">latinlaunchpad.com/first-100-latin-words.html</a></p>
      <p>Year 1 is grade 3, and it is also the right start for an older student who has not studied Latin. Nouns come first, then verbs. A class can print this page, fold it into a notebook, and check a word off when the student can give the English without looking. The practice, with the same words in sets of about ten, starts at <a href="/#/y/1/l/grade3-1">Year 1, Lesson 1</a>.</p>
      <div class="word-groups">${bodyGroups}</div>
      <p>The rest of Year 1, including the high-frequency words added after these lessons, is on the <a href="/topics/vocabulary-year-1.html">Year 1 vocabulary list</a>. Lists for later grades start at <a href="/latin-vocabulary.html">Latin vocabulary lists</a>.</p>
    `
  };
}

function tenMinutesPage(esc, summarize) {
  const steps = [
    {
      name: 'Monday: one new lesson',
      text: 'Open the next lesson and stop at about ten minutes. Meet the words, hear them, and do one practice round. Do not add a second lesson to make up for a short week.'
    },
    {
      name: 'Tuesday: flashcards',
      text: 'Run one 10-minute flashcard session on that year. Missed words matter more than a perfect score. Leave the missed ones for Friday.'
    },
    {
      name: 'Wednesday: the same lesson again',
      text: 'Return to Monday\'s lesson. Read the grammar note or the story, then practice the words in the other direction, English to Latin, if the lesson offers it.'
    },
    {
      name: 'Thursday: read aloud',
      text: 'Read one prayer or five mottoes aloud. This is the day for the ear, not for a new list. Use the prayers page or the mottoes index.'
    },
    {
      name: 'Friday: missed words',
      text: 'Flashcard only the words that were missed, or print the lesson summary and let the student teach the list back to you. Ten minutes is still the cap.'
    }
  ];
  return {
    relPath: 'latin-in-10-minutes.html',
    title: 'Latin in 10 Minutes a Day',
    linkText: 'Latin in 10 minutes a day',
    kicker: 'A weekly plan',
    bodyClass: 'print-document',
    schemaType: 'Course',
    description: summarize('A parent\'s plan for Latin in 10 minutes a day: one lesson, flashcards, a second pass, reading aloud, and a Friday review using Latin Launchpad.'),
    extraSchema: [{
      '@type': 'HowTo',
      name: 'Latin in 10 minutes a day',
      description: 'A five-day Latin routine for parents using Latin Launchpad.',
      totalTime: 'P5D',
      step: steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text
      }))
    }],
    crumbs: [{ name: 'Latin in 10 minutes a day', item: `${SITE}/latin-in-10-minutes.html`, href: '/latin-in-10-minutes.html' }],
    body: `
      <p class="trust-lead">Ten minutes is long enough for one real thing: ten new words, or a review of words that slipped, or a prayer read aloud. It is not long enough for a new lesson plus flashcards plus a quiz. This plan uses the tools already on the site and leaves the extra ideas for another day.</p>
      <p>New students start at <a href="/latin-by-grade.html#grade-3">Year 1</a>, including older students who have not had Latin. Guest mode is the right choice for a child under 13. An account is optional after that.</p>
      <h2>The week</h2>
      ${steps.map((step) => `<h3>${esc(step.name)}</h3><p>${esc(step.text)}</p>`).join('')}
      <h2>Where to click</h2>
      <ul>
        <li>Monday and Wednesday: the lesson list inside <a href="/#/y/1">Year 1</a>, or the year you chose on <a href="/latin-by-grade.html">Latin by grade</a>.</li>
        <li>Tuesday and Friday: <a href="/flashcards.html">flashcards</a>. Ten minutes is one of the session lengths on that page.</li>
        <li>Thursday: <a href="/latin-prayers.html">prayers and hymns</a> or the <a href="/topics/mottoes/index.html">mottoes</a>.</li>
        <li>If you want paper: open the lesson, then Lesson resources, then Printables. The <a href="/topics/printables.html">printables page</a> explains the three sheets.</li>
      </ul>
      <h2>If the week falls apart</h2>
      <p>Skip ahead to Friday's review and start the next new lesson on Monday. Do not stack three lessons on Saturday. A student who can say this week's ten words is further along than a student who previewed thirty and kept none.</p>
      <p>Parents who want the longer explanation of accounts, assignment links, and privacy can read <a href="/parents-teachers.html">For parents and teachers</a>. The course itself is part of <a href="https://schoollaunch.org/">School Launch</a>.</p>
    `
  };
}

function firstHundredGroups(gradeWords) {
  const all = gradeWords[3] || [];
  const base = all.filter((word) => !word.coreSet && !word.gapSet && !word.paceSet);
  const rest = all.filter((word) => word.coreSet || word.gapSet || word.paceSet);
  const ordered = [...base, ...rest];
  const puer = ordered.findIndex((word) => word.latin === 'puer' && word.english === 'boy');
  const amo = ordered.findIndex((word) => word.latin === 'amo' && word.english === 'love');
  const habeo = ordered.findIndex((word) => word.latin === 'habeo' && word.english === 'have');
  if (puer < 1 || amo <= puer || habeo <= amo) {
    throw new Error('Year 1 word order changed; the first-100 groups need an update');
  }
  const slices = [
    ['First-declension nouns', ordered.slice(0, puer)],
    ['Second-declension nouns', ordered.slice(puer, amo)],
    ['First-conjugation verbs', ordered.slice(amo, habeo)],
    ['Second-conjugation verbs', ordered.slice(habeo, base.length)],
    ['More Year 1 words', ordered.slice(base.length)]
  ];
  const grouped = [];
  let remaining = 100;
  slices.forEach(([title, list]) => {
    if (remaining <= 0 || !list.length) return;
    const words = list.slice(0, remaining);
    grouped.push({ title, words });
    remaining -= words.length;
  });
  return grouped;
}

function gloss(esc, pairs) {
  return `<ul>${pairs.map(([latin, english]) => `<li><span lang="la">${esc(latin)}</span> — ${esc(english)}</li>`).join('')}</ul>`;
}

function faqSchema(questions) {
  return {
    '@type': 'FAQPage',
    mainEntity: questions.map((question) => ({
      '@type': 'Question',
      name: question.q,
      acceptedAnswer: { '@type': 'Answer', text: question.a }
    }))
  };
}

function faqHtml(esc, questions) {
  return `
    <h2>Questions parents ask</h2>
    <div class="faq-list">
      ${questions.map((question) => `<h3>${esc(question.q)}</h3><p>${esc(question.a)}</p>`).join('')}
    </div>
  `;
}

module.exports = { buildLandingPages, firstHundredGroups };
