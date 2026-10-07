#!/usr/bin/env python3
"""Build supplemental core-word lessons from public frequency ranks.

Ranks come from the Dickinson College Commentaries Latin Core Vocabulary
(CC BY-SA 3.0). This script uses the rank and part of speech only. English
glosses below are original. Macrons come from Lewis & Short quantities in
the Morpheus stem lexicon, the same source as form-vocabulary.js.
"""

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('formbuild', ROOT / 'scripts' / 'build-form-vocabulary.py')
forms = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(forms)

# latin, english, emoji, grade, rank, part, declension hint
WORDS = [
    # Year 1: remaining common 1st/2nd-declension nouns.
    ('cura', 'care / concern', '🤲', 3, 186, 'noun', '1st declension'),
    ('fama', 'report / reputation', '📣', 3, 278, 'noun', '1st declension'),
    ('flamma', 'flame', '🔥', 3, 298, 'noun', '1st declension'),
    ('copia', 'supply / abundance', '📦', 3, 331, 'noun', '1st declension'),
    ('mora', 'delay', '⏳', 3, 399, 'noun', '1st declension'),
    ('coma', 'hair', '💇', 3, 405, 'noun', '1st declension'),
    ('aura', 'breeze', '🌬️', 3, 420, 'noun', '1st declension'),
    ('forma', 'shape / form', '🔷', 3, 422, 'noun', '1st declension'),
    ('somnus', 'sleep', '😴', 3, 438, 'noun', '2nd declension'),
    ('anima', 'breath / soul', '💨', 3, 493, 'noun', '1st declension'),
    # Year 2: more 1st/2nd-declension nouns and adjectives, plus 2nd-conjugation verbs.
    ('tantus', 'so great', '📏', 4, 105, 'adjective', '1st and 2nd declension'),
    ('medius', 'middle', '🎯', 4, 162, 'adjective', '1st and 2nd declension'),
    ('fuga', 'flight / escape', '🏃', 4, 364, 'noun', '1st declension'),
    ('modus', 'way / manner', '🧭', 4, 195, 'noun', '2nd declension'),
    ('consilium', 'plan / advice', '💡', 4, 217, 'noun', '2nd declension'),
    ('castrum', 'fort', '🏰', 4, 224, 'noun', '2nd declension'),
    ('periculum', 'danger', '⚠️', 4, 265, 'noun', '2nd declension'),
    ('tectum', 'roof', '🏠', 4, 386, 'noun', '2nd declension'),
    ('spatium', 'space / interval', '📐', 4, 426, 'noun', '2nd declension'),
    ('fatum', 'fate', '🧵', 4, 157, 'noun', '2nd declension'),
    ('beneficium', 'kindness / favor', '🎁', 4, 182, 'noun', '2nd declension'),
    ('votum', 'vow / offering', '🙏', 4, 334, 'noun', '2nd declension'),
    ('durus', 'hard', '🪨', 4, 249, 'adjective', '1st and 2nd declension'),
    ('tutus', 'safe', '🛡️', 4, 365, 'adjective', '1st and 2nd declension'),
    ('verus', 'true', '✅', 4, 410, 'adjective', '1st and 2nd declension'),
    ('plenus', 'full', '🥛', 4, 459, 'adjective', '1st and 2nd declension'),
    ('carus', 'dear', '💛', 4, 462, 'adjective', '1st and 2nd declension'),
    ('iaceo', 'lie / be lying down', '🛌', 4, 228, 'verb', '2nd conjugation'),
    ('placeo', 'please', '😊', 4, 287, 'verb', '2nd conjugation'),
    ('misceo', 'mix', '🥣', 4, 425, 'verb', '2nd conjugation'),
    # Year 3: words for joining and shaping sentences.
    ('si', 'if', '❓', 5, 16, 'conjunction', ''),
    ('nec', 'and not', '🚫', 5, 19, 'conjunction', ''),
    ('sed', 'but', '↔️', 5, 20, 'conjunction', ''),
    ('aut', 'or', '🔀', 5, 24, 'conjunction', ''),
    ('atque', 'and', '&', 5, 35, 'conjunction', ''),
    ('enim', 'for / indeed', '💬', 5, 57, 'conjunction', ''),
    ('tamen', 'however', '🔁', 5, 58, 'conjunction', ''),
    ('nam', 'for', '💬', 5, 61, 'conjunction', ''),
    ('dum', 'while', '⏱️', 5, 103, 'conjunction', ''),
    ('autem', 'however / moreover', '🔁', 5, 123, 'conjunction', ''),
    ('quia', 'because', '👉', 5, 132, 'conjunction', ''),
    ('iam', 'now / already', '⏰', 5, 34, 'adverb', ''),
    ('etiam', 'also / even', '➕', 5, 67, 'adverb', ''),
    ('sic', 'thus / so', '➡️', 5, 79, 'adverb', ''),
    ('tam', 'so', '📏', 5, 96, 'adverb', ''),
    ('ita', 'so / in this way', '➡️', 5, 120, 'adverb', ''),
    ('bene', 'well', '👍', 5, 235, 'adverb', ''),
    ('primum', 'first', '1️⃣', 5, 252, 'adverb', ''),
    ('simul', 'at the same time', '⏱️', 5, 274, 'adverb', ''),
    ('satis', 'enough', '✅', 5, 341, 'adverb', ''),
    # Year 4, grade 6: more description, place, and time words.
    ('quoque', 'also', '➕', 6, 76, 'adverb', ''),
    ('magis', 'more', '📈', 6, 90, 'adverb', ''),
    ('prope', 'near', '📍', 6, 189, 'preposition', ''),
    ('unde', 'from where', '🧭', 6, 300, 'adverb', ''),
    ('inde', 'from there', '➡️', 6, 328, 'adverb', ''),
    ('diu', 'for a long time', '⏳', 6, 361, 'adverb', ''),
    ('huc', 'to here', '📍', 6, 368, 'adverb', ''),
    ('adhuc', 'still / so far', '⏳', 6, 379, 'adverb', ''),
    ('rursus', 'again', '🔁', 6, 440, 'adverb', ''),
    ('tandem', 'at last', '🏁', 6, 427, 'adverb', ''),
    ('mox', 'soon', '⏭️', 6, 469, 'adverb', ''),
    ('dignus', 'worthy', '🏅', 6, 291, 'adjective', '1st and 2nd declension'),
    ('cunctus', 'all', '👥', 6, 292, 'adjective', '1st and 2nd declension'),
    ('humanus', 'human', '🧑', 6, 355, 'adjective', '1st and 2nd declension'),
    ('alienus', 'belonging to another', '🔄', 6, 367, 'adjective', '1st and 2nd declension'),
    ('clarus', 'clear / famous', '✨', 6, 395, 'adjective', '1st and 2nd declension'),
    ('beatus', 'blessed / happy', '😊', 6, 408, 'adjective', '1st and 2nd declension'),
    ('gratus', 'pleasing / grateful', '🙏', 6, 434, 'adjective', '1st and 2nd declension'),
    ('ultimus', 'last', '🔚', 6, 432, 'adjective', '1st and 2nd declension'),
    ('extremus', 'outermost', '↔️', 6, 385, 'adjective', '1st and 2nd declension'),
    # Year 4, grade 7: pronouns, 3rd declension, and 3rd/4th-conjugation verbs.
    ('qui', 'who / which', '❓', 7, 3, 'pronoun', ''),
    ('hic', 'this', '👉', 7, 7, 'pronoun', ''),
    ('ille', 'that', '👉', 7, 8, 'pronoun', ''),
    ('is', 'he / she / it / that', '👤', 7, 13, 'pronoun', ''),
    ('sui', 'himself / herself / itself', '🪞', 7, 17, 'pronoun', ''),
    ('suus', 'his own / her own / its own', '🪞', 7, 27, 'adjective', '1st and 2nd declension'),
    ('idem', 'the same', '🔁', 7, 59, 'pronoun', ''),
    ('nemo', 'no one', '🚫', 7, 179, 'pronoun', ''),
    ('corpus', 'body', '🧍', 7, 75, 'noun', '3rd declension'),
    ('mors', 'death', '🕯️', 7, 95, 'noun', '3rd declension'),
    ('genus', 'kind / family', '🌳', 7, 170, 'noun', '3rd declension'),
    ('mens', 'mind', '🧠', 7, 173, 'noun', '3rd declension'),
    ('parens', 'parent', '👪', 7, 190, 'noun', '3rd declension'),
    ('finis', 'end / boundary', '🏁', 7, 236, 'noun', '3rd declension'),
    ('litus', 'shore', '🏖️', 7, 245, 'noun', '3rd declension'),
    ('laus', 'praise', '👏', 7, 444, 'noun', '3rd declension'),
    ('ingens', 'huge', '🐘', 7, 202, 'adjective', '3rd declension'),
    ('talis', 'such', '🔎', 7, 203, 'adjective', '3rd declension'),
    ('similis', 'similar', '👯', 7, 414, 'adjective', '3rd declension'),
    ('felix', 'lucky / happy', '🍀', 7, 309, 'adjective', '3rd declension'),
    ('ago', 'do / drive', '🎬', 7, 69, 'verb', '3rd conjugation'),
    ('peto', 'seek / ask', '🙋', 7, 83, 'verb', '3rd conjugation'),
    ('credo', 'trust / believe', '🤝', 7, 109, 'verb', '3rd conjugation'),
    ('accipio', 'receive', '📥', 7, 110, 'verb', '3rd conjugation io'),
    ('quaero', 'search for / ask', '🔍', 7, 113, 'verb', '3rd conjugation'),
    ('gero', 'carry on / wear', '🧥', 7, 237, 'verb', '3rd conjugation'),
    ('trado', 'hand over', '🤲', 7, 297, 'verb', '3rd conjugation'),
    ('nosco', 'come to know', '💡', 7, 347, 'verb', '3rd conjugation'),
    ('incipio', 'begin', '🚩', 7, 411, 'verb', '3rd conjugation io'),
    # Year 4, grade 8: irregulars, deponents, and 4th-declension nouns.
    ('possum', 'be able', '💪', 8, 23, 'verb', 'irregular'),
    ('fero', 'carry / bear', '📦', 8, 45, 'verb', 'irregular'),
    ('eo', 'go', '🚶', 8, 97, 'verb', 'irregular'),
    ('sequor', 'follow', '👣', 8, 108, 'verb', 'deponent'),
    ('fio', 'become / be made', '🔄', 8, 146, 'verb', 'irregular'),
    ('patior', 'suffer / allow', '😣', 8, 185, 'verb', 'deponent'),
    ('nihil', 'nothing', '🕳️', 8, 55, 'noun', 'indeclinable'),
    ('adsum', 'be present', '📍', 8, 279, 'verb', 'irregular'),
    ('loquor', 'speak', '🗣️', 8, 310, 'verb', 'deponent'),
    ('utor', 'use', '🛠️', 8, 330, 'verb', 'deponent'),
    ('redeo', 'go back', '↩️', 8, 301, 'verb', 'irregular'),
    ('vultus', 'face / expression', '🙂', 8, 209, 'noun', '4th declension'),
    ('casus', 'fall / chance', '🎲', 8, 344, 'noun', '4th declension'),
    ('impetus', 'attack / impulse', '💨', 8, 421, 'noun', '4th declension'),
    ('usus', 'use', '🛠️', 8, 446, 'noun', '4th declension'),
    ('transeo', 'go across', '🌉', 8, 431, 'verb', 'irregular'),
    ('morior', 'die', '🕯️', 8, 253, 'verb', 'deponent'),
    ('nolo', 'be unwilling', '🙅', 8, 458, 'verb', 'irregular'),
    ('pervenio', 'arrive', '🏁', 8, 409, 'verb', '4th conjugation'),
    ('currus', 'chariot', '🏇', 8, 491, 'noun', '4th declension'),
]

