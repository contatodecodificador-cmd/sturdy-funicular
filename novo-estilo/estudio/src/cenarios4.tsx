// Cenários novos do Ep. 4 "16:48": ladeira da Rua das Flores, ônibus por dentro, freio rachado.
import React from 'react';
import {roseVivo, pessoa, FIG, EXTRAS, cen, poe, PELES} from './arte';
import {GENTE2} from './cenarios2';

const T = '#2B2420';
const ST = `stroke="${T}" stroke-width="3" stroke-linejoin="round"`;
const Svg: React.FC<{W: number; H: number; html: string}> = ({W, H, html}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} dangerouslySetInnerHTML={{__html: html}} />
);

export const GENTE4: Record<string, any> = {
  sandra: {nome: 'Sandra, 30', pele: PELES.parda, cabelo: 'rabo', corCabelo: '#2A1A14', idade: 30, tipoRoupa: 'camiseta', roupa: '#7FB98A', calca: '#3E4A5C', expr: 'dormindo', pose: 'parado', nariz: 1},
  davi: {nome: 'Davi, 4', pele: PELES.parda, cabelo: 'curto', corCabelo: '#2A1A14', idade: 4, tipoRoupa: 'camiseta', roupa: '#F2C14E', estampa: '#D96C4A', calca: '#2F6FA3', tipoCalca: 'bermuda', expr: 'dormindo', pose: 'parado', larguraRosto: 1.1, queixo: 'redondo'},
  cleide: {nome: 'Cleide, 52', pele: PELES.morena, cabelo: 'liso_longo', corCabelo: '#6B6058', idade: 52, tipoRoupa: 'social', roupa: '#E89A7A', oculos: '#7A5A3A', expr: 'neutro', pose: 'celular', olhar: 'baixo'},
  rafael: {nome: 'Rafael, 17', pele: PELES.negra, cabelo: 'crespo', corCabelo: '#1A1210', idade: 17, tipoRoupa: 'camiseta', roupa: '#2B2B2B', estampa: '#7EC8E3', expr: 'rindo', pose: 'parado'},
};

