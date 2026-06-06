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

const pages = {
  welcome: document.getElementById('welcomePage'),
  account: document.getElementById('accountPage'),
  signup: document.getElementById('signupPage'),
  grade: document.getElementById('gradePage'),
  lessonList: document.getElementById('lessonListPage'),
  lesson: document.getElementById('lessonPage'),
  dashboard: document.getElementById('dashboardPage')
};

const elements = {
  startButton: document.getElementById('startButton'),
  welcomeAccountButton: document.getElementById('welcomeAccountButton'),
  accountButton: document.getElementById('accountButton'),
  accountBackButton: document.getElementById('accountBackButton'),
  accountForm: document.getElementById('accountForm'),
  accountEmailInput: document.getElementById('accountEmailInput'),
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
  renderDashboard();
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
  renderLessonList();
  showPage('lessonList');
}

async function signInWithEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!isValidEmail(normalizedEmail)) {
    setAccountMessage('Enter a valid email address.', 'error');
    return;
  }

  const submitButton = document.getElementById('emailLoginButton');
  if (submitButton) submitButton.disabled = true;
  setAccountMessage('Signing in…', 'neutral');

  saveState();
  const account = createEmailAccount(normalizedEmail);

  // Try Supabase first, fall back to localStorage profile
  const remoteProfile = await supabaseLoadProfile(normalizedEmail);
  const existingLocalProfile = getStoredProfile(account.profileId);
  const isNew = !remoteProfile && !existingLocalProfile;
  const nextState = remoteProfile || existingLocalProfile || createStateSnapshot(AppState, account);

  applyStoredState(nextState, account);
  AppState.account = account;
  evaluateBadges();
  saveState();
  if (submitButton) submitButton.disabled = false;
  renderAfterProfileChange();
  setAccountMessage(isNew ? 'Account created.' : 'Signed in.', 'success');
}

function continueAsGuest() {
  saveState();
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
  if (AppState.studentName && AppState.grade) {
    renderLessonList();
    showPage('lessonList');
  } else {
    showPage('welcome');
  }
  renderGradeOptions();
  renderDashboard();

  // Background refresh from Supabase for signed-in users
  if (isEmailAccount()) {
    const remote = await supabaseLoadProfile(AppState.account.email);
    if (remote) {
      const account = AppState.account;
      applyStoredState(remote, account);
      AppState.account = account;
      evaluateBadges();
      saveState();
      renderAfterProfileChange();
      if (AppState.studentName && VALID_GRADES.includes(AppState.grade)) {
        renderLessonList();
        showPage('lessonList');
      }
    }
  }
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
  renderLessonPrintables(lesson);
  renderLessonPuzzles(lesson);
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
  const sourceNote = lesson.sourceNote ? `<p>${escapeHtml(lesson.sourceNote)}</p>` : '';
  const storyNote = lesson.story
    ? `<p><strong>Story:</strong> ${escapeHtml(lesson.story.title)} - ${escapeHtml(lesson.story.summary)}</p>`
    : '';
  const rows = lesson.words.map((word) => {
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
  elements.startButton.addEventListener('click', showLessonListOrOnboarding);
  elements.welcomeAccountButton.addEventListener('click', () => {
    renderAccountControls();
    showPage('account');
  });
  elements.accountButton.addEventListener('click', () => {
    renderAccountControls();
    showPage('account');
  });
  elements.accountBackButton.addEventListener('click', showBestLearningPage);
  elements.accountForm.addEventListener('submit', (event) => {
    event.preventDefault();
    signInWithEmail(elements.accountEmailInput.value);
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