IRREGULAR_CHANTS = forms.IRREGULAR_VERBS | {
    'adsum', 'absum', 'desum', 'prosum', 'possum', 'redeo', 'transeo', 'pereo', 'exeo', 'ineo',
}
# Extra Morpheus lemmas needed when the headword is not the lexicon's lemma.
EXTRA_LEMMAS = {
    'redeo': ['reeo'],
    'tutus': ['tueor'],
    'ultimus': ['ulter'],
    'fio': ['facio'],
}
# When Morpheus lists more than one gender, keep the gender of the common school word.
NOUN_GENDER = {
    'genus': 'n',
    'litus': 'n',
    'finis': 'm',
    'nemo': 'm',
}


def grammar_rows(word):
    latin, english, _emoji, _grade, _rank, part, decl = word
    lookup_part = 'verb' if part == 'deponent' else part
    return [{
        'uncertain': False,
        'part': lookup_part,
        'decl': decl,
        'latin': latin,
        'gender': '',
        'english': english,
    }]


def plain(value):
    return forms.fold(value).replace(' ', '')


def latinize(text):
    return str(text or '').replace('J', 'I').replace('j', 'i')


def latinize_rows(rows):
    cleaned = []
    for item in rows:
        cleaned.append({
            **item,
            'marked': latinize(item['marked']),
            'form': latinize(item['form']),
            'lemma': latinize(item['lemma']),
        })
    return cleaned


