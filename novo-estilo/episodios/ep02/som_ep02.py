"""Ep. 2 "O rastro na poeira": mapa de som (efeitos + intensidade da trilha) e prévia sem voz.
Os tempos aqui são ESTIMADOS (2,5 palavras/s). Quando chegar o MP3 da voz, os inícios
de cena passam a vir da transcrição (tempos de palavra) e tudo se reposiciona sozinho.
Rodar: python3 som_ep02.py  ->  previa-som-ep02.mp3
"""
import os, sys, json, subprocess
import numpy as np
from scipy.io import wavfile
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, '..', '..', 'som'))
from sintese import SR, filtro
from trilha import gera_trilha

# (narração, [(efeito, atraso_s, ganho_dB)], nível_trilha, clima, corte_seco)
CENAS = [
 ("Às 4h47, o mundo parou.", [('congela','@parou',-3),('carimbo','@parou+0.3',-6)], 0,'tenso',True),
 ("Só a Rose se mexe.", [('whoosh_curto',0,-10),('coracao',0.3,-6)], 0.6,'tenso',False),
 ("E uma mensagem disse: \"Você não é a única acordada.\"", [('notificacao',0.1,-8),('glitch','@acordada',-7)], 0.8,'tenso',False),
 ("Agora ela sabe. Tem alguém andando por aí.", [('whoosh_curto',0,-10),('contador','@alguém',-8)], 1.2,'tenso',False),
 ("E esse alguém sabe o nome dela.", [('papel',0.2,-7),('carimbo','@nome',-4)], 1.4,'tenso',False),
 ("Pista número um: a mensagem.", [('whoosh',0,-5),('soco',0.4,-6)], 1.5,'tenso',True),
 ("No celular, o horário da mensagem, 4h47.", [('pop','@horário',-8),('beep','@4h47',-10)], 1.5,'tenso',False),
 ("Mas desde que o tempo parou, todo relógio do mundo marca 4h47.", [('tic',0.3,-6),('carimbo','@marca',-4)], 1.5,'tenso',False),
 ("Ou seja, quem mandou tava acordado, aqui dentro, com ela.", [('coracao','@acordado',-4),('beep','@dentro',-11)], 1.8,'tenso',False),
 ("Pista número dois: a poeira.", [('whoosh',0,-5),('soco',0.4,-6)], 1.8,'tenso',False),
 ("A poeira da rua tá parada no ar desde o primeiro dia,", [('whoosh_curto',0,-12),('pop','@parada',-8)], 1.6,'tenso',False),
 ("mas na frente da padaria tem um buraco nela,", [('pop','@buraco',-7),('soco','@buraco',-8)], 2,'tenso',False),
 ("do tamanho de uma pessoa.", [('beep','@pessoa',-10),('contador',0.1,-10)], 2,'tenso',False),
 ("Alguém passou por aqui depois que o tempo parou.", [('carimbo','@depois',-4)], 2.2,'tenso',False),
 ("Pista número três: o caminho.", [('whoosh',0,-5),('soco',0.4,-6)], 2.2,'tenso',False),
 ("Rose segue os buracos na poeira.", [('passos',0,-7),('contador',0.4,-9)], 2,'tenso',False),
 ("Praça, ponte, rua de trás,", [('pop','@praça',-7),('papel','@praça+0.2',-9),('pop','@ponte',-7),('papel','@ponte+0.2',-9),('pop','@rua',-7)], 2,'tenso',False),
 ("dois quilômetros e meio.", [('contador',0,-7)], 2,'tenso',False),
 ("O rastro termina numa porta,", [('passos',0,-10),('rangido','@porta',-6)], 2.2,'tenso',False),
 ("uma relojoaria.", [('pop',0.3,-8)], 2.2,'tenso',False),
 ("Lá dentro, a parede inteira coberta de relógios,", [('whoosh_curto',0,-11),('contador','@coberta',-8)], 1.2,'tenso',True),
 ("todos marcando 4h47.", [('tic',0.1,-6),('pop',0.3,-9),('pop',0.6,-9),('pop',0.9,-9)], 1.2,'tenso',False),
 ("Menos um.", [('soco','@um',-3)], 1.5,'tenso',False),
 ("Um relógio de bolso, em cima do balcão, andando.", [('relogio_bolso',0.2,-8)], 1.8,'tenso',False),
 ("Tic, tac.", [('relogio_bolso',0,-4)], 1.8,'tenso',False),
 ("Atrás do balcão, o seu Aurélio, congelado,", [('papel','@Aurélio',-7),('carimbo','@congelado',-6)], 2,'tenso',False),
 ("com a mão estendida, como se tivesse acabado de entregar alguma coisa.", [('pop','@mão',-8)], 2.2,'tenso',False),
 ("Embaixo do relógio, uma foto.", [('foto','@foto',-5)], 2.4,'tenso',False),
 ("Uma foto da Rose,", [('soco','@Rose',-3)], 2.6,'tenso',False),
 ("tirada na segunda-feira, às 4h46,", [('carimbo','@4h46',-3)], 2.6,'tenso',False),
 ("um minuto antes do mundo parar. Alguém já tava vigiando a Rose.", [('coracao',0.3,-4),('coracao',1.2,-4),('beep','@vigiando',-10)], 2.8,'tenso',False),
 ("E no verso, uma frase escrita à mão:", [('foto',0.3,-7)], 2.8,'tenso',False),
 ("\"Volto pra buscar o relógio\".", [('mensagem',0,-10),('subida','@relógio',-8)], 3,'tenso',False),
 ("E nesse exato segundo, o sino da porta toca.", [('corte','@sino',-8),('sino','@toca',-1)], 0,'tenso',True),
 ("Alguém tá entrando.", [('rangido',0,-5),('passos',0.3,-9)], 2,'tenso',True),
 ("A Rose tem dez segundos.", [('whoosh_curto',0,-10),('soco','@dez',-5),('relogio_bolso',0.3,-10)], 2.6,'tenso',False),
 ("Letra A: ela se esconde e espera pra ver quem é. Letra B: pega o relógio e foge pelos fundos.", [('whoosh','@A',-6),('pop','@A+0.2',-6),('whoosh','@B',-6),('pop','@B+0.2',-6),('relogio_bolso',0.5,-10),('relogio_bolso',4.5,-10)], 2.6,'tenso',False),
 ("Comenta A ou B.", [('soco',0,-6),('corte','@B',-8)], 2,'tenso',False),
]
PAUSA = 0.35  # respiro entre cenas


