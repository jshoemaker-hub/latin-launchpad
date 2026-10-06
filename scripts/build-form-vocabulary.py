#!/usr/bin/env python3
"""Build form-vocabulary.js from the owner's glossary crosswalk and Morpheus.

Macrons come from the Lewis & Short quantities in the Morpheus Latin stem
lexicon (Alatius latin-macronizer macrons.txt). Acute accents in that file
are stress marks and are dropped. The Form glossary supplies gender,
declension or conjugation, and book membership. Uncertain glossary rows are
used only when Morpheus confirms the headword and part of speech.
"""

import json
import re
import subprocess
import unicodedata
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CROSSWALK = Path('/home/ubuntu/.cursor/projects/workspace/uploads/crosswalk_193c.json')
MACRONS = Path('/tmp/lex/macrons.txt')
OUT = ROOT / 'form-vocabulary.js'
REPORT = Path('/tmp/form-vocabulary-report.json')

BOOK_NAMES = {
    'first form': 'First Form',
    'first form latin': 'First Form',
    'second form': 'Second Form',
    'second form latin': 'Second Form',
    'third form': 'Third Form',
    'third form latin': 'Third Form',
}
YEAR_BOOKS = [(3, 'First Form'), (4, 'Second Form'), (5, 'Third Form')]
LEMMA_ALIASES = {
    'equitas': 'aequitas',
    'honos': 'honor',
    'codex': 'caudex',
    'pluit': 'pluo',
}
IRREGULAR_VERBS = {
    'sum', 'possum', 'eo', 'fero', 'volo', 'nolo', 'malo', 'fio', 'edo', 'inquam', 'aio', 'do',
}
SKIP_NOUN_CHANT = {'domus', 'vis', 'bos', 'iuppiter', 'jupiter'}
LONG = {
    'a': 'ā', 'e': 'ē', 'i': 'ī', 'o': 'ō', 'u': 'ū', 'y': 'ȳ',
    'A': 'Ā', 'E': 'Ē', 'I': 'Ī', 'O': 'Ō', 'U': 'Ū', 'Y': 'Ȳ',
}
PLAIN = {
    'ā': 'a', 'ē': 'e', 'ī': 'i', 'ō': 'o', 'ū': 'u', 'ȳ': 'y',
    'ă': 'a', 'ĕ': 'e', 'ĭ': 'i', 'ŏ': 'o', 'ŭ': 'u',
    'Ā': 'A', 'Ē': 'E', 'Ī': 'I', 'Ō': 'O', 'Ū': 'U', 'Ȳ': 'Y',
}


def fold(value):
    text = unicodedata.normalize('NFD', str(value or ''))
    text = ''.join(ch for ch in text if unicodedata.category(ch) != 'Mn')
    text = ''.join(PLAIN.get(ch, ch) for ch in text)
    text = text.lower().replace('j', 'i')
    text = re.sub(r'[^a-z]+', ' ', text).strip()
    return text


def macronize_marked(marked):
    out = []
    i = 0
    while i < len(marked):
        ch = marked[i]
        if ch == '^':
            i += 1
            continue
        if i + 1 < len(marked) and marked[i + 1] == '_' and ch in LONG:
            out.append(LONG[ch])
            i += 2
            continue
        if ch == '_':
            i += 1
            continue
        out.append(ch)
        i += 1
    return ''.join(out)


def strip_macrons(value):
    text = unicodedata.normalize('NFD', str(value or ''))
    text = ''.join(ch for ch in text if unicodedata.category(ch) != 'Mn')
    return ''.join(PLAIN.get(ch, ch) for ch in text)


def has_macron(value):
    return any(ch in 'āēīōūȳĀĒĪŌŪȲ' for ch in str(value or ''))


def has_acute(value):
    return any(ch in 'áéíóúýÁÉÍÓÚÝ' for ch in str(value or ''))


def overlay_macrons(site, macron_form):
    site = str(site or '')
    target = str(macron_form or '')
    if not site or not target:
        return site
    site_vowels = [i for i, ch in enumerate(site) if ch.lower() in 'aeiouy']
    marked = []
    for ch in target:
        base = PLAIN.get(ch, ch).lower()
        if base in 'aeiouy':
            marked.append((base, ch in 'āēīōūȳĀĒĪŌŪȲ'))
    if len(site_vowels) != len(marked):
        return site
    chars = list(site)
    for index, (base, is_long) in zip(site_vowels, marked):
        letter = chars[index].lower()
        if letter != base and not (letter in 'ij' and base == 'i') and not (letter in 'uv' and base == 'u'):
            return site
        if is_long:
            chars[index] = LONG.get(chars[index], chars[index])
    return ''.join(chars)


