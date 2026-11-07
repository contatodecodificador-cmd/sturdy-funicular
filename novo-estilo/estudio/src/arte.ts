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
