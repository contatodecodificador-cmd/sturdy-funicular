"""Gráficos 2D do canal (1920x1080). Identidade própria: carvão + creme + caramelo."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import os, shapefile

D = os.path.dirname(os.path.abspath(__file__))
W, H = 1920, 1080
BG = (18, 16, 14)
CREAM = (243, 233, 216)
CARAMEL = (217, 142, 58)
MUTED = (165, 152, 134)
DARK = (34, 30, 26)
TIER = [('S', 'O ANO INTEIRO', (229, 72, 77)), ('A', 'QUASE O ANO', (240, 140, 60)),
        ('B', 'ALGUNS MESES', (240, 200, 70)), ('C', 'ALGUMAS SEMANAS', (150, 200, 90)),
        ('D', 'ALGUNS DIAS', (70, 170, 120)), ('F', 'ALGUMAS HORAS', (60, 150, 170)),
        ('✕', 'NEM CHEGA A LATIR', (130, 90, 180))]


def serif(size, weight=700):
    f = ImageFont.truetype(f'{D}/fonts/PlayfairDisplay.ttf', size)
    try: f.set_variation_by_axes([weight])
    except Exception: pass
    return f


def sans(size, weight=600):
    f = ImageFont.truetype(f'{D}/fonts/Inter.ttf', size)
    try: f.set_variation_by_axes([min(32, max(14, size)), weight])
    except Exception: pass
    return f


def cover(img, w=W, h=H, focus=(0.5, 0.5)):
    """Recorta a imagem para preencher w x h, mantendo o ponto de foco."""
    img = img.convert('RGB')
    s = max(w / img.width, h / img.height)
    img = img.resize((max(w, int(img.width * s + .5)), max(h, int(img.height * s + .5))), Image.LANCZOS)
    x = int((img.width - w) * focus[0]); y = int((img.height - h) * focus[1])
    return img.crop((x, y, x + w, y + h))


def grade(img):
    """Correção de cor do canal: quente, leve dessaturação e vinheta."""
    img = img.convert('RGB')
    from PIL import ImageEnhance
    img = ImageEnhance.Color(img).enhance(0.85)
    r, g, b = img.split()
    r = r.point(lambda v: min(255, int(v * 1.04 + 4)))
    b = b.point(lambda v: int(v * 0.94))
    img = Image.merge('RGB', (r, g, b))
    return vignette(img)


def vignette(img, strength=0.55):
    w, h = img.size
    m = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m)
    d.ellipse([-w * .25, -h * .3, w * 1.25, h * 1.3], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(w // 8))
    dark = Image.new('RGB', (w, h), (0, 0, 0))
    return Image.composite(img, Image.blend(img, dark, strength), m)


def darken_blur(img, amt=0.65, blur=18):
    img = img.filter(ImageFilter.GaussianBlur(blur))
    return Image.blend(img, Image.new('RGB', img.size, BG), amt)


# ---------- overlays (RGBA, fundo transparente) ----------

def label(title, sub=None):
    """Label inferior esquerdo: barra caramelo + caixa escura translúcida. Fica longe do centro."""
    o = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(o)
    ft, fs = sans(34, 750), sans(24, 500)
    tw = d.textlength(title.upper(), font=ft); sw = d.textlength(sub.upper(), font=fs) if sub else 0
    bw = int(max(tw, sw)) + 64; bh = 74 if not sub else 116
    x, y = 72, H - 150 - bh  # acima da barra de progresso do YouTube
    d.rounded_rectangle([x, y, x + bw, y + bh], 6, fill=(18, 16, 14, 205))
    d.rectangle([x, y, x + 8, y + bh], fill=CARAMEL + (255,))
    d.text((x + 32, y + 18), title.upper(), font=ft, fill=CREAM)
    if sub: d.text((x + 32, y + 66), sub.upper(), font=fs, fill=CARAMEL)
    return o


def location(state_codes, place, age):
    """Mini mapa do Brasil no canto superior direito com o(s) estado(s) em destaque."""
    o = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(o)
    mw, mh = 300, 300; x0, y0 = W - mw - 70, 60
    d.rounded_rectangle([x0 - 20, y0 - 20, x0 + mw + 20, y0 + mh + 120], 10, fill=(18, 16, 14, 210))
    draw_brazil(d, (x0, y0, mw, mh), state_codes)
    d.text((x0, y0 + mh + 14), place.upper(), font=sans(24, 750), fill=CREAM)
    d.text((x0, y0 + mh + 50), age, font=serif(28, 600), fill=CARAMEL)
    return o


_BR = None
def _brazil():
    global _BR
    if _BR is None:
        r = shapefile.Reader(f'{D}/geo/ne_10m_admin_1_states_provinces.shp')
        fn = [f[0] for f in r.fields[1:]]
        ia, ic = fn.index('adm0_a3'), fn.index('postal')
        _BR = []
        for sr in r.iterShapeRecords():
            if sr.record[ia] != 'BRA': continue
            pts, parts = sr.shape.points, list(sr.shape.parts) + [len(sr.shape.points)]
            polys = [pts[parts[i]:parts[i + 1]] for i in range(len(parts) - 1)]
            _BR.append((sr.record[ic], polys))
    return _BR


def draw_brazil(d, box, hi=(), dim=(70, 64, 56), line=(110, 100, 88)):
    x0, y0, mw, mh = box
    lon0, lon1, lat0, lat1 = -74.2, -34.6, -33.9, 5.4
    s = min(mw / (lon1 - lon0), mh / (lat1 - lat0))
    ox = x0 + (mw - (lon1 - lon0) * s) / 2
    def P(p): return (ox + (p[0] - lon0) * s, y0 + (lat1 - p[1]) * s)
    for code, polys in _brazil():
        for poly in polys:
            if len(poly) < 3: continue
            d.polygon([P(p) for p in poly], fill=(CARAMEL if code in hi else dim) + (255,), outline=line + (255,))


def big_number(num, caption):
    """Cartão de dado: número gigante no centro sobre fundo escurecido (aplicar sobre darken_blur)."""
    o = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(o)
    f = serif(230, 800); cw = d.textlength(num, font=f)
    d.text(((W - cw) / 2, 330), num, font=f, fill=CREAM)
    fc = sans(40, 600); tw = d.textlength(caption.upper(), font=fc)
    d.rectangle([(W - tw) / 2 - 24, 650, (W + tw) / 2 + 24, 714], fill=CARAMEL + (255,))
    d.text(((W - tw) / 2, 658), caption.upper(), font=fc, fill=BG)
    return o


def oxygen(value, caption):
    """Barra de oxigênio 0–40% com marcador 'hoje 21%'."""
    o = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(o)
    d.text((W / 2 - d.textlength('OXIGÊNIO NO AR', font=sans(40, 750)) / 2, 330), 'OXIGÊNIO NO AR', font=sans(40, 750), fill=CREAM)
    x0, x1, y = 360, 1560, 470
    d.rounded_rectangle([x0, y, x1, y + 44], 22, fill=(60, 54, 48, 255))
    v = max(0.5, min(40, value)); xv = x0 + (x1 - x0) * v / 40
    d.rounded_rectangle([x0, y, xv, y + 44], 22, fill=CARAMEL + (255,))
    xt = x0 + (x1 - x0) * 21 / 40
    d.line([xt, y - 26, xt, y + 70], fill=CREAM, width=4)
    d.text((xt - 70, y + 80), 'HOJE: 21%', font=sans(30, 700), fill=CREAM)
    for p in (0, 10, 20, 30, 40):
        xp = x0 + (x1 - x0) * p / 40
        d.text((xp - 24, y - 64), f'{p}%', font=sans(26, 500), fill=MUTED)
    f = serif(72, 800); t = caption
    d.text((W / 2 - d.textlength(t, font=f) / 2, 640), t, font=f, fill=CARAMEL)
    return o


def era_card(num, name, place, age, states, bg=None):
    base = darken_blur(cover(bg), 0.72, 10) if bg is not None else Image.new('RGB', (W, H), BG)
    o = base.convert('RGBA'); d = ImageDraw.Draw(o)
    fn = serif(560, 900)
    n = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(n).text((930, -130), f'{num:02d}', font=fn, fill=CREAM + (28,))
    o = Image.alpha_composite(o, n); d = ImageDraw.Draw(o)
    d.text((140, 360), f'CAPÍTULO {num}', font=sans(30, 700), fill=CARAMEL)
    d.text((136, 400), name, font=serif(120, 800), fill=CREAM)
    d.line([142, 580, 520, 580], fill=CARAMEL, width=4)
    d.text((140, 610), place.upper(), font=sans(34, 650), fill=CREAM)
    d.text((140, 660), age, font=serif(44, 500), fill=MUTED)
    draw_brazil(d, (1480, 660, 340, 340), states)
    return o.convert('RGB')


def tier_list(filled=None, highlight=None, title='QUANTO TEMPO O CARAMELO AGUENTA?'):
    """filled: {'D': ['Devoniano', ...]}; highlight: letra que acabou de receber nota."""
    filled = filled or {}
    o = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(o)
    d.text((W / 2 - d.textlength(title, font=sans(46, 800)) / 2, 60), title, font=sans(46, 800), fill=CREAM)
    y = 160; rh = 116
    for k, desc, col in TIER:
        hl = highlight == k
        d.rounded_rectangle([160, y, 1760, y + rh - 14], 8, fill=(48, 42, 36) if hl else DARK)
        d.rounded_rectangle([160, y, 620, y + rh - 14], 8, fill=col)
        kf = serif(70, 900) if k != '✕' else ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 60)
        d.text((190, y + 14 if k != '✕' else y + 20), k, font=kf, fill=BG)
        d.text((280, y + 36), desc, font=sans(26, 800), fill=BG)
        x = 650
        for e in filled.get(k, []):
            fw = d.textlength(e.upper(), font=sans(28, 700)) + 40
            d.rounded_rectangle([x, y + 22, x + fw, y + rh - 36], 6, fill=CREAM if hl else (70, 63, 55))
            d.text((x + 20, y + 33), e.upper(), font=sans(28, 700), fill=BG if hl else CREAM)
            x += fw + 14
        y += rh
    return o


def weapon(n, name, desc, bg):
    base = grade(cover(bg)); o = base.convert('RGBA')
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle([0, 0, 900, H], fill=(18, 16, 14, 170))
    sh = sh.filter(ImageFilter.GaussianBlur(40)); o = Image.alpha_composite(o, sh); d = ImageDraw.Draw(o)
    d.text((120, 380), f'ARMA {n}', font=sans(40, 800), fill=CARAMEL)
    d.text((114, 430), name, font=serif(130, 900), fill=CREAM)
    d.text((120, 610), desc, font=sans(36, 500), fill=CREAM)
    return o.convert('RGB')


def compare(left, right, ltitle, rtitle, lstat, rstat, title):
    o = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(o)
    d.text((W / 2 - d.textlength(title, font=serif(70, 800)) / 2, 70), title, font=serif(70, 800), fill=CREAM)
    for i, (im, t, s) in enumerate(((left, ltitle, lstat), (right, rtitle, rstat))):
        x = 170 + i * 840
        o.paste(grade(cover(im, 740, 520)), (x, 220))
        d.rectangle([x, 220, x + 740, 740], outline=CARAMEL if i == 1 else MUTED, width=5)
        d.text((x, 770), t.upper(), font=sans(40, 800), fill=CARAMEL if i == 1 else CREAM)
        d.text((x, 830), s, font=sans(32, 500), fill=CREAM)
    d.text((W / 2 - 46, 420), 'VS', font=serif(80, 900), fill=CARAMEL)
    return o


def quote(text, bg, pos='center'):
    base = grade(cover(bg)); o = base.convert('RGBA')
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 110)); o = Image.alpha_composite(o, sh); d = ImageDraw.Draw(o)
    f = serif(96, 800); lines = text.split('\n')
    y = H / 2 - len(lines) * 60
    for ln in lines:
        d.text((W / 2 - d.textlength(ln, font=f) / 2, y), ln, font=f, fill=CREAM); y += 120
    return o.convert('RGB')


def subscribe():
    o = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(o)
    x, y = 72, H - 300
    d.rounded_rectangle([x, y, x + 560, y + 110], 55, fill=(18, 16, 14, 230))
    d.ellipse([x + 18, y + 15, x + 98, y + 95], fill=CARAMEL)
    d.text((x + 42, y + 22), 'C', font=serif(48, 900), fill=BG)
    d.text((x + 120, y + 22), 'NOME DO CANAL', font=sans(30, 800), fill=CREAM)
    d.text((x + 120, y + 62), 'Paleontologia com humor', font=sans(22, 500), fill=MUTED)
    d.rounded_rectangle([x + 400, y + 30, x + 535, y + 80], 25, fill=(229, 72, 77))
    d.text((x + 415, y + 40), 'INSCREVER', font=sans(22, 800), fill=CREAM)
    return o


def put(base, *overlays):
    o = base.convert('RGBA')
    for ov in overlays: o = Image.alpha_composite(o, ov)
    return o.convert('RGB')


# ---------- extras ----------

def kinetic(text, pos='center', size=150, color=CREAM, box=False):
    """Texto grande animado (entra palavra por palavra) — usado na intro."""
    o = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(o)
    f = serif(size, 900); lines = text.split('\n')
    lh = int(size * 1.15); y = (H - lh * len(lines)) / 2 if pos == 'center' else H - 220 - lh * len(lines)
    for ln in lines:
        w = d.textlength(ln, font=f); x = (W - w) / 2
        if box: d.rectangle([x - 30, y + 10, x + w + 30, y + lh], fill=(18, 16, 14, 190))
        d.text((x + 4, y + 4), ln, font=f, fill=(0, 0, 0, 140)); d.text((x, y), ln, font=f, fill=color)
        y += lh
    return o


def stamp(text, ok=False):
    """Carimbo inclinado (✓ verde-caramelo / ✕ vermelho) no canto superior esquerdo."""
    col = CARAMEL if ok else (229, 72, 77)
    t = Image.new('RGBA', (900, 220), (0, 0, 0, 0)); d = ImageDraw.Draw(t)
    f = sans(64, 900); s = ('✓ ' if ok else '✕ ') + text.upper()
    fd = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 64)
    w = d.textlength(s, font=fd) + 60
    d.rounded_rectangle([10, 40, 10 + w, 170], 14, outline=col, width=10)
    d.text((40, 62), s, font=fd, fill=col)
    t = t.rotate(-8, expand=True, resample=Image.BICUBIC)
    o = Image.new('RGBA', (W, H), (0, 0, 0, 0)); o.alpha_composite(t, (110, 90))
    return o


def specs(rows, title='FICHA TÉCNICA'):
    """Ficha do personagem no lado direito (não cobre o cachorro, que fica à esquerda)."""
    o = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(o)
    x, y = W - 760, 240; h = 110 + 122 * len(rows)
    d.rounded_rectangle([x, y, x + 680, y + h], 12, fill=(18, 16, 14, 215))
    d.text((x + 36, y + 30), title, font=sans(30, 800), fill=CARAMEL)
    for i, (k, v) in enumerate(rows):
        yy = y + 100 + i * 122
        d.text((x + 36, yy), k.upper(), font=sans(26, 600), fill=MUTED)
        d.text((x + 36, yy + 32), v, font=serif(46, 800), fill=CREAM)
    return o


def bars(items, title, unit=''):
    """Gráfico de barras horizontal: items=[(nome, valor, destaque?)]."""
    o = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(o)
    d.text((W / 2 - d.textlength(title, font=serif(96, 800)) / 2, 110), title, font=serif(96, 800), fill=CREAM)
    mx = max(v for _, v, _ in items); n = len(items); y = 330 + (3 - n) * 80
    for name, v, hl in items:
        d.text((160, y + 22), name.upper(), font=sans(46, 800), fill=CARAMEL if hl else CREAM)
        bw = max(16, int(980 * v / mx))
        d.rounded_rectangle([640, y, 640 + bw, y + 110], 12, fill=CARAMEL if hl else (90, 82, 72))
        lab = f'{v:,.0f}'.replace(',', '.') + unit
        lf = sans(48, 800); lw = d.textlength(lab, font=lf)
        if bw > lw + 60: d.text((640 + bw - lw - 30, y + 26), lab, font=lf, fill=BG if hl else CREAM)
        else: d.text((660 + bw, y + 26), lab, font=lf, fill=CREAM)
        y += 200
    return o


def map_focus(groups, title, sub=None):
    """Mapa grande do Brasil: groups=[(estados, cor, legenda)]."""
    o = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(o)
    hi = {}
    for codes, col, _ in groups:
        for c in codes: hi[c] = col
    x0, y0, mw, mh = 1000, 120, 820, 840
    lon0, lon1, lat0, lat1 = -74.2, -34.6, -33.9, 5.4
    s = min(mw / (lon1 - lon0), mh / (lat1 - lat0)); ox = x0 + (mw - (lon1 - lon0) * s) / 2
    for code, polys in _brazil():
        for poly in polys:
            if len(poly) < 3: continue
            d.polygon([(ox + (p[0] - lon0) * s, y0 + (lat1 - p[1]) * s) for p in poly], fill=tuple(hi.get(code, (60, 55, 48))) + (255,), outline=(110, 100, 88, 255))
    d.text((140, 330), title, font=serif(96, 800), fill=CREAM)
    if sub: d.text((144, 470), sub, font=sans(34, 500), fill=MUTED)
    y = 580
    for _, col, lab in groups:
        if not lab: continue
        d.rounded_rectangle([144, y, 184, y + 40], 6, fill=tuple(col)); d.text((204, y), lab.upper(), font=sans(32, 700), fill=CREAM); y += 70
    return o.convert('RGB')


def chain(steps, title):
    """Linha evolutiva 2D: caixas ligadas por setas."""
    o = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(o)
    d.text((W / 2 - d.textlength(title, font=serif(72, 800)) / 2, 150), title, font=serif(72, 800), fill=CREAM)
    n = len(steps); bw = 470; gap = (W - 160 - n * bw) / max(1, n - 1)
    for i, (name, sub) in enumerate(steps):
        x = 80 + i * (bw + gap); hl = i == n - 1
        d.rounded_rectangle([x, 440, x + bw, 640], 14, fill=CARAMEL if hl else DARK, outline=CARAMEL, width=4)
        fn = serif(48 if len(name) < 14 else 38, 800); d.text((x + bw / 2 - d.textlength(name, font=fn) / 2, 480), name, font=fn, fill=BG if hl else CREAM)
        d.text((x + bw / 2 - d.textlength(sub, font=sans(26, 600)) / 2, 565), sub, font=sans(26, 600), fill=BG if hl else MUTED)
        if i < n - 1:
            ax = x + bw + 12; d.line([ax, 540, ax + gap - 24, 540], fill=CARAMEL, width=6)
            d.polygon([(ax + gap - 24, 525), (ax + gap - 4, 540), (ax + gap - 24, 555)], fill=CARAMEL)
    return o


def cta(text, sub):
    o = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(o)
    x, y = 140, H - 380
    d.rounded_rectangle([x, y, x + 1100, y + 200], 18, fill=(18, 16, 14, 225))
    d.rectangle([x, y, x + 12, y + 200], fill=CARAMEL)
    d.text((x + 50, y + 34), text, font=serif(64, 800), fill=CREAM)
    d.text((x + 52, y + 124), sub, font=sans(34, 600), fill=CARAMEL)
    return o
