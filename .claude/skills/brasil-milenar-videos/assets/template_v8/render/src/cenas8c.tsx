/* Vídeo 8 — cenas do ato 3 (expedição, México, airburst), régua de energia, ato 4 (Santa Filomena, BRAMON, SONEAR, Bendegó) e fecho. */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {lerp, clamp01, prog, K, KO, KS, rnd} from './base';
import {F} from './theme';
import {SVG, COR, MapaAS, Rotulo, Pulso, Traco, Espaco, Globo} from './comum7';
import {BolaFogo, P} from './cenas8a';

const Legenda: React.FC<{txt: string; cor?: string}> = ({txt, cor = '#C3CAD8'}) => (
  <div style={{position: 'absolute', left: 60, bottom: 50, fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: cor, textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>{txt}</div>
);
const Mata: React.FC<{seed: number; y0?: number; cor1?: string; cor2?: string}> = ({seed, y0 = 0, cor1 = '#1E4A26', cor2 = '#2E6A34'}) => (
  <g>
    <rect y={y0} width={1920} height={1080 - y0} fill={cor1} />
    {Array.from({length: 520}, (_, i) => <circle key={i} cx={rnd(seed + i) * 1960 - 20} cy={y0 + rnd(seed + i * 3) * (1100 - y0)} r={18 + rnd(seed + i * 7) * 34} fill={i % 3 ? cor2 : '#245A2C'} opacity={0.9} />)}
  </g>
);

// ---------- EXPEDIÇÃO 1997 ----------
export const Expedicao: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  if (arg === 'circulo') return (
    <AbsoluteFill style={{background: '#163A1E', overflow: 'hidden'}}>
      <SVG>
        <Mata seed={300} />
        <circle cx={960} cy={560} r={330} fill="#3E6A34" opacity={0.55} />
        <circle cx={960} cy={560} r={330} fill="none" stroke={COR.ouro} strokeWidth={5} strokeDasharray="20 14" opacity={0.8} />
        {[0, 1, 2, 3].map((i) => { const a = i * 1.6 + lt * 0.3; return <g key={i} transform={`translate(${960 + Math.cos(a) * 140},${560 + Math.sin(a) * 90})`}><circle r={16} fill="#E0A040" /><circle cy={-4} r={9} fill="#8C5B3E" /></g>; })}
      </SVG>
      <div style={{position: 'absolute', right: 120, top: 330, display: 'flex', flexDirection: 'column', gap: 18}}>
        {['NENHUM FRAGMENTO', 'NENHUM VIDRO DERRETIDO', 'NENHUMA ROCHA DE CHOQUE'].map((s, i) => <div key={s} style={{opacity: K(lt, 0.4 + i * 0.5, 0.7 + i * 0.5), fontFamily: F.titulo, fontWeight: 700, fontSize: 40, color: '#fff', background: 'rgba(6,10,20,0.85)', padding: '8px 22px', borderLeft: `5px solid ${COR.perigo}`, borderRadius: 8}}>✕ {s}</div>)}
      </div>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{background: '#0E2A16', overflow: 'hidden'}}>
      <SVG>
        <rect width={1920} height={1080} fill="#2E5A2E" />
        {Array.from({length: 30}, (_, i) => { const x = rnd(i) * 1920; return <rect key={i} x={x} y={0} width={16 + rnd(i + 1) * 22} height={1080} fill="#1E3A1E" opacity={0.9} />; })}
        {Array.from({length: 60}, (_, i) => <path key={'f' + i} d={`M${rnd(i + 40) * 1920},${1080} q${(rnd(i) - 0.5) * 200},-200 ${(rnd(i + 1) - 0.5) * 300},-${300 + rnd(i + 2) * 300}`} stroke="#3E7A3A" strokeWidth={14} fill="none" opacity={0.7} />)}
        {[0, 1, 2].map((i) => { const x = lerp(-100 - i * 180, 1500 - i * 180, lt / (d + 2)); const ph = t * 6 + i; return <g key={i} transform={`translate(${x},${960}) scale(2.2)`}>
          <line x1={-8} y1={-70} x2={-8 + Math.sin(ph) * 22} y2={0} stroke="#3A3A2A" strokeWidth={14} strokeLinecap="round" />
          <line x1={8} y1={-70} x2={8 - Math.sin(ph) * 22} y2={0} stroke="#3A3A2A" strokeWidth={14} strokeLinecap="round" />
          <rect x={-24} y={-150} width={48} height={84} rx={10} fill={['#C8A060', '#6A8A5A', '#B05A3A'][i]} />
          <rect x={-40} y={-148} width={22} height={62} rx={6} fill="#5A4A30" />
          <circle cy={-172} r={18} fill={['#E0B48C', '#8C5B3E', '#C69A72'][i]} />
          <ellipse cy={-186} rx={26} ry={7} fill="#D9C08A" />
        </g>; })}
      </SVG>
      <Legenda txt="EXPEDIÇÃO · JUNHO DE 1997" cor="#E8E0C8" />
    </AbsoluteFill>
  );
};

