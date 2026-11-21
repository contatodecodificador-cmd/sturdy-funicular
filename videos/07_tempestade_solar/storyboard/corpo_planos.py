"""Planos do corpo (depois da introdução), com tempos reais (audio/voz_completa.mp3 + audio/alinhamento.json).
Cada parágrafo da narração recebe uma lista de visuais; o parágrafo é cortado em pontos naturais da fala
(pontuação mais próxima) para que nenhum plano passe de 5 s.
Visual: '3D:<prévia>' ou '2D:<função>[:arg]'. Movimento: 'mov' = já tem movimento (sem zoom) | 'zoom' = imagem parada com UM zoom leve contínuo.
"""
import json, math, os
V = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = [w for w in json.load(open(os.path.join(V, 'audio', 'alinhamento.json')))['words'] if w['text'].strip()]
PAR = json.load(open(os.path.join(V, 'audio', 'paragrafos.json')))

B1, B2, B3, B4, B5, FE = ('BLOCO 1 · AS TRÊS ONDAS', 'BLOCO 2 · ARQUIVO: QUEM JÁ LEVOU UMA DESSAS', 'BLOCO 3 · IMPACTO, HORA A HORA NO BRASIL',
                          'BLOCO 4 · O PONTO FRACO (A VIRADA)', 'BLOCO 5 · O PIOR CASO E A PARTE HONESTA', 'FECHO')
