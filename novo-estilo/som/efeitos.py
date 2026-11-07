"""Gera a biblioteca de efeitos sonoros da série (novo-estilo/som/sfx/*.wav).
Cada efeito é sintetizado do zero. Rodar: python3 efeitos.py
Regra da casa: nada de grave contínuo; graves só em batidas curtas, com corte em 35-45 Hz.
"""
import os
import numpy as np
from sintese import *

OUT = os.path.join(os.path.dirname(__file__), 'sfx')
os.makedirs(OUT, exist_ok=True)
EF = {}


def ef(nome):
    def reg(fn):
        EF[nome] = fn
        return fn
    return reg


@ef('whoosh')  # cartão grande entrando
def whoosh(seed=0, d=0.5):
    n = ruido(d, seed)
    x = np.linspace(0, 1, len(n))
    cortes = 300 + 4500 * np.sin(np.pi * x) ** 1.5
    y = lp_variavel(n, cortes) * env_sino(d, 0.55, 2.2)
    return filtro(y, 'hp', 150)


@ef('whoosh_curto')  # movimento rápido de câmera
def whoosh_curto(seed=3):
    return whoosh(seed, 0.28)


@ef('pop')  # etiqueta aparecendo
def pop(seed=0):
    d = 0.09
    f = np.linspace(700, 1500, int(SR * d))
    s = seno(f, d) * env_exp(d, 0.025)
    clique = filtro(ruido(0.01, seed), 'hp', 3000) * env_exp(0.01, 0.002)
    s[:len(clique)] += clique * 0.5
    return s


@ef('papel')  # ficha deslizando + clipe
def papel(seed=1):
    d = 0.32
    n = filtro(ruido(d, seed), 'bp', (1800, 7000))
    flutter = 0.6 + 0.4 * np.sin(2 * np.pi * 34 * t(d))
    s = n * env_sino(d, 0.3, 1.5) * flutter * 0.6
    clip = filtro(ruido(0.02, seed + 9), 'bp', (2500, 6000)) * env_exp(0.02, 0.003)
    s = np.concatenate([s, np.zeros(int(SR * 0.04))])
    k = int(SR * 0.3)
    s[k:k + len(clip)] += clip * 1.4
    return s


@ef('carimbo')
def carimbo(seed=2):
    d = 0.3
    thump = seno(np.linspace(140, 70, int(SR * d)), d) * env_exp(d, 0.05)
    tapa = filtro(ruido(d, seed), 'lp', 1400) * env_exp(d, 0.02)
    return filtro(thump * 0.9 + tapa * 0.8, 'hp', 45)


@ef('soco')  # zoom rápido / impacto
def soco(seed=4):
    d = 0.55
    boom = seno(np.linspace(110, 46, int(SR * d)), d) * env_exp(d, 0.12)
    trans = filtro(ruido(d, seed), 'bp', (800, 6000)) * env_exp(d, 0.012)
    chicote = filtro(ruido(d, seed + 1), 'hp', 2500) * env_exp(d, 0.06) * 0.25
    return filtro(boom + trans * 0.9 + chicote, 'hp', 40)


@ef('tic')
def tic(seed=5, f=2600):
    d = 0.05
    n = filtro(ruido(d, seed), 'bp', (f * 0.7, f * 1.4)) * env_exp(d, 0.004)
    r = seno(f, d) * env_exp(d, 0.008) * 0.6
    return n + r


@ef('tac')
def tac(seed=6):
    return tic(seed, 1700)


@ef('tiquetaque')  # 4 s de relógio (tic-tac a cada 0,5 s)
def tiquetaque():
    d = 4.0
    s = np.zeros(int(SR * d))
    for i in range(8):
        e = tic(10 + i) if i % 2 == 0 else tac(20 + i)
        k = int(SR * 0.5 * i)
        s[k:k + len(e)] += e
    return s


@ef('congela')  # o mundo para: sobe e corta seco num tic
def congela(seed=8):
    d = 0.9
    sobe = filtro(ruido(d, seed), 'hp', 2500) * np.linspace(0, 1, int(SR * d)) ** 3
    desce = seno(np.linspace(880, 220, int(SR * d)), d) * np.linspace(0, 1, int(SR * d)) ** 2 * 0.3
    s = sobe * 0.6 + desce
    tk = tic(30) * 1.6
    return np.concatenate([s, tk, np.zeros(int(SR * 0.05))])