def js_string(value):
    return json.dumps(value, ensure_ascii=False)


def pos_class_from_crosswalk(part):
    text = str(part or '').lower()
    if 'adverb' in text:
        return 'adverb'
    if 'verb' in text:
        return 'verb'
    if 'noun' in text:
        return 'noun'
    if 'adj' in text:
        return 'adjective'
    if 'pronoun' in text:
        return 'pronoun'
    if 'prep' in text:
        return 'preposition'
    if text in {'adverb', 'conjunction', 'interjection', 'numeral', 'other'}:
        return text
    if 'adverb' in text:
        return 'adverb'
    if 'conj' in text:
        return 'conjunction'
    if 'numeral' in text or 'number' in text:
        return 'numeral'
    return ''


def class_from_declension(value):
    text = str(value or '').lower()
    number = ''
    if '1' in text or 'first' in text:
        number = '1'
    elif '2' in text or 'second' in text:
        number = '2'
    elif '3' in text or 'third' in text:
        number = '3'
    elif '4' in text or 'fourth' in text:
        number = '4'
    elif '5' in text or 'fifth' in text:
        number = '5'
    kind = ''
    if 'conj' in text or re.search(r'\(1\)|\(2\)|\(4\)', text):
        kind = 'verb'
    elif 'decl' in text or 'indecl' in text:
        kind = 'noun'
    io = 'io' in text or '-io' in text
    return number, kind, io


def tag_pos(tag):
    if not tag:
        return ''
    return {
        'n': 'noun', 'v': 'verb', 'a': 'adjective', 'd': 'adverb', 'r': 'preposition',
        'c': 'conjunction', 'p': 'pronoun', 'm': 'numeral', 'i': 'interjection',
    }.get(tag[0], '')


def gender_letter(tag):
    if len(tag) < 7:
        return ''
    return {'m': 'm.', 'f': 'f.', 'n': 'n.'}.get(tag[6], '')


def load_site_words():
    script = r'''
const fs = require('fs');
const vm = require('vm');
const context = {};
vm.createContext(context);
['word-banks.js', 'reference-vocabulary.js'].forEach((file) => {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
});
vm.runInContext('this.__C = { GRADE_WORDS };', context);
const words = [];
for (const [grade, list] of Object.entries(context.__C.GRADE_WORDS)) {
  list.forEach((word) => words.push({
    latin: word.latin,
    english: word.english,
    grade: Number(grade),
    principalParts: word.principalParts || '',
    yearFour: Array.isArray(word.sourceImages) && word.sourceImages.some((image) => /^IMG_253[1-8]\.jpeg$/.test(image))
  }));
}
process.stdout.write(JSON.stringify(words));
'''
    raw = subprocess.check_output(['node', '-e', script], cwd=ROOT, text=True)
    return json.loads(raw)


def load_crosswalk():
    rows = json.loads(CROSSWALK.read_text(encoding='utf-8'))
    grouped = defaultdict(list)
    for row in rows:
        key = fold(row.get('latin') or '')
        if not key:
            continue
        book = BOOK_NAMES.get(str(row.get('book') or '').strip().lower(), str(row.get('book') or '').strip())
        grouped[key].append({
            'book': book,
            'latin': row.get('latin') or '',
            'entry': row.get('entry') or '',
            'gender': row.get('gender') or '',
            'part': row.get('partOfSpeech') or '',
            'decl': row.get('declension_or_conjugation') or '',
            'english': row.get('english') or '',
            'uncertain': bool(row.get('uncertain')),
        })
    return grouped


def useful_tag(tag, form, lemma):
    if not tag or len(tag) < 8:
        return False
    if tag[8:9] in {'c', 's'}:
        return False
    kind = tag[0]
    if kind in {'n', 'a', 'p', 'm'}:
        return tag[2] in {'s', 'p'} and tag[7] in {'n', 'g'}
    if kind == 'v':
        if tag.startswith('v1spia') or tag.startswith('v1sria'):
            return True
        if len(tag) > 4 and tag[3] == 'p' and tag[4] == 'n' and tag[5] in {'a', 'p'}:
            return True
        if len(tag) > 4 and tag[4] == 'u' and tag[7] == 'n':
            return True
        return False
    plain_form = fold(form)
    plain_lemma = fold(re.sub(r'\d+$', '', lemma))
    return plain_form == plain_lemma