# (bloco, [(visual, movimento, descrição, texto_na_tela|None, relógio|None), ...]) — um item por parágrafo, na ordem
C = [
 (B1, [('2D:q_ondas:0', 'mov', 'Esquema Sol → Terra: as ondas vão sair', None, '17:20:00'), ('2D:q_ondas:3', 'mov', 'As três ondas aparecem em sequência', 'TRÊS ONDAS', '17:20:00')]),
 (B1, [('2D:q_ondas:1', 'mov', 'Onda 1: luz branca chega em 8 min', '8 MINUTOS', '17:19:50'), ('3D:S04', 'mov', 'O lado de dia da Terra brilha (atmosfera aquece)', None, '17:19:46'),
       ('2D:q_radio', 'zoom', 'Rádio de ondas curtas: sinal cortado', None, '17:19:41'), ('2D:q_aviao', 'mov', 'Avião e navio perdem a voz', None, '17:19:37')]),
 (B1, [('2D:q_ondas:2', 'mov', 'Onda 2: partículas rápidas', None, '17:19:30'), ('2D:q_protons', 'mov', 'Prótons atravessando um satélite', None, '17:19:26'), ('3D:S07', 'mov', 'Satélites em órbita', None, '17:19:22')]),
 (B1, [('2D:q_ondas:3', 'mov', 'Onda 3: a nuvem, lenta e enorme', None, '17:19:15'), ('3D:S05', 'mov', 'A nuvem de plasma viajando', '2 A 3 DIAS', '17:19:11'), ('2D:q_relogio:17h30', 'mov', 'Relógio: 17 horas e meia (1859)', None, None)]),
 (B1, [('2D:q_nucleo', 'zoom', 'Terra em corte: ferro derretido girando no núcleo', None, '17:18:58'), ('3D:A20', 'mov', 'O campo magnético saindo do planeta', None, '17:18:54')]),
 (B1, [('2D:q_dinamo', 'mov', 'Farol de bicicleta com dínamo acendendo', None, '17:18:48'), ('2D:q_nucleo', 'zoom', 'Movimento vira eletricidade, eletricidade vira campo', None, '17:18:44'),
       ('2D:q_lua_nucleo', 'zoom', 'O núcleo ao lado da Lua: maior que ela', 'MAIOR QUE A LUA', '17:18:40')]),
 (B1, [('2D:q_escudo', 'mov', 'O escudo desvia o vento solar', None, '17:18:36'), ('3D:A20', 'mov', 'O escudo inteiro, girando', None, '17:18:32')]),
 (B1, [('2D:q_aurora', 'mov', 'Aurora dançando no céu', None, '17:18:27')]),
 (B1, [('3D:S05', 'mov', 'A nuvem crescendo, forte demais', None, '17:18:23'), ('3D:S14', 'mov', 'O escudo sendo empurrado', None, '17:18:19')]),
 (B2, [('2D:q_arquivo', 'mov', 'Gaveta de arquivo abrindo (fichas)', None, '17:18:14'), ('3D:A18', 'mov', 'O Sol ativo', None, '17:18:10')]),
 (B2, [('2D:ficha:MAIO 2024|Estados Unidos|A tempestade mais forte em 20 anos', 'zoom', 'Ficha: maio de 2024', None, None), ('2D:q_aurora_eua', 'mov', 'Aurora sobre plantações nos EUA', None, None),
       ('2D:q_tratores', 'mov', 'Trator guiado por GPS no plantio', None, None), ('2D:q_tratores', 'zoom', 'As linhas de plantio entortam', None, None)]),
 (B2, [('2D:q_tratores_torto', 'zoom', 'Visto de cima: o plantio todo torto', None, None), ('2D:q_dolar', 'zoom', 'Prejuízo: quase meio bilhão de dólares', 'US$ 500 MILHÕES', None)]),
 (B2, [('2D:q_brasil:soja', 'zoom', 'Mapa do Brasil: o agro do Centro-Oeste', None, None), ('2D:q_plantadeira', 'mov', 'Plantadeira brasileira guiada por satélite', None, None)]),
 (B2, [('2D:ficha:MARÇO 1989|Quebec, Canadá|A rede inteira caiu', 'zoom', 'Ficha: março de 1989', None, None), ('2D:q_relogio_parede:2h44', 'zoom', 'Relógio de parede: 2h44 da manhã', None, None),
       ('2D:q_quebec:1', 'mov', 'Mapa: Quebec apaga em menos de 2 minutos', 'MENOS DE 2 MINUTOS', None)]),
 (B2, [('2D:q_quebec:1', 'zoom', 'Quebec no escuro', '6 MILHÕES SEM LUZ', None), ('2D:q_neve', 'zoom', 'Inverno canadense: casas no escuro e neve', None, None)]),
 (B2, [('2D:ficha:JULHO 2012|Órbita da Terra|Uma nuvem do tamanho de 1859', 'zoom', 'Ficha: julho de 2012', None, None), ('2D:q_orbita:0', 'mov', 'A nuvem dispara rumo à órbita da Terra', None, None)]),
 (B2, [('2D:q_orbita:1', 'mov', 'A Terra já tinha passado: uma semana antes', None, None), ('2D:q_jornal_nasa', 'zoom', 'NASA conta a história dois anos depois', None, None),
       ('2D:q_orbita:1', 'zoom', 'A margem', 'UMA SEMANA', None)]),
 (B2, [('2D:ficha:SETEMBRO 1859|Inglaterra|A primeira erupção solar vista por alguém', 'zoom', 'Ficha: setembro de 1859', None, None), ('2D:q_observatorio', 'zoom', 'Carrington no telescópio, desenhando o Sol', None, None),
       ('2D:q_carrington', 'zoom', 'O desenho das manchas', None, None), ('2D:q_carrington_flash', 'mov', 'Dois pontos de luz branca surgem', None, None)]),
 (B2, [('3D:S06', 'mov', 'Telégrafo: faísca no fio', None, None), ('2D:q_papel', 'mov', 'Fita de papel pegando fogo', None, None),
       ('2D:q_telegrafistas', 'zoom', 'Boston e Portland: bateria desligada', None, None), ('3D:A11', 'mov', 'Os fios sob a aurora: mensagens com a energia do céu', None, None)]),
 (B2, [('2D:q_americas', 'zoom', 'Mapa: aurora no Caribe e na Colômbia', None, None), ('2D:q_americas', 'zoom', 'Até em Santiago, no Chile', 'SANTIAGO', None)]),
 (B2, [('2D:q_brasil:vazio', 'zoom', 'Mapa do Brasil em 1859: nenhum registro', None, None), ('2D:q_rio', 'zoom', 'Rio de Janeiro, 1875, à noite', 'RIO DE JANEIRO · 1875', None),
       ('2D:q_observatorio_imperial', 'zoom', 'O Observatório Imperial no morro', None, None), ('2D:q_rio', 'zoom', 'O céu do Rio com brilho vermelho', None, None), ('2D:q_caderno', 'zoom', 'A anotação: aurora', None, None)]),
 (B2, [('3D:A18', 'mov', 'O Sol furioso', None, None), ('2D:q_floresta', 'zoom', 'Árvores antigas', None, None), ('2D:q_anel', 'zoom', 'O anel do ano 774 destacado', '774 d.C.', None),
       ('2D:q_anel', 'zoom', 'A marca de radiação, de uma vez', None, None), ('2D:q_escala774', 'zoom', '10 a 20 vezes Carrington', '10 A 20 × 1859', None)]),
 (B2, [('2D:q_anel', 'zoom', 'O pior caso conhecido', None, None)]),
 (B2, [('3D:S05', 'mov', 'A nossa nuvem (tamanho 1859)', None, '00:30:00'), ('2D:q_relogio:00:30:00', 'mov', 'O relógio fica vermelho', None, None)]),
 (B3, [('2D:q_L1', 'mov', 'Satélite de alerta entre o Sol e a Terra', None, '00:29:55'), ('2D:q_L1', 'zoom', 'A nuvem passa pelo satélite', '1,5 MILHÃO DE KM', '00:29:50'), ('3D:S14', 'mov', 'IMPACTO: o escudo achata', None, '00:00:00')]),
 (B3, [('2D:q_gps', 'mov', 'Satélite de GPS com sinal chiando', 'PRIMEIRA HORA', None), ('2D:q_equador_magnetico', 'zoom', 'O equador magnético cruzando o Brasil', None, None),
       ('2D:q_brasil:bolhas', 'mov', 'Bolhas de plasma depois do pôr do sol', None, None), ('2D:q_inpe_mapa', 'zoom', 'Mapa de bolhas do INPE', None, None), ('2D:q_brasil:bolhas', 'mov', 'As bolhas pioram', None, None)]),
 (B3, [('2D:q_plantadeira', 'mov', 'Plantio de soja saindo da linha', None, None)]),
 (B3, [('2D:q_celular_gps', 'zoom', 'Celular: o relógio vem do satélite', None, None), ('2D:q_torres', 'mov', 'Torres de celular sincronizadas', None, None), ('2D:q_torres', 'zoom', 'A rede tropeça', None, None)]),
 (B3, [('2D:q_brasil:linhas', 'zoom', 'Rede elétrica do Brasil', '2ª A 6ª HORA', None), ('2D:q_mundo_polos', 'zoom', 'Correntes mais fortes perto dos polos', None, None),
       ('2D:q_mundo_polos', 'zoom', 'Canadá, Escandinávia, norte dos EUA', None, None), ('2D:q_brasil:linhas', 'zoom', 'O Brasil longe dos polos', None, None)]),
 (B3, [('2D:q_brasil:goias', 'zoom', 'Goiás: a linha medida pelo INPE e Furnas', None, None), ('2D:q_transformador', 'zoom', 'Transformador com o medidor', None, None),
       ('2D:q_amperimetro', 'mov', 'O ponteiro sobe até 15 ampères', 'ATÉ 15 AMPÈRES', None)]),
 (B3, [('2D:q_brasil:linhas', 'mov', 'Os linhões acendem: Rondônia e Itaipu', 'MAIS DE 2.000 KM', None), ('2D:q_torres_linha', 'mov', 'Torres de transmissão até o horizonte', None, None),
       ('2D:q_itaipu', 'zoom', 'Itaipu', None, None), ('2D:q_antena', 'mov', 'Linha longa = antena', None, None)]),
 (B3, [('2D:q_americas', 'zoom', 'A aurora de 1859 no Chile', None, None), ('2D:q_equador_magnetico', 'zoom', 'O equador magnético passa pelo Brasil', None, None),
       ('2D:q_ceu_sul', 'zoom', 'Céu do extremo sul', None, None), ('2D:q_ceu_sul', 'zoom', 'Brilho vermelho baixo no horizonte', None, None), ('2D:q_ceu_sul', 'zoom', '(raríssimo)', None, None)]),
 (B3, [('3D:A20', 'mov', 'O escudo inteiro protegendo', None, None), ('2D:q_brasil:vazio', 'zoom', 'O Brasil no chão: protegido', None, None), ('3D:S11', 'mov', 'Brasil à noite, aceso e tranquilo', None, None)]),
 (B3, [('3D:S08', 'mov', 'Câmera sobe do chão para o espaço', None, None)]),
 (B4, [('3D:S09', 'mov', 'O ponto fraco sobre o Brasil', None, None), ('2D:q_brasil:anomalia', 'zoom', 'Anomalia Magnética do Atlântico Sul', None, None), ('3D:S09', 'mov', 'O escudo mais fino', None, None)]),
 (B4, [('2D:q_anomalia_cresce:2014', 'mov', 'A anomalia em 2014', '2014', None), ('2D:q_anomalia_cresce:hoje', 'mov', 'A anomalia hoje, maior', 'HOJE', None), ('2D:q_anomalia_dividida', 'mov', 'Ela se divide em duas', None, None)]),
 (B4, [('3D:S11', 'mov', 'Aqui no chão: tudo normal', None, None), ('3D:S07', 'mov', 'Lá em cima: 500 km', None, None), ('2D:q_hubble', 'mov', 'O Hubble passando sobre a anomalia', None, None),
       ('2D:q_hubble', 'zoom', 'Detectores desligados', None, None)]),
 (B4, [('2D:q_astronauta', 'zoom', 'Astronauta de olhos fechados', None, None), ('2D:q_astronauta', 'zoom', 'Um flash de luz', None, None)]),
 (B4, [('3D:S10', 'mov', 'A maior tempestade em cima do ponto fraco', None, None), ('3D:S07', 'mov', 'Satélites cruzando a região', None, None), ('3D:S09', 'mov', 'O ponto mais desprotegido', None, None)]),
 (B4, [('2D:ficha:FEV. 2022|Órbita baixa|Uma tempestade fraca', 'zoom', 'Ficha rápida: 2022', None, None), ('2D:q_satelites_caindo', 'mov', '38 satélites caindo de uma vez', '38 SATÉLITES', None),
       ('2D:q_atmosfera_incha', 'mov', 'A atmosfera incha e freia', None, None)]),
 (B4, [('2D:q_amazonia', 'zoom', 'Comunidade na Amazônia com antena', None, None), ('2D:q_fazenda_antena', 'zoom', 'Fazenda e navio dependendo de satélite', None, None),
       ('2D:q_previsao_sul', 'zoom', 'Previsão de chuva no Sul', None, None)]),
 (B4, [('3D:A20', 'mov', 'A resposta: no chão, protegido', 'NO CHÃO: PROTEGIDO', None), ('3D:S10', 'mov', 'No céu acima do Brasil: exposto', 'NO CÉU: EXPOSTO', None), ('3D:S09', 'mov', 'O Atlântico Sul pulsando', None, None)]),
 (B4, [('3D:S07', 'mov', 'O que perderíamos primeiro está lá em cima', None, None), ('3D:S08', 'mov', 'Câmera se afasta para o espaço', None, None)]),
 (B5, [('2D:q_anel', 'zoom', 'E se fosse a de 774?', 'E SE FOSSE 774?', None), ('2D:q_transformador', 'zoom', 'Transformadores para consertar', None, None), ('2D:q_mundo_reparos', 'zoom', 'Vários países ao mesmo tempo', None, None)]),
 (B5, [('2D:q_pessoa_ceu', 'zoom', 'Uma pessoa olhando a aurora, tranquila', None, None), ('3D:A20', 'mov', 'Atmosfera e escudo seguram a radiação', None, None), ('2D:q_pessoa_ceu', 'zoom', 'O alvo é a tecnologia, não a gente', None, None)]),
 (B5, [('3D:A18', 'mov', 'Não dá para impedir o Sol', None, None), ('2D:q_operador', 'zoom', 'Operador de energia aliviando a rede', None, None), ('2D:q_aviao', 'mov', 'Avião mudando de rota', None, None),
       ('2D:q_inpe', 'zoom', 'O INPE vigiando o clima espacial', None, None)]),
 (FE, [('3D:A03', 'mov', 'O mesmo Sol, calmo', None, None), ('3D:S01', 'mov', 'A luz de 8 minutos atrás', None, None), ('3D:S11', 'mov', 'Os últimos a saber, os primeiros a sentir', None, None)]),
 (FE, [('2D:q_celular', 'zoom', 'Celular sem sinal', 'SEM GPS E SEM INTERNET POR UMA SEMANA', None), ('2D:q_comentarios', 'zoom', 'Comentários', None, None)]),
 (FE, [('2D:q_cartela', 'mov', 'Selo do canal', None, None), ('2D:q_cartela', 'mov', 'Relógio: 8:20 atrasado', None, '08:20 ATRASADO')]),
]

