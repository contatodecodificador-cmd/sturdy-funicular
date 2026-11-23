/* Vídeo 8 — cenas da introdução e do ato 1 (o rio, as explosões, o sismógrafo, mapas, Cristo, pasta do caso). */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {lerp, clamp01, prog, K, KO, KS, es, rnd} from './base';
import {F} from './theme';
import {SVG, COR, MapaAS, Rotulo, Pulso, Traco, Mundo, suave} from './comum7';

export type P = {lt: number; d: number; t: number; arg?: string};

// ---------- paletas de céu ----------
const CEUS: Record<string, [string, string, string, string]> = { // topo, meio, horizonte, sol
  azul: ['#0B1830', '#2B3F66', '#C98A5A', '#FFE2A8'],
  vermelho: ['#2A0606', '#6E120C', '#D2361A', '#FF5A2A'],
  sangue: ['#1E0404', '#540C08', '#A8200F', '#E8341A'],
  calmo: ['#18305A', '#4D6E9E', '#F2B979', '#FFF1C9'],
};

// copa da floresta: coroas de árvore em fila (silhueta), com seed
const Copa: React.FC<{y: number; cor: string; seed: number; r0?: number; r1?: number; passo?: number; op?: number}> = ({y, cor, seed, r0 = 30, r1 = 70, passo = 46, op = 1}) => {
  const n = Math.ceil(2000 / passo);
  return (
    <g opacity={op}>
      <rect x={-40} y={y} width={2000} height={1080 - y} fill={cor} />
      {Array.from({length: n}, (_, i) => {
        const r = lerp(r0, r1, rnd(seed + i * 3.1));
        return <circle key={i} cx={i * passo + rnd(seed + i) * 20 - 20} cy={y + r * 0.35 - rnd(seed + i * 7) * r * 0.5} r={r} fill={cor} />;
      })}
    </g>
  );
};
// palmeira (açaí) em silhueta
const Palmeira: React.FC<{x: number; y: number; h: number; cor: string; t: number; s?: number}> = ({x, y, h, cor, t, s = 1}) => {
  const sw = Math.sin(t * 0.9 + x) * 6;
  const tx = x + sw, ty = y - h;
  return (
    <g>
      <path d={`M${x},${y} Q${x + 10},${y - h * 0.5} ${tx},${ty}`} stroke={cor} strokeWidth={7 * s} fill="none" strokeLinecap="round" />
      {[-150, -120, -90, -60, -30, 0, 30].map((a, i) => {
        const r = (a * Math.PI) / 180; const L = 95 * s;
        const ex = tx + Math.cos(r) * L, ey = ty + Math.sin(r) * L * 0.5 + 40 * s;
        return <path key={i} d={`M${tx},${ty} Q${(tx + ex) / 2},${ty - 26 * s} ${ex},${ey}`} stroke={cor} strokeWidth={5 * s} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
};
// canoa com remador sentado (silhueta)
export const Canoa: React.FC<{x: number; y: number; s?: number; cor?: string; t: number; olhaCima?: number; dois?: boolean}> = ({x, y, s = 1, cor = '#0C0705', t, olhaCima = 0, dois = false}) => {
  const bob = Math.sin(t * 1.6) * 3 * s;
  const pessoa = (px: number, k: number) => (
    <g transform={`translate(${px},0)`}>
      <path d={`M-14,-6 Q-18,-40 -8,-58 L10,-58 Q18,-40 14,-6 Z`} fill={cor} />
      <g transform={`rotate(${-18 * k},0,-64)`}>
        <circle cx={0} cy={-72} r={12} fill={cor} />
        <ellipse cx={0} cy={-80} rx={22} ry={5} fill={cor} />
        <path d="M-11,-82 Q0,-96 11,-82 Z" fill={cor} />
      </g>
      {k < 0.5 && <line x1={6} y1={-40} x2={54} y2={18} stroke={cor} strokeWidth={4} strokeLinecap="round" />}
      {k >= 0.5 && <line x1={8} y1={-48} x2={30} y2={-86} stroke={cor} strokeWidth={6} strokeLinecap="round" />}
    </g>
  );
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s})`}>
      <path d="M-120,-8 Q-60,12 0,12 Q60,12 120,-8 L110,-16 Q0,-2 -110,-16 Z" fill={cor} />
      {pessoa(-30, olhaCima)}
      {dois && pessoa(46, olhaCima)}
    </g>
  );
};
// bola de fogo com cauda (cabeça em hx,hy; direção ang em graus; comprimento L)
export const BolaFogo: React.FC<{hx: number; hy: number; ang: number; L: number; r: number; op?: number; id: string}> = ({hx, hy, ang, L, r, op = 1, id}) => {
  const a = (ang * Math.PI) / 180;
  const tx = hx - Math.cos(a) * L, ty = hy - Math.sin(a) * L;
  return (
    <g opacity={op}>
      <defs>
        <linearGradient id={`c${id}`} x1={tx} y1={ty} x2={hx} y2={hy} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF6A1A" stopOpacity="0" /><stop offset="0.7" stopColor="#FF8A2A" stopOpacity="0.55" /><stop offset="1" stopColor="#FFE9B0" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id={`h${id}`}><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.35" stopColor="#FFE6A0" /><stop offset="0.7" stopColor="#FF8A2A" stopOpacity="0.7" /><stop offset="1" stopColor="#FF5A10" stopOpacity="0" /></radialGradient>
      </defs>
      <line x1={tx} y1={ty} x2={hx} y2={hy} stroke={`url(#c${id})`} strokeWidth={r * 1.6} strokeLinecap="round" />
      <line x1={tx} y1={ty} x2={hx} y2={hy} stroke={`url(#c${id})`} strokeWidth={r * 0.6} strokeLinecap="round" />
      <circle cx={hx} cy={hy} r={r * 3.2} fill={`url(#h${id})`} />
    </g>
  );
};
// clarão de explosão atrás da linha de árvores
const Clarao: React.FC<{x: number; y: number; k: number; r?: number}> = ({x, y, k, r = 420}) => (
  k <= 0 ? null : <g opacity={k}>
    <defs><radialGradient id={`ex${Math.round(x)}`}><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.18" stopColor="#FFE8A8" /><stop offset="0.45" stopColor="#FF8A2A" stopOpacity="0.75" /><stop offset="1" stopColor="#FF4A10" stopOpacity="0" /></radialGradient></defs>
    <circle cx={x} cy={y} r={r * (0.6 + 0.4 * k)} fill={`url(#ex${Math.round(x)})`} />
  </g>
);

// ---------- O RIO (cena principal da introdução) ----------
export const Rio: React.FC<P> = ({lt, d, t, arg = 'amanhecer'}) => {
  const ceu = arg.startsWith('vermelho') || arg === 'assobio' || arg === 'pescadores' ? 'vermelho' : arg.startsWith('po') ? 'sangue' : arg === 'calmo' ? 'calmo' : arg === 'fogo' ? 'vermelho' : 'azul';
  const kv = arg === 'vermelho' ? K(lt, 0.2, d * 0.8) : 1; // o céu "vira" vermelho dentro do plano
  const [c0, c1, c2, cs] = CEUS[ceu];
  const [a0, a1, a2] = CEUS.azul;
  const mix = (a: string, b: string) => (arg === 'vermelho' ? (kv < 0.5 ? a : b) : b);
  const top = arg === 'vermelho' ? mix(a0, c0) : c0, mid = arg === 'vermelho' ? mix(a1, c1) : c1, hor = arg === 'vermelho' ? mix(a2, c2) : c2;
  const HY = 660; // horizonte
  const solY = arg === 'vermelho' ? lerp(640, 470, KS(lt, 0, d)) : arg === 'calmo' ? 430 : 470;
  const solX = 1180;
  const close = arg === 'pescadores' || arg === 'po2' || arg === 'vermelho2';
  const fogo = arg === 'fogo' || arg === 'assobio' || arg === 'pescadores';
  const po = arg.startsWith('po');
  const corMata1 = ceu === 'azul' || ceu === 'calmo' ? '#0E1A16' : '#160705';
  const corMata2 = ceu === 'azul' || ceu === 'calmo' ? '#172820' : '#2A0B07';
  const corMata3 = ceu === 'azul' || ceu === 'calmo' ? '#24382B' : '#3F120A';
  const bolas = fogo ? [0, 1, 2].map((i) => {
    const t0 = i * (d / 3.2); const k = prog(lt, t0, t0 + 2.6);
    return {k, hx: lerp(500 + i * 420, 760 + i * 330, k), hy: lerp(-60, 520, k), i};
  }) : [];
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <SVG>
        <defs>
          <linearGradient id="ceuR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="0.55" stopColor={mid} /><stop offset="1" stopColor={hor} /></linearGradient>
          <linearGradient id="aguaR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={hor} /><stop offset="0.35" stopColor={mid} /><stop offset="1" stopColor={top} /></linearGradient>
          <radialGradient id="solR"><stop offset="0" stopColor={cs} /><stop offset="0.55" stopColor={cs} stopOpacity="0.9" /><stop offset="1" stopColor={cs} stopOpacity="0" /></radialGradient>
          <radialGradient id="halo"><stop offset="0" stopColor={cs} stopOpacity="0.55" /><stop offset="1" stopColor={cs} stopOpacity="0" /></radialGradient>
        </defs>
        <rect width={1920} height={HY + 20} fill="url(#ceuR)" />
        <circle cx={solX} cy={solY} r={360} fill="url(#halo)" />
        <circle cx={solX} cy={solY} r={close ? 110 : 78} fill="url(#solR)" />
        {/* nuvens finas */}
        {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={(300 + i * 520 + lt * (8 + i * 3)) % 2200 - 140} cy={180 + i * 70} rx={260} ry={14} fill={hor} opacity={0.12} />)}
        {bolas.map((b) => b.k > 0 && b.k < 1 && <BolaFogo key={b.i} id={`r${b.i}`} hx={b.hx} hy={b.hy} ang={68} L={340} r={11} op={b.k < 0.9 ? 1 : (1 - b.k) * 10} />)}
        {bolas.map((b) => <Clarao key={'c' + b.i} x={b.hx} y={HY - 40} k={b.k >= 1 ? Math.max(0, 1 - (lt - (b.i * (d / 3.2) + 2.6)) / 1.2) : 0} r={300} />)}
        {/* mata distante → próxima */}
        <Copa y={HY - 150} cor={corMata3} seed={11} r0={34} r1={70} passo={52} />
        <Copa y={HY - 80} cor={corMata2} seed={23} r0={40} r1={86} passo={62} />
        {[150, 250, 340, 1480, 1590, 1700, 1810].map((x, i) => <Palmeira key={i} x={x} y={HY - 20} h={230 + (i % 3) * 50} cor={corMata1} t={t} s={1.2} />)}
        <Copa y={HY - 10} cor={corMata1} seed={37} r0={30} r1={58} passo={50} />
        {/* rio */}
        <rect y={HY + 10} width={1920} height={1080 - HY} fill="url(#aguaR)" />
        <ellipse cx={solX} cy={HY + 140} rx={46} ry={240} fill={cs} opacity={0.13} style={{filter: 'blur(10px)'}} />
        {Array.from({length: 26}, (_, i) => {
          const y = HY + 30 + i * 18 + i * i * 0.6; const w = 80 + rnd(i) * 220;
          const x = (rnd(i + 40) * 1920 + Math.sin(lt * 0.8 + i) * 30);
          return <line key={i} x1={x} y1={y} x2={x + w} y2={y} stroke={i % 3 ? cs : '#fff'} strokeOpacity={0.12 + 0.12 * Math.sin(lt * 2 + i)} strokeWidth={2} />;
        })}
        {/* névoa */}
        <rect y={HY - 40} width={1920} height={90} fill={ceu === 'azul' || ceu === 'calmo' ? '#C9D6E6' : '#E0705A'} opacity={arg === 'amanhecer' || arg === 'calmo' ? 0.22 : 0.1} style={{filter: 'blur(18px)'}} />
        {/* canoa */}
        {!close && <Canoa x={lerp(640, 700, lt / d)} y={HY + 230} s={1.35} t={t} olhaCima={fogo ? 1 : 0} />}
        {close && <Canoa x={720} y={1000} s={2.6} t={t} olhaCima={arg === 'pescadores' ? 1 : 0} dois={arg === 'pescadores'} />}
        {/* pó fino */}
        {po && Array.from({length: 260}, (_, i) => {
          const sp = 30 + rnd(i) * 50; const y = ((rnd(i + 3) * 1200 + (lt + 3) * sp) % 1150) - 60;
          const x = rnd(i + 9) * 1920 + Math.sin(lt * 0.7 + i) * 18;
          return <circle key={i} cx={x} cy={y} r={2 + rnd(i + 5) * 3.6} fill="#F08A6A" opacity={0.45 + rnd(i + 7) * 0.45} />;
        })}
        {/* assobio: arcos de som */}
        {arg === 'assobio' && [0, 1, 2].map((i) => { const k = ((lt * 0.9 + i / 3) % 1); return <ellipse key={i} cx={960} cy={300} rx={200 + k * 600} ry={60 + k * 180} fill="none" stroke="#FFD9B0" strokeOpacity={(1 - k) * 0.25 * clamp01(lt / 1.5)} strokeWidth={3} />; })}
      </SVG>
      {(arg === 'po' || arg === 'po2') && <AbsoluteFill style={{background: 'rgba(120,20,8,0.12)', mixBlendMode: 'multiply'}} />}
    </AbsoluteFill>
  );
};

