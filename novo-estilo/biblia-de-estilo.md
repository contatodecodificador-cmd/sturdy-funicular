# Bíblia de estilo · "Praça ao Sol"

> Status: **rascunho 1**. A direção foi escolhida pelo dono em 2026-11-07, a partir de 3 opções (`amostras/direcao-1..3.png`).
> Tudo aqui é original da linha nova. Nada vem do kit "Histórias que Prendem" nem das contas de referência.

## 1. Clima
Dia claro numa cidade brasileira: colorido, alegre e quente. Comédia do dia a dia com mistério leve. **Nunca noite** (é o oposto do Contos do Vigia).

## 2. Cores
| Nome | Código | Uso |
|---|---|---|
| Céu | `#7EC8E3` (degradê até `#DDF1F7`) | fundo de céu |
| Terracota | `#D96C4A` | fachadas, carimbos, alertas leves |
| Ipê | `#F2C14E` | **cor de destaque** da legenda e dos contadores |
| Praça | `#5FA36A` | árvores, números que sobem |
| Azul colonial | `#2F6FA3` | uniforme da Rose, fachadas |
| Tinta | `#2B2420` | contornos e texto escuro |
| Papel | `#FFF8EC` | cartões, fichas, fundos de prancha |

**Mundo parado** (regra da série "O Tempo Parou"): tudo o que está congelado ganha uma película fria (`#9FB8D0` a 18%) e leve dessaturação. **A Rose fica sempre em cor cheia.** Partículas paradas no ar (poeira, gotas) aparecem em branco a 70%.

## 3. Letras (fontes livres, Google Fonts / Fontsource)
- **Legenda e cartões grandes:** Anton, caixa alta.
- **Fichas, contadores e etiquetas:** Barlow Condensed 600/800.
- **Pranchas e documentos:** Nunito 700/900.

## 4. Personagens
- Proporção de gente de verdade (~7 cabeças), sem cabeção de cartoon.
- Contorno de 3 px em `#2B2420`, 1 tom de sombra (luz vem da esquerda, sombra do lado direito).
- Olhos com íris, brilho e pálpebra marcada. Bochecha com blush leve (opacidade 22–25%).
- Cada personagem tem 2 ou 3 "marcas" fixas que nunca mudam (a Rose: coque de cachos com faixa amarela, argolas e luvas amarelas).
- Código das figuras: `personagens/*.js` (SVG puro, com expressões por parâmetro).

## 5. Cenário
Casario colorido, calçada de pedra portuguesa, padaria, ponto de ônibus e prédios do centro. Lugares inventados com cara de Brasil real. Nenhuma marca real.

## 6. Luz
Sol alto, sombras curtas e duras e céu limpo. No mundo parado a luz fica igual, só com a película fria por cima.

## 7. Tela cheia de informação (HUD)
Toda cena tem **pelo menos um dado mexendo**:
- **Etiqueta de lugar e hora** no topo: pílula branca, Barlow 800 (ex.: `CENTRO · SEG · 07:14`).
- **Dois relógios** (marca da série): RELÓGIO DO MUNDO preso em 07:14 e RELÓGIO DA ROSE andando (DIA 3 · 15:40).
- **Contadores**: cartão branco arredondado, número grande em Anton, seta ▲ verde ou ▼ terracota.
- **Fichas**: cartão "papel" levemente girado (−3°), com carimbo terracota.
- **Cartão de bloco numerado** (TESTE 1, 2, 3): cartão grande no centro, número em ipê.

## 8. Legenda
- Palavra por palavra, de 2 a 3 palavras na tela por vez, em Anton caixa alta branca com contorno `#2B2420` (18 px a 1080).
- A palavra importante vem em ipê `#F2C14E`.
- **Nunca em cima do rosto.** Fica entre o queixo e a zona dos botões.
- **Zonas proibidas:** os 380 px de baixo e a faixa de 140 px da direita.

## 9. Câmera e movimento
- Nenhuma cena fica parada: zoom lento contínuo (100% → 106%) ou panorâmica.
- "Soco" de zoom (rápido, 110% → 100% em 6 quadros) na virada e quando um número muda de forma importante.
- A Rose sempre se mexe (respira, pisca, gesticula). No mundo parado, **só ela e a câmera se mexem**, e é isso que vende a ideia.

## 10. Ritmo
- Troca de cena a cada ~3 s, ~2,5 palavras por segundo.
- Ep. 1 com ~110 s. Episódios seguintes com 80 a 100 s.
- Gancho forte nos 2 primeiros segundos. Lista numerada no meio. Virada com esperança e ameaça. Final com pergunta.

## 11. Som (lições do canal)
- Voz do dono (ElevenLabs Eleven v4) a ~-16 LUFS antes da mistura. Final a **-11 LUFS**, pico abaixo de -1 dB.
- Efeitos uns 15 dB abaixo da voz, sem zumbido grave contínuo.
- Assinatura sonora do tempo parado: um "tic" de relógio que corta e um silêncio limpo (sem chiado).
