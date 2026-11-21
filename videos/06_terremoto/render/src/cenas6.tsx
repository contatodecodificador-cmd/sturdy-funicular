/* Vídeo 6 — cenas da abertura (terremoto 9,5 no Brasil) */
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {F} from './theme';
import {lerp, rnd, clamp01, prog, KO, KS, es, tremor, Numero} from './base';
import {Pessoa, VOCE, CIENTISTA, Visual} from './personagens';

const SVG: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => <svg width={1920} height={1080} style={{position: 'absolute', top: 0, left: 0, overflow: 'visible', ...style}}>{children}</svg>;
export const COR = {ouro: '#E3B04B', perigo: '#FF5A3C', calmo: '#7CC4FF', texto: '#F2F4F8'};

// ---------- cores da régua de magnitude (frio → quente) ----------
export const corMag = (m: number) => {
  const st: [number, string][] = [[0, '#5FA8E0'], [3, '#3DDBB4'], [5, '#E3D24B'], [6.5, '#FF9A2F'], [8, '#FF5A3C'], [9.5, '#C2185B']];
  for (let i = 1; i < st.length; i++) if (m <= st[i][0]) return st[i][1];
  return st[st.length - 1][1];
};

// ===================== HUD: régua de magnitude (direita) =====================
export const ReguaMag: React.FC<{k: number; valor: number; topoMisterio?: boolean; t: number}> = ({k, valor, topoMisterio = true, t}) => {
  if (k <= 0) return null;
  const y = (m: number) => lerp(930, 170, m / 9.5);
  const marcas = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9.5];
  const x0 = lerp(1990, 1800, KO(k, 0, 1));
  return (
    <SVG>
      <g transform={`translate(${x0},0)`} opacity={k}>
        <rect x={-6} y={150} width={78} height={800} rx={14} fill="rgba(6,10,20,0.78)" />
        {marcas.slice(0, -1).map((m, i) => <rect key={m} x={6} y={y(marcas[i + 1])} width={18} height={y(m) - y(marcas[i + 1]) - 2} rx={3} fill={corMag(m + 0.5)} opacity={m + 0.5 <= valor + 0.01 ? 1 : 0.28} />)}
        {marcas.map((m) => <text key={'t' + m} x={60} y={y(m) + 7} textAnchor="end" fill="#C3CAD8" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 17}}>{m === 9.5 ? '9,5' : m}</text>)}
        {topoMisterio && <text x={34} y={140} textAnchor="middle" fill={COR.perigo} opacity={0.6 + 0.4 * Math.sin(t * 4)} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 30}}>???</text>}
        {/* seta */}
        <g transform={`translate(-14,${y(valor)})`} opacity={valor > 0.05 ? 1 : 0}>
          <path d="M0,0 L-22,-14 L-22,14 Z" fill={corMag(valor)} />
          <rect x={-106} y={-20} width={84} height={40} rx={8} fill={corMag(valor)} />
          <text x={-64} y={10} textAnchor="middle" fill="#06080F" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 28}}>{valor.toFixed(1).replace('.', ',')}</text>
        </g>
      </g>
    </SVG>
  );
};

// ===================== HUD: sismógrafo (faixa inferior) =====================
export const Sismografo: React.FC<{k: number; t: number; amp: number}> = ({k, t, amp}) => {
  if (k <= 0) return null;
  const pts: string[] = [];
  for (let i = 0; i <= 240; i++) {
    const x = 240 + i * 6;
    const tt = t - (240 - i) * 0.02;
    const a = amp * (0.6 + 0.4 * Math.sin(tt * 0.9));
    const yv = (Math.sin(tt * 31) * 0.5 + Math.sin(tt * 53 + 1) * 0.3 + Math.sin(tt * 87 + 2) * 0.2) * a * 34;
    pts.push(`${x},${yv.toFixed(1)}`);
  }
  return (
    <SVG>
      <g opacity={k} transform={`translate(0,${lerp(1140, 1000, KO(k, 0, 1))})`}>
        <rect x={220} y={-40} width={1480} height={80} rx={12} fill="rgba(244,240,228,0.9)" />
        {Array.from({length: 30}, (_, i) => <line key={i} x1={240 + i * 50 - ((t * 120) % 50)} x2={240 + i * 50 - ((t * 120) % 50)} y1={-36} y2={36} stroke="#D9CFB8" strokeWidth={1} />)}
        <line x1={240} x2={1680} y1={0} y2={0} stroke="#CBBF9F" strokeWidth={1} />
        <polyline points={pts.join(' ')} fill="none" stroke="#B3261E" strokeWidth={2.4} />
        <circle cx={1680} cy={Number(pts[pts.length - 1].split(',')[1])} r={5} fill="#B3261E" />
        <text x={236} y={-48} fill="#C3CAD8" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 15, letterSpacing: 4}}>SISMÓGRAFO</text>
      </g>
    </SVG>
  );
};

// ===================== Cartela: data =====================
export const CartelaData: React.FC<{lt: number; t: number; txt: string; sub?: string}> = ({lt, t, txt, sub}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg,#0B1830 0%,#1E2E4A 55%,#3A3040 100%)'}}>
    <SVG>
      {Array.from({length: 26}, (_, i) => { const h = 80 + rnd(i) * 240, w = 50 + rnd(i + 3) * 90, x = i * 76 - 20; return <g key={i}><rect x={x} y={1080 - 180 - h} width={w} height={h + 180} fill="#0A1222" />{Array.from({length: Math.floor(h / 34)}, (_, j) => rnd(i * 31 + j) > 0.55 && <rect key={j} x={x + 10 + (j % 2) * 22} y={1080 - 180 - h + 14 + j * 30} width={12} height={10} fill="#FFD98A" opacity={0.65} />)}</g>; })}
      <path d="M0,960 Q480,930 960,955 T1920,950 L1920,1080 L0,1080 Z" fill="#081020" />
    </SVG>
    <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 120, color: '#fff', letterSpacing: 6, opacity: KO(lt, 0.15, 0.7), textShadow: '0 8px 30px rgba(0,0,0,0.7)'}}>{txt}</div>
      {sub && <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 30, letterSpacing: 10, color: '#C3CAD8', marginTop: 10, opacity: KO(lt, 0.5, 1.0)}}>{sub}</div>}
    </AbsoluteFill>
  </AbsoluteFill>
);

