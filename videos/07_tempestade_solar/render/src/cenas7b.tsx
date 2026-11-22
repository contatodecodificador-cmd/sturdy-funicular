/* Vídeo 7 — cenas 2D dos blocos 3 (impacto), 4 (ponto fraco), 5 (honestidade) e fecho */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {F} from './theme';
import {lerp, rnd, clamp01, prog, KO, KS, es} from './base';
import {Pessoa, CIENTISTA, VOCE} from './personagens';
import {SVG, COR, Espaco, SolG, Globo, MapaAS, Mundo, Rotulo, Pulso, Traco, suave, pts} from './comum7';
import {P} from './cenas7a';

const Label: React.FC<{x: number; y: number; txt: string; cor?: string; op?: number; size?: number}> = ({x, y, txt, cor = COR.ouro, op = 1, size = 30}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: op, transform: 'translate(-50%,-50%)', fontFamily: F.rotulo, fontWeight: 700, fontSize: size, letterSpacing: 4, color: cor, whiteSpace: 'nowrap', textShadow: '0 2px 12px rgba(0,0,0,0.8)'}}>{txt}</div>
);

// ===================== satélite de alerta (L1) =====================
export const L1: React.FC<P> = ({lt, t}) => {
  const k = KS(lt, 0.2, 3.5);
  return (
    <AbsoluteFill>
      <Espaco t={t} />
      <SVG>
        <SolG x={150} y={540} r={170} t={t} furia={0.7} id="l1" />
        <Globo cx={1760} cy={540} r={90} lon={-50} lat={-10} />
        <ellipse cx={lerp(380, 1500, k)} cy={540} rx={120 + k * 60} ry={260} fill={COR.plasma} opacity={0.22} />
        <ellipse cx={lerp(380, 1500, k)} cy={540} rx={60 + k * 30} ry={200} fill="none" stroke={COR.plasma} strokeWidth={6} opacity={0.6} />
        <g transform="translate(1240 540)">
          <rect x={-130} y={-22} width={90} height={44} fill="#1E3A7A" stroke="#4A6BB0" strokeWidth={3} /><rect x={40} y={-22} width={90} height={44} fill="#1E3A7A" stroke="#4A6BB0" strokeWidth={3} />
          <rect x={-40} y={-40} width={80} height={80} rx={8} fill="#C9A24E" />
          {lerp(380, 1500, k) > 1100 && [0, 1, 2].map((q) => <circle key={q} cx={0} cy={0} r={60 + q * 40 + ((lt * 80) % 40)} fill="none" stroke="#FF5A3C" strokeWidth={4} opacity={0.6 - q * 0.18} />)}
        </g>
        <path d="M1240 700 L1240 740 L1760 740 L1760 700" fill="none" stroke="#C3CAD8" strokeWidth={3} />
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== GPS: satélite com o sinal tremendo =====================
export const Gps: React.FC<P> = ({lt, t}) => {
  const trem = KS(lt, 0.8, 1.8);
  return (
    <AbsoluteFill>
      <Espaco t={t} />
      <SVG>
        <Globo cx={960} cy={1500} r={1000} lon={-50} lat={-15} />
        <g transform={`translate(960 260) rotate(${Math.sin(t) * 3})`}>
          <rect x={-260} y={-30} width={200} height={60} fill="#1E3A7A" stroke="#4A6BB0" strokeWidth={3} /><rect x={60} y={-30} width={200} height={60} fill="#1E3A7A" stroke="#4A6BB0" strokeWidth={3} />
          <rect x={-60} y={-60} width={120} height={120} rx={10} fill="#D8DCE4" /><circle cx={0} cy={60} r={22} fill="#888" />
        </g>
        {Array.from({length: 8}, (_, i) => { const k = ((lt * 0.8 + i / 8) % 1); const y = 340 + k * 330; const jx = trem * (rnd(i + Math.floor(t * 12)) - 0.5) * 120; return <path key={i} d={`M${880 + jx},${y} Q960,${y + 20} ${1040 + jx},${y}`} fill="none" stroke={trem > 0.5 ? '#FF7A59' : '#7CC4FF'} strokeWidth={5} opacity={0.8 * (1 - k)} />; })}
        <circle cx={960 + trem * 60 * Math.sin(t * 7)} cy={690} r={14} fill="#FFFFFF" stroke="#2A6CB0" strokeWidth={4} />
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== equador magnético cruzando o Brasil =====================
const EQ_MAG: [number, number][] = [[-82, -6], [-76, -10], [-70, -12], [-62, -13], [-54, -12], [-46, -10], [-40, -8.5], [-34, -7.5], [-20, -5]];
export const EquadorMagnetico: React.FC<P> = ({lt, d}) => (
  <MapaAS lt={lt} d={d} lonC={-55} latC={-14} s0={24} s1={24} escuro={0.45}
    children={(Pj) => <g><Traco d={suave(EQ_MAG.map(([a, b]) => Pj(a, b)))} k={KS(lt, 0.2, 1.8)} cor="#FFD84A" w={7} L={2400} /></g>}
    html={(Pj) => <Rotulo x={Pj(-40, -8.5)[0]} y={Pj(-40, -8.5)[1] - 70} txt="EQUADOR MAGNÉTICO" cor="#FFD84A" op={KO(lt, 1.2, 1.6)} size={28} />} />
);

// ===================== mapas do Brasil com camadas =====================
const BOLHAS = Array.from({length: 22}, (_, i) => ({lon: -70 + rnd(i) * 34, lat: -2 - rnd(i + 3) * 18, h: 2 + rnd(i + 6) * 5, f: rnd(i + 9)}));
const SOJA = Array.from({length: 140}, (_, i) => ({lon: -60 + rnd(i) * 14 + (rnd(i + 8) > 0.7 ? 8 : 0), lat: -10 - rnd(i + 2) * 12, f: rnd(i + 4)}));
const LINHOES: [number, number][][] = [[[-63.9, -8.76], [-58, -12], [-53, -16.5], [-48.2, -21.8]], [[-54.6, -25.4], [-51.5, -24], [-48.5, -23.6], [-46.6, -23.5]], [[-48.6, -18.4], [-47.9, -19.7], [-50.2, -19.0]]];
export const BrasilMapa: React.FC<P> = ({lt, d, t, arg}) => {
  const kind = arg || 'vazio';
  const lonC = kind === 'goias' ? -49 : kind === 'anomalia' ? -45 : -53, latC = kind === 'goias' ? -18 : kind === 'anomalia' ? -22 : -14, s = kind === 'goias' ? 52 : kind === 'anomalia' ? 26 : 26;
  return (
    <MapaAS lt={lt} d={d} lonC={lonC} latC={latC} s0={s} s1={s} escuro={kind === 'bolhas' || kind === 'linhas' ? 0.6 : 0.4}
      children={(Pj) => <g>
        <defs>
          <linearGradient id="bolha" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor={COR.roxo} stopOpacity="0.0" /><stop offset="0.3" stopColor={COR.roxo} stopOpacity="0.55" /><stop offset="1" stopColor={COR.roxo} stopOpacity="0" /></linearGradient>
          <radialGradient id="anomG"><stop offset="0" stopColor="#FF3A2A" stopOpacity="0.7" /><stop offset="0.6" stopColor="#FF3A2A" stopOpacity="0.25" /><stop offset="1" stopColor="#FF3A2A" stopOpacity="0" /></radialGradient>
        </defs>
        {kind === 'bolhas' && BOLHAS.map((b, i) => { const [x, y] = Pj(b.lon, b.lat); const k = KO(lt, b.f * 1.5, b.f * 1.5 + 0.8); const h = b.h * 26 * k; return <ellipse key={i} cx={x + Math.sin(t + i) * 6} cy={y - h / 2} rx={22} ry={h / 2 + 10} fill="url(#bolha)" opacity={k} />; })}
        {kind === 'soja' && SOJA.map((p, i) => { const [x, y] = Pj(p.lon, p.lat); return <rect key={i} x={x} y={y} width={12} height={9} fill="#E6D34A" opacity={0.8 * KO(lt, p.f * 1.4, p.f * 1.4 + 0.4)} />; })}
        {kind === 'linhas' && LINHOES.map((l, i) => <Traco key={i} d={suave(l.map(([a, b]) => Pj(a, b)))} k={KS(lt, 0.2 + i * 0.4, 1.6 + i * 0.4)} cor="#FFD84A" w={6} L={2000} />)}
        {kind === 'goias' && <Pulso p={Pj(-49.2, -18.4)} t={t} cor={COR.perigo} r={12} />}
        {kind === 'goias' && <Traco d={suave([Pj(-49.2, -18.4), Pj(-50.5, -19.0)])} k={KS(lt, 0.2, 1.0)} cor="#FFD84A" w={6} L={600} />}
        {kind === 'anomalia' && <ellipse cx={Pj(-45, -26)[0]} cy={Pj(-45, -26)[1]} rx={420 * (0.92 + 0.08 * Math.sin(t * 2))} ry={300 * (0.92 + 0.08 * Math.sin(t * 2))} fill="url(#anomG)" />}
      </g>}
      html={(Pj) => <>
        {kind === 'goias' && <Rotulo x={Pj(-49.2, -18.4)[0]} y={Pj(-49.2, -18.4)[1]} txt="ITUMBIARA (GO)" sub="LINHA MEDIDA · INPE / FURNAS" cor={COR.perigo} op={KO(lt, 0.4, 0.8)} size={30} />}
        {kind === 'bolhas' && lt > 1.2 && <Rotulo x={1520} y={180} txt="BOLHAS DE PLASMA" cor={COR.roxo} op={KO(lt, 1.2, 1.6)} size={26} />}
      </>} />
  );
};
export const InpeMapa: React.FC<P> = (p) => (
  <AbsoluteFill>
    <BrasilMapa {...p} arg="bolhas" />
    <div style={{position: 'absolute', left: 70, top: 70, padding: '10px 20px', borderRadius: 8, background: 'rgba(6,10,20,0.88)', borderLeft: `5px solid ${COR.ouro}`, fontFamily: F.rotulo, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: '#fff', opacity: KO(p.lt, 0.2, 0.5)}}>INPE · CLIMA ESPACIAL (EMBRACE)</div>
  </AbsoluteFill>
);

// ===================== celular e torres sincronizadas pelo relógio do GPS =====================
const Celular: React.FC<{x: number; y: number; s?: number; children?: React.ReactNode; semSinal?: boolean; t: number}> = ({x, y, s = 1, children, semSinal, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-170} y={-340} width={340} height={680} rx={46} fill="#14161C" stroke="#4A4E5A" strokeWidth={6} />
    <rect x={-150} y={-310} width={300} height={620} rx={30} fill="#0C1426" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={-130 + i * 16} y={-290 - i * 6} width={10} height={10 + i * 6} fill={semSinal ? '#444A56' : '#E8ECF2'} />)}
    {semSinal && <text x={30} y={-276} fontFamily="Inter" fontWeight={700} fontSize={22} fill="#FF7A59">SEM SERVIÇO</text>}
    {children}
  </g>
);
export const CelularGps: React.FC<P> = ({lt, t}) => {
  const s = Math.floor(31 + lt);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #1A2238, #070A12 70%)'}}>
      <SVG>
        <Celular x={960} y={600} t={t}><text x={0} y={-40} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={110} fill="#fff">12:04</text><text x={0} y={30} textAnchor="middle" fontFamily="Oswald" fontSize={44} fill="#9FB0C8">:{String(s % 60).padStart(2, '0')}</text></Celular>
        <g transform="translate(1500 180)"><rect x={-90} y={-20} width={60} height={40} fill="#1E3A7A" /><rect x={30} y={-20} width={60} height={40} fill="#1E3A7A" /><rect x={-30} y={-30} width={60} height={60} rx={6} fill="#D8DCE4" /></g>
        {Array.from({length: 6}, (_, i) => { const k = ((lt * 0.7 + i / 6) % 1); return <circle key={i} cx={lerp(1500, 1090, k)} cy={lerp(210, 330, k)} r={7} fill="#7CC4FF" opacity={1 - k} />; })}
      </SVG>
    </AbsoluteFill>
  );
};
export const Torres: React.FC<P> = ({lt, t}) => {
  const des = KS(lt, 1.2, 2.2);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0E1730 0%, #22305A 70%, #101626 71%)'}}>
      <SVG>
        {[360, 960, 1560].map((x, i) => <g key={i} transform={`translate(${x} 770)`}>
          <path d="M-70,0 L0,-480 L70,0 M-50,-140 L50,-140 M-36,-260 L36,-260 M-22,-380 L22,-380 M-70,0 L36,-260 M70,0 L-36,-260" fill="none" stroke="#9AA4B8" strokeWidth={6} />
          {[-40, 40].map((dx) => <rect key={dx} x={dx - 10} y={-470} width={20} height={60} fill="#C9CED8" />)}
          {[0, 1, 2].map((q) => { const ph = (lt * 1.1 + (des > 0.5 ? i * 0.37 : 0)) % 1; return <circle key={q} cx={0} cy={-500} r={30 + (q + ph) * 50} fill="none" stroke={des > 0.5 ? '#FF7A59' : '#7CC4FF'} strokeWidth={4} opacity={0.7 - (q + ph) * 0.22} />; })}
        </g>)}
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== mundo: correntes mais fortes perto dos polos =====================
export const MundoPolos: React.FC<P> = ({lt, t}) => (
  <Mundo t={t} destaque={(f) => { const id = f.id; return ['124', '578', '752', '246', '304', '643', '352'].includes(id) ? `rgba(255,90,60,${0.35 + 0.35 * KO(lt, 0.3, 0.9)})` : id === '076' ? '#3E6E4A' : null; }}>
    {(Pj) => <g>{[[60, 90], [-60, -90]].map(([a, b], i) => <rect key={i} x={0} y={Math.min(Pj(0, a)[1], Pj(0, b)[1])} width={1920} height={Math.abs(Pj(0, a)[1] - Pj(0, b)[1])} fill="#FF5A3C" opacity={0.12 * KO(lt, 0.3, 0.9) * (0.8 + 0.2 * Math.sin(t * 3))} />)}</g>}
  </Mundo>
);
export const MundoReparos: React.FC<P> = ({lt, t}) => (
  <Mundo t={t}>{(Pj) => <g>{[[-100, 45], [10, 50], [-50, -15], [80, 25], [135, 35], [25, -28], [145, -30]].map(([lo, la], i) => { const [x, y] = Pj(lo, la); const k = KO(lt, 0.2 + i * 0.35, 0.5 + i * 0.35); return <g key={i} transform={`translate(${x} ${y}) scale(${k})`}><circle r={30} fill="#E3B04B" /><path d="M-12,-12 L12,12 M-14,10 L10,-14" stroke="#1A1A1A" strokeWidth={6} strokeLinecap="round" /></g>; })}</g>}</Mundo>
);

// ===================== transformador, amperímetro, torres de linha, Itaipu, antena =====================
export const Transformador: React.FC<P> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #1B2340, #0A0E1A)'}}>
    <SVG>
      <rect x={0} y={860} width={1920} height={220} fill="#2A2E36" />
      <g transform="translate(960 860)">
        <rect x={-380} y={-420} width={760} height={420} rx={14} fill="#7F8892" stroke="#4A5058" strokeWidth={6} />
        {Array.from({length: 12}, (_, i) => <rect key={i} x={-350 + i * 60} y={-390} width={34} height={360} rx={6} fill="#6A727C" />)}
        {[-220, 0, 220].map((x) => <g key={x}><rect x={x - 18} y={-560} width={36} height={140} fill="#B8BCC4" />{[0, 1, 2, 3, 4].map((q) => <ellipse key={q} cx={x} cy={-540 + q * 26} rx={40} ry={10} fill="#8A5A3A" />)}</g>)}
        {Array.from({length: 8}, (_, i) => { const k = ((lt * 0.9 + i / 8) % 1); return <path key={i} d={`M${-500 + k * 1000},-460 l30,0 l-10,-14 m10,14 l-10,14`} stroke="#FFD84A" strokeWidth={5} fill="none" opacity={KO(lt, 0.4, 0.9) * Math.sin(k * Math.PI)} />; })}
      </g>
      <circle cx={960} cy={650} r={420} fill="#FFD84A" opacity={0.05 + 0.04 * Math.sin(t * 9)} />
    </SVG>
  </AbsoluteFill>
);
export const Amperimetro: React.FC<P> = ({lt}) => {
  const v = 15 * KS(lt, 0.3, 2.4) + Math.sin(lt * 9) * 0.3; const a = -130 + (v / 20) * 260;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #1E2433, #06080D 75%)'}}>
      <SVG>
        <circle cx={960} cy={600} r={400} fill="#EDE6D6" stroke="#2A2A2A" strokeWidth={20} />
        {Array.from({length: 21}, (_, i) => { const an = (-130 + i * 13) * Math.PI / 180; return <g key={i}><line x1={960 + 330 * Math.sin(an)} y1={600 - 330 * Math.cos(an)} x2={960 + (i % 5 ? 350 : 365) * Math.sin(an)} y2={600 - (i % 5 ? 350 : 365) * Math.cos(an)} stroke="#222" strokeWidth={i % 5 ? 3 : 7} />{i % 5 === 0 && <text x={960 + 285 * Math.sin(an)} y={612 - 285 * Math.cos(an)} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={40} fill="#222">{i}</text>}</g>; })}
        <path d={`M${960 + 330 * Math.sin(65 * Math.PI / 180) * 0},0`} />
        <line x1={960} y1={600} x2={960 + 320 * Math.sin(a * Math.PI / 180)} y2={600 - 320 * Math.cos(a * Math.PI / 180)} stroke="#C0392B" strokeWidth={10} strokeLinecap="round" />
        <circle cx={960} cy={600} r={24} fill="#222" />
        <text x={960} y={820} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={80} fill="#222">A</text>
      </SVG>
    </AbsoluteFill>
  );
};
export const TorresLinha: React.FC<P> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #F2A65A 0%, #F6D49A 35%, #9DB4C8 60%, #6E8A5A 61%, #4E6A3E 100%)'}}>
    <SVG>
      {Array.from({length: 7}, (_, i) => { const s = Math.pow(0.72, i); const x = 360 + 1500 * (1 - s); const y = 660 + 380 * s; const h = 560 * s;
        return <g key={i} transform={`translate(${x} ${y})`}><path d={`M${-60 * s},0 L0,${-h} L${60 * s},0 M${-120 * s},${-h * 0.8} L${120 * s},${-h * 0.8} M${-90 * s},${-h * 0.62} L${90 * s},${-h * 0.62}`} fill="none" stroke="#3A3A44" strokeWidth={Math.max(1.5, 6 * s)} /></g>; })}
      {[-0.8, -0.62].map((q, j) => [-120, 120, -90].slice(0, 2).map((dx, k) => <path key={`${j}${k}`} d={suave(Array.from({length: 7}, (_, i) => { const s = Math.pow(0.72, i); return [360 + 1500 * (1 - s) + dx * s, 660 + 380 * s + q * 560 * s + 20 * s] as [number, number]; }))} fill="none" stroke="#2A2A30" strokeWidth={2.5} />))}
      {Array.from({length: 10}, (_, i) => { const k = ((lt * 0.6 + i / 10) % 1); const s = Math.pow(0.72, k * 6); return <circle key={i} cx={360 + 1500 * (1 - s) - 120 * s} cy={660 + 380 * s - 0.8 * 560 * s + 20 * s} r={6} fill="#FFE46A" opacity={0.9} />; })}
    </SVG>
  </AbsoluteFill>
);
export const Itaipu: React.FC<P> = ({t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #8EC0E6 0%, #CFE6F2 40%, #3E7A98 41%, #2D5E78 100%)'}}>
    <SVG>
      <path d="M0,560 L1920,500 L1920,640 L0,720 Z" fill="#B9BCC0" />
      {Array.from({length: 18}, (_, i) => <rect key={i} x={60 + i * 104} y={560 - i * 3.3} width={56} height={150} fill="#9DA2A8" />)}
      <path d="M0,720 L1920,640 L1920,1080 L0,1080 Z" fill="#2F6E8A" />
      {Array.from({length: 18}, (_, i) => <path key={i} d={`M${88 + i * 104},${700 - i * 3.3} q10,${80 + 20 * Math.sin(t * 4 + i)} -4,${160}`} stroke="#EAF6FA" strokeWidth={14} opacity={0.6} fill="none" />)}
    </SVG>
  </AbsoluteFill>
);
export const Antena: React.FC<P> = ({lt, t}) => (
  <AbsoluteFill>
    <Espaco t={t} cor="#101830" neb={false} />
    <SVG>
      <path d="M80,700 L1840,700" stroke="#FFD84A" strokeWidth={8} />
      {[0, 1, 2, 3, 4].map((k) => { const r = 200 + k * 160 + ((lt * 120) % 160); return <path key={k} d={`M${960 - r * 1.8},${700} A${r * 1.8},${r} 0 0 1 ${960 + r * 1.8},700`} fill="none" stroke="#FF8A3D" strokeWidth={4} opacity={0.6 - k * 0.1} />; })}
      {Array.from({length: 9}, (_, i) => { const k = ((lt * 0.8 + i / 9) % 1); return <path key={i} d={`M${80 + k * 1760},700 l26,0 l-10,-12 m10,12 l-10,12`} stroke="#FFF" strokeWidth={5} fill="none" />; })}
    </SVG>
  </AbsoluteFill>
);

// ===================== céu do extremo sul =====================
export const CeuSul: React.FC<P> = ({lt, t}) => {
  const g = 0.35 + 0.15 * Math.sin(t * 0.9);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #03050C 0%, #0A1024 55%, rgba(150,30,45,${g}) 80%, #0A0A12 86%)`}}>
      <SVG>
        {Array.from({length: 220}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 2) * 760} r={rnd(i + 5) * 1.6} fill="#fff" opacity={0.7} />)}
        <path d={suave([[0, 930], [400, 910], [800, 925], [1200, 905], [1600, 920], [1920, 910]]) + ' L1920,1080 L0,1080 Z'} fill="#04050A" />
        <g transform="translate(1380 912)"><rect x={-4} y={-120} width={8} height={120} fill="#04050A" /><path d="M0,-120 l-60,40 m60,-40 l60,40" stroke="#04050A" strokeWidth={6} /></g>
        <g transform="translate(520 915) scale(0.5)"><Pessoa v={VOCE} vista="costas" t={t} /></g>
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== anomalia crescendo / dividida =====================
export const AnomaliaCresce: React.FC<P> = ({lt, d, t, arg}) => {
  const hoje = arg === 'hoje'; const k = hoje ? KS(lt, 0, 1.4) : 0; const s = lerp(0.7, 1.0, hoje ? k : 0);
  return (
    <MapaAS lt={lt} d={d} lonC={-40} latC={-22} s0={16} s1={16} escuro={0.45}
      children={(Pj) => { const [x, y] = Pj(-45, -26); return <g>
        <defs><radialGradient id="ac"><stop offset="0" stopColor="#FF3A2A" stopOpacity="0.75" /><stop offset="0.65" stopColor="#FF3A2A" stopOpacity="0.28" /><stop offset="1" stopColor="#FF3A2A" stopOpacity="0" /></radialGradient></defs>
        {hoje && <ellipse cx={x} cy={y} rx={430 * 0.7} ry={300 * 0.7} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="10 10" opacity={0.6} />}
        <ellipse cx={x + (hoje ? 40 * k : 0)} cy={y} rx={430 * s} ry={300 * s} fill="url(#ac)" />
      </g>; }} />
  );
};
export const AnomaliaDividida: React.FC<P> = ({lt, d, t}) => {
  const k = KS(lt, 0.2, 2.2);
  return (
    <MapaAS lt={lt} d={d} lonC={-40} latC={-22} s0={16} s1={16} escuro={0.45}
      children={(Pj) => { const a = Pj(lerp(-40, -50, k), -26), b = Pj(lerp(-30, 2, k), -26); return <g>
        <defs><radialGradient id="ad"><stop offset="0" stopColor="#FF3A2A" stopOpacity="0.75" /><stop offset="1" stopColor="#FF3A2A" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={a[0]} cy={a[1]} rx={300} ry={220} fill="url(#ad)" /><ellipse cx={b[0]} cy={b[1]} rx={lerp(300, 230, k)} ry={lerp(220, 170, k)} fill="url(#ad)" />
      </g>; }} />
  );
};

