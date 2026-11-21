# 06 — Pipeline de edição (montagem e render) — o que funcionou no vídeo 1

Tudo é feito por código, sem editor de vídeo. Ambiente usado: Linux com ffmpeg, Python 3, Node 22, Chromium headless (Playwright em `/opt/pw-browsers`). Arquivos de apoio em `assets/`.

## Passo a passo
1. **Texto para IA** — `assets/scripts/preparar_texto_ia.py roteiro_final.md` → `tts_blocos.json` + `texto_para_IA.txt`. Revisar: números por extenso, sem siglas, sem dígitos. **Regra crucial: uma linha de narração por parágrafo do roteiro** (é assim que o alinhamento cruza marcação ↔ tempo).
2. **Narração** — o dono gera no site do ElevenLabs com a voz dele e envia o MP3.
3. **Tratar áudio** — cadeia ffmpeg de `references/04` → `voz_tratada.wav` (-16 LUFS). Medir com `assets/scripts/medir.py` (antes: faixa de 5,2 dB entre frases; depois: 2,3 dB).
4. **Alinhar** — `assets/scripts/alinhar_e_eventos.py voz_tratada.mp3 texto_para_IA.txt tts_blocos.json roteiro_final.md render/src/data.json` → tempos de cada parágrafo/trecho + eventos (palavras-chave com o tempo exato da palavra dita, etiquetas, fontes). Os movimentos do CONTADOR são definidos à mão no array `CONTADOR` de `ui.tsx` (usando `P(i)` = início do parágrafo i).
5. **Trilha e efeitos** — `assets/scripts/gerar_musica.py` (5 faixas por tensão) e os efeitos de `references/04` (gerar uma vez, reaproveitar).
6. **Cenas** — copiar `assets/template_remotion/` para `render/`, rodar `npm i remotion@4.0.242 @remotion/cli@4.0.242 @remotion/renderer@4.0.242 @remotion/bundler@4.0.242 react@18.3.1 react-dom@18.3.1 d3-geo@3.1.1 topojson-client@3.1.0 world-atlas@2.0.2 @fontsource/oswald@5.1.1 @fontsource/inter@5.1.1`, colocar `perfil.png` em `render/public/`. Reescrever `src/scenes.tsx` para o novo roteiro (uma função de cena por trecho, tempos via `P(i)`/`SEG(k)`).
7. **Conferir quadros** — `node stills.mjs 5 20 40 ...` gera JPGs em `stills/` nos segundos pedidos. Montar grades e revisar TUDO antes do render (texto sobreposto, mapa no lugar errado, escala).
8. **Render** — `npx remotion render src/index.ts Video out/video_mudo.mp4 --concurrency=4 --muted --crf=20` (16 min de vídeo ≈ 1-2 h em 4 núcleos).
9. **Mixar** — `assets/scripts/mixar.py` (voz + música com ducking por sidechain + efeitos) → `mix_final.wav` em -14 LUFS.
10. **Juntar** — `ffmpeg -i out/video_mudo.mp4 -i mix_final.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest video_final.mp4`.

## Biblioteca de cenas do template (`prims.tsx`)
- `Mapa` — mapa Mercator real (world-atlas 50m) com Brasil destacado; `sa` desloca a América do Sul (deriva continental/Pangeia), `plataforma` desenha a faixa de terra nova (era do gelo), `semMar` apaga o litoral, `calor` sobrepõe calor, `extra` recebe pinos/setas em coordenadas reais (`pt(proj, lon, lat)`).
- `Globo` — globo ortográfico (capas de latitude escurecidas/destacadas).
- `Vulcao` — ilha vulcânica em corte com régua de profundidade (mar mais baixo, erosão, atol, pôr do sol).
- `Ceu` + `Estrela` + `Silhueta` — céu do hemisfério sul com palmeiras.
- `Faixas` — barras mín–máx (cenários). `Predio` — prédio com água subindo. `Linha` — linha do tempo. `Seta`, `Pin`. `Selo` — selo final com botão inscrever-se.
- `ui.tsx` — fundo `Espaco`, `Cena` (fade + push-in), `Contador` (odômetro em escala log), `Palavras`, `Etiquetas`, `Fontes`.

