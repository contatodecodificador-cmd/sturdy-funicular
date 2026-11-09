"""Build storyboard stills (one per shot) + HTML page. usage: python3 storyboard.py [--maps]"""
import json, os, sys, subprocess, base64, io, collections, html
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'tools'))
import compose as C
from PIL import Image, ImageEnhance

HERE = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(HERE, 'edl.json')))
MED = os.path.join(HERE, 'midia', 'commons')
OUT = os.path.join(HERE, 'storyboard', 'frames'); os.makedirs(OUT, exist_ok=True)
MAPS = os.path.join(HERE, 'storyboard', 'maps_exact'); os.makedirs(MAPS, exist_ok=True)
ENGINE = os.path.join(HERE, '..', '..', 'tools', 'mapengine')


def map_time(s):
    src = s['src']; scene, off = (src.split('@') + ['0'])[:2]
    t = float(off) + (s['t1'] - s['t0']) * 0.62
    return scene, round(t, 1)


if '--maps' in sys.argv:
    want = collections.defaultdict(list)
    for s in S:
        if s['type'] == 'M': sc, t = map_time(s); want[sc].append(t)
    for sc, ts in want.items():
        subprocess.run(['node', os.path.join(ENGINE, 'render.js'), sc, MAPS, '--stills', ','.join(map(str, ts))], check=True)


def apply_text(img, txt, frac=1.0):
    stamps = [t[6:] for t in txt if t.startswith('stamp:')]
    for t in txt:
        k, _, v = t.partition(':')
        if k == 'word': C.word(img, v, frac)
        elif k == 'lt': n, _, r = v.partition('|'); C.lower_third(img, n, r, frac)
        elif k == 'date': C.date_tag(img, v)
        elif k == 'loc': C.loc_tag(img, v, frac)
        elif k == 'quote': q, _, src = v.partition('|'); C.quote(img, q, src, frac)
        elif k == 'chapter': a, _, b = v.partition('|'); C.chapter(img, a, b)
        elif k == 'title': C.big_title(img, v)
        elif k == 'counter': C.counter(img, v)
        elif k == 'list': C.blist(img, v.split('|'), frac)
        elif k == 'clock': C.clock(img, float(v), C.W - 190, 160, 70)
    for i, st in enumerate(stamps): C.stamp(img, st, i, len(stamps))


def still(s):
    typ, src = s['type'], s['src']
    if typ == 'M':
        sc, t = map_time(s); p = os.path.join(MAPS, f'{sc}_{t:.1f}.jpg')
        img = Image.open(p).convert('RGB') if os.path.exists(p) else C.placeholder(s['desc'], src)
        apply_text(img, [x for x in s['txt'] if x.startswith('clock')]); return img
    key = src.split('@')[0]
    mp = C.find_media(key, MED)
    if typ == 'V' or not mp:
        if mp: base = C.sepia(C.kenburns(Image.open(mp).convert('RGB'), .6))
        else: base = C.placeholder(s['desc'], src)
    elif typ == 'C': base = C.card_over_blur(C.sepia(Image.open(mp).convert('RGB')), .6)
    else: base = C.sepia(C.kenburns(Image.open(mp).convert('RGB'), .6))
    if typ == 'G':
        base = ImageEnhance.Brightness(base).enhance(0.35) if mp else Image.new('RGB', (C.W, C.H), (30, 26, 22))
    img = C.grain_vignette(base) if mp else base
    apply_text(img, s['txt']); C.logo(img)
    return img


def fmt(t): return f'{int(t // 60):02d}:{t % 60:04.1f}'


cards = []
for i, s in enumerate(S, 1):
    im = still(s); fn = os.path.join(OUT, f'{i:03d}.jpg'); im.save(fn, quality=88)
    th = im.resize((560, 315)); b = io.BytesIO(); th.save(b, 'JPEG', quality=72)
    cards.append((i, s, base64.b64encode(b.getvalue()).decode()))
    print(i, end=' ', flush=True)

TYPE = {'V': 'Vídeo de arquivo', 'P': 'Foto (zoom lento)', 'C': 'Cartão sobre fundo desfocado', 'M': 'Mapa animado 3D', 'G': 'Gráfico / cartão de texto'}
SFX = {'whoosh': 'whoosh suave', 'type': 'digitação', 'stamp': 'carimbo', 'tick': 'tique-taque', 'hit': 'impacto grave'}
parts = []
section_marks = {0: 'Introdução (cortes ≤ 5 s)', 103.8: 'Parte 1 · Zehn Tage im Mai', 211.6: 'Parte 2 · Die Angst vor dem eigenen Erfolg', 334.1: 'Parte 3 · Charleville, 24. Mai',
                 414.0: 'Parte 4 · 48 Stunden Stillstand', 525.9: 'Corrida pelas praias', 627.0: 'Parte 5 · Faktencheck', 846.7: 'Parte 6 + Conclusão'}
for i, s, b64 in cards:
    if s['t0'] in section_marks: parts.append(f'<h2 class="sec">{section_marks[s["t0"]]}</h2>')
    txt = ''.join(f'<li><b>{html.escape(t.split(":", 1)[0])}</b> {html.escape(t.split(":", 1)[1].replace("|", " · "))}</li>' for t in s['txt'])
    sfx = ', '.join(SFX.get(x, x) for x in s['sfx'])
    missing = s['type'] in 'VPCG' and s['src'][0] in 'VF' and not C.find_media(s['src'].split('@')[0], MED)
    parts.append(f'''<article class="shot t{s['type']}">
<div class="img"><img src="data:image/jpeg;base64,{b64}" alt="Plano {i}"><span class="n">{i:03d}</span>{'<span class="miss">mídia pendente</span>' if missing else ''}</div>
<div class="meta"><div class="tc">{fmt(s['t0'])} – {fmt(s['t1'])} <span>{s['t1'] - s['t0']:.1f}s</span></div>
<div class="ty">{TYPE[s['type']]}</div><p>{html.escape(s['desc'])}</p>
{f'<ul>{txt}</ul>' if txt else ''}<div class="mv">Movimento: {html.escape(s['move'])}{' · SFX: ' + sfx if sfx else ''}</div>
<div class="src">{html.escape(s['src'])}</div></div></article>''')

page = open(os.path.join(HERE, 'storyboard_template.html')).read().replace('<!--SHOTS-->', '\n'.join(parts)).replace('<!--COUNT-->', str(len(S)))
open(os.path.join(HERE, 'storyboard', 'storyboard.html'), 'w').write(page)
print('\nok', os.path.getsize(os.path.join(HERE, 'storyboard', 'storyboard.html')) // 1024, 'KB')
