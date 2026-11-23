# 13 — Fluxo atual de produção e TODAS as regras do dono (nov/2026)

Este arquivo resume o que foi aprendido nos vídeos 1 a 8. **Leia antes de qualquer etapa.** Quando houver conflito com arquivos mais antigos, este vence.

## 1. O que performa no canal
- O vídeo que mais performou: **"O que vai acontecer com o BRASIL daqui a 1 MILHÃO DE ANOS?"** (thumbnail: Pão de Açúcar com a baía seca e rachada, barco encalhado, número gigante "1.000.000"). Os outros formatos (escadas genéricas, temperatura, Lua) foram fracos.
- A linha "o que vai acontecer com o Brasil daqui a X anos" **já foi feita**; o dono não quer repetir o mesmo título.
- **Linha atual:** um ACONTECIMENTO surpreendente ou surreal, de preferência REAL, ligado ao Brasil, com uma thumbnail de contraste forte num lugar conhecido (Cristo Redentor, Copacabana, Pão de Açúcar, Amazônia). Exemplo: vídeo 8, "O Dia em Que BOLAS DE FOGO Caíram na AMAZÔNIA" (Evento do Curuçá, 1930).
- Pesquisa de temas: buscar no YouTube (yt-dlp `ytsearch10:<termo>` com `--flat-playlist -j`) e medir a concorrência em português. Preferir temas com demanda comprovada lá fora e pouca concorrência aqui. Referências em inglês (Astrum, Cleo Abram, RealLifeLore, What If, xkcd) trazidas para o Brasil.

## 2. Título, thumbnail e descrição
- **Título:** palavras-chave em CAIXA ALTA ("O Dia em Que BOLAS DE FOGO Caíram na AMAZÔNIA").
- **Thumbnail:**
  - imagem fotorrealista em tela cheia, com cores NATURAIS (não tudo vermelho), e um único ponto de cor forte (a explosão);
  - texto de 1 ou 2 palavras no máximo, que COMPLETE o título sem repetir. Nada de datas tipo "1930" ("faz muito tempo, ninguém clica"). Exemplos: "FOI REAL", "NINGUÉM SOUBE";
  - o texto fica numa área vazia, sem tapar o foco; branco, grosso, com contorno escuro.
  - Montagem: gerar a imagem (Canva generate-image ou Higgsfield) e montar no Canva (YouTube Thumbnail 1280×720). Só salvar (commit) no Canva com a aprovação do dono.
- **Descrição:** palavras do título em CAIXA ALTA no primeiro parágrafo, uma pergunta para comentar, poucos capítulos (só as viradas), FONTES e CRÉDITOS escritos SEM links, e as tags.

## 3. Roteiro
- 12 a 15 minutos (~1.900–2.300 palavras; a voz lê ~150 palavras por minuto).
- **A introdução entra direto no que o título promete**, com uma frase de impacto tirada do título, e traz o contraste forte logo no começo (ex.: "Na manhã de treze de agosto de mil novecentos e trinta, bolas de fogo caíram do céu da Amazônia… E o Brasil não ficou sabendo.").
- **Abertura em vídeo ANTES da narração** (cold open de ~20–25 s, 5 planos): a cena acontece primeiro (ex.: pescador tranquilo, a bola de fogo cai, a explosão), e só depois o narrador começa.
- Cada roteiro com estrutura DIFERENTE dos anteriores (tabela em `08_unicidade_entre_videos.md`). Fatos com fonte e grau de confiança (`pesquisa.md`); o que é incerto vira honestidade na fala.
- O texto para a IA: números por extenso, sem dígitos, sem siglas.

## 4. Narração (ElevenLabs)
- Voz: **Anderson Nogueira com selinho** (clonagem profissional, PVC) `yadCDjzaN5V6nqbIkYiU`. A antiga, instantânea, é `jZ0KzfdIFfYFdHDyYgUn`; preferir a PVC.
- Modelo `eleven_v4`, `language_code: pt`, stability 0.5, similarity 0.8, style 0, speaker boost.
- Gerar a intro primeiro como teste e depois o corpo em partes de até ~3.800 caracteres; juntar com 0,7 s de pausa e loudnorm −16 LUFS.
- Alinhamento: `POST /v1/forced-alignment` (file + text) → tempos de cada palavra. Conferir se cobre do início ao fim e se não há palavra com loss muito alto.
- **Créditos:** a música (music_v1) gasta MUITO (~1.650 créditos por faixa de 2 min). Os efeitos (sound-generation) são baratos. Gerar música só quando o dono mandar; avisar o saldo.

