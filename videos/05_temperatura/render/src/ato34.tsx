/* ATO 3 (fora da Terra) + ATO 4 (as portas que nós construímos) + FECHO */
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {geoOrthographic, geoPath, geoEquirectangular} from 'd3-geo';
import {F} from './theme';
import {lerp, rnd, clamp01, prog, KO, KS, es, FR, QU, Numero} from './base';
import {Pessoa, VOCE, CIENTISTA, CIENTISTA2, Visual} from './personagens';
import {mundo, brasil} from './geo';

const SVG: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0, overflow: 'visible'}}>{children}</svg>;
const Fundo: React.FC<{dim?: number; lt?: number}> = ({dim = 1, lt = 0}) => <Img src={staticFile('espaco.jpg')} style={{position: 'absolute', width: 1920, height: 1080, opacity: dim, transform: `scale(${1.06 + lt * 0.006})`}} />;

// ---------- Porta 12: nitrogênio líquido ----------
export const Nitrogenio: React.FC<{lt: number; t: number; modo: 'bacia' | 'mao' | 'gota'}> = ({lt, t, modo}) => {
  if (modo === 'gota') {
    const x = 960 + Math.sin(t * 5) * 160, y = 600 - Math.abs(Math.sin(t * 7)) * 30;
    return (
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #2A1A10, #070403 75%)'}}>
        <SVG>
          <ellipse cx={960} cy={700} rx={520} ry={130} fill="#2A2A2E" /><ellipse cx={960} cy={680} rx={480} ry={110} fill="#3A3A40" />
          <rect x={1440} y={660} width={360} height={36} rx={18} fill="#1E1E22" />
          <ellipse cx={960} cy={690} rx={420} ry={90} fill="#FF7A2F" opacity={0.12} />
          <ellipse cx={x} cy={y} rx={34} ry={24} fill="#9FD8FF" /><ellipse cx={x - 8} cy={y - 8} rx={10} ry={6} fill="#fff" opacity={0.8} />
          <ellipse cx={x} cy={y + 30} rx={44} ry={8} fill="#fff" opacity={0.35} />
          {Array.from({length: 5}, (_, i) => <path key={i} d={`M${x - 30 + i * 15},${y - 30} q6,-20 0,-40`} stroke="#fff" strokeWidth={3} opacity={0.3} fill="none" />)}
        </SVG>
      </AbsoluteFill>
    );
  }
  const mao = modo === 'mao';
  const mx = mao ? lerp(-300, 2200, KS(lt, 0.3, 2.4)) : -500;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#24303C 0%,#3A4A58 60%,#2A3440 100%)'}}>
      <SVG>
        <defs><filter id="nevoaB"><feGaussianBlur stdDeviation="16" /></filter></defs>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={140 + i * 430} y={120} width={300} height={260} rx={8} fill="#1C2630" stroke="#46566A" strokeWidth={4} />)}
        {[0, 1, 2, 3].map((i) => [0, 1, 2].map((j) => <rect key={`${i}${j}`} x={170 + i * 430 + j * 85} y={180 + (j % 2) * 30} width={50} height={150 - (j % 2) * 30} rx={10} fill={['#3E8EDE', '#3DDBB4', '#E3B04B'][(i + j) % 3]} opacity={0.5} />))}
        <rect y={700} width={1920} height={380} fill="#56626E" /><rect y={700} width={1920} height={18} fill="#7A8794" />
        <g transform="translate(960,720)">
          <ellipse cx={0} cy={0} rx={460} ry={90} fill="#5A6672" />
          <path d="M-460,0 L-400,260 L400,260 L460,0 Z" fill="#6E7B87" />
          <ellipse cx={0} cy={0} rx={440} ry={80} fill="#BFE6FF" />
          {/* névoa que transborda e escorre pela borda */}
          <g filter="url(#nevoaB)">{Array.from({length: 16}, (_, i) => { const k = (t * 0.25 + rnd(i)) % 1; const lado = rnd(i + 9) < 0.5 ? -1 : 1; return <ellipse key={i} cx={lado * (300 + k * 260) + (rnd(i + 3) - 0.5) * 300} cy={-40 + k * k * 300} rx={140 + 90 * k} ry={46 + 30 * k} fill="#fff" opacity={0.55 * (1 - k)} />; })}
          {Array.from({length: 8}, (_, i) => <ellipse key={'s' + i} cx={-300 + i * 86 + Math.sin(t + i) * 20} cy={-40 - ((t * 30 + i * 20) % 80)} rx={110} ry={34} fill="#fff" opacity={0.4} />)}</g>
        </g>
        {mao && <g transform={`translate(${mx},640) rotate(-90)`}>
          <path d="M-46,-300 L-46,0 Q-46,40 -10,46 L30,46 Q60,40 60,0 L60,-300 Z" fill="#B9805C" />
          {[-30, -6, 18, 42].map((x) => <rect key={x} x={x - 9} y={20} width={18} height={60} rx={9} fill="#B9805C" />)}
          <path d="M-70,-300 L-70,40 Q-70,110 0,110 Q84,110 84,40 L84,-300" stroke="#fff" strokeWidth={10} fill="none" opacity={0.55} />
        </g>}
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- Porta 13: você no espaço (sem traje) ----------
export const EspacoPessoa: React.FC<{lt: number; t: number; apaga?: number}> = ({lt, t, apaga = 0}) => {
  const proj = geoOrthographic().rotate([50, 15]).scale(900).translate([1500, 1500]).clipAngle(90);
  const path = geoPath(proj);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Fundo lt={lt} />
      <SVG>
        <circle cx={1500} cy={1500} r={940} fill="#7CC4FF" opacity={0.18} />
        <circle cx={1500} cy={1500} r={900} fill="#123E6E" />
        {mundo.map((f: any, i: number) => <path key={i} d={path(f) || ''} fill="#4F7A43" />)}
        <g transform={`translate(760,${640 + Math.sin(t * 0.8) * 14}) rotate(${-12 + Math.sin(t * 0.5) * 4}) scale(1.05)`}>
          <Pessoa v={VOCE} expr={apaga > 0.5 ? 'fechado' : 'susto'} t={t} bE={[70 + Math.sin(t) * 8, 30]} bD={[60 - Math.sin(t) * 8, 20]} />
        </g>
      </SVG>
      <AbsoluteFill style={{background: '#000', opacity: apaga * 0.55}} />
    </AbsoluteFill>
  );
};
export const Garrafa: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #121A2C, #05070D 75%)'}}>
    <SVG>
      <g transform="translate(960,560)">
        <rect x={-190} y={-380} width={380} height={760} rx={60} fill="#8C98A6" />
        <rect x={-150} y={-340} width={300} height={700} rx={44} fill="#06080F" />
        <rect x={-120} y={-310} width={240} height={640} rx={34} fill="#C2CCD6" />
        <rect x={-100} y={-180} width={200} height={490} rx={24} fill="#FF8A3A" opacity={0.85} />
        {Array.from({length: 18}, (_, i) => <circle key={i} cx={-60 + rnd(i) * 120 + Math.sin(t * 3 + i) * 10} cy={-150 + rnd(i + 3) * 440} r={6} fill="#FFD9A0" opacity={0.7} />)}
        <rect x={-120} y={-460} width={240} height={90} rx={20} fill="#5A6470" />
        {/* setas do calor batendo no vácuo e voltando */}
        {[-1, 1].map((s) => [0, 1, 2].map((j) => <path key={`${s}${j}`} d={`M${s * 128},${-120 + j * 160} l${s * 14},-12 l0,24 Z`} fill="#FFB547" opacity={0.5 + 0.5 * Math.sin(t * 4 + j)} />))}
      </g>
    </SVG>
    <div style={{position: 'absolute', left: 1240, top: 470, padding: '10px 20px', borderRadius: 10, background: 'rgba(6,10,20,0.88)', borderLeft: `5px solid ${FR.gelo}`, fontFamily: F.titulo, fontWeight: 700, fontSize: 44, color: '#fff', opacity: KO(lt, 0.5, 0.9)}}>← VÁCUO</div>
  </AbsoluteFill>
);

