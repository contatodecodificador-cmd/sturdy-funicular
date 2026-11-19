# 04 — Texto pronto para IA, áudio, trilha e efeitos

## Texto para narração por IA (ElevenLabs)
Converter o roteiro em texto corrido, só o que é falado:
1. Remover títulos, marcações [ ], fontes e notas.
2. **Anos e números por extenso**: "2045" → "dois mil e quarenta e cinco"; "1843" → "mil oitocentos e quarenta e três"; "3,8 cm" → "três vírgula oito centímetros"; "40 °C" → "quarenta graus".
3. **Sem siglas difíceis**: "IPCC" → "o painel do clima da ONU"; "NASA" → "Nasa". Evitar nomes estrangeiros de pesquisadores (ex.: "Scotese" → "num dos modelos mais conhecidos").
4. Sem símbolos: °, %, →, /, ~, (, ).
5. Uma linha em branco entre paradas (ajuda a IA a respirar).
6. Conferir que não sobrou nenhum dígito no texto.
7. Se o gerador limitar caracteres (alguns planos: 5.000), dividir em partes em pontos naturais (viradas de ato) e informar ao usuário onde cortar.

Ritmo esperado: a voz do dono rende ~145-165 palavras/min → ~2.300 palavras ≈ 14-16 min.

O dono do canal prefere **gerar o áudio ele mesmo** no site do ElevenLabs (o resultado via API saiu pior para ele). Entregue o texto; não gere a narração via API sem pedir.

## Tratamento do áudio da narração (ffmpeg)
Problema comum: trechos mais altos/baixos (gerados em partes). Cadeia usada:
```
ffmpeg -i narracao.mp3 -af "highpass=f=70,lowpass=f=14000,\
dynaudnorm=f=400:g=15:p=0.9:m=8:s=12,\
acompressor=threshold=-20dB:ratio=2.5:attack=15:release=200:makeup=2,\
loudnorm=I=-16:TP=-1.5:LRA=7" -ar 48000 -ac 1 voz_tratada.wav
```
- `dynaudnorm` iguala trechos altos/baixos sem bombear (janela longa).
- `acompressor` suave segura picos.
- `loudnorm` deixa a voz em -16 LUFS (a mixagem final com música vai a -14).
Conferir: `ffmpeg -i voz_tratada.wav -af ebur128=framelog=quiet -f null -` e medir a variação de volume por blocos de 10 s (deve ficar dentro de ~±2 dB).

## Sincronizar texto em tela com a fala
Use **forced alignment** do ElevenLabs (`POST /v1/forced-alignment`, multipart com `file` = áudio e `text` = texto falado) → devolve início/fim de cada palavra. Com isso, cada marcação [PALAVRA]/[ETIQUETA]/[CONTADOR] do roteiro aparece exatamente quando a frase gatilho começa.

## Trilha (ElevenLabs Music — `POST /v1/music`)
Poucas faixas, por tensão do roteiro:
| Trecho | Clima | Prompt-base |
|---|---|---|
| Intro (0-45 s) | tensão maior, expectativa | "cinematic ambient documentary intro, low pulsing synth drones, deep sub bass swells, slow rising tension, distant piano notes, no drums, no vocals, sparse, mysterious" |
| Ato 1 (futuro próximo) | curiosidade, leve | "minimal ambient documentary underscore, warm soft pads, gentle piano motif, curious and calm, slow tempo 70 bpm, no drums, no vocals" |
| Ato 2 (céu e mar) | contemplativo, vasto | "ethereal space ambient, airy pads, shimmering textures, slow evolving, sense of vastness and wonder, no drums, no vocals" |
| Ato 3 (o chão se move) | grave, tensão crescente | "dark cinematic ambient, deep low drones, slow tectonic rumble, subtle pulse, growing tension, no drums, no vocals" |
| Fecho | emocional, resolução | "emotional ambient piano and strings, hopeful and reflective, slow, gentle swell, documentary ending, no vocals" |
Gerar faixas de 2-3 min e repetir/encadear com crossfade de 3-4 s. Música sempre baixa (ducking sob a voz).

## Efeitos sonoros (ElevenLabs Sound Effects — `POST /v1/sound-generation`)
Todos SUTIS, curtos, gerados uma vez e reaproveitados em todos os vídeos:
- `contador`: "soft mechanical counter digits rolling, subtle clicking ticks, quiet, clean" (1,5 s)
- `whoosh`: "soft airy whoosh transition, smooth, cinematic, subtle" (1,2 s)
- `pop`: "very soft subtle UI pop, gentle, minimal" (0,4 s)
- `impacto`: "deep distant cinematic boom, soft low rumble, subtle" (2,5 s)
- `ondas`: "gentle ocean waves on a beach, calm, distant" (5 s)
- `vento_espaco`: "deep space ambience, faint cosmic wind, very subtle" (6 s)
- `calor`: "low hot desert wind drone, heat shimmer, subtle" (5 s)
Volume na mixagem: -18 a -26 dB abaixo da voz.
