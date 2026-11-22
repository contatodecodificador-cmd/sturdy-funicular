import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
const CH='/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const ts = process.argv.slice(2).map(Number);
const url = await bundle({entryPoint: './src/index.ts'});
const comp = await selectComposition({serveUrl: url, id: 'Video7', browserExecutable: CH, chromiumOptions:{gl:'swangle'}});
let falhas = 0;
for (const s of ts) {
  try { await renderStill({composition: comp, serveUrl: url, output: `/tmp/claude-0/chk.jpg`, frame: Math.min(comp.durationInFrames - 1, Math.round(s*30)), browserExecutable: CH, imageFormat:'jpeg', chromiumOptions:{gl:'swangle'}, scale:0.15}); }
  catch (e) { falhas++; console.log('FALHA', s, String(e).slice(0, 160)); }
}
console.log('FIM checagem, falhas:', falhas);
