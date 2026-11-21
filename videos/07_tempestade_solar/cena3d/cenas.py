"""Cenas 3D do vídeo 7 (tempestade solar). Uma função por cena; cada cena monta a câmera do plano.
Uso (prévia CPU):  python3 cenas.py <plano> <saida.png> [--amostras N] [--res WxH] [--gpu] [--quadro F]
Planos: S01 S02 S03 S04 S05 S06 S07 S08 S09 S10 S11 S12 S14
"""
import bpy, math, sys, os, random
from mathutils import Vector, Euler

AQUI = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(AQUI, 'assets')
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
PLANO, SAIDA = args[0], args[1]
def opt(n, d):
    return args[args.index(n) + 1] if n in args else d
AMOSTRAS = int(opt('--amostras', 32)); RES = opt('--res', '960x540'); GPU = '--gpu' in args; QUADRO = int(opt('--quadro', 1))

def ll(lon, lat, r=1.0):
    lo, la = math.radians(lon), math.radians(lat)
    return Vector((r * math.cos(la) * math.cos(lo), r * math.cos(la) * math.sin(lo), r * math.sin(la)))

# ---------------------------------------------------------------- base
def base():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'; sc.cycles.samples = AMOSTRAS; sc.cycles.use_denoising = True
    w, h = map(int, RES.split('x')); sc.render.resolution_x, sc.render.resolution_y = w, h
    sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
    sc.render.fps = 30; sc.frame_start = 1; sc.frame_end = 150
    if GPU:
        pr = bpy.context.preferences.addons['cycles'].preferences; pr.compute_device_type = 'OPTIX'; pr.get_devices()
        for d in pr.devices: d.use = True
        sc.cycles.device = 'GPU'; sc.render.use_persistent_data = True; sc.cycles.denoiser = 'OPTIX'
    return sc

def mat(nome):
    m = bpy.data.materials.new(nome); m.use_nodes = True; m.node_tree.nodes.clear(); return m, m.node_tree.nodes, m.node_tree.links

def emissivo(nome, cor, forca):
    m, n, L = mat(nome); e = n.new('ShaderNodeEmission'); e.inputs['Color'].default_value = (*cor, 1); e.inputs['Strength'].default_value = forca
    o = n.new('ShaderNodeOutputMaterial'); L.new(e.outputs[0], o.inputs[0]); return m

def espaco(estrelas=0.6):
    sc = bpy.context.scene; w = bpy.data.worlds.new('espaco'); sc.world = w; w.use_nodes = True
    nt = w.node_tree; nt.nodes.clear(); o = nt.nodes.new('ShaderNodeOutputWorld'); bg = nt.nodes.new('ShaderNodeBackground')
    v = nt.nodes.new('ShaderNodeTexVoronoi'); v.inputs['Scale'].default_value = 420
    r = nt.nodes.new('ShaderNodeValToRGB'); r.color_ramp.elements[0].color = (1, 1, 1, 1); r.color_ramp.elements[1].position = 0.035; r.color_ramp.elements[1].color = (0, 0, 0, 1)
    tc = nt.nodes.new('ShaderNodeTexCoord'); nt.links.new(tc.outputs['Generated'], v.inputs['Vector']); nt.links.new(v.outputs['Distance'], r.inputs['Fac'])
    m = nt.nodes.new('ShaderNodeMath'); m.operation = 'MULTIPLY'; m.inputs[1].default_value = estrelas
    nt.links.new(r.outputs['Color'], m.inputs[0]); nt.links.new(m.outputs[0], bg.inputs['Strength']); nt.links.new(bg.outputs[0], o.inputs[0])

def camera(loc, alvo, lente=50):
    bpy.ops.object.camera_add(location=loc); c = bpy.context.object; bpy.context.scene.camera = c; c.data.lens = lente
    c.rotation_euler = (Vector(alvo) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); bpy.context.view_layer.update(); return c

def sol_luz(direcao, energia=5.0):
    bpy.ops.object.light_add(type='SUN'); s = bpy.context.object; s.data.energy = energia; s.data.angle = math.radians(1.2)
    s.data.color = (1.0, 0.94, 0.86); s.rotation_euler = (-Vector(direcao)).to_track_quat('-Z', 'Y').to_euler(); return s

