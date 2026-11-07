# O Bunker (parte 2): briefing

Status: versão 1, esperando aprovação do dono. Caminho SAI (votado em 07/11/2026). Roteiro: `roteiro.md`
(frase 1 versão A, escolhida pelo editor-chefe pra não travar; o dono pode trocar pela B).

- **Ideia**: ele sai do bunker, não tem névoa nenhuma, a casa ficou parada naquela terça e a TV nunca
  desligou. No alto do bairro, a torre de rádio pisca no ritmo do aviso.
- **Duração**: 10 cenas, 109 palavras. Com a voz do dono (ritmo da parte 1), uns 40 s, mais ~3 s de tela final.
- **Narrador**: o Vigia, na voz clonada do dono (Eleven v4 com tags), gerada por ele.
- **Clima**: **fim de tarde** (céu laranja e roxo, sombras compridas): é a primeira luz de fora em cinco
  anos e deixa a luz da torre visível no fim. Dentro de casa, só a luz da janela e o vermelho da TV.
- **O vermelho aparece pouco**: a tela da TV e a luz da torre. Nada de névoa vermelha nesta parte.

## Roteiro

| # | Narração | Na tela | Destaque | Som |
|---|---|---|---|---|
| 1 | Pela primeira vez em cinco anos, o Otávio abriu a escotilha. | Primeiro quadro: de dentro do bunker, olhando pra cima. A tampa da escotilha se abre e a luz de fim de tarde entra pelo buraco, em cima da mão dele. A câmera sobe devagar pela escada. | ESCOTILHA | a tampa de metal rangendo; ar entrando |
| 2 | Lá fora, não tinha névoa nenhuma. | Fusão lenta pra fora: a cabeça do Otávio sai pela escotilha, no chão do quintal. Céu limpo, laranja. Ele olha pros lados. | NENHUMA | vento leve (novo) |
| 3 | Ele pôs a máscara velha e atravessou o quintal tomado de mato. | Câmera atrás dele: põe a máscara de gás e anda pelo mato alto até a porta dos fundos da casa. | MATO | passos no mato (novo) |
| 4 | A cerca tinha caído, e a rua estava vazia. | Plano aberto: a cerca de madeira caída no chão; pelo buraco, a rua sem ninguém, folhas secas, a casa vizinha com a janela fechada. | VAZIA | vento |
| 5 | Dentro de casa, a caneca de café ainda estava na mesa. | A cozinha da parte 1, parada no tempo: poeira em tudo, teia no canto, a caneca na mesa com uma marca seca de café. Luz da janela entrando torta. | CANECA | quase nada |
| 6 | E a TV continuava ligada, com o mesmo aviso vermelho. | A sala: a TV acesa com o aviso "FIQUEM EM CASA. NÃO RESPIREM A NÉVOA.", a luz vermelha pintando a poeira no ar. No sofá, o controle remoto limpo (pista). | LIGADA | o chiado baixo da TV |
| 7 | Ele chegou perto, devagar, e leu a data na tela. | O Otávio de costas, de máscara, andando até a TV. A câmera chega junto com ele. | DATA | passos lentos |
| 8 | Era aquela terça. A TV nunca tinha desligado. | Close no canto da tela: "TER 09/11/2021 · 07:00". Os olhos dele, por cima da máscara, arregalam em "nunca". | TERÇA | quase nada |
| | (pausa) | | | silêncio |
| 9 | No alto do bairro, a luz da torre de rádio piscava... no ritmo do aviso. | Fusão lenta pra janela da sala: o morro no fim de tarde e a torre de rádio com a luz vermelha piscando junto com cada palavra do aviso. | TORRE | um pulso baixo, no ritmo da luz (novo) |
| 10 | Ele vai até a torre ou volta? Comenta TORRE ou VOLTA. Segue pra ver a parte 3. | Tela dividida TORRE (a torre no morro) e VOLTA (a escotilha aberta no quintal, anoitecendo). Depois, "PARTE 3 EM BREVE". | TORRE, VOLTA | a trilha sobe e uma batida grave fecha |

**Cortes**: secos, com duas fusões lentas: **1 → 2** (de dentro do bunker pra fora) e **8 → 9** (da TV pra
janela e a torre). Câmera sempre andando devagar.

**Legenda com ênfase** (regra do canal): palavra-chave na marca vermelha e as importantes em âmbar
(ex.: OTÁVIO, NÉVOA, MÁSCARA, CERCA, RUA, CAFÉ, TV, AVISO, DEVAGAR, NUNCA, PISCAVA).

## Personagens (o que é novo nesta parte)

- **O Otávio hoje**, igual à parte 1 (gorro mostarda, barba e cabelo grisalhos, camisa xadrez desbotada).
  **Novo**: a **máscara de gás velha** (borracha cinza-esverdeada `#5E6658`, dois filtros redondos
  `#3E423B`, alças pretas), da cena 3 em diante. Com a máscara, o medo fica todo nos olhos e nas sobrancelhas.
- Expressões: desconfiado (2), preocupado (5 a 7), choque (8). Poses: subindo a escada (de costas),
  andando no mato (de costas), parado diante da TV (de costas), olhando pela janela (de perfil).

## Cenários e elementos pra desenhar

1. **Bunker visto de baixo**, com a escotilha abrindo e a luz entrando (reaproveita o bunker da parte 1).
2. **Quintal tomado de mato no fim de tarde**: mato alto, a escotilha aberta no chão, a casa do Otávio de fundos.
3. **A cerca caída e a rua vazia**: folhas secas, a casa vizinha fechada.
4. **A cozinha empoeirada**: a mesma da parte 1, com poeira, teia e a luz torta da janela.
5. **A sala**: sofá, TV ligada com o aviso, o controle remoto limpo, poeira no ar na luz vermelha.
6. **A janela da sala com o morro e a torre de rádio** (TORRE 7 escrito pequeno na estrutura).
7. **Elementos**: a máscara de gás, a data no canto da TV, a caneca com marca seca, a torre com a luz.
8. **Cartão final**: TORRE / VOLTA e a tela "PARTE 3 EM BREVE".

Sons novos (no fim de `scripts/sintetiza-terror.py`): vento leve, passos no mato, o pulso da torre.
Todos uns 15 dB abaixo da voz, medidos com todas as frequências, sem zumbido grave contínuo.

## Texto da narração (pro dono gerar no ElevenLabs, Eleven v4)

```
Pela primeira vez em cinco anos, o Otávio abriu a escotilha.
Lá fora, não tinha névoa nenhuma.
Ele pôs a máscara velha e atravessou o quintal tomado de mato.
A cerca tinha caído, e a rua estava vazia.
Dentro de casa, a caneca de café ainda estava na mesa.
E a TV continuava ligada, com o mesmo aviso vermelho.
Ele chegou perto, devagar, e leu a data na tela.
Era aquela terça. A TV nunca tinha desligado.

No alto do bairro, a luz da torre de rádio piscava... no ritmo do aviso.
Ele vai até a torre ou volta? Comenta TORRE ou VOLTA. Segue pra ver a parte três.
```

Sugestão de tags (o dono ajusta no v4): um tom mais baixo e lento em "Era aquela terça" e uma pausa
longa antes de "No alto do bairro".

## Capa

- **Imagem**: o Otávio de máscara saindo pela escotilha no quintal de mato, céu de fim de tarde, e a
  torre de rádio pequena no fundo com a luz vermelha acesa.
- **Título**: O / **BUNKER** (BUNKER em vermelho). Pílula "PARTE 2". Selo CONTOS DO VIGIA.
