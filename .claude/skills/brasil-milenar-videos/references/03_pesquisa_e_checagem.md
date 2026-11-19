# 03 — Pesquisa e checagem de fatos

## Princípio
O canal vive de credibilidade. Cada número dito precisa ter fonte confiável. Pesquisa feita "de memória" sempre passa por uma **segunda rodada de verificação** que reabre as fontes — no vídeo 1, essa rodada corrigiu 6 números importantes (ex.: a abertura do Atlântico é ~3 cm/ano na latitude do Nordeste, não 3,5; asteroide de 1 km a cada ~700 mil anos, não 500 mil; o Amazonas NÃO "corria para o Pacífico" — antes de ~10-11 milhões de anos a água do oeste da Amazônia escoava para o norte, rumo ao Caribe; Alfa do Centauro chega a ~2,9 anos-luz, não 3,25).

## Fontes preferidas
IPCC AR6, NASA (eclipse.gsfc.nasa.gov, science.nasa.gov), ESA/Gaia, USGS, IBGE, INPE, Serviço Geológico do Brasil (SGB/CPRM), UnB Observatório Sismológico, Revista Pesquisa FAPESP, artigos revisados (Nature, Science, Geology, Nature Geoscience) — abrir o abstract/artigo, não só a manchete. Wikipedia só como ponte para a fonte primária (confiança MÉDIA).

## Como dividir a pesquisa (3 frentes em paralelo)
Para um vídeo de escada no tempo, dividir por faixa de tempo/tema. Prompt-modelo para cada pesquisador:

> Você é pesquisador científico para um roteiro de YouTube em português do Brasil: "[TÍTULO]". O vídeo é uma viagem em escada com paradas curtas, cada uma com UM fato forte e um número, sempre com âncora no Brasil. Sua parte: [FAIXA/TEMA]. Pesquise priorizando fontes primárias. Para cada item traga: FATO | NÚMERO | FONTE (link) | CONFIANÇA (consenso / estudo único / especulativo). Marque mitos e números que circulam errados. Itens: [lista de 6-10 perguntas concretas]. No fim: os 8 fatos mais impactantes para vídeo + mitos a evitar. Não invente números: se não achar, diga que não achou.

Depois, um **verificador** recebe os relatórios e confere cada item marcado como memória/não verificado, devolvendo uma TABELA: Item | Valor verificado | Fonte aberta | Confiança (ALTA/MÉDIA/BAIXA) | Frase segura para narração. O que não for verificado: "NÃO VERIFICADO — não usar".

## Checagem final do roteiro pronto
Prompt-modelo:
> Você é fact-checker final de um roteiro que vai ser gravado. Para CADA afirmação factual (números, datas, nomes, comparações e contas), confira contra os arquivos de verificação e, quando não coberto, na web. Atenção especial a comparações do cotidiano (ex.: "45 cm = assento de cadeira", "unha cresce X por ano", "20 m = 7 andares"), horários, distâncias e frases que soem mais certas do que a ciência permite. NÃO reescreva. Entregue: BLOCO | trecho exato | problema | correção pronta | gravidade (ERRO/IMPRECISO). No fim, quantas afirmações ficaram OK.

Erros típicos encontrados no vídeo 1 (para já evitar):
- "Pólen mostra Mata Atlântica na plataforma exposta" → era só hipótese.
- "Velocidade da unha" → mão ~3,5 mm/mês (~4 cm/ano), pé ~2 cm/ano; 3 cm/ano fica no meio.
- "O dia vira noite no Nordeste" → é uma FAIXA de ~260 km, não a região inteira.
- Afirmar o futuro de um lugar sem estudo com data → usar "é bem provável", "ao longo de milhões de anos".
- "Queimando como hoje" para o cenário SSP5-8.5 → é "emissões muito altas".

## Linguagem de incerteza (use sempre que a ciência for incerta)
"anota com lápis" · "num dos modelos" · "um estudo de [ano] sugere" · "pelo que se sabe hoje" · "não é previsão com data, é média/estatística" · "é um modelo, não uma sentença" · "tem pesquisador que discorda".

## Banco de fatos verificados (vídeo 1 — reutilizáveis)
- Atlântico abre ~3 cm/ano no Nordeste (MORVEL, DeMets 2010); distância mínima Brasil–África ~2.850 km (Cabo de São Roque → Senegal/Guiné-Bissau).
- Separação Brasil–África: rifte desde ~140 Ma; final no Nordeste ~103 Ma (Heine 2013).
- Fernando de Noronha: vulcanismo de ~12 a ~1,2 Ma; base a ~4 km de profundidade. Atol das Rocas: único atol do Atlântico Sul, sobre vulcão submarino. Ilha da Trindade: terreno vulcânico mais jovem do Brasil (atividade até ~60 mil anos atrás).
- Araguainha (MT/GO): ~40 km, ~254 Ma, maior cratera da América do Sul.
- Impactos (NASA): 1 km a cada ~700 mil anos; 10 km a cada ~100 milhões.
- Serra do Mar: erosão ~10-40 m por milhão de anos (Salgado 2014/2016, berílio-10).
- Lua se afasta 3,8 cm/ano; o dia cresce ~1,8 ms/século (Stephenson 2016) → ~18-20 s em 1 Ma.
- Espécie de mamífero dura ~1-3 Ma no registro fóssil.
- Eclipse solar total 12/08/2045: faixa pelo Norte/Nordeste, ~4 min em São Luís (NASA).
- Polo sul celeste: Delta Velorum ~0,2° do polo por volta do ano 9.200-9.250; Canopus a ~8-10° por volta de 14.000; hoje Sigma Octantis (mag 5,5).
- Alfa do Centauro: ~2,9 anos-luz por volta do ano 27.000 (Matthews 1994).
- Eta Carinae: ~7.500 a.l., surto de 1843, circumpolar ao sul de ~30°S, invisível ao norte de ~30°N; supernova típica brilharia como Vênus; sem prazo.
- Nível do mar (IPCC AR6): 2300 = 0,3-3,1 m (emissões baixas) a 1,7-6,8 m (muito altas); 2.000 anos = +2-6 m com 2 °C, ~20 m com 5 °C. Santos: +27-45 cm até 2100 (Marengo 2017, tendência de marégrafo).
- Era do gelo: sem humanos, não antes de 50 mil anos; CO2 pode adiar para 100 mil+ (Ganopolski 2016). Mar ~120 m mais baixo há ~20 mil anos.
- Itaipu: reservatório ~194 anos até assoreamento relevante (Itaipu em Números 2023-2025).
- Pangeia Próxima (Scotese): Atlântico para de abrir ~125 Ma e fecha; Américas colidem com África ~250 Ma. Farnsworth 2023 (Bristol): só 8-16% das terras habitáveis para mamíferos (66% hoje).
- Rochas mais antigas do Brasil: ~3,6 bilhões de anos (Complexo Mairi, BA).