// ---------- MÉXICO (UNAM, 2011): tremor x terremoto comum ----------
export const Mexico: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  const linha = (y0: number, seed: number, forma: 'evento' | 'sismo') => {
    const a: string[] = [];
    for (let x = 160; x <= 1760; x += 5) {
      const u = (x - 160) / 1600; const env = forma === 'sismo' ? (u > 0.3 ? Math.exp(-(u - 0.3) * 5) : 0) + (u > 0.42 ? 0.7 * Math.exp(-(u - 0.42) * 4) : 0) : (u > 0.3 ? Math.exp(-(u - 0.3) * 5) : 0) + (u > 0.42 ? 0.7 * Math.exp(-(u - 0.42) * 4) : 0);
      const k = clamp01((lt * 0.6 + 0.2) - u + 0.6);
      a.push(`${x},${y0 + Math.sin(x * 0.3 + seed) * 70 * env * (0.6 + rnd(Math.floor(x / 5) + seed) * 0.6) * k + (rnd(x + seed) - 0.5) * 4}`);
    }
    return 'M' + a.join(' L');
  };
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, #14213A, #060A14 75%)'}}>
      <SVG>
        <path d={linha(360, 1, 'evento')} fill="none" stroke={COR.ouro} strokeWidth={3} />
        <path d={linha(720, 4, 'sismo')} fill="none" stroke={COR.calmo} strokeWidth={3} opacity={arg === '2' ? 1 : 0.35} />
      </SVG>
      <div style={{position: 'absolute', left: 160, top: 230, fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: COR.ouro}}>LA PAZ · 13/08/1930</div>
      <div style={{position: 'absolute', left: 160, top: 590, fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: COR.calmo, opacity: arg === '2' ? 1 : 0.4}}>UM TERREMOTO COMUM DA REGIÃO</div>
      {arg === '2' && <div style={{position: 'absolute', right: 160, top: 500, fontFamily: F.titulo, fontWeight: 700, fontSize: 90, color: '#fff', opacity: K(lt, 0.8, 1.3), textShadow: '0 0 30px rgba(124,196,255,0.6)'}}>≈</div>}
      <Legenda txt="CORDERO E POVEDA · UNAM, MÉXICO · 2011" />
    </AbsoluteFill>
  );
};