// ---------- TRÊS EXPLOSÕES ----------
export const Explosoes: React.FC<P> = ({lt, d, t, arg = '3'}) => {
  const HY = 640;
  const tempos = [0.25, d * 0.38, d * 0.68].map((x) => Math.min(x, d - 0.6));
  const ks = tempos.map((t0) => (lt < t0 ? 0 : Math.max(0.28, 1 - (lt - t0) / 2.6)));
  const xs = [560, 1010, 1420];
  const shake = ks.reduce((a, k) => a + k, 0);
  const sx = Math.sin(lt * 63) * 10 * shake, sy = Math.cos(lt * 51) * 6 * shake;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <SVG style={{transform: `translate(${sx}px,${sy}px) scale(1.03)`}}>
        <defs><linearGradient id="ceE" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0E0202" /><stop offset="0.6" stopColor="#3A0806" /><stop offset="1" stopColor="#8A2210" /></linearGradient></defs>
        <rect width={1920} height={1080} fill="url(#ceE)" />
        {xs.map((x, i) => <Clarao key={i} x={x} y={HY - 30} k={ks[i]} r={520} />)}
        {xs.map((x, i) => lt >= tempos[i] && <g key={'n' + i} opacity={clamp01((lt - tempos[i]) / 0.3) * (1 - clamp01((lt - tempos[i] - 2.5) / 1.5))}>
          {[0, 1, 2, 3, 4].map((j) => <circle key={j} cx={x + (rnd(i * 9 + j) - 0.5) * 160} cy={HY - 80 - j * 40 - (lt - tempos[i]) * 30} r={50 + j * 16} fill="#2A0A06" opacity={0.45} style={{filter: 'blur(14px)'}} />)}
        </g>)}
        <Copa y={HY - 40} cor="#2A0B07" seed={5} r0={26} r1={58} passo={44} />
        <Copa y={HY} cor="#120504" seed={17} r0={18} r1={36} passo={40} />
        <rect y={HY + 20} width={1920} height={440} fill="#240806" />
        {/* ondas na água a cada explosão */}
        {xs.map((x, i) => lt >= tempos[i] && [0, 1, 2].map((j) => { const k = clamp01((lt - tempos[i] - j * 0.25) / 2); return <ellipse key={i + '-' + j} cx={x} cy={HY + 140} rx={40 + k * 520} ry={8 + k * 70} fill="none" stroke="#FF9A6A" strokeOpacity={(1 - k) * 0.6} strokeWidth={3} />; }))}
        <Canoa x={1640} y={HY + 230} s={0.8} t={t} olhaCima={1} />
        {/* números 1, 2, 3 */}
        {arg === '123' && xs.map((x, i) => lt >= tempos[i] && <text key={'t' + i} x={x} y={HY - 260} textAnchor="middle" fontFamily={F.titulo} fontWeight={700} fontSize={120} fill="#fff" opacity={clamp01((lt - tempos[i]) / 0.25)} style={{filter: 'drop-shadow(0 0 18px #FF8A2A)'}}>{i + 1}</text>)}
      </SVG>
      <AbsoluteFill style={{background: '#FFE8C0', opacity: Math.max(...ks.map((k) => Math.max(0, k - 0.85) * 1.2)), mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

// ---------- SISMÓGRAFO ----------
export const Sismo: React.FC<P> = ({lt, d, t, arg = 'papel'}) => {
  const tambor = arg === 'tambor';
  const pico = arg === 'pico';
  const desl = tambor ? lt * 90 : pico ? 0 : lt * 140;
  const traco = (y0: number, seed: number) => {
    const a: [number, number][] = [];
    for (let x = -40; x <= 1960; x += 6) {
      const xx = x + desl;
      const centro = pico ? 960 : 1100 + lt * 0;
      const dist = Math.abs(x - (pico ? 960 : 1300 - desl * 0.2));
      const evento = Math.exp(-((dist / 140) ** 2)) * (pico ? 1 : clamp01((lt - 0.6) / 0.8));
      const y = y0 + Math.sin(xx * 0.09 + seed) * 3 + (rnd(Math.floor(xx / 6) + seed) - 0.5) * 6 + Math.sin(xx * 0.35) * 120 * evento * (0.6 + rnd(Math.floor(xx / 6)) * 0.6);
      a.push([x, y]); void centro;
    }
    return a;
  };
  return (
    <AbsoluteFill style={{background: '#0B0D10', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #EDE3CC, #D9CCAE)', transform: tambor ? 'perspective(1400px) rotateX(18deg) scale(1.15)' : undefined}}>
        <SVG>
          {Array.from({length: 40}, (_, i) => <line key={i} x1={(i * 60 - desl % 60)} y1={0} x2={(i * 60 - desl % 60)} y2={1080} stroke="#8A7A5A" strokeOpacity={0.18} />)}
          {Array.from({length: 18}, (_, i) => <line key={'h' + i} x1={0} y1={i * 60} x2={1920} y2={i * 60} stroke="#8A7A5A" strokeOpacity={0.12} />)}
          {[300, 560, 820].map((y, i) => <path key={i} d={'M' + traco(y, i * 7).map((p) => p.join(',')).join(' L')} fill="none" stroke="#1E1A16" strokeWidth={2.4} opacity={i === 1 ? 1 : 0.45} />)}
          {!pico && <g transform={`translate(1300, 560)`}><line x1={0} y1={-420} x2={0} y2={0} stroke="#3A3A3A" strokeWidth={8} /><circle cx={0} cy={0} r={9} fill="#B3261E" /></g>}
          <text x={80} y={1020} fontFamily={F.rotulo} fontWeight={700} fontSize={30} letterSpacing={6} fill="#5A4A32">SAN CALIXTO · LA PAZ · 13 AGO 1930</text>
        </SVG>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};

// ---------- MAPAS ----------
const CURUCA: [number, number] = [-71.6, -5.2];
export const MapaLaPaz: React.FC<P> = ({lt, d, t, arg = '0'}) => (
  <MapaAS lt={lt} d={d} lonC={-70} latC={-11} s0={arg === '1' ? 64 : 58} s1={arg === '1' ? 68 : 62} escuro={0.42}
    children={(Pp) => { const a = Pp(...CURUCA), b = Pp(-68.13, -16.5); const k = K(lt, 0.3, d * 0.8); return <g>
      <Traco d={`M${a[0]},${a[1]} Q${(a[0] + b[0]) / 2 + 120},${(a[1] + b[1]) / 2} ${b[0]},${b[1]}`} k={k} cor={COR.ouro} w={5} L={1400} />
      <Pulso p={a} t={t} cor={COR.perigo} /><Pulso p={b} t={t + 0.4} cor={COR.calmo} op={clamp01(k * 3)} r={8} />
    </g>; }}
    html={(Pp) => { const a = Pp(...CURUCA), b = Pp(-68.13, -16.5); return <>
      <Rotulo x={a[0]} y={a[1]} txt="RIO CURUÇÁ" sub="AMAZONAS" cor={COR.perigo} />
      <Rotulo x={b[0]} y={b[1]} txt="LA PAZ" sub={arg === '1' ? '≈ 1.300 KM' : 'BOLÍVIA'} cor={COR.calmo} op={K(lt, 0.8, 1.3)} />
    </>; }} />
);

export const MapaBR: React.FC<P> = ({lt, d, t, arg = 'alerta'}) => (
  <MapaAS lt={lt} d={d} lonC={-54} latC={-14} s0={26} s1={27.5} escuro={arg === 'apagado' ? 0.7 : 0.62}
    children={(Pp) => <g>
      <Pulso p={Pp(...CURUCA)} t={t} cor={COR.perigo} r={9} />
      {arg === 'apagado' && <g><Pulso p={Pp(-43.2, -22.9)} t={t} cor={COR.ouro} r={9} /></g>}
    </g>}
    html={(Pp) => arg === 'apagado' ? <><Rotulo x={Pp(-43.2, -22.9)[0]} y={Pp(-43.2, -22.9)[1]} txt="RIO DE JANEIRO" sub="CAPITAL · 1930" cor={COR.ouro} /><Rotulo x={Pp(...CURUCA)[0]} y={Pp(...CURUCA)[1]} txt="JAVARI" sub="NINGUÉM OLHAVA" cor={COR.perigo} op={K(lt, 1, 1.5)} /></> : null} />
);

// notícia viajando do Javari até Roma
export const Viagem: React.FC<P> = ({lt, d, t, arg = '0'}) => (
  <Mundo t={t} children={(Pp) => {
    const rota: [number, number][] = [CURUCA, [-69.9, -4.3], [-60, -3.1], [-50, -1], [-30, 10], [-10, 30], [5, 38], [12.45, 41.9]];
    const ini = arg === '2' ? 0.45 : 0; const fim = arg === '1' ? 0.45 : 1;
    const k = lerp(ini, fim, K(lt, 0.2, d * 0.9));
    const pts = rota.map((p) => Pp(p[0], p[1]));
    const dd = suave(pts);
    const n = (pts.length - 1) * k; const i = Math.min(pts.length - 2, Math.floor(n)); const f = n - i;
    const cx = lerp(pts[i][0], pts[i + 1][0], f), cy = lerp(pts[i][1], pts[i + 1][1], f);
    return <g>
      <Traco d={dd} k={k} cor={COR.ouro} w={4} L={1500} />
      <Pulso p={pts[0]} t={t} cor={COR.perigo} r={7} />
      <g transform={`translate(${cx},${cy})`}><rect x={-16} y={-11} width={32} height={22} rx={3} fill="#F2E8D0" stroke="#8A6A3A" strokeWidth={2} /><path d="M-16,-11 L0,2 L16,-11" fill="none" stroke="#8A6A3A" strokeWidth={2} /></g>
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={9} fill={COR.ouro} opacity={k > 0.95 ? 1 : 0.4} />
      <text x={pts[pts.length - 1][0] + 18} y={pts[pts.length - 1][1] - 14} fontFamily={F.titulo} fontWeight={700} fontSize={34} fill="#fff" opacity={K(lt, d * 0.6, d * 0.8)}>ROMA</text>
      <text x={pts[0][0] + 16} y={pts[0][1] + 40} fontFamily={F.titulo} fontWeight={700} fontSize={30} fill="#fff">CURUÇÁ</text>
    </g>;
  }} />
);

// página de jornal antigo
export const Jornal: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  const z = lerp(1, 1.05, lt / d);
  const destaque = K(lt, 0.4, 1.4);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, #2A2118, #0B0806 75%)', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 1180, height: 900, transform: `translateY(150px) scale(${z * 0.78}) rotate(-1.2deg)`, background: 'linear-gradient(180deg,#EFE4C8,#E2D3AE)', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', padding: '40px 60px', position: 'relative', overflow: 'hidden'}}>
        <div style={{fontFamily: 'Georgia, serif', fontSize: 76, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', color: '#1B1712', letterSpacing: 2, borderBottom: '4px double #1B1712', paddingBottom: 10}}>L'OSSERVATORE ROMANO</div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Georgia, serif', fontSize: 24, color: '#3A3226', margin: '10px 0 26px'}}><span>CITTÀ DEL VATICANO</span><span>MARZO 1931</span><span>ANNO LXXI</span></div>
        <div style={{display: 'flex', gap: 34}}>
          {[0, 1, 2].map((c) => (
            <div key={c} style={{flex: 1, position: 'relative'}}>
              {c === 1 && <div style={{fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 700, color: '#1B1712', lineHeight: 1.1, marginBottom: 14, position: 'relative'}}>
                <span style={{fontFamily: F.rotulo, fontSize: 22, letterSpacing: 4, color: '#8A2A1A', border: '3px solid #8A2A1A', padding: '4px 12px', display: 'inline-block', transform: 'rotate(-3deg)', opacity: destaque}}>O RELATO DO FREI</span></div>}
              {Array.from({length: c === 1 ? 22 : 27}, (_, i) => <div key={i} style={{height: 13, margin: '0 0 12px', background: c === 1 && i < 12 ? `linear-gradient(90deg, rgba(227,176,75,0.9) ${clamp01(destaque * 12 - i) * 100}%, rgba(46,39,31,0.28) 0)` : 'rgba(46,39,31,0.28)', width: `${78 + rnd(c * 40 + i) * 22}%`}} />)}
            </div>
          ))}
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 70, left: 0, right: 0, textAlign: 'center', fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: '#C9B899'}}>JORNAL OFICIAL DO VATICANO · {arg === '2' ? 'ACHADO EM 1995' : 'MARÇO DE 1931'}</div>
    </AbsoluteFill>
  );
};

// estante empoeirada com contador de anos
export const Estante: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  const ano = Math.round(lerp(1931, 1995, KS(lt, 0.3, d - 0.3)));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#1A120C,#0A0705)'}}>
      <SVG>
        {[220, 470, 720, 970].map((y, r) => <g key={r}>
          <rect x={160} y={y} width={1600} height={22} fill="#4A3020" />
          {Array.from({length: 30}, (_, i) => { const w = 34 + rnd(r * 30 + i) * 26; const h = 150 + rnd(r * 31 + i) * 70; const x = 180 + i * 52; return <rect key={i} x={x} y={y - h} width={w} height={h} fill={['#5A3A28', '#3E2A1E', '#6B4A2E', '#2E2A3A', '#4A2A22'][(i + r) % 5]} opacity={0.9} />; })}
        </g>)}
        {Array.from({length: 90}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={(rnd(i + 3) * 1080 + lt * 18) % 1080} r={1 + rnd(i + 5) * 2} fill="#E8D8B8" opacity={0.18} />)}
      </SVG>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(255,220,160,0.10), rgba(0,0,0,0.7) 70%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: F.titulo, fontWeight: 700, fontSize: 220, color: '#F2F4F8', textShadow: '0 0 40px rgba(227,176,75,0.55), 0 8px 24px rgba(0,0,0,0.8)'}}>{ano}</div>
      {arg !== '1' && <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: F.rotulo, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: '#C9B899', opacity: K(lt, d * 0.6, d * 0.8)}}>65 ANOS ESQUECIDO</div>}
    </AbsoluteFill>
  );
};

