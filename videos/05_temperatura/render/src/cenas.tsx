import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {geoOrthographic, geoPath, geoGraticule, geoDistance} from 'd3-geo';
import {C, F} from './theme';
import {lerp, rnd, clamp01, prog, K, KO, sm, FR, QU, Numero} from './base';
import {Pessoa, VOCE, ANNA, BLAGDEN, WILLIE, CIENTISTA, CIENTISTA2} from './personagens';
import {mundo, brasil} from './geo';

const SVG: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0, overflow: 'visible'}}>{children}</svg>;

// ============ 1) ACORDAR — close no rosto, luz fria x quente ============
export const Acorda: React.FC<{lt: number}> = ({lt}) => {
  const luz = K(lt, 0.15, 1.2);
  const abre = lt > 0.75;
  return (
    <AbsoluteFill style={{background: '#020308'}}>
      <AbsoluteFill style={{opacity: luz}}>
        <AbsoluteFill style={{background: 'linear-gradient(90deg, #13385C 0%, #0A0F1C 45%, #0A0F1C 55%, #5A1E0C 100%)'}} />
        <SVG>
          <g transform={`translate(960,${lerp(1880, 1860, lt / 2)}) scale(4.2)`}>
            <Pessoa v={VOCE} expr={abre ? 'susto' : 'fechado'} t={lt + 10} olhar={abre ? [Math.sin(lt * 3) * 0.8, 0] : [0, 0]} semPernas />
          </g>
        </SVG>
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(110,180,255,0.42) 0%, transparent 46%, transparent 54%, rgba(255,120,40,0.42) 100%)', mixBlendMode: 'overlay'}} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(120,190,255,0.18), transparent 35%, transparent 65%, rgba(255,140,60,0.2))', mixBlendMode: 'screen'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 30%, rgba(0,0,0,0.8) 100%)'}} />
      {/* pálpebras do espectador */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: lerp(540, 0, KO(lt, 0.05, 0.6)), background: '#000'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: lerp(540, 0, KO(lt, 0.05, 0.6)), background: '#000'}} />
    </AbsoluteFill>
  );
};

// ============ PORTAS DE FRENTE (par) ============
export const PortaFrente: React.FC<{x: number; y: number; s: number; fria: boolean; txt: string; txtOp: number; t: number; abre?: number}> = ({x, y, s, fria, txt, txtOp, t, abre = 0}) => {
  const pul = 0.75 + 0.25 * Math.sin(t * 3);
  const w = 300, h = 560;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-w / 2 - 26} y={-h - 26} width={w + 52} height={h + 26} fill={fria ? '#0E2A44' : '#2A0C06'} rx={6} />
      <rect x={-w / 2} y={-h} width={w} height={h} fill={fria ? '#EAF7FF' : '#FFD9A0'} />
      <g transform={`translate(${-w / 2},0) scale(${1 - abre * 0.75},1)`}>
        <rect x={0} y={-h} width={w} height={h} fill={fria ? 'url(#pfF)' : 'url(#pfQ)'} stroke={fria ? FR.gelo : QU.fogo} strokeWidth={3} strokeOpacity={fria ? 0.7 : pul} />
        {[0, 1].map((r) => <rect key={r} x={30} y={-h + 40 + r * 250} width={w - 60} height={210} rx={6} fill="none" stroke={fria ? 'rgba(255,255,255,0.35)' : 'rgba(255,170,90,0.3)'} strokeWidth={3} />)}
        <circle cx={w - 36} cy={-h / 2} r={11} fill={fria ? '#DDF1FF' : '#FFC37A'} />
        {fria && Array.from({length: 30}, (_, i) => <circle key={i} cx={rnd(i) * w} cy={-h + rnd(i + 9) * h} r={2 + rnd(i + 3) * 7} fill="#fff" opacity={0.18} />)}
        {fria && <path d={`M0,${-h} L${w},${-h} L${w},${-h + 40} Q${w * 0.8},${-h + 70} ${w * 0.6},${-h + 38} Q${w * 0.4},${-h + 90} ${w * 0.25},${-h + 40} Q${w * 0.1},${-h + 64} 0,${-h + 36} Z`} fill="#F4FBFF" />}
        {!fria && Array.from({length: 7}, (_, i) => <path key={i} d={`M${20 + rnd(i) * (w - 40)},${-h + 20 + rnd(i + 5) * (h - 60)} l${(rnd(i + 2) - 0.5) * 60},${30 + rnd(i + 8) * 40} l${(rnd(i + 4) - 0.5) * 40},${30 + rnd(i + 6) * 40}`} stroke={QU.fogo} strokeWidth={3} fill="none" opacity={pul * 0.9} />)}
      </g>
      {/* placa */}
      <g opacity={txtOp} transform={`translate(0,${-h - 90}) scale(${lerp(0.85, 1, txtOp)})`}>
        <rect x={-190} y={-62} width={380} height={124} rx={18} fill="#070B16" stroke={fria ? FR.gelo : QU.fogo} strokeWidth={5} />
        <rect x={-190} y={-62} width={380} height={124} rx={18} fill="none" stroke={fria ? FR.gelo : QU.fogo} strokeWidth={18} opacity={0.35} filter="url(#bl8)" />
        <text x={0} y={30} textAnchor="middle" fill="#F2F4F8" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 86}}>{txt}</text>
      </g>
    </g>
  );
};
const DefsPorta = () => (
  <defs>
    <linearGradient id="pfF" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#B9DDF5" /><stop offset="100%" stopColor="#4F86B4" /></linearGradient>
    <linearGradient id="pfQ" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5A2414" /><stop offset="100%" stopColor="#2A0E08" /></linearGradient>
    <filter id="bl8"><feGaussianBlur stdDeviation="8" /></filter>
    <filter id="bl20"><feGaussianBlur stdDeviation="20" /></filter>
  </defs>
);
export const PortasPar: React.FC<{lt: number; t: number; tE: number; tD: number}> = ({lt, t, tE, tD}) => (
  <AbsoluteFill style={{background: 'linear-gradient(90deg, #0B2238 0%, #0A0F1A 50%, #24090400 50%, #2A0C06 100%)'}}>
    <AbsoluteFill style={{background: 'linear-gradient(90deg, #12324F, #0A111C 49.8%, #1A0905 50.2%, #3A1309)'}} />
    <SVG>
      <DefsPorta />
      <rect x={0} y={900} width={960} height={180} fill="#CFE6F7" opacity={0.25} />
      <rect x={960} y={900} width={960} height={180} fill="#3A160C" />
      <line x1={960} y1={0} x2={960} y2={1080} stroke="#000" strokeWidth={6} opacity={0.6} />
      <PortaFrente x={480} y={910} s={0.95} fria txt="−14 °C" txtOp={KO(lt, tE, tE + 0.35)} t={t} />
      <PortaFrente x={1440} y={910} s={0.95} fria={false} txt="+44 °C" txtOp={KO(lt, tD, tD + 0.35)} t={t} />
      {Array.from({length: 50}, (_, i) => <circle key={i} cx={rnd(i) * 900} cy={(rnd(i + 3) * 1080 + t * 60 * (0.5 + rnd(i + 7))) % 1080} r={1.5 + rnd(i + 1) * 3} fill="#fff" opacity={0.6} />)}
      {Array.from({length: 40}, (_, i) => <circle key={'b' + i} cx={1000 + rnd(i + 40) * 900} cy={1080 - ((rnd(i + 43) * 1080 + t * 90 * (0.5 + rnd(i + 47))) % 1080)} r={1.5 + rnd(i + 41) * 2.5} fill={QU.fogo} opacity={0.8} />)}
    </SVG>
  </AbsoluteFill>
);

