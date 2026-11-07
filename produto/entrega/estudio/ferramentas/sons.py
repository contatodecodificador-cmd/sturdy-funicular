"""Cria efeitos sonoros do zero (sem baixar nada de ninguém) e salva em public/sons/.

Uso:
    python3 ferramentas/sons.py            # cria todos
    python3 ferramentas/sons.py sino pop   # cria só alguns

Efeitos prontos: clique, batida, sino, pop, whoosh, passo, porta, tique, ambiente.
Para criar um efeito novo, escreva uma função parecida com as de baixo e coloque no dicionário EFEITOS.

Regras que protegem o ouvido de quem assiste (valem para efeitos novos também):
- nada de grave contínuo (zumbido): depois do volume final ele vira chiado no celular;
- grave só em batida curta, e tudo abaixo de 40 Hz é cortado;
- cada efeito termina suave (sem estalo no fim).
"""
import sys
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

TAXA = 44100
PASTA = Path(__file__).resolve().parent.parent / "public" / "sons"


def t(seg):
    return np.linspace(0, seg, int(TAXA * seg), endpoint=False)


def env(n, ataque=0.005, queda=4.0):
    x = np.arange(n) / TAXA
    a = np.clip(x / max(ataque, 1e-4), 0, 1)
    return a * np.exp(-queda * x)


def filtro(sinal, tipo, freq, ordem=4):
    sos = butter(ordem, freq, btype=tipo, fs=TAXA, output="sos")
    return sosfilt(sos, sinal)


def suaviza_fim(s, seg=0.02):
    n = min(len(s), int(TAXA * seg))
    s[-n:] *= np.linspace(1, 0, n)
    return s


def ruido(seg, semente=1):
    return np.random.default_rng(semente).standard_normal(int(TAXA * seg))


def clique():
    x = t(0.06)
    s = np.sin(2 * np.pi * 2400 * x) * env(len(x), 0.001, 90) + 0.3 * ruido(0.06) * env(len(x), 0.0005, 160)
    return filtro(s, "highpass", 600)


def batida():
    x = t(0.35)
    f = 120 * np.exp(-8 * x) + 55
    s = np.sin(2 * np.pi * np.cumsum(f) / TAXA) * env(len(x), 0.002, 14)
    return filtro(s, "highpass", 40)


def sino():
    x = t(1.6)
    s = sum(a * np.sin(2 * np.pi * f * x) for f, a in [(880, 1), (1320, 0.5), (1760, 0.35), (2640, 0.2)])
    return s * env(len(x), 0.003, 3.2)


def pop():
    x = t(0.12)
    f = 300 + 900 * np.exp(-30 * x)
    s = np.sin(2 * np.pi * np.cumsum(f) / TAXA) * env(len(x), 0.002, 40)
    return filtro(s, "highpass", 120)


def whoosh():
    x = t(0.5)
    s = ruido(0.5, 3)
    s = filtro(s, "bandpass", [500, 4000])
    forma = np.sin(np.pi * x / 0.5) ** 2
    return s * forma


def passo():
    x = t(0.18)
    s = filtro(ruido(0.18, 5), "bandpass", [150, 1200]) * env(len(x), 0.002, 35)
    return filtro(s, "highpass", 60)


def porta():
    x = t(0.9)
    rangido = np.sin(2 * np.pi * (500 + 120 * np.sin(2 * np.pi * 3 * x)) * x) * env(len(x), 0.05, 2.5) * 0.4
    baque = np.concatenate([np.zeros(int(TAXA * 0.6)), batida()[: int(TAXA * 0.3)]])
    return filtro(rangido + baque[: len(rangido)], "highpass", 50)


def tique():
    x = t(0.05)
    s = np.sin(2 * np.pi * 3200 * x) * env(len(x), 0.0005, 140)
    return filtro(s, "highpass", 1000)


def ambiente():
    # Ar de lugar fechado, bem leve: ruído suave só nos médios (sem grave, sem chiado agudo).
    s = filtro(ruido(30, 9), "bandpass", [250, 1800], 2)
    lento = 0.85 + 0.15 * np.sin(2 * np.pi * 0.1 * t(30))
    s = s * lento
    n = int(TAXA * 1.0)
    s[:n] *= np.linspace(0, 1, n)
    s[-n:] *= np.linspace(1, 0, n)
    return s


EFEITOS = {f.__name__: f for f in [clique, batida, sino, pop, whoosh, passo, porta, tique, ambiente]}


def salvar(nome, s):
    s = suaviza_fim(np.asarray(s, dtype=np.float64))
    pico = np.max(np.abs(s)) or 1
    s = (s / pico * 0.89).astype(np.float32)
    PASTA.mkdir(parents=True, exist_ok=True)
    wavfile.write(PASTA / f"{nome}.wav", TAXA, s)
    print(f"  public/sons/{nome}.wav ({len(s) / TAXA:.2f} s)")


if __name__ == "__main__":
    nomes = sys.argv[1:] or list(EFEITOS)
    for n in nomes:
        if n not in EFEITOS:
            print(f"Efeito desconhecido: {n}. Existem: {', '.join(EFEITOS)}")
            continue
        salvar(n, EFEITOS[n]())
