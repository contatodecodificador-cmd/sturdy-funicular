"""Mixagem do vídeo 2 completo: voz + trilhas por tensão (ducking) + efeitos sutis -> mix_final.wav (-14 LUFS)."""
import subprocess
FIM = 712.0
# (arquivo, início, fim, offset na faixa, fade_in, fade_out, LUFS) — música bem sutil (-31 a -34)
TR = [
    ('m1_intro', 0.0, 15.55, 0, 1.5, 0.35, -31), ('m1_intro', 17.2, 39.4, 20, 2.5, 1.2, -32),
    ('m2_luz', 38.8, 63.7, 0, 1.5, 0.5, -33), ('m3_escuro', 68.0, 94.5, 0, 2.5, 2.0, -34),
    ('m4_estrelas', 92.8, 119.0, 0, 3.0, 2.0, -32),
    ('m5_mare', 118.2, 171.6, 0, 2.0, 1.5, -32),                 # maré: calmo, curioso
    ('m2_luz', 171.3, 202.6, 4, 1.5, 1.5, -33),                   # 15 dias / festival
    ('m6_pororoca', 202.2, 228.2, 0, 2.0, 2.0, -31),             # a primeira perda
    ('m7_mangue', 227.8, 273.3, 0, 2.0, 1.5, -32),               # andada
    ('m7_mangue', 273.0, 320.2, 12, 1.0, 2.0, -30),              # Carnaval (mais presente)
    ('m4_estrelas', 319.8, 338.0, 6, 2.0, 1.0, -32),             # eclipse
    ('m6_pororoca', 337.4, 357.4, 20, 1.0, 2.0, -32),            # cancelado / sai de cartaz
    ('m7_mangue', 357.0, 392.4, 30, 2.0, 2.0, -33),              # manguezais
    ('m3_escuro', 391.8, 409.6, 0, 2.0, 1.5, -33),               # oceano
    ('m2_luz', 409.2, 457.4, 10, 1.5, 1.5, -33),                 # mitos
    ('m1_intro', 457.0, 469.6, 26, 1.0, 1.0, -30),               # virada
    ('m3_escuro', 469.2, 515.0, 8, 2.0, 1.5, -33),               # o freio
    ('m4_estrelas', 514.7, 547.0, 14, 2.0, 1.5, -32),            # o eixo / trópico
    ('m1_intro', 546.8, 578.0, 0, 1.5, 1.5, -31),                # caos 0–85°
    ('m3_escuro', 577.6, 620.6, 0, 2.0, 2.0, -33),               # honestidade / Marte
    ('m4_estrelas', 620.3, 652.2, 0, 2.0, 2.0, -32),             # a resposta
    ('m6_pororoca', 651.8, 681.2, 0, 2.0, 2.0, -31),             # Araguari
    ('m4_estrelas', 680.8, FIM, 10, 3.0, 3.0, -30),              # fecho
]
S = [  # (efeito, tempo, volume linear)
    ('pororoca', 3.0, 0.20), ('apagar', 15.05, 0.38), ('whoosh', 20.9, 0.12), ('tic', 31.9, 0.25), ('cronometro', 35.0, 0.12),
    ('whoosh', 36.6, 0.14), ('pulso', 49.7, 0.22), ('pop', 53.8, 0.12), ('whoosh', 58.5, 0.10), ('apagar', 63.05, 0.38),
    ('impacto', 67.1, 0.26), ('grilos', 68.3, 0.10), ('pop', 76.8, 0.10), ('brilho', 94.0, 0.18), ('brilho', 99.2, 0.14),
    ('whoosh', 104.9, 0.10), ('pop', 114.5, 0.10),
    # lote 1
    ('cronometro', 118.2, 0.10), ('impacto', 129.7, 0.22), ('pop', 146.8, 0.08), ('whoosh', 149.0, 0.08), ('pop', 154.5, 0.08),
    ('cronometro', 171.4, 0.10), ('pororoca', 194.4, 0.16), ('apagar', 208.4, 0.20), ('pop', 217.7, 0.08),
    # lote 2
    ('cronometro', 228.0, 0.10), ('grilos', 228.0, 0.06), ('pop', 239.3, 0.08), ('pop', 256.5, 0.08), ('impacto', 260.0, 0.16),
    ('whoosh', 273.0, 0.10), ('pop', 277.6, 0.08), ('pop', 312.0, 0.08), ('cronometro', 320.0, 0.10), ('impacto', 338.8, 0.24),
    ('apagar', 354.6, 0.30),
    # lote 3
    ('cronometro', 357.0, 0.10), ('pop', 358.4, 0.08), ('pop', 380.0, 0.08), ('whoosh', 409.2, 0.10), ('pop', 414.8, 0.08),
    ('impacto', 433.0, 0.14), ('pop', 436.1, 0.08), ('pop', 445.8, 0.08),
    # lote 4
    ('whoosh', 461.2, 0.22), ('cronometro', 461.4, 0.14), ('impacto', 465.0, 0.20), ('whoosh', 469.2, 0.14), ('pop', 483.0, 0.08),
    ('pop', 497.2, 0.08), ('pop', 522.0, 0.08), ('pop', 535.4, 0.08), ('impacto', 559.6, 0.18), ('whoosh', 562.2, 0.10),
    ('pop', 578.0, 0.08), ('pop', 600.2, 0.08),
    # lote 5
    ('tic', 620.6, 0.22), ('pop', 630.0, 0.08), ('whoosh', 643.0, 0.08), ('whoosh', 645.7, 0.08), ('whoosh', 650.0, 0.08),
    ('pororoca', 650.0, 0.12), ('impacto', 664.0, 0.18), ('pororoca', 676.6, 0.14), ('brilho', 681.2, 0.14), ('tic', 699.0, 0.22),
    ('pop', 702.9, 0.18),
]
DUR = {'grilos': 6.0, 'pororoca': 5.0}
args = ['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/voz_tratada.wav']
fl = []; n = 1; mus = []
for f, a, b, off, fi, fo, lufs in TR:
    args += ['-stream_loop', '-1', '-i', f'musica/{f}.mp3']; L = b - a
    fl.append(f"[{n}:a]atrim={off}:{off + L:.2f},asetpts=PTS-STARTPTS,loudnorm=I={lufs}:TP=-3,afade=t=in:d={fi},afade=t=out:st={L - fo:.2f}:d={fo},adelay={int(a * 1000)}|{int(a * 1000)},aformat=channel_layouts=stereo,apad=whole_dur={FIM}[m{n}]")
    mus.append(f"[m{n}]"); n += 1
