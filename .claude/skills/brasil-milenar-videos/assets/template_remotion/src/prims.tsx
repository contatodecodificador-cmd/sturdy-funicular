import React from 'react';
import {AbsoluteFill, Img, staticFile, interpolate} from 'remotion';
import {C, F} from './theme';
import {americaSul, africa, brasil, mundo, pathOf, pt, mercator, orto} from './geo';
import {useT, Rotulo} from './ui';
import {geoGraticule} from 'd3-geo';

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const prog = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const sm = (k: number) => k * k * (3 - 2 * k);

// ---------------- MAPA ----------------
type MapaProps = {
  center: [number, number]; scale: number; sa?: [number, number]; // deslocamento da América do Sul (px)
  costaBR?: number; // 0..1 brilho/linha do litoral
  plataforma?: number; // 0..1 faixa de terra nova (era do gelo)
  semMar?: number; // 0..1 litoral do Brasil some
  calor?: number; // 0..1 sobreposição de calor
  extra?: (proj: any) => React.ReactNode;
  todos?: boolean;
};
const CACHE = new Map<string, string>();
const memoPath = (center: [number, number], scale: number, f: any, path: any) => {
  const k = `${center[0]},${center[1]},${Math.round(scale)},${f.id ?? 'x'}`;
  let v = CACHE.get(k);
  if (v === undefined) { v = path(f) || ''; if (CACHE.size > 6000) CACHE.clear(); CACHE.set(k, v); }
  return v;
};
export const Mapa: React.FC<MapaProps> = ({center, scale, sa = [0, 0], costaBR = 1, plataforma = 0, semMar = 0, calor = 0, extra, todos = true}) => {
  scale = Math.round(scale / 4) * 4; // reduz recálculo em zooms
  const proj = mercator(center, scale);
  const path0 = pathOf(proj);
  const path = (f: any) => memoPath(center, scale, f, path0);
  const outros = todos ? mundo.filter((f) => !americaSul.includes(f)) : africa;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080}>
        <defs>
          <radialGradient id="oc" cx="50%" cy="45%" r="75%"><stop offset="0%" stopColor="#0B2038" /><stop offset="100%" stopColor="#050B16" /></radialGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="6" /></filter>
        </defs>
        <rect width={1920} height={1080} fill="url(#oc)" />
        {outros.map((f, i) => <path key={'o' + i} d={path(f) || ''} fill={C.terra} stroke={C.ouro} strokeOpacity={0.35} strokeWidth={0.8} />)}
        <g transform={`translate(${sa[0]},${sa[1]})`}>
          {plataforma > 0 && <path d={path(brasil) || ''} fill="none" stroke={C.impacto} strokeOpacity={0.35 * plataforma} strokeWidth={4 + 30 * plataforma} strokeLinejoin="round" />}
          {americaSul.map((f, i) => <path key={'s' + i} d={path(f) || ''} fill={f === brasil ? C.terraBR : C.terra} stroke={C.ouro} strokeOpacity={0.35} strokeWidth={0.8} />)}
          <path d={path(brasil) || ''} fill="none" stroke={C.ouro} strokeWidth={2} strokeOpacity={costaBR * (1 - semMar)} />
          {extra && extra(proj)}
        </g>
      </svg>
      {calor > 0 && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 45% 55%, rgba(255,110,40,0.55), rgba(180,40,10,0.25) 55%, transparent 80%)', opacity: calor, mixBlendMode: 'screen'}} />}
    </AbsoluteFill>
  );
};

export const Pin: React.FC<{p: [number, number]; label?: string; cor?: string; op?: number; size?: number; lado?: 'd' | 'e'}> = ({p, label, cor = C.info, op = 1, size = 22, lado = 'd'}) => (
  <g opacity={op}>
    <circle cx={p[0]} cy={p[1]} r={7} fill={cor} />
    <circle cx={p[0]} cy={p[1]} r={14} fill="none" stroke={cor} strokeOpacity={0.5} />
    {label && <Rotulo x={p[0] + (lado === 'd' ? 22 : -22)} y={p[1] + 8} size={size} cor={cor} anchor={lado === 'd' ? 'start' : 'end'}>{label}</Rotulo>}
  </g>
);

