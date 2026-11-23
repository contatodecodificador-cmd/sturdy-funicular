/* Vídeo 8 — cenas com imagens realistas (geradas no Canva) e fotos reais (Wikimedia), com animação por cima.
   O tempo (lt, d) é o da SEQUÊNCIA inteira de planos iguais: a animação nunca recomeça no corte. Em cada corte
   o enquadramento muda (k = índice do plano dentro da sequência), como uma nova tomada da mesma cena. */
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {lerp, clamp01, prog, K, KO, KS, rnd} from './base';
import {F} from './theme';
import {SVG, COR} from './comum7';
import {BolaFogo} from './cenas8a';

export type PF = {lt: number; d: number; t: number; arg?: string; k?: number; n?: number};

// enquadramentos por corte: [origem x %, origem y %, escala inicial]
const QUADROS: [number, number, number][] = [[50, 50, 1.0], [35, 45, 1.12], [65, 55, 1.1], [50, 35, 1.16], [30, 60, 1.14]];

const Legenda: React.FC<{txt: string; cor?: string}> = ({txt, cor = '#E8E0D0'}) => (
  <div style={{position: 'absolute', left: 60, bottom: 46, fontFamily: F.rotulo, fontWeight: 700, fontSize: 23, letterSpacing: 5, color: cor, textShadow: '0 2px 10px rgba(0,0,0,0.9)'}}>{txt}</div>
);

// foto de fundo com movimento lento e contínuo (sem vaivém)
export const Foto: React.FC<{src: string; lt: number; d: number; k?: number; z?: number; dx?: number; filtro?: string; children?: React.ReactNode; legenda?: string; credito?: string}> = ({src, lt, d, k = 0, z = 0.06, dx = 0, filtro, children, legenda, credito}) => {
  const [ox, oy, s0] = QUADROS[k % QUADROS.length];
  const p = clamp01(lt / d);
  const s = s0 + z * p;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translateX(${dx * p}px) scale(${s})`, transformOrigin: `${ox}% ${oy}%`}}>
        <Img src={staticFile(`img/${src}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: filtro}} />
      </AbsoluteFill>
      {children}
      {legenda && <Legenda txt={legenda} />}
      {credito && <div style={{position: 'absolute', right: 40, bottom: 20, fontFamily: F.rotulo, fontSize: 15, color: 'rgba(255,255,255,0.7)', textShadow: '0 1px 4px #000'}}>{credito}</div>}
    </AbsoluteFill>
  );
};

