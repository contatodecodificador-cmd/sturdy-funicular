"""Mixagem do piloto do vídeo 6 (0–89,2 s): voz + trilha (ducking) + efeitos sutis."""
import subprocess
FIM = 89.2
TR = [('musica/m1_abertura.mp3', 0.0, FIM, 0, 1.0, 2.0, -31)]
SFX = [('sfx/lustre.mp3', 5.4, 0.28), ('sfx/ronco.mp3', 5.0, 0.12), ('sfx/passos.mp3', 12.2, 0.16), ('sfx/whoosh.mp3', 16.3, 0.12),
       ('sfx/marcatexto.mp3', 16.9, 0.18), ('sfx/whoosh.mp3', 21.2, 0.1), ('sfx/agulha.mp3', 25.4, 0.14), ('sfx/whoosh.mp3', 28.1, 0.1),
       ('sfx/marcatexto.mp3', 28.5, 0.16), ('sfx/ronco.mp3', 31.9, 0.14), ('sfx/whoosh.mp3', 33.9, 0.1), ('sfx/marcatexto.mp3', 34.5, 0.16),
       ('sfx/pop.mp3', 40.5, 0.1), ('sfx/pop.mp3', 41.3, 0.1), ('sfx/pop.mp3', 42.1, 0.1), ('sfx/pop.mp3', 43.0, 0.1),
       ('sfx/ronco.mp3', 43.6, 0.16), ('sfx/copo.mp3', 49.0, 0.12), ('sfx/ronco.mp3', 52.9, 0.2), ('sfx/agulha.mp3', 62.6, 0.16),
       ('sfx/copo.mp3', 67.2, 0.1), ('sfx/whoosh.mp3', 70.3, 0.1), ('sfx/ronco.mp3', 75.6, 0.14), ('sfx/agulha.mp3', 82.8, 0.16), ('sfx/ronco.mp3', 86.1, 0.18)]
DUR = {'sfx/ronco.mp3': 3.5, 'sfx/passos.mp3': 4.0}
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
args += ['-filter_complex', ';'.join(fl), '-map', '[out]', '-ar', '48000', '-c:a', 'pcm_s16le', 'mix_piloto.wav']
subprocess.run(args, check=True); print('ok')
