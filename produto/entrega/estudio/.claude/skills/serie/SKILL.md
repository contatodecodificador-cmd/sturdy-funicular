---
name: serie
description: Passo 4 do Estúdio do Nogueira. Transforma uma ideia no mundo da série (premissa, personagens, regras, mistério, resposta e o plano das partes). Use quando a pessoa digitar /serie ou quiser começar uma série nova.
---

# /serie: o mundo da série

Fale em português do Brasil, simples. Uma etapa por vez, dizendo "Etapa X de 4". Siga sempre
`canal/CANAL.md` (nicho, público, clima, limites).

## Etapa 1 de 4: a ideia

- Se existir `canal/ideias/serie-escolhida.md` (vem do comando `/ideias`), resuma a ideia e pergunte se
  é ela que vamos fazer.
- Se não existir, peça a ideia em uma ou duas frases. Se a pessoa não tiver nenhuma, proponha 3 ideias
  curtas que sigam o canal e deixe ela escolher. Não decida por ela.

## Etapa 2 de 4: as perguntas que dão forma

Faça uma pergunta por vez, sempre com uma sugestão sua para a pessoa só dizer "pode ser":
1. Quem é a personagem principal? (nome, idade, o que faz, o jeito dela)
2. O que ela quer, e o que atrapalha?
3. Qual é o mistério ou a grande dúvida da série? E qual é a resposta? (a resposta fica guardada; o
   público só descobre no fim)
4. Quantas partes? (sugira de 3 a 6 para a primeira série)
5. Como vai ser a votação? (duas opções curtas no fim de cada parte, ou pergunta aberta no começo)

## Etapa 3 de 4: o documento do mundo

Crie a pasta `series/<nome-da-serie-sem-espacos>/` e o arquivo `MUNDO.md` com:
- **A série em uma frase.**
- **O que só ela tem**: 2 ou 3 detalhes que tornam a série única (não pode ser ideia genérica).
- **Personagens**: nome, idade, jeito e a **marca de longe** de cada um (uma cor, uma peça de roupa,
  um objeto que nunca muda). No máximo 3 personagens fixos na primeira série.
- **Regras do mundo**: o que pode e o que nunca acontece nesta história.
- **O detalhe escondido**: uma pista que aparece desde a parte 1 e só faz sentido no final.
- **O mistério e a resposta.**
- **O plano das partes**: uma linha por parte, com a escolha do público no fim de cada uma. Diga onde os
  caminhos se separam e onde voltam a se juntar, para a série não virar uma árvore impossível de fazer.
- **Lugares**: os cenários que a série vai usar (poucos: cada cenário novo é trabalho novo).

Mostre um resumo curto e peça a aprovação. Ajuste até a pessoa aprovar.

## Etapa 4 de 4: guardar

1. Marque no topo do `MUNDO.md`: "Aprovado em <data>".
2. Atualize `canal/ESTADO.md`: último passo `/serie`, série atual, pasta da série, parte atual 1,
   próximo passo `/visual`.
3. Faça um commit "Série <nome>: mundo aprovado" e envie para o GitHub.
4. Diga que o próximo passo é dar cara aos personagens e lugares com `/visual` (ou `/seguir`).
