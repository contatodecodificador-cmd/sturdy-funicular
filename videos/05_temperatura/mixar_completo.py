"""Mixagem do vídeo 5 completo: voz + 9 trilhas por tensão (ducking) + efeitos sutis -> mix_final.wav (-14 LUFS)."""
import subprocess, json
FIM = 950.0
TR = [  # (arquivo, início, fim, offset na faixa, fade in, fade out, LUFS)
    ('musica/m1_corredor.mp3', 0.0, 75.5, 0, 1.0, 1.6, -31),
    ('musica/m2_frio.mp3', 74.4, 205.4, 0, 2.0, 1.8, -32),
    ('musica/m3_calor.mp3', 204.6, 274.4, 0, 1.5, 1.8, -32),
    ('musica/m4_terra.mp3', 273.7, 423.0, 0, 1.5, 1.5, -33),
    ('musica/m5_lab.mp3', 422.3, 504.6, 0, 1.2, 1.5, -33),
    ('musica/m6_lava_gelo.mp3', 503.9, 572.2, 0, 1.2, 1.8, -32),
    ('musica/m7_espaco.mp3', 571.4, 721.0, 0, 2.0, 2.0, -32),
    ('musica/m8_virada.mp3', 719.6, 889.5, 0, 2.0, 2.5, -31),
    ('musica/m9_fecho.mp3', 887.0, FIM, 0, 3.0, 3.0, -31),
]
SFX = [('sfx/respiracao.mp3', 0.0, 0.45), ('sfx/passagem.mp3', 1.95, 0.22), ('sfx/gelo.mp3', 2.3, 0.16), ('sfx/fogo.mp3', 5.6, 0.16),
       ('sfx/passagem.mp3', 8.55, 0.12), ('sfx/pop.mp3', 12.75, 0.14), ('sfx/pop.mp3', 14.45, 0.14), ('sfx/carimbo.mp3', 16.1, 0.2),
       ('sfx/passagem.mp3', 17.95, 0.24), ('sfx/passagem.mp3', 20.5, 0.14), ('sfx/fogo.mp3', 21.75, 0.18), ('sfx/gelo.mp3', 24.05, 0.14),
       ('sfx/fogo.mp3', 29.55, 0.1), ('sfx/monitor.mp3', 34.1, 0.13), ('sfx/passagem.mp3', 38.2, 0.16), ('sfx/carimbo.mp3', 42.7, 0.18),
       ('sfx/impacto.mp3', 47.95, 0.22), ('sfx/porta.mp3', 53.1, 0.22), ('sfx/porta.mp3', 57.0, 0.16), ('sfx/cronometro.mp3', 60.4, 0.12),
       ('sfx/pop.mp3', 65.25, 0.12), ('sfx/coracao.mp3', 71.35, 0.3)]
AMB = {'nevasca': ('vento', 0.12, 0), 'siberia': ('vento', 0.09, 0), 'antartida': ('vento', 0.11, 0), 'monitor': ('monitor', 0.11, 0), 'leito': ('monitor', 0.08, 0.3),
       'anna': ('bolhas', 0.14, 0), 'lava': ('lava', 0.13, 0), 'sauna': ('sauna', 0.13, 0.3), 'tokamak': ('plasma', 0.11, 0), 'spray': ('spray', 0.16, 0.3),
       'corpo37': ('coracao', 0.25, 0.4), 'rio': ('vento', 0.07, 0), 'cmb': ('pop', 0.0, 0)}
C = json.load(open('render/src/cortes.json'))
prev = None
for c in C:
    if c['c'] != prev and c['c'] in AMB and AMB[c['c']][1] > 0:
        f, v, dt = AMB[c['c']]; SFX.append((f'sfx/{f}.mp3', c['a'] + dt, v))
    if c['c'] == 'raio' and c['p'].get('modo') == 'cidade': SFX.append(('sfx/trovao.mp3', c['a'] + 0.7, 0.2))
    if c['c'] == 'lhc' and c['p'].get('modo') == 'colisao' and c['p'].get('parte') == 0: SFX.append(('sfx/colisao.mp3', c['a'] + 0.9, 0.2))
    if c['c'] == 'rio' and c['p'].get('q1') == 1: SFX.append(('sfx/gelo.mp3', c['a'] + 0.9, 0.2))
    if c['c'] == 'espacoP' and c['p'].get('apaga'): SFX.append(('sfx/respiracao.mp3', c['a'] + 0.3, 0.3))
    for o in c['o']:
        if o['tipo'] == 'chip': SFX.append(('sfx/passagem.mp3', c['a'] - 0.1, 0.14))
        if o['tipo'] == 'carimbo' and not o.get('ja'): SFX.append(('sfx/carimbo.mp3', c['a'] + o['t0'], 0.18))
    prev = c['c']
DUR = {'sfx/gelo.mp3': 2.6, 'sfx/fogo.mp3': 2.6, 'sfx/cronometro.mp3': 2.0, 'sfx/vento.mp3': 4.0, 'sfx/lava.mp3': 3.5, 'sfx/plasma.mp3': 3.5, 'sfx/monitor.mp3': 2.5}
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
