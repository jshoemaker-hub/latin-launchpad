const CURRICULUM_LEVELS = [
  { grade: 3, year: 1, label: 'Year 1', shortLabel: 'Y1', book: 'First Form Latin', lessonGrades: [3] },
  { grade: 4, year: 2, label: 'Year 2', shortLabel: 'Y2', book: 'Second Form Latin', lessonGrades: [4] },
  { grade: 5, year: 3, label: 'Year 3', shortLabel: 'Y3', book: 'Third Form Latin', lessonGrades: [5] },
  { grade: 6, year: 4, label: 'Year 4', shortLabel: 'Y4', book: 'Advanced Latin', lessonGrades: [6, 7, 8] }
];

function getCurriculumLevelByGrade(grade) {
  const numericGrade = Number(grade);
  return CURRICULUM_LEVELS.find((level) => level.grade === numericGrade)
    || CURRICULUM_LEVELS.find((level) => level.lessonGrades.includes(numericGrade))
    || null;
}

function normalizeCurriculumGrade(grade) {
  const level = getCurriculumLevelByGrade(grade);
  return level ? level.grade : null;
}

function getCurriculumGradesForSelection(grade) {
  const level = getCurriculumLevelByGrade(grade);
  return level ? level.lessonGrades : [];
}

function isYearFourReferenceVocabularyWord(word) {
  return Array.isArray(word?.sourceImages)
    && word.sourceImages.some((image) => /^IMG_253[1-8]\.jpeg$/.test(image));
}

function getVocabularyWordsForCurriculumLevel(level) {
  if (!level) return [];
  const baseWords = level.lessonGrades.flatMap((grade) => GRADE_WORDS[grade] || []);
  if (level.year === 4) {
    const yearFourReferenceWords = (GRADE_WORDS[5] || []).filter(isYearFourReferenceVocabularyWord);
    return [...baseWords, ...yearFourReferenceWords];
  }
  return baseWords.filter((word) => !isYearFourReferenceVocabularyWord(word));
}

function getCurriculumGradesThroughSelection(grade) {
  const level = getCurriculumLevelByGrade(grade);
  if (!level) return [];
  return CURRICULUM_LEVELS
    .filter((candidate) => candidate.year <= level.year)
    .flatMap((candidate) => candidate.lessonGrades);
}

function getLessonLevelName(grade) {
  const level = getCurriculumLevelByGrade(grade);
  return level ? level.label : `Grade ${grade}`;
}

function getLessonDisplayTitle(lesson) {
  if (!lesson?.title) return '';
  return String(lesson.title).replace(
    /^Grade\s+\d+\b/i,
    getLessonLevelName(lesson.grade)
  );
}

function getCurriculumLevelTitle(grade) {
  const level = getCurriculumLevelByGrade(grade);
  return level ? `${level.label}: ${level.book}` : 'Latin practice';
}

function getLessonsForSelection(grade) {
  const grades = new Set(getCurriculumGradesForSelection(grade));
  return LESSONS.filter((lesson) => grades.has(lesson.grade));
}

const LESSON_CHUNK_SIZE = 10;

function getVocabLessonNumber(grade, indexWithinGrade) {
  const level = getCurriculumLevelByGrade(grade);
  const grades = level ? level.lessonGrades : [Number(grade)];
  let offset = 0;
  for (const earlier of grades) {
    if (Number(earlier) >= Number(grade)) break;
    offset += Math.ceil((GRADE_WORDS[earlier] || []).length / LESSON_CHUNK_SIZE);
  }
  return offset + Number(indexWithinGrade) + 1;
}

const VOCAB_LESSONS = Object.entries(GRADE_WORDS).flatMap(([grade, words]) => {
  return Array.from({ length: Math.ceil(words.length / LESSON_CHUNK_SIZE) }, (_, index) => {
    const start = index * LESSON_CHUNK_SIZE;
    const lessonWords = words.slice(start, start + LESSON_CHUNK_SIZE);
    const phrases = typeof getPhraseFocusForLesson === 'function'
      ? getPhraseFocusForLesson(Number(grade), lessonWords)
      : [];
    const phraseQuestions = typeof getPhraseQuestionsForLesson === 'function'
      ? getPhraseQuestionsForLesson(phrases)
      : [];
    return {
      id: `grade${grade}-${index + 1}`,
      grade: Number(grade),
      kind: 'vocabulary',
      story: typeof getStorySceneForLesson === 'function' ? getStorySceneForLesson(Number(grade), index) : null,
      culture: typeof getCultureCardForLesson === 'function'
        ? getCultureCardForLesson(Number(grade), lessonWords, index)
        : null,
      classroomPhrases: typeof getClassroomPhrasesForLesson === 'function'
        ? getClassroomPhrasesForLesson(Number(grade), index)
        : [],
      title: `${getLessonLevelName(Number(grade))}: Lesson ${getVocabLessonNumber(grade, index)}`,
      description: phrases.length > 0
        ? `Practice Latin vocabulary words ${start + 1}-${start + lessonWords.length}, then connect them to popular Latin phrases.`
        : `Practice Latin vocabulary words ${start + 1}-${start + lessonWords.length}.`,
      vocabularyWords: lessonWords,
      phrases,
      words: [...lessonWords, ...phraseQuestions]
    };
  });
});

const grammarStoryIndexByGrade = {};
const GRAMMAR_LESSONS_WITH_STORIES = (typeof GRAMMAR_LESSONS !== 'undefined' ? GRAMMAR_LESSONS : []).map((lesson) => {
  const storyIndex = grammarStoryIndexByGrade[lesson.grade] || 0;
  grammarStoryIndexByGrade[lesson.grade] = storyIndex + 1;
  return {
    ...lesson,
    story: lesson.story || (
      typeof getStorySceneForLesson === 'function'
        ? getStorySceneForLesson(lesson.grade, storyIndex)
        : null
    )
  };
});

const LESSONS = [
  ...GRAMMAR_LESSONS_WITH_STORIES,
  ...VOCAB_LESSONS
];

const ENDING_HINTS = [
  { suffix: 'arum', hint: 'In first-declension nouns, -arum means “of the ___s” for many feminine items.' },
  { suffix: 'orum', hint: 'In second-declension nouns, -orum means “of the ___s” for masculine or neuter items.' },
  { suffix: 'amus', hint: 'In first-conjugation verbs, -amus means “we ___.”' },
  { suffix: 'atis', hint: 'In first-conjugation verbs, -atis means “you all ___.”' },
  { suffix: 'emus', hint: 'In second-conjugation verbs, -emus means “we ___.”' },
  { suffix: 'etis', hint: 'In second-conjugation verbs, -etis means “you all ___.”' },
  { suffix: 'ae', hint: 'In first-declension nouns, -ae can mean “of the ___” or “the ___s.”' },
  { suffix: 'am', hint: 'In first-declension nouns, -am marks the direct object: “the ___” as the receiver of the action.' },
  { suffix: 'us', hint: 'In second-declension nouns, -us is the subject form for one person or thing.' },
  { suffix: 'um', hint: 'In second-declension nouns, -um can mark the object or a neuter subject.' },
  { suffix: 'is', hint: 'In noun forms, -is often means “to/for the ___s” or “by/with the ___s.” In verbs, it can also be a plural ending.' },
  { suffix: 'at', hint: 'In first-conjugation verbs, -at means “he/she ___.”' },
  { suffix: 'as', hint: 'In first-conjugation verbs, -as means “you ___” (singular).' },
  { suffix: 'eo', hint: 'In second-conjugation verbs, -eo means “I ___.”' },
  { suffix: 'et', hint: 'In second-conjugation verbs, -et means “he/she ___.”' },
  { suffix: 'es', hint: 'In second-conjugation verbs, -es means “you ___” (singular).' },
  { suffix: 'a', hint: 'In first-declension nouns, -a is the basic subject form: “the ___” performs the action.' },
  { suffix: 'i', hint: 'In second-declension nouns, -i may mean “of the ___” or “the ___s.”' }
];

const THIRD_NEUTER_US = new Set(['tempus', 'opus', 'vulnus', 'pectus', 'munus', 'ius', 'jus']);
const THIRD_OTHER_US = new Set(['virtus', 'salus']);
const FOURTH_DECLENSION_US = new Set(['adventus', 'aestus', 'arcus', 'crepitus', 'cursus', 'exercitus', 'gradus', 'habitus', 'motus', 'portus', 'senatus', 'sumptus', 'versus', 'domus']);
const THIRD_NOMINATIVE_IS = new Set(['civis', 'clavis', 'collis', 'hostis', 'ignis', 'iuvenis', 'martialis', 'navis', 'nobilis', 'panis', 'pelvis', 'vestis', 'vis']);
const NEUTER_PLURAL_A = new Set(['bona', 'opera']);
const GENITIVE_HEADWORD_HINTS = {
  temporis: 'Temporis is the genitive of tempus (“of the time”), not the ending that means “to/for/by/with the ___s.”',
  urbis: 'Urbis is the genitive of urbs (“of the city”), not the ending that means “to/for/by/with the ___s.”'
};

const STORAGE_KEY = 'latinLaunchpadState';
const PROFILES_STORAGE_KEY = 'latinLaunchpadProfiles';
const GRADE_STORAGE_KEY = 'latinLaunchpadGrade';
const GUEST_PROFILE_ID = 'guest';

const SUPABASE_URL = 'https://fmwdkpjetpftuuposmog.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_c7bs4AqY2ni-el3GqKxGuA_HbaUA_fJ';
const AUTH_REDIRECT_URL = 'https://latinlaunchpad.com/';
const SUPABASE_SCRIPT = 'supabase.js';
let _supabaseClient = null;
let _supabaseLoad = null;

function shouldLoadAccountClient() {
  const hash = window.location.hash || '';
  if (hash.includes('access_token') || hash.includes('type=recovery') || hash.includes('error_description')) return true;
  if (isEmailAccount()) return true;
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index) || '';
      if (/^sb-.+-auth-token$/.test(key) && (localStorage.getItem(key) || '').includes('access_token')) return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

function ensureSupabase() {
  if (window.supabase) return Promise.resolve(window.supabase);
  if (_supabaseLoad) return _supabaseLoad;
  _supabaseLoad = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SUPABASE_SCRIPT;
    script.async = true;
    script.onload = () => resolve(window.supabase);
    script.onerror = () => {
      _supabaseLoad = null;
      reject(new Error('Account library failed to load'));
    };
    document.head.appendChild(script);
  });
  return _supabaseLoad;
}

