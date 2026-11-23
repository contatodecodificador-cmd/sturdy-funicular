"""Vídeo 8 — lista de planos com tempos reais (audio/alinhamento.json + audio/paragrafos.json).
Cada parágrafo da narração recebe uma lista de visuais; o parágrafo é cortado nas pausas naturais (pontuação)
e nenhum plano passa de 5 s. Visual: '<Componente>[:arg]'. Movimento: 'mov' = cena já animada (sem zoom);
'zoom' = cena quase parada, com UM zoom leve e linear do primeiro ao último quadro.
Item: (visual, movimento, descrição, texto_na_tela|None)
"""
import json, math, os
V = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = [w for w in json.load(open(os.path.join(V, 'audio', 'alinhamento.json')))['words'] if w['text'].strip()]
PAR = json.load(open(os.path.join(V, 'audio', 'paragrafos.json')))

IN, A1, A2, A3, ES, A4, FE = ('INTRODUÇÃO', 'ATO 1 · A MANHÃ', 'ATO 2 · O MENSAGEIRO', 'ATO 3 · OS DETETIVES',
                              'LADO A LADO · A RÉGUA DE ENERGIA', 'ATO 4 · QUEM VIGIA O CÉU', 'FECHO')
C = [
 (IN, [('Rio:amanhecer', 'mov', 'Rio amazônico ao amanhecer, névoa, canoa', None), ('Rio:fogo', 'mov', 'Bolas de fogo riscando o céu sobre a mata', None)]),
 (IN, [('Rio:vermelho', 'mov', 'O sol nasce vermelho-sangue atrás da mata', None)]),
 (IN, [('Rio:po', 'mov', 'Pó fino vermelho caindo sobre a água', None)]),
 (IN, [('Rio:assobio', 'mov', 'Riscos de fogo descendo; assobio', None)]),
 (IN, [('Explosoes:3', 'mov', 'Três clarões atrás da floresta; a água treme', '3 EXPLOSÕES')]),
 (IN, [('Sismo:papel', 'mov', 'Sismograma de papel: a agulha risca um pico', None), ('MapaLaPaz:0', 'mov', 'Do Curuçá até a Bolívia', None)]),
 (IN, [('MapaBR:alerta', 'mov', 'Mapa do Brasil escuro, ponto vermelho no oeste', 'NINGUÉM SOUBE'), ('Viagem:0', 'mov', 'A notícia viaja até o Vaticano', None),
       ('Jornal:0', 'zoom', 'Um jornal de Roma, 1931', None), ('Estante:0', 'mov', 'E sumiu de novo: 65 anos', None)]),
 (IN, [('Cristo:fogo', 'mov', 'Cristo Redentor, céu vermelho, bola de fogo atrás', None)]),
 (IN, [('Pasta:abre', 'mov', 'A pasta do caso abrindo', None), ('Frei:0', 'mov', 'As testemunhas', None), ('Satelite:0', 'mov', 'A cratera na selva', None),
       ('MapaSP:0', 'zoom', 'Em cima de uma cidade brasileira', None)]),
 (IN, [('Pasta:pergunta', 'mov', 'O que caiu no Curuçá?', 'O QUE CAIU?')]),
 # ATO 1
 (A1, [('MapaAM:0', 'mov', 'Mapa do Amazonas, zoom até a fronteira com o Peru', None), ('MapaAM:1', 'mov', 'Rio Javari e o afluente Curuçá', None)]),
 (A1, [('MapaAM:regua', 'mov', 'Régua: Manaus → Curuçá maior que SP → Brasília', '+1.000 KM DE MANAUS'), ('Vila:0', 'mov', 'Sem estrada, sem rádio: só o rio', None)]),
 (A1, [('Vila:1', 'mov', 'Palafitas, canoas, gente remando', None), ('Vila:2', 'mov', 'Pesca, roça, borracha', None)]),
 (A1, [('MapaAM:javari', 'zoom', 'Vale do Javari: uma das regiões mais isoladas do planeta', None), ('MapaAM:barco', 'mov', 'Ainda hoje: dias de barco', None)]),
 (A1, [('Relogio8', 'mov', 'Relógio de bolso: 8 da manhã', None)]),
 (A1, [('Rio:vermelho', 'mov', 'O sol vira um disco vermelho', None), ('Rio:vermelho2', 'mov', 'Vermelho escuro no meio da manhã', None)]),
 (A1, [('Rio:po2', 'mov', 'Pó fino sobre telhado de palha e água', None), ('Rio:po', 'mov', 'Até perto do meio-dia', None)]),
 (A1, [('Rio:assobio', 'mov', 'Assobios cada vez mais altos', None), ('Rio:pescadores', 'mov', 'Pescadores olhando para cima; fogo atrás das árvores', None)]),
 (A1, [('Explosoes:123', 'mov', 'Três clarões numerados; ondas no chão', None)]),
 (A1, [('Familia', 'mov', 'Família saindo de casa correndo', None), ('Vila:medo', 'mov', 'Sem rádio, sem vizinho pra perguntar', None)]),
 (A1, [('Caderno:fechado', 'zoom', 'Um caderno: um único relato', 'UM ÚNICO RELATO')]),
 # ATO 2
 (A2, [('Frei:0', 'mov', 'Frei capuchinho na canoa, caderno no colo', None), ('Frei:1', 'mov', 'Subindo o rio de povoado em povoado', None),
       ('Vila:missao', 'mov', 'Batizado, casamento, notícias', None)]),
 (A2, [('Calendario', 'mov', 'Calendário: 13 → 18 de agosto', None), ('Vila:conta', 'mov', 'Todo mundo queria contar', None)]),
 (A2, [('Caderno:escreve', 'mov', 'O frei anota: sol vermelho, pó, assobios, 3 explosões', None)]),
 (A2, [('Meteoro', 'mov', 'Uma pedra do espaço explodindo no céu', 'UM METEORO'), ('Meteoro:2', 'mov', 'Não era castigo nem assombração', None)]),
 (A2, [('Tunguska:mapa', 'zoom', 'Sibéria, 1908', None), ('Tunguska:leque', 'zoom', 'Floresta derrubada em leque', None), ('Frei:2', 'mov', 'O frei chega à mesma ideia', None)]),
 (A2, [('Viagem:1', 'mov', 'Canoa → Javari → Solimões', None), ('Viagem:2', 'mov', 'Navio → Europa', None)]),
 (A2, [('Jornal:1', 'zoom', "L'OSSERVATORE ROMANO, março de 1931", '7 MESES DEPOIS')]),
 (A2, [('Rio1930', 'mov', 'Rio de Janeiro, 1930: revolução', None), ('MapaBR:apagado', 'zoom', 'Ninguém olhava pro Javari', None)]),
 (A2, [('Estante:1', 'mov', 'O jornal na estante; 1931 → 1995', None)]),
 # ATO 3
 (A3, [('Armagh', 'zoom', 'Observatório de Armagh, Irlanda do Norte, 1995', None), ('Armagh:2', 'zoom', 'Mark Bailey estuda pedras que podem bater na Terra', None)]),
 (A3, [('ArtigoRusso', 'zoom', 'Artigo russo: KULIK sublinhado', None), ('Tunguska:kulik', 'zoom', 'O homem que investigou Tunguska', None)]),
 (A3, [('Biblioteca', 'mov', 'Biblioteca do Vaticano: o jornal de 1931', None)]),
 (A3, [('Jornal:2', 'zoom', '"Tunguska brasileiro"', 'TUNGUSKA BRASILEIRO')]),
 (A3, [('TresPedras', 'mov', 'Três pedras do tamanho de casas entrando na atmosfera', '~1 MEGATON')]),
 (A3, [('Perseidas', 'mov', 'Chuva de meteoros Perseidas', None), ('Perseidas:2', 'mov', 'Coincidência?', None)]),
 (A3, [('MapaLaPaz:1', 'mov', 'Curuçá → La Paz, 1.300 km', None)]),
 (A3, [('Sismo:tambor', 'mov', 'Sismógrafo de tambor, San Calixto', None), ('Sismo:papel', 'mov', 'O registro de 13/08/1930', None)]),
 (A3, [('Sismo:pico', 'zoom', 'O pico no papel', 'MESMO DIA · MESMA REGIÃO')]),
 (A3, [('Satelite:0', 'mov', 'Imagem de satélite em falsa cor', None), ('Satelite:circulo', 'mov', 'Um círculo de ~1 km no meio da mata', None)]),
 (A3, [('Satelite:circulo', 'zoom', 'Parecia a cratera', 'UMA CRATERA?')]),
 (A3, [('Expedicao:0', 'mov', 'Expedição de 1997 entrando na selva', None)]),
 (A3, [('Expedicao:circulo', 'zoom', 'Nada de especial: nenhum fragmento', None)]),
 (A3, [('Mexico', 'zoom', 'Pesquisadores do México, 2011', None), ('Mexico:2', 'mov', 'O tremor parece terremoto comum', None)]),
 (A3, [('TamanhoPedra', 'zoom', 'Uma pedra de menos de 9 metros', 'MENOS DE 9 METROS')]),
 (A3, [('Pasta:contestada', 'zoom', 'As provas na mesa; duas com interrogação', None)]),
 (A3, [('Airburst:0', 'mov', 'Cadê o buraco?', None)]),
 (A3, [('Airburst:1', 'mov', 'A pedra explode no ar', 'EXPLODE NO AR')]),
 (A3, [('Tunguska:leque', 'zoom', 'Tunguska: floresta deitada, sem cratera', None), ('Tunguska:centro', 'zoom', 'No centro, árvores de pé sem galhos', None)]),
 (A3, [('Floresta', 'mov', 'A floresta cresce por cima e apaga a marca', 'SEM CRATERA')]),
 # ESPECIAL
 (ES, [('Regua:0', 'mov', 'Régua em bombas de Hiroshima: 1', None)]),
 (ES, [('Regua:1', 'mov', 'Curuçá, estimativa baixa ≈ 1', None)]),
 (ES, [('Chelyabinsk', 'mov', 'Chelyabinsk, 2013: clarão sobre a cidade', None), ('Regua:2', 'mov', 'Chelyabinsk ≈ 30', None)]),
 (ES, [('Chelyabinsk:vidro', 'mov', 'Vidraças estourando', '1.500 FERIDOS'), ('Chelyabinsk:janela', 'mov', 'Gente na janela olhando o clarão', None)]),
 (ES, [('Regua:3', 'mov', 'Curuçá, estimativa de Bailey ≈ 67', None)]),
 (ES, [('Regua:4', 'mov', 'Tunguska ≈ 700 a 1.000', None)]),
 (ES, [('MapaSP:tunguska', 'zoom', 'A área de Tunguska em cima de São Paulo', '80 MILHÕES DE ÁRVORES')]),
 (ES, [('Cristo:clarao', 'mov', 'E se fosse aqui?', 'E SE FOSSE AQUI?'), ('Cristo:vidro', 'mov', 'Vidro estourado em bairros inteiros', None),
       ('Cristo:raio', 'zoom', 'Raio de quilômetros (anota com lápis)', None)]),
 # ATO 4
 (A4, [('Sertao:0', 'mov', 'Santa Filomena (PE), 2020', None)]),
 (A4, [('Sertao:pedras', 'mov', 'Pedras do espaço caindo', None), ('Sertao:telhado', 'mov', 'Uma fura o telhado de um bar', None)]),
 (A4, [('Celular', 'mov', 'Vídeos no celular em poucas horas', None), ('Sertao:caca', 'mov', 'Moradores caçando fragmentos', 'R$ 120 MIL')]),
 (A4, [('Split', 'mov', '1930: 7 meses e um frei × 2020: minutos e um celular', None)]),
 (A4, [('Bramon', 'mov', 'Mapa do Brasil com câmeras apontadas pro céu', None), ('Bramon:risco', 'mov', 'Várias câmeras pegam o mesmo risco', None)]),
 (A4, [('Sonear', 'zoom', 'Observatório amador em Oliveira (MG)', None), ('Sonear:ceu', 'mov', 'Dezenas de asteroides descobertos', None)]),
 (A4, [('Bendego', 'zoom', 'O meteorito de Bendegó', '5,3 TONELADAS'), ('Bendego:fogo', 'mov', 'Museu Nacional em chamas, 2018', None), ('Bendego:2', 'zoom', 'Ele sobreviveu', None)]),
 (A4, [('Checklist', 'mov', 'Como reconhecer um meteorito', None), ('Checklist:ima', 'mov', 'Pesado, casca escura, gruda no ímã', None)]),
 (A4, [('GloboBolidos', 'mov', 'A maioria cai no mar ou onde não tem ninguém', None)]),
 # FECHO
 (FE, [('Pasta:pergunta', 'mov', 'Então, o que caiu no Curuçá?', None)]),
 (FE, [('Hipoteses', 'mov', 'Três respostas possíveis', 'TRÊS RESPOSTAS')]),
 (FE, [('Mata', 'mov', 'A mata vista de cima, sem marca', None)]),
 (FE, [('Caderno:fecha', 'mov', 'O caderno do frei fechando', 'UM CADERNO')]),
 (FE, [('Rio:calmo', 'mov', 'O mesmo rio, amanhecer calmo', None)]),
 (FE, [('Cartela', 'mov', 'Cartela final Brasil Milenar', None)]),
]
# provas da pasta (o contador no canto) — liberadas no início do parágrafo indicado
PROVAS = {15: 1, 16: 2, 18: 3, 27: 4, 37: 5, 43: 6}


