// ═══════════════════════════════════════
//  STORAGE
// ═══════════════════════════════════════
const STORE = 'latinFlashcards_v2';
const GRADE_STORE = 'latinLaunchpadGrade';
const SESSION_LENGTHS = [5, 10, 15];
const CURRICULUM_LEVELS = [
  { grade: 3, year: 1, label: 'Year 1', book: 'First Form Latin', lessonGrades: [3] },
  { grade: 4, year: 2, label: 'Year 2', book: 'Second Form Latin', lessonGrades: [4] },
  { grade: 5, year: 3, label: 'Year 3', book: 'Third Form Latin', lessonGrades: [5] },
  { grade: 6, year: 4, label: 'Year 4', book: 'Advanced Latin', lessonGrades: [6, 7, 8] }
];
function load() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; } }
function save(d) { localStorage.setItem(STORE, JSON.stringify(d)); }
function normaliseSessionLength(mode) {
  const minutes = Number(mode);
  return SESSION_LENGTHS.includes(minutes) ? minutes : SESSION_LENGTHS[0];
}
function normaliseGrade(grade) {
  const value = Number(grade);
  const level = CURRICULUM_LEVELS.find(item => item.grade === value || item.lessonGrades.includes(value));
  return level ? level.grade : 3;
}
function getLevel(grade) {
  return CURRICULUM_LEVELS.find(item => item.grade === normaliseGrade(grade)) || CURRICULUM_LEVELS[0];
}
function isYearFourReferenceVocabularyWord(word) {
  return Array.isArray(word?.sourceImages)
    && word.sourceImages.some(image => /^IMG_253[1-8]\.jpeg$/.test(image));
}
function getVocabularyWordsForLevel(level) {
  const baseWords = level.lessonGrades.flatMap(g => GRADE_WORDS[g] || []);
  if (level.year === 4) {
    return [...baseWords, ...(GRADE_WORDS[5] || []).filter(isYearFourReferenceVocabularyWord)];
  }
  return baseWords.filter(word => !isYearFourReferenceVocabularyWord(word));
}
function getLevelDeck(grade) {
  const level = getLevel(grade);
  const seen = new Set();
  const words = getVocabularyWordsForLevel(level)
    .filter(word => {
      const key = word.latin.toLowerCase().replace(/[^a-z]/g, '');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  const minGrade = Math.min(...level.lessonGrades);
  const maxGrade = Math.max(...level.lessonGrades);
  const phrases = (typeof LATIN_PHRASES === 'undefined' ? [] : LATIN_PHRASES)
    .filter(phrase => (phrase.minGrade || 3) <= maxGrade && (phrase.maxGrade || 8) >= minGrade)
    .map(phrase => ({
      latin: phrase.latin,
      english: phrase.meaning,
      emoji: phrase.icon || 'P',
      note: phrase.note,
      isPhrase: true
    }));
  return [...words, ...phrases];
}
function getData() {
  const d = load();
  const sharedGrade = localStorage.getItem(GRADE_STORE);
  return {
    name:            d.name            || '',
    sessions:        d.sessions        || 0,
    bestPct:         d.bestPct         || null,
    streak:          d.streak          || 0,
    lastSessionDate: d.lastSessionDate || null,
    weekData:        d.weekData        || {},
    sessionLog:      d.sessionLog      || [],
    missedWords:     d.missedWords     || {},
    grade:           normaliseGrade(sharedGrade || d.grade),
    mode:            normaliseSessionLength(d.mode),
    sessionType:     d.sessionType     || 'visual',
  };
}

// ═══════════════════════════════════════
//  WEEK HELPERS
// ═══════════════════════════════════════
function isoWeekKey(date) {
  const d = new Date(date); d.setHours(0,0,0,0);
  d.setDate(d.getDate() + 3 - ((d.getDay()+6) % 7));
  const w1 = new Date(d.getFullYear(), 0, 4);
  const wn = 1 + Math.round(((d - w1) / 86400000 - 3 + ((w1.getDay()+6)%7)) / 7);
  return `${d.getFullYear()}-W${String(wn).padStart(2,'0')}`;
}
function todayStr() { return new Date().toISOString().slice(0,10); }
function currentWeekDays(wd) { return wd[isoWeekKey(new Date())] || []; }
function markTodayDone(wd) {
  const key = isoWeekKey(new Date());
  const days = new Set(wd[key] || []);
  days.add(todayStr());
  wd[key] = [...days];
  return wd;
}
function buildWeekDotData(wd) {
  const labels = ['Mo','Tu','We','Th','Fr','Sa','Su'];
  const today = new Date(); today.setHours(0,0,0,0);
  const dow = (today.getDay()+6)%7;
  const start = new Date(today); start.setDate(today.getDate()-dow);
  const key = isoWeekKey(today);
  const done = new Set(wd[key]||[]);
  return labels.map((label,i) => {
    const d = new Date(start); d.setDate(start.getDate()+i);
    const s = d.toISOString().slice(0,10);
    return { label, date: s, done: done.has(s), today: s===todayStr() };
  });
}
function renderWeekDots(id, wd, large) {
  const dots = buildWeekDotData(wd);
  document.getElementById(id).innerHTML = dots.map(d =>
    `<div class="day-dot${d.done?' done':''}${d.today?' today':''}"
          style="${large?'width:44px;height:44px;font-size:0.75rem':''}">
       ${d.done?'✓':d.label}
     </div>`
  ).join('');
}
function weekMsg(wd) {
  const n = currentWeekDays(wd).length, r = Math.max(0,4-n);
  if (n>=4) return '🎯 Weekly goal reached!';
  if (r===1) return 'One more session to hit your goal!';
  return `${r} more session${r>1?'s':''} to reach your 4-day goal.`;
}
function getWeekRange() {
  const today = new Date(); today.setHours(0,0,0,0);
  const dow = (today.getDay()+6)%7;
  const mon = new Date(today); mon.setDate(today.getDate()-dow);
  const sun = new Date(mon);   sun.setDate(mon.getDate()+6);
  const fmt = d => d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
  return `${fmt(mon)} – ${fmt(sun)}, ${sun.getFullYear()}`;
}

// ═══════════════════════════════════════
//  NAME
// ═══════════════════════════════════════
function saveName() {
  const v = document.getElementById('studentName').value.trim();
  if (!v) return;
  const d = getData(); d.name = v; save(d);
  showNameDisplay(v);
}
function showNameDisplay(name) {
  document.getElementById('nameInputRow').style.display = 'none';
  document.getElementById('nameDisplay').style.display  = 'block';
  document.getElementById('nameDisplay').textContent    = name;
  document.getElementById('nameEditBtn').style.display  = 'inline';
}
function toggleNameEdit() {
  document.getElementById('nameInputRow').style.display = 'flex';
  document.getElementById('nameDisplay').style.display  = 'none';
  document.getElementById('nameEditBtn').style.display  = 'none';
  document.getElementById('studentName').focus();
}

// ═══════════════════════════════════════
//  SPEECH SYNTHESIS
// ═══════════════════════════════════════
const synth = window.speechSynthesis;
let latinVoice = null;

function loadVoices() {
  const voices = synth.getVoices();
  // Prefer a Latin voice if available, else pick a clear English voice
  latinVoice = voices.find(v => v.lang === 'la') ||
               voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
               voices.find(v => v.lang.startsWith('en')) ||
               null;
}
if (synth) {
  loadVoices();
  synth.onvoiceschanged = loadVoices;
}

function speak(text, rate = 0.8, onEnd) {
  if (!synth) { if (onEnd) onEnd(); return; }
  synth.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  if (latinVoice) utt.voice = latinVoice;
  utt.rate  = rate;
  utt.pitch = 1;
  if (onEnd) utt.onend = onEnd;
  synth.speak(utt);
}

// ═══════════════════════════════════════
//  SPEECH RECOGNITION
// ═══════════════════════════════════════
const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let recognition  = null;
let micActive    = false;

function setupRecognition() {
  if (!SpeechRec) return;
  recognition = new SpeechRec();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.maxAlternatives = 3;

  recognition.onresult = (e) => {
    const interim = Array.from(e.results).map(r => r[0].transcript).join('');
    document.getElementById('micTranscript').textContent = '🎤 ' + interim;
    if (e.results[e.results.length - 1].isFinal) {
      const finals = Array.from(e.results[e.results.length-1])
        .map(alt => alt.transcript);
      stopMic();
      processAnswer(finals);
    }
  };
  recognition.onerror = (e) => {
    stopMic();
    if (e.error === 'no-speech') {
      document.getElementById('micStatus').textContent = 'No speech detected — try again';
    } else {
      document.getElementById('micStatus').textContent = `Error: ${e.error}. Try again.`;
    }
  };
  recognition.onend = () => {
    if (micActive) stopMic();
  };
}

function toggleMic() {
  if (!recognition) {
    // Fallback: show self-mark buttons
    document.getElementById('micSection').style.display = 'none';
    // reveal the word
    document.getElementById('audioTag').textContent = '👁️ Answer';
    document.getElementById('audioEmoji').textContent = state.deck[state.index].emoji || '🏛️';
    document.getElementById('audioLatin').textContent = state.deck[state.index].english;
    document.getElementById('fallbackRow').style.display = 'flex';
    return;
  }
  if (micActive) { stopMic(); return; }
  startMic();
}

function startMic() {
  micActive = true;
  const btn = document.getElementById('micBtn');
  btn.classList.add('listening');
  btn.textContent = '⏹';
  document.getElementById('micStatus').textContent    = 'Listening…';
  document.getElementById('micTranscript').textContent = '';
  try { recognition.start(); } catch(e) {}
}

function stopMic() {
  micActive = false;
  const btn = document.getElementById('micBtn');
  btn.classList.remove('listening');
  btn.classList.remove('processing');
  btn.textContent = '🎤';
  try { recognition.stop(); } catch(e) {}
}

// ═══════════════════════════════════════
//  ANSWER MATCHING
// ═══════════════════════════════════════
function normalise(s) {
  return s.toLowerCase().replace(/[^a-z\s]/g, '').trim();
}

function checkAnswer(spokenAlts, correctEnglish) {
  const correct = normalise(correctEnglish);
  // Split by / or , for multiple acceptable answers
  const alts = correct.split(/[\/,]/).map(s => s.trim()).filter(Boolean);

  for (const spoken of spokenAlts) {
    const s = normalise(spoken);
    for (const alt of alts) {
      const altWords = alt.split(/\s+/).filter(w => w.length > 2);
      // Exact or near match
      if (s === alt) return true;
      if (s.includes(alt) || alt.includes(s)) return true;
      // Any key word match (words > 3 chars)
      if (altWords.some(w => w.length > 3 && s.includes(w))) return true;
    }
  }
  return false;
}

// ═══════════════════════════════════════
//  APP STATE
// ═══════════════════════════════════════
let state = {
  mode: 5, sessionType: 'visual', grade: 3,
  deck: [], index: 0, correct: 0, missed: 0,
  results: [], flipped: false,
  timerInterval: null, secondsLeft: 0,
  currentWord: null,
};

// ═══════════════════════════════════════
//  HOME
// ═══════════════════════════════════════
function renderHome() {
  const data = getData();
  state.mode        = data.mode;
  state.sessionType = data.sessionType;
  state.grade       = data.grade;

  if (data.name) { document.getElementById('studentName').value = data.name; showNameDisplay(data.name); }

  document.getElementById('gradeRow').innerHTML = CURRICULUM_LEVELS.map(level =>
    `<button type="button" class="grade-chip${level.grade===state.grade?' selected':''}" data-grade="${level.grade}">${level.label}<small>${level.book}</small></button>`
  ).join('');

  updateModeHighlight();
  renderWeekDots('weekDots', data.weekData);
  const days = currentWeekDays(data.weekData);
  document.getElementById('weekGoalLabel').textContent = `${days.length} / 4 days`;
  document.getElementById('weekMsg').textContent = weekMsg(data.weekData);
  document.getElementById('homeBest').textContent     = data.bestPct !== null ? data.bestPct+'%' : '—';
  document.getElementById('homeSessions').textContent = data.sessions;
  document.getElementById('homeStreak').textContent   = data.streak;

  if (!SpeechRec) document.getElementById('noSpeechBanner').classList.add('show');
}

function updateModeHighlight() {
  document.getElementById('mode5').classList.remove('selected-visual','selected-audio');
  document.getElementById('mode10').classList.remove('selected-visual','selected-audio');
  document.getElementById('mode15').classList.remove('selected-visual','selected-audio');
  document.getElementById('modeAudio').classList.remove('selected-visual','selected-audio');
  if (state.sessionType === 'audio') {
    document.getElementById('modeAudio').classList.add('selected-audio');
  } else if (state.mode === 5) {
    document.getElementById('mode5').classList.add('selected-visual');
  } else if (state.mode === 10) {
    document.getElementById('mode10').classList.add('selected-visual');
  } else {
    document.getElementById('mode15').classList.add('selected-visual');
  }
  const btn = document.getElementById('startBtn');
  btn.textContent = state.sessionType === 'audio' ? '🎙️ Start audio →' : 'Start →';
  btn.className = 'btn ' + (state.sessionType === 'audio' ? 'btn-audio' : 'btn-primary');
}

function selectMode(m, type) {
  state.mode = normaliseSessionLength(m);
  state.sessionType = type;
  updateModeHighlight();
  const d = getData(); d.mode = state.mode; d.sessionType = type; save(d);
  syncDeckHash();
}

function selectGrade(g) {
  state.grade = normaliseGrade(g);
  document.querySelectorAll('.grade-chip').forEach(el =>
    el.classList.toggle('selected', Number(el.dataset.grade) === state.grade)
  );
  localStorage.setItem(GRADE_STORE, String(state.grade));
  const d = getData(); d.grade = state.grade; save(d);
  syncDeckHash();
}

let suppressDeckHash = false;

function deckYear() {
  return CURRICULUM_LEVELS.find((item) => item.grade === state.grade)?.year || 1;
}

function syncDeckHash() {
  if (suppressDeckHash || !window.LatinLaunchpadAssign) return;
  const path = window.LatinLaunchpadAssign.buildPath({
    kind: 'deck',
    year: deckYear(),
    minutes: state.mode,
    sessionType: state.sessionType
  });
  if (!path) return;
  const next = `#${path}`;
  if (window.location.hash === next) return;
  history.replaceState(null, '', `${window.location.pathname}${window.location.search}${next}`);
}

function applyDeckHash() {
  const route = window.LatinLaunchpadAssign?.parsePath(window.location.hash);
  if (!route || route.kind !== 'deck') return;
  const level = CURRICULUM_LEVELS.find((item) => item.year === route.year);
  if (!level) return;
  suppressDeckHash = true;
  selectGrade(level.grade);
  selectMode(route.minutes, route.sessionType);
  suppressDeckHash = false;
}

function announceDeck(message) {
  const status = document.getElementById('deckCopyStatus');
  if (status) status.textContent = message;
}

async function copyDeckText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch (error) { /* fallback below */ }
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

// ═══════════════════════════════════════
//  SESSION SETUP
// ═══════════════════════════════════════
function shuffle(arr) {
  const a=[...arr];
  for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

function startSession() {
  const words = getLevelDeck(state.grade);
  const count = state.mode * 3;
  state.deck    = shuffle(words).slice(0, count);
  state.index   = 0; state.correct = 0; state.missed = 0;
  state.results = []; state.flipped = false;
  state.secondsLeft = (state.sessionType === 'audio' ? 10 : state.mode) * 60;

  if (state.sessionType === 'audio') {
    show('screenAudio');
    renderAudioCard();
  } else {
    show('screenCard');
    renderCard();
  }
  startTimer(state.sessionType === 'audio' ? 'audioTimerBadge' : 'timerBadge');
}

// ═══════════════════════════════════════
//  VISUAL CARD
// ═══════════════════════════════════════
function renderCard() {
  const word  = state.deck[state.index];
  const total = state.deck.length;
  const card = document.getElementById('flashcard');
  // Snap to the front before writing the next word. Leaving the 3D
  // transition on would rotate through the back face and flash the answer.
  card.style.transition = 'none';
  card.classList.remove('flipped');
  void card.offsetWidth;
  card.style.transition = '';
  state.flipped = false;
  document.getElementById('cardEmoji').textContent     = word.emoji||'🏛️';
  document.getElementById('cardEmojiBack').textContent = word.emoji||'🏛️';
  document.getElementById('cardFront').textContent     = word.latin;
  document.getElementById('cardBack').textContent      = word.english;
  const dictionary = document.getElementById('cardDictionary');
  if (dictionary) {
    const entry = word.dictionaryEntry || '';
    dictionary.textContent = entry && entry !== word.latin ? entry : '';
  }
  document.getElementById('cardCounter').textContent   = `${state.index+1} / ${total}`;
  document.getElementById('progressFill').style.width  = `${(state.index/total)*100}%`;
  const row = document.getElementById('answerRow');
  row.style.opacity = '0'; row.style.pointerEvents = 'none';
  updateLiveScore('liveCorrect','liveMissed','livePct');
}

function speakWord() {
  const word = state.deck[state.index];
  if (word) speak(word.latin, 0.75);
}

function flipCard() {
  if (state.flipped) return;
  state.flipped = true;
  document.getElementById('flashcard').classList.add('flipped');
  const row = document.getElementById('answerRow');
  row.style.opacity = '1'; row.style.pointerEvents = 'auto';
}

function markCard(got) {
  state.results.push({ word: state.deck[state.index], got });
  if (got) state.correct++; else state.missed++;
  updateLiveScore('liveCorrect','liveMissed','livePct');
  state.index++;
  if (state.index >= state.deck.length) endSession();
  else renderCard();
}

// ═══════════════════════════════════════
//  AUDIO CARD
// ═══════════════════════════════════════
function renderAudioCard() {
  const word  = state.deck[state.index];
  const total = state.deck.length;
  state.currentWord = word;

  document.getElementById('audioEmoji').textContent  = word.emoji||'🏛️';
  document.getElementById('audioLatin').textContent  = word.latin;
  document.getElementById('audioTag').textContent    = '🔊 Listen & respond';
  document.getElementById('audioCardCounter').textContent = `${state.index+1} / ${total}`;
  document.getElementById('audioProgressFill').style.width = `${(state.index/total)*100}%`;

  // Reset UI
  document.getElementById('audioResult').className  = 'audio-result';
  document.getElementById('audioNextBtn').style.display  = 'none';
  document.getElementById('fallbackRow').style.display   = 'none';
  document.getElementById('micSection').style.display    = 'flex';
  document.getElementById('micStatus').textContent       = 'Tap the mic and say the English meaning';
  document.getElementById('micTranscript').textContent   = '';

  const btn = document.getElementById('micBtn');
  btn.classList.remove('listening','processing');
  btn.textContent = '🎤';

  updateLiveScore('audioLiveCorrect','audioLiveMissed','audioLivePct');

  // Auto-speak after a brief pause
  setTimeout(() => speak(word.latin, 0.75), 400);
}

function speakAudioWord() {
  speak(state.currentWord.latin, 0.75);
}

function processAnswer(spokenAlts) {
  const word = state.currentWord;
  const got  = checkAnswer(spokenAlts, word.english);
  const best = spokenAlts[0] || '';

  document.getElementById('micStatus').textContent      = '';
  document.getElementById('micTranscript').textContent  = '';
  document.getElementById('micSection').style.display   = 'none';

  markAudioCard(got, best);
}

function markAudioCard(got, spokenText) {
  state.results.push({ word: state.currentWord, got });
  if (got) state.correct++; else state.missed++;
  updateLiveScore('audioLiveCorrect','audioLiveMissed','audioLivePct');

  const resultEl  = document.getElementById('audioResult');
  const verdictEl = document.getElementById('resultVerdict');
  const detailEl  = document.getElementById('resultDetail');

  if (got) {
    resultEl.className  = 'audio-result show res-correct';
    verdictEl.className = 'result-verdict v-correct';
    verdictEl.textContent = '✅ Correct!';
    detailEl.innerHTML = spokenText !== 'self'
      ? `You said: <strong>"${spokenText}"</strong><br>Answer: <strong>${state.currentWord.english}</strong>`
      : `Answer: <strong>${state.currentWord.english}</strong>`;
  } else {
    resultEl.className  = 'audio-result show res-wrong';
    verdictEl.className = 'result-verdict v-wrong';
    verdictEl.textContent = '❌ Not quite';
    detailEl.innerHTML = spokenText !== 'self'
      ? `You said: <strong>"${spokenText}"</strong><br>Correct: <strong>${state.currentWord.english}</strong>`
      : `Correct answer: <strong>${state.currentWord.english}</strong>`;
  }

  document.getElementById('audioNextBtn').style.display = 'block';
}

function audioNextCard() {
  state.index++;
  if (state.index >= state.deck.length) endSession();
  else renderAudioCard();
}

// ═══════════════════════════════════════
//  LIVE SCORE
// ═══════════════════════════════════════
function updateLiveScore(cId, mId, pId) {
  document.getElementById(cId).textContent = state.correct;
  document.getElementById(mId).textContent = state.missed;
  const t = state.correct + state.missed;
  document.getElementById(pId).textContent = t > 0 ? Math.round((state.correct/t)*100)+'%' : '—';
}

// ═══════════════════════════════════════
//  TIMER
// ═══════════════════════════════════════
function startTimer(badgeId) {
  clearInterval(state.timerInterval);
  updateTimerDisplay(badgeId);
  state.timerInterval = setInterval(() => {
    state.secondsLeft--;
    updateTimerDisplay(badgeId);
    if (state.secondsLeft <= 0) endSession();
  }, 1000);
}
function updateTimerDisplay(badgeId) {
  const id = badgeId || (state.sessionType==='audio' ? 'audioTimerBadge' : 'timerBadge');
  const m = Math.floor(state.secondsLeft/60), s = state.secondsLeft%60;
  const el = document.getElementById(id);
  el.textContent = `⏱ ${m}:${String(s).padStart(2,'0')}`;
  el.classList.toggle('urgent', state.secondsLeft<=30);
}

// ═══════════════════════════════════════
//  END SESSION
// ═══════════════════════════════════════
function endSession() {
  clearInterval(state.timerInterval);
  synth && synth.cancel();
  micActive && stopMic();

  const total = state.correct + state.missed;
  const pct   = total > 0 ? Math.round((state.correct/total)*100) : 0;

  let data = getData();
  data.sessions++;
  if (data.bestPct === null || pct > data.bestPct) data.bestPct = pct;
  data.weekData = markTodayDone(data.weekData);

  const today = todayStr();
  if (data.lastSessionDate !== today) {
    const yd = new Date(); yd.setDate(yd.getDate()-1);
    const yStr = yd.toISOString().slice(0,10);
    data.streak = (data.lastSessionDate===yStr) ? data.streak+1 : 1;
    data.lastSessionDate = today;
  }

  data.sessionLog.push({
    date: today, mode: state.mode, sessionType: state.sessionType,
    correct: state.correct, missed: state.missed, pct, cards: total,
  });
  if (data.sessionLog.length > 60) data.sessionLog = data.sessionLog.slice(-60);

  state.results.forEach(r => {
    if (!r.got) {
      const key = `${r.word.latin}|${r.word.english}`;
      data.missedWords[key] = (data.missedWords[key]||0) + 1;
    }
  });
  save(data);

  // Summary
  const days = currentWeekDays(data.weekData);
  document.getElementById('sumCorrect').textContent = state.correct;
  document.getElementById('sumMissed').textContent  = state.missed;
  document.getElementById('sumPct').textContent     = pct + '%';

  const hl=document.getElementById('summaryHeadline'), sub=document.getElementById('summarySubtitle');
  if (pct>=90){hl.textContent='Outstanding! 🏆';sub.textContent='You\'re crushing it.';}
  else if(pct>=70){hl.textContent='Great work! 🎉';sub.textContent='Keep that momentum going.';}
  else if(pct>=50){hl.textContent='Good effort! 💪';sub.textContent='Review the missed words below.';}
  else{hl.textContent='Keep at it! 📖';sub.textContent='Practice makes progress.';}

  renderWeekDots('sumWeekDots', data.weekData);
  document.getElementById('sumWeekLabel').textContent = `${days.length} / 4 days`;
  document.getElementById('sumWeekMsg').textContent   = weekMsg(data.weekData);

  document.getElementById('summaryList').innerHTML = state.results.map(r =>
    `<div class="summary-item">
       <span class="si-mark">${r.got?'✅':'❌'}</span>
       <span class="si-latin">${r.word.latin}</span>
       <span class="si-english">${r.word.english} ${r.word.emoji||''}</span>
     </div>`
  ).join('');

  const completion = window.LatinLaunchpadAssign?.encodeCompletion({
    kind: 'deck',
    id: `y${deckYear()}`,
    mode: state.sessionType,
    score: state.correct,
    total,
    missed: state.results.filter((result) => !result.got).map((result) => result.word.latin)
  }) || '';
  const completionCard = document.getElementById('deckCompletionCode');
  const completionValue = document.getElementById('deckCompletionValue');
  if (completionCard && completionValue) {
    completionCard.hidden = !completion;
    completionValue.textContent = completion;
  }

  show('screenSummary');
}

// ═══════════════════════════════════════
//  REPORT
// ═══════════════════════════════════════
function showReport() {
  const data     = getData();
  const weekKey  = isoWeekKey(new Date());
  const weekDays = data.weekData[weekKey] || [];
  const weekSet  = new Set(weekDays);
  const wSess    = data.sessionLog.filter(s => weekSet.has(s.date));

  const totalCards   = wSess.reduce((a,s)=>a+s.cards,0);
  const totalCorrect = wSess.reduce((a,s)=>a+s.correct,0);
  const totalMissed  = wSess.reduce((a,s)=>a+s.missed,0);
  const avgPct  = wSess.length>0 ? Math.round(wSess.reduce((a,s)=>a+s.pct,0)/wSess.length) : null;
  const bestPct = wSess.length>0 ? Math.max(...wSess.map(s=>s.pct)) : null;

  document.getElementById('reportName').textContent     = data.name || '—';
  document.getElementById('reportGrade').textContent    = getLevel(data.grade).label;
  document.getElementById('reportWeek').textContent     = getWeekRange();
  document.getElementById('reportDayCount').textContent = `${weekDays.length} of 4`;
  document.getElementById('reportDateRange').textContent= `Week of ${getWeekRange()}`;

  const gb = document.getElementById('goalBanner');
  if (weekDays.length>=4){ gb.textContent='🎯 Weekly goal met — 4 days practiced!'; gb.className='goal-banner goal-met'; }
  else { gb.textContent=`📅 ${weekDays.length} of 4 days practiced this week`; gb.className='goal-banner goal-unmet'; }

  renderWeekDots('reportWeekDots', data.weekData, true);

  document.getElementById('rsSessions').textContent  = wSess.length;
  document.getElementById('rsCards').textContent     = totalCards;
  document.getElementById('rsAvg').textContent       = avgPct!==null ? avgPct+'%' : '—';
  document.getElementById('rsBest').textContent      = bestPct!==null ? bestPct+'%' : '—';
  document.getElementById('rsCorrect').textContent   = totalCorrect;
  document.getElementById('rsMissedStat').textContent= totalMissed;

  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const tbody = document.getElementById('sessionTableBody');
  tbody.innerHTML = wSess.length===0
    ? '<tr><td colspan="4" style="color:#9ca3af;padding:10px 8px">No sessions this week yet.</td></tr>'
    : wSess.map(s => {
        const d = new Date(s.date+'T12:00:00');
        const label = `${dayNames[d.getDay()]} ${d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}`;
        const chip  = s.pct>=80?'pct-high':s.pct>=60?'pct-mid':'pct-low';
        const modeLabel = s.sessionType==='audio' ? '🎙️ Audio' : `⚡ ${s.mode} min`;
        return `<tr><td>${label}</td><td>${modeLabel}</td><td>${s.cards}</td><td><span class="pct-chip ${chip}">${s.pct}%</span></td></tr>`;
      }).join('');

  const missed = Object.entries(data.missedWords).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const mList = document.getElementById('missedWordsList');
  const mNone = document.getElementById('missedNone');
  if (missed.length===0){ mList.innerHTML=''; mNone.style.display='block'; }
  else {
    mNone.style.display='none';
    mList.innerHTML = missed.map(([key,count]) => {
      const [latin,english] = key.split('|');
      return `<div class="missed-item"><span class="mi-latin">${latin}</span><span class="mi-eng">${english}</span><span class="mi-count">missed ${count}×</span></div>`;
    }).join('');
  }

  show('screenReport');
}

// ═══════════════════════════════════════
//  NAV
// ═══════════════════════════════════════
function show(id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}
function goHome() {
  clearInterval(state.timerInterval);
  synth && synth.cancel();
  micActive && stopMic();
  renderHome();
  show('screenHome');
}
function confirmQuit() {
  if (confirm('Quit this session? Your progress up to this card will be saved.')) endSession();
}

// ═══════════════════════════════════════
//  INIT
// ═══════════════════════════════════════

function bindFlashcardUi() {
  document.body.addEventListener('click', (event) => {
    const origin = event.target instanceof Element ? event.target : event.target?.parentElement;
    const trigger = origin?.closest('[data-action]');
    if (!trigger) return;
    const action = trigger.dataset.action;
    if (action === 'toggle-name-edit') toggleNameEdit();
    else if (action === 'save-name') saveName();
    else if (action === 'select-mode') selectMode(Number(trigger.dataset.minutes), trigger.dataset.sessionType);
    else if (action === 'show-report') showReport();
    else if (action === 'start-session') startSession();
    else if (action === 'confirm-quit') confirmQuit();
    else if (action === 'flip-card') flipCard();
    else if (action === 'speak-word') speakWord();
    else if (action === 'mark-card') markCard(trigger.dataset.correct === 'true');
    else if (action === 'speak-audio') speakAudioWord();
    else if (action === 'toggle-mic') toggleMic();
    else if (action === 'audio-next') audioNextCard();
    else if (action === 'mark-audio') markAudioCard(trigger.dataset.correct === 'true', 'self');
    else if (action === 'go-home') goHome();
    else if (action === 'print-report') window.print();
    else if (action === 'copy-assignment') {
      syncDeckHash();
      const url = `${window.location.origin}${window.location.pathname}${window.location.search}${window.location.hash}`;
      copyDeckText(url).then(() => announceDeck('Assignment link copied.'));
    } else if (action === 'copy-completion') {
      const code = document.getElementById('deckCompletionValue')?.textContent || '';
      if (code) copyDeckText(code).then(() => announceDeck('Completion code copied.'));
    }
  });
  document.body.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const origin = event.target instanceof Element ? event.target : event.target?.parentElement;
    const trigger = origin?.closest('[data-action]');
    if (!trigger || trigger.tagName === 'BUTTON') return;
    event.preventDefault();
    trigger.click();
  });
  document.getElementById('gradeRow').addEventListener('click', (event) => {
    const origin = event.target instanceof Element ? event.target : event.target?.parentElement;
    const chip = origin?.closest('[data-grade]');
    if (chip) selectGrade(Number(chip.dataset.grade));
  });
  const nameInput = document.getElementById('studentName');
  nameInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveName();
    }
  });
  setupRecognition();
  applyDeckHash();
  renderHome();
  syncDeckHash();
  window.addEventListener('hashchange', () => {
    applyDeckHash();
    renderHome();
    syncDeckHash();
  });
}

bindFlashcardUi();