def tempos_estimados():
    t, ini = 0.3, []
    for txt, *_ in CENAS:
        ini.append(t)
        t += len(txt.replace('…', ' ').split()) / 2.5 + PAUSA
    return ini, t + 1.0


def carrega(nome, cache={}):
    if nome not in cache:
        sr, x = wavfile.read(os.path.join(AQUI, '..', '..', 'som', 'sfx', nome + '.wav'))
        cache[nome] = x.astype(np.float32) / 32767
    return cache[nome]


IMPACTO = {'congela': 0.9, 'subida': 3.0, 'corte': 0.45}  # onde o som "bate" dentro do arquivo
PALAVRAS = []


def quando(t0, t1, at, nome):
    if isinstance(at, (int, float)):
        return t0 + at
    alvo, extra = at[1:], 0.0
    if '+' in alvo:
        alvo, e = alvo.split('+'); extra = float(e)
    from alinha import norm
    for p in PALAVRAS:
        if t0 - 0.05 <= p['s'] <= t1 + 0.05 and norm(p['w']) == norm(alvo):
            return p['s'] - IMPACTO.get(nome, 0.0) + extra
    return t0 - IMPACTO.get(nome, 0.0) + extra


def monta(ini, dur, fim=None):
    n = int(SR * dur)
    fx = np.zeros((2, n))
    pan = 0.0
    fim = fim or [t + 3 for t in ini]
    for (txt, efs, *_), t0, t1 in zip(CENAS, ini, fim):
        for nome, at, db in efs:
            s = carrega(nome) * 10 ** (db / 20)
            k = max(0, int(SR * quando(t0, t1, at, nome)))
            seg = s[:max(0, n - k)]
            pan = -pan if pan else 0.2
            fx[0, k:k + len(seg)] += seg * (1 - pan)
            fx[1, k:k + len(seg)] += seg * (1 + pan)
    pontos = [(t0, c[2], c[3], c[4]) for c, t0 in zip(CENAS, ini)]
    pontos.append((ini[33] + 0.05, 0, 'tenso', True))  # silêncio antes do sino
    pontos.append((ini[-1] + 2.2, 0, 'tenso', True))  # corte seco no final
    pontos.sort(key=lambda p: p[0])
    mus = gera_trilha(dur, pontos, camadas=('tique',))  # dono pediu: só o tique-taque, sem música (2026-11-07)
    return fx, mus


def lufs(x):
    import pyloudnorm as pyln
    return pyln.Meter(SR).integrated_loudness(x.T if x.ndim == 2 else x)