@ef('beep')  # cronômetro/medidor digital
def beep():
    d = 0.09
    s = signal.square(2 * np.pi * 2000 * t(d)) * 0.3 + seno(2000, d)
    return filtro(s, 'lp', 5000) * env_sino(d, 0.1, 1)


@ef('contador')  # números rolando
def contador(seed=9):
    d = 0.9
    s = np.zeros(int(SR * d))
    tempos = np.cumsum(np.linspace(0.07, 0.025, 26))
    for i, tm in enumerate(tempos):
        if tm >= d - 0.03: break
        c = tic(40 + i, 3200 + (i % 3) * 300) * 0.5
        k = int(SR * tm)
        s[k:k + len(c)] += c[:len(s) - k]
    return s


@ef('coracao')  # uma batida (tum-tum)
def coracao():
    d = 0.75
    def tum(f, a):
        dd = 0.18
        return (seno(np.linspace(f * 1.6, f, int(SR * dd)), dd) * env_exp(dd, 0.05) * a
                + filtro(ruido(dd, 3), 'lp', 300) * env_exp(dd, 0.02) * a * 0.4)
    s = np.zeros(int(SR * d))
    a, b = tum(62, 1.0), tum(55, 0.75)
    s[:len(a)] += a
    k = int(SR * 0.22)
    s[k:k + len(b)] += b
    return filtro(s, 'hp', 38)


@ef('onibus')  # freio a ar + motor curto
def onibus(seed=11):
    d = 1.4
    psss = filtro(ruido(d, seed), 'bp', (1500, 9000)) * env_sino(d, 0.12, 1.2) * 0.7
    tt = t(d)
    motor = filtro(signal.sawtooth(2 * np.pi * (95 + 4 * np.sin(2 * np.pi * 7 * tt)) * tt), 'lp', 600) * np.linspace(1, 0, len(tt)) ** 2 * 0.35
    return filtro(psss + motor, 'hp', 70)


@ef('pombo')  # bater de asas
def pombo(seed=12):
    d = 0.7
    s = np.zeros(int(SR * d))
    for i, tm in enumerate([0.0, 0.11, 0.22, 0.33, 0.44]):
        dd = 0.09
        b = filtro(ruido(dd, seed + i), 'bp', (350, 1800)) * env_sino(dd, 0.25, 1.4) * (1 - i * 0.12)
        k = int(SR * tm)
        s[k:k + len(b)] += b
    return s


@ef('cafe')  # líquido abafado
def cafe(seed=13):
    d = 0.6
    s = np.zeros(int(SR * d))
    g = np.random.default_rng(seed)
    for i in range(7):
        dd = g.uniform(0.04, 0.08)
        f0 = g.uniform(250, 500)
        b = seno(np.linspace(f0, f0 * 1.9, int(SR * dd)), dd) * env_sino(dd, 0.2, 1.5)
        k = int(SR * g.uniform(0, d - dd))
        s[k:k + len(b)] += b * 0.6
    return filtro(s, 'lp', 2500)


@ef('arrasto')
def arrasto(seed=14):
    d = 1.1
    n = filtro(ruido(d, seed), 'bp', (180, 900))
    grao = 0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 9 * t(d)))
    return filtro(n * grao * env_sino(d, 0.4, 1), 'hp', 120)


@ef('passos')  # escada com eco
def passos(seed=15):
    d = 1.5
    s = np.zeros(int(SR * d))
    for i in range(6):
        dd = 0.12
        p = (seno(np.linspace(180, 90, int(SR * dd)), dd) * env_exp(dd, 0.03)
             + filtro(ruido(dd, seed + i), 'bp', (600, 4000)) * env_exp(dd, 0.01) * 0.7)
        k = int(SR * 0.22 * i)
        s[k:k + len(p)] += p
    return filtro(eco(s, 0.13, 0.4, 4), 'hp', 70)


