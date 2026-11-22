"""Mixagem do vídeo 7: voz + trilha por bloco (ducking) + efeitos ligados aos planos -> mix_final.wav (-14 LUFS)."""
import subprocess, json
P = json.load(open('render/src/planos7.json'))
FIM = round(P[-1]['t1'], 2)
T_CLARAO = [p for p in P if p['desc'].startswith('Terra e Sol: CLARÃO')][0]['t0']
T_IMP = [p for p in P if p['rel'] == '00:00:00'][0]['t0']
T_30 = [p for p in P if p['rel'] == '00:30:00'][0]['t0']
TR = [  # (arquivo, início, fim, offset, fade in, fade out, LUFS)
    ('musica/m1_intro.mp3', 0.0, 87.6, 0, 0.8, 1.5, -30),
    ('musica/m2_ondas.mp3', 86.8, 176.0, 0, 1.5, 2.0, -32),
    ('musica/m3_arquivo.mp3', 174.2, 336.0, 0, 2.0, 1.5, -32),
    ('musica/m4_impacto.mp3', 334.6, 460.0, 0, 1.0, 2.0, -31),
    ('musica/m5_virada.mp3', 457.0, 561.5, 0, 1.5, 2.0, -31),
    ('musica/m6_fecho.mp3', 559.5, FIM, 0, 2.5, 3.0, -31),
]
MAP = {  # visual -> (efeito, volume, atraso)
 '3D:S01': ('espaco', 0.08, 0), '3D:A03': ('espaco', 0.07, 0), '3D:A18': ('espaco', 0.08, 0), '3D:A07': ('pix', 0.16, 0.5),
 '3D:S05': ('plasma', 0.16, 0.1), '3D:S14': ('plasma', 0.14, 0.1), '3D:S06': ('faisca', 0.16, 0.1), '3D:A11': ('aurora', 0.08, 0),
 '3D:S07': ('beep_sat', 0.06, 0.3), '3D:S08': ('espaco', 0.06, 0), '3D:A20': ('espaco', 0.06, 0), '3D:S09': ('espaco', 0.06, 0),
 'q_radio': ('estatica', 0.12, 0.8), 'q_aviao': ('estatica', 0.07, 0.4), 'q_protons': ('glitch', 0.1, 0.4), 'q_arquivo': ('gaveta', 0.16, 0.1),
 'ficha': ('papel', 0.12, 0.0), 'q_tratores': ('trator', 0.07, 0), 'q_plantadeira': ('trator', 0.07, 0), 'q_quebec': ('luz_pisca', 0.14, 0.7),
 'q_neve': ('neve', 0.09, 0), 'q_papel': ('fogo_papel', 0.14, 0.7), 'q_telegrafistas': ('telegrafo', 0.12, 0.2), 'q_aurora': ('aurora', 0.08, 0),
 'q_aurora_eua': ('aurora', 0.07, 0), 'q_pessoa_ceu': ('aurora', 0.07, 0), 'q_gps': ('glitch', 0.08, 0.9), 'q_celular_gps': ('beep_sat', 0.06, 0.2),
 'q_torres': ('glitch', 0.07, 1.2), 'q_transformador': ('zumbido', 0.1, 0), 'q_amperimetro': ('zumbido', 0.07, 0), 'q_itaipu': ('agua_represa', 0.09, 0),
 'q_amazonia': ('floresta', 0.09, 0), 'q_previsao_sul': ('chuva', 0.08, 0), 'q_satelites_caindo': ('glitch', 0.08, 0.6), 'q_floresta': ('floresta', 0.07, 0),
 'q_relogio_parede': ('tique', 0.14, 0.2), 'q_L1': ('beep_sat', 0.07, 0.6), 'q_hubble': ('beep_sat', 0.06, 0.3), 'q_ceu_sul': ('neve', 0.05, 0),
}
SFX = [('sfx/clarao.mp3', T_CLARAO - 0.05, 0.28), ('sfx/impacto.mp3', T_IMP - 0.1, 0.3), ('sfx/tique.mp3', 87.0, 0.12), ('sfx/tique.mp3', T_30, 0.16)]
SFX += [('sfx/tique.mp3', T_30 + k, 0.1) for k in (1, 2, 3)]
SFX += [('sfx/tique.mp3', x, 0.1) for x in (84.0, 85.0, 86.0)]
prev = None
for p in P:
    k = p['vis'] if p['vis'].startswith('3D') else p['vis'][3:].split(':')[0]
    if k != prev and k in MAP:
        f, v, dt = MAP[k]; SFX.append((f'sfx/{f}.mp3', p['t0'] + dt, v))
    if k == 'ficha' and k != prev: SFX.append(('sfx/carimbo.mp3', p['t0'] + 0.6, 0.16))
    if k == 'q_comentarios' and k != prev: SFX += [('sfx/pop.mp3', p['t0'] + 0.2 + i * 0.4, 0.08) for i in range(4)]
    if p['tela'] and not p['desc'].endswith('recorte)'): SFX.append(('sfx/pop.mp3', p['t0'] + 0.25, 0.06))
    prev = k
DUR = {'sfx/espaco.mp3': 4.5, 'sfx/aurora.mp3': 4.5, 'sfx/floresta.mp3': 4.5, 'sfx/trator.mp3': 3.5, 'sfx/zumbido.mp3': 3.5, 'sfx/chuva.mp3': 3.5, 'sfx/neve.mp3': 3.5}
SFX.sort(key=lambda x: x[1])
args = ['ffmpeg', '-y', '-loglevel', 'error', '-i', 'audio/voz_completa.wav']
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
subprocess.run(args, check=True); print('ok', len(SFX), 'efeitos', FIM)
