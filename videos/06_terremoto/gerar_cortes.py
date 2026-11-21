"""Gera render/src/cortes6.json: os planos do vídeo 6 a partir de 87,5 s (≤ 5 s cada)."""
import json, math
FIM = 826.0
ET = lambda s, b, t0=0.3, cor='ouro': {'tipo': 'etq', 'small': s, 'big': b, 't0': t0, 'cor': cor}
CA = lambda txt, t0=0.3, cor='perigo', x=960, y=540: {'tipo': 'carimbo', 'txt': txt, 't0': t0, 'cor': cor, 'x': x, 'y': y}
CV = lambda txt, t0=0.3, cor='ouro': {'tipo': 'chave', 'txt': txt, 't0': t0, 'cor': cor}
NOT = lambda img, fonte, data, g0=0.6, fundo='mapa': {'img': img, 'fonte': fonte, 'data': data, 'g0': g0, 'fundo': fundo}
B = [
 # ---------- ANDAR 1 ----------
 (87.5, 92.0, 'cozinha', {'onda': 0.0, 'close': 0.15}, [], 'Andar 1 — cozinha calma, régua no 2'),
 (92.0, 96.2, 'pontos', {}, [ET('ANDAR 1', 'O BRASIL QUE TREME SEM VOCÊ SABER', 0.2)], 'Mapa do Brasil: pontinhos de tremores acendendo'),
 (96.2, 107.4, 'pontos', {}, [CV('≈ 2.450 TREMORES EM 10 ANOS', 0.6)], '2.450 terremotos em 10 anos, quase todos imperceptíveis'),
 (107.4, 122.0, 'estacao', {}, [], 'Estação sismográfica no mato, sensor enterrado escutando o chão'),
 (122.0, 133.6, 'pontos', {'foco': 'nordeste', 'marca': 'divisa'}, [], 'Currais Novos (RN): três tremores de 1,6–1,7'),
 (133.6, 141.0, 'pontos', {'foco': 'nordeste', 'marca': 'bahia'}, [], 'Bahia: tremor de 2,0; vizinhos na porta'),
 (141.0, 144.2, 'cozinha', {'onda': 0.0, 'close': 0.45}, [], 'O copo: nem uma ondinha'),
 (144.2, 150.1, 'pontos', {'foco': 'nordeste'}, [], 'Os pontinhos se juntam no Nordeste'),
 (150.1, 166.5, 'crosta', {}, [], 'Corte da crosta fina do Nordeste com falhas antigas reativando'),
 (166.5, 173.8, 'escada', {}, [], 'A escada que engana'),
 (173.8, 179.2, 'escada', {}, [CV('CADA DEGRAU ≈ 32× MAIS ENERGIA', 0.3)], '32× mais energia por degrau'),
 (179.2, 185.7, 'energia', {}, [], 'Um 3 contra um 6: ~30 mil vezes'),
 (185.7, 204.9, 'magint', {}, [], 'Magnitude (na origem) × intensidade (na sua casa)'),
 (204.9, 216.0, 'caminhao', {}, [], 'Degrau 3: como um caminhão passando; a janela vibra'),
 (216.0, 221.2, 'cozinha', {'onda': 0.35, 'close': 0.45, 'tremor': 0.04}, [], 'O copo: círculos fininhos'),
 (221.2, 235.5, 'cozinha', {'onda': 0.7, 'close': 0.0, 'tremor': 0.16}, [], 'Degrau 4: louça chacoalha, quadro torto'),
 (235.5, 244.1, 'povoado', {'modo': 'calmo'}, [ET('ITACARAMBI (MG)', '9 DE DEZEMBRO DE 2007', 1.6)], 'Caraíbas, povoado no norte de Minas'),
 (244.1, 249.9, 'noticia', NOT('noticias/em.png', 'ESTADO DE MINAS', '10/12/2017', 0.8, 'povoado'), [], 'Print do Estado de Minas: primeira morte registrada'),
 (249.9, 260.0, 'adobe', {}, [], 'Parede de adobe sem amarração × parede com vigas'),
 (260.0, 269.0, 'povoado', {'modo': 'desaba'}, [], 'Silhueta de uma casa cedendo; poeira (sem pessoas)'),
 (269.0, 274.6, 'cartela', {'txt': 'QUEM MATOU FOI A CASA'}, [], 'Quem matou foi a casa'),
 (274.6, 288.7, 'joao', {'modo': 'noite'}, [ET('JOÃO CÂMARA (RN)', '1986', 1.4)], 'João Câmara à noite, cidade tremendo há meses'),
 (288.7, 297.4, 'joao', {'modo': 'falha'}, [], 'A falha de Samambaia brilhando no subsolo'),
 (297.4, 304.7, 'oficial', {'img': 'joao_camara_1986_intensidade.jpg', 'titulo': 'JOÃO CÂMARA · 30/11/1986 · 5,1'}, [], 'Mapa oficial USGS do 5,1'),
 (304.7, 317.3, 'joao', {'modo': 'dano'}, [], 'Casas rachadas, ~4 mil danificadas; famílias dormindo na praça'),
 (317.3, 320.2, 'copoquebra', {}, [], 'O copo cai e quebra — E aquilo foi só um cinco'),
 # ---------- ANDAR 2 ----------
 (320.2, 330.7, 'serra', {'treme': 0.0}, [ET('SERRA DO TOMBADOR (MT)', 'JANEIRO DE 1955', 1.6)], 'Andar 2 — a serra no Mato Grosso'),
 (330.7, 335.5, 'noticia', NOT('noticias/natgeo.png', 'NATIONAL GEOGRAPHIC BRASIL', '2023', 0.5, 'serra'), [], 'Print Nat Geo: o maior sismo registrado até então'),
 (335.5, 354.9, 'serra', {'treme': 0.6}, [], 'A mata tremendo, pássaros voando, ninguém para ver'),
 (354.9, 368.9, 'acre', {}, [ET('FRONTEIRA ACRE–PERU', '9 DE NOVEMBRO DE 1963', 3.2, 'perigo')], 'O ponto no Acre: 7,6'),
 (368.9, 380.6, 'cozinha', {'onda': 0.0, 'close': 0.45}, [CV('E QUASE NINGUÉM SENTIU', 8.9, 'calmo')], 'Mais forte que a Colômbia… e o copo parado'),
 (380.6, 395.0, 'nazca', {'modo': 'placa'}, [], 'Corte: a placa de Nazca mergulhando sob a América do Sul'),
 (395.0, 411.2, 'nazca', {'modo': 'ondas'}, [], 'A placa racha a ~600 km; ondas chegam fracas'),
 (411.2, 417.6, 'oficial', {'img': 'acre_2024_intensidade.jpg', 'titulo': 'TARAUACÁ · 20/01/2024 · 6,6'}, [], 'Mapa oficial USGS do 6,6 de 2024'),
 (417.6, 425.1, 'noticia', NOT('noticias/agenciabrasil.png', 'AGÊNCIA BRASIL', '20/01/2024', 0.5), [], 'Print Agência Brasil: 614,5 km; dificilmente sentido'),
 (425.1, 428.3, 'cozinha', {'onda': 0.0, 'close': 0.45}, [], 'O copo em Tarauacá continua parado'),
 (428.3, 438.3, 'cta', {}, [], 'CTA: inscreva-se; daqui pra cima fica perigoso'),
 (438.3, 450.3, 'celular', {}, [], 'A mensagem do megaterremoto no celular'),
 (450.3, 455.4, 'calendario', {}, [], 'Setembro passando, nada acontece'),
 (455.4, 467.3, 'noticia', NOT('noticias/aosfatos.png', 'AOS FATOS', '2026', 0.6), [CA('BOATO', 3.5, 'perigo', 1560, 200)], 'Print Aos Fatos + carimbo BOATO'),
 # ---------- ANDAR 3 ----------
 (467.3, 474.0, 'borda', {}, [ET('ANDAR 3', 'OS DE FORA QUE BALANÇAM O BRASIL', 0.2)], 'A borda oeste da América do Sul acende'),
 (474.0, 481.6, 'cozinha', {'onda': 1.0, 'close': 0.0, 'tremor': 0.5}, [], 'Perto de um 7: móveis andam, paredes racham'),
 (481.6, 493.1, 'venezuela', {}, [], 'Venezuela 7,2/7,5 e Colômbia 7,4 no mapa'),
 (493.1, 500.2, 'prediocasa', {}, [], 'Quem sentiu mais: os andares altos'),
 (500.2, 520.6, 'prediocasa', {}, [], 'Ondas lentas; prédio balança como pêndulo; casa térrea quase nada'),
 (520.6, 531.0, 'nazca', {'modo': 'bolivia'}, [ET('BOLÍVIA', '9 DE JUNHO DE 1994 · 8,2', 1.4, 'perigo')], 'Bolívia 1994: a mais de 600 km de profundidade'),
 (531.0, 545.2, 'globo', {'lon': -67.5, 'lat': -13.8, 'alvos': [['SÃO PAULO', -46.6, -23.5], ['TORONTO', -79.4, 43.7]]}, [], 'As ondas no globo chegam a São Paulo e Toronto'),
 (545.2, 552.8, 'oficial', {'img': 'chile_2015_intensidade.jpg', 'titulo': 'CHILE · 16/09/2015 · 8,3'}, [], 'Mapa oficial USGS do Chile 2015'),
 (552.8, 561.0, 'paulista', {}, [], 'Avenida Paulista à noite: prédios esvaziados'),
 (561.0, 564.1, 'noticia', NOT('noticias/catraca.png', 'CATRACA LIVRE', '17/09/2015', 0.3, 'paulista'), [], 'Print Catraca Livre: prédios evacuados'),
 (564.1, 570.7, 'paulista', {}, [ET('CHILE · 2010', '8,8 SENTIDO EM SÃO PAULO', 0.4)], 'Chile 2010: sentido em SP de madrugada'),
 (570.7, 574.1, 'cozinha', {'onda': 0.0, 'close': 0.45}, [], 'No térreo, o copo quieto'),
 (574.1, 577.6, 'apto', {}, [], 'No 30º andar, a água balança devagar'),
 (577.6, 590.8, 'lisboa', {'modo': 'calmo'}, [ET('LISBOA', '1º DE NOVEMBRO DE 1755', 2.8, 'perigo')], 'Lisboa 1755'),
 (590.8, 595.2, 'lisboa', {'modo': 'desaba'}, [], 'A cidade desaba, pega fogo, o mar invade'),
 (595.2, 609.7, 'atlantico', {}, [], 'A onda atravessa o Atlântico até o Nordeste'),
 (609.7, 620.3, 'tamandare', {}, [], 'Tamandaré: o mar avançando entre os coqueiros'),
 (620.3, 627.6, 'cartela', {'txt': 'CHEGOU PELO MAR'}, [], 'O maior susto chegou pelo mar'),
 # ---------- ANDAR 4 ----------
 (627.6, 633.8, 'numero', {'txt': '9,5', 'sub': 'VALDIVIA, CHILE · 22/05/1960'}, [], 'Último degrau: 9,5'),
 (633.8, 639.2, 'foto', {'img': 'valdivia_1960_foto.jpg', 'legenda': 'VALDIVIA, CHILE · 1960', 'credito': 'FOTO: USGS (DOMÍNIO PÚBLICO)'}, [], 'Foto histórica de Valdivia destruída'),
 (639.2, 644.1, 'cubos', {}, [], '~1.000× a energia de um 7,5'),
 (644.1, 655.4, 'oficial', {'img': 'valdivia_1960_intensidade.jpg', 'titulo': 'VALDIVIA · 1960 · 9,5'}, [], 'Ruptura de ~1.000 km; 10 minutos; tsunami no Pacífico'),
 (655.4, 665.3, 'sino', {}, [], 'A Terra vibrando como um sino'),
 (665.3, 676.5, 'rasgo', {}, [], 'HIPÓTESE: o rasgo de 1.000 km entre São Paulo e Brasília'),
 (676.5, 691.0, 'cozinha', {'onda': 1.0, 'close': 0.0, 'tremor': 0.85}, [], 'Em cima da falha: ninguém fica de pé'),
 (691.0, 703.9, 'rasgo', {'aneis': 1}, [], 'Anéis: 100 km, 500 km, 1.000 km'),
 (703.9, 716.2, 'chile', {}, [], 'Prédio antissísmico do Chile × prédio comum'),
 (716.2, 721.3, 'cozinha', {'onda': 0.0, 'close': 0.12}, [], 'A resposta que eu prometi (régua no 9,5)'),
 (721.3, 722.0, 'nao', {}, [], 'NÃO.'),
 (722.0, 734.3, 'globoplacas', {'centro': [-80, 15]}, [], 'Bordas onde nascem os gigantes: Chile, Japão, Alasca'),
 (734.3, 745.2, 'globoplacas', {'centro': [-45, -15], 'brasil': 1}, [], 'O Brasil no meio da placa; Andes e cordilheira do Atlântico'),
 (745.2, 767.7, 'rachaduras', {}, [], 'Rachaduras antigas: João Câmara, Itacarambi, Tombador; máximo ~7, raro'),
 (767.7, 785.6, 'seguranca', {}, [], 'Abaixa, protege, segura; escada, nunca elevador'),
 # ---------- FECHO ----------
 (785.6, 798.8, 'cozinha', {'onda': 0.0, 'close': 0.3}, [], 'O copo parado: um dos chãos mais calmos das Américas'),
 (798.8, 805.7, 'joao', {'modo': 'manha'}, [], 'A praça de João Câmara de manhã'),
 (805.7, 815.8, 'comentarios', {}, [], 'Pergunta para os comentários; pontos acendendo no mapa'),
 (815.8, FIM, 'card', {}, [], 'Selo final + frase'),
]
HUD_OFF = {'noticia', 'oficial', 'foto', 'numero', 'nao', 'seguranca', 'card', 'calendario', 'celular', 'cartela', 'comentarios', 'cta'}
out = []
for i, (a, b, c, p, o, d) in enumerate(B):
    assert i == 0 or abs(a - B[i - 1][1]) < 0.01, (a, B[i - 1][1])
    n = max(1, math.ceil((b - a) / 5.0 - 1e-6)); L = (b - a) / n
    for j in range(n):
        aa = a + j * L; pp = dict(p); pp['parte'] = j; pp['partes'] = n; pp['off'] = j * L
        oo = []
        for ov in o:
            t0 = ov.get('t0', 0) - j * L
            if t0 > L or t0 + L < 0: continue
            ov2 = dict(ov); ov2['t0'] = max(0, t0)
            if t0 < -0.01:
                if ov['tipo'] == 'etq': continue
                ov2['ja'] = 1
            oo.append(ov2)
        semtexto = not oo and c not in ('noticia', 'oficial', 'numero', 'cartela', 'nao', 'foto')
        fade = 0.35 if out and out[-1]['c'] == c and out[-1]['p'].get('modo') == p.get('modo') and semtexto and not out[-1]['o'] else 0
        out.append({'a': round(aa, 3), 'b': round(aa + L, 3), 'c': c, 'p': pp, 'o': oo, 'd': d + (f' ({j + 1}/{n})' if n > 1 else ''), 'f': fade, 'hud': c not in HUD_OFF})
json.dump(out, open('render/src/cortes6.json', 'w'), ensure_ascii=False, indent=0)
print(len(out), 'planos; maior', round(max(x['b'] - x['a'] for x in out), 2), 'fim', out[-1]['b'])
