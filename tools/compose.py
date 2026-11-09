"""Frame composer for the channel style (photos, cards, text overlays). Used for storyboard stills and final render."""
import os, glob, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps, ImageEnhance

W, H = 1920, 1080
ROOT = os.path.dirname(os.path.abspath(__file__))
FD = os.path.join(ROOT, '..', 'assets', 'fonts')
def F(name, size): return ImageFont.truetype(os.path.join(FD, name), size)
BLACKOPS = lambda s: F('BlackOpsOne-Regular.ttf', s)
SAIRA = lambda s: F('SairaStencilOne-Regular.ttf', s)
STARDOS = lambda s: F('StardosStencil-Bold.ttf', s)
BARLOW = lambda s: F('BarlowCondensed-SemiBold.ttf', s)
INK, PAPER, RED, CREAM = (21, 19, 17), (239, 227, 200), (184, 50, 42), (243, 234, 215)


def ease(x):
    x = max(0, min(1, x)); return 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2


def sepia(img, strength=0.85):
    g = ImageOps.grayscale(img).convert('RGB')
    sep = ImageOps.colorize(ImageOps.grayscale(img), (28, 22, 16), (246, 236, 214))
    out = Image.blend(g, sep, strength)
    return ImageEnhance.Contrast(out).enhance(1.08)


def grain_vignette(img, seed=0):
    v = Image.new('L', (W, H), 0); d = ImageDraw.Draw(v)
    for i in range(40):
        a = int(255 * (i / 40) ** 2 * 0.55)
        d.ellipse([-W * .25 + i * 12, -H * .3 + i * 7, W * 1.25 - i * 12, H * 1.3 - i * 7], outline=None)
    mask = Image.radial_gradient('L').resize((W, H))
    dark = Image.new('RGB', (W, H), (20, 14, 9))
    img = Image.composite(dark, img, mask.point(lambda p: int(min(255, max(0, (p - 90) * 1.15)))))
    return img


def cover(img, w, h, zoom=1.0, cx=.5, cy=.5):
    s = max(w / img.width, h / img.height) * zoom
    nw, nh = int(img.width * s), int(img.height * s)
    im = img.resize((nw, nh), Image.LANCZOS)
    x = int((nw - w) * cx); y = int((nh - h) * cy)
    return im.crop((x, y, x + w, y + h))


def contain(img, w, h):
    s = min(w / img.width, h / img.height); return img.resize((int(img.width * s), int(img.height * s)), Image.LANCZOS)


def kenburns(img, p, mode='in'):
    z = 1.04 + 0.10 * p if mode == 'in' else 1.14 - 0.10 * p
    cx = 0.5 + (0.06 * (p - .5) if mode == 'right' else 0)
    return cover(img, W, H, z if mode in ('in', 'out') else 1.10, cx, .5)


