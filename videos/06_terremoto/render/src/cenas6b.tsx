/* Vídeo 6 — cenas dos 4 andares e do fecho */
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {geoOrthographic, geoPath, geoGraticule} from 'd3-geo';
import {F} from './theme';
import {lerp, rnd, clamp01, prog, KO, KS, es, tremor, Numero} from './base';
import {Pessoa, VOCE, CIENTISTA2, Visual} from './personagens';
import {mundo} from './geo';
import {COR, MapaAS, Pulso, Rotulo, corMag} from './cenas6';

const SVG: React.FC<{children: React.ReactNode}> = ({children}) => <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0, overflow: 'visible'}}>{children}</svg>;
const Legenda: React.FC<{x: number; y: number; txt: string; op?: number; cor?: string; size?: number}> = ({x, y, txt, op = 1, cor = COR.ouro, size = 40}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: op, transform: 'translate(-50%,-50%)', padding: '8px 18px', borderRadius: 9, background: 'rgba(6,10,20,0.86)', borderLeft: `4px solid ${cor}`, fontFamily: F.titulo, fontWeight: 700, fontSize: size, color: '#fff', whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.5)'}}>{txt}</div>
);
const MORADOR = (pele: string, camisa: string, cabelo: 'curto' | 'longo' | 'cacheado' | 'grisalho' = 'curto'): Visual => ({...VOCE, pele, peleSombra: pele, cabelo: {tipo: cabelo, cor: cabelo === 'grisalho' ? '#8A8580' : '#1E1612', cor2: '#B9B4AE'}, topo: {tipo: 'camiseta', cor: camisa, cor2: camisa}, baixo: {tipo: 'calca', cor: '#3A3F4A'}, pe: {tipo: 'chinelo', cor: '#E9C46A'}});

// ===================== mapa do Brasil com os pontinhos dos tremores =====================
const PONTOS = Array.from({length: 220}, (_, i) => {
  const g = rnd(i * 3 + 1);
  // concentrações: Nordeste, Minas/Goiás, Centro-Oeste, Acre (profundos)
  const c = g < 0.42 ? [-37.5, -6.5, 3.2, 2.6] : g < 0.66 ? [-44.5, -17, 3.5, 3.5] : g < 0.82 ? [-52, -13, 5, 4] : g < 0.9 ? [-71, -8.5, 1.5, 1.2] : [-50, -22, 4, 3];
  return {lon: c[0] + (rnd(i + 7) - 0.5) * 2 * c[2], lat: c[1] + (rnd(i + 11) - 0.5) * 2 * c[3], t: rnd(i + 19)};
});
export const MapaPontos: React.FC<{lt: number; d: number; t: number; foco?: 'brasil' | 'nordeste'; marca?: 'divisa' | 'bahia'}> = ({lt, d, t, foco = 'brasil', marca}) => {
  const nd = foco === 'nordeste';
  return (
    <MapaAS lt={lt} d={d} lonC={nd ? -39 : -53} latC={nd ? -8 : -14} s0={nd ? 70 : 26} s1={nd ? 72 : 26.6} escuro={0.62}
      children={(P) => <g>
        {PONTOS.map((p, i) => { const [x, y] = P(p.lon, p.lat); const k = KO(lt, 0.2 + p.t * Math.min(2.5, d * 0.6), 0.5 + p.t * Math.min(2.5, d * 0.6)); return <circle key={i} cx={x} cy={y} r={nd ? 7 : 4.5} fill={COR.ouro} opacity={0.85 * k} />; })}
        {marca === 'divisa' && [[-36.5, -6.26], [-36.25, -6.2], [-36.0, -6.3]].map(([lo, la], i) => <Pulso key={i} p={P(lo, la)} t={t + i * 0.3} cor={COR.perigo} op={KO(lt, 0.4 + i * 0.6, 0.7 + i * 0.6)} r={9} />)}
        {marca === 'bahia' && <Pulso p={P(-39.45, -13.47)} t={t} cor={COR.perigo} op={KO(lt, 0.4, 0.8)} r={10} />}
      </g>}
      html={(P) => <>
        {marca === 'divisa' && <Rotulo x={P(-36.25, -6.2)[0]} y={P(-36.25, -6.2)[1] - 60} txt="CURRAIS NOVOS (RN) · 1,7" lado={1} cor={COR.perigo} op={KO(lt, 1.6, 2.0)} />}
        {marca === 'bahia' && <Rotulo x={P(-39.45, -13.47)[0]} y={P(-39.45, -13.47)[1]} txt="BAHIA · 2,0" lado={1} cor={COR.perigo} op={KO(lt, 0.6, 1.0)} />}
      </>} />
  );
};

// ===================== estação sismográfica no meio do mato =====================
export const Estacao: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg,#9CC3E6 0%,#D9E8D0 60%)'}}>
    <SVG>
      {Array.from({length: 14}, (_, i) => <ellipse key={i} cx={i * 150 + rnd(i) * 60} cy={560} rx={110} ry={90} fill={['#4E7A3A', '#3E6A2E', '#5A8A44'][i % 3]} />)}
      <rect y={600} width={1920} height={480} fill="#8C6A44" />
      <rect y={600} width={1920} height={60} fill="#6A8A3A" />
      {Array.from({length: 40}, (_, i) => <path key={i} d={`M${rnd(i) * 1920},${640} l-6,-30 l8,30 l6,-26 l4,26`} stroke="#4E7A3A" strokeWidth={3} fill="none" />)}
      {/* caixa da estação + painel solar */}
      <g transform="translate(760,600)"><rect x={-90} y={-130} width={180} height={130} fill="#C9CED4" /><rect x={-20} y={-70} width={40} height={70} fill="#7A8494" /><rect x={-140} y={-230} width={160} height={90} fill="#2A4A8A" stroke="#7FA0D8" strokeWidth={3} transform="rotate(-18 -60 -185)" /><line x1={60} y1={-130} x2={60} y2={-260} stroke="#555" strokeWidth={6} /><circle cx={60} cy={-268} r={10} fill="#C0392B" opacity={0.5 + 0.5 * Math.sin(t * 4)} /></g>
      {/* corte do solo: cabo até o sensor enterrado */}
      <path d="M760,600 C760,720 900,760 980,820" stroke="#222" strokeWidth={6} fill="none" />
      <rect x={950} y={800} width={90} height={70} rx={8} fill="#5A6476" stroke="#AEB6C2" strokeWidth={3} />
      {[0, 1, 2].map((i) => { const k = ((t * 0.6 + i / 3) % 1); return <ellipse key={i} cx={995} cy={835} rx={60 + k * 300} ry={20 + k * 90} fill="none" stroke="#FFE08A" strokeWidth={3} opacity={(1 - k) * 0.7} />; })}
    </SVG>
  </AbsoluteFill>
);

