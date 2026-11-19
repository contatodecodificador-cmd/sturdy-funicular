import React from 'react';
import {AbsoluteFill} from 'remotion';
import {feature} from 'topojson-client';
import {geoOrthographic, geoPath, geoGraticule10} from 'd3-geo';
// @ts-ignore
import land110 from 'world-atlas/land-110m.json';
import {C, F} from './theme';
import {useT, Cena, Caixa} from './ui';
import {prog, clamp01} from './prims';
import {Lua, EspacoReal, MapaReal, Tag, K, lerp, rnd} from './piloto';

const LAND: any = feature(land110 as any, (land110 as any).objects.land);
const GRAT = geoGraticule10();

// globo realista simples (oceano + terra) com eixo inclinado
export const Globo3: React.FC<{cx: number; cy: number; r: number; spin: number; tilt: number; eixo?: number; cor?: string; terra?: string; arco?: number}> = ({cx, cy, r, spin, tilt, eixo = 1, cor = '#1f5c99', terra = '#5d8f4e', arco = 0}) => {
  const proj = geoOrthographic().rotate([spin, -10, 0]).scale(r).translate([0, 0]).clipAngle(90);
  const path = geoPath(proj);
  const tr = (tilt * Math.PI) / 180;
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r={r * 1.06} fill="#7cc4ff" opacity={0.12} />
      <g transform={`rotate(${tilt})`}>
        <circle r={r} fill={cor} />
        <path d={path(LAND) || ''} fill={terra} />
        <path d={path(GRAT) || ''} fill="none" stroke="#fff" strokeOpacity={0.08} />
        <circle r={r} fill="url(#sombraGlobo)" />
        <line x1={0} y1={-r * 1.45} x2={0} y2={r * 1.45} stroke={C.ouro} strokeWidth={4} strokeDasharray="12 8" opacity={eixo} />
      </g>
      <defs><radialGradient id="sombraGlobo" cx="35%" cy="35%" r="75%"><stop offset="55%" stopColor="#000" stopOpacity={0} /><stop offset="100%" stopColor="#000" stopOpacity={0.6} /></radialGradient></defs>
      {arco > 0 && (
        <g opacity={arco}>
          <line x1={0} y1={-r * 1.5} x2={0} y2={r * 1.5} stroke="#8a93a6" strokeWidth={2} strokeDasharray="4 8" />
          <path d={`M0,${-r * 1.25} A${r * 1.25},${r * 1.25} 0 0 1 ${Math.sin(tr) * r * 1.25},${-Math.cos(tr) * r * 1.25}`} stroke={C.ouro} strokeWidth={4} fill="none" />
        </g>
      )}
    </g>
  );
};

