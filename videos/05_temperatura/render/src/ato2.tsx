/* ATO 2 — a Terra (portas 5 a 11) */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {geoOrthographic, geoPath, geoGraticule} from 'd3-geo';
import {F} from './theme';
import {lerp, rnd, clamp01, prog, KO, KS, es, FR, QU, Numero} from './base';
import {Pessoa, VOCE, Visual} from './personagens';
import {mundo} from './geo';

const SVG: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0, overflow: 'visible'}}>{children}</svg>;
const neve = (t: number, n = 120, vel = 90) => Array.from({length: n}, (_, i) => <circle key={'nv' + i} cx={(rnd(i) * 2000 + t * 30 * (0.5 + rnd(i + 2))) % 2000 - 40} cy={(rnd(i + 5) * 1080 + t * vel * (0.6 + rnd(i + 7))) % 1080} r={1.5 + rnd(i + 3) * 3.5} fill="#fff" opacity={0.75} />);
const VFRIO: Visual = {...VOCE, topo: {tipo: 'jaqueta', cor: '#3E5C76', cor2: '#2C4258'}, baixo: {tipo: 'calca', cor: '#2F3B52'}, pe: {tipo: 'bota', cor: '#2A2A2A'}, gorro: '#8C2F39'};

// ---------- Porta 5: Caçador (geada) | Araçuaí (asfalto tremendo) ----------
export const DuasCidades: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{clipPath: 'inset(0 50% 0 0)', background: 'linear-gradient(180deg,#9EB7CC 0%,#DCE8F1 60%,#F4F8FB 100%)'}}>
      <SVG>
        {Array.from({length: 8}, (_, i) => <path key={i} d={`M${i * 130 - 20},640 l50,-170 l50,170 Z`} fill="#3F5E5A" />)}
        <path d="M0,640 Q480,600 960,640 L960,1080 L0,1080 Z" fill="#E8F1F7" />
        {Array.from({length: 60}, (_, i) => <path key={i} d={`M${rnd(i) * 960},${660 + rnd(i + 3) * 400} l6,-14 l6,14`} stroke="#fff" strokeWidth={2} fill="none" opacity={0.8} />)}
        <g transform="translate(470,940) scale(1.15)"><Pessoa v={VFRIO} expr="frio" t={t} bE={[20, 100]} bD={[20, 100]} /></g>
        {Array.from({length: 18}, (_, i) => <circle key={'b' + i} cx={480 + Math.sin(t * 2 + i) * 20 + i * 4} cy={470 - ((t * 40 + i * 12) % 120)} r={10 + i % 3 * 4} fill="#fff" opacity={0.12} />)}
      </SVG>
    </AbsoluteFill>
    <AbsoluteFill style={{clipPath: 'inset(0 0 0 50%)', background: 'linear-gradient(180deg,#F6C66E 0%,#E7914F 55%,#6A3A22 100%)'}}>
      <SVG>
        <circle cx={1650} cy={200} r={90} fill="#FFF3C8" />
        {Array.from({length: 6}, (_, i) => <g key={i}><rect x={1000 + i * 160} y={420 + (i % 2) * 40} width={130} height={240 - (i % 2) * 40} fill={['#C9A27A', '#B88A64', '#D8B48A'][i % 3]} /><rect x={1020 + i * 160} y={460 + (i % 2) * 40} width={30} height={30} fill="#6A4A32" /></g>)}
        <rect x={960} y={660} width={960} height={420} fill="#3B3533" />
        {Array.from({length: 7}, (_, i) => <path key={i} d={`M${980 + i * 140 + Math.sin(t * 2.4 + i) * 12},${700} q20,-30 0,-60 q-20,-30 0,-60`} stroke="#FFE3B0" strokeWidth={3} fill="none" opacity={0.28} />)}
        <g transform="translate(1450,980) scale(1.15)"><Pessoa v={VOCE} expr="calor" t={t} suor={1} bE={[40, 120]} bD={[10, 10]} /></g>
      </SVG>
    </AbsoluteFill>
    <div style={{position: 'absolute', left: 958, top: 0, width: 4, height: 1080, background: 'rgba(0,0,0,0.5)'}} />
    <div style={{position: 'absolute', left: 90, top: 90}}><Numero cor={FR.azul} size={110} op={KO(lt, 0.1, 0.4)}>−14 °C</Numero><div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: '#22344A', marginTop: 8, opacity: KO(lt, 0.2, 0.5)}}>CAÇADOR (SC) · 1952</div></div>
    <div style={{position: 'absolute', right: 90, top: 90, textAlign: 'right'}}><Numero cor={QU.lava} size={110} op={KO(lt, 0.4, 0.7)}>+44,8 °C</Numero><div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: '#3A1A0C', marginTop: 8, opacity: KO(lt, 0.5, 0.8)}}>ARAÇUAÍ (MG) · 2023</div></div>
  </AbsoluteFill>
);

