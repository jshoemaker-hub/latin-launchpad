// Hexameter checker.
// Mark long vowels with macrons (ā ē ī ō ū). Unmarked vowels are short.
// qu = one consonant. h is ignored. x and z = two consonants.
// A mute+liquid cluster counts as one consonant, so the vowel before it can stay short.
// A syllable is long when its vowel is long, it is a diphthong, or two consonants follow it.

const DIPHTHONGS = new Set(['ae', 'au', 'oe', 'ei', 'eu']);
const MUTES = new Set(['b', 'c', 'd', 'g', 'p', 't', 'f', 'ch', 'th', 'ph']);
const LIQUIDS = new Set(['l', 'r']);

function bare(ch) {
  return ch
    .toLowerCase()
    .replace(/[āă]/g, 'a')
    .replace(/[ēĕ]/g, 'e')
    .replace(/[īĭ]/g, 'i')
    .replace(/[ōŏ]/g, 'o')
    .replace(/[ūŭ]/g, 'u');
}

function isLongVowel(ch) {
  return /[āēīōū]/.test(ch);
}

function isVowel(ch) {
  return /[aeiouyāēīōūăĕĭŏŭ]/i.test(ch);
}

function tokenize(line) {
  return line.replace(/[.,;:!?“”"'()—-]/g, ' ').trim().split(/\s+/).filter(Boolean);
}

function consonantWeight(cluster) {
  const chars = cluster.replace(/h/g, '').replace(/qu/g, 'q').replace(/x/g, 'xx').replace(/z/g, 'zz');
  // Collapse mute+liquid (including ch/th/ph + l/r) to one consonant.
  let weight = 0;
  for (let i = 0; i < chars.length; i += 1) {
    const two = chars.slice(i, i + 2);
    const three = chars.slice(i, i + 3);
    if ((two === 'ch' || two === 'th' || two === 'ph') && LIQUIDS.has(chars[i + 2] || '')) {
      weight += 1;
      i += 2;
      continue;
    }
    if (MUTES.has(chars[i]) && LIQUIDS.has(chars[i + 1] || '')) {
      weight += 1;
      i += 1;
      continue;
    }
    weight += 1;
  }
  return weight;
}

function nucleiOf(word) {
  const chars = [...word];
  const nuclei = [];
  for (let i = 0; i < chars.length; i += 1) {
    if (!isVowel(chars[i])) continue;
    if (bare(chars[i]) === 'u' && i > 0 && bare(chars[i - 1]) === 'q') continue;
    const pair = bare(chars[i]) + bare(chars[i + 1] || '');
    const diphthong = DIPHTHONGS.has(pair);
    nuclei.push({
      index: i,
      end: i + (diphthong ? 2 : 1),
      length: diphthong || isLongVowel(chars[i]) || (diphthong && isLongVowel(chars[i + 1] || '')) ? 'L' : 'S',
      text: chars.slice(i, i + (diphthong ? 2 : 1)).join('')
    });
    if (diphthong) i += 1;
  }
  return nuclei;
}

function followingConsonants(chars, from, to) {
  return chars.slice(from, to).map(bare).join('').replace(/h/g, '');
}

function analyze(line) {
  const words = tokenize(line).map((word) => {
    const chars = [...word];
    const nuclei = nucleiOf(word);
    const syllables = nuclei.map((nucleus, index) => {
      const next = nuclei[index + 1];
      const consonants = followingConsonants(chars, nucleus.end, next ? next.index : chars.length);
      return { ...nucleus, consonants, word };
    });
    return { word, chars, syllables };
  });

  for (let i = 0; i < words.length - 1; i += 1) {
    const sylls = words[i].syllables;
    const nextWord = words[i + 1].word;
    if (!sylls.length) continue;
    const last = sylls[sylls.length - 1];
    const startsVowel = isVowel(nextWord[0]) || bare(nextWord[0]) === 'h';
    if (startsVowel && (last.consonants === '' || last.consonants === 'm')) {
      sylls.pop();
    }
  }

  const flat = words.flatMap((word) => word.syllables);
  const marked = flat.map((syllable, index) => {
    const next = flat[index + 1];
    let cluster = syllable.consonants;
    if (next && next.word !== syllable.word) {
      const onset = [...next.word].map(bare).join('').match(/^[^aeiou]*/)?.[0] || '';
      // onset is the next word's leading consonants; the next syllable's vowel index is inside that word.
      const nextChars = [...next.word];
      const lead = [];
      for (const ch of nextChars) {
        if (isVowel(ch)) break;
        lead.push(bare(ch));
      }
      cluster += lead.join('');
    }
    const weight = consonantWeight(cluster);
    const length = syllable.length === 'L' || weight >= 2 ? 'L' : 'S';
    return {
      text: syllable.text + syllable.consonants,
      length,
      weight,
      cluster
    };
  });
  return marked;
}

function parseHexameter(marks) {
  const pattern = marks.map((item) => item.length).join('');
  function walk(pos, feet) {
    if (feet.length === 6) return pos === pattern.length ? feet : null;
    if (pattern[pos] !== 'L') return null;
    if (feet.length === 5) {
      return pos + 2 === pattern.length ? feet.concat(pattern.slice(pos)) : null;
    }
    const choices = [];
    if (pattern.slice(pos, pos + 3) === 'LSS') choices.push(3);
    if (pattern.slice(pos, pos + 2) === 'LL') choices.push(2);
    const allowed = feet.length === 4 ? choices.filter((size) => size === 3) : choices;
    for (const size of allowed) {
      const found = walk(pos + size, feet.concat(pattern.slice(pos, pos + size)));
      if (found) return found;
    }
    return null;
  }
  return { pattern, feet: walk(0, []) };
}


module.exports = { analyze, parseHexameter };