const Estratos: React.FC<{t: number; lupa: number}> = ({t, lupa}) => (
  <svg width={1920} height={1080}>
    {Array.from({length: 26}, (_, i) => <rect key={i} x={0} y={300 + i * 24} width={1920} height={24} fill={i % 2 ? '#6b5a44' : '#8a7458'} opacity={0.85 + 0.15 * Math.sin(i * 1.7)} />)}
    {Array.from({length: 26}, (_, i) => <path key={'o' + i} d={`M0,${300 + i * 24} ${Array.from({length: 25}, (_, j) => `L${j * 80},${300 + i * 24 + Math.sin(j * 0.7 + i) * 4}`).join(' ')}`} stroke="#3a2f22" strokeWidth={2} fill="none" />)}
    <g opacity={lupa} transform="translate(1180,560)">
      <circle r={170} fill="rgba(6,10,20,0.35)" stroke="#d9c7a8" strokeWidth={12} />
      {Array.from({length: 14}, (_, i) => <rect key={i} x={-160} y={-150 + i * 22} width={320} height={11} fill={i % 2 ? '#c8a878' : '#5a4632'} />)}
      <line x1={120} y1={120} x2={250} y2={250} stroke="#d9c7a8" strokeWidth={22} strokeLinecap="round" />
    </g>
  </svg>
);
const Relogio18: React.FC<{k: number; t: number}> = ({k, t}) => {
  const H = 18.67, a = ((t * 2) % H) / H * Math.PI * 2;
  return (
    <svg width={1920} height={1080} style={{opacity: k}}>
      <g transform="translate(560,560)">
        <circle r={190} fill="rgba(6,10,20,0.92)" stroke={C.ouro} strokeWidth={8} />
        {Array.from({length: 19}, (_, i) => { const b = (i / H) * Math.PI * 2; return <g key={i}><line x1={Math.sin(b) * 160} y1={-Math.cos(b) * 160} x2={Math.sin(b) * 178} y2={-Math.cos(b) * 178} stroke={i === 18 ? C.perigo : C.info} strokeWidth={4} />{i % 3 === 0 && <text x={Math.sin(b) * 128} y={-Math.cos(b) * 128 + 10} textAnchor="middle" fill={C.info} style={{fontFamily: F.titulo, fontSize: 28}}>{i === 0 ? 18 : i}</text>}</g>; })}
        <line x1={0} y1={0} x2={Math.sin(a) * 140} y2={-Math.cos(a) * 140} stroke={C.perigo} strokeWidth={6} strokeLinecap="round" />
        <circle r={10} fill={C.perigo} />
        <text y={250} textAnchor="middle" fill={C.info} style={{fontFamily: F.titulo, fontWeight: 600, fontSize: 40, letterSpacing: 2}}>DIA DE ~18 H 40</text>
      </g>
    </svg>
  );
};
const GraficoDia: React.FC<{t: number; k: number; semLua: number}> = ({k, semLua}) => {
  const x0 = 360, x1 = 1560, y0 = 860, y1 = 300; // eixo x: -1,4 bi → futuro +2 bi; y: 16h → 34h
  const X = (ga: number) => lerp(x0, x1, (ga + 1.4) / 3.4), Y = (h: number) => lerp(y0, y1, (h - 16) / 18);
  const com = Array.from({length: 60}, (_, i) => { const g = -1.4 + (i / 59) * 3.4; return `${X(g)},${Y(18.7 + (g + 1.4) * 2.25 + Math.max(0, g) * 1.2)}`; });
  const sem = Array.from({length: 30}, (_, i) => { const g = (i / 29) * 2; return `${X(g)},${Y(24 + g * 0.5)}`; });
  const n = Math.round(60 * k);
  return (
    <svg width={1920} height={1080}>
      <rect x={x0 - 80} y={y1 - 80} width={x1 - x0 + 160} height={y0 - y1 + 170} rx={16} fill="rgba(6,10,20,0.8)" />
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke="#56627a" strokeWidth={2} /><line x1={x0} y1={y0} x2={x0} y2={y1} stroke="#56627a" strokeWidth={2} />
      {[18, 24, 30].map((h) => <g key={h}><line x1={x0} x2={x1} y1={Y(h)} y2={Y(h)} stroke="#22304a" /><text x={x0 - 14} y={Y(h) + 8} textAnchor="end" fill="#B9C2D3" style={{fontFamily: F.titulo, fontSize: 24}}>{h} H</text></g>)}
      {[[-1.4, '1,4 BI ATRÁS'], [0, 'HOJE'], [2, '+2 BI']].map(([g, l]) => <text key={l as string} x={X(g as number)} y={y0 + 40} textAnchor="middle" fill="#B9C2D3" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 18, letterSpacing: 2}}>{l}</text>)}
      <polyline points={com.slice(0, n).join(' ')} fill="none" stroke={C.ouro} strokeWidth={5} />
      {semLua > 0 && <polyline points={sem.slice(0, Math.round(30 * semLua)).join(' ')} fill="none" stroke={C.dado} strokeWidth={5} strokeDasharray="12 8" />}
      <circle cx={X(0)} cy={Y(24)} r={9} fill="#fff" />
    </svg>
  );
};