// ---------- Porta 6: Oymyakon ----------
export const Siberia: React.FC<{lt: number; t: number; modo: 'vila' | 'carro' | 'rosto' | 'escola'; timer?: number}> = ({lt, t, modo, timer}) => {
  const fumaca = (x: number, y: number, i: number) => <g key={'f' + i}>{Array.from({length: 8}, (_, j) => <circle key={j} cx={x + Math.sin(t + j) * 3} cy={y - j * 38 - ((t * 20) % 38)} r={14 + j * 5} fill="#E6EDF3" opacity={0.5 - j * 0.05} />)}</g>;
  if (modo === 'rosto') {
    const k = timer !== undefined ? timer : 0;
    return (
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#5F7D99,#C9D8E4)'}}>
        <SVG>
          {neve(t, 140, 120)}
          <g transform="translate(960,1640) scale(3.4)"><Pessoa v={{...VFRIO, gorro: '#5A4636'}} expr="frio" t={t} geada={1} semPernas /></g>
          {/* bochecha congelando */}
          <ellipse cx={960 - 22 * 3.4} cy={1640 + (-364 + 18) * 3.4} rx={30} ry={18} fill="#E8F6FF" opacity={0.25 + 0.6 * k} />
        </SVG>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#1C2B3E 0%,#5E7891 55%,#D6E2EC 55%,#F2F6F9 100%)'}}>
      <SVG>
        {/* morros */}
        <path d="M0,600 Q300,470 620,560 T1300,520 T1920,580 L1920,600 Z" fill="#8FA3B5" />
        {/* casas de madeira */}
        {[[120, 1], [420, 0.85], [760, 1.1], [1150, 0.9], [1500, 1.05]].map(([x, s], i) => <g key={i} transform={`translate(${x},${modo === 'escola' && i === 2 ? 640 : 610}) scale(${s})`}>
          <rect x={0} y={-130} width={230} height={130} fill={['#6A4A36', '#5C3F30', '#7A5640'][i % 3]} />
          <path d="M-20,-128 L115,-210 L250,-128 Z" fill="#E9F0F5" />
          <rect x={30} y={-100} width={46} height={46} fill={i % 2 ? '#FFD27A' : '#3A2A20'} />
          <rect x={140} y={-100} width={46} height={46} fill="#FFD27A" />
          <rect x={170} y={-230} width={24} height={60} fill="#4A3426" />
          {fumaca(182, -240, i)}
        </g>)}
        {modo === 'escola' && <g transform="translate(760,650)"><rect x={-30} y={-280} width={300} height={40} rx={6} fill="#B03A2E" /><text x={120} y={-250} textAnchor="middle" fill="#fff" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 30}}>ШКОЛА</text></g>}
        {/* carros ligados */}
        {(modo === 'carro' || modo === 'vila') && [[300, 800], [1150, 840]].map(([x, y], i) => <g key={'c' + i} transform={`translate(${x},${y}) scale(${modo === 'carro' ? 1.5 : 1})`}>
          <rect x={0} y={-60} width={260} height={60} rx={16} fill={i ? '#7A2E2E' : '#2E4A6E'} />
          <path d="M40,-60 L80,-110 L190,-110 L220,-60 Z" fill={i ? '#6A2828' : '#294260'} />
          <rect x={90} y={-102} width={50} height={36} fill="#BFD6E6" /><rect x={150} y={-102} width={50} height={36} fill="#BFD6E6" />
          <circle cx={60} cy={0} r={26} fill="#1A1A1A" /><circle cx={200} cy={0} r={26} fill="#1A1A1A" />
          <rect x={-6} y={-40} width={20} height={14} fill="#FFE9A8" opacity={0.9} />
          {Array.from({length: 7}, (_, j) => <circle key={j} cx={270 + j * 24 + (t * 30) % 24} cy={-14 - j * 6} r={10 + j * 4} fill="#EEF3F7" opacity={0.6 - j * 0.07} />)}
        </g>)}
        {modo === 'escola' && [0, 1, 2].map((i) => <g key={'k' + i} transform={`translate(${1320 + i * 120},900) scale(${0.62 + (i % 2) * 0.06})`}><Pessoa v={{...VFRIO, topo: {tipo: 'jaqueta', cor: ['#D1495B', '#2A9D8F', '#E9C46A'][i], cor2: '#333'}}} expr="sorriso" t={t + i} bE={[10, 8]} bD={[12, 8]} /></g>)}
        {neve(t, 90, 70)}
      </SVG>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(30,60,100,0.25), transparent 50%)'}} />
    </AbsoluteFill>
  );
};

