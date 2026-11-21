"""Storyboard do vídeo 7 (antes da narração). Planos 3D = prévias reais do Blender (cena3d/previas, com bloom);
planos 2D = quadros de layout desenhados aqui, na paleta do canal. Saída: storyboard_video7.pdf"""
import os, math, random, textwrap
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

AQ = os.path.dirname(os.path.abspath(__file__)); V = os.path.dirname(AQ)
PREV = os.path.join(V, 'cena3d', 'previas'); MAPAS = os.path.join(V, '..', '06_terremoto', 'render', 'public')
FD = '/usr/share/fonts/opentype/inter/'
def F(n, s): return ImageFont.truetype(FD + n, s)
NAVY, OURO, BRANCO, CINZA, LARANJA, VERM, AZUL = (8, 12, 24), (227, 176, 75), (242, 244, 248), (150, 160, 180), (255, 120, 30), (230, 50, 40), (70, 150, 255)
W, H = 960, 540

def fundo():
    im = Image.new('RGB', (W, H), NAVY); d = ImageDraw.Draw(im); random.seed(1)
    for _ in range(140):
        x, y = random.randint(0, W), random.randint(0, H); b = random.randint(60, 200); d.point((x, y), fill=(b, b, b + 10))
    return im, d

def bloom(im):
    a = np.asarray(im).astype(np.float32) / 255; lum = a.mean(axis=2, keepdims=True)
    c = Image.fromarray((np.clip((lum - 0.6) / 0.4, 0, 1) * a * 255).astype(np.uint8))
    b1 = np.asarray(c.filter(ImageFilter.GaussianBlur(6))).astype(np.float32) / 255; b2 = np.asarray(c.filter(ImageFilter.GaussianBlur(24))).astype(np.float32) / 255
    a = 1 - (1 - a) * (1 - np.clip(b1 * .7 + b2 * .6, 0, 1)); return Image.fromarray((a * 255).astype(np.uint8))

def txt_tela(d, t, cor=BRANCO, y=None, tam=40):
    f = F('Inter-Bold.otf', tam); w = d.textlength(t, font=f); y = y if y is not None else H - 90
    d.rounded_rectangle((W / 2 - w / 2 - 18, y - 10, W / 2 + w / 2 + 18, y + tam + 12), 10, fill=(6, 9, 18))
    d.text((W / 2, y), t, font=f, fill=cor, anchor='ma')

def relogio(d, t, cor=BRANCO):
    f = F('Inter-SemiBold.otf', 22); d.rounded_rectangle((W - 230, 18, W - 18, 58), 8, fill=(6, 9, 18))
    d.text((W - 124, 26), t, font=f, fill=cor, anchor='ma')

def mapa(nome, crop=None, esc=None):
    im = Image.open(os.path.join(MAPAS, nome)).convert('RGB')
    if crop: im = im.crop(crop)
    return im.resize((W, H))

def terra_2d(d, cx, cy, r, noite=False):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(25, 60, 120) if not noite else (10, 18, 35), outline=(90, 160, 255), width=3)
    d.chord((cx - r, cy - r, cx + r, cy + r), 200, 340, fill=(40, 110, 70) if not noite else (20, 30, 40))

def sol_2d(d, cx, cy, r):
    for k in range(8, 0, -1): d.ellipse((cx - r - k * 6, cy - r - k * 6, cx + r + k * 6, cy + r + k * 6), fill=(60 + k * 4, 25 + k, 8))
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 150, 40))

def ficha(ano, lugar, linha, cor=OURO):
    im, d = fundo(); d.rounded_rectangle((170, 70, 790, 470), 18, fill=(236, 228, 210)); d.rectangle((170, 70, 790, 130), fill=(210, 198, 170))
    d.text((200, 82), 'ARQUIVO · CLIMA ESPACIAL', font=F('Inter-Bold.otf', 26), fill=(90, 70, 40))
    d.text((200, 160), ano, font=F('Inter-Bold.otf', 72), fill=(30, 30, 40)); d.text((200, 250), lugar, font=F('Inter-SemiBold.otf', 34), fill=(60, 60, 70))
    for i, l in enumerate(textwrap.wrap(linha, 24)): d.text((200, 320 + i * 40), l, font=F('Inter-Regular.otf', 30), fill=(70, 70, 80))
    d.ellipse((640, 330, 760, 450), outline=(190, 40, 40), width=6); d.text((700, 372), ano[-4:], font=F('Inter-Bold.otf', 28), fill=(190, 40, 40), anchor='ma')
    return im

