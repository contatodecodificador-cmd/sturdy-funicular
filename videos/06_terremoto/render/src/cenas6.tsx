/* Vídeo 6 — cenas da abertura (terremoto 9,5 no Brasil) */
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {F} from './theme';
import {lerp, rnd, clamp01, prog, KO, KS, es, tremor, Numero} from './base';
import {Pessoa, VOCE, CIENTISTA, Visual} from './personagens';

const SVG: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0, overflow: 'visible', ...style}}>{children}</svg>;
export const COR = {ouro: '#E3B04B', perigo: '#FF5A3C', calmo: '#7CC4FF', texto: '#F2F4F8'};

// ---------- cores da régua de magnitude (frio → quente) ----------
export const corMag = (m: number) => {
  const st: [number, string][] = [[0, '#5FA8E0'], [3, '#3DDBB4'], [5, '#E3D24B'], [6.5, '#FF9A2F'], [8, '#FF5A3C'], [9.5, '#C2185B']];
  for (let i = 1; i < st.length; i++) if (m <= st[i][0]) return st[i][1];
  return st[st.length - 1][1];
};

// ===================== HUD: régua de magnitude (direita) =====================
export const ReguaMag: React.FC<{k: number; valor: number; topoMisterio?: boolean; t: number}> = ({k, valor, topoMisterio = true, t}) => {
  if (k <= 0) return null;
  const y = (m: number) => lerp(930, 170, m / 9.5);
  const marcas = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9.5];
  const x0 = lerp(1990, 1800, KO(k, 0, 1));
  return (
    <SVG>
      <g transform={`translate(${x0},0)`} opacity={k}>
        <rect x={-6} y={150} width={78} height={800} rx={14} fill="rgba(6,10,20,0.78)" />
        {marcas.slice(0, -1).map((m, i) => <rect key={m} x={6} y={y(marcas[i + 1])} width={18} height={y(m) - y(marcas[i + 1]) - 2} rx={3} fill={corMag(m + 0.5)} opacity={m + 0.5 <= valor + 0.01 ? 1 : 0.28} />)}
        {marcas.map((m) => <text key={'t' + m} x={60} y={y(m) + 7} textAnchor="end" fill="#C3CAD8" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 17}}>{m === 9.5 ? '9,5' : m}</text>)}
        {topoMisterio && <text x={34} y={140} textAnchor="middle" fill={COR.perigo} opacity={0.6 + 0.4 * Math.sin(t * 4)} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 30}}>???</text>}
        {/* seta */}
        <g transform={`translate(-14,${y(valor)})`} opacity={valor > 0.05 ? 1 : 0}>
          <path d="M0,0 L-22,-14 L-22,14 Z" fill={corMag(valor)} />
          <rect x={-106} y={-20} width={84} height={40} rx={8} fill={corMag(valor)} />
          <text x={-64} y={10} textAnchor="middle" fill="#06080F" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 28}}>{valor.toFixed(1).replace('.', ',')}</text>
        </g>
      </g>
    </SVG>
  );
};

// ===================== HUD: sismógrafo (faixa inferior) =====================
export const Sismografo: React.FC<{k: number; t: number; amp: number}> = ({k, t, amp}) => {
  if (k <= 0) return null;
  const pts: string[] = [];
  for (let i = 0; i <= 240; i++) {
    const x = 240 + i * 6;
    const tt = t - (240 - i) * 0.02;
    const a = amp * (0.6 + 0.4 * Math.sin(tt * 0.9));
    const yv = (Math.sin(tt * 31) * 0.5 + Math.sin(tt * 53 + 1) * 0.3 + Math.sin(tt * 87 + 2) * 0.2) * a * 34;
    pts.push(`${x},${yv.toFixed(1)}`);
  }
  return (
    <SVG>
      <g opacity={k} transform={`translate(0,${lerp(1140, 1000, KO(k, 0, 1))})`}>
        <rect x={220} y={-40} width={1480} height={80} rx={12} fill="rgba(244,240,228,0.9)" />
        {Array.from({length: 30}, (_, i) => <line key={i} x1={240 + i * 50 - ((t * 120) % 50)} x2={240 + i * 50 - ((t * 120) % 50)} y1={-36} y2={36} stroke="#D9CFB8" strokeWidth={1} />)}
        <line x1={240} x2={1680} y1={0} y2={0} stroke="#CBBF9F" strokeWidth={1} />
        <polyline points={pts.join(' ')} fill="none" stroke="#B3261E" strokeWidth={2.4} />
        <circle cx={1680} cy={Number(pts[pts.length - 1].split(',')[1])} r={5} fill="#B3261E" />
        <text x={236} y={-48} fill="#C3CAD8" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 15, letterSpacing: 4}}>SISMÓGRAFO</text>
      </g>
    </SVG>
  );
};