// ---------- TAMANHO DA PEDRA ----------
export const TamanhoPedra: React.FC<P> = ({lt, d}) => {
  const k = KO(lt, 0.3, 1.2);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#1A2A44,#0A1222)'}}>
      <SVG>
        <rect y={860} width={1920} height={220} fill="#1E2A22" />
        {/* régua de 9 m */}
        <g transform="translate(560,860)">
          <line x1={-120} y1={0} x2={-120} y2={-540} stroke="#C3CAD8" strokeWidth={3} />
          {Array.from({length: 10}, (_, i) => <g key={i}><line x1={-136} y1={-i * 60} x2={-104} y2={-i * 60} stroke="#C3CAD8" strokeWidth={3} /><text x={-150} y={-i * 60 + 8} textAnchor="end" fontFamily={F.rotulo} fontWeight={700} fontSize={22} fill="#C3CAD8">{i} m</text></g>)}
          <path d={`M0,0 L-20,-${180 * k} L60,-${470 * k} L260,-${530 * k} L460,-${420 * k} L500,-${140 * k} L420,0 Z`} fill="#3A2E26" stroke="#6A5A4A" strokeWidth={4} />
        </g>
        {/* ônibus para comparação */}
        <g transform="translate(1340,860)" opacity={K(lt, 0.8, 1.3)}>
          <rect x={0} y={-200} width={360} height={180} rx={16} fill="#E0A040" />
          {Array.from({length: 5}, (_, i) => <rect key={i} x={20 + i * 66} y={-180} width={52} height={60} rx={6} fill="#2A3A4A" />)}
          <circle cx={70} cy={-14} r={30} fill="#1A1A1A" /><circle cx={290} cy={-14} r={30} fill="#1A1A1A" />
          <text x={180} y={-230} textAnchor="middle" fontFamily={F.rotulo} fontWeight={700} fontSize={24} letterSpacing={3} fill="#C3CAD8">ÔNIBUS ≈ 12 M</text>
        </g>
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- AIRBURST: por que não fica buraco ----------
export const Airburst: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  const k = KS(lt, 0, d * 0.7); const hx = lerp(1600, 900, k), hy = lerp(60, 380, k);
  const boom = arg === '1' ? Math.max(0, 1 - Math.abs(lt - d * 0.72) / 0.5) : 0;
  const explodiu = arg === '1' && lt > d * 0.72;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <SVG>
        <defs><linearGradient id="ceAb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0B1428" /><stop offset="0.6" stopColor="#2A4A7A" /><stop offset="1" stopColor="#8FB0CF" /></linearGradient></defs>
        <rect width={1920} height={1080} fill="url(#ceAb)" />
        {[200, 400, 600].map((y, i) => <line key={i} x1={0} y1={y} x2={1920} y2={y} stroke="#fff" strokeOpacity={0.08} strokeDasharray="8 10" />)}
        <text x={60} y={190} fontFamily={F.rotulo} fontWeight={700} fontSize={20} letterSpacing={4} fill="#C3CAD8" opacity={0.6}>ATMOSFERA</text>
        {!explodiu && <BolaFogo id="ab" hx={hx} hy={hy} ang={155} L={arg === '1' ? 520 : 360} r={arg === '1' ? 16 : 12} />}
        {arg === '1' && !explodiu && <ellipse cx={hx - 30} cy={hy + 12} rx={50} ry={22} fill="#fff" opacity={0.5 * k} />}
        <defs><radialGradient id="bga"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.25" stopColor="#FFE8B0" /><stop offset="0.6" stopColor="#FF9A3A" stopOpacity="0.6" /><stop offset="1" stopColor="#FF6A1A" stopOpacity="0" /></radialGradient></defs>{boom > 0 && <circle cx={900} cy={380} r={140 + boom * 420} fill="url(#bga)" opacity={boom} />}
        {explodiu && [0, 1, 2].map((i) => { const r = (lt - d * 0.72 - i * 0.15) * 600; return r > 0 && <circle key={i} cx={900} cy={380} r={r} fill="none" stroke="#FFD08A" strokeWidth={4} opacity={Math.max(0, 0.7 - r / 1400)} />; })}
        <rect y={880} width={1920} height={200} fill="#1E4A26" />
        {Array.from({length: 60}, (_, i) => <circle key={i} cx={i * 34} cy={880 - rnd(i) * 30} r={26 + rnd(i + 1) * 18} fill="#245A2C" />)}
        {arg === '0' && <text x={960} y={980} textAnchor="middle" fontFamily={F.titulo} fontWeight={700} fontSize={64} fill="#fff" opacity={K(lt, d * 0.5, d * 0.8)}>CADÊ O BURACO?</text>}
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- FLORESTA CRESCENDO POR CIMA ----------
export const Floresta: React.FC<P> = ({lt, d}) => {
  const k = KS(lt, 0, d);
  return (
    <AbsoluteFill style={{background: '#163A1E', overflow: 'hidden'}}>
      <SVG>
        <rect width={1920} height={1080} fill="#5A4A34" />
        {Array.from({length: 120}, (_, i) => { const a = rnd(i) * Math.PI * 2; const r = 80 + rnd(i + 1) * 500; return <line key={i} x1={960 + Math.cos(a) * r} y1={540 + Math.sin(a) * r * 0.6} x2={960 + Math.cos(a) * (r + 40)} y2={540 + Math.sin(a) * (r + 40) * 0.6} stroke="#3A2E20" strokeWidth={6} />; })}
        {Array.from({length: 520}, (_, i) => <circle key={'c' + i} cx={rnd(i + 900) * 1960 - 20} cy={rnd(i + 901) * 1100} r={(18 + rnd(i + 902) * 34) * clamp01(k * 1.6 - rnd(i + 903) * 0.6)} fill={i % 3 ? '#2E6A34' : '#245A2C'} />)}
      </SVG>
      <Legenda txt={`${Math.round(lerp(1930, 2026, k))} · A FLORESTA APAGA AS MARCAS`} cor="#E8E0C8" />
    </AbsoluteFill>
  );
};

// ---------- RÉGUA DE ENERGIA (em bombas de Hiroshima) ----------
const BARRAS = [
  {n: 'HIROSHIMA', v: 1, cor: '#C3CAD8', txt: '1'},
  {n: 'CURUÇÁ (ESTIMATIVA BAIXA)', v: 1, cor: COR.ouro, txt: '≈ 1'},
  {n: 'CHELYABINSK, 2013', v: 30, cor: COR.calmo, txt: '≈ 30'},
  {n: 'CURUÇÁ (ESTIMATIVA DE BAILEY)', v: 67, cor: COR.brasa, txt: '≈ 67'},
  {n: 'TUNGUSKA, 1908', v: 850, cor: COR.perigo, txt: '700 A 1.000'},
];
export const Regua: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  const n = parseInt(arg) || 0;
  const escalaMax = n >= 4 ? lerp(70, 900, KS(lt, 0.3, d * 0.9)) : n >= 3 ? 70 : n >= 2 ? 32 : 1.2;
  const W = 1300;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 40% 40%, #14213A, #060A14 75%)'}}>
      <div style={{position: 'absolute', left: 120, top: 300, fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: '#C3CAD8'}}>ENERGIA EM BOMBAS DE HIROSHIMA</div>
      {BARRAS.slice(0, n + 1).map((b, i) => {
        const k = i === n ? KO(lt, 0.2, 1.1) : 1;
        const w = Math.max(14, Math.min(1, b.v / escalaMax) * W) * k;
        return (
          <div key={i} style={{position: 'absolute', left: 120, top: 360 + i * 135}}>
            <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: '#C3CAD8', marginBottom: 10}}>{b.n}</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <div style={{width: w, height: 56, borderRadius: 8, background: `linear-gradient(90deg, ${b.cor}99, ${b.cor})`, boxShadow: `0 0 24px ${b.cor}66`}} />
              <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 52, color: '#fff', opacity: k}}>{b.txt}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- CHELYABINSK ----------
export const Chelyabinsk: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  const clarao = arg === '0' ? Math.max(0, 1 - Math.abs(lt - d * 0.55) / 0.6) : 0;
  const k = KS(lt, 0, d * 0.6);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <SVG>
        <defs><linearGradient id="ceCh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6A8AB0" /><stop offset="1" stopColor="#E8D8C0" /></linearGradient></defs>
        <rect width={1920} height={1080} fill="url(#ceCh)" />
        {arg === '0' && <BolaFogo id="ch" hx={lerp(1700, 700, k)} hy={lerp(120, 300, k)} ang={170} L={900} r={14} />}
        {arg === '0' && <path d={`M1920,90 Q${lerp(1700, 700, k) + 300},${lerp(120, 300, k) - 30} ${lerp(1700, 700, k)},${lerp(120, 300, k)}`} stroke="#F2EEE8" strokeWidth={30} fill="none" opacity={0.5} />}
        {/* cidade com neve */}
        {Array.from({length: 16}, (_, i) => { const x = i * 124; const h = 200 + rnd(i + 3) * 260; return <g key={i}><rect x={x} y={1080 - h} width={110} height={h} fill={['#8A8E96', '#7A7E88', '#9A9EA6'][i % 3]} /><rect x={x} y={1080 - h - 10} width={110} height={12} fill="#F2F4F8" />
          {Array.from({length: Math.floor(h / 46)}, (_, j) => Array.from({length: 3}, (_, c) => { const quebra = arg === 'vidro' && rnd(i * 50 + j * 3 + c) < clamp01(lt / d * 1.4); return <rect key={j + '-' + c} x={x + 12 + c * 34} y={1080 - h + 16 + j * 46} width={24} height={30} fill={quebra ? '#1A1E26' : '#CFE2F2'} opacity={0.9} />; }))}</g>; })}
        {arg === 'vidro' && Array.from({length: 90}, (_, i) => { const x = rnd(i) * 1920, y0 = 600 + rnd(i + 1) * 300; const y = y0 + lt * (200 + rnd(i + 2) * 300); return <path key={'v' + i} d={`M${x},${y} l10,-6 l-3,14 Z`} fill="#E0F0FF" opacity={0.8} />; })}
        {arg === 'janela' && <g transform="translate(960,560)">
          <rect x={-420} y={-300} width={840} height={600} fill="#2A2E36" />
          <rect x={-380} y={-260} width={760} height={520} fill="#F4E8D0" />
          <line x1={0} y1={-260} x2={0} y2={260} stroke="#2A2E36" strokeWidth={14} />
          <circle cx={200} cy={-120} r={60 + lt * 30} fill="#FFFFFF" opacity={0.9} />
          {[[-120, 260], [60, 260]].map(([x, y], i) => <g key={i} transform={`translate(${x},${y})`}><circle cy={-200} r={44} fill="#1E1A16" /><path d="M-60,0 L-50,-150 Q0,-170 50,-150 L60,0 Z" fill="#1E1A16" /></g>)}
        </g>}
      </SVG>
      <AbsoluteFill style={{background: '#FFFFFF', opacity: clarao * 0.8}} />
      <Legenda txt="CHELYABINSK, RÚSSIA · 15 DE FEVEREIRO DE 2013" cor="#F2F4F8" />
    </AbsoluteFill>
  );
};