# ---------- desenhos 2D por plano ----------
def q_ondas(n):
    im, d = fundo(); sol_2d(d, 120, 270, 70); terra_2d(d, 840, 270, 50)
    cores = [(255, 255, 255), (120, 200, 255), LARANJA]; rot = ['8 MIN', 'MINUTOS A HORAS', '15 H A 3 DIAS']
    for k in range(3):
        on = k < n; c = cores[k] if on else (50, 60, 80)
        for j in range(3): d.arc((200 + k * 170 - j * 14, 150 + j * 10, 340 + k * 170 - j * 14, 390 - j * 10), -60, 60, fill=c, width=6 if k == n - 1 else 3)
        if on: d.text((270 + k * 170, 420), rot[k], font=F('Inter-Bold.otf', 20), fill=c, anchor='ma')
    return im
def q_dinamo():
    im, d = fundo(); d.ellipse((260, 150, 540, 430), outline=(200, 200, 210), width=10)
    for a in range(0, 360, 20): d.line((400, 290, 400 + 140 * math.cos(math.radians(a)), 290 + 140 * math.sin(math.radians(a))), fill=(120, 120, 130), width=2)
    d.rounded_rectangle((540, 170, 590, 250), 10, fill=(160, 160, 170)); d.polygon([(600, 200), (720, 150), (720, 260)], fill=(255, 230, 140))
    d.text((480, 470), 'movimento → eletricidade → campo magnético', font=F('Inter-SemiBold.otf', 24), fill=CINZA, anchor='ma'); return im
def q_escudo():
    im, d = fundo(); terra_2d(d, 560, 270, 80)
    for k in range(6): d.arc((560 - 120 - k * 30, 270 - 150 - k * 20, 560 + 260 + k * 60, 270 + 150 + k * 20), 110, 250, fill=(90, 170, 255), width=2)
    for y in range(80, 480, 40): d.line((40, y, 300, y + 10), fill=(255, 150, 60), width=2)
    return im
def q_aurora():
    im = Image.new('RGB', (W, H), (5, 10, 20)); a = np.zeros((H, W, 3), np.float32); xx = np.arange(W)
    for k in range(3):
        y0 = 120 + 40 * np.sin(xx / 90 + k) + k * 30
        for y in range(H):
            f = np.exp(-((y - y0) / 50) ** 2) * (1 if y < y0.max() + 100 else 0)
            a[y] += np.stack([f * 0.15, f * 0.9, f * 0.45], 1) * 0.7
    im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    d.polygon([(0, 540), (0, 440), (200, 400), (380, 430), (560, 380), (760, 420), (960, 400), (960, 540)], fill=(3, 5, 10)); return im
def q_tratores():
    im = Image.new('RGB', (W, H), (90, 70, 40)); d = ImageDraw.Draw(im); random.seed(3)
    for i in range(14):
        x = 40 + i * 65; pts = [(x + (random.uniform(-25, 25) if 6 < j < 14 and i > 5 else 0), j * 40) for j in range(15)]
        d.line(pts, fill=(60, 120, 50), width=12)
    d.rounded_rectangle((520, 230, 600, 300), 8, fill=(30, 120, 40)); return im
def q_quebec(n):
    im = mapa('mapa_as.jpg', (0, 0, 1700, 950)); a = np.asarray(im).astype(np.float32) * (0.35 if n else 1.0)
    im = Image.fromarray(a.astype(np.uint8)); d = ImageDraw.Draw(im); random.seed(2)
    if not n:
        for _ in range(120): x, y = random.randint(380, 560), random.randint(40, 140); d.ellipse((x, y, x + 3, y + 3), fill=(255, 220, 140))
    return im
