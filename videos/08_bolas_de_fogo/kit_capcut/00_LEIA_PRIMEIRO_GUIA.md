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
| `07_prints_noticias/` | 4 prints de notícia REAIS já animados (cartão branco sobre vídeo desfocado, grifo amarelo linha a linha e fonte visível): Metrópoles (2), O Povo, Brasil de Fato. É só soltar no tempo do CSV. |
| `08_3d/` | Animação 3D do barco navegando pelo Solimões até Manaus sobre o mapa em relevo (modelo gratuito do Poly Haven), usada na parte dos "dias de barco" e da viagem da notícia. |
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
- Prints de notícia: Metrópoles (ago/2020), O Povo (04/09/2020), Brasil de Fato (13/04/2023) — o nome da fonte já aparece no cartão.
- Barco 3D: modelo "Ship Pinnace" do Poly Haven (CC0); relevo: Natural Earth (domínio público).
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

---

# EDIÇÃO PROFISSIONAL COM TUDO O QUE O CAPCUT OFERECE (ordem do dono)
Use **bastante** os recursos do CapCut, mas sempre dentro da essência do canal: documentário sério, cinematográfico, com mistério e ritmo. Nada de efeito infantil, emoji, sticker engraçado ou transição "de vlog". A edição tem que ser **dinâmica**, com algo acontecendo a cada plano.

## 1. Cor e filtros (o "look" do canal)
- Aplique um **ajuste de cor global** (camada de ajuste por cima de tudo): contraste +10, realce/destaques −10, sombras +5, nitidez +10, temperatura levemente quente (+5) na Amazônia de 1930, e levemente fria (−5) nas cenas de ciência e espaço (Ato 3).
- **Filtro** cinematográfico suave (ex.: família "Filme"/"Movie" ou "Cinematográfico", intensidade 20–35%). Nos planos de 1930 (frei, vila, jornal, Rio 1930), um filtro de **filme antigo/vintage leve** (sépia sutil, 15–25%).
- Mantenha as cores NATURAIS: o vermelho só domina nas cenas do céu em chamas. Não saturar.
- **Vinheta** leve em todo o vídeo e **grão de filme** sutil (efeito "Grão"/"Film grain", 10–20%).

## 2. Transições (com critério)
- Entre planos do mesmo assunto: **corte seco** (é o padrão e dá ritmo).
- Na troca de BLOCO (Introdução → Ato 1 → Ato 2 → Ato 3 → Lado a lado → Ato 4 → Fecho): transição marcante e curta (0,3–0,5 s): **flash branco**, **luz vazada (light leak)**, **desfoque de zoom (zoom blur)** ou **chicote (whip pan)**, acompanhada de um **whoosh**.
- Nas **explosões e impactos** (abertura plano 4, H09, H19, H39, H41, H42): **flash branco** de 3–5 quadros no corte, seguido de **tremor de câmera** (efeito "Shake"/"Tremor", forte no 1º segundo e diminuindo).
- Ao entrar num **gráfico/mapa**: transição de **desfoque** ou **zoom in** rápido (0,3 s).
- Ao entrar numa **foto real em cartão**: o cartão entra com **escala + fade** (de 90% para 100% em 0,4 s) e uma leve **sombra**.
- Viagem no tempo (1930 → 1995, 1930 → 2020): **glitch leve** ou **"film burn"** de 0,4 s.
- Não use transições 3D giratórias, cubos, páginas virando, nem a mesma transição duas vezes seguidas.

## 3. Efeitos de imagem (para dar vida)
- **Tremor de câmera** em explosões, tremores de terra e impactos.
- **Brilho/glow** e **flash** nas bolas de fogo e nos clarões.
- **Light leaks / reflexo de lente** (lens flare) nos amanheceres e no sol vermelho (sutil).
- **Partículas de poeira/cinzas** (efeito de partículas ou overlay) sobre as cenas do pó vermelho caindo.
- **Velocidade (speed ramp)** em 2–3 momentos fortes: a bola de fogo (abertura plano 3) e o airburst (H39) acelerando até o impacto.
- **Zoom com keyframe** leve e contínuo só em imagens paradas (gráficos de mapa já vêm animados: não precisa).
- **Desfoque de fundo** atrás das fotos reais (cartão) e atrás dos textos grandes, quando o fundo estiver poluído.
- Efeito **"Fita VHS/filme antigo"** curto e sutil apenas no Rio 1930 (H29) e no jornal do Vaticano.

