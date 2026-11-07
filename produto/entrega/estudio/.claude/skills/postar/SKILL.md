---
name: postar
description: Passo 9 do Estúdio do Nogueira. Prepara tudo para postar a parte: capa, Stories, Stories da enquete, legendas do post para cada rede e a ordem de postagem. Use quando a pessoa digitar /postar ou o vídeo estiver pronto.
---

# /postar: tudo pronto para publicar

Fale em português do Brasil, simples. "Etapa X de 3". Você prepara; quem posta é a pessoa. Leia
`canal/CANAL.md` (redes) e o `ROTEIRO.md` da parte.

## Etapa 1 de 3: as imagens

Gere com o Remotion e mostre:
1. **Capa** (1080 x 1920, imagem parada): o personagem principal, o título curto da parte e o número
   da parte. O título e o rosto ficam no miolo da imagem, porque a grade do perfil corta as bordas.
2. **Stories de chamada** (vídeo de 10 a 15 s): um trecho forte da parte com a voz e "parte nova no ar".
   Normalize o volume como no vídeo.
3. **Stories da enquete** (imagem parada): a pergunta e as duas opções, com uma área vazia no meio para
   a pessoa colar o adesivo de enquete da própria rede.

Salve em `saida/<serie>-parte-NN/`. (Elementos que entram animados numa imagem parada precisam já estar
visíveis no quadro escolhido; confira a imagem antes de mostrar.)

## Etapa 2 de 3: os textos

Crie `series/<serie>/partes/parte-NN/POST.md` com, para cada rede do canal:
- a legenda do post (curta, com o gancho na primeira linha e o pedido de voto: "comenta A ou B");
- de 5 a 10 hashtags do nicho, sem hashtag enganosa;
- o lembrete de **ligar o rótulo de conteúdo feito com IA**;
- o melhor horário segundo o público do `CANAL.md` (diga que é uma sugestão e que vale testar).

Na parte 1, inclua também uma sugestão de **bio do perfil** e o lembrete de fixar a parte 1 no topo.

## Etapa 3 de 3: a ordem e guardar

1. Escreva no `POST.md` a ordem de postagem: vídeo com a capa, Stories de chamada, Stories da enquete,
   e quando voltar para ver o resultado (por exemplo, 24 horas depois).
2. Mande para a pessoa os arquivos e os textos prontos para copiar.
3. Atualize `canal/ESTADO.md` (último passo `/postar`, próximo `/proxima`), commit
   "Série <nome>, parte NN: postagem" e envie.
4. Diga: "Quando a votação fechar, volte e digite `/proxima` (ou `/seguir`) com o resultado".
