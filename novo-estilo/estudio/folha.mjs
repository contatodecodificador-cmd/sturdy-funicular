// Folha de quadros: começo, meio e fim de cada cena, pra conferir antes de renderizar.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const ID = process.env.EP || 'Ep01';
const T = JSON.parse(fs.readFileSync(`src/tempos-${ID.toLowerCase()}.json`, 'utf8'));
const ini = T.inicio_cenas.map((x, i) => (i === 0 ? 0 : x - 0.12));
const fim = ini.slice(1).concat([T.duracao + (ID === 'Ep01' ? 0.6 : 0.8)]);
const so = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
const out = `out/quadros-${ID.toLowerCase()}`;
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const comp = await selectComposition({serveUrl, id: ID, browserExecutable});
for (let i = 0; i < ini.length; i++) {
  if (so && !so.includes(i + 1)) continue;
  const d = fim[i] - ini[i];
  for (const [nome, k] of [['a', 0.12], ['b', 0.5], ['c', 0.92]]) {
    const frame = Math.min(comp.durationInFrames - 1, Math.round((ini[i] + d * k) * 30));
    await renderStill({serveUrl, composition: comp, frame, output: `${out}/c${String(i + 1).padStart(2, '0')}${nome}.jpeg`, imageFormat: 'jpeg', jpegQuality: 70, browserExecutable, scale: 0.25});
  }
  process.stdout.write(`${i + 1} `);
}
console.log('ok');