def planos():
    assert len(PAR) == len(C), (len(PAR), len(C))
    out = []; wi = 0
    for pi, ((bloco, vis), p) in enumerate(zip(C, PAR)):
        n = len(p['txt'].split()); ws = W[wi:wi + n]; wi += n
        dur = ws[-1]['end'] - ws[0]['start']; k = max(len(vis), math.ceil((dur + 0.6) / 4.7))
        vis = vis + [(vis[-1][0], vis[-1][1], vis[-1][2] + ' (cont.)', None)] * (k - len(vis))
        cortes = [0]
        for j in range(1, len(vis)):
            alvo = ws[0]['start'] + dur * j / len(vis)
            cand = [i for i in range(cortes[-1] + 1, n) if abs(ws[i]['start'] - alvo) < 1.0 and ws[i - 1]['text'][-1:] in ',.?!:;…']
            i = min(cand, key=lambda i: abs(ws[i]['start'] - alvo)) if cand else min(range(cortes[-1] + 1, n), key=lambda i: abs(ws[i]['start'] - alvo))
            cortes.append(i)
        cortes.append(n)
        seg = [(cortes[j], cortes[j + 1], vis[j], False) for j in range(len(vis))]
        mudou = True
        while mudou:
            mudou = False; novo = []
            for a, b, v, rep in seg:
                fim = ws[b]['start'] if b < n else ws[b - 1]['end'] + 0.9
                if fim - ws[a]['start'] > 4.85 and b - a > 1:
                    meio = ws[a]['start'] + (fim - ws[a]['start']) / 2
                    m = min(range(a + 1, b), key=lambda i: abs(ws[i]['start'] - meio))
                    novo += [(a, m, v, rep), (m, b, v, True)]; mudou = True
                else: novo.append((a, b, v, rep))
            seg = novo
        for si, (a, b, v, rep) in enumerate(seg):
            out.append(dict(bloco=bloco, par=pi, vis=v[0], mov=v[1], desc=v[2] + (' (outro recorte)' if rep else ''), tela=None if rep else v[3],
                            prova=PROVAS.get(pi) if si == 0 else None, rep=rep, w0=ws[a], fala=' '.join(w['text'] for w in ws[a:b])))
    for k, p in enumerate(out):
        p['t0'] = round(p['w0']['start'] - 0.15, 3) if k else 0.0
        p['t1'] = round(out[k + 1]['w0']['start'] - 0.15, 3) if k + 1 < len(out) else round(W[-1]['end'] + 2.5, 3)
        p['id'] = f'p{k + 1:03d}'
        del p['w0']
    return out


if __name__ == '__main__':
    P = planos()
    json.dump(P, open(os.path.join(V, 'render', 'src', 'planos8.json'), 'w'), ensure_ascii=False, indent=1)
    m = max(P, key=lambda p: p['t1'] - p['t0'])
    print(len(P), 'planos · maior', round(m['t1'] - m['t0'], 2), 's ·', m['fala'][:50])
    for p in P:
        if p['t1'] - p['t0'] > 5: print('ACIMA DE 5 s:', p['id'], round(p['t1'] - p['t0'], 2), p['fala'][:70])
    print('componentes:', sorted({p['vis'].split(':')[0] for p in P}))