// ---------- camadas animadas ----------
const BolasCaindo: React.FC<{lt: number; d: number; n?: number; x0?: number; dir?: number}> = ({lt, d, n = 3, x0 = 1500, dir = 1}) => (
  <SVG>{Array.from({length: n}, (_, i) => {
    const t0 = 0.2 + i * Math.min(1.4, d / (n + 1)); const k = prog(lt, t0, t0 + 2.8);
    if (k <= 0 || k >= 1) return null;
    const hx = lerp(x0 - i * 260 * dir, x0 - i * 260 * dir - 760 * dir, KS(k, 0, 1)), hy = lerp(-80, 560, KS(k, 0, 1));
    return <BolaFogo key={i} id={`bc${i}`} hx={hx} hy={hy} ang={dir > 0 ? 145 : 35} L={420} r={13} op={k < 0.92 ? 1 : (1 - k) * 12} />;
  })}</SVG>
);
const Po: React.FC<{lt: number; dens?: number; cor?: string}> = ({lt, dens = 220, cor = '#F0906A'}) => (
  <SVG>{Array.from({length: dens}, (_, i) => {
    const sp = 25 + rnd(i) * 45; const y = ((rnd(i + 3) * 1200 + (lt + 2) * sp) % 1150) - 50;
    const x = rnd(i + 9) * 1920 + Math.sin(lt * 0.6 + i) * 20;
    return <circle key={i} cx={x} cy={y} r={1.6 + rnd(i + 5) * 3.2} fill={cor} opacity={0.35 + rnd(i + 7) * 0.45} />;
  })}</SVG>
);
const Clarao: React.FC<{lt: number; tempos: number[]; x?: number[]; y?: number}> = ({lt, tempos, x = [960], y = 520}) => {
  const ks = tempos.map((t0) => (lt < t0 ? 0 : Math.max(0, 1 - (lt - t0) / 1.6)));
  return (
    <>
      <SVG>
        <defs><radialGradient id="clf"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.2" stopColor="#FFE6A8" /><stop offset="0.55" stopColor="#FF8A2A" stopOpacity="0.6" /><stop offset="1" stopColor="#FF5A10" stopOpacity="0" /></radialGradient></defs>
        {ks.map((k, i) => k > 0 && <circle key={i} cx={x[i % x.length]} cy={y} r={300 + 500 * (1 - k)} fill="url(#clf)" opacity={k} />)}
      </SVG>
      <AbsoluteFill style={{background: '#FFE8C0', mixBlendMode: 'screen', opacity: Math.max(0, ...ks.map((k) => (k - 0.8) * 2.5))}} />
    </>
  );
};
const tremor = (lt: number, tempos: number[]) => {
  const k = tempos.reduce((a, t0) => a + (lt >= t0 ? Math.max(0, 1 - (lt - t0) / 1.2) : 0), 0);
  return {transform: `translate(${Math.sin(lt * 63) * 9 * k}px, ${Math.cos(lt * 51) * 6 * k}px)`};
};
const Circulo: React.FC<{lt: number; x: number; y: number; r: number; txt?: string}> = ({lt, x, y, r, txt}) => {
  const k = K(lt, 0.4, 1.4);
  return <>
    <SVG><circle cx={x} cy={y} r={r} fill="none" stroke={COR.ouro} strokeWidth={6} strokeDasharray={`${k * 2 * Math.PI * r} 4000`} transform={`rotate(-90 ${x} ${y})`} style={{filter: `drop-shadow(0 0 10px ${COR.ouro})`}} /></SVG>
    {txt && <div style={{position: 'absolute', left: x + r + 24, top: y - 26, fontFamily: F.titulo, fontWeight: 700, fontSize: 44, color: '#fff', opacity: K(lt, 1.2, 1.6), textShadow: '0 3px 12px #000'}}>{txt}</div>}
  </>;
};
const Lista: React.FC<{lt: number; itens: string[]; t0?: number; x?: number; y?: number; marca?: string; cor?: string}> = ({lt, itens, t0 = 0.4, x = 1060, y = 300, marca = '✓', cor = COR.verde}) => (
  <div style={{position: 'absolute', left: x, top: y, display: 'flex', flexDirection: 'column', gap: 20}}>
    {itens.map((s, i) => <div key={s} style={{opacity: K(lt, t0 + i * 0.5, t0 + 0.3 + i * 0.5), transform: `translateX(${(1 - KO(lt, t0 + i * 0.5, t0 + 0.4 + i * 0.5)) * 30}px)`, fontFamily: F.titulo, fontWeight: 700, fontSize: 40, color: '#fff', background: 'rgba(6,10,20,0.84)', padding: '10px 22px', borderLeft: `6px solid ${cor}`, borderRadius: 8}}>{marca} {s}</div>)}
  </div>
);

