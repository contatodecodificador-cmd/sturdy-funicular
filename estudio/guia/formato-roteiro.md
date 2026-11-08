# Formato do `roteiro.json` (contrato entre roteirista, revisor e editor)

O editor (`scripts/render.mjs`) transforma este arquivo em vídeo automaticamente. Valide sempre com:
`node scripts/validar.mjs <pasta>`

```jsonc
{
  "id": "2026-11-08-01-tornados-sul",
  "tema": "escuro",                 // "escuro" (padrão, alerta) ou "claro" (papel/maquete)
  "fontes": "Defesa Civil SC · Inmet · MetSul · 07/11",   // rodapé fixo do vídeo
  "cenas": [ /* 8 a 14 cenas */ ]
}
```

## Cena
Cada cena tem **uma frase ou duas** de fala. Uma cena nova = movimento de câmera novo.

| Campo | Tipo | Uso |
|---|---|---|
| `fala` | texto | O que a voz diz. Marque 1 palavra-chave por cena com `*asteriscos*` (fica sublinhada em vermelho). |
| `capitulo` | texto | Etiqueta do topo ("Novo tornado hoje · Santo Augusto/RS"). Curta, com data quando couber. |
| `continua` | bool | `true` = continuação da cena anterior: mantém câmera, destaques, notas e (com `"titulo":"manter"`) o título. |
| `visual` | `mapa` \| `lista` \| `cta` | Padrão `mapa`. `lista` = post-its numerados com check. `cta` = card de pergunta + botão seguir (sempre a última). |
| `ufs` | ["PR","SC"] | Estados enquadrados quando não há destaque/zoom. |
| `zoom` | ["Cidade/UF"] | Aproxima a câmera nesses municípios. |
| `destaques` | lista | Municípios que "saltam" em 3D com rótulo: `{"local":"Chapecó/SC","rotulo":"Chapecó · SC","detalhe":"Tornado 10h30","cor":"vermelho","gatilho":"Chapecó"}`. Aparecem quando a palavra `gatilho` é falada (padrão: o nome da cidade). |
| `rota` | bool | Liga os destaques com uma linha vermelha, na ordem. |
| `preencher` | objeto | Pinta uma área progressivamente: `{"locais":["SC"] ou ["Cidade/UF",...],"cor":"vermelho","gatilho":"trezentas"}`. |
| `titulo` | objeto ou `"manter"` | Com número: `{"numero":126,"unidade":" km/h","texto":"rajada em Chapecó","sub":"Inmet · 04/11"}` (anima um contador; `de` define o valor inicial; `prefixo` como "ATÉ "). Sem número: `{"texto":"Isso ainda não acabou","sub":"...","circular":true}`. |
| `notas` | lista (máx. 4) | Post-its: `{"topo":"Santo Augusto","texto":"Até 100 casas","gatilho":"cem"}`. |
| `itens` | lista (máx. 4) | Só em `lista`: `{"texto":"água potável 6L por pessoa","gatilho":"água"}`. |
| `pergunta`, `apoio` | texto | Só em `cta`: "Como está o céu na sua cidade?" / "comenta aqui e manda pra quem está na rota." |
| `flash` | bool | Clarão de relâmpago + trovão no início da cena (use 1–2 vezes no máximo, em viradas). |

Cores: `vermelho` (perigo), `laranja` (alerta), `amarelo` (outro tipo de evento), `verde` (alívio / sem vítimas), `azul` (frio/chuva).

**Locais:** sempre `"Município/UF"` com o nome oficial do IBGE (acentos importam pouco, mas a grafia sim) ou só `"UF"` para o estado inteiro.

**Números falados × título:** na `fala` escreva como se fala ("cento e vinte e seis quilômetros por hora" ou "126 por hora"). No `titulo.numero` coloque o número puro (126).

## Exemplo completo
Veja `exemplos/tornados-sul/roteiro.json`.
