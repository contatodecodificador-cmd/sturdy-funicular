# Memória do Canal (histórico de roteiros)

Canal de história em **alemão** para o público **DACH** (Alemanha, Áustria, Suíça). Exemplos, cidades e referências sempre ligados a essa região quando possível.

## Regras fixas
- Duração: 10–15 min (≈ 1.500–2.250 palavras de narração).
- Lógica do canal: gancho forte com detalhe concreto → pergunta central (igual à thumbnail) → contexto → análise → veredito → gancho para o próximo vídeo da série.
- **Nunca repetir a mesma estrutura** de um roteiro anterior. Consultar a tabela abaixo antes de criar um novo.
- Tom: sóbrio, factual, sem glorificação; separar fato de lenda; citar fontes duvidosas como duvidosas.

## Roteiros já feitos
| # | Título | Estrutura usada | Elementos únicos | Gancho final |
|---|---|---|---|---|
| 01 | Marne 1914 – Warum verlor Deutschland die Marneschlacht? (referência do canal, não feito por mim) | **Tribunal**: Anklage → 4 Beweise → Verteidigung → „Was wäre wenn“ → Urteil | Frase com giz „Ausflug nach Paris“ abre e fecha | Tannenberg |
| 02 | DÜNKIRCHEN 1940: Warum stoppte Hitler seine Panzer kurz vor dem Sieg? | **Stopp-Uhr**: Cold Open no momento da ordem → flashback (10 dias) → 48 h em montagem paralela (lado alemão/britânico) → **Faktencheck** de 5 explicações (Legende/teilweise/belegt) → a conta → teaser | Relógio gráfico contando as horas; âncora regional Felsennest (Eifel), Hitler em Flandres 1914, 2. Panzer-Division de Viena, Frieser (MGFA) | Unternehmen Seelöwe |

## Estruturas ainda NÃO usadas (ideias)
- Biografia de um dia / „Ein Tag im Leben“ de um soldado ou cidade alemã
- Contagem regressiva (Top 5 erros)
- Duas perspectivas lado a lado (Duell: dois comandantes)
- Mistério / documento perdido (partir de uma fonte e desvendar)
- Linha do tempo invertida (começa no fim)

## Fluxo de edição (desde o vídeo 02)
1. `edicao/<nn>/edl.py` → lista de planos sincronizada com o SRT (verificar SRT × áudio antes).
2. `tools/mapengine` → mapas 3D (three.js + Chromium); cenas em `scenes.js`, render por plano com `render_maps.py`.
3. `render_shots.py` → fotos/vídeos/gráficos com zoom, sépia, cartões digitados (fontes stencil do canal).
4. `assemble.py` → concatena, gera SFX sintetizados (whoosh, digitação, carimbo, tique-taque, impacto) e mixa com a narração (-14 LUFS).
Fontes de vídeo em domínio público: Why We Fight (Divide and Conquer, Battle of Britain), War Dept Film Bulletin 56 (archive.org).
Evitar planos com suásticas grandes / textos em inglês (público DACH, YouTube DE).
