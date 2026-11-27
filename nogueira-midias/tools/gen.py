"""Gera as imagens do carrossel no servidor FLUX (RunPod). Uso: python gen.py <pasta-carrossel> <url-servidor>"""
import json, sys, os, urllib.request, time
d, base = sys.argv[1], sys.argv[2].rstrip('/')
P = json.load(open(os.path.join(d, 'prompts.json')))
os.makedirs(os.path.join(d, 'raw'), exist_ok=True)
for name, p in P.items():
    for s in p['seeds']:
        out = os.path.join(d, 'raw', f'{name}_{s}.png')
        if os.path.exists(out): continue
        body = json.dumps({'prompt': p['prompt'], 'w': p['w'], 'h': p['h'], 'seed': s, 'steps': 4}).encode()
        for tent in range(3):
            try:
                t = time.time()
                r = urllib.request.urlopen(urllib.request.Request(base + '/gen', body, {'Content-Type': 'application/json'}), timeout=300)
                open(out, 'wb').write(r.read()); print(f'ok {name}_{s} {time.time()-t:.0f}s', flush=True); break
            except Exception as e:
                print(f'erro {name}_{s} tentativa {tent+1}: {e}', flush=True); time.sleep(10)
