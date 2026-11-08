# Formato do `roteiro.json` (contrato entre roteirista, revisor e editor)

O editor (`scripts/render.mjs`) transforma este arquivo em vídeo automaticamente. Valide sempre com:
`node scripts/validar.mjs <pasta>`

```jsonc
{
  "id": "2026-11-08-01-tornados-sul",
  "tema": "jornal",                 // "jornal" (padrão; "escuro" e a ausência de tema também viram jornal: papel creme, tinta preta, marca-texto amarelo), "satelite" (imagem NASA sob o mapa) ou "grafite" (variante escura neutra, sem azul)
  "fontes": "Defesa Civil SC · Inmet · MetSul · 07/11",   // rodapé fixo do vídeo
  "cenas": [ /* 8 a 14 cenas */ ]
}
```

## Cena
Cada cena tem **uma frase ou duas** de fala. Uma cena nova = movimento de câmera novo.

| Campo | Tipo | Uso |
|---|---|---|
| `fala` | texto | O que a voz diz. Marque 1 palavra-chave por cena com `*asteriscos*` (fica sublinhada em amarelo). |
| `capitulo` | texto | Etiqueta do topo ("Novo tornado hoje · Santo Augusto/RS"). Curta, com data quando couber. |
| `continua` | bool | `true` = continuação da cena anterior: mantém câmera, destaques, notas e (com `"titulo":"manter"`) o título. |
| `visual` | `mapa` \| `lista` \| `cta` | Padrão `mapa`. `lista` = post-its numerados com check. `cta` = card de pergunta + botão seguir (sempre a última). |
| `ufs` | ["PR","SC"] | Estados enquadrados quando não há destaque/zoom. |
| `zoom` | ["Cidade/UF"] | Aproxima a câmera nesses municípios. |
| `destaques` | lista | Municípios que "saltam" em 3D com rótulo: `{"local":"Chapecó/SC","rotulo":"Chapecó · SC","detalhe":"Tornado 10h30","cor":"vermelho","gatilho":"Chapecó"}`. Aparecem quando a palavra `gatilho` é falada (padrão: o nome da cidade). |
| `ilustracao` | objeto | Ilustração 3D de maquete sobre um município: `{"tipo":"tornado","local":"Chapecó/SC","escala":1.2,"gatilho":"tornado","cenario":false}`. Entra na fala do `gatilho` (padrão: início da cena) e fica até o fim do grupo de cenas `continua`. A câmera enquadra o município e deixa espaço em cima. `escala` (padrão 1) e `cenario:false` (sem casinhas/árvores/prédios ao redor) são opcionais. Tipos: `tornado` (funil listrado girando, nuvens em cima, detritos, bairro em miniatura), `temporal` (nuvens, chuva e raios sobre prédios), `chuva`, `vento` (setas amarelas), `raio`, `enchente` (água subindo), `casas_destelhadas` (telhas voando), `apagao` (cena escurece, janelas apagam, postes com faíscas), `aeroporto` (pista, torre, avião e blocos voando), `icones_seguranca` (árvore, poste, tomada e celular 199 com X vermelho). Use no máximo 1 por cena; `icones_seguranca` pede `escala` ~1.6. |
| `rota` | bool | Liga os destaques com uma linha amarela, na ordem. |
| `preencher` | objeto | Pinta uma área progressivamente: `{"locais":["SC"] ou ["Cidade/UF",...],"cor":"vermelho","gatilho":"trezentas"}`. |
| `titulo` | objeto ou `"manter"` | Com número: `{"numero":126,"unidade":" km/h","texto":"rajada em Chapecó","sub":"Inmet · 04/11"}` (anima um contador; `de` define o valor inicial; `prefixo` como "ATÉ "). Sem número: `{"texto":"Isso ainda não acabou","sub":"...","circular":true}`. |
| `notas` | lista (máx. 4) | Post-its: `{"topo":"Santo Augusto","texto":"Até 100 casas","gatilho":"cem"}`. |
| `itens` | lista (máx. 4) | Só em `lista`: `{"texto":"água potável 6L por pessoa","gatilho":"água"}`. |
| `pergunta`, `apoio` | texto | Só em `cta`: "Como está o céu na sua cidade?" / "comenta aqui e manda pra quem está na rota." |
| `flash` | bool | Clarão de relâmpago + trovão no início da cena (use 1–2 vezes no máximo, em viradas). |

