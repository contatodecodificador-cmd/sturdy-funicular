// Edita o vídeo final: anima as cenas do roteiro sincronizadas com a voz, mistura trilha + efeitos e exporta MP4.
// Uso: node scripts/render.mjs <pasta-do-video> [--rascunho]   (--rascunho = 15 fps, para conferir rápido)
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { carrega, abrePagina } from './lib/pagina.mjs';

const pasta = path.resolve(process.argv[2] || '.');
const rascunho = process.argv.includes('--rascunho');
const dados = carrega(pasta);
const { cfg, tempos } = dados;
const fps = rascunho ? 15 : cfg.video.fps;
const build = path.join(pasta, 'build');
fs.mkdirSync(build, { recursive: true });
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);

// ---------- efeitos sonoros (sintetizados, sem direitos autorais) ----------
const SFX = {
  whoosh: 'anoisesrc=d=0.6:c=pink:a=0.6,highpass=f=500,lowpass=f=6000,afade=t=in:d=0.28,afade=t=out:st=0.28:d=0.32,volume=0.55',
  swish: 'anoisesrc=d=0.32:c=pink:a=0.5,highpass=f=1200,afade=t=in:d=0.12,afade=t=out:st=0.12:d=0.2,volume=0.3',
  pop: "aevalsrc='0.5*sin(2*PI*(700+900*t*8)*t)*exp(-t*38)':d=0.12",
  check: "aevalsrc='0.35*sin(2*PI*1500*t)*exp(-t*45)+0.2*sin(2*PI*2250*t)*exp(-t*60)':d=0.1",
  impacto: "aevalsrc='0.8*sin(2*PI*(90-50*t)*t)*exp(-t*6)':d=0.6",
  trovao: 'anoisesrc=d=2.2:c=brown:a=0.9,lowpass=f=500,afade=t=in:d=0.04,afade=t=out:st=0.25:d=1.9,volume=1.6',
  clique: "aevalsrc='0.5*sin(2*PI*2400*t)*exp(-t*90)':d=0.05",
};
for (const [n, f] of Object.entries(SFX)) ff(['-f', 'lavfi', '-i', f, '-ar', '44100', '-ac', '1', path.join(build, `sfx_${n}.wav`)]);
const dur = tempos.duracao;
// trilha de tensão contínua (drone grave + nota alta discreta, como nos vídeos de referência)
ff(['-f', 'lavfi', '-i', `aevalsrc='(0.06*sin(2*PI*55*t)+0.05*sin(2*PI*82.4*t)+0.035*sin(2*PI*110*t))*(0.75+0.25*sin(2*PI*0.15*t))+0.006*sin(2*PI*1318.5*t)*(0.6+0.4*sin(2*PI*0.4*t))':d=${dur}:s=44100`,
  '-af', `lowpass=f=1800,afade=t=in:d=1.5,afade=t=out:st=${Math.max(0, dur - 2)}:d=2`, '-ac', '1', path.join(build, 'trilha.wav')]);

// ---------- quadros ----------
const { browser, page } = await abrePagina(dados);
const eventos = await page.evaluate(() => window.eventos());
const total = Math.ceil(dur * fps);
const saidaSemAudio = path.join(build, 'video_mudo.mp4');
const enc = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-preset', rascunho ? 'veryfast' : 'medium', saidaSemAudio], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let f = 0; f < total; f++) {
  await page.evaluate((t) => window.renderAt(t), f / fps);
  const img = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!enc.stdin.write(img)) await new Promise((r) => enc.stdin.once('drain', r));
  if (f % (fps * 10) === 0) console.log(`quadro ${f}/${total} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
enc.stdin.end();
await new Promise((r) => enc.on('close', r));
await browser.close();

// ---------- mixagem ----------
const ins = ['-i', path.join(pasta, 'voz.mp3'), '-i', path.join(build, 'trilha.wav')];
const filtros = ['[0:a]aresample=44100,pan=mono|c0=c0,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,equalizer=f=3000:t=q:w=1:g=2[v]'];
const etiquetas = ['[v]', '[1:a]'];
eventos.forEach((e, k) => {
  ins.push('-i', path.join(build, `sfx_${e.tipo === 'varrer' ? 'swish' : e.tipo}.wav`));
  const ms = Math.max(0, Math.round(e.t * 1000));
  filtros.push(`[${k + 2}:a]adelay=${ms}|${ms},volume=${e.tipo === 'trovao' ? 0.9 : 0.55}[e${k}]`);
  etiquetas.push(`[e${k}]`);
});
filtros.push(`${etiquetas.join('')}amix=inputs=${etiquetas.length}:normalize=0:duration=longest,atrim=0:${dur},loudnorm=I=${cfg.video.lufs}:LRA=4:TP=-1[a]`);
const audio = path.join(build, 'mix.wav');
ff([...ins, '-filter_complex', filtros.join(';'), '-map', '[a]', '-ar', '44100', '-ac', '2', audio]);

// 2ª passada: mede e corrige o ganho até a meta de LUFS (padrão Reels/TikTok)
const mI = [...execFileSync('sh', ['-c', `ffmpeg -nostats -i "${audio}" -af ebur128 -f null - 2>&1 | grep -E "^ +I:" | tail -1`]).toString().matchAll(/-?\d+\.\d/g)].map((m) => +m[0])[0];
if (Number.isFinite(mI)) {
  const ganho = cfg.video.lufs - mI;
  const audio2 = path.join(build, 'mix2.wav');
  ff(['-i', audio, '-af', `volume=${ganho.toFixed(2)}dB,alimiter=limit=0.89:level=false`, audio2]);
  fs.renameSync(audio2, audio);
}
const final = path.join(pasta, rascunho ? 'video_rascunho.mp4' : 'video.mp4');
ff(['-i', saidaSemAudio, '-i', audio, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', final]);
console.log(`vídeo pronto: ${final} (${dur.toFixed(1)}s, ${eventos.length} efeitos, ${((Date.now() - t0) / 1000).toFixed(0)}s de render)`);