// ===================== Manaus: fachada do prédio histórico (detalhada) =====================
const Fachada: React.FC<{x: number; y: number; s: number; t: number; luz?: number}> = ({x, y, s, t, luz = 0.97}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-430} y={-650} width={860} height={650} fill="#DCCBA8" />
    {/* faixas de pedra (rusticação) no térreo */}
    {Array.from({length: 6}, (_, i) => <line key={i} x1={-430} x2={430} y1={-30 - i * 28} y2={-30 - i * 28} stroke="#C4B08A" strokeWidth={3} />)}
    {/* pilastras */}
    {[-430, -290, -150, 150, 290, 430].map((cx) => <g key={cx}><rect x={cx - 16} y={-640} width={32} height={640} fill="#CDB993" /><rect x={cx - 22} y={-470} width={44} height={14} fill="#B89F74" /></g>)}
    {/* cornijas por andar */}
    {[-470, -330].map((yy) => <g key={yy}><rect x={-450} y={yy} width={900} height={16} fill="#B89F74" /><rect x={-440} y={yy + 16} width={880} height={6} fill="#A68C62" /></g>)}
    <rect x={-460} y={-690} width={920} height={46} rx={6} fill="#B89F74" />
    {Array.from({length: 28}, (_, i) => <rect key={i} x={-450 + i * 32.5} y={-700} width={14} height={14} fill="#A68C62" />)}
    <path d="M-150,-690 Q0,-790 150,-690 Z" fill="#C2A97E" stroke="#A68C62" strokeWidth={6} />
    <circle cx={0} cy={-722} r={22} fill="#EFE3C4" stroke="#A68C62" strokeWidth={4} />
    <line x1={0} y1={-790} x2={0} y2={-900} stroke="#6A5A44" strokeWidth={5} />
    <path d={`M0,-900 q30,${-6 + Math.sin(t * 3) * 4} 60,0 q30,${6 - Math.sin(t * 3) * 4} 60,0 l0,40 q-30,${-6 + Math.sin(t * 3 + 1) * 4} -60,0 q-30,${6 - Math.sin(t * 3 + 1) * 4} -60,0 Z`} fill="#2B8A3E" />
    {/* janelas em arco com sacadas */}
    {[0, 1].map((r) => [-3, -2, -1, 1, 2, 3].map((c) => {
      const wx = c * 140 - 32, wy = -620 + r * 150;
      return <g key={`${r}${c}`}>
        <rect x={wx - 8} y={wy - 8} width={80} height={112} rx={40} fill="#C2AE88" />
        <rect x={wx} y={wy} width={64} height={98} rx={32} fill={rnd(r * 9 + c + 30) < luz ? '#FFE2A8' : '#3A3226'} />
        <line x1={wx + 32} x2={wx + 32} y1={wy + 4} y2={wy + 98} stroke="#8C7458" strokeWidth={3} />
        <line x1={wx} x2={wx + 64} y1={wy + 50} y2={wy + 50} stroke="#8C7458" strokeWidth={3} />
        <rect x={wx - 14} y={wy + 98} width={92} height={10} fill="#A68C62" />
        {Array.from({length: 9}, (_, k) => <line key={k} x1={wx - 10 + k * 10.5} x2={wx - 10 + k * 10.5} y1={wy + 108} y2={wy + 130} stroke="#3A3226" strokeWidth={2.5} />)}
        <rect x={wx - 14} y={wy + 128} width={92} height={5} fill="#3A3226" />
      </g>;
    }))}
    {/* térreo: arcos e porta */}
    {[-300, -170, 170, 300].map((cx) => <g key={cx}><rect x={cx - 46} y={-200} width={92} height={160} rx={46} fill="#3A3226" /><rect x={cx - 38} y={-192} width={76} height={152} rx={38} fill="#FFE2A8" opacity={0.75} /></g>)}
    <rect x={-90} y={-230} width={180} height={230} rx={84} fill="#4A3A28" />
    <rect x={-78} y={-218} width={156} height={218} rx={74} fill="#FFE2A8" opacity={0.85} />
    <line x1={0} x2={0} y1={-200} y2={0} stroke="#4A3A28" strokeWidth={6} />
    <rect x={-210} y={-266} width={420} height={36} rx={4} fill="#6E5A3C" />
    <text x={0} y={-240} textAnchor="middle" fill="#F2E6C8" style={{fontFamily: 'Georgia, serif', fontSize: 22, letterSpacing: 6}}>PALÁCIO DO COMÉRCIO</text>
    <rect x={-220} y={-36} width={440} height={36} fill="#9E8E78" />
  </g>
);
export const Manaus: React.FC<{lt: number; t: number; pessoas?: number; balanco?: number}> = ({lt, t, pessoas = 0, balanco = 0}) => {
  const PORT: Visual = {...VOCE, pele: '#8C5B3E', peleSombra: '#73482F', cabelo: {tipo: 'curto', cor: '#1E1612'}, topo: {tipo: 'camiseta', cor: '#2F3B52', cor2: '#1F2838'}, baixo: {tipo: 'calca', cor: '#22262E'}, pe: {tipo: 'sapato', cor: '#111'}, bigode: true};
  const MOR = [
    {...VOCE, pele: '#C99272', peleSombra: '#A97A5C', cabelo: {tipo: 'longo' as const, cor: '#2A1C15', cor2: '#1E140F'}, topo: {tipo: 'camiseta' as const, cor: '#D1495B', cor2: '#A8323F'}, baixo: {tipo: 'calca' as const, cor: '#2B2D42'}, pe: {tipo: 'tenis' as const, cor: '#EEE'}},
    {...VOCE, pele: '#6E4630', peleSombra: '#5A3826', cabelo: {tipo: 'curto' as const, cor: '#151010'}, topo: {tipo: 'camiseta' as const, cor: '#E9C46A', cor2: '#C9A44A'}, baixo: {tipo: 'calca' as const, cor: '#3E5C76'}, pe: {tipo: 'tenis' as const, cor: '#333'}},
    {...VOCE, pele: '#E0B494', peleSombra: '#C49A7A', cabelo: {tipo: 'grisalho' as const, cor: '#7A7570', cor2: '#B9B4AE'}, topo: {tipo: 'camiseta' as const, cor: '#7FA8BA', cor2: '#5F8899'}, baixo: {tipo: 'calca' as const, cor: '#55504A'}, pe: {tipo: 'sapato' as const, cor: '#222'}},
  ];
  const sw = balanco * Math.sin(t * 1.6) * 0.6;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#5C8FC4 0%,#A9CBE6 55%,#E8D9B8 100%)'}}>
      <SVG>
        <circle cx={1650} cy={190} r={64} fill="#FFF3D0" opacity={0.9} />
        {Array.from({length: 5}, (_, i) => <ellipse key={i} cx={(i * 470 + t * 8) % 2200 - 140} cy={140 + (i % 2) * 60} rx={150} ry={34} fill="#fff" opacity={0.55} />)}
        {[[170, 300], [1580, 330], [1790, 250]].map(([x, h], i) => <g key={i}><rect x={x - 80} y={900 - h - 200} width={160} height={h + 200} fill={['#9AA8B6', '#8C9AAA', '#A3AFBC'][i]} />{Array.from({length: 12}, (_, j) => <rect key={j} x={x - 60 + (j % 3) * 44} y={900 - h - 180 + Math.floor(j / 3) * 70} width={30} height={40} fill="#C9D6E2" />)}</g>)}
        {[300, 1500].map((x, i) => <g key={'p' + i}><path d={`M${x},900 Q${x + 8},780 ${x - 4},640`} stroke="#5A4630" strokeWidth={14} fill="none" />{Array.from({length: 8}, (_, j) => <path key={j} d={`M${x - 4},640 q${Math.cos(j * 0.8) * 90},${-30 + Math.sin(j * 2 + t * 0.8) * 26} ${Math.cos(j * 0.8) * 150},${40}`} stroke="#2F6B3A" strokeWidth={16} fill="none" strokeLinecap="round" />)}</g>)}
        <g transform={`rotate(${sw} 960 900)`}><Fachada x={960} y={900} s={0.98} t={t} /></g>
        <rect y={900} width={1920} height={180} fill="#8E8A82" />
        <rect y={900} width={1920} height={16} fill="#B5B0A6" />
        {/* postes */}
        {[420, 1500].map((x) => <g key={x}><rect x={x - 5} y={760} width={10} height={150} fill="#2A2A2E" /><rect x={x - 22} y={748} width={44} height={16} rx={6} fill="#2A2A2E" /><circle cx={x} cy={770} r={9} fill="#FFE9B8" /></g>)}
        {/* carros estacionados */}
        {[[140, '#C0392B'], [1700, '#2E4A6E']].map(([x, c], i) => <g key={i} transform={`translate(${x},1010)`}><rect x={0} y={-50} width={220} height={50} rx={14} fill={c as string} /><path d="M36,-50 L70,-92 L160,-92 L190,-50 Z" fill={c as string} /><rect x={80} y={-86} width={44} height={30} fill="#BFD6E6" /><rect x={130} y={-86} width={44} height={30} fill="#BFD6E6" /><circle cx={50} cy={0} r={22} fill="#1A1A1A" /><circle cx={170} cy={0} r={22} fill="#1A1A1A" /></g>)}
        {pessoas > 0 && <>
          <g transform="translate(1120,1000) scale(0.62)"><Pessoa v={PORT} expr="susto" t={t} bD={[120, 40]} bE={[10, 10]} /></g>
          {MOR.map((v, i) => { const k = clamp01((lt - 0.2 - i * 0.5) / 3.2); const x = lerp(960, i === 1 ? 560 : i === 0 ? 700 : 1380, es(k)); return <g key={i} transform={`translate(${x},${1010 + i * 12 + Math.abs(Math.sin(lt * 7 + i)) * -5}) scale(0.6)`} opacity={k > 0 ? 1 : 0}><Pessoa v={v} expr="susto" t={t + i} bE={[20, 30]} bD={[20, 30]} /></g>; })}
        </>}
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== Interior: lustre de cristal balançando sozinho =====================
export const Lustre: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const ang = Math.sin(t * 1.9) * 8;
  const braco = (a: number, r: number, y: number, i: number) => {
    const x = Math.cos(a) * r, z = Math.sin(a);
    return <g key={i} opacity={0.75 + 0.25 * (z + 1) / 2}>
      <path d={`M0,${y - 20} Q${x * 0.5},${y + 10} ${x},${y}`} stroke="#C9A65A" strokeWidth={5} fill="none" />
      <rect x={x - 7} y={y - 24} width={14} height={24} rx={3} fill="#F4ECD8" />
      <path d={`M${x - 5},${y - 24} q5,-18 10,0 Z`} fill="#FFD27A" />
      <circle cx={x} cy={y - 32} r={20} fill="#FFE9B8" opacity={0.25} />
      {Array.from({length: 3}, (_, k) => <path key={k} d={`M${x + (k - 1) * 6},${y + 4} l-4,10 l4,14 l4,-14 Z`} fill="#E8F4FF" opacity={0.85} />)}
    </g>;
  };
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#3A2E24 0%,#5A4634 60%,#2A2018 100%)'}}>
      <SVG>
        {/* teto com moldura e rosácea */}
        <rect y={0} width={1920} height={40} fill="#4A3C30" />
        <ellipse cx={960} cy={40} rx={90} ry={18} fill="#C2AE88" />
        <rect y={760} width={1920} height={320} fill="#3A2A1C" />
        {Array.from({length: 12}, (_, i) => <line key={i} x1={i * 180} x2={i * 180 - 100} y1={760} y2={1080} stroke="#2A1E14" strokeWidth={4} />)}
        {/* papel de parede com listras e quadros */}
        {Array.from({length: 24}, (_, i) => <rect key={i} x={i * 80} y={40} width={40} height={720} fill="#5E4A38" opacity={0.35} />)}
        <rect x={200} y={200} width={340} height={440} rx={6} fill="#2A2018" stroke="#C9A65A" strokeWidth={12} />
        <path d="M230,600 L330,420 L400,520 L460,450 L510,600 Z" fill="#4A6A5A" />
        <rect x={1380} y={180} width={340} height={480} rx={8} fill="#1E2A3A" stroke="#8C7458" strokeWidth={12} />
        {Array.from({length: 20}, (_, i) => <rect key={i} x={1400 + (i % 5) * 64} y={200 + Math.floor(i / 5) * 110} width={38} height={60} fill="#FFD98A" opacity={rnd(i + 3) > 0.5 ? 0.6 : 0.1} />)}
        <ellipse cx={960 + Math.sin(ang * Math.PI / 180) * 560} cy={900} rx={200} ry={30} fill="#000" opacity={0.28} />
        <g transform={`rotate(${ang} 960 40)`}>
          <line x1={960} y1={40} x2={960} y2={300} stroke="#B89F74" strokeWidth={6} />
          {Array.from({length: 6}, (_, i) => <circle key={i} cx={960} cy={60 + i * 40} r={6} fill="#C9A65A" />)}
          <g transform="translate(960,330) scale(1.7)">
            <ellipse cx={0} cy={0} rx={40} ry={12} fill="#C9A65A" />
            <path d="M-26,0 Q0,90 26,0 Z" fill="#B8954A" />
            {/* cascata de cristais */}
            {Array.from({length: 14}, (_, i) => { const a = (i / 14) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 40} y1={6} x2={Math.cos(a) * 110} y2={70 + Math.sin(a) * 10} stroke="#E8F4FF" strokeWidth={1.5} strokeDasharray="4 5" opacity={0.7} />; })}
            {Array.from({length: 8}, (_, i) => braco((i / 8) * Math.PI * 2 + t * 0.2, 130, 80, i))}
            {Array.from({length: 6}, (_, i) => braco((i / 6) * Math.PI * 2 + 0.4 + t * 0.2, 80, 20, 20 + i))}
            <path d="M-14,90 l14,60 l14,-60 Z" fill="#E8F4FF" opacity={0.85} />
          </g>
        </g>
      </SVG>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 38%, rgba(255,220,150,0.22), transparent 55%)'}} />
    </AbsoluteFill>
  );
};

