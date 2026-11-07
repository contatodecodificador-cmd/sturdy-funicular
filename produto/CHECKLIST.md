# Checklist do Estúdio do Nogueira

Atualizado em 07/11/2026. ✅ pronto · ⏳ esperando o dono / o lançamento

**Situação:** tudo pronto e no ar em https://estudiodonogueira.netlify.app, com as **vendas desligadas**
e a página **fora do Google**, esperando os resultados reais dos canais (5 a 10 dias). O passo a passo do
lançamento está em `LANCAMENTO.md`.

## Os produtos (Cakto) · `cakto.md`

- ✅ Completo R$ 67 · https://pay.cakto.com.br/34jdugf
- ✅ Só o guia R$ 27 · https://pay.cakto.com.br/sc7ng7g
- ✅ Só a skill R$ 47 · https://pay.cakto.com.br/5j8pjnu
- ✅ Caça-Ideias R$ 17 · extra (order bump) nos 3 checkouts
- ✅ Webhook de compra aprovada, reembolso e chargeback → site (testado: 200)

## Página de venda · `pagina/index.html`

- ✅ Visual escuro, névoa, bairro com a torre, personagem que se monta
- ✅ Nome Estúdio do Nogueira; os dois canais como modelo (Contos do Vigia e O Tempo Parou)
- ✅ Nicho livre, voz livre, roda na nuvem, preços em 3 opções, sem prazo de reembolso na página
- ✅ Sem números, depoimentos ou promessa de ganho
- ✅ Links de checkout no código, desligados (`VENDAS_ABERTAS = false`)
- ✅ Seção de resultados pronta e escondida (`RESULTADOS = null`)
- ⏳ Preencher os resultados reais e ligar as vendas no lançamento

## A skill · `entrega/estudio/`

- ✅ 9 comandos: `/comecar`, `/serie`, `/visual`, `/roteiro`, `/voz`, `/montar`, `/postar`, `/proxima`, `/seguir`
- ✅ Todos testados com a série "O Elevador das Seis" (romance), do perfil do canal ao resultado da votação
- ✅ Personagem-base com peças extras; câmera, legenda, etiqueta, cartão da escolha, capa e Stories prontos
- ✅ Ferramentas: tempos da voz, efeitos do zero, mixagem com as regras de volume, folha de quadros

## O extra Caça-Ideias · `entrega/extra-ideias/`

- ✅ Comando `/ideias` (pesquisa testada na nuvem, 10 ideias no formato certo)

## O guia · `guia/`

- ✅ Caderno 0 (antes de começar) e Cadernos 1 a 6, com pedidos prontos para colar no Claude
- ✅ Diário de produção (O Bunker, O Tempo Parou, O Elevador das Seis)
- ✅ Modelos para preencher

## A Área do Estúdio e o login · `area/` e `site/`

- ✅ Início, guia, passo a passo (10 passos) e extra, separados por produto, com cadeado e "Liberar"
- ✅ Login com e-mail + número do pedido da Cakto (sem domínio e sem serviço de e-mail)
- ✅ Porteiro: sem login não abre nada; cada produto abre só a sua parte
- ✅ Testado de ponta a ponta: skill, guia, extra, aviso repetido, reembolso e sair
- ✅ Trava de segurança: se a Área abrir sem login, ela sai do ar sozinha na hora de publicar

## No dia do lançamento · `LANCAMENTO.md`

- ⏳ Resultados reais na página
- ⏳ Ligar as vendas e tirar a página do "fora do Google"
- ⏳ Publicar com `bash produto/site/publicar-tudo.sh`
- ⏳ Compra de teste de verdade (guia, R$ 27) e reembolso
