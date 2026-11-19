import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F} from './theme';
import {useT, Cena, Caixa} from './ui';
import {prog, clamp01} from './prims';
import {Lua, EspacoReal, MapaReal, Tag, K, lerp, rnd} from './piloto';

// costa de manguezais (aprox.) do Amapá ao Maranhão
const COSTA: [number, number][] = [[-51.0, 2.0], [-50.4, 1.0], [-50.0, 0.0], [-49.0, -0.6], [-48.0, -0.7], [-47.0, -0.6], [-46.2, -1.0], [-45.4, -1.4], [-44.6, -2.0], [-44.0, -2.4], [-43.4, -2.4], [-42.6, -2.7], [-41.8, -2.9]];

const Entremare: React.FC<{alta: number; baixa: number; t: number; extra?: number; seco?: number}> = ({alta, baixa, t, extra = 0, seco = 0}) => {
  // perfil: terreno sobe da esquerda (mar) para a direita (terra firme)
  const yT = (x: number) => 900 - (x - 100) * 0.32;
  const yA = 900 - alta * 60, yB = 900 - baixa * 60;
  const xA = 100 + (900 - yA) / 0.32, xB = 100 + (900 - yB) / 0.32;
  return (
    <svg width={1920} height={1080}>
      <rect width={1920} height={1080} fill="#0a1426" />
      <rect x={0} y={yA} width={xA} height={1080 - yA} fill="#244f7a" opacity={0.55} />
      <rect x={0} y={yB} width={xB} height={1080 - yB} fill="#1d4570" opacity={0.85} />
      <path d={`M0,${yT(0)} L1920,${yT(1920)} L1920,1080 L0,1080 Z`} fill="#3b2f25" />
      <path d={`M${xB},${yT(xB)} L${xA},${yT(xA)} L${xA},${yT(xA) + 26} L${xB},${yT(xB) + 26} Z`} fill={C.impacto} opacity={0.35} />
      <line x1={0} y1={yA} x2={xA} y2={yA} stroke={C.dado} strokeWidth={3} strokeDasharray="12 8" />
      <line x1={0} y1={yB} x2={xB} y2={yB} stroke={C.dado} strokeWidth={3} strokeDasharray="12 8" />
      {Array.from({length: 9}, (_, i) => {
        const xA0 = 100 + (7 * 60) / 0.32, xB0 = 100;
        const x = lerp(xB0 + 40, xA0 - 20, i / 8) + rnd(i + 8000) * 30, y = yT(x), fora = x > xA + 10 || x < xB - 10;
        const verde = fora ? lerp(1, 0.25, seco) : 1;
        return (
          <g key={i} opacity={lerp(1, 0.6, fora ? seco : 0)}>
            {[-30, -15, 0, 15, 30].map((dx, j) => <path key={j} d={`M${x + dx * 0.3},${y - 70} Q${x + dx},${y - 50} ${x + dx * 1.2},${y}`} stroke="#2a2016" strokeWidth={4} fill="none" />)}
            <path d={`M${x},${y - 70} L${x},${y - 120}`} stroke="#2a2016" strokeWidth={8} />
            <ellipse cx={x} cy={y - 150} rx={60} ry={40} fill={`rgb(${lerp(110, 40, verde)},${lerp(100, 120, verde)},${lerp(70, 60, verde)})`} />
            {extra > 0 && <path d={`M${x + 20},${y - 120 + ((t * 60 + i * 40) % 120)} l0,22`} stroke="#6aa84f" strokeWidth={5} opacity={extra} strokeLinecap="round" />}
          </g>
        );
      })}
    </svg>
  );
};
const Oceano: React.FC<{forca: number; t: number}> = ({forca, t}) => (
  <svg width={1920} height={1080}>
    <defs><linearGradient id="oc2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f7bc4" /><stop offset="35%" stopColor="#174a7a" /><stop offset="100%" stopColor="#06162e" /></linearGradient></defs>
    <rect y={200} width={1920} height={880} fill="url(#oc2)" />
    <rect y={160} width={1920} height={40} fill="#0b1630" />
    <path d={`M0,200 ${Array.from({length: 49}, (_, i) => `L${i * 40},${200 + Math.sin(i * 0.8 + t * 2) * 6}`).join(' ')} L1920,200`} stroke="#bfe3ff" strokeWidth={3} fill="none" />
    <path d="M0,980 Q480,940 960,990 T1920,970 L1920,1080 L0,1080 Z" fill="#1d1712" />
    {[300, 760, 1220, 1680].map((x, i) => {
      const r = 110 * forca;
      return (
        <g key={i} opacity={0.25 + 0.75 * forca} transform={`translate(${x},${600}) rotate(${(t * 40 * forca + i * 90) % 360})`}>
          <path d={`M${r},0 A${r},${r} 0 1 1 ${-r * 0.2},${-r * 0.98}`} stroke="#9fd3ff" strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d={`M${-r * 0.2},${-r * 0.98} l18,-10 l-4,22 Z`} fill="#9fd3ff" />
        </g>
      );
    })}
    {Array.from({length: 16}, (_, i) => { const ph = ((t * 0.12 * forca + rnd(i + 9000)) % 1); return <circle key={i} cx={100 + rnd(i + 9100) * 1720} cy={lerp(940, 260, ph)} r={4} fill={ph < 0.5 ? '#5aa9ff' : '#cfe8ff'} opacity={0.6 * forca} />; })}
  </svg>
);
const Sismo: React.FC<{t: number; amp: number}> = ({t, amp}) => (
  <svg width={1920} height={1080}>
    <rect x={260} y={300} width={1400} height={420} rx={14} fill="rgba(6,10,20,0.85)" stroke="rgba(227,176,75,0.3)" />
    {Array.from({length: 8}, (_, i) => <line key={i} x1={280} x2={1640} y1={340 + i * 50} y2={340 + i * 50} stroke="#22304a" strokeWidth={1} />)}
    <polyline fill="none" stroke={C.perigo} strokeWidth={3} points={Array.from({length: 340}, (_, i) => { const x = 280 + i * 4, ph = i + t * 60, burst = Math.exp(-(((ph % 340) - 170) ** 2) / 500); return `${x},${510 + Math.sin(ph * 0.9) * (6 + 140 * burst * amp) * (0.6 + 0.4 * rnd(Math.floor(ph)))}`; }).join(' ')} />
  </svg>
);