## Armadilhas já resolvidas
- SVG sem `position:absolute` fica escondido atrás de camadas posicionadas → regra global `svg{position:absolute}` no `Video.tsx`.
- Render lento por recalcular mapas a cada quadro → cache de paths por (centro, escala, país) e escala arredondada.
- Encaixe da Pangeia: transladar o Cabo de São Roque até perto de (-9°, 4,6°) (costa da Libéria); mais que isso a América do Sul "entra" na África.
- Círculo de cratera: raio em px = (raio_km/111) × escala × π/180 na Mercator.
- Fontes: usar @fontsource (local) em vez de Google Fonts por rede.
- `require()` dentro de TSX quebra o bundle — usar import.

## Checklist de qualidade antes de entregar
- [ ] Nenhum texto sobreposto a outro (palavra-chave × números da cena).
- [ ] Contador some ~4 s depois de cada parada.
- [ ] Cada palavra-chave aparece no momento em que é dita.
- [ ] Música não compete com a voz; efeitos quase imperceptíveis.
- [ ] Loudness final -14 LUFS, pico ≤ -1 dBTP.
- [ ] Último quadro: contador central + selo do canal.

## Lições do vídeo 2 (piloto aprovado em etapas)
- **Piloto primeiro** (~2 min: intro + 2 blocos), storyboard de quadros a cada 6 s, só depois o resto em lotes.
- **Edição dinâmica**: cenas de 4-8 s, várias "batidas" por parágrafo, coreografadas no tempo exato das palavras (alinhamento).
- **Texto nunca escala com o zoom**: `Cena` tem a prop `fixo` (camada sem push-in) — todo texto/rótulo vai nela. Rótulos HTML (`Tag`) com pílula escura + filete colorido.
- **Palavras-chave**: caixa escura translúcida, sombra, texto BRANCO e filete colorido embaixo (a cor indica o sentido). O dono não gostou de texto colorido solto (ex.: verde).
- **Personagens 2D**: silhuetas com proporção real (membros grossos, articulações, ciclo de caminhada), nunca "palitinho". Objetos fiéis ao real (mandacaru com braços em candelabro, chapéu de couro, palafitas, sombrinha de frevo, lampião colonial, paralelepípedo).
- **Fundos reais + 2D por cima**: espaço = panorama ESO (Via Láctea, CC BY 4.0, creditar); mapas = Natural Earth HYP_HR_SR_OB_DR (naciscdn.org, domínio público, 21600 px) em projeção equirretangular com tratamento noturno (brightness 0.7); noite = "The earth at night" (NASA) via miniatura 3840 px do Commons.
- **Rede**: Commons bloqueia arquivo original (429) — usar miniatura `/thumb/<h>/<hh>/<nome>/3840px-<nome>` (hash md5 do nome). eoimages.gsfc.nasa.gov e images-assets.nasa.gov ficam bloqueados no ambiente padrão.
- **ElevenLabs**: a conta permite só 2 pedidos simultâneos — gerar em fila (1 por vez). Efeitos longos (grilos, rio) cortados para ≤ 6 s com fade; música 3-4 dB mais baixa que o padrão (o dono quer bem sutil): trilhas em -31 a -34 LUFS antes do ducking.
- **Créditos**: manter `CREDITOS.md` por vídeo e colar na descrição.