// ---------- Porta 7: deserto (Vale da Morte / Lut / ovo no chão) ----------
export const Deserto: React.FC<{lt: number; t: number; modo: 'vale' | 'lut' | 'ovo'}> = ({lt, t, modo}) => {
  if (modo === 'lut') {
    // vista de satélite estilizada: cristas (kaluts) + mapa de calor
    const k = KS(lt, 0.3, 1.6);
    return (
      <AbsoluteFill style={{background: '#C9925E'}}>
        <SVG>
          {Array.from({length: 26}, (_, i) => <path key={i} d={`M${-100 + i * 80},${-50} C${i * 80 + 60},300 ${i * 80 - 40},700 ${i * 80 + 80},1150`} stroke="#8A5A36" strokeWidth={22 + rnd(i) * 18} fill="none" opacity={0.55} />)}
          {Array.from({length: 26}, (_, i) => <path key={'l' + i} d={`M${-90 + i * 80},${-50} C${i * 80 + 70},300 ${i * 80 - 30},700 ${i * 80 + 90},1150`} stroke="#E8C08A" strokeWidth={6} fill="none" opacity={0.6} />)}
          <defs><radialGradient id="calorLut"><stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} /><stop offset="25%" stopColor="#FFE14A" stopOpacity={0.75} /><stop offset="55%" stopColor="#FF5A1F" stopOpacity={0.6} /><stop offset="100%" stopColor="#7A0A3A" stopOpacity={0.35} /></radialGradient></defs>
          <rect width={1920} height={1080} fill="url(#calorLut)" opacity={k} style={{mixBlendMode: 'multiply'} as any} />
          <ellipse cx={980} cy={540} rx={420} ry={300} fill="#FFFFFF" opacity={0.18 * k} />
        </SVG>
        <div style={{position: 'absolute', right: 80, top: 80, padding: '10px 20px', borderRadius: 8, background: 'rgba(6,10,20,0.7)', fontFamily: F.rotulo, fontWeight: 700, fontSize: 18, letterSpacing: 3, color: '#D7DCE6'}}>MEDIÇÃO POR SATÉLITE · 2005</div>
      </AbsoluteFill>
    );
  }
  if (modo === 'ovo') {
    const coz = KS(lt, 0.2, 2.2);
    return (
      <AbsoluteFill style={{background: '#B9774A'}}>
        <SVG>
          {Array.from({length: 40}, (_, i) => <path key={i} d={`M${rnd(i) * 1920},${rnd(i + 4) * 1080} l${(rnd(i + 2) - 0.5) * 300},${(rnd(i + 6) - 0.5) * 200} l${(rnd(i + 3) - 0.5) * 200},${(rnd(i + 8) - 0.5) * 200}`} stroke="#7A4628" strokeWidth={6} fill="none" />)}
          <g transform="translate(960,560)">
            <path d="M-260,-20 C-280,-170 -80,-240 40,-200 C200,-180 300,-60 250,60 C200,190 -40,220 -160,160 C-260,110 -250,40 -260,-20 Z" fill="#FFFFFF" opacity={lerp(0.55, 1, coz)} />
            <path d="M-260,-20 C-280,-170 -80,-240 40,-200 C200,-180 300,-60 250,60" stroke="#E7C9A0" strokeWidth={10} fill="none" opacity={coz} />
            <circle cx={-10} cy={-10} r={92} fill="#FFB01F" />
            <circle cx={-30} cy={-34} r={24} fill="#FFE08A" opacity={0.7} />
            {Array.from({length: 7}, (_, i) => <path key={i} d={`M${-200 + i * 70},-230 q${Math.sin(t * 3 + i) * 14},-40 0,-80 q${-Math.sin(t * 3 + i) * 14},-40 0,-80`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.35 * coz} strokeLinecap="round" />)}
          </g>
        </SVG>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#F7D9A0 0%,#F0B26E 45%,#C9763E 100%)'}}>
      <SVG>
        <circle cx={1480} cy={170} r={100} fill="#FFF6D8" /><circle cx={1480} cy={170} r={240} fill="#FFE9B0" opacity={0.25} />
        <path d="M0,560 L200,420 L380,520 L620,380 L860,500 L1100,400 L1340,510 L1600,410 L1920,520 L1920,640 L0,640 Z" fill="#B0603A" opacity={0.85} />
        <rect y={630} width={1920} height={450} fill="#E2B27E" />
        {Array.from({length: 50}, (_, i) => <path key={i} d={`M${rnd(i) * 1920},${660 + rnd(i + 3) * 420} l${30 + rnd(i) * 60},${(rnd(i + 2) - 0.5) * 30} l${30 + rnd(i + 5) * 40},${(rnd(i + 7) - 0.5) * 30}`} stroke="#A97448" strokeWidth={3} fill="none" />)}
        {/* placa-termômetro de rua (estilo Furnace Creek) */}
        <g transform="translate(620,900)">
          <rect x={-18} y={-420} width={36} height={420} fill="#5A4A3A" />
          <rect x={-150} y={-520} width={300} height={200} rx={12} fill="#2A2420" stroke="#8A7A6A" strokeWidth={6} />
          <text x={0} y={-395} textAnchor="middle" fill="#FF6A2A" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 104}}>{(lerp(40, 56.7, KS(lt, 0.2, 1.8))).toFixed(1).replace('.', ',')}°</text>
          <text x={0} y={-340} textAnchor="middle" fill="#D7C9B8" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4}}>CELSIUS</text>
        </g>
        {Array.from({length: 12}, (_, i) => <path key={'h' + i} d={`M${i * 170 + Math.sin(t * 2 + i) * 15},${650} q20,-30 0,-60 q-20,-30 0,-60`} stroke="#FFF2D0" strokeWidth={3} fill="none" opacity={0.3} />)}
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- Porta 8: suor seco x úmido ----------
export const Suor: React.FC<{lt: number; t: number; foco?: 'seco' | 'umido' | 'ambos'}> = ({lt, t, foco = 'ambos'}) => {
  const lado = (x: number, umido: boolean) => (
    <g transform={`translate(${x},0)`}>
      <rect width={960} height={1080} fill={umido ? '#2A4A44' : '#C98C4E'} />
      {umido && Array.from({length: 40}, (_, i) => <circle key={i} cx={rnd(i) * 960} cy={rnd(i + 3) * 1080} r={30 + rnd(i + 5) * 60} fill="#9FC9BF" opacity={0.06} />)}
      {/* pele em close */}
      <path d="M0,620 Q480,560 960,620 L960,1080 L0,1080 Z" fill="#B9805C" />
      <path d="M0,640 Q480,580 960,640" stroke="#9A6646" strokeWidth={6} fill="none" opacity={0.5} />
      {Array.from({length: 9}, (_, i) => {
        const px = 80 + i * 100, ph = (t * 0.5 + rnd(i)) % 1;
        if (umido) return <path key={i} d={`M${px},${640 + ph * 360} q-14,26 0,36 q14,-10 0,-36 Z`} fill="#CFEFFF" opacity={0.9} />;
        return <g key={i}><path d={`M${px},${620} q-10,18 0,26 q10,-8 0,-26 Z`} fill="#CFEFFF" opacity={1 - ph} /><path d={`M${px},${600 - ph * 160} q${Math.sin(t * 3 + i) * 10},-20 0,-40`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.5 * (1 - ph)} /></g>;
      })}
    </g>
  );
  return (
    <AbsoluteFill>
      <SVG>
        {lado(0, false)}{lado(960, true)}
        <line x1={960} x2={960} y1={0} y2={1080} stroke="#000" strokeWidth={6} opacity={0.5} />
      </SVG>
      <div style={{position: 'absolute', left: 80, top: 90, opacity: foco === 'umido' ? 0.35 : 1}}><Numero cor={QU.fogo} size={84}>SECO</Numero><div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: '#FFF', marginTop: 6}}>O SUOR EVAPORA</div></div>
      <div style={{position: 'absolute', right: 80, top: 90, textAlign: 'right', opacity: foco === 'seco' ? 0.35 : 1}}><Numero cor="#3DDBB4" size={84}>ÚMIDO</Numero><div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: '#FFF', marginTop: 6}}>O SUOR ESCORRE</div></div>
    </AbsoluteFill>
  );
};

