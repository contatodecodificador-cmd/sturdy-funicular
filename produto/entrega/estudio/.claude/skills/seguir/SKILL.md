---
name: seguir
description: Comando coringa do Estúdio do Nogueira. Descobre onde a pessoa parou e chama o próximo passo certo. Use quando a pessoa digitar /seguir, disser "e agora?", "continua" ou não souber qual comando usar.
---

# /seguir: continuar de onde parou

A pessoa não precisa decorar nenhum comando. Você descobre onde ela está e segue.

1. Leia `canal/ESTADO.md`. Se ele não existir ou estiver vazio, considere que nada foi feito.
2. Confira os arquivos de verdade, porque o estado pode estar desatualizado:
   - `canal/CANAL.md` preenchido? Se não, o próximo é `/comecar`.
   - Existe alguma pasta em `series/` com `MUNDO.md` aprovado? Se não, o próximo é `/serie`
     (se a pessoa tiver o comando `/ideias` instalado e disser que está sem ideia, ofereça ele antes).
   - A série tem `PERSONAGENS.md` aprovado e as folhas de design? Se não, `/visual`.
   - Para a parte atual (`series/<serie>/partes/parte-NN/`):
     - sem `ROTEIRO.md` aprovado → `/roteiro`;
     - sem `voz.mp3` e `tempos.json` → `/voz`;
     - sem o vídeo em `saida/` → `/montar`;
     - sem `POST.md` → `/postar`;
     - tudo pronto e a parte já postada → `/proxima`.
3. Diga em uma frase onde a pessoa está e qual é o próximo passo, por exemplo:
   "Você está na parte 2 de O Bunker. O roteiro já foi aprovado, então agora é a voz."
4. Pergunte "Vamos?" e, com o sim, siga as instruções do comando certo (leia o `SKILL.md` dele em
   `.claude/skills/<comando>/` e faça o que está lá).
5. Se a pessoa quiser fazer outra coisa (voltar um passo, começar outra série), faça o que ela pediu.
