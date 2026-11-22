/* Vídeo 7 — cenas 2D dos blocos 1 (três ondas) e 2 (arquivo) */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {geoOrthographic} from 'd3-geo';
import {F} from './theme';
import {lerp, rnd, clamp01, prog, KO, KS, es} from './base';
import {Pessoa, CIENTISTA, BLAGDEN, Visual} from './personagens';
import {SVG, COR, Espaco, SolG, Globo, MapaAS, Rotulo, Pulso, Traco, suave, pts} from './comum7';

export type P = {lt: number; d: number; t: number; arg?: string};
const Label: React.FC<{x: number; y: number; txt: string; cor?: string; op?: number; size?: number}> = ({x, y, txt, cor = COR.ouro, op = 1, size = 30}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: op, transform: 'translate(-50%,-50%)', fontFamily: F.rotulo, fontWeight: 700, fontSize: size, letterSpacing: 4, color: cor, whiteSpace: 'nowrap', textShadow: '0 2px 12px rgba(0,0,0,0.8)'}}>{txt}</div>
);

// ===================== as três ondas =====================
export const Ondas: React.FC<P> = ({lt, t, arg}) => {
  const n = Number(arg ?? 0); const SX = 300, EX = 1640, Y = 560;
  return (
    <AbsoluteFill>
      <Espaco t={t} />
      <SVG>
        <SolG x={SX} y={Y} r={150} t={t} furia={n ? 0.6 : 0.2} id="on" />
        <Globo cx={EX} cy={Y} r={110} lon={-50} lat={-12} />
        {/* onda 1: luz (arcos brancos rápidos) */}
        {n >= 1 && Array.from({length: 7}, (_, i) => { const k = ((lt * 0.9 + i / 7) % 1); const x = SX + 170 + k * (EX - SX - 290); return <path key={i} d={`M${x},${Y - 170} Q${x + 60},${Y} ${x},${Y + 170}`} fill="none" stroke="#FFFFFF" strokeWidth={n === 1 ? 6 : 3} opacity={(n === 1 ? 0.9 : 0.25) * Math.sin(k * Math.PI)} />; })}
        {/* onda 2: partículas */}
        {n >= 2 && Array.from({length: 70}, (_, i) => { const k = ((lt * 0.55 + rnd(i)) % 1); const x = SX + 170 + k * (EX - SX - 300); const y = Y + (rnd(i + 40) - 0.5) * 260; return <line key={i} x1={x} y1={y} x2={x - 26} y2={y} stroke="#9FD8FF" strokeWidth={n === 2 ? 4 : 2} opacity={(n === 2 ? 0.95 : 0.3) * Math.sin(k * Math.PI)} strokeLinecap="round" />; })}
        {/* onda 3: a nuvem (bolha laranja lenta) */}
        {n >= 3 && (() => { const k = KS(lt, 0, 4.2); const x = SX + 160 + k * 520; return <g>
          <ellipse cx={x} cy={Y} rx={160 + k * 120} ry={230 + k * 70} fill="url(#nuvemG)" />
          <defs><radialGradient id="nuvemG"><stop offset="0.3" stopColor={COR.plasma} stopOpacity="0" /><stop offset="0.8" stopColor={COR.plasma} stopOpacity="0.55" /><stop offset="1" stopColor={COR.plasma} stopOpacity="0" /></radialGradient></defs>
        </g>; })()}
      </SVG>
      {n >= 1 && <Label x={(SX + EX) / 2} y={860} txt={['', 'LUZ · 8 MIN', 'PARTÍCULAS · MINUTOS', 'A NUVEM · 15 H A 3 DIAS'][n]} cor={['', '#FFFFFF', '#9FD8FF', COR.plasma][n]} op={KO(lt, 0.3, 0.7)} />}
    </AbsoluteFill>
  );
};

