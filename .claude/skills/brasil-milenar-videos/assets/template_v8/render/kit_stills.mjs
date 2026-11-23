// Kit CapCut: uma imagem LIMPA (sem textos/relógio/vinheta) por plano, nomeada em ordem.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs';
const CH='/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const OUT = process.argv[2]; fs.mkdirSync(OUT, {recursive: true});
const P = JSON.parse(fs.readFileSync('src/planos7.json'));
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').split('-').filter(Boolean).slice(0, 6).join('-');
const url = await bundle({entryPoint: './src/index.ts'});
const inputProps = {limpo: true};
const comp = await selectComposition({serveUrl: url, id: 'Video7', inputProps, browserExecutable: CH, chromiumOptions: {gl: 'swangle'}});
const nomes = [];
for (const [i, p] of P.entries()) {
  const nome = `${String(i + 1).padStart(3, '0')}_${p.id}_${slug(p.desc)}`;
  nomes.push(nome);
  const f = `${OUT}/${nome}.jpg`;
  if (fs.existsSync(f)) continue;
  const frac = p.vis.startsWith('3D:') ? 0.5 : 0.8;
  await renderStill({composition: comp, serveUrl: url, inputProps, output: f, frame: Math.round((p.t0 + (p.t1 - p.t0) * frac) * 30), browserExecutable: CH, imageFormat: 'jpeg', jpegQuality: 92, chromiumOptions: {gl: 'swangle'}});
  if (i % 20 === 0) console.log(i, nome);
}
fs.writeFileSync(`${OUT}/../nomes.json`, JSON.stringify(nomes));
console.log('FEITO', nomes.length);
