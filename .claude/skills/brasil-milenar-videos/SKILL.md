---
name: brasil-milenar-videos
description: Produz vídeos completos para o canal faceless "Brasil Milenar" (YouTube, português do Brasil) no estilo "viagem no tempo em escada" — futuro/passado distante do Brasil, escalas, geologia, céu, natureza. Use sempre que o usuário pedir ideias de vídeo, pesquisa, escaleta, roteiro, introdução, checagem de fatos, texto pronto para narração por IA (ElevenLabs), trilha/efeitos sonoros, thumbnail ou guia de edição/motion graphics para o Brasil Milenar ou para um canal no mesmo estilo (inclusive em outro idioma, como italiano).
---

# Brasil Milenar — fábrica de vídeos

Canal faceless brasileiro. Formato: uma **viagem em escada** (no tempo, em profundidade, em distância ou planeta a planeta), com **paradas curtas**, cada uma com **um fato real + um número + uma comparação do cotidiano brasileiro**, narrada por IA e editada em **motion graphics limpo** (contador, etiquetas, palavras-chave em tela, mapas e gráficos simples, fundo de espaço).

Modelo de referência que inspirou o estilo: canal "Além da Escala", vídeo "O que vai acontecer daqui a 1 bilhão de anos?" (422 mil views em 9 dias, 264x a média do canal). A análise completa está em `references/01_estilo_e_edicao.md` e o mapa cena a cena + padrões de montagem em `references/07_analise_cena_a_cena.md`.

**O diferencial do Brasil Milenar:** o Brasil é a âncora de TUDO. Todo tema global vira brasileiro (cidades, mapa, céu do hemisfério sul, Amazônia, Noronha, bandeira, livro de geografia da escola). Nunca copiar paradas, frases ou cores do canal de referência.

## Fluxo de produção (siga nesta ordem)

1. **Ideia e título** → `references/05_ideias_e_titulos.md` (lista de vídeos validados + como validar um novo tema).
2. **Pesquisa com dados reais** → `references/03_pesquisa_e_checagem.md`. Dividir em 2-3 frentes (ex.: futuro próximo / geologia profunda / céu e vida). Toda afirmação precisa de FONTE + NÚMERO + CONFIANÇA. Depois, uma rodada de **verificação** que reabre as fontes e corrige números "de memória".
3. **Escaleta** (mapa das paradas) → `references/02_estrutura_do_roteiro.md`. Escolher o **fio condutor** e checar a regra de originalidade.
4. **Corpo do roteiro PRIMEIRO, sem introdução.** Bloco 1 em diante, com marcações visuais.
5. **Introdução DEPOIS**, construída a partir do corpo pronto (começa pelo fato final mais chocante, promete a viagem, mostra a escada).
6. **Checagem final de fatos** do texto pronto (cada número, cada comparação, cada conta). Aplicar correções.
7. **Texto pronto para IA** → `references/04_texto_para_ia_e_audio.md` (números por extenso, sem siglas/símbolos, sem marcações). Entregar texto corrido + pontos de corte se o gerador limitar caracteres.
8. **Áudio**: o usuário narra no ElevenLabs com a voz dele (ele prefere gerar o áudio ele mesmo). Depois: tratar o áudio (volume uniforme), gerar trilhas por tensão e efeitos sutis → `references/04_texto_para_ia_e_audio.md`.
9. **Edição** → `references/01_estilo_e_edicao.md` (sistema visual) + `references/07_analise_cena_a_cena.md` (padrões de montagem da referência) + `references/06_pipeline_edicao.md` (como montar/renderizar).
10. **Thumbnail**: imagem fotorrealista (IA) + UM número gigante em branco com contorno escuro. Âncora brasileira na imagem (ex.: Rio sem mar, Brasília no deserto).

Quando houver subagentes disponíveis, delegue por função: pesquisa e verificação → modelo intermediário (ex.: Sonnet); redação do roteiro e da intro → o modelo mais forte disponível (ex.: Opus); tarefas mecânicas (checar nomes, formatar) → modelo leve (ex.: Haiku). Sem subagentes, faça as etapas em sequência, na mesma ordem.

## Regras de ouro

- **Dados reais, sempre.** Nada de número inventado. Incerteza vira honestidade na fala ("anota com lápis", "num dos modelos", "um estudo de 2024 sugere", "não é previsão com data, é média").
- **Corpo antes da intro.** A intro é escrita por último.
- **Brasil a cada ~1,5 min** de narração.
- **Uma pergunta aberta** no começo que só se resolve no fim + **fio condutor** que aparece 3-4 vezes.
- **Sem CTA no meio.** Um único pedido de inscrição no final.
- **Tudo sutil** na edição: nada de alarme, zoom agressivo ou efeito exagerado.
- **Economia de créditos** (ElevenLabs/Claude): gerar pequeno primeiro (1 bloco), validar, depois gerar o resto; nunca regenerar o vídeo inteiro por causa de um trecho.

## Dados do canal

- Nome: **Brasil Milenar** (escolhido por ser amplo: permite qualquer tema sobre o Brasil no tempo — passado, futuro, natureza, história profunda).
- Descrição (Sobre): "O Brasil tem bilhões de anos de história, e quase ninguém conhece. No Brasil Milenar, a gente viaja no tempo para entender o país onde você vive: o que existia aqui antes de nós, o que mudou ao longo das eras e o que ainda vai acontecer com este chão. Vulcões, oceanos, dinossauros, o céu e o futuro distante, sempre com dados reais e fontes verificadas. Inscreva-se e venha conhecer o Brasil que nenhum livro de escola mostrou."
- Identidade visual: azul-marinho de espaço, dourado e branco (perfil e banner já criados no Canva). Paleta de edição em `references/01_estilo_e_edicao.md`.
- Voz: clone do dono do canal no ElevenLabs (voice_id `jZ0KzfdIFfYFdHDyYgUn`). O dono prefere gerar a narração pessoalmente no site do ElevenLabs; entregue o texto pronto.

## Arquivos de apoio (assets/)
- `assets/scripts/` — preparar_texto_ia.py, medir.py (variação de volume), alinhar_e_eventos.py (forced alignment ElevenLabs → eventos com tempo), gerar_musica.py, mixar.py (voz + música com ducking + efeitos, -14 LUFS), gerar_audio_api.py (só se o dono pedir narração via API).
- `assets/template_remotion/` — projeto de animação (Remotion/React) usado no vídeo 1: contador odômetro, etiquetas, palavras-chave, mapas reais, globo, vulcão em corte, céu do sul, gráficos. Ver `references/06_pipeline_edicao.md`.
- Se o ambiente não tiver execução de código (ex.: chat sem ferramentas), entregue roteiro, texto para IA, prompts de música/efeitos e um GUIA DE EDIÇÃO por bloco (o que aparece na tela, em que frase, com qual cor) para o usuário montar num editor (CapCut/Premiere/Canva).

## Exemplo completo

`examples/video1_roteiro_final.md` — roteiro do vídeo 1 ("O que vai acontecer com o Brasil daqui a 1 milhão de anos?") com marcações visuais e fontes. `examples/video1_texto_para_IA.txt` — o mesmo, pronto para narração. Use como gabarito de tom, ritmo e formato.
