---
name: montar
description: Passo 8 do Estúdio do Nogueira. Monta o vídeo da parte com o Remotion (cenas, câmera, legenda, sons e mixagem), confere tudo numa folha de quadros e gera o arquivo final. Use quando a pessoa digitar /montar ou quiser gerar ou corrigir o vídeo.
---

# /montar: o vídeo

Fale em português do Brasil, simples. "Etapa X de 5". Aqui quem trabalha é você: a pessoa só olha e
aprova. Leia `ESTILO.md`, `PERSONAGENS.md`, o `ROTEIRO.md` (com o quadro de cenas) e o `tempos.json`
da parte atual.

Formato: vertical, 1080 x 1920, 30 quadros por segundo. Código em `src/series/<serie>/`.

## As peças e ferramentas prontas (use, não reescreva)

- `src/comum/Camera.tsx`: zoom lento contínuo, "socos" de zoom e ponto de foco. Nunca mostra a borda.
- `src/comum/Legenda.tsx`: legenda palavra por palavra a partir do `tempos.json`, até 3 palavras por vez,
  com as palavras importantes em destaque e a altura escolhida por cena.
- `src/comum/Pecas.tsx`: `Etiqueta` (pílula com texto) e `CartaoEscolha` (as duas opções e o relógio).
- `ferramentas/sons.py`: cria os efeitos do zero em `public/sons/` (clique, batida, sino, pop, whoosh,
  passo, porta, tique, ambiente). Efeito novo: escreva uma função nova no mesmo arquivo.
- `ferramentas/mixar.py`: mixa voz, efeitos e ambiente com as regras de volume.
- `ferramentas/folha.py`: a folha de quadros, com as zonas proibidas marcadas em vermelho.

## Etapa 1 de 5: as cenas

1. Copie o `tempos.json` da parte para `src/series/<serie>/tempos-parte-NN.json` e importe no código.
2. Crie `src/series/<serie>/parte-NN.tsx`: uma `Sequence` por cena, começando no início da cena (do
   `tempos.json`), cada uma dentro de uma `Camera`, com o cenário, os personagens (a boca mexe enquanto
   falam e eles piscam) e as peças do quadro de cenas. Por cima de tudo, a `Legenda` e o `Audio` com o
   som final.
3. Registre a composição em `src/Raiz.tsx`, com a duração da voz mais 1 segundo.
4. Regras de tela: a legenda **nunca cobre um rosto** (escolha a altura dela em cada cena) e nada
   importante nas zonas proibidas (380 px de baixo, 140 px de cima, 140 px da direita). Etiqueta e
   legenda não podem encostar uma na outra.

## Etapa 2 de 5: o som

1. Rode `python3 ferramentas/sons.py` (uma vez por série, ou quando criar efeito novo).
2. Escreva `partes/parte-NN/SOM.json` com o ambiente e os efeitos, cada um preso a uma palavra, a uma
   cena ou a um segundo (o formato está no topo do `ferramentas/mixar.py`). Todo elemento que entra na
   tela ganha um efeito curto.
3. Rode `python3 ferramentas/mixar.py series/<serie>/partes/parte-NN`. Ele deixa a voz em -16 LUFS,
   cada efeito uns 15 dB abaixo da voz, o ambiente uns 25 dB abaixo, corta o grave abaixo de 40 Hz e
   entrega o final em -14 LUFS com pico abaixo de -1,5 dB.
4. Copie o `audio-final.mp3` para `public/<serie>/parte-NN/` e use no `Audio` da composição.
5. Música é opcional: só com licença que permita uso nas redes (a pessoa confirma a licença).

## Etapa 3 de 5: conferir antes de gerar

1. Rode `python3 ferramentas/folha.py <Composição> series/<serie>/partes/parte-NN` e olhe a folha:
   - nenhuma cena escura virou mancha preta (se virou, ponha um ponto de luz);
   - legenda fora dos rostos, sem encostar em etiqueta e fora das faixas vermelhas;
   - nada cortado, sumindo atrás de outra coisa ou mostrando a borda do cenário;
   - os personagens iguais em todas as cenas.
2. Corrija e gere a folha de novo até ficar limpa. Mostre a folha à pessoa e ajuste o que ela pedir.

## Etapa 4 de 5: gerar

1. `npx remotion render src/index.ts <Composição> saida/<serie>-parte-NN.mp4`
2. Confira o volume do vídeo pronto (`ffmpeg -i <vídeo> -af loudnorm=print_format=summary -f null -`):
   entre -15 e -11 LUFS. Mande o vídeo para a pessoa.

## Etapa 5 de 5: guardar

1. Com a aprovação: atualize `canal/ESTADO.md` (último passo `/montar`, próximo `/postar`), commit
   "Série <nome>, parte NN: vídeo" e envie (a pasta `saida/` não vai para o GitHub; o código e o
   áudio vão).
2. Diga que o próximo passo é preparar a postagem com `/postar` (ou `/seguir`).
