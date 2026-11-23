# Como levar esta skill para outra conta do Claude

## Opção 1 — Claude Code (recomendado)
1. Na conta nova, conecte o mesmo repositório do GitHub (`sturdy-funicular`). A skill já está dentro dele em `.claude/skills/brasil-milenar-videos/` e carrega sozinha ao abrir uma sessão no repositório. Os vídeos anteriores (roteiros, scripts, projetos Remotion) ficam em `videos/`.
2. Se usar outro repositório: descompacte este .zip em `.claude/skills/` do repositório novo (fica `.claude/skills/brasil-milenar-videos/SKILL.md`) ou em `~/.claude/skills/` no computador.

## Opção 2 — claude.ai (chat)
Configurações → Capacidades → Skills → "Enviar skill" e envie este .zip.

## Depois de instalar
- Peça: "Use a skill brasil-milenar-videos e leia references/13_fluxo_atual_e_regras_do_dono.md".
- Reconecte o que a conta nova precisar: ElevenLabs (chave pelo formulário seguro), Canva, Higgsfield (no chat onde o dono gera), GitHub.
- Na nuvem, libere na rede do ambiente os hosts listados na seção 9 do arquivo 13.
