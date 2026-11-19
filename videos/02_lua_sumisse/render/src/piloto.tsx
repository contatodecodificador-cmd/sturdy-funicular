import React from 'react';
import {AbsoluteFill, interpolate, Img, staticFile} from 'remotion';
import {geoContains, geoEquirectangular, geoPath} from 'd3-geo';
import {C, F} from './theme';
import {useT, Cena, Rotulo, Caixa} from './ui';
import {Mapa, Pin, prog, sm, clamp01} from './prims';
import {brasil, mundo, orto, pathOf, pt} from './geo';

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
export const K = (t: number, a: number, b: number) => sm(prog(t, a, b));

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

export const Acai: React.FC<{x: number; y: number; h: number; c: string; s?: number}> = ({x, y, h, c, s = 1}) => {
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
// =================== PERSONAGENS 2D ===================
const lim = (c: string, w: number) => ({stroke: c, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none'});
// Surfista em base agachada, de frente pra direita (pés em y=0, ~120 de altura)
export const Surfista: React.FC<{c: string; prancha: string; fase: number; borda?: string}> = ({c, prancha, fase, borda = 'rgba(255,220,170,0.35)'}) => {
  const b = Math.sin(fase) * 3, a = Math.sin(fase * 0.7) * 6;
  const hip: [number, number] = [0, -50 + b], sh: [number, number] = [10, -94 + b];
  return (
    <g>
      <path d="M-70,6 Q-10,-6 74,-2 Q84,2 72,8 Q0,14 -64,12 Z" fill={prancha} />
      <path d="M-70,6 Q-10,-6 74,-2" stroke="#fff" strokeOpacity={0.35} strokeWidth={2} fill="none" />
      <path d={`M-30,0 L-20,-26 L${hip[0]},${hip[1]}`} {...lim(c, 13)} />
      <path d={`M30,-2 L36,-30 L${hip[0] + 4},${hip[1]}`} {...lim(c, 13)} />
      <path d={`M${hip[0] - 9},${hip[1] + 4} L${hip[0] + 10},${hip[1] + 2} L${sh[0] + 13},${sh[1] + 4} L${sh[0] - 11},${sh[1] + 2} Z`} fill={c} stroke={c} strokeWidth={8} strokeLinejoin="round" />
      <path d={`M${sh[0] - 4},${sh[1] + 4} L-22,${-86 + b + a} L-48,${-74 + b + a}`} {...lim(c, 9)} />
      <path d={`M${sh[0] + 6},${sh[1] + 4} L36,${-100 + b - a} L62,${-108 + b - a}`} {...lim(c, 9)} />
      <circle cx={sh[0] + 6} cy={sh[1] - 16} r={12} fill={c} />
      <path d={`M${sh[0] - 4},${sh[1] - 22} q10,-12 22,-2`} stroke={borda} strokeWidth={3} fill="none" />
      <path d={`M${sh[0] - 11},${sh[1] + 2} L${hip[0] - 9},${hip[1] + 4}`} stroke={borda} strokeWidth={3} fill="none" />
    </g>
  );
};
// Pessoa andando (pés em y=0, ~180 de altura), com chapéu de couro
export const Andarilho: React.FC<{c: string; fase: number; borda?: string}> = ({c, fase, borda = 'rgba(190,210,255,0.28)'}) => {
  const perna = (s: number) => {
    const th = 0.42 * Math.sin(fase + s), kn = 0.55 * Math.max(0, Math.sin(fase + s + 1.6));
    const hip = [0, -92], k = [hip[0] + Math.sin(th) * 46, hip[1] + Math.cos(th) * 46];
    const f = [k[0] + Math.sin(th - kn) * 46, k[1] + Math.cos(th - kn) * 46];
    return `M${hip[0]},${hip[1]} L${k[0]},${k[1]} L${f[0]},${f[1]} l9,0`;
  };
  const braco = (s: number) => {
    const th = -0.38 * Math.sin(fase + s), sh = [4, -148], e = [sh[0] + Math.sin(th) * 32, sh[1] + Math.cos(th) * 32];
    const h = [e[0] + Math.sin(th + 0.35) * 30, e[1] + Math.cos(th + 0.35) * 30];
    return `M${sh[0]},${sh[1]} L${e[0]},${e[1]} L${h[0]},${h[1]}`;
  };
  const bob = Math.abs(Math.sin(fase)) * -3;
  return (
    <g transform={`translate(0,${bob})`}>
      <path d={perna(Math.PI)} {...lim(c, 15)} opacity={0.85} />
      <path d={braco(0)} {...lim(c, 11)} opacity={0.85} />
      <path d="M-14,-96 L14,-96 L17,-150 L-11,-152 Z" fill={c} stroke={c} strokeWidth={10} strokeLinejoin="round" />
      <path d={perna(0)} {...lim(c, 15)} />
      <path d={braco(Math.PI)} {...lim(c, 11)} />
      <rect x={-2} y={-166} width={10} height={12} fill={c} />
      <circle cx={4} cy={-174} r={13} fill={c} />
      {/* chapéu de couro: aba em meia-lua virada pra cima + copa */}
      <path d="M-30,-188 Q4,-176 40,-190 Q32,-178 4,-177 Q-22,-178 -30,-188 Z" fill={c} stroke={c} strokeWidth={3} />
      <path d="M-11,-182 Q4,-208 19,-182 Z" fill={c} />
      <path d="M-30,-188 Q4,-176 40,-190" stroke={borda} strokeWidth={2.5} fill="none" />
      <path d="M17,-150 L14,-96" stroke={borda} strokeWidth={3} fill="none" />
    </g>
  );
};
// Mandacaru (Cereus jamacaru): tronco grosso e braços em candelabro
export const Mandacaru2: React.FC<{x: number; y: number; h: number; c: string; s?: number; seed?: number; borda?: string}> = ({x, y, h, c, s = 1, seed = 0, borda}) => {
  const w = 26 * s;
  const bracos = [0, 1, 2, 3].map((i) => {
    const lado = i % 2 === 0 ? 1 : -1, y0 = y - h * (0.32 + 0.12 * i + rnd(seed + i) * 0.06), dx = (34 + rnd(seed + i + 9) * 26) * s * lado, alt = h * (0.28 + rnd(seed + i + 5) * 0.22);
    return `M${x},${y0} L${x + dx - 14 * s * lado},${y0} Q${x + dx},${y0} ${x + dx},${y0 - 16 * s} L${x + dx},${y0 - alt}`;
  });
  return (
    <g>
      {bracos.map((d, i) => <path key={i} d={d} {...lim(c, w * 0.78)} />)}
      <path d={`M${x},${y} L${x},${y - h}`} {...lim(c, w)} />
      {borda && <path d={`M${x + w * 0.32},${y} L${x + w * 0.32},${y - h}`} stroke={borda} strokeWidth={2} />}
    </g>
  );
};
export const Juazeiro: React.FC<{x: number; y: number; s: number; c: string}> = ({x, y, s, c}) => (
  <g fill={c}>
    <path d={`M${x - 6 * s},${y} L${x - 4 * s},${y - 40 * s} L${x - 22 * s},${y - 64 * s} M${x - 4 * s},${y - 40 * s} L${x + 18 * s},${y - 66 * s}`} {...lim(c, 8 * s)} />
    {[[-40, -78, 34], [-8, -96, 40], [30, -80, 34], [0, -70, 30], [-26, -64, 24], [26, -62, 24]].map(([a, b, r], i) => <circle key={i} cx={x + a * s} cy={y + b * s} r={r * s} />)}
  </g>
);
const CasaTaipa: React.FC<{x: number; y: number; c: string; janela: number}> = ({x, y, c, janela}) => (
  <g>
    <rect x={x} y={y - 46} width={80} height={46} fill={c} />
    <path d={`M${x - 8},${y - 44} L${x + 40},${y - 74} L${x + 88},${y - 44} Z`} fill={c} />
    <rect x={x + 14} y={y - 32} width={16} height={16} fill={`rgba(255,190,100,${janela})`} />
    <rect x={x + 46} y={y - 36} width={18} height={36} fill="rgba(0,0,0,0.5)" />
    {janela > 0 && <circle cx={x + 22} cy={y - 24} r={30} fill="rgba(255,180,90,0.12)" />}
  </g>
);

// =================== RIO AMAZÔNICO + POROROCA (v2) ===================
const MATA_F = Array.from({length: 60}, (_, i) => ({x: i * 34 - 20, h: 26 + rnd(i + 1300) * 34}));
const MATA = Array.from({length: 46}, (_, i) => ({x: i * 44 - 20 + rnd(i + 300) * 20, h: 40 + rnd(i + 400) * 60}));
const ACAIS = Array.from({length: 13}, (_, i) => ({x: 60 + i * 150 + rnd(i + 500) * 70, h: 120 + rnd(i + 600) * 70}));
export const Palafita: React.FC<{x: number; y: number; c: string; luz: number; s?: number; noite: number}> = ({x, y, c, luz, s = 1, noite}) => {
  const mad = `rgb(${lerp(122, 40, noite)},${lerp(86, 30, noite)},${lerp(56, 26, noite)})`;
  const tel = `rgb(${lerp(150, 46, noite)},${lerp(70, 26, noite)},${lerp(44, 22, noite)})`;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[6, 30, 54, 78].map((px) => <rect key={px} x={px} y={-6} width={4} height={30} fill={c} />)}
      <rect x={-4} y={-10} width={110} height={6} fill={c} />
      <rect x={2} y={-58} width={84} height={48} fill={mad} />
      {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={2} x2={86} y1={-50 + i * 8} y2={-50 + i * 8} stroke="rgba(0,0,0,0.25)" strokeWidth={1.5} />)}
      <path d="M-8,-56 L44,-82 L96,-56 Z" fill={tel} />
      <rect x={12} y={-44} width={18} height={14} fill={`rgba(255,196,110,${luz})`} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
      <rect x={52} y={-46} width={18} height={36} fill="rgba(20,12,8,0.85)" />
      <path d="M86,-10 L104,-10 L104,-26" stroke={c} strokeWidth={3} fill="none" />
    </g>
  );
};
export const Rio: React.FC<{noite: number; lua: number; luaGhost?: number; onda: number; ondaAlt: number; lx?: number; ly?: number; festival?: number; parados?: number; canoa?: boolean}> = ({noite, lua, luaGhost = 0, onda, ondaAlt, lx = 1540, ly = 330, festival = 0, parados = 0, canoa = true}) => {
  const t = useT();
  const hz = 600;
  const ceuTop = `rgb(${lerp(40, 8, noite)},${lerp(52, 14, noite)},${lerp(98, 30, noite)})`;
  const ceuBase = `rgb(${lerp(236, 26, noite)},${lerp(146, 38, noite)},${lerp(88, 62, noite)})`;
  const mataLonge = `rgb(${lerp(70, 14, noite)},${lerp(70, 22, noite)},${lerp(78, 36, noite)})`;
  const mata = `rgb(${lerp(24, 6, noite)},${lerp(34, 10, noite)},${lerp(28, 16, noite)})`;
  const agua1 = `rgb(${lerp(178, 30, noite)},${lerp(124, 38, noite)},${lerp(84, 54, noite)})`;
  const agua2 = `rgb(${lerp(96, 14, noite)},${lerp(72, 20, noite)},${lerp(52, 32, noite)})`;
  const fx = lerp(-200, 2150, onda), wy = 760, A = ondaAlt;
  const crest = Array.from({length: 40}, (_, i) => `${fx - i * 40},${wy - A - 6 * Math.sin(i * 0.9 + t * 5)}`).join(' ');
  const corpo = '#120e0b';
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080}>
        <defs>
          <linearGradient id="rceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={ceuTop} /><stop offset="100%" stopColor={ceuBase} /></linearGradient>
          <linearGradient id="ragua" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={agua1} /><stop offset="100%" stopColor={agua2} /></linearGradient>
        </defs>
        <rect width={1920} height={hz + 30} fill="url(#rceu)" />
      </svg>
      <AbsoluteFill style={{opacity: noite * 0.9}}><Estrelas k={0.35} /></AbsoluteFill>
      <svg width={1920} height={1080}>
        <Lua x={lx} y={ly} r={70} on={lua} ghost={luaGhost} id="rio" />
        <path d={`M0,${hz - 20} ` + MATA_F.map((m) => `Q${m.x + 17},${hz - 20 - m.h} ${m.x + 34},${hz - 20}`).join(' ') + ` L1920,${hz + 20} L0,${hz + 20} Z`} fill={mataLonge} />
        <path d={`M0,${hz} ` + MATA.map((m) => `Q${m.x + 22},${hz - m.h} ${m.x + 44},${hz}`).join(' ') + ` L1920,${hz + 30} L0,${hz + 30} Z`} fill={mata} />
        {ACAIS.map((a, i) => <Acai key={i} x={a.x} y={hz - 20} h={a.h} c={mata} s={1} />)}
        <Palafita x={1180} y={hz + 6} c={mata} luz={0.35 + 0.6 * noite} s={0.9} noite={noite} />
        <Palafita x={1310} y={hz + 8} c={mata} luz={0.0} s={0.7} noite={noite} />
        <Palafita x={260} y={hz + 6} c={mata} luz={0.3 + 0.6 * noite} s={0.8} noite={noite} />
        <rect y={hz + 22} width={1920} height={1080 - hz} fill="url(#ragua)" />
        {Array.from({length: 26}, (_, i) => {
          const y = hz + 40 + (i % 13) * 34, x = ((i * 157 - t * (20 + (i % 3) * 8)) % 2100 + 2100) % 2100 - 100;
          return <rect key={'w' + i} x={x} y={y} width={60 + (i % 4) * 30} height={2.5} rx={1.2} fill="#fff" opacity={0.07 + 0.05 * (1 - noite)} />;
        })}
        {lua > 0.01 && Array.from({length: 9}, (_, i) => <rect key={i} x={lx - 60 + Math.sin(t * 2 + i) * 14} y={hz + 40 + i * 30} width={120 - i * 8} height={4} rx={2} fill="#fff3d0" opacity={0.35 * lua} />)}
        {/* canoa com ribeirinho, na frente da onda */}
        {canoa && (() => {
          const cx = 1180 + Math.sin(t * 0.6) * 6, cy = 880 + Math.sin(t * 1.4) * 3;
          return (
            <g transform={`translate(${cx},${cy})`} opacity={fx < 1060 ? 1 : 1 - clamp01((fx - 1060) / 120)}>
              <path d="M-90,-6 Q0,22 90,-10 L80,-2 Q0,26 -80,4 Z" fill={corpo} />
              <path d="M10,-6 L12,-40 M12,-50 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0" stroke={corpo} strokeWidth={10} strokeLinecap="round" fill={corpo} />
              <path d="M12,-34 L-14,-24 L-30,14" stroke={corpo} strokeWidth={6} strokeLinecap="round" fill="none" />
              <path d="M-36,4 L-26,26" stroke={corpo} strokeWidth={8} strokeLinecap="round" />
            </g>
          );
        })()}
        {Array.from({length: 10}, (_, i) => {
          const x = ((i * 230 - t * 60) % 2300 + 2300) % 2300 - 200, y = 820 + (i % 3) * 70;
          return x > fx + 160 ? <path key={i} d={`M${x + 50},${y} L${x},${y} M${x + 12},${y - 7} L${x},${y} L${x + 12},${y + 7}`} stroke="#e6d6bb" strokeOpacity={0.4 * (1 - noite * 0.4)} strokeWidth={2.5} fill="none" /> : null;
        })}
        {onda > 0 && A > 1 && (() => {
          const lama = `rgb(${lerp(158, 56, noite)},${lerp(110, 42, noite)},${lerp(66, 30, noite)})`;
          const lama2 = `rgb(${lerp(126, 42, noite)},${lerp(88, 33, noite)},${lerp(52, 26, noite)})`;
          return (
            <g>
              <defs>
                <linearGradient id="lamaFade" gradientUnits="userSpaceOnUse" x1={fx - 420} y1={0} x2={fx + 60} y2={0}>
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
              {[0, 1, 2].map((i) => (
                <g key={i} transform={`translate(${fx - 150 - i * 320},${wy - A - 8 + Math.sin(t * 3 + i) * 3}) scale(${1.25 - i * 0.12})`}>
                  <Surfista c={corpo} prancha={['#e9c46a', '#e76f51', '#8ecae6'][i]} fase={t * 2.4 + i * 1.3} />
                </g>
              ))}
            </g>
          );
        })()}
        {festival > 0 && (
          <g opacity={festival}>
            {Array.from({length: 7}, (_, i) => {
              const x = 420 + i * 110, h = 60 + (i % 3) * 14, cs = ['#e76f51', '#2a9d8f', '#e9c46a', '#f4a261', '#8ecae6', '#e63946', '#90be6d'][i];
              return <g key={'cs' + i}><rect x={x} y={hz + 18 - h} width={96} height={h} fill={cs} opacity={lerp(1, 0.45, noite)} /><path d={`M${x - 6},${hz + 20 - h} L${x + 48},${hz - 8 - h} L${x + 102},${hz + 20 - h} Z`} fill="#7a3b26" opacity={lerp(1, 0.5, noite)} /><rect x={x + 38} y={hz - 18} width={20} height={34} fill="#3a2418" /></g>;
            })}
            <path d={`M380,${hz - 120} Q800,${hz - 70} 1240,${hz - 120}`} stroke="#ddd" strokeWidth={1.5} fill="none" />
            {Array.from({length: 22}, (_, i) => { const k = i / 21, x = lerp(380, 1240, k), y = hz - 120 + Math.sin(k * Math.PI) * 50; return <path key={'bd' + i} d={`M${x - 10},${y} L${x + 10},${y} L${x},${y + 18} Z`} fill={['#e63946', '#f4c430', '#2ba84a', '#1e6fd9'][i % 4]} />; })}
          </g>
        )}
        {parados > 0 && [0, 1, 2].map((i) => (
          <g key={'pa' + i} opacity={parados} transform={`translate(${520 + i * 300},${800 + Math.sin(t * 1.2 + i) * 4})`}>
            <path d="M-70,6 Q-10,-6 74,-2 Q84,2 72,8 Q0,14 -64,12 Z" fill={['#e9c46a', '#e76f51', '#8ecae6'][i]} />
            <path d="M-10,0 L-26,34 M10,0 L24,34" stroke={corpo} strokeWidth={12} strokeLinecap="round" />
            <path d="M-12,2 L12,2 L8,-44 L-8,-44 Z" fill={corpo} stroke={corpo} strokeWidth={8} strokeLinejoin="round" />
            <circle cx={0} cy={-60} r={12} fill={corpo} />
            <path d="M-6,-38 L-22,-10 M6,-38 L22,-10" stroke={corpo} strokeWidth={8} strokeLinecap="round" />
          </g>
        ))}
        {/* vegetação da margem de cá (aninga) */}
        {Array.from({length: 7}, (_, i) => <path key={'an' + i} d={`M${i * 30 - 20},1080 Q${i * 30 - 10},${980 - (i % 3) * 30} ${i * 30 + 10},${950 - (i % 2) * 40} Q${i * 30 + 4},${990} ${i * 30 + 6},1080 Z`} fill="#06080a" />)}
        {Array.from({length: 6}, (_, i) => <path key={'an2' + i} d={`M${1960 - i * 34},1080 Q${1950 - i * 34},${990 - (i % 3) * 30} ${1920 - i * 34},${960 - (i % 2) * 36} Q${1930 - i * 34},${1000} ${1928 - i * 34},1080 Z`} fill="#06080a" />)}
      </svg>
    </AbsoluteFill>
  );
};