// ===================== corte da crosta do Nordeste =====================
export const CrostaNE: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const k = KS(lt, 0.3, 2.0), pul = 0.6 + 0.4 * Math.sin(t * 3);
  const espess = (x: number) => x > 900 ? lerp(320, 220, clamp01((x - 900) / 500)) : 320;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#9CC3E6 0%,#9CC3E6 30%,#3A2A1C 30%)'}}>
      <SVG>
        <path d="M0,320 L1920,320 L1920,340 L0,340 Z" fill="#6A8A3A" />
        <path d={`M0,340 ${Array.from({length: 49}, (_, i) => `L${i * 40},${340 + espess(i * 40)}`).join(' ')} L1920,1080 L0,1080 Z`} fill="#8C6A44" />
        <path d={`M0,${340 + 320} ${Array.from({length: 49}, (_, i) => `L${i * 40},${340 + espess(i * 40)}`).join(' ')} L1920,1080 L0,1080 Z`} fill="#A0461E" opacity={0.85} />
        {/* falhas antigas */}
        {[[1100, 0.2], [1280, -0.25], [1450, 0.15], [1620, -0.2]].map(([x, a], i) => <path key={i} d={`M${x},350 l${(a as number) * 400},${espess(x as number) - 20}`} stroke="#FFB547" strokeWidth={5} opacity={k * pul} />)}
        {/* setas de pressão dentro da placa */}
        {[1, -1].map((s) => <g key={s} opacity={k}><path d={`M${s > 0 ? 80 : 1840},500 l${s * 160},0`} stroke="#fff" strokeWidth={10} /><path d={`M${s > 0 ? 250 : 1670},500 l${-s * 30},-22 l0,44 Z`} fill="#fff" /></g>)}
      </SVG>
      <Legenda x={1400} y={250} txt="CROSTA MAIS FINA · 30–35 KM" op={KO(lt, 0.6, 1.0)} />
    </AbsoluteFill>
  );
};

// ===================== energia: um 3 contra um 6 =====================
export const EnergiaEsferas: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const k = KS(lt, 0.4, 2.6);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 60% 60%, #2A0E14, #06070D 70%)'}}>
      <SVG>
        <circle cx={360} cy={620} r={14} fill={corMag(3)} /><text x={360} y={570} textAnchor="middle" fill="#fff" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 52}}>3</text>
        <circle cx={1180} cy={620} r={lerp(14, 442, k)} fill={corMag(6)} opacity={0.9} />
        <text x={1180} y={640} textAnchor="middle" fill="#fff" opacity={k} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 120}}>6</text>
      </SVG>
      <Legenda x={1180} y={140} txt="≈ 30.000 × MAIS ENERGIA" op={KO(lt, 2.2, 2.6)} cor={COR.perigo} size={52} />
    </AbsoluteFill>
  );
};

// ===================== magnitude x intensidade =====================
export const MagIntens: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: '#0A0F1A'}}>
    <SVG>
      <rect x={0} y={0} width={958} height={1080} fill="#2A1E16" /><rect x={0} y={0} width={958} height={330} fill="#7FA8C8" />
      <rect x={0} y={330} width={958} height={30} fill="#6A8A3A" />
      <g transform="translate(480,820)"><circle r={18 + 6 * Math.sin(t * 6)} fill="#FFE08A" /><circle r={60} fill="#FFB547" opacity={0.2} />{[0, 1, 2].map((i) => { const k = ((t * 0.7 + i / 3) % 1); return <circle key={i} r={40 + k * 420} fill="none" stroke="#FFB547" strokeWidth={4} opacity={(1 - k) * 0.6} />; })}</g>
      <rect x={962} y={0} width={958} height={1080} fill="#2C3446" />
      <rect x={962} y={760} width={958} height={320} fill="#2A2420" /><rect x={1140} y={720} width={600} height={30} rx={6} fill="#7A5A3C" />
      <g transform={`translate(${1440 + Math.sin(t * 20) * 3},720)`}><path d="M-34,-130 L34,-130 L28,0 L-28,0 Z" fill="rgba(220,235,250,0.25)" stroke="rgba(230,240,255,0.8)" strokeWidth={3} /><rect x={-31} y={-90} width={62} height={88} fill="#6FB4E8" opacity={0.6} /></g>
      <line x1={960} x2={960} y1={0} y2={1080} stroke="#000" strokeWidth={6} />
    </SVG>
    <Legenda x={480} y={160} txt="MAGNITUDE · NA ORIGEM" op={KO(lt, 0.3, 0.7)} cor={COR.perigo} />
    <Legenda x={1440} y={160} txt="INTENSIDADE · NA SUA CASA" op={KO(lt, 1.2, 1.6)} cor={COR.calmo} />
  </AbsoluteFill>
);

// ===================== rua: caminhão passando (vista da janela) =====================
export const Caminhao: React.FC<{lt: number; t: number; d: number}> = ({lt, t, d}) => {
  const x = lerp(-700, 2200, lt / d);
  const tr = tremor(t, 0.12 * clamp01(1 - Math.abs(x - 900) / 900), 3);
  return (
    <AbsoluteFill style={{background: '#0E1424'}}>
      <SVG>
        <rect width={1920} height={1080} fill="#1A2236" />
        <rect y={760} width={1920} height={320} fill="#2A2A30" />
        {Array.from({length: 8}, (_, i) => <rect key={i} x={i * 260 + 40} y={900} width={140} height={12} fill="#E8D27A" opacity={0.7} />)}
        {Array.from({length: 10}, (_, i) => <g key={'c' + i}><rect x={i * 200} y={300 + (i % 3) * 50} width={180} height={460 - (i % 3) * 50} fill="#141B2C" />{Array.from({length: 10}, (_, j) => rnd(i * 13 + j) > 0.5 && <rect key={j} x={i * 200 + 20 + (j % 3) * 50} y={330 + (i % 3) * 50 + Math.floor(j / 3) * 60} width={26} height={30} fill="#FFD98A" opacity={0.6} />)}</g>)}
        <g transform={`translate(${x},860)`}>
          <rect x={0} y={-220} width={480} height={200} rx={10} fill="#C9CED4" /><rect x={490} y={-170} width={160} height={150} rx={14} fill="#C0392B" /><rect x={540} y={-150} width={80} height={60} fill="#9FC4E8" />
          {[80, 200, 420, 580].map((c) => <circle key={c} cx={c} cy={0} r={34} fill="#111" />)}
          <circle cx={640} cy={-50} r={10} fill="#FFE9B8" />
        </g>
      </SVG>
      {/* moldura da janela que vibra */}
      <AbsoluteFill style={{transform: `translate(${tr.x}px,${tr.y}px)`}}>
        <SVG><rect x={-20} y={-20} width={1960} height={1120} fill="none" stroke="#3A4256" strokeWidth={180} /><line x1={960} x2={960} y1={0} y2={1080} stroke="#3A4256" strokeWidth={30} /><rect x={-20} y={1000} width={1960} height={100} fill="#4A3A2C" /></SVG>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===================== povoado no sertão mineiro (Caraíbas) =====================
export const Povoado: React.FC<{lt: number; t: number; modo: 'calmo' | 'treme' | 'desaba'}> = ({lt, t, modo}) => {
  const k = modo === 'treme' ? 0.5 : modo === 'desaba' ? 0.7 : 0;
  const tr = tremor(t, k, 9);
  const cai = modo === 'desaba' ? KS(lt, 0.6, 2.4) : 0;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#F0B97A 0%,#F6D7A6 50%,#C9A06A 50%,#A87C48 100%)'}}>
      <SVG>
        <circle cx={1500} cy={300} r={80} fill="#FFF0C8" opacity={0.9} />
        {Array.from({length: 12}, (_, i) => <g key={i} transform={`translate(${i * 170 + 40},540)`}><path d="M0,0 l-4,-60 m4,30 l20,-40 m-24,20 l-24,-30" stroke="#6A5236" strokeWidth={5} /><ellipse cx={0} cy={-70} rx={36} ry={18} fill="#8A9A5A" opacity={0.7} /></g>)}
        <g transform={`translate(${tr.x},${tr.y})`}>
          {[[300, 0], [760, 1], [1260, 2]].map(([x, i]) => {
            const alvo = i === 1 && modo === 'desaba';
            return <g key={i} transform={`translate(${x},860)`}>
              <g style={{transform: alvo ? `translateY(${cai * 120}px) scaleY(${1 - cai * 0.7})` : undefined, transformOrigin: '0px 0px'}} opacity={alvo ? 1 - cai * 0.6 : 1}>
                <rect x={-150} y={-220} width={300} height={220} fill="#C8925A" />
                {Array.from({length: 7}, (_, r) => Array.from({length: 6}, (_, c) => <rect key={`${r}${c}`} x={-150 + c * 50 + (r % 2) * 25} y={-220 + r * 31} width={46} height={28} fill="none" stroke="#A8743E" strokeWidth={2} />))}
                <path d="M-180,-215 L0,-300 L180,-215 Z" fill="#9A4A2A" />
                <rect x={-30} y={-110} width={60} height={110} fill="#5A3A22" /><rect x={-120} y={-160} width={50} height={46} fill="#5A3A22" />
              </g>
              {alvo && cai > 0 && Array.from({length: 18}, (_, j) => <circle key={j} cx={(rnd(j) - 0.5) * 360} cy={-40 - rnd(j + 4) * 200 * cai} r={30 + rnd(j + 2) * 50} fill="#D8B88A" opacity={0.55 * cai} />)}
            </g>;
          })}
        </g>
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== parede de adobe x parede amarrada =====================
export const ParedeAdobe: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: '#14100C'}}>
    <SVG>
      {[0, 1].map((lado) => <g key={lado} transform={`translate(${lado ? 1140 : 180},180)`}>
        {Array.from({length: 12}, (_, r) => Array.from({length: 6}, (_, c) => <rect key={`${r}${c}`} x={c * 100 + (r % 2) * 50 - (r % 2 ? 50 : 0)} y={r * 56} width={96} height={52} fill={lado ? '#B5653A' : '#C8925A'} stroke={lado ? '#8A4A2A' : '#A8743E'} strokeWidth={2} />))}
        {lado === 1 && <><rect x={-20} y={-10} width={40} height={690} fill="#9AA0A6" /><rect x={580} y={-10} width={40} height={690} fill="#9AA0A6" /><rect x={-20} y={-30} width={640} height={40} fill="#9AA0A6" /><rect x={-20} y={300} width={640} height={30} fill="#9AA0A6" />{[0, 1, 2, 3].map((i) => <line key={i} x1={-8 + i * 6} x2={-8 + i * 6} y1={-10} y2={680} stroke="#5A5F66" strokeWidth={2} />)}</>}
      </g>)}
    </SVG>
    <Legenda x={480} y={110} txt="ADOBE · BARRO CRU, SEM AMARRAÇÃO" op={KO(lt, 0.3, 0.7)} cor={COR.perigo} size={34} />
    <Legenda x={1440} y={110} txt="COM VIGAS E PILARES" op={KO(lt, 1.0, 1.4)} cor={COR.calmo} size={34} />
  </AbsoluteFill>
);