# ---------------------------------------------------------------- Terra
def terra(sol_dir, luzes=9.0, anomalia=0.0, nuvens=True):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=256, ring_count=128, radius=1); t = bpy.context.object; bpy.ops.object.shade_smooth(); t.name = 'terra'
    m, n, L = mat('terra'); t.data.materials.append(m)
    o = n.new('ShaderNodeOutputMaterial'); p = n.new('ShaderNodeBsdfPrincipled'); p.inputs['Roughness'].default_value = 0.6
    tco = n.new('ShaderNodeTexCoord'); nrm = n.new('ShaderNodeVectorMath'); nrm.operation = 'NORMALIZE'; L.new(tco.outputs['Object'], nrm.inputs[0])
    sp = n.new('ShaderNodeSeparateXYZ'); L.new(nrm.outputs[0], sp.inputs[0])
    at = n.new('ShaderNodeMath'); at.operation = 'ARCTAN2'; L.new(sp.outputs['Y'], at.inputs[0]); L.new(sp.outputs['X'], at.inputs[1])
    u = n.new('ShaderNodeMath'); u.operation = 'MULTIPLY_ADD'; u.inputs[1].default_value = 1 / (2 * math.pi); u.inputs[2].default_value = 0.5; L.new(at.outputs[0], u.inputs[0])
    asn = n.new('ShaderNodeMath'); asn.operation = 'ARCSINE'; L.new(sp.outputs['Z'], asn.inputs[0])
    v = n.new('ShaderNodeMath'); v.operation = 'MULTIPLY_ADD'; v.inputs[1].default_value = 1 / math.pi; v.inputs[2].default_value = 0.5; L.new(asn.outputs[0], v.inputs[0])
    uv = n.new('ShaderNodeCombineXYZ'); L.new(u.outputs[0], uv.inputs['X']); L.new(v.outputs[0], uv.inputs['Y'])
    def img(f, cs='sRGB'):
        x = n.new('ShaderNodeTexImage'); x.image = bpy.data.images.load(os.path.join(A, 'terra', f)); x.image.colorspace_settings.name = cs
        x.interpolation = 'Cubic'; x.extension = 'EXTEND'; L.new(uv.outputs[0], x.inputs['Vector']); return x
    dia, noite = img('earth-blue-marble.jpg'), img('earth-night.jpg')
    cor = dia.outputs['Color']
    nub = None
    if nuvens:
        nv = img('cloud_combined_2048.jpg', 'Non-Color'); mx = n.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.inputs['B'].default_value = (1, 1, 1, 1)
        L.new(nv.outputs['Color'], mx.inputs['Factor']); L.new(dia.outputs['Color'], mx.inputs['A']); cor = mx.outputs['Result']
        nub = n.new('ShaderNodeMath'); nub.operation = 'SUBTRACT'; nub.inputs[0].default_value = 1; nub.use_clamp = True; L.new(nv.outputs['Color'], nub.inputs[1])
    L.new(cor, p.inputs['Base Color'])
    geo = n.new('ShaderNodeNewGeometry'); dt = n.new('ShaderNodeVectorMath'); dt.operation = 'DOT_PRODUCT'; dt.inputs[1].default_value = tuple(Vector(sol_dir).normalized())
    L.new(geo.outputs['Normal'], dt.inputs[0])
    nf = n.new('ShaderNodeMath'); nf.operation = 'MULTIPLY_ADD'; nf.use_clamp = True; nf.inputs[1].default_value = -5; nf.inputs[2].default_value = 0.2; L.new(dt.outputs['Value'], nf.inputs[0])
    lum = n.new('ShaderNodeRGBToBW'); L.new(noite.outputs['Color'], lum.inputs[0])
    g = n.new('ShaderNodeMath'); g.operation = 'POWER'; g.inputs[1].default_value = 1.4; L.new(lum.outputs[0], g.inputs[0])
    e1 = n.new('ShaderNodeMath'); e1.operation = 'MULTIPLY'; L.new(g.outputs[0], e1.inputs[0]); L.new(nf.outputs[0], e1.inputs[1])
    ult = e1
    if nub:
        e2 = n.new('ShaderNodeMath'); e2.operation = 'MULTIPLY'; L.new(e1.outputs[0], e2.inputs[0]); L.new(nub.outputs[0], e2.inputs[1]); ult = e2
    e3 = n.new('ShaderNodeMath'); e3.operation = 'MULTIPLY'; e3.inputs[1].default_value = luzes; L.new(ult.outputs[0], e3.inputs[0]); e3.name = 'luzes'
    p.inputs['Emission Color'].default_value = (1.0, 0.66, 0.32, 1); L.new(e3.outputs[0], p.inputs['Emission Strength'])
    saida = p.outputs[0]
    if anomalia > 0:
        ds = n.new('ShaderNodeVectorMath'); ds.operation = 'DISTANCE'; ds.inputs[1].default_value = tuple(ll(-45, -26)); L.new(nrm.outputs[0], ds.inputs[0])
        rr = n.new('ShaderNodeMapRange'); rr.inputs['From Min'].default_value = 0.0; rr.inputs['From Max'].default_value = 0.32
        rr.inputs['To Min'].default_value = 1; rr.inputs['To Max'].default_value = 0; L.new(ds.outputs['Value'], rr.inputs['Value'])
        em = n.new('ShaderNodeEmission'); em.inputs['Color'].default_value = (1, 0.08, 0.02, 1)
        k = n.new('ShaderNodeMath'); k.operation = 'MULTIPLY'; k.inputs[1].default_value = anomalia; L.new(rr.outputs['Result'], k.inputs[0]); L.new(k.outputs[0], em.inputs['Strength'])
        ad = n.new('ShaderNodeAddShader'); L.new(saida, ad.inputs[0]); L.new(em.outputs[0], ad.inputs[1]); saida = ad.outputs[0]
    L.new(saida, o.inputs[0])
    # atmosfera
    bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=64, radius=1.022); at_ = bpy.context.object; bpy.ops.object.shade_smooth()
    ma, an, al = mat('atm'); at_.data.materials.append(ma)
    ao = an.new('ShaderNodeOutputMaterial'); em = an.new('ShaderNodeEmission'); tr = an.new('ShaderNodeBsdfTransparent'); mx = an.new('ShaderNodeMixShader')
    lw = an.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.12
    pw = an.new('ShaderNodeMath'); pw.operation = 'POWER'; pw.inputs[1].default_value = 3; al.new(lw.outputs['Facing'], pw.inputs[0])
    em.inputs['Color'].default_value = (0.25, 0.55, 1, 1); em.inputs['Strength'].default_value = 2.2
    al.new(pw.outputs[0], mx.inputs['Fac']); al.new(tr.outputs[0], mx.inputs[1]); al.new(em.outputs[0], mx.inputs[2]); al.new(mx.outputs[0], ao.inputs[0])
    return t