// ===================== Cartela: data =====================
export const CartelaData: React.FC<{lt: number; t: number; txt: string; sub?: string}> = ({lt, t, txt, sub}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg,#0B1830 0%,#1E2E4A 55%,#3A3040 100%)'}}>
    <SVG>
      {Array.from({length: 26}, (_, i) => { const h = 80 + rnd(i) * 240, w = 50 + rnd(i + 3) * 90, x = i * 76 - 20; return <g key={i}><rect x={x} y={1080 - 180 - h} width={w} height={h + 180} fill="#0A1222" />{Array.from({length: Math.floor(h / 34)}, (_, j) => rnd(i * 31 + j) > 0.55 && <rect key={j} x={x + 10 + (j % 2) * 22} y={1080 - 180 - h + 14 + j * 30} width={12} height={10} fill="#FFD98A" opacity={0.65} />)}</g>; })}
      <path d="M0,960 Q480,930 960,955 T1920,950 L1920,1080 L0,1080 Z" fill="#081020" />
    </SVG>
    <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 120, color: '#fff', letterSpacing: 6, opacity: KO(lt, 0.15, 0.7), textShadow: '0 8px 30px rgba(0,0,0,0.7)'}}>{txt}</div>
      {sub && <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 30, letterSpacing: 10, color: '#C3CAD8', marginTop: 10, opacity: KO(lt, 0.5, 1.0)}}>{sub}</div>}
    </AbsoluteFill>
  </AbsoluteFill>
);