// =================== SÃO LUÍS (casarões + rua de paralelepípedo + lampiões) ===================
const CASAS = Array.from({length: 9}, (_, i) => ({w: 200 + rnd(i + 20) * 70, h: 260 + rnd(i + 30) * 130, cor: ['#2f4a6e', '#5a3f3a', '#3d5a52', '#4a4166', '#2f4a6e', '#6a5236', '#3d5a52', '#4a4166', '#5a3f3a'][i], az: i % 2 === 0}));
const PEDRAS = Array.from({length: 260}, (_, i) => {
  const row = Math.floor(i / 26), col = i % 26, h = 18 + row * 6, y = 812 + row * (h * 0.9) + row * row * 1.2;
  return {x: col * 78 + (row % 2) * 39 - 30 + rnd(i + 3000) * 6, y, w: 66 + rnd(i + 3100) * 8, h};
});
const Lampiao: React.FC<{x: number; y: number; on: number}> = ({x, y, on}) => (
  <g>
    <defs><radialGradient id="lg"><stop offset="0%" stopColor="#ffc472" stopOpacity={0.35} /><stop offset="100%" stopColor="#ffc472" stopOpacity={0} /></radialGradient></defs>
    <circle cx={x} cy={y - 226} r={90} fill="url(#lg)" opacity={on} />
    <ellipse cx={x} cy={y + 34} rx={170} ry={30} fill="url(#lg)" opacity={on} />
    <rect x={x - 5} y={y - 200} width={10} height={200} fill="#14110f" />
    <rect x={x - 16} y={y - 8} width={32} height={12} rx={3} fill="#14110f" />
    <path d={`M${x - 20},${y - 200} L${x + 20},${y - 200} L${x + 14},${y - 250} L${x - 14},${y - 250} Z`} fill={`rgba(255,205,130,${0.25 + 0.7 * on})`} stroke="#14110f" strokeWidth={4} />
    <path d={`M${x - 22},${y - 250} L${x},${y - 266} L${x + 22},${y - 250} Z`} fill="#14110f" />
  </g>
);
export const SaoLuis: React.FC<{luz: number; lua: number; lamp?: number}> = ({luz, lua, lamp = 1}) => {
  const base = 760;
  let x = -40;
  const casas = CASAS.map((c) => { const o = {...c, x}; x += c.w + 6; return o; });
  const dim = lerp(0.1, 1, luz);
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
          <linearGradient id="rua" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={`rgb(${lerp(10, 58, luz)},${lerp(12, 60, luz)},${lerp(18, 72, luz)})`} /><stop offset="100%" stopColor={`rgb(${lerp(5, 30, luz)},${lerp(6, 32, luz)},${lerp(9, 42, luz)})`} /></linearGradient>
        </defs>
        <Lua x={1560} y={250} r={78} on={lua} id="sl" />
        {casas.map((c, i) => {
          const top = base - c.h, cols = Math.max(2, Math.floor(c.w / 70));
          return (
            <g key={i}>
              <path d={`M${c.x - 8},${top} L${c.x + c.w + 8},${top} L${c.x + c.w - 14},${top - 34} L${c.x + 14},${top - 34} Z`} fill={`rgba(120,60,35,${dim})`} />
              <rect x={c.x} y={top} width={c.w} height={c.h} fill={c.cor} opacity={dim} />
              {c.az && <rect x={c.x} y={top} width={c.w} height={c.h} fill="url(#azul)" opacity={0.42 * dim} />}
              <rect x={c.x} y={top + c.h * 0.5 - 6} width={c.w} height={6} fill="#e8e0cc" opacity={0.6 * dim} />
              {[0, 1].map((row) => Array.from({length: cols}, (_, j) => {
                const wx = c.x + (c.w / cols) * (j + 0.5) - 18, wy = top + 40 + row * (c.h * 0.5);
                const lit = rnd(i * 10 + j + row * 5) > 0.45, porta = row === 1 && j === Math.floor(cols / 2);
                const hh = porta ? c.h * 0.5 - 40 : 70;
                return (
                  <g key={row + '-' + j}>
                    <path d={`M${wx},${wy + hh} L${wx},${wy + 18} A18,18 0 0 1 ${wx + 36},${wy + 18} L${wx + 36},${wy + hh} Z`} fill={porta ? '#2a1a12' : lit ? `rgba(255,205,120,${0.55 + 0.35 * luz})` : 'rgba(10,14,24,0.8)'} stroke="#e8e0cc" strokeOpacity={0.5 * dim} strokeWidth={3} />
                    {row === 0 && <path d={`M${wx - 8},${wy + 72} L${wx + 44},${wy + 72} M${wx - 8},${wy + 72} L${wx - 8},${wy + 92} M${wx + 44},${wy + 72} L${wx + 44},${wy + 92} M${wx - 8},${wy + 90} L${wx + 44},${wy + 90}`} stroke="#151515" strokeOpacity={0.85} strokeWidth={3} />}
                  </g>
                );
              }))}
            </g>
          );
        })}
        {/* calçada */}
        <rect y={base} width={1920} height={40} fill={`rgb(${lerp(16, 120, luz)},${lerp(16, 112, luz)},${lerp(18, 104, luz)})`} />
        <rect y={base + 40} width={1920} height={8} fill={`rgb(${lerp(10, 70, luz)},${lerp(10, 66, luz)},${lerp(12, 64, luz)})`} />
        {/* rua de paralelepípedo */}
        <rect y={base + 48} width={1920} height={1080 - base} fill="url(#rua)" />
        {PEDRAS.map((p, i) => <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={p.h * 0.35} fill={`rgba(${lerp(30, 120, luz)},${lerp(32, 118, luz)},${lerp(40, 128, luz)},0.55)`} />)}
        <ellipse cx={1560} cy={960} rx={240} ry={40} fill="#cfe0ff" opacity={0.06 * lua} />
        {[320, 980, 1640].map((lx) => <Lampiao key={lx} x={lx} y={base + 6} on={lamp} />)}
      </svg>
    </AbsoluteFill>
  );
};

