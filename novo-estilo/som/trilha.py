"""Trilha de tensão da série "O Tempo Parou", gerada por código (original).
A intensidade segue um mapa de pontos (tempo, nível 0..3, clima) e cresce conforme a tensão da história.
  nível 0 = silêncio · 1 = tique de relógio + pad baixo · 2 = + ostinato dedilhado + pulso curto · 3 = + cordas tremulando
  clima 'tenso' (Ré menor, termina no Lá maior) ou 'calmo' (Si bemol maior, pras partes de respiro).
Regra da casa: corte em 150 Hz no pad, nada de grave contínuo; o pulso grave é curto e só no nível 2+.
"""
import numpy as np
from sintese import SR, seno, filtro, env_exp, pluck, ruido

BPM = 96
BEAT = 60 / BPM
NOTA = lambda n: 440 * 2 ** ((n - 69) / 12)  # número MIDI -> Hz

ACORDES = {
    'tenso': [[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52]],  # Dm Bb Gm A
    'calmo': [[46, 50, 53], [41, 45, 48], [43, 46, 50], [41, 45, 48]],  # Bb F Gm F
}


def curva(pontos, n):
    """pontos: lista de (t, nivel, clima, corte). corte=True muda na hora; senão rampa de 0,6 s."""
    nivel = np.zeros(n)
    clima = np.zeros(n)  # 0 tenso, 1 calmo
    ts = [int(p[0] * SR) for p in pontos] + [n]
    atual = 0.0
    for i, p in enumerate(pontos):
        a, b = ts[i], min(ts[i + 1], n)
        if a >= n: break
        alvo = p[1]
        rampa = 1 if (len(p) > 3 and p[3]) else int(0.6 * SR)
        seg = np.full(b - a, alvo, dtype=float)
        r = min(rampa, b - a)
        seg[:r] = np.linspace(atual, alvo, r)
        nivel[a:b] = seg
        clima[a:b] = 1.0 if p[2] == 'calmo' else 0.0
        atual = alvo
    return nivel, clima


def pad(acorde, d):
    x = np.zeros(int(SR * d))
    for nota in acorde:
        f = NOTA(nota + 12)
        for det in (-0.12, 0.0, 0.11):
            for h in range(1, 9):
                x += seno(f * (1 + det / 100 * 12) * h, d, fase=h * 0.7) / h * 0.08
    x = filtro(x, 'lp', 1600)
    e = np.minimum(1, np.linspace(0, 6, len(x))) * np.minimum(1, np.linspace(6, 0, len(x)))
    return x * e


def gera_trilha(duracao, pontos, camadas=('pad', 'tique', 'dedilhado', 'pulso', 'cordas')):
    n = int(SR * duracao)
    nivel, clima = curva(pontos, n)
    L = np.zeros((2, n))
    batidas = int(duracao / BEAT) + 1
    cache = {}

    def soma(canal_pan, sinal, k, ganho):
        if k >= n: return
        seg = sinal[:n - k] * ganho
        L[0, k:k + len(seg)] += seg * (1 - canal_pan)
        L[1, k:k + len(seg)] += seg * (1 + canal_pan)

    # pad por compasso de 2 (8 batidas)
    bloco = 8 * BEAT
    for b in range(int(duracao / bloco) + 1):
        k = int(b * bloco * SR)
        if k >= n: break
        lv, cl = nivel[k], clima[k]
        if lv <= 0.01 and (k + int(bloco * SR) >= n or nivel[min(n - 1, k + int(bloco * SR) - 1)] <= 0.01):
            continue
        if 'pad' not in camadas: continue
        ac = ACORDES['calmo' if cl > 0.5 else 'tenso'][b % 4]
        p = pad(ac, bloco + 1.0)
        env = nivel[k:k + len(p)]
        env = np.pad(env, (0, len(p) - len(env)))
        soma(0.0, p * np.clip(env, 0, 3) / 3, k, 0.55)

    for i in range(batidas):
        k = int(i * BEAT * SR)
        if k >= n: break
        lv, cl = nivel[k], clima[k]
        if lv < 0.3: continue
        ac = ACORDES['calmo' if cl > 0.5 else 'tenso'][(i // 8) % 4]
        # 1) tique de relógio em toda batida (alternando tic/tac)
        f = 2600 if i % 2 == 0 else 1800
        tk = (filtro(ruido(0.04, i), 'bp', (f * 0.7, f * 1.4)) * env_exp(0.04, 0.004)
              + seno(f, 0.04) * env_exp(0.04, 0.006) * 0.5)
        if 'tique' in camadas: soma(0.25 if i % 2 else -0.25, tk, k, 0.10 * min(lv, 1.5))
        # 2) ostinato dedilhado em colcheias (nível 1.5+)
        if lv >= 1.4 and 'dedilhado' in camadas:
            padrao = [0, 2, 1, 2]
            for c in range(2):
                nota = ac[padrao[(i * 2 + c) % 4]] + 24
                if nota not in cache: cache[nota] = pluck(NOTA(nota), 0.5, 0.4, seed=nota)
                soma(-0.35 if c else 0.35, cache[nota], k + int(c * BEAT / 2 * SR), 0.16 * min(1, lv - 1.2))
        # 3) pulso curto (nível 2+) nas batidas 1 e 3
        if lv >= 1.9 and i % 2 == 0 and cl < 0.5 and 'pulso' in camadas:
            d = 0.22
            pulso = filtro(seno(np.linspace(120, 62, int(SR * d)), d) * env_exp(d, 0.06), 'hp', 45)
            soma(0.0, pulso, k, 0.28 * min(1, lv - 1.7))
    # 4) cordas tremulando (nível 2.5+)
    tt = np.arange(n) / SR
    alto = np.clip(nivel - 2.3, 0, 0.7) / 0.7
    if alto.max() > 0 and 'cordas' in camadas:
        f = NOTA(74) * (1 + 0.003 * np.sin(2 * np.pi * 5 * tt))
        corda = (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.5 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR))
        corda *= (0.55 + 0.45 * np.sin(2 * np.pi * 13 * tt)) * alto * 0.10
        L[0] += corda
        L[1] += corda
    # silêncio absoluto onde nível = 0
    L *= np.clip(nivel / 0.3, 0, 1)
    return filtro(L, 'hp', 60)
