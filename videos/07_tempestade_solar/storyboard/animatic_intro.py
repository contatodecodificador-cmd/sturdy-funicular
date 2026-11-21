"""Animatic da introdução: prévias 3D cortadas nos tempos da narração (audio/intro_v2.mp3).
Imagem parada -> um zoom leve contínuo; plano com movimento -> deslize lateral lento (simula o giro/câmera do 3D), sem zoom."""
import sys, subprocess, os
AQ = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQ)
from intro_planos import planos
from PIL import Image, ImageDraw, ImageFont
src = open(os.path.join(AQ, 'montar_storyboard7.py')).read(); cut = src.index('# ---------- lista de planos')
ns = {'__file__': os.path.join(AQ, 'montar_storyboard7.py')}; exec(src[:cut], ns)
PREV = os.path.join(AQ, '..', 'cena3d', 'previas'); T = '/tmp/claude-0/anim7'; os.makedirs(T, exist_ok=True); lst = []
F = ImageFont.truetype('/usr/share/fonts/opentype/inter/Inter-SemiBold.otf', 30)
for k, p in enumerate(planos()):
    if p['prev'] == 'CARTELA': im = ns['q_cartela']().resize((1280, 720))
    else: im = ns['bloom'](Image.open(f"{PREV}/{p['prev']}.png").convert('RGB').resize((960, 540))).resize((1280, 720))
    if p['rel']:
        d = ImageDraw.Draw(im); d.rounded_rectangle((990, 24, 1256, 74), 10, fill=(6, 9, 18)); d.text((1123, 32), p['rel'], font=F, fill=(242, 244, 248), anchor='ma')
    f = f'{T}/q{k:02d}.png'; im.save(f)
    n = max(1, round((p['t1'] - p['t0']) * 30)); mov = p['mov'].lower()
    if ('zoom' in mov and 'sem zoom' not in mov) or 'avanço' in mov or 'recua' in mov:
        z0, z1 = (1.06, 1.0) if 'recua' in mov else (1.0, 1.05)
        vf = f"zoompan=z='{z0}+({z1}-{z0})*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30"
    else:
        vf = f"scale=1360:765,crop=1280:720:'40*n/{n}':22"
    if p['desc'].startswith('Terra e Sol: CLARÃO'): vf += ",fade=in:st=0:d=0.3:color=white"
    o = f'{T}/c{k:02d}.mp4'
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-loop', '1', '-framerate', '30', '-i', f, '-vf', vf, '-frames:v', str(n), '-pix_fmt', 'yuv420p', '-c:v', 'libx264', '-crf', '20', o], check=True)
    lst.append(o)
open(f'{T}/lista.txt', 'w').write('\n'.join(f"file '{x}'" for x in lst))
saida = os.path.join(AQ, '..', 'audio', 'animatic_intro_v2.mp4')
subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{T}/lista.txt', '-i', os.path.join(AQ, '..', 'audio', 'intro_v2.mp3'),
                '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', saida], check=True)
print('ok', saida)