def card_over_blur(img, p):
    bg = cover(img, W, H, 1.15 + 0.03 * p).filter(ImageFilter.GaussianBlur(28))
    bg = ImageEnhance.Brightness(bg).enhance(0.45)
    card = contain(img, int(W * .62), int(H * .74))
    k = 1.0 + 0.04 * p
    card = card.resize((int(card.width * k), int(card.height * k)), Image.LANCZOS)
    frame = Image.new('RGB', (card.width + 16, card.height + 16), PAPER); frame.paste(card, (8, 8))
    sh = Image.new('RGBA', (frame.width + 60, frame.height + 60), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rectangle([30, 36, frame.width + 30, frame.height + 36], fill=(0, 0, 0, 150))
    sh = sh.filter(ImageFilter.GaussianBlur(16))
    x = (W - frame.width) // 2 + 120; y = (H - frame.height) // 2
    bg.paste(sh, (x - 30, y - 30), sh); bg.paste(frame, (x, y))
    return bg


def tw(draw, text, font):
    b = draw.textbbox((0, 0), text, font=font); return b[2] - b[0], b[3] - b[1]


def box_text(img, text, xy, font, fg=CREAM, bg=INK, pad=(22, 14), center=False, frac=1.0, bar=False):
    d = ImageDraw.Draw(img)
    full_w, _ = tw(d, text, font); asc, desc = font.getmetrics(); h = asc + desc + pad[1] * 2
    w = full_w + pad[0] * 2
    x, y = xy
    if center: x, y = x - w // 2, y - h // 2
    d.rectangle([x, y, x + w, y + h], fill=bg)
    if bar: d.rectangle([x - 9, y, x - 3, y + h], fill=RED)
    n = int(round(len(text) * frac)); d.text((x + pad[0], y + pad[1]), text[:n], font=font, fill=fg)
    return w, h


def word(img, text, frac=1.0):
    box_text(img, text, (W // 2, H // 2 + 40), BLACKOPS(66), center=True, frac=frac, pad=(30, 16))


def lower_third(img, name, role, frac=1.0):
    d = ImageDraw.Draw(img)
    f1, f2 = SAIRA(40), BARLOW(28)
    w1, _ = tw(d, name, f1); w2, _ = tw(d, role, f2); w = max(w1, w2) + 44
    x, y = 70, H - 210
    d.rectangle([x, y, x + w, y + 104], fill=(21, 19, 17))
    d.rectangle([x, y, x + 8, y + 104], fill=RED)
    d.text((x + 26, y + 10), name[:int(len(name) * frac)], font=f1, fill=CREAM)
    d.text((x + 26, y + 62), role[:int(len(role) * frac)], font=f2, fill=(200, 190, 170))


def date_tag(img, text):
    d = ImageDraw.Draw(img); f = STARDOS(34); w, _ = tw(d, text, f); w += 40
    x, y = W - 56 - w, 50
    d.rectangle([x, y, x + w, y + 56], fill=PAPER); d.rectangle([x + 5, y + 5, x + w - 5, y + 51], outline=(58, 47, 40), width=2)
    d.text((x + 20, y + 9), text, font=f, fill=(42, 33, 28))


def loc_tag(img, text, frac=1.0):
    box_text(img, text, (54, 50), SAIRA(44), fg=(245, 239, 226), bg=(21, 19, 17), frac=frac)


def stamp(img, text, i=0, n=1):
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    f = BLACKOPS(64 if len(text) < 16 else 48); w, h = tw(d, text, f); w += 60; h = 110
    cx = W // 2 + int((i - (n - 1) / 2) * 560); cy = H - 170 if n == 1 else H // 2 + 40
    d.rectangle([cx - w // 2, cy - h // 2, cx + w // 2, cy + h // 2], fill=(242, 232, 210, 255))
    d.rectangle([cx - w // 2 + 8, cy - h // 2 + 8, cx + w // 2 - 8, cy + h // 2 - 8], outline=RED + (255,), width=5)
    d.text((cx, cy + 4), text, font=f, fill=RED, anchor='mm')
    lay = lay.rotate(-2 + i * 2.5, center=(cx, cy), resample=Image.BICUBIC)
    img.paste(lay, (0, 0), lay)


def quote(img, text, src='', frac=1.0):
    d = ImageDraw.Draw(img); f = STARDOS(56); f2 = BARLOW(32)
    lines, cur = [], ''
    for wd in text.split():
        if tw(d, cur + ' ' + wd, f)[0] > 1300: lines.append(cur); cur = wd
        else: cur = (cur + ' ' + wd).strip()
    lines.append(cur)
    y = H // 2 - len(lines) * 40
    shown = int(len(text) * frac); c = 0
    for ln in lines:
        s = ln[:max(0, shown - c)]; c += len(ln) + 1
        d.text((W // 2, y), s, font=f, fill=CREAM, anchor='mm'); y += 78
    if src: d.line([W // 2 - 40, y + 4, W // 2 + 40, y + 4], fill=RED, width=4); d.text((W // 2, y + 40), src, font=f2, fill=(205, 195, 175), anchor='mm')


def chapter(img, title, sub, ink=False):
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dl = ImageDraw.Draw(lay)
    if not ink: dl.rectangle([W // 2 - 620, H // 2 - 150, W // 2 + 620, H // 2 + 140], fill=(14, 11, 9, 170))
    img.paste(lay.filter(ImageFilter.GaussianBlur(30)), (0, 0), lay.filter(ImageFilter.GaussianBlur(30)))
    d = ImageDraw.Draw(img); fg = (52, 38, 28) if ink else CREAM; fg2 = (88, 66, 46) if ink else (215, 205, 185)
    d.text((W // 2, H // 2 - 40), title, font=STARDOS(110), fill=fg, anchor='mm')
    d.line([W // 2 - 60, H // 2 + 30, W // 2 + 60, H // 2 + 30], fill=RED, width=5)
    d.text((W // 2, H // 2 + 80), sub, font=BARLOW(44), fill=fg2, anchor='mm')


def big_title(img, text):
    d = ImageDraw.Draw(img); f = BLACKOPS(170)
    d.text((W // 2 + 6, H // 2 + 6), text, font=f, fill=(0, 0, 0), anchor='mm')
    parts = text.split(' ')
    if len(parts) == 2:
        w1 = tw(d, parts[0] + ' ', f)[0]; tot = tw(d, text, f)[0]; x0 = W // 2 - tot // 2
        d.text((x0, H // 2), parts[0], font=f, fill=(245, 242, 235), anchor='lm'); d.text((x0 + w1, H // 2), parts[1], font=f, fill=(214, 40, 32), anchor='lm')
    else: d.text((W // 2, H // 2), text, font=f, fill=(245, 242, 235), anchor='mm')


def counter(img, text):
    d = ImageDraw.Draw(img); f = BLACKOPS(120); w, h = tw(d, text, f)
    d.rectangle([W // 2 - w // 2 - 40, H // 2 - 90, W // 2 + w // 2 + 40, H // 2 + 90], fill=INK)
    d.text((W // 2, H // 2), text, font=f, fill=CREAM, anchor='mm')


def blist(img, items, frac=1.0):
    y = H // 2 - len(items) * 45; f = BARLOW(46); d = ImageDraw.Draw(img)
    for i, it in enumerate(items):
        if frac < (i + 1) / len(items) - 0.5 / len(items): break
        box_text(img, it, (W // 2 - 360, y), f, pad=(20, 8), bar=True); y += 92


def clock(img, hours, x=None, y=None, R=120):
    d = ImageDraw.Draw(img); x = x or W // 2; y = y or H // 2 - 60
    d.ellipse([x - R, y - R, x + R, y + R], fill=PAPER, outline=INK, width=6)
    for i in range(12):
        a = i / 12 * math.tau; d.line([x + math.sin(a) * R * .8, y - math.cos(a) * R * .8, x + math.sin(a) * R * .92, y - math.cos(a) * R * .92], fill=INK, width=4)
    ha = hours / 12 * math.tau; ma = (hours % 1) * math.tau
    d.line([x, y, x + math.sin(ha) * R * .5, y - math.cos(ha) * R * .5], fill=INK, width=10)
    d.line([x, y, x + math.sin(ma) * R * .8, y - math.cos(ma) * R * .8], fill=RED, width=6)
    txt = f'{int(hours):02d}:00 h'; f = BLACKOPS(64)
    box_text(img, txt, (x, y + R + 70), f, fg=(224, 87, 75) if hours >= 48 else CREAM, center=True)


def logo(img):
    d = ImageDraw.Draw(img); x, y, R = W - 78, H - 78, 40
    d.ellipse([x - R, y - R, x + R, y + R], fill=(217, 199, 164)); d.ellipse([x - R + 5, y - R + 5, x + R - 5, y + R - 5], outline=(122, 90, 62), width=2)
    d.polygon([(x, y - 26), (x + 6, y), (x, y + 26), (x - 6, y)], fill=(91, 67, 48))


def placeholder(desc, src):
    img = Image.new('RGB', (W, H), (38, 33, 28)); d = ImageDraw.Draw(img)
    for i in range(0, W + H, 60): d.line([i, 0, i - H, H], fill=(46, 40, 34), width=18)
    d.text((W // 2, H // 2 - 70), 'ARCHIVFILM' if src.startswith('V') else 'BILD FOLGT', font=STARDOS(70), fill=(150, 135, 110), anchor='mm')
    d.text((W // 2, H // 2 + 10), desc[:70], font=BARLOW(40), fill=(200, 185, 160), anchor='mm')
    d.text((W // 2, H // 2 + 70), src, font=BARLOW(32), fill=(140, 125, 100), anchor='mm')
    return img


def find_media(key, mdir):
    for ext in ('.jpg', '.jpeg', '.png'):
        p = os.path.join(mdir, key + ext)
        if os.path.exists(p): return p
    g = glob.glob(os.path.join(mdir, key + '.*'))
    return g[0] if g else None
