import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {geoContains} from 'd3-geo';
import {C, F} from './theme';
import {useT, Cena, Rotulo} from './ui';
import {Mapa, Pin, prog, sm, clamp01} from './prims';
import {brasil, mundo, orto, pathOf, pt} from './geo';

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const K = (t: number, a: number, b: number) => sm(prog(t, a, b));

// =================== LUA (2D) ===================
export const Lua: React.FC<{x: number; y: number; r: number; on?: number; ghost?: number; id: string}> = ({x, y, r, on = 1, ghost = 0, id}) => (
  <g>
    <defs>
      <radialGradient id={'h' + id}><stop offset="0%" stopColor="#fff6dc" stopOpacity={0.55} /><stop offset="100%" stopColor="#fff6dc" stopOpacity={0} /></radialGradient>
      <clipPath id={'c' + id}><circle cx={x} cy={y} r={r} /></clipPath>
    </defs>
    <circle cx={x} cy={y} r={r * 3.2} fill={`url(#h${id})`} opacity={on} />
    <g opacity={on} clipPath={`url(#c${id})`}>
      <circle cx={x} cy={y} r={r} fill="#ECE7DA" />
      <ellipse cx={x - r * 0.28} cy={y - r * 0.25} rx={r * 0.32} ry={r * 0.24} fill="#CFC8B6" />
      <ellipse cx={x + r * 0.2} cy={y - r * 0.05} rx={r * 0.22} ry={r * 0.3} fill="#D3CCBA" />
      <ellipse cx={x - r * 0.05} cy={y + r * 0.35} rx={r * 0.26} ry={r * 0.16} fill="#D6CFBE" />
      {[[0.45, 0.4, 0.09], [-0.5, 0.25, 0.07], [0.1, -0.55, 0.06], [0.55, -0.35, 0.05], [-0.25, 0.62, 0.05]].map(([a, b, c], i) => (
        <circle key={i} cx={x + a * r} cy={y + b * r} r={c * r} fill="none" stroke="#BEB6A2" strokeWidth={r * 0.02} />
      ))}
      <circle cx={x + r * 0.35} cy={y + r * 0.1} r={r} fill="none" stroke="#000" strokeOpacity={0.12} strokeWidth={r * 0.5} />
    </g>
    {ghost > 0 && <circle cx={x} cy={y} r={r} fill="none" stroke="#9fb0c8" strokeOpacity={0.55 * ghost} strokeWidth={2} strokeDasharray="6 9" />}
  </g>
);

// =================== ESTRELAS ===================
const STARS = Array.from({length: 700}, (_, i) => ({x: rnd(i) * 1920, y: rnd(i + 999) * 760, r: rnd(i + 77) < 0.92 ? 0.7 + rnd(i + 5) * 1 : 1.6 + rnd(i + 9) * 1.4, a: 0.4 + rnd(i + 3) * 0.6, tw: rnd(i + 31) * 6}));
// estrelas concentradas na faixa da Via Láctea (diagonal)
const VIA = Array.from({length: 900}, (_, i) => {
  const u = rnd(i + 4000), v = (rnd(i + 5000) + rnd(i + 6000) + rnd(i + 7000) - 1.5) * 0.55;
  const x = u * 2200 - 140, y = 760 - u * 760 + v * 260;
  return {x, y, r: 0.5 + rnd(i + 8000) * 0.9, a: 0.3 + rnd(i + 9000) * 0.6};
});
export const Estrelas: React.FC<{k: number; via?: number; tmul?: number}> = ({k, via = 0, tmul = 1}) => {
  const t = useT();
  const n = Math.round(STARS.length * k);
  return (
    <svg width={1920} height={1080}>
      <defs>
        <linearGradient id="via" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#8fb7d9" stopOpacity={0} />
          <stop offset="35%" stopColor="#a9c4e0" stopOpacity={0.22} />
          <stop offset="55%" stopColor="#e8d9c0" stopOpacity={0.3} />
          <stop offset="80%" stopColor="#a9c4e0" stopOpacity={0.16} />
          <stop offset="100%" stopColor="#8fb7d9" stopOpacity={0} />
        </linearGradient>
        <filter id="vb"><feGaussianBlur stdDeviation="38" /></filter>
        <filter id="vb2"><feGaussianBlur stdDeviation="10" /></filter>
      </defs>
      {via > 0 && (
        <g opacity={via}>
          <path d="M-200,900 C 500,650 1200,330 2100,-60 L 2100,180 C 1250,520 560,820 -200,1120 Z" fill="url(#via)" filter="url(#vb)" />
          <path d="M-100,960 C 600,720 1150,450 2050,40" stroke="#05070d" strokeOpacity={0.55} strokeWidth={26} fill="none" filter="url(#vb2)" />
          {VIA.map((s, i) => <circle key={'v' + i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.a * via} />)}
        </g>
      )}
      {STARS.slice(0, n).map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.a * (0.75 + 0.25 * Math.sin(t * 1.6 * tmul + s.tw))} />
      ))}
    </svg>
  );
};

