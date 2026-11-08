// Gera 2 stories (1080x1920) a partir de stories.json: story_animado.mp4 (~12s, trilha + efeitos) e story_imagem.png (card/enquete).
// Uso: node scripts/stories.mjs <pasta-do-video>
// Área segura: topo 250px e base 300px (de 1920) ficam livres de texto importante.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { carrega, abrePagina } from './lib/pagina.mjs';
import { geraSfx, trilhaStory, mixa, ff } from './lib/audio.mjs';

const pasta = path.resolve(process.argv[2] || '.');
const arq = path.join(pasta, 'stories.json');
if (!fs.existsSync(arq)) { console.log('sem stories.json, stories não gerados'); process.exit(0); }
const st = JSON.parse(fs.readFileSync(arq, 'utf8'));
const dados = carrega(pasta);
if (!dados.tempos) { // sem voz: tempos sintéticos só para montar o mapa
  dados.tempos = { duracao: 12, palavras: [], cenas: dados.roteiro.cenas.map((_, i) => ({ ini: i * 4, fim: i * 4 + 4 })) };
}
const build = path.join(pasta, 'build');
fs.mkdirSync(build, { recursive: true });
const fps = 30, DUR = 12;

// ---------- story imagem ----------
{
  const { browser, page } = await abrePagina(dados, 1.5);
  await page.evaluate((c) => window.storyInit(c, 'imagem'), st);
  await page.evaluate(() => window.renderStory(99));
  await page.screenshot({ path: path.join(pasta, 'story_imagem.png') });
  await browser.close();
  console.log('story imagem pronto:', path.join(pasta, 'story_imagem.png'));
}

// ---------- story animado ----------
{
  const { browser, page } = await abrePagina(dados, 1.5);
  await page.evaluate((c) => window.storyInit(c, 'animado'), st);
  const eventos = await page.evaluate(() => window.eventos());
  geraSfx(build);
  trilhaStory(build, DUR);
  const mudo = path.join(build, 'story_mudo.mp4');
  const enc = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-preset', 'medium', mudo], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = 0; f < DUR * fps; f++) {
    await page.evaluate((t) => window.renderStory(t), f / fps);
    const img = await page.screenshot({ type: 'jpeg', quality: 90 });
    if (!enc.stdin.write(img)) await new Promise((r) => enc.stdin.once('drain', r));
  }
  enc.stdin.end();
  await new Promise((r) => enc.on('close', r));
  await browser.close();
  mixa({ build, dur: DUR, eventos, voz: null, lufs: dados.cfg.video.lufs });
  const final = path.join(pasta, 'story_animado.mp4');
  ff(['-i', mudo, '-i', path.join(build, 'mix.wav'), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', final]);
  console.log(`story animado pronto: ${final} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
