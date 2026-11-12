"""Plano de cenas. Cada grupo cobre um intervalo de frases da narração (índices de sentences.json).
I(...) = imagem/vídeo de banco | G(...) = gráfico 2D criado por nós.
fx: zin (zoom-in lento), zout, panl/panr (deslize), shake (tremor leve), flash (corte com flash)
sfx: whoosh, hit, riser, tick, pop, stamp, wind, boom, rumble, birds, water, fire
"""
def I(key, n=0, **k): return dict(t='img', key=key, n=n, **k)
def G(kind, **k): return dict(t='gfx', kind=kind, **k)

R = {}  # tiers acumulados
SEC = []
def S(a, b, shots, sec=None, music=None):
    SEC.append(dict(a=a, b=b, shots=shots, sec=sec, music=music))

TIER = lambda hl, add: G('tier', hl=hl, add=add, sfx='stamp')

# ================= INTRO (cortes rápidos) =================
S(0, 0, [I('caramelo', 0, text='SEM RAÇA.', fx='zin', sfx='hit')], 'Intro', 'Trilha: começa seca, percussão leve; volume -22 dB sob a voz')
S(1, 1, [I('street_dog', 0, text='SEM PEDIGREE.', fx='zin', sfx='hit')])
S(2, 2, [I('dog_sleep', 0, text='SEM DONO FIXO.', fx='zin', sfx='hit')])
S(3, 3, [I('moto', 0, stamp='Motoqueiro', ok=True, fx='panr', sfx='pop'), I('rain', 0, stamp='Chuva de verão', ok=True, fx='zin', sfx='pop'),
         I('fireworks', 0, stamp='Réveillon', ok=True, fx='zout', sfx='pop'), I('bakery', 0, stamp='3 padarias', ok=True, fx='zin', sfx='pop')])
S(4, 4, [I('caramelo', 1, text='O MAIS RESISTENTE\nDO BRASIL?', fx='zin')])
S(5, 5, [I('caramelo', 2, fx='zin'), I('lava', 0, fx='shake', sfx='whoosh'), I('glacier', 0, fx='zin')])
S(6, 6, [I('carbon_forest', 0, text='UM ANO?', fx='zin', sfx='hit'), I('dunes', 0, text='UMA SEMANA?', fx='zin', sfx='hit')])
S(7, 7, [I('lava', 1, text='UNS SEGUNDOS?', fx='flash', sfx='boom')])
S(8, 8, [G('kinetic', text='E tem mais\numa coisa…', bg=None, sfx='riser')])
S(9, 9, [I('speothos', 0, fx='zin', note='Teaser: quem é esse?', blur=True), I('smilodon', 0, fx='shake', sfx='hit'), I('purussaurus', 0, fx='zin')])
S(10, 10, [I('protocyon', 0, text='???', fx='zin', note='Silhueta escurecida — só revelado no fim', blur=True, sfx='riser'), I('terrorbird', 0, fx='zin'), I('speothos', 1, fx='zout')])
S(11, 11, [I('caramelo', 3, fx='zin')], 'Personagem e 3 armas', 'Trilha: entra o tema principal (leve, curioso)')
S(12, 12, [I('shepherd', 0, stamp='Pastor-alemão', fx='zin', sfx='stamp')])
S(13, 13, [I('pitbull', 0, stamp='Pitbull', fx='zin', sfx='stamp')])
S(14, 14, [I('caramelo', 0, stamp='O escolhido', ok=True, fx='zin', sfx='stamp')])
S(15, 17, [I('caramelo', 4, specs=[('Peso', '~20 kg'), ('Altura', '~50 cm'), ('Raça', 'Nenhuma')], fx='zin', sfx='pop', focus=(0.3, 0.5)),
           G('number', num='3', cap='armas secretas', bgkey='caramelo', sfx='hit')])