## 5. Visual — o que o dono APROVA e REPROVA
**Reprovado (não repetir):**
- Silhuetas vetoriais simples, bonecos "robóticos" e cenários 2D chapados ("muito zoado").
- Imagens geradas no Canva para as cenas ("ficou muito fora"). Usar o Canva só para thumbnail.
- **Animação em loop:** quando a mesma cena cobre vários planos, ela NÃO pode recomeçar a cada corte. A animação corre do começo ao fim da sequência; se a fala é mais longa, crie outra cena ou estenda a mesma, nunca repita.
- Texto sobre texto (legenda + palavra-chave + rótulo do mapa ao mesmo tempo).
- Efeito sonoro artificial (o "assobio" do meteoro gerado ficou falso: prefira rugido grave com estalos).

**Aprovado:**
- **Vídeos gerados no Higgsfield** (imagem no Seedream 5.0 Pro 2K → animação no Seedance 2.5, 5 s, 16:9). A abertura do vídeo 8 "ficou boa demais".
- **Mistura**: vídeos de IA + mapas reais em 3D/relevo + gráficos e motion bem feitos + **prints de notícia** + **fotos e vídeos reais**.
- **Fotos e vídeos reais** em formato de "cartão": a imagem real no centro da tela (porque costuma ter pouca qualidade), com moldura e sombra, sobre um fundo bonito e relacionado ao assunto (desfocado ou um vídeo de IA escurecido), com crédito pequeno.
- **Prints de notícia:** só o parágrafo, em cartão branco sobre fundo escuro desfocado, com grifo amarelo animado acompanhando a fala e o nome da fonte visível.
- Objetos 3D de verdade quando a cena pedir (ex.: canoa/barco numa viagem pelo mapa). Modelos gratuitos: Poly Haven (`api.polyhaven.com`, ex.: `ship_pinnace`), renderizados no Blender (bpy local na CPU ou GPU na RunPod).

## 6. Regras de edição (todas obrigatórias)
- Planos de **no máximo 5 s**. O corte acompanha a fala (pausas e pontuação).
- **Zoom:** imagem parada = UM zoom leve, linear, do primeiro ao último quadro (nunca vai-e-volta). Plano que já se move (vídeo de IA, globo girando, câmera andando) = sem zoom.
- **Um texto por plano no máximo.** Faixa da palavra-chave reservada no alto; rótulos de mapa nunca na mesma faixa.
- Música bem baixa e efeitos sutis; voz sempre na frente. Volume final −14 LUFS.
- Sem CTA no meio; um único pedido de inscrição no fim.
- Imagens geradas por IA levam a legenda "(reconstituição)" ou "(ilustração)" quando parecem fato histórico.

## 7. Fluxo com o Higgsfield (o dono gera; Claude monta)
1. Claude escreve um arquivo de prompts numerado (ex.: `higgsfield_video_completo.md`), com uma seção por plano: nome, prioridade (A/B), COM/SEM ÁUDIO, prompt da IMAGEM e prompt do VÍDEO (em inglês). Personagens fixos descritos e com imagem de referência (o primeiro plano de cada personagem vira a referência dos outros). No fim vai a mensagem pronta para colar no chat do Claude que tem o Higgsfield conectado.
2. O dono gera lá (plano gratuito) e devolve a lista "H06 — imagem: <job_id> — vídeo: <job_id> — link: <url>".
3. Claude baixa os vídeos pelo link (`d8j0ntlcm91z4.cloudfront.net`, precisa estar liberado na rede) e encaixa cada um no tempo da fala. Vídeos de 5 s em 720p (1280×720, 24 fps): converter para 1920×1080 a 30 fps com `scale=1920:1080:flags=lanczos,fps=30`.
4. Plano que já é vídeo de IA = sem zoom adicional.

