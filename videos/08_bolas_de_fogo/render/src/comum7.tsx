/* Vídeo 7 — peças comuns do 2D: fundo de espaço, Sol, globo vetorial, mapa real, rótulos */
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {geoOrthographic, geoPath, geoGraticule, geoEquirectangular} from 'd3-geo';
import {F} from './theme';
import {lerp, rnd, KO, es, clamp01} from './base';
import {mundo, brasil} from './geo';

export const SVG: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0, overflow: 'visible', ...style}}>{children}</svg>;
export const COR = {ouro: '#E3B04B', perigo: '#FF5A3C', calmo: '#7CC4FF', texto: '#F2F4F8', sol: '#FFB547', brasa: '#FF7A2F', plasma: '#FF8A3D', verde: '#3DDBB4', aurora: '#5CF2A0', roxo: '#9B6BFF', navy: '#060A14'};

// ---------- fundo de espaço com estrelas que cintilam ----------
const ESTRELAS = Array.from({length: 260}, (_, i) => ({x: rnd(i) * 1920, y: rnd(i + 500) * 1080, r: 0.6 + rnd(i + 900) * 1.8, f: rnd(i + 1300) * 6}));
export const Espaco: React.FC<{t: number; cor?: string; neb?: boolean}> = ({t, cor = '#0B1428', neb = true}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 30% 40%, ${cor} 0%, #050811 70%)`}}>
    {neb && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 75% 70%, rgba(80,60,140,0.18), transparent 55%), radial-gradient(ellipse at 15% 85%, rgba(40,90,160,0.14), transparent 50%)'}} />}
    <SVG>{ESTRELAS.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * 1.3 + s.f))} />)}</SVG>
  </AbsoluteFill>
);

// ---------- Sol com coroa animada ----------
export const SolG: React.FC<{x: number; y: number; r: number; t: number; furia?: number; id?: string}> = ({x, y, r, t, furia = 0, id = 's'}) => (
  <g>
    <defs>
      <radialGradient id={`${id}g`}><stop offset="0" stopColor="#FFF4C8" /><stop offset="0.55" stopColor="#FFC24A" /><stop offset="0.85" stopColor="#FF8A2A" /><stop offset="1" stopColor="#E0521C" /></radialGradient>
      <radialGradient id={`${id}h`}><stop offset="0.45" stopColor="#FF9A3A" stopOpacity="0.55" /><stop offset="1" stopColor="#FF6A1A" stopOpacity="0" /></radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r * 2.6} fill={`url(#${id}h)`} />
    {Array.from({length: 28}, (_, i) => {
      const a = (i / 28) * Math.PI * 2 + t * 0.05; const L = r * (1.25 + 0.25 * Math.sin(t * 1.7 + i * 2.3) + furia * 0.5 * rnd(i + Math.floor(t * 4)));
      return <line key={i} x1={x + Math.cos(a) * r * 0.95} y1={y + Math.sin(a) * r * 0.95} x2={x + Math.cos(a) * L} y2={y + Math.sin(a) * L} stroke="#FFB04A" strokeWidth={r * 0.05} strokeLinecap="round" opacity={0.35} />;
    })}
    <circle cx={x} cy={y} r={r} fill={`url(#${id}g)`} />
    {Array.from({length: 9}, (_, i) => <circle key={i} cx={x + Math.cos(i * 2.1 + t * 0.2) * r * 0.55 * rnd(i + 3)} cy={y + Math.sin(i * 1.7 + t * 0.2) * r * 0.55 * rnd(i + 8)} r={r * (0.05 + 0.04 * rnd(i))} fill="#C2491A" opacity={0.25} />)}
  </g>
);