def scan_morpheus(wanted):
    found = defaultdict(list)
    with MACRONS.open(encoding='utf-8') as handle:
        for line in handle:
            parts = line.rstrip('\n').split('\t')
            if len(parts) < 4:
                continue
            form, tag, lemma, marked = parts[:4]
            key = fold(re.sub(r'\d+$', '', lemma))
            if key not in wanted or not useful_tag(tag, form, lemma):
                continue
            found[key].append({
                'tag': tag,
                'marked': macronize_marked(marked),
                'lemma': re.sub(r'\d+$', '', lemma),
                'form': form,
            })
    return found


def choose_rows(rows, predicate):
    return [row for row in rows if predicate(row)]


def best_lemma_rows(rows, site_latin, cross_rows, existing_parts):
    if not rows:
        return []
    lemmas = defaultdict(list)
    for row in rows:
        lemmas[row['lemma']].append(row)
    cross_pos = ''
    cross_number = ''
    cross_io = False
    certain = [row for row in cross_rows if not row['uncertain']]
    source_rows = certain or cross_rows
    if source_rows:
        cross_pos = pos_class_from_crosswalk(source_rows[0]['part'])
        cross_number, kind, cross_io = class_from_declension(source_rows[0]['decl'])
        if kind == 'verb':
            cross_pos = cross_pos or 'verb'
    ranked = []
    for lemma, items in lemmas.items():
        poses = {tag_pos(item['tag']) for item in items}
        score = 0
        if cross_pos and cross_pos in poses:
            score += 8
        elif cross_pos and poses and cross_pos not in poses:
            score -= 6
        if fold(lemma) == fold(site_latin):
            score += 3
        if lemma[:1].isupper() and site_latin[:1].islower():
            score -= 2
        if existing_parts:
            blob = ' '.join(fold(item['marked']) for item in items)
            score += sum(2 for part in re.split(r'[,/\s]+', existing_parts) if part and fold(part) in blob)
        infinitives = [item['marked'] for item in items if item['tag'].startswith('v') and len(item['tag']) > 4 and item['tag'][4] == 'n' and item['tag'][5] == 'a']
        if cross_number and infinitives:
            plain = strip_macrons(infinitives[0])
            if cross_number == '1' and plain.endswith('are'):
                score += 4
            elif cross_number == '2' and 'ēre' in infinitives[0]:
                score += 4
            elif cross_number == '4' and plain.endswith('ire'):
                score += 4
            elif cross_number == '3' and plain.endswith('ere') and not plain.endswith('are') and 'ēre' not in infinitives[0]:
                score += 4
        ranked.append((score, lemma, items))
    ranked.sort(key=lambda item: (-item[0], item[1]))
    return ranked[0][2]


def gender_from_crosswalk(cross_rows, allow_uncertain):
    pool = [row for row in cross_rows if allow_uncertain or not row['uncertain']]
    genders = []
    for row in pool:
        gender = str(row.get('gender') or '').strip().lower()
        if gender in {'m', 'f', 'n', 'm.', 'f.', 'n.'}:
            genders.append(gender[0] + '.')
    if not genders:
        return ''
    unique = list(dict.fromkeys(genders))
    if len(unique) == 1:
        return unique[0]
    return ''


def prefer_cross_rows(rows, english):
    if len(rows) < 2:
        return rows
    site_gloss = set(fold(english).split())
    grouped = defaultdict(list)
    for row in rows:
        grouped[pos_class_from_crosswalk(row['part']) or row['part']].append(row)
    if len(grouped) < 2:
        return rows

    def score(part_rows):
        overlap = 0
        for row in part_rows:
            overlap = max(overlap, len(site_gloss & set(fold(row.get('english') or '').split())))
        return overlap

    best = max(grouped.values(), key=score)
    return best if score(best) else rows


def confirmed_cross_rows(cross_rows, morpheus_rows):
    certain = [row for row in cross_rows if not row['uncertain']]
    if certain:
        return certain, False
    if not cross_rows or not morpheus_rows:
        return [], True
    cross_pos = pos_class_from_crosswalk(cross_rows[0]['part'])
    morph_pos = {tag_pos(row['tag']) for row in morpheus_rows}
    if cross_pos and cross_pos not in morph_pos and not (cross_pos == 'noun' and 'adjective' in morph_pos):
        return [], True
    return cross_rows, True