// ===================== João Câmara, 1986 =====================
export const JoaoCamara: React.FC<{lt: number; t: number; modo: 'noite' | 'falha' | 'dano' | 'manha'}> = ({lt, t, modo}) => {
  if (modo === 'falha') {
    const pul = 0.6 + 0.4 * Math.sin(t * 3);
    return (
      <AbsoluteFill style={{background: '#06080F'}}>
        <SVG>
          <rect y={0} width={1920} height={300} fill="#0E1730" />
          {Array.from({length: 14}, (_, i) => <g key={i}><rect x={i * 140 + 20} y={230} width={110} height={70} fill="#2A2A34" /><rect x={i * 140 + 40} y={250} width={20} height={20} fill="#FFD98A" opacity={0.4} /></g>)}
          <rect y={300} width={1920} height={780} fill="#5A3E28" />
          {Array.from({length: 10}, (_, i) => <line key={i} x1={0} x2={1920} y1={360 + i * 70} y2={350 + i * 70 + Math.sin(i) * 20} stroke="#4A3220" strokeWidth={3} />)}
          <path d="M520,1080 L760,700 L900,520 L1000,360" stroke="#FF8A2A" strokeWidth={12} opacity={pul} />
          <path d="M520,1080 L760,700 L900,520 L1000,360" stroke="#FFE08A" strokeWidth={3} />
        </SVG>
        <Legenda x={1300} y={640} txt="FALHA DE SAMAMBAIA" op={KO(lt, 0.8, 1.2)} />
      </AbsoluteFill>
    );
  }
  const noite = modo !== 'manha';
  return (
    <AbsoluteFill style={{background: noite ? 'linear-gradient(180deg,#081022,#1A2442)' : 'linear-gradient(180deg,#F6C88A,#BFD8EC)'}}>
      <SVG>
        {noite && Array.from({length: 120}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 3) * 400} r={1 + rnd(i + 2) * 1.5} fill="#fff" opacity={0.6} />)}
        <rect y={760} width={1920} height={320} fill={noite ? '#3A3428' : '#C9A87A'} />
        {Array.from({length: 7}, (_, i) => { const x = i * 290 - 40; const rach = modo === 'dano'; return <g key={i}>
          <rect x={x} y={500} width={260} height={260} fill={['#E8D2B0', '#D8B890', '#E0C8A8', '#CFA67A'][i % 4]} opacity={noite ? 0.75 : 1} />
          <path d={`M${x - 15},505 L${x + 130},430 L${x + 275},505 Z`} fill="#9A4A2A" />
          <rect x={x + 100} y={640} width={60} height={120} fill="#5A3A22" />
          <rect x={x + 30} y={560} width={50} height={46} fill={noite ? '#FFD98A' : '#5A3A22'} opacity={noite ? 0.75 : 1} />
          {rach && <path d={`M${x + 200},500 l-30,60 l20,40 l-40,70 l10,90`} stroke="#3A2A1C" strokeWidth={5} fill="none" />}
          {rach && i % 2 === 0 && Array.from({length: 6}, (_, j) => <rect key={j} x={x + 20 + j * 40} y={756} width={30} height={8} fill="#9A4A2A" transform={`rotate(${rnd(j + i) * 40 - 20} ${x + 35 + j * 40} 760)`} />)}
        </g>; })}
        {(modo === 'dano' || modo === 'manha') && <g>
          {/* colchões e famílias na praça */}
          {[[300, '#5A7FA8'], [800, '#A85A5A'], [1300, '#6A9A5A']].map(([x, c], i) => <g key={i}><rect x={(x as number) - 120} y={900} width={240} height={50} rx={14} fill={c as string} /><ellipse cx={(x as number) - 80} cy={905} rx={40} ry={16} fill="#F2F0E8" /></g>)}
          {[[420, '#8C5B3E', '#2A9D8F'], [900, '#C99272', '#E9C46A'], [1420, '#6E4630', '#D1495B']].map(([x, p, c], i) => <g key={'f' + i} transform={`translate(${x},${1000}) scale(0.5)`}><Pessoa v={MORADOR(p as string, c as string, i === 1 ? 'longo' : 'curto')} expr={modo === 'manha' ? 'calmo' : 'susto'} t={t + i} bE={[20, 40]} bD={[20, 40]} /></g>)}
        </g>}
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== o copo cai e quebra =====================
export const CopoQuebra: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const tr = tremor(t, 0.55, 5);
  const k = KS(lt, 0.2, 1.2), q = lt > 1.25;
  return (
    <AbsoluteFill style={{background: '#1A1E28'}}>
      <AbsoluteFill style={{transform: `translate(${tr.x}px,${tr.y}px) rotate(${tr.r}deg)`}}>
        <SVG>
          <rect width={1920} height={760} fill="#2C3446" />
          <rect y={760} width={1920} height={320} fill="#2A2420" />
          <rect x={360} y={600} width={1200} height={36} rx={8} fill="#7A5A3C" />
          {!q && <g transform={`translate(${lerp(960, 1620, k)},${lerp(600, 980, k * k)}) rotate(${k * 110})`}><path d="M-56,-210 L56,-210 L46,0 L-46,0 Z" fill="rgba(220,235,250,0.18)" stroke="rgba(230,240,255,0.8)" strokeWidth={4} /><rect x={-48} y={-150} width={96} height={146} fill="#6FB4E8" opacity={0.55} /></g>}
          {q && <g>{Array.from({length: 22}, (_, i) => { const a = rnd(i) * Math.PI, rr = KO(lt, 1.25, 1.8) * (40 + rnd(i + 3) * 220); return <path key={i} d={`M${1620 + Math.cos(a) * rr},${1000 - Math.sin(a) * rr * 0.4} l${8 + rnd(i) * 14},${-6} l${-4},${14} Z`} fill="#DDEBFF" opacity={0.85} />; })}<ellipse cx={1620} cy={1010} rx={KO(lt, 1.25, 2.2) * 260} ry={KO(lt, 1.25, 2.2) * 30} fill="#6FB4E8" opacity={0.45} /></g>}
        </SVG>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===================== Serra do Tombador (mata tremendo, sem ninguém) =====================
export const Serra: React.FC<{lt: number; t: number; treme?: number}> = ({lt, t, treme = 0}) => {
  const tr = tremor(t, treme, 6);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#8EB8D8 0%,#D8E6D0 60%)'}}>
      <SVG>
        <path d="M0,520 L300,360 L560,470 L820,330 L1100,460 L1400,350 L1700,450 L1920,380 L1920,640 L0,640 Z" fill="#6A7F5A" />
        <g transform={`translate(${tr.x},${tr.y})`}>
          {Array.from({length: 60}, (_, i) => { const x = rnd(i) * 2000 - 40, y = 600 + rnd(i + 3) * 440, s = 0.6 + rnd(i + 5) * 0.8; return <g key={i} transform={`translate(${x},${y}) scale(${s}) rotate(${treme * Math.sin(t * 9 + i) * 4})`}><rect x={-8} y={-80} width={16} height={80} fill="#4A3424" /><ellipse cx={0} cy={-110} rx={70} ry={50} fill={['#2F6B3A', '#3E7A44', '#2A5A30'][i % 3]} /></g>; })}
        </g>
        {treme > 0 && Array.from({length: 14}, (_, i) => { const k = clamp01((lt - 0.4 - i * 0.05) / 2.5); return <path key={'p' + i} d={`M${300 + rnd(i) * 1300 + k * 600},${560 - k * 380 - rnd(i + 2) * 80} q14,-12 28,0 q14,-12 28,0`} stroke="#1E1E1E" strokeWidth={4} fill="none" opacity={k > 0 ? 1 : 0} />; })}
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== corte: placa de Nazca mergulhando (Acre / Bolívia) =====================
export const CorteNazca: React.FC<{lt: number; t: number; modo: 'placa' | 'ondas' | 'bolivia'}> = ({lt, t, modo}) => {
  const clar = (Math.sin(t * 2.4) + 1) / 2;
  const fx = modo === 'bolivia' ? 1180 : 1300, fy = 880;
  const avanca = modo === 'placa' ? KS(lt, 0.3, 2.8) : 1;
  return (
    <AbsoluteFill style={{background: '#06080F'}}>
      <SVG>
        <defs><linearGradient id="mantoN" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5A3A22" /><stop offset="100%" stopColor="#8A2A10" /></linearGradient></defs>
        <rect x={0} y={260} width={1920} height={820} fill="url(#mantoN)" />
        <rect x={0} y={200} width={420} height={70} fill="#1E5A8A" />
        <path d="M420,260 L560,250 L700,120 L840,230 L1920,250 L1920,300 L420,300 Z" fill="#6E7F5A" />
        <path d="M0,300 L1920,300 L1920,330 L0,330 Z" fill="#3A2C20" />
        <clipPath id="clipPlaca"><rect x={0} y={0} width={lerp(380, 1920, avanca)} height={1080} /></clipPath>
        <path d="M0,280 L520,300 C760,360 1000,560 1300,880 L1220,920 C960,640 720,450 480,370 L0,350 Z" fill="#2E3A4E" clipPath="url(#clipPlaca)" />
        {modo !== 'placa' && <><circle cx={fx} cy={fy} r={30 + clar * 20} fill="#FFE08A" opacity={0.7 + 0.3 * clar} /><circle cx={fx} cy={fy} r={110} fill="#FFB547" opacity={0.18 * clar} /></>}
        {modo !== 'placa' && [0, 1, 2, 3].map((i) => { const k = ((t * 0.45 + i / 4) % 1); return <circle key={i} cx={fx} cy={fy} r={60 + k * 640} fill="none" stroke="#FFB547" strokeWidth={lerp(8, 1, k)} opacity={(1 - k) * 0.7} />; })}
        <text x={60} y={245} fill="#BFE0FF" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 4}}>OCEANO PACÍFICO</text>
        <text x={700} y={95} fill="#fff" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 4}}>ANDES</text>
        <text x={1360} y={230} fill="#fff" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 4}}>{modo === 'bolivia' ? 'BOLÍVIA' : 'ACRE'}</text>
      </SVG>
      {modo === 'placa' && <Legenda x={760} y={560} txt="PLACA DE NAZCA" op={KO(lt, 0.8, 1.2)} cor={COR.calmo} />}
      {modo !== 'placa' && <Legenda x={fx - 330} y={fy - 20} txt={modo === 'bolivia' ? '~630 KM' : '~600 KM DE PROFUNDIDADE'} op={KO(lt, 0.5, 0.9)} cor={COR.perigo} />}
    </AbsoluteFill>
  );
};

