# Capas

A capa decide o clique na grade do perfil e no Explorar. O padrão vem do canal de referência.

## `capa.json`
```json
{
  "cena": 1,
  "tag": "Alerta vermelho · Sul",
  "titulo": ["325 cidades", "no vermelho"],
  "linha": "Se a sua cidade está aqui, assiste",
  "rodape": "Chapecó · Cascavel · Passo Fundo · Foz"
}
```
- `cena`: índice (começa em 0) da cena cujo mapa fica no fundo. Escolha a que tem **mais coisa visível** (destaques + rota ou preenchimento).
- `titulo`: **2 linhas, de 2 a 4 palavras cada**. A 1ª fica em branco e a 2ª em amarelo-ouro (sobre fundo de satélite com vinheta escura, sempre). A 1ª traz o número ou o fato, a 2ª o lugar ou a consequência.
- `tag`: categoria + data curta ("Novo tornado hoje no RS · 07/11").
- `linha`: fonte oficial ou ordem direta ("Alerta do Inmet · perigo · sáb 07/11" / "Se a sua cidade está aqui, assiste").
- `rodape`: 3 a 5 cidades mais populosas da área, separadas por " · ".

## Regras
- Coloque o **nome de cidade ou estado no título** sempre que possível. É o fator nº 1 de views.
- Nada de clickbait falso: o título precisa ser verdade com os dados do roteiro.
- A área útil é o centro (o Instagram corta a grade em 3:4). O card já fica nessa área.
