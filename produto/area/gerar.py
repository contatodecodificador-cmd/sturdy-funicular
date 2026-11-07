"""Gera o site da Área do Estúdio (uma página por passo) e os arquivos para baixar.

Como usar (o Claude roda isso):
    python3 produto/area/gerar.py

Saída: produto/area/site/  (pronto para publicar; a pasta site/ não vai para o GitHub)

Partes da Área e quem pode ver (veja ACESSO): guia/ (guia, completo), passos/ (skill, completo), extra/ (ideias).
"""
import html
import json
import shutil
import zipfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
PRODUTO = AQUI.parent
ESTUDIO = PRODUTO / "entrega" / "estudio"
EXTRA = PRODUTO / "entrega" / "extra-ideias"
SITE = AQUI / "site"
IMG = AQUI / "img"

# ---------------------------------------------------------------- downloads

def zipar(origem: Path, destino: Path, raiz_no_zip: str, so: list[str] | None = None):
    destino.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(origem.rglob("*")):
            if f.is_dir() or "node_modules" in f.parts or "saida" in f.parts:
                continue
            rel = f.relative_to(origem)
            if so and not any(str(rel).startswith(s) for s in so):
                continue
            z.write(f, f"{raiz_no_zip}/{rel}")


# ---------------------------------------------------------------- conteúdo

FASES = [
    ("A", "Preparar o estúdio", "uma vez só", [1, 2, 3]),
    ("B", "Criar a série", "uma vez por série", [4, 5]),
    ("C", "Fazer cada parte", "repete a cada vídeo", [6, 7, 8, 9, 10]),
]

