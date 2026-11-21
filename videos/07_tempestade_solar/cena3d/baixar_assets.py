# Baixa modelos/texturas/HDRI CC0 do Poly Haven para assets/
import json, os, sys, urllib.request
op = urllib.request.build_opener(); op.addheaders = [('User-Agent', 'blender-asset-fetch/1.0')]; urllib.request.install_opener(op)
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets')
MOD = {'sofa_03':'2k','modern_coffee_table_01':'2k','Television_01':'2k','potted_plant_01':'2k','side_table_01':'1k','modern_ceiling_lamp_01':'1k','modular_electricity_poles':'2k'}
TEX = {'wood_floor_deck':'2k','beige_wall_001':'2k','fabric_pattern_07':'1k'}
def get(u, f):
    os.makedirs(os.path.dirname(f), exist_ok=True)
    if not os.path.exists(f): urllib.request.urlretrieve(u, f)
def files(a): return json.load(urllib.request.urlopen(f'https://api.polyhaven.com/files/{a}'))
for a, r in MOD.items():
    g = files(a)['gltf'][r]['gltf']; get(g['url'], f'{D}/{a}/{a}.gltf')
    for p, v in g.get('include', {}).items(): get(v['url'], f'{D}/{a}/{p}')
    print('mod', a)
for a, r in TEX.items():
    f = files(a)
    for m in ['Diffuse', 'nor_gl', 'Rough', 'AO', 'Displacement']:
        if m in f and r in f[m]:
            k = 'jpg' if 'jpg' in f[m][r] else list(f[m][r])[0]; get(f[m][r][k]['url'], f'{D}/tex/{a}/{a}_{m}.{k}')
    print('tex', a)
for h in sys.argv[1:]:
    f = files(h)['hdri']['2k']['exr']; get(f['url'], f'{D}/hdri/{h}.exr'); print('hdri', h)
