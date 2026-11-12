"""Renderiza o vídeo final (1920x1080, 30 fps) a partir do plano de cenas.
Uso: python3 video.py [inicio] [fim]  (índices de cena, opcional para testes)
"""
import json, os, sys, math, subprocess, hashlib, re
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from multiprocessing import Pool
S = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, S)
import gfx
Image.MAX_IMAGE_PIXELS = None
FPS, W, H = 30, 1920, 1080
Z = 1.18  # folga para movimento de câmera
shots = json.load(open(f'{S}/shots.json'))
sent = json.load(open(f'{S}/sentences.json'))
C = json.load(open(f'{S}/cands.json')); P = json.load(open(f'{S}/pick.json'))
VSEL = json.load(open(f'{S}/vsel.json'))
VMAP = {'lava': ['v_lava_0'], 'cold_sea': ['v_waves_1'], 'rain': ['v_rain_0'], 'dunes': ['v_dunes_1']}

# ---------------- utilidades ----------------
def ease(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)
def eout(u): u = min(1, max(0, u)); return 1 - (1 - u) ** 3
def eback(u):
    u = min(1, max(0, u)); c1 = 1.70158; c3 = c1 + 1
    return 1 + c3 * (u - 1) ** 3 + c1 * (u - 1) ** 2

def hpath(c, d): return f'{S}/{d}/{hashlib.md5(c["title"].encode()).hexdigest()[:12]}.jpg'

def cands(key):
    lst = C.get(key, []); idx = P.get(key)
    if idx: lst = [lst[i] for i in idx if i < len(lst)]
    return [c for c in lst if os.path.exists(hpath(c, 'hires')) or os.path.exists(hpath(c, 'thumbs'))]

def load(key, n=0):
    lst = cands(key)
    if not lst:
        im = Image.new('RGB', (W, H), (40, 32, 28)); return im, None
    c = lst[n % len(lst)]
    p = hpath(c, 'hires') if os.path.exists(hpath(c, 'hires')) else hpath(c, 'thumbs')
    im = Image.open(p).convert('RGB')
    if c.get('crop'):
        x0, y0, x1, y1 = c['crop']; im = im.crop((int(x0 * im.width), int(y0 * im.height), int(x1 * im.width), int(y1 * im.height)))
    rep = n // len(lst)
    if rep:
        w0, h0 = im.size; z = 1 / (1.25 + 0.15 * (rep % 3)); fx, fy = [(0.2, 0.3), (0.8, 0.6), (0.5, 0.2)][rep % 3]
        cw, ch = int(w0 * z), int(h0 * z); x0 = int((w0 - cw) * fx); y0 = int((h0 - ch) * fy)
        im = im.crop((x0, y0, x0 + cw, y0 + ch))
    if im.width < 1400:  # leve nitidez ao ampliar imagens pequenas
        im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 60, 2))
    return im, c

def color(im, cool=False):
    im = ImageEnhance.Color(im).enhance(0.85)
    a = np.asarray(im).astype(np.float32)
    if cool: a[..., 0] *= 0.9; a[..., 2] = a[..., 2] * 1.08 + 6
    else: a[..., 0] = a[..., 0] * 1.04 + 4; a[..., 2] *= 0.94
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