// ============ MAPA REAL DO BRASIL (imagem de satélite) ============
const BOX = {lon0: -82, lon1: -26, lat0: 10, lat1: -40};
export const MapaBR: React.FC<{lt: number; d: number; t1: number; t2: number}> = ({lt, d, t1, t2}) => {
  const z = lerp(1, 1.12, sm(clamp01(lt / d)));
  const s = 40 * z, lonC = -52, latC = -20;
  const P = (lon: number, lat: number): [number, number] => [960 + (lon - lonC) * s, 540 - (lat - latC) * s];
  const [x0, y0] = P(BOX.lon0, BOX.lat0);
  const proj = geoOrthographic; // (só para o tipo)
  const pin = (lon: number, lat: number, txt: string, nome: string, cor: string, k: number, lado: 1 | -1) => {
    const [x, y] = P(lon, lat);
    return (
      <g opacity={k}>
        <circle cx={x} cy={y} r={10 + 30 * (1 - k)} fill="none" stroke={cor} strokeWidth={3} opacity={1 - k * 0.6} />
        <circle cx={x} cy={y} r={9} fill={cor} stroke="#fff" strokeWidth={3} />
      </g>
    );
  };
  const tag = (lon: number, lat: number, txt: string, nome: string, cor: string, k: number, lado: 1 | -1) => {
    const [x, y] = P(lon, lat);
    return (
      <div style={{position: 'absolute', left: x + lado * 26, top: y, transform: `translate(${lado < 0 ? '-100%' : '0'}, -50%) translateX(${(1 - k) * 16 * lado}px)`, opacity: k, padding: '10px 20px', borderRadius: 10, background: 'rgba(6,10,20,0.88)', borderLeft: `5px solid ${cor}`, boxShadow: '0 10px 30px rgba(0,0,0,0.55)'}}>
        <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 54, color: '#fff', lineHeight: 1}}>{txt}</div>
        <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 18, letterSpacing: 3, color: '#C3CAD8', marginTop: 4}}>{nome}</div>
      </div>
    );
  };
  const k1 = KO(lt, t1, t1 + 0.4), k2 = KO(lt, t2, t2 + 0.4);
  return (
    <AbsoluteFill style={{background: '#04101f'}}>
      <Img src={staticFile('mapa_br.jpg')} style={{position: 'absolute', left: x0, top: y0, width: (BOX.lon1 - BOX.lon0) * s, height: (BOX.lat0 - BOX.lat1) * s, filter: 'brightness(0.72) saturate(0.9) contrast(1.05)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 52% 52%, transparent 45%, rgba(0,0,0,0.65) 100%)'}} />
      <SVG>
        {pin(-51.01, -26.78, '', '', FR.gelo, k1, -1)}
        {pin(-42.06, -16.85, '', '', QU.fogo, k2, 1)}
      </SVG>
      {tag(-51.01, -26.78, '−14 °C', 'CAÇADOR (SC) · 1952', FR.azul, k1, -1)}
      {tag(-42.06, -16.85, '+44,8 °C', 'ARAÇUAÍ (MG) · 2023', QU.brasa, k2, 1)}
    </AbsoluteFill>
  );
};