// =================== SERTÃO (v2) ===================
export const Sertao: React.FC<{luz: number; lua: number; estrelas: number; via?: number; andar?: number}> = ({luz, lua, estrelas, via = 0, andar = 0}) => {
  const t = useT();
  const hz = 640;
  const sky1 = `rgb(${lerp(3, 14, luz)},${lerp(5, 26, luz)},${lerp(10, 58, luz)})`;
  const sky2 = `rgb(${lerp(5, 46, luz)},${lerp(8, 66, luz)},${lerp(14, 104, luz)})`;
  const chao = `rgb(${lerp(7, 92, luz)},${lerp(7, 76, luz)},${lerp(9, 58, luz)})`;
  const sil = `rgb(${lerp(2, 20, luz)},${lerp(3, 24, luz)},${lerp(5, 32, luz)})`;
  const estrada = `rgb(${lerp(12, 150, luz)},${lerp(10, 124, luz)},${lerp(10, 92, luz)})`;
  const borda = `rgba(200,215,255,${0.08 + 0.3 * luz})`;
  return (
    <AbsoluteFill style={{background: `linear-gradient(${sky1}, ${sky2} 59%, ${sky2})`}}>
      <AbsoluteFill style={{opacity: estrelas * (1 - via)}}><Estrelas k={lerp(0.25, 1, estrelas)} /></AbsoluteFill>
      {via > 0 && <Img src={staticFile('via_lactea.jpg')} style={{position: 'absolute', width: 1920, height: 1080, opacity: via, transform: `scale(${1.06 + 0.03 * via}) translateX(${-(t % 30) * 1.2}px)`}} />}
      <svg width={1920} height={1080}>
        <Lua x={1540} y={280} r={64} on={lua} id="st" />
        <path d={`M0,${hz} Q300,${hz - 40} 620,${hz - 8} T1300,${hz - 20} T1920,${hz} L1920,1080 L0,1080 Z`} fill={chao} />
        <path d={`M0,${hz} Q300,${hz - 40} 620,${hz - 8} T1300,${hz - 20} T1920,${hz}`} stroke={borda} strokeWidth={2} fill="none" />
        <path d={`M930,${hz - 2} L990,${hz - 2} L1520,1080 L360,1080 Z`} fill={estrada} />
        {Array.from({length: 40}, (_, i) => <circle key={'pd' + i} cx={480 + rnd(i + 900) * 960} cy={hz + 30 + rnd(i + 910) ** 2 * 420} r={1.5 + rnd(i + 920) * 3} fill={sil} opacity={0.5} />)}
        {/* cerca ao longo da estrada */}
        {Array.from({length: 9}, (_, i) => { const k = i / 8, px = lerp(900, 120, k), py = lerp(hz + 4, 1060, k), h = lerp(14, 120, k); return <rect key={'c' + i} x={px} y={py - h} width={lerp(2, 12, k)} height={h} fill={sil} />; })}
        <path d={`M900,${hz - 6} L120,${1060 - 96}`} stroke={sil} strokeWidth={2} />
        <path d={`M900,${hz - 2} L120,${1060 - 50}`} stroke={sil} strokeWidth={2} />
        <CasaTaipa x={1500} y={hz - 6} c={sil} janela={lerp(0.9, 0.6, luz)} />
        <Juazeiro x={1660} y={hz + 6} s={1.1} c={sil} />
        <Juazeiro x={700} y={hz} s={0.7} c={sil} />
        <Mandacaru2 x={560} y={hz + 40} h={120} c={sil} s={0.6} seed={3} />
        <Mandacaru2 x={1360} y={hz + 30} h={100} c={sil} s={0.5} seed={7} />
        <Mandacaru2 x={260} y={1010} h={440} c={sil} s={1.7} seed={11} borda={borda} />
        <Mandacaru2 x={1740} y={980} h={360} c={sil} s={1.45} seed={17} borda={borda} />
        {andar > 0 && <g transform={`translate(${lerp(1110, 1180, andar)},${lerp(930, 960, andar)}) scale(1.45)`}><Andarilho c={sil} fase={t * 4.2} borda={borda} /></g>}
      </svg>
    </AbsoluteFill>
  );
};