// ---------- globo vetorial (países reais, Brasil em destaque) ----------
export const Globo: React.FC<{cx: number; cy: number; r: number; lon: number; lat: number; noite?: number; brasilCor?: string; children?: (P: (lon: number, lat: number) => [number, number] | null) => React.ReactNode; atm?: string}> = ({cx, cy, r, lon, lat, noite = 0, brasilCor = '#5E9A4E', children, atm = '#7CC4FF'}) => {
  const proj = geoOrthographic().rotate([-lon, -lat]).scale(r).translate([cx, cy]).clipAngle(90);
  const path = geoPath(proj);
  const P = (lo: number, la: number) => { const p = proj([lo, la]); return p ? (p as [number, number]) : null; };
  const id = `gl${Math.round(cx)}${Math.round(cy)}`;
  return (
    <g>
      <defs>
        <radialGradient id={`${id}o`} cx="0.38" cy="0.35"><stop offset="0" stopColor={noite ? '#16304F' : '#2C6CB0'} /><stop offset="1" stopColor={noite ? '#060E1C' : '#0E2D5A'} /></radialGradient>
        <radialGradient id={`${id}a`}><stop offset="0.86" stopColor={atm} stopOpacity="0" /><stop offset="0.93" stopColor={atm} stopOpacity="0.45" /><stop offset="1" stopColor={atm} stopOpacity="0" /></radialGradient>
        <radialGradient id={`${id}s`} cx="0.3" cy="0.28"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.55" /></radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r * 1.1} fill={`url(#${id}a)`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}o)`} />
      <path d={path(geoGraticule().step([20, 20])()) || ''} fill="none" stroke="#fff" strokeOpacity={0.05} />
      {mundo.map((f: any, i: number) => <path key={i} d={path(f) || ''} fill={f.id === '076' ? brasilCor : noite ? '#1B2A22' : '#4C7A44'} stroke={f.id === '076' ? '#CFE8B8' : '#89B07A'} strokeOpacity={f.id === '076' ? 0.6 : 0.2} strokeWidth={f.id === '076' ? 1.6 : 0.6} />)}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}s)`} />
      {children && children(P)}
    </g>
  );
};

// ---------- mapa real (imagem de relevo) com projeção simples ----------
const BOX = {lon0: -100, lon1: 20, lat0: 50, lat1: -60};
export const MapaAS: React.FC<{lt: number; d: number; lonC: number; latC: number; s0: number; s1: number; children?: (P: (lon: number, lat: number) => [number, number]) => React.ReactNode; html?: (P: (lon: number, lat: number) => [number, number]) => React.ReactNode; escuro?: number}> = ({lt, d, lonC, latC, s0, s1, children, html, escuro = 0.35}) => {
  const s = lerp(s0, s1, es(lt / d));
  const P = (lon: number, lat: number): [number, number] => [960 + (lon - lonC) * s, 540 - (lat - latC) * s];
  const [x0, y0] = P(BOX.lon0, BOX.lat0);
  return (
    <AbsoluteFill style={{background: '#06142A'}}>
      <Img src={staticFile('mapa_as.jpg')} style={{position: 'absolute', left: x0, top: y0, width: (BOX.lon1 - BOX.lon0) * s, height: (BOX.lat0 - BOX.lat1) * s, filter: `brightness(${1 - escuro}) saturate(0.95) contrast(1.05)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)'}} />
      {children && <SVG>{children(P)}</SVG>}
      {html && html(P)}
    </AbsoluteFill>
  );
};
// mapa-múndi vetorial (equiretangular)
export const Mundo: React.FC<{t: number; children?: (P: (lon: number, lat: number) => [number, number]) => React.ReactNode; destaque?: (f: any) => string | null}> = ({t, children, destaque}) => {
  const proj = geoEquirectangular().scale(300).translate([960, 560]);
  const path = geoPath(proj);
  const P = (lo: number, la: number) => proj([lo, la]) as [number, number];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, #0D1B33, #050811 75%)'}}>
      <SVG>
        <path d={path(geoGraticule().step([30, 30])()) || ''} fill="none" stroke="#7CC4FF" strokeOpacity={0.06} />
        {mundo.map((f: any, i: number) => <path key={i} d={path(f) || ''} fill={(destaque && destaque(f)) || (f.id === '076' ? '#3E6E4A' : '#26384F')} stroke="#7FA0C4" strokeOpacity={0.25} strokeWidth={0.7} />)}
        {children && children(P)}
      </SVG>
    </AbsoluteFill>
  );
};

export const Rotulo: React.FC<{x: number; y: number; txt: string; sub?: string; cor?: string; op?: number; lado?: 1 | -1; size?: number}> = ({x, y, txt, sub, cor = COR.ouro, op = 1, lado = 1, size = 34}) => (
  <div style={{position: 'absolute', left: x + lado * 24, top: y, opacity: op, transform: `translate(${lado < 0 ? '-100%' : '0'},-50%)`, padding: '8px 16px', borderRadius: 9, background: 'rgba(6,10,20,0.86)', borderLeft: `4px solid ${cor}`, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', whiteSpace: 'nowrap'}}>
    <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: size, color: '#fff', lineHeight: 1}}>{txt}</div>
    {sub && <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 16, letterSpacing: 3, color: '#C3CAD8', marginTop: 4}}>{sub}</div>}
  </div>
);
export const Pulso: React.FC<{p: [number, number]; t: number; cor: string; op?: number; r?: number}> = ({p, t, cor, op = 1, r = 10}) => (
  <g opacity={op}>
    {[0, 0.33, 0.66].map((o) => { const k = (t * 0.8 + o) % 1; return <circle key={o} cx={p[0]} cy={p[1]} r={r + k * 70} fill="none" stroke={cor} strokeWidth={3} opacity={1 - k} />; })}
    <circle cx={p[0]} cy={p[1]} r={r} fill={cor} stroke="#fff" strokeWidth={3} />
  </g>
);
// caminho que "se desenha"
export const Traco: React.FC<{d: string; k: number; cor: string; w?: number; L?: number; glow?: boolean; dash?: string}> = ({d, k, cor, w = 5, L = 3000, glow = true, dash}) => (
  <g>
    {glow && <path d={d} fill="none" stroke={cor} strokeWidth={w * 3.2} strokeOpacity={0.18} strokeLinecap="round" strokeDasharray={`${L * clamp01(k)} ${L}`} />}
    <path d={d} fill="none" stroke={cor} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash || `${L * clamp01(k)} ${L}`} />
  </g>
);
export const pts = (a: [number, number][]) => !a || !a.length ? 'M0,0' : 'M' + a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L');
export const suave = (a: [number, number][]) => {  // curva Catmull-Rom → Bézier
  if (!a || a.length === 0) return 'M0,0';
  if (a.length === 1) return `M${a[0][0]},${a[0][1]}`;
  let d = `M${a[0][0]},${a[0][1]}`;
  for (let i = 0; i < a.length - 1; i++) {
    const p0 = a[Math.max(0, i - 1)], p1 = a[i], p2 = a[i + 1], p3 = a[Math.min(a.length - 1, i + 2)];
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d;
};
export {brasil};
