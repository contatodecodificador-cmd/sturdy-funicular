# Cozinha 3D do vídeo 6 (Brasil Milenar) — construída 100% por script (bpy).
# Eixos: X direita, Y para o fundo (parede do fundo em y=PY), Z para cima. Unidades: metros.
import bpy, bmesh, math, os, random
from mathutils import Vector

AQUI = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(AQUI, 'assets')
PY = 1.6            # parede do fundo
PX0, PX1 = -2.3, 2.3  # paredes laterais
PE = 2.7            # pé-direito
BALCAO = 0.9        # altura do balcão
MESA = (0.15, 0.05)  # centro da mesa (x, y)


# ---------------------------------------------------------------- utilidades
def col(nome):
    c = bpy.data.collections.get(nome) or bpy.data.collections.new(nome)
    if c.name not in bpy.context.scene.collection.children:
        bpy.context.scene.collection.children.link(c)
    return c


def mover_para(o, c):
    for cc in list(o.users_collection):
        cc.objects.unlink(o)
    c.objects.link(o)


def importar(nome, loc=(0, 0, 0), rot=(0, 0, 0), escala=1.0, c=None):
    """Importa um gltf do Poly Haven e devolve um Empty pai com tudo dentro."""
    antes = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=f'{A}/{nome}/{nome}.gltf')
    novos = [o for o in bpy.data.objects if o not in antes]
    pai = bpy.data.objects.new(nome, None)
    bpy.context.scene.collection.objects.link(pai)
    for o in novos:
        if o.parent is None:
            o.parent = pai
    pai.location = loc
    pai.rotation_euler = rot
    pai.scale = (escala,) * 3
    if c:
        mover_para(pai, c)
        for o in novos:
            mover_para(o, c)
    return pai, novos


def mat_simples(nome, cor, rough=0.5, metal=0.0, spec=0.5, coat=0.0):
    m = bpy.data.materials.get(nome)
    if m:
        return m
    m = bpy.data.materials.new(nome)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*cor, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    b.inputs['Coat Weight'].default_value = coat
    return m


def mat_pbr(nome, tex, escala=1.0, eixos='xy', tint=None, rough_mul=1.0, bump=0.3, valor=1.0):
    """Material PBR com projeção por coordenadas do objeto (sem UV). eixos: 'xy' chão, 'xz' parede fundo, 'yz' lateral."""
    m = bpy.data.materials.get(nome)
    if m:
        return m
    m = bpy.data.materials.new(nome)
    m.use_nodes = True
    nt = m.node_tree
    N, L = nt.nodes, nt.links
    b = N['Principled BSDF']
    tc = N.new('ShaderNodeTexCoord')
    sep = N.new('ShaderNodeSeparateXYZ')
    L.new(tc.outputs['Object'], sep.inputs[0])
    comb = N.new('ShaderNodeCombineXYZ')
    ix = {'x': 0, 'y': 1, 'z': 2}
    L.new(sep.outputs[ix[eixos[0]]], comb.inputs[0])
    L.new(sep.outputs[ix[eixos[1]]], comb.inputs[1])
    mp = N.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (escala, escala, escala)
    L.new(comb.outputs[0], mp.inputs[0])
    d = f'{A}/tex/{tex}/{tex}'

    def img(sufixo, nc=False):
        f = d + '_' + sufixo + '.jpg'
        if not os.path.exists(f):
            return None
        t = N.new('ShaderNodeTexImage')
        t.image = bpy.data.images.load(f, check_existing=True)
        if nc:
            t.image.colorspace_settings.name = 'Non-Color'
        L.new(mp.outputs[0], t.inputs[0])
        return t
    dif = img('Diffuse')
    if dif:
        if tint:
            mix = N.new('ShaderNodeMix')
            mix.data_type = 'RGBA'
            mix.blend_type = 'MULTIPLY'
            mix.inputs['Factor'].default_value = 1
            mix.inputs[6].default_value = dif.outputs[0].default_value
            L.new(dif.outputs[0], mix.inputs[6])
            mix.inputs[7].default_value = (*tint, 1)
            L.new(mix.outputs[2], b.inputs['Base Color'])
        elif valor != 1.0:
            hs = N.new('ShaderNodeHueSaturation'); hs.inputs['Value'].default_value = valor; hs.inputs['Saturation'].default_value = 0.85
            L.new(dif.outputs[0], hs.inputs['Color']); L.new(hs.outputs[0], b.inputs['Base Color'])
        else:
            L.new(dif.outputs[0], b.inputs['Base Color'])
    r = img('Rough', True)
    if r:
        mm = N.new('ShaderNodeMath')
        mm.operation = 'MULTIPLY'
        mm.inputs[1].default_value = rough_mul
        L.new(r.outputs[0], mm.inputs[0])
        L.new(mm.outputs[0], b.inputs['Roughness'])
    n = img('nor_gl', True)
    if n:
        nm = N.new('ShaderNodeNormalMap')
        nm.inputs['Strength'].default_value = bump
        L.new(n.outputs[0], nm.inputs['Color'])
        L.new(nm.outputs[0], b.inputs['Normal'])
    return m


