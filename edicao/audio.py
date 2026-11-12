"""Mixa narração + trilha por capítulo (com ducking) + efeitos sonoros. Gera mix.wav (48 kHz estéreo)."""
import json, os, subprocess, sys, glob
import numpy as np
S = os.path.dirname(os.path.abspath(__file__)); SR = 48000
NARR = sys.argv[1]
shots = json.load(open(f'{S}/shots.json')); sent = json.load(open(f'{S}/sentences.json'))

def dec(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()

def db(x): return 10 ** (x / 20)

voice = dec(NARR)
end_t = max(len(voice) / SR, shots[-1]['t1']) + 2.5
N = int(end_t * SR)
v = np.zeros(N, np.float32); v[:len(voice)] = voice
speech = np.abs(v) > 0.02
vrms = float(np.sqrt(np.mean(v[speech] ** 2))) if speech.any() else 0.1

# ---------- trilha ----------
MUS = {k: glob.glob(f'{S}/music/{p}*') for k, p in {
    'mystery': 'Comfortable_Mystery_ISRC', 'mystery4': 'Comfortable_Mystery_4', 'dark': 'Darkling', 'ice': 'Kevin_MacLeod_The_Ice_Giants',
    'adventure': 'Call_to_Adventure', 'bazaar': 'Mystery_Bazaar', 'chasm': 'Crossing_the_Chasm', 'reach': 'Kevin_MacLeod_Reaching_Out',
    'inner': 'Kevin_MacLeod_Inner_Light', 'winter': 'Kevin_MacLeod_Winter_Reflections'}.items()}
ok = {k: f[0] for k, f in MUS.items() if f and os.path.getsize(f[0]) > 200000}
fallback = list(ok.values())
SEC = [('Intro', 'mystery'), ('1 ·', 'dark'), ('4 ·', 'adventure'), ('6 ·', 'chasm'), ('11 ·', 'mystery')]
starts = []
for pref, trk in SEC:
    for s in shots:
        if s.get('sec', '') and s['sec'].startswith(pref): starts.append((s['t0'], trk)); break
for x in sent:  # trilha emotiva a partir de "Então imagina."
    if x['text'].startswith('Então imagina'): starts.append((x['t0'] - 1.0, 'inner')); break
starts.sort(); starts[0] = (0.0, starts[0][1])
music = np.zeros(N, np.float32); XF = 2.0; used_music = []
cache = {}
for j, (a, trk) in enumerate(starts):
    b = starts[j + 1][0] if j + 1 < len(starts) else end_t
    f = ok.get(trk) or (fallback[j % len(fallback)] if fallback else None)
    if not f: continue
    if f not in cache: cache[f] = dec(f)
    tr = cache[f]; used_music.append(os.path.basename(f))
    a0, b0 = int(a * SR), min(N, int((b + XF) * SR)); L = b0 - a0
    seg = np.tile(tr, L // len(tr) + 1)[:L].copy()
    fi = min(L, int(XF * SR)); seg[:fi] *= np.linspace(0, 1, fi)
    fo = min(L, int(XF * SR)); seg[-fo:] *= np.linspace(1, 0, fo)
    seg /= (np.sqrt(np.mean(seg ** 2)) + 1e-6)
    music[a0:b0] += seg
# ducking pela voz
win = int(0.12 * SR); env = np.sqrt(np.convolve(v ** 2, np.ones(win) / win, mode='same'))
k = np.clip(env / (vrms * 0.5), 0, 1)
k2 = np.convolve(k, np.ones(int(0.35 * SR)) / int(0.35 * SR), mode='same')  # suaviza ataque/release
mgain = vrms * (db(-17) * (1 - k2) + db(-25) * k2)
music *= mgain.astype(np.float32)

# ---------- efeitos ----------
fx = {n: dec(f'{S}/sfx/{n}.wav') for n in ['whoosh', 'hit', 'boom', 'tick', 'pop', 'stamp', 'riser', 'wind', 'water', 'fire']}
for n in fx: fx[n] /= (np.max(np.abs(fx[n])) + 1e-6)
G = {'whoosh': -13, 'hit': -9, 'boom': -7, 'tick': -15, 'pop': -14, 'stamp': -9, 'riser': -15, 'wind': -17, 'water': -18, 'fire': -15}
DL = {'whoosh': -0.2, 'hit': 0.05, 'boom': 0.0, 'tick': 0.1, 'pop': 0.25, 'stamp': 0.33}
sfx = np.zeros(N, np.float32)
peak = float(np.max(np.abs(v)))
for s in shots:
    n = s.get('sfx')
    if not n or n not in fx: continue
    x = fx[n]
    if n == 'riser': st = max(s['t0'], s['t1'] - len(x) / SR)
    elif n in ('wind', 'water', 'fire'):
        L = int((s['t1'] - s['t0']) * SR); x = np.tile(x, L // len(x) + 1)[:L].copy(); f_ = min(L, int(0.3 * SR)); x[:f_] *= np.linspace(0, 1, f_); x[-f_:] *= np.linspace(1, 0, f_); st = s['t0']
    else: st = s['t0'] + DL.get(n, 0)
    a0 = max(0, int(st * SR)); b0 = min(N, a0 + len(x))
    sfx[a0:b0] += x[:b0 - a0] * peak * db(G[n])
mix = v + music + sfx
st = np.stack([mix, mix], 1)
st = st / max(1.0, float(np.max(np.abs(st))) / 0.98)
st.astype(np.float32).tofile(f'{S}/mix.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', f'{S}/mix.f32',
                '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), f'{S}/mix.wav'], check=True)
os.remove(f'{S}/mix.f32')
json.dump(used_music, open(f'{S}/music_used.json', 'w'))
print('mix ok', round(N / SR, 2), 's; trilhas:', used_music)