S(18, 18, [G('weapon', n=1, name='O FARO', desc='Centenas de milhões de receptores', bgkey='dog_nose', sfx='whoosh')])
S(19, 20, [G('bars', title='Receptores de cheiro', items=[('Você', 6, False), ('Seu caramelo', 300, True)], unit=' mi', sfx='tick')])
S(21, 21, [I('dog_sniff', 0, label='Sente antes de ver', fx='zin')])
S(22, 22, [G('weapon', n=2, name='O ESTÔMAGO', desc='Come (quase) qualquer coisa', bgkey='dog_eat', sfx='whoosh')])
S(23, 23, [I('churrasco', 0, fx='zin'), I('dog_eat', 1, fx='zin')])
S(24, 25, [I('caramelo', 5, text='VALE OURO', fx='zin', sfx='pop')])
S(26, 27, [G('weapon', n=3, name='O OLHAR', desc='Guarda essa…', bgkey='dog_eyes', sfx='riser'), I('dog_eyes', 1, text='(guarda essa)', fx='zin')])
S(28, 31, [G('kinetic', text='As regras', bg='street_dog', sfx='whoosh'), I('street_dog', 2, label='Sozinho', fx='panl'),
           G('kinetic', text='Sem comida.\nSem dono.\nSem veterinário.', bg='dog_sleep', sfx='tick'), TIER(None, None)], 'Regras')
S(32, 39, [TIER('S', None), TIER('A', None), TIER('B', None), TIER('C', None), TIER('D', None), TIER('F', None), TIER('✕', None)])
S(40, 42, [G('mapfocus', groups=[], title='O Brasil de hoje…', sub='…nem sempre esteve aqui', sfx='whoosh'), I('gondwana', 0, label='O Brasil já foi outro', fx='zin')])
S(43, 43, [G('kinetic', text='Bora descobrir.', bg='lava', sfx='whoosh')])

# ================= 1. PRÉ-CAMBRIANO =================
ERA = lambda n, name, place, age, st, bg: G('era', num=n, name=name, place=place, age=age, states=st, bgkey=bg, sfx='boom')
S(44, 46, [ERA(1, 'Pré-Cambriano', 'Corumbá, Mato Grosso do Sul', '~550 milhões de anos', ['MS'], 'stromatolite')], '1 · Pré-Cambriano', 'Trilha: ambiente grave, vento')
S(47, 47, [I('pantanal', 0, stamp='Esquece o Pantanal', fx='zin', sfx='stamp')])
S(48, 50, [I('stromatolite', 0, label='Mar raso', fx='panr', sfx='water'), I('barren', 0, label='Na terra: nada', fx='zin', sfx='wind')])
S(51, 51, [I('cloudina', 0, label='Cloudina', sub='Um dos animais mais antigos do Brasil', fx='zin', loc=(['MS'], 'Corumbá (MS)', '~550 mi anos')),
           I('cloudina', 1, label='Corumbella', sub='Tubinhos de poucos centímetros', fx='zin'), I('stromatolite', 1, fx='panl')])
S(52, 53, [I('cloudina', 2, label='Do tamanho de um canudinho', fx='zout')])
S(54, 54, [G('oxygen', value=3, cap='Muito menos que hoje', bgkey='barren', sfx='tick')])
S(55, 55, [I('dog_pant', 0, fx='zin'), I('barren', 1, fx='panr'), I('lava', 2, fx='zin')])
S(56, 56, [G('kinetic', text='Precisa mesmo\nque eu explique?', bg='barren')])
S(57, 57, [TIER('✕', ('✕', 'Pré-Cambriano'))])

