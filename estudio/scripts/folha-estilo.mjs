// Gera marca/folha-estilo.png: 9 quadros reais do motor (jornal claro + 3D) + paleta e tipografia, para o dono aprovar o visual.
// Uso: node scripts/folha-estilo.mjs [pasta-do-video]   (padrão: producao/2026-11-07/01-temporais-sul; usa tempos.json existente, sem voz)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { carrega, abrePagina, RAIZ } from './lib/pagina.mjs';

const pasta = path.resolve(process.argv[2] || path.join(RAIZ, 'producao/2026-11-07/01-temporais-sul'));
const tmp = path.join(pasta, 'build', 'folha');
fs.mkdirSync(tmp, { recursive: true });
const require = createRequire(import.meta.url);

// ilustrações 3D injetadas só para a folha (não altera o roteiro em disco)
const mod = (r) => {
  r.cenas[2].ilustracao = { tipo: 'tornado', local: 'Chapecó/SC', escala: 1.1 };
  r.cenas[8].ilustracao = { tipo: 'temporal', local: 'Chapecó/SC', escala: 1.0 };
};
const dados = carrega(pasta, mod);
dados.fps = 15;
const T = dados.tempos;
const ini = (i) => T.cenas[i].ini;
const quadros = [
  ['1', 'Abertura: título batendo sobre o mapa 3D', 'f', ini(0) + 0.45],
  ['2', 'Município extrudado + tornado 3D sobre a cidade em miniatura', 'f', ini(2) + 3.4],
  ['3', 'Estado preenchido em 3D com contador', 'f', ini(3) + 3.9],
  ['4', 'Temporal: nuvens, chuva e raios', 'f', Math.floor((ini(8) + 1.4) * 1.1) / 1.1 + 0.012],
  ['5', 'Card de notícia + post-its', 'f', ini(1) + 2.6],
  ['6', 'Lista de utilidade', 'f', ini(10) + 8.8],
  ['7', 'CTA de seguir', 'f', T.duracao - 1.3],
  ['8', 'Capa: satélite + título em área livre', 'capa'],
  ['9', 'Story imagem: enquete', 'story'],
];

const arqs = [];
{
  const { browser, page } = await abrePagina(dados);
  for (const [n, , tipo, t] of quadros) {
    if (tipo !== 'f') continue;
    await page.evaluate(async (t) => { window.renderAt(t); await window.pronto(); }, t);
    await page.evaluate(async (t) => { window.renderAt(t + 0.0001); await window.pronto(); }, t);
    const f = path.join(tmp, `q${n}.png`);
    await page.screenshot({ path: f });
    arqs[n] = f;
  }
  await browser.close();
}
const capaJ = JSON.parse(fs.readFileSync(path.join(pasta, 'capa.json'), 'utf8'));
{
  const { browser, page } = await abrePagina(dados, 1);
  await page.evaluate((c) => window.capa(c), capaJ);
  console.log('capa:', JSON.stringify(await page.evaluate(() => window.__capaInfo)));
  const f = path.join(tmp, 'q8.png');
  await page.screenshot({ path: f });
  arqs['8'] = f;
  await browser.close();
}
const stJ = JSON.parse(fs.readFileSync(path.join(pasta, 'stories.json'), 'utf8'));
{
  const { browser, page } = await abrePagina(dados, 1);
  await page.evaluate((c) => window.storyInit(c, 'imagem'), { ...stJ, ...(stJ.imagem || {}), enquete: stJ.imagem ? { pergunta: stJ.imagem.pergunta, opcoes: stJ.imagem.opcoes } : stJ.enquete, cena: stJ.imagem?.cena ?? stJ.cena });
  await page.evaluate(() => window.renderStory(99));
  const f = path.join(tmp, 'q9.png');
  await page.screenshot({ path: f });
  arqs['9'] = f;
  await browser.close();
}