def marked_head(word, chosen):
    latin = word[0]
    if not chosen:
        return latin
    matches = [item for item in chosen if plain(item['form']) == plain(latin) or plain(item['marked']) == plain(latin)]
    item = matches[0] if matches else chosen[0]
    head = forms.overlay_macrons(latin, item['marked'])
    if plain(forms.strip_macrons(head)) != plain(latin):
        head = item['marked'] if plain(forms.strip_macrons(item['marked'])) == plain(latin) else latin
    return latinize(head)


def tag_ok(item, size):
    return len(item['tag']) > size


def case_hit(item, number, gender, case):
    tag = item['tag']
    return (
        tag_ok(item, 7)
        and tag[2] == number
        and tag[6] == gender
        and tag[7] == case
    )


def prefer_single_consonant(items):
    plains = {plain(item['form']) for item in items}

    def dominated(item):
        form = plain(item['form'])
        reduced = form.replace('tt', 't').replace('ll', 'l')
        return reduced != form and reduced in plains

    filtered = [item for item in items if not dominated(item)]
    return filtered or items


def prefer_short_a_variant(items, latin):
    """The noun parēns 'parent' is the short-a form, not the participle pārēns."""
    if latin != 'parens':
        return items
    nominatives = [item for item in items if case_hit(item, 's', item['tag'][6], 'n')]
    if not nominatives:
        return items
    if any('ā' in item['marked'] for item in nominatives) and any('ā' not in item['marked'] for item in nominatives):
        return [item for item in items if 'ā' not in item['marked']]
    return items


