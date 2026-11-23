/* Vídeo 8 — cenas dos atos 1, 2 e começo do 3 (mapa do Amazonas, vila, frei, caderno, Tunguska, Rio 1930, Armagh...). */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {lerp, clamp01, prog, K, KO, KS, rnd} from './base';
import {F} from './theme';
import {SVG, COR, MapaAS, Rotulo, Pulso, Traco, Mundo, Espaco} from './comum7';
import {Canoa, BolaFogo, P} from './cenas8a';

const CURUCA: [number, number] = [-71.6, -5.2];

// ---------- MAPA DO AMAZONAS ----------
export const MapaAM: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  const cfg: Record<string, [number, number, number, number]> = { // lonC, latC, s0, s1
    '0': [-62, -6, 40, 70], '1': [-70.5, -4.8, 150, 175], regua: [-57, -13, 34, 36], javari: [-71, -5.5, 120, 128], barco: [-66, -4.5, 72, 76],
  };
  const [lonC, latC, s0, s1] = cfg[arg] || cfg['0'];
  return (
    <MapaAS lt={lt} d={d} lonC={lonC} latC={latC} s0={s0} s1={s1} escuro={0.42}
      children={(Pp) => {
        const c = Pp(...CURUCA); const man = Pp(-60.02, -3.1); const tab = Pp(-69.94, -4.25); const sp = Pp(-46.63, -23.55); const bsb = Pp(-47.88, -15.79);
        const javari = [[-73.8, -7.3], [-72.9, -6.2], [-72.2, -5.4], [-71.4, -4.9], [-70.6, -4.5], [-69.95, -4.3]].map((p) => Pp(p[0], p[1]));
        const curuca = [[-72.6, -6.4], [-72.0, -5.9], [-71.6, -5.2], [-71.2, -4.8]].map((p) => Pp(p[0], p[1]));
        const kr = K(lt, 0.3, 1.6);
        return <g>
          {(arg === '1' || arg === 'javari') && <g>
            <Traco d={'M' + javari.map((p) => p.join(',')).join(' L')} k={kr} cor="#7CC4FF" w={7} L={4000} />
            <Traco d={'M' + curuca.map((p) => p.join(',')).join(' L')} k={K(lt, 1.0, 2.2)} cor="#B8E4FF" w={5} L={3000} />
          </g>}
          {arg === 'javari' && <path d={`M${Pp(-73.5, -7.5).join(',')} L${Pp(-69.6, -7.2).join(',')} L${Pp(-69.4, -4.6).join(',')} L${Pp(-71.2, -4.3).join(',')} L${Pp(-73.8, -5.8).join(',')} Z`} fill="#3DDBB4" opacity={0.22 * K(lt, 0.2, 1)} stroke="#3DDBB4" strokeWidth={3} strokeDasharray="12 8" />}
          {arg === 'regua' && <g>
            <Traco d={`M${man.join(',')} L${c.join(',')}`} k={K(lt, 0.2, 1.4)} cor={COR.perigo} w={6} L={1500} />
            <Traco d={`M${sp.join(',')} L${bsb.join(',')}`} k={K(lt, 1.4, 2.4)} cor={COR.calmo} w={6} L={1500} />
            <Pulso p={man} t={t} cor={COR.ouro} r={8} /><Pulso p={sp} t={t} cor={COR.calmo} r={7} op={K(lt, 1.4, 1.8)} /><Pulso p={bsb} t={t} cor={COR.calmo} r={7} op={K(lt, 1.4, 1.8)} />
          </g>}
          {arg === 'barco' && (() => { const k = (lt / d); const x = lerp(man[0], tab[0], k), y = lerp(man[1], tab[1], k) + Math.sin(k * 20) * 6; return <g>
            <Traco d={`M${man.join(',')} Q${(man[0] + tab[0]) / 2},${man[1] - 60} ${tab.join(',')}`} k={1} cor="#7CC4FF" w={3} L={1500} dash="10 10" />
            <g transform={`translate(${x},${y})`}><path d="M-26,0 L26,0 L18,10 L-18,10 Z" fill="#F2F4F8" /><rect x={-10} y={-14} width={18} height={14} fill="#F2F4F8" /></g>
          </g>; })()}
          <Pulso p={c} t={t} cor={COR.perigo} r={arg === '0' ? 9 : 11} op={arg === 'barco' ? 0.6 : 1} />
        </g>;
      }}
      html={(Pp) => {
        const c = Pp(...CURUCA), man = Pp(-60.02, -3.1), tab = Pp(-69.94, -4.25), sp = Pp(-46.63, -23.55), bsb = Pp(-47.88, -15.79), pe = Pp(-74.5, -6.5);
        return <>
          {arg === '0' && <Rotulo x={c[0]} y={c[1]} txt="RIO CURUÇÁ" sub="AMAZONAS" cor={COR.perigo} op={K(lt, 1, 1.5)} />}
          {arg === '0' && <Rotulo x={man[0]} y={man[1]} txt="MANAUS" cor={COR.ouro} op={K(lt, 0.4, 0.9)} />}
          {arg === '1' && <><Rotulo x={c[0]} y={c[1]} txt="RIO CURUÇÁ" cor={COR.perigo} op={K(lt, 1.6, 2.1)} /><Rotulo x={pe[0]} y={pe[1]} txt="PERU" cor={COR.calmo} lado={-1} op={K(lt, 0.4, 0.9)} /><Rotulo x={tab[0]} y={tab[1]} txt="RIO JAVARI" cor="#7CC4FF" op={K(lt, 0.8, 1.3)} /></>}
          {arg === 'regua' && <><Rotulo x={man[0]} y={man[1]} txt="MANAUS" cor={COR.ouro} /><Rotulo x={c[0]} y={c[1]} txt="CURUÇÁ" cor={COR.perigo} lado={-1} /><Rotulo x={sp[0]} y={sp[1]} txt="SÃO PAULO" cor={COR.calmo} op={K(lt, 1.4, 1.8)} /><Rotulo x={bsb[0]} y={bsb[1]} txt="BRASÍLIA" cor={COR.calmo} op={K(lt, 1.4, 1.8)} /></>}
          {arg === 'javari' && <Rotulo x={Pp(-72.4, -6.6)[0]} y={Pp(-72.4, -6.6)[1]} txt="VALE DO JAVARI" sub="POVOS ISOLADOS" cor="#3DDBB4" op={K(lt, 0.8, 1.3)} />}
          {arg === 'barco' && <Rotulo x={tab[0]} y={tab[1]} txt="VÁRIOS DIAS DE BARCO" cor="#7CC4FF" lado={-1} op={K(lt, 0.6, 1.1)} />}
        </>;
      }} />
  );
};

