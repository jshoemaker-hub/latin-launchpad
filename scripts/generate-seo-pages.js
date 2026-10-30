// Builds crawlable topic pages, sitemap.xml, and robots.txt from the lesson data.
// Run during the Netlify build. Output defaults to dist/ and can be redirected
// with SEO_OUT_DIR for tests.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const SITE = 'https://latinlaunchpad.com';

const DATA_FILES = [
  'word-banks.js',
  'reference-vocabulary.js',
  'core-frequency.js',
  'gap-vocabulary.js',
  'latin-phrases.js',
  'latin-phrases-more.js',
  'latin-stories.js',
  'latin-culture.js',
  'roman-world.js',
  'latin-authors.js',
  'latin-values.js',
  'classroom-latin.js',
  'learning-objectives.js',
  'grammar-lessons.js',
  'grammar-lessons-syntax.js',
  'grammar-lessons-extra.js',
  'grammar-lessons-early.js',
  'word-building.js',
  'annual-exam.js'
];

const LEVELS = [
  { grade: 3, year: 1, slug: 'vocabulary-year-1', label: 'Year 1', gradeName: 'Grade 3' },
  { grade: 4, year: 2, slug: 'vocabulary-year-2', label: 'Year 2', gradeName: 'Grade 4' },
  { grade: 5, year: 3, slug: 'vocabulary-year-3', label: 'Year 3', gradeName: 'Grade 5' },
  { grade: 6, year: 4, slug: 'vocabulary-year-4a', label: 'Year 4A', gradeName: 'Grade 6' },
  { grade: 7, year: 4, slug: 'vocabulary-year-4b', label: 'Year 4B', gradeName: 'Grade 7' },
  { grade: 8, year: 4, slug: 'vocabulary-year-4c', label: 'Year 4C', gradeName: 'Grade 8' }
];

const STATIC_URLS = [
  `${SITE}/`,
  `${SITE}/flashcards.html`,
  `${SITE}/about.html`,
  `${SITE}/parents-teachers.html`,
  `${SITE}/school-privacy.html`,
  `${SITE}/privacy.html`,
  `${SITE}/terms.html`,
  `${SITE}/contact.html`
];

const KNOWN_SITE_FILES = new Set([
  'about.html',
  'parents-teachers.html',
  'school-privacy.html',
  'privacy.html',
  'terms.html',
  'contact.html',
  'flashcards.html',
  'index.html',
  'styles.css',
  'analytics.js',
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.png',
  'og-image.jpg'
]);

const UNIT_LABELS = [
  ['myth', 'Myth'],
  ['life', 'Daily life'],
  ['history', 'History'],
  ['values', 'Roman values'],
  ['authors', 'Authors and genres'],
  ['', 'Places and stories']
];

const NAV = [
  ['/topics/index.html', 'All topics'],
  ['/topics/vocabulary.html', 'Vocabulary'],
  ['/topics/grammar/index.html', 'Grammar'],
  ['/topics/roman-culture/index.html', 'Roman culture'],
  ['/topics/derivatives.html', 'Derivatives'],
  ['/topics/mottoes/index.html', 'Mottoes'],
  ['/topics/annual-exam-study/index.html', 'Annual Exam Study'],
  ['/topics/printables.html', 'Printables']
];

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function summarize(text, max = 155) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max - 1);
  const space = slice.lastIndexOf(' ');
  const trimmed = (space > 80 ? slice.slice(0, space) : slice).replace(/[.,;:–\-]+$/u, '');
  return `${trimmed}…`;
}

function assertSlug(id, label) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(id || ''))) {
    throw new Error(`Unsafe ${label} id: ${id}`);
  }
}

function loadData() {
  const context = {
    console,
    ANNUAL_EXAM_QUESTIONS: [],
    ANNUAL_EXAM_PASSAGES: []
  };
  vm.createContext(context);
  DATA_FILES.forEach((file) => {
    const filePath = path.join(root, file);
    vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
  });
  vm.runInContext(`
    globalThis.__CONTENT = {
      GRADE_WORDS,
      LATIN_PHRASES,
      LATIN_CULTURE_CARDS,
      CLASSROOM_LATIN_PHRASES,
      CLASSROOM_LATIN_CATEGORIES,
      GRAMMAR_LESSONS,
      SYNTAX_GRAMMAR_LESSONS,
      LEARNING_OBJECTIVES,
      LATIN_STORY_SCENES,
      DERIVATIVE_PAIRS,
      AFFIX_ITEMS,
      ANNUAL_EXAM_LEVELS,
      ANNUAL_EXAM_NOTE
    };
  `, context);
  return context.__CONTENT;
}

function isYearFourReadingWord(word) {
  return Array.isArray(word?.sourceImages)
    && word.sourceImages.some((image) => /^IMG_253[1-8]\.jpeg$/.test(image));
}

function wordsForGrade(gradeWords, grade) {
  return (gradeWords[grade] || []).filter((word) => grade !== 5 || !isYearFourReadingWord(word));
}

function yearForGrade(grade) {
  return LEVELS.find((level) => level.grade === Number(grade))?.year || null;
}

function levelForGrade(grade) {
  return LEVELS.find((level) => level.grade === Number(grade)) || null;
}

function grammarHeading(lesson) {
  const level = levelForGrade(lesson.grade);
  const rest = String(lesson.title || '').replace(/^Grade\s+\d+\s+Grammar:\s*/i, '').trim();
  const label = level ? `${level.label} · ${level.gradeName}` : `Grade ${lesson.grade}`;
  return rest ? `${label}: ${rest}` : label;
}