def planos():
    pars = PAR[12:]; assert len(pars) == len(C), (len(pars), len(C))
    out = []; wi = sum(len(p['txt'].split()) for p in PAR[:12])
    for (bloco, vis), p in zip(C, pars):
        n = len(p['txt'].split()); ws = W[wi:wi + n]; wi += n
        dur = ws[-1]['end'] - ws[0]['start']; k = max(len(vis), math.ceil((dur + 0.6) / 4.7))
        vis = vis + [vis[-1]] * (k - len(vis))
        # cortes: alvo em tempos iguais, preferindo palavras com pontuação (vírgula/ponto) até 1 s de distância
        cortes = [0]
        for j in range(1, len(vis)):
            alvo = ws[0]['start'] + dur * j / len(vis)
            cand = [i for i in range(cortes[-1] + 1, n) if abs(ws[i]['start'] - alvo) < 1.0 and ws[i - 1]['text'][-1:] in ',.?!:;…']
            i = min(cand, key=lambda i: abs(ws[i]['start'] - alvo)) if cand else min(range(cortes[-1] + 1, n), key=lambda i: abs(ws[i]['start'] - alvo))
            cortes.append(i)
        cortes.append(n)
        # segunda passada: qualquer trecho com mais de 4,85 s é dividido ao meio (mesmo visual, outro recorte)
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
        for a, b, v, rep in seg:
            out.append(dict(bloco=bloco, vis=v[0], mov=v[1], desc=v[2] + (' (outro recorte)' if rep else ''), tela=None if rep else v[3], rel=v[4], w0=ws[a], w1=ws[b - 1],
                            fala=' '.join(w['text'] for w in ws[a:b])))
    # tempos de corte contínuos: cada plano vai até o início do próximo
    for k, p in enumerate(out):
        p['t0'] = p['w0']['start'] - 0.15 if k else 87.0
        p['t1'] = out[k + 1]['w0']['start'] - 0.15 if k + 1 < len(out) else W[-1]['end'] + 1.0
        del p['w0'], p['w1']
    return out

if __name__ == '__main__':
    P = planos(); m = max(P, key=lambda p: p['t1'] - p['t0'])
    print(len(P), 'planos · maior', round(m['t1'] - m['t0'], 2), 's ·', m['fala'][:50])
    print(sum(1 for p in P if p['t1'] - p['t0'] > 5.0), 'acima de 5 s')
    for p in P:
        if p['t1'] - p['t0'] > 5: print(round(p['t0'], 1), round(p['t1'] - p['t0'], 2), p['fala'][:70])
