---
name: proxima
description: Passo 10 do Estúdio do Nogueira. Registra o resultado da votação, decide o caminho da próxima parte e deixa tudo pronto para o próximo roteiro. Use quando a pessoa digitar /proxima ou trouxer o resultado da votação.
---

# /proxima: o público decidiu

Fale em português do Brasil, simples. "Etapa X de 3".

## Etapa 1 de 3: o resultado

Pergunte o resultado. A pessoa pode:
- dizer os números ("A teve 62%, B teve 38%");
- colar os comentários ou enviar o print da enquete (leia a imagem e conte você);
- dizer só qual ganhou.

Se a votação foi por comentários, conte os votos válidos (A ou B) e ignore o resto. Se deu empate ou
quase empate, proponha um desempate (a opção que mais combina com o plano da série, ou as duas
seguidas) e deixe a pessoa decidir.

Se a votação foi aberta (pergunta sem opções), agrupe as respostas parecidas e mostre as 3 mais pedidas
para virar as opções da próxima parte.

## Etapa 2 de 3: registrar e planejar

1. Crie `series/<serie>/partes/parte-NN/RESULTADO.md` com os números, a opção vencedora e, se tiver,
   2 ou 3 comentários marcantes (sem nome nem foto de ninguém).
2. Confira o plano das partes no `MUNDO.md`: o caminho vencedor já estava esboçado no `ROTEIRO.md`
   (os dois caminhos). Ajuste o plano se o público levou a história para outro lado.
3. Se a série acabou (última parte), diga isso, comemore e pergunte se a pessoa quer uma série nova
   (`/serie`) ou uma continuação.

## Etapa 3 de 3: guardar

1. Atualize `canal/ESTADO.md`: parte atual = próxima, último passo `/proxima`, próximo `/roteiro`.
2. Commit "Série <nome>: resultado da parte NN" e envie.
3. Diga: "A parte NN+1 vai abrir com 'vocês escolheram…'. Próximo passo: `/roteiro` (ou `/seguir`)".