_vg = None
def vig_mask():
    global _vg
    if _vg is None:
        m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
        d.ellipse([-W * .25, -H * .3, W * 1.25, H * 1.3], fill=255); m = m.filter(ImageFilter.GaussianBlur(W // 8))
        _vg = (np.asarray(m).astype(np.uint16) * 115 // 255 + 140)[..., None]  # 140..255
    return _vg

def vignette(fr):
    a = np.asarray(fr).astype(np.uint16); return Image.fromarray((a * vig_mask() >> 8).astype(np.uint8))

def base_for(im, focus=(0.5, 0.5)):
    return gfx.cover(im, int(W * Z), int(H * Z), focus)

def camera(base, fx, u, i_frame, seed=0):
    """Recorta a janela da câmera sobre a base (maior que o quadro)."""
    BW, BH = base.size; e = ease(u)
    if fx == 'zout': k = 1.17 - 0.15 * e; cx, cy = 0.5, 0.5
    elif fx == 'panl': k = 1.06; cx, cy = 0.62 - 0.24 * e, 0.5
    elif fx == 'panr': k = 1.06; cx, cy = 0.38 + 0.24 * e, 0.5
    elif fx == 'shake':
        k = 1.12; t = i_frame / FPS
        cx = 0.5 + 0.006 * math.sin(t * 37 + seed) + 0.004 * math.sin(t * 23); cy = 0.5 + 0.006 * math.cos(t * 31 + seed)
    elif fx == 'still': k = 1.0 + 0.04 * e; cx, cy = 0.5, 0.5
    else: k = 1.0 + 0.15 * e; cx, cy = 0.5, 0.45  # zin
    vw, vh = BW / k, BH / k
    x0 = min(max(0, cx * BW - vw / 2), BW - vw); y0 = min(max(0, cy * BH - vh / 2), BH - vh)
    return base.resize((W, H), Image.BILINEAR, box=(x0, y0, x0 + vw, y0 + vh))

def gzoom(img, u, amt=0.035):
    k = 1 + amt * ease(u); vw, vh = W / k, H / k
    return img.resize((W, H), Image.BILINEAR, box=((W - vw) / 2, (H - vh) / 2, (W + vw) / 2, (H + vh) / 2))

def sprite(layer):
    bb = layer.getbbox()
    if not bb: return None
    return layer.crop(bb), bb

def place(fr, spr, t, kind, delay=0.0):
    """Entrada animada de um elemento (sprite recortado de uma camada de tela cheia)."""
    if spr is None: return
    im, (x0, y0, x1, y1) = spr; t = t - delay
    if t <= 0: return
    a, dx, dy, sc = 1.0, 0, 0, 1.0
    if kind == 'pop':
        u = t / 0.38; a = min(1, t / 0.18); sc = 0.82 + 0.18 * eback(u)
    elif kind == 'stamp':
        u = t / 0.2; a = min(1, t / 0.08); sc = 1.9 - 0.9 * eout(u)
        if 0.2 < t < 0.34: dx = int(6 * math.sin(t * 90))
    elif kind == 'slide_l': u = t / 0.35; a = min(1, t / 0.25); dx = int(-90 * (1 - eout(u)))
    elif kind == 'slide_r': u = t / 0.4; a = min(1, t / 0.3); dx = int(90 * (1 - eout(u)))
    elif kind == 'slide_u': u = t / 0.4; a = min(1, t / 0.3); dy = int(70 * (1 - eout(u)))
    elif kind == 'fade': a = min(1, t / 0.4)
    if sc != 1.0:
        nw, nh = max(1, int(im.width * sc)), max(1, int(im.height * sc)); im2 = im.resize((nw, nh), Image.BILINEAR)
        px = int((x0 + x1) / 2 - nw / 2) + dx; py = int((y0 + y1) / 2 - nh / 2) + dy
    else: im2 = im; px, py = x0 + dx, y0 + dy
    if a < 1:
        r, g, b, al = im2.split(); al = al.point(lambda v: int(v * a)); im2 = Image.merge('RGBA', (r, g, b, al))
    # recorte nos limites do quadro
    sx0, sy0 = max(0, -px), max(0, -py); ex, ey = min(im2.width, W - px), min(im2.height, H - py)
    if ex <= sx0 or ey <= sy0: return
    fr.alpha_composite(im2.crop((sx0, sy0, ex, ey)), (px + sx0, py + sy0))

def flash(fr, t, dur=0.14):
    if t < dur:
        a = int(210 * (1 - t / dur)); fr.alpha_composite(Image.new('RGBA', (W, H), (255, 250, 240, a)))

class Snow:
    def __init__(s, seed=1):
        r = np.random.default_rng(seed); n = 260
        s.x = r.uniform(0, W, n); s.y = r.uniform(0, H, n); s.v = r.uniform(60, 220, n); s.sz = r.uniform(2, 7, n); s.dr = r.uniform(0, 6, n)
    def draw(s, fr, t):
        lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
        for x, y, v, z, dr in zip(s.x, s.y, s.v, s.sz, s.dr):
            yy = (y + v * t) % H; xx = (x + 25 * math.sin(t * 1.3 + dr)) % W
            d.ellipse([xx, yy, xx + z, yy + z], fill=(255, 255, 255, 200))
        fr.alpha_composite(lay.filter(ImageFilter.GaussianBlur(0.8)))

def video_frames(vkey, n, nfr):
    v = [x for k, lst in VSEL.items() for j, x in enumerate(lst) if f'{k}_{j}' == vkey][0]
    f = f'{S}/vids/{vkey}.webm'
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout or 10)
    need = nfr / FPS; start = (n * 3.7 + 1) % max(0.1, dur - need - 0.3) if dur > need + 0.5 else 0
    cmd = ['ffmpeg', '-v', 'error', '-ss', f'{start:.2f}', '-i', f, '-t', f'{need + 0.2:.2f}', '-vf',
           f'scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    raw = subprocess.run(cmd, capture_output=True).stdout
    fs = [Image.frombytes('RGB', (W, H), raw[i:i + W * H * 3]) for i in range(0, len(raw) - W * H * 3 + 1, W * H * 3)]
    if not fs: return None, v
    while len(fs) < nfr: fs.append(fs[-1])
    return fs[:nfr], v

# ---------------- camadas dos gráficos ----------------
def era_layers(s):
    im, c = load(s['bgkey'])
    bg = gfx.darken_blur(gfx.cover(im, int(W * 1.06), int(H * 1.06)), 0.72, 10)
    num = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(num).text((930, -130), f"{s['num']:02d}", font=gfx.serif(560, 900), fill=gfx.CREAM + (28,))
    txt = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(txt)
    d.text((140, 360), f"CAPÍTULO {s['num']}", font=gfx.sans(30, 700), fill=gfx.CARAMEL)
    d.text((136, 400), s['name'], font=gfx.serif(120, 800), fill=gfx.CREAM)
    d.line([142, 580, 520, 580], fill=gfx.CARAMEL, width=4)
    d.text((140, 610), s['place'].upper(), font=gfx.sans(34, 650), fill=gfx.CREAM)
    d.text((140, 660), s['age'], font=gfx.serif(44, 500), fill=gfx.MUTED)
    mp = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gfx.draw_brazil(ImageDraw.Draw(mp), (1480, 660, 340, 340), s['states'])
    return bg, sprite(num), sprite(txt), sprite(mp), c

def weapon_layers(s):
    im, c = load(s['bgkey'])
    base = color(base_for(im))
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle([0, 0, 900, H], fill=(18, 16, 14, 175)); sh = sh.filter(ImageFilter.GaussianBlur(40))
    t1 = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(t1)
    d.text((120, 380), f"ARMA {s['n']}", font=gfx.sans(40, 800), fill=gfx.CARAMEL)
    t2 = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(t2)
    d.text((114, 430), s['name'], font=gfx.serif(130, 900), fill=gfx.CREAM)
    t3 = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(t3)
    d.text((120, 610), s['desc'], font=gfx.sans(40, 500), fill=gfx.CREAM)
    return base, sh, [sprite(t1), sprite(t2), sprite(t3)], c

def bars_frame(items, title, unit, p):
    o = Image.new('RGB', (W, H), gfx.BG); d = ImageDraw.Draw(o)
    d.text((W / 2 - d.textlength(title, font=gfx.serif(96, 800)) / 2, 110), title, font=gfx.serif(96, 800), fill=gfx.CREAM)
    mx = max(v for _, v, _ in items); n = len(items); y = 330 + (3 - n) * 80
    for i, (name, v, hl) in enumerate(items):
        q = eout((p - 0.15 - i * 0.35) / 0.6)
        d.text((160, y + 22), name.upper(), font=gfx.sans(46, 800), fill=gfx.CARAMEL if hl else gfx.CREAM)
        bw = max(16, int(980 * v / mx * q))
        if q > 0:
            d.rounded_rectangle([640, y, 640 + bw, y + 110], 12, fill=gfx.CARAMEL if hl else (90, 82, 72))
            val = v * q; lab = f'{val:,.0f}'.replace(',', '.') + unit; lf = gfx.sans(48, 800); lw = d.textlength(lab, font=lf)
            if bw > lw + 60: d.text((640 + bw - lw - 30, y + 26), lab, font=lf, fill=gfx.BG if hl else gfx.CREAM)
            else: d.text((660 + bw, y + 26), lab, font=lf, fill=gfx.CREAM)
        y += 200
    return o

def fmt_count(num, q):
    m = re.match(r'^(~?)([\d.]+)(.*)$', num)
    if not m: return num
    pre, digits, suf = m.groups(); val = int(digits.replace('.', ''))
    cur = int(round(val * q)); s_ = f'{cur:,}'.replace(',', '.') if '.' in digits or val >= 1000 else str(cur)
    return pre + s_ + suf

# ---------------- render de uma cena ----------------
def render_shot(i, s, nfr, out):
    t0 = s['t0']; d = nfr / FPS; used = []
    pr = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                           '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
    def emit(fr): pr.stdin.write(fr.convert('RGB').tobytes())
    if s['t'] == 'img':
        key = s['key']; vfr = None
        vk = VMAP.get(key)
        if vk and s['n'] % 2 == 0:
            vfr, v = video_frames(vk[(s['n'] // 2) % len(vk)], s['n'], nfr)
            if vfr: used.append(dict(title=v['title'], lic=v['lic'], artist=v['artist'], page=v['page']))
        if not vfr:
            im, c = load(key, s['n'])
            if c: used.append(c)
            cool = bool(c and c.get('snow'))
            base = color(base_for(im, tuple(s.get('focus', (0.5, 0.5)))), cool)
            if s.get('blur'): base = Image.blend(base.filter(ImageFilter.GaussianBlur(8)), Image.new('RGB', base.size, (0, 0, 0)), 0.55)
            snow = Snow(i) if cool else None
        else: snow = None
        ov = []
        if s.get('text'):
            ov.append((sprite(gfx.kinetic(s['text'], pos='low', size=104 if '\n' in s['text'] or len(s['text']) > 16 else 128)), 'pop', 0.08))
        if s.get('stamp'): ov.append((sprite(gfx.stamp(s['stamp'], ok=s.get('ok', False))), 'stamp', 0.15))
        if s.get('label'): ov.append((sprite(gfx.label(s['label'], s.get('sub'))), 'slide_l', 0.25))
        if s.get('loc'): ov.append((sprite(gfx.location(*s['loc'])), 'slide_r', 0.45))
        if s.get('specs'): ov.append((sprite(gfx.specs(s['specs'])), 'slide_r', 0.3))
        if s.get('cta'): ov.append((sprite(gfx.cta(*s['cta'])), 'slide_u', 0.35))
        for f in range(nfr):
            t = f / FPS; u = f / max(1, nfr - 1)
            fr = vfr[f] if vfr else camera(base, s.get('fx', 'zin'), u, f, i)
            if vfr:
                fr = color(gzoom(fr, u, 0.06))
            fr = vignette(fr).convert('RGBA')
            if snow: snow.draw(fr, t)
            for spr, kind, dl in ov: place(fr, spr, t, kind, dl)
            if s.get('fx') == 'flash': flash(fr, t)
            emit(fr)
    else:
        k = s['kind']
        if k == 'era':
            bg, num, txt, mp, c = era_layers(s); used.append(c)
            for f in range(nfr):
                t = f / FPS; u = f / max(1, nfr - 1)
                fr = gzoom(gfx.cover(bg), u, 0.05).convert('RGBA')
                place(fr, num, t, 'slide_r', 0.05); place(fr, txt, t, 'slide_u', 0.15); place(fr, mp, t, 'pop', 0.45)
                flash(fr, t); emit(fr)
        elif k == 'weapon':
            base, sh, txts, c = weapon_layers(s); used.append(c)
            for f in range(nfr):
                t = f / FPS; u = f / max(1, nfr - 1)
                fr = vignette(camera(base, 'zin', u, f)).convert('RGBA'); fr.alpha_composite(sh)
                for j, sp in enumerate(txts): place(fr, sp, t, 'slide_l', 0.1 + 0.12 * j)
                emit(fr)
        elif k in ('number', 'oxygen', 'kinetic'):
            key = s.get('bgkey') or s.get('bg'); c = None
            if key: im, c = load(key); bgim = gfx.darken_blur(gfx.cover(im, int(W * 1.05), int(H * 1.05)), 0.62, 8)
            else: bgim = Image.new('RGB', (int(W * 1.05), int(H * 1.05)), gfx.BG)
            if c: used.append(c)
            spr = sprite(gfx.kinetic(s['text'], size=120 if '\n' in s['text'] else 140)) if k == 'kinetic' else None
            for f in range(nfr):
                t = f / FPS; u = f / max(1, nfr - 1)
                fr = gzoom(gfx.cover(bgim), u, 0.05).convert('RGBA')
                if k == 'number':
                    q = eout((t - 0.1) / 0.7); lay = gfx.big_number(fmt_count(s['num'], q), s['cap'])
                    place(fr, sprite(lay), t, 'pop', 0.0)
                elif k == 'oxygen':
                    fr.alpha_composite(gfx.oxygen(max(0.5, s['value'] * eout((t - 0.15) / 0.9)), s['cap']))
                else: place(fr, spr, t, 'pop', 0.08)
                emit(fr)
        elif k == 'bars':
            for f in range(nfr):
                t = f / FPS; emit(gzoom(bars_frame(s['items'], s['title'], s.get('unit', ''), t / 1.4 if t < 1.6 else 1.2), f / max(1, nfr - 1), 0.03))
        elif k == 'compare':
            full = gfx.compare(load(s['lkey'])[0], load(s['rkey'], 1)[0], s['lt'], s['rt'], s['ls'], s['rs'], s['title'])
            for kk, nn in ((s['lkey'], 0), (s['rkey'], 1)):
                c = load(kk, nn)[1]
                if c: used.append(c)
            title = sprite(full.convert('RGBA').crop((0, 0, W, 200)).resize((W, 200)).convert('RGBA'))
            L = full.crop((0, 200, 960, H)).convert('RGBA'); R = full.crop((960, 200, W, H)).convert('RGBA')
            Ls = (L, (0, 200, 960, H)); Rs = (R, (960, 200, W, H))
            for f in range(nfr):
                t = f / FPS; fr = Image.new('RGBA', (W, H), gfx.BG + (255,))
                fr.alpha_composite(full.crop((0, 0, W, 200)).convert('RGBA'), (0, 0)) if t > 0.3 else place(fr, (full.crop((0, 0, W, 200)).convert('RGBA'), (0, 0, W, 200)), t, 'fade', 0)
                place(fr, Ls, t, 'slide_l', 0.08); place(fr, Rs, t, 'slide_r', 0.3)
                emit(gzoom(fr, f / max(1, nfr - 1), 0.03))
        elif k == 'mapfocus':
            full = gfx.map_focus(s['groups'], s['title'], s.get('sub')); base0 = gfx.map_focus([], s['title'], s.get('sub'))
            for f in range(nfr):
                t = f / FPS; fr = Image.blend(base0, full, ease((t - 0.2) / 0.6)) if (s['groups'] and not s.get('note')) else full
                emit(gzoom(fr, f / max(1, nfr - 1), 0.04))
        elif k == 'chain':
            full = gfx.chain(s['steps'], s['title']); bg0 = Image.new('RGB', (W, H), gfx.BG); bg0.paste(full.crop((0, 0, W, 300)), (0, 0))
            for f in range(nfr):
                t = f / FPS; xr = int(W * eout((t - 0.15) / 1.3)) if not s.get('cont') else W
                fr = bg0.copy()
                if xr > 0: fr.paste(full.crop((0, 300, xr, H)), (0, 300))
                emit(gzoom(fr, f / max(1, nfr - 1), 0.03))
        elif k in ('tier', 'tierfull'):
            A = gfx.tier_list(s['before'], s.get('hl_before'), s.get('ttl', 'QUANTO TEMPO O CARAMELO AGUENTA?'))
            B = gfx.tier_list(s['after'], s.get('hl'), s.get('ttl', 'QUANTO TEMPO O CARAMELO AGUENTA?'))
            rev = s.get('reveal')  # tierfull: linhas aparecem no tempo da narração
            for f in range(nfr):
                t = f / FPS; u = f / max(1, nfr - 1)
                if rev is not None:
                    gt = t0 + t; filled = {kk: vv for kk, vv in s['after'].items() if rev.get(kk, 0) <= gt}
                    hl = max(((rev[kk], kk) for kk in filled), default=(0, None))[1]
                    fr = gfx.tier_list(filled, hl, 'O VEREDITO') if f % 3 == 0 or f == 0 else fr
                elif s.get('first'):
                    fr = A.copy(); yc = int(160 + (H - 160) * eout(t / 0.9)); fr = Image.new('RGB', (W, H), gfx.BG); fr.paste(A.crop((0, 0, W, 150)), (0, 0)); fr.paste(A.crop((0, 150, W, yc)), (0, 150))
                else:
                    fr = Image.blend(A, B, ease((t - 0.25) / 0.3)) if s.get('add') else Image.blend(A, B, ease(t / 0.15))
                emit(gzoom(fr, u, 0.03))
        else:
            for f in range(nfr): emit(Image.new('RGB', (W, H), gfx.BG))
    pr.stdin.close(); pr.wait()
    return [dict(title=c['title'], lic=c['lic'], artist=c.get('artist', ''), page=c['page']) for c in used if c]


def prepare():
    """Estado acumulado da tier list e tempos de revelação do veredito."""
    filled = {}; last_hl = None
    st = {s_['text'][:12]: i for i, s_ in enumerate(sent)}
    for i, s in enumerate(shots):
        if s['t'] == 'gfx' and s['kind'] == 'tier':
            s['before'] = {k: list(v) for k, v in filled.items()}; s['hl_before'] = last_hl
            if s.get('add'): filled.setdefault(s['add'][0], []).append(s['add'][1])
            s['after'] = {k: list(v) for k, v in filled.items()}
            s['first'] = (last_hl is None and not s.get('hl') and not s['before'] and i < 60 and not s.get('note'))
            last_hl = s.get('hl')
        elif s['t'] == 'gfx' and s['kind'] == 'tierfull':
            s['before'] = {}; s['after'] = {k: list(v) for k, v in filled.items()}
            names = {'S': 'Na nota S', 'B': 'Na nota B', 'C': 'Na nota C', 'D': 'Na nota D', 'F': 'Na nota F', '✕': 'E em nem chega'}
            s['reveal'] = {}
            for k, pref in names.items():
                for x in sent:
                    if x['text'].startswith(pref): s['reveal'][k] = x['t0']; break
        elif s['t'] == 'gfx' and s['kind'] == 'chain' and s.get('note'): s['cont'] = True


def job(args):
    i, s, nfr = args
    out = f'{S}/segs/s{i:03d}.mp4'
    used = render_shot(i, s, nfr, out)
    return i, used


if __name__ == '__main__':
    os.makedirs(f'{S}/segs', exist_ok=True)
    prepare()
    a = int(sys.argv[1]) if len(sys.argv) > 1 else 0; b = int(sys.argv[2]) if len(sys.argv) > 2 else len(shots)
    end_t = max(shots[-1]['t1'], float(sys.argv[3]) if len(sys.argv) > 3 else 0)
    jobs = []
    for i in range(a, b):
        f0 = 0 if i == 0 else round(shots[i]['t0'] * FPS)
        f1 = round((shots[i + 1]['t0'] if i + 1 < len(shots) else end_t) * FPS)
        jobs.append((i, shots[i], f1 - f0))
    credits = {}
    with Pool(4) as pool:
        for i, used in pool.imap_unordered(job, jobs):
            credits[i] = used; print('cena', i, flush=True)
    json.dump(credits, open(f'{S}/segs/credits_{a}_{b}.json', 'w'), ensure_ascii=False)
    print('OK')