# ================= 2. DEVONIANO =================
S(58, 59, [ERA(2, 'Devoniano', 'Ponta Grossa, Paraná', '~400 milhões de anos', ['PR'], 'cold_sea')], '2 · Devoniano', 'Trilha: frio, cordas suaves')
S(60, 61, [I('gondwana', 1, label='O Brasil perto do Polo Sul', fx='zin', sfx='whoosh'), I('gondwana', 0, label='Gonduana', fx='zout')])
S(62, 62, [I('cold_sea', 0, label='Mar frio sobre o Paraná', fx='panl', sfx='water')])
S(63, 64, [G('oxygen', value=17, cap='Melhorou', bgkey='cold_sea', sfx='tick'), I('dog_pant', 1, fx='zin')])
S(65, 66, [I('cooksonia', 0, label='Plantas baixinhas', sub='Não alimentam ninguém', fx='zin')])
S(67, 67, [I('trilobite_art', 0, label='Trilobitas', fx='zin', sfx='pop')])
S(68, 68, [I('trilobite', 0, label='Fóssil de trilobita', fx='zin', loc=(['PR'], 'Ponta Grossa (PR)', '~400 mi anos')), I('pontagrossa', 0, label='Ponta Grossa (PR)', fx='panr')])
S(69, 69, [G('compare', lkey='trilobite_art', rkey='woodlouse', lt='Trilobita', rt='Tatuzinho-de-jardim', ls='Poucos centímetros', rs='Mesma vibe', title='Primos de aparência', sfx='whoosh')])
S(70, 70, [G('kinetic', text='Vamos fazer a conta.', bg='trilobite', sfx='tick')])
S(71, 71, [G('number', num='~10', cap='calorias por trilobita', bgkey='trilobite', sfx='tick')])
S(72, 72, [G('number', num='~1.000', cap='calorias por dia', bgkey='caramelo', sfx='tick')])
S(73, 73, [G('number', num='100', cap='trilobitas por dia', bgkey='trilobite', sfx='hit'), G('kinetic', text='Todo.\nSanto.\nDia.', bg='cold_sea', sfx='hit')])
S(74, 74, [I('cold_sea', 1, fx='shake', sfx='wind')])
S(75, 75, [TIER('D', ('D', 'Devoniano'))])

# ================= 3. CARBONÍFERO =================
S(76, 78, [ERA(3, 'Carbonífero', 'Sul do Brasil', '~300 milhões de anos', ['RS', 'SC', 'PR', 'SP'], 'glacier')], '3 · Carbonífero', 'Trilha: começa "épica" (piada) e corta seco no gelo')
S(79, 79, [I('carbon_forest', 0, label='A fama do Carbonífero', fx='zin'), I('meganeura', 0, label='Libélula do tamanho de um gavião', fx='zin', sfx='pop'),
           I('arthropleura', 0, label='Centopeia do tamanho de uma canoa', fx='panr', sfx='pop'), I('carbon_forest', 1, fx='zout')])
S(80, 80, [G('oxygen', value=30, cap='~30% de oxigênio', bgkey='carbon_forest', sfx='tick')])
S(81, 82, [I('carbon_forest', 2, stamp='Hemisfério Norte', fx='zin', sfx='stamp')])
S(83, 83, [I('glacier', 0, text='AQUI: GELO.', fx='flash', sfx='wind', note='Corte seco: a música para')])
S(84, 85, [I('gondwana', 0, label='Sul do Brasil perto do Polo', fx='zin'), I('glacier', 1, label='Geleiras do Gonduana', fx='panl')])
S(86, 86, [I('striations', 0, label='Rocha riscada pelo gelo', sub='Ainda dá pra ver em SP e no Sul', fx='zin', loc=(['SP', 'PR', 'SC', 'RS'], 'Sul e SP', '~300 mi anos'))])
S(87, 88, [G('oxygen', value=30, cap='A boa notícia', bgkey='glacier', sfx='tick'), I('dog_run_video', 0, fx='zin')])
S(89, 90, [I('dog_snow', 0, fx='zin'), I('glacier', 2, label='Sem nada pra comer', fx='panr', sfx='wind')])
S(91, 93, [G('compare', lkey='street_dog', rkey='dog_snow', lt='Calçada quente', rt='Gelo', ls='O habitat dele', rs='Não é a praia dele', title='Caramelo é de rua'), TIER('D', ('D', 'Carbonífero'))])