function firstLessonHref(grade, gradeWords) {
  const year = yearForGrade(grade);
  const base = wordsForGrade(gradeWords, grade).filter((word) => !word.coreSet && !word.gapSet);
  if (!year) return '/';
  if (!base.length) return `/#/y/${year}`;
  return `/#/y/${year}/l/grade${grade}-1`;
}

function flashcardHref(level) {
  if (level.grade >= 7) return '/flashcards.html';
  return `/flashcards.html#/deck/${level.year}/10/visual`;
}

function wordTable(words, caption) {
  if (!words.length) return '';
  const rows = words.map((word) => (
    `<tr><td lang="la">${esc(word.latin)}</td><td>${esc(word.english)}</td></tr>`
  )).join('');
  return `<div class="topic-table-wrap"><table class="topic-table"><caption>${esc(caption)}</caption><thead><tr><th scope="col">Latin</th><th scope="col">English</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function jsonScript(data) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}

function organization() {
  return {
    '@type': 'EducationalOrganization',
    name: 'Latin Launchpad',
    url: `${SITE}/`,
    sameAs: 'https://schoollaunch.org/'
  };
}

function renderPage(page) {
  const url = `${SITE}/${page.relPath}`;
  const crumbs = [
    { name: 'Latin Launchpad', item: `${SITE}/` },
    { name: 'Topics', item: `${SITE}/topics/index.html` },
    ...page.crumbs
  ];
  const crumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item || url
    }))
  };
  const mainEntity = page.mainEntity || {
    '@type': 'LearningResource',
    name: page.title,
    description: page.description,
    url,
    learningResourceType: page.resourceType || 'reading',
    educationalLevel: page.educationalLevel || 'Grades 3-8',
    inLanguage: ['en', 'la'],
    isAccessibleForFree: true,
    provider: organization()
  };
  const nav = NAV.map(([href, label]) => {
    const current = href === `/${page.relPath}` ? ' aria-current="page"' : '';
    return `<a href="${href}"${current}>${label}</a>`;
  }).join('\n          ');
  const visibleCrumbs = [
    `<a href="/">Latin Launchpad</a>`,
    `<a href="/topics/index.html">Topics</a>`,
    ...page.crumbs.slice(0, -1).map((crumb) => `<a href="${esc(crumb.href)}">${esc(crumb.name)}</a>`),
    `<span>${esc(page.crumbLabel || page.title)}</span>`
  ].join('<span aria-hidden="true"> / </span>');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(page.title)} | Latin Launchpad</title>
  <meta name="description" content="${esc(page.description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:image" content="${SITE}/og-image.jpg">
  <meta property="og:image:alt" content="Latin Launchpad, Latin practice for grades 3–8">
  <meta property="og:site_name" content="Latin Launchpad">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.title)}">
  <meta name="twitter:description" content="${esc(page.description)}">
  <meta name="twitter:image" content="${SITE}/og-image.jpg">
  <meta name="twitter:image:alt" content="Latin Launchpad, Latin practice for grades 3–8">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="stylesheet" href="/styles.css">
  ${jsonScript({ '@context': 'https://schema.org', '@graph': [crumbList, mainEntity] })}
</head>
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <aside id="analyticsConsentBanner" class="analytics-consent" aria-labelledby="analyticsConsentTitle">
    <div>
      <strong id="analyticsConsentTitle">Optional analytics</strong>
      <p>An adult may allow anonymous usage analytics to help improve Latin Launchpad. Advertising features are off. <a href="/privacy.html#analytics">Learn more about analytics</a>.</p>
    </div>
    <div class="analytics-consent-actions">
      <button type="button" class="secondary-button" data-analytics-choice="denied">No thanks</button>
      <button type="button" class="primary-button" data-analytics-choice="granted">Allow analytics</button>
    </div>
  </aside>
  <div class="app-shell trust-shell">
    <header class="trust-header">
      <a class="trust-brand" href="/">Latin Launchpad</a>
      <nav aria-label="Topics">
          ${nav}
      </nav>
    </header>
    <main class="card trust-page topic-page" id="main" tabindex="-1">
      <nav class="crumbs" aria-label="Breadcrumb">${visibleCrumbs}</nav>
      ${page.kicker ? `<span class="section-kicker">${esc(page.kicker)}</span>` : ''}
      <h1>${esc(page.title)}</h1>
      ${page.body}
    </main>
    <footer class="site-footer">
      <p><strong>Latin Launchpad</strong><span>Independent Latin practice for grades 3–8.</span><span>Latin Launchpad is a course on <a href="https://schoollaunch.org/" target="_blank" rel="noopener">School Launch</a>.</span></p>
      <nav aria-label="Footer links">
        <a href="/">Practice</a>
        <a href="/topics/index.html">Topics</a>
        <a href="/about.html">About</a>
        <a href="/parents-teachers.html">For Parents / Teachers</a>
        <a href="/flashcards.html">Flashcards</a>
        <a href="/privacy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
        <a href="/contact.html">Contact</a>
        <button type="button" class="analytics-preferences-button">Analytics choices</button>
      </nav>
    </footer>
  </div>
  <script defer src="/analytics.js"></script>
</body>
</html>
`;
}