// ===================== rádio de ondas curtas que perde o sinal =====================
export const Radio: React.FC<P> = ({lt, t}) => {
  const corte = KS(lt, 1.2, 1.6);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #26304A, #0A0E18 70%)'}}>
      <SVG>
        <rect x={560} y={330} width={800} height={430} rx={40} fill="#3B2F25" stroke="#5A4836" strokeWidth={6} />
        <rect x={600} y={370} width={420} height={350} rx={24} fill="#221A14" />
        {Array.from({length: 13}, (_, i) => <line key={i} x1={630} x2={990} y1={400 + i * 24} y2={400 + i * 24} stroke="#3A2D22" strokeWidth={10} />)}
        <rect x={1060} y={380} width={260} height={120} rx={12} fill="#0E2A1E" stroke="#5A4836" strokeWidth={4} />
        <path d={pts(Array.from({length: 60}, (_, i) => [1075 + i * 3.9, 440 + (1 - corte) * 28 * Math.sin(i * 0.7 + t * 14) + corte * (rnd(i + Math.floor(t * 20)) - 0.5) * 50] as [number, number]))} fill="none" stroke={corte > 0.5 ? '#FF5A3C' : '#6BFFA8'} strokeWidth={3} />
        {[1120, 1260].map((x, i) => <g key={i}><circle cx={x} cy={600} r={48} fill="#1C1510" stroke="#8B6F52" strokeWidth={5} /><line x1={x} y1={600} x2={x + 30 * Math.cos(i + 0.6)} y2={600 - 30 * Math.sin(i + 0.6)} stroke="#D8C2A0" strokeWidth={6} /></g>)}
        <line x1={1300} y1={330} x2={1460} y2={150} stroke="#999" strokeWidth={6} />
        {[0, 1, 2].map((k) => <path key={k} d={`M${1470 + k * 30},${190 - k * 30} a${40 + k * 30},${40 + k * 30} 0 0 1 0,${-1}`} fill="none" />)}
        {[0, 1, 2].map((k) => <circle key={k} cx={1460} cy={150} r={40 + k * 40 + ((lt * 60) % 40)} fill="none" stroke="#7CC4FF" strokeWidth={4} opacity={(1 - corte) * (0.7 - k * 0.2)} />)}
        <g opacity={corte} transform={`translate(1460 150) scale(${lerp(0.6, 1, corte)})`}><line x1={-50} y1={-50} x2={50} y2={50} stroke="#FF5A3C" strokeWidth={14} strokeLinecap="round" /><line x1={50} y1={-50} x2={-50} y2={50} stroke="#FF5A3C" strokeWidth={14} strokeLinecap="round" /></g>
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== avião e navio sem voz (mapa à noite) =====================
export const Aviao: React.FC<P> = ({lt, d, t}) => {
  const x = lerp(520, 1380, lt / Math.max(d, 1));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0A1430 0%, #13234A 55%, #0B1A33 56%, #061024 100%)'}}>
      <SVG>
        {Array.from({length: 120}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 3) * 560} r={1.2} fill="#fff" opacity={0.5} />)}
        {Array.from({length: 18}, (_, i) => <line key={i} x1={0} x2={1920} y1={620 + i * 26} y2={620 + i * 26} stroke="#2A4A7A" strokeOpacity={0.25 - i * 0.01} strokeWidth={2} />)}
        <g transform={`translate(${x} 330) scale(1.3)`}>
          <path d="M-170,0 L150,-14 Q190,-10 196,0 Q190,10 150,14 L-170,10 Z" fill="#E8ECF2" />
          <path d="M-10,-6 L-90,-120 L-55,-120 L60,-8 Z" fill="#C9D0DC" /><path d="M-10,10 L-90,120 L-55,120 L60,12 Z" fill="#B7BFCC" />
          <path d="M-150,-2 L-190,-60 L-165,-60 L-120,-4 Z" fill="#C9D0DC" />
          <circle cx={150} cy={0} r={4} fill={Math.sin(t * 6) > 0 ? '#FF4040' : '#400'} />
        </g>
        <g transform="translate(1500 700)"><path d="M-120,0 L120,0 L95,40 L-95,40 Z" fill="#2B3446" /><rect x={-40} y={-50} width={80} height={50} fill="#3A4560" /><line x1={0} y1={-50} x2={0} y2={-110} stroke="#8892A6" strokeWidth={4} /></g>
        {[[x + 190, 300], [1500, 590]].map(([cx, cy], j) => [0, 1, 2].map((k) => <path key={`${j}${k}`} d={`M${cx + 20 + k * 22},${cy - 30 - k * 10} q${16 + k * 8},${30 + k * 10} 0,${60 + k * 20}`} fill="none" stroke="#7CC4FF" strokeWidth={4} opacity={Math.max(0, 0.8 - lt * 0.35) * (1 - k * 0.25)} />))}
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== prótons atravessando um satélite =====================
export const Protons: React.FC<P> = ({lt, t}) => (
  <AbsoluteFill>
    <Espaco t={t} />
    <SVG>
      <g transform={`translate(960 540) rotate(${-8 + lt * 2})`}>
        <rect x={-560} y={-60} width={400} height={120} fill="#1E3A7A" stroke="#4A6BB0" strokeWidth={4} />
        <rect x={160} y={-60} width={400} height={120} fill="#1E3A7A" stroke="#4A6BB0" strokeWidth={4} />
        {Array.from({length: 8}, (_, i) => <line key={i} x1={-560 + i * 50} x2={-560 + i * 50} y1={-60} y2={60} stroke="#4A6BB0" strokeWidth={2} />)}
        {Array.from({length: 8}, (_, i) => <line key={i} x1={160 + i * 50} x2={160 + i * 50} y1={-60} y2={60} stroke="#4A6BB0" strokeWidth={2} />)}
        <rect x={-160} y={-120} width={320} height={240} rx={14} fill="#C9A24E" stroke="#E8C36A" strokeWidth={5} />
        <rect x={-120} y={-80} width={240} height={160} rx={8} fill="#A88638" />
        <circle cx={0} cy={0} r={34} fill="#20242E" stroke="#555" strokeWidth={4} />
      </g>
      {Array.from({length: 46}, (_, i) => { const k = ((lt * 0.9 + rnd(i)) % 1); const y = 120 + rnd(i + 20) * 840; const x = -100 + k * 2200; return <line key={i} x1={x} y1={y} x2={x - 120} y2={y + 18} stroke="#FFD27A" strokeWidth={3} opacity={0.85} strokeLinecap="round" />; })}
      {Array.from({length: 5}, (_, i) => { const on = rnd(i + Math.floor(t * 9)) > 0.6; return on ? <circle key={i} cx={840 + rnd(i * 7 + Math.floor(t * 9)) * 240} cy={440 + rnd(i * 3 + Math.floor(t * 9)) * 200} r={14} fill="#fff" opacity={0.9} /> : null; })}
    </SVG>
  </AbsoluteFill>
);