# ================= 4. PERMIANO =================
S(94, 95, [ERA(4, 'Permiano', 'Sul e Norte do Brasil', '~270 milhões de anos', ['PR', 'SC', 'RS', 'MA', 'PI', 'TO'], 'petrified')], '4 · Permiano', 'Trilha: quente, percussão')
S(96, 97, [G('mapfocus', groups=[(['PR', 'SC', 'RS', 'SP'], (90, 170, 110), 'Sul: mar raso'), (['MA', 'PI', 'TO'], (229, 72, 77), 'Norte: rios e florestas')], title='Dois Brasis', sub='~270 milhões de anos', sfx='whoosh')])
S(98, 99, [I('mesosaurus', 0, label='Mesossauro', fx='zin', sfx='pop')])
S(100, 100, [I('mesosaurus', 1, label='~1 metro, fininho', fx='zin'), I('mesosaurus', 2, label='Dentinhos de filtrar comida', fx='panr')])
S(101, 102, [I('wegener_map', 0, label='Fósseis no Brasil e na África', fx='zin'), I('wegener_map', 1, label='Prova: continentes grudados', fx='zout')])
S(103, 104, [G('compare', lkey='mesosaurus', rkey='caramelo', lt='Mesossauro', rt='Caramelo', ls='~1 m, inofensivo', rs='~20 kg, com fome', title='É janta', sfx='hit')])
S(105, 107, [G('mapfocus', groups=[(['MA', 'PI', 'TO'], (229, 72, 77), 'Maranhão · Piauí · Tocantins')], title='Agora, o Norte', sfx='whoosh')])
S(108, 108, [I('petrified', 0, label='Troncos virados pedra', fx='zin', loc=(['TO'], 'Tocantins', '~270 mi anos')), I('petrified', 1, label='Monumento Natural das Árvores Fossilizadas', fx='panr')])
S(109, 111, [I('prionosuchus', 0, label='Prionossuco', fx='zin', sfx='hit'), I('caiman', 0, stamp='Não é crocodilo', fx='zin', sfx='stamp'),
             I('prionosuchus', 1, label='Um anfíbio gigante', fx='zin'), I('river_brazil', 0, label='Esperando na beira', fx='panl', sfx='water')])
S(112, 113, [I('dog_pant', 2, fx='zin'), I('river_brazil', 1, fx='zin')])
S(114, 116, [G('mapfocus', groups=[(['PR', 'SC', 'RS', 'SP'], (90, 170, 110), 'Sul: comida fácil'), (['MA', 'PI', 'TO'], (229, 72, 77), 'Norte: armadilha nos rios')], title='Dois Brasis')])
S(117, 117, [TIER('C', ('C', 'Permiano'))])

# ================= 5. TRIÁSSICO =================
S(118, 120, [ERA(5, 'Triássico', 'Santa Maria, Rio Grande do Sul', '~230 milhões de anos', ['RS'], 'triassic_land')], '5 · Triássico', 'Trilha: aventura')
S(121, 121, [I('triassic_land', 2, text='DINOSSAUROS GAÚCHOS', fx='zin', sfx='hit', loc=(['RS'], 'Santa Maria (RS)', '~230 mi anos'))])
S(122, 122, [I('staurikosaurus', 0, label='Estauricossauro', fx='zin', sfx='pop'), I('saturnalia', 0, label='Saturnália', fx='zin', sfx='pop'), I('buriolestes', 0, label='Buriolestes', fx='zin', sfx='pop')])
S(123, 124, [G('kinetic', text='Nada a ver\ncom os filmes.', bg='triassic_land'), G('compare', lkey='staurikosaurus', rkey='caramelo', lt='Estauricossauro', rt='Caramelo', ls='~2 m (quase tudo cauda)', rs='~50 cm de altura', title='Tamanho real')])
S(125, 127, [I('buriolestes', 1, label='Buriolestes', sub='Carnívoro pequeno', fx='zin'), G('compare', lkey='buriolestes', rkey='caramelo', lt='Buriolestes', rt='Caramelo', ls='~1,5 m', rs='~20 kg', title='Um contra um', sfx='hit')])
S(128, 128, [I('hyperodapedon', 0, label='Hiperodápedon', sub='Rincossauro', fx='zin'), I('hyperodapedon', 1, label='Do tamanho de um porco', fx='panr'), I('triassic_land', 1, label='Muito herbívoro = carcaça', fx='zin')])
S(129, 130, [I('dog_sniff', 1, label='O faro acha de longe', fx='zin')])
S(131, 132, [I('gnathovorax', 0, label='Gnatovórax', sub='~3 m, dentes curvos', fx='zin', sfx='hit'), I('gnathovorax', 1, fx='shake')])
S(133, 137, [I('prestosuchus', 0, label='Prestossuco', fx='zin', sfx='boom'), I('prestosuchus', 1, stamp='Não é dinossauro', fx='zin', sfx='stamp'),
             I('prestosuchus', 2, label='Parente dos crocodilos', sub='Andava de pé', fx='panr'), I('caramelo', 6, stamp='Aperitivo', fx='zin', sfx='stamp')])
