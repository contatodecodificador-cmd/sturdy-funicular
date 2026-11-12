"""Gera a descrição do YouTube: capítulos (a partir das cartelas) + créditos de imagens, vídeos e músicas."""
import json, glob, os, re
S = os.path.dirname(os.path.abspath(__file__))
shots = json.load(open(f'{S}/shots.json'))
byshot = {}
for f in sorted(glob.glob(f'{S}/segs/credits_*.json'), key=os.path.getmtime):
    for i, lst in json.load(open(f)).items(): byshot[int(i)] = lst
cred = {}
for lst in byshot.values():
    for c in lst: cred[c['title']] = c
M = json.load(open(f'{S}/music.json')); used_m = json.load(open(f'{S}/music_used.json'))

def tc(t): return f'{int(t // 60)}:{int(t % 60):02d}'

caps = [('0:00', 'Ele não tem raça')]
for s in shots:
    if s['t'] == 'gfx' and s['kind'] == 'era' and not s.get('note'):
        caps.append((tc(s['t0']), f"{s['name']} – {s['place']}"))
    if s.get('sec') == 'Personagem e 3 armas' and len(caps) == 1: caps.append((tc(s['t0']), 'As 3 armas do caramelo'))
    if s.get('sec') == 'Regras' and not any(c[1] == 'As regras' for c in caps): caps.append((tc(s['t0']), 'As regras'))
    if s.get('sec') == 'Veredito' and not any(c[1] == 'O veredito' for c in caps): caps.append((tc(s['t0']), 'O veredito'))
seen = []; caps2 = []
for c in caps:
    if c[1] not in seen: seen.append(c[1]); caps2.append(c)

lic_url = {'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/', 'CC BY 2.5': 'https://creativecommons.org/licenses/by/2.5/',
           'CC BY 3.0': 'https://creativecommons.org/licenses/by/3.0/', 'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
           'CC BY-SA 2.0': 'https://creativecommons.org/licenses/by-sa/2.0/', 'CC BY-SA 2.5': 'https://creativecommons.org/licenses/by-sa/2.5/',
           'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/', 'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/'}
L = []
L.append('Um vira-lata caramelo sobreviveria ao Brasil pré-histórico? Do Pré-Cambriano em Corumbá até a Era do Gelo em Lagoa Santa, colocamos o cachorro mais brasileiro que existe em 11 momentos da história do nosso território e demos uma nota para cada um.')
L.append('')
L.append('Escreve nos comentários o nome do seu caramelo!')
L.append('')
L.append('CAPÍTULOS')
for t, n in caps2: L.append(f'{t} {n}')
L.append('')
L.append('MÚSICAS')
names = set(used_m)
for t, x in M.items():
    fn = re.sub(r'[^A-Za-z0-9]+', '_', t[5:])[:40]
    if any(u.startswith(fn) for u in names):
        nm = re.sub(r'\s*\(ISRC.*$', '', t[5:]).replace('Kevin MacLeod - ', '').rsplit('.', 1)[0]
        L.append(f'"{nm}" – Kevin MacLeod (incompetech.com), licença {x["lic"]}: {lic_url.get(x["lic"], "")}')
L.append('')
L.append('IMAGENS E VÍDEOS')
L.append(f'{len(cred)} imagens e vídeos do Wikimedia Commons (CC0, domínio público, CC BY e CC BY-SA). Lista completa com autores e licenças no comentário fixado.')
L.append('')
L.append('Narração gerada com ElevenLabs. Gráficos, mapas e efeitos sonoros: produção própria. Mapa do Brasil: Natural Earth (domínio público).')
open(f'{S}/descricao_youtube.txt', 'w').write('\n'.join(L))
K = ['CRÉDITOS DAS IMAGENS E VÍDEOS (Wikimedia Commons) – autor – licença', '']
for t, c in sorted(cred.items()):
    a = (c.get('artist') or '').replace('\n', ' ').strip() or 'autor desconhecido'
    a = re.sub(r'\s+', ' ', a)[:60]
    K.append(f'{t[5:].rsplit(".", 1)[0][:70]} – {a} – {c["lic"]}')
K.append(''); K.append('Arquivos em commons.wikimedia.org (busque pelo nome do arquivo). Licenças: creativecommons.org/licenses')
open(f'{S}/creditos_completos.txt', 'w').write('\n'.join(K))
print(len(cred), 'créditos;', len(caps2), 'capítulos; descrição', len('\n'.join(L)), 'caracteres; créditos', len('\n'.join(K)))