// ===================== relógio grande =====================
export const RelogioG: React.FC<P> = ({lt, t, arg}) => {
  const vermelho = (arg || '').startsWith('00');
  let txt = arg === '17h30' ? '17:30:00' : arg || '';
  if (vermelho) { const s = Math.max(0, 1800 - Math.floor(lt)); txt = `00:${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }
  const c = vermelho ? COR.perigo : arg === '17h30' ? COR.plasma : '#fff';
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${vermelho ? '#3A0E10' : '#1A1E2C'}, #05070D 70%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 260, color: '#fff', letterSpacing: 8, textShadow: `0 0 40px ${c}, 0 0 90px ${c}88`, opacity: KO(lt, 0, 0.3)}}>{txt}</div>
      {arg === '17h30' && <div style={{width: 1100, height: 14, borderRadius: 7, background: '#222838', marginTop: 40, overflow: 'hidden'}}><div style={{width: `${KS(lt, 0.2, 2.6) * 100}%`, height: '100%', background: c, boxShadow: `0 0 20px ${c}`}} /></div>}
    </AbsoluteFill>
  );
};

// ===================== Terra em corte: núcleo girando =====================
export const Nucleo: React.FC<P> = ({lt, t}) => {
  const cx = 960, cy = 560;
  return (
    <AbsoluteFill>
      <Espaco t={t} />
      <SVG>
        <defs>
          <radialGradient id="manto"><stop offset="0.6" stopColor="#B4421E" /><stop offset="1" stopColor="#6A2512" /></radialGradient>
          <radialGradient id="ext"><stop offset="0" stopColor="#FFD27A" /><stop offset="1" stopColor="#FF8A2A" /></radialGradient>
          <clipPath id="corte"><path d={`M${cx},${cy} L${cx},${cy - 460} A460,460 0 0 1 ${cx + 460},${cy} Z`} /></clipPath>
        </defs>
        <Globo cx={cx} cy={cy} r={430} lon={-52 + lt * 2} lat={-12} />
        <g clipPath="url(#corte)">
          <circle cx={cx} cy={cy} r={430} fill="#5A4030" /><circle cx={cx} cy={cy} r={410} fill="url(#manto)" />
          <circle cx={cx} cy={cy} r={240} fill="url(#ext)" /><circle cx={cx} cy={cy} r={105} fill="#FFF4D0" />
        </g>
        <path d={`M${cx},${cy} L${cx},${cy - 430} M${cx},${cy} L${cx + 430},${cy}`} stroke="#000" strokeOpacity={0.4} strokeWidth={4} />
        {Array.from({length: 10}, (_, i) => { const a0 = t * 0.9 + i * 0.63; const r = 125 + (i % 4) * 28; const a1 = a0 + 0.5;
          const sx = cx + r * Math.cos(a0), sy = cy + r * Math.sin(a0), ex = cx + r * Math.cos(a1), ey = cy + r * Math.sin(a1);
          const visivel = Math.cos(a0) > 0.05 && Math.sin(a0) < -0.05 && Math.cos(a1) > 0.05 && Math.sin(a1) < -0.05;
          return visivel ? <path key={i} d={`M${sx},${sy} A${r},${r} 0 0 1 ${ex},${ey}`} fill="none" stroke="#FFF1C2" strokeWidth={5} strokeLinecap="round" opacity={0.75} /> : null; })}
      </SVG>
      <Rotulo x={cx + 470} y={cy - 160} txt="FERRO DERRETIDO" cor={COR.brasa} op={KO(lt, 0.6, 1.0)} size={28} />
    </AbsoluteFill>
  );
};

export const LuaNucleo: React.FC<P> = ({lt, t}) => (
  <AbsoluteFill>
    <Espaco t={t} />
    <SVG>
      <defs><radialGradient id="ln1"><stop offset="0" stopColor="#FFD27A" /><stop offset="1" stopColor="#FF7A2A" /></radialGradient><radialGradient id="ln2" cx="0.4" cy="0.35"><stop offset="0" stopColor="#E8E8EC" /><stop offset="1" stopColor="#8D8F98" /></radialGradient></defs>
      <circle cx={700} cy={560} r={348 * KO(lt, 0, 0.6)} fill="url(#ln1)" />
      <circle cx={1350} cy={560 + 348 - 174} r={174 * KO(lt, 0.4, 1.0)} fill="url(#ln2)" />
      {[[1290, 690, 18], [1400, 630, 26], [1360, 760, 14]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r * KO(lt, 0.4, 1.0)} fill="#7A7C85" opacity={0.6} />)}
    </SVG>
    <Label x={700} y={960} txt="NÚCLEO EXTERNO · ~3.500 KM DE RAIO" cor={COR.brasa} op={KO(lt, 0.4, 0.8)} size={24} />
    <Label x={1350} y={960} txt="LUA · ~1.740 KM" cor="#C9CDD8" op={KO(lt, 0.8, 1.2)} size={24} />
  </AbsoluteFill>
);

// ===================== farol de bicicleta com dínamo =====================
export const Dinamo: React.FC<P> = ({lt, t}) => {
  const ang = t * 260; const luz = KS(lt, 0.4, 1.0);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 60% 50%, #1A2238, #070A12 70%)'}}>
      <SVG>
        <polygon points={`1150,420 1900,250 1900,760`} fill="#FFE9A8" opacity={0.22 * luz} />
        <g transform={`translate(760 600)`}>
          <circle r={300} fill="none" stroke="#1C1C20" strokeWidth={38} /><circle r={300} fill="none" stroke="#3A3A42" strokeWidth={8} />
          <g transform={`rotate(${ang})`}>{Array.from({length: 24}, (_, i) => <line key={i} x1={0} y1={0} x2={280 * Math.cos(i * Math.PI / 12)} y2={280 * Math.sin(i * Math.PI / 12)} stroke="#B8BCC6" strokeWidth={3} />)}</g>
          <circle r={34} fill="#8A8E98" />
        </g>
        <g transform="translate(1030 330)"><rect x={-26} y={-70} width={52} height={120} rx={14} fill="#C9CDD6" stroke="#8A8E98" strokeWidth={4} /><circle cx={0} cy={58} r={16} fill="#555" transform={`rotate(${ang * 3})`} /></g>
        <path d="M1030 260 Q1080 200 1140 380" fill="none" stroke="#333" strokeWidth={6} />
        <g transform="translate(1150 420)"><path d="M-70,-50 L0,-60 L0,60 L-70,50 Z" fill="#2A2C34" /><circle cx={4} cy={0} r={58} fill={`rgba(255,${200 + 40 * luz},${120 + 60 * luz},${0.3 + 0.7 * luz})`} /><circle cx={4} cy={0} r={90} fill="#FFE9A8" opacity={0.35 * luz} /></g>
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== escudo desviando o vento solar =====================
export const Escudo: React.FC<P> = ({lt, t}) => {
  const ex = 1250, ey = 540;
  return (
    <AbsoluteFill>
      <Espaco t={t} />
      <SVG>
        {[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d={`M${ex - 230 - k * 40},${ey - 520} Q${ex - 470 - k * 55},${ey} ${ex - 230 - k * 40},${ey + 520}`} fill="none" stroke="#7CC4FF" strokeWidth={3} opacity={0.35 - k * 0.04} />)}
        {Array.from({length: 60}, (_, i) => {
          const k = ((lt * 0.35 + rnd(i)) % 1); const y0 = 60 + rnd(i + 9) * 960; const dy = (y0 - ey); const x = -50 + k * 1700;
          const xb = ex - 300 - Math.max(0, 260 - Math.abs(dy) * 0.5);
          const desv = x > xb ? (x - xb) * 0.55 * Math.sign(dy || 1) : 0;
          return <circle key={i} cx={x} cy={y0 + desv} r={4} fill="#FFB547" opacity={0.85 * Math.sin(k * Math.PI)} />; })}
        <Globo cx={ex} cy={ey} r={150} lon={-50} lat={-10} />
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== aurora =====================
const Cortinas: React.FC<{t: number; y0?: number; cor1?: string; cor2?: string; forca?: number}> = ({t, y0 = 200, cor1 = '#5CF2A0', cor2 = '#C2408A', forca = 1}) => (
  <g style={{mixBlendMode: 'screen'}}>
    <defs>
      <linearGradient id="aur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={cor2} stopOpacity={0.0} /><stop offset="0.35" stopColor={cor2} stopOpacity={0.55 * forca} /><stop offset="0.75" stopColor={cor1} stopOpacity={0.75 * forca} /><stop offset="1" stopColor={cor1} stopOpacity={0} /></linearGradient>
      <filter id="aurb"><feGaussianBlur stdDeviation="14" /></filter>
    </defs>
    {Array.from({length: 3}, (_, k) => <path key={k} filter="url(#aurb)" fill="url(#aur)" opacity={0.85 - k * 0.2}
      d={(() => { const top = Array.from({length: 25}, (_, i) => [i * 80, y0 + k * 40 + 50 * Math.sin(i * 0.5 + t * 0.6 + k * 2)] as [number, number]); return suave(top) + ` L1920,${y0 + 420 + k * 40} L0,${y0 + 420 + k * 40} Z`; })()} />)}
  </g>
);
export const Aurora: React.FC<P> = ({t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #04060E 0%, #0A1428 60%, #0E1B2E 100%)'}}>
    <SVG>
      {Array.from({length: 180}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 7) * 700} r={1.1} fill="#fff" opacity={0.6} />)}
      <Cortinas t={t} />
      <path d={suave([[0, 860], [300, 800], [620, 840], [900, 770], [1240, 830], [1600, 790], [1920, 820]]) + ' L1920,1080 L0,1080 Z'} fill="#03050A" />
    </SVG>
  </AbsoluteFill>
);
export const AuroraEua: React.FC<P> = ({t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #04060E 0%, #0A1428 60%)'}}>
    <SVG>
      {Array.from({length: 160}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 7) * 600} r={1.1} fill="#fff" opacity={0.6} />)}
      <Cortinas t={t} y0={120} />
      <rect x={0} y={700} width={1920} height={380} fill="#0B0E0A" />
      {Array.from({length: 26}, (_, i) => <path key={i} d={`M${960},${700} L${-1200 + i * 170},1080`} stroke="#22301C" strokeWidth={6} />)}
      <g transform="translate(1320 690)"><rect x={-60} y={-90} width={120} height={90} fill="#1A1A18" /><polygon points="-75,-90 0,-140 75,-90" fill="#141412" /><rect x={-15} y={-60} width={30} height={30} fill="#E8B860" /></g>
    </SVG>
  </AbsoluteFill>
);

// ===================== arquivo (gaveta que abre) =====================
export const Arquivo: React.FC<P> = ({lt, t}) => {
  const ab = KS(lt, 0.1, 1.2);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #2A2420, #0A0807 75%)'}}>
      <SVG>
        <rect x={610} y={200} width={700} height={820} rx={10} fill="#4A3F33" stroke="#2C251E" strokeWidth={8} />
        {[0, 1, 2].map((k) => <rect key={k} x={640} y={240 + k * 260} width={640} height={230} rx={6} fill="#5C4E3F" stroke="#3A3028" strokeWidth={5} />)}
        <g transform={`translate(0 ${ab * 140})`}>
          <rect x={620} y={210 + 0} width={680} height={250} rx={6} fill="#6E5C49" stroke="#3A3028" strokeWidth={5} />
          {Array.from({length: 9}, (_, i) => { const up = KO(lt, 0.9 + i * 0.08, 1.3 + i * 0.08) * (i === 4 ? 140 : 30); return <rect key={i} x={660 + i * 66} y={150 - up} width={56} height={120} rx={4} fill={i === 4 ? '#F2E8D2' : '#DCCFB2'} stroke="#A89878" strokeWidth={2} />; })}
          <rect x={900} y={300} width={120} height={30} rx={8} fill="#C9A24E" />
        </g>
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== ficha de arquivo (papel + carimbo) =====================
export const Ficha: React.FC<P> = ({lt, t, arg}) => {
  const [ano, lugar, linha] = (arg || '||').split('|');
  const car = KO(lt, 0.55, 0.75); const anoN = (ano.match(/\d{4}/) || [''])[0];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #2A2622, #0A0908 75%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative', width: 1180, height: 700, background: 'linear-gradient(180deg,#F2E9D6,#E6DABF)', borderRadius: 10, boxShadow: '0 40px 90px rgba(0,0,0,0.7)', transform: `rotate(${lerp(-2.5, -1.2, KO(lt, 0, 0.5))}deg) translateY(${(1 - KO(lt, 0, 0.45)) * 60}px)`, opacity: KO(lt, 0, 0.3), overflow: 'hidden'}}>
        <div style={{height: 92, background: '#D6C7A4', display: 'flex', alignItems: 'center', padding: '0 50px', fontFamily: F.rotulo, fontWeight: 700, letterSpacing: 8, fontSize: 26, color: '#6A563A'}}>ARQUIVO · CLIMA ESPACIAL</div>
        {Array.from({length: 12}, (_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 150 + i * 46, height: 2, background: 'rgba(120,100,70,0.18)'}} />)}
        <div style={{position: 'absolute', left: 60, top: 140, fontFamily: F.titulo, fontWeight: 700, fontSize: 150, color: '#1E1B18', letterSpacing: 2}}>{ano}</div>
        <div style={{position: 'absolute', left: 64, top: 340, fontFamily: F.rotulo, fontWeight: 700, fontSize: 46, color: '#4A4036'}}>{lugar}</div>
        <div style={{position: 'absolute', left: 64, top: 420, width: 680, fontFamily: F.rotulo, fontWeight: 500, fontSize: 40, color: '#5A5046', lineHeight: 1.3}}>{linha}</div>
        <div style={{position: 'absolute', right: 70, bottom: 70, width: 250, height: 250, borderRadius: 125, border: '10px solid #B8322C', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(-14deg) scale(${lerp(1.8, 1, car)})`, opacity: car * 0.85}}>
          <span style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 70, color: '#B8322C'}}>{anoN}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===================== plantio visto de cima (GPS) =====================