function getSupabase() {
  if (window.supabase && !_supabaseClient) {
    _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabaseClient;
}

async function getSupabaseAsync() {
  try {
    await ensureSupabase();
  } catch (error) {
    console.warn('Account library failed to load.', error);
    return null;
  }
  return getSupabase();
}
const VALID_GRADES = CURRICULUM_LEVELS.map((level) => level.grade);
const FLASHCARD_SESSION_DURATIONS = [300, 600, 900];
const PUZZLE_CACHE = new Map();
const QUESTION_COUNT_OPTIONS = [10, 25, 50, 100];
const REVIEW_LESSON_ID = 'review-queue';
const ASSESSMENT_TYPE_LABELS = {
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  phrase: 'Phrases'
};

const BADGE_DEFINITIONS = [
  {
    id: 'first-lesson',
    name: 'First Lesson',
    mark: 'I',
    description: 'Complete any lesson.',
    criteria: (state) => getCompletedLessons(state).length >= 1
  },
  {
    id: 'perfect-lesson',
    name: 'Perfect Score',
    mark: 'X',
    description: 'Score every question in a lesson.',
    criteria: (state) => getCompletedLessons(state).some((entry) => entry.score >= entry.maxScore && entry.maxScore > 0)
  },
  {
    id: 'century-points',
    name: 'Century',
    mark: 'C',
    description: 'Earn 100 points.',
    criteria: (state) => state.progress.points >= 100
  },
  {
    id: 'word-builder',
    name: 'Word Builder',
    mark: 'V',
    description: 'Master 25 Latin skills.',
    criteria: (state) => Object.keys(state.progress.wordsMastered).length >= 25
  },
  {
    id: 'grammar-starter',
    name: 'Grammar Starter',
    mark: 'G',
    description: 'Complete a grammar lesson.',
    criteria: (state) => getCompletedLessonModels(state).some((lesson) => lesson.kind === 'grammar')
  },
  {
    id: 'story-scholar',
    name: 'Story Scholar',
    mark: 'S',
    description: 'Complete a story lesson.',
    criteria: (state) => getCompletedLessonModels(state).some((lesson) => lesson.story)
  },
  {
    id: 'steady-learner',
    name: 'Steady Learner',
    mark: 'L',
    description: 'Complete five lessons.',
    criteria: (state) => getCompletedLessons(state).length >= 5
  },
  {
    id: 'sentence-builder',
    name: 'Sentence Builder',
    mark: 'A',
    description: 'Complete a lesson in Arrange mode.',
    criteria: () => false
  },
  {
    id: 'translation-trailblazer',
    name: 'Translation Trailblazer',
    mark: 'T',
    description: 'Complete a lesson in Translate mode.',
    criteria: () => false
  },
  {
    id: 'latin-composer',
    name: 'Latin Composer',
    mark: 'C',
    description: 'Complete a lesson in Compose mode.',
    criteria: () => false
  },
  {
    id: 'story-explorer',
    name: 'Story Explorer',
    mark: 'R',
    description: 'Open a full Latin story from a lesson.',
    criteria: () => false
  },
  {
    id: 'picture-detective',
    name: 'Picture Detective',
    mark: 'P',
    description: 'Complete a lesson in Picture Match mode.',
    criteria: () => false
  },
  {
    id: 'seek-find-scout',
    name: 'Seek & Find Scout',
    mark: 'F',
    description: 'Find every object in a story picture mission.',
    criteria: () => false
  },
  {
    id: 'puzzle-solver',
    name: 'Puzzle Solver',
    mark: 'Z',
    description: 'Solve an online crossword or word find without revealing it.',
    criteria: () => false
  },
  {
    id: 'nle-practice',
    name: 'Exam Ready',
    mark: 'N',
    description: 'Finish an unofficial NLE practice exam.',
    criteria: (state) => Object.values(state.progress.nle?.levels || {}).some((level) => (
      Array.isArray(level.exams) && level.exams.some((exam) => exam.mode === 'exam')
    ))
  }
];

let suppressAssignmentHash = false;
let assignmentNavigationPending = false;
let assignmentFocus = null;

const AppState = {
  account: createGuestAccount(),
  studentName: '',
  grade: null,
  selectedLesson: null,
  lessonPhase: 'intro',
  lessonAttemptMode: 'lesson',
  practiceMode: 'meaning',
  productionAnswer: '',
  arrangeTokens: [],
  activeResourceTab: 'overview',
  speechAutoPlay: false,
  currentQuestionIndex: 0,
  selectedOption: null,
  answerChecked: false,
  currentLessonCorrect: 0,
  currentLessonMissed: [],
  reviewQueue: [],
  reviewTitle: '',
  progress: getDefaultProgress(),
  badges: {}
};

const AssessmentState = {
  mode: 'quiz',
  quizGrade: null,
  quizQuestionCount: 10,
  testQuestionCount: 50,
  testGrade: null,
  testLevelPinned: false,
  selectedChapterIds: new Set(),
  questions: [],
  responses: [],
  currentQuestionIndex: 0,
  selectedOption: null,
  answerChecked: false,
  correctCount: 0,
  completed: false,
  missedHeadwords: [],
  message: ''
};

const StudyState = {
  mode: 'list',
  words: [],
  index: 0,
  showingAnswer: false,
  running: false,
  shuffled: true,
  seenKeys: null,
  durationSeconds: 300,
  remainingMs: 300000,
  timerId: null,
  lastTick: 0
};

const pages = {
  welcome: document.getElementById('welcomePage'),
  home: document.getElementById('homePage'),
  account: document.getElementById('accountPage'),
  signup: document.getElementById('signupPage'),
  grade: document.getElementById('gradePage'),
  lessonList: document.getElementById('lessonListPage'),
  assessments: document.getElementById('assessmentsPage'),
  study: document.getElementById('studyPage'),
  dictionary: document.getElementById('dictionaryPage'),
  lesson: document.getElementById('lessonPage'),
  dashboard: document.getElementById('dashboardPage'),
  nle: document.getElementById('nlePage'),
  resetPassword: document.getElementById('resetPasswordPage'),
  contact: document.getElementById('contactPage'),
  codeCheck: document.getElementById('codeCheckPage')
};

const elements = {
  startButton: document.getElementById('startButton'),
  welcomeAccountButton: document.getElementById('welcomeAccountButton'),
  homeGreeting: document.getElementById('homeGreeting'),
  homeSummary: document.getElementById('homeSummary'),
  homeGradePill: document.getElementById('homeGradePill'),
  homePointsValue: document.getElementById('homePointsValue'),
  homeLessonsValue: document.getElementById('homeLessonsValue'),
  homeSkillsValue: document.getElementById('homeSkillsValue'),
  homeContinueButton: document.getElementById('homeContinueButton'),
  homeQuizButton: document.getElementById('homeQuizButton'),
  homeNextTitle: document.getElementById('homeNextTitle'),
  homeNextMeta: document.getElementById('homeNextMeta'),
  homePathList: document.getElementById('homePathList'),
  homeLessonsButton: document.getElementById('homeLessonsButton'),
  homePracticeLessons: document.getElementById('homePracticeLessons'),
  homePracticeAssessments: document.getElementById('homePracticeAssessments'),
  homePracticeStudy: document.getElementById('homePracticeStudy'),
  homePracticeDictionary: document.getElementById('homePracticeDictionary'),
  homePracticeDashboard: document.getElementById('homePracticeDashboard'),
  accountButton: document.getElementById('accountButton'),
  contactButton: document.getElementById('contactButton'),
  accountBackButton: document.getElementById('accountBackButton'),
  contactBackButton: document.getElementById('contactBackButton'),
  accountForm: document.getElementById('accountForm'),
  accountEmailInput: document.getElementById('accountEmailInput'),
  accountPasswordInput: document.getElementById('accountPasswordInput'),
  authTabSignIn: document.getElementById('authTabSignIn'),
  authTabSignUp: document.getElementById('authTabSignUp'),
  signupEligibility: document.getElementById('signupEligibility'),
  accountCreatorRole: document.getElementById('accountCreatorRole'),
  accountEligibilityConfirmation: document.getElementById('accountEligibilityConfirmation'),
  forgotPasswordButton: document.getElementById('forgotPasswordButton'),
  forgotPasswordForm: document.getElementById('forgotPasswordForm'),
  resetEmailInput: document.getElementById('resetEmailInput'),
  cancelResetButton: document.getElementById('cancelResetButton'),
  resetMessage: document.getElementById('resetMessage'),
  resetPasswordForm: document.getElementById('resetPasswordForm'),
  newPasswordInput: document.getElementById('newPasswordInput'),
  confirmPasswordInput: document.getElementById('confirmPasswordInput'),
  resetPasswordMessage: document.getElementById('resetPasswordMessage'),
  contactForm: document.getElementById('contactForm'),
  contactFormMessage: document.getElementById('contactFormMessage'),
  accountSummary: document.getElementById('accountSummary'),
  accountMessage: document.getElementById('accountMessage'),
  currentProfileTitle: document.getElementById('currentProfileTitle'),
  currentProfileDetail: document.getElementById('currentProfileDetail'),
  continueGuestButton: document.getElementById('continueGuestButton'),
  signOutButton: document.getElementById('signOutButton'),
  exportAccountButton: document.getElementById('exportAccountButton'),
  deleteAccountButton: document.getElementById('deleteAccountButton'),
  deleteAccountDialog: document.getElementById('deleteAccountDialog'),
  deleteAccountForm: document.getElementById('deleteAccountForm'),
  deleteAccountConfirmation: document.getElementById('deleteAccountConfirmation'),
  cancelDeleteAccountButton: document.getElementById('cancelDeleteAccountButton'),
  confirmDeleteAccountButton: document.getElementById('confirmDeleteAccountButton'),
  accountDataMessage: document.getElementById('accountDataMessage'),
  signupNextButton: document.getElementById('signupNextButton'),
  studentNameInput: document.getElementById('studentNameInput'),
  headerGradeSelect: document.getElementById('headerGradeSelect'),
  gradeGrid: document.getElementById('gradeGrid'),
  lessonCards: document.getElementById('lessonCards'),
  lessonTitle: document.getElementById('lessonTitle'),
  lessonDescription: document.getElementById('lessonDescription'),
  lessonPracticePanel: document.getElementById('lessonPracticePanel'),
  lessonResources: document.getElementById('lessonResources'),
  lessonResourceTabs: document.getElementById('lessonResourceTabs'),
  lessonResourcePanels: document.getElementById('lessonResourcePanels'),
  storyScene: document.getElementById('storyScene'),
  storyReader: document.getElementById('storyReader'),
  storyReaderContent: document.getElementById('storyReaderContent'),
  cultureCard: document.getElementById('cultureCard'),
  lessonNotes: document.getElementById('lessonNotes'),
  phraseFocus: document.getElementById('phraseFocus'),
  classroomLatin: document.getElementById('classroomLatin'),
  wordPreview: document.getElementById('wordPreview'),
  questionArea: document.getElementById('questionArea'),
  nextQuestionButton: document.getElementById('nextQuestionButton'),
  lessonResult: document.getElementById('lessonResult'),
  lessonListTitle: document.getElementById('lessonListTitle'),
  lessonListSubtitle: document.getElementById('lessonListSubtitle'),
  changeGradeButton: document.getElementById('changeGradeButton'),
  objectivesCard: document.getElementById('objectivesCard'),
  backToLessons: document.getElementById('backToLessons'),
  lessonPrintables: document.getElementById('lessonPrintables'),
  lessonPuzzles: document.getElementById('lessonPuzzles'),
  lessonSeekFind: document.getElementById('lessonSeekFind'),
  printArea: document.getElementById('printArea'),
  homeButton: document.getElementById('homeButton'),
  lessonsButton: document.getElementById('lessonsButton'),
  studyButton: document.getElementById('studyButton'),
  dictionaryButton: document.getElementById('dictionaryButton'),
  assessmentsButton: document.getElementById('assessmentsButton'),
  nleButton: document.getElementById('nleButton'),
  nleBackButton: document.getElementById('nleBackButton'),
  nleStage: document.getElementById('nleStage'),
  homePracticeNle: document.getElementById('homePracticeNle'),
  dashboardNleButton: document.getElementById('dashboardNleButton'),
  nleDashboardSummary: document.getElementById('nleDashboardSummary'),
  assessmentsBackButton: document.getElementById('assessmentsBackButton'),
  assessmentBuilder: document.getElementById('assessmentBuilder'),
  assessmentRunner: document.getElementById('assessmentRunner'),
  dashboardButton: document.getElementById('dashboardButton'),
  backToLessonsFromDashboard: document.getElementById('backToLessonsFromDashboard'),
  endingHint: document.getElementById('endingHint'),
  pointsValue: document.getElementById('pointsValue'),
  lessonsCompleteValue: document.getElementById('lessonsCompleteValue'),
  wordsMasteredValue: document.getElementById('wordsMasteredValue'),
  badgeSubtitle: document.getElementById('badgeSubtitle'),
  badgeGrid: document.getElementById('badgeGrid'),
  weakWordsList: document.getElementById('weakWordsList'),
  reviewWeakWordsButton: document.getElementById('reviewWeakWordsButton'),
  progressList: document.getElementById('progressList'),
  studyTitle: document.getElementById('studyTitle'),
  studySummary: document.getElementById('studySummary'),
  studyBackButton: document.getElementById('studyBackButton'),
  vocabularySearch: document.getElementById('vocabularySearch'),
  vocabularyCount: document.getElementById('vocabularyCount'),
  vocabularyList: document.getElementById('vocabularyList'),
  flashcardStage: document.getElementById('flashcardStage'),
  flashcardStart: document.getElementById('flashcardStart'),
  flashcardShuffle: document.getElementById('flashcardShuffle'),
  flashcardPrevious: document.getElementById('flashcardPrevious'),
  flashcardFlip: document.getElementById('flashcardFlip'),
  flashcardNext: document.getElementById('flashcardNext'),
  dictionaryBackButton: document.getElementById('dictionaryBackButton'),
  dictionarySearch: document.getElementById('dictionarySearch'),
  dictionaryGradeFilter: document.getElementById('dictionaryGradeFilter'),
  dictionaryCount: document.getElementById('dictionaryCount'),
  dictionaryList: document.getElementById('dictionaryList')
};

const OnlinePuzzleState = {
  lessonId: null,
  mode: 'crossword',
  crosswordDirection: 'across',
  wordFindStart: null,
  wordFindFound: new Set(),
  wordFindStatus: ''
};

const SeekFindState = {
  lessonId: null,
  found: new Set(),
  activeHintKey: null,
  status: ''
};

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getDefaultProgress() {
  return {
    points: 0,
    lessons: {},
    wordsMastered: {},
    wordStats: {}
  };
}

function createGuestAccount() {
  return {
    mode: 'guest',
    profileId: GUEST_PROFILE_ID,
    email: '',
    signedInAt: null
  };
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getEmailProfileId(email) {
  return `email:${normalizeEmail(email)}`;
}

function createEmailAccount(email, signedInAt = new Date().toISOString()) {
  const normalizedEmail = normalizeEmail(email);
  return {
    mode: 'email',
    profileId: getEmailProfileId(normalizedEmail),
    email: normalizedEmail,
    signedInAt
  };
}

function normalizeAccount(account, fallbackAccount = createGuestAccount()) {
  const safeAccount = isPlainObject(account) ? account : {};
  const email = normalizeEmail(safeAccount.email);
  if (safeAccount.mode === 'email' && isValidEmail(email)) {
    return createEmailAccount(
      email,
      typeof safeAccount.signedInAt === 'string' ? safeAccount.signedInAt : new Date().toISOString()
    );
  }

  const fallbackEmail = normalizeEmail(fallbackAccount.email);
  if (fallbackAccount.mode === 'email' && isValidEmail(fallbackEmail)) {
    return createEmailAccount(
      fallbackEmail,
      typeof fallbackAccount.signedInAt === 'string' ? fallbackAccount.signedInAt : new Date().toISOString()
    );
  }

  return createGuestAccount();
}

function normalizeProgress(progress) {
  const safeProgress = isPlainObject(progress) ? progress : {};
  return {
    points: Number.isFinite(safeProgress.points) ? safeProgress.points : 0,
    lessons: normalizeLessonProgress(safeProgress.lessons),
    wordsMastered: isPlainObject(safeProgress.wordsMastered) ? safeProgress.wordsMastered : {},
    wordStats: normalizeWordStats(safeProgress.wordStats),
    nle: typeof normalizeNleProgress === 'function' ? normalizeNleProgress(safeProgress.nle) : { levels: {} }
  };
}

function normalizeLessonProgress(lessons) {
  if (!isPlainObject(lessons)) return {};
  return Object.fromEntries(
    Object.entries(lessons).filter(([, entry]) => {
      if (!isPlainObject(entry)) return false;
      return !Number.isFinite(entry.maxScore) || entry.maxScore > 0;
    })
  );
}

function normalizeWordStats(wordStats) {
  if (!isPlainObject(wordStats)) return {};
  return Object.fromEntries(
    Object.entries(wordStats)
      .filter(([, entry]) => isPlainObject(entry))
      .map(([key, entry]) => [
        key,
        {
          latin: typeof entry.latin === 'string' ? entry.latin : key,
          english: typeof entry.english === 'string' ? entry.english : '',
          emoji: typeof entry.emoji === 'string' ? entry.emoji : '',
          attempts: Number.isFinite(entry.attempts) ? Math.max(0, entry.attempts) : 0,
          correct: Number.isFinite(entry.correct) ? Math.max(0, entry.correct) : 0,
          misses: Number.isFinite(entry.misses) ? Math.max(0, entry.misses) : 0,
          lastPracticedAt: typeof entry.lastPracticedAt === 'string' ? entry.lastPracticedAt : '',
          lastMissedAt: typeof entry.lastMissedAt === 'string' ? entry.lastMissedAt : ''
        }
      ])
  );
}

function normalizeBadges(badges) {
  if (!isPlainObject(badges)) return {};
  const badgeIds = new Set(BADGE_DEFINITIONS.map((badge) => badge.id));
  return Object.fromEntries(
    Object.entries(badges)
      .filter(([id, earnedAt]) => badgeIds.has(id) && typeof earnedAt === 'string')
  );
}

function createStateSnapshot(state = AppState, accountOverride = state.account) {
  return {
    account: normalizeAccount(accountOverride),
    studentName: typeof state.studentName === 'string' ? state.studentName : '',
    grade: normalizeCurriculumGrade(state.grade),
    selectedLesson: typeof state.selectedLesson === 'string' ? state.selectedLesson : null,
    currentQuestionIndex: Number.isInteger(state.currentQuestionIndex)
      ? Math.max(0, state.currentQuestionIndex)
      : 0,
    selectedOption: typeof state.selectedOption === 'string' ? state.selectedOption : null,
    answerChecked: Boolean(state.answerChecked),
    currentLessonCorrect: Number.isInteger(state.currentLessonCorrect)
      ? Math.max(0, state.currentLessonCorrect)
      : 0,
    progress: normalizeProgress(state.progress),
    badges: normalizeBadges(state.badges)
  };
}

function applyStoredState(storedState, fallbackAccount = createGuestAccount()) {
  if (!isPlainObject(storedState)) return;
  AppState.account = normalizeAccount(storedState.account, fallbackAccount);
  AppState.studentName = typeof storedState.studentName === 'string' ? storedState.studentName : '';
  AppState.grade = normalizeCurriculumGrade(storedState.grade);
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
  AppState.badges = normalizeBadges(storedState.badges);
}

function loadProfiles() {
  try {
    const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!stored) return {};
    const profiles = JSON.parse(stored);
    return isPlainObject(profiles) ? profiles : {};
  } catch (error) {
    console.warn('Stored Latin Launchpad profiles were invalid and have been reset.', error);
    localStorage.removeItem(PROFILES_STORAGE_KEY);
    return {};
  }
}

function saveProfiles(profiles) {
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
}

function getStoredProfile(profileId) {
  const profiles = loadProfiles();
  const profile = profiles[profileId];
  return isPlainObject(profile) ? profile : null;
}

function persistProfileSnapshot(snapshot) {
  const profiles = loadProfiles();
  profiles[snapshot.account.profileId] = snapshot;
  saveProfiles(profiles);
}

function saveState() {
  try {
    evaluateBadges();
    const snapshot = createStateSnapshot();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    persistProfileSnapshot(snapshot);
    if (isEmailAccount()) supabaseSaveState().catch(() => {});
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
  applyStoredState(storedState);
}

// ── Supabase sync ──────────────────────────────────────────────────────────

async function supabaseLoadProfile(email) {
  const db = await getSupabaseAsync();
  if (!db) return null;
  try {
    const [profileRes, progressRes, wordsRes, badgesRes] = await Promise.all([
      db.from('user_profiles').select('*').eq('email', email).single(),
      db.from('lesson_progress').select('*').eq('email', email),
      db.from('words_mastered').select('*').eq('email', email),
      db.from('badges').select('*').eq('email', email)
    ]);

    // PGRST116 = row not found — new user, that's ok
    if (profileRes.error && profileRes.error.code !== 'PGRST116') {
      console.warn('Supabase profile fetch error:', profileRes.error);
      return null;
    }

    const profile = profileRes.data;
    const progress = {
      points: profile?.points ?? 0,
      lessons: {},
      wordsMastered: {}
    };

    for (const row of progressRes.data ?? []) {
      progress.lessons[row.lesson_id] = {
        completedAt: row.completed_at,
        score: row.score ?? 0,
        lastScore: row.last_score ?? 0,
        maxScore: row.max_score ?? 0
      };
    }
    for (const row of wordsRes.data ?? []) {
      progress.wordsMastered[row.word] = true;
    }

    const badges = {};
    for (const row of badgesRes.data ?? []) {
      badges[row.badge_id] = row.earned_at;
    }

    return {
      account: createEmailAccount(email),
      studentName: profile?.student_name ?? '',
      grade: normalizeCurriculumGrade(profile?.grade),
      selectedLesson: null,
      currentQuestionIndex: 0,
      selectedOption: null,
      answerChecked: false,
      currentLessonCorrect: 0,
      progress,
      badges
    };
  } catch (err) {
    console.warn('Supabase load error:', err);
    return null;
  }
}

async function supabaseSaveState() {
  if (!isEmailAccount()) return;
  const db = await getSupabaseAsync();
  if (!db) return;
  const email = AppState.account.email;
  try {
    const progress = normalizeProgress(AppState.progress);
    const now = new Date().toISOString();

    await db.from('user_profiles').upsert({
      email,
      student_name: AppState.studentName,
      grade: AppState.grade,
      points: progress.points,
      updated_at: now
    });

    const lessonRows = Object.entries(progress.lessons).map(([lessonId, lp]) => ({
      email,
      lesson_id: lessonId,
      score: lp.score ?? 0,
      max_score: lp.maxScore ?? 0,
      last_score: lp.lastScore ?? 0,
      completed_at: lp.completedAt ?? now,
      updated_at: now
    }));
    if (lessonRows.length > 0) {
      await db.from('lesson_progress').upsert(lessonRows);
    }

    const wordRows = Object.keys(progress.wordsMastered).map((word) => ({
      email,
      word,
      mastered_at: now
    }));
    if (wordRows.length > 0) {
      await db.from('words_mastered').upsert(wordRows, { onConflict: 'email,word', ignoreDuplicates: true });
    }

    const badges = normalizeBadges(AppState.badges);
    const badgeRows = Object.entries(badges).map(([badgeId, earnedAt]) => ({
      email,
      badge_id: badgeId,
      earned_at: earnedAt
    }));
    if (badgeRows.length > 0) {
      await db.from('badges').upsert(badgeRows, { onConflict: 'email,badge_id', ignoreDuplicates: true });
    }
  } catch (err) {
    console.warn('Supabase save error:', err);
  }
}

// ── End Supabase sync ──────────────────────────────────────────────────────

function showPage(page, options = {}) {
  if (!pages[page]) {
    console.warn(`showPage called with unknown page: ${page}`);
    return;
  }
  Object.values(pages).forEach((section) => section.classList.remove('active'));
  if (page !== 'study') stopFlashcardTimer();
  if (page !== 'nle') stopNleTimer();
  else if (NleState.view === 'exam' && NleState.remainingMs > 0) startNleTimer();
  pages[page].classList.add('active');
  if (page === 'contact') window.LatinLaunchpadContact?.prepareVisibleContactForms();
  updateNavState(page);
  document.getElementById('headerNav')?.classList.remove('is-open');
  document.getElementById('headerMenuButton')?.setAttribute('aria-expanded', 'false');
  window.LatinLaunchpadAnalytics?.trackPageView(page);
  if (!options.preserveScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page !== 'nle') assignmentFocus = null;
  if (!options.skipHash) syncAssignmentHash();
}

function updateNavState(page) {
  const activeButtonByPage = {
    welcome: 'homeButton',
    home: 'homeButton',
    signup: 'lessonsButton',
    grade: 'lessonsButton',
    lessonList: 'lessonsButton',
    lesson: 'lessonsButton',
    study: 'studyButton',
    dictionary: 'dictionaryButton',
    assessments: 'assessmentsButton',
    nle: 'nleButton',
    dashboard: 'dashboardButton',
    account: 'accountButton',
    resetPassword: 'accountButton',
    contact: 'contactButton'
  };
  [
    elements.homeButton,
    elements.lessonsButton,
    elements.studyButton,
    elements.dictionaryButton,
    elements.assessmentsButton,
    elements.nleButton,
    elements.dashboardButton,
    elements.accountButton,
    elements.contactButton
  ].forEach((button) => {
    if (!button) return;
    button.classList.toggle('active', button.id === activeButtonByPage[page]);
  });
}

function isEmailAccount(state = AppState) {
  return state.account?.mode === 'email' && isValidEmail(state.account.email);
}

function getCompletedLessons(state = AppState) {
  const lessons = normalizeProgress(state.progress).lessons;
  return Object.entries(lessons)
    .filter(([, lessonProgress]) => isPlainObject(lessonProgress))
    .map(([id, lessonProgress]) => ({
      id,
      completedAt: typeof lessonProgress.completedAt === 'string' ? lessonProgress.completedAt : '',
      score: Number.isFinite(lessonProgress.score) ? lessonProgress.score : 0,
      maxScore: Number.isFinite(lessonProgress.maxScore) ? lessonProgress.maxScore : 0
    }))
    .filter((lessonProgress) => lessonProgress.completedAt || lessonProgress.score > 0);
}

function getCompletedLessonModels(state = AppState) {
  const completedIds = new Set(getCompletedLessons(state).map((lessonProgress) => lessonProgress.id));
  return LESSONS.filter((lesson) => completedIds.has(lesson.id));
}

function evaluateBadges(state = AppState) {
  const earnedBadges = normalizeBadges(state.badges);
  const badgeState = {
    ...state,
    progress: normalizeProgress(state.progress),
    badges: earnedBadges
  };
  const now = new Date().toISOString();
  const newlyEarned = [];

  BADGE_DEFINITIONS.forEach((badge) => {
    if (!earnedBadges[badge.id] && badge.criteria(badgeState)) {
      earnedBadges[badge.id] = now;
      newlyEarned.push(badge);
    }
  });

  if (state === AppState) {
    AppState.badges = earnedBadges;
  } else {
    state.badges = earnedBadges;
  }

  return newlyEarned;
}

function grantAchievement(badgeId, pointAward = 15) {
  const badge = BADGE_DEFINITIONS.find((entry) => entry.id === badgeId);
  if (!badge || AppState.badges[badgeId]) return null;
  AppState.badges[badgeId] = new Date().toISOString();
  AppState.progress.points += pointAward;
  return badge;
}

function persistAchievement(badgeId, pointAward = 15) {
  const badge = grantAchievement(badgeId, pointAward);
  if (!badge) return null;
  saveState();
  renderHome();
  renderDashboard();
  return badge;
}

function getPracticeAchievementId(mode) {
  return {
    picture: 'picture-detective',
    arrange: 'sentence-builder',
    translate: 'translation-trailblazer',
    compose: 'latin-composer'
  }[mode] || '';
}

function renderAccountControls() {
  const signedIn = isEmailAccount();
  const name = AppState.studentName || 'Learner';
  const summary = signedIn
    ? `${name} is signed in as ${AppState.account.email}.`
    : `${name} is learning as a guest.`;

  if (elements.accountSummary) elements.accountSummary.textContent = summary;
  if (elements.currentProfileTitle) {
    elements.currentProfileTitle.textContent = signedIn ? 'Email account' : 'Guest learner';
  }
  if (elements.currentProfileDetail) {
    elements.currentProfileDetail.textContent = signedIn
      ? AppState.account.email
      : 'Progress is saved on this device.';
  }
  if (elements.signOutButton) elements.signOutButton.hidden = !signedIn;
  if (elements.continueGuestButton) elements.continueGuestButton.hidden = !signedIn;
  if (elements.deleteAccountButton) elements.deleteAccountButton.hidden = !signedIn;
  if (elements.accountEmailInput && signedIn) {
    elements.accountEmailInput.value = AppState.account.email;
  }
  if (elements.studentNameInput) {
    elements.studentNameInput.value = AppState.studentName;
  }
}

function renderBadges() {
  if (!elements.badgeGrid || !elements.badgeSubtitle) return;
  const signedIn = isEmailAccount();
  evaluateBadges();
  const earnedBadges = normalizeBadges(AppState.badges);
  const earnedCount = Object.keys(earnedBadges).length;

  elements.badgeSubtitle.textContent = signedIn
    ? `${earnedCount}/${BADGE_DEFINITIONS.length} earned for ${AppState.account.email}.`
    : `${earnedCount}/${BADGE_DEFINITIONS.length} earned on this device.`;
  elements.badgeGrid.innerHTML = BADGE_DEFINITIONS.map((badge) => {
    const earnedAt = earnedBadges[badge.id];
    const earned = Boolean(earnedAt);
    return `
      <div class="badge-item${earned ? ' earned' : ' locked'}">
        <span class="badge-mark" aria-hidden="true">${escapeHtml(badge.mark)}</span>
        <div>
          <h4>${escapeHtml(badge.name)}</h4>
          <p>${escapeHtml(earned ? getBadgeDateLabel(earnedAt) : badge.description)}</p>
        </div>
      </div>
    `;
  }).join('');
}

function getBadgeDateLabel(earnedAt) {
  const earnedDate = new Date(earnedAt);
  if (Number.isNaN(earnedDate.getTime())) return 'Earned';
  return `Earned ${earnedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
}

function setAccountMessage(message, tone = 'neutral') {
  if (!elements.accountMessage) return;
  elements.accountMessage.textContent = message;
  elements.accountMessage.dataset.tone = tone;
}

function renderAfterProfileChange() {
  renderAccountControls();
  renderGradeOptions();
  if (VALID_GRADES.includes(AppState.grade)) renderLessonList();
  renderHome();
  renderDashboard();
  renderAssessments();
}

function showBestLearningPage() {
  if (!VALID_GRADES.includes(AppState.grade)) {
    showPage('welcome');
    return;
  }
  renderHome();
  showPage('home');
}

// ── Auth mode toggle ─────────────────────────────────────────────────────────

let _authMode = 'signin'; // 'signin' | 'signup'

function setAuthMode(mode) {
  _authMode = mode;
  const isSignIn = mode === 'signin';
  if (elements.authTabSignIn) {
    elements.authTabSignIn.classList.toggle('active', isSignIn);
    elements.authTabSignIn.setAttribute('aria-selected', String(isSignIn));
  }
  if (elements.authTabSignUp) {
    elements.authTabSignUp.classList.toggle('active', !isSignIn);
    elements.authTabSignUp.setAttribute('aria-selected', String(!isSignIn));
  }
  if (elements.accountForm) {
    elements.accountForm.dataset.authMode = mode;
    const submitButton = document.getElementById('emailLoginButton');
    if (submitButton) submitButton.textContent = isSignIn ? 'Sign in' : 'Create account';
  }
  if (elements.signupEligibility) elements.signupEligibility.hidden = isSignIn;
  if (elements.accountCreatorRole) {
    elements.accountCreatorRole.disabled = isSignIn;
    elements.accountCreatorRole.required = !isSignIn;
  }
  if (elements.accountEligibilityConfirmation) {
    elements.accountEligibilityConfirmation.disabled = isSignIn;
    elements.accountEligibilityConfirmation.required = !isSignIn;
  }
  // Update autocomplete hint on password field
  if (elements.accountPasswordInput) {
    elements.accountPasswordInput.setAttribute(
      'autocomplete',
      isSignIn ? 'current-password' : 'new-password'
    );
  }
  setAccountMessage('', 'neutral');
}

function showForgotPasswordForm(show) {
  if (elements.accountForm) elements.accountForm.hidden = show;
  if (elements.forgotPasswordForm) elements.forgotPasswordForm.hidden = !show;
  if (show && elements.resetEmailInput && elements.accountEmailInput) {
    elements.resetEmailInput.value = elements.accountEmailInput.value;
  }
}

// ── Email + password sign-in ─────────────────────────────────────────────────

async function signInWithEmail(email, password) {
  const normalizedEmail = normalizeEmail(email);
  if (!isValidEmail(normalizedEmail)) {
    setAccountMessage('Enter a valid email address.', 'error');
    return;
  }
  if (!password || password.length < 8) {
    setAccountMessage('Password must be at least 8 characters.', 'error');
    return;
  }

  const submitButton = document.getElementById('emailLoginButton');
  if (submitButton) submitButton.disabled = true;
  setAccountMessage('Signing in…', 'neutral');

  const db = await getSupabaseAsync();
  if (db) {
    try {
      const { data, error } = await db.auth.signInWithPassword({ email: normalizedEmail, password });
      if (error) {
        setAccountMessage(error.message || 'Sign-in failed. Check your email and password.', 'error');
        if (submitButton) submitButton.disabled = false;
        return;
      }
      // Auth success — onAuthStateChange will handle the profile load
      setAccountMessage('Signed in.', 'success');
    } catch (err) {
      console.warn('Sign-in error:', err);
      setAccountMessage('Sign-in failed. Please try again.', 'error');
    }
  } else {
    setAccountMessage('Sign-in is temporarily unavailable. Your account was not accessed.', 'error');
  }

  if (submitButton) submitButton.disabled = false;
}

// ── Email + password sign-up ─────────────────────────────────────────────────

async function signUpWithEmail(email, password) {
  const normalizedEmail = normalizeEmail(email);
  if (!isValidEmail(normalizedEmail)) {
    setAccountMessage('Enter a valid email address.', 'error');
    return;
  }
  if (!password || password.length < 8) {
    setAccountMessage('Password must be at least 8 characters.', 'error');
    return;
  }

  const submitButton = document.getElementById('emailLoginButton');
  if (submitButton) submitButton.disabled = true;
  setAccountMessage('Creating account…', 'neutral');

  const db = await getSupabaseAsync();
  if (db) {
    try {
      const { data, error } = await db.auth.signUp({
        email: normalizedEmail,
        password,
        options: { emailRedirectTo: AUTH_REDIRECT_URL }
      });
      if (error) {
        setAccountMessage(error.message || 'Sign-up failed. Please try again.', 'error');
        if (submitButton) submitButton.disabled = false;
        return;
      }
      if (data.user && !data.session) {
        // Email confirmation required
        setAccountMessage('Check your email to confirm your account, then sign in.', 'success');
      } else {
        // Auto-confirmed (e.g. email confirmations disabled in Supabase)
        setAccountMessage('Account created. Welcome!', 'success');
      }
    } catch (err) {
      console.warn('Sign-up error:', err);
      setAccountMessage('Sign-up failed. Please try again.', 'error');
    }
  } else {
    setAccountMessage('Unable to connect. Please try again later.', 'error');
  }

  if (submitButton) submitButton.disabled = false;
}

// ── Forgot / reset password ───────────────────────────────────────────────────

async function sendPasswordReset(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!isValidEmail(normalizedEmail)) {
    if (elements.resetMessage) {
      elements.resetMessage.textContent = 'Enter a valid email address.';
      elements.resetMessage.dataset.tone = 'error';
    }
    return;
  }

  const submitButton = elements.forgotPasswordForm?.querySelector('[type="submit"]');
  if (submitButton) submitButton.disabled = true;

  const db = await getSupabaseAsync();
  if (db) {
    try {
      const { error } = await db.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: AUTH_REDIRECT_URL
      });
      if (error) {
        if (elements.resetMessage) {
          elements.resetMessage.textContent = error.message || 'Could not send reset email.';
          elements.resetMessage.dataset.tone = 'error';
        }
      } else {
        if (elements.resetMessage) {
          elements.resetMessage.textContent = 'Reset link sent! Check your inbox.';
          elements.resetMessage.dataset.tone = 'success';
        }
      }
    } catch (err) {
      console.warn('Password reset error:', err);
      if (elements.resetMessage) {
        elements.resetMessage.textContent = 'Failed to send reset email. Try again.';
        elements.resetMessage.dataset.tone = 'error';
      }
    }
  } else {
    if (elements.resetMessage) {
      elements.resetMessage.textContent = 'Unable to connect. Please try again later.';
      elements.resetMessage.dataset.tone = 'error';
    }
  }

  if (submitButton) submitButton.disabled = false;
}

async function updatePassword(newPassword, confirmPassword) {
  if (newPassword !== confirmPassword) {
    if (elements.resetPasswordMessage) {
      elements.resetPasswordMessage.textContent = 'Passwords do not match.';
      elements.resetPasswordMessage.dataset.tone = 'error';
    }
    return;
  }
  if (!newPassword || newPassword.length < 8) {
    if (elements.resetPasswordMessage) {
      elements.resetPasswordMessage.textContent = 'Password must be at least 8 characters.';
      elements.resetPasswordMessage.dataset.tone = 'error';
    }
    return;
  }

  const submitButton = elements.resetPasswordForm?.querySelector('[type="submit"]');
  if (submitButton) submitButton.disabled = true;

  const db = await getSupabaseAsync();
  if (db) {
    try {
      const { error } = await db.auth.updateUser({ password: newPassword });
      if (error) {
        if (elements.resetPasswordMessage) {
          elements.resetPasswordMessage.textContent = error.message || 'Could not update password.';
          elements.resetPasswordMessage.dataset.tone = 'error';
        }
      } else {
        if (elements.resetPasswordMessage) {
          elements.resetPasswordMessage.textContent = 'Password updated! You are now signed in.';
          elements.resetPasswordMessage.dataset.tone = 'success';
        }
        setTimeout(() => showBestLearningPage(), 1500);
      }
    } catch (err) {
      console.warn('Update password error:', err);
      if (elements.resetPasswordMessage) {
        elements.resetPasswordMessage.textContent = 'Failed to update password. Try again.';
        elements.resetPasswordMessage.dataset.tone = 'error';
      }
    }
  }

  if (submitButton) submitButton.disabled = false;
}

function setAccountDataMessage(message, tone = 'neutral') {
  if (!elements.accountDataMessage) return;
  elements.accountDataMessage.textContent = message;
  elements.accountDataMessage.dataset.tone = tone;
}

function downloadJsonFile(fileName, value) {
  const blob = new Blob([`${JSON.stringify(value, null, 2)}\n`], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function exportAccountData() {
  const button = elements.exportAccountButton;
  if (button) button.disabled = true;
  setAccountDataMessage('Preparing your data export…');

  try {
    if (!isEmailAccount()) {
      downloadJsonFile('latin-launchpad-guest-data.json', {
        exportedAt: new Date().toISOString(),
        storage: 'this browser only',
        profile: createStateSnapshot()
      });
      setAccountDataMessage('Guest data downloaded.', 'success');
      return;
    }

    const db = await getSupabaseAsync();
    if (!db) throw new Error('Account service unavailable');
    const { data: userData, error: userError } = await db.auth.getUser();
    if (userError || !userData.user?.email) throw userError || new Error('No authenticated user');

    const email = userData.user.email;
    const [profile, lessons, words, badges] = await Promise.all([
      db.from('user_profiles').select('*').eq('email', email).maybeSingle(),
      db.from('lesson_progress').select('*').eq('email', email),
      db.from('words_mastered').select('*').eq('email', email),
      db.from('badges').select('*').eq('email', email)
    ]);
    const failed = [profile, lessons, words, badges].find((result) => result.error);
    if (failed) throw failed.error;

    downloadJsonFile('latin-launchpad-account-data.json', {
      exportedAt: new Date().toISOString(),
      account: {
        id: userData.user.id,
        email,
        createdAt: userData.user.created_at
      },
      profile: profile.data,
      lessonProgress: lessons.data,
      wordsMastered: words.data,
      badges: badges.data
    });
    setAccountDataMessage('Account data downloaded.', 'success');
  } catch (error) {
    console.warn('Account export error:', error);
    setAccountDataMessage('Could not export account data. Please try again.', 'error');
  } finally {
    if (button) button.disabled = false;
  }
}

function closeDeleteAccountDialog() {
  if (!elements.deleteAccountDialog?.open) return;
  elements.deleteAccountDialog.close();
  if (elements.deleteAccountConfirmation) elements.deleteAccountConfirmation.value = '';
  if (elements.confirmDeleteAccountButton) elements.confirmDeleteAccountButton.disabled = true;
}

function openDeleteAccountDialog() {
  if (!isEmailAccount() || !elements.deleteAccountDialog) return;
  if (elements.deleteAccountConfirmation) elements.deleteAccountConfirmation.value = '';
  if (elements.confirmDeleteAccountButton) elements.confirmDeleteAccountButton.disabled = true;
  elements.deleteAccountDialog.showModal();
  elements.deleteAccountConfirmation?.focus();
}

async function deleteAccount() {
  if (!isEmailAccount() || elements.deleteAccountConfirmation?.value !== 'DELETE') return;
  closeDeleteAccountDialog();

  const button = elements.deleteAccountButton;
  if (button) button.disabled = true;
  setAccountDataMessage('Deleting your account…');

  try {
    const db = await getSupabaseAsync();
    if (!db) throw new Error('Account service unavailable');
    const profileId = AppState.account.profileId;
    const { error } = await db.rpc('delete_current_account');
    if (error) throw error;

    const profiles = loadProfiles();
    delete profiles[profileId];
    saveProfiles(profiles);
    localStorage.removeItem(STORAGE_KEY);
    await db.auth.signOut({ scope: 'local' }).catch(() => {});

    const guestAccount = createGuestAccount();
    applyStoredState(getStoredProfile(GUEST_PROFILE_ID) || {}, guestAccount);
    AppState.account = guestAccount;
    saveState();
    renderAfterProfileChange();
    setAccountDataMessage('Account and synced data deleted.', 'success');
  } catch (error) {
    console.warn('Account deletion error:', error);
    setAccountDataMessage('Could not delete the account. Please try again or contact support.', 'error');
  } finally {
    if (button) button.disabled = false;
  }
}

function continueAsGuest() {
  saveState();
  const db = window.supabase ? getSupabase() : null;
  if (db) db.auth.signOut().catch(() => {});
  activateGuestProfile();
  setAccountMessage('Using guest mode.', 'success');
}

function activateGuestProfile() {
  const guestAccount = createGuestAccount();
  const existingGuestProfile = getStoredProfile(GUEST_PROFILE_ID);
  const nextState = existingGuestProfile || {
    account: guestAccount,
    studentName: '',
    grade: null,
    selectedLesson: null,
    currentQuestionIndex: 0,
    selectedOption: null,
    answerChecked: false,
    currentLessonCorrect: 0,
    progress: getDefaultProgress(),
    badges: {}
  };
  applyStoredState(nextState, guestAccount);
  AppState.account = guestAccount;
  saveState();
  renderAfterProfileChange();
}

function preserveLocalNleProgress(nextState, localSnapshot) {
  if (!nextState?.progress || !localSnapshot?.progress?.nle) return;
  if (!nextState.progress.nle) nextState.progress.nle = localSnapshot.progress.nle;
}

async function init() {
  loadState();
  renderAccountControls();
  let passwordRecoveryActive = false;

  if (shouldLoadAccountClient()) {
    await ensureSupabase().catch((error) => console.warn('Account library failed to load.', error));
  }
  const db = getSupabase();
  if (db) {
    // Set up auth listener FIRST — before getSession — so the Supabase client
    // can read and consume any #access_token hash (including recovery tokens)
    // from the URL before we do anything else with the page.
    db.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Supabase has validated the recovery token and established a session.
        // Show the set-new-password form; updateUser() will now succeed.
        passwordRecoveryActive = true;
        showPage('resetPassword');
        return;
      }

      if (event === 'SIGNED_IN' && session?.user?.email) {
        const email = session.user.email;
        const account = createEmailAccount(email);
        const remote = await supabaseLoadProfile(email);
        const existingLocal = getStoredProfile(account.profileId);
        const nextState = remote || existingLocal || createStateSnapshot(AppState, account);
        preserveLocalNleProgress(nextState, existingLocal);
        applyStoredState(nextState, account);
        AppState.account = account;
        evaluateBadges();
        saveState();
        renderAfterProfileChange();
        // Navigate home if the user was on the account or welcome page
        const currentActive = Object.entries(pages).find(([, el]) => el?.classList.contains('active'));
        if (!passwordRecoveryActive && currentActive && ['account', 'welcome'].includes(currentActive[0])) {
          showBestLearningPage();
        }
      }
      // SIGNED_OUT is handled by continueAsGuest()
    });

    // Restore an existing session for returning visitors
    const { data: { session } } = await db.auth.getSession();
    if (session?.user?.email && !isEmailAccount()) {
      const email = session.user.email;
      const account = createEmailAccount(email);
      const remote = await supabaseLoadProfile(email);
      const existingLocal = getStoredProfile(account.profileId);
      const nextState = remote || existingLocal || createStateSnapshot(AppState, account);
      preserveLocalNleProgress(nextState, existingLocal);
      applyStoredState(nextState, account);
      AppState.account = account;
      evaluateBadges();
      saveState();
      renderAfterProfileChange();
    } else if (!session && isEmailAccount()) {
      // A cached browser profile is not proof of authentication.
      activateGuestProfile();
    }
  } else if (isEmailAccount()) {
    // Fail closed if the authentication library is unavailable.
    activateGuestProfile();
  }

  if (passwordRecoveryActive) {
    showPage('resetPassword');
  } else if (VALID_GRADES.includes(AppState.grade)) {
    renderLessonList();
    renderHome();
    showPage('home', { skipHash: true });
  } else {
    showPage('welcome', { skipHash: true });
  }
  renderGradeOptions();
  renderDashboard();
  renderAssessments();
  applyAssignmentHash();
  if (!assignmentNavigationPending) syncAssignmentHash();
}

function renderGradeOptions() {
  elements.gradeGrid.innerHTML = '';
  CURRICULUM_LEVELS.forEach((level) => {
    const button = document.createElement('button');
    button.className = 'grade-option';
    button.innerHTML = `<strong>${escapeHtml(level.label)}</strong><span>${escapeHtml(level.book)}</span>`;
    if (AppState.grade === level.grade) button.classList.add('selected');
    button.addEventListener('click', () => selectGrade(level.grade));
    elements.gradeGrid.appendChild(button);
  });
  if (elements.headerGradeSelect) {
    const hasGrade = VALID_GRADES.includes(AppState.grade);
    elements.headerGradeSelect.value = hasGrade ? String(AppState.grade) : '';
    elements.headerGradeSelect.disabled = false;
    if (hasGrade) localStorage.setItem(GRADE_STORAGE_KEY, String(AppState.grade));
  }
}

function selectGrade(grade) {
  const normalizedGrade = normalizeCurriculumGrade(grade);
  if (!normalizedGrade) return;
  AppState.grade = normalizedGrade;
  AssessmentState.testLevelPinned = false;
  AssessmentState.testGrade = normalizedGrade;
  localStorage.setItem(GRADE_STORAGE_KEY, String(normalizedGrade));
  saveState();
  renderGradeOptions();
  renderLessonList();
  renderHome();
  renderAssessments();
  showPage('home');
}

function renderLessonList() {
  if (!VALID_GRADES.includes(AppState.grade)) {
    elements.lessonListTitle.textContent = 'Choose your year';
    elements.lessonListSubtitle.textContent = 'Pick a curriculum year before starting a lesson.';
    elements.lessonCards.innerHTML = '';
    showPage('grade');
    return;
  }
  const lessons = getLessonsForSelection(AppState.grade);
  elements.lessonListTitle.textContent = `${getCurriculumLevelTitle(AppState.grade)} Lessons`;
  elements.lessonListSubtitle.textContent = `Pick a lesson to practice Latin vocabulary and grammar.`;
  renderObjectives();
  elements.lessonCards.innerHTML = '';
  lessons.forEach((lesson) => {
    const storyTag = lesson.story
      ? `<span class="lesson-story-tag">${escapeHtml(lesson.story.englishTitle)}</span>`
      : '';
    const seekFindTag = getSeekFindConfig(lesson)
      ? '<span class="lesson-seek-find-tag">Seek &amp; Find</span>'
      : '';
    const grammarTag = lesson.kind === 'grammar'
      ? '<span class="lesson-kind-tag">Grammar</span>'
      : '';
    const phraseTag = getLessonPhraseCount(lesson) > 0
      ? `<span class="lesson-phrase-tag">${getLessonPhraseCount(lesson)} ${getLessonPhraseCount(lesson) === 1 ? 'phrase' : 'phrases'}</span>`
      : '';
    const tagsHtml = grammarTag || storyTag || seekFindTag || phraseTag
      ? `<div class="lesson-card-tags">${grammarTag}${storyTag}${seekFindTag}${phraseTag}</div>`
      : '';
    const card = document.createElement('div');
    card.className = 'lesson-card-item';
    if (lesson.kind === 'grammar') card.classList.add('grammar-lesson');
    card.innerHTML = `
      <div>
        <h3>${escapeHtml(getLessonDisplayTitle(lesson))}</h3>
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
  if (lesson.kind === 'grammar') {
    const count = lesson.words.length;
    return `${count} ${count === 1 ? 'question' : 'questions'}`;
  }
  const vocabularyCount = getLessonVocabularyWords(lesson).length;
  const phraseCount = getLessonPhraseCount(lesson);
  if (phraseCount > 0) {
    return `${vocabularyCount} ${vocabularyCount === 1 ? 'word' : 'words'} · ${phraseCount} ${phraseCount === 1 ? 'phrase' : 'phrases'}`;
  }
  return `${vocabularyCount} ${vocabularyCount === 1 ? 'word' : 'words'}`;
}

function getLessonVocabularyWords(lesson) {
  return Array.isArray(lesson.vocabularyWords)
    ? lesson.vocabularyWords
    : lesson.words.filter((word) => !word.isPhrase);
}

function getLessonPhraseCount(lesson) {
  return Array.isArray(lesson.phrases) ? lesson.phrases.length : 0;
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
      <span class="objectives-eyebrow">${escapeHtml(getCurriculumLevelTitle(AppState.grade))} • ${objectives.theme}</span>
      <h3>What you'll learn this year</h3>
      <p>${objectives.intro}</p>
    </div>
    <ul class="objectives-list">${goalsHtml}</ul>
  `;
}

function canSpeakLatin() {
  return typeof window !== 'undefined'
    && 'speechSynthesis' in window
    && typeof SpeechSynthesisUtterance !== 'undefined';
}

function getLatinVoice() {
  if (!canSpeakLatin()) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => voice.lang.toLowerCase().startsWith('la'))
    || voices.find((voice) => /^(it|es|fr|ro)/i.test(voice.lang))
    || null;
}

function normalizeSpeechText(value) {
  return String(value || '')
    .replace(/\//g, ' or ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSlowSpeechText(value) {
  return normalizeSpeechText(value)
    .split(/(\s+|[,.;:!?]+)/)
    .map((part) => {
      if (!/[A-Za-z]/.test(part)) return part;
      const cue = getSyllableCue(part);
      return cue ? cue.replace(/-/g, ' ... ') : part;
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function speakLatin(value, rate = 0.82) {
  const slow = rate <= 0.55;
  const text = slow ? getSlowSpeechText(value) : normalizeSpeechText(value);
  if (!text || !canSpeakLatin()) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getLatinVoice();
  utterance.lang = voice?.lang || 'la';
  utterance.rate = slow ? 0.42 : rate;
  utterance.pitch = 1;
  if (voice) utterance.voice = voice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

function speakCurrentQuestion() {
  const lesson = getSelectedLesson();
  const question = getActiveQuestions(lesson)[AppState.currentQuestionIndex];
  if (question) speakLatin(question.latin);
}

function renderSpeakButton(value, label = 'Listen', rate = 0.82) {
  const disabled = canSpeakLatin() ? '' : ' disabled';
  return `
    <button
      type="button"
      class="sound-button"
      data-speak-latin="${escapeHtml(value)}"
      data-speak-rate="${escapeHtml(rate)}"
      aria-label="Hear ${escapeHtml(value)}"
      ${disabled}
    >
      <span aria-hidden="true">${escapeHtml(label)}</span>
    </button>
  `;
}

function renderAutoPlayToggle() {
  const disabled = canSpeakLatin() ? '' : 'disabled';
  return `
    <label class="audio-toggle">
      <input type="checkbox" data-audio-autoplay ${AppState.speechAutoPlay ? 'checked' : ''} ${disabled} />
      <span>Auto-play</span>
    </label>
  `;
}

function getLessonIntroWords(lesson) {
  const vocabularyWords = getLessonVocabularyWords(lesson);
  return vocabularyWords.length > 0 ? vocabularyWords : lesson.words;
}

function getWordVisual(word) {
  return word.emoji || String(word.latin || '?').trim().charAt(0).toUpperCase() || '?';
}

function getSyllableCue(value) {
  const text = String(value || '').trim().toLowerCase();
  if (!/^[a-z]+$/.test(text) || text.length < 4) return '';

  const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
  const diphthongs = new Set(['ae', 'au', 'oe', 'ei', 'eu', 'ui']);
  const mutes = new Set(['b', 'c', 'd', 'g', 'p', 't']);
  const liquids = new Set(['l', 'r']);
  const digraphs = new Set(['qu', 'ch', 'ph', 'th', 'rh']);

  const nuclei = [];
  let index = text[0] === 'i' && vowels.has(text[1]) ? 1 : 0;
  while (index < text.length) {
    if (text.slice(index, index + 2) === 'qu') {
      index += 2;
      continue;
    }
    if (!vowels.has(text[index])) {
      index += 1;
      continue;
    }
    const pair = text.slice(index, index + 2);
    if (diphthongs.has(pair)) {
      nuclei.push([index, index + 2]);
      index += 2;
    } else {
      nuclei.push([index, index + 1]);
      index += 1;
    }
  }
  if (nuclei.length < 2) return '';

  function consonantUnits(cluster) {
    const units = [];
    for (let cursor = 0; cursor < cluster.length; cursor += 1) {
      const pair = cluster.slice(cursor, cursor + 2);
      if (digraphs.has(pair)) {
        units.push(pair);
        cursor += 1;
      } else {
        units.push(cluster[cursor]);
      }
    }
    return units;
  }

  const syllables = [];
  let cursor = 0;
  for (let nucleusIndex = 0; nucleusIndex < nuclei.length; nucleusIndex += 1) {
    if (nucleusIndex === nuclei.length - 1) {
      syllables.push(text.slice(cursor));
      break;
    }
    const cluster = text.slice(nuclei[nucleusIndex][1], nuclei[nucleusIndex + 1][0]);
    const units = consonantUnits(cluster);
    let stay = 0;
    let rest = units;
    while (rest[0] === 'x') {
      stay += 1;
      rest = rest.slice(1);
    }
    if (rest.length > 1) {
      const previous = rest[rest.length - 2];
      const last = rest[rest.length - 1];
      const muteLiquid = previous.length === 1 && last.length === 1 && mutes.has(previous) && liquids.has(last);
      stay += rest.length - (muteLiquid ? 2 : 1);
    }
    const stayLength = units.slice(0, stay).join('').length;
    const splitAt = nuclei[nucleusIndex][1] + stayLength;
    syllables.push(text.slice(cursor, splitAt));
    cursor = splitAt;
  }

  if (syllables.some((syllable) => !syllable || !/[aeiouy]/.test(syllable))) return '';
  return syllables.join('-');
}

function renderSyllableCue(value) {
  const cue = getSyllableCue(value);
  return cue ? `<p class="syllable-cue">${escapeHtml(cue)}</p>` : '';
}

function renderQuestionSoundControls(question) {
  return `
    <div class="sound-control-group">
      ${renderSpeakButton(question.latin, 'Hear')}
      ${renderSpeakButton(question.latin, 'Slow', 0.42)}
    </div>
  `;
}

function isReviewAttempt() {
  return AppState.lessonAttemptMode === 'missed-review' || AppState.lessonAttemptMode === 'weak-review';
}

function hasRealPicture(value) {
  return /\p{Extended_Pictographic}/u.test(String(value || ''));
}

function supportsPicturePractice(lesson) {
  return !isReviewAttempt()
    && lesson?.kind === 'vocabulary'
    && getLessonPictureQuestions(lesson).length >= 2;
}

function supportsArrangePractice(lesson) {
  return !isReviewAttempt() && lesson?.words.some((word) => getArrangeWordTokens(word.latin).length > 1);
}

function getLatinTokens(value) {
  return String(value || '').match(/[A-Za-zÀ-ž]+|[^\sA-Za-zÀ-ž]/g) || [];
}

function getArrangeWordTokens(value) {
  return getLatinTokens(value).filter((token) => /[A-Za-zÀ-ž]/.test(token));
}

function getArrangeQuestions(lesson) {
  return lesson.words.filter((word) => getArrangeWordTokens(word.latin).length > 1);
}

function getLessonPictureQuestions(lesson) {
  return (lesson?.words || []).filter((word) => !word.isPhrase && hasRealPicture(word.emoji));
}

function getActiveQuestions(lesson) {
  if (!lesson) return [];
  if (isReviewAttempt()) return AppState.reviewQueue;
  if (AppState.practiceMode === 'picture' && supportsPicturePractice(lesson)) {
    return getLessonPictureQuestions(lesson);
  }
  if (AppState.practiceMode === 'arrange' && supportsArrangePractice(lesson)) {
    return getArrangeQuestions(lesson);
  }
  return lesson.words;
}

function getWordKey(question) {
  return question?.masteryKey || question?.latin || '';
}

function rememberMissedQuestion(question) {
  const key = getWordKey(question);
  if (!key || AppState.currentLessonMissed.some((item) => getWordKey(item) === key)) return;
  AppState.currentLessonMissed.push(question);
}

function recordWordAttempt(question, correct) {
  const key = getWordKey(question);
  if (!key) return;
  const stats = normalizeWordStats(AppState.progress.wordStats);
  const previous = stats[key] || {};
  const now = new Date().toISOString();
  stats[key] = {
    latin: question.latin,
    english: question.previewAnswer || question.english,
    emoji: question.emoji || previous.emoji || '',
    attempts: (previous.attempts || 0) + 1,
    correct: (previous.correct || 0) + (correct ? 1 : 0),
    misses: (previous.misses || 0) + (correct ? 0 : 1),
    lastPracticedAt: now,
    lastMissedAt: correct ? (previous.lastMissedAt || '') : now
  };
  AppState.progress.wordStats = stats;
}

function getQuestionByWordKey(key) {
  for (const lesson of LESSONS) {
    const question = lesson.words.find((word) => getWordKey(word) === key || word.latin === key);
    if (question) return question;
  }
  return null;
}

function getWeakWordEntries(limit = 8) {
  const stats = normalizeWordStats(AppState.progress.wordStats);
  return Object.entries(stats)
    .map(([key, entry]) => ({ key, ...entry }))
    .filter((entry) => entry.misses > 0)
    .sort((a, b) => {
      const aNeed = a.misses - a.correct * 0.35;
      const bNeed = b.misses - b.correct * 0.35;
      return bNeed - aNeed || b.misses - a.misses || (b.lastMissedAt || '').localeCompare(a.lastMissedAt || '');
    })
    .slice(0, limit);
}

function getWeakReviewQuestions(limit = 10) {
  return getWeakWordEntries(limit)
    .map((entry) => getQuestionByWordKey(entry.key))
    .filter(Boolean);
}

function renderPracticeModeChooser(lesson) {
  return `
    <div class="practice-mode-tabs" role="tablist" aria-label="Practice mode">
      ${renderPracticeModeButton('meaning', 'Meaning quiz')}
      ${supportsPicturePractice(lesson) ? renderPracticeModeButton('picture', 'Picture match') : ''}
      ${supportsArrangePractice(lesson) ? renderPracticeModeButton('arrange', 'Arrange') : ''}
      ${renderPracticeModeButton('translate', 'Translate')}
      ${renderPracticeModeButton('compose', 'Compose')}
    </div>
  `;
}

function renderPracticeModeButton(mode, label) {
  const selected = AppState.practiceMode === mode;
  return `
    <button
      type="button"
      class="practice-mode-button${selected ? ' active' : ''}"
      role="tab"
      aria-selected="${selected ? 'true' : 'false'}"
      data-practice-mode="${escapeHtml(mode)}"
    >${escapeHtml(label)}</button>
  `;
}

function selectPracticeMode(mode) {
  const lesson = getSelectedLesson();
  if (!lesson || !['meaning', 'picture', 'arrange', 'translate', 'compose'].includes(mode)) return;
  if (mode === 'picture' && !supportsPicturePractice(lesson)) mode = 'meaning';
  if (mode === 'arrange' && !supportsArrangePractice(lesson)) mode = 'meaning';
  AppState.practiceMode = mode;
  renderWordIntroduction(lesson);
  syncAssignmentHash();
}

function getCompletionActions(missedCount) {
  const reviewButton = missedCount > 0
    ? '<button type="button" class="primary-button" data-lesson-action="start-missed-review">Review missed words</button>'
    : '';
  return `
    <div class="completion-actions">
      ${reviewButton}
      <button type="button" class="secondary-button" data-lesson-action="back-to-lessons">Back to lessons</button>
    </div>
  `;
}

function renderWordIntroduction(lesson) {
  const words = getLessonIntroWords(lesson);
  const introTitle = lesson.kind === 'grammar' ? 'Meet the patterns' : 'Meet the words';
  const cards = words.map((word) => {
    const label = word.preview || word.principalParts || word.latin;
    const answer = word.previewAnswer || word.english;
    return `
      <article class="word-intro-card">
        <span class="word-picture" aria-hidden="true">${escapeHtml(getWordVisual(word))}</span>
        <div>
          <strong>${escapeHtml(label)}</strong>
          ${word.principalParts ? `<small class="principal-parts-label">Headword: ${escapeHtml(word.latin)}</small>` : ''}
          <span>${escapeHtml(answer)}</span>
        </div>
        <div class="intro-sound-controls">
          ${renderSpeakButton(word.latin, 'Hear')}
          ${renderSpeakButton(word.latin, 'Slow', 0.42)}
        </div>
      </article>
    `;
  }).join('');

  elements.lessonPracticePanel?.classList.add('is-intro');
  elements.lessonPracticePanel?.classList.remove('is-practice', 'is-complete');
  elements.wordPreview.className = 'word-preview intro-word-preview';
  elements.wordPreview.innerHTML = `
    <section class="word-intro">
      <div class="word-intro-header">
        <div>
          <span class="section-kicker">Warm-up</span>
          <h3>${escapeHtml(introTitle)}</h3>
        </div>
        <div class="intro-practice-controls">
          ${renderPracticeModeChooser(lesson)}
          ${renderAutoPlayToggle()}
        </div>
      </div>
      <div class="word-intro-grid">${cards}</div>
    </section>
  `;
  elements.endingHint.innerHTML = '';
  elements.questionArea.innerHTML = '';
  elements.lessonResult.innerHTML = '';
  elements.lessonResult.removeAttribute('data-tone');
  elements.nextQuestionButton.hidden = false;
  elements.nextQuestionButton.disabled = false;
  const startLabels = {
    picture: 'Start picture match',
    arrange: 'Start arranging',
    translate: 'Start translating',
    compose: 'Start composing'
  };
  elements.nextQuestionButton.textContent = startLabels[AppState.practiceMode] || 'Start practice';
}

function startLessonPractice() {
  const lesson = getSelectedLesson();
  if (lesson && AppState.practiceMode === 'picture' && !supportsPicturePractice(lesson)) AppState.practiceMode = 'meaning';
  if (lesson && AppState.practiceMode === 'arrange' && !supportsArrangePractice(lesson)) AppState.practiceMode = 'meaning';
  AppState.lessonPhase = 'practice';
  AppState.currentQuestionIndex = 0;
  AppState.selectedOption = null;
  AppState.answerChecked = false;
  AppState.currentLessonCorrect = 0;
  AppState.productionAnswer = '';
  AppState.arrangeTokens = [];
  renderQuestion();
}

function renderPracticeToolbar(lesson) {
  const questions = getActiveQuestions(lesson);
  const total = questions.length;
  const progressPercent = total > 0
    ? Math.round((AppState.currentQuestionIndex / total) * 100)
    : 0;
  const label = isReviewAttempt()
    ? 'Review'
    : ({ picture: 'Picture match', arrange: 'Arrange', translate: 'Translate', compose: 'Compose' }[AppState.practiceMode] || 'Practice');
  return `
    <section class="practice-toolbar" aria-label="Practice progress">
      <div>
        <span>${escapeHtml(label)}</span>
        <strong>Question ${AppState.currentQuestionIndex + 1}/${total}</strong>
      </div>
      ${renderAutoPlayToggle()}
      <div class="practice-meter" aria-hidden="true">
        <span style="width: ${progressPercent}%;"></span>
      </div>
    </section>
  `;
}

function hasLessonOverview(lesson) {
  return Boolean(
    lesson.story
    || lesson.culture
    || lesson.sourceNote
    || (Array.isArray(lesson.focus) && lesson.focus.length > 0)
    || getLessonPhraseCount(lesson) > 0
  );
}

function getLessonResourceTabs(lesson) {
  const tabs = [];
  if (hasLessonOverview(lesson)) tabs.push({ id: 'overview', label: 'Overview' });
  if (Array.isArray(lesson.classroomPhrases) && lesson.classroomPhrases.length > 0) {
    tabs.push({ id: 'classroom', label: 'Speak Latin' });
  }
  if (getSeekFindConfig(lesson)) tabs.push({ id: 'seek-find', label: 'Seek & Find' });
  tabs.push({ id: 'printables', label: 'Printables' });
  if (getLessonPuzzleTerms(lesson).length > 0) tabs.push({ id: 'puzzles', label: 'Puzzles' });
  return tabs;
}

function renderLessonResourceTabs(lesson) {
  if (!elements.lessonResources || !elements.lessonResourceTabs || !elements.lessonResourcePanels) return;
  const tabs = getLessonResourceTabs(lesson);
  if (tabs.length === 0) {
    elements.lessonResources.hidden = true;
    return;
  }

  elements.lessonResources.hidden = false;
  if (!tabs.some((tab) => tab.id === AppState.activeResourceTab)) {
    AppState.activeResourceTab = tabs[0].id;
  }

  elements.lessonResourceTabs.innerHTML = tabs.map((tab) => {
    const active = tab.id === AppState.activeResourceTab;
    return `
      <button
        type="button"
        class="lesson-resource-tab${active ? ' active' : ''}"
        role="tab"
        aria-selected="${active ? 'true' : 'false'}"
        data-lesson-resource-tab="${escapeHtml(tab.id)}"
      >${escapeHtml(tab.label)}</button>
    `;
  }).join('');

  elements.lessonResourcePanels.querySelectorAll('[data-resource-panel]').forEach((panel) => {
    const active = panel.dataset.resourcePanel === AppState.activeResourceTab;
    panel.hidden = !active;
    panel.classList.toggle('active', active);
  });
}

function selectLessonResourceTab(tabId) {
  const lesson = getSelectedLesson();
  if (!lesson) return;
  AppState.activeResourceTab = tabId;
  renderLessonResourceTabs(lesson);
}

function openLesson(lessonId) {
  const lesson = LESSONS.find((item) => item.id === lessonId);
  if (!lesson) return;
  AppState.selectedLesson = lessonId;
  AppState.lessonPhase = 'intro';
  AppState.lessonAttemptMode = 'lesson';
  AppState.practiceMode = 'meaning';
  AppState.activeResourceTab = hasLessonOverview(lesson) ? 'overview' : 'printables';
  AppState.currentQuestionIndex = 0;
  AppState.selectedOption = null;
  AppState.answerChecked = false;
  AppState.currentLessonCorrect = 0;
  AppState.currentLessonMissed = [];
  AppState.reviewQueue = [];
  AppState.reviewTitle = '';
  if (elements.lessonResources) elements.lessonResources.open = true;
  saveState();
  renderLesson();
  showPage('lesson');
}

function renderLesson() {
  const lesson = getSelectedLesson();
  if (!lesson) return;
  elements.lessonTitle.textContent = getLessonDisplayTitle(lesson);
  elements.lessonDescription.textContent = lesson.description;
  if (lesson.id === REVIEW_LESSON_ID) {
    renderStoryScene(null);
    renderCultureCard(null);
    renderLessonNotes({});
    renderPhraseFocus({});
    renderClassroomLatin({});
    if (elements.lessonPrintables) elements.lessonPrintables.innerHTML = '';
    if (elements.lessonPuzzles) elements.lessonPuzzles.innerHTML = '';
    if (elements.lessonResources) elements.lessonResources.hidden = true;
    renderQuestion();
    return;
  }
  renderStoryScene(lesson);
  renderCultureCard(lesson.culture);
  renderLessonNotes(lesson);
  renderPhraseFocus(lesson);
  renderClassroomLatin(lesson);
  renderLessonSeekFind(lesson);
  renderLessonPrintables(lesson);
  renderLessonPuzzles(lesson);
  renderLessonResourceTabs(lesson);
  if (AppState.lessonPhase === 'practice') {
    renderQuestion();
  } else {
    renderWordIntroduction(lesson);
  }
}

function getSeekFindConfig(lesson) {
  const config = lesson?.story?.seekFind;
  return config
    && typeof config.image === 'string'
    && Array.isArray(config.targets)
    && config.targets.length > 0
      ? config
      : null;
}

function resetSeekFindState(lessonId) {
  SeekFindState.lessonId = lessonId;
  SeekFindState.found = new Set();
  SeekFindState.activeHintKey = null;
  SeekFindState.status = '';
}

function renderLessonSeekFind(lesson) {
  if (!elements.lessonSeekFind) return;
  const config = getSeekFindConfig(lesson);
  if (!config) {
    elements.lessonSeekFind.innerHTML = '';
    return;
  }

  if (SeekFindState.lessonId !== lesson.id) resetSeekFindState(lesson.id);

  const foundCount = SeekFindState.found.size;
  const total = config.targets.length;
  const complete = foundCount === total;
  const progress = Math.round((foundCount / total) * 100);
  const status = SeekFindState.status
    || 'Choose a Latin word for a clue, then tap the matching object in the picture.';

  const hotspots = config.targets.map((target) => {
    const found = SeekFindState.found.has(target.key);
    return `
      <button
        type="button"
        class="seek-find-hotspot${found ? ' found' : ''}"
        style="--hotspot-x:${Number(target.x)}%;--hotspot-y:${Number(target.y)}%;--hotspot-w:${Number(target.w)}%;--hotspot-h:${Number(target.h)}%;"
        data-seek-find-target="${escapeHtml(target.key)}"
        aria-label="${found ? 'Found' : 'Find'} ${escapeHtml(target.latin)}, ${escapeHtml(target.english)}"
        aria-pressed="${found ? 'true' : 'false'}"
      >
        <span aria-hidden="true">✓</span>
      </button>
    `;
  }).join('');

  const wordButtons = config.targets.map((target, index) => {
    const found = SeekFindState.found.has(target.key);
    const active = SeekFindState.activeHintKey === target.key;
    return `
      <button
        type="button"
        class="seek-find-word${found ? ' found' : ''}${active ? ' active' : ''}"
        data-seek-find-hint="${escapeHtml(target.key)}"
        aria-label="${found ? 'Found' : 'Get a clue for'} ${escapeHtml(target.latin)}, ${escapeHtml(target.english)}"
      >
        <span class="seek-find-word-number" aria-hidden="true">${found ? '✓' : index + 1}</span>
        <span><strong>${escapeHtml(target.latin)}</strong><small>${escapeHtml(target.english)}</small></span>
      </button>
    `;
  }).join('');

  elements.lessonSeekFind.innerHTML = `
    <section class="seek-find-panel${complete ? ' complete' : ''}" aria-label="Picture seek and find">
      <header class="seek-find-header">
        <div>
          <span class="seek-find-eyebrow">Picture mission</span>
          <h3>Seek &amp; Find: ${escapeHtml(lesson.story.englishTitle)}</h3>
          <p>Search the original artwork for six story words. Tap each object when you spot it.</p>
        </div>
        <div class="seek-find-score" aria-label="${foundCount} of ${total} objects found">
          <strong>${foundCount}/${total}</strong>
          <span>found</span>
        </div>
      </header>
      <div class="seek-find-layout">
        <figure class="seek-find-figure">
          <div class="seek-find-canvas">
            ${renderResponsiveStoryImage(config.image, lesson.story.pictureCue, '(max-width: 900px) 92vw, 640px')}
            ${hotspots}
            ${complete ? '<div class="seek-find-complete-banner" role="status"><span aria-hidden="true">★</span> Euge! You found them all!</div>' : ''}
          </div>
          <figcaption>Original artwork created for Latin Launchpad.</figcaption>
        </figure>
        <aside class="seek-find-side">
          <div class="seek-find-mission">
            <span>Your mission</span>
            <strong>${escapeHtml(config.mission)}</strong>
            <p>${escapeHtml(config.missionEnglish)}</p>
          </div>
          <div class="seek-find-progress" aria-hidden="true"><span style="width:${progress}%"></span></div>
          <div class="seek-find-word-list" aria-label="Things to find">${wordButtons}</div>
          <p class="seek-find-status" data-tone="${complete ? 'success' : 'neutral'}" aria-live="polite">${escapeHtml(status)}</p>
          <div class="seek-find-actions">
            <button type="button" class="secondary-button" data-seek-find-action="hint" ${complete ? 'disabled' : ''}>Give me a hint</button>
            <button type="button" class="secondary-button" data-seek-find-action="reset" ${foundCount === 0 ? 'disabled' : ''}>Start over</button>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function showSeekFindHint(targetKey = null) {
  const lesson = getSelectedLesson();
  const config = getSeekFindConfig(lesson);
  if (!lesson || !config) return;
  const remaining = config.targets.filter((target) => !SeekFindState.found.has(target.key));
  if (remaining.length === 0) return;

  let target = remaining.find((item) => item.key === targetKey);
  if (!target) {
    const activeIndex = remaining.findIndex((item) => item.key === SeekFindState.activeHintKey);
    target = remaining[(activeIndex + 1) % remaining.length];
  }
  SeekFindState.activeHintKey = target.key;
  SeekFindState.status = `${target.latin} (${target.english}): ${target.hint}`;
  renderLessonSeekFind(lesson);
}

function findSeekFindTarget(targetKey) {
  const lesson = getSelectedLesson();
  const config = getSeekFindConfig(lesson);
  const target = config?.targets.find((item) => item.key === targetKey);
  if (!lesson || !config || !target) return;

  if (SeekFindState.found.has(target.key)) {
    SeekFindState.status = `Already found: ${target.latin} — ${target.english}.`;
  } else {
    SeekFindState.found.add(target.key);
    SeekFindState.activeHintKey = null;
    SeekFindState.status = SeekFindState.found.size === config.targets.length
      ? 'Euge! Excellent work — you found every story word.'
      : `Invenisti! You found ${target.latin} — ${target.english}.`;
    if (SeekFindState.found.size === config.targets.length) {
      const badge = persistAchievement('seek-find-scout');
      if (badge) SeekFindState.status += ' Seek & Find Scout unlocked. +15 points.';
    }
  }
  renderLessonSeekFind(lesson);
}

function resetSeekFind() {
  const lesson = getSelectedLesson();
  if (!lesson) return;
  resetSeekFindState(lesson.id);
  renderLessonSeekFind(lesson);
}

function renderLessonPuzzles(lesson) {
  if (!elements.lessonPuzzles) return;
  const { terms } = getLessonPuzzles(lesson);
  if (terms.length === 0) {
    elements.lessonPuzzles.innerHTML = '';
    return;
  }

  if (OnlinePuzzleState.lessonId !== lesson.id) {
    OnlinePuzzleState.lessonId = lesson.id;
    OnlinePuzzleState.mode = 'crossword';
    OnlinePuzzleState.crosswordDirection = 'across';
    OnlinePuzzleState.wordFindStart = null;
    OnlinePuzzleState.wordFindFound = new Set();
    OnlinePuzzleState.wordFindStatus = '';
  }

  elements.lessonPuzzles.innerHTML = `
    <section class="online-puzzles-panel" aria-label="Online puzzles">
      <div class="online-puzzles-header">
        <div>
          <span class="printables-eyebrow">Online puzzles</span>
          <h3>Play on screen</h3>
        </div>
        <div class="puzzle-mode-tabs" role="tablist" aria-label="Puzzle type">
          ${renderPuzzleModeButton('crossword', 'Crossword')}
          ${renderPuzzleModeButton('word-find', 'Word find')}
        </div>
      </div>
      <div class="online-puzzle-stage" id="onlinePuzzleStage"></div>
    </section>
  `;
  renderOnlinePuzzle(lesson);
}

function renderPuzzleModeButton(mode, label) {
  const selected = OnlinePuzzleState.mode === mode;
  return `
    <button
      type="button"
      class="puzzle-mode-button${selected ? ' active' : ''}"
      role="tab"
      aria-selected="${selected ? 'true' : 'false'}"
      data-puzzle-mode="${escapeHtml(mode)}"
    >${escapeHtml(label)}</button>
  `;
}

function renderOnlinePuzzle(lesson) {
  const stage = document.getElementById('onlinePuzzleStage');
  if (!stage) return;
  stage.innerHTML = OnlinePuzzleState.mode === 'word-find'
    ? renderOnlineWordFind(lesson)
    : renderOnlineCrossword(lesson);
}

function renderOnlineCrossword(lesson) {
  const { crossword } = getLessonPuzzles(lesson);
  const entries = getCrosswordEntries(crossword);
  return `
    <div class="online-crossword">
      <div class="online-puzzle-grid-wrap">
        ${renderOnlineCrosswordGrid(crossword)}
      </div>
      <div class="online-puzzle-side">
        <div class="online-puzzle-actions">
          <button type="button" class="secondary-button" data-crossword-action="reset">Reset</button>
          <button type="button" class="secondary-button" data-crossword-action="reveal">Reveal</button>
          <button type="button" class="primary-button" data-crossword-action="check">Check</button>
        </div>
        <p class="online-puzzle-status" id="crosswordStatus" aria-live="polite"></p>
        ${renderOnlineCrosswordClues('Across', entries.filter((entry) => entry.direction === 'across'))}
        ${renderOnlineCrosswordClues('Down', entries.filter((entry) => entry.direction === 'down'))}
      </div>
    </div>
  `;
}

function renderOnlineCrosswordGrid(crossword) {
  const rows = crossword.grid.map((row, rowIndex) => {
    const cells = row.map((letter, colIndex) => {
      if (!letter) return '<td class="online-crossword-block"></td>';
      const number = crossword.cellNumbers.get(`${rowIndex},${colIndex}`);
      const numberHtml = number ? `<span class="cell-number">${number}</span>` : '';
      return `
        <td class="online-crossword-cell">
          ${numberHtml}
          <input
            class="online-crossword-input"
            type="text"
            inputmode="text"
            maxlength="1"
            autocomplete="off"
            autocapitalize="characters"
            spellcheck="false"
            aria-label="Row ${rowIndex + 1}, column ${colIndex + 1}"
            data-crossword-cell
            data-row="${rowIndex}"
            data-col="${colIndex}"
            data-answer="${escapeHtml(letter)}"
          />
        </td>
      `;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  return `<table class="online-crossword-grid" aria-label="Crossword puzzle"><tbody>${rows}</tbody></table>`;
}

function renderOnlineCrosswordClues(title, entries) {
  if (entries.length === 0) return '';
  return `
    <section class="online-clue-section">
      <h4>${escapeHtml(title)}</h4>
      <ol class="online-clue-list">
        ${entries.map((entry) => `
          <li value="${entry.number}">
            <button type="button" data-crossword-entry="${escapeHtml(entry.id)}">
              ${escapeHtml(entry.term.clue)}
            </button>
          </li>
        `).join('')}
      </ol>
    </section>
  `;
}

function getCrosswordEntries(crossword) {
  return [...crossword.across, ...crossword.down]
    .map((placement) => ({
      id: `${placement.direction}-${placement.number}`,
      number: placement.number,
      direction: placement.direction,
      term: placement.term,
      cells: getPlacementCells(placement)
    }))
    .sort((a, b) => a.number - b.number || a.direction.localeCompare(b.direction));
}

function getPlacementCells(placement) {
  const down = placement.direction === 'down';
  return Array.from({ length: placement.term.answer.length }, (_, index) => ({
    row: placement.row + (down ? index : 0),
    col: placement.col + (down ? 0 : index),
    letter: placement.term.answer[index]
  }));
}

function getCrosswordEntryById(entryId) {
  const lesson = getSelectedLesson();
  if (!lesson) return null;
  const { crossword } = getLessonPuzzles(lesson);
  return getCrosswordEntries(crossword).find((entry) => entry.id === entryId) || null;
}

function focusCrosswordEntry(entryId) {
  const entry = getCrosswordEntryById(entryId);
  if (!entry) return;
  OnlinePuzzleState.crosswordDirection = entry.direction;
  const firstOpenCell = entry.cells.find((cell) => {
    const input = getCrosswordInput(cell.row, cell.col);
    return input && !input.value;
  }) || entry.cells[0];
  getCrosswordInput(firstOpenCell.row, firstOpenCell.col)?.focus();
}

function getCrosswordInput(row, col) {
  return elements.lessonPuzzles?.querySelector(`[data-crossword-cell][data-row="${row}"][data-col="${col}"]`) || null;
}

function handleCrosswordInput(input) {
  const value = normalizePuzzleAnswer(input.value).slice(0, 1);
  input.value = value;
  input.classList.remove('correct', 'wrong');
  if (value) moveCrosswordFocus(input, 1);
}

function handleCrosswordKeydown(event, input) {
  const keyDirections = {
    ArrowRight: ['across', 1],
    ArrowLeft: ['across', -1],
    ArrowDown: ['down', 1],
    ArrowUp: ['down', -1]
  };

  if (keyDirections[event.key]) {
    event.preventDefault();
    const [direction, step] = keyDirections[event.key];
    OnlinePuzzleState.crosswordDirection = direction;
    moveCrosswordFocus(input, step, direction);
    return;
  }

  if (event.key === 'Backspace' && !input.value) {
    event.preventDefault();
    moveCrosswordFocus(input, -1);
  }
}

function moveCrosswordFocus(input, step, direction = OnlinePuzzleState.crosswordDirection) {
  const row = Number(input.dataset.row);
  const col = Number(input.dataset.col);
  const dr = direction === 'down' ? step : 0;
  const dc = direction === 'across' ? step : 0;
  let nextRow = row + dr;
  let nextCol = col + dc;

  while (nextRow >= 0 && nextCol >= 0) {
    const nextInput = getCrosswordInput(nextRow, nextCol);
    if (nextInput) {
      nextInput.focus();
      return;
    }
    nextRow += dr;
    nextCol += dc;
    if (nextRow > 25 || nextCol > 25) return;
  }
}

function checkOnlineCrossword(reveal = false) {
  const lesson = getSelectedLesson();
  if (!lesson || !elements.lessonPuzzles) return;
  const { crossword } = getLessonPuzzles(lesson);
  const entries = getCrosswordEntries(crossword);
  const inputs = Array.from(elements.lessonPuzzles.querySelectorAll('[data-crossword-cell]'));

  inputs.forEach((input) => {
    if (reveal) input.value = input.dataset.answer;
    input.classList.remove('correct', 'wrong');
    if (!input.value) return;
    input.classList.add(input.value.toUpperCase() === input.dataset.answer ? 'correct' : 'wrong');
  });

  let completeEntries = 0;
  entries.forEach((entry) => {
    const complete = entry.cells.every((cell) => {
      const input = getCrosswordInput(cell.row, cell.col);
      return input && input.value.toUpperCase() === cell.letter;
    });
    if (complete) completeEntries += 1;
    elements.lessonPuzzles
      .querySelector(`[data-crossword-entry="${entry.id}"]`)
      ?.classList.toggle('complete', complete);
  });

  const status = document.getElementById('crosswordStatus');
  if (status) {
    const complete = completeEntries === entries.length;
    status.textContent = complete
      ? `Complete: ${completeEntries}/${entries.length}`
      : `Solved: ${completeEntries}/${entries.length}`;
    if (complete && !reveal) {
      const badge = persistAchievement('puzzle-solver');
      if (badge) status.textContent += ' Puzzle Solver unlocked. +15 points.';
    }
  }
}

function resetOnlineCrossword() {
  if (!elements.lessonPuzzles) return;
  elements.lessonPuzzles.querySelectorAll('[data-crossword-cell]').forEach((input) => {
    input.value = '';
    input.classList.remove('correct', 'wrong');
  });
  elements.lessonPuzzles.querySelectorAll('[data-crossword-entry]').forEach((button) => {
    button.classList.remove('complete');
  });
  const status = document.getElementById('crosswordStatus');
  if (status) status.textContent = '';
}

function renderOnlineWordFind(lesson) {
  const { terms, wordFind } = getLessonPuzzles(lesson);
  const foundCells = getFoundWordFindCellKeys(wordFind);
  const selectedKeys = OnlinePuzzleState.wordFindStart
    ? new Set([getCellKey(OnlinePuzzleState.wordFindStart.row, OnlinePuzzleState.wordFindStart.col)])
    : new Set();
  const rows = wordFind.grid.map((row, rowIndex) => {
    const cells = row.map((letter, colIndex) => {
      const key = getCellKey(rowIndex, colIndex);
      const classes = [
        'word-find-button',
        foundCells.has(key) ? 'found' : '',
        selectedKeys.has(key) ? 'selected' : ''
      ].filter(Boolean).join(' ');
      return `
        <td>
          <button
            type="button"
            class="${classes}"
            data-word-find-cell
            data-row="${rowIndex}"
            data-col="${colIndex}"
            aria-label="Row ${rowIndex + 1}, column ${colIndex + 1}, ${escapeHtml(letter)}"
          >${escapeHtml(letter)}</button>
        </td>
      `;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  const foundCount = OnlinePuzzleState.wordFindFound.size;
  const status = OnlinePuzzleState.wordFindStatus || `Found: ${foundCount}/${terms.length}`;

  return `
    <div class="online-word-find">
      <div class="online-puzzle-grid-wrap">
        <table class="online-word-find-grid" aria-label="Word find puzzle"><tbody>${rows}</tbody></table>
      </div>
      <div class="online-puzzle-side">
        <div class="online-puzzle-actions">
          <button type="button" class="secondary-button" data-word-find-action="reset">Reset</button>
          <button type="button" class="secondary-button" data-word-find-action="reveal">Reveal</button>
        </div>
        <p class="online-puzzle-status" aria-live="polite">${escapeHtml(status)}</p>
        <section class="online-word-bank">
          <h4>Latin terms</h4>
          <ul>
            ${terms.map((term) => `
              <li class="${OnlinePuzzleState.wordFindFound.has(term.answer) ? 'found' : ''}">
                ${escapeHtml(term.display)}
              </li>
            `).join('')}
          </ul>
        </section>
      </div>
    </div>
  `;
}

function getFoundWordFindCellKeys(wordFind) {
  const keys = new Set();
  wordFind.placements.forEach((placement) => {
    if (!OnlinePuzzleState.wordFindFound.has(placement.term.answer)) return;
    getWordFindPlacementCells(placement).forEach((cell) => keys.add(getCellKey(cell.row, cell.col)));
  });
  return keys;
}

function getWordFindPlacementCells(placement) {
  return Array.from({ length: placement.term.answer.length }, (_, index) => ({
    row: placement.row + placement.dr * index,
    col: placement.col + placement.dc * index,
    letter: placement.term.answer[index]
  }));
}

function getCellKey(row, col) {
  return `${row},${col}`;
}

function handleWordFindCellClick(button) {
  const lesson = getSelectedLesson();
  if (!lesson) return;
  const cell = {
    row: Number(button.dataset.row),
    col: Number(button.dataset.col)
  };

  if (!OnlinePuzzleState.wordFindStart) {
    OnlinePuzzleState.wordFindStart = cell;
    OnlinePuzzleState.wordFindStatus = `Found: ${OnlinePuzzleState.wordFindFound.size}/${getLessonPuzzles(lesson).terms.length}`;
    renderOnlinePuzzle(lesson);
    return;
  }

  const result = selectWordFindLine(OnlinePuzzleState.wordFindStart, cell);
  OnlinePuzzleState.wordFindStart = null;
  OnlinePuzzleState.wordFindStatus = result;
  const { terms } = getLessonPuzzles(lesson);
  if (OnlinePuzzleState.wordFindFound.size === terms.length) {
    const badge = persistAchievement('puzzle-solver');
    if (badge) OnlinePuzzleState.wordFindStatus += ' Puzzle Solver unlocked. +15 points.';
  }
  renderOnlinePuzzle(lesson);
}

function selectWordFindLine(start, end) {
  const lesson = getSelectedLesson();
  if (!lesson) return '';
  const { terms, wordFind } = getLessonPuzzles(lesson);
  const cells = getStraightLineCells(start, end);
  if (cells.length === 0) return `Found: ${OnlinePuzzleState.wordFindFound.size}/${terms.length}`;
  const word = cells.map((cell) => wordFind.grid[cell.row]?.[cell.col] || '').join('');
  const reversed = word.split('').reverse().join('');
  const match = terms.find((term) => term.answer === word || term.answer === reversed);

  if (!match) return `Found: ${OnlinePuzzleState.wordFindFound.size}/${terms.length}`;
  OnlinePuzzleState.wordFindFound.add(match.answer);
  return OnlinePuzzleState.wordFindFound.size === terms.length
    ? `Complete: ${OnlinePuzzleState.wordFindFound.size}/${terms.length}`
    : `Found: ${OnlinePuzzleState.wordFindFound.size}/${terms.length}`;
}

function getStraightLineCells(start, end) {
  const rowDelta = end.row - start.row;
  const colDelta = end.col - start.col;
  if (rowDelta === 0 && colDelta === 0) return [];
  if (!(rowDelta === 0 || colDelta === 0 || Math.abs(rowDelta) === Math.abs(colDelta))) return [];
  const steps = Math.max(Math.abs(rowDelta), Math.abs(colDelta));
  const rowStep = Math.sign(rowDelta);
  const colStep = Math.sign(colDelta);
  return Array.from({ length: steps + 1 }, (_, index) => ({
    row: start.row + rowStep * index,
    col: start.col + colStep * index
  }));
}

function resetOnlineWordFind() {
  const lesson = getSelectedLesson();
  if (!lesson) return;
  OnlinePuzzleState.wordFindStart = null;
  OnlinePuzzleState.wordFindFound = new Set();
  OnlinePuzzleState.wordFindStatus = '';
  renderOnlinePuzzle(lesson);
}

function revealOnlineWordFind() {
  const lesson = getSelectedLesson();
  if (!lesson) return;
  const { terms } = getLessonPuzzles(lesson);
  OnlinePuzzleState.wordFindFound = new Set(terms.map((term) => term.answer));
  OnlinePuzzleState.wordFindStatus = `Complete: ${OnlinePuzzleState.wordFindFound.size}/${terms.length}`;
  renderOnlinePuzzle(lesson);
}

function getSelectedLesson() {
  if (AppState.selectedLesson === REVIEW_LESSON_ID) {
    return {
      id: REVIEW_LESSON_ID,
      grade: AppState.grade || VALID_GRADES[0],
      kind: 'review',
      title: AppState.reviewTitle || 'Review Queue',
      description: 'Practice the words that need one more pass.',
      vocabularyWords: AppState.reviewQueue,
      phrases: [],
      words: AppState.reviewQueue
    };
  }
  return LESSONS.find((item) => item.id === AppState.selectedLesson) || null;
}

function renderLessonPrintables(lesson) {
  if (!elements.lessonPrintables) return;
  const puzzleTerms = getLessonPuzzleTerms(lesson);
  const puzzleDisabled = puzzleTerms.length < 1;
  const puzzleTermLabel = getPuzzleTermLabel(puzzleTerms.length);
  elements.lessonPrintables.innerHTML = `
    <section class="printables-panel" aria-label="Practice printables">
      <div>
        <span class="printables-eyebrow">Printables</span>
        <h3>Practice sheets</h3>
      </div>
      <div class="printable-actions">
        ${renderPrintableButton('summary', 'Lesson summary', 'One-page recap', false)}
        ${renderPrintableButton('crossword', 'Crossword', puzzleTermLabel, puzzleDisabled)}
        ${renderPrintableButton('word-find', 'Word find', puzzleTermLabel, puzzleDisabled)}
      </div>
    </section>
  `;
  elements.lessonPrintables.querySelectorAll('[data-printable]').forEach((button) => {
    button.addEventListener('click', () => printLessonResource(button.dataset.printable));
  });
}

function renderPrintableButton(type, title, detail, disabled) {
  return `
    <button type="button" class="printable-button" data-printable="${escapeHtml(type)}" ${disabled ? 'disabled' : ''}>
      <span>${escapeHtml(title)}</span>
      <strong>${escapeHtml(detail)}</strong>
    </button>
  `;
}

function getPuzzleTermLabel(count) {
  return `${count} ${count === 1 ? 'term' : 'terms'}`;
}

function isProperNounWord(word) {
  return /^[A-Z]/.test(String(word.latin || '').trim());
}

function isPuzzleTermCandidate(word) {
  if (!word || word.excludeFromPuzzles || word.isPhrase) return false;
  const answer = normalizePuzzleAnswer(word.puzzleAnswer || word.latin);
  return answer.length >= 3 && answer.length <= 14;
}

function getLessonPuzzleTerms(lesson) {
  const seen = new Set();
  const candidates = lesson.words.filter(isPuzzleTermCandidate);
  const regular = candidates.filter((word) => !isProperNounWord(word));
  const names = candidates.filter(isProperNounWord);
  // A full set of ordinary words is enough for the puzzle, so names stay off
  // the grid. Otherwise names fill the remaining spaces with natural clues.
  const pool = regular.length >= 10 ? regular : [...regular, ...names];
  const terms = [];
  pool.forEach((word, index) => {
    const answer = normalizePuzzleAnswer(word.puzzleAnswer || word.latin);
    if (seen.has(answer)) return;
    seen.add(answer);
    terms.push({
      answer,
      display: word.latin,
      clue: getPuzzleClue(word, index),
      english: word.previewAnswer || word.english
    });
  });
  return terms.slice(0, 10);
}

function normalizePuzzleAnswer(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

const PROPER_NOUN_PUZZLE_CLUES = {
  aeschinus: "Name of the older son in a Roman comedy (Adelphoe)",
  ctesipho: "Name of the younger son in a Roman comedy (Adelphoe)",
  demea: 'Name of the father in a Roman comedy (Adelphoe)',
  psyche: "Name of the young woman loved by Cupid",
  pyramus: 'Name of the young man in the story of two lovers in Babylon',
  thisbe: 'Name of the young woman in the story of two lovers in Babylon',
  vesuvius: 'Name of the volcano that buried Pompeii',
  pythia: 'Name of the priestess of Apollo at Delphi'
};

function getProperNounPuzzleClue(word, meaning) {
  const key = String(word.latin || '').toLowerCase().replace(/[^a-z]/g, '');
  if (PROPER_NOUN_PUZZLE_CLUES[key]) return PROPER_NOUN_PUZZLE_CLUES[key];
  const answer = normalizePuzzleAnswer(word.puzzleAnswer || word.latin);
  const raw = String(meaning || '').trim();
  const comma = raw.indexOf(',');
  let description = comma > 0 ? raw.slice(comma + 1).trim() : raw;
  description = description
    .split(/\s+/)
    .filter((token) => normalizePuzzleAnswer(token) !== answer)
    .join(' ')
    .replace(/\s+\b(and|or)\b\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  let clue;
  if (!description) {
    clue = 'A proper name from Roman history or legend';
  } else if (comma > 0 && /\bname\b/i.test(description)) {
    clue = description.charAt(0).toUpperCase() + description.slice(1);
  } else if (comma > 0 && /^(a|an)\s/i.test(description)) {
    clue = `Name of ${description}`;
  } else if (comma > 0) {
    clue = `Name of the ${description}`;
  } else {
    clue = `Latin name for ${description}`;
  }
  if (normalizePuzzleAnswer(clue).includes(answer)) {
    return 'A proper name from Roman history or legend';
  }
  return clue;
}

function getPuzzleClue(word, index) {
  const meaning = word.previewAnswer || word.english || `term ${index + 1}`;
  if (word.context) return `${word.context} ${meaning}`;
  if (isProperNounWord(word)) return getProperNounPuzzleClue(word, meaning);
  return `Latin for "${meaning}"`;
}

function getLessonPuzzles(lesson) {
  if (!PUZZLE_CACHE.has(lesson.id)) {
    const terms = getLessonPuzzleTerms(lesson);
    PUZZLE_CACHE.set(lesson.id, {
      terms,
      crossword: buildCrossword(terms),
      wordFind: buildWordFind(terms, lesson.id)
    });
  }
  return PUZZLE_CACHE.get(lesson.id);
}

function buildCrossword(terms) {
  const words = terms
    .slice()
    .sort((a, b) => b.answer.length - a.answer.length || a.answer.localeCompare(b.answer));
  const longest = words.reduce((max, term) => Math.max(max, term.answer.length), 0);
  const size = Math.max(13, Math.min(19, Math.max(15, longest + 2)));
  const grid = Array.from({ length: size }, () => Array(size).fill(null));
  const directions = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => new Set())
  );
  const placements = [];
  const unused = [];

  function inBounds(row, col) {
    return row >= 0 && col >= 0 && row < size && col < size;
  }

  function canPlace(answer, row, col, direction, requireIntersection) {
    const down = direction === 'down';
    const dr = down ? 1 : 0;
    const dc = down ? 0 : 1;
    const beforeRow = row - dr;
    const beforeCol = col - dc;
    const afterRow = row + dr * answer.length;
    const afterCol = col + dc * answer.length;

    if (!inBounds(row, col) || !inBounds(row + dr * (answer.length - 1), col + dc * (answer.length - 1))) {
      return null;
    }
    if (inBounds(beforeRow, beforeCol) && grid[beforeRow][beforeCol]) return null;
    if (inBounds(afterRow, afterCol) && grid[afterRow][afterCol]) return null;

    let intersections = 0;
    for (let index = 0; index < answer.length; index += 1) {
      const cellRow = row + dr * index;
      const cellCol = col + dc * index;
      const existing = grid[cellRow][cellCol];
      if (existing) {
        if (existing !== answer[index] || directions[cellRow][cellCol].has(direction)) return null;
        intersections += 1;
        continue;
      }

      if (down) {
        if (inBounds(cellRow, cellCol - 1) && grid[cellRow][cellCol - 1]) return null;
        if (inBounds(cellRow, cellCol + 1) && grid[cellRow][cellCol + 1]) return null;
      } else {
        if (inBounds(cellRow - 1, cellCol) && grid[cellRow - 1][cellCol]) return null;
        if (inBounds(cellRow + 1, cellCol) && grid[cellRow + 1][cellCol]) return null;
      }
    }
    if (requireIntersection && intersections === 0) return null;
    return intersections;
  }

  function placeTerm(term, row, col, direction) {
    const down = direction === 'down';
    const dr = down ? 1 : 0;
    const dc = down ? 0 : 1;
    for (let index = 0; index < term.answer.length; index += 1) {
      const cellRow = row + dr * index;
      const cellCol = col + dc * index;
      grid[cellRow][cellCol] = term.answer[index];
      directions[cellRow][cellCol].add(direction);
    }
    placements.push({ term, row, col, direction, number: 0 });
  }

  function findBestPlacement(term, requireIntersection) {
    let best = null;
    const center = (size - 1) / 2;
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        ['across', 'down'].forEach((direction) => {
          const intersections = canPlace(term.answer, row, col, direction, requireIntersection);
          if (intersections === null) return;
          const endRow = row + (direction === 'down' ? term.answer.length - 1 : 0);
          const endCol = col + (direction === 'across' ? term.answer.length - 1 : 0);
          const distance = Math.abs((row + endRow) / 2 - center) + Math.abs((col + endCol) / 2 - center);
          const score = intersections * 40 - distance;
          if (!best || score > best.score) {
            best = { row, col, direction, score };
          }
        });
      }
    }
    return best;
  }

  words.forEach((term, index) => {
    if (index === 0) {
      const row = Math.floor(size / 2);
      const col = Math.max(0, Math.floor((size - term.answer.length) / 2));
      placeTerm(term, row, col, 'across');
      return;
    }

    const connected = findBestPlacement(term, true);
    const placement = connected || findBestPlacement(term, false);
    if (placement) {
      placeTerm(term, placement.row, placement.col, placement.direction);
    } else {
      unused.push(term);
    }
  });

  const cellNumbers = new Map();
  let nextNumber = 1;
  placements
    .slice()
    .sort((a, b) => a.row - b.row || a.col - b.col || a.direction.localeCompare(b.direction))
    .forEach((placement) => {
      const key = `${placement.row},${placement.col}`;
      if (!cellNumbers.has(key)) {
        cellNumbers.set(key, nextNumber);
        nextNumber += 1;
      }
      placement.number = cellNumbers.get(key);
    });

  return {
    size,
    grid,
    cellNumbers,
    across: placements.filter((placement) => placement.direction === 'across').sort((a, b) => a.number - b.number),
    down: placements.filter((placement) => placement.direction === 'down').sort((a, b) => a.number - b.number),
    unused
  };
}

function buildWordFind(terms, lessonId) {
  const words = terms
    .slice()
    .sort((a, b) => b.answer.length - a.answer.length || a.answer.localeCompare(b.answer));
  const longest = words.reduce((max, term) => Math.max(max, term.answer.length), 0);
  const totalLetters = words.reduce((total, term) => total + term.answer.length, 0);
  let size = Math.max(12, Math.min(18, Math.max(longest + 2, Math.ceil(Math.sqrt(totalLetters) * 4))));

  while (size <= 20) {
    const puzzle = tryBuildWordFind(words, size, makeSeededRandom(`${lessonId}-${size}`));
    if (puzzle) return puzzle;
    size += 1;
  }

  return tryBuildWordFind(words, 20, makeSeededRandom(`${lessonId}-fallback`));
}

function tryBuildWordFind(words, size, random) {
  const grid = Array.from({ length: size }, () => Array(size).fill(''));
  const placements = [];
  const directionList = [
    [0, 1],
    [1, 0],
    [1, 1],
    [-1, 1],
    [0, -1],
    [1, -1]
  ];

  function fits(answer, row, col, dr, dc) {
    let overlap = 0;
    for (let index = 0; index < answer.length; index += 1) {
      const cellRow = row + dr * index;
      const cellCol = col + dc * index;
      if (cellRow < 0 || cellCol < 0 || cellRow >= size || cellCol >= size) return null;
      const existing = grid[cellRow][cellCol];
      if (existing && existing !== answer[index]) return null;
      if (existing) overlap += 1;
    }
    return overlap;
  }

  for (const term of words) {
    const candidates = [];
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        directionList.forEach(([dr, dc]) => {
          const overlap = fits(term.answer, row, col, dr, dc);
          if (overlap === null) return;
          candidates.push({ row, col, dr, dc, score: overlap * 30 + Math.floor(random() * 20) });
        });
      }
    }
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.score - a.score);
    const placement = candidates[0];
    for (let index = 0; index < term.answer.length; index += 1) {
      grid[placement.row + placement.dr * index][placement.col + placement.dc * index] = term.answer[index];
    }
    placements.push({ term, ...placement });
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (!grid[row][col]) {
        grid[row][col] = alphabet[Math.floor(random() * alphabet.length)];
      }
    }
  }

  return { size, grid, placements };
}

function makeSeededRandom(seedText) {
  let seed = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    seed ^= seedText.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }
  return function random() {
    seed += 0x6D2B79F5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function printLessonResource(type) {
  const lesson = LESSONS.find((item) => item.id === AppState.selectedLesson);
  if (!lesson || !elements.printArea) return;
  const printers = {
    summary: renderLessonSummaryPrint,
    crossword: renderCrosswordPrint,
    'word-find': renderWordFindPrint
  };
  const renderPrint = printers[type];
  if (!renderPrint) return;

  elements.printArea.innerHTML = `
    <div class="print-preview-toolbar">
      <div>
        <span class="printables-eyebrow">Printable preview</span>
        <h2>${escapeHtml(getLessonDisplayTitle(lesson))}</h2>
      </div>
      <div class="print-preview-actions">
        <button type="button" class="secondary-button" data-print-action="close">Close</button>
        <button type="button" class="primary-button" data-print-action="print">Print</button>
      </div>
    </div>
    ${renderPrint(lesson)}
  `;
  elements.printArea.classList.add('active');
  elements.printArea.setAttribute('role', 'dialog');
  elements.printArea.setAttribute('aria-label', 'Printable preview');
  elements.printArea.setAttribute('aria-hidden', 'false');
  document.body.classList.add('print-preview-open');
  elements.printArea.querySelector('[data-print-action="print"]')?.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closePrintPreview() {
  if (!elements.printArea) return;
  elements.printArea.classList.remove('active');
  elements.printArea.setAttribute('aria-hidden', 'true');
  elements.printArea.innerHTML = '';
  document.body.classList.remove('print-preview-open');
}

function printCurrentPreview() {
  if (!elements.printArea?.classList.contains('active')) return;
  elements.printArea.offsetHeight;
  window.print();
}

function getPrintableLessonNumber(lesson) {
  const match = String(getLessonDisplayTitle(lesson)).match(/\bLesson\s+(\d+)\b/i);
  return match ? match[1] : '';
}

function estimateWrappedClueLines(clues, charsPerLine) {
  return clues.reduce((total, placement) => {
    const length = String(placement.term?.clue || '').length;
    return total + Math.max(1, Math.ceil(length / charsPerLine));
  }, 0);
}

function getCrosswordPrintStyle(crossword) {
  const lines = Math.max(
    estimateWrappedClueLines(crossword.across, 34),
    estimateWrappedClueLines(crossword.down, 34),
    1
  );
  let size = 15;
  if (lines >= 5) size = 13.5;
  if (lines >= 7) size = 12;
  if (lines >= 9) size = 11;
  if (lines >= 12) size = 9.5;
  return `--clue-size:${size}pt`;
}

function getWordFindPrintStyle(termCount) {
  let size = 18;
  if (termCount >= 5) size = 16;
  if (termCount >= 8) size = 14.5;
  const columns = termCount <= 3 ? 1 : 2;
  return `--word-size:${size}pt;--word-cols:${columns}`;
}

function getRecapFontSize(termCount, phraseCount, maxNoteLength) {
  let size = 16;
  const weight = termCount + phraseCount * 1.6 + (maxNoteLength > 48 ? 2 : 0) + (maxNoteLength > 80 ? 1.5 : 0);
  if (weight >= 7) size = 14;
  if (weight >= 10) size = 12.5;
  if (weight >= 13) size = 11;
  if (termCount <= 4 && phraseCount === 0 && maxNoteLength < 24) size = 17;
  return size;
}

function renderRecapTable(columnClass, headers, rows) {
  const head = headers.map((header) => `<div>${escapeHtml(header)}</div>`).join('');
  const body = rows.map((row) => (
    `<div class="recap-row">${row.map((cell) => `<div>${cell}</div>`).join('')}</div>`
  )).join('');
  return `<div class="recap-table ${columnClass}"><div class="recap-row recap-head">${head}</div>${body}</div>`;
}

function renderLessonSummaryPrint(lesson) {
  const focusItems = Array.isArray(lesson.focus) ? lesson.focus.filter(Boolean) : [];
  const phrases = Array.isArray(lesson.phrases) ? lesson.phrases : [];
  const vocabulary = getLessonVocabularyWords(lesson);
  const termRows = vocabulary.map((word) => {
    const note = truncateText(word.explanation || word.hint || word.prompt || '', 96);
    const cells = [
      `<strong>${escapeHtml(word.latin)}</strong>`,
      escapeHtml(word.previewAnswer || word.english)
    ];
    return { cells, note };
  });
  const hasNotes = termRows.some((row) => row.note);
  const phraseTableRows = phrases.map((phrase) => {
    const linkedWords = Array.isArray(phrase.matchedWords)
      ? phrase.matchedWords.map((word) => `${word.latin} (${word.english})`).join(', ')
      : '';
    return [
      `<strong>${escapeHtml(phrase.latin)}</strong>`,
      escapeHtml(phrase.meaning),
      escapeHtml(linkedWords || 'today\'s word bank')
    ];
  });
  const sourceNote = lesson.sourceNote ? `<p>${escapeHtml(lesson.sourceNote)}</p>` : '';
  const storyNote = lesson.story
    ? `<p><strong>Story:</strong> ${escapeHtml(lesson.story.title)} — ${escapeHtml(lesson.story.summary)}</p>`
    : '';
  const maxNoteLength = termRows.reduce((max, row) => Math.max(max, row.note.length), 0);
  const recapSize = getRecapFontSize(termRows.length, phrases.length, maxNoteLength);
  const termTableRows = termRows.map((row) => (hasNotes ? [...row.cells, escapeHtml(row.note)] : row.cells));
  const focusLine = focusItems.length
    ? `<section class="print-section print-focus"><h2>Focus</h2><p>${focusItems.map((item) => escapeHtml(item)).join(' · ')}</p></section>`
    : '';

  return `
    <article class="print-sheet summary-sheet" style="--recap-size:${recapSize}pt">
      ${renderPrintHeader(lesson, 'Lesson Summary')}
      <div class="print-body">
        <section class="print-section print-intro">
          <h2>Big idea</h2>
          <p>${escapeHtml(lesson.description)}</p>
          ${sourceNote}
          ${storyNote}
        </section>
        ${focusLine}
        ${phraseTableRows.length ? `
          <section class="print-section">
            <h2>Popular Latin phrases</h2>
            ${renderRecapTable('cols-3 recap-compact', ['Phrase', 'Meaning', 'Linked words'], phraseTableRows)}
          </section>
        ` : ''}
        <section class="print-section print-terms">
          <h2>Key terms</h2>
          ${renderRecapTable(
            hasNotes ? 'cols-3 terms-table' : 'cols-2 terms-table',
            hasNotes ? ['Latin', 'Meaning', 'Note'] : ['Latin', 'Meaning'],
            termTableRows
          )}
        </section>
      </div>
    </article>
  `;
}

function renderCrosswordPrint(lesson) {
  const { crossword } = getLessonPuzzles(lesson);
  return `
    <article class="print-sheet puzzle-sheet crossword-sheet" style="${getCrosswordPrintStyle(crossword)}">
      ${renderPrintHeader(lesson, 'Crossword')}
      <div class="print-body puzzle-layout">
        <div class="puzzle-stage">${renderCrosswordGrid(crossword, false)}</div>
        <div class="clue-panel">
          ${renderCrosswordClues('Across', crossword.across)}
          ${renderCrosswordClues('Down', crossword.down)}
        </div>
      </div>
    </article>
  `;
}

function renderWordFindPrint(lesson) {
  const { terms, wordFind } = getLessonPuzzles(lesson);
  const words = terms
    .map((term) => `<li>${escapeHtml(term.display)}</li>`)
    .join('');
  return `
    <article class="print-sheet puzzle-sheet word-find-sheet" style="${getWordFindPrintStyle(terms.length)}">
      ${renderPrintHeader(lesson, 'Word Find')}
      <div class="print-body puzzle-layout">
        <div class="puzzle-stage">${renderWordFindGrid(wordFind)}</div>
        <section class="word-bank">
          <h2>Find these Latin terms</h2>
          <ul>${words}</ul>
        </section>
      </div>
    </article>
  `;
}

function renderPrintHeader(lesson, sheetTitle) {
  const lessonNumber = getPrintableLessonNumber(lesson);
  const lessonValue = lessonNumber
    ? `<span class="write-line-value">${escapeHtml(lessonNumber)}</span>`
    : '';
  const kindLabel = lesson.kind === 'grammar' ? 'Grammar' : 'Vocabulary';
  return `
    <header class="print-header">
      <div class="print-title-block">
        <p class="print-kicker">${escapeHtml(getLessonLevelName(lesson.grade))} · ${kindLabel}</p>
        <h1>${escapeHtml(sheetTitle)}</h1>
        <p class="print-subtitle">${escapeHtml(getLessonDisplayTitle(lesson))}</p>
      </div>
      <div class="print-name-lines">
        <div class="write-field"><span class="write-label">Name</span><span class="write-line"></span></div>
        <div class="write-field"><span class="write-label">Date</span><span class="write-line"></span></div>
        <div class="write-field"><span class="write-label">Lesson #</span><span class="write-line">${lessonValue}</span></div>
      </div>
    </header>
  `;
}

function renderCrosswordGrid(crossword, showAnswers) {
  const size = crossword.grid.length;
  const cells = crossword.grid.map((row, rowIndex) => row.map((letter, colIndex) => {
    if (!letter) {
      return '<div class="crossword-block" aria-hidden="true"></div>';
    }
    const number = crossword.cellNumbers.get(`${rowIndex},${colIndex}`);
    const numberHtml = number ? `<span class="cell-number">${number}</span>` : '';
    const answerHtml = showAnswers ? `<span class="cell-answer">${escapeHtml(letter)}</span>` : '';
    return `<div class="crossword-cell">${numberHtml}${answerHtml}</div>`;
  }).join('')).join('');
  return `<div class="crossword-grid" style="--grid-size:${size}" role="grid" aria-label="Crossword grid">${cells}</div>`;
}

function renderCrosswordClues(title, clues) {
  if (clues.length === 0) return '';
  return `
    <section class="clue-list-section">
      <h2>${escapeHtml(title)}</h2>
      <ol class="clue-list">
        ${clues.map((placement) => `<li><span class="clue-number">${placement.number}.</span><span class="clue-text">${escapeHtml(placement.term.clue)}</span></li>`).join('')}
      </ol>
    </section>
  `;
}

function renderWordFindGrid(wordFind) {
  const size = wordFind.grid.length;
  const cells = wordFind.grid.flat().map((letter) => (
    `<div class="word-find-cell">${escapeHtml(letter)}</div>`
  )).join('');
  return `<div class="word-find-grid" style="--grid-size:${size}" role="grid" aria-label="Word find grid">${cells}</div>`;
}

function truncateText(value, maxLength) {
  const text = String(value || '').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}...`;
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

function renderPhraseFocus(lesson) {
  if (!elements.phraseFocus) return;
  const phrases = Array.isArray(lesson.phrases) ? lesson.phrases : [];
  if (phrases.length === 0) {
    elements.phraseFocus.innerHTML = '';
    return;
  }

  const phraseCards = phrases.map((phrase) => {
    const matchedWords = Array.isArray(phrase.matchedWords) && phrase.matchedWords.length > 0
      ? phrase.matchedWords
        .map((word) => `<span>${escapeHtml(word.latin)} - ${escapeHtml(word.english)}</span>`)
        .join('')
      : '<span>today\'s word bank</span>';
    return `
      <article class="phrase-card">
        <div class="phrase-mark" aria-hidden="true">${escapeHtml(phrase.icon || 'P')}</div>
        <div>
          <p class="phrase-latin">${escapeHtml(phrase.latin)}</p>
          <p class="phrase-meaning">${escapeHtml(phrase.meaning)}</p>
          <p class="phrase-note">${escapeHtml(phrase.note)}</p>
          <div class="phrase-links" aria-label="Linked lesson words">${matchedWords}</div>
        </div>
      </article>
    `;
  }).join('');

  const sources = renderPhraseSources();
  elements.phraseFocus.innerHTML = `
    <section class="phrase-focus-panel" aria-label="Popular Latin phrases">
      <div class="phrase-focus-header">
        <div>
          <span class="phrase-eyebrow">Phrase focus</span>
          <h3>Popular phrases from today's words</h3>
        </div>
        <p>${phrases.length} ${phrases.length === 1 ? 'phrase' : 'phrases'} in this lesson</p>
      </div>
      <div class="phrase-grid">${phraseCards}</div>
      ${sources ? `<p class="phrase-source">Sources: ${sources}</p>` : ''}
    </section>
  `;
}

function renderPhraseSources() {
  if (typeof LATIN_PHRASE_SOURCES === 'undefined') return '';
  return LATIN_PHRASE_SOURCES
    .map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.name)}</a>`)
    .join(' and ');
}

function renderCultureCard(culture) {
  if (!elements.cultureCard) return;
  if (!culture) {
    elements.cultureCard.innerHTML = '';
    return;
  }

  const linkedWords = culture.linkedWords
    .map((word) => `<span>${escapeHtml(word)}</span>`)
    .join('');
  elements.cultureCard.innerHTML = `
    <section class="culture-card-panel" aria-label="Roman culture connection">
      <div class="culture-mark" aria-hidden="true">${escapeHtml(culture.mark || 'R')}</div>
      <div class="culture-copy">
        <span class="culture-eyebrow">Culture connection</span>
        <h3>${escapeHtml(culture.title)}</h3>
        <p class="culture-latin">${escapeHtml(culture.latinTitle)}</p>
        <p>${escapeHtml(culture.summary)}</p>
        <p class="culture-connection">${escapeHtml(culture.connection)}</p>
        <div class="culture-footer">
          <div class="culture-words" aria-label="Related Latin words">${linkedWords}</div>
        </div>
      </div>
    </section>
  `;
}

function renderClassroomLatin(lesson) {
  if (!elements.classroomLatin) return;
  const phrases = Array.isArray(lesson.classroomPhrases) ? lesson.classroomPhrases : [];
  if (phrases.length === 0) {
    elements.classroomLatin.innerHTML = '';
    return;
  }

  const categories = [...new Set(phrases.map((phrase) => phrase.category))];
  const categoryButtons = ['all', ...categories].map((category) => `
    <button
      type="button"
      class="classroom-filter${category === 'all' ? ' active' : ''}"
      data-classroom-category="${escapeHtml(category)}"
      aria-pressed="${category === 'all'}"
    >${escapeHtml(CLASSROOM_LATIN_CATEGORIES[category] || category)}</button>
  `).join('');

  const cards = phrases.map((phrase) => {
    const meaningId = `classroom-meaning-${escapeHtml(phrase.id)}`;
    return `
      <article class="classroom-phrase-card" data-classroom-card data-category="${escapeHtml(phrase.category)}">
        <div class="classroom-phrase-heading">
          <div>
            <span>${escapeHtml(CLASSROOM_LATIN_CATEGORIES[phrase.category] || phrase.category)}</span>
            <h4>${escapeHtml(phrase.latin)}</h4>
          </div>
          ${renderSpeakButton(phrase.latin, 'Listen', 0.74)}
        </div>
        <div id="${meaningId}" class="classroom-meaning" hidden>
          <strong>${escapeHtml(phrase.english)}</strong>
          <p>${escapeHtml(phrase.note)}</p>
        </div>
        <button
          type="button"
          class="classroom-reveal"
          data-classroom-reveal="${escapeHtml(phrase.id)}"
          aria-controls="${meaningId}"
          aria-expanded="false"
        >Reveal meaning</button>
      </article>
    `;
  }).join('');

  elements.classroomLatin.innerHTML = `
    <section class="classroom-latin-panel" aria-label="Classroom Latin practice">
      <div class="classroom-latin-header">
        <div>
          <span class="classroom-eyebrow">Say it in class</span>
          <h3>Useful Latin for the school day</h3>
          <p>Listen first, say the phrase aloud, then reveal its meaning.</p>
        </div>
        <div class="classroom-actions">
          <button type="button" class="secondary-button" data-classroom-action="shuffle">Shuffle</button>
          <button type="button" class="secondary-button" data-classroom-action="reveal-all">Reveal all</button>
        </div>
      </div>
      <div class="classroom-filters" aria-label="Filter classroom phrases">${categoryButtons}</div>
      <div class="classroom-phrase-grid">${cards}</div>
    </section>
  `;
}

function filterClassroomPhrases(category) {
  if (!elements.classroomLatin) return;
  elements.classroomLatin.querySelectorAll('[data-classroom-category]').forEach((button) => {
    const active = button.dataset.classroomCategory === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  elements.classroomLatin.querySelectorAll('[data-classroom-card]').forEach((card) => {
    card.hidden = category !== 'all' && card.dataset.category !== category;
  });
}

function toggleClassroomMeaning(button) {
  const meaning = document.getElementById(button.getAttribute('aria-controls'));
  if (!meaning) return;
  const reveal = meaning.hidden;
  meaning.hidden = !reveal;
  button.setAttribute('aria-expanded', String(reveal));
  button.textContent = reveal ? 'Hide meaning' : 'Reveal meaning';
}

function revealAllClassroomMeanings() {
  if (!elements.classroomLatin) return;
  elements.classroomLatin.querySelectorAll('[data-classroom-reveal]').forEach((button) => {
    const meaning = document.getElementById(button.getAttribute('aria-controls'));
    if (meaning) meaning.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    button.textContent = 'Hide meaning';
  });
}

function shuffleClassroomPhrases() {
  const grid = elements.classroomLatin?.querySelector('.classroom-phrase-grid');
  if (!grid) return;
  const cards = [...grid.children];
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }
  cards.forEach((card) => grid.appendChild(card));
}


function getLatinKeywordStems(words) {
  const suffixes = ['ibus', 'arum', 'orum', 'ae', 'am', 'as', 'is', 'us', 'um', 'em', 'es', 'os', 'at', 'it', 'nt', 'a', 'e', 'i', 'o'];
  const stems = new Set();

  words.forEach((word) => {
    const pieces = String(word || '')
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((piece) => piece.length > 2);

    pieces.forEach((piece) => {
      stems.add(piece);
      if (piece.endsWith('er') && piece.length > 4) stems.add(`${piece.slice(0, -2)}r`);
      suffixes.forEach((suffix) => {
        if (piece.endsWith(suffix) && piece.length - suffix.length >= 3) {
          stems.add(piece.slice(0, -suffix.length));
        }
      });
    });
  });

  return stems;
}

function tokenMatchesLatinKeyword(token, stems) {
  const normalized = String(token || '').toLowerCase().replace(/[^a-z]/g, '');
  if (normalized.length <= 2) return false;
  if (stems.has(normalized)) return true;
  return [...getLatinKeywordStems([normalized])].some((stem) => stems.has(stem));
}

function renderHighlightedLatin(text, words) {
  const stems = getLatinKeywordStems(words);
  return String(text || '')
    .split(/([A-Za-z]+)/)
    .map((part) => {
      const escapedPart = escapeHtml(part);
      return tokenMatchesLatinKeyword(part, stems)
        ? `<strong class="latin-keyword">${escapedPart}</strong>`
        : escapedPart;
    })
    .join('');
}

function renderResponsiveStoryImage(src, alt, sizes) {
  const safeSrc = escapeHtml(src || '');
  if (!safeSrc) return '';
  const base = String(src || '').replace(/\.(jpe?g|png|webp)$/i, '');
  const webpSrcset = `${escapeHtml(`${base}-768.webp`)} 768w, ${escapeHtml(`${base}-1280.webp`)} 1280w`;
  return `<picture>
    <source type="image/webp" srcset="${webpSrcset}" sizes="${escapeHtml(sizes)}" />
    <img src="${safeSrc}" alt="${escapeHtml(alt || '')}" width="1536" height="1024" loading="lazy" decoding="async" />
  </picture>`;
}

function renderStoryScene(lessonOrStory) {
  if (!elements.storyScene) return;
  const lesson = lessonOrStory?.story ? lessonOrStory : null;
  const story = lesson ? lesson.story : lessonOrStory;
  if (!story) {
    elements.storyScene.innerHTML = '';
    return;
  }
  const listenItems = story.listenFor.map((word) => `<li>${escapeHtml(word)}</li>`).join('');
  const storyImage = story.seekFind?.image;
  const keywordWords = [
    ...story.listenFor,
    ...(story.seekFind?.targets || []).map((target) => target.latin),
    ...(lesson ? getLessonVocabularyWords(lesson) : []).map((word) => word.latin)
  ];
  const highlightedLatinCue = renderHighlightedLatin(story.latinCue, keywordWords);
  const storyBadgeEarned = Boolean(AppState.badges['story-explorer']);
  const awardText = storyBadgeEarned ? 'Story Explorer earned' : 'Earn Story Explorer + 15 points';
  elements.storyScene.innerHTML = `
    <section class="story-scene-panel" style="--scene-bg: ${escapeHtml(story.visual.bg)}; --scene-accent: ${escapeHtml(story.visual.accent)};">
      <figure class="story-visual">
        ${storyImage
          ? renderResponsiveStoryImage(storyImage, story.pictureCue, '(max-width: 700px) 92vw, 480px')
          : `<div class="story-visual-fallback" role="img" aria-label="${escapeHtml(story.pictureCue)}">${story.visual.icons.map((icon) => `<span aria-hidden="true">${escapeHtml(icon)}</span>`).join('')}</div>`}
      </figure>
      <div class="story-copy">
        <span class="story-eyebrow">Story scene</span>
        <h3>${escapeHtml(story.title)}</h3>
        <p>${escapeHtml(story.summary)}</p>
        <div class="latin-cue">
          <p lang="la">${highlightedLatinCue}</p>
          <p>${escapeHtml(story.englishCue)}</p>
        </div>
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
        <div class="story-read-action">
          <button class="story-link" data-story-read type="button">Read the full story</button>
          <span class="story-award${storyBadgeEarned ? ' earned' : ''}">${escapeHtml(awardText)}</span>
        </div>
      </div>
    </section>
  `;
}

function renderFullStory(lesson) {
  const story = lesson?.story;
  if (!story || !elements.storyReader || !elements.storyReaderContent) return;

  const vocabulary = [
    ...story.listenFor,
    ...(story.seekFind?.targets || []).map((target) => target.latin),
    ...getLessonVocabularyWords(lesson).map((word) => word.latin)
  ];
  const seen = new Set();
  const paragraphs = (story.fullStory || []).filter((paragraph) => {
    const key = `${paragraph.latin.trim().toLowerCase()}|${paragraph.english.trim().toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const rows = paragraphs.map((paragraph) => `
    <div class="story-reader-row">
      <p lang="la">${renderHighlightedLatin(paragraph.latin, vocabulary)}</p>
      <p>${escapeHtml(paragraph.english)}</p>
    </div>
  `).join('');

  elements.storyReaderContent.innerHTML = `
    <article style="--scene-accent: ${escapeHtml(story.visual.accent)};">
      <header class="story-reader-header">
        <div>
          <span class="story-eyebrow">Full bilingual story</span>
          <h2 id="storyReaderTitle">${escapeHtml(story.title)}</h2>
          <p>${escapeHtml(story.englishTitle)}</p>
        </div>
        <button class="story-reader-close" type="button" data-story-close aria-label="Close full story">&times;</button>
      </header>
      <figure class="story-reader-illustration">
        ${renderResponsiveStoryImage(story.seekFind?.image || '', story.pictureCue, '(max-width: 700px) 92vw, 480px')}
        <figcaption>${escapeHtml(story.pictureCue)}</figcaption>
      </figure>
      <div class="story-reader-labels" aria-hidden="true">
        <strong>Latin</strong><strong>English</strong>
      </div>
      <div class="story-reader-text">${rows}</div>
    </article>
  `;
  elements.storyReader.showModal();
}

function hintHeadwordKey(latin) {
  return String(latin || '').toLowerCase().replace(/[^a-z]/g, '');
}

function getEndingHint(latin) {
  const key = hintHeadwordKey(latin);
  if (!key) return '';
  if (Object.prototype.hasOwnProperty.call(GENITIVE_HEADWORD_HINTS, key)) return GENITIVE_HEADWORD_HINTS[key];
  if (key === 'contra') return 'Contra is a preposition meaning “against.” The final -a is not a first-declension noun ending.';
  if (key === 'arma') return 'Arma is a second-declension neuter plural. This -a marks more than one thing, not a first-declension singular subject.';
  if (NEUTER_PLURAL_A.has(key)) return 'This -a form is a neuter plural, not a first-declension singular subject.';
  if (THIRD_NEUTER_US.has(key)) return 'This -us noun is third-declension neuter. Here -us is the subject form for one thing, not the usual second-declension masculine ending.';
  if (THIRD_OTHER_US.has(key)) return 'This -us noun is third declension, not second-declension masculine. The subject form ends in -us, and other cases use a different stem.';
  if (key === 'domus') return 'Domus is fourth declension, with a few second-declension forms. This -us is not the ordinary second-declension masculine ending.';
  if (FOURTH_DECLENSION_US.has(key)) return 'This -us noun is fourth declension. The subject form ends in -us, and the genitive singular is also -us.';
  if (THIRD_NOMINATIVE_IS.has(key)) return 'This -is word is a third-declension subject form for one person or thing, not the ending that means “to/for/by/with the ___s.”';

  const hints = ENDING_HINTS.slice().sort((left, right) => right.suffix.length - left.suffix.length);
  for (const entry of hints) {
    if (key.endsWith(entry.suffix)) return entry.hint;
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
  const lesson = getSelectedLesson();
  if (!lesson) return;
  const questions = getActiveQuestions(lesson);
  const question = questions[AppState.currentQuestionIndex];
  if (!question) {
    completeLesson(lesson);
    return;
  }
  const choices = createChoices(question, questions);
  const pictureMode = AppState.practiceMode === 'picture' && supportsPicturePractice(lesson);
  const arrangeMode = AppState.practiceMode === 'arrange';
  const typedMode = AppState.practiceMode === 'translate' || AppState.practiceMode === 'compose';
  AppState.lessonPhase = 'practice';
  AppState.answerChecked = false;
  AppState.selectedOption = null;
  AppState.productionAnswer = '';
  AppState.arrangeTokens = [];
  const promptHtml = question.prompt
    ? escapeHtml(question.prompt)
    : pictureMode
      ? `Which picture matches <span>${escapeHtml(question.latin)}</span>?`
      : `What does <span>${escapeHtml(question.latin)}</span> mean?`;
  const contextHtml = question.context
    ? `<p class="question-context">${escapeHtml(question.context)}</p>`
    : '';
  elements.lessonPracticePanel?.classList.remove('is-intro', 'is-complete');
  elements.lessonPracticePanel?.classList.add('is-practice');
  elements.wordPreview.className = 'word-preview practice-word-preview';
  elements.wordPreview.innerHTML = renderPracticeToolbar(lesson);
  const interactionHtml = arrangeMode
    ? renderArrangeInteraction(question)
    : typedMode
      ? renderTypedInteraction(question)
      : '<div class="options-grid' + (pictureMode ? ' picture-options-grid' : '') + '" id="optionsGrid"></div>';
  const eyebrow = arrangeMode ? 'Build the sentence' : typedMode ? 'Write your answer' : 'Listen and choose';
  const displayedLatin = AppState.practiceMode === 'compose' || arrangeMode ? '' : `
    <p class="question-latin">${escapeHtml(question.latin)}</p>
    ${renderSyllableCue(question.latin)}`;
  const modePrompt = arrangeMode
    ? `Arrange the words to mean: <span>${escapeHtml(question.previewAnswer || question.english)}</span>`
    : AppState.practiceMode === 'translate'
      ? 'Type the English meaning.'
      : AppState.practiceMode === 'compose'
        ? `Write this in Latin: <span>${escapeHtml(question.previewAnswer || question.english)}</span>`
        : promptHtml;
  elements.questionArea.innerHTML = `
    <div class="question-card" data-question-card>
      <div class="question-word-row">
        <div>
          <span class="question-eyebrow">${eyebrow}</span>
          ${displayedLatin}
        </div>
        ${AppState.practiceMode === 'compose' || arrangeMode ? '' : renderQuestionSoundControls(question)}
      </div>
      ${contextHtml}
      <h3>${modePrompt}</h3>
      ${interactionHtml}
    </div>
  `;
  const optionsGrid = document.getElementById('optionsGrid');
  if (optionsGrid) choices.forEach((choice) => {
    optionsGrid.appendChild(pictureMode ? createPictureOptionButton(choice, lesson) : createMeaningOptionButton(choice));
  });
  renderEndingHint(question);
  elements.nextQuestionButton.hidden = false;
  elements.nextQuestionButton.textContent = 'Check answer';
  elements.nextQuestionButton.disabled = false;
  elements.lessonResult.innerHTML = '';
  elements.lessonResult.removeAttribute('data-tone');
  saveState();
  if (AppState.speechAutoPlay) {
    window.setTimeout(() => speakLatin(question.latin), 180);
  }
}

function renderTypedInteraction(question) {
  const label = AppState.practiceMode === 'compose' ? 'Latin answer' : 'English answer';
  return `
    <label class="production-field">
      <span>${label}</span>
      <input type="text" data-production-input autocomplete="off" autocapitalize="none" spellcheck="false" />
    </label>
  `;
}

function renderArrangeInteraction(question) {
  const tokens = getArrangeWordTokens(question.latin);
  const shuffled = tokens.map((token, index) => ({ token, id: index })).sort(() => Math.random() - 0.5);
  AppState.arrangeTokens = shuffled;
  return `
    <div class="arrange-builder">
      <div class="arrange-answer" data-arrange-answer aria-label="Your sentence"><span>Choose a word below</span></div>
      <div class="arrange-bank" data-arrange-bank>
        ${shuffled.map(({ token, id }) => `<button type="button" data-arrange-token="${id}">${escapeHtml(token)}</button>`).join('')}
      </div>
    </div>
  `;
}

function moveArrangeToken(button) {
  if (AppState.answerChecked) return;
  const answer = elements.questionArea.querySelector('[data-arrange-answer]');
  if (!answer) return;
  answer.querySelector('span')?.remove();
  button.classList.add('selected');
  button.disabled = true;
  const placed = document.createElement('button');
  placed.type = 'button';
  placed.textContent = button.textContent;
  placed.dataset.arrangePlaced = button.dataset.arrangeToken;
  answer.appendChild(placed);
}

function removeArrangeToken(button) {
  if (AppState.answerChecked) return;
  const source = elements.questionArea.querySelector(`[data-arrange-token="${button.dataset.arrangePlaced}"]`);
  if (source) {
    source.disabled = false;
    source.classList.remove('selected');
  }
  button.remove();
  const answer = elements.questionArea.querySelector('[data-arrange-answer]');
  if (answer && !answer.children.length) answer.innerHTML = '<span>Choose a word below</span>';
}

function normalizePracticeAnswer(value) {
  return String(value || '').toLowerCase().replace(/[^a-zà-ž0-9/ ]/g, '').replace(/\s+/g, ' ').trim();
}

function getAcceptedEnglishAnswers(question) {
  const rawAnswer = String(question.previewAnswer || question.english || '');
  const answers = [rawAnswer, ...rawAnswer.split(/\s+\/\s+|\s*;\s*/)]
    .map(normalizePracticeAnswer)
    .filter(Boolean);
  return Array.from(new Set(answers));
}

function isProductionAnswerCorrect(question) {
  if (AppState.practiceMode === 'arrange') {
    const placed = [...elements.questionArea.querySelectorAll('[data-arrange-placed]')].map((button) => button.textContent).join(' ');
    const target = getArrangeWordTokens(question.latin).join(' ');
    return normalizePracticeAnswer(placed) === normalizePracticeAnswer(target);
  }
  const answer = normalizePracticeAnswer(AppState.productionAnswer);
  if (AppState.practiceMode === 'compose') return answer === normalizePracticeAnswer(question.latin);
  return getAcceptedEnglishAnswers(question).some((accepted) => answer === accepted);
}

function createMeaningOptionButton(choice) {
  const button = document.createElement('button');
  button.className = 'option-button';
  button.textContent = choice;
  button.dataset.optionValue = choice;
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => selectOption(choice));
  return button;
}

function createPictureOptionButton(choice, lesson) {
  const match = lesson.words.find((word) => (word.previewAnswer || word.english) === choice || word.english === choice);
  const visual = match ? getWordVisual(match) : choice.charAt(0).toUpperCase();
  const button = document.createElement('button');
  button.className = 'option-button picture-option-button';
  button.dataset.optionValue = choice;
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = `
    <span class="picture-choice-visual" aria-hidden="true">${escapeHtml(visual)}</span>
    <span class="picture-choice-label">${escapeHtml(choice)}</span>
  `;
  button.addEventListener('click', () => selectOption(choice));
  return button;
}

function latinHeadwordKey(latin) {
  return String(latin || '').toLowerCase().replace(/[^a-z]/g, '');
}

function addMeaningVariants(meanings, english) {
  String(english || '').split(/\s*\/\s*|\s*;\s*/).forEach((part) => {
    const trimmed = part.trim();
    if (trimmed) meanings.add(trimmed);
  });
}

function meaningsForHeadword(latin, extraWords) {
  const key = latinHeadwordKey(latin);
  const meanings = new Set();
  if (!key) return meanings;
  const consider = (word) => {
    if (!word || latinHeadwordKey(word.latin) !== key) return;
    addMeaningVariants(meanings, word.english);
    addMeaningVariants(meanings, word.previewAnswer);
  };
  if (typeof GRADE_WORDS !== 'undefined') Object.values(GRADE_WORDS).flat().forEach(consider);
  (extraWords || []).forEach(consider);
  return meanings;
}

function questionAnswer(question) {
  const choices = Array.isArray(question?.choices) ? question.choices.filter(Boolean) : [];
  if (question?.isPhrase || choices.length === 0 || choices.includes(question.english)) {
    return question?.english;
  }
  return choices[0];
}

function createChoices(question, words) {
  const target = questionAnswer(question);
  const blocked = meaningsForHeadword(question.latin, words);
  const isDistractor = (text) => Boolean(text) && text !== target && !blocked.has(text);
  const authored = Array.isArray(question.choices) ? question.choices.filter(Boolean) : [];
  if (authored.length > 0 && !question.isPhrase && !authored.includes(question.english)) {
    return Array.from(new Set(authored)).sort(() => Math.random() - 0.5);
  }
  if (authored.length > 0) {
    return Array.from(new Set([target, ...authored].filter((text) => text === target || isDistractor(text))))
      .sort(() => Math.random() - 0.5);
  }

  const uniqueChoices = Array.from(new Set(words.map((item) => item.english)));
  const distractorPool = uniqueChoices.filter(isDistractor);
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
          .filter((text) => isDistractor(text) && !choices.includes(text))
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
  const buttons = elements.questionArea.querySelectorAll('.option-button');
  buttons.forEach((button) => {
    const selected = button.dataset.optionValue === value;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });
}

function renderQuestionFeedback(question, correct) {
  const correctLines = ['Nice catch!', 'Exactly.', 'Strong work.'];
  const incorrectLines = ['Good try.', 'Almost.', 'Keep going.'];
  const lineIndex = AppState.currentQuestionIndex % correctLines.length;
  const title = correct ? correctLines[lineIndex] : incorrectLines[lineIndex];
  const modelAnswer = `${question.latin} means ${question.previewAnswer || question.english}.`;
  const detail = !correct && ['arrange', 'translate', 'compose'].includes(AppState.practiceMode)
    ? `${modelAnswer}${question.explanation ? ` ${question.explanation}` : ''}`
    : (question.explanation || modelAnswer);
  const tag = correct
    ? (isReviewAttempt() ? 'Review win' : '+10 points')
    : (['arrange', 'translate', 'compose'].includes(AppState.practiceMode) ? 'Model answer' : 'Correct meaning');

  return `
    <div class="feedback-card ${correct ? 'success' : 'error'}">
      <span>${escapeHtml(tag)}</span>
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(detail)}</p>
    </div>
  `;
}

function checkAnswer() {
  const lesson = getSelectedLesson();
  if (!lesson || AppState.answerChecked) return;
  const questions = getActiveQuestions(lesson);
  const question = questions[AppState.currentQuestionIndex];
  if (!question) return;
  const productionMode = ['arrange', 'translate', 'compose'].includes(AppState.practiceMode);
  if (!productionMode && !AppState.selectedOption) {
    elements.lessonResult.dataset.tone = 'warning';
    elements.lessonResult.textContent = 'Choose an answer before moving on.';
    return;
  }
  if (productionMode && AppState.practiceMode !== 'arrange' && !AppState.productionAnswer.trim()) {
    elements.lessonResult.dataset.tone = 'warning';
    elements.lessonResult.textContent = 'Type an answer before moving on.';
    return;
  }
  if (AppState.practiceMode === 'arrange' && !elements.questionArea.querySelector('[data-arrange-placed]')) {
    elements.lessonResult.dataset.tone = 'warning';
    elements.lessonResult.textContent = 'Build the sentence before moving on.';
    return;
  }
  const correct = productionMode
    ? isProductionAnswerCorrect(question)
    : AppState.selectedOption === questionAnswer(question);
  const questionCard = elements.questionArea.querySelector('[data-question-card]');
  questionCard?.classList.add(correct ? 'is-correct' : 'is-wrong');
  const optionButtons = elements.questionArea.querySelectorAll('.option-button');
  optionButtons.forEach((button) => {
    if (button.dataset.optionValue === questionAnswer(question)) button.classList.add('correct');
    if (button.dataset.optionValue === AppState.selectedOption && !correct) button.classList.add('wrong');
    button.disabled = true;
  });
  elements.questionArea.querySelectorAll('[data-production-input], [data-arrange-token], [data-arrange-placed]')
    .forEach((control) => { control.disabled = true; });
  elements.lessonResult.dataset.tone = correct ? 'success' : 'error';
  elements.lessonResult.innerHTML = renderQuestionFeedback(question, correct);
  recordWordAttempt(question, correct);
  if (correct) {
    AppState.currentLessonCorrect += 1;
    if (!isReviewAttempt()) awardPoints(10);
    markWordMastered(question.masteryKey || question.latin);
  } else if (!isReviewAttempt()) {
    rememberMissedQuestion(question);
  }
  AppState.answerChecked = true;
  saveState();
  elements.nextQuestionButton.textContent =
    AppState.currentQuestionIndex < questions.length - 1 ? 'Next question' : 'Finish lesson';
}

function nextQuestion() {
  const lesson = getSelectedLesson();
  if (!lesson) return;
  if (AppState.lessonPhase === 'intro') {
    startLessonPractice();
    return;
  }
  if (!AppState.answerChecked) {
    checkAnswer();
    return;
  }
  const questions = getActiveQuestions(lesson);
  if (AppState.currentQuestionIndex < questions.length - 1) {
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
  renderHome();
  renderDashboard();
}

function markWordMastered(word) {
  AppState.progress.wordsMastered[word] = true;
  saveState();
}

function renderLessonCompletion(lesson, score, earnedAchievement = null) {
  const questions = getActiveQuestions(lesson);
  const total = questions.length;
  const ratio = total > 0 ? score / total : 0;
  const isPerfect = score === total && total > 0;
  const isHighScore = ratio >= 0.8;
  const missed = AppState.currentLessonMissed;
  const title = isPerfect
    ? 'Perfect lesson!'
    : isHighScore
      ? 'Strong finish!'
      : 'Lesson complete!';
  const message = isPerfect
    ? 'Every answer landed. That is a badge-worthy run.'
    : isHighScore
      ? 'You are building real recall. Keep this lesson in the rotation.'
      : 'You finished the loop. A replay will make these words feel faster.';
  const burst = isHighScore
    ? '<div class="celebration-burst" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>'
    : '';

  return `
    <section class="lesson-complete-card${isHighScore ? ' high-score' : ''}">
      ${burst}
      <span class="section-kicker">Lesson complete</span>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(message)}</p>
      <div class="completion-score">
        <strong>${score}/${total}</strong>
        <span>correct</span>
      </div>
      ${earnedAchievement ? `
        <div class="achievement-unlocked">
          <span class="badge-mark" aria-hidden="true">${escapeHtml(earnedAchievement.mark)}</span>
          <div><strong>${escapeHtml(earnedAchievement.name)} unlocked</strong><span>+15 bonus points</span></div>
        </div>
      ` : ''}
      ${renderMissedWordReview(missed)}
      ${renderCompletionCode({
        kind: 'lesson',
        id: lesson.id,
        mode: AppState.practiceMode,
        score,
        total,
        missed: missed.map((word) => word.latin)
      })}
      ${getCompletionActions(missed.length)}
    </section>
  `;
}

function renderMissedWordReview(missed) {
  if (!missed.length) return '';
  return `
    <section class="missed-review-panel" aria-label="Missed words">
      <h4>Missed words</h4>
      <div class="missed-word-grid">
        ${missed.map((word) => `
          <article class="missed-word-card">
            <span class="word-picture" aria-hidden="true">${escapeHtml(getWordVisual(word))}</span>
            <div>
              <strong>${escapeHtml(word.latin)}</strong>
              <span>${escapeHtml(word.previewAnswer || word.english)}</span>
            </div>
            ${renderSpeakButton(word.latin, 'Hear')}
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderReviewCompletion(lesson, score) {
  const total = getActiveQuestions(lesson).length;
  return `
    <section class="lesson-complete-card high-score">
      <span class="section-kicker">Review complete</span>
      <h3>${score}/${total}</h3>
      <p>${score === total ? 'Those words are looking much steadier.' : 'A little repetition is doing its job.'}</p>
      <div class="completion-actions">
        <button type="button" class="secondary-button" data-lesson-action="back-to-lessons">Back to lessons</button>
        <button type="button" class="primary-button" data-lesson-action="open-dashboard">Dashboard</button>
      </div>
    </section>
  `;
}

function completeLesson(lesson) {
  const score = AppState.currentLessonCorrect;
  if (isReviewAttempt() || lesson.id === REVIEW_LESSON_ID) {
    AppState.answerChecked = false;
    AppState.selectedOption = null;
    AppState.lessonPhase = 'complete';
    saveState();
    renderHome();
    renderDashboard();
    elements.lessonPracticePanel?.classList.remove('is-intro', 'is-practice');
    elements.lessonPracticePanel?.classList.add('is-complete');
    elements.wordPreview.innerHTML = '';
    elements.endingHint.innerHTML = '';
    elements.questionArea.innerHTML = '';
    elements.nextQuestionButton.hidden = true;
    elements.lessonResult.dataset.tone = 'success';
    elements.lessonResult.innerHTML = renderReviewCompletion(lesson, score);
    return;
  }
  const previous = AppState.progress.lessons[lesson.id];
  AppState.progress.lessons[lesson.id] = {
    completedAt: new Date().toISOString(),
    score: Math.max(previous?.score ?? 0, score),
    lastScore: score,
    maxScore: getActiveQuestions(lesson).length
  };
  const earnedAchievement = grantAchievement(getPracticeAchievementId(AppState.practiceMode));
  AppState.answerChecked = false;
  AppState.selectedOption = null;
  AppState.lessonPhase = 'complete';
  saveState();
  renderHome();
  renderDashboard();
  elements.lessonPracticePanel?.classList.remove('is-intro', 'is-practice');
  elements.lessonPracticePanel?.classList.add('is-complete');
  elements.wordPreview.innerHTML = '';
  elements.endingHint.innerHTML = '';
  elements.questionArea.innerHTML = '';
  elements.nextQuestionButton.hidden = true;
  const total = getActiveQuestions(lesson).length;
  elements.lessonResult.dataset.tone = total > 0 && score / total >= 0.8 ? 'success' : 'neutral';
  elements.lessonResult.innerHTML = renderLessonCompletion(lesson, score, earnedAchievement);
  elements.lessonListSubtitle.textContent = `Nice work${AppState.studentName ? `, ${AppState.studentName}` : ''}!`;
}

function startMissedWordReview() {
  if (!AppState.currentLessonMissed.length) return;
  AppState.lessonAttemptMode = 'missed-review';
  AppState.reviewQueue = AppState.currentLessonMissed.slice();
  AppState.reviewTitle = 'Missed Word Review';
  AppState.currentQuestionIndex = 0;
  AppState.selectedOption = null;
  AppState.answerChecked = false;
  AppState.currentLessonCorrect = 0;
  AppState.practiceMode = 'meaning';
  AppState.lessonPhase = 'practice';
  elements.nextQuestionButton.hidden = false;
  renderQuestion();
}

function startWeakWordReview() {
  const questions = getWeakReviewQuestions(10);
  if (questions.length === 0) return;
  AppState.selectedLesson = REVIEW_LESSON_ID;
  AppState.lessonAttemptMode = 'weak-review';
  AppState.reviewQueue = questions;
  AppState.reviewTitle = 'Weak Word Review';
  AppState.practiceMode = 'meaning';
  AppState.lessonPhase = 'practice';
  AppState.currentQuestionIndex = 0;
  AppState.selectedOption = null;
  AppState.answerChecked = false;
  AppState.currentLessonCorrect = 0;
  if (elements.lessonResources) elements.lessonResources.open = false;
  renderLesson();
  showPage('lesson');
}

function renderDashboard() {
  elements.pointsValue.textContent = AppState.progress.points;
  const lessonsCompleted = Object.keys(AppState.progress.lessons).length;
  elements.lessonsCompleteValue.textContent = lessonsCompleted;
  elements.wordsMasteredValue.textContent = Object.keys(AppState.progress.wordsMastered).length;
  renderBadges();
  renderWeakWords();
  const visibleLessons = VALID_GRADES.includes(AppState.grade)
    ? getLessonsForSelection(AppState.grade)
    : LESSONS;
  renderNleDashboard();
  elements.progressList.innerHTML = visibleLessons.map((lesson) => {
    const lessonProgress = AppState.progress.lessons[lesson.id];
    const status = lessonProgress
      ? `Complete · best ${lessonProgress.score}/${lessonProgress.maxScore ?? lesson.words.length}`
      : 'Not started';
    return `
      <div class="progress-item">
        <h3>${escapeHtml(getLessonDisplayTitle(lesson))}</h3>
        <p>${escapeHtml(getLessonLevelName(lesson.grade))} • ${status}</p>
      </div>
    `;
  }).join('');
}

function renderWeakWords() {
  if (!elements.weakWordsList || !elements.reviewWeakWordsButton) return;
  const weakWords = getWeakWordEntries(6);
  elements.reviewWeakWordsButton.disabled = weakWords.length === 0;
  if (weakWords.length === 0) {
    elements.weakWordsList.innerHTML = '<p class="weak-empty">Missed words will appear here after practice.</p>';
    return;
  }

  elements.weakWordsList.innerHTML = weakWords.map((word) => `
    <article class="weak-word-item">
      <span class="word-picture" aria-hidden="true">${escapeHtml(word.emoji || String(word.latin || '?').charAt(0).toUpperCase())}</span>
      <div>
        <strong>${escapeHtml(word.latin)}</strong>
        <span>${escapeHtml(word.english || 'Review this word')}</span>
      </div>
      <small>${word.misses} ${word.misses === 1 ? 'miss' : 'misses'}</small>
      ${renderSpeakButton(word.latin, 'Hear')}
    </article>
  `).join('');
}

function getCurrentGradeLessons() {
  return VALID_GRADES.includes(AppState.grade)
    ? getLessonsForSelection(AppState.grade)
    : [];
}

function getLessonProgressLabel(lesson) {
  const lessonProgress = AppState.progress.lessons[lesson.id];
  if (!lessonProgress) return 'Not started';
  return `Best ${lessonProgress.score}/${lessonProgress.maxScore ?? lesson.words.length}`;
}

function getNextLesson() {
  const lessons = getCurrentGradeLessons();
  return lessons.find((lesson) => !AppState.progress.lessons[lesson.id]) || lessons[0] || null;
}

function getHomeGreeting(state = AppState) {
  const progress = state?.progress || {};
  const returning = Boolean(state?.studentName)
    || Number(progress.points) > 0
    || Object.keys(progress.lessons || {}).length > 0
    || Object.keys(progress.wordsMastered || {}).length > 0;
  if (!returning) return 'Welcome. Let\'s begin your first Latin lesson.';
  return `Welcome back, ${state.studentName || 'Learner'}.`;
}

function renderHome() {
  if (!elements.homeGreeting) return;
  const gradeLabel = VALID_GRADES.includes(AppState.grade) ? getCurriculumLevelTitle(AppState.grade) : 'Latin practice';
  const lessons = getCurrentGradeLessons();
  const completedCount = lessons.filter((lesson) => AppState.progress.lessons[lesson.id]).length;
  const nextLesson = getNextLesson();

  elements.homeGradePill.textContent = gradeLabel;
  elements.homeGreeting.textContent = getHomeGreeting();
  elements.homeSummary.textContent = lessons.length > 0
    ? `${completedCount}/${lessons.length} chapters complete. Keep lessons, quizzes, and tests in one place.`
    : 'Choose a year to unlock your Latin learning path.';
  elements.homePointsValue.textContent = AppState.progress.points;
  elements.homeLessonsValue.textContent = Object.keys(AppState.progress.lessons).length;
  elements.homeSkillsValue.textContent = Object.keys(AppState.progress.wordsMastered).length;

  if (nextLesson) {
    elements.homeNextTitle.textContent = getLessonDisplayTitle(nextLesson);
    elements.homeNextMeta.textContent = `${getLessonCountLabel(nextLesson)} · ${getLessonProgressLabel(nextLesson)}`;
    elements.homeContinueButton.disabled = false;
  } else {
    elements.homeNextTitle.textContent = 'Choose your year';
    elements.homeNextMeta.textContent = 'Pick a curriculum year before starting lessons or assessments.';
    elements.homeContinueButton.disabled = false;
  }

  elements.homePathList.innerHTML = lessons.slice(0, 6).map((lesson) => {
    const complete = Boolean(AppState.progress.lessons[lesson.id]);
    const current = nextLesson?.id === lesson.id;
    const type = lesson.kind === 'grammar' ? 'Grammar' : 'Vocabulary';
    return `
      <button type="button" class="home-path-item${complete ? ' complete' : ''}${current ? ' current' : ''}" data-home-lesson-id="${escapeHtml(lesson.id)}">
        <span>${escapeHtml(type)}</span>
        <strong>${escapeHtml(getLessonDisplayTitle(lesson))}</strong>
        <small>${escapeHtml(getLessonProgressLabel(lesson))}</small>
      </button>
    `;
  }).join('');
}

function showHomeOrWelcome() {
  if (!VALID_GRADES.includes(AppState.grade)) {
    showPage('welcome');
    return;
  }
  renderHome();
  showPage('home');
}

function getStudyWords() {
  if (!VALID_GRADES.includes(AppState.grade)) return [];
  const seen = new Set();
  const selectedGrades = getCurriculumGradesForSelection(AppState.grade);
  const level = getCurriculumLevelByGrade(AppState.grade);
  const vocabulary = getVocabularyWordsForCurriculumLevel(level)
    .filter((word) => {
      const key = normalizeVocabularyHeadword(word.latin);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.latin.localeCompare(b.latin));
  const phraseCards = getStudyPhraseCards(selectedGrades);
  return [...vocabulary, ...phraseCards];
}

function getStudyPhraseCards(selectedGrades) {
  if (typeof LATIN_PHRASES === 'undefined') return [];
  const minGrade = Math.min(...selectedGrades);
  const maxGrade = Math.max(...selectedGrades);
  return LATIN_PHRASES
    .filter((phrase) => {
      const phraseMin = phrase.minGrade || 3;
      const phraseMax = phrase.maxGrade || 8;
      return phraseMin <= maxGrade && phraseMax >= minGrade;
    })
    .map((phrase) => ({
      latin: phrase.latin,
      english: phrase.meaning,
      emoji: phrase.icon || 'P',
      note: phrase.note,
      masteryKey: `phrase:${phrase.id}`,
      isPhrase: true,
      studyType: 'phrase'
    }))
    .sort((a, b) => a.latin.localeCompare(b.latin));
}

function ensureStudyWords() {
  const words = getStudyWords();
  const currentKeys = StudyState.words.map((word) => normalizeVocabularyHeadword(word.latin)).sort().join('|');
  const nextKeys = words.map((word) => normalizeVocabularyHeadword(word.latin)).sort().join('|');
  if (currentKeys !== nextKeys) {
    StudyState.words = shuffleItems(words);
    StudyState.shuffled = true;
    StudyState.seenKeys = new Set();
    StudyState.index = 0;
    StudyState.showingAnswer = false;
    StudyState.remainingMs = StudyState.durationSeconds * 1000;
  }
}

function renderStudyPage() {
  ensureStudyWords();
  const phraseCount = StudyState.words.filter((word) => word.isPhrase).length;
  const vocabularyCount = StudyState.words.length - phraseCount;
  elements.studyTitle.textContent = `${getCurriculumLevelTitle(AppState.grade)} study`;
  elements.studySummary.textContent = `${vocabularyCount} vocabulary ${vocabularyCount === 1 ? 'word' : 'words'} and ${phraseCount} ${phraseCount === 1 ? 'phrase' : 'phrases'} ready to review.`;
  renderVocabularyList();
  renderFlashcard();
  document.querySelectorAll('[data-study-mode]').forEach((button) => {
    const active = button.dataset.studyMode === StudyState.mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('[data-study-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.studyPanel !== StudyState.mode;
  });
}

function renderVocabularyList() {
  const query = (elements.vocabularySearch?.value || '').trim().toLowerCase();
  const words = StudyState.words
    .filter((word) => {
      const searchable = `${word.latin} ${word.principalParts || ''} ${word.english} ${word.note || ''}`.toLowerCase();
      return !query || searchable.includes(query);
    })
    .sort((a, b) => a.latin.localeCompare(b.latin));
  elements.vocabularyCount.textContent = `${words.length} ${words.length === 1 ? 'word' : 'words'}`;
  elements.vocabularyList.innerHTML = words.length > 0
    ? words.map((word) => `
        <div class="vocabulary-row">
          <span class="vocabulary-mark" aria-hidden="true">${escapeHtml(getWordVisual(word))}</span>
          <div>
            <strong>${escapeHtml(word.principalParts || word.latin)}</strong>
            ${word.principalParts ? `<small>Headword: ${escapeHtml(word.latin)}</small>` : ''}
            ${word.isPhrase ? '<small>Phrase card</small>' : ''}
          </div>
          <span>${escapeHtml(word.english)}</span>
          ${renderSpeakButton(word.latin, 'Listen', 0.74)}
        </div>
      `).join('')
    : '<p class="study-empty">No vocabulary matches that search.</p>';
}

function getDictionaryWords() {
  const entries = new Map();
  CURRICULUM_LEVELS.forEach((level) => {
    getVocabularyWordsForCurriculumLevel(level).forEach((word) => {
      const key = normalizeVocabularyHeadword(word.latin);
      if (!key) return;
      if (!entries.has(key)) {
        entries.set(key, {
          ...word,
          grades: [],
          levels: [],
          meanings: []
        });
      }
      const entry = entries.get(key);
      if (!entry.grades.includes(level.grade)) entry.grades.push(level.grade);
      if (!entry.levels.includes(level.year)) entry.levels.push(level.year);
      if (word.english && !entry.meanings.includes(word.english)) entry.meanings.push(word.english);
      if (!entry.principalParts && word.principalParts) entry.principalParts = word.principalParts;
    });
  });
  return [...entries.values()]
    .map((word) => ({ ...word, english: word.meanings.join(' / ') }))
    .sort((a, b) => a.latin.localeCompare(b.latin));
}

function renderDictionary() {
  const query = elements.dictionarySearch.value.trim().toLowerCase();
  const grade = elements.dictionaryGradeFilter.value;
  const words = getDictionaryWords().filter((word) => {
    const matchesGrade = grade === 'all' || word.levels.includes(Number(grade));
    const searchable = `${word.latin} ${word.principalParts || ''} ${word.english}`.toLowerCase();
    return matchesGrade && (!query || searchable.includes(query));
  });
  elements.dictionaryCount.textContent = `${words.length} ${words.length === 1 ? 'entry' : 'entries'}`;
  elements.dictionaryList.innerHTML = words.length > 0
    ? words.map((word) => `
        <div class="vocabulary-row dictionary-row">
          <span class="vocabulary-mark" aria-hidden="true">${escapeHtml(getWordVisual(word))}</span>
          <div>
            <strong>${escapeHtml(word.principalParts || word.latin)}</strong>
            ${word.principalParts ? `<small>Headword: ${escapeHtml(word.latin)}</small>` : ''}
          </div>
          <span>${escapeHtml(word.english)}</span>
          <span class="dictionary-grades" aria-label="Used in years ${word.levels.join(', ')}">
            ${word.levels.map((item) => `<span>Y${item}</span>`).join('')}
          </span>
          ${renderSpeakButton(word.latin, 'Listen', 0.74)}
        </div>
      `).join('')
    : '<p class="study-empty">No dictionary entries match that search.</p>';
}

function showDictionary() {
  renderDictionary();
  showPage('dictionary');
}

function selectStudyMode(mode) {
  if (!['list', 'flashcards'].includes(mode)) return;
  StudyState.mode = mode;
  if (mode !== 'flashcards') stopFlashcardTimer();
  renderStudyPage();
  syncAssignmentHash();
}

function renderFlashcard() {
  const word = StudyState.words[StudyState.index];
  if (!word) {
    elements.flashcardStage.innerHTML = '<p class="study-empty">Choose a year to load flashcards.</p>';
    return;
  }
  noteFlashcardSeen();
  const totalMs = StudyState.durationSeconds * 1000;
  const elapsedPercent = Math.max(0, Math.min(100, ((totalMs - StudyState.remainingMs) / totalMs) * 100));
  elements.flashcardStage.innerHTML = `
    <div class="flashcard-progress" aria-hidden="true"><span style="width:${elapsedPercent}%"></span></div>
    <div class="flashcard-counter">Card ${StudyState.index + 1} of ${StudyState.words.length}</div>
    <div class="flashcard-face">
      <span class="flashcard-kicker">${StudyState.showingAnswer ? 'Meaning' : (word.isPhrase ? 'Latin phrase' : 'Latin')}</span>
      <strong>${escapeHtml(StudyState.showingAnswer ? word.english : (word.principalParts || word.latin))}</strong>
      ${StudyState.showingAnswer && word.principalParts ? `<small>Headword: ${escapeHtml(word.latin)}</small>` : ''}
      ${StudyState.showingAnswer && word.isPhrase && word.note ? `<small>${escapeHtml(word.note)}</small>` : ''}
      ${StudyState.showingAnswer ? '' : renderSpeakButton(word.latin, 'Listen', 0.74)}
    </div>
    <div class="flashcard-time">${formatFlashcardTime(StudyState.remainingMs)}</div>
    ${renderFlashcardCompletion()}
  `;
  elements.flashcardStart.textContent = StudyState.running
    ? 'Pause timer'
    : (StudyState.remainingMs <= 0 ? 'Restart timer' : 'Start timer');
  elements.flashcardFlip.textContent = StudyState.showingAnswer ? 'Show Latin' : 'Reveal answer';
  document.querySelectorAll('[data-flashcard-duration]').forEach((button) => {
    button.classList.toggle('active', Number(button.dataset.flashcardDuration) === StudyState.durationSeconds);
  });
}

function resetFlashcardClock() {
  StudyState.remainingMs = StudyState.durationSeconds * 1000;
  StudyState.lastTick = performance.now();
  StudyState.showingAnswer = false;
  StudyState.seenKeys = new Set();
}

function moveFlashcard(direction) {
  if (StudyState.words.length === 0) return;
  StudyState.index = (StudyState.index + direction + StudyState.words.length) % StudyState.words.length;
  StudyState.showingAnswer = false;
  renderFlashcard();
}

function formatFlashcardTime(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function updateFlashcardClockDisplay() {
  const totalMs = StudyState.durationSeconds * 1000;
  const elapsedPercent = Math.max(0, Math.min(100, ((totalMs - StudyState.remainingMs) / totalMs) * 100));
  const progress = elements.flashcardStage.querySelector('.flashcard-progress span');
  const time = elements.flashcardStage.querySelector('.flashcard-time');
  if (progress) progress.style.width = `${elapsedPercent}%`;
  if (time) time.textContent = formatFlashcardTime(StudyState.remainingMs);
}

function tickFlashcards() {
  const now = performance.now();
  StudyState.remainingMs -= now - StudyState.lastTick;
  StudyState.lastTick = now;
  if (StudyState.remainingMs <= 0) {
    StudyState.remainingMs = 0;
    stopFlashcardTimer();
    renderFlashcard();
    return;
  }
  updateFlashcardClockDisplay();
}

function startFlashcardTimerWhenVisible() {
  const stage = elements.flashcardStage;
  if (!stage || typeof IntersectionObserver !== 'function') return;
  let started = false;
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5);
    if (!visible || started) return;
    if (!pages.study?.classList.contains('active') || StudyState.mode !== 'flashcards') {
      observer.disconnect();
      return;
    }
    started = true;
    observer.disconnect();
    if (StudyState.running) return;
    StudyState.running = true;
    StudyState.lastTick = performance.now();
    StudyState.timerId = window.setInterval(tickFlashcards, 100);
    renderFlashcard();
  }, { threshold: [0.5] });
  observer.observe(stage);
  window.requestAnimationFrame(() => {
    if (!pages.study?.classList.contains('active')) return;
    stage.scrollIntoView({ block: 'center', behavior: 'auto' });
  });
}

function toggleFlashcardTimer() {
  if (StudyState.running) {
    stopFlashcardTimer();
    renderFlashcard();
    return;
  }
  if (StudyState.remainingMs <= 0) resetFlashcardClock();
  StudyState.running = true;
  StudyState.lastTick = performance.now();
  StudyState.timerId = window.setInterval(tickFlashcards, 100);
  renderFlashcard();
}

function stopFlashcardTimer() {
  if (StudyState.timerId) window.clearInterval(StudyState.timerId);
  StudyState.timerId = null;
  StudyState.running = false;
}

function setFlashcardDuration(seconds) {
  stopFlashcardTimer();
  StudyState.durationSeconds = FLASHCARD_SESSION_DURATIONS.includes(seconds)
    ? seconds
    : FLASHCARD_SESSION_DURATIONS[0];
  resetFlashcardClock();
  renderFlashcard();
  syncAssignmentHash();
}

function shuffleFlashcards() {
  for (let index = StudyState.words.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [StudyState.words[index], StudyState.words[swapIndex]] = [StudyState.words[swapIndex], StudyState.words[index]];
  }
  StudyState.index = 0;
  StudyState.showingAnswer = false;
  StudyState.shuffled = true;
  renderFlashcard();
  syncAssignmentHash();
}

function showStudyOrOnboarding() {
  if (!VALID_GRADES.includes(AppState.grade)) {
    showPage('grade');
    return;
  }
  renderStudyPage();
  showPage('study');
}

function showDashboardOrOnboarding() {
  if (!VALID_GRADES.includes(AppState.grade)) {
    showPage('grade');
    return;
  }
  renderDashboard();
  showPage('dashboard');
}

function showLessonListOrOnboarding() {
  if (!VALID_GRADES.includes(AppState.grade)) {
    showPage('grade');
    return;
  }
  renderLessonList();
  showPage('lessonList');
}

function showAssessmentsOrOnboarding() {
  if (!VALID_GRADES.includes(AppState.grade)) {
    showPage('grade');
    return;
  }
  renderAssessments();
  showPage('assessments');
}

function ensureAssessmentDefaults() {
  if (!VALID_GRADES.includes(AppState.grade)) {
    AssessmentState.quizGrade = null;
    AssessmentState.selectedChapterIds = new Set();
    if (!AssessmentState.testLevelPinned || !VALID_GRADES.includes(AssessmentState.testGrade)) {
      AssessmentState.testGrade = VALID_GRADES[0];
    }
    return;
  }

  const activeGrade = AppState.grade;
  if (!AssessmentState.testLevelPinned || !VALID_GRADES.includes(AssessmentState.testGrade)) {
    AssessmentState.testGrade = activeGrade;
  }

  const chapters = getQuizChapters();
  if (AssessmentState.quizGrade !== activeGrade) {
    AssessmentState.quizGrade = activeGrade;
    AssessmentState.selectedChapterIds = new Set(chapters.map((lesson) => lesson.id));
    return;
  }

  const validIds = new Set(chapters.map((lesson) => lesson.id));
  const selectedIds = Array.from(AssessmentState.selectedChapterIds).filter((id) => validIds.has(id));
  AssessmentState.selectedChapterIds = new Set(selectedIds);
}

function getQuizChapters() {
  return getCurrentGradeLessons();
}

function getSelectedQuizLessons() {
  const selectedIds = AssessmentState.selectedChapterIds;
  return getQuizChapters().filter((lesson) => selectedIds.has(lesson.id));
}

function getTestLessons() {
  const testGrade = VALID_GRADES.includes(AssessmentState.testGrade)
    ? AssessmentState.testGrade
    : AppState.grade;
  const grades = new Set(getCurriculumGradesThroughSelection(testGrade));
  return LESSONS.filter((lesson) => grades.has(lesson.grade));
}

function getAssessmentType(question, lesson) {
  if (lesson.kind === 'grammar') return 'grammar';
  if (question.isPhrase) return 'phrase';
  return 'vocabulary';
}

function getAssessmentBank(lessons) {
  return lessons.flatMap((lesson) => {
    return lesson.words.map((question, index) => ({
      ...question,
      assessmentId: `${lesson.id}-${index}`,
      assessmentType: getAssessmentType(question, lesson),
      sourceLessonId: lesson.id,
      sourceLessonTitle: getLessonDisplayTitle(lesson),
      sourceGrade: lesson.grade
    }));
  });
}

function shuffleItems(items) {
  return items
    .map((item) => ({ item, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ item }) => item);
}

function getBalancedQuestionSet(bank, requestedCount) {
  const groups = ['vocabulary', 'grammar', 'phrase'].map((type) =>
    shuffleItems(bank.filter((question) => question.assessmentType === type))
  );
  const selected = [];
  while (selected.length < requestedCount && groups.some((group) => group.length > 0)) {
    groups.forEach((group) => {
      if (group.length > 0 && selected.length < requestedCount) selected.push(group.shift());
    });
  }
  return shuffleItems(selected).map((question) => ({
    ...question,
    assessmentChoices: createChoices(question, bank)
  }));
}

function getAssessmentTypeSummary(bank) {
  const counts = bank.reduce((summary, question) => {
    summary[question.assessmentType] = (summary[question.assessmentType] || 0) + 1;
    return summary;
  }, {});
  return ['vocabulary', 'grammar', 'phrase']
    .filter((type) => counts[type])
    .map((type) => `${ASSESSMENT_TYPE_LABELS[type]} ${counts[type]}`)
    .join(' · ');
}

function renderQuestionCountButtons(mode) {
  const selectedCount = mode === 'quiz'
    ? AssessmentState.quizQuestionCount
    : AssessmentState.testQuestionCount;
  return QUESTION_COUNT_OPTIONS.map((count) => `
    <button
      type="button"
      class="segmented-button${selectedCount === count ? ' active' : ''}"
      data-assessment-count="${count}"
      data-count-mode="${escapeHtml(mode)}"
    >${count}</button>
  `).join('');
}

function renderAssessments() {
  if (!elements.assessmentBuilder || !elements.assessmentRunner) return;
  ensureAssessmentDefaults();
  const quizChapters = getQuizChapters();
  const selectedQuizLessons = getSelectedQuizLessons();
  const quizBank = getAssessmentBank(selectedQuizLessons);
  const testLessons = getTestLessons();
  const testBank = getAssessmentBank(testLessons);

  elements.assessmentBuilder.innerHTML = `
    <div class="assessment-mode-tabs" role="tablist" aria-label="Assessment type">
      <button type="button" class="segmented-button${AssessmentState.mode === 'quiz' ? ' active' : ''}" role="tab" id="assessmentTabQuiz" data-assessment-mode="quiz" aria-selected="${AssessmentState.mode === 'quiz' ? 'true' : 'false'}" aria-controls="assessmentSetupPanel" tabindex="${AssessmentState.mode === 'quiz' ? '0' : '-1'}">Quiz</button>
      <button type="button" class="segmented-button${AssessmentState.mode === 'test' ? ' active' : ''}" role="tab" id="assessmentTabTest" data-assessment-mode="test" aria-selected="${AssessmentState.mode === 'test' ? 'true' : 'false'}" aria-controls="assessmentSetupPanel" tabindex="${AssessmentState.mode === 'test' ? '0' : '-1'}">Test</button>
    </div>
    <div id="assessmentSetupPanel" role="tabpanel" aria-labelledby="${AssessmentState.mode === 'quiz' ? 'assessmentTabQuiz' : 'assessmentTabTest'}">
    ${AssessmentState.mode === 'quiz'
      ? renderQuizBuilder(quizChapters, quizBank)
      : renderTestBuilder(testBank)}
    </div>
    <p class="assessment-message" aria-live="polite">${escapeHtml(AssessmentState.message)}</p>
    <button type="button" class="primary-button assessment-start-button" data-assessment-action="start">
      Start ${AssessmentState.mode === 'quiz' ? 'quiz' : 'test'}
    </button>
  `;
  renderAssessmentRunner();
}

function renderQuizBuilder(chapters, bank) {
  const chapterCards = chapters.map((lesson, index) => {
    const selected = AssessmentState.selectedChapterIds.has(lesson.id);
    const type = lesson.kind === 'grammar' ? 'Grammar' : 'Vocabulary';
    const detail = getLessonCountLabel(lesson);
    return `
      <button type="button" class="chapter-option${selected ? ' selected' : ''}" data-chapter-id="${escapeHtml(lesson.id)}">
        <span>Chapter ${index + 1} · ${escapeHtml(type)}</span>
        <strong>${escapeHtml(getLessonDisplayTitle(lesson))}</strong>
        <small>${escapeHtml(detail)}</small>
      </button>
    `;
  }).join('');

  return `
    <section class="assessment-setup-panel">
      <h3>Quiz setup</h3>
      <label class="field-label">Questions</label>
      <div class="segmented-control">${renderQuestionCountButtons('quiz')}</div>
      <div class="chapter-toolbar">
        <label class="field-label">Chapters</label>
        <div>
          <button type="button" class="text-button" data-assessment-action="select-all">Select all</button>
          <button type="button" class="text-button" data-assessment-action="clear-chapters">Clear</button>
        </div>
      </div>
      <div class="chapter-grid">${chapterCards}</div>
      <p class="assessment-summary">${escapeHtml(getAssessmentTypeSummary(bank) || 'Select chapters to build a quiz.')}</p>
    </section>
  `;
}

function renderTestBuilder(bank) {
  const gradeButtons = CURRICULUM_LEVELS.map((level) => `
    <button
      type="button"
      class="segmented-button${AssessmentState.testGrade === level.grade ? ' active' : ''}"
      data-test-grade="${level.grade}"
    >${escapeHtml(level.label)}</button>
  `).join('');
  return `
    <section class="assessment-setup-panel">
      <h3>Test setup</h3>
      <label class="field-label">Level</label>
      <div class="grade-segmented-control">${gradeButtons}</div>
      <label class="field-label">Questions</label>
      <div class="segmented-control">${renderQuestionCountButtons('test')}</div>
      <p class="assessment-summary">
        Covers through ${escapeHtml(getCurriculumLevelTitle(AssessmentState.testGrade))}: ${escapeHtml(getAssessmentTypeSummary(bank) || 'no questions available')}.
      </p>
    </section>
  `;
}

function renderAssessmentRunner() {
  if (!elements.assessmentRunner) return;
  if (AssessmentState.completed) {
    elements.assessmentRunner.innerHTML = renderAssessmentResult();
    return;
  }

  if (AssessmentState.questions.length === 0) {
    elements.assessmentRunner.innerHTML = `
      <section class="assessment-empty">
        <span class="section-kicker">Ready when you are</span>
        <h3>Build an assessment.</h3>
        <p>Quizzes use selected chapters. Tests use all content through the level you choose.</p>
      </section>
    `;
    return;
  }

  const question = AssessmentState.questions[AssessmentState.currentQuestionIndex];
  const choices = question.assessmentChoices || createChoices(question, AssessmentState.questions);
  const promptHtml = question.prompt
    ? escapeHtml(question.prompt)
    : `What does <span>${escapeHtml(question.latin)}</span> mean?`;
  const contextHtml = question.context
    ? `<p class="question-context">${escapeHtml(question.context)}</p>`
    : '';
  const typeLabel = ASSESSMENT_TYPE_LABELS[question.assessmentType] || 'Question';

  elements.assessmentRunner.innerHTML = `
    <section class="assessment-question-card">
      <div class="assessment-question-header">
        <span>${escapeHtml(typeLabel)}</span>
        <strong>${AssessmentState.currentQuestionIndex + 1}/${AssessmentState.questions.length}</strong>
      </div>
      <p class="assessment-source">${escapeHtml(question.sourceLessonTitle)} · ${escapeHtml(getLessonLevelName(question.sourceGrade))}</p>
      ${contextHtml}
      <h3>${promptHtml}</h3>
      <div class="options-grid assessment-options-grid">
        ${choices.map((choice) => `
          <button type="button" class="option-button" data-assessment-option="${escapeHtml(choice)}">${escapeHtml(choice)}</button>
        `).join('')}
      </div>
      <p class="lesson-result assessment-result" data-assessment-result></p>
      <div class="assessment-runner-actions">
        <button type="button" class="secondary-button" data-assessment-action="reset">Reset</button>
        <button type="button" class="primary-button" data-assessment-action="next">
          ${AssessmentState.answerChecked
            ? (AssessmentState.currentQuestionIndex < AssessmentState.questions.length - 1 ? 'Next question' : 'Finish')
            : 'Check answer'}
        </button>
      </div>
    </section>
  `;
  if (AssessmentState.selectedOption) {
    selectAssessmentOption(AssessmentState.selectedOption);
  }
}

function renderAssessmentResult() {
  const total = AssessmentState.questions.length;
  const percent = total > 0 ? Math.round((AssessmentState.correctCount / total) * 100) : 0;
  const modeLabel = AssessmentState.mode === 'quiz' ? 'Quiz' : 'Test';
  const breakdown = renderAssessmentBreakdown();
  return `
    <section class="assessment-result-card">
      <span class="section-kicker">${escapeHtml(modeLabel)} complete</span>
      <h3>${AssessmentState.correctCount}/${total}</h3>
      <p>${percent}% correct</p>
      ${breakdown}
      <div class="assessment-runner-actions">
        <button type="button" class="secondary-button" data-assessment-action="reset">Build another</button>
        <button type="button" class="primary-button" data-assessment-action="start">Try again</button>
      </div>
      ${renderCompletionCode({
        kind: AssessmentState.mode === 'quiz' ? 'quiz' : 'test',
        id: `y${yearForGrade(AssessmentState.mode === 'quiz' ? AppState.grade : AssessmentState.testGrade) || 1}-${AssessmentState.mode === 'quiz' ? AssessmentState.quizQuestionCount : AssessmentState.testQuestionCount}`,
        mode: AssessmentState.mode,
        score: AssessmentState.correctCount,
        total,
        missed: AssessmentState.missedHeadwords
      })}
    </section>
  `;
}

function renderAssessmentBreakdown() {
  const groups = AssessmentState.questions.reduce((summary, question, index) => {
    const type = question.assessmentType;
    if (!summary[type]) summary[type] = { correct: 0, total: 0 };
    summary[type].total += 1;
    if (AssessmentState.responses[index]?.correct) summary[type].correct += 1;
    return summary;
  }, {});
  const rows = ['vocabulary', 'grammar', 'phrase']
    .filter((type) => groups[type])
    .map((type) => `
      <div>
        <span>${ASSESSMENT_TYPE_LABELS[type]}</span>
        <strong>${groups[type].correct}/${groups[type].total}</strong>
      </div>
    `).join('');
  return rows ? `<div class="assessment-breakdown">${rows}</div>` : '';
}

function startAssessment() {
  ensureAssessmentDefaults();
  const requestedCount = AssessmentState.mode === 'quiz'
    ? AssessmentState.quizQuestionCount
    : AssessmentState.testQuestionCount;
  const lessons = AssessmentState.mode === 'quiz' ? getSelectedQuizLessons() : getTestLessons();
  const bank = getAssessmentBank(lessons);

  if (bank.length === 0) {
    AssessmentState.message = AssessmentState.mode === 'quiz'
      ? 'Select at least one chapter with questions.'
      : 'No questions are available for this level.';
    renderAssessments();
    return;
  }

  const questions = getBalancedQuestionSet(bank, requestedCount);
  AssessmentState.questions = questions;
  AssessmentState.responses = [];
  AssessmentState.currentQuestionIndex = 0;
  AssessmentState.selectedOption = null;
  AssessmentState.answerChecked = false;
  AssessmentState.correctCount = 0;
  AssessmentState.completed = false;
  AssessmentState.missedHeadwords = [];
  AssessmentState.message = questions.length < requestedCount
    ? `Using all ${questions.length} available questions from this selection.`
    : '';
  renderAssessments();
}

function resetAssessment() {
  AssessmentState.questions = [];
  AssessmentState.responses = [];
  AssessmentState.currentQuestionIndex = 0;
  AssessmentState.selectedOption = null;
  AssessmentState.answerChecked = false;
  AssessmentState.correctCount = 0;
  AssessmentState.completed = false;
  AssessmentState.missedHeadwords = [];
  AssessmentState.message = '';
  renderAssessments();
  syncAssignmentHash();
}

function startQuickFlashcards(grade) {
  const normalizedGrade = normalizeCurriculumGrade(grade);
  if (!normalizedGrade) return;

  stopFlashcardTimer();
  AppState.grade = normalizedGrade;
  AssessmentState.testLevelPinned = false;
  AssessmentState.testGrade = normalizedGrade;
  localStorage.setItem(GRADE_STORAGE_KEY, String(normalizedGrade));
  saveState();
  renderGradeOptions();

  StudyState.mode = 'flashcards';
  StudyState.durationSeconds = 600;
  StudyState.words = [];
  ensureStudyWords();
  shuffleFlashcards();
  resetFlashcardClock();
  StudyState.running = false;
  renderStudyPage();
  showPage('study', { preserveScroll: true });
  startFlashcardTimerWhenVisible();
}

function selectAssessmentOption(value) {
  if (AssessmentState.answerChecked || !elements.assessmentRunner) return;
  AssessmentState.selectedOption = value;
  elements.assessmentRunner.querySelectorAll('[data-assessment-option]').forEach((button) => {
    button.classList.toggle('selected', button.textContent === value);
  });
}

function checkAssessmentAnswer() {
  if (AssessmentState.answerChecked) return;
  const question = AssessmentState.questions[AssessmentState.currentQuestionIndex];
  if (!question) return;
  const result = elements.assessmentRunner?.querySelector('[data-assessment-result]');
  if (!AssessmentState.selectedOption) {
    if (result) result.textContent = 'Choose an answer first.';
    return;
  }

  const answer = questionAnswer(question);
  const correct = AssessmentState.selectedOption === answer;
  elements.assessmentRunner.querySelectorAll('[data-assessment-option]').forEach((button) => {
    if (button.textContent === answer) button.classList.add('correct');
    if (button.textContent === AssessmentState.selectedOption && !correct) button.classList.add('wrong');
    button.disabled = true;
  });

  AssessmentState.responses[AssessmentState.currentQuestionIndex] = {
    selected: AssessmentState.selectedOption,
    correct,
    type: question.assessmentType
  };
  AssessmentState.correctCount = AssessmentState.responses.filter((response) => response?.correct).length;
  if (!correct) AssessmentState.missedHeadwords.push(question.latin);
  AssessmentState.answerChecked = true;

  if (result) {
    result.textContent = question.explanation
      ? `${correct ? 'Correct.' : 'Correct answer: ' + answer + '.'} ${question.explanation}`
      : `${question.latin} means ${question.english}.`;
  }

  const nextButton = elements.assessmentRunner?.querySelector('[data-assessment-action="next"]');
  if (nextButton) {
    nextButton.textContent = AssessmentState.currentQuestionIndex < AssessmentState.questions.length - 1
      ? 'Next question'
      : 'Finish';
  }
}

function nextAssessmentQuestion() {
  if (!AssessmentState.answerChecked) {
    checkAssessmentAnswer();
    return;
  }
  if (AssessmentState.currentQuestionIndex < AssessmentState.questions.length - 1) {
    AssessmentState.currentQuestionIndex += 1;
    AssessmentState.selectedOption = null;
    AssessmentState.answerChecked = false;
    renderAssessmentRunner();
    return;
  }
  AssessmentState.completed = true;
  renderAssessments();
}

const NleState = {
  view: 'levels',
  levelId: null,
  category: '',
  mode: '',
  questions: [],
  answers: {},
  index: 0,
  checked: false,
  practiceCount: 10,
  remainingMs: 0,
  lastTick: 0,
  timerId: null,
  startedAt: 0,
  result: null,
  message: '',
  confirmSubmit: false
};

function stopNleTimer() {
  if (NleState.timerId) {
    window.clearInterval(NleState.timerId);
    NleState.timerId = null;
  }
}

function startNleTimer() {
  stopNleTimer();
  NleState.lastTick = performance.now();
  NleState.timerId = window.setInterval(tickNleExam, 250);
}

function formatNleClock(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function tickNleExam() {
  if (NleState.view !== 'exam') return;
  const now = performance.now();
  NleState.remainingMs = Math.max(0, NleState.remainingMs - (now - NleState.lastTick));
  NleState.lastTick = now;
  const clock = elements.nleStage?.querySelector('[data-nle-clock]');
  if (clock) clock.textContent = formatNleClock(NleState.remainingMs);
  if (NleState.remainingMs <= 0) finishNleSession('exam');
}

function suggestedNleLevelId() {
  if (typeof getSuggestedNleLevelId !== 'function') return null;
  const level = getCurriculumLevelByGrade(AppState.grade);
  return level ? getSuggestedNleLevelId(level.year) : null;
}

function nleLevelProgress(levelId) {
  const progress = typeof normalizeNleProgress === 'function'
    ? normalizeNleProgress(AppState.progress.nle)
    : { levels: {} };
  return progress.levels[levelId] || { categoryStats: {}, exams: [] };
}

function showNlePrep() {
  assignmentFocus = null;
  NleState.view = 'levels';
  NleState.message = '';
  NleState.confirmSubmit = false;
  renderNle();
  showPage('nle');
}

function renderNle() {
  if (!elements.nleStage || typeof NLE_LEVELS === 'undefined') return;
  if (elements.nleBackButton) {
    elements.nleBackButton.textContent = NleState.view === 'levels' ? 'Home' : 'Back';
  }
  if (NleState.view === 'level') renderNleLevel();
  else if (NleState.view === 'practice' || NleState.view === 'exam') renderNleQuestion();
  else if (NleState.view === 'results') renderNleResults();
  else renderNleLevels();
}

function renderNleLevels() {
  const suggested = suggestedNleLevelId();
  const cards = NLE_LEVELS.map((level) => {
    const progress = nleLevelProgress(level.id);
    const latestExam = [...progress.exams].reverse().find((exam) => exam.mode === 'exam');
    const questionCount = NLE_QUESTIONS.filter((question) => question.level === level.id).length;
    const status = latestExam
      ? `Latest exam ${latestExam.correct}/${latestExam.total}`
      : (questionCount ? `${questionCount} original questions` : 'Syllabus guide');
    return `
      <button type="button" class="nle-level-card${suggested === level.id ? ' suggested' : ''}" data-nle-action="open-level" data-nle-level="${escapeHtml(level.id)}">
        <span>${escapeHtml(level.legacyName)}</span>
        <strong>${escapeHtml(level.name)}</strong>
        <small>${escapeHtml(level.yearNote)}</small>
        <small>${escapeHtml(status)}</small>
      </button>
    `;
  }).join('');
  elements.nleStage.innerHTML = `
    <p class="nle-links">
      <a href="${NLE_LINKS.about}" target="_blank" rel="noopener noreferrer">What the NLE is</a>
      <a href="${NLE_LINKS.syllabus}" target="_blank" rel="noopener noreferrer">Official syllabus</a>
      <a href="${NLE_LINKS.exams}" target="_blank" rel="noopener noreferrer">Past exams on nle.org</a>
    </p>
    <div class="nle-level-grid">${cards}</div>
  `;
}

function renderNleLevel() {
  const level = getNleLevel(NleState.levelId);
  if (!level) {
    renderNleLevels();
    return;
  }
  const progress = nleLevelProgress(level.id);
  const sample = buildNleExam(level.id, createNleRng(1));
  const syllabus = level.syllabus.map((group) => `
    <section>
      <h3>${escapeHtml(group.heading)}</h3>
      <ul>${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </section>
  `).join('');
  const categories = NLE_CATEGORIES.map((category) => {
    const count = NLE_QUESTIONS.filter((question) => question.level === level.id && question.category === category.id).length;
    if (!count) return '';
    const stats = progress.categoryStats[category.id];
    const statText = stats ? `${stats.correct}/${stats.attempts} correct in practice` : `${count} questions`;
    return `
      <div class="nle-category-assignment">
        <button type="button" class="nle-category-card" data-nle-action="start-practice" data-nle-category="${escapeHtml(category.id)}">
          <strong>${escapeHtml(category.label)}</strong>
          <span>${escapeHtml(statText)}</span>
        </button>
        <button type="button" class="text-button" data-copy-assignment="practice" data-assignment-category="${escapeHtml(category.id)}">Copy practice link</button>
      </div>
    `;
  }).join('');
  const examLabel = sample?.complete
    ? `Start ${level.questionCount}-question exam`
    : (sample?.questions.length ? `Start shorter practice (${sample.questions.length} questions)` : '');
  const recent = progress.exams.slice(-3).reverse().map((exam) => (
    `<li>${escapeHtml(exam.mode === 'exam' ? 'Exam' : 'Practice')} · ${exam.correct}/${exam.total}</li>`
  )).join('');
  elements.nleStage.innerHTML = `
    <div class="nle-level-heading">
      <span class="section-kicker">${escapeHtml(level.legacyName)}</span>
      <h3>${escapeHtml(level.name)}</h3>
      <p>${escapeHtml(level.yearNote)} ${escapeHtml(level.audience)}</p>
      <p>${escapeHtml(level.formatNote)}</p>
    </div>
    <div class="nle-actions">
      ${examLabel ? `<button type="button" class="primary-button" data-nle-action="start-exam">${escapeHtml(examLabel)}</button>` : ''}
      ${examLabel ? '<button type="button" class="secondary-button" data-copy-assignment="exam">Copy exam link</button>' : ''}
      <a class="secondary-button nle-text-link" href="${NLE_LINKS.syllabus}" target="_blank" rel="noopener noreferrer">Official syllabus</a>
    </div>
    ${renderNleAssignmentNote(level)}
    ${recent ? `<ul class="nle-recent">${recent}</ul>` : ''}
    ${categories ? `<h3 class="nle-subhead">Practice by category</h3><div class="nle-category-grid">${categories}</div>
    <div class="nle-count-row">
      <span>Practice length</span>
      ${[5, 10, 15].map((count) => `
        <button type="button" class="segmented-button${NleState.practiceCount === count ? ' active' : ''}" data-nle-action="set-count" data-nle-count="${count}">${count}</button>
      `).join('')}
    </div>` : '<p>Question practice for this level is still to come. Use the syllabus, then try official past exams on nle.org.</p>'}
    <div class="nle-syllabus">${syllabus}</div>
  `;
}

function passageMarkup(passage) {
  if (!passage) return '';
  const glossary = Array.isArray(passage.glossary) && passage.glossary.length
    ? `<ul class="nle-glossary">${passage.glossary.map(([latin, english]) => `<li><strong>${escapeHtml(latin)}</strong> ${escapeHtml(english)}</li>`).join('')}</ul>`
    : '';
  return `
    <section class="nle-passage-card">
      <h3>${escapeHtml(passage.title)}</h3>
      <p class="nle-passage">${escapeHtml(passage.latin)}</p>
      ${glossary}
    </section>
  `;
}

function renderNleQuestion() {
  const question = NleState.questions[NleState.index];
  const level = getNleLevel(NleState.levelId);
  if (!question || !level) return;
  const passage = question.passageId ? getNlePassage(question.passageId) : null;
  const showPassage = NleState.index === 0 || NleState.questions[NleState.index - 1]?.passageId !== question.passageId;
  const category = getNleCategory(question.category);
  const selected = NleState.answers[question.id] || '';
  const isExam = NleState.view === 'exam';
  const clock = isExam ? `<strong data-nle-clock role="timer">${formatNleClock(NleState.remainingMs)}</strong>` : '';
  const navigator = isExam ? `
    <div class="nle-nav" aria-label="Questions">
      ${NleState.questions.map((item, index) => `
        <button type="button" class="nle-nav-button${index === NleState.index ? ' current' : ''}${NleState.answers[item.id] ? ' answered' : ''}" data-nle-action="goto" data-nle-index="${index}">${index + 1}</button>
      `).join('')}
    </div>
  ` : '';
  const choices = question.choices.map((choice) => {
    const classes = ['option-button'];
    if (selected === choice) classes.push('selected');
    if (!isExam && NleState.checked && choice === question.answer) classes.push('correct');
    if (!isExam && NleState.checked && selected === choice && choice !== question.answer) classes.push('wrong');
    return `<button type="button" class="${classes.join(' ')}" data-nle-action="choose" data-nle-choice="${escapeHtml(choice)}" ${!isExam && NleState.checked ? 'disabled' : ''}>${escapeHtml(choice)}</button>`;
  }).join('');
  const feedback = !isExam && NleState.checked
    ? `<p class="nle-feedback">${escapeHtml(selected === question.answer ? 'Correct.' : 'Not yet.')} ${escapeHtml(question.explanation)}</p>`
    : '';
  const primary = isExam
    ? `<button type="button" class="primary-button" data-nle-action="submit">${NleState.confirmSubmit ? 'Submit now' : 'Submit exam'}</button>`
    : `<button type="button" class="primary-button" data-nle-action="${NleState.checked ? 'next' : 'check'}">${NleState.checked ? (NleState.index < NleState.questions.length - 1 ? 'Next' : 'Finish') : 'Check answer'}</button>`;
  const examNext = isExam && NleState.index < NleState.questions.length - 1
    ? `<button type="button" class="secondary-button" data-nle-action="goto" data-nle-index="${NleState.index + 1}">Next</button>`
    : '';
  elements.nleStage.innerHTML = `
    <div class="nle-question-top">
      <span>${escapeHtml(isExam ? (NLE_SECTION_LABELS[question.section] || category?.label || 'Question') : (category?.label || 'Practice'))}</span>
      <strong>${NleState.index + 1}/${NleState.questions.length}</strong>
      ${clock}
    </div>
    ${navigator}
    ${showPassage ? passageMarkup(passage) : ''}
    ${question.context ? `<p class="question-context">${escapeHtml(question.context)}</p>` : ''}
    <h3 class="nle-prompt">${escapeHtml(question.prompt)}</h3>
    <div class="options-grid nle-options">${choices}</div>
    ${feedback}
    <p class="assessment-message">${escapeHtml(NleState.message)}</p>
    <div class="nle-actions">
      ${isExam && NleState.index > 0 ? '<button type="button" class="secondary-button" data-nle-action="prev">Previous</button>' : ''}
      ${examNext}
      ${primary}
    </div>
  `;
}

function renderNleResults() {
  const result = NleState.result;
  const level = getNleLevel(NleState.levelId);
  if (!result || !level) return;
  const categoryRows = Object.entries(result.categories).map(([categoryId, stats]) => {
    const category = getNleCategory(categoryId);
    return `<div><span>${escapeHtml(category?.label || categoryId)}</span><strong>${stats.correct}/${stats.total}</strong></div>`;
  }).join('');
  const missed = result.missed.map((item) => `
    <article class="nle-miss">
      ${item.context ? `<p class="question-context">${escapeHtml(item.context)}</p>` : ''}
      <h3>${escapeHtml(item.prompt)}</h3>
      <p>Your answer: ${escapeHtml(item.selected || 'left blank')}</p>
      <p>Answer: ${escapeHtml(item.answer)}</p>
      <p>${escapeHtml(item.explanation)}</p>
    </article>
  `).join('');
  elements.nleStage.innerHTML = `
    <section class="nle-results">
      <span class="section-kicker">${result.mode === 'exam' ? 'Practice exam' : 'Practice'}</span>
      <h3>${result.correct}/${result.total}</h3>
      <p>${result.percent}% correct · ${escapeHtml(level.name)}</p>
      <div class="assessment-breakdown">${categoryRows}</div>
      ${result.missed.length ? `<h3 class="nle-subhead">Review missed items</h3>${missed}` : '<p>Every answer was correct.</p>'}
      <div class="nle-actions">
        ${result.missed.length ? '<button type="button" class="secondary-button" data-nle-action="review-missed">Practice missed</button>' : ''}
        <button type="button" class="primary-button" data-nle-action="back-level">Back to level</button>
      </div>
      ${renderCompletionCode({
        kind: 'nle',
        id: level.id,
        mode: result.mode === 'exam' ? 'exam' : (NleState.category || 'practice'),
        score: result.correct,
        total: result.total,
        missed: result.missed.map((item) => item.id)
      })}
    </section>
  `;
}

function renderNleDashboard() {
  if (!elements.nleDashboardSummary || typeof NLE_LEVELS === 'undefined') return;
  const progress = normalizeNleProgress(AppState.progress.nle);
  const rows = Object.entries(progress.levels).flatMap(([levelId, entry]) => {
    const level = getNleLevel(levelId);
    const latest = [...entry.exams].reverse().find((exam) => exam.mode === 'exam') || entry.exams[entry.exams.length - 1];
    if (!level || !latest) return [];
    return [`<p><strong>${escapeHtml(level.name)}</strong> · ${latest.correct}/${latest.total}</p>`];
  });
  elements.nleDashboardSummary.innerHTML = rows.length
    ? rows.join('')
    : '<p>No NLE practice yet.</p>';
}

function beginNleQuestions(questions, mode) {
  const level = getNleLevel(NleState.levelId);
  if (!level || !questions.length) {
    NleState.message = 'No original questions are ready for that choice yet.';
    NleState.view = 'level';
    renderNle();
    return;
  }
  stopNleTimer();
  NleState.mode = mode;
  NleState.view = mode === 'exam' ? 'exam' : 'practice';
  NleState.questions = questions;
  NleState.answers = {};
  NleState.index = 0;
  NleState.checked = false;
  NleState.result = null;
  NleState.confirmSubmit = false;
  NleState.startedAt = Date.now();
  NleState.remainingMs = level.timeLimitSeconds * 1000;
  NleState.message = mode === 'exam' && questions.length < level.questionCount
    ? `This set has ${questions.length} questions. A full ${level.name} exam has ${level.questionCount}.`
    : '';
  renderNle();
  showPage('nle');
  if (mode === 'exam') startNleTimer();
}

function startNlePractice(category) {
  NleState.category = category;
  const questions = buildNlePracticeSet(NleState.levelId, category, NleState.practiceCount, Math.random);
  beginNleQuestions(questions, 'practice');
}

function startNleExam() {
  NleState.category = '';
  const exam = buildNleExam(NleState.levelId, Math.random);
  beginNleQuestions(exam?.questions || [], 'exam');
}

function finishNleSession(mode) {
  if (NleState.view === 'results') return;
  stopNleTimer();
  const level = getNleLevel(NleState.levelId);
  if (!level) return;
  const score = scoreNleExam(NleState.questions, NleState.answers);
  const secondsUsed = mode === 'exam'
    ? Math.max(0, Math.round((level.timeLimitSeconds * 1000 - NleState.remainingMs) / 1000))
    : Math.max(0, Math.round((Date.now() - NleState.startedAt) / 1000));
  const record = normalizeNleExamRecord({
    id: `nle-${mode}-${Date.now()}`,
    completedAt: new Date().toISOString(),
    mode,
    levelId: level.id,
    category: mode === 'practice' ? NleState.category : '',
    correct: score.correct,
    total: score.total,
    percent: score.percent,
    secondsUsed,
    categories: score.categories,
    missed: score.missed
  });
  const progress = normalizeNleProgress(AppState.progress.nle);
  if (!progress.levels[level.id]) progress.levels[level.id] = { categoryStats: {}, exams: [] };
  if (mode === 'practice' && NleState.category && score.categories[NleState.category]) {
    const stats = progress.levels[level.id].categoryStats[NleState.category] || { attempts: 0, correct: 0, sessions: 0 };
    stats.attempts += score.categories[NleState.category].total;
    stats.correct += score.categories[NleState.category].correct;
    stats.sessions += 1;
    progress.levels[level.id].categoryStats[NleState.category] = stats;
  }
  if (record) progress.levels[level.id].exams.push(record);
  AppState.progress.nle = progress;
  NleState.result = record;
  NleState.view = 'results';
  NleState.confirmSubmit = false;
  saveState();
  renderNle();
}

function handleNleClick(event) {
  const target = event.target instanceof Element ? event.target : null;
  const actionButton = target?.closest('[data-nle-action]');
  if (!actionButton || !elements.nleStage?.contains(actionButton)) return;
  const action = actionButton.dataset.nleAction;
  if (action === 'open-level') {
    assignmentFocus = null;
    NleState.levelId = actionButton.dataset.nleLevel;
    NleState.view = 'level';
    NleState.message = '';
    renderNle();
    syncAssignmentHash();
    return;
  }
  if (action === 'set-count') {
    NleState.practiceCount = Number(actionButton.dataset.nleCount) || 10;
    if (assignmentFocus?.category) assignmentFocus = { ...assignmentFocus, count: NleState.practiceCount };
    renderNle();
    syncAssignmentHash();
    return;
  }
  if (action === 'start-practice') {
    assignmentFocus = null;
    startNlePractice(actionButton.dataset.nleCategory);
    return;
  }
  if (action === 'start-exam') {
    assignmentFocus = null;
    startNleExam();
    return;
  }
  if (action === 'choose' && !(NleState.view === 'practice' && NleState.checked)) {
    const question = NleState.questions[NleState.index];
    if (!question) return;
    NleState.answers[question.id] = actionButton.dataset.nleChoice || '';
    NleState.confirmSubmit = false;
    renderNleQuestion();
    return;
  }
  if (action === 'check') {
    const question = NleState.questions[NleState.index];
    if (!question) return;
    if (!NleState.answers[question.id]) {
      NleState.message = 'Choose an answer first.';
      renderNleQuestion();
      return;
    }
    NleState.checked = true;
    NleState.message = '';
    renderNleQuestion();
    return;
  }
  if (action === 'next') {
    if (NleState.index < NleState.questions.length - 1) {
      NleState.index += 1;
      NleState.checked = false;
      NleState.message = '';
      renderNleQuestion();
      return;
    }
    finishNleSession('practice');
    return;
  }
  if (action === 'prev') {
    NleState.index = Math.max(0, NleState.index - 1);
    NleState.confirmSubmit = false;
    renderNleQuestion();
    return;
  }
  if (action === 'goto') {
    NleState.index = Number(actionButton.dataset.nleIndex) || 0;
    NleState.confirmSubmit = false;
    renderNleQuestion();
    return;
  }
  if (action === 'submit') {
    const unanswered = NleState.questions.filter((question) => !NleState.answers[question.id]).length;
    if (unanswered && !NleState.confirmSubmit) {
      NleState.confirmSubmit = true;
      NleState.message = `${unanswered} question${unanswered === 1 ? ' is' : 's are'} still blank. Submit again to finish.`;
      renderNleQuestion();
      return;
    }
    finishNleSession('exam');
    return;
  }
  if (action === 'review-missed' && NleState.result?.missed.length) {
    NleState.category = 'review';
    beginNleQuestions(NleState.result.missed.map((item) => ({
      id: item.id,
      level: NleState.levelId,
      category: item.category,
      section: item.section,
      prompt: item.prompt,
      choices: item.choices,
      answer: item.answer,
      explanation: item.explanation,
      passageId: item.passageId,
      context: item.context
    })), 'practice');
    return;
  }
  if (action === 'back-level') {
    NleState.view = 'level';
    NleState.message = '';
    renderNle();
  }
}

function leaveNleView() {
  assignmentFocus = null;
  if (NleState.view === 'levels') {
    showHomeOrWelcome();
    return;
  }
  if (NleState.view === 'exam' && NleState.message !== 'Leave the exam? Choose Back again to exit without saving this attempt.') {
    NleState.message = 'Leave the exam? Choose Back again to exit without saving this attempt.';
    renderNleQuestion();
    return;
  }
  stopNleTimer();
  NleState.confirmSubmit = false;
  NleState.message = '';
  if (NleState.view === 'level') NleState.view = 'levels';
  else NleState.view = 'level';
  renderNle();
  syncAssignmentHash();
}

function setupEvents() {
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const copyLink = target?.closest('[data-copy-assignment]');
    if (copyLink) {
      copyAssignmentLink(copyLink);
      return;
    }
    const copyCode = target?.closest('[data-copy-completion]');
    if (copyCode) {
      copyText(copyCode.dataset.copyCompletion || '').then(() => announceAssignment('Completion code copied.'));
      return;
    }
  });
  document.getElementById('checkCompletionCodeButton')?.addEventListener('click', renderCompletionCheck);
  elements.startButton.addEventListener('click', showLessonListOrOnboarding);
  elements.welcomeAccountButton.addEventListener('click', () => {
    ensureSupabase().catch(() => {});
    renderAccountControls();
    showPage('account');
  });
  elements.homeContinueButton.addEventListener('click', () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      openLesson(nextLesson.id);
      return;
    }
    showLessonListOrOnboarding();
  });
  elements.homeQuizButton.addEventListener('click', showAssessmentsOrOnboarding);
  elements.homeLessonsButton.addEventListener('click', showLessonListOrOnboarding);
  elements.homePracticeLessons.addEventListener('click', showLessonListOrOnboarding);
  elements.homePracticeStudy.addEventListener('click', showStudyOrOnboarding);
  elements.homePracticeDictionary.addEventListener('click', showDictionary);
  elements.homePracticeAssessments.addEventListener('click', showAssessmentsOrOnboarding);
  elements.homePracticeDashboard.addEventListener('click', showDashboardOrOnboarding);
  elements.homePathList.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-home-lesson-id]') : null;
    if (target) openLesson(target.dataset.homeLessonId);
  });
  [pages.welcome, pages.home].forEach((page) => page.addEventListener('click', (event) => {
    const target = event.target instanceof Element
      ? event.target.closest('[data-home-flashcards-grade]')
      : null;
    if (target) startQuickFlashcards(Number(target.dataset.homeFlashcardsGrade));
  }));
  elements.accountButton.addEventListener('click', () => {
    ensureSupabase().catch(() => {});
    renderAccountControls();
    showForgotPasswordForm(false);
    showPage('account');
  });
  elements.contactButton?.addEventListener('click', () => {
    showPage('contact');
  });
  elements.contactBackButton?.addEventListener('click', showBestLearningPage);
  elements.accountBackButton.addEventListener('click', showBestLearningPage);

  // Auth mode tabs
  elements.authTabSignIn?.addEventListener('click', () => setAuthMode('signin'));
  elements.authTabSignUp?.addEventListener('click', () => setAuthMode('signup'));

  // Sign-in / Sign-up form submit
  elements.accountForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = elements.accountEmailInput.value;
    const password = elements.accountPasswordInput?.value || '';
    if (_authMode === 'signup') {
      if (!elements.accountCreatorRole?.value || !elements.accountEligibilityConfirmation?.checked) {
        setAccountMessage('Confirm who is creating the account and accept the privacy terms.', 'error');
        return;
      }
      signUpWithEmail(email, password);
    } else {
      signInWithEmail(email, password);
    }
  });

  // Forgot password
  elements.forgotPasswordButton?.addEventListener('click', () => showForgotPasswordForm(true));
  elements.cancelResetButton?.addEventListener('click', () => showForgotPasswordForm(false));
  elements.forgotPasswordForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    sendPasswordReset(elements.resetEmailInput.value);
  });

  // Password reset page
  elements.resetPasswordForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    updatePassword(
      elements.newPasswordInput?.value || '',
      elements.confirmPasswordInput?.value || ''
    );
  });

  elements.continueGuestButton.addEventListener('click', continueAsGuest);
  elements.signOutButton.addEventListener('click', continueAsGuest);
  elements.exportAccountButton?.addEventListener('click', exportAccountData);
  elements.deleteAccountButton?.addEventListener('click', openDeleteAccountDialog);
  elements.cancelDeleteAccountButton?.addEventListener('click', closeDeleteAccountDialog);
  elements.deleteAccountConfirmation?.addEventListener('input', () => {
    if (elements.confirmDeleteAccountButton) {
      elements.confirmDeleteAccountButton.disabled = elements.deleteAccountConfirmation.value !== 'DELETE';
    }
  });
  elements.deleteAccountDialog?.addEventListener('cancel', () => {
    if (elements.deleteAccountConfirmation) elements.deleteAccountConfirmation.value = '';
    if (elements.confirmDeleteAccountButton) elements.confirmDeleteAccountButton.disabled = true;
  });
  elements.deleteAccountForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    deleteAccount();
  });
  elements.signupNextButton.addEventListener('click', () => {
    const name = elements.studentNameInput.value.trim();
    AppState.studentName = name;
    saveState();
    renderAccountControls();
    showPage('grade');
  });
  elements.changeGradeButton.addEventListener('click', () => {
    showPage('grade');
  });
  elements.headerGradeSelect.addEventListener('change', () => {
    selectGrade(Number(elements.headerGradeSelect.value));
  });
  elements.backToLessons.addEventListener('click', () => {
    showLessonListOrOnboarding();
  });
  elements.homeButton.addEventListener('click', showHomeOrWelcome);
  elements.lessonsButton.addEventListener('click', showLessonListOrOnboarding);
  elements.studyButton.addEventListener('click', showStudyOrOnboarding);
  elements.dictionaryButton.addEventListener('click', showDictionary);
  elements.assessmentsButton.addEventListener('click', showAssessmentsOrOnboarding);
  elements.nleButton.addEventListener('click', showNlePrep);
  elements.nleBackButton.addEventListener('click', leaveNleView);
  elements.nleStage.addEventListener('click', handleNleClick);
  elements.homePracticeNle.addEventListener('click', showNlePrep);
  elements.dashboardNleButton.addEventListener('click', showNlePrep);
  elements.dashboardButton.addEventListener('click', showDashboardOrOnboarding);
  elements.assessmentsBackButton.addEventListener('click', showHomeOrWelcome);
  elements.backToLessonsFromDashboard.addEventListener('click', () => {
    showHomeOrWelcome();
  });
  elements.studyBackButton.addEventListener('click', showHomeOrWelcome);
  elements.vocabularySearch.addEventListener('input', renderVocabularyList);
  pages.study.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const modeButton = target?.closest('[data-study-mode]');
    if (modeButton) {
      selectStudyMode(modeButton.dataset.studyMode);
      return;
    }
    const durationButton = target?.closest('[data-flashcard-duration]');
    if (durationButton) {
      setFlashcardDuration(Number(durationButton.dataset.flashcardDuration));
      return;
    }
    const speakButton = target?.closest('[data-speak-latin]');
    if (speakButton) speakLatin(speakButton.dataset.speakLatin, Number(speakButton.dataset.speakRate) || 0.82);
  });
  elements.flashcardStart.addEventListener('click', toggleFlashcardTimer);
  elements.flashcardShuffle.addEventListener('click', shuffleFlashcards);
  elements.flashcardPrevious.addEventListener('click', () => moveFlashcard(-1));
  elements.flashcardNext.addEventListener('click', () => moveFlashcard(1));
  elements.flashcardFlip.addEventListener('click', () => {
    StudyState.showingAnswer = !StudyState.showingAnswer;
    renderFlashcard();
  });
  elements.dictionaryBackButton.addEventListener('click', showHomeOrWelcome);
  elements.dictionarySearch.addEventListener('input', renderDictionary);
  elements.dictionaryGradeFilter.addEventListener('change', renderDictionary);
  pages.dictionary.addEventListener('click', (event) => {
    const speakButton = event.target instanceof Element ? event.target.closest('[data-speak-latin]') : null;
    if (speakButton) speakLatin(speakButton.dataset.speakLatin, Number(speakButton.dataset.speakRate) || 0.82);
  });
  elements.reviewWeakWordsButton?.addEventListener('click', startWeakWordReview);
  elements.nextQuestionButton.addEventListener('click', nextQuestion);
  pages.lesson?.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const speakButton = target?.closest('[data-speak-latin]');
    if (speakButton) {
        speakLatin(speakButton.dataset.speakLatin, Number(speakButton.dataset.speakRate) || 0.82);
        return;
      }

      const practiceModeButton = target?.closest('[data-practice-mode]');
      if (practiceModeButton) {
        selectPracticeMode(practiceModeButton.dataset.practiceMode);
        return;
      }

      const storyReadLink = target?.closest('[data-story-read]');
      if (storyReadLink) {
        const lesson = getSelectedLesson();
        const earnedBadge = persistAchievement('story-explorer');
        if (earnedBadge) {
          if (lesson?.story) renderStoryScene(lesson);
        }
        renderFullStory(lesson);
        return;
      }

      const arrangeToken = target?.closest('[data-arrange-token]');
      if (arrangeToken) {
        moveArrangeToken(arrangeToken);
        return;
      }

      const arrangePlaced = target?.closest('[data-arrange-placed]');
      if (arrangePlaced) {
        removeArrangeToken(arrangePlaced);
        return;
      }

      const seekFindTarget = target?.closest('[data-seek-find-target]');
      if (seekFindTarget) {
        findSeekFindTarget(seekFindTarget.dataset.seekFindTarget);
        return;
      }

      const seekFindHint = target?.closest('[data-seek-find-hint]');
      if (seekFindHint) {
        showSeekFindHint(seekFindHint.dataset.seekFindHint);
        return;
      }

      const seekFindAction = target?.closest('[data-seek-find-action]');
      if (seekFindAction) {
        if (seekFindAction.dataset.seekFindAction === 'hint') showSeekFindHint();
        if (seekFindAction.dataset.seekFindAction === 'reset') resetSeekFind();
        return;
      }

      const lessonAction = target?.closest('[data-lesson-action]');
      if (lessonAction) {
        if (lessonAction.dataset.lessonAction === 'start-missed-review') startMissedWordReview();
        if (lessonAction.dataset.lessonAction === 'back-to-lessons') showLessonListOrOnboarding();
        if (lessonAction.dataset.lessonAction === 'open-dashboard') showDashboardOrOnboarding();
      return;
    }

    const resourceTab = target?.closest('[data-lesson-resource-tab]');
    if (resourceTab) {
      selectLessonResourceTab(resourceTab.dataset.lessonResourceTab);
      return;
    }

    const classroomCategory = target?.closest('[data-classroom-category]');
    if (classroomCategory) {
      filterClassroomPhrases(classroomCategory.dataset.classroomCategory);
      return;
    }

    const classroomReveal = target?.closest('[data-classroom-reveal]');
    if (classroomReveal) {
      toggleClassroomMeaning(classroomReveal);
      return;
    }

    const classroomAction = target?.closest('[data-classroom-action]');
    if (classroomAction) {
      if (classroomAction.dataset.classroomAction === 'shuffle') shuffleClassroomPhrases();
      if (classroomAction.dataset.classroomAction === 'reveal-all') revealAllClassroomMeanings();
    }
  });
  elements.storyReader?.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('[data-story-close]') || target === elements.storyReader) {
      elements.storyReader.close();
    }
  });
  pages.dashboard?.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const speakButton = target?.closest('[data-speak-latin]');
    if (speakButton) speakLatin(speakButton.dataset.speakLatin, Number(speakButton.dataset.speakRate) || 0.82);
  });
  pages.lesson?.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.matches('[data-audio-autoplay]')) return;
    AppState.speechAutoPlay = target.checked;
    pages.lesson.querySelectorAll('[data-audio-autoplay]').forEach((input) => {
      if (input instanceof HTMLInputElement) input.checked = AppState.speechAutoPlay;
    });
    if (AppState.speechAutoPlay && AppState.lessonPhase === 'practice') speakCurrentQuestion();
  });
  pages.lesson?.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.matches('[data-production-input]')) {
      AppState.productionAnswer = target.value;
    }
  });
  pages.lesson?.addEventListener('keydown', (event) => {
    const target = event.target;
    if (event.key === 'Enter' && target instanceof HTMLInputElement && target.matches('[data-production-input]')) {
      event.preventDefault();
      nextQuestion();
    }
  });
  elements.headerMenuButton = document.getElementById('headerMenuButton');
  elements.headerMenuButton?.addEventListener('click', () => {
    const nav = document.getElementById('headerNav');
    if (!nav) return;
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    elements.headerMenuButton.setAttribute('aria-expanded', String(open));
  });
  elements.assessmentBuilder?.addEventListener('keydown', (event) => {
    const tab = event.target instanceof Element ? event.target.closest('[role="tab"]') : null;
    if (!tab || (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft')) return;
    const tabs = [...elements.assessmentBuilder.querySelectorAll('[role="tab"]')];
    const index = tabs.indexOf(tab);
    if (index < 0) return;
    event.preventDefault();
    const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    next?.focus();
    next?.click();
  });
  elements.assessmentBuilder?.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const modeButton = target?.closest('[data-assessment-mode]');
    if (modeButton) {
      AssessmentState.mode = modeButton.dataset.assessmentMode;
      AssessmentState.message = '';
      resetAssessment();
      return;
    }

    const countButton = target?.closest('[data-assessment-count]');
    if (countButton) {
      const count = Number(countButton.dataset.assessmentCount);
      if (QUESTION_COUNT_OPTIONS.includes(count)) {
        if (countButton.dataset.countMode === 'test') {
          AssessmentState.testQuestionCount = count;
        } else {
          AssessmentState.quizQuestionCount = count;
        }
        AssessmentState.message = '';
        resetAssessment();
      }
      return;
    }

    const gradeButton = target?.closest('[data-test-grade]');
    if (gradeButton) {
      const grade = Number(gradeButton.dataset.testGrade);
      if (VALID_GRADES.includes(grade)) {
        AssessmentState.testGrade = grade;
        AssessmentState.testLevelPinned = true;
        AssessmentState.message = '';
        resetAssessment();
      }
      return;
    }

    const chapterButton = target?.closest('[data-chapter-id]');
    if (chapterButton) {
      const chapterId = chapterButton.dataset.chapterId;
      if (AssessmentState.selectedChapterIds.has(chapterId)) {
        AssessmentState.selectedChapterIds.delete(chapterId);
      } else {
        AssessmentState.selectedChapterIds.add(chapterId);
      }
      AssessmentState.message = '';
      resetAssessment();
      return;
    }

    const actionButton = target?.closest('[data-assessment-action]');
    if (!actionButton) return;
    if (actionButton.dataset.assessmentAction === 'select-all') {
      AssessmentState.selectedChapterIds = new Set(getQuizChapters().map((lesson) => lesson.id));
      AssessmentState.message = '';
      resetAssessment();
    }
    if (actionButton.dataset.assessmentAction === 'clear-chapters') {
      AssessmentState.selectedChapterIds = new Set();
      AssessmentState.message = '';
      resetAssessment();
    }
    if (actionButton.dataset.assessmentAction === 'start') startAssessment();
  });
  elements.assessmentRunner?.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const optionButton = target?.closest('[data-assessment-option]');
    if (optionButton) {
      selectAssessmentOption(optionButton.dataset.assessmentOption);
      return;
    }

    const actionButton = target?.closest('[data-assessment-action]');
    if (!actionButton) return;
    if (actionButton.dataset.assessmentAction === 'next') nextAssessmentQuestion();
    if (actionButton.dataset.assessmentAction === 'reset') resetAssessment();
    if (actionButton.dataset.assessmentAction === 'start') startAssessment();
  });
  elements.printArea?.addEventListener('click', (event) => {
    const actionButton = event.target instanceof Element
      ? event.target.closest('[data-print-action]')
      : null;
    if (!actionButton) return;
    if (actionButton.dataset.printAction === 'close') closePrintPreview();
    if (actionButton.dataset.printAction === 'print') printCurrentPreview();
  });
  elements.lessonPuzzles?.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const modeButton = target?.closest('[data-puzzle-mode]');
    if (modeButton) {
      const lesson = getSelectedLesson();
      if (!lesson) return;
      OnlinePuzzleState.mode = modeButton.dataset.puzzleMode;
      OnlinePuzzleState.wordFindStart = null;
      OnlinePuzzleState.wordFindStatus = '';
      renderLessonPuzzles(lesson);
      return;
    }

    const crosswordEntry = target?.closest('[data-crossword-entry]');
    if (crosswordEntry) {
      focusCrosswordEntry(crosswordEntry.dataset.crosswordEntry);
      return;
    }

    const crosswordAction = target?.closest('[data-crossword-action]');
    if (crosswordAction) {
      if (crosswordAction.dataset.crosswordAction === 'reset') resetOnlineCrossword();
      if (crosswordAction.dataset.crosswordAction === 'check') checkOnlineCrossword(false);
      if (crosswordAction.dataset.crosswordAction === 'reveal') checkOnlineCrossword(true);
      return;
    }

    const wordFindAction = target?.closest('[data-word-find-action]');
    if (wordFindAction) {
      if (wordFindAction.dataset.wordFindAction === 'reset') resetOnlineWordFind();
      if (wordFindAction.dataset.wordFindAction === 'reveal') revealOnlineWordFind();
      return;
    }

    const wordFindCell = target?.closest('[data-word-find-cell]');
    if (wordFindCell) handleWordFindCellClick(wordFindCell);
  });
  elements.lessonPuzzles?.addEventListener('input', (event) => {
    if (event.target instanceof HTMLInputElement && event.target.matches('[data-crossword-cell]')) {
      handleCrosswordInput(event.target);
    }
  });
  elements.lessonPuzzles?.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLInputElement && event.target.matches('[data-crossword-cell]')) {
      handleCrosswordKeydown(event, event.target);
    }
  });
}

function yearForGrade(grade) {
  return getCurriculumLevelByGrade(grade)?.year || null;
}

function gradeForYear(year) {
  const level = CURRICULUM_LEVELS.find((item) => item.year === Number(year));
  return level ? level.grade : null;
}

function lessonMatchesYear(lessonId, year) {
  const lesson = LESSONS.find((item) => item.id === lessonId);
  return Boolean(lesson) && yearForGrade(lesson.grade) === Number(year);
}

function activePageName() {
  return Object.entries(pages).find(([, section]) => section?.classList.contains('active'))?.[0] || '';
}

function isAuthHash() {
  const hash = window.location.hash || '';
  return hash.includes('access_token') || hash.includes('type=recovery') || hash.includes('error_description');
}

function currentAssignmentRoute() {
  const page = activePageName();
  const year = yearForGrade(AppState.grade);
  if (page === 'codeCheck') return { kind: 'check' };
  if (assignmentFocus && page === 'nle') return assignmentFocus;
  if ((page === 'home' || page === 'lessonList') && year) return { kind: 'year', year };
  if (page === 'lesson' && year) {
    const lesson = getSelectedLesson();
    if (lesson && lessonMatchesYear(lesson.id, year)) {
      return { kind: 'lesson', year, lessonId: lesson.id, mode: AppState.practiceMode };
    }
  }
  if (page === 'assessments' && year) {
    if (AssessmentState.mode === 'test') {
      return {
        kind: 'test',
        year: yearForGrade(AssessmentState.testGrade) || year,
        count: AssessmentState.testQuestionCount
      };
    }
    return {
      kind: 'quiz',
      year,
      count: AssessmentState.quizQuestionCount,
      lessonIds: [...AssessmentState.selectedChapterIds].filter((id) => lessonMatchesYear(id, year)).sort()
    };
  }
  if (page === 'nle') {
    if (!NleState.levelId || NleState.view === 'levels') return { kind: 'nle' };
    if (NleState.view === 'exam' || (NleState.view === 'results' && NleState.mode === 'exam')) {
      return { kind: 'nle', levelId: NleState.levelId, exam: true };
    }
    if ((NleState.view === 'practice' || (NleState.view === 'results' && NleState.mode === 'practice')) && NleState.category) {
      return { kind: 'nle', levelId: NleState.levelId, category: NleState.category, count: NleState.practiceCount };
    }
    return { kind: 'nle', levelId: NleState.levelId };
  }
  if (page === 'study' && StudyState.mode === 'flashcards' && year) {
    return {
      kind: 'cards',
      year,
      seconds: StudyState.durationSeconds,
      shuffle: StudyState.shuffled ? 1 : 0
    };
  }
  return null;
}

function syncAssignmentHash() {
  if (suppressAssignmentHash || isAuthHash() || !window.LatinLaunchpadAssign) return;
  const route = currentAssignmentRoute();
  const path = route ? window.LatinLaunchpadAssign.buildPath(route) : '';
  const next = path ? `#${path}` : '';
  if (!next) {
    if ((window.location.hash || '').startsWith('#/')) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    return;
  }
  if (window.location.hash === next) return;
  history.replaceState(null, '', `${window.location.pathname}${window.location.search}${next}`);
}

function applyAssignmentHash() {
  if (isAuthHash() || !window.LatinLaunchpadAssign) return;
  const route = window.LatinLaunchpadAssign.parsePath(window.location.hash);
  if (!route) return;
  suppressAssignmentHash = true;
  try {
    assignmentFocus = null;
    if (route.kind === 'check') {
      showPage('codeCheck', { skipHash: true });
      return;
    }
    if (route.kind === 'deck') {
      assignmentNavigationPending = true;
      window.location.assign(`flashcards.html#/deck/${route.year}/${route.minutes}/${route.sessionType}`);
      return;
    }
    const grade = gradeForYear(route.year);
    if (route.kind === 'year' && grade) {
      selectGrade(grade);
      return;
    }
    if (route.kind === 'lesson' && grade && lessonMatchesYear(route.lessonId, route.year)) {
      selectGrade(grade);
      openLesson(route.lessonId);
      selectPracticeMode(route.mode);
      return;
    }
    if (route.kind === 'quiz' && grade) {
      selectGrade(grade);
      AssessmentState.mode = 'quiz';
      AssessmentState.quizQuestionCount = route.count;
      AssessmentState.quizGrade = grade;
      const validIds = new Set(getQuizChapters().map((lesson) => lesson.id));
      const selected = Array.isArray(route.lessonIds)
        ? route.lessonIds.filter((id) => validIds.has(id))
        : [...validIds];
      AssessmentState.selectedChapterIds = new Set(selected);
      AssessmentState.message = Array.isArray(route.lessonIds) && selected.length === 0
        ? 'That assignment has no matching chapters.'
        : '';
      renderAssessments();
      showPage('assessments', { skipHash: true });
      return;
    }
    if (route.kind === 'test' && grade) {
      selectGrade(grade);
      AssessmentState.mode = 'test';
      AssessmentState.testQuestionCount = route.count;
      AssessmentState.testGrade = grade;
      AssessmentState.testLevelPinned = true;
      renderAssessments();
      showPage('assessments', { skipHash: true });
      return;
    }
    if (route.kind === 'nle') {
      showPage('nle', { skipHash: true });
      if (!route.levelId) {
        NleState.view = 'levels';
        renderNle();
        return;
      }
      NleState.levelId = route.levelId;
      NleState.view = 'level';
      if (route.exam) {
        assignmentFocus = { kind: 'nle', levelId: route.levelId, exam: true };
      } else if (route.category) {
        NleState.practiceCount = route.count;
        NleState.category = route.category;
        assignmentFocus = { kind: 'nle', levelId: route.levelId, category: route.category, count: route.count };
      }
      renderNle();
      return;
    }
    if (route.kind === 'cards' && grade) {
      selectGrade(grade);
      stopFlashcardTimer();
      StudyState.mode = 'flashcards';
      StudyState.durationSeconds = route.seconds;
      StudyState.words = [];
      StudyState.seenKeys = new Set();
      ensureStudyWords();
      StudyState.shuffled = route.shuffle === 1;
      if (!StudyState.shuffled) {
        StudyState.words = [...StudyState.words].sort((a, b) => a.latin.localeCompare(b.latin, 'en'));
        StudyState.index = 0;
      }
      resetFlashcardClock();
      renderStudyPage();
      showPage('study', { skipHash: true });
    }
  } finally {
    suppressAssignmentHash = false;
  }
}

function renderCompletionCode(payload) {
  if (!window.LatinLaunchpadAssign) return '';
  const code = window.LatinLaunchpadAssign.encodeCompletion(payload);
  if (!code) return '';
  return `
    <section class="completion-code" aria-label="Completion code">
      <h4>Completion code</h4>
      <p>Hand this code to your teacher. It shows the score and missed Latin words. It does not include a name, and it is not a locked certificate.</p>
      <p class="completion-code-value"><code>${escapeHtml(code)}</code></p>
      <button type="button" class="secondary-button" data-copy-completion="${escapeHtml(code)}">Copy code</button>
    </section>
  `;
}

function renderFlashcardCompletion() {
  if (StudyState.remainingMs > 0 || StudyState.running) return '';
  const year = yearForGrade(AppState.grade);
  if (!year || !StudyState.words.length) return '';
  return renderCompletionCode({
    kind: 'cards',
    id: `y${year}`,
    mode: 'timer',
    score: StudyState.seenKeys?.size || 0,
    total: StudyState.words.length,
    missed: []
  });
}

function noteFlashcardSeen() {
  const word = StudyState.words[StudyState.index];
  if (!word) return;
  if (!StudyState.seenKeys) StudyState.seenKeys = new Set();
  const label = window.LatinLaunchpadAssign?.normalizeMissedLabel(word.latin);
  if (label) StudyState.seenKeys.add(label);
}

function renderNleAssignmentNote(level) {
  if (!assignmentFocus || assignmentFocus.levelId !== level.id) return '';
  const text = assignmentFocus.exam
    ? 'Assigned: practice exam. The timer starts when you press Start.'
    : `Assigned practice: ${assignmentFocus.category}, ${assignmentFocus.count} questions. Press that category when you are ready.`;
  return `<p class="assignment-note">${escapeHtml(text)}</p>`;
}

function announceAssignment(message) {
  const status = document.getElementById('assignmentStatus');
  if (status) status.textContent = message;
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch (error) {
    /* The textarea fallback covers browsers that block clipboard permission. */
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'absolute';
  area.style.left = '-9999px';
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  area.remove();
}

function copyRouteOverride(button) {
  const which = button?.dataset.copyAssignment || '';
  if (which === 'exam' && NleState.levelId) return { kind: 'nle', levelId: NleState.levelId, exam: true };
  if (which === 'practice' && NleState.levelId && button.dataset.assignmentCategory) {
    return {
      kind: 'nle',
      levelId: NleState.levelId,
      category: button.dataset.assignmentCategory,
      count: NleState.practiceCount
    };
  }
  return null;
}

async function copyAssignmentLink(button) {
  const override = copyRouteOverride(button);
  if (override) assignmentFocus = override;
  syncAssignmentHash();
  const route = override || currentAssignmentRoute();
  const path = window.LatinLaunchpadAssign?.buildPath(route);
  if (!path) {
    announceAssignment('Open a year, lesson, quiz, exam, or flashcard session first.');
    return;
  }
  const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${path}`;
  await copyText(url);
  announceAssignment('Assignment link copied.');
}

function renderCompletionCheck() {
  const input = document.getElementById('completionCodeInput');
  const output = document.getElementById('completionCodeResult');
  if (!input || !output || !window.LatinLaunchpadAssign) return;
  const decoded = window.LatinLaunchpadAssign.decodeCompletion(input.value);
  if (!decoded.ok) {
    output.innerHTML = `<p>${escapeHtml(decoded.error)}</p>`;
    return;
  }
  const payload = decoded.payload;
  const missed = payload.missed.length
    ? payload.missed.map((word) => `<li>${escapeHtml(word)}</li>`).join('')
    : '<li>None</li>';
  output.innerHTML = `
    <h3>${escapeHtml(payload.label)}</h3>
    <p><strong>${escapeHtml(payload.scoreLabel)}:</strong> ${payload.score}/${payload.total}</p>
    <h4>Missed Latin words or question ids</h4>
    <ul>${missed}</ul>
    <p>This reading does not include a name. It is not a locked certificate.</p>
  `;
}

window.addEventListener('hashchange', () => {
  applyAssignmentHash();
  if (!assignmentNavigationPending) syncAssignmentHash();
});

window.addEventListener('DOMContentLoaded', () => {
  init();
  setupEvents();
});
