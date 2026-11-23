# Kit CapCut — Vídeo 8: O Dia em Que BOLAS DE FOGO Caíram na AMAZÔNIA

Tudo para montar o vídeo no CapCut. Duração final: **~12:48** (24 s de abertura + 12:24 de narração + cartela final). Projeto **1920×1080, 30 fps**.

## O que tem no kit
| Pasta / arquivo | O que é |
|---|---|
| `timeline.csv` | **A linha do tempo plano a plano** (221 planos). Para cada um: início e fim exatos no vídeo, arquivo, como usar, texto na tela, efeito sonoro e a fala. Abre no Excel ou no Google Planilhas. |
| `01_abertura/` | Os 5 planos da abertura (Higgsfield) e o som da abertura (`abertura_som_completo.wav`, 24 s). |
| `02_videos_ia/` | Os 46 vídeos do Higgsfield (`H06.mp4` … `H53.mp4`), 5 s cada, 720p. Os marcados no CSV como "manter o som nativo" vêm com áudio. |
| `03_graficos/` | Os 88 gráficos animados (mapas, sismograma, jornal, régua de energia, pasta do caso…), **já cortados no tempo exato** e nomeados com o número do plano (`023_Viagem_0.mp4`). |
| `04_fotos_reais/` | Fotos reais (Chelyabinsk 2013, meteorito de Bendegó, Perseidas), para usar em CARTÃO. |
| `05_audio/` | `narracao_completa.mp3` + `efeitos/` (efeitos sonoros) + `musicas_opcional/` (trilhas; por enquanto o dono quer o vídeo SEM música de fundo). |
| `06_thumbnail/` | A thumbnail aprovada. |
| `descricao_youtube.md` | Título, descrição, fontes, créditos e tags. |

## Passo a passo
1. **Abertura (0:00 – 0:24):** coloque `abertura_plano1.mp4` a `abertura_plano5.mp4` em sequência, **4,8 s cada** (corte o finalzinho de cada clipe), com corte seco. Ajuste cada clipe para preencher 1920×1080. No áudio, coloque `abertura_som_completo.wav` em 0:00.
   - O assobio do meteoro (por volta de 0:09–0:14) ficou artificial: abaixe para 30–40% ou troque por `impacto.mp3` com fade.
2. **Narração:** coloque `05_audio/narracao_completa.mp3` começando **exatamente em 0:24.00**, volume 100%.
3. **Planos:** siga o `timeline.csv` linha por linha. As colunas "início" e "fim" já contam com os 24 s da abertura. Cada plano entra e sai no tempo exato, com corte seco.
   - **vídeo IA** (`02_videos_ia/Hxx.mp4`): use do início do clipe, pela duração indicada. **Sem zoom** (o clipe já se move). Escale para 1920×1080 (preencher).
   - **vídeo IA (reuso da abertura)**: use a partir de 0,5 s, com o som do clipe desligado.
   - **gráfico animado** (`03_graficos/NNN_*.mp4`): já está no tamanho e no tempo certos; é só soltar.
   - **FOTO REAL em cartão:** a foto real fica no centro com ~68% da largura, borda branca de 8 px, cantos arredondados de 12 px e sombra forte. **Fundo:** o vídeo indicado no CSV, com desfoque (blur ~30) e escurecido ~50%. Zoom leve de 100% a 104% só na foto, do primeiro ao último quadro. Crédito pequeno no canto inferior direito (ver abaixo).
   - **Nunca repita um clipe em loop.** Se faltar tempo num plano, estenda o clipe seguinte. Não volte o mesmo clipe.
4. **Texto na tela** (coluna "texto na tela"): **no máximo um texto por plano.**
   - Estilo: fonte **Oswald Bold** ~56 px, branco, todo em maiúsculas, centralizado em cima (~150 px do topo), numa caixa escura semitransparente (#060A14, 85%) com cantos arredondados e um traço dourado (#E3B04B) embaixo.
   - Entra 0,25 s depois do início do plano, com fade + leve subida.
   - Se o gráfico daquele plano já tiver rótulo na mesma área, desça o texto ou pule-o: **nada de texto sobre texto**.
5. **Selo "pasta do caso"** (opcional, recomendado): caixinha no canto superior esquerdo com "CASO CURUÇÁ · 13/08/1930" e "PROVAS N/6".
   - O N muda: 1 em 2:33, 2 em 2:41, 3 em 3:03, 4 em 4:40, 5 em 6:16, 6 em 7:19 (aí o número fica vermelho).
   - Some nos planos de gráfico da pasta, do jornal e da cartela final.
6. **Som:**
   - Narração na frente, sempre.
   - O som nativo dos vídeos marcados ("manter o som nativo a ~30%") fica embaixo da voz. Os demais clipes ficam mudos.
   - Efeitos (coluna "efeito sonoro") em `05_audio/efeitos/`, bem sutis (15–35%), no início do plano. Nas explosões e impactos, um pouco mais forte.
   - **Sem música de fundo por enquanto** (as trilhas ficam na pasta para depois, sempre bem baixas: −30 LUFS, com ducking sob a voz).
   - Volume final: −14 LUFS.
7. **Acabamento:** vinheta leve (bordas ~30%), grão sutil, cor natural (sem saturar). Cartela final (último plano) com "INSCREVA-SE".
8. **Exportar:** 1080p, 30 fps, alta qualidade.

## Regras do canal (não quebre)
- Planos de no máximo 5 s; o corte acompanha a fala.
- Imagem parada = um zoom leve contínuo do começo ao fim (nunca vai-e-volta). Vídeo = sem zoom.
- Um texto por plano, nada tapando o foco da imagem.
- Nenhuma animação em loop.
- Fotos reais sempre em cartão, com crédito.

## Créditos das fotos reais (pôr no canto e na descrição)
- Chelyabinsk 2013: foto de Alex Alishevskikh, CC BY-SA 2.0 (Wikimedia Commons).
- Meteorito de Bendegó: Wikimedia Commons (conferir o autor na página do arquivo "Bendegó meteorite.jpg").
- Perseidas: Wikimedia Commons (conferir o autor na página do arquivo "Perseid Meteor.jpg").
- Vídeos e imagens de IA: gerados no Higgsfield (reconstituição). Gráficos e mapas: Brasil Milenar; relevo do Natural Earth.

---

## PROMPT PARA COLAR NO GPT
> Você é editor de vídeo. Vou te mandar o kit "Kit CapCut — Vídeo 8" (pastas 01 a 06, timeline.csv e este guia). Me guie, passo a passo, para montar no CapCut um vídeo de ~12:48 em 1920×1080 a 30 fps, seguindo EXATAMENTE o timeline.csv (início e fim de cada um dos 221 planos já contam os 24 s da abertura) e as regras do guia:
> - abertura de 24 s (5 planos de 4,8 s) com o som da abertura;
> - narração começando em 0:24.00;
> - cortes secos; vídeos de IA sem zoom; gráficos já prontos;
> - fotos reais em cartão sobre o vídeo indicado desfocado;
> - no máximo um texto por plano (Oswald Bold, caixa escura com traço dourado);
> - som nativo dos clipes marcados a ~30%, efeitos sutis nos planos indicados, sem música;
> - nenhum clipe em loop.
>
> Trabalhe bloco por bloco (Abertura, Introdução, Ato 1, Ato 2, Ato 3, Lado a lado, Ato 4, Fecho): para cada bloco, diga quais arquivos arrastar em que ordem, onde cortar, que texto pôr e que efeito colocar. No fim, confira comigo a lista de planos do bloco antes de passar para o próximo.
