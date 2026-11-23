import json, subprocess
T = json.load(open('kit_capcut/timeline.json')); M = json.load(open('kit_capcut/_graficos_map.json'))
g0 = 0.0
for p in T:
    if not p['vis'].startswith('G:'): continue
    d = p['t1'] - p['t0']
    subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', f'{g0:.3f}', '-i', 'render/out/graficos.mp4', '-t', f'{d:.3f}',
                    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-an', f"kit_capcut/{M[p['id']]}"], check=True)
    g0 += d
print('cortados', len(M))