S(138, 139, [G('kinetic', text='A parte curiosa…', bg='triassic_land', sfx='riser'), I('brasilodon', 0, label='Brasilodonte', sub='Do tamanho de um rato', fx='zin')])
S(140, 141, [G('chain', steps=[('Brasilodonte', '~230 mi anos'), ('Mamíferos', '~200 mi anos'), ('Caramelo', 'hoje')], title='Da família?', sfx='whoosh')])
S(142, 143, [I('caramelo', 7, text='COMER O TATARAVÔ?', fx='zin', sfx='hit')])
S(144, 145, [TIER('C', ('C', 'Triássico'))])

# ================= 6. DESERTO BOTUCATU =================
S(146, 147, [ERA(6, 'Fim do Jurássico', 'Deserto Botucatu', '~140 milhões de anos', ['SP', 'PR', 'MS', 'MG', 'GO', 'SC', 'RS', 'MT'], 'dunes')], '6 · Deserto Botucatu', 'Trilha: calor, drone')
S(148, 148, [I('dunes', 0, text='AREIA.', fx='zin', sfx='wind')])
S(149, 150, [G('mapfocus', groups=[(['SP', 'PR', 'MS', 'MG', 'GO', 'SC', 'RS', 'MT'], (217, 142, 58), 'Deserto Botucatu')], title='Um mar de areia', sfx='whoosh'), I('dunes', 1, label='Dunas atrás de dunas', fx='panr'), I('botucatu', 0, label='Arenito Botucatu', fx='zin')])
S(151, 151, [I('footprints', 0, label='Araraquara (SP)', fx='zin', loc=(['SP'], 'Araraquara (SP)', '~140 mi anos')), I('botucatu', 1, label='As pedras viraram calçada', fx='panl')])
S(152, 153, [I('footprints', 1, label='Pegadas fossilizadas', fx='zin', sfx='pop'), I('bakery', 1, text='…indo pra padaria.', fx='zin')])
S(154, 157, [I('dog_pant', 0, label='Cachorro quase não sua', fx='zin'), I('dog_pant', 3, label='Ele se resfria ofegando', fx='zin'), I('dunes', 2, fx='shake', sfx='wind')])
S(158, 160, [G('kinetic', text='Sem rio.\nSem sombra.\nSem comida.', bg='dunes', sfx='hit'), TIER('F', ('F', 'Deserto Botucatu'))])

