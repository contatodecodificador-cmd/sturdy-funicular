# Dia do lançamento

Tudo está pronto e no ar em https://estudiodonogueira.netlify.app, com as vendas **desligadas** e a
página **fora do Google**. No dia de lançar, peça ao Claude: **"vamos lançar o Estúdio"**. Ele segue esta
lista.

## 1. Os resultados reais (o dono traz)

Junte, com a data, só números **verdadeiros** dos canais. Exemplos do que vale:
- visualizações de uma parte (ex.: "parte 1 de O Bunker");
- seguidores ganhos desde a estreia;
- comentários ou votos numa enquete;
- prints, se quiser (sem dados de outras pessoas).

O Claude preenche `RESULTADOS` no fim de `pagina/index.html`. Enquanto estiver `null`, a seção fica
escondida. Nada de número arredondado para cima, depoimento inventado ou promessa de ganho.

## 2. Ligar as vendas

- `pagina/index.html`: `VENDAS_ABERTAS = true` (os botões passam a abrir o checkout da Cakto).

## 3. Aparecer no Google

- `publicar/montar.py`: `FORA_DO_GOOGLE = False`.
- `pagina/index.html` e `site/publicar-tudo.sh`: conferir que nada mais pede para ficar fora do Google
  na página de venda (a Área continua sempre fora do Google).

## 4. Publicar

```
bash produto/site/publicar-tudo.sh
```

Publica a página, a Área e o login juntos e confere sozinho que a Área continua protegida.
**Não use** `publicar/publicar.sh` depois que a Área estiver no ar: ele publica só a página e tira a Área
do ar (serve só para emergência).

## 5. Compra de teste de verdade

1. O dono compra o produto mais barato (o guia, R$ 27) com o próprio e-mail.
2. Confere o e-mail da Cakto, entra na Área com o e-mail e o número do pedido e abre o guia.
3. Pede o reembolso na Cakto e confere que o acesso some.

## 6. Depois do lançamento

- Acompanhar os avisos da Cakto (o Claude consulta pelo CaktoMCP: vendas, reembolsos, falhas de aviso).
- Se alguém não conseguir entrar: conferir na Cakto o e-mail e o número do pedido; se o aviso falhou, o
  Claude reenvia pelo CaktoMCP.
- O token do Netlify vence no prazo escolhido: gerar outro do mesmo jeito.

## Onde fica cada coisa

| O quê | Onde |
|---|---|
| Página de venda | `pagina/index.html` |
| Área do Estúdio (gerador) | `area/gerar.py` (+ `guia/*.md` e `entrega/`) |
| Login e porteiro | `site/` |
| Produtos, links e webhook | `cakto.md` |
| O que falta | `CHECKLIST.md` |