// ===================== Escritório: objetos tremendo sozinhos =====================
export const Escritorio: React.FC<{lt: number; t: number}> = ({lt, t}) => {
  const tr = tremor(t, 0.22, 4);
  const caneta = lerp(0, 160, KS(lt, 0.4, 2.2));
  return (
    <AbsoluteFill style={{background: '#2E3440'}}>
      <SVG>
        <rect width={1920} height={640} fill="#3B4252" />
        <rect x={1300} y={120} width={460} height={340} fill="#1E2A3A" stroke="#4C566A" strokeWidth={12} />
        {Array.from({length: 16}, (_, i) => <rect key={i} x={1320 + (i % 4) * 110} y={140 + Math.floor(i / 4) * 80} width={70} height={50} fill="#FFD98A" opacity={rnd(i + 9) > 0.5 ? 0.55 : 0.12} />)}
        <rect y={640} width={1920} height={440} fill="#5A4636" />
        <rect y={640} width={1920} height={20} fill="#6E5644" />
        <g transform={`translate(${tr.x},${tr.y * 0.6})`}>
          {/* monitor */}
          <rect x={280} y={300} width={460} height={300} rx={12} fill="#1E2430" /><rect x={300} y={320} width={420} height={250} fill="#2F4A6E" />
          {Array.from({length: 6}, (_, i) => <rect key={i} x={330} y={350 + i * 34} width={240 + rnd(i) * 120} height={12} rx={6} fill="#9FC4E8" opacity={0.5} />)}
          <rect x={490} y={600} width={40} height={50} fill="#1E2430" /><rect x={430} y={640} width={160} height={14} rx={6} fill="#1E2430" />
          {/* papéis */}
          <rect x={800} y={600} width={260} height={40} rx={4} fill="#F2F0E8" transform="rotate(-3 930 620)" />
          <rect x={820} y={590} width={240} height={40} rx={4} fill="#E8E6DC" transform="rotate(4 940 610)" />
          {/* porta-canetas */}
          <rect x={1120} y={540} width={70} height={100} rx={8} fill="#8C2F39" />
          {[0, 1, 2].map((i) => <line key={i} x1={1140 + i * 15} y1={540} x2={1132 + i * 18 + Math.sin(t * 9 + i) * 3} y2={480} stroke={['#2E6FD0', '#222', '#C0392B'][i]} strokeWidth={6} strokeLinecap="round" />)}
          {/* caneca de café com a superfície tremendo */}
          <g transform="translate(1290,640)"><rect x={-50} y={-110} width={100} height={110} rx={12} fill="#E8E6DC" /><path d="M50,-80 q34,0 34,30 q0,30 -34,30" stroke="#E8E6DC" strokeWidth={12} fill="none" /><ellipse cx={0} cy={-104} rx={44} ry={8} fill="#5A3A22" />{[0, 1].map((i) => { const k = (t * 1.6 + i / 2) % 1; return <ellipse key={i} cx={0} cy={-104} rx={6 + k * 36} ry={1 + k * 6} fill="none" stroke="#C9A27A" strokeWidth={1.5} opacity={1 - k} />; })}</g>
        </g>
        {/* caneta rolando sozinha pela mesa */}
        <g transform={`translate(${700 + caneta},652) rotate(${caneta * 2.2})`}><rect x={-50} y={-6} width={100} height={12} rx={6} fill="#2E6FD0" /><rect x={30} y={-6} width={20} height={12} fill="#1E4A90" /></g>
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== Cartão de notícia (fundo branco, texto preto, grifo só na frase-chave) =====================
export type InfoNoticia = {w: number; h: number; linhas: {x: number; y: number; w: number; h: number}[]; destaques?: {x: number; y: number; w: number; h: number}[]};
export const Noticia: React.FC<{lt: number; d: number; img: string; info: InfoNoticia; fonte: string; data: string; fundo: React.ReactNode; g0?: number; g1?: number; cor?: string}> = ({lt, d, img, info, fonte, data, fundo, g0 = 0.6, g1, cor = 'rgba(255,214,0,0.62)'}) => {
  const maxW = 1500, maxH = 660;
  const sc = Math.min(maxW / info.w, maxH / info.h, 2.2);
  const W = info.w * sc, H = info.h * sc;
  const k = KO(lt, 0, 0.45);
  const fim = g1 ?? Math.min(d - 0.6, g0 + 2.4);
  const D = (info.destaques || []).filter((x: any) => x.w);
  const tot = D.reduce((s0, r) => s0 + r.w, 0) || 1;
  let acc = 0;
  return (
    <AbsoluteFill style={{background: '#05070D'}}>
      <AbsoluteFill style={{filter: 'blur(10px) brightness(0.42) saturate(0.8)', transform: `scale(${lerp(1.1, 1.12, es(lt / d))})`}}>{fundo}</AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1), rgba(0,0,0,0.65) 100%)'}} />
      <div style={{position: 'absolute', left: 960 - W / 2, top: 540 - H / 2 + 30, width: W, height: H, transform: `translateY(${(1 - k) * 30}px) scale(${lerp(1, 1.02, es(lt / d))})`, opacity: k, boxShadow: '0 30px 80px rgba(0,0,0,0.65)', borderRadius: 10, overflow: 'hidden', background: '#fff'}}>
        {D.map((l, i) => {
          const a = lerp(g0, fim, acc / tot); acc += l.w; const b = lerp(g0, fim, acc / tot);
          const p = clamp01((lt - a) / Math.max(0.01, b - a));
          return <div key={i} style={{position: 'absolute', left: l.x * sc - 4, top: l.y * sc + l.h * sc * 0.05, width: (l.w + 8) * sc * p, height: l.h * sc * 0.92, background: cor, borderRadius: 4}} />;
        })}
        <Img src={staticFile(img)} style={{position: 'absolute', left: 0, top: 0, width: W, height: H, mixBlendMode: 'multiply'}} />
      </div>
      <div style={{position: 'absolute', left: 960 - W / 2, top: 540 - H / 2 - 50, opacity: KO(lt, 0.15, 0.6), display: 'flex', alignItems: 'center', gap: 14}}>
        <span style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: '#06080F', background: COR.ouro, padding: '6px 14px', borderRadius: 6}}>FONTE</span>
        <span style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: '#fff'}}>{fonte}</span>
        <span style={{fontFamily: F.rotulo, fontWeight: 500, fontSize: 22, letterSpacing: 2, color: '#C3CAD8'}}>· {data}</span>
      </div>
    </AbsoluteFill>
  );
};