# ================= 7. ARARIPE =================
S(161, 163, [ERA(7, 'Cretáceo', 'Chapada do Araripe, Ceará', '~110 milhões de anos', ['CE', 'PE', 'PI'], 'araripe'), I('araripe', 0, label='Chapada do Araripe', sub='Um dos melhores sítios de fósseis do planeta', fx='panr')], '7 · Araripe', 'Trilha: maravilha, depois tensão')
S(164, 165, [I('lagoon', 0, label='Uma lagoa enorme', fx='zin', sfx='water'), I('fish_fossil', 0, label='Cheia de peixe', fx='zin')])
S(166, 166, [I('fish_fossil', 1, label='Peixe inteiro dentro da pedra', fx='zin', loc=(['CE'], 'Santana do Cariri (CE)', '~110 mi anos'))])
S(167, 168, [I('dog_swim', 0, text='O PARAÍSO?', fx='zin')])
S(169, 170, [G('kinetic', text='Mas olha pra cima.', bg='lagoon', sfx='riser'), I('anhanguera', 0, label='Pterossauros', fx='zin', sfx='whoosh')])
S(171, 171, [I('tupandactylus', 0, label='Tupandáctilo', sub='Crista gigante', fx='zin')])
S(172, 172, [I('tropeognathus', 0, label='Tropeognato', fx='zin'), G('number', num='8 m+', cap='de asa a asa', bgkey='tropeognathus', sfx='hit')])
S(173, 174, [I('anhanguera', 1, label='Comia peixe, não cachorro', fx='panr'), I('tupandactylus', 1, fx='zin', sfx='whoosh'), I('caramelo', 8, text='AU! AU! AU!', fx='shake')])
S(175, 176, [I('irritator', 0, label='Irritator', sub='Espinossaurídeo', fx='zin', sfx='hit'), I('irritator', 1, label='Feito pra pegar peixe…', fx='zin'), I('irritator', 2, text='…e caramelo distraído', fx='shake')])
S(177, 180, [I('ubirajara', 0, label='Ubirajara', sub='Pequeno dinossauro do Araripe', fx='zin'), G('mapfocus', groups=[(['CE'], (217, 142, 58), 'Ceará → Alemanha → Ceará')], title='Ida e volta'),
             G('kinetic', text='De volta ao Ceará\nem 2023.', bg='araripe', sfx='hit')])
S(181, 183, [I('lagoon', 1, label='Cada gole d’água é um risco', fx='zin'), TIER('C', ('C', 'Araripe'))])

# ================= 8. BACIA BAURU =================
S(184, 186, [ERA(8, 'Cretáceo Superior', 'Interior de SP e Triângulo Mineiro', '~70 milhões de anos', ['SP', 'MG'], 'titanosaur')], '8 · Bacia Bauru', 'Trilha: tensa, percussão grave')
S(187, 187, [I('river_brazil', 2, label='Rios que enchiam e secavam', fx='panr')])
S(188, 190, [I('titanosaur', 0, label='Uberabatitan', sub='Titanossauro de Uberaba', fx='zin', loc=(['MG'], 'Uberaba (MG)', '~70 mi anos')), I('peiropolis', 0, label='Peirópolis, Uberaba', fx='panr'), I('titanosaur', 1, label='Dezenas de toneladas', fx='zout')])
S(191, 191, [G('kinetic', text='Quem mandava aqui?', bg='titanosaur', sfx='riser')])
S(192, 197, [I('baurusuchus', 0, label='Baurussuco', fx='zin', sfx='boom'), I('baurusuchus', 1, label='Crocodilo terrestre', sub='Pernas por baixo do corpo', fx='zin'),
             I('baurusuchus', 2, label='Dentes como faca', fx='zin'), G('kinetic', text='Ele ia atrás.', bg='baurusuchus', sfx='hit')])
S(198, 198, [I('pycnonemosaurus', 0, label='Abelissaurídeos', sub='Braço curtinho', fx='zin'), I('pycnonemosaurus', 1, label='Picnonemossauro', fx='zin'), G('number', num='8 m+', cap='Picnonemossauro', bgkey='pycnonemosaurus', sfx='hit')])
S(199, 202, [I('dog_run_video', 1, label='Rápido em campo aberto', fx='panr'), I('baurusuchus', 3, text='O PERIGO ANDA.', fx='shake'), TIER('D', ('D', 'Bacia Bauru'))])