def campo(cam_dir, compressao=0.0, rasgo=True, forca=1.4, sol_dir=None):
    """Linhas dipolares nos planos perpendiculares à visão. compressao>0 achata o lado do Sol e estica o oposto."""
    inc = math.radians(-10); SAA = ll(-45, -26)
    def eixo(q): return Vector((q.x, q.y * math.cos(inc) - q.z * math.sin(inc), q.y * math.sin(inc) + q.z * math.cos(inc)))
    m1 = emissivo('campo', (1.0, 0.22, 0.02), forca); m2 = emissivo('campo_fraco', (1.0, 0.08, 0.02), forca * 0.6)
    phi0 = math.atan2(cam_dir.y, cam_dir.x) + math.pi / 2
    sd = Vector(sol_dir).normalized() if sol_dir else None
    for Lsh in [1.3, 1.55, 1.85, 2.25, 2.75, 3.4]:
        for j in range(10):
            phi = phi0 + (j % 5 - 2) * math.radians(9) + (math.pi if j >= 5 else 0)
            pts = []
            for i in range(161):
                th = 0.02 + (math.pi - 0.04) * i / 160; r = Lsh * math.sin(th) ** 2
                if r < 1.02: continue
                q = eixo(Vector((r * math.sin(th) * math.cos(phi), r * math.sin(th) * math.sin(phi), r * math.cos(th))))
                if sd and compressao:
                    k = q.dot(sd)
                    q = q - sd * k * (compressao * 0.45 if k > 0 else -compressao * 0.9)
                pts.append(q)
            segs, seg = [], []
            for q in pts:
                if rasgo and (q.normalized() - SAA).length < 0.55 and q.length < 2.0:
                    if len(seg) > 3: segs.append(seg)
                    seg = []
                else: seg.append(q)
            if len(seg) > 3: segs.append(seg)
            for s in segs:
                cu = bpy.data.curves.new('l', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 0.0028
                spl = cu.splines.new('POLY'); spl.points.add(len(s) - 1)
                for i, q in enumerate(s): spl.points[i].co = (*q, 1)
                ob = bpy.data.objects.new('linha', cu); bpy.context.scene.collection.objects.link(ob); ob.visible_shadow = False
                ob.data.materials.append(m1 if len(segs) == 1 else m2)

# ---------------------------------------------------------------- Sol
def sol(loc, raio, forca=2.4):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=64, radius=raio, location=loc); s = bpy.context.object; bpy.ops.object.shade_smooth()
    m, n, L = mat('sol'); s.data.materials.append(m)
    o = n.new('ShaderNodeOutputMaterial'); e = n.new('ShaderNodeEmission')
    tc = n.new('ShaderNodeTexCoord')
    vo = n.new('ShaderNodeTexVoronoi'); vo.feature = 'DISTANCE_TO_EDGE'; vo.inputs['Scale'].default_value = 60
    nz = n.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 4; nz.inputs['Detail'].default_value = 8
    L.new(tc.outputs['Object'], vo.inputs['Vector']); L.new(tc.outputs['Object'], nz.inputs['Vector'])
    mx = n.new('ShaderNodeMath'); mx.operation = 'MULTIPLY_ADD'; mx.inputs[2].default_value = 0.0
    L.new(vo.outputs['Distance'], mx.inputs[0]); L.new(nz.outputs['Fac'], mx.inputs[1])
    cr = n.new('ShaderNodeValToRGB'); el = cr.color_ramp.elements
    el[0].position = 0.0; el[0].color = (0.35, 0.03, 0.0, 1); el[1].position = 0.14; el[1].color = (1.0, 0.42, 0.04, 1)
    L.new(mx.outputs[0], cr.inputs['Fac'])
    # escurecimento de borda (limb darkening)
    lw = n.new('ShaderNodeLayerWeight'); lw.inputs['Blend'].default_value = 0.35
    inv = n.new('ShaderNodeMath'); inv.operation = 'SUBTRACT'; inv.inputs[0].default_value = 1; L.new(lw.outputs['Facing'], inv.inputs[1])
    fz = n.new('ShaderNodeMath'); fz.operation = 'MULTIPLY_ADD'; fz.inputs[1].default_value = forca * 0.8; fz.inputs[2].default_value = forca * 0.25
    L.new(inv.outputs[0], fz.inputs[0])
    L.new(cr.outputs['Color'], e.inputs['Color']); L.new(fz.outputs[0], e.inputs['Strength']); L.new(e.outputs[0], o.inputs[0])
    return s

