(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.LatinLaunchpadAssign = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const PRACTICE_MODES = ['meaning', 'picture', 'arrange', 'translate', 'compose', 'recall', 'ending', 'chant'];
  const QUESTION_COUNTS = [10, 25, 50, 100];
  const NLE_LEVELS = ['intro', 'beginning', 'beginning-reading', 'intermediate', 'intermediate-reading', 'advanced-prose', 'advanced-poetry', 'advanced-reading'];
  const NLE_CATEGORIES = ['grammar', 'vocabulary', 'derivatives', 'mottoes', 'oral', 'mythology', 'history', 'geography', 'culture', 'reading'];
  const NLE_COUNTS = [5, 10, 15];
  const CARD_SECONDS = [300, 600, 900];
  const DECK_MINUTES = [5, 10, 15];
  const DECK_TYPES = ['visual', 'audio'];
  const LESSON_ID = /^grade[3-8]-(?:grammar(?:-[a-z0-9]+)+|\d+)$/;
  const KIND_LETTERS = { lesson: 'L', quiz: 'Q', test: 'T', nle: 'N', cards: 'C', deck: 'D' };
  const LETTER_KINDS = Object.fromEntries(Object.entries(KIND_LETTERS).map(([kind, letter]) => [letter, kind]));

  function isYear(value) {
    return [1, 2, 3, 4].includes(Number(value));
  }

  function isLessonId(value) {
    return LESSON_ID.test(String(value || ''));
  }

  function parsePath(hash) {
    const raw = String(hash || '').replace(/^#/, '').trim();
    if (!raw.startsWith('/')) return null;
    const parts = raw.split('/').filter(Boolean);
    if (!parts.length) return null;
    const [head, ...rest] = parts;
    if (head === 'check' && rest.length === 0) return { kind: 'check' };
    if (head === 'y' && isYear(rest[0])) {
      const year = Number(rest[0]);
      if (rest.length === 1) return { kind: 'year', year };
      if (rest[1] === 'l' && isLessonId(rest[2]) && rest.length === 3) {
        return { kind: 'lesson', year, lessonId: rest[2], mode: 'meaning' };
      }
      if (rest[1] === 'l' && isLessonId(rest[2]) && rest[3] === 'm' && PRACTICE_MODES.includes(rest[4]) && rest.length === 5) {
        return { kind: 'lesson', year, lessonId: rest[2], mode: rest[4] };
      }
      return null;
    }
    if (head === 'q' && isYear(rest[0]) && QUESTION_COUNTS.includes(Number(rest[1])) && rest.length <= 3) {
      const lessonIds = rest[2] ? rest[2].split('+') : null;
      if (lessonIds && (lessonIds.length === 0 || lessonIds.some((id) => !isLessonId(id)))) return null;
      return { kind: 'quiz', year: Number(rest[0]), count: Number(rest[1]), lessonIds };
    }
    if (head === 't' && isYear(rest[0]) && QUESTION_COUNTS.includes(Number(rest[1])) && rest.length === 2) {
      return { kind: 'test', year: Number(rest[0]), count: Number(rest[1]) };
    }
    if (head === 'nle') {
      if (rest.length === 0) return { kind: 'nle' };
      if (!NLE_LEVELS.includes(rest[0])) return null;
      if (rest.length === 1) return { kind: 'nle', levelId: rest[0] };
      if (rest[1] === 'exam' && rest.length === 2) return { kind: 'nle', levelId: rest[0], exam: true };
      if (rest[1] === 'p' && NLE_CATEGORIES.includes(rest[2]) && NLE_COUNTS.includes(Number(rest[3])) && rest.length === 4) {
        return { kind: 'nle', levelId: rest[0], category: rest[2], count: Number(rest[3]) };
      }
      return null;
    }
    if (head === 'cards' && isYear(rest[0]) && CARD_SECONDS.includes(Number(rest[1])) && ['0', '1'].includes(rest[2]) && rest.length === 3) {
      return { kind: 'cards', year: Number(rest[0]), seconds: Number(rest[1]), shuffle: Number(rest[2]) };
    }
    if (head === 'deck' && isYear(rest[0]) && DECK_MINUTES.includes(Number(rest[1])) && DECK_TYPES.includes(rest[2]) && rest.length === 3) {
      return { kind: 'deck', year: Number(rest[0]), minutes: Number(rest[1]), sessionType: rest[2] };
    }
    return null;
  }

  function buildPath(route) {
    const parsed = route && route.kind ? route : null;
    if (!parsed) return '';
    if (parsed.kind === 'check') return '/check';
    if (parsed.kind === 'year' && isYear(parsed.year)) return `/y/${Number(parsed.year)}`;
    if (parsed.kind === 'lesson' && isYear(parsed.year) && isLessonId(parsed.lessonId) && PRACTICE_MODES.includes(parsed.mode || 'meaning')) {
      const mode = parsed.mode || 'meaning';
      return mode === 'meaning'
        ? `/y/${Number(parsed.year)}/l/${parsed.lessonId}`
        : `/y/${Number(parsed.year)}/l/${parsed.lessonId}/m/${mode}`;
    }
    if (parsed.kind === 'quiz' && isYear(parsed.year) && QUESTION_COUNTS.includes(Number(parsed.count))) {
      const ids = Array.isArray(parsed.lessonIds) ? parsed.lessonIds : null;
      if (ids && (ids.length === 0 || ids.some((id) => !isLessonId(id)))) return '';
      const suffix = ids && ids.length ? `/${ids.join('+')}` : '';
      return `/q/${Number(parsed.year)}/${Number(parsed.count)}${suffix}`;
    }
    if (parsed.kind === 'test' && isYear(parsed.year) && QUESTION_COUNTS.includes(Number(parsed.count))) {
      return `/t/${Number(parsed.year)}/${Number(parsed.count)}`;
    }
    if (parsed.kind === 'nle') {
      if (!parsed.levelId) return '/nle';
      if (!NLE_LEVELS.includes(parsed.levelId)) return '';
      if (parsed.exam) return `/nle/${parsed.levelId}/exam`;
      if (parsed.category) {
        if (!NLE_CATEGORIES.includes(parsed.category) || !NLE_COUNTS.includes(Number(parsed.count))) return '';
        return `/nle/${parsed.levelId}/p/${parsed.category}/${Number(parsed.count)}`;
      }
      return `/nle/${parsed.levelId}`;
    }
    if (parsed.kind === 'cards' && isYear(parsed.year) && CARD_SECONDS.includes(Number(parsed.seconds)) && [0, 1].includes(Number(parsed.shuffle))) {
      return `/cards/${Number(parsed.year)}/${Number(parsed.seconds)}/${Number(parsed.shuffle)}`;
    }
    if (parsed.kind === 'deck' && isYear(parsed.year) && DECK_MINUTES.includes(Number(parsed.minutes)) && DECK_TYPES.includes(parsed.sessionType)) {
      return `/deck/${Number(parsed.year)}/${Number(parsed.minutes)}/${parsed.sessionType}`;
    }
    return '';
  }

  function fnv1a(text) {
    let hash = 0x811c9dc5;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  function encodeBase64Url(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  function decodeBase64Url(text) {
    const padded = String(text || '').replace(/-/g, '+').replace(/_/g, '/');
    const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
    const binary = atob(padded + pad);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  function isSafeMissedLabel(text) {
    if (!text || text.length > 48) return false;
    if (/[0-9@]/.test(text)) return false;
    if (!/^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF '\-]+$/.test(text)) return false;
    const words = text.split(' ');
    if (words.length > 6 || words.some((word) => word.length > 24)) return false;
    const capitals = text.match(/[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g) || [];
    if (words.length > 1 && capitals.length > 1) return false;
    return true;
  }

  function normalizeMissedLabel(value) {
    const original = String(value || '').trim();
    const slug = original.toLowerCase();
    if (/^[a-z0-9]+(?:-[a-z0-9]+){0,8}$/.test(slug) && slug.length <= 48) return slug;
    let text = original.replace(/[.?!;:]+$/g, '').trim().replace(/\s+/g, ' ');
    if (text.includes(',')) text = text.split(',')[0].trim();
    return isSafeMissedLabel(text) ? text : '';
  }

  function activityIdOk(value) {
    return /^[a-z0-9][a-z0-9+-]{0,800}$/.test(String(value || ''));
  }

  function modeOk(value) {
    return value === '-' || /^[a-z0-9-]{1,24}$/.test(String(value || ''));
  }

  function encodeCompletion(payload) {
    const kind = KIND_LETTERS[payload?.kind];
    const id = String(payload?.id || '');
    const mode = payload?.mode ? String(payload.mode) : '-';
    const score = Number(payload?.score);
    const total = Number(payload?.total);
    if (!kind || !activityIdOk(id) || !modeOk(mode)) return '';
    if (!Number.isInteger(score) || !Number.isInteger(total) || score < 0 || total < 0 || score > total || total > 500) return '';
    const missed = (Array.isArray(payload.missed) ? payload.missed : [])
      .map(normalizeMissedLabel)
      .filter(Boolean)
      .slice(0, 40);
    const body = ['1', kind, id, mode, String(score), String(total), missed.join(',')].join('|');
    return `LL1.${encodeBase64Url(body)}.${fnv1a(body)}`;
  }

  function describeActivity(payload) {
    const names = {
      lesson: 'Lesson',
      quiz: 'Quiz',
      test: 'Test',
      nle: 'NLE practice',
      cards: 'Flashcards',
      deck: 'Flashcard session'
    };
    return [names[payload.kind] || 'Activity', payload.id, payload.mode].filter((part) => part && part !== '-').join(' · ');
  }

  function decodeCompletion(code) {
    const compact = String(code || '').replace(/\s+/g, '');
    const parts = compact.split('.');
    if (parts.length !== 3 || parts[0] !== 'LL1') {
      return { ok: false, error: 'That code could not be read.' };
    }
    let body = '';
    try {
      body = decodeBase64Url(parts[1]);
    } catch (error) {
      return { ok: false, error: 'That code could not be read.' };
    }
    if (fnv1a(body) !== parts[2]) {
      return { ok: false, error: 'This code is damaged or incomplete. Ask the student to copy it again.' };
    }
    const fields = body.split('|');
    if (fields.length !== 7 || fields[0] !== '1' || !LETTER_KINDS[fields[1]]) {
      return { ok: false, error: 'That code could not be read.' };
    }
    const score = Number(fields[4]);
    const total = Number(fields[5]);
    if (!activityIdOk(fields[2]) || !modeOk(fields[3]) || !Number.isInteger(score) || !Number.isInteger(total) || score < 0 || total < 0 || score > total || total > 500) {
      return { ok: false, error: 'That code could not be read.' };
    }
    const missed = fields[6]
      ? fields[6].split(',').map(normalizeMissedLabel).filter(Boolean).slice(0, 40)
      : [];
    const payload = {
      kind: LETTER_KINDS[fields[1]],
      id: fields[2],
      mode: fields[3] === '-' ? '' : fields[3],
      score,
      total,
      missed,
      scoreLabel: fields[3] === 'timer' ? 'Cards seen' : 'Score'
    };
    payload.label = describeActivity(payload);
    return { ok: true, payload };
  }

  return {
    parsePath,
    buildPath,
    encodeCompletion,
    decodeCompletion,
    normalizeMissedLabel,
    PRACTICE_MODES,
    QUESTION_COUNTS,
    NLE_LEVELS,
    NLE_CATEGORIES
  };
});
