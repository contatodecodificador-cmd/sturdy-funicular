# 01 — Estilo e sistema de edição

## A análise do vídeo de referência (quadro a quadro)
Vídeo: "O que vai acontecer daqui a 1 bilhão de anos?" (Além da Escala), 11:01, 720p30 analisado (19.825 quadros), subido originalmente em 1440p60.

| Medida | Resultado | Significado |
|---|---|---|
| Cortes secos | 3 em 11 min (6:14, 6:37, 10:18) | Trocas por dissolve/fade; corte seco só no pico emocional e na revelação final |
| Trocas grandes de cena | ~47 | Cada cena dura ~14 s em média |
| Quadros quase parados | 55% | Câmera lenta (push-in/drift suave) |
| Movimento nos primeiros 30 s | 2 a 5x maior | A abertura é a parte mais agitada |
| Texto novo na tela | a cada ~3-5 s | É o texto que segura a atenção, não o corte |
| Narração | ~170 palavras/min | Ritmo firme |
| Loudness | -13,7 LUFS integrado | Bom para YouTube |
| Música | baixíssima, quase some nas pausas | Voz manda |

Conclusão: **o vídeo NÃO é feito com imagens de IA nem banco de vídeo**. É motion graphics 2D/2.5D limpo, provavelmente gerado por código (houve um texto sobreposto a outro aos 3:15, erro típico de animação programática). Só a thumbnail usa imagem de IA.

## Os 6 elementos visuais fixos (versão Brasil Milenar)
1. **Contador no topo, centralizado** — caixa escura arredondada com borda fina dourada: `0.000.001.000` + legenda pequena espaçada `ANOS NO FUTURO` (ou `ANOS NO PASSADO`, `METROS DE PROFUNDIDADE`, `KM PERCORRIDOS`, conforme o vídeo). Zeros à esquerda em cinza apagado, dígitos significativos em branco. Os dígitos **giram** (efeito odômetro) ao entrar numa parada nova e o contador some depois de ~4 s.
2. **Etiqueta no canto inferior esquerdo** — linha pequena em caixa alta espaçada, cinza (ex.: `FERNANDO DE NORONHA`) + linha grande em negrito branca (ex.: `HOJE`, `1 MILHÃO DE ANOS`). Abre cada parada.
3. **Palavra-chave no topo-centro** — 1 a 4 palavras da frase narrada, aparecendo junto com a fala (não é legenda). Fade + leve subida (8-12 px), some depois de 3-4 s. Cores com significado fixo:
   - BRANCO `#F2F4F8` = informação
   - VERDE-ÁGUA `#3DDBB4` = frase de impacto/emoção (no canal de referência era amarelo — trocamos para diferenciar)
   - CORAL `#FF7A59` = perigo/risco
   - AZUL-CLARO `#7CC4FF` = dado secundário/fonte
   - DOURADO `#E3B04B` = marcas de tempo e identidade
4. **Gráficos simples** — linha fina com ponto brilhante e `FONTE: ...` pequena no canto; barras verticais de faixa (mín–máx); mapas em traço (litoral dourado fino sobre fundo escuro, terra em tom terroso discreto); círculos/miras finos ao redor de alvos; setas de deslocamento.
5. **Ilustração** — vetorial simples ou 2.5D (planetas com textura, globo, cortes geológicos em camadas, ilha vulcânica em corte, régua de profundidade). Sempre sóbrio.
6. **Cenários reaproveitados** — o mesmo céu estrelado com nebulosa azul/verde-petróleo (no de referência era roxa), silhueta de vegetação brasileira (palmeiras, mandacaru, araucária) para cenas "olhando o céu daqui". Reaproveitar dá identidade e barateia.

## Tipografia e paleta
- Títulos/números: **Oswald** (condensada, negrito, caixa alta). Rótulos pequenos: **Inter** (caixa alta, espaçamento 0,25em). (Referência usava algo como Barlow Condensed — não usar para diferenciar.)
- Fundo: azul-marinho profundo `#060A14` → `#0B1428`, vinheta suave nas bordas.
- Destaques quentes só em pontos de luz (Sol, lava, cidades).

## Ritmo e transições
- Cada parada = 1 cena principal (12-30 s) com 2-4 "batidas" de texto.
- Transição entre paradas: dissolve de 0,5-0,8 s ou fade pelo preto; corte seco só em momentos de impacto (máx. 1 por ato).
- Movimento de câmera: push-in de 3-6% ao longo da cena ou drift lateral lento. Nada de zoom brusco, shake, glitch ou flash.
- **REGRA DO ZOOM (dono, nov/2026, obrigatória):** plano de no máximo 5 s. Se a imagem é PARADA, ela leva UM zoom leve e contínuo do primeiro ao último quadro do plano: nunca para no meio, nunca volta. Se o plano JÁ TEM MOVIMENTO (globo girando, câmera 3D andando, nuvem crescendo, animação), ele fica SEM zoom. Um plano nunca combina dois zooms.
- Abertura (0-30 s): mais movimento e cortes mais curtos (3-5 s).
- Viradas de ato: contador acelera (gira rápido de milhar em milhar, depois de milhão em milhão) + 1 s de quase silêncio.
- Final: contador grande no centro + selo do canal com botão "INSCREVER-SE" no canto inferior esquerdo (últimos 8-10 s).

## Áudio na edição
- Voz em primeiro plano. Loudness final do vídeo: **-14 LUFS integrado**, pico -1 dBTP.
- Música: -24 a -28 dB abaixo da voz (sidechain/ducking suave); sobe um pouco nas pausas e nas viradas.
- Efeitos: sempre sutis (-18 a -26 dB): tic-tic baixinho do contador, whoosh macio nas viradas, "pop" leve em palavras-chave de impacto, grave distante em impactos. Nunca em toda palavra.
