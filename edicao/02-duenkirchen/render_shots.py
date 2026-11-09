"""Render all non-map shots of the EDL to individual clips (1920x1080, 30 fps).
usage: python3 render_shots.py [shot numbers...]   (no args = all missing)"""
import json, os, sys, subprocess, math, re, random
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'tools'))
import compose as C
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(f'{HERE}/edl.json'))
MED = f'{HERE}/midia/commons'; VID = f'{HERE}/midia/video'
OUT = f'{HERE}/render/shots'; os.makedirs(OUT, exist_ok=True)
FPS = 30; W, H = C.W, C.H
from media_map import VCLIPS, PHOTO_FALLBACK, MAP_STILL, FIX  # chosen after viewing the films

clamp = lambda x, a=0, b=1: max(a, min(b, x))


def photo(key):
    k = key if C.find_media(key, MED) else PHOTO_FALLBACK.get(key, key)
    if k.startswith('V:'):  # still from a film: V:file@sec
        f, sec = k[2:].split('@'); p = f'{OUT}/_still_{f}_{sec}.jpg'
        if not os.path.exists(p): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', sec, '-i', f'{VID}/{f}', '-frames:v', '1', '-q:v', '2', p], check=True)
        return Image.open(p).convert('RGB')
    if k.startswith('MAP:'): return Image.open(MAP_STILL[k[4:]]).convert('RGB')
    p = C.find_media(k, MED)
    if not p: raise FileNotFoundError(key)
    return Image.open(p).convert('RGB')


def tone(img):  # warm monochrome film look
    return C.sepia(img, 0.8)


_vig = None
def vignette(img):
    global _vig
    if _vig is None:
        m = Image.radial_gradient('L').resize((W, H)); _vig = m.point(lambda p: int(min(255, max(0, (p - 95) * 1.25))))
    return Image.composite(Image.new('RGB', (W, H), (18, 13, 9)), img, _vig)