function vocabularyPages(data) {
  const pages = [];
  const yearLinks = LEVELS.map((level) => {
    const count = wordsForGrade(data.GRADE_WORDS, level.grade).length;
    return `<li><a href="/topics/${level.slug}.html">${esc(level.label)} · ${esc(level.gradeName)}</a> — ${count} Latin words in this course's list.</li>`;
  }).join('');
  const readingCount = (data.GRADE_WORDS[5] || []).filter(isYearFourReadingWord).length;
  const readingItem = readingCount
    ? `<li><a href="/topics/vocabulary-year-4-reading.html">Year 4 reading words</a> — ${readingCount} extra reading words used with Year 4.</li>`
    : '';
  pages.push({
    relPath: 'topics/vocabulary.html',
    title: 'Latin vocabulary by year',
    linkText: 'Latin vocabulary by year',
    group: 'Vocabulary',
    kicker: 'Vocabulary',
    description: summarize('Latin vocabulary lists for Latin Launchpad Years 1–4 (grades 3–8), with the course’s own headwords and English meanings for classical schools and homeschool.'),
    educationalLevel: 'Grades 3-8',
    crumbs: [{ name: 'Vocabulary', item: `${SITE}/topics/vocabulary.html`, href: '/topics/vocabulary.html' }],
    body: `
      <p class="trust-lead">Latin Launchpad teaches its own vocabulary lists for grades 3–8. Year 1 is grade 3, Year 2 is grade 4, Year 3 is grade 5, and Year 4 splits into Year 4A (grade 6), Year 4B (grade 7), and Year 4C (grade 8). Each list below is the Latin and English students practice in that year.</p>
      <p>Core-word sets add high-frequency Latin that the main lessons did not already include. English glosses on this site are original. Frequency order for those added words follows the <a href="https://dcc.dickinson.edu/vocab/core-vocabulary">Dickinson College Commentaries Latin Core Vocabulary</a>. Everyday words are short function words and household terms written for this course.</p>
      <h2>Choose a year</h2>
      <ul>
        ${yearLinks}
        ${readingItem}
      </ul>
      <p>Practice in the app by choosing a year, or open <a href="/flashcards.html">timed flashcards</a>. The <a href="/#/y/1">Year 1 lesson list</a> is a direct way in.</p>
    `
  });

  LEVELS.forEach((level) => {
    const words = wordsForGrade(data.GRADE_WORDS, level.grade);
    const main = words.filter((word) => !word.coreSet && !word.gapSet);
    const core = words.filter((word) => word.coreSet);
    const everyday = words.filter((word) => word.gapSet);
    const objectives = data.LEARNING_OBJECTIVES?.[level.grade];
    const goals = objectives?.goals?.length
      ? `<h2>What this year practices</h2><ul>${objectives.goals.map((goal) => `<li>${esc(goal)}</li>`).join('')}</ul>`
      : '';
    const flashNote = level.grade >= 7
      ? `On the flashcard page, choose ${level.label}.`
      : 'A 10-minute flashcard session opens in a new page.';
    pages.push({
      relPath: `topics/${level.slug}.html`,
      title: `${level.label} Latin vocabulary (${level.gradeName})`,
      linkText: `${level.label} vocabulary`,
      group: 'Vocabulary',
      kicker: 'Vocabulary',
      description: summarize(`${level.label} (${level.gradeName}) Latin vocabulary for Latin Launchpad: ${words.length} words with English meanings, plus a link into the interactive lessons.`),
      educationalLevel: level.gradeName,
      crumbs: [
        { name: 'Vocabulary', href: '/topics/vocabulary.html', item: `${SITE}/topics/vocabulary.html` },
        { name: `${level.label} vocabulary`, item: `${SITE}/topics/${level.slug}.html` }
      ],
      body: `
        <p class="trust-lead">${esc(objectives?.intro || `${level.label} vocabulary for ${level.gradeName}.`)} These are this course's own headwords, in the order the lessons teach them.</p>
        ${goals}
        <p class="topic-practice"><a href="${firstLessonHref(level.grade, data.GRADE_WORDS)}">Practice ${esc(level.label)} in the app</a> · <a href="${flashcardHref(level)}">Flashcards</a>. ${esc(flashNote)}</p>
        <h2>Lesson words</h2>
        <p>${main.length} words from the main ${esc(level.label)} lessons.</p>
        ${wordTable(main, `${level.label} lesson words`)}
        ${core.length ? `<h2>Core words</h2><p>High-frequency Latin added after the main lessons. The English meanings were written for Latin Launchpad.</p>${wordTable(core, `${level.label} core words`)}` : ''}
        ${everyday.length ? `<h2>Everyday words</h2><p>Little words and household words that show up often in the stories.</p>${wordTable(everyday, `${level.label} everyday words`)}` : ''}
      `
    });
  });

  const reading = (data.GRADE_WORDS[5] || []).filter(isYearFourReadingWord);
  if (reading.length) {
    pages.push({
      relPath: 'topics/vocabulary-year-4-reading.html',
      title: 'Year 4 Latin reading vocabulary',
      linkText: 'Year 4 reading vocabulary',
      group: 'Vocabulary',
      kicker: 'Vocabulary',
      description: summarize(`Extra Latin reading words used with Year 4 in Latin Launchpad, listed with the English meanings taught in the course.`),
      educationalLevel: 'Grades 6-8',
      crumbs: [
        { name: 'Vocabulary', href: '/topics/vocabulary.html', item: `${SITE}/topics/vocabulary.html` },
        { name: 'Year 4 reading words', item: `${SITE}/topics/vocabulary-year-4-reading.html` }
      ],
      body: `
        <p class="trust-lead">These reading words sit with Year 4 practice (grades 6–8). They are part of this course's lists, separate from the Year 3 lesson words.</p>
        <p class="topic-practice"><a href="/#/y/4">Open Year 4 in the app</a> · <a href="/topics/vocabulary-year-4a.html">Year 4A vocabulary</a></p>
        ${wordTable(reading, 'Year 4 reading words')}
      `
    });
  }
  return pages;
}