// ============ ESPAÇO REAL ============
export const Espaco: React.FC<{lt: number}> = ({lt}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Img src={staticFile('espaco.jpg')} style={{position: 'absolute', width: 1920, height: 1080, transform: `scale(${1.08 + lt * 0.05})`, filter: 'saturate(0.8) hue-rotate(-10deg) brightness(0.85)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(40,90,160,0.18), transparent 60%)', mixBlendMode: 'screen'}} />
    <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Numero cor={FR.azul} size={190} op={KO(lt, 0.05, 0.3)} style={{transform: `scale(${lerp(1.15, 1, KO(lt, 0.05, 0.35))})`}}>−270 °C</Numero>
    </AbsoluteFill>
  </AbsoluteFill>
);

// ============ SOL 2D (granulação, coroa, proeminência) ============
export const Sol: React.FC<{lt: number; t: number; num?: string; r?: number; cx?: number; cy?: number}> = ({lt, t, num = '15.000.000 °C', r = 330, cx = 960, cy = 450}) => {
  const z = lerp(1, 1.12, sm(clamp01(lt / 2.5)));
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 52%, #3A1205 0%, #120402 55%, #050101 100%)'}}>
      <SVG>
        <defs>
          <radialGradient id="sol" cx="45%" cy="42%"><stop offset="0%" stopColor="#FFF6D0" /><stop offset="35%" stopColor="#FFC53D" /><stop offset="75%" stopColor="#FF7A1A" /><stop offset="100%" stopColor="#C2380C" /></radialGradient>
          <radialGradient id="coroa"><stop offset="55%" stopColor="#FFB547" stopOpacity={0.55} /><stop offset="100%" stopColor="#FF7A1A" stopOpacity={0} /></radialGradient>
          <filter id="turb"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={3} seed={Math.floor(t * 4) % 20} /><feColorMatrix values="0 0 0 0 1  0 0 0 0 0.55  0 0 0 0 0.1  0 0 0 0.55 0" /><feComposite in2="SourceGraphic" operator="in" /></filter>
          <filter id="blP"><feGaussianBlur stdDeviation="9" /></filter>
          <clipPath id="clipSol"><circle cx={cx} cy={cy} r={r * z} /></clipPath>
        </defs>
        <circle cx={cx} cy={cy} r={r * z * 1.55} fill="url(#coroa)" />
        <circle cx={cx} cy={cy} r={r * z} fill="url(#sol)" />
        <rect x={cx - r * z} y={cy - r * z} width={2 * r * z} height={2 * r * z} filter="url(#turb)" clipPath="url(#clipSol)" opacity={0.75} />
        {(() => { const R0 = r * z * 0.99, a1 = -0.95, a2 = -0.62, h = r * z * (0.32 + 0.03 * Math.sin(t * 1.4)); const p1 = [cx + Math.cos(a1) * R0, cy + Math.sin(a1) * R0], p2 = [cx + Math.cos(a2) * R0, cy + Math.sin(a2) * R0], am = (a1 + a2) / 2, c = [cx + Math.cos(am) * (R0 + h * 1.6), cy + Math.sin(am) * (R0 + h * 1.6)]; return <><path d={`M${p1[0]},${p1[1]} Q${c[0]},${c[1]} ${p2[0]},${p2[1]}`} stroke="#FF8A2A" strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.55} filter="url(#blP)" /><path d={`M${p1[0]},${p1[1]} Q${c[0]},${c[1]} ${p2[0]},${p2[1]}`} stroke="#FFC060" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.8} /></>; })()}
      </SVG>
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 70}}>
        <Numero cor={QU.brasa} size={150} op={KO(lt, 0.1, 0.4)}>{num}</Numero>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ ANNA SOB O GELO (corte do rio congelado) ============