def protuberancia(centro, raio, ang=20):
    """Arco de plasma na borda do Sol (vista lateral)."""
    m = emissivo('prot', (1.0, 0.25, 0.03), 4)
    c = Vector(centro)
    random.seed(2)
    for k in range(28):
        pts = []; h = random.uniform(0.10, 0.24); w = random.uniform(10, 18); fase = random.uniform(-3, 3)
        for i in range(60):
            t = i / 59 * math.pi
            r = raio * (0.995 + h * math.sin(t) + 0.012 * math.sin(7 * t + k))
            a = math.radians(ang + fase) + (t / math.pi - 0.5) * math.radians(w)
            pts.append(c + Vector((r * math.cos(a), random.uniform(-0.02, 0.02) * raio, r * math.sin(a))))
        cu = bpy.data.curves.new('p', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = raio * random.uniform(0.002, 0.005)
        sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
        for i, q in enumerate(pts): sp.points[i].co = (*q, 1)
        ob = bpy.data.objects.new('prot', cu); bpy.context.scene.collection.objects.link(ob); ob.data.materials.append(m)

def cme(loc, escala, densidade=0.6):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=1, location=loc); b = bpy.context.object
    b.scale = escala
    m, n, L = mat('cme'); b.data.materials.append(m)
    o = n.new('ShaderNodeOutputMaterial'); vp = n.new('ShaderNodeVolumePrincipled')
    tc = n.new('ShaderNodeTexCoord'); nz = n.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 3.5; nz.inputs['Detail'].default_value = 10
    L.new(tc.outputs['Object'], nz.inputs['Vector'])
    # mais denso na casca (frente de choque)
    ln = n.new('ShaderNodeVectorMath'); ln.operation = 'LENGTH'; L.new(tc.outputs['Object'], ln.inputs[0])
    sh = n.new('ShaderNodeMapRange'); sh.inputs['From Min'].default_value = 0.55; sh.inputs['From Max'].default_value = 1.0; sh.inputs['To Min'].default_value = 0; sh.inputs['To Max'].default_value = 1
    L.new(ln.outputs['Value'], sh.inputs['Value'])
    cr = n.new('ShaderNodeMapRange'); cr.inputs['From Min'].default_value = 0.4; cr.inputs['From Max'].default_value = 0.75; L.new(nz.outputs['Fac'], cr.inputs['Value'])
    mu = n.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; L.new(cr.outputs['Result'], mu.inputs[0]); L.new(sh.outputs['Result'], mu.inputs[1])
    d = n.new('ShaderNodeMath'); d.operation = 'MULTIPLY'; d.inputs[1].default_value = densidade; L.new(mu.outputs[0], d.inputs[0])
    L.new(d.outputs[0], vp.inputs['Density']); vp.inputs['Color'].default_value = (1, 0.5, 0.15, 1)
    vp.inputs['Emission Color'].default_value = (1.0, 0.42, 0.08, 1)
    es = n.new('ShaderNodeMath'); es.operation = 'MULTIPLY'; es.inputs[1].default_value = 1.6; L.new(mu.outputs[0], es.inputs[0]); L.new(es.outputs[0], vp.inputs['Emission Strength'])
    L.new(vp.outputs[0], o.inputs['Volume'])
    return b