// =================== RIO AMAZÔNICO + POROROCA ===================
const Acai: React.FC<{x: number; y: number; h: number; c: string; s?: number}> = ({x, y, h, c, s = 1}) => {
  const top: [number, number] = [x + 10 * s, y - h];
  const fr = [-1.1, -0.7, -0.3, 0.2, 0.6, 1.0, 1.3];
  return (
    <g>
      <path d={`M${x},${y} Q${x + 14 * s},${y - h * 0.5} ${top[0]},${top[1]}`} stroke={c} strokeWidth={3.2 * s} fill="none" />
      {fr.map((a, i) => {
        const L = 46 * s, ex = top[0] + Math.cos(a - Math.PI / 2) * L * 0.4 + Math.sin(a) * L, ey = top[1] + Math.abs(Math.sin(a)) * L * 0.75 + 4;
        return <path key={i} d={`M${top[0]},${top[1]} Q${top[0] + Math.sin(a) * L * 0.6},${top[1] - 14 * s} ${ex},${ey}`} stroke={c} strokeWidth={2.4 * s} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
};
const MATA = Array.from({length: 46}, (_, i) => ({x: i * 44 - 20 + rnd(i + 300) * 20, h: 40 + rnd(i + 400) * 60}));
const ACAIS = Array.from({length: 13}, (_, i) => ({x: 60 + i * 150 + rnd(i + 500) * 70, h: 120 + rnd(i + 600) * 70}));

export const Rio: React.FC<{noite: number; lua: number; luaGhost?: number; onda: number; ondaAlt: number; lx?: number; ly?: number}> = ({noite, lua, luaGhost = 0, onda, ondaAlt, lx = 1540, ly = 330}) => {
  const t = useT();
  const hz = 600; // horizonte (margem oposta)
  const ceuTop = `rgb(${lerp(40, 8, noite)},${lerp(52, 14, noite)},${lerp(98, 30, noite)})`;
  const ceuBase = `rgb(${lerp(232, 22, noite)},${lerp(140, 34, noite)},${lerp(84, 58, noite)})`;
  const mata = `rgb(${lerp(26, 6, noite)},${lerp(34, 10, noite)},${lerp(30, 16, noite)})`;
  const agua = `rgb(${lerp(120, 22, noite)},${lerp(92, 30, noite)},${lerp(70, 42, noite)})`;
  const fx = lerp(-200, 2150, onda); // frente da onda (x)
  const wy = 760; // nível do rio
  const A = ondaAlt;
  const crest = Array.from({length: 40}, (_, i) => {
    const x = fx - i * 40;
    return `${x},${wy - A - 6 * Math.sin(i * 0.9 + t * 5)}`;
  }).join(' ');
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080}>
        <defs>
          <linearGradient id="rceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={ceuTop} /><stop offset="100%" stopColor={ceuBase} /></linearGradient>
        </defs>
        <rect width={1920} height={hz} fill="url(#rceu)" />
      </svg>
      <AbsoluteFill style={{opacity: noite * 0.9}}><Estrelas k={0.35} /></AbsoluteFill>
      <svg width={1920} height={1080}>
        <Lua x={lx} y={ly} r={70} on={lua} ghost={luaGhost} id="rio" />
        {/* margem oposta: mata + açaizeiros */}
        <path d={`M0,${hz} ` + MATA.map((m) => `Q${m.x + 22},${hz - m.h} ${m.x + 44},${hz}`).join(' ') + ` L1920,${hz + 30} L0,${hz + 30} Z`} fill={mata} />
        {ACAIS.map((a, i) => <Acai key={i} x={a.x} y={hz - 20} h={a.h} c={mata} s={1} />)}
        {/* rio */}
        <rect y={hz + 20} width={1920} height={1080 - hz} fill={agua} />
        {/* reflexo da lua */}
        {lua > 0.01 && Array.from({length: 9}, (_, i) => <rect key={i} x={lx - 60 + Math.sin(t * 2 + i) * 14} y={hz + 40 + i * 30} width={120 - i * 8} height={4} rx={2} fill="#fff3d0" opacity={0.35 * lua} />)}
        {/* correnteza (vai para a esquerda = mar) */}
        {Array.from({length: 10}, (_, i) => {
          const x = ((i * 230 - t * 60) % 2300 + 2300) % 2300 - 200;
          const y = 820 + (i % 3) * 70;
          return x > fx ? <path key={i} d={`M${x + 50},${y} L${x},${y} M${x + 12},${y - 7} L${x},${y} L${x + 12},${y + 7}`} stroke="#d9c7a8" strokeOpacity={0.35 * (1 - noite * 0.5)} strokeWidth={2.5} fill="none" /> : null;
        })}
        {/* corpo da onda: degrau de água barrenta, frente com espuma e spray */}
        {onda > 0 && A > 1 && (() => {
          const lama = `rgb(${lerp(150, 52, noite)},${lerp(104, 40, noite)},${lerp(62, 30, noite)})`;
          const lama2 = `rgb(${lerp(120, 40, noite)},${lerp(84, 32, noite)},${lerp(50, 26, noite)})`;
          const face = Array.from({length: 24}, (_, i) => `${fx + 30 + Math.sin(i * 1.7 + t * 6) * 6},${wy - A + (i * (A + 30)) / 23}`).join(' ');
          return (
            <g>
              <defs>
                <linearGradient id="lamaFade" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" {...{x1: fx - 420, x2: fx + 60}}>
                  <stop offset="0%" stopColor={lama} stopOpacity={0.9} /><stop offset="100%" stopColor={lama} stopOpacity={0} />
                </linearGradient>
              </defs>
              <rect x={-300} y={wy} width={fx + 360} height={1080 - wy} fill="url(#lamaFade)" />
              <path d={`M-300,${wy - A} L${fx},${wy - A} Q${fx + 40},${wy - A - 6} ${fx + 60},${wy - A * 0.4} Q${fx + 80},${wy + 4} ${fx + 140},${wy + 6} L${fx + 140},${wy + 22} Q${fx - 100},${wy + 40} -300,${wy + 30} Z`} fill={lama} />
              {Array.from({length: 8}, (_, i) => <path key={'r' + i} d={`M${fx - 120 - i * 210},${wy - A + 30 + (i % 4) * 60} q60,-10 120,0`} stroke={lama2} strokeWidth={6} fill="none" strokeLinecap="round" />)}
              <path d={`M${fx - 20},${wy - A - 4} Q${fx + 60},${wy - A - 34} ${fx + 96},${wy - A + 18} Q${fx + 70},${wy - A + 4} ${fx + 52},${wy - A + 26} Q${fx + 40},${wy - A + 4} ${fx - 20},${wy - A + 8} Z`} fill="#fbf6ec" />
              <rect x={fx + 50} y={wy - 4} width={150} height={12} rx={6} fill="#f6efe2" opacity={0.55} />
              <polyline points={crest} fill="none" stroke="#fbf6ec" strokeWidth={12} strokeLinecap="round" />
              {Array.from({length: 26}, (_, i) => {
                const ph = (t * 1.8 + rnd(i + 700)) % 1;
                return <circle key={'s' + i} cx={fx + 20 + rnd(i + 710) * 90 + ph * 40} cy={wy - A - 10 - Math.sin(ph * Math.PI) * (30 + rnd(i + 720) * 40)} r={3 + rnd(i + 730) * 4} fill="#fbf6ec" opacity={0.7 * (1 - ph)} />;
              })}
              {[0, 1, 2].map((i) => {
                const sx = fx - 140 - i * 300, sy = wy - A - 6 + Math.sin(t * 3 + i) * 3;
                return (
                  <g key={i} transform={`translate(${sx},${sy}) scale(1.7)`} opacity={0.95}>
                    <path d="M-36,0 Q0,-6 40,0 Q0,6 -36,0 Z" fill={i === 1 ? '#e8c547' : '#d9e4ee'} />
                    <circle cx={2} cy={-50} r={7} fill="#15110d" />
                    <path d="M2,-43 L-2,-22 L-14,-3 M-2,-22 L12,-3 M0,-38 L-20,-30 M0,-38 L22,-34" stroke="#15110d" strokeWidth={5.5} strokeLinecap="round" fill="none" />
                  </g>
                );
              })}
            </g>
          );
        })()}
      </svg>
    </AbsoluteFill>
  );
};

// =================== SÃO LUÍS (casarões com azulejo) ===================
const CASAS = Array.from({length: 9}, (_, i) => ({w: 200 + rnd(i + 20) * 70, h: 250 + rnd(i + 30) * 140, cor: ['#2f4a6e', '#5a3f3a', '#3d5a52', '#4a4166', '#2f4a6e', '#6a5236', '#3d5a52', '#4a4166', '#5a3f3a'][i], az: i % 2 === 0}));
export const SaoLuis: React.FC<{luz: number; lua: number; agua?: number}> = ({luz, lua, agua = 0}) => {
  const t = useT();
  const base = 800;
  let x = -40;
  const casas = CASAS.map((c) => { const o = {...c, x}; x += c.w + 6; return o; });
  const dim = lerp(0.12, 1, luz);
  return (
    <AbsoluteFill style={{background: `linear-gradient(#050913, ${luz > 0.5 ? '#14284a' : '#070b16'})`}}>
      <AbsoluteFill style={{opacity: 1 - luz * 0.5}}><Estrelas k={0.5} /></AbsoluteFill>
      <svg width={1920} height={1080}>
        <defs>
          <pattern id="azul" width="22" height="22" patternUnits="userSpaceOnUse">
            <rect width="22" height="22" fill="#d8e3f0" />
            <path d="M11,2 L20,11 L11,20 L2,11 Z" fill="#2c5aa0" />
            <circle cx="11" cy="11" r="3" fill="#d8e3f0" />
          </pattern>
        </defs>
        <Lua x={1560} y={300} r={78} on={lua} ghost={0} id="sl" />
        {casas.map((c, i) => {
          const top = base - c.h;
          const cols = Math.max(2, Math.floor(c.w / 70));
          return (
            <g key={i} opacity={1}>
              <path d={`M${c.x - 8},${top} L${c.x + c.w + 8},${top} L${c.x + c.w - 14},${top - 34} L${c.x + 14},${top - 34} Z`} fill={`rgba(120,60,35,${dim})`} />
              <rect x={c.x} y={top} width={c.w} height={c.h} fill={c.cor} opacity={dim} />
              {c.az && <rect x={c.x} y={top} width={c.w} height={c.h} fill="url(#azul)" opacity={0.42 * dim} />}
              <rect x={c.x} y={top + c.h * 0.5 - 6} width={c.w} height={6} fill="#e8e0cc" opacity={0.6 * dim} />
              {[0, 1].map((row) => Array.from({length: cols}, (_, j) => {
                const wx = c.x + (c.w / cols) * (j + 0.5) - 18, wy = top + 40 + row * (c.h * 0.5);
                const lit = rnd(i * 10 + j + row * 5) > 0.45;
                return (
                  <g key={row + '-' + j}>
                    <path d={`M${wx},${wy + 70} L${wx},${wy + 18} A18,18 0 0 1 ${wx + 36},${wy + 18} L${wx + 36},${wy + 70} Z`} fill={lit ? `rgba(255,205,120,${0.55 + 0.35 * luz})` : `rgba(10,14,24,${0.8})`} stroke="#e8e0cc" strokeOpacity={0.5 * dim} strokeWidth={3} />
                    {row === 0 && <path d={`M${wx - 8},${wy + 72} L${wx + 44},${wy + 72} M${wx - 8},${wy + 72} L${wx - 8},${wy + 92} M${wx + 44},${wy + 72} L${wx + 44},${wy + 92} M${wx - 8},${wy + 90} L${wx + 44},${wy + 90}`} stroke="#151515" strokeOpacity={0.85} strokeWidth={3} />}
                  </g>
                );
              }))}
            </g>
          );
        })}
        <rect y={base} width={1920} height={1080 - base} fill={`rgb(${lerp(5, 14, luz)},${lerp(10, 28, luz)},${lerp(20, 52, luz)})`} />
        {Array.from({length: 14}, (_, i) => (
          <rect key={i} x={(i * 150 + Math.sin(t + i) * 20) % 1920} y={base + 30 + (i % 5) * 50} width={70} height={3} rx={1.5} fill="#ffd28a" opacity={(0.18 + 0.25 * agua) * lerp(0.3, 1, luz)} />
        ))}
        {lua > 0.01 && Array.from({length: 7}, (_, i) => <rect key={'m' + i} x={1500 + Math.sin(t * 2 + i) * 12} y={base + 24 + i * 34} width={120 - i * 10} height={4} rx={2} fill="#fff3d0" opacity={0.4 * lua} />)}
      </svg>
    </AbsoluteFill>
  );
};

// =================== SERTÃO ===================
const Mandacaru: React.FC<{x: number; y: number; h: number; c: string; s?: number; flip?: boolean}> = ({x, y, h, c, s = 1, flip}) => {
  const w = 22 * s, f = flip ? -1 : 1;
  return (
    <g fill={c}>
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx={w / 2} />
      <path d={`M${x},${y - h * 0.42} h${f * 46 * s} q${f * 12 * s},0 ${f * 12 * s},-12 v${-h * 0.32} a${w / 2},${w / 2} 0 0 0 ${-f * w},0 v${h * 0.26} h${-f * 34 * s} Z`} />
      <path d={`M${x},${y - h * 0.58} h${-f * 38 * s} q${-f * 12 * s},0 ${-f * 12 * s},-12 v${-h * 0.22} a${w / 2},${w / 2} 0 0 1 ${f * w},0 v${h * 0.16} h${f * 26 * s} Z`} />
    </g>
  );
};
const Sertanejo: React.FC<{x: number; y: number; c: string; t: number}> = ({x, y, c, t}) => {
  const p = Math.sin(t * 4);
  return (
    <g fill={c} stroke={c}>
      {/* chapéu de couro (aba em meia-lua) */}
      <path d={`M${x - 26},${y - 118} Q${x},${y - 104} ${x + 26},${y - 118} Q${x + 14},${y - 108} ${x},${y - 107} Q${x - 14},${y - 108} ${x - 26},${y - 118} Z`} strokeWidth={2} />
      <path d={`M${x - 11},${y - 112} Q${x},${y - 140} ${x + 11},${y - 112} Z`} />
      <circle cx={x} cy={y - 100} r={9} />
      <path d={`M${x},${y - 92} L${x},${y - 46}`} strokeWidth={14} strokeLinecap="round" />
      <path d={`M${x},${y - 46} L${x - 10 * p},${y}`} strokeWidth={8} strokeLinecap="round" />
      <path d={`M${x},${y - 46} L${x + 10 * p},${y}`} strokeWidth={8} strokeLinecap="round" />
      <path d={`M${x},${y - 82} L${x + 12 * p},${y - 52}`} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};
export const Sertao: React.FC<{luz: number; lua: number; estrelas: number; via?: number; andar?: number; arbustos?: boolean}> = ({luz, lua, estrelas, via = 0, andar = 0}) => {
  const t = useT();
  const hz = 640;
  const sky1 = `rgb(${lerp(3, 14, luz)},${lerp(5, 26, luz)},${lerp(10, 58, luz)})`;
  const sky2 = `rgb(${lerp(5, 40, luz)},${lerp(8, 62, luz)},${lerp(14, 104, luz)})`;
  const chao = `rgb(${lerp(6, 74, luz)},${lerp(6, 62, luz)},${lerp(8, 50, luz)})`;
  const sil = `rgb(${lerp(2, 18, luz)},${lerp(3, 26, luz)},${lerp(5, 38, luz)})`;
  const estrada = `rgb(${lerp(10, 122, luz)},${lerp(9, 100, luz)},${lerp(10, 76, luz)})`;
  return (
    <AbsoluteFill style={{background: `linear-gradient(${sky1}, ${sky2} 59%, ${sky2})`}}>
      <AbsoluteFill style={{opacity: estrelas}}><Estrelas k={lerp(0.25, 1, estrelas)} via={via} /></AbsoluteFill>
      <svg width={1920} height={1080}>
        <Lua x={1540} y={300} r={64} on={lua} id="st" />
        <path d={`M0,${hz} Q300,${hz - 40} 620,${hz - 8} T1300,${hz - 20} T1920,${hz} L1920,1080 L0,1080 Z`} fill={chao} />
        <path d={`M930,${hz - 2} L990,${hz - 2} L1500,1080 L380,1080 Z`} fill={estrada} />
        {Array.from({length: 7}, (_, i) => <path key={'b' + i} d={`M${120 + i * 270},${hz + 30 + (i % 2) * 40} q20,-40 40,-10 q10,-30 30,0 q15,-25 30,5 z`} fill={sil} />)}
        <Mandacaru x={250} y={1000} h={420} c={sil} s={1.8} />
        <Mandacaru x={1720} y={960} h={330} c={sil} s={1.4} flip />
        <Mandacaru x={560} y={hz + 50} h={120} c={sil} s={0.6} />
        <Mandacaru x={1380} y={hz + 40} h={100} c={sil} s={0.5} flip />
        {andar > 0 && <g transform={`translate(${lerp(1110, 1170, andar)},${lerp(900, 930, andar)}) scale(1.6)`}><Sertanejo x={0} y={0} c={sil} t={t} /></g>}
      </svg>
    </AbsoluteFill>
  );
};

// =================== CRONÔMETRO ===================
const two = (n: number) => String(Math.floor(n)).padStart(2, '0');
export const fmtCron = (s: number) => `${two(s / 3600)}:${two((s % 3600) / 60)}:${two(s % 60)},${Math.floor((s * 10) % 10)}`;
export const CronoGrande: React.FC<{seg: number; k: number; op: number}> = ({seg, k, op}) => {
  const ang = (seg % 60) * 6;
  const cx = 960, cy = lerp(620, 90, k), sc = lerp(1, 0.25, k);
  return (
    <svg width={1920} height={1080} style={{opacity: op}}>
      <g transform={`translate(${cx},${cy}) scale(${sc})`}>
        <rect x={-26} y={-300} width={52} height={40} rx={8} fill={C.ouro} />
        <rect x={-50} y={-318} width={100} height={22} rx={8} fill={C.ouro} />
        <circle r={260} fill="#0a1222" stroke={C.ouro} strokeWidth={10} />
        {Array.from({length: 60}, (_, i) => {
          const a = (i * 6 * Math.PI) / 180, L = i % 5 === 0 ? 30 : 14;
          return <line key={i} x1={Math.sin(a) * 236} y1={-Math.cos(a) * 236} x2={Math.sin(a) * (236 - L)} y2={-Math.cos(a) * (236 - L)} stroke={i % 5 === 0 ? C.info : '#5c6a85'} strokeWidth={i % 5 === 0 ? 4 : 2} />;
        })}
        <line x1={0} y1={30} x2={Math.sin((ang * Math.PI) / 180) * 200} y2={-Math.cos((ang * Math.PI) / 180) * 200} stroke={C.perigo} strokeWidth={6} strokeLinecap="round" />
        <circle r={12} fill={C.perigo} />
        <text y={110} textAnchor="middle" fill={C.info} style={{fontFamily: F.titulo, fontWeight: 500, fontSize: 64, letterSpacing: 3}}>{fmtCron(seg)}</text>
      </g>
    </svg>
  );
};

// HUD do topo: cronômetro "TEMPO SEM A LUA"
type HEv = {a: number; b: number; s0: number; s1: number; v0: number; v1: number};
export const HUD: React.FC<{evs: HEv[]}> = ({evs}) => {
  const t = useT();
  const e = evs.find((x) => t >= x.a - 0.4 && t <= x.b + 0.6);
  if (!e) return null;
  const op = interpolate(t, [e.a - 0.4, e.a, e.b, e.b + 0.6], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const k = clamp01((t - e.s0) / Math.max(0.001, e.s1 - e.s0));
  const kk = e.s1 - e.s0 > 3 ? sm(k) : k;
  const v = e.v0 + (e.v1 - e.v0) * kk;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: op}}>
      <div style={{padding: '8px 26px', borderRadius: 14, background: 'rgba(6,10,20,0.75)', border: `1.5px solid ${C.ouro}66`, display: 'flex', alignItems: 'center', gap: 16}}>
        <svg width={30} height={34} style={{position: 'relative'}}>
          <circle cx={15} cy={19} r={12} fill="none" stroke={C.ouro} strokeWidth={2.5} />
          <rect x={12} y={1} width={6} height={5} fill={C.ouro} />
          <line x1={15} y1={19} x2={15 + Math.sin(v * 0.6) * 9} y2={19 - Math.cos(v * 0.6) * 9} stroke={C.perigo} strokeWidth={2.5} />
        </svg>
        <span style={{fontFamily: F.titulo, fontWeight: 500, fontSize: 44, letterSpacing: 4, color: C.info, fontVariantNumeric: 'tabular-nums'}}>{fmtCron(v)}</span>
      </div>
      <div style={{marginTop: 8, fontFamily: F.rotulo, fontWeight: 500, fontSize: 15, letterSpacing: 6, color: C.cinza}}>TEMPO SEM A LUA</div>
    </div>
  );
};

// =================== GLOBINHO (para o tríptico) ===================
const ORTO = orto([45, -10], 120, 300, 300);
const PATH_ORTO = pathOf(ORTO);
const TERRAS = mundo.map((f) => PATH_ORTO(f) || '').join(' ');

const Painel: React.FC<{x: number; k: number; titulo: string; children: React.ReactNode}> = ({x, k, titulo, children}) => (
  <g opacity={k} transform={`translate(${x},${lerp(560, 520, k)})`}>
    <rect x={-250} y={-230} width={500} height={460} rx={24} fill="#0b1426" stroke={C.ouro} strokeOpacity={0.45} strokeWidth={2} />
    <g>{children}</g>
    <text y={200} textAnchor="middle" fill={C.info} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 5}}>{titulo}</text>
  </g>
);
const Sombrinha: React.FC<{t: number}> = ({t}) => {
  const cores = ['#E63946', '#F4C430', '#2BA84A', '#1E6FD9', '#E63946', '#F4C430', '#2BA84A', '#1E6FD9'];
  return (
    <g transform={`rotate(${Math.sin(t * 3) * 10})`}>
      {cores.map((c, i) => {
        const a0 = Math.PI + (i * Math.PI) / 8, a1 = Math.PI + ((i + 1) * Math.PI) / 8;
        return <path key={i} d={`M0,0 L${Math.cos(a0) * 120},${Math.sin(a0) * 120 * 0.75} A120,90 0 0 1 ${Math.cos(a1) * 120},${Math.sin(a1) * 120 * 0.75} Z`} fill={c} />;
      })}
      <line x1={0} y1={-92} x2={0} y2={120} stroke="#ddd" strokeWidth={6} />
    </g>
  );
};
const CONF = Array.from({length: 40}, (_, i) => ({x: rnd(i + 70) * 440 - 220, y0: rnd(i + 80) * 400 - 200, c: ['#E63946', '#F4C430', '#2BA84A', '#1E6FD9', '#fff'][i % 5], s: 0.5 + rnd(i + 90)}));

