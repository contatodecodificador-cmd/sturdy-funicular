/* ATO 1 — o corpo por dentro (portas 1 a 4) */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {F} from './theme';
import {lerp, rnd, clamp01, prog, KO, KS, es, FR, QU, Numero} from './base';
import {Pessoa, VOCE, ANNA, WILLIE, Visual} from './personagens';

const SVG: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0, overflow: 'visible'}}>{children}</svg>;
const fmt = (v: number, casas = 0) => v.toFixed(casas).replace('.', ',');

// ---------- carimbo (selo que bate na tela) ----------
export const Carimbo: React.FC<{lt: number; t0?: number; txt: string; cor?: string; x?: number; y?: number; rot?: number; size?: number}> = ({lt, t0 = 0, txt, cor = QU.lava, x = 960, y = 540, rot = -8, size = 92}) => {
  if (lt < t0) return null;
  const k = prog(lt, t0, t0 + 0.22);
  const sc = lerp(1.7, 1, es(k));
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc})`, opacity: k}}>
      <div style={{padding: '14px 36px', border: `8px solid ${cor}`, borderRadius: 16, fontFamily: F.titulo, fontWeight: 700, fontSize: size, color: cor, letterSpacing: 6, whiteSpace: 'nowrap', background: 'rgba(6,10,20,0.55)', boxShadow: `0 0 30px ${cor}55`, textShadow: '0 4px 14px rgba(0,0,0,0.6)'}}>{txt}</div>
    </div>
  );
};

// ---------- 1) A janelinha: escala do universo x a faixa da vida ----------
export const Janela: React.FC<{lt: number; t: number; zoom: number; brilho?: number}> = ({lt, t, zoom, brilho = 1}) => {
  // eixo log "simbólico": -273 ... 0 ... 37 ... 1e12. zoom 0 = tudo; zoom 1 = só 30..45
  const pontos = [{v: '−273', x: 0}, {v: '−200', x: 0.08}, {v: '−100', x: 0.18}, {v: '0', x: 0.3}, {v: '35', x: 0.333}, {v: '40', x: 0.337}, {v: '1.000', x: 0.5}, {v: '1 MILHÃO', x: 0.7}, {v: '1 TRILHÃO', x: 1}];
  const cx = 0.335;
  const esc = 1500 * Math.pow(28, zoom);
  const X = (u: number) => 960 + (u - lerp(0.5, cx, zoom)) * esc;
  const y = 600;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 55%, #121B2E, #05070D 70%)'}}>
      <SVG>
        <defs><linearGradient id="eixo" x1="0" x2="1"><stop offset="0%" stopColor={FR.azul} /><stop offset="33%" stopColor="#E8E8E8" /><stop offset="100%" stopColor={QU.lava} /></linearGradient></defs>
        <rect x={X(0)} y={y - 14} width={X(1) - X(0)} height={28} rx={14} fill="url(#eixo)" opacity={0.9} />
        {pontos.map((p) => (zoom < 0.6 ? !['35', '40'].includes(p.v) : ['35', '40'].includes(p.v)) && <g key={p.v} opacity={['35', '40'].includes(p.v) ? 1 : 1 - zoom}>
          <line x1={X(p.x)} x2={X(p.x)} y1={y - 34} y2={y + 34} stroke="#fff" strokeOpacity={0.6} strokeWidth={3} />
          <text x={X(p.x) + (p.v === '35' && zoom > 0.6 ? -12 : p.v === '40' && zoom > 0.6 ? 12 : 0)} y={y + 84} textAnchor={p.v === '35' && zoom > 0.6 ? 'end' : p.v === '40' && zoom > 0.6 ? 'start' : 'middle'} fill="#C9D0DC" style={{fontFamily: F.titulo, fontWeight: 600, fontSize: 40}}>{p.v}{p.v === '35' || p.v === '40' ? ' °C' : ''}</text>
        </g>)}
        {/* a faixa da vida */}
        <rect x={X(0.333)} y={y - 60} width={Math.max(6, X(0.337) - X(0.333))} height={120} rx={8} fill={QU.fogo} opacity={0.35 + 0.25 * Math.sin(t * 4) * brilho} />
        <rect x={X(0.333)} y={y - 60} width={Math.max(6, X(0.337) - X(0.333))} height={120} rx={8} fill="none" stroke="#FFE0A8" strokeWidth={4} />
        {zoom < 0.6 && <text x={(X(0.333) + X(0.337)) / 2} y={y - 86} textAnchor="middle" fill="#FFE0A8" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 46}}>VOCÊ: 35–40 °C</text>}
        {zoom > 0.6 && <g opacity={KS(zoom, 0.6, 0.9)} transform={`translate(${(X(0.333) + X(0.337)) / 2},${y - 90}) scale(0.62)`}><Pessoa v={VOCE} expr="susto" t={t} /></g>}
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- 2) corpo com termômetro interno (frio ou calor) ----------
export const CorpoTemp: React.FC<{lt: number; t: number; temp: number; v?: Visual; expr?: any; tremor?: number; suor?: number; casaco?: number; fundo?: 'neve' | 'sol' | 'neutro'}> = ({lt, t, temp, v = VOCE, expr, tremor = 0, suor = 0, fundo = 'neutro'}) => {
  const frio = clamp01((37 - temp) / 9), calor = clamp01((temp - 37) / 9);
  const tr = tremor * Math.sin(t * 60) * 3;
  const e = expr ?? (frio > 0.5 ? 'frio' : calor > 0.4 ? 'calor' : 'neutro');
  const bg = fundo === 'neve' ? 'linear-gradient(180deg,#5C7FA0,#1B2C42)' : fundo === 'sol' ? 'linear-gradient(180deg,#E9A04E,#6A2B12)' : 'radial-gradient(circle at 42% 55%, #16233A, #05070D 70%)';
  return (
    <AbsoluteFill style={{background: bg}}>
      <SVG>
        <defs>
          <radialGradient id="ctN"><stop offset="0%" stopColor={calor > 0 ? '#FFD08A' : frio > 0.3 ? '#BFE6FF' : '#FFD08A'} stopOpacity={0.9} /><stop offset="100%" stopColor={calor > 0 ? QU.lava : FR.azul} stopOpacity={0} /></radialGradient>
        </defs>
        {fundo === 'neve' && Array.from({length: 90}, (_, i) => <circle key={i} cx={(rnd(i) * 1920 + t * 40 * (0.5 + rnd(i + 2))) % 1920} cy={(rnd(i + 5) * 1080 + t * 90 * (0.6 + rnd(i + 7))) % 1080} r={2 + rnd(i + 3) * 4} fill="#fff" opacity={0.7} />)}
        {fundo === 'sol' && Array.from({length: 6}, (_, i) => <path key={i} d={`M${i * 330},${880 - (t * 30 + i * 40) % 300} q80,-30 160,0 t160,0`} stroke="#FFE3B0" strokeWidth={3} fill="none" opacity={0.25} />)}
        <g transform={`translate(${760 + tr},1010) scale(1.95)`}>
          <ellipse cx={0} cy={0} rx={90} ry={14} fill="rgba(0,0,0,0.4)" />
          <Pessoa v={v} expr={e} t={t} suor={suor} geada={frio * 0.9} bE={tremor ? [14, 70] : [8, 8]} bD={tremor ? [14, 70] : [8, 8]} />
          {/* tinta de temperatura sobre o corpo */}
          <ellipse cx={0} cy={-260} rx={95} ry={175} fill="url(#ctN)" opacity={0.35 + 0.4 * Math.max(frio, calor)} style={{mixBlendMode: 'screen'} as any} />
        </g>
        {/* termômetro interno grande ao lado */}
        <g transform="translate(1290,250)">
          <rect x={-46} y={0} width={92} height={560} rx={46} fill="rgba(6,10,20,0.85)" stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
          {(() => { const y = (x: number) => lerp(520, 40, (x - 10) / 40); const yy = y(temp); return <>
            {[20, 28, 35, 37, 40, 42].map((m) => <g key={m}><line x1={-46} x2={-24} y1={y(m)} y2={y(m)} stroke="#fff" strokeOpacity={m === 37 ? 0.9 : 0.4} strokeWidth={m === 37 ? 4 : 2} /><text x={-60} y={y(m) + 9} textAnchor="end" fill={m === 37 ? '#fff' : '#9AA3B5'} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 26}}>{m}</text></g>)}
            <rect x={-14} y={yy} width={28} height={540 - yy} rx={14} fill={temp < 35 ? FR.azul : temp > 39 ? QU.lava : QU.fogo} />
            <circle cx={0} cy={560} r={52} fill={temp < 35 ? FR.azul : temp > 39 ? QU.lava : QU.fogo} stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
          </>; })()}
        </g>
      </SVG>
      <div style={{position: 'absolute', left: 1400, top: 470}}>
        <Numero cor={temp < 35 ? FR.azul : temp > 39 ? QU.lava : QU.fogo} size={140}>{fmt(temp, temp % 1 ? 1 : 0)} °C</Numero>
        <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: '#C3CAD8', marginTop: 10}}>POR DENTRO</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3) despir paradoxal: pessoa tirando o casaco na nevasca ----------
export const Nevasca: React.FC<{lt: number; t: number; tira: number}> = ({lt, t, tira}) => {
  const vJ: Visual = {...VOCE, topo: {tipo: 'jaqueta', cor: '#3E5C76', cor2: '#2C4258'}, baixo: {tipo: 'calca', cor: '#2F3B52'}, pe: {tipo: 'bota', cor: '#2A2A2A'}, gorro: '#8C2F39'};
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#334A63 0%,#8EA6BD 62%,#DCE7F0 62%,#F2F6FA 100%)'}}>
      <SVG>
        {Array.from({length: 9}, (_, i) => { const x = i * 240 + rnd(i) * 80; const h = 160 + rnd(i + 2) * 120; return <path key={i} d={`M${x},670 l60,${-h} l60,${h} Z`} fill="#4E6475" opacity={0.6} />; })}
        <g transform="translate(960,1000) scale(1.6)">
          <ellipse cx={0} cy={0} rx={90} ry={14} fill="rgba(0,0,0,0.2)" />
          <Pessoa v={tira > 0.5 ? VOCE : vJ} expr="fechado" t={t} bE={[lerp(10, 150, tira), lerp(10, 40, tira)]} bD={[lerp(10, 150, tira), lerp(10, 40, tira)]} geada={0.8} />
        </g>
        {/* casaco caindo na neve */}
        {tira > 0.5 && <g transform={`translate(${1150 + (tira - 0.5) * 120},${lerp(700, 980, KS(tira, 0.5, 1))}) rotate(${(tira - 0.5) * 140})`}><path d="M-70,-40 L70,-40 L90,60 L-90,60 Z" fill="#3E5C76" /><rect x={-60} y={-10} width={120} height={10} fill="#F2F2F2" opacity={0.8} /></g>}
        {Array.from({length: 160}, (_, i) => <circle key={i} cx={(rnd(i) * 2100 + t * 260 * (0.6 + rnd(i + 2))) % 2100 - 100} cy={(rnd(i + 5) * 1080 + t * 120 * (0.6 + rnd(i + 7))) % 1080} r={1.5 + rnd(i + 3) * 4} fill="#fff" opacity={0.8} />)}
      </SVG>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(255,255,255,0.18), transparent 30%, transparent 70%, rgba(255,255,255,0.18))'}} />
    </AbsoluteFill>
  );
};

// ---------- 4) monitor cardíaco grande ----------
export const MonitorGrande: React.FC<{t: number; bpm: number; irregular?: number; temp?: string; cor?: string}> = ({t, bpm, irregular = 0, temp, cor = '#3DDB7A'}) => {
  const per = 60 / bpm;
  const pts: string[] = [];
  for (let i = 0; i <= 300; i++) {
    const x = 200 + i * 5;
    const tt = t - (300 - i) * 0.012;
    const ph = ((tt + Math.sin(Math.floor(tt / per) * 7.1) * irregular * per * 0.4) % per + per) % per / per;
    const yv = ph < 0.04 ? -16 : ph < 0.07 ? 150 : ph < 0.1 ? -260 : ph < 0.13 ? 90 : ph > 0.3 && ph < 0.4 ? -40 * Math.sin((ph - 0.3) / 0.1 * Math.PI) : 0;
    pts.push(`${x},${540 + yv * 0.9}`);
  }
  return (
    <AbsoluteFill style={{background: '#04090C'}}>
      <SVG>
        {Array.from({length: 40}, (_, i) => <line key={i} x1={i * 50} x2={i * 50} y1={0} y2={1080} stroke="#0E2A1E" strokeWidth={1} />)}
        {Array.from({length: 22}, (_, i) => <line key={'h' + i} y1={i * 50} y2={i * 50} x1={0} x2={1920} stroke="#0E2A1E" strokeWidth={1} />)}
        <polyline points={pts.join(' ')} fill="none" stroke={cor} strokeWidth={6} strokeLinejoin="round" filter="url(#glowM)" />
        <polyline points={pts.join(' ')} fill="none" stroke="#D8FFE6" strokeWidth={2} />
        <defs><filter id="glowM"><feGaussianBlur stdDeviation="6" /></filter></defs>
      </SVG>
      <div style={{position: 'absolute', right: 120, top: 110, textAlign: 'right'}}>
        <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 130, color: cor, lineHeight: 1}}>{bpm}</div>
        <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: '#7FB89A'}}>BATIMENTOS / MIN</div>
        {temp && <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 70, color: '#BFE6FF', marginTop: 30}}>{temp}</div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- 5) Anna esquiando no rio congelado à noite / caindo ----------
export const RioNoite: React.FC<{lt: number; t: number; queda: number}> = ({lt, t, queda}) => {
  const x = lerp(-200, 900, Math.min(1, lt / 2.5));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#07101F 0%,#142A44 55%)'}}>
      <SVG>
        {Array.from({length: 140}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 9) * 520} r={0.6 + rnd(i + 4) * 1.6} fill="#fff" opacity={0.4 + 0.5 * rnd(i + 2)} />)}
        {/* aurora */}
        <path d={`M0,${220 + Math.sin(t * 0.5) * 20} C500,120 900,300 1920,${160 + Math.cos(t * 0.4) * 30} L1920,330 C1200,420 700,260 0,360 Z`} fill="#3DDBB4" opacity={0.12} />
        {Array.from({length: 18}, (_, i) => { const xx = i * 115 - 30 + rnd(i) * 40, h = 110 + rnd(i + 3) * 120; return <path key={i} d={`M${xx},590 l45,${-h} l45,${h} Z`} fill="#0A1B22" />; })}
        <rect x={0} y={580} width={1920} height={500} fill="#BFD6E6" />
        <rect x={0} y={580} width={1920} height={500} fill="url(#luarGelo)" />
        <defs><linearGradient id="luarGelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8FB1CC" /><stop offset="100%" stopColor="#E3EEF6" /></linearGradient></defs>
        {/* buraco no gelo */}
        <ellipse cx={980} cy={820} rx={170} ry={40} fill="#0B2236" />
        <ellipse cx={980} cy={812} rx={170} ry={36} fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={0.6} />
        {/* Anna */}
        {queda < 1 && <g transform={`translate(${queda > 0 ? 980 : x},${lerp(800, 900, queda)}) rotate(${lerp(-10, 25, queda)}) scale(${lerp(0.9, 0.85, queda)})`} opacity={1 - queda * 0.9}>
          <rect x={-120} y={-8} width={240} height={10} rx={5} fill="#E2BE6A" />
          <line x1={-60} y1={-150} x2={-110} y2={-6} stroke="#555" strokeWidth={5} />
          <Pessoa v={ANNA} expr={queda > 0 ? 'susto' : 'sorriso'} t={t} bE={[40, 30]} bD={[40, 30]} />
        </g>}
        {queda > 0.3 && Array.from({length: 18}, (_, i) => { const a = rnd(i) * Math.PI, r = KS(queda, 0.3, 1) * (60 + rnd(i + 3) * 120); return <circle key={i} cx={980 + Math.cos(a) * r * 1.4} cy={800 - Math.sin(a) * r * 0.8} r={4 + rnd(i) * 6} fill="#DDF1FF" opacity={1 - queda * 0.6} />; })}
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- 6) hospital genérico (Anna com máquina / Willie) ----------
export const Leito: React.FC<{lt: number; t: number; pac: 'anna' | 'willie'; maquina?: number; temp: number; legenda?: string; corT?: string}> = ({lt, t, pac, maquina = 0, temp, legenda, corT}) => {
  const v = pac === 'anna' ? ANNA : WILLIE;
  const vSem: Visual = pac === 'anna' ? {...ANNA, gorro: undefined, oculosNeve: false, topo: {tipo: 'avental', cor: '#A9CBD9', cor2: '#7FA8BA'}} : v;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #D3E0E5 0%, #B8CBD2 60%, #8FA5AE 100%)'}}>
      <SVG>
        <rect y={760} width={1920} height={320} fill="#7E949E" />
        <g transform="translate(900,860)">
          <rect x={-520} y={-120} width={1040} height={60} rx={14} fill="#E6ECEE" />
          <rect x={-520} y={-170} width={1040} height={60} rx={20} fill="#F7FAFB" />
          <rect x={-540} y={-300} width={30} height={300} rx={8} fill="#A9B6BC" />
          <rect x={510} y={-220} width={30} height={220} rx={8} fill="#A9B6BC" />
          <ellipse cx={-330} cy={-190} rx={130} ry={44} fill="#FFFFFF" />
          <g transform="translate(150,-205) rotate(-90) scale(1.25)"><Pessoa v={vSem} expr={pac === 'anna' && maquina < 0.5 ? 'fechado' : 'dor'} t={t} semPernas bE={[3, 0]} bD={[3, 0]} /></g>
          <path d="M-215,-292 Q-150,-300 100,-288 Q350,-276 500,-250 L500,-120 L-215,-120 Q-232,-200 -215,-292 Z" fill="#9FC2D1" />
          <path d="M-215,-292 Q-150,-300 100,-288 Q350,-276 500,-250" stroke="#7FA8BA" strokeWidth={6} fill="none" />
        </g>
        {/* máquina de circulação extracorpórea */}
        {maquina > 0 && <g opacity={maquina} transform="translate(1600,760)">
          <rect x={-130} y={-420} width={260} height={420} rx={18} fill="#E9EEF1" stroke="#9FB0B8" strokeWidth={4} />
          <rect x={-100} y={-390} width={200} height={110} rx={10} fill="#0A1018" />
          <text x={0} y={-320} textAnchor="middle" fill="#FFB547" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 52}}>+{fmt(Math.min(37, temp) - 13.7, 1)}°</text>
          <circle cx={-50} cy={-190} r={46} fill="none" stroke="#B4C2C9" strokeWidth={10} />
          <circle cx={-50} cy={-190} r={8} fill="#7F8E96" />
          <line x1={-50} y1={-190} x2={-50 + Math.cos(t * 6) * 40} y2={-190 + Math.sin(t * 6) * 40} stroke="#7F8E96" strokeWidth={8} strokeLinecap="round" />
          {/* tubos: sangue frio saindo (azul), quente voltando (vermelho) */}
          <path d="M-130,-150 C-400,-150 -700,-120 -1000,-160" stroke="#3E8EDE" strokeWidth={14} fill="none" strokeDasharray="24 14" strokeDashoffset={t * 60} />
          <path d="M-130,-100 C-400,-80 -700,-90 -1000,-130" stroke="#E2453B" strokeWidth={14} fill="none" strokeDasharray="24 14" strokeDashoffset={-t * 60} />
        </g>}
      </SVG>
      <div style={{position: 'absolute', left: 90, top: 90, padding: '14px 26px', borderRadius: 14, background: 'rgba(6,10,20,0.9)', borderLeft: `5px solid ${corT ?? (temp < 30 ? FR.azul : QU.lava)}`, boxShadow: '0 12px 36px rgba(0,0,0,0.5)'}}>
        <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 18, letterSpacing: 4, color: '#B9C2D3'}}>{legenda ?? 'TEMPERATURA DO CORPO'}</div>
        <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 92, color: '#fff', fontVariantNumeric: 'tabular-nums', lineHeight: 1.05}}>{fmt(temp, 1)} °C</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7) comparação em dois cartões ----------
export const Comparacao: React.FC<{lt: number; a: {ic: string; n: string; l: string; cor: string}; b: {ic: string; n: string; l: string; cor: string}; vs?: string}> = ({lt, a, b, vs = '<'}) => {
  const card = (c: typeof a, x: number, d: number) => {
    const k = KO(lt, d, d + 0.45);
    return (
      <div style={{position: 'absolute', left: x, top: 260, width: 640, height: 560, borderRadius: 28, background: 'linear-gradient(180deg, rgba(14,22,40,0.95), rgba(6,10,20,0.95))', border: `2px solid ${c.cor}66`, boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${c.cor}22`, opacity: k, transform: `translateY(${(1 - k) * 40}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: 150, lineHeight: 1}}>{c.ic}</div>
        <Numero cor={c.cor} size={120} style={{marginTop: 20}}>{c.n}</Numero>
        <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: '#C3CAD8', marginTop: 18, textAlign: 'center', padding: '0 30px'}}>{c.l}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #121A2C, #05070D 75%)'}}>
      {card(a, 220, 0.05)}
      {card(b, 1060, 0.35)}
      <div style={{position: 'absolute', left: 960, top: 540, transform: 'translate(-50%,-50%)', fontFamily: F.titulo, fontWeight: 700, fontSize: 110, color: '#fff', opacity: KO(lt, 0.6, 0.9)}}>{vs}</div>
    </AbsoluteFill>
  );
};

// ---------- 8) cérebro gelado gasta menos oxigênio ----------
export const CerebroFrio: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const gelo = KS(lt, 0.2, 1.4);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #0F2238, #04070D 70%)'}}>
      <SVG>
        <defs><radialGradient id="gelC"><stop offset="0%" stopColor="#BFE6FF" stopOpacity={0.7} /><stop offset="100%" stopColor="#3E8EDE" stopOpacity={0} /></radialGradient></defs>
        <circle cx={960} cy={540} r={420} fill="url(#gelC)" opacity={gelo} />
        <g transform="translate(960,560) scale(9)">
          <path d="M-26,8 C-34,-14 -14,-30 0,-24 C14,-30 34,-14 26,8 C18,18 -18,18 -26,8 Z" fill={`rgb(${Math.round(lerp(242, 190, gelo))},${Math.round(lerp(155, 210, gelo))},${Math.round(lerp(166, 240, gelo))})`} stroke="#FFE0E4" strokeWidth={0.5} />
          <path d="M0,-24 L0,14 M-14,-10 q6,6 0,12 M14,-10 q-6,6 0,12 M-22,0 q6,-4 10,2 M22,0 q-6,-4 -10,2" stroke="rgba(120,80,100,0.6)" strokeWidth={0.6} fill="none" />
        </g>
        {/* bolhas de O2: muitas entrando devagar, poucas sendo gastas */}
        {Array.from({length: 26}, (_, i) => { const a = rnd(i) * Math.PI * 2; const r = 520 - ((t * lerp(120, 40, gelo) + rnd(i + 4) * 400) % 400); return <g key={i} opacity={0.75}><circle cx={960 + Math.cos(a) * r} cy={560 + Math.sin(a) * r * 0.7} r={16} fill="none" stroke="#DDF1FF" strokeWidth={3} /><text x={960 + Math.cos(a) * r} y={566 + Math.sin(a) * r * 0.7} textAnchor="middle" fill="#DDF1FF" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 14}}>O₂</text></g>; })}
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- 9) rua quente de Atlanta, 1980 ----------
export const RuaQuente: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg,#F2C46D 0%,#E9955A 45%,#8C4A2A 100%)'}}>
    <SVG>
      <circle cx={1500} cy={170} r={110} fill="#FFF1C8" opacity={0.95} />
      <circle cx={1500} cy={170} r={220} fill="#FFE1A0" opacity={0.25} />
      {[[60, 330, 240], [330, 260, 210], [560, 380, 180], [760, 300, 230], [1010, 400, 200], [1230, 280, 190], [1440, 350, 260], [1720, 300, 220]].map(([x, h, w], i) => <g key={i}><rect x={x} y={700 - h} width={w} height={h} fill={['#A25E3C', '#8C5236', '#B06D47', '#94583A'][i % 4]} />{Array.from({length: Math.floor(h / 70)}, (_, j) => <rect key={j} x={x + 30} y={700 - h + 30 + j * 70} width={w - 60} height={30} fill="#5A3020" opacity={0.5} />)}</g>)}
      <rect y={700} width={1920} height={120} fill="#9C8B78" />
      <rect y={820} width={1920} height={260} fill="#3A3330" />
      {Array.from({length: 8}, (_, i) => <rect key={i} x={i * 260 + 40} y={940} width={140} height={14} fill="#E8D27A" opacity={0.8} />)}
      {/* ar tremendo */}
      {Array.from({length: 10}, (_, i) => <path key={i} d={`M${i * 200 - 40 + Math.sin(t * 2 + i) * 20},${830} q30,-40 0,-80 q-30,-40 0,-80`} stroke="#FFE3B0" strokeWidth={3} fill="none" opacity={0.22} />)}
      {/* termômetro de rua */}
      <g transform="translate(330,520)">
        <rect x={-14} y={0} width={28} height={300} fill="#555" />
        <rect x={-110} y={-120} width={220} height={130} rx={10} fill="#1C1C1C" />
        <text x={0} y={-30} textAnchor="middle" fill="#FF7A2F" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 76}}>38 °C</text>
      </g>
      {/* Willie sentado no meio-fio, exausto */}
      <g transform="translate(1100,820) scale(1.05)">
        <ellipse cx={0} cy={0} rx={110} ry={14} fill="rgba(0,0,0,0.3)" />
        <g transform="translate(0,-10) scale(1,0.78)"><Pessoa v={{...WILLIE, topo: {tipo: 'camiseta', cor: '#E9E2D0', cor2: '#C9C0AA'}, baixo: {tipo: 'calca', cor: '#4A4F5A'}, pe: {tipo: 'sapato', cor: '#2A2A2A'}}} expr="calor" t={t} suor={1} bE={[30, 110]} bD={[25, 40]} /></g>
      </g>
    </SVG>
  </AbsoluteFill>
);

// ---------- 10) régua da vida: 13,7 ←→ 46,5 iluminado ----------
export const ReguaVida: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const y = (v: number) => lerp(930, 150, (v - 0) / 60);
  const k = KS(lt, 0.3, 1.6);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #121A2C, #04060B 75%)'}}>
      <SVG>
        <defs><linearGradient id="rv" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor={FR.azul} /><stop offset="50%" stopColor="#EDEDED" /><stop offset="100%" stopColor={QU.lava} /></linearGradient></defs>
        <rect x={900} y={120} width={120} height={840} rx={60} fill="rgba(6,10,20,0.9)" stroke="rgba(255,255,255,0.2)" strokeWidth={3} />
        <rect x={930} y={150} width={60} height={780} rx={30} fill="url(#rv)" opacity={0.18} />
        <rect x={930} y={lerp(y(37), y(46.5), k)} width={60} height={lerp(y(37), y(46.5), k) * -1 + lerp(y(37), y(13.7), k)} rx={30} fill="url(#rv)" />
        {[0, 10, 20, 30, 40, 50, 60].map((m) => <g key={m}><line x1={880} x2={900} y1={y(m)} y2={y(m)} stroke="#fff" strokeOpacity={0.4} strokeWidth={3} /><text x={866} y={y(m) + 10} textAnchor="end" fill="#8A93A6" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 28}}>{m}</text></g>)}
        {[[13.7, 'ANNA · 13,7 °C', FR.azul], [46.5, 'WILLIE · 46,5 °C', QU.lava], [37, 'VOCÊ · 37 °C', QU.fogo]].map(([v, l, c], i) => <g key={i} opacity={i === 2 ? 1 : KO(lt, 0.9 + i * 0.3, 1.3 + i * 0.3)}>
          <path d={`M1030,${y(v as number)} l26,-16 l0,32 Z`} fill={c as string} />
          <rect x={1056} y={y(v as number) - 30} width={330} height={60} rx={12} fill="rgba(6,10,20,0.92)" stroke={c as string} strokeWidth={3} />
          <text x={1076} y={y(v as number) + 13} fill="#fff" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 36}}>{l}</text>
        </g>)}
      </SVG>
    </AbsoluteFill>
  );
};
