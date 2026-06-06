const LESSON_CHUNK_SIZE = 10;
const VOCAB_LESSONS = Object.entries(GRADE_WORDS).flatMap(([grade, words]) => {
  return Array.from({ length: Math.ceil(words.length / LESSON_CHUNK_SIZE) }, (_, index) => {
    const start = index * LESSON_CHUNK_SIZE;
    const lessonWords = words.slice(start, start + LESSON_CHUNK_SIZE);
    return {
      id: `grade${grade}-${index + 1}`,
      grade: Number(grade),
      kind: 'vocabulary',
      story: typeof getStorySceneForLesson === 'function' ? getStorySceneForLesson(Number(grade), index) : null,
      title: `Grade ${grade}: Lesson ${index + 1}`,
      description: `Practice Latin vocabulary words ${start + 1}-${start + lessonWords.length}.`,
      words: lessonWords
    };
  });
});
const LESSONS = [
  ...(typeof GRAMMAR_LESSONS !== 'undefined' ? GRAMMAR_LESSONS : []),
  ...VOCAB_LESSONS
];

const ENDING_HINTS = [
  { suffix: 'arum', hint: 'In first-declension nouns, -arum means “of the ___s” for many feminine items.' },
  { suffix: 'ae', hint: 'In first-declension nouns, -ae can mean “of the ___” or “the ___s.”' },
  { suffix: 'am', hint: 'In first-declension nouns, -am marks the direct object: “the ___” as the receiver of the action.' },
  { suffix: 'a', hint: 'In first-declension nouns, -a is the basic subject form: “the ___” performs the action.' },
  { suffix: 'orum', hint: 'In second-declension nouns, -orum means “of the ___s” for masculine or neuter items.' },
  { suffix: 'us', hint: 'In second-declension masculine nouns, -us is the subject form for one person or thing.' },
  { suffix: 'i', hint: 'In second-declension nouns, -i may mean “of the ___” or “the ___s.”' },
  { suffix: 'um', hint: 'In second-declension nouns, -um can mark the object or a neuter subject.' },
  { suffix: 'is', hint: 'In noun forms, -is often means “to/for the ___s” or “by/with the ___s.” In verbs, it can also be a plural ending.' },
  { suffix: 'amus', hint: 'In first-conjugation verbs, -amus means “we ___.”' },
  { suffix: 'atis', hint: 'In first-conjugation verbs, -atis means “you all ___.”' },
  { suffix: 'at', hint: 'In first-conjugation verbs, -at means “he/she ___.”' },
  { suffix: 'as', hint: 'In first-conjugation verbs, -as means “you ___” (singular).' },
  { suffix: 'eo', hint: 'In second-conjugation verbs, -eo means “I ___.”' },
  { suffix: 'emus', hint: 'In second-conjugation verbs, -emus means “we ___.”' },
  { suffix: 'etis', hint: 'In second-conjugation verbs, -etis means “you all ___.”' },
  { suffix: 'et', hint: 'In second-conjugation verbs, -et means “he/she ___.”' },
  { suffix: 'es', hint: 'In second-conjugation verbs, -es means “you ___” (singular).' }
];

const AppState = {
  studentName: '',
  grade: null,
  selectedLesson: null,
  currentQuestionIndex: 0,
  selectedOption: null,
  answerChecked: false,
  currentLessonCorrect: 0,
  progress: {
    points: 0,
    lessons: {},
    wordsMastered: {}
  }
};

const pages = {
  welcome: document.getElementById('welcomePage'),
  signup: document.getElementById('signupPage'),
  grade: document.getElementById('gradePage'),
  lessonList: document.getElementById('lessonListPage'),
  lesson: document.getElementById('lessonPage'),
  dashboard: document.getElementById('dashboardPage')
};

const elements = {
  startButton: document.getElementById('startButton'),
  signupNextButton: document.getElementById('signupNextButton'),
  studentNameInput: document.getElementById('studentNameInput'),
  gradeGrid: document.getElementById('gradeGrid'),
  lessonCards: document.getElementById('lessonCards'),
  lessonTitle: document.getElementById('lessonTitle'),
  lessonDescription: document.getElementById('lessonDescription'),
  storyScene: document.getElementById('storyScene'),
  lessonNotes: document.getElementById('lessonNotes'),
  wordPreview: document.getElementById('wordPreview'),
  questionArea: document.getElementById('questionArea'),
  nextQuestionButton: document.getElementById('nextQuestionButton'),
  lessonResult: document.getElementById('lessonResult'),
  lessonListTitle: document.getElementById('lessonListTitle'),
  lessonListSubtitle: document.getElementById('lessonListSubtitle'),
  changeGradeButton: document.getElementById('changeGradeButton'),
  objectivesCard: document.getElementById('objectivesCard'),
  backToLessons: document.getElementById('backToLessons'),
  homeButton: document.getElementById('homeButton'),
  dashboardButton: document.getElementById('dashboardButton'),
  backToLessonsFromDashboard: document.getElementById('backToLessonsFromDashboard'),
  endingHint: document.getElementById('endingHint'),
  pointsValue: document.getElementById('pointsValue'),
  lessonsCompleteValue: document.getElementById('lessonsCompleteValue'),
  wordsMasteredValue: document.getElementById('wordsMasteredValue'),
  progressList: document.getElementById('progressList')
};

