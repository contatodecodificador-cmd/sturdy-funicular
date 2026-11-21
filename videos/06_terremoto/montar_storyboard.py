"""Monta o storyboard em PDF: 1 quadro real por plano, com tempo, duração, descrição e trecho da narração."""
import json, textwrap
from PIL import Image, ImageDraw, ImageFont
B = '/usr/share/fonts/opentype/inter/'
f = lambda n, s: ImageFont.truetype(B + n, s)
FB, FM, FR, FT = f('Inter-Bold.otf', 22), f('Inter-SemiBold.otf', 19), f('Inter-Regular.otf', 17), f('Inter-Bold.otf', 46)
L = json.load(open('storyboard/planos.json'))
fr = json.load(open('frases.json'))
W = [w for w in json.load(open('tempos.json'))['palavras']]
def fala(a, b):
    return ' '.join(w['w'] for w in W if w['t'] >= a - 0.05 and w['t'] < b - 0.05)
def mmss(s): return f'{int(s // 60)}:{s % 60:04.1f}'.replace('.', ',')
ATOS = [(0, 'ABERTURA · A NOTÍCIA'), (87.5, 'ANDAR 1 · O BRASIL QUE TREME SEM VOCÊ SABER (2 → 5)'), (320.2, 'ANDAR 2 · O MAIOR DAQUI (6 → 7,6)'), (467.3, 'ANDAR 3 · OS DE FORA QUE BALANÇAM O BRASIL (7 → 9)'), (627.6, 'ANDAR 4 · A HIPÓTESE: UM 9,5'), (785.6, 'FECHO')]
def ato(t): return [n for a, n in ATOS if t >= a][-1]
PW, PH = 2400, 1500
COLS, ROWS = 4, 3
CW, CH = 560, 400
IMW, IMH = 540, 304
pages = []
def nova(titulo, n):
    p = Image.new('RGB', (PW, PH), (8, 11, 20)); d = ImageDraw.Draw(p)
    d.text((60, 40), 'STORYBOARD · VÍDEO 6 — E SE UM TERREMOTO DE 9,5 ATINGISSE O BRASIL?', font=FB, fill=(150, 160, 180))
    d.text((60, 76), titulo, font=FT, fill=(242, 244, 248))
    d.text((PW - 60, 48), f'página {n}', font=FM, fill=(120, 130, 150), anchor='ra')
    return p, d
i = 0; n = 1
while i < len(L):
    tit = ato(L[i]['t'])
    p, d = nova(tit, n)
    for k in range(COLS * ROWS):
        if i >= len(L) or ato(L[i]['t']) != tit: break
        x = L[i]; cx = 60 + (k % COLS) * (CW + 20); cy = 160 + (k // COLS) * (CH + 20)
        js = str(int(x['t'])) if x['t'] == int(x['t']) else str(x['t'])
        try: im = Image.open(f'render/stills/Video6_{js}.jpg').resize((IMW, IMH))
        except Exception: im = Image.new('RGB', (IMW, IMH), (60, 0, 0))
        d.rounded_rectangle((cx, cy, cx + CW, cy + CH), 14, fill=(16, 21, 34))
        p.paste(im, (cx + 10, cy + 10))
        dur = x['b'] - x['a']
        d.rounded_rectangle((cx + 18, cy + 18, cx + 150, cy + 50), 8, fill=(6, 10, 20))
        d.text((cx + 28, cy + 22), f'#{i + 1:03d}  {mmss(x["a"])}', font=FM, fill=(242, 244, 248))
        d.rounded_rectangle((cx + IMW - 88, cy + 18, cx + IMW, cy + 50), 8, fill=(227, 176, 75) if dur > 4.2 else (6, 10, 20))
        d.text((cx + IMW - 44, cy + 22), f'{dur:.1f}s'.replace('.', ','), font=FM, fill=(8, 11, 20) if dur > 4.2 else (242, 244, 248), anchor='ma')
        d.text((cx + 12, cy + IMH + 18), textwrap.shorten(x['d'], 52, placeholder='…'), font=FB, fill=(242, 244, 248))
        fl = fala(x['a'], x['b'])
        for j, ln in enumerate(textwrap.wrap('“' + fl + '”', 62)[:2]):
            d.text((cx + 12, cy + IMH + 50 + j * 22), ln, font=FR, fill=(160, 170, 190))
        i += 1
    pages.append(p); n += 1
# capa
cap = Image.new('RGB', (PW, PH), (6, 9, 16)); d = ImageDraw.Draw(cap)
try:
    hero = Image.open('render/stills/Video6_' + [str(int(x['t'])) if x['t'] == int(x['t']) else str(x['t']) for x in L][2] + '.jpg').resize((1440, 810)); cap.paste(hero, (480, 300))
except Exception: pass
d.text((PW // 2, 90), 'STORYBOARD — VÍDEO 6', font=f('Inter-Bold.otf', 64), fill=(242, 244, 248), anchor='ma')
d.text((PW // 2, 180), 'E Se um TERREMOTO de 9,5 Atingisse o BRASIL? · Brasil Milenar', font=f('Inter-SemiBold.otf', 34), fill=(160, 170, 190), anchor='ma')
tot = L[-1]['b']; mx = max(x['b'] - x['a'] for x in L)
d.text((PW // 2, 1160), f'{len(L)} planos · {int(tot // 60)} min {int(tot % 60)} s · plano mais longo: {mx:.1f} s · média {tot / len(L):.1f} s por plano'.replace('.', ','), font=f('Inter-SemiBold.otf', 30), fill=(227, 176, 75), anchor='ma')
d.text((PW // 2, 1220), 'Cada quadro é um frame real da edição: 2D vetorial + prints de notícias (só o parágrafo, grifo na frase-chave) + mapas oficiais do USGS. Dourado = plano acima de 4,2 s.', font=FR, fill=(150, 160, 180), anchor='ma')
d.text((PW // 2, 1260), 'Zoom único e leve por plano (sem vai-e-volta); fusão só entre planos sem texto; régua de magnitude e sismógrafo como contador; o copo d'água como fio condutor.', font=FR, fill=(150, 160, 180), anchor='ma')
pages.insert(0, cap)
pages[0].save('storyboard/storyboard_video6.pdf', save_all=True, append_images=pages[1:], resolution=150)
for k in (0, 3, 9, 14): pages[k].resize((1200, 750)).save(f'/tmp/claude-0/sb6p{k}.jpg', quality=80)
print(len(pages), 'páginas')