def abbreviate_genitive(nom_marked, gen_marked):
    nom = strip_macrons(nom_marked)
    gen = strip_macrons(gen_marked)
    ending = None
    if nom.endswith('a') and gen == nom[:-1] + 'ae':
        ending = '-ae'
    elif (nom.endswith('us') or nom.endswith('um') or nom.endswith('er') or nom.endswith('ir')) and gen.endswith('i') and gen[:-1] == (nom[:-2] if nom.endswith(('us', 'um')) else nom if nom.endswith(('er', 'ir')) else ''):
        ending = '-' + gen_marked[-1]
    elif nom.endswith('us') and gen == nom[:-2] + 'us':
        ending = '-' + gen_marked[-2:]
    elif nom.endswith('es') and gen.endswith('ei') and strip_macrons(gen_marked[:-2]) == nom[:-2]:
        ending = '-' + gen_marked[-2:]
    elif nom.endswith('es') and gen.endswith('ei') and strip_macrons(gen_marked[:-2]) == strip_macrons(nom_marked[:-1]):
        ending = '-' + gen_marked[-2:]
    if nom == gen and nom.endswith('is'):
        ending = '-is'
    if nom.endswith('a') and gen.endswith('orum') and gen[:-4] == nom[:-1]:
        ending = '-' + gen_marked[-4:]
    if nom.endswith('ae') and gen.endswith('arum') and gen[:-4] == nom[:-2]:
        ending = '-' + gen_marked[-4:]
    if ending:
        return ending
    return gen_marked


def noun_entry(site, items, gender):
    noms = [item for item in items if item['tag'][7] == 'n' and item['tag'][2] == 's']
    gens = [item for item in items if item['tag'][7] == 'g' and item['tag'][2] == 's']
    if not noms:
        noms = [item for item in items if item['tag'][7] == 'n' and item['tag'][2] == 'p']
        gens = [item for item in items if item['tag'][7] == 'g' and item['tag'][2] == 'p']
    if not noms:
        return None
    nom = next((item for item in noms if fold(item['form']) == fold(site) or fold(item['marked']) == fold(site)), None)
    if nom is None:
        nom = max(noms, key=lambda item: len(strip_macrons(item['marked'])))
    gender = gender or gender_letter(nom['tag'])
    same_gender_gen = [item for item in gens if not gender or gender_letter(item['tag']) in {gender, ''}] or gens
    gen = ''
    if same_gender_gen:
        plain_nom = strip_macrons(nom['marked'])

        def gen_score(item):
            plain = strip_macrons(item['marked'])
            shared = 0
            for left, right in zip(plain_nom, plain):
                if left != right:
                    break
                shared += 1
            ending_bonus = 5 if plain.endswith(('ae', 'ei', 'is', 'us', 'i', 'orum', 'arum', 'uum', 'erum')) else 0
            return (ending_bonus, shared, -abs(len(plain) - len(plain_nom)))

        same_gender_gen.sort(key=gen_score, reverse=True)
        gen = same_gender_gen[0]['marked']
    head = overlay_macrons(site.split()[0] if ' ' not in site else site, nom['marked'])
    if fold(head) != fold(nom['marked']) and fold(site) != fold(nom['marked']):
        head = nom['marked']
    if ' ' in site and fold(site) != fold(head):
        head = overlay_macrons(site, nom['marked']) if fold(site) == fold(nom['marked']) else site
    if not gen:
        text = f'{head}, {gender}'.strip().rstrip(',') if gender else head
        return text, ''
    ending = abbreviate_genitive(overlay_macrons(strip_macrons(nom['marked']), nom['marked']), gen)
    text = f'{head}, {ending}, {gender}' if gender else f'{head}, {ending}'
    return text, gen


def adjective_entry(site, items):
    noms = [item for item in items if item['tag'][7] == 'n' and item['tag'][2] == 's' and item['tag'][8:9] not in {'c', 's'}]
    masculine = next((item for item in noms if item['tag'][6] == 'm' and fold(item['form']) == fold(site)), None)
    if not masculine:
        masculine = next((item for item in noms if item['tag'][6] == 'm'), None)
    feminine = next((item for item in noms if item['tag'][6] == 'f'), None)
    neuter = next((item for item in noms if item['tag'][6] == 'n'), None)
    if not masculine:
        return None
    head = overlay_macrons(site, masculine['marked'])
    if feminine and neuter:
        fem = feminine['marked']
        neu = neuter['marked']
        fem_plain = strip_macrons(fem)
        neu_plain = strip_macrons(neu)
        mas_plain = strip_macrons(masculine['marked'])
        if mas_plain.endswith('us') and fem_plain.endswith('a') and neu_plain.endswith('um') and fem_plain[:-1] == neu_plain[:-2] == mas_plain[:-2]:
            return f'{head}, -a, -um'
        if fem_plain.endswith('is') and neu_plain.endswith('e') and fem_plain[:-2] == neu_plain[:-1]:
            return f'{head}, -is, -e' if fold(head) != fold(fem) else f'{head}, -e'
        return f'{head}, {fem}, {neu}'
    return head