export const AnnaGelo: React.FC<{lt: number; t: number; d: number}> = ({lt, t, d}) => {
  const minutos = Math.floor(lerp(0, 80, KO(lt, 1.6, d - 0.3)));
  const geloY = 330;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #9CB7CF 0%, #D6E4EE 30%)'}}>
      <SVG>
        <defs>
          <linearGradient id="agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2C6A8E" /><stop offset="100%" stopColor="#06182A" /></linearGradient>
          <linearGradient id="gelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F4FBFF" /><stop offset="100%" stopColor="#A9D3F0" /></linearGradient>
        </defs>
        {/* margem com neve e pinheiros */}
        {Array.from({length: 14}, (_, i) => { const x = i * 150 - 40 + rnd(i) * 40, h = 120 + rnd(i + 3) * 90; return <path key={i} d={`M${x},${geloY - 40} l40,${-h} l40,${h} Z`} fill="#2F4A44" opacity={0.85} />; })}
        <rect x={0} y={geloY - 44} width={1920} height={50} fill="#EEF5FA" />
        <rect x={0} y={geloY} width={1920} height={1080 - geloY} fill="url(#agua)" />
        <rect x={0} y={geloY} width={1920} height={70} fill="url(#gelo)" />
        {Array.from({length: 18}, (_, i) => <path key={i} d={`M${i * 110 + rnd(i) * 60},${geloY} l${(rnd(i + 2) - 0.5) * 50},${30 + rnd(i + 5) * 40}`} stroke="#7FB4D8" strokeWidth={2} />)}
        {/* bolsão de ar */}
        <path d={`M760,${geloY + 70} Q960,${geloY + 150} 1160,${geloY + 70} Z`} fill="#CFE6F5" opacity={0.85} />
        {/* raios de luz na água */}
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${600 + i * 220},${geloY + 70} l${-120 + i * 20},700 l80,0 Z`} fill="#BFE6FF" opacity={0.06 + 0.03 * Math.sin(t * 1.5 + i)} />)}
        {/* Anna: rosto no bolsão, mãos no gelo */}
        <g transform={`translate(960,${geloY + 520 + Math.sin(t * 1.2) * 6}) scale(1.3)`}>
          <Pessoa v={ANNA} expr="frio" t={t} bE={[160, 30]} bD={[160, 30]} cabeloSolto={0.8} />
        </g>
        {/* bolhas */}
        {Array.from({length: 22}, (_, i) => { const y = geloY + 80 + ((900 - ((t * 70 * (0.6 + rnd(i))) + rnd(i + 9) * 900) % 900)); return <circle key={i} cx={880 + rnd(i + 4) * 160 + Math.sin(t * 2 + i) * 8} cy={y} r={3 + rnd(i + 2) * 7} fill="none" stroke="#DDF1FF" strokeWidth={2} opacity={0.6} />; })}
      </SVG>
    </AbsoluteFill>
  );
};
export const AnnaTimer: React.FC<{lt: number; d: number}> = ({lt, d}) => {
  const minutos = Math.floor(lerp(0, 80, KO(lt, 1.6, d - 0.3)));
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', right: 90, top: 400, opacity: KO(lt, 1.4, 1.8), padding: '16px 28px', borderRadius: 14, background: 'rgba(4,10,22,0.86)', borderLeft: `5px solid ${FR.azul}`, boxShadow: '0 12px 36px rgba(0,0,0,0.6)'}}>
        <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 18, letterSpacing: 4, color: '#B9C2D3'}}>SOB O GELO</div>
        <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 86, color: '#fff', fontVariantNumeric: 'tabular-nums', lineHeight: 1.05}}>{minutos} MIN</div>
      </div>
    </AbsoluteFill>
  );
};

// ============ BLAGDEN NA SALA AQUECIDA (1774) ============
export const SalaBlagden: React.FC<{lt: number; t: number; d: number}> = ({lt, t, d}) => {
  const coz = KO(lt, 0.8, d - 0.4);
  const ondas = (i: number) => Math.sin(t * 2 + i) * 6;
  return (
    <AbsoluteFill style={{background: '#2A140C'}}>
      <SVG>
        <defs>
          <pattern id="tijolo" width={120} height={60} patternUnits="userSpaceOnUse"><rect width={120} height={60} fill="#6A3420" /><rect x={2} y={2} width={116} height={26} fill="#7C3F27" /><rect x={-58} y={32} width={116} height={26} fill="#733A24" /><rect x={62} y={32} width={116} height={26} fill="#733A24" /></pattern>
          <radialGradient id="calorSala" cx="22%" cy="70%"><stop offset="0%" stopColor="#FF8A2A" stopOpacity={0.55} /><stop offset="100%" stopColor="#FF8A2A" stopOpacity={0} /></radialGradient>
        </defs>
        <rect width={1920} height={820} fill="url(#tijolo)" />
        <rect y={820} width={1920} height={260} fill="#3B2216" />
        {Array.from({length: 9}, (_, i) => <line key={i} x1={i * 240} y1={820} x2={i * 240 - 120} y2={1080} stroke="#2A170F" strokeWidth={4} />)}
        {/* fogão de ferro */}
        <g transform="translate(330,820)">
          <rect x={-150} y={-300} width={300} height={300} rx={14} fill="#2B2B2E" />
          <rect x={-100} y={-200} width={200} height={130} rx={10} fill="#FF7A2F" opacity={0.6 + 0.3 * Math.sin(t * 5)} />
          <rect x={-100} y={-200} width={200} height={130} rx={10} fill="none" stroke="#151517" strokeWidth={8} />
          <rect x={-40} y={-560} width={80} height={260} fill="#2B2B2E" />
        </g>
        <rect width={1920} height={1080} fill="url(#calorSala)" />
        {/* mesa com o ovo */}
        <g transform="translate(1440,820)">
          <rect x={-170} y={-180} width={340} height={22} fill="#5A3A22" />
          <rect x={-150} y={-158} width={18} height={158} fill="#4A2E1A" /><rect x={132} y={-158} width={18} height={158} fill="#4A2E1A" />
          <ellipse cx={0} cy={-186} rx={110} ry={16} fill="#E8E2D2" />
          <ellipse cx={0} cy={-196} rx={58} ry={18} fill={`rgb(${lerp(250, 255, coz)},${lerp(252, 250, coz)},${lerp(250, 240, coz)})`} opacity={lerp(0.55, 1, coz)} />
          <ellipse cx={-8} cy={-200} rx={22} ry={12} fill={`rgb(255,${Math.round(lerp(190, 200, coz))},${Math.round(lerp(40, 70, coz))})`} />
          {[0, 1, 2].map((i) => <path key={i} d={`M${-30 + i * 30},-230 q${ondas(i)},-25 0,-50 q${-ondas(i)},-25 0,-50`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.35 * coz} strokeLinecap="round" />)}
        </g>
        {/* termômetro antigo na parede */}
        <g transform="translate(1690,200)">
          <rect x={-34} y={0} width={68} height={420} rx={14} fill="#E9DFC8" stroke="#8C7350" strokeWidth={4} />
          <rect x={-7} y={30} width={14} height={340} rx={7} fill="#F6F1E4" stroke="#B6A27E" strokeWidth={2} />
          <rect x={-7} y={lerp(300, 60, KO(lt, 0.2, 1.4))} width={14} height={370 - lerp(300, 60, KO(lt, 0.2, 1.4))} rx={7} fill="#C22B1F" />
          <circle cx={0} cy={380} r={22} fill="#C22B1F" />
        </g>
        {/* Blagden calmo */}
        <g transform="translate(900,1000) scale(1.75)">
          <ellipse cx={0} cy={0} rx={90} ry={14} fill="rgba(0,0,0,0.35)" />
          <Pessoa v={BLAGDEN} expr="calmo" t={t} suor={0.9} bE={[14, 10]} bD={[30, 95]} />
        </g>
      </SVG>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};

// ============ WILLIE NO HOSPITAL (1980) ============
export const Hospital: React.FC<{lt: number; t: number; d: number}> = ({lt, t, d}) => {
  const temp = lerp(37, 46.5, KO(lt, 0.4, d - 0.6));
  const beep = (t * 2.2) % 1 < 0.12;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #D9E4E8 0%, #BFD0D6 60%, #8FA5AE 100%)'}}>
      <SVG>
        <rect y={760} width={1920} height={320} fill="#7E949E" />
        <rect x={0} y={740} width={1920} height={20} fill="#6C838E" />
        {/* janela */}
        <rect x={1260} y={140} width={420} height={320} fill="#FFD27A" opacity={0.75} />
        <rect x={1260} y={140} width={420} height={320} fill="none" stroke="#E7EEF0" strokeWidth={18} />
        <line x1={1470} y1={140} x2={1470} y2={460} stroke="#E7EEF0" strokeWidth={10} />
        {/* monitor */}
        <g transform="translate(330,250)">
          <rect x={-150} y={-90} width={300} height={200} rx={14} fill="#1C2430" />
          <rect x={-132} y={-72} width={264} height={164} rx={6} fill="#0A1018" />
          <path d={`M-120,10 ${Array.from({length: 24}, (_, i) => { const x = -120 + i * 10; const ph = (i - ((t * 22) % 24) + 24) % 24; return `L${x},${ph < 1 ? -40 : ph < 2 ? 30 : 10}`; }).join(' ')}`} stroke="#3DDB7A" strokeWidth={3} fill="none" />
          <circle cx={110} cy={-50} r={8} fill={beep ? '#FF4D4D' : '#5A1A1A'} />
        </g>
        {/* cama */}
        <g transform="translate(960,860)">
          <rect x={-520} y={-120} width={1040} height={60} rx={14} fill="#E6ECEE" />
          <rect x={-520} y={-170} width={1040} height={60} rx={20} fill="#F7FAFB" />
          <rect x={-540} y={-300} width={30} height={300} rx={8} fill="#A9B6BC" />
          <rect x={510} y={-220} width={30} height={220} rx={8} fill="#A9B6BC" />
          <ellipse cx={-330} cy={-190} rx={130} ry={44} fill="#FFFFFF" />
          <g transform="translate(150,-205) rotate(-90) scale(1.25)">
            <Pessoa v={WILLIE} expr="dor" t={t} suor={1} semPernas bE={[3, 0]} bD={[3, 0]} />
          </g>
          <path d="M-180,-215 Q100,-260 500,-200 L500,-120 L-180,-120 Z" fill="#9FC2D1" />
          <path d="M-180,-215 Q100,-260 500,-200" stroke="#7FA8BA" strokeWidth={6} fill="none" />
        </g>
      </SVG>
      {/* termômetro clínico grande */}
      <div style={{position: 'absolute', right: 100, top: 520, padding: '14px 26px', borderRadius: 14, background: 'rgba(6,10,20,0.9)', borderLeft: `5px solid ${QU.lava}`, boxShadow: '0 12px 36px rgba(0,0,0,0.5)'}}>
        <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 18, letterSpacing: 4, color: '#B9C2D3'}}>TEMPERATURA DO CORPO</div>
        <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 92, color: temp > 42 ? '#FF8A6A' : '#fff', fontVariantNumeric: 'tabular-nums', lineHeight: 1.05}}>{temp.toFixed(1).replace('.', ',')} °C</div>
      </div>
    </AbsoluteFill>
  );
};

// ============ PLACAR FRIO | CALOR ============
const LINHAS_F = ['', '', '', '', ''], LINHAS_Q = ['', '', '', '', ''];
export const Placar: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const k = KO(lt, 0, 0.45);
  const pisca = 0.55 + 0.45 * Math.abs(Math.sin(t * 3));
  const col = (x: number, cor: string, titulo: string, fim: string, delay: number) => (
    <div style={{position: 'absolute', left: x, top: 150, width: 620, opacity: KO(lt, delay, delay + 0.4), transform: `translateY(${(1 - KO(lt, delay, delay + 0.4)) * 30}px)`}}>
      <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 64, color: cor, letterSpacing: 6, textAlign: 'center', textShadow: `0 0 24px ${cor}88`}}>{titulo}</div>
      <div style={{height: 6, background: cor, borderRadius: 3, margin: '8px 0 22px', boxShadow: `0 0 18px ${cor}`}} />
      {LINHAS_F.map((_, i) => <div key={i} style={{height: 62, margin: '10px 0', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.15)'}} />)}
      <div style={{marginTop: 16, height: 120, borderRadius: 14, background: 'rgba(6,10,20,0.9)', border: `3px solid ${cor}`, boxShadow: `0 0 ${20 * pisca}px ${cor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px'}}>
        <span style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: '#D7DCE6', width: 320, lineHeight: 1.25}}>{fim}</span>
        <span style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 76, color: '#fff', opacity: pisca}}>???</span>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{background: 'linear-gradient(90deg, #071A2E, #05070D 50%, #1E0804)'}}>
      <div style={{position: 'absolute', left: 959, top: 120, width: 2, height: 860, background: 'rgba(255,255,255,0.12)', opacity: k}} />
      {col(170, FR.gelo, 'FRIO', 'O LUGAR MAIS FRIO DO UNIVERSO', 0.1)}
      {col(1130, QU.fogo, 'CALOR', 'O LUGAR MAIS QUENTE DO UNIVERSO', 0.35)}
    </AbsoluteFill>
  );
};

