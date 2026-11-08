// Edita o vídeo final: anima as cenas do roteiro sincronizadas com a voz, mistura trilha + efeitos e exporta MP4.
// Uso: node scripts/render.mjs <pasta-do-video> [--rascunho]   (--rascunho = 15 fps, para conferir rápido)
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { carrega, abrePagina, extraiVideos } from './lib/pagina.mjs';
import { geraSfx, trilhaDrone, mixa, ff } from './lib/audio.mjs';

const pasta = path.resolve(process.argv[2] || '.');
const rascunho = process.argv.includes('--rascunho');
const dados = carrega(pasta);
const { cfg, tempos } = dados;
const fps = rascunho ? 15 : cfg.video.fps;
dados.fps = fps;
const build = path.join(pasta, 'build');
fs.mkdirSync(build, { recursive: true });

// ---------- efeitos sonoros + trilha ----------
const dur = tempos.duracao;
geraSfx(build);
trilhaDrone(build, dur);
extraiVideos(dados.midia, tempos, fps, build);

// ---------- quadros ----------
const { browser, page } = await abrePagina(dados);
const eventos = await page.evaluate(() => window.eventos());
const total = Math.ceil(dur * fps);
const saidaSemAudio = path.join(build, 'video_mudo.mp4');
const enc = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-preset', rascunho ? 'veryfast' : 'medium', saidaSemAudio], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let f = 0; f < total; f++) {
  await page.evaluate(async (t) => { window.renderAt(t); await window.pronto(); }, f / fps);
  const img = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!enc.stdin.write(img)) await new Promise((r) => enc.stdin.once('drain', r));
  if (f % (fps * 10) === 0) console.log(`quadro ${f}/${total} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
enc.stdin.end();
await new Promise((r) => enc.on('close', r));
await browser.close();

// ---------- mixagem (-14 LUFS) ----------
mixa({ build, dur, eventos, voz: path.join(pasta, 'voz.mp3'), lufs: cfg.video.lufs });
const audio = path.join(build, 'mix.wav');
const final = path.join(pasta, rascunho ? 'video_rascunho.mp4' : 'video.mp4');
ff(['-i', saidaSemAudio, '-i', audio, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', final]);
console.log(`vídeo pronto: ${final} (${dur.toFixed(1)}s, ${eventos.length} efeitos, ${((Date.now() - t0) / 1000).toFixed(0)}s de render)`);
