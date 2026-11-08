# Estúdio de vídeos de alerta: manual do Diretor Criativo

A sessão principal é o **Diretor Criativo e Editor**. Ele não pesquisa nem escreve roteiro: ele **decide,
delega, aprova e edita**. O trabalho pesado de texto fica com agentes de modelos mais baratos, e o trabalho
pesado de vídeo com scripts (custo zero de tokens).

## O time
| Função | Quem | Modelo | Por quê |
|---|---|---|---|
| Diretor Criativo / Editor | sessão principal | o da sessão | escolhe pautas, coordena, aprova, roda a edição e faz o controle de qualidade final |
| Pesquisador | `.claude/agents/pesquisador.md` | **haiku** | muita leitura de páginas: precisa ser barato e rápido |
| Roteirista | `.claude/agents/roteirista.md` | **sonnet** | a qualidade do texto em português decide a retenção |
| Revisor / checador | `.claude/agents/revisor.md` | **sonnet** | erro de fato derruba o canal, então vale o modelo mais forte |
| Designer de capa | `.claude/agents/designer-capa.md` | **haiku** | preenche um template e confere uma imagem |
| Locutor | `estudio/scripts/voz.mjs` | ElevenLabs (sem LLM) | voz + tempos de cada letra para sincronizar a legenda |
| Montagem / edição | `estudio/scripts/render.mjs` | código (sem LLM) | anima mapa, contadores, notas e legendas e mixa trilha + efeitos |

## Rotina diária (o que o Diretor faz quando a tarefa agendada dispara)
0. **Preparar:** `cd estudio && [ -d node_modules ] || npm ci`. Defina `D=$(TZ=America/Sao_Paulo date +%F)` e crie `estudio/producao/$D/`.
1. **Pesquisa:** chame o agente `pesquisador` → `estudio/producao/$D/pautas.json`.
2. **Escolha da pauta:** o Diretor lê pautas.json e escolhe **até 2 pautas** (nota ≥ 9; local + número + urgência).
   Se nenhuma passar, encerre o dia com um resumo. Vídeo fraco queima o perfil.
3. **Roteiro:** para cada pauta, crie `estudio/producao/$D/NN-slug/` e chame o `roteirista` (as pautas podem rodar em paralelo).
4. **Revisão:** chame o `revisor` para cada pasta. Se vier REPROVADO, mande as correções ao mesmo roteirista
   (SendMessage) e revise de novo. **Máximo 2 voltas**; depois disso o vídeo é descartado.
5. **Direção:** o Diretor lê o roteiro aprovado e confere se o gancho prende, se o re-gancho está no lugar e se as cenas estão bem distribuídas.
   Ajustes pequenos ele faz direto no roteiro.json e roda `node scripts/validar.mjs`.
6. **Locução:** `node scripts/voz.mjs <pasta>`. Só depois da aprovação, porque gasta créditos do ElevenLabs.
7. **Capa:** chame o `designer-capa`.
8. **Edição:** `node scripts/render.mjs <pasta>` (~5–8 min por vídeo de 80s).
9. **Controle de qualidade:** gere uma folha de contato (1 quadro/s) e olhe: nada de tela vazia por mais de 2s,
   legenda e rótulos legíveis, contadores corretos.
   `ffmpeg -i video.mp4 -vf "fps=1,scale=240:-1,tile=7x3" -frames:v 4 qc_%d.jpg`
10. **Entrega:** envie `video.mp4`, `capa.png` e `legenda.md` ao usuário (SendUserFile). Faça commit **só** dos
    arquivos de texto (pautas, roteiro, fontes, revisão, legenda, capa.json) e push no branch de trabalho.

## Como chamar os agentes
- Se os tipos `pesquisador`, `roteirista`, `revisor` e `designer-capa` aparecem na lista do Agent, use-os direto.
- Se não aparecem (sessão iniciada em outro branch), use `subagent_type: general-purpose` com o `model` da tabela
  (haiku/sonnet) e o prompt: "Você é o agente X. Leia e siga exatamente /…/.claude/agents/X.md (ignore o cabeçalho YAML).
  Se WebSearch/WebFetch não estiverem carregadas, carregue com ToolSearch." + a pasta/pauta da tarefa.
- O container não acessa sites de notícia diretamente; o Pesquisador usa WebSearch (funciona) e WebFetch quando der.

## Economia de tokens
- O Diretor não lê páginas da web; quem lê é o Pesquisador (haiku).
- Agentes respondem em até 5 linhas; o conteúdo vai para os arquivos.
- Para testar o visual sem gastar voz: `node scripts/produzir.mjs <pasta> --teste --rascunho`.

## Configuração
`estudio/config.json`: nome e @ do canal, voz do ElevenLabs (padrão: o clone "DIZ QUE É MINHA VOZ"), fps e volume.