const STORAGE_KEY = 'latinLaunchpadState';
const VALID_GRADES = [3, 4, 5, 6, 7, 8];

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeProgress(progress) {
  const safeProgress = isPlainObject(progress) ? progress : {};
  return {
    points: Number.isFinite(safeProgress.points) ? safeProgress.points : 0,
    lessons: isPlainObject(safeProgress.lessons) ? safeProgress.lessons : {},
    wordsMastered: isPlainObject(safeProgress.wordsMastered) ? safeProgress.wordsMastered : {}
  };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
  } catch (error) {
    console.warn('Unable to save Latin Launchpad progress.', error);
  }
}

function loadState() {
  let storedState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    storedState = JSON.parse(stored);
  } catch (error) {
    console.warn('Stored Latin Launchpad progress was invalid and has been reset.', error);
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  if (!isPlainObject(storedState)) return;
  AppState.studentName = typeof storedState.studentName === 'string' ? storedState.studentName : '';
  AppState.grade = VALID_GRADES.includes(storedState.grade) ? storedState.grade : null;
  AppState.selectedLesson = typeof storedState.selectedLesson === 'string' ? storedState.selectedLesson : null;
  AppState.currentQuestionIndex = Number.isInteger(storedState.currentQuestionIndex)
    ? Math.max(0, storedState.currentQuestionIndex)
    : 0;
  AppState.selectedOption = typeof storedState.selectedOption === 'string' ? storedState.selectedOption : null;
  AppState.answerChecked = false;
  AppState.currentLessonCorrect = Number.isInteger(storedState.currentLessonCorrect)
    ? Math.max(0, storedState.currentLessonCorrect)
    : 0;
  AppState.progress = normalizeProgress(storedState.progress);
}