def drop_double_s_variant(items, latin):
    """casus 'fall' is not cassus. Drop a doubled s that the headword does not have."""
    if 'ss' in plain(latin):
        return items
    filtered = [
        item for item in items
        if 'ss' not in plain(item['form']) and 'ss' not in plain(item['marked'])
    ]
    return filtered or items


def drop_spelling_variants(items, latin):
    """Prefer nōscō to gnōscō, suum to suom, and tulī to tetulī."""
    target = plain(latin)
    plains = {plain(item['form']) for item in items}
    filtered = []
    for item in items:
        form = plain(item['form'])
        if form.startswith('g') and form[1:] in plains:
            continue
        if form.endswith('om') and (form[:-2] + 'um') in plains:
            continue
        if form == 'tetuli' and 'tuli' in plains:
            continue
        if 'quu' in form and form.replace('quu', 'cu') in plains:
            continue
        if form.endswith('ieri') or form.endswith('ier'):
            short = form[:-3] + 'i' if form.endswith('ieri') else form[:-3] + 'i'
            if short in plains:
                continue
        if form.endswith('iri') and (form[:-2] + 'i') in plains and form[:-2] + 'i' != form:
            continue
        filtered.append(item)
    return filtered or items


def prepare_noun_rows(latin, items):
    nouns = [item for item in items if item['tag'][:1] == 'n']
    nouns = prefer_single_consonant(nouns)
    nouns = prefer_short_a_variant(nouns, latin)
    nouns = drop_double_s_variant(nouns, latin)
    nouns = drop_spelling_variants(nouns, latin)
    gender = NOUN_GENDER.get(latin)
    if gender:
        gendered = [item for item in nouns if tag_ok(item, 6) and item['tag'][6] == gender]
        if gendered:
            nouns = gendered
    return nouns