// ---------- Porta 13: radiação cósmica de fundo ----------
export const CMB: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: '#030308'}}>
    <SVG>
      <defs>
        <filter id="cmbT"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={4} seed={7} /><feColorMatrix values="1.4 0 0 0 0.1  0.6 0 0 0 0  0 0 0 0 0.25  0 0 0 0 1" /></filter>
        <clipPath id="moll"><ellipse cx={960} cy={560} rx={820} ry={410} /></clipPath>
      </defs>
      <g clipPath="url(#moll)"><rect x={100} y={100} width={1720} height={900} filter="url(#cmbT)" opacity={lerp(0.4, 0.95, KS(lt, 0.2, 1.4))} /></g>
      <ellipse cx={960} cy={560} rx={820} ry={410} fill="none" stroke="#fff" strokeOpacity={0.3} strokeWidth={3} />
    </SVG>
  </AbsoluteFill>
);

// ---------- Porta 14: o raio ----------
export const Raio: React.FC<{lt: number; t: number; modo: 'cidade' | 'canal'}> = ({lt, t, modo}) => {
  const clarao = lt > 0.6 && lt < 0.75 ? 1 : lt > 0.75 && lt < 0.85 ? 0 : lt > 0.85 && lt < 1.0 ? 0.8 : Math.max(0, 0.4 - (lt - 1) * 0.4);
  const bolt = (x: number, seed: number, w: number) => { let px = x, py = -20; let d = `M${px},${py}`; for (let i = 0; i < 14; i++) { px += (rnd(seed + i) - 0.5) * 120; py += 50 + rnd(seed + i + 50) * 20; d += ` L${px},${py}`; } return <><path d={d} stroke="#9FD0FF" strokeWidth={w * 4} fill="none" opacity={0.4} filter="url(#rbl)" /><path d={d} stroke="#fff" strokeWidth={w} fill="none" /></>; };
  if (modo === 'canal') {
    return (
      <AbsoluteFill style={{background: 'linear-gradient(90deg,#0A0E1C,#1A2140 50%,#0A0E1C)'}}>
        <SVG>
          <defs><filter id="rbl"><feGaussianBlur stdDeviation="22" /></filter><linearGradient id="canal" x1="0" x2="1"><stop offset="0%" stopColor="#9FD0FF" stopOpacity={0} /><stop offset="40%" stopColor="#E8F4FF" /><stop offset="60%" stopColor="#E8F4FF" /><stop offset="100%" stopColor="#9FD0FF" stopOpacity={0} /></linearGradient></defs>
          <rect x={880} y={0} width={160} height={1080} fill="#9FD0FF" opacity={0.4} filter="url(#rbl)" />
          <rect x={930} y={0} width={60} height={1080} fill="url(#canal)" />
          {/* dedo como escala */}
          <g transform="translate(1260,560)"><rect x={-30} y={-150} width={60} height={300} rx={30} fill="#B9805C" /><rect x={-24} y={-150} width={48} height={60} rx={20} fill="#E8C7B0" opacity={0.6} /></g>
        </SVG>
        <div style={{position: 'absolute', left: 1320, top: 520, fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: '#C3CAD8'}}>~ A GROSSURA DE UM DEDO</div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#0B0F1E 0%,#1B2236 70%)'}}>
      <SVG>
        <defs><filter id="rbl"><feGaussianBlur stdDeviation="12" /></filter></defs>
        {Array.from({length: 6}, (_, i) => <ellipse key={i} cx={i * 380 + 100} cy={130 + (i % 2) * 40} rx={360} ry={110} fill="#2A3048" />)}
        {lt > 0.6 && clarao > 0 && bolt(1100, 3, 6)}
        {/* cidade */}
        {Array.from({length: 22}, (_, i) => { const h = 120 + rnd(i) * 330; const x = i * 90 - 10; return <g key={i}><rect x={x} y={1080 - h} width={86} height={h} fill="#0C111F" />{Array.from({length: Math.floor(h / 40)}, (_, j) => rnd(i * 13 + j) > 0.5 && <rect key={j} x={x + 14 + (j % 2) * 34} y={1080 - h + 16 + j * 36} width={18} height={14} fill="#FFD98A" opacity={0.7} />)}</g>; })}
        {Array.from({length: 120}, (_, i) => <line key={'c' + i} x1={(rnd(i) * 1920 + t * 300) % 1920} y1={(rnd(i + 3) * 1080 + t * 1400) % 1080} x2={(rnd(i) * 1920 + t * 300) % 1920 - 8} y2={(rnd(i + 3) * 1080 + t * 1400) % 1080 + 34} stroke="#9AB" strokeWidth={1.5} opacity={0.35} />)}
      </SVG>
      <AbsoluteFill style={{background: '#DDEBFF', opacity: clarao * 0.55, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

// ---------- Porta 15: Sol em corte (superfície → núcleo) ----------
export const SolCorte: React.FC<{lt: number; t: number; mergulho: number}> = ({lt, t, mergulho}) => {
  const r = lerp(380, 2600, es(mergulho));
  const cy = lerp(560, 560 + 900 * es(mergulho), 1) - 0;
  return (
    <AbsoluteFill style={{background: '#080201'}}>
      <SVG>
        <defs>
          <radialGradient id="camadas"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="22%" stopColor="#FFF0B0" /><stop offset="45%" stopColor="#FFB547" /><stop offset="75%" stopColor="#FF6A1A" /><stop offset="100%" stopColor="#B3300C" /></radialGradient>
          <filter id="gran"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={3} seed={Math.floor(t * 4) % 20} /><feColorMatrix values="0 0 0 0 1  0 0 0 0 0.45  0 0 0 0 0.05  0 0 0 0.6 0" /></filter>
          <clipPath id="solC"><circle cx={960} cy={560} r={r} /></clipPath>
        </defs>
        <circle cx={960} cy={560} r={r * 1.4} fill="#FF7A1A" opacity={0.18} />
        <circle cx={960} cy={560} r={r} fill="url(#camadas)" />
        <rect x={960 - r} y={560 - r} width={2 * r} height={2 * r} filter="url(#gran)" clipPath="url(#solC)" opacity={0.6} />
        {/* fatia recortada mostrando camadas */}
        <path d={`M960,560 L${960 + r},560 A${r},${r} 0 0 0 960,${560 - r} Z`} fill="#2A0A04" opacity={0.0 + 0.85 * KS(lt, 0.3, 1.0)} />
        {[1, 0.7, 0.45, 0.22].map((k, i) => <path key={i} d={`M960,560 L${960 + r * k},560 A${r * k},${r * k} 0 0 0 960,${560 - r * k} Z`} fill={['#FF6A1A', '#FF9A30', '#FFD070', '#FFFFFF'][i]} opacity={KS(lt, 0.3 + i * 0.2, 0.8 + i * 0.2)} />)}
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- Porta 16: Nebulosa do Bumerangue ----------
export const Nebulosa: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: '#020208'}}>
    <Fundo dim={0.7} lt={lt} />
    <SVG>
      <defs>
        <radialGradient id="lobo"><stop offset="0%" stopColor="#E8F2FF" stopOpacity={0.85} /><stop offset="45%" stopColor="#7FA8E8" stopOpacity={0.45} /><stop offset="100%" stopColor="#2A3A8A" stopOpacity={0} /></radialGradient>
        <filter id="nebB"><feGaussianBlur stdDeviation="18" /></filter>
        <filter id="nebT"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={4} seed={3} /><feColorMatrix values="0 0 0 0 0.75  0 0 0 0 0.85  0 0 0 0 1  0 0 0 0.9 -0.25" /></filter>
        <mask id="nebM"><g filter="url(#nebB)"><ellipse cx={600} cy={500} rx={420} ry={210} fill="#fff" transform="rotate(-18 960 540)" /><ellipse cx={1320} cy={580} rx={420} ry={210} fill="#fff" transform="rotate(-18 960 540)" /></g></mask>
      </defs>
      <g transform={`translate(960,540) scale(${lerp(1, 1.08, es(lt / 5))}) translate(-960,-540)`}>
        <g filter="url(#nebB)"><ellipse cx={600} cy={500} rx={400} ry={190} fill="url(#lobo)" transform="rotate(-18 960 540)" /><ellipse cx={1320} cy={580} rx={400} ry={190} fill="url(#lobo)" transform="rotate(-18 960 540)" /></g>
        <rect width={1920} height={1080} filter="url(#nebT)" mask="url(#nebM)" />
        <circle cx={960} cy={540} r={18} fill="#FFF6E0" /><circle cx={960} cy={540} r={60} fill="#FFE9B0" opacity={0.3} />
        {/* gás saindo */}
        {Array.from({length: 30}, (_, i) => { const a = (rnd(i) - 0.5) * 0.7 + (i % 2 ? Math.PI : 0) - 0.31; const k = (t * 0.15 + rnd(i + 4)) % 1; return <circle key={i} cx={960 + Math.cos(a) * k * 600} cy={540 + Math.sin(a) * k * 600} r={3} fill="#DDEBFF" opacity={0.7 * (1 - k)} />; })}
      </g>
    </SVG>
  </AbsoluteFill>
);
export const Spray: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #1C2430, #05070D 75%)'}}>
    <SVG>
      <g transform="translate(700,600) rotate(-10)">
        <rect x={-90} y={-160} width={180} height={420} rx={30} fill="#3E8EDE" /><rect x={-90} y={-60} width={180} height={120} fill="#E8F2FF" opacity={0.9} />
        <rect x={-40} y={-220} width={80} height={60} rx={10} fill="#C9D2DA" /><rect x={-14} y={-250} width={60} height={34} rx={8} fill="#7F8E96" />
        {/* gelo na lata */}
        {Array.from({length: 22}, (_, i) => <circle key={i} cx={-80 + rnd(i) * 160} cy={-150 + rnd(i + 3) * 400} r={3 + rnd(i + 5) * 6} fill="#fff" opacity={KS(lt, 0.4, 1.6) * 0.8} />)}
      </g>
      {Array.from({length: 40}, (_, i) => { const k = (t * 0.8 + rnd(i)) % 1; return <circle key={i} cx={760 + k * 800} cy={340 - k * 140 + (rnd(i + 2) - 0.5) * 220 * k} r={4 + k * 22} fill="#E8F2FF" opacity={0.45 * (1 - k)} />; })}
    </SVG>
  </AbsoluteFill>
);

// ---------- Porta 17: torre de queda livre de Bremen ----------
export const Torre: React.FC<{lt: number; t: number; queda: number; nuvem?: number}> = ({lt, t, queda, nuvem = 0}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg,#8EB4D4 0%,#D9E6EF 70%,#7F8C74 70%,#6C7A60 100%)'}}>
    <SVG>
      {Array.from({length: 5}, (_, i) => <ellipse key={i} cx={(i * 450 + t * 12) % 2200 - 100} cy={150 + (i % 2) * 70} rx={170} ry={40} fill="#fff" opacity={0.7} />)}
      {/* torre */}
      <g transform="translate(960,900) scale(1.08)">
        <path d="M-70,0 L-55,-680 L55,-680 L70,0 Z" fill="#C9CCCF" />
        <path d="M0,0 L0,-680 L55,-680 L70,0 Z" fill="#AEB2B6" />
        <path d="M-110,-680 L110,-680 L90,-740 L-90,-740 Z" fill="#D8DBDE" />
        <rect x={-130} y={-760} width={260} height={30} rx={8} fill="#B8BCC0" />
        {/* corte mostrando a cápsula caindo */}
        <rect x={-30} y={-660} width={60} height={640} fill="#1C232E" opacity={0.85} />
        <g transform={`translate(0,${lerp(-630, -60, queda)})`}><rect x={-22} y={-36} width={44} height={72} rx={10} fill="#E8A33A" /><circle cx={0} cy={0} r={6} fill="#7CC4FF" opacity={0.6 + 0.4 * Math.sin(t * 8)} /></g>
        <rect x={-260} y={-60} width={180} height={60} fill="#9AA0A6" /><rect x={90} y={-90} width={240} height={90} fill="#A9AFB5" />
      </g>
    </SVG>
    {nuvem > 0 && <AbsoluteFill style={{opacity: nuvem}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #0A1424, #02040A 70%)'}} />
      <SVG>
        <defs><radialGradient id="atomos"><stop offset="0%" stopColor="#E8F6FF" /><stop offset="60%" stopColor="#7CC4FF" stopOpacity={0.6} /><stop offset="100%" stopColor="#3E8EDE" stopOpacity={0} /></radialGradient></defs>
        <circle cx={960} cy={540} r={260} fill="url(#atomos)" />
        {Array.from({length: 120}, (_, i) => { const a = rnd(i) * Math.PI * 2, rr = Math.sqrt(rnd(i + 3)) * 220; return <circle key={i} cx={960 + Math.cos(a) * rr + Math.sin(t * 0.3 + i) * 2} cy={540 + Math.sin(a) * rr} r={4} fill="#fff" opacity={0.8} />; })}
      </SVG>
    </AbsoluteFill>}
  </AbsoluteFill>
);

// ---------- Porta 17: zoom na régua perto do zero ----------
export const ReguaZero: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const k = KS(lt, 0.3, 2.6);
  // escala log: 0.00000000004 K ... 3 K
  const X = (logK: number) => lerp(260, 1660, (logK + 11) / 11.5);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #0B1628, #02040A 75%)'}}>
      <SVG>
        <line x1={200} x2={1720} y1={560} y2={560} stroke="#3A4A66" strokeWidth={6} />
        {Array.from({length: 12}, (_, i) => <line key={i} x1={X(-11 + i)} x2={X(-11 + i)} y1={540} y2={580} stroke="#5A6A86" strokeWidth={3} />)}
        <circle cx={X(Math.log10(2.7))} cy={560} r={20} fill={FR.azul} />
        <text x={X(Math.log10(2.7))} y={500} textAnchor="middle" fill="#DDEBFF" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 42}}>ESPAÇO · 2,7 K</text>
        <circle cx={X(Math.log10(38e-12))} cy={560} r={20} fill="#fff" opacity={k} />
        <text x={X(Math.log10(38e-12))} y={640} textAnchor="middle" fill="#fff" opacity={k} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 42}}>BREMEN</text>
        <path d={`M${X(Math.log10(2.7))},600 Q960,${800} ${X(Math.log10(38e-12))},600`} stroke="#E3B04B" strokeWidth={4} fill="none" strokeDasharray="12 10" opacity={k} />
        <text x={960} y={790} textAnchor="middle" fill="#E3B04B" opacity={KO(lt, 1.6, 2.0)} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 64}}>× 70 BILHÕES</text>
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- Porta 17: Estação Espacial ----------
export const ISS: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const proj = geoOrthographic().rotate([30 - lt * 2, -10]).scale(1400).translate([960, 1900]).clipAngle(90);
  const path = geoPath(proj);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Fundo lt={lt} />
      <SVG>
        <circle cx={960} cy={1900} r={1440} fill="#7CC4FF" opacity={0.2} />
        <circle cx={960} cy={1900} r={1400} fill="#123E6E" />
        {mundo.map((f: any, i: number) => <path key={i} d={path(f) || ''} fill="#4F7A43" />)}
        <g transform={`translate(${lerp(820, 1100, lt / 5)},360) rotate(-6)`}>
          <rect x={-300} y={-6} width={600} height={12} fill="#B8BEC6" />
          {[-280, -200, 200, 280].map((x) => <rect key={x} x={x - 30} y={-110} width={60} height={220} fill="#2A4A8A" stroke="#7FA0D8" strokeWidth={2} />)}
          <rect x={-90} y={-24} width={180} height={48} rx={10} fill="#E8ECEF" /><rect x={-30} y={-40} width={60} height={80} rx={8} fill="#D8DDE2" />
          <circle cx={0} cy={0} r={10} fill="#7CC4FF" opacity={0.6 + 0.4 * Math.sin(t * 5)} />
        </g>
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- Porta 17: o zero que nunca chega ----------
export const Assintota: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const k = KS(lt, 0.2, 3.0);
  const pts = Array.from({length: 200}, (_, i) => { const x = i / 199; return `${200 + x * 1500 * k},${300 + 500 * (1 - Math.exp(-x * 5))}`; }).join(' ');
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #0B1628, #02040A 75%)'}}>
      <SVG>
        <line x1={150} x2={1800} y1={810} y2={810} stroke={FR.azul} strokeWidth={4} strokeDasharray="16 12" />
        <text x={1790} y={860} textAnchor="end" fill="#9FD8FF" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 44}}>ZERO ABSOLUTO · −273,15 °C</text>
        <polyline points={pts} fill="none" stroke="#fff" strokeWidth={6} />
        <circle cx={200 + 1500 * k} cy={300 + 500 * (1 - Math.exp(-5))} r={12} fill="#fff" />
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- Porta 18: tokamak (KSTAR) ----------
export const Tokamak: React.FC<{lt: number; t: number; campo?: number}> = ({lt, t, campo = 0}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #1A1030, #04030A 75%)'}}>
    <SVG>
      <defs><radialGradient id="plas"><stop offset="60%" stopColor="#FF5ACD" stopOpacity={0} /><stop offset="80%" stopColor="#FF8AE0" stopOpacity={0.9} /><stop offset="100%" stopColor="#FF5ACD" stopOpacity={0} /></radialGradient><filter id="plB"><feGaussianBlur stdDeviation="10" /></filter></defs>
      <g transform="translate(960,580)">
        <ellipse cx={0} cy={0} rx={640} ry={260} fill="#3A3F4A" />
        <ellipse cx={0} cy={0} rx={600} ry={232} fill="#22262E" />
        <ellipse cx={0} cy={0} rx={300} ry={110} fill="#4A505C" />
        {/* plasma */}
        <ellipse cx={0} cy={0} rx={450} ry={170} fill="none" stroke="#FF8AE0" strokeWidth={70} opacity={0.5} filter="url(#plB)" />
        <ellipse cx={0} cy={0} rx={450} ry={170} fill="none" stroke="#FFD6F4" strokeWidth={16} opacity={0.9} strokeDasharray="60 30" strokeDashoffset={-t * 400} />
        {/* bobinas */}
        {Array.from({length: 16}, (_, i) => { const a = (i / 16) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * 450} cy={Math.sin(a) * 170} rx={30} ry={120} fill="none" stroke="#C9A65A" strokeWidth={14} opacity={Math.sin(a) > 0 ? 1 : 0.5} />; })}
        {/* campo magnético segurando o plasma longe da parede */}
        {campo > 0 && [0.82, 1.18].map((s, i) => <ellipse key={i} cx={0} cy={0} rx={450 * s} ry={170 * s} fill="none" stroke="#7CC4FF" strokeWidth={4} strokeDasharray="10 12" strokeDashoffset={t * 80 * (i ? 1 : -1)} opacity={campo} />)}
      </g>
    </SVG>
  </AbsoluteFill>
);