// ---------- Porta 8: o limite 35 → 31 ----------
export const Limite31: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const k = KS(lt, 0.8, 2.0);
  const v = lerp(35, 31, k);
  const a = lerp(-120, 120, (v - 20) / 20);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #14262A, #04070A 75%)'}}>
      <SVG>
        <g transform="translate(960,560)">
          <path d={`M${-380 * Math.sin(Math.PI * 2 / 3)},${380 * Math.cos(Math.PI * 2 / 3)} A380,380 0 1 1 ${380 * Math.sin(Math.PI * 2 / 3)},${380 * Math.cos(Math.PI * 2 / 3)}`} stroke="#22333A" strokeWidth={44} fill="none" />
          {[20, 25, 31, 35, 40].map((m) => { const aa = (lerp(-120, 120, (m - 20) / 20) * Math.PI) / 180; return <g key={m}><line x1={Math.sin(aa) * 330} y1={-Math.cos(aa) * 330} x2={Math.sin(aa) * 405} y2={-Math.cos(aa) * 405} stroke={m === 35 ? '#666' : m === 31 ? QU.lava : '#8A93A6'} strokeWidth={m === 31 || m === 35 ? 8 : 4} /><text x={Math.sin(aa) * (m === 31 ? 500 : 470)} y={-Math.cos(aa) * (m === 31 ? 500 : 470) + 14} textAnchor="middle" fill={m === 31 ? '#FF8A6A' : '#8A93A6'} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 42, textDecoration: m === 35 && k > 0.5 ? 'line-through' : 'none'}}>{m}</text></g>; })}
          <line x1={0} y1={0} x2={Math.sin((a * Math.PI) / 180) * 340} y2={-Math.cos((a * Math.PI) / 180) * 340} stroke="#fff" strokeWidth={12} strokeLinecap="round" />
          <circle r={30} fill="#fff" />
          <text y={250} textAnchor="middle" fill="#fff" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 120}}>{v.toFixed(0)} °C</text>
          <text y={305} textAnchor="middle" fill="#9FC9BF" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 5}}>CALOR ÚMIDO (BULBO ÚMIDO)</text>
        </g>
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- Porta 9: sauna ----------
export const Sauna: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: '#7A4A26'}}>
    <SVG>
      {Array.from({length: 24}, (_, i) => <rect key={i} x={0} y={i * 46} width={1920} height={44} fill={i % 2 ? '#9A6234' : '#8E5A2F'} />)}
      <rect x={0} y={640} width={1920} height={50} fill="#C08A52" /><rect x={0} y={690} width={1920} height={30} fill="#6A3E1E" />
      <rect x={0} y={860} width={1920} height={50} fill="#C08A52" /><rect x={0} y={910} width={1920} height={170} fill="#5A3418" />
      {/* pedras e balde */}
      <g transform="translate(1600,860)"><rect x={-110} y={-200} width={220} height={200} fill="#3A3A3A" />{Array.from({length: 9}, (_, i) => <ellipse key={i} cx={-80 + (i % 3) * 80} cy={-210 - Math.floor(i / 3) * 30} rx={44} ry={26} fill={['#6B6B6B', '#575757', '#7A7A7A'][i % 3]} />)}{Array.from({length: 6}, (_, i) => <path key={'v' + i} d={`M${-80 + i * 32},-300 q${Math.sin(t * 2 + i) * 18},-50 0,-100 q${-Math.sin(t * 2 + i) * 18},-50 0,-100`} stroke="#fff" strokeWidth={8} fill="none" opacity={0.25} strokeLinecap="round" />)}</g>
      {/* termômetro de sauna */}
      <g transform="translate(980,240)"><circle r={110} fill="#E9DCC6" stroke="#5A3418" strokeWidth={12} /><text y={20} textAnchor="middle" fill="#3A2210" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 70}}>90°</text><line x1={0} y1={0} x2={Math.sin(2.1) * 80} y2={-Math.cos(2.1) * 80} stroke="#B3261E" strokeWidth={6} /></g>
      {/* pessoas conversando */}
      <g transform="translate(420,690) scale(1.05)"><g transform="scale(1,0.86)"><Pessoa v={{...VOCE, topo: {tipo: 'camiseta', cor: '#F2F2F2', cor2: '#DDD'}, baixo: {tipo: 'bermuda', cor: '#F2F2F2'}}} expr="sorriso" t={t} suor={0.8} bE={[20, 60]} bD={[40, 90]} /></g></g>
      <g transform="translate(720,690) scale(1.0)"><g transform="scale(1,0.86)"><Pessoa v={{...VOCE, pele: '#E8C3A6', peleSombra: '#CFA88A', cabelo: {tipo: 'longo', cor: '#C99A5A', cor2: '#AD7F45'}, topo: {tipo: 'camiseta', cor: '#F2F2F2', cor2: '#DDD'}, baixo: {tipo: 'bermuda', cor: '#F2F2F2'}}} expr="sorriso" t={t + 1} suor={0.8} bE={[30, 100]} bD={[15, 20]} /></g></g>
    </SVG>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(255,200,120,0.18), transparent 60%)'}} />
  </AbsoluteFill>
);

