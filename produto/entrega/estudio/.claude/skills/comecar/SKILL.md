---
name: comecar
description: Primeiro comando do Estúdio do Nogueira. Confere e monta o estúdio na nuvem (projeto de vídeo, voz, vídeo de teste) e conversa com a pessoa para definir o canal dela. Use quando a pessoa digitar /comecar ou disser que está começando.
---

# /comecar: deixar o estúdio pronto

Você está ajudando uma pessoa que **não é programadora** a montar o canal de séries animadas dela.
Fale sempre em português do Brasil, com frases curtas e sem termos técnicos. Quando um termo técnico for
inevitável, explique em uma frase. Faça uma etapa por vez e diga em que etapa vocês estão
("Etapa 2 de 4").

Se o arquivo `canal/CANAL.md` já estiver preenchido, o estúdio já foi montado antes. Pergunte se a pessoa
quer só conferir a parte técnica (etapas 1 a 3) ou refazer o perfil do canal (etapa 4).

## Etapa 1 de 4: conferir o lugar

1. Confirme que você está numa sessão do Claude Code com este repositório aberto (existe `CLAUDE.md` e
   `package.json` na pasta de trabalho). Se não estiver, explique com calma o passo 3 do COMECE-AQUI.
2. Confira se `node` e `ffmpeg` existem. Se faltar algo, instale com o gerenciador de pacotes do sistema
   e conte à pessoa em uma frase o que foi instalado.

## Etapa 2 de 4: o projeto de vídeo

1. Rode `npm install` na pasta do repositório.
2. Faça o vídeo de teste: `npm run teste`. Ele gera `saida/teste.mp4` (3 segundos, vertical).
   - O arquivo `remotion.config.ts` já usa o navegador que vem instalado na nuvem. Se a montagem falhar
     por falta de navegador, leia o erro, resolva e conte à pessoa o que mudou.
3. Mostre o vídeo de teste à pessoa (envie o arquivo, se você tiver uma ferramenta para isso).
4. **Guardar a montagem para as próximas vezes.** Se você tiver as ferramentas do ambiente na nuvem
   (ver o ambiente e propor um script de preparação), proponha um script de preparação que rode
   `npm install` no repositório sempre que uma sessão nova começar. Siga as regras dessas ferramentas
   (o script começa na pasta acima do repositório; teste antes de propor). Explique para a pessoa:
   "Isso faz o Claude não precisar instalar tudo de novo a cada conversa". Se não tiver essas
   ferramentas, siga sem isso.

## Etapa 3 de 4: a voz

Pergunte qual ferramenta de voz a pessoa vai usar.

- **ElevenLabs:** pergunte se ela quer deixar a chave pronta agora.
  - Se sim e você tiver a ferramenta de pedir credencial: peça a chave para o endereço
    `api.elevenlabs.io`, no cabeçalho `xi-api-key`. Antes, diga em uma frase para que serve e onde ela
    acha a chave no site do ElevenLabs (o perfil dela, na parte de chaves de API).
  - Se você não tiver essa ferramenta: explique que ela salva a chave nas configurações do ambiente
    (o menu do ambiente no topo da sessão, depois Editar, em segredos de rede) e começa uma sessão nova.
  - **Nunca peça para a pessoa colar a chave na conversa.**
  - Teste com uma chamada que só lista as vozes da conta (`GET https://api.elevenlabs.io/v1/voices`) e
    conte quantas vozes ela tem. Nunca mostre a chave.
- **Outra ferramenta:** explique que, na hora da narração, ela gera o áudio lá e envia o arquivo na
  conversa. Nada a configurar agora.
- **Ainda não sabe:** tudo bem. Siga sem voz; o `/comecar` pode ser rodado de novo depois.

## Etapa 4 de 4: o seu canal

Agora é conversa, não técnica. Faça **uma pergunta por vez** e dê exemplos curtos para ajudar. Nunca
assuma o nicho: ele é da pessoa.

1. **Nicho:** sobre o que são as histórias? (mistério, comédia, romance, fantasia, curiosidades,
   infantil, religioso, o que ela quiser)
2. **Público:** quem assiste? Idade aproximada e o que essas pessoas gostam.
3. **Clima:** como a pessoa deve se sentir ao assistir? (tensa, rindo, emocionada, curiosa)
4. **Limites:** o que nunca entra no canal? Sugira os limites que fazem sentido para o nicho e o
   público e deixe a pessoa decidir.
5. **Narrador:** quem conta as histórias? Um personagem com nome, ou a própria pessoa?
6. **Voz:** que tipo de voz combina com esse narrador?
7. **Redes:** onde vai postar? (Instagram, TikTok, YouTube Shorts, Kwai)
8. **Nome do canal**, se ela já tiver.

Depois:
1. Escreva um resumo curto e peça aprovação.
2. Com a aprovação, preencha `canal/CANAL.md` seguindo o modelo que já está lá.
3. Faça um commit com a mensagem "Perfil do canal" e envie para o GitHub.

## Para fechar

Diga, em poucas linhas:
- o que ficou pronto (vídeo de teste, voz, perfil do canal);
- o que ficou pendente e como resolver;
- o próximo passo: criar a primeira série.
