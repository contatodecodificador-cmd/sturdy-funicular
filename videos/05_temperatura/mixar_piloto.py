"""Mixagem do piloto (0-74,4 s): voz + trilha (ducking) + efeitos sutis -> render/public/mix_piloto.wav (-14 LUFS)."""
import subprocess
FIM = 74.4
TR = [('musica/m1_corredor.mp3', 0.0, FIM, 0, 1.0, 2.0, -31)]
SFX = [('sfx/respiracao.mp3', 0.0, 0.45), ('sfx/passagem.mp3', 1.95, 0.22), ('sfx/gelo.mp3', 2.3, 0.16), ('sfx/fogo.mp3', 5.6, 0.16),
       ('sfx/passagem.mp3', 8.55, 0.12), ('sfx/pop.mp3', 12.75, 0.14), ('sfx/pop.mp3', 14.45, 0.14), ('sfx/carimbo.mp3', 16.1, 0.2),
       ('sfx/passagem.mp3', 17.95, 0.24), ('sfx/passagem.mp3', 20.5, 0.14), ('sfx/fogo.mp3', 21.75, 0.18), ('sfx/gelo.mp3', 24.05, 0.14),
       ('sfx/fogo.mp3', 29.55, 0.1), ('sfx/monitor.mp3', 34.1, 0.13), ('sfx/passagem.mp3', 38.2, 0.16), ('sfx/carimbo.mp3', 42.7, 0.18),
       ('sfx/impacto.mp3', 47.95, 0.22), ('sfx/porta.mp3', 53.1, 0.22), ('sfx/porta.mp3', 57.0, 0.16), ('sfx/cronometro.mp3', 60.4, 0.12),
       ('sfx/pop.mp3', 65.25, 0.12), ('sfx/coracao.mp3', 71.35, 0.3)]
DUR = {'sfx/gelo.mp3': 2.6, 'sfx/fogo.mp3': 2.6, 'sfx/cronometro.mp3': 2.0}
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
args += ['-filter_complex', ';'.join(fl), '-map', '[out]', '-ar', '48000', '-c:a', 'pcm_s16le', 'render/public/mix_piloto.wav']
subprocess.run(args, check=True); print('ok', len(SFX), 'efeitos')