// ===================== celular com o boato =====================
export const CelularBoato: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #1C2430, #05070D 75%)'}}>
    <div style={{position: 'absolute', left: 760, top: 80, width: 400, height: 860, borderRadius: 50, background: '#111', padding: 18, boxShadow: '0 30px 80px rgba(0,0,0,0.7)', transform: `rotate(-4deg) scale(${lerp(1.18, 1.2, KS(lt, 0, 4))})`}}>
      <div style={{width: '100%', height: '100%', borderRadius: 36, background: '#E5DDD5', overflow: 'hidden', position: 'relative'}}>
        <div style={{height: 90, background: '#2F6E5F', color: '#fff', display: 'flex', alignItems: 'center', padding: '0 24px', fontFamily: F.rotulo, fontWeight: 700, fontSize: 22}}>Grupo da família</div>
        <div style={{position: 'absolute', left: 18, right: 40, top: 160, background: '#fff', borderRadius: 14, padding: '16px 18px', fontFamily: F.rotulo, fontSize: 20, lineHeight: 1.35, color: '#111', opacity: KO(lt, 0.3, 0.7), boxShadow: '0 2px 6px rgba(0,0,0,0.15)'}}>
          ⚠️ <b>ALERTA MÁXIMO</b><br />Megaterremoto de magnitude <b>8,9</b> vai atingir o Brasil em <b>setembro</b>! Repassem!!
          <div style={{fontSize: 14, color: '#888', marginTop: 8, textAlign: 'right'}}>Encaminhada · 09:41</div>
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
export const Calendario: React.FC<{lt: number; d: number; t: number}> = ({lt, d, t}) => {
  const dia = Math.min(30, Math.floor(lerp(1, 30, KS(lt, 0.2, d - 0.4))));
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #1C2430, #05070D 75%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 520, borderRadius: 24, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>
        <div style={{background: '#C0392B', color: '#fff', textAlign: 'center', fontFamily: F.titulo, fontWeight: 700, fontSize: 60, padding: '16px 0', letterSpacing: 6}}>SETEMBRO</div>
        <div style={{background: '#F4F1EA', textAlign: 'center', fontFamily: F.titulo, fontWeight: 700, fontSize: 260, color: '#1E1E1E', lineHeight: 1.2}}>{dia}</div>
      </div>
    </AbsoluteFill>
  );
};

