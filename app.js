const LESSON_CHUNK_SIZE = 10;
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
      title: `Grade ${grade}: Lesson ${index + 1}`,
      description: phrases.length > 0
        ? `Practice Latin vocabulary words ${start + 1}-${start + lessonWords.length}, then connect them to popular Latin phrases.`
        : `Practice Latin vocabulary words ${start + 1}-${start + lessonWords.length}.`,
      vocabularyWords: lessonWords,
      phrases,
      words: [...lessonWords, ...phraseQuestions]
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

const STORAGE_KEY = 'latinLaunchpadState';
const PROFILES_STORAGE_KEY = 'latinLaunchpadProfiles';
const GUEST_PROFILE_ID = 'guest';

const SUPABASE_URL = 'https://fmwdkpjetpftuuposmog.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_c7bs4AqY2ni-el3GqKxGuA_HbaUA_fJ';
let _supabaseClient = null;

function getSupabase() {
  if (window.supabase && !_supabaseClient) {
    _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabaseClient;
}
const VALID_GRADES = [3, 4, 5, 6, 7, 8];
const PUZZLE_CACHE = new Map();
const QUESTION_COUNT_OPTIONS = [10, 25, 50, 100];
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
  }
];

const AppState = {
  account: createGuestAccount(),
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

const AssessmentState = {
  mode: 'quiz',
  quizGrade: null,
  quizQuestionCount: 10,
  testQuestionCount: 50,
  testGrade: VALID_GRADES[0],
  selectedChapterIds: new Set(),
  questions: [],
  responses: [],
  currentQuestionIndex: 0,
  selectedOption: null,
  answerChecked: false,
  correctCount: 0,
  completed: false,
  message: ''
};

const pages = {
  welcome: document.getElementById('welcomePage'),
  home: document.getElementById('homePage'),
  account: document.getElementById('accountPage'),
  signup: document.getElementById('signupPage'),
  grade: document.getElementById('gradePage'),
  lessonList: document.getElementById('lessonListPage'),
  assessments: document.getElementById('assessmentsPage'),
  lesson: document.getElementById('lessonPage'),
  dashboard: document.getElementById('dashboardPage'),
  resetPassword: document.getElementById('resetPasswordPage'),
  contact: document.getElementById('contactPage')
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
  signupNextButton: document.getElementById('signupNextButton'),
  studentNameInput: document.getElementById('studentNameInput'),
  gradeGrid: document.getElementById('gradeGrid'),
  lessonCards: document.getElementById('lessonCards'),
  lessonTitle: document.getElementById('lessonTitle'),
  lessonDescription: document.getElementById('lessonDescription'),
  storyScene: document.getElementById('storyScene'),
  lessonNotes: document.getElementById('lessonNotes'),
  phraseFocus: document.getElementById('phraseFocus'),
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
  printArea: document.getElementById('printArea'),
  homeButton: document.getElementById('homeButton'),
  lessonsButton: document.getElementById('lessonsButton'),
  assessmentsButton: document.getElementById('assessmentsButton'),
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
  progressList: document.getElementById('progressList')
};

const OnlinePuzzleState = {
  lessonId: null,
  mode: 'crossword',
  crosswordDirection: 'across',
  wordFindStart: null,
  wordFindFound: new Set(),
  wordFindStatus: ''
};

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getDefaultProgress() {
  return {
    points: 0,
    lessons: {},
    wordsMastered: {}
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
    lessons: isPlainObject(safeProgress.lessons) ? safeProgress.lessons : {},
    wordsMastered: isPlainObject(safeProgress.wordsMastered) ? safeProgress.wordsMastered : {}
  };
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
    grade: VALID_GRADES.includes(state.grade) ? state.grade : null,
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
    if (isEmailAccount()) evaluateBadges();
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
  const db = getSupabase();
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
      grade: VALID_GRADES.includes(profile?.grade) ? profile.grade : null,
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
  const db = getSupabase();
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

function showPage(page) {
  if (!pages[page]) {
    console.warn(`showPage called with unknown page: ${page}`);
    return;
  }
  Object.values(pages).forEach((section) => section.classList.remove('active'));
  pages[page].classList.add('active');
  updateNavState(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavState(page) {
  const activeButtonByPage = {
    welcome: 'homeButton',
    home: 'homeButton',
    signup: 'lessonsButton',
    grade: 'lessonsButton',
    lessonList: 'lessonsButton',
    lesson: 'lessonsButton',
    assessments: 'assessmentsButton',
    dashboard: 'dashboardButton',
    account: 'accountButton',
    resetPassword: 'accountButton',
    contact: 'contactButton'
  };
  [
    elements.homeButton,
    elements.lessonsButton,
    elements.assessmentsButton,
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
  if (!isEmailAccount(state)) return [];
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
  if (signedIn) evaluateBadges();
  const earnedBadges = signedIn ? normalizeBadges(AppState.badges) : {};
  const earnedCount = Object.keys(earnedBadges).length;

  elements.badgeSubtitle.textContent = signedIn
    ? `${earnedCount}/${BADGE_DEFINITIONS.length} earned for ${AppState.account.email}.`
    : 'Sign in with email to collect badges.';
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
  if (!AppState.studentName) {
    showPage('welcome');
    return;
  }
  if (!VALID_GRADES.includes(AppState.grade)) {
    showPage('grade');
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

  const db = getSupabase();
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
    // Supabase unavailable — fall back to email-only profile
    const account = createEmailAccount(normalizedEmail);
    const existingLocalProfile = getStoredProfile(account.profileId);
    applyStoredState(existingLocalProfile || createStateSnapshot(AppState, account), account);
    AppState.account = account;
    evaluateBadges();
    saveState();
    renderAfterProfileChange();
    setAccountMessage('Signed in (offline mode).', 'success');
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

  const db = getSupabase();
  if (db) {
    try {
      const { data, error } = await db.auth.signUp({
        email: normalizedEmail,
        password,
        options: { emailRedirectTo: 'https://latin-launchpad.netlify.app/' }
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

  const db = getSupabase();
  if (db) {
    try {
      const { error } = await db.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: 'https://latin-launchpad.netlify.app/'
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

  const db = getSupabase();
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

function continueAsGuest() {
  saveState();
  const db = getSupabase();
  if (db) db.auth.signOut().catch(() => {});
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
  setAccountMessage('Using guest mode.', 'success');
}

async function init() {
  loadState();
  renderAccountControls();

  const db = getSupabase();
  if (db) {
    // Set up auth listener FIRST — before getSession — so the Supabase client
    // can read and consume any #access_token hash (including recovery tokens)
    // from the URL before we do anything else with the page.
    db.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Supabase has validated the recovery token and established a session.
        // Show the set-new-password form; updateUser() will now succeed.
        showPage('resetPassword');
        return;
      }

      if (event === 'SIGNED_IN' && session?.user?.email) {
        const email = session.user.email;
        const account = createEmailAccount(email);
        const remote = await supabaseLoadProfile(email);
        const existingLocal = getStoredProfile(account.profileId);
        const nextState = remote || existingLocal || createStateSnapshot(AppState, account);
        applyStoredState(nextState, account);
        AppState.account = account;
        evaluateBadges();
        saveState();
        renderAfterProfileChange();
        // Navigate home if the user was on the account or welcome page
        const currentActive = Object.entries(pages).find(([, el]) => el?.classList.contains('active'));
        if (currentActive && ['account', 'welcome'].includes(currentActive[0])) {
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
      applyStoredState(nextState, account);
      AppState.account = account;
      evaluateBadges();
      saveState();
      renderAfterProfileChange();
    }
  }

  if (AppState.studentName && AppState.grade) {
    renderLessonList();
    renderHome();
    showPage('home');
  } else {
    showPage('welcome');
  }
  renderGradeOptions();
  renderDashboard();
  renderAssessments();
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
  renderHome();
  renderAssessments();
  showPage('home');
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
    const phraseTag = getLessonPhraseCount(lesson) > 0
      ? `<span class="lesson-phrase-tag">${getLessonPhraseCount(lesson)} ${getLessonPhraseCount(lesson) === 1 ? 'phrase' : 'phrases'}</span>`
      : '';
    const tagsHtml = grammarTag || storyTag || phraseTag
      ? `<div class="lesson-card-tags">${grammarTag}${storyTag}${phraseTag}</div>`
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
  renderPhraseFocus(lesson);
  renderLessonPrintables(lesson);
  renderLessonPuzzles(lesson);
  elements.wordPreview.innerHTML = getLessonVocabularyWords(lesson)
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
    status.textContent = completeEntries === entries.length
      ? `Complete: ${completeEntries}/${entries.length}`
      : `Solved: ${completeEntries}/${entries.length}`;
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

function getLessonPuzzleTerms(lesson) {
  const seen = new Set();
  return lesson.words
    .filter((word) => !word.excludeFromPuzzles && !word.isPhrase)
    .map((word, index) => {
      const answer = normalizePuzzleAnswer(word.puzzleAnswer || word.latin);
      if (answer.length < 3 || answer.length > 14 || seen.has(answer)) return null;
      seen.add(answer);
      return {
        answer,
        display: word.latin,
        clue: getPuzzleClue(word, index),
        english: word.previewAnswer || word.english
      };
    })
    .filter(Boolean)
    .slice(0, 10);
}

function normalizePuzzleAnswer(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

function getPuzzleClue(word, index) {
  const meaning = word.previewAnswer || word.english || `term ${index + 1}`;
  if (word.context) return `${word.context} ${meaning}`;
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
        <h2>${escapeHtml(lesson.title)}</h2>
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

function renderLessonSummaryPrint(lesson) {
  const focusItems = Array.isArray(lesson.focus)
    ? lesson.focus.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
    : '';
  const phrases = Array.isArray(lesson.phrases) ? lesson.phrases : [];
  const phraseRows = phrases.map((phrase) => {
    const linkedWords = Array.isArray(phrase.matchedWords)
      ? phrase.matchedWords.map((word) => `${word.latin} (${word.english})`).join(', ')
      : '';
    return `
      <tr>
        <td>${escapeHtml(phrase.latin)}</td>
        <td>${escapeHtml(phrase.meaning)}</td>
        <td>${escapeHtml(linkedWords || 'today\'s word bank')}</td>
      </tr>
    `;
  }).join('');
  const sourceNote = lesson.sourceNote ? `<p>${escapeHtml(lesson.sourceNote)}</p>` : '';
  const storyNote = lesson.story
    ? `<p><strong>Story:</strong> ${escapeHtml(lesson.story.title)} - ${escapeHtml(lesson.story.summary)}</p>`
    : '';
  const rows = getLessonVocabularyWords(lesson).map((word) => {
    const note = word.explanation || word.hint || word.prompt || '';
    return `
      <tr>
        <td>${escapeHtml(word.latin)}</td>
        <td>${escapeHtml(word.previewAnswer || word.english)}</td>
        <td>${escapeHtml(truncateText(note, 96))}</td>
      </tr>
    `;
  }).join('');

  return `
    <article class="print-sheet summary-sheet">
      ${renderPrintHeader(lesson, 'Lesson Summary')}
      <section class="print-section">
        <h2>Big idea</h2>
        <p>${escapeHtml(lesson.description)}</p>
        ${sourceNote}
        ${storyNote}
      </section>
      ${focusItems ? `<section class="print-section"><h2>Focus</h2><ul class="print-focus-list">${focusItems}</ul></section>` : ''}
      ${phraseRows ? `
        <section class="print-section">
          <h2>Popular Latin phrases</h2>
          <table class="summary-table">
            <thead>
              <tr>
                <th>Phrase</th>
                <th>Meaning</th>
                <th>Linked words</th>
              </tr>
            </thead>
            <tbody>${phraseRows}</tbody>
          </table>
        </section>
      ` : ''}
      <section class="print-section">
        <h2>Key terms</h2>
        <table class="summary-table">
          <thead>
            <tr>
              <th>Latin</th>
              <th>Meaning</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </section>
    </article>
  `;
}

function renderCrosswordPrint(lesson) {
  const { crossword } = getLessonPuzzles(lesson);
  return `
    <article class="print-sheet puzzle-sheet">
      ${renderPrintHeader(lesson, 'Crossword')}
      <div class="puzzle-layout crossword-layout">
        <div>${renderCrosswordGrid(crossword, false)}</div>
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
    <article class="print-sheet puzzle-sheet">
      ${renderPrintHeader(lesson, 'Word Find')}
      <div class="puzzle-layout word-find-layout">
        <div>${renderWordFindGrid(wordFind)}</div>
        <section class="word-bank">
          <h2>Find these Latin terms</h2>
          <ul>${words}</ul>
        </section>
      </div>
    </article>
  `;
}

function renderPrintHeader(lesson, sheetTitle) {
  return `
    <header class="print-header">
      <div>
        <p class="print-kicker">Grade ${lesson.grade} ${lesson.kind === 'grammar' ? 'Grammar' : 'Vocabulary'}</p>
        <h1>${escapeHtml(sheetTitle)}: ${escapeHtml(lesson.title)}</h1>
      </div>
      <div class="print-name-lines">
        <span>Name: ____________________</span>
        <span>Date: ____________</span>
      </div>
    </header>
  `;
}

function renderCrosswordGrid(crossword, showAnswers) {
  const rows = crossword.grid.map((row, rowIndex) => {
    const cells = row.map((letter, colIndex) => {
      if (!letter) return '<td class="crossword-block"></td>';
      const number = crossword.cellNumbers.get(`${rowIndex},${colIndex}`);
      const numberHtml = number ? `<span class="cell-number">${number}</span>` : '';
      const answerHtml = showAnswers ? `<span class="cell-answer">${escapeHtml(letter)}</span>` : '';
      return `<td class="crossword-cell">${numberHtml}${answerHtml}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  return `<table class="crossword-grid" aria-label="Crossword grid"><tbody>${rows}</tbody></table>`;
}

function renderCrosswordClues(title, clues) {
  if (clues.length === 0) return '';
  return `
    <section class="clue-list-section">
      <h2>${escapeHtml(title)}</h2>
      <ol class="clue-list">
        ${clues.map((placement) => `<li value="${placement.number}">${escapeHtml(placement.term.clue)}</li>`).join('')}
      </ol>
    </section>
  `;
}

function renderWordFindGrid(wordFind) {
  const rows = wordFind.grid.map((row) => {
    const cells = row.map((letter) => `<td>${escapeHtml(letter)}</td>`).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  return `<table class="word-find-grid" aria-label="Word find grid"><tbody>${rows}</tbody></table>`;
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
  renderHome();
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
  renderHome();
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
  renderBadges();
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

function getCurrentGradeLessons() {
  return VALID_GRADES.includes(AppState.grade)
    ? LESSONS.filter((lesson) => lesson.grade === AppState.grade)
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

function renderHome() {
  if (!elements.homeGreeting) return;
  const name = AppState.studentName || 'Learner';
  const gradeLabel = VALID_GRADES.includes(AppState.grade) ? `Grade ${AppState.grade}` : 'Latin practice';
  const lessons = getCurrentGradeLessons();
  const completedCount = lessons.filter((lesson) => AppState.progress.lessons[lesson.id]).length;
  const nextLesson = getNextLesson();

  elements.homeGradePill.textContent = gradeLabel;
  elements.homeGreeting.textContent = `Welcome back, ${name}.`;
  elements.homeSummary.textContent = lessons.length > 0
    ? `${completedCount}/${lessons.length} chapters complete. Keep lessons, quizzes, and tests in one place.`
    : 'Choose a grade to unlock your Latin learning path.';
  elements.homePointsValue.textContent = AppState.progress.points;
  elements.homeLessonsValue.textContent = Object.keys(AppState.progress.lessons).length;
  elements.homeSkillsValue.textContent = Object.keys(AppState.progress.wordsMastered).length;

  if (nextLesson) {
    elements.homeNextTitle.textContent = nextLesson.title;
    elements.homeNextMeta.textContent = `${getLessonCountLabel(nextLesson)} · ${getLessonProgressLabel(nextLesson)}`;
    elements.homeContinueButton.disabled = false;
  } else {
    elements.homeNextTitle.textContent = 'Choose your grade';
    elements.homeNextMeta.textContent = 'Pick a grade before starting lessons or assessments.';
    elements.homeContinueButton.disabled = false;
  }

  elements.homePathList.innerHTML = lessons.slice(0, 6).map((lesson) => {
    const complete = Boolean(AppState.progress.lessons[lesson.id]);
    const current = nextLesson?.id === lesson.id;
    const type = lesson.kind === 'grammar' ? 'Grammar' : 'Vocabulary';
    return `
      <button type="button" class="home-path-item${complete ? ' complete' : ''}${current ? ' current' : ''}" data-home-lesson-id="${escapeHtml(lesson.id)}">
        <span>${escapeHtml(type)}</span>
        <strong>${escapeHtml(lesson.title)}</strong>
        <small>${escapeHtml(getLessonProgressLabel(lesson))}</small>
      </button>
    `;
  }).join('');
}

function showHomeOrWelcome() {
  if (!AppState.studentName || !VALID_GRADES.includes(AppState.grade)) {
    showPage('welcome');
    return;
  }
  renderHome();
  showPage('home');
}

function showDashboardOrOnboarding() {
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

function showAssessmentsOrOnboarding() {
  if (!AppState.studentName) {
    showPage('signup');
    return;
  }
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
    if (!VALID_GRADES.includes(AssessmentState.testGrade)) {
      AssessmentState.testGrade = VALID_GRADES[0];
    }
    return;
  }

  const activeGrade = AppState.grade;
  if (!VALID_GRADES.includes(AssessmentState.testGrade)) {
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
  return LESSONS.filter((lesson) => lesson.grade <= testGrade);
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
      sourceLessonTitle: lesson.title,
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
      <button type="button" class="segmented-button${AssessmentState.mode === 'quiz' ? ' active' : ''}" data-assessment-mode="quiz">Quiz</button>
      <button type="button" class="segmented-button${AssessmentState.mode === 'test' ? ' active' : ''}" data-assessment-mode="test">Test</button>
    </div>
    ${AssessmentState.mode === 'quiz'
      ? renderQuizBuilder(quizChapters, quizBank)
      : renderTestBuilder(testBank)}
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
        <strong>${escapeHtml(lesson.title)}</strong>
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
  const gradeButtons = VALID_GRADES.map((grade) => `
    <button
      type="button"
      class="segmented-button${AssessmentState.testGrade === grade ? ' active' : ''}"
      data-test-grade="${grade}"
    >Grade ${grade}</button>
  `).join('');
  return `
    <section class="assessment-setup-panel">
      <h3>Test setup</h3>
      <label class="field-label">Level</label>
      <div class="grade-segmented-control">${gradeButtons}</div>
      <label class="field-label">Questions</label>
      <div class="segmented-control">${renderQuestionCountButtons('test')}</div>
      <p class="assessment-summary">
        Covers grades 3-${AssessmentState.testGrade}: ${escapeHtml(getAssessmentTypeSummary(bank) || 'no questions available')}.
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
      <p class="assessment-source">${escapeHtml(question.sourceLessonTitle)} · Grade ${question.sourceGrade}</p>
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
  AssessmentState.message = '';
  renderAssessments();
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

  const correct = AssessmentState.selectedOption === question.english;
  elements.assessmentRunner.querySelectorAll('[data-assessment-option]').forEach((button) => {
    if (button.textContent === question.english) button.classList.add('correct');
    if (button.textContent === AssessmentState.selectedOption && !correct) button.classList.add('wrong');
    button.disabled = true;
  });

  AssessmentState.responses[AssessmentState.currentQuestionIndex] = {
    selected: AssessmentState.selectedOption,
    correct,
    type: question.assessmentType
  };
  AssessmentState.correctCount = AssessmentState.responses.filter((response) => response?.correct).length;
  AssessmentState.answerChecked = true;

  if (result) {
    result.textContent = question.explanation
      ? `${correct ? 'Correct.' : 'Correct answer: ' + question.english + '.'} ${question.explanation}`
      : correct
        ? `${question.latin} means ${question.english}.`
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

function setupEvents() {
  elements.startButton.addEventListener('click', showLessonListOrOnboarding);
  elements.welcomeAccountButton.addEventListener('click', () => {
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
  elements.homePracticeAssessments.addEventListener('click', showAssessmentsOrOnboarding);
  elements.homePracticeDashboard.addEventListener('click', showDashboardOrOnboarding);
  elements.homePathList.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-home-lesson-id]') : null;
    if (target) openLesson(target.dataset.homeLessonId);
  });
  elements.accountButton.addEventListener('click', () => {
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

  // Contact form
  elements.contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = elements.contactForm.querySelector('[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    if (elements.contactFormMessage) {
      elements.contactFormMessage.textContent = 'Sending…';
      elements.contactFormMessage.dataset.tone = 'neutral';
    }
    try {
      const formData = new FormData(elements.contactForm);
      formData.append('form-name', 'contact');
      const res = await fetch('/', { method: 'POST', body: formData });
      if (res.ok) {
        if (elements.contactFormMessage) {
          elements.contactFormMessage.textContent = 'Message sent! We\'ll be in touch.';
          elements.contactFormMessage.dataset.tone = 'success';
        }
        elements.contactForm.reset();
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      console.warn('Contact form error:', err);
      if (elements.contactFormMessage) {
        elements.contactFormMessage.textContent = 'Could not send message. Please email us directly.';
        elements.contactFormMessage.dataset.tone = 'error';
      }
    }
    if (submitButton) submitButton.disabled = false;
  });

  elements.continueGuestButton.addEventListener('click', continueAsGuest);
  elements.signOutButton.addEventListener('click', continueAsGuest);
  elements.signupNextButton.addEventListener('click', () => {
    const name = elements.studentNameInput.value.trim();
    if (!name) return;
    AppState.studentName = name;
    saveState();
    renderAccountControls();
    showPage('grade');
  });
  elements.changeGradeButton.addEventListener('click', () => {
    showPage('grade');
  });
  elements.backToLessons.addEventListener('click', () => {
    showLessonListOrOnboarding();
  });
  elements.homeButton.addEventListener('click', showHomeOrWelcome);
  elements.lessonsButton.addEventListener('click', showLessonListOrOnboarding);
  elements.assessmentsButton.addEventListener('click', showAssessmentsOrOnboarding);
  elements.dashboardButton.addEventListener('click', showDashboardOrOnboarding);
  elements.assessmentsBackButton.addEventListener('click', showHomeOrWelcome);
  elements.backToLessonsFromDashboard.addEventListener('click', () => {
    showHomeOrWelcome();
  });
  elements.nextQuestionButton.addEventListener('click', nextQuestion);
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

window.addEventListener('DOMContentLoaded', () => {
  init();
  setupEvents();
});