// ---------- Porta 19: LHC (mapa / túnel / colisão / sala de controle) ----------
export const LHC: React.FC<{lt: number; t: number; modo: 'mapa' | 'tunel' | 'colisao' | 'sala'}> = ({lt, t, modo}) => {
  if (modo === 'mapa') {
    const proj = geoEquirectangular().center([6.05, 46.25]).scale(260000).translate([960, 540]);
    const path = geoPath(proj);
    const [cx, cy] = proj([6.05, 46.25]) as [number, number];
    const r = 8.6 / 2 / 111 * 26000 * Math.PI / 180 * 1.0 * 100 / 1.0; // ~ raio do anel (4,3 km) em px
    const rp = (4.3 / 111) * (260000 * Math.PI / 180);
    return (
      <AbsoluteFill style={{background: '#2E4A2E'}}>
        <SVG>
          {mundo.map((f: any, i: number) => <path key={i} d={path(f) || ''} fill={f.id === '756' ? '#5E7A55' : '#6E8A5E'} stroke="#E3B04B" strokeWidth={4} strokeOpacity={0.8} />)}
          <circle cx={cx} cy={cy} r={rp} fill="none" stroke="#FF5A5A" strokeWidth={10} strokeDasharray={`${2 * Math.PI * rp * KS(lt, 0.2, 1.6)} 99999`} />
        </SVG>
        <div style={{position: 'absolute', left: cx - rp - 30, top: cy, transform: 'translate(-100%,-50%)', padding: '8px 16px', borderRadius: 8, background: 'rgba(6,10,20,0.85)', borderLeft: '4px solid #E3B04B', fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: '#fff'}}>FRANÇA</div>
        <div style={{position: 'absolute', left: cx + rp + 30, top: cy - 200, padding: '8px 16px', borderRadius: 8, background: 'rgba(6,10,20,0.85)', borderLeft: '4px solid #E3B04B', fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 3, color: '#fff'}}>SUÍÇA</div>
        <div style={{position: 'absolute', left: cx, top: cy + rp + 40, transform: 'translateX(-50%)', padding: '8px 16px', borderRadius: 8, background: 'rgba(6,10,20,0.85)', borderLeft: '4px solid #FF5A5A', fontFamily: F.titulo, fontWeight: 700, fontSize: 44, color: '#fff', opacity: KO(lt, 1.2, 1.6)}}>27 KM</div>
      </AbsoluteFill>
    );
  }
  if (modo === 'sala') {
    return (
      <AbsoluteFill style={{background: '#1A2230'}}>
        <SVG>
          {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${220 + i * 330},300)`}><rect x={0} y={0} width={300} height={190} rx={10} fill="#0A1018" stroke="#3A4A60" strokeWidth={4} /><polyline points={Array.from({length: 20}, (_, j) => `${15 + j * 14},${120 - Math.abs(Math.sin(j * 0.7 + i + t * 2)) * 70}`).join(' ')} stroke={['#3DDBB4', '#FFB547', '#7CC4FF', '#FF5ACD', '#3DDBB4'][i]} strokeWidth={3} fill="none" /></g>)}
          <rect x={0} y={640} width={1920} height={60} fill="#3A4454" /><rect x={0} y={700} width={1920} height={380} fill="#2A3240" />
          <g transform="translate(700,700) scale(1.05)"><g transform="scale(1,0.9)"><Pessoa v={CIENTISTA} vista="frente" expr="sorriso" t={t} bE={[30, 90]} bD={[20, 30]} semPernas /></g></g>
          <g transform="translate(1180,700) scale(1.0)"><g transform="scale(1,0.9)"><Pessoa v={CIENTISTA2} expr="susto" t={t + 1} bE={[20, 20]} bD={[30, 100]} semPernas /></g></g>
          {/* café */}
          <g transform="translate(960,680)"><rect x={-26} y={-60} width={52} height={60} rx={8} fill="#F2F2F2" /><path d="M26,-46 q24,0 24,18 q0,18 -24,18" stroke="#F2F2F2" strokeWidth={8} fill="none" />{[0, 1].map((i) => <path key={i} d={`M${-8 + i * 16},-70 q${Math.sin(t * 2 + i) * 8},-20 0,-40`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.4} />)}</g>
        </SVG>
      </AbsoluteFill>
    );
  }
  if (modo === 'colisao') {
    const k = prog(lt, 0, 0.9);
    const boom = prog(lt, 0.9, 1.6);
    return (
      <AbsoluteFill style={{background: '#04030A'}}>
        <SVG>
          <defs><radialGradient id="boom"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="30%" stopColor="#FFE08A" /><stop offset="60%" stopColor="#FF5A1F" stopOpacity={0.7} /><stop offset="100%" stopColor="#FF5A1F" stopOpacity={0} /></radialGradient></defs>
          {boom === 0 && <><circle cx={lerp(0, 940, k)} cy={540} r={34} fill="#9FD0FF" /><line x1={0} x2={lerp(0, 940, k)} y1={540} y2={540} stroke="#9FD0FF" strokeWidth={8} opacity={0.5} /><circle cx={lerp(1920, 980, k)} cy={540} r={34} fill="#FFB0B0" /><line x1={1920} x2={lerp(1920, 980, k)} y1={540} y2={540} stroke="#FFB0B0" strokeWidth={8} opacity={0.5} /></>}
          {boom > 0 && <><circle cx={960} cy={540} r={lerp(40, 900, es(boom))} fill="url(#boom)" opacity={1 - boom * 0.3} />{Array.from({length: 60}, (_, i) => { const a = rnd(i) * Math.PI * 2; const rr = es(boom) * (300 + rnd(i + 3) * 700); return <line key={i} x1={960} y1={540} x2={960 + Math.cos(a) * rr} y2={540 + Math.sin(a) * rr} stroke={['#FFE08A', '#7CC4FF', '#FF5ACD'][i % 3]} strokeWidth={3} opacity={1 - boom} />; })}</>}
        </SVG>
      </AbsoluteFill>
    );
  }
  // túnel
  return (
    <AbsoluteFill style={{background: '#0B0F18'}}>
      <SVG>
        {Array.from({length: 14}, (_, i) => { const z = ((i - t * 1.2) % 14 + 14) % 14 + 0.6; const s = 700 / z; return <g key={i} opacity={Math.min(1, 6 / z)}><ellipse cx={960} cy={540} rx={s * 1.3} ry={s} fill="none" stroke="#5A6A86" strokeWidth={Math.max(1, 30 / z)} /></g>; })}
        <rect x={0} y={560} width={1920} height={40} fill="#1E5AA8" opacity={0.0} />
        {/* o tubo azul do acelerador */}
        <path d="M0,760 L960,560 L1920,760" fill="none" stroke="#2E6FD0" strokeWidth={70} opacity={0.9} />
        <path d="M0,760 L960,560 L1920,760" fill="none" stroke="#7CB0FF" strokeWidth={14} opacity={0.6} />
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- placar com valores ----------
export type LinhaPlacar = {f?: string; q?: string};
export const PlacarCheio: React.FC<{lt: number; t: number; linhas: LinhaPlacar[]; fimF?: string; fimQ?: string; destaque?: 'f' | 'q'}> = ({lt, t, linhas, fimF, fimQ, destaque}) => {
  const pisca = 0.55 + 0.45 * Math.abs(Math.sin(t * 3));
  const col = (x: number, cor: string, titulo: string, lado: 'f' | 'q', fim?: string) => (
    <div style={{position: 'absolute', left: x, top: 120, width: 640}}>
      <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 60, color: cor, letterSpacing: 6, textAlign: 'center', textShadow: `0 0 24px ${cor}88`}}>{titulo}</div>
      <div style={{height: 6, background: cor, borderRadius: 3, margin: '8px 0 18px', boxShadow: `0 0 18px ${cor}`}} />
      {linhas.map((l, i) => { const v = l[lado]; return <div key={i} style={{height: 64, margin: '10px 0', borderRadius: 10, background: v ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', border: v ? `1px solid ${cor}55` : '1px dashed rgba(255,255,255,0.13)', display: 'flex', alignItems: 'center', padding: '0 24px', fontFamily: F.titulo, fontWeight: 600, fontSize: 36, color: '#E8ECF4'}}>{v ?? ''}</div>; })}
      <div style={{marginTop: 16, minHeight: 120, borderRadius: 14, background: 'rgba(6,10,20,0.92)', border: `3px solid ${cor}`, boxShadow: `0 0 ${fim ? 30 : 20 * pisca}px ${cor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 26px', transform: destaque === lado ? `scale(${lerp(1.12, 1, KO(lt, 0, 0.5))})` : 'none'}}>
        <span style={{fontFamily: F.titulo, fontWeight: 700, fontSize: fim ? 46 : 76, color: '#fff', opacity: fim ? 1 : pisca, textAlign: 'center', lineHeight: 1.1}}>{fim ?? '???'}</span>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{background: 'linear-gradient(90deg, #071A2E, #05070D 50%, #1E0804)'}}>
      <div style={{position: 'absolute', left: 959, top: 110, width: 2, height: 880, background: 'rgba(255,255,255,0.12)'}} />
      {col(170, FR.gelo, 'FRIO', 'f', fimF)}
      {col(1110, QU.fogo, 'CALOR', 'q', fimQ)}
    </AbsoluteFill>
  );
};

// ---------- fecho: mapa térmico do universo ----------
export const UniversoFrio: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: '#020614'}}>
    <SVG>
      {Array.from({length: 600}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 3) * 1080} r={rnd(i + 5) < 0.03 ? 4 : 1.2} fill={rnd(i + 5) < 0.03 ? '#FFB547' : '#3E5C9A'} opacity={rnd(i + 5) < 0.03 ? 0.9 : 0.35} />)}
      <circle cx={1140} cy={600} r={7} fill="#3DDBB4" /><circle cx={1140} cy={600} r={22 + 6 * Math.sin(t * 3)} fill="none" stroke="#3DDBB4" strokeWidth={3} />
    </SVG>
    <div style={{position: 'absolute', left: 1180, top: 585, fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: '#3DDBB4', opacity: KO(lt, 1.0, 1.4)}}>A TERRA</div>
  </AbsoluteFill>
);

// ---------- fecho: card final ----------
export const CardFinal: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #14203A, #04060B 75%)'}}>
    <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', fontFamily: F.titulo, fontWeight: 700, fontSize: 96, color: '#fff', letterSpacing: 6, opacity: KO(lt, 0.2, 0.7)}}>BRASIL MILENAR</div>
    <div style={{position: 'absolute', top: 430, width: '100%', textAlign: 'center', fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, color: '#AEB6C6', letterSpacing: 8, opacity: KO(lt, 0.5, 1.0)}}>TEM MAIS ESCALA PRA GENTE ATRAVESSAR</div>
    {[0, 1].map((i) => <div key={i} style={{position: 'absolute', top: 560, left: 520 + i * 460, width: 420, height: 236, borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.18)', opacity: KO(lt, 0.8 + i * 0.2, 1.2 + i * 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: '#8A93A6'}}>{i ? 'PRÓXIMO VÍDEO' : 'VÍDEO ANTERIOR'}</div>)}
  </AbsoluteFill>
);
