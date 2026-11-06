# Memória do canal

Este arquivo é lido no começo de toda conversa. Aqui ficam as regras do canal, para a parte 4 sair com a mesma cara da parte 1.
Sempre que uma regra nova for decidida, anote aqui.

> Versão inicial, montada a partir do método Histórias que Prendem. Ajustar quando o pedido A1 do guia
> e a ideia da série estiverem definidos. Tudo marcado com (a definir) ainda precisa de decisão.

## O canal
- Nome do canal: (a definir)
- Gênero: terror leve e mistério, contado em partes. Sem sangue e sem gente real.
- Nome da série atual: (a definir)

## O vídeo
- Formato: Reel vertical, 1080x1920, 30 fps.
- Duração de uma parte: cerca de 40 segundos.
- Área segura: nada de texto importante nos 220 px de cima nem nos 420 px de baixo, onde ficam os botões e a legenda do Instagram. Margens laterais de 90 px.
- Cores: fundo quase preto `#0A0607`, destaque vermelho `#E0182D`, texto branco.
- Luz: cenas noturnas. O escuro conta a história, e pontos de luz levam o olho para o detalhe importante.

## O roteiro de uma parte
- 10 frases, uma por cena.
- Frase 1, o gancho: algo estranho nos 2 primeiros segundos.
- Frases 2 a 7: a tensão sobe, com pistas que fazem o público rever a cena.
- Frases 8 e 9, a virada: vem depois de uma pausa, com a trilha quase muda.
- Frase 10, a escolha: toda parte termina com uma escolha A ou B e anuncia a próxima parte.
- Deixar os dois caminhos (A e B) esboçados antes de postar.

## Personagens
- Cada personagem tem uma folha de design (frente, costas e expressões) e mantém sempre o mesmo rosto.
- Lista de personagens: (a definir)

## Voz e legenda
- Narração gerada no ElevenLabs (a definir: voz e ajustes).
- Legenda palavra por palavra, no tempo exato da voz. A palavra-chave acende em vermelho.
- Tudo que acontece na tela entra no instante de uma palavra da narração.
- Sincronia feita com o faster-whisper, no ambiente Python `.venv`.

## Como trabalhar
- Uma coisa por vez: uma cena por pedido.
- Antes de renderizar o vídeo inteiro, mostrar quadros soltos (`npx remotion still`).
- Não mexer nas cenas que já foram aprovadas sem pedir.
- O ciclo: pedir, conferir os quadros, corrigir, renderizar a prévia, aprovar.
- Quando uma cena for aprovada, salvar num commit.

## O projeto
- Remotion 4. Composições registradas em `src/Root.tsx`.
- `npm run studio` abre o Remotion Studio.
- `npm run still` gera um quadro de teste e `npm run render` gera o vídeo em `out/`.