// ===================== Hubble sobre o ponto fraco =====================
export const Hubble: React.FC<P> = ({lt, d, t}) => {
  const x = lerp(400, 1500, lt / Math.max(d, 1)); const off = KS(lt, d * 0.35, d * 0.5);
  return (
    <AbsoluteFill>
      <Espaco t={t} />
      <SVG>
        <Globo cx={960} cy={1650} r={1250} lon={-40} lat={-26}>{(Pj) => { const p = Pj(-45, -26); return p ? <g><defs><radialGradient id="hb"><stop offset="0" stopColor="#FF3A2A" stopOpacity="0.6" /><stop offset="1" stopColor="#FF3A2A" stopOpacity="0" /></radialGradient></defs><ellipse cx={p[0]} cy={p[1]} rx={600} ry={260} fill="url(#hb)" /></g> : null; }}</Globo>
        <g transform={`translate(${x} 300) rotate(-8)`}>
          <rect x={-230} y={-55} width={460} height={110} rx={50} fill="#C9CDD6" stroke="#8A8E98" strokeWidth={4} /><rect x={180} y={-62} width={80} height={124} rx={10} fill="#9AA0AC" />
          <rect x={-120} y={-250} width={70} height={190} fill="#2A4A8A" stroke="#6A8ACC" strokeWidth={3} /><rect x={-120} y={60} width={70} height={190} fill="#2A4A8A" stroke="#6A8ACC" strokeWidth={3} />
          {[-160, -60, 40, 140].map((xx) => <circle key={xx} cx={xx} cy={0} r={9} fill={off > 0.5 ? '#3A1010' : '#6BFF8A'} />)}
        </g>
      </SVG>
      <Rotulo x={x + 120} y={180} txt={off > 0.5 ? 'DETECTORES DESLIGADOS' : 'HUBBLE · 540 KM'} cor={off > 0.5 ? COR.perigo : COR.calmo} op={KO(lt, 0.3, 0.6)} size={26} />
    </AbsoluteFill>
  );
};

