import hashlib, sys, subprocess, urllib.parse
# uso: wthumb.py "Nome do arquivo.jpg" saida.jpg [largura]
nome = sys.argv[1].replace(' ', '_'); out = sys.argv[2]; w = sys.argv[3] if len(sys.argv) > 3 else '1920'
h = hashlib.md5(nome.encode()).hexdigest(); q = urllib.parse.quote(nome)
for url in [f'https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/{w}px-{q}', f'https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{q}']:
    r = subprocess.run(['curl', '-s', '-f', '-A', 'BrasilMilenar/1.0 (educational video; contact via channel)', '-o', out, '-w', '%{http_code}', url], capture_output=True, text=True)
    print(nome, r.stdout, url[-60:])
    if r.returncode == 0: break
