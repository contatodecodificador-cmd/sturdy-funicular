# Planos 3D da cozinha (vídeo 6). Cada GRUPO é uma simulação contínua (tempo global t0..t1);
# cada PLANO é um recorte do grupo com a sua câmera. Frame 1 do grupo = t0.
# Uso:  python3 planos3d.py <grupo> [--salvar] [--previa workbench|cycles] [--plano id] [--frames a-b]
import bpy, math, os, sys, json, random
from mathutils import Vector, Euler
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import cena

FPS = 30
PY = cena.PY


def es(x):
    x = min(1.0, max(0.0, x))
    return 0.5 - 0.5 * math.cos(math.pi * x)


def ruido(t, seed, base=1.0):
    """Ruído suave em [-1, 1] (soma de senos com fases fixas)."""
    r = random.Random(seed)
    fs = [base * k for k in (1.0, 1.73, 2.61, 3.97)]
    ph = [r.random() * 6.283 for _ in fs]
    am = [1.0, 0.6, 0.4, 0.25]
    return sum(a * math.sin(6.283 * f * t + p) for a, f, p in zip(am, fs, ph)) / 2.25


def pl(pts, t):
    """Interpolação linear por pontos [(t, v), ...] (constante fora)."""
    if t <= pts[0][0]:
        return pts[0][1]
    for (a, va), (b, vb) in zip(pts, pts[1:]):
        if t <= b:
            return va + (vb - va) * es((t - a) / (b - a))
    return pts[-1][1]


# ------------------------------------------------------------------ câmeras
# nome: (pos, alvo, lente, foco, f-stop)   foco: 'agua' | 'copo' | distância | None
CAM = {
    'W1': ((0.55, -2.75, 1.55), (-0.25, 0.9, 1.05), 24, None, 8),
    'W2': ((-1.55, -2.45, 1.5), (0.75, 0.9, 1.05), 26, None, 8),
    'M1': ((-0.6, -1.25, 1.2), (0.1, 0.25, 0.85), 40, 'copo', 3.5),
    'C1': ((0.3, -0.45, 1.0), (0.03, -0.03, 0.865), 85, 'copo', 2.8),
    'C2': ((0.13, -0.24, 1.07), (0.03, -0.03, 0.87), 55, 'agua', 4.0),
    'C2b': ((-0.14, -0.2, 1.08), (0.03, -0.03, 0.87), 55, 'agua', 4.0),
    'C3': ((0.41, -0.5, 0.9), (0.03, -0.03, 0.86), 65, 'copo', 2.8),
    'Q1': ((1.15, -0.45, 1.75), (1.62, 1.6, 1.86), 35, None, 6),
    'F1': ((-1.1, -1.7, 0.32), (0.9, 1.1, 0.75), 22, None, 8),
    'J1': ((-0.55, -0.7, 1.32), (-1.3, 1.6, 1.62), 35, None, 5),
}

