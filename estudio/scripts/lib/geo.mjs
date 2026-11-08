// Prepara a geometria do vídeo: projeção única (câmera contínua, como no vídeo de referência),
// caminhos SVG dos municípios e enquadramento de câmera de cada cena.
import fs from 'node:fs';
import path from 'node:path';
import { geoMercator, geoPath, geoArea } from 'd3-geo';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const MAPAS = path.join(RAIZ, 'dados/mapas');

export const UF_COD = { 11: 'RO', 12: 'AC', 13: 'AM', 14: 'RR', 15: 'PA', 16: 'AP', 17: 'TO', 21: 'MA', 22: 'PI', 23: 'CE', 24: 'RN', 25: 'PB', 26: 'PE', 27: 'AL', 28: 'SE', 29: 'BA', 31: 'MG', 32: 'ES', 33: 'RJ', 35: 'SP', 41: 'PR', 42: 'SC', 43: 'RS', 50: 'MS', 51: 'MT', 52: 'GO', 53: 'DF' };
const SIGLAS = new Set(Object.values(UF_COD));

export const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

// d3-geo exige anel externo no sentido horário; o GeoJSON padrão (RFC 7946) usa anti-horário.
function corrigeSentido(fc) {
  for (const f of fc.features) {
    if (geoArea(f) > 2 * Math.PI) {
      const g = f.geometry;
      if (g.type === 'Polygon') g.coordinates.forEach((r) => r.reverse());
      else if (g.type === 'MultiPolygon') g.coordinates.forEach((p) => p.forEach((r) => r.reverse()));
    }
  }
  return fc;
}
const cache = {};
function carregaUF(uf) {
  if (!cache[uf]) cache[uf] = corrigeSentido(JSON.parse(fs.readFileSync(path.join(MAPAS, `${uf}.json`), 'utf8')));
  return cache[uf];
}

// "Chapecó/SC" -> {tipo:'mun', uf, nome} ; "SC" -> {tipo:'uf', uf}
export function parseLocal(s) {
  const t = s.trim();
  if (SIGLAS.has(t.toUpperCase())) return { tipo: 'uf', uf: t.toUpperCase() };
  const m = t.match(/^(.*)\/\s*([A-Za-z]{2})$/);
  if (!m) throw new Error(`Local inválido "${s}". Use "Município/UF" ou "UF".`);
  return { tipo: 'mun', uf: m[2].toUpperCase(), nome: m[1].trim() };
}

function ufsDoRoteiro(roteiro) {
  const ufs = new Set();
  const add = (l) => ufs.add(parseLocal(l).uf);
  for (const c of roteiro.cenas) {
    (c.ufs || []).forEach((u) => ufs.add(u.toUpperCase()));
    (c.zoom || []).forEach(add);
    (c.destaques || []).forEach((d) => add(d.local));
    if (c.ilustracao?.local) add(c.ilustracao.local);
    (c.preencher?.locais || []).forEach(add);
  }
  return [...ufs];
}