// ===================== mapa: a borda oeste da América do Sul =====================
const ANDES: [number, number][] = [[-71, 10.5], [-74, 6], [-77.5, 2], [-80, -2], [-81, -6], [-78, -11], [-76, -14], [-72, -17], [-70.5, -20], [-70.6, -25], [-71.5, -30], [-73, -36], [-73.8, -41], [-75, -47], [-74, -52]];
export const BordaOeste: React.FC<{lt: number; d: number; t: number}> = ({lt, d, t}) => (
  <MapaAS lt={lt} d={d} lonC={-62} latC={-18} s0={20} s1={20.5} escuro={0.45}
    children={(P) => { const k = KS(lt, 0.2, 2.4); const n = Math.max(2, Math.floor(ANDES.length * k)); return <path d={'M' + ANDES.slice(0, n).map((p) => P(p[0] - 1.5, p[1]).join(',')).join(' L')} stroke={COR.perigo} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.6 + 0.4 * Math.sin(t * 4)} />; }} />
);

// ===================== a casa térrea e o prédio alto (com lustres) =====================
export const PredioCasa: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const a = Math.sin(t * 1.3) * 2.6;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#1B2A44,#3C5478)'}}>
      <SVG>
        <rect y={960} width={1920} height={120} fill="#2A2F38" />
        {Array.from({length: 4}, (_, i) => { const k = ((t * 0.4 + i / 4) % 1); return <path key={i} d={`M${-200 + k * 2400},1000 q60,-40 120,0 t120,0 t120,0`} stroke="#7CC4FF" strokeWidth={4} fill="none" opacity={0.5 * (1 - k)} />; })}
        <g transform={`translate(800,960) skewX(${a})`}>
          <rect x={-150} y={-840} width={300} height={840} fill="#4A5568" />
          {Array.from({length: 14}, (_, r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={-125 + c * 66} y={-810 + r * 58} width={44} height={36} fill={rnd(r * 7 + c) > 0.4 ? '#FFD98A' : '#2A3242'} opacity={0.85} />))}
          <g transform="translate(0,-760)"><line x1={0} y1={-20} x2={Math.sin(t * 1.3 + 0.6) * 40} y2={40} stroke="#fff" strokeWidth={3} /><circle cx={Math.sin(t * 1.3 + 0.6) * 40} cy={46} r={12} fill="#FFE9B8" /></g>
        </g>
        <g transform="translate(1380,960)"><rect x={-140} y={-160} width={280} height={160} fill="#7A6450" /><path d="M-160,-158 L0,-250 L160,-158 Z" fill="#5A4636" /><rect x={-40} y={-100} width={80} height={100} fill="#3A2A1C" /><line x1={-90} y1={-150} x2={-90} y2={-120} stroke="#fff" strokeWidth={3} /><circle cx={-90} cy={-114} r={10} fill="#FFE9B8" /></g>
      </SVG>
      <Legenda x={800} y={80} txt="10º ANDAR: O LUSTRE MEXE" op={KO(lt, 2.5, 2.9)} cor={COR.perigo} size={34} />
      <Legenda x={1380} y={680} txt="TÉRREO: QUASE NADA" op={KO(lt, 3.2, 3.6)} cor={COR.calmo} size={34} />
    </AbsoluteFill>
  );
};

// ===================== globo (vetorial) com anéis =====================
export const GloboOndas: React.FC<{lt: number; t: number; lon: number; lat: number; alvos?: [string, number, number][]}> = ({lt, t, lon, lat, alvos = []}) => {
  const proj = geoOrthographic().rotate([-lon + 20, -lat + 15]).scale(430).translate([960, 560]).clipAngle(90);
  const path = geoPath(proj);
  const [cx, cy] = proj([lon, lat]) as [number, number];
  return (
    <AbsoluteFill style={{background: '#02040A'}}>
      <Img src={staticFile('espaco.jpg')} style={{position: 'absolute', width: 1920, height: 1080, opacity: 0.5}} />
      <SVG>
        <circle cx={960} cy={560} r={450} fill="#7CC4FF" opacity={0.12} />
        <circle cx={960} cy={560} r={430} fill="#123E6E" />
        <path d={path(geoGraticule().step([20, 20])()) || ''} fill="none" stroke="#fff" strokeOpacity={0.06} />
        {mundo.map((f: any, i: number) => <path key={i} d={path(f) || ''} fill={f.id === '076' ? '#5E8A4A' : '#4F7A43'} stroke="#8DB27A" strokeOpacity={0.25} strokeWidth={0.6} />)}
        {[0, 1, 2].map((i) => { const k = ((t * 0.35 + i / 3) % 1); return <circle key={i} cx={cx} cy={cy} r={20 + k * 420} fill="none" stroke="#FFB547" strokeWidth={4} opacity={(1 - k) * 0.8} />; })}
        <circle cx={cx} cy={cy} r={10} fill="#FF5A3C" stroke="#fff" strokeWidth={3} />
        {alvos.map(([n, lo, la], i) => { const p = proj([lo, la]); return p ? <circle key={n} cx={p[0]} cy={p[1]} r={8} fill="#FFE08A" opacity={KO(lt, 1 + i * 0.8, 1.3 + i * 0.8)} /> : null; })}
      </SVG>
      {alvos.map(([n, lo, la], i) => { const p = proj([lo, la]); return p ? <Rotulo key={n} x={p[0]} y={p[1]} txt={n} lado={1} op={KO(lt, 1 + i * 0.8, 1.3 + i * 0.8)} /> : null; })}
    </AbsoluteFill>
  );
};

// ===================== Avenida Paulista à noite =====================
export const Paulista: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg,#0A1022,#1E2848)'}}>
    <SVG>
      {Array.from({length: 9}, (_, i) => { const h = 420 + rnd(i) * 360, x = i * 220 - 20, w = 190; return <g key={i}><rect x={x} y={860 - h} width={w} height={h} fill={['#1E2638', '#242E44', '#1A2234'][i % 3]} />{Array.from({length: Math.floor(h / 44) * 4}, (_, j) => <rect key={j} x={x + 16 + (j % 4) * 44} y={880 - h + Math.floor(j / 4) * 44} width={26} height={26} fill="#FFD98A" opacity={rnd(i * 31 + j) > 0.45 ? 0.75 : 0.08} />)}</g>; })}
      <rect y={860} width={1920} height={220} fill="#2E2E36" />
      <rect y={860} width={1920} height={20} fill="#55555E" />
      {Array.from({length: 9}, (_, i) => <rect key={i} x={i * 230 + 30} y={980} width={150} height={10} fill="#fff" opacity={0.6} />)}
      {[[300, '#C99272', '#2A9D8F'], [520, '#6E4630', '#E9C46A'], [1100, '#E0B494', '#7FA8BA'], [1350, '#8C5B3E', '#D1495B'], [1600, '#C99272', '#4A5568']].map(([x, p, c], i) => <g key={i} transform={`translate(${(x as number) + Math.sin(lt * 1.2 + i) * 20},${960}) scale(0.55)`}><Pessoa v={MORADOR(p as string, c as string, i % 2 ? 'longo' : 'curto')} expr="susto" t={t + i} bE={[30, 60]} bD={[20, 30]} /></g>)}
    </SVG>
  </AbsoluteFill>
);

