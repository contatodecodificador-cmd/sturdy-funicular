"""Thumbnail do vídeo 7: Terra com o Brasil no centro, lado noturno com luzes das cidades,
Sol no canto superior direito, linhas do campo magnético rasgadas sobre o Atlântico Sul.
Uso: python3 globo_thumb.py <pasta_texturas> <saida.png> [amostras]
Texturas (NASA, domínio público): world.200412.3x5400x2700.jpg (Blue Marble),
BlackMarble_2016_3km.jpg (luzes noturnas), cloud_combined_2048.jpg (nuvens)."""
import bpy, math, sys, os
from mathutils import Vector

TEX, OUT = sys.argv[-3], sys.argv[-2]
try: AMOSTRAS = int(sys.argv[-1])
except ValueError: AMOSTRAS = 64

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'; sc.cycles.samples = AMOSTRAS; sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'

def ll(lon, lat, r=1.0):
    lo, la = math.radians(lon), math.radians(lat)
    return Vector((r * math.cos(la) * math.cos(lo), r * math.cos(la) * math.sin(lo), r * math.sin(la)))

BRASIL = ll(-46, -27)                      # para onde a câmera olha

# ---------- câmera ----------
cam_d = BRASIL.normalized()
bpy.ops.object.camera_add(); cam = bpy.context.object; sc.camera = cam
cam.data.lens = 50
cam.location = cam_d * 3.75 + Vector((0, 0, 0.0))
alvo = Vector((0, 0, 0.66))   # Terra um pouco abaixo do centro (espaço para o texto em cima)
cam.rotation_euler = (alvo - cam.location).to_track_quat('-Z', 'Y').to_euler()

bpy.context.view_layer.update()
cx = cam.matrix_world.to_3x3()
SOL_DIR = (cx @ Vector((0.85, 0.55, 0.45))).normalized()   # luz vindo de cima/direita, levemente da frente
# ---------- mundo: espaço com estrelas ----------
w = bpy.data.worlds.new('espaco'); sc.world = w; w.use_nodes = True
nt = w.node_tree; nt.nodes.clear()
out = nt.nodes.new('ShaderNodeOutputWorld'); bg = nt.nodes.new('ShaderNodeBackground')
noise = nt.nodes.new('ShaderNodeTexVoronoi'); noise.feature = 'F1'; noise.inputs['Scale'].default_value = 420
ramp = nt.nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].position = 0.0; ramp.color_ramp.elements[0].color = (1, 1, 1, 1)
ramp.color_ramp.elements[1].position = 0.035; ramp.color_ramp.elements[1].color = (0, 0, 0, 1)
tc = nt.nodes.new('ShaderNodeTexCoord')
nt.links.new(tc.outputs['Generated'], noise.inputs['Vector']); nt.links.new(noise.outputs['Distance'], ramp.inputs['Fac'])
mul = nt.nodes.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = 0.6
nt.links.new(ramp.outputs['Color'], mul.inputs[0]); nt.links.new(mul.outputs[0], bg.inputs['Strength'])
nt.links.new(bg.outputs[0], out.inputs[0])

# ---------- Terra ----------
bpy.ops.mesh.primitive_uv_sphere_add(segments=256, ring_count=128, radius=1)
terra = bpy.context.object; bpy.ops.object.shade_smooth(); terra.name = 'terra'
m = bpy.data.materials.new('terra'); m.use_nodes = True; terra.data.materials.append(m)
n = m.node_tree.nodes; L = m.node_tree.links; n.clear()
o = n.new('ShaderNodeOutputMaterial'); p = n.new('ShaderNodeBsdfPrincipled')
# coordenadas esféricas a partir do objeto: u = lon, v = lat
tco = n.new('ShaderNodeTexCoord'); sep = n.new('ShaderNodeSeparateXYZ'); L.new(tco.outputs['Object'], sep.inputs[0])
at = n.new('ShaderNodeMath'); at.operation = 'ARCTAN2'; L.new(sep.outputs['Y'], at.inputs[0]); L.new(sep.outputs['X'], at.inputs[1])
u = n.new('ShaderNodeMath'); u.operation = 'MULTIPLY_ADD'; u.inputs[1].default_value = 1 / (2 * math.pi); u.inputs[2].default_value = 0.5
L.new(at.outputs[0], u.inputs[0])
ln = n.new('ShaderNodeVectorMath'); ln.operation = 'NORMALIZE'; L.new(tco.outputs['Object'], ln.inputs[0])
sep2 = n.new('ShaderNodeSeparateXYZ'); L.new(ln.outputs[0], sep2.inputs[0])
asn = n.new('ShaderNodeMath'); asn.operation = 'ARCSINE'; L.new(sep2.outputs['Z'], asn.inputs[0])
v = n.new('ShaderNodeMath'); v.operation = 'MULTIPLY_ADD'; v.inputs[1].default_value = 1 / math.pi; v.inputs[2].default_value = 0.5
L.new(asn.outputs[0], v.inputs[0])
uv = n.new('ShaderNodeCombineXYZ'); L.new(u.outputs[0], uv.inputs['X']); L.new(v.outputs[0], uv.inputs['Y'])
def img(nome, cs='sRGB'):
    t = n.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(os.path.join(TEX, nome)); t.image.colorspace_settings.name = cs
    t.interpolation = 'Cubic'; t.extension = 'EXTEND'; L.new(uv.outputs[0], t.inputs['Vector']); return t
