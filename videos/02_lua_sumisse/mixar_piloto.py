"""Mixagem do piloto (0-119,5 s): voz + trilhas por tensão (com ducking) + efeitos sutis -> mix_piloto.wav (-14 LUFS)."""
import subprocess
FIM = 119.5
# (arquivo, início no vídeo, fim no vídeo, offset dentro da faixa, fade_in, fade_out, LUFS alvo)
TR = [
    ('musica/m1_intro.mp3', 0.0, 15.55, 0, 1.5, 0.35, -31),     # mistério crescente; corta quando a Lua some
    ('musica/m1_intro.mp3', 17.2, 39.4, 20, 2.5, 1.2, -32),     # volta devagar nas perguntas / cronômetro
    ('musica/m2_luz.mp3', 38.8, 63.7, 0, 1.5, 0.5, -33),        # curioso (luz atrasada); apaga com a Lua
    ('musica/m3_escuro.mp3', 68.0, 94.5, 0, 2.5, 2.0, -34),     # escuridão do sertão
    ('musica/m4_estrelas.mp3', 92.8, FIM, 0, 3.0, 2.5, -32),    # o lado bonito: estrelas
]
DUR = {'sfx/grilos.mp3': 6.0, 'sfx/pororoca.mp3': 5.0}  # efeitos longos encurtados com fade
SFX = [  # (arquivo, tempo, volume linear)
    ('sfx/pororoca.mp3', 3.0, 0.20), ('sfx/apagar.mp3', 15.05, 0.38), ('sfx/whoosh.mp3', 20.9, 0.12),
    ('sfx/tic.mp3', 31.9, 0.25), ('sfx/cronometro.mp3', 35.0, 0.12), ('sfx/whoosh.mp3', 36.6, 0.14),
    ('sfx/pulso.mp3', 49.7, 0.22), ('sfx/pop.mp3', 53.8, 0.12), ('sfx/whoosh.mp3', 58.5, 0.10),
    ('sfx/apagar.mp3', 63.05, 0.38), ('sfx/impacto.mp3', 67.1, 0.26), ('sfx/grilos.mp3', 68.3, 0.10),
    ('sfx/pop.mp3', 76.8, 0.10), ('sfx/brilho.mp3', 94.0, 0.18),
    ('sfx/brilho.mp3', 99.2, 0.14), ('sfx/whoosh.mp3', 104.9, 0.10), ('sfx/pop.mp3', 114.5, 0.10),
]
args = ['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/voz_tratada.wav']
fl = []; n = 1; mus = []
for f, a, b, off, fi, fo, lufs in TR:
    args += ['-stream_loop', '-1', '-i', f]; L = b - a
    fl.append(f"[{n}:a]atrim={off}:{off + L:.2f},asetpts=PTS-STARTPTS,loudnorm=I={lufs}:TP=-3,afade=t=in:d={fi},afade=t=out:st={L - fo:.2f}:d={fo},adelay={int(a * 1000)}|{int(a * 1000)},aformat=channel_layouts=stereo,apad=whole_dur={FIM}[m{n}]")
    mus.append(f"[m{n}]"); n += 1
fl.append("".join(mus) + f"amix=inputs={len(mus)}:normalize=0,atrim=0:{FIM}[mus]")
sf = []
for f, t, v in SFX:
    args += ['-i', f]; d = int(max(0, t) * 1000)
    fl.append(f"[{n}:a]aformat=channel_layouts=stereo,atrim=0:{DUR.get(f, 99)},afade=t=out:st={max(0, DUR.get(f, 99) - 1.5)}:d=1.5,volume={v},adelay={d}|{d}[s{n}]"); sf.append(f"[s{n}]"); n += 1
fl.append("".join(sf) + f"amix=inputs={len(sf)}:normalize=0,apad=whole_dur={FIM},atrim=0:{FIM}[sfx]")
fl.append(f"[0:a]atrim=0:{FIM},aformat=channel_layouts=stereo,apad=whole_dur={FIM},asplit=2[voz][sc]")
fl.append("[mus][sc]sidechaincompress=threshold=0.03:ratio=4:attack=60:release=600:makeup=1[duck]")
fl.append("[voz][duck][sfx]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1:LRA=9[out]")
args += ['-filter_complex', ';'.join(fl), '-map', '[out]', '-ar', '48000', '-c:a', 'pcm_s16le', 'mix_piloto.wav']
subprocess.run(args, check=True)
print('ok', len(SFX), 'efeitos')