export const Tratores: React.FC<P> = ({lt, d, t}) => {
  const k = lt / Math.max(d, 1); const deriva = KS(lt, d * 0.35, d);
  const tx = 600 + 20 + deriva * 70 * Math.sin(lt * 2.4); const ty = lerp(1150, -60, k);
  return (
    <AbsoluteFill style={{background: '#6B4F2E'}}>
      <SVG>
        {Array.from({length: 24}, (_, i) => <rect key={i} x={i * 84} y={0} width={36} height={1080} fill="#5A4024" />)}
        {Array.from({length: 7}, (_, i) => <path key={i} d={`M${120 + i * 84 * 1},1080 L${120 + i * 84},0`} stroke="#4F8A3A" strokeWidth={14} strokeDasharray="10 16" />)}
        <path d={suave(Array.from({length: 20}, (_, j) => { const yy = 1080 - j * 60; const kk = KS(1080 - yy, 400, 1080); return [600 + 20 + kk * 70 * Math.sin(j * 0.9), yy] as [number, number]; }).filter(([, yy]) => yy > ty))} fill="none" stroke="#4F8A3A" strokeWidth={14} strokeDasharray="10 16" />
        <g transform={`translate(${tx} ${ty}) rotate(${deriva * 14 * Math.cos(lt * 2.4)})`}>
          <rect x={-60} y={-90} width={120} height={180} rx={14} fill="#2E8B3E" stroke="#1E5C29" strokeWidth={5} />
          <rect x={-84} y={-80} width={26} height={70} rx={8} fill="#222" /><rect x={58} y={-80} width={26} height={70} rx={8} fill="#222" />
          <rect x={-90} y={30} width={32} height={80} rx={10} fill="#222" /><rect x={58} y={30} width={32} height={80} rx={10} fill="#222" />
          <rect x={-40} y={-30} width={80} height={60} rx={8} fill="#BFE3F2" opacity={0.8} />
          <circle cx={0} cy={-60} r={16} fill="#E8E8E8" />
          {[0, 1].map((q) => <circle key={q} cx={0} cy={-60} r={30 + q * 24 + ((lt * 40) % 24)} fill="none" stroke={deriva > 0.3 ? '#FF5A3C' : '#7CC4FF'} strokeWidth={4} opacity={0.6 - q * 0.25} />)}
        </g>
      </SVG>
    </AbsoluteFill>
  );
};
export const TratoresTorto: React.FC<P> = ({t}) => (
  <AbsoluteFill style={{background: '#6B4F2E'}}>
    <SVG>
      {Array.from({length: 22}, (_, i) => <path key={i} d={suave(Array.from({length: 12}, (_, j) => [80 + i * 84 + (i > 6 && i < 17 ? 60 * Math.sin(j * 0.8 + i) * KS(j, 3, 9) : 0), j * 100] as [number, number]))} fill="none" stroke="#4F8A3A" strokeWidth={16} strokeDasharray="12 16" />)}
    </SVG>
  </AbsoluteFill>
);

