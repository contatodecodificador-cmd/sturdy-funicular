"""Vídeo 8 — viagem de barco em 3D sobre o mapa em relevo da Amazônia (Natural Earth) com o barco ship_pinnace (Poly Haven, CC0).
Uso: python3 barco_mapa.py <pasta_assets> <saida_prefixo> [--teste] [--frames N]
Rota: Curuçá → Javari → Solimões → Manaus (a notícia saindo de canoa / "dias de barco")."""
import bpy, sys, math, os
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
A, OUT = args[0], args[1]
TESTE = '--teste' in args
NF = int(args[args.index('--frames') + 1]) if '--frames' in args else 180

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
bpy.context.preferences.edit.keyframe_new_interpolation_type = 'LINEAR'
sc.render.engine = 'BLENDER_EEVEE'
sc.render.resolution_x, sc.render.resolution_y = (960, 540) if (TESTE or '--meia' in args) else (1920, 1080)
sc.render.fps = 30; sc.frame_start = 1; sc.frame_end = NF
try: sc.eevee.taa_render_samples = 12
except Exception: pass
sc.render.image_settings.file_format = 'PNG'
sc.render.filepath = OUT
try: sc.view_settings.view_transform = 'AgX'
except Exception: pass
sc.render.film_transparent = False

LON0, LAT0 = -66.0, -4.5           # centro do recorte (lon -82..-50, lat 5..-14)
X = lambda lon: lon - LON0
Y = lambda lat: lat - LAT0

# mundo: céu azul escuro suave
w = bpy.data.worlds.new('mundo'); sc.world = w; w.use_nodes = True
w.node_tree.nodes['Background'].inputs[0].default_value = (0.02, 0.035, 0.07, 1)
w.node_tree.nodes['Background'].inputs[1].default_value = 0.6

# mapa
bpy.ops.mesh.primitive_plane_add(size=1)
mapa = bpy.context.object; mapa.scale = (32, 19, 1); mapa.location = (X(-66), Y(-4.5), 0)
mat = bpy.data.materials.new('mapa'); mat.use_nodes = True; nt = mat.node_tree
tex = nt.nodes.new('ShaderNodeTexImage'); tex.image = bpy.data.images.load(os.path.join(A, 'amazonia_up.jpg'))
bsdf = nt.nodes['Principled BSDF']; bsdf.inputs['Roughness'].default_value = 0.85
hsv = nt.nodes.new('ShaderNodeHueSaturation'); hsv.inputs['Saturation'].default_value = 1.15; hsv.inputs['Value'].default_value = 0.95
nt.links.new(tex.outputs['Color'], hsv.inputs['Color']); nt.links.new(hsv.outputs['Color'], bsdf.inputs['Base Color'])
mapa.data.materials.append(mat)

def emissivo(nome, cor, forca):
    m = bpy.data.materials.new(nome); m.use_nodes = True; n = m.node_tree; n.nodes.clear()
    e = n.nodes.new('ShaderNodeEmission'); e.inputs[0].default_value = (*cor, 1); e.inputs[1].default_value = forca
    o = n.nodes.new('ShaderNodeOutputMaterial'); n.links.new(e.outputs[0], o.inputs[0]); return m

def curva(nome, pts, bevel, mat, z=0.01):
    cu = bpy.data.curves.new(nome, 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = bevel; cu.bevel_resolution = 3
    sp = cu.splines.new('NURBS'); sp.points.add(len(pts) - 1)
    for i, (lo, la) in enumerate(pts): sp.points[i].co = (X(lo), Y(la), z, 1)
    sp.use_endpoint_u = True; sp.order_u = 3
    ob = bpy.data.objects.new(nome, cu); sc.collection.objects.link(ob); ob.data.materials.append(mat); return ob

# rios (azul claro) e a rota (dourada, que se desenha)
JAVARI = [(-73.8, -7.3), (-72.9, -6.2), (-72.2, -5.4), (-71.4, -4.9), (-70.6, -4.5), (-69.95, -4.3)]
SOLIMOES = [(-69.95, -4.3), (-68.6, -3.6), (-67.0, -3.2), (-65.5, -3.5), (-64.7, -3.35), (-63.1, -4.08), (-61.6, -3.6), (-60.6, -3.3), (-60.02, -3.1)]
ROTA = [(-71.6, -5.2), (-71.2, -4.85)] + JAVARI[4:] + SOLIMOES[1:]
curva('javari', JAVARI, 0.02, emissivo('rio', (0.12, 0.45, 0.95), 1.2))
curva('solimoes', SOLIMOES, 0.03, emissivo('rio2', (0.12, 0.45, 0.95), 1.2))
rota = curva('rota', ROTA, 0.022, emissivo('rota', (1.0, 0.62, 0.12), 3), z=0.05)
rota.data.bevel_factor_end = 0.0
rota.data.keyframe_insert('bevel_factor_end', frame=1)
rota.data.bevel_factor_end = 1.0
rota.data.keyframe_insert('bevel_factor_end', frame=NF)

# pinos das cidades
for nome, (lo, la), cor in [('curuca', (-71.6, -5.2), (1.0, 0.35, 0.2)), ('tabatinga', (-69.94, -4.25), (0.45, 0.75, 1.0)), ('manaus', (-60.02, -3.1), (1.0, 0.72, 0.25))]:
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.09, location=(X(lo), Y(la), 0.06)); o = bpy.context.object; o.data.materials.append(emissivo('p' + nome, cor, 12))
    bpy.ops.mesh.primitive_cylinder_add(radius=0.16, depth=0.005, location=(X(lo), Y(la), 0.015)); o2 = bpy.context.object; o2.data.materials.append(emissivo('a' + nome, cor, 2))

