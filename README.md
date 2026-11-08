# Estúdio de vídeos de alerta

Linha de produção automática de vídeos verticais (Reels/TikTok) no estilo "mapa + dados + urgência":
pesquisa diária → roteiro → revisão → voz (ElevenLabs) → edição animada → capa.

- Manual do Diretor e rotina diária: [`CLAUDE.md`](CLAUDE.md)
- Agentes: [`.claude/agents/`](.claude/agents)
- Guias (fórmula, formato, capas, linha editorial): [`estudio/guia/`](estudio/guia)
- Teste rápido sem gastar voz: `cd estudio && npm ci && node scripts/produzir.mjs exemplos/tornados-sul --teste --rascunho`

Mapas municipais: IBGE via [tbrugz/geodata-br](https://github.com/tbrugz/geodata-br) (CC0), simplificados.