// ===================== Manaus: fachada do prédio histórico =====================
const Fachada: React.FC<{x: number; y: number; s: number; t: number; luz?: number}> = ({x, y, s, t, luz = 0.97}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-420} y={-640} width={840} height={640} fill="#D9C7A3" />
    <rect x={-420} y={-640} width={840} height={40} fill="#C2AE88" />
    <rect x={-440} y={-680} width={880} height={44} rx={6} fill="#B89F74" />
    <path d="M-120,-680 Q0,-760 120,-680 Z" fill="#B89F74" />
    <rect x={-60} y={-740} width={120} height={20} fill="#9E865D" />
    {[-1, 0, 1, 2].map((r) => [-3, -2, -1, 1, 2, 3].map((c) => {
      const wx = c * 120 - 30, wy = -560 + r * 130;
      if (r === 2) return null;
      return <g key={`${r}${c}`}><rect x={wx} y={wy} width={60} height={86} rx={30} fill={rnd(r * 9 + c + 30) < luz ? '#FFDFA0' : '#3A3226'} /><rect x={wx - 6} y={wy + 86} width={72} height={8} fill="#B89F74" /></g>;
    }))}
    {[-330, -210, -90, 90, 210, 330].map((cx) => <rect key={cx} x={cx - 10} y={-640} width={20} height={640} fill="#CDB993" opacity={0.6} />)}
    <rect x={-80} y={-170} width={160} height={170} rx={70} fill="#4A3A28" />
    <rect x={-70} y={-160} width={140} height={160} rx={62} fill="#FFDFA0" opacity={0.8} />
    <rect x={-200} y={-36} width={400} height={36} fill="#9E8E78" />
    <rect x={-210} y={-232} width={420} height={44} rx={4} fill="#6E5A3C" />
    <text x={0} y={-201} textAnchor="middle" fill="#F2E6C8" style={{fontFamily: 'Georgia, serif', fontSize: 26, letterSpacing: 6}}>PALÁCIO DO COMÉRCIO</text>
  </g>
);
export const Manaus: React.FC<{lt: number; t: number; pessoas?: number; balanco?: number}> = ({lt, t, pessoas = 0, balanco = 0}) => {
  const PORT: Visual = {...VOCE, pele: '#8C5B3E', peleSombra: '#73482F', cabelo: {tipo: 'curto', cor: '#1E1612'}, topo: {tipo: 'camiseta', cor: '#2F3B52', cor2: '#1F2838'}, baixo: {tipo: 'calca', cor: '#22262E'}, pe: {tipo: 'sapato', cor: '#111'}, bigode: true};
  const MOR = [
    {...VOCE, pele: '#C99272', peleSombra: '#A97A5C', cabelo: {tipo: 'longo' as const, cor: '#2A1C15', cor2: '#1E140F'}, topo: {tipo: 'camiseta' as const, cor: '#D1495B', cor2: '#A8323F'}, baixo: {tipo: 'calca' as const, cor: '#2B2D42'}, pe: {tipo: 'tenis' as const, cor: '#EEE'}},
    {...VOCE, pele: '#6E4630', peleSombra: '#5A3826', cabelo: {tipo: 'curto' as const, cor: '#151010'}, topo: {tipo: 'camiseta' as const, cor: '#E9C46A', cor2: '#C9A44A'}, baixo: {tipo: 'calca' as const, cor: '#3E5C76'}, pe: {tipo: 'tenis' as const, cor: '#333'}},
    {...VOCE, pele: '#E0B494', peleSombra: '#C49A7A', cabelo: {tipo: 'grisalho' as const, cor: '#7A7570', cor2: '#B9B4AE'}, topo: {tipo: 'camiseta' as const, cor: '#7FA8BA', cor2: '#5F8899'}, baixo: {tipo: 'calca' as const, cor: '#55504A'}, pe: {tipo: 'sapato' as const, cor: '#222'}},
  ];
  const sw = balanco * Math.sin(t * 1.6) * 0.6;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#5C8FC4 0%,#A9CBE6 55%,#E8D9B8 100%)'}}>
      <SVG>
        <circle cx={1650} cy={210} r={70} fill="#FFF3D0" opacity={0.85} />
        {[[180, 260], [1560, 300], [1760, 240]].map(([x, h], i) => <g key={i}><rect x={x - 70} y={900 - h - 200} width={140} height={h + 200} fill={['#9AA8B6', '#8C9AAA', '#A3AFBC'][i]} />{Array.from({length: 8}, (_, j) => <rect key={j} x={x - 50 + (j % 2) * 60} y={900 - h - 180 + Math.floor(j / 2) * 70} width={36} height={40} fill="#C9D6E2" />)}</g>)}
        {[300, 1500].map((x, i) => <g key={'p' + i}><path d={`M${x},900 Q${x + 8},780 ${x - 4},640`} stroke="#5A4630" strokeWidth={14} fill="none" />{Array.from({length: 7}, (_, j) => <path key={j} d={`M${x - 4},640 q${Math.cos(j) * 90},${-30 + Math.sin(j * 2) * 30} ${Math.cos(j) * 150},${40}`} stroke="#2F6B3A" strokeWidth={16} fill="none" strokeLinecap="round" />)}</g>)}
        <g transform={`rotate(${sw} 960 900)`}><Fachada x={960} y={900} s={1} t={t} /></g>
        <rect y={900} width={1920} height={180} fill="#8E8A82" />
        <rect y={900} width={1920} height={14} fill="#B5B0A6" />
        {pessoas > 0 && <>
          <g transform="translate(1120,1000) scale(0.62)"><Pessoa v={PORT} expr="susto" t={t} bD={[120, 40]} bE={[10, 10]} /></g>
          {MOR.map((v, i) => { const k = clamp01((lt - 0.2 - i * 0.5) / 3.2); const x = lerp(960, i === 1 ? 560 : i === 0 ? 700 : 1380, es(k)); return <g key={i} transform={`translate(${x},${1010 + i * 12 + Math.abs(Math.sin(lt * 7 + i)) * -5}) scale(0.6)`} opacity={k > 0 ? 1 : 0}><Pessoa v={v} expr="susto" t={t + i} bE={[20, 30]} bD={[20, 30]} /></g>; })}
        </>}
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== Interior: lustre balançando sozinho =====================
export const Lustre: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const ang = Math.sin(t * 1.9) * 9;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#3A2E24 0%,#5A4634 60%,#2A2018 100%)'}}>
      <SVG>
        <rect y={760} width={1920} height={320} fill="#3A2A1C" />
        {Array.from({length: 12}, (_, i) => <line key={i} x1={i * 180} x2={i * 180 - 100} y1={760} y2={1080} stroke="#2A1E14" strokeWidth={4} />)}
        <rect x={200} y={180} width={360} height={480} rx={8} fill="#6A5440" stroke="#8C7458" strokeWidth={10} />
        <rect x={1360} y={180} width={360} height={480} rx={8} fill="#1E2A3A" stroke="#8C7458" strokeWidth={10} />
        {Array.from({length: 20}, (_, i) => <rect key={i} x={1380 + (i % 5) * 68} y={200 + Math.floor(i / 5) * 110} width={40} height={60} fill="#FFD98A" opacity={rnd(i + 3) > 0.5 ? 0.6 : 0.1} />)}
        {/* sombra do lustre no chão */}
        <ellipse cx={960 + Math.sin(ang * Math.PI / 180) * 520} cy={900} rx={180} ry={30} fill="#000" opacity={0.25} />
        <g transform={`rotate(${ang} 960 0)`}>
          <line x1={960} y1={0} x2={960} y2={330} stroke="#B89F74" strokeWidth={6} />
          <g transform="translate(960,330)">
            <path d="M-120,0 Q0,-40 120,0 L90,70 Q0,100 -90,70 Z" fill="#C9A65A" />
            {[-90, -45, 0, 45, 90].map((x, i) => <g key={i}><line x1={x} y1={60} x2={x} y2={110} stroke="#E3C27A" strokeWidth={3} /><path d={`M${x - 10},110 q10,-30 20,0 q-10,22 -20,0 Z`} fill="#FFF3D0" /><circle cx={x} cy={118} r={30} fill="#FFE6A8" opacity={0.25} /></g>)}
          </g>
        </g>
      </SVG>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 35%, rgba(255,220,150,0.18), transparent 60%)'}} />
    </AbsoluteFill>
  );
};