def both_genders(items):
    genders = {item['tag'][6] for item in items if tag_ok(item, 6) and item['tag'][6] in {'m', 'f'}}
    return 'm' in genders and 'f' in genders


def noun_line(latin, items):
    nouns = prepare_noun_rows(latin, items)
    if not nouns:
        return None
    built = forms.noun_entry(latin, nouns, '')
    if not built:
        return None
    entry, genitive = built
    entry = latinize(entry)
    if latin == 'parens' and both_genders(items) and (entry.endswith(', m.') or entry.endswith(', f.')):
        entry = entry.rsplit(', ', 1)[0] + ', m./f.'
    gender = ''
    if entry.endswith(', m./f.'):
        gender = 'm./f.'
    elif entry.endswith(', m.'):
        gender = 'm.'
    elif entry.endswith(', f.'):
        gender = 'f.'
    elif entry.endswith(', n.'):
        gender = 'n.'
    return entry, gender, genitive


def positive_adjectives(items):
    adjectives = [item for item in items if item['tag'][:1] == 'a']
    positive = [item for item in adjectives if not tag_ok(item, 8) or item['tag'][8] not in {'c', 's'}]
    return drop_spelling_variants(positive or adjectives, '')


def participle_adjective_line(latin, items):
    def pick(gender):
        matches = [
            item for item in items
            if item['tag'][:1] == 'v'
            and tag_ok(item, 7)
            and item['tag'][2] == 's'
            and item['tag'][4:6] == 'pp'
            and item['tag'][6] == gender
            and item['tag'][7] == 'n'
        ]
        exact = [item for item in matches if plain(item['form']) == plain(latin) or (gender != 'm' and plain(item['form']).startswith(plain(latin)[:-2]))]
        pool = exact or matches
        return pool[0]['marked'] if pool else ''

    masculine = pick('m')
    feminine = pick('f')
    neuter = pick('n')
    if not masculine:
        return ''
    head = forms.overlay_macrons(latin, masculine)
    mas_plain = plain(masculine)
    fem_plain = plain(feminine)
    neu_plain = plain(neuter)
    if mas_plain.endswith('us') and fem_plain.endswith('a') and neu_plain.endswith('um') and fem_plain[:-1] == neu_plain[:-2] == mas_plain[:-2]:
        return f'{latinize(head)}, -a, -um'
    return latinize(head)


def adjective_line(latin, items):
    if latin == 'tutus':
        built = participle_adjective_line(latin, items)
        if built:
            return built
    chosen = positive_adjectives(items)
    entry = forms.adjective_entry(latin, chosen) if chosen else ''
    if not entry:
        return marked_head((latin, '', '', 0, 0, 'adjective', ''), items)
    parts = [part.strip() for part in entry.split(',')]
    if len(parts) == 3 and plain(parts[0]) == plain(parts[1]) == plain(parts[2]):
        genitives = [
            item['marked'] for item in chosen
            if case_hit(item, 's', 'm', 'g') or case_hit(item, 's', 'f', 'g') or case_hit(item, 's', 'n', 'g')
        ]
        if genitives:
            return f'{latinize(parts[0])}, {latinize(genitives[0])}'
    return latinize(entry)


def deponent_line(latin, items):
    present = next((
        item['marked'] for item in items
        if item['tag'].startswith('v1spip') and plain(item['form']) == plain(latin)
    ), '')
    infinitives = [
        item for item in items
        if item['tag'].startswith('v') and tag_ok(item, 5) and item['tag'][3:6] == 'pnp' and plain(item['marked']).endswith('i')
    ]
    infinitive = ''
    if infinitives:
        stem = plain(present or latin)

        def inf_score(item):
            form = plain(item['form'])
            shared = 0
            for left, right in zip(form, stem):
                if left != right:
                    break
                shared += 1
            return (form.endswith('iri') or form.endswith('ier'), -shared, len(form))

        infinitives.sort(key=inf_score)
        infinitive = infinitives[0]['marked']
    participles = [
        item['marked'] for item in items
        if item['tag'][:1] == 'v' and tag_ok(item, 7) and item['tag'][2] == 's' and item['tag'][4:6] == 'pp' and item['tag'][6] == 'm' and item['tag'][7] == 'n'
    ]
    participle = participles[0] if participles else ''
    parts = [present or latin, infinitive, f'{participle} sum' if participle else '']
    parts = [latinize(part) for part in parts if part]
    return ', '.join(parts)