## 4. Texto animado (todos os textos da coluna "texto na tela")
- Fonte **Oswald Bold** (ou similar condensada), branco, MAIÚSCULAS, caixa escura translúcida com traço dourado embaixo (estilo do canal).
- Animação de entrada variada, mas elegante: **máquina de escrever** (datas e nomes: "7 MESES DEPOIS", "TUNGUSKA BRASILEIRO"), **subir com fade**, **revelar por máscara/linha**, **zoom suave**. Saída: **fade** rápido.
- Números grandes ("~1 MEGATON", "1.500 FERIDOS", "R$ 120 MIL", "MENOS DE 9 METROS"): entrada com **escala/pulo leve** + **brilho**, e o efeito sonoro "pop/impacto" baixinho.
- Palavras de suspense ("NINGUÉM SOUBE", "O QUE CAIU?", "UMA CRATERA?"): **glitch leve** ou **tremida** curta.
- Legendas de lugar/data (ex.: "RIO CURUÇÁ · AMAZONAS · 1930"): canto inferior esquerdo, pequenas, com **digitação**.
- Sempre UM texto por plano. Nada de texto sobre texto ou tapando rosto e foco da cena.

## 5. Efeitos sonoros (biblioteca do CapCut + pasta 05_audio/efeitos)
- Além dos efeitos do kit, use a **biblioteca de som do CapCut**:
  - **whoosh/swoosh** em todas as transições de bloco e ao entrar texto grande;
  - **boom/impacto grave/sub drop** nas explosões;
  - **rumble/tremor** nos tremores;
  - **vento/ar** nas cenas aéreas;
  - **papel/folhear** no jornal e no caderno;
  - **máquina de escrever** nos textos digitados;
  - **clique/carimbo** quando uma prova entra na pasta do caso;
  - **ambiente de floresta/rio** nas cenas da Amazônia;
  - **multidão** no Rio 1930;
  - **vidro quebrando** em Chelyabinsk e no Rio;
  - **sirene distante** depois do impacto no Rio.
- Para o meteoro, prefira **rugido grave + estalos de fogo (crackle)**, não assobio agudo.
- Volume dos efeitos: 15–35% (explosões até 60%), sempre abaixo da voz. Use **fade** de entrada e saída em ambientes.
- Use o recurso de **redução automática (ducking/"Destacar voz")** para o som nativo e os efeitos baixarem quando a narração fala.
- Música: **não colocar por enquanto** (o dono vai mandar depois).

## 6. Ritmo (edição dinâmica)
- Algo muda a cada 2–5 s: corte, movimento, texto, efeito ou som. Nunca uma imagem parada sem movimento.
- Nos momentos de clímax (abertura, explosões, "ninguém soube", "e se fosse aqui?", Chelyabinsk), acelere: planos mais curtos, flash, tremor e impacto sonoro.
- Nos momentos de reflexão (o frei, o caderno, o fecho), desacelere: mais respiro, transições suaves (dissolve curto), menos efeitos.
- Logo depois de uma explosão, deixe 0,3–0,5 s de "silêncio" (só um zumbido grave) antes da voz voltar: dá impacto.

## ADENDO AO PROMPT DO GPT (cole junto)
> Além de seguir o timeline.csv, use TODOS os recursos do CapCut que deixem a edição profissional e dinâmica, dentro do estilo de documentário cinematográfico do canal: ajuste de cor global e filtros cinematográficos suaves (vintage leve nas cenas de 1930), vinheta e grão, transições marcantes só nas trocas de bloco (flash, light leak, zoom blur, whip pan com whoosh), flash + tremor de câmera nas explosões, speed ramp nos clímax, partículas e lens flare sutis, textos animados (máquina de escrever, subir com fade, revelar, glitch leve nas frases de suspense, números com escala e brilho) e efeitos sonoros da biblioteca do CapCut (whoosh, boom, rumble, papel, máquina de escrever, ambiente de floresta, vidro, multidão), com redução automática sob a voz. Sem música por enquanto. Nada infantil, nada de stickers, nada de texto sobre texto, nenhum clipe em loop. Siga a seção "EDIÇÃO PROFISSIONAL" do guia.
