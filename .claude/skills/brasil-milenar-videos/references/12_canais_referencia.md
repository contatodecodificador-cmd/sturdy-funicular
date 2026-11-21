# 12 — Canais de referência (inglês → trazer para o Brasil)

Regra do dono (nov/2026): **buscar referências SEMPRE em canais em inglês** e trazer os temas/títulos para dentro do Brasil (adaptar, nunca copiar). Manter uma **base de dados de canais** para nunca ficar sem tema — consultar a base antes de pesquisar do zero.

## Canal-modelo principal
- **Astrum** — youtube.com/@astrumspace/videos — referência nº 1 para **títulos, temas e estilo** (espaço/ciência com escala, mistério e comparação). Usar para: (1) "hackear" estruturas de título; (2) achar temas de alta demanda; (3) encontrar canais parecidos com o mesmo potencial (via canais semelhantes / recomendações / vidIQ similar channels).

## Quando o dono pedir ("busca mais canais" / "cria a planilha")
1. Partir do Astrum: analisar os vídeos mais vistos (views, data, outlier) e extrair padrões de título.
2. Achar canais semelhantes em inglês (vidIQ `similar_channels`/`channel_search`, recomendações do YouTube, buscas por tema) com o mesmo potencial (views altas por vídeo, canal faceless/científico, crescimento recente).
3. Criar/atualizar a planilha `videos/canais_referencia.xlsx` com colunas: canal · link · inscritos · média de views recentes · nicho · formato · melhores vídeos (título, views, data) · estrutura de título · tema adaptável ao Brasil (ideia + ângulo brasileiro) · concorrência em PT · nota.
4. Cada tema adaptado entra também na fila de `05_ideias_e_titulos.md`.

## Canais já vistos nas pesquisas (semente da planilha — conferir números ao montar)
- EarthquakeSim (simulações de terremoto 3D; "3D Earthquake SIZE Comparison" 6,2 mi) — análise em `11_analise_terremoto_3d.md`
- What If (E se…; espaço e cenários)
- Kurzgesagt – In a Nutshell
- Cleo Abram ("buraco atravessando a Terra" 13,7 mi)
- Epic Spaceman (escala; "encolher até átomo" 4,7 mi)
- Timebound (temperaturas)
- The Paint Explainer (trocar o Sol)
- Cosmic Witness (estrelas, menor → maior)
- Reigarw Comparisons (comparações; magnitudes 5,9 mi)
- xkcd's What If? (magnitude 15: 9,1 mi)
- RealLifeLore (geografia/escala)
- WatchData / Debunked (quedas, corpo humano)

## Base montada (nov/2026)
- Planilha: `videos/canais_referencia.xlsx` (abas: Temas para o canal · Canais · Vídeos que estouraram · Concorrência PT). Script: `videos/pesquisa_canais/montar_planilha.py` (dados brutos em `videos/pesquisa_canais/dados/`).
- Canais novos que entraram pela busca de semelhantes do Astrum: Astrum Extra, Space Matters, Stargaze, SEA, Destiny, ReYOUniverse, Kosmo, Cool Worlds, Insane Curiosity, GeologyHub, Dark Records, Primal Space, The Cosmic Witness.
- Método sem créditos do vidIQ: `yt-dlp --flat-playlist --playlist-end 50 -J <canal>/videos` (views dos últimos 50 vídeos → mediana → outliers ≥2×) e `yt-dlp --flat-playlist -J "ytsearch12:<tema em PT>"` para medir a concorrência em português.
- Padrões de título que mais estouram (nov/2026): "What Lies Beneath [lugar]?" · "X Is So Huge Your Brain Can't Comprehend It" · "You Are Alive to Watch..." · "What Happens After X Is Worse Than X" · "What If X Came Closer / Entered Our Solar System".