// ---------- Porta 9: água a 60 °C ----------
export const Panela: React.FC<{lt: number; t: number; temp: number; seg: string}> = ({lt, t, temp, seg}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, #1C2430, #05070D 75%)'}}>
    <SVG>
      <g transform="translate(900,720)">
        <path d="M-380,-160 L380,-160 L340,200 L-340,200 Z" fill="#9AA6B2" />
        <rect x={-420} y={-180} width={840} height={30} rx={14} fill="#C9D2DA" />
        <path d="M-370,-140 L370,-140 L362,-80 L-362,-80 Z" fill="#5FA8E0" opacity={0.9} />
        {Array.from({length: 10}, (_, i) => <path key={i} d={`M${-320 + i * 70},-190 q${Math.sin(t * 2.5 + i) * 16},-50 0,-100 q${-Math.sin(t * 2.5 + i) * 16},-50 0,-100`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.25} strokeLinecap="round" />)}
        {/* mão descendo */}
        <g transform={`translate(80,${lerp(-520, -170, KS(lt, 0.3, 1.0))})`}><path d="M-46,-260 L-46,0 Q-46,40 -10,46 L30,46 Q60,40 60,0 L60,-260 Z" fill="#B9805C" />{[-30, -6, 18, 42].map((x) => <rect key={x} x={x - 9} y={20} width={18} height={60} rx={9} fill="#B9805C" />)}</g>
      </g>
    </SVG>
    <div style={{position: 'absolute', left: 1420, top: 300}}>
      <Numero cor={QU.lava} size={150}>{temp} °C</Numero>
      <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: '#C3CAD8', marginTop: 16}}>QUEIMADURA GRAVE EM</div>
      <Numero cor={QU.fogo} size={110} op={KO(lt, 1.0, 1.3)}>{seg}</Numero>
    </div>
  </AbsoluteFill>
);

