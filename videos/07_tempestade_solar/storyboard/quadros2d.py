"""Esboços 2D extras do storyboard do vídeo 7 (layout, não arte final). Usa os auxiliares definidos em montar_storyboard7.py (injetados em G)."""
import math, random
import numpy as np
from PIL import Image, ImageDraw

def instalar(G):
    W, H, F, fundo, terra_2d, sol_2d, mapa = G['W'], G['H'], G['F'], G['fundo'], G['terra_2d'], G['sol_2d'], G['mapa']
    NAVY, OURO, BRANCO, CINZA, LARANJA, VERM, AZUL = G['NAVY'], G['OURO'], G['BRANCO'], G['CINZA'], G['LARANJA'], G['VERM'], G['AZUL']
    def rot(d, t, y=H - 60, c=CINZA): d.text((W / 2, y), t, font=F('Inter-SemiBold.otf', 22), fill=c, anchor='ma')
    def q_radio():
        im, d = fundo(); d.rounded_rectangle((300, 160, 660, 380), 20, fill=(40, 44, 56)); d.ellipse((330, 200, 470, 340), fill=(25, 28, 36))
        d.rectangle((500, 220, 630, 260), fill=(10, 60, 40)); xs = list(range(505, 625, 4)); d.line([(x, 240 + (8 * math.sin(x / 3) if x < 560 else 0)) for x in xs], fill=(80, 255, 140), width=2)
        d.line((600, 120, 640, 160), fill=VERM, width=6); d.line((640, 120, 600, 160), fill=VERM, width=6); return im
    def q_aviao():
        im, d = fundo(); d.polygon([(300, 270), (620, 250), (660, 270), (620, 290)], fill=(220, 225, 235)); d.polygon([(470, 260), (420, 180), (450, 180), (520, 258)], fill=(200, 205, 215))
        d.polygon([(470, 280), (420, 360), (450, 360), (520, 282)], fill=(200, 205, 215))
        for k in range(3): d.arc((640 + k * 20, 220 - k * 15, 700 + k * 30, 320 + k * 15), -50, 50, fill=(90, 100, 120), width=3)
        return im
    def q_protons():
        im, d = fundo(); d.rectangle((420, 230, 540, 310), fill=(200, 160, 70)); d.rectangle((260, 255, 420, 285), fill=(30, 50, 120)); d.rectangle((540, 255, 700, 285), fill=(30, 50, 120)); random.seed(2)
        for _ in range(40): y = random.randint(60, 480); x = random.randint(0, 900); d.line((x, y, x + 60, y - 10), fill=(255, 200, 90), width=2)
        return im
    def q_relogio(t):
        im, d = fundo(); txt = {'17h30': '17 H 30 MIN'}.get(t, t); c = VERM if t.startswith('00') else BRANCO
        d.text((W / 2, 200), txt, font=F('Inter-Bold.otf', 110), fill=c, anchor='ma'); return im
    def q_nucleo():
        im, d = fundo(); cx, cy = 480, 280
        for r, c in [(220, (40, 80, 150)), (170, (150, 70, 30)), (110, (255, 140, 40)), (50, (255, 230, 150))]: d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=c)
        d.pieslice((cx - 225, cy - 225, cx + 225, cy + 225), -90, 0, fill=NAVY)
        for k in range(4): d.arc((cx - 140 + k * 10, cy - 140 + k * 10, cx + 140 - k * 10, cy + 140 - k * 10), 100 + k * 30, 220 + k * 30, fill=(255, 210, 120), width=3)
        return im
    def q_lua_nucleo():
        im, d = fundo(); d.ellipse((180, 130, 500, 450), fill=(255, 140, 40)); d.ellipse((600, 210, 760, 370), fill=(190, 190, 195))
        d.text((340, 470), 'núcleo externo', font=F('Inter-SemiBold.otf', 24), fill=CINZA, anchor='ma'); d.text((680, 390), 'Lua', font=F('Inter-SemiBold.otf', 24), fill=CINZA, anchor='ma'); return im
    def q_arquivo():
        im, d = fundo(); d.rectangle((250, 120, 710, 480), fill=(70, 60, 50)); d.rectangle((270, 140, 690, 300), fill=(90, 78, 64)); d.rectangle((270, 320, 690, 460), fill=(90, 78, 64))
        d.rounded_rectangle((440, 200, 520, 220), 6, fill=(200, 180, 120))
        for k in range(5): d.rectangle((300 + k * 70, 90 - k * 6, 360 + k * 70, 150), fill=(236, 228, 210))
        return im
    def q_aurora_eua():
        im = G['q_aurora'](); d = ImageDraw.Draw(im)
        for y in range(450, 540, 12): d.line((0, y, 960, y), fill=(40, 60, 30), width=5)
        return im
    def q_tratores_torto():
        im = Image.new('RGB', (W, H), (90, 70, 40)); d = ImageDraw.Draw(im); random.seed(4)
        for i in range(14): x = 40 + i * 65; d.line([(x + random.uniform(-30, 30) * (j / 14), j * 40) for j in range(15)], fill=(60, 120, 50), width=12)
        return im
    def q_dolar():
        im, d = fundo()
        for k in range(6): d.rounded_rectangle((300 + k * 10, 330 - k * 26, 660 + k * 10, 370 - k * 26), 6, fill=(60, 120, 70), outline=(30, 70, 40))
        return im
    def q_plantadeira():
        im = Image.new('RGB', (W, H), (120, 85, 50)); d = ImageDraw.Draw(im)
        for i in range(12): d.line((i * 85, 0, i * 85 + 30, 540), fill=(140, 100, 60), width=10)
        d.rounded_rectangle((330, 200, 630, 300), 12, fill=(40, 130, 60)); d.rectangle((300, 300, 660, 330), fill=(60, 60, 60)); return im
    def q_relogio_parede(t):
        im, d = fundo(); d.ellipse((330, 120, 630, 420), fill=(236, 230, 215), outline=(60, 60, 60), width=8)
        for a, L in [(-90 + 2 * 30 + 22, 80), (-90 + 44 * 6, 120)]: d.line((480, 270, 480 + L * math.cos(math.radians(a)), 270 + L * math.sin(math.radians(a))), fill=(20, 20, 20), width=8)
        rot(d, '2h44 da manhã'); return im
    def q_neve():
        im = Image.new('RGB', (W, H), (12, 16, 28)); d = ImageDraw.Draw(im); d.rectangle((0, 400, 960, 540), fill=(200, 205, 215))
        for x in range(60, 900, 160): d.rectangle((x, 300, x + 110, 400), fill=(30, 32, 40)); d.polygon([(x - 10, 300), (x + 55, 250), (x + 120, 300)], fill=(220, 225, 235))
        random.seed(6)
        for _ in range(200): x, y = random.randint(0, W), random.randint(0, 400); d.ellipse((x, y, x + 3, y + 3), fill=(230, 230, 240))
        return im
    def q_jornal_nasa():
        im, d = fundo(); d.rounded_rectangle((220, 80, 740, 460), 10, fill=(245, 245, 248))
        d.text((250, 110), 'NASA · 2014', font=F('Inter-Bold.otf', 30), fill=(20, 40, 120)); [d.rectangle((250, 170 + k * 34, 710 - (k % 3) * 60, 186 + k * 34), fill=(190, 190, 195)) for k in range(8)]; return im
    def q_observatorio():
        im, d = fundo(); d.rectangle((300, 300, 660, 480), fill=(120, 100, 80)); d.chord((300, 180, 660, 420), 180, 360, fill=(160, 150, 140))
        d.polygon([(470, 190), (560, 120), (575, 135), (490, 205)], fill=(60, 60, 70)); return im
    def q_carrington_flash():
        im = G['q_carrington'](); d = ImageDraw.Draw(im)
        for (x, y) in [(455, 211), (493, 270)]: d.ellipse((x - 30, y - 30, x + 30, y + 30), outline=(255, 220, 140), width=4)
        return im
    def q_telegrafistas():
        im, d = fundo()
        for x, t in [(240, 'BOSTON'), (720, 'PORTLAND')]:
            d.rounded_rectangle((x - 110, 200, x + 110, 340), 12, fill=(70, 55, 40)); d.text((x, 360), t, font=F('Inter-Bold.otf', 26), fill=OURO, anchor='ma')
        d.line((350, 270, 610, 270), fill=(200, 170, 90), width=4); d.text((480, 230), '⚡', font=F('Inter-Bold.otf', 40), fill=(140, 200, 255), anchor='ma'); return im
    def q_observatorio_imperial():
        im = G['q_rio'](); d = ImageDraw.Draw(im); d.rectangle((140, 360, 230, 410), fill=(40, 40, 50)); d.ellipse((155, 330, 215, 390), fill=(40, 40, 50)); return im
    def q_caderno():
        im = Image.new('RGB', (W, H), (232, 222, 196)); d = ImageDraw.Draw(im)
        for y in range(80, 500, 36): d.line((60, y, 900, y), fill=(200, 190, 170), width=1)
        d.text((120, 200), '15 de fevereiro de 1875', font=F('Inter-Regular.otf', 34), fill=(60, 50, 90)); d.text((120, 260), 'aurora', font=F('Inter-Bold.otf', 60), fill=(150, 40, 40)); return im
    def q_floresta():
        im = Image.new('RGB', (W, H), (30, 50, 35)); d = ImageDraw.Draw(im); random.seed(7)
        for _ in range(16): x = random.randint(0, W); d.rectangle((x, 150, x + random.randint(20, 40), 540), fill=(70, 50, 30)); d.ellipse((x - 70, 40, x + 90, 220), fill=(30, random.randint(80, 120), 45))
        return im
    def q_escala774():
        im, d = fundo(); d.ellipse((120, 330, 200, 410), fill=(255, 150, 40)); d.text((160, 420), '1859', font=F('Inter-Bold.otf', 24), fill=CINZA, anchor='ma')
        d.ellipse((420, 70, 860, 510), fill=(255, 90, 20)); d.text((640, 260), '774', font=F('Inter-Bold.otf', 60), fill=BRANCO, anchor='ma'); return im
    def q_gps():
        im, d = fundo(); terra_2d(d, 480, 620, 300); d.rectangle((450, 120, 510, 170), fill=(200, 170, 80)); d.rectangle((370, 135, 450, 155), fill=(30, 50, 120)); d.rectangle((510, 135, 590, 155), fill=(30, 50, 120))
        random.seed(3); d.line([(480 + random.uniform(-20, 20), 170 + k * 15) for k in range(12)], fill=(255, 120, 120), width=3); return im
    def q_equador_magnetico():
        im = mapa('mapa_as.jpg', (0, 600, 3600, 3300)); d = ImageDraw.Draw(im)
        d.line([(80, 140), (300, 175), (470, 230), (620, 250), (800, 230), (950, 210)], fill=(255, 220, 60), width=5); return im
    def q_inpe_mapa():
        im = G['q_brasil']('bolhas'); d = ImageDraw.Draw(im); d.rectangle((20, 20, 300, 60), fill=(6, 9, 18)); d.text((30, 28), 'INPE · EMBRACE', font=F('Inter-Bold.otf', 22), fill=OURO); return im
    def q_celular_gps():
        im = G['q_celular'](); d = ImageDraw.Draw(im); d.text((480, 140), '12:04:31', font=F('Inter-Bold.otf', 36), fill=BRANCO, anchor='ma')
        d.line((480, 60, 480, 100), fill=(200, 170, 80), width=4); return im
    def q_mundo_polos():
        im = mapa('mapa_as.jpg'); a = np.asarray(im).astype(np.float32); a[:140] = a[:140] * 0.5 + np.array([230, 60, 40]) * 0.5
        return Image.fromarray(a.astype(np.uint8))
    def q_transformador():
        im, d = fundo(); d.rectangle((320, 200, 640, 460), fill=(110, 115, 120)); [d.rectangle((340 + k * 40, 220, 360 + k * 40, 440), fill=(90, 95, 100)) for k in range(7)]
        for x in (380, 480, 580): d.rectangle((x - 10, 120, x + 10, 200), fill=(170, 170, 160)); d.ellipse((x - 20, 100, x + 20, 130), fill=(140, 90, 60))
        return im
    def q_amperimetro():
        im, d = fundo(); d.ellipse((300, 120, 660, 480), fill=(236, 230, 215), outline=(60, 60, 60), width=6)
        d.line((480, 300, 480 + 150 * math.cos(math.radians(-40)), 300 + 150 * math.sin(math.radians(-40))), fill=VERM, width=6); d.text((480, 380), 'A', font=F('Inter-Bold.otf', 50), fill=(40, 40, 40), anchor='ma'); return im
    def q_torres_linha():
        im = Image.new('RGB', (W, H), (150, 170, 190)); d = ImageDraw.Draw(im); d.rectangle((0, 380, 960, 540), fill=(110, 130, 80))
        for k in range(6):
            x = 100 + k * 150; h = 240 - k * 25; d.polygon([(x - 25, 380), (x, 380 - h), (x + 25, 380)], outline=(60, 60, 70)); d.line((x - 50, 400 - h, x + 50, 400 - h), fill=(60, 60, 70), width=3)
        return im
    def q_itaipu():
        im = Image.new('RGB', (W, H), (150, 180, 210)); d = ImageDraw.Draw(im); d.rectangle((0, 300, 960, 540), fill=(60, 110, 130))
        d.polygon([(80, 300), (880, 260), (900, 420), (60, 440)], fill=(180, 180, 175)); [d.rectangle((150 + k * 70, 330, 180 + k * 70, 430), fill=(150, 150, 145)) for k in range(10)]; return im
    def q_antena():
        im, d = fundo(); d.line((80, 300, 880, 300), fill=(220, 190, 80), width=5)
        for k in range(5): d.arc((380 - k * 40, 180 - k * 30, 580 + k * 40, 420 + k * 30), 200, 340, fill=(255, 140, 60), width=2)
        return im
    def q_anomalia_cresce(qual):
        im = mapa('mapa_as.jpg', (0, 600, 3600, 3300)); d = ImageDraw.Draw(im, 'RGBA'); s = 0.6 if qual == '2014' else 1.0
        for k in range(10, 0, -1): d.ellipse((560 - k * 34 * s, 360 - k * 22 * s, 560 + k * 34 * s, 360 + k * 22 * s), fill=(230, 40, 30, 16))
        return im
    def q_anomalia_dividida():
        im = mapa('mapa_as.jpg', (0, 600, 3600, 3300)); d = ImageDraw.Draw(im, 'RGBA')
        for cx in (470, 760):
            for k in range(8, 0, -1): d.ellipse((cx - k * 28, 360 - k * 20, cx + k * 28, 360 + k * 20), fill=(230, 40, 30, 18))
        return im
    def q_satelites_caindo():
        im, d = fundo(); terra_2d(d, 480, 760, 420); random.seed(9)
        for _ in range(38): x, y = random.randint(80, 880), random.randint(60, 300); d.rectangle((x, y, x + 10, y + 6), fill=(200, 200, 210)); d.line((x + 5, y + 6, x - 10, y + 30), fill=(255, 120, 40), width=2)
        return im
    def q_atmosfera_incha():
        im, d = fundo(); terra_2d(d, 480, 760, 420)
        for k in range(5): d.arc((60 - k * 20, 340 - k * 30, 900 + k * 20, 1180 + k * 30), 200, 340, fill=(90, 150, 255), width=3)
        return im
    def q_fazenda_antena():
        im = Image.new('RGB', (W, H), (150, 190, 220)); d = ImageDraw.Draw(im); d.rectangle((0, 330, 960, 540), fill=(90, 130, 60))
        d.rectangle((300, 260, 520, 360), fill=(230, 220, 200)); d.polygon([(290, 260), (410, 200), (530, 260)], fill=(160, 60, 50)); d.ellipse((560, 230, 640, 270), fill=(220, 220, 225)); return im
    def q_previsao_sul():
        im = G['q_brasil']('vazio'); d = ImageDraw.Draw(im, 'RGBA'); d.ellipse((380, 380, 620, 520), fill=(60, 120, 255, 110)); return im
    def q_mundo_reparos():
        im = mapa('mapa_as.jpg'); d = ImageDraw.Draw(im)
        for (x, y) in [(400, 90), (520, 160), (300, 380), (880, 120), (820, 300)]: d.ellipse((x - 14, y - 14, x + 14, y + 14), fill=(255, 190, 40), outline=(0, 0, 0), width=3)
        return im
    def q_pessoa_ceu():
        im = G['q_aurora'](); d = ImageDraw.Draw(im); d.ellipse((450, 360, 490, 400), fill=(5, 5, 8)); d.rounded_rectangle((440, 395, 500, 480), 14, fill=(5, 5, 8)); return im
    def q_operador():
        im, d = fundo(); d.rounded_rectangle((120, 90, 840, 430), 14, fill=(14, 20, 36), outline=(60, 80, 120), width=2)
        for k in range(6): d.rectangle((160 + k * 110, 140, 250 + k * 110, 200), fill=(30, 120, 70) if k % 2 else (40, 60, 90))
        d.line([(160, 380), (300, 330), (450, 360), (600, 300), (800, 320)], fill=OURO, width=3); return im
    def q_comentarios():
        im, d = fundo()
        for k in range(4): d.rounded_rectangle((220, 90 + k * 100, 740, 170 + k * 100), 12, fill=(24, 30, 46)); d.ellipse((235, 105 + k * 100, 285, 155 + k * 100), fill=(70, 90, 130))
        return im
    def ficha_arg(s):
        a, b, c = s.split('|'); return G['ficha'](a, b, c)
    vazio = G['q_brasil']
    for k, v in list(locals().items()):
        if k.startswith('q_'): G[k] = v
    G['ficha_arg'] = ficha_arg