PASSOS = {
    1: dict(
        titulo="As contas",
        resumo="Claude Pro, GitHub e a ferramenta de voz, nesta ordem.",
        tempo="15 minutos",
        comando=None,
        fazer=[
            "<b>Claude Pro, o mais importante.</b> Entre em <b>claude.ai</b>, crie a conta e assine o plano <b>Pro</b> (ou superior). O plano grátis não tem o Claude Code.",
            "<b>GitHub, grátis.</b> Entre em <b>github.com</b>, crie a conta e confirme o e-mail. É onde os arquivos do seu canal ficam guardados, e é por ele que o Claude trabalha na nuvem.",
            "<b>Voz, pode começar no grátis.</b> Crie uma conta em <b>elevenlabs.io</b> para ouvir e testar vozes. Assine um plano pago só quando for postar: é ele que libera o uso comercial e o clone da sua voz. Vai usar outra ferramenta de voz? Sem problema: você gera o áudio lá e manda para o Claude.",
        ],
        esperar="Você consegue entrar no claude.ai (com o Pro), no github.com e no elevenlabs.io.",
        problemas=[
            ("Não acho o Claude Code no plano grátis", "Ele só vem a partir do Pro. Assine o Pro em claude.ai."),
            ("Não sei qual voz escolher", "Deixe para depois. O /comecar e o /voz ajudam a escolher."),
        ],
        baixar=[],
    ),
    2: dict(
        titulo="Colocar o Estúdio no GitHub",
        resumo="Baixar a pasta do estúdio e subir no seu GitHub.",
        tempo="5 minutos",
        comando=None,
        fazer=[
            "Baixe o <b>estudio.zip</b> aqui embaixo e descompacte no computador.",
            "No GitHub, clique em <b>+</b> (no alto) e depois em <b>New repository</b>.",
            "Em <b>Repository name</b>, escreva o nome do seu canal, sem espaços (exemplo: <code>meu-canal</code>).",
            "Marque <b>Private</b> e clique em <b>Create repository</b>.",
            "Na página que abrir, clique em <b>uploading an existing file</b>.",
            "Abra a pasta <code>estudio</code> e arraste <b>tudo o que está dentro dela</b> para a página (não a pasta em si).",
            "Clique em <b>Commit changes</b>.",
        ],
        esperar="No seu repositório aparecem o arquivo <code>CLAUDE.md</code> e a pasta <code>.claude</code>.",
        problemas=[
            ("A pasta .claude não aparece no computador", "Pastas que começam com ponto ficam escondidas. No Mac, aperte Cmd + Shift + ponto. No Windows, ative \"Itens ocultos\" na aba Exibir. Depois arraste de novo."),
            ("Subi a pasta estudio inteira, e não o que tem dentro", "Apague o repositório e crie de novo, arrastando o conteúdo da pasta."),
        ],
        baixar=[("estudio.zip", "O estúdio completo: todos os comandos, o personagem-base e o projeto de vídeo.")],
    ),
    3: dict(
        titulo="Abrir o Claude Code e montar o estúdio",
        resumo="O Claude instala, testa e conversa sobre o seu canal.",
        tempo="15 minutos",
        comando="/comecar",
        fazer=[
            "Entre em <b>claude.ai/code</b>. Atenção: o chat normal do Claude não serve.",
            "Na primeira vez, aceite <b>conectar o GitHub</b> e dê acesso ao repositório do passo 2.",
            "Escolha o seu repositório e comece uma sessão nova.",
            "Digite <code>/comecar</code> e responda o que o Claude perguntar.",
        ],
        esperar="O Claude instala tudo sozinho, faz um vídeo de teste de 3 segundos, pede a chave da voz num cartão seguro (nunca no chat) e conversa sobre o seu canal: nicho, público, clima, limites, narrador, voz e redes.",
        problemas=[
            ("O Claude diz que não tem repositório", "Você está no chat normal. Volte para claude.ai/code e escolha o repositório."),
            ("O comando /comecar não aparece", "Confira se a pasta .claude subiu no passo 2."),
            ("Aparece um pedido para liberar um site", "É o Claude pedindo acesso a algo que ele precisa. Leia e aprove."),
        ],
        baixar=[("comando-comecar.zip", "Só este comando, para atualizar.")],
    ),
    4: dict(
        titulo="O mundo da série",
        resumo="A ideia vira uma série: personagens, regras, mistério e o plano das partes.",
        tempo="20 a 40 minutos",
        comando="/serie",
        fazer=[
            "Digite o comando. Sem ideia? Se você tem o Caça-Ideias, use <code>/ideias</code> antes.",
            "Responda as perguntas. O Claude sempre traz uma sugestão: você pode só dizer \"pode ser\".",
            "Leia o resumo do mundo da série e peça os ajustes que quiser até aprovar.",
        ],
        esperar="Um documento com a série em uma frase, o que ela tem de único, os personagens e a marca de cada um, as regras do mundo, o detalhe escondido, o mistério com a resposta e o plano de cada parte com a votação.",
        problemas=[
            ("A série ficou grande demais", "Peça para reduzir: menos personagens, menos lugares, de 3 a 4 partes."),
        ],
        baixar=[("comando-serie.zip", "Só este comando, para atualizar.")],
    ),
    5: dict(
        titulo="Personagens e cenários",
        resumo="O estilo da série e o visual de cada personagem, a partir do personagem-base.",
        tempo="30 a 60 minutos",
        comando="/visual",
        imagem="folha-base.png",
        fazer=[
            "Digite o comando. O Claude mostra 3 estilos diferentes como imagem. Escolha um (ou misture).",
            "Para cada personagem, escolha com o Claude: pele, cabelo, roupa, acessório, a marca de longe e as expressões.",
            "Aprove a folha de design de cada personagem e de cada cenário.",
        ],
        esperar="O estilo da série anotado, uma folha de design para cada personagem e cada cenário, e tudo pronto em código para os vídeos.",
        problemas=[
            ("O personagem precisa de algo que o base não tem", "Peça. O Claude cria a peça nova (barba, avental, uniforme, chapéu) do mesmo jeito do base."),
            ("A cena ficou escura demais", "Peça um ponto de luz. Cena escura nunca pode ser preto chapado."),
        ],
        baixar=[("comando-visual.zip", "Só este comando, para atualizar."), ("personagem-base.zip", "Só o personagem-base, para atualizar.")],
    ),
    6: dict(
        titulo="O roteiro da parte",
        resumo="A parte em frases curtas, duas aberturas para escolher e os dois caminhos da votação.",
        tempo="15 a 30 minutos",
        comando="/roteiro",
        fazer=[
            "Digite o comando e confirme o que esta parte precisa contar.",
            "Escolha a abertura entre as duas opções.",
            "Leia o roteiro em voz alta e peça os ajustes até aprovar.",
        ],
        esperar="O roteiro aprovado, o que acontece em cada cena, a escolha do fim e o que acontece em cada caminho da votação.",
        problemas=[
            ("Ficou comprido", "Peça para cortar. Um vídeo bom vai de 40 a 90 segundos."),
        ],
        baixar=[("comando-roteiro.zip", "Só este comando, para atualizar.")],
    ),
    7: dict(
        titulo="A voz",
        resumo="O Claude prepara o texto com emoção, gera a narração e marca o tempo de cada palavra.",
        tempo="10 a 20 minutos",
        comando="/voz",
        fazer=[
            "Digite o comando e aprove o texto da narração.",
            "Escolha: o Claude gera pelo ElevenLabs (ele pede licença antes de gastar créditos) ou você gera em outra ferramenta e envia o áudio na conversa.",
            "Ouça e peça para refazer qualquer frase que soar estranha.",
        ],
        esperar="A narração pronta e o tempo de cada palavra marcado, para as cenas e a legenda entrarem na hora certa.",
        problemas=[
            ("Erro de acesso no ElevenLabs", "A chave não está salva. Rode /comecar de novo e salve a chave no cartão seguro."),
            ("A voz trocou uma palavra", "Peça para reescrever a frase com outra palavra e gerar de novo."),
        ],
        baixar=[("comando-voz.zip", "Só este comando, para atualizar.")],
    ),
    8: dict(
        titulo="Montar o vídeo",
        resumo="Cenas, câmera, legenda, sons e o arquivo final. Quem trabalha é o Claude.",
        tempo="30 a 90 minutos (do Claude)",
        comando="/montar",
        fazer=[
            "Digite o comando e deixe o Claude trabalhar.",
            "Ele mostra uma folha com um quadro de cada cena antes do vídeo final. Peça os ajustes.",
            "Assista ao vídeo final e aprove.",
        ],
        esperar="O vídeo vertical pronto para postar, com os sons feitos do zero e o volume conferido.",
        problemas=[
            ("Quero música", "Use uma música sua ou de um banco de músicas livres, e confira se a licença permite usar nas redes. Envie o arquivo para o Claude."),
            ("A legenda cobre o rosto", "Peça para mudar o lado da legenda naquela cena."),
        ],
        baixar=[("comando-montar.zip", "Só este comando, para atualizar.")],
    ),
    9: dict(
        titulo="Postar",
        resumo="Capa, Stories, enquete e os textos de cada rede, prontos.",
        tempo="10 minutos",
        comando="/postar",
        fazer=[
            "Digite o comando.",
            "Baixe a capa, os Stories e copie os textos que o Claude entregar.",
            "Poste na ordem indicada e ligue o rótulo de conteúdo feito com IA.",
        ],
        esperar="Capa, Stories de chamada, Stories da enquete (com espaço para o adesivo) e as legendas de cada rede, com a ordem de postagem.",
        problemas=[
            ("A capa corta o rosto na grade do perfil", "Peça para centralizar mais o título e o rosto."),
        ],
        baixar=[("comando-postar.zip", "Só este comando, para atualizar.")],
    ),
    10: dict(
        titulo="O público decidiu",
        resumo="Você conta o resultado, e o Claude prepara a próxima parte.",
        tempo="5 minutos",
        comando="/proxima",
        fazer=[
            "Quando a votação fechar, digite o comando.",
            "Conte o resultado: os números, um print da enquete ou os comentários colados.",
            "Pronto: a próxima parte volta para o passo 6.",
        ],
        esperar="O resultado anotado, o plano da série ajustado e a próxima parte pronta para começar com \"vocês escolheram…\".",
        problemas=[
            ("Deu empate", "O Claude propõe um desempate, e você decide."),
        ],
        baixar=[("comando-proxima.zip", "Só este comando, para atualizar.")],
    ),
}