export const Dolar: React.FC<P> = ({lt}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #1E2A1E, #070A07 75%)'}}>
    <SVG>
      {Array.from({length: 26}, (_, i) => { const k = KO(lt, i * 0.06, i * 0.06 + 0.4); return <g key={i} transform={`translate(${960 + (rnd(i) - 0.5) * 30} ${880 - i * 24 - (1 - k) * 300})`} opacity={k}>
        <rect x={-300} y={-40} width={600} height={70} rx={6} fill="#5E8A5A" stroke="#2F4A2C" strokeWidth={3} /><ellipse cx={0} cy={-5} rx={44} ry={26} fill="#3E6A3A" /><text x={-250} y={10} fontFamily="Oswald" fontWeight={700} fontSize={36} fill="#2F4A2C">$</text><text x={230} y={10} fontFamily="Oswald" fontWeight={700} fontSize={36} fill="#2F4A2C">$</text></g>; })}
    </SVG>
  </AbsoluteFill>
);

// ===================== plantadeira guiada por satélite =====================
export const Plantadeira: React.FC<P> = ({lt, d, t}) => {
  const x = lerp(-200, 2100, lt / Math.max(d, 1) * 0.55 + 0.15);
  const err = rnd(Math.floor(t * 6)) > 0.7;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #7FB6E0 0%, #CDE6F2 45%, #8C6A40 46%, #6B4F2E 100%)'}}>
      <SVG>
        {Array.from({length: 14}, (_, i) => <path key={i} d={`M${-400 + i * 200},1080 L${700 + i * 50},500`} stroke="#5A3F22" strokeWidth={10} />)}
        <g transform={`translate(${x} 640)`}>
          <rect x={-520} y={60} width={420} height={50} fill="#C9A24E" />{Array.from({length: 9}, (_, i) => <rect key={i} x={-510 + i * 46} y={110} width={14} height={40} fill="#333" />)}
          <line x1={-100} y1={85} x2={0} y2={85} stroke="#333" strokeWidth={8} />
          <rect x={0} y={-60} width={260} height={150} rx={18} fill="#2E8B3E" /><rect x={150} y={-160} width={110} height={110} rx={10} fill="#BFE3F2" stroke="#1E5C29" strokeWidth={6} />
          <circle cx={40} cy={110} r={70} fill="#1C1C1C" /><circle cx={220} cy={120} r={50} fill="#1C1C1C" />
          <rect x={185} y={-200} width={40} height={40} rx={6} fill="#EEE" />
          {[0, 1, 2].map((q) => <circle key={q} cx={205} cy={-180} r={30 + q * 26} fill="none" stroke={err ? '#FF5A3C' : '#7CC4FF'} strokeWidth={4} opacity={0.6 - q * 0.18} />)}
        </g>
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== relógio de parede 2h44 =====================
export const RelogioParede: React.FC<P> = ({lt, t}) => {
  const seg = (44 * 60 + 2 * 3600 + lt) ; const sAng = (seg % 60) * 6, mAng = ((seg / 60) % 60) * 6, hAng = ((seg / 3600) % 12) * 30;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #1E2433, #06080D 75%)'}}>
      <SVG>
        <circle cx={960} cy={540} r={330} fill="#EDE6D6" stroke="#2A2A2A" strokeWidth={22} />
        {Array.from({length: 60}, (_, i) => <line key={i} x1={960 + 290 * Math.sin(i * Math.PI / 30)} y1={540 - 290 * Math.cos(i * Math.PI / 30)} x2={960 + (i % 5 ? 305 : 270) * Math.sin(i * Math.PI / 30)} y2={540 - (i % 5 ? 305 : 270) * Math.cos(i * Math.PI / 30)} stroke="#222" strokeWidth={i % 5 ? 3 : 9} />)}
        <line x1={960} y1={540} x2={960 + 170 * Math.sin(hAng * Math.PI / 180)} y2={540 - 170 * Math.cos(hAng * Math.PI / 180)} stroke="#111" strokeWidth={18} strokeLinecap="round" />
        <line x1={960} y1={540} x2={960 + 250 * Math.sin(mAng * Math.PI / 180)} y2={540 - 250 * Math.cos(mAng * Math.PI / 180)} stroke="#111" strokeWidth={11} strokeLinecap="round" />
        <line x1={960} y1={540} x2={960 + 270 * Math.sin(sAng * Math.PI / 180)} y2={540 - 270 * Math.cos(sAng * Math.PI / 180)} stroke="#C0392B" strokeWidth={4} />
        <circle cx={960} cy={540} r={16} fill="#111" />
      </SVG>
      <Label x={960} y={960} txt="2H44 DA MANHÃ" cor="#C9CDD8" op={KO(lt, 0.3, 0.7)} size={30} />
    </AbsoluteFill>
  );
};