export const CenasLote3: React.FC = () => {
  const t = useT();
  return (
    <>
      {/* B8a — mapa: faixa de manguezais do Norte; zoom no Maranhão */}
      <Cena from={357.0} to={369.6} zoom={0} fade={0.5} fixo={
        <>
          <div style={{position: 'absolute', left: 1240, top: 300, width: 520, padding: '20px 26px', borderRadius: 14, background: 'rgba(6,10,20,0.84)', border: '1px solid rgba(227,176,75,0.25)', opacity: K(t, 359.6, 360.2) * (1 - K(t, 363.8, 364.3)), fontFamily: F.rotulo, color: C.info}}>
            <div style={{fontSize: 17, letterSpacing: 4, fontWeight: 700, color: '#B9C2D3'}}>MAIORES ÁREAS DE MANGUE</div>
            {[{n: '1º INDONÉSIA', w: 1}, {n: '2º BRASIL · 12–14 MIL KM²', w: 0.42, c: C.impacto}].map((b) => (
              <div key={b.n} style={{marginTop: 14}}>
                <div style={{fontWeight: 700, fontSize: 19, letterSpacing: 2}}>{b.n}</div>
                <div style={{marginTop: 6, height: 20, width: 460 * b.w * K(t, 360.2, 361.4), borderRadius: 4, background: b.c || '#8a93a6'}} />
              </div>
            ))}
          </div>
          {(() => { const z = K(t, 364.3, 366.4); const s = lerp(40, 120, z); const p = [960 + (-44.6 - lerp(-47, -44.8, z)) * s, 540 - (-2.6 - lerp(-3, -2.8, z)) * s]; return <Tag x={p[0] + 40} y={p[1] + 80} cor={C.impacto} op={K(t, 366.6, 367.2)}>MARANHÃO: O ESTADO COM MAIS MANGUE</Tag>; })()}
        </>
      }>
        {(() => { const z = K(t, 364.3, 366.4); return (
          <MapaReal lonC={lerp(-47, -44.8, z)} latC={lerp(-3, -2.8, z)} s={lerp(40, 120, z)}>
            {(p) => <polyline points={COSTA.map(([lo, la]) => p(lo, la).join(',')).join(' ')} fill="none" stroke={C.impacto} strokeWidth={lerp(10, 22, z)} strokeLinecap="round" strokeLinejoin="round" opacity={0.6 * K(t, 357.6, 358.6)} />}
          </MapaReal>
        ); })()}
      </Cena>
      {/* B8b — zona entremarés: respira, sementes; a faixa encolhe */}
      <Cena from={369.6} to={392.0} zoom={0.03} fade={0.45} fixo={
        <>
          <Tag x={160} y={330} anchor="start" cor={C.impacto} size={24} op={K(t, 371.0, 371.6)}>FAIXA ENTRE MARÉ ALTA E BAIXA</Tag>
          <Tag x={160} y={390} anchor="start" cor={C.cinza} size={20} op={K(t, 374.0, 374.5) * (1 - K(t, 377.4, 377.8))}>RESPIRA · ÁGUA SALGADA · SEMENTES</Tag>
          <Tag x={160} y={390} anchor="start" cor={C.perigo} size={22} op={K(t, 379.2, 379.7)}>MARÉ CAI PRA ~1/3 → A FAIXA ENCOLHE</Tag>
          <Tag x={960} y={970} anchor="middle" cor={C.cinza} size={22} op={K(t, 387.4, 387.9)}>NENHUM ESTUDO DIZ QUANTO</Tag>
          <svg width={1920} height={1080} style={{opacity: K(t, 383.8, 384.4) * (1 - K(t, 390.8, 391.4))}}>
            <g transform="translate(1480,520)"><ellipse rx={30} ry={20} fill="#5c4a60" /><path d="M-24,-6 L-44,-24 M24,-6 L44,-24 M-20,6 L-40,18 M20,6 L40,18" stroke="#a65d48" strokeWidth={5} /></g>
            <g transform="translate(1640,480)"><path d="M-70,0 Q0,24 70,0 L60,10 Q0,30 -60,10 Z" fill="#20160f" /><circle cx={0} cy={-40} r={9} fill="#20160f" /><path d="M0,-32 L0,-6 M0,-24 L30,-50" stroke="#20160f" strokeWidth={6} /><line x1={30} y1={-50} x2={90} y2={-110} stroke="#20160f" strokeWidth={3} /></g>
          </svg>
        </>
      }>
        <Entremare alta={lerp(7, 4.7, K(t, 378.2, 380.6))} baixa={lerp(0, 2.3, K(t, 378.2, 380.6))} t={t} extra={K(t, 376.2, 376.8) * (1 - K(t, 377.8, 378.2))} seco={K(t, 380.6, 383.0)} />
      </Cena>
      {/* B8c — a batedeira do oceano perde força */}
      <Cena from={392.0} to={409.2} zoom={0.03} fade={0.45} fixo={
        <>
          <Tag x={160} y={330} cor={C.ouro} size={22} op={K(t, 392.4, 393.0)}>ÁGUA MAIS QUENTE</Tag>
          <Tag x={160} y={930} cor={C.dado} size={22} op={K(t, 396.4, 397.0)}>ÁGUA FRIA DO FUNDO</Tag>
          <Tag x={1760} y={600} anchor="end" cor={C.perigo} size={24} op={K(t, 400.4, 401.0) * (1 - K(t, 403.6, 404.0))}>SEM A LUA: MENOS MISTURA</Tag>
          <div style={{position: 'absolute', top: 470, width: '100%', display: 'flex', justifyContent: 'center', opacity: K(t, 403.0, 403.5) * (1 - K(t, 406.2, 406.6))}}><Caixa cor={C.dado} size={64}>E O CLIMA?</Caixa></div>
          <Tag x={960} y={600} anchor="middle" cor={C.cinza} size={24} op={K(t, 407.4, 407.9)}>PODE MUDAR. NINGUÉM SIMULOU COM DETALHE.</Tag>
        </>
      }>
        <Oceano forca={1 - K(t, 399.4, 401.8) * 0.8} t={t} />
      </Cena>

      {/* B9a — os mitos */}
      <Cena from={409.2} to={414.7} zoom={0.03} fade={0.45} fixo={
        <svg width={1920} height={1080}>
          {['TERREMOTOS EM SÉRIE', 'CHUVA DE ASTEROIDES', 'TERRA SAI DA ÓRBITA'].map((m, i) => {
            const k = K(t, 410.4 + i * 0.5, 410.9 + i * 0.5);
            return (
              <g key={i} opacity={k} transform={`translate(${420 + i * 540},${560 + (1 - k) * 30}) rotate(${(i - 1) * 3})`}>
                <rect x={-230} y={-120} width={460} height={240} rx={16} fill="rgba(10,16,30,0.92)" stroke={C.perigo} strokeOpacity={0.5} strokeWidth={2} />
                <text y={-40} textAnchor="middle" fill={C.perigo} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 20, letterSpacing: 6}}>{`MITO ${i + 1}`}</text>
                <text y={30} textAnchor="middle" fill={C.info} style={{fontFamily: F.titulo, fontWeight: 600, fontSize: 40, letterSpacing: 1}}>{m}</text>
              </g>
            );
          })}
        </svg>
      }>
        <EspacoReal dim={0.7} />
      </Cena>
      {/* B9b — terremotos × maré */}
      <Cena from={414.7} to={431.2} zoom={0.02} fade={0.45} fixo={
        <>
          <Tag x={260} y={330} cor={C.perigo} size={22}>MITO 1 · TERREMOTOS EM SÉRIE</Tag>
          <div style={{position: 'absolute', left: 560, top: 760, width: 800, padding: '18px 24px', borderRadius: 12, background: 'rgba(6,10,20,0.86)', opacity: K(t, 419.2, 419.8) * (1 - K(t, 427.2, 427.6)), fontFamily: F.rotulo, color: C.info}}>
            <div style={{fontSize: 16, letterSpacing: 4, fontWeight: 700, color: '#B9C2D3'}}>CHANCE DE UM TREMOR VIRAR GIGANTE (ILUSTRATIVO)</div>
            {[{n: 'MARÉ FRACA', w: 0.62}, {n: 'MARÉ FORTE', w: 0.72, c: C.perigo}].map((b) => (
              <div key={b.n} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 12}}>
                <span style={{width: 160, fontWeight: 700, fontSize: 18}}>{b.n}</span>
                <div style={{height: 18, width: 560 * b.w * K(t, 419.8, 421.0), borderRadius: 4, background: b.c || '#8a93a6'}} />
              </div>
            ))}
          </div>
          <Tag x={960} y={790} anchor="middle" cor={C.impacto} size={26} op={K(t, 427.6, 428.2)}>SEM A LUA, A TERRA TREME DO MESMO JEITO</Tag>
        </>
      }>
        <EspacoReal dim={0.5} />
        <Sismo t={t} amp={1} />
      </Cena>
      {/* B9c — a Lua não é escudo; quem protege é o ar */}
      <Cena from={431.2} to={444.2} zoom={0.03} fade={0.45} fixo={
        <>
          <Tag x={260} y={330} cor={C.perigo} size={22}>MITO 2 · CHUVA DE ASTEROIDES</Tag>
          <Tag x={1400} y={720} anchor="middle" cor={C.cinza} op={K(t, 434.0, 434.5)}>LUA: ALVO PEQUENO</Tag>
          <Tag x={760} y={860} anchor="middle" cor={C.dado} op={K(t, 441.6, 442.2)}>A ATMOSFERA QUEIMA A MAIORIA</Tag>
        </>
      }>
        <EspacoReal />
        <svg width={1920} height={1080}>
          <circle cx={760} cy={560} r={210 + 26 * K(t, 441.5, 442.4)} fill="#7cc4ff" opacity={0.08 + 0.16 * K(t, 441.5, 442.4)} />
          <circle cx={760} cy={560} r={210} fill="#1f5c99" />
          <path d="M640,470 q60,-60 140,-20 q30,60 -40,100 q-80,20 -100,-80 Z M780,620 q70,-20 90,40 q-40,60 -100,20 Z" fill="#5d8f4e" />
          <Lua x={1400} y={600} r={58} on={1} id="esc" />
          {Array.from({length: 7}, (_, i) => {
            const ph = ((t - 432) * 0.45 + i / 7) % 1, a = -0.9 + i * 0.22, x0 = 760 + Math.cos(a) * 900, y0 = 560 + Math.sin(a) * 900;
            const x = lerp(x0, 760 + Math.cos(a) * 230, ph), y = lerp(y0, 560 + Math.sin(a) * 230, ph);
            return t > 432.8 ? <g key={i}><line x1={x} y1={y} x2={x + Math.cos(a) * 60} y2={y + Math.sin(a) * 60} stroke="#ffb35c" strokeWidth={3} opacity={0.7} /><circle cx={x} cy={y} r={6} fill="#ffd9a0" /></g> : null;
          })}
          {t > 437 && (() => { const ph = ((t - 437) * 0.5) % 1, x = lerp(1900, 1450, ph), y = lerp(200, 560, ph); return <g><line x1={x} y1={y} x2={x + 50} y2={y - 40} stroke="#ffb35c" strokeWidth={3} opacity={0.6} /><circle cx={x} cy={y} r={5} fill="#ffd9a0" /></g>; })()}
        </svg>
      </Cena>
      {/* B9d — a órbita segue: 365 dias */}
      <Cena from={444.2} to={457.0} zoom={0.03} fade={0.45} fixo={
        <>
          <Tag x={260} y={330} cor={C.perigo} size={22}>MITO 3 · TERRA SAI DA ÓRBITA</Tag>
          <Tag x={960} y={900} anchor="middle" cor={C.ouro} size={30} op={K(t, 449.6, 450.2)}>1 VOLTA = 365 DIAS · NADA MUDA</Tag>
        </>
      }>
        <EspacoReal />
        {(() => { const a = (t - 444) * 0.5; return (
          <svg width={1920} height={1080}>
            <defs><radialGradient id="sol3"><stop offset="0%" stopColor="#fff8d8" /><stop offset="60%" stopColor="#ffc24a" /><stop offset="100%" stopColor="#ff9a00" stopOpacity={0} /></radialGradient></defs>
            <ellipse cx={960} cy={540} rx={620} ry={300} fill="none" stroke={C.ouro} strokeOpacity={0.45} strokeWidth={2} strokeDasharray="10 8" />
            <circle cx={960} cy={540} r={110} fill="url(#sol3)" />
            <circle cx={960 + Math.cos(a) * 620} cy={540 + Math.sin(a) * 300} r={26} fill="#2f7bc4" />
            <circle cx={960 + Math.cos(a) * 620} cy={540 + Math.sin(a) * 300} r={34} fill="#7cc4ff" opacity={0.2} />
          </svg>
        ); })()}
      </Cena>
    </>
  );
};

export const HUD_LOTE3 = [
  {a: 356.8, b: 362.0, s0: 357.0, s1: 358.6, v0: 2.6 * 365.25 * 86400, v1: 5 * 365.25 * 86400},
];