### Cartões de mídia (caminhos relativos à pasta do vídeo)
Aparecem no começo da cena (ou na palavra `gatilho`, opcional) e saem no fim dela, entrando girando de fora da tela. Use no máximo 1 por cena e evite combinar com 3-4 notas. Arquivo inexistente: `validar.mjs` só avisa e o render pula o card (em `noticia`, só a imagem é pulada).

| Campo | Exemplo | Resultado |
|---|---|---|
| `noticia` | `{"veiculo":"g1","manchete":"...","data":"07/11/2026","url":"g1.globo.com/...","imagem":"midia/print1.png"}` | Card "print de site": barra de navegador com o domínio, nome do veículo, manchete grande, data; inclinado, com sombra. `imagem` (screenshot real em PNG, opcional) aparece dentro do card. |
| `video` | `{"arquivo":"midia/clip1.mp4","credito":"Reprodução / @autor","inicio":0,"miniatura":"midia/mini1.png"}` | Polaroid de ~300px no canto inferior direito com o vídeo rodando sem som durante a cena (quadros pré-extraídos com ffmpeg: render determinístico; faz loop se o clipe for curto). Sem o arquivo, usa `miniatura` com ícone de play e zoom lento; sem os dois, pula o card. |
| `foto` | `{"arquivo":"midia/x.jpg","credito":"..."}` | Polaroid no canto inferior esquerdo com a foto e o crédito. |

Cores (preenchimentos/destaques do mapa; o vermelho é a cor semântica de perigo, o resto da marca é papel creme + tinta preta + amarelo marca-texto #ffd400; nunca azul-marinho): `vermelho` (perigo), `laranja` (alerta), `amarelo` (outro tipo de evento), `verde` (alívio / sem vítimas), `azul` (frio/chuva).

**Locais:** sempre `"Município/UF"` com o nome oficial do IBGE (acentos importam pouco, mas a grafia sim) ou só `"UF"` para o estado inteiro.

**Números falados × título:** na `fala` escreva como se fala ("cento e vinte e seis quilômetros por hora" ou "126 por hora"). No `titulo.numero` coloque o número puro (126).

## Exemplo completo
Veja `exemplos/tornados-sul/roteiro.json`.


## Movimento (automático, não precisa de campo)
Mapa 3D inclinado com câmera orbitando, deriva constante, transições de câmera de ~0,55s, "punch-in" (+6% de zoom e micro-shake) a cada título, destaque, nota, mídia ou item de lista, contadores em easeOutExpo, letreiro de fontes rolando no rodapé (`fontes` pode ser texto ou lista) e efeitos sonoros de punch/tick sincronizados.

## `stories.json` (opcional, gera `story_animado.mp4` e `story_imagem.png` em 1080x1920)
```jsonc
{
  "manchete": ["6 tornados", "em 6 dias"],                       // 2 linhas (branca + amarela)
  "numero": {"numero": 6, "unidade": " TORNADOS", "texto": "no Sul · 02 a 07/11"},   // mesmo formato de titulo.numero
  "cena": 1,                                                      // índice (0 = primeira) da cena do roteiro cujo mapa/destaques aparecem
  "chamada": "Sul do Brasil em alerta",
  "enquete": {"pergunta": "Você já viu um tornado de perto?", "opcoes": ["SIM", "NÃO"]}   // opcional
}
```
`story_animado.mp4`: ~12s, sem narração, com trilha e efeitos (-14 LUFS): manchete batendo, contador, mapa com destaques entrando e "NOVO VÍDEO NO PERFIL / Toque para assistir". `story_imagem.png`: enquete (pergunta + 2 caixas, para o sticker de enquete do Instagram por cima) se houver `enquete`; senão, card de notícia com manchete e número. Topo (250px) e base (300px) ficam livres de texto importante. Geração: `node scripts/stories.mjs <pasta>` (o `produzir.mjs` chama sozinho).

## Satélite
`dados/satelite/brasil.jpg` (+ `brasil.json` com o bbox lon/lat) é recorte da NASA Blue Marble (domínio público) e é reprojetado para a Mercator do mapa. A capa sempre usa esse fundo; nos vídeos use `"tema": "satelite"`.

## Visual (motor)
Mapa em jornal claro (papel creme com grão, municípios cinza-claro, estados com contorno grafite) inclinado em 3D. Os destaques e os preenchimentos viram blocos 3D extrudados (Three.js, `templates/cena3d.js`, render determinístico por tempo, câmera idêntica à do mapa). Rótulos e pins são projetados do 3D para a tela. Folha de estilo para aprovação do dono: `node scripts/folha-estilo.mjs` gera `marca/folha-estilo.png`.
