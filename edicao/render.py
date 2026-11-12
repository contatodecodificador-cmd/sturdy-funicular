"""Renderiza um quadro-chave (480x270) para cada cena do plano + metadados para o storyboard."""
import json, sys, os, re, subprocess, hashlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gfx
from PIL import Image, ImageDraw, ImageFilter

S = os.path.dirname(os.path.abspath(__file__))
shots = json.load(open(f'{S}/shots.json'))
C = json.load(open(f'{S}/cands.json'))
pick = json.load(open(f'{S}/pick.json')) if os.path.exists(f'{S}/pick.json') else {}
os.makedirs(f'{S}/thumbs', exist_ok=True); os.makedirs(f'{S}/frames', exist_ok=True)
UA = 'ClaudeCode-StoryboardTool/1.0 (https://claude.ai/code; educational video research)'


def cands(key):
    lst = C.get(key, [])
    if key in pick: lst = [lst[i] for i in pick[key] if i < len(lst)]
    lst = [c for c in lst if c.get('thumb')]
    if os.environ.get('NODL'):
        lst = [c for c in lst if os.path.exists(f"{S}/thumbs/{hashlib.md5(c['title'].encode()).hexdigest()[:12]}.jpg")]
    return lst


def local(c):
    h = hashlib.md5(c['title'].encode()).hexdigest()[:12]
    p = f'{S}/thumbs/{h}.jpg'
    if not os.path.exists(p) and os.environ.get('NODL'):
        return None
    if not os.path.exists(p):
        subprocess.run(['curl', '-sS', '-L', '-A', UA, '-o', p + '.tmp', c['thumb'].replace('thumb.wikimedia.org', 'upload.wikimedia.org').split('?')[0].replace('/500px-', '/960px-')])
        try:
            Image.open(p + '.tmp').convert('RGB').save(p, quality=90); os.remove(p + '.tmp')
        except Exception:
            return None
    return p


def asset(key, n=0):
    lst = cands(key)
    if not lst: return None, None
    c = lst[n % len(lst)]
    p = local(c)
    return (Image.open(p) if p else None), c


def placeholder(key):
    im = Image.new('RGB', (gfx.W, gfx.H), (40, 30, 30)); d = ImageDraw.Draw(im)
    d.text((120, 460), 'FALTA IMAGEM', font=gfx.sans(80, 800), fill=(229, 72, 77))
    d.text((120, 580), f'buscar: {key}', font=gfx.sans(50, 500), fill=gfx.CREAM)
    return im


filled = {}
out = []
for i, s in enumerate(shots):
    used = []; missing = []
    def A(key, n=0):
        im, c = asset(key, n)
        if im is None: missing.append(key); return placeholder(key)
        used.append(c); return im
    if s['t'] == 'img':
        src_im = A(s['key'], s['n'])
        nav = len(cands(s['key'])) or 1
        rep = s['n'] // nav  # mesma imagem reaproveitada: muda enquadramento
        if rep:
            w0, h0 = src_im.size; z = 1 / (1.25 + 0.15 * (rep % 3)); fx_, fy_ = [(0.2, 0.3), (0.8, 0.6), (0.5, 0.2)][rep % 3]
            cw, ch = int(w0 * z), int(h0 * z); x0 = int((w0 - cw) * fx_); y0 = int((h0 - ch) * fy_)
            src_im = src_im.crop((x0, y0, x0 + cw, y0 + ch))
        base = gfx.grade(gfx.cover(src_im, focus=tuple(s.get('focus', (0.5, 0.5)))))
        if s.get('blur'): base = Image.blend(base.filter(ImageFilter.GaussianBlur(6)), Image.new('RGB', base.size, (0, 0, 0)), 0.55)
        ov = []
        if s.get('text'): ov.append(gfx.kinetic(s['text'], size=120 if '\n' in s['text'] or len(s['text']) > 16 else 150))
        if s.get('stamp'): ov.append(gfx.stamp(s['stamp'], ok=s.get('ok', False)))
        if s.get('label'): ov.append(gfx.label(s['label'], s.get('sub')))
        if s.get('loc'): ov.append(gfx.location(*s['loc']))
        if s.get('specs'): ov.append(gfx.specs(s['specs']))
        if s.get('cta'): ov.append(gfx.cta(*s['cta']))
        frame = gfx.put(base, *ov)
    else:
        k = s['kind']
        if k == 'era':
            frame = gfx.era_card(s['num'], s['name'], s['place'], s['age'], s['states'], A(s['bgkey']))
        elif k == 'tier':
            if s.get('add'):
                filled.setdefault(s['add'][0], []).append(s['add'][1])
            frame = gfx.tier_list({a: list(b) for a, b in filled.items()}, s.get('hl'))
        elif k == 'tierfull':
            frame = gfx.tier_list(filled, None, 'O VEREDITO')
        elif k == 'number':
            frame = gfx.put(gfx.darken_blur(gfx.cover(A(s['bgkey']))), gfx.big_number(s['num'], s['cap']))
        elif k == 'oxygen':
            frame = gfx.put(gfx.darken_blur(gfx.cover(A(s['bgkey']))), gfx.oxygen(s['value'], s['cap']))
        elif k == 'weapon':
            frame = gfx.weapon(s['n'], s['name'], s['desc'], A(s['bgkey']))
        elif k == 'bars':
            frame = gfx.bars(s['items'], s['title'], s.get('unit', ''))
        elif k == 'compare':
            frame = gfx.compare(A(s['lkey']), A(s['rkey'], 1), s['lt'], s['rt'], s['ls'], s['rs'], s['title'])
        elif k == 'kinetic':
            bg = gfx.darken_blur(gfx.cover(A(s['bg'])), 0.6, 8) if s.get('bg') else Image.new('RGB', (gfx.W, gfx.H), gfx.BG)
            frame = gfx.put(bg, gfx.kinetic(s['text'], size=120 if '\n' in s['text'] else 140))
        elif k == 'mapfocus':
            frame = gfx.map_focus(s['groups'], s['title'], s.get('sub'))
        elif k == 'chain':
            frame = gfx.chain(s['steps'], s['title'])
        else:
            frame = placeholder(k)
    frame.resize((480, 270), Image.LANCZOS).save(f'{S}/frames/f{i:03d}.jpg', quality=78)
    out.append(dict(i=i, t0=s['t0'], t1=s['t1'], sec=s.get('sec'), music=s.get('music'), narr=s.get('narr'), t=s['t'],
                    kind=s.get('kind'), key=s.get('key'), fx=s.get('fx'), sfx=s.get('sfx'), note=s.get('note'),
                    text=s.get('text'), stamp=s.get('stamp'), label=s.get('label'), sub=s.get('sub'),
                    src=[dict(title=c['title'], lic=c['lic'], artist=c['artist'], page=c['page']) for c in used], missing=missing))
    if i % 25 == 0: print(i, flush=True)
json.dump(out, open(f'{S}/board.json', 'w'), ensure_ascii=False)
print('frames', len(out), 'faltando', sum(1 for o in out if o['missing']))