dia, noite, nuv = img('world.200412.3x5400x2700.jpg'), img('BlackMarble_2016_3km.jpg'), img('cloud_combined_2048.jpg', 'Non-Color')
# cor do dia + nuvens
mixn = n.new('ShaderNodeMix'); mixn.data_type = 'RGBA'; mixn.inputs['B'].default_value = (1, 1, 1, 1)
L.new(nuv.outputs['Color'], mixn.inputs['Factor']); L.new(dia.outputs['Color'], mixn.inputs['A'])
L.new(mixn.outputs['Result'], p.inputs['Base Color']); p.inputs['Roughness'].default_value = 0.6
# luzes noturnas só onde o Sol não bate: fator = clamp(-dot(N, sol)*4 + 0.15)
geo = n.new('ShaderNodeNewGeometry'); dot = n.new('ShaderNodeVectorMath'); dot.operation = 'DOT_PRODUCT'
dot.inputs[1].default_value = tuple(SOL_DIR); L.new(geo.outputs['Normal'], dot.inputs[0])
nf = n.new('ShaderNodeMath'); nf.operation = 'MULTIPLY_ADD'; nf.use_clamp = True; nf.inputs[1].default_value = -5; nf.inputs[2].default_value = 0.2
L.new(dot.outputs['Value'], nf.inputs[0])
# luzes mais quentes (laranja) e tiradas do canal de luz da Black Marble
lum = n.new('ShaderNodeRGBToBW'); L.new(noite.outputs['Color'], lum.inputs[0])
gam = n.new('ShaderNodeMath'); gam.operation = 'POWER'; gam.inputs[1].default_value = 2.2; L.new(lum.outputs[0], gam.inputs[0])
nub = n.new('ShaderNodeMath'); nub.operation = 'SUBTRACT'; nub.inputs[0].default_value = 1.0; nub.use_clamp = True
L.new(nuv.outputs['Color'], nub.inputs[1])
e1 = n.new('ShaderNodeMath'); e1.operation = 'MULTIPLY'; L.new(gam.outputs[0], e1.inputs[0]); L.new(nf.outputs[0], e1.inputs[1])
e2 = n.new('ShaderNodeMath'); e2.operation = 'MULTIPLY'; L.new(e1.outputs[0], e2.inputs[0]); L.new(nub.outputs[0], e2.inputs[1])
e3 = n.new('ShaderNodeMath'); e3.operation = 'MULTIPLY'; e3.inputs[1].default_value = 9.0; L.new(e2.outputs[0], e3.inputs[0])
p.inputs['Emission Color'].default_value = (1.0, 0.62, 0.28, 1)
L.new(e3.outputs[0], p.inputs['Emission Strength'])
# mancha vermelha da anomalia magnética (Atlântico Sul), somada como emissão
SAA0 = ll(-42, -27)
dsa = n.new('ShaderNodeVectorMath'); dsa.operation = 'DISTANCE'; dsa.inputs[1].default_value = tuple(SAA0)
L.new(ln.outputs[0], dsa.inputs[0])
rr = n.new('ShaderNodeMapRange'); rr.inputs['From Min'].default_value = 0.03; rr.inputs['From Max'].default_value = 0.26
rr.inputs['To Min'].default_value = 1.0; rr.inputs['To Max'].default_value = 0.0; L.new(dsa.outputs['Value'], rr.inputs['Value'])
em2 = n.new('ShaderNodeEmission'); em2.inputs['Color'].default_value = (1.0, 0.08, 0.02, 1)
sq = n.new('ShaderNodeMath'); sq.operation = 'MULTIPLY'; sq.inputs[1].default_value = 0.75; L.new(rr.outputs['Result'], sq.inputs[0])
L.new(sq.outputs[0], em2.inputs['Strength'])
ad = n.new('ShaderNodeAddShader'); L.new(p.outputs[0], ad.inputs[0]); L.new(em2.outputs[0], ad.inputs[1]); L.new(ad.outputs[0], o.inputs[0])