// ===================== Quebec apagando =====================
const LUZES_QC = Array.from({length: 260}, (_, i) => ({lon: -79 + rnd(i) * 14 + (rnd(i + 3) > 0.6 ? 6 : 0), lat: 45 + rnd(i + 1) * 4.5 * (rnd(i + 5) > 0.7 ? 1.6 : 1), q: rnd(i + 9)}));
export const Quebec: React.FC<P> = ({lt, d, t}) => {
  const apaga = (q: number) => 1 - KS(lt, 0.6 + q * 1.2, 0.75 + q * 1.2);
  return (
    <MapaAS lt={lt} d={d} lonC={-72} latC={47} s0={60} s1={60} escuro={0.72}
      children={(P) => <g>{LUZES_QC.map((l, i) => { const [x, y] = P(l.lon, l.lat); const a = apaga(l.q); return <g key={i}><circle cx={x} cy={y} r={9} fill="#FFC060" opacity={0.18 * a} /><circle cx={x} cy={y} r={3} fill="#FFE2A0" opacity={0.9 * a} /></g>; })}</g>}
      html={(P) => <Rotulo x={P(-71.2, 46.8)[0]} y={P(-71.2, 46.8)[1] - 120} txt="QUEBEC" cor={COR.calmo} op={KO(lt, 0.2, 0.5)} size={32} />} />
  );
};
export const Neve: React.FC<P> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #0A1022 0%, #141E36 70%)'}}>
    <SVG>
      <rect x={0} y={760} width={1920} height={320} fill="#C9D2E2" />
      {[[120, 1.0], [520, 1.2], [960, 0.9], [1380, 1.15], [1760, 0.95]].map(([x, s], i) => <g key={i} transform={`translate(${x} 760) scale(${s})`}>
        <rect x={-150} y={-230} width={300} height={230} fill="#2A2F3E" /><polygon points="-180,-230 0,-360 180,-230" fill="#DDE4EE" />
        <rect x={-90} y={-170} width={60} height={60} fill="#151924" /><rect x={30} y={-170} width={60} height={60} fill="#151924" /><rect x={-25} y={-90} width={50} height={90} fill="#151924" /></g>)}
      {Array.from({length: 220}, (_, i) => { const y = ((rnd(i) * 1080 + t * (40 + rnd(i + 2) * 60)) % 1080); return <circle key={i} cx={(rnd(i + 5) * 1920 + Math.sin(t + i) * 20)} cy={y} r={1.5 + rnd(i + 8) * 2.5} fill="#fff" opacity={0.8} />; })}
    </SVG>
  </AbsoluteFill>
);

// ===================== órbita: a nuvem passa onde a Terra estava =====================
export const Orbita: React.FC<P> = ({lt, d, t, arg}) => {
  const fase = Number(arg ?? 0); const cx = 960, cy = 560, rx = 640, ry = 360;
  const ang = -0.35 - (fase ? 0.42 + lt * 0.03 : lt * 0.03);
  const ex = cx + rx * Math.cos(ang), ey = cy + ry * Math.sin(ang);
  const angPass = -0.35 - 0.0; const px = cx + rx * Math.cos(angPass), py = cy + ry * Math.sin(angPass);
  const k = fase ? 1 : KS(lt, 0.3, Math.min(d, 4));
  return (
    <AbsoluteFill>
      <Espaco t={t} />
      <SVG>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#7CC4FF" strokeOpacity={0.35} strokeWidth={3} strokeDasharray="6 10" />
        <SolG x={cx} y={cy} r={95} t={t} furia={0.5} id="ob" />
        <path d={`M${cx + 100},${cy - 30} L${lerp(cx + 100, px + 160, k)},${lerp(cy - 30, py - 40, k)}`} stroke={COR.plasma} strokeWidth={60} strokeLinecap="round" opacity={0.35} />
        <path d={`M${cx + 100},${cy - 30} L${lerp(cx + 100, px + 160, k)},${lerp(cy - 30, py - 40, k)}`} stroke={COR.plasma} strokeWidth={18} strokeLinecap="round" />
        {fase ? <circle cx={px} cy={py} r={36} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="6 8" opacity={0.7} /> : null}
        <Globo cx={ex} cy={ey} r={34} lon={-50} lat={-10} />
      </SVG>
      {fase ? <Rotulo x={px} y={py - 70} txt="A TERRA, 1 SEMANA ANTES" cor="#fff" op={KO(lt, 0.4, 0.8)} size={24} /> : null}
    </AbsoluteFill>
  );
};
export const JornalNasa: React.FC<P> = ({lt}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #1E2433, #06080D 75%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{width: 1100, height: 640, background: '#F4F6FA', borderRadius: 12, boxShadow: '0 40px 90px rgba(0,0,0,0.7)', padding: 60, opacity: KO(lt, 0, 0.3), transform: `translateY(${(1 - KO(lt, 0, 0.4)) * 40}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24}}><div style={{width: 90, height: 90, borderRadius: 45, background: '#0B3D91'}} /><div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 44, color: '#0B3D91', letterSpacing: 3}}>NASA · JULHO DE 2014</div></div>
      {Array.from({length: 8}, (_, i) => <div key={i} style={{height: 22, width: `${92 - (i % 3) * 14}%`, background: '#D5DAE3', borderRadius: 6, marginTop: i ? 26 : 60}} />)}
    </div>
  </AbsoluteFill>
);

