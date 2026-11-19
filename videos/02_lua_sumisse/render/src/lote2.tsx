import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F} from './theme';
import {useT, Cena, Caixa} from './ui';
import {prog, sm, clamp01} from './prims';
import {Lua, Estrelas, EspacoReal, MapaReal, Tag, K, lerp, rnd, Andarilho} from './piloto';

// =================== MANGUE + CARANGUEJO-UÇÁ ===================
const Rizofora: React.FC<{x: number; y: number; s: number; c: string; folha: string}> = ({x, y, s, c, folha}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-90, -60, -30, 0, 30, 60, 90].map((dx, i) => <path key={i} d={`M${dx * 0.3},-120 Q${dx * 0.9},-90 ${dx},0`} stroke={c} strokeWidth={6} fill="none" />)}
    <path d="M0,-120 L0,-220" stroke={c} strokeWidth={14} />
    {[[-70, -250, 70], [0, -290, 90], [70, -250, 70], [-30, -220, 60], [40, -215, 60]].map(([a, b, r], i) => <ellipse key={i} cx={a} cy={b} rx={r} ry={r * 0.6} fill={folha} />)}
  </g>
);
const Caranguejo: React.FC<{x: number; y: number; s?: number; fase: number; luz?: number; dir?: number}> = ({x, y, s = 1, fase, luz = 1, dir = 1}) => {
  const casco = `rgb(${lerp(30, 92, luz)},${lerp(36, 74, luz)},${lerp(54, 96, luz)})`;
  const perna = `rgb(${lerp(40, 168, luz)},${lerp(30, 96, luz)},${lerp(40, 80, luz)})`;
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
      {[0, 1, 2, 3].map((i) => { const a = Math.sin(fase + i) * 6; return <g key={i}><path d={`M${-18},${-6 + i * 4} L${-40},${-18 + i * 8 + a} L${-50},${4 + i * 8 + a}`} stroke={perna} strokeWidth={4} fill="none" strokeLinecap="round" /><path d={`M${18},${-6 + i * 4} L${40},${-18 + i * 8 - a} L${50},${4 + i * 8 - a}`} stroke={perna} strokeWidth={4} fill="none" strokeLinecap="round" /></g>; })}
      <path d="M22,-12 L44,-30 L60,-26" stroke={perna} strokeWidth={6} fill="none" strokeLinecap="round" />
      <ellipse cx={64} cy={-28} rx={12} ry={8} fill={perna} />
      <path d="M-22,-12 L-40,-26" stroke={perna} strokeWidth={6} fill="none" strokeLinecap="round" />
      <ellipse cx={-46} cy={-28} rx={10} ry={7} fill={perna} />
      <ellipse cx={0} cy={-10} rx={30} ry={20} fill={casco} />
      <path d="M-24,-14 Q0,-30 24,-14" stroke="rgba(255,255,255,0.18)" strokeWidth={3} fill="none" />
      <circle cx={-8} cy={-30} r={3.5} fill="#111" /><circle cx={8} cy={-30} r={3.5} fill="#111" />
    </g>
  );
};
const CRABS = Array.from({length: 28}, (_, i) => ({x0: 100 + rnd(i + 5000) * 1700, y: 760 + rnd(i + 5100) * 260, s: 0.7 + rnd(i + 5200) * 0.6, v: 20 + rnd(i + 5300) * 40, d: rnd(i + 5400) > 0.5 ? 1 : -1, t0: rnd(i + 5500) * 3}));
export const Mangue: React.FC<{lua: number; saem: number; luz?: number; confusos?: number}> = ({lua, saem, luz = 0.6, confusos = 0}) => {
  const t = useT();
  return (
    <AbsoluteFill style={{background: `linear-gradient(#060b18, rgb(${lerp(10, 26, luz)},${lerp(20, 40, luz)},${lerp(34, 66, luz)}))`}}>
      <AbsoluteFill style={{opacity: 0.8}}><Estrelas k={0.5} /></AbsoluteFill>
      <svg width={1920} height={1080}>
        <Lua x={1500} y={230} r={70} on={lua} id="mg" />
        <rect y={640} width={1920} height={440} fill={`rgb(${lerp(26, 62, luz)},${lerp(22, 50, luz)},${lerp(18, 40, luz)})`} />
        <rect y={640} width={1920} height={60} fill={`rgba(60,90,120,${0.35 * luz})`} />
        {[160, 520, 900, 1300, 1700].map((x, i) => <Rizofora key={i} x={x} y={690 + (i % 2) * 12} s={1 + (i % 3) * 0.15} c={`rgb(${lerp(14, 40, luz)},${lerp(12, 34, luz)},${lerp(10, 28, luz)})`} folha={`rgb(${lerp(14, 34, luz)},${lerp(24, 70, luz)},${lerp(20, 44, luz)})`} />)}
        {Array.from({length: 22}, (_, i) => <ellipse key={'toca' + i} cx={120 + rnd(i + 6000) * 1700} cy={760 + rnd(i + 6100) * 260} rx={18} ry={7} fill="#140f0b" />)}
        {CRABS.map((c, i) => {
          const k = clamp01((saem - i / CRABS.length * 0.6) * 2.4);
          if (k <= 0) return null;
          const ang = confusos > 0 && i % 3 === 0 ? Math.sin(t * 2 + i) * 60 * confusos : 0;
          const x = c.x0 + c.d * (t * c.v * 0.6 - c.t0 * 30) % 220 * k;
          return <g key={i} opacity={k} transform={`rotate(${ang} ${x} ${c.y})`}><Caranguejo x={x} y={c.y} s={c.s} fase={t * 9 + i} luz={luz} dir={c.d} /></g>;
        })}
        {confusos > 0 && [3, 9, 15, 21].map((i) => <text key={'q' + i} x={CRABS[i].x0} y={CRABS[i].y - 70} opacity={confusos} fill={C.ouro} textAnchor="middle" style={{fontFamily: F.titulo, fontSize: 48}}>?</text>)}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- portaria do defeso (documento) ----------
const Portaria: React.FC<{k: number; risco?: number; t: number}> = ({k, risco = 0}) => (
  <div style={{position: 'absolute', left: 300, top: 290, width: 620, height: 720, background: '#f4efe3', borderRadius: 6, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', transform: `rotate(-3deg) translateY(${(1 - k) * 60}px)`, opacity: k, padding: 40, fontFamily: F.rotulo, color: '#2a2a2a'}}>
    <div style={{fontWeight: 700, fontSize: 22, letterSpacing: 2}}>PORTARIA INTERMINISTERIAL Nº 45/2026</div>
    <div style={{fontSize: 16, marginTop: 6, color: '#555'}}>Defeso do caranguejo-uçá (Ucides cordatus) — períodos de andada</div>
    {[0, 1, 2, 3].map((m) => (
      <div key={m} style={{marginTop: 26}}>
        <div style={{fontWeight: 700, fontSize: 18}}>{['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL'][m]}</div>
        <div style={{display: 'flex', gap: 14, marginTop: 8}}>
          {[0, 1].map((j) => (
            <div key={j} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 6, background: '#e7dfcc'}}>
              <span style={{width: 20, height: 20, borderRadius: 10, background: j === 0 ? '#2b2b2b' : '#efe8d6', border: '2px solid #2b2b2b', display: 'inline-block'}} />
              <span style={{fontSize: 16, fontWeight: 700}}>{j === 0 ? 'LUA NOVA' : 'LUA CHEIA'} · 6 DIAS</span>
            </div>
          ))}
        </div>
      </div>
    ))}
    <svg width={620} height={720} style={{position: 'absolute', left: 0, top: 0, opacity: risco}}>
      <line x1={40} y1={140} x2={40 + 540 * clamp01(risco * 1.2)} y2={660} stroke={C.perigo} strokeWidth={10} strokeLinecap="round" />
      <text x={310} y={420} textAnchor="middle" fill={C.perigo} transform="rotate(-18 310 420)" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 64, letterSpacing: 4}}>REESCREVER</text>
    </svg>
  </div>
);
const ESTADOS: [string, number, number][] = [['AP', -51.07, 0.03], ['PA', -48.5, -1.45], ['MA', -44.3, -2.53], ['PI', -42.8, -5.09], ['CE', -38.54, -3.72], ['RN', -35.21, -5.79], ['PB', -34.86, -7.12], ['PE', -34.88, -8.05], ['AL', -35.73, -9.65], ['SE', -37.07, -10.91], ['BA', -38.5, -12.97]];