function grammarPages(data) {
  const lessons = [];
  const seen = new Set();
  [...data.GRAMMAR_LESSONS, ...data.SYNTAX_GRAMMAR_LESSONS].forEach((lesson) => {
    if (!lesson?.id || seen.has(lesson.id)) return;
    seen.add(lesson.id);
    assertSlug(lesson.id, 'grammar');
    lessons.push(lesson);
  });
  if (lessons.length < 40) throw new Error(`Expected grammar lessons, found ${lessons.length}`);

  const byGrade = LEVELS.map((level) => ({
    level,
    lessons: lessons.filter((lesson) => Number(lesson.grade) === level.grade)
  })).filter((group) => group.lessons.length);

  const indexBody = `
    <p class="trust-lead">Grammar in Latin Launchpad starts with sounds and endings in the elementary years and moves to clauses, participles, and reading syntax in Year 4. Each topic below is a lesson students can open in the app.</p>
    <p>The notes on these pages are the course's own explanations. Practice still happens in the interactive lesson, where the checks and printables live.</p>
    ${byGrade.map(({ level, lessons: group }) => `
      <h2>${esc(level.label)} · ${esc(level.gradeName)}</h2>
      <ul>
        ${group.map((lesson) => `<li><a href="/topics/grammar/${lesson.id}.html">${esc(grammarHeading(lesson))}</a> — ${esc(lesson.description || '')}</li>`).join('')}
      </ul>
    `).join('')}
  `;

  const pages = [{
    relPath: 'topics/grammar/index.html',
    title: 'Latin grammar topics',
    linkText: 'Latin grammar topics',
    group: 'Grammar',
    kicker: 'Grammar',
    description: summarize('Latin grammar topics in Latin Launchpad for grades 3–8, from endings and verb forms to clauses, deponents, and reading syntax.'),
    crumbs: [{ name: 'Grammar', item: `${SITE}/topics/grammar/index.html` }],
    body: indexBody
  }];

  lessons.forEach((lesson) => {
    const level = levelForGrade(lesson.grade);
    const heading = grammarHeading(lesson);
    const year = yearForGrade(lesson.grade);
    const focus = Array.isArray(lesson.focus) && lesson.focus.length
      ? `<h2>What to notice</h2><ul>${lesson.focus.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`
      : '';
    const explain = Array.isArray(lesson.explain) && lesson.explain.length
      ? `<h2>Explanation</h2>${lesson.explain.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}`
      : '';
    const examples = Array.isArray(lesson.examples) && lesson.examples.length
      ? `<h2>Examples</h2><ul>${lesson.examples.map((example) => `<li><span lang="la">${esc(example.latin)}</span> — ${esc(example.english)}${example.note ? ` ${esc(example.note)}` : ''}</li>`).join('')}</ul>`
      : '';
    const words = Array.isArray(lesson.words) ? lesson.words : [];
    const fromWords = !explain && words.length
      ? `<h2>Examples</h2><ul>${words.slice(0, 8).map((word) => `<li><span lang="la">${esc(word.latin)}</span> — ${esc(word.english)}. ${esc(word.explanation || '')}</li>`).join('')}</ul>`
      : '';
    const wordList = words.length
      ? `<h2>Latin in this lesson</h2><ul>${words.map((word) => `<li><span lang="la">${esc(word.latin)}</span> — ${esc(word.english)}</li>`).join('')}</ul>`
      : '';
    const practice = year
      ? `<p class="topic-practice"><a href="/#/y/${year}/l/${lesson.id}">Practice this lesson</a></p>`
      : '';
    pages.push({
      relPath: `topics/grammar/${lesson.id}.html`,
      title: heading,
      linkText: heading,
      group: 'Grammar',
      kicker: 'Grammar',
      description: summarize(`${heading}. ${lesson.description || 'A Latin grammar lesson in Latin Launchpad.'}`),
      educationalLevel: level ? level.gradeName : `Grade ${lesson.grade}`,
      crumbs: [
        { name: 'Grammar', href: '/topics/grammar/index.html', item: `${SITE}/topics/grammar/index.html` },
        { name: heading, item: `${SITE}/topics/grammar/${lesson.id}.html` }
      ],
      body: `
        <p class="trust-lead">${esc(lesson.description || '')}</p>
        ${practice}
        ${focus}
        ${explain}
        ${examples}
        ${fromWords}
        ${explain || examples ? wordList : ''}
      `
    });
  });
  return pages;
}