// ---------- CRISTO REDENTOR ----------
export const Cristo: React.FC<P> = ({lt, d, t, arg = 'fogo'}) => {
  const clarao = arg === 'clarao' ? Math.max(0, 1 - Math.abs(lt - d * 0.55) / 0.5) : 0;
  const k = K(lt, 0, d);
  const bx = lerp(1700, 1240, k), by = lerp(-80, 300, k);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <SVG>
        <defs><linearGradient id="ceC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C0505" /><stop offset="0.55" stopColor="#6A140C" /><stop offset="1" stopColor="#E0521F" /></linearGradient></defs>
        <rect width={1920} height={1080} fill="url(#ceC)" />
        {arg !== 'raio' && <BolaFogo id="cr" hx={bx} hy={by} ang={128} L={420} r={14} />}
        {arg === 'raio' && [0, 1, 2].map((i) => <circle key={i} cx={960} cy={520} r={150 + i * 170 + lt * 20} fill="none" stroke="#FFD08A" strokeOpacity={0.5 - i * 0.12} strokeWidth={4} strokeDasharray="14 12" />)}
        {/* morros */}
        <path d="M0,1080 L0,820 Q220,700 420,780 Q560,620 700,560 Q790,520 860,470 Q900,450 930,470 Q980,520 1060,600 Q1200,700 1400,760 Q1650,700 1920,800 L1920,1080 Z" fill="#140606" />
        <path d="M1380,1080 L1380,800 Q1460,560 1560,520 Q1620,500 1660,560 Q1760,760 1920,820 L1920,1080 Z" fill="#0C0303" />
        {/* Cristo no topo do Corcovado */}
        <g transform="translate(905,455)">
          <rect x={-14} y={-6} width={28} height={30} fill="#0A0202" />
          <path d="M-10,-6 L-12,-120 L12,-120 L10,-6 Z" fill="#0A0202" />
          <rect x={-120} y={-118} width={240} height={14} rx={6} fill="#0A0202" />
          <circle cx={0} cy={-134} r={13} fill="#0A0202" />
        </g>
        {/* luzes da cidade */}
        {Array.from({length: 160}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={880 + rnd(i + 2) * 200} r={1.6} fill="#FFD9A0" opacity={0.4 + 0.3 * Math.sin(t * 3 + i)} />)}
        {arg === 'vidro' && Array.from({length: 60}, (_, i) => { const a = rnd(i) * Math.PI * 2; const r = (lt * 260 + rnd(i + 1) * 200); return <path key={'v' + i} d={`M${960 + Math.cos(a) * r},${700 + Math.sin(a) * r * 0.5} l${8 + rnd(i) * 10},${-6} l${-4},${12} Z`} fill="#CFE6FF" opacity={0.7 * (1 - clamp01(lt / d))} />; })}
      </SVG>
      <AbsoluteFill style={{background: '#FFF2D6', opacity: clarao * 0.85, mixBlendMode: 'screen'}} />
      {arg === 'raio' && <div style={{position: 'absolute', bottom: 70, left: 0, right: 0, textAlign: 'center', fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: '#F2D9B8'}}>ESTIMATIVA · DEPENDE DA ALTURA E DO TAMANHO DA PEDRA</div>}
    </AbsoluteFill>
  );
};