function showPage(page) {
  if (!pages[page]) {
    console.warn(`showPage called with unknown page: ${page}`);
    return;
  }
  Object.values(pages).forEach((section) => section.classList.remove('active'));
  pages[page].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function init() {
  loadState();
  if (AppState.studentName && AppState.grade) {
    renderLessonList();
    showPage('lessonList');
  } else {
    showPage('welcome');
  }
  renderGradeOptions();
  renderDashboard();
}

function renderGradeOptions() {
  elements.gradeGrid.innerHTML = '';
  VALID_GRADES.forEach((grade) => {
    const button = document.createElement('button');
    button.className = 'grade-option';
    button.textContent = `Grade ${grade}`;
    if (AppState.grade === grade) button.classList.add('selected');
    button.addEventListener('click', () => selectGrade(grade));
    elements.gradeGrid.appendChild(button);
  });
}

function selectGrade(grade) {
  AppState.grade = grade;
  saveState();
  renderGradeOptions();
  renderLessonList();
  showPage('lessonList');
}

function renderLessonList() {
  if (!VALID_GRADES.includes(AppState.grade)) {
    elements.lessonListTitle.textContent = 'Choose your grade';
    elements.lessonListSubtitle.textContent = 'Pick a grade before starting a lesson.';
    elements.lessonCards.innerHTML = '';
    showPage(AppState.studentName ? 'grade' : 'signup');
    return;
  }
  const lessons = LESSONS.filter((lesson) => lesson.grade === AppState.grade);
  elements.lessonListTitle.textContent = `Grade ${AppState.grade} Lessons`;
  elements.lessonListSubtitle.textContent = `Pick a lesson to practice Latin vocabulary and grammar.`;
  renderObjectives();
  elements.lessonCards.innerHTML = '';
  lessons.forEach((lesson) => {
    const storyTag = lesson.story
      ? `<span class="lesson-story-tag">${escapeHtml(lesson.story.englishTitle)}</span>`
      : '';
    const grammarTag = lesson.kind === 'grammar'
      ? '<span class="lesson-kind-tag">Grammar</span>'
      : '';
    const tagsHtml = grammarTag || storyTag
      ? `<div class="lesson-card-tags">${grammarTag}${storyTag}</div>`
      : '';
    const card = document.createElement('div');
    card.className = 'lesson-card-item';
    if (lesson.kind === 'grammar') card.classList.add('grammar-lesson');
    card.innerHTML = `
      <div>
        <h3>${lesson.title}</h3>
        <p>${lesson.description}</p>
        ${tagsHtml}
      </div>
      <div><strong>${getLessonCountLabel(lesson)}</strong></div>
    `;
    card.addEventListener('click', () => openLesson(lesson.id));
    elements.lessonCards.appendChild(card);
  });
}

function getLessonCountLabel(lesson) {
  const count = lesson.words.length;
  if (lesson.kind === 'grammar') {
    return `${count} ${count === 1 ? 'question' : 'questions'}`;
  }
  return `${count} ${count === 1 ? 'word' : 'words'}`;
}

function renderObjectives() {
  if (!elements.objectivesCard) return;
  const objectives = typeof LEARNING_OBJECTIVES !== 'undefined' ? LEARNING_OBJECTIVES[AppState.grade] : null;
  if (!objectives) {
    elements.objectivesCard.innerHTML = '';
    return;
  }
  const goalsHtml = objectives.goals.map((goal) => `<li>${goal}</li>`).join('');
  elements.objectivesCard.innerHTML = `
    <div class="objectives-header">
      <span class="objectives-eyebrow">Grade ${AppState.grade} • ${objectives.theme}</span>
      <h3>What you'll learn this year</h3>
      <p>${objectives.intro}</p>
    </div>
    <ul class="objectives-list">${goalsHtml}</ul>
  `;
}

function openLesson(lessonId) {
  const lesson = LESSONS.find((item) => item.id === lessonId);
  if (!lesson) return;
  AppState.selectedLesson = lessonId;
  AppState.currentQuestionIndex = 0;
  AppState.selectedOption = null;
  AppState.answerChecked = false;
  AppState.currentLessonCorrect = 0;
  saveState();
  renderLesson();
  showPage('lesson');
}

function renderLesson() {
  const lesson = LESSONS.find((item) => item.id === AppState.selectedLesson);
  if (!lesson) return;
  elements.lessonTitle.textContent = lesson.title;
  elements.lessonDescription.textContent = lesson.description;
  renderStoryScene(lesson.story);
  renderLessonNotes(lesson);
  elements.wordPreview.innerHTML = lesson.words
    .map((word) => {
      const label = word.preview || word.latin;
      const answer = word.previewAnswer || word.english;
      const emoji = word.emoji ? `${escapeHtml(word.emoji)} ` : '';
      return `
      <div class="word-badge">
        <span>${emoji}${escapeHtml(label)}</span>
        <strong>${escapeHtml(answer)}</strong>
      </div>
    `;
    })
    .join('');
  renderQuestion();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderLessonNotes(lesson) {
  if (!elements.lessonNotes) return;
  const focusItems = Array.isArray(lesson.focus)
    ? lesson.focus.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
    : '';
  const sourceNote = lesson.sourceNote
    ? `<p class="lesson-source">${escapeHtml(lesson.sourceNote)}</p>`
    : '';

  if (!focusItems && !sourceNote) {
    elements.lessonNotes.innerHTML = '';
    return;
  }

  elements.lessonNotes.innerHTML = `
    <section class="lesson-notes-panel">
      ${sourceNote}
      ${focusItems ? `<ul>${focusItems}</ul>` : ''}
    </section>
  `;
}


function renderStoryScene(story) {
  if (!elements.storyScene) return;
  if (!story) {
    elements.storyScene.innerHTML = '';
    return;
  }
  const listenItems = story.listenFor.map((word) => `<li>${escapeHtml(word)}</li>`).join('');
  const icons = story.visual.icons
    .map((icon) => `<span aria-hidden="true">${escapeHtml(icon)}</span>`)
    .join('');
  elements.storyScene.innerHTML = `
    <section class="story-scene-panel" style="--scene-bg: ${escapeHtml(story.visual.bg)}; --scene-accent: ${escapeHtml(story.visual.accent)};">
      <div class="story-visual" role="img" aria-label="${escapeHtml(story.pictureCue)}">
        ${icons}
      </div>
      <div class="story-copy">
        <span class="story-eyebrow">Story scene</span>
        <h3>${escapeHtml(story.title)}</h3>
        <p>${escapeHtml(story.summary)}</p>
        <p class="latin-cue"><strong>${escapeHtml(story.latinCue)}</strong> ${escapeHtml(story.englishCue)}</p>
        <div class="story-meta">
          <div>
            <h4>Listen for</h4>
            <ul>${listenItems}</ul>
          </div>
          <div>
            <h4>Picture cue</h4>
            <p>${escapeHtml(story.pictureCue)}</p>
          </div>
        </div>
        <a class="story-link" href="${escapeHtml(story.sourceUrl)}" target="_blank" rel="noopener">Read the full story</a>
      </div>
    </section>
  `;
}

function getEndingHint(latin) {
  const lower = latin.toLowerCase();
  for (const entry of ENDING_HINTS) {
    if (lower.endsWith(entry.suffix)) {
      return entry.hint;
    }
  }
  return '';
}

function renderEndingHint(question) {
  const generatedHint = question.hint ? '' : getEndingHint(question.latin);
  const hint = question.hint || generatedHint;
  if (hint) {
    const heading = question.hint ? 'Grammar hint' : 'Ending hint';
    elements.endingHint.innerHTML = `
      <div class="ending-hint-card">
        <strong>${heading}</strong>
        <p>${escapeHtml(hint)}</p>
      </div>
    `;
  } else {
    elements.endingHint.innerHTML = '';
  }
}

function renderQuestion() {
  const lesson = LESSONS.find((item) => item.id === AppState.selectedLesson);
  if (!lesson) return;
  const question = lesson.words[AppState.currentQuestionIndex];
  if (!question) {
    completeLesson(lesson);
    return;
  }
  const choices = createChoices(question, lesson.words);
  AppState.answerChecked = false;
  AppState.selectedOption = null;
  const promptHtml = question.prompt
    ? escapeHtml(question.prompt)
    : `What does <span>${escapeHtml(question.latin)}</span> mean?`;
  const contextHtml = question.context
    ? `<p class="question-context">${escapeHtml(question.context)}</p>`
    : '';
  elements.questionArea.innerHTML = `
    <div class="question-card">
      <p><strong>Question ${AppState.currentQuestionIndex + 1}/${lesson.words.length}</strong></p>
      ${contextHtml}
      <h3>${promptHtml}</h3>
      <div class="options-grid" id="optionsGrid"></div>
    </div>
  `;
  const optionsGrid = document.getElementById('optionsGrid');
  choices.forEach((choice) => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.textContent = choice;
    button.addEventListener('click', () => selectOption(choice));
    optionsGrid.appendChild(button);
  });
  renderEndingHint(question);
  elements.nextQuestionButton.textContent = 'Check answer';
  elements.nextQuestionButton.disabled = false;
  elements.lessonResult.textContent = '';
  saveState();
}

function createChoices(question, words) {
  const target = question.english;
  if (Array.isArray(question.choices) && question.choices.length > 0) {
    return Array.from(new Set([target, ...question.choices].filter(Boolean)))
      .sort(() => Math.random() - 0.5);
  }

  const uniqueChoices = Array.from(new Set(words.map((item) => item.english)));
  const distractorPool = uniqueChoices.filter((text) => text !== target);
  const choices = [target];

  while (choices.length < 4 && distractorPool.length > 0) {
    const index = Math.floor(Math.random() * distractorPool.length);
    choices.push(distractorPool.splice(index, 1)[0]);
  }

  if (choices.length < 4) {
    const fallbackPool = Array.from(
      new Set(
        Object.values(GRADE_WORDS)
          .flat()
          .map((item) => item.english)
          .filter((text) => text !== target && !choices.includes(text))
      )
    );
    while (choices.length < 4 && fallbackPool.length > 0) {
      const index = Math.floor(Math.random() * fallbackPool.length);
      choices.push(fallbackPool.splice(index, 1)[0]);
    }
  }

  return choices.sort(() => Math.random() - 0.5);
}

function selectOption(value) {
  if (AppState.answerChecked) return;
  AppState.selectedOption = value;
  const buttons = document.querySelectorAll('.option-button');
  buttons.forEach((button) => {
    button.classList.toggle('selected', button.textContent === value);
  });
}

function checkAnswer() {
  const lesson = LESSONS.find((item) => item.id === AppState.selectedLesson);
  if (!lesson || AppState.answerChecked) return;
  const question = lesson.words[AppState.currentQuestionIndex];
  if (!question) return;
  if (!AppState.selectedOption) {
    elements.lessonResult.textContent = 'Choose an answer before moving on.';
    return;
  }
  const correct = AppState.selectedOption === question.english;
  const optionButtons = document.querySelectorAll('.option-button');
  optionButtons.forEach((button) => {
    if (button.textContent === question.english) button.classList.add('correct');
    if (button.textContent === AppState.selectedOption && !correct) button.classList.add('wrong');
    button.disabled = true;
  });
  const resultText = correct
    ? `Great job! ${question.latin} means ${question.english}.`
    : `Not quite — ${question.latin} means ${question.english}.`;
  elements.lessonResult.textContent = question.explanation
    ? `${correct ? 'Great job!' : 'Not quite.'} Correct answer: ${question.english}. ${question.explanation}`
    : resultText;
  if (correct) {
    AppState.currentLessonCorrect += 1;
    awardPoints(10);
    markWordMastered(question.masteryKey || question.latin);
  }
  AppState.answerChecked = true;
  saveState();
  elements.nextQuestionButton.textContent =
    AppState.currentQuestionIndex < lesson.words.length - 1 ? 'Next question' : 'Finish lesson';
}

function nextQuestion() {
  const lesson = LESSONS.find((item) => item.id === AppState.selectedLesson);
  if (!lesson) return;
  if (!AppState.answerChecked) {
    checkAnswer();
    return;
  }
  if (AppState.currentQuestionIndex < lesson.words.length - 1) {
    AppState.currentQuestionIndex += 1;
    AppState.selectedOption = null;
    AppState.answerChecked = false;
    renderQuestion();
  } else {
    completeLesson(lesson);
  }
}

function awardPoints(amount) {
  AppState.progress.points += amount;
  saveState();
  renderDashboard();
}

function markWordMastered(word) {
  AppState.progress.wordsMastered[word] = true;
  saveState();
}

function completeLesson(lesson) {
  const score = AppState.currentLessonCorrect;
  const previous = AppState.progress.lessons[lesson.id];
  AppState.progress.lessons[lesson.id] = {
    completedAt: new Date().toISOString(),
    score: Math.max(previous?.score ?? 0, score),
    lastScore: score,
    maxScore: lesson.words.length
  };
  AppState.answerChecked = false;
  AppState.selectedOption = null;
  saveState();
  renderDashboard();
  elements.lessonResult.textContent = `Lesson complete! You scored ${score}/${lesson.words.length}.`;
  elements.lessonListSubtitle.textContent = `Nice work, ${AppState.studentName}!`;
  setTimeout(() => {
    renderLessonList();
    showPage('lessonList');
  }, 1200);
}

function renderDashboard() {
  elements.pointsValue.textContent = AppState.progress.points;
  const lessonsCompleted = Object.keys(AppState.progress.lessons).length;
  elements.lessonsCompleteValue.textContent = lessonsCompleted;
  elements.wordsMasteredValue.textContent = Object.keys(AppState.progress.wordsMastered).length;
  const visibleLessons = VALID_GRADES.includes(AppState.grade)
    ? LESSONS.filter((lesson) => lesson.grade === AppState.grade)
    : LESSONS;
  elements.progressList.innerHTML = visibleLessons.map((lesson) => {
    const lessonProgress = AppState.progress.lessons[lesson.id];
    const status = lessonProgress
      ? `Complete · best ${lessonProgress.score}/${lessonProgress.maxScore ?? lesson.words.length}`
      : 'Not started';
    return `
      <div class="progress-item">
        <h3>${lesson.title}</h3>
        <p>Grade ${lesson.grade} • ${status}</p>
      </div>
    `;
  }).join('');
}

function showLessonListOrOnboarding() {
  if (!AppState.studentName) {
    showPage('signup');
    return;
  }
  if (!VALID_GRADES.includes(AppState.grade)) {
    showPage('grade');
    return;
  }
  renderLessonList();
  showPage('lessonList');
}

function setupEvents() {
  elements.startButton.addEventListener('click', () => showPage('signup'));
  elements.signupNextButton.addEventListener('click', () => {
    const name = elements.studentNameInput.value.trim();
    if (!name) return;
    AppState.studentName = name;
    saveState();
    showPage('grade');
  });
  elements.changeGradeButton.addEventListener('click', () => {
    showPage('grade');
  });
  elements.backToLessons.addEventListener('click', () => {
    showLessonListOrOnboarding();
  });
  elements.homeButton.addEventListener('click', () => showPage('welcome'));
  elements.dashboardButton.addEventListener('click', () => {
    if (!AppState.studentName) {
      showPage('signup');
      return;
    }
    if (!VALID_GRADES.includes(AppState.grade)) {
      showPage('grade');
      return;
    }
    renderDashboard();
    showPage('dashboard');
  });
  elements.backToLessonsFromDashboard.addEventListener('click', () => {
    showLessonListOrOnboarding();
  });
  elements.nextQuestionButton.addEventListener('click', nextQuestion);
}

window.addEventListener('DOMContentLoaded', () => {
  init();
  setupEvents();
});