# ---------------------------------------------------------------- visual

CSS = """
:root { --noite:#0B0F14; --noite-2:#121820; --noite-3:#19212B; --texto:#E9E4DA; --suave:#9AA3AD; --lanterna:#F0A93B; --medidor:#6FD39A; --linha:rgba(233,228,218,.10); color-scheme: dark; }
* { box-sizing: border-box; }
body { margin:0; background:var(--noite); color:var(--texto); font-family:"Inter",system-ui,sans-serif; font-size:17px; line-height:1.65;
  background-image: radial-gradient(ellipse 80% 40% at 70% -10%, rgba(240,169,59,.10), transparent 60%); min-height:100vh; }
a { color: inherit; }
.wrap { max-width: 860px; margin: 0 auto; padding: 0 16px; }
header { border-bottom:1px solid var(--linha); background:rgba(11,15,20,.85); position:sticky; top:0; backdrop-filter: blur(8px); z-index:5; }
header .wrap { display:flex; justify-content:space-between; align-items:center; padding-top:12px; padding-bottom:12px; gap:12px; }
.marca { font-family:"Archivo",sans-serif; font-weight:900; text-transform:uppercase; text-decoration:none; }
.marca span, em { color:var(--lanterna); font-style:normal; }
.onde { font-family:"IBM Plex Mono",monospace; font-size:.8rem; color:var(--suave); letter-spacing:.08em; text-transform:uppercase; }
h1, h2, h3 { font-family:"Archivo",sans-serif; font-weight:900; text-transform:uppercase; line-height:1.05; letter-spacing:-.01em; margin:0 0 .5em; }
h1 { font-size: clamp(2rem, 6vw, 3.2rem); }
h2 { font-size: 1.5rem; margin-top: 1.6em; }
h3 { font-size: 1.1rem; }
main { padding: 48px 0 80px; }
.rotulo { font-family:"IBM Plex Mono",monospace; font-weight:700; color:var(--lanterna); font-size:.78rem; letter-spacing:.16em; text-transform:uppercase; display:block; margin-bottom:12px; }
.suave { color: var(--suave); }
.chips { display:flex; flex-wrap:wrap; gap:8px; margin: 8px 0 24px; }
.chip { font-family:"IBM Plex Mono",monospace; font-size:.8rem; padding:5px 12px; border-radius:999px; border:1px solid var(--linha); color:var(--suave); }
.cartao { background:linear-gradient(160deg,#1D2631,#141A22); border:1px solid rgba(233,228,218,.12); border-radius:12px; padding:22px; }
ol.fazer { padding-left: 0; list-style: none; counter-reset: f; }
ol.fazer li { counter-increment: f; position: relative; padding: 10px 0 10px 46px; border-bottom: 1px solid var(--linha); }
ol.fazer li::before { content: counter(f); position:absolute; left:0; top:10px; width:30px; height:30px; border-radius:50%; display:grid; place-items:center;
  font-family:"IBM Plex Mono",monospace; font-weight:700; font-size:.85rem; color:var(--lanterna); background:rgba(240,169,59,.12); box-shadow: inset 0 0 0 1px rgba(240,169,59,.4); }
code { font-family:"IBM Plex Mono",monospace; font-size:.9em; background:rgba(255,255,255,.06); padding:1px 6px; border-radius:4px; }
.comando { display:flex; align-items:center; justify-content:space-between; gap:12px; margin: 16px 0; padding: 18px 20px; border-radius:12px;
  background: rgba(240,169,59,.07); border: 1.5px solid rgba(240,169,59,.5); }
.comando code { background:none; font-size:1.6rem; font-weight:700; color:var(--lanterna); padding:0; }
button.copiar { font-family:"Archivo",sans-serif; font-weight:900; text-transform:uppercase; font-size:.8rem; background:var(--lanterna); color:#1A1206; border:0; border-radius:6px; padding:10px 14px; cursor:pointer; }
.esperar { border-left: 3px solid var(--medidor); background: rgba(111,211,154,.06); padding: 16px 20px; border-radius: 0 10px 10px 0; }
table { width:100%; border-collapse: collapse; }
td { padding: 12px 8px; border-bottom: 1px solid var(--linha); vertical-align: top; }
td:first-child { font-weight: 600; width: 40%; }
.baixar { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:12px; }
.baixar a { flex: none; font-family:"Archivo",sans-serif; font-weight:900; text-transform:uppercase; font-size:.85rem; text-decoration:none;
  color:var(--lanterna); border:1.5px solid var(--lanterna); border-radius:6px; padding:10px 14px; }
.baixar a:hover { background: rgba(240,169,59,.08); }
.navega { display:flex; justify-content:space-between; gap:12px; margin-top: 48px; }
.navega a { text-decoration:none; padding: 14px 18px; border:1px solid var(--linha); border-radius:10px; }
.navega a.proximo { background: var(--lanterna); color: #1A1206; font-weight: 700; border: 0; }
.fase { margin-top: 40px; }
.passos { display:grid; gap:12px; }
.passo { display:grid; grid-template-columns: 56px 1fr auto; gap:16px; align-items:center; text-decoration:none; padding:16px 18px; border-radius:12px;
  border:1px solid var(--linha); background: rgba(255,255,255,.02); transition: border-color .2s, background .2s; }
.passo:hover { border-color: rgba(240,169,59,.45); background: rgba(240,169,59,.05); }
.passo .n { font-family:"Archivo",sans-serif; font-weight:900; font-size:1.6rem; color:var(--lanterna); }
.passo b { display:block; font-family:"Archivo",sans-serif; text-transform:uppercase; }
.passo span.suave { font-size:.95rem; }
.passo code { white-space: nowrap; }
.feito { display:none; color: var(--medidor); font-family:"IBM Plex Mono",monospace; font-size:.8rem; }
.passo.ok .feito { display:inline; }
.marcar { margin-top: 24px; display:flex; gap:10px; align-items:center; cursor:pointer; }
img.ilustra { width: 100%; max-width: 420px; border-radius: 12px; display: block; margin: 16px auto; border: 1px solid var(--linha); }
footer { border-top:1px solid var(--linha); padding: 24px 0 40px; color: var(--suave); font-size: .85rem; }
@media (max-width: 640px) { .passo { grid-template-columns: 40px 1fr; } .passo code { grid-column: 2; justify-self: start; } .baixar { flex-direction: column; align-items: flex-start; } .comando code { font-size: 1.3rem; } }
"""

