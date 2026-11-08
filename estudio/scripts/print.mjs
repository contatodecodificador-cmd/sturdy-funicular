// Captura o topo de uma página de notícia (1080x1350) para usar como "print" no vídeo.
// Uso: node scripts/print.mjs <url> <saida.png>
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [url, saida] = process.argv.slice(2);
if (!url || !saida) { console.error('uso: node scripts/print.mjs <url> <saida.png>'); process.exit(1); }
fs.mkdirSync(path.dirname(path.resolve(saida)), { recursive: true });
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
const browser = await chromium.launch({ proxy });
const page = await browser.newPage({ viewport: { width: 540, height: 675 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true });
try {
  const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
  if (!r || r.status() >= 400) throw new Error(`HTTP ${r?.status()}`);
  await page.waitForTimeout(2500);
  // remove banners de cookies/anúncios comuns
  await page.evaluate(() => document.querySelectorAll('[id*=cookie],[class*=cookie],[class*=banner],[id*=onetrust],iframe').forEach((e) => e.remove()));
  await page.screenshot({ path: saida });
  console.log('print ok:', saida);
} catch (e) { console.error('print falhou:', e.message); process.exitCode = 2; }
await browser.close();