# ------------------------------------------------------------------ grupos e planos
# estado: E = envelope do tremor [(t, nível)], extras = eventos
GRUPOS = {
    # --- piloto (intro)
    'p1': dict(t0=47.4, t1=51.1, copo=False, planos=[('p1', 47.4, 51.1, 'W1', 'in')]),
    'p2': dict(t0=60.3, t1=65.3, copo=False, planos=[('p2', 60.3, 65.3, 'M1', 'in')]),
    'p3': dict(t0=65.3, t1=68.7, copo='pousa', pousa=(65.45, 66.02), planos=[('p3', 65.3, 68.7, 'C1', 'in')]),
    'p4': dict(t0=78.5, t1=80.7, planos=[('p4', 78.5, 80.7, 'C3', 'in')]),
    'p5': dict(t0=80.7, t1=84.6, planos=[('p5', 80.7, 84.6, 'W1', 'out')]),
    # --- corpo
    'c01': dict(t0=87.5, t1=92.0, planos=[('c01', 87.5, 92.0, 'M1', 'in')]),
    'c02': dict(t0=141.0, t1=144.2, planos=[('c02', 141.0, 144.2, 'C2', 'in')]),
    'c03': dict(t0=216.0, t1=221.2, ondas=[(216.0, 0), (217.4, 0), (218.2, 0.00045), (221.2, 0.0005)],
                planos=[('c03', 216.0, 218.6, 'C2', 'in'), ('c04', 218.6, 221.2, 'C2b', 'in')]),
    'g4': dict(t0=221.2, t1=235.5, E=[(221.2, 0.0), (221.7, 0.16), (233.0, 0.16), (235.5, 0.05)],
               louca=226.85, quadro=[(228.75, 0.0), (229.0, 0.035), (229.25, 0.03), (229.6, 0.075)],
               planos=[('c05', 221.2, 225.967, 'W2', 'in'), ('c06', 225.967, 230.733, 'Q1', 'in'), ('c07', 230.733, 235.5, 'C1', 'in')]),
    'c08': dict(t0=368.9, t1=380.6, planos=[('c08', 368.9, 372.8, 'C3', 'in'), ('c09', 372.8, 376.7, 'C2', 'in'), ('c10', 376.7, 380.6, 'M1', 'out')]),
    'c11': dict(t0=425.1, t1=428.3, planos=[('c11', 425.1, 428.3, 'C1', 'in')]),
    'g7': dict(t0=474.0, t1=481.6, E=[(474.0, 0.3), (474.6, 0.5), (481.6, 0.55)],
               moveis=478.1, racha=[(479.85, 0.0), (481.4, 0.8)], cai=dict(prat=1, t=478.6, inc=0.16),
               quadro=[(474.0, 0.04), (481.6, 0.11)],
               planos=[('c12', 474.0, 477.8, 'W1', 'in'), ('c13', 477.8, 481.6, 'F1', 'in')]),
    'c14': dict(t0=570.7, t1=574.1, planos=[('c14', 570.7, 574.1, 'C3', 'in')]),
    'g95': dict(t0=676.5, t1=691.0, E=[(676.5, 0.55), (677.2, 0.85), (691.0, 0.9)], moveis=676.6,
                racha=[(677.0, 0.3), (690.0, 1.0)], cai=dict(prat=0, t=679.6, inc=0.45, prat2=1, t2=677.4, inc2=0.3),
                quadro=[(676.5, 0.06), (684.0, 0.22)], entulho=(677.5, 691.0),
                planos=[('c15', 676.5, 681.333, 'W2', 'in'), ('c16', 681.333, 686.167, 'F1', 'in'), ('c17', 686.167, 691.0, 'M1', 'in')]),
    'c18': dict(t0=716.2, t1=721.3, planos=[('c18', 716.2, 718.75, 'C1', 'in'), ('c19', 718.75, 721.3, 'C2', 'in')]),
    'c20': dict(t0=785.6, t1=798.8, planos=[('c20', 785.6, 790.0, 'C3', 'in'), ('c21', 790.0, 794.4, 'J1', 'in'), ('c22', 794.4, 798.8, 'W1', 'out')]),
}


def frames_do_grupo(g):
    return int(round((g['t1'] - g['t0']) * FPS)) + 2


def t_de(g, f):
    return g['t0'] + (f - 1) / FPS


