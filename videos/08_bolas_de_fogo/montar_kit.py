"""Monta o kit CapCut do vídeo 8 (para o GPT montar): pastas, arquivos nomeados na ordem, timeline.csv e guia."""
import json, os, shutil, csv, subprocess
K = 'kit_capcut'; T = json.load(open(f'{K}/timeline.json'))
for d in ['07_prints_noticias', '08_3d', '01_abertura', '02_videos_ia', '03_graficos', '04_fotos_reais', '05_audio/efeitos', '05_audio/musicas_opcional', '06_thumbnail']:
    os.makedirs(f'{K}/{d}', exist_ok=True)
# abertura
for i in range(1, 6): shutil.copy(f'abertura/p{i}.mp4', f'{K}/01_abertura/abertura_plano{i}.mp4')
shutil.copy('abertura/abertura_som.wav', f'{K}/01_abertura/abertura_som_completo.wav')
shutil.copy('abertura/abertura_video.mp4', f'{K}/01_abertura/abertura_montada_sem_som_24s.mp4')
# vídeos de IA
for f in sorted(os.listdir('hf_bruto')): shutil.copy(f'hf_bruto/{f}', f'{K}/02_videos_ia/{f}')
# fotos reais
for a, b in [('real_chelyabinsk', 'chelyabinsk_2013_rastro_REAL.jpg'), ('real_bendego', 'bendego_museu_nacional_REAL.jpg'), ('real_perseidas', 'perseidas_REAL.jpg')]:
    shutil.copy(f'render/public/img/{a}.jpg', f'{K}/04_fotos_reais/{b}')
# áudio
shutil.copy('audio/voz_completa.mp3', f'{K}/05_audio/narracao_completa.mp3')
for f in os.listdir('sfx'): shutil.copy(f'sfx/{f}', f'{K}/05_audio/efeitos/{f}')
for f in os.listdir('musica'): shutil.copy(f'musica/{f}', f'{K}/05_audio/musicas_opcional/{f}')
shutil.copy('thumbnail/thumbnail_final.png', f'{K}/06_thumbnail/thumbnail_FOI_REAL.png')
shutil.copy('youtube_descricao.md', f'{K}/descricao_youtube.md')

FUNDO_R = {'R:chelyabinsk': ('04_fotos_reais/chelyabinsk_2013_rastro_REAL.jpg', 'H41'), 'R:bendego': ('04_fotos_reais/bendego_museu_nacional_REAL.jpg', 'H32'), 'R:perseidas': ('04_fotos_reais/perseidas_REAL.jpg', 'H34')}
COM_AUDIO = {'H08', 'H09', 'H10', 'H12', 'H18', 'H19', 'H20', 'H23', 'H25', 'H27', 'H28', 'H29', 'H33', 'H35', 'H37', 'H39', 'H41', 'H42', 'H43', 'H44', 'H45', 'H46', 'H51', 'H53'}
SFX = {'HF:H08': 'explosao_longe (baixo) ou som nativo', 'HF:H09': 'som nativo (3 estrondos) + explosao_longe', 'AB:p3': 'assobio (baixo, 40%)',
       'AB:p4': 'clarao + impacto + explosao_longe', 'HF:H19': 'som nativo (tremor)', 'HF:H33': 'som nativo / plasma', 'HF:H39': 'som nativo + clarao',
       'HF:H41': 'som nativo + vidro', 'HF:H42': 'som nativo + vidro', 'HF:H45': 'som nativo + pedras_caindo', 'HF:H44': 'pedras_caindo',
       'HF:H25': 'pena', 'HF:H35': 'sismografo', 'G:Sismo:papel': 'sismografo', 'G:Sismo:tambor': 'sismografo', 'G:Sismo:pico': 'sismografo',
       'G:Jornal:0': 'folhear', 'G:Jornal:1': 'folhear', 'G:Jornal:2': 'papel', 'G:Pasta:abre': 'papel', 'G:Pasta:contestada': 'carimbo',
       'G:Relogio8': 'tique', 'G:Caderno:escreve': 'pena', 'AB:p1': 'rio', 'HF:H14': 'floresta (baixo)', 'HF:H51': 'floresta (baixo)', 'HF:H12': 'som nativo',
       'G:Airburst:1': 'clarao', 'HF:H26': '—', 'G:Estante:0': '—'}
gnum = 0; gfiles = {}
rows = []
for i, p in enumerate(T):
    n = i + 1; v = p['vis']; d = p['t1'] - p['t0']
    if v.startswith('HF:'):
        h = v[3:]; arq = f'02_videos_ia/{h}.mp4'; tipo = 'vídeo IA'
        uso = f'usar do início do clipe por {d:.2f} s; sem zoom' + ('; manter o som nativo a ~30%' if h in COM_AUDIO else '; clipe mudo')
    elif v.startswith('AB:'):
        arq = f'01_abertura/abertura_{v[3:].replace("p", "plano")}.mp4'; tipo = 'vídeo IA (reuso da abertura)'; uso = f'usar a partir de 0,5 s por {d:.2f} s; sem zoom; som do clipe desligado'
    elif v.startswith('N:'):
        arq = f'07_prints_noticias/print_{v[2:]}.mp4'; tipo = 'PRINT DE NOTÍCIA (pronto)'; uso = f'usar do início por {d:.2f} s (cartão já animado, com grifo e fonte); entrada com escala + whoosh'
    elif v.startswith('3D:'):
        arq = '08_3d/barco_3d_viagem.mp4'; tipo = 'animação 3D (pronta)'; uso = f'usar do início por {d:.2f} s; sem zoom'
    elif v.startswith('R:'):
        foto, fundo = FUNDO_R[v]; arq = foto; tipo = 'FOTO REAL em cartão'
        uso = f'CARTÃO: foto no centro com ~68% da largura, borda branca 8 px, cantos 12 px, sombra forte; FUNDO = 02_videos_ia/{fundo}.mp4 desfocado (blur 30) e escurecido 50%; zoom leve 100→104% só na foto'
    else:
        gnum += 1; arq = f'03_graficos/{n:03d}_{v[2:].replace(":", "_")}.mp4'; tipo = 'gráfico animado'; uso = f'usar inteiro ({d:.2f} s); sem zoom extra'
        gfiles[p['id']] = arq
    rows.append([n, f"{p['T0']:.2f}", f"{p['T1']:.2f}", f'{d:.2f}', arq, tipo, uso, p['tela'] or '', SFX.get(v, ''), p['bloco'], p['desc'], p['fala']])
with open(f'{K}/timeline.csv', 'w', newline='', encoding='utf-8-sig') as fh:
    w = csv.writer(fh, delimiter=';')
    w.writerow(['plano', 'início (s)', 'fim (s)', 'duração (s)', 'arquivo', 'tipo', 'como usar', 'texto na tela', 'efeito sonoro (05_audio/efeitos)', 'bloco', 'o que mostra', 'fala'])
    w.writerows(rows)
json.dump(gfiles, open(f'{K}/_graficos_map.json', 'w'))
print(len(rows), 'planos;', gnum, 'gráficos')