fl.append("".join(mus) + f"amix=inputs={len(mus)}:normalize=0,atrim=0:{FIM}[mus]")
sf = []
for f, t, v in S:
    args += ['-i', f'sfx/{f}.mp3']; d = int(max(0, t) * 1000); du = DUR.get(f, 30)
    fl.append(f"[{n}:a]aformat=channel_layouts=stereo,atrim=0:{du},afade=t=out:st={max(0, du - 1.5)}:d=1.5,volume={v},adelay={d}|{d}[s{n}]"); sf.append(f"[s{n}]"); n += 1
fl.append("".join(sf) + f"amix=inputs={len(sf)}:normalize=0,apad=whole_dur={FIM},atrim=0:{FIM}[sfx]")
fl.append(f"[0:a]aformat=channel_layouts=stereo,apad=whole_dur={FIM},atrim=0:{FIM},asplit=2[voz][sc]")
fl.append("[mus][sc]sidechaincompress=threshold=0.03:ratio=4:attack=60:release=600:makeup=1[duck]")
fl.append("[voz][duck][sfx]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1:LRA=9[out]")
args += ['-filter_complex', ';'.join(fl), '-map', '[out]', '-ar', '48000', '-c:a', 'pcm_s16le', 'mix_final.wav']
subprocess.run(args, check=True)
print('ok', len(TR), 'trechos de música,', len(S), 'efeitos')