// ===================== Mapa real da América do Sul (satélite) =====================
const BOX = {lon0: -100, lon1: 20, lat0: 50, lat1: -60};
export const MapaAS: React.FC<{lt: number; d: number; lonC: number; latC: number; s0: number; s1: number; children?: (P: (lon: number, lat: number) => [number, number]) => React.ReactNode; html?: (P: (lon: number, lat: number) => [number, number]) => React.ReactNode; escuro?: number}> = ({lt, d, lonC, latC, s0, s1, children, html, escuro = 0.35}) => {
  const s = lerp(s0, s1, es(lt / d));
  const P = (lon: number, lat: number): [number, number] => [960 + (lon - lonC) * s, 540 - (lat - latC) * s];
  const [x0, y0] = P(BOX.lon0, BOX.lat0);
  return (
    <AbsoluteFill style={{background: '#06142A'}}>
      <Img src={staticFile('mapa_as.jpg')} style={{position: 'absolute', left: x0, top: y0, width: (BOX.lon1 - BOX.lon0) * s, height: (BOX.lat0 - BOX.lat1) * s, filter: `brightness(${1 - escuro}) saturate(0.95) contrast(1.05)`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)'}} />
      {children && <SVG>{children(P)}</SVG>}
      {html && html(P)}
    </AbsoluteFill>
  );
};
export const Rotulo: React.FC<{x: number; y: number; txt: string; sub?: string; cor?: string; op?: number; lado?: 1 | -1}> = ({x, y, txt, sub, cor = COR.ouro, op = 1, lado = 1}) => (
  <div style={{position: 'absolute', left: x + lado * 24, top: y, opacity: op, transform: `translate(${lado < 0 ? '-100%' : '0'},-50%)`, padding: '8px 16px', borderRadius: 9, background: 'rgba(6,10,20,0.86)', borderLeft: `4px solid ${cor}`, boxShadow: '0 8px 24px rgba(0,0,0,0.5)'}}>
    <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 38, color: '#fff', lineHeight: 1}}>{txt}</div>
    {sub && <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 16, letterSpacing: 3, color: '#C3CAD8', marginTop: 4}}>{sub}</div>}
  </div>
);
export const Pulso: React.FC<{p: [number, number]; t: number; cor: string; op?: number; r?: number}> = ({p, t, cor, op = 1, r = 10}) => (
  <g opacity={op}>
    {[0, 0.33, 0.66].map((o) => { const k = (t * 0.8 + o) % 1; return <circle key={o} cx={p[0]} cy={p[1]} r={r + k * 70} fill="none" stroke={cor} strokeWidth={3} opacity={1 - k} />; })}
    <circle cx={p[0]} cy={p[1]} r={r} fill={cor} stroke="#fff" strokeWidth={3} />
  </g>
);

