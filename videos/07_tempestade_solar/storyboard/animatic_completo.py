"""Animatic do vídeo inteiro: cada plano do storyboard (intro + corpo) no tempo real da narração completa (audio/voz_completa.mp3).
Imagem parada: um zoom leve contínuo. Plano com movimento: deslize lento (no final, o 3D/animação terá o movimento real)."""
import os, sys, subprocess
AQ = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQ); os.chdir(AQ)
src = open('montar_storyboard7.py').read(); src = src[:src.index('# ---------- montagem do PDF ----------')]
G = {'__file__': os.path.join(AQ, 'montar_storyboard7.py'), '__name__': 'sb'}; exec(src, G)
P = G['P']; T = '/tmp/claude-0/animc'; os.makedirs(T, exist_ok=True); lst = []
for k, (bl, tipo, fn, desc, fala, info) in enumerate(P):
    f = f'{T}/q{k:03d}.png'; fn().resize((1280, 720)).save(f)
    n = max(1, round((info['t1'] - info['t0']) * 30)); mov = info['mov'].lower()
    parada = mov == 'zoom' or (('zoom' in mov and 'sem zoom' not in mov) or 'avanço' in mov or 'recua' in mov)
    if parada:
        z0, z1 = (1.06, 1.0) if 'recua' in mov else (1.0, 1.05)
        vf = f"zoompan=z='{z0}+({z1}-{z0})*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30"
    else:
        vf = f"scale=1360:765,crop=1280:720:'40*n/{n}':22"
    if desc.startswith('Terra e Sol: CLARÃO'): vf += ',fade=in:st=0:d=0.3:color=white'
    o = f'{T}/c{k:03d}.mp4'
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-loop', '1', '-framerate', '30', '-i', f, '-vf', vf, '-frames:v', str(n), '-pix_fmt', 'yuv420p', '-c:v', 'libx264', '-crf', '23', '-preset', 'veryfast', o], check=True)
    lst.append(o)
open(f'{T}/lista.txt', 'w').write('\n'.join(f"file '{x}'" for x in lst))
saida = os.path.join(AQ, '..', 'audio', 'animatic_completo.mp4')
subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{T}/lista.txt', '-i', '../audio/voz_completa.mp3', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', saida], check=True)
print('ok', saida, len(P))