// ===================== Carrington =====================
export const Observatorio: React.FC<P> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 60% 40%, #3A2E22, #0C0907 75%)'}}>
    <SVG>
      <rect x={0} y={860} width={1920} height={220} fill="#2A2018" />
      <g transform="translate(980 520) rotate(-28)"><rect x={-40} y={-30} width={620} height={70} rx={10} fill="#8A6A3A" stroke="#5A4426" strokeWidth={5} /><rect x={-80} y={-40} width={60} height={90} rx={8} fill="#5A4426" /></g>
      <line x1={1000} y1={560} x2={900} y2={860} stroke="#3A2C1E" strokeWidth={14} /><line x1={1000} y1={560} x2={1120} y2={860} stroke="#3A2C1E" strokeWidth={14} />
      <rect x={560} y={600} width={340} height={260} fill="#E8DCC0" stroke="#9A8A6A" strokeWidth={4} />
      <circle cx={730} cy={720} r={95} fill="#F4E6B8" stroke="#C8A86A" strokeWidth={3} />
      {[[700, 700, 10], [740, 735, 7], [760, 700, 6]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#5A4426" />)}
      <g transform="translate(470 860) scale(1.2)"><Pessoa v={BLAGDEN} t={t} expr="neutro" bD={[60, 40]} bE={[20, 10]} /></g>
    </SVG>
  </AbsoluteFill>
);
export const Carrington: React.FC<P & {flash?: boolean}> = ({lt, t, flash}) => {
  const f = flash ? KO(lt, 0.4, 0.9) : 0;
  return (
    <AbsoluteFill style={{background: '#E9DFC6'}}>
      <SVG>
        {Array.from({length: 30}, (_, i) => <line key={i} x1={0} x2={1920} y1={i * 38} y2={i * 38} stroke="#C9B998" strokeOpacity={0.25} />)}
        <circle cx={960} cy={540} r={420} fill="none" stroke="#4A3C2C" strokeWidth={5} />
        {[[880, 470, 46], [960, 500, 30], [1010, 455, 22], [930, 540, 16], [1040, 520, 14]].map(([x, y, r], i) => <g key={i}><circle cx={x} cy={y} r={r * 1.5} fill="#8A7A60" opacity={0.35} /><circle cx={x} cy={y} r={r} fill="#3A2E22" /></g>)}
        {flash && [[905, 448], [1000, 528]].map(([x, y], i) => <g key={i} opacity={f}><circle cx={x} cy={y} r={60 * f} fill="#FFFFFF" opacity={0.45} /><ellipse cx={x} cy={y} rx={26} ry={16} fill="#FFFFFF" stroke="#FFD27A" strokeWidth={5} /></g>)}
        <path d="M600 980 Q 800 950 1000 985 T 1400 970" fill="none" stroke="#4A3C2C" strokeWidth={3} />
      </SVG>
    </AbsoluteFill>
  );
};
export const CarringtonFlash: React.FC<P> = (p) => <Carrington {...p} flash />;

// ===================== fita de telégrafo pegando fogo =====================
export const Papel: React.FC<P> = ({lt, t}) => {
  const fogo = KS(lt, 0.8, 1.6);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #2A2018, #0B0806 75%)'}}>
      <SVG>
        <rect x={0} y={500} width={1920} height={110} fill="#EDE2C6" />
        {Array.from({length: 40}, (_, i) => { const x = ((i * 90 - lt * 160) % 3600 + 3600) % 3600 - 200; return <rect key={i} x={x} y={548} width={rnd(i) > 0.5 ? 60 : 18} height={14} rx={7} fill="#2A2420" />; })}
        <rect x={760} y={420} width={400} height={80} rx={10} fill="#5A4426" /><rect x={900} y={360} width={120} height={70} rx={8} fill="#8A6A3A" />
        <g opacity={fogo}>
          {Array.from({length: 7}, (_, k) => <path key={k} d={`M${880 + k * 26},610 Q${860 + k * 30 + 30 * Math.sin(t * 9 + k)},${520 - 90 * (0.6 + 0.4 * Math.sin(t * 7 + k * 2))} ${900 + k * 26},${430 - 60 * Math.sin(t * 5 + k)}`} fill="none" stroke={k % 2 ? '#FFB547' : '#FF6A2A'} strokeWidth={34 - k * 3} strokeLinecap="round" opacity={0.8} />)}
          <circle cx={950} cy={540} r={160} fill="#FF8A2A" opacity={0.18} />
        </g>
      </SVG>
    </AbsoluteFill>
  );
};
export const Telegrafistas: React.FC<P> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #0C1226, #1A1428)'}}>
    <SVG>
      <Cortinas t={t} y0={20} forca={0.7} />
      <rect x={0} y={760} width={1920} height={320} fill="#0A0C12" />
      {[[400, 'BOSTON'], [1520, 'PORTLAND']].map(([x, n], i) => <g key={i} transform={`translate(${x} 760)`}><rect x={-170} y={-220} width={340} height={220} fill="#3A2C1E" /><polygon points="-200,-220 0,-320 200,-220" fill="#2A2018" /><rect x={-60} y={-160} width={120} height={90} fill="#F2C46A" /></g>)}
      <path d="M570 600 Q960 680 1350 600" fill="none" stroke="#B89A5A" strokeWidth={5} />
      {Array.from({length: 6}, (_, i) => { const k = ((lt * 0.5 + i / 6) % 1); const x = lerp(570, 1350, k); const y = 600 + 80 * 4 * k * (1 - k) * 0.25 + 0; return <circle key={i} cx={x} cy={600 + 320 * k * (1 - k) * 0.25} r={9} fill="#9FD8FF" />; })}
      <g transform="translate(400 480)" opacity={0.95}><rect x={-60} y={-40} width={120} height={80} rx={10} fill="#2A2A2A" stroke="#888" strokeWidth={4} /><text x={0} y={14} textAnchor="middle" fontFamily="Inter" fontWeight={700} fontSize={36} fill="#FF5A3C">OFF</text></g>
    </SVG>
    <Label x={400} y={1000} txt="BOSTON" cor={COR.ouro} size={28} op={KO(lt, 0.2, 0.5)} />
    <Label x={1520} y={1000} txt="PORTLAND" cor={COR.ouro} size={28} op={KO(lt, 0.4, 0.7)} />
  </AbsoluteFill>
);

// ===================== aurora de 1859 nas Américas =====================
export const Americas: React.FC<P> = ({lt, d, t}) => {
  const lon = lerp(-72, -70, lt / Math.max(d, 1));
  const L: [string, number, number][] = [['CARIBE', -75, 19], ['COLÔMBIA', -74, 5], ['SANTIAGO', -70.6, -33.4]];
  return (
    <AbsoluteFill>
      <Espaco t={t} />
      <SVG>
        <defs><radialGradient id="aurAm"><stop offset="0" stopColor="#5CF2A0" stopOpacity="0.5" /><stop offset="1" stopColor="#5CF2A0" stopOpacity="0" /></radialGradient></defs>
        <Globo cx={960} cy={560} r={500} lon={lon} lat={-6} brasilCor="#5E9A4E">{(Pj) => <g>{L.map(([, lo, la], i) => { const p = Pj(lo, la); return p ? <g key={i} opacity={KO(lt, 0.3 + i * 0.7, 0.7 + i * 0.7)}><circle cx={p[0]} cy={p[1]} r={120} fill="url(#aurAm)" /><Pulso p={p} t={t + i * 0.3} cor="#5CF2A0" r={9} /></g> : null; })}</g>}</Globo>
      </SVG>
      {L.map(([n, lo, la], i) => { const pr = (geoP(lon) as any)([lo, la]); return pr ? <Rotulo key={i} x={pr[0]} y={pr[1]} txt={n} cor="#5CF2A0" op={KO(lt, 0.5 + i * 0.7, 0.9 + i * 0.7)} size={28} /> : null; })}
    </AbsoluteFill>
  );
};
const geoP = (lon: number) => geoOrthographic().rotate([-lon, 6]).scale(500).translate([960, 560]).clipAngle(90);

