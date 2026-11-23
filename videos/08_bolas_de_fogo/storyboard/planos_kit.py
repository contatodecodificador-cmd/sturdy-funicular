"""Linha do tempo do kit CapCut do vídeo 8: vídeos do Higgsfield (HF), abertura (AB), gráficos animados (G) e fotos reais (R).
Reaproveita o corte de planos de planos8.py (≤5 s, cortes na pontuação)."""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import planos8 as P8
C2 = {
 0: ['AB:p1', 'HF:H08'], 1: ['HF:H06'], 2: ['HF:H07'], 3: ['AB:p3'], 4: ['HF:H09', 'AB:p4'],
 5: ['G:Sismo:papel', 'G:MapaLaPaz:0'], 6: ['G:MapaBR:alerta', 'G:Viagem:0', 'G:Jornal:0', 'G:Estante:0'], 7: ['HF:H10'],
 8: ['G:Pasta:abre', 'HF:H11', 'HF:H36', 'G:MapaSP:0'], 9: ['AB:p5', 'G:Pasta:pergunta'],
 10: ['G:MapaAM:0', 'G:MapaAM:1'], 11: ['G:MapaAM:regua', 'HF:H14', 'G:MapaAM:1'], 12: ['HF:H12', 'AB:p2', 'HF:H13'],
 13: ['G:MapaAM:javari', 'HF:H51', 'G:MapaAM:barco', 'HF:H27'], 14: ['G:Relogio8'], 15: ['HF:H16', 'HF:H06'],
 16: ['HF:H17', 'HF:H07', 'AB:p5'], 17: ['AB:p3', 'HF:H18', 'HF:H08'], 18: ['HF:H19', 'HF:H09'],
 19: ['HF:H20', 'HF:H21', 'HF:H09'], 20: ['G:Caderno:fechado', 'G:Pasta:pergunta'],
 21: ['HF:H22', 'HF:H11', 'HF:H23', 'G:MapaAM:1'], 22: ['G:Calendario', 'HF:H24'], 23: ['HF:H25', 'G:Caderno:escreve'],
 24: ['HF:H33', 'G:Airburst:1', 'HF:H39'], 25: ['G:Tunguska:mapa', 'HF:H26', 'G:Tunguska:kulik', 'HF:H22'],
 26: ['G:Viagem:1', 'HF:H27', 'G:Viagem:2'], 27: ['HF:H28', 'G:Jornal:1', 'G:Jornal:0'], 28: ['HF:H29', 'G:MapaBR:apagado', 'HF:H14'],
 29: ['G:Estante:1', 'HF:H30'], 30: ['HF:H31', 'HF:H34', 'G:GloboBolidos'], 31: ['G:ArtigoRusso', 'G:Tunguska:kulik', 'HF:H26'],
 32: ['HF:H32', 'HF:H30'], 33: ['G:Jornal:2'], 34: ['HF:H33', 'G:Regua:0', 'HF:H39'],
 35: ['HF:H34', 'R:perseidas', 'G:GloboBolidos', 'HF:H47'], 36: ['G:MapaLaPaz:1', 'G:Pasta:abre'],
 37: ['HF:H35', 'G:Sismo:tambor', 'G:Sismo:papel'], 38: ['G:Sismo:pico', 'G:MapaLaPaz:1', 'HF:H35'],
 39: ['HF:H51', 'HF:H36', 'G:MapaAM:1', 'HF:H14'], 40: ['HF:H36', 'G:Pasta:abre'], 41: ['HF:H37', 'G:MapaAM:javari'],
 42: ['HF:H38', 'G:Pasta:contestada'], 43: ['G:Mexico:2', 'G:Sismo:papel', 'G:Pasta:contestada', 'HF:H35'],
 44: ['G:TamanhoPedra', 'HF:H39', 'G:Airburst:1'], 45: ['G:Pasta:contestada'], 46: ['G:Airburst:0', 'HF:H36'],
 47: ['G:Airburst:1', 'HF:H39', 'HF:H33', 'G:Airburst:0'], 48: ['HF:H26', 'G:Tunguska:mapa', 'HF:H40'],
 49: ['HF:H40', 'HF:H38', 'HF:H51'], 50: ['G:Regua:0', 'HF:H09'], 51: ['G:Regua:1', 'HF:H38'],
 52: ['R:chelyabinsk', 'HF:H41', 'G:Regua:2'], 53: ['HF:H41', 'R:chelyabinsk', 'HF:H43', 'G:Regua:2'],
 54: ['G:Regua:3', 'HF:H33'], 55: ['G:Regua:4', 'HF:H26'], 56: ['G:MapaSP:tunguska', 'HF:H26', 'G:Regua:4'],
 57: ['HF:H10', 'HF:H42', 'HF:H43', 'G:MapaSP:0', 'HF:H42', 'HF:H10'], 58: ['HF:H44', 'G:MapaBR:alerta'],
 59: ['HF:H44', 'HF:H45', 'HF:H46'], 60: ['G:Celular', 'HF:H46', 'HF:H45'], 61: ['G:Split', 'HF:H11'],
 62: ['HF:H47', 'G:Bramon', 'G:Bramon:risco', 'HF:H34'], 63: ['HF:H48', 'HF:H34', 'HF:H47'],
 64: ['R:bendego', 'HF:H32', 'R:bendego', 'HF:H48', 'R:bendego'], 65: ['HF:H50', 'HF:H46', 'HF:H44', 'HF:H50'],
 66: ['G:GloboBolidos', 'HF:H51'], 67: ['G:Pasta:pergunta'], 68: ['G:Hipoteses', 'HF:H33', 'HF:H39', 'G:Hipoteses'],
 69: ['HF:H51', 'HF:H40'], 70: ['HF:H52', 'HF:H25'], 71: ['HF:H53', 'AB:p1'], 72: ['G:Cartela', 'G:Cartela', 'G:Cartela'],
}
# substitui os visuais mantendo o texto na tela e a descrição de cada parágrafo
novo = []
for i, (bloco, vis) in enumerate(P8.C):
    itens = C2[i]
    novo.append((bloco, [(v, 'mov', (vis[j][2] if j < len(vis) else vis[-1][2]), (vis[j][3] if j < len(vis) else None)) for j, v in enumerate(itens)]))