function culturePages(data) {
  const seen = new Set();
  const cards = [];
  data.LATIN_CULTURE_CARDS.forEach((card) => {
    if (!card?.id || seen.has(card.id)) return;
    seen.add(card.id);
    assertSlug(card.id, 'culture');
    cards.push(card);
  });
  if (cards.length < 100) throw new Error(`Expected culture cards, found ${cards.length}`);

  const groups = UNIT_LABELS.map(([unit, label]) => ({
    unit: unit || 'places',
    label,
    cards: cards.filter((card) => (card.unit || '') === unit)
  })).filter((group) => group.cards.length);

  const indexBody = `
    <p class="trust-lead">Roman culture in Latin Launchpad is a set of short cards: myth, daily life, history, values, authors, and places. Students read a card, connect it to Latin words they know, and can open the same material in the Roman world section of the app.</p>
    <p class="topic-practice"><a href="/#/roman-world">Open Roman world in the app</a></p>
    ${groups.map((group) => `
      <h2 id="unit-${group.unit}">${esc(group.label)}</h2>
      ${group.cards.map((card) => `
        <h3><a href="/topics/roman-culture/${card.id}.html">${esc(card.title)}</a></h3>
        <p>${card.latinTitle ? `<span lang="la">${esc(card.latinTitle)}</span>. ` : ''}${esc(card.summary || '')}</p>
      `).join('')}
    `).join('')}
  `;

  const pages = [{
    relPath: 'topics/roman-culture/index.html',
    title: 'Roman culture, myth, and history',
    linkText: 'Roman culture and myth',
    group: 'Roman culture',
    kicker: 'Roman world',
    description: summarize('Roman myth, daily life, history, values, authors, and places taught in Latin Launchpad for grades 3–8, with a link to the interactive cards.'),
    crumbs: [{ name: 'Roman culture', item: `${SITE}/topics/roman-culture/index.html` }],
    body: indexBody
  }];

  cards.forEach((card) => {
    const unitLabel = UNIT_LABELS.find(([unit]) => (card.unit || '') === unit)?.[1] || 'Places and stories';
    const min = card.minGrade || 3;
    const max = card.maxGrade || 8;
    const grades = min === max ? `Grade ${min}` : `Grades ${min}–${max}`;
    const links = Array.isArray(card.linkedWords) && card.linkedWords.length
      ? `<p>Latin words that go with this card: ${card.linkedWords.map((word) => `<span lang="la">${esc(word)}</span>`).join(', ')}.</p>`
      : '';
    const example = card.example
      ? `<h2>A line to remember</h2><blockquote><p lang="la">${esc(card.example.latin)}</p><p>${esc(card.example.english)}</p>${card.example.source ? `<p>${esc(card.example.source)}</p>` : ''}</blockquote>`
      : '';
    pages.push({
      relPath: `topics/roman-culture/${card.id}.html`,
      title: card.latinTitle ? `${card.title} (${card.latinTitle})` : card.title,
      linkText: card.title,
      group: 'Roman culture',
      kicker: unitLabel,
      description: summarize(`${card.title}. ${card.summary || ''}`),
      educationalLevel: grades,
      crumbs: [
        { name: 'Roman culture', href: '/topics/roman-culture/index.html', item: `${SITE}/topics/roman-culture/index.html` },
        { name: card.title, item: `${SITE}/topics/roman-culture/${card.id}.html` }
      ],
      body: `
        <p class="trust-lead">${esc(card.summary || '')}</p>
        <p>${esc(grades)}. ${esc(unitLabel)}.</p>
        ${card.connection ? `<h2>How it connects</h2><p>${esc(card.connection)}</p>` : ''}
        ${example}
        ${links}
        <p class="topic-practice"><a href="/#/roman-world">Open Roman world</a> · <a href="/topics/roman-culture/index.html#unit-${(card.unit || 'places')}">More ${esc(unitLabel).toLowerCase()} cards</a></p>
      `
    });
  });
  return pages;
}

function derivativePage(data) {
  const pairs = data.DERIVATIVE_PAIRS || [];
  const affixes = data.AFFIX_ITEMS || [];
  if (pairs.length < 20) throw new Error(`Expected derivative pairs, found ${pairs.length}`);
  const pairItems = pairs.map((pair) => (
    `<li><span lang="la">${esc(pair.latin)}</span>, ${esc(pair.english)}, gives English <strong>${esc(pair.derivative)}</strong>.</li>`
  )).join('');
  const affixItems = affixes.map((item) => (
    `<li><span lang="la">${esc(item.latin)}</span> means ${esc(item.english)}. ${esc(item.note || '')}</li>`
  )).join('');
  return {
    relPath: 'topics/derivatives.html',
    title: 'Latin derivatives, prefixes, and suffixes',
    linkText: 'Derivatives, prefixes, and suffixes',
    group: 'Derivatives and mottoes',
    kicker: 'Word building',
    description: summarize('English derivatives, prefixes, and suffixes built from the Latin words in Latin Launchpad, for grades 3–8.'),
    crumbs: [{ name: 'Derivatives', item: `${SITE}/topics/derivatives.html` }],
    body: `
      <p class="trust-lead">Word building in Latin Launchpad asks students to spot the English word that grew from a Latin word they already know. The pairs below are the ones the practice uses. Prefixes and suffixes are taught as reusable pieces.</p>
      <p class="topic-practice"><a href="/#/word-building">Practice word building in the app</a></p>
      <h2>Derivatives</h2>
      <ul>${pairItems}</ul>
      <h2>Prefixes and suffixes</h2>
      <ul>${affixItems}</ul>
    `
  };
}

