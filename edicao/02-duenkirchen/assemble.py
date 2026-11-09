"""Assemble final video: concat shot clips + SFX track + narration. usage: python3 assemble.py [--preview]"""
import json, os, glob, subprocess, wave, random, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(f'{HERE}/edl.json'))
R = f'{HERE}/render'; SR = 48000
ENG = f'{HERE}/../../tools/mapengine'
scenes = json.loads(subprocess.run(['node', '--input-type=module', '-e',
    f"import('{ENG}/scenes.js').then(m=>console.log(JSON.stringify(Object.fromEntries(Object.entries(m.SCENES).map(([k,v])=>[k,{{stamps:(v.cards||{{}}).stamps||[],clock:(v.cards||{{}}).clock||null,arrows:(v.arrows||[]).map(a=>a.t0)}}])))))"],
    capture_output=True, text=True, check=True).stdout)

def load(n):
    w = wave.open(f'{R}/sfx/{n}.wav'); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32767; return x
SFX = {k: load(k) for k in ('whoosh', 'key', 'stamp', 'tick', 'hit')}
total = S[-1]['t1'] + 1.0
track = np.zeros(int(total * SR), np.float32)
def put(name, t, gain=1.0):
    i = int(t * SR)
    if i < 0: return
    x = SFX[name] * gain; j = min(len(track), i + len(x)); track[i:j] += x[:j - i]

rnd = random.Random(7)
for s in S:
    t0, t1, d = s['t0'], s['t1'], s['t1'] - s['t0']
    if 'whoosh' in s['sfx']: put('whoosh', t0 - 0.18, 0.55)
    if 'hit' in s['sfx']: put('hit', t0, 0.6)
    others = [x for x in s['txt'] if not x.startswith('stamp:')]
    if 'type' in s['sfx']:
        for j, item in enumerate(others[:2]):
            k, _, v = item.partition(':')
            if k in ('date', 'clock', 'counter', 'list'): continue
            st = t0 + (0.25 if j == 0 else min(d * 0.42, 2.2)); n = min(len(v), 40); dur = max(0.35, len(v) * 0.045)
            for c in range(n):
                put('key', st + c * dur / max(1, n) + rnd.uniform(-0.01, 0.01), rnd.uniform(0.25, 0.45))
    stamps = [x for x in s['txt'] if x.startswith('stamp:')]
    for i, _ in enumerate(stamps):
        put('stamp', t0 + 0.3 + ((2.2 + i * 1.05) if len(stamps) > 1 else 0), 0.8)
    if any(x.startswith('counter:') for x in s['txt']):
        for k in range(8): put('tick', t0 + 0.25 + k * 0.17, 0.35)
    if 'tick' in s['sfx'] and any(x.startswith('clock') for x in s['txt']) or s['src'] in ('clock', 'clock_rewind'):
        for k in range(int(d)): put('tick', t0 + 0.4 + k, 0.5)
    if s['type'] == 'M':
        sc, off = (s['src'].split('@') + ['0'])[:2]; off = float(off); info = scenes[sc]
        for st in info['stamps']:
            ts = st['t0'] - off
            if 0 <= ts < d: put('stamp', t0 + ts, 0.75)
        for at in info['arrows']:
            ts = at - off
            if 0.2 <= ts < d: put('whoosh', t0 + ts, 0.25)
        if info['clock']:
            for k in range(int(d)): put('tick', t0 + 0.4 + k, 0.4)

track = np.clip(track, -1, 1)
w = wave.open(f'{R}/sfx_track.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((track * 32767).astype(np.int16).tobytes()); w.close()

# concat list with exact durations
lines = []
for i, s in enumerate(S, 1):
    c = glob.glob(f'{R}/maps/{i:03d}_*.mp4') if s['type'] == 'M' else [f'{R}/shots/{i:03d}.mp4']
    c = [x for x in c if os.path.exists(x) and not x.endswith('.tmp.mp4')]
    if not c: sys.exit(f'missing clip for shot {i} ({s["src"]})')
    lines += [f"file '{c[0]}'", 'inpoint 0', f'outpoint {s["t1"] - s["t0"]:.3f}']
open(f'{R}/concat.txt', 'w').write('\n'.join(lines) + '\n')
out = f'{HERE}/render/Duenkirchen_1940_final.mp4'
subprocess.run(['ffmpeg', '-v', 'error', '-stats', '-y', '-f', 'concat', '-safe', '0', '-i', f'{R}/concat.txt',
    '-i', f'{HERE}/audio/narracao.mp3', '-i', f'{R}/sfx_track.wav',
    '-filter_complex', '[1:a]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[n];[2:a]volume=0.55,aresample=48000[f];[n][f]amix=inputs=2:normalize=0:duration=first[a]',
    '-map', '0:v', '-map', '[a]', '-r', '30', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', out], check=True)
print('OK', out)
