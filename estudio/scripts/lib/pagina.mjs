import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { preparaGeo } from './geo.mjs';

const require = createRequire(import.meta.url);
export const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');

const url = (f) => 'file://' + f;

// Resolve os cartões de mídia (noticia / video / foto) de cada cena. Arquivo inexistente => cartão pulado.
export function resolveMidia(pasta, roteiro) {
  const abs = (r) => (r ? path.resolve(pasta, r) : null);
  const existe = (r) => { const a = abs(r); return !!a && fs.existsSync(a); };
  return roteiro.cenas.map((c) => {
    const m = {};
    if (c.noticia) m.noticia = { ...c.noticia, imagemUrl: existe(c.noticia.imagem) ? url(abs(c.noticia.imagem)) : null };
    if (c.foto && existe(c.foto.arquivo)) m.foto = { ...c.foto, url: url(abs(c.foto.arquivo)) };
    if (c.video) {
      const temArq = existe(c.video.arquivo), temMini = existe(c.video.miniatura);
      if (temArq || temMini) m.video = { ...c.video, arquivoAbs: temArq ? abs(c.video.arquivo) : null, miniUrl: temMini ? url(abs(c.video.miniatura)) : null };
    }
    return m;
  });
}

// Pré-extrai os quadros dos vídeos (render determinístico: nada de <video> tocando).
export function extraiVideos(midia, tempos, fps, build) {
  midia.forEach((m, i) => {
    const v = m.video;
    if (!v?.arquivoAbs) return;
    const dur = tempos.cenas[i].fim - tempos.cenas[i].ini + 0.5;
    const pref = path.join(build, `vid_${i}_`);
    for (const f of fs.readdirSync(build)) if (f.startsWith(`vid_${i}_`)) fs.unlinkSync(path.join(build, f));
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-stream_loop', '-1', '-ss', String(v.inicio || 0), '-i', v.arquivoAbs, '-t', String(dur), '-an', '-vf', `fps=${fps},scale=300:-2`, '-q:v', '4', `${pref}%04d.jpg`]);
    v.frames = fs.readdirSync(build).filter((f) => f.startsWith(`vid_${i}_`)).length;
    v.prefixo = url(pref);
    v.fps = fps;
  });
}

export function carrega(pasta, mod) {
  const ler = (f) => JSON.parse(fs.readFileSync(path.join(pasta, f), 'utf8'));
  const cfg = JSON.parse(fs.readFileSync(path.join(RAIZ, 'config.json'), 'utf8'));
  const roteiro = ler('roteiro.json');
  if (mod) mod(roteiro);
  const tempos = fs.existsSync(path.join(pasta, 'tempos.json')) ? ler('tempos.json') : null;
  const geo = preparaGeo(roteiro, cfg.video.largura, cfg.video.altura);
  const satF = path.join(RAIZ, 'dados/satelite/brasil.jpg');
  const sat = geo.sat && fs.existsSync(satF) ? 'data:image/jpeg;base64,' + fs.readFileSync(satF).toString('base64') : null;
  return { cfg, roteiro, tempos, geo, sat, midia: resolveMidia(pasta, roteiro) };
}

export async function abrePagina(dados, escala = 1) {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: escala });
  const tcjs = fs.readFileSync(path.join(RAIZ, 'node_modules/three/build/three.cjs'), 'utf8');
  await page.addInitScript({ content: `(function(){const exports={};\n${tcjs}\n;window.THREE=exports;})();` });
  await page.addInitScript({ content: fs.readFileSync(path.join(RAIZ, 'templates/cena3d.js'), 'utf8') });
  page.on('pageerror', (e) => console.error('erro na página:', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.error('console:', m.text()); });
  await page.goto('file://' + path.join(RAIZ, 'templates/player.html'));
  await page.evaluate((d) => window.init(d), dados);
  return { browser, page };
}