def grain(arr, t):
    rng = np.random.default_rng(int(t * 1000) % 99991)
    n = rng.integers(-9, 10, (H // 2, W // 2, 1), dtype=np.int16).repeat(2, 0).repeat(2, 1)
    return np.clip(arr.astype(np.int16) + n, 0, 255).astype(np.uint8)


def video_frames(src, dur):
    f, start = VCLIPS[src]
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(start), '-i', f'{VID}/{f}', '-t', f'{dur + 0.1:.2f}', '-an',
           '-vf', FIX.get(f, '') + f'fps={FPS},scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    last = None
    while True:
        b = p.stdout.read(W * H * 3)
        if len(b) < W * H * 3: break
        last = Image.frombytes('RGB', (W, H), b); yield last
    while True: yield last  # pad if source shorter


# ---------- text overlay with timing
def num_anim(text, p):
    m = re.search(r'[\d.]+', text)
    if not m: return text
    raw = m.group(0); val = int(raw.replace('.', '')) if raw.replace('.', '').isdigit() else None
    if val is None: return text
    v = int(val * C.ease(p)); s = f'{v:,}'.replace(',', '.')
    return text[:m.start()] + s + text[m.end():]


def overlay(img, txt, t, dur, idx):
    stamps = [x[6:] for x in txt if x.startswith('stamp:')]
    others = [x for x in txt if not x.startswith('stamp:')]
    # items appear staggered: first at 0.25 s, next after ~45% of shot
    for j, item in enumerate(others):
        k, _, v = item.partition(':')
        t0 = 0.25 if j == 0 else min(dur * 0.42, 2.2)
        if k in ('date', 'loc', 'clock'): t0 = 0.15
        dt = t - t0
        if dt < 0: continue
        frac = clamp(dt / max(0.35, len(v) * 0.045))
        if k == 'word': C.word(img, v, frac)
        elif k == 'lt': n, _, r = v.partition('|'); C.lower_third(img, n, r, frac)
        elif k == 'date': C.date_tag(img, v)
        elif k == 'loc': C.loc_tag(img, v, frac)
        elif k == 'quote': q, _, src = v.partition('|'); C.quote(img, q, src if frac >= 1 else '', frac)
        elif k == 'chapter': a, _, b = v.partition('|'); C.chapter(img, a[:int(len(a) * clamp(dt / 0.5)) or 0] or ' ', b if dt > 0.6 else '', ink=S[idx - 1]['src'].startswith('dossier'))
        elif k == 'title': C.big_title(img, v[:max(1, int(len(v) * clamp(dt / 0.6)))])
        elif k == 'counter': C.counter(img, num_anim(v, clamp(dt / 1.4)))
        elif k == 'list': C.blist(img, v.split('|'), clamp(dt / max(1.0, dur * 0.7)))
        elif k == 'clock':
            h = float(v); C.clock(img, h + clamp(t / dur) * 0.9, W - 190, 170, 72)
    n = len(stamps)
    for i, st in enumerate(stamps):
        ts = 0.3 + (i * 1.05 if n > 1 else 0) + (2.2 if n > 1 else 0)
        if t >= ts:
            k = clamp((t - ts) / 0.15); lay = img.copy(); C.stamp(lay, st, i, n)
            img.paste(Image.blend(img, lay, k))


# ---------- custom graphics
DARKBG = None
def dark_bg(key='F17_panzer_wald', b=0.3):
    return ImageEnhance.Brightness(vignette(tone(C.cover(photo(key), W, H, 1.1)))).enhance(b)


def folder(d, x, y, w, h, num, title, big=False):
    d.rectangle([x, y + 30, x + w, y + h], fill=(214, 196, 158)); d.rectangle([x, y, x + w * 0.38, y + 40], fill=(214, 196, 158))
    d.rectangle([x + 14, y + 44, x + w - 14, y + h - 14], outline=(120, 96, 66), width=2)
    d.text((x + w / 2, y + h * 0.42), num, font=C.STARDOS(120 if big else 70), fill=(70, 52, 36), anchor='mm')
    d.text((x + w / 2, y + h * 0.72), title, font=C.BARLOW(48 if big else 30), fill=(70, 52, 36), anchor='mm')


TITLES = ['Absicht', 'Gelände', 'Panzer am Ende', 'Göring', 'Machtkampf']


def graphic(kind, t, dur, s):
    p = clamp(t / dur)
    if kind == 'clock':
        img = dark_bg('F17_panzer_wald', 0.32); C.clock(img, 0 + p * 0.95); return img
    if kind == 'clock_rewind':
        img = ImageEnhance.Brightness(C.cover(photo('MAP:m01'), W, H, 1.05 + 0.05 * p)).enhance(0.4); C.clock(img, 12 - p * 11.5 % 12); return img
    if kind == 'thumb':
        img = Image.new('RGB', (W, H), (20, 16, 13))
        left = C.cover(photo('MAP:m01'), W, H, 1.1 + 0.05 * p); img.paste(ImageEnhance.Brightness(left).enhance(0.8))
        hit = tone(C.cover(photo('F30_hitler_kluge'), 900, H, 1.05 + 0.05 * p))
        mask = Image.new('L', (900, H), 0); ImageDraw.Draw(mask).ellipse([60, 40, 1100, H + 200], fill=255); mask = mask.filter(ImageFilter.GaussianBlur(40))
        red = Image.new('RGB', (900, H), (150, 20, 16)); img.paste(red, (W - 900, 0), mask.point(lambda v: int(v * .55)))
        img.paste(hit, (W - 900, 0), mask)
        return vignette(img)
    if kind == 'stamps3':
        img = Image.new('RGB', (W, H), (26, 22, 19)); d = ImageDraw.Draw(img)
        for i, ti in enumerate(['LEGENDE', 'TEILWEISE WAHR', 'BELEGT']):
            folder(d, 180 + i * 560, 200, 440, 560, str(i + 1), '')
        return img
    if kind == 'bars':
        img = dark_bg('F01_dunkirk_beach_queue', 0.28); d = ImageDraw.Draw(img); e = C.ease(clamp(t / 2.5))
        for i, (lab, val, col) in enumerate([('ERWARTET', 45000, (160, 150, 130)), ('GERETTET', 338226, (184, 50, 42))]):
            y = 380 + i * 210; wmax = 1300; wv = int(wmax * val / 338226 * e)
            d.text((300, y - 50), lab, font=C.SAIRA(44), fill=C.CREAM)
            d.rectangle([300, y, 300 + wv, y + 100], fill=col)
            d.text((320 + wv, y + 50), f'{int(val * e):,}'.replace(',', '.'), font=C.BLACKOPS(64), fill=C.CREAM, anchor='lm')
        return img
    if kind.startswith('dossier'):
        img = Image.new('RGB', (W, H), (26, 22, 19)); d = ImageDraw.Draw(img)
        if kind in ('dossiers', 'dossiers_all'):
            for i in range(5):
                if t > 0.2 + i * 0.25 or kind == 'dossiers_all': folder(d, 90 + i * 360, 280 + (i % 2) * 30, 320, 420, str(i + 1), TITLES[i])
            if kind == 'dossiers_all': img = ImageEnhance.Brightness(img).enhance(0.55)
            return img
        n = int(kind[-1]); zoom = 1 + 0.04 * p
        has_ch = any(x.startswith('chapter:') for x in s['txt'])
        folder(d, W / 2 - 420 * zoom, 170, 840 * zoom, 760, '' if has_ch else str(n), '' if has_ch else TITLES[n - 1], big=True)
        return img
    if kind == 'flow4':
        img = Image.new('RGB', (W, H), (26, 22, 19)); d = ImageDraw.Draw(img)
        boxes = [(260, 240, 'RUNDSTEDT', 'Pause, 23. Mai', 0.3), (1180, 240, 'GÖRING', 'Versprechen, 23. Mai', 2.5), (720, 600, 'HITLER', 'Haltebefehl, 24. Mai', 5.0)]
        for x, y, a, b, ts in boxes:
            if t < ts: continue
            d.rectangle([x, y, x + 480, y + 170], fill=(214, 196, 158)); d.text((x + 240, y + 60), a, font=C.BLACKOPS(52), fill=(50, 36, 26), anchor='mm'); d.text((x + 240, y + 125), b, font=C.BARLOW(36), fill=(70, 52, 36), anchor='mm')
        if t > 5.4: d.line([500, 410, 860, 600], fill=C.RED, width=10)
        if t > 6.0:
            for k in range(0, 20, 2): d.line([1420 - k * 20, 410 + k * 10, 1420 - (k + 1) * 20, 410 + (k + 1) * 10], fill=(214, 196, 158), width=6)
        return img
    if kind == 'frieser':
        img = Image.new('RGB', (W, H), (26, 22, 19)); d = ImageDraw.Draw(img); z = 1 + 0.03 * p
        bx, by, bw, bh = 700, 150, int(520 * z), int(720 * z)
        d.rectangle([bx, by, bx + bw, by + bh], fill=(120, 30, 26)); d.rectangle([bx + 20, by + 20, bx + bw - 20, by + bh - 20], outline=(230, 210, 170), width=3)
        d.text((bx + bw / 2, by + 230), 'BLITZKRIEG-', font=C.STARDOS(64), fill=(240, 225, 195), anchor='mm'); d.text((bx + bw / 2, by + 310), 'LEGENDE', font=C.STARDOS(64), fill=(240, 225, 195), anchor='mm')
        d.text((bx + bw / 2, by + 400), 'Der Westfeldzug 1940', font=C.BARLOW(38), fill=(240, 225, 195), anchor='mm'); d.text((bx + bw / 2, by + bh - 90), 'Karl-Heinz Frieser', font=C.BARLOW(40), fill=(240, 225, 195), anchor='mm')
        return img
    if kind == 'org5':
        img = Image.new('RGB', (W, H), (26, 22, 19)); d = ImageDraw.Draw(img)
        def box(x, y, a, b, col=(214, 196, 158)):
            d.rectangle([x, y, x + 470, y + 160], fill=col); d.text((x + 235, y + 58), a, font=C.BLACKOPS(46), fill=(50, 36, 26), anchor='mm'); d.text((x + 235, y + 118), b, font=C.BARLOW(32), fill=(70, 52, 36), anchor='mm')
        box(150, 160, 'OKH', 'Brauchitsch · Halder'); box(1300, 160, 'HITLER', 'Führerhauptquartier')
        box(150, 720, 'HEERESGRUPPE A', 'Rundstedt'); box(1300, 720, 'HEERESGRUPPE B', 'Bock')
        if t > 1.5:
            d.line([385, 320, 1535, 720], fill=(214, 196, 158), width=8); d.text((960, 470), 'Panzer an B', font=C.SAIRA(40), fill=C.CREAM, anchor='mm')
        if t > 12.5:
            d.line([860, 400, 1060, 560], fill=C.RED, width=14); d.line([1060, 400, 860, 560], fill=C.RED, width=14)
        if t > 15:
            d.line([1535, 320, 620, 720], fill=C.RED, width=10); d.text((1180, 600), 'zurück an Rundstedt', font=C.SAIRA(40), fill=(230, 110, 95), anchor='mm')
        return img
    if kind == 'recap':
        return dark_bg('F17_panzer_wald', 0.28)
    if kind == 'split':
        img = Image.new('RGB', (W, H)); a = tone(C.cover(photo('F18_vormarsch'), W // 2, H, 1.05 + 0.04 * p)); b = tone(C.cover(photo('WW1'), W // 2, H, 1.05 + 0.04 * p))
        img.paste(ImageEnhance.Brightness(a).enhance(0.6), (0, 0)); img.paste(ImageEnhance.Brightness(b).enhance(0.6), (W // 2, 0))
        d = ImageDraw.Draw(img); d.line([W // 2, 0, W // 2, H], fill=C.RED, width=6)
        d.text((W // 4, H // 2 - 120), '1940', font=C.STARDOS(60), fill=C.CREAM, anchor='mm'); d.text((3 * W // 4, H // 2 - 120), '1914–1918', font=C.STARDOS(60), fill=C.CREAM, anchor='mm')
        if 'VERSPIELT' not in s['txt'][0]:
            d.text((W // 4, H // 2 + 20), '10 TAGE', font=C.BLACKOPS(110), fill=C.CREAM, anchor='mm'); d.text((3 * W // 4, H // 2 + 20), '4 JAHRE', font=C.BLACKOPS(110), fill=C.CREAM, anchor='mm')
        return img
    if kind == 'MAPBG':
        return ImageEnhance.Brightness(C.cover(photo('MAP:m01'), W, H, 1.08 + 0.06 * p, 0.3 + 0.2 * p)).enhance(0.45)
    # default: darkened photo background (chapter / quote cards)
    return ImageEnhance.Brightness(vignette(tone(C.cover(photo(kind), W, H, 1.06 + 0.06 * p)))).enhance(0.33)


def frames_for(i, s):
    dur = s['t1'] - s['t0']; n = int(round(dur * FPS)) + 12  # 0.4 s tail for safety
    typ, src = s['type'], s['src']; key = src.split('@')[0]
    if typ in 'PC':
        try: photo(key)
        except FileNotFoundError: typ, key = 'G', 'MAPBG'
    txt = list(s['txt'])
    if typ == 'G' and src.split('@')[0] in ('flow4',): txt = [x for x in txt if not x.startswith('word')] if False else txt
    if typ == 'V':
        gen = video_frames(src, dur + 0.4)
    elif typ in ('P', 'C'):
        base = tone(photo(key))
        if typ == 'C':
            bg = ImageEnhance.Brightness(C.cover(base, W, H, 1.18).filter(ImageFilter.GaussianBlur(26))).enhance(0.42)
            card = C.contain(base, int(W * .6), int(H * .72))
            fr = Image.new('RGB', (card.width + 16, card.height + 16), C.PAPER); fr.paste(card, (8, 8))
        else:
            big = C.cover(base, int(W * 1.22), int(H * 1.22)); mode = ['in', 'out', 'right', 'left'][i % 4]
    for f in range(n):
        t = f / FPS; p = clamp(t / dur)
        if typ == 'V':
            fr0 = next(gen); z = 1.0 + 0.05 * p
            img = tone(fr0.resize((int(W * z), int(H * z)), Image.BILINEAR).crop((int(W * (z - 1) / 2), int(H * (z - 1) / 2), int(W * (z - 1) / 2) + W, int(H * (z - 1) / 2) + H)))
            img = vignette(img)
        elif typ == 'P':
            e = p
            if mode == 'in': z = 1.0 + 0.12 * e; cx = .5
            elif mode == 'out': z = 1.12 - 0.12 * e; cx = .5
            elif mode == 'right': z = 1.08; cx = .25 + .5 * e
            else: z = 1.08; cx = .75 - .5 * e
            ww, hh = int(big.width / 1.22 / z * 1.0), int(big.height / 1.22 / z)
            ww = min(big.width, int(W * 1.22 / (1.22 * z) * 1.22 / 1.0)) if False else int(big.width / (1.22 * z) * 1.0)
            hh = int(big.height / (1.22 * z))
            x = int((big.width - ww) * cx); y = int((big.height - hh) * .5)
            img = vignette(big.crop((x, y, x + ww, y + hh)).resize((W, H), Image.BILINEAR))
        elif typ == 'C':
            img = bg.copy(); k = 1.0 + 0.045 * p
            c2 = fr.resize((int(fr.width * k), int(fr.height * k)), Image.BILINEAR)
            img.paste(c2, ((W - c2.width) // 2 + 110, (H - c2.height) // 2 - 10))
        else:
            img = graphic(key, t, dur, s)
            if key == 'recap':  # list typed one per ~4.5 s
                items = s['txt'][0][5:].split('|'); y = 260
                for j, it in enumerate(items):
                    if t > 0.3 + j * 4.4: C.box_text(img, it, (330, y), C.BARLOW(54), pad=(24, 10), bar=True, frac=clamp((t - 0.3 - j * 4.4) / 1.0))
                    y += 140
                txt = []
        overlay(img, txt, t, dur, i)
        C.logo(img)
        a = np.asarray(img)
        if typ in 'VPC': a = grain(a, t + i)
        # quick dip from black at shot start (0.18 s) for photo/video cuts
        if f < 6 and typ in 'VPC' and 'whoosh' in s['sfx']:
            a = (a.astype(np.float32) * (0.45 + 0.55 * f / 6)).astype(np.uint8)
        yield a.tobytes()


def render(i):
    s = S[i - 1]; out = f'{OUT}/{i:03d}.mp4'
    if os.path.exists(out): return
    ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                           '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', out + '.tmp.mp4'], stdin=subprocess.PIPE)
    for b in frames_for(i, s): ff.stdin.write(b)
    ff.stdin.close(); ff.wait(); os.replace(out + '.tmp.mp4', out)


if __name__ == '__main__':
    ids = [int(x) for x in sys.argv[1:]] or [i for i, s in enumerate(S, 1) if s['type'] != 'M']
    for i in ids:
        try: render(i); print('ok', i, flush=True)
        except Exception as e: print('ERR', i, S[i - 1]['src'], repr(e), flush=True)
