# Comece aqui

Bem-vindo à Estúdio do Nogueira. Antes de criar a primeira série, você vai deixar o seu estúdio pronto.
Isso é feito **uma vez só** e leva cerca de 30 minutos. Siga na ordem: cada passo depende do anterior.

| Passo | O que é | Quanto custa |
|---|---|---|
| 1 | Criar as contas | Claude Pro (pago), GitHub (grátis), ferramenta de voz (grátis para testar) |
| 2 | Colocar o Estúdio no GitHub | grátis |
| 3 | Abrir o Claude Code na nuvem, no lugar certo | já incluso no Claude Pro |
| 4 | Digitar `/comecar` | o Claude faz o resto com você |

---

## Passo 1: as contas (nesta ordem)

### 1.1 Claude Pro: o mais importante

Sem ele, nada funciona. É o Claude que escreve, desenha, monta e confere os vídeos.

1. Entre em **claude.ai** e crie a sua conta (ou entre na que você já tem).
2. Assine o plano **Pro** (ou um superior). O plano grátis não tem o Claude Code.

### 1.2 GitHub: a pasta do seu canal na internet

O GitHub é onde ficam guardados os arquivos do seu canal. É de lá que o Claude abre o seu projeto na
nuvem, e é por isso que você não precisa de computador potente.

1. Entre em **github.com** e crie uma conta grátis.
2. Confirme o seu e-mail.

### 1.3 A voz: pode começar no grátis

O Estúdio vem pronto para o **ElevenLabs**, mas a voz é escolha sua.

1. Crie uma conta grátis em **elevenlabs.io** para ouvir as vozes e testar.
2. **Ainda não precisa pagar.** Assine um plano pago só quando for postar o primeiro vídeo: é o plano pago
   que libera o uso comercial e o clone da sua própria voz.

> Vai usar outra ferramenta de voz? Sem problema. Você gera o áudio nela e manda o arquivo para o Claude.
> Ele encaixa do mesmo jeito.

**Pronto quando:** você entra no claude.ai com o plano Pro, no github.com e no elevenlabs.io.

---

## Passo 2: colocar o Estúdio no GitHub

1. Baixe a pasta **estudio** que veio na sua compra e descompacte no computador.
2. No GitHub, clique em **+** (canto de cima) e depois em **New repository**.
3. Em **Repository name**, escreva o nome do seu canal, sem espaços (exemplo: `meu-canal`).
4. Marque **Private**, para só você ver.
5. Clique em **Create repository**.
6. Na página que abrir, clique em **uploading an existing file**.
7. Arraste **tudo o que está dentro** da pasta `estudio` para a página (não arraste a pasta em si).
8. Clique em **Commit changes**.

**Pronto quando:** você abre o seu repositório no GitHub e vê o arquivo `CLAUDE.md` na lista.

> Não apareceu a pasta `.claude`? Alguns computadores escondem pastas que começam com ponto. No Mac,
> aperte `Cmd + Shift + .` na janela da pasta para mostrar. No Windows, ative "Itens ocultos" na aba
> Exibir. Depois arraste de novo.

---

## Passo 3: abrir o Claude Code na nuvem, no lugar certo

Atenção: o chat normal do Claude **não** serve. O Estúdio roda no **Claude Code**, que tem um endereço
próprio.

1. Entre em **claude.ai/code** (no computador ou no celular).
2. Na primeira vez, ele pede para **conectar o GitHub**. Aceite e dê acesso ao repositório que você
   criou no passo 2.
3. Escolha o seu repositório na lista (exemplo: `meu-canal`).
4. Comece uma sessão nova.

**Você está no lugar certo se:** o nome do seu repositório aparece no topo da conversa. Se aparecer só
um chat em branco sem o repositório, você está no chat normal: volte para **claude.ai/code**.

---

## Passo 4: o primeiro comando

Na conversa do Claude Code, digite:

```
/comecar
```

A partir daqui, o Claude conduz. Ele vai:

1. conferir se o estúdio está funcionando (e montar o que faltar);
2. pedir a sua chave do ElevenLabs num cartão seguro, se você quiser deixar a voz pronta agora;
3. fazer um vídeo de teste de 3 segundos, para você ver que está tudo certo;
4. conversar com você sobre o seu canal: nicho, público, narrador e voz.

No fim, ele anota tudo no arquivo de memória do canal. Depois disso, o seu estúdio está pronta e o
próximo passo é criar a primeira série.

---

## Deu problema?

| O que aconteceu | O que fazer |
|---|---|
| `/comecar` não aparece | Confira se o repositório tem a pasta `.claude` (veja o passo 2). |
| O Claude diz que não tem repositório | Você abriu o chat normal. Volte ao passo 3. |
| O Claude diz que o site está bloqueado | Peça: "me ajude a liberar o acesso". Ele mostra um cartão para você aprovar. |
| A voz não funciona | Siga sem voz por enquanto. O `/comecar` pode ser rodado de novo depois. |
