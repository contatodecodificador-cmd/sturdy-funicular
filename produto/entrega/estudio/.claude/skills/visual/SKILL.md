---
name: visual
description: Passo 5 do Estúdio do Nogueira. Define o estilo visual da série, cria os personagens a partir do personagem-base e desenha os cenários, com folhas de design para aprovar. Use quando a pessoa digitar /visual ou quiser criar ou mudar personagens e cenários.
---

# /visual: personagens e cenários

Fale em português do Brasil, simples. Uma etapa por vez ("Etapa X de 4"). **Mostre tudo como imagem**:
a pessoa aprova vendo, não lendo código. Leia `canal/CANAL.md` e `series/<serie>/MUNDO.md`.

## Etapa 1 de 4: o estilo da série

1. Proponha **3 direções** de estilo bem diferentes entre si, cada uma com: nome, clima, 5 cores com
   código, tipo de luz (dia, fim de tarde, noite…), letra da legenda (fonte livre do Google Fonts) e o
   ritmo (calmo ou acelerado).
2. Faça uma prancha de cada direção: uma imagem vertical 1080 x 1920 com o fundo, as cores, um título
   na letra escolhida e o personagem-base vestido no estilo. Gere com o Remotion (`npx remotion still`)
   e mostre as três.
3. A pessoa escolhe (ou mistura). Escreva `series/<serie>/ESTILO.md` com tudo o que foi decidido e
   as cores em `src/series/<serie>/estilo.ts`.

**A letra precisa ser instalada**, senão o vídeo sai com uma letra comum. Instale a fonte escolhida
como pacote (`npm install @fontsource/<nome-da-fonte>`, por exemplo `@fontsource/anton`) e importe no
`estilo.ts` da série (`import "@fontsource/anton";`). Confira na prancha se a letra certa apareceu.

## Etapa 2 de 4: os personagens

O ponto de partida é o componente `src/personagem/PersonagemBase.tsx`. Ele é **de busto** (cabeça e
ombros, no espaço de 320 x 336) e aceita: cor da pele, tipo e cor do cabelo, roupa e cor, acessório e
cor, expressão, a boca falando e o piscar. Leia o arquivo para ver as opções. Pense as cenas com
personagens de busto: conversa, reação, olhar; para mostrar o corpo inteiro, crie um corpo novo.

Para cada personagem do `MUNDO.md`:
1. Pergunte, uma coisa por vez e sempre com sugestão: pele, cabelo, roupa, a **marca de longe** e
   as expressões que a série vai pedir.
2. Se o personagem precisar de algo que o base não tem (fone, cachecol, barba, avental, uniforme),
   **crie uma peça nova** em `src/personagem/extras.tsx`, em SVG, no mesmo espaço de 320 x 336 (as
   medidas de referência estão no topo do `PersonagemBase.tsx`), e passe pela propriedade `frente`
   (por cima do personagem) ou `atras` (por trás). Exemplo: `<PersonagemBase frente={<Fone />} />`.
   Nunca copie personagem, logotipo ou visual de outra obra.
3. Faça a **folha de design**: uma imagem com o personagem de frente, as expressões lado a lado e o nome
   e as cores escritos. Salve em `series/<serie>/folhas/<nome>.png` e mostre.
4. Ajuste até a pessoa aprovar.

Guarde tudo em `series/<serie>/PERSONAGENS.md` (as escolhas de cada um, com os códigos de cor) e o
código de cada personagem em `src/series/<serie>/personagens.tsx`.

## Etapa 3 de 4: os cenários

Para cada lugar do `MUNDO.md`:
1. Desenhe o cenário como componente em `src/series/<serie>/cenarios.tsx` (formas simples em SVG ou
   React, no estilo escolhido).
2. Regras que evitam problemas:
   - **Cena escura nunca é preto chapado.** Sempre tem um ponto de luz (uma janela, uma luminária, uma
     faixa de luz no chão) e o personagem se destaca do fundo. No celular, preto chapado vira mancha.
   - Deixe espaço para a legenda e respeite as **zonas proibidas** da tela: nada importante nos 380 px
     de baixo, nos 140 px de cima e nos 140 px da direita (é onde ficam os botões das redes).
   - Nenhuma marca, logotipo ou pessoa real.
3. Faça uma folha com cada cenário e os personagens dentro dele, no tamanho em que vão aparecer nos
   vídeos. Confira se ninguém sai da tela nem entra nas zonas proibidas. Mostre e ajuste.

## Etapa 4 de 4: guardar

1. Atualize `canal/ESTADO.md`: último passo `/visual`, próximo passo `/roteiro`.
2. Commit "Série <nome>: estilo, personagens e cenários" e envie para o GitHub.
3. Diga que o próximo passo é o roteiro da parte 1 com `/roteiro` (ou `/seguir`).