def verb_parts(site, items):
    def pick(predicate):
        matches = [item for item in items if predicate(item)]
        return matches[0]['marked'] if matches else ''

    present = pick(lambda item: item['tag'].startswith('v1spia'))
    active_inf = pick(lambda item: item['tag'].startswith('v') and len(item['tag']) > 5 and item['tag'][3] == 'p' and item['tag'][4] == 'n' and item['tag'][5] == 'a')
    passive_inf = pick(lambda item: item['tag'].startswith('v') and len(item['tag']) > 5 and item['tag'][3] == 'p' and item['tag'][4] == 'n' and item['tag'][5] == 'p' and strip_macrons(item['marked']).endswith('ri'))
    perfects = [item['marked'] for item in items if item['tag'].startswith('v1sria')]
    if len(perfects) > 1:
        uncontracted = [part for part in perfects if not strip_macrons(part).endswith('ii')]
        perfects = uncontracted or perfects
        ordinary = [part for part in perfects if not strip_macrons(part).endswith('xo')]
        perfects = ordinary or perfects
    perfect = perfects[0] if perfects else ''
    supine = pick(lambda item: len(item['tag']) > 4 and item['tag'][4] == 'u' and item['tag'][7] == 'n')
    if not present:
        return None
    head = overlay_macrons(site, present)
    if fold(strip_macrons(head)) != fold(strip_macrons(present)):
        head = present
    if active_inf:
        parts = [head, active_inf, perfect, supine]
    elif passive_inf:
        parts = [head, passive_inf, (perfect + ' sum').strip() if perfect else '', supine]
    else:
        parts = [head]
    parts = [part for part in parts if part]
    return ', '.join(parts), {
        'present': present,
        'activeInf': active_inf,
        'passiveInf': passive_inf,
        'perfect': perfect,
        'supine': supine,
    }


def conjugation_of(info):
    inf = info.get('activeInf') or ''
    present = strip_macrons(info.get('present') or '')
    plain = strip_macrons(inf)
    if not inf:
        return ''
    if 'āre' in inf or plain.endswith('are'):
        return '1'
    if 'ēre' in inf:
        return '2'
    if plain.endswith('ire') or 'īre' in inf:
        return '4'
    if plain.endswith('ere'):
        if present.endswith('io'):
            return '3io'
        return '3'
    return ''


def chant_for(site, pos, declension, gender, verb_info, genitive_plain):
    key = fold(site).replace(' ', '')
    if not key or ' ' in site:
        return None
    if pos == 'verb':
        if key in IRREGULAR_VERBS or not verb_info or not verb_info.get('activeInf'):
            return None
        conj = conjugation_of(verb_info)
        if conj == '1':
            stem = key[:-1]
            forms = [f'{stem}o', f'{stem}as', f'{stem}at', f'{stem}amus', f'{stem}atis', f'{stem}ant']
        elif conj == '2' and key.endswith('eo'):
            stem = key[:-2]
            forms = [f'{stem}eo', f'{stem}es', f'{stem}et', f'{stem}emus', f'{stem}etis', f'{stem}ent']
        elif conj == '4':
            stem = key[:-1]
            forms = [f'{stem}o', f'{stem}s', f'{stem}t', f'{stem}mus', f'{stem}tis', f'{stem}unt']
        elif conj == '3io' and key.endswith('io'):
            stem = key[:-2]
            forms = [f'{stem}io', f'{stem}is', f'{stem}it', f'{stem}imus', f'{stem}itis', f'{stem}iunt']
        elif conj == '3' and key.endswith('o'):
            stem = key[:-1]
            forms = [f'{stem}o', f'{stem}is', f'{stem}it', f'{stem}imus', f'{stem}itis', f'{stem}unt']
        else:
            return None
        if len(forms[0]) < 3:
            return None
        return {
            'kind': 'verb',
            'labels': ['I', 'you', 'he/she', 'we', 'you all', 'they'],
            'forms': forms,
        }
    if pos != 'noun' or key in SKIP_NOUN_CHANT:
        return None
    labels = ['Nominative', 'Genitive', 'Dative', 'Accusative', 'Ablative']
    if declension == '1' and key.endswith('a'):
        stem = key[:-1]
        return {'kind': 'noun', 'labels': labels, 'forms': [f'{stem}a', f'{stem}ae', f'{stem}ae', f'{stem}am', f'{stem}a']}
    if declension == '2' and key.endswith('um'):
        stem = key[:-2]
        if len(stem) < 2:
            return None
        return {'kind': 'noun', 'labels': labels, 'forms': [key, f'{stem}i', f'{stem}o', key, f'{stem}o']}
    if declension == '2' and key.endswith('us'):
        stem = key[:-2]
        if len(stem) < 2:
            return None
        return {'kind': 'noun', 'labels': labels, 'forms': [key, f'{stem}i', f'{stem}o', f'{stem}um', f'{stem}o']}
    if declension == '2' and key.endswith('er'):
        gen = fold(genitive_plain).replace(' ', '')
        if gen == key + 'i':
            return {'kind': 'noun', 'labels': labels, 'forms': [key, f'{key}i', f'{key}o', f'{key}um', f'{key}o']}
        if gen.endswith('i') and gen[:-1] == key[:-2] + 'r':
            stem = key[:-2] + 'r'
            return {'kind': 'noun', 'labels': labels, 'forms': [key, f'{stem}i', f'{stem}o', f'{stem}um', f'{stem}o']}
        return None
    if declension == '4' and key.endswith('us'):
        stem = key[:-2]
        return {'kind': 'noun', 'labels': labels, 'forms': [key, key, f'{stem}ui', f'{stem}um', f'{stem}u']}
    if declension == '5' and key.endswith('es'):
        stem = key[:-2]
        return {'kind': 'noun', 'labels': labels, 'forms': [key, f'{stem}ei', f'{stem}ei', f'{stem}em', f'{stem}e']}
    if declension == '3' and genitive_plain:
        gen = fold(genitive_plain).replace(' ', '')
        if not gen.endswith('is') or gen == key:
            return None
        stem = gen[:-2]
        if len(stem) < 2:
            return None
        neuter = gender == 'n.'
        i_stem = (neuter and (key.endswith('e') or key.endswith('al') or key.endswith('ar')))
        if i_stem:
            forms = [key, gen, f'{stem}i', key, f'{stem}i']
        else:
            forms = [key, gen, f'{stem}i', key if neuter else f'{stem}em', f'{stem}e']
        return {'kind': 'noun', 'labels': labels, 'forms': forms}
    return None