// ===================== astronauta de olhos fechados =====================
export const Astronauta: React.FC<P> = ({lt, t}) => {
  const fl = Math.max(0, 1 - ((lt * 0.9) % 1.6) * 3);
  return (
    <AbsoluteFill style={{background: '#05070E'}}>
      <SVG>
        <circle cx={960} cy={560} r={360} fill="#E8EAF0" />
        <ellipse cx={960} cy={540} rx={270} ry={230} fill="#0D1426" />
        <ellipse cx={960} cy={560} rx={150} ry={180} fill="#B9805C" />
        <path d="M880,540 q30,14 60,0 M980,540 q30,14 60,0" stroke="#3A2418" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M930,640 q30,14 60,0" stroke="#7A4A34" strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M820,450 q140,-90 280,0" fill="#2A1C15" />
        <path d="M760,420 Q960,330 1160,420" stroke="#fff" strokeOpacity={0.2} strokeWidth={14} fill="none" />
        <g opacity={fl}><line x1={890} y1={470} x2={1060} y2={430} stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" /><circle cx={1060} cy={430} r={24} fill="#fff" opacity={0.8} /></g>
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== satélites caindo / atmosfera inchando =====================
export const SatelitesCaindo: React.FC<P> = ({lt, t}) => (
  <AbsoluteFill>
    <Espaco t={t} />
    <SVG>
      <Globo cx={960} cy={1700} r={1300} lon={-40} lat={0} />
      <circle cx={960} cy={1700} r={1300 + 60 + 40 * KS(lt, 0, 2)} fill="none" stroke="#7CC4FF" strokeWidth={50} opacity={0.12} />
      {Array.from({length: 38}, (_, i) => { const x0 = 120 + rnd(i) * 1680; const y0 = 140 + rnd(i + 3) * 160; const k = KS(lt, rnd(i + 6) * 0.8, 3.5 + rnd(i + 6)); const x = x0 + k * 80; const y = y0 + k * 260;
        return <g key={i}><line x1={x0} y1={y0} x2={x} y2={y} stroke="#FF8A3D" strokeWidth={2} opacity={0.5 * k} /><g transform={`translate(${x} ${y}) rotate(${k * 90 + i * 20})`}><rect x={-12} y={-4} width={24} height={8} fill="#C9CDD6" /><rect x={-4} y={-4} width={8} height={8} fill="#C9A24E" /></g>{k > 0.85 && <circle cx={x} cy={y} r={10} fill="#FFB547" opacity={0.7} />}</g>; })}
    </SVG>
  </AbsoluteFill>
);
export const AtmosferaIncha: React.FC<P> = ({lt, t}) => {
  const k = KS(lt, 0.2, 2.8);
  return (
    <AbsoluteFill>
      <Espaco t={t} />
      <SVG>
        <Globo cx={960} cy={1700} r={1300} lon={-40} lat={0} />
        {[0, 1, 2, 3].map((q) => <circle key={q} cx={960} cy={1700} r={1300 + 30 + q * 30 + k * 160} fill="none" stroke="#7CC4FF" strokeWidth={26} opacity={0.12 - q * 0.02} />)}
        {Array.from({length: 7}, (_, i) => { const x = 300 + i * 220 + lt * (60 - k * 40); return <g key={i} transform={`translate(${x} ${260 + Math.sin(i) * 30 + k * 40})`}><rect x={-26} y={-8} width={52} height={16} fill="#C9CDD6" /><rect x={-8} y={-8} width={16} height={16} fill="#C9A24E" /><line x1={-40} y1={0} x2={-40 - 60 * k} y2={0} stroke="#FF7A59" strokeWidth={3} opacity={k} /></g>; })}
      </SVG>
    </AbsoluteFill>
  );
};

// ===================== Amazônia, fazenda e navio com antena; previsão =====================
export const Amazonia: React.FC<P> = ({t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #F6C88A 0%, #FBE3B4 30%, #2E5A3A 31%)'}}>
    <SVG>
      {Array.from({length: 40}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={330 + rnd(i + 2) * 140} r={60 + rnd(i + 4) * 70} fill={`hsl(${120 + rnd(i) * 30},40%,${18 + rnd(i + 1) * 12}%)`} />)}
      <rect x={0} y={620} width={1920} height={460} fill="#6E5A3A" /><path d={`M0,700 Q960,${680 + 6 * Math.sin(t)} 1920,700 L1920,1080 L0,1080 Z`} fill="#8A6A3E" />
      {[[560, 1], [960, 1.1], [1360, 0.95]].map(([x, s], i) => <g key={i} transform={`translate(${x} 640) scale(${s})`}>
        {[-100, -40, 40, 100].map((dx) => <rect key={dx} x={dx - 6} y={0} width={12} height={110} fill="#4A3424" />)}
        <rect x={-130} y={-140} width={260} height={140} fill="#C68A4A" /><polygon points="-150,-140 0,-220 150,-140" fill="#7A3A22" />
        <rect x={-30} y={-100} width={60} height={100} fill="#3A2416" />
        {i === 1 && <g transform="translate(110 -200)"><line x1={0} y1={0} x2={0} y2={70} stroke="#ccc" strokeWidth={6} /><ellipse cx={0} cy={0} rx={50} ry={22} fill="#E8E8EC" transform="rotate(-25)" /></g>}
      </g>)}
      <path d="M200 860 L420 860 L390 900 L230 900 Z" fill="#5A3A22" />
    </SVG>
  </AbsoluteFill>
);
export const FazendaAntena: React.FC<P> = ({t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #8EC0E6 0%, #DCEEF6 50%, #7A9A4E 51%, #5E7A3A 100%)'}}>
    <SVG>
      {Array.from({length: 16}, (_, i) => <path key={i} d={`M${-200 + i * 160},1080 L${960},560`} stroke="#6A8A40" strokeWidth={8} />)}
      <g transform="translate(700 700)"><rect x={-200} y={-160} width={400} height={160} fill="#F2E8D2" /><polygon points="-230,-160 0,-260 230,-160" fill="#A8442E" /><rect x={-40} y={-100} width={80} height={100} fill="#6A4A2E" />
        <g transform="translate(150 -280)"><line x1={0} y1={0} x2={0} y2={80} stroke="#bbb" strokeWidth={8} /><ellipse cx={0} cy={0} rx={70} ry={30} fill="#EEE" transform="rotate(-25)" /></g></g>
      <g transform="translate(1500 660)"><rect x={-180} y={-40} width={360} height={40} fill="#B8322C" /><rect x={-90} y={-130} width={150} height={90} fill="#F2F2F2" /><line x1={-20} y1={-130} x2={-20} y2={-210} stroke="#999" strokeWidth={5} /><ellipse cx={-20} cy={-210} rx={34} ry={14} fill="#fff" /></g>
      {[0, 1, 2].map((q) => <circle key={q} cx={850} cy={420} r={40 + q * 40 + ((t * 60) % 40)} fill="none" stroke="#2A6CB0" strokeWidth={4} opacity={0.5 - q * 0.15} />)}
    </SVG>
  </AbsoluteFill>
);
export const PrevisaoSul: React.FC<P> = ({lt, d, t}) => (
  <MapaAS lt={lt} d={d} lonC={-52} latC={-27} s0={44} s1={44} escuro={0.35}
    children={(Pj) => <g>{[[-53, -29], [-50, -27.5], [-55, -26], [-51, -30.5]].map(([lo, la], i) => { const [x, y] = Pj(lo, la); return <g key={i} transform={`translate(${x + Math.sin(t + i) * 8} ${y})`} opacity={KO(lt, 0.2 + i * 0.3, 0.6 + i * 0.3)}>
      <ellipse cx={0} cy={0} rx={90} ry={50} fill="#DDE6F2" /><ellipse cx={-50} cy={10} rx={60} ry={40} fill="#C8D4E4" /><ellipse cx={50} cy={12} rx={55} ry={36} fill="#C8D4E4" />
      {Array.from({length: 6}, (_, j) => { const yy = 50 + ((t * 120 + j * 30) % 90); return <line key={j} x1={-60 + j * 24} y1={yy} x2={-70 + j * 24} y2={yy + 22} stroke="#5AA0F0" strokeWidth={5} strokeLinecap="round" />; })}</g>; })}</g>} />
);

// ===================== pessoa calma sob a aurora; operador; INPE; celular; comentários; cartela =====================
export const PessoaCeu: React.FC<P> = ({t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #04060E 0%, #0A1428 65%)'}}>
    <SVG>
      {Array.from({length: 180}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 7) * 700} r={1.1} fill="#fff" opacity={0.6} />)}
      <g style={{mixBlendMode: 'screen'}}>{Array.from({length: 3}, (_, k) => <path key={k} d={suave(Array.from({length: 25}, (_, i) => [i * 80, 200 + k * 40 + 50 * Math.sin(i * 0.5 + t * 0.6 + k * 2)] as [number, number])) + ` L1920,${620 + k * 40} L0,${620 + k * 40} Z`} fill="#5CF2A0" opacity={0.18 - k * 0.04} />)}</g>
      <path d={suave([[0, 880], [500, 840], [1000, 870], [1500, 830], [1920, 860]]) + ' L1920,1080 L0,1080 Z'} fill="#03050A" />
      <g transform="translate(960 900) scale(1.1)"><Pessoa v={VOCE} vista="costas" t={t} /></g>
    </SVG>
  </AbsoluteFill>
);
export const Operador: React.FC<P> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #0C1220, #070A12)'}}>
    <SVG>
      <rect x={160} y={120} width={1600} height={600} rx={18} fill="#0E1A30" stroke="#2A3E62" strokeWidth={6} />
      {Array.from({length: 6}, (_, i) => <rect key={i} x={220 + i * 250} y={180} width={210} height={120} rx={10} fill={i === 2 ? '#3A1A16' : '#12304A'} stroke={i === 2 ? '#FF7A59' : '#2A6CB0'} strokeWidth={3} />)}
      <path d={suave(Array.from({length: 30}, (_, i) => [220 + i * 52, 560 - 120 * Math.exp(-(((i - 18) / 5) ** 2)) * KS(lt, 0.2, 1.5) - 20 * Math.sin(i * 0.7 + t)] as [number, number]))} fill="none" stroke={COR.ouro} strokeWidth={5} />
      <line x1={220} x2={1720} y1={460} y2={460} stroke="#FF5A3C" strokeDasharray="10 10" strokeWidth={3} />
      <rect x={0} y={840} width={1920} height={240} fill="#1A1F2A" />
      <g transform="translate(960 1060) scale(1.2)"><Pessoa v={CIENTISTA} vista="costas" t={t} bD={[40, 60]} bE={[40, 60]} /></g>
    </SVG>
  </AbsoluteFill>
);
export const Inpe: React.FC<P> = ({lt, t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #0C1220, #070A12)'}}>
    <SVG>
      <rect x={120} y={100} width={1680} height={860} rx={20} fill="#0E1A30" stroke="#2A3E62" strokeWidth={6} />
      <SolG x={520} y={480} r={230} t={t} furia={0.4} id="inpe" />
      {Array.from({length: 9}, (_, i) => { const h = (60 + 240 * rnd(i + 3)) * KO(lt, 0.2 + i * 0.08, 0.6 + i * 0.08); return <rect key={i} x={980 + i * 80} y={820 - h} width={56} height={h} rx={6} fill={h > 220 ? '#FF7A59' : h > 150 ? '#E3B04B' : '#3DDBB4'} />; })}
      <line x1={960} x2={1720} y1={820} y2={820} stroke="#5A6A88" strokeWidth={3} />
    </SVG>
    <div style={{position: 'absolute', left: 160, top: 130, fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 5, color: COR.ouro, opacity: KO(lt, 0.1, 0.4)}}>INPE · CLIMA ESPACIAL</div>
  </AbsoluteFill>
);
export const CelularSemSinal: React.FC<P> = ({t}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #1A2238, #070A12 70%)'}}>
    <SVG><Celular x={960} y={600} t={t} semSinal><text x={0} y={0} textAnchor="middle" fontFamily="Inter" fontWeight={700} fontSize={34} fill="#6A7488">sem GPS</text><text x={0} y={60} textAnchor="middle" fontFamily="Inter" fontWeight={700} fontSize={34} fill="#6A7488">sem internet</text></Celular></SVG>
  </AbsoluteFill>
);
export const Comentarios: React.FC<P> = ({lt}) => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #141C30, #06080F 75%)'}}>
    {['A máquina do cartão', 'O GPS do caminhão', 'O Pix do mercado', 'A previsão do tempo'].map((txt, i) => { const k = KO(lt, 0.2 + i * 0.4, 0.6 + i * 0.4); return (
      <div key={i} style={{position: 'absolute', left: 520, top: 220 + i * 170, width: 880, height: 130, borderRadius: 18, background: '#1A2236', display: 'flex', alignItems: 'center', gap: 28, padding: '0 34px', opacity: k, transform: `translateY(${(1 - k) * 30}px)`, boxShadow: '0 16px 40px rgba(0,0,0,0.5)'}}>
        <div style={{width: 70, height: 70, borderRadius: 35, background: ['#3E6E9A', '#9A5E3E', '#3E9A6E', '#7A3E9A'][i]}} />
        <div style={{fontFamily: F.rotulo, fontWeight: 500, fontSize: 38, color: '#E8ECF4'}}>{txt}</div>
      </div>); })}
  </AbsoluteFill>
);
export const Cartela: React.FC<P> = ({lt, t}) => {
  const k = KS(lt, 0, 1.6);
  return (
    <AbsoluteFill>
      <Espaco t={t} cor="#0B1428" />
      <SVG>
        {Array.from({length: 320}, (_, i) => { const a = rnd(i) * Math.PI * 2; const r0 = 900 + rnd(i + 1) * 500; const tx = 760 + rnd(i + 2) * 400, ty = 500 + (rnd(i + 3) - 0.5) * 90;
          return <circle key={i} cx={lerp(960 + Math.cos(a) * r0, tx, k)} cy={lerp(540 + Math.sin(a) * r0, ty, k)} r={2.4} fill={COR.plasma} opacity={1 - KO(lt, 1.4, 2.0) * 0.8} />; })}
      </SVG>
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', opacity: KO(lt, 1.1, 1.7)}}>
        <div style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 140, letterSpacing: 10, color: '#F2F4F8', textShadow: `0 0 40px ${COR.ouro}88`}}>BRASIL MILENAR</div>
        <div style={{width: 520, height: 6, borderRadius: 3, background: COR.ouro, marginTop: 10, boxShadow: `0 0 20px ${COR.ouro}`}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
