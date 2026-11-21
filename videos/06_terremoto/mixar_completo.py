"""Mixagem do vídeo 6 completo: voz + trilha por andar (ducking) + efeitos sincronizados -> mix_final.wav (-14 LUFS)."""
import subprocess, json, importlib.util
FIM = 826.0
TR = [  # (arquivo, início, fim, offset na faixa, fade in, fade out, LUFS)
    ('musica/m1_abertura.mp3', 0.0, 87.5, 0, 1.0, 1.5, -31),
    ('musica/m2_andar1.mp3', 86.8, 237.0, 0, 1.5, 2.0, -32),
    ('musica/m2_andar1.mp3', 235.5, 321.0, 30, 2.0, 1.5, -32),
    ('musica/m3_andar2.mp3', 320.0, 467.6, 0, 1.5, 1.5, -32),
    ('musica/m4_andar3.mp3', 467.0, 627.0, 0, 1.5, 1.5, -32),
    ('musica/m5_andar4.mp3', 626.8, 786.4, 0, 1.2, 2.0, -31),
    ('musica/m6_fecho.mp3', 785.2, FIM, 0, 2.5, 3.0, -31),
]
# piloto (0–87,5 s): mesma lista aprovada, com o copo 3D pousando
SFX = [('sfx/lustre.mp3', 5.4, 0.28), ('sfx/ronco.mp3', 5.0, 0.12), ('sfx/copo.mp3', 8.6, 0.12), ('sfx/passos.mp3', 10.5, 0.16), ('sfx/whoosh.mp3', 14.9, 0.12),
       ('sfx/marcatexto.mp3', 15.8, 0.18), ('sfx/whoosh.mp3', 19.9, 0.1), ('sfx/whoosh.mp3', 24.9, 0.1),
       ('sfx/marcatexto.mp3', 25.6, 0.16), ('sfx/ronco.mp3', 32.3, 0.14), ('sfx/whoosh.mp3', 33.9, 0.1), ('sfx/marcatexto.mp3', 36.4, 0.16),
       ('sfx/pop.mp3', 38.7, 0.1), ('sfx/pop.mp3', 39.5, 0.1), ('sfx/pop.mp3', 40.3, 0.1), ('sfx/pop.mp3', 41.3, 0.1),
       ('sfx/ronco.mp3', 42.4, 0.16), ('sfx/ambiente_cozinha.mp3', 47.4, 0.1), ('sfx/ronco.mp3', 51.1, 0.2), ('sfx/agulha.mp3', 61.0, 0.16),
       ('sfx/ambiente_cozinha.mp3', 60.3, 0.08), ('sfx/pousa_copo.mp3', 65.9, 0.2), ('sfx/whoosh.mp3', 68.6, 0.1), ('sfx/ronco.mp3', 73.6, 0.14),
       ('sfx/agulha.mp3', 81.0, 0.16), ('sfx/ronco.mp3', 84.5, 0.18)]
# cozinha 3D: tremores sincronizados com a animação
SFX += [('sfx/ambiente_cozinha.mp3', 87.5, 0.08), ('sfx/ambiente_cozinha.mp3', 141.0, 0.1), ('sfx/agua_mexe.mp3', 217.5, 0.08),
        ('sfx/ronco.mp3', 221.3, 0.16), ('sfx/range.mp3', 222.2, 0.12), ('sfx/louca.mp3', 226.85, 0.2), ('sfx/quadro.mp3', 228.95, 0.2), ('sfx/agua_mexe.mp3', 230.8, 0.1),
        ('sfx/ambiente_cozinha.mp3', 368.9, 0.08), ('sfx/ambiente_cozinha.mp3', 425.1, 0.08),
        ('sfx/tremor_forte.mp3', 474.0, 0.2), ('sfx/range.mp3', 474.6, 0.14), ('sfx/arrasta.mp3', 478.1, 0.2), ('sfx/quebra.mp3', 478.7, 0.18), ('sfx/racha.mp3', 479.85, 0.2),
        ('sfx/ambiente_cozinha.mp3', 570.7, 0.08),
        ('sfx/tremor_forte.mp3', 676.5, 0.24), ('sfx/arrasta.mp3', 676.7, 0.18), ('sfx/quebra.mp3', 677.4, 0.2), ('sfx/entulho.mp3', 677.6, 0.16), ('sfx/racha.mp3', 678.0, 0.18),
        ('sfx/quebra.mp3', 679.6, 0.2), ('sfx/tremor_forte.mp3', 681.3, 0.22), ('sfx/arrasta.mp3', 681.5, 0.18), ('sfx/entulho.mp3', 682.0, 0.16),
        ('sfx/tremor_forte.mp3', 686.1, 0.22), ('sfx/entulho.mp3', 686.5, 0.16), ('sfx/agua_mexe.mp3', 686.2, 0.12),
        ('sfx/ambiente_cozinha.mp3', 716.2, 0.08), ('sfx/ambiente_cozinha.mp3', 785.6, 0.1)]