def q_orbita(n):
    im, d = fundo(); sol_2d(d, 480, 270, 40); d.ellipse((180, 60, 780, 480), outline=(70, 90, 130), width=2)
    tx, ty = (480 + 300 * math.cos(-1.0), 270 + 210 * math.sin(-1.0)) if n else (480 + 300 * math.cos(-0.2), 270 + 210 * math.sin(-0.2))
    terra_2d(d, int(tx), int(ty), 18); d.line((520, 255, 790, 200), fill=LARANJA, width=8); d.polygon([(790, 185), (820, 198), (792, 215)], fill=LARANJA)
    return im
def q_carrington():
    im = Image.new('RGB', (W, H), (236, 228, 210)); d = ImageDraw.Draw(im); d.ellipse((260, 50, 700, 490), outline=(60, 50, 40), width=4)
    for (x, y, r) in [(430, 230, 26), (470, 250, 18), (500, 220, 14)]: d.ellipse((x - r, y - r, x + r, y + r), fill=(70, 60, 50))
    d.ellipse((440, 200, 470, 222), fill=(255, 255, 255), outline=(255, 200, 120), width=3); d.ellipse((480, 260, 506, 280), fill=(255, 255, 255), outline=(255, 200, 120), width=3)
    d.text((480, 500), 'esboço de Carrington, 1º/9/1859 (redesenho)', font=F('Inter-Regular.otf', 20), fill=(90, 80, 70), anchor='ma'); return im
def q_papel():
    im, d = fundo(); d.rectangle((0, 300, 960, 360), fill=(230, 220, 190))
    for x in range(80, 900, 70): d.line((x, 315, x + 30, 315), fill=(60, 60, 60), width=4)
    for k in range(5, 0, -1): d.ellipse((560 - k * 14, 250 - k * 22, 640 + k * 14, 340), fill=(255, 120 + k * 15, 30))
    return im
def q_americas():
    im = mapa('mapa_as.jpg', (0, 0, 2000, 2400)); d = ImageDraw.Draw(im)
    for (x, y, t) in [(330, 140, 'Caribe'), (290, 215, 'Colômbia'), (250, 440, 'Santiago')]:
        d.ellipse((x - 9, y - 9, x + 9, y + 9), fill=(80, 255, 140), outline=(0, 0, 0), width=2); d.text((x + 16, y - 14), t, font=F('Inter-Bold.otf', 22), fill=BRANCO, stroke_width=3, stroke_fill=(0, 0, 0))
    return im
def q_rio():
    im = Image.new('RGB', (W, H), (10, 14, 30)); a = np.asarray(im).astype(np.float32); yy = np.arange(H)[:, None]
    a[..., 0] += np.clip(120 * np.exp(-((yy - 220) / 120) ** 2), 0, 255); a[..., 1] += 20; im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    d.polygon([(0, 540), (0, 420), (120, 400), (200, 300), (260, 250), (300, 300), (420, 390), (560, 360), (640, 260), (700, 230), (760, 300), (960, 380), (960, 540)], fill=(4, 6, 12))
    d.rectangle((150, 380, 200, 410), fill=(30, 30, 40)); d.ellipse((160, 362, 190, 392), fill=(30, 30, 40)); return im
def q_anel():
    im = Image.new('RGB', (W, H), (60, 40, 25)); d = ImageDraw.Draw(im)
    for k in range(40, 0, -1):
        r = k * 6; c = (150 + (k % 3) * 15, 105 + (k % 3) * 10, 60) if k != 22 else (255, 120, 30)
        d.ellipse((480 - r * 1.1, 270 - r, 480 + r * 1.1, 270 + r), outline=c, width=3 if k != 22 else 6)
    return im
def q_L1():
    im, d = fundo(); sol_2d(d, 90, 270, 60); terra_2d(d, 860, 270, 40)
    d.rectangle((700, 255, 730, 285), fill=(200, 170, 80)); d.line((660, 270, 700, 270), fill=(40, 70, 160), width=8); d.line((730, 270, 770, 270), fill=(40, 70, 160), width=8)
    d.text((715, 300), '1,5 milhão de km', font=F('Inter-SemiBold.otf', 20), fill=CINZA, anchor='ma'); return im