// ---------- cenas ----------
export const RioF: React.FC<PF> = (p) => {
  const {lt, d, t, arg = 'amanhecer', k = 0} = p;
  if (arg === 'amanhecer' || arg === 'calmo') return <Foto src="rio_amanhecer" lt={lt} d={d} k={k} />;
  if (arg === 'fogo') return <Foto src="aerea_vermelha" lt={lt} d={d} k={k}><BolasCaindo lt={lt} d={d} n={2} /></Foto>;
  if (arg === 'vermelho' || arg === 'vermelho2') return <Foto src="sol_vermelho" lt={lt} d={d} k={k} z={0.05} />;
  if (arg === 'po' || arg === 'po2') return <Foto src="po_vermelho" lt={lt} d={d} k={k}><Po lt={lt} /></Foto>;
  if (arg === 'assobio') return <Foto src="sol_vermelho" lt={lt} d={d} k={k + 1}><BolasCaindo lt={lt} d={d} n={3} /></Foto>;
  if (arg === 'pescadores') return <Foto src="pescador_fogo" lt={lt} d={d} k={k} />;
  return <Foto src="rio_amanhecer" lt={lt} d={d} k={k} />;
};
export const ExplosoesF: React.FC<PF> = ({lt, d, t, arg = '3', k = 0}) => {
  const tempos = [0.3, d * 0.4, d * 0.7].map((x) => Math.min(x, d - 0.5));
  return (
    <AbsoluteFill style={tremor(lt, tempos)}>
      <Foto src="aerea_vermelha" lt={lt} d={d} k={k} z={0.08}>
        <Clarao lt={lt} tempos={tempos} x={[700, 1000, 1300]} y={330} />
        {arg === '123' && <SVG>{tempos.map((t0, i) => lt >= t0 && <text key={i} x={[700, 1000, 1300][i]} y={200} textAnchor="middle" fontFamily={F.titulo} fontWeight={700} fontSize={130} fill="#fff" opacity={clamp01((lt - t0) / 0.25)} style={{filter: 'drop-shadow(0 0 20px #FF8A2A) drop-shadow(0 4px 10px #000)'}}>{i + 1}</text>)}</SVG>}
      </Foto>
    </AbsoluteFill>
  );
};
export const SismoF: React.FC<PF> = ({lt, d, k = 0}) => <Foto src="sismografo" lt={lt} d={d} k={k} legenda="SISMÓGRAFO · OBSERVATÓRIO SAN CALIXTO, LA PAZ (ILUSTRAÇÃO)" />;
export const CristoF: React.FC<PF> = ({lt, d, t, arg = 'fogo', k = 0}) => {
  const flash = arg === 'clarao' ? Math.max(0, 1 - Math.abs(lt - d * 0.5) / 0.5) : 0;
  return (
    <Foto src="cristo" lt={lt} d={d} k={k}>
      {arg === 'vidro' && <SVG>{Array.from({length: 70}, (_, i) => { const a = rnd(i) * Math.PI * 2; const r = (lt * 280 + rnd(i + 1) * 260); return <path key={i} d={`M${960 + Math.cos(a) * r},${640 + Math.sin(a) * r * 0.5} l${8 + rnd(i) * 12},-6 l-3,14 Z`} fill="#DDEEFF" opacity={0.75 * (1 - clamp01(lt / d))} />; })}</SVG>}
      {arg === 'raio' && <SVG>{[0, 1, 2].map((i) => <circle key={i} cx={960} cy={560} r={160 + i * 170 + lt * 18} fill="none" stroke="#FFD08A" strokeOpacity={0.55 - i * 0.14} strokeWidth={4} strokeDasharray="14 12" />)}</SVG>}
      <AbsoluteFill style={{background: '#FFF2D6', opacity: flash * 0.85, mixBlendMode: 'screen'}} />
      {arg === 'raio' && <Legenda txt="ESTIMATIVA · DEPENDE DA ALTURA E DO TAMANHO DA PEDRA" />}
    </Foto>
  );
};
export const FreiF: React.FC<PF> = ({lt, d, arg = '0', k = 0}) => (
  <Foto src="frei_canoa" lt={lt} d={d} k={arg === '2' ? k + 3 : k} dx={arg === '1' ? -40 : 0} filtro={arg === '2' ? 'brightness(1.08) saturate(1.05)' : undefined}
    legenda={arg === '0' && k === 0 ? 'FREI FIDÉLIO D’ALVIANO · CAPUCHINHO (RECONSTITUIÇÃO)' : undefined} />
);
export const VilaF: React.FC<PF> = ({lt, d, t, arg = '0', k = 0}) => {
  if (arg === 'medo') return <Foto src="moradores_medo" lt={lt} d={d} k={k}><Po lt={lt} dens={90} /></Foto>;
  if (arg === 'missao' || arg === 'conta') return <Foto src="frei_escuta" lt={lt} d={d} k={arg === 'conta' ? k + 2 : k} />;
  return <Foto src="vila" lt={lt} d={d} k={arg === '1' ? k + 1 : arg === '2' ? k + 2 : k} legenda={arg === '0' && k === 0 ? 'VILA RIBEIRINHA · AMAZONAS, 1930 (RECONSTITUIÇÃO)' : undefined} />;
};
export const FamiliaF: React.FC<PF> = ({lt, d, k = 0}) => <Foto src="familia_correndo" lt={lt} d={d} k={k} dx={-30} />;
export const CadernoF: React.FC<PF> = ({lt, d, arg = 'fechado', k = 0}) => (
  <Foto src="caderno" lt={lt} d={d} k={k} filtro={arg === 'fecha' ? `brightness(${lerp(1, 0.55, K(lt, d * 0.5, d))})` : undefined} />
);
export const MeteoroF: React.FC<PF> = ({lt, d, t, arg = '0', k = 0}) => {
  const boom = Math.max(0, 1 - Math.abs(lt - d * 0.7) / 0.45);
  return <Foto src="tres_fogo_orbita" lt={lt} d={d} k={arg === '2' ? k + 2 : k}>
    <AbsoluteFill style={{background: 'radial-gradient(circle at 42% 38%, rgba(255,240,200,0.95), rgba(255,140,40,0.5) 18%, transparent 40%)', opacity: boom}} />
  </Foto>;
};
export const TresPedrasF: React.FC<PF> = ({lt, d, k = 0}) => <Foto src="tres_fogo_orbita" lt={lt} d={d} k={k + 1} legenda="CADA UMA ≈ DO TAMANHO DE UMA CASA (ESTIMATIVA DE BAILEY)" />;
export const TunguskaF: React.FC<PF> = ({lt, d, arg = 'leque', k = 0}) => (
  <Foto src="tunguska_ai" lt={lt} d={d} k={arg === 'centro' ? k + 2 : k} legenda={arg === 'centro' ? 'TUNGUSKA · NO CENTRO, ÁRVORES DE PÉ, SEM GALHOS' : 'TUNGUSKA, SIBÉRIA · 1908 · ÁRVORES DERRUBADAS (RECONSTITUIÇÃO)'} />
);
export const Rio1930F: React.FC<PF> = ({lt, d, k = 0}) => <Foto src="rio1930" lt={lt} d={d} k={k} legenda="RIO DE JANEIRO, CAPITAL · OUTUBRO DE 1930 (RECONSTITUIÇÃO)" />;
export const ViagemF: React.FC<PF> = ({lt, d, arg = '1', k = 0}) => <Foto src={arg === '2' ? 'navio' : 'barco_vapor'} lt={lt} d={d} k={k} dx={arg === '2' ? -50 : 50} legenda={arg === '2' ? 'DE NAVIO ATÉ A EUROPA' : 'DO JAVARI AO SOLIMÕES, DE BARCO'} />;
export const ArmaghF: React.FC<PF> = ({lt, d, arg = '0', k = 0}) => <Foto src="armagh" lt={lt} d={d} k={arg === '2' ? k + 2 : k} legenda={arg === '2' ? 'MARK BAILEY ESTUDA PEDRAS E COMETAS QUE CRUZAM A ÓRBITA DA TERRA' : 'OBSERVATÓRIO DE ARMAGH · IRLANDA DO NORTE · 1995 (ILUSTRAÇÃO)'} />;
export const BibliotecaF: React.FC<PF> = ({lt, d, k = 0}) => <Foto src="biblioteca" lt={lt} d={d} k={k} legenda="O JORNAL DE 1931 NO ARQUIVO (RECONSTITUIÇÃO)" />;
export const PerseidasF: React.FC<PF> = ({lt, d, arg = '0', k = 0}) => <Foto src="real_perseidas" lt={lt} d={d} k={arg === '2' ? k + 2 : k} legenda={arg === '2' ? 'PICO DAS PERSEIDAS · 12–13 DE AGOSTO' : 'CHUVA DE METEOROS PERSEIDAS (FOTO REAL)'} credito="Foto: Wikimedia Commons" />;
export const SateliteF: React.FC<PF> = ({lt, d, arg = '0', k = 0}) => (
  <Foto src="clareira" lt={lt} d={d} k={arg === 'circulo' ? 0 : k} z={arg === 'circulo' ? 0.03 : 0.06} legenda="IMAGEM AÉREA · RIO CURUÇÁ (ILUSTRAÇÃO)">
    {arg === 'circulo' && <Circulo lt={lt} x={960} y={560} r={250} txt="≈ 1 KM" />}
  </Foto>
);
export const ExpedicaoF: React.FC<PF> = ({lt, d, arg = '0', k = 0}) => arg === 'circulo'
  ? <Foto src="clareira" lt={lt} d={d} k={k + 1}><Lista lt={lt} x={1180} y={330} marca="✕" cor={COR.perigo} itens={['NENHUM FRAGMENTO', 'NENHUM VIDRO DERRETIDO', 'NENHUMA ROCHA DE CHOQUE']} /></Foto>
  : <Foto src="expedicao" lt={lt} d={d} k={k} legenda="EXPEDIÇÃO · JUNHO DE 1997 (RECONSTITUIÇÃO)" />;