## 8. Montagem técnica (Remotion)
- O projeto do vídeo 8 é o modelo: `assets/template_v8/` (src, scripts e o planos8.py). Copiar para `videos/NN_tema/render/`, apontar `node_modules` (npm i das versões do `package.json`) e trocar a lista de cenas.
- `storyboard/planos8.py`: lê `audio/alinhamento.json` + `audio/paragrafos.json` e gera `render/src/planosN.json` (um item por plano, ≤5 s, cortes na pontuação). Cada parágrafo recebe a lista de visuais `('Componente:arg', 'mov'|'zoom', 'descrição', 'TEXTO NA TELA'|None)`.
- `Video8.tsx`: junta planos iguais em SEQUÊNCIAS (`SEQ`): o tempo da animação é o da sequência inteira (não recomeça) e cada corte troca o enquadramento. HUD fixo (no vídeo 8: "pasta do caso" com provas 0/6). Componente `Foto` para imagens/vídeos de fundo com movimento contínuo.
- Stills de conferência: `node stills.mjs Video8 0.25 <tempos...>` → grade de quadros com PIL. Revisar sobreposição de texto antes de renderizar.
- Render em partes (`render_partes.sh`, 4 pedaços + concat) para não perder tudo numa falha.
- Mixagem: `mixar7.py` (voz + música por bloco com ducking por sidechain + efeitos ligados aos planos) → −14 LUFS.
- Final: H.264 CRF 19–20, AAC 192k, faststart, abaixo de ~400 MB para 12 min.
- **Kit CapCut** (quando o dono quiser editar fora): `kit_capcut.py` + `kit_stills.mjs` → imagens limpas nomeadas por cena, clipes, áudio separado (narração, música, efeitos alinhados em 0:00), `cenas.csv` e `GUIA_DE_EDICAO.md` com o prompt para o GPT.

## 9. Ambiente e rede (Claude Code na nuvem)
- Hosts que precisaram ser liberados na rede do ambiente:
  - `api.elevenlabs.io` (com a chave);
  - `export-download.canva.com` e `media.canva.com` (baixar do Canva);
  - `d8j0ntlcm91z4.cloudfront.net` (vídeos do Higgsfield);
  - `upload.wikimedia.org` e `commons.wikimedia.org` (fotos reais);
  - `g1.globo.com` e outros sites de notícia (prints);
  - `api.polyhaven.com`, `dl.polyhaven.org` e `cdn.polyhaven.com` (modelos 3D);
  - `naciscdn.org` (mapas em relevo);
  - RunPod (`api.runpod.io` e o proxy do pod) para render 3D na GPU.
- Chaves de API: sempre pelo formulário seguro (`request_credential`), nunca no chat. Para ferramentas que exigem chave no cabeçalho, usar um valor falso ("x"); o proxy injeta a verdadeira.
- **Wikimedia:** a API dá 429 com facilidade. Baixar pela miniatura direta: `https://upload.wikimedia.org/wikipedia/commons/thumb/<h0>/<h0h1>/<Nome>/1920px-<Nome>` (h = md5 do nome com `_`). Se a imagem for menor que a largura pedida, dá 404: tentar 1280 ou o original. Sempre anotar autor e licença para os créditos.
- **Canva → arquivo em alta:** gerar as imagens (generate-image), criar um design 1920×1080, adicionar uma página por imagem (`add_page` + `update_fill` com o id da imagem, tudo numa chamada), salvar, exportar JPG 1920×1080 (vem uma URL por página) e baixar.
- **RunPod (3D na GPU):** só ligar a máquina com aprovação do dono e com todo o material pronto; apagar (podTerminate) logo depois.
- YouTube bloqueia transcrições automáticas; pedir ao dono para colar a transcrição ou mandar o vídeo pelo Google Drive.

## 10. Checklist antes de entregar
- [ ] Nenhum plano com mais de 5 s, e nenhuma animação recomeçando no corte.
- [ ] Um texto por plano; nada tapando o foco da imagem.
- [ ] Imagens reais em cartão, com crédito; imagens de IA identificadas.
- [ ] Efeitos no momento exato (explosões, impactos); som natural, nada artificial.
- [ ] Voz na frente, música baixa, −14 LUFS.
- [ ] Descrição com fontes e créditos sem links.
- [ ] Commit e push dos scripts; arquivos pesados no .gitignore.