def q_brasil(kind):
    im = mapa('mapa_br.jpg'); d = ImageDraw.Draw(im, 'RGBA'); random.seed(5)
    if kind == 'bolhas':
        for _ in range(14): x, y = random.randint(150, 700), random.randint(60, 380); d.ellipse((x, y, x + 40, y + 140), fill=(120, 60, 200, 90))
    if kind == 'soja':
        for _ in range(60): x, y = random.randint(330, 560), random.randint(250, 400); d.rectangle((x, y, x + 10, y + 8), fill=(220, 200, 60, 170))
    if kind == 'linhas':
        for l in [[(260, 290), (380, 330), (520, 400), (600, 420)], [(450, 470), (560, 430), (620, 420)], [(520, 340), (600, 420)]]: d.line(l, fill=(255, 210, 40, 255), width=6)
    if kind == 'goias':
        d.ellipse((500, 330, 540, 370), outline=(255, 60, 40, 255), width=5)
    if kind == 'anomalia':
        for k in range(10, 0, -1): d.ellipse((520 - k * 30, 470 - k * 22, 520 + k * 30, 470 + k * 22), fill=(230, 40, 30, 14))
    return im
def q_torres():
    im, d = fundo()
    for x in (250, 480, 710):
        d.polygon([(x - 40, 470), (x, 150), (x + 40, 470)], outline=(160, 170, 190)); d.line((x - 60, 200, x + 60, 200), fill=(160, 170, 190), width=4)
    d.ellipse((470, 100, 490, 120), fill=(255, 200, 80)); return im
def q_ceu_sul():
    im = Image.new('RGB', (W, H), (6, 10, 22)); a = np.asarray(im).astype(np.float32); yy = np.arange(H)[:, None]
    a[..., 0] += np.clip(90 * np.exp(-((yy - 430) / 70) ** 2), 0, 255); im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    d.rectangle((0, 470, 960, 540), fill=(3, 4, 8)); return im
def q_hubble():
    im = Image.open(os.path.join(PREV, 'S07.png')).convert('RGB').resize((W, H)); return im
def q_astronauta():
    im, d = fundo(); d.ellipse((380, 120, 580, 320), fill=(220, 220, 230)); d.ellipse((410, 160, 550, 280), fill=(20, 30, 50))
    d.line((520, 200, 540, 190), fill=(255, 255, 255), width=4); d.rounded_rectangle((360, 300, 600, 500), 40, fill=(220, 220, 230)); return im
def q_amazonia():
    im = Image.new('RGB', (W, H), (20, 60, 35)); d = ImageDraw.Draw(im); random.seed(8)
    for _ in range(80): x, y = random.randint(0, W), random.randint(150, 540); r = random.randint(20, 60); d.ellipse((x - r, y - r, x + r, y + r), fill=(20, random.randint(70, 110), 40))
    d.rectangle((0, 380, 960, 540), fill=(40, 70, 90)); d.ellipse((560, 250, 640, 290), fill=(220, 220, 225)); d.line((600, 290, 600, 360), fill=(200, 200, 205), width=6); return im
def q_inpe():
    im, d = fundo(); d.rounded_rectangle((140, 80, 820, 460), 16, fill=(14, 20, 36), outline=(60, 80, 120), width=2)
    xs = list(range(170, 800, 10)); ys = [300 - 80 * math.sin(x / 50) * math.exp(-((x - 500) / 160) ** 2) for x in xs]; d.line(list(zip(xs, ys)), fill=LARANJA, width=3)
    d.text((170, 100), 'CLIMA ESPACIAL', font=F('Inter-Bold.otf', 26), fill=OURO); return im
def q_celular():
    im, d = fundo(); d.rounded_rectangle((400, 70, 560, 470), 22, fill=(20, 22, 28), outline=(90, 90, 100), width=4)
    d.text((480, 240), 'sem sinal', font=F('Inter-SemiBold.otf', 22), fill=CINZA, anchor='ma'); return im
def q_cartela():
    im, d = fundo(); d.text((480, 230), 'BRASIL MILENAR', font=F('Inter-Bold.otf', 64), fill=OURO, anchor='ma')
    random.seed(4)
    for _ in range(200): x, y = random.gauss(480, 260), random.gauss(270, 120); d.point((x, y), fill=LARANJA)
    return im