export const MexicoF: React.FC<PF> = ({lt, d, k = 0}) => <Foto src="cientistas" lt={lt} d={d} k={k} legenda="CORDERO E POVEDA · UNAM, MÉXICO · 2011 (ILUSTRAÇÃO)" />;
export const FlorestaF: React.FC<PF> = ({lt, d, k = 0}) => <Foto src="aerea_hoje" lt={lt} d={d} k={k} legenda={`${Math.round(lerp(1930, 2026, KS(lt, 0, d)))} · A FLORESTA APAGA AS MARCAS`} />;
export const ChelyabinskF: React.FC<PF> = ({lt, d, arg = '0', k = 0}) => arg === '0'
  ? <Foto src="real_chelyabinsk" lt={lt} d={d} k={k} legenda="CHELYABINSK, RÚSSIA · 15/02/2013 · O RASTRO NO CÉU (FOTO REAL)" credito="Foto: Alex Alishevskikh · CC BY-SA 2.0" />
  : <Foto src="janela_neve" lt={lt} d={d} k={arg === 'vidro' ? k + 1 : k}>
      {arg === 'vidro' && <SVG>{Array.from({length: 60}, (_, i) => { const x = rnd(i) * 1920, y = 300 + rnd(i + 1) * 400 + lt * (180 + rnd(i + 2) * 260); return <path key={i} d={`M${x},${y} l10,-6 l-3,14 Z`} fill="#E0F0FF" opacity={0.85} />; })}</SVG>}
    </Foto>;
