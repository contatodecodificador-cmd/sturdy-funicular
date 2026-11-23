# Kit CapCut — Vídeo 7: O Que a MAIOR TEMPESTADE SOLAR da História Faria com o BRASIL

Tudo para remontar o vídeo do zero no CapCut. Duração final: **10:35** (635 s), **190 cenas**.

## O que tem no kit

| Pasta / arquivo | O que é |
|---|---|
| `01_imagens/` | 190 imagens LIMPAS (sem texto, sem relógio, sem vinheta), uma por cena, em ordem: `001_i01_...jpg`, `002_i02_...jpg`… |
| `02_clipes_3d/` | 61 vídeos 3D já animados, com o MESMO nome da cena. Nas cenas 3D, use o vídeo (a imagem é só referência). |
| `03_audio/1_narracao.mp3` | Narração completa. Começa em 0:00. |
| `03_audio/2_musica_completa.mp3` | Trilha inteira já montada (6 músicas com fades), já no volume certo. Começa em 0:00. |
| `03_audio/3_efeitos_completos.mp3` | Todos os 120 efeitos sonoros já posicionados. Começa em 0:00. |
| `03_audio/4_mix_final_referencia.mp3` | A mixagem pronta (narração + música + efeitos), só para conferir. |
| `03_audio/musicas_separadas/` | As 6 músicas soltas (m1 a m6), se quiser trocar ou reposicionar. |
| `03_audio/efeitos_separados/` | Os 24 efeitos soltos (clarão, impacto, tique, aurora, glitch…). |
| `cenas.csv` | Planilha (abre no Excel/Google Planilhas): cena, arquivo, início, fim, duração, o que aparece, movimento, texto na tela, relógio, efeitos e a fala de cada cena. |

## Montagem rápida (ordem)

1. Projeto **1920×1080, 30 fps**.
2. Coloque `1_narracao.mp3`, `2_musica_completa.mp3` e `3_efeitos_completos.mp3` em 0:00 (três trilhas de áudio). Volume 100% nas três: já estão balanceadas.
3. Coloque as cenas na ordem dos números (001, 002, 003…). Cada uma entra no **início** e sai no **fim** da planilha. Cenas 3D: arraste o `.mp4` de `02_clipes_3d` (ajuste a duração ao tempo da planilha).
4. Aplique o movimento de cada cena (regra abaixo).
5. Coloque os textos na tela, o relógio e os clarões (abaixo).
6. Por cima de tudo: vinheta e grão.
7. Exporte em 1080p, 30 fps.

## Estilo de edição (regras do canal)

**Ritmo**
- Corte **seco** entre todas as cenas (sem transição, sem fade). A única exceção são os 2 clarões brancos.
- Nenhuma cena passa de **5 segundos**. O corte acompanha a fala.

**Movimento**
- **Imagem (2D):** zoom leve **linear**, de 100% no primeiro quadro até 105% no último quadro da cena. É um só movimento contínuo: nunca dá zoom, para e dá zoom de novo. Keyframe de escala no início e no fim, curva **linear**.
- **Clipe 3D:** já tem movimento (globo girando, câmera andando). **Sem zoom** no CapCut.
- Nada de tremida, giro ou efeito "ken burns" diagonal.

**Texto na tela** (coluna "texto na tela", 24 cenas)
- No máximo um texto por cena, centralizado em cima (cerca de 150 px do topo).
- Fonte **Oswald Bold**, cerca de 56 px, branco `#F2F4F8`, todo em maiúsculas.
- Caixa escura semitransparente atrás (azul-marinho `#060A14`, ~80%), cantos arredondados, e um **traço dourado** `#E3B04B` embaixo do texto.
- Entra 0,25 s depois do início da cena: aparece subindo levemente com fade (animação "Fade in" + "Rise", ~0,35 s). Som: um "pop" baixinho (já está na trilha de efeitos).

**Relógio da contagem regressiva** (o fio condutor do vídeo)
- Caixinha no **canto superior direito**: fundo `#060A14` ~82%, cantos arredondados, bolinha piscando à esquerda.
- Rótulo pequeno: `CHEGADA DA NUVEM` (Inter Bold, ~15 px, espaçado). Número grande: Oswald Bold ~40 px.
- Valor de cada cena: coluna **"relógio"** da planilha. Na cena em branco, repita o valor da anterior.
- Aparece a partir de 0:04 e fica até o impacto (5:44). Some nas cenas do relógio de parede e da cartela final.
- Fica **branco** até 00:30:00 (cena das 5:29); dali até o fim fica **vermelho** `#FF5A3C`, com brilho.
- Nas últimas cenas o texto muda para `A LUZ DO SOL CHEGA` / `8:20 ATRASADO` em dourado `#E3B04B`.

**Clarões brancos**
- **0:26.4** (Terra e Sol: o clarão): tela branca a 95%, some em 0,6 s.
- **5:41.5** (impacto da nuvem): tela branca a 80%, some em 0,5 s.

**Acabamento (por cima de tudo, o vídeo todo)**
- **Vinheta** leve (bordas escurecidas ~35%).
- **Grão de filme** bem sutil (~6%).
- Cores do canal: azul-marinho `#060A14`, dourado `#E3B04B`, laranja do Sol `#FFB547`, vermelho de perigo `#FF5A3C`, azul de dado `#7CC4FF`, verde-aurora `#5CF2A0`.

**Áudio**
- Narração na frente. Música bem baixa (≈ −28 LUFS) e efeitos ainda mais sutis (≈ −31 LUFS), já nesses níveis nos arquivos.
- Se trocar a música: deixe ela cerca de 13 dB abaixo da voz e ligue a atenuação automática (ducking) do CapCut na trilha da música.
- Volume final do vídeo: −14 LUFS.

## Músicas (se for montar música por música)

| Arquivo | Entra | Sai | Bloco |
|---|---|---|---|
| m1_intro.mp3 | 0:00 | 1:27.6 | Introdução |
| m2_ondas.mp3 | 1:26.8 | 2:56 | As três ondas |
| m3_arquivo.mp3 | 2:54.2 | 5:36 | O arquivo |
| m4_impacto.mp3 | 5:34.6 | 7:40 | Impacto, hora a hora |
| m5_virada.mp3 | 7:37 | 9:21.5 | O ponto fraco |
| m6_fecho.mp3 | 9:19.5 | 10:35 | Pior caso e fecho |

Fade de entrada de 1 a 2,5 s e de saída de 1,5 a 3 s; as músicas se cruzam por ~1 s.

## Prompt para colar no GPT

> Você é editor de vídeo e vai me guiar, passo a passo, para montar no CapCut um vídeo de 10:35 do canal "Brasil Milenar". Vou te mandar a planilha `cenas.csv` (190 cenas) e este guia de edição. Regras: projeto 1920×1080 a 30 fps; três trilhas de áudio começando em 0:00 (narração, música completa, efeitos completos) com volume 100%; cada cena entra e sai exatamente nos tempos da planilha, com cortes secos; imagens 2D recebem um único zoom linear de 100% a 105% do primeiro ao último quadro; clipes 3D não recebem zoom; textos da coluna "texto na tela" em Oswald Bold, caixa escura com traço dourado, entrando 0,25 s após o início da cena; relógio no canto superior direito com os valores da coluna "relógio" (branco até 00:30:00, depois vermelho); clarões brancos em 0:26.4 e 5:41.5; vinheta leve e grão sutil por cima de tudo. Me guie bloco por bloco (Introdução, Bloco 1 a 5 e Fecho), dizendo quais arquivos arrastar, onde cortar e o que ajustar em cada cena.
