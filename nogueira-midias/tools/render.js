// Renderiza a arte panorâmica de um carrossel e fatia em slides 1080x1350.
// Uso: node render.js <pasta-carrossel> [nSlides=9] [query]
const { chromium } = require('playwright');
const path = require('path');
const { execFileSync } = require('child_process');
(async () => {
  const dir = path.resolve(process.argv[2]);
  const n = Number(process.argv[3] || 9);
  const q = process.argv[4] || '';
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080 * n, height: 1350 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.join(dir, 'carrossel.html') + (q ? '?' + q : ''));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(800);
  const pano = path.join(dir, 'out', 'panorama.png');
  await p.screenshot({ path: pano });
  await b.close();
  execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB'); n=int(sys.argv[2]); d=sys.argv[3]
for i in range(n):
    im.crop((i*1080,0,(i+1)*1080,1350)).save(f"{d}/slide-{i+1:02d}.png")
im.resize((im.width//6,im.height//6)).save(f"{d}/preview.jpg",quality=85)
`, pano, String(n), path.join(dir, 'out')]);
  console.log('ok');
})();