function mottoPages(data) {
  const phrases = data.LATIN_PHRASES || [];
  if (phrases.length < 100) throw new Error(`Expected mottoes, found ${phrases.length}`);
  phrases.forEach((phrase) => assertSlug(phrase.id, 'motto'));
  const letters = new Map();
  phrases.forEach((phrase) => {
    const letter = String(phrase.latin || '').replace(/[^A-Za-z]/g, '').charAt(0).toUpperCase() || '#';
    if (!letters.has(letter)) letters.set(letter, []);
    letters.get(letter).push(phrase);
  });
  const indexBody = `
    <p class="trust-lead">These are the mottoes, sayings, and abbreviations Latin Launchpad practices with its vocabulary. Each line has the Latin, an English meaning, and a short note. Open one to read it on its own page, or practice phrases inside a year in the app.</p>
    <p class="topic-practice"><a href="/#/y/1">Practice Year 1</a> · <a href="/topics/classroom-latin.html">Classroom Latin</a></p>
    ${[...letters.keys()].sort().map((letter) => `
      <h2 id="letter-${esc(letter)}">${esc(letter)}</h2>
      ${letters.get(letter).map((phrase) => `<p><a href="/topics/mottoes/${phrase.id}.html"><span lang="la">${esc(phrase.latin)}</span></a> — ${esc(phrase.meaning)}. ${esc(phrase.note || '')}</p>`).join('')}
    `).join('')}
  `;
  const pages = [{
    relPath: 'topics/mottoes/index.html',
    title: 'Latin mottoes and abbreviations',
    linkText: 'Latin mottoes and abbreviations',
    group: 'Derivatives and mottoes',
    kicker: 'Mottoes',
    description: summarize('Latin mottoes, sayings, and abbreviations used in Latin Launchpad, with English meanings for grades 3–8.'),
    crumbs: [{ name: 'Mottoes', item: `${SITE}/topics/mottoes/index.html` }],
    body: indexBody
  }];
  phrases.forEach((phrase) => {
    const linked = Array.isArray(phrase.linkedWords) && phrase.linkedWords.length
      ? `<p>Related lesson words: ${phrase.linkedWords.map((word) => `<span lang="la">${esc(word)}</span>`).join(', ')}.</p>`
      : '';
    const gradeNote = phrase.minGrade
      ? `<p>Students usually meet this saying from grade ${Number(phrase.minGrade)} upward.</p>`
      : '';
    pages.push({
      relPath: `topics/mottoes/${phrase.id}.html`,
      title: `${phrase.latin} — ${phrase.meaning}`,
      linkText: phrase.latin,
      group: 'Derivatives and mottoes',
      kicker: 'Motto',
      description: summarize(`${phrase.latin} means ${phrase.meaning}. ${phrase.note || ''}`),
      crumbs: [
        { name: 'Mottoes', href: '/topics/mottoes/index.html', item: `${SITE}/topics/mottoes/index.html` },
        { name: phrase.latin, item: `${SITE}/topics/mottoes/${phrase.id}.html` }
      ],
      body: `
        <p class="trust-lead"><span lang="la">${esc(phrase.latin)}</span> means ${esc(phrase.meaning)}.</p>
        <p>${esc(phrase.note || '')}</p>
        ${gradeNote}
        ${linked}
        <p class="topic-practice"><a href="/topics/mottoes/index.html">All mottoes</a> · <a href="/#/annual-exam">Annual Exam Study motto practice</a></p>
      `
    });
  });
  return pages;
}

function classroomPage(data) {
  const phrases = data.CLASSROOM_LATIN_PHRASES || [];
  const labels = data.CLASSROOM_LATIN_CATEGORIES || {};
  const categories = [];
  phrases.forEach((phrase) => {
    if (!categories.includes(phrase.category)) categories.push(phrase.category);
  });
  const body = `
    <p class="trust-lead">Classroom Latin is the language of the room: greetings, please and thank you, simple commands, and ways to say you do not understand. Latin Launchpad keeps forty of these phrases with the lessons.</p>
    <p class="topic-practice"><a href="/#/y/1">Start Year 1</a> · <a href="/topics/mottoes/index.html">Mottoes and abbreviations</a></p>
    ${categories.map((category) => `
      <h2>${esc(labels[category] || category)}</h2>
      <ul>
        ${phrases.filter((phrase) => phrase.category === category).map((phrase) => `<li><span lang="la">${esc(phrase.latin)}</span> — ${esc(phrase.english)}. ${esc(phrase.note || '')}</li>`).join('')}
      </ul>
    `).join('')}
  `;
  return {
    relPath: 'topics/classroom-latin.html',
    title: 'Classroom Latin phrases',
    linkText: 'Classroom Latin phrases',
    group: 'Derivatives and mottoes',
    kicker: 'Classroom Latin',
    description: summarize('Classroom Latin for grades 3–8: greetings, courtesy, commands, and other phrases students say in Latin Launchpad lessons.'),
    crumbs: [{ name: 'Classroom Latin', item: `${SITE}/topics/classroom-latin.html` }],
    body
  };
}

function storiesPage(data) {
  const stories = data.LATIN_STORY_SCENES || [];
  if (!stories.length) throw new Error('Expected illustrated stories');
  const body = `
    <p class="trust-lead">Every vocabulary lesson in Latin Launchpad can open an illustrated story. The scenes use the year's words. Students listen for Latin they know, then read the short story in the lesson.</p>
    <p class="topic-practice"><a href="/#/y/1/l/grade3-1">Open a Year 1 lesson</a></p>
    ${stories.map((story) => `
      <h2>${esc(story.englishTitle || story.title)}</h2>
      <p lang="la">${esc(story.title)}</p>
      <p>${esc(story.summary || '')}</p>
      ${story.latinCue ? `<p><span lang="la">${esc(story.latinCue)}</span> ${esc(story.englishCue || '')}</p>` : ''}
      ${story.pictureCue ? `<p>${esc(story.pictureCue)}</p>` : ''}
    `).join('')}
  `;
  return {
    relPath: 'topics/stories.html',
    title: 'Illustrated Latin stories',
    linkText: 'Illustrated Latin stories',
    group: 'Stories and printables',
    kicker: 'Stories',
    description: summarize('Illustrated Latin stories in Latin Launchpad for grades 3–8, with the scene, a Latin line, and the English cue from each lesson.'),
    crumbs: [{ name: 'Stories', item: `${SITE}/topics/stories.html` }],
    body
  };
}