// ===================== apartamento no 30º andar (copo balançando devagar) =====================
export const AptoAlto: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const a = Math.sin(t * 1.1) * 1.4;
  return (
    <AbsoluteFill style={{background: '#0A1022'}}>
      <AbsoluteFill style={{transform: `rotate(${a * 0.4}deg)`}}>
        <SVG>
          <rect width={1920} height={1080} fill="#2C3446" />
          <rect x={160} y={120} width={1600} height={560} fill="#0E1730" stroke="#4A5266" strokeWidth={20} />
          {Array.from({length: 40}, (_, i) => { const h = 40 + rnd(i) * 160; return <rect key={i} x={170 + i * 40} y={680 - h} width={36} height={h} fill="#141E34" />; })}
          {Array.from({length: 120}, (_, i) => <rect key={'l' + i} x={180 + rnd(i) * 1560} y={540 + rnd(i + 3) * 130} width={4} height={4} fill="#FFD98A" opacity={0.7} />)}
          <rect y={760} width={1920} height={320} fill="#2A2420" />
          <rect x={560} y={740} width={800} height={30} rx={6} fill="#7A5A3C" />
          <g transform="translate(960,740)"><path d="M-46,-170 L46,-170 L38,0 L-38,0 Z" fill="rgba(220,235,250,0.18)" stroke="rgba(230,240,255,0.8)" strokeWidth={4} /><path d={`M-43,${-110 + a * 8} L43,${-110 - a * 8} L36,-4 L-36,-4 Z`} fill="#6FB4E8" opacity={0.6} /></g>
        </SVG>
      </AbsoluteFill>
      <Legenda x={360} y={80} txt="30º ANDAR" op={KO(lt, 0.3, 0.7)} cor={COR.calmo} />
    </AbsoluteFill>
  );
};

// ===================== Lisboa, 1755 =====================
export const Lisboa: React.FC<{lt: number; t: number; modo: 'calmo' | 'desaba'}> = ({lt, t, modo}) => {
  const k = modo === 'desaba' ? 0.6 : 0;
  const tr = tremor(t, k, 8);
  const mar = modo === 'desaba' ? KS(lt, 1.6, 3.6) : 0;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#E8C89A,#F6E6C8)'}}>
      <SVG>
        <g transform={`translate(${tr.x},${tr.y})`}>
          {[[200, 1], [620, 0], [1050, 1], [1480, 0]].map(([x, igreja], i) => <g key={i} transform={`translate(${x},860)`}>
            <rect x={-150} y={-300} width={300} height={300} fill={['#E8D8C0', '#D8C0A0', '#E0CCB0', '#CFB896'][i]} />
            {igreja ? <><rect x={-60} y={-470} width={120} height={180} fill="#D8C0A0" /><path d="M-70,-470 L0,-560 L70,-470 Z" fill="#9A4A2A" /><line x1={0} y1={-560} x2={0} y2={-610} stroke="#5A3A22" strokeWidth={6} /><line x1={-18} y1={-590} x2={18} y2={-590} stroke="#5A3A22" strokeWidth={6} /></> : <path d="M-170,-300 L0,-380 L170,-300 Z" fill="#9A4A2A" />}
            {Array.from({length: 6}, (_, j) => <rect key={j} x={-120 + (j % 3) * 90} y={-260 + Math.floor(j / 3) * 110} width={50} height={70} rx={20} fill="#5A3A22" />)}
          </g>)}
          {modo === 'desaba' && Array.from({length: 10}, (_, i) => { const f = 0.6 + 0.4 * Math.sin(t * 9 + i); return <ellipse key={i} cx={150 + i * 180} cy={520 - f * 30} rx={40 + f * 20} ry={80 + f * 40} fill="#FF7A2F" opacity={0.5 * KS(lt, 0.8, 1.6)} />; })}
        </g>
        <rect y={860} width={1920} height={220} fill="#7A6450" />
        {mar > 0 && <path d={`M0,${1080 - mar * 420} ${Array.from({length: 20}, (_, i) => `Q${i * 100 + 50},${1060 - mar * 420 - 30} ${(i + 1) * 100},${1080 - mar * 420}`).join(' ')} L1920,1080 L0,1080 Z`} fill="#2E6F9E" opacity={0.92} />}
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== o tsunami atravessando o Atlântico =====================
export const OndaAtlantico: React.FC<{lt: number; d: number; t: number}> = ({lt, d, t}) => (
  <MapaAS lt={lt} d={d} lonC={-24} latC={13} s0={16} s1={16.4} escuro={0.4}
    children={(P) => { const [lx, ly] = P(-9.14, 38.72); const [tx, ty] = P(-35.1, -8.75); const k = KS(lt, 0.3, d - 0.4); const r = k * Math.hypot(tx - lx, ty - ly); return <g>
      <circle cx={lx} cy={ly} r={10} fill={COR.perigo} stroke="#fff" strokeWidth={3} />
      {[0, 0.08, 0.16].map((o) => <circle key={o} cx={lx} cy={ly} r={Math.max(4, r - o * 400)} fill="none" stroke="#9FD8FF" strokeWidth={5} opacity={0.8 - o * 3} />)}
      <circle cx={tx} cy={ty} r={9} fill={COR.ouro} opacity={KO(lt, d - 0.8, d - 0.5)} />
    </g>; }}
    html={(P) => <><Rotulo x={P(-9.14, 38.72)[0]} y={P(-9.14, 38.72)[1]} txt="LISBOA" lado={1} cor={COR.perigo} op={KO(lt, 0.2, 0.5)} /><Rotulo x={P(-35.1, -8.75)[0]} y={P(-35.1, -8.75)[1]} txt="TAMANDARÉ (PE)" lado={-1} op={KO(lt, d - 0.8, d - 0.5)} /></>} />
);

// ===================== praia de Tamandaré com a água avançando =====================
export const Tamandare: React.FC<{lt: number; d: number; t: number}> = ({lt, d, t}) => {
  const k = KS(lt, 0.4, d - 0.2);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#8EC8E8 0%,#D8EEF6 55%)'}}>
      <SVG>
        <rect y={500} width={1920} height={120} fill="#2E8AB8" />
        <rect y={600} width={1920} height={480} fill="#F2DDB0" />
        {Array.from({length: 9}, (_, i) => { const x = 160 + i * 210; return <g key={i}><path d={`M${x},1000 Q${x + 20},800 ${x - 10},640`} stroke="#6A5236" strokeWidth={14} fill="none" />{Array.from({length: 7}, (_, j) => <path key={j} d={`M${x - 10},640 q${Math.cos(j) * 90},${-30 + Math.sin(j * 2 + t) * 20} ${Math.cos(j) * 140},40`} stroke="#2F7A3A" strokeWidth={14} fill="none" strokeLinecap="round" />)}</g>; })}
        <path d={`M0,${lerp(610, 860, k)} ${Array.from({length: 20}, (_, i) => `Q${i * 100 + 50},${lerp(610, 860, k) - 25 + Math.sin(t * 2 + i) * 8} ${(i + 1) * 100},${lerp(610, 860, k)}`).join(' ')} L1920,500 L0,500 Z`} fill="#2E8AB8" opacity={0.85} />
      </SVG>
      <Legenda x={360} y={120} txt="ATÉ ~2 M (SIMULAÇÕES)" op={KO(lt, 1.0, 1.4)} cor={COR.calmo} size={36} />
    </AbsoluteFill>
  );
};

// ===================== foto real com moldura =====================
export const FotoReal: React.FC<{lt: number; d: number; img: string; legenda: string; credito: string}> = ({lt, d, img, legenda, credito}) => (
  <AbsoluteFill style={{background: '#0A0C10'}}>
    <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Img src={staticFile(img)} style={{height: 860, filter: 'sepia(0.15) contrast(1.05)', transform: `scale(${lerp(1, 1.025, es(lt / d))})`, boxShadow: '0 30px 80px rgba(0,0,0,0.7)'}} />
    </AbsoluteFill>
    <div style={{position: 'absolute', left: 80, bottom: 70, opacity: KO(lt, 0.3, 0.7), padding: '12px 20px', borderRadius: 10, background: 'rgba(6,10,20,0.88)', borderLeft: `5px solid ${COR.ouro}`}}>
      <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 40, color: '#fff'}}>{legenda}</div>
      <div style={{fontFamily: F.rotulo, fontWeight: 500, fontSize: 16, letterSpacing: 2, color: '#AEB6C6', marginTop: 4}}>{credito}</div>
    </div>
  </AbsoluteFill>
);