def ending_hint(site, pos, declension, gender):
    key = fold(site).replace(' ', '')
    if pos == 'preposition':
        return f'{site} is a preposition. The final letters are not a noun or verb ending.'
    if pos == 'noun' and declension == '4' and key.endswith('us'):
        return 'This -us noun is fourth declension. The subject form ends in -us, and the genitive singular is also -us.'
    if pos == 'noun' and declension == '3' and gender == 'n.' and key.endswith('us'):
        return 'This -us noun is third-declension neuter. Here -us is the subject form for one thing, not the usual second-declension masculine ending.'
    if pos == 'noun' and declension == '3' and key.endswith('us'):
        return 'This -us noun is third declension, not second-declension masculine. The subject form ends in -us, and other cases use a different stem.'
    if pos == 'noun' and declension == '3' and key.endswith('is'):
        return 'This -is word is a third-declension subject form for one person or thing, not the ending that means “to/for/by/with the ___s.”'
    if pos == 'noun' and declension == '1' and key.endswith('a'):
        return 'In first-declension nouns, -a is the basic subject form: “the ___” performs the action.'
    if pos == 'noun' and declension == '2' and key.endswith('us'):
        return 'In second-declension nouns, -us is the subject form for one person or thing.'
    if pos == 'noun' and declension == '2' and key.endswith('um'):
        return 'In second-declension nouns, -um can mark the object or a neuter subject.'
    return ''


def infer_declension(pos, gender, nom, gen, verb_info, cross_rows):
    number, kind, io = ('', '', False)
    certain = [row for row in cross_rows if not row['uncertain']] or cross_rows
    if certain:
        number, kind, io = class_from_declension(certain[0]['decl'])
    if pos == 'verb':
        conj = conjugation_of(verb_info or {})
        if conj:
            return {'1': '1', '2': '2', '3': '3', '3io': '3io', '4': '4'}.get(conj, number)
        return number
    plain_nom = strip_macrons(nom or '')
    plain_gen = strip_macrons(gen or '')
    if plain_gen.endswith('ae') and plain_nom.endswith('a'):
        return '1'
    if plain_gen.endswith('i') and (plain_nom.endswith('us') or plain_nom.endswith('um') or plain_nom.endswith('er') or plain_nom.endswith('ir')):
        return '2'
    if plain_nom.endswith('us') and (plain_gen.endswith('us') or plain_gen == plain_nom):
        return '4'
    if plain_gen.endswith('ei') and plain_nom.endswith('es'):
        return '5'
    if plain_gen.endswith('is'):
        return '3'
    return number