# rótulos 3D (só 3, sem sobrepor)
def rotulo(txt, lo, la, dx=0.25, dy=0.15, s=0.32):
    bpy.ops.object.text_add(location=(X(lo) + dx, Y(la) + dy, 0.05)); t = bpy.context.object
    t.data.body = txt; t.data.size = s; t.data.extrude = 0.01
    t.data.materials.append(emissivo('txt' + txt, (1, 1, 1), 2.2)); t.data.align_x = 'CENTER'; return t
rotulo('CURUÇÁ', -71.6, -5.2, dx=0, dy=-0.45, s=0.26)
rotulo('TABATINGA', -69.94, -4.25, dx=0, dy=0.4, s=0.26)
rotulo('MANAUS', -60.02, -3.1, dx=0, dy=0.4, s=0.3)

# barco (exagerado em escala), seguindo a rota
bpy.ops.import_scene.gltf(filepath=os.path.join(A, 'ship_pinnace_1k.gltf'))
partes = [o for o in bpy.context.selected_objects]
for o in list(partes):
    if any(k in o.name for k in ('rigging', 'sails')):
        partes.remove(o); bpy.data.objects.remove(o, do_unlink=True)
bpy.ops.object.empty_add(location=(0, 0, 0)); barco = bpy.context.object; barco.name = 'barco'
for o in partes:
    if o.parent is None: o.parent = barco
# medir o tamanho do barco
import mathutils
xs = []
for o in partes:
    if o.type == 'MESH':
        for v in o.bound_box: xs.append((o.matrix_world @ mathutils.Vector(v)))
L = max(max(v.x for v in xs) - min(v.x for v in xs), max(v.y for v in xs) - min(v.y for v in xs)) or 1
barco.scale = [0.85 / L] * 3
c = barco.constraints.new('FOLLOW_PATH'); c.target = rota; c.use_curve_follow = True; c.forward_axis = 'FORWARD_Y'; c.use_fixed_location = True
c.offset_factor = 0.0; c.keyframe_insert('offset_factor', frame=1)
c.offset_factor = 0.985; c.keyframe_insert('offset_factor', frame=NF)
barco.location = (0, 0, 0.03)

# câmera acompanha o barco por trás e de cima
bpy.ops.object.empty_add(); alvo = bpy.context.object
ca = alvo.constraints.new('COPY_LOCATION'); ca.target = barco
bpy.ops.object.camera_add(); cam = bpy.context.object; sc.camera = cam; cam.data.lens = 32
cam.parent = alvo; cam.location = (-2.4, -6.8, 8.0)
tr = cam.constraints.new('TRACK_TO'); tr.target = alvo; tr.track_axis = 'TRACK_NEGATIVE_Z'; tr.up_axis = 'UP_Y'
for t in [o for o in sc.objects if o.type == 'FONT']:
    k = t.constraints.new('TRACK_TO'); k.target = cam; k.track_axis = 'TRACK_Z'; k.up_axis = 'UP_Y'
cam.data.dof.use_dof = True; cam.data.dof.focus_object = alvo; cam.data.dof.aperture_fstop = 2.0

# luz
bpy.ops.object.light_add(type='SUN', rotation=(math.radians(45), math.radians(15), math.radians(-30))); s = bpy.context.object
s.data.energy = 3.2; s.data.color = (1.0, 0.92, 0.82)

if TESTE:
    sc.frame_set(NF // 2); bpy.ops.render.render(write_still=True)
else:
    bpy.ops.render.render(animation=True)