# cenas 2D: ambiências na entrada de cada cena + eventos
AMB = {'povoado/calmo': ('vento_sertao', 0.1, 0), 'povoado/desaba': ('tremor_forte', 0.14, 0.2), 'adobe': ('racha', 0.12, 0.6), 'joao/noite': ('noite_vila', 0.1, 0),
       'joao/falha': ('ronco', 0.16, 0.3), 'joao/dano': ('racha', 0.1, 0.5), 'joao/manha': ('passaros_serra', 0.08, 0), 'copoquebra': ('quebra', 0.18, 0.8),
       'serra': ('passaros_serra', 0.1, 0), 'atlantico': ('onda_grande', 0.13, 0.4), 'tamandare': ('mar', 0.12, 0), 'paulista': ('cidade', 0.1, 0),
       'chile': ('sirene', 0.08, 0.3), 'lisboa/calmo': ('sino', 0.1, 0), 'lisboa/desaba': ('tremor_forte', 0.16, 0), 'celular': ('notificacao', 0.14, 0.3),
       'cartela': ('papel', 0.1, 0), 'card': ('papel', 0.1, 0), 'prediocasa': ('ronco', 0.1, 0.3), 'rasgo': ('tremor_forte', 0.15, 0.2),
       'escada': ('passagem', 0.1, 0), 'calendario': ('papel', 0.1, 0), 'venezuela': ('ronco', 0.12, 0.3), 'apto': ('range', 0.1, 0.3),
       'oficial': ('papel', 0.1, 0), 'globo': ('whoosh', 0.08, 0), 'globoplacas': ('whoosh', 0.08, 0), 'sino': ('whoosh', 0.08, 0)}
C = json.load(open('render/src/cortes6.json'))
prev = None
for c in C:
    k = c['c'] + ('/' + str(c['p'].get('modo')) if c['p'].get('modo') else '')
    if k != prev and k in AMB:
        f, v, dt = AMB[k]; SFX.append((f'sfx/{f}.mp3', c['a'] + dt, v))
    if c['c'] == 'noticia' and c['p'].get('parte', 0) == 0:
        SFX.append(('sfx/whoosh.mp3', c['a'] - 0.05, 0.08)); SFX.append(('sfx/marcatexto.mp3', c['a'] + c['p'].get('g0', 0.8), 0.16))
    if c['c'] == 'pontos' and k != prev:
        SFX.append(('sfx/pop.mp3', c['a'] + 0.4, 0.08))
    for o in c['o']:
        if o['tipo'] == 'carimbo' and not o.get('ja'): SFX.append(('sfx/carimbo.mp3', c['a'] + o.get('t0', 0.5), 0.18))
    prev = k
DUR = {'sfx/ronco.mp3': 3.5, 'sfx/passos.mp3': 4.0, 'sfx/ambiente_cozinha.mp3': 4.0, 'sfx/vento_sertao.mp3': 4.5, 'sfx/noite_vila.mp3': 4.5,
       'sfx/passaros_serra.mp3': 4.5, 'sfx/cidade.mp3': 4.5, 'sfx/mar.mp3': 4.5, 'sfx/tremor_forte.mp3': 5.0}
SFX.sort(key=lambda x: x[1])
args = ['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/voz_tratada.wav']
fl = []; n = 1; mus = []
for f, a, b, off, fi, fo, lufs in TR:
    args += ['-stream_loop', '-1', '-i', f]; L = b - a
    fl.append(f"[{n}:a]atrim={off}:{off + L:.2f},asetpts=PTS-STARTPTS,loudnorm=I={lufs}:TP=-3,afade=t=in:d={fi},afade=t=out:st={L - fo:.2f}:d={fo},adelay={int(a * 1000)}|{int(a * 1000)},aformat=channel_layouts=stereo,apad=whole_dur={FIM}[m{n}]")
    mus.append(f"[m{n}]"); n += 1
fl.append("".join(mus) + f"amix=inputs={len(mus)}:normalize=0,atrim=0:{FIM}[mus]")
sf = []
for f, t, v in SFX:
    args += ['-i', f]; d = int(max(0, t) * 1000); D = DUR.get(f, 99)
    fl.append(f"[{n}:a]aformat=channel_layouts=stereo,atrim=0:{D},afade=t=out:st={max(0, D - 1.0)}:d=1.0,volume={v},adelay={d}|{d}[s{n}]"); sf.append(f"[s{n}]"); n += 1
fl.append("".join(sf) + f"amix=inputs={len(sf)}:normalize=0,apad=whole_dur={FIM},atrim=0:{FIM}[sfx]")
fl.append(f"[0:a]atrim=0:{FIM},aformat=channel_layouts=stereo,apad=whole_dur={FIM},asplit=2[voz][sc]")
fl.append("[mus][sc]sidechaincompress=threshold=0.03:ratio=4:attack=60:release=600:makeup=1[duck]")
fl.append("[voz][duck][sfx]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1:LRA=9[out]")
args += ['-filter_complex', ';'.join(fl), '-map', '[out]', '-ar', '48000', '-c:a', 'pcm_s16le', 'mix_final.wav']
subprocess.run(args, check=True); print('ok', len(SFX), 'efeitos')