def active_verb_line(latin, items):
    def best(matches, stem):
        if not matches:
            return ''

        def score(item):
            form = plain(item['form'])
            shared = 0
            for left, right in zip(form, stem):
                if left != right:
                    break
                shared += 1
            if form.endswith('ivi'):
                perfect_rank = 3
            elif form.endswith('ii'):
                perfect_rank = 2
            else:
                perfect_rank = 0
            exact = 4 if form == plain(latin) else 0
            return (exact, shared, perfect_rank, -len(form))

        matches.sort(key=score, reverse=True)
        return matches[0]['marked']

    presents = [item for item in items if item['tag'].startswith('v1spia')]
    present = best(presents, plain(latin))
    infinitives = [
        item for item in items
        if item['tag'].startswith('v') and tag_ok(item, 5) and item['tag'][3:6] == 'pna'
    ]
    infinitive = best(infinitives, plain(present or latin))
    if not infinitive:
        passive = [
            item for item in items
            if item['tag'].startswith('v') and tag_ok(item, 5) and item['tag'][3:6] == 'pnp' and plain(item['marked']).endswith('i')
        ]
        infinitive = best(passive, plain(present or latin))
    perfects = [item for item in items if item['tag'].startswith('v1sria')]
    stem = plain(infinitive)[:-2] if plain(infinitive).endswith('re') else plain(latin)
    perfect = best(perfects, stem)
    supines = [
        item for item in items
        if tag_ok(item, 7) and item['tag'][4] == 'u' and item['tag'][7] == 'n' and item['tag'][2] == 's'
    ]
    supine = best(supines, stem)
    if latin == 'fio':
        factus = next((
            item['marked'] for item in items
            if item['tag'].startswith('v') and tag_ok(item, 7) and item['tag'][4:6] == 'pp' and item['tag'][6] == 'm' and item['tag'][7] == 'n' and plain(item['form']) == 'factus'
        ), '')
        if factus:
            supine = ''
            perfect = f'{factus} sum'
    parts = [present or latin, infinitive, perfect, supine]
    parts = [latinize(part) for part in parts if part]
    info = {
        'present': latinize(present),
        'activeInf': latinize(infinitive),
        'passiveInf': '',
        'perfect': latinize(perfect),
        'supine': latinize(supine),
    }
    return ', '.join(parts), info


def pronoun_line(latin, items):
    if latin == 'sui':
        return marked_head((latin, '', '', 0, 0, 'pronoun', ''), items)
    nouns = [item for item in items if item['tag'][:1] == 'n']
    if latin == 'nemo' and nouns:
        built = noun_line(latin, items)
        if built:
            return built[0]
    nominatives = [
        item for item in items
        if item['tag'][:1] in {'p', 'a'} and case_hit(item, 's', item['tag'][6], 'n')
    ]
    genders = []
    for gender, expected in (('m', latin), ('f', ''), ('n', '')):
        matches = [item for item in nominatives if item['tag'][6] == gender]
        if not matches:
            continue
        exact = [item for item in matches if plain(item['form']) == plain(expected)] if expected else []
        pool = exact or matches
        stem = plain(latin)[:3] if len(plain(latin)) >= 3 else ''
        pool.sort(key=lambda item: (
            0 if stem and plain(item['form']).startswith(stem) else 1,
            len(plain(item['form'])),
            plain(item['form']),
        ))
        marked = pool[0]['marked']
        if marked not in genders:
            genders.append(marked)
    if len(genders) >= 2:
        return ', '.join(latinize(part) for part in genders[:3])
    return ''


