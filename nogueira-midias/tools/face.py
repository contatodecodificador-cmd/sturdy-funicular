"""Gera fotos com o meu rosto (IP-Adapter FaceID) no servidor RunPod.
Uso: python face.py <servidor> <pasta-saida> <jobs.json>
jobs.json: [{"name":..., "prompt":..., "seeds":[...], "face":0.9, "w":1024, "h":1024}]
As fotos de referencia ficam em referencias/ (fora do git) e so servem para extrair o rosto."""
import sys, os, json, base64, urllib.request, glob, time
base, out, jobs = sys.argv[1].rstrip('/'), sys.argv[2], json.load(open(sys.argv[3]))
H = {'Content-Type': 'application/json', 'User-Agent': 'curl/8.5.0'}
here = os.path.dirname(os.path.abspath(__file__))
refs = sorted(glob.glob(os.path.join(here, '..', 'referencias', 'ref*.jpg')))
body = json.dumps({'images': [base64.b64encode(open(r, 'rb').read()).decode() for r in refs]}).encode()
print('rosto:', urllib.request.urlopen(urllib.request.Request(base + '/face', body, H), timeout=120).read().decode(), flush=True)
os.makedirs(out, exist_ok=True)
for j in jobs:
    for s in j['seeds']:
        f = os.path.join(out, f"{j['name']}_{s}.png")
        if os.path.exists(f): continue
        b = json.dumps({'prompt': j['prompt'], 'w': j.get('w', 1024), 'h': j.get('h', 1024), 'seed': s,
                        'steps': j.get('steps', 30), 'cfg': j.get('cfg', 5.0), 'face': j.get('face', 0.9)}).encode()
        t = time.time()
        open(f, 'wb').write(urllib.request.urlopen(urllib.request.Request(base + '/gen', b, H), timeout=300).read())
        print(f'ok {os.path.basename(f)} {time.time()-t:.0f}s', flush=True)