# ================= 9. OLIGOCENO =================
S(203, 205, [ERA(9, 'Oligoceno', 'Tremembé, Vale do Paraíba (SP)', '~25 milhões de anos', ['SP'], 'terrorbird')], '9 · Oligoceno', 'Trilha: cômica-tensa')
S(206, 208, [I('asteroid', 0, label='O asteroide caiu', fx='shake', sfx='boom'), I('toxodon', 0, label='A vez dos mamíferos', fx='zin')])
S(209, 211, [I('south_america_island', 0, label='América do Sul: uma ilha', fx='zin', sfx='whoosh')])
S(212, 213, [G('kinetic', text='✕ cachorro\n✕ gato\n✕ urso', bg='south_america_island', sfx='tick')])
S(214, 216, [G('kinetic', text='Pássaros.', bg='terrorbird', sfx='hit'), I('terrorbird', 0, label='Aves-do-terror', fx='zin')])
S(217, 217, [I('terrorbird', 1, label='Parafisórnis', sub='Alta como uma pessoa · bico de machado', fx='zin', loc=(['SP'], 'Tremembé (SP)', '~25 mi anos'))])
S(218, 218, [I('pigeon', 0, label='A vida inteira atrás de pombo…', fx='panr'), G('compare', lkey='caramelo', rkey='terrorbird', lt='Caramelo', rt='Parafisórnis', ls='Caçador de pombo', rs='Caçador de caramelo', title='Inversão de papéis', sfx='hit')])
S(219, 221, [I('toxodon', 1, label='Mamíferos por todo lado', fx='zin'), I('dog_run_video', 2, label='Caçando como cachorro', fx='panr')])
S(222, 222, [TIER('B', ('B', 'Oligoceno')), ERA(10, 'Mioceno', 'Acre', '~8 milhões de anos', ['AC'], 'wetland_amazon')], '10 · Mioceno', 'Trilha: úmida, suspense')

# ================= 10. MIOCENO =================
S(223, 225, [I('wetland_amazon', 0, label='Um pantanal gigante', fx='panr', sfx='water', loc=(['AC'], 'Acre', '~8 mi anos')), I('wetland_amazon', 1, fx='zin')])
S(226, 227, [I('stupendemys', 0, label='Tartarugas enormes', fx='zin'), I('phoberomys', 0, label='Roedores do tamanho de um boi', fx='zin')])
S(228, 228, [I('dog_swim', 1, text='O PIOR LUGAR\nPRA NADAR', fx='zin', sfx='water')])
S(229, 231, [I('purussaurus', 0, label='Purussauro', fx='zin', sfx='boom'), G('number', num='10 m+', cap='de comprimento', bgkey='purussaurus', sfx='hit'), I('caiman', 1, label='Um jacaré… gigante', fx='zin')])
S(232, 233, [I('purussaurus', 1, label='Estudo de paleontólogos brasileiros', fx='zin'), G('bars', title='Força da mordida', items=[('Você', 800, False), ('Jacaré de hoje', 16000, False), ('Purussauro', 69000, True)], unit=' N', sfx='tick')])
S(234, 236, [I('wetland_amazon', 2, label='Quase tudo é água', fx='panl'), I('caiman', 2, text='O QUE TEM EMBAIXO?', fx='zin', sfx='riser')])
S(237, 237, [TIER('D', ('D', 'Acre'))])

# ================= 11. ERA DO GELO =================
S(238, 241, [G('kinetic', text='A última parada.', bg='glyptodon', sfx='whoosh'), ERA(11, 'Era do Gelo', 'Lagoa Santa, Minas Gerais', '~12 mil anos', ['MG'], 'eremotherium')], '11 · Era do Gelo', 'Trilha: épica, depois emotiva no final')
S(242, 244, [I('glyptodon', 1, stamp='Sem neve', fx='zin', sfx='stamp'), I('eremotherium', 2, label='A megafauna', fx='panr')])
S(245, 245, [I('eremotherium', 0, label='Eremotério', sub='Preguiça-gigante · mais alta que um ônibus', fx='zin', sfx='hit')])
S(246, 246, [I('glyptodon', 0, label='Gliptodonte', sub='Tatu do tamanho de um carro', fx='zin')])
S(247, 247, [I('toxodon', 0, label='Toxodonte', fx='zin'), I('toxodon', 1, stamp='Não é rinoceronte', fx='zin', sfx='stamp')])
S(248, 251, [I('paleotoca', 0, label='Paleotocas', sub='Túneis cavados por gigantes', fx='zin', loc=(['RS', 'SC'], 'Sul do Brasil', '~10 mil+ anos')), I('paleotoca', 1, label='Dá pra entrar andando', fx='zin'), I('dog_sleep', 1, text='MELHOR ESCONDERIJO', fx='zin')])
S(252, 254, [I('toxodon', 3, text='COMIDA? MUITA.', fx='zin'), I('dog_sniff', 2, label='Carcaça todo dia', fx='zin')])
S(255, 257, [I('smilodon', 0, label='Smilodon populator', fx='zin', sfx='boom'), I('smilodon', 1, label='O maior dentes-de-sabre', sub='E vivia aqui', fx='zin')])
S(258, 258, [G('kinetic', text='O encontro\nprometido.', bg='protocyon', sfx='riser')])
S(259, 262, [I('south_america_island', 0, label='As Américas se ligam', sub='~3 milhões de anos', fx='zin', sfx='whoosh'), I('speothos', 0, label='Os cachorros chegam', fx='zin')])
S(263, 266, [I('protocyon', 0, label='Protócion', sub='O cachorro brasileiro da Era do Gelo', fx='zin', sfx='hit'),
             G('compare', lkey='protocyon', rkey='caramelo', lt='Protócion', rt='Caramelo', ls='Feito pra caçar', rs='Feito pra pedir', title='Primos?')])