// ===================== cubos de energia: 7,5 x 9,5 =====================
export const CubosEnergia: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const k = KS(lt, 0.4, 2.6);
  const L = lerp(30, 300, k);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 60% 55%, #2A0E14, #06070D 70%)'}}>
      <SVG>
        <g transform="translate(360,700)"><rect x={-15} y={-30} width={30} height={30} fill={corMag(7.5)} /><text y={-50} textAnchor="middle" fill="#fff" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 48}}>7,5</text></g>
        <g transform="translate(1180,850)"><path d={`M${-L},0 L${L},0 L${L},${-2 * L} L${-L},${-2 * L} Z`} fill={corMag(9.5)} /><path d={`M${-L},${-2 * L} L${-L + L * 0.5},${-2.4 * L} L${L * 1.5},${-2.4 * L} L${L},${-2 * L} Z`} fill="#E0407A" /><path d={`M${L},0 L${L * 1.5},${-0.4 * L} L${L * 1.5},${-2.4 * L} L${L},${-2 * L} Z`} fill="#8A1040" /><text x={0} y={-L} textAnchor="middle" fill="#fff" opacity={k} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 90}}>9,5</text></g>
      </SVG>
      <Legenda x={1180} y={110} txt="≈ 1.000 × A ENERGIA" op={KO(lt, 2.2, 2.6)} cor={COR.perigo} size={52} />
    </AbsoluteFill>
  );
};

// ===================== a Terra vibrando como um sino =====================
export const GloboSino: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const proj = geoOrthographic().rotate([60, 20]).scale(380).translate([960, 540]).clipAngle(90);
  const path = geoPath(proj);
  const v = Math.sin(t * 9) * 0.02;
  return (
    <AbsoluteFill style={{background: '#02040A'}}>
      <Img src={staticFile('espaco.jpg')} style={{position: 'absolute', width: 1920, height: 1080, opacity: 0.5}} />
      <SVG>
        <g transform={`translate(960,540) scale(${1 + v},${1 - v}) translate(-960,-540)`}>
          <circle cx={960} cy={540} r={380} fill="#123E6E" />
          {mundo.map((f: any, i: number) => <path key={i} d={path(f) || ''} fill="#4F7A43" />)}
        </g>
        {[0, 1, 2].map((i) => { const k = ((t * 0.5 + i / 3) % 1); return <circle key={i} cx={960} cy={540} r={400 + k * 260} fill="none" stroke="#9FD8FF" strokeWidth={3} opacity={(1 - k) * 0.5} />; })}
        {[[-1, 300], [1, 300]].map(([s, y], i) => <path key={i} d={`M${960 + (s as number) * 720},${200} ${Array.from({length: 60}, (_, j) => `L${960 + (s as number) * (720 + Math.sin(j * 0.9 + t * 6) * 26 * Math.exp(-j / 40))},${200 + j * 11}`).join(' ')}`} stroke="#FF5A3C" strokeWidth={2.5} fill="none" opacity={0.7} />)}
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== hipótese: o rasgo de 1.000 km sob o Brasil + anéis =====================
export const RasgoBrasil: React.FC<{lt: number; d: number; t: number; aneis?: number}> = ({lt, d, t, aneis = 0}) => (
  <MapaAS lt={lt} d={d} lonC={-48} latC={-19} s0={aneis ? 40 : 46} s1={aneis ? 41 : 47} escuro={0.5}
    children={(P) => { const a = P(-47.6, -23.0), b = P(-47.9, -15.8); const k = KS(lt, 0.3, 2.2); const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2; const px = (km: number) => (km / 111) * (aneis ? 40.5 : 46.5); return <g>
      <path d={`M${a[0]},${a[1]} L${lerp(a[0], b[0], k)},${lerp(a[1], b[1], k)}`} stroke={COR.perigo} strokeWidth={12} strokeLinecap="round" />
      <path d={`M${a[0]},${a[1]} L${lerp(a[0], b[0], k)},${lerp(a[1], b[1], k)}`} stroke="#FFE08A" strokeWidth={3} strokeDasharray="6 8" />
      {aneis > 0 && [[100, 0.4], [500, 1.3], [1000, 2.6]].map(([km, t0]) => <ellipse key={km} cx={cx} cy={cy} rx={px(km as number) + 20} ry={px(km as number) + (a[1] - b[1]) / 2} fill="none" stroke="#FFB547" strokeWidth={4} opacity={KO(lt, t0 as number, (t0 as number) + 0.4)} strokeDasharray="14 10" />)}
    </g>; }}
    html={(P) => { const a = P(-47.6, -23.0), b = P(-47.9, -15.8); return <>
      <Rotulo x={a[0]} y={a[1]} txt="SÃO PAULO" lado={1} op={KO(lt, 0.3, 0.6)} cor={COR.calmo} />
      <Rotulo x={b[0]} y={b[1]} txt="BRASÍLIA" lado={1} op={KO(lt, 2.0, 2.3)} cor={COR.calmo} />
      <div style={{position: 'absolute', left: 120, top: 80, padding: '10px 22px', border: `4px solid ${COR.perigo}`, borderRadius: 10, fontFamily: F.titulo, fontWeight: 700, fontSize: 46, color: COR.perigo, letterSpacing: 6, background: 'rgba(6,10,20,0.6)', transform: 'rotate(-6deg)'}}>HIPÓTESE</div>
    </>; }} />
);

// ===================== prédio antissísmico (Chile) x prédio comum =====================
export const PrediosChile: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const a = Math.sin(t * 1.5) * 2;
  const P = (x: number, chile: boolean) => <g transform={`translate(${x},960) skewX(${chile ? a * 0.6 : a})`}>
    <rect x={-160} y={-700} width={320} height={700} fill={chile ? '#5A6A80' : '#6A5A50'} />
    {Array.from({length: 11}, (_, r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-120 + c * 90} y={-670 + r * 60} width={60} height={36} fill="#FFD98A" opacity={0.7} />))}
    {chile && <>{Array.from({length: 6}, (_, i) => <path key={i} d={`M-160,${-i * 116} L160,${-(i + 1) * 116} M160,${-i * 116} L-160,${-(i + 1) * 116}`} stroke="#9FD8FF" strokeWidth={4} opacity={0.6} />)}<rect x={-170} y={-10} width={340} height={20} fill="#2A2F38" />{[-120, -40, 40, 120].map((x) => <rect key={x} x={x - 14} y={0} width={28} height={24} rx={6} fill="#E3B04B" />)}</>}
  </g>;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#1B2A44,#3C5478)'}}>
      <SVG><rect y={960} width={1920} height={120} fill="#2A2F38" />{P(560, true)}{P(1360, false)}</SVG>
      <Legenda x={560} y={150} txt="CHILE: FEITO PARA TREMER" op={KO(lt, 0.4, 0.8)} cor={COR.calmo} size={34} />
      <Legenda x={1360} y={150} txt="MAIOR PARTE DO BRASIL" op={KO(lt, 1.6, 2.0)} cor={COR.perigo} size={34} />
    </AbsoluteFill>
  );
};

