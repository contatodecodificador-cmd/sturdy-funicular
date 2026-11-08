import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { preparaGeo } from './geo.mjs';

const require = createRequire(import.meta.url);
export const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');

export function carrega(pasta) {
  const ler = (f) => JSON.parse(fs.readFileSync(path.join(pasta, f), 'utf8'));
  const cfg = JSON.parse(fs.readFileSync(path.join(RAIZ, 'config.json'), 'utf8'));
  const roteiro = ler('roteiro.json');
  const tempos = ler('tempos.json');
  const geo = preparaGeo(roteiro, cfg.video.largura, cfg.video.altura);
  return { cfg, roteiro, tempos, geo };
}

export async function abrePagina(dados, escala = 1) {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: escala });
  page.on('pageerror', (e) => console.error('erro na página:', e.message));
  await page.goto('file://' + path.join(RAIZ, 'templates/player.html'));
  await page.evaluate((d) => window.init(d), dados);
  return { browser, page };
}
