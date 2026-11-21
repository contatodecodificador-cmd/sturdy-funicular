# Prévia de imagem: python3 previa.py <saida.png> <res_x> <amostras> <cam>  (cam: aberto|copo|mesa|prateleira)
import bpy, sys, os, math, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import cena
from mathutils import Vector
CAMS = {  # posição, alvo, lente(mm), foco(m ou None), f-stop
 'aberto': ((0.55, -2.75, 1.55), (-0.25, 0.9, 1.05), 24, None, 8),
 'copo': ((0.3, -0.45, 1.0), (0.03, -0.03, 0.865), 85, 'copo', 2.8),
 'ondas': ((0.2, -0.3, 1.06), (0.03, -0.03, 0.872), 85, 'copo', 4.0),
 'mesa': ((-0.6, -1.25, 1.2), (0.1, 0.25, 0.85), 40, 'copo', 3.5),
 'prateleira': ((0.9, -0.5, 1.55), (1.6, 1.5, 1.6), 50, None, 4),
}
def camera(nome, K):
    p, alvo, lente, foco, fs = CAMS[nome]
    cd = bpy.data.cameras.new(nome); co = bpy.data.objects.new(nome, cd); bpy.context.scene.collection.objects.link(co)
    co.location = p; d = Vector(alvo) - Vector(p); co.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    cd.lens = lente; cd.sensor_width = 36
    if foco:
        cd.dof.use_dof = True; cd.dof.focus_object = K['O'][foco] if foco in K['O'] else None; cd.dof.aperture_fstop = fs
    bpy.context.scene.camera = co; return co
if __name__ == '__main__':
    out, rx, amo, cam = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
    K = cena.construir()
    camera(cam, K)
    if '--onda' in sys.argv:
        md = K['O']['agua'].modifiers['ondas']
        cena.gn(md, 'Amp').value = float(sys.argv[sys.argv.index('--onda') + 1]); cena.gn(md, 'Tempo').value = 0.37
    sc = bpy.context.scene; cena.render((rx, rx * 9 // 16), amo)
    if '--gpu' in sys.argv:
        pr = bpy.context.preferences.addons['cycles'].preferences; pr.compute_device_type = 'OPTIX'; pr.get_devices()
        for d in pr.devices: d.use = d.type == 'OPTIX'
        sc.cycles.device = 'GPU'
    else:
        sc.cycles.device = 'CPU'
    sc.render.filepath = out; t = time.time(); bpy.ops.render.render(write_still=True); print('TEMPO', round(time.time() - t, 1))