## Lições da montagem completa do vídeo 2
- **Lotes**: um arquivo de cenas por lote (`lote1.tsx`…), cada um com seu `HUD_LOTEn`; `Video.tsx` só junta. Revisar stills de cada lote antes de seguir.
- **Movimento de fundo nunca pode depender do tempo absoluto do vídeo** (bug do vídeo 2: o fundo escorregava e mostrava a borda depois de 1-2 min). Use oscilação limitada (`sin(t)`) com `scale` que cubra a amplitude.
- **Cronômetro adaptativo** (`fmtCron`): HH:MM:SS → "N DIAS" → "N MESES" → "A ANOS E M MESES" → "1.000.000 DE ANOS"; interpolação logarítmica em saltos grandes.
- **Palavras-chave**: ajustes manuais de tempo em `ajustes_palavras.py` (rodar depois do alinhamento) quando a frase-gatilho vem depois da palavra que casou.
- **Créditos do ElevenLabs acabam**: 1 vídeo de ~12 min consumiu ~10 trilhas + 10 efeitos. Gerar as trilhas do vídeo todo ANTES de começar a edição e reaproveitar faixas por clima (mistério, curiosidade, grave, encanto, calma, melancolia, orgânico) se faltar crédito.
- **Render**: não rodar stills/mixagem junto com o render longo (divide a CPU). Matar renders antigos com `pkill -9 -f remotion; pkill -9 -f chrome-headless`.

## Regras anti-sobreposição (apontadas pelo dono no vídeo 2)
- **Faixa da palavra-chave é reservada**: y ≈ 160–265 px no centro. Nenhum rótulo/painel de cena acima de y = 310 (Tag) ou top = 300 (div). Contador fica em y < 140.
- **Texto da cena sai antes da transição** (`Cena` usa `opTxt` que zera em `to - fade*0.4`): o texto da cena que sai nunca aparece por baixo do texto da próxima.
- **Ordem de camadas**: cenário de fundo (casas, margem) antes de personagens e onda — nunca desenhar cenário por cima de personagem.
- **Não repetir em rótulo o que a palavra-chave já diz** (ex.: "TUDO EM MILHÕES DE ANOS" sob "MILHÕES DE ANOS, NÃO SÉCULOS").
- **QA final obrigatório**: extrair 1 quadro em cada palavra-chave (+0,9 s), etiqueta (+1,5 s) e fonte (+2 s) do vídeo final, montar grades 4x4 e revisar todas antes de entregar.

## Lições do vídeo 5 (temperatura) — pedido do dono, nov/2026
- **Câmera sempre suave**: todo movimento usa easeInOutSine (sem tranco no começo nem no fim); zoom lento (≈3–5% por plano); nada de "pulo" de zoom entre dois planos da mesma cena — use fusão de 0,3–0,45 s quando a mesma cena muda de enquadramento; corte seco só entre cenas diferentes; clarão só nas 2–3 viradas grandes.
- **Planos de no máximo 5 s** (checar a lista inteira: inclusive planos "contínuos" — dividir em enquadramentos com fusão).
- **Pouco texto**: no máximo 1 elemento de texto por plano; carimbos em área livre definida por cena (nunca sobre personagem, número ou outro texto).
- Imagens reais ≤ 10% do vídeo; o resto em 2D vetorial próprio (personagens com 6 expressões, frente e costas).
- Fluxo: lista de cortes gerada por script a partir das frases alinhadas (`gerar_cortes.py`) → `cortes.json` → `Video.tsx` → storyboard em PDF com 1 frame real por plano (`montar_storyboard.py`).

## Regras do dono (nov/2026, vídeo 6) — prints de notícia e zoom
- **Print de notícia**: mostrar SÓ o parágrafo da notícia (recorte do elemento, sem foto/vídeo do veículo), em cartão branco sobre um fundo escuro e desfocado (mapa, ShakeMap ou cena do assunto). **Grifo amarelo animado**: as linhas vão sendo grifadas na ordem, do 1º ao último segundo do plano, acompanhando a fala. Nome da fonte sempre visível ("FONTE: CNN BRASIL · 24/06/2026"). Plano ≤ 5 s. Script: `print_paragrafo.js` (Playwright: recorte do parágrafo + posição de cada linha em JSON).
- **Zoom**: um único movimento por plano, numa só direção (só in OU só out), muito leve e contínuo até o fim do plano — nunca "zoom e volta". Em planos seguidos da mesma cena, o zoom continua de onde parou (não reinicia). Em cenas que já têm movimento próprio (pessoa andando, carro, avião, tremor), zoom quase imperceptível (≈1–1,5% no plano inteiro). Cenas paradas: ≈2–3%.
- Movimentos sempre suaves (easeInOutSine), sem trancos.