def satelite(loc, rot, esc=0.05):
    corpo = emissivo('dummy', (0, 0, 0), 0)
    mo, n, L = mat('ouro'); p = n.new('ShaderNodeBsdfPrincipled'); p.inputs['Base Color'].default_value = (0.9, 0.62, 0.2, 1); p.inputs['Metallic'].default_value = 1; p.inputs['Roughness'].default_value = 0.35
    o = n.new('ShaderNodeOutputMaterial'); L.new(p.outputs[0], o.inputs[0])
    mp, n2, L2 = mat('painel'); p2 = n2.new('ShaderNodeBsdfPrincipled'); p2.inputs['Base Color'].default_value = (0.03, 0.06, 0.16, 1); p2.inputs['Metallic'].default_value = 0.6; p2.inputs['Roughness'].default_value = 0.2
    o2 = n2.new('ShaderNodeOutputMaterial'); L2.new(p2.outputs[0], o2.inputs[0])
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot); c = bpy.context.object; c.scale = (esc, esc * 0.8, esc * 1.2); c.data.materials.append(mo)
    for s in (-1, 1):
        bpy.ops.mesh.primitive_cube_add(size=1); pn = bpy.context.object; pn.parent = c
        pn.location = (s * 2.6, 0, 0); pn.scale = (3.2, 0.9, 0.04); pn.data.materials.append(mp)