// ---------- PASTA DO CASO ----------
const PROVAS = ['O CÉU VERMELHO', 'O PÓ QUE CAÍA', 'TRÊS EXPLOSÕES', 'O JORNAL DO VATICANO', 'O SISMÓGRAFO', 'A CRATERA?'];
export const Pasta: React.FC<P> = ({lt, d, t, arg = 'abre'}) => {
  const abre = arg === 'abre' ? KO(lt, 0.2, 1.4) : 1;
  const cheias = arg === 'contestada' ? 6 : arg === 'pergunta' ? 0 : 0;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #2B2219, #0B0806 75%)', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative', width: 1400, height: 840, transform: `perspective(1800px) rotateX(${lerp(55, 14, abre)}deg)`, transformOrigin: '50% 100%'}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(180deg,#C9A46A,#B08A52)', boxShadow: '0 40px 90px rgba(0,0,0,0.75)'}} />
        <div style={{position: 'absolute', top: -46, left: 60, width: 340, height: 70, borderRadius: '14px 14px 0 0', background: '#C9A46A'}} />
        <div style={{position: 'absolute', top: 40, left: 70, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 66, color: '#2A1D10', letterSpacing: 3}}>CASO CURUÇÁ</div>
          <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 30, color: '#4A3420', letterSpacing: 4, border: '3px solid #8A2A1A', padding: '6px 16px', transform: 'rotate(-4deg)'}}>13 · AGO · 1930</div>
        </div>
        <div style={{position: 'absolute', top: 170, left: 70, right: 70, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30}}>
          {PROVAS.map((p, i) => {
            const k = arg === 'abre' ? K(lt, 1.0 + i * 0.25, 1.4 + i * 0.25) : 1;
            const cheia = i < cheias;
            const contest = arg === 'contestada' && (i === 4 || i === 5);
            return (
              <div key={i} style={{height: 270, borderRadius: 12, background: cheia ? '#F3EADA' : 'rgba(60,40,20,0.18)', border: cheia ? 'none' : '3px dashed rgba(60,40,20,0.45)', opacity: k, transform: `translateY(${(1 - k) * 20}px) rotate(${(rnd(i) - 0.5) * 3}deg)`, position: 'relative', boxShadow: cheia ? '0 10px 24px rgba(0,0,0,0.35)' : 'none', padding: 22}}>
                <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 20, letterSpacing: 4, color: '#6A5034'}}>PROVA {i + 1}</div>
                <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 40, color: cheia ? '#22180E' : 'rgba(40,28,16,0.45)', marginTop: 12, lineHeight: 1.05}}>{cheia ? p : '?'}</div>
                {contest && <div style={{position: 'absolute', right: 18, bottom: 22, fontFamily: F.titulo, fontWeight: 700, fontSize: 34, color: '#B3261E', border: '4px solid #B3261E', padding: '2px 12px', transform: `rotate(-12deg) scale(${lerp(1.6, 1, KO(lt, 0.6 + (i - 4) * 0.4, 0.9 + (i - 4) * 0.4))})`, opacity: K(lt, 0.6 + (i - 4) * 0.4, 0.8 + (i - 4) * 0.4)}}>CONTESTADA</div>}
              </div>
            );
          })}
        </div>
      </div>
      {arg === 'pergunta' && <div style={{position: 'absolute', fontFamily: F.titulo, fontWeight: 700, fontSize: 420, color: 'rgba(255,255,255,0.08)', top: 200}}>?</div>}
    </AbsoluteFill>
  );
};

