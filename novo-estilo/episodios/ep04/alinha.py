"""Alinha as cenas do roteiro com a voz real (tempos de palavra do ElevenLabs scribe_v1)."""
import json, re, unicodedata, difflib


def norm(w):
    w = unicodedata.normalize('NFD', w.lower())
    w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]', '', w)


def alinha(cenas_txt, arquivo_json):
    d = json.load(open(arquivo_json))
    pal = [x for x in d['words'] if x['type'] == 'word']
    tw = [norm(x['text']) for x in pal]
    sw, dono = [], []
    for i, txt in enumerate(cenas_txt):
        for w in txt.split():
            n = norm(w)
            if n: sw.append(n); dono.append(i)
    sm = difflib.SequenceMatcher(None, sw, tw, autojunk=False)
    mapa = {}
    for a, b, k in sm.get_matching_blocks():
        for j in range(k): mapa[a + j] = b + j
    ini, fim = [None] * len(cenas_txt), [None] * len(cenas_txt)
    for si, cena in enumerate(dono):
        if si in mapa:
            t0, t1 = pal[mapa[si]]['start'], pal[mapa[si]]['end']
            if ini[cena] is None: ini[cena] = t0
            fim[cena] = t1
    for i in range(len(ini)):  # cena sem casamento: herda do vizinho
        if ini[i] is None: ini[i] = fim[i - 1] if i else 0.0
        if fim[i] is None: fim[i] = ini[i] + 0.5
    palavras = [{'w': x['text'], 's': x['start'], 'e': x['end']} for x in pal]
    return ini, fim, palavras