// ===================== Escada vazia (sombra balançando) =====================
export const EscadaVazia: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const sw = Math.sin(t * 1.9) * 40;
  return (
    <AbsoluteFill style={{background: '#4A4036'}}>
      <SVG>
        {Array.from({length: 11}, (_, i) => <g key={i}><rect x={420 + i * 70} y={980 - i * 70} width={1100 - i * 70} height={70} fill={i % 2 ? '#8C7A64' : '#9A8670'} /><rect x={420 + i * 70} y={980 - i * 70} width={1100 - i * 70} height={10} fill="#B39D82" /></g>)}
        <path d="M400,940 L1180,180" stroke="#5A3E28" strokeWidth={14} />
        {Array.from({length: 12}, (_, i) => <line key={i} x1={400 + i * 66} y1={940 - i * 64} x2={400 + i * 66} y2={1010 - i * 64} stroke="#5A3E28" strokeWidth={6} />)}
        <ellipse cx={1250 + sw} cy={300} rx={260} ry={90} fill="#000" opacity={0.18} />
        <rect x={1500} y={120} width={300} height={600} fill="#2E2822" />
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== Cartão de notícia (só o parágrafo + grifo animado) =====================
export type InfoNoticia = {w: number; h: number; linhas: {x: number; y: number; w: number; h: number}[]};
export const Noticia: React.FC<{lt: number; d: number; img: string; info: InfoNoticia; fonte: string; data: string; fundo: React.ReactNode; g0?: number; g1?: number}> = ({lt, d, img, info, fonte, data, fundo, g0 = 0.5, g1}) => {
  const maxW = 1500, maxH = 660;
  const sc = Math.min(maxW / info.w, maxH / info.h, 2.2);
  const W = info.w * sc, H = info.h * sc;
  const k = KO(lt, 0, 0.45);
  const fim = g1 ?? d - 0.5;
  const n = info.linhas.length;
  return (
    <AbsoluteFill style={{background: '#05070D'}}>
      <AbsoluteFill style={{filter: 'blur(10px) brightness(0.42) saturate(0.8)', transform: `scale(${lerp(1.1, 1.12, es(lt / d))})`}}>{fundo}</AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1), rgba(0,0,0,0.65) 100%)'}} />
      <div style={{position: 'absolute', left: 960 - W / 2, top: 540 - H / 2 + 30, width: W, height: H, transform: `translateY(${(1 - k) * 30}px) scale(${lerp(1, 1.02, es(lt / d))})`, opacity: k, boxShadow: '0 30px 80px rgba(0,0,0,0.65)', borderRadius: 10, overflow: 'hidden', background: '#fff'}}>
        <Img src={staticFile(img)} style={{position: 'absolute', left: 0, top: 0, width: W, height: H}} />
        {info.linhas.map((l, i) => {
          const a = lerp(g0, fim, i / n), b = lerp(g0, fim, (i + 1) / n);
          const p = clamp01((lt - a) / (b - a));
          return <div key={i} style={{position: 'absolute', left: l.x * sc - 3, top: l.y * sc + l.h * sc * 0.06, width: (l.w + 6) * sc * p, height: l.h * sc * 0.88, background: 'rgba(255,214,0,0.55)', mixBlendMode: 'multiply', borderRadius: 3}} />;
        })}
      </div>
      {/* fonte */}
      <div style={{position: 'absolute', left: 960 - W / 2, top: 540 - H / 2 - 50, opacity: KO(lt, 0.15, 0.6), display: 'flex', alignItems: 'center', gap: 14}}>
        <span style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: '#06080F', background: COR.ouro, padding: '6px 14px', borderRadius: 6}}>FONTE</span>
        <span style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: '#fff'}}>{fonte}</span>
        <span style={{fontFamily: F.rotulo, fontWeight: 500, fontSize: 22, letterSpacing: 2, color: '#C3CAD8'}}>· {data}</span>
      </div>
    </AbsoluteFill>
  );
};