// ============ TERRA (globo vetorial) ============
export const Terra: React.FC<{lt: number; t: number; d: number}> = ({lt, t, d}) => {
  const z = lerp(300, 470, sm(clamp01(lt / d)));
  const proj = geoOrthographic().rotate([62 - lt * 5, 12]).scale(z).translate([960, 560]).clipAngle(90);
  const path = geoPath(proj);
  const grat = geoGraticule().step([20, 20])();
  return (
    <AbsoluteFill style={{background: '#02040A'}}>
      <Img src={staticFile('espaco.jpg')} style={{position: 'absolute', width: 1920, height: 1080, opacity: 0.55}} />
      <SVG>
        <defs>
          <radialGradient id="oceano" cx="38%" cy="35%"><stop offset="0%" stopColor="#2F79B8" /><stop offset="70%" stopColor="#123E6E" /><stop offset="100%" stopColor="#081C36" /></radialGradient>
          <radialGradient id="atm"><stop offset="88%" stopColor="#7CC4FF" stopOpacity={0} /><stop offset="96%" stopColor="#7CC4FF" stopOpacity={0.5} /><stop offset="100%" stopColor="#7CC4FF" stopOpacity={0} /></radialGradient>
          <radialGradient id="sombraT" cx="30%" cy="30%"><stop offset="55%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.65} /></radialGradient>
        </defs>
        <circle cx={960} cy={560} r={z * 1.08} fill="url(#atm)" />
        <circle cx={960} cy={560} r={z} fill="url(#oceano)" />
        <path d={path(grat) || ''} fill="none" stroke="#fff" strokeOpacity={0.06} />
        {mundo.map((f: any, i: number) => <path key={i} d={path(f) || ''} fill={f === brasil ? '#5E8A4A' : '#4F7A43'} stroke="#8DB27A" strokeOpacity={0.25} strokeWidth={0.6} />)}
        {Array.from({length: 26}, (_, i) => { const ll: [number, number] = [rnd(i) * 360 - 180 + lt * 2, rnd(i + 5) * 120 - 60]; if (geoDistance(ll, [-(62 - lt * 5), -12]) > 1.45) return null; const p = proj(ll); if (!p) return null; return <ellipse key={i} cx={p[0]} cy={p[1]} rx={z * (0.08 + rnd(i + 2) * 0.12)} ry={z * 0.03} fill="#fff" opacity={0.22} />; })}
        <circle cx={960} cy={560} r={z} fill="url(#sombraT)" />
      </SVG>
    </AbsoluteFill>
  );
};