FONTES = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;900&family=IBM+Plex+Mono:wght@500;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">'

JS = """
<script>
  // Botão de copiar o comando
  document.querySelectorAll('button.copiar').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-texto');
      try { navigator.clipboard.writeText(t); b.textContent = 'Copiado!'; setTimeout(function(){ b.textContent = 'Copiar'; }, 1500); } catch (e) {}
    });
  });
  // Marcar passo como feito (fica guardado só neste navegador)
  function lerFeitos() { try { return JSON.parse(localStorage.getItem('estudio-feitos') || '[]'); } catch (e) { return []; } }
  function salvarFeitos(l) { try { localStorage.setItem('estudio-feitos', JSON.stringify(l)); } catch (e) {} }
  var feitos = lerFeitos();
  document.querySelectorAll('.passo[data-n]').forEach(function (p) { if (feitos.indexOf(p.getAttribute('data-n')) >= 0) p.classList.add('ok'); });
  var caixa = document.getElementById('marcar');
  if (caixa) {
    var n = caixa.getAttribute('data-n');
    caixa.checked = feitos.indexOf(n) >= 0;
    caixa.addEventListener('change', function () {
      var l = lerFeitos().filter(function (x) { return x !== n; });
      if (caixa.checked) l.push(n);
      salvarFeitos(l);
    });
  }
</script>
"""