// ---------- SANTA FILOMENA (PE), 2020 ----------
export const Sertao: React.FC<P> = ({lt, d, t, arg = '0'}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <SVG>
      <defs><linearGradient id="ceS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A7AC0" /><stop offset="1" stopColor="#CFE4F2" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#ceS)" />
      {(arg === '0' || arg === 'pedras') && [0, 1, 2, 3].map((i) => <path key={i} d={`M${1500 - i * 90},${-40} Q${1200 - i * 120},${200} ${900 - i * 150},${360 + i * 30}`} stroke="#F2EEE8" strokeWidth={10 - i * 2} fill="none" opacity={0.55 * K(lt, 0, 1)} />)}
      <rect y={760} width={1920} height={320} fill="#C9A46A" />
      {/* mandacarus */}
      {[160, 1760, 1420].map((x, i) => <g key={i} transform={`translate(${x},770)`}><rect x={-14} y={-240} width={28} height={240} rx={14} fill="#4A7A3A" /><path d="M-14,-120 h-40 v-80" stroke="#4A7A3A" strokeWidth={24} fill="none" strokeLinecap="round" /><path d="M14,-160 h36 v-60" stroke="#4A7A3A" strokeWidth={24} fill="none" strokeLinecap="round" /></g>)}
      {/* bar e casas */}
      <g transform="translate(760,770)">
        <rect x={-260} y={-220} width={520} height={220} fill="#E8D8B8" />
        <path d="M-290,-220 L290,-220 L250,-290 L-250,-290 Z" fill="#B0503A" />
        {arg === 'telhado' && <g><path d={`M60,-290 l40,-20 l30,30 l-20,40 l-40,-10 Z`} fill="#1E1A16" opacity={K(lt, d * 0.4, d * 0.5)} />{lt > d * 0.45 && Array.from({length: 14}, (_, i) => <rect key={i} x={90 + (rnd(i) - 0.5) * 80 * (lt - d * 0.45) * 3} y={-280 + (lt - d * 0.45) * 300 * rnd(i + 1)} width={14} height={8} fill="#B0503A" />)}</g>}
        <rect x={-60} y={-150} width={120} height={150} fill="#6A4A2E" />
        <text x={0} y={-236} textAnchor="middle" fontFamily={F.titulo} fontWeight={700} fontSize={40} fill="#5A2A1A">BAR</text>
      </g>
      {(arg === 'pedras' || arg === 'telhado') && Array.from({length: 10}, (_, i) => { const t0 = rnd(i) * d * 0.6; const k = prog(lt, t0, t0 + 0.9); if (k <= 0) return null; const x = 300 + rnd(i + 1) * 1300; const y = lerp(-40, 760 - 20, Math.min(1, k)); return <g key={i}><line x1={x + 60} y1={y - 120} x2={x} y2={y} stroke="#4A4A4A" strokeWidth={6} opacity={k < 1 ? 0.4 : 0} /><circle cx={x} cy={y} r={10} fill="#2A2420" />{k >= 1 && <circle cx={x} cy={y + 10} r={30 * (1 - clamp01((lt - t0 - 0.9) / 1))} fill="#C9A46A" opacity={0.6} />}</g>; })}
      {arg === 'caca' && [0, 1, 2, 3, 4].map((i) => { const x = 300 + i * 300 + Math.sin(t + i) * 30; return <g key={i} transform={`translate(${x},${900 + (i % 2) * 40})`}><path d="M-20,0 L-16,-80 Q0,-90 16,-80 L20,0 Z" fill={['#C14A3A', '#2E6A8A', '#E0A040', '#3A7A4A', '#7A4A9A'][i]} /><circle cy={-100} r={16} fill="#8C5B3E" /><line x1={14} y1={-70} x2={40} y2={-10} stroke="#8C5B3E" strokeWidth={8} strokeLinecap="round" /><circle cx={44} cy={-4} r={9} fill="#2A2420" /></g>; })}
    </SVG>
    <Legenda txt="SANTA FILOMENA (PE) · 19 DE AGOSTO DE 2020" cor="#2A2016" />
  </AbsoluteFill>
);

