// Gera a capa (1080x1920) a partir de capa.json + o mapa de uma cena do roteiro.
// Uso: node scripts/capa.mjs <pasta-do-video>
import fs from 'node:fs';
import path from 'node:path';
import { carrega, abrePagina } from './lib/pagina.mjs';

const pasta = path.resolve(process.argv[2] || '.');
const dados = carrega(pasta);
const capa = JSON.parse(fs.readFileSync(path.join(pasta, 'capa.json'), 'utf8'));
const { browser, page } = await abrePagina(dados, 1.5);
await page.evaluate((c) => window.capa(c), capa);
await page.screenshot({ path: path.join(pasta, 'capa.png') });
await browser.close();
console.log('capa pronta:', path.join(pasta, 'capa.png'));