CSS += """
.secao { margin-top: 40px; position: relative; }
.secao .topo-secao { display:flex; justify-content:space-between; align-items:flex-end; gap:12px; flex-wrap:wrap; }
.etiqueta-produto { font-family:"IBM Plex Mono",monospace; font-size:.75rem; letter-spacing:.1em; text-transform:uppercase; color:var(--suave); border:1px solid var(--linha); padding:4px 10px; border-radius:999px; }
.secao.travada .conteudo { opacity:.35; pointer-events:none; filter: grayscale(.6); }
.cadeado { display:none; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; margin: 12px 0 16px; padding:16px 18px; border-radius:12px;
  border:1.5px dashed rgba(240,169,59,.55); background: rgba(240,169,59,.05); }
.secao.travada .cadeado { display:flex; }
.cadeado a { font-family:"Archivo",sans-serif; font-weight:900; text-transform:uppercase; font-size:.85rem; text-decoration:none; background:var(--lanterna); color:#1A1206; border-radius:6px; padding:10px 14px; }
.aviso-previa { font-family:"IBM Plex Mono",monospace; font-size:.75rem; color:var(--suave); margin-top:28px; }
.lista-cadernos { display:grid; gap:12px; }
.caderno { display:flex; justify-content:space-between; gap:12px; align-items:center; padding:16px 18px; border-radius:12px; border:1px solid var(--linha); background: rgba(255,255,255,.02); }
.status { font-family:"IBM Plex Mono",monospace; font-size:.75rem; color: var(--lanterna); white-space: nowrap; }
"""

# Quais produtos liberam cada parte da Área. O mesmo mapa é usado pelo porteiro do site (login).
ACESSO = {
    "guia": ["guia", "completo"],
    "passos": ["skill", "completo"],
    "extra": ["ideias"],
}

# Links de checkout da Cakto, para o botão "Liberar". Preencha quando os produtos existirem.
CHECKOUT = {
    "guia": "https://pay.cakto.com.br/sc7ng7g",
    "skill": "https://pay.cakto.com.br/5j8pjnu",
    "completo": "https://pay.cakto.com.br/34jdugf",
    "ideias": "https://pay.cakto.com.br/tjji4nr",
}