// ---------- CELULAR ----------
export const Celular: React.FC<P> = ({lt, d, t}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, #1A2438, #070A12 72%)', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{width: 440, height: 860, borderRadius: 56, background: '#0A0C10', padding: 18, boxShadow: '0 30px 80px rgba(0,0,0,0.7)', transform: 'rotate(-4deg)'}}>
      <div style={{width: '100%', height: '100%', borderRadius: 42, background: '#14181F', overflow: 'hidden', position: 'relative'}}>
        {[0, 1, 2].map((i) => { const y = 40 + i * 270 - (lt * 90) % 270; return (
          <div key={i} style={{position: 'absolute', left: 18, right: 18, top: y, height: 250, borderRadius: 18, background: 'linear-gradient(180deg,#3A7AC0,#CFE4F2)', overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, background: '#C9A46A'}} />
            <div style={{position: 'absolute', left: 60 + i * 40, top: 30, width: 200, height: 8, background: '#F2EEE8', transform: 'rotate(28deg)', opacity: 0.8, borderRadius: 4}} />
            <div style={{position: 'absolute', left: '42%', top: '38%', width: 60, height: 60, borderRadius: 30, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 30}}>▶</div>
          </div>
        ); })}
      </div>
    </div>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', right: 300 - i * 30, top: 220 + i * 150, opacity: K(lt, 0.3 + i * 0.4, 0.6 + i * 0.4), fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, color: '#fff', background: 'rgba(6,10,20,0.85)', padding: '10px 18px', borderRadius: 12}}>{['meteoro caiu aqui!', 'achei uma pedra', 'olha o barulho', 'vídeo compartilhado'][i]}</div>)}
  </AbsoluteFill>
);

