// Renderiza uma página com window.setT(p) (p de 0 a 1) em quadros e gera um MP4 em loop.
// Uso: node marquee.js <pagina.html> <saida.mp4> [segundos=4] [fps=30] [query] [largura=1080] [altura=1350]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
(async () => {
  const page = path.resolve(process.argv[2]), out = path.resolve(process.argv[3]);
  const secs = Number(process.argv[4] || 4), fps = Number(process.argv[5] || 30), q = process.argv[6] || '';
  const VW = Number(process.argv[7] || 1080), VH = Number(process.argv[8] || 1350);
  const tmp = fs.mkdtempSync(path.join(path.dirname(out), '.frames-'));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: VW, height: VH } });
  await p.goto('file://' + page + (q ? '?' + q : ''));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
  const n = Math.round(secs * fps);
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => window.setT(t), i / n);
    await p.screenshot({ path: path.join(tmp, `f${String(i).padStart(4, '0')}.png`) });
  }
  await b.close();
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(fps), '-i', path.join(tmp, 'f%04d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-movflags', '+faststart', out]);
  fs.readdirSync(tmp).forEach(f => fs.unlinkSync(path.join(tmp, f))); fs.rmdirSync(tmp);
  console.log('ok', out);
})();