// ---------- Porta 9: moléculas de ar x de água ----------
export const Moleculas: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const caixa = (x: number, n: number, cor: string, vel: number) => (
    <g transform={`translate(${x},240)`}>
      <rect width={700} height={560} rx={24} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
      {Array.from({length: n}, (_, i) => {
        const px = 30 + ((rnd(i) * 640 + t * vel * (rnd(i + 3) - 0.5) * 400) % 640 + 640) % 640;
        const py = 30 + ((rnd(i + 9) * 500 + t * vel * (rnd(i + 5) - 0.5) * 400) % 500 + 500) % 500;
        return <circle key={i} cx={px} cy={py} r={n > 100 ? 13 : 15} fill={cor} opacity={0.9} />;
      })}
      <rect x={0} y={560} width={700} height={40} rx={8} fill="#B9805C" />
      <text x={350} y={655} textAnchor="middle" fill="#C3CAD8" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 4}}>SUA PELE</text>
    </g>
  );
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #121A2C, #05070D 75%)'}}>
      <SVG>{caixa(180, 14, '#FFB547', 1)}{caixa(1040, 190, '#5FA8E0', 0.25)}</SVG>
      <div style={{position: 'absolute', left: 180, width: 700, top: 150, textAlign: 'center'}}><Numero cor={QU.fogo} size={70}>AR · 90 °C</Numero></div>
      <div style={{position: 'absolute', left: 1040, width: 700, top: 150, textAlign: 'center'}}><Numero cor={FR.azul} size={70}>ÁGUA · 60 °C</Numero></div>
    </AbsoluteFill>
  );
};

// ---------- Porta 9: gravura / documento da Royal Society ----------
export const Documento: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: '#2A1E14'}}>
    <div style={{position: 'absolute', left: 560, top: 70, width: 800, height: 960, background: 'linear-gradient(180deg,#EFE3C8,#E2D2AE)', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', transform: `rotate(${lerp(-2.5, -1.5, lt / 4)}deg)`, padding: '70px 80px', boxSizing: 'border-box', fontFamily: 'Georgia, serif', color: '#3A2A18'}}>
      <div style={{textAlign: 'center', fontSize: 30, letterSpacing: 6}}>PHILOSOPHICAL TRANSACTIONS</div>
      <div style={{textAlign: 'center', fontSize: 18, letterSpacing: 4, marginTop: 8}}>OF THE ROYAL SOCIETY OF LONDON · 1775</div>
      <div style={{height: 2, background: '#3A2A18', margin: '26px 0'}} />
      <div style={{textAlign: 'center', fontSize: 38, fontStyle: 'italic', lineHeight: 1.3}}>Experiments and Observations<br />in an Heated Room</div>
      <div style={{textAlign: 'center', fontSize: 22, marginTop: 14}}>By CHARLES BLAGDEN, M.D.</div>
      {Array.from({length: 14}, (_, i) => <div key={i} style={{height: 12, background: 'rgba(58,42,24,0.28)', marginTop: 20, width: `${88 - (i % 4) * 9}%`, borderRadius: 3}} />)}
    </div>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.7) 100%)'}} />
  </AbsoluteFill>
);

