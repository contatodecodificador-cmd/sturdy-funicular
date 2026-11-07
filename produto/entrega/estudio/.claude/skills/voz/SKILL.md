---
name: voz
description: Passo 7 do Estúdio do Nogueira. Prepara o texto da narração com emoção, gera a voz no ElevenLabs (ou recebe o áudio de outra ferramenta) e marca o tempo de cada palavra para encaixar nas cenas. Use quando a pessoa digitar /voz ou quiser fazer ou refazer a narração.
---

# /voz: a narração

Fale em português do Brasil, simples. "Etapa X de 4". Leia `canal/CANAL.md` (narrador, voz, ferramenta)
e o `ROTEIRO.md` da parte atual.

**A chave do ElevenLabs nunca aparece na conversa.** Ela fica guardada no ambiente da nuvem e é colocada
sozinha nos pedidos para `api.elevenlabs.io`. Nos pedidos, use o cabeçalho `xi-api-key` com qualquer
valor (por exemplo `chave-do-ambiente`); o ambiente troca pelo valor certo. Se der erro de acesso, siga a
etapa 3 do `/comecar` para salvar a chave.

## Etapa 1 de 4: o texto para falar

1. Monte o texto da narração a partir do roteiro, uma frase por linha.
2. Marque a emoção onde ela muda, com as marcações que a ferramenta de voz aceita (no ElevenLabs, os
   modelos novos aceitam marcações entre colchetes, como `[sussurrando]`, `[animado]`, `[pausa]`).
   Use pouco: só onde muda o clima. Uma pausa antes da virada ajuda muito.
3. Escreva números e siglas por extenso, do jeito que devem ser falados.
4. Mostre o texto e peça aprovação.

## Etapa 2 de 4: gerar a voz

Pergunte como a pessoa quer fazer:

- **O Claude gera pelo ElevenLabs** (precisa da chave salva):
  1. Liste as vozes da conta (`GET /v1/voices`) e mostre os nomes. A pessoa escolhe (a voz do canal já
     pode estar anotada no `CANAL.md`).
  2. Liste os modelos (`GET /v1/models`) e use o mais novo que aceita as marcações de emoção, a menos que
     a pessoa prefira outro.
  3. Avise que gerar a voz gasta créditos da conta dela e pergunte se pode.
  4. Gere com `POST /v1/text-to-speech/<voice_id>` e salve em `partes/parte-NN/voz.mp3`.
  5. Mande o áudio para a pessoa ouvir. Se algo soar errado (palavra trocada, emoção estranha), ajuste o
     texto daquela frase e gere de novo.
- **A pessoa gera em outra ferramenta**: explique que ela gera lá, com o texto aprovado, e envia o
  arquivo de áudio na conversa. Salve como `partes/parte-NN/voz.mp3` (converta com o ffmpeg se vier
  em outro formato).

## Etapa 3 de 4: o tempo de cada palavra

Para encaixar cenas e legenda na fala, você precisa saber quando cada palavra é dita.
- **Com a chave do ElevenLabs:** use a transcrição com marcação por palavra
  (`POST /v1/speech-to-text`, com `model_id=scribe_v1` e `timestamps_granularity=word`, enviando o
  arquivo). Salve a resposta em `partes/parte-NN/voz-palavras.json`.
- **Sem a chave:** instale o `faster-whisper` (`pip install faster-whisper`) e transcreva com marcação
  por palavra.

Depois, confira a transcrição contra o roteiro e corrija palavras que vieram erradas (o texto certo é o
do roteiro; da transcrição você só usa os tempos). Gere `partes/parte-NN/tempos.json` com: cada palavra,
começo e fim em segundos, e o número da cena (frase) a que ela pertence. Cada cena começa na primeira
palavra da sua frase.

## Etapa 4 de 4: guardar

1. Atualize `canal/ESTADO.md` (último passo `/voz`, próximo `/montar`).
2. Commit "Série <nome>, parte NN: voz" e envie (o áudio vai junto).
3. Diga que o próximo passo é montar o vídeo com `/montar` (ou `/seguir`).