// ===================== cartela "NÃO" =====================
export const CartelaNao: React.FC<{lt: number}> = ({lt}) => (
  <AbsoluteFill style={{background: '#05070D', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <Numero cor="#3DDBB4" size={340} op={KO(lt, 0.15, 0.4)} style={{transform: `scale(${lerp(1.06, 1, KO(lt, 0.15, 0.6))})`}}>NÃO.</Numero>
  </AbsoluteFill>
);

// ===================== globo com as zonas de subducção =====================
const SUBD: [number, number][][] = [
  [[-71, 10.5], [-77.5, 2], [-81, -6], [-76, -14], [-70.5, -20], [-71.5, -30], [-73.8, -41], [-75, -50]],
  [[141, 45], [144, 38], [142, 33], [137, 30], [131, 28], [127, 24]],
  [[-170, 52], [-160, 54.5], [-150, 58], [-140, 59.5]],
];
export const GloboPlacas: React.FC<{lt: number; t: number; centro: [number, number]; brasil?: boolean}> = ({lt, t, centro, brasil = false}) => {
  const proj = geoOrthographic().rotate([-centro[0], -centro[1]]).scale(420).translate([960, 560]).clipAngle(90);
  const path = geoPath(proj);
  return (
    <AbsoluteFill style={{background: '#02040A'}}>
      <Img src={staticFile('espaco.jpg')} style={{position: 'absolute', width: 1920, height: 1080, opacity: 0.5}} />
      <SVG>
        <circle cx={960} cy={560} r={420} fill="#123E6E" />
        {mundo.map((f: any, i: number) => <path key={i} d={path(f) || ''} fill={brasil && f.id === '076' ? '#3DDBB4' : '#4F7A43'} opacity={brasil && f.id === '076' ? 0.9 : 1} />)}
        {SUBD.map((l, i) => <path key={i} d={path({type: 'LineString', coordinates: l} as any) || ''} stroke={COR.perigo} strokeWidth={9} fill="none" strokeLinecap="round" opacity={(0.6 + 0.4 * Math.sin(t * 4)) * KO(lt, 0.3 + i * 0.6, 0.6 + i * 0.6)} />)}
        {brasil && <path d={path({type: 'LineString', coordinates: [[-30, 15], [-36, 5], [-20, 0], [-13, -8], [-14, -20], [-13, -35], [-17, -50]]} as any) || ''} stroke="#FFB547" strokeWidth={6} fill="none" strokeDasharray="12 10" opacity={KO(lt, 1.6, 2.0)} />}
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== rachaduras antigas no mapa do Brasil =====================
export const Rachaduras: React.FC<{lt: number; d: number; t: number}> = ({lt, d, t}) => {
  const casos: [string, number, number][] = [['JOÃO CÂMARA', -35.82, -5.54], ['ITACARAMBI', -44.1, -15.1], ['SERRA DO TOMBADOR', -57.6, -11.7]];
  return (
    <MapaAS lt={lt} d={d} lonC={-48} latC={-11} s0={30} s1={30.6} escuro={0.55}
      children={(P) => <g>{Array.from({length: 26}, (_, i) => { const lo = -60 + rnd(i) * 26, la = -3 - rnd(i + 5) * 22; const [x, y] = P(lo, la); return <path key={i} d={`M${x},${y} l${(rnd(i + 2) - 0.5) * 80},${(rnd(i + 3) - 0.5) * 60} l${(rnd(i + 4) - 0.5) * 60},${(rnd(i + 6) - 0.5) * 60}`} stroke="#FFB547" strokeWidth={3} fill="none" opacity={0.5 * KO(lt, 0.2, 0.8)} />; })}
        {casos.map(([n, lo, la], i) => <Pulso key={n} p={P(lo, la)} t={t + i} cor={COR.perigo} op={KO(lt, 1 + i * 0.7, 1.3 + i * 0.7)} r={9} />)}</g>}
      html={(P) => <>{casos.map(([n, lo, la], i) => <Rotulo key={n} x={P(lo, la)[0]} y={P(lo, la)[1]} txt={n} lado={i === 2 ? -1 : 1} op={KO(lt, 1 + i * 0.7, 1.3 + i * 0.7)} />)}</>} />
  );
};

// ===================== segurança =====================
export const Seguranca: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const ic = (x: number, txt: string, i: number, desenho: React.ReactNode) => (
    <g key={i} opacity={KO(lt, 0.3 + i * 0.9, 0.7 + i * 0.9)} transform={`translate(${x},480)`}>
      <circle r={190} fill="rgba(255,255,255,0.05)" stroke="#E3B04B" strokeWidth={5} />
      {desenho}
      <text y={280} textAnchor="middle" fill="#fff" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 56, letterSpacing: 4}}>{txt}</text>
    </g>
  );
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #14203A, #04060B 75%)'}}>
      <SVG>
        {ic(420, 'ABAIXA', 0, <g transform="translate(0,120) scale(0.55,0.45)"><Pessoa v={VOCE} t={t} expr="susto" bE={[150, 120]} bD={[150, 120]} /></g>)}
        {ic(960, 'PROTEGE', 1, <g><rect x={-130} y={10} width={260} height={24} rx={6} fill="#7A5A3C" /><rect x={-120} y={34} width={18} height={100} fill="#5A3E28" /><rect x={102} y={34} width={18} height={100} fill="#5A3E28" /><g transform="translate(0,140) scale(0.32)"><Pessoa v={VOCE} t={t} expr="susto" bE={[160, 130]} bD={[160, 130]} /></g></g>)}
        {ic(1500, 'SEGURA', 2, <g><rect x={-20} y={-110} width={40} height={240} fill="#7A5A3C" /><g transform="translate(70,140) scale(0.4)"><Pessoa v={VOCE} t={t} expr="neutro" bE={[90, 20]} bD={[20, 20]} /></g></g>)}
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== mapa vazio esperando os comentários =====================
export const MapaComentarios: React.FC<{lt: number; d: number; t: number}> = ({lt, d, t}) => (
  <MapaAS lt={lt} d={d} lonC={-53} latC={-14} s0={26} s1={26.6} escuro={0.55}
    children={(P) => <g>{Array.from({length: 24}, (_, i) => { const [x, y] = P(-70 + rnd(i) * 34, -2 - rnd(i + 4) * 28); return <circle key={i} cx={x} cy={y} r={7} fill={COR.ouro} opacity={KO(lt, 1.5 + rnd(i + 9) * 3, 1.8 + rnd(i + 9) * 3) * 0.9} />; })}</g>}
    html={() => <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', opacity: KO(lt, 0.3, 0.7)}}><span style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 74, color: '#fff', background: 'rgba(6,10,20,0.75)', padding: '10px 30px', borderRadius: 12}}>VOCÊ JÁ SENTIU A TERRA TREMER?</span></div>} />
);

// ===================== card final =====================
export const CardFinal6: React.FC<{lt: number; t: number}> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #14203A, #04060B 75%)'}}>
    <div style={{position: 'absolute', top: 290, width: '100%', textAlign: 'center', fontFamily: F.titulo, fontWeight: 700, fontSize: 96, color: '#fff', letterSpacing: 6, opacity: KO(lt, 0.2, 0.7)}}>BRASIL MILENAR</div>
    <div style={{position: 'absolute', top: 420, width: '100%', textAlign: 'center', fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, color: '#AEB6C6', letterSpacing: 8, opacity: KO(lt, 0.5, 1.0)}}>O CHÃO DAQUI É CALMO. MAS NUNCA FICA PARADO.</div>
    {[0, 1].map((i) => <div key={i} style={{position: 'absolute', top: 560, left: 520 + i * 460, width: 420, height: 236, borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(255,255,255,0.18)', opacity: KO(lt, 0.8 + i * 0.2, 1.2 + i * 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: '#8A93A6'}}>{i ? 'PRÓXIMO VÍDEO' : 'VÍDEO ANTERIOR'}</div>)}
  </AbsoluteFill>
);