# ------------------------------------------------------------------ montagem
class Cena:
    def __init__(self, gid):
        self.gid = gid
        self.g = GRUPOS[gid]
        self.K = cena.construir()
        self.O = self.K['O']
        sc = bpy.context.scene
        sc.frame_start = 1
        sc.frame_end = frames_do_grupo(self.g)
        sc.render.fps = FPS
        sc.render.use_motion_blur = True
        sc.render.motion_blur_shutter = 0.4
        self.focos()
        self.pivo_luminaria()

    # alvos de foco dentro do copo
    def focos(self):
        g = self.O['copo']
        for nome, z in [('foco_agua', 0.072), ('foco_copo', 0.05)]:
            e = bpy.data.objects.new(nome, None)
            bpy.context.scene.collection.objects.link(e)
            e.parent = g
            e.location = (0, 0, z)
            self.O[nome] = e

    def pivo_luminaria(self):
        lm = self.O['luminaria']
        pv = bpy.data.objects.new('pivo_lum', None)
        bpy.context.scene.collection.objects.link(pv)
        pv.location = (cena.MESA[0], cena.MESA[1], cena.PE)
        bpy.context.view_layer.update()
        lm.parent = pv
        lm.matrix_parent_inverse = pv.matrix_world.inverted()
        self.O['pivo_lum'] = pv

    def E(self, t):
        return pl(self.g['E'], t) if 'E' in self.g else 0.0

    # ---------------- câmeras dos planos
    def cameras(self):
        cams = []
        for pid, a, b, cid, mov in self.g['planos']:
            p, alvo, lente, foco, fs = CAM[cid]
            cd = bpy.data.cameras.new(pid)
            co = bpy.data.objects.new('cam_' + pid, cd)
            bpy.context.scene.collection.objects.link(co)
            cd.lens = lente
            cd.sensor_width = 36
            cd.clip_start = 0.02
            if foco:
                cd.dof.use_dof = True
                cd.dof.aperture_fstop = fs
                if isinstance(foco, str):
                    cd.dof.focus_object = self.O['foco_' + foco]
                else:
                    cd.dof.focus_distance = foco
            P, A = Vector(p), Vector(alvo)
            f0 = int(round((a - self.g['t0']) * FPS)) + 1
            f1 = int(round((b - self.g['t0']) * FPS)) + 2
            # zoom único e leve: aproximação (in) ou afastamento (out) de ~3% da distância
            for f, k in [(f0, 0.0), (f1, 1.0)]:
                d = 0.03 * (k if mov == 'in' else 1 - k)
                co.location = P + (A - P) * d
                co.rotation_euler = (A - co.location).to_track_quat('-Z', 'Y').to_euler()
                co.keyframe_insert('location', frame=f)
                co.keyframe_insert('rotation_euler', frame=f)
            for fc in co.animation_data.action.fcurves if hasattr(co.animation_data.action, 'fcurves') else []:
                for kp in fc.keyframe_points:
                    kp.interpolation = 'SINE'
                    kp.easing = 'EASE_IN_OUT'
            # (sem marcadores de câmera: cada plano é renderizado com sc.camera fixa)
            cams.append((pid, co, f0, f1, cid))
        self.cams = cams
        return cams

    # ---------------- animação quadro a quadro
    def animar(self):
        g, O = self.g, self.O
        nf = frames_do_grupo(g)
        tem_tremor = 'E' in g
        # estados físicos simples (integrados quadro a quadro)
        dt = 1.0 / FPS
        pend = [0.0, 0.0, 0.0, 0.0]  # θx, ωx, θy, ωy
        slo = [0.0, 0.0, 0.0, 0.0]   # inclinação água x, vx, y, vy
        desl = {k: Vector((0, 0, 0)) for k in ('cad1', 'cad2', 'cad3', 'copo', 'chaleira', 'mesa')}
        giro = {k: 0.0 for k in ('cad1', 'cad2', 'cad3', 'mesa')}
        rnd = random.Random(7)
        dirs = {k: Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), 0)).normalized() for k in desl}
        # direções que afastam as cadeiras da mesa (nada atravessa nada); mesa vem para a frente
        dirs.update({'cad1': Vector((-1, -0.35, 0)).normalized(), 'cad2': Vector((0.25, 1, 0)).normalized(),
                     'cad3': Vector((1, -0.25, 0)).normalized(), 'mesa': Vector((0.2, -1, 0)).normalized()})
        agua = O['agua'].modifiers['ondas']
        Iamp, Itmp, Ix, Iy = cena.gn(agua, 'Amp'), cena.gn(agua, 'Tempo'), cena.gn(agua, 'Incl_X'), cena.gn(agua, 'Incl_Y')
        louca = self.louca()
        copo0 = O['copo'].location.copy()
        for f in range(1, nf + 1):
            t = t_de(g, f)
            E = self.E(t)
            # aceleração do chão (para pêndulo e água)
            ax = E * ruido(t, 11, 2.2) * 9.0
            ay = E * ruido(t, 12, 2.0) * 9.0
            for _ in range(8):
                h = dt / 8
                w2 = 9.81 / 0.62
                pend[1] += (-w2 * pend[0] - 0.25 * pend[1] - ay / 0.62) * h
                pend[0] += pend[1] * h
                pend[3] += (-w2 * pend[2] - 0.25 * pend[3] - ax / 0.62) * h
                pend[2] += pend[3] * h
                ws = (2 * math.pi * 3.6) ** 2
                slo[1] += (-ws * slo[0] - 1.6 * slo[1] - ax * 0.0009 * ws / 9.81 * 3) * h
                slo[0] += slo[1] * h
                slo[3] += (-ws * slo[2] - 1.6 * slo[3] - ay * 0.0009 * ws / 9.81 * 3) * h
                slo[2] += slo[3] * h
            # luminária balança
            pv = O['pivo_lum']
            pv.rotation_euler = (pend[0], -pend[2], 0)
            pv.keyframe_insert('rotation_euler', frame=f)
            # água: ondas + balanço
            amp = 0.0
            if 'ondas' in g:
                amp = pl(g['ondas'], t)
            if tem_tremor:
                amp = max(amp, 0.0016 * min(1.0, E * 3))
            if g.get('copo') == 'pousa':
                tp = g['pousa'][1]
                amp = 0.0012 * math.exp(-(t - tp) * 2.2) if t > tp else 0.0
            Iamp.value = amp
            Iamp.keyframe_insert('value', frame=f)
            Itmp.value = t
            Itmp.keyframe_insert('value', frame=f)
            Ix.value = max(-0.012, min(0.012, slo[0]))
            Iy.value = max(-0.012, min(0.012, slo[2]))
            Ix.keyframe_insert('value', frame=f)
            Iy.keyframe_insert('value', frame=f)
            # copo: pousar (desce de cima) ou parado
            cp = O['copo']
            if g.get('copo') is False:
                cp.hide_render = True
                O['agua'].hide_render = True
            elif g.get('copo') == 'pousa':
                a, b = g['pousa']
                k = es((t - a) / (b - a))
                cp.location = copo0 + Vector((0, 0, 0.32 * (1 - k)))
                cp.keyframe_insert('location', frame=f)
            if not tem_tremor:
                continue
            # ---- tremor: mesa, cadeiras, copo, louça, bancada, quadro, relógio
            def jit(o, s, amp, rot=0.0, z=0.0):
                o.delta_location = (amp * E * ruido(t, s, 3.1), amp * E * ruido(t, s + 1, 2.9), z * E * max(0.0, ruido(t, s + 2, 4.3)))
                o.delta_rotation_euler = (rot * E * ruido(t, s + 3, 3.7), rot * E * ruido(t, s + 4, 3.3), rot * E * ruido(t, s + 5, 2.1))
                o.keyframe_insert('delta_location', frame=f)
                o.keyframe_insert('delta_rotation_euler', frame=f)
            movem = 'moveis' in g and t >= g['moveis']
            for i, k in enumerate(('cad1', 'cad2', 'cad3', 'mesa')):
                o = O[k]
                if movem and E > 0.3:
                    # móveis andam pelo chão: deslizam aos trancos (velocidade ∝ E², máx. 45 cm / mesa 12 cm)
                    v = (E ** 2) * (0.38 if k != 'mesa' else 0.1) * max(0.0, 0.6 + ruido(t, 50 + i, 1.6))
                    desl[k] += dirs[k] * v * dt
                    lim = 0.45 if k != 'mesa' else 0.06
                    if desl[k].length > lim:
                        desl[k] = desl[k].normalized() * lim
                    giro[k] += (0.35 if k != 'mesa' else 0.05) * v * dt * (1 if i % 2 else -1)
                jit(o, 100 + i * 10, 0.012 if k != 'mesa' else 0.006, rot=0.02, z=0.012 if E > 0.6 else 0.003)
                o.delta_location = Vector(o.delta_location) + desl[k]
                o.delta_rotation_euler = Euler((o.delta_rotation_euler[0], o.delta_rotation_euler[1], o.delta_rotation_euler[2] + giro[k]))
                o.keyframe_insert('delta_location', frame=f)
                o.keyframe_insert('delta_rotation_euler', frame=f)
            # copo anda sobre a mesa (forte) e balança
            if E > 0.3:
                desl['copo'] += dirs['copo'] * (E ** 2) * 0.03 * dt * (1 + ruido(t, 61, 1.1))
                if desl['copo'].length > 0.07:
                    desl['copo'] = desl['copo'].normalized() * 0.07
            cp.delta_location = desl['copo'] + Vector((0, 0, 0.0015 * E * max(0, ruido(t, 62, 5.0))))
            cp.delta_rotation_euler = (0.05 * E * ruido(t, 63, 3.6), 0.05 * E * ruido(t, 64, 3.4), 0)
            cp.keyframe_insert('delta_location', frame=f)
            cp.keyframe_insert('delta_rotation_euler', frame=f)
            # louça chacoalhando (a partir do tempo 'louca' ou já no início se forte)
            on = 1.0 if (E > 0.3 or t >= g.get('louca', 1e9)) else 0.25
            for j, o in enumerate(louca):
                if getattr(o, 'rigid_body', None) is not None and o.rigid_body.type == 'ACTIVE':
                    continue
                o.delta_location = (0.0015 * on * E / 0.16 * ruido(t, 300 + j, 9.0), 0.0012 * on * E / 0.16 * ruido(t, 330 + j, 8.0),
                                    0.0015 * on * min(1, E / 0.16) * max(0, ruido(t, 360 + j, 11.0)))
                o.delta_rotation_euler = (0.03 * on * min(1, E / 0.16) * ruido(t, 390 + j, 10.0), 0.03 * on * min(1, E / 0.16) * ruido(t, 420 + j, 9.5), 0.02 * on * ruido(t, 450 + j, 4.0))
                o.keyframe_insert('delta_location', frame=f)
                o.keyframe_insert('delta_rotation_euler', frame=f)
            for j, o in enumerate(O['bancada'] + O['frutas']):
                jit(o, 500 + j * 7, 0.002, rot=0.03, z=0.003)
            # quadro entorta (rotação no plano da parede) + vibração
            if 'quadro' in g:
                q = O['quadro']
                q.rotation_euler = (0, pl(g['quadro'], t) + 0.01 * E * ruido(t, 600, 6.0), 0)
                q.keyframe_insert('rotation_euler', frame=f)
            rl = O['relogio']
            rl.rotation_euler = (0, 0.4 * pl([(g['t0'], 0), (g['t1'], E * 0.12)], t) + 0.01 * E * ruido(t, 610, 6.0), 0)
            rl.keyframe_insert('rotation_euler', frame=f)
        # câmeras tremem junto (mão segurando)
        if tem_tremor:
            for pid, co, f0, f1, cid in self.cams:
                fator = 0.35 if cid.startswith('C') else 1.0
                for f in range(f0, f1 + 1):
                    t = t_de(g, f)
                    E = self.E(t)
                    co.delta_location = (0.012 * fator * E * ruido(t, 700, 2.4), 0.008 * fator * E * ruido(t, 701, 2.2), 0.01 * fator * E * ruido(t, 702, 2.8))
                    co.delta_rotation_euler = (0.012 * fator * E * ruido(t, 703, 2.6), 0.008 * fator * E * ruido(t, 704, 2.3), 0.01 * fator * E * ruido(t, 705, 2.0))
                    co.keyframe_insert('delta_location', frame=f)
                    co.keyframe_insert('delta_rotation_euler', frame=f)

    def louca(self):
        O = self.O
        ts, objs = O['jogo_cha']
        pecas = [o for o in objs if o.type == 'MESH']
        return O['pratos'] + O['canecas'] + pecas

    # ---------------- prateleira cede e a louça cai (corpo rígido)
    def quedas(self):
        g = self.g
        if 'cai' not in g:
            return
        sc = bpy.context.scene
        if sc.rigidbody_world is None:
            with bpy.context.temp_override(scene=sc):
                bpy.ops.rigidbody.world_add()
        rw = sc.rigidbody_world
        rw.point_cache.frame_start = 1
        rw.point_cache.frame_end = frames_do_grupo(g)
        rw.substeps_per_frame = 20
        rw.solver_iterations = 20

        def rb(o, tipo, forma, kin=False, massa=0.3):
            with bpy.context.temp_override(object=o, active_object=o, selected_objects=[o], selected_editable_objects=[o], scene=sc):
                bpy.ops.rigidbody.object_add(type=tipo)
            o.rigid_body.collision_shape = forma
            o.rigid_body.friction = 0.55
            o.rigid_body.restitution = 0.15
            o.rigid_body.collision_margin = 0.001
            o.rigid_body.mass = massa
            if kin:
                o.rigid_body.kinematic = True
        # passivos: chão, tampos, mesa (malha), prateleiras (cinemáticas, giram na dobradiça)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.5, -0.1))
        ch = bpy.context.object; ch.name = 'chao_colisor'; ch.scale = (4.6, 5.0, 0.2); ch.hide_render = True
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        rb(ch, 'PASSIVE', 'BOX')
        for nm in ('tampo0', 'tampo1'):
            rb(bpy.data.objects[nm], 'PASSIVE', 'BOX')
        for o in self.O['mesa'].children_recursive:
            if o.type == 'MESH' and o.name.startswith('wooden_table'):
                rb(o, 'PASSIVE', 'MESH', kin=True)
        cede = []
        for chave_p, chave_t, chave_i in (('prat', 't', 'inc'), ('prat2', 't2', 'inc2')):
            if chave_p in g['cai']:
                cede.append((g['cai'][chave_p], g['cai'][chave_t], g['cai'][chave_i]))
        prat = self.K['bal']['prateleiras']
        for i, p in enumerate(prat):
            # dobradiça na parede: pai vazio na borda de trás
            zc = 1.38 if i == 0 else 1.78
            hinge = bpy.data.objects.new(f'dobradica{i}', None)
            sc.collection.objects.link(hinge)
            hinge.location = (1.62, PY - 0.0, zc)
            bpy.context.view_layer.update()
            p.parent = hinge
            p.matrix_parent_inverse = hinge.matrix_world.inverted()
            rb(p, 'PASSIVE', 'BOX', kin=True)
            for idx, tq, inc in cede:
                if idx == i:
                    f0 = int(round((tq - g['t0']) * FPS)) + 1
                    hinge.rotation_euler = (0, 0, 0)
                    hinge.keyframe_insert('rotation_euler', frame=max(1, f0 - 1))
                    # cede para a frente e de lado (um suporte quebra)
                    hinge.rotation_euler = (-inc, inc * 0.6, 0)
                    hinge.keyframe_insert('rotation_euler', frame=f0 + 9)
        # ativos: louça das prateleiras e algumas coisas da bancada
        bpy.context.view_layer.update()
        for o in self.louca():
            mw = o.matrix_world.copy()
            o.parent = None
            o.matrix_world = mw
            o.delta_location = (0, 0, 0)
            o.delta_rotation_euler = (0, 0, 0)
            rb(o, 'ACTIVE', 'CONVEX_HULL', massa=0.25)
            o.rigid_body.collision_margin = 0.0005
        self.rigido = True

    # ---------------- rachaduras nas paredes
    def rachaduras(self):
        g = self.g
        if 'racha' not in g:
            return
        for mn, origem, escala in (('azulejo', (1.25, PY, 1.05), 1.0), ('parede', (0.45, PY, 2.35), 1.0)):
            m = bpy.data.materials[mn]
            N, L = m.node_tree.nodes, m.node_tree.links
            b = N['Principled BSDF']
            tc = N.new('ShaderNodeTexCoord')
            # distância do ponto de origem
            vm = N.new('ShaderNodeVectorMath'); vm.operation = 'DISTANCE'
            L.new(tc.outputs['Object'], vm.inputs[0]); vm.inputs[1].default_value = origem
            nz = N.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 3.0
            L.new(tc.outputs['Object'], nz.inputs['Vector'])
            dist = N.new('ShaderNodeMath'); dist.operation = 'ADD'
            L.new(vm.outputs['Value'], dist.inputs[0])
            mn2 = N.new('ShaderNodeMath'); mn2.operation = 'MULTIPLY'; mn2.inputs[1].default_value = 0.35
            L.new(nz.outputs['Fac'], mn2.inputs[0]); L.new(mn2.outputs[0], dist.inputs[1])
            prog = N.new('ShaderNodeValue'); prog.name = 'progresso_racha'; prog.label = 'progresso_racha'
            prog.outputs[0].default_value = 0.0
            dentro = N.new('ShaderNodeMath'); dentro.operation = 'LESS_THAN'
            L.new(dist.outputs[0], dentro.inputs[0])
            esc = N.new('ShaderNodeMath'); esc.operation = 'MULTIPLY'; esc.inputs[1].default_value = 1.3
            L.new(prog.outputs[0], esc.inputs[0]); L.new(esc.outputs[0], dentro.inputs[1])
            # rede de trincas: voronoi (distância à borda) distorcido
            dn = N.new('ShaderNodeTexNoise'); dn.inputs['Scale'].default_value = 9; dn.inputs['Detail'].default_value = 6
            L.new(tc.outputs['Object'], dn.inputs['Vector'])
            mixv = N.new('ShaderNodeMix'); mixv.data_type = 'VECTOR'; mixv.inputs['Factor'].default_value = 0.25
            L.new(tc.outputs['Object'], mixv.inputs[4]); L.new(dn.outputs['Color'], mixv.inputs[5])
            vo = N.new('ShaderNodeTexVoronoi'); vo.feature = 'DISTANCE_TO_EDGE'; vo.inputs['Scale'].default_value = 5.0
            L.new(mixv.outputs[1], vo.inputs['Vector'])
            fino = N.new('ShaderNodeMath'); fino.operation = 'LESS_THAN'; fino.inputs[1].default_value = 0.012
            L.new(vo.outputs['Distance'], fino.inputs[0])
            # rareia a rede (nem toda borda vira trinca)
            rr = N.new('ShaderNodeTexNoise'); rr.inputs['Scale'].default_value = 2.2
            L.new(tc.outputs['Object'], rr.inputs['Vector'])
            rar = N.new('ShaderNodeMath'); rar.operation = 'GREATER_THAN'; rar.inputs[1].default_value = 0.47
            L.new(rr.outputs['Fac'], rar.inputs[0])
            m1 = N.new('ShaderNodeMath'); m1.operation = 'MULTIPLY'
            L.new(fino.outputs[0], m1.inputs[0]); L.new(rar.outputs[0], m1.inputs[1])
            mask = N.new('ShaderNodeMath'); mask.operation = 'MULTIPLY'
            L.new(m1.outputs[0], mask.inputs[0]); L.new(dentro.outputs[0], mask.inputs[1])
            # cor escura na trinca
            base_link = b.inputs['Base Color'].links[0].from_socket if b.inputs['Base Color'].links else None
            mx = N.new('ShaderNodeMix'); mx.data_type = 'RGBA'
            L.new(mask.outputs[0], mx.inputs['Factor'])
            if base_link:
                L.new(base_link, mx.inputs[6])
            else:
                mx.inputs[6].default_value = b.inputs['Base Color'].default_value
            mx.inputs[7].default_value = (0.05, 0.045, 0.04, 1)
            L.new(mx.outputs[2], b.inputs['Base Color'])
            # relevo (afunda na trinca)
            bp = N.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.8; bp.inputs['Distance'].default_value = 0.004
            bp.invert = True
            L.new(mask.outputs[0], bp.inputs['Height'])
            if b.inputs['Normal'].links:
                L.new(b.inputs['Normal'].links[0].from_socket, bp.inputs['Normal'])
            L.new(bp.outputs[0], b.inputs['Normal'])
            for f in range(1, frames_do_grupo(g) + 1, 3):
                prog.outputs[0].default_value = pl(g['racha'], t_de(g, f))
                prog.outputs[0].keyframe_insert('default_value', frame=f)

    # ---------------- entulho do teto (9,5)
    def entulho(self):
        g = self.g
        if 'entulho' not in g:
            return
        sc = bpy.context.scene
        a, b = g['entulho']
        bpy.ops.mesh.primitive_plane_add(size=1, location=(0.3, 0.3, cena.PE - 0.01))
        em = bpy.context.object
        em.name = 'emissor_entulho'
        em.scale = (3.4, 2.4, 1)
        em.hide_render = True
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=1, location=(0, 0, -50))
        pd = bpy.context.object
        pd.name = 'pedaco_reboco'
        rnd = random.Random(4)
        for v in pd.data.vertices:
            v.co *= rnd.uniform(0.6, 1.3)
        pd.data.materials.append(bpy.data.materials['teto'])
        pd.hide_render = False
        ps = em.modifiers.new('ps', 'PARTICLE_SYSTEM').particle_system
        st = ps.settings
        st.count = 900
        st.frame_start = int(round((a - g['t0']) * FPS)) + 1
        st.frame_end = int(round((b - g['t0']) * FPS))
        st.lifetime = 200
        st.normal_factor = -0.2
        st.render_type = 'OBJECT'
        st.instance_object = pd
        st.particle_size = 0.006
        st.size_random = 0.8
        st.use_rotations = True
        st.rotation_mode = 'NOR'
        st.angular_velocity_mode = 'RAND'
        st.angular_velocity_factor = 4.0
        st.emit_from = 'FACE'
        ps.seed = 9
        # colisão com chão, tampos e mesa
        for o in [bpy.data.objects['piso'], bpy.data.objects['tampo0'], bpy.data.objects['tampo1']] + [x for x in self.O['mesa'].children_recursive if x.type == 'MESH']:
            o.modifiers.new('col', 'COLLISION')
            o.collision.damping_factor = 0.8
            o.collision.friction_factor = 0.8

    def montar(self):
        self.cameras()
        self.quedas()
        self.animar()
        self.rachaduras()
        self.entulho()
        if getattr(self, 'rigido', False):
            sc = bpy.context.scene
            with bpy.context.temp_override(scene=sc):
                bpy.ops.ptcache.bake_all(bake=True)
        return self