// ---------- O FREI ----------
export const Frei: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  const HY = 560;
  const x = arg === '1' ? lerp(300, 1500, lt / (d + 6)) : 860;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <SVG>
        <defs><linearGradient id="ceF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2E5C88" /><stop offset="0.7" stopColor="#8FB6CF" /><stop offset="1" stopColor="#E8D9B0" /></linearGradient>
          <linearGradient id="agF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7A6A48" /><stop offset="1" stopColor="#3A3020" /></linearGradient></defs>
        <rect width={1920} height={HY + 10} fill="url(#ceF)" />
        {[0, 1, 2].map((i) => <ellipse key={i} cx={(400 + i * 620 + lt * 10) % 2200} cy={140 + i * 60} rx={220} ry={34} fill="#fff" opacity={0.5} />)}
        <Copa y={HY - 60} cor="#3E6A3A" seed={41} r0={26} r1={54} passo={44} />
        <Copa y={HY - 10} cor="#264A28" seed={53} r0={20} r1={42} passo={40} />
        {[120, 1700].map((px, i) => <Palmeira key={i} x={px} y={HY} h={210} cor="#1E3A20" t={t} />)}
        <rect y={HY} width={1920} height={520} fill="url(#agF)" />
        {Array.from({length: 18}, (_, i) => <line key={i} x1={rnd(i) * 1920} y1={HY + 40 + i * 26} x2={rnd(i) * 1920 + 160} y2={HY + 40 + i * 26} stroke="#E8D9B0" strokeOpacity={0.15} strokeWidth={2} />)}
        {/* canoa com o frei */}
        <g transform={`translate(${x},${HY + 250 + Math.sin(t * 1.5) * 4}) scale(1.6)`}>
          <path d="M-150,-6 Q-70,16 0,16 Q70,16 150,-6 L140,-16 Q0,0 -140,-16 Z" fill="#5A3A22" />
          {/* frei: hábito marrom com capuz e cordão */}
          <path d="M-46,-8 Q-56,-60 -36,-92 L-10,-92 Q8,-60 0,-8 Z" fill="#6B4A2E" />
          <path d="M-40,-48 L-4,-48" stroke="#E8D9B0" strokeWidth={3} />
          <circle cx={-23} cy={-104} r={14} fill="#E0B48C" />
          <path d="M-40,-104 Q-23,-128 -6,-104" fill="#6B4A2E" />
          <ellipse cx={-23} cy={-116} rx={28} ry={6} fill="#D9BC7A" />
          <path d="M-36,-121 Q-23,-140 -10,-121 Z" fill="#D9BC7A" />
          {/* caderno no colo */}
          <rect x={-30} y={-40} width={30} height={22} fill="#F3EADA" stroke="#3A2A1A" strokeWidth={2} transform="rotate(-10,-15,-29)" />
          {/* remador */}
          <path d="M58,-8 Q50,-50 66,-76 L86,-76 Q98,-50 92,-8 Z" fill="#2E4A6A" />
          <circle cx={76} cy={-88} r={13} fill="#8C5B3E" />
          <line x1={84} y1={-50} x2={128} y2={20} stroke="#3A2A1A" strokeWidth={5} strokeLinecap="round" />
        </g>
      </SVG>
      {arg === '2' && <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, rgba(255,200,120,0.35), transparent 40%)'}} />}
    </AbsoluteFill>
  );
};