JS_ACESSO = """
<script>
  // Mostra com cadeado as partes que a pessoa não comprou.
  // No site no ar, quem decide é o porteiro (o login): ele responde em /api/acesso o que a pessoa comprou.
  // Para pré-visualizar sem login, use ?como=guia ou ?como=skill ou ?como=completo,ideias no endereço.
  (function () {
    var param = new URLSearchParams(location.search).get('como');
    function aplicar(produtos) {
      document.querySelectorAll('.secao[data-libera]').forEach(function (s) {
        var precisa = s.getAttribute('data-libera').split(',');
        var ok = precisa.some(function (p) { return produtos.indexOf(p) >= 0; });
        s.classList.toggle('travada', !ok);
      });
    }
    if (new URLSearchParams(location.search).get('bloqueado')) {
      var aviso = document.createElement('div'); aviso.className = 'cadeado'; aviso.style.display = 'flex';
      aviso.innerHTML = '<span>🔒 Essa parte faz parte de outro produto. Veja abaixo como liberar.</span>';
      var h1 = document.querySelector('h1'); if (h1) h1.parentNode.insertBefore(aviso, h1.nextSibling);
    }
    if (param) { aplicar(param.split(',')); return; }
    fetch('/api/acesso', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.produtos) aplicar(d.produtos); })
      .catch(function () {});
  })();
</script>
"""


