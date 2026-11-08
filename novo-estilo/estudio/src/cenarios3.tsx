// Cenários novos do Ep. 3 "O dono do relógio": esconderijo atrás do balcão, a fresta, comparação lado a lado.
import React from 'react';
import {roseVivo, rose} from './arte';
import {COR} from './pecas';

const T = '#2B2420';
const ST = `stroke="${T}" stroke-width="3" stroke-linejoin="round"`;
const Svg: React.FC<{W: number; H: number; html: string; vb?: string; style?: React.CSSProperties}> = ({W, H, html, vb, style}) => (
  <svg width={W} height={H} viewBox={vb || `0 0 ${W} ${H}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style}} dangerouslySetInnerHTML={{__html: html}} />
);

// ------------------------------------------------------------ ESCONDERIJO (atrás do balcão, por dentro)
export const ESCOND = {W: 1080, H: 1920, lim: {x0: 0, y0: -400, x1: 1080, y1: 2300}};
export const Esconderijo: React.FC<{t: number; expr?: string; luz?: number; sombra?: number}> = ({t, expr = 'surpresa', luz = 1, sombra = 0}) => {
  const fundo = React.useMemo(() => {
    let s = `<rect x="-100" y="-500" width="1300" height="2900" fill="#3B2A1E"/>`;
    for (let x = -100; x < 1200; x += 90) s += `<rect x="${x}" y="-500" width="86" height="1700" fill="#4A3424" stroke="#2E2016" stroke-width="4"/>`;
    s += `<rect x="-100" y="1200" width="1300" height="1200" fill="#5A4030"/>`;
    for (let x = -100; x < 1200; x += 140) s += `<path d="M${x},1200 L${x - 120},2400" stroke="#4A3424" stroke-width="5"/>`;
    // caixas de relógio velho
    const caixa = (x: number, y: number, w: number, h: number, txt: string) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#B9925E" ${ST}/><path d="M${x},${y + 30} L${x + w},${y + 30}" stroke="#8A6A40" stroke-width="5"/><rect x="${x + 20}" y="${y + 50}" width="${w - 40}" height="40" fill="#FFF8EC" ${ST}/><text x="${x + w / 2}" y="${y + 80}" text-anchor="middle" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="26" fill="${T}">${txt}</text>`;
    s += caixa(-40, 1280, 300, 260, 'RELÓGIOS VELHOS') + caixa(760, 1240, 320, 300, 'PEÇAS · 1974') + caixa(80, 1080, 240, 200, 'CORDAS');
    for (let i = 0; i < 14; i++) s += `<circle cx="${300 + (i * 61) % 460}" cy="${1560 + (i * 37) % 160}" r="${10 + i % 3 * 6}" fill="none" stroke="#C9A04A" stroke-width="5"/>`;
    return s;
  }, []);
  // fresta de luz no alto (por onde ela espia) + sombra passando
  const fresta = `<rect x="420" y="760" width="560" height="22" fill="#FFF3C4" opacity="${0.9 * luz}"/><path d="M420,782 L980,782 L1180,1900 L200,1900Z" fill="#FFF3C4" opacity="${0.12 * luz}"/>`
    + (sombra > 0 ? `<rect x="${420 + 560 * (1 - sombra)}" y="760" width="${180}" height="22" fill="#1B1410" opacity=".9"/>` : '');
  // Rose sentada no chão, só do quadril pra cima, entre as caixas
  const rosa = `<defs><clipPath id="sentadaE"><rect x="0" y="0" width="400" height="960"/></clipPath></defs><g transform="translate(${540 - 200 * 0.85},${1560 - 960 * 0.85}) scale(0.85)"><g clip-path="url(#sentadaE)">${roseVivo(t, {expr})}</g></g>`;
  const frente = `<rect x="-100" y="1520" width="1300" height="900" fill="#4A3424" opacity=".0"/>` + `<rect x="300" y="1520" width="480" height="140" rx="14" fill="#24364F" ${ST}/>`;
  return <Svg W={1080} H={1920} html={fundo + fresta + rosa + frente} />;
};

// ------------------------------------------------------------ A FRESTA (o que ela vê: um pedaço da visita)
type Alvo = 'tenis' | 'luvas' | 'cabelo' | 'sombra';
const RECORTE: Record<Alvo, string> = {
  tenis: '40 1630 260 81',    // tênis esquerdo com a mancha
  luvas: '150 925 256 80',    // bolso do casaco com as luvas
  cabelo: '72 66 256 80',     // faixa + cabelo branco
  sombra: '-200 900 800 460',
};
export const Fresta: React.FC<{alvo: Alvo; abre?: number}> = ({alvo, abre = 1}) => {
  const velha = React.useMemo(() => rose({expr: 'feliz', velha: true}), []);
  const h = 300 * abre;
  const chao = `<rect x="-400" y="1500" width="1200" height="400" fill="#8A6A40"/><rect x="-400" y="-400" width="1200" height="1900" fill="#E9DCC2"/>`;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#0E0A08'}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 960 - h / 2, height: h, overflow: 'hidden', borderRadius: 20, boxShadow: '0 0 80px 30px rgba(255,243,196,.18)'}}>
        <svg width="100%" height="100%" viewBox={RECORTE[alvo]} preserveAspectRatio="xMidYMid slice" dangerouslySetInnerHTML={{__html: chao + velha}} />
        <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 60px 30px rgba(14,10,8,.85)'}} />
      </div>
      {/* bordas de madeira da fresta */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 960 - h / 2 - 40, height: 40, background: '#3B2A1E'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 960 + h / 2, height: 40, background: '#3B2A1E'}} />
    </div>
  );
};

// ------------------------------------------------------------ LADO A LADO (visita × Rose)
export const Comparar: React.FC<{alvo: 'tenis' | 'luvas' | 'rosto'; rotE: string; rotD: string; t?: number}> = ({alvo, rotE, rotD, t = 0}) => {
  const vb = {tenis: '60 1460 140 252', luvas: '230 860 120 216', rosto: '110 60 180 300'}[alvo];
  const velha = rose({expr: 'feliz', velha: true});
  const nova = roseVivo(t, {expr: 'surpresa'});
  const painel = (svg: string, rot: string, cor: string, x: number) => (
    <div style={{position: 'absolute', left: x, top: 480, width: 500, height: 900, borderRadius: 28, overflow: 'hidden', border: `6px solid ${COR.tinta}`, background: '#E9DCC6'}}>
      <svg width="100%" height="100%" viewBox={vb} preserveAspectRatio="xMidYMid slice" dangerouslySetInnerHTML={{__html: svg}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 16, textAlign: 'center'}}><span style={{background: cor, color: COR.tinta, border: `4px solid ${COR.tinta}`, borderRadius: 14, padding: '4px 20px', fontFamily: 'Anton, sans-serif', fontSize: 44}}>{rot}</span></div>
    </div>
  );
  return (
    <div style={{position: 'absolute', inset: 0, background: '#1B1410'}}>
      {painel(velha, rotE, '#E3C77A', 30)}
      {painel(nova, rotD, COR.ipe, 550)}
    </div>
  );
};
