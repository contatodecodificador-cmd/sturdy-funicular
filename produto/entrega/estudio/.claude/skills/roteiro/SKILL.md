---
name: roteiro
description: Passo 6 do Estúdio do Nogueira. Escreve o roteiro de uma parte da série, as opções de abertura e os dois caminhos da votação, e prepara o quadro de cenas. Use quando a pessoa digitar /roteiro ou quiser escrever uma parte.
---

# /roteiro: a parte da série

Fale em português do Brasil, simples. "Etapa X de 4". Leia `canal/CANAL.md`,
`series/<serie>/MUNDO.md`, `ESTILO.md`, `PERSONAGENS.md` e, se não for a parte 1, o roteiro e o
resultado da votação da parte anterior (`partes/parte-NN/RESULTADO.md`).

## Etapa 1 de 4: combinar a parte

Em 3 linhas, diga o que esta parte precisa fazer (segundo o plano do `MUNDO.md` e o voto do público) e
pergunte se a pessoa quer mudar alguma coisa. Combine a duração: de 40 a 90 segundos. Conte cerca de
2,5 palavras por segundo de narração.

## Etapa 2 de 4: escrever

Escreva o roteiro em **frases curtas, uma por cena**, para ser narrado em voz alta. O desenho da parte:

1. **Abertura (0 a 3 s):** uma frase que faz a pessoa parar de rolar a tela. Algo estranho, engraçado
   ou impossível, já no primeiro segundo. Escreva **duas versões** para a pessoa escolher.
   - Da parte 2 em diante, a abertura lembra a escolha do público ("Vocês escolheram…").
2. **Subida:** cada frase traz uma informação nova e aumenta a tensão (ou a graça). Plante uma pista do
   detalhe escondido. Nada de frase que só enfeita.
3. **Virada:** depois de uma pausa curta, a informação que muda tudo.
4. **Escolha:** termina com a pergunta e as duas opções curtas (uma ou duas palavras cada), e chama para a
   próxima parte.

Regras:
- Fale como gente fala. Leia em voz alta na cabeça: se travar, reescreva.
- Cuidado com palavras de mesmo som que mudam o sentido na voz ("cem" e "sem", "concerto" e "conserto").
  Troque por outra.
- Siga os limites do canal. Nada de pessoa ou marca real.

Mostre o roteiro numa tabela: número, frase, o que aparece na cena. Ajuste até aprovar.

## Etapa 3 de 4: os dois caminhos

Para cada opção da escolha, escreva em 4 a 6 linhas o que acontece na próxima parte se ela ganhar.
Mostre onde os dois caminhos voltam a se juntar (segundo o plano do `MUNDO.md`). Assim, qualquer
resultado da votação já tem continuação pronta.

## Etapa 4 de 4: o quadro de cenas e guardar

1. Crie `series/<serie>/partes/parte-NN/ROTEIRO.md` com: a abertura escolhida, a tabela final, a escolha
   e os dois caminhos.
2. Crie também o **quadro de cenas** nesse arquivo: para cada frase, o cenário, o personagem e a
   expressão, o movimento de câmera, o que entra na tela (etiqueta, objeto, número) e o som.
   Todo elemento que entra na tela ganha um efeito sonoro curto.
3. Se precisar de cenário ou personagem novo, avise: ele precisa passar pelo `/visual` antes.
4. Atualize `canal/ESTADO.md` (último passo `/roteiro`, próximo `/voz`), faça o commit
   "Série <nome>, parte NN: roteiro" e envie.
5. Diga que o próximo passo é a narração com `/voz` (ou `/seguir`).