def p3(nome, clarao=0, relo=None, cor=BRANCO, tela=None):
    def f():
        im = bloom(Image.open(os.path.join(PREV, nome + '.png')).convert('RGB').resize((W, H)))
        if clarao: im = Image.blend(im, Image.new('RGB', (W, H), (255, 255, 255)), clarao)
        d = ImageDraw.Draw(im)
        if relo: relogio(d, relo, cor)
        if tela: txt_tela(d, tela)
        return im
    return f
def p2(fn, *a, relo=None, cor=BRANCO, tela=None):
    def f():
        im = fn(*a); d = ImageDraw.Draw(im)
        if relo: relogio(d, relo, cor)
        if tela: txt_tela(d, tela)
        return im
    return f

INTRO = 'INTRODUÇÃO · 100% 3D (tempos reais da narração)'
P = []
# introdução v2 com tempos reais
import sys; sys.path.insert(0, AQ); from intro_planos import planos as _ip
_I = []
for x in _ip():
    fn = p2(q_cartela, relo=x['rel']) if x['prev'] == 'CARTELA' else p3(x['prev'], clarao=0.55 if x['desc'].startswith('Terra e Sol: CLARÃO') else 0, relo=x['rel'])
    _I.append((INTRO, '3D', fn, x['desc'], x['fala'], x))
import quadros2d; quadros2d.instalar(globals())
from corpo_planos import planos as _cp
def _vis(c, rel, tela):
    tipo, nome = c.split(':', 1)
    if tipo == '3D': return p3(nome, relo=rel, cor=VERM if rel and rel.startswith('00') else BRANCO, tela=tela)
    nm, _, arg = nome.partition(':')
    if nm == 'ficha': return p2(ficha_arg, arg, relo=rel, tela=tela)
    fn = globals()[nm]; args = []
    if arg: args = [int(arg)] if arg.isdigit() else [arg]
    return p2(fn, *args, relo=rel, cor=VERM if rel and rel.startswith('00') else (OURO if rel and 'ATRAS' in rel else BRANCO), tela=tela)
_C = [(x['bloco'], x['vis'][:2], _vis(x['vis'], x['rel'], x['tela']), x['desc'], x['fala'], x) for x in _cp()]
P = _I + _C

# ---------- montagem do PDF ----------
PW, PH, COLS, ROWS, CW, CH, IMW, IMH = 2400, 1500, 4, 3, 560, 420, 540, 304
def pag(tit, n):
    p = Image.new('RGB', (PW, PH), (8, 11, 20)); d = ImageDraw.Draw(p)
    d.text((60, 40), 'STORYBOARD · VÍDEO 7: O QUE A MAIOR TEMPESTADE SOLAR DA HISTÓRIA FARIA COM O BRASIL', font=F('Inter-Bold.otf', 22), fill=CINZA)
    d.text((60, 76), tit, font=F('Inter-Bold.otf', 46), fill=BRANCO); d.text((PW - 60, 48), f'página {n}', font=F('Inter-SemiBold.otf', 19), fill=(120, 130, 150), anchor='ra')
    return p, d
