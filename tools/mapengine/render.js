// usage: node render.js <sceneId> <out.mp4|outdir> [--stills t1,t2,...] [--fps 30]
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const root = __dirname;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf' };
const server = http.createServer((q, r) => {
  const p = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(d); });
}).listen(0);
(async () => {
  const [id, out, ...rest] = process.argv.slice(2);
  const arg = k => { const i = rest.indexOf(k); return i >= 0 ? rest[i + 1] : null; };
  const fps = +(arg('--fps') || 30), stills = arg('--stills');
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('console', m => { if (m.type() === 'error') console.error('PAGE', m.text()); });
  page.on('pageerror', e => console.error('PAGEERR', e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
  await page.waitForFunction('window.ready === true', null, { timeout: 120000 });
  const dur = await page.evaluate(i => window.loadScene(i), id);
  const t0 = Date.now();
  if (stills) {
    fs.mkdirSync(out, { recursive: true });
    for (const t of stills.split(',').map(Number)) {
      await page.evaluate(t => window.eng.renderAt(t), t);
      await page.screenshot({ path: path.join(out, `${id}_${t.toFixed(1)}.jpg`), type: 'jpeg', quality: 88 });
    }
  } else {
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const N = Math.round(dur * fps);
    for (let f = 0; f < N; f++) {
      await page.evaluate(t => window.eng.renderAt(t), f / fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 60 === 0) process.stderr.write(`\r${id} ${f}/${N} ${((Date.now() - t0) / 1000 / (f + 1)).toFixed(2)}s/frame`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  console.error(`\ndone ${id} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  await browser.close(); server.close();
})();