export const Seta: React.FC<{a: [number, number]; b: [number, number]; cor?: string; k?: number; w?: number}> = ({a, b, cor = C.impacto, k = 1, w = 3}) => {
  const x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k);
  const ang = Math.atan2(y - a[1], x - a[0]);
  const h = 16;
  return (
    <g opacity={k > 0.01 ? 1 : 0}>
      <line x1={a[0]} y1={a[1]} x2={x} y2={y} stroke={cor} strokeWidth={w} strokeDasharray="10 7" />
      <polygon points={`${x},${y} ${x - h * Math.cos(ang - 0.4)},${y - h * Math.sin(ang - 0.4)} ${x - h * Math.cos(ang + 0.4)},${y - h * Math.sin(ang + 0.4)}`} fill={cor} />
    </g>
  );
};

// ---------------- GLOBO ----------------
export const Globo: React.FC<{rot: [number, number]; scale: number; capNorte?: number; destaqueSul?: number}> = ({rot, scale, capNorte = 0, destaqueSul = 0}) => {
  const proj = orto(rot, scale);
  const path = pathOf(proj);
  const grat = geoGraticule().step([30, 30])();
  const cap = {type: 'Polygon', coordinates: [[...Array.from({length: 73}, (_, i) => [-180 + i * 5, 30]), [180, 90], [-180, 90], [-180, 30]]]} as any;
  const sul = {type: 'Polygon', coordinates: [[...Array.from({length: 73}, (_, i) => [180 - i * 5, -30]), [-180, -90], [180, -90], [180, -30]]]} as any;
  return (
    <svg width={1920} height={1080}>
      <defs><radialGradient id="gl" cx="40%" cy="35%"><stop offset="0%" stopColor="#123456" /><stop offset="100%" stopColor="#06101f" /></radialGradient></defs>
      <circle cx={960} cy={540} r={scale} fill="url(#gl)" stroke={C.dado} strokeOpacity={0.4} />
      <path d={path(grat) || ''} fill="none" stroke="#fff" strokeOpacity={0.08} />
      {mundo.map((f, i) => <path key={i} d={path(f) || ''} fill={f === brasil ? C.terraBR : C.terra} stroke={C.ouro} strokeOpacity={0.3} strokeWidth={0.7} />)}
      <path d={path(cap) || ''} fill="#000" opacity={0.6 * capNorte} />
      <path d={path(sul) || ''} fill={C.impacto} opacity={0.18 * destaqueSul} />
    </svg>
  );
};