def usar_gpu():
    pr = bpy.context.preferences.addons['cycles'].preferences
    pr.compute_device_type = 'OPTIX'
    pr.get_devices()
    for d in pr.devices:
        d.use = d.type == 'OPTIX'
    bpy.context.scene.cycles.device = 'GPU'
    print('DISPOSITIVOS', [(d.name, d.type, d.use) for d in pr.devices], flush=True)
    sc = bpy.context.scene
    sc.render.use_persistent_data = True     # mantém BVH/texturas entre quadros
    sc.cycles.denoiser = 'OPTIX'
    sc.cycles.denoising_input_passes = 'RGB_ALBEDO_NORMAL'


def renderizar(gid, saida, previa=None, so=None, frames=None, gpu=False, res=None, amostras=None, passo=1):
    c = Cena(gid).montar()
    sc = bpy.context.scene
    if gpu:
        usar_gpu()
    if previa == 'workbench':
        sc.render.engine = 'BLENDER_WORKBENCH'
        sc.display.shading.light = 'STUDIO'
        sc.display.shading.color_type = 'TEXTURE'
        sc.display.shading.show_shadows = False
        sc.render.resolution_x, sc.render.resolution_y = res or (640, 360)
    else:
        if res:
            sc.render.resolution_x, sc.render.resolution_y = res
        if amostras:
            sc.cycles.samples = amostras
    sc.render.image_settings.file_format = 'JPEG' if previa else 'PNG'
    sc.render.image_settings.quality = 92
    for pid, co, f0, f1, cid in c.cams:
        if so and pid not in so:
            continue
        sc.camera = co
        lista = range(f0, f1 + 1, passo) if not frames else [f for f in frames if f0 <= f <= f1]
        os.makedirs(f'{saida}/{pid}', exist_ok=True)
        for f in lista:
            sc.frame_set(f)
            sc.render.filepath = f'{saida}/{pid}/{(f - f0) // passo + 1:04d}'
            bpy.ops.render.render(write_still=True)
        print('PLANO', pid, len(lista), flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    gid = a[0]
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    if '--salvar' in a:
        Cena(gid).montar()
        bpy.ops.wm.save_as_mainfile(filepath=os.path.join(AQUI, f'blend/{gid}.blend'))
    else:
        so = opt('--plano')
        fr = opt('--frames')
        frames = None
        if fr:
            frames = []
            for parte in fr.split(','):
                x, y = (parte.split('-') + [parte])[:2]
                frames += list(range(int(x), int(y) + 1))
        res = opt('--res')
        res = tuple(int(v) for v in res.split('x')) if res else None
        am = opt('--amostras')
        renderizar(gid, opt('--saida', os.path.join(AQUI, 'saida')), previa=opt('--previa'), so=so.split(',') if so else None,
                   frames=frames, gpu='--gpu' in a, res=res, amostras=int(am) if am else None, passo=int(opt('--passo', '1')))
