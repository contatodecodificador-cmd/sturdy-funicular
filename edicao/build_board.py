import json, os, html, sys
from PIL import Image
S = os.path.dirname(os.path.abspath(__file__))
B = json.load(open(f'{S}/board.json'))
OUT = f'{S}/site'; os.makedirs(f'{OUT}/sprites', exist_ok=True)
PER, COLS, TW, TH = 40, 8, 480, 270
for s in range(0, len(B), PER):
    sheet = Image.new('RGB', (COLS * TW, ((min(PER, len(B) - s) + COLS - 1) // COLS) * TH))
    for k in range(min(PER, len(B) - s)):
        sheet.paste(Image.open(f'{S}/frames/f{s + k:03d}.jpg'), ((k % COLS) * TW, (k // COLS) * TH))
    sheet.save(f'{OUT}/sprites/s{s // PER:02d}.jpg', quality=72)


def tc(t): return f'{int(t // 60):02d}:{int(t % 60):02d}'


FX = {'zin': 'Zoom-in lento', 'zout': 'Zoom-out lento', 'panl': 'Deslize ←', 'panr': 'Deslize →', 'shake': 'Tremor', 'flash': 'Corte com flash'}
SFX = {'whoosh': 'Whoosh', 'hit': 'Impacto', 'boom': 'Boom grave', 'tick': 'Tique', 'pop': 'Pop', 'stamp': 'Carimbo', 'riser': 'Subida de tensão', 'wind': 'Vento', 'water': 'Água', 'fire': 'Fogueira'}
KIND = {'era': 'Cartela de capítulo', 'tier': 'Tier list', 'tierfull': 'Tier list final', 'number': 'Cartão de número', 'oxygen': 'Barra de oxigênio',
        'weapon': 'Cartão de arma', 'bars': 'Gráfico de barras', 'compare': 'Comparação lado a lado', 'kinetic': 'Texto animado', 'mapfocus': 'Mapa 2D', 'chain': 'Linha evolutiva 2D'}

secs = []
for b in B:
    if b['sec'] and (not secs or secs[-1]['name'] != b['sec']): secs.append(dict(name=b['sec'], items=[], music=b['music']))
    secs[-1]['items'].append(b)

total = B[-1]['t1']; durs = [b['t1'] - b['t0'] for b in B]
nmiss = sum(1 for b in B if b['missing'])
srcs = {}
for b in B:
    for c in b['src']: srcs.setdefault(c['title'], c)
ngfx = sum(1 for b in B if b['t'] == 'gfx')


def card(b):
    k = b['i'] % PER; sheet = b['i'] // PER
    x = (k % COLS); y = (k // COLS); rows = (min(PER, len(B) - sheet * PER) + COLS - 1) // COLS
    pos = f"background-image:url('sprites/s{sheet:02d}.jpg');background-size:{COLS * 100}% {rows * 100}%;background-position:{x / (COLS - 1) * 100 if COLS > 1 else 0:.4f}% {y / (rows - 1) * 100 if rows > 1 else 0:.4f}%"
    d = b['t1'] - b['t0']
    what = KIND.get(b['kind'], 'Gráfico') if b['t'] == 'gfx' else 'Imagem de banco'
    chips = [f'<span class="chip kind">{html.escape(what)}</span>']
    if b['fx']: chips.append(f'<span class="chip">{FX.get(b["fx"], b["fx"])}</span>')
    if b['sfx']: chips.append(f'<span class="chip sfx">♪ {SFX.get(b["sfx"], b["sfx"])}</span>')
    onscreen = ' · '.join(html.escape(x.replace('\n', ' ')) for x in [b.get('text'), b.get('stamp'), (b.get('label') or '') + (' — ' + b['sub'] if b.get('sub') else '')] if x)
    src = ''.join(f'<a href="{html.escape(c["page"])}" target="_blank" rel="noopener">{html.escape(c["title"][5:][:48])}</a> <span class="lic">{html.escape(c["lic"])}</span><br>' for c in b['src'])
    miss = f'<p class="miss">Falta imagem: {", ".join(b["missing"])}</p>' if b['missing'] else ''
    narr = f'<p class="narr">“{html.escape(b["narr"])}”</p>' if b['narr'] else ''
    note = f'<p class="note">{html.escape(b["note"])}</p>' if b['note'] else ''
    return f'''<article class="card{' flag' if b['missing'] else ''}" id="c{b['i']}">
<div class="thumb" style="{pos}" role="img" aria-label="Cena {b['i'] + 1}"></div>
<div class="meta"><span class="num">#{b['i'] + 1:03d}</span><span class="tc">{tc(b['t0'])} → {tc(b['t1'])}</span><span class="dur{' fast' if d < 2 else ''}">{d:.1f} s</span></div>
{narr}{f'<p class="ons"><b>Na tela:</b> {onscreen}</p>' if onscreen else ''}<div class="chips">{''.join(chips)}</div>{note}{miss}
{f'<p class="src">{src}</p>' if src else ''}</article>'''


kit_ids = {}
for b in B:
    key = b['kind'] if b['t'] == 'gfx' else ('label' if b.get('label') and not b.get('loc') else 'loc' if b.get('loc') else 'stamp' if b.get('stamp') else 'text' if b.get('text') else None)
    if key and key not in kit_ids: kit_ids[key] = b['i']
KITNAME = dict(KIND, label='Label de identificação', loc='Mini mapa de localização', stamp='Carimbo ✓/✕', text='Texto de impacto')
kit = ''.join(f'<figure><div class="thumb" style="{card(B[i]).split("style=\"")[1].split("\"")[0]}"></div><figcaption>{KITNAME.get(k, k)}</figcaption></figure>'
              for k, i in kit_ids.items() if k not in ('tierfull',))

nav = ''.join(f'<a href="#sec{n}">{html.escape(s["name"])}</a>' for n, s in enumerate(secs))
body = ''
for n, s in enumerate(secs):
    d0, d1 = s['items'][0]['t0'], s['items'][-1]['t1']
    body += f'''<section class="sec" id="sec{n}"><header><h2>{html.escape(s['name'])}</h2><p class="sm">{tc(d0)} – {tc(d1)} · {len(s['items'])} cenas{(' · ' + html.escape(s['music'])) if s['music'] else ''}</p></header>
<div class="grid">{''.join(card(b) for b in s['items'])}</div></section>'''

credits = ''.join(f'<tr><td><a href="{html.escape(c["page"])}" target="_blank" rel="noopener">{html.escape(c["title"][5:])}</a></td><td>{html.escape(c["artist"] or "—")}</td><td>{html.escape(c["lic"])}</td></tr>' for c in sorted(srcs.values(), key=lambda c: c['title']))

page = f'''<title>Storyboard Caramelo Pré-Histórico</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap">
<style>
/* Layout: sala de edição — capítulos em faixas, cenas em grade de quadros 16:9 */
:root{{--bg:#f3eee6;--panel:#fffaf2;--ink:#1d1915;--muted:#6f655a;--line:#e0d6c8;--accent:#b8691c;--danger:#c23a3f;--chip:#efe5d6;
--display:"Playfair Display",Georgia,serif;--body:Inter,system-ui,sans-serif;--mono:"JetBrains Mono",ui-monospace,monospace}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#141210;--panel:#1d1a17;--ink:#f1e8da;--muted:#a69a8b;--line:#2f2a25;--accent:#d98e3a;--danger:#e5484d;--chip:#2a2520;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#141210;--panel:#1d1a17;--ink:#f1e8da;--muted:#a69a8b;--line:#2f2a25;--accent:#d98e3a;--danger:#e5484d;--chip:#2a2520;color-scheme:dark}}
body{{background:var(--bg);color:var(--ink);font-family:var(--body);line-height:1.45;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:24px 64px}}
.wrap{{max-width:1400px;margin:0 auto;display:flex;flex-direction:column;gap:40px}}
h1{{font-family:var(--display);font-weight:900;font-size:clamp(30px,5vw,54px);line-height:1.05;margin:0;text-wrap:balance}}
h2{{font-family:var(--display);font-size:28px;margin:0}}
.eyebrow{{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:700;margin:0 0 8px}}
.lede{{color:var(--muted);max-width:68ch;margin:12px 0 0}}
.stats{{display:flex;flex-wrap:wrap;gap:10px 28px;margin-top:20px;font-variant-numeric:tabular-nums}}
.stats div{{display:flex;flex-direction:column}}.stats b{{font-family:var(--display);font-size:30px}}.stats span{{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}}
nav{{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--bg);padding-block:10px;border-bottom:1px solid var(--line);display:flex;gap:8px;overflow-x:auto}}
body::before{{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--bg)}}
nav a{{white-space:nowrap;font-size:13px;font-weight:600;color:var(--ink);text-decoration:none;padding:6px 12px;border-radius:999px;background:var(--chip)}}
nav a:hover,nav a:focus-visible{{background:var(--accent);color:#1d1915;outline:none}}
.tools{{display:flex;gap:12px;align-items:center;flex-wrap:wrap;font-size:14px}}
.tools label{{display:flex;gap:8px;align-items:center;cursor:pointer}}
.kit{{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px}}
.kit figure{{margin:0}}.kit figcaption{{font-size:13px;color:var(--muted);margin-top:6px}}
.thumb{{aspect-ratio:16/9;max-width:100%;background-repeat:no-repeat;border-radius:4px;background-color:#000}}
.sec{{display:flex;flex-direction:column;gap:16px;scroll-margin-top:70px}}
.sec header{{border-left:4px solid var(--accent);padding-left:14px}}
.sm{{color:var(--muted);font-size:14px;margin:4px 0 0}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}}
.card{{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:10px;display:flex;flex-direction:column;gap:8px;min-width:0}}
.card.flag{{border-color:var(--danger)}}
.meta{{display:flex;gap:10px;align-items:baseline;font-family:var(--mono);font-size:12px;color:var(--muted)}}
.num{{color:var(--ink);font-weight:500}}.dur{{margin-left:auto}}.dur.fast{{color:var(--accent)}}
.narr{{font-size:13px;margin:0;font-style:italic}}
.ons{{font-size:13px;margin:0}}.ons b{{font-weight:600;color:var(--accent)}}
.chips{{display:flex;flex-wrap:wrap;gap:6px}}
.chip{{font-size:11px;padding:3px 8px;border-radius:999px;background:var(--chip);color:var(--ink)}}
.chip.kind{{font-weight:700}}.chip.sfx{{color:var(--accent)}}
.note{{font-size:12px;margin:0;color:var(--muted)}}
.miss{{font-size:12px;margin:0;color:var(--danger);font-weight:600}}
.src{{font-size:11px;margin:0;color:var(--muted);word-break:break-word}}.src a{{color:var(--muted)}}.lic{{font-weight:600}}
.panel{{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:20px}}
.panel ul{{margin:8px 0 0;padding-left:20px}}.panel li{{margin:4px 0}}
.tbl{{overflow-x:auto}} table{{border-collapse:collapse;font-size:13px;width:100%}} td,th{{text-align:left;padding:6px 10px;border-bottom:1px solid var(--line);vertical-align:top}}
td a{{color:var(--ink)}}
.only-flag .card:not(.flag){{display:none}}
@media (prefers-reduced-motion:no-preference){{nav a{{transition:background .15s}}}}
</style>
<div class="wrap">
<header>
<p class="eyebrow">Storyboard · versão final (quadros do vídeo renderizado)</p>
<h1>Um Vira-Lata Caramelo Sobreviveria ao Brasil Pré-Histórico?</h1>
<p class="lede">Cada quadro é uma cena do vídeo, sincronizada com a narração da voz Davi Andrei. As imagens vêm do Wikimedia Commons, com licença livre; os gráficos 2D, a correção de cor e os efeitos sonoros foram criados para o canal. Os tempos foram sincronizados palavra por palavra com a narração.</p>
<div class="stats"><div><b>{len(B)}</b><span>cenas</span></div><div><b>{tc(total)}</b><span>duração</span></div><div><b>{sum(durs) / len(durs):.1f} s</b><span>plano médio</span></div>
<div><b>{max(durs):.1f} s</b><span>plano mais longo</span></div><div><b>{ngfx}</b><span>gráficos 2D</span></div><div><b>{len(srcs)}</b><span>imagens de banco</span></div><div><b>{nmiss}</b><span>cenas sem imagem</span></div></div>
</header>
<section class="panel"><h2>Como ler</h2><ul>
<li><b>Na tela</b> é o texto, label ou carimbo que aparece sobre a imagem. Labels ficam no canto inferior esquerdo, acima da barra do YouTube; o mini mapa fica no canto superior direito. Nenhum dos dois cobre o centro, onde está o animal.</li>
<li>Chips em laranja com ♪ são efeitos sonoros. A trilha de cada capítulo aparece no cabeçalho dele e fica cerca de 22 dB abaixo da voz.</li>
<li>Durações em laranja têm menos de 2 s (cortes rápidos, principalmente na intro).</li>
<li>Cenas com borda vermelha ainda precisam de imagem.</li></ul>
<div class="tools"><label><input type="checkbox" id="onlyflag"> Mostrar só cenas que precisam de imagem</label></div></section>
<section class="sec"><header><h2>Kit visual do canal</h2><p class="sm">Gráficos criados para o vídeo: carvão, creme e caramelo, com títulos em serifa.</p></header><div class="kit">{kit}</div></section>
<nav aria-label="Capítulos">{nav}<a href="#creditos">Créditos</a></nav>
<div id="board">{body}</div>
<section class="sec" id="creditos"><header><h2>Créditos e licenças</h2><p class="sm">{len(srcs)} arquivos do Wikimedia Commons. CC BY e CC BY-SA exigem crédito: esta lista vai na descrição do vídeo.</p></header>
<div class="tbl"><table><thead><tr><th>Arquivo</th><th>Autor</th><th>Licença</th></tr></thead><tbody>{credits}</tbody></table></div></section>
</div>
<script>
const cb=document.getElementById('onlyflag');
cb.addEventListener('change',()=>document.getElementById('board').classList.toggle('only-flag',cb.checked));
</script>'''
open(f'{OUT}/storyboard.html', 'w').write(page)
print('ok', len(page) // 1024, 'KB; sprites', len(os.listdir(f'{OUT}/sprites')))