export function preparaGeo(roteiro, W, H) {
  const ufs = ufsDoRoteiro(roteiro);
  if (!ufs.length) ufs.push('SP');
  const fc = { type: 'FeatureCollection', features: ufs.flatMap((u) => carregaUF(u).features) };
  const proj = geoMercator().fitExtent([[40, 230], [W - 40, H - 330]], fc);
  const gp = geoPath(proj).digits(1);

  const muns = [];
  const indice = {};
  for (const u of ufs) {
    for (const f of carregaUF(u).features) {
      const [[x0, y0], [x1, y1]] = gp.bounds(f);
      const [cx, cy] = gp.centroid(f);
      const m = { id: f.properties.id, nome: f.properties.name, uf: u, d: gp(f), cx, cy, b: [x0, y0, x1, y1] };
      indice[`${norm(m.nome)}/${u}`] = muns.length;
      muns.push(m);
    }
  }
  const estados = corrigeSentido(JSON.parse(fs.readFileSync(path.join(MAPAS, 'estados.json'), 'utf8'))).features.map((f) => {
    const uf = UF_COD[f.properties.uf];
    return { uf, d: gp(f), ativo: ufs.includes(uf), b: gp.bounds(f).flat() };
  });

  const resolve = (l) => {
    const p = parseLocal(l);
    if (p.tipo === 'uf') return muns.map((m, i) => (m.uf === p.uf ? i : -1)).filter((i) => i >= 0);
    const i = indice[`${norm(p.nome)}/${p.uf}`];
    if (i === undefined) throw new Error(`Município não encontrado no mapa: "${l}"`);
    return [i];
  };

  const bboxDe = (idx, extra = []) => {
    let b = [Infinity, Infinity, -Infinity, -Infinity];
    for (const i of idx) { const m = muns[i].b; b = [Math.min(b[0], m[0]), Math.min(b[1], m[1]), Math.max(b[2], m[2]), Math.max(b[3], m[3])]; }
    for (const e of extra) b = [Math.min(b[0], e[0]), Math.min(b[1], e[1]), Math.max(b[2], e[2]), Math.max(b[3], e[3])];
    return b;
  };

  // Câmera de cada cena: enquadra zoom > destaques > preencher > ufs
  const cenas = [];
  roteiro.cenas.forEach((c, ci) => {
    const destaques = (c.destaques || []).map((d) => ({ ...d, idx: resolve(d.local)[0] }));
    const ilustracao = c.ilustracao?.local ? { ...c.ilustracao, idx: resolve(c.ilustracao.local)[0] } : null;
    const ilCam = ilustracao && !ilustracao.mapa; // mapa:true = a ilustração não muda o enquadramento da câmera
    const preencher = c.preencher ? { ...c.preencher, idx: c.preencher.locais.flatMap(resolve) } : null;
    // cena "continua" sem alvo próprio herda a câmera anterior (plano contínuo)
    if (ci > 0 && c.continua && !c.zoom?.length && !destaques.length && !ilCam && !preencher && !c.ufs?.length) {
      cenas.push({ ...cenas[ci - 1], destaques, preencher, ilustracao });
      return;
    }
    let alvo = [];
    let extra = [];
    if (c.zoom?.length) alvo = c.zoom.flatMap(resolve);
    else if (destaques.length) alvo = destaques.map((d) => d.idx);
    else if (ilCam) alvo = [ilustracao.idx];
    else if (preencher) alvo = preencher.idx;
    else if (c.ufs?.length) extra = estados.filter((e) => c.ufs.map((u) => u.toUpperCase()).includes(e.uf)).map((e) => e.b);
    else extra = estados.filter((e) => e.ativo).map((e) => e.b);
    const b = bboxDe(alvo, extra);
    const bw = Math.max(b[2] - b[0], 8), bh = Math.max(b[3] - b[1], 8);
    let s = Math.min((W * 0.78) / bw, (H * 0.42) / bh);
    s = Math.max(0.9, Math.min(s, c.zoom?.length === 1 ? 6 : 7));
    if (ilCam && !c.zoom?.length && !destaques.length) s = Math.min(s, 3.2);
    // com ilustração 3D: a cena fica mais baixa na tela (espaço do título em cima e da altura do tornado)
    const dy = ilCam && !c.zoom?.length ? -95 / s : 0;
    cenas.push({ cx: (b[0] + b[2]) / 2, cy: (b[1] + b[3]) / 2 + dy, s, destaques, preencher, ilustracao });
  });

  // Fundo de satélite: cantos da imagem (lon/lat) projetados na mesma Mercator do mapa
  let sat = null;
  const satJson = path.join(RAIZ, 'dados/satelite/brasil.json');
  if (fs.existsSync(satJson)) {
    const b = JSON.parse(fs.readFileSync(satJson, 'utf8'));
    const [x0, y0] = proj([b.lonW, b.latN]);
    const [x1, y1] = proj([b.lonE, b.latS]);
    sat = { x0, y0, x1, y1, latN: b.latN, latS: b.latS };
  }

  return { ufs, muns: muns.map(({ b, ...m }) => m), estados: estados.map(({ b, ...e }) => e), cenas, sat };
}