def build_entry(word, chosen):
    latin, _english, _emoji, _grade, _rank, part, _decl = word
    rows = grammar_rows(word)
    source = 'Lewis & Short via Morpheus' if chosen else 'frequency list; vowel length unmarked'
    if part == 'deponent' or word[6] == 'deponent':
        entry = deponent_line(latin, [item for item in chosen if item['tag'][:1] == 'v'])
        return entry, '', entry, 'verb', '', None, source
    if part == 'verb':
        entry, info = active_verb_line(latin, chosen)
        conj = forms.conjugation_of(info)
        decl = {'1': '1', '2': '2', '3': '3', '3io': '3io', '4': '4'}.get(conj, '')
        irregular = latin in IRREGULAR_CHANTS or 'irregular' in word[6]
        chant = None if irregular else forms.chant_for(latin, 'verb', decl, '', info, '')
        if irregular:
            decl = ''
        return entry, '', entry, 'verb', decl, chant, source
    if part == 'adjective':
        entry = adjective_line(latin, chosen)
        return entry, '', '', 'adjective', '', None, source
    if part in {'noun', 'pronoun'} and any(item['tag'][:1] == 'n' for item in chosen) and part == 'noun':
        built = noun_line(latin, chosen)
        if built:
            entry, gender, genitive = built
            decl = forms.infer_declension('noun', gender, entry.split(',')[0], genitive, None, rows)
            chant = forms.chant_for(latin, 'noun', decl, gender if gender != 'm./f.' else 'm.', None, forms.strip_macrons(genitive))
            return entry, gender, '', 'noun', decl, chant, source
    if part == 'pronoun':
        entry = pronoun_line(latin, chosen) or marked_head(word, chosen)
        return entry, '', '', 'pronoun', '', None, source
    head = marked_head(word, chosen) if chosen else latin
    return head, '', '', part, '', None, source


ORIGINAL_USEFUL_TAG = forms.useful_tag


def core_useful_tag(tag, form, lemma):
    if ORIGINAL_USEFUL_TAG(tag, form, lemma):
        return True
    if not tag or len(tag) < 8 or tag[8:9] in {'c', 's'}:
        return False
    if tag[0] == 'v' and tag.startswith('v1spip'):
        return True
    if tag[0] == 'v' and tag[2] == 's' and tag[4:6] == 'pp' and tag[6] in {'m', 'f', 'n'} and tag[7] == 'n':
        return True
    return False