S(267, 268, [I('lagoasanta', 0, label='Cavernas de Lagoa Santa', fx='zin', loc=(['MG'], 'Lagoa Santa (MG)', '~12 mil anos')), I('lund', 0, label='Peter Lund', sub='Achou os fósseis no séc. XIX', fx='zin'),
             I('speothos', 1, label='Cachorro-vinagre', sub='Vivo até hoje', fx='zin')])
S(269, 271, [G('chain', steps=[('Protócion', 'Era do Gelo'), ('Cachorro-vinagre', 'hoje'), ('Caramelo', 'forasteiro')], title='Família?'), G('kinetic', text='Não é família.\nÉ forasteiro.', bg='speothos', sfx='hit')])
S(272, 273, [G('kinetic', text='Gente.', bg='rockart', sfx='hit')])
S(274, 275, [I('luzia', 0, label='Luzia', sub='Um dos esqueletos mais antigos das Américas', fx='zin')])
S(276, 277, [I('rockart', 0, label='Pinturas rupestres', sub='Serra da Capivara (PI)', fx='zin'), I('rockart', 1, fx='panr'), I('rockart', 2, label='Provavelmente ainda sem cachorros', fx='zin')])
S(278, 280, [I('campfire', 0, label=None, fx='zin', sfx='fire'), I('campfire', 1, fx='zin'), I('dog_eyes', 0, text='AQUELE OLHAR.', fx='zin', sfx='riser')])
S(281, 281, [G('weapon', n=3, name='O OLHAR', desc='É agora.', bgkey='dog_eyes', sfx='hit')])
S(282, 283, [I('woman_dog', 0, fx='zin'), I('dog_sleep', 2, text='E AINDA GANHA UM NOME.', fx='zin')])
S(284, 285, [TIER('S', ('S', 'Era do Gelo'))])

# ================= VEREDITO E FINAL =================
S(286, 293, [G('tierfull', sfx='tick')], 'Veredito', 'Trilha: emotiva, piano; sobe 2 dB')
S(294, 296, [I('glacier', 1, fx='zout'), I('dunes', 0, fx='zout'), I('purussaurus', 0, fx='zout'), I('terrorbird', 0, fx='zout')])
S(297, 298, [G('weapon', n=1, name='O FARO', desc='Ajudou.', bgkey='dog_nose'), G('weapon', n=2, name='O ESTÔMAGO', desc='Ajudou.', bgkey='dog_eat')])
S(299, 300, [G('weapon', n=3, name='O OLHAR', desc='Salvou.', bgkey='dog_eyes', sfx='hit')])
S(301, 303, [I('street_dog', 0, fx='zin'), I('caramelo', 0, text='Ele só precisa de alguém\nque olhe de volta.', fx='zin', note='Espelha o 1º plano do vídeo')])
S(304, 307, [I('caramelo', 1, cta=('Escreve o nome do seu caramelo 👇', 'Quero ver quantos caramelos tem aqui'), fx='zin')], 'Chamada final', 'Trilha: fecha')
S(308, 308, [I('cat', 0, text='PRÓXIMO: O GATO DE RUA', fx='zin', note='Gancho do próximo vídeo')])
