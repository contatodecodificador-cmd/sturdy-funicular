---
name: montar
description: Passo 8 do Estúdio do Nogueira. Monta o vídeo da parte com o Remotion (cenas, câmera, legenda, sons e mixagem), confere tudo numa folha de quadros e gera o arquivo final. Use quando a pessoa digitar /montar ou quiser gerar ou corrigir o vídeo.
---

# /montar: o vídeo

Fale em português do Brasil, simples. "Etapa X de 5". Aqui quem trabalha é você: a pessoa só olha e
aprova. Leia `ESTILO.md`, `PERSONAGENS.md`, o `ROTEIRO.md` (com o quadro de cenas) e o `tempos.json`
da parte atual.

Formato: vertical, 1080 x 1920, 30 quadros por segundo. Código em `src/series/<serie>/`.

## Etapa 1 de 5: as peças (só na primeira vez de cada série)

Se ainda não existirem em `src/series/<serie>/` (ou em `src/comum/` para servir a todas as séries),
escreva do zero:
- **Câmera**: envolve a cena e faz zoom lento contínuo (nenhuma cena fica parada) e um "soco" rápido de
  zoom nos momentos fortes. Nunca deixa aparecer a borda do cenário.
- **Letra**: use a fonte instalada no `/visual` (pacote `@fontsource`). Se ela não aparecer na folha
  de quadros, instale e importe antes de seguir.
- **Legenda**: palavra por palavra, de 2 a 3 palavras na tela por vez, cada uma entrando no instante em
  que é falada (vem do `tempos.json`). A palavra importante de cada frase ganha a cor de destaque do
  `ESTILO.md`. Letra grande, com contorno para ler em qualquer fundo.
- **Elementos de tela**: etiqueta de lugar e hora, cartão com número, ficha, seta. Etiqueta que aponta
  para uma coisa fica presa no cenário (anda com a câmera), nunca solta na tela.
- **Cartão da escolha**: as duas opções no fim, com um relógio de contagem.

## Etapa 2 de 5: as cenas

1. Crie `src/series/<serie>/parte-NN.tsx`: uma cena por frase, começando na primeira palavra da frase
   (use o `tempos.json`), com o cenário, os personagens (a boca mexe enquanto falam e eles piscam),
   a câmera e os elementos do quadro de cenas.
2. Registre a composição em `src/Raiz.tsx`, com a duração igual à da voz mais 1 segundo.
3. Regras de tela: a legenda **nunca cobre um rosto** (coloque o personagem de um lado e a legenda do
   outro) e nada importante nas zonas proibidas (380 px de baixo, 140 px de cima, 140 px da direita).

## Etapa 3 de 5: o som

1. **Efeitos**: crie os sons do zero com Python (por exemplo `numpy` e `scipy`), em
   `src/series/<serie>/sons/`: batida, passo, porta, sino, ambiente… Todo elemento que entra na tela
   ganha um efeito curto, preso à palavra em que ele aparece.
2. **Regras que protegem o ouvido de quem assiste:**
   - nada de som grave contínuo (zumbido): depois do volume final ele vira chiado no celular. Grave só
     em batida curta, e corte tudo abaixo de uns 40 Hz;
   - meça o volume com todas as frequências e deixe cada efeito **uns 15 dB abaixo da voz**;
   - som de fundo contínuo, se houver, bem mais baixo (uns 25 dB abaixo da voz).
3. **Mixagem** com o `ffmpeg`: voz por cima, efeitos e ambiente por baixo, volume final entre -14 e
   -11 LUFS e pico abaixo de -1 dB. Salve em `partes/parte-NN/audio-final.mp3` e use no vídeo.
4. Música é opcional: só com licença que permita uso nas redes (a pessoa confirma a licença).

## Etapa 4 de 5: conferir antes de gerar

1. Gere uma **folha de quadros**: uma imagem por cena (o quadro do meio de cada uma), juntas numa
   grade. Olhe você mesmo e confira:
   - nenhuma cena escura virou mancha preta (se virou, ponha um ponto de luz);
   - a legenda não cobre rosto e está fora das zonas proibidas;
   - nada some atrás de outra coisa e a câmera não mostra a borda do cenário;
   - o personagem é o mesmo em todas as cenas (rosto, cores, marca de longe).
2. Mostre a folha à pessoa e corrija o que ela pedir.

## Etapa 5 de 5: gerar e guardar

1. Gere o vídeo: `npx remotion render src/index.ts <Composição> saida/<serie>-parte-NN.mp4`.
2. Ouça o começo e o fim do áudio final e confira o volume. Mande o vídeo para a pessoa.
3. Com a aprovação: atualize `canal/ESTADO.md` (último passo `/montar`, próximo `/postar`), commit
   "Série <nome>, parte NN: vídeo" e envie (a pasta `saida/` não vai para o GitHub; o código e o
   áudio vão).
4. Diga que o próximo passo é preparar a postagem com `/postar` (ou `/seguir`).