// ---------------- CORTE DO VULCÃO (Noronha) ----------------
export const Vulcao: React.FC<{mar?: number; erosao?: number; atol?: number; zoomTopo?: number; por?: number; regua?: number}> = ({mar = 0, erosao = 0, atol = 0, zoomTopo = 0, por = 0, regua = 1}) => {
  const seaY = 420 + mar; // mar>0 = mar mais baixo (px)
  const peak = lerp(250, 470, erosao);
  const topW = lerp(70, 260, erosao);
  const sc = 1 + zoomTopo * 1.6;
  const ceu = por > 0 ? `linear-gradient(180deg, #1b1f3a ${0}%, #a8553a ${lerp(100, 70, por)}%, #f2a65a 100%)` : 'linear-gradient(180deg, #0c1a33, #1d3b5c)';
  return (
    <AbsoluteFill style={{transform: `scale(${sc})`, transformOrigin: '50% 30%'}}>
      <AbsoluteFill style={{background: ceu}} />
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <defs>
          <linearGradient id="mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1f6f8b" stopOpacity={0.95} /><stop offset="45%" stopColor="#0b2d4a" /><stop offset="100%" stopColor="#030a14" /></linearGradient>
          <linearGradient id="rocha" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a4a38" /><stop offset="100%" stopColor="#2a2119" /></linearGradient>
        </defs>
        <rect x={0} y={seaY} width={1920} height={1080 - seaY} fill="url(#mar)" />
        <path d={`M 260 1040 L ${960 - topW} ${peak + 40} Q ${960 - topW * 0.3} ${peak - 10} 960 ${peak} Q ${960 + topW * 0.5} ${peak + 20} ${960 + topW} ${peak + 50} L 1660 1040 Z`} fill="url(#rocha)" stroke={C.ouro} strokeOpacity={0.5} strokeWidth={1.5} />
        {atol > 0 && <g opacity={atol}>
          <ellipse cx={960} cy={peak + 18} rx={topW + 30} ry={16} fill="none" stroke={C.impacto} strokeWidth={10} strokeOpacity={0.85} />
          <Rotulo x={960} y={peak - 20} anchor="middle" cor={C.impacto} size={24}>ANEL DE RECIFE</Rotulo>
        </g>}
        <line x1={0} y1={seaY} x2={1920} y2={seaY} stroke="#9fd8ff" strokeOpacity={0.6} strokeWidth={2} />
        {regua > 0 && <g opacity={regua}>
          <line x1={1760} y1={seaY} x2={1760} y2={1040} stroke={C.info} strokeOpacity={0.6} />
          {[0, 1000, 2000, 3000, 4000].map((m) => {
            const y = seaY + (1040 - seaY) * (m / 4000);
            return <g key={m}><line x1={1745} y1={y} x2={1775} y2={y} stroke={C.info} strokeOpacity={0.6} /><Rotulo x={1790} y={y + 8} size={20} cor={C.cinza}>{m === 0 ? '0 M' : `${(m / 1000).toFixed(0)}.000 M`}</Rotulo></g>;
          })}
        </g>}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------- CÉU DO SUL com silhueta brasileira ----------------
const rnd = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
export const Silhueta: React.FC<{cor?: string}> = ({cor = '#05080f'}) => {
  const palms = [180, 420, 610, 1290, 1530, 1760];
  return (
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <path d="M0 1080 L0 930 Q 300 880 600 925 T 1200 915 T 1920 900 L1920 1080 Z" fill={cor} />
      {palms.map((x, i) => {
        const h = 150 + (i % 3) * 40, y = 925 - (i % 2) * 10;
        return <g key={i} fill={cor} stroke={cor}>
          <path d={`M ${x} ${y} Q ${x + 8} ${y - h / 2} ${x + 4} ${y - h}`} strokeWidth={7} fill="none" />
          {[-2.6, -1.9, -1.2, -0.5, 0.2, -3.2].map((a, j) => <path key={j} d={`M ${x + 4} ${y - h} q ${Math.cos(a) * 45} ${Math.sin(a) * 30 - 10} ${Math.cos(a) * 85} ${Math.sin(a) * 50 + 25}`} strokeWidth={5} fill="none" />)}
        </g>;
      })}
    </svg>
  );
};
export const Ceu: React.FC<{children?: React.ReactNode; dia?: number}> = ({children, dia = 0}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 110%, #12305a 0%, #0a1830 45%, #050a14 100%)'}} />
    {dia > 0 && <AbsoluteFill style={{background: 'linear-gradient(180deg,#2b5f9c,#86b7e0)', opacity: dia}} />}
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      {Array.from({length: 300}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 99) * 880} r={rnd(i + 7) < 0.9 ? 0.8 : 1.7} fill="#fff" opacity={(0.3 + rnd(i + 3) * 0.6) * (1 - dia)} />)}
      <ellipse cx={1150} cy={380} rx={900} ry={120} transform="rotate(-25 1150 380)" fill="#9fc4ff" opacity={0.05 * (1 - dia)} />
      {children}
    </svg>
    <Silhueta />
  </AbsoluteFill>
);
export const Estrela: React.FC<{x: number; y: number; r?: number; brilho?: number; cor?: string; label?: string; lop?: number}> = ({x, y, r = 3, brilho = 1, cor = '#fff', label, lop = 1}) => (
  <g>
    <circle cx={x} cy={y} r={r * 6 * brilho} fill={cor} opacity={0.12 * brilho} />
    <circle cx={x} cy={y} r={r * 2.5 * brilho} fill={cor} opacity={0.25 * brilho} />
    <circle cx={x} cy={y} r={r} fill={cor} />
    {label && <Rotulo x={x + 20 + r * 2} y={y + 8} size={22} op={lop}>{label}</Rotulo>}
  </g>
);