// ---- monta a folha ----
const u = (f) => 'file://' + f;
const nm = (x) => u(path.join(RAIZ, 'node_modules/@fontsource', x));
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:'Titulo';src:url(${nm('anton/files/anton-latin-400-normal.woff2')})}
@font-face{font-family:'Mono';font-weight:800;src:url(${nm('jetbrains-mono/files/jetbrains-mono-latin-800-normal.woff2')})}
@font-face{font-family:'Mono';font-weight:500;src:url(${nm('jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2')})}
@font-face{font-family:'Texto';font-weight:500;src:url(${nm('inter/files/inter-latin-500-normal.woff2')})}
@font-face{font-family:'Texto';font-weight:800;src:url(${nm('inter/files/inter-latin-800-normal.woff2')})}
*{box-sizing:border-box}body{margin:0;width:2160px;background:#efe9dc;color:#141414;font:500 22px Texto;padding:56px 48px 64px}
header{display:flex;align-items:center;gap:28px;margin-bottom:36px}
header img{width:110px;height:110px;border-radius:50%;border:5px solid #ffd400;background:#fff}
h1{font:84px/1 Titulo;margin:0;text-transform:uppercase}h1 span{background:#ffd400;padding:0 14px}
header p{margin:8px 0 0;font:800 20px Mono;letter-spacing:.06em;text-transform:uppercase;color:#4a4a4a}
.grade{display:grid;grid-template-columns:repeat(3,664px);gap:44px 36px}
figure{margin:0}figure img{display:block;width:664px;height:1181px;box-shadow:8px 8px 0 #141414;border:2px solid #141414}
figcaption{margin-top:20px;font:800 19px Mono;text-transform:uppercase;letter-spacing:.04em}figcaption b{display:inline-block;background:#ffd400;border:2px solid #141414;padding:0 10px;margin-right:10px}
footer{margin-top:56px;display:grid;grid-template-columns:1fr 1fr;gap:48px;border-top:5px solid #141414;padding-top:36px}
h2{font:44px/1 Titulo;margin:0 0 20px;text-transform:uppercase}
.sw{display:flex;gap:18px;flex-wrap:wrap}.sw div{width:190px;height:150px;border:2px solid #141414;padding:12px;font:800 15px Mono;display:flex;flex-direction:column;justify-content:flex-end;box-shadow:5px 5px 0 #141414}
.tip div{margin-bottom:12px}.tip .a{font:96px/1 Titulo;text-transform:uppercase}.tip .m{font:800 26px Mono}.tip .t{font:500 26px Texto}
.regras{font:500 23px/1.45 Texto;grid-column:1/3;margin-top:8px}.regras b{background:#ffd400;padding:0 6px}
</style>
<header><img src="${u(path.join(RAIZ, 'marca/logo.png'))}"><div><h1>Radar Público <span>News</span></h1><p>Folha de estilo · jornal claro em 3D · mapa + dados + urgência · 720x1280</p></div></header>
<div class="grade">${quadros.map(([n, l]) => `<figure><img src="${u(arqs[n])}"><figcaption><b>${n}</b>${l}</figcaption></figure>`).join('')}</div>
<footer>
<section><h2>Paleta</h2><div class="sw">
<div style="background:#efe9dc">Papel<br>#EFE9DC</div><div style="background:#e2dccd">Município<br>#E2DCCD</div><div style="background:#141414;color:#fff">Tinta<br>#141414</div>
<div style="background:#ffd400">Marca-texto<br>#FFD400</div><div style="background:#e0343f;color:#fff">Perigo (só no mapa)<br>#E0343F</div></div></section>
<section class="tip"><h2>Tipografia</h2><div class="a">Anton · títulos e números</div><div class="m">JetBrains Mono · etiquetas, legenda e letreiro</div><div class="t">Inter · textos de apoio, listas e CTA</div></section>
<p class="regras"><b>Linguagem:</b> maquete 3D de papel sobre fundo creme, tinta preta, marca-texto amarelo nas palavras-chave, vermelho só para perigo (municípios extrudados, destaques). Texto nunca cobre a região da notícia: capa e story com título em área livre. Letreiro de fontes sempre no rodapé, com a logo.</p>
</footer>`;
const hf = path.join(tmp, 'folha.html');
fs.writeFileSync(hf, html);
const { chromium } = require('playwright');
const br = await chromium.launch();
const pg = await br.newPage({ viewport: { width: 2160, height: 1000 } });
await pg.goto('file://' + hf);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(500);
const saida = path.join(RAIZ, 'marca/folha-estilo.png');
await pg.screenshot({ path: saida, fullPage: true });
await br.close();
console.log('folha de estilo pronta:', saida);