// =================== CARNAVAL DE RUA (casario estilo Olinda) ===================
const FOLIAO_CORES = ['#e63946', '#f4c430', '#2ba84a', '#1e6fd9', '#ff7ab6', '#8e44ad'];
const Foliao: React.FC<{x: number; y: number; s: number; fase: number; cor: string; sombrinha?: boolean}> = ({x, y, s, fase, cor, sombrinha}) => {
  const p = Math.sin(fase), q = Math.cos(fase);
  return (
    <g transform={`translate(${x},${y + Math.abs(p) * -10}) scale(${s})`}>
      <path d={`M0,-90 L${-14 + p * 10},-40 L${-20 + p * 18},0 M0,-90 L${14 - p * 10},-40 L${24 - p * 16},0`} stroke="#1b1b22" strokeWidth={13} strokeLinecap="round" fill="none" />
      <path d="M-14,-92 L14,-92 L16,-146 L-14,-148 Z" fill={cor} stroke={cor} strokeWidth={8} strokeLinejoin="round" />
      <path d={`M-8,-140 L${-34 + q * 6},${-170 + p * 12} M8,-140 L${36 - q * 6},${-176 - p * 10}`} stroke="#1b1b22" strokeWidth={9} strokeLinecap="round" />
      <circle cx={0} cy={-166} r={13} fill="#1b1b22" />
      {sombrinha && (
        <g transform={`translate(${38 - q * 6},${-180 - p * 10}) rotate(${p * 20})`}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a0 = Math.PI + (i * Math.PI) / 8, a1 = Math.PI + ((i + 1) * Math.PI) / 8; return <path key={i} d={`M0,0 L${Math.cos(a0) * 46},${Math.sin(a0) * 34} A46,34 0 0 1 ${Math.cos(a1) * 46},${Math.sin(a1) * 34} Z`} fill={['#E63946', '#F4C430', '#2BA84A', '#1E6FD9'][i % 4]} />; })}
          <line x1={0} y1={-34} x2={0} y2={28} stroke="#ddd" strokeWidth={3} />
        </g>
      )}
    </g>
  );
};
const FOLIOES = Array.from({length: 16}, (_, i) => ({x: 80 + i * 118 + rnd(i + 7000) * 40, y: 900 + (i % 3) * 40, s: 1 + (i % 3) * 0.12, cor: FOLIAO_CORES[i % 6], so: i % 4 === 1, f: rnd(i + 7100) * 6}));
const CONFETE = Array.from({length: 90}, (_, i) => ({x: rnd(i + 7200) * 1920, y0: rnd(i + 7300) * 1100, v: 60 + rnd(i + 7400) * 80, c: FOLIAO_CORES[i % 6]}));
export const CarnavalRua: React.FC<{noite?: number; luaFantasma?: number; luzes?: number}> = ({noite = 0.6, luaFantasma = 0, luzes = 1}) => {
  const t = useT();
  const casas = ['#f2c14e', '#e94f37', '#3f88c5', '#44bba4', '#e86fa5', '#f78c40', '#7d5ba6', '#f2c14e', '#3f88c5'];
  return (
    <AbsoluteFill style={{background: `linear-gradient(#0a1024, rgb(${lerp(80, 30, noite)},${lerp(60, 36, noite)},${lerp(110, 80, noite)}))`}}>
      <AbsoluteFill style={{opacity: noite}}><Estrelas k={0.4} /></AbsoluteFill>
      <svg width={1920} height={1080}>
        {luaFantasma > 0 && <Lua x={1520} y={200} r={64} on={0} ghost={luaFantasma} id="cf" />}
        {casas.map((c, i) => {
          const x = i * 220 - 20, h = 300 + (i % 3) * 50, top = 800 - h;
          return (
            <g key={i}>
              <rect x={x} y={top} width={214} height={h} fill={c} opacity={lerp(1, 0.75, noite)} />
              <path d={`M${x - 6},${top} L${x + 107},${top - 50} L${x + 220},${top} Z`} fill="#8a3b22" />
              {[0, 1, 2].map((j) => <rect key={j} x={x + 22 + j * 64} y={top + 40} width={40} height={64} rx={4} fill="#ffe2a8" opacity={0.85} />)}
              <rect x={x + 82} y={800 - 120} width={50} height={120} rx={4} fill="#3a2418" />
            </g>
          );
        })}
        {/* bandeirinhas */}
        {[0, 1].map((r) => <g key={r}>{Array.from({length: 30}, (_, i) => { const k = i / 29, x = lerp(-20, 1940, k), y = 300 + r * 90 + Math.sin(k * Math.PI * 3) * 26; return <path key={i} d={`M${x - 14},${y} L${x + 14},${y} L${x},${y + 26} Z`} fill={FOLIAO_CORES[(i + r) % 6]} opacity={luzes} />; })}</g>)}
        <rect y={800} width={1920} height={280} fill="#3a3a44" />
        {FOLIOES.map((f, i) => <Foliao key={i} x={f.x + Math.sin(t * 0.8 + i) * 10} y={f.y} s={f.s} fase={t * 5 + f.f} cor={f.cor} sombrinha={f.so} />)}
        {CONFETE.map((c, i) => <rect key={'cf' + i} x={c.x + Math.sin(t * 2 + i) * 12} y={((c.y0 + t * c.v) % 1100) - 20} width={8} height={12} fill={c.c} opacity={0.85 * luzes} transform={`rotate(${(t * 120 + i * 40) % 360} ${c.x} ${((c.y0 + t * c.v) % 1100) - 20})`} />)}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- linha do tempo da Páscoa ----------
const LinhaPascoa: React.FC<{t: number}> = ({t}) => {
  const it = [
    {x: 260, at: 293.0, top: '21 DE MARÇO', sub: 'EQUINÓCIO', ic: 'eq', cor: C.dado},
    {x: 820, at: 291.4, top: '1ª LUA CHEIA', sub: 'A PARTIR DO DIA 21', ic: 'lua', cor: '#efe8d6'},
    {x: 1360, at: 288.6, top: 'DOMINGO', sub: 'DE PÁSCOA', ic: 'dom', cor: C.ouro},
  ];
  const carn = K(t, 294.4, 295.2);
  return (
    <svg width={1920} height={1080}>
      <line x1={180} y1={560} x2={lerp(180, 1760, K(t, 285.4, 286.6))} y2={560} stroke="#56627a" strokeWidth={4} />
      {it.map((e) => { const k = K(t, e.at, e.at + 0.5); return (
        <g key={e.x} opacity={k} transform={`translate(${e.x},560) scale(${lerp(0.8, 1, k)})`}>
          <circle r={46} fill="rgba(6,10,20,0.9)" stroke={e.cor} strokeWidth={4} />
          {e.ic === 'lua' && <Lua x={0} y={0} r={30} on={1} id="lp" />}
          {e.ic === 'eq' && <><circle r={18} fill={C.ouro} /><line x1={-34} x2={34} y1={0} y2={0} stroke={C.dado} strokeWidth={3} /></>}
          {e.ic === 'dom' && <text y={14} textAnchor="middle" fill={C.ouro} style={{fontFamily: F.titulo, fontSize: 40, fontWeight: 700}}>D</text>}
          <text y={-80} textAnchor="middle" fill={C.info} style={{fontFamily: F.titulo, fontWeight: 600, fontSize: 34, letterSpacing: 2}}>{e.top}</text>
          <text y={92} textAnchor="middle" fill="#B9C2D3" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 18, letterSpacing: 3}}>{e.sub}</text>
        </g>
      ); })}
      <g opacity={carn}>
        <path d={`M1360,640 Q1100,${780} 820,800`} stroke={C.perigo} strokeWidth={4} fill="none" strokeDasharray="10 8" />
        <circle cx={760} cy={800} r={46} fill="rgba(6,10,20,0.9)" stroke={C.perigo} strokeWidth={4} />
        <text x={760} y={814} textAnchor="middle" fill={C.perigo} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 30}}>3ª</text>
        <text x={1120} y={800} textAnchor="middle" fill={C.perigo} style={{fontFamily: F.titulo, fontWeight: 600, fontSize: 34}}>47 DIAS ANTES</text>
        <text x={760} y={890} textAnchor="middle" fill={C.info} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 20, letterSpacing: 3}}>TERÇA DE CARNAVAL</text>
      </g>
    </svg>
  );
};
// ---------- tabela antiga (lua eclesiástica) ----------
const Tabela: React.FC<{k: number; t: number}> = ({k}) => (
  <div style={{position: 'absolute', left: 1080, top: 330, width: 640, padding: '30px 34px', background: 'linear-gradient(#e9dcc0, #d6c39c)', borderRadius: 8, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', opacity: k, transform: `rotate(2deg) translateY(${(1 - k) * 40}px)`, fontFamily: 'Georgia, serif', color: '#3a2a18'}}>
    <div style={{fontSize: 30, fontWeight: 700, textAlign: 'center', letterSpacing: 2}}>TABULA PASCHALIS</div>
    <div style={{fontSize: 16, textAlign: 'center', marginBottom: 14, fontStyle: 'italic'}}>luas calculadas — séc. XVI</div>
    {Array.from({length: 7}, (_, r) => (
      <div key={r} style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(58,42,24,0.3)', padding: '7px 0', fontSize: 20}}>
        <span>{['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][r]}</span><span>{['XXIII', 'XI', 'XXX', 'XIX', 'VIII', 'XXVII', 'XVI'][r]}</span><span>☾ {[5, 25, 13, 2, 22, 10, 30][r]} · {r % 2 ? 'Mar' : 'Abr'}</span>
      </div>
    ))}
  </div>
);

// =================== ECLIPSE ===================
const LuaVermelha: React.FC<{x: number; y: number; r: number; k: number}> = ({x, y, r, k}) => (
  <g>
    <defs>
      <radialGradient id="lv1"><stop offset="0%" stopColor="#c2462a" /><stop offset="70%" stopColor="#8a2a18" /><stop offset="100%" stopColor="#4a140c" /></radialGradient>
      <clipPath id="lvc"><circle cx={x} cy={y} r={r} /></clipPath>
    </defs>
    <Lua x={x} y={y} r={r} on={1} id="lvx" />
    <g clipPath="url(#lvc)">
      <circle cx={lerp(x - r * 2.4, x, k)} cy={y} r={r * 1.5} fill="url(#lv1)" opacity={0.92} />
      <circle cx={lerp(x - r * 2.4, x, k)} cy={y} r={r * 1.5} fill="none" stroke="#000" strokeOpacity={0.25} strokeWidth={r * 0.2} />
    </g>
    <circle cx={x} cy={y} r={r * 2.4} fill="#c2462a" opacity={0.12 * k} />
  </g>
);
const Varanda: React.FC<{t: number}> = ({t}) => (
  <svg width={1920} height={1080}>
    <rect y={760} width={1920} height={320} fill="#0d0a0a" />
    <rect x={0} y={700} width={1920} height={18} fill="#1a1412" />
    {Array.from({length: 40}, (_, i) => <rect key={i} x={i * 50} y={718} width={8} height={70} fill="#1a1412" />)}
    <g transform="translate(760,780) scale(1.3)"><Andarilho c="#0a0808" fase={1.2} borda="rgba(255,110,80,0.55)" /></g>
    <g transform="translate(900,780) scale(1.05)"><Andarilho c="#0a0808" fase={2.2} borda="rgba(255,110,80,0.55)" /></g>
    <g transform="translate(1030,790) scale(0.75)"><Andarilho c="#0a0808" fase={0.4} borda="rgba(255,110,80,0.55)" /></g>
    <path d="M1010,600 L1040,560" stroke="#0a0808" strokeWidth={7} strokeLinecap="round" />
  </svg>
);
const Letreiro: React.FC<{on: number; t: number}> = ({on, t}) => (
  <svg width={1920} height={1080}>
    <rect width={1920} height={1080} fill="#07070c" />
    <rect x={460} y={260} width={1000} height={360} rx={18} fill="#1a1622" stroke="#3a3346" strokeWidth={6} />
    {Array.from({length: 46}, (_, i) => { const per = i < 23 ? [480 + i * 42, 280] : [480 + (i - 23) * 42, 600]; const blink = on * (0.6 + 0.4 * Math.sin(t * 8 + i)); return <circle key={i} cx={per[0]} cy={per[1]} r={7} fill="#ffd27a" opacity={blink} />; })}
    <text x={960} y={370} textAnchor="middle" fill={on > 0.5 ? '#ffd27a' : '#4a4456'} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 30, letterSpacing: 10}}>EM CARTAZ</text>
    <text x={960} y={490} textAnchor="middle" fill={`rgba(255,${lerp(80, 240, on)},${lerp(80, 210, on)},${lerp(0.3, 1, on)})`} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 110, letterSpacing: 12}}>ECLIPSE</text>
    <text x={960} y={570} textAnchor="middle" fill={on > 0.5 ? '#B9C2D3' : '#3a3346'} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 6}}>HÁ MILHARES DE ANOS</text>
    <rect x={560} y={620} width={20} height={300} fill="#1a1622" /><rect x={1340} y={620} width={20} height={300} fill="#1a1622" />
  </svg>
);

