"""Ep. 3 "O dono do relógio": mapa de som (efeitos + intensidade da trilha) e prévia sem voz.
Os tempos aqui são ESTIMADOS (2,5 palavras/s). Quando chegar o MP3 da voz, os inícios
de cena passam a vir da transcrição (tempos de palavra) e tudo se reposiciona sozinho.
Rodar: python3 som_ep03.py  ->  previa-som-ep03.mp3
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
 ("O mundo parou às 16h47.", [('congela','@parou',-3)], 0,'tenso',True),
 ("A Rose seguiu um rastro até uma relojoaria.", [('passos',0,-9),('pop','@relojoaria',-8)], 0.8,'tenso',False),
 ("Achou uma foto dela, tirada um minuto antes de tudo parar.", [('foto','@foto',-5),('carimbo','@minuto',-5)], 1,'tenso',False),
 ("E o sino da porta tocou.", [('sino','@tocou',-2)], 0,'tenso',True),
 ("Vocês escolheram letra A.", [('whoosh',0,-5),('soco','@A',-3),('contador',0.3,-8)], 1.5,'tenso',True),
 ("Ela se esconde e espera.", [('whoosh_curto','@esconde',-6)], 1.5,'tenso',False),
 ("A Rose se joga atrás do balcão,", [('soco','@joga',-6),('arrasto','@balcão',-8)], 2,'tenso',False),
 ("encolhida entre caixas de relógio velho.", [('pop','@caixas',-9),('pop','@velho',-9)], 1.8,'tenso',False),
 ("O coração bate tão alto que ela tem medo de ser ouvida.", [('coracao',0,-2),('coracao',0.75,-2),('coracao',1.5,-2),('coracao',2.25,-2),('beep',0.5,-11)], 1.2,'tenso',False),
 ("Passos devagar, pesados, vindo na direção do balcão.", [('passos',0,-4),('passos',1.3,-4),('beep','@direção',-11)], 2.2,'tenso',False),
 ("Pela fresta do balcão, a Rose vê só três coisas.", [('subida',0,-12),('contador','@três',-8)], 2.4,'tenso',False),
 ("Detalhe número um: um tênis branco,", [('whoosh',0,-5),('soco','@um',-5)], 2.4,'tenso',True),
 ("igualzinho ao dela, com a mesma mancha de água sanitária na ponta.", [('pop','@mancha',-7),('pop','@mancha+0.25',-7),('beep','@ponta',-10)], 2.4,'tenso',False),
 ("Detalhe número dois: no bolso, um par de luvas amarelas,", [('whoosh',0,-5),('soco','@dois',-5)], 2.4,'tenso',False),
 ("as mesmas luvas que a Rose usa na faxina.", [('carimbo','@mesmas',-4)], 2.5,'tenso',False),
 ("Detalhe número três: uma faixa amarela no cabelo.", [('whoosh',0,-5),('soco','@três',-5)], 2.6,'tenso',False),
 ("Só que o cabelo é branco.", [('corte','@branco',-6),('soco','@branco',-2)], 0,'tenso',True),
 ("A pessoa pega o relógio de bolso,", [('relogio_bolso',0.2,-8)], 1.4,'tenso',True),
 ("olha a hora, sorri e fala sem nem olhar pro balcão:", [('relogio_bolso',0,-10)], 1.4,'tenso',False),
 ("\"Pode sair, Rose. Eu sei que você tá aí.", [('soco','@Rose',-3),('coracao','@sei',-2)], 2.6,'tenso',False),
 ("Eu sabia que você ia se esconder.\"", [('glitch','@esconder',-8)], 2.6,'tenso',False),
 ("A Rose levanta devagar", [('rangido',0,-9)], 1.6,'tenso',True),
 ("e dá de cara com uma senhora de uns sessenta anos.", [('soco','@senhora',-4)], 2,'tenso',False),
 ("Os mesmos olhos, o mesmo nariz, as mesmas argolas.", [('pop','@olhos',-7),('pop','@nariz',-7),('pop','@argolas',-7)], 2,'tenso',False),
 ("É ela, a Rose, trinta anos mais velha.", [('soco','@ela',-3),('papel','@trinta',-7),('carimbo','@velha',-4)], 2.8,'tenso',False),
 ("\"Fui eu que parei o tempo.", [('tic','@tempo',-5)], 1.5,'tenso',True),
 ("Às 16h48, uma coisa ia acontecer com você", [('beep','@16h48',-8),('soco','@16h48',-5)], 2.2,'tenso',False),
 ("e só você pode mudar isso.\"", [('coracao',0.2,-4)], 2.2,'tenso',False),
 ("E o relógio de bolso começa a andar mais rápido.", [('relogio_bolso',0,-8),('subida','@rápido',-8)], 2.8,'tenso',False),
 ("Não temos muito tempo.", [('soco','@tempo',-4)], 3,'tenso',False),
 ("A Rose tem que decidir agora.", [('whoosh_curto',0,-10),('soco','@agora',-5),('relogio_bolso',0.3,-10)], 2.6,'tenso',False),
 ("Letra A: ela confia na Rose mais velha e vai com ela.", [('whoosh','@A',-6),('pop','@A+0.2',-6),('relogio_bolso',0.4,-10)], 2.6,'tenso',False),
 ("Letra B: ela não acredita, pega o relógio e foge.", [('whoosh','@B',-6),('pop','@B+0.2',-6),('relogio_bolso',0.4,-10)], 2.6,'tenso',False),
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
    pontos.append((ini[16] - 0.05, 0, 'tenso', True))  # silêncio no "cabelo é branco"
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
    ini, fim, PALAVRAS = alinha([c[0] for c in CENAS], os.path.join(AQUI, 'voz-ep03-palavras.json'))
    tmpv = os.path.join(AQUI, 'voz-48k.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(AQUI, 'voz-ep03.mp3'), '-ac', '2', '-ar', str(SR), tmpv], check=True)
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
    saida = os.path.join(AQUI, 'audio-final-ep03.wav')
    ganho = 0.0
    for _ in range(4):  # ajusta até cair em -11 LUFS com o limitador segurando o pico
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', bruto, '-af', f'{filt},volume={ganho}dB,alimiter=limit=0.84:attack=3:release=60:level=false', '-ar', str(SR), saida], check=True)
        r = subprocess.run(['ffmpeg', '-i', saida, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
        i_med = float(r.split('I:')[-1].split('LUFS')[0])
        if abs(i_med + 11) < 0.3: break
        ganho += (-11 - i_med)
    print('final', i_med, 'LUFS')
    print('voz', round(rv, 1), 'dB · duração', round(dur, 1), 's')


if __name__ == '__main__' and os.path.exists(os.path.join(AQUI, 'voz-ep03-palavras.json')):
    final_com_voz()
elif __name__ == '__main__':
    ini, dur = tempos_estimados()
    fx, mus = monta(ini, dur)
    mix = fx * 0.9 + mus * 0.8
    tmp = os.path.join(AQUI, 'previa-som-ep03.wav')
    wavfile.write(tmp, SR, (np.clip(mix / (np.abs(mix).max() + 1e-9) * 0.89, -1, 1).T * 32767).astype(np.int16))
    for nome, sinal in (('trilha', mus), ('efeitos', fx)):
        wavfile.write(os.path.join(AQUI, f'{nome}-ep03.wav'), SR, (np.clip(sinal / (np.abs(sinal).max() + 1e-9) * 0.89, -1, 1).T * 32767).astype(np.int16))
    json.dump({'inicio_cenas_estimado': [round(x, 2) for x in ini], 'duracao': round(dur, 2)}, open(os.path.join(AQUI, 'tempos-estimados.json'), 'w'), indent=1)
    print('duração estimada', round(dur, 1), 's')