// ---------- 1930 × 2020 ----------
export const Split: React.FC<P> = ({lt, d}) => (
  <AbsoluteFill style={{background: '#060A14', flexDirection: 'row'}}>
    {[0, 1].map((i) => (
      <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: i ? 'linear-gradient(180deg,#14213A,#0A1222)' : 'linear-gradient(180deg,#3A2A1A,#1A120A)', borderRight: i ? 'none' : '4px solid #E3B04B', opacity: i ? K(lt, d * 0.45, d * 0.6) : 1}}>
        <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 150, color: '#fff'}}>{i ? '2020' : '1930'}</div>
        <svg width={220} height={150} style={{margin: '10px 0 20px'}}>{i ? <g><rect x={80} y={10} width={64} height={120} rx={12} fill="#C3CAD8" /><rect x={88} y={24} width={48} height={88} rx={4} fill="#3A7AC0" /></g> : <g><path d="M10,90 Q110,130 210,90 L200,80 Q110,105 20,80 Z" fill="#C9A46A" /><circle cx={100} cy={52} r={12} fill="#C9A46A" /><path d="M86,82 L88,64 L112,64 L114,82 Z" fill="#C9A46A" /></g>}</svg>
        <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 64, color: i ? COR.calmo : COR.ouro}}>{i ? 'MINUTOS' : '7 MESES'}</div>
        <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: '#C3CAD8', marginTop: 10}}>{i ? 'UM CELULAR' : 'UM FREI'}</div>
      </div>
    ))}
  </AbsoluteFill>
);

// ---------- BRAMON: câmeras pelo Brasil ----------
const CIDADES: [number, number][] = [[-46.6, -23.5], [-43.2, -22.9], [-49.3, -25.4], [-51.2, -30.0], [-47.9, -15.8], [-44.0, -19.9], [-38.5, -12.9], [-34.9, -8.0], [-38.5, -3.7], [-48.5, -1.4], [-60.0, -3.1], [-54.6, -20.4], [-56.1, -15.6], [-49.2, -16.7], [-42.8, -5.1], [-35.2, -5.8], [-40.3, -20.3], [-47.1, -22.9], [-48.6, -27.6], [-45.9, -21.0]];
export const Bramon: React.FC<P> = ({lt, d, t, arg = '0'}) => (
  <MapaAS lt={lt} d={d} lonC={arg === 'risco' ? -45 : -50} latC={arg === 'risco' ? -21 : -15} s0={arg === 'risco' ? 70 : 28} s1={arg === 'risco' ? 74 : 29.5} escuro={0.62}
    children={(Pp) => {
      const a = Pp(-49, -18), b = Pp(-44, -22.5);
      return <g>
        {CIDADES.map((c, i) => { const p = Pp(c[0], c[1]); const k = K(lt, i * 0.05, i * 0.05 + 0.4); return <g key={i} opacity={k}><path d={`M${p[0]},${p[1]} L${p[0] - 40},${p[1] - 90} L${p[0] + 40},${p[1] - 90} Z`} fill={COR.calmo} opacity={0.14} /><circle cx={p[0]} cy={p[1]} r={7} fill={COR.calmo} stroke="#fff" strokeWidth={2} /></g>; })}
        {arg === 'risco' && <><Traco d={`M${a[0]},${a[1]} L${b[0]},${b[1]}`} k={K(lt, 0.3, 1.4)} cor="#FFE8B0" w={6} L={800} />
          {[[-46.6, -23.5], [-43.2, -22.9], [-44.0, -19.9]].map((c, i) => { const p = Pp(c[0], c[1]); const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; return <line key={i} x1={p[0]} y1={p[1]} x2={m[0]} y2={m[1]} stroke={COR.calmo} strokeWidth={2} strokeDasharray="8 8" opacity={K(lt, 1.2 + i * 0.2, 1.6 + i * 0.2)} />; })}</>}
      </g>;
    }}
    html={() => <div style={{position: 'absolute', left: 60, bottom: 50, fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: '#C3CAD8'}}>BRAMON · REDE BRASILEIRA DE MONITORAMENTO DE METEOROS</div>} />
);