// ===================== Mapa oficial (ShakeMap USGS) =====================
export const MapaOficial: React.FC<{lt: number; d: number; img: string; titulo: string}> = ({lt, d, img, titulo}) => (
  <AbsoluteFill style={{background: '#0A0F1A'}}>
    <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative', height: 900, transform: `scale(${lerp(1, 1.025, es(lt / d))})`, boxShadow: '0 30px 80px rgba(0,0,0,0.6)', borderRadius: 8, overflow: 'hidden', opacity: KO(lt, 0, 0.4)}}>
        <Img src={staticFile(img)} style={{height: 900, display: 'block'}} />
      </div>
    </AbsoluteFill>
    <div style={{position: 'absolute', left: 80, top: 80, opacity: KO(lt, 0.2, 0.6), padding: '12px 20px', borderRadius: 10, background: 'rgba(6,10,20,0.9)', borderLeft: `5px solid ${COR.ouro}`}}>
      <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 18, letterSpacing: 4, color: '#C3CAD8'}}>MAPA OFICIAL DE INTENSIDADE · USGS</div>
      <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 44, color: '#fff', marginTop: 4}}>{titulo}</div>
    </div>
  </AbsoluteFill>
);

// ===================== Prédio alto balançando x casa térrea =====================
export const PredioPendulo: React.FC<{lt: number; t: number; amp: number}> = ({lt, t, amp}) => {
  const a = Math.sin(t * 1.4) * amp;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#1B2A44 0%,#3C5478 70%)'}}>
      <SVG>
        <rect y={940} width={1920} height={140} fill="#2A2F38" />
        <g transform={`translate(860,940) skewX(${a})`}>
          <rect x={-150} y={-820} width={300} height={820} fill="#4A5568" />
          {Array.from({length: 13}, (_, r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={-125 + c * 66} y={-790 + r * 60} width={44} height={36} fill={rnd(r * 7 + c) > 0.4 ? '#FFD98A' : '#2A3242'} opacity={0.85} />))}
        </g>
        <g transform="translate(1340,940)"><rect x={-130} y={-150} width={260} height={150} fill="#7A6450" /><path d="M-150,-148 L0,-240 L150,-148 Z" fill="#5A4636" /><rect x={-40} y={-90} width={80} height={90} fill="#3A2A1C" /><rect x={-110} y={-120} width={50} height={40} fill="#FFD98A" /></g>
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== A cozinha (detalhada) + o copo d'água (aparece quando é citado) =====================
export const Cozinha: React.FC<{lt: number; t: number; onda: number; tremorK?: number; close?: number; copo?: number}> = ({lt, t, onda, tremorK = 0, close = 0, copo = 1}) => {
  const tr = tremor(t, tremorK, 2);
  const z = lerp(1, 2.3, close);
  const lampX = 760 + Math.sin(t * 1.3) * tremorK * 30;
  const cs = copo >= 1 ? 1 : es(copo);
  return (
    <AbsoluteFill style={{background: '#1A1E28', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${tr.x}px,${tr.y}px) rotate(${tr.r}deg) scale(${z})`, transformOrigin: '50% 62%'}}>
        <SVG>
          <defs>
            <linearGradient id="parede" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2C3446" /><stop offset="100%" stopColor="#3A4256" /></linearGradient>
            <linearGradient id="agua" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#BFE6FF" stopOpacity={0.75} /><stop offset="100%" stopColor="#6FB4E8" stopOpacity={0.55} /></linearGradient>
            <radialGradient id="luzLamp" cx="50%" cy="0%"><stop offset="0%" stopColor="#FFE9B8" stopOpacity={0.5} /><stop offset="100%" stopColor="#FFE9B8" stopOpacity={0} /></radialGradient>
            <linearGradient id="geladeira" x1="0" x2="1"><stop offset="0%" stopColor="#D8DDE4" /><stop offset="100%" stopColor="#AEB6C2" /></linearGradient>
          </defs>
          <rect width={1920} height={1080} fill="url(#parede)" />
          {Array.from({length: 24}, (_, i) => <line key={'v' + i} x1={i * 80} x2={i * 80} y1={420} y2={640} stroke="#46506A" strokeWidth={1.5} />)}
          {Array.from({length: 4}, (_, i) => <line key={'h' + i} x1={0} x2={1920} y1={420 + i * 70} y2={420 + i * 70} stroke="#46506A" strokeWidth={1.5} />)}
          {/* janela com cortina e cidade */}
          <rect x={1180} y={140} width={560} height={300} fill="#0C1426" stroke="#5A6276" strokeWidth={14} />
          {Array.from({length: 14}, (_, i) => { const h = 60 + rnd(i) * 180; return <g key={i}><rect x={1194 + i * 40} y={440 - h} width={34} height={h} fill="#141E34" />{Array.from({length: Math.floor(h / 26)}, (_, j) => rnd(i * 11 + j) > 0.5 && <rect key={j} x={1200 + i * 40} y={448 - h + j * 24} width={8} height={8} fill="#FFD98A" opacity={0.7} />)}</g>; })}
          <line x1={1460} x2={1460} y1={140} y2={440} stroke="#5A6276" strokeWidth={8} />
          <path d="M1170,130 L1250,130 Q1230,300 1260,450 L1170,450 Z" fill="#8C3B3B" opacity={0.9} />
          <path d="M1750,130 L1670,130 Q1690,300 1660,450 L1750,450 Z" fill="#8C3B3B" opacity={0.9} />
          <rect x={1160} y={120} width={600} height={14} rx={6} fill="#2A2420" />
          {/* vaso de planta na janela */}
          <g transform="translate(1300,440)"><rect x={-26} y={-40} width={52} height={40} rx={6} fill="#B5651D" />{Array.from({length: 6}, (_, i) => <path key={i} d={`M0,-40 q${(i - 2.5) * 14},-40 ${(i - 2.5) * 22},-70`} stroke="#3E8E4A" strokeWidth={8} fill="none" strokeLinecap="round" />)}</g>
          {/* relógio */}
          <g transform="translate(1000,200)"><circle r={50} fill="#F2F0E8" stroke="#2A2420" strokeWidth={6} />{Array.from({length: 12}, (_, i) => <line key={i} x1={Math.sin(i / 12 * Math.PI * 2) * 40} y1={-Math.cos(i / 12 * Math.PI * 2) * 40} x2={Math.sin(i / 12 * Math.PI * 2) * 46} y2={-Math.cos(i / 12 * Math.PI * 2) * 46} stroke="#2A2420" strokeWidth={3} />)}<line x1={0} y1={0} x2={0} y2={-30} stroke="#2A2420" strokeWidth={5} /><line x1={0} y1={0} x2={Math.sin(t * 0.5) * 38} y2={-Math.cos(t * 0.5) * 38} stroke="#C0392B" strokeWidth={2} /></g>
          {/* armários com puxadores e louça na prateleira */}
          <rect x={140} y={120} width={720} height={250} rx={10} fill="#5A4636" />
          {[0, 1, 2].map((i) => <g key={i}><rect x={160 + i * 236} y={140} width={220} height={210} rx={6} fill="#6A5442" /><rect x={260 + i * 236} y={300} width={20} height={8} rx={3} fill="#C9B79C" /></g>)}
          <rect x={140} y={380} width={720} height={10} fill="#4A3828" />
          {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={200 + i * 40} cy={372} rx={16} ry={6} fill="#E8E6DC" />)}
          {[0, 1, 2].map((i) => <rect key={'x' + i} x={560 + i * 50} y={330} width={36} height={44} rx={4} fill={['#2E6FD0', '#C0392B', '#E9C46A'][i]} opacity={0.85} />)}
          {/* geladeira com ímãs */}
          <rect x={20} y={300} width={110} height={560} rx={10} fill="url(#geladeira)" />
          <line x1={20} x2={130} y1={500} y2={500} stroke="#8C95A3" strokeWidth={3} />
          <rect x={110} y={360} width={8} height={90} rx={3} fill="#7A8494" /><rect x={110} y={540} width={8} height={120} rx={3} fill="#7A8494" />
          {[[50, 380, '#E9C46A'], [80, 420, '#2A9D8F'], [45, 560, '#D1495B']].map(([x, y, c], i) => <rect key={i} x={x as number} y={y as number} width={22} height={18} rx={3} fill={c as string} />)}
          {/* bancada, fogão e escorredor */}
          <rect x={0} y={640} width={1920} height={30} fill="#9A8C7A" />
          <rect x={0} y={670} width={1920} height={410} fill="#2A2420" />
          <g transform="translate(1520,640)"><rect x={-110} y={-6} width={220} height={12} fill="#3A3A3E" />{[-55, 55].map((x) => <ellipse key={x} cx={x} cy={-8} rx={36} ry={7} fill="#1E1E22" />)}<rect x={-30} y={-70} width={60} height={60} rx={8} fill="#7A8494" /><rect x={-36} y={-76} width={72} height={10} rx={4} fill="#5E6876" /></g>
          <g transform="translate(320,640)"><rect x={-70} y={-12} width={140} height={12} fill="#9AA4B0" />{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={-48 + i * 32} cy={-40} rx={8} ry={30} fill="#E8E6DC" />)}</g>
          {/* fruteira */}
          <g transform="translate(1160,640)"><path d="M-70,-10 Q0,30 70,-10 Z" fill="#B5651D" />{[[-36, '#E9C46A'], [-6, '#D1495B'], [24, '#F4A259'], [8, '#6A9A3A']].map(([x, c], i) => <circle key={i} cx={x as number} cy={-22 - (i === 3 ? 18 : 0)} r={20} fill={c as string} />)}</g>
          {/* lâmpada pendente */}
          <line x1={760} x2={lampX} y1={0} y2={240} stroke="#222" strokeWidth={3} />
          <g transform={`translate(${lampX},240)`}><path d="M-60,0 L60,0 L40,-40 L-40,-40 Z" fill="#1E2430" /><ellipse cx={0} cy={4} rx={40} ry={10} fill="#FFE9B8" /></g>
          <path d={`M${760 - 420},${660} L${760 + 420},${660} L${760 + 60},${244} L${760 - 60},${244} Z`} fill="url(#luzLamp)" />
          {/* mesa com toalha e cadeiras */}
          <rect x={360} y={760} width={1200} height={36} rx={8} fill="#7A5A3C" />
          <path d="M520,760 L1400,760 L1380,800 L540,800 Z" fill="#E8DCC8" opacity={0.9} />
          {Array.from({length: 8}, (_, i) => <line key={i} x1={560 + i * 110} x2={555 + i * 110} y1={760} y2={800} stroke="#C0392B" strokeWidth={4} opacity={0.5} />)}
          <rect x={420} y={796} width={36} height={284} fill="#5A3E28" /><rect x={1464} y={796} width={36} height={284} fill="#5A3E28" />
          {[250, 1670].map((x) => <g key={x}><rect x={x - 70} y={620} width={20} height={460} rx={6} fill="#4A3424" /><rect x={x - 70} y={820} width={140} height={20} rx={6} fill="#5A3E28" /><rect x={x + 50} y={820} width={20} height={260} rx={6} fill="#4A3424" /></g>)}
          {/* o copo */}
          {copo > 0 && <g transform={`translate(960,760) scale(${cs}) `} opacity={Math.min(1, copo * 3)}>
            <ellipse cx={0} cy={0} rx={70} ry={12} fill="#000" opacity={0.3} />
            <path d="M-56,-210 L56,-210 L46,0 L-46,0 Z" fill="rgba(220,235,250,0.18)" stroke="rgba(230,240,255,0.7)" strokeWidth={4} />
            <path d={`M-53,-150 ${Array.from({length: 22}, (_, i) => { const x = -53 + i * 5.05; const y = -150 + Math.sin(i * 0.9 + t * 9) * 4 * onda + Math.sin(t * 3) * 3 * onda * (x / 53); return `L${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ')} L49,-4 L-49,-4 Z`} fill="url(#agua)" />
            <ellipse cx={0} cy={-150} rx={53} ry={8} fill="#DFF3FF" opacity={0.5} />
            {onda > 0.05 && [0, 1, 2].map((i) => { const k = ((t * 1.4 + i / 3) % 1); return <ellipse key={i} cx={0} cy={-150} rx={6 + k * 46} ry={1.5 + k * 7} fill="none" stroke="#FFFFFF" strokeWidth={1.6} opacity={(1 - k) * Math.min(1, onda * 2)} />; })}
            <path d="M-40,-200 L-34,-20" stroke="#fff" strokeWidth={6} opacity={0.25} strokeLinecap="round" />
            {copo < 1 && <circle cx={0} cy={-100} r={140 * (1 - copo)} fill="none" stroke="#FFE9B8" strokeWidth={3} opacity={1 - copo} />}
          </g>}
        </SVG>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 60%, transparent 40%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};

// ===================== Número gigante =====================
export const NumeroGigante: React.FC<{lt: number; d: number; t: number; txt: string; sub?: string}> = ({lt, d, t, txt, sub}) => {
  const tr = tremor(t, 0.25 * KS(lt, 0.4, d), 7);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #3A0E14, #08030A 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <div style={{transform: `translate(${tr.x}px,${tr.y}px) scale(${lerp(1, 1.025, es(lt / d))})`}}><Numero cor={COR.perigo} size={340} op={KO(lt, 0.05, 0.35)}>{txt}</Numero></div>
      {sub && <div style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 30, letterSpacing: 10, color: '#E8C8C8', marginTop: 70, padding: '8px 22px', borderRadius: 8, background: 'rgba(6,10,20,0.6)', opacity: KO(lt, 0.4, 0.8)}}>{sub}</div>}
    </AbsoluteFill>
  );
};

// ===================== A escada de magnitude (cada degrau maior) =====================
export const EscadaMag: React.FC<{lt: number; d: number; t: number; ate: number}> = ({lt, d, t, ate}) => {
  const degs = [2, 3, 4, 5, 6, 7, 8, 9, 9.5];
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#0B1222,#141C30)'}}>
      <SVG>
        {degs.map((m, i) => {
          const on = KO(lt, 0.2 + i * (ate / degs.length), 0.5 + i * (ate / degs.length));
          const x = 260 + i * 150, h = 60 + i * 80;
          return <g key={m} opacity={0.25 + 0.75 * on}>
            <rect x={x} y={900 - h} width={140} height={h} rx={6} fill={corMag(m)} />
            <text x={x + 70} y={900 - h - 18} textAnchor="middle" fill="#fff" style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 40}}>{m === 9.5 ? '9,5' : m}</text>
          </g>;
        })}
        <g transform={`translate(${lerp(300, 1500, KS(lt, 0.3, d))},${lerp(840, 180, KS(lt, 0.3, d))}) scale(0.32)`}><Pessoa v={VOCE} vista="costas" t={t} /></g>
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== Brasil no escuro: o ponto no Acre =====================
export const BrasilAcre: React.FC<{lt: number; d: number; t: number; corte?: number}> = ({lt, d, t, corte = 0}) => (
  <MapaAS lt={lt} d={d} lonC={-55} latC={-14} s0={26} s1={27} escuro={0.7}
    children={(P) => <Pulso p={P(-70.77, -8.16)} t={t} cor={COR.perigo} op={KO(lt, 0.4, 0.9)} />}
    html={(P) => { const [x, y] = P(-70.77, -8.16); return <div style={{position: 'absolute', left: x + 30, top: y - 30, opacity: KO(lt, 1.0, 1.4), fontFamily: F.titulo, fontWeight: 700, fontSize: 64, color: COR.perigo, textShadow: '0 4px 18px rgba(0,0,0,0.7)'}}>???</div>; }} />
);

