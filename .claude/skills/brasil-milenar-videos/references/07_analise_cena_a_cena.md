# 07 — Análise cena a cena do vídeo de referência (2ª passada, nov/2026)

Vídeo: "O que vai acontecer daqui a 1 bilhão de anos?" (Além da Escala), 11:01, 1280x720 30 fps (arquivo do Drive do dono, id `1KRHv7gch9ZVa6Nm5hER2_B6Stn32K7nT`).
Esta passada complementa `01_estilo_e_edicao.md`: confirma as medidas e acrescenta o MAPA DE CENAS e os PADRÕES DE MONTAGEM. Serve para calibrar — nunca para copiar paradas, frases, cores ou desenhos.

## Medidas confirmadas (ffmpeg + numpy, 10 fps em 160x90)
| Medida | Valor |
|---|---|
| Loudness integrado | -13,7 LUFS · LRA 2,6 LU (voz muito constante) · pico -0,4 dB |
| Trocas grandes de cena (janela de 1 s) | 41 → uma a cada ~16 s |
| Cortes secos | 3 (6:14, 6:37, 10:18) — todos em momento de impacto |
| Quadros quase parados | ~79% |
| Movimento médio | 0-30 s: 1,83 · resto: 0,64 (abertura ~3x mais agitada) |
| Movimento por minuto | min 0: 1,19 · min 1-3: 0,2-0,46 (o mais calmo) · min 6: 1,66 (pico: sequência da bandeira) · min 7-10: 0,4-0,7 |
| Pausas longas (>0,6 s, < -35 dB) | só 13 em 11 min → a narração quase não para |

## Mapa de cenas (o que aparece na tela)
| Tempo | Cena | Elementos |
|---|---|---|
| 0:00 | Terra queimada ao lado de um Sol enorme | contador `1.000.000.000` no topo — **o vídeo abre com a IMAGEM DO FIM** |
| 0:08 | Mapa-múndi feito de pontos laranja + palavra gigante "HUMANO" em cinza atrás | contador **girando de volta** até zero |
| 0:16-0:24 | Linha do tempo horizontal fina: HOJE (nov 2026) → 1 ANO → 100 ANOS → 1 MILHÃO → 1 BILHÃO | a linha se pinta de dourado da esquerda pra direita |
| 0:32-1:04 | Sonda Voyager (o FIO CONDUTOR), lançamento 1977 com silhueta de vegetação, Terra ↔ sonda com sinal pontilhado ("LEVA 1 DIA INTEIRO") | etiqueta `VOYAGER 1 / 18 DE NOVEMBRO DE 2026` |
| 1:04-1:20 | Foguete subindo para a Lua (Artemis) | "DE 1972 A 2028", "PRAZO OTIMISTA" |
| 1:28-1:36 | Órbita da Terra + asteroide entrando, círculo dos satélites de TV com distância | rótulos finos colados nos objetos |
| 1:44-1:52 | **Cenário reaproveitado**: céu estrelado + silhueta de vegetação | "VISÍVEL A OLHO NU" |
| 2:00-2:16 | Estação Espacial sobre a Terra 3D; Terra de pontos | "+30 ANOS COM GENTE A BORDO" |
| 2:24-2:48 | Asteroide com mira circular + **barra vertical de probabilidade** (3,1% → 4% → ≈0%) | "A LUA ESCAPA" em verde = alívio |
| 2:56-3:04 | Gráfico de linha amarela com ponto brilhante (população do Brasil, pico 220,4 mi) | `FONTE: IBGE` minúscula no canto |
| 3:12-3:28 | Cometa sobre a silhueta de vegetação (cenário reaproveitado) | "20 ANOS HOJE · 55 EM 2061" (fala com VOCÊ) |
| 3:36-3:52 | Gráfico da humanidade (pico 10,3 bi), segundo rótulo azul "10,2 BI EM 2100" | |
| 4:00 | **Grade de pontos = 75 anos de vida em meses** | virada do Ato 1 |
| 4:08-4:16 | Rastro circular de estrelas (star trails) → mesma cena com a silhueta | contador `12.000` · etiqueta `UMA NOVA ESTRELA POLAR / 12 MIL ANOS` |
| 4:24-4:32 | Terra com eixo inclinado + círculo da precessão (POLAR → VEGA) | |
| 4:40-5:04 | Voyager volta (fio condutor) + Gliese 445, disco de ouro, ponto de luz sumindo ("UMA CARTA NUMA GARRAFA") | |
| 5:12-5:20 | Terra 3D ganhando gelo / perdendo gelo | "UMA NOVA ERA DO GELO?", "O CO2 PODE ADIAR" |
| 5:28-6:00 | Céu com silhueta: Betelgeuse, Três Marias circuladas, órbitas, supernova, **mesmo cenário de dia** (céu azul) | "LONGE DEMAIS PARA NOS FAZER MAL" |
| 6:08-6:37 | **PICO EMOCIONAL — bandeira do Brasil**: zoom no círculo azul, o círculo vira céu real, o Cruzeiro se deforma, volta à bandeira | 2 cortes secos aqui · "RIO DE JANEIRO · 15/11/1889" · "NÃO VAI MAIS PARECER UMA CRUZ" · "UM CÉU QUE NÃO EXISTE MAIS" |
| 6:40-6:56 | Nuvem de Oort em pontos + estrela vermelha passando | contador `1.290.000` |
| 7:04-7:12 | Mapa da África (terra bege-esverdeada) com fenda em coral | contador `5.000.000` |
| 7:20-7:44 | Marte + Fobos; Terra 3D girando | |
| 7:52-8:24 | Mapa-múndi: setas aproximando Américas e África → supercontinente; pinos em Fortaleza/Salvador/Copacabana; mancha laranja "TUDO VIRA INTERIOR" | contador `250.000.000` |
| 8:32-8:40 | Mapa inteiro em laranja (calor) com `SIMULAÇÃO: UNIVERSIDADE DE BRISTOL (2023)` | dissolve longo com 3 linhas de texto empilhadas (o "texto sobreposto") |
| 8:48-9:04 | Saturno com anéis sumindo | "DADOS DA SONDA CASSINI" |
| 9:12-9:20 | Eclipse total → eclipse anular | "A LUA SE AFASTA 3,8 CM POR ANO" |
| 9:28-10:08 | Sol cada vez maior, Terra 3D; elipse dourada na Amazônia; Terra vira a imagem queimada da ABERTURA | contador `1.000.000.000` · etiqueta `CHEGAMOS / 1 BILHÃO DE ANOS` · "SOL 10% MAIS BRILHANTE" |
| 10:18 | **Corte seco** para micróbios (bastonetes verde-água) | "SEM VIDA COMPLEXA" |
| 10:24-10:40 | Voyager pela última vez olhando a Terra pequena | "UM PLANETA AZUL" (fecho do fio condutor) |
| 10:48-11:01 | Contador grande centralizado; escurece; selo do canal no canto inferior esquerdo com avatar + nome + botão "INSCRITO ✓" + sininho | |