// ---------- Porta 10: lava ----------
export const Lava: React.FC<{lt: number; t: number; modo: 'rio' | 'mito'}> = ({lt, t, modo}) => {
  const vLava: Visual = {...VOCE, topo: {tipo: 'jaqueta', cor: '#C9CED4', cor2: '#9EA6AE'}, baixo: {tipo: 'calca', cor: '#C9CED4'}, pe: {tipo: 'bota', cor: '#8A9096'}, gorro: '#C9CED4'};
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#140606 0%,#3A0F06 50%,#1A0703 100%)'}}>
      <SVG>
        <defs>
          <linearGradient id="lavaG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#FFD24A" /><stop offset="50%" stopColor="#FF6A1F" /><stop offset="100%" stopColor="#C21E0A" /></linearGradient>
          <filter id="lavaT"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves={3} seed={Math.floor(t * 3) % 30} /><feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.04  0 0 0 0 0.02  0 0 0 1.2 -0.45" /></filter>
        </defs>
        <path d="M0,520 Q480,420 960,500 T1920,460 L1920,1080 L0,1080 Z" fill="#1E0A06" />
        <path d={`M-50,${640 + Math.sin(t) * 6} C400,560 700,760 1100,680 S1700,620 1980,700 L1980,940 C1600,880 1300,980 900,930 S300,880 -50,960 Z`} fill="url(#lavaG)" />
        <path d={`M-50,${640 + Math.sin(t) * 6} C400,560 700,760 1100,680 S1700,620 1980,700 L1980,940 C1600,880 1300,980 900,930 S300,880 -50,960 Z`} filter="url(#lavaT)" />
        <path d={`M-50,${640 + Math.sin(t) * 6} C400,560 700,760 1100,680 S1700,620 1980,700 L1980,940 C1600,880 1300,980 900,930 S300,880 -50,960 Z`} fill="#FF8A2A" opacity={0.15 + 0.1 * Math.sin(t * 4)} filter="url(#bl20l)" />
        <defs><filter id="bl20l"><feGaussianBlur stdDeviation="20" /></filter></defs>
        {Array.from({length: 40}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={900 - ((t * 60 * (0.4 + rnd(i + 2)) + rnd(i + 5) * 600) % 600)} r={2 + rnd(i + 3) * 3} fill="#FFB547" opacity={0.8} />)}
        {modo === 'rio' && <g transform="translate(1560,600) scale(0.95)"><ellipse cx={0} cy={0} rx={80} ry={12} fill="rgba(0,0,0,0.5)" /><Pessoa v={vLava} expr="neutro" t={t} bE={[20, 50]} bD={[40, 90]} luzQuente={1} /></g>}
        {modo === 'mito' && <g transform={`translate(960,${lerp(560, 790, KS(lt, 0.2, 1.4))})`}>
          {/* uma rocha do tamanho de uma pessoa boiando, não afunda */}
          <path d="M-140,0 C-150,-60 -60,-90 0,-80 C80,-90 150,-50 140,0 C120,30 -110,30 -140,0 Z" fill="#3A2A26" />
          <path d="M-140,0 C-110,20 110,20 140,0" stroke="#FFB547" strokeWidth={6} fill="none" opacity={0.8} />
        </g>}
      </SVG>
      {modo === 'mito' && <div style={{position: 'absolute', left: 960, top: 420, transform: 'translateX(-50%)', textAlign: 'center', opacity: KO(lt, 1.5, 1.9)}}><div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: '#FFD9B0'}}>LAVA ≈ 3× MAIS DENSA QUE O CORPO</div></div>}
    </AbsoluteFill>
  );
};