// ===================== Corte da Terra (teaser) =====================
export const CorteTeaser: React.FC<{lt: number; d: number; t: number}> = ({lt, d, t}) => {
  const clar = (Math.sin(t * 2.4) + 1) / 2;
  return (
    <AbsoluteFill style={{background: '#06080F'}}>
      <SVG>
        <defs><linearGradient id="manto" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5A3A22" /><stop offset="100%" stopColor="#8A2A10" /></linearGradient></defs>
        <rect x={0} y={260} width={1920} height={820} fill="url(#manto)" />
        <path d="M0,260 L560,260 L700,150 L820,240 L1920,250 L1920,300 L0,300 Z" fill="#6E7F5A" />
        <path d="M0,300 L1920,300 L1920,330 L0,330 Z" fill="#3A2C20" />
        {/* placa mergulhando */}
        <path d="M0,330 L520,340 C760,380 1000,560 1260,860 L1180,900 C940,620 720,450 480,400 L0,390 Z" fill="#2E3A4E" opacity={0.95} />
        <circle cx={1220} cy={870} r={30 + clar * 20} fill="#FFE08A" opacity={0.6 + 0.4 * clar} />
        <circle cx={1220} cy={870} r={110} fill="#FFB547" opacity={0.18 * clar} />
        <text x={1360} y={230} fill="#fff" style={{fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 4}}>ACRE</text>
        <text x={1270} y={890} fill="#fff" opacity={KO(lt, 0.8, 1.2)} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 64}}>???</text>
      </SVG>
    </AbsoluteFill>
  );
};