// ===================== Mapa real da América do Sul (satélite) =====================
const BOX = {lon0: -100, lon1: -10, lat0: 25, lat1: -60};
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
export const Rotulo: React.FC<{x: number; y: number; txt: string; sub?: string; cor?: string; op?: number; lado?: 1 | -1}> = ({x, y, txt, sub, cor = COR.ouro, op = 1, lado = 1}) => (
  <div style={{position: 'absolute', left: x + lado * 24, top: y, opacity: op, transform: `translate(${lado < 0 ? '-100%' : '0'},-50%)`, padding: '8px 16px', borderRadius: 9, background: 'rgba(6,10,20,0.86)', borderLeft: `4px solid ${cor}`, boxShadow: '0 8px 24px rgba(0,0,0,0.5)'}}>
    <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 38, color: '#fff', lineHeight: 1}}>{txt}</div>
    {sub && <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 16, letterSpacing: 3, color: '#C3CAD8', marginTop: 4}}>{sub}</div>}
  </div>
);
export const Pulso: React.FC<{p: [number, number]; t: number; cor: string; op?: number; r?: number}> = ({p, t, cor, op = 1, r = 10}) => (
  <g opacity={op}>
    {[0, 0.33, 0.66].map((o) => { const k = (t * 0.8 + o) % 1; return <circle key={o} cx={p[0]} cy={p[1]} r={r + k * 70} fill="none" stroke={cor} strokeWidth={3} opacity={1 - k} />; })}
    <circle cx={p[0]} cy={p[1]} r={r} fill={cor} stroke="#fff" strokeWidth={3} />
  </g>
);