// ------------------------------------------------------------ LADEIRA (Rua das Flores descendo até a praça)
export const LADEIRA = {W: 2600, H: 1920, lim: {x0: 0, y0: -900, x1: 2600, y1: 2600}};
/** y da rua na ladeira no x dado (desce da esquerda pra direita) */
export const ruaY = (x: number) => 1250 + Math.max(0, Math.min(1, (x - 500) / 1700)) * 520;
export const Ladeira: React.FC<{t: number; roseX?: number; velhaX?: number; andando?: boolean; onibusDx?: number; falando?: boolean; expr?: string; velhaExpr?: string}> = ({t, roseX, velhaX, andando, onibusDx = 0, falando, expr = 'surpresa', velhaExpr = 'desconfiada'}) => {
  const fundo = React.useMemo(() => {
    let s = `<defs><linearGradient id="ceuL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FCBE6"/><stop offset=".7" stop-color="#F6E7C4"/><stop offset="1" stop-color="#FCE3B0"/></linearGradient></defs>`;
    s += `<rect x="-100" y="-1000" width="2800" height="2900" fill="url(#ceuL)"/><circle cx="2100" cy="420" r="90" fill="#FFE9A8"/>`;
    // casas descendo em degraus
    const cores = ['#F2C14E', '#E89A7A', '#7FB98A', '#4E86B8', '#B9A7DB', '#F4EDE1', '#D96C4A'];
    for (let i = 0; i < 9; i++) {
      const x = 300 + i * 250, base = ruaY(x + 125) - 60, h = 420 + (i % 3) * 60;
      s += `<rect x="${x}" y="${base - h}" width="240" height="${h}" fill="${cores[i % 7]}" ${ST}/><path d="M${x - 10},${base - h} L${x + 120},${base - h - 70} L${x + 250},${base - h}Z" fill="#9C4A32" ${ST}/>`;
      for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) s += `<rect x="${x + 40 + c * 100}" y="${base - h + 50 + r * 150}" width="60" height="90" rx="4" fill="#FFF8EC" opacity=".85" ${ST}/>`;
      s += `<rect x="${x + 90}" y="${base - 150}" width="60" height="150" fill="#6E4E36" ${ST}/>`;
    }
    // placa da rua
    s += `<rect x="420" y="${ruaY(450) - 380}" width="16" height="320" fill="#5B6168"/><rect x="330" y="${ruaY(450) - 430}" width="250" height="70" rx="8" fill="#2F6FA3" ${ST}/><text x="455" y="${ruaY(450) - 384}" text-anchor="middle" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="40" fill="#fff">R. DAS FLORES</text>`;
    // rua inclinada + calçada
    s += `<path d="M-100,${ruaY(0) - 60} L500,${ruaY(500) - 60} L2200,${ruaY(2200) - 60} L2800,${ruaY(2800) - 60} L2800,3000 L-100,3000Z" fill="#E4DCCD"/>`;
    s += `<path d="M-100,${ruaY(0)} L500,${ruaY(500)} L2200,${ruaY(2200)} L2800,${ruaY(2800)} L2800,${ruaY(2800) + 230} L2200,${ruaY(2200) + 230} L500,${ruaY(500) + 230} L-100,${ruaY(0) + 230}Z" fill="#6E6A66" ${ST}/>`;
    for (let x = 0; x < 2700; x += 160) s += `<path d="M${x},${ruaY(x) + 115} L${x + 90},${ruaY(x + 90) + 115}" stroke="#F2C14E" stroke-width="12"/>`;
    // praça lá embaixo (coreto, gente pequenininha)
    s += `<rect x="2250" y="${ruaY(2400) - 260}" width="200" height="150" fill="#F4EDE1" ${ST}/><path d="M2230,${ruaY(2400) - 255} L2350,${ruaY(2400) - 340} L2470,${ruaY(2400) - 255}Z" fill="#D96C4A" ${ST}/>`;
    s += cen.arvore(2560, ruaY(2560) - 40, 0.5);
    s += poe(pessoa(GENTE2.zefa), 2200, ruaY(2200) - 70, 0.16) + poe(pessoa(GENTE2.julia), 2480, ruaY(2480) - 70, 0.16) + poe(pessoa(GENTE2.caio), 2530, ruaY(2530) - 70, 0.16);
    s += `<rect x="2160" y="${ruaY(2300) - 330}" width="180" height="50" rx="8" fill="#FFF8EC" ${ST}/><text x="2250" y="${ruaY(2300) - 295}" text-anchor="middle" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="32" fill="${T}">PRAÇA</text>`;
    s += cen.pomboVoando(1650, 380, 0.7, -10);
    for (let i = 0; i < 60; i++) s += `<circle cx="${(i * 173) % 2600}" cy="${300 + (i * 251) % 1500}" r="${2 + i % 3}" fill="#fff" opacity=".6"/>`;
    s += `<rect x="-100" y="-1000" width="2800" height="4000" fill="#9FB8D0" opacity=".18"/>`;
    return s;
  }, []);
  // ônibus inclinado na ladeira
  const bx = 1100 + onibusDx, ang = Math.atan2(520, 1700) * 180 / Math.PI;
  const bus = `<g transform="translate(${bx},${ruaY(bx) - 245}) rotate(${ang})">${cen.onibus(0, 0, 0.64)}</g>`;
  const rose = roseX !== undefined ? poe(roseVivo(t, {expr, andando}), roseX, ruaY(roseX) - 70, 0.5) : '';
  const velha = velhaX !== undefined ? poe(roseVivo(t + 1.3, {expr: velhaExpr, velha: true, andando, falando}), velhaX, ruaY(velhaX) - 70, 0.5) : '';
  return <Svg W={2600} H={1920} html={fundo + bus + velha + rose} />;
};