// ---------- VILA RIBEIRINHA ----------
const Palafita: React.FC<{x: number; y: number; s?: number; cor?: string}> = ({x, y, s = 1, cor = '#7A5232'}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-80, -30, 30, 80].map((px) => <rect key={px} x={px - 4} y={0} width={8} height={90} fill="#4A3020" />)}
    <rect x={-100} y={-6} width={200} height={14} fill="#5A3A24" />
    <rect x={-90} y={-110} width={180} height={104} fill={cor} />
    <path d="M-118,-104 L0,-178 L118,-104 Z" fill="#B89A5A" /><path d="M-118,-104 L0,-178 L118,-104" fill="none" stroke="#8A7040" strokeWidth={4} />
    <rect x={-20} y={-74} width={40} height={68} fill="#2A1A10" /><rect x={40} y={-84} width={30} height={26} fill="#2A1A10" />
  </g>
);
const Gente: React.FC<{x: number; y: number; s?: number; cor: string; pele?: string; t: number; corre?: number; aponta?: number}> = ({x, y, s = 1, cor, pele = '#8C5B3E', t, corre = 0, aponta = 0}) => {
  const ph = t * 9; const pa = corre ? Math.sin(ph) * 28 : 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <line x1={-6} y1={-60} x2={-6 + Math.sin((pa * Math.PI) / 180) * 50} y2={0} stroke="#2A2A3A" strokeWidth={13} strokeLinecap="round" />
      <line x1={6} y1={-60} x2={6 - Math.sin((pa * Math.PI) / 180) * 50} y2={0} stroke="#2A2A3A" strokeWidth={13} strokeLinecap="round" />
      <path d="M-20,-62 L-18,-126 Q0,-136 18,-126 L20,-62 Z" fill={cor} />
      <line x1={-18} y1={-118} x2={-30 - pa * 0.4} y2={-70} stroke={cor} strokeWidth={11} strokeLinecap="round" />
      <line x1={18} y1={-118} x2={aponta ? 50 : 30 + pa * 0.4} y2={aponta ? -170 : -70} stroke={cor} strokeWidth={11} strokeLinecap="round" />
      <circle cx={0} cy={-148} r={17} fill={pele} />
      <path d="M-17,-152 Q0,-172 17,-152 Q10,-160 0,-160 Q-10,-160 -17,-152 Z" fill="#1E1510" />
    </g>
  );
};
export const Vila: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  const ceuVerm = arg === 'medo';
  const HY = 600;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <SVG>
        <defs><linearGradient id="ceV" x1="0" y1="0" x2="0" y2="1">{ceuVerm ? <><stop offset="0" stopColor="#2A0606" /><stop offset="1" stopColor="#C4401E" /></> : <><stop offset="0" stopColor="#3C6E9A" /><stop offset="1" stopColor="#E8D6A8" /></>}</linearGradient>
          <linearGradient id="agV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={ceuVerm ? '#7A2A14' : '#8A7650'} /><stop offset="1" stopColor={ceuVerm ? '#2A0A06' : '#3E3424'} /></linearGradient></defs>
        <rect width={1920} height={HY} fill="url(#ceV)" />
        {ceuVerm && Array.from({length: 120}, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={((rnd(i + 3) * 1100 + lt * (40 + rnd(i) * 40)) % 1100) - 20} r={2 + rnd(i + 5) * 3} fill="#F08A6A" opacity={0.6} />)}
        <g opacity={1}>
          {Array.from({length: 40}, (_, i) => <circle key={i} cx={i * 52 + rnd(i) * 20} cy={HY - 50 - rnd(i + 9) * 50} r={44 + rnd(i + 2) * 30} fill={ceuVerm ? '#2A0B07' : '#2E5A30'} />)}
          <rect y={HY - 50} width={1920} height={60} fill={ceuVerm ? '#2A0B07' : '#2E5A30'} />
        </g>
        <rect y={HY} width={1920} height={480} fill="url(#agV)" />
        {Array.from({length: 14}, (_, i) => <line key={i} x1={(rnd(i) * 1920 + lt * 20) % 1920} y1={HY + 30 + i * 30} x2={(rnd(i) * 1920 + lt * 20) % 1920 + 140} y2={HY + 30 + i * 30} stroke="#fff" strokeOpacity={0.12} strokeWidth={2} />)}
        <Palafita x={420} y={HY - 20} s={1.1} />
        <Palafita x={1450} y={HY - 30} s={0.9} cor="#6A4A2E" />
        {arg === '0' && <Canoa x={lerp(700, 1100, lt / d)} y={HY + 220} s={1.4} t={t} cor="#2A1A10" />}
        {arg === '1' && <><Canoa x={lerp(500, 820, lt / d)} y={HY + 180} s={1.2} t={t} cor="#2A1A10" /><Canoa x={lerp(1500, 1250, lt / d)} y={HY + 300} s={1.4} t={t + 1} cor="#3A2414" /></>}
        {arg === '2' && <g>
          {/* pesca: rede; roça: mandioca; borracha: seringueira com tigela */}
          <Canoa x={900} y={HY + 220} s={1.4} t={t} cor="#2A1A10" />
          <path d={`M980,${HY + 200} q60,${40 + Math.sin(t * 2) * 8} 140,10`} fill="none" stroke="#E8DCC0" strokeWidth={2} strokeDasharray="6 6" />
          <g transform={`translate(1700,${HY - 10})`}><rect x={-14} y={-260} width={28} height={260} fill="#5A4030" /><path d="M-14,-150 l28,14" stroke="#F2EEE4" strokeWidth={4} /><path d="M-8,-130 q8,10 16,0" fill="#E8E2D2" /></g>
        </g>}
        {arg === 'medo' && <><Gente x={760} y={HY + 120} s={1.6} cor="#C14A3A" t={t} aponta={1} /><Gente x={980} y={HY + 130} s={1.4} cor="#2E6A8A" t={t + 0.5} aponta={1} /><Gente x={1150} y={HY + 140} s={1.1} cor="#E0A040" t={t} /></>}
        {(arg === 'missao' || arg === 'conta') && <g>
          <Gente x={760} y={HY + 150} s={1.6} cor="#6B4A2E" pele="#E0B48C" t={t} />
          <path d="M744,-0" />
          {[0, 1, 2, 3].map((i) => <Gente key={i} x={980 + i * 150} y={HY + 160 + (i % 2) * 20} s={1.35 - i * 0.05} cor={['#C14A3A', '#2E6A8A', '#E0A040', '#3A7A4A'][i]} t={t + i} aponta={arg === 'conta' && i % 2 === 0 ? 1 : 0} />)}
        </g>}
      </SVG>
    </AbsoluteFill>
  );
};
export const Familia: React.FC<P> = ({lt, d, t}) => {
  const HY = 640;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <SVG>
        <defs><linearGradient id="ceFa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#240505" /><stop offset="1" stopColor="#C4401E" /></linearGradient></defs>
        <rect width={1920} height={1080} fill="url(#ceFa)" />
        {Array.from({length: 40}, (_, i) => <circle key={i} cx={i * 52} cy={HY - 60 - rnd(i + 9) * 60} r={50 + rnd(i + 2) * 30} fill="#2A0B07" />)}
        <rect y={HY - 60} width={1920} height={500} fill="#2A0B07" />
        <rect y={HY + 40} width={1920} height={400} fill="#3A160C" />
        <Palafita x={420} y={HY + 20} s={1.3} cor="#5A3A24" />
        {[0, 1, 2, 3].map((i) => <Gente key={i} x={lerp(600 + i * 110, 1500 + i * 110, lt / d)} y={HY + 220} s={[1.7, 1.6, 1.1, 0.9][i]} cor={['#C14A3A', '#2E6A8A', '#E0A040', '#3A7A4A'][i]} t={t + i * 0.3} corre={1} />)}
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- RELÓGIO DE BOLSO 8:00 ----------
export const Relogio8: React.FC<P> = ({lt, d, t}) => {
  const seg = (lt * 6) % 360;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, #3A2A1A, #0B0806 70%)'}}>
      <SVG>
        <g transform="translate(960,560)">
          <path d="M0,-380 Q20,-420 0,-450 Q-20,-420 0,-380" fill="none" stroke="#C9A46A" strokeWidth={10} />
          <circle r={360} fill="#B08A52" /><circle r={330} fill="#F3EADA" /><circle r={330} fill="none" stroke="#6A5034" strokeWidth={4} />
          {Array.from({length: 60}, (_, i) => { const a = (i * 6 * Math.PI) / 180; const r1 = i % 5 ? 300 : 280; return <line key={i} x1={Math.sin(a) * r1} y1={-Math.cos(a) * r1} x2={Math.sin(a) * 318} y2={-Math.cos(a) * 318} stroke="#2A1D10" strokeWidth={i % 5 ? 2 : 6} />; })}
          {['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map((n, i) => { const a = (i * 30 * Math.PI) / 180; return <text key={n} x={Math.sin(a) * 235} y={-Math.cos(a) * 235 + 18} textAnchor="middle" fontFamily="Georgia, serif" fontSize={50} fill="#2A1D10">{n}</text>; })}
          <line x1={0} y1={0} x2={Math.sin((240 * Math.PI) / 180) * 150} y2={-Math.cos((240 * Math.PI) / 180) * 150} stroke="#1B140C" strokeWidth={14} strokeLinecap="round" />
          <line x1={0} y1={0} x2={0} y2={-240} stroke="#1B140C" strokeWidth={8} strokeLinecap="round" />
          <line x1={0} y1={30} x2={Math.sin((seg * Math.PI) / 180) * 270} y2={-Math.cos((seg * Math.PI) / 180) * 270} stroke="#B3261E" strokeWidth={3} />
          <circle r={14} fill="#1B140C" />
        </g>
      </SVG>
      <AbsoluteFill style={{background: `rgba(160,30,10,${0.25 * K(lt, d * 0.4, d)})`, mixBlendMode: 'multiply'}} />
    </AbsoluteFill>
  );
};

// ---------- CADERNO DO FREI ----------
const NOTAS = ['13 de agosto, cerca das 8 horas', 'o sol ficou vermelho como sangue', 'caiu um pó fino até o meio-dia', 'assobios cada vez mais altos', 'bolas de fogo sobre a mata', 'três explosões; a terra tremeu'];
export const Caderno: React.FC<P> = ({lt, d, t, arg = 'fechado'}) => {
  const aberto = arg === 'escreve' ? 1 : arg === 'fecha' ? 1 - K(lt, d * 0.45, d * 0.9) : 0;
  const linhas = arg === 'escreve' ? lt / d * NOTAS.length * 1.05 : arg === 'fecha' ? NOTAS.length : 0;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #4A3622, #120C07 72%)', alignItems: 'center', justifyContent: 'center', perspective: 2000}}>
      <div style={{position: 'relative', width: 1300, height: 820, transform: 'rotateX(22deg) rotateZ(-3deg)'}}>
        {/* página esquerda */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 650, height: 820, opacity: aberto, background: 'linear-gradient(90deg,#E8DDC4,#F3EADA)', borderRadius: '10px 0 0 10px', boxShadow: '0 30px 70px rgba(0,0,0,0.6)', padding: '70px 60px'}}>
          {NOTAS.map((n, i) => { const k = clamp01(linhas - i); return (
            <div key={i} style={{fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 38, color: '#2A2016', margin: '0 0 30px', borderBottom: '1px solid rgba(80,60,40,0.25)', whiteSpace: 'nowrap', overflow: 'hidden', width: `${k * 100}%`}}>{n}</div>
          ); })}
        </div>
        {/* página direita / capa que fecha */}
        <div style={{position: 'absolute', left: 650, top: 0, width: 650, height: 820, transformOrigin: '0 50%', opacity: aberto, background: 'linear-gradient(90deg,#F3EADA,#E8DDC4)', borderRadius: '0 10px 10px 0', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', backfaceVisibility: 'visible'}}>
          {aberto > 0.5 && <div style={{position: 'absolute', left: 70, top: 120, right: 70}}>{Array.from({length: 12}, (_, i) => <div key={i} style={{height: 2, background: 'rgba(80,60,40,0.2)', margin: '0 0 58px'}} />)}</div>}
        </div>
        {aberto < 1 && <div style={{position: 'absolute', left: 325, top: 0, width: 650, height: 820, opacity: 1 - aberto, zIndex: 5, background: 'linear-gradient(135deg,#5A3A24,#3A2416)', borderRadius: 10, boxShadow: '0 30px 70px rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 360, height: 120, border: '3px solid #C9A46A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontSize: 40, color: '#C9A46A', fontStyle: 'italic'}}>Curuçá · 1930</div>
        </div>}
        {arg === 'escreve' && <div style={{position: 'absolute', left: 60 + Math.min(560, (linhas % 1) * 560), top: 70 + Math.min(NOTAS.length - 1, Math.floor(linhas)) * 82 + 20, width: 12, height: 170, background: '#2A1D10', transform: 'rotate(28deg)', transformOrigin: '50% 100%', borderRadius: 6}} />}
      </div>
    </AbsoluteFill>
  );
};

// ---------- CALENDÁRIO 13 → 18 ----------
export const Calendario: React.FC<P> = ({lt, d}) => {
  const dia = Math.min(18, 13 + Math.floor(lt / (d * 0.8) * 6));
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, #1A2438, #070A12 72%)', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 520, height: 600, borderRadius: 24, background: '#F3EADA', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', overflow: 'hidden', textAlign: 'center'}}>
        <div style={{background: '#B3261E', color: '#fff', fontFamily: F.titulo, fontWeight: 700, fontSize: 64, padding: '24px 0', letterSpacing: 6}}>AGOSTO · 1930</div>
        <div key={dia} style={{fontFamily: F.titulo, fontWeight: 700, fontSize: 300, color: '#22180E', lineHeight: 1.4}}>{dia}</div>
      </div>
      <div style={{position: 'absolute', bottom: 110, fontFamily: F.rotulo, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: '#C3CAD8', opacity: K(lt, d * 0.7, d * 0.85)}}>CINCO DIAS DEPOIS</div>
    </AbsoluteFill>
  );
};

// ---------- METEORO (pedra explodindo no céu) ----------
export const Meteoro: React.FC<P> = ({lt, d, t, arg = '0'}) => {
  const k = KS(lt, 0, d * 0.75); const boom = Math.max(0, 1 - Math.abs(lt - d * 0.78) / 0.45);
  const hx = lerp(1500, 980, k), hy = lerp(120, 420, k);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Espaco t={t} cor="#14213A" />
      <SVG>
        <defs><radialGradient id="atm" cx="0.5" cy="1.6" r="1.2"><stop offset="0.6" stopColor="#4D8FD6" stopOpacity="0.9" /><stop offset="0.8" stopColor="#2A5A9A" stopOpacity="0.35" /><stop offset="1" stopColor="#0B1428" stopOpacity="0" /></radialGradient></defs>
        <ellipse cx={960} cy={1700} rx={1700} ry={1000} fill="url(#atm)" />
        <ellipse cx={960} cy={1760} rx={1500} ry={900} fill="#1E4A30" />
        {lt < d * 0.8 && <BolaFogo id="mt" hx={hx} hy={hy} ang={150} L={520} r={16} />}
        {arg === '0' && lt < d * 0.8 && <g transform={`translate(${hx},${hy}) rotate(${lt * 40})`}><path d="M-12,-8 L6,-14 L14,2 L4,14 L-12,8 Z" fill="#3A2A20" /></g>}
        <defs><radialGradient id="bgm"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.25" stopColor="#FFE8B0" /><stop offset="0.6" stopColor="#FF9A3A" stopOpacity="0.6" /><stop offset="1" stopColor="#FF6A1A" stopOpacity="0" /></radialGradient></defs>{boom > 0 && <circle cx={980} cy={420} r={120 + boom * 380} fill="url(#bgm)" opacity={boom} />}
        {lt > d * 0.78 && Array.from({length: 24}, (_, i) => { const a = (i / 24) * Math.PI * 2; const r = (lt - d * 0.78) * 420; return <circle key={i} cx={980 + Math.cos(a) * r} cy={420 + Math.sin(a) * r * 0.7} r={4} fill="#FFB547" opacity={Math.max(0, 1 - (lt - d * 0.78) / 0.9)} />; })}
      </SVG>
    </AbsoluteFill>
  );
};

// ---------- TUNGUSKA ----------
export const Tunguska: React.FC<P> = ({lt, d, t, arg = 'mapa'}) => {
  if (arg === 'mapa' || arg === 'kulik') return (
    <Mundo t={t} destaque={(f) => (f.id === '643' ? '#4A3A5A' : null)} children={(Pp) => { const p = Pp(101.9, 60.9); return <g>
      <Pulso p={p} t={t} cor={COR.perigo} r={8} />
      <text x={p[0] - 22} y={p[1] - 18} textAnchor="end" fontFamily={F.titulo} fontWeight={700} fontSize={38} fill="#fff">TUNGUSKA · {arg === 'kulik' ? 'KULIK, 1927' : '1908'}</text>
    </g>; }} />
  );
  // floresta deitada em leque, vista de cima
  const centro = arg === 'centro';
  return (
    <AbsoluteFill style={{background: '#2C3A24', overflow: 'hidden'}}>
      <SVG>
        {Array.from({length: 900}, (_, i) => {
          const a = rnd(i) * Math.PI * 2; const r = 60 + Math.sqrt(rnd(i + 1)) * 1000; const x = 960 + Math.cos(a) * r, y = 540 + Math.sin(a) * r * 0.62;
          const L = 30 + rnd(i + 2) * 30;
          return <line key={i} x1={x} y1={y} x2={x + Math.cos(a) * L} y2={y + Math.sin(a) * L * 0.62} stroke={rnd(i + 3) > 0.5 ? '#6A5A44' : '#8A7A5A'} strokeWidth={4} strokeLinecap="round" />;
        })}
        {Array.from({length: 40}, (_, i) => { const a = rnd(i + 70) * Math.PI * 2; const r = Math.sqrt(rnd(i + 71)) * 55; return <g key={'c' + i}><circle cx={960 + Math.cos(a) * r} cy={540 + Math.sin(a) * r * 0.6} r={centro ? 6 : 4} fill="#4A3A2A" />{centro && <line x1={960 + Math.cos(a) * r} y1={540 + Math.sin(a) * r * 0.6} x2={960 + Math.cos(a) * r} y2={540 + Math.sin(a) * r * 0.6 - 40} stroke="#4A3A2A" strokeWidth={5} />}</g>; })}
        {centro && <circle cx={960} cy={520} r={90} fill="none" stroke={COR.ouro} strokeWidth={4} strokeDasharray="14 10" />}
      </SVG>
      <div style={{position: 'absolute', left: 60, bottom: 50, fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: '#E8E0C8'}}>TUNGUSKA, SIBÉRIA · 1908 · {centro ? 'NO CENTRO, ÁRVORES DE PÉ, SEM GALHOS' : 'ÁRVORES DEITADAS EM LEQUE'}</div>
    </AbsoluteFill>
  );
};

// ---------- RIO DE JANEIRO, 1930 ----------
export const Rio1930: React.FC<P> = ({lt, d, t}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg,#C9B48A,#8A7A5A)', overflow: 'hidden', filter: 'sepia(0.55)'}}>
    <SVG>
      <path d="M0,560 Q200,420 380,470 Q470,300 560,280 Q620,270 660,330 Q760,470 900,500 L1920,520 L1920,1080 L0,1080 Z" fill="#6A5A40" />
      {Array.from({length: 18}, (_, i) => { const x = i * 112; const h = 160 + rnd(i) * 180; return <g key={i}><rect x={x} y={760 - h} width={100} height={h + 400} fill={['#E8DCC0', '#D8C8A8', '#C8B898'][i % 3]} stroke="#6A5A40" strokeWidth={2} />{Array.from({length: Math.floor(h / 50)}, (_, j) => <rect key={j} x={x + 14} y={780 - h + j * 50} width={20} height={26} fill="#5A4A30" />)}</g>; })}
      {Array.from({length: 70}, (_, i) => <g key={'p' + i} transform={`translate(${(i * 29 + Math.sin(t + i) * 4) % 1960 - 20},${900 + (i % 4) * 30})`}><circle cy={-60} r={11} fill="#2A2016" /><rect x={-11} y={-48} width={22} height={50} fill="#2A2016" /><rect x={-14} y={-74} width={28} height={6} fill="#2A2016" /></g>)}
      {[0, 1].map((i) => <g key={'b' + i} transform={`translate(${520 + i * 760},${640 + Math.sin(t * 2 + i) * 6}) rotate(${i ? 6 : -5})`}><rect x={-150} y={-60} width={300} height={90} fill="#F2EEE4" stroke="#2A2016" strokeWidth={3} /><text x={0} y={-2} textAnchor="middle" fontFamily={F.titulo} fontWeight={700} fontSize={42} fill="#7A1A10">{i ? 'GETÚLIO' : 'REVOLUÇÃO'}</text></g>)}
    </SVG>
    <div style={{position: 'absolute', left: 60, bottom: 50, fontFamily: F.rotulo, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: '#2A2016'}}>RIO DE JANEIRO, CAPITAL · OUTUBRO DE 1930</div>
  </AbsoluteFill>
);

// ---------- ARMAGH (observatório na Irlanda do Norte) ----------
export const Armagh: React.FC<P> = ({lt, d, t, arg = '0'}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Espaco t={t} cor="#121E36" />
    <SVG>
      <path d="M0,820 Q480,740 960,780 Q1440,820 1920,760 L1920,1080 L0,1080 Z" fill="#1A2A1E" />
      <g transform="translate(960,780)">
        <rect x={-380} y={-220} width={760} height={220} fill="#3A3E48" />
        {Array.from({length: 8}, (_, i) => <rect key={i} x={-340 + i * 90} y={-170} width={36} height={70} fill={i === 3 ? '#FFD98A' : '#1E222A'} />)}
        <rect x={-110} y={-330} width={220} height={110} fill="#3A3E48" />
        <path d="M-120,-330 A120,120 0 0 1 120,-330 Z" fill="#7A8696" />
        <rect x={-14} y={-450} width={28} height={130} fill="#1E222A" opacity={0.6} />
      </g>
      {arg === '2' && [0, 1, 2].map((i) => { const k = ((t * 0.12 + i / 3) % 1); return <g key={i} transform={`translate(${200 + k * 1600},${120 + i * 70 + k * 80})`}><circle r={6} fill="#C9CFD8" /><line x1={0} y1={0} x2={-60} y2={-10} stroke="#C9CFD8" strokeOpacity={0.4} strokeWidth={2} /></g>; })}
    </SVG>
    <div style={{position: 'absolute', left: 60, bottom: 50, fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: '#C3CAD8'}}>{arg === '2' ? 'MARK BAILEY · PEDRAS E COMETAS QUE CRUZAM A ÓRBITA DA TERRA' : 'OBSERVATÓRIO DE ARMAGH · IRLANDA DO NORTE · 1995'}</div>
  </AbsoluteFill>
);

// ---------- ARTIGO RUSSO (Kulik) ----------
export const ArtigoRusso: React.FC<P> = ({lt, d}) => {
  const k = K(lt, 0.8, 1.8);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, #2A2A30, #0A0A0E 72%)', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 1000, height: 860, background: '#EDEBE4', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', padding: '60px 70px', transform: 'rotate(1.5deg)'}}>
        {Array.from({length: 22}, (_, i) => i === 9
          ? <div key={i} style={{fontFamily: 'Georgia, serif', fontSize: 40, color: '#1A1A1A', margin: '0 0 14px', position: 'relative', display: 'inline-block'}}>Л. А. КУЛИК<span style={{position: 'absolute', left: 0, bottom: -4, height: 7, width: `${k * 100}%`, background: '#B3261E'}} /></div>
          : <div key={i} style={{height: 14, margin: '0 0 22px', background: 'rgba(30,30,30,0.28)', width: `${70 + rnd(i) * 30}%`}} />)}
      </div>
      <div style={{position: 'absolute', left: 1480, top: 520, opacity: k}}><Rotulo x={0} y={0} txt="KULIK" sub="O INVESTIGADOR DE TUNGUSKA" cor={COR.perigo} /></div>
    </AbsoluteFill>
  );
};

// ---------- BIBLIOTECA DO VATICANO ----------
export const Biblioteca: React.FC<P> = ({lt, d, t}) => {
  const z = lerp(1, 1.12, KS(lt, 0, d));
  return (
    <AbsoluteFill style={{background: '#120C08', overflow: 'hidden'}}>
      <SVG style={{transform: `scale(${z})`, transformOrigin: '50% 55%'}}>
        <path d="M0,0 L760,320 L760,860 L0,1080 Z" fill="#3A2416" />
        <path d="M1920,0 L1160,320 L1160,860 L1920,1080 Z" fill="#3A2416" />
        <rect x={760} y={320} width={400} height={540} fill="#1E140C" />
        <path d="M760,320 Q960,180 1160,320" fill="none" stroke="#8A6A3A" strokeWidth={10} />
        {Array.from({length: 7}, (_, r) => <g key={r}>
          {Array.from({length: 18}, (_, i) => <rect key={i} x={20 + i * 38} y={140 + r * 120 + i * 6} width={30} height={90 - i * 2} fill={['#6B3A22', '#4A2A1A', '#7A5A2A', '#2E3A4A'][(i + r) % 4]} />)}
          {Array.from({length: 18}, (_, i) => <rect key={'d' + i} x={1870 - i * 38} y={140 + r * 120 + i * 6} width={30} height={90 - i * 2} fill={['#6B3A22', '#4A2A1A', '#7A5A2A', '#2E3A4A'][(i + r + 1) % 4]} />)}
        </g>)}
        <g transform={`translate(960,${lerp(760, 600, K(lt, d * 0.3, d * 0.8))})`}>
          <rect x={-120} y={-80} width={240} height={160} fill="#E8DCC0" stroke="#6A5034" strokeWidth={3} transform="rotate(-4)" />
          <text x={0} y={-30} textAnchor="middle" fontFamily="Georgia, serif" fontSize={20} fill="#2A2016" transform="rotate(-4)">L'OSSERVATORE ROMANO</text>
          <text x={0} y={0} textAnchor="middle" fontFamily="Georgia, serif" fontSize={18} fill="#4A3A26" transform="rotate(-4)">1931</text>
        </g>
      </SVG>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 60%, rgba(255,220,150,0.25), transparent 35%)'}} />
      <div style={{position: 'absolute', left: 60, bottom: 50, fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: '#E8D8B8'}}>BIBLIOTECA DO VATICANO</div>
    </AbsoluteFill>
  );
};