// ---------- Porta 11: Antártida (estação Vostok / mapa) ----------
export const Antartida: React.FC<{lt: number; t: number; modo: 'estacao' | 'mapa' | 'respiracao'}> = ({lt, t, modo}) => {
  if (modo === 'mapa') {
    const proj = geoOrthographic().rotate([-100, 90]).scale(lerp(470, 520, es(lt / 4))).translate([960, 560]).clipAngle(90);
    const path = geoPath(proj);
    const [vx, vy] = proj([106.8, -78.46]) as [number, number];
    const [px, py] = proj([60, -81.5]) as [number, number];
    return (
      <AbsoluteFill style={{background: '#030810'}}>
        <SVG>
          <circle cx={960} cy={560} r={lerp(470, 520, es(lt / 4))} fill="#0E2A48" />
          <path d={path(geoGraticule().step([30, 15])()) || ''} fill="none" stroke="#fff" strokeOpacity={0.06} />
          {mundo.map((f: any, i: number) => <path key={i} d={path(f) || ''} fill={f.id === '010' ? '#EAF3FA' : '#5E7A55'} stroke="#9FC4E0" strokeOpacity={0.3} strokeWidth={0.8} />)}
          <circle cx={vx} cy={vy} r={12} fill={FR.azul} stroke="#fff" strokeWidth={3} />
          <circle cx={px} cy={py} r={70} fill="#5FA8E0" opacity={0.25 + 0.15 * Math.sin(t * 3)} />
          <circle cx={px} cy={py} r={10} fill="#123A5C" stroke="#fff" strokeWidth={3} opacity={KO(lt, 1.0, 1.4)} />
        </SVG>
        <div style={{position: 'absolute', left: vx + 28, top: vy - 30, padding: '8px 16px', borderRadius: 8, background: 'rgba(6,10,20,0.85)', borderLeft: `4px solid ${FR.azul}`, fontFamily: F.titulo, fontWeight: 700, fontSize: 40, color: '#fff'}}>VOSTOK · −89,2 °C <span style={{fontFamily: F.rotulo, fontSize: 16, letterSpacing: 3, color: '#AEB6C6'}}>AR</span></div>
        <div style={{position: 'absolute', left: px - 28, top: py + 40, transform: 'translateX(-100%)', padding: '8px 16px', borderRadius: 8, background: 'rgba(6,10,20,0.85)', borderLeft: `4px solid ${FR.gelo}`, fontFamily: F.titulo, fontWeight: 700, fontSize: 40, color: '#fff', opacity: KO(lt, 1.0, 1.4)}}>−98 °C <span style={{fontFamily: F.rotulo, fontSize: 16, letterSpacing: 3, color: '#AEB6C6'}}>SUPERFÍCIE (SATÉLITE)</span></div>
      </AbsoluteFill>
    );
  }
  if (modo === 'respiracao') {
    return (
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#081322,#14304E)'}}>
        <SVG>
          {Array.from({length: 120}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 3) * 600} r={0.8 + rnd(i + 2) * 1.6} fill="#fff" opacity={0.6} />)}
          <g transform="translate(700,1600) scale(3.2)"><Pessoa v={{...VFRIO, gorro: '#3A3A3A'}} expr="frio" t={t} geada={1} semPernas /></g>
          {/* respiração vira cristais */}
          {Array.from({length: 40}, (_, i) => { const k = ((t * 0.5 + rnd(i)) % 1); const x = 820 + k * 600 + Math.sin(i + t) * 40 * k; const y = 1600 - 334 * 3.2 + (rnd(i + 4) - 0.5) * 200 * k; return <g key={i} opacity={1 - k}><path d={`M${x - 8},${y} L${x + 8},${y} M${x},${y - 8} L${x},${y + 8} M${x - 6},${y - 6} L${x + 6},${y + 6} M${x - 6},${y + 6} L${x + 6},${y - 6}`} stroke="#E8F6FF" strokeWidth={2.5} /></g>; })}
        </SVG>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#040A16 0%,#0E2238 55%,#C8D8E6 55%,#E9F1F7 100%)'}}>
      <SVG>
        {Array.from({length: 200}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 3) * 560} r={0.7 + rnd(i + 2) * 1.8} fill="#fff" opacity={0.4 + rnd(i + 8) * 0.6} />)}
        <path d={`M0,${200 + Math.sin(t * 0.4) * 20} C600,80 1100,300 1920,140 L1920,300 C1200,420 600,240 0,330 Z`} fill="#3DDBB4" opacity={0.14} />
        {/* estação */}
        <g transform="translate(720,600)">
          <rect x={0} y={-90} width={420} height={90} fill="#C64A2E" /><rect x={460} y={-70} width={220} height={70} fill="#2F5E8C" />
          {Array.from({length: 6}, (_, i) => <rect key={i} x={30 + i * 64} y={-66} width={36} height={26} fill="#FFD98A" />)}
          <line x1={760} y1={0} x2={760} y2={-300} stroke="#AAB" strokeWidth={6} /><circle cx={760} cy={-310} r={14} fill="#E8EEF3" />
          <rect x={-200} y={-30} width={120} height={30} fill="#7A8794" />
        </g>
        {Array.from({length: 40}, (_, i) => <path key={i} d={`M${(rnd(i) * 2400 - t * 300 * (0.6 + rnd(i))) % 2400 + 2400 * (((rnd(i) * 2400 - t * 300 * (0.6 + rnd(i))) % 2400) < 0 ? 1 : 0) - 200},${560 + rnd(i + 3) * 500} l120,-6`} stroke="#fff" strokeWidth={2} opacity={0.4} />)}
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- CTA: botão de inscrição discreto sobre o corredor ----------
export const BotaoInscrever: React.FC<{lt: number}> = ({lt}) => {
  const k = KO(lt, 0.3, 0.8), clique = lt > 1.6;
  return (
    <div style={{position: 'absolute', right: 90, bottom: 90, opacity: k, transform: `scale(${clique && lt < 1.8 ? 0.94 : 1})`, display: 'flex', alignItems: 'center', gap: 16, padding: '16px 28px', borderRadius: 40, background: clique ? '#3A3F4A' : '#E62117', boxShadow: '0 12px 30px rgba(0,0,0,0.5)'}}>
      <div style={{width: 40, height: 28, borderRadius: 8, background: '#fff', position: 'relative'}}><div style={{position: 'absolute', left: 15, top: 7, width: 0, height: 0, borderLeft: '13px solid ' + (clique ? '#3A3F4A' : '#E62117'), borderTop: '7px solid transparent', borderBottom: '7px solid transparent'}} /></div>
      <span style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: '#fff'}}>{clique ? 'INSCRITO' : 'INSCREVER-SE'}</span>
    </div>
  );
};