// ------------------------------------------------------------ ÔNIBUS POR DENTRO (passageiros congelados)
export const DENTRO = {W: 2000, H: 1920, lim: {x0: 0, y0: -200, x1: 2000, y1: 2200}};
export const OnibusDentro: React.FC<{t: number; roseX?: number}> = ({t, roseX}) => {
  const html = React.useMemo(() => {
    let s = `<rect x="-100" y="-300" width="2200" height="2600" fill="#DCD6CB"/><rect x="-100" y="-300" width="2200" height="360" fill="#C9C1B3"/>`;
    // janelas com rua lá fora
    for (let i = 0; i < 6; i++) s += `<rect x="${60 + i * 330}" y="160" width="290" height="380" rx="20" fill="#BFE0F0" ${ST}/><path d="M${80 + i * 330},180 L${150 + i * 330},180 L${80 + i * 330},320Z" fill="#fff" opacity=".5"/><rect x="${60 + i * 330}" y="430" width="290" height="110" fill="#E89A7A" opacity=".5"/>`;
    s += `<rect x="-100" y="80" width="2200" height="20" fill="#9AA0A6"/><rect x="-100" y="1500" width="2200" height="800" fill="#8A847A"/>`;
    for (let x = 100; x < 2000; x += 300) s += `<rect x="${x}" y="60" width="10" height="560" fill="#C9CDD2"/>`;
    // bancos
    const banco = (x: number) => `<rect x="${x}" y="1000" width="230" height="160" rx="20" fill="#2F6FA3" ${ST}/><rect x="${x}" y="760" width="230" height="260" rx="24" fill="#24578A" ${ST}/>`;
    for (let i = 0; i < 6; i++) s += banco(80 + i * 330);
    // passageiros (todos com rosto)
    s += poe(pessoa(EXTRAS.lucia), 520, 1320, 0.42);
    s += poe(pessoa(GENTE4.cleide), 850, 1320, 0.42);
    s += poe(pessoa(GENTE4.sandra), 1180, 1320, 0.44);
    s += `<g transform="translate(1040,1060) rotate(-78) scale(0.26)">${pessoa(GENTE4.davi)}</g>`; // Davi dormindo no colo
    s += poe(pessoa(GENTE4.rafael), 1510, 1320, 0.42);
    s += poe(pessoa(EXTRAS.osmar), 200, 1320, 0.42);
    // Seu Jorge no volante (frente, à direita)
    s += `<rect x="1780" y="700" width="260" height="500" fill="#5B6168" ${ST}/>` + poe(pessoa(FIG.jorge), 1880, 1330, 0.44) + `<circle cx="1880" cy="1040" r="90" fill="none" stroke="#2B2B2B" stroke-width="22"/>`;
    s += `<rect x="-100" y="-300" width="2200" height="2600" fill="#9FB8D0" opacity=".16"/>`;
    return s;
  }, []);
  const rose = roseX !== undefined ? poe(roseVivo(t, {expr: 'desconfiada'}), roseX, 1700, 0.5) : '';
  return <Svg W={2000} H={1920} html={html + rose} />;
};

// ------------------------------------------------------------ FREIO (mangueira rachada pingando)
export const Freio: React.FC<{t: number; gota?: number}> = ({t, gota = 0}) => {
  const html = React.useMemo(() => {
    let s = `<rect width="1080" height="1920" fill="#3A3A3A"/>`;
    for (let i = 0; i < 18; i++) s += `<path d="M0,${i * 120} L1080,${i * 120 + 60}" stroke="#2E2E2E" stroke-width="8"/>`;
    // peças do freio
    s += `<rect x="120" y="420" width="840" height="140" rx="30" fill="#5B6168" ${ST}/><circle cx="260" cy="900" r="210" fill="#4A4A4A" ${ST}/><circle cx="260" cy="900" r="120" fill="#7A7F86" ${ST}/>`;
    // mangueira
    s += `<path d="M900,560 C900,760 700,820 560,880 C420,940 360,960 300,900" stroke="#1F1F1F" stroke-width="56" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M900,560 C900,760 700,820 560,880 C420,940 360,960 300,900" stroke="#3A3A3A" stroke-width="40" fill="none" stroke-linecap="round"/>`;
    // rachadura
    s += `<path d="M600,850 L620,872 L606,884 L628,904" stroke="#F2C14E" stroke-width="6" fill="none"/>`;
    // poça
    s += `<ellipse cx="620" cy="1560" rx="240" ry="40" fill="#C9A04A" opacity=".55"/>`;
    s += `<rect width="1080" height="1920" fill="#9FB8D0" opacity=".12"/>`;
    return s;
  }, []);
  // gotas paradas no ar entre a rachadura e a poça
  let g = '';
  for (let i = 0; i < 4; i++) g += `<ellipse cx="618" cy="${960 + i * 140 + gota * 20}" rx="${14 - i}" ry="${20 - i}" fill="#E2B85C" ${ST}/>`;
  return <Svg W={1080} H={1920} html={html + g} />;
};
