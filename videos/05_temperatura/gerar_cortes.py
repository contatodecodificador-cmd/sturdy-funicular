"""Gera render/src/cortes.json: a lista de planos do vídeo (74,4 s → fim), nenhum plano > 5 s."""
import json, math
FIM = 950.0
PL = {'-14': (4, -1), '+44': (5.5, 1), '-67': (8.5, -1), '+70': (10, 1), '-89': (13, -1), '1170': (14.5, 1), '-196': (17.5, -1), '28000': (19, 1), '-270': (22, -1), 'sol': (23.5, 1), 'fimF': (28, -1), 'fimQ': (29.5, 1)}
def porta(k, aproxima=0.5, pz=None):  # câmera que olha para uma porta
    z, lado = PL[k]
    p = {'cam0': z - 3.2, 'cam1': z - 3.2 + aproxima, 'x0': lado * 0.75, 'x1': lado * 0.95, 'y0': -0.35, 'y1': -0.45, 'brilho': 0.55}
    if pz: p.update({'pz': z - 3.2 + pz, 'px': lado * 0.6})
    return p
CH = lambda n, nome: {'tipo': 'chip', 'n': n, 'nome': nome}
CV = lambda txt, t0=0.3, cor='ouro': {'tipo': 'chave', 'txt': txt, 't0': t0, 'cor': cor}
CA = lambda txt, t0=0.3, cor='perigo': {'tipo': 'carimbo', 'txt': txt, 't0': t0, 'cor': cor}
ET = lambda s, b, t0=0.3, cor='ouro': {'tipo': 'etq', 'small': s, 'big': b, 't0': t0, 'cor': cor}
TG = lambda txt, x=1250, y=520, t0=0.3, cor='ouro': {'tipo': 'tag', 'txt': txt, 'x': x, 'y': y, 't0': t0, 'cor': cor}
PLA = [  # linhas do placar conforme o vídeo avança
    [{'f': '−14 · CAÇADOR', 'q': '+44,8 · ARAÇUAÍ'}],
    [{'f': '−14 · CAÇADOR', 'q': '+44,8 · ARAÇUAÍ'}, {'f': '−67,7 · OYMYAKON', 'q': '+56,7 · VALE DA MORTE'}, {'f': '−89,2 · VOSTOK', 'q': '+70,7 · LUT (CHÃO)'}, {'q': '1.170 · LAVA'}],
]
PLA.append(PLA[1][:3] + [{'f': '−196 · NITROGÊNIO', 'q': '1.170 · LAVA'}, {'f': '−270,4 · ESPAÇO', 'q': '28.000 · RAIO'}, {'q': '15 MI · NÚCLEO DO SOL'}])
B = [
 # (início, fim, cena, props, overlays, descrição)
 (74.4, 76.5, 'corpo', {'temp0': 37, 'temp1': 37}, [], 'Você de frente, termômetro interno em 37 °C'),
 (76.5, 80.0, 'janela', {'z0': 0, 'z1': 0.05}, [CV('UMA FAIXA DE 5 GRAUS', 0.4)], 'Régua do universo; a faixa da vida acende'),
 (80.0, 82.9, 'corpo', {'temp0': 37, 'temp1': 35, 'fundo': 'neve'}, [], 'Termômetro desce a 35'),
 (82.9, 85.9, 'corpo', {'temp0': 37, 'temp1': 40, 'fundo': 'sol', 'suor': 0.6}, [], 'Termômetro sobe a 40'),
 (85.9, 90.6, 'janela', {'z0': 0, 'z1': 0}, [], 'De −273 a trilhões de graus'),
 (90.6, 93.8, 'janela', {'z0': 0.1, 'z1': 1}, [], 'Zoom até a janelinha: você cabe nela'),
 (93.8, 98.3, 'corredor', {'cam0': 0.4, 'cam1': 0.9, 'x0': 0, 'x1': -0.35, 'pz': 3.4, 'brilho': 0.55}, [], 'Corredor: você vira para o lado frio'),
 (98.3, 102.1, 'corpo', {'temp0': 37, 'temp1': 35, 'fundo': 'neve', 'tremor': 1}, [CH(2, 'HIPOTERMIA')], 'Porta 2: na neve, tremendo; 35 °C'),
 (102.1, 106.2, 'corpo', {'temp0': 35, 'temp1': 34, 'fundo': 'neve', 'tremor': 1}, [], 'Mãos desajeitadas'),
 (106.2, 108.3, 'corpo', {'temp0': 34, 'temp1': 33, 'fundo': 'neve', 'tremor': 0.6, 'expr': 'fechado'}, [], 'Pensamento lento'),
 (108.3, 112.6, 'corpo', {'temp0': 33, 'temp1': 32, 'fundo': 'neve', 'tremor': 1}, [], 'Lá pelos 32 °C'),
 (112.6, 116.2, 'corpo', {'temp0': 32, 'temp1': 32, 'fundo': 'neve', 'tremor': 0}, [CA('NÃO É MELHORA', 2.7)], 'O tremor para'),
 (116.2, 118.7, 'corpo', {'temp0': 32, 'temp1': 31, 'fundo': 'neve', 'expr': 'fechado'}, [], 'O corpo desistindo'),
 (118.7, 121.2, 'nevasca', {'t0': 0, 't1': 0}, [], 'Nevasca, pessoa de casaco'),
 (121.2, 124.8, 'nevasca', {'t0': 0, 't1': 1}, [], 'Ela tira o casaco'),
 (124.8, 129.7, 'corpo', {'temp0': 30, 'temp1': 30, 'fundo': 'neve', 'expr': 'calor', 'falso': 1}, [], 'Cérebro confuso: calor falso'),
 (129.7, 134.6, 'nevasca', {'t0': 1, 't1': 1}, [], 'Casaco abandonado na neve'),
 (134.6, 140.9, 'monitor', {'bpm': 34, 'irr': 1, 'temp': '27 °C'}, [], 'Abaixo de 28: coração devagar e fora de ritmo'),
 (140.9, 143.2, 'monitor', {'bpm': 18, 'irr': 1, 'temp': '24 °C'}, [], 'Parece morta'),
 (143.2, 149.0, 'rio', {'q0': 0, 'q1': 0}, [CH(3, 'ANNA')], 'Porta 3: rio congelado no norte da Noruega, à noite'),
 (149.0, 152.4, 'rio', {'q0': 0, 'q1': 0}, [ET('NORUEGA · 1999', 'ANNA BÅGENHOLM', 0.3, 'dado')], 'Anna esquiando'),
 (152.4, 156.0, 'rio', {'q0': 0, 'q1': 1}, [], 'Ela cai de cabeça no buraco do gelo'),
 (156.0, 161.5, 'anna', {'d': 11.0, 'off': 0}, [], 'Sob o gelo, no bolsão de ar; cronômetro corre'),
 (161.5, 163.9, 'anna', {'d': 11.0, 'off': 5.5, 'close': 1}, [], 'Os amigos não conseguem puxá-la'),
 (163.9, 167.4, 'anna', {'d': 11.0, 'off': 7.9}, [], '80 minutos'),
 (167.4, 169.5, 'monitor', {'bpm': 0, 'temp': '13,7 °C'}, [], 'O coração parado (linha reta)'),
 (169.5, 175.4, 'leito', {'pac': 'anna', 'temp0': 13.7, 'temp1': 13.7}, [], 'Hospital: 13,7 °C'),
 (175.4, 178.7, 'comparacao', {'a': {'n': '13,7 °C', 'l': 'ANNA, POR DENTRO', 'cor': 'frio'}, 'b': {'n': '~20 °C', 'l': 'PISCINA NO INVERNO', 'cor': 'dado'}, 'vs': '<'}, [], 'Mais fria que a água de uma piscina no inverno'),
 (178.7, 183.2, 'leito', {'pac': 'anna', 'maq': 1, 'temp0': 13.7, 'temp1': 22}, [], 'Máquina aquece o sangue e devolve'),
 (183.2, 187.6, 'leito', {'pac': 'anna', 'maq': 1, 'temp0': 22, 'temp1': 37}, [], 'Grau por grau; o coração volta'),
 (187.6, 191.8, 'leito', {'pac': 'anna', 'temp0': 13.7, 'temp1': 13.7, 'leg': 'MENOR TEMPERATURA DA QUAL UM ADULTO VOLTOU'}, [CA('RECORDE MUNDIAL', 1.0, 'ouro')], 'Recorde mundial'),
 (191.8, 196.4, 'cerebro', {}, [], 'O frio protegeu o cérebro'),
 (196.4, 201.0, 'cerebro', {'zoom': 1}, [], 'Cérebro gelado gasta menos oxigênio'),
 (201.0, 204.6, 'pessoaAnna', {}, [CA('SOBREVIVEU', 0.6, 'impacto')], 'Anna de pé, recuperada'),
 (204.6, 209.8, 'corredor', {'cam0': 0.4, 'cam1': 0.9, 'x0': 0, 'x1': 0.4, 'pz': 3.4, 'brilho': 0.55}, [], 'Corredor: você vira para o lado quente'),
 (209.8, 213.6, 'corpo', {'temp0': 37, 'temp1': 39, 'fundo': 'sol', 'suor': 0.5}, [CH(4, 'INSOLAÇÃO')], 'Porta 4: febre de 38, 39'),
 (213.6, 217.4, 'corpo', {'temp0': 39.5, 'temp1': 40.5, 'fundo': 'sol', 'suor': 1}, [], 'Acima de 40: insolação'),
 (217.4, 221.4, 'corpo', {'temp0': 41, 'temp1': 41.5, 'fundo': 'sol', 'suor': 1, 'expr': 'fechado'}, [], 'Confusão, desmaio'),
 (221.4, 225.6, 'monitor', {'bpm': 165, 'irr': 0.6, 'temp': '42 °C', 'cor': '#FF6A4A'}, [], 'Acima de 42: órgãos param'),
 (225.6, 229.9, 'rua', {}, [], 'Rua quente nos EUA, 1980; um homem exausto'),
 (229.9, 233.4, 'rua', {'zoom': 1}, [ET('EUA · JULHO DE 1980', 'WILLIE JONES', 0.2, 'perigo')], 'Willie Jones'),
 (233.4, 238.7, 'leito', {'pac': 'willie', 'temp0': 37, 'temp1': 46.5}, [], 'No hospital: 46,5 °C'),
 (238.7, 242.7, 'leito', {'pac': 'willie', 'temp0': 46.5, 'temp1': 37}, [CA('SOBREVIVEU · 24 DIAS', 2.7, 'impacto')], '24 dias internado; saiu vivo'),
 (242.7, 247.0, 'reguaVida', {'so': 'q'}, [], 'Ninguém sobreviveu a um corpo mais quente'),
 (247.0, 254.8, 'reguaVida', {}, [CV('33 GRAUS', 5.8, 'ouro')], 'Junta os dois recordes: 13,7 ←→ 46,5'),
 (254.8, 262.2, 'janela', {'z0': 0.75, 'z1': 1}, [], 'Todo o espaço que a vida humana já ocupou'),
 (262.2, 265.1, 'corredor', {'cam0': 1.6, 'cam1': 1.0, 'pz': 3.4, 'brilho': 0.6}, [], 'De volta ao corredor'),
 (265.1, 269.7, 'corredor', {'cam0': 0.3, 'cam1': 1.4, 'brilho': 0.6}, [], 'As portas de fora'),
 (269.7, 273.7, 'corredor', porta('-14', 0.5), [], 'A primeira porta de fora: −14'),
 (273.7, 279.8, 'mapa', {'t1': 0.8, 't2': 99}, [CH(5, 'BRASIL')], 'Porta 5: mapa real do Brasil; Caçador'),
 (279.8, 287.4, 'cidades', {}, [], 'Caçador com geada × Araçuaí com asfalto tremendo'),
 (287.4, 292.8, 'mapa', {'t1': -1, 't2': 0.3}, [], 'Araçuaí: +44,8 °C'),
 (292.8, 297.2, 'placar', {'linhas': PLA[0]}, [], 'Placar: primeira linha preenchida'),
 (297.2, 302.1, 'cidades', {}, [CA('VOCÊ AGUENTA', 0.6, 'impacto')], 'Com roupa certa e água, você aguenta'),
 (302.1, 305.2, 'corredor', porta('-67', 0.6), [], 'Corredor até −67,7'),
 (305.2, 311.2, 'siberia', {'modo': 'vila'}, [CH(6, 'OYMYAKON')], 'Porta 6: vila de Oymyakon, Sibéria'),
 (311.2, 318.2, 'siberia', {'modo': 'vila', 'zoom': 1}, [ET('OYMYAKON · 1933', '−67,7 °C', 0.4, 'dado')], 'O termômetro marcou −67,7'),
 (318.2, 323.5, 'siberia', {'modo': 'carro'}, [], 'Carros ligados o dia inteiro'),
 (323.5, 327.3, 'siberia', {'modo': 'rosto'}, [], 'Cílios e tinta da caneta congelam'),
 (327.3, 334.6, 'siberia', {'modo': 'escola'}, [CV('AULA SÓ ACABA ABAIXO DE −52 °C', 3.8, 'dado')], 'Escola: dispensa só abaixo de −52'),
 (334.6, 343.0, 'siberia', {'modo': 'rosto', 'timer': 1}, [TG('10 MIN', 1250, 300, 3.0, 'dado')], 'Bochecha congela em ~10 min'),
 (343.0, 348.7, 'siberia', {'modo': 'rosto', 'timer': 2}, [TG('5 MIN', 1250, 300, 0.1, 'perigo')], 'Com mais vento, 5 min'),
 (348.7, 353.3, 'corredor', porta('+70', 0.6), [CH(7, 'DESERTOS')], 'Porta 7: o outro lado do corredor'),
 (353.3, 360.0, 'deserto', {'modo': 'vale'}, [ET('VALE DA MORTE · 1913', 'AR A 56,7 °C', 2.5, 'perigo')], 'Vale da Morte: placa marca 56,7'),
 (360.0, 367.7, 'deserto', {'modo': 'lut'}, [TG('70,7 °C NO CHÃO', 1000, 540, 5.3, 'perigo')], 'Deserto de Lut visto por satélite'),
 (367.7, 374.0, 'deserto', {'modo': 'ovo'}, [], 'Um chão onde dá pra fritar um ovo'),
 (374.0, 379.7, 'comparacao', {'a': {'n': '45 °C', 'l': 'DESERTO SECO', 'cor': 'fogo'}, 'b': {'n': '35 °C', 'l': 'CIDADE ÚMIDA', 'cor': 'impacto'}, 'vs': '?'}, [CH(8, 'CALOR ÚMIDO')], 'Porta 8: qual é pior?'),
 (379.7, 384.0, 'comparacao', {'a': {'n': '45 °C', 'l': 'DESERTO SECO', 'cor': 'fogo'}, 'b': {'n': '35 °C', 'l': 'CIDADE ÚMIDA', 'cor': 'impacto'}, 'vs': '?'}, [CA('ERRADO', 0.1)], 'Mito: maior número = pior'),
 (384.0, 391.7, 'suor', {'foco': 'ambos'}, [], 'O suor é o ar-condicionado do corpo'),
 (391.7, 397.9, 'suor', {'foco': 'umido'}, [], 'No úmido, o suor escorre e não evapora'),
 (397.9, 401.0, 'corpo', {'temp0': 38, 'temp1': 38.8, 'suor': 1}, [], 'Você esquenta parado na sombra'),
 (401.0, 407.6, 'limite', {'k0': 0, 'k1': 0}, [], 'O limite antigo: 35 úmidos'),
 (407.6, 412.0, 'corpo', {'temp0': 37, 'temp1': 37.8, 'suor': 0.6}, [ET('PENN STATE · 2022', 'VOLUNTÁRIOS JOVENS', 0.3, 'impacto')], 'Teste com voluntários'),
 (412.0, 415.7, 'limite', {'k0': 0, 'k1': 1}, [], 'O limite real: ~31'),
 (415.7, 422.3, 'comparacao', {'a': {'n': '31 °C', 'l': 'ABAFADO', 'cor': 'impacto'}, 'b': {'n': '45 °C', 'l': 'DESERTO SECO', 'cor': 'fogo'}, 'vs': '≥'}, [], 'Um dia abafado pode ser mais perigoso'),
 (422.3, 425.7, 'corredor', porta('1170', 0.4), [CH(9, 'SAUNA')], 'Porta 9: a porta mais surpreendente'),
 (425.7, 433.9, 'sauna', {}, [], 'Sauna seca a 80–100 °C; pessoas conversando'),
 (433.9, 437.3, 'panela', {'temp': 60, 'seg': '5 S'}, [], 'Mão em água a 60 °C'),
 (437.3, 439.2, 'comparacao', {'a': {'n': '90 °C', 'l': 'AR DA SAUNA', 'cor': 'fogo'}, 'b': {'n': '60 °C', 'l': 'ÁGUA', 'cor': 'dado'}, 'vs': '>'}, [], 'Bem mais fria que a sauna'),
 (439.2, 442.5, 'panela', {'temp': 60, 'seg': '5 S'}, [], 'Queimadura grave em 5 s'),
 (442.5, 445.6, 'panela', {'temp': 70, 'seg': '1 S'}, [], 'A 70 °C, em 1 s'),
 (445.6, 459.2, 'moleculas', {}, [], 'Ar ralo × água densa: o que encosta em você'),
 (459.2, 463.6, 'corredor', {'cam0': 6, 'cam1': 9, 'brilho': 0.9}, [], 'Guarda essa ideia (corredor, fundo brilhando)'),
 (463.6, 467.4, 'documento', {}, [], 'Philosophical Transactions, 1775'),
 (467.4, 475.2, 'blagden', {}, [ET('LONDRES · 1774', 'CHARLES BLAGDEN', 4.0, 'fogo')], 'Blagden entra na sala a ~127 °C'),
 (475.2, 477.6, 'blagden', {'zoom': 1}, [TG('8 MIN', 1250, 300, 0.2, 'fogo')], 'Fica 8 minutos'),
 (477.6, 484.9, 'blagden', {'ovo': 1}, [], 'Ovos e um bife; em 20 min, ovos duros'),
 (484.9, 489.3, 'blagden', {}, [CA('O OVO COZINHOU. ELE NÃO.', 0.4, 'fogo')], 'Ele sai andando, temperatura normal'),
 (489.3, 492.3, 'documento', {}, [], 'Apresentado à Real Sociedade'),
 (492.3, 497.1, 'suor', {'foco': 'seco'}, [], 'O suor segura a gente vivo'),
 (497.1, 503.9, 'cta', {}, [], 'CTA: botão de inscrição discreto sobre o corredor'),
 (503.9, 506.8, 'corredor', porta('1170', 0.6), [CH(10, 'LAVA')], 'Porta 10: a última porta do planeta'),
 (506.8, 513.1, 'lava', {'modo': 'rio'}, [ET('HAVAÍ', '~1.170 °C', 0.4, 'fogo')], 'Lava no Havaí; pessoa de roupa aluminizada'),
 (513.1, 521.0, 'lava', {'modo': 'mito'}, [], 'Mito de filme: afundar na lava'),
 (521.0, 524.9, 'lava', {'modo': 'mito'}, [CA('NÃO AFUNDA', 0.2, 'fogo')], 'Você ficaria na superfície'),
 (524.9, 530.1, 'lava', {'modo': 'rio', 'zoom': 1}, [], 'O calor queima a metros'),
 (530.1, 534.3, 'corredor', porta('-89', 0.6), [CH(11, 'ANTÁRTIDA')], 'Porta 11: um lugar que nem cidade tem'),
 (534.3, 540.4, 'antartida', {'modo': 'estacao'}, [ET('21 DE JULHO DE 1983', 'ESTAÇÃO VOSTOK', 0.4, 'dado')], 'Estação Vostok na noite polar'),
 (540.4, 546.2, 'antartida', {'modo': 'mapa'}, [], 'Recorde oficial: −89,2'),
 (546.2, 553.2, 'antartida', {'modo': 'mapa', 'zoom': 1}, [], 'Satélites: −98 na superfície do gelo'),
 (553.2, 558.1, 'antartida', {'modo': 'respiracao'}, [], 'A respiração vira cristal'),
 (558.1, 563.0, 'siberia', {'modo': 'rosto', 'timer': 2}, [], 'A tabela de congelamento nem chega tão longe'),
 (563.0, 568.5, 'antartida', {'modo': 'estacao', 'zoom': 1}, [], 'Sem roupa certa, minutos'),
 (568.5, 571.4, 'placar', {'linhas': PLA[1]}, [], 'Placar: a Terra completa'),
 (571.4, 574.1, 'corredor', porta('-196', 0.6), [CH(12, 'NITROGÊNIO')], 'Porta 12: −196'),
 (574.1, 579.5, 'nitro', {'modo': 'bacia'}, [], 'Nitrogênio líquido no laboratório'),
 (579.5, 591.4, 'nitro', {'modo': 'mao'}, [CV('EFEITO LEIDENFROST', 5.6, 'dado')], 'A mão passa rápido; colchão de vapor'),
 (591.4, 595.7, 'nitro', {'modo': 'gota'}, [], 'A gota dançando na frigideira'),
 (595.7, 602.0, 'nitro', {'modo': 'bacia', 'zoom': 1}, [CA('NÃO TENTE', 1.0)], 'Um segundo a mais: queimadura grave'),
 (602.0, 609.6, 'moleculas', {}, [], 'A lição da sauna: o que encosta em você'),
 (609.6, 612.6, 'corredor', porta('-270', 0.6), [CH(13, 'O ESPAÇO')], 'Porta 13: o mito mais famoso do frio'),
 (612.6, 617.2, 'espacoP', {}, [], 'Você no espaço, de camiseta'),
 (617.2, 620.0, 'espacoP', {}, [CA('ERRADO', 0.0)], 'Vira picolé? Errado'),
 (620.0, 628.3, 'garrafa', {}, [], 'Vácuo = garrafa térmica'),
 (628.3, 633.7, 'espacoP', {'zoom': 1}, [], 'Você esfriaria muito devagar; falta de ar'),
 (633.7, 638.9, 'espacoP', {'apaga': 1}, [TG('15 S', 1250, 300, 0.2, 'perigo')], 'Em ~15 s você apaga'),
 (638.9, 642.9, 'universo', {}, [], 'Longe de qualquer estrela'),
 (642.9, 648.0, 'cmb', {}, [], 'O brilho que sobrou do Big Bang'),
 (648.0, 655.8, 'espaco', {}, [], '−270,4 °C'),
 (655.8, 660.5, 'corredor', porta('28000', 0.6), [CH(14, 'O RAIO')], 'Porta 14: bem perto de você'),
 (660.5, 666.0, 'raio', {'modo': 'cidade'}, [TG('~28.000 °C', 1250, 300, 1.5, 'fogo')], 'Um raio cai sobre a cidade'),
 (666.0, 669.9, 'comparacao', {'a': {'n': '28.000 °C', 'l': 'UM RAIO', 'cor': 'dado'}, 'b': {'n': '5.500 °C', 'l': 'SUPERFÍCIE DO SOL', 'cor': 'fogo'}, 'vs': '>'}, [], '5 vezes a superfície do Sol'),
 (669.9, 674.5, 'raio', {'modo': 'canal'}, [], 'Da grossura de um dedo'),
 (674.5, 682.3, 'raio', {'modo': 'cidade'}, [], 'Toda tempestade de verão'),
 (682.3, 690.6, 'sol', {'num': '5.500 °C'}, [CH(15, 'O SOL')], 'Porta 15: a superfície do Sol'),
 (690.6, 697.0, 'solCorte', {'m0': 0, 'm1': 0.6}, [], 'Mergulho até o núcleo'),
 (697.0, 700.7, 'sol', {'num': '15.000.000 °C'}, [], 'Hidrogênio vira hélio'),
 (700.7, 704.2, 'sol', {'num': '15.000.000 °C'}, [CA('VOCÊ AGUENTA: NADA', 0.2)], 'O cronômetro nem liga'),
 (704.2, 711.3, 'placar', {'linhas': PLA[2]}, [], 'Placar: do espaço ao núcleo do Sol'),
 (711.3, 717.7, 'corredor', {'cam0': 19.5, 'cam1': 23, 'brilho': 1}, [], 'Faltam as duas últimas portas'),
 (717.7, 720.8, 'corredor', porta('fimF', 0.5), [], 'Algo mais frio que o espaço'),
 (720.8, 723.3, 'corredor', porta('fimQ', 0.5), [], 'Algo mais quente que o Sol'),
 (723.3, 727.0, 'laboratorio', {}, [], 'Os recordes de verdade não estão lá fora'),
 (727.0, 729.8, 'corredor', porta('fimF', 0.5), [CH(16, 'BUMERANGUE')], 'Porta 16: o frio da natureza'),
 (729.8, 737.4, 'nebulosa', {}, [ET('A 5 MIL ANOS-LUZ', 'NEBULOSA DO BUMERANGUE', 3.9, 'dado')], 'Estrela velha soltando gás'),
 (737.4, 740.2, 'spray', {}, [], 'Como o spray que gela'),
 (740.2, 745.0, 'nebulosa', {'zoom': 1}, [TG('≈ 1 K · −272 °C', 1250, 300, 0.3, 'dado')], 'Um grau acima do zero absoluto'),
 (745.0, 747.5, 'comparacao', {'a': {'n': '1 K', 'l': 'NEBULOSA', 'cor': 'frio'}, 'b': {'n': '2,7 K', 'l': 'ESPAÇO', 'cor': 'dado'}, 'vs': '<'}, [], 'Mais frio que o próprio espaço'),
 (747.5, 752.2, 'nebulosa', {}, [CA('NÃO É O RECORDE', 3.2, 'dado')], 'O lugar natural mais frio... mas não é o recorde'),
 (752.2, 759.0, 'torre', {'q0': 0, 'q1': 0}, [CH(17, 'BREMEN')], 'Porta 17: torre de queda livre em Bremen'),
 (759.0, 765.1, 'torre', {'q0': 0, 'q1': 1}, [], 'A nuvem de átomos solta lá de cima'),
 (765.1, 773.2, 'torre', {'q0': 1, 'q1': 1, 'nuvem': 1}, [TG('38 TRILIONÉSIMOS DE GRAU', 1080, 860, 3.0, 'dado')], 'A nuvem a 38 trilionésimos de grau'),
 (773.2, 781.2, 'reguaZero', {}, [], 'O espaço é quente perto disso: 70 bilhões de vezes'),
 (781.2, 795.2, 'iss', {}, [], 'Laboratório frio na Estação Espacial'),
 (795.2, 804.5, 'assintota', {}, [], 'O zero absoluto nunca chega'),
 (804.5, 814.6, 'tokamak', {}, [CH(18, 'KSTAR'), ET('COREIA DO SUL', '100 MILHÕES °C', 2.0, 'fogo')], 'Porta 18: reator de fusão, 48 s'),
 (814.6, 818.4, 'comparacao', {'a': {'n': '100 MI °C', 'l': 'KSTAR', 'cor': 'fogo'}, 'b': {'n': '15 MI °C', 'l': 'NÚCLEO DO SOL', 'cor': 'fogo'}, 'vs': '≈ 7×'}, [], 'Quase 7× o centro do Sol'),
 (818.4, 820.4, 'tokamak', {}, [], 'Por que não derrete?'),
 (820.4, 821.6, 'sauna', {}, [], 'Lembra da sauna?'),
 (821.6, 824.4, 'moleculas', {}, [], 'O mesmo princípio'),
 (824.4, 834.9, 'tokamak', {'campo': 1}, [], 'Gás ralíssimo, campo magnético segura no meio'),
 (834.9, 839.0, 'lhc', {'modo': 'tunel'}, [CH(19, 'CERN')], 'Porta 19: a última porta'),
 (839.0, 842.5, 'lhc', {'modo': 'mapa'}, [], 'Anel de 27 km entre Suíça e França'),
 (842.5, 845.6, 'lhc', {'modo': 'tunel'}, [], 'O maior acelerador do mundo'),
 (845.6, 855.0, 'lhc', {'modo': 'colisao'}, [], 'Núcleos de chumbo se chocam'),
 (855.0, 861.6, 'numero', {'txt': '5 TRILHÕES °C', 'cor': 'fogo'}, [], 'Uma sopa de matéria a 5 trilhões de graus'),
 (861.6, 865.7, 'comparacao', {'a': {'n': '5 TRI °C', 'l': 'CERN · 2012', 'cor': 'fogo'}, 'b': {'n': '15 MI °C', 'l': 'NÚCLEO DO SOL', 'cor': 'fogo'}, 'vs': '300 MIL ×'}, [], '300 mil vezes o centro do Sol'),
 (865.7, 868.6, 'placar', {'linhas': PLA[2], 'fimQ': '5 TRILHÕES · CERN'}, [], 'A temperatura mais alta já registrada'),
 (868.6, 873.3, 'lhc', {'modo': 'sala'}, [], 'Sala de controle, com café na mesa'),
 (873.3, 881.7, 'placar', {'linhas': PLA[2], 'fimF': '38 pK · BREMEN', 'fimQ': '5 TRILHÕES · CERN'}, [CV('AS DUAS PONTAS SÃO NOSSAS', 0.5, 'ouro')], 'Fecha o placar'),
 (881.7, 884.5, 'terra', {}, [], 'Estão aqui, na Terra'),
 (884.5, 889.0, 'janela', {'z0': 0.8, 'z1': 1}, [], 'Uma espécie que só aguenta 5 graus'),
 (889.0, 893.7, 'corredor', {'cam0': 2, 'cam1': 1, 'pz': 3.4, 'brilho': 0.8, 'ab': 1}, [], 'Fecho: o corredor com todas as portas abertas'),
 (893.7, 900.3, 'corredor', {'cam0': 4, 'cam1': 20, 'brilho': 1, 'ab': 1}, [], 'Do espaço ao Sol; a mão humana nas pontas'),
 (900.3, 912.3, 'universo', {}, [], 'Quase tudo no universo está a −270'),
 (912.3, 918.5, 'terra', {}, [], 'A faixa minúscula onde a água é líquida'),
 (918.5, 923.1, 'corredor', {'cam0': 0.6, 'cam1': 1.2, 'pz': 3.4, 'brilho': 0.7, 'ab': 1}, [], 'O número mais raro do vídeo'),
 (923.1, 929.9, 'corpo37', {}, [], 'É o seu: 37 °C'),
 (929.9, 933.7, 'universo', {'zoom': 1}, [], 'Uma chama pequena e teimosa'),
 (933.7, 942.5, 'corredor', {'cam0': 0.4, 'cam1': 1.0, 'pz': 3.4, 'px': 0.7, 'brilho': 0.7, 'ab': 1}, [ET('COMENTA AÍ', 'QUAL PORTA VOCÊ ABRIRIA?', 2.2, 'ouro')], 'Pergunta para os comentários'),
 (942.5, FIM, 'card', {}, [], 'Selo do canal + inscrição + vídeos finais'),
]
SEM_TEXTO = {'corredor', 'nevasca', 'rio', 'cerebro', 'rua', 'cidades', 'siberia', 'lava', 'antartida', 'nitro', 'espacoP', 'garrafa', 'universo', 'cmb', 'raio', 'torre', 'nebulosa', 'iss', 'tokamak', 'lhc', 'terra', 'sauna', 'suor', 'moleculas', 'blagden', 'documento', 'solCorte', 'assintota', 'reguaZero', 'anna'}
out = []
for i, (a, b, c, p, o, d) in enumerate(B):
    assert i == 0 or abs(a - B[i - 1][1]) < 0.01, (a, B[i - 1][1])
    n = max(1, math.ceil((b - a) / 5.0 - 1e-6))
    L = (b - a) / n
    for j in range(n):
        aa, bb = a + j * L, a + (j + 1) * L
        pp = dict(p); pp['parte'] = j; pp['partes'] = n; pp['off'] = p.get('off', 0) + j * L
        if c == 'corredor':  # divide o movimento da câmera entre as partes, sem saltos
            for k0, k1 in (('cam0', 'cam1'), ('x0', 'x1'), ('y0', 'y1')):
                if k0 in p:
                    v0, v1 = p[k0], p.get(k1, p[k0])
                    pp[k0], pp[k1] = v0 + (v1 - v0) * j / n, v0 + (v1 - v0) * (j + 1) / n
        oo = []
        for ov in o:
            t0 = ov.get('t0', 0) - j * L
            if ov['tipo'] == 'chip' and j > 0: continue
            if t0 < -0.01 and ov['tipo'] != 'chip':
                if t0 + L < 0: continue
                ov2 = dict(ov); ov2['t0'] = 0; ov2['ja'] = 1; oo.append(ov2); continue
            if t0 > L: continue
            ov2 = dict(ov); ov2['t0'] = max(0, t0); oo.append(ov2)
        fade = 0.35 if out and out[-1]['c'] == c and c in SEM_TEXTO and not oo and not out[-1]['o'] else 0
        out.append({'a': round(aa, 3), 'b': round(bb, 3), 'c': c, 'p': pp, 'o': oo, 'd': d + (f' ({j + 1}/{n})' if n > 1 else ''), 'f': fade})
json.dump(out, open('render/src/cortes.json', 'w'), ensure_ascii=False, indent=0)
print(len(out), 'planos; maior:', max(x['b'] - x['a'] for x in out), 's; fim', out[-1]['b'])