// ===================== Mapa oficial (ShakeMap USGS) =====================
export const MapaOficial: React.FC<{lt: number; d: number; img: string; titulo: string}> = ({lt, d, img, titulo}) => (
  <AbsoluteFill style={{background: '#0A0F1A'}}>
    <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative', height: 900, transform: `scale(${lerp(1, 1.025, es(lt / d))})`, boxShadow: '0 30px 80px rgba(0,0,0,0.6)', borderRadius: 8, overflow: 'hidden', opacity: KO(lt, 0, 0.4)}}>
        <Img src={staticFile(img)} style={{height: 900, display: 'block'}} />
      </div>
    </AbsoluteFill>
    <div style={{position: 'absolute', left: 80, top: 80, opacity: KO(lt, 0.2, 0.6), padding: '12px 20px', borderRadius: 10, background: 'rgba(6,10,20,0.9)', borderLeft: `5px solid ${COR.ouro}`}}>
      <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 18, letterSpacing: 4, color: '#C3CAD8'}}>MAPA OFICIAL DE INTENSIDADE · USGS</div>
      <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 44, color: '#fff', marginTop: 4}}>{titulo}</div>
    </div>
  </AbsoluteFill>
);

// ===================== Prédio alto balançando x casa térrea =====================
export const PredioPendulo: React.FC<{lt: number; t: number; amp: number}> = ({lt, t, amp}) => {
  const a = Math.sin(t * 1.4) * amp;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#1B2A44 0%,#3C5478 70%)'}}>
      <SVG>
        <rect y={940} width={1920} height={140} fill="#2A2F38" />
        <g transform={`translate(860,940) skewX(${a})`}>
          <rect x={-150} y={-820} width={300} height={820} fill="#4A5568" />
          {Array.from({length: 13}, (_, r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={-125 + c * 66} y={-790 + r * 60} width={44} height={36} fill={rnd(r * 7 + c) > 0.4 ? '#FFD98A' : '#2A3242'} opacity={0.85} />))}
        </g>
        <g transform="translate(1340,940)"><rect x={-130} y={-150} width={260} height={150} fill="#7A6450" /><path d="M-150,-148 L0,-240 L150,-148 Z" fill="#5A4636" /><rect x={-40} y={-90} width={80} height={90} fill="#3A2A1C" /><rect x={-110} y={-120} width={50} height={40} fill="#FFD98A" /></g>
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== A cozinha + o copo d'água =====================
export const Cozinha: React.FC<{lt: number; t: number; onda: number; tremorK?: number; close?: number}> = ({lt, t, onda, tremorK = 0, close = 0}) => {
  const tr = tremor(t, tremorK, 2);
  const z = lerp(1, 2.3, close);
  return (
    <AbsoluteFill style={{background: '#1A1E28', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${tr.x}px,${tr.y}px) rotate(${tr.r}deg) scale(${z})`, transformOrigin: '50% 62%'}}>
        <SVG>
          <defs>
            <linearGradient id="parede" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2C3446" /><stop offset="100%" stopColor="#3A4256" /></linearGradient>
            <linearGradient id="agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BFE6FF" stopOpacity={0.75} /><stop offset="100%" stopColor="#6FB4E8" stopOpacity={0.55} /></linearGradient>
            <radialGradient id="luzLamp" cx="50%" cy="0%"><stop offset="0%" stopColor="#FFE9B8" stopOpacity={0.55} /><stop offset="100%" stopColor="#FFE9B8" stopOpacity={0} /></radialGradient>
          </defs>
          <rect width={1920} height={1080} fill="url(#parede)" />
          {/* azulejos */}
          {Array.from({length: 24}, (_, i) => <line key={'v' + i} x1={i * 80} x2={i * 80} y1={420} y2={640} stroke="#46506A" strokeWidth={1.5} />)}
          {Array.from({length: 4}, (_, i) => <line key={'h' + i} x1={0} x2={1920} y1={420 + i * 70} y2={420 + i * 70} stroke="#46506A" strokeWidth={1.5} />)}
          {/* janela com a cidade à noite */}
          <rect x={1180} y={140} width={560} height={300} fill="#0C1426" stroke="#5A6276" strokeWidth={14} />
          {Array.from({length: 14}, (_, i) => { const h = 60 + rnd(i) * 180; return <g key={i}><rect x={1194 + i * 40} y={440 - h} width={34} height={h} fill="#141E34" />{Array.from({length: Math.floor(h / 26)}, (_, j) => rnd(i * 11 + j) > 0.5 && <rect key={j} x={1200 + i * 40} y={448 - h + j * 24} width={8} height={8} fill="#FFD98A" opacity={0.7} />)}</g>; })}
          <line x1={1460} x2={1460} y1={140} y2={440} stroke="#5A6276" strokeWidth={8} />
          {/* armário e louça */}
          <rect x={140} y={120} width={720} height={250} rx={10} fill="#5A4636" />
          {[0, 1, 2].map((i) => <rect key={i} x={160 + i * 236} y={140} width={220} height={210} rx={6} fill="#6A5442" />)}
          {/* bancada */}
          <rect x={0} y={640} width={1920} height={30} fill="#9A8C7A" />
          <rect x={0} y={670} width={1920} height={410} fill="#2A2420" />
          {/* lâmpada pendente */}
          <line x1={760} x2={760 + Math.sin(t * 1.3) * tremorK * 30} y1={0} y2={240} stroke="#222" strokeWidth={3} />
          <g transform={`translate(${760 + Math.sin(t * 1.3) * tremorK * 30},240)`}><path d="M-60,0 L60,0 L40,-40 L-40,-40 Z" fill="#1E2430" /><ellipse cx={0} cy={4} rx={40} ry={10} fill="#FFE9B8" /></g>
          <path d={`M${760 - 420},${660} L${760 + 420},${660} L${760 + 60},${244} L${760 - 60},${244} Z`} fill="url(#luzLamp)" />
          {/* mesa */}
          <rect x={360} y={760} width={1200} height={36} rx={8} fill="#7A5A3C" />
          <rect x={420} y={796} width={36} height={284} fill="#5A3E28" /><rect x={1464} y={796} width={36} height={284} fill="#5A3E28" />
          {/* o copo */}
          <g transform="translate(960,760)">
            <ellipse cx={0} cy={0} rx={70} ry={12} fill="#000" opacity={0.3} />
            <path d="M-56,-210 L56,-210 L46,0 L-46,0 Z" fill="rgba(220,235,250,0.18)" stroke="rgba(230,240,255,0.7)" strokeWidth={4} />
            <path d={`M-53,-150 ${Array.from({length: 22}, (_, i) => { const x = -53 + i * 5.05; const y = -150 + Math.sin(i * 0.9 + t * 9) * 4 * onda + Math.sin(t * 3) * 3 * onda * (x / 53); return `L${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ')} L49,-4 L-49,-4 Z`} fill="url(#agua)" />
            <ellipse cx={0} cy={-150} rx={53} ry={8} fill="#DFF3FF" opacity={0.5} />
            {onda > 0.05 && [0, 1, 2].map((i) => { const k = ((t * 1.4 + i / 3) % 1); return <ellipse key={i} cx={0} cy={-150} rx={6 + k * 46} ry={1.5 + k * 7} fill="none" stroke="#FFFFFF" strokeWidth={1.6} opacity={(1 - k) * Math.min(1, onda * 2)} />; })}
            <path d="M-40,-200 L-34,-20" stroke="#fff" strokeWidth={6} opacity={0.25} strokeLinecap="round" />
          </g>
        </SVG>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 60%, transparent 40%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};

// ===================== Número gigante =====================
export const NumeroGigante: React.FC<{lt: number; d: number; t: number; txt: string; sub?: string}> = ({lt, d, t, txt, sub}) => {
  const tr = tremor(t, 0.25 * KS(lt, 0.4, d), 7);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #3A0E14, #08030A 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <div style={{transform: `translate(${tr.x}px,${tr.y}px) scale(${lerp(1, 1.025, es(lt / d))})`}}><Numero cor={COR.perigo} size={340} op={KO(lt, 0.05, 0.35)}>{txt}</Numero></div>
      {sub && <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 30, letterSpacing: 10, color: '#E8C8C8', marginTop: 10, opacity: KO(lt, 0.4, 0.8)}}>{sub}</div>}
    </AbsoluteFill>
  );
};

// ===================== A escada de magnitude (cada degrau maior) =====================
export const EscadaMag: React.FC<{lt: number; d: number; t: number; ate: number}> = ({lt, d, t, ate}) => {
  const degs = [2, 3, 4, 5, 6, 7, 8, 9, 9.5];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#0B1222,#141C30)'}}>
      <SVG>
        {degs.map((m, i) => {
          const on = KO(lt, 0.2 + i * (ate / degs.length), 0.5 + i * (ate / degs.length));
          const x = 260 + i * 150, h = 60 + i * 80;
          return <g key={m} opacity={0.25 + 0.75 * on}>
            <rect x={x} y={900 - h} width={140} height={h} rx={6} fill={corMag(m)} />
            <text x={x + 70} y={900 - h - 18} textAnchor="middle" fill="#fff" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 40}}>{m === 9.5 ? '9,5' : m}</text>
          </g>;
        })}
        <g transform={`translate(${lerp(300, 1500, KS(lt, 0.3, d))},${lerp(840, 180, KS(lt, 0.3, d))}) scale(0.32)`}><Pessoa v={VOCE} vista="costas" t={t} /></g>
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== Brasil no escuro: o ponto no Acre =====================
export const BrasilAcre: React.FC<{lt: number; d: number; t: number; corte?: number}> = ({lt, d, t, corte = 0}) => (
  <MapaAS lt={lt} d={d} lonC={-55} latC={-14} s0={26} s1={27} escuro={0.7}
    children={(P) => <Pulso p={P(-70.77, -8.16)} t={t} cor={COR.perigo} op={KO(lt, 0.4, 0.9)} />}
    html={(P) => { const [x, y] = P(-70.77, -8.16); return <div style={{position: 'absolute', left: x + 30, top: y - 30, opacity: KO(lt, 1.0, 1.4), fontFamily: F.titulo, fontWeight: 700, fontSize: 64, color: COR.perigo, textShadow: '0 4px 18px rgba(0,0,0,0.7)'}}>???</div>; }} />
);

// ===================== Corte da Terra (teaser) =====================
export const CorteTeaser: React.FC<{lt: number; d: number; t: number}> = ({lt, d, t}) => {
  const clar = (Math.sin(t * 2.4) + 1) / 2;
  return (
    <AbsoluteFill style={{background: '#06080F'}}>
      <SVG>
        <defs><linearGradient id="manto" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5A3A22" /><stop offset="100%" stopColor="#8A2A10" /></linearGradient></defs>
        <rect x={0} y={260} width={1920} height={820} fill="url(#manto)" />
        <path d="M0,260 L560,260 L700,150 L820,240 L1920,250 L1920,300 L0,300 Z" fill="#6E7F5A" />
        <path d="M0,300 L1920,300 L1920,330 L0,330 Z" fill="#3A2C20" />
        {/* placa mergulhando */}
        <path d="M0,330 L520,340 C760,380 1000,560 1260,860 L1180,900 C940,620 720,450 480,400 L0,390 Z" fill="#2E3A4E" opacity={0.95} />
        <circle cx={1220} cy={870} r={30 + clar * 20} fill="#FFE08A" opacity={0.6 + 0.4 * clar} />
        <circle cx={1220} cy={870} r={110} fill="#FFB547" opacity={0.18 * clar} />
        <text x={1360} y={230} fill="#fff" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 4}}>ACRE</text>
        <text x={1270} y={890} fill="#fff" opacity={KO(lt, 0.8, 1.2)} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 64}}>???</text>
      </SVG>
    </AbsoluteFill>
  );
};
