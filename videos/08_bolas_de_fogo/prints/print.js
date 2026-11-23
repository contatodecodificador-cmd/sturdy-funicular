// uso: node print.js URL "trecho que identifica o parágrafo" saida.png
const {chromium} = require('playwright');
(async () => {
  const [url, trecho, out] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 1100, height: 1400}, deviceScaleFactor: 2});
  await p.goto(url, {waitUntil: 'domcontentloaded', timeout: 60000}); await p.waitForTimeout(3000);
  const el = await p.evaluateHandle((t) => { const ps = [...document.querySelectorAll('p, h1, h2')]; return ps.find((x) => x.innerText.includes(t)) || null; }, trecho);
  if (!el || !(await el.asElement())) { console.log('NAO ACHOU'); await p.screenshot({path: out.replace('.png', '_pagina.png')}); await b.close(); return; }
  await el.asElement().evaluate((e) => { e.style.background = '#fff'; e.style.padding = '14px'; e.style.fontSize = '22px'; e.style.lineHeight = '1.5'; e.style.color = '#111'; });
  await el.asElement().screenshot({path: out}); console.log('OK', await el.asElement().evaluate((e) => e.innerText.slice(0, 160)));
  await b.close();
})();