def cme_fios(origem, direcao, comprimento, abertura=0.45, n=160, forca=3.0, seed=5):
    """Nuvem de plasma como feixe de filamentos emissivos saindo da origem num cone; a frente forma uma bolha."""
    random.seed(seed); o = Vector(origem); d = Vector(direcao).normalized()
    up = Vector((0, 0, 1)) if abs(d.z) < 0.9 else Vector((1, 0, 0)); e1 = d.cross(up).normalized(); e2 = d.cross(e1).normalized()
    ms = [emissivo('cme%d' % k, c, forca * f) for k, (c, f) in enumerate([((1.0, 0.45, 0.08), 1.0), ((1.0, 0.25, 0.03), 0.7), ((1.0, 0.7, 0.3), 1.3)])]
    for i in range(n):
        th = random.uniform(0, 2 * math.pi); r = abertura * math.sqrt(random.random())
        dirf = (d + e1 * (r * math.cos(th)) + e2 * (r * math.sin(th))).normalized()
        L = comprimento * (1 - 0.35 * (r / abertura) ** 2) * random.uniform(0.75, 1.0)
        pts = []; ondula = random.uniform(-0.15, 0.15)
        for k in range(30):
            t = k / 29; q = o + dirf * (L * t) + (e1 * math.sin(t * 6 + i) + e2 * math.cos(t * 5 + i)) * (ondula * L * 0.06 * t)
            pts.append(q)
        cu = bpy.data.curves.new('c', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = comprimento * random.uniform(0.00025, 0.0007)
        cu.taper_radius_mode = 'MULTIPLY'
        sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
        for k, q in enumerate(pts): sp.points[k].co = (*q, 1); sp.points[k].radius = 0.3 + 1.4 * (k / 29) ** 2
        ob = bpy.data.objects.new('cme', cu); bpy.context.scene.collection.objects.link(ob); ob.data.materials.append(random.choice(ms)); ob.visible_shadow = False

# ---------------------------------------------------------------- planos
def plano_espaco_terra(cam_lonlat, dist, alvo_z=0.0, lente=50, sol_cam=(0.8, 0.5, 0.45), luzes=9, anomalia=0.0, linhas=False, compressao=0.0, rasgo=True, sol_visivel=None, estrelas=0.6):
    espaco(estrelas)
    cd = ll(*cam_lonlat).normalized()
    c = camera(cd * dist, (0, 0, alvo_z), lente)
    cx = c.matrix_world.to_3x3(); sd = (cx @ Vector(sol_cam)).normalized()
    sol_luz(sd)
    terra(sd, luzes=luzes, anomalia=anomalia)
    if linhas: campo(cd, compressao=compressao, rasgo=rasgo, sol_dir=sd)
    if sol_visivel:
        dt = (cx @ Vector((sol_visivel[0], sol_visivel[1], -1))).normalized()
        sol(c.location + dt * 30, sol_visivel[2])
    return c, sd, cx

def S01():  # close do Sol com protuberância
    espaco(0.3); camera((0, -12, 0), (1.9, 0, 1.4), 50); sol((0, 0, 0), 3.2, 2.2); protuberancia((0, 0, 0), 3.2, ang=40)

def S02():  # Terra à noite, Brasil iluminado
    plano_espaco_terra((-48, -14), 2.6, alvo_z=0.0, sol_cam=(-1.0, 0.25, -0.45), luzes=45)

def S03():  # sala à noite, celular com mapa na mesa
    sc = bpy.context.scene
    w = bpy.data.worlds.new('noite'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs['Color'].default_value = (0.01, 0.012, 0.02, 1); bg.inputs['Strength'].default_value = 0.3
    def imp(nome, loc, rot=0, esc=1):
        bpy.ops.import_scene.gltf(filepath=os.path.join(A, nome, nome + '.gltf'))
        obs = bpy.context.selected_objects; raiz = [o for o in obs if o.parent is None]
        for r in raiz: r.location = loc; r.rotation_euler = (0, 0, math.radians(rot)); r.scale = (esc, esc, esc)
        return raiz
    imp('modern_coffee_table_01', (0, 0, 0)); imp('sofa_03', (0, 1.25, 0), 180); imp('potted_plant_01', (1.6, 1.4, 0))
    imp('side_table_01', (-1.5, 1.3, 0))
    # chão e parede
    def piso():
        bpy.ops.mesh.primitive_plane_add(size=12); p = bpy.context.object
        m, n, L = mat('piso'); p.data.materials.append(m); b = n.new('ShaderNodeBsdfPrincipled'); o = n.new('ShaderNodeOutputMaterial')
        t = n.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(os.path.join(A, 'tex/wood_floor_deck/wood_floor_deck_Diffuse.jpg'))
        tc = n.new('ShaderNodeTexCoord'); mp = n.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (3, 3, 3)
        L.new(tc.outputs['UV'], mp.inputs[0]); L.new(mp.outputs[0], t.inputs[0]); L.new(t.outputs[0], b.inputs['Base Color']); b.inputs['Roughness'].default_value = 0.45
        L.new(b.outputs[0], o.inputs[0])
    piso()
    bpy.ops.mesh.primitive_plane_add(size=12, location=(0, 2.4, 3), rotation=(math.pi / 2, 0, 0)); pw = bpy.context.object
    m, n, L = mat('parede'); pw.data.materials.append(m); b = n.new('ShaderNodeBsdfPrincipled'); b.inputs['Base Color'].default_value = (0.75, 0.68, 0.58, 1)
    o = n.new('ShaderNodeOutputMaterial'); L.new(b.outputs[0], o.inputs[0])
    # celular: tampo da mesa ~ z da mesa; mede a mesa
    bpy.context.view_layer.update()
    topo = max((ob.matrix_world @ Vector(v)).z for ob in bpy.data.objects if ob.type == 'MESH' and 'coffee' in ob.name.lower() for v in ob.bound_box) if any('coffee' in ob.name.lower() for ob in bpy.data.objects) else 0.42
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.08, -0.05, topo + 0.005), rotation=(0, 0, math.radians(-14))); cel = bpy.context.object
    cel.scale = (0.075, 0.16, 0.009)
    m, n, L = mat('cel'); cel.data.materials.append(m)
    b = n.new('ShaderNodeBsdfPrincipled'); b.inputs['Base Color'].default_value = (0.01, 0.01, 0.012, 1); b.inputs['Roughness'].default_value = 0.15
    t = n.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(os.path.join(AQUI, 'texturas/tela_celular.png'))
    tc = n.new('ShaderNodeTexCoord'); mp = n.new('ShaderNodeMapping'); mp.inputs['Location'].default_value = (0.5, 0.5, 0); mp.inputs['Scale'].default_value = (1 / 0.9, 1 / 0.92, 1)
    L.new(tc.outputs['Object'], mp.inputs[0]); L.new(mp.outputs[0], t.inputs[0])
    sepz = n.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Object'], sepz.inputs[0])
    gt = n.new('ShaderNodeMath'); gt.operation = 'GREATER_THAN'; gt.inputs[1].default_value = 0.45; L.new(sepz.outputs['Z'], gt.inputs[0])
    em = n.new('ShaderNodeMath'); em.operation = 'MULTIPLY'; em.inputs[1].default_value = 3.0; L.new(gt.outputs[0], em.inputs[0])
    b.inputs['Emission Color'].default_value = (1, 1, 1, 1); L.new(t.outputs['Color'], b.inputs['Emission Color']); L.new(em.outputs[0], b.inputs['Emission Strength'])
    o = n.new('ShaderNodeOutputMaterial'); L.new(b.outputs[0], o.inputs[0])
    # luzes: luz azul de TV (fora de quadro, frente), abajur quente atrás
    bpy.ops.object.light_add(type='AREA', location=(0, -2.6, 1.0)); tv = bpy.context.object; tv.data.energy = 260; tv.data.color = (0.45, 0.6, 1.0); tv.data.size = 1.2
    tv.rotation_euler = (Vector((0, 0, 0.4)) - tv.location).to_track_quat('-Z', 'Y').to_euler()
    bpy.ops.object.light_add(type='POINT', location=(-1.5, 1.3, 1.2)); ab = bpy.context.object; ab.data.energy = 140; ab.data.color = (1.0, 0.65, 0.35); ab.data.shadow_soft_size = 0.3
    camera((0.6, -0.8, topo + 0.45), (0.06, -0.02, topo), 42)
    c = bpy.context.scene.camera; c.data.dof.use_dof = True; c.data.dof.focus_distance = (c.location - Vector((0.08, -0.05, topo))).length; c.data.dof.aperture_fstop = 2.2

