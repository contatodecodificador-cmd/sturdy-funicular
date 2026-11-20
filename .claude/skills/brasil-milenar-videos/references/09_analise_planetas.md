# 09 — Análise: "Quantos Segundos Você Duraria em Cada Planeta?" (Além da Escala, ~118 mil views)

Vídeo de 11:07, 1.927 palavras (~174 palavras/min). Calibrar, nunca copiar (personagens, frases e paradas são deles).

## Por que o roteiro é FÁCIL de assistir
1. **Gancho em 2ª pessoa, concreto e físico**: "Se você fosse teleportado agora pra Vênus, de bermuda e chinelo…". O espectador está DENTRO da cena desde o 1º segundo.
2. **Laço aberto explícito**: "tem um lugar, um só, onde você ficaria de pé… A resposta vem no final." E entrega no fim, com virada (as nuvens de Vênus).
3. **Uma régua antes da viagem**: explica o vácuo (15 s, caso real de 1966) e diz "essa é a nossa régua". Tudo depois é comparado com ela.
4. **Fórmula fixa por parada**: "Parada N: X" → "quem vai: Fulano" → 1-2 fatos → comparação brasileira (Serra Catarinense, dia quente no Brasil, forno da sua casa) → **frase-carimbo**: "Tempo do Fulano em X: …". O cérebro aprende o ritmo e relaxa.
5. **Poucos números, sempre traduzidos**: 465 °C = "mais quente que o forno no máximo"; pressão = "mil metros debaixo do mar"; vento = "8 vezes um furacão".
6. **Quase nenhum nome difícil**: só Venera 13 e Jim LeBlanc, ambos com história humana.
7. **Personagens/participação**: amigos reais com nomes, uma "missão", piadas leves ("Desculpa, Lucas").
8. **Fecho em casa**: depois da virada, volta pra Terra ("é aqui") + propósito do canal + pergunta pra comentar + "marca aquele amigo".
9. **CTA no meio** (4:34, após o pico de Vênus) — contraria nossa regra "um CTA só no fim"; o vídeo performou mesmo assim. Testar no máximo 1 CTA curto depois do 1º pico.

## Edição (o que muda em relação ao vídeo "1 bilhão de anos")
- **Personagem 2.5D recorrente** (garoto de camiseta e chinelo) em quase toda cena, reagindo (mão no pescoço, ar faltando, cabelo voando). Cada amigo com camiseta de cor diferente. A presença humana segura a atenção.
- **Número gigante com escala** (465 °C com marcas "água ferve" / "chumbo derrete"); anel de tempo "15 S"; manômetro; **placar recorrente** ("PLACAR ATÉ AGORA").
- **Mitos riscados** ("VOCÊ EXPLODE" com ✗), **checklists** (✓ chão firme, ✓ montanha…).
- Cenários ilustrados por planeta (chão de Marte, nuvens de Júpiter) + mapa de "paradas" com bolinhas de progresso.

## Lições para o Brasil Milenar
- Em todo vídeo: **"você" no cenário** (2ª pessoa sensorial: o que você veria/sentiria ali), **frase-carimbo** que fecha cada parada, **régua/placar** visível, **laço aberto prometido** na intro, **pergunta pra comentar** no fim.
- Cortar nomes científicos difíceis quando o fato se sustenta sem eles; manter só nomes com história ou que viram "personagem".
- Comparações sempre domésticas e brasileiras.

## Medidas (ffmpeg + numpy, 10 fps)
| Medida | Planetas | Vídeo "1 bilhão de anos" (ref. 01) |
|---|---|---|
| Cortes secos | **46** | 3 |
| Troca grande de cena | a cada ~11 s (62) | ~16 s (41) |
| Quadros quase parados | 55% | 79% |
| Movimento médio por minuto | 0,7 a 9,9 (pico em Júpiter: nuvens correndo) | 0,2 a 1,7 |
| Loudness | -13,8 LUFS, LRA 4,5 | -13,7 LUFS |
| Pausas longas | 2 em 11 min | 13 |

## Anatomia de UMA parada (~60 s) — Mercúrio e Júpiter quadro a quadro (a cada 2 s)
1. **0-5 s · Cartão de título**: "PARADA N" pequeno + NOME do planeta grande à esquerda, planeta realista à direita, **barra de progresso com 8 bolinhas** embaixo (a atual acesa). Aos 4 s entra "QUEM VAI / NOME" + o personagem pequeno em pé.
2. **Corte seco** pro personagem DENTRO do cenário (chão do planeta, céu, sol), em pé no centro-direita. Cenário pintado 2.5D com profundidade.
3. **Batidas de 4-6 s**: cada frase da narração ganha UM elemento novo, no canto superior esquerdo ou direito: rótulo pequeno em caixa alta + número/frase grande. Ex.: "= ESPAÇO ABERTO", "LADO DO DIA 430 °C", "QUASE 3×".
4. **Números que contam** (0 KM/H → 400 KM/H; 1.178 → 1.321 TERRAS) e **mostradores** (pressão/temperatura com ponteiro subindo).
5. **Tela dividida** pra contraste (lado do dia × lado da noite, dois personagens, cores opostas).
6. **Personagem reage**: braços abertos, mão na boca (sem ar), ombros caindo, fica vermelho de calor, encolhe caindo nas nuvens.
7. **Carimbo final**: "TEMPO DO X EM Y" + **anel de tempo** (círculo com arco vermelho e o número grande: "~2 MIN", "15 S") ao lado do personagem.
8. **Corte** pro próximo cartão de título.

## Elementos fixos de identidade
- Personagem cartoon 3D/2.5D (estilo animação de cinema), roupa simples (camiseta + bermuda + chinelo), uma cor de camiseta por amigo.
- Placar ("PLACAR ATÉ AGORA") revisitado no meio; "A NOSSA RÉGUA" (barra de 0 s a 2 min 30 s) no começo.
- Mitos riscados com ✗; checklists com ✓; datas grandes ("1966 · HOUSTON · NASA") com cena reconstituída (câmara de vácuo com manômetro caindo 100% → 3%).
- Fonte condensada em caixa alta (estilo Barlow/Bebas), branco + uma cor de destaque por tema (laranja calor, azul frio, vermelho perigo, verde-limão "alívio").
- Fim: fileira de planetas + "COMENTA: QUAL VOCÊ TERIA CORAGEM DE VISITAR?" + "E MARCA O AMIGO…".

## Como adaptar no Brasil Milenar (pipeline Remotion, 2D vetorial)
- **Cartão de título por parada** com barra de progresso (nº de paradas) — nossa versão: régua/contador do vídeo + selo do lugar brasileiro.
- **Personagem 2D próprio e expressivo** (rosto, poses: neutro, braços abertos, mão na boca, susto, frio, calor) presente nas cenas — desenhado no nosso estilo, nunca o garoto deles.
- **1 elemento novo a cada 4-6 s**, nos cantos superiores, com rótulo pequeno + número grande; números que CONTAM; mostradores.
- **Cortes secos entre batidas** dentro da mesma parada (não só dissolve) — ritmo mais rápido que o do vídeo "1 bilhão".
- **Carimbo de fim de parada** sempre igual (no vídeo 4: "E O PÃO DE AÇÚCAR? AINDA ENTERRADO.").
- **Tela dividida** sempre que houver contraste (antes × depois, com × sem).