// =================== FUNDOS REAIS + MAPAS REAIS ===================
export const EspacoReal: React.FC<{drift?: number; dim?: number}> = ({drift = 1, dim = 1}) => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: '#03050a'}}>
      <Img src={staticFile('espaco.jpg')} style={{position: 'absolute', width: 1920, height: 1080, opacity: dim, transform: `scale(1.14) translate(${Math.sin(t * 0.035) * Math.min(90, 30 * drift)}px, ${Math.cos(t * 0.027) * Math.min(40, 12 * drift)}px)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 45% at 75% 30%, rgba(30,120,130,0.22), transparent 70%), radial-gradient(ellipse 50% 40% at 18% 72%, rgba(40,70,150,0.20), transparent 70%)', mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)'}} />
    </AbsoluteFill>
  );
};
const IMG_BOX = {lon0: -82, lon1: -26, lat0: 10, lat1: -40};
export const projEq = (lonC: number, latC: number, s: number) => (lon: number, lat: number): [number, number] => [960 + (lon - lonC) * s, 540 - (lat - latC) * s];
export const MapaReal: React.FC<{lonC: number; latC: number; s: number; noite?: number; luzes?: number; children?: (p: (lon: number, lat: number) => [number, number]) => React.ReactNode}> = ({lonC, latC, s, noite = 0, luzes = 0, children}) => {
  const p = projEq(lonC, latC, s);
  const [x0, y0] = p(IMG_BOX.lon0, IMG_BOX.lat0);
  const w = (IMG_BOX.lon1 - IMG_BOX.lon0) * s, h = (IMG_BOX.lat0 - IMG_BOX.lat1) * s;
  const proj = geoEquirectangular().scale((s * 180) / Math.PI).center([lonC, latC]).translate([960, 540]);
  const contorno = geoPath(proj)(brasil) || '';
  const mask = 'radial-gradient(ellipse 50% 50% at 50% 50%, black 72%, transparent 100%)';
  const imgStyle = (extra: React.CSSProperties): React.CSSProperties => ({position: 'absolute', left: x0, top: y0, width: w, height: h, WebkitMaskImage: mask, maskImage: mask, ...extra});
  return (
    <AbsoluteFill style={{background: '#04101f'}}>
      {noite < 1 && <Img src={staticFile('mapa_br.jpg')} style={imgStyle({opacity: 1 - noite, filter: 'brightness(0.7) saturate(0.85) contrast(1.06)'})} />}
      {noite > 0 && <Img src={staticFile('noite_br.jpg')} style={imgStyle({opacity: noite, filter: `brightness(${lerp(0.45, 1.25, luzes)}) saturate(${lerp(0.2, 1, luzes)})`})} />}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,12,28,0.35), rgba(6,12,28,0.15) 40%, rgba(6,12,28,0.45))'}} />
      <svg width={1920} height={1080}>
        <path d={contorno} fill="none" stroke={C.ouro} strokeOpacity={0.55} strokeWidth={1.6} />
        {children && children(p)}
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};
// rótulo HTML fixo (não escala com zoom)
export const Tag: React.FC<{x: number; y: number; cor?: string; children: React.ReactNode; op?: number; anchor?: 'start' | 'middle' | 'end'; size?: number}> = ({x, y, cor = C.ouro, children, op = 1, anchor = 'start', size = 22}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: op, transform: `translate(${anchor === 'start' ? '0' : anchor === 'middle' ? '-50%' : '-100%'}, -50%)`,
    padding: '7px 16px', borderRadius: 8, background: 'rgba(6,10,20,0.8)', borderLeft: `3px solid ${cor}`, boxShadow: '0 6px 20px rgba(0,0,0,0.45)',
    fontFamily: F.rotulo, fontWeight: 700, fontSize: size, letterSpacing: 2.5, color: C.info, whiteSpace: 'nowrap'}}>{children}</div>
);

// =================== CRONÔMETRO ===================
const two = (n: number) => String(Math.floor(n)).padStart(2, '0');
export const fmtCron = (s: number) => {
  const D = 86400, A = 365.25 * D;
  if (s < D) return `${two(s / 3600)}:${two((s % 3600) / 60)}:${two(s % 60)},${Math.floor((s * 10) % 10)}`;
  if (s < 60 * D) return `${Math.floor(s / D)} ${Math.floor(s / D) === 1 ? 'DIA' : 'DIAS'} ${two((s % D) / 3600)}:${two((s % 3600) / 60)}`;
  if (s < A) return `${Math.floor(s / (30.44 * D))} MESES`;
  if (s < 100 * A) { const a = Math.floor(s / A), m = Math.floor((s - a * A) / (30.44 * D)); return `${a} ${a === 1 ? 'ANO' : 'ANOS'}${m ? ` E ${m} ${m === 1 ? 'MÊS' : 'MESES'}` : ''}`; }
  return `${Math.round(s / A).toLocaleString('pt-BR')} DE ANOS`;
};
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
  const v = e.v0 > 0 && e.v1 / e.v0 > 20 ? Math.exp(Math.log(e.v0) + (Math.log(e.v1) - Math.log(e.v0)) * kk) : e.v0 + (e.v1 - e.v0) * kk;
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

export const Painel: React.FC<{x: number; k: number; titulo: string; children: React.ReactNode}> = ({x, k, titulo, children}) => (
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
export const ANCORA = {lon: -41.95, lat: -21.87}; // Parque Estadual do Desengano (RJ)
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
  const fxOnda = lerp(-200, 2150, prog(t, 3.0, 12.8) * 0.9);
  return (
    <>
      {/* 1 — Rio ao entardecer, Lua nasce, pororoca sobe o rio */}
      <Cena from={0} to={12.7} zoom={0.05} fade={0.5} fixo={
        <>
          <Tag x={1660} y={960} cor={C.dado} anchor="end" op={K(t, 6.3, 7.0) * (1 - K(t, 10.2, 10.8))}>← CORRENTEZA DO RIO</Tag>
          <Tag x={Math.min(1640, fxOnda - 60)} y={600} cor={C.ouro} anchor="end" op={K(t, 6.3, 7.0) * (1 - K(t, 10.2, 10.8))}>A ONDA SOBE O RIO →</Tag>
          <div style={{position: 'absolute', top: 360, width: '100%', display: 'flex', justifyContent: 'center', opacity: K(t, 10.9, 11.4), transform: `scale(${lerp(0.94, 1, K(t, 10.9, 11.6))})`}}>
            <Caixa cor={C.ouro} size={96}>POROROCA</Caixa>
          </div>
        </>
      }>
        <Rio noite={K(t, 0, 12)} lua={K(t, 0.2, 3)} ly={lerp(470, 300, K(t, 0, 10))} onda={prog(t, 3.0, 12.8) * 0.9} ondaAlt={lerp(0, 80, K(t, 3, 5))} />
      </Cena>

      {/* 2 — A Lua some; a onda baixa */}
      <Cena from={12.7} to={21.2} zoom={0.03} fade={0.4} fixo={
        <svg width={1920} height={1080}>
          {[{x: 1360, at: 16.6, ic: 'exp', txt: 'SEM EXPLOSÃO'}, {x: 1720, at: 17.7, ic: 'rock', txt: 'SEM PEDAÇOS'}].map((c, i) => {
            const k = K(t, c.at, c.at + 0.35) * (1 - K(t, 19.0, 19.5));
            return (
              <g key={i} opacity={k} transform={`translate(${c.x},420)`}>
                <circle r={74} fill="rgba(6,10,20,0.75)" stroke={C.perigo} strokeOpacity={0.5} strokeWidth={2} />
                {c.ic === 'exp' ? <path d="M0,-44 L11,-14 L40,-18 L18,4 L32,34 L2,18 L-26,37 L-16,6 L-42,-12 L-10,-12 Z" fill={C.perigo} opacity={0.85} /> : <path d="M-30,-8 L-10,-32 L22,-26 L36,4 L16,30 L-20,26 Z" fill="#9a907f" />}
                <line x1={-50} y1={-50} x2={50} y2={50} stroke={C.info} strokeWidth={7} strokeLinecap="round" />
                <text y={112} textAnchor="middle" fill={C.info} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 3}}>{c.txt}</text>
              </g>
            );
          })}
        </svg>
      }>
        <Rio noite={1} lua={1 - K(t, 15.25, 15.75)} luaGhost={K(t, 15.6, 16.4)} onda={0.62 + prog(t, 12.7, 21.2) * 0.12} ondaAlt={lerp(80, 0, K(t, 16, 20))} />
      </Cena>

      {/* 3 — Tríptico de perguntas → ampulheta (fundo real do espaço) */}
      <Cena from={21.2} to={31.0} zoom={0.04} fade={0.45} fixo={
        <>
          <svg width={1920} height={1080}>
            <g opacity={1 - K(t, 26.6, 27.2)}>
              <Painel x={420} k={K(t, 21.9, 22.4)} titulo="1ª NOITE">
                <rect x={-250} y={-230} width={500} height={330} rx={24} fill="#070c18" />
                {Array.from({length: 40}, (_, i) => <circle key={i} cx={rnd(i + 200) * 460 - 230} cy={rnd(i + 210) * 260 - 220} r={1 + rnd(i + 220) * 1.4} fill="#fff" opacity={0.7} />)}
                <path d="M-250,100 Q0,70 250,100 L250,110 L-250,110 Z" fill="#020409" />
                <Mandacaru2 x={-120} y={100} h={170} c="#020409" s={0.8} seed={5} />
              </Painel>
              <Painel x={960} k={K(t, 23.3, 23.8)} titulo="1º CARNAVAL">
                {CONF.map((c, i) => <rect key={i} x={c.x} y={((c.y0 + (t - 23) * 120 * c.s) % 380) - 200} width={9} height={14} fill={c.c} transform={`rotate(${(t * 90 * c.s) % 360} ${c.x} ${c.y0})`} opacity={0.85} />)}
                <Sombrinha t={t} />
              </Painel>
              <Painel x={1500} k={K(t, 24.8, 25.3)} titulo="1 MILHÃO DE ANOS">
                <g transform="translate(-150,-190)">
                  <circle cx={150} cy={150} r={120} fill="#123a66" />
                  <path d={TERRAS} fill="#5d7f4c" />
                  <line x1={150 - Math.sin(0.41) * 160} y1={150 + Math.cos(0.41) * 160} x2={150 + Math.sin(0.41) * 160} y2={150 - Math.cos(0.41) * 160} stroke={C.ouro} strokeWidth={4} strokeDasharray="10 8" transform={`rotate(${Math.sin(t * 1.5) * 8} 150 150)`} />
                </g>
              </Painel>
            </g>
            <g opacity={K(t, 27.0, 27.6)} transform="translate(960,520)">
              <path d="M-120,-220 L120,-220 L120,-200 Q120,-60 14,0 Q120,60 120,200 L120,220 L-120,220 L-120,200 Q-120,60 -14,0 Q-120,-60 -120,-200 Z" fill="rgba(6,10,20,0.4)" stroke={C.ouro} strokeWidth={6} />
              <path d={`M${-100 + 70 * K(t, 27, 31)},${-180 + 150 * K(t, 27, 31)} L${100 - 70 * K(t, 27, 31)},${-180 + 150 * K(t, 27, 31)} L12,-8 L-12,-8 Z`} fill="#d9b56a" />
              <line x1={0} y1={0} x2={0} y2={200} stroke="#d9b56a" strokeWidth={4} strokeDasharray="4 6" strokeDashoffset={-t * 60} />
              <path d={`M-100,205 Q0,${205 - 120 * K(t, 27, 31)} 100,205 Z`} fill="#d9b56a" />
            </g>
          </svg>
          <div style={{position: 'absolute', top: 800, width: '100%', display: 'flex', justifyContent: 'center', opacity: K(t, 27.2, 27.8)}}>
            <Caixa cor={C.ouro} size={52}>QUANTO TEMPO A GENTE AGUENTARIA?</Caixa>
          </div>
        </>
      }>
        <EspacoReal />
      </Cena>

      {/* 4 — Cronômetro liga e sobe pro topo */}
      <Cena from={31.0} to={38.9} zoom={0.03} fade={0.45} fixo={<CronoGrande seg={Math.max(0, t - 35.0) * 0.6} k={K(t, 36.6, 38.6)} op={K(t, 31.4, 32.0) * (1 - K(t, 38.4, 38.8))} />}>
        <EspacoReal />
      </Cena>

      {/* 5 — São Luís com Lua cheia */}
      <Cena from={38.9} to={44.0} zoom={0.05} fade={0.45}>
        <SaoLuis luz={1} lua={1} />
      </Cena>

      {/* 6/7 — Diagrama Terra–Lua sobre o espaço real; pulso de luz 1,3 s; carta */}
      <Cena from={44.0} to={62.4} zoom={0.03} fade={0.45} fixo={(() => {
        const ex = 300, mx = 1620, y = 560;
        const sumiu = K(t, 52.9, 53.6), pk = prog(t, 49.8, 51.1), env = sm(prog(t, 58.6, 61.6));
        const eco = lerp(mx - 120, ex + 260, prog(t, 53.6, 58.2));
        return (
          <>
            <svg width={1920} height={1080}>
              <circle cx={ex} cy={y} r={96} fill="#2f7bc4" opacity={0.25} />
              <circle cx={ex} cy={y} r={90} fill="#1f5c99" />
              <path d="M240,520 q30,-30 60,-10 q20,20 -10,40 q-30,10 -50,-30 Z M300,600 q40,-10 50,20 q-20,30 -50,10 Z" fill="#5d8f4e" />
              <Lua x={mx} y={y} r={48} on={1 - sumiu} ghost={sumiu} id="dg" />
              <line x1={ex + 110} y1={y} x2={lerp(ex + 110, mx - 70, K(t, 44.3, 46.5))} y2={y} stroke={C.dado} strokeWidth={2} strokeDasharray="8 8" />
              {pk > 0 && pk < 1 && (
                <g>
                  <circle cx={lerp(mx - 60, ex + 100, pk)} cy={y} r={16} fill="#fff6dc" opacity={0.95} />
                  <circle cx={lerp(mx - 60, ex + 100, pk)} cy={y} r={44} fill="#fff6dc" opacity={0.2} />
                </g>
              )}
              {t > 53.6 && t < 58.4 && <g opacity={K(t, 53.6, 54.2) * (1 - K(t, 57.8, 58.4))}><Lua x={eco} y={y} r={30} on={0.85} id="eco" /></g>}
              {t > 58.3 && (
                <g opacity={K(t, 58.3, 58.8)} transform={`translate(${lerp(mx - 80, ex + 120, env)},${y - Math.sin(env * Math.PI) * 120})`}>
                  <rect x={-44} y={-30} width={88} height={60} rx={6} fill="#f2ede0" />
                  <path d="M-44,-30 L0,6 L44,-30" fill="none" stroke="#b8ae98" strokeWidth={3} />
                  <rect x={22} y={-24} width={14} height={16} fill={C.perigo} />
                </g>
              )}
            </svg>
            <Tag x={ex} y={y + 140} anchor="middle" cor={C.dado}>TERRA</Tag>
            <Tag x={mx} y={y + 110} anchor="middle" cor={C.cinza}>LUA</Tag>
            <Tag x={(ex + mx) / 2} y={y - 50} anchor="middle" cor={C.dado} size={30} op={K(t, 46, 47) * (1 - K(t, 53.0, 53.5))}>384.400 KM</Tag>
            <Tag x={(ex + mx) / 2} y={y + 70} anchor="middle" cor={C.ouro} size={34} op={(pk > 0 ? 1 : 0) * (1 - K(t, 57.3, 57.7))}>{(pk * 1.3).toFixed(1).replace('.', ',')} S</Tag>
            <Tag x={eco} y={y - 64} anchor="middle" cor={C.info} size={18} op={t > 53.6 ? K(t, 53.6, 54.2) * (1 - K(t, 57.8, 58.4)) : 0}>IMAGEM ATRASADA</Tag>
          </>
        );
      })()}>
        <EspacoReal />
      </Cena>

      {/* 8 — São Luís: a Lua apaga, a cidade escurece */}
      <Cena from={62.4} to={68.3} zoom={0.04} fade={0.4}>
        <SaoLuis luz={1 - K(t, 63.2, 66.0) * 0.85 - K(t, 67.0, 68.0) * 0.15} lua={1 - K(t, 63.25, 63.7)} lamp={1 - K(t, 67.0, 67.8) * 0.7} />
        <AbsoluteFill style={{background: '#000', opacity: K(t, 67.1, 68.2) * 0.75}} />
      </Cena>

      {/* 9/10 — Sertão: noite de lua; depois a luz some + comparação de lux */}
      <Cena from={68.3} to={83.6} zoom={0.05} fade={0.45} fixo={
        <div style={{position: 'absolute', left: 1150, top: 300, width: 640, padding: '22px 28px', borderRadius: 14, background: 'rgba(6,10,20,0.82)', border: '1px solid rgba(227,176,75,0.25)', boxShadow: '0 12px 34px rgba(0,0,0,0.55)', opacity: K(t, 75.2, 75.8) * (1 - K(t, 79.4, 80.0)), fontFamily: F.rotulo, color: C.info}}>
          <div style={{fontSize: 17, letterSpacing: 4, fontWeight: 700, color: '#B9C2D3'}}>LUZ QUE CHEGA AO CHÃO (LUX)</div>
          {[{n: 'LUA CHEIA', v: '~0,25', w: 520 * K(t, 75.6, 76.6), c: '#f3e9c8'}, {n: 'SEM LUA', v: '~0,002', w: Math.max(4, 5 * K(t, 76.4, 77)), c: C.perigo}].map((b) => (
            <div key={b.n} style={{marginTop: 18}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 20, letterSpacing: 2}}><span>{b.n}</span><span style={{fontFamily: F.titulo, fontSize: 26}}>{b.v}</span></div>
              <div style={{marginTop: 8, height: 24, width: b.w, borderRadius: 4, background: b.c, boxShadow: `0 0 16px ${b.c}66`}} />
            </div>
          ))}
        </div>
      }>
        <Sertao luz={1 - K(t, 74.2, 76.4) * 0.94} lua={1 - K(t, 73.7, 74.4)} estrelas={K(t, 74.4, 77)} andar={prog(t, 68.3, 83.6)} />
      </Cena>

      {/* 11 — Lua × Vênus: 1.700 vezes (fundo real do espaço) */}
      <Cena from={83.6} to={93.0} zoom={0.03} fade={0.45} fixo={(() => {
        const sem = K(t, 88.1, 88.9), vk = K(t, 89.4, 91.0);
        const vx = lerp(1640, 960, vk), vy = lerp(880, 560, vk);
        return (
          <>
            <svg width={1920} height={1080}>
              <g opacity={1 - sem}>
                <Lua x={460} y={560} r={190} on={1} id="lv" />
                {Array.from({length: 1700}, (_, i) => {
                  const c = i % 50, r = Math.floor(i / 50), show = i / 1700 < K(t, 84.8, 86.6);
                  return show ? <circle key={i} cx={900 + c * 17} cy={290 + r * 17} r={4.2} fill="#f3e9c8" opacity={0.85} /> : null;
                })}
              </g>
              <circle cx={vx} cy={vy} r={lerp(4.2, 9, vk)} fill="#fff" />
              <circle cx={vx} cy={vy} r={lerp(8, 34, vk)} fill="#fff" opacity={0.15 + 0.15 * vk} />
              <circle cx={960} cy={560} r={70} fill="none" stroke={C.ouro} strokeWidth={2.5} opacity={K(t, 90.6, 91.2)} />
            </svg>
            <Tag x={460} y={800} anchor="middle" cor={C.cinza} op={1 - sem}>LUA CHEIA</Tag>
            <Tag x={1325} y={918} anchor="middle" cor={C.ouro} size={20} op={K(t, 86.6, 87.2) * (1 - sem)}>CADA PONTO = O BRILHO DE VÊNUS</Tag>
            <Tag x={960} y={680} anchor="middle" cor={C.ouro} op={K(t, 90.6, 91.2)}>VÊNUS: O MAIS BRILHANTE DA NOITE</Tag>
          </>
        );
      })()}>
        <EspacoReal dim={0.8} />
      </Cena>

      {/* 12 — O lado bonito: Via Láctea real sobre o sertão */}
      <Cena from={93.0} to={105.2} zoom={0.04} fade={0.5}>
        <Sertao luz={0.06 + K(t, 99, 102) * 0.05} lua={0} estrelas={0.25 + 0.75 * K(t, 94.0, 98.6)} via={K(t, 98.8, 101.6)} />
      </Cena>

      {/* 13 — Parque do Desengano (mapa realista) */}
      <Cena from={105.2} to={112.4} zoom={0} fade={0.45} fixo={(() => {
        const z = K(t, 105.6, 108.2) * (1 - K(t, 110.2, 111.6));
        const s = Math.exp(lerp(Math.log(lerp(22, 15, K(t, 110.2, 111.6))), Math.log(120), z));
        const p = projEq(lerp(-53, -42.2, z), lerp(-15, -21.9, z), s)(ANCORA.lon, ANCORA.lat);
        return (
          <>
            <Tag x={p[0] - 40} y={p[1]} anchor="end" cor={C.impacto} op={K(t, 106.4, 107.0) * (1 - K(t, 109.9, 110.3))}>PARQUE ESTADUAL DO DESENGANO (RJ)</Tag>
            <Tag x={p[0] + 40} y={p[1]} anchor="start" cor={C.impacto} op={K(t, 110.6, 111.2)}>1º DA AMÉRICA LATINA · 2021</Tag>
          </>
        );
      })()}>
        {(() => {
          const z = K(t, 105.6, 108.2) * (1 - K(t, 110.2, 111.6));
          const s = Math.exp(lerp(Math.log(lerp(22, 15, K(t, 110.2, 111.6))), Math.log(120), z));
          return (
            <MapaReal lonC={lerp(-53, -42.2, z)} latC={lerp(-15, -21.9, z)} s={s}>
              {(p) => {
                const q = p(ANCORA.lon, ANCORA.lat), pulse = 1 + 0.3 * Math.sin(t * 4);
                return (
                  <g opacity={K(t, 106.0, 106.6)}>
                    <circle cx={q[0]} cy={q[1]} r={34 * pulse} fill={C.impacto} opacity={0.2} />
                    <circle cx={q[0]} cy={q[1]} r={9} fill={C.impacto} stroke="#fff" strokeWidth={2} />
                  </g>
                );
              }}
            </MapaReal>
          );
        })()}
      </Cena>

      {/* 14 — Brasil à noite (NASA): céu de parque… menos onde tem luz */}
      <Cena from={112.4} to={119.5} zoom={0} fade={0.5} fixo={<Tag x={1500} y={930} anchor="end" cor="#ffb347" op={K(t, 116.4, 117.0)}>LUZ DAS CIDADES APAGA AS ESTRELAS</Tag>}>
        <MapaReal lonC={-53} latC={-15} s={lerp(22, 23.5, prog(t, 112.4, 119.5))} noite={1} luzes={K(t, 115.8, 117.2)}>
          {(p) => (
            <g>
              {PONTOS_BR.map(([lon, lat, r], i) => {
                const q = p(lon, lat);
                let dimByCity = 1;
                for (const [cl, ca, cs] of CIDADES) {
                  const c = p(cl, ca); const d = Math.hypot(q[0] - c[0], q[1] - c[1]);
                  if (d < 70 * cs) dimByCity = Math.min(dimByCity, d / (70 * cs));
                }
                const k = K(t, 112.6 + r * 1.6, 113.4 + r * 1.6), city = K(t, 116.0, 117.2);
                return <circle key={i} cx={q[0]} cy={q[1]} r={1 + r * 1.3} fill="#fff" opacity={k * (0.45 + 0.5 * r) * lerp(1, dimByCity, city)} />;
              })}
            </g>
          )}
        </MapaReal>
      </Cena>
    </>
  );
};

export const HUD_EVS = [
  {a: 38.6, b: 46.0, s0: 0, s1: 0, v0: 0, v1: 0},
  {a: 49.4, b: 56.0, s0: 49.8, s1: 51.1, v0: 0, v1: 1.3},
  {a: 68.3, b: 75.0, s0: 68.6, s1: 70.6, v0: 1.3, v1: 2 * 3600},
];
