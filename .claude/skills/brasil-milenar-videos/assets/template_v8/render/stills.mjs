import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
const CH='/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const [id, scale, ...ts] = process.argv.slice(2);
const url = await bundle({entryPoint: './src/index.ts'});
const comp = await selectComposition({serveUrl: url, id, browserExecutable: CH, chromiumOptions:{gl:'swangle'}});
for (const s of (ts.length ? ts : ['0']).map(Number)) {
  await renderStill({composition: comp, serveUrl: url, output: `stills/${id}_${s}.jpg`, frame: Math.round(s*30), browserExecutable: CH, imageFormat:'jpeg', jpegQuality:85, chromiumOptions:{gl:'swangle'}, scale:Number(scale)});
  console.log('ok', s);
}