// ---------- SONEAR (Oliveira, MG) ----------
export const Sonear: React.FC<P> = ({lt, d, t, arg = '0'}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Espaco t={t} cor="#101C34" />
    <SVG>
      {arg === 'ceu' && Array.from({length: 24}, (_, i) => { const k = K(lt, i * 0.12, i * 0.12 + 0.3); const x = 200 + rnd(i) * 1500, y = 100 + rnd(i + 1) * 500; return <g key={i} opacity={k}><circle cx={x} cy={y} r={5} fill="#FFD98A" /><circle cx={x} cy={y} r={16} fill="none" stroke={COR.ouro} strokeWidth={2} /></g>; })}
      <path d="M0,860 Q300,700 620,760 Q900,640 1200,720 Q1560,620 1920,760 L1920,1080 L0,1080 Z" fill="#0E1A14" />
      <g transform="translate(980,700)">
        <rect x={-90} y={-60} width={180} height={70} fill="#C9CFD8" />
        <path d="M-90,-60 A90,90 0 0 1 90,-60 Z" fill="#E8ECF2" />
        <rect x={-10} y={-150} width={20} height={70} fill="#0E1A14" opacity={0.6} transform={`rotate(${Math.sin(t * 0.3) * 8},0,-60)`} />
      </g>
    </SVG>
    <Legenda txt={arg === 'ceu' ? 'DEZENAS DE ASTEROIDES PRÓXIMOS DA TERRA' : 'SONEAR · OLIVEIRA (MG) · ASTRÔNOMOS AMADORES'} />
  </AbsoluteFill>
);

// ---------- BENDEGÓ ----------
export const Bendego: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  const fogo = arg === 'fogo';
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: fogo ? '#1A0804' : '#1E1A16'}}>
      <SVG>
        {/* salão */}
        <rect width={1920} height={760} fill={fogo ? '#2A0C06' : arg === '2' ? '#2A2420' : '#3A3228'} />
        {[300, 760, 1220, 1680].map((x) => <rect key={x} x={x - 30} y={0} width={60} height={760} fill={fogo ? '#3A140A' : '#4A4034'} />)}
        <rect y={760} width={1920} height={320} fill={fogo ? '#2A1008' : '#4A3E30'} />
        {fogo && Array.from({length: 40}, (_, i) => { const x = rnd(i) * 1920; const h = 200 + Math.sin(t * 6 + i) * 60 + rnd(i + 1) * 200; return <path key={i} d={`M${x - 50},760 Q${x},${760 - h} ${x + 50},760 Z`} fill={i % 2 ? '#FF7A2F' : '#FFB547'} opacity={0.75} />; })}
        {arg === '2' && Array.from({length: 30}, (_, i) => <rect key={i} x={rnd(i) * 1920} y={700 + rnd(i + 1) * 80} width={40 + rnd(i + 2) * 80} height={10} fill="#1A1410" />)}
        {/* o meteorito */}
        <g transform="translate(960,760)">
          <rect x={-300} y={-40} width={600} height={60} fill="#5A4E40" />
          <path d="M-260,-40 Q-280,-160 -160,-230 Q-40,-290 100,-260 Q240,-230 270,-130 Q290,-60 240,-40 Z" fill="#2E2A28" />
          <path d="M-200,-120 Q-100,-200 40,-210" fill="none" stroke="#4A4440" strokeWidth={8} />
          <path d="M60,-180 Q160,-170 220,-110" fill="none" stroke="#5A5450" strokeWidth={5} />
        </g>
      </SVG>
      <Legenda txt={fogo ? 'MUSEU NACIONAL · INCÊNDIO DE 2018' : 'BENDEGÓ · ACHADO NO SERTÃO DA BAHIA EM 1784'} cor="#E8D8B8" />
    </AbsoluteFill>
  );
};