// ============ LABORATÓRIO: porta entreaberta, silhuetas ============
export const Laboratorio: React.FC<{lt: number; t: number; d: number}> = ({lt, t, d}) => {
  const ab = KO(lt, 0.2, 1.6);
  return (
    <AbsoluteFill style={{background: '#06080F'}}>
      <SVG>
        <DefsPorta />
        <rect x={0} y={880} width={1920} height={200} fill="#0B0F1A" />
        {/* luz que sai da porta (metade fria, metade quente) */}
        <path d={`M${960 - 170},${880} L${960 + 170 - 300 * (1 - ab)},${880} L${1920},${1080} L${0},${1080} Z`} fill="#FFF3DC" opacity={0.18 * ab} />
        <g transform="translate(960,880) scale(1.15)">
          <rect x={-176} y={-586} width={352} height={586} fill="#11151F" />
          <rect x={-150} y={-560} width={300} height={560} fill="url(#labLuz)" />
          {/* silhuetas dos cientistas atrás do vidro */}
          <g opacity={ab} filter="url(#bl8)">
            <g transform="translate(-60,0) scale(1.05)"><Pessoa v={{...CIENTISTA, pele: '#10131C', peleSombra: '#10131C', topo: {tipo: 'jaleco', cor: '#10131C', cor2: '#10131C'}, baixo: {tipo: 'calca', cor: '#10131C'}, cabelo: {tipo: 'curto', cor: '#10131C'}, pe: {tipo: 'sapato', cor: '#10131C'}}} t={t} bD={[40, 70]} sil /></g>
            <g transform="translate(80,0) scale(0.98)"><Pessoa v={{...CIENTISTA2, pele: '#10131C', peleSombra: '#10131C', topo: {tipo: 'jaleco', cor: '#10131C', cor2: '#10131C'}, baixo: {tipo: 'calca', cor: '#10131C'}, cabelo: {tipo: 'longo', cor: '#10131C', cor2: '#10131C'}, pe: {tipo: 'sapato', cor: '#10131C'}}} t={t} bE={[30, 80]} sil /></g>
          </g>
          <g transform={`translate(-150,0) scale(${1 - ab * 0.8},1)`}>
            <rect x={0} y={-560} width={300} height={560} fill="#2A3242" stroke="#56627A" strokeWidth={4} />
            <rect x={60} y={-500} width={180} height={220} rx={8} fill="#9FB4CC" opacity={0.35} />
            <circle cx={264} cy={-280} r={11} fill="#B9C6D8" />
          </g>
        </g>
        <defs><linearGradient id="labLuz" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#CFEAFF" /><stop offset="50%" stopColor="#FFFFFF" /><stop offset="100%" stopColor="#FFD7A0" /></linearGradient></defs>
      </SVG>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, transparent 35%, rgba(0,0,0,0.7) 100%)'}} />
    </AbsoluteFill>
  );
};