// ===================== Rio de Janeiro, 1875 =====================
const RioSkyline: React.FC<{t: number; obs?: boolean}> = ({t, obs}) => (
  <g fill="#05060C">
    {/* Corcovado (sem o Cristo: em 1875 ele ainda não existia) */}
    <path d="M120,900 C260,860 360,700 440,520 C470,455 500,430 520,430 C545,430 565,470 590,540 C640,690 760,820 900,900 Z" />
    {/* Morro da Urca e Pão de Açúcar */}
    <path d="M1180,900 C1200,820 1250,760 1330,750 C1410,745 1450,800 1470,900 Z" />
    <path d="M1420,900 C1430,760 1470,560 1560,520 C1640,490 1700,560 1720,700 C1730,780 1735,850 1740,900 Z" />
    <path d="M1330,760 L1560,540" stroke="#05060C" strokeWidth={2} fill="none" />
    <path d="M0,900 C200,880 400,885 600,890 C900,895 1200,880 1920,895 L1920,1080 L0,1080 Z" />
    <rect x={0} y={905} width={1920} height={175} fill="#08101E" />
    {Array.from({length: 40}, (_, i) => <rect key={i} x={rnd(i) * 1900} y={912 + rnd(i + 2) * 40} width={30} height={3} fill="#E8B860" opacity={0.25 * (0.5 + 0.5 * Math.sin(t * 2 + i))} />)}
    {obs && <g transform="translate(1000 892)"><path d="M-160,8 C-120,-50 -60,-80 0,-82 C60,-80 120,-50 160,8 Z" /><rect x={-60} y={-130} width={120} height={50} /><path d="M-40,-130 A40,40 0 0 1 40,-130 Z" /><rect x={-10} y={-115} width={20} height={18} fill="#F2C46A" opacity={0.8} /></g>}
  </g>
);
export const Rio: React.FC<P> = ({lt, t}) => {
  const g = 0.55 + 0.25 * Math.sin(lt * 1.1);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #0A0814 0%, rgba(150,30,50,${g}) 45%, #160A14 70%)`}}>
      <SVG>
        {Array.from({length: 140}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 2) * 500} r={1.1} fill="#fff" opacity={0.5} />)}
        <RioSkyline t={t} />
      </SVG>
    </AbsoluteFill>
  );
};
export const ObservatorioImperial: React.FC<P> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #0A0814 0%, rgba(150,30,50,0.6) 45%, #160A14 70%)'}}>
    <SVG><RioSkyline t={t} obs /></SVG>
    <Rotulo x={1000} y={700} txt="OBSERVATÓRIO IMPERIAL" cor={COR.ouro} op={KO(lt, 0.3, 0.7)} size={28} lado={1} />
  </AbsoluteFill>
);
export const Caderno: React.FC<P> = ({lt}) => {
  const k = KS(lt, 0.3, 1.8);
  return (
    <AbsoluteFill style={{background: '#EAE0C6'}}>
      <SVG>
        {Array.from({length: 22}, (_, i) => <line key={i} x1={0} x2={1920} y1={120 + i * 48} y2={120 + i * 48} stroke="#B9C7DA" strokeOpacity={0.6} />)}
        <line x1={240} x2={240} y1={0} y2={1080} stroke="#D98A8A" strokeOpacity={0.6} strokeWidth={3} />
        <text x={300} y={350} fontFamily="Inter" fontStyle="italic" fontSize={46} fill="#2A3560" opacity={0.8}>Rio de Janeiro, 15 de fevereiro de 1875 — 19h45</text>
        <clipPath id="esc"><rect x={290} y={400} width={1300 * k} height={300} /></clipPath>
        <text x={300} y={600} fontFamily="Inter" fontStyle="italic" fontWeight={700} fontSize={170} fill="#8A1E28" clipPath="url(#esc)">aurora</text>
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== 774: árvores e o anel =====================
export const Floresta: React.FC<P> = ({t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #A9C6D8 0%, #D9E2D0 50%, #2E3A22 51%)'}}>
    <SVG>
      {Array.from({length: 14}, (_, i) => { const x = 60 + i * 140 + rnd(i) * 40; const s = 0.8 + rnd(i + 4) * 0.6; return <g key={i} transform={`translate(${x} 560) scale(${s})`}>
        <rect x={-26} y={-60} width={52} height={600} fill="#4A3424" /><ellipse cx={0} cy={-170} rx={140} ry={200} fill={`hsl(${110 + rnd(i) * 30},35%,${22 + rnd(i + 1) * 10}%)`} /><ellipse cx={-60} cy={-90} rx={90} ry={110} fill={`hsl(${110 + rnd(i + 2) * 30},35%,${18 + rnd(i + 3) * 10}%)`} /></g>; })}
    </SVG>
  </AbsoluteFill>
);
export const Anel: React.FC<P> = ({lt, t}) => {
  const pul = 0.75 + 0.25 * Math.sin(t * 3);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #3A2618, #120B06 75%)'}}>
      <SVG>
        <ellipse cx={960} cy={540} rx={520} ry={470} fill="#C89A66" stroke="#5A3A20" strokeWidth={28} />
        {Array.from({length: 46}, (_, i) => { const r = 470 - i * 10; const hot = i === 19; return <ellipse key={i} cx={960 + Math.sin(i) * 3} cy={540 + Math.cos(i) * 3} rx={r * 1.1} ry={r} fill="none" stroke={hot ? '#FF7A2F' : i % 2 ? '#A87A48' : '#B88A56'} strokeWidth={hot ? 9 : 3} opacity={hot ? pul : 0.9} />; })}
        <ellipse cx={960} cy={540} rx={30} ry={26} fill="#6A4626" />
        <ellipse cx={960} cy={540} rx={(470 - 190) * 1.1} ry={470 - 190} fill="none" stroke="#FF7A2F" strokeWidth={30} opacity={0.18 * pul} />
      </SVG>
    </AbsoluteFill>
  );
};
export const Escala774: React.FC<P> = ({lt, t}) => {
  const k = KS(lt, 0.3, 2.2);
  return (
    <AbsoluteFill>
      <Espaco t={t} cor="#200A06" />
      <SVG>
        <defs><radialGradient id="e74"><stop offset="0" stopColor="#FFE08A" /><stop offset="0.6" stopColor="#FF7A2F" /><stop offset="1" stopColor="#B22A10" stopOpacity="0.2" /></radialGradient></defs>
        <circle cx={420} cy={700} r={70} fill="url(#e74)" />
        <circle cx={1220} cy={560} r={lerp(70, 430, k)} fill="url(#e74)" opacity={0.95} />
      </SVG>
      <Label x={420} y={830} txt="1859" cor="#FFD27A" size={34} />
      <Label x={1220} y={560} txt="774" cor="#fff" size={90} op={KO(lt, 1.2, 1.6)} />
    </AbsoluteFill>
  );
};