// ---------- CHECKLIST DO METEORITO ----------
export const Checklist: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  const itens = ['MAIS PESADO QUE UMA PEDRA COMUM', 'CASCA ESCURA POR FORA', 'MUITAS VEZES GRUDA NO ÍMÃ', 'FOTOGRAFE O LUGAR · PROCURE UM MUSEU'];
  const ima = arg === 'ima';
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 50%, #2A2A30, #0A0A0E 72%)'}}>
      <SVG>
        <g transform="translate(520,560)">
          <path d="M-180,40 Q-200,-100 -80,-170 Q60,-220 170,-120 Q220,-20 160,80 Q40,150 -100,120 Z" fill="#26221F" stroke="#0E0C0A" strokeWidth={10} />
          <path d="M-60,-60 Q0,-100 80,-70" fill="none" stroke="#3E3834" strokeWidth={6} />
          {ima && <g transform={`translate(${lerp(260, 175, K(lt, 0.3, 0.9))},-30)`}><path d="M0,-60 h80 v120 h-80 v-30 h50 v-60 h-50 Z" fill="#B3261E" /><rect x={0} y={-60} width={22} height={30} fill="#C9CFD8" /><rect x={0} y={30} width={22} height={30} fill="#C9CFD8" /></g>}
        </g>
      </SVG>
      <div style={{position: 'absolute', left: 900, top: 300, display: 'flex', flexDirection: 'column', gap: 26}}>
        {itens.map((s, i) => <div key={s} style={{opacity: K(lt, (ima ? 0 : 0.3) + i * 0.45, (ima ? 0.2 : 0.6) + i * 0.45), fontFamily: F.titulo, fontWeight: 700, fontSize: 40, color: '#fff', display: 'flex', alignItems: 'center', gap: 18}}><span style={{width: 44, height: 44, borderRadius: 10, background: COR.verde, color: '#06140E', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 32}}>✓</span>{s}</div>)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- GLOBO COM BÓLIDOS ----------
export const GloboBolidos: React.FC<P> = ({lt, d, t}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Espaco t={t} />
    <SVG>
      <Globo cx={960} cy={560} r={400} lon={-40 + lt * 4} lat={-8}>{(Pp) => <g>
        {Array.from({length: 60}, (_, i) => { const lon = rnd(i) * 360 - 180, lat = (rnd(i + 1) - 0.5) * 140; const p = Pp(lon, lat); if (!p) return null; const k = K(lt, rnd(i + 2) * d * 0.8, rnd(i + 2) * d * 0.8 + 0.3); return <circle key={i} cx={p[0]} cy={p[1]} r={6} fill="#FFB547" opacity={k * 0.9} />; })}
        {(() => { const p = Pp(-71.6, -5.2); return p ? <Pulso p={p} t={t} cor={COR.perigo} r={8} /> : null; })()}
      </g>}</Globo>
    </SVG>
    <Legenda txt="A MAIORIA CAI NO MAR OU ONDE NÃO TEM NINGUÉM" />
  </AbsoluteFill>
);

// ---------- TRÊS HIPÓTESES ----------
export const Hipoteses: React.FC<P> = ({lt, d}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, #14213A, #060A14 75%)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 40, paddingTop: 140}}>
    {[['3 PEDRAS GRANDES', '≈ 1 MEGATON', 'BAILEY', COR.brasa], ['1 PEDRA PEQUENA', '+ TERREMOTO COMUM', 'CORDERO E POVEDA', COR.calmo], ['?', 'ALGO QUE AINDA NÃO ENTENDEMOS', 'CASO ABERTO', COR.ouro]].map(([a, b, c, cor], i) => (
      <div key={i} style={{width: 500, height: 460, borderRadius: 22, background: 'rgba(10,16,30,0.9)', borderTop: `6px solid ${cor}`, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', padding: 36, opacity: K(lt, 0.4 + i * 0.9, 0.8 + i * 0.9), transform: `translateY(${(1 - KO(lt, 0.4 + i * 0.9, 1 + i * 0.9)) * 30}px)`}}>
        <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: cor}}>HIPÓTESE {i + 1}</div>
        <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: i === 2 ? 140 : 58, color: '#fff', marginTop: 24, lineHeight: 1.05}}>{a}</div>
        <div style={{fontFamily: F.titulo, fontWeight: 600, fontSize: 36, color: '#C3CAD8', marginTop: 16}}>{b}</div>
        <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 20, letterSpacing: 4, color: '#8A93A6', marginTop: 30}}>{c}</div>
      </div>
    ))}
  </AbsoluteFill>
);

// ---------- MATA DE CIMA ----------
export const MataCima: React.FC<P> = ({lt, d, t}) => (
  <AbsoluteFill style={{background: '#163A1E', overflow: 'hidden'}}>
    <SVG style={{transform: `translate(${-lt * 12}px, ${-lt * 6}px) scale(1.06)`}}>
      <Mata seed={777} />
      <path d="M-40,820 C300,760 600,900 960,840 S1600,700 1980,780" stroke="#6A8A9A" strokeWidth={60} fill="none" opacity={0.85} />
    </SVG>
    <Legenda txt="RIO CURUÇÁ · HOJE · NENHUMA MARCA" cor="#E8E0C8" />
  </AbsoluteFill>
);

// ---------- CARTELA FINAL ----------
export const Cartela: React.FC<P> = ({lt, d, t}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Espaco t={t} />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 130, color: '#F2F4F8', letterSpacing: 6, opacity: K(lt, 0.2, 0.8), textShadow: '0 0 30px rgba(227,176,75,0.35)'}}>BRASIL MILENAR</div>
      <div style={{width: lerp(0, 520, KO(lt, 0.6, 1.4)), height: 6, background: COR.ouro, borderRadius: 3, margin: '18px 0 30px', boxShadow: `0 0 20px ${COR.ouro}`}} />
      <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: '#C3CAD8', opacity: K(lt, 1, 1.6)}}>O BRASIL QUE NENHUM LIVRO DE ESCOLA MOSTROU</div>
      <div style={{marginTop: 60, padding: '18px 46px', borderRadius: 40, background: '#C4302B', fontFamily: F.titulo, fontWeight: 700, fontSize: 44, color: '#fff', opacity: K(lt, 1.6, 2.2), transform: `scale(${lerp(0.9, 1, KO(lt, 1.6, 2.2))})`}}>INSCREVA-SE</div>
    </AbsoluteFill>
  </AbsoluteFill>
);