// ---------- SATÉLITE: imagem em falsa cor com o círculo ----------
export const Satelite: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  const circ = arg === 'circulo' ? K(lt, 0.3, 1.2) : 0;
  const z = lerp(1, 1.06, lt / d);
  return (
    <AbsoluteFill style={{background: '#020A06', overflow: 'hidden'}}>
      <SVG style={{transform: `scale(${z})`}}>
        <defs><filter id="ruido"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={4} seed={7} /><feColorMatrix values="0 0 0 0 0.10  0 0 0 0 0.45  0 0 0 0 0.20  0 0 0 0.9 0" /></filter>
          <filter id="ruido2"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={3} /><feColorMatrix values="0 0 0 0 0.05  0 0 0 0 0.25  0 0 0 0 0.12  0 0 0 0.6 0" /></filter></defs>
        <rect width={1920} height={1080} fill="#0E3A1C" />
        <rect width={1920} height={1080} filter="url(#ruido)" />
        <rect width={1920} height={1080} filter="url(#ruido2)" />
        <path d="M-40,300 C300,420 420,180 700,320 S1100,640 1400,520 S1800,420 1980,560" fill="none" stroke="#6FA9C8" strokeWidth={22} opacity={0.75} />
        <path d="M-40,300 C300,420 420,180 700,320 S1100,640 1400,520 S1800,420 1980,560" fill="none" stroke="#B8E1F0" strokeWidth={6} opacity={0.5} />
        <circle cx={1060} cy={760} r={118} fill="#1F5A2E" stroke="#0A2A14" strokeWidth={10} opacity={0.9} />
        {circ > 0 && <g opacity={circ}><circle cx={1060} cy={760} r={150} fill="none" stroke={COR.ouro} strokeWidth={6} strokeDasharray="22 14" /><line x1={1060} y1={600} x2={1060} y2={920} stroke={COR.ouro} strokeWidth={2} opacity={0.6} /><line x1={900} y1={760} x2={1220} y2={760} stroke={COR.ouro} strokeWidth={2} opacity={0.6} /></g>}
        {/* varredura */}
        <rect x={0} y={((lt * 260) % 1300) - 110} width={1920} height={6} fill="#9FE8B0" opacity={0.25} />
      </SVG>
      <div style={{position: 'absolute', left: 60, bottom: 50, fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: '#BFE8C8'}}>LANDSAT · INFRAVERMELHO · RIO CURUÇÁ</div>
      {circ > 0 && <div style={{position: 'absolute', left: 1240, top: 730, fontFamily: F.titulo, fontWeight: 700, fontSize: 40, color: '#fff', opacity: circ, textShadow: '0 4px 12px #000'}}>≈ 1 KM</div>}
    </AbsoluteFill>
  );
};

