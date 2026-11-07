# Caderno 5 · Imagem e som

> Neste caderno: o estilo da série, os personagens a partir do personagem-base, cenários que funcionam no
> celular, a legenda, os sons e a conferência antes de gerar o vídeo.

## O estilo

Antes de desenhar, decida o **estilo**: as cores, a luz (dia, fim de tarde, noite), a letra da legenda e o
ritmo. Peça **três direções bem diferentes**, veja cada uma como imagem e escolha (ou misture).

> Os nossos dois canais mostram o quanto isso muda tudo: o **Contos do Vigia** é noite, com luz de
> lanterna; o **O Tempo Parou** é dia claro, colorido, com a tela cheia de informação e câmera sempre
> andando.

**A letra precisa ser instalada no projeto.** Se não for, o vídeo sai com uma letra comum, e você só
percebe depois.

## Os personagens

Comece do **personagem-base**: um rosto, olhos, boca e ombros. Escolha a pele, o cabelo, a roupa, o
acessório, as cores e as expressões. O que o base não tiver (fone, cachecol, barba, avental), o Claude cria
como peça nova e encaixa por cima ou por trás.

Para cada personagem, faça uma **folha de design**: ele de frente, as expressões lado a lado e as cores
escritas. A folha garante que o personagem é **o mesmo em todas as cenas**.

## Os cenários

- **Cena escura nunca é preto chapado.** No celular, preto chapado vira uma mancha. Sempre tem um ponto de
  luz: uma janela, uma luminária, uma faixa de luz no chão. *(Erro real nosso: veja o Diário.)*
- **As zonas proibidas da tela:** nada importante nos **380 px de baixo**, nos **140 px de cima** e nos
  **140 px da direita**. É onde ficam os botões e a legenda das redes.
- Nenhuma marca, logotipo ou pessoa real.

## A câmera

Nenhuma cena fica parada. Um zoom lento contínuo já dá vida. Nos momentos fortes, um "soco" de zoom rápido.
A câmera nunca pode mostrar a borda do cenário.

## A legenda

- Palavra por palavra, de **uma a três palavras** por vez, cada uma entrando na hora em que é falada.
- As **palavras importantes em destaque**, na cor do estilo.
- A legenda **nunca cobre um rosto** e nunca encosta numa etiqueta.

## O som

O som é metade da sensação. E é onde mais erramos no começo:

- **Todo elemento que entra na tela ganha um efeito curto:** um clique, um sino, um pop.
- **Os efeitos ficam uns 15 dB abaixo da voz**, medidos com todas as frequências. Efeito alto cobre a
  narração.
- **Nada de grave contínuo (zumbido).** Depois do volume final, ele vira chiado no celular e machuca o
  ouvido. Grave só em batida curta.
- O volume final do vídeo fica entre **-14 e -11 LUFS** (a medida de volume das redes), com pico abaixo de
  -1 dB.
- Música é opcional, e só com licença que permita uso nas redes.

## Confira antes de gerar

Faça uma **folha de quadros**: uma imagem com o quadro do meio de cada cena, com as zonas proibidas
marcadas. Em poucos segundos você vê o que levaria minutos para achar no vídeo.

> No nosso teste, a folha pegou três erros antes do vídeo sair: uma etiqueta encostando na legenda, a
> legenda caindo na faixa dos botões e um personagem invadindo a lateral.

## Pedido pronto para o Claude

```
Leia series/<nome>/MUNDO.md. Proponha 3 estilos bem diferentes (cores, luz, letra, ritmo)
e mostre cada um como imagem. Depois do estilo escolhido, crie os personagens a partir do
personagem-base (uma folha de design para cada) e os cenários, respeitando as zonas
proibidas e sem cena escura chapada. Para o vídeo da parte [número]: monte as cenas na
hora certa pelo tempos.json, com câmera, legenda palavra por palavra e sons com os
efeitos 15 dB abaixo da voz. Antes de gerar, me mostre a folha de quadros.
```

*(Com a skill do Estúdio, isso são os comandos `/visual` e `/montar`, que já trazem a câmera, a legenda, os
sons, a mixagem e a folha de quadros prontos.)*

## Pronto quando

- [ ] A letra certa aparece no vídeo.
- [ ] Os personagens são os mesmos em todas as cenas.
- [ ] Nenhuma cena virou mancha preta.
- [ ] A legenda não cobre rostos nem cai nas zonas proibidas.
- [ ] A voz está sempre na frente dos efeitos, e não há zumbido.