def caixa(nome, centro, tam, mat, c, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(location=centro)
    o = bpy.context.object
    o.name = nome
    o.scale = (tam[0] / 2, tam[1] / 2, tam[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        bv = o.modifiers.new('bv', 'BEVEL')
        bv.width = bevel
        bv.segments = 3
        bv.limit_method = 'ANGLE'
    o.data.materials.append(mat)
    mover_para(o, c)
    return o


def plano(nome, centro, tam, rot, mat, c):
    bpy.ops.mesh.primitive_plane_add(location=centro, rotation=rot)
    o = bpy.context.object
    o.name = nome
    o.scale = (tam[0] / 2, tam[1] / 2, 1)
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(mat)
    mover_para(o, c)
    return o


def torno(nome, perfil, loc, mat, c, seg=96):
    """Sólido de revolução a partir de uma lista (r, z)."""
    me = bpy.data.meshes.new(nome)
    bm = bmesh.new()
    vs = [bm.verts.new((r, 0, z)) for r, z in perfil]
    for i in range(len(vs) - 1):
        bm.edges.new((vs[i], vs[i + 1]))
    bmesh.ops.spin(bm, geom=bm.verts[:] + bm.edges[:], cent=(0, 0, 0), axis=(0, 0, 1), angle=2 * math.pi, steps=seg, use_duplicate=False)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(nome, me)
    c.objects.link(o)
    o.location = loc
    for p in me.polygons:
        p.use_smooth = True
    o.data.materials.append(mat)
    return o


def _coords(N, L, eixos, escala):
    tc = N.new('ShaderNodeTexCoord'); sep = N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Object'], sep.inputs[0])
    ix = {'x': 0, 'y': 1, 'z': 2}
    return sep.outputs[ix[eixos[0]]], sep.outputs[ix[eixos[1]]]


def _m(N, L, op, a, b=None):
    m = N.new('ShaderNodeMath'); m.operation = op
    (L.new(a, m.inputs[0]) if not isinstance(a, (int, float)) else setattr(m.inputs[0], 'default_value', a))
    if b is not None:
        (L.new(b, m.inputs[1]) if not isinstance(b, (int, float)) else setattr(m.inputs[1], 'default_value', b))
    return m.outputs[0]


def mat_azulejo(nome, eixos, lado=0.15, rejunte=0.003):
    """Azulejo branco brasileiro 15x15 com rejunte, leve variação por peça e brilho de esmalte."""
    m = bpy.data.materials.new(nome); m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links; b = N['Principled BSDF']
    u, v = _coords(N, L, eixos, 1)
    fu = _m(N, L, 'FRACT', _m(N, L, 'DIVIDE', u, lado)); fv = _m(N, L, 'FRACT', _m(N, L, 'DIVIDE', v, lado))
    r = rejunte / lado
    du = _m(N, L, 'MINIMUM', fu, _m(N, L, 'SUBTRACT', 1.0, fu)); dv = _m(N, L, 'MINIMUM', fv, _m(N, L, 'SUBTRACT', 1.0, fv))
    d = _m(N, L, 'MINIMUM', du, dv)
    junta = _m(N, L, 'LESS_THAN', d, r)
    # variação por peça
    cid = N.new('ShaderNodeCombineXYZ'); L.new(_m(N, L, 'FLOOR', _m(N, L, 'DIVIDE', u, lado)), cid.inputs[0]); L.new(_m(N, L, 'FLOOR', _m(N, L, 'DIVIDE', v, lado)), cid.inputs[1])
    wn = N.new('ShaderNodeTexWhiteNoise'); wn.noise_dimensions = '3D'; L.new(cid.outputs[0], wn.inputs['Vector'])
    var = _m(N, L, 'ADD', 0.86, _m(N, L, 'MULTIPLY', wn.outputs['Value'], 0.06))
    cor = N.new('ShaderNodeCombineColor'); L.new(var, cor.inputs[0]); L.new(_m(N, L, 'MULTIPLY', var, 0.995), cor.inputs[1]); L.new(_m(N, L, 'MULTIPLY', var, 0.975), cor.inputs[2])
    mix = N.new('ShaderNodeMix'); mix.data_type = 'RGBA'; L.new(junta, mix.inputs['Factor']); L.new(cor.outputs[0], mix.inputs[6]); mix.inputs[7].default_value = (0.55, 0.53, 0.5, 1)
    L.new(mix.outputs[2], b.inputs['Base Color'])
    L.new(_m(N, L, 'ADD', 0.06, _m(N, L, 'MULTIPLY', junta, 0.8)), b.inputs['Roughness'])
    b.inputs['Coat Weight'].default_value = 0.5; b.inputs['Coat Roughness'].default_value = 0.05
    # bisotê: altura sobe nas bordas da peça
    alt = _m(N, L, 'MINIMUM', _m(N, L, 'DIVIDE', d, r * 3), 1.0)
    bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.6; bp.inputs['Distance'].default_value = 0.002
    L.new(alt, bp.inputs['Height']); L.new(bp.outputs[0], b.inputs['Normal'])
    return m


def mat_xadrez(nome, lado=0.025, cor=(0.72, 0.06, 0.06)):
    """Toalha xadrez (vichy) vermelha e branca: 3 tons + trama."""
    m = bpy.data.materials.new(nome); m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links; b = N['Principled BSDF']
    u, v = _coords(N, L, 'xy', 1)
    a = _m(N, L, 'LESS_THAN', _m(N, L, 'FRACT', _m(N, L, 'DIVIDE', u, lado * 2)), 0.5)
    c = _m(N, L, 'LESS_THAN', _m(N, L, 'FRACT', _m(N, L, 'DIVIDE', v, lado * 2)), 0.5)
    k = _m(N, L, 'MULTIPLY', _m(N, L, 'ADD', a, c), 0.5)  # 0, .5, 1
    rp = N.new('ShaderNodeValToRGB'); L.new(k, rp.inputs[0])
    rp.color_ramp.interpolation = 'CONSTANT'
    el = rp.color_ramp.elements
    el.new(0.4)
    el[0].position = 0.0; el[0].color = (0.93, 0.91, 0.88, 1)
    el[1].position = 0.4; el[1].color = (0.85, 0.42, 0.4, 1)
    el[2].position = 0.9; el[2].color = (*cor, 1)
    L.new(rp.outputs[0], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = 0.85; b.inputs['Sheen Weight'].default_value = 0.4
    # trama do tecido
    nt = N.new('ShaderNodeTexWave'); nt.inputs['Scale'].default_value = 900; nt.inputs['Distortion'].default_value = 2
    bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.15; L.new(nt.outputs['Fac'], bp.inputs['Height']); L.new(bp.outputs[0], b.inputs['Normal'])
    return m


def mat_tinta(nome, cor):
    """Parede pintada (látex) com textura leve de reboco."""
    m = bpy.data.materials.new(nome); m.use_nodes = True
    N, L = m.node_tree.nodes, m.node_tree.links; b = N['Principled BSDF']
    b.inputs['Base Color'].default_value = (*cor, 1); b.inputs['Roughness'].default_value = 0.85
    nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 180; nz.inputs['Detail'].default_value = 8
    bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.08
    L.new(nz.outputs['Fac'], bp.inputs['Height']); L.new(bp.outputs[0], b.inputs['Normal'])
    return m


# ---------------------------------------------------------------- materiais
def materiais():
    M = {}
    M['azulejo'] = mat_azulejo('azulejo', 'xz')
    M['azulejo_lat'] = mat_azulejo('azulejo_lat', 'yz')
    M['parede'] = mat_tinta('parede', (0.93, 0.86, 0.69))
    M['parede_lat'] = mat_tinta('parede_lat', (0.93, 0.86, 0.69))
    M['teto'] = mat_simples('teto', (0.85, 0.83, 0.8), 0.9)
    M['piso'] = mat_pbr('piso', 'terracotta_floor_tiles', 0.55, 'xy', rough_mul=0.7, bump=0.5, valor=1.7)
    M['granito'] = mat_pbr('granito', 'granite_tile', 0.7, 'xy', rough_mul=0.4, bump=0.1)
    M['armario'] = mat_simples('armario', (0.86, 0.85, 0.82), 0.35, coat=0.3)
    M['armario_porta'] = mat_simples('armario_porta', (0.82, 0.84, 0.86), 0.3, coat=0.4)
    M['inox'] = mat_simples('inox', (0.75, 0.75, 0.76), 0.25, metal=1.0)
    M['inox_esc'] = mat_simples('inox_esc', (0.55, 0.55, 0.56), 0.35, metal=1.0)
    M['geladeira'] = mat_simples('geladeira', (0.92, 0.92, 0.9), 0.18, coat=0.6)
    M['madeira'] = mat_pbr('madeira_prat', 'oak_veneer_01', 1.2, 'xy', rough_mul=0.9, bump=0.2)
    M['moldura'] = mat_simples('moldura_janela', (0.93, 0.93, 0.92), 0.4)
    M['toalha'] = mat_xadrez('toalha')
    M['cortina'] = mat_simples('cortina', (0.93, 0.83, 0.62), 0.8)
    b = M['cortina'].node_tree.nodes['Principled BSDF']
    b.inputs['Sheen Weight'].default_value = 0.5
    M['ima1'] = mat_simples('ima1', (0.9, 0.2, 0.15), 0.4)
    M['ima2'] = mat_simples('ima2', (0.1, 0.5, 0.8), 0.4)
    M['ima3'] = mat_simples('ima3', (0.95, 0.75, 0.1), 0.4)
    M['louca'] = mat_simples('louca', (0.95, 0.95, 0.93), 0.12, coat=0.8)
    M['louca_azul'] = mat_simples('louca_azul', (0.35, 0.55, 0.75), 0.15, coat=0.8)
    M['tomada'] = mat_simples('tomada', (0.95, 0.95, 0.95), 0.4)
    # vidro do copo e água
    v = bpy.data.materials.new('vidro')
    v.use_nodes = True
    bb = v.node_tree.nodes['Principled BSDF']
    bb.inputs['Base Color'].default_value = (0.97, 1.0, 0.99, 1)
    bb.inputs['Transmission Weight'].default_value = 1
    bb.inputs['Roughness'].default_value = 0.0
    bb.inputs['IOR'].default_value = 1.5
    M['vidro'] = v
    w = bpy.data.materials.new('agua')
    w.use_nodes = True
    bw = w.node_tree.nodes['Principled BSDF']
    bw.inputs['Base Color'].default_value = (0.9, 0.97, 1.0, 1)
    bw.inputs['Transmission Weight'].default_value = 1
    bw.inputs['Roughness'].default_value = 0.0
    bw.inputs['IOR'].default_value = 1.33
    M['agua'] = w
    jv = bpy.data.materials.new('vidro_janela')
    jv.use_nodes = True
    bj = jv.node_tree.nodes['Principled BSDF']
    bj.inputs['Transmission Weight'].default_value = 1
    bj.inputs['Roughness'].default_value = 0.02
    bj.inputs['IOR'].default_value = 1.05  # vidro fino: quase sem distorção
    M['vidro_janela'] = jv
    return M


# ---------------------------------------------------------------- arquitetura
def arquitetura(M):
    c = col('arquitetura')
    W = PX1 - PX0
    plano('piso', (0, -0.5, 0), (W, 5.0), (0, 0, 0), M['piso'], c)
    plano('teto', (0, -0.5, PE), (W, 5.0), (math.pi, 0, 0), M['teto'], c)
    # parede do fundo com vão da janela (janela x -1.75..-0.85, z 1.15..2.25)
    JX0, JX1, JZ0, JZ1 = -1.75, -0.85, 1.15, 2.25
    AZ = 1.55  # altura do azulejo
    pedacos = [  # (x0,x1,z0,z1,mat)
        (PX0, PX1, 0, AZ, 'azulejo'),
        (PX0, JX0, AZ, PE, 'parede'), (JX1, PX1, AZ, PE, 'parede'), (JX0, JX1, JZ1, PE, 'parede'),
    ]
    paredes = []
    for x0, x1, z0, z1, mm in pedacos:
        if mm == 'azulejo' and True:
            # azulejo com vão até a janela (a janela começa em 1.15)
            for (a0, a1, b0, b1) in [(PX0, JX0, z0, z1), (JX1, PX1, z0, z1), (JX0, JX1, z0, JZ0)]:
                p = plano('parede_azulejo', ((a0 + a1) / 2, PY, (b0 + b1) / 2), (a1 - a0, b1 - b0), (math.pi / 2, 0, 0), M['azulejo'], c)
                paredes.append(p)
        else:
            p = plano('parede_fundo', ((x0 + x1) / 2, PY, (z0 + z1) / 2), (x1 - x0, z1 - z0), (math.pi / 2, 0, 0), M[mm], c)
            paredes.append(p)
    # paredes laterais
    for x, s in [(PX0, 1), (PX1, -1)]:
        plano('lat_azulejo', (x, -0.5, AZ / 2), (5.0, AZ), (math.pi / 2, 0, math.pi / 2 * s), M['azulejo_lat'], c)
        plano('lat_parede', (x, -0.5, (AZ + PE) / 2), (5.0, PE - AZ), (math.pi / 2, 0, math.pi / 2 * s), M['parede_lat'], c)
    # parede atrás da câmera (fecha a luz)
    plano('parede_frente', (0, -3.0, PE / 2), (W, PE), (math.pi / 2, 0, math.pi), M['parede'], c)
    # faixa de acabamento entre azulejo e pintura
    caixa('filete', (0, PY - 0.006, AZ), (W, 0.012, 0.025), M['louca_azul'], c)
    # janela: batentes, folhas e vidro
    cj = col('janela')
    t = 0.05
    caixa('jan_peitoril', ((JX0 + JX1) / 2, PY - 0.06, JZ0 - 0.015), (JX1 - JX0 + 0.16, 0.2, 0.03), M['granito'], cj)
    for nome, cen, tam in [
        ('jan_esq', (JX0 + t / 2, PY, (JZ0 + JZ1) / 2), (t, 0.12, JZ1 - JZ0)),
        ('jan_dir', (JX1 - t / 2, PY, (JZ0 + JZ1) / 2), (t, 0.12, JZ1 - JZ0)),
        ('jan_cima', ((JX0 + JX1) / 2, PY, JZ1 - t / 2), (JX1 - JX0, 0.12, t)),
        ('jan_baixo', ((JX0 + JX1) / 2, PY, JZ0 + t / 2), (JX1 - JX0, 0.12, t)),
        ('jan_meio', ((JX0 + JX1) / 2, PY, (JZ0 + JZ1) / 2), (0.035, 0.08, JZ1 - JZ0)),
        ('jan_trav', ((JX0 + JX1) / 2, PY, JZ0 + (JZ1 - JZ0) * 0.62), (JX1 - JX0, 0.06, 0.03)),
    ]:
        caixa(nome, cen, tam, M['moldura'], cj, bevel=0.004)
    plano('jan_vidro', ((JX0 + JX1) / 2, PY + 0.01, (JZ0 + JZ1) / 2), (JX1 - JX0, JZ1 - JZ0), (math.pi / 2, 0, 0), M['vidro_janela'], cj)
    # vão (espessura da parede)
    for nome, cen, tam in [
        ('vao_esq', (JX0 - 0.005, PY + 0.07, (JZ0 + JZ1) / 2), (0.01, 0.14, JZ1 - JZ0)),
        ('vao_dir', (JX1 + 0.005, PY + 0.07, (JZ0 + JZ1) / 2), (0.01, 0.14, JZ1 - JZ0)),
        ('vao_cima', ((JX0 + JX1) / 2, PY + 0.07, JZ1 + 0.005), (JX1 - JX0, 0.14, 0.01)),
    ]:
        caixa(nome, cen, tam, M['parede'], cj)
    # cortinas (duas folhas com pregas) nas laterais da janela + varão
    for lado, xc in [('e', JX0 - 0.05), ('d', JX1 + 0.05)]:
        bpy.ops.mesh.primitive_grid_add(x_subdivisions=48, y_subdivisions=10, size=1, location=(xc, PY - 0.07, (JZ0 + JZ1) / 2 + 0.06), rotation=(math.pi / 2, 0, 0))
        ct = bpy.context.object; ct.name = 'cortina_' + lado
        ct.scale = (0.26, JZ1 - JZ0 + 0.3, 1); bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        for v in ct.data.vertices:
            v.co.z = 0.022 * math.sin(v.co.x * 62 + (1 if lado == 'e' else 2))
        for p in ct.data.polygons:
            p.use_smooth = True
        ct.data.materials.append(M['cortina'])
        so = ct.modifiers.new('sol', 'SOLIDIFY'); so.thickness = 0.003
        mover_para(ct, cj)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.011, depth=(JX1 - JX0) + 0.7, location=((JX0 + JX1) / 2, PY - 0.07, JZ1 + 0.22), rotation=(0, math.pi / 2, 0))
    vr = bpy.context.object; vr.name = 'varao'; vr.data.materials.append(M['inox_esc']); mover_para(vr, cj)
    # tomada na parede
    caixa('tomada', (0.55, PY - 0.004, 1.15), (0.08, 0.008, 0.12), M['tomada'], c, bevel=0.003)
    return {'janela': (JX0, JX1, JZ0, JZ1), 'paredes': paredes}


# ---------------------------------------------------------------- móveis fixos
def balcao(M):
    c = col('balcao')
    D = 0.6
    # balcão da pia: x -2.3 .. -0.62 ; fogão -0.6 .. -0.1 ; geladeira 0.05 .. 0.75 ; armário baixo 0.95 .. 2.3
    blocos = [(-2.3, -0.62), (0.95, 2.3)]
    for i, (x0, x1) in enumerate(blocos):
        caixa(f'arm_corpo{i}', ((x0 + x1) / 2, PY - D / 2, (BALCAO - 0.1) / 2 + 0.1), (x1 - x0, D - 0.02, BALCAO - 0.13), M['armario'], c)
        caixa(f'rodape{i}', ((x0 + x1) / 2, PY - D / 2 + 0.05, 0.05), (x1 - x0, D - 0.1, 0.1), M['inox_esc'], c)
        caixa(f'tampo{i}', ((x0 + x1) / 2, PY - D / 2 - 0.01, BALCAO - 0.015), (x1 - x0, D + 0.03, 0.03), M['granito'], c, bevel=0.004)
        n = max(1, round((x1 - x0) / 0.45))
        w = (x1 - x0) / n
        for k in range(n):
            xc = x0 + w * (k + 0.5)
            caixa(f'porta{i}_{k}', (xc, PY - D - 0.0, 0.48), (w - 0.012, 0.02, 0.68), M['armario_porta'], c, bevel=0.003)
            caixa(f'gaveta{i}_{k}', (xc, PY - D - 0.0, 0.83), (w - 0.012, 0.02, 0.1), M['armario_porta'], c, bevel=0.003)
            caixa(f'puxador{i}_{k}', (xc, PY - D - 0.016, 0.83), (0.12, 0.012, 0.012), M['inox'], c, bevel=0.002)
            caixa(f'puxadorp{i}_{k}', (xc + (w / 2 - 0.05) * (1 if k % 2 else -1), PY - D - 0.016, 0.7), (0.012, 0.012, 0.12), M['inox'], c, bevel=0.002)
    # cuba da pia sob a janela
    caixa('cuba_borda', (-1.3, PY - 0.3, BALCAO + 0.002), (0.62, 0.42, 0.006), M['inox'], c, bevel=0.002)
    caixa('cuba_fundo', (-1.3, PY - 0.3, BALCAO + 0.004), (0.54, 0.34, 0.004), M['inox_esc'], c)
    # torneira (curva)
    cu = bpy.data.curves.new('torneira', 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = 0.012
    cu.bevel_resolution = 6
    sp = cu.splines.new('BEZIER')
    pts = [(-1.3, PY - 0.08, BALCAO), (-1.3, PY - 0.08, BALCAO + 0.32), (-1.3, PY - 0.26, BALCAO + 0.22)]
    sp.bezier_points.add(len(pts) - 1)
    for bp, p in zip(sp.bezier_points, pts):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = 'AUTO'
    to = bpy.data.objects.new('torneira', cu)
    c.objects.link(to)
    to.data.materials.append(M['inox'])
    # fogão
    fg, _ = importar('electric_stove', loc=(-0.355, PY - 0.33, 0), rot=(0, 0, 0), escala=1.04, c=c)
    # geladeira
    G0, G1 = 0.07, 0.78
    gel = caixa('geladeira', ((G0 + G1) / 2, PY - 0.36, 0.9), (G1 - G0, 0.66, 1.8), M['geladeira'], c, bevel=0.03)
    caixa('gel_divisa', ((G0 + G1) / 2, PY - 0.69, 1.32), (G1 - G0 - 0.02, 0.012, 0.006), M['inox_esc'], c)
    caixa('gel_puxa1', (G0 + 0.07, PY - 0.71, 1.55), (0.025, 0.035, 0.3), M['inox'], c, bevel=0.008)
    caixa('gel_puxa2', (G0 + 0.07, PY - 0.71, 1.05), (0.025, 0.035, 0.35), M['inox'], c, bevel=0.008)
    for i, (x, z, m) in enumerate([(0.45, 1.5, 'ima1'), (0.6, 1.42, 'ima2'), (0.52, 1.1, 'ima3')]):
        caixa(f'ima{i}', (x, PY - 0.695, z), (0.06, 0.008, 0.05), M[m], c, bevel=0.003)
    # bilhete preso
    caixa('bilhete', (0.55, PY - 0.692, 1.22), (0.12, 0.002, 0.16), mat_simples('papel', (0.97, 0.95, 0.85), 0.9), c)
    # prateleiras de madeira com a louça (lado direito)
    prat = []
    for i, z in enumerate([1.38, 1.78]):
        p = caixa(f'prateleira{i}', (1.62, PY - 0.13, z), (1.25, 0.26, 0.03), M['madeira'], c, bevel=0.004)
        prat.append(p)
        for x in (1.1, 2.14):
            caixa(f'mao_francesa{i}_{x}', (x, PY - 0.08, z - 0.06), (0.025, 0.15, 0.1), M['inox_esc'], c)
    return {'geladeira': gel, 'prateleiras': prat, 'fogao': fg}


# ---------------------------------------------------------------- copo d'água (feito à mão)
def copo(M, loc):
    c = col('copo')
    R0, R1, H, E = 0.031, 0.037, 0.115, 0.0022  # raio base, raio boca, altura, espessura
    # perfil externo + interno (fechado): fundo grosso de 6 mm, borda arredondada
    ext = [(0.0, 0.0), (R0 - 0.003, 0.0), (R0, 0.002)]
    for i in range(1, 11):
        f = i / 10
        ext.append((R0 + (R1 - R0) * f, 0.002 + (H - 0.002) * f))
    borda = [(R1 - E * 0.5 + E * 0.5 * math.cos(a), H + E * 0.5 * math.sin(a)) for a in [math.pi * k / 6 for k in range(1, 6)]]
    inte = []
    for i in range(10, -1, -1):
        f = i / 10
        z = 0.006 + (H - 0.006) * f
        inte.append((R0 - E + (R1 - R0) * ((z) / H), z))
    perfil = ext + borda + inte + [(0.0, 0.006)]
    g = torno('copo_vidro', perfil, loc, M['vidro'], c, seg=128)
    # água: corpo + superfície em grade fina (para as ondas)
    NA = 0.072  # nível da água (≈ 2/3)
    ra = lambda z: R0 - E + (R1 - R0) * (z / H) - 0.0003
    me = bpy.data.meshes.new('agua')
    bm = bmesh.new()
    # superfície: disco com anéis concêntricos (boa resolução radial)
    aneis, seg = 40, 128
    centro = bm.verts.new((0, 0, NA))
    anel_ant = None
    for i in range(1, aneis + 1):
        r = ra(NA) * i / aneis
        anel = [bm.verts.new((r * math.cos(2 * math.pi * k / seg), r * math.sin(2 * math.pi * k / seg), NA)) for k in range(seg)]
        if anel_ant is None:
            for k in range(seg):
                bm.faces.new((centro, anel[k], anel[(k + 1) % seg]))
        else:
            for k in range(seg):
                bm.faces.new((anel_ant[k], anel[k], anel[(k + 1) % seg], anel_ant[(k + 1) % seg]))
        anel_ant = anel
    # parede lateral da água até o fundo
    niveis = [NA - (NA - 0.006) * j / 6 for j in range(1, 7)]
    ant = anel_ant
    for z in niveis:
        r = ra(z)
        an = [bm.verts.new((r * math.cos(2 * math.pi * k / seg), r * math.sin(2 * math.pi * k / seg), z)) for k in range(seg)]
        for k in range(seg):
            bm.faces.new((ant[k], an[k], an[(k + 1) % seg], ant[(k + 1) % seg]))
        ant = an
    fundo = bm.verts.new((0, 0, 0.006))
    for k in range(seg):
        bm.faces.new((ant[k], fundo, ant[(k + 1) % seg]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    w = bpy.data.objects.new('agua', me)
    c.objects.link(w)
    w.data.materials.append(M['agua'])
    w.parent = g
    ondas_gn(w, NA, ra(NA))
    return g, w


def gn(md, nome):
    """Entrada de um modificador Geometry Nodes (Blender 5): use .value e .keyframe_insert('value', frame=f)."""
    ident = {s.name: s.identifier for s in md.node_group.interface.items_tree if getattr(s, 'in_out', '') == 'INPUT'}[nome]
    return getattr(md.properties.inputs, ident)


def ondas_gn(obj, NA, RA):
    """Geometry Nodes: só a superfície (z >= NA-1mm) recebe ondas concêntricas + inclinação (balanço).
    Entradas animáveis: Amp (m), Freq (rad/m), Vel (rad/s), Incl_X, Incl_Y (m de desnível na borda)."""
    ng = bpy.data.node_groups.new('ondas_copo', 'GeometryNodeTree')
    ng.interface.new_socket('Geometry', in_out='INPUT', socket_type='NodeSocketGeometry')
    ng.interface.new_socket('Geometry', in_out='OUTPUT', socket_type='NodeSocketGeometry')
    for nome, dv in [('Amp', 0.0), ('Freq', 900.0), ('Vel', 28.0), ('Incl_X', 0.0), ('Incl_Y', 0.0), ('Tempo', 0.0)]:
        s = ng.interface.new_socket(nome, in_out='INPUT', socket_type='NodeSocketFloat')
        s.default_value = dv
    N, L = ng.nodes, ng.links
    gi = N.new('NodeGroupInput')
    go = N.new('NodeGroupOutput')
    pos = N.new('GeometryNodeInputPosition')
    sep = N.new('ShaderNodeSeparateXYZ')
    L.new(pos.outputs[0], sep.inputs[0])

    def op(o, a, b=None, val=None):
        m = N.new('ShaderNodeMath')
        m.operation = o
        L.new(a, m.inputs[0]) if not isinstance(a, (int, float)) else setattr(m.inputs[0], 'default_value', a)
        if b is not None:
            if isinstance(b, (int, float)):
                m.inputs[1].default_value = b
            else:
                L.new(b, m.inputs[1])
        return m.outputs[0]
    r = op('SQRT', op('ADD', op('MULTIPLY', sep.outputs[0], sep.outputs[0]), op('MULTIPLY', sep.outputs[1], sep.outputs[1])))
    fase = op('SUBTRACT', op('MULTIPLY', r, gi.outputs['Freq']), op('MULTIPLY', gi.outputs['Tempo'], gi.outputs['Vel']))
    # amortecimento suave no centro e na borda (menisco preso ao vidro)
    borda = op('SUBTRACT', 1.0, op('POWER', op('DIVIDE', r, RA), 6.0))
    onda = op('MULTIPLY', op('MULTIPLY', op('SINE', fase), gi.outputs['Amp']), borda)
    incl = op('ADD', op('MULTIPLY', sep.outputs[0], op('DIVIDE', gi.outputs['Incl_X'], RA)), op('MULTIPLY', sep.outputs[1], op('DIVIDE', gi.outputs['Incl_Y'], RA)))
    dz = op('ADD', onda, incl)
    # máscara: só superfície
    msk = op('GREATER_THAN', sep.outputs[2], NA - 0.0005)
    # paredes perto do topo acompanham a inclinação (evita buraco)
    perto = op('GREATER_THAN', sep.outputs[2], NA - 0.013)
    fz = op('MAXIMUM', msk, op('MULTIPLY', perto, op('DIVIDE', op('SUBTRACT', sep.outputs[2], NA - 0.013), 0.013)))
    dz2 = op('MULTIPLY', op('ADD', op('MULTIPLY', onda, msk), incl), fz)
    off = N.new('ShaderNodeCombineXYZ')
    L.new(dz2, off.inputs[2])
    sp = N.new('GeometryNodeSetPosition')
    L.new(gi.outputs['Geometry'], sp.inputs['Geometry'])
    L.new(off.outputs[0], sp.inputs['Offset'])
    L.new(sp.outputs[0], go.inputs[0])
    md = obj.modifiers.new('ondas', 'NODES')
    md.node_group = ng
    return md


# ---------------------------------------------------------------- objetos soltos
def objetos(M):
    c = col('objetos')
    O = {}
    # mesa e cadeiras
    O['mesa'], _ = importar('wooden_table_02', loc=(MESA[0], MESA[1], 0), rot=(0, 0, 0), c=c)
    O['cad1'], _ = importar('painted_wooden_chair_01', loc=(MESA[0] - 0.78, MESA[1] - 0.05, 0), rot=(0, 0, -math.pi / 2 + 0.12), c=c)
    O['cad2'], _ = importar('painted_wooden_chair_01', loc=(MESA[0] + 0.25, MESA[1] + 0.62, 0), rot=(0, 0, math.pi + 0.08), c=c)
    O['cad3'], _ = importar('painted_wooden_chair_01', loc=(MESA[0] + 0.86, MESA[1] - 0.1, 0), rot=(0, 0, math.pi / 2 - 0.2), c=c)
    TOPO = 0.8
    # toalha xadrez (fina, com caimento): grade dobrada nas bordas
    tw, td, queda = 1.16, 0.73, 0.17
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=80, y_subdivisions=60, size=1, location=(MESA[0], MESA[1], TOPO + 0.002))
    tl = bpy.context.object
    tl.name = 'toalha'
    tl.scale = (tw + 2 * queda, td + 2 * queda, 1)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    rnd = random.Random(3)
    for v in tl.data.vertices:
        x, y = v.co.x, v.co.y
        ex = max(0.0, abs(x) - tw / 2)
        ey = max(0.0, abs(y) - td / 2)
        e = max(ex, ey)
        if e > 0:
            # cai pela borda com leve ondulação
            v.co.z = -min(e, queda) - 0.004 * math.sin((x + y) * 40)
            if ex > 0:
                v.co.x = math.copysign(tw / 2 + 0.006 + 0.004 * math.sin(y * 31), x)
            if ey > 0:
                v.co.y = math.copysign(td / 2 + 0.006 + 0.004 * math.sin(x * 29), y)
        else:
            v.co.z = 0.0008 * math.sin(x * 23 + rnd.random()) * math.sin(y * 19)
    for p in tl.data.polygons:
        p.use_smooth = True
    tl.data.materials.append(M['toalha'])
    s = tl.modifiers.new('sol', 'SOLIDIFY')
    s.thickness = 0.0015
    mover_para(tl, c)
    tl.parent = O['mesa']
    tl.location = (0, 0, TOPO + 0.002)
    O['toalha'] = tl
    O['topo'] = TOPO + 0.0035
    # fruteira (feita à mão) com frutas
    fr = torno('fruteira', [(0.0, 0.0), (0.06, 0.0), (0.065, 0.004), (0.12, 0.045), (0.135, 0.07), (0.13, 0.072), (0.115, 0.05), (0.06, 0.008), (0.0, 0.008)], (MESA[0] + 0.33, MESA[1] + 0.12, O['topo']), M['louca_azul'], c)
    fr.parent = O['mesa']
    fr.location = (0.33, 0.12, O['topo'])
    O['fruteira'] = fr
    frutas = [('food_lime_01', (0.03, 0.02, 0.012), 1.25), ('food_lime_01', (-0.04, 0.03, 0.012), 1.3), ('food_apple_01', (0.0, -0.04, 0.01), 1.0),
              ('lemon', (0.06, -0.03, 0.06), 0.9), ('bananas', (-0.02, 0.0, 0.05), 0.72)]
    O['frutas'] = []
    for i, (n, p, e) in enumerate(frutas):
        f, _ = importar(n, loc=p, rot=(0, 0, i * 1.3), escala=e, c=c)
        f.parent = fr
        O['frutas'].append(f)
    # bananas um pouco inclinadas sobre as outras
    O['frutas'][-1].rotation_euler = (0.25, 0.0, 0.6)
    # copo
    g, w = copo(M, (MESA[0] - 0.12, MESA[1] - 0.08, O['topo']))
    g.parent = O['mesa']
    g.location = (-0.12, -0.08, O['topo'])
    O['copo'], O['agua'] = g, w
    # bancada: tábua, cebola, colher, chaleira, panela, plantas
    tb, _ = importar('wooden_cutting_board', loc=(-1.95, PY - 0.3, BALCAO), rot=(0, 0, 0.15), c=c)
    ce, _ = importar('yellow_onion', loc=(-1.9, PY - 0.32, BALCAO + 0.04), c=c)
    cl, _ = importar('wooden_spoon', loc=(-2.05, PY - 0.42, BALCAO + 0.045), rot=(0, 0, 1.2), c=c)
    ch, _ = importar('vintage_electric_kettle', loc=(-0.85, PY - 0.25, BALCAO), rot=(0, 0, -0.5), escala=0.85, c=c)
    pn, _ = importar('pot_enamel_01', loc=(-0.45, PY - 0.42, 0.875), rot=(0, 0, 0.3), c=c)
    pl1, _ = importar('potted_plant_04', loc=(-1.05, PY + 0.02, 1.15), rot=(0, 0, 0.4), c=c)
    pl2, _ = importar('potted_plant_02', loc=(2.0, -0.6, 0), rot=(0, 0, 2.2), escala=0.95, c=c)
    jarra, _ = importar('metal_jug', loc=(1.35, PY - 0.3, BALCAO), rot=(0, 0, 0.8), escala=0.9, c=c)
    O['bancada'] = [tb, ce, cl, ch, pn, jarra]
    # louça nas prateleiras: jogo de chá do Poly Haven + pratos empilhados feitos à mão
    ts, tsobjs = importar('tea_set_01', loc=(1.62, PY - 0.14, 1.395), rot=(0, 0, 0), escala=0.95, c=c)
    O['jogo_cha'] = (ts, tsobjs)
    pratos = []
    perfil_prato = [(0.0, 0.0), (0.07, 0.0), (0.075, 0.006), (0.1, 0.012), (0.118, 0.022), (0.116, 0.024), (0.098, 0.015), (0.072, 0.009), (0.0, 0.008)]
    for k in range(6):
        p = torno(f'prato{k}', perfil_prato, (1.25, PY - 0.13, 1.795 + 0.011 * k), M['louca'], c, seg=64)
        pratos.append(p)
    canecas = []
    for k, (x, m) in enumerate([(1.55, 'louca_azul'), (1.72, 'louca'), (1.89, 'louca_azul')]):
        cc = torno(f'caneca{k}', [(0.0, 0.0), (0.035, 0.0), (0.04, 0.004), (0.042, 0.095), (0.038, 0.095), (0.036, 0.008), (0.0, 0.008)], (x, PY - 0.12, 1.795), M[m], c, seg=48)
        # alça
        bpy.ops.mesh.primitive_torus_add(major_radius=0.026, minor_radius=0.006, location=(x + 0.045, PY - 0.12, 1.845), rotation=(math.pi / 2, 0, 0))
        al = bpy.context.object
        al.name = f'alca{k}'
        al.data.materials.append(M[m])
        mover_para(al, c)
        al.parent = cc
        al.location = (0.045, 0, 0.05)
        canecas.append(cc)
    O['pratos'], O['canecas'] = pratos, canecas
    # quadro e relógio
    O['quadro'], _ = importar('hanging_picture_frame_02', loc=(1.62, PY - 0.0, 2.25), rot=(0, 0, 0), escala=0.85, c=c)
    O['relogio'], _ = importar('wall_clock', loc=(-0.35, PY - 0.0, 2.15), rot=(0, 0, 0), escala=0.9, c=c)
    # luminária pendente sobre a mesa
    lm, lmo = importar('modern_ceiling_lamp_01', loc=(MESA[0], MESA[1], PE - 1.173 * 0.75), escala=0.75, c=c)
    O['luminaria'] = lm
    return O


# ---------------------------------------------------------------- luz, mundo e render
def luz(hdri='balcony', forca_sol=4.5):
    sc = bpy.context.scene
    w = bpy.data.worlds.new('mundo')
    sc.world = w
    w.use_nodes = True
    N, L = w.node_tree.nodes, w.node_tree.links
    env = N.new('ShaderNodeTexEnvironment')
    env.image = bpy.data.images.load(f'{A}/hdri/{hdri}.exr')
    mp = N.new('ShaderNodeMapping')
    tc = N.new('ShaderNodeTexCoord')
    mp.inputs['Rotation'].default_value = (0, 0, math.radians(30))
    L.new(tc.outputs['Generated'], mp.inputs[0])
    L.new(mp.outputs[0], env.inputs[0])
    N['Background'].inputs['Strength'].default_value = 0.8
    L.new(env.outputs[0], N['Background'].inputs[0])
    lp = N.new('ShaderNodeLightPath'); bg2 = N.new('ShaderNodeBackground'); bg2.inputs['Strength'].default_value = 1.3
    L.new(env.outputs[0], bg2.inputs[0]); mx = N.new('ShaderNodeMixShader')
    vis = N.new('ShaderNodeMath'); vis.operation = 'MAXIMUM'
    L.new(lp.outputs['Is Camera Ray'], vis.inputs[0]); L.new(lp.outputs['Is Transmission Ray'], vis.inputs[1])
    L.new(vis.outputs[0], mx.inputs[0]); L.new(N['Background'].outputs[0], mx.inputs[1]); L.new(bg2.outputs[0], mx.inputs[2])
    L.new(mx.outputs[0], N['World Output'].inputs['Surface'])
    c = col('luzes')
    # sol de fim de tarde entrando pela janela
    sd = bpy.data.lights.new('sol', 'SUN')
    sd.energy = forca_sol
    sd.color = (1.0, 0.78, 0.55)
    sd.angle = math.radians(1.2)
    so = bpy.data.objects.new('sol', sd)
    c.objects.link(so)
    so.rotation_euler = (math.radians(62), 0, math.radians(200))
    # portal de luz na janela (luz do céu entrando) — área virada para dentro
    pa = bpy.data.lights.new('janela_luz', 'AREA')
    pa.shape = 'RECTANGLE'
    pa.size, pa.size_y = 0.9, 1.1
    pa.energy = 120
    pa.color = (0.85, 0.9, 1.0)
    po = bpy.data.objects.new('janela_luz', pa)
    c.objects.link(po)
    po.location = (-1.3, PY + 0.05, 1.7)
    po.rotation_euler = (math.radians(-90), 0, 0)
    po.visible_camera = False
    po.visible_glossy = False
    po.visible_transmission = False
    # preenchimento suave vindo da câmera (luz do resto da casa)
    fa = bpy.data.lights.new('preench', 'AREA')
    fa.size = 2.5
    fa.energy = 140
    fa.color = (1.0, 0.92, 0.82)
    fo = bpy.data.objects.new('preench', fa)
    c.objects.link(fo)
    fo.location = (0.6, -2.6, 2.3)
    fo.rotation_euler = (math.radians(60), 0, math.radians(8))
    return {'sol': so, 'portal': po, 'preench': fo}


def render(res=(1920, 1080), amostras=128, fps=30):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.samples = amostras
    sc.cycles.use_denoising = True
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.02
    sc.cycles.max_bounces = 10
    sc.cycles.transmission_bounces = 12
    sc.cycles.glossy_bounces = 6
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.cycles.blur_glossy = 1.0
    sc.render.resolution_x, sc.render.resolution_y = res
    sc.render.fps = fps
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'AgX - Medium High Contrast'
    sc.render.film_transparent = False
    sc.view_settings.exposure = 0.35


def consertar_vidros():
    for m in bpy.data.materials:
        if m.name.endswith('_glass') and m.use_nodes:
            b = m.node_tree.nodes.get('Principled BSDF')
            if not b:
                continue
            for l in list(b.inputs['Alpha'].links) + list(b.inputs['Base Color'].links):
                m.node_tree.links.remove(l)
            b.inputs['Base Color'].default_value = (1, 1, 1, 1)
            b.inputs['Alpha'].default_value = 0.06
            for l in list(b.inputs['Roughness'].links):
                m.node_tree.links.remove(l)
            b.inputs['Roughness'].default_value = 0.03


def construir(hdri='balcony'):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    M = materiais()
    arq = arquitetura(M)
    bal = balcao(M)
    O = objetos(M)
    LZ = luz(hdri)
    consertar_vidros()
    render()
    return {'M': M, 'arq': arq, 'bal': bal, 'O': O, 'L': LZ}


if __name__ == '__main__':
    import sys
    K = construir()
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(AQUI, 'cozinha_base.blend'))
    print('OK cena')
