"""Ep. 4 "16:48": mapa de som (efeitos + intensidade da trilha) e prévia sem voz.
Os tempos aqui são ESTIMADOS (2,5 palavras/s). Quando chegar o MP3 da voz, os inícios
de cena passam a vir da transcrição (tempos de palavra) e tudo se reposiciona sozinho.
Rodar: python3 som_ep04.py  ->  previa-som-ep04.mp3
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
 ("Na relojoaria, a Rose descobriu quem era a visita.", [('relogio_bolso',0,-12),('whoosh_curto',0,-10)], 0.8,'tenso',False),
 ("Ela mesma, 30 anos mais velha.", [('soco','@mesma',-3),('papel','@velha',-7)], 1.2,'tenso',False),
 ("Vocês escolheram letra A.", [('whoosh',0,-5),('soco','@A',-3),('contador',0.3,-8)], 1.5,'tenso',True),
 ("A Rose confia e vai com ela.", [('sino','@vai',-6),('passos',0.4,-9)], 1,'calmo',False),
 ("As duas atravessam a cidade parada.", [('passos',0,-6),('passos',1.2,-6)], 1,'calmo',False),
 ("A velha segura o relógio de bolso como se fosse a coisa mais preciosa do mundo.", [('relogio_bolso',0.3,-8),('pop','@relógio',-8)], 1.2,'calmo',False),
 ("Esse relógio para o tempo enquanto tiver corda.", [('arrasto','@corda',-10),('beep','@corda+0.3',-10)], 1.4,'tenso',False),
 ("Eu dei corda pra 30 dias.", [('soco','@30',-5),('contador','@30',-9)], 1.4,'tenso',False),
 ("Elas param no alto da Rua das Flores", [('whoosh_curto',0,-9),('pop','@Flores',-8)], 1.8,'tenso',False),
 ("e a velha aponta pro ônibus, o ônibus da Rose.", [('onibus','@ônibus',-5),('pop','@Rose',-8)], 2,'tenso',False),
 ("Às 4:48, esse ônibus perde o freio,", [('soco','@4:48',-3),('carimbo','@freio',-4)], 2.4,'tenso',True),
 ("desce a ladeira inteira", [('subida',0,-8),('contador',0.2,-9)], 2.6,'tenso',False),
 ("e vai direto pra praça.", [('corte','@praça',-6),('soco','@praça',-4)], 2.8,'tenso',False),
 ("Naquele dia, eu tava dentro dele.", [('coracao',0.4,-5)], 1.2,'calmo',True),
 ("E depois daquele dia, tudo mudou.", [('tic','@mudou',-7)], 0.8,'calmo',False),
 ("Dentro do ônibus, gente congelada.", [('whoosh_curto',0,-10),('pop','@gente',-9),('pop','@congelada',-9)], 1.8,'tenso',True),
 ("O seu Jorge no volante,", [('papel','@Jorge',-7)], 1.8,'tenso',False),
 ("uma mãe com o filho no colo, dormindo.", [('papel','@mãe',-8)], 1.6,'tenso',False),
 ("E o freio, uma mangueira rachada pingando fluido no chão.", [('whoosh_curto','@freio',-9),('pop','@rachada',-7),('cafe','@pingando',-6),('beep','@chão',-10)], 2.4,'tenso',False),
 ("A gente tem vinte e três dias pra resolver isso.", [('tiquetaque',0,-11),('soco','@dias',-6)], 2.4,'tenso',False),
 ("A Rose lembra do bilhete:", [('foto','@bilhete',-6)], 2.2,'tenso',False),
 ("\"Volto pra buscar o relógio\",", [('mensagem',0,-10)], 2.2,'tenso',False),
 ("e mostra pra velha.", [('papel',0.2,-8)], 2.2,'tenso',False),
 ("A velha fica branca.", [('coracao',0,-3),('coracao',0.7,-3)], 2.6,'tenso',False),
 ("Essa letra não é minha.", [('corte','@minha',-6),('soco','@minha',-2)], 0,'tenso',True),
 ("Então quem mais tá acordado?", [('glitch','@acordado',-6),('contador',0.2,-9)], 2,'tenso',True),
 ("E no relógio de bolso, a corda cai mais rápido do que devia.", [('relogio_bolso',0,-7),('subida','@devia',-8)], 2.8,'tenso',False),
 ("Elas precisam escolher por onde começar.", [('whoosh_curto',0,-10),('soco','@começar',-5),('relogio_bolso',0.3,-10)], 2.6,'tenso',False),
 ("Letra A: consertar o freio do ônibus.", [('whoosh','@A',-6),('pop','@A+0.2',-6)], 2.6,'tenso',False),
 ("Letra B: tirar todo mundo de dentro do ônibus.", [('whoosh','@B',-6),('pop','@B+0.2',-6),('relogio_bolso',0.2,-10)], 2.6,'tenso',False),
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
    pontos.append((ini[24] - 0.05, 0, 'tenso', True))  # silêncio no "essa letra não é minha"
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
    ini, fim, PALAVRAS = alinha([c[0] for c in CENAS], os.path.join(AQUI, 'voz-ep04-palavras.json'))
    tmpv = os.path.join(AQUI, 'voz-48k.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(AQUI, 'voz-ep04.mp3'), '-ac', '2', '-ar', str(SR), tmpv], check=True)
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
    saida = os.path.join(AQUI, 'audio-final-ep04.wav')
    ganho = 0.0
    for _ in range(4):  # ajusta até cair em -11 LUFS com o limitador segurando o pico
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', bruto, '-af', f'{filt},volume={ganho}dB,alimiter=limit=0.84:attack=3:release=60:level=false', '-ar', str(SR), saida], check=True)
        r = subprocess.run(['ffmpeg', '-i', saida, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
        i_med = float(r.split('I:')[-1].split('LUFS')[0])
        if abs(i_med + 11) < 0.3: break
        ganho += (-11 - i_med)
    print('final', i_med, 'LUFS')
    print('voz', round(rv, 1), 'dB · duração', round(dur, 1), 's')


if __name__ == '__main__' and os.path.exists(os.path.join(AQUI, 'voz-ep04-palavras.json')):
    final_com_voz()
elif __name__ == '__main__':
    ini, dur = tempos_estimados()
    fx, mus = monta(ini, dur)
    mix = fx * 0.9 + mus * 0.8
    tmp = os.path.join(AQUI, 'previa-som-ep04.wav')
    wavfile.write(tmp, SR, (np.clip(mix / (np.abs(mix).max() + 1e-9) * 0.89, -1, 1).T * 32767).astype(np.int16))
    for nome, sinal in (('trilha', mus), ('efeitos', fx)):
        wavfile.write(os.path.join(AQUI, f'{nome}-ep04.wav'), SR, (np.clip(sinal / (np.abs(sinal).max() + 1e-9) * 0.89, -1, 1).T * 32767).astype(np.int16))
    json.dump({'inicio_cenas_estimado': [round(x, 2) for x in ini], 'duracao': round(dur, 2)}, open(os.path.join(AQUI, 'tempos-estimados.json'), 'w'), indent=1)
    print('duração estimada', round(dur, 1), 's')
