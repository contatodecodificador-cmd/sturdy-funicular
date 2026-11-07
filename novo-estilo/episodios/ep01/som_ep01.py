"""Ep. 1 "16:47": mapa de som (efeitos + intensidade da trilha) e prévia sem voz.
Os tempos aqui são ESTIMADOS (2,5 palavras/s). Quando chegar o MP3 da voz, os inícios
de cena passam a vir da transcrição (tempos de palavra) e tudo se reposiciona sozinho.
Rodar: python3 som_ep01.py  ->  previa-som-ep01.mp3
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
 ("Imagina sair do serviço às quatro e quarenta e cinco…", [('rua_viva',0,-4),('pop',0.3,-8),('papel',1.2,-6)], 0,'tenso',True),
 ("…e o mundo inteiro parar.", [('congela',-0.2,-2),('carimbo',1.0,-4)], 0,'tenso',True),
 ("O ônibus dela para no meio da rua.", [('whoosh_curto',0,-10),('onibus',0.1,-4),('pop',0.7,-8),('papel',1.3,-7)], 0,'tenso',True),
 ("Um pombo para no ar.", [('pombo',0,-6),('pop',0.7,-8)], 0,'tenso',True),
 ("O café da Priscila para a dois dedos da boca.", [('papel',0.2,-7),('beep',1.3,-10)], 0,'tenso',True),
 ("Oito bilhões de pessoas param no mesmo segundo.", [('whoosh_curto',0,-10),('contador',0.3,-6)], 1,'tenso',False),
 ("Menos uma.", [('soco',0,-2)], 1.4,'tenso',True),
 ("E essa uma é você, Rose.", [('coracao',0.2,-4),('beep',0.8,-11)], 1.4,'tenso',False),
 ("Sem buzina. Sem vento. Sem nada.", [('whoosh_curto',0,-12),('beep',1.0,-11)], 0.8,'tenso',False),
 ("Só o barulho do seu coração.", [('coracao',0,-2),('coracao',0.85,-2),('beep',0.5,-11)], 0.8,'tenso',False),
 ("Teste número um: as coisas.", [('whoosh',0,-5),('soco',0.4,-6)], 1.5,'tenso',True),
 ("Ela empurra o café de volta pro copo.", [('cafe',0.4,-5),('pop',0.9,-8),('beep',1.4,-11)], 1.5,'tenso',False),
 ("E ele fica onde ela deixou.", [('carimbo',0.7,-4)], 1.5,'tenso',False),
 ("Teste número dois: as pessoas.", [('whoosh',0,-5),('soco',0.4,-6)], 2,'tenso',False),
 ("Seu João tá a um passo de uma bicicleta.", [('whoosh_curto',0,-11),('papel',0.3,-7),('beep',1.4,-10)], 2,'tenso',False),
 ("Ela segura o braço dele. Frio. Duro feito estátua.", [('carimbo',1.2,-4),('pop',2.0,-8)], 2,'tenso',False),
 ("Ela muda ele de lugar. Dois metros.", [('arrasto',0.2,-5),('beep',1.2,-10)], 2,'tenso',False),
 ("Teste número três: até onde vai isso.", [('whoosh',0,-5),('soco',0.4,-6)], 2.3,'tenso',False),
 ("Vinte e dois andares de escada.", [('passos',0,-5),('contador',0.5,-8)], 2.3,'tenso',False),
 ("Avião parado no céu. Fumaça parada nas chaminés.", [('whoosh_curto',0,-11),('pop',0.3,-8),('pop',1.3,-8)], 2.5,'tenso',False),
 ("E o sol… parado. Às quatro e quarenta e sete. Pra sempre.", [('pop',0.6,-8),('soco',2.6,-5)], 2.6,'tenso',False),
 ("No relógio do mundo, nada muda.", [('tic',0.3,-6)], 1,'calmo',True),
 ("No relógio da Rose, dia três.", [('whoosh',0,-6),('soco',0.4,-9),('tiquetaque',0.6,-10)], 1.2,'calmo',False),
 ("Ela come pão na padaria e deixa o dinheiro no caixa.", [('papel',0.3,-7),('pop',1.0,-8),('contador',1.8,-8)], 1.2,'calmo',False),
 ("Dorme no sofá mais caro da loja.", [('pop',0.7,-8)], 1.2,'calmo',False),
 ("Pela primeira vez na vida, ninguém manda nela.", [('pop',0.4,-9),('pop',0.8,-9),('pop',1.2,-9)], 1.2,'calmo',False),
 ("Dia cinco. Ela conversa com a Dona Dunha.", [('whoosh',0,-6),('soco',0.35,-9),('papel',1.0,-7)], 1,'calmo',False),
 ("A Dona Dunha não responde. Nunca.", [('beep',1.0,-11)], 0.8,'tenso',False),
 ("Dia sete.", [('whoosh',0,-6),('soco',0.35,-6),('tiquetaque',0.5,-10)], 1,'tenso',False),
 ("E o silêncio começa a pesar.", [('beep',0.7,-11)], 0.7,'tenso',False),
 ("Até que ela passa de novo pela rua do ponto.", [('whoosh_curto',0,-10),('pop',0.8,-8),('passos',0.2,-12)], 1.5,'tenso',False),
 ("E o Seu João não tá mais onde ela deixou.", [('soco',1.0,-2),('carimbo',1.6,-4)], 2.2,'tenso',False),
 ("Ele tá de volta na frente da bicicleta.", [('whoosh_curto',0,-9),('pop',0.7,-8)], 2.5,'tenso',False),
 ("Olhando pra ela.", [('coracao',0,-3),('pop',0.5,-9)], 2.6,'tenso',False),
 ("No bolso dele, um celular acende.", [('vibracao',0.5,-6),('pop',0.8,-8)], 2.6,'tenso',False),
 ("Uma mensagem. Pra ela.", [('notificacao',0.2,-6)], 2.6,'tenso',False),
 ("\"O tempo volta em trinta dias.\"", [('mensagem',0,-8),('contador',1.0,-8),('subida',0.4,-7)], 2.8,'tenso',False),
 ("\"Tudo o que você mudar vai ficar.\"", [('pop',0.4,-8),('pop',0.8,-8),('pop',1.2,-8)], 3,'tenso',False),
 ("\"E você não é a única acordada.\"", [('glitch',1.0,-5),('soco',1.4,-1)], 3,'tenso',False),
 ("Vinte e três dias. Um mundo parado. E alguém te observando.", [('whoosh_curto',0,-12),('tiquetaque',0.3,-11)], 1.2,'tenso',True),
 ("O que você faria?", [('corte',0.6,-6)], 1,'tenso',False),
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


def monta(ini, dur):
    n = int(SR * dur)
    fx = np.zeros((2, n))
    pan = 0.0
    for (txt, efs, *_), t0 in zip(CENAS, ini):
        for nome, at, db in efs:
            s = carrega(nome) * 10 ** (db / 20)
            k = max(0, int(SR * (t0 + at)))
            seg = s[:max(0, n - k)]
            pan = -pan if pan else 0.2
            fx[0, k:k + len(seg)] += seg * (1 - pan)
            fx[1, k:k + len(seg)] += seg * (1 + pan)
    pontos = [(t0, c[2], c[3], c[4]) for c, t0 in zip(CENAS, ini)]
    pontos.append((ini[38] + 1.5, 0, 'tenso', True))  # silêncio seco depois de "única acordada"
    pontos.append((ini[-1] + 2.2, 0, 'tenso', True))  # corte seco no final
    pontos.sort(key=lambda p: p[0])
    mus = gera_trilha(dur, pontos)
    return fx, mus


if __name__ == '__main__':
    ini, dur = tempos_estimados()
    fx, mus = monta(ini, dur)
    mix = fx * 0.9 + mus * 0.8
    tmp = os.path.join(AQUI, 'previa-som-ep01.wav')
    wavfile.write(tmp, SR, (np.clip(mix / (np.abs(mix).max() + 1e-9) * 0.89, -1, 1).T * 32767).astype(np.int16))
    for nome, sinal in (('trilha', mus), ('efeitos', fx)):
        wavfile.write(os.path.join(AQUI, f'{nome}-ep01.wav'), SR, (np.clip(sinal / (np.abs(sinal).max() + 1e-9) * 0.89, -1, 1).T * 32767).astype(np.int16))
    json.dump({'inicio_cenas_estimado': [round(x, 2) for x in ini], 'duracao': round(dur, 2)}, open(os.path.join(AQUI, 'tempos-estimados.json'), 'w'), indent=1)
    print('duração estimada', round(dur, 1), 's')
