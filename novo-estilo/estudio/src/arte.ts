// Ponte entre os desenhos em SVG puro (personagens/, cenarios/) e o estúdio.
/* eslint-disable @typescript-eslint/no-var-requires */
const R = require('../../personagens/rose.js');
const G = require('../../personagens/gente.js');
const C = require('../../cenarios/cenario.js');

export const rose: (o?: any) => string = R.rose;
export const pessoa: (o?: any) => string = G.pessoa;
export const FIG: Record<string, any> = G.FIGURANTES;
export const PELES: Record<string, string> = G.PELES;
export const cen = C as {
  onibus: (x: number, y: number, k?: number, linha?: string) => string;
  pomboVoando: (x: number, y: number, k?: number, rot?: number) => string;
  pomboChao: (x: number, y: number, k?: number) => string;
  sobrado: (x: number, y: number, w: number, h: number, o?: any) => string;
  poste: (x: number, yBase: number, h: number) => string;
  fios: (x1: number, y1: number, x2: number, y2: number, n?: number) => string;
  arvore: (x: number, yBase: number, k?: number) => string;
  calcada: (y: number, h: number, w?: number) => string;
  rua: (y: number, h: number, w?: number) => string;
};

/** Rose viva: respira, pisca, mexe a cabeça, olha em volta, balança os braços; anda e fala quando pedido.
 *  t = tempo em segundos (pode ser o da cena). Só a Rose se mexe: o resto do mundo está parado. */
export function roseVivo(t: number, o: {expr?: string; andando?: boolean; falando?: boolean; piscar?: boolean; passosPorSeg?: number; corpo?: boolean; velha?: boolean; bD?: number; bE?: number} = {}) {
  const TAU = Math.PI * 2;
  const resp = (Math.sin(TAU * t / 3.4) + 1) / 2;
  const pisca = ((t + 0.7) % 3.3) > 3.17 || ((t + 2.1) % 7.9) > 7.78;
  const anim: any = {
    resp, cab: 2.4 * Math.sin(TAU * t / 5.3) + 1.2 * Math.sin(TAU * t / 2.1), cabY: 2 * Math.sin(TAU * t / 4.1),
    bE: 3 * Math.sin(TAU * t / 3.4 + 0.5), bD: -3 * Math.sin(TAU * t / 3.4 + 1.1), olhar: 0.8 * Math.sin(TAU * t / 6.7),
  };
  if (o.andando) {
    const f = TAU * t * (o.passosPorSeg || 1.6) / 2;
    anim.pE = 16 * Math.sin(f); anim.pD = -anim.pE;
    anim.bE = -12 * Math.sin(f); anim.bD = -anim.bE;
    anim.pulo = 9 * Math.abs(Math.sin(f));
    anim.cab = 1.5 * Math.sin(f * 2);
  }
  if (o.falando) anim.falar = ((Math.sin(t * 15) + 1) / 2) * (0.55 + 0.45 * Math.sin(t * 3.3));
  if (o.bD) anim.bD += o.bD;
  if (o.bE) anim.bE += o.bE;
  return rose({expr: o.expr || 'surpresa', piscar: o.piscar ?? pisca, anim, corpo: o.corpo !== false, velha: !!o.velha});
}

/** Coloca uma pessoa com os pés em (cx, pe), escala k (1 = 1700 px de altura). */
export const poe = (svg: string, cx: number, pe: number, k: number, flip = false) =>
  `<g transform="translate(${cx - 200 * k * (flip ? -1 : 1)},${pe - 1700 * k}) scale(${k * (flip ? -1 : 1)},${k})">${svg}</g>`;

/** Retrato 3x4 (cabeça) pra ficha */
export const retrato = (svg: string) => svg;

// Figurantes extras desta cena (gerados com o mesmo gerador, todos com rosto)
export const EXTRAS: Record<string, any> = {
  wesley: {nome: 'Wesley, 22', pele: G.PELES.parda, cabelo: 'curto', corCabelo: '#1A1210', idade: 22, tipoRoupa: 'jaqueta', roupa: '#5FA36A', calca: '#2F3440', bone: '#D96C4A', expr: 'neutro', pose: 'parado', nariz: 1},
  lucia: {nome: 'Lúcia, 47', pele: G.PELES.media, cabelo: 'rabo', corCabelo: '#4A2E1E', idade: 47, tipoRoupa: 'camiseta', roupa: '#B9A7DB', calca: '#24364F', acessorio: 'bolsa', corAcessorio: '#D96C4A', expr: 'neutro', pose: 'celular', olhar: 'baixo'},
  beto: {nome: 'Beto, 35', pele: G.PELES.clara, cabelo: 'curto', corCabelo: '#7A5230', idade: 35, barba: 'rala', tipoRoupa: 'social', roupa: '#F4EDE1', calca: '#3A3F4A', sapato: '#2B2420', expr: 'neutro', pose: 'andando', queixo: 'quadrado'},
  nina: {nome: 'Nina, 24', pele: G.PELES.retinta, cabelo: 'crespo', corCabelo: '#1A1210', idade: 24, tipoRoupa: 'vestido', roupa: '#F2C14E', expr: 'rindo', pose: 'acenando', nariz: 2},
  osmar: {nome: 'Osmar, 72', pele: G.PELES.clara, cabelo: 'careca', corCabelo: '#CFCAC2', idade: 72, barba: 'bigode', tipoRoupa: 'camiseta', roupa: '#7EC8E3', calca: '#5B5348', tipoCalca: 'bermuda', expr: 'neutro', pose: 'parado', oculos: '#2B2420'},
};
