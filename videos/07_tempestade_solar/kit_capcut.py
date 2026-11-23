"""Kit CapCut do vídeo 7: clipes 3D nomeados, áudio em trilhas separadas (alinhadas em 0:00), planilha de cenas e guia de edição."""
import json, os, shutil, subprocess, csv
K = 'kit_capcut'
P = json.load(open('render/src/planos7.json'))
import unicodedata, re
def slug(t):
    t = ''.join(c for c in unicodedata.normalize('NFD', t) if unicodedata.category(c) != 'Mn').lower()
    return '-'.join([x for x in re.split('[^a-z0-9]+', t) if x][:6])
NOMES = [f"{i+1:03d}_{p['id']}_{slug(p['desc'])}" for i, p in enumerate(P)]
src = open('mixar7.py').read().split('DUR = ')[0].replace('import subprocess, json', '')
exec(src)  # define FIM, TR, SFX, T_CLARAO, T_IMP, T_30 (sem rodar a mixagem)
DUR = {'sfx/espaco.mp3': 4.5, 'sfx/aurora.mp3': 4.5, 'sfx/floresta.mp3': 4.5, 'sfx/trator.mp3': 3.5, 'sfx/zumbido.mp3': 3.5, 'sfx/chuva.mp3': 3.5, 'sfx/neve.mp3': 3.5}
SFX.sort(key=lambda x: x[1])
GANHO = 2.0  # a mixagem final sobe ~2 dB no loudnorm; as trilhas já saem nesse nível

# ---------- 3D ----------
os.makedirs(f'{K}/02_clipes_3d', exist_ok=True)
for nome, p in zip(NOMES, P):
    if p['vis'].startswith('3D:'):
        shutil.copy(f'render/public/3d/{p["id"]}.mp4', f'{K}/02_clipes_3d/{nome}.mp4')

# ---------- áudio ----------
A = f'{K}/03_audio'; os.makedirs(f'{A}/musicas_separadas', exist_ok=True); os.makedirs(f'{A}/efeitos_separados', exist_ok=True)
run = lambda a: subprocess.run(['ffmpeg', '-nostdin', '-y', '-loglevel', 'error'] + a, check=True)
run(['-i', 'audio/voz_completa.wav', '-af', 'loudnorm=I=-14:TP=-1', '-ar', '48000', '-b:a', '192k', f'{A}/1_narracao.mp3'])
args, fl, mus, n = [], [], [], 0
for f, a, b, off, fi, fo, lufs in TR:
    args += ['-stream_loop', '-1', '-i', f]; L = b - a
    fl.append(f"[{n}:a]atrim={off}:{off + L:.2f},asetpts=PTS-STARTPTS,loudnorm=I={lufs}:TP=-3,afade=t=in:d={fi},afade=t=out:st={L - fo:.2f}:d={fo},adelay={int(a*1000)}|{int(a*1000)},aformat=channel_layouts=stereo,apad=whole_dur={FIM}[m{n}]")
    mus.append(f'[m{n}]'); n += 1
fl.append(''.join(mus) + f'amix=inputs={len(mus)}:normalize=0,atrim=0:{FIM},volume={GANHO}dB[o]')
run(args + ['-filter_complex', ';'.join(fl), '-map', '[o]', '-ar', '48000', '-b:a', '192k', f'{A}/2_musica_completa.mp3'])
args, fl, sf = [], [], []
for i, (f, t, v) in enumerate(SFX):
    args += ['-i', f]; d = int(max(0, t) * 1000); D = DUR.get(f, 99)
    fl.append(f"[{i}:a]aformat=channel_layouts=stereo,atrim=0:{D},afade=t=out:st={max(0, D-1.0)}:d=1.0,volume={v},adelay={d}|{d}[s{i}]"); sf.append(f'[s{i}]')
fl.append(''.join(sf) + f'amix=inputs={len(sf)}:normalize=0,apad=whole_dur={FIM},atrim=0:{FIM},volume={GANHO}dB[o]')
run(args + ['-filter_complex', ';'.join(fl), '-map', '[o]', '-ar', '48000', '-b:a', '192k', f'{A}/3_efeitos_completos.mp3'])
run(['-i', 'mix_final.wav', '-b:a', '256k', f'{A}/4_mix_final_referencia.mp3'])
for f in sorted(os.listdir('musica')): shutil.copy(f'musica/{f}', f'{A}/musicas_separadas/{f}')
for f in sorted(os.listdir('sfx')): shutil.copy(f'sfx/{f}', f'{A}/efeitos_separados/{f}')

# ---------- planilha de cenas ----------
mmss = lambda s: f'{int(s // 60)}:{s % 60:05.2f}'
def movimento(p):
    if p['vis'].startswith('3D:'): return f"CLIPE 3D (já animado: {p['movtxt']}). SEM zoom no CapCut"
    return 'Zoom leve LINEAR 100% → 105% do primeiro ao último quadro (keyframe no início e no fim)'
fx_por_plano = {}
for f, t, v in SFX:
    for p in P:
        if p['t0'] - 0.05 <= t < p['t1']:
            fx_por_plano.setdefault(p['id'], []).append(f"{os.path.basename(f)[:-4]} @{mmss(t)}"); break
with open(f'{K}/cenas.csv', 'w', newline='', encoding='utf-8-sig') as fh:
    w = csv.writer(fh, delimiter=';')
    w.writerow(['cena', 'arquivo', 'tipo', 'início', 'fim', 'duração (s)', 'bloco', 'o que aparece', 'movimento no CapCut', 'texto na tela', 'relógio (canto sup. direito)', 'efeitos sonoros', 'narração'])
    bl = 'INTRODUÇÃO'
    for i, (nome, p) in enumerate(zip(NOMES, P)):
        bl = p.get('bloco') or bl
        tipo = '3D (vídeo)' if p['vis'].startswith('3D:') else 'imagem'
        arq = f"02_clipes_3d/{nome}.mp4" if tipo != 'imagem' else f"01_imagens/{nome}.jpg"
        w.writerow([i + 1, arq, tipo, mmss(p['t0']), mmss(p['t1']), f"{p['t1'] - p['t0']:.2f}".replace('.', ','), bl, p['desc'], movimento(p), p['tela'] or '', p['rel'] or '', ', '.join(fx_por_plano.get(p['id'], [])), p['fala']])
print('ok', len(P), 'cenas', len(SFX), 'efeitos', FIM, T_CLARAO, T_IMP, T_30)