// ---------------- barras de faixa (mín–máx) ----------------
export const Faixas: React.FC<{itens: {rot: string; min: number; max: number; cor: string; txt: string}[]; maxV: number; k: number; unidade?: string}> = ({itens, maxV, k}) => {
  const base = 860, alt = 560;
  return (
    <svg width={1920} height={1080}>
      <line x1={420} y1={base} x2={1500} y2={base} stroke={C.cinza} strokeOpacity={0.5} />
      {itens.map((it, i) => {
        const x = 700 + i * 420, kk = clamp01(k * 1.4 - i * 0.4);
        const y1 = base - (it.min / maxV) * alt * kk, y2 = base - (it.max / maxV) * alt * kk;
        return <g key={i}>
          <rect x={x - 55} y={y2} width={110} height={base - y2} fill={it.cor} opacity={0.12} />
          <rect x={x - 55} y={y2} width={110} height={Math.max(0, y1 - y2)} fill={it.cor} opacity={0.75} rx={4} />
          <text x={x} y={y2 - 22} textAnchor="middle" fill={it.cor} opacity={kk} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 44}}>{it.txt}</text>
          <Rotulo x={x} y={base + 50} anchor="middle" size={22} cor={C.cinza}>{it.rot}</Rotulo>
        </g>;
      })}
    </svg>
  );
};

// ---------------- prédio com água subindo ----------------
export const Predio: React.FC<{andares: number; agua: number; label: string}> = ({andares, agua, label}) => {
  const fh = 70, w = 260, x = 830, base = 900, top = base - andares * fh;
  const wy = base - agua * andares * fh;
  return (
    <svg width={1920} height={1080}>
      <rect x={x} y={top} width={w} height={andares * fh} fill="#1c2638" stroke={C.cinza} strokeOpacity={0.6} />
      {Array.from({length: andares}, (_, i) => <g key={i}>{[0, 1, 2].map((j) => <rect key={j} x={x + 30 + j * 75} y={top + i * fh + 18} width={50} height={34} fill="#e8c77a" opacity={0.25} />)}</g>)}
      <rect x={0} y={wy} width={1920} height={base - wy + 180} fill="#1f6f8b" opacity={0.55} />
      <line x1={0} y1={wy} x2={1920} y2={wy} stroke="#9fd8ff" strokeOpacity={0.8} strokeWidth={2} />
      <Rotulo x={x + w + 40} y={wy - 14} size={28} cor={C.dado}>{label}</Rotulo>
      <line x1={0} y1={base} x2={1920} y2={base} stroke={C.cinza} strokeOpacity={0.4} />
    </svg>
  );
};

// ---------------- linha do tempo ----------------
export const Linha: React.FC<{marcas: string[]; k: number; destaque?: number}> = ({marcas, k, destaque = -1}) => (
  <svg width={1920} height={1080}>
    <line x1={200} y1={560} x2={200 + 1520 * k} y2={560} stroke={C.ouro} strokeWidth={3} />
    {marcas.map((m, i) => {
      const x = 200 + (1520 * i) / (marcas.length - 1); const on = k >= i / (marcas.length - 1) - 0.01;
      return <g key={i} opacity={on ? 1 : 0}>
        <circle cx={x} cy={560} r={i === destaque ? 12 : 8} fill={i === destaque ? C.impacto : C.ouro} />
        <text x={x} y={620} textAnchor="middle" fill={i === destaque ? C.impacto : C.info} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: i === destaque ? 46 : 34}}>{m}</text>
      </g>;
    })}
  </svg>
);

export const Selo: React.FC<{op: number}> = ({op}) => (
  <div style={{position: 'absolute', left: 80, bottom: 70, display: 'flex', alignItems: 'center', gap: 22, opacity: op}}>
    <Img src={staticFile('perfil.png')} style={{width: 120, height: 120, borderRadius: 60, border: `2px solid ${C.ouro}`}} />
    <div>
      <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 40, color: C.info}}>BRASIL MILENAR</div>
      <div style={{marginTop: 10, display: 'inline-block', padding: '8px 22px', borderRadius: 22, background: '#e5322d', fontFamily: F.rotulo, fontWeight: 700, fontSize: 20, color: '#fff', letterSpacing: 1}}>INSCREVER-SE</div>
    </div>
  </div>
);

export {lerp, pt, interpolate};