// ---------- SÃO PAULO com a área de Tunguska por cima ----------
export const MapaSP: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  const k = arg === 'tunguska' ? K(lt, 0.3, 1.6) : 0;
  return (
    <MapaAS lt={lt} d={d} lonC={-46.6} latC={-23.6} s0={arg === 'tunguska' ? 820 : 260} s1={arg === 'tunguska' ? 860 : 275} escuro={0.45}
      children={(Pp) => { const c = Pp(-46.63, -23.55); const raio = (Math.sqrt(2150 / Math.PI) / 111) * (arg === 'tunguska' ? 840 : 268); return <g>
        {arg !== 'tunguska' && <Pulso p={c} t={t} cor={COR.perigo} r={9} />}
        {k > 0 && <g><circle cx={c[0]} cy={c[1]} r={raio * k} fill={COR.perigo} opacity={0.32} /><circle cx={c[0]} cy={c[1]} r={raio * k} fill="none" stroke={COR.perigo} strokeWidth={5} /></g>}
        {k > 0 && Array.from({length: 36}, (_, i) => { const a = (i / 36) * Math.PI * 2; const r1 = raio * 0.2 * k, r2 = raio * 0.92 * k; return <line key={i} x1={c[0] + Math.cos(a) * r1} y1={c[1] + Math.sin(a) * r1} x2={c[0] + Math.cos(a) * r2} y2={c[1] + Math.sin(a) * r2} stroke="#FFD08A" strokeOpacity={0.35} strokeWidth={2} />; })}
      </g>; }}
      html={(Pp) => { const c = Pp(-46.63, -23.55); return arg === 'tunguska'
        ? <Rotulo x={c[0] + 330} y={c[1] + 300} txt="ÁREA DE TUNGUSKA" sub="2.150 KM² · ≈ 1,4 × A CIDADE" cor={COR.perigo} op={K(lt, 1.2, 1.7)} />
        : <Rotulo x={c[0]} y={c[1]} txt="SÃO PAULO" cor={COR.perigo} />; }} />
  );
};