export const CenasLote2: React.FC = () => {
  const t = useT();
  return (
    <>
      {/* B5a — o mangue à noite, lua cheia */}
      <Cena from={227.8} to={232.5} zoom={0.04} fade={0.5}>
        <Mangue lua={1} saem={0} />
      </Cena>
      {/* B5b — a andada: caranguejos saem das tocas */}
      <Cena from={232.5} to={244.8} zoom={0.05} fade={0.45} fixo={
        <>
          <Tag x={960} y={340} anchor="middle" cor={C.ouro} size={26} op={K(t, 241.4, 242.0)}>LUA CHEIA E LUA NOVA → MARÉS GRANDES</Tag>
          <svg width={1920} height={1080} style={{opacity: K(t, 241.4, 242.0)}}>
            <g transform="translate(960,430)">
              <circle cx={-60} r={26} fill="#1b2433" stroke="#56627a" strokeWidth={2} />
              <Lua x={60} y={0} r={26} on={1} id="lnc" />
            </g>
          </svg>
        </>
      }>
        <Mangue lua={1} saem={K(t, 233.6, 239.0)} />
      </Cena>
      {/* B5c — portaria do defeso + mapa dos 11 estados */}
      <Cena from={244.8} to={258.6} zoom={0} fade={0.45} fixo={
        <>
          <Portaria k={K(t, 245.0, 245.8) * (1 - K(t, 251.2, 251.8))} t={t} />
          {(() => { const p = (lon: number, lat: number): [number, number] => [960 + (lon + 42) * 60, 540 - (lat + 6) * 60]; return ESTADOS.map(([n, lon, lat], i) => { const q = p(lon, lat), k = K(t, 252.2 + i * 0.17, 252.6 + i * 0.17); return <Tag key={n} x={q[0] + 24} y={q[1]} cor={C.ouro} size={18} op={k}>{n}</Tag>; }); })()}
        </>
      }>
        <EspacoReal dim={0.5} />
        <AbsoluteFill style={{opacity: K(t, 251.4, 252.2)}}>
          <MapaReal lonC={-42} latC={-6} s={60}>
            {(p) => <g>{ESTADOS.map(([n, lon, lat], i) => { const q = p(lon, lat), k = K(t, 252.2 + i * 0.17, 252.6 + i * 0.17); return <g key={n} opacity={k}><circle cx={q[0]} cy={q[1]} r={22 + 6 * Math.sin(t * 4 + i)} fill={C.ouro} opacity={0.25} /><circle cx={q[0]} cy={q[1]} r={8} fill={C.ouro} stroke="#fff" strokeWidth={2} /></g>; })}</g>}
          </MapaReal>
        </AbsoluteFill>
      </Cena>
      {/* B5d — o relógio quebra; caranguejos desencontrados; a lei reescrita */}
      <Cena from={258.6} to={273.0} zoom={0.04} fade={0.45} fixo={
        <>
          <svg width={1920} height={1080} style={{opacity: K(t, 258.8, 259.4) * (1 - K(t, 265.6, 266.0))}}>
            <g transform="translate(960,420)">
              <circle r={150} fill="rgba(6,10,20,0.85)" stroke={C.ouro} strokeWidth={8} />
              {Array.from({length: 12}, (_, i) => { const a = i * Math.PI / 6; return <line key={i} x1={Math.sin(a) * 120} y1={-Math.cos(a) * 120} x2={Math.sin(a) * 136} y2={-Math.cos(a) * 136} stroke={C.info} strokeWidth={4} />; })}
              <Lua x={0} y={-60} r={26} on={1 - K(t, 259.8, 260.4)} ghost={K(t, 259.8, 260.4)} id="rq" />
              <path d={`M-40,-150 L-10,-60 L-50,10 L-10,80 L-30,150`} stroke={C.perigo} strokeWidth={6} fill="none" opacity={K(t, 260.0, 260.3)} />
              <line x1={0} y1={0} x2={Math.sin(t * 0.3) * 70} y2={-Math.cos(t * 0.3) * 70} stroke={C.info} strokeWidth={6} strokeLinecap="round" />
            </g>
          </svg>
          <Portaria k={K(t, 270.0, 270.6)} risco={K(t, 270.8, 272.0)} t={t} />
        </>
      }>
        <Mangue lua={0} saem={1} luz={0.35} confusos={K(t, 266.0, 267.0)} />
      </Cena>

      {/* B6a — Carnaval de rua */}
      <Cena from={273.0} to={277.2} zoom={0.05} fade={0.45}>
        <CarnavalRua />
      </Cena>
      {/* B6b — "mês" vem de "lua" */}
      <Cena from={277.2} to={285.0} zoom={0.03} fade={0.45} fixo={
        <svg width={1920} height={1080}>
          {[{x: 420, w: 'LUA', s: 'raiz antiga *mēns', at: 279.6}, {x: 960, w: 'MENSIS', s: 'latim', at: 280.2}, {x: 1500, w: 'MÊS', s: 'português', at: 280.8}].map((e, i) => {
            const k = K(t, e.at, e.at + 0.5);
            return (
              <g key={i} opacity={k} transform={`translate(${e.x},560)`}>
                {i === 0 && <Lua x={0} y={-150} r={50} on={1} id="et" />}
                <text y={0} textAnchor="middle" fill={i === 2 ? C.ouro : C.info} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 96, letterSpacing: 4}}>{e.w}</text>
                <text y={60} textAnchor="middle" fill="#B9C2D3" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4}}>{e.s.toUpperCase()}</text>
                {i < 2 && <path d="M190,-30 L330,-30 M310,-44 L334,-30 L310,-16" stroke={C.ouro} strokeWidth={5} fill="none" opacity={K(t, e.at + 0.5, e.at + 0.8)} />}
              </g>
            );
          })}
        </svg>
      }>
        <EspacoReal dim={0.6} />
      </Cena>
      {/* B6c — regra da Páscoa → Carnaval */}
      <Cena from={285.0} to={298.0} zoom={0.02} fade={0.45} fixo={<LinhaPascoa t={t} />}>
        <EspacoReal dim={0.6} />
      </Cena>
      {/* B6d — a lua de tabela */}
      <Cena from={298.0} to={311.6} zoom={0.03} fade={0.45} fixo={
        <>
          <Tabela k={K(t, 303.1, 303.8)} t={t} />
          <Tag x={480} y={820} anchor="middle" cor={C.cinza} size={22} op={K(t, 300.6, 301.2)}>NINGUÉM OLHA PRO CÉU</Tag>
          <div style={{position: 'absolute', left: 1080, top: 880, opacity: K(t, 307.6, 308.2)}}><Caixa cor={C.impacto} size={34}>CARNAVAL: MESMA DATA DE SEMPRE</Caixa></div>
        </>
      }>
        <EspacoReal dim={0.7} />
        <svg width={1920} height={1080}><Lua x={480} y={520} r={120} on={0} ghost={1} id="lt" /><circle cx={480} cy={520} r={170} fill="none" stroke={C.cinza} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="4 10" /></svg>
      </Cena>
      {/* B6e — o bloco sai mesmo assim, com a Lua fantasma */}
      <Cena from={311.6} to={319.8} zoom={0.05} fade={0.5}>
        <CarnavalRua luaFantasma={1} noite={0.8} />
      </Cena>

      {/* B7a — eclipse lunar total: a Lua fica vermelha */}
      <Cena from={319.8} to={331.5} zoom={0.05} fade={0.5}>
        <EspacoReal dim={0.8} />
        <svg width={1920} height={1080}><LuaVermelha x={960} y={520} r={190} k={K(t, 322.0, 329.6)} /></svg>
      </Cena>
      {/* B7b — visível no país inteiro (Brasil à noite) */}
      <Cena from={331.5} to={335.6} zoom={0} fade={0.4} fixo={<Tag x={960} y={960} anchor="middle" cor={C.perigo} size={24} op={K(t, 332.4, 332.9)}>VISÍVEL DE TODO O BRASIL</Tag>}>
        <MapaReal lonC={-53} latC={-15} s={22} noite={1} luzes={0.7} />
        <svg width={1920} height={1080}><LuaVermelha x={1560} y={220} r={70} k={1} /></svg>
      </Cena>
      {/* B7c — da varanda */}
      <Cena from={335.6} to={337.5} zoom={0.04} fade={0.35}>
        <AbsoluteFill style={{background: 'linear-gradient(#0a0710, #3a1a1c 70%, #4a2420)'}}><Estrelas k={0.5} /></AbsoluteFill>
        <svg width={1920} height={1080}><LuaVermelha x={1320} y={300} r={90} k={1} /></svg>
        <Varanda t={t} />
      </Cena>
      {/* B7d — cancelado pra sempre: ingresso carimbado; eclipse do Sol some */}
      <Cena from={337.5} to={348.3} zoom={0.03} fade={0.45} fixo={
        <>
          <div style={{position: 'absolute', left: 460, top: 300, width: 1000, height: 380, borderRadius: 18, background: 'linear-gradient(135deg,#1b2340,#10162a)', border: `2px dashed ${C.ouro}`, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', opacity: K(t, 337.7, 338.3) * (1 - K(t, 342.2, 342.6)), fontFamily: F.rotulo, color: C.info, padding: 40}}>
            <div style={{fontSize: 20, letterSpacing: 6, color: '#B9C2D3', fontWeight: 700}}>INGRESSO · BRASIL INTEIRO</div>
            <div style={{fontFamily: F.titulo, fontSize: 84, fontWeight: 700, marginTop: 14}}>ECLIPSE TOTAL DA LUA</div>
            <div style={{fontSize: 30, fontWeight: 700, marginTop: 10, letterSpacing: 3}}>25/26 DE JUNHO DE 2029 · ~1H40</div>
            <div style={{position: 'absolute', right: 40, top: 250, transform: `rotate(-10deg) scale(${lerp(1.8, 1, K(t, 338.8, 339.2))})`, opacity: K(t, 338.8, 339.1), border: `6px solid ${C.perigo}`, color: C.perigo, padding: '8px 22px', fontFamily: F.titulo, fontWeight: 700, fontSize: 64, letterSpacing: 4, borderRadius: 8}}>CANCELADO</div>
          </div>
          <Tag x={960} y={880} anchor="middle" cor={C.perigo} size={26} op={K(t, 345.4, 346.0)}>SEM LUA, NADA TAMPA O SOL</Tag>
        </>
      }>
        <EspacoReal dim={0.7} />
        {(() => { const k = K(t, 342.6, 343.2); const sai = K(t, 346.6, 347.8); return (
          <svg width={1920} height={1080} style={{opacity: k}}>
            <defs><radialGradient id="cor"><stop offset="40%" stopColor="#fff" stopOpacity={0.9} /><stop offset="100%" stopColor="#bcd6ff" stopOpacity={0} /></radialGradient><radialGradient id="sol2"><stop offset="0%" stopColor="#fff8d8" /><stop offset="70%" stopColor="#ffc24a" /><stop offset="100%" stopColor="#ff9a00" stopOpacity={0} /></radialGradient></defs>
            <circle cx={960} cy={520} r={260} fill="url(#cor)" opacity={1 - sai} />
            <circle cx={960} cy={520} r={170} fill="url(#sol2)" opacity={sai} />
            <circle cx={lerp(960, 1700, sai)} cy={520} r={150} fill="#05070c" opacity={1 - sai} />
          </svg>
        ); })()}
      </Cena>
      {/* B7e — milhares de anos de espetáculo → sai de cartaz */}
      <Cena from={348.3} to={357.0} zoom={0.04} fade={0.5}>
        <Letreiro on={1 - K(t, 354.6, 355.9)} t={t} />
      </Cena>
    </>
  );
};

export const HUD_LOTE2 = [
  {a: 227.8, b: 233.5, s0: 228.0, s1: 229.6, v0: 15 * 86400 + 120, v1: 92 * 86400},
  {a: 319.8, b: 325.5, s0: 320.0, s1: 321.8, v0: 92 * 86400, v1: 2.6 * 365.25 * 86400},
];