# ---------- atmosfera (borda azul) ----------
bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=64, radius=1.025); atm = bpy.context.object; bpy.ops.object.shade_smooth()
ma = bpy.data.materials.new('atm'); ma.use_nodes = True; atm.data.materials.append(ma); ma.blend_method = 'BLEND'
an = ma.node_tree.nodes; al = ma.node_tree.links; an.clear()
ao = an.new('ShaderNodeOutputMaterial'); em = an.new('ShaderNodeEmission'); tr = an.new('ShaderNodeBsdfTransparent'); mx = an.new('ShaderNodeMixShader')
lw = an.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.12
pw = an.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 3.0; al.new(lw.outputs['Facing'], pw.inputs[0])
em.inputs['Color'].default_value = (0.25, 0.55, 1.0, 1); em.inputs['Strength'].default_value = 2.5
al.new(pw.outputs[0], mx.inputs['Fac']); al.new(tr.outputs[0], mx.inputs[1]); al.new(em.outputs[0], mx.inputs[2]); al.new(mx.outputs[0], ao.inputs[0])

# ---------- Sol ----------
bpy.ops.object.light_add(type='SUN'); sol = bpy.context.object; sol.data.energy = 5.0; sol.data.angle = math.radians(1.5)
sol.data.color = (1.0, 0.93, 0.85)
sol.rotation_euler = SOL_DIR.to_track_quat('-Z', 'Y').to_euler()
sol.rotation_euler = (-SOL_DIR).to_track_quat('-Z', 'Y').to_euler()

def emissivo(nome, cor, forca):
    mm = bpy.data.materials.new(nome); mm.use_nodes = True; nn = mm.node_tree.nodes; nn.clear()
    e = nn.new('ShaderNodeEmission'); e.inputs['Color'].default_value = cor; e.inputs['Strength'].default_value = forca
    oo = nn.new('ShaderNodeOutputMaterial'); mm.node_tree.links.new(e.outputs[0], oo.inputs[0]); return mm

# disco do Sol visível no canto superior direito (atrás da Terra, longe)
dir_tela = (cx @ Vector((0.31, 0.15, -1))).normalized()
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, location=cam.location + dir_tela * 14); sold = bpy.context.object
sold.hide_render = True

# ---------- campo magnético (linhas dipolares) rasgado sobre o Atlântico Sul ----------
inc = math.radians(-10)   # eixo magnético levemente inclinado
def eixo(vv):
    return Vector((vv.x, vv.y * math.cos(inc) - vv.z * math.sin(inc), vv.y * math.sin(inc) + vv.z * math.cos(inc)))
SAA = ll(-42, -27)
mlin = emissivo('campo', (1.0, 0.22, 0.02, 1), 1.4)
mlin_fraca = emissivo('campo_fraco', (1.0, 0.1, 0.03, 1), 1.6)
# planos perpendiculares à visão: as linhas ficam na borda do globo, sem cruzar o Brasil
vloc = cam_d
PHI0 = math.atan2(vloc.y, vloc.x) + math.pi / 2
for k, Lsh in enumerate([1.3, 1.55, 1.85, 2.25, 2.75, 3.4]):
    for j in range(10):
        phi = PHI0 + (j % 5 - 2) * math.radians(9) + (math.pi if j >= 5 else 0)
        pts = []
        for i in range(161):
            th = 0.02 + (math.pi - 0.04) * i / 160
            r = Lsh * math.sin(th) ** 2
            if r < 1.02: continue
            p_ = Vector((r * math.sin(th) * math.cos(phi), r * math.sin(th) * math.sin(phi), r * math.cos(th)))
            pts.append(eixo(p_))
        if len(pts) < 4: continue
        # linhas que passam perto da anomalia são cortadas (o "rasgo")
        seg, segs = [], []
        for q in pts:
            perto = (q.normalized() - SAA).length < 0.55 and q.length < 2.0
            if perto:
                if len(seg) > 3: segs.append(seg)
                seg = []
            else: seg.append(q)
        if len(seg) > 3: segs.append(seg)
        for s in segs:
            cu = bpy.data.curves.new('linha', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 0.0028
            sp = cu.splines.new('POLY'); sp.points.add(len(s) - 1)
            for i, q in enumerate(s): sp.points[i].co = (*q, 1)
            ob = bpy.data.objects.new('linha', cu); sc.collection.objects.link(ob); ob.visible_shadow = False
            ob.data.materials.append(mlin if len(segs) == 1 else mlin_fraca)

# ---------- glare (bloom) no compositor ----------
sc.use_nodes = True
try:
    ct = sc.node_tree; ct.nodes.clear()
    rl = ct.nodes.new('CompositorNodeRLayers'); gl = ct.nodes.new('CompositorNodeGlare'); co = ct.nodes.new('CompositorNodeComposite')
    gl.glare_type = 'FOG_GLOW'; gl.quality = 'HIGH'; gl.threshold = 0.9; gl.size = 9
    ct.links.new(rl.outputs[0], gl.inputs[0]); ct.links.new(gl.outputs[0], co.inputs[0])
except Exception as ex:
    print('compositor indisponível:', ex)

sc.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print('OK', OUT)