@ef('vibracao')  # celular vibrando
def vibracao():
    d = 1.0
    tt = t(d)
    zz = filtro(signal.square(2 * np.pi * 175 * tt) * 0.5 + signal.sawtooth(2 * np.pi * 350 * tt) * 0.3, 'lp', 1200)
    gate = ((tt % 0.5) < 0.32).astype(float)
    gate = filtro(gate, 'lp', 60)
    return filtro(zz * gate, 'hp', 110)


@ef('notificacao')
def notificacao():
    d = 0.7
    a = seno(880, d) * env_exp(d, 0.18)
    b = np.concatenate([np.zeros(int(SR * 0.12)), seno(1320, d - 0.12) * env_exp(d - 0.12, 0.2)])
    b = np.pad(b, (0, max(0, len(a) - len(b))))[:len(a)]
    return a * 0.6 + b * 0.6 + seno(2640, d) * env_exp(d, 0.05) * 0.1


@ef('glitch')  # "você não é a única acordada"
def glitch(seed=16):
    d = 0.8
    g = np.random.default_rng(seed)
    s = np.zeros(int(SR * d))
    k = 0
    while k < len(s):
        dd = int(SR * g.uniform(0.015, 0.06))
        f = g.uniform(300, 3000)
        bloco = (seno(f, dd / SR) * 0.5 + filtro(ruido(dd / SR, int(g.integers(1e6))), 'bp', (f * 0.6, min(f * 2, 20000))) * 0.6)
        bloco = np.round(bloco * 6) / 6  # esmaga bits
        if g.random() < 0.25: bloco *= 0
        s[k:k + dd] = bloco[:len(s) - k]
        k += dd
    return filtro(s * env_sino(d, 0.15, 0.8), 'hp', 150)


@ef('subida')  # tensão subindo (3 s), termina seco
def subida(seed=17):
    d = 3.0
    x = np.linspace(0, 1, int(SR * d))
    n = filtro(ruido(d, seed), 'hp', 1200) * x ** 2.5 * 0.5
    gl = (seno(220 * 2 ** (x * 2), d) + seno(220 * 2 ** (x * 2) * 1.5, d) * 0.5) * x ** 2 * 0.35
    trem = 0.6 + 0.4 * np.sin(2 * np.pi * (4 + 12 * x) * t(d))
    return filtro((n + gl) * trem, 'hp', 150)


@ef('corte')  # puxa o ar e corta (pra silêncio)
def corte(seed=18):
    d = 0.45
    x = np.linspace(0, 1, int(SR * d))
    return filtro(ruido(d, seed), 'bp', (500, 6000)) * x ** 3


@ef('rua_viva')  # 5 s de rua cheia antes de congelar
def rua_viva(seed=19):
    d = 5.0
    tt = t(d)
    burburinho = filtro(ruido(d, seed), 'bp', (300, 2500)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * tt) * np.sin(2 * np.pi * 1.3 * tt))
    trafego = filtro(ruido(d, seed + 1), 'bp', (120, 700)) * 0.5
    s = burburinho * 0.35 + trafego
    for (ini, dur, f) in [(0.8, 0.35, 420), (1.3, 0.25, 420), (3.1, 0.6, 330)]:
        dd = dur
        bz = filtro(signal.square(2 * np.pi * f * t(dd)) + signal.square(2 * np.pi * f * 1.26 * t(dd)), 'lp', 2500) * env_sino(dd, 0.05, 0.4) * 0.35
        k = int(SR * ini)
        s[k:k + len(bz)] += bz
    return filtro(s, 'hp', 110)


@ef('mensagem')  # texto da mensagem digitando
def mensagem(seed=20):
    d = 1.2
    s = np.zeros(int(SR * d))
    g = np.random.default_rng(seed)
    tm = 0.0
    while tm < d - 0.05:
        c = tic(int(g.integers(1e6)), g.uniform(3500, 4500)) * 0.35
        k = int(SR * tm)
        s[k:k + len(c)] += c[:len(s) - k]
        tm += g.uniform(0.05, 0.11)
    return s


if __name__ == '__main__':
    for nome, fn in EF.items():
        salva(os.path.join(OUT, nome + '.wav'), fn(), -3.0)
        print('ok', nome)
