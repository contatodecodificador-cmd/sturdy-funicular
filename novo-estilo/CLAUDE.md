# CLAUDE.md · linha nova "O Tempo Parou" (estilo Praça ao Sol)

Memória desta linha de vídeos. Leia antes de mexer em qualquer coisa em `novo-estilo/`.
Trabalhe só no branch `claude/novo-estilo`. Não mexa em `series/`, `entregas/`, `kit/` (são do Contos do Vigia).
Fale com o dono em português do Brasil, simples, e mostre as coisas como imagem sempre que der.

## Regras que não se quebram
1. **Nada do kit "Método Histórias que Prendem"** (nem código, peça, som, texto ou estrutura). Tudo aqui é escrito do zero.
2. Referências (Resta Um Studios e outras) servem só de **princípio** (ritmo, densidade de informação). Nunca copiar personagem, nome, frase, logo, etiqueta ou premissa.
3. Público família: sem sangue/gore, sem violência, sem criança em perigo, sem pessoa ou marca real. O "sombrio" vem do silêncio, do olhar e do mistério.
4. Esta conversa **não** faz produto nem página de venda (isso é outra conversa). Mas tudo tem que ser original e documentado, porque vai alimentar o produto.

## O que foi decidido com o dono
- Série: **"O Tempo Parou"** (nome provisório). Às 16h47 de uma segunda, o mundo congela; só a **Rose** (Rosângela, 33, faxineira saindo do serviço) se mexe. O público decide o que ela faz. Ver `serie/biblia-da-serie.md`.
- Estilo: **Praça ao Sol** (dia claro, fim de tarde dourado, nunca noite). Ver `biblia-de-estilo.md`.
- Ritmo **frenético**: cena nova a cada ~2,5–3 s, câmera sempre andando, muita coisa entrando na tela (etiqueta, ficha, medidor, carimbo, cartão).
- **Todo mundo que aparece tem rosto e jeito próprio.** Cenário novo = gente nova (use o gerador `personagens/gente.js`).
- **Som:** sem música de fundo (o dono achou alto). Só voz + efeitos + tique-taque de relógio bem baixinho (~26 dB abaixo da voz). Todo elemento que entra na tela tem efeito.
- Ep. 1 termina com pergunta aberta; do Ep. 2 em diante, abre com "vocês escolheram" (%) e fecha com A/B + relógio.

## Pastas
| Pasta | O que tem |
|---|---|
| `pesquisa/` | análise das referências |
| `amostras/` | pranchas das 3 direções, quadro-conceito |
| `personagens/` | `rose.js` (Rose, 5 expressões, piscar), `gente.js` (gerador de figurantes + elenco fixo), folhas de design |
| `cenarios/cenario.js` | ônibus, pombos, sobrados com loja, poste/fios, árvore, calçada de pedra portuguesa, rua |
| `som/` | `sintese.py`, `efeitos.py` (25 efeitos → `sfx/`), `trilha.py` (camadas; hoje só "tique") |
| `serie/` | bíblia da série, roteiros + briefing |
| `episodios/epNN/` | voz, transcrição, `som_epNN.py` (mapa de som + mix), áudio final |
| `estudio/` | projeto Remotion (1080x1920, 30 fps) |

## Passo a passo de um episódio
1. Bíblia → 2. roteiro (frase curta, uma por cena) → 3. briefing (tabela cena a cena com peças de tela e som) → 4. folhas de design → **dono aprova** → 5. texto da voz com tags (Eleven v4) → dono gera com a voz "DIZ QUE É MINHA VOZ" e manda o MP3.
6. Transcrever: `POST https://api.elevenlabs.io/v1/speech-to-text` (`model_id=scribe_v1`, `timestamps_granularity=word`, header `xi-api-key: proxy-injected`) → `voz-epNN-palavras.json`. Nunca pedir nem escrever a chave.
7. `python3 som_epNN.py` → alinha cenas por palavra (`alinha.py`), prende efeitos em palavras (`'@palavra'`), mixa: voz -16 LUFS, efeitos 15 dB abaixo (RMS em todas as frequências), final **-11 LUFS**, pico < -1 dB → `audio-final-epNN.*` e `tempos-reais.json`.
8. Copiar `tempos-reais.json` → `estudio/src/tempos-epNN.json` e o MP3 → `estudio/public/epNN/audio.mp3`.
9. Cenas em `estudio/src/epNN.tsx` (cada cena: cenário, chaves de câmera, socos, HUD, posição da legenda).
10. **Folha de quadros antes do render:** `node folha.mjs` (ou `node folha.mjs 3,7,12` pra algumas cenas) → `out/quadros/`.
11. Render: `npx remotion render src/index.ts EpNN out/epNN.mp4 --codec h264 --crf 20`.
12. Capa, legenda do post e Stories.

## Estúdio (estudio/src)
- `camera.tsx`: `Camera` (chaves t/x/y/z/r, `socos`, `tremor`, limites: nunca mostra fora do cenário), `Legenda` (blocos de até 3 palavras, palavra entra na hora em que é falada, destaque em ipê).
- `pecas.tsx`: `Etiqueta`, `Ficha`, `Medidor`, `Cartao`, `Carimbo`, `Topo`, `Relogios`, `Checklist`, `Flash`, `Pergunta`.
- `cenarios.tsx`: `Rua` (mundo 2400x1920 + céu/calçada extra), `Mundo`, `Escada`, `Terraco`, `RelogioRua`, `Pulso`, `Padaria`, `Loja`, `MapaBairro`, `Celular`.
- Chromium: usa o já instalado (`remotion.config.ts`), não baixar outro.

## Lições
- Legenda nunca em cima do rosto; nada importante nos 380 px de baixo nem nos 140 px da direita.
- Câmera com zoom abaixo do mínimo mostra preto: os limites (`lim`) resolvem.
- Coisa desenhada atrás de prédio some (o sol da cena 21): conferir na folha de quadros.
- Grave contínuo vira chiado depois do volume final: nos efeitos, grave só em batida curta e com corte em 35–45 Hz.