function examPages(data) {
  const levels = data.ANNUAL_EXAM_LEVELS || [];
  if (levels.length < 6) throw new Error(`Expected Annual Exam Study levels, found ${levels.length}`);
  levels.forEach((level) => assertSlug(level.id, 'exam level'));
  const indexBody = `
    <p class="trust-lead">${esc(data.ANNUAL_EXAM_NOTE || 'Original practice questions written for Latin Launchpad.')} Pick a level, read what it covers, then practice in the app by category or as a timed set.</p>
    <p>The levels follow the same path as the course. Introduction lines up with Year 4A, Beginning with Year 4B, and Intermediate with Year 4C. Reading levels and the advanced levels are there when a class is ready for longer passages.</p>
    <p class="topic-practice"><a href="/#/annual-exam">Open Annual Exam Study</a></p>
    ${levels.map((level) => `
      <h2><a href="/topics/annual-exam-study/${level.id}.html">${esc(level.name)}</a></h2>
      <p>${esc(level.audience || '')} ${esc(level.formatNote || '')}</p>
    `).join('')}
  `;
  const pages = [{
    relPath: 'topics/annual-exam-study/index.html',
    title: 'Annual Exam Study',
    linkText: 'Annual Exam Study',
    group: 'Annual Exam Study',
    kicker: 'Practice',
    description: summarize('Annual Exam Study in Latin Launchpad: original practice for Introduction, Beginning, Intermediate, reading, and advanced levels, grades 6–8 and beyond.'),
    crumbs: [{ name: 'Annual Exam Study', item: `${SITE}/topics/annual-exam-study/index.html` }],
    body: indexBody
  }];
  levels.forEach((level) => {
    const syllabus = (level.syllabus || []).map((section) => `
      <h2>${esc(section.heading)}</h2>
      <ul>${(section.items || []).map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
    `).join('');
    const sections = (level.sections || []).map((section) => esc(section.label)).join(', ');
    pages.push({
      relPath: `topics/annual-exam-study/${level.id}.html`,
      title: `Annual Exam Study: ${level.name}`,
      linkText: level.name,
      group: 'Annual Exam Study',
      kicker: 'Annual Exam Study',
      description: summarize(`Annual Exam Study ${level.name}. ${level.audience || ''} ${level.formatNote || ''}`),
      educationalLevel: level.suggestedGrade ? `Grade ${level.suggestedGrade}` : 'Grades 6-8',
      crumbs: [
        { name: 'Annual Exam Study', href: '/topics/annual-exam-study/index.html', item: `${SITE}/topics/annual-exam-study/index.html` },
        { name: level.name, item: `${SITE}/topics/annual-exam-study/${level.id}.html` }
      ],
      body: `
        <p class="trust-lead">${esc(level.audience || '')}</p>
        <p>${esc(level.yearNote || '')}</p>
        <p>${esc(level.formatNote || '')}</p>
        ${sections ? `<p>Question groups: ${sections}.</p>` : ''}
        <p class="topic-practice"><a href="/#/annual-exam/${level.id}">Practice the ${esc(level.name)} level</a> · <a href="/#/annual-exam/${level.id}/exam">Timed practice set</a></p>
        ${syllabus}
      `
    });
  });
  return pages;
}

function printablesPage(data) {
  const lessonLinks = LEVELS.map((level) => {
    const href = firstLessonHref(level.grade, data.GRADE_WORDS);
    return `<li><a href="${href}">${esc(level.label)} · ${esc(level.gradeName)}</a> — open a lesson, then Lesson resources, then Printables.</li>`;
  }).join('');
  return {
    relPath: 'topics/printables.html',
    title: 'Latin printables',
    linkText: 'Printables',
    group: 'Stories and printables',
    kicker: 'Printables',
    description: summarize('Printable Latin practice from Latin Launchpad lessons: a one-page summary, a crossword, and a word find for grades 3–8.'),
    crumbs: [{ name: 'Printables', item: `${SITE}/topics/printables.html` }],
    body: `
      <p class="trust-lead">Every lesson can print three practice sheets. They are built from that lesson's words when a student or teacher opens the lesson. Nothing is a separate download catalog. The sheets stay with the chapter a class is already using.</p>
      <h2>Lesson summary</h2>
      <p>A one-page recap of the lesson: the Latin, the English, and the kind of practice the chapter used. It is the sheet to send home after a class day.</p>
      <h2>Crossword</h2>
      <p>A crossword made from the lesson's puzzle words. Clues use the English meanings from this course. The sheet is skipped only when a lesson does not have enough puzzle words.</p>
      <h2>Word find</h2>
      <p>A word search of the same lesson terms. Students can also play the word find on screen before they print it.</p>
      <h2>How to print one</h2>
      <ol>
        <li>Open the year and the lesson in the app.</li>
        <li>Open Lesson resources, then Printables.</li>
        <li>Choose Lesson summary, Crossword, or Word find, then Print.</li>
      </ol>
      <p>Guest mode is enough. An account is not required to print.</p>
      <h2>Start from a year</h2>
      <ul>${lessonLinks}</ul>
      <p>Parents and teachers can read <a href="/parents-teachers.html">how the course fits a week</a> before assigning a printable.</p>
    `
  };
}

