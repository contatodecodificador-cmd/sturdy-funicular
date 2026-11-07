"""Ferramentas de síntese de som da linha "O Tempo Parou".
Tudo gerado por código (numpy/scipy), 100% original. 48 kHz.
"""
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def ruido(d, seed=None):
    g = np.random.default_rng(seed) if seed is not None else rng
    return g.standard_normal(int(SR * d))


def filtro(x, tipo, f, ordem=4):
    if tipo == 'bp':
        sos = signal.butter(ordem, [f[0] / (SR / 2), f[1] / (SR / 2)], 'bandpass', output='sos')
    else:
        sos = signal.butter(ordem, f / (SR / 2), {'lp': 'lowpass', 'hp': 'highpass'}[tipo], output='sos')
    return signal.sosfilt(sos, x, axis=-1)


def env_exp(d, tau, ataque=0.002):
    tt = t(d)
    e = np.exp(-tt / tau)
    a = int(SR * ataque)
    if a > 0:
        e[:a] *= np.linspace(0, 1, a)
    return e


def env_sino(d, pico=0.5, forma=2.0):
    """Envelope que sobe e desce (pico = posição 0..1)."""
    x = np.linspace(0, 1, int(SR * d))
    e = np.where(x < pico, (x / pico) ** forma, ((1 - x) / (1 - pico)) ** forma)
    return e


def lp_variavel(x, cortes):
    """Passa-baixa de 1 polo com corte variando amostra a amostra (cortes em Hz, mesmo tamanho de x)."""
    y = np.zeros_like(x)
    a = 1 - np.exp(-2 * np.pi * np.asarray(cortes) / SR)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def seno(f, d, fase=0):
    f = np.broadcast_to(np.asarray(f, dtype=float), (int(SR * d),))
    return np.sin(2 * np.pi * np.cumsum(f) / SR + fase)


def normaliza(x, pico_db=-3.0):
    m = np.max(np.abs(x)) + 1e-12
    return x / m * (10 ** (pico_db / 20))


def fade(x, ini=0.003, fim=0.01):
    x = x.copy()
    a, b = int(SR * ini), int(SR * fim)
    if a: x[:a] *= np.linspace(0, 1, a)
    if b: x[-b:] *= np.linspace(1, 0, b)
    return x


def salva(caminho, x, pico_db=-3.0):
    x = normaliza(fade(x), pico_db)
    if x.ndim == 2:
        x = x.T
    wavfile.write(caminho, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))


def eco(x, atraso=0.18, ganho=0.35, n=4):
    y = np.concatenate([x, np.zeros(int(SR * atraso * n))])
    for k in range(1, n + 1):
        s = int(SR * atraso * k)
        y[s:s + len(x)] += x * (ganho ** k)
    return y


def pluck(f, d=0.6, brilho=0.5, seed=1):
    """Corda dedilhada (Karplus-Strong)."""
    n = int(SR * d)
    p = int(SR / f)
    buf = np.random.default_rng(seed).uniform(-1, 1, p)
    buf = filtro(np.concatenate([buf, buf]), 'lp', 2000 + 8000 * brilho)[:p]
    out = np.zeros(n)
    for i in range(n):
        v = buf[i % p]
        out[i] = v
        buf[i % p] = 0.996 * 0.5 * (v + buf[(i + 1) % p])
    return out