// ---------- TRÊS PEDRAS ENTRANDO NA ATMOSFERA ----------
export const TresPedras: React.FC<P> = ({lt, d, t}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Espaco t={t} cor="#14213A" />
    <SVG>
      <defs><radialGradient id="atm3" cx="0.5" cy="1.5" r="1.1"><stop offset="0.62" stopColor="#4D8FD6" stopOpacity="0.9" /><stop offset="0.8" stopColor="#2A5A9A" stopOpacity="0.3" /><stop offset="1" stopColor="#0B1428" stopOpacity="0" /></radialGradient></defs>
      <ellipse cx={960} cy={1650} rx={1800} ry={1000} fill="url(#atm3)" />
      <ellipse cx={960} cy={1720} rx={1600} ry={900} fill="#1E4A30" />
      {[0, 1, 2].map((i) => { const k = KS(lt, i * 0.3, d); const hx = lerp(1700 - i * 120, 900 - i * 160, k), hy = lerp(-60 + i * 90, 600 + i * 40, k); return <g key={i}>
        <BolaFogo id={'tp' + i} hx={hx} hy={hy} ang={145} L={460} r={15} />
        <g transform={`translate(${hx},${hy})`}><path d="M-14,-10 L8,-16 L16,4 L4,16 L-14,8 Z" fill="#3A2A20" /></g>
      </g>; })}
      <g transform="translate(220,880)" opacity={K(lt, 0.5, 1.2)}><rect x={-40} y={-50} width={80} height={50} fill="#C9CFD8" /><path d="M-50,-50 L0,-90 L50,-50 Z" fill="#9AA4B4" /><text x={70} y={-20} fontFamily={F.rotulo} fontWeight={700} fontSize={22} letterSpacing={3} fill="#C3CAD8">CADA UMA ≈ DO TAMANHO DE UMA CASA</text></g>
    </SVG>
  </AbsoluteFill>
);