function hubPage(pages) {
  const groups = [];
  pages.forEach((page) => {
    let group = groups.find((item) => item.label === page.group);
    if (!group) {
      group = { label: page.group, pages: [] };
      groups.push(group);
    }
    group.pages.push(page);
  });
  const directory = groups.map((group) => `
    <h2>${esc(group.label)}</h2>
    <ul>
      ${group.pages.map((page) => `<li><a href="/${page.relPath}">${esc(page.linkText || page.title)}</a></li>`).join('')}
    </ul>
  `).join('');
  return {
    relPath: 'topics/index.html',
    title: 'Latin topics for grades 3–8',
    linkText: 'All topics',
    group: 'Topics',
    kicker: 'Topics',
    description: summarize('Browse Latin Launchpad topics: vocabulary by year, grammar, Roman culture and myth, derivatives, mottoes, Annual Exam Study, stories, and printables.'),
    crumbs: [],
    mainEntity: {
      '@type': 'CollectionPage',
      name: 'Latin topics for grades 3–8',
      description: 'Topic pages for the Latin Launchpad course.',
      url: `${SITE}/topics/index.html`,
      isPartOf: { '@type': 'WebSite', name: 'Latin Launchpad', url: `${SITE}/` },
      about: organization()
    },
    body: `
      <p class="trust-lead">Latin Launchpad is a free Latin course for students in grades 3–8. Classical schools and homeschool families use it for vocabulary, grammar, mottoes, Roman culture, stories, quizzes, and Annual Exam Study. These pages are the same course in readable HTML, with links into the practice app.</p>
      <p>Year 1 is grade 3, Year 2 is grade 4, Year 3 is grade 5, and Year 4 is grades 6–8. Guest practice stays on the device. An email account is optional for a learner age 13 or older, or for an adult.</p>
      <div class="topic-card-grid">
        <a class="topic-card" href="/topics/vocabulary.html"><strong>Vocabulary by year</strong><span>Headwords and English meanings for Years 1–4.</span></a>
        <a class="topic-card" href="/topics/grammar/index.html"><strong>Grammar topics</strong><span>Endings, verbs, and the syntax lessons.</span></a>
        <a class="topic-card" href="/topics/roman-culture/index.html"><strong>Roman culture and myth</strong><span>Cards for myth, daily life, history, values, and places.</span></a>
        <a class="topic-card" href="/topics/derivatives.html"><strong>Derivatives</strong><span>English words built from this course's Latin.</span></a>
        <a class="topic-card" href="/topics/mottoes/index.html"><strong>Mottoes</strong><span>Sayings and abbreviations with English meanings.</span></a>
        <a class="topic-card" href="/topics/annual-exam-study/index.html"><strong>Annual Exam Study</strong><span>What each practice level covers.</span></a>
        <a class="topic-card" href="/topics/printables.html"><strong>Printables</strong><span>Lesson summaries, crosswords, and word finds.</span></a>
        <a class="topic-card" href="/topics/stories.html"><strong>Stories</strong><span>Illustrated scenes that use the year's words.</span></a>
      </div>
      <h2>Every topic page</h2>
      <p>Search engines and families can open any of these without running the practice app. Each page links back to the lesson, flashcards, Roman world, word building, or Annual Exam Study screen that uses the same material.</p>
      ${directory}
      <p class="topic-practice"><a href="/">Start practicing</a> · <a href="/about.html">About the course</a> · <a href="/parents-teachers.html">For parents and teachers</a></p>
    `
  };
}

function assertLinks(rendered) {
  const paths = new Set(rendered.keys());
  const hrefPattern = /href="([^"]+)"/g;
  rendered.forEach((html, relPath) => {
    const h1s = html.match(/<h1[\s>]/g) || [];
    if (h1s.length !== 1) throw new Error(`${relPath} has ${h1s.length} h1 elements`);
    for (const match of html.matchAll(hrefPattern)) {
      const href = match[1];
      if (/^https?:|^mailto:/i.test(href)) continue;
      const pathOnly = href.split('#')[0];
      if (!pathOnly || pathOnly === '/') continue;
      const rel = pathOnly.replace(/^\//, '');
      if (paths.has(rel) || KNOWN_SITE_FILES.has(rel)) continue;
      throw new Error(`Broken link in ${relPath}: ${href}`);
    }
  });
}

function sitemapLastmod() {
  return new Date().toISOString().slice(0, 10);
}

function sitemapXml(relPaths) {
  const lastmod = sitemapLastmod();
  const urls = [
    ...STATIC_URLS,
    ...relPaths.map((relPath) => `${SITE}/${relPath}`)
  ];
  const body = urls.map((url) => `  <url><loc>${esc(url)}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function robotsTxt() {
  return 'User-agent: *\nAllow: /\n\nSitemap: https://latinlaunchpad.com/sitemap.xml\n';
}

function generate(outDir) {
  const data = loadData();
  const pages = [
    ...vocabularyPages(data),
    ...grammarPages(data),
    ...culturePages(data),
    derivativePage(data),
    ...mottoPages(data),
    classroomPage(data),
    storiesPage(data),
    ...examPages(data),
    printablesPage(data)
  ];
  pages.unshift(hubPage(pages.slice()));
  const titles = new Set();
  pages.forEach((page) => {
    const title = `${page.title} | Latin Launchpad`;
    if (titles.has(title)) throw new Error(`Duplicate title: ${title}`);
    titles.add(title);
    if (!page.description || page.description.length < 40) {
      throw new Error(`Short description for ${page.relPath}`);
    }
  });
  const rendered = new Map(pages.map((page) => [page.relPath, renderPage(page)]));
  assertLinks(rendered);
  fs.rmSync(path.join(outDir, 'topics'), { recursive: true, force: true });
  rendered.forEach((html, relPath) => {
    const filePath = path.join(outDir, relPath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, html);
  });
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapXml(pages.map((page) => page.relPath)));
  fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsTxt());
  return { pages: pages.map((page) => page.relPath), outDir };
}

if (require.main === module) {
  const outDir = process.env.SEO_OUT_DIR || path.join(root, 'dist');
  const result = generate(outDir);
  console.log(`Wrote ${result.pages.length} topic pages to ${outDir}`);
}

module.exports = { generate, STATIC_URLS, SITE };