// ============ PERGUNTA: anel de tempo ============
export const Pergunta: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const k = KO(lt, 0, 0.35);
  const arco = (lt * 0.6) % 1;
  const r = 330, a = arco * Math.PI * 2;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #121A2C, #05070D 70%)'}}>
      <SVG>
        <g transform={`translate(960,540) scale(${lerp(0.85, 1, k)})`} opacity={k}>
          <circle r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={22} />
          <path d={`M0,${-r} A${r},${r} 0 ${a > Math.PI ? 1 : 0} 1 ${r * Math.sin(a)},${-r * Math.cos(a)}`} stroke="url(#arcoG)" strokeWidth={22} fill="none" strokeLinecap="round" />
          <defs><linearGradient id="arcoG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={FR.gelo} /><stop offset="100%" stopColor={QU.brasa} /></linearGradient></defs>
          <text y={-20} textAnchor="middle" fill="#F2F4F8" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 70, letterSpacing: 3}}>QUANTO TEMPO</text>
          <text y={60} textAnchor="middle" fill="#F2F4F8" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 70, letterSpacing: 3}}>VOCÊ AGUENTA?</text>
        </g>
      </SVG>
    </AbsoluteFill>
  );
};

// ============ TERMÔMETRO-RÉGUA (vertical, lateral) ============
export const Regua: React.FC<{k: number; valor: number; marca?: string}> = ({k, valor, marca = 'VOCÊ'}) => {
  // escala visual: -50..60 °C
  const y = (v: number) => lerp(880, 180, (v + 50) / 110);
  return (
    <g opacity={k} transform={`translate(${lerp(1960, 1640, k)},0)`}>
      <rect x={-30} y={150} width={60} height={760} rx={30} fill="rgba(6,10,20,0.85)" stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
      <defs><linearGradient id="tubo" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor={FR.azul} /><stop offset="50%" stopColor="#E8E8E8" /><stop offset="100%" stopColor={QU.lava} /></linearGradient></defs>
      <rect x={-10} y={y(valor)} width={20} height={880 - y(valor)} rx={10} fill="url(#tubo)" />
      <circle cx={0} cy={905} r={34} fill={FR.azul} stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
      {[-40, -20, 0, 20, 40, 60].map((v) => <g key={v}><line x1={-30} x2={-14} y1={y(v)} y2={y(v)} stroke="#fff" strokeOpacity={0.5} strokeWidth={2} /><text x={-44} y={y(v) + 8} textAnchor="end" fill="#AEB6C6" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22}}>{v}</text></g>)}
      <g transform={`translate(0,${y(valor)})`}>
        <path d="M34,0 L54,-14 L54,14 Z" fill={QU.fogo} />
        <rect x={54} y={-26} width={150} height={52} rx={10} fill={QU.brasa} />
        <text x={129} y={11} textAnchor="middle" fill="#fff" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 32}}>{marca} {Math.round(valor)}°</text>
      </g>
    </g>
  );
};