const PINS: [string, number, number][] = [['UBATUBA', -45.07, -23.43], ['SÃO PAULO', -46.63, -23.55], ['MACAPÁ (EQUADOR)', -51.07, 0.03], ['CHUÍ', -53.46, -33.69], ['SALVADOR', -38.5, -12.97], ['PORTO ALEGRE', -51.23, -30.03]];
const MapaTropico: React.FC<{lat: number; show: string[]; t: number; frio?: number}> = ({lat, show, t, frio = 0}) => (
  <MapaReal lonC={-50} latC={-16} s={26}>
    {(p) => {
      const a = p(-75, lat), b = p(-30, lat), eq0 = p(-75, 0), eq1 = p(-30, 0);
      return (
        <g>
          <line x1={eq0[0]} y1={eq0[1]} x2={eq1[0]} y2={eq1[1]} stroke="#B9C2D3" strokeWidth={2} strokeDasharray="6 8" opacity={0.6} />
          <rect x={a[0]} y={a[1]} width={b[0] - a[0]} height={p(0, -34)[1] - a[1] > 0 ? 0 : 0} />
          <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.ouro} strokeWidth={5} />
          <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.ouro} strokeWidth={18} opacity={0.18} />
          {frio > 0 && <rect x={a[0]} y={p(0, -28)[1]} width={b[0] - a[0]} height={400} fill="#7cc4ff" opacity={0.15 * frio} />}
          {PINS.filter(([n]) => show.includes(n)).map(([n, lo, la]) => { const q = p(lo, la); return <g key={n}><circle cx={q[0]} cy={q[1]} r={9} fill="#fff" stroke={C.ouro} strokeWidth={3} /></g>; })}
        </g>
      );
    }}
  </MapaReal>
);
const projTrop = (lon: number, lat: number): [number, number] => [960 + (lon + 50) * 26, 540 - (lat + 16) * 26];

const Marte: React.FC<{t: number; tilt: number}> = ({tilt}) => (
  <svg width={1920} height={1080}>
    <defs><radialGradient id="mt" cx="38%" cy="35%"><stop offset="0%" stopColor="#e2814f" /><stop offset="70%" stopColor="#a8472a" /><stop offset="100%" stopColor="#5a2010" /></radialGradient></defs>
    <g transform={`translate(860,560) rotate(${tilt})`}>
      <circle r={240} fill="url(#mt)" />
      <ellipse cx={-60} cy={-40} rx={70} ry={30} fill="#7a2f1a" opacity={0.5} /><ellipse cx={60} cy={70} rx={90} ry={26} fill="#7a2f1a" opacity={0.45} />
      <ellipse cx={0} cy={-226} rx={70} ry={16} fill="#f2ece4" opacity={0.85} />
      <line x1={0} y1={-340} x2={0} y2={340} stroke={C.ouro} strokeWidth={4} strokeDasharray="12 8" />
    </g>
    <circle cx={1300} cy={420} r={8} fill="#9a8a78" /><circle cx={1460} cy={680} r={5} fill="#9a8a78" />
  </svg>
);