def main():
    ordered = sorted(WORDS, key=lambda word: (word[3], word[4], word[0]))
    wanted = set()
    for word in ordered:
        wanted.add(forms.fold(word[0]))
        for alias in EXTRA_LEMMAS.get(word[0], []):
            wanted.add(forms.fold(alias))
    forms.useful_tag = core_useful_tag
    try:
        morpheus = forms.scan_morpheus(wanted)
    finally:
        forms.useful_tag = ORIGINAL_USEFUL_TAG
    records = {}
    missing = []
    for word in ordered:
        latin = word[0]
        key = forms.fold(latin)
        rows = list(morpheus.get(key, []))
        for alias in EXTRA_LEMMAS.get(latin, []):
            rows.extend(morpheus.get(forms.fold(alias), []))
        rows = drop_spelling_variants(latinize_rows(rows), latin)
        synthetic = grammar_rows(word)
        chosen = forms.best_lemma_rows(rows, latin, synthetic, '')
        if latin == 'fio':
            chosen = (chosen or []) + [
                item for item in rows
                if plain(item['form']) == 'factus' and tag_ok(item, 7) and item['tag'][4:6] == 'pp' and item['tag'][6] == 'm' and item['tag'][7] == 'n'
            ]
        elif latin == 'redeo':
            chosen = (chosen or []) + [
                item for item in rows
                if forms.fold(item['lemma']) == 'reeo' and item['tag'].startswith('v1spia') and plain(item['form']) == 'redeo'
            ]
        elif latin == 'tutus':
            chosen = [item for item in rows if forms.fold(item['lemma']) == 'tueor']
        elif latin == 'ultimus':
            chosen = [item for item in rows if forms.fold(item['lemma']) == 'ulter' and item['tag'][:1] == 'a']
        wanted_pos = forms.pos_class_from_crosswalk(word[5] if word[5] != 'deponent' else 'verb')
        if word[5] == 'pronoun':
            wanted_pos = 'pronoun'
        if latin in {'tutus', 'ultimus'}:
            wanted_pos = ''
        if chosen and wanted_pos and latin not in {'fio', 'redeo'}:
            filtered = [item for item in chosen if forms.tag_pos(item['tag']) == wanted_pos or (wanted_pos == 'pronoun' and forms.tag_pos(item['tag']) in {'pronoun', 'adjective', 'noun'})]
            if filtered:
                chosen = filtered
        if not chosen and word[5] not in {'conjunction', 'adverb', 'preposition'}:
            missing.append(latin)
        entry, gender, principal, pos, decl, chant, source = build_entry(word, chosen)
        if forms.has_acute(entry):
            raise SystemExit(f'Acute accent in {latin}: {entry}')
        hint = forms.ending_hint(latin, pos, decl, gender)
        records[key] = {
            'headword': latin,
            'dictionaryEntry': entry,
            'gender': gender,
            'principalParts': principal,
            'partOfSpeech': pos,
            'declension': decl,
            'formBooks': [],
            'macronSource': source,
            'reliable': bool(chosen) or pos in {'conjunction', 'adverb', 'preposition', 'pronoun'},
            'endingHint': hint,
            'chant': chant,
        }
    words_js = []
    for latin, english, emoji, grade, rank, part, decl in ordered:
        words_js.append({
            'latin': latin,
            'english': english,
            'emoji': emoji,
            'grade': grade,
            'frequencyRank': rank,
            'frequencySource': 'Dickinson College Commentaries Latin Core Vocabulary',
            'partOfSpeech': part,
        })
    core_js = """// Supplemental high-frequency words for Years 1–4.
// Order follows Dickinson College Commentaries Latin Core Vocabulary ranks.
// English glosses are original. The ranks are not a textbook word list.
const CORE_FREQUENCY_WORDS = %s;

function coreFrequencyKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .toLowerCase()
    .replace(/j/g, 'i')
    .split(/[^a-z]+/)
    .filter(Boolean);
}

function coreFrequencyBlocks(latin) {
  const keys = coreFrequencyKey(latin);
  const raw = String(latin || '');
  if (keys.length <= 1 || raw.includes('/')) return keys;
  return [];
}

function appendCoreFrequencyWords() {
  if (typeof GRADE_WORDS === 'undefined' || !Array.isArray(CORE_FREQUENCY_WORDS)) return;
  const seen = new Set();
  Object.values(GRADE_WORDS).flat().forEach((word) => {
    coreFrequencyBlocks(word.latin).forEach((key) => seen.add(key));
  });
  CORE_FREQUENCY_WORDS.forEach((word) => {
    const keys = coreFrequencyKey(word.latin);
    if (!keys.length || keys.some((key) => seen.has(key))) return;
    const grade = String(word.grade);
    if (!Array.isArray(GRADE_WORDS[grade])) return;
    GRADE_WORDS[grade].push({
      latin: word.latin,
      english: word.english,
      emoji: word.emoji || '',
      coreSet: true,
      frequencyRank: word.frequencyRank,
      frequencySource: word.frequencySource
    });
    keys.forEach((key) => seen.add(key));
  });
}

appendCoreFrequencyWords();
""" % json.dumps(words_js, ensure_ascii=False, indent=2)
    forms_js = """// Dictionary lines for the supplemental core words.
// Macrons: Lewis & Short quantities via the Morpheus Latin stem lexicon.
const CORE_FORM_RECORDS = %s;
""" % json.dumps(records, ensure_ascii=False, indent=2)
    (ROOT / 'core-frequency.js').write_text(core_js, encoding='utf-8')
    (ROOT / 'core-forms.js').write_text(forms_js, encoding='utf-8')
    print('words', len(ordered), 'records', len(records), 'missing morphology', missing)
    for word in ordered:
        record = records[forms.fold(word[0])]
        print(f"{word[3]}\t{word[4]}\t{word[0]}\t{record['dictionaryEntry']}")


if __name__ == '__main__':
    main()