// ============ PORTA 1: o corpo por dentro (37 °C) ============
export const Corpo37: React.FC<{lt: number; t: number; d: number; pele: number; centro: number; orgaos: number; regua: number}> = ({lt, t, d, pele, centro, orgaos, regua}) => {
  const bat = Math.pow(Math.max(0, Math.sin(t * 7.5)), 8);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 42% 55%, #16233A, #05070D 70%)'}}>
      <SVG>
        <defs>
          <radialGradient id="nucleo" cx="50%" cy="50%"><stop offset="0%" stopColor="#FFD08A" stopOpacity={0.95} /><stop offset="45%" stopColor="#FF7A2F" stopOpacity={0.55} /><stop offset="100%" stopColor="#FF7A2F" stopOpacity={0} /></radialGradient>
          <filter id="bl12"><feGaussianBlur stdDeviation="12" /></filter>
        </defs>
        <g transform="translate(800,1010) scale(1.95)">
          <ellipse cx={0} cy={0} rx={90} ry={14} fill="rgba(0,0,0,0.4)" />
          <g opacity={lerp(1, 0.3, centro)}><Pessoa v={VOCE} expr="neutro" t={t} /></g>
          {/* contorno da pele (some) */}
          {pele > 0 && <path d="M-60,-300 L-60,-190 M60,-300 L60,-190 M-40,-364 a40,44 0 1,1 80,0 a40,44 0 1,1 -80,0" stroke="#7CC4FF" strokeWidth={3} strokeDasharray="8 8" fill="none" opacity={pele} />}
          {/* núcleo quente */}
          <g opacity={centro}>
            <ellipse cx={0} cy={-250} rx={70} ry={110} fill="url(#nucleo)" />
            <ellipse cx={0} cy={-366} rx={42} ry={46} fill="url(#nucleo)" />
          </g>
          {/* órgãos: coração e cérebro + fluxo de sangue */}
          <g opacity={orgaos}>
            <g transform={`translate(10,-262) scale(${1 + bat * 0.12})`}>
              <path d="M0,18 C-30,-4 -26,-30 -10,-30 C-2,-30 0,-22 0,-18 C0,-22 2,-30 10,-30 C26,-30 30,-4 0,18 Z" fill="#E2453B" stroke="#FFD0C8" strokeWidth={2} />
            </g>
            <g transform="translate(0,-378)">
              <path d="M-26,8 C-34,-14 -14,-30 0,-24 C14,-30 34,-14 26,8 C18,18 -18,18 -26,8 Z" fill="#F29BA6" stroke="#FFE0E4" strokeWidth={2} />
              <path d="M0,-24 L0,14 M-14,-10 q6,6 0,12 M14,-10 q-6,6 0,12" stroke="#C8697A" strokeWidth={2} fill="none" />
            </g>
            <path id="vaso" d="M10,-262 C40,-300 30,-340 6,-352 M10,-262 C-20,-220 -30,-180 -22,-120" stroke="#E2453B" strokeWidth={4} fill="none" opacity={0.7} strokeDasharray="10 8" strokeDashoffset={-t * 40} />
          </g>
        </g>
      </SVG>
    </AbsoluteFill>
  );
};
