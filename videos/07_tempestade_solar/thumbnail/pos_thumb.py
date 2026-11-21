"""Pós da thumbnail 7: Sol com brilho no canto superior direito, onda de plasma indo para a Terra, bloom.
Uso: python3 pos_thumb.py <render.png> <saida.png>"""
import sys, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB'); W, H = im.size
a = np.asarray(im).astype(np.float32) / 255.0

def tela(base, cam):  # blend "screen"
    return 1 - (1 - base) * (1 - np.clip(cam, 0, 1))

# 1. bloom nas partes claras (linhas do campo, anomalia)
lum = a.mean(axis=2, keepdims=True)
claro = np.clip((lum - 0.55) / 0.45, 0, 1) * a
bl = Image.fromarray((claro * 255).astype(np.uint8))
b1 = np.asarray(bl.filter(ImageFilter.GaussianBlur(W * 0.006))).astype(np.float32) / 255
b2 = np.asarray(bl.filter(ImageFilter.GaussianBlur(W * 0.02))).astype(np.float32) / 255
a = tela(a, b1 * 0.8 + b2 * 0.6)

# 2. Sol no canto superior direito
sx, sy, R = W * 0.9, H * 0.1, W * 0.045
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
d = np.sqrt((xx - sx) ** 2 + (yy - sy) ** 2)
nucleo = np.clip(1 - (d - R) / (R * 0.15), 0, 1)[..., None]
halo1 = np.exp(-np.clip(d - R, 0, None) / (R * 0.6))[..., None]
halo2 = np.exp(-np.clip(d - R, 0, None) / (R * 3.2))[..., None]
cor_n = np.array([1.0, 0.95, 0.82]); cor_h = np.array([1.0, 0.55, 0.12]); cor_h2 = np.array([1.0, 0.35, 0.05])
sol = nucleo * cor_n + halo1 * cor_h * 0.9 + halo2 * cor_h2 * 0.45
a = tela(a, sol)

# 3. onda de plasma (ejeção de massa coronal) saindo do Sol em direção à Terra (para baixo e à esquerda)
random.seed(7)
pl = Image.new('L', (W, H), 0); dr = ImageDraw.Draw(pl)
alvo = (W * 0.62, H * 0.42)
for i in range(110):
    ang0 = math.atan2(alvo[1] - sy, alvo[0] - sx) + random.gauss(0, 0.22)
    comp = random.uniform(0.45, 1.0) * math.hypot(alvo[0] - sx, alvo[1] - sy)
    curva = random.gauss(0, 0.35)
    pts = []
    for t in np.linspace(0, 1, 40):
        ang = ang0 + curva * t
        r = R * 0.9 + comp * t
        pts.append((sx + r * math.cos(ang), sy + r * math.sin(ang)))
    for k in range(len(pts) - 1):
        f = 1 - k / len(pts)
        dr.line([pts[k], pts[k + 1]], fill=int(255 * f * random.uniform(0.35, 0.8)), width=max(1, int(W * 0.0025 * f)))
pl1 = np.asarray(pl.filter(ImageFilter.GaussianBlur(W * 0.0015))).astype(np.float32)[..., None] / 255
pl2 = np.asarray(pl.filter(ImageFilter.GaussianBlur(W * 0.012))).astype(np.float32)[..., None] / 255
a = tela(a, pl1 * np.array([1.0, 0.6, 0.2]) * 1.0 + pl2 * np.array([1.0, 0.4, 0.08]) * 1.6)

# 4. leve vinheta para o texto respirar no topo
vin = np.clip(1 - ((xx / W - 0.5) ** 2 * 0.8 + (yy / H - 0.55) ** 2 * 0.9), 0.55, 1)[..., None]
a = a * vin
Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).save(out)
print('OK', out)