// =================== CENAS DO PILOTO ===================
const ANCORA = {lon: -41.95, lat: -21.87}; // Parque Estadual do Desengano (RJ)
const CIDADES: [number, number, number][] = [[-46.63, -23.55, 1.4], [-43.2, -22.9, 1.2], [-43.94, -19.92, 0.9], [-47.88, -15.79, 0.9], [-38.5, -12.97, 0.9], [-34.88, -8.05, 0.9], [-38.54, -3.72, 0.9], [-60.02, -3.1, 0.8], [-48.5, -1.45, 0.8], [-51.23, -30.03, 0.9], [-49.27, -25.43, 0.8], [-49.25, -16.68, 0.7]];
const PONTOS_BR = (() => {
  const out: [number, number, number][] = [];
  for (let i = 0; out.length < 900 && i < 20000; i++) {
    const lon = -74 + rnd(i + 11000) * 40, lat = -34 + rnd(i + 12000) * 39;
    if (geoContains(brasil, [lon, lat])) out.push([lon, lat, rnd(i + 13000)]);
  }
  return out;
})();

export const CenasPiloto: React.FC = () => {
  const t = useT();
  return (
    <>
      {/* 1 — Rio ao entardecer, Lua nasce, pororoca sobe o rio */}
      <Cena from={0} to={12.7} zoom={0.05} fade={0.5}>
        <Rio noite={K(t, 0, 12)} lua={K(t, 0.2, 3)} ly={lerp(470, 300, K(t, 0, 10))} onda={prog(t, 3.0, 12.8) * 0.9} ondaAlt={lerp(0, 80, K(t, 3, 5))} />
        <svg width={1920} height={1080} style={{opacity: K(t, 6.3, 7.0) * (1 - K(t, 10.2, 10.8))}}>
          <Rotulo x={1700} y={960} anchor="end" cor={C.dado} size={30}>← CORRENTEZA DO RIO</Rotulo>
          <Rotulo x={Math.min(1700, lerp(-200, 2150, prog(t, 3, 12.8) * 0.9) - 40)} y={630} anchor="end" cor={C.ouro} size={30}>A ONDA SOBE O RIO →</Rotulo>
        </svg>
        <svg width={1920} height={1080} style={{opacity: K(t, 10.9, 11.5)}}>
          <text x={960} y={430} textAnchor="middle" fill={C.info} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 120, letterSpacing: 10}}>POROROCA</text>
        </svg>
      </Cena>

      {/* 2 — A Lua some; a onda baixa */}
      <Cena from={12.7} to={21.2} zoom={0.03} fade={0.4}>
        <Rio noite={1} lua={1 - K(t, 15.25, 15.75)} luaGhost={K(t, 15.6, 16.4)} onda={0.62 + prog(t, 12.7, 21.2) * 0.12} ondaAlt={lerp(80, 0, K(t, 16, 20))} />
        <svg width={1920} height={1080}>
          {[{x: 1360, at: 16.6, ic: 'exp'}, {x: 1720, at: 17.7, ic: 'rock'}].map((c, i) => {
            const k = K(t, c.at, c.at + 0.35) * (1 - K(t, 19.0, 19.5));
            return (
              <g key={i} opacity={k} transform={`translate(${c.x},330)`}>
                {c.ic === 'exp' ? <path d="M0,-50 L12,-16 L46,-20 L20,4 L36,38 L2,20 L-30,42 L-18,6 L-48,-14 L-12,-14 Z" fill={C.perigo} opacity={0.8} /> : <path d="M-34,-10 L-12,-36 L24,-30 L40,4 L18,34 L-22,30 Z" fill="#8a8172" />}
                <line x1={-56} y1={-56} x2={56} y2={56} stroke={C.info} strokeWidth={7} strokeLinecap="round" />
                <text y={90} textAnchor="middle" fill={C.info} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 20, letterSpacing: 3}}>{i === 0 ? 'SEM EXPLOSÃO' : 'SEM PEDAÇOS'}</text>
              </g>
            );
          })}
        </svg>
      </Cena>

      {/* 3 — Tríptico de perguntas → ampulheta */}
      <Cena from={21.2} to={31.0} zoom={0.03} fade={0.45}>
        <svg width={1920} height={1080}>
          <g opacity={1 - K(t, 26.6, 27.2)}>
            <Painel x={420} k={K(t, 21.9, 22.4)} titulo="1ª NOITE">
              <rect x={-250} y={-230} width={500} height={330} rx={24} fill="#070c18" />
              {Array.from({length: 40}, (_, i) => <circle key={i} cx={rnd(i + 200) * 460 - 230} cy={rnd(i + 210) * 260 - 220} r={1 + rnd(i + 220) * 1.4} fill="#fff" opacity={0.7} />)}
              <Mandacaru x={-120} y={100} h={170} c="#020409" s={0.8} />
              <path d="M-250,100 Q0,70 250,100 L250,110 L-250,110 Z" fill="#020409" />
            </Painel>
            <Painel x={960} k={K(t, 23.3, 23.8)} titulo="1º CARNAVAL">
              {CONF.map((c, i) => <rect key={i} x={c.x} y={((c.y0 + (t - 23) * 120 * c.s) % 380) - 200} width={9} height={14} fill={c.c} transform={`rotate(${(t * 90 * c.s) % 360} ${c.x} ${c.y0})`} opacity={0.85} />)}
              <g transform="translate(0,0)"><Sombrinha t={t} /></g>
            </Painel>
            <Painel x={1500} k={K(t, 24.8, 25.3)} titulo="1 MILHÃO DE ANOS">
              <g transform="translate(-150,-190)">
                <circle cx={150} cy={150} r={120} fill="#123a66" />
                <path d={TERRAS} fill="#5d7f4c" />
                <line x1={150 - Math.sin(0.41) * 160} y1={150 - Math.cos(0.41) * -160} x2={150 + Math.sin(0.41) * 160} y2={150 + Math.cos(0.41) * -160} stroke={C.ouro} strokeWidth={4} strokeDasharray="10 8" transform={`rotate(${Math.sin(t * 1.5) * 8} 150 150)`} />
              </g>
            </Painel>
          </g>
          {/* ampulheta: quanto tempo a gente aguentaria? */}
          <g opacity={K(t, 27.0, 27.6)} transform="translate(960,560)">
            <path d="M-120,-220 L120,-220 L120,-200 Q120,-60 14,0 Q120,60 120,200 L120,220 L-120,220 L-120,200 Q-120,60 -14,0 Q-120,-60 -120,-200 Z" fill="none" stroke={C.ouro} strokeWidth={6} />
            <path d={`M${-100 + 70 * K(t, 27, 31)},${-180 + 150 * K(t, 27, 31)} L${100 - 70 * K(t, 27, 31)},${-180 + 150 * K(t, 27, 31)} L12,-8 L-12,-8 Z`} fill="#d9b56a" />
            <line x1={0} y1={0} x2={0} y2={200} stroke="#d9b56a" strokeWidth={4} strokeDasharray="4 6" strokeDashoffset={-t * 60} />
            <path d={`M-100,205 Q0,${205 - 120 * K(t, 27, 31)} 100,205 Z`} fill="#d9b56a" />
            <text y={300} textAnchor="middle" fill={C.info} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 52, letterSpacing: 2}}>QUANTO TEMPO A GENTE AGUENTARIA?</text>
          </g>
        </svg>
      </Cena>

      {/* 4 — Cronômetro liga e sobe pro topo */}
      <Cena from={31.0} to={38.9} zoom={0} fade={0.45}>
        <CronoGrande seg={Math.max(0, t - 35.0) * 0.6} k={K(t, 36.6, 38.6)} op={K(t, 31.4, 32.0) * (1 - K(t, 38.4, 38.8))} />
      </Cena>

      {/* 5 — São Luís com Lua cheia */}
      <Cena from={38.9} to={44.0} zoom={0.05} fade={0.45}>
        <SaoLuis luz={1} lua={1} />
      </Cena>

      {/* 6/7 — Diagrama Terra–Lua; pulso de luz 1,3 s; carta */}
      <Cena from={44.0} to={62.4} zoom={0.025} fade={0.45}>
        {(() => {
          const ex = 300, mx = 1620, y = 560;
          const sumiu = K(t, 52.9, 53.6);
          const pk = prog(t, 49.8, 51.1); // 1,3 s reais
          const env = sm(prog(t, 58.6, 61.6));
          return (
            <svg width={1920} height={1080}>
              <circle cx={ex} cy={y} r={90} fill="#1f5c99" />
              <path d="M240,520 q30,-30 60,-10 q20,20 -10,40 q-30,10 -50,-30 Z M300,600 q40,-10 50,20 q-20,30 -50,10 Z" fill="#5d8f4e" />
              <text x={ex} y={y + 150} textAnchor="middle" fill={C.cinza} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4}}>TERRA</text>
              <Lua x={mx} y={y} r={48} on={1 - sumiu} ghost={sumiu} id="dg" />
              <text x={mx} y={y + 110} textAnchor="middle" fill={C.cinza} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4}}>LUA</text>
              <line x1={ex + 110} y1={y} x2={lerp(ex + 110, mx - 70, K(t, 44.3, 46.5))} y2={y} stroke={C.dado} strokeWidth={2} strokeDasharray="8 8" />
              <text x={(ex + mx) / 2} y={y - 30} textAnchor="middle" fill={C.dado} opacity={K(t, 46, 47) * (1 - K(t, 57.3, 57.7))} style={{fontFamily: F.titulo, fontWeight: 500, fontSize: 40, letterSpacing: 3}}>384.400 KM</text>
              {pk > 0 && pk < 1 && (
                <g>
                  <circle cx={lerp(mx - 60, ex + 100, pk)} cy={y} r={16} fill="#fff6dc" opacity={0.9} />
                  <circle cx={lerp(mx - 60, ex + 100, pk)} cy={y} r={40} fill="#fff6dc" opacity={0.2} />
                </g>
              )}
              {pk > 0 && <text x={(ex + mx) / 2} y={y + 80} textAnchor="middle" fill={C.ouro} opacity={1 - K(t, 57.3, 57.7)} style={{fontFamily: F.titulo, fontWeight: 500, fontSize: 46, letterSpacing: 3}}>{(pk * 1.3).toFixed(1).replace('.', ',')} s</text>}
              {/* imagem atrasada: a Lua "viajando" mesmo depois de sumir */}
              {t > 53.6 && t < 58.4 && (
                <g opacity={K(t, 53.6, 54.2) * (1 - K(t, 57.8, 58.4))}>
                  <Lua x={lerp(mx - 120, ex + 260, prog(t, 53.6, 58.2))} y={y} r={30} on={0.8} id="eco" />
                  <text x={lerp(mx - 120, ex + 260, prog(t, 53.6, 58.2))} y={y - 60} textAnchor="middle" fill={C.info} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 18, letterSpacing: 3}}>IMAGEM ATRASADA</text>
                </g>
              )}
              {t > 58.3 && (
                <g opacity={K(t, 58.3, 58.8)} transform={`translate(${lerp(mx - 80, ex + 120, env)},${y - Math.sin(env * Math.PI) * 120})`}>
                  <rect x={-44} y={-30} width={88} height={60} rx={6} fill="#f2ede0" />
                  <path d="M-44,-30 L0,6 L44,-30" fill="none" stroke="#b8ae98" strokeWidth={3} />
                  <rect x={22} y={-24} width={14} height={16} fill={C.perigo} />
                </g>
              )}
            </svg>
          );
        })()}
      </Cena>

      {/* 8 — São Luís: a Lua apaga, a cidade escurece */}
      <Cena from={62.4} to={68.3} zoom={0.04} fade={0.4}>
        <SaoLuis luz={1 - K(t, 63.2, 66.0) * 0.85 - K(t, 67.0, 68.0) * 0.15} lua={1 - K(t, 63.25, 63.7)} agua={K(t, 65.8, 66.4) * (1 - K(t, 66.9, 67.3))} />
        <AbsoluteFill style={{background: '#000', opacity: K(t, 67.1, 68.2) * 0.75}} />
      </Cena>

      {/* 9/10 — Sertão: noite de lua; depois a luz some + comparação de lux */}
      <Cena from={68.3} to={83.6} zoom={0.05} fade={0.45}>
        <Sertao luz={1 - K(t, 74.2, 76.4) * 0.94} lua={1 - K(t, 73.7, 74.4)} estrelas={K(t, 74.4, 77)} andar={prog(t, 68.3, 83.6)} />
        <svg width={1920} height={1080} style={{opacity: K(t, 75.2, 75.8) * (1 - K(t, 79.4, 80.0))}}>
          <g transform="translate(1180,330)">
            <rect x={-30} y={-40} width={640} height={250} rx={18} fill="rgba(6,10,20,0.78)" stroke={C.ouro} strokeOpacity={0.35} />
            <text x={0} y={0} fill={C.cinza} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 18, letterSpacing: 4}}>LUZ NO CHÃO (LUX)</text>
            <text x={0} y={52} fill={C.info} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 20, letterSpacing: 2}}>LUA CHEIA</text>
            <rect x={0} y={64} width={520 * K(t, 75.6, 76.6)} height={26} rx={4} fill="#f3e9c8" />
            <text x={520} y={52} textAnchor="end" fill={C.info} style={{fontFamily: F.titulo, fontSize: 24}}>~0,25</text>
            <text x={0} y={138} fill={C.info} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 20, letterSpacing: 2}}>SEM LUA</text>
            <rect x={0} y={150} width={Math.max(4, 5 * K(t, 76.4, 77))} height={26} rx={2} fill={C.perigo} />
            <text x={520} y={138} textAnchor="end" fill={C.info} style={{fontFamily: F.titulo, fontSize: 24}}>~0,002</text>
          </g>
        </svg>
      </Cena>

      {/* 11 — Lua × Vênus: 1.700 vezes */}
      <Cena from={83.6} to={93.0} zoom={0.03} fade={0.45}>
        {(() => {
          const sem = K(t, 88.1, 88.9);
          const vk = K(t, 89.4, 91.0);
          const vx = lerp(1640, 960, vk), vy = lerp(880, 560, vk);
          return (
            <svg width={1920} height={1080}>
              <g opacity={1 - sem}>
                <Lua x={460} y={560} r={190} on={1} id="lv" />
                <text x={460} y={820} textAnchor="middle" fill={C.cinza} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4}}>LUA CHEIA</text>
                {Array.from({length: 1700}, (_, i) => {
                  const c = i % 50, r = Math.floor(i / 50), show = i / 1700 < K(t, 84.8, 86.6);
                  return show ? <circle key={i} cx={900 + c * 17} cy={290 + r * 17} r={4.2} fill="#f3e9c8" opacity={0.85} /> : null;
                })}
                <text x={1325} y={900} textAnchor="middle" fill={C.cinza} opacity={K(t, 86.6, 87.2)} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 20, letterSpacing: 3}}>CADA PONTO = O BRILHO DE VÊNUS</text>
              </g>
              <circle cx={vx} cy={vy} r={lerp(4.2, 9, vk)} fill="#fff" />
              <circle cx={vx} cy={vy} r={lerp(8, 34, vk)} fill="#fff" opacity={0.15 + 0.15 * vk} />
              <g opacity={K(t, 90.6, 91.2)}>
                <circle cx={960} cy={560} r={70} fill="none" stroke={C.ouro} strokeWidth={2.5} />
                <text x={960} y={680} textAnchor="middle" fill={C.ouro} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 4}}>VÊNUS: O MAIS BRILHANTE DA NOITE</text>
              </g>
            </svg>
          );
        })()}
      </Cena>

      {/* 12 — O lado bonito: estrelas e Via Láctea sobre o sertão */}
      <Cena from={93.0} to={105.2} zoom={0.04} fade={0.5}>
        <Sertao luz={0.06 + K(t, 99, 102) * 0.05} lua={0} estrelas={0.25 + 0.75 * K(t, 94.0, 98.6)} via={K(t, 99.2, 101.8)} />
      </Cena>

      {/* 13 — Parque do Desengano (mapa real) */}
      <Cena from={105.2} to={112.4} zoom={0} fade={0.45}>
        {(() => {
          const z = K(t, 105.6, 108.2) * (1 - K(t, 110.2, 111.6));
          const center: [number, number] = [lerp(-54, -42.2, z), lerp(-15, -22, z)];
          const scale = Math.exp(lerp(Math.log(lerp(1500, 900, K(t, 110.2, 111.6))), Math.log(11000), z));
          return (
            <Mapa center={center} scale={scale} todos={false} extra={(proj) => {
              const p = pt(proj, ANCORA.lon, ANCORA.lat);
              const pulse = 1 + 0.3 * Math.sin(t * 4);
              return (
                <g>
                  <circle cx={p[0]} cy={p[1]} r={40 * pulse} fill={C.impacto} opacity={0.18} />
                  <Pin p={p} cor={C.impacto} lado="e" label={z > 0.5 ? 'PARQUE ESTADUAL DO DESENGANO' : '1º PARQUE DE CÉU ESCURO DA AMÉRICA LATINA (2021)'} op={K(t, 106.2, 106.8)} />
                </g>
              );
            }} />
          );
        })()}
      </Cena>

      {/* 14 — O Brasil inteiro com céu de parque… menos onde tem poste */}
      <Cena from={112.4} to={119.5} zoom={0.03} fade={0.5}>
        <Mapa center={[-53, -15]} scale={1500} todos={false} costaBR={0.6} extra={(proj) => (
          <g>
            {PONTOS_BR.map(([lon, lat, r], i) => {
              const p = pt(proj, lon, lat);
              let dimByCity = 1;
              for (const [cl, ca, cs] of CIDADES) {
                const q = pt(proj, cl, ca); const d = Math.hypot(p[0] - q[0], p[1] - q[1]);
                if (d < 70 * cs) dimByCity = Math.min(dimByCity, d / (70 * cs));
              }
              const k = K(t, 112.6 + r * 1.6, 113.4 + r * 1.6);
              const city = K(t, 116.0, 117.2);
              return <circle key={i} cx={p[0]} cy={p[1]} r={1 + r * 1.3} fill="#fff" opacity={k * (0.45 + 0.5 * r) * lerp(1, dimByCity, city)} />;
            })}
            {CIDADES.map(([cl, ca, cs], i) => {
              const q = pt(proj, cl, ca); const k = K(t, 116.0 + i * 0.05, 117.0);
              return <circle key={'c' + i} cx={q[0]} cy={q[1]} r={60 * cs * k} fill="#ffb347" opacity={0.28 * k} />;
            })}
          </g>
        )} />
        <svg width={1920} height={1080} style={{opacity: K(t, 116.4, 117.0)}}>
          <Rotulo x={1560} y={930} anchor="end" cor="#ffb347" size={20}>LUZ DAS CIDADES APAGA AS ESTRELAS</Rotulo>
        </svg>
      </Cena>
    </>
  );
};

export const HUD_EVS = [
  {a: 38.6, b: 46.0, s0: 0, s1: 0, v0: 0, v1: 0},
  {a: 49.4, b: 56.0, s0: 49.8, s1: 51.1, v0: 0, v1: 1.3},
  {a: 68.3, b: 75.0, s0: 68.6, s1: 70.6, v0: 1.3, v1: 2 * 3600},
];