pages = []; i = 0; n = 2; t0 = 0.0
while i < len(P):
    tit = P[i][0]; p, d = pag(tit, n)
    for k in range(COLS * ROWS):
        if i >= len(P) or P[i][0] != tit: break
        bl, tipo, fn, desc, fala, info = P[i]; cx = 60 + (k % COLS) * (CW + 20); cy = 160 + (k // COLS) * (CH + 20)
        im = fn().resize((IMW, IMH)); d.rounded_rectangle((cx, cy, cx + CW, cy + CH), 14, fill=(16, 21, 34)); p.paste(im, (cx + 10, cy + 10))
        dur = max(2.5, len(fala.split()) / 2.7)
        d.rounded_rectangle((cx + 18, cy + 18, cx + 168, cy + 50), 8, fill=(6, 10, 20)); d.text((cx + 28, cy + 22), f'CENA {i + 1:02d}', font=F('Inter-SemiBold.otf', 19), fill=BRANCO)
        if info:
            d.rounded_rectangle((cx + 160, cy + 18, cx + 430, cy + 50), 8, fill=(6, 10, 20))
            d.text((cx + 170, cy + 22), f"{info['t0']:.1f}s → {info['t1']:.1f}s  ·  {info['t1'] - info['t0']:.1f}s".replace('.', ','), font=F('Inter-SemiBold.otf', 18), fill=OURO)
        corb = (255, 120, 30) if tipo == '3D' else (70, 150, 255)
        d.rounded_rectangle((cx + IMW - 70, cy + IMH - 40, cx + IMW, cy + IMH - 8), 8, fill=corb); d.text((cx + IMW - 35, cy + IMH - 36), tipo, font=F('Inter-Bold.otf', 19), fill=(8, 11, 20), anchor='ma')
        npl = max(1, math.ceil(dur / 5));
        d.text((cx + 12, cy + IMH + 16), textwrap.shorten(desc, 50, placeholder='…'), font=F('Inter-Bold.otf', 21), fill=BRANCO)
        if info: fala = '[' + {'mov': 'MOVIMENTO, SEM ZOOM', 'zoom': 'IMAGEM PARADA: ZOOM LEVE CONTÍNUO'}.get(info['mov'], info['mov']).upper() + ']  ' + fala
        for j, ln in enumerate(textwrap.wrap('“' + fala + '”', 62)[:3]): d.text((cx + 12, cy + IMH + 48 + j * 21), ln, font=F('Inter-Regular.otf', 16), fill=(160, 170, 190))
        t0 += dur; i += 1
    pages.append(p); n += 1
cap = Image.new('RGB', (PW, PH), (6, 9, 16)); d = ImageDraw.Draw(cap)
hero = bloom(Image.open(os.path.join(PREV, 'S10.png')).convert('RGB').resize((1440, 810))); cap.paste(hero, (480, 300))
d.text((PW // 2, 90), 'STORYBOARD · VÍDEO 7', font=F('Inter-Bold.otf', 64), fill=BRANCO, anchor='ma')
d.text((PW // 2, 180), 'O Que a MAIOR TEMPESTADE SOLAR da História Faria com o BRASIL · Brasil Milenar', font=F('Inter-SemiBold.otf', 34), fill=CINZA, anchor='ma')
n3 = sum(1 for x in P if x[1] == '3D'); t0 = P[-1][5]['t1']
d.text((PW // 2, 1160), f'{len(P)} planos (todos ≤ 5 s) · {int(t0 // 60)} min {int(t0 % 60)} s de narração · {n3} planos em 3D (laranja) · {len(P) - n3} em 2D (azul)', font=F('Inter-SemiBold.otf', 30), fill=OURO, anchor='ma')
for j, l in enumerate(['Introdução 100% em 3D (Blender, render final na GPU). Quadros 3D aqui = prévias reais em baixa qualidade; o final ganha movimento de câmera, nitidez e brilho.',
                       'Regra: plano de no máximo 5 s. Imagem parada = UM zoom leve contínuo do começo ao fim (nunca vai-e-volta). Plano com movimento (globo girando, câmera andando) = sem zoom.',
                       'Quadros 2D = esboço de layout; cada cena longa do corpo vira 2 a 4 planos de até 5 s, seguindo a mesma regra.',
                       'Fio condutor: o relógio da contagem regressiva no canto superior direito (some depois do impacto e volta no fim, "8:20 atrasado").']):
    d.text((PW // 2, 1220 + j * 40), l, font=F('Inter-Regular.otf', 24), fill=(150, 160, 180), anchor='ma')
pages.insert(0, cap)
out = os.path.join(AQ, 'storyboard_video7.pdf')
pages[0].save(out, save_all=True, append_images=pages[1:], resolution=150)
pages[1].convert('RGB').resize((1600, 1000)).save(os.path.join(AQ, 'pagina_intro.jpg'), quality=88); pages[6].convert('RGB').resize((1600, 1000)).save('/tmp/claude-0/pag_b2.jpg', quality=85)
print('OK', out, len(P), 'cenas', round(t0), 's')