P8.C = novo
P = P8.planos()
ABERT = 24.0
for p in P: p['T0'] = round(p['t0'] + ABERT, 2); p['T1'] = round(p['t1'] + ABERT, 2)
json.dump(P, open(os.path.join(P8.V, 'kit_capcut', 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
seq = [(P[i]['vis'], P[i + 1]['vis']) for i in range(len(P) - 1) if P[i]['vis'] == P[i + 1]['vis'] and not P[i]['vis'].startswith('G:Cartela')]
print(len(P), 'planos; repetições seguidas:', seq)
print('maior', max(p['t1'] - p['t0'] for p in P))
# troca o 2º de dois planos seguidos com o MESMO vídeo de IA (o clipe só tem 5 s: repetir seria loop)
POOL = {'INTRODUÇÃO': ['AB:p2', 'HF:H14', 'HF:H16', 'HF:H51'], 'ATO 1 · A MANHÃ': ['HF:H14', 'HF:H12', 'HF:H16', 'AB:p2'],
        'ATO 2 · O MENSAGEIRO': ['HF:H27', 'HF:H28', 'HF:H14', 'HF:H51'], 'ATO 3 · OS DETETIVES': ['HF:H51', 'HF:H34', 'HF:H31', 'HF:H14'],
        'LADO A LADO · A RÉGUA DE ENERGIA': ['HF:H33', 'HF:H39', 'HF:H41', 'HF:H09'], 'ATO 4 · QUEM VIGIA O CÉU': ['HF:H47', 'HF:H48', 'HF:H44', 'HF:H34'],
        'FECHO': ['HF:H51', 'HF:H14']}
for i in range(1, len(P)):
    if P[i]['vis'] == P[i - 1]['vis'] and P[i]['vis'][:3] in ('HF:', 'AB:'):
        viz = {P[i - 1]['vis'], P[i + 1]['vis'] if i + 1 < len(P) else ''}
        P[i]['vis'] = next(v for v in POOL[P[i]['bloco']] if v not in viz)
        P[i]['desc'] += ' (plano de cobertura)'
json.dump(P, open(os.path.join(P8.V, 'kit_capcut', 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
print('HF repetidos agora:', [P[i]['vis'] for i in range(1, len(P)) if P[i]['vis'] == P[i-1]['vis'] and P[i]['vis'][:3] in ('HF:','AB:')])
print('gráficos:', sum(1 for p in P if p['vis'].startswith('G:')), 'HF:', sum(1 for p in P if p['vis'].startswith('HF:')), 'AB:', sum(1 for p in P if p['vis'].startswith('AB:')), 'R:', sum(1 for p in P if p['vis'].startswith('R:')))