export const SertaoF: React.FC<PF> = ({lt, d, arg = '0', k = 0}) => {
  if (arg === 'telhado') return <Foto src="telhado" lt={lt} d={d} k={k} legenda="UMA PEDRA FUROU O TELHADO DE UM BAR (RECONSTITUIÇÃO)" />;
  return <Foto src="sertao" lt={lt} d={d} k={arg === 'caca' ? k + 2 : k} legenda={arg === '0' ? 'SANTA FILOMENA (PE) · 19 DE AGOSTO DE 2020 (RECONSTITUIÇÃO)' : undefined}>
    {arg === 'pedras' && <SVG>{Array.from({length: 8}, (_, i) => { const t0 = rnd(i) * d * 0.7; const kk = prog(lt, t0, t0 + 1.0); if (kk <= 0 || kk >= 1) return null; const x = 300 + rnd(i + 1) * 1300; return <g key={i}><line x1={x + 90} y1={lerp(-40, 760, kk) - 160} x2={x} y2={lerp(-40, 760, kk)} stroke="#F2EEE8" strokeWidth={5} opacity={0.7} /><circle cx={x} cy={lerp(-40, 760, kk)} r={9} fill="#2A2420" /></g>; })}</SVG>}
  </Foto>;
};
export const BramonF: React.FC<PF> = ({lt, d, k = 0}) => <Foto src="camera_ceu" lt={lt} d={d} k={k} legenda="BRAMON · CÂMERAS DE VOLUNTÁRIOS FILMAM O CÉU A NOITE TODA (ILUSTRAÇÃO)" />;
export const SonearF: React.FC<PF> = ({lt, d, arg = '0', k = 0}) => (
  <Foto src="observatorio_mg" lt={lt} d={d} k={arg === 'ceu' ? k + 3 : k} legenda={arg === 'ceu' ? 'DEZENAS DE ASTEROIDES PRÓXIMOS DA TERRA DESCOBERTOS' : 'SONEAR · OLIVEIRA (MG) · ASTRÔNOMOS AMADORES (ILUSTRAÇÃO)'}>
    {arg === 'ceu' && <SVG>{Array.from({length: 22}, (_, i) => { const kk = K(lt, i * 0.12, i * 0.12 + 0.3); const x = 200 + rnd(i) * 1500, y = 80 + rnd(i + 1) * 420; return <g key={i} opacity={kk}><circle cx={x} cy={y} r={5} fill="#FFD98A" /><circle cx={x} cy={y} r={16} fill="none" stroke={COR.ouro} strokeWidth={2} /></g>; })}</SVG>}
  </Foto>
);
export const BendegoF: React.FC<PF> = ({lt, d, arg = '0', k = 0}) => arg === 'fogo'
  ? <Foto src="museu_fogo" lt={lt} d={d} k={k} legenda="MUSEU NACIONAL · INCÊNDIO DE 2018 (RECONSTITUIÇÃO)" />
  : <Foto src="real_bendego" lt={lt} d={d} k={arg === '2' ? k + 2 : k} legenda="BENDEGÓ · MAIOR METEORITO DO BRASIL · MUSEU NACIONAL (FOTO REAL)" credito="Foto: Wikimedia Commons" />;
export const ChecklistF: React.FC<PF> = ({lt, d, arg = '0', k = 0}) => (
  <Foto src="meteorito_mao" lt={lt} d={d} k={arg === 'ima' ? k + 1 : k} filtro="brightness(0.85)">
    <Lista lt={arg === 'ima' ? lt + 3 : lt} x={1000} y={260} itens={['MAIS PESADO QUE UMA PEDRA COMUM', 'CASCA ESCURA POR FORA', 'MUITAS VEZES GRUDA NO ÍMÃ', 'FOTOGRAFE O LUGAR · PROCURE UM MUSEU']} />
  </Foto>
);
export const MataF: React.FC<PF> = ({lt, d, k = 0}) => <Foto src="aerea_hoje" lt={lt} d={d} k={k + 2} legenda="RIO CURUÇÁ · HOJE · NENHUMA MARCA (ILUSTRAÇÃO)" />;
