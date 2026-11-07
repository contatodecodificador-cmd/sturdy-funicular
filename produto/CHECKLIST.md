# Checklist do Estúdio do Nogueira

Atualizado em 07/11/2026. ✅ feito · 🟡 feito, falta testar ou decidir · ⬜ falta fazer

## 1. Os produtos

| Produto | Preço sugerido | Onde aparece | O que a pessoa recebe | Situação |
|---|---|---|---|---|
| Só o guia | R$ 27 | página de venda | a parte **Guia** da Área | ⬜ os cadernos do guia ainda não foram escritos |
| Só a skill | R$ 47 | página de venda | a parte **Passo a passo com os comandos** da Área | 🟡 pronto, falta testar os comandos |
| Estúdio completo | R$ 67 | página de venda (destaque) | Guia + Passo a passo | 🟡 depende dos dois acima |
| Caça-Ideias (extra) | R$ 17 | **só no checkout** | a parte **Extra** da Área | 🟡 pronto, testado até a etapa 3 de 5 |

## 2. Página de venda (`pagina/index.html`)

- ✅ Visual escuro "Vigia Noturno", fundo com névoa, silhueta do bairro e torre
- ✅ Nome Estúdio do Nogueira
- ✅ Os dois canais como modelo: Contos do Vigia (noite) e O Tempo Parou (dia), com as capas reais
- ✅ Seção "A ideia é sua" (qualquer nicho, tudo editável)
- ✅ Personagem-base que se monta sozinho
- ✅ Diário de O Bunker com os 4 erros (sem entregar o método)
- ✅ Ferramentas assinadas por fora e "não precisa de computador potente"
- ✅ Preços em 3 opções, sem prazo de reembolso na página
- ✅ Sem números, depoimentos ou promessa de ganho
- ✅ Links de checkout na página, desligados até o lançamento (`VENDAS_ABERTAS = false`)
- ⬜ Trocar "O Tempo Parou" pelo nome final do canal, se mudar
- ✅ Pacote pronto para arrastar no Netlify: `publicar/pagina-de-venda.zip` (veja `publicar/COMO-PUBLICAR.md`)
- ✅ No ar em https://estudiodonogueira.netlify.app (fora do Google até o lançamento). Republicar: `bash produto/publicar/publicar.sh`

## 3. A skill (os comandos, em `entrega/estudio/`)

- ✅ `/comecar`: monta o estúdio, vídeo de teste, chave da voz, perfil do canal (**testado** o projeto de vídeo)
- 🟡 `/serie`, `/visual`, `/roteiro`, `/voz`, `/montar`, `/postar`, `/proxima`, `/seguir`: escritos, **falta testar** com uma série de exemplo do começo ao fim
- ✅ Personagem-base em código (cabelos, roupas, acessórios, expressões, piscar, boca falando) e a folha de exemplo (**testado**)
- ✅ Memória do Claude (`CLAUDE.md`) e o arquivo "onde paramos" (`canal/ESTADO.md`)
- ✅ Passo a passo do comprador (`entrega/COMECE-AQUI.md`)
- ⬜ Testar o caminho inteiro com uma conta nova do GitHub, seguindo só a Área

## 4. O Caça-Ideias (`entrega/extra-ideias/`)

- ✅ Comando `/ideias` e instruções de instalação
- 🟡 Testado: pesquisa e as 10 ideias. Falta testar a lapidação e o salvamento (etapas 4 e 5)
- ⬜ Texto do checkout na Cakto (título e descrição já estão no `plano.md`)

## 5. O guia (para "só o guia" e o completo)

- ✅ Sumário dos 6 cadernos + diário + modelos (no `plano.md` e na Área)
- ⬜ Escrever o Caderno 1 · O seu canal
- ⬜ Escrever o Caderno 2 · A série
- ⬜ Escrever o Caderno 3 · O roteiro
- ⬜ Escrever o Caderno 4 · A voz
- ⬜ Escrever o Caderno 5 · Imagem e som
- ⬜ Escrever o Caderno 6 · Postar e continuar
- ⬜ Diário de produção (O Bunker e O Tempo Parou)
- ⬜ Modelos para preencher (versão para quem não tem a skill)

## 6. A Área do Estúdio (`area/`)

- ✅ Gerador do site: início, uma página por passo, guia, extra e os downloads
- ✅ Três partes separadas por produto, com cadeado e botão "Liberar"
- ✅ Funciona no computador e no celular
- ✅ Links de checkout no botão "Liberar" da Área

## 7. O login e a liberação por produto

- ✅ Pesquisado: a Cakto tem webhook de "Compra aprovada" (Integrações › Webhooks), por produto
- ✅ Conta no Netlify criada e token salvo no ambiente (o Claude publica daqui)
- ✅ Sem domínio: o login usa e-mail + número do pedido da Cakto (jeito B)
- ✅ Sem serviço de e-mail (jeito B)
- ✅ Recebedor do aviso da Cakto (`site/netlify/functions/cakto.mjs`), no ar
- ✅ Tela de entrar: e-mail + número do pedido (`site/entrar.html`), no ar
- ✅ Porteiro da Área (`site/netlify/edge-functions/porteiro.mjs`), no ar
- ✅ Reembolso e chargeback tiram o acesso
- ✅ Webhook criado na Cakto (82321)
- ⬜ Dono: deixar o site público no Netlify (Visitor access) e repetir o teste do webhook
- ⬜ Compra de teste de verdade, do pagamento ao download

## 8. Cakto

- ✅ Os 4 produtos criados e ativos (veja `cakto.md`)
- ✅ Caça-Ideias como extra (order bump) nos 3 checkouts
- ⬜ Configurar o webhook de compra aprovada (e de reembolso)