def rms_ativo_db(x):
    """RMS em todas as frequências (sem ponderação), só nos trechos com som."""
    m = x.mean(0) if x.ndim == 2 else x
    b = m[: len(m) // 2400 * 2400].reshape(-1, 2400)
    r = np.sqrt((b ** 2).mean(1))
    r = r[r > r.max() * 10 ** (-40 / 20)]
    return 20 * np.log10(np.sqrt((r ** 2).mean()) + 1e-12)


def final_com_voz():
    from alinha import alinha
    global PALAVRAS
    ini, fim, PALAVRAS = alinha([c[0] for c in CENAS], os.path.join(AQUI, 'voz-ep02-palavras.json'))
    tmpv = os.path.join(AQUI, 'voz-48k.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(AQUI, 'voz-ep02.mp3'), '-ac', '2', '-ar', str(SR), tmpv], check=True)
    voz = wavfile.read(tmpv)[1].astype(np.float64).T / 32767
    voz = filtro(voz, 'hp', 70)
    dur = voz.shape[1] / SR + 0.6
    fx, mus = monta(ini, dur, fim)
    n = int(SR * dur)
    voz = np.pad(voz, ((0, 0), (0, n - voz.shape[1])))
    voz *= 10 ** ((-16 - lufs(voz)) / 20)                       # voz em -16 LUFS
    rv = rms_ativo_db(voz)
    fx *= 10 ** ((rv - 15 - rms_ativo_db(fx)) / 20)             # efeitos 15 dB abaixo (todas as frequências)
    mus *= 10 ** ((rv - 26 - rms_ativo_db(mus)) / 20)           # tique-taque bem baixinho, ~26 dB abaixo da voz
    mix = voz + fx + mus
    bruto = os.path.join(AQUI, 'mix-bruto.wav')
    wavfile.write(bruto, SR, (np.clip(mix / max(1, np.abs(mix).max()), -1, 1).T * 32767).astype(np.int16))
    json.dump({'inicio_cenas': [round(x, 3) for x in ini], 'fim_cenas': [round(x, 3) for x in fim], 'duracao': round(dur, 3),
               'palavras': PALAVRAS}, open(os.path.join(AQUI, 'tempos-reais.json'), 'w'), ensure_ascii=False, indent=1)
    # volume final -11 LUFS, pico abaixo de -1 dB (loudnorm em 2 passadas)
    r = subprocess.run(['ffmpeg', '-i', bruto, '-af', 'loudnorm=I=-11:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = json.loads(r[r.rfind('{'):r.rfind('}') + 1])
    filt = (f"loudnorm=I=-11:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
            f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    saida = os.path.join(AQUI, 'audio-final-ep02.wav')
    ganho = 0.0
    for _ in range(4):  # ajusta até cair em -11 LUFS com o limitador segurando o pico
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', bruto, '-af', f'{filt},volume={ganho}dB,alimiter=limit=0.84:attack=3:release=60:level=false', '-ar', str(SR), saida], check=True)
        r = subprocess.run(['ffmpeg', '-i', saida, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
        i_med = float(r.split('I:')[-1].split('LUFS')[0])
        if abs(i_med + 11) < 0.3: break
        ganho += (-11 - i_med)
    print('final', i_med, 'LUFS')
    print('voz', round(rv, 1), 'dB · duração', round(dur, 1), 's')


if __name__ == '__main__' and os.path.exists(os.path.join(AQUI, 'voz-ep02-palavras.json')):
    final_com_voz()
elif __name__ == '__main__':
    ini, dur = tempos_estimados()
    fx, mus = monta(ini, dur)
    mix = fx * 0.9 + mus * 0.8
    tmp = os.path.join(AQUI, 'previa-som-ep02.wav')
    wavfile.write(tmp, SR, (np.clip(mix / (np.abs(mix).max() + 1e-9) * 0.89, -1, 1).T * 32767).astype(np.int16))
    for nome, sinal in (('trilha', mus), ('efeitos', fx)):
        wavfile.write(os.path.join(AQUI, f'{nome}-ep02.wav'), SR, (np.clip(sinal / (np.abs(sinal).max() + 1e-9) * 0.89, -1, 1).T * 32767).astype(np.int16))
    json.dump({'inicio_cenas_estimado': [round(x, 2) for x in ini], 'duracao': round(dur, 2)}, open(os.path.join(AQUI, 'tempos-estimados.json'), 'w'), indent=1)
    print('duração estimada', round(dur, 1), 's')