def S04():  # Terra e Sol (o clarão é feito na pós)
    plano_espaco_terra((-40, -12), 4.4, alvo_z=0.25, sol_cam=(0.6, 0.4, 0.6), sol_visivel=(0.30, 0.13, 1.4), luzes=6)

def S05():  # nuvem saindo do Sol em direção à câmera/Terra
    espaco(0.4); camera((0, -30, 2), (-1.5, 1.5, 0), 35); sol((-14, 7, 0), 3.0)
    cme_fios((-14, 7, 0), (1, -0.42, 0), 21, abertura=0.55, n=520, forca=2.0)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.55, location=(8.5, -2.2, -0.4)); t = bpy.context.object; bpy.ops.object.shade_smooth()
    m, n, L = mat('terra_peq'); t.data.materials.append(m); b = n.new('ShaderNodeBsdfPrincipled'); b.inputs['Base Color'].default_value = (0.1, 0.25, 0.6, 1)
    o = n.new('ShaderNodeOutputMaterial'); L.new(b.outputs[0], o.inputs[0]); sol_luz(Vector((-1, 0.4, 0)))

def S06():  # telégrafo à noite com faísca
    sc = bpy.context.scene
    w = bpy.data.worlds.new('noite'); sc.world = w; w.use_nodes = True; nt = w.node_tree
    bg = nt.nodes['Background']; sky = nt.nodes.new('ShaderNodeTexSky') if False else None
    bg.inputs['Color'].default_value = (0.02, 0.03, 0.07, 1); bg.inputs['Strength'].default_value = 1.0
    mm, n, L = mat('madeira'); b = n.new('ShaderNodeBsdfPrincipled'); b.inputs['Base Color'].default_value = (0.45, 0.24, 0.08, 1); b.inputs['Roughness'].default_value = 0.8
    nz = n.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 40; tc = n.new('ShaderNodeTexCoord'); mp = n.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1, 1, 0.05)
    L.new(tc.outputs['Object'], mp.inputs[0]); L.new(mp.outputs[0], nz.inputs[0]); bump = n.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.4
    L.new(nz.outputs['Fac'], bump.inputs['Height']); L.new(bump.outputs[0], b.inputs['Normal'])
    o = n.new('ShaderNodeOutputMaterial'); L.new(b.outputs[0], o.inputs[0])
    bpy.ops.mesh.primitive_cylinder_add(radius=0.11, depth=7, location=(0, 0, 3.5)); bpy.context.object.data.materials.append(mm)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 6.5)); cr = bpy.context.object; cr.scale = (1.4, 0.09, 0.09); cr.data.materials.append(mm)
    mv, n, L = mat('vidro'); g = n.new('ShaderNodeBsdfGlass'); g.inputs['Color'].default_value = (0.6, 0.9, 0.8, 1); g.inputs['Roughness'].default_value = 0.05
    o = n.new('ShaderNodeOutputMaterial'); L.new(g.outputs[0], o.inputs[0])
    mfio = emissivo('fio_dummy', (0, 0, 0), 0)
    mf, n, L = mat('fio'); b = n.new('ShaderNodeBsdfPrincipled'); b.inputs['Base Color'].default_value = (0.35, 0.22, 0.12, 1); b.inputs['Metallic'].default_value = 1; b.inputs['Roughness'].default_value = 0.4
    o = n.new('ShaderNodeOutputMaterial'); L.new(b.outputs[0], o.inputs[0])
    for x in (-1.15, 1.15):
        bpy.ops.mesh.primitive_cone_add(radius1=0.09, radius2=0.05, depth=0.2, location=(x, 0, 6.68)); bpy.context.object.data.materials.append(mv)
        cu = bpy.data.curves.new('fio', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 0.008
        sp = cu.splines.new('POLY'); pts = [(x, -25 + i * 1.0, 6.78 - 0.25 * math.sin(math.pi * ((i % 25) / 25))) for i in range(51)]
        sp.points.add(len(pts) - 1)
        for i, q in enumerate(pts): sp.points[i].co = (*q, 1)
        ob = bpy.data.objects.new('fio', cu); bpy.context.scene.collection.objects.link(ob); ob.data.materials.append(mf)
    # faísca: zigue-zague emissivo entre o fio e o isolador direito
    random.seed(4); mfa = emissivo('faisca', (0.55, 0.75, 1.0), 40)
    p0 = Vector((1.15, -0.05, 6.8)); p1 = Vector((1.35, -0.25, 6.35)); pts = []
    for i in range(12):
        t = i / 11; q = p0.lerp(p1, t) + (Vector((random.uniform(-.05, .05), random.uniform(-.05, .05), random.uniform(-.05, .05))) if 0 < i < 11 else Vector())
        pts.append(q)
    cu = bpy.data.curves.new('faisca', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 0.0035; sp = cu.splines.new('POLY'); sp.points.add(len(pts) - 1)
    for i, q in enumerate(pts): sp.points[i].co = (*q, 1)
    ob = bpy.data.objects.new('faisca', cu); bpy.context.scene.collection.objects.link(ob); ob.data.materials.append(mfa)
    bpy.ops.object.light_add(type='POINT', location=(1.25, -0.2, 6.6)); lz = bpy.context.object; lz.data.energy = 80; lz.data.color = (0.55, 0.75, 1.0); lz.data.shadow_soft_size = 0.05
    bpy.ops.object.light_add(type='SUN'); lu = bpy.context.object; lu.data.energy = 1.2; lu.data.color = (0.6, 0.7, 1.0); lu.rotation_euler = (math.radians(50), 0, math.radians(30))
    camera((2.6, -2.9, 5.2), (1.0, 0, 6.6), 40)
    c = bpy.context.scene.camera; c.data.dof.use_dof = True; c.data.dof.focus_distance = (c.location - Vector((1.15, 0, 6.7))).length; c.data.dof.aperture_fstop = 2.8

def S07():  # satélites em órbita sobre a Terra
    c, sd, cx = plano_espaco_terra((-35, 5), 1.75, alvo_z=0.75, lente=30, sol_cam=(0.6, 0.6, 0.3), luzes=6)
    random.seed(9)
    for i in range(14):
        a = random.uniform(-0.9, 0.9); h = random.uniform(1.12, 1.3)
        p = (cx @ Vector((a * 0.5, random.uniform(0.05, 0.35), -random.uniform(0.35, 0.9))))
        loc = c.location + p
        satelite(loc, (random.uniform(0, 3), random.uniform(0, 3), random.uniform(0, 3)), esc=random.uniform(0.012, 0.03))

def S08():  # escudo: linhas do campo, câmera sobre a América do Sul
    plano_espaco_terra((-45, -20), 3.9, alvo_z=0.0, linhas=True, rasgo=True, luzes=6, anomalia=0.0)

def S09():  # anomalia em close
    plano_espaco_terra((-45, -26), 2.5, alvo_z=0.0, lente=50, linhas=True, rasgo=True, luzes=6, anomalia=0.3)

def S10():  # Terra recuada com o Sol ao fundo
    plano_espaco_terra((-45, -18), 5.6, alvo_z=0.3, sol_cam=(0.6, 0.4, 0.6), sol_visivel=(0.31, 0.14, 1.4), linhas=True, rasgo=True, luzes=6, anomalia=0.4)

def S11():  # Brasil à noite, mais perto
    plano_espaco_terra((-46, -20), 1.75, alvo_z=0.0, lente=50, sol_cam=(-1.0, 0.25, -0.45), luzes=45)

def S14():  # impacto: escudo achatado do lado do Sol
    plano_espaco_terra((-45, -10), 6.0, alvo_z=0.0, lente=40, sol_cam=(1.0, 0.15, 0.0), linhas=True, compressao=1.0, rasgo=True, luzes=6, anomalia=0.6)
    c = bpy.context.scene.camera; cx = c.matrix_world.to_3x3()
    sdir = (cx @ Vector((1.0, 0.15, 0.0))).normalized()
    cme_fios(tuple(sdir * 9.0), tuple(-sdir), 7.6, abertura=0.42, n=520, forca=1.6)

if __name__ == '__main__':
    sc = base()
    globals()[PLANO]()
    sc.frame_set(QUADRO)
    sc.render.filepath = SAIDA
    bpy.ops.render.render(write_still=True)
    print('OK', PLANO, SAIDA)