def build():
    site_words = load_site_words()
    crosswalk = load_crosswalk()
    by_key = defaultdict(list)
    for word in site_words:
        by_key[fold(word['latin'])].append(word)
    wanted = set(by_key) | set(crosswalk) | set(LEMMA_ALIASES.values())
    morpheus = scan_morpheus(wanted)
    records = {}
    macron_counts = defaultdict(int)
    uncertain_used = []
    uncertain_skipped = []
    for key, words in sorted(by_key.items()):
        site = words[0]['latin']
        english = ' '.join(word.get('english') or '' for word in words)
        existing = next((word['principalParts'] for word in words if word.get('principalParts')), '')
        cross_rows = crosswalk.get(key, [])
        morph_rows = morpheus.get(key, []) or morpheus.get(LEMMA_ALIASES.get(key, ''), [])
        usable_cross, used_uncertain = confirmed_cross_rows(cross_rows, morph_rows)
        if used_uncertain and usable_cross:
            uncertain_used.append(site)
        elif cross_rows and not usable_cross:
            uncertain_skipped.append(site)
        usable_cross = prefer_cross_rows(usable_cross, english)
        chosen = best_lemma_rows(morph_rows, site, usable_cross, existing)
        if chosen and usable_cross:
            wanted_pos = pos_class_from_crosswalk(usable_cross[0]['part'])
            filtered = [item for item in chosen if tag_pos(item['tag']) == wanted_pos]
            if filtered:
                chosen = filtered
        pos = ''
        if usable_cross:
            pos = pos_class_from_crosswalk(usable_cross[0]['part'])
        if chosen:
            morph_pos = tag_pos(chosen[0]['tag'])
            if not pos:
                pos = morph_pos
        gender = gender_from_crosswalk(usable_cross, allow_uncertain=used_uncertain)
        entry = ''
        principal = ''
        verb_info = None
        genitive_plain = ''
        macron_source = ''
        if pos == 'verb' or (chosen and tag_pos(chosen[0]['tag']) == 'verb' and pos in {'', 'verb'}):
            built = verb_parts(site, chosen)
            if built:
                entry, verb_info = built
                principal = entry
                pos = 'verb'
                macron_source = 'Lewis & Short via Morpheus'
        elif pos == 'adjective' or (chosen and tag_pos(chosen[0]['tag']) == 'adjective' and pos in {'', 'adjective'}):
            entry = adjective_entry(site, [item for item in chosen if item['tag'][0] == 'a']) or ''
            if entry:
                pos = 'adjective'
                macron_source = 'Lewis & Short via Morpheus'
        elif chosen and tag_pos(chosen[0]['tag']) == 'noun' and pos in {'', 'noun'}:
            noun_items = [item for item in chosen if item['tag'][0] == 'n']
            built_noun = noun_entry(site, noun_items, gender)
            entry, chosen_gen = built_noun if built_noun else ('', '')
            if entry:
                pos = 'noun'
                genitive_plain = strip_macrons(chosen_gen)
                if not gender:
                    noms = [item for item in noun_items if item['tag'][7] == 'n']
                    gender = gender_letter(noms[0]['tag']) if noms else ''
                macron_source = 'Lewis & Short via Morpheus'
        elif chosen and not entry:
            head = overlay_macrons(site, chosen[0]['marked'])
            entry = head
            pos = pos or tag_pos(chosen[0]['tag'])
            macron_source = 'Lewis & Short via Morpheus'
        if key == 'bona' and not entry:
            entry = 'bona, -ōrum, n.'
            gender = 'n.'
            pos = 'noun'
            macron_source = 'Lewis & Short'
        if key == 'respublica' and not entry:
            entry = 'rēs pūblica, reī pūblicae, f.'
            gender = 'f.'
            pos = 'noun'
            macron_source = 'Lewis & Short'
        if not entry and usable_cross:
            entry = site
            macron_source = 'Form glossary; vowel length unmarked'
        if not entry:
            continue
        nom_marked = ''
        if chosen:
            nom_marked = next((item['marked'] for item in chosen if len(item['tag']) > 7 and item['tag'][7] == 'n'), chosen[0]['marked'])
        declension = infer_declension(pos, gender, nom_marked, genitive_plain, verb_info, usable_cross)
        if key == 'respublica':
            declension = '1'
        if key == 'bona':
            declension = '2'
        books = []
        confirmed = bool(usable_cross) or bool(chosen)
        for row in cross_rows:
            if not row['book'] or row['book'] in books:
                continue
            if row['uncertain'] and not confirmed:
                continue
            if row['uncertain'] and not chosen and not any(not other['uncertain'] for other in cross_rows):
                continue
            books.append(row['book'])
        chant = chant_for(site, pos, declension, gender, verb_info, genitive_plain)
        hint = ending_hint(site, pos, declension, gender)
        if has_macron(entry):
            macron_counts['entries with a macron'] += 1
        elif macron_source.startswith('Lewis'):
            macron_counts['Lewis & Short, no long vowel in the entry'] += 1
        else:
            macron_counts['glossary only, unmarked'] += 1
        if has_acute(entry):
            raise SystemExit(f'Acute accent leaked into {site}: {entry}')
        records[key] = {
            'headword': site,
            'dictionaryEntry': entry,
            'gender': gender,
            'principalParts': principal,
            'partOfSpeech': pos,
            'declension': declension,
            'formBooks': books,
            'macronSource': macron_source,
            'reliable': bool(chosen) or bool(usable_cross),
            'endingHint': hint,
            'chant': chant,
        }
    lines = [
        '// Dictionary forms for the site headwords.',
        '// Macrons: Lewis & Short quantities via the Morpheus Latin stem lexicon.',
        '// Book tags, gender, and declension/conjugation: owner Form glossary crosswalk.',
        '// Uncertain glossary rows are included only when Morpheus confirms the headword.',
        '// Stored progress keys stay on the unmacronized latin field.',
        'const FORM_VOCABULARY = ' + json.dumps(records, ensure_ascii=False, indent=2) + ';',
        '',
        'function foldFormKey(value) {',
        '  return String(value || \'\')',
        '    .normalize(\'NFD\')',
        '    .replace(/[\\u0300-\\u036f]/g, \'\')',
        '    .toLowerCase()',
        '    .replace(/j/g, \'i\')',
        '    .replace(/[^a-z]+/g, \' \')',
        '    .trim();',
        '}',
        '',
        'function getFormRecord(latin) {',
        '  const key = foldFormKey(latin);',
        '  if (!key || typeof FORM_VOCABULARY === \'undefined\') return null;',
        '  return FORM_VOCABULARY[key] || null;',
        '}',
        '',
        'function applyFormVocabulary() {',
        '  if (typeof GRADE_WORDS === \'undefined\') return;',
        '  Object.values(GRADE_WORDS).flat().forEach((word) => {',
        '    const record = getFormRecord(word.latin);',
        '    if (!record) return;',
        '    word.dictionaryEntry = record.dictionaryEntry;',
        '    if (record.gender) word.gender = record.gender;',
        '    if (record.principalParts) word.principalParts = record.principalParts;',
        '    word.partOfSpeech = record.partOfSpeech;',
        '    word.declension = record.declension;',
        '    word.formBooks = record.formBooks.slice();',
        '    word.reliableForms = record.reliable;',
        '  });',
        '}',
        '',
        'applyFormVocabulary();',
        '',
    ]
    # The fold helper above is more complicated than needed and the replacement
    # callbacks are wrong for lowercase. Write a simpler, correct helper.
    OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    mismatches = mismatch_tables(site_words, crosswalk)
    report = {
        'siteHeadwords': len(by_key),
        'records': len(records),
        'macronCounts': macron_counts,
        'uncertainUsed': uncertain_used,
        'uncertainSkipped': uncertain_skipped,
        'books': {
            book: sum(1 for rows in crosswalk.values() if any(row['book'] == book for row in rows))
            for book in ['First Form', 'Second Form', 'Third Form']
        },
        'mismatches': mismatches,
    }
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({k: report[k] for k in ['siteHeadwords', 'records', 'macronCounts', 'books']}, indent=2))
    print('uncertain used', len(uncertain_used), 'skipped', len(uncertain_skipped))
    for year, book, missing_site, missing_book in mismatches:
        print(f'Year table {year}: site-not-in-book {len(missing_site)}, book-not-on-site {len(missing_book)}')


def mismatch_tables(site_words, crosswalk):
    tables = []
    by_grade = defaultdict(list)
    for word in site_words:
        if word.get('yearFour'):
            continue
        by_grade[word['grade']].append(word)
    for grade, book in YEAR_BOOKS:
        site_keys = {fold(word['latin']): word['latin'] for word in by_grade[grade]}
        book_keys = {}
        for key, rows in crosswalk.items():
            if any(row['book'] == book for row in rows):
                book_keys[key] = rows[0]['latin']
        site_not_book = sorted(latin for key, latin in site_keys.items() if key not in book_keys)
        book_not_site = sorted(latin for key, latin in book_keys.items() if key not in site_keys)
        tables.append((grade, book, site_not_book, book_not_site))
    return tables


if __name__ == '__main__':
    build()