def pagina(titulo: str, onde: str, corpo: str, raiz: str = "", extra_js: str = "") -> str:
    return f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>{html.escape(titulo)} · Estúdio do Nogueira</title>
{FONTES}
<style>{CSS}</style>
</head>
<body>
<header><div class="wrap"><a class="marca" href="{raiz}index.html">Estúdio do <span>Nogueira</span></a><span class="onde">{onde} · <a href="/api/sair" style="color:inherit">sair</a></span></div></header>
<main><div class="wrap">
{corpo}
</div></main>
<footer><div class="wrap">Área do Estúdio · conteúdo exclusivo para quem comprou. O acesso é pessoal: por favor, não compartilhe.</div></footer>
{JS}
{extra_js}
</body>
</html>
"""


def bloco_comando(cmd: str) -> str:
    return f'<div class="comando"><code>{cmd}</code><button class="copiar" data-texto="{cmd}">Copiar</button></div>'


def pagina_passo(n: int) -> str:
    p = PASSOS[n]
    fase = next(f for f in FASES if n in f[3])
    partes = [f'<span class="rotulo">Fase {fase[0]} · {fase[1]} · Passo {n} de 10</span>',
              f"<h1>{p['titulo']}</h1>",
              f'<p class="suave">{p["resumo"]}</p>',
              f'<div class="chips"><span class="chip">⏱ {p["tempo"]}</span><span class="chip">{fase[2]}</span></div>']
    if p["comando"]:
        partes.append("<h2>O comando</h2>")
        partes.append('<p>Na conversa do <b>Claude Code</b> (claude.ai/code), com o seu repositório aberto, digite:</p>')
        partes.append(bloco_comando(p["comando"]))
        partes.append('<p class="suave">Esqueceu em que passo está? Digite <code>/seguir</code> que o Claude descobre.</p>')
    partes.append("<h2>O que fazer</h2>")
    partes.append('<ol class="fazer">' + "".join(f"<li>{x}</li>" for x in p["fazer"]) + "</ol>")
    if p.get("imagem"):
        partes.append(f'<img class="ilustra" src="img/{p["imagem"]}" alt="Exemplos do personagem-base com roupas, cabelos, acessórios e expressões diferentes">')
    partes.append("<h2>O que esperar</h2>")
    partes.append(f'<div class="esperar">{p["esperar"]}</div>')
    if p["problemas"]:
        partes.append("<h2>Deu problema?</h2>")
        partes.append("<table>" + "".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a, b in p["problemas"]) + "</table>")
    if p["baixar"]:
        partes.append("<h2>Baixar</h2>")
        partes.append('<div class="cartao">' + "".join(
            f'<div class="baixar"><span><b>{arq}</b><br><span class="suave">{desc}</span></span><a href="baixar/{arq}" download>Baixar</a></div>'
            for arq, desc in p["baixar"]) + "</div>")
        if n > 2:
            partes.append('<p class="suave">Este comando já veio no <b>estudio.zip</b> do passo 2. Baixe aqui só quando avisarmos que saiu uma versão nova: suba a pasta <code>.claude</code> do zip no seu repositório (Add file › Upload files) e ela substitui a antiga.</p>')
    partes.append(f'<label class="marcar"><input type="checkbox" id="marcar" data-n="{n}"> Marcar este passo como feito</label>')
    ant = f'<a href="passo-{n-1:02d}.html">← Passo {n-1}</a>' if n > 1 else '<a href="../index.html">← Início</a>'
    prox = f'<a class="proximo" href="passo-{n+1:02d}.html">Passo {n+1} →</a>' if n < 10 else '<a class="proximo" href="passo-06.html">Próxima parte: passo 6 →</a>'
    partes.append(f'<div class="navega">{ant}{prox}</div>')
    return pagina(p["titulo"], f"Passo {n} de 10", "\n".join(partes), raiz="../")


# O guia (só para quem comprou o guia ou o completo). Os cadernos ainda estão sendo escritos.
CADERNOS = [
    ("1", "O seu canal", "nicho, público, narrador e a votação como motor"),
    ("2", "A série", "o mundo da história, os personagens e os caminhos"),
    ("3", "O roteiro", "como prender do começo ao fim, o gancho e a pergunta do final"),
    ("4", "A voz", "escolher ou criar a voz, dar emoção e encaixar nas cenas"),
    ("5", "Imagem e som", "personagens, cenários, cenas que funcionam no celular, legenda e som"),
    ("6", "Postar e continuar", "capa, Stories, legenda, ler a votação e os cuidados"),
    ("+", "Diário de produção", "O Bunker e O Tempo Parou, com os erros reais e as correções"),
    ("+", "Modelos para preencher", "mundo da série, personagens, roteiro, caminhos e postagem"),
]


def pagina_guia() -> str:
    corpo = ['<span class="rotulo">Guia do Estúdio</span>',
             "<h1>O guia <em>passo a passo.</em></h1>",
             "<p>O método inteiro explicado em cadernos curtos, com exemplos reais dos nossos dois canais.</p>",
             '<div class="lista-cadernos">']
    for n, nome, desc in CADERNOS:
        corpo.append(f'<div class="caderno"><span><b>{"Caderno " + n if n != "+" else "Extra"} · {nome}</b><br><span class="suave">{desc}</span></span><span class="status">em escrita</span></div>')
    corpo.append("</div>")
    corpo.append('<div class="navega"><a href="../index.html">← Área do Estúdio</a><span></span></div>')
    return pagina("Guia", "Guia", "\n".join(corpo), raiz="../")


def cadeado(produto_liberar: str, texto: str) -> str:
    link = CHECKOUT.get(produto_liberar) or "#"
    return f'<div class="cadeado"><span>🔒 {texto}</span><a href="{link}">Liberar</a></div>'


def pagina_inicio() -> str:
    partes = ['<span class="rotulo">Área do Estúdio</span>',
              "<h1>Bem-vindo ao <em>seu estúdio.</em></h1>",
              "<p>Aqui fica tudo o que você comprou. O que estiver com cadeado faz parte de outro produto e pode ser liberado quando quiser.</p>"]

    # Guia
    partes.append(f'<div class="secao" data-libera="{",".join(ACESSO["guia"])}">'
                  '<div class="topo-secao"><h2 style="margin:0">O guia</h2><span class="etiqueta-produto">Guia · Completo</span></div>'
                  + cadeado("guia", "O guia faz parte do produto Guia (ou do Completo).")
                  + '<div class="conteudo"><a class="passo" href="guia/index.html"><span class="n">📖</span>'
                  '<span><b>Os cadernos do guia</b><span class="suave">O método explicado, com os exemplos reais dos nossos canais.</span></span></a></div></div>')

    # Passo a passo
    partes.append(f'<div class="secao" data-libera="{",".join(ACESSO["passos"])}">'
                  '<div class="topo-secao"><h2 style="margin:0">O passo a passo com os comandos</h2><span class="etiqueta-produto">Skill · Completo</span></div>'
                  + cadeado("skill", "Os comandos fazem parte do produto Skill (ou do Completo).")
                  + '<div class="conteudo"><div class="cartao" style="margin:12px 0"><b>Regra de ouro:</b> o que o Claude consegue fazer, ele faz. '
                  'Você digita o comando, responde e aprova. Esqueceu onde parou? Digite <code>/seguir</code>.</div>')
    for letra, nome, quando, ns in FASES:
        partes.append(f'<div class="fase"><span class="rotulo">Fase {letra} · {quando}</span><h3>{nome}</h3><div class="passos">')
        for n in ns:
            p = PASSOS[n]
            cmd = f"<code>{p['comando']}</code>" if p["comando"] else ""
            partes.append(f'<a class="passo" data-n="{n}" href="passos/passo-{n:02d}.html"><span class="n">{n:02d}</span>'
                          f'<span><b>{p["titulo"]} <span class="feito">✓ feito</span></b><span class="suave">{p["resumo"]}</span></span>{cmd}</a>')
        partes.append("</div></div>")
    partes.append("</div></div>")

    # Extra
    partes.append(f'<div class="secao" data-libera="{",".join(ACESSO["extra"])}">'
                  '<div class="topo-secao"><h2 style="margin:0">Extra: Caça-Ideias</h2><span class="etiqueta-produto">Extra</span></div>'
                  + cadeado("ideias", "O Caça-Ideias é um extra. Ele pesquisa e te entrega 10 ideias de série prontas.")
                  + '<div class="conteudo"><a class="passo" href="extra/index.html"><span class="n">💡</span>'
                  '<span><b>O comando /ideias</b><span class="suave">Sem ideia? O Claude pesquisa o seu nicho e traz ideias prontas.</span></span><code>/ideias</code></a></div></div>')

    partes.append('<p class="aviso-previa">Pré-visualização: acrescente ?como=guia, ?como=skill ou ?como=completo,ideias no endereço para ver como cada comprador enxerga esta página.</p>')
    return pagina("Início", "Área do Estúdio", "\n".join(partes), extra_js=JS_ACESSO)


def pagina_extra() -> str:
    corpo = ['<span class="rotulo">Extra · Caça-Ideias</span>',
             "<h1>Sem ideia? <em>O Claude pesquisa.</em></h1>",
             "<p>O comando <code>/ideias</code> pesquisa o que o público do seu nicho está procurando, traz 10 ideias de série prontas e te ajuda a escolher e lapidar a melhor.</p>",
             "<h2>Instalar (uma vez só)</h2>",
             '<ol class="fazer"><li>Tenha o seu estúdio no GitHub e aberto no Claude Code (passos 1 a 3).</li>'
             "<li>Baixe o <b>caca-ideias.zip</b> e descompacte.</li>"
             "<li>No seu repositório do GitHub, clique em <b>Add file</b> › <b>Upload files</b>.</li>"
             "<li>Arraste a pasta <code>.claude</code> que está dentro de <code>extra-ideias</code> e clique em <b>Commit changes</b>.</li></ol>",
             "<h2>Usar</h2>",
             "<p>Comece uma sessão nova no Claude Code e digite:</p>",
             bloco_comando("/ideias"),
             '<div class="esperar">10 ideias com nome, primeira frase, a escolha da parte 1, personagem, por que pode prender e se é fácil de fazer. Depois, o Claude lapida a escolhida com você e guarda tudo. Pode usar quantas vezes quiser: ele não repete ideias.</div>',
             "<h2>Baixar</h2>",
             '<div class="cartao"><div class="baixar"><span><b>caca-ideias.zip</b><br><span class="suave">O comando /ideias.</span></span><a href="baixar/caca-ideias.zip" download>Baixar</a></div></div>',
             '<div class="navega"><a href="../index.html">← Área do Estúdio</a><span></span></div>']
    return pagina("Caça-Ideias", "Extra", "\n".join(corpo), raiz="../")


def gerar_downloads():
    d = SITE / "passos" / "baixar"
    zipar(ESTUDIO, d / "estudio.zip", "estudio")
    for skill in sorted((ESTUDIO / ".claude" / "skills").iterdir()):
        zipar(ESTUDIO, d / f"comando-{skill.name}.zip", f"comando-{skill.name}", [f".claude/skills/{skill.name}"])
    zipar(ESTUDIO, d / "personagem-base.zip", "personagem-base", ["src/personagem"])
    zipar(EXTRA, SITE / "extra" / "baixar" / "caca-ideias.zip", "extra-ideias")


def main():
    if SITE.exists():
        shutil.rmtree(SITE)
    for pasta in ["passos/img", "guia", "extra"]:
        (SITE / pasta).mkdir(parents=True, exist_ok=True)
    for f in IMG.glob("*"):
        shutil.copy(f, SITE / "passos" / "img" / f.name)
    gerar_downloads()
    (SITE / "index.html").write_text(pagina_inicio(), encoding="utf-8")
    for n in PASSOS:
        (SITE / "passos" / f"passo-{n:02d}.html").write_text(pagina_passo(n), encoding="utf-8")
    (SITE / "guia" / "index.html").write_text(pagina_guia(), encoding="utf-8")
    (SITE / "extra" / "index.html").write_text(pagina_extra(), encoding="utf-8")
    (SITE / "acesso.json").write_text(json.dumps(ACESSO, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Pronto:", SITE)
    for f in sorted(SITE.rglob("*")):
        if f.is_file():
            print(f"  {f.relative_to(SITE)}  ({f.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
