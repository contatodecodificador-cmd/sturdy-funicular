# Baixa modelos/texturas/HDRI CC0 do Poly Haven para assets/
import json, os, sys, urllib.request
op = urllib.request.build_opener(); op.addheaders = [('User-Agent', 'blender-asset-fetch/1.0')]; urllib.request.install_opener(op)
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets')
MOD = {  # nome: resolução
 'wooden_table_02':'2k','painted_wooden_chair_01':'2k','electric_stove':'2k','vintage_electric_kettle':'2k','pot_enamel_01':'1k',
 'wall_clock':'1k','hanging_picture_frame_02':'1k','potted_plant_02':'2k','potted_plant_04':'1k','bananas':'2k','food_apple_01':'2k',
 'lemon':'2k','food_lime_01':'2k','wooden_cutting_board':'1k','wooden_spoon':'1k','yellow_onion':'1k','tea_set_01':'2k',
 'modern_ceiling_lamp_01':'1k','ceramic_pot':'1k','metal_jug':'1k'}
TEX = {'oak_veneer_01':'2k','square_tiled_wall':'2k','beige_wall_001':'2k','terracotta_floor_tiles':'2k','granite_tile':'2k','plastered_wall':'1k','gingham_check':'2k'}
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
