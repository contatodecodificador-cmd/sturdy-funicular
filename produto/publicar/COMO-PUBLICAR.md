# Como publicar a página de venda no Netlify

**Site:** https://estudiodonogueira.netlify.app (criado em 07/11/2026, conta Anderson Nogueira's team).

**O jeito mais fácil:** peça ao Claude "publica a página". Ele roda `bash produto/publicar/publicar.sh`,
que monta o zip e publica direto pelo token do Netlify salvo no ambiente.

Se o token não estiver disponível, use o jeito manual abaixo.

O arquivo **`pagina-de-venda.zip`** desta pasta já está pronto para subir.

## 1. Baixar o pacote do GitHub

1. No GitHub, abra o repositório **sturdy-funicular**.
2. No botão de branch (canto de cima, à esquerda, onde aparece `main`), escolha
   **`claude/produto-contos-do-vigia`**.
3. Entre em **produto › publicar › pagina-de-venda.zip**.
4. Clique no botão de **baixar** (a setinha para baixo, no canto direito, ou "Download raw file").

Atalho (com o GitHub logado):
https://github.com/contatodecodificador-cmd/sturdy-funicular/raw/claude/produto-contos-do-vigia/produto/publicar/pagina-de-venda.zip

## 2. Subir no Netlify

1. Entre em **app.netlify.com**.
2. Na área **"Upload your project files"** (ou, se já tiver um site, em **Deploys** › arrastar na caixa
   de "Need to update your site?"), **arraste o arquivo `pagina-de-venda.zip`** do jeito que ele veio.
   Não precisa descompactar.
3. Espere um minuto. O Netlify mostra o endereço (algo como `nome-aleatorio.netlify.app`).
4. Para trocar o nome: **Site configuration › Change site name** (exemplo: `estudiodonogueira`).

## 3. Quando a página mudar

O Claude roda `python3 produto/publicar/montar.py`, salva o zip novo no GitHub, e você repete os
passos 1 e 2, arrastando o zip novo no mesmo site (aba **Deploys**).

## Lembretes

- Até o lançamento, a página **não aparece no Google** (está no arquivo `_headers` dentro do zip). No
  lançamento, peça ao Claude para liberar.
- Os botões de compra mostram "Em breve" até os links da Cakto entrarem na página.
- A **Área do Estúdio não vai junto**: ela só sobe quando o login estiver pronto.
