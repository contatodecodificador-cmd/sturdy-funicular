import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
const CH='/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const url = await bundle({entryPoint: './src/index.ts'});
const comp = await selectComposition({serveUrl: url, id: 'Video', browserExecutable: CH, chromiumOptions:{gl:'swangle'}});
for (const s of process.argv.slice(2).map(Number)) {
  await renderStill({composition: comp, serveUrl: url, output: `stills/t${s}.jpg`, frame: Math.round(s*30), browserExecutable: CH, imageFormat:'jpeg', jpegQuality:80, chromiumOptions:{gl:'swangle'}, scale:0.5});
  console.log('ok', s);
}