## Padrões de montagem (aplicar no Brasil Milenar)
1. **Estrutura circular de imagem**: a 1ª imagem do vídeo é a imagem do fim (Terra queimada aos 0:00 e aos 10:08). → Nos nossos vídeos, abrir com o quadro final (ex.: Brasil sem mar colado na África) e reaparecer igual no clímax.
2. **O fio condutor tem um OBJETO VISUAL próprio** que reaparece 4 vezes (sonda: 0:32, 4:40, 4:48, 10:24). → Desenhar um ícone/ilustração fixa para o nosso fio (ex.: Noronha em corte) e reutilizar o MESMO desenho.
3. **Cenário-coringa reaproveitado** ~7 vezes (céu + silhueta de vegetação), variando só o que acontece no céu (cometa, star trails, constelação, versão de dia). → Nosso coringa: céu do sul com palmeiras/araucária/mandacaru.
4. **Cortes secos só em 2 lugares**: (a) no pico emocional nacional (bandeira: corte para zoom e corte de volta) e (b) na revelação final ("sem vida complexa"). Todo o resto é dissolve.
5. **Movimento segue a emoção**: minutos 1-3 (fatos próximos) são os mais calmos; o pico de movimento é a sequência emocional do minuto 6, não a abertura inteira.
6. **Infográficos recorrentes**: (a) linha amarela fina com ponto brilhante + valor no ponto + fonte minúscula; (b) barra vertical de probabilidade que sobe/desce; (c) mira circular em volta do alvo; (d) grade de pontos para "sua vida em meses"; (e) rótulos finos colados aos objetos (nome + subtítulo de uma linha); (f) setas paralelas para deslocamento de continente; (g) pinos de cidade com nome em caixa alta pequena.
7. **Cores com significado na referência** (para NÃO copiar, mas entender): branco = informação; amarelo/dourado = impacto; **verde = alívio/boa notícia** ("A LUA ESCAPA", "LONGE DEMAIS PARA NOS FAZER MAL"); coral = perigo/fenda; azul-claro = dado secundário ("10,2 BI EM 2100", "NUVEM DE OORT"). No Brasil Milenar mantemos a paleta do `01` (verde-água = impacto/emoção, coral = perigo, azul = dado, dourado = tempo/identidade).
8. **Contador**: aparece em ~15 paradas, não em todas; some depois de poucos segundos; na abertura gira de trás pra frente (1 bilhão → 0) — mostra a escada antes de subir.
9. **Etiqueta inferior esquerda** usa frases de virada de vez em quando ("CHEGAMOS / 1 BILHÃO DE ANOS", "UMA NOVA ESTRELA POLAR / 12 MIL ANOS"), não só lugar/data.
10. **Fecho**: contador grande central → tudo escurece → selo animado com clique em "INSCRITO" + sininho. Sem cartão final de vídeo sugerido.
11. **Defeito para evitar**: aos 8:40 um dissolve longo deixa 3 linhas de texto empilhadas por cima de outra cena (texto da cena que sai + da que entra). Regra: palavras-chave da cena anterior saem ANTES do dissolve começar.

## Como refazer esta análise em outro vídeo
```bash
# folhas de contato (1 quadro a cada 8 s, 4x4, com tempo)
ffmpeg -i ref.mp4 -vf "fps=1/8,scale=480:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6,tile=4x4" -q:v 4 sheet_%02d.jpg
# loudness
ffmpeg -i ref.mp4 -vn -af ebur128=framelog=quiet -f null -
# quadros cinza pequenos para medir movimento/cortes em numpy
ffmpeg -i ref.mp4 -vf fps=10,scale=160:90,format=gray -f rawvideo g.raw
```
Em numpy: diferença absoluta média entre quadros seguidos > 25 = corte seco; diferença numa janela de 1 s > 18 = troca grande de cena (dissolve); < 0,6 = quadro quase parado.
