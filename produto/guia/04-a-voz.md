# Caderno 4 · A voz

> Neste caderno: preparar o texto para a voz, dar emoção, gerar a narração e marcar o tempo de cada palavra
> para as cenas e a legenda entrarem na hora certa.

## Prepare o texto

1. **Uma frase por linha.** Cada linha é uma cena.
2. **Marque a emoção só onde ela muda.** As ferramentas de voz mais novas aceitam marcações entre
   colchetes, como `[sussurrando]`, `[animado]` ou `[pausa]`. Use pouco: marcação demais deixa a voz
   artificial. Uma pausa antes da virada ajuda muito.
3. **Escreva como se fala:** números e siglas por extenso.

> **Exemplo (O Elevador das Seis):**
> `[curioso] Mas hoje, ele fez uma coisa diferente.`
> `[sussurrando] O treze.`
> `[pausa] E o elevador... começou a subir.`

## Gere a narração

- **Escolha o modelo de voz com teste.** Gere só a primeira frase em dois ou três modelos e compare. Uma
  voz clonada costuma soar melhor no modelo em que foi testada.
- **Gerar voz gasta créditos** da sua conta de voz. Gere a parte inteira só depois do texto aprovado.
- **Ouça tudo antes de seguir.** Palavra trocada, emoção estranha ou pausa no lugar errado se resolvem
  ajustando só aquela frase e gerando de novo.

## Marque o tempo de cada palavra

Para a legenda aparecer palavra por palavra, e para cada cena começar na hora exata, você precisa saber
**em que segundo cada palavra é dita**. Isso se faz com uma **transcrição com tempo por palavra**: o
ElevenLabs tem uma (speech-to-text), e existe uma opção grátis (faster-whisper).

Depois, junte o **texto certo** (o do roteiro) com os **tempos da transcrição**. A transcrição às vezes
erra uma palavra; o texto do roteiro é o que vale, e da transcrição você usa só os tempos.

> No nosso teste, a transcrição bateu palavra por palavra com o roteiro: 81 palavras e 10 cenas, com o
> segundo exato de cada uma.

## Os cuidados

- Sotaque estrangeiro tira o público da história. Prefira uma voz em português do Brasil.
- Nunca use a voz de uma pessoa real sem autorização.
- Para usar a narração em vídeos públicos, confira se o seu plano da ferramenta de voz permite uso
  comercial (no ElevenLabs, é a partir do plano pago).

## Pedido pronto para o Claude

```
Leia o ROTEIRO.md da parte [número]. Monte o texto da narração, uma frase por linha, com
marcações de emoção só onde o clima muda, e salve em VOZ.md. Depois de eu aprovar: gere a
voz [com a minha voz X no ElevenLabs / ou: vou te mandar o áudio], transcreva com tempo
por palavra e gere tempos.json com o começo e o fim de cada cena e de cada palavra.
```

*(Com a skill do Estúdio, isso é o comando `/voz`, que já traz a ferramenta pronta de tempos.)*

## Pronto quando

- [ ] O texto foi lido em voz alta e aprovado.
- [ ] A voz soa natural e sem sotaque.
- [ ] Você ouviu a narração inteira.
- [ ] Cada cena tem o segundo exato em que começa.