// ---------- PERSEIDAS ----------
export const Perseidas: React.FC<P> = ({lt, d, t, arg = '0'}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Espaco t={t} cor="#0E1A30" />
    <SVG>
      {Array.from({length: 40}, (_, i) => { const t0 = rnd(i) * d; const k = prog(lt, t0, t0 + 0.6); if (k <= 0 || k >= 1) return null; const a = (200 + rnd(i + 3) * 80) * Math.PI / 180; const sx = 1300 + Math.cos(a) * 80, sy = 200 + Math.sin(a) * 80; const L = 200 + rnd(i + 5) * 300; return <line key={i} x1={sx + Math.cos(a) * L * k} y1={sy - Math.sin(a) * L * k * -1} x2={sx + Math.cos(a) * (L * k - 120)} y2={sy - Math.sin(a) * (L * k - 120) * -1} stroke="#E8F0FF" strokeWidth={3} opacity={1 - k} strokeLinecap="round" />; })}
      <circle cx={1300} cy={200} r={8} fill="#FFD98A" opacity={0.6} />
      <path d="M0,960 Q480,900 960,930 Q1440,960 1920,900 L1920,1080 L0,1080 Z" fill="#06080C" />
    </SVG>
    <div style={{position: 'absolute', left: 60, bottom: 50, fontFamily: F.rotulo, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: '#C3CAD8'}}>{arg === '2' ? 'PICO DAS PERSEIDAS · 12–13 DE AGOSTO' : 'CHUVA DE METEOROS PERSEIDAS'}</div>
  </AbsoluteFill>
);
