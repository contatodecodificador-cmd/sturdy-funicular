"""Cartão de notícia animado (5 s): parágrafo em cartão branco sobre vídeo desfocado e escurecido, grifo amarelo linha a linha, fonte visível."""
import sys, subprocess, os, math
from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageEnhance, ImageChops
png, fundo, fonte, out = sys.argv[1:5]
D = 5.0; FPS = 30; N = int(D * FPS)
tmp = out + '_fr'; os.makedirs(tmp, exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', fundo, '-t', str(D), '-vf', 'fps=30,scale=1920:1080', f'{tmp}/b_%04d.png'], check=True)
card = Image.open(png).convert('RGB'); W = 1480; card = card.resize((W, int(card.height * W / card.width)), Image.LANCZOS)
pad = 36; cw, ch = W + 2 * pad, card.height + 2 * pad + 60
g = card.convert('L'); px = g.load(); rows = [any(px[x, y] < 120 for x in range(0, card.width, 3)) for y in range(card.height)]
LINHAS = []; y = 0
while y < card.height:
    if rows[y]:
        y0 = y
        while y < card.height and rows[y]: y += 1
        if y - y0 > 8: LINHAS.append((y0, y))
    y += 1
# junta pedaços muito próximos (acentos) na mesma linha
J = []
for a, b in LINHAS:
    if J and a - J[-1][1] < 6: J[-1] = (J[-1][0], b)
    else: J.append((a, b))
LINHAS = J; nl = len(LINHAS)
try: F = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-Bold.otf', 26)
except Exception: F = ImageFont.load_default()
for i in range(N):
    t = i / FPS
    bg = Image.open(f'{tmp}/b_{i+1:04d}.png' if os.path.exists(f'{tmp}/b_{i+1:04d}.png') else f'{tmp}/b_0001.png').convert('RGB')
    bg = ImageEnhance.Brightness(bg.filter(ImageFilter.GaussianBlur(22))).enhance(0.45)
    k = min(1, t / 0.4); s = 0.92 + 0.08 * (1 - (1 - k) ** 3)
    c = Image.new('RGB', (cw, ch), 'white'); c.paste(card, (pad, pad))
    # grifo: linhas preenchidas em sequência entre 0,6 s e 4,4 s
    prog = max(0, min(1, (t - 0.6) / 3.8)) * nl
    hl = Image.new('RGB', card.size, 'white'); d = ImageDraw.Draw(hl)
    for L in range(nl):
        f = max(0, min(1, prog - L))
        y0, y1 = LINHAS[L]
        if f > 0: d.rectangle([0, y0 - 4, int(card.width * f), y1 + 6], fill=(255, 226, 92))
    c.paste(ImageChops.multiply(card, hl), (pad, pad))
    dd = ImageDraw.Draw(c); dd.text((pad, ch - 52), fonte, font=F, fill=(90, 90, 90))
    c = c.resize((int(cw * s), int(ch * s)), Image.LANCZOS)
    sh = Image.new('RGBA', (c.width + 80, c.height + 80), (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle([40, 50, c.width + 40, c.height + 50], fill=(0, 0, 0, 160))
    sh = sh.filter(ImageFilter.GaussianBlur(18))
    x, y = (1920 - c.width) // 2, (1080 - c.height) // 2
    bg.paste(sh, (x - 40, y - 40), sh); bg.paste(c, (x, y))
    if k < 1: bg = Image.blend(Image.open(f'{tmp}/b_0001.png').convert('RGB').filter(ImageFilter.GaussianBlur(22)), bg, k)
    bg.save(f'{tmp}/o_{i:04d}.png')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', '30', '-i', f'{tmp}/o_%04d.png', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', out], check=True)
subprocess.run(['rm', '-rf', tmp]); print('ok', out, nl, 'linhas')