export const CenasLote4: React.FC = () => {
  const t = useT();
  const sw = (a: number) => Math.sin(a) * 0.5 + Math.sin(a * 2.3 + 1) * 0.3 + Math.sin(a * 0.7 + 2) * 0.2; // "caos"
  return (
    <>
      {/* VIRADA — túnel do tempo; duas coisas: o freio e o eixo */}
      <Cena from={457.0} to={469.2} zoom={0.08} fade={0.5} fixo={
        <svg width={1920} height={1080}>
          {Array.from({length: 120}, (_, i) => { const a = rnd(i + 11000) * Math.PI * 2, sp = K(t, 461.4, 463.4), r0 = ((t * (60 + 900 * sp) * (0.4 + rnd(i + 11100))) % 1100), L = 10 + 140 * sp; return <line key={i} x1={960 + Math.cos(a) * r0} y1={540 + Math.sin(a) * r0} x2={960 + Math.cos(a) * (r0 + L)} y2={540 + Math.sin(a) * (r0 + L)} stroke="#cfe2ff" strokeOpacity={0.15 + 0.5 * sp} strokeWidth={2} />; })}
          {[{x: 560, l: 'O MAR', at: 458.8, c: '#2f7bc4'}, {x: 960, l: 'O MANGUE', at: 459.5, c: '#3d8f5a'}, {x: 1360, l: 'O CARNAVAL', at: 460.2, c: '#e63946'}].map((c, i) => { const k = K(t, c.at, c.at + 0.35) * (1 - K(t, 461.3, 461.8)); return (
            <g key={'r' + i} opacity={k} transform={`translate(${c.x},${540 - 20 * (1 - k)})`}>
              <rect x={-150} y={-110} width={300} height={220} rx={18} fill="rgba(6,10,20,0.88)" stroke={c.c} strokeWidth={3} />
              {i === 0 && <path d="M-90,20 q30,-40 60,0 t60,0 t60,0" stroke="#7cc4ff" strokeWidth={8} fill="none" />}
              {i === 1 && <g><path d="M0,40 L0,-20" stroke="#5a4632" strokeWidth={10} /><ellipse cx={0} cy={-40} rx={60} ry={34} fill="#3d8f5a" /><path d="M-30,40 Q-20,10 0,0 M30,40 Q20,10 0,0" stroke="#5a4632" strokeWidth={5} fill="none" /></g>}
              {i === 2 && [0, 1, 2, 3, 4, 5, 6, 7].map((j) => { const a0 = Math.PI + (j * Math.PI) / 8, a1 = Math.PI + ((j + 1) * Math.PI) / 8; return <path key={j} d={`M0,20 L${Math.cos(a0) * 70},${20 + Math.sin(a0) * 52} A70,52 0 0 1 ${Math.cos(a1) * 70},${20 + Math.sin(a1) * 52} Z`} fill={['#E63946', '#F4C430', '#2BA84A', '#1E6FD9'][j % 4]} />; })}
              <text y={86} textAnchor="middle" fill={C.info} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4}}>{c.l}</text>
            </g>
          ); })}
          {[{x: 640, l: 'O FREIO', ic: 'f'}, {x: 1280, l: 'O EIXO', ic: 'e'}].map((c, i) => { const k = K(t, 464.6 + i * 0.5, 465.2 + i * 0.5); return (
            <g key={i} opacity={k} transform={`translate(${c.x},560)`}>
              <circle r={120} fill="rgba(6,10,20,0.88)" stroke={C.ouro} strokeWidth={4} />
              {c.ic === 'f' ? <g><circle r={56} fill="none" stroke={C.info} strokeWidth={10} /><rect x={-14} y={-90} width={28} height={50} rx={6} fill={C.perigo} /></g> : <g transform="rotate(23)"><circle r={56} fill="#1f5c99" /><line x1={0} y1={-95} x2={0} y2={95} stroke={C.ouro} strokeWidth={6} strokeDasharray="10 6" /></g>}
              <text y={175} textAnchor="middle" fill={C.info} style={{fontFamily: F.titulo, fontWeight: 600, fontSize: 40, letterSpacing: 3}}>{c.l}</text>
            </g>
          ); })}
        </svg>
      }>
        <EspacoReal drift={4} />
      </Cena>

      {/* B10a — flashback: 1,4 bilhão de anos; rocha em camadas; relógio de 18 h 40 */}
      <Cena from={469.2} to={484.8} zoom={0.04} fade={0.45} fixo={
        <>
          <div style={{position: 'absolute', top: 36, width: '100%', display: 'flex', justifyContent: 'center', opacity: K(t, 469.4, 470.0)}}>
            <div style={{padding: '8px 26px', borderRadius: 14, background: 'rgba(6,10,20,0.8)', border: `1.5px solid ${C.perigo}88`, fontFamily: F.titulo, fontSize: 40, letterSpacing: 4, color: C.info}}>⟲ HÁ 1.400.000.000 DE ANOS</div>
          </div>
          <Relogio18 k={K(t, 480.6, 481.2)} t={t} />
        </>
      }>
        {t < 472 ? <EspacoReal drift={3} /> : <Estratos t={t} lupa={K(t, 476.4, 477.2)} />}
      </Cena>
      {/* B10b — Lua mais perto, Terra mais rápida */}
      <Cena from={484.8} to={488.8} zoom={0.03} fade={0.4} fixo={
        <>
          <Tag x={1240} y={760} anchor="middle" cor={C.cinza} size={22}>LUA: ~341 MIL KM (HOJE 384 MIL)</Tag>
          <Tag x={560} y={830} anchor="middle" cor={C.dado} size={22}>GIRO MAIS RÁPIDO</Tag>
        </>
      }>
        <EspacoReal />
        <svg width={1920} height={1080}><Globo3 cx={560} cy={540} r={200} spin={t * 140} tilt={23} eixo={0.5} /><Lua x={1240} y={540} r={60} on={1} id="lp2" /></svg>
      </Cena>
      {/* B10c — atrito das marés = freio de mão */}
      <Cena from={488.8} to={498.8} zoom={0.03} fade={0.45} fixo={
        <>
          <Tag x={960} y={900} anchor="middle" cor={C.ouro} size={24} op={K(t, 492.4, 493.0) * (1 - K(t, 496.0, 496.4))}>ATRITO DAS MARÉS ESTICA O DIA</Tag>
          <Tag x={960} y={900} anchor="middle" cor={C.perigo} size={30} op={K(t, 496.6, 497.2)}>FREIO DE MÃO DA TERRA</Tag>
        </>
      }>
        <EspacoReal />
        <svg width={1920} height={1080}>
          <ellipse cx={700} cy={560} rx={290} ry={240} fill="#2f7bc4" opacity={0.45} transform={`rotate(14 700 560)`} />
          <Globo3 cx={700} cy={560} r={220} spin={t * 30} tilt={0} eixo={0} />
          <Lua x={1500} y={560} r={60} on={1} id="ft" />
          <line x1={960} y1={560} x2={1430} y2={560} stroke="#8a93a6" strokeDasharray="6 8" />
          <g opacity={K(t, 492.6, 493.2)}>{[0, 1, 2].map((i) => <path key={i} d={`M${700 + 250 * Math.cos(-0.9 + i * 0.5)},${560 + 250 * Math.sin(-0.9 + i * 0.5)} a250,250 0 0 1 40,40`} stroke={C.perigo} strokeWidth={6} fill="none" />)}</g>
          {t > 496.6 && <g opacity={K(t, 496.6, 497.2)} transform="translate(1500,400)"><rect x={-12} y={-70} width={24} height={90} rx={10} fill={C.perigo} transform={`rotate(${-20 * K(t, 497, 497.6)} 0 20)`} /><rect x={-50} y={20} width={100} height={20} rx={6} fill="#3a3a44" /></g>}
        </svg>
      </Cena>
      {/* B10d — sem a Lua, o freio afrouxa: gráfico do tamanho do dia */}
      <Cena from={498.8} to={514.7} zoom={0.02} fade={0.45} fixo={
        <>
          <GraficoDia t={t} k={K(t, 499.0, 501.0)} semLua={K(t, 501.6, 504.2)} />
          <Tag x={1180} y={360} cor={C.ouro} size={20} op={K(t, 500.2, 500.8)}>COM A LUA (FREIO FORTE)</Tag>
          <Tag x={1180} y={700} cor={C.dado} size={20} op={K(t, 502.4, 503.0)}>SÓ COM O SOL (FREIO FRACO)</Tag>
          <Tag x={960} y={980} anchor="middle" cor={C.cinza} size={20} op={K(t, 508.0, 508.6)}>CURVAS ILUSTRATIVAS</Tag>
        </>
      }>
        <EspacoReal dim={0.6} />
      </Cena>

      {/* B11a — o eixo: 23,4°, quase não mexe com a Lua */}
      <Cena from={514.7} to={532.4} zoom={0.03} fade={0.45} fixo={
        <>
          <Tag x={1240} y={340} cor={C.ouro} size={30} op={K(t, 521.4, 522.0)}>23,4°</Tag>
          <Tag x={1240} y={400} cor={C.cinza} size={20} op={K(t, 523.2, 523.8)}>A INCLINAÇÃO CRIA AS ESTAÇÕES</Tag>
          <div style={{position: 'absolute', left: 1240, top: 470, width: 520, padding: '18px 24px', borderRadius: 12, background: 'rgba(6,10,20,0.86)', opacity: K(t, 528.6, 529.2), fontFamily: F.rotulo, color: C.info}}>
            <div style={{fontSize: 16, letterSpacing: 4, fontWeight: 700, color: '#B9C2D3'}}>COM A LUA</div>
            <div style={{fontFamily: F.titulo, fontSize: 44, marginTop: 4}}>22,1° ↔ 24,5°</div>
          </div>
        </>
      }>
        <EspacoReal />
        <svg width={1920} height={1080}><Globo3 cx={720} cy={560} r={270} spin={t * 12} tilt={23.4 + (t > 528.6 ? Math.sin(t * 2) * 1.2 : 0)} arco={K(t, 521.0, 521.8)} /></svg>
      </Cena>
      {/* B11b — o Trópico de Capricórnio no mapa */}
      <Cena from={532.4} to={546.8} zoom={0} fade={0.45} fixo={
        <>
          {PINS.slice(0, 2).map(([n, lo, la], i) => { const q = projTrop(lo, la); return <Tag key={n} x={q[0] + (i ? -24 : 24)} y={q[1] + (i ? 34 : -30)} anchor={i ? 'end' : 'start'} cor={C.ouro} size={18} op={K(t, 537.2 + i * 1.6, 537.8 + i * 1.6)}>{n}</Tag>; })}
          {(() => { const q = projTrop(-30, -23.44); return <Tag x={q[0] - 20} y={q[1] - 40} anchor="end" cor={C.ouro} size={22} op={K(t, 535.4, 536.0)}>TRÓPICO DE CAPRICÓRNIO · 23,4°S</Tag>; })()}
          <Tag x={960} y={980} anchor="middle" cor={C.ouro} size={24} op={K(t, 543.2, 543.8)}>LATITUDE DO TRÓPICO = INCLINAÇÃO DO EIXO</Tag>
        </>
      }>
        <MapaTropico lat={-23.44} show={['UBATUBA', 'SÃO PAULO']} t={t} />
      </Cena>
      {/* B11c — sem a Lua: 0 a 85° (caos) */}
      <Cena from={546.8} to={560.6} zoom={0.03} fade={0.45} fixo={
        <svg width={1920} height={1080}>
          {(() => { const ang = t < 550 ? 23.4 : lerp(23.4, 42 + 40 * sw(t * 1.3), K(t, 550, 552)); const a = (ang * Math.PI) / 180; return (
            <g transform="translate(1440,620)" opacity={K(t, 553.0, 553.6)}>
              <path d="M-260,0 A260,260 0 0 1 0,-260" stroke="#56627a" strokeWidth={14} fill="none" />
              {[0, 30, 60, 85].map((d) => { const b = (d * Math.PI) / 180; return <text key={d} x={-Math.cos(b) * 300} y={-Math.sin(b) * 300 + 10} textAnchor="middle" fill="#B9C2D3" style={{fontFamily: F.titulo, fontSize: 26}}>{d}°</text>; })}
              <line x1={0} y1={0} x2={-Math.cos(a) * 240} y2={-Math.sin(a) * 240} stroke={C.perigo} strokeWidth={8} strokeLinecap="round" />
              <circle r={12} fill={C.perigo} />
              <text y={70} textAnchor="middle" fill={C.info} style={{fontFamily: F.titulo, fontSize: 44}}>{Math.round(ang)}°</text>
            </g>
          ); })()}
        </svg>
      }>
        <EspacoReal />
        <svg width={1920} height={1080}><Globo3 cx={640} cy={560} r={250} spin={t * 12} tilt={t < 550 ? 23.4 : lerp(23.4, 42 + 40 * sw(t * 1.3), K(t, 550, 552))} /></svg>
      </Cena>
      {/* B11d — o Trópico anda: Chuí (40°) e Salvador (12°) */}
      <Cena from={560.6} to={577.6} zoom={0} fade={0.45} fixo={
        <>
          {(() => { const lat = t < 569.2 ? lerp(-23.44, -40, K(t, 562.4, 565.6)) : lerp(-40, -12, K(t, 569.4, 572.4)); const q = projTrop(-30, lat); return <Tag x={q[0] - 20} y={q[1] - 40} anchor="end" cor={C.ouro} size={22}>{`TRÓPICO A ${Math.round(-lat)}°S · EIXO DE ${Math.round(-lat)}°`}</Tag>; })()}
          {(() => { const q = projTrop(-53.46, -33.69); return <Tag x={q[0] - 24} y={q[1]} anchor="end" cor={C.dado} size={18} op={K(t, 565.6, 566.2) * (1 - K(t, 569.0, 569.4))}>CHUÍ: SOL A PINO</Tag>; })()}
          {(() => { const q = projTrop(-38.5, -12.97); return <Tag x={q[0] + 24} y={q[1]} cor={C.ouro} size={18} op={K(t, 572.6, 573.2)}>SALVADOR</Tag>; })()}
          {(() => { const q = projTrop(-46.63, -23.55); return <Tag x={q[0] - 24} y={q[1] + 30} anchor="end" cor={C.perigo} size={18} op={K(t, 574.6, 575.2)}>SÃO PAULO: SOL NUNCA A PINO</Tag>; })()}
        </>
      }>
        <MapaTropico lat={t < 569.2 ? lerp(-23.44, -40, K(t, 562.4, 565.6)) : lerp(-40, -12, K(t, 569.4, 572.4))} show={t < 569.2 ? ['CHUÍ'] : ['SALVADOR', 'SÃO PAULO']} t={t} frio={K(t, 566.6, 567.4) * (1 - K(t, 569.0, 569.4))} />
      </Cena>
      {/* B11e — honestidade: os estudos discordam */}
      <Cena from={577.6} to={597.4} zoom={0.02} fade={0.45} fixo={
        (() => {
          const X = (d: number) => lerp(520, 1640, d / 90);
          const rows = [{n: 'COM A LUA (HOJE)', a: 22.1, b: 24.5, c: C.impacto, at: 578.6}, {n: 'LASKAR 1993 · SEM LUA', a: 0, b: 85, c: C.perigo, at: 579.2}, {n: 'NASA 2004 · SEM LUA', a: 12, b: 38, c: C.ouro, at: 590.0}, {n: 'LISSAUER 2012 · SEM LUA', a: 14, b: 34, c: C.dado, at: 583.0, aprox: true}];
          return (
            <svg width={1920} height={1080}>
              <rect x={180} y={300} width={1560} height={520} rx={16} fill="rgba(6,10,20,0.86)" />
              {[0, 30, 60, 90].map((d) => <g key={d}><line x1={X(d)} x2={X(d)} y1={330} y2={760} stroke="#22304a" /><text x={X(d)} y={790} textAnchor="middle" fill="#B9C2D3" style={{fontFamily: F.titulo, fontSize: 24}}>{d}°</text></g>)}
              {rows.map((r, i) => { const k = K(t, r.at, r.at + 0.8); return (
                <g key={i} opacity={k}>
                  <text x={500} y={385 + i * 100} textAnchor="end" fill={C.info} style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 18, letterSpacing: 1.5}}>{r.n}</text>
                  <rect x={X(r.a)} y={362 + i * 100} width={(X(r.b) - X(r.a)) * k} height={34} rx={6} fill={r.c} opacity={r.aprox ? 0.55 : 0.9} />
                </g>
              ); })}
              <text x={960} y={860} textAnchor="middle" fill="#8a93a6" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 16, letterSpacing: 2}} opacity={K(t, 583.0, 583.8)}>FAIXA DE 2012 APROXIMADA (RESUMO DO ESTUDO)</text>
            </svg>
          );
        })()
      }>
        <EspacoReal dim={0.6} />
      </Cena>
      {/* B11f — Marte: luas pequenas, eixo solto */}
      <Cena from={597.4} to={611.2} zoom={0.04} fade={0.45} fixo={
        <>
          <Tag x={1300} y={380} cor={C.cinza} size={18} op={K(t, 601.6, 602.2)}>FOBOS (~22 KM)</Tag>
          <Tag x={1460} y={640} cor={C.cinza} size={18} op={K(t, 601.8, 602.4)}>DEIMOS (~12 KM)</Tag>
          <Tag x={860} y={900} anchor="middle" cor={C.perigo} size={26} op={K(t, 609.6, 610.2)}>JÁ DEVE TER PASSADO DE 60°</Tag>
        </>
      }>
        <EspacoReal />
        <Marte t={t} tilt={25 + (t > 604.6 ? 35 * sw((t - 604.6) * 1.1) : 0)} />
      </Cena>
      {/* B11g — devagar: milhões de anos; ninguém acorda com o Trópico em Porto Alegre */}
      <Cena from={611.2} to={620.4} zoom={0} fade={0.45} fixo={
        <>
          {(() => { const q = projTrop(-51.23, -30.03); return <Tag x={q[0] - 24} y={q[1]} anchor="end" cor={C.cinza} size={18} op={K(t, 618.4, 619.0)}>PORTO ALEGRE</Tag>; })()}
        </>
      }>
        <MapaTropico lat={lerp(-23.44, -27, prog(t, 611.2, 620.4))} show={['PORTO ALEGRE']} t={t} />
      </Cena>
    </>
  );
};

export const HUD_LOTE4 = [
  {a: 457.0, b: 468.6, s0: 461.4, s1: 465.4, v0: 5 * 365.25 * 86400, v1: 1e6 * 365.25 * 86400},
  {a: 514.7, b: 520.0, s0: 514.7, s1: 514.8, v0: 1e6 * 365.25 * 86400, v1: 1e6 * 365.25 * 86400},
];
